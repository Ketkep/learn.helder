// The moving chess board: draws a position, slides pieces when a move is played, draws marker
// arrows and circles, and lets the reader pick a piece and a square. It knows nothing about the
// story. The film (film.ts) tells it what to show.

import type { Ply } from '../../lib/chess/analyze';

const NS = 'http://www.w3.org/2000/svg';
const FILES = 'abcdefgh';
const NAMES: Record<string, string> = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };

type Sq = string;

export interface Highlights {
  last?: [Sq, Sq] | null;
  /** The square of a king that is in check. */
  check?: Sq | null;
  /** Shows the reader which piece to move and where. */
  hint?: [Sq, Sq] | null;
}

export interface InputConfig {
  /** Which color the reader moves. */
  side: 'w' | 'b';
  /** Every legal move: from square to a list of squares. */
  legal: Record<string, string[]>;
  onMove: (from: Sq, to: Sq) => void;
}

const xy = (sq: Sq): [number, number] => [FILES.indexOf(sq[0]) * 100, (8 - Number(sq[1])) * 100];
const centre = (sq: Sq): [number, number] => {
  const [x, y] = xy(sq);
  return [x + 50, y + 50];
};

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, cls?: string) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  if (cls) node.setAttribute('class', cls);
  return node;
}

export class Board {
  private svg: SVGSVGElement;
  private layerHi = el('g');
  private layerPieces = el('g');
  private layerNotes = el('g');
  private layerHit = el('g');
  private pieces = new Map<Sq, SVGGElement>();
  private input: InputConfig | null = null;
  private selected: Sq | null = null;
  private hint: [Sq, Sq] | null = null;
  private highlights: Highlights = {};
  /** How long a piece takes to slide, in milliseconds. */
  slide = 420;

