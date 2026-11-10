'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Aloom strolls in from the left the first time this spot scrolls into view, then stays (§8.8).
 * Without JS or with reduced motion he's simply there.
 */
export function SlideInMascot({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'' | 'armed' | 'in'>('');

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setState('armed');
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setState('in');
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-reveal-skip>
      <div className="slide-mascot" data-state={state || undefined}>
        <div className="slide-mascot-bob">{children}</div>
      </div>
    </div>
  );
}
