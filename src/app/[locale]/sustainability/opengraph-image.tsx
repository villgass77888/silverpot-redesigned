import { pageOg, OG_SIZE } from '@/lib/og';
import { routing } from '@/i18n/routing';

export const alt = 'Silverpot: Use once. Recycle forever.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image() {
  return pageOg('Use once. Recycle forever.', 'red');
}
