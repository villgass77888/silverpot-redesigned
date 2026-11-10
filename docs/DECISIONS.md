# Decisions log

Where the build differs from `docs/MASTER_PROMPT.md`, or where the spec left a choice open, it's recorded here (§0.1 rule 8: "Framework reality wins"). Each entry says what was done, why, and how to undo it if you disagree.

Stack as built: Next.js 16.4.2 (App Router, Turbopack), React 19.3.1, TypeScript 6.0.3, Tailwind CSS 4.3, next-intl 4.14, zod 4, pnpm 12.

---

## 1. Needs a decision from the design lead

The spec's appendix asks for sign-off before deviating from §3 (design system) or §4 (motion). Two changes touch those sections. Both keep the specified behaviour and look; only the implementation differs. Both are easy to revert.

1. **The `motion` library has been removed (§4.6, §5.1).** The spec asks for `motion` with `LazyMotion` and `m.*` components. Only two places used it: the catalogue's FLIP reorder and the sticker wall drag. Even lazily loaded, it put about 23 KB (gzip) on `/products` and home, against a first-load budget that the framework alone nearly fills (see §6.1).
   - FLIP reorder: now about 40 lines of Web Animations API in `Grid` (`src/components/catalogue/Catalogue.tsx`). Cards glide from old to new slots with a springy ease, and new cards pop in. It runs only after a visitor changes a filter, and never with reduced motion.
   - Sticker drag: now plain pointer events with capture, clamped to the board, in `src/components/home/StickerWall.tsx`. The lift (scale 1.06, +4°) and springy settle are CSS transitions on `rotate`/`scale` (`.sticker-drag` in `globals.css`). Fine pointers at ≥ 1024 px only, as specified.
   - To revert: `pnpm add motion`, then restore `m.li layout="position"` and `m.li drag` from git history.
2. **Bricolage Grotesque's `wdth` axis is pinned at 100 (§3.4).** The spec lists the variable axes wght, opsz and wdth. Nothing in the CSS changes `font-stretch`, so the width axis was only adding bytes. wght (400–800) and opsz (12–96) are kept, so headlines still get the display optical size. No visual change.

---

## 2. Facts and review mode (§0.1)

