import type { Fact, L10n, PendingCopy, Product, ProductImage, ProductSpecs, UseCase } from './types';
import { generatedImages } from './images.generated';
import { cutouts } from './cutouts.generated';

/**
 * The complete Silverpot catalogue (§9.4). 26 products.
 * Only the model codes, names, families, compartments (8576), lid ("with Lid") and
 * roll widths/lengths (from names) are verified. Everything else is null/unconfirmed.
 * Arabic text is a machine-quality draft (arReviewed: false) pending native review.
 */

const BASE = 'https://silverpot.org/wp-content/uploads/2022/02/';

const unknown = <T>(note?: string): Fact<T> => ({ value: null, confirmed: false, ...(note ? { note } : {}) });
const confirmed = <T>(value: T): Fact<T> => ({ value, confirmed: true });
/** LIKELY/TEMP stand-in that renders until the client answers question `clientQ` (docs/PLACEHOLDERS.md). */
const placeholder = <T>(value: T, q: number, note: string): Fact<T> => ({
  value,
  confirmed: false,
  placeholder: true,
  clientQ: q,
  note,
});
const ar = (text: string): string => text;
const l = (en: string, arText: string | null): L10n => ({ en, ar: arText, arReviewed: false });

function specs(over: Partial<ProductSpecs> = {}): ProductSpecs {
  return {
    material: confirmed('Aluminium' as const),
    compartments: unknown(),
    lidIncluded: unknown(),
    lidMaterial: unknown('Lid material'),
    capacityMl: unknown('Capacity (ml)'),
    topDimensionsMm: unknown('Top dimensions (mm)'),
    depthMm: unknown('Depth (mm)'),
    rollWidthCm: unknown(),
    rollLengths: unknown(),
    thicknessMicron: unknown('Thickness (micron)'),
    piecesPerPack: unknown('Pieces per pack'),
    packsPerCarton: unknown('Packs per carton'),
    piecesPerCarton: unknown('Pieces per carton'),
    ovenSafe: unknown('Oven guidance'),
    freezerSafe: unknown('Freezer guidance'),
    microwaveSafe: unknown('Microwave guidance'),
    ...over,
  };
}

type GenImage = { width: number; height: number; needsReshoot: boolean; blurDataURL?: string; url?: string };
const gen: Record<string, GenImage> = generatedImages;

function images(slug: string, name: L10n, files: string[][]): ProductImage[] {
  return files.map((candidates, i) => {
    const n = i + 1;
    const original = `/images/products/${slug}-${n}.jpg`;
    const cut = cutouts[original];
    const suffixEn = i === 0 ? '' : ' – alternate pack';
    const suffixAr = i === 0 ? '' : ' – عبوة بديلة';
    const meta = gen[original];
    return {
      src: cut?.src ?? original,
      original,
      alt: {
        en: `${name.en} by Silverpot – product photo${suffixEn}`,
        ar: name.ar ? `${name.ar} من سيلفربوت – صورة المنتج${suffixAr}` : null,
        arReviewed: false,
      },
      legacyThumb: `${BASE}${candidates[candidates.length - 1]}-300x300.jpg`,
      legacyCandidates: candidates.map((f) => `${BASE}${f}`),
      ...(meta
        ? {
            width: meta.width,
            height: meta.height,
            needsReshoot: meta.needsReshoot,
            blurDataURL: cut?.blurDataURL ?? meta.blurDataURL,
          }
        : {}),
    };
  });
}

/* ─────────── CONTAINERS (13) ─────────── */

const SINGLE_GOOD_FOR: UseCase[] = [
  'rice-biryani',
  'curries-gravies',
  'home-leftovers',
  'freezing-meal-prep',
];
const LARGE_GOOD_FOR: UseCase[] = [...SINGLE_GOOD_FOR, 'catering-buffet'];
const CONTAINER_PAIRS = ['f-30-75', 'f-45-37'];

const containerShort = l('Aluminium Container with Lid', 'علبة ألمنيوم بغطاء');

