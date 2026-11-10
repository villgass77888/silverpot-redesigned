import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Arrow, type ArrowKind } from '@/components/illustrations/arrows';

/**
 * Handwritten aside (§3.4): Gochi Hand, ≤ 12 words, optional hand-drawn arrow
 * that draws itself in on first view. Never rotate body text, only notes.
 */
export function HandNote({
  children,
  arrow,
  rotate = -3,
  className,
  arrowClassName,
  arrowFirst,
  drawClass = 'draw-on-view',
}: {
  children: ReactNode;
  arrow?: ArrowKind;
  rotate?: number;
  className?: string;
  arrowClassName?: string;
  arrowFirst?: boolean;
  drawClass?: string;
}) {
  const a = arrow ? (
    <Arrow
      kind={arrow}
      className={cn('w-14 shrink-0 rtl:-scale-x-100', arrowClassName)}
      drawClass={drawClass}
    />
  ) : null;
  return (
    <span
      className={cn('inline-flex items-end gap-1.5 type-hand', className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {arrowFirst && a}
      <span>{children}</span>
      {!arrowFirst && a}
    </span>
  );
}
