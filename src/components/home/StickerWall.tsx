'use client';

import { useEffect, useRef, useState } from 'react';
import { SEGMENT_ICONS } from '../illustrations/segments';
import type { SegmentId } from '@/data/segments';
import { cn } from '@/lib/cn';
import { stickerRotation } from '@/lib/format';

export type WallItem = { id: SegmentId; label: string; line: string; pending?: React.ReactNode };

const TONES = [
  'bg-yellow text-blue',
  'bg-foil text-blue',
  'bg-red text-white on-red',
  'bg-blue text-white on-blue',
];
/** Board positions (% of a 1200×520 board) for the desktop layout. */
const POS = [
  { x: 2, y: 6 },
  { x: 27, y: 2 },
  { x: 52, y: 8 },
  { x: 76, y: 3 },
  { x: 10, y: 52 },
  { x: 38, y: 50 },
  { x: 64, y: 54 },
];

type Drag = {
  el: HTMLLIElement;
  id: number;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
  min: DOMRect;
};

/**
 * Sticker wall (§4.3-8): draggable on desktop pointers (lift while dragging, springy
 * landing with a 1° settle); a static 2/3-column grid on touch and small screens.
 * Plain pointer events, so the home page ships no animation library (§12.1).
 */
export function StickerWall({ items, hint }: { items: WallItem[]; hint: string }) {
  const board = useRef<HTMLUListElement>(null);
  const drag = useRef<Drag | null>(null);
  const offsets = useRef(new Map<HTMLLIElement, { x: number; y: number }>());
  const [draggable, setDraggable] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      '(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    );
    const on = () => {
      setDraggable(mq.matches);
      if (!mq.matches) {
        offsets.current.forEach((_, el) => el.style.removeProperty('translate'));
        offsets.current.clear();
      }
    };
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLLIElement>) => {
    if (!draggable || e.button !== 0 || !board.current) return;
    const el = e.currentTarget;
    const base = offsets.current.get(el) ?? { x: 0, y: 0 };
    const b = board.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    // Allowed travel, relative to the sticker's current offset (keeps it on the board).
    const min = new DOMRect(
      b.left - r.left + base.x,
      b.top - r.top + base.y,
      b.width - r.width,
      b.height - r.height,
    );
    drag.current = {
      el,
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      baseX: base.x,
      baseY: base.y,
      min,
    };
    el.setPointerCapture(e.pointerId);
    el.dataset.dragging = '';
  };

  const onPointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const x = Math.min(Math.max(d.baseX + e.clientX - d.startX, d.min.x), d.min.x + d.min.width);
    const y = Math.min(Math.max(d.baseY + e.clientY - d.startY, d.min.y), d.min.y + d.min.height);
    offsets.current.set(d.el, { x, y });
    d.el.style.translate = `${x}px ${y}px`;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLLIElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    delete d.el.dataset.dragging;
    drag.current = null;
  };

  return (
    <div className="relative">
      {draggable && (
        <p className="absolute end-4 -top-10 hidden -rotate-3 type-hand lg:block" aria-hidden>
          {hint}
        </p>
      )}
      <ul
        ref={board}
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:relative lg:block lg:h-[520px]"
        data-reveal-stagger="stamp"
      >
        {items.map((it, i) => {
          const Icon = SEGMENT_ICONS[it.id];
          return (
            <li
              key={it.id}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className={cn(
                'sticker-drag relative flex flex-col items-start rounded-[22px] border-[3px] border-white p-4 shadow-hard-sm max-md:last:odd:col-span-2 sm:p-5 lg:absolute lg:top-[var(--y)] lg:left-[var(--x)] lg:w-[22%]',
                TONES[i % TONES.length],
                draggable && 'cursor-grab touch-none select-none',
              )}
              style={
                {
                  '--x': `${POS[i % POS.length].x}%`,
                  '--y': `${POS[i % POS.length].y}%`,
                  '--rot': `${stickerRotation(i)}deg`,
                } as React.CSSProperties
              }
            >
              <span className="w-14 sm:w-16" aria-hidden>
                <Icon />
              </span>
              <h3 className="mt-3 type-h4">{it.label}</h3>
              <p className="mt-1 type-small opacity-90">{it.line}</p>
              {it.pending}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
