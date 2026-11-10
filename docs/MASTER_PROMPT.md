# SILVERPOT.ORG — MASTER BUILD PROMPT

**Version:** 1.0 · October 2026
**For:** Google Antigravity (build agent)
**Stack:** Next.js (App Router, latest stable) + TypeScript + Tailwind CSS v4
**Client:** Al Mohamadi Light Industries Co. LLC — brand: **Silverpot** — Ajman, UAE, est. 1997
**Design lead:** Shubh Panda

> How to use: put this file in the repo at `/docs/MASTER_PROMPT.md`, then tell the agent:
> *"Read /docs/MASTER_PROMPT.md end to end. Then execute it phase by phase (§0.2). Do not skip the checks at the end of each phase."*

**Contents**
0. Agent operating rules · 1. Project brief · 2. Brand platform · 3. Visual design system · 4. Motion and interaction · 5. Tech stack and architecture · 6. Information architecture · 7. Page-by-page specification · 8. Component library · 9. Data model and full catalogue · 10. Image pipeline · 11. SEO · 12. Performance and accessibility budgets · 13. Responsive matrix · 14. Launch and post-launch · 15. QA checklist · 16. [CONFIRM] register · Appendix: kickoff message

---

## 0. AGENT OPERATING RULES (read first)

You are acting as a senior product designer **and** a senior Next.js engineer. You are building a complete, production-ready marketing + catalogue + quote-request website for an aluminium packaging manufacturer. This document is the single source of truth for brand, design, content, data, SEO and quality.

### 0.1 Non-negotiable rules

1. **Facts are sacred.** Only the facts in §1.2 and the product data in §9 are verified. Anything marked `[CONFIRM]` is unknown. Model unknowns as `null` (or a feature flag set to `false`). The UI must either hide that element or show an "Ask us" affordance. **Never invent** capacities, dimensions, thickness, certifications, statistics, client names, logos, testimonials, reviews, prices, street addresses, social URLs, awards or the ® mark.
2. **Review mode.** Implement `NEXT_PUBLIC_REVIEW_MODE`. When `true` (preview deployments), every unconfirmed field renders as a yellow highlighter block with the label "Needs client confirmation" so the client can sign off in context. When `false` (production), unconfirmed fields are hidden. This is how the client fills the gaps.
3. **No lorem ipsum.** All copy is in this document. If you must write extra microcopy, write it in the brand voice (§2.4) and list every new string in `/docs/NEW_COPY.md` for review.
4. **The old site is compromised.** silverpot.org currently runs WordPress 6.4.2 with injected casino spam. Do not copy any HTML, CSS, JS or text from it except what is reproduced in this document. The only things you may download from it are the product photos (§10), and only through the image script with content-type validation.
5. **Download images into the repo before launch.** Never hotlink `silverpot.org/wp-content/...` in production. Those URLs die the moment DNS points at the new site.
6. **Mobile first.** Design and build every component at 360 px wide first, then scale up.
7. **Budgets are acceptance criteria.** The performance, accessibility and SEO budgets in §12 and §15 are pass/fail.
8. **Framework reality wins.** If an API named here differs in the installed Next.js version (for example `middleware.ts` vs `proxy.ts`, or how view transitions are enabled), follow the installed version and log the decision in `/docs/DECISIONS.md`.

### 0.2 Build phases

| Phase | Scope | Exit check |
|---|---|---|
| 1. Foundation | Create app, Tailwind v4 tokens (§3.13), fonts (§3.4), global styles, base primitives (Button, Chip, Sticker, RimFrame, HandNote, Section) | Storybook-style `/dev/kit` page renders every primitive in all states |
| 2. Data + images | Types and data (§9), image fetch script (§10), illustration placeholders (§3.8) | `pnpm images:fetch` report lists every product image with resolution obtained |
| 3. Shell | Header, mobile menu, footer, quote drawer, command search, toasts, page transition | Keyboard-only walkthrough of the shell works |
| 4. Pages | Home → Products → Category → Product detail → Quote → Contact → Wholesale → About → Sustainability → FAQ → Size finder → Legal → 404/500 | Every page matches §7 at 390 px and 1440 px |
| 5. SEO | Metadata, JSON-LD, sitemap, robots, OG images, legacy redirects (§11) | Rich Results Test passes, no schema errors |
| 6. Motion | Signature interactions (§4) | Reduced-motion mode verified |
| 7. Arabic | `/ar` locale, RTL, fonts (§7.15) | Every page mirrored correctly |
| 8. QA | Full checklist (§15) | Lighthouse report saved to `/docs/QA.md` |

After **every** phase, run `pnpm lint && pnpm typecheck && pnpm build`. Then open the touched pages in the browser at 390×844 and 1440×900, take screenshots, compare them against this spec and fix anything off-spec before moving on.

### 0.3 Definition of done

- Every page in §6.1 exists, is responsive from 360 px to 1920 px, and works in English and Arabic.
- All 26 products are live with images (downloaded locally), correct legacy redirects and valid Product JSON-LD.
- Quote requests and contact forms deliver email, and the WhatsApp hand-off works with a pre-filled message.
- Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100.
- Zero unconfirmed facts are visible in production mode.

---

## 1. PROJECT BRIEF

### 1.1 What we are building

A new website for Silverpot that:
- shows the full aluminium range (containers with lids, platters, foil rolls and packs) as a fast, filterable catalogue built around **model codes**, because that is how trade buyers search;
- turns visits into **quote requests** through a quote list, WhatsApp, a phone call or email;
- gives a 29-year-old Ajman manufacturer a brand people remember: poppy, punchy, a bit imperfect, illustrated and clean, with a half-neobrutalist edge and an industrial backbone;
- replaces a hacked WordPress site and recovers its search visibility.

### 1.2 Verified client facts (scraped from the old site, Oct 2026)

| Fact | Value |
|---|---|
| Legal name | Al Mohamadi Light Industries Co. LLC |
| Brand | The old site used both "Silver Pot" and "SILVERPOT". **New standard:** the wordmark is set as `SILVERPOT` and prose uses "Silverpot". `[CONFIRM with client]` |
| Founded | 1997, Emirate of Ajman, UAE |
| Business (as stated) | Manufacturing and distribution of disposable packaging products, containers, tableware, and cleaning and hygiene products |
| Range currently online | Aluminium containers with lids (13), aluminium platters (4), aluminium foil rolls and packs (9) = **26 unique products** |
| Landline | +971 6 743 1314 |
| Mobile | +971 50 849 4521 (assumed to be on WhatsApp `[CONFIRM]`) |
| Email | info@silverpot.org |
| Domain | silverpot.org |
| Map query used on old site | "Al Mohamadi Light Industries Co LLC - Ajman" |
| Social platforms listed (no links) | Instagram, Pinterest, Facebook, YouTube `[CONFIRM URLs]` |
| Old mission text (paraphrase) | Provide high-quality, user-friendly, environmentally compliant products; be a leading, growing force in food packaging; invested in technologically advanced machinery; balance social responsibility, commercial achievement and environmental protection |

### 1.3 Why we are rebuilding (old-site problems)

1. Casino spam (Spanish and German paragraphs, plus footer links) is injected into the homepage. This hurts trust and search rankings.
2. WordPress 6.4.2 (2023) has never been updated, which is the likely way the attackers got in.
3. Every product and category URL falls back to the homepage. The "Shop" page is empty.
4. The contact form shows a raw `[wpforms id="7"]` shortcode, so zero enquiries come in.
5. Products have no specs: no size, capacity, pack quantity or usage guidance. The model code is the only information.
6. There are three duplicate foil listings, inconsistent naming ("Aluminum"/"Aluminium", "SQ.FT"/"sqft"), two grey placeholder images, and no alt text anywhere.
7. There's a "Shop Now" button pointing to `#link`, social labels with no links, and no address, hours or Arabic version.
8. The About page claims "over a decade" of experience when the company has been running for 29 years.

### 1.4 Audience

**Primary (B2B, ~80%)**
- Restaurant, cafeteria and shawarma-shop owners and their purchase managers
- Cloud kitchens and delivery-first brands
- Caterers, event companies, hotel and banquet F&B teams
- Bakeries and sweet shops (kunafa, umm ali, baked desserts)
- Distributors, wholesalers and supermarket or hypermarket buyers

**Secondary (B2C, ~20%):** home cooks looking for good foil and containers `[CONFIRM whether Silverpot sells direct to households]`

**What they need to do on the site**
1. Find a product by model code or by use within 10 seconds.
2. See what it is: photo, family, compartments, size and pack quantity.
3. Ask for a price, stock and lead time with almost no effort, ideally on WhatsApp.
4. Trust that this is a real, established factory.

### 1.5 Goals and KPIs

| Goal | KPI |
|---|---|
| Generate leads | Quote requests per month, WhatsApp clicks, `tel:` clicks, `mailto:` clicks |
| Get found | Rankings for the §11.2 keywords in google.ae, impressions in Search Console |
| Be fast | CWV "Good" for 100% of URLs (LCP ≤ 2.0 s, INP ≤ 200 ms, CLS ≤ 0.05) |
| Be memorable | Branded search volume ("silverpot"), return visits, time on site |

### 1.6 Market and language

- UAE first; GCC export `[CONFIRM]`.
- English (default, at the root) and Arabic (`/ar`, RTL).
- Use British spelling in all English copy: **aluminium**. Use "aluminum" only inside metadata keywords and the redirect map, because some buyers search with US spelling.
- Use Western digits (0–9) for model codes and numbers in both languages. This is common in the UAE trade.

---

## 2. BRAND PLATFORM

### 2.1 The big idea: **LIGHT METAL. HEAVY DUTY.**

Aluminium is literally a light metal, and Silverpot's products do heavy-duty work: hot biryani, packed delivery bags, 300-cover banquets. That true tension is the brand.

The reference brand (OFFBRIEF) is *controlled chaos*: a strict system wearing messy, sarcastic, hand-drawn clothes. We use the same engine with an industrial chassis:

> **Factory precision underneath. Street-food personality on top.**

- **The strict layer (the factory):** a hard grid, model codes as hero typography, spec plates with rivets, blueprint grids, dimension lines, stencil stamps, a conveyor of codes.
- **The loose layer (the people who eat the food):** naive ink doodles, handwritten notes, die-cut stickers, deadpan one-liners, and a crumpled-foil mascot who is unimpressed by everything.

The joke never touches the product facts. **Specs are always straight-faced.**

### 2.2 Positioning statement

For UAE food businesses that need packaging they never have to think about, **Silverpot** is the Ajman aluminium manufacturer that has been pressing containers, platters and foil since 1997. Unlike faceless trading companies, Silverpot is factory-direct, easy to reach, and a brand with an actual personality.

### 2.3 Taglines

| Use | Line |
|---|---|
| Primary | **Light metal. Heavy duty.** |
| Heritage | Pressing aluminium in Ajman since 1997. |
| Sustainability | Use once. Recycle forever. |
| Hero H1 (SEO) | Aluminium containers and foil that take the heat. |
| Bulk CTA | Need 10,000 by Thursday? |

### 2.4 Voice and tone

**Archetype:** Craftsman (60%) + Jester (30%) + Everyman (10%). Picture the factory-floor supervisor who knows every model code by heart and is also the funniest person in the building.

| Slider | Position |
|---|---|
| Serious ⟷ Playful | 60% playful in headlines, 100% serious in specs |
| Corporate ⟷ Human | 85% human |
| Loud ⟷ Quiet | Loud headlines, quiet body text |
| Premium ⟷ Accessible | Accessible, but crafted |

**Rules**
1. Headlines are 2–6 words and should be punchy and specific.
2. Allow at most one joke per section. Jokes live in headlines, handwritten notes, stickers, empty states, toasts and the mascot. Jokes never appear in specs, safety information, legal text, form labels or error explanations.
3. Never joke about food safety, hygiene, health or the customer's business.
4. Buttons say exactly what happens, in sentence case, with no trailing arrows: "Add to quote", "Send quote request", "Chat on WhatsApp", "Browse products".
5. Use one name for one action across the whole flow. The button says "Add to quote", the toast says "Added to your quote", the page title is "Your quote", the submit button says "Send quote request" and the success message says "Quote request sent".
6. Use "we" and "you". Avoid jargon such as "solutions", "leverage", "world-class" or "one-stop shop".
7. Error messages say what happened and how to fix it. They don't apologise and they're never vague.
8. Arabic copy should be warm and respectful, never slangy. A native-speaker review is required before launch.

**Vocabulary**
- Say: pressed, made, packed, ships, model, family, tray, lid, roll, carton, kitchen, takeaway, catering, Ajman.
- Don't say: "solutions provider", "premium quality products" (prove it instead), "eco-friendly" (use specific, true recyclability statements), "world-class", "No. 1".

**Line bank** (for headlines, notes, stickers and toasts)
- "Light metal. Heavy duty."
- "Lids on. Drama off."
- "Takes the heat. Doesn't take it personally."
- "Built to be used once. Made to be remembered."
- "Not trash. Pre-recycled."
- "Wait… both?" (hand note under "Light metal. Heavy duty.")
- "Need 10,000 by Thursday?"
- "Rice here. Curry there. Salad minding its own business."
- "Your quote is in the oven." (form success subline)
- "This page got thrown out." (404)

### 2.5 Mascot bible: **CRINKLE**

