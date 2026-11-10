import type { L10n, Product, UseCase } from './types';
import { products } from './products';

export type FinderFood =
  | 'rice-biryani'
  | 'grills-bbq'
  | 'curries-gravies'
  | 'desserts-kunafa'
  | 'salads-cold'
  | 'broast-fried'
  | 'meal-combos'
  | 'wrapping-covering';

export type FinderServings = '1' | '2' | '3-4' | '5-8' | '10-20' | '20+';
export type FinderComp = 'no' | '2' | '3';

export const finderFoods: { id: FinderFood; label: L10n }[] = [
  { id: 'rice-biryani', label: { en: 'Biryani and rice', ar: 'البرياني والرز' } },
  { id: 'grills-bbq', label: { en: 'Grills and BBQ', ar: 'المشاوي' } },
  { id: 'curries-gravies', label: { en: 'Curries and gravies', ar: 'الكاري والمرق' } },
  { id: 'desserts-kunafa', label: { en: 'Kunafa and desserts', ar: 'الكنافة والحلويات' } },
  { id: 'salads-cold', label: { en: 'Salads and cold food', ar: 'السلطات والأطباق الباردة' } },
  { id: 'broast-fried', label: { en: 'Broast and fried chicken', ar: 'البروستد والدجاج المقلي' } },
  { id: 'meal-combos', label: { en: 'Meal combos', ar: 'الوجبات المتكاملة' } },
  { id: 'wrapping-covering', label: { en: 'Wrapping and covering', ar: 'اللف والتغطية' } },
];

export const finderServings: { id: FinderServings; label: string; max: number }[] = [
  { id: '1', label: '1', max: 1 },
  { id: '2', label: '2', max: 2 },
  { id: '3-4', label: '3–4', max: 4 },
  { id: '5-8', label: '5–8', max: 8 },
  { id: '10-20', label: '10–20', max: 20 },
  { id: '20+', label: '20+', max: 30 },
];

export const finderComps: { id: FinderComp; label: L10n }[] = [
  { id: 'no', label: { en: 'No', ar: 'لا' } },
  { id: '2', label: { en: '2 compartments', ar: 'قسمان' } },
  { id: '3', label: { en: '3 compartments', ar: 'ثلاثة أقسام' } },
];

/** Editable default portion sizes in ml (§9.6 rule 7) [CONFIRM with client]. */
export const PORTION_ML: Partial<Record<UseCase, number>> = {
  'rice-biryani': 350,
  'curries-gravies': 250,
  'desserts-kunafa': 150,
  'salads-cold': 200,
  'grills-bbq': 300,
  'home-leftovers': 300,
  'meal-combos': 450,
};

export interface FinderAnswers {
  food?: FinderFood;
  servings?: FinderServings;
  comp?: FinderComp;
}

export interface FinderResult {
  rule: number;
  productIds: string[];
  reason: L10n;
  /** True when the rules can't pick a single size: show the WhatsApp hand-off. */
  needsConfirm: boolean;
}

const servingsMax = (s: FinderServings) => finderServings.find((x) => x.id === s)?.max ?? 1;

export function skipsCompartments(food?: FinderFood) {
  return food === 'wrapping-covering';
}

export function runFinder(a: FinderAnswers, catalogue: Product[] = products): FinderResult {
  const servings = a.servings ? servingsMax(a.servings) : 1;
  const singles = catalogue.filter((p) => p.category === 'containers' && p.subtype === 'single');
  const confirmedCaps = catalogue
    .filter((p) => p.category === 'containers' && p.specs.capacityMl.confirmed && p.specs.capacityMl.value)
    .sort((x, y) => (x.specs.capacityMl.value ?? 0) - (y.specs.capacityMl.value ?? 0));

  // 1–2: compartments decide it.
  if (a.comp === '2')
    return {
      rule: 1,
      productIds: ['c-8576-2'],
      needsConfirm: false,
      reason: {
        en: 'Two compartments keep a main and a side apart.',
        ar: 'قسمان يُبقيان الطبق الرئيسي والجانبي منفصلين.',
      },
    };
  if (a.comp === '3')
    return {
      rule: 2,
      productIds: ['c-8576-3'],
      needsConfirm: false,
      reason: {
        en: 'Three compartments fit a full meal in one tray.',
        ar: 'ثلاثة أقسام تتسع لوجبة كاملة في صينية واحدة.',
      },
    };
  // 3: broast.
  if (a.food === 'broast-fried')
    return {
      rule: 3,
      productIds: ['c-83166'],
      needsConfirm: false,
      reason: { en: 'Shaped for broast and fried chicken.', ar: 'بشكل مخصص للبروستد والدجاج المقلي.' },
    };
  // 4–5: wrapping.
  if (a.food === 'wrapping-covering' && servings <= 8)
    return {
      rule: 4,
      productIds: ['f-30-75', 'f-45-37'],
      needsConfirm: false,
      reason: { en: 'Household rolls for everyday wrapping.', ar: 'رولات منزلية للف اليومي.' },
    };
  if (a.food === 'wrapping-covering')
    return {
      rule: 5,
      productIds: ['f-30-cat', 'f-45-cat'],
      needsConfirm: false,
      reason: {
        en: 'Catering rolls for kitchens that wrap all day.',
        ar: 'رولات المطاعم للمطابخ التي تلف طوال اليوم.',
      },
    };
  // 6: sharing / buffet service.
  if (servings >= 10) {
    const platterIds = catalogue.filter((p) => p.category === 'platters').map((p) => p.id);
    const largest = confirmedCaps.length >= 2 ? confirmedCaps.slice(-2).map((p) => p.id) : [];
    return {
      rule: 6,
      productIds: [...platterIds, ...largest],
      needsConfirm: true,
      reason: { en: 'Built for sharing and buffet service.', ar: 'مصنوعة للمشاركة وخدمة البوفيه.' },
    };
  }
  // 7: capacity rule — only once ≥ 8 container capacities are confirmed.
  const portion = a.food ? PORTION_ML[a.food] : undefined;
  if (confirmedCaps.length >= 8 && portion) {
    const needed = servings * portion;
    const idx = confirmedCaps.findIndex((p) => (p.specs.capacityMl.value ?? 0) >= needed);
    if (idx >= 0) {
      const picks = confirmedCaps.slice(idx, idx + 2).map((p) => p.id);
      const foodLabel = finderFoods.find((f) => f.id === a.food)?.label;
      return {
        rule: 7,
        productIds: picks,
        needsConfirm: false,
        reason: {
          en: `Fits about ${servings} portions of ${foodLabel?.en.toLowerCase() ?? 'food'}.`,
          ar: `تتسع لنحو ${servings} حصص من ${foodLabel?.ar ?? 'الطعام'}.`,
        },
      };
    }
  }
  // 8: fallback.
  return {
    rule: 8,
    productIds: singles.map((p) => p.id),
    needsConfirm: true,
    reason: { en: 'We’ll confirm the exact size on WhatsApp.', ar: 'سنؤكد لك المقاس الدقيق عبر واتساب.' },
  };
}
