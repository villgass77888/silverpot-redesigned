'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { track as trackEvent } from '@/lib/analytics';

export type CrinklePose =
  'perched' | 'wave' | 'deadpan' | 'hard-hat' | 'clipboard' | 'sleeping' | 'peek' | 'flattened' | 'thumbs-up';

type Props = {
  pose?: CrinklePose;
  /** Pupils follow the pointer (desktop) or scroll direction (touch). Hero + 404 only (§4.3-9). */
  track?: boolean;
  /** Persistent speech bubble. */
  speech?: string;
  /** Where the bubble sits: above towards end/start, or beside him (`side`, used in the hero). */
  speechSide?: 'start' | 'end' | 'side';
  className?: string;
  /** Decorative by default; pass a label when Crinkle carries meaning. */
  label?: string;
  /** White die-cut edge for blue/red backgrounds, where blue ink would vanish. */
  halo?: boolean;
  /** Clicks (within 1.4 s) before he says a line. The hero uses 1. */
  talkOn?: number;
};

/* Lumpy, faceted foil ball (straight segments read as crumples). */
const BODY =
  'M132 72L122.6 91.9L115.5 111.4L94.2 115.7L75.6 122.8L56 113.6L36.6 102.4L35 81.6L29.1 61.2L41.5 45L53.5 26.1L75.8 24.2L97.8 23.1L112.5 39.5L127.3 52.9Z';
const CREASES = [
  'M53.5 26.1L58 38L46 46',
  'M97.8 23.1L92 35L104 43',
  'M36.6 102.4L51 95L57 104',
  'M115.5 111.4L105 99L117 88',
  'M75.6 122.8L80 108L71 99',
  'M132 72L121 69',
  'M29.1 61.2L39 66',
];
/** Size of the `crinkle.lines` bank in messages (keys "1"…"6"). */
const LINE_COUNT = 6;

const FLAT_BODY = 'M8 50L40 41L80 46L121 39L160 45L192 50L185 63L150 67L111 62L70 68L28 63Z';
const FLAT_CREASES = ['M40 41L46 53L36 62', 'M121 39L128 51L120 61', 'M80 46L86 58', 'M160 45L156 56L166 63'];

const EYES = [
  { cx: 62, cy: 64 },
  { cx: 96, cy: 62 },
];
const ER = 12.5;

/** How far the eyelid comes down, by pose (0 = to the eye's centre line; negative = more open). */
const LID: Record<CrinklePose, number> = {
  deadpan: 0,
  perched: -2,
  wave: -4,
  'hard-hat': -1,
  clipboard: 2,
  sleeping: 0,
  peek: -3,
  flattened: 0,
  'thumbs-up': -5,
};

const VIEWBOX: Record<CrinklePose, string> = {
  deadpan: '0 0 160 172',
  perched: '0 0 160 180',
  wave: '0 0 172 172',
  'hard-hat': '0 -14 160 186',
  clipboard: '0 0 160 172',
  sleeping: '0 0 172 172',
  peek: '0 6 160 80',
  flattened: '0 24 200 64',
  'thumbs-up': '0 0 166 172',
};

