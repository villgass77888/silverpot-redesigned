import type { L10n, UseCase } from './types';

export const useCaseLabels: Record<UseCase, L10n> = {
  'rice-biryani': { en: 'Biryani and rice', ar: 'البرياني والرز', arReviewed: false },
  'grills-bbq': { en: 'Grills and BBQ', ar: 'المشاوي', arReviewed: false },
  'curries-gravies': { en: 'Curries and gravies', ar: 'الكاري والمرق', arReviewed: false },
  'desserts-kunafa': { en: 'Kunafa and desserts', ar: 'الكنافة والحلويات', arReviewed: false },
  'salads-cold': { en: 'Salads and cold food', ar: 'السلطات والأطباق الباردة', arReviewed: false },
  'broast-fried': { en: 'Broast and fried chicken', ar: 'البروستد والدجاج المقلي', arReviewed: false },
  'meal-combos': { en: 'Meal combos', ar: 'الوجبات المتكاملة', arReviewed: false },
  'wrapping-covering': { en: 'Wrapping and covering', ar: 'اللف والتغطية', arReviewed: false },
  'baking-roasting': { en: 'Baking and roasting', ar: 'الخَبز والتحميص', arReviewed: false },
  'catering-buffet': { en: 'Catering and buffets', ar: 'الضيافة والبوفيهات', arReviewed: false },
  'home-leftovers': { en: 'Leftovers', ar: 'بقايا الطعام', arReviewed: false },
  'freezing-meal-prep': { en: 'Freezing and meal prep', ar: 'التجميد وتحضير الوجبات', arReviewed: false },
};

/** Short chip labels for the home size-finder teaser (§7.1 H7). */
export const teaserFoods: { id: UseCase; label: L10n }[] = [
  { id: 'rice-biryani', label: { en: 'Biryani and rice', ar: 'البرياني والرز' } },
  { id: 'grills-bbq', label: { en: 'Grills', ar: 'المشاوي' } },
  { id: 'curries-gravies', label: { en: 'Curries', ar: 'الكاري' } },
  { id: 'desserts-kunafa', label: { en: 'Kunafa and desserts', ar: 'الكنافة والحلويات' } },
  { id: 'salads-cold', label: { en: 'Salads', ar: 'السلطات' } },
  { id: 'broast-fried', label: { en: 'Broast', ar: 'البروستد' } },
  { id: 'meal-combos', label: { en: 'Meal combos', ar: 'الوجبات المتكاملة' } },
  { id: 'wrapping-covering', label: { en: 'Wrapping', ar: 'اللف' } },
];