function container(p: {
  id: string;
  code: string;
  sortKey: number;
  slug: string;
  file: string;
  legacy: string;
  tagline: L10n;
  description: L10n;
  featured?: boolean;
  goodFor?: UseCase[];
  name?: L10n;
  shortName?: L10n;
  subtype?: Product['subtype'];
  compartments?: Fact<1 | 2 | 3>;
  sizeWord?: PendingCopy;
  extra?: Partial<Product>;
}): Product {
  const name = p.name ?? l(`Aluminium Container with Lid – ${p.code}`, `علبة ألمنيوم بغطاء – ${p.code}`);
  return {
    id: p.id,
    modelCode: p.code,
    sku: p.code,
    slug: p.slug,
    category: 'containers',
    subtype: p.subtype ?? 'single',
    name,
    shortName: p.shortName ?? containerShort,
    tagline: p.tagline,
    description: p.description,
    goodFor: p.goodFor ?? SINGLE_GOOD_FOR,
    specs: specs({
      lidIncluded: confirmed(true),
      compartments: p.compartments ?? placeholder(1 as const, 16, 'Single compartment (likely)'),
      microwaveSafe: placeholder(false, 15, 'Microwave: not recommended'),
    }),
    images: images(p.slug, name, [[p.file]]),
    pairsWith: CONTAINER_PAIRS,
    sizeWord: p.sizeWord,
    featured: p.featured,
    sortKey: p.sortKey,
    legacySlugs: [p.legacy],
    ...p.extra,
  };
}

