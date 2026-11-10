import { site } from '@/data/site';
import type { Product } from '@/data/types';
import type { FaqItem } from '@/data/faq';
import { categoryBySlug } from '@/data/categories';
import { productHref } from '@/data/products';
import { plainDescription, productName, tx } from '@/lib/l10n';

/**
 * JSON-LD (§11.3). Only confirmed values. Never offers, aggregateRating or review
 * without real data. URLs are always the canonical production domain.
 */
const BASE = site.canonicalUrl;
const ORG_ID = `${BASE}/#organization`;

export function localePath(locale: string, path: string) {
  const clean = path === '/' ? '' : path;
  return locale === 'ar' ? `/ar${clean}` : clean || '/';
}
export const absolute = (locale: string, path: string) => `${BASE}${localePath(locale, path) === '/' ? '' : localePath(locale, path)}`;

export function organizationSchema() {
  const sameAs = Object.values(site.socials).filter(Boolean) as string[];
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Silverpot',
    legalName: site.legalName,
    alternateName: ['Silver Pot', 'SILVERPOT'],
    url: BASE,
    logo: `${BASE}/brand/silverpot-logo.png`,
    foundingDate: String(site.founded),
    foundingLocation: { '@type': 'Place', name: 'Ajman, United Arab Emirates' },
    email: site.email,
    telephone: site.phones.landline.schema,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ajman',
      addressCountry: 'AE',
      ...(site.address.confirmed && site.address.street ? { streetAddress: site.address.street } : {}),
    },
    contactPoint: [
      { '@type': 'ContactPoint', telephone: site.phones.landline.schema, contactType: 'sales', areaServed: 'AE' },
      { '@type': 'ContactPoint', telephone: site.phones.mobile.schema, contactType: 'customer service', areaServed: 'AE' },
    ],
    sameAs,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: 'Silverpot',
    inLanguage: ['en', 'ar'],
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(locale: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absolute(locale, it.path),
    })),
  };
}

export function itemListSchema(locale: string, list: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: list.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absolute(locale, productHref(p)),
      name: productName(p, locale),
    })),
  };
}

export function faqSchema(locale: string, items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: tx(f.q, locale),
      acceptedAnswer: { '@type': 'Answer', text: tx(f.a, locale) },
    })),
  };
}

const CATEGORY_LABEL: Record<Product['category'], string> = {
  containers: 'Aluminium Food Containers',
  platters: 'Aluminium Platters',
  foil: 'Aluminium Foil',
};

export function productSchema(locale: string, p: Product) {
  const url = absolute(locale, productHref(p));
  const props: object[] = [];
  const s = p.specs;
  if (s.lidIncluded.confirmed && s.lidIncluded.value) props.push({ '@type': 'PropertyValue', name: 'Lid', value: 'Included' });
  if (s.compartments.confirmed && s.compartments.value)
    props.push({ '@type': 'PropertyValue', name: 'Compartments', value: s.compartments.value });
  if (s.capacityMl.confirmed && s.capacityMl.value)
    props.push({ '@type': 'PropertyValue', name: 'Capacity', value: s.capacityMl.value, unitCode: 'MLT' });
  if (s.topDimensionsMm.confirmed && s.topDimensionsMm.value)
    props.push({
      '@type': 'PropertyValue',
      name: 'Top dimensions',
      value: `${s.topDimensionsMm.value.length} × ${s.topDimensionsMm.value.width}`,
      unitCode: 'MMT',
    });
  if (s.depthMm.confirmed && s.depthMm.value)
    props.push({ '@type': 'PropertyValue', name: 'Depth', value: s.depthMm.value, unitCode: 'MMT' });
  if (s.rollWidthCm.confirmed && s.rollWidthCm.value)
    props.push({ '@type': 'PropertyValue', name: 'Roll width', value: s.rollWidthCm.value, unitCode: 'CMT' });
  if (s.rollLengths.confirmed && s.rollLengths.value)
    for (const len of s.rollLengths.value)
      props.push({
        '@type': 'PropertyValue',
        name: 'Roll length',
        value: len.value,
        unitCode: len.unit === 'm' ? 'MTR' : 'FTK',
      });

  // Only confirmed copy goes into structured data (no review-mode extras).
  const fallback = p.fallback && !p.fallback.confirmed;
  const name = tx(fallback && p.fallback?.name ? p.fallback.name : p.name, locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name,
    sku: p.sku,
    ...(p.modelCode ? { mpn: p.modelCode } : {}),
    image: p.images.map((i) => `${BASE}${i.original}`),
    description: plainDescriptionConfirmed(p, locale),
    brand: { '@type': 'Brand', name: 'Silverpot' },
    manufacturer: { '@id': ORG_ID },
    category: CATEGORY_LABEL[p.category],
    material: 'Aluminium',
    url,
    ...(props.length ? { additionalProperty: props } : {}),
  };
}

function plainDescriptionConfirmed(p: Product, locale: string) {
  if (p.fallback && !p.fallback.confirmed && p.fallback.description) return tx(p.fallback.description, locale);
  const raw = tx(p.description, locale).replace('{{sizeWord}}', p.sizeWord?.confirmed ? tx(p.sizeWord.text, locale) : '');
  const claims = (p.pendingClaims ?? []).filter((c) => c.confirmed).map((c) => tx(c.text, locale)).join('');
  return (raw + claims).replace(/\s+/g, ' ').trim();
}

export function aboutPageSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: absolute(locale, '/about'),
    mainEntity: { '@id': ORG_ID },
  };
}

export function contactPageSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: absolute(locale, '/contact'),
    mainEntity: { '@id': ORG_ID },
  };
}

export { categoryBySlug, plainDescription };
