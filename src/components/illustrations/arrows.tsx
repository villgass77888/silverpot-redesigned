import { cn } from '@/lib/cn';

/** Six curved hand-drawn arrows for hand notes (§3.8 arrows-*.svg). Mirror in RTL. */
export type ArrowKind =
  'curve-down-left' | 'curve-down-right' | 'curve-up-left' | 'curve-up-right' | 'loop' | 'swoosh';

const ARROWS: Record<ArrowKind, { viewBox: string; d: string; head: string; len: number }> = {
  'curve-down-left': {
    viewBox: '0 0 80 64',
    d: 'M74 6C70 30 52 48 14 54',
    head: 'M24 44L12 54L26 60',
    len: 90,
  },
  'curve-down-right': {
    viewBox: '0 0 80 64',
    d: 'M6 6C10 30 28 48 66 54',
    head: 'M56 44L68 54L54 60',
    len: 90,
  },
  'curve-up-left': {
    viewBox: '0 0 80 64',
    d: 'M74 58C68 32 48 14 12 10',
    head: 'M22 2L10 10L22 20',
    len: 90,
  },
  'curve-up-right': {
    viewBox: '0 0 80 64',
    d: 'M6 58C12 32 32 14 68 10',
    head: 'M58 2L70 10L58 20',
    len: 90,
  },
  loop: {
    viewBox: '0 0 96 64',
    d: 'M4 40C20 44 34 40 40 28C46 14 30 8 26 22C22 38 50 50 88 34',
    head: 'M76 28L90 33L80 44',
    len: 150,
  },
  swoosh: { viewBox: '0 0 96 40', d: 'M4 30C30 6 62 4 88 18', head: 'M76 8L90 18L76 26', len: 100 },
};

export function Arrow({
  kind,
  className,
  drawClass,
}: {
  kind: ArrowKind;
  className?: string;
  drawClass?: string;
}) {
  const a = ARROWS[kind];
  return (
    <svg
      viewBox={a.viewBox}
      className={cn('block h-auto overflow-visible', className)}
      aria-hidden
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={drawClass}
        style={{ '--len': 100 } as React.CSSProperties}
      >
        <path d={a.d} pathLength={100} strokeDasharray={100} />
        <path d={a.head} pathLength={100} strokeDasharray={100} />
      </g>
    </svg>
  );
}