const containers: Product[] = [
  container({
    id: 'c-8325',
    code: '8325',
    sortKey: 10,
    slug: '8325-aluminium-container-with-lid',
    file: 'IMG_5054-1',
    legacy: 'aluminum-container-with-lid-8325',
    featured: true,
    tagline: l(
      'First on the list. Never last on the counter.',
      'الأولى في القائمة. ولا تتأخر أبداً على الكاونتر.',
    ),
    description: l(
      'Model 8325 is a single-compartment aluminium container supplied with a matching lid. It’s a dependable pick for takeaway counters and delivery menus. Pressed in our Ajman facility and packed in cartons, ready for busy service.',
      ar(
        'الموديل 8325 علبة ألمنيوم بقسم واحد تأتي مع غطاء مطابق. خيار موثوق لطلبات الاستلام وقوائم التوصيل. تُصنع في منشأتنا في عجمان وتُعبّأ في كراتين، جاهزة لأوقات الذروة.',
      ),
    ),
  }),
  container({
    id: 'c-8342',
    code: '8342',
    sortKey: 20,
    slug: '8342-aluminium-container-with-lid',
    file: 'IMG_5059-1',
    legacy: 'aluminum-container-with-lid-8342',
    featured: true,
    tagline: l('The everyday hero of the takeaway counter.', 'بطلة الطلبات الخارجية كل يوم.'),
    description: l(
      'Model 8342 is an everyday aluminium container with lid, made for the dishes that leave your kitchen most often. Order it by the carton alongside the rest of the 83 series.',
      ar(
        'الموديل 8342 علبة ألمنيوم بغطاء للاستخدام اليومي، مصنوعة للأطباق التي تخرج من مطبخك أكثر من غيرها. اطلبها بالكرتون مع بقية سلسلة 83.',
      ),
    ),
  }),
  container({
    id: 'c-8357',
    code: '8357',
    sortKey: 30,
    slug: '8357-aluminium-container-with-lid',
    file: 'IMG_5096-2',
    legacy: 'aluminum-container-with-lid-8357',
    tagline: l(
      'Holds the heat. Holds its shape. Holds no grudges.',
      'تحفظ الحرارة. تحافظ على شكلها. ولا تحمل ضغينة.',
    ),
    description: l(
      'Model 8357 is an aluminium container with lid from our 83 series, for kitchens that need a reliable, consistent size order after order.',
      ar(
        'الموديل 8357 علبة ألمنيوم بغطاء من سلسلة 83، للمطابخ التي تحتاج مقاساً ثابتاً وموثوقاً طلباً بعد طلب.',
      ),
    ),
  }),
  container({
    id: 'c-8367',
    code: '8367',
    sortKey: 40,
    slug: '8367-aluminium-container-with-lid',
    file: 'IMG_5064-1',
    legacy: 'aluminum-container-with-lid-8367',
    tagline: l('Built for the dish everyone fights over.', 'مصنوعة للطبق الذي يتنافس عليه الجميع.'),
    description: l(
      'Model 8367 is a lidded aluminium container for hot meals, sides and family orders. Pressed in Ajman and supplied by the carton.',
      ar(
        'الموديل 8367 علبة ألمنيوم بغطاء للوجبات الساخنة والأطباق الجانبية وطلبات العائلة. تُصنع في عجمان وتُورَّد بالكرتون.',
      ),
    ),
  }),
  container({
    id: 'c-8389',
    code: '8389',
    sortKey: 50,
    slug: '8389-aluminium-container-with-lid',
    file: 'IMG_5068-1',
    legacy: 'aluminum-container-with-lid-8389',
    tagline: l('For portions that refuse to be modest.', 'لحصص ترفض أن تكون متواضعة.'),
    description: l(
      'Model 8389 is an aluminium container with a matching lid, made for generous takeaway portions and catering orders.',
      ar('الموديل 8389 علبة ألمنيوم مع غطاء مطابق، مصنوعة للحصص السخية وطلبات الضيافة.'),
    ),
  }),
  container({
    id: 'c-83120',
    code: '83120',
    sortKey: 60,
    slug: '83120-aluminium-container-with-lid',
    file: 'IMG_5073-1',
    legacy: 'aluminum-container-with-lid-83120',
    goodFor: LARGE_GOOD_FOR,
    tagline: l('Feeds the table, not the landfill.', 'تُطعم المائدة، لا مكبّ النفايات.'),
    description: l(
      'Model 83120 is an aluminium container with lid for sharing portions, catering and meal prep. Like all our aluminium, it can be recycled again and again.',
      ar(
        'الموديل 83120 علبة ألمنيوم بغطاء للحصص المشتركة والضيافة وتحضير الوجبات. ومثل كل منتجاتنا من الألمنيوم، يمكن إعادة تدويرها مرة بعد مرة.',
      ),
    ),
    extra: { siblings: ['c-83120e'], siblingLabel: l('83120', '83120') },
  }),
  container({
    id: 'c-83120e',
    code: '83120E',
    sortKey: 61,
    slug: '83120e-aluminium-container-with-lid',
    file: 'IMG_5080-1',
    legacy: 'aluminum-container-with-lid-83120e-1120',
    name: l('Aluminium Container with Lid – 83120E (1120)', 'علبة ألمنيوم بغطاء – 83120E (1120)'),
    tagline: l('Same family as 83120. Different personality.', 'من عائلة 83120. بشخصية مختلفة.'),
    description: l(
      'Model 83120E (also listed as 1120) is a variant of our 83120 aluminium container with lid. Ask us which one suits your menu best.',
      ar(
        'الموديل 83120E (ويُعرف أيضاً بـ 1120) نسخة من علبة الألمنيوم 83120 بغطاء. اسألنا أيهما يناسب قائمتك أكثر.',
      ),
    ),
    extra: {
      aliases: ['1120'],
      siblings: ['c-83120'],
      siblingLabel: l('83120E', '83120E'),
      seoTitle: '83120E Aluminium Container with Lid | Silverpot',
      placeholder: { clientQ: 20, note: 'Difference from 83120', fields: ['description'] },
      notes: 'Difference from 83120 unknown [CONFIRM]',
    },
  }),
  container({
    id: 'c-83166',
    code: '83166',
    sortKey: 70,
    slug: '83166-broast-aluminium-container-with-lid',
    file: 'IMG_5119-1',
    legacy: 'aluminum-container-with-lid-83166-broast',
    featured: true,
    subtype: 'specialty',
    name: l('Aluminium Broast Container with Lid – 83166', 'علبة ألمنيوم للبروستد بغطاء – 83166'),
    shortName: l('Aluminium Broast Container with Lid', 'علبة ألمنيوم للبروستد بغطاء'),
    goodFor: ['broast-fried', 'grills-bbq'],
    tagline: l('Made for broast. Mildly obsessed with crunch.', 'مصنوعة للبروستد. ومهووسة قليلاً بالقرمشة.'),
    description: l(
      'Model 83166 is an aluminium container with lid shaped for broast and fried chicken orders.',
      ar('الموديل 83166 علبة ألمنيوم بغطاء بشكل مخصص لطلبات البروستد والدجاج المقلي.'),
    ),
    extra: {
      seoTitle: '83166 Broast Aluminium Container with Lid | Silverpot',
      notes: 'The old name said "(Broast)".',
    },
  }),
  container({
    id: 'c-83185',
    code: '83185',
    sortKey: 80,
    slug: '83185-aluminium-container-with-lid',
    file: 'IMG_5085-1',
    legacy: 'aluminum-container-with-lid-83185',
    goodFor: LARGE_GOOD_FOR,
    tagline: l('When “just a little more” becomes the whole order.', 'عندما يصبح «القليل بعد» هو الطلب كله.'),
    description: l(
      'Model 83185 is an aluminium container with lid for family meals, rice dishes and catering portions.',
      ar('الموديل 83185 علبة ألمنيوم بغطاء لوجبات العائلة وأطباق الرز وحصص الضيافة.'),
    ),
  }),
  container({
    id: 'c-83241',
    code: '83241',
    sortKey: 90,
    slug: '83241-aluminium-container-with-lid',
    file: 'IMG_5113-1',
    legacy: 'aluminum-container-with-lid-83241',
    goodFor: LARGE_GOOD_FOR,
    tagline: l('Not scared of second helpings.', 'لا تخاف من الصحن الثاني.'),
    description: l(
      'Model 83241 is an aluminium container with lid for sharing dishes, buffets and bulk meal prep.',
      ar('الموديل 83241 علبة ألمنيوم بغطاء للأطباق المشتركة والبوفيهات وتحضير الوجبات بالجملة.'),
    ),
  }),
  container({
    id: 'c-73365',
    code: '73365',
    sortKey: 100,
    slug: '73365-aluminium-container-with-lid',
    file: 'IMG_5091-2',
    legacy: 'aluminum-container-with-lid-73365',
    goodFor: LARGE_GOOD_FOR,
    tagline: l('Built for big batches. Unbothered by them too.', 'مصنوعة للكميات الكبيرة. ولا تنزعج منها.'),
    description: l(
      'Model 73365 is an aluminium container with lid, built for catering kitchens and big-batch orders.',
      ar('الموديل 73365 علبة ألمنيوم بغطاء، مصنوعة لمطابخ الضيافة والطلبات الكبيرة.'),
    ),
    extra: {
      placeholder: {
        clientQ: 19,
        note: 'Catering use (no series claim)',
        fields: ['tagline', 'description'],
      },
    },
  }),
  container({
    id: 'c-8576-2',
    code: '8576',
    sortKey: 110,
    slug: '8576-2-compartment-aluminium-container-with-lid',
    file: 'IMG_5107-1',
    legacy: 'aluminum-container-with-lid-8576-2compartment',
    subtype: 'compartment',
    compartments: confirmed(2 as const),
    name: l('2-Compartment Aluminium Container with Lid – 8576', 'علبة ألمنيوم بقسمين وغطاء – 8576'),
    shortName: l('2-Compartment Aluminium Container with Lid', 'علبة ألمنيوم بقسمين وغطاء'),
    goodFor: ['meal-combos', 'rice-biryani', 'curries-gravies', 'salads-cold'],
    tagline: l('Two rooms. Zero roommate drama.', 'غرفتان. بلا مشاكل بين الجيران.'),
    description: l(
      'The 8576 two-compartment aluminium container keeps a main and a side apart until they reach the table. It’s supplied with a matching lid.',
      ar(
        'علبة الألمنيوم 8576 بقسمين تُبقي الطبق الرئيسي والجانبي منفصلين حتى يصلا إلى المائدة. تأتي مع غطاء مطابق.',
      ),
    ),
    extra: {
      sku: '8576-2C',
      siblings: ['c-8576-3'],
      siblingLabel: l('2 compartments', 'قسمان'),
      seoTitle: '8576 2-Compartment Aluminium Container | Silverpot',
    },
  }),
  container({
    id: 'c-8576-3',
    code: '8576',
    sortKey: 111,
    slug: '8576-3-compartment-aluminium-container-with-lid',
    file: 'IMG_5100-2',
    legacy: 'aluminum-container-with-lid-8576-3compartment',
    subtype: 'compartment',
    featured: true,
    compartments: confirmed(3 as const),
    name: l('3-Compartment Aluminium Container with Lid – 8576', 'علبة ألمنيوم بثلاثة أقسام وغطاء – 8576'),
    shortName: l('3-Compartment Aluminium Container with Lid', 'علبة ألمنيوم بثلاثة أقسام وغطاء'),
    goodFor: ['meal-combos', 'rice-biryani', 'curries-gravies', 'salads-cold'],
    tagline: l(
      'Rice here. Curry there. Salad minding its own business.',
      'الرز هنا. الكاري هناك. والسلطة في حالها.',
    ),
    description: l(
      'The 8576 three-compartment aluminium container is built for complete meals (main, rice and side) in one tray, with a matching lid.',
      ar(
        'علبة الألمنيوم 8576 بثلاثة أقسام مصممة لوجبة كاملة (طبق رئيسي ورز وطبق جانبي) في صينية واحدة، مع غطاء مطابق.',
      ),
    ),
    extra: {
      sku: '8576-3C',
      siblings: ['c-8576-2'],
      siblingLabel: l('3 compartments', 'ثلاثة أقسام'),
      seoTitle: '8576 3-Compartment Aluminium Container | Silverpot',
    },
  }),
];

