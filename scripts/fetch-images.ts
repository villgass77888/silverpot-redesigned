/**
 * Downloads product photos from the OLD silverpot.org WordPress uploads into
 * /public/images/products (§10.2). The old site is compromised: we only accept
 * image responses (content-type validated, < 15 MB), re-encode them with sharp
 * (which also strips EXIF), and never execute or store any HTML.
 *
 * Writes:
 *   public/images/products/{slug}-{n}.jpg
 *   src/data/images.generated.ts     (width, height, needsReshoot, blurDataURL)
 *   docs/IMAGES_REPORT.md
 *
 * Run: pnpm images:fetch
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { products } from '../src/data/products';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public', 'images', 'products');
const BRAND_DIR = path.join(ROOT, 'public', 'images', 'brand');
const GEN_FILE = path.join(ROOT, 'src', 'data', 'images.generated.ts');
const REPORT = path.join(ROOT, 'docs', 'IMAGES_REPORT.md');
const BASE = 'https://silverpot.org/wp-content/uploads/2022/02/';
const ALLOWED = /^image\/(jpeg|png|webp)$/i;
const MAX_BYTES = 15 * 1024 * 1024;
const SAFE_URL = /^https:\/\/silverpot\.org\/wp-content\/uploads\/[\w/.-]+\.(jpe?g|png|webp)$/i;

class Blocked extends Error {}

async function fetchImage(url: string): Promise<Buffer | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10_000);
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        redirect: 'follow',
        headers: { 'user-agent': 'silverpot-image-migration/1.0 (+https://silverpot.org)' },
      });
      if (res.status === 403 || res.status === 429) throw new Blocked(`${res.status} on ${url}`);
      if (res.status === 404 || res.status === 410) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
      if (!ALLOWED.test(type)) return null; // not an image (e.g. the hacked homepage HTML)
      const len = Number(res.headers.get('content-length') ?? 0);
      if (len > MAX_BYTES) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > MAX_BYTES) return null;
      return buf;
    } catch (err) {
      if (err instanceof Blocked) throw err;
      if (attempt === 2) return null;
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

/** Optional discovery: read srcset URLs from the homepage as untrusted text. */
async function discoverFromHomepage(): Promise<Map<string, { url: string; w: number }[]>> {
  const map = new Map<string, { url: string; w: number }[]>();
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10_000);
    const res = await fetch('https://silverpot.org/', { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.status === 403) throw new Blocked('403 on homepage');
    const text = (await res.text()).slice(0, 3_000_000);
    const re = /(https:\/\/silverpot\.org\/wp-content\/uploads\/[\w/.-]+\.(?:jpe?g|png|webp))(?:\s+(\d+)w)?/gi;
    for (const m of text.matchAll(re)) {
      const url = m[1];
      if (!SAFE_URL.test(url)) continue;
      const file = url.split('/').pop()!.replace(/\.(jpe?g|png|webp)$/i, '');
      const base = file.replace(/-(\d+)x(\d+)$/, '').replace(/-scaled$/, '');
      const dims = file.match(/-(\d+)x(\d+)$/);
      const w = m[3] ? Number(m[3]) : dims ? Number(dims[1]) : 99999;
      const list = map.get(base) ?? [];
      if (!list.some((x) => x.url === url)) list.push({ url, w });
      map.set(base, list);
    }
  } catch (err) {
    if (err instanceof Blocked) throw err;
    console.warn('  (homepage discovery skipped)');
  }
  return map;
}

function candidateUrls(bases: string[], discovered: Map<string, { url: string; w: number }[]>) {
  const urls: string[] = [];
  for (const full of bases) {
    const file = full.replace(BASE, '');
    urls.push(`${BASE}${file}.jpg`, `${BASE}${file}-scaled.jpg`);
    for (const d of (discovered.get(file) ?? []).sort((a, b) => b.w - a.w)) urls.push(d.url);
    urls.push(
      `${BASE}${file}-1024x1024.jpg`,
      `${BASE}${file}-768x768.jpg`,
      `${BASE}${file}-600x600.jpg`,
      `${BASE}${file}-300x300.jpg`,
    );
  }
  return [...new Set(urls)];
}

/**
 * Re-encode (strips EXIF), trim the white studio margin, then pad back to a square
 * with a consistent 7% margin so every product sits at the same scale in its RimFrame.
 * Capped at 2000 px (§3.9 asks for ≥ 2000 px for new shoots; more is wasted bytes).
 */
