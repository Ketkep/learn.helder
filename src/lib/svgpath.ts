// Turns a list of points into a smooth SVG path (a Catmull-Rom curve written as cubic curves).

type Pt = [number, number];

const f = (n: number) => Math.round(n * 10) / 10;

export function smooth(points: Pt[], closed = false, tension = 0.5): string {
  const n = points.length;
  if (n < 3) return `M${points.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}`;
  const at = (i: number): Pt => (closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}
