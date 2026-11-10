import 'server-only';
import { getTranslations } from 'next-intl/server';
import { site } from '@/data/site';

/** English option labels for the sales email, and localised auto-reply copy. */
export async function emailCopy(locale: 'en' | 'ar') {
  const en = await getTranslations({ locale: 'en', namespace: 'forms' });
  const tq = await getTranslations({ locale, namespace: 'quote' });
  const tf = await getTranslations({ locale, namespace: 'forms' });
  const opt = (group: string, key?: string) => (key ? en(`options.${group}.${key}`) : '—');
  const reply = site.responseTimeHours ? ` ${tq('responseTime', { hours: site.responseTimeHours })}` : '';
  return {
    en,
    opt,
    autoReply: (subject: string, title: string, intro: string) => ({
      subject,
      title,
      intro: intro + reply,
      footer: `${site.legalName} · ${site.phones.landline.display} · WhatsApp ${site.phones.mobile.display} · ${site.email}`,
      dir: (locale === 'ar' ? 'rtl' : 'ltr') as 'ltr' | 'rtl',
    }),
    tq,
    tf,
  };
}