/* ─────────── PLATTERS (4) ─────────── */

function platter(p: {
  id: string;
  code: string;
  sortKey: number;
  file: string;
  featured?: boolean;
  tagline: L10n;
}): Product {
  const slug = `${p.code}-aluminium-platter`;
  const name = l(`Aluminium Platter – ${p.code}`, `صينية ألمنيوم – ${p.code}`);
  return {
    id: p.id,
    modelCode: p.code,
    sku: p.code,
    slug,
    category: 'platters',
    subtype: 'platter',
    name,
    shortName: l('Aluminium Platter', 'صينية ألمنيوم'),
    tagline: p.tagline,
    description: l(
      `Model ${p.code} is an aluminium platter for catering trays, buffet lines and family-style serving. Pressed in Ajman and supplied by the carton. Ask us about matching lids and mixed cartons.`,
      `الموديل ${p.code} صينية ألمنيوم لصواني الضيافة وخطوط البوفيه والتقديم العائلي. تُصنع في عجمان وتُورَّد بالكرتون. اسألنا عن الأغطية المطابقة والكراتين المشكّلة.`,
    ),
    goodFor: ['catering-buffet', 'grills-bbq', 'rice-biryani', 'desserts-kunafa'],
    specs: specs({
      lidIncluded: unknown('Lid options'),
      microwaveSafe: placeholder(false, 15, 'Microwave: not recommended'),
    }),
    images: images(slug, name, [[p.file]]),
    pairsWith: ['f-45-37', 'f-45-cat'],
    featured: p.featured,
    sortKey: p.sortKey,
    legacySlugs: [`aluminum-platter-${p.code}`],
    notes: 'Lid, shape and size are all [CONFIRM]',
  };
}

