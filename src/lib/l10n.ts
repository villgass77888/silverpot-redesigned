import type { L10n, Locale, PendingCopy, Product } from '@/data/types';
import { REVIEW_MODE, SHOW_UNCONFIRMED } from './review-mode';

/** Resolve an L10n value. Arabic falls back to English when no draft exists. */
export function tx(v: L10n | null | undefined, locale: Locale | string): string {
  if (!v) return '';
  if (locale === 'ar' && v.ar) return v.ar;
  return v.en;
}

/** True when this Arabic string is still a machine draft (shows an "AR draft" badge in review mode). */
export function isArDraft(v: L10n | null | undefined, locale: Locale | string) {
  return REVIEW_MODE && locale === 'ar' && !!v && v.arReviewed === false;
}

function shouldUseFallback(p: Product) {
  return !!p.fallback && !p.fallback.confirmed && !SHOW_UNCONFIRMED;
}

export function productName(p: Product, locale: Locale | string) {
  return tx(shouldUseFallback(p) && p.fallback?.name ? p.fallback.name : p.name, locale);
}
export function productShortName(p: Product, locale: Locale | string) {
  return tx(shouldUseFallback(p) && p.fallback?.shortName ? p.fallback.shortName : p.shortName, locale);
}
export function productTagline(p: Product, locale: Locale | string) {
  return tx(shouldUseFallback(p) && p.fallback?.tagline ? p.fallback.tagline : p.tagline, locale);
}

/** Is the product's display copy an unconfirmed interpretation (for review highlighting)? */
export function productCopyPending(p: Product) {
  return SHOW_UNCONFIRMED && !!p.fallback && !p.fallback.confirmed;
}

/** Review mode only: the note for a field that holds placeholder copy (docs/PLACEHOLDERS.md). */
export function productCopyPlaceholder(p: Product, field: 'name' | 'tagline' | 'description' | 'images') {
  return SHOW_UNCONFIRMED && p.placeholder?.fields.includes(field) ? p.placeholder.note : undefined;
}

/** pending: hidden in production. placeholder: shown, but flagged in review mode. */
export type CopySegment = { text: string; pending?: string; placeholder?: string };

/**
 * Description as segments, so unconfirmed words/sentences can be highlighted in
 * review mode and dropped in production (§9.4 size words, claims).
 */
export function productDescription(p: Product, locale: Locale | string): CopySegment[] {
  if (shouldUseFallback(p) && p.fallback?.description) return [{ text: tx(p.fallback.description, locale) }];
  const raw = tx(p.description, locale);
  const segs: CopySegment[] = [];
  const sw = p.sizeWord;
  if (raw.includes('{{sizeWord}}')) {
    const [before, after] = raw.split('{{sizeWord}}');
    segs.push({ text: before });
    pushPending(segs, sw, locale);
    segs.push({ text: after });
  } else {
    segs.push({ text: raw });
  }
  for (const claim of p.pendingClaims ?? []) pushPending(segs, claim, locale);
  if (p.fallback && !p.fallback.confirmed && SHOW_UNCONFIRMED) {
    // In review mode, mark the whole proposed description as pending.
    return segs.map((s) => (s.pending ? s : { text: s.text, pending: p.fallback!.note }));
  }
  const temp = productCopyPlaceholder(p, 'description');
  if (temp) return segs.map((s) => (s.pending ? s : { text: s.text, placeholder: temp }));
  return segs;
}

function pushPending(segs: CopySegment[], copy: PendingCopy | undefined, locale: Locale | string) {
  if (!copy) return;
  if (copy.confirmed) segs.push({ text: tx(copy.text, locale) });
  else if (SHOW_UNCONFIRMED) segs.push({ text: tx(copy.text, locale), pending: copy.note });
}

export function plainDescription(p: Product, locale: Locale | string) {
  return productDescription(p, locale)
    .filter((s) => !s.pending)
    .map((s) => s.text)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}