  constructor(svg: SVGSVGElement) {
    this.svg = svg;
    svg.replaceChildren();

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        svg.append(el('rect', { x: f * 100, y: r * 100, width: 100, height: 100 }, (r + f) % 2 ? 'sq-d' : 'sq-l'));
      }
    }
    for (let i = 0; i < 8; i++) {
      const fileText = el('text', { x: i * 100 + 92, y: 792, 'text-anchor': 'end' }, `coord ${(7 + i) % 2 ? 'on-d' : 'on-l'}`);
      fileText.textContent = FILES[i];
      const rankText = el('text', { x: 8, y: i * 100 + 26 }, `coord ${i % 2 ? 'on-d' : 'on-l'}`);
      rankText.textContent = String(8 - i);
      svg.append(fileText, rankText);
    }
    this.layerPieces.setAttribute('class', 'pieces');
    this.layerNotes.setAttribute('class', 'notes');
    svg.append(this.layerHi, this.layerPieces, this.layerNotes, this.layerHit);
    svg.addEventListener('pointerdown', (e) => this.onPointer(e));
  }

  // ------------------------------------------------------------ pieces

  /** Puts a whole position on the board at once, without moving anything. */
  setFen(fen: string) {
    this.layerPieces.replaceChildren();
    this.pieces.clear();
    fen
      .split(' ')[0]
      .split('/')
      .forEach((row, r) => {
        let f = 0;
        for (const ch of row) {
          if (/\d/.test(ch)) {
            f += Number(ch);
            continue;
          }
          this.create(ch.toLowerCase(), ch === ch.toUpperCase() ? 'w' : 'b', (FILES[f] + (8 - r)) as Sq, false);
          f++;
        }
      });
  }

  private create(type: string, color: string, sq: Sq, fade: boolean) {
    const g = el('g', {}, `pc ${color === 'w' ? 'pc-w' : 'pc-b'}${fade ? ' arriving' : ''}`);
    const [x, y] = xy(sq);
    g.style.transform = `translate(${x}px, ${y}px)`;
    const inner = el('g', {}, 'inner');
    const use = el('use', { href: `#pc-${type}`, width: 100, height: 100 });
    inner.append(use);
    g.append(inner);
    g.dataset.type = type;
    this.layerPieces.append(g);
    this.pieces.set(sq, g);
    if (fade) requestAnimationFrame(() => requestAnimationFrame(() => g.classList.remove('arriving')));
  }

  private setSpeed(animate: boolean) {
    this.svg.style.setProperty('--slide', animate ? `${this.slide}ms` : '0ms');
  }

  private moveTo(from: Sq, to: Sq) {
    const g = this.pieces.get(from);
    if (!g) return;
    this.pieces.delete(from);
    this.pieces.set(to, g);
    this.layerPieces.append(g); // on top while it travels
    const [x, y] = xy(to);
    g.style.transform = `translate(${x}px, ${y}px)`;
  }

  private take(sq: Sq, animate: boolean) {
    const g = this.pieces.get(sq);
    if (!g) return;
    this.pieces.delete(sq);
    if (!animate) {
      g.remove();
      return;
    }
    g.classList.add('gone');
    setTimeout(() => g.remove(), 420);
  }

  private swapType(sq: Sq, type: string) {
    const g = this.pieces.get(sq);
    if (!g) return;
    g.dataset.type = type;
    g.querySelector('use')?.setAttribute('href', `#pc-${type}`);
  }

  /** Plays a move forwards. Returns when the piece has arrived. */
  applyPly(ply: Ply, animate = true): Promise<void> {
    this.setSpeed(animate);
    if (ply.cap) this.take(ply.cap.sq, animate);
    this.moveTo(ply.from, ply.to);
    if (ply.rook) this.moveTo(ply.rook.from, ply.rook.to);
    if (ply.promo) this.swapType(ply.to, ply.promo);
    return animate ? wait(this.slide) : Promise.resolve();
  }

  /** Takes a move back. */
  undoPly(ply: Ply, animate = true): Promise<void> {
    this.setSpeed(animate);
    if (ply.promo) this.swapType(ply.to, 'p');
    this.moveTo(ply.to, ply.from);
    if (ply.rook) this.moveTo(ply.rook.to, ply.rook.from);
    if (ply.cap) this.create(ply.cap.piece, ply.cap.color, ply.cap.sq, animate);
    return animate ? wait(this.slide) : Promise.resolve();
  }

  /** Slides a piece to a square and back again, to show a move that is not part of the story. */
  async peek(from: Sq, to: Sq) {
    this.setSpeed(true);
    this.moveTo(from, to);
    await wait(this.slide + 450);
    this.moveTo(to, from);
    await wait(this.slide);
  }

  // ------------------------------------------------------------ highlights

  setHighlights(h: Highlights) {
    this.highlights = { ...this.highlights, ...h };
    if ('hint' in h) this.hint = h.hint ?? null;
    this.drawHighlights();
  }

  private drawHighlights() {
    const layer = this.layerHi;
    layer.replaceChildren();
    const { last, check } = this.highlights;
    const square = (sq: Sq, cls: string) => {
      const [x, y] = xy(sq);
      layer.append(el('rect', { x, y, width: 100, height: 100 }, cls));
    };
    if (last) last.forEach((sq) => square(sq, 'hi-last'));
    if (check) square(check, 'hi-check');
    if (this.hint) {
      square(this.hint[0], 'hi-hint-from');
      const [cx, cy] = centre(this.hint[1]);
      layer.append(el('circle', { cx, cy, r: 20 }, 'hi-hint-to'));
    }
    if (this.selected) {
      square(this.selected, 'hi-selected');
      for (const to of this.input?.legal[this.selected] ?? []) {
        const [cx, cy] = centre(to);
        layer.append(el('circle', { cx, cy, r: this.pieces.has(to) ? 44 : 15 }, this.pieces.has(to) ? 'hi-target hi-capture' : 'hi-target'));
      }
    }
  }

  /** Marker arrows and circles, drawn like a coach drawing on the board. */
  setNotes(arrows: [Sq, Sq][] = [], marks: Sq[] = [], animate = true) {
    const layer = this.layerNotes;
    layer.replaceChildren();
    for (const sq of marks) {
      const [cx, cy] = centre(sq);
      layer.append(el('circle', { cx, cy, r: 42 }, animate ? 'note-mark in' : 'note-mark'));
    }
    for (const [a, b] of arrows) layer.append(this.arrow(a, b, animate));
  }

  private arrow(a: Sq, b: Sq, animate: boolean) {
    const [ax, ay] = centre(a);
    const [bx, by] = centre(b);
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    // Start and end a little inside the squares, with a slight bow like a hand-drawn line
    const sx = ax + ux * 26;
    const sy = ay + uy * 26;
    const ex = bx - ux * 30;
    const ey = by - uy * 30;
    const bow = Math.min(18, len * 0.07);
    const cx = (sx + ex) / 2 - uy * bow;
    const cy = (sy + ey) / 2 + ux * bow;
    // The head follows the direction the line has at its end
    const hx = ex - cx;
    const hy = ey - cy;
    const hl = Math.hypot(hx, hy) || 1;
    const hux = hx / hl;
    const huy = hy / hl;
    const wing = (angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [ex - (hux * cos - huy * sin) * 34, ey - (hux * sin + huy * cos) * 34];
    };
    const [w1x, w1y] = wing(0.55);
    const [w2x, w2y] = wing(-0.55);

    const g = el('g', {}, animate ? 'note-arrow in' : 'note-arrow');
    g.append(
      el('path', { d: `M${sx} ${sy}Q${cx} ${cy} ${ex} ${ey}`, pathLength: 1 }, 'shaft'),
      el('path', { d: `M${w1x} ${w1y}L${ex} ${ey}L${w2x} ${w2y}` }, 'head'),
    );
    return g;
  }

  // ------------------------------------------------------------ the reader moves

  enableInput(config: InputConfig) {
    this.input = config;
    this.selected = null;
    this.buildHitLayer();
    this.drawHighlights();
  }

  disableInput() {
    this.input = null;
    this.selected = null;
    this.layerHit.replaceChildren();
    this.drawHighlights();
  }

  /** Names every square for screen readers, and makes them reachable with the keyboard. */
  private buildHitLayer() {
    const layer = this.layerHit;
    layer.replaceChildren();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sq = (FILES[f] + (8 - r)) as Sq;
        const rect = el('rect', { x: f * 100, y: r * 100, width: 100, height: 100, role: 'button', tabindex: -1 }, 'hit');
        rect.dataset.sq = sq;
        rect.addEventListener('keydown', (e) => this.onKey(e as KeyboardEvent, sq));
        layer.append(rect);
      }
    }
    this.labelSquares();
    const first = this.hint ? this.hint[0] : 'e2';
    layer.querySelector<SVGElement>(`[data-sq="${first}"]`)?.setAttribute('tabindex', '0');
  }

  labelSquares() {
    for (const rect of this.layerHit.querySelectorAll<SVGElement>('.hit')) {
      const sq = rect.dataset.sq as Sq;
      const g = this.pieces.get(sq);
      const what = g ? `${g.classList.contains('pc-w') ? 'white' : 'black'} ${NAMES[g.dataset.type ?? 'p']}` : 'empty';
      rect.setAttribute('aria-label', `${sq}, ${what}${this.selected === sq ? ', selected' : ''}`);
    }
  }

  private onPointer(e: PointerEvent) {
    if (!this.input) return;
    const box = this.svg.getBoundingClientRect();
    const f = Math.floor(((e.clientX - box.left) / box.width) * 8);
    const r = Math.floor(((e.clientY - box.top) / box.height) * 8);
    if (f < 0 || f > 7 || r < 0 || r > 7) return;
    this.pick((FILES[f] + (8 - r)) as Sq);
  }

  private onKey(e: KeyboardEvent, sq: Sq) {
    const f = FILES.indexOf(sq[0]);
    const r = Number(sq[1]);
    let nf = f;
    let nr = r;
    if (e.key === 'ArrowRight') nf++;
    else if (e.key === 'ArrowLeft') nf--;
    else if (e.key === 'ArrowUp') nr++;
    else if (e.key === 'ArrowDown') nr--;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.pick(sq);
      return;
    } else if (e.key === 'Escape') {
      this.selected = null;
      this.drawHighlights();
      this.labelSquares();
      return;
    } else return;
    e.preventDefault();
    if (nf < 0 || nf > 7 || nr < 1 || nr > 8) return;
    const next = this.layerHit.querySelector<SVGElement>(`[data-sq="${FILES[nf]}${nr}"]`);
    this.layerHit.querySelectorAll('[tabindex="0"]').forEach((n) => n.setAttribute('tabindex', '-1'));
    next?.setAttribute('tabindex', '0');
    next?.focus();
  }

  /** Select a piece, or move the selected piece to a square. */
  private pick(sq: Sq) {
    const input = this.input;
    if (!input) return;
    const mine = (s: Sq) => this.pieces.get(s)?.classList.contains(input.side === 'w' ? 'pc-w' : 'pc-b') ?? false;

    if (this.selected && input.legal[this.selected]?.includes(sq)) {
      const from = this.selected;
      this.selected = null;
      this.drawHighlights();
      input.onMove(from, sq);
      return;
    }
    if (mine(sq) && input.legal[sq]) {
      this.selected = this.selected === sq ? null : sq;
    } else {
      this.selected = null;
    }
    this.drawHighlights();
    this.labelSquares();
  }

  // ------------------------------------------------------------ for screen readers

  /** The piece list of a position in words, for a hidden description. */
  describe(fen: string): string {
    const order = 'kqrbnp';
    const groups: Record<'w' | 'b', Record<string, string[]>> = { w: {}, b: {} };
    fen
      .split(' ')[0]
      .split('/')
      .forEach((row, r) => {
        let f = 0;
        for (const ch of row) {
          if (/\d/.test(ch)) {
            f += Number(ch);
            continue;
          }
          const color = ch === ch.toUpperCase() ? 'w' : 'b';
          (groups[color][ch.toLowerCase()] ??= []).push(FILES[f] + (8 - r));
          f++;
        }
      });
    const say = (color: 'w' | 'b') =>
      order
        .split('')
        .filter((t) => groups[color][t])
        .map((t) => `${NAMES[t]}${groups[color][t].length > 1 ? 's' : ''} ${groups[color][t].join(' ')}`)
        .join(', ');
    return `White: ${say('w')}. Black: ${say('b')}.`;
  }
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
