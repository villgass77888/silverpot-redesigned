import { Ill, type IllProps } from './Ill';
import { spiralGeometry } from '@/components/brand/spiral';

/* Hero object 1: the lidded container, turned into a character (§2.6). */
export function ContainerLegs(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 220 200"
      {...p}
      shapes={[
        ['M38 70L182 70L170 130L50 130Z', 'foil'],
        ['M26 62H194V71H26Z', 'c'],
        ['M36 62L42 48H178L184 62Z', 'c'],
        ['M70 177C70 171 52 169 48 176C45 182 50 185 58 185L72 185C76 185 75 179 70 177Z', 'b'],
        ['M168 168C166 162 184 156 190 162C195 167 192 172 184 175L172 179C168 180 166 174 168 168Z', 'b'],
      ]}
      lines={['M82 130L68 160L71 176', 'M140 130L152 156L169 168']}
      thin={[
        'M62 78L66 122',
        'M86 78L88 124',
        'M110 78V126',
        'M134 78L132 124',
        'M158 78L154 122',
        'M90 40q6-8 0-16q-6-8 0-16',
        'M122 40q6-8 0-16q-6-8 0-16',
        'M12 142H34',
        'M6 154H28',
        'M18 130H30',
      ]}
    />
  );
}

/* The container deadlifting a biryani pot ("lifts more biryani than you'd think*"). */
export function ContainerDeadlift(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 220 230"
      {...p}
      shapes={[
        ['M62 34C78 2 142 2 158 34', 'c'],
        ['M56 38C56 30 164 30 164 38L154 70C150 84 70 84 66 70Z', 'a'],
        ['M50 132L170 132L160 192L60 192Z', 'foil'],
        ['M42 124H178V133H42Z', 'c'],
        ['M76 214C76 208 58 206 54 213C51 219 56 222 64 222L78 222C82 222 81 216 76 214Z', 'b'],
        ['M144 214C144 208 162 206 166 213C169 219 164 222 156 222L142 222C138 222 139 216 144 214Z', 'b'],
      ]}
      lines={['M76 128L64 80L58 74', 'M144 128L156 80L162 74', 'M84 192L78 213', 'M136 192L142 213']}
      thin={[
        'M72 22l2 3M92 14l1 3M112 12v3M132 14l-1 3M150 22l-2 3',
        'M98 0q5-6 0-12',
        'M122 0q5-6 0-12',
        'M74 140L78 184',
        'M96 140L98 186',
        'M120 140L120 186',
        'M144 140L142 184',
        'M184 108q4 8 0 11q-4-3 0-11',
        'M36 92l-10-4M38 104l-12 0',
      ]}
    />
  );
}

/* Shawarma in a foil wrap (foil category, wholesale). */
export function ShawarmaWrap(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 200 220"
      {...p}
      shapes={[
        ['M66 44L150 44L134 200C132 212 84 212 82 200Z', 'foil'],
        ['M62 44C62 24 154 24 154 44C154 60 62 60 62 44Z', 'a'],
        ['M76 40q8-14 18-2q8-14 18 0q8-14 18 0q6-10 14 2', 'b'],
      ]}
      thin={[
        'M72 76L104 92L80 112',
        'M146 84L120 100L140 124',
        'M88 150L114 136L124 160',
        'M92 186L108 176',
        'M70 60L148 60',
      ]}
    />
  );
}

/* Tray with a rice mound and steam squiggles (containers category). */
export function BiryaniTray(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 220 170"
      {...p}
      shapes={[
        ['M34 94L186 94L172 154L48 154Z', 'foil'],
        ['M42 92C60 40 160 40 178 92Z', 'a'],
        ['M120 64c10-14 32-12 30 3c-2 11-17 13-25 7l-11 9-5-5Z', 'b'],
        ['M24 88H196V97H24Z', 'c'],
      ]}
      thin={[
        'M64 80l4 2M78 70l4 1M92 78l3 2M100 62l4 1M140 82l3 2M158 76l4 2M84 86l4 1',
        'M70 104L74 146',
        'M94 104L96 148',
        'M120 104V148',
        'M146 104L144 146',
        'M80 34q7-8 0-16q-7-8 0-16',
        'M110 28q7-8 0-16q-7-8 0-16',
        'M140 34q7-8 0-16q-7-8 0-16',
      ]}
    />
  );
}