- **What:** a sheet of foil, scrunched into a lumpy ball, with two dot eyes, thin stick legs, big shoes and no mouth. His expression comes only from his eyelids.
- **Personality:** deadpan, unbothered and secretly proud. He has been through ovens, freezers and lunch rushes and is impressed by none of them. He's the reference brand's sarcastic fly, translated into foil.
- **Role:** "Head of Quality Control (unofficial)". He appears in the hero, the quote drawer, empty states, the 404 page, the sustainability page, success toasts and the mobile menu. Show him **at most twice per page** so he stays special.
- **Poses (SVG set):** `perched` (sitting on the wordmark), `wave`, `deadpan` (half-lidded eyes), `hard-hat` (bulk CTA, About), `clipboard` (size finder), `sleeping` (empty quote), `peek` (page transition, footer), `flattened` (404: he's been squashed back into a sheet), `thumbs-up` (success).
- **Interactions:**
  - In the hero and on the 404 page only, his pupils follow the pointer on desktop and follow scroll direction on touch devices.
  - He blinks at random every 4–7 seconds.
  - Clicking him three times shows a speech bubble with a random line from the line bank.
- **Lines:** "Head of QC. Unofficially." · "I've been in hotter places than this meeting." · "Not trash. Pre-recycled." · "Your quote list is empty. I'm not judging. (I am.)"

### 2.6 Hero objects and local cues

- **Hero object 1:** the lidded aluminium container (model 8325). It's the equivalent of OFFBRIEF's moka pot, and it gets turned into characters: it grows legs, does a deadlift, carries a biryani.
- **Hero object 2:** the foil roll seen end-on as a spiral. This becomes the **O** in the wordmark (§3.12).
- **Local cues** (at most one per page, never touristy): a dallah (coffee pot) made of foil, a shawarma in a foil wrap, a kunafa tray, a majlis spread of platters, an Ajman dhow outline. Avoid camels, generic skyline clip-art and desert dunes.

### 2.7 Product naming convention

`{Product type} – {Model code}` plus a variant in words if needed.
- "Aluminium Container with Lid – 8325"
- "3-Compartment Aluminium Container with Lid – 8576"
- "Aluminium Foil Roll – 30 cm × 75 sq ft"
- "Catering Foil Roll – 45 cm × 150 m / 300 m"

---

## 3. VISUAL DESIGN SYSTEM

### 3.1 The aesthetic in one sentence

**Half-neobrutalist industrial pop:** hard blueprint-blue outlines, hard offset shadows and loud flat colour blocks, kept clean with lots of white space, a strict grid and corners shaped like a container's rolled rim.

### 3.2 "Half" neobrutalism: what we take and what we leave

| Take from neobrutalism | Leave behind |
|---|---|
| Thick outlines (2 px) on interactive things | Outlines on everything (sections, text blocks) |
| Hard offset shadows, no blur | Shadows on non-interactive elements |
| Flat, saturated colour blocks | Clashing four-colour sections |
| Big, heavy type | Ugly-on-purpose type |
| Visible structure | Chaotic misalignment of body content |

**Encoding rule (the structure carries information):**
- A **hard shadow** means *you can press this*. Only buttons, product cards, category tiles, chips and toggles get one. Static content never does.
- A **blueprint grid** behind something means *this is technical data*: spec plates, product image frames, dimension views.
- A **dashed outline** appears only in review mode and means *needs client confirmation*.
- A **rotated sticker** is either real information (family, compartments, "photo coming soon") or a brand joke. It's never empty decoration.

**Choices made deliberately against current web defaults** (keep these):
- The base background is **pure white** plus a cool **Foil Grey**, not warm cream. Aluminium is cool and bright.
- Outlines and shadows are **deep blue**, not black. They read like blueprint ink. **Black is used at a minimum:** hazard tape, mascot pupils, the photo duotone, and nothing else.
- There are **no tracked all-caps eyebrow labels** above headings. Headlines stand on their own, and asides come as handwritten notes.
- There is **no monospace font**. Model codes are set in the condensed industrial display face, because that's how codes are stamped on factory cartons.
- **Numbered markers (01, 02…)** appear only on real sequences: ordering steps, the coil-to-container process, and size-finder steps.
- Corner radius follows hierarchy and the subject (§3.6), not one radius for everything.

### 3.3 Colour

| Token | Name | Hex | Role |
|---|---|---|---|
| `--c-yellow` | Signal Yellow | `#FFD21F` | Hero, highlights, CTAs on blue, selection, attention |
| `--c-blue` | Blueprint Blue | `#0E2A8C` | **Ink**: outlines, shadows, headings and body text on light, blue section fills |
| `--c-red` | Oven Red | `#B8322A` | Primary buttons, sticker accents, sustainability block, footer wordmark |
| `--c-white` | White | `#FFFFFF` | Main background, cards |
| `--c-foil` | Foil Grey | `#E9ECF1` | Secondary surfaces, blueprint panels, skeletons, disabled states |
| `--c-black` | Black | `#000000` | Minimal: hazard tape, mascot pupils, duotone photo shadows |
| `--c-blue-12` | Blueprint line | `rgba(14,42,140,0.12)` | Blueprint grid lines, dividers |

**Usage ratio across a page:** White 45% · Yellow 20% · Blue 20% (including ink) · Red 10% · Foil Grey 4% · Black ≤ 1%.

**Allowed text/background pairs (WCAG 2.2)**

| Text on background | Ratio | Allowed for |
|---|---|---|
| Blue on White | ~12:1 | Everything |
| Blue on Yellow | ~8.4:1 | Everything |
| Blue on Foil Grey | ~10:1 | Everything |
| White on Blue | ~12:1 | Everything |
| Yellow on Blue | ~8.4:1 | Everything |
| White on Red | ~6:1 | Everything |
| Red on White | ~6:1 | Everything (links, prices, tags) |
| Red on Yellow / Yellow on Red | ~4.1:1 | **Large text only** (≥ 24 px, or ≥ 19 px bold) |
| Blue on Red / Red on Blue | ~2:1 | **Never** |

Verify these ratios with a contrast checker at build time and adjust hex values by ±3% lightness if any falls short.

**Section colour sequence (home):** Yellow → White → Blue → White → Yellow (tile) → White → Red → White → Blue → Yellow → White footer. Never put two saturated sections next to each other without a white or Foil Grey section between them, except when one of them is a hazard-tape seam (§3.7).

**Shadow colour flips by background:** on White, Yellow or Foil Grey, shadows are Blue. On Blue, shadows are Yellow. On Red, shadows are Blue.

### 3.4 Typography

Two families plus one accent hand, all loaded through `next/font/google` with `display: swap` and Latin subsets only on English routes.

| Role | Font | Settings |
|---|---|---|
| **Display / wordmark / model codes** | **Big Shoulders Display** (use the Stencil sibling for stamps). If Google Fonts exposes it as a single "Big Shoulders" family with an optical-size axis, use that. | 800–900, uppercase for the wordmark and stamps, tabular figures for codes |
| **Headlines and body** | **Bricolage Grotesque** (variable: wght, opsz, wdth) | Headlines 700–800 with tight tracking; body 400–500 |
| **Hand annotations** | **Gochi Hand** | Only for notes, arrows and stickers, never for more than about 12 words |
| Arabic display | **Lalezar** | Arabic headlines |
| Arabic text | **IBM Plex Sans Arabic** | 400 / 500 / 700 |

**Why these fonts:** Big Shoulders is drawn from Chicago's industrial signage, so it gives the condensed, stamped-on-a-carton feel the brief asks for. Bricolage Grotesque's chunky, slightly quirky 70s grotesque at heavy weights is the closest free match to the reference's headline voice. Gochi Hand gives the wobbly marker annotation layer.

**Type scale** (fluid; built on a 1.25 ratio at mobile and 1.333 at desktop)

| Token | Font | Size (clamp) | Line height | Tracking |
|---|---|---|---|---|
| `mega` (wordmark) | Big Shoulders 900 | fit to container width (§3.12) | 0.8 | -0.01em |
| `code-xl` (product detail model code) | Big Shoulders 900 | `clamp(4.5rem, 12vw, 10rem)` | 0.85 | 0 |
| `display` (H1) | Bricolage 800 | `clamp(2.5rem, 7vw, 6.5rem)` | 0.92 | -0.035em |
| `h2` | Bricolage 800 | `clamp(2rem, 4.6vw, 4.25rem)` | 0.95 | -0.03em |
| `h3` | Bricolage 700 | `clamp(1.375rem, 2.2vw, 2rem)` | 1.05 | -0.02em |
| `h4` | Bricolage 700 | `1.125rem` | 1.2 | -0.01em |
| `body-l` | Bricolage 400 | `clamp(1.0625rem, 1.3vw, 1.25rem)` | 1.5 | 0 |
| `body` | Bricolage 400 | `1rem` | 1.55 | 0 |
| `small` | Bricolage 500 | `0.875rem` | 1.45 | 0 |
| `code-s` (model codes on cards and in specs) | Big Shoulders 800 | `1.75rem` | 1 | 0.01em |
| `hand` | Gochi Hand | `clamp(1.125rem, 1.6vw, 1.5rem)` | 1.2 | 0 |

**Rules**
- Keep body line length between 45 and 75 characters (`max-width: 65ch`).
- Use sentence case everywhere, except the wordmark and stencil stamps.
- Don't highlight single words by changing their colour or style inside a headline. Emphasis comes from **scale**, not from accenting one word.
- Turn on `font-variant-numeric: tabular-nums` for anything with numbers in columns.

### 3.5 Grid, spacing and layout

- **Grid:** 4 columns at < 768 px, 8 columns from 768 px, 12 columns from 1024 px.
- **Gutters:** 16 / 24 / 32 px.
- **Max width:** 1440 px for content; colour blocks always go full-bleed.
- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Section padding is 64 px (mobile) and 128 px (desktop).
- **Alignment:** left-aligned, ragged right. Center alignment is used only for the manifesto paragraph and the 404 page. The hero wordmark is the one element set edge to edge.
- **Breakpoints:** `sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.
- Use **container queries** for cards and tiles so they adapt to their slot, not just the viewport.

### 3.6 Outlines, corners, shadows and stickers

**Outlines:** 2 px Blueprint Blue on interactive elements and image frames. Use 3 px only for the quote button and the focus ring.

**Corners follow hierarchy and the subject:**

| Element | Radius | Why |
|---|---|---|
| Product card and image frame (**RimFrame**) | 14 px outer **plus an inner 1 px line inset 5 px** at 35% blue | Echoes the rolled rim of an aluminium container |
| Category tiles | 24 px | Large, friendly |
| Buttons | 10 px | Chunky and pressable |
| Chips and filter pills | 999 px | Small tags |
| Spec plate (DataPlate) | 4 px plus 4 corner rivets | Machine nameplate |
| Stickers | Die-cut shapes (circle, burst, rounded rectangle, ticket) | Hand-made layer |
| Sections | 0 | Full-bleed colour blocks |

**Shadows (hard, no blur):**
```
--shadow-sm: 3px 3px 0 0 var(--shadow-color);
--shadow-md: 5px 5px 0 0 var(--shadow-color);
--shadow-lg: 8px 8px 0 0 var(--shadow-color);
```
- **Press interaction:** hover = `translate(-2px,-2px)` and the next shadow size up; active = `translate(3px,3px)` and shadow 0; transition 120 ms.
- **RTL:** mirror the x offsets (`-3px 3px` and so on).

**Stickers:** rotated −7° to +7° (rotation is deterministic per index, never random on render, to avoid hydration mismatch), white 2 px outline (die-cut look), plus a `--shadow-sm` in blue. Never rotate body text, form fields or buttons.

### 3.7 Industrial motifs (the "industrialist touch")

Use each motif where it means something. **Don't use all of them on one page.**

1. **DataPlate.** The spec card is styled as a riveted machine nameplate: Foil Grey background, 4 px corners, four 6 px rivet circles, rows separated by blueprint lines, labels in Bricolage 500 and values in Big Shoulders 800.
2. **Blueprint grid.** A 24 px grid of `--c-blue-12` lines on White or Foil Grey, used behind product images and technical panels only.
3. **Dimension lines.** These are technical-drawing arrows with end ticks and mm labels. They draw around a product image when the user turns on "Show dimensions" on a product detail page, or on product-card hover on desktop. Show them only when the dimensions are confirmed.
4. **Stencil stamps.** Big Shoulders Stencil on a circular path, in Red at 85% opacity with a rough-edge mask, such as "MADE IN AJMAN SINCE 1997". Use at most one per page.
5. **Hazard tape.** 45° Yellow and Black stripes, 20 px tall, rotated −1.5°, used only as a seam before the bulk CTA and on the 404 page.
6. **Conveyor.** A strip of model codes that advances **only while the user scrolls**, like a conveyor indexing forward, and stops when they stop (§4.3).
7. **Registration marks.** Small print crosshair circles at the four corners of the hero and of product image frames.
8. **Carton label.** A small decorative barcode with the model code under it, on product cards. It's `aria-hidden` and generated as an SVG from the code string.
9. **Odometer.** Mechanical digit wheels used once, for "1997" on the home bento and the About hero.
10. **Rough-edge print texture.** A 3–4% SVG noise grain over coloured sections, plus a risograph *misregistration*: colour fills inside illustrations are offset 3–4 px from their ink lines.

### 3.8 Illustration system

**Style:** naive, single-weight ink line art in the reference's "sketchbook" spirit.
- Stroke: 2.5 px at 1× in Blueprint Blue (or White on Blue and Red), with round caps and joins and slightly wobbly paths. There is no shading.
- Fill: flat Yellow, Red or White areas offset 3–4 px from the line (misregistration).
- Text in illustrations is always Gochi Hand.

**Build approach:** create every illustration as an inline-able SVG component in `src/components/illustrations/`. For phase 1, draw clean, simple placeholder versions yourself. They must already look intentional, not like grey boxes. The design lead will replace them with final hand-drawn SVGs using the same filenames and viewBoxes. Keep each file under 8 KB.

| File | Subject | Used in |
|---|---|---|
| `crinkle-*.svg` (9 poses, §2.5) | Mascot | Global |
| `wordmark.svg` | SILVERPOT with the foil-spiral O | Header, hero, footer |
| `foil-spiral-o.svg` | Foil roll end-on | Wordmark, loaders |
| `container-legs.svg` | Lidded container walking | Hero corner, 404 |
| `container-deadlift.svg` | Container lifting a biryani pot | Home bento |
| `shawarma-wrap.svg` | Shawarma in a foil wrap | Foil category, wholesale |
| `biryani-tray.svg` | Tray with steam squiggles | Containers category |
| `kunafa-tray.svg` | Kunafa tray | Platters category, bakeries segment |
| `dallah-foil.svg` | Dallah made of foil | About (local cue) |
| `recycle-loop.svg` | Foil ball → bin → melt → new container | Sustainability |
| `delivery-bag.svg` | Rider bag full of containers | Cloud-kitchen segment |
| `press-machine.svg` | Press stamping a container, with a stick-figure operator | About process |
| `coil.svg`, `sheet.svg`, `press.svg`, `trimmed.svg`, `stack.svg`, `shipped.svg` | Coil-to-container frames | About scroll story |
| `arrows-*.svg` (6) | Curved hand-drawn arrows | Hand notes |
| `scribble-red.svg` | Loose red scribble (like the reference tote) | Photo-coming-soon cards, 404 |
| Segment icons (7) | Restaurant, cloud kitchen, caterer, hotel, bakery, distributor, home | "Who we pack for" |

### 3.9 Photography

**Now (launch):** use the existing product photos, downloaded via §10, inside **RimFrame** image frames. They sit on a White or Foil Grey blueprint grid with `mix-blend-mode: multiply`, which lifts a white photo background into the grid. If a photo is only available at 300×300, show it at no more than 300 CSS px and flag `needsReshoot: true`.

**New shoot brief (recommend to client):**
- **Products:** each SKU shot top-down and at 3/4 on seamless Yellow, Blue and Red paper, with a hard direct flash shadow. Square crop, at least 2000 px.
- **Food in use:** biryani, grills, kunafa, broast and salads in Silverpot containers. Direct flash, 35 mm feel, slightly messy (a sauce drip, a foil corner peeled back). This is the reference's "spilled latte" energy.
- **Factory:** presses mid-stroke, stacks of containers, coil rolls, hands at work (with consent), and slight motion blur.
- **Treatment:** for the factory and "in the wild" photos, use a two-tone duotone in Blue and Black at 100%, with Yellow stickers on top.

### 3.10 Icons

Use Phosphor Icons at the **Bold** weight (`@phosphor-icons/react`, imported per icon from the SSR entry) at 20 px or 24 px, in Blueprint Blue. Custom brand icons (lid, tray, roll, compartments 1/2/3) come from the illustration set.

### 3.11 Textures and states

- **Grain:** an SVG `feTurbulence` noise at 3–4% opacity, on colour sections only. It's a single fixed overlay per section, not per element.
- **Foil shimmer (loading skeleton):** a Foil Grey block with a moving linear-gradient sweep of `#FFFFFF80`, taking 1.2 s. It's the brand's own skeleton.
- **Selection:** Yellow background with Blue text.
- **Focus ring:** a 3 px Yellow outline, a 2 px Blue offset ring, and an offset of 2 px. It must be visible on every background (on Yellow, use a Blue outline plus a White offset ring).

### 3.12 Wordmark specification

- The wordmark reads `SILVERPOT` in Big Shoulders Display 900, as custom-kerned SVG paths (not live text) in `wordmark.svg`.
- **The twist:** the **O** is replaced by the foil-roll spiral (a circle with an inward spiral line and a tiny cardboard core). This is the equivalent of the reference's lowercase "i".
- **Hero use:** the wordmark fills the container width (SVG with a `viewBox`, `width: 100%`), and Crinkle sits perched on the top edge of the first **L**.
- **Header use:** height 28 px on mobile and 34 px on desktop.
- **Footer use:** full-width in Oven Red.
- **Don't add ®** unless the client confirms the trademark is registered `[CONFIRM]`.
- Keep the old logo file only as a reference: `https://silverpot.org/wp-content/uploads/2022/02/silverpot-logo-5.png`.

### 3.13 Tailwind v4 tokens (`src/app/globals.css`)

```css
@import "tailwindcss";

@theme {
  --color-yellow: #FFD21F;
  --color-blue: #0E2A8C;
  --color-red: #B8322A;
  --color-white: #FFFFFF;
  --color-foil: #E9ECF1;
  --color-black: #000000;
  --color-blue-12: rgb(14 42 140 / 0.12);

  --font-display: var(--font-big-shoulders), "Arial Narrow", sans-serif;
  --font-sans: var(--font-bricolage), system-ui, sans-serif;
  --font-hand: var(--font-gochi), cursive;
  --font-ar-display: var(--font-lalezar), var(--font-plex-ar), sans-serif;
  --font-ar: var(--font-plex-ar), system-ui, sans-serif;

  --radius-btn: 10px;
  --radius-rim: 14px;
  --radius-tile: 24px;
  --radius-plate: 4px;

  --ease-press: cubic-bezier(0.2, 0.9, 0.1, 1);
  --ease-stamp: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

:root {
  --shadow-color: var(--color-blue);
  --shadow-sm: 3px 3px 0 0 var(--shadow-color);
  --shadow-md: 5px 5px 0 0 var(--shadow-color);
  --shadow-lg: 8px 8px 0 0 var(--shadow-color);
}
[dir="rtl"] {
  --shadow-sm: -3px 3px 0 0 var(--shadow-color);
  --shadow-md: -5px 5px 0 0 var(--shadow-color);
  --shadow-lg: -8px 8px 0 0 var(--shadow-color);
}
.on-blue { --shadow-color: var(--color-yellow); }
.on-red  { --shadow-color: var(--color-blue); }

html { color: var(--color-blue); background: var(--color-white); }
::selection { background: var(--color-yellow); color: var(--color-blue); }
```

---

## 4. MOTION AND INTERACTION

### 4.1 Principles: "mechanical, with a personality"

1. **One orchestrated moment per page, no more.** The home page gets the hero stamp sequence. About gets the coil-to-container scroll story. Every other page loads calmly.
2. **Most motion answers a user action:** pressing, adding, opening, filtering, toggling. Motion shows *what changed*.
3. **No generic fade-up-on-scroll for every section** and no lift-on-hover for every card. Content is simply there.
4. **The feel is a press machine:** fast in, a hard stop, a tiny overshoot. Nothing floaty.
5. **Only transform and opacity animate.** Never animate layout properties. Nothing may cause CLS.

### 4.2 Motion tokens

| Token | Value | Use |
|---|---|---|
| `dur-press` | 120 ms | Button press, chip toggle |
| `dur-ui` | 220 ms | Drawers, menus, accordions, toasts |
| `dur-move` | 380 ms | Page wipe, quote-list fly-in |
| `dur-story` | 600–900 ms | The hero sequence (whole thing ≤ 1.4 s) |
| `ease-press` | `cubic-bezier(.2,.9,.1,1)` | Default |
| `ease-stamp` | `cubic-bezier(.34,1.56,.64,1)` | Stamps and landings (overshoot) |
| `spring-snap` | `{ type: "spring", stiffness: 520, damping: 30, mass: 0.8 }` | Lid snap, sticker drop |
| Stagger | 45 ms | Wordmark letters, menu links |

### 4.3 Signature interactions (build all of these)

1. **Hero stamp (page load, home only).**
   - The Yellow background and the H1 are visible from the first paint. The H1 is **never** at opacity 0, because it's the LCP element. It only gets a 12 px y-offset that settles.
   - The wordmark letters stamp down in sequence: from `y:-28px, scale:1.12, rotate:±3°` to rest, with a 45 ms stagger and `ease-stamp`.
   - Crinkle then drops onto the L with a squash (`scaleY .82 → 1.04 → 1`).
   - The hand note's arrow then draws in (stroke-dashoffset, 400 ms).
   - Total time is ≤ 1.4 s. If `sessionStorage` says the sequence has already played this session, skip it.
2. **Press.** All pressables (buttons, tiles, chips) use the hover/active shadow rule from §3.6.
3. **Lid snap (Add to quote).**
   - A small lid icon flips 180° and snaps onto a container icon inside the button (`spring-snap`).
   - The button label changes to "Added" for 1.2 s.
   - A 24 px ghost of the product thumbnail flies along a curved path to the header Quote button (or the bottom bar on mobile), taking 380 ms.
   - The Quote count badge does one stamp bounce, and `aria-live="polite"` announces "Added 8325 to your quote".
4. **Conveyor (scroll-coupled).** The model-code strip translates by `scrollDelta × 0.6`. It advances when you scroll down, reverses when you scroll up, and stops when you stop. Hovering a code on desktop shows a 120 px product thumbnail in a RimFrame tooltip. With reduced motion, the strip is static and wraps onto multiple lines.
5. **Dimension draw.**
   - On a product detail page, the "Show dimensions" toggle draws the dimension lines (stroke-dashoffset, 500 ms) and fades in the mm labels.
   - On desktop product-card hover, if dimensions exist, a quick 300 ms draw runs. If they don't, a single horizontal "scan line" sweeps down the image once (240 ms) like a QC scanner.
6. **Odometer.** "1997" rolls up from "0000" with each wheel stopping in sequence. It runs once, when 50% of it is in view.
7. **Foil wipe (page transition).** On route change, a Foil Grey panel with a crinkle-texture SVG and Crinkle peeking from its edge sweeps across (transform only):
   - 220 ms in, 160 ms out, for a total of ≤ 380 ms.
   - Implement it with the View Transitions API (`::view-transition-old/new` with a clip-path wipe) if the installed Next.js and React versions support it. Otherwise use an enter-only overlay in `app/[locale]/template.tsx`.
   - Never block navigation. Skip the wipe entirely with reduced motion.
8. **Sticker wall (desktop).** The "Who we pack for" stickers can be dragged within their section (motion `drag` with constraints) and land with `spring-snap` plus a 1° settle. On touch devices they're a static grid.
9. **Crinkle eyes.** Pupils track the pointer within a 3 px radius (hero and 404 only), throttled with `requestAnimationFrame`. The listener is removed when he's off-screen.
10. **Coil to container (About, scroll story).** In a sticky section, the illustration frames swap as scroll progress passes each step (§7.7). It's built with CSS scroll-driven animations where supported, with an IntersectionObserver fallback. On mobile it becomes a simple vertical step list with no pinning.

### 4.4 Micro-interactions

- **Accordions:** a plus icon rotates into an ×; height animates via `grid-template-rows: 0fr → 1fr`, which avoids layout jank.
- **Filter chips:** when selected, the chip fills Yellow, gets a 2 px Blue outline and the shadow drops to 0 ("pressed in"). The product grid reorders with the motion `layout` prop (FLIP), and the result count updates in a live region.
- **Quote drawer:** slides from the right on desktop (from the left in RTL) and is a bottom sheet with a drag handle on mobile. The backdrop is Blue at 40% opacity.
- **Toasts:** appear bottom-left on desktop and above the bottom bar on mobile, stamp in, show a tiny Crinkle, auto-dismiss after 4 s, and pause on hover.
- **Form fields:** on focus, the outline goes from 2 px to 3 px and the shadow-sm appears. On error, the field shakes horizontally once (6 px, 2 cycles, 240 ms), shows the Red message below and gets `aria-invalid`.
- **Size finder:** answer chips stamp when selected, and the progress "conveyor" moves one station.

### 4.5 Reduced motion

With `prefers-reduced-motion: reduce`:
- There's no hero sequence (everything renders at rest), no wipe, no conveyor movement, no fly-to-quote, no drag and no eye tracking.
- Keep instant state changes and short opacity fades (≤ 120 ms) only.
- Lenis is disabled.

### 4.6 Libraries and performance rules

- Use **motion** (formerly framer-motion) with `LazyMotion` and `domAnimation` features, and `m.*` components only.
- **Lenis** smooth scroll is optional: dynamically imported, desktop pointer devices only, and never on touch.
- Use **rough-notation** for the hand-drawn underlines and circles in the manifesto and on 404. It's dynamically imported.
- The marquee, shimmer and grain are pure CSS and SVG.
- Every animation component is a client component kept as a leaf. Pages stay server components.

---

## 5. TECH STACK AND ARCHITECTURE

### 5.1 Stack

| Concern | Choice |
|---|---|
| Framework | Next.js, latest stable, App Router, React Server Components, TypeScript strict mode |
| Package manager | pnpm |
| Styling | Tailwind CSS v4 (CSS-first `@theme`), CSS Modules only where Tailwind is awkward (SVG keyframes) |
| UI primitives | Radix UI (Dialog, Accordion, Select, Tabs, Tooltip, Toggle Group, Popover). All styled by us; no shadcn default look. |
| Motion | `motion` (LazyMotion), `lenis` (optional, desktop), `rough-notation` |
| Icons | `@phosphor-icons/react` (Bold) |
| i18n | `next-intl` (`en` default with no prefix, `ar` at `/ar`) |
| Forms | `react-hook-form` + `zod` + Server Actions |
| Email | Resend (`resend` SDK) with React Email templates |
| Spam protection | Cloudflare Turnstile (invisible) + honeypot field + per-IP rate limit (Upstash Ratelimit, if env is present) |
| Client state | `zustand` with `persist` (localStorage, wrapped in try/catch) for the quote list |
| Search | `cmdk` command palette + `fuse.js` over the local product index |
| Images | `next/image` (AVIF, WebP), local files in `/public/images/products` |
| SEO | Metadata API, `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, JSON-LD components |
| Analytics | Vercel Analytics + Speed Insights (cookieless, so no cookie banner is needed). GA4 via `@next/third-parties` only if the client insists, with consent mode. |
| Hosting | Vercel (production branch `main`, preview deployments with `NEXT_PUBLIC_REVIEW_MODE=true`) |
| Quality | ESLint, Prettier, `@axe-core/playwright` tests, Playwright smoke tests, Lighthouse CI |

### 5.2 Folder structure

```
silverpot/
├─ docs/  MASTER_PROMPT.md  DECISIONS.md  NEW_COPY.md  QA.md  IMAGES_REPORT.md
├─ messages/  en.json  ar.json                 # all UI strings
├─ public/
│  ├─ images/products/{slug}-{n}.jpg          # downloaded by script
│  ├─ images/brand/  (og-default.png, logo-old-reference.png)
│  └─ fonts/ (none — next/font handles fonts)
├─ scripts/  fetch-images.ts  verify-redirects.ts
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx  template.tsx  page.tsx (home)
│  │  │  ├─ products/page.tsx
│  │  │  ├─ products/[category]/page.tsx
│  │  │  ├─ products/[category]/[slug]/page.tsx
│  │  │  ├─ size-finder/page.tsx
│  │  │  ├─ wholesale/page.tsx
│  │  │  ├─ about/page.tsx
│  │  │  ├─ sustainability/page.tsx
│  │  │  ├─ faq/page.tsx
│  │  │  ├─ contact/page.tsx
│  │  │  ├─ quote/page.tsx                      # noindex
│  │  │  ├─ privacy/page.tsx  terms/page.tsx
│  │  │  └─ not-found.tsx  error.tsx  loading.tsx
│  │  ├─ actions/  quote.ts  contact.ts  wholesale.ts
│  │  ├─ sitemap.ts  robots.ts  manifest.ts  opengraph-image.tsx  icon.svg
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ primitives/  Button Chip Sticker RimFrame DataPlate HandNote Stamp HazardTape RegistrationMarks BlueprintGrid Odometer Section
│  │  ├─ brand/  Wordmark Crinkle Conveyor FoilWipe
│  │  ├─ illustrations/  *.tsx (SVG components)
│  │  ├─ catalogue/  ProductCard CategoryTile FilterBar ProductGrid DimensionOverlay Gallery QuantityStepper SiblingSwitch
│  │  ├─ quote/  QuoteButton QuoteDrawer QuoteList AddToQuote store.ts whatsapp.ts
│  │  ├─ layout/  Header MegaMenu MobileMenu Footer TopBar BottomBar CommandSearch LanguageToggle
│  │  ├─ forms/  Field Input Select Textarea Checkbox PhoneInput FormStatus
│  │  └─ seo/  JsonLd.tsx  schemas.ts
│  ├─ data/  site.ts  categories.ts  products.ts  usecases.ts  faq.ts  sizeFinder.ts  redirects.ts
│  ├─ lib/  i18n.ts  review-mode.ts  format.ts  analytics.ts  ratelimit.ts
│  └─ middleware.ts  (or proxy.ts — follow the installed Next.js version)
└─ tests/  smoke.spec.ts  a11y.spec.ts  redirects.spec.ts
```

### 5.3 Rendering strategy

- Every catalogue, category, product and content page is **statically generated** (`generateStaticParams` for both locales). There's no runtime database.
- Forms use **Server Actions**.
- Only the interactive islands are client components: quote store, drawer, filters, command search, motion leaves, size finder, Crinkle eyes.
- Fonts come from `next/font` (self-hosted at build). There are zero third-party requests on first load.

### 5.4 Quote list (the cart replacement)

There are no prices and no online payment in v1. Buyers build a **quote list** and send it.

```ts
// src/components/quote/store.ts
type QuoteItem = { productId: string; qty: number; unit: 'cartons' | 'pieces'; note?: string };
type QuoteState = {
  items: QuoteItem[];
  add(productId: string, qty?: number): void;   // default qty 1 carton; increments if already present
  setQty(productId: string, qty: number): void; // min 1, max 9999
  setUnit(productId: string, unit: QuoteItem['unit']): void;
  remove(productId: string): void;
  clear(): void;
};
// persist key: 'silverpot-quote-v1'. Wrap storage access in try/catch; fall back to in-memory.
```

**WhatsApp hand-off** (`whatsapp.ts`):
```
Hi Silverpot! I'd like a quote for:
• 8325 – Aluminium Container with Lid — 20 cartons
• Aluminium Foil Roll 45 cm × 37.5 sq ft — 10 cartons
Delivery to: Dubai
Name: {name} | Company: {company}
(sent from silverpot.org)
```
URL: `https://wa.me/971508494521?text=${encodeURIComponent(message)}` `[CONFIRM WhatsApp number]`

### 5.5 Forms and email

**Three Server Actions: `quote`, `contact`, `wholesale`.** Each one:
1. validates with Zod (the same schema runs on the client);
2. checks the honeypot, the Turnstile token and the rate limit (5 per IP per 10 minutes);
3. sends an email to `SALES_EMAIL` with a React Email template (Silverpot-branded, plain-text fallback);
4. sends an auto-reply to the customer ("Quote request sent. We'll reply within [CONFIRM] working hours.");
5. returns `{ ok: true }` or field errors.

**Error strings** must be specific: "Enter a phone number with country code, for example +971 50 123 4567", not "Invalid input".

### 5.6 Internationalisation

- `next-intl` with `localePrefix: 'as-needed'`: English lives at `/`, Arabic at `/ar/...`.
- The `<html lang dir>` attributes are set per locale. Use logical properties throughout (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`).
- Load Arabic fonts **only** in the `ar` layout.
- Wrap model codes and phone numbers in `<bdi dir="ltr">`.
- Mirror these: arrows, shadows (§3.13), drawer side, conveyor direction and the page-wipe direction.
- Product names, descriptions and taglines live in data with `{ en, ar }`. Fill in Arabic as machine drafts marked `arReviewed: false`. In review mode, show a small "AR draft" badge on them.

### 5.7 Environment variables

```
NEXT_PUBLIC_SITE_URL=https://silverpot.org
NEXT_PUBLIC_REVIEW_MODE=false
NEXT_PUBLIC_WHATSAPP_NUMBER=971508494521
SALES_EMAIL=info@silverpot.org
RESEND_API_KEY=
RESEND_FROM="Silverpot <quotes@silverpot.org>"
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=        # optional
UPSTASH_REDIS_REST_TOKEN=      # optional
```

### 5.8 Security headers (`next.config` → `headers()`)

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Frame-Options: SAMEORIGIN`
- A Content-Security-Policy allowing `'self'`, Vercel Analytics, `challenges.cloudflare.com` (Turnstile) and `www.google.com/maps` (embed, only after the user clicks the map facade). Use nonces for inline JSON-LD if CSP requires it.

### 5.9 Analytics events

| Event | Properties |
|---|---|
| `add_to_quote` | productId, modelCode, category, source (card, pdp, finder) |
| `quote_submit` | itemCount, totalQty, emirate |
| `quote_whatsapp` | itemCount |
| `whatsapp_click` | location (topbar, pdp, contact, float, cta) |
| `call_click` / `email_click` | location |
| `filter_change` | filter, value |
| `search_used` | queryLength, resultCount, hitModelCode (bool) |
| `size_finder_complete` | food, servings, compartments, resultCount |
| `contact_submit` / `wholesale_submit` | type |
| `crinkle_click` | — (it's fun to know) |

---

## 6. INFORMATION ARCHITECTURE

### 6.1 Sitemap and URLs

| Page | URL (EN) | URL (AR) | Index? |
|---|---|---|---|
| Home | `/` | `/ar` | yes |
| All products | `/products` | `/ar/products` | yes |
| Containers | `/products/containers` | `/ar/products/containers` | yes |
| Platters | `/products/platters` | `/ar/products/platters` | yes |
| Foil | `/products/foil` | `/ar/products/foil` | yes |
| Product detail (×26) | `/products/{category}/{slug}` (§9.3) | `/ar/products/{category}/{slug}` | yes |
| Size finder | `/size-finder` | `/ar/size-finder` | yes |
| Wholesale | `/wholesale` | `/ar/wholesale` | yes |
| About | `/about` | `/ar/about` | yes |
| Sustainability | `/sustainability` | `/ar/sustainability` | yes |
| FAQ | `/faq` | `/ar/faq` | yes |
| Contact | `/contact` | `/ar/contact` | yes |
| Your quote | `/quote` | `/ar/quote` | **noindex** |
| Privacy | `/privacy` | `/ar/privacy` | yes |
| Terms | `/terms` | `/ar/terms` | yes |
| Filtered or searched lists | `/products?…` | | noindex; canonical points to the unfiltered page |

URL slugs stay in English in both locales (stable and shareable). Only the content is translated.

### 6.2 Header

**Top bar** (Blue, 36 px, Yellow text, `small`). This is static, not a marquee.
- Left: "Factory-direct from Ajman since 1997".
- Right: a WhatsApp icon with "Bulk quotes on WhatsApp", linking to `wa.me`.
- On mobile, only the right-hand item is shown, centred.

**Main header** (White, 2 px Blue bottom border, 72 px desktop / 60 px mobile; hides on scroll down and reappears on scroll up; shrinks to 60 px after 80 px of scroll)
- **Desktop, left to right:**
  - Wordmark (links to `/`).
  - Nav: Products (opens the mega menu), Wholesale, About, Sustainability, FAQ, Contact.
  - Search button, labelled "Search" with a ⌘K / Ctrl K hint; `/` also opens it.
  - Language toggle "EN | عربي".
  - **Quote button**: White, 3 px outline, shadow-sm, count badge in Red. It reads "Quote (3)".
- **Mega menu (Products):** a full-width White panel with a 2 px border.
  - Three category columns, each with its illustration, the model count and the first six model codes as quick links (Big Shoulders 800).
  - A fourth column holds a Yellow card: "Not sure which size? Try the size finder."
  - Opens on click and on hover-intent (150 ms delay). Esc closes it and focus is trapped while it's open.
- **Mobile, left to right:** wordmark, then a Search icon, then a Quote icon with badge, then a "Menu" button (Yellow fill, Blue outline, shadow-sm).
- **Mobile menu:** a full-screen Yellow overlay.
  - Giant links (Bricolage 800, 44 px) stamp in with a 45 ms stagger.
  - The Products link expands into an accordion of the three families.
  - At the bottom: two buttons, "Call +971 6 743 1314" and "Chat on WhatsApp", plus the language toggle.
  - Crinkle `peek` sits in the bottom corner. Focus is trapped and Esc closes the menu.

### 6.3 Footer

On a White background:
1. **Four columns** (stacked accordions on mobile):
   - **Products:** Containers, Platters, Foil, All products, Size finder.
   - **Company:** About, Wholesale, Sustainability, FAQ.
   - **Contact:** +971 6 743 1314, +971 50 849 4521 (WhatsApp), info@silverpot.org, "Ajman, United Arab Emirates" (+ street address `[CONFIRM]`), factory hours `[CONFIRM]`.
   - **Follow:** Instagram, Facebook, Pinterest, YouTube. Show only the ones with confirmed URLs.
2. **Giant wordmark:** full width, Oven Red, with Crinkle `peek` looking out from the foil-spiral O.
3. **Legal bar** (Blue background, White `small` text): "© {year} Al Mohamadi Light Industries Co. LLC. Silverpot is a trading name of Al Mohamadi Light Industries Co. LLC `[CONFIRM wording]`", followed by the Privacy and Terms links and the language toggle.

### 6.4 Global elements

- **Floating WhatsApp button:** a round sticker (Yellow, Blue outline, shadow-md) at the bottom right (bottom left in RTL), 56 px. It appears after 30% of scroll and is hidden on pages that already show the mobile bottom bar.
- **Mobile bottom bar** (product detail and category pages, < 768 px): fixed, White, 2 px top border, safe-area padding.
  - On product detail pages: [quantity stepper] [**Add to quote** (Red)] [WhatsApp icon].
  - On category pages: [Filters (opens a bottom sheet)] [Quote (n)].
- **Command search** (⌘K, Ctrl K or `/`):
  - Searches model code, name, family and use cases with Fuse.js.
  - Results show a thumbnail, the code in Big Shoulders, the name and the family chip.
  - Typing digits only boosts exact and prefix code matches. Enter opens the product, and Shift+Enter adds it to the quote.
  - Empty state: "No match for "{q}". Try a model code like 8325, or ask us on WhatsApp."
- **Toasts:** see §4.4.
- **Skip link:** "Skip to content", visible on focus.

---

## 7. PAGE-BY-PAGE SPECIFICATION (layout, copy, motion)

Copy in **quotes** is final English copy. `[CONFIRM]` items are wired to data or flags and hidden in production until confirmed.

### 7.1 HOME `/`

#### H1 — Hero (Signal Yellow, full-bleed)

Purpose: the most characteristic thing in Silverpot's world (foil, a container, a factory stamp), shown in the first second.

```
DESKTOP (≥1024)
┌───────────────────────────────────────────────────────────────────────┐
│⊕                                                                     ⊕│
│     (Crinkle perched on the L)                                         │
│  S I L V E R P (foil-spiral O) T      ← wordmark, full width, Blue     │
│                                                                        │
│  H1  Aluminium containers                         ╭──────────────╮     │
│      and foil that take the heat.                 │ MADE IN AJMAN│ ←stamp
│  Sub Pressed in Ajman since 1997 for…             │  SINCE 1997  │  (Red, 8°)
│  [ Browse products ]  [ Get a bulk quote ]        ╰──────────────╯     │
│  ↖ "meet Crinkle. head of QC*"                    container-legs ⟶    │
│⊕                                                  "*unofficially"    ⊕│
└───────────────────────────────────────────────────────────────────────┘

MOBILE (360–767)
┌──────────────────────┐
│ (Crinkle)            │
│ SILVERP(O)T          │  full width
│ "meet Crinkle ↗"     │
│ H1 (3–4 lines)       │
│ Sub (2–3 lines)      │
│ [Browse products]    │  full width
│ [Get a bulk quote]   │  full width
│        (stamp)       │
└──────────────────────┘
```

- **Height:** `min-height: calc(100svh - header)`, capped at 920 px. On mobile it's content height plus 48 px.
- **Wordmark:** decorative `role="img" aria-label="Silverpot"`. The **H1 is the real heading.**
- **H1:** "Aluminium containers and foil that take the heat."
- **Sub (`body-l`, max 46ch):** "Pressed in Ajman since 1997 for restaurants, caterers, cloud kitchens and every kitchen in between."
- **Buttons:**
  - Primary (Red, White text, shadow-md): "Browse products", linking to `/products`.
  - Secondary (White, Blue outline): "Get a bulk quote", linking to `/wholesale#quote`.
- **Hand note (Gochi Hand, Blue, rotated −4°, with a curved arrow to Crinkle):** "meet Crinkle. head of QC*". Below it, smaller: "*unofficially".
- **Stamp:** circular stencil "MADE IN AJMAN · SINCE 1997" (the dot is part of the stamp art) in Red at 85%, rotated 8°. On desktop it sits to the right of the H1; on mobile it sits under the buttons, centred.
- **Corner art (desktop only):** `container-legs.svg` walking off the bottom-right edge.
- **Registration marks** at all four corners.
- **Motion:** the hero stamp sequence (§4.3-1). The foil-spiral O rotates 0→90° as the hero scrolls out (scroll-linked, transform only).

#### H2 — Conveyor strip (White, 2 px Blue lines top and bottom)

- Height: 76 px (desktop) / 56 px (mobile).
- Content: every model code, in Big Shoulders 900 at 44 px (desktop) / 30 px (mobile), in Blue, separated by small Yellow foil-ball glyphs: `8325 8342 8357 8367 8389 83120 83120E 83166 83185 83241 73365 8576 6550 6586 65180 65220 30 CM 45 CM`.
- Each code links to its product. The strip is `aria-hidden="true"` and its links have `tabindex="-1"`, because the real navigation exists elsewhere.
- Motion: the scroll-coupled conveyor (§4.3-4).

#### H3 — Manifesto (White, centred, narrow)

Max width 34rem; `body-l`; 96 px of vertical padding. The OFFBRIEF-style quiet paragraph between loud blocks.

> "**Silverpot** has been pressing aluminium in Ajman since 1997. We make the containers, platters and foil that carry the UAE's food from kitchen to table: the cafeteria on the corner, the cloud kitchen with 40 riders, the wedding buffet down the road.
>
> Our products are made to be used once and recycled forever. Our standards are made to last a lot longer."

- "Silverpot" gets a red hand-drawn underline (rough-notation `underline`, Red, 2 px). It draws once, when the paragraph is 60% in view.

#### H4 — Bento: "Light metal. Heavy duty." (12-column bento)

```
DESKTOP
┌──────────────────────────────┬───────────────────────┐
│ BLUE (cols 1–7, rows 1–2)    │ WHITE + blueprint grid │
│                              │ container-deadlift.svg │
│  Light metal.                │ "lifts more biryani    │
│  Heavy duty.  (Yellow, h2×1.4)│  than you'd think*"    │
│                              ├───────────┬────────────┤
│              "wait… both?" ↙ │ YELLOW    │ RED        │
│                              │ 1997 odo  │ 26         │
└──────────────────────────────┴───────────┴────────────┘
MOBILE: Blue tile (full) → White tile (full) → Yellow + Red side by side
```

- **Blue tile:** H2 "Light metal. Heavy duty." in Yellow at 1.4× the h2 size. Body (White, `body`, max 38ch): "Aluminium weighs next to nothing and handles almost everything: oven heat, freezer cold, a full delivery bag. We just make sure it's done properly." `[CONFIRM: the oven and freezer claims apply to the range]`. Hand note (Yellow): "wait… both?"
- **White tile:** the illustration, plus a hand note: "lifts more biryani than you'd think*". Footnote (`small`): "*Not lab tested. Emotionally accurate."
- **Yellow tile:** Odometer "1997" (Big Shoulders 900, 88 px) with the label "Pressing aluminium since".
- **Red tile:** "26" (Big Shoulders 900, 88 px, White) with the label "products across 3 families".
- Tiles are content, not buttons, so they have **no shadows** (encoding rule). Corners are 24 px. There's a 16 px gap between tiles.
- Motion: only the odometer (§4.3-6).

#### H5 — Pick your family (White)

- H2: "Pick your family."
- Three **CategoryTiles** (3 columns on desktop, stacked on mobile, 4:5 aspect on desktop, 16:11 on mobile):

| Tile | Background | Image | Sticker | Title | Line |
|---|---|---|---|---|---|
| Containers | Yellow | 8325 photo in RimFrame + `biryani-tray` doodle | "13 models" | "Containers with lids" | "Lids on. Drama off." |
| Platters | Red (White text) | 6586 photo + `kunafa-tray` | "4 models" | "Platters" | "Made for sharing. Also for not sharing." |
| Foil | Blue (White/Yellow text) | 45 cm × 37.5 sq ft photo + `shawarma-wrap` | "9 products" | "Foil rolls and packs" | "30 cm or 45 cm. Choose your fighter." |

- Each tile is one link with a hard shadow-md, because it's pressable. Use the press interaction only, with no hover lift.

#### H6 — Start with these (Foil Grey band)

- H2: "Start with these."
- Sub: "Eight of our most-ordered models. `[CONFIRM: replace with real bestsellers]`" In production, if unconfirmed, the sub reads: "A few good places to start."
- A **horizontal scroll-snap rail** of `ProductCard`s (featured products, §9.3).
  - Desktop shows 4 cards with Prev/Next buttons (Blue outline, shadow-sm); mobile shows 1.3 cards so the next one peeks in.
  - The progress indicator is a thin "conveyor" track with a Yellow block.
- Link at the end: "See all 26 products".

#### H7 — Size finder teaser (White section, Yellow card inside)

- The card has a 24 px radius and a Blue outline but **no shadow**; its chips do have shadows.
- H2: "Not sure which size?"
- Body: "Tell us what you're packing and for how many. We'll point you to the right model, or to someone who knows."
- Chips (step 1 inline): Biryani and rice · Grills · Curries · Kunafa and desserts · Salads · Broast · Meal combos · Wrapping. Clicking a chip opens `/size-finder?food={id}`.
- Art: Crinkle `clipboard`.

#### H8 — Who we pack for (White)

- H2: "Who we pack for."
- **Sticker wall:** seven die-cut stickers. Each has an illustration, a label (h4) and a one-liner (`small`):

| Sticker | One-liner |
|---|---|
| Restaurants and cafeterias | "Takeaway that travels like dine-in." |
| Cloud kitchens | "Built for the delivery bag." |
| Caterers and events | "Platters for the main event." |
| Hotels and banquets | "Back-of-house heavy lifting." |
| Bakeries and sweet shops | "Kunafa's favourite tray." |
| Distributors and supermarkets | "Stock that keeps moving." `[CONFIRM retail and distribution]` |
| Home kitchens | "Yes, the good foil is for you too." `[CONFIRM B2C]` |

- Desktop: stickers are absolutely positioned in a 1200×520 "board" and are draggable (§4.3-8). Mobile: a 2-column grid.
- Below the wall: a button link "Bulk and wholesale orders" to `/wholesale`.

#### H9 — Use once. Recycle forever. (Oven Red, full-bleed)

- **Left (cols 1–6):**
  - H2 (White): "Use once. Recycle forever."
  - Body (White): "Aluminium can be recycled again and again without losing its quality. So "disposable" really just means "between jobs"."
  - Button (Yellow, Blue text, shadow-md Blue): "How to recycle us", linking to `/sustainability`.
- **Right (cols 7–12):** `recycle-loop.svg` in White lines with Yellow offset fills, and a Crinkle speech bubble: "Not trash. Pre-recycled."

#### H10 — Why order from the factory? (White)

- H2: "Why order from the factory?"
- Four cards (2×2 on mobile, 4 across on desktop). They're informational, so **no shadows and no numbers**. Each has a Blue outline, a 14 px rim, an icon illustration, an h4 and body text:

| Title | Body |
|---|---|
| "Factory-direct" | "Straight from our Ajman production floor to your store room." |
| "Delivered with care" | "Packed to arrive the way it left. Delivery across the UAE. `[CONFIRM coverage]`" |
| "Ready for bulk" | "Order by the carton or by the pallet. `[CONFIRM MOQ]`" |
| "Real people" | "Call, email or WhatsApp. Someone who knows the product will answer." |

#### H11 — In the wild (Blueprint Blue) — feature flag `showWildGrid`, off until photos exist

- H2 (Yellow): "Seen in the wild."
- A 3×3 grid (2 columns on mobile) mixing client usage photos (Blue/Black duotone) and illustrated quote tiles, with hand-written captions in White/Yellow: "Kunafa, delivered warm." · "Shawarma's best friend." · "Leftovers, but organised." · "Biryani for forty." · "Grill night, sorted."
- Link: "Follow us on Instagram", shown only if the URL is confirmed.

#### H12 — Quick answers (White)

- H2: "Quick answers."
- An accordion of the four FAQ items flagged `homeTeaser: true` (§9.7), then the link "All questions" to `/faq`.

#### H13 — Bulk CTA (hazard-tape seam, then Signal Yellow)

- A hazard tape strip (§3.7-5) across the top seam.
- H2 at display size: "Need 10,000 by Thursday?"
- Body: "Tell us what you need and where it's going. We'll come back with price, stock and timing."
- Buttons: "Get a quote" (Red, links to `/quote` if the list has items, otherwise `/wholesale#quote`) · "Chat on WhatsApp" (White) · "Call +971 6 743 1314" (text link with phone icon).
- Art: Crinkle `hard-hat`.

#### Footer: as §6.3.

---

### 7.2 ALL PRODUCTS `/products`

**Header band (Yellow, 2 px Blue bottom line)**
- H1: "All products."
- Sub: "26 products in 3 families. Search by model code if you know it."
- A large search field (64 px tall, 3 px Blue outline, shadow-md) with the placeholder "Search a model code or product, for example 8325". It filters the grid live and updates `?q=`.

**Filter bar** (sticky below the header; White; desktop shows it inline, mobile has a "Filters" button that opens a bottom sheet)
- Family: All · Containers · Platters · Foil (chips with counts).
- When the family is Containers: Compartments 1 · 2 · 3.
- When the family is Foil: Width 30 cm · 45 cm, and Type: Household roll · Catering roll · Promo pack.
- Sort: "Model code (low to high)" (default), "Model code (high to low)", "Name A–Z".
- "Clear filters" appears when any filter is active.
- State lives in the URL query (shareable). Filtered URLs carry `noindex, follow` and a canonical to `/products`.
- A live region announces: "Showing 13 containers".

**Grid**
- 2 columns (< 768), 3 columns (768–1279), 4 columns (≥ 1280); 16 / 24 / 32 px gaps.
- When the family is "All", products are grouped under family headers: a full-width h2 band in the family colour with the family name and count.
- Reorder animation: FLIP via motion `layout` (§4.4).

**Empty state:** Crinkle `deadpan`, with "Nothing matches that. Try a different model code or clear the filters." Buttons: "Clear filters" and "Ask on WhatsApp".

**Footer band:** "Can't find your size? Tell us what you need." with the button "Chat on WhatsApp".

### 7.3 CATEGORY PAGES `/products/{category}`

These use the same template as §7.2 with the family pre-selected, plus:
- A header band in the family colour, with an H1 and an intro paragraph (copy below, roughly 90–140 words for SEO).
- A family FAQ (3 items) at the bottom, with FAQPage JSON-LD.
- ItemList JSON-LD (§11.3).

**Containers** (Yellow band)
- H1: "Aluminium containers with lids"
- Intro: "Thirteen models, one job: get food from your kitchen to someone's table looking like it never left. Every Silverpot container is pressed from aluminium in our Ajman facility and comes with a matching lid. Pick a single-compartment model for everyday takeaway, split a meal with the 2- or 3-compartment 8576, or go straight to the 83166, shaped for broast. Not sure which size fits your portions? Use the size finder or send us your menu on WhatsApp. We'll match it to a model code."
- Hand note: "lids on. drama off."

**Platters** (Red band, White text)
- H1: "Aluminium platters"
- Intro: "Four platters for food that's meant to be shared: catering trays, buffet lines, majlis spreads and big family orders. Models 6550, 6586, 65180 and 65220 are pressed from aluminium in Ajman for kitchens that serve the whole room at once. Need a lid, a specific size or a mixed carton? Add the models to your quote and tell us. `[CONFIRM: shapes, sizes, lid options]`"
- Hand note: "for the main event."

**Foil** (Blue band, White text)
- H1: "Aluminium foil rolls and packs"
- Intro: "Aluminium foil in two widths: 30 cm for everyday kitchens, and 45 cm for wide trays and professional prep. Choose household rolls from 13.5 to 200 sq ft, catering rolls in 150 m and 300 m lengths for busy kitchens, or promo packs built for retail shelves. Wrap shawarma, line trays, cover a biryani and keep the heat where it belongs."
- Hand note: "choose your fighter: 30 or 45."

### 7.4 PRODUCT DETAIL `/products/{category}/{slug}`

```
DESKTOP (cols 1–7 | cols 8–12)
┌────────────────────────────────────┬────────────────────────────┐
│ Breadcrumbs                        │                            │
│ ┌─ RimFrame + blueprint grid ────┐ │ [Family sticker]           │
│ │⊕  watermark 8325 (6% blue)   ⊕│ │ MODEL                      │
│ │        product photo           │ │ 8325   ← code-xl           │
│ │   (dimension lines on toggle)  │ │ H1 Aluminium Container     │
│ │⊕                             ⊕│ │    with Lid – 8325         │
│ └────────────────────────────────┘ │ "tagline" (hand, Red)      │
│ [thumb][thumb]   (◉ Show dimensions)│ Description                │
│  ← sticky while right column scrolls│ Good for: (chips)          │
│                                    │ ┌ DataPlate ─────────────┐ │
│                                    │ │• Model 8325           •│ │
│                                    │ │  Compartments 1        │ │
│                                    │ │  Lid  Included         │ │
│                                    │ │  More specs on request │ │
│                                    │ └────────────────────────┘ │
│                                    │ [– 1 +] cartons            │
│                                    │ [ Add to quote ] [WhatsApp]│
│                                    │ Siblings: (2C | 3C)        │
└────────────────────────────────────┴────────────────────────────┘
Below: Pairs well with (rail) → Family FAQ → Bulk CTA band
MOBILE: Breadcrumbs → swipe gallery → code-xl + H1 → tagline → description → chips → DataPlate → siblings → pairs → FAQ; sticky bottom bar [– 1 +][Add to quote][WA]
```

- **Breadcrumbs:** Home / Products / {Family} / {Model code}, with BreadcrumbList JSON-LD.
- **Gallery:**
  - The RimFrame image frame sits on a Foil Grey blueprint grid with registration marks and a huge 6% Blue watermark of the model code behind the photo.
  - Clicking zooms into a Radix Dialog with pinch zoom on mobile.
  - Multiple images show as thumbnails; mobile uses a scroll-snap carousel with dots.
  - **"Show dimensions" toggle:** shown only if `specs.dimensionsMm` is confirmed. It draws the dimension overlay (§4.3-5).
  - **No photo:** show the `PhotoComingSoon` card (Foil Grey frame, the product illustration, a red scribble and a sticker reading "Photo coming soon").
- **Right column:**
  - Family sticker.
  - "Model" label (`small`) above the code in `code-xl`.
  - H1 = product name.
  - Tagline in Gochi Hand, Red.
  - Description (`body-l`).
  - "Good for" chips. These are static chips, not buttons, with no shadow.
- **DataPlate rows** (only confirmed values are shown in production):
  - Model code · Family · Compartments · Lid · Capacity (ml) · Top dimensions (mm) · Depth (mm) · Roll width · Roll length · Pieces per pack · Packs per carton · Pieces per carton · Oven-safe · Freezer-safe · Material.
  - **If more than half the rows are unconfirmed,** collapse them into one row: "More specs on request", with a "Ask about {code}" button that opens WhatsApp with "Hi Silverpot, can you share the full specs for model {code}?".
- **Quantity stepper:** a unit toggle "Cartons | Pieces" (default Cartons), with − and + buttons (44 px each) and a typeable input from 1 to 9999.
- **Primary button:** "Add to quote" (Red, full width on mobile) with the lid-snap interaction (§4.3-3).
- **Secondary button:** "Ask on WhatsApp" (White), which pre-fills "Hi Silverpot, I'm interested in model {code} – {name}. Quantity: {qty} {unit}."
- **Siblings switch:** a segmented control for related variants: 8576 2-compartment | 3-compartment, and 83120 | 83120E. Switching navigates to the sibling product with no full reload (Link + shared layout).
- **Spec sheet button (flag `specSheets`, off):** "Download spec sheet (PDF)".
- **Pairs well with:** a rail of three products (from data `pairsWith`; default: foil rolls for containers and platters, containers for foil).
- **Family FAQ:** three items.
- **Bulk CTA band** (Yellow, compact): "Ordering in bulk? Send the whole list at once." with the button "View your quote (n)".

### 7.5 SIZE FINDER `/size-finder`

- Full-width White page with a Foil Grey card in the centre (max 760 px).
- **Progress:** a conveyor track with 3 stations ("Food", "Servings", "Compartments"). These are a real sequence, so they're numbered 1–3.
- **Step 1:** "What are you packing?" Large chips with doodles: Biryani and rice · Grills and BBQ · Curries and gravies · Kunafa and desserts · Salads and cold food · Broast and fried chicken · Meal combos · Wrapping and covering.
- **Step 2:** "For how many people?" Chips: 1 · 2 · 3–4 · 5–8 · 10–20 · 20+.
- **Step 3:** "Need compartments?" Chips: No · 2 compartments · 3 compartments. This step is skipped automatically for wrapping and covering.
- **Result:**
  - H2: "Here's where we'd start."
  - Recommended products (ProductCards), each with a one-line reason from the rules (§9.6).
  - When the rules can't decide on a single size (capacity data not yet confirmed), show the matching family plus: "We'll confirm the exact model on WhatsApp." with the button "Send my answers on WhatsApp", which pre-fills the food, servings and compartments.
  - Secondary: "Start again".
- Each step is reflected in the URL (`?food=&servings=&comp=`) so results can be shared, and the back button works.

### 7.6 WHOLESALE `/wholesale`

1. **Hero (Blue):**
   - H1 (Yellow): "By the carton. By the pallet. By Thursday?"
   - Sub (White): "Factory-direct aluminium packaging for restaurants, cloud kitchens, caterers, hotels, bakeries and distributors across the UAE. `[CONFIRM GCC]`"
   - Buttons: "Send a quote request" (Yellow, scrolls to the form) and "Chat on WhatsApp".
   - Art: `delivery-bag.svg`.
2. **How ordering works (White).** This is a real sequence, so it's numbered 1–4 with big Big Shoulders numerals:
   1. "Build your list": "Add models to your quote and set quantities in cartons."
   2. "Send it": "Submit the form, or send the list to us on WhatsApp in one tap."
   3. "Get your quote": "We confirm price, stock and lead time `[CONFIRM: within X working hours]`."
   4. "Delivered": "Straight from Ajman to your door `[CONFIRM delivery areas and lead times]`."
3. **Who we supply:** the sticker wall from H8 (static grid here), each with a longer line:
   - **Restaurants and cafeterias:** "Everyday takeaway sizes, consistent from carton to carton."
   - **Cloud kitchens:** "Containers that stack in the bag and arrive in one piece."
   - **Caterers and events:** "Platters and large containers for buffets and banquets."
   - **Hotels and banquets:** "Back-of-house volume, delivered on schedule."
   - **Bakeries and sweet shops:** "Trays for kunafa, umm ali and anything baked."
   - **Distributors and supermarkets:** "Retail foil packs and trade cartons." `[CONFIRM]`
4. **Terms at a glance:** a DataPlate with MOQ, lead time, delivery areas, payment terms and samples. Every value is `[CONFIRM]`. In production the whole section is hidden until at least three values are confirmed.
5. **Custom and private label (flag `privateLabel`, off):** "Your brand on our lids." `[CONFIRM offered]`
6. **Quote / distributor form** (`#quote`, Foil Grey section, White card):
   - H2: "Tell us what you need."
   - Fields:
     - Company name* · Contact name* · Email* · Phone (with country code)*.
     - Business type* (select: Restaurant/cafeteria, Cloud kitchen, Caterer/events, Hotel/banquet, Bakery/sweets, Distributor/wholesaler, Supermarket/retail, Other).
     - Emirate or country* (select: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah, Outside the UAE).
     - Estimated monthly volume (select: Under 50 cartons, 50–200, 200–1,000, 1,000+).
     - Products of interest (checkbox chips: Containers, Platters, Foil).
     - Message.
     - Consent checkbox*: "I agree to Silverpot contacting me about this request." (links to Privacy).
   - If the quote list has items, show them inline above the form, editable.
   - Submit: "Send quote request".
   - Success state: Crinkle `thumbs-up`, "Quote request sent." Subline: "Your quote is in the oven. We'll reply within [CONFIRM] working hours."

### 7.7 ABOUT `/about`

1. **Hero (Blue):**
   - H1 (Yellow): "Pressing aluminium in Ajman since 1997."
   - The 1997 odometer.
   - Art: Crinkle `hard-hat` + `dallah-foil.svg` (the local cue).
2. **Our story (White, 2 columns):**
   - Text (max 62ch):
     > "Al Mohamadi Light Industries Co. LLC started in 1997 in the Emirate of Ajman, making and distributing disposable packaging for the food business. Nearly three decades later, the name on the carton is Silverpot, and the job hasn't changed: make aluminium containers, platters and foil that kitchens can trust on their busiest day.
     >
     > We've invested in modern machinery and in a team that knows the difference between "almost right" and right. We aim for products that are high quality, easy to use and responsible by design, because packaging that's used once still has to work perfectly."
   - Image: `About-Pic-1-1.png` from the old site, **only if** it shows the real factory or products. Otherwise use `press-machine.svg` and flag that a factory photo is needed.
3. **From coil to container (scroll story, Foil Grey with blueprint grid).** This is a real sequence, so it's numbered 1–6. Desktop uses a sticky 2-column layout (illustration frame left, steps right); mobile is a vertical list. `[CONFIRM the process wording with the factory]`

   | # | Title | Line | Hand note |
   |---|---|---|---|
   | 1 | Coil | "It starts as a coil of aluminium foil stock." | "heavy. very heavy." |
   | 2 | Feed | "The coil unrolls into the press line, flat and fast." | — |
   | 3 | Press | "A die presses each sheet into shape in a single stroke." | "loud. very loud." |
   | 4 | Trim and rim | "Edges are trimmed and the rim is rolled so lids sit tight." | — |
   | 5 | Check and count | "Containers are checked, counted and stacked." | "Crinkle supervises. allegedly." |
   | 6 | Pack and ship | "Cartons are packed, labelled and sent out across the UAE." | — |

4. **What we stand for (White):** four cards with no numbers:
   - **"Takes the heat":** "Made for ovens, delivery bags and the lunch rush." `[CONFIRM oven claim]`
   - **"Stacks up":** "The same standard in the last carton as in the first."
   - **"Light on the planet":** "Aluminium can be recycled again and again."
   - **"Picks up the phone":** "Real people, quick answers, no runaround."
5. **Numbers (Yellow strip):** confirmed numbers only: "1997" (founded) · "26" (products online) · "3" (product families). The flagged slots (production capacity, team size, countries served, customers) stay hidden until confirmed.
6. **Quality and certifications (flag `showCerts`, off):** a grid of certificate cards (logo, name, issuer, year) `[CONFIRM]`.
7. **Factory gallery (flag `showFactoryGallery`, off):** duotone photos with hand captions.
8. **Company details** (a DataPlate):
   - Legal name: Al Mohamadi Light Industries Co. LLC
   - Brand: Silverpot
   - Founded: 1997
   - Location: Ajman, United Arab Emirates
   - Trade licence number `[CONFIRM, optional]`
9. **CTA band:** "Want to see the range?" with the buttons "Browse products" and "Contact us".

### 7.8 SUSTAINABILITY `/sustainability`

Write this carefully to avoid greenwashing. Make only general, true statements about aluminium, and no company-specific environmental claims unless confirmed.

1. **Hero (Red):**
   - H1 (White): "Use once. Recycle forever."
   - Sub: "Aluminium is one of the few packaging materials that can be recycled again and again without losing its quality. That makes "disposable" a bit of a misnomer."
   - Art: Crinkle with a speech bubble: "Not trash. Pre-recycled."
2. **The afterlife of a container (White):** an animated `recycle-loop` diagram. This is a real cycle, so number it 1–5:
   1. "Feed someone."
   2. "Scrape and rinse."
   3. "Into the recycling bin."
   4. "Melted down."
   5. "Made into new aluminium." (loops back to 1)
3. **How to recycle us properly (Foil Grey, a checklist styled as a DataPlate):**
   - "Scrape off leftover food. A quick rinse is enough; it doesn't need to sparkle."
   - "Take off paper or board lids and recycle them with paper. `[CONFIRM lid material]`"
   - "Scrunch used foil into a ball about the size of your fist. Small scraps are easier to sort that way."
   - "Use the recycling bins provided by your emirate's municipality or your building."
4. **What we're doing (flag `showSustainabilityActions`, off):** placeholder for client initiatives (scrap recycling at the factory, recycled content, energy) `[CONFIRM]`.
5. **CTA:** "Questions about our materials?" with the button "Ask us".

### 7.9 FAQ `/faq`

- Header (Yellow): H1 "Questions, answered." and a search field that filters questions.
- Groups (Radix Accordion, one open at a time per group): **Products and use** · **Ordering and delivery** · **Recycling** · **About Silverpot**. All questions are in §9.7.
- In production, only questions with `status: 'general'` or `'confirmed'` render.
- FAQPage JSON-LD for the rendered questions only.
- End band: "Still stuck? Ask a human." with the buttons "Chat on WhatsApp" and "Call us".

### 7.10 CONTACT `/contact`

1. **Header (White):**
   - H1: "Talk to the factory."
   - Sub: "Quotes, questions, or "can you do 5,000 by tomorrow?". Pick whichever channel suits you."
2. **Channel cards** (4 across on desktop, 1 column on mobile). These are pressable, so they have shadows:

   | Card | Colour | Content | Action |
   |---|---|---|---|
   | Call | Yellow | "+971 6 743 1314" and "Mobile: +971 50 849 4521" | `tel:` |
   | WhatsApp | Blue | "+971 50 849 4521" and "Usually the fastest way to reach us." `[CONFIRM]` | `wa.me` |
   | Email | White | "info@silverpot.org" | `mailto:` |
   | Visit | Red | "Ajman, United Arab Emirates" + street `[CONFIRM]` + hours `[CONFIRM]` | Google Maps directions |

3. **Form (Foil Grey section, White card):**
   - H2: "Drop us a line (or two)." (a nod to the old site's copy)
   - Fields: Name* · Company · Email* · Phone · Topic* (select: Quote or bulk order, Product question, Become a distributor, Something else) · Message* · Consent*.
   - Submit: "Send message".
   - Success: "Message sent. We'll reply within [CONFIRM] working hours."
4. **Map:** a click-to-load facade. It shows a static illustrated map card (Ajman outline, with a pin wearing Crinkle's shoes) and the button "Load Google Map". Only on click does it load the embed iframe for `Al Mohamadi Light Industries Co LLC - Ajman`.

### 7.11 YOUR QUOTE `/quote` (noindex)

- H1: "Your quote."
- A list of items, each showing: thumbnail, code, name, unit toggle, quantity stepper, note field ("Anything specific? Printing, mixed cartons…") and a "Remove" button.
- **Empty state:** Crinkle `sleeping`, "Your quote list is empty." Sub: "Add products from the catalogue, then send the whole list in one go." Button: "Browse products".
- **Form:** the same as the Wholesale form, minus the products-of-interest field. It adds "Delivery emirate*" and "Needed by" (a date, optional).
- **Two submit paths:**
  - "Send quote request" (Red, the primary).
  - "Send on WhatsApp instead" (White). This builds the message from §5.4.
- After sending: clear the list, show the success state, and offer "Start a new list".

### 7.12 SEARCH

The global command palette (§6.4) handles search. `/products?q=` is the shareable results page (noindex).

### 7.13 404, ERROR AND LOADING

**404 (Yellow, centred)**
- Art: Crinkle `flattened`, plus hazard tape.
- H1: "This page got thrown out."
- Body: "It's probably being recycled into something useful. Meanwhile, try one of these:"
- Buttons: "Go to homepage" · "Browse products" · "Search" (opens the palette).
- A rough-notation red circle draws once around the word "recycled".

**Error (500)**
- H1: "Something stopped working on our side."
- Body: "Try again in a minute. If it keeps happening, message us on WhatsApp and we'll sort it out."
- Buttons: "Try again" (calls `reset()`) and "Chat on WhatsApp".

**Loading:** foil-shimmer skeletons in the exact shapes of the content (no spinners), with a tiny `foil-spiral-o` rotating in the header area for route loads over 300 ms.

### 7.14 LEGAL `/privacy`, `/terms`

- A plain, readable layout (White, max 70ch).
- **Privacy outline:** what we collect (form fields only), why (to answer your request), where it goes (email via our provider), how long we keep it, your rights, contact. Mention the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) in general terms. Analytics are cookieless.
- **Terms outline:** use of the site, product information (indicative; final specs confirmed on quotation), quotes are not contracts until confirmed, intellectual property, governing law (UAE).
- Banner in review mode: "Draft. Needs legal review before launch."

### 7.15 ARABIC `/ar`

- Mirror every page (§5.6). Headlines use Lalezar and body uses IBM Plex Sans Arabic. Keep hand notes in Arabic using IBM Plex Sans Arabic at 500, rotated the same way, because there's no good free Arabic handwriting match.
- The wordmark stays Latin "SILVERPOT". Add an Arabic name line under it **only if** the client provides an official Arabic name `[CONFIRM]`.
- **Starter strings** (machine-quality drafts; **native review required**):

| Key | English | Arabic draft |
|---|---|---|
| tagline | Light metal. Heavy duty. | معدن خفيف. أداء ثقيل. |
| hero.h1 | Aluminium containers and foil that take the heat. | علب وورق ألمنيوم تتحمّل الحرارة. |
| hero.sub | Pressed in Ajman since 1997… | نصنعها في عجمان منذ 1997 للمطاعم ومتعهدي الحفلات والمطابخ السحابية وكل مطبخ. |
| cta.browse | Browse products | تصفّح المنتجات |
| cta.quote | Get a bulk quote | اطلب عرض سعر للجملة |
| addToQuote | Add to quote | أضف إلى عرض السعر |
| whatsapp | Chat on WhatsApp | تواصل عبر واتساب |
| family.containers | Containers with lids | علب ألمنيوم بغطاء |
| family.platters | Platters | صواني ألمنيوم |
| family.foil | Foil rolls and packs | رولات ورق الألمنيوم |
| recycle | Use once. Recycle forever. | استخدام مرة. وإعادة تدوير للأبد. |
| bulk | Need 10,000 by Thursday? | تحتاج 10,000 قطعة قبل الخميس؟ |
| 404 | This page got thrown out. | هذه الصفحة رُميت في سلة المهملات. |

---

## 8. COMPONENT LIBRARY

Build each component with typed props, every state listed, and a demo on `/dev/kit` (excluded from the sitemap and production builds).

| Component | Props | States and notes |
|---|---|---|
| `Button` | `variant: 'primary'(Red) \| 'secondary'(White) \| 'yellow' \| 'blue' \| 'ghost' \| 'whatsapp'`, `size: 'sm'\|'md'\|'lg'`, `icon?`, `loading?`, `asChild?` | default, hover (lift + shadow up), active (press in), focus ring, disabled (Foil Grey, no shadow), loading (foil-spiral spinner, label kept for width). Minimum height 44 px (48 px on mobile primary). |
| `Chip` | `selected`, `count?`, `as: 'button'\|'span'` | A button chip has a shadow; a static span chip has none. |
| `Sticker` | `shape: 'circle'\|'burst'\|'rounded'\|'ticket'`, `tone`, `rotate` (deterministic) | White die-cut outline + shadow-sm |
| `RimFrame` | `tone`, `grid?: boolean`, `marks?: boolean` | Outer 2 px + inner rim line; optional blueprint grid and registration marks |
| `DataPlate` | `rows: {label, value, confirmed}[]`, `collapseUnconfirmed?` | Rivets; review-mode highlighter on unconfirmed rows |
| `HandNote` | `text`, `arrow?: 'left'\|'right'\|'up'\|'down'\|'curve-*'`, `rotate` | Gochi Hand, max ~12 words, arrow draws on first view |
| `Stamp` | `text`, `tone` | Circular text path, stencil font, rough mask |
| `HazardTape`, `RegistrationMarks`, `BlueprintGrid` | `—` | Decorative, `aria-hidden` |
| `Odometer` | `value: string` | Rolls once in view; static with reduced motion |
| `Section` | `tone: 'white'\|'foil'\|'yellow'\|'blue'\|'red'`, `grain?`, `id?` | Sets the `on-blue`/`on-red` shadow context and text colour |
| `Wordmark` | `size`, `tone` | SVG paths with the foil-spiral O |
| `Crinkle` | `pose`, `track?: boolean`, `speech?: string` | Blink loop, 3-click easter egg |
| `Conveyor` | `items` | Scroll-coupled; static with reduced motion |
| `ProductCard` | `product`, `priority?` | See spec below |
| `CategoryTile` | `category` | Pressable link tile |
| `FilterBar` / `FilterSheet` | `facets`, `value`, `onChange` | URL-synced; sheet on mobile |
| `Gallery` | `images`, `dims?` | Zoom dialog, mobile swipe, dimension toggle |
| `DimensionOverlay` | `dimensionsMm` | SVG lines + labels, draws on toggle |
| `QuantityStepper` | `value`, `unit`, `onChange` | 44 px targets; typeable; clamps 1–9999 |
| `SiblingSwitch` | `siblings` | Radix ToggleGroup styled as a segmented control |
| `AddToQuote` | `productId`, `qty?`, `source` | Lid-snap animation, fly-to-quote, live announcement |
| `QuoteButton`, `QuoteDrawer`, `QuoteList` | — | Badge bounce, drawer/sheet, empty state |
| `CommandSearch` | — | cmdk + Fuse, keyboard shortcuts |
| `MapFacade` | `query` | Click-to-load iframe |
| `JsonLd` | `data` | `<script type="application/ld+json">` |
| Form fields | RHF-controlled | Label always visible (no placeholder-only labels); helper text; error text in Red with an icon; `aria-describedby` |
| `PhotoComingSoon` | `product` | Illustration + scribble + sticker |
| `ReviewHighlight` | `children`, `note` | Renders only in review mode |

**ProductCard spec**
- A container query decides between the compact layout (< 260 px) and the regular one.
- **Image area:** 1:1, RimFrame on a Foil Grey blueprint grid, the photo with `mix-blend-mode: multiply`, and registration marks at the regular size.
- **Top-left:** a family sticker (Containers in Yellow, Platters in Red, Foil in Blue) and, if relevant, a "2 compartments" or "Broast" sticker.
- **Top-right:** a carton-label mini barcode with the code (decorative).
- **Body:** the code in `code-s`, the name (Bricolage 600, 16 px, clamped to 2 lines), and the tagline (Gochi Hand, Red, 1 line, hidden in compact mode).
- **Footer:** the "Add to quote" button (`sm`, icon plus label; icon only in compact mode).
- **Link pattern:** the whole card is one link (stretched-link pattern) except the Add button, so there are no nested interactive elements.
- **Card states:** default has shadow-sm. Hover (desktop) runs the dimension draw or scan-line (§4.3-5), with no lift. Focus-visible shows a ring on the card. On press, the shadow drops.

---

## 9. DATA MODEL AND FULL CATALOGUE

### 9.1 Types (`src/data/types.ts`)

```ts
export type Locale = 'en' | 'ar';
export type L10n = { en: string; ar: string | null; arReviewed?: boolean };
export type CategorySlug = 'containers' | 'platters' | 'foil';
export type Subtype =
  | 'single' | 'compartment' | 'specialty'          // containers
  | 'platter'                                        // platters
  | 'household-roll' | 'catering-roll' | 'promo-pack'; // foil

export type UseCase =
  | 'rice-biryani' | 'grills-bbq' | 'curries-gravies' | 'desserts-kunafa'
  | 'salads-cold' | 'broast-fried' | 'meal-combos' | 'wrapping-covering'
  | 'baking-roasting' | 'catering-buffet' | 'home-leftovers' | 'freezing-meal-prep';

/** A value plus whether the client has confirmed it. Unconfirmed values are hidden in production. */
export type Fact<T> = { value: T | null; confirmed: boolean; note?: string };

export interface ProductSpecs {
  material: Fact<'Aluminium'>;
  compartments: Fact<1 | 2 | 3>;
  lidIncluded: Fact<boolean>;
  lidMaterial: Fact<string>;
  capacityMl: Fact<number>;
  topDimensionsMm: Fact<{ length: number; width: number }>;
  depthMm: Fact<number>;
  rollWidthCm: Fact<30 | 45>;
  rollLengths: Fact<{ value: number; unit: 'sqft' | 'm' }[]>;
  thicknessMicron: Fact<number>;
  piecesPerPack: Fact<number>;
  packsPerCarton: Fact<number>;
  piecesPerCarton: Fact<number>;
  ovenSafe: Fact<boolean>;
  freezerSafe: Fact<boolean>;
}

export interface ProductImage {
  /** local path after scripts/fetch-images.ts runs, e.g. /images/products/8325-aluminium-container-with-lid-1.jpg */
  src: string;
  alt: L10n;
  /** verified thumbnail on the old site (always exists) */
  legacyThumb: string;
  /** candidates to try first, largest first */
  legacyCandidates: string[];
  width?: number; height?: number;
  needsReshoot?: boolean;
}

export interface Product {
  id: string;
  modelCode: string | null;        // display code, e.g. '8325', '83120E'
  sku: string;                      // internal unique key, e.g. '8576-3C' [CONFIRM real SKUs]
  aliases?: string[];               // other codes buyers may type, e.g. ['1120']
  slug: string;
  category: CategorySlug;
  subtype: Subtype;
  name: L10n;
  tagline: L10n;
  description: L10n;
  goodFor: UseCase[];               // editorial suggestions [CONFIRM]
  specs: ProductSpecs;
  images: ProductImage[];           // [] → PhotoComingSoon
  siblings?: string[];              // product ids
  pairsWith?: string[];             // product ids
  featured?: boolean;               // home "Start with these"
  sortKey: number;
  legacySlugs: string[];            // old ?product= values → 308 redirect here
  notes?: string;                   // internal, never rendered
}
```

### 9.2 Site config (`src/data/site.ts`)

```ts
export const site = {
  brand: 'Silverpot',
  wordmark: 'SILVERPOT',
  legalName: 'Al Mohamadi Light Industries Co. LLC',
  founded: 1997,
  url: 'https://silverpot.org',
  emirate: 'Ajman',
  country: 'United Arab Emirates',
  countryCode: 'AE',
  phones: {
    landline: { e164: '+97167431314', display: '+971 6 743 1314' },
    mobile:   { e164: '+971508494521', display: '+971 50 849 4521' },
  },
  whatsapp: { number: '971508494521', confirmed: false },            // [CONFIRM]
  email: 'info@silverpot.org',
  address: { street: null, area: null, poBox: null, city: 'Ajman', country: 'AE', confirmed: false }, // [CONFIRM]
  geo: { lat: null, lng: null },                                     // [CONFIRM] from Google Business Profile
  mapsQuery: 'Al Mohamadi Light Industries Co LLC - Ajman',
  hours: null as null | { days: string; open: string; close: string }[], // [CONFIRM] e.g. Sat–Thu 08:00–18:00
  responseTimeHours: null as null | number,                          // [CONFIRM]
  socials: { instagram: null, facebook: null, pinterest: null, youtube: null } as Record<string, string | null>, // [CONFIRM]
  trademarkRegistered: false,                                        // [CONFIRM] controls ®
  flags: {
    showWildGrid: false, privateLabel: false, specSheets: false, showCerts: false,
    showFactoryGallery: false, showSustainabilityActions: false, showWholesaleTerms: false,
  },
};
```

### 9.3 Categories (`src/data/categories.ts`)

| slug | Name (EN) | Name (AR draft) | Tone | Count | Tagline |
|---|---|---|---|---|---|
| `containers` | Aluminium containers with lids | علب ألمنيوم بغطاء | yellow | 13 | "Lids on. Drama off." |
| `platters` | Aluminium platters | صواني ألمنيوم | red | 4 | "Made for sharing. Also for not sharing." |
| `foil` | Aluminium foil rolls and packs | رولات ورق الألمنيوم | blue | 9 | "30 cm or 45 cm. Choose your fighter." |

### 9.4 The complete product catalogue (26 products)

**Image base URL (old site):** `https://silverpot.org/wp-content/uploads/2022/02/`
The thumbnail URLs below were **seen on the live site** (300×300). The full-size originals are derived from WordPress naming rules and have **not been verified**. The fetch script (§10) tries them first and falls back to the thumbnails.

Unless stated otherwise, every product has: `material = 'Aluminium' (confirmed)`, every other spec `{ value: null, confirmed: false }`, `ar` text as machine drafts with `arReviewed: false`.

#### Containers with lids (13) — `category: 'containers'`, `lidIncluded: { value: true, confirmed: true }` (the old product names say "with Lid")

| sortKey | id | Model | Name (EN) | Slug | Subtype | Comp. | Image file(s) | Legacy slug(s) | Featured |
|---|---|---|---|---|---|---|---|---|---|
| 10 | c-8325 | 8325 | Aluminium Container with Lid – 8325 | `8325-aluminium-container-with-lid` | single | 1 | `IMG_5054-1` | `aluminum-container-with-lid-8325` | ✓ |
| 20 | c-8342 | 8342 | Aluminium Container with Lid – 8342 | `8342-aluminium-container-with-lid` | single | 1 | `IMG_5059-1` | `aluminum-container-with-lid-8342` | ✓ |
| 30 | c-8357 | 8357 | Aluminium Container with Lid – 8357 | `8357-aluminium-container-with-lid` | single | 1 | `IMG_5096-2` | `aluminum-container-with-lid-8357` | |
| 40 | c-8367 | 8367 | Aluminium Container with Lid – 8367 | `8367-aluminium-container-with-lid` | single | 1 | `IMG_5064-1` | `aluminum-container-with-lid-8367` | |
| 50 | c-8389 | 8389 | Aluminium Container with Lid – 8389 | `8389-aluminium-container-with-lid` | single | 1 | `IMG_5068-1` | `aluminum-container-with-lid-8389` | |
| 60 | c-83120 | 83120 | Aluminium Container with Lid – 83120 | `83120-aluminium-container-with-lid` | single | 1 | `IMG_5073-1` | `aluminum-container-with-lid-83120` | |
| 61 | c-83120e | 83120E | Aluminium Container with Lid – 83120E (1120) | `83120e-aluminium-container-with-lid` | single | 1 | `IMG_5080-1` | `aluminum-container-with-lid-83120e-1120` | |
| 70 | c-83166 | 83166 | Aluminium Broast Container with Lid – 83166 | `83166-broast-aluminium-container-with-lid` | specialty | 1 | `IMG_5119-1` | `aluminum-container-with-lid-83166-broast` | ✓ |
| 80 | c-83185 | 83185 | Aluminium Container with Lid – 83185 | `83185-aluminium-container-with-lid` | single | 1 | `IMG_5085-1` | `aluminum-container-with-lid-83185` | |
| 90 | c-83241 | 83241 | Aluminium Container with Lid – 83241 | `83241-aluminium-container-with-lid` | single | 1 | `IMG_5113-1` | `aluminum-container-with-lid-83241` | |
| 100 | c-73365 | 73365 | Aluminium Container with Lid – 73365 | `73365-aluminium-container-with-lid` | single | 1 | `IMG_5091-2` | `aluminum-container-with-lid-73365` | |
| 110 | c-8576-2 | 8576 | 2-Compartment Aluminium Container with Lid – 8576 | `8576-2-compartment-aluminium-container-with-lid` | compartment | 2 | `IMG_5107-1` | `aluminum-container-with-lid-8576-2compartment` | |
| 111 | c-8576-3 | 8576 | 3-Compartment Aluminium Container with Lid – 8576 | `8576-3-compartment-aluminium-container-with-lid` | compartment | 3 | `IMG_5100-2` | `aluminum-container-with-lid-8576-3compartment` | ✓ |

- **Compartments:** confirmed for 8576-2 and 8576-3 (from the old names). For single-compartment models, set `{ value: 1, confirmed: false }`. It's very likely but should be verified.
- **SKU suggestions:** `8576-2C`, `8576-3C`; otherwise the model code. `[CONFIRM]`
- **Aliases:** `c-83120e` → `['1120']`.
- **Siblings:** `c-8576-2 ⟷ c-8576-3`, `c-83120 ⟷ c-83120e`.
- **Notes:** `c-83120e`: the difference from 83120 is unknown `[CONFIRM]`. `c-83166`: the old name said "(Broast)".
- **pairsWith (default for containers):** `['f-30-75', 'f-45-37']`.

**Taglines and descriptions (EN)**

| id | Tagline | Description |
|---|---|---|
| c-8325 | "First on the list. Never last on the counter." | "Model 8325 is a single-compartment aluminium container supplied with a matching lid. It's a dependable pick for takeaway counters and delivery menus. Pressed in our Ajman facility and packed in cartons, ready for busy service." |
| c-8342 | "The everyday hero of the takeaway counter." | "Model 8342 is an everyday aluminium container with lid, made for the dishes that leave your kitchen most often. Order it by the carton alongside the rest of the 83 series." |
| c-8357 | "Holds the heat. Holds its shape. Holds no grudges." | "Model 8357 is an aluminium container with lid from our 83 series, for kitchens that need a reliable, consistent size order after order." |
| c-8367 | "Built for the dish everyone fights over." | "Model 8367 is a lidded aluminium container for hot meals, sides and family orders. Pressed in Ajman and supplied by the carton." |
| c-8389 | "For portions that refuse to be modest." | "Model 8389 is an aluminium container with a matching lid, made for generous takeaway portions and catering orders." |
| c-83120 | "Feeds the table, not the landfill." | "Model 83120 is a larger-format aluminium container with lid for sharing portions, catering and meal prep. Like all our aluminium, it can be recycled again and again." |
| c-83120e | "Same family as 83120. Different personality." | "Model 83120E (also listed as 1120) is a variant of our 83120 aluminium container with lid. Ask us which one suits your menu best." |
| c-83166 | "Made for broast. Mildly obsessed with crunch." | "Model 83166 is an aluminium container with lid shaped for broast and fried chicken orders. It's a favourite format for chicken shops and takeaway counters." `[CONFIRM "favourite" claim, or remove the last sentence]` |
| c-83185 | "When "just a little more" becomes the whole order." | "Model 83185 is a high-capacity aluminium container with lid for family meals, rice dishes and catering portions." `[CONFIRM "high-capacity"]` |
| c-83241 | "Not scared of second helpings." | "Model 83241 is a large aluminium container with lid for sharing dishes, buffets and bulk meal prep." `[CONFIRM "large"]` |
| c-73365 | "Different series. Same unbothered attitude." | "Model 73365 is an aluminium container with lid from our 73 series, built for catering kitchens and big-batch orders." `[CONFIRM]` |
| c-8576-2 | "Two rooms. Zero roommate drama." | "The 8576 two-compartment aluminium container keeps a main and a side apart until they reach the table. It's supplied with a matching lid." |
| c-8576-3 | "Rice here. Curry there. Salad minding its own business." | "The 8576 three-compartment aluminium container is built for complete meals (main, rice and side) in one tray, with a matching lid." |

> Size words ("larger-format", "high-capacity", "large") are **only safe once capacities are confirmed**. Until then, in production, render the description without the bracketed adjective. Implement this with `description.en` as a template: `"Model 83185 is a {{sizeWord}}aluminium container…"`, where `sizeWord` resolves to `""` until confirmed.

**goodFor (editorial, `[CONFIRM]`):**
- Single models: `['rice-biryani','curries-gravies','home-leftovers','freezing-meal-prep']`.
- 83120 / 83185 / 83241 / 73365: add `'catering-buffet'`.
- 83166: `['broast-fried','grills-bbq']`.
- 8576-2 / 8576-3: `['meal-combos','rice-biryani','curries-gravies','salads-cold']`.

#### Platters (4) — `category: 'platters'`, `subtype: 'platter'`

| sortKey | id | Model | Name (EN) | Slug | Image file | Legacy slug | Featured | Tagline |
|---|---|---|---|---|---|---|---|---|
| 210 | p-6550 | 6550 | Aluminium Platter – 6550 | `6550-aluminium-platter` | `IMG_5127-1` | `aluminum-platter-6550` | | "Platter, please. The table is waiting." |
| 220 | p-6586 | 6586 | Aluminium Platter – 6586 | `6586-aluminium-platter` | `IMG_5133-1` | `aluminum-platter-6586` | ✓ | "Built for the big reveal." |
| 230 | p-65180 | 65180 | Aluminium Platter – 65180 | `65180-aluminium-platter` | `IMG_5138-1` | `aluminum-platter-65180` | | "Shows up to every majlis." |
| 240 | p-65220 | 65220 | Aluminium Platter – 65220 | `65220-aluminium-platter` | `IMG_5144-1` | `aluminum-platter-65220` | | "For the main event." |

- **Description template:** "Model {code} is an aluminium platter for catering trays, buffet lines and family-style serving. Pressed in Ajman and supplied by the carton. Ask us about matching lids and mixed cartons."
- **goodFor:** `['catering-buffet','grills-bbq','rice-biryani','desserts-kunafa']`.
- **pairsWith:** `['f-45-37','f-45-cat']`.
- Lid, shape and size are all `[CONFIRM]`.

#### Foil (9) — `category: 'foil'`, `rollWidthCm` confirmed from the names

| sortKey | id | Name (EN) | Slug | Subtype | Width | Length(s) | Image file(s) | Legacy slug(s) | Featured | Tagline |
|---|---|---|---|---|---|---|---|---|---|---|
| 310 | f-30-25 | Aluminium Foil Roll – 30 cm × 25 sq ft | `aluminium-foil-roll-30cm-25-sqft` | household-roll | 30 | 25 sqft | `IMG_5283-2` | `aluminum-foil-30cm-x-25-sq-ft` | | "The kitchen-drawer classic." |
| 320 | f-30-75 | Aluminium Foil Roll – 30 cm × 75 sq ft | `aluminium-foil-roll-30cm-75-sqft` | household-roll | 30 | 75 sqft | `IMG_5275-1`, `IMG_5280-1` | `aluminum-foil-30cm-x-75-sq-ft`, `aluminum-foil-30cm-x-75-sq-ft-2` | ✓ | "Three times the 25. Same trusty 30 cm." |
| 330 | f-30-200 | Aluminium Foil Roll – 30 cm × 200 sq ft | `aluminium-foil-roll-30cm-200-sqft` | household-roll | 30 | 200 sqft | `IMG_5171` | `aluminum-foil-30cm-x-200-sq-ft` | | "For kitchens that go through foil like it's free." |
| 340 | f-30-cat | Catering Foil Roll – 30 cm × 150 m / 300 m | `catering-foil-roll-30cm-150m-300m` | catering-roll | 30 | 150 m, 300 m | `IMG_5164-2` (dup: `IMG_5164`) | `aluminum-foil-30cm-x-150-300-m`, `aluminum-foil-30cm-x-150-300-m-2` | | "Pro roll. For pros who hate changing rolls." |
| 350 | f-45-13 | Aluminium Foil Roll – 45 cm × 13.5 sq ft | `aluminium-foil-roll-45cm-13-5-sqft` | household-roll | 45 | 13.5 sqft | `IMG_5176-1` | `aluminum-foil-45cm-x-13-50-sqft` | | "Extra-wide for big-tray days." |
| 360 | f-45-37 | Aluminium Foil Roll – 45 cm × 37.5 sq ft | `aluminium-foil-roll-45cm-37-5-sqft` | household-roll | 45 | 37.5 sqft | `IMG_5149-1` | `aluminum-foil-45cm-x-37-50-sqft` | ✓ | "Wide, long and ready for the oven." |
| 370 | f-45-cat | Catering Foil Roll – 45 cm × 150 m / 300 m | `catering-foil-roll-45cm-150m-300m` | catering-roll | 45 | 150 m, 300 m | **none** (old site showed a placeholder) | `aluminum-foil-45cm-x-150-300-m`, `aluminum-foil-45cm-x-150-300m` | ✓ | "The widest, longest roll on our list." |
| 380 | f-promo-cf | Promo Pack – Foil 45 cm × 37.5 sq ft + Cling Film 30 cm × 100 sq ft | `promo-pack-foil-45cm-37-5-sqft-cling-film-30cm-100-sqft` | promo-pack | 45 | 37.5 sqft (+ cling film 30 cm × 100 sq ft) | `IMG_5236` | `promo-pack-foil-45x37-50-sqft-c-f-30x100-sqft` | | "Foil and cling film. The power couple." |
| 390 | f-promo-3 | Promo Pack – Foil 45 cm × 37.5 sq ft (Pack of 3) | `promo-pack-foil-45cm-37-5-sqft-3-pack` | promo-pack | 45 | 3 × 37.5 sqft | `IMG_5285-1` | `promo-pack-foil-45x37-50-sqft-1x3-packing` | | "Three rolls. One pack. Zero emergency shop runs." |

**Foil notes**
- **`f-30-75`:** two listings existed on the old site with different photos. They're probably two pack designs. Keep one product with both images `[CONFIRM]`.
- **`f-30-cat` and `f-45-cat`:** "150/300 M" is read as two roll lengths. Model them as `rollLengths: [{150,'m'},{300,'m'}]` (confirmed: true, from the names) and show a "Length: 150 m | 300 m" chip selector on the product page that is passed into the quote note `[CONFIRM reading]`.
- **`f-promo-cf`:** "C/F" is interpreted as **cling film** `[CONFIRM]`. Until it's confirmed, the production name must read "Promo Pack – Foil 45 cm × 37.5 sq ft + C/F 30 cm × 100 sq ft".
- **goodFor:** household rolls `['wrapping-covering','baking-roasting','grills-bbq','home-leftovers']`; catering rolls `['wrapping-covering','catering-buffet','baking-roasting','grills-bbq']`; promo packs `['wrapping-covering','home-leftovers']`.
- **pairsWith:** household rolls → `['c-8325','c-8576-3']`; catering rolls → `['p-6586','c-83185']`.

**Foil descriptions (EN)**
- **Household roll template:** "A {width} cm wide aluminium foil roll with {length} sq ft of wrap, made for everyday cooking, baking, grilling and covering leftovers. {extra}"
  - `f-30-25` extra: "Compact enough for any kitchen drawer."
  - `f-30-75` extra: "Three times the length of our 25 sq ft roll, at the same width."
  - `f-30-200` extra: "Our longest 30 cm household roll, for busy kitchens."
  - `f-45-13` extra: "Extra width covers large trays in one sheet."
  - `f-45-37` extra: "Wide enough for big oven trays, long enough to last."
- **Catering roll template:** "A professional {width} cm aluminium foil roll in 150 m or 300 m lengths, for restaurant and catering kitchens that wrap, line and cover all day."
- **`f-promo-cf`:** "A promo pack pairing a 45 cm × 37.5 sq ft aluminium foil roll with a 30 cm × 100 sq ft roll of cling film: two kitchen essentials in one pack."
- **`f-promo-3`:** "Three 45 cm × 37.5 sq ft aluminium foil rolls in one promo pack, ready for retail shelves and stock-up shoppers."

### 9.5 Image alt text pattern

- **EN:** `"{Name} by Silverpot – product photo"`, for example "Aluminium Container with Lid – 8325 by Silverpot – product photo".
- **AR draft:** `"{Arabic name} من سيلفربوت – صورة المنتج"`
- **Second images:** add "– alternate pack" / "– view 2".

### 9.6 Size finder rules (`src/data/sizeFinder.ts`)

Rules run in order. The first ones that match produce the result. Every result carries a `reason` string.

| # | Condition | Result | Reason (shown) |
|---|---|---|---|
| 1 | `comp = 2` | c-8576-2 | "Two compartments keep a main and a side apart." |
| 2 | `comp = 3` | c-8576-3 | "Three compartments fit a full meal in one tray." |
| 3 | `food = broast-fried` | c-83166 | "Shaped for broast and fried chicken." |
| 4 | `food = wrapping-covering` and servings ≤ 8 | f-30-75, f-45-37 | "Household rolls for everyday wrapping." |
| 5 | `food = wrapping-covering` and servings > 8 | f-30-cat, f-45-cat | "Catering rolls for kitchens that wrap all day." |
| 6 | servings ≥ 10, or `food = catering-buffet` | all platters + (once capacities are confirmed) the two largest containers | "Built for sharing and buffet service." |
| 7 | **Capacity rule (enable only when ≥ 8 container capacities are confirmed):** needed ml = servings × portion ml (rice-biryani 350, curries-gravies 250, desserts-kunafa 150, salads-cold 200, grills-bbq 300, home-leftovers 300, meal-combos 450). Pick the smallest confirmed container whose `capacityMl ≥ needed`, plus the next size up. | best fit + one size up | "Fits about {servings} portions of {food}." |
| 8 | Fallback | all single containers | "We'll confirm the exact size on WhatsApp." plus the WhatsApp button |

The portion sizes in rule 7 are editable defaults `[CONFIRM with client]`.

### 9.7 FAQ data (`src/data/faq.ts`)

`status`: `'general'` (safe to publish now) · `'confirm'` (hidden in production until the client approves the answer).

| Group | Question | Draft answer | Status | Home teaser |
|---|---|---|---|---|
| Products and use | Can aluminium containers go in the oven? | "Aluminium containers can generally go in a conventional oven. Remove paper or board lids before heating. Check the product page or ask us about a specific model." | confirm | ✓ |
| Products and use | Can I freeze food in them? | "Yes, aluminium containers are commonly used for freezing. Let food cool, close the lid, and label it." | confirm | ✓ |
| Products and use | Can I use them in the microwave? | "We don't recommend putting aluminium in a microwave unless the appliance manufacturer says it's safe. Transfer food to a microwave-safe dish." | confirm | |
| Products and use | Are your products food-safe? | "[Client to provide: food-contact compliance and certifications.]" | confirm | |
| Products and use | What do the model codes mean? | "Each product has a model code, for example 8325. It's the fastest way to search the catalogue and to order. Type it into the search bar." | general | |
| Products and use | What's the difference between 30 cm and 45 cm foil? | "It's the width of the roll. 30 cm suits everyday kitchen jobs; 45 cm covers large trays and catering pans in one sheet." | general | |
| Products and use | Do you make custom or printed lids? | "[Client to confirm.]" | confirm | |
| Ordering and delivery | How do I get a price? | "Add products to your quote and send it, or message us on WhatsApp with the model codes and quantities. We'll reply with price, stock and timing." | general | ✓ |
| Ordering and delivery | Is there a minimum order? | "[Client to provide MOQ.]" | confirm | |
| Ordering and delivery | Do you deliver across the UAE? | "[Client to confirm delivery areas and lead times.]" | confirm | |
| Ordering and delivery | Do you export outside the UAE? | "[Client to confirm.]" | confirm | |
| Ordering and delivery | Can I order samples? | "[Client to confirm.]" | confirm | |
| Ordering and delivery | Do you sell to households? | "[Client to confirm.]" | confirm | |
| Recycling | Are aluminium containers recyclable? | "Yes. Aluminium can be recycled again and again without losing its quality. Scrape off food, give it a quick rinse, and put it in your recycling bin." | general | ✓ |
| Recycling | What should I do with used foil? | "Clean off any food, then scrunch it into a ball about the size of your fist so it's easier to sort, and recycle it." | general | |
| About Silverpot | Where are you based? | "Our facility is in the Emirate of Ajman, United Arab Emirates. We've been making aluminium packaging there since 1997." | general | |
| About Silverpot | Who is behind Silverpot? | "Silverpot is the brand of Al Mohamadi Light Industries Co. LLC, founded in Ajman in 1997." | general | |

**Family FAQs** (3 each, for category and product pages):
- **Containers:** oven, freezer, model codes.
- **Platters:** lids `[confirm]`, catering use (general: "Platters are made for buffets, catering trays and family-style serving."), how to get a price.
- **Foil:** 30 vs 45 cm, catering rolls (general: "Catering rolls are long-length rolls, 150 m or 300 m, for professional kitchens."), used foil recycling.

---

## 10. IMAGE PIPELINE

### 10.1 All image URLs

**Base:** `https://silverpot.org/wp-content/uploads/2022/02/`

| Product id | Verified thumbnail (300×300, seen on the live site) | Try first (unverified original) |
|---|---|---|
| c-8325 | `…/IMG_5054-1-300x300.jpg` | `…/IMG_5054-1.jpg` |
| c-8342 | `…/IMG_5059-1-300x300.jpg` | `…/IMG_5059-1.jpg` |
| c-8357 | `…/IMG_5096-2-300x300.jpg` | `…/IMG_5096-2.jpg` |
| c-8367 | `…/IMG_5064-1-300x300.jpg` | `…/IMG_5064-1.jpg` |
| c-8389 | `…/IMG_5068-1-300x300.jpg` | `…/IMG_5068-1.jpg` |
| c-83120 | `…/IMG_5073-1-300x300.jpg` | `…/IMG_5073-1.jpg` |
| c-83120e | `…/IMG_5080-1-300x300.jpg` | `…/IMG_5080-1.jpg` |
| c-83166 | `…/IMG_5119-1-300x300.jpg` | `…/IMG_5119-1.jpg` |
| c-83185 | `…/IMG_5085-1-300x300.jpg` | `…/IMG_5085-1.jpg` |
| c-83241 | `…/IMG_5113-1-300x300.jpg` | `…/IMG_5113-1.jpg` |
| c-73365 | `…/IMG_5091-2-300x300.jpg` | `…/IMG_5091-2.jpg` |
| c-8576-2 | `…/IMG_5107-1-300x300.jpg` | `…/IMG_5107-1.jpg` |
| c-8576-3 | `…/IMG_5100-2-300x300.jpg` | `…/IMG_5100-2.jpg` |
| p-6550 | `…/IMG_5127-1-300x300.jpg` | `…/IMG_5127-1.jpg` |
| p-6586 | `…/IMG_5133-1-300x300.jpg` | `…/IMG_5133-1.jpg` |
| p-65180 | `…/IMG_5138-1-300x300.jpg` | `…/IMG_5138-1.jpg` |
| p-65220 | `…/IMG_5144-1-300x300.jpg` | `…/IMG_5144-1.jpg` |
| f-30-25 | `…/IMG_5283-2-300x300.jpg` | `…/IMG_5283-2.jpg` |
| f-30-75 (1) | `…/IMG_5275-1-300x300.jpg` | `…/IMG_5275-1.jpg` |
| f-30-75 (2) | `…/IMG_5280-1-300x300.jpg` | `…/IMG_5280-1.jpg` |
| f-30-200 | `…/IMG_5171-300x300.jpg` | `…/IMG_5171.jpg` |
| f-30-cat | `…/IMG_5164-2-300x300.jpg` (fallback `…/IMG_5164-300x300.jpg`) | `…/IMG_5164-2.jpg`, then `…/IMG_5164.jpg` |
| f-45-13 | `…/IMG_5176-1-300x300.jpg` | `…/IMG_5176-1.jpg` |
| f-45-37 | `…/IMG_5149-1-300x300.jpg` | `…/IMG_5149-1.jpg` |
| f-45-cat | — (none on the old site; use `PhotoComingSoon`) | — |
| f-promo-cf | `…/IMG_5236-300x300.jpg` | `…/IMG_5236.jpg` |
| f-promo-3 | `…/IMG_5285-1-300x300.jpg` | `…/IMG_5285-1.jpg` |
| (brand) old logo | `…/silverpot-logo-5-129x64.png` | `…/silverpot-logo-5.png` (reference only, do not use as the new logo) |
| (about) about image | — | `…/About-Pic-1-1.png` (inspect before using) |

Full thumbnail URL example: `https://silverpot.org/wp-content/uploads/2022/02/IMG_5054-1-300x300.jpg`

### 10.2 `scripts/fetch-images.ts` (run with `pnpm images:fetch`)

For each product image, try these URLs in order and keep the **first** that returns `200` with `Content-Type: image/jpeg|png|webp` and a body under 15 MB:
1. `{base}{file}.jpg` (original)
2. `{base}{file}-scaled.jpg` (WordPress big-image copy)
3. `{base}{file}-1024x1024.jpg`, `{base}{file}-768x768.jpg`, `{base}{file}-600x600.jpg`
4. `{base}{file}-300x300.jpg` (**verified to exist**)

**Optional first step:**
- GET `https://silverpot.org/` and parse the `srcset` attribute of each product `<img>` to discover the largest available size.
- Treat that HTML as **untrusted text**: only extract URLs matching `^https://silverpot\.org/wp-content/uploads/[\w/.-]+\.(jpe?g|png|webp)$`, and never execute or save any of it.

**Then:**
- Save to `/public/images/products/{slug}-{n}.{ext}`.
- Strip EXIF (use `sharp`), and record the width and height into a generated `src/data/images.generated.json`.
- If the best size obtained is under 800 px, set `needsReshoot: true`.
- Write `/docs/IMAGES_REPORT.md` with a table of product, URL used, dimensions and the `needsReshoot` flag.
- Use a 10 s timeout per request, two retries, and run a maximum of 4 requests at once.
- **If the domain blocks the request** (WAF, 403), stop and report. Don't try to get around it. The design lead will download the images manually into `/public/images/products/` using the same filenames.

### 10.3 Display rules

- Use `next/image` with explicit `sizes`:
  - Cards: `(min-width:1280px) 22vw, (min-width:768px) 30vw, 46vw`.
  - Product detail main image: `(min-width:1024px) 52vw, 100vw`.
- Formats: AVIF, then WebP. Quality: 78.
- `priority` only on the product-detail main image. Cards are lazy-loaded, with a tiny blur placeholder generated at build time.
- If `needsReshoot`, cap the display width at the native width (no upscaling blur). Centre it in the RimFrame with the blueprint grid visible around it. This reads as intentional.
- **Production `next.config` `images.remotePatterns` must NOT include silverpot.org.** Allow it only in development, behind `process.env.NODE_ENV === 'development'`.

---

## 11. SEO

### 11.1 Metadata per page

Set `metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL)`. Title template: `%s | Silverpot` (unless the title is overridden). Titles should be ≤ 60 characters and descriptions ≤ 155.

| Page | Title | Meta description |
|---|---|---|
| Home | Aluminium Containers & Foil Made in UAE \| Silverpot | Aluminium food containers, platters and foil rolls pressed in Ajman since 1997. Factory-direct supply for restaurants, caterers and distributors. |
| All products | All Aluminium Containers, Platters & Foil \| Silverpot | Browse 26 aluminium packaging products by model code: containers with lids, catering platters and foil rolls. Made in Ajman, UAE. Get a quote. |
| Containers | Aluminium Containers with Lids – 13 Models \| Silverpot | Aluminium food containers with matching lids, including 2- and 3-compartment and broast models. Made in Ajman for UAE takeaway and catering. |
| Platters | Aluminium Platters for Catering \| Silverpot UAE | Aluminium platters for buffets, catering trays and family-style serving. Models 6550, 6586, 65180 and 65220, made in Ajman, UAE. |
| Foil | Aluminium Foil Rolls 30 cm & 45 cm \| Silverpot UAE | Household and catering aluminium foil rolls in 30 cm and 45 cm widths, from 13.5 sq ft to 300 m, plus promo packs. Made in Ajman, UAE. |
| Product (template) | `{name} \| Silverpot` (or `seoTitle` if longer than 60 characters) | `{first sentence of description} Made in Ajman, UAE. Add it to your quote or ask on WhatsApp.` (trim to 155) |
| Size finder | Aluminium Container Size Finder \| Silverpot | Answer three questions about what you're packing and for how many, and we'll suggest the right Silverpot aluminium container or foil. |
| Wholesale | Wholesale Aluminium Containers & Foil in UAE \| Silverpot | Factory-direct bulk aluminium packaging for restaurants, cloud kitchens, caterers, hotels and distributors in the UAE. Send a quote request. |
| About | About Silverpot – Aluminium Packaging, Ajman Since 1997 | Al Mohamadi Light Industries Co. LLC has made disposable packaging in Ajman since 1997. Meet Silverpot: aluminium containers, platters and foil. |
| Sustainability | Recycling Aluminium Containers & Foil \| Silverpot | Aluminium can be recycled again and again without losing quality. How to recycle Silverpot containers and foil properly, in four steps. |
| FAQ | Aluminium Container & Foil FAQs \| Silverpot | Answers on using aluminium containers and foil, ordering in bulk, delivery and recycling, from the Silverpot team in Ajman, UAE. |
| Contact | Contact Silverpot – Ajman, UAE \| Call, WhatsApp, Email | Call +971 6 743 1314, WhatsApp +971 50 849 4521 or email info@silverpot.org. Silverpot aluminium packaging, Ajman, United Arab Emirates. |
| Quote | Your Quote \| Silverpot (noindex) | — |
| 404 | Page Not Found \| Silverpot | — |

**`seoTitle` overrides** (names that are too long):
- `c-8576-2`: "8576 2-Compartment Aluminium Container | Silverpot"
- `c-8576-3`: "8576 3-Compartment Aluminium Container | Silverpot"
- `c-83166`: "83166 Broast Aluminium Container with Lid | Silverpot"
- `c-83120e`: "83120E Aluminium Container with Lid | Silverpot"
- `f-30-cat`: "Catering Foil Roll 30 cm, 150 m / 300 m | Silverpot"
- `f-45-cat`: "Catering Foil Roll 45 cm, 150 m / 300 m | Silverpot"
- `f-promo-cf`: "Promo Pack: Foil 45 cm + Cling Film | Silverpot"
- `f-promo-3`: "Promo Pack: 3 × Foil 45 cm × 37.5 sq ft | Silverpot"

Arabic metadata: translate titles and descriptions (native review) and keep the model codes.

### 11.2 Keywords

Use these naturally in H1s, intros, product descriptions and alt text. Never stuff them.

**EN primary:** aluminium containers UAE · aluminium food containers with lid · aluminium foil container manufacturer UAE · aluminium containers Ajman · disposable aluminium containers Dubai · aluminium foil roll wholesale UAE · catering foil roll 45 cm · aluminium platter UAE.

**EN long tail:** 3 compartment aluminium container · 2 compartment aluminium food container · broast aluminium container · aluminium container for biryani · aluminium foil 30 cm roll · aluminium foil 45 cm × 37.5 sq ft · catering aluminium foil 300 m · aluminium container 8325 (and every model code) · aluminium tray for kunafa.

**US spelling** (metadata keywords and alt variants only): aluminum containers UAE · aluminum foil roll.

**AR (native review):** علب ألمنيوم للطعام · علب ألمنيوم بغطاء · حاويات ألمنيوم · ورق ألمنيوم · رول ورق ألمنيوم للمطاعم · صواني ألمنيوم · مصنع علب ألمنيوم في عجمان · علب ألمنيوم الإمارات · علب ألمنيوم 3 خانات.

### 11.3 Structured data (JSON-LD)

Render with a `<JsonLd>` server component. Include only confirmed values. **Never add `offers`, `aggregateRating` or `review` without real data.** Without them, products won't get price rich results, and that's acceptable.

**Organization (every page, in the root layout)**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://silverpot.org/#organization",
  "name": "Silverpot",
  "legalName": "Al Mohamadi Light Industries Co. LLC",
  "alternateName": ["Silver Pot", "SILVERPOT"],
  "url": "https://silverpot.org",
  "logo": "https://silverpot.org/brand/silverpot-logo.png",
  "foundingDate": "1997",
  "foundingLocation": { "@type": "Place", "name": "Ajman, United Arab Emirates" },
  "email": "info@silverpot.org",
  "telephone": "+971-6-743-1314",
  "address": { "@type": "PostalAddress", "addressLocality": "Ajman", "addressCountry": "AE" },
  "contactPoint": [
    { "@type": "ContactPoint", "telephone": "+971-6-743-1314", "contactType": "sales", "areaServed": "AE" },
    { "@type": "ContactPoint", "telephone": "+971-50-849-4521", "contactType": "customer service", "areaServed": "AE" }
  ],
  "sameAs": []
}
```
Add `streetAddress`, `geo`, `openingHoursSpecification`, `availableLanguage` and `sameAs` once they're confirmed.

**WebSite + SearchAction (home)**
```json
{ "@context": "https://schema.org", "@type": "WebSite", "@id": "https://silverpot.org/#website",
  "url": "https://silverpot.org", "name": "Silverpot", "inLanguage": ["en", "ar"],
  "publisher": { "@id": "https://silverpot.org/#organization" },
  "potentialAction": { "@type": "SearchAction",
    "target": "https://silverpot.org/products?q={search_term_string}",
    "query-input": "required name=search_term_string" } }
```

**Product (product detail page)**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://silverpot.org/products/containers/8325-aluminium-container-with-lid#product",
  "name": "Aluminium Container with Lid – 8325",
  "sku": "8325",
  "mpn": "8325",
  "image": ["https://silverpot.org/images/products/8325-aluminium-container-with-lid-1.jpg"],
  "description": "Model 8325 is a single-compartment aluminium container supplied with a matching lid…",
  "brand": { "@type": "Brand", "name": "Silverpot" },
  "manufacturer": { "@id": "https://silverpot.org/#organization" },
  "category": "Aluminium Food Containers",
  "material": "Aluminium",
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Lid", "value": "Included" }
  ]
}
```
Add a `PropertyValue` for each confirmed spec (compartments, capacity in ml with `unitCode: "MLT"`, dimensions in mm with `unitCode: "MMT"`, roll width in cm with `unitCode: "CMT"`).

**Other schemas**
- **BreadcrumbList:** on every inner page.
- **ItemList:** on category pages and `/products`, with `ListItem` positions linking to each product URL.
- **FAQPage:** on `/faq` and on category and product pages that render FAQs (rendered questions only).
- **AboutPage:** on `/about`, with `mainEntity` set to the Organization `@id`.
- **ContactPage:** on `/contact`.

### 11.4 Technical SEO

- **Canonical:** absolute, with no trailing slash and no query string. Each locale is self-canonical.
- **hreflang:** use `alternates.languages`: `{ en: '/…', ar: '/ar/…', 'x-default': '/…' }` on every page.
- **`sitemap.ts`:** every indexable URL in both locales with `alternates.languages`, and `lastModified` from build time.
- **`robots.ts`:** allow `/`; disallow `/quote`, `/ar/quote`, `/dev`, `/api`; include `sitemap: https://silverpot.org/sitemap.xml`.
- **Headings:** one `h1` per page, and a logical h2/h3 order with no skipped levels for styling.
- **Internal linking:**
  - Every product links to its family, its siblings and its "pairs well with" products.
  - Every family page links to the size finder and to wholesale.
  - The footer links every family and core page.
- **Breadcrumbs:** visible on all inner pages.
- **`manifest.ts`:** name "Silverpot", theme colour `#FFD21F`, background `#FFFFFF`, icons from the foil-spiral O mark.
- **Favicon:** the `icon.svg` foil-spiral O in Blue on Yellow, plus `apple-icon.png`.

### 11.5 Legacy redirects (preserve rankings, kill the spam)

The old site used query-string URLs on `/`. `next.config` redirects pass query strings through, so implement this in **middleware (or `proxy.ts`)** and issue clean **308** redirects without the query.

```ts
// src/data/redirects.ts
export const LEGACY_PRODUCT: Record<string, string> = {
  'aluminum-container-with-lid-8325': '/products/containers/8325-aluminium-container-with-lid',
  'aluminum-container-with-lid-8342': '/products/containers/8342-aluminium-container-with-lid',
  'aluminum-container-with-lid-8357': '/products/containers/8357-aluminium-container-with-lid',
  'aluminum-container-with-lid-8367': '/products/containers/8367-aluminium-container-with-lid',
  'aluminum-container-with-lid-8389': '/products/containers/8389-aluminium-container-with-lid',
  'aluminum-container-with-lid-83120': '/products/containers/83120-aluminium-container-with-lid',
  'aluminum-container-with-lid-83120e-1120': '/products/containers/83120e-aluminium-container-with-lid',
  'aluminum-container-with-lid-83166-broast': '/products/containers/83166-broast-aluminium-container-with-lid',
  'aluminum-container-with-lid-83185': '/products/containers/83185-aluminium-container-with-lid',
  'aluminum-container-with-lid-83241': '/products/containers/83241-aluminium-container-with-lid',
  'aluminum-container-with-lid-73365': '/products/containers/73365-aluminium-container-with-lid',
  'aluminum-container-with-lid-8576-2compartment': '/products/containers/8576-2-compartment-aluminium-container-with-lid',
  'aluminum-container-with-lid-8576-3compartment': '/products/containers/8576-3-compartment-aluminium-container-with-lid',
  'aluminum-platter-6550': '/products/platters/6550-aluminium-platter',
  'aluminum-platter-6586': '/products/platters/6586-aluminium-platter',
  'aluminum-platter-65180': '/products/platters/65180-aluminium-platter',
  'aluminum-platter-65220': '/products/platters/65220-aluminium-platter',
  'aluminum-foil-30cm-x-25-sq-ft': '/products/foil/aluminium-foil-roll-30cm-25-sqft',
  'aluminum-foil-30cm-x-75-sq-ft': '/products/foil/aluminium-foil-roll-30cm-75-sqft',
  'aluminum-foil-30cm-x-75-sq-ft-2': '/products/foil/aluminium-foil-roll-30cm-75-sqft',
  'aluminum-foil-30cm-x-200-sq-ft': '/products/foil/aluminium-foil-roll-30cm-200-sqft',
  'aluminum-foil-30cm-x-150-300-m': '/products/foil/catering-foil-roll-30cm-150m-300m',
  'aluminum-foil-30cm-x-150-300-m-2': '/products/foil/catering-foil-roll-30cm-150m-300m',
  'aluminum-foil-45cm-x-13-50-sqft': '/products/foil/aluminium-foil-roll-45cm-13-5-sqft',
  'aluminum-foil-45cm-x-37-50-sqft': '/products/foil/aluminium-foil-roll-45cm-37-5-sqft',
  'aluminum-foil-45cm-x-150-300-m': '/products/foil/catering-foil-roll-45cm-150m-300m',
  'aluminum-foil-45cm-x-150-300m': '/products/foil/catering-foil-roll-45cm-150m-300m',
  'promo-pack-foil-45x37-50-sqft-c-f-30x100-sqft': '/products/foil/promo-pack-foil-45cm-37-5-sqft-cling-film-30cm-100-sqft',
  'promo-pack-foil-45x37-50-sqft-1x3-packing': '/products/foil/promo-pack-foil-45cm-37-5-sqft-3-pack',
};
export const LEGACY_CATEGORY: Record<string, string> = {
  'aluminum-container': '/products/containers',
  'aluminum-platter': '/products/platters',
  'aluminum-foil': '/products/foil',
};
export const LEGACY_PAGE_ID: Record<string, string> = {
  '997': '/products',   // "Shop"
  '252': '/about',
  '357': '/contact',
};
```

**Middleware logic** (runs only when `pathname === '/'` and a query string is present):
1. `?product=` → `LEGACY_PRODUCT` → 308.
2. `?product_cat=` → `LEGACY_CATEGORY` → 308.
3. `?page_id=` → `LEGACY_PAGE_ID` → 308.
4. `?post_type=product` → `/products` → 308.
5. `?s={q}` → `/products?q={q}` → 308.
6. Any **other** `product`, `page_id`, `p`, `cat`, `attachment_id` or `author` value → **410 Gone**. This cleans out injected spam URLs.

**Path rules:** `/wp-admin*`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json*`, `/feed*`, `/comments/feed*` and `/wp-content/*` → **410**.

**Test:** `tests/redirects.spec.ts` must assert every key above, plus three random spam-looking query values returning 410.

### 11.6 Open Graph images

Use `opengraph-image.tsx` per route segment (`next/og`, 1200×630, fonts loaded from local TTF files):
- **Product:** Yellow background with a 6 px Blue border. The wordmark sits top-left at 40 px. The model code is huge (Big Shoulders 900, 260 px) on the left, the product photo sits in a RimFrame on the right, and the tagline runs along the bottom in Gochi Hand, Red.
- **Category and pages:** the background is the family or page colour, with the H1 in Bricolage 800 at 96 px and Crinkle in the corner.
- **Default:** the wordmark on Yellow with "Light metal. Heavy duty."
- Add `twitter:card = summary_large_image`.

### 11.7 Content SEO (phase 2, set up now)

Add an MDX-powered `/guides` section (`@next/mdx`), but don't publish articles without client review. Starter briefs:
1. "Which aluminium container size for how many people?" (needs confirmed capacities)
2. "Can you put aluminium containers in the oven, freezer or air fryer?" (needs confirmed product guidance)
3. "30 cm vs 45 cm foil: which roll does your kitchen need?"
4. "How to recycle aluminium containers and foil in the UAE"

---

## 12. PERFORMANCE AND ACCESSIBILITY BUDGETS

### 12.1 Performance (mobile, simulated Moto G Power on 4G)

| Metric | Budget |
|---|---|
| LCP | ≤ 2.0 s (the LCP element is the hero H1 text: never hidden, never an image) |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 (reserve space for images, fonts with `size-adjust` fallbacks, no late banners) |
| First-load JS (home) | ≤ 150 KB gzip |
| Total page weight (home, first view) | ≤ 900 KB |
| Fonts | ≤ 4 files on the English first view (Big Shoulders 900, Bricolage variable, Gochi Hand; Stencil lazy-loaded) |
| Third-party requests on first view | 0 (analytics deferred) |

**Techniques**
- Pages are server components; motion runs in client leaves through `LazyMotion`.
- Lenis, rough-notation, cmdk and Fuse are dynamically imported on interaction or when visible.
- Use the map facade, set `content-visibility: auto` on long below-fold sections, inline SVG illustrations under 8 KB, and use pure CSS for the marquee, shimmer and grain.

### 12.2 Accessibility (WCAG 2.2 AA, aim higher where cheap)

- Colour pairs only from §3.3. Never rely on colour alone: stickers carry text, and selected chips carry a check icon.
- **Keyboard:** everything is reachable and operable. Menus, drawers and dialogs trap focus and restore it on close. Esc closes them. Focus is visible everywhere (§3.11).
- **Targets:** at least 44×44 px on touch.
- **Live regions:** quote count, filter result count, form status.
- **Forms:** visible labels, `autocomplete` attributes, error summary at the top on submit, `aria-invalid` and `aria-describedby`.
- **Semantics:** landmarks (`header`, `nav`, `main`, `footer`), one `h1`, button vs link used correctly, the stretched-link card pattern.
- **Motion:** reduced motion is respected (§4.5). Nothing flashes more than 3 times a second.
- **Decorative art:** decorative SVGs get `aria-hidden`. Meaningful illustrations get `role="img"` and a label.
- **Language:** `lang` and `dir` are correct per locale, and Latin codes inside Arabic text use `<bdi>`.
- **Testing:** automated axe checks in Playwright on every page template, plus a manual screen-reader pass (VoiceOver iOS + NVDA) on Home, a product page and Quote.

---

## 13. RESPONSIVE BEHAVIOUR MATRIX

| Element | Mobile (360–767) | Tablet (768–1023) | Desktop (≥ 1024) |
|---|---|---|---|
| Top bar | WhatsApp line only, centred | Both items | Both items |
| Header | Wordmark + Search + Quote + Menu | Same as mobile | Full nav + mega menu |
| Hero wordmark | Full width, Crinkle 64 px | Full width, Crinkle 96 px | Full width, Crinkle 140 px, eye tracking |
| Hero buttons | Stacked, full width | Inline | Inline |
| Conveyor | 30 px codes | 38 px | 44 px + hover thumbnails |
| Bento | Stacked; Yellow + Red tiles side by side | 2 columns | 12-column bento |
| Category tiles | Stacked, 16:11 | 3 columns, 3:4 | 3 columns, 4:5 |
| Product grid | 2 columns, compact cards | 3 columns | 4 columns (≥ 1280) |
| Filters | "Filters" button → bottom sheet | Inline, wraps | Inline, sticky |
| Product detail | Swipe gallery, then info; sticky bottom bar | 2 columns, gallery not sticky | 7/5 columns, sticky gallery |
| Dimension overlay | Toggle only | Toggle | Toggle + card hover draw |
| Sticker wall | 2-column static grid | 3-column static grid | Draggable board |
| Coil to container | Vertical list | Vertical list | Sticky scroll story |
| Quote | Bottom sheet + `/quote` page | Drawer | Drawer |
| Footer | Accordion columns | 2×2 | 4 columns |
| Floating WhatsApp | After 30% scroll (not on product detail or category pages) | Same | Same |

Test at 360, 390, 414, 768, 1024, 1280, 1440 and 1920 px widths, plus landscape phones (844×390). There must be no horizontal page scroll at any width.

---

## 14. LAUNCH AND POST-LAUNCH (hand to the client's IT contact)

1. **Before DNS changes:** run the image fetch script and commit the images. Export the WordPress database and uploads as a backup (to the client, not into this repo).
2. **DNS:** point `silverpot.org` and `www` to Vercel. **Keep the existing MX, SPF, DKIM and DMARC records unchanged** so `info@silverpot.org` email keeps working. Add DNS records for Resend (sending domain) if it's used.
3. **Decommission WordPress:** take it offline after the DNS switch, and rotate the hosting, database and FTP passwords. The old install is compromised.
4. **Google Search Console:**
   - Verify the domain property.
   - Submit `sitemap.xml`.
   - Check **Security issues** and **Manual actions**. If either shows hacked content, request a review after launch.
   - Inspect and request indexing for the home page, the 3 categories and the top products.
   - Search `site:silverpot.org casino`, `site:silverpot.org bet` and `site:silverpot.org spin`. Confirm those URLs return 410, and use the Removals tool for any that are still showing.
5. **Bing Webmaster Tools:** import from Search Console.
6. **Google Business Profile:** claim or create it with exactly the same name, address and phone as the site. Add photos and the website link.
7. **First 30 days:** check Search Console coverage and 404s weekly, monitor Core Web Vitals in Speed Insights, and review quote and WhatsApp click events.

---

## 15. QA AND ACCEPTANCE CHECKLIST

**Functional**
- [ ] All 26 product pages build in EN and AR. Every legacy URL in §11.5 redirects with 308 to the right page, and unknown legacy params return 410.
- [ ] Filters and sort work, are URL-synced, and back/forward restores state.
- [ ] Search finds products by full code, partial code (e.g. "83"), alias ("1120") and name words.
- [ ] Add to quote works from cards, product pages and the size finder. The quote list persists across reloads, quantity and unit edits work, and items can be removed.
- [ ] Quote, contact and wholesale forms validate, deliver email to `SALES_EMAIL`, send the auto-reply, rate-limit, and pass Turnstile.
- [ ] The WhatsApp message is formatted exactly as in §5.4 and is correctly URL-encoded with Arabic text too.
- [ ] The map loads only after the user clicks.
- [ ] Review mode shows every `[CONFIRM]` item highlighted. Production mode shows none.

**Visual and brand**
- [ ] Colours only from §3.3. Black appears only where §3.3 allows.
- [ ] Hard shadows appear only on pressable elements.
- [ ] No eyebrow labels, no monospace font, no arrow-suffixed button labels, and no numbered markers outside real sequences.
- [ ] Crinkle appears at most twice per page.
- [ ] Every page has been checked against its §7 spec at 390 and 1440 px, with screenshots saved in `/docs/QA/`.

**Motion**
- [ ] There's one orchestrated moment per page, and the hero sequence skips on repeat visits in the same session.
- [ ] Reduced-motion mode is verified on Home, a product page, Quote and About.

**Accessibility**
- [ ] axe shows 0 violations on all templates.
- [ ] Keyboard-only purchase-to-quote flow works end to end.
- [ ] Contrast spot-checks pass on every colour pair used.

**Performance**
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100 on Home, `/products`, one product page and `/contact`.
- [ ] Bundle analyser confirms the home first-load JS is ≤ 150 KB gzip.

**SEO**
- [ ] Unique titles and descriptions on every page. Canonicals, hreflang, the sitemap and robots are correct.
- [ ] Rich Results Test is valid for Product, BreadcrumbList, FAQPage, Organization and WebSite.
- [ ] OG images render for Home, a category and a product.

**Content**
- [ ] No lorem ipsum. No text from the old site outside §7. Every new string is logged in `/docs/NEW_COPY.md`.
- [ ] Arabic strings are marked `arReviewed: false` until a native speaker signs off.

---

## 16. [CONFIRM] REGISTER (questions for the client)

1. Is the brand spelling "Silverpot" (one word) OK? Is there an official Arabic brand name? Is the trademark registered (®)?
2. Full street address, P.O. Box and the map pin (Google Business Profile link).
3. Factory or office hours, and the typical reply time for quotes.
4. Is +971 50 849 4521 on WhatsApp? Which number should receive WhatsApp leads?
5. Social media URLs (Instagram, Facebook, Pinterest, YouTube).
6. **For every product:** capacity (ml), top dimensions and depth (mm), lid material, pieces per pack, packs per carton, and oven, freezer and microwave guidance.
7. What's the difference between 83120 and 83120E (1120)?
8. Platter shapes and sizes, and whether lids are available.
9. Does "C/F" mean cling film? Do "150/300 M" catering rolls come as two lengths?
10. Are the two "30 cm × 75 sq ft" listings two pack designs of the same product?
11. Which products are the real bestsellers (for "Start with these")?
12. Minimum order, delivery areas and lead times, payment terms, samples.
13. Do you sell to households? Do you export (which countries)?
14. Do you offer custom or private-label printing?
15. Food-contact compliance and certifications (ISO, municipality approvals, and so on), with files or logos.
16. Production numbers you're happy to publish (capacity, team size, years, countries).
17. Is the coil-to-container process description accurate for your factory?
18. Do you still offer tableware, cleaning and hygiene products? If yes, should they be added as categories?
19. Factory, product-in-use and team photos, or approval for a new shoot (§3.9 brief).
20. Any sustainability actions to mention (scrap recycling, recycled content)?
21. Trade licence number (optional, for the About page).
22. A native Arabic reviewer for all copy.
23. Legal review of the Privacy and Terms pages.

---

## APPENDIX — kickoff message for Antigravity

> Read `/docs/MASTER_PROMPT.md` completely before writing any code. Build the Silverpot website exactly as specified, phase by phase (§0.2). Treat §0.1 as hard rules: never invent facts, model unknowns as unconfirmed, and hide them in production. Start with Phase 1. At the end of each phase, run lint, typecheck and build, open the affected pages in the browser at 390×844 and 1440×900, take screenshots, compare them with the spec, fix any differences, then summarise what you built and what's next in `/docs/DECISIONS.md`. Ask me before deviating from the design system in §3 or the motion rules in §4.