const platters: Product[] = [
  platter({
    id: 'p-6550',
    code: '6550',
    sortKey: 210,
    file: 'IMG_5127-1',
    tagline: l('Platter, please. The table is waiting.', 'الصينية من فضلك. المائدة تنتظر.'),
  }),
  platter({
    id: 'p-6586',
    code: '6586',
    sortKey: 220,
    file: 'IMG_5133-1',
    featured: true,
    tagline: l('Built for the big reveal.', 'مصنوعة للحظة الكشف الكبيرة.'),
  }),
  platter({
    id: 'p-65180',
    code: '65180',
    sortKey: 230,
    file: 'IMG_5138-1',
    tagline: l('Shows up to every majlis.', 'حاضرة في كل مجلس.'),
  }),
  platter({
    id: 'p-65220',
    code: '65220',
    sortKey: 240,
    file: 'IMG_5144-1',
    tagline: l('For the main event.', 'للمناسبة الكبرى.'),
  }),
];

/* ─────────── FOIL (9) ─────────── */

const HOUSEHOLD_GOOD_FOR: UseCase[] = [
  'wrapping-covering',
  'baking-roasting',
  'grills-bbq',
  'home-leftovers',
];
const CATERING_GOOD_FOR: UseCase[] = [
  'wrapping-covering',
  'catering-buffet',
  'baking-roasting',
  'grills-bbq',
];

function fmtLen(n: number) {
  return Number.isInteger(n) ? String(n) : String(n);
}

