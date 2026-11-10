# New copy register

Every English string on the site that is **not** taken verbatim from `docs/MASTER_PROMPT.md` (§0.1: "List every new string"). The client should approve or rewrite these before launch.

How this list was made: every English string in `messages/en.json`, the data files (`src/data/*`) and the legal drafts was compared with the spec text (quotes, dashes, ICU placeholders and markdown escapes normalised). Strings found verbatim in the spec are left out. 169 strings remain.

Notes for reviewers:

- **Product names and alt text.** These follow the §2.7 naming convention exactly, but the spec writes some of them differently (for example "x" instead of "×"), so they're listed for completeness. Alt text is generated from the product name: `{name} by Silverpot – product photo`.
- **Fallback copy.** Where a product's spec copy depends on an unconfirmed fact (for example "C/F" in the promo pack), the site shows the neutral `fallback` text in production until the fact is confirmed (§0.1). Those fallbacks are listed here.
- **Hidden until confirmed.** Strings that only render in review mode (`NEXT_PUBLIC_REVIEW_MODE=true`), such as `review.*`, `*.note` and FAQ answers with `status: 'confirm'`, are listed too, because they're copy someone will read.
- **Arabic.** All 503 strings in `messages/ar.json`, plus the `ar` fields in the data files and legal drafts, are new translations written for this build. They're drafts (`arReviewed: false`) until a native speaker signs off ([CONFIRM] #22). They aren't repeated here; `messages/ar.json` mirrors the English keys one to one.
- **Legal.** The Privacy and Terms pages are plain-language drafts and need legal review ([CONFIRM] #23).

## UI messages (`messages/en.json`)

92 strings.

| Where | English |
|---|---|
| `meta.quote.description` | Review the products on your quote list, set quantities and send it to Silverpot by form or WhatsApp. |
| `meta.privacy.title` | Privacy Policy \| Silverpot |
| `meta.privacy.description` | How Silverpot handles the details you send through our quote and contact forms. |
| `meta.terms.title` | Terms of Use \| Silverpot |
| `meta.terms.description` | The terms for using silverpot.org, product information and quotations from Silverpot, Ajman, UAE. |
| `meta.keywords` | aluminium containers UAE, aluminium food containers with lid, aluminium foil container manufacturer UAE, aluminium containers Ajman, disposable aluminium containers Dubai, aluminium foil roll wholesale UAE, catering foil roll 45 cm, aluminium platter UAE, aluminum containers UAE, aluminum foil roll |
| `common.previous` | Previous |
| `common.external` | (opens in a new tab) |
| `review.placeholder` | {label}: needs client confirmation |
| `crinkle.label` | Aloom, Silverpot’s unofficial head of quality control |
| `nav.homeLabel` | Silverpot home |
| `nav.closeMenu` | Close menu |
| `nav.quoteLabel` | Your quote, {count, plural, =0 {no items} one {# item} other {# items}} |
| `nav.megaFinderCta` | Open the size finder |
| `nav.megaClose` | Close products menu |
| `footer.tradingName` | Silverpot is a trading name of Al Mohamadi Light Industries Co. LLC. |
| `home.hero.stamp` | MADE IN AJMAN · SINCE 1997 · |
| `home.featured.progress` | Rail position |
| `home.segments.dragHint` | go on, rearrange us |
| `home.why.delivered.note` | Delivery coverage |
| `home.why.bulk.note` | Minimum order (MOQ) |
| `catalogue.searchLabel` | Search products |
| `catalogue.clearSearch` | Clear search |
| `catalogue.wholesaleLink` | Wholesale and bulk orders |
| `catalogue.platters.introNote` | Platter shapes, sizes and lid options |
| `product.specs` | Specifications |
| `product.unit` | Order in |
| `product.decrease` | Decrease quantity |
| `product.increase` | Increase quantity |
| `product.zoom` | Zoom into photo |
| `product.zoomTitle` | {name}, enlarged photo |
| `quote.note` | Note for this product |
| `quote.review` | Review and send |
| `quote.clear` | Clear list |
| `quote.responseTimeLabel` | Reply time in working hours |
| `quote.toastRemoved` | Removed from your quote |
| `quote.removeItem` | Remove {name} from your quote |
| `quote.listHeading` | Products in your quote |
| `quote.detailsHeading` | Your details |
| `forms.privacyLink` | Privacy policy |
| `forms.choose` | Choose one |
| `forms.honeypot` | Leave this field empty |
| `forms.sending` | Sending… |
| `forms.errors.company` | Enter your company name. |
| `forms.errors.name` | Enter your name. |
| `forms.errors.email` | Enter an email address like name@company.com. |
| `forms.errors.phone` | Enter a phone number with country code, for example +971 50 123 4567. |
| `forms.errors.businessType` | Choose your business type. |
| `forms.errors.emirate` | Choose an emirate or country. |
| `forms.errors.deliveryEmirate` | Choose the emirate we’re delivering to. |
| `forms.errors.topic` | Choose a topic. |
| `forms.errors.message` | Write a short message so we know how to help. |
| `forms.errors.consent` | Tick the box so we can contact you about this request. |
| `forms.errors.items` | Add at least one product to your quote. |
| `forms.errors.tooLong` | Keep this under {max} characters. |
| `forms.errors.date` | Pick a date from today onwards. |
| `forms.errors.rateLimited` | That’s a lot of requests in a short time. Try again in a few minutes, or message us on WhatsApp. |
| `forms.errors.spam` | We couldn’t verify this request. Reload the page and try again. |
| `forms.errors.sendFailed` | We couldn’t send your request just now. Try again, or send it to us on WhatsApp. |
| `finder.progressLabel` | Size finder progress |
| `finder.answersMsg` | Hi Silverpot! I used the size finder on silverpot.org. Food: {food} Servings: {servings} Compartments: {comp} Which model would you recommend? |
| `finder.yourAnswers` | Your answers |
| `wholesale.subNote` | GCC supply |
| `wholesale.howH2` | How ordering works. |
| `wholesale.steps.3.body` | We confirm price, stock and lead time. |
| `wholesale.steps.3.note` | Reply time (within X working hours) |
| `wholesale.steps.4.body` | Straight from Ajman to your door. |
| `wholesale.whoH2` | Who we supply. |
| `wholesale.termsH2` | Terms at a glance. |
| `about.storyH2` | Our story. |
| `about.photoNeeded` | Factory photo needed |
| `about.processH2` | From coil to container. |
| `about.processNote` | Process wording to be checked with the factory |
| `about.standH2` | What we stand for. |
| `about.certsH2` | Quality and certifications. |
| `about.galleryH2` | On the factory floor. |
| `about.detailsH2` | Company details. |
| `sustainability.afterlifeH2` | The afterlife of a container. |
| `sustainability.loopNote` | and round again |
| `sustainability.howH2` | How to recycle us properly. |
| `sustainability.doingH2` | What we’re doing. |
| `faqPage.searchLabel` | Search questions |
| `faqPage.searchPlaceholder` | Search questions, for example oven |
| `faqPage.noResults` | No questions match “{q}”. Try another word, or ask a human below. |
| `contact.whatsappNote` | WhatsApp number and response speed |
| `contact.directions` | Get directions |
| `contact.mapH2` | Find the factory. |
| `contact.mapNote` | The map loads from Google only when you ask for it. |
| `contact.mapTitle` | Map showing Al Mohamadi Light Industries Co LLC in Ajman |
| `search.label` | Search products |
| `search.hint` | Enter to open · Shift+Enter to add to quote |
| `search.open` | Open search |

## Product copy (`src/data/products.ts`)

48 strings.

| Where | English |
|---|---|
| `products[c-8342].images.0.alt` | Aluminium Container with Lid – 8342 by Silverpot – product photo |
| `products[c-8357].images.0.alt` | Aluminium Container with Lid – 8357 by Silverpot – product photo |
| `products[c-8367].images.0.alt` | Aluminium Container with Lid – 8367 by Silverpot – product photo |
| `products[c-8389].images.0.alt` | Aluminium Container with Lid – 8389 by Silverpot – product photo |
| `products[c-83120].images.0.alt` | Aluminium Container with Lid – 83120 by Silverpot – product photo |
| `products[c-83120e].images.0.alt` | Aluminium Container with Lid – 83120E (1120) by Silverpot – product photo |
| `products[c-83166].images.0.alt` | Aluminium Broast Container with Lid – 83166 by Silverpot – product photo |
| `products[c-83185].images.0.alt` | Aluminium Container with Lid – 83185 by Silverpot – product photo |
| `products[c-83241].images.0.alt` | Aluminium Container with Lid – 83241 by Silverpot – product photo |
| `products[c-73365].images.0.alt` | Aluminium Container with Lid – 73365 by Silverpot – product photo |
| `products[c-73365].fallback.description` | Model 73365 is an aluminium container with lid, pressed in Ajman and supplied by the carton. |
| `products[c-8576-2].images.0.alt` | 2-Compartment Aluminium Container with Lid – 8576 by Silverpot – product photo |
| `products[c-8576-3].images.0.alt` | 3-Compartment Aluminium Container with Lid – 8576 by Silverpot – product photo |
| `products[p-6550].description` | Model 6550 is an aluminium platter for catering trays, buffet lines and family-style serving. Pressed in Ajman and supplied by the carton. Ask us about matching lids and mixed cartons. |
| `products[p-6550].images.0.alt` | Aluminium Platter – 6550 by Silverpot – product photo |
| `products[p-6586].description` | Model 6586 is an aluminium platter for catering trays, buffet lines and family-style serving. Pressed in Ajman and supplied by the carton. Ask us about matching lids and mixed cartons. |
| `products[p-6586].images.0.alt` | Aluminium Platter – 6586 by Silverpot – product photo |
| `products[p-65180].description` | Model 65180 is an aluminium platter for catering trays, buffet lines and family-style serving. Pressed in Ajman and supplied by the carton. Ask us about matching lids and mixed cartons. |
| `products[p-65180].images.0.alt` | Aluminium Platter – 65180 by Silverpot – product photo |
| `products[p-65220].description` | Model 65220 is an aluminium platter for catering trays, buffet lines and family-style serving. Pressed in Ajman and supplied by the carton. Ask us about matching lids and mixed cartons. |
| `products[p-65220].images.0.alt` | Aluminium Platter – 65220 by Silverpot – product photo |
| `products[f-30-25].shortName` | Aluminium Foil Roll 30 cm × 25 sq ft |
| `products[f-30-25].description` | A 30 cm wide aluminium foil roll with 25 sq ft of wrap, made for everyday cooking, baking, grilling and covering leftovers. Compact enough for any kitchen drawer. |
| `products[f-30-25].images.0.alt` | Aluminium Foil Roll – 30 cm × 25 sq ft by Silverpot – product photo |
| `products[f-30-75].shortName` | Aluminium Foil Roll 30 cm × 75 sq ft |
| `products[f-30-75].description` | A 30 cm wide aluminium foil roll with 75 sq ft of wrap, made for everyday cooking, baking, grilling and covering leftovers. Three times the length of our 25 sq ft roll, at the same width. |
| `products[f-30-75].images.0.alt` | Aluminium Foil Roll – 30 cm × 75 sq ft by Silverpot – product photo |
| `products[f-30-75].images.1.alt` | Aluminium Foil Roll – 30 cm × 75 sq ft by Silverpot – product photo – alternate pack |
| `products[f-30-200].shortName` | Aluminium Foil Roll 30 cm × 200 sq ft |
| `products[f-30-200].description` | A 30 cm wide aluminium foil roll with 200 sq ft of wrap, made for everyday cooking, baking, grilling and covering leftovers. Our longest 30 cm household roll, for busy kitchens. |
| `products[f-30-200].images.0.alt` | Aluminium Foil Roll – 30 cm × 200 sq ft by Silverpot – product photo |
| `products[f-30-cat].shortName` | Catering Foil Roll 30 cm × 150 m / 300 m |
| `products[f-30-cat].description` | A professional 30 cm aluminium foil roll in 150 m or 300 m lengths, for restaurant and catering kitchens that wrap, line and cover all day. |
| `products[f-30-cat].images.0.alt` | Catering Foil Roll – 30 cm × 150 m / 300 m by Silverpot – product photo |
| `products[f-45-13].shortName` | Aluminium Foil Roll 45 cm × 13.5 sq ft |
| `products[f-45-13].description` | A 45 cm wide aluminium foil roll with 13.5 sq ft of wrap, made for everyday cooking, baking, grilling and covering leftovers. Extra width covers large trays in one sheet. |
| `products[f-45-13].images.0.alt` | Aluminium Foil Roll – 45 cm × 13.5 sq ft by Silverpot – product photo |
| `products[f-45-37].description` | A 45 cm wide aluminium foil roll with 37.5 sq ft of wrap, made for everyday cooking, baking, grilling and covering leftovers. Wide enough for big oven trays, long enough to last. |
| `products[f-45-37].images.0.alt` | Aluminium Foil Roll – 45 cm × 37.5 sq ft by Silverpot – product photo |
| `products[f-45-cat].shortName` | Catering Foil Roll 45 cm × 150 m / 300 m |
| `products[f-45-cat].description` | A professional 45 cm aluminium foil roll in 150 m or 300 m lengths, for restaurant and catering kitchens that wrap, line and cover all day. |
| `products[f-promo-cf].shortName` | Promo Pack Foil 45 cm × 37.5 sq ft + Cling Film 30 cm × 100 sq ft |
| `products[f-promo-cf].fallback.shortName` | Promo Pack Foil 45 cm × 37.5 sq ft + C/F 30 cm × 100 sq ft |
| `products[f-promo-cf].fallback.tagline` | Two kitchen essentials. One pack. |
| `products[f-promo-cf].fallback.description` | A promo pack pairing a 45 cm × 37.5 sq ft aluminium foil roll with a 30 cm × 100 sq ft C/F roll: two kitchen essentials in one pack. |
| `products[f-promo-cf].images.0.alt` | Promo Pack – Foil 45 cm × 37.5 sq ft + C/F 30 cm × 100 sq ft by Silverpot – product photo |
| `products[f-promo-3].shortName` | Promo Pack Foil 45 cm × 37.5 sq ft (Pack of 3) |
| `products[f-promo-3].images.0.alt` | Promo Pack – Foil 45 cm × 37.5 sq ft (Pack of 3) by Silverpot – product photo |

## FAQ and use-case labels (`src/data/faq.ts`, `src/data/usecases.ts`)

7 strings.

| Where | English |
|---|---|
| `faq.17.q` | Do the platters come with lids? |
| `faq.17.a` | [Client to confirm lid options for each platter.] |
| `faq.18.q` | What are the platters used for? |
| `faq.19.q` | What are catering rolls? |
| `usecases.useCaseLabels.baking-roasting` | Baking and roasting |
| `usecases.useCaseLabels.catering-buffet` | Catering and buffets |
| `usecases.useCaseLabels.freezing-meal-prep` | Freezing and meal prep |

## Privacy and Terms drafts (`src/content/legal.ts`)

22 strings.

| Where | English |
|---|---|
| `legal.privacy.title` | Privacy policy. |
| `legal.privacy.intro` | This policy explains what happens to the details you send us through silverpot.org. Silverpot is a brand of Al Mohamadi Light Industries Co. LLC, Ajman, United Arab Emirates. |
| `legal.privacy.s1.p1` | Only what you type into our quote, wholesale and contact forms: your name, company, email address, phone number, business type, delivery emirate, the products and quantities on your quote list, and your message. |
| `legal.privacy.s1.p2` | Your quote list itself is stored in your own browser until you send it. We don’t see it until you do. |
| `legal.privacy.s2.h` | Why we collect it |
| `legal.privacy.s2.p1` | To answer your request: to prepare a quote, reply to your question, or follow up on a wholesale enquiry. We don’t sell your details or use them for unrelated marketing. |
| `legal.privacy.s3.p1` | Form submissions are sent to our sales inbox by email through our email delivery provider. If you choose to message us on WhatsApp instead, that conversation is handled by WhatsApp under its own terms. |
| `legal.privacy.s3.p2` | The map on our contact page only loads from Google when you ask for it. |
| `legal.privacy.s4.h` | Analytics and cookies |
| `legal.privacy.s4.p1` | We use cookieless, privacy-friendly analytics to count visits and see which pages help people. They don’t identify you, and we don’t set advertising cookies. |
| `legal.privacy.s5.p1` | We keep enquiry emails for as long as we need them to deal with your request and any order that follows, and to meet our legal and accounting obligations. |
| `legal.privacy.s6.p1` | You can ask to see, correct or delete the personal data we hold about you, in line with the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) and other applicable law. |
| `legal.privacy.s7.p1` | Questions about this policy: email info@silverpot.org or call +971 6 743 1314. |
| `legal.terms.title` | Terms of use. |
| `legal.terms.intro` | These terms apply to your use of silverpot.org, run by Al Mohamadi Light Industries Co. LLC, Ajman, United Arab Emirates. |
| `legal.terms.s1.h` | Using this site |
| `legal.terms.s1.p1` | You may browse the site, build a quote list and contact us. Please don’t misuse the site, attempt to break it, or send automated requests through our forms. |
| `legal.terms.s2.p1` | Product photos and descriptions are indicative. Final specifications, including sizes, capacities, pack quantities and materials, are confirmed in your quotation. |
| `legal.terms.s3.p1` | Sending a quote request doesn’t create an order or a contract. A quote becomes binding only once we confirm it to you in writing and you accept it. |
| `legal.terms.s4.p1` | The Silverpot name, wordmark, illustrations, photos and text on this site belong to Al Mohamadi Light Industries Co. LLC. Please don’t reuse them without permission. |
| `legal.terms.s5.p1` | These terms are governed by the laws of the United Arab Emirates as applied in the Emirate of Ajman. |
| `legal.terms.s6.p1` | Questions about these terms: email info@silverpot.org or call +971 6 743 1314. |


## Added with client answers v1 (2026-10-21)

The English TEMP and LIKELY wording came from the client answers file and is tracked in `docs/PLACEHOLDERS.md`. These strings were written for this update and need approval like the rest:

| Where | English |
|---|---|
| `products[c-73365].tagline` | Built for big batches. Unbothered by them too. (replaces "Different series…", which implied the dropped "73 series") |
| `review.temp` | Placeholder: needs client answer (review mode only) |
| `product.microwave` | Microwave |
| `product.notRecommended` | Not recommended |

Arabic translations of every v1 stand-in (messages with `<temp>`, the FAQ answers and the tagline above) are new drafts (`arReviewed: false`).

## Added with design feedback round 1 (2026-10-21)

| Where | English |
|---|---|
| `crinkle.label`, `home.hero.note`, `about.steps.5.note` | Mascot renamed from Crinkle to **Aloom** (AR draft: آلوم, not ألوم, which reads "I blame") |
| `home.hero.h1` | "heat" wrapped in `<hot>` for the red highlight; wording unchanged |
| `home.conveyor.containers` | Aluminium containers |
| `home.conveyor.compartments` | Compartment containers |
| `home.conveyor.platters` | Aluminium platters |
| `home.conveyor.household` | Household foil rolls |
| `home.conveyor.catering` | Catering foil rolls |
| `home.conveyor.promo` | Foil promo packs |
