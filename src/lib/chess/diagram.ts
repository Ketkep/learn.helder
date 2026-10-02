// A still picture of a chess position, as an SVG string. Used for the field guide and as the
// fallback for people who have JavaScript off. The moving board on the page draws itself.
import type { Square } from 'chess.js';

const FILES = 'abcdefgh';

interface DiagramOptions {
  /** Squares to circle, for example ['f7']. */
  marks?: Square[];
  /** A short description for screen readers. */
  label?: string;
  /** Draw the a to h and 1 to 8 letters on the edge. */
  coords?: boolean;
}

/** `fen` is the standard text for a position. Only its first part, the pieces, is used. */
export function diagram(fen: string, opts: DiagramOptions = {}): string {
  const rows = fen.split(' ')[0].split('/');
  const out: string[] = [];

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const dark = (r + f) % 2 === 1;
      out.push(`<rect class="${dark ? 'sq-d' : 'sq-l'}" x="${f * 100}" y="${r * 100}" width="100" height="100"/>`);
    }
  }

  if (opts.coords) {
    for (let i = 0; i < 8; i++) {
      const fileOnDark = (7 + i) % 2 === 1;
      const rankOnDark = (i + 0) % 2 === 1;
      out.push(`<text class="coord ${fileOnDark ? 'on-d' : 'on-l'}" x="${i * 100 + 90}" y="792" text-anchor="end">${FILES[i]}</text>`);
      out.push(`<text class="coord ${rankOnDark ? 'on-d' : 'on-l'}" x="8" y="${i * 100 + 26}">${8 - i}</text>`);
    }
  }

  for (const sq of opts.marks ?? []) {
    const f = FILES.indexOf(sq[0]);
    const r = 8 - Number(sq[1]);
    out.push(`<circle class="mark" cx="${f * 100 + 50}" cy="${r * 100 + 50}" r="42"/>`);
  }

  rows.forEach((row, r) => {
    let f = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) {
        f += Number(ch);
        continue;
      }
      const white = ch === ch.toUpperCase();
      out.push(
        `<use href="#pc-${ch.toLowerCase()}" class="${white ? 'pc-w' : 'pc-b'}" x="${f * 100}" y="${r * 100}" width="100" height="100"/>`,
      );
      f++;
    }
  });

  const label = opts.label ? ` role="img" aria-label="${opts.label.replace(/"/g, '&quot;')}"` : ' aria-hidden="true"';
  return `<svg class="cb" viewBox="0 0 800 800"${label}>${out.join('')}</svg>`;
}