- **`NEXT_PUBLIC_REVIEW_MODE`.** `true` shows every unconfirmed fact with the yellow "Needs client confirmation" highlighter (`Pending` component, `.review-mark`). `false` hides them, or swaps in neutral fallback copy. Production must build with `false`. The smoke tests assert that no `.review-mark` appears.
- **Unknowns are data, not copy.** Every unconfirmed value is a `Fact<T>` with `confirmed: false` in `src/data/*`. Products whose spec copy depends on an unconfirmed fact carry a `fallback` block that production uses until the fact is confirmed.
- **"C/F" promo pack.** The downloaded box photo reads "Cling Film", but the site still shows "C/F" ([CONFIRM] #9). A photo isn't a client confirmation.
- **Size finder.** The capacity rule only switches on once at least 8 products have confirmed capacities. Until then, the finder recommends by food type and family, never by invented millilitres.
- **Bestsellers.** The "Start with these" subtitle avoids the word "bestsellers" in production until [CONFIRM] #11 is answered.
- **FAQ.** Answers marked `status: 'confirm'` render only in review mode and are left out of the FAQPage JSON-LD in production.
- **`/dev/kit`** (component kit) returns 404 in production unless review mode is on.

### 2.1 Client answers v1: placeholders (2026-10-21)

The first answers to `docs/CLIENT_QUESTIONS.md` came in three kinds:
- **CONFIRMED:** taken from the old site; `confirmed: true`.
- **LIKELY:** a strong hint from the old site.
- **TEMP:** a stand-in so the site looks complete.

For those items only, the answers file overrides §0.1 rule 1: LIKELY and TEMP values render in production until real answers arrive.

- **Markers.** In data: `placeholder: true` on a `Fact`, a product `placeholder` block (name, tagline, description or images), FAQ `status: 'placeholder'`, and `placeholder` on a segment. In messages: `<temp>…</temp>` around the stand-in wording. Each carries `clientQ`, the question number.
- **Rendering.** The `Placeholder` component (`primitives/Pending.tsx`) renders its children everywhere. Review mode adds the highlighter and the label "Placeholder: needs client answer", distinct from Pending's "Needs client confirmation".
- **Structured data stays confirmed-only.** Placeholder FAQ answers, compartments, roll lengths and the microwave guidance appear on the page but not in JSON-LD. Hours stay out of `openingHours` until confirmed.
- **Honest specs.** Capacities, sizes, depths, pack counts, temperatures and certificates are still never invented. They sit behind "More specs on request" with the WhatsApp button.
- **Tracking.** `scripts/placeholders.ts` lists every placeholder by question number. `pnpm check:placeholders` prints the list, fails if any marker in the code isn't listed (or a listed one has disappeared), and exits 1 while anything remains. Run it before launch. `--md` regenerates `docs/PLACEHOLDERS.md`.
- **One change beyond the answers file:** 73365's tagline "Different series. Same unbothered attitude." also implied a "73 series", which Q19 dropped, so it became "Built for big batches. Unbothered by them too." It's marked as a placeholder.

## 3. Design and brand

- **Crinkle count.** §7.1 places Crinkle five times on home; §2.5 and §15 cap him at two per page. The cap wins: at most two Crinkles in page content. Transient overlays (foil wipe, toast) and the footer peek are not counted. The size-finder teaser and mega menu use a clipboard illustration instead, and the recycle band's speech bubble became a hand note.
- **Illustrations** are grouped into a few files (`illustrations/objects.tsx`, `process.tsx`, `segments.tsx`) rather than one file per illustration. They share an offset-fill and ink-wobble style (`Ill.tsx`, `#sp-wobble` filter).
- **Repeated SVG** (wordmark, registration marks, foil-ball separator) is defined once in a hidden sprite (`brand/SvgSprite.tsx`) and drawn with `<use>`. This keeps every page's HTML and RSC payload smaller.
- **Icons (§3.10).** Phosphor Icons, Bold weight, as specified, but with only the bold path inlined as plain SVG (`src/components/icons.tsx`). The npm package ships all six weights per icon. Phosphor is MIT licensed.
- **Grain** is a 4.5% black noise overlay without `mix-blend-mode`. For pure black noise, multiply and normal blending give the same pixels, and dropping the blend removes a full-section compositing layer.
- **The old logo** is saved only as a reference (`public/images/brand/logo-old-reference.png`). The wordmark is rebuilt from Big Shoulders 900 outlines (`scripts/build-wordmark.ts`).
- **The old About image** wasn't downloaded. It's a stock collage, and only product photos may come from the old site (§0.1).

## 4. Motion (§4)

- **Page transition (§4.3-7).** The foil wipe is an enter-only overlay in `app/[locale]/template.tsx`, which is the spec's fallback. The View Transitions route was rejected because the Crinkle-on-the-edge panel can't live in the snapshot layer. The wipe skips first loads and reduced motion.
- **Hero sequence.** It's pure CSS, so it plays before hydration. The H1 (the LCP element) is never at opacity 0. An inline script sets `html[data-hero-played]` from `sessionStorage` so repeat visits in a session skip it.
- **Lenis** isn't used (optional in §4.6). Native scrolling is smoother on low-end Android and has no accessibility caveats.
- **rough-notation** is dynamically imported when a mark scrolls 60% into view (`primitives/RoughMark.tsx`).
- **Accordions** (FAQ, footer) are a small custom component rather than Radix Accordion. They use a `grid-template-rows` 0fr→1fr animation, and closed panels are `inert` or `invisible`. They meet the same keyboard and ARIA requirements.
- **Product variants** (§7.4 SiblingSwitch) are a segmented row of links with `aria-current`, not a Radix ToggleGroup, because each variant is its own URL.

## 5. URLs, SEO and i18n

- **`proxy.ts`, not `middleware.ts`.** Next.js 16 renamed it. It runs four rules, in order:
  1. WordPress paths (`wp-admin`, `wp-login.php`, `xmlrpc.php`, `feed`, `wp-content/`, …) → **410**.
  2. Trailing slashes collapse in one **308**. Next's own trailing-slash redirect is disabled (`skipTrailingSlashRedirect`) so spam URLs get their 410 in one hop.
  3. Legacy query URLs on `/` → **308** to the clean page, and unknown or spam params → **410** (§11.5).
  4. next-intl routing.
  - `scripts/verify-redirects.ts` checks all 46 legacy URLs.
- **Filtered catalogue URLs** (`/products?…`) send `X-Robots-Tag: noindex, follow` as a header from the proxy. The pages are static, so a per-query meta tag isn't possible.
- **Locales.** `localePrefix: 'as-needed'` puts English at `/` and Arabic at `/ar`. `localeDetection: false` means `/` never redirects by `Accept-Language`, which keeps URLs stable for crawlers and shared links. Visitors switch with the toggle.
- **`/quote` is noindex** (§6.1). Lighthouse's SEO score for that page is 66 by design (`is-crawlable`).
- **OG images** set their text in English for both locales, because `next/og` (Satori) has no Arabic shaping. Arabic text would render as disconnected letters.
- **`loading.tsx`** lives under `[locale]/products/` only. At the locale root it streamed a 200 status before `notFound()` could run, so unknown URLs returned 200. Dynamic product routes also set `dynamicParams = false`.

## 6. Performance (§12)

### 6.1 Budgets that are not met

- **Home first-load JS: 181 KB gzip (156 KB brotli) against a 150 KB gzip budget.** The plainest page (`/privacy`) is 165 KB gzip. That's the Next.js 16 + React 19 runtime (about 140 KB) plus the shared layout (header, quote store, next-intl client), so the budget leaves about 10 KB for everything else. What was cut to get here:
  - `motion` removed;
  - icons inlined;
  - next-intl messages precompiled, which drops the ICU parser;
  - Vercel Analytics loaded on idle;
  - Fuse.js, the mobile filter sheet, the gallery zoom, the search palette, the quote drawer and the mobile menu all load on first use;
  - the catalogue index moved out of the page payload (see 6.2).
- **Lighthouse mobile Performance ≥ 95 and LCP ≤ 2.0 s.** Measured 88–95, with simulated LCP 3.0–3.9 s. TBT is 20–80 ms and CLS ≈ 0. With all JS blocked, home scores 97 with LCP 2.6 s, so the remaining gap is JS bytes in Lighthouse's Lantern simulation (about 6 ms per KB). Details are in `docs/QA.md`. Production on Vercel serves brotli, which should help a little; local measurements use gzip.

### 6.2 Techniques used

- **Fonts are self-hosted subsets** (`scripts/build-web-fonts.py`, run with `pnpm fonts:build`; needs Python with `fonttools` and `brotli`).
  - Each font is subset to the characters the UI uses and instanced to the axes it needs.
  - English first view: 4 files, 91 KB, down from 169 KB with Google's subsets.
  - Only Bricolage (the H1 font) is preloaded.
  - Arabic: IBM Plex Sans Arabic covers the Arabic block only, so Latin runs in Arabic copy fall through to the already-loaded Bricolage. Lalezar keeps ASCII because its heavy Latin suits Arabic headlines.
  - The static TTFs in `src/assets/fonts/` are only for OG images and the wordmark build.
- **Catalogue index.** The search palette and quote list read a static `/catalog/{locale}.json` (31 KB gzip), fetched the first time either opens. It used to ride in every page's RSC payload.
- **next-intl message precompilation** (`experimental.messages.precompile`). It doesn't support array messages, so `crinkle.lines` and `home.wild.captions` are now objects keyed `"1"…"n"`.
- **`content-visibility: auto`** on below-fold home sections and the footer. Full-page QA screenshots force them visible for capture only.
- **zod** runs with `z.config({ jitless: true })`. Its JIT feature probe (`Function("")`) otherwise logs a CSP violation, which cost Best Practices points.
- **Analytics** (Vercel Analytics + Speed Insights) render only when `VERCEL` is set, and inject on `requestIdleCallback`. There are no third-party requests on the first view.

## 7. Security and forms (§5.5, §5.8)

- **CSP uses `'unsafe-inline'` for scripts.** Pages are statically generated, so per-request nonces aren't available. Next's inline hydration data, the JSON-LD blocks and the hero-replay flag all need it. `'unsafe-eval'` is allowed in development only.
- **Forms** are Server Actions. Each submission checks the honeypot, then the rate limit, then Turnstile, then zod, then sends through Resend to `SALES_EMAIL`, then sends the auto-reply.
  - The rate limit is 5 per IP per 10 minutes, on Upstash Redis when its env is set, otherwise an in-memory window (per server instance).
  - Without `RESEND_API_KEY`, submissions are logged to the server console instead of emailed (development).
  - Turnstile is invisible and its script loads on the first focus inside a form, so form pages make no third-party request until someone starts typing.
- **Dialog focus return.** Radix Dialog only returns focus to its own `Dialog.Trigger`. Ours open from store state or lazy mounts, so `useReturnFocus` (`src/components/useReturnFocus.ts`) remembers the opener in `onOpenAutoFocus` and restores it in `onCloseAutoFocus`. It's used by the quote drawer, search palette, mobile menu, filter sheet and gallery zoom.
- **The honeypot field is clipped in place** (`clip-path`, 1 px, `opacity: 0`). It used to be offset 9999 px to the left, which made Arabic pages 10,000 px wide because left overflow is scrollable in RTL.

## 8. Data, images and tooling

- **Product photos.** `scripts/fetch-images.ts` downloaded all 26 from the old site (images only, content-type checked, never hotlinked; `docs/IMAGES_REPORT.md`). Each is normalised: rotated, white trimmed, padded square with a 7% margin, 2000 × 2000 JPEG. sharp runs `resize` before `extend` within one pipeline, so padding and resizing are separate passes.
- **`images.generated.ts`, not JSON.** Playwright's ESM loader requires JSON import attributes that Next's TypeScript setup doesn't accept.
- **Linting** uses the ESLint CLI with a flat config. `next lint` was removed in Next.js 16.
- **Browser automation.** Playwright, the screenshot script and Lighthouse use the installed Microsoft Edge (`channel: 'msedge'`), so no browser download is needed.
- **Touch targets** are 44 px on coarse pointers (§12.2): quantity steppers and the unit toggle (`pointer-coarse:`), the variant switch, card buttons and toast close.

## 8.1 Design feedback round 1 (2026-10-21, design lead)

Requested by the design lead (Shubh Panda) in review, so these count as signed-off changes to §3/§7.1:

- **Product cutouts.** Photos used `mix-blend-multiply` on the blueprint grid, so grid lines showed through the foil. `scripts/cutout-images.ts` (`pnpm images:cutout`, run after `images:fetch`) flood-fills the white studio background from the image edge only (min channel ≥ 236, chroma ≤ 14, 1 px feathered alpha) and writes transparent WebPs to `public/images/products/cutout/` plus `src/data/cutouts.generated.ts`. `ProductImage.src` is now the cutout; `ProductImage.original` keeps the JPEG for OG images and Product JSON-LD (white background, and OG rendering flattens alpha to black). Cutouts get a soft blue contact shadow (`product-cutout` utility). A lower threshold (220) was tried and rejected: it punched holes in the foil. The gallery's faint model-code watermark moved to the bottom of the frame so it reads as a big number behind the product rather than a smudge.
- **Mascot renamed** from "Crinkle" to "Aloom" in all visible copy (round 2; round 1 briefly used "Al-Munim"). AR draft "آلوم": the madda keeps it from reading as ألوم ("I blame"). Code identifiers (`Crinkle.tsx`, the `crinkle` message namespace, the `crinkle_click` event) are unchanged. Legs and shoes now sit on a white die-cut under-stroke so they read when he perches on the blue wordmark.
- **Hero.** Wordmark at 80% width with the stamp beside it (now slowly turning); the H1 runs full width, which breaks it into two lines from md up, with "heat" in red and rising steam (md+). Interactions after the CSS entrance: wordmark letters squash under the pointer like a press stroke (`.hero-letter` uses `animation-fill-mode: backwards` so hover can transform them), Al-Munim hops on hover and says a line on a single click (`talkOn={1}`), and a new product fan (`HeroProducts.tsx`) of three blueprint cards drifts with the pointer and lifts on hover. It replaces the walking-container corner art. All of it is off under reduced motion and the H1 is still the LCP element.
- **Conveyor** shows product types ("Aluminium containers", "Compartment containers", "Aluminium platters", "Household foil rolls", "Catering foil rolls", "Foil promo packs") instead of model codes, each linking to its filtered list.
- **Header.** On phones the logo steps down (100 px under 380 px, 115 px under 420 px) and gaps tighten so search, quote and Menu fit from 320 px. The mega-menu family cards put the art in its own row so long names never run under it, and the foil column lists one size per row.

---

## 8.2 Design feedback round 2 (2026-10-21, design lead)

- **No review chips.** The design lead asked for "Needs client confirmation" to go from everywhere, with stand-in content where needed. `SHOW_UNCONFIRMED` in `src/lib/review-mode.ts` (now `false`) replaces `REVIEW_MODE` wherever unconfirmed facts used to be revealed. Review mode renders them exactly as production does: unconfirmed facts hidden (spec rows fold into "More specs on request", street address, social links and unpublished numbers don't render), stand-ins shown without highlights. Review mode still adds the "AR draft" badges, the legal draft banner and `/dev/kit`. This partly overrides "client answers v1" rule 2 (labelled placeholders in review mode): the open items are tracked only in `docs/PLACEHOLDERS.md` and `pnpm check:placeholders`, which still has to pass before launch. Two lines that were hidden now show stand-in copy: "ovens" in About → What we stand for (Q26) and "Usually the fastest way to reach us." on the contact WhatsApp card (Q7). No capacities, sizes, pack counts or certificates were invented.
- **Mascot renamed to "Aloom"** (see §8.1).
- **Mobile fixes.** The hero hand note now sits beside Aloom above the wordmark at every size, with its arrow pointing back at him (on phones it used to sit under the wordmark, pointing at the S). The bento "wait… both?" arrow points down at the illustration below on phones and tablets (up-right to it on desktop), and scroll-drawn arrows finish drawing as they enter (`entry 0% entry 90%`) instead of hanging half-drawn. The footer Aloom peeks at 3× the O radius on phones (1.64× from md) with 17vw top padding, so he's readable and never clipped. On phones the last "Who we pack for" sticker spans both columns when the count is odd. The sustainability mascot sits off-centre on phones, and speech bubbles cap at 58vw, so the bubble stays on screen in EN and AR. No page overflows horizontally at 360 px.

## 8.3 Scroll-in transitions (2026-10-22, design lead request)

`RevealOnScroll.tsx` (mounted once in the locale layout) tags content in `<main>` after hydration and reveals it once, through one IntersectionObserver, as it enters the viewport on mobile and desktop. Every h2 "wipes" up out of a slot; other top-level blocks of each section fade up, staggered 80 ms (60 ms on phones, shorter travel). Groups opt into variants with `data-reveal-stagger`: deal (family tiles, About values, wholesale supply, "Pairs well with"), stamp (stickers, finder chips, stat tiles, About numbers), start (featured rail, wholesale steps, recycling steps; mirrored in RTL) and zoom ("Why order from the factory"). The hero and the catalogue grid (which has its own FLIP) opt out with `data-reveal-skip`. Safety: nothing is hidden until JS runs, content already on screen is never hidden, reduced motion and no-JS skip it entirely, print shows everything, and state lives in data attributes so React re-renders can't reset it. Keyframes only set `from` values on the independent `translate`/`scale`/`rotate` properties with `backwards` fill, so components keep their own transforms. This replaces §4's "reveal" note.

## 8.4 Mascot moments (2026-10-22, design lead request)

- The "Made in Ajman" stamp is gone from the hero.
- Hero: Aloom has the same arms as the hard-hat pose (the perched pose had none). He enters with a jump: he crouches at the foot of the S, arcs up and lands on the L with a squash, then sits with his legs dangling (a slow swing). It's skipped on repeat visits in a session, like the rest of the hero entrance.
- Bulk CTA → footer hand-off (`brand/MascotHandoff.tsx`): scrolling down, once the hard-hat Aloom reaches the top ~40% of the screen he hops and drops out through the bottom of the yellow section, and he's back once the section is off screen. When the footer wordmark is 60% visible, he falls from above into the spiral O (clipped at its top edge), vanishes, then climbs half out and peeks over the edge. This replays each time the wordmark re-enters. Without JS or with reduced motion, only the static peek shows. The footer wordmark container is now `overflow-x-clip` so the fall can start above it.

## 8.5 Home recycling band (2026-10-22, design lead request)

`RecycleCycle.tsx` replaces the static `RecycleLoop` on the home "Use once. Recycle forever." band (the sustainability page still uses the static one). It adds a blue disc with a slowly turning dotted track, so the red band carries blue. On scroll-in the foil ball stamps in, then the hand note grows out of it on two lines ("Not trash." / "Pre-recycled.", split after the first full stop, so AR works too) while its arrow draws. The four arcs then draw clockwise and each stop pops in as its arrow arrives. After about 2.5 s a small foil ball travels round the loop (SMIL `animateMotion`, started from JS) and the big ball bobs. Static for no-JS and reduced motion. The band opts out of the generic scroll reveal (`data-reveal-skip`) so the two don't overlap.

## 8.6 Mobile parity for motion (2026-10-22)

The hover-only interactions now have touch twins. Tapping a hero wordmark letter squashes it (`TapPress.tsx`, `data-pressed`). Tapping Aloom makes him hop (and talk), via `data-hop` on every click. On touch screens the hero product fan drifts with scroll position, where desktop follows the pointer. The "heat" steam shows on phones too, rising beside the word. Scroll reveals use the same travel and stagger on phones as on desktop.

## 8.7 Hover jitter, hero bubble, mascot return (2026-10-22)

- **No more vibrating on hover.** The wordmark press and Aloom's hop used to run on `:hover`. The squash pulled the shape out from under a cursor at the edge, so hover flickered on and off. Both are now one-shot, attribute-driven animations that always finish. A letter re-arms only once the pointer leaves its resting box (`TapPress.tsx`). Aloom's hit area (the root span) stays still while only his inner SVG hops.
- **Hero speech bubble** sits beside him (`speechSide="side"`), not above, where the section top clipped it on desktop.
- **Return trip.** Scrolling back up from the footer, the peeking Aloom jumps up out of the O and away. When the bulk CTA is back in view he springs up from below and lands in his spot. `MascotHandoff.tsx` now runs on scroll direction (one rAF tick per scroll frame, only while near the viewport).

## 8.8 Inner-page illustrations and mascots (2026-10-23, design lead request)

- **Home recycling loop:** no blue disc any more. The right-hand container is blue, and the ball creases, tray steam and container ribs are drawn in blue.
- **Contact:** a hard-hat Aloom below the map with the same `MascotJumpOut` hand-off as the home page: he hops out scrolling down and lands back scrolling up.
- **About hero:** the title drops "since 1997" (the Founded 1997 card already says it). The right side is an animated press line (`AboutHeroScene.tsx`): the coil feeds, the ram strokes, and a container rides the belt off on every stroke. Hovering (or tapping) it makes Aloom explain the line. A faint factory skyline (sawtooth roofs, smoking stacks, turning gears) fills the plain left background.
- **About process ("From coil to container"):** each frame tells its step. The coil turns. The feed rollers spin in place while the coil unwinds into the press. The press takes a flat sheet, the ram strikes, and a formed container slides out. A rim roller runs the edge while the ragged excess curls off behind it. Containers drop onto the stack one by one, with the tally in step and then a tick. The carton hops off, speed lines streaming. Moving parts animate fill and ink as separate groups, so the misregistered fill keeps its offset (it used to swing round with rotations). The "n/6" counter is gone.
- **Sustainability:** "forever" is yellow (`<hl>` in the h1, EN and AR). The waving Aloom tracks the pointer, hops, and talks on click. The afterlife loop (`AfterlifeLoop.tsx`, redrawn the same day) uses the site's standard ink: 2.5px non-scaling strokes, 1.6px details and 3.5px misregistered fills. It has five unnumbered stops matching the five steps: a steaming tray of biryani, a tap dripping into a tipped container, a blue recycling bin with a foil ball dropping in, a crucible of molten aluminium on a burner, and a shiny new foil roll. They sit on a ring of arrows that turns every 40 s, around a faint Silverpot foil spiral.
- **Wholesale:** the hero illustration is now Silverpot cartons on a pallet with a stack of containers and a swinging "THU" tag (`PalletStack.tsx`; the day label is translated). At "Tell us what you need", a clipboard Aloom strolls in from the left (from the right in RTL) and stays below the title (`SlideInMascot.tsx`).

## 8.9 New logo (2026-10-24, from the design lead's Illustrator file)

- **Source of truth:** `public/brand/source/silverpot-logo.svg` (Illustrator "Save As → SVG", presentation attributes, layers named `plaque`, `s i l v e r p o t`, `star-*`). `pnpm brand:build` runs `scripts/build-logo.ts`, which measures every part in Edge and writes `src/components/brand/logo-data.ts`, then `build-icons.ts`. Star colours are read from their fills, not their layer names (the blue star's layer was also called `star-yellow`). The old font-generated SILVERPOT wordmark and its script are gone.
- **`<Logo>`** (`brand/Logo.tsx`) always uses the logo's own colours. `sticker` adds a white die-cut outline and a blue offset shadow as one layer behind everything (no seams where stars overlap), used on the yellow hero and the 404 page. `symbol` uses the shared sprite (header, footer). Gotcha: `<use>` places a symbol's viewport at (0, 0), so the outer SVG uses `0 0 w h` and not the source viewBox.
- **Hero:** the badge sits left (5 of 12 columns, about 76% width on phones) with the product fan beside it, and the H1 runs full width below on two lines. Entrance: the plaque stamps, the nine letters drop in, the red, yellow and blue stars spin into place, then Aloom jumps up from beside the badge and sits on the plaque's top edge right of the stars (88% across, or a `perch` marker if the file has one), legs dangling. The hand note sits above the badge, its arrow curling down to him. Letters squash and stars spin on hover or tap (one-shot, re-armed only after leaving).
- **Footer:** the badge is centred. Aloom falls behind the plaque and peeks over its top edge at the same spot (or a `peek` marker). The hand-off logic is unchanged.
- **Icons:** the logo's yellow star on plaque blue (favicon, Apple and manifest icons). `public/brand/silverpot-logo.png` (Organization JSON-LD) is the badge on white. Loading spinners spin a logo star. OG images carry the badge with a white outline.
- **Open:** the logo reads "SilverPot" (capital P); site copy still says "Silverpot" per the client's Q8 answer until told otherwise.

## 9. Status and what's next

Built: every page in §6.1 in English and Arabic, 163 static pages; the quote list and drawer; search; the size finder; three forms with email; SEO (metadata, JSON-LD, sitemap, robots, OG images); legacy redirects; review mode; QA tooling.

Before launch:

1. Answer the [CONFIRM] register (§16). Each answer is a data edit in `src/data/*` (set `confirmed: true`), after which the fact appears in production.
2. Native Arabic review of `messages/ar.json` and the `ar` fields, then set `arReviewed: true`.
3. Legal review of `src/content/legal.ts`.
4. Set production env: `NEXT_PUBLIC_SITE_URL=https://silverpot.org`, `NEXT_PUBLIC_REVIEW_MODE=false`, `RESEND_API_KEY`, `RESEND_FROM`, `SALES_EMAIL`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, and optionally the Upstash keys.
5. Deploy to Vercel, then follow §14 (DNS with MX records untouched, decommission WordPress, Search Console clean-up).
6. Manual screen-reader pass (VoiceOver iOS + NVDA) on Home, a product page and Quote (§12.2). Not done in this build.
7. Run Rich Results Test and Lighthouse against the deployed URL and update `docs/QA.md`.