function lidPath(cx: number, cy: number, r: number, d: number) {
  // Area of the eye circle above the chord at y = cy + d
  const half = Math.sqrt(Math.max(0, r * r - d * d));
  const y = cy + d;
  const large = d > 0 ? 1 : 0;
  return `M${(cx - half).toFixed(2)} ${y}A${r} ${r} 0 ${large} 1 ${(cx + half).toFixed(2)} ${y}Z`;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export function Crinkle({
  pose = 'deadpan',
  track = false,
  speech,
  speechSide = 'end',
  className,
  label,
  halo,
  talkOn = 3,
}: Props) {
  const t = useTranslations('crinkle');
  const svgRef = useRef<SVGSVGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const [blink, setBlink] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const clicks = useRef<number[]>([]);
  const reduced = useReducedMotion();
  const flat = pose === 'flattened';
  const closed = pose === 'sleeping';

  // Random blink every 4–7 s.
  useEffect(() => {
    if (reduced || closed) return;
    let timer: ReturnType<typeof setTimeout>;
    let inner: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(
        () => {
          setBlink(true);
          inner = setTimeout(() => setBlink(false), 140);
          loop();
        },
        4000 + Math.random() * 3000,
      );
    };
    loop();
    return () => {
      clearTimeout(timer);
      clearTimeout(inner);
    };
  }, [reduced, closed]);

  // Pupil tracking: pointer on fine pointers, scroll direction on touch. Off-screen → no listeners.
  useEffect(() => {
    if (!track || reduced || closed) return;
    const svg = svgRef.current;
    const pupils = pupilsRef.current;
    if (!svg || !pupils) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    let raf = 0;
    let lastY = window.scrollY;
    let target = { x: 0, y: 0 };
    const apply = () => {
      raf = 0;
      pupils.style.transform = `translate(${target.x.toFixed(2)}px, ${target.y.toFixed(2)}px)`;
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      const ex = box.left + box.width * 0.5;
      const ey = box.top + box.height * 0.38;
      const dx = e.clientX - ex;
      const dy = e.clientY - ey;
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 240) * 3.4;
      target = { x: (dx / dist) * k, y: (dy / dist) * k };
      queue();
    };
    const onScroll = () => {
      const y = window.scrollY;
      const dir = Math.sign(y - lastY);
      lastY = y;
      target = { x: 0, y: dir * 3 };
      queue();
    };
    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      if (fine) window.addEventListener('pointermove', onMove, { passive: true });
      else window.addEventListener('scroll', onScroll, { passive: true });
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? attach() : detach()));
    io.observe(svg);
    return () => {
      io.disconnect();
      detach();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [track, reduced, closed]);

  // `talkOn` clicks → a random line from the line bank.
  // Hop: the root (hit area) stays put and only the inner SVG moves, so hovering his edge
  // can't flicker on/off. Mouse: once per enter, played to the end. Tap/click: every time.
  const hop = (root: HTMLElement, restart: boolean) => {
    if (!root.classList.contains('crinkle-hop')) return;
    if (root.dataset.hop !== undefined && !restart) return;
    delete root.dataset.hop;
    void root.offsetWidth;
    root.dataset.hop = '';
  };
  const onClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    hop(e.currentTarget, true);
    const now = Date.now();
    clicks.current = [...clicks.current.filter((c) => now - c < 1400), now];
    if (clicks.current.length >= talkOn) {
      clicks.current = [];
      setBubble(t(`lines.${1 + Math.floor(Math.random() * LINE_COUNT)}` as 'lines.1'));
      trackEvent('crinkle_click');
      setTimeout(() => setBubble(null), 3200);
    }
  };

  const shownSpeech = bubble ?? speech;
  const lid = LID[pose];
  const eyes = flat
    ? [
        { cx: 82, cy: 52 },
        { cx: 114, cy: 51 },
      ]
    : EYES;
  const er = flat ? 8.5 : ER;

  return (
    <span
      className={cn('relative inline-block select-none', className)}
      onClick={onClick}
      onPointerEnter={(e) => e.pointerType === 'mouse' && hop(e.currentTarget, false)}
      onAnimationEnd={(e) => {
        if (e.animationName === 'sp-hop') delete e.currentTarget.dataset.hop;
      }}
    >
      {shownSpeech && (
        <span
          className={cn(
            'absolute bottom-[88%] z-10 w-max max-w-[min(15rem,58vw)] rounded-[18px] border-2 border-blue bg-white px-3 py-2 type-hand text-[1.05rem] leading-tight text-blue',
            speechSide === 'side'
              ? 'start-[96%] top-[4%] bottom-auto'
              : speechSide === 'end'
                ? 'start-[62%]'
                : 'end-[62%]',
          )}
          style={{ animation: 'sp-stamp-down 260ms var(--ease-stamp) both' }}
          role={bubble ? 'status' : undefined}
        >
          {shownSpeech}
          <svg
            aria-hidden
            viewBox="0 0 20 14"
            className={cn(
              'absolute h-[14px] w-5',
              speechSide === 'side'
                ? '-start-[15px] top-3 rotate-90'
                : speechSide === 'end'
                  ? 'start-4 -bottom-[12px]'
                  : 'end-4 -bottom-[12px] -scale-x-100',
            )}
          >
            <path
              d="M2 0 L4 13 L16 0"
              fill="#fff"
              stroke="var(--color-blue)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M3 -1 L16 -1" stroke="#fff" strokeWidth="3" />
          </svg>
        </span>
      )}
      <svg
        ref={svgRef}
        viewBox={VIEWBOX[pose]}
        className="block h-auto w-full overflow-visible"
        {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
        focusable="false"
      >
        {pose === 'peek' && (
          <defs>
            <clipPath id="crinkle-peek-clip">
              <rect x="-10" y="0" width="180" height="80" />
            </clipPath>
          </defs>
        )}

        {halo && (
          <g fill="#fff" stroke="#fff" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
            <path d={flat ? FLAT_BODY : BODY} />
            {pose === 'hard-hat' && <path d="M40 30C42 -4 118 -4 120 30Z M30 31H130" />}
          </g>
        )}
        {/* White die-cut under the legs and shoes so they read on blue (perched on the wordmark) */}
        {!flat && pose !== 'peek' && (
          <g fill="#fff" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            <g className="crinkle-legs">
              <Shoes pose={pose} />
            </g>
          </g>
        )}
        {/* ── fills (misregistered 3px) ── */}
        <g transform="translate(3 3)" clipPath={pose === 'peek' ? 'url(#crinkle-peek-clip)' : undefined}>
          <path d={flat ? FLAT_BODY : BODY} fill="var(--fill-foil)" />
          {!flat && pose !== 'peek' && (
            <g className="crinkle-legs">
              <Shoes pose={pose} fill />
            </g>
          )}
          {flat && <FlatShoes fill />}
          {pose === 'hard-hat' && <path d="M40 30C42 -4 118 -4 120 30Z" fill="var(--color-yellow)" />}
          {pose === 'clipboard' && (
            <rect x="100" y="88" width="36" height="44" rx="3" transform="rotate(-8 118 110)" fill="#fff" />
          )}
        </g>

        {/* ── ink ── */}
        <g
          fill="none"
          stroke="var(--color-blue)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath={pose === 'peek' ? 'url(#crinkle-peek-clip)' : undefined}
        >
          <path d={flat ? FLAT_BODY : BODY} />
          {(flat ? FLAT_CREASES : CREASES).map((d) => (
            <path key={d} d={d} strokeWidth="1.6" />
          ))}
          {!flat && pose !== 'peek' && (
            <g className="crinkle-legs">
              <Shoes pose={pose} />
            </g>
          )}
          {flat && <FlatShoes />}
          <Arms pose={pose} />
          {pose === 'hard-hat' && (
            <>
              <path d="M40 30C42 -4 118 -4 120 30Z" />
              <path d="M30 31H130" strokeWidth="5" />
              <path d="M80 2V28M64 6L66 28M96 6L94 28" strokeWidth="1.6" />
            </>
          )}
          {pose === 'clipboard' && (
            <g transform="rotate(-8 118 110)">
              <rect x="100" y="88" width="36" height="44" rx="3" fill="#fff" />
              <rect x="111" y="84" width="14" height="7" rx="2" fill="var(--color-yellow)" />
              <path d="M106 100H130M106 108H126M106 116H129M106 124H120" strokeWidth="1.5" />
            </g>
          )}
        </g>
        {pose === 'peek' && (
          <g stroke="var(--color-blue)" strokeWidth="2.5" strokeLinecap="round" fill="var(--fill-foil)">
            <path d="M0 80H160" fill="none" />
            <path d="M38 80c0-7 4-9 7-9s4 3 4 6c1-4 3-5 5-5 3 0 4 3 4 8" />
            <path d="M104 80c0-7 4-9 7-9s4 3 4 6c1-4 3-5 5-5 3 0 4 3 4 8" />
          </g>
        )}

        {/* ── eyes ── */}
        {closed ? (
          <g fill="none" stroke="var(--color-blue)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M50 66Q62 74 74 66" />
            <path d="M84 64Q96 72 108 64" />
            <text
              x="128"
              y="34"
              fill="var(--color-blue)"
              stroke="none"
              fontFamily="var(--font-hand)"
              fontSize="20"
            >
              z
            </text>
            <text
              x="144"
              y="18"
              fill="var(--color-blue)"
              stroke="none"
              fontFamily="var(--font-hand)"
              fontSize="14"
            >
              z
            </text>
          </g>
        ) : (
          <g>
            {eyes.map((e) =>
              flat ? (
                <ellipse
                  key={e.cx}
                  cx={e.cx}
                  cy={e.cy}
                  rx={er}
                  ry={er * 0.62}
                  fill="#fff"
                  stroke="var(--color-blue)"
                  strokeWidth="2.2"
                />
              ) : (
                <circle
                  key={e.cx}
                  cx={e.cx}
                  cy={e.cy}
                  r={er}
                  fill="#fff"
                  stroke="var(--color-blue)"
                  strokeWidth="2.2"
                />
              ),
            )}
            <g ref={pupilsRef} style={{ transition: 'transform 140ms var(--ease-out-quint)' }}>
              {eyes.map((e) => (
                <circle key={e.cx} cx={e.cx} cy={e.cy + (flat ? 1 : 3.2)} r={flat ? 3.4 : 4.6} fill="#000" />
              ))}
            </g>
            <g
              style={{
                transformBox: 'fill-box',
                transformOrigin: '50% 0%',
                transform: blink ? `scaleY(${flat ? 1.9 : 2.05})` : 'none',
                transition: 'transform 70ms linear',
              }}
            >
              {eyes.map((e) =>
                flat ? (
                  <path
                    key={e.cx}
                    d={`M${e.cx - er} ${e.cy}A${er} ${er * 0.62} 0 0 1 ${e.cx + er} ${e.cy}Z`}
                    fill="var(--fill-foil)"
                    stroke="var(--color-blue)"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    key={e.cx}
                    d={lidPath(e.cx, e.cy, er + 0.6, lid)}
                    fill="var(--fill-foil)"
                    stroke="var(--color-blue)"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                ),
              )}
            </g>
          </g>
        )}
      </svg>
    </span>
  );
}

