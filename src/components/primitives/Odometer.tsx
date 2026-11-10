'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Mechanical digit wheels (§3.7-9, §4.3-6). Rolls up from 0000 once, when 50% in view,
 * each wheel stopping in sequence. Server-renders the real value (no-JS and crawlers
 * see "1997"); static with reduced motion.
 */
export function Odometer({
  value,
  className,
  cellClassName,
}: {
  value: string;
  className?: string;
  cellClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<'rest' | 'zero' | 'rolling'>('rest');

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to 0000 before first paint
    setState('zero');
  }, []);

  useEffect(() => {
    if (state !== 'zero') return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          requestAnimationFrame(() => setState('rolling'));
          io.disconnect();
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [state]);

  return (
    <span ref={ref} className={cn('inline-flex', className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex gap-[0.06em]">
        {value.split('').map((ch, i) => {
          const n = DIGITS.indexOf(ch);
          if (n < 0) return <span key={i}>{ch}</span>;
          const pos = state === 'zero' ? 0 : n;
          return (
            <span
              key={i}
              className={cn('relative inline-block h-[1em] overflow-hidden leading-none', cellClassName)}
            >
              <span
                className="flex w-[0.56em] flex-col items-center"
                style={{
                  transform: `translateY(${-pos * 10}%)`,
                  transition:
                    state === 'rolling'
                      ? `transform ${700 + i * 220}ms cubic-bezier(0.34, 1.3, 0.64, 1) ${i * 60}ms`
                      : 'none',
                }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="block h-[1em] leading-none">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
