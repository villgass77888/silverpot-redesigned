'use server';

import { handleSubmission, itemLines } from '@/lib/forms/server';
import { wholesaleSchema, type ActionResult } from '@/lib/forms/schemas';
import { emailCopy } from './shared';

/** Wholesale / distributor quote form (§7.6). */
export async function submitWholesale(input: unknown): Promise<ActionResult> {
  const locale = (input as { locale?: string })?.locale === 'ar' ? 'ar' : 'en';
  const c = await emailCopy(locale);
  return handleSubmission('wholesale', wholesaleSchema, input, (d) => {
    const items = itemLines(d.items);
    return {
      subject: `Wholesale enquiry: ${d.company}`,
      title: 'New wholesale enquiry',
      rows: [
        { label: c.en('company'), value: d.company },
        { label: c.en('contactName'), value: d.name },
        { label: c.en('email'), value: d.email },
        { label: c.en('phoneOptional'), value: d.phone },
        { label: c.en('businessType'), value: c.opt('business', d.businessType) },
        { label: c.en('emirate'), value: c.opt('emirate', d.emirate) },
        { label: c.en('volume'), value: d.volume ? c.opt('volume', d.volume) : '—' },
        { label: c.en('interests'), value: d.interests?.length ? d.interests.map((i) => c.opt('interests', i)).join(', ') : '—' },
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
