import { pageOg, OG_SIZE } from '@/lib/og';
import { routing } from '@/i18n/routing';

export const alt = 'Silverpot: By the carton. By the pallet. By Thursday?';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image() {
  return pageOg('By the carton. By the pallet. By Thursday?', 'blue');
}
