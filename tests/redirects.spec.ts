import { expect, test } from '@playwright/test';
import { LEGACY_CATEGORY, LEGACY_PAGE_ID, LEGACY_PRODUCT } from '../src/data/redirects';

/** §11.5: every legacy key → clean 308; unknown legacy params and WordPress paths → 410. */
test.describe('legacy redirects', () => {
  test.skip(({ isMobile }) => isMobile, 'HTTP-only checks; run once on desktop');

  const cases: [string, string][] = [
    ...Object.entries(LEGACY_PRODUCT).map(([k, v]) => [`/?product=${k}`, v] as [string, string]),
    ...Object.entries(LEGACY_CATEGORY).map(([k, v]) => [`/?product_cat=${k}`, v] as [string, string]),
    ...Object.entries(LEGACY_PAGE_ID).map(([k, v]) => [`/?page_id=${k}`, v] as [string, string]),
    ['/?post_type=product', '/products'],
    ['/?s=8325', '/products?q=8325'],
  ];

  for (const [from, to] of cases) {
    test(`308 ${from}`, async ({ request, baseURL }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      // Location may be relative (RFC 7231); resolve before comparing.
      expect(new URL(res.headers()['location'], baseURL).toString()).toBe(new URL(to, baseURL).toString());
    });
  }

  for (const spam of ['/?product=best-online-casino-bonus', '/?page_id=99999', '/?p=4815162342', '/?cat=apuestas', '/?author=1', '/?attachment_id=77']) {
    test(`410 ${spam}`, async ({ request }) => {
      const res = await request.get(spam, { maxRedirects: 0 });
      expect(res.status()).toBe(410);
    });
  }

  for (const path of ['/wp-login.php', '/wp-admin', '/wp-admin/', '/xmlrpc.php', '/wp-json/wp/v2/users', '/feed', '/feed/', '/comments/feed', '/wp-content/uploads/2022/02/IMG_5054-1.jpg']) {
    test(`410 ${path}`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status()).toBe(410);
    });
  }

  test('trailing slashes collapse in one 308', async ({ request, baseURL }) => {
    const res = await request.get('/about/', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(new URL(res.headers()['location'], baseURL).pathname).toBe('/about');
  });

  test('unrelated query strings pass through', async ({ request }) => {
    const res = await request.get('/?utm_source=newsletter', { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });

  test('filtered product lists are noindex', async ({ request }) => {
    const res = await request.get('/products?family=foil', { maxRedirects: 0 });
    expect(res.headers()['x-robots-tag']).toContain('noindex');
  });
});
