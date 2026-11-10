import type { Metadata } from 'next';
import { site } from '@/data/site';

/** Path for a locale (English unprefixed, Arabic under /ar). */
export function localizedPath(locale: string, path: string) {
  const p = path === '/' ? '' : path;
  if (locale === 'ar') return `/ar${p}`;
  return p || '/';
}

/**
 * Per-page metadata (§11.1, §11.4): absolute title, description, self-canonical
 * per locale (no query, no trailing slash), hreflang en/ar/x-default, OG + Twitter.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex,
  images,
}: {
  locale: string;
  path: string;
  title: string;
  description?: string;
  noindex?: boolean;
  images?: string[];
}): Metadata {
  const canonical = localizedPath(locale, path);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        en: localizedPath('en', path),
        ar: localizedPath('ar', path),
        'x-default': localizedPath('en', path),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Silverpot',
      locale: locale === 'ar' ? 'ar_AE' : 'en_AE',
      type: 'website',
      ...(images ? { images } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const SITE_URL = site.url;