/* Kunafa on a round platter, with a cheese-pull slice (platters category, bakeries). */
export function KunafaTray(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 230 170"
      {...p}
      shapes={[
        ['M14 112C14 78 206 78 206 112C206 146 14 146 14 112Z', 'foil'],
        ['M36 106C36 84 184 84 184 106C184 128 36 128 36 106Z', 'a'],
        ['M150 64L204 30L216 52Z', 'a'],
      ]}
      lines={['M26 112C26 136 194 136 194 112']}
      thin={[
        'M56 100q6 4 12 0q6-4 12 0q6 4 12 0q6-4 12 0q6 4 12 0q6-4 12 0q6 4 12 0',
        'M60 112q6 4 12 0q6-4 12 0q6 4 12 0q6-4 12 0q6 4 12 0q6-4 12 0',
        'M156 86q8-10 2-20',
        'M168 84q10-14 6-26',
        'M178 88q8-12 10-28',
        'M84 92l2-3M120 90l2-3M140 98l2-3M100 118l2-3',
      ]}
    />
  );
}

/* A dallah (Arabic coffee pot) made of foil (About, local cue). */
export function DallahFoil(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 220 220"
      {...p}
      shapes={[
        ['M70 196L150 196L142 164L78 164Z', 'foil'],
        ['M80 164C58 132 90 112 92 90L128 90C130 112 162 132 140 164Z', 'foil'],
        ['M92 90L97 62L123 62L128 90Z', 'foil'],
        ['M96 62C96 44 124 44 124 62Z', 'a'],
        ['M82 130C56 120 40 98 28 72L36 68C50 94 66 108 88 116Z', 'foil'],
        ['M164 196L196 196L192 174L168 174Z', 'c'],
      ]}
      lines={['M110 44V32', 'M140 156C178 146 172 92 128 86']}
      thin={[
        'M90 110L104 124L94 140',
        'M126 104L114 118L130 134',
        'M100 176L112 186',
        'M128 172L120 184',
        'M110 32a4 4 0 1 0 0.1 0',
        'M172 168q4-6 0-12M186 168q4-6 0-12',
      ]}
    />
  );
}

/* Rider bag full of containers (cloud-kitchen segment, wholesale hero). */
export function DeliveryBag(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 240 210"
      {...p}
      shapes={[
        ['M52 68L82 50H178L148 68Z', 'foil'],
        ['M62 60L72 40H170L160 60Z', 'c'],
        ['M40 68H180V186H40Z', 'b'],
        ['M180 68L210 46V160L180 186Z', 'a'],
        ['M86 114a24 24 0 1 0 48 0a24 24 0 1 0 -48 0Z', 'c'],
      ]}
      lines={['M78 68C78 18 150 18 150 68']}
      thin={[
        'M70 50L74 40M96 50L98 40M122 50V40M148 50L146 40',
        'M110 92a22 22 0 1 0 0.1 0',
        'M110 104a10 10 0 1 0 0.1 0',
        'M14 120H32',
        'M6 134H28',
        'M16 148H30',
        'M40 92H62',
        'M158 92H180',
      ]}
    />
  );
}

/* Press stamping a container, with a stick-figure operator (About process). */
export function PressMachine(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 240 200"
      {...p}
      shapes={[
        ['M44 16H176V40H44Z', 'a'],
        ['M94 40V74H126V40Z', 'foil'],
        ['M78 74H142L136 94H84Z', 'foil'],
        ['M84 140H136L130 162H90Z', 'foil'],
        ['M36 168H184V184H36Z', 'b'],
        ['M196 112a10 10 0 1 0 0.1 0Z', 'c'],
        ['M184 104C186 90 208 90 210 104Z', 'a'],
      ]}
      lines={[
        'M58 40V168',
        'M162 40V168',
        'M196 122V150',
        'M196 128L178 112L170 118',
        'M196 150L186 178',
        'M196 150L206 178',
      ]}
      thin={[
        'M64 112L46 104',
        'M156 112L174 104',
        'M66 124H46',
        'M154 124H174',
        'M96 140L100 162M120 140L118 162',
        'M100 104v6M110 102v8M120 104v6',
      ]}
    />
  );
}

/* Foil ball → bin → melt → new container, as a loop (Sustainability). */
export function RecycleLoop(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 320 320"
      {...p}
      shapes={[
        ['M142 50L152 34L170 36L182 48L178 66L162 74L146 68Z', 'foil'],
        ['M250 150H290L286 198H254Z', 'a'],
        ['M244 142H296V151H244Z', 'c'],
        ['M130 252H190L182 290H138Z', 'b'],
        ['M134 254q26-16 52 0Z', 'a'],
        ['M22 152H78L71 180H29Z', 'foil'],
        ['M16 146H84V153H16Z', 'c'],
      ]}
      lines={[
        'M201 58A110 110 0 0 1 262 119',
        'M262 119l1.4-9.9M262 119l-7.9-6.2',
        'M262 201A110 110 0 0 1 201 262',
        'M201 262l9.9 1.4M201 262l6.2-7.9',
        'M119 262A110 110 0 0 1 58 201',
        'M58 201l-1.4 9.9M58 201l7.9 6.2',
        'M58 119A110 110 0 0 1 119 58',
        'M119 58l-9.9-1.4M119 58l-6.2 7.9',
      ]}
      thin={[
        'M152 34L158 52L146 68',
        'M170 36L162 54L178 66',
        'M262 162L264 188M278 162L276 188',
        'M146 300q4-8 0-14M160 302q4-8 0-14M174 300q4-8 0-14',
        'M36 158L38 176M50 158V178M64 158L62 176',
        'M90 132l6-6M96 142h8M86 124v-8',
      ]}
    />
  );
}

