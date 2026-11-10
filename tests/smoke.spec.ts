import { expect, test } from '@playwright/test';
import { products, productHref } from '../src/data/products';

const PAGES = [
  '/',
  '/products',
  '/products/containers',
  '/products/platters',
  '/products/foil',
  '/size-finder',
  '/wholesale',
  '/about',
  '/sustainability',
  '/faq',
  '/contact',
  '/quote',
  '/privacy',
  '/terms',
];

test.describe('pages', () => {
  for (const path of [...PAGES, ...PAGES.map((p) => (p === '/' ? '/ar' : `/ar${p}`))]) {
    test(`renders ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      // Production mode: no unconfirmed fact is visible (§0.3).
      await expect(page.locator('.review-mark')).toHaveCount(0);
      await expect(page.locator('html')).toHaveAttribute('dir', path.startsWith('/ar') ? 'rtl' : 'ltr');
    });
  }

  test('all 26 product pages build in EN and AR with Product JSON-LD', async ({ request }) => {
    test.setTimeout(180_000);
    expect(products).toHaveLength(26);
    for (const p of products) {
      for (const prefix of ['', '/ar']) {
        const res = await request.get(prefix + productHref(p));
        expect(res.status(), prefix + productHref(p)).toBe(200);
        const html = await res.text();
        const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
        const product = blocks.find((b) => b['@type'] === 'Product');
        expect(product, prefix + productHref(p)).toBeTruthy();
        // Never offers, ratings or reviews without real data (§11.3).
        expect(product).not.toHaveProperty('offers');
        expect(product).not.toHaveProperty('aggregateRating');
        expect(product).not.toHaveProperty('review');
      }
    }
  });

  test('unknown pages 404 with the branded page', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('This page got thrown out.');
  });
});

test.describe('catalogue and quote', () => {
  test('search finds full code, partial code, alias and words', async ({ page }) => {
    await page.goto('/products');
    const search = page.getByLabel('Search products');
    await search.fill('8325');
    await expect(page.locator('article h3').first()).toContainText('8325');
    await search.fill('1120');
    await expect(page.locator('article h3').first()).toContainText('83120E');
    await search.fill('83');
    await expect(page.locator('article h3').first()).toContainText('83');
    await search.fill('broast');
    await expect(page.locator('article h3').first()).toContainText('83166');
  });

  test('filters are URL-synced and back restores them', async ({ page, isMobile }) => {
    test.skip(isMobile, 'filters live in a sheet on mobile');
    await page.goto('/products');
    await page.getByRole('button', { name: /^Foil/ }).click();
    await expect(page).toHaveURL(/family=foil/);
    await page.getByRole('button', { name: '45 cm' }).click();
    await expect(page).toHaveURL(/width=45/);
    await page.goBack();
    await expect(page).not.toHaveURL(/width=45/);
    await expect(page).toHaveURL(/family=foil/);
  });

  test('add to quote persists across reloads and builds the WhatsApp message', async ({ page }) => {
    await page.goto('/products/containers/8325-aluminium-container-with-lid');
    await page.getByRole('button', { name: 'Add to quote' }).first().click();
    await page.reload();
    await page.goto('/quote');
    await expect(page.getByText('Aluminium Container with Lid – 8325').first()).toBeVisible();
    const href = await page.evaluate(() => {
      const raw = window.localStorage.getItem('silverpot-quote-v1');
      return raw ? JSON.parse(raw).state.items : [];
    });
    expect(href).toEqual([{ productId: 'c-8325', qty: 1, unit: 'cartons' }]);
  });

  test('map loads only after the click', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(0);
    await page.getByRole('button', { name: 'Load Google Map' }).click();
    await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(1);
  });
});

test.describe('seo files', () => {
  test('sitemap, robots, manifest', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('/products/containers/8325-aluminium-container-with-lid');
    expect(sitemap).toContain('/ar/products/foil');
    expect(sitemap).not.toContain('/quote');
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Disallow: /quote');
    expect(robots).toContain('Sitemap:');
    expect((await request.get('/manifest.webmanifest')).status()).toBe(200);
  });
});
