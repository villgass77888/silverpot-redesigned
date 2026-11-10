import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { LOGO } from '@/components/brand/logo-data';

/**
 * Open Graph images (§11.6), 1200×630, fonts from local TTFs (src/assets/fonts).
 * Text is set in English for both locales: the OG renderer has no Arabic shaping,
 * and model codes read the same in both (see docs/DECISIONS.md).
 */
export const OG_SIZE = { width: 1200, height: 630 };
const BLUE = '#0E2A8C';
const YELLOW = '#FFD21F';
const RED = '#B8322A';
const FOIL = '#E9ECF1';

const font = (f: string) => readFile(path.join(process.cwd(), 'src', 'assets', 'fonts', f));
async function fonts() {
  const [bs, br, gh] = await Promise.all([
    font('BigShoulders-900.ttf'),
    font('Bricolage-800.ttf'),
    font('GochiHand-400.ttf'),
  ]);
  return [
    { name: 'Big Shoulders', data: bs, weight: 900 as const, style: 'normal' as const },
    { name: 'Bricolage', data: br, weight: 800 as const, style: 'normal' as const },
    { name: 'Gochi', data: gh, weight: 400 as const, style: 'normal' as const },
  ];
}

/** The logo badge in its own colours, with a white die-cut outline so it holds on any tone. */
function Logo({ height }: { height: number }) {
  const [, , w, h] = LOGO.viewBox.split(' ').map(Number);
  const back = [LOGO.plaque.d, ...LOGO.stars.map((st) => st.d)];
  return (
    <svg width={(height * w) / h} height={height} viewBox={LOGO.viewBox}>
      {back.map((d) => (
        <path
          key={d.slice(0, 20)}
          d={d}
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth={16}
          strokeLinejoin="round"
        />
      ))}
      <path d={LOGO.plaque.d} fill={LOGO.plaque.fill} />
      {LOGO.letters.flatMap((l) =>
        l.paths.map((pt) => <path key={pt.d.slice(0, 20)} d={pt.d} fill={pt.fill} />),
      )}
      {LOGO.stars.map((st) => (
        <path key={st.color} d={st.d} fill={st.fill} />
      ))}
    </svg>
  );
}

/** Crinkle, deadpan, as plain SVG for the OG renderer. */
function Crinkle({ size }: { size: number }) {
  const body =
    'M132 72L122.6 91.9L115.5 111.4L94.2 115.7L75.6 122.8L56 113.6L36.6 102.4L35 81.6L29.1 61.2L41.5 45L53.5 26.1L75.8 24.2L97.8 23.1L112.5 39.5L127.3 52.9Z';
  return (
    <svg width={size} height={(size * 172) / 160} viewBox="0 0 160 172">
      <path d={body} fill="#fff" stroke="#fff" strokeWidth="10" strokeLinejoin="round" />
      <path d={body} fill={FOIL} transform="translate(3 3)" />
      <path d={body} fill="none" stroke={BLUE} strokeWidth="3" strokeLinejoin="round" />
      <path
        d="M53.5 26.1L58 38L46 46M97.8 23.1L92 35L104 43M115.5 111.4L105 99L117 88M36.6 102.4L51 95L57 104"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
      />
      <circle cx="62" cy="64" r="12.5" fill="#fff" stroke={BLUE} strokeWidth="2.5" />
      <circle cx="96" cy="62" r="12.5" fill="#fff" stroke={BLUE} strokeWidth="2.5" />
      <circle cx="62" cy="67" r="4.8" fill="#000" />
      <circle cx="96" cy="65" r="4.8" fill="#000" />
      <path d="M49 64A13 13 0 0 1 75 64Z" fill={FOIL} stroke={BLUE} strokeWidth="2.5" />
      <path d="M83 62A13 13 0 0 1 109 62Z" fill={FOIL} stroke={BLUE} strokeWidth="2.5" />
      <path d="M70 120L66 150M90 120L94 150" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
      <path
        d="M70 150C70 144 50 143 45 149C41 155 45 160 54 160L70 160C74 160 74 152 70 150Z"
        fill={RED}
        stroke={BLUE}
        strokeWidth="2.5"
      />
      <path
        d="M90 150C90 144 110 143 115 149C119 155 115 160 106 160L90 160C86 160 86 152 90 150Z"
        fill={RED}
        stroke={BLUE}
        strokeWidth="2.5"
      />
    </svg>
  );
}

