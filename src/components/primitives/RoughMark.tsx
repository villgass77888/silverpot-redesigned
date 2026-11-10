'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Hand-drawn underline/circle via rough-notation (§4.6), dynamically imported and
 * drawn once when 60% in view. Static (no animation) with reduced motion.
 */
export function RoughMark({
  children,
  type = 'underline',
  color = '#B8322A',
  strokeWidth = 2,
  padding = 2,
  delay = 0,
}: {
  children: ReactNode;
  type?: 'underline' | 'circle' | 'box' | 'highlight';
  color?: string;
  strokeWidth?: number;
  padding?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let annotation: { show(): void; remove(): void } | null = null;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.6) return;
        io.disconnect();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        void import('rough-notation').then(({ annotate }) => {
          annotation = annotate(el, {
            type,
            color,
            strokeWidth,
            padding,
            animate: !reduced,
            animationDuration: 700,
            iterations: 2,
          });
          timer = setTimeout(() => annotation?.show(), delay);
        });
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      annotation?.remove();
    };
  }, [type, color, strokeWidth, padding, delay]);
  return (
    <span ref={ref} className="relative inline-block">
      {children}
    </span>
  );
}
