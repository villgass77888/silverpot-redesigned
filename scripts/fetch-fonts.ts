/**
 * Downloads static TTF instances of the brand fonts into src/assets/fonts.
 * These are used by:
 *   - (formerly) the SVG wordmark; the logo now comes from public/brand/source/silverpot-logo.svg
 *   - opengraph-image.tsx routes (next/og needs TTF/OTF, not woff2)
 * The site loads its Latin web fonts from src/assets/fonts/web (scripts/build-web-fonts.py).
 *
 * Run: pnpm fonts:fetch
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'src', 'assets', 'fonts');

const FONTS: { file: string; css: string }[] = [
  { file: 'BigShoulders-900.ttf', css: 'Big+Shoulders:opsz,wght@72,900' },
  { file: 'BigShoulders-800.ttf', css: 'Big+Shoulders:opsz,wght@72,800' },
  { file: 'BigShouldersStencil-900.ttf', css: 'Big+Shoulders+Stencil:opsz,wght@72,900' },
  { file: 'Bricolage-800.ttf', css: 'Bricolage+Grotesque:opsz,wght@96,800' },
  { file: 'Bricolage-500.ttf', css: 'Bricolage+Grotesque:opsz,wght@14,500' },
  { file: 'GochiHand-400.ttf', css: 'Gochi+Hand' },
  { file: 'Lalezar-400.ttf', css: 'Lalezar' },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const font of FONTS) {
    // An unrecognised user agent makes the Google Fonts CSS API return TTF URLs.
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${font.css}`, {
      headers: { 'user-agent': 'silverpot-font-fetch/1.0' },
    }).then((r) => r.text());
    const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
    if (!match) throw new Error(`No TTF URL found for ${font.css}`);
    const res = await fetch(match[1]);
    if (!res.ok) throw new Error(`Failed ${match[1]}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(path.join(OUT, font.file), buf);
    console.log(`✓ ${font.file} (${(buf.length / 1024).toFixed(0)} KB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
