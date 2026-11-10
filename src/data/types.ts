export type Locale = 'en' | 'ar';
export type L10n = { en: string; ar: string | null; arReviewed?: boolean };
export type CategorySlug = 'containers' | 'platters' | 'foil';
export type Subtype =
  | 'single'
  | 'compartment'
  | 'specialty' // containers
  | 'platter' // platters
  | 'household-roll'
  | 'catering-roll'
  | 'promo-pack'; // foil

export type UseCase =
  | 'rice-biryani'
  | 'grills-bbq'
  | 'curries-gravies'
  | 'desserts-kunafa'
  | 'salads-cold'
  | 'broast-fried'
  | 'meal-combos'
  | 'wrapping-covering'
  | 'baking-roasting'
  | 'catering-buffet'
  | 'home-leftovers'
  | 'freezing-meal-prep';

/**
 * A value plus whether the client has confirmed it. Unconfirmed values are hidden in production,
 * except placeholders: LIKELY/TEMP stand-ins that render until the client answers question `clientQ`
 * of docs/CLIENT_QUESTIONS.md (listed in docs/PLACEHOLDERS.md).
 */
export type Fact<T> = {
  value: T | null;
  confirmed: boolean;
  note?: string;
  placeholder?: boolean;
  clientQ?: number;
};

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
  microwaveSafe: Fact<boolean>;
}

export interface ProductImage {
  /**
   * What the site displays: the transparent cutout from scripts/cutout-images.ts
   * (/images/products/cutout/….webp), falling back to `original` if none exists.
   */
  src: string;
  /** The white-background JPEG from scripts/fetch-images.ts. Used for OG images and JSON-LD. */
  original: string;
  alt: L10n;
  /** verified thumbnail on the old site (always exists) */
  legacyThumb: string;
  /** candidates to try first, largest first */
  legacyCandidates: string[];
  width?: number;
  height?: number;
  needsReshoot?: boolean;
  blurDataURL?: string;
}

/** A sentence or word in product copy that must not reach production until the client confirms it. */
export interface PendingCopy {
  text: L10n;
  confirmed: boolean;
  note: string;
}

export interface Product {
  id: string;
  modelCode: string | null; // display code, e.g. '8325', '83120E'
  sku: string; // internal unique key, e.g. '8576-3C' [CONFIRM real SKUs]
  aliases?: string[]; // other codes buyers may type, e.g. ['1120']
  slug: string;
  category: CategorySlug;
  subtype: Subtype;
  name: L10n;
  /** Short label used in WhatsApp messages and quote lists. */
  shortName: L10n;
  tagline: L10n;
  /** May contain {{sizeWord}} which resolves to "" until `sizeWord.confirmed`. */
  description: L10n;
  sizeWord?: PendingCopy;
  /** Unconfirmed sentences appended to the description (shown highlighted in review mode only). */
  pendingClaims?: PendingCopy[];
  /**
   * Safe copy used in production while an interpretation is unconfirmed
   * (e.g. "C/F" instead of "Cling Film"). Review mode shows the proposed copy highlighted.
   */
  fallback?: {
    confirmed: boolean;
    note: string;
    name?: L10n;
    shortName?: L10n;
    tagline?: L10n;
    description?: L10n;
  };
  /** Copy that renders now but is a stand-in until the client answers question `clientQ` (docs/PLACEHOLDERS.md). */
  placeholder?: { clientQ: number; note: string; fields: ('name' | 'tagline' | 'description' | 'images')[] };
  goodFor: UseCase[]; // editorial suggestions [CONFIRM]
  specs: ProductSpecs;
  images: ProductImage[]; // [] → PhotoComingSoon
  siblings?: string[]; // product ids
  siblingLabel?: L10n; // label in the sibling segmented control
  pairsWith?: string[]; // product ids
  featured?: boolean; // home "Start with these"
  sortKey: number;
  legacySlugs: string[]; // old ?product= values → 308 redirect here
  seoTitle?: string;
  notes?: string; // internal, never rendered
}

export interface Category {
  slug: CategorySlug;
  name: L10n;
  shortName: L10n;
  tone: 'yellow' | 'red' | 'blue';
  tagline: L10n;
  heroProductId: string;
  countNoun: L10n;
}
