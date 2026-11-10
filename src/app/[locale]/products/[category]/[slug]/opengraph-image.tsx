import { productOg, OG_SIZE } from '@/lib/og';
import { getProduct, products } from '@/data/products';
import { routing } from '@/i18n/routing';
import { productName, productTagline } from '@/lib/l10n';

export const alt = 'Silverpot product';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => products.map((p) => ({ locale, category: p.category, slug: p.slug })));
}

export default async function Image({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const p = getProduct(category, slug);
  if (!p) return productOg({ code: null, name: 'Silverpot', tagline: 'Light metal. Heavy duty.' });
  return productOg({ code: p.modelCode, name: productName(p, 'en'), tagline: productTagline(p, 'en'), image: p.images[0]?.original });
}
