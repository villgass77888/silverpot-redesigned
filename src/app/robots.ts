import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

/** §11.4: allow /, disallow /quote, /ar/quote, /dev, /api. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/quote', '/ar/quote', '/dev', '/ar/dev', '/api'] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
