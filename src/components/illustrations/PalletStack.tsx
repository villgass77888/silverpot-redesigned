const INK = {
  fill: 'none',
  stroke: 'var(--ink)',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function F({ d, fill }: { d: string; fill: string }) {
  return (
    <>
      <path d={d} fill={fill} transform="translate(3.5 3.5)" />
      <path d={d} {...INK} />
    </>
  );
}

function Carton({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const cx = x + w / 2;
  return (
    <>
      <F d={`M${x} ${y}H${x + w}V${y + h}H${x}Z`} fill="var(--color-yellow)" />
      <path d={`M${cx} ${y}V${y + h * 0.32}`} {...INK} />
      <circle cx={x + w * 0.3} cy={y + h * 0.6} r="11" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
      <circle cx={x + w * 0.3} cy={y + h * 0.6} r="4.5" {...INK} stroke="var(--color-blue)" strokeWidth="2" />
      <path
        d={`M${x + w * 0.62} ${y + h * 0.72}v-14m-5 5l5-5l5 5M${x + w * 0.78} ${y + h * 0.72}v-14m-5 5l5-5l5 5`}
        {...INK}
        strokeWidth="1.8"
      />
    </>
  );
}

/**
 * Wholesale hero (§8.8): Silverpot cartons stacked on a pallet, a stack of foil
 * containers on top, and a "THU" delivery tag swinging off the corner, i.e. "By the carton.
 * By the pallet. By Thursday?" in one picture. Motion in CSS (`ps-*`).
 */
export function PalletStack({ day, className }: { day: string; className?: string }) {
  return (
    <svg viewBox="0 0 300 260" className={className} aria-hidden focusable="false">
      <path className="ps-speed" d="M6 170H30M0 190H26M10 210H34" {...INK} strokeWidth="2" />
      <path d="M20 250H286" {...INK} />
      <F d="M40 222H260V232H40Z" fill="var(--fill-foil)" />
      {[48, 139, 230].map((x) => (
        <F key={x} d={`M${x} 232H${x + 22}V246H${x}Z`} fill="var(--fill-foil)" />
      ))}
      <Carton x={44} y={150} w={104} h={72} />
      <Carton x={152} y={150} w={104} h={72} />
      <g className="ps-drop">
        <Carton x={96} y={82} w={108} h={68} />
        <g className="ps-bob">
          <F d="M120 62H180L175 82H125Z" fill="var(--fill-foil)" />
          <path d="M116 62H184M118 54H182M120 46H180" {...INK} />
          <path d="M136 68L137 78M150 68V78M164 68L163 78" {...INK} strokeWidth="1.6" />
        </g>
      </g>
      <g className="ps-tag" style={{ transformOrigin: '204px 92px' }}>
        <path d="M204 92L230 104" {...INK} strokeWidth="1.8" />
        <F d="M222 102H266V140H222Z" fill="#fff" />
        <path d="M222 102H266V112H222Z" fill="var(--color-red)" stroke="var(--ink)" strokeWidth="2.5" />
        <text
          x="244"
          y="133"
          textAnchor="middle"
          fill="var(--color-blue)"
          fontFamily="var(--font-display)"
          fontWeight="900"
          fontSize="18"
        >
          {day}
        </text>
      </g>
    </svg>
  );
}
