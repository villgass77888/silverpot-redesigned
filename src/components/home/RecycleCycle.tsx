'use client';

import { useEffect, useRef, useState } from 'react';
import { Arrow } from '../illustrations/arrows';

/* Clockwise from the foil ball at the top: arc i leads into station i + 1. */
const ARCS = [
  { d: 'M201 58A110 110 0 0 1 262 119', head: 'M262 119l1.4-9.9M262 119l-7.9-6.2' },
  { d: 'M262 201A110 110 0 0 1 201 262', head: 'M201 262l9.9 1.4M201 262l6.2-7.9' },
  { d: 'M119 262A110 110 0 0 1 58 201', head: 'M58 201l-1.4 9.9M58 201l7.9 6.2' },
  { d: 'M58 119A110 110 0 0 1 119 58', head: 'M119 58l-9.9-1.4M119 58l-6.2 7.9' },
];
const LOOP = 'M160 50A110 110 0 1 1 159.9 50';
const INK = {
  fill: 'none',
  stroke: '#fff',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/**
 * Recycling loop for the home "Use once" band (§8.5, §8.8: no disc; blue container and details). On scroll-in the foil ball stamps in,
 * the hand note grows out of it, then the circle draws itself clockwise and each stop pops
 * in as its arrow arrives. Afterwards a small foil ball keeps travelling round the loop.
 * No JS or reduced motion: the finished loop, static.
 */
export function RecycleCycle({ note }: { note: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useRef<SVGAnimateMotionElement>(null);
  const [state, setState] = useState<'' | 'armed' | 'play'>('');
  const [l1, ...rest] = note.split(/(?<=\.)\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setState('armed');
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setState('play');
        timer = setTimeout(() => {
          motion.current?.beginElement();
          el.dataset.loop = '';
        }, 2500);
      },
      { rootMargin: '0px 0px -25% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="recycle-cycle relative mx-auto w-full max-w-md"
      data-state={state || undefined}
      dir="ltr"
    >
      {/* Blue disc behind the loop */}
      <svg
        viewBox="0 0 320 320"
        className="relative block w-full overflow-visible"
        aria-hidden
        focusable="false"
      >
        <circle
          className="rc-track"
          cx="160"
          cy="160"
          r="110"
          fill="none"
          stroke="var(--color-blue)"
          strokeOpacity="0.55"
          strokeWidth="2.5"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />

        {ARCS.map((a, i) => (
          <g key={a.d} className="rc-arc" style={{ '--i': i } as React.CSSProperties} {...INK}>
            <path d={a.d} pathLength={100} strokeDasharray={100} />
            <path className="rc-head" d={a.head} />
          </g>
        ))}

        {/* Stops: fills misregistered 3.5px under white ink */}
        <g className="rc-stop rc-ball" style={{ '--i': 0 } as React.CSSProperties}>
          <g className="rc-bob">
            <path
              d="M142 50L152 34L170 36L182 48L178 66L162 74L146 68Z"
              fill="var(--fill-foil)"
              transform="translate(3.5 3.5)"
            />
            <g {...INK}>
              <path d="M142 50L152 34L170 36L182 48L178 66L162 74L146 68Z" />
              <path
                d="M152 34L158 52L146 68M170 36L162 54L178 66"
                stroke="var(--color-blue)"
                strokeWidth="2"
              />
            </g>
          </g>
        </g>
        <g className="rc-stop" style={{ '--i': 1 } as React.CSSProperties}>
          <path d="M250 150H290L286 198H254Z" fill="var(--color-blue)" transform="translate(3.5 3.5)" />
          <path d="M244 142H296V151H244Z" fill="#fff" transform="translate(3.5 3.5)" />
          <g {...INK}>
            <path d="M250 150H290L286 198H254Z M244 142H296V151H244Z" />
            <path d="M262 162L264 188M278 162L276 188" strokeWidth="1.6" />
          </g>
        </g>
        <g className="rc-stop" style={{ '--i': 2 } as React.CSSProperties}>
          <path d="M130 252H190L182 290H138Z" fill="var(--color-yellow)" transform="translate(3.5 3.5)" />
          <path d="M134 254q26-16 52 0Z" fill="var(--fill-foil)" transform="translate(3.5 3.5)" />
          <g {...INK}>
            <path d="M130 252H190L182 290H138Z M134 254q26-16 52 0" />
            <path
              d="M146 300q4-8 0-14M160 302q4-8 0-14M174 300q4-8 0-14"
              stroke="var(--color-blue)"
              strokeWidth="2.2"
            />
          </g>
        </g>
        <g className="rc-stop" style={{ '--i': 3 } as React.CSSProperties}>
          <path d="M22 152H78L71 180H29Z" fill="var(--fill-foil)" transform="translate(3.5 3.5)" />
          <path d="M16 146H84V153H16Z" fill="#fff" transform="translate(3.5 3.5)" />
          <g {...INK}>
            <path d="M22 152H78L71 180H29Z M16 146H84V153H16Z" />
            <path
              d="M36 158L38 176M50 158V178M64 158L62 176M90 132l6-6M96 142h8M86 124v-8"
              stroke="var(--color-blue)"
              strokeWidth="2"
            />
          </g>
        </g>

        {/* A small foil ball that keeps doing the rounds */}
        <g className="rc-traveler">
          <circle r="6.5" fill="var(--fill-foil)" stroke="var(--color-blue)" strokeWidth="2" />
          <animateMotion ref={motion} dur="7s" repeatCount="indefinite" begin="indefinite" path={LOOP} />
        </g>
      </svg>

      {/* Hand note, growing out of the ball: line 1 "Not trash.", line 2 "Pre-recycled." */}
      <div className="rc-note pointer-events-none absolute start-[57%] -top-7 flex items-start gap-1 text-yellow md:-top-9">
        <Arrow kind="curve-down-left" className="rc-note-arrow mt-4 w-10 shrink-0 md:w-12" />
        <p
          className="-rotate-[6deg] type-hand text-[1.15rem] leading-tight whitespace-nowrap md:text-[1.4rem]"
          dir="auto"
        >
          <span className="block">{l1}</span>
          {rest.length > 0 && <span className="block ps-3">{rest.join(' ')}</span>}
        </p>
      </div>
    </div>
  );
}
