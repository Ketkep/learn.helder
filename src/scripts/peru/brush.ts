// Shot 1: wipe the sand off the hill with a brush. Each wipe cuts a round hole in the sand layer.
// When enough of the hill is clean, the rest fades away.

import * as sound from '../sound';
import { reducedMotion, q } from './util';

const NS = 'http://www.w3.org/2000/svg';
const CELL = 20; // the hill is split into squares of this size to count how much is clean
const R = 30; // how wide one wipe is
const NEEDED = 0.68; // the share of the hill that has to be clean

export function initBrush(root: HTMLElement) {
  const found = root.querySelector<HTMLElement>('[data-brush-tool]');
  if (!found) return;
  const tool: HTMLElement = found;
  const svg = q<SVGSVGElement>(tool, '[data-brush-svg]');
  const holes = q<SVGGElement>(svg, '[data-brushed]');
  const mound = q<SVGGeometryElement>(svg, '[data-mound]');
  const dust = q<SVGGElement>(svg, '[data-dust]');
  const brush = q<SVGGElement>(svg, '[data-brush]');
  const auto = q<HTMLButtonElement>(root, '[data-brush-auto]');
  const reset = q<HTMLButtonElement>(root, '[data-brush-reset]');
  const status = q<HTMLElement>(root, '[data-brush-status]');
  const startText = status.textContent ?? '';

  // Which squares of the hill are part of the mound at all
  const cells = new Map<string, boolean>();
  const probe = svg.createSVGPoint();
  for (let x = 0; x < 800; x += CELL) {
    for (let y = 0; y < 450; y += CELL) {
      probe.x = x + CELL / 2;
      probe.y = y + CELL / 2;
      if (mound.isPointInFill(probe)) cells.set(`${x},${y}`, false);
    }
  }
  let clean = 0;
  let finished = false;
  let lastSaid = 0;
  let lastSound = 0;
  let last: { x: number; y: number } | null = null;
  let down = false;
  let autoRun = 0;

  const toSvg = (e: PointerEvent) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: p.x, y: p.y };
  };

  const share = () => (cells.size ? clean / cells.size : 1);

  function finish() {
    if (finished) return;
    finished = true;
    tool.setAttribute('data-clean', '');
    reset.disabled = false;
    auto.disabled = true;
    status.innerHTML =
      '<strong>Found it.</strong> A stepped pyramid, about 160 m by 150 m and 18 m high. The people who built it lived here between about 2600 and 2000 BC.';
    sound.play('good');
  }

  function wipe(x: number, y: number, loud = 0.7) {
    const hole = document.createElementNS(NS, 'circle');
    hole.setAttribute('cx', String(x));
    hole.setAttribute('cy', String(y));
    hole.setAttribute('r', String(R));
    holes.append(hole);

    // Count the squares this wipe touched
    for (let cx = Math.floor((x - R) / CELL) * CELL; cx <= x + R; cx += CELL) {
      for (let cy = Math.floor((y - R) / CELL) * CELL; cy <= y + R; cy += CELL) {
        const key = `${cx},${cy}`;
        if (cells.get(key) === false && Math.hypot(cx + CELL / 2 - x, cy + CELL / 2 - y) < R + 6) {
          cells.set(key, true);
          clean++;
        }
      }
    }

    if (!reducedMotion() && dust.childElementCount < 40) {
      const puff = document.createElementNS(NS, 'circle');
      puff.setAttribute('class', 'dust-puff');
      puff.setAttribute('cx', String(x + (Math.random() - 0.5) * 30));
      puff.setAttribute('cy', String(y - 6 + Math.random() * 10));
      puff.setAttribute('r', String(5 + Math.random() * 5));
      puff.setAttribute('fill', '#e9d09a');
      dust.append(puff);
      puff.addEventListener('animationend', () => puff.remove());
    }

    const now = performance.now();
    if (now - lastSound > 70) {
      sound.play('scrape', loud);
      lastSound = now;
    }

    const pct = Math.min(100, Math.round(share() * 100));
    if (!finished && pct - lastSaid >= 10) {
      lastSaid = pct;
      status.textContent = `Brushed: ${Math.round(Math.min(1, share() / NEEDED) * 100)} percent of the way. Keep going.`;
    }
    if (share() >= NEEDED) finish();
  }

  /** Wipes along a line, so a fast drag leaves no gaps. */
  function stroke(p: { x: number; y: number }) {
    if (finished) return;
    if (!last) {
      wipe(p.x, p.y);
      last = p;
      return;
    }
    const d = Math.hypot(p.x - last.x, p.y - last.y);
    const steps = Math.max(1, Math.floor(d / 12));
    for (let i = 1; i <= steps; i++) {
      wipe(last.x + ((p.x - last.x) * i) / steps, last.y + ((p.y - last.y) * i) / steps, Math.min(1, d / 40));
    }
    last = p;
  }

  const moveBrush = (p: { x: number; y: number }) => brush.setAttribute('transform', `translate(${p.x} ${p.y})`);

  svg.addEventListener('pointerdown', (e) => {
    if (finished) return;
    down = true;
    svg.setPointerCapture(e.pointerId);
    const p = toSvg(e);
    moveBrush(p);
    last = null;
    stroke(p);
  });
  svg.addEventListener('pointermove', (e) => {
    const p = toSvg(e);
    moveBrush(p);
    if (down) stroke(p);
  });
  const lift = () => {
    down = false;
    last = null;
  };
  svg.addEventListener('pointerup', lift);
  svg.addEventListener('pointercancel', lift);
  svg.addEventListener('pointerleave', () => {
    if (!down) brush.setAttribute('transform', 'translate(-200 -200)');
  });

  // The button does the brushing for you, in rows from top to bottom
  auto.addEventListener('click', () => {
    if (finished) return;
    const path: { x: number; y: number }[] = [];
    let dir = 1;
    for (let y = 214; y <= 410; y += 34) {
      const xs = [];
      for (let x = 130; x <= 670; x += 14) xs.push(x);
      if (dir < 0) xs.reverse();
      for (const x of xs) path.push({ x, y });
      dir *= -1;
    }
    if (reducedMotion()) {
      for (const p of path) wipe(p.x, p.y, 0);
      finish();
      return;
    }
    auto.disabled = true;
    let i = 0;
    const tick = () => {
      for (let k = 0; k < 5 && i < path.length && !finished; k++, i++) {
        moveBrush(path[i]);
        wipe(path[i].x, path[i].y, 0.6);
      }
      if (i < path.length && !finished) autoRun = requestAnimationFrame(tick);
    };
    tick();
  });

  reset.addEventListener('click', () => {
    cancelAnimationFrame(autoRun);
    holes.replaceChildren();
    dust.replaceChildren();
    for (const k of cells.keys()) cells.set(k, false);
    clean = 0;
    lastSaid = 0;
    finished = false;
    last = null;
    tool.removeAttribute('data-clean');
    reset.disabled = true;
    auto.disabled = false;
    status.textContent = startText;
    sound.play('pop');
  });
}
