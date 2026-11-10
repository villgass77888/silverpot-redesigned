import type { Category, CategorySlug } from './types';
import { products } from './products';

export const categories: Category[] = [
  {
    slug: 'containers',
    name: { en: 'Aluminium containers with lids', ar: 'علب ألمنيوم بغطاء', arReviewed: false },
    shortName: { en: 'Containers with lids', ar: 'علب ألمنيوم بغطاء', arReviewed: false },
    tone: 'yellow',
    tagline: { en: 'Lids on. Drama off.', ar: 'الغطاء مقفل. والدراما بعيدة.', arReviewed: false },
    heroProductId: 'c-8325',
    countNoun: { en: 'models', ar: 'موديلاً', arReviewed: false },
  },
  {
    slug: 'platters',
    name: { en: 'Aluminium platters', ar: 'صواني ألمنيوم', arReviewed: false },
    shortName: { en: 'Platters', ar: 'صواني ألمنيوم', arReviewed: false },
    tone: 'red',
    tagline: {
      en: 'Made for sharing. Also for not sharing.',
      ar: 'مصنوعة للمشاركة. وأيضاً لعدم المشاركة.',
      arReviewed: false,
    },
    heroProductId: 'p-6586',
    countNoun: { en: 'models', ar: 'موديلات', arReviewed: false },
  },
  {
    slug: 'foil',
    name: { en: 'Aluminium foil rolls and packs', ar: 'رولات ورق الألمنيوم', arReviewed: false },
    shortName: { en: 'Foil rolls and packs', ar: 'رولات ورق الألمنيوم', arReviewed: false },
    tone: 'blue',
    tagline: {
      en: '30 cm or 45 cm. Choose your fighter.',
      ar: '30 سم أو 45 سم. اختر بطلك.',
      arReviewed: false,
    },
    heroProductId: 'f-45-37',
    countNoun: { en: 'products', ar: 'منتجات', arReviewed: false },
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function isCategorySlug(s: string): s is CategorySlug {
  return categoryBySlug.has(s as CategorySlug);
}

export function categoryCount(slug: CategorySlug) {
  return products.filter((p) => p.category === slug).length;
}

export const toneClasses: Record<
  Category['tone'],
  { bg: string; text: string; ctx: string; sticker: string }
> = {
  yellow: { bg: 'bg-yellow', text: 'text-blue', ctx: 'on-yellow', sticker: 'bg-yellow text-blue' },
  red: { bg: 'bg-red', text: 'text-white', ctx: 'on-red', sticker: 'bg-red text-white' },
  blue: { bg: 'bg-blue', text: 'text-white', ctx: 'on-blue', sticker: 'bg-blue text-white' },
};
