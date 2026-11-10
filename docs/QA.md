# QA report

Build tested on 2026-10-18: production build (`next build` + `next start`) with `NEXT_PUBLIC_REVIEW_MODE=false`, served locally with gzip. Lighthouse 13.5.0, mobile defaults (simulated Moto G Power on slow 4G), headless Microsoft Edge. Re-run these numbers against the deployed Vercel URL after launch (brotli, real CDN); see "How to re-run" at the end.

**Summary.**

- **Pass:** accessibility 100, Best Practices 100 and SEO 100 on every indexable page; CLS ≈ 0; TBT 20–80 ms; page weight, font and third-party budgets.
- **Not met:** Performance ≥ 95 and LCP ≤ 2.0 s (measured 87–95, simulated LCP 3.0–4.0 s), and home first-load JS ≤ 150 KB gzip (181 KB). Both are driven by the framework's JS runtime; see `docs/DECISIONS.md` §6.1.
- **Tests:** 156 Playwright tests pass, axe reports 0 violations on 16 templates, and all 46 legacy URLs behave correctly.

---

## 1. Lighthouse: the four §15 pages

Two runs each; both runs shown where they differ.

| Page | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | 89 | 100 | 100 | 100 | 1.5 s | 3.7 s | 39–44 ms | 0 |
| `/products` | 88 | 100 | 100 | 100 | 1.5 s | 3.9 s | 26–27 ms | 0 |
| `/products/containers/8325-aluminium-container-with-lid` | 87–89 | 100 | 100 | 100 | 1.4 s | 3.8–4.0 s | 23–27 ms | 0 |
| `/contact` | 93 | 100 | 100 | 100 | 1.1 s | 3.3 s | 31 ms | 0 |

Target: Performance ≥ 95, all other categories 100. **Accessibility, Best Practices and SEO pass. Performance doesn't.**

## 2. Lighthouse: other templates

| Page | Perf | A11y | BP | SEO | LCP | CLS | Note |
|---|---|---|---|---|---|---|---|
| `/products/containers` | 91 | 100 | 100 | 100 | 3.5 s | 0 | |
| `/products/foil/catering-foil-roll-45cm-150m-300m` | 91 | 100 | 100 | 100 | 3.4 s | 0 | no-photo product |
| `/about` | 93 | 100 | 100 | 100 | 3.3 s | 0 | |
| `/sustainability` | 93 | 100 | 100 | 100 | 3.1 s | 0 | |
| `/faq` | 95 | 100 | 100 | 100 | 3.0 s | 0 | |
| `/size-finder` | 94 | 100 | 100 | 100 | 3.1 s | 0 | |
| `/wholesale` | 88 | 100 | 100 | 100 | 3.8 s | 0 | form page |
| `/quote` | 90 | 100 | 100 | 66 | 3.7 s | 0.003 | SEO 66 = `noindex` by spec (§6.1) |
| `/ar` | 85 | 100 | 100 | 100 | 4.1 s | 0.002 | |
| `/ar/products` | 83 | 100 | 100 | 100 | 4.4 s | 0.001 | |
| `/ar/products/containers/8325-aluminium-container-with-lid` | 83 | 100 | 100 | 100 | 4.5 s | 0.007 | |

Arabic pages score lower because they load 7 font files (Arabic display and text, plus Bricolage for Latin runs).

## 3. §12.1 performance budgets

| Budget | Target | Measured | Status |
|---|---|---|---|
| LCP | ≤ 2.0 s | 3.7 s simulated (home); 0.3 s observed unthrottled | ✗ |
| INP | ≤ 200 ms | Not measurable in the lab; TBT 20–80 ms as a proxy | Check in Speed Insights after launch |
| CLS | ≤ 0.05 | 0.000 home, ≤ 0.007 everywhere | ✓ |
| First-load JS (home) | ≤ 150 KB gzip | 181 KB gzip / 157 KB brotli | ✗ |
| Total page weight (home, first view) | ≤ 900 KB | 498 KB | ✓ |
| Fonts on English first view | ≤ 4 files | 4 files, 91 KB | ✓ |
| Third-party requests on first view | 0 | 0 | ✓ |

**Why LCP and JS miss.** Lighthouse's simulation counts every script that downloads and runs before the observed paint. With all JS blocked, home scores **97** with LCP **2.6 s**. The Next.js 16 + React 19 runtime alone is about 140 KB gzip; the plainest page on the site is 166 KB. What was cut to get here is listed in `DECISIONS.md` §6.

**What changed during QA.**

| | Home Perf | Home LCP (sim.) | Home JS (transferred) | English fonts |
|---|---|---|---|---|
| Before the QA performance pass | 70–74 | 5.6–5.8 s | 329 KB | 169 KB |
| After | 89 | 3.7 s | 231 KB | 91 KB |

## 4. First-load JS per route

Measured from `.next/diagnostics/route-bundle-stats.json` (all first-load chunks, compressed at maximum level).

| Route | gzip | brotli |
|---|---|---|
| `/privacy`, `/terms`, `/sustainability`, 404 | 166 KB | 143 KB |
| `/faq` | 167 KB | 144 KB |
| `/about` | 168 KB | 145 KB |
| `/size-finder` | 178 KB | 154 KB |
| `/products/[category]/[slug]` | 179 KB | 154 KB |
| `/products`, `/products/[category]` | 181 KB | 156–157 KB |
| `/` | 181 KB | 157 KB |
| `/contact` | 216 KB | 187 KB |
| `/quote`, `/wholesale` | 224 KB | 194–195 KB |

Form pages add react-hook-form, zod and the resolver.

## 5. Automated tests

