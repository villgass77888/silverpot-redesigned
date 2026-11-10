'use client';

import { useRef, useState } from 'react';
import { Crinkle } from '../brand/Crinkle';

const INK = {
  fill: 'none',
  stroke: 'var(--ink)',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Fill offset 3.5px under the ink, risograph style. */
function Shape({
  d,
  fill,
  className,
  style,
}: {
  d: string;
  fill: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <g className={className} style={style}>
      <path d={d} fill={fill} transform="translate(3.5 3.5)" />
      <path d={d} {...INK} />
    </g>
  );
}

/**
 * About hero press line (§8.8): coil feeds the press, the ram stamps a container out of
 * every stroke, and the containers ride the belt off to the right, all in CSS (`pl-*`).
 * Hovering (or tapping) the line makes Aloom explain what you're looking at.
 */
export function AboutHeroScene({ speech, label }: { speech: string; label: string }) {
  const [talking, setTalking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const say = (on: boolean) => {
    if (timer.current) clearTimeout(timer.current);
    setTalking(on);
  };

  return (
    <div
      className="about-press relative mx-auto w-full max-w-xl"
      onPointerEnter={(e) => e.pointerType === 'mouse' && say(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && say(false)}
      onClick={() => {
        say(true);
        timer.current = setTimeout(() => setTalking(false), 4000);
      }}
    >
      <svg
        viewBox="0 0 360 240"
        className="block h-auto w-full overflow-visible"
        aria-hidden
        focusable="false"
      >
        <path d="M0 228H360" {...INK} />

        {/* Coil, unwinding into the press */}
        <g className="pl-spin" style={{ transformOrigin: '34px 176px' }}>
          <Shape d="M12 176a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z" fill="var(--fill-foil)" />
          <path d="M34 176m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M34 154v6" {...INK} strokeWidth="1.6" />
        </g>
        <path d="M34 198H124" {...INK} />
        <path d="M40 194H120" {...INK} strokeWidth="1.6" strokeDasharray="5 9" className="pl-belt" />

        {/* Press frame */}
        <Shape d="M136 4H164V22H136Z" fill="var(--fill-foil)" />
        <Shape d="M80 22H220V46H80Z" fill="var(--color-yellow)" />
        <path d="M94 46V210M206 46V210" {...INK} />
        <Shape d="M84 210H216V222H84Z" fill="#fff" />

        {/* Ram + upper die */}
        <g className="pl-ram">
          <Shape d="M140 30H160V96H140Z" fill="var(--fill-foil)" />
          <Shape d="M116 96H184L176 116H124Z" fill="var(--fill-foil)" />
        </g>
        {/* Container forming under the die */}
        <Shape
          className="pl-squash"
          style={{ transformOrigin: '150px 210px' }}
          d="M124 186H176L170 210H130Z"
          fill="var(--color-yellow)"
        />
        <path
          className="pl-impact"
          d="M110 170l-14-6M190 170l14-6M108 184H92M192 184H208"
          {...INK}
          strokeWidth="1.6"
        />
        <path className="pl-steam" d="M144 0q-6-8 0-14q6-8 0-16M156 0q-6-8 0-14" {...INK} strokeWidth="1.6" />

        {/* Conveyor */}
        <Shape d="M212 204H352V214H212Z" fill="var(--fill-foil)" />
        <path d="M216 209H348" {...INK} strokeWidth="1.6" strokeDasharray="6 8" className="pl-belt" />
        {[222, 342].map((x) => (
          <g
            key={x}
            className="pl-spin"
            style={{ transformOrigin: `${x}px 221px`, animationDuration: '1.4s' }}
          >
            <path
              d={`M${x - 6} 221a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M${x - 4} 221h8`}
              {...INK}
              strokeWidth="1.8"
            />
          </g>
        ))}
        {/* Fresh containers riding off, one per stroke */}
        {[0, 1, 2].map((i) => (
          <g key={i} className="pl-ride" style={{ animationDelay: `${-i * 1.6}s` }}>
            <Shape d="M186 184H214L210 204H190Z" fill="var(--fill-foil)" />
            <path d="M184 184H216" {...INK} strokeWidth="1.8" />
          </g>
        ))}
      </svg>

      {/* Aloom supervising from the end of the line */}
      <div className="absolute -end-[2%] bottom-[2%] w-[26%]">
        <Crinkle
          pose="hard-hat"
          halo
          label={label}
          speech={talking ? speech : undefined}
          speechSide="start"
        />
      </div>
    </div>
  );
}

function gear(cx: number, cy: number, r: number, teeth: number) {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? r : r + 7;
    const b = a + Math.PI / (teeth * 2);
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`);
    pts.push(`${(cx + rr * Math.cos(b)).toFixed(1)} ${(cy + rr * Math.sin(b)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z M${cx - r * 0.35} ${cy}a${r * 0.35} ${r * 0.35} 0 1 0 ${r * 0.7} 0a${r * 0.35} ${r * 0.35} 0 1 0 -${r * 0.7} 0`;
}

/** Faint factory skyline behind the About hero: sawtooth roofs, smoking stacks, turning gears. */
export function FactorySkyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 240"
      preserveAspectRatio="xMinYMax slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      <g {...INK} strokeWidth="2" opacity="0.16">
        <path d="M0 240V150L60 110V150L120 110V150L180 110V150L240 110V150L300 110V240" />
        <path d="M330 240V120H420V240M350 120V60H372V120M390 120V80H408V120" />
        <path d="M450 240V160L520 130V160L590 130V160L660 130V240" />
        <path d="M0 196H660" strokeDasharray="10 12" />
        <g className="pl-spin" style={{ transformOrigin: '760px 170px', animationDuration: '14s' }}>
          <path d={gear(760, 170, 34, 9)} />
        </g>
        <g className="pl-spin pl-rev" style={{ transformOrigin: '818px 128px', animationDuration: '9s' }}>
          <path d={gear(818, 128, 22, 7)} />
        </g>
        {[
          [361, 50],
          [399, 70],
        ].map(([x, y], i) => (
          <g
            key={x}
            className="pl-smoke"
            style={{ animationDelay: `${i * 1.3}s`, transformOrigin: `${x}px ${y}px` }}
          >
            <path d={`M${x - 8} ${y - 6}a8 8 0 1 1 16 0a10 10 0 1 1 -16 0Z`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
