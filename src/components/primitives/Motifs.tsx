import { useId } from 'react';
import { cn } from '@/lib/cn';
import { barcodeBars } from '@/lib/barcode';
import { spiralGeometry } from '@/components/brand/spiral';

/** Print crosshair circles in the four corners (§3.7-7). Decorative. */
export function RegistrationMarks({
  className,
  inset = 10,
  size = 16,
}: {
  className?: string;
  inset?: number;
  size?: number;
}) {
  const mark = (key: string, pos: React.CSSProperties) => (
    <svg
      key={key}
      viewBox="0 0 16 16"
      className={cn('pointer-events-none absolute z-[3]', className ?? 'text-blue')}
      style={{ width: size, height: size, ...pos }}
      aria-hidden
    >
      <use href="#sp-reg" />
    </svg>
  );
  return (
    <>
      {mark('ts', { top: inset, insetInlineStart: inset })}
      {mark('te', { top: inset, insetInlineEnd: inset })}
      {mark('bs', { bottom: inset, insetInlineStart: inset })}
      {mark('be', { bottom: inset, insetInlineEnd: inset })}
    </>
  );
}

/** Yellow/black hazard stripes, rotated −1.5° (§3.7-5). Only before the bulk CTA and on 404. */
export function HazardTape({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('relative z-10 -my-[10px] overflow-hidden', className)}>
      <div className="-mx-8 hazard -rotate-[1.5deg] border-y-2 border-black" />
    </div>
  );
}

/** Decorative carton-label barcode with the code under it (§3.7-8). */
export function CartonLabel({ code, className }: { code: string; className?: string }) {
  const { bars, width } = barcodeBars(code);
  return (
    <span
      aria-hidden
      className={cn('inline-flex flex-col items-center rounded-[3px] bg-white px-1.5 pt-1 pb-0.5', className)}
    >
      <svg viewBox={`0 0 ${width} 20`} className="h-4 w-auto" preserveAspectRatio="none">
        <path d={bars.map((b) => `M${b.x} 0h${b.w}v20h-${b.w}z`).join('')} fill="var(--color-blue)" />
      </svg>
      <span className="font-display text-[0.5625rem] leading-none font-extrabold tracking-[0.2em] text-blue tabular">
        {code}
      </span>
    </span>
  );
}

/**
 * Circular stencil stamp (§3.7-4): Big Shoulders Stencil on a circle, Red at 85%,
 * worn print texture. At most one per page.
 */
export function Stamp({
  text,
  className,
  tone = 'red',
}: {
  text: string;
  className?: string;
  tone?: 'red' | 'blue';
}) {
  const id = useId().replace(/:/g, '');
  const colour = tone === 'red' ? 'var(--color-red)' : 'var(--color-blue)';
  const r = 74;
  const circumference = 2 * Math.PI * r;
  const spiral = spiralGeometry(100, 100, 30);
  return (
    <svg viewBox="0 0 200 200" className={cn('block', className)} aria-hidden focusable="false">
      <defs>
        <path id={`${id}-p`} d={`M100 100m-${r} 0a${r} ${r} 0 1 1 ${r * 2} 0a${r} ${r} 0 1 1 -${r * 2} 0`} />
        <filter id={`${id}-rough`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="7" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75"
            result="speck"
          />
          <feComposite in="SourceGraphic" in2="speck" operator="in" result="worn" />
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" seed="3" result="w" />
          <feDisplacementMap in="worn" in2="w" scale="2.5" />
        </filter>
      </defs>
      <g opacity="0.85" filter={`url(#${id}-rough)`}>
        <circle cx="100" cy="100" r="95" fill="none" stroke={colour} strokeWidth="6" />
        <circle cx="100" cy="100" r="54" fill="none" stroke={colour} strokeWidth="3" />
        <text
          fill={colour}
          fontFamily="var(--font-stencil)"
          fontWeight="900"
          fontSize="25"
          letterSpacing="1"
          style={{ textTransform: 'uppercase' }}
        >
          <textPath href={`#${id}-p`} startOffset="0" textLength={circumference - 6} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
        <g fill="none" stroke={colour}>
          <circle cx="100" cy="100" r={spiral.ring.r} strokeWidth={spiral.ring.width} />
          <path d={spiral.spiral} strokeWidth={spiral.spiralWidth} strokeLinecap="round" />
          <circle cx="100" cy="100" r={spiral.core.r} strokeWidth={spiral.core.width} />
        </g>
      </g>
    </svg>
  );
}

/** Rivet for DataPlates. */
function Rivet({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute size-[7px] rounded-full border border-blue/45 bg-white shadow-[inset_-1px_-1px_0_rgb(14_42_140/0.25)]',
        className,
      )}
    />
  );
}

export function Rivets() {
  return (
    <>
      <Rivet className="start-2 top-2" />
      <Rivet className="end-2 top-2" />
      <Rivet className="start-2 bottom-2" />
      <Rivet className="end-2 bottom-2" />
    </>
  );
}
