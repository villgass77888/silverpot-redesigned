'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type Fuse from 'fuse.js';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CardProduct } from '@/lib/catalog';
import type { CategorySlug } from '@/data/types';
import { ProductCard } from './ProductCard';
import { Chip } from '../primitives/Chip';
import { Button } from '../primitives/Button';
import { Crinkle } from '../brand/Crinkle';
import { CompIcon } from '../illustrations/objects';
import { IconClose, IconFilter, IconSearch } from '../icons';
import { loadFuse, searchCatalog } from '@/lib/search';
import { useQuoteCount } from '../quote/store';
import { useUI } from '../ui-store';
import { TrayGlyph } from '../layout/QuoteButton';
import { waHref } from '@/lib/whatsapp';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

type Sort = 'code-asc' | 'code-desc' | 'name';
type Filters = {
  q: string;
  family: CategorySlug | 'all';
  comp: '' | '1' | '2' | '3';
  width: '' | '30' | '45';
  type: '' | 'household' | 'catering' | 'promo';
  sort: Sort;
};
const EMPTY: Omit<Filters, 'family'> = { q: '', comp: '', width: '', type: '', sort: 'code-asc' };
const FAMILIES: CategorySlug[] = ['containers', 'platters', 'foil'];
const TYPE_TO_SUBTYPE = {
  household: 'household-roll',
  catering: 'catering-roll',
  promo: 'promo-pack',
} as const;
const GROUP_TONE: Record<CategorySlug, string> = {
  containers: 'bg-yellow text-blue',
  platters: 'bg-red text-white',
  foil: 'bg-blue text-white',
};

function readUrl(fixed?: CategorySlug): Filters {
  const sp = new URLSearchParams(window.location.search);
  const fam = sp.get('family');
  return {
    q: (sp.get('q') ?? '').slice(0, 80),
    family: fixed ?? (FAMILIES.includes(fam as CategorySlug) ? (fam as CategorySlug) : 'all'),
    comp: (['1', '2', '3'].includes(sp.get('comp') ?? '') ? sp.get('comp') : '') as Filters['comp'],
    width: (['30', '45'].includes(sp.get('width') ?? '') ? sp.get('width') : '') as Filters['width'],
    type: (['household', 'catering', 'promo'].includes(sp.get('type') ?? '')
      ? sp.get('type')
      : '') as Filters['type'],
    sort: (['code-desc', 'name'].includes(sp.get('sort') ?? '') ? sp.get('sort') : 'code-asc') as Sort,
  };
}

function writeUrl(f: Filters, fixed: CategorySlug | undefined, push: boolean) {
  const sp = new URLSearchParams();
  if (f.q) sp.set('q', f.q);
  if (!fixed && f.family !== 'all') sp.set('family', f.family);
  if (f.comp) sp.set('comp', f.comp);
  if (f.width) sp.set('width', f.width);
  if (f.type) sp.set('type', f.type);
  if (f.sort !== 'code-asc') sp.set('sort', f.sort);
  const qs = sp.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
  if (url === `${window.location.pathname}${window.location.search}`) return;
  window.history[push ? 'pushState' : 'replaceState'](null, '', url);
}

const FilterSheet = dynamic(() => import('./FilterSheet').then((m) => m.FilterSheet), { ssr: false });

const codeNum = (p: CardProduct) =>
  p.code ? parseInt(p.code, 10) : Number.MAX_SAFE_INTEGER - 1000 + p.sortKey;

/**
 * Catalogue (§7.2, §7.3): live search, URL-synced filters (shareable, back/forward restores),
 * FLIP reorder, live result count, filter bottom sheet + bottom bar on mobile.
 * Server renders the unfiltered grid, so crawlers and no-JS visitors see every product.
 */
