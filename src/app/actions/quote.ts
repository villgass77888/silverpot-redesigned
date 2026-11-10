'use server';

import { handleSubmission, itemLines } from '@/lib/forms/server';
import { quoteSchema, type ActionResult } from '@/lib/forms/schemas';
import { emailCopy } from './shared';

/** "Send quote request" from /quote (§7.11). */
export async function submitQuote(input: unknown): Promise<ActionResult> {
  const locale = (input as { locale?: string })?.locale === 'ar' ? 'ar' : 'en';
  const c = await emailCopy(locale);
  return handleSubmission('quote', quoteSchema, input, (d) => {
    const items = itemLines(d.items);
    return {
      subject: `Quote request: ${d.company} (${items.length} item${items.length === 1 ? '' : 's'})`,
      title: 'New quote request',
      rows: [
        { label: c.en('company'), value: d.company },
        { label: c.en('contactName'), value: d.name },
        { label: c.en('email'), value: d.email },
        { label: c.en('phoneOptional'), value: d.phone },
        { label: c.en('businessType'), value: c.opt('business', d.businessType) },
        { label: c.en('deliveryEmirate'), value: c.opt('emirate', d.deliveryEmirate) },
        { label: c.en('neededBy'), value: d.neededBy || '—' },
        { label: c.en('volume'), value: d.volume ? c.opt('volume', d.volume) : '—' },
        { label: c.en('message'), value: d.message || '—' },
        { label: 'Language', value: d.locale === 'ar' ? 'Arabic' : 'English' },
      ],
      items,
      replyTo: d.email,
      customer: { email: d.email, name: d.name },
      autoReply: c.autoReply(c.tq('success'), c.tq('success'), c.tq('successSub')),
    };
  });
}
