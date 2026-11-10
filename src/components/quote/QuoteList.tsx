'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCatalog } from '../catalog-context';
import { useQuote, type QuoteItem } from './store';
import { useUI } from '../ui-store';
import { QuantityStepper, UnitToggle } from '../catalogue/QuantityStepper';
import { IconTrash } from '../icons';
import { cn } from '@/lib/cn';
import { buildQuoteMessage, waStrings, type WaLine } from '@/lib/whatsapp';
import type { CardProduct } from '@/lib/catalog';
import { ProductThumbFallback } from '../catalogue/PhotoComingSoon';

/** Editable list of quote items (drawer: compact; /quote + wholesale: with notes). */
export function QuoteList({
  variant = 'full',
  className,
}: {
  variant?: 'compact' | 'full';
  className?: string;
}) {
  const items = useQuote((s) => s.items);
  const { byId, ready } = useCatalog();
  const t = useTranslations('quote');
  return (
    <ul
      className={cn('divide-y-2 divide-blue/10', className)}
      aria-label={t('listHeading')}
      aria-busy={!ready}
    >
      {items.map((item) => {
        const p = byId.get(item.productId);
        // The catalogue index loads on first open; hold each row's place meanwhile.
        if (!p)
          return ready ? null : (
            <li key={item.productId} className="flex gap-3 py-4" aria-hidden>
              <span className="shimmer size-16 shrink-0 rounded-rim sm:size-20" />
              <span className="shimmer h-10 flex-1 rounded-[8px]" />
            </li>
          );
        return <QuoteRow key={item.productId} item={item} p={p} variant={variant} />;
      })}
    </ul>
  );
}

function QuoteRow({ item, p, variant }: { item: QuoteItem; p: CardProduct; variant: 'compact' | 'full' }) {
  const t = useTranslations('quote');
  const tc = useTranslations('common');
  const { setQty, setUnit, setNote, remove } = useQuote.getState();
  const close = useUI((s) => s.setQuoteOpen);

  return (
    <li className="py-4">
      <div className="flex gap-3">
        <Link
          href={p.href}
          onClick={() => close(false)}
          className="rim relative size-16 shrink-0 overflow-hidden bg-foil bg-blueprint-fine sm:size-20"
          tabIndex={-1}
          aria-hidden
        >
          {p.image ? (
            <Image
              src={p.image.src}
              alt=""
              fill
              sizes="80px"
              className="object-contain product-cutout"
              quality={78}
            />
          ) : (
            <ProductThumbFallback category={p.category} />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={p.href} onClick={() => close(false)} className="min-w-0 hover:underline">
              {p.code && (
                <span className="block font-display text-2xl leading-none font-extrabold tabular">
                  <bdi dir="ltr">{p.code}</bdi>
                </span>
              )}
              <span className={cn('block text-sm leading-snug font-semibold', !p.code && 'text-base')}>
                {p.name}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => {
                remove(item.productId);
                useUI.getState().toast(t('toastRemoved'));
              }}
              className="-me-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-blue hover:bg-foil"
              aria-label={t('removeItem', { name: p.code ?? p.name })}
            >
              <IconTrash size={20} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <QuantityStepper size="sm" value={item.qty} onChange={(n) => setQty(item.productId, n)} />
            <UnitToggle size="sm" value={item.unit} onChange={(u) => setUnit(item.productId, u)} />
            <span className="sr-only">
              {item.qty}{' '}
              {item.unit === 'cartons'
                ? tc('unitCartons', { count: item.qty })
                : tc('unitPieces', { count: item.qty })}
            </span>
          </div>
          {variant === 'full' && (
            <div className="mt-3">
              <label className="mb-1 block type-small font-semibold" htmlFor={`note-${item.productId}`}>
                {t('note')}
              </label>
              <input
                id={`note-${item.productId}`}
                defaultValue={item.note ?? ''}
                onBlur={(e) => setNote(item.productId, e.target.value)}
                placeholder={t('notePlaceholder')}
                maxLength={300}
                className="h-11 w-full rounded-btn border-2 border-blue/40 bg-white px-3 text-[0.9375rem] outline-none focus:border-blue focus:shadow-hard-sm"
              />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

/** Build the §5.4 WhatsApp message from the current list. */
export function useQuoteWhatsApp() {
  const items = useQuote((s) => s.items);
  const { byId } = useCatalog();
  const tc = useTranslations('common');
  const locale = useLocale();
  return (extra: { delivery?: string; name?: string; company?: string; neededBy?: string } = {}) => {
    const lines: WaLine[] = items.flatMap((i) => {
      const p = byId.get(i.productId);
      if (!p) return [];
      return [
        {
          code: p.code,
          name: p.shortName,
          qty: i.qty,
          unitLabel:
            i.unit === 'cartons' ? tc('unitCartons', { count: i.qty }) : tc('unitPieces', { count: i.qty }),
          note: i.note,
        },
      ];
    });
    return buildQuoteMessage(lines, extra, waStrings(locale));
  };
}
