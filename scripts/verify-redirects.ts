/**
 * Checks every legacy WordPress URL against a running deployment (§11.5, §14.4).
 * Use it after the DNS switch to prove old links land on the right pages.
 *
 *   pnpm redirects:verify                       (defaults to http://localhost:3001)
 *   pnpm redirects:verify https://silverpot.org
 */
import { LEGACY_CATEGORY, LEGACY_PAGE_ID, LEGACY_PRODUCT } from '../src/data/redirects';

const base = (process.argv[2] ?? 'http://localhost:3001').replace(/\/$/, '');

const expectRedirect: [string, string][] = [
  ...Object.entries(LEGACY_PRODUCT).map(([k, v]) => [`/?product=${k}`, v] as [string, string]),
  ...Object.entries(LEGACY_CATEGORY).map(([k, v]) => [`/?product_cat=${k}`, v] as [string, string]),
  ...Object.entries(LEGACY_PAGE_ID).map(([k, v]) => [`/?page_id=${k}`, v] as [string, string]),
  ['/?post_type=product', '/products'],
  ['/?s=8325', '/products?q=8325'],
];
const expectGone = [
  '/?product=online-casino-bonus',
  '/?p=123456',
  '/?page_id=99999',
  '/?author=1',
  '/wp-login.php',
  '/wp-admin',
  '/xmlrpc.php',
  '/feed',
  '/wp-content/uploads/2022/02/IMG_5054-1.jpg',
];

async function main() {
  let failures = 0;
  for (const [from, to] of expectRedirect) {
    const res = await fetch(base + from, { redirect: 'manual' });
    const loc = res.headers.get('location');
    const got = loc ? new URL(loc, base).pathname + new URL(loc, base).search : '';
    const ok = res.status === 308 && got === to;
    if (!ok) failures++;
    console.log(`${ok ? '✓' : '✗'} ${res.status} ${from} → ${got || '(none)'}${ok ? '' : `  expected 308 → ${to}`}`);
  }
  for (const from of expectGone) {
    const res = await fetch(base + from, { redirect: 'manual' });
    const ok = res.status === 410;
    if (!ok) failures++;
    console.log(`${ok ? '✓' : '✗'} ${res.status} ${from}${ok ? '' : '  expected 410'}`);
  }
  console.log(failures ? `\n${failures} failed` : `\nAll ${expectRedirect.length + expectGone.length} legacy URLs behave correctly.`);
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
