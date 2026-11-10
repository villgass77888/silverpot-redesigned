/**
 * Generates the icon set from the logo (§11.4, §8.9):
 *   src/app/icon.svg            (favicon: the yellow logo star on plaque blue)
 *   src/app/apple-icon.png      (180×180)
 *   public/favicon.ico          (16 + 32 + 48, PNG-in-ICO)
 *   public/icons/icon-{192,512}.png, icon-maskable-512.png (manifest)
 *   public/brand/silverpot-logo.png (logo badge, for Organization JSON-LD `logo`)
 *
 * Run: pnpm brand:build
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { LOGO } from '../src/components/brand/logo-data';

const ROOT = process.cwd();
const STAR = LOGO.stars.find((st) => st.color === 'yellow') ?? LOGO.stars[0];

/** The logo's yellow star on a plaque-blue tile: favicon and app icons. */
function starSvg(size: number, { radius = 0.22, inset = 0.14 } = {}) {
  const s = size * (1 - inset * 2);
  const k = s / Math.max(STAR.w, STAR.h);
  const w = STAR.w * k;
  const h = STAR.h * k;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="${size}" height="${size}" rx="${size * radius}" fill="${LOGO.plaque.fill}"/>
<svg x="${(size - w) / 2}" y="${(size - h) / 2 + size * 0.02}" width="${w}" height="${h}" viewBox="${STAR.x - STAR.w / 2} ${STAR.y - STAR.h / 2} ${STAR.w} ${STAR.h}">
<path d="${STAR.d}" fill="${STAR.fill}"/></svg></svg>`;
}

/** The full logo badge on white, for the Organization JSON-LD `logo`. */
function logoSvg(height: number) {
  const [, , w, h] = LOGO.viewBox.split(' ').map(Number);
  const paths = [
    `<path d="${LOGO.plaque.d}" fill="${LOGO.plaque.fill}"/>`,
    ...LOGO.letters.flatMap((l) => l.paths.map((p) => `<path d="${p.d}" fill="${p.fill}"/>`)),
    ...LOGO.stars.map((st) => `<path d="${st.d}" fill="${st.fill}"/>`),
  ].join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO.viewBox}" width="${Math.round((height * w) / h)}" height="${height}">
<rect x="${LOGO.box.x}" y="${LOGO.box.y}" width="${w}" height="${h}" fill="#ffffff"/>${paths}</svg>`;
}

const png = (svg: string, size?: number) => {
  const img = sharp(Buffer.from(svg));
  return (size ? img.resize(size, size) : img).png({ compressionLevel: 9 }).toBuffer();
};

/** Minimal ICO writer: PNG-compressed entries (supported by all current browsers). */
function ico(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((img, i) => {
    const o = 6 + i * 16;
    header.writeUInt8(img.size >= 256 ? 0 : img.size, o);
    header.writeUInt8(img.size >= 256 ? 0 : img.size, o + 1);
    header.writeUInt8(0, o + 2);
    header.writeUInt8(0, o + 3);
    header.writeUInt16LE(1, o + 4);
    header.writeUInt16LE(32, o + 6);
    header.writeUInt32LE(img.data.length, o + 8);
    header.writeUInt32LE(offset, o + 12);
    offset += img.data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

async function main() {
  await mkdir(path.join(ROOT, 'public', 'icons'), { recursive: true });
  await mkdir(path.join(ROOT, 'public', 'brand'), { recursive: true });

  await writeFile(path.join(ROOT, 'src', 'app', 'icon.svg'), starSvg(64));
  await writeFile(
    path.join(ROOT, 'src', 'app', 'apple-icon.png'),
    await png(starSvg(180, { radius: 0 }), 180),
  );
  await writeFile(path.join(ROOT, 'public', 'icons', 'icon-192.png'), await png(starSvg(192), 192));
  await writeFile(path.join(ROOT, 'public', 'icons', 'icon-512.png'), await png(starSvg(512), 512));
  await writeFile(
    path.join(ROOT, 'public', 'icons', 'icon-maskable-512.png'),
    await png(starSvg(512, { radius: 0, inset: 0.22 }), 512),
  );
  const sizes = [16, 32, 48];
  await writeFile(
    path.join(ROOT, 'public', 'favicon.ico'),
    ico(
      await Promise.all(
        sizes.map(async (size) => ({ size, data: await png(starSvg(size * 4, { inset: 0.08 }), size) })),
      ),
    ),
  );
  await writeFile(path.join(ROOT, 'public', 'brand', 'silverpot-logo.png'), await png(logoSvg(320)));
  console.log('✓ icon.svg, apple-icon.png, favicon.ico, manifest icons, brand/silverpot-logo.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
