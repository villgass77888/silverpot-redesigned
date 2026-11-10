import { pageOg, OG_SIZE } from '@/lib/og';
import { routing } from '@/i18n/routing';

export const alt = 'Silverpot: Pressing aluminium in Ajman since 1997.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image() {
  return pageOg('Pressing aluminium in Ajman since 1997.', 'blue');
}
