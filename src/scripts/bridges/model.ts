// The statics behind the bridge tools. Plain functions in relative units, so the numbers show the idea
// and not a real design.

/**
 * Sag of a simply supported beam of length 1 at position x, for a weight `p` at position `a` (0 to 1).
 * `depth` is the depth of the beam; stiffness goes with its cube. 1 means a weight p = 1 in the middle of a beam of depth 1.
 */
export function sag(x: number, a: number, p: number, depth: number) {
  const b = 1 - a;
  const k = (48 * p) / (6 * depth ** 3);
  // Standard formulas for a point load on a beam on two supports, scaled so that the middle gives 1
  return x <= a ? k * b * x * (1 - b * b - x * x) : k * a * (1 - x) * (1 - a * a - (1 - x) ** 2);
}

/** The bending moment at x for a weight p at a, relative to a weight p in the middle (which gives 1). */
export function moment(x: number, a: number, p: number) {
  const b = 1 - a;
  const m = x <= a ? p * b * x : p * a * (1 - x);
  return m / 0.25; // a weight p in the middle gives p x 0.25
}

/** Force at the foot of an arch or at the top of a cable tower, for a load W spread evenly over a span 1 with rise (or sag) `r` of the span. */
export function archForces(r: number) {
  const vertical = 0.5; // half the load goes down each foot
  const sideways = 1 / (8 * r); // the same formula for an arch and for a cable
  return { vertical, sideways, along: Math.hypot(vertical, sideways) };
}

/** A square frame of side 1 pushed sideways at the top without a diagonal: how far the top moves, 0 to 0.95 of a side. */
export const racking = (push: number, max = 5) => Math.min(push / max, 1) * 0.95;

/** Two rafters and a tie, with a weight `p` at the top. `h` is the height as a share of the base. */
export function trussForces(h: number, p: number) {
  const half = 0.5; // half the base
  const rafter = (p * Math.hypot(h, half)) / (2 * h); // p / (2 sin angle)
  const tie = (p * half) / (2 * h); // p / (2 tan angle)
  return { rafter, tie };
}
