import { z } from 'zod';

// Skip zod's eval-based fast path: its feature probe (Function("")) trips the CSP (§5.8).
z.config({ jitless: true });

/**
 * Form schemas (§5.5), shared by the client (react-hook-form) and the Server Actions.
 * Error messages are translation keys under `forms.errors.*`, so every message is
 * specific ("Enter a phone number with country code…"), never "Invalid input".
 */
export const BUSINESS_TYPES = ['restaurant', 'cloud-kitchen', 'caterer', 'hotel', 'bakery', 'distributor', 'retail', 'other'] as const;
export const EMIRATES = ['abu-dhabi', 'dubai', 'sharjah', 'ajman', 'umm-al-quwain', 'ras-al-khaimah', 'fujairah', 'outside'] as const;
export const VOLUMES = ['under-50', '50-200', '200-1000', '1000-plus'] as const;
export const TOPICS = ['quote', 'product', 'distributor', 'other'] as const;
export const INTERESTS = ['containers', 'platters', 'foil'] as const;

const text = (key: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, key)
    .max(max, 'tooLong');

const phone = z
  .string()
  .trim()
  .refine((v) => /^\+[1-9]\d{7,14}$/.test(v.replace(/[\s().-]/g, '')), 'phone');

const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\+[1-9]\d{7,14}$/.test(v.replace(/[\s().-]/g, '')), 'phone')
  .optional();

const email = z.string().trim().max(160, 'tooLong').email('email');
const consent = z.literal(true, { error: 'consent' });
const pick = <T extends readonly [string, ...string[]]>(values: T, key: string) =>
  z.enum(values, { error: key });

/** Today in Dubai as YYYY-MM-DD (the "Needed by" lower bound). */
export function todayDubai() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai' }).format(new Date());
}
const neededBy = z
  .string()
  .trim()
  .refine((v) => v === '' || (/^\d{4}-\d{2}-\d{2}$/.test(v) && v >= todayDubai()), 'date')
  .optional();

export const quoteItemSchema = z.object({
  productId: z.string().min(1).max(40),
  qty: z.number().int().min(1).max(9999),
  unit: z.enum(['cartons', 'pieces']),
  note: z.string().max(300).optional(),
});

/** Hidden anti-spam fields, present on every form. */
const guard = {
  website: z.string().max(0).optional(), // honeypot: must stay empty
  token: z.string().max(4096).optional(), // Turnstile
  locale: z.enum(['en', 'ar']).default('en'),
};

export const quoteSchema = z.object({
  company: text('company'),
  name: text('name'),
  email,
  phone,
  businessType: pick(BUSINESS_TYPES, 'businessType'),
  deliveryEmirate: pick(EMIRATES, 'deliveryEmirate'),
  neededBy,
  volume: z.enum(VOLUMES).optional().or(z.literal('')),
  message: z.string().trim().max(2000, 'tooLong').optional(),
  items: z.array(quoteItemSchema).min(1, 'items').max(60),
  consent,
  ...guard,
});

export const wholesaleSchema = z.object({
  company: text('company'),
  name: text('name'),
  email,
  phone,
  businessType: pick(BUSINESS_TYPES, 'businessType'),
  emirate: pick(EMIRATES, 'emirate'),
  volume: z.enum(VOLUMES).optional().or(z.literal('')),
  interests: z.array(z.enum(INTERESTS)).max(3).optional(),
  message: z.string().trim().max(2000, 'tooLong').optional(),
  items: z.array(quoteItemSchema).max(60).optional(),
  consent,
  ...guard,
});

export const contactSchema = z.object({
  name: text('name'),
  company: z.string().trim().max(120, 'tooLong').optional(),
  email,
  phone: optionalPhone,
  topic: pick(TOPICS, 'topic'),
  message: text('message', 2000),
  consent,
  ...guard,
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type WholesaleInput = z.input<typeof wholesaleSchema>;
export type ContactInput = z.input<typeof contactSchema>;

export type ActionResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: 'rateLimited' | 'spam' | 'sendFailed' };

/** Flatten zod issues to { field: errorKey } (first issue per field). */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
