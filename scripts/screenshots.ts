/**
 * Phase-check screenshots (§0.2): captures pages at 390×844 and 1440×900.
 * Uses the system Microsoft Edge (or Chrome) via Playwright channels — no browser download.
 *
 *   pnpm tsx scripts/screenshots.ts [--base http://localhost:3000] [--out docs/QA] [--full] [--reduced] path1 path2 …
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name: string, def: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : def;
};
const flag = (name: string) => {
  const i = args.indexOf(name);
  if (i >= 0) args.splice(i, 1);
  return i >= 0;
};
const base = opt('--base', 'http://localhost:3000');
const out = opt('--out', 'docs/QA');
const full = flag('--full');
const reduced = flag('--reduced');
const only = opt('--only', '');
const paths = args.length ? args : ['/'];

const VIEWPORTS = [
  { name: '390', width: 390, height: 844, mobile: true },
  { name: '1440', width: 1440, height: 900, mobile: false },
].filter((v) => !only || v.name === only);

async function main() {
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' });
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.error(`  [pageerror] ${e.message}`));
    page.on('console', (m) => {
      if (m.type() === 'error') console.error(`  [console] ${m.text().slice(0, 300)}`);
    });
    for (const p of paths) {
      const url = base + p;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 });
      await page.waitForTimeout(1800);
      if (full) {
        // Scroll through so lazy content and in-view effects render.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          window.scrollTo(0, 0);
        });
        // content-visibility:auto skips painting off-screen sections, and a full-page capture
        // is mostly off-screen. Capture-only override; the site itself keeps the optimisation.
        await page.addStyleTag({ content: '.cv-auto{content-visibility:visible!important}' });
        await page.waitForTimeout(800);
      }
      const name = `${(p === '/' ? 'home' : p.replace(/^\//, '').replace(/[/?=&]/g, '_'))}-${vp.name}${reduced ? '-reduced' : ''}.png`;
      await page.screenshot({ path: path.join(out, name), fullPage: full });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      console.log(`✓ ${name}${overflow > 0 ? `  ⚠ horizontal overflow ${overflow}px` : ''}`);
    }
    await ctx.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
