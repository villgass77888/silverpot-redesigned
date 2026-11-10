/**
 * Decorative carton-label barcode (§3.7-8). Deterministic bars from the code
 * string; aria-hidden wherever it's rendered. Not a scannable symbology.
 */
export function barcodeBars(code: string) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  const push = (w: number, gap: number) => {
    bars.push({ x, w });
    x += w + gap;
  };
  push(1, 1);
  push(1, 1); // start guard
  for (const ch of code.toUpperCase()) {
    const c = ch.charCodeAt(0);
    push(1 + (c % 3), 1 + ((c >> 2) % 2));
    push(1 + ((c >> 1) % 2), 1 + ((c >> 3) % 3));
    push(1 + ((c >> 4) % 3), 1);
  }
  push(1, 1);
  push(1, 0); // end guard
  return { bars, width: x };
}
