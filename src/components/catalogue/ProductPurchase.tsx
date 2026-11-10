'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AddToQuote } from '../quote/AddToQuote';
import { QuantityStepper, UnitToggle } from './QuantityStepper';
import { Chip } from '../primitives/Chip';
import { IconWhatsApp } from '../icons';
import { waHref } from '@/lib/whatsapp';
import { track } from '@/lib/analytics';
import type { QuoteUnit } from '../quote/store';

/**
 * PDP purchase panel (§7.4): unit toggle + stepper + Add to quote + Ask on WhatsApp.
 * Catering rolls get a "Length: 150 m | 300 m" chip selector passed into the quote note.
 * Also renders the mobile sticky bottom bar [– 1 +][Add to quote][WA] (§6.4).
 */
export function ProductPurchase({
  productId,
  code,
  name,
  thumb,
  lengths,
}: {
  productId: string;
  code: string | null;
  name: string;
  thumb: string | null;
  lengths: string[];
}) {
  const t = useTranslations('product');
  const tc = useTranslations('common');
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState<QuoteUnit>('cartons');
  const [length, setLength] = useState(lengths[0] ?? '');
  const unitLabel = unit === 'cartons' ? tc('unitCartons', { count: qty }) : tc('unitPieces', { count: qty });
  const note = lengths.length > 1 && length ? t('lengthNote', { length }) : undefined;
  const msg =
    (code
      ? t('askMsg', { code, name, qty, unit: unitLabel })
      : t('askMsgNoCode', { name, qty, unit: unitLabel })) + (note ? ` ${note}.` : '');
  const wa = waHref(msg);
  const onWa = () => track('whatsapp_click', { location: 'pdp' });

  return (
    <>
      {lengths.length > 1 && (
        <div role="group" aria-label={t('length')} className="mt-6 flex flex-wrap items-center gap-2">
          <span className="me-1 type-small font-bold" aria-hidden>
            {t('length')}
          </span>
          {lengths.map((l) => (
            <Chip key={l} selected={length === l} onClick={() => setLength(l)}>
              <bdi dir="ltr">{l}</bdi>
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-6 hidden flex-col gap-4 md:flex">
        <div className="flex flex-wrap items-center gap-3">
          <UnitToggle value={unit} onChange={setUnit} />
          <QuantityStepper value={qty} onChange={setQty} />
        </div>
        <div className="flex flex-wrap gap-3">
          <AddToQuote
            productId={productId}
            code={code}
            name={name}
            qty={qty}
            unit={unit}
            note={note}
            source="pdp"
            thumb={thumb}
            size="lg"
            className="min-w-56 flex-1"
          />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWa}
            className="inline-flex min-h-14 flex-1 press items-center justify-center gap-2.5 rounded-btn border-2 border-blue bg-white px-6 text-lg font-bold"
          >
            <IconWhatsApp size={22} />
            {tc('askWhatsApp')}
          </a>
        </div>
      </div>

      {/* Mobile: unit toggle inline, stepper + actions in the sticky bottom bar */}
      <div className="mt-6 md:hidden">
        <UnitToggle value={unit} onChange={setUnit} />
      </div>
      <div className="mobile-bottom-bar on-light fixed inset-x-0 bottom-0 z-[60] flex items-center gap-2 border-t-2 border-blue bg-white px-3 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden">
        <QuantityStepper value={qty} onChange={setQty} size="sm" />
        <AddToQuote
          productId={productId}
          code={code}
          name={name}
          qty={qty}
          unit={unit}
          note={note}
          source="pdp"
          thumb={thumb}
          size="md"
          className="min-w-0 flex-1 px-3"
        />
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWa}
          aria-label={tc('askWhatsApp')}
          className="grid size-12 shrink-0 press place-items-center rounded-btn border-2 border-blue bg-white"
        >
          <IconWhatsApp size={22} />
        </a>
      </div>
    </>
  );
}
