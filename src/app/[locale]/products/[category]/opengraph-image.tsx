import { pageOg, OG_SIZE } from '@/lib/og';
import { categories, categoryBySlug, isCategorySlug } from '@/data/categories';
import { routing } from '@/i18n/routing';

export const alt = 'Silverpot aluminium product family';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => categories.map((c) => ({ locale, category: c.slug })));
}

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = isCategorySlug(category) ? categoryBySlug.get(category)! : null;
  return pageOg(cat ? cat.name.en : 'Silverpot products', cat?.tone ?? 'yellow');
}
