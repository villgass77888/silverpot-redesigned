'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CardProduct } from '@/lib/catalog';
import { ProductCard } from '../catalogue/ProductCard';
import { IconCaretLeft, IconCaretRight } from '../icons';

/**
 * H6 rail (§7.1): horizontal scroll-snap; 4 cards + Prev/Next on desktop, 1.3 on mobile.
 * Progress is a thin "conveyor" track with a Yellow block.
 */
export function FeaturedRail({ items }: { items: CardProduct[] }) {
  const t = useTranslations('common');
  const rail = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ progress: 0, ratio: 0.3, atStart: true, atEnd: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const pos = Math.abs(el.scrollLeft); // RTL scrollLeft is negative
      setState({
        progress: max > 0 ? pos / max : 0,
        ratio: el.scrollWidth ? el.clientWidth / el.scrollWidth : 1,
        atStart: pos < 4,
        atEnd: pos > max - 4,
      });
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector('li');
    const w = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const rtl = document.documentElement.dir === 'rtl';
    el.scrollBy({ left: dir * w * (rtl ? -1 : 1), behavior: 'smooth' });
  };

  const blockW = Math.max(0.12, Math.min(1, state.ratio));

  return (
    <div>
      <ul
        ref={rail}
        data-reveal-stagger="start"
        className="-mx-4 scrollbar-none flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-1 pb-3 md:-mx-6 md:scroll-px-6 md:gap-6 md:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
      >
        {items.map((p) => (
          <li
            key={p.id}
            className="w-[72%] shrink-0 snap-start sm:w-[44%] md:w-[31%] lg:w-[calc((100%-72px)/4)]"
          >
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-blue/15" aria-hidden>
          <span
            className="absolute inset-y-0 start-0 rounded-full border border-blue bg-yellow"
            style={{
              width: `${blockW * 100}%`,
              transform: `translateX(calc(${state.progress * (1 / blockW - 1) * 100}% * var(--dirx, 1)))`,
            }}
          />
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={state.atStart}
            aria-label={t('previous')}
            className="grid size-11 press place-items-center rounded-full border-2 border-blue bg-white disabled:opacity-40 disabled:shadow-hard-none"
          >
            <IconCaretLeft size={20} className="rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={state.atEnd}
            aria-label={t('next')}
            className="grid size-11 press place-items-center rounded-full border-2 border-blue bg-white disabled:opacity-40 disabled:shadow-hard-none"
          >
            <IconCaretRight size={20} className="rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
