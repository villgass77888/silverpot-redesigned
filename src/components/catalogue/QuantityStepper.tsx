'use client';

import { useEffect, useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconMinus, IconPlus } from '../icons';
import { clampQty } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { QuoteUnit } from '../quote/store';

/** Quantity stepper (§7.4): 44px targets, typeable, clamps 1–9999. */
export function QuantityStepper({
  value,
  onChange,
  label,
  className,
  size = 'md',
}: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const t = useTranslations('product');
  const [draft, setDraft] = useState(String(value));
  const id = useId();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- keep the text field in sync with external changes
  useEffect(() => setDraft(String(value)), [value]);

  const commit = (raw: string) => {
    const n = clampQty(parseInt(raw.replace(/[^\d]/g, ''), 10));
    setDraft(String(n));
    onChange(n);
  };
  const btn = cn(
    'grid shrink-0 place-items-center text-blue transition-colors hover:bg-yellow disabled:opacity-35 disabled:hover:bg-transparent',
    // Compact on desktop; 44 px targets on touch (§12.2).
    size === 'sm' ? 'size-10 pointer-coarse:size-11' : 'size-11',
  );

  return (
    <div className={cn('inline-flex items-center rounded-btn border-2 border-blue bg-white', className)}>
      <button
        type="button"
        className={cn(btn, 'rounded-s-[8px]')}
        onClick={() => commit(String(value - 1))}
        disabled={value <= 1}
        aria-label={t('decrease')}
      >
        <IconMinus size={18} />
      </button>
      <label htmlFor={id} className="sr-only">
        {label ?? t('quantity')}
      </label>
      <input
        id={id}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit((e.target as HTMLInputElement).value);
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            commit(String(value + 1));
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            commit(String(value - 1));
          }
        }}
        className={cn(
          'w-14 border-x-2 border-blue/20 bg-transparent text-center font-display font-extrabold tabular outline-none focus-visible:bg-yellow',
          size === 'sm' ? 'h-10 text-xl' : 'h-11 text-2xl',
        )}
      />
      <button
        type="button"
        className={cn(btn, 'rounded-e-[8px]')}
        onClick={() => commit(String(value + 1))}
        disabled={value >= 9999}
        aria-label={t('increase')}
      >
        <IconPlus size={18} />
      </button>
    </div>
  );
}

/** Cartons | Pieces segmented toggle. */
export function UnitToggle({
  value,
  onChange,
  className,
  size = 'md',
}: {
  value: QuoteUnit;
  onChange: (u: QuoteUnit) => void;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const t = useTranslations('common');
  const tp = useTranslations('product');
  const opts: QuoteUnit[] = ['cartons', 'pieces'];
  return (
    <div
      role="radiogroup"
      aria-label={tp('unit')}
      className={cn('inline-flex rounded-full border-2 border-blue bg-white p-0.5', className)}
    >
      {opts.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            'rounded-full px-3 font-semibold transition-colors',
            size === 'sm' ? 'min-h-9 text-sm pointer-coarse:min-h-11' : 'min-h-10 pointer-coarse:min-h-11',
            value === o ? 'bg-blue text-white' : 'hover:bg-foil',
          )}
        >
          {t(o)}
        </button>
      ))}
    </div>
  );
}
