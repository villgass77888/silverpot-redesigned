import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** §12.2: automated axe checks on every page template (WCAG 2.2 AA). */
const TEMPLATES = [
  '/',
  '/products',
  '/products/containers',
  '/products/containers/8576-3-compartment-aluminium-container-with-lid',
  '/products/foil/catering-foil-roll-45cm-150m-300m',
  '/size-finder',
  '/wholesale',
  '/about',
  '/sustainability',
  '/faq',
  '/contact',
  '/quote',
  '/privacy',
  '/this-page-does-not-exist',
  '/ar',
  '/ar/products/containers/8325-aluminium-container-with-lid',
];

for (const path of TEMPLATES) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(' ')}`);
    expect(summary, summary.join('\n')).toEqual([]);
  });
}