function householdRoll(p: {
  id: string;
  width: 30 | 45;
  length: number;
  sortKey: number;
  slug: string;
  files: string[][];
  legacy: string[];
  featured?: boolean;
  tagline: L10n;
  extra: L10n;
  placeholder?: Product['placeholder'];
}): Product {
  const len = fmtLen(p.length);
  const name = l(
    `Aluminium Foil Roll – ${p.width} cm × ${len} sq ft`,
    `رول ورق ألمنيوم – ${p.width} سم × ${len} قدم مربع`,
  );
  return {
    id: p.id,
    modelCode: null,
    sku: p.id.replace(/^f-/, 'FOIL-').toUpperCase(),
    slug: p.slug,
    category: 'foil',
    subtype: 'household-roll',
    name,
    shortName: l(
      `Aluminium Foil Roll ${p.width} cm × ${len} sq ft`,
      `رول ورق ألمنيوم ${p.width} سم × ${len} قدم مربع`,
    ),
    tagline: p.tagline,
    description: l(
      `A ${p.width} cm wide aluminium foil roll with ${len} sq ft of wrap, made for everyday cooking, baking, grilling and covering leftovers. ${p.extra.en}`,
      `رول ورق ألمنيوم بعرض ${p.width} سم وطول ${len} قدم مربع، مصنوع للطبخ اليومي والخَبز والشوي وتغطية بقايا الطعام. ${p.extra.ar}`,
    ),
    goodFor: HOUSEHOLD_GOOD_FOR,
    specs: specs({
      rollWidthCm: confirmed(p.width),
      rollLengths: confirmed([{ value: p.length, unit: 'sqft' as const }]),
    }),
    images: images(p.slug, name, p.files),
    pairsWith: ['c-8325', 'c-8576-3'],
    placeholder: p.placeholder,
    featured: p.featured,
    sortKey: p.sortKey,
    legacySlugs: p.legacy,
  };
}

function cateringRoll(p: {
  id: string;
  width: 30 | 45;
  sortKey: number;
  files: string[][];
  legacy: string[];
  featured?: boolean;
  tagline: L10n;
  seoTitle: string;
}): Product {
  const slug = `catering-foil-roll-${p.width}cm-150m-300m`;
  const name = l(
    `Catering Foil Roll – ${p.width} cm × 150 m / 300 m`,
    `رول ورق ألمنيوم للمطاعم – ${p.width} سم × 150 م / 300 م`,
  );
  return {
    id: p.id,
    modelCode: null,
    sku: `FOIL-${p.width}-CAT`,
    slug,
    category: 'foil',
    subtype: 'catering-roll',
    name,
    shortName: l(
      `Catering Foil Roll ${p.width} cm × 150 m / 300 m`,
      `رول ورق ألمنيوم للمطاعم ${p.width} سم × 150 م / 300 م`,
    ),
    tagline: p.tagline,
    description: l(
      `A professional ${p.width} cm aluminium foil roll in 150 m or 300 m lengths, for restaurant and catering kitchens that wrap, line and cover all day.`,
      `رول ورق ألمنيوم احترافي بعرض ${p.width} سم بطول 150 م أو 300 م، لمطابخ المطاعم والضيافة التي تلف وتبطّن وتغطي طوال اليوم.`,
    ),
    goodFor: CATERING_GOOD_FOR,
    specs: specs({
      rollWidthCm: confirmed(p.width),
      rollLengths: {
        value: [
          { value: 150, unit: 'm' },
          { value: 300, unit: 'm' },
        ],
        confirmed: false,
        placeholder: true,
        clientQ: 23,
        note: '“150/300 M” read as two roll lengths',
      },
    }),
    images: images(slug, name, p.files),
    pairsWith: ['p-6586', 'c-83185'],
    featured: p.featured,
    sortKey: p.sortKey,
    legacySlugs: p.legacy,
    seoTitle: p.seoTitle,
  };
}

