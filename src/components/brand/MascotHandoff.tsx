'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { Crinkle } from './Crinkle';

/**
 * Runs `tick(dir)` once per frame while `ref` is near the viewport, where dir is the scroll
 * direction (1 down, -1 up). Does nothing under reduced motion.
 */
function useScrollTick(ref: RefObject<HTMLElement | null>, tick: (dir: 1 | -1) => void, onArm?: () => void) {
  const tickRef = useRef(tick);
  const armRef = useRef(onArm);
  useEffect(() => {
    tickRef.current = tick;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    armRef.current?.();
    let lastY = window.scrollY;
    let dir: 1 | -1 = 1;
    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          tickRef.current(dir);
        });
    };
    let on = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !on) window.addEventListener('scroll', onScroll, { passive: true });
        if (!e.isIntersecting && on) window.removeEventListener('scroll', onScroll);
        on = e.isIntersecting;
        tickRef.current(dir);
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/**
 * Bulk CTA → footer hand-off, part 1 (§8.4, §8.7). Scrolling down, once Aloom reaches the top
 * ~40% of the screen he hops and drops out through the bottom of the section. Scrolling back
 * up, when the section is in view again, he jumps back up from below and lands in his spot.
 */
export function MascotJumpOut({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'' | 'out' | 'back'>('');

  useScrollTick(ref, (dir) => {
    const r = ref.current!.getBoundingClientRect();
    const vh = window.innerHeight;
    if (state === '' && dir === 1 && r.top < vh * 0.42 && r.bottom > 0) setState('out');
    if (state === 'out' && dir === -1 && r.top > vh * 0.08 && r.top < vh * 0.7) setState('back');
  });

  return (
    <div ref={ref} className={className} data-reveal-skip>
      <div
        className="mascot-jumpout"
        data-state={state || undefined}
        onAnimationEnd={(e) => {
          if (e.animationName === 'sp-jump-back') setState('');
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Part 2: over the footer wordmark. Scrolling down to it, the hard-hat Aloom falls from above
 * into the spiral O, vanishes, then climbs half out and peeks over the edge. Scrolling up,
 * he jumps back up out of the O and away, ready to land back in the bulk CTA.
 * Without JS or with reduced motion only the peek shows, as before.
 */
export function FooterPeek({ style }: { style: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<'' | 'armed' | 'play' | 'leave'>('');

  useScrollTick(
    ref,
    (dir) => {
      const box = (ref.current!.parentElement ?? ref.current!).getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = Math.max(0, Math.min(box.bottom, vh) - Math.max(box.top, 0)) / box.height;
      if (state === 'armed' && dir === 1 && visible >= 0.6) setState('play');
      else if (state === 'play' && dir === -1 && visible > 0.15) setState('leave');
      else if (visible === 0 && state !== 'armed' && state !== '') setState('armed');
    },
    () => setState('armed'),
  );

  return (
    <span
      ref={ref}
      className="footer-peek absolute"
      style={style}
      data-state={state || undefined}
      onAnimationEnd={(e) => {
        if (e.animationName === 'sp-jump-up-out') setState('armed');
      }}
    >
      {/* The faller: clipped at the top edge of the wordmark, so he disappears into the O */}
      <span className="peek-fall-clip pointer-events-none absolute inset-x-[-40%] bottom-0 h-[600%] overflow-hidden">
        <span className="peek-faller absolute inset-x-[22%] bottom-0 block">
          <Crinkle pose="hard-hat" />
        </span>
      </span>
      <span className="block overflow-hidden">
        <span className="peek-riser block">
          <Crinkle pose="peek" />
        </span>
      </span>
    </span>
  );
}
