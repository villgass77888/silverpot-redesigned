'use server';

import { handleSubmission } from '@/lib/forms/server';
import { contactSchema, type ActionResult } from '@/lib/forms/schemas';
import { emailCopy } from './shared';

/** Contact form (§7.10). */
export async function submitContact(input: unknown): Promise<ActionResult> {
  const locale = (input as { locale?: string })?.locale === 'ar' ? 'ar' : 'en';
  const c = await emailCopy(locale);
  return handleSubmission('contact', contactSchema, input, (d) => ({
    subject: `Website message: ${c.opt('topic', d.topic)} — ${d.name}`,
    title: 'New website message',
    rows: [
      { label: c.en('name'), value: d.name },
      { label: c.en('companyOptional'), value: d.company || '—' },
      { label: c.en('email'), value: d.email },
      { label: c.en('phoneOptional'), value: d.phone || '—' },
      { label: c.en('topic'), value: c.opt('topic', d.topic) },
      { label: c.en('message'), value: d.message },
      { label: 'Language', value: d.locale === 'ar' ? 'Arabic' : 'English' },
    ],
    items: [],
    replyTo: d.email,
    customer: { email: d.email, name: d.name },
    autoReply: c.autoReply(c.tf('messageSent'), c.tf('messageSent'), ''),
  }));
}
