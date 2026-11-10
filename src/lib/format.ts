/** Sticker/badge rotation must be deterministic per index (no hydration mismatch, §3.6). */
export function stickerRotation(index: number, range = 7) {
  const seq = [-4, 3, -6, 5, -2, 6, -5, 2, -7, 4];
  return Math.max(-range, Math.min(range, seq[index % seq.length]));
}

export function clampQty(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(9999, Math.round(n)));
}

/** Western digits in both locales (§1.6). */
export function num(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}