function legPaths(pose: CrinklePose) {
  return pose === 'perched' ? ['M70 118L67 160', 'M90 118L94 160'] : ['M70 120L66 150', 'M90 120L94 150'];
}

function Shoes({ pose, fill }: { pose: CrinklePose; fill?: boolean }) {
  const perched = pose === 'perched';
  const legY = perched ? 160 : 150;
  const legs = legPaths(pose);
  const dy = legY - 150;
  const left = `M70 ${150 + dy}C70 ${144 + dy} 50 ${143 + dy} 45 ${149 + dy}C41 ${155 + dy} 45 ${160 + dy} 54 ${160 + dy}L70 ${160 + dy}C74 ${160 + dy} 74 ${152 + dy} 70 ${150 + dy}Z`;
  const right = `M90 ${150 + dy}C90 ${144 + dy} 110 ${143 + dy} 115 ${149 + dy}C119 ${155 + dy} 115 ${160 + dy} 106 ${160 + dy}L90 ${160 + dy}C86 ${160 + dy} 86 ${152 + dy} 90 ${150 + dy}Z`;
  if (fill)
    return (
      <>
        <path d={left} fill="var(--color-red)" />
        <path d={right} fill="var(--color-red)" />
      </>
    );
  return (
    <>
      {legs.map((d) => (
        <path key={d} d={d} />
      ))}
      <path d={left} />
      <path d={right} />
      <path d={`M56 ${152 + dy}l4 3M104 ${152 + dy}l-4 3`} strokeWidth="1.6" />
    </>
  );
}

