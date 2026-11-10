import { LEGACY_CATEGORY, LEGACY_PAGE_ID, LEGACY_PRODUCT } from '@/data/redirects';

export type LegacyResult = { type: 'redirect'; to: string } | { type: 'gone' } | { type: 'pass' };

/** WordPress-era params that, with an unknown value, are treated as spam/dead URLs. */
const DEAD_PARAMS = ['product', 'page_id', 'p', 'cat', 'attachment_id', 'author', 'product_cat'];

/**
 * Resolves the old WordPress query-string URLs that lived on "/" (§11.5).
 * Runs only for pathname === '/' with a query string.
 */
export function resolveLegacy(params: URLSearchParams): LegacyResult {
  const product = params.get('product');
  if (product !== null) {
    const to = LEGACY_PRODUCT[product.toLowerCase()];
    return to ? { type: 'redirect', to } : { type: 'gone' };
  }
  const cat = params.get('product_cat');
  if (cat !== null) {
    const to = LEGACY_CATEGORY[cat.toLowerCase()];
    return to ? { type: 'redirect', to } : { type: 'gone' };
  }
  const pageId = params.get('page_id');
  if (pageId !== null) {
    const to = LEGACY_PAGE_ID[pageId];
    return to ? { type: 'redirect', to } : { type: 'gone' };
  }
  if (params.get('post_type') === 'product') return { type: 'redirect', to: '/products' };
  const s = params.get('s');
  if (s !== null) {
    const q = s.trim().slice(0, 80);
    return { type: 'redirect', to: q ? `/products?q=${encodeURIComponent(q)}` : '/products' };
  }
  if (DEAD_PARAMS.some((k) => params.has(k))) return { type: 'gone' };
  return { type: 'pass' };
}

const WP_PATHS = [
  /^\/wp-admin/i,
  /^\/wp-login\.php/i,
  /^\/xmlrpc\.php/i,
  /^\/wp-json/i,
  /^\/feed/i,
  /^\/comments\/feed/i,
  /^\/wp-content\//i,
  /^\/wp-includes\//i,
];

export function isLegacyWordPressPath(pathname: string) {
  return WP_PATHS.some((re) => re.test(pathname));
}
