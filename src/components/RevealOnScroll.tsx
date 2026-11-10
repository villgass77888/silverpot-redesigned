'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll-in transitions (docs/DECISIONS.md §8.3). Tags content in <main> after hydration
 * and reveals it once as it enters the viewport:
 *  - every h2 → "wipe" (rises out of a slot);
 *  - other top-level blocks of each section's .shell → "up", staggered;
 *  - children of [data-reveal-stagger="deal|stamp|start|zoom|up"] → that variant, staggered;
 *  - anything with an explicit [data-reveal] keeps its variant.
 * Content already on screen (or above it) is never hidden. Without JS, or with reduced
 * motion, nothing is tagged, so everything simply shows. [data-reveal-skip] opts a subtree out.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    const main = document.getElementById('main');
    if (!main) return;

    const tagged = new Set<HTMLElement>();
    const tag = (el: Element, variant: string, i: number) => {
      if (!(el instanceof HTMLElement) || tagged.has(el) || el.dataset.revealDone !== undefined) return;
      if (el.closest('[data-reveal-skip]')) return;
      if (!el.dataset.reveal) el.dataset.reveal = variant;
      el.style.setProperty('--ri', String(Math.min(i, 8)));
      tagged.add(el);
    };
    // A block that holds the heading or a stagger group is split into its children.
    const block = (el: Element, i: number) => {
      if (el.matches('[data-reveal-stagger]')) return;
      if (el.tagName === 'H2') return tag(el, 'wipe', 0);
      if (el.querySelector('h2, [data-reveal-stagger]')) {
        [...el.children].forEach((c, j) => block(c, j));
        return;
      }
      tag(el, 'up', i);
    };

    // Stagger groups first, so their variant wins over the generic section pass.
    main
      .querySelectorAll<HTMLElement>('[data-reveal-stagger]')
      .forEach((g) => [...g.children].forEach((c, i) => tag(c, g.dataset.revealStagger || 'up', i)));
    main.querySelectorAll('section .shell').forEach((shell) => {
      if (shell.parentElement?.closest('.shell')) return;
      [...shell.children].forEach((c, i) => block(c, i));
    });
    main.querySelectorAll('h2').forEach((h) => tag(h, 'wipe', 0));
    main.querySelectorAll('[data-reveal]').forEach((el) => tag(el, (el as HTMLElement).dataset.reveal!, 0));

    // State lives in data attributes, not classes, so React re-renders never reset it.
    const show = (el: HTMLElement, animate: boolean) => {
      el.dataset.revealDone = '';
      if (animate) el.dataset.revealIn = '';
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          show(e.target as HTMLElement, true);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    // Hide only what is still below the fold; everything else stays as painted.
    const fold = window.innerHeight * 0.92;
    for (const el of tagged) {
      if (el.getBoundingClientRect().top < fold) show(el, false);
      else io.observe(el);
    }
    document.documentElement.setAttribute('data-rv', '');
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