function FlatShoes({ fill }: { fill?: boolean }) {
  const l = 'M14 60C10 54 2 56 2 62C2 68 10 70 16 66Z';
  const r = 'M186 58C190 52 198 54 198 60C198 66 190 68 184 64Z';
  if (fill)
    return (
      <>
        <path d={l} fill="var(--color-red)" />
        <path d={r} fill="var(--color-red)" />
      </>
    );
  return (
    <>
      <path d={l} />
      <path d={r} />
    </>
  );
}

function Arms({ pose }: { pose: CrinklePose }) {
  switch (pose) {
    case 'wave':
      return (
        <>
          <path d="M123 84L143 58" />
          <circle cx="146" cy="53" r="6" fill="#fff" />
          <path d="M156 40q7 7 0 15M162 34q10 11 0 25" strokeWidth="1.8" />
          <path d="M37 96L28 112" />
        </>
      );
    case 'thumbs-up':
      return (
        <>
          <path d="M123 90L140 78" />
          <rect x="136" y="66" width="14" height="14" rx="4" fill="#fff" />
          <path d="M146 66V55" strokeWidth="4" />
          <path d="M37 96L28 112" />
        </>
      );
    case 'clipboard':
      return (
        <>
          <path d="M121 96L112 104" />
          <path d="M38 98L52 112L100 116" />
        </>
      );
    case 'hard-hat':
    case 'perched':
      return (
        <>
          <path d="M123 90L136 104" />
          <path d="M37 92L24 106" />
        </>
      );
    default:
      return null;
  }
}
