'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useUI } from '../ui-store';
import { cn } from '@/lib/cn';

/**
 * Sticky header behaviour (§6.2): hides on scroll down, reappears on scroll up,
 * shrinks 72→60 after 80px. Transform-only: the outer box keeps its height so
 * nothing below shifts (CLS 0).
 */
export function HeaderChrome({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const last = useRef(0);
  const menuOpen = useUI((s) => s.menuOpen);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const delta = y - last.current;
        setShrunk(y > 80);
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 240);
          last.current = y;
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const isHidden = hidden && !menuOpen;

  return (
    <header
      className={cn(
        'header-chrome on-light sticky top-0 z-50 h-[var(--header-h)]',
        shrunk && 'is-shrunk',
        isHidden && 'is-hidden',
      )}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="header-bar h-full border-b-2 border-blue bg-white">{children}</div>
    </header>
  );
}