/* Loose red scribble (photo-coming-soon cards, 404). */
export function ScribbleRed({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 120" className={className} aria-hidden focusable="false">
      <path
        d="M10 70C30 20 52 18 48 52S30 104 64 78S108 16 118 50S100 112 140 84S190 20 196 54S176 108 214 80S236 40 230 30"
        fill="none"
        stroke="var(--color-red)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ink-wobble"
      />
    </svg>
  );
}

/* A foil roll in 3/4 view, unspooling (PhotoComingSoon for foil). */
export function FoilRollIll(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 240 170"
      {...p}
      shapes={[
        ['M54 112H170L214 156H98Z', 'foil'],
        ['M40 46H182A16 34 0 0 1 182 114H40Z', 'foil'],
        ['M40 46A16 34 0 0 0 40 114A16 34 0 0 0 40 46Z', 'c'],
      ]}
      lines={['M182 46A16 34 0 0 1 182 114']}
      thin={[
        'M40 70a5 10 0 1 0 0.1 0',
        'M70 52V108',
        'M120 52V108',
        'M150 52V108',
        'M110 130L150 134L130 146',
      ]}
    />
  );
}

/* Container seen from above with 1/2/3 compartments (filter chips, brand icons). */
export function CompIcon({ n, className }: { n: 1 | 2 | 3; className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden focusable="false">
      <rect x="2" y="2" width="28" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      {n === 2 && <path d="M16 3V21" stroke="currentColor" strokeWidth="2" />}
      {n === 3 && <path d="M18 3V21M18 12H29" stroke="currentColor" strokeWidth="2" />}
    </svg>
  );
}

/* Illustrated map card: stylised coastline + a pin wearing Crinkle's shoes (Contact map facade). */
export function MapIll(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 400 260"
      {...p}
      shapes={[
        ['M0 0H400V70C340 86 300 60 250 82C200 104 170 80 120 98C80 112 40 100 0 118Z', 'c'],
        ['M196 96C196 70 236 70 236 96C236 118 216 136 216 150C216 136 196 118 196 96Z', 'b'],
        ['M204 168C204 162 188 161 185 167C183 172 187 175 194 175H206C209 175 209 170 204 168Z', 'b'],
        ['M228 168C228 162 244 161 247 167C249 172 245 175 238 175H226C223 175 223 170 228 168Z', 'b'],
      ]}
      lines={['M206 150L204 166', 'M226 150L228 166']}
      thin={[
        'M216 96a8 8 0 1 0 0.1 0',
        'M40 160H360M40 200H360M100 130V240M180 140V240M280 120V240M330 110V240',
        'M150 40q10-6 20 0t20 0M260 30q10-6 20 0t20 0M60 40q10-6 20 0t20 0',
      ]}
    />
  );
}

/* Clipboard with a checklist and a container sketch (size finder teaser, mega menu). */
export function ClipboardIll(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 180 200"
      {...p}
      shapes={[
        ['M30 26H150V190H30Z', 'c'],
        ['M66 14H114V36H66Z', 'a'],
        ['M52 140H128L122 168H58Z', 'foil'],
        ['M46 134H134V142H46Z', 'c'],
      ]}
      lines={['M50 60l6 6l12-12', 'M50 92l6 6l12-12']}
      thin={[
        'M78 62H130',
        'M78 94H122',
        'M50 120H90',
        'M66 150L68 162M90 150V164M114 150L112 162',
        'M160 120l14-26l6 4l-14 26l-8 4Z',
      ]}
    />
  );
}

/* Foil-roll mark for loaders. */
export function SpiralMark({ className }: { className?: string }) {
  const g = spiralGeometry(50, 50, 50);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <g fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r={g.ring.r} strokeWidth={g.ring.width} />
        <path d={g.spiral} strokeWidth={g.spiralWidth} strokeLinecap="round" />
        <circle cx="50" cy="50" r={g.core.r} strokeWidth={g.core.width} />
      </g>
    </svg>
  );
}
