import type Fuse from 'fuse.js';
import type { CardProduct } from './catalog';

/** Fuse.js is loaded on demand (first focus or query), never in first-load JS (§12.1). */
export const loadFuse = () => import('./fuse').then((m) => m.makeFuse);

/** Rank: exact code/alias → prefix → fuzzy (§6.4: digits boost exact and prefix code matches). */
export function searchCatalog(list: CardProduct[], fuse: Fuse<CardProduct> | null, raw: string) {
  const q = raw.trim();
  if (!q) return [];
  const upper = q.toUpperCase().replace(/\s+/g, '');
  const codeLike = /^\d+[A-Z]?$/.test(upper);
  // Until Fuse arrives, a plain substring match keeps results honest.
  const lower = q.toLowerCase();
  const fuzzy = fuse
    ? fuse.search(q).map((r) => r.item)
    : list.filter((p) =>
        [p.name, p.familyLabel, p.tagline, ...p.goodFor].some((s) => s?.toLowerCase().includes(lower)),
      );
  if (!codeLike) return fuzzy;
  const exact = list.filter((p) => p.code?.toUpperCase() === upper || p.aliases.includes(upper));
  const prefix = list.filter(
    (p) =>
      !exact.includes(p) &&
      (p.code?.toUpperCase().startsWith(upper) || p.aliases.some((a) => a.startsWith(upper))),
  );
  const rest = fuzzy.filter((p) => !exact.includes(p) && !prefix.includes(p));
  return [...exact, ...prefix, ...rest];
}
