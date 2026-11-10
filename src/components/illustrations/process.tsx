import type { CSSProperties, ReactNode } from 'react';
import { FILLS, Ill, type IllProps, type Shape } from './Ill';
import { spiralGeometry } from '@/components/brand/spiral';

/*
 * Coil-to-container frames for the About story (§4.3-10, §7.7, §8.8). viewBox 0 0 240 180.
 * Static parts go through <Ill>; moving parts are <Part>s. A Part animates its fill and its
 * ink as two separate groups, so the 3.5px misregistered fill keeps its offset while the part
 * turns or moves. Motion lives in globals.css (`pf-*`); reduced motion shows the end state.
 */

const INK = {
  fill: 'none',
  stroke: 'var(--ink)',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function Part({
  shapes = [],
  lines = [],
  thin = [],
  className,
  style,
  children,
}: {
  shapes?: readonly Shape[];
  lines?: readonly string[];
  thin?: readonly string[];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <g>
      <g transform="translate(3.5 3.5)">
        <g className={className} style={style}>
          {shapes.map(([d, f], i) => (f ? <path key={i} d={d} fill={FILLS[f]} /> : null))}
        </g>
      </g>
      <g className={className} style={style} {...INK}>
        {shapes.map(([d], i) => (
          <path key={`s${i}`} d={d} vectorEffect="non-scaling-stroke" />
        ))}
        {lines.map((d, i) => (
          <path key={`l${i}`} d={d} vectorEffect="non-scaling-stroke" />
        ))}
        {thin.map((d, i) => (
          <path key={`t${i}`} d={d} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        ))}
        {children}
      </g>
    </g>
  );
}

/** A circle path centred on (cx, cy). */
const ring = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 -${r * 2} 0`;
const at = (x: number, y: number, extra?: CSSProperties): CSSProperties => ({
  transformOrigin: `${x}px ${y}px`,
  ...extra,
});

/** 1. Coil: the heavy coil turns slowly on its cradle. */
export function CoilFrame(p: IllProps) {
  const g = spiralGeometry(110, 92, 62);
  return (
    <Ill viewBox="0 0 240 180" {...p} shapes={[['M60 158H160L150 172H70Z', 'b']]} lines={['M20 172H220']}>
      <Part
        className="pf-spin"
        style={at(110, 92, { animationDuration: '8s' })}
        shapes={[[ring(110, 92, 62), 'foil']]}
        lines={[g.spiral, ring(110, 92, g.core.r)]}
      />
      <Part className="pf-flicker" thin={['M190 40l14-8M196 56h16M188 24l8-12']} />
    </Ill>
  );
}

/** 2. Feed: the coil unwinds, the rollers turn, the sheet runs right into the press. */
export function FeedFrame(p: IllProps) {
  const g = spiralGeometry(54, 80, 36);
  return (
    <Ill
      viewBox="0 0 240 180"
      {...p}
      shapes={[
        ['M54 114H226V124H54Z', 'foil'],
        ['M150 64H226V108H150Z', 'a'],
      ]}
      lines={['M20 160H226']}
    >
      <Part
        className="pf-spin"
        style={at(54, 80, { animationDuration: '3.2s' })}
        shapes={[[ring(54, 80, 36), 'foil']]}
        lines={[g.spiral]}
      />
      <Part
        className="pf-spin pf-rev"
        style={at(120, 106, { animationDuration: '1s' })}
        shapes={[[ring(120, 106, 8), 'c']]}
        thin={['M114 106h12M120 100v12']}
      />
      <Part
        className="pf-spin"
        style={at(120, 132, { animationDuration: '1s' })}
        shapes={[[ring(120, 132, 8), 'c']]}
        thin={['M114 132h12M120 126v12']}
      />
      <path d="M60 119H146" {...INK} strokeWidth="1.6" strokeDasharray="6 10" className="pf-belt" />
      <Part className="pf-drift" thin={['M76 144H96M84 152H104M156 144H176']} />
    </Ill>
  );
}

/** 3. Press: a flat sheet sits on the die, the ram strikes, a container is formed and slides out. */
export function PressFrame(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 240 180"
      {...p}
      shapes={[
        ['M40 10H200V24H40Z', 'foil'],
        ['M40 150H200V164H40Z', 'b'],
      ]}
      lines={['M54 24V150M186 24V150', 'M120 24V74']}
    >
      <Part className="pf-sheet" shapes={[['M70 140H170V146H70Z', 'foil']]} />
      <Part
        className="pf-formed"
        shapes={[['M78 122H162L154 150H86Z', 'foil']]}
        thin={['M100 128L102 144M120 128V144M140 128L138 144']}
      />
      <Part
        className="pf-ram"
        shapes={[
          ['M62 30H178V56H62Z', 'a'],
          ['M86 56H154L146 80H94Z', 'foil'],
        ]}
      />
      <Part className="pf-spark" thin={['M66 132l-16-8', 'M174 132l16-8', 'M62 144H44', 'M178 144H196']} />
    </Ill>
  );
}

/** 4. Trim and rim: a rim roller runs along the edge; the ragged excess curls off behind it. */
export function TrimFrame(p: IllProps) {
  const teeth = Array.from({ length: 8 }, (_, k) => 50 + k * 18);
  return (
    <Ill
      viewBox="0 0 240 180"
      {...p}
      shapes={[
        ['M56 76H184L172 142H68Z', 'foil'],
        ['M46 66H194Q202 72 194 80H46Q38 72 46 66Z', 'c'],
      ]}
      thin={['M80 88L84 132M104 88L106 134M128 88V134M152 88L150 132']}
    >
      {teeth.map((x, k) => (
        <Part
          key={x}
          className="pf-tooth"
          style={at(x + 9, 62, { animationDelay: `${0.1 + k * 0.166}s` })}
          thin={[`M${x} 66l4.5-7l4.5 7l4.5-7l4.5 7`]}
        />
      ))}
      <g className="pf-roll">
        <Part
          className="pf-spin"
          style={at(38, 55, { animationDuration: '0.6s' })}
          shapes={[[ring(38, 55, 10), 'a']]}
          thin={['M31 55h14M38 48v14']}
        />
      </g>
    </Ill>
  );
}

/** 5. Check and count: containers drop onto the stack one by one, the tally keeps up, then a tick. */
export function StackFrame(p: IllProps) {
  const nested = [1, 2, 3];
  return (
    <Ill
      viewBox="0 0 240 180"
      {...p}
      shapes={[
        ['M66 80L174 80L164 160H76Z', 'foil'],
        ['M54 72H186V82H54Z', 'c'],
      ]}
      thin={['M92 96L94 148M120 96V150M148 96L146 148']}
      lines={['M20 166H220']}
    >
      {nested.map((j) => (
        <Part
          key={j}
          className={`pf-st pf-st-${j}`}
          shapes={[[`M54 ${72 - 12 * j}H186V${82 - 12 * j}H54Z`, 'c']]}
          thin={[`M66 ${82 - 12 * j}L67 ${84 - 12 * (j - 1)}M174 ${82 - 12 * j}L173 ${84 - 12 * (j - 1)}`]}
        />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <Part key={k} className={`pf-st pf-st-${k}`} thin={[`M${18 + k * 8} 120V146`]} />
      ))}
      <Part className="pf-st pf-st-4" thin={['M12 142L50 122']} />
      <Part className="pf-st pf-st-4" lines={['M198 26l8 14l18-28']} />
    </Ill>
  );
}

/** 6. Pack and ship: the sealed carton hops along on its way out, speed lines streaming past. */
export function ShipFrame(p: IllProps) {
  return (
    <Ill viewBox="0 0 240 180" {...p} lines={['M20 166H220']}>
      <Part
        className="pf-hop"
        style={at(124, 158)}
        shapes={[
          ['M50 64H170V158H50Z', 'a'],
          ['M170 64L198 42V136L170 158Z', 'c'],
          ['M50 64L78 42H198L170 64Z', 'c'],
          ['M66 112H124V142H66Z', 'c'],
        ]}
        lines={['M110 64V158', 'M84 42L106 64']}
        thin={[
          'M72 118v18M78 118v18M82 118v18M90 118v18M94 118v18M100 118v18M106 118v18M112 118v18M116 118v18',
        ]}
      />
      <Part className="pf-stream" thin={['M14 100H36M6 116H32M18 132H38']} />
    </Ill>
  );
}

export const PROCESS_FRAMES = [CoilFrame, FeedFrame, PressFrame, TrimFrame, StackFrame, ShipFrame] as const;
