'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';

export type ConveyorItem = { label: string; href: string; thumb?: string | null };

/**
 * Conveyor (§4.3-4): a strip of model codes that advances only while you scroll
 * (translate = scrollDelta × 0.6), reverses on scroll up, stops when you stop.
 * aria-hidden; links are tabindex -1 (real navigation lives elsewhere).
 * Reduced motion: static and wrapped onto multiple lines.
 */
export function Conveyor({ items }: { items: ConveyorItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media query is client-only
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = track.current;
    const set = firstSet.current;
    if (!el || !set) return;
    const rtl = document.documentElement.dir === 'rtl';
    let offset = 0;
    let last = window.scrollY;
    let raf = 0;
    let visible = false;
    const apply = () => {
      raf = 0;
      const w = set.offsetWidth;
      if (!w) return;
      offset = ((offset % w) + w) % w;
      el.style.transform = `translate3d(${rtl ? offset : -offset}px,0,0)`;
    };
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last;
      last = y;
      if (!visible) return;
      offset += d * 0.6;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = window.scrollY;
    });
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);


  const cells = (key: string) =>
    items.map((it) => (
      <span key={key + it.label} className="flex items-center">
        <Link
          href={it.href}
          tabIndex={-1}
          className="px-4 font-display text-[30px] leading-none font-black whitespace-nowrap tabular hover:text-red md:px-5 md:text-[38px] lg:text-[44px]"
        >
          {it.label}
        </Link>
        <svg viewBox="0 0 20 20" className="size-4 shrink-0 md:size-5">
          <use href="#sp-foil-ball" />
        </svg>
      </span>
    ));

  return (
    <div ref={wrap} aria-hidden className="relative [overflow-x:clip] border-y-2 border-blue bg-white">
      {reduced ? (
        <div className="shell flex flex-wrap items-center justify-center gap-y-2 py-3">{cells('r')}</div>
      ) : (
        <div
          ref={track}
          className="flex h-14 items-center will-change-transform md:h-[66px] lg:h-[76px]"
          dir="ltr"
        >
          <div ref={firstSet} className="flex shrink-0 items-center">
            {cells('a')}
          </div>
          <div className="flex shrink-0 items-center">{cells('b')}</div>
          <div className="flex shrink-0 items-center">{cells('c')}</div>
        </div>
      )}
    </div>
  );
}
