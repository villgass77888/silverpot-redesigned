'use client';

import { useLayoutEffect, useState } from 'react';
import { Crinkle } from './Crinkle';

/**
 * Foil wipe page transition (§4.3-7). Enter-only overlay: on client navigation a Foil Grey
 * panel with a crinkle texture covers the new page before paint, holds briefly, then sweeps
 * off (transform only, ≤ 380 ms) with Crinkle peeking from its edge. Never blocks navigation;
 * skipped on first load and with reduced motion. See docs/DECISIONS.md for why this isn't
 * a ::view-transition (the panel + mascot can't live in the snapshot layer).
 */
// First mount = hard load (no wipe). A timestamp, not a boolean, so React Strict Mode's
// dev-only double effect run doesn't count as a navigation.
let firstMountAt = 0;

export function FoilWipe() {
  const [play, setPlay] = useState<null | 'ltr' | 'rtl'>(null);

  useLayoutEffect(() => {
    const now = performance.now();
    if (!firstMountAt) {
      firstMountAt = now;
      return;
    }
    if (now - firstMountAt < 600) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must cover before first paint
    setPlay(document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr');
    const t = setTimeout(() => setPlay(null), 400);
    return () => clearTimeout(t);
  }, []);

  if (!play) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] bg-foil"
      style={{
        animation: `${play === 'rtl' ? 'sp-wipe-out-rtl' : 'sp-wipe-out'} 380ms cubic-bezier(0.7, 0, 0.2, 1) both`,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cg fill='none' stroke='%230E2A8C' stroke-opacity='.14' stroke-width='1.5' stroke-linejoin='round'%3E%3Cpath d='M0 40L30 22L62 38L94 14L130 30L160 18M0 98L36 80L70 104L110 76L140 96L160 84M20 160L44 128L78 150L116 124L160 146M30 22L36 80M94 14L110 76M62 38L70 104'/%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      <span className="absolute end-0 top-1/2 w-24 translate-x-[55%] -translate-y-1/2 rotate-90 rtl:-translate-x-[55%] rtl:-rotate-90">
        <Crinkle pose="peek" />
      </span>
    </div>
  );
}
