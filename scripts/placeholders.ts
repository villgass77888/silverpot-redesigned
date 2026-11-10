/**
 * Every LIKELY / TEMP answer from "client answers v1", keyed to docs/CLIENT_QUESTIONS.md.
 * This is the source for `pnpm check:placeholders` and docs/PLACEHOLDERS.md.
 *
 * `match` ties an entry to the markers in the code (`placeholder: true`, `status: 'placeholder'`,
 * `<temp>` in messages). Entries without `match` are decisions with nothing to mark
 * (a hidden section, a value left empty). When the client answers, update the data,
 * remove the marker and delete the entry here.
 */
export type PlaceholderEntry = {
  q: string;
  kind: 'LIKELY' | 'TEMP';
  where: string;
  value: string;
  /** Marker ids found by the scan, e.g. `site.whatsapp`, `faq.oven`, `messages.home.bento.body`. */
  match?: RegExp;
};

export const PLACEHOLDERS: PlaceholderEntry[] = [
  // A. Company and contact
  {
    q: '1',
    kind: 'TEMP',
    where: 'src/data/site.ts → address.street',
    value: 'Empty. Footer and contact show "Ajman, United Arab Emirates" only.',
  },
  {
    q: '2',
    kind: 'TEMP',
    where: 'src/data/site.ts → mapsQuery',
    value:
      'Click-to-load map and Directions use "Al Mohamadi Light Industries Co LLC - Ajman" (the old site’s query).',
  },
  {
    q: '3',
    kind: 'LIKELY',
    where: 'src/data/site.ts → whatsapp.number',
    value: '+971 50 849 4521 for every WhatsApp link.',
    match: /^site\.whatsapp$/,
  },
  {
    q: '4',
    kind: 'TEMP',
    where: 'src/data/site.ts → socials',
    value: 'All null: no social icons or links anywhere.',
  },
  {
    q: '5',
    kind: 'TEMP',
    where: 'messages → footer.tradingName',
    value: '"Silverpot is a brand of Al Mohamadi Light Industries Co. LLC."',
    match: /^messages\.footer\.tradingName$/,
  },
  {
    q: '6',
    kind: 'TEMP',
    where: 'messages → footer.hoursTemp (site.hours stays null, so no JSON-LD openingHours)',
    value: '"Saturday to Thursday, 8:00 am to 6:00 pm. Friday closed."',
    match: /^messages\.footer\.hoursTemp$/,
  },
  {
    q: '7',
    kind: 'TEMP',
    where: 'messages → quote.replyTimeTemp, wholesale.steps.3.body',
    value: '"We usually reply within one working day."',
    match: /^messages\.(quote\.replyTimeTemp|wholesale\.steps\.3\.body)$/,
  },
  {
    q: '8a',
    kind: 'TEMP',
    where: 'Copy and wordmark; JSON-LD alternateName',
    value: '"Silverpot" in prose, "SILVERPOT" in the wordmark, "Silver Pot" kept in alternateName.',
  },
  {
    q: '8b',
    kind: 'TEMP',
    where: 'messages/ar.json and Arabic data copy',
    value: 'Arabic brand name "سيلفربوت".',
  },
  { q: '8c', kind: 'TEMP', where: 'src/data/site.ts → trademarkRegistered: false', value: 'No ® anywhere.' },

  // B. Home page
  {
    q: '9',
    kind: 'TEMP',
    where: 'src/data/products.ts → featured; messages → home.featured.subSafe',
    value:
      'Picks 8325, 8342, 83166, 8576 (3-comp.), 6586, foil 30×75, foil 45×37.5, 45 cm catering roll. Sub-line "A few good places to start."',
    match: /^messages\.home\.featured\.subSafe$/,
  },
  {
    q: '10',
    kind: 'TEMP',
    where: 'messages → home.bento.body',
    value: '"…does the heavy lifting: hot food, cold storage, a full delivery bag."',
    match: /^messages\.home\.bento\.body$/,
  },
  {
    q: '26',
    kind: 'TEMP',
    where: 'messages → about.stand.heat.body',
    value: '"Made for ovens, delivery bags and the lunch rush." (oven claim shown as a stand-in)',
    match: /^messages\.about\.stand\.heat\.body$/,
  },
  {
    q: '7',
    kind: 'TEMP',
    where: 'contact page → WhatsApp card',
    value: '"Usually the fastest way to reach us." under the WhatsApp number',
  },
  {
    q: '11',
    kind: 'TEMP',
    where: 'messages → home.why.delivered.body',
    value: '"Delivery across the UAE."',
    match: /^messages\.home\.why\.delivered\.body$/,
  },
  {
    q: '12',
    kind: 'TEMP',
    where: 'messages → home.why.bulk.body',
    value: '"Small and bulk orders welcome. Your quote confirms the details."',
    match: /^messages\.home\.why\.bulk\.body$/,
  },
  {
    q: '13',
    kind: 'LIKELY',
    where: 'src/data/segments.ts → distributors',
    value: 'Shown: "Distributors and supermarkets" sticker and wholesale card.',
    match: /^segments\.distributors$/,
  },
  {
    q: '14',
    kind: 'LIKELY',
    where: 'src/data/segments.ts → home',
    value: 'Shown: "Home kitchens" sticker.',
    match: /^segments\.home$/,
  },

  // C. Products
  {
    q: '15',
    kind: 'TEMP',
    where:
      'src/data/products.ts → specs (capacity, sizes, depth, lid material, thickness, pack counts, oven, freezer)',
    value:
      'Unknown: hidden behind the "More specs on request" row with the WhatsApp "Ask about {code}" button.',
  },
  {
    q: '15',
    kind: 'TEMP',
    where: 'src/data/products.ts → specs.microwaveSafe (containers and platters)',
    value: 'Microwave: "Not recommended".',
    match: /^products\.[^.]+\.specs\.microwaveSafe$/,
  },
  {
    q: '16',
    kind: 'LIKELY',
    where: 'src/data/products.ts → specs.compartments (11 single containers)',
    value: '1 compartment.',
    match: /^products\.[^.]+\.specs\.compartments$/,
  },
  {
    q: '17',
    kind: 'TEMP',
    where: 'src/data/products.ts → 83120, 83185, 83241 descriptions',
    value: 'Size words "larger-format", "high-capacity", "large" removed.',
  },
  {
    q: '18',
    kind: 'TEMP',
    where: 'src/data/products.ts → 83166',
    value: '"Favourite format" sentence removed.',
  },
  {
    q: '19',
    kind: 'TEMP',
    where: 'src/data/products.ts → c-73365 description and tagline',
    value:
      '"…built for catering kitchens and big-batch orders." No "73 series"; tagline now "Built for big batches. Unbothered by them too."',
    match: /^products\.c-73365\.placeholder$/,
  },
  {
    q: '20',
    kind: 'TEMP',
    where: 'src/data/products.ts → c-83120e description',
    value: '"Model 83120E (also listed as 1120) is a variant of our 83120…"',
    match: /^products\.c-83120e\.placeholder$/,
  },
  {
    q: '21a',
    kind: 'TEMP',
    where: 'src/data/products.ts → platter specs',
    value: 'Shape and size: on request (hidden behind "More specs on request").',
  },
  {
    q: '21b',
    kind: 'TEMP',
    where: 'messages → catalogue.platters.lidsTemp; src/data/faq.ts → platter-lids',
    value: '"Ask us about matching lids."',
    match: /^(messages\.catalogue\.platters\.lidsTemp|faq\.platter-lids)$/,
  },
  {
    q: '22',
    kind: 'LIKELY',
    where: 'src/data/products.ts → f-promo-cf name and description',
    value: '"Promo Pack – Foil 45 cm × 37.5 sq ft + Cling Film 30 cm × 100 sq ft"',
    match: /^products\.f-promo-cf\.placeholder$/,
  },
  {
    q: '23',
    kind: 'LIKELY',
    where: 'src/data/products.ts → catering rolls specs.rollLengths',
    value: 'Two lengths, 150 m and 300 m, with the length selector.',
    match: /^products\.f-(30|45)-cat\.specs\.rollLengths$/,
  },
  {
    q: '24',
    kind: 'LIKELY',
    where: 'src/data/products.ts → f-30-75',
    value: 'Two old listings merged: one product, second image labelled "alternate pack".',
    match: /^products\.f-30-75\.placeholder$/,
  },
  {
    q: '25',
    kind: 'TEMP',
    where: 'src/data/products.ts → goodFor (all products)',
    value: 'All suggested "Good for" tags kept.',
  },

  // D. FAQ answers
  {
    q: '26',
    kind: 'TEMP',
    where: 'src/data/faq.ts → oven',
    value: '"…can generally go in a conventional oven… Ask us about a specific model." No temperature.',
    match: /^faq\.oven$/,
  },
  {
    q: '27',
    kind: 'TEMP',
    where: 'src/data/faq.ts → freeze',
    value: '"Yes, aluminium containers are commonly used for freezing…"',
    match: /^faq\.freeze$/,
  },
  {
    q: '28',
    kind: 'TEMP',
    where: 'src/data/faq.ts → microwave',
    value: '"We don’t recommend putting aluminium in a microwave…"',
    match: /^faq\.microwave$/,
  },
  {
    q: '29',
    kind: 'TEMP',
    where: 'src/data/faq.ts → food-safe',
    value: '"…made for food packaging. Ask us if you need compliance documents…" No certificates named.',
    match: /^faq\.food-safe$/,
  },
  {
    q: '30',
    kind: 'TEMP',
    where: 'src/data/faq.ts → custom-lids',
    value: '"Ask us about custom or printed packaging for larger orders."',
    match: /^faq\.custom-lids$/,
  },
  { q: '31', kind: 'TEMP', where: 'src/data/faq.ts → moq', value: 'Same as #12.', match: /^faq\.moq$/ },
  {
    q: '32',
    kind: 'TEMP',
    where: 'src/data/faq.ts → delivery',
    value: '"We deliver across the UAE. Lead times are confirmed with your quote."',
    match: /^faq\.delivery$/,
  },
  {
    q: '33',
    kind: 'TEMP',
    where: 'src/data/faq.ts → export',
    value: '"Outside the UAE? Send us your location…"',
    match: /^faq\.export$/,
  },
  {
    q: '34',
    kind: 'TEMP',
    where: 'src/data/faq.ts → samples',
    value: '"Ask us about samples when you request a quote."',
    match: /^faq\.samples$/,
  },
  {
    q: '35',
    kind: 'LIKELY',
    where: 'src/data/faq.ts → households',
    value: '"Yes. Message us on WhatsApp with what you need."',
    match: /^faq\.households$/,
  },

  // E. Wholesale and About
  {
    q: '36a',
    kind: 'TEMP',
    where: 'messages → wholesale.sub',
    value: '"…across the UAE." (no GCC)',
    match: /^messages\.wholesale\.sub$/,
  },
  {
    q: '36b',
    kind: 'TEMP',
    where: 'messages → wholesale.steps.4.body',
    value: 'Same as #32.',
    match: /^messages\.wholesale\.steps\.4\.body$/,
  },
  {
    q: '36c',
    kind: 'TEMP',
    where: 'messages → wholesale.steps.3.body',
    value: '"Payment terms are confirmed with your quote." "Terms at a glance" stays hidden.',
  },
  {
    q: '37a',
    kind: 'TEMP',
    where: 'src/app/[locale]/about/page.tsx',
    value: 'No factory photo: press-machine illustration.',
  },
  { q: '37b', kind: 'TEMP', where: 'messages → about.steps.1–6', value: 'All six process steps as written.' },
  {
    q: '37c',
    kind: 'TEMP',
    where: 'src/app/[locale]/about/page.tsx → numbers',
    value: 'Only 1997, 26 products, 3 families. Capacity, team, countries and customers hidden.',
  },
  { q: '37d', kind: 'TEMP', where: 'About page', value: 'No trade licence number.' },

  // F. Sections off
  {
    q: '38–44',
    kind: 'TEMP',
    where: 'src/data/site.ts → flags',
    value:
      'Off: "Seen in the wild", private label, spec sheets, certificates, factory gallery, sustainability actions, wholesale terms.',
  },
  {
    q: '45',
    kind: 'TEMP',
    where: 'Catalogue; messages → about.story1',
    value:
      'Aluminium-only catalogue; About keeps "making and distributing disposable packaging for the food business".',
  },

  // G. Reviews
  {
    q: '46',
    kind: 'TEMP',
    where: 'All Arabic copy (arReviewed: false)',
    value: 'No reviewer yet: "AR draft" badges stay in review mode.',
  },
  {
    q: '47',
    kind: 'TEMP',
    where: 'src/content/legal.ts',
    value: 'No reviewer yet: "Draft. Needs legal review before launch." banner stays in review mode.',
  },
];
