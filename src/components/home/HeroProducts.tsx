'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Sticker, type StickerTone } from '../primitives/Sticker';

export type HeroProduct = { href: string; src: string; label: string; tone: StickerTone };

/** Resting pose of each card: position in the fan, tilt, parallax depth (px at the pointer's edge). */
const POSE = [
  { cls: 'start-0 top-[14%] z-[1]', rot: -8, d: 10 },
  { cls: 'start-[30%] top-0 z-[2]', rot: 3, d: 18 },
  { cls: 'start-[60%] top-[18%] z-[3]', rot: 9, d: 26 },
] as const;

/**
 * Hero product fan: three blueprint cards with the cutout products, one per family.
 * Fine pointers: the cards drift with the pointer (CSS vars set once per frame, only
 * while the hero is on screen). Hover/focus straightens and lifts a card.
 * Touch and reduced motion: static fan, still tappable.
 */
export function HeroProducts({ items }: { items: HeroProduct[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty('--px', x.toFixed(3));
      el.style.setProperty('--py', y.toFixed(3));
    };
    // Touch: no pointer to follow, so the cards drift with scroll position instead.
    const onScroll = () => {
      const b = el.getBoundingClientRect();
      const t = Math.max(
        -1,
        Math.min(1, (b.top + b.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2)),
      );
      x = -t * 1.4;
      y = t * 1.6;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, (e.clientX - (b.left + b.width / 2)) / (window.innerWidth / 2)));
      y = Math.max(-1, Math.min(1, (e.clientY - (b.top + b.height / 2)) / (window.innerHeight / 2)));
      if (!raf) raf = requestAnimationFrame(apply);
    };
    let on = false;
    const [type, handler] = fine ? (['pointermove', onMove] as const) : (['scroll', onScroll] as const);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !on)
        window.addEventListener(type, handler as EventListener, { passive: true });
      if (!entry.isIntersecting && on) window.removeEventListener(type, handler as EventListener);
      on = entry.isIntersecting;
      if (on && !fine) onScroll();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener(type, handler as EventListener);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="hero-fan relative mx-auto aspect-[16/10] w-[92%] max-w-[34rem] sm:w-full"
      dir="ltr"
    >
      {items.map((it, i) => {
        const pose = POSE[i % POSE.length];
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`hero-fan-card group absolute block w-[40%] ${pose.cls}`}
            style={{ '--rot': `${pose.rot}deg`, '--d': pose.d, '--i': i } as React.CSSProperties}
          >
            <span className="hero-fan-deal block">
              <span className="rim relative block aspect-square overflow-hidden bg-white bg-blueprint-fine shadow-hard-md">
                <Image
                  src={it.src}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 220px, 40vw"
                  quality={78}
                  className="object-contain p-[10%] product-cutout transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3"
                />
              </span>
              <Sticker
                tone={it.tone}
                rotate={i % 2 ? 4 : -4}
                className="absolute start-1/2 -bottom-4 z-[2] -translate-x-1/2 text-xs whitespace-nowrap sm:text-sm md:text-base"
              >
                <span dir="auto">{it.label}</span>
              </Sticker>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
