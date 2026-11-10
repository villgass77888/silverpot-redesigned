'use client';

import { useRef, type ReactNode } from 'react';

/**
 * Hero logo press (§8.6, §8.7, §8.9). A letter squashes (a star spins) once when the mouse enters it or a finger
 * taps it, and the animation always plays to the end. The mouse re-arms a letter only after the
 * pointer has left the letter's resting box: the browser re-sends "over" when the squashed
 * shape springs back under a still cursor, which would otherwise loop into a vibration.
 */
export function TapPress({ children }: { children: ReactNode }) {
  const last = useRef<{ el: Element; box: DOMRect } | null>(null);
  const inside = (b: DOMRect, x: number, y: number) =>
    x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;

  const press = (letter: SVGElement) => {
    last.current = { el: letter, box: letter.getBoundingClientRect() };
    letter.removeAttribute('data-pressed');
    void letter.getBoundingClientRect();
    letter.setAttribute('data-pressed', '');
  };
  const letterOf = (t: EventTarget) => {
    const l = (t as Element).closest?.('.hero-letter, .hero-star');
    return l instanceof SVGElement ? l : null;
  };

  return (
    <div
      onPointerOver={(e) => {
        if (e.pointerType !== 'mouse') return;
        const l = letterOf(e.target);
        if (!l || l.hasAttribute('data-pressed')) return;
        if (last.current?.el === l && inside(last.current.box, e.clientX, e.clientY)) return;
        press(l);
      }}
      onPointerMove={(e) => {
        if (last.current && !inside(last.current.box, e.clientX, e.clientY)) last.current = null;
      }}
      onPointerLeave={() => {
        last.current = null;
      }}
      onPointerDown={(e) => {
        const l = e.pointerType !== 'mouse' && letterOf(e.target);
        if (l) press(l);
      }}
      onAnimationEnd={(e) => {
        if (e.animationName === 'sp-press' || e.animationName === 'sp-twinkle')
          (e.target as Element).removeAttribute('data-pressed');
      }}
    >
      {children}
    </div>
  );
}