async function normalise(buf: Buffer) {
  const rotated = await sharp(buf, { failOn: 'error' }).rotate().toBuffer();
  const trimmed = await sharp(rotated)
    .trim({ background: '#ffffff', threshold: 18 })
    .toBuffer({ resolveWithObject: true })
    .catch(() => sharp(rotated).toBuffer({ resolveWithObject: true }));
  const { width, height } = trimmed.info;
  const side = Math.round(Math.max(width, height) / 0.86);
  const padX = Math.round((side - width) / 2);
  const padY = Math.round((side - height) / 2);
  // sharp always resizes before extending within one pipeline, so pad first, then resize.
  const padded = await sharp(trimmed.data)
    .extend({
      top: padY,
      bottom: side - height - padY,
      left: padX,
      right: side - width - padX,
      background: '#ffffff',
    })
    .flatten({ background: '#ffffff' })
    .toBuffer();
  const target = Math.min(side, 2000);
  return sharp(padded)
    .resize(target, target, { fit: 'cover' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
}

async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (queue.length) await fn(queue.shift()!);
    }),
  );
}

type Row = { product: string; src: string; url: string | null; width: number; height: number; needsReshoot: boolean };

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(BRAND_DIR, { recursive: true });
  console.log('Discovering image sizes from the old homepage (untrusted, URLs only)…');
  const discovered = await discoverFromHomepage();

  const jobs = products.flatMap((p) => p.images.map((img) => ({ p, img })));
  const rows: Row[] = [];
  const generated: Record<string, { width: number; height: number; needsReshoot: boolean; blurDataURL: string; url: string }> = {};

  await pool(jobs, 4, async ({ p, img }) => {
    const urls = candidateUrls(img.legacyCandidates, discovered);
    for (const url of urls) {
      const buf = await fetchImage(url);
      if (!buf) continue;
      const out = await normalise(buf);
      const file = path.join(ROOT, 'public', img.src);
      await writeFile(file, out.data);
      const blur = await sharp(out.data).resize(12, 12, { fit: 'inside' }).jpeg({ quality: 60 }).toBuffer();
      const { width, height } = out.info;
      const needsReshoot = Math.max(width, height) < 800;
      generated[img.src] = {
        width,
        height,
        needsReshoot,
        blurDataURL: `data:image/jpeg;base64,${blur.toString('base64')}`,
        url,
      };
      rows.push({ product: p.id, src: img.src, url, width, height, needsReshoot });
      console.log(`✓ ${p.id.padEnd(11)} ${width}×${height}${needsReshoot ? '  (needsReshoot)' : ''}  ← ${url.replace(BASE, '…/')}`);
      return;
    }
    rows.push({ product: p.id, src: img.src, url: null, width: 0, height: 0, needsReshoot: true });
    console.log(`✗ ${p.id.padEnd(11)} no image found`);
  });

  // Old logo, kept only as a reference (§3.12). Not used as the new logo.
  // About-Pic-1-1.png was inspected: a generic stock collage (plastic cutlery, cling film),
  // not the factory, so it is NOT downloaded (§7.7 → press-machine illustration instead).
  for (const [name, url] of [['logo-old-reference.png', `${BASE}silverpot-logo-5.png`]] as const) {
    const buf = await fetchImage(url);
    if (buf) {
      await sharp(buf).png().toFile(path.join(BRAND_DIR, name));
      console.log(`✓ brand/${name}`);
    }
  }

  const sorted = Object.fromEntries(Object.entries(generated).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(
    GEN_FILE,
    '// Generated by scripts/fetch-images.ts. Do not edit by hand.\n' +
      'export const generatedImages: Record<string, { width: number; height: number; needsReshoot: boolean; blurDataURL?: string; url?: string }> = ' +
      JSON.stringify(sorted, null, 2) +
      ';\n',
  );

  const noPhoto = products.filter((p) => p.images.length === 0).map((p) => p.id);
  rows.sort((a, b) => a.src.localeCompare(b.src));
  const md = [
    '# Images report',
    '',
    `Generated by \`pnpm images:fetch\` on ${new Date().toISOString().slice(0, 10)}.`,
    '',
    '| Product | Local file | Source URL used | Size | needsReshoot |',
    '|---|---|---|---|---|',
    ...rows.map(
      (r) =>
        `| ${r.product} | \`${r.src}\` | ${r.url ? `\`${r.url.replace(BASE, '…/')}\`` : '**not found**'} | ${r.width ? `${r.width}×${r.height}` : '—'} | ${r.needsReshoot ? 'yes' : 'no'} |`,
    ),
    '',
    `Products with no photo on the old site (render PhotoComingSoon): ${noPhoto.map((id) => `\`${id}\``).join(', ') || 'none'}.`,
    '',
    'Images under 800 px are flagged `needsReshoot` and displayed at no more than their native width.',
    'See the new-shoot brief in MASTER_PROMPT §3.9.',
    '',
  ].join('\n');
  await writeFile(REPORT, md);
  console.log(`\n${rows.filter((r) => r.url).length}/${rows.length} images saved. Report: docs/IMAGES_REPORT.md`);
}

main().catch((err) => {
  if (err instanceof Blocked) {
    console.error(`\n✋ The old domain is blocking automated requests (${err.message}).`);
    console.error('Stopping as instructed (§10.2). Download the images manually into');
    console.error('public/images/products/ using the {slug}-{n}.jpg filenames, then re-run the build.');
    process.exit(2);
  }
  console.error(err);
  process.exit(1);
});
