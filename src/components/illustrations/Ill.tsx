import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Illustration scaffold (§3.8). Naive single-weight ink line art:
 *  - ink: 2.5px non-scaling strokes in --ink (Blue on light, White on Blue/Red), round caps/joins,
 *    with a shared wobble filter (#sp-wobble) for the hand-drawn feel;
 *  - fills: flat Yellow/Red/White/Foil, offset 3.5px from the ink (risograph misregistration).
 * Placeholder art by the build; the design lead replaces these with final hand-drawn SVGs
 * keeping the same component names and viewBoxes.
 */
export type Fill = 'a' | 'b' | 'c' | 'foil' | 'ink' | 'black';
export type Shape = readonly [d: string, fill?: Fill];

export const FILLS: Record<Fill, string> = {
  a: 'var(--fill-1)',
  b: 'var(--fill-2)',
  c: 'var(--fill-3)',
  foil: 'var(--fill-foil)',
  ink: 'var(--ink)',
  black: 'var(--color-black)',
};

export type IllProps = { className?: string; label?: string };

export function Ill({
  viewBox,
  shapes = [],
  lines = [],
  thin = [],
  className,
  label,
  children,
  offset = 3.5,
}: {
  viewBox: string;
  shapes?: readonly Shape[];
  lines?: readonly string[];
  thin?: readonly string[];
  className?: string;
  label?: string;
  children?: ReactNode;
  offset?: number;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={cn('block h-auto w-full overflow-visible', className)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      focusable="false"
    >
      <g transform={`translate(${offset} ${offset})`}>
        {shapes.map(([d, f], i) => (f ? <path key={i} d={d} fill={FILLS[f]} /> : null))}
      </g>
      <g
        className="ink-wobble"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {shapes.map(([d], i) => (
          <path key={`s${i}`} d={d} vectorEffect="non-scaling-stroke" />
        ))}
        {lines.map((d, i) => (
          <path key={`l${i}`} d={d} vectorEffect="non-scaling-stroke" />
        ))}
        {thin.map((d, i) => (
          <path key={`t${i}`} d={d} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      {children}
    </svg>
  );
}
