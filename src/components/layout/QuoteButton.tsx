'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuoteCount } from '../quote/store';
import { useUI } from '../ui-store';
import { cn } from '@/lib/cn';

/** Lidded-tray glyph used for the Quote button. */
export function TrayGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M3 9.5h18" />
      <path d="M4.5 9.5l-1-3h17l-1 3" />
      <path d="M5 12.5h14l-1.6 7H6.6z" />
    </svg>
  );
}

/**
 * Header Quote button (§6.2): White, 3px outline, shadow-sm, Red count badge, "Quote (3)".
 * `data-quote-target` is where the fly-to-quote ghost lands (§4.3-3).
 */
export function QuoteButton() {
  const t = useTranslations('nav');
  const count = useQuoteCount();
  const bump = useUI((s) => s.quoteBump);
  const setOpen = useUI((s) => s.setQuoteOpen);
  const [stamp, setStamp] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStamp(false);
    const r = requestAnimationFrame(() => setStamp(true));
    return () => cancelAnimationFrame(r);
  }, [bump]);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      data-quote-target
      aria-label={t('quoteLabel', { count })}
      className="relative inline-flex min-h-11 press items-center gap-2 rounded-btn border-[3px] border-blue bg-white px-2.5 font-bold lg:px-3.5"
    >
      <TrayGlyph className="size-6" />
      <span className="hidden lg:inline">
        {t('quote')} <span className="tabular">({count})</span>
      </span>
      <span
        aria-hidden
        onAnimationEnd={() => setStamp(false)}
        className={cn(
          'absolute -end-2.5 -top-2.5 grid h-6 min-w-6 place-items-center rounded-full border-2 border-white bg-red px-1 text-xs font-bold text-white tabular lg:hidden',
          count === 0 && 'hidden',
          stamp && 'badge-stamp',
        )}
      >
        {count}
      </span>
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 hidden rounded-[7px] lg:block',
          stamp && 'badge-stamp',
        )}
      />
    </button>
  );
}
