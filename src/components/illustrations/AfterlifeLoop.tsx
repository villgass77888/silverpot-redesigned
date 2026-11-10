import type { ReactNode } from 'react';
import { spiralGeometry } from '@/components/brand/spiral';

/* Same ink as every other illustration (§3.8): 2.5px non-scaling strokes, 1.6px details,
   flat fills misregistered 3.5px under the ink. */
const INK = {
  fill: 'none',
  stroke: 'var(--ink)',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
} as const;
const THIN = { ...INK, strokeWidth: 1.6 } as const;
const C = 180;
const R = 122;
const SPIRAL = spiralGeometry(C, C, 46);

function F({ d, fill }: { d: string; fill: string }) {
  return (
    <>
      <path d={d} fill={fill} transform="translate(3.5 3.5)" />
      <path d={d} {...INK} />
    </>
  );
}

/** One drawing per step on the page, centred on (0, 0), about 70 units wide. */
const STOPS: ReactNode[] = [
  // 1. Feed someone: a wide takeaway tray of biryani, still steaming
  <g key="feed">
    <F d="M-28 -2Q-16 -15 0 -13Q16 -15 28 -2Z" fill="var(--color-yellow)" />
    <path d="M-14 -7l3-1M-4 -10l3-1M7 -9l3 1M16 -5l3 1M-20 -4l3-1" {...THIN} />
    <circle cx="-8" cy="-6" r="2" fill="var(--color-red)" />
    <circle cx="11" cy="-5" r="2" fill="var(--color-red)" />
    <F d="M-30 -2H30L24 18H-24Z" fill="var(--fill-foil)" />
    <path d="M-34 -2H34" {...INK} />
    <path d="M-14 4L-12 14M0 4V14M14 4L12 14" {...THIN} />
    <path className="al-steam" d="M-12 -20q4-6 0-12M0 -22q4-6 0-12M12 -20q4-6 0-12" {...THIN} />
  </g>,
  // 2. Scrape and rinse: water drips from a tap into a tipped, empty container
  <g key="rinse">
    <F d="M-36 -34H-2V-27H-8V-21H-16V-27H-36Z" fill="var(--fill-foil)" />
    <path d="M-19 -34V-40M-26 -40H-12" {...INK} />
    {[0, 0.5].map((delay) => (
      <g key={delay} className="al-drip" style={{ animationDelay: `${delay}s` }}>
        <F d="M-12 -16q4 6 0 9q-4-3 0-9Z" fill="var(--color-blue)" />
      </g>
    ))}
    <g transform="rotate(-10)">
      <F d="M-22 2H22L17 24H-17Z" fill="var(--fill-foil)" />
      <path d="M-26 2H26" {...INK} />
      <path d="M-10 8L-8 20M2 8V20M13 8L11 20" {...THIN} />
    </g>
    <path d="M14 -6l6-6M20 0h8" {...THIN} />
  </g>,
  // 3. Into the recycling bin: a crumpled foil ball drops into a blue bin
  <g key="bin">
    <g className="al-drop">
      <F d="M-6 -44l6-5l7 2l2 7l-5 5l-7-2Z" fill="var(--fill-foil)" />
    </g>
    <F d="M-22 -14H22L17 26H-17Z" fill="var(--color-blue)" />
    <F d="M-27 -22H27V-14H-27Z" fill="var(--fill-foil)" />
    <path d="M-6 -22V-27H6V-22" {...INK} />
    <g fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-2 -3L-8 8M2 -3L8 8M-6 13H6" vectorEffect="non-scaling-stroke" />
      <path d="M-5 -1L-2 -3L-1 0M5 10L8 8L9 11M-3 15L-6 13L-3 11" vectorEffect="non-scaling-stroke" />
    </g>
  </g>,
  // 4. Melted down: a crucible of glowing molten aluminium on a burner
  <g key="melt">
    <path className="al-steam" d="M-10 -26q4-5 0-10M0 -28q4-5 0-10M10 -26q4-5 0-10" {...THIN} />
    <F d="M-24 -14H24Q22 8 0 8Q-22 8 -24 -14Z" fill="var(--fill-foil)" />
    <F d="M-22 -14Q0 -21 22 -14Q0 -8 -22 -14Z" fill="var(--color-yellow)" />
    <path d="M24 -14l7-4" {...INK} />
    <path d="M-14 6L-18 20M14 6L18 20" {...INK} />
    <g className="al-flame">
      <F d="M-9 20q-5-7 1-11q0 4 3 3q-1-6 4-9q6 8 0 17Z" fill="var(--color-red)" />
      <F d="M3 20q-3-5 1-9q1 4 3 2q0-4 3-6q4 7-1 13Z" fill="var(--color-yellow)" />
    </g>
    <path d="M-28 22H28" {...INK} />
  </g>,
  // 5. Made into new aluminium: a fresh, shiny foil roll, ready to go again
  <g key="new">
    <F d="M-28 -12H18V4H-28Z" fill="var(--fill-foil)" />
    <F d="M-28 4L-36 20H10L18 4Z" fill="var(--fill-foil)" />
    <path d="M18 -12a5 8 0 0 1 0 16" {...INK} />
    <path d="M-20 -7H8M-26 12H2" {...THIN} />
    <path className="al-twinkle" d="M28 -24v10M23 -19h10M-30 -26v7M-33.5 -22.5h7" {...THIN} />
  </g>,
];

const angle = (k: number) => ((-90 + k * 72) * Math.PI) / 180;

/**
 * Sustainability "afterlife" loop (§8.8): five stops matching the five steps on the page
 * (feed, rinse, bin, melt, new aluminium), each with a small idle motion, on a ring of
 * arrows that turns slowly (`al-ring`). Same line weight as the site's other illustrations.
 */
export function AfterlifeLoop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 360" className={className} aria-hidden focusable="false">
      <circle cx={C} cy={C} r={R} {...THIN} strokeOpacity="0.45" />
      {/* The Silverpot foil spiral at the centre: round and round again */}
      <g
        className="al-ring"
        style={{ transformOrigin: `${C}px ${C}px`, animationDuration: '24s' }}
        opacity="0.35"
      >
        <circle cx={C} cy={C} r={SPIRAL.ring.r} {...THIN} />
        <path d={SPIRAL.spiral} {...THIN} />
        <circle cx={C} cy={C} r={SPIRAL.core.r} {...THIN} />
      </g>
      <g className="al-ring" style={{ transformOrigin: `${C}px ${C}px` }}>
        {Array.from({ length: 30 }, (_, i) => {
          const a = (i / 30) * Math.PI * 2;
          const x = C + R * Math.cos(a);
          const y = C + R * Math.sin(a);
          const deg = (a * 180) / Math.PI + 90;
          return (
            <path
              key={i}
              d="M-4 -5L3 0L-4 5"
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})`}
              {...INK}
            />
          );
        })}
      </g>
      {STOPS.map((stop, k) => {
        const x = C + R * Math.cos(angle(k));
        const y = C + R * Math.sin(angle(k));
        return (
          <g key={k} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1.2)`}>
            {/* Knocks the turning arrows out behind each stop */}
            <circle r="34" fill="var(--color-white)" />
            {stop}
          </g>
        );
      })}
    </svg>
  );
}
