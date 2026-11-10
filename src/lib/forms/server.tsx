import 'server-only';
import { headers } from 'next/headers';
import type { z } from 'zod';
import { render } from '@react-email/components';
import { LeadEmail, plainText, type EmailItem, type EmailRow } from '@/emails/LeadEmail';
import { rateLimit } from '../ratelimit';
import { fieldErrors, type ActionResult } from './schemas';
import { productById } from '@/data/products';
import { site } from '@/data/site';

type Built = {
  subject: string;
  title: string;
  rows: EmailRow[];
  items: EmailItem[];
  replyTo: string;
  customer: { email: string; name: string };
  autoReply: { subject: string; title: string; intro: string; footer: string; dir: 'ltr' | 'rtl' };
};

async function clientIp() {
  const h = await headers();
  return (h.get('x-forwarded-for')?.split(',')[0] ?? h.get('x-real-ip') ?? 'unknown').trim();
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured (local/dev): honeypot + rate limit still apply
  if (!token) return false;
  try {
    const body = new FormData();
    body.append('secret', secret);
    body.append('response', token);
    if (ip !== 'unknown') body.append('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch {
    return false;
  }
}

async function sendMail(to: string, subject: string, html: string, text: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`\n[email:dev] To: ${to}\nSubject: ${subject}\n${text}\n`);
      return true;
    }
    console.error('[email] RESEND_API_KEY is not set');
    return false;
  }
  const { Resend } = await import('resend');
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'Silverpot <quotes@silverpot.org>',
    to,
    subject,
    html,
    text,
    ...(replyTo ? { replyTo } : {}),
  });
  if (error) console.error('[email] send failed', error);
  return !error;
}

/**
 * Shared Server Action pipeline (§5.5): honeypot → rate limit → Turnstile → Zod →
 * email to SALES_EMAIL → auto-reply to the customer → { ok } or field errors.
 */
export async function handleSubmission<S extends z.ZodType>(
  kind: 'quote' | 'contact' | 'wholesale',
  schema: S,
  input: unknown,
  build: (data: z.output<S>) => Built,
): Promise<ActionResult> {
  const raw = (input ?? {}) as Record<string, unknown>;
  // Bots fill the honeypot: pretend success, send nothing.
  if (typeof raw.website === 'string' && raw.website.length > 0) return { ok: true };

  const ip = await clientIp();
  if (!(await rateLimit(`${kind}:${ip}`))) return { ok: false, formError: 'rateLimited' };
  if (!(await verifyTurnstile(typeof raw.token === 'string' ? raw.token : undefined, ip)))
    return { ok: false, formError: 'spam' };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) };

  const mail = build(parsed.data);
  const footer = `${site.legalName} · Ajman, UAE · ${site.phones.landline.display} · silverpot.org`;

  const salesProps = { preview: mail.subject, title: mail.title, rows: mail.rows, items: mail.items, footer };
  const [salesHtml, replyHtml] = await Promise.all([
    render(<LeadEmail {...salesProps} />),
    render(
      <LeadEmail
        preview={mail.autoReply.subject}
        title={mail.autoReply.title}
        intro={mail.autoReply.intro}
        items={mail.items}
        dir={mail.autoReply.dir}
        footer={mail.autoReply.footer}
      />,
    ),
  ]);

  const sales = process.env.SALES_EMAIL ?? site.email;
  const sent = await sendMail(sales, mail.subject, salesHtml, plainText(mail.title, mail.rows, mail.items, footer), mail.replyTo);
  if (!sent) return { ok: false, formError: 'sendFailed' };
  // The auto-reply is best-effort: the lead is already with sales.
  await sendMail(
    mail.customer.email,
    mail.autoReply.subject,
    replyHtml,
    plainText(mail.autoReply.title, [], mail.items, mail.autoReply.footer, mail.autoReply.intro),
  );
  return { ok: true };
}

/** Resolve quote items to sales-readable lines (English names + model codes). */
export function itemLines(items: { productId: string; qty: number; unit: 'cartons' | 'pieces'; note?: string }[] = []) {
  return items.flatMap((i) => {
    const p = productById.get(i.productId);
    if (!p) return [];
    const name = p.fallback && !p.fallback.confirmed && p.fallback.shortName ? p.fallback.shortName.en : p.shortName.en;
    return [{ code: p.modelCode, name, qty: i.qty, unit: i.qty === 1 ? i.unit.replace(/s$/, '') : i.unit, note: i.note || undefined }];
  });
}