| Suite | Result |
|---|---|
| `pnpm test` (Playwright, desktop 1440×900 + mobile Pixel 7) | **156 passed**, 56 skipped (the redirect specs run in the desktop project only) |
| `tests/a11y.spec.ts` (axe, WCAG 2.2 AA) | **0 violations** on 16 templates, both viewports |
| `pnpm redirects:verify` | **All 46 legacy URLs** return the right 308 or 410 |
| `pnpm lint`, `pnpm typecheck` | Clean |
| `next build` | 163 static pages + 2 catalogue JSON files |

What the smoke tests cover:
- every page in English and Arabic returns 200, has one H1, the right `dir`, and no review highlights;
- all 26 product pages × 2 locales have valid Product JSON-LD, with no offers, ratings or reviews;
- unknown URLs return a real 404;
- search by full code, partial code, alias and words;
- URL-synced filters with back/forward;
- the quote list persists across reloads and builds the WhatsApp message;
- the map loads only on click;
- sitemap, robots and manifest.

## 6. §15 acceptance checklist

**Functional**
- [x] All 26 product pages build in EN and AR. Legacy URLs 308; unknown legacy params 410.
- [x] Filters and sort work, are URL-synced, and back/forward restores state.
- [x] Search finds full code, partial code ("83"), alias ("1120") and name words.
- [x] Add to quote works from cards, product pages and the size finder; the list persists, edits work, items can be removed.
- [ ] Forms: verified locally that an empty submit flags every required field and moves focus to the error summary, and that a valid submit passes the honeypot, rate limit and zod and reaches the email step. Without `RESEND_API_KEY`, a production build shows "We couldn't send your request just now…" with the WhatsApp fallback, rather than faking success; development builds log the email to the console. **Email delivery, the auto-reply and Turnstile need the production keys.**
- [x] The WhatsApp message follows §5.4 and is URL-encoded, Arabic included.
- [x] The map loads only after a click.
- [x] Review mode highlights every [CONFIRM] item; production shows none (asserted in the tests).

**Visual and brand**
- [x] Colours only from §3.3; hard shadows only on pressable elements.
- [x] No eyebrow labels, no monospace, no arrow-suffixed button labels.
- [x] Crinkle at most twice per page in content (see `DECISIONS.md` §3).
- [x] Every page captured at 390 and 1440 px in `docs/QA/` (list below).

**Motion**
- [x] One orchestrated moment per page; the hero sequence skips on repeat visits in a session.
- [x] Reduced motion renders everything at rest (global CSS override; FLIP and sticker drag check `prefers-reduced-motion`). A manual pass on Home, a product page, Quote and About is still recommended.

**Accessibility**
- [x] axe: 0 violations on all templates.
- [x] Keyboard-only flow (`/` → type "8325" → Enter → product page → Add to quote → Quote drawer → `/quote`) works. Every dialog traps focus, closes on Esc and returns focus to the control that opened it: quote drawer, search palette, gallery zoom, mobile menu and filter sheet. Focus return was broken (it fell to `<body>`) and was fixed during QA; see `DECISIONS.md` §7.
- [x] Contrast: all text pairs pass AA (axe colour-contrast).
- [ ] Manual screen-reader pass (VoiceOver iOS + NVDA) on Home, a product page and Quote: **not done.**

**Performance**
- [ ] Lighthouse mobile Performance ≥ 95: **87–93** on the four pages (§1). A11y, BP and SEO are 100.
- [ ] Home first-load JS ≤ 150 KB gzip: **181 KB** (§4).

**SEO**
- [x] Unique titles and descriptions on every page; canonical, hreflang (en, ar, x-default), sitemap and robots are correct.
- [ ] Rich Results Test: the JSON-LD for Product, BreadcrumbList, FAQPage, Organization and WebSite is generated and parses in the tests. **Run Google's Rich Results Test on the deployed URL.**
- [x] OG images render for Home, categories and products (prerendered at build).

**Content**
- [x] No lorem ipsum, and no text from the old site. New strings are logged in `docs/NEW_COPY.md`.
- [x] Arabic strings are marked `arReviewed: false`.

## 7. Screenshots (`docs/QA/`)

Full-page captures, JPEG, at 390×844 and 1440×900 for each of the 21 pages below (42 files). Below-fold `content-visibility` sections are forced visible for the capture only.

- **English:**
  - home (`home-*`);
  - `products`, `products_containers`, `products_platters`, `products_foil`;
  - the 8325 product page (with photo) and the 45 cm catering roll (no photo);
  - `size-finder`, `wholesale`, `about`, `sustainability`, `faq`, `contact`, `quote`, `privacy`, `terms`;
  - 404 (`no-such-page-*`).
- **Arabic:** `ar`, `ar_products`, the 8325 product page and `ar_contact`.

## 8. Environment notes

- **Headless GPU noise on this machine.** First paint sometimes waited 1–2 s on headless Edge's GPU process, with the same page alternating between 0.2 s and 1.5 s observed FCP. The numbers above come from stable runs where observed LCP was 0.1–0.4 s. Expect PageSpeed Insights on the live site to differ slightly.
- **Compression.** Local runs use gzip (`next start`). Vercel serves brotli, which is about 14% smaller for JS.

## How to re-run

```bash
NEXT_PUBLIC_REVIEW_MODE=false NEXT_PUBLIC_SITE_URL=http://localhost:3001 pnpm build
pnpm start --port 3001
BASE_URL=http://localhost:3001 pnpm test
BASE_URL=http://localhost:3001 pnpm redirects:verify
npx lighthouse@13.5.0 http://localhost:3001/ --chrome-flags="--headless=new" --view
pnpm tsx scripts/screenshots.ts --base http://localhost:3001 --out docs/QA --full / /products …
```
