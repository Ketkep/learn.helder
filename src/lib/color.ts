// Picks readable text for a colored cover: cream on dark colors, near-black on light ones.

export const CREAM = '#fff3dc';
export const DARK = '#121315';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** The text color (cream or near-black) that reads best on this hex color. */
export function readableInk(hex: string): string {
  return contrast(hex, CREAM) >= contrast(hex, DARK) ? CREAM : DARK;
}
