import { categoryBySlug } from '@/data/categories';
import { productHref, products } from '@/data/products';
import type { CategorySlug, Product, Subtype } from '@/data/types';
import { useCaseLabels } from '@/data/usecases';
import {
  productCopyPending,
  productCopyPlaceholder,
  productName,
  productShortName,
  productTagline,
  tx,
} from './l10n';
import { SHOW_UNCONFIRMED } from './review-mode';

/** A serialisable, localised slice of a product for client components (cards, search, quote). */
export interface CardProduct {
  id: string;
  code: string | null;
  aliases: string[];
  href: string;
  category: CategorySlug;
  subtype: Subtype;
  familyLabel: string;
  familyShort: string;
  name: string;
  shortName: string;
  tagline: string;
  namePending: boolean;
  /** Review mode: the name is a placeholder (e.g. "Cling Film" for "C/F"). */
  namePlaceholder: boolean;
  image: {
    src: string;
    width: number;
    height: number;
    blur?: string;
    alt: string;
    needsReshoot?: boolean;
  } | null;
  /** Value used for filtering (may be a "likely" value). */
  compartments: 1 | 2 | 3 | null;
  /** Shown as a sticker only when confirmed (or in review mode). */
  compartmentSticker: 2 | 3 | null;
  rollWidth: 30 | 45 | null;
  hasLengthChoice: boolean;
  sortKey: number;
  featured: boolean;
  goodFor: string[];
}

const FAMILY_SHORT: Record<CategorySlug, { en: string; ar: string }> = {
  containers: { en: 'Containers', ar: 'علب' },
  platters: { en: 'Platters', ar: 'صواني' },
  foil: { en: 'Foil', ar: 'ورق ألمنيوم' },
};

export function toCard(p: Product, locale: string): CardProduct {
  const img = p.images[0];
  const comp = p.specs.compartments;
  const showComp =
    comp.value && comp.value > 1 && (comp.confirmed || comp.placeholder || SHOW_UNCONFIRMED)
      ? (comp.value as 2 | 3)
      : null;
  return {
    id: p.id,
    code: p.modelCode,
    aliases: p.aliases ?? [],
    href: productHref(p),
    category: p.category,
    subtype: p.subtype,
    familyLabel: tx(categoryBySlug.get(p.category)!.shortName, locale),
    familyShort: tx(FAMILY_SHORT[p.category], locale),
    name: productName(p, locale),
    shortName: productShortName(p, locale),
    tagline: productTagline(p, locale),
    namePending: productCopyPending(p),
    namePlaceholder: !!productCopyPlaceholder(p, 'name'),
    image: img
      ? {
          src: img.src,
          width: img.width ?? 2000,
          height: img.height ?? 2000,
          blur: img.blurDataURL,
          alt: tx(img.alt, locale),
          needsReshoot: img.needsReshoot,
        }
      : null,
    compartments: comp.value ?? null,
    compartmentSticker: showComp,
    rollWidth: p.specs.rollWidthCm.value ?? null,
    hasLengthChoice: (p.specs.rollLengths.value?.length ?? 0) > 1,
    sortKey: p.sortKey,
    featured: !!p.featured,
    goodFor: p.goodFor.map((g) => tx(useCaseLabels[g], locale)),
  };
}

export function catalogIndex(locale: string): CardProduct[] {
  return products.map((p) => toCard(p, locale));
}