const foil: Product[] = [
  householdRoll({
    id: 'f-30-25',
    width: 30,
    length: 25,
    sortKey: 310,
    slug: 'aluminium-foil-roll-30cm-25-sqft',
    files: [['IMG_5283-2']],
    legacy: ['aluminum-foil-30cm-x-25-sq-ft'],
    tagline: l('The kitchen-drawer classic.', 'الكلاسيكي في درج كل مطبخ.'),
    extra: l('Compact enough for any kitchen drawer.', 'صغير بما يكفي لأي درج في المطبخ.'),
  }),
  householdRoll({
    id: 'f-30-75',
    width: 30,
    length: 75,
    sortKey: 320,
    slug: 'aluminium-foil-roll-30cm-75-sqft',
    files: [['IMG_5275-1'], ['IMG_5280-1']],
    legacy: ['aluminum-foil-30cm-x-75-sq-ft', 'aluminum-foil-30cm-x-75-sq-ft-2'],
    placeholder: { clientQ: 24, note: 'Two old listings merged as two pack designs', fields: ['images'] },
    featured: true,
    tagline: l('Three times the 25. Same trusty 30 cm.', 'ثلاثة أضعاف الـ25. بنفس عرض 30 سم الموثوق.'),
    extra: l(
      'Three times the length of our 25 sq ft roll, at the same width.',
      'ثلاثة أضعاف طول رول الـ25 قدماً مربعاً، بنفس العرض.',
    ),
  }),
  householdRoll({
    id: 'f-30-200',
    width: 30,
    length: 200,
    sortKey: 330,
    slug: 'aluminium-foil-roll-30cm-200-sqft',
    files: [['IMG_5171']],
    legacy: ['aluminum-foil-30cm-x-200-sq-ft'],
    tagline: l('For kitchens that go through foil like it’s free.', 'للمطابخ التي تستهلك الورق وكأنه مجاني.'),
    extra: l(
      'Our longest 30 cm household roll, for busy kitchens.',
      'أطول رول منزلي لدينا بعرض 30 سم، للمطابخ المزدحمة.',
    ),
  }),
  cateringRoll({
    id: 'f-30-cat',
    width: 30,
    sortKey: 340,
    files: [['IMG_5164-2', 'IMG_5164']],
    legacy: ['aluminum-foil-30cm-x-150-300-m', 'aluminum-foil-30cm-x-150-300-m-2'],
    tagline: l('Pro roll. For pros who hate changing rolls.', 'رول المحترفين. لمن يكره تبديل الرولات.'),
    seoTitle: 'Catering Foil Roll 30 cm, 150 m / 300 m | Silverpot',
  }),
  householdRoll({
    id: 'f-45-13',
    width: 45,
    length: 13.5,
    sortKey: 350,
    slug: 'aluminium-foil-roll-45cm-13-5-sqft',
    files: [['IMG_5176-1']],
    legacy: ['aluminum-foil-45cm-x-13-50-sqft'],
    tagline: l('Extra-wide for big-tray days.', 'عرض إضافي لأيام الصواني الكبيرة.'),
    extra: l(
      'Extra width covers large trays in one sheet.',
      'العرض الإضافي يغطي الصواني الكبيرة بورقة واحدة.',
    ),
  }),
  householdRoll({
    id: 'f-45-37',
    width: 45,
    length: 37.5,
    sortKey: 360,
    slug: 'aluminium-foil-roll-45cm-37-5-sqft',
    files: [['IMG_5149-1']],
    legacy: ['aluminum-foil-45cm-x-37-50-sqft'],
    featured: true,
    tagline: l('Wide, long and ready for the oven.', 'عريض وطويل وجاهز للفرن.'),
    extra: l(
      'Wide enough for big oven trays, long enough to last.',
      'عريض بما يكفي لصواني الفرن الكبيرة، وطويل بما يكفي ليدوم.',
    ),
  }),
  cateringRoll({
    id: 'f-45-cat',
    width: 45,
    sortKey: 370,
    files: [], // none on the old site → PhotoComingSoon
    legacy: ['aluminum-foil-45cm-x-150-300-m', 'aluminum-foil-45cm-x-150-300m'],
    featured: true,
    tagline: l('The widest, longest roll on our list.', 'الأعرض والأطول في قائمتنا.'),
    seoTitle: 'Catering Foil Roll 45 cm, 150 m / 300 m | Silverpot',
  }),
  (() => {
    const slug = 'promo-pack-foil-45cm-37-5-sqft-cling-film-30cm-100-sqft';
    const name = l(
      'Promo Pack – Foil 45 cm × 37.5 sq ft + Cling Film 30 cm × 100 sq ft',
      'عرض ترويجي – ورق ألمنيوم 45 سم × 37.5 قدم مربع + نايلون تغليف 30 سم × 100 قدم مربع',
    );
    const p: Product = {
      id: 'f-promo-cf',
      modelCode: null,
      sku: 'PROMO-FOIL45-CF30',
      slug,
      category: 'foil',
      subtype: 'promo-pack',
      name,
      shortName: l(
        'Promo Pack Foil 45 cm × 37.5 sq ft + Cling Film 30 cm × 100 sq ft',
        'عرض ترويجي ورق ألمنيوم 45 سم × 37.5 قدم مربع + نايلون تغليف',
      ),
      tagline: l('Foil and cling film. The power couple.', 'ورق ألمنيوم ونايلون تغليف. ثنائي قوي.'),
      description: l(
        'A promo pack pairing a 45 cm × 37.5 sq ft aluminium foil roll with a 30 cm × 100 sq ft roll of cling film: two kitchen essentials in one pack.',
        'عرض ترويجي يجمع رول ورق ألمنيوم 45 سم × 37.5 قدم مربع مع رول نايلون تغليف 30 سم × 100 قدم مربع: أساسيّان للمطبخ في عبوة واحدة.',
      ),
      placeholder: {
        clientQ: 22,
        note: '“C/F” read as cling film',
        fields: ['name', 'tagline', 'description'],
      },
      goodFor: ['wrapping-covering', 'home-leftovers'],
      specs: specs({
        rollWidthCm: confirmed(45 as const),
        rollLengths: confirmed([{ value: 37.5, unit: 'sqft' as const }]),
      }),
      images: images(slug, name, [['IMG_5236']]),
      pairsWith: ['c-8325', 'c-8576-3'],
      sortKey: 380,
      legacySlugs: ['promo-pack-foil-45x37-50-sqft-c-f-30x100-sqft'],
      seoTitle: 'Promo Pack: Foil 45 cm + Cling Film | Silverpot',
    };
    return p;
  })(),
  (() => {
    const slug = 'promo-pack-foil-45cm-37-5-sqft-3-pack';
    const name = l(
      'Promo Pack – Foil 45 cm × 37.5 sq ft (Pack of 3)',
      'عرض ترويجي – ورق ألمنيوم 45 سم × 37.5 قدم مربع (3 رولات)',
    );
    const p: Product = {
      id: 'f-promo-3',
      modelCode: null,
      sku: 'PROMO-FOIL45-X3',
      slug,
      category: 'foil',
      subtype: 'promo-pack',
      name,
      shortName: l(
        'Promo Pack Foil 45 cm × 37.5 sq ft (Pack of 3)',
        'عرض ترويجي ورق ألمنيوم 45 سم × 37.5 قدم مربع (3 رولات)',
      ),
      tagline: l(
        'Three rolls. One pack. Zero emergency shop runs.',
        'ثلاثة رولات. عبوة واحدة. بلا مشاوير طوارئ للبقالة.',
      ),
      description: l(
        'Three 45 cm × 37.5 sq ft aluminium foil rolls in one promo pack, ready for retail shelves and stock-up shoppers.',
        'ثلاثة رولات ورق ألمنيوم 45 سم × 37.5 قدم مربع في عبوة ترويجية واحدة، جاهزة لرفوف المتاجر ولمن يحب التخزين.',
      ),
      goodFor: ['wrapping-covering', 'home-leftovers'],
      specs: specs({
        rollWidthCm: confirmed(45 as const),
        rollLengths: confirmed([{ value: 37.5, unit: 'sqft' as const }]),
        piecesPerPack: confirmed(3),
      }),
      images: images(slug, name, [['IMG_5285-1']]),
      pairsWith: ['c-8325', 'c-8576-3'],
      sortKey: 390,
      legacySlugs: ['promo-pack-foil-45x37-50-sqft-1x3-packing'],
      seoTitle: 'Promo Pack: 3 × Foil 45 cm × 37.5 sq ft | Silverpot',
    };
    return p;
  })(),
];

export const products: Product[] = [...containers, ...platters, ...foil].sort(
  (a, b) => a.sortKey - b.sortKey,
);

export const productById = new Map(products.map((p) => [p.id, p]));
export const productBySlug = new Map(products.map((p) => [`${p.category}/${p.slug}`, p]));

export function getProduct(category: string, slug: string) {
  return productBySlug.get(`${category}/${slug}`);
}

export function productHref(p: Pick<Product, 'category' | 'slug'>) {
  return `/products/${p.category}/${p.slug}`;
}

export function productsIn(category: Product['category']) {
  return products.filter((p) => p.category === category);
}