export function Catalogue({
  items,
  fixedFamily,
  header,
  headerTone = 'yellow',
}: {
  items: CardProduct[];
  fixedFamily?: CategorySlug;
  header: ReactNode;
  headerTone?: 'yellow' | 'red' | 'blue';
}) {
  const t = useTranslations('catalogue');
  const tc = useTranslations('common');
  const tn = useTranslations('nav');
  const [f, setF] = useState<Filters>({ ...EMPTY, family: fixedFamily ?? 'all' });
  const [sheet, setSheet] = useState(false);
  const [sheetLoaded, setSheetLoaded] = useState(false);
  const [fuse, setFuse] = useState<Fuse<CardProduct> | null>(null);
  // Reorders animate only after the visitor changes something, never on load.
  const [touched, setTouched] = useState(false);
  const qTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wantFuse = useCallback(() => {
    if (!fuse) void loadFuse().then((make) => setFuse(make(items)));
  }, [fuse, items]);
  useEffect(() => {
    if (f.q.trim()) wantFuse();
  }, [f.q, wantFuse]);

  const openSheet = () => {
    setSheetLoaded(true);
    setSheet(true);
  };

  // URL → state on mount and on back/forward.
  useEffect(() => {
    const sync = () => setF(readUrl(fixedFamily));
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [fixedFamily]);

  const update = useCallback(
    (patch: Partial<Filters>, opts: { push?: boolean; event?: [string, string] } = {}) => {
      setTouched(true);
      setF((prev) => {
        const next = { ...prev, ...patch };
        if (patch.family && patch.family !== prev.family) {
          next.comp = '';
          next.width = '';
          next.type = '';
        }
        writeUrl(next, fixedFamily, opts.push ?? true);
        return next;
      });
      if (opts.event) track('filter_change', { filter: opts.event[0], value: opts.event[1] });
    },
    [fixedFamily],
  );

  const onSearch = (q: string) => {
    setTouched(true);
    setF((prev) => ({ ...prev, q }));
    if (qTimer.current) clearTimeout(qTimer.current);
    qTimer.current = setTimeout(() => {
      setF((prev) => {
        writeUrl(prev, fixedFamily, false);
        return prev;
      });
    }, 250);
  };

  const results = useMemo(() => {
    let list = f.q.trim() ? searchCatalog(items, fuse, f.q) : [...items];
    if (f.family !== 'all') list = list.filter((p) => p.category === f.family);
    if (f.family === 'containers' && f.comp)
      list = list.filter((p) => String(p.compartments ?? 1) === f.comp);
    if (f.family === 'foil' && f.width) list = list.filter((p) => String(p.rollWidth) === f.width);
    if (f.family === 'foil' && f.type)
      list = list.filter((p) => p.subtype === TYPE_TO_SUBTYPE[f.type as keyof typeof TYPE_TO_SUBTYPE]);
    if (!f.q.trim() || f.sort !== 'code-asc') {
      if (f.sort === 'code-asc') list.sort((a, b) => codeNum(a) - codeNum(b) || a.sortKey - b.sortKey);
      if (f.sort === 'code-desc') list.sort((a, b) => codeNum(b) - codeNum(a) || b.sortKey - a.sortKey);
      if (f.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [items, fuse, f]);

  const counts = useMemo(() => {
    const base = f.q.trim() ? searchCatalog(items, fuse, f.q) : items;
    return Object.fromEntries(
      FAMILIES.map((fam) => [fam, base.filter((p) => p.category === fam).length]),
    ) as Record<CategorySlug, number>;
  }, [items, fuse, f.q]);

  const active = !!(
    f.q ||
    f.comp ||
    f.width ||
    f.type ||
    f.sort !== 'code-asc' ||
    (!fixedFamily && f.family !== 'all')
  );
  const activeCount = [f.comp, f.width, f.type, !fixedFamily && f.family !== 'all' ? 'x' : ''].filter(
    Boolean,
  ).length;
  const clear = () => {
    update({ ...EMPTY, family: fixedFamily ?? 'all' }, { event: ['clear', 'all'] });
  };
  const grouped = f.family === 'all' && !f.q.trim() && f.sort === 'code-asc';

  const filterControls = (
    <FilterControls f={f} update={update} fixedFamily={fixedFamily} counts={counts} total={items.length} />
  );

  return (
    <>
      {/* Header band with the big search field */}
      <section
        className={cn(
          'grain relative border-b-2 border-blue',
          headerTone === 'yellow'
            ? 'on-yellow bg-yellow text-blue'
            : headerTone === 'red'
              ? 'on-red bg-red text-white'
              : 'on-blue bg-blue text-white',
        )}
      >
        <div className="relative z-[2] shell pt-12 pb-10 md:pt-16 lg:pt-20 lg:pb-14">
          {header}
          <div className="relative mt-8 max-w-3xl text-blue">
            <label htmlFor="catalogue-search" className="sr-only">
              {t('searchLabel')}
            </label>
            <IconSearch size={26} className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2" />
            <input
              id="catalogue-search"
              type="search"
              value={f.q}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={wantFuse}
              placeholder={t('searchPlaceholder')}
              autoComplete="off"
              className="h-16 w-full rounded-[14px] border-[3px] border-blue bg-white ps-14 pe-14 text-lg font-semibold shadow-hard-md outline-none placeholder:text-blue/45 focus-visible:shadow-hard-lg"
            />
            {f.q && (
              <button
                type="button"
                onClick={() => update({ q: '' }, { push: false })}
                className="absolute end-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full hover:bg-foil"
                aria-label={t('clearSearch')}
              >
                <IconClose size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter bar (sticky, desktop inline; mobile → bottom sheet) */}
      <div className="filter-sticky on-light sticky top-[var(--header-h)] z-40 border-b-2 border-blue/15 bg-white/95 backdrop-blur-sm">
        <div className="shell flex min-h-16 items-center gap-3 py-3">
          <div className="hidden flex-1 md:block">{filterControls}</div>
          <button
            type="button"
            onClick={openSheet}
            className="inline-flex min-h-11 press items-center gap-2 rounded-btn border-2 border-blue bg-white px-4 font-bold md:hidden"
          >
            <IconFilter size={18} />
            {activeCount ? t('filtersActive', { count: activeCount }) : t('filters')}
          </button>
          <p className="ms-auto type-small font-semibold whitespace-nowrap md:ms-0" aria-live="polite">
            {t('live', { count: results.length, family: f.family })}
          </p>
        </div>
      </div>

      {/* Grid */}
      <section className="on-light bg-white pt-8 pb-24 text-blue md:pt-10" data-reveal-skip>
        <div className="shell">
          {results.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
              <div className="w-40">
                <Crinkle pose="deadpan" />
              </div>
              <p className="mt-6 type-h3">{t('empty')}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button variant="secondary" onClick={clear}>
                  {t('clear')}
                </Button>
                <Button
                  href={waHref(f.q || undefined)}
                  variant="whatsapp"
                  track="whatsapp_click"
                  trackLocation="catalogue-empty"
                >
                  {tc('askWhatsApp')}
                </Button>
              </div>
            </div>
          ) : grouped ? (
            FAMILIES.filter((fam) => results.some((p) => p.category === fam)).map((fam) => {
              const group = results.filter((p) => p.category === fam);
              return (
                <div key={fam} className="mb-12 last:mb-0">
                  <h2
                    className={cn(
                      'mb-6 flex items-baseline justify-between rounded-[14px] px-5 py-4 type-h3',
                      GROUP_TONE[fam],
                    )}
                  >
                    <Link href={`/products/${fam}`} className="hover:underline">
                      {group[0].familyLabel}
                    </Link>
                    <span className="type-small">
                      {fam === 'foil'
                        ? tc('productsCount', { count: group.length })
                        : tc('modelsCount', { count: group.length })}
                    </span>
                  </h2>
                  <Grid items={group} animate={touched} />
                </div>
              );
            })
          ) : (
            <>
              {/* Cards use h3; ungrouped lists still need an h2 above them. */}
              <h2 className="sr-only">{tn('products')}</h2>
              <Grid items={results} animate={touched} />
            </>
          )}
          {active && results.length > 0 && (
            <div className="mt-10 hidden md:block">
              <Button variant="ghost" onClick={clear}>
                {t('clear')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Mobile filter sheet */}
      {sheetLoaded && (
        <FilterSheet open={sheet} onOpenChange={setSheet} onClear={clear} resultCount={results.length}>
          {filterControls}
        </FilterSheet>
      )}

      <CatalogueBottomBar
        onFilters={openSheet}
        label={activeCount ? t('filtersActive', { count: activeCount }) : t('filters')}
      />
    </>
  );
}

/**
 * Product grid with a FLIP reorder (§4.3-4): when filters change, cards glide from their
 * old slots to the new ones (transform only); new cards pop in. Web Animations, no library.
 */
function Grid({ items, animate }: { items: CardProduct[]; animate: boolean }) {
  const list = useRef<HTMLUListElement>(null);
  const slots = useRef(new Map<string, { x: number; y: number }>());
  const ids = items.map((p) => p.id).join(' ');

  const measure = () => {
    const next = new Map<string, { x: number; y: number }>();
    for (const li of Array.from(list.current?.children ?? []) as HTMLElement[])
      next.set(li.dataset.id!, { x: li.offsetLeft, y: li.offsetTop });
    return next;
  };

  useLayoutEffect(() => {
    const before = slots.current;
    const after = measure();
    slots.current = after;
    // A grid that mounts after a filter change (grouped ↔ flat) has no baseline: every card pops in.
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const li of Array.from(list.current?.children ?? []) as HTMLElement[]) {
      const from = before.get(li.dataset.id!);
      const to = after.get(li.dataset.id!)!;
      if (!from) {
        li.animate(
          [
            { opacity: 0, transform: 'scale(0.94)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: 260,
            easing: 'cubic-bezier(0.2, 0.9, 0.1, 1)',
          },
        );
      } else if (from.x !== to.x || from.y !== to.y) {
        li.animate(
          [{ transform: `translate(${from.x - to.x}px, ${from.y - to.y}px)` }, { transform: 'none' }],
          {
            duration: 420,
            easing: 'cubic-bezier(0.34, 1.25, 0.64, 1)',
          },
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run per new order only
  }, [ids]);

  // Slots move when the viewport resizes; keep the baseline current.
  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const ro = new ResizeObserver(() => (slots.current = measure()));
    ro.observe(ul);
    return () => ro.disconnect();
  }, []);

  return (
    <ul
      ref={list}
      className="relative grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4 xl:gap-8"
    >
      {items.map((p, i) => (
        <li key={p.id} data-id={p.id}>
          <ProductCard product={p} priority={i < 2} />
        </li>
      ))}
    </ul>
  );
}

function FilterControls({
  f,
  update,
  fixedFamily,
  counts,
  total,
}: {
  f: Filters;
  update: (patch: Partial<Filters>, opts?: { push?: boolean; event?: [string, string] }) => void;
  fixedFamily?: CategorySlug;
  counts: Record<CategorySlug, number>;
  total: number;
}) {
  const t = useTranslations('catalogue');
  const tf = useTranslations('footer');
  const label = { containers: tf('containers'), platters: tf('platters'), foil: tf('foil') };
  const groupCls = 'flex flex-wrap items-center gap-2';
  const legend = 'me-1 type-small font-bold';
  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-3">
      <div role="group" aria-label={t('family')} className={groupCls}>
        <span className={legend} aria-hidden>
          {t('family')}
        </span>
        {fixedFamily ? (
          <>
            <Link
              href="/products"
              className="inline-flex min-h-11 press items-center rounded-full border-2 border-blue bg-white px-4 text-[0.9375rem] font-semibold"
            >
              {t('all')}
            </Link>
            {FAMILIES.map((fam) =>
              fam === fixedFamily ? (
                <Chip key={fam} selected aria-current="page">
                  {label[fam]}
                </Chip>
              ) : (
                <Link
                  key={fam}
                  href={`/products/${fam}`}
                  className="inline-flex min-h-11 press items-center rounded-full border-2 border-blue bg-white px-4 text-[0.9375rem] font-semibold"
                >
                  {label[fam]}
                </Link>
              ),
            )}
          </>
        ) : (
          <>
            <Chip
              selected={f.family === 'all'}
              count={total}
              onClick={() => update({ family: 'all' }, { event: ['family', 'all'] })}
            >
              {t('all')}
            </Chip>
            {FAMILIES.map((fam) => (
              <Chip
                key={fam}
                selected={f.family === fam}
                count={counts[fam]}
                onClick={() => update({ family: fam }, { event: ['family', fam] })}
              >
                {label[fam]}
              </Chip>
            ))}
          </>
        )}
      </div>

      {f.family === 'containers' && (
        <div role="group" aria-label={t('compartments')} className={groupCls}>
          <span className={legend} aria-hidden>
            {t('compartments')}
          </span>
          {(['1', '2', '3'] as const).map((n) => (
            <Chip
              key={n}
              selected={f.comp === n}
              onClick={() => update({ comp: f.comp === n ? '' : n }, { event: ['compartments', n] })}
            >
              <CompIcon n={Number(n) as 1 | 2 | 3} className="h-4 w-5" />
              {n}
            </Chip>
          ))}
        </div>
      )}

      {f.family === 'foil' && (
        <>
          <div role="group" aria-label={t('width')} className={groupCls}>
            <span className={legend} aria-hidden>
              {t('width')}
            </span>
            {(['30', '45'] as const).map((w) => (
              <Chip
                key={w}
                selected={f.width === w}
                onClick={() => update({ width: f.width === w ? '' : w }, { event: ['width', w] })}
              >
                <bdi dir="ltr">{w} cm</bdi>
              </Chip>
            ))}
          </div>
          <div role="group" aria-label={t('type')} className={groupCls}>
            <span className={legend} aria-hidden>
              {t('type')}
            </span>
            {(['household', 'catering', 'promo'] as const).map((ty) => (
              <Chip
                key={ty}
                selected={f.type === ty}
                onClick={() => update({ type: f.type === ty ? '' : ty }, { event: ['type', ty] })}
              >
                {t(ty)}
              </Chip>
            ))}
          </div>
        </>
      )}

      <label className="flex items-center gap-2 md:ms-auto">
        <span className={legend}>{t('sort')}</span>
        <select
          value={f.sort}
          onChange={(e) => update({ sort: e.target.value as Sort }, { event: ['sort', e.target.value] })}
          className="min-h-11 rounded-btn border-2 border-blue bg-white px-3 font-semibold"
        >
          <option value="code-asc">{t('sortCodeAsc')}</option>
          <option value="code-desc">{t('sortCodeDesc')}</option>
          <option value="name">{t('sortName')}</option>
        </select>
      </label>
    </div>
  );
}

/** Mobile bottom bar on catalogue pages (§6.4): [Filters] [Quote (n)]. */
function CatalogueBottomBar({ onFilters, label }: { onFilters: () => void; label: string }) {
  const count = useQuoteCount();
  const tn = useTranslations('nav');
  const open = useUI((s) => s.setQuoteOpen);
  return (
    <div className="mobile-bottom-bar on-light fixed inset-x-0 bottom-0 z-[60] grid grid-cols-2 gap-3 border-t-2 border-blue bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden">
      <button
        type="button"
        onClick={onFilters}
        className="inline-flex min-h-12 press items-center justify-center gap-2 rounded-btn border-2 border-blue bg-white font-bold"
      >
        <IconFilter size={18} />
        {label}
      </button>
      <button
        type="button"
        onClick={() => open(true)}
        data-quote-target
        className="inline-flex min-h-12 press items-center justify-center gap-2 rounded-btn border-2 border-blue bg-red font-bold text-white"
      >
        <TrayGlyph className="size-5" />
        {tn('quote')} <span className="tabular">({count})</span>
      </button>
    </div>
  );
}