const TONES = {
  yellow: { bg: YELLOW, fg: BLUE, mark: BLUE },
  red: { bg: RED, fg: '#ffffff', mark: '#ffffff' },
  blue: { bg: BLUE, fg: '#ffffff', mark: YELLOW },
  white: { bg: '#ffffff', fg: BLUE, mark: BLUE },
} as const;
export type OgTone = keyof typeof TONES;

/** Default: logo badge on Yellow with "Light metal. Heavy duty." */
export async function defaultOg() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: YELLOW,
        border: `6px solid ${BLUE}`,
        position: 'relative',
      }}
    >
      <Logo height={300} />
      <div style={{ fontFamily: 'Bricolage', fontSize: 64, color: BLUE, marginTop: 40, letterSpacing: -2 }}>
        Light metal. Heavy duty.
      </div>
      <div style={{ position: 'absolute', right: 60, bottom: 26, display: 'flex' }}>
        <Crinkle size={130} />
      </div>
      <div
        style={{ position: 'absolute', left: 60, bottom: 40, fontFamily: 'Gochi', fontSize: 30, color: RED }}
      >
        Pressed in Ajman since 1997
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}

/** Category and pages: the family/page colour, H1 in Bricolage 800 at 96px, Crinkle in the corner. */
export async function pageOg(title: string, tone: OgTone = 'yellow') {
  const c = TONES[tone];
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        background: c.bg,
        border: `6px solid ${BLUE}`,
        position: 'relative',
      }}
    >
      <Logo height={110} />
      <div
        style={{
          fontFamily: 'Bricolage',
          fontSize: 96,
          lineHeight: 0.95,
          letterSpacing: -3,
          color: c.fg,
          maxWidth: 860,
          display: 'flex',
        }}
      >
        {title}
      </div>
      <div style={{ position: 'absolute', right: 56, bottom: 40, display: 'flex' }}>
        <Crinkle size={170} />
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}

/** Product: huge model code on the left, photo in a rim frame on the right, tagline in Gochi Red. */
export async function productOg({
  code,
  name,
  tagline,
  image,
}: {
  code: string | null;
  name: string;
  tagline: string;
  image?: string;
}) {
  let photo: string | null = null;
  if (image) {
    try {
      const buf = await sharp(path.join(process.cwd(), 'public', image))
        .resize(520, 520)
        .jpeg({ quality: 82 })
        .toBuffer();
      photo = `data:image/jpeg;base64,${buf.toString('base64')}`;
    } catch {
      photo = null;
    }
  }
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: YELLOW,
        border: `6px solid ${BLUE}`,
        padding: 48,
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          paddingRight: 32,
        }}
      >
        <Logo height={96} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {code ? (
            <div
              style={{
                fontFamily: 'Big Shoulders',
                fontSize: code.length > 5 ? 200 : 260,
                lineHeight: 0.82,
                color: BLUE,
              }}
            >
              {code}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: 'Bricolage',
              fontSize: code ? 40 : 64,
              lineHeight: 1.05,
              color: BLUE,
              marginTop: 18,
              maxWidth: 560,
              letterSpacing: -1,
            }}
          >
            {name}
          </div>
        </div>
        <div style={{ fontFamily: 'Gochi', fontSize: 34, color: RED, maxWidth: 600 }}>{tagline}</div>
      </div>
      <div
        style={{
          width: 520,
          height: 520,
          alignSelf: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          border: `4px solid ${BLUE}`,
          borderRadius: 26,
          boxShadow: `10px 10px 0 0 ${BLUE}`,
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img>
          <img src={photo} width={480} height={480} alt="" style={{ objectFit: 'contain' }} />
        ) : (
          <Crinkle size={220} />
        )}
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}
