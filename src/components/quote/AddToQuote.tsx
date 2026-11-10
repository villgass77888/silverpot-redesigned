'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuote, type QuoteUnit } from './store';
import { useUI } from '../ui-store';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { buttonClasses, type ButtonSize } from '../primitives/Button';
import { IconCheck } from '../icons';

/**
 * Add to quote (§4.3-3): the lid flips 180° and snaps onto the tray, the label reads
 * "Added" for 1.2s, a thumbnail ghost arcs to the Quote button, the badge stamps, and
 * the live region announces "Added 8325 to your quote".
 */
export function AddToQuote({
  productId,
  code,
  name,
  qty = 1,
  unit = 'cartons',
  note,
  source,
  thumb,
  size = 'md',
  compact,
  full,
  variant = 'primary',
  className,
  labelClassName,
  onAdded,
}: {
  productId: string;
  code: string | null;
  name: string;
  qty?: number;
  unit?: QuoteUnit;
  note?: string;
  source: 'card' | 'pdp' | 'finder' | 'search';
  thumb?: string | null;
  size?: ButtonSize;
  compact?: boolean;
  full?: boolean;
  variant?: 'primary' | 'secondary' | 'yellow';
  className?: string;
  /** e.g. hide the label via a container query on compact cards (stays accessible) */
  labelClassName?: string;
  onAdded?: () => void;
}) {
  const t = useTranslations('common');
  const tq = useTranslations('quote');
  const add = useQuote((s) => s.add);
  const [added, setAdded] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClick = () => {
    add(productId, qty, unit, note);
    const ui = useUI.getState();
    ui.bumpQuote();
    ui.announce(tq('announceAdded', { code: code ?? name }));
    ui.toast(tq('toastAdded'), 'success');
    const category = { c: 'containers', p: 'platters', f: 'foil' }[productId[0]] ?? 'unknown';
    track('add_to_quote', { productId, modelCode: code, category, source });
    setAdded((n) => n + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(0), 1200);
    flyToQuote(btn.current, thumb);
    onAdded?.();
  };

  const isAdded = added > 0;
  return (
    <button
      ref={btn}
      type="button"
      onClick={onClick}
      aria-label={compact ? `${t('addToQuote')}: ${code ?? name}` : undefined}
      className={cn(
        buttonClasses({ variant, size, full }),
        compact && 'aspect-square px-0',
        isAdded && variant === 'primary' && 'bg-blue',
        'relative z-[2]',
        className,
      )}
    >
      <span className="relative inline-grid size-[22px] shrink-0 place-items-center" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          className="size-[22px] overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5h14l-1.6 7H6.6z" />
          <g
            key={added}
            style={{
              transformBox: 'fill-box',
              transformOrigin: '50% 50%',
              animation: isAdded ? 'sp-lid-snap 420ms var(--ease-stamp) both' : undefined,
              transform: isAdded ? undefined : 'translateY(-3px)',
            }}
          >
            <path d="M3.5 9.5h17" />
            <path d="M5 9.5l-.8-2.6h15.6L19 9.5" />
          </g>
        </svg>
      </span>
      {!compact && (
        <span className={cn('relative', labelClassName)}>
          <span className={cn(isAdded && 'invisible')}>{t('addToQuote')}</span>
          {isAdded && (
            <span className="absolute inset-0 flex items-center justify-center gap-1">
              <IconCheck size={16} />
              {t('added')}
            </span>
          )}
        </span>
      )}
    </button>
  );
}

/** A 24px ghost of the thumbnail arcs to the visible Quote target (380ms). */
function flyToQuote(from: HTMLElement | null, thumb?: string | null) {
  if (!from || typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = [...document.querySelectorAll<HTMLElement>('[data-quote-target]')];
  const target = targets.find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
  });
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const sx = a.left + a.width / 2 - 12;
  const sy = a.top + a.height / 2 - 12;
  const dx = b.left + b.width / 2 - 12 - sx;
  const dy = b.top + b.height / 2 - 12 - sy;

  const outer = document.createElement('div');
  const inner = document.createElement('div');
  outer.style.cssText = `position:fixed;left:${sx}px;top:${sy}px;z-index:95;pointer-events:none;`;
  inner.style.cssText =
    'width:24px;height:24px;border-radius:999px;border:2px solid #0E2A8C;background:#E9ECF1 center/cover no-repeat;box-shadow:2px 2px 0 #0E2A8C;';
  if (thumb) inner.style.backgroundImage = `url("${thumb}")`;
  outer.appendChild(inner);
  document.body.appendChild(outer);
  // X travels linearly, Y eases in → a curved path.
  outer.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], {
    duration: 380,
    easing: 'cubic-bezier(.3,.1,.4,1)',
    fill: 'forwards',
  });
  const anim = inner.animate(
    [
      { transform: 'translateY(0) scale(1)' },
      { transform: `translateY(${Math.min(-40, dy * 0.15)}px) scale(1.15)`, offset: 0.35 },
      { transform: `translateY(${dy}px) scale(.6)` },
    ],
    { duration: 380, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' },
  );
  anim.onfinish = () => outer.remove();
}
