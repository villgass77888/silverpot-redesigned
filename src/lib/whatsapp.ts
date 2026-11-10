/**
 * WhatsApp hand-off (§5.4). Messages are always composed in English-first trade
 * format; Arabic UI strings are passed in by callers when the locale is ar.
 */
const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '971508494521'; // [CONFIRM WhatsApp number]

export function waHref(message?: string) {
  return message ? `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}` : `https://wa.me/${NUMBER}`;
}

export interface WaLine {
  code: string | null;
  name: string;
  qty: number;
  unitLabel: string;
  note?: string;
}

export interface WaQuoteStrings {
  greeting: string; // "Hi Silverpot! I'd like a quote for:"
  deliveryTo: string; // "Delivery to"
  name: string; // "Name"
  company: string; // "Company"
  neededBy: string; // "Needed by"
  footer: string; // "(sent from silverpot.org)"
}

export const WA_EN: WaQuoteStrings = {
  greeting: 'Hi Silverpot! I’d like a quote for:',
  deliveryTo: 'Delivery to',
  name: 'Name',
  company: 'Company',
  neededBy: 'Needed by',
  footer: '(sent from silverpot.org)',
};

export const WA_AR: WaQuoteStrings = {
  greeting: 'مرحباً سيلفربوت! أود الحصول على عرض سعر لـ:',
  deliveryTo: 'التوصيل إلى',
  name: 'الاسم',
  company: 'الشركة',
  neededBy: 'مطلوب قبل',
  footer: '(أُرسلت من silverpot.org)',
};

export const waStrings = (locale: string) => (locale === 'ar' ? WA_AR : WA_EN);

export function buildQuoteMessage(
  lines: WaLine[],
  extra: { delivery?: string; name?: string; company?: string; neededBy?: string },
  s: WaQuoteStrings = WA_EN,
) {
  const items = lines.map((l) => {
    const label = l.code ? `${l.code} – ${l.name}` : l.name;
    const note = l.note ? ` (${l.note})` : '';
    return `• ${label} — ${l.qty} ${l.unitLabel}${note}`;
  });
  const out = [s.greeting, ...items];
  if (extra.delivery) out.push(`${s.deliveryTo}: ${extra.delivery}`);
  if (extra.neededBy) out.push(`${s.neededBy}: ${extra.neededBy}`);
  const who = [extra.name && `${s.name}: ${extra.name}`, extra.company && `${s.company}: ${extra.company}`]
    .filter(Boolean)
    .join(' | ');
  if (who) out.push(who);
  out.push(s.footer);
  return out.join('\n');
}
