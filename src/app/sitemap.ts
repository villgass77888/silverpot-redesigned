import type { MetadataRoute } from 'next';
import { products, productHref } from '@/data/products';
import { categories } from '@/data/categories';
import { site } from '@/data/site';
import { localizedPath } from '@/lib/seo';

const STATIC = ['/', '/products', '/size-finder', '/wholesale', '/about', '/sustainability', '/faq', '/contact', '/privacy', '/terms'];

/** Every indexable URL in both locales, with hreflang alternates (§11.4). /quote is excluded (noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [...STATIC, ...categories.map((c) => `/products/${c.slug}`), ...products.map((p) => productHref(p))];
  const abs = (p: string) => `${site.url}${p === '/' ? '' : p}`;
  return paths.flatMap((path) =>
    (['en', 'ar'] as const).map((locale) => ({
      url: abs(localizedPath(locale, path)),
      lastModified: now,
      changeFrequency: path.startsWith('/products/') ? ('monthly' as const) : ('weekly' as const),
      priority: path === '/' ? 1 : path.split('/').length === 3 ? 0.8 : path.startsWith('/products') ? 0.7 : 0.6,
      alternates: {
        languages: {
          en: abs(localizedPath('en', path)),
          ar: abs(localizedPath('ar', path)),
          'x-default': abs(localizedPath('en', path)),
        },
      },
    })),
  );
}
