/**
 * Geometry for the foil-roll spiral "O" (§3.12): a heavy outer ring (reads as an O
 * next to Big Shoulders 900), an inward spiral of foil layers, and a cardboard core.
 * Designed at r = 50; everything scales from that.
 */
export function spiralGeometry(cx: number, cy: number, r: number) {
  const k = r / 50;
  const ring = { r: 43.5 * k, width: 13 * k };
  const core = { r: 10.5 * k, width: 5.2 * k };
  const start = 37 * k;
  const end = 18 * k;
  const turns = 1.55;
  const steps = Math.round(turns * 40);
  const total = turns * Math.PI * 2;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * total;
    const rad = start - ((start - end) * t) / total;
    // start at the top-right, spiralling clockwise inwards
    const a = -Math.PI / 3 + t;
    const x = cx + rad * Math.cos(a);
    const y = cy + rad * Math.sin(a);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return {
    ring,
    core,
    spiral: pts.join(''),
    spiralWidth: 5.4 * k,
  };
}
