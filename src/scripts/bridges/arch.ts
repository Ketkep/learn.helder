// Span 2: arch and cable. The sideways force H = load x span / (8 x height) is the same for both.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { archForces } from './model';

const NS = 'http://www.w3.org/2000/svg';
const X0 = 110;
const X1 = 690;
const GROUND = 320;
const SPAN = X1 - X0;

function el(name: string, attrs: Record<string, string | number>, text?: string) {
  const node = document.createElementNS(NS, name);
  for (const k of Object.keys(attrs)) node.setAttribute(k, String(attrs[k]));
  if (text) node.textContent = text;
  return node;
}

/** An arrow from (x, y) to (x + dx, y + dy), as svg elements. */
function arrow(parent: Element, x: number, y: number, dx: number, dy: number, cls: string) {
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const ex = x + dx;
  const ey = y + dy;
  parent.appendChild(el('line', { class: cls, x1: x, y1: y, x2: ex - ux * 8, y2: ey - uy * 8 }));
  parent.appendChild(el('path', { class: `${cls} head`, d: `M${ex} ${ey}L${ex - ux * 18 - uy * 9} ${ey - uy * 18 + ux * 9}L${ex - ux * 18 + uy * 9} ${ey - uy * 18 - ux * 9}Z` }));
}

export function initArch(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-arch-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-arch-range]');
  const out = q<HTMLOutputElement>(tool, '[data-arch-out]');
  const status = q<HTMLElement>(tool, '[data-arch-status]');
  const curve = q<SVGPathElement>(tool, '[data-arch-curve]');
  const loads = q<SVGGElement>(tool, '[data-arch-loads]');
  const towers = q<SVGGElement>(tool, '[data-arch-towers]');
  const arrows = q<SVGGElement>(tool, '[data-arch-arrows]');
  const label = q<SVGTextElement>(tool, '[data-arch-label]');
  const modes = [...tool.querySelectorAll<HTMLButtonElement>('[data-arch-mode]')];
  let mode: 'arch' | 'cable' = 'arch';

  const clear = (g: Element) => {
    while (g.firstChild) g.removeChild(g.firstChild);
  };

  function update(quiet = false) {
    const r = Number(range.value) / 100;
    fillRange(range);
    out.textContent = r === 0.25 ? 'one quarter of the span' : r === 0.5 ? 'half the span' : `${Math.round(r * 100)}% of the span`;
    const f = archForces(r);
    const rise = r * SPAN * 0.52; // drawn smaller than the span so it fits in the picture

    // The arch rises from the ground. The cable hangs from the tops of two towers.
    const startY = mode === 'arch' ? GROUND : GROUND - 250;
    const path = mode === 'arch' ? `M${X0} ${GROUND}Q${(X0 + X1) / 2} ${GROUND - 2 * rise} ${X1} ${GROUND}` : `M${X0} ${startY}Q${(X0 + X1) / 2} ${startY + 2 * rise} ${X1} ${startY}`;
    curve.setAttribute('d', path);
    curve.setAttribute('class', mode === 'arch' ? 'member compress' : 'member tension');

    // The load: arrows pointing down onto the curve along the span
    clear(loads);
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const curveY = mode === 'arch' ? GROUND - 4 * rise * t * (1 - t) : startY + 4 * rise * t * (1 - t);
      arrow(loads, X0 + SPAN * t, curveY - 46, 0, 36, 'load');
    }

    clear(towers);
    if (mode === 'cable') {
      towers.appendChild(el('rect', { class: 'tower', x: X0 - 12, y: startY - 6, width: 24, height: GROUND - startY + 6 }));
      towers.appendChild(el('rect', { class: 'tower', x: X1 - 12, y: startY - 6, width: 24, height: GROUND - startY + 6 }));
    } else {
      towers.appendChild(el('rect', { class: 'tower', x: X0 - 36, y: GROUND, width: 36, height: 30 }));
      towers.appendChild(el('rect', { class: 'tower', x: X1, y: GROUND, width: 36, height: 30 }));
    }

    // The forces at the two feet (or tower tops). Lengths are in proportion to the numbers.
    clear(arrows);
    const unit = 120; // pixels for 1 whole load
    const vy = f.vertical * unit;
    const hx = Math.min(f.sideways * unit, 150);
    const fy = mode === 'arch' ? GROUND : startY;
    if (mode === 'arch') {
      // the ground pushes up and in on the foot, so the foot pushes down and out on the ground
      arrow(arrows, X0 - 6, fy, -hx, 0, 'push');
      arrow(arrows, X1 + 6, fy, hx, 0, 'push');
      arrow(arrows, X0 - 18, fy + 12, 0, Math.min(vy, 70), 'push');
      arrow(arrows, X1 + 18, fy + 12, 0, Math.min(vy, 70), 'push');
    } else {
      // the cable pulls the tower top inwards and down
      arrow(arrows, X0 + 8, fy, hx, 0, 'pull');
      arrow(arrows, X1 - 8, fy, -hx, 0, 'pull');
      arrow(arrows, X0 + 20, fy + 8, 0, Math.min(vy, 70), 'pull');
      arrow(arrows, X1 - 20, fy + 8, 0, Math.min(vy, 70), 'pull');
    }
    label.textContent = mode === 'arch' ? 'arch: every part is squeezed' : 'cable: every part is stretched';

    const word = mode === 'arch' ? 'pushed' : 'pulled';
    const side = mode === 'arch' ? 'outwards on the ground' : 'inwards on the tower top';
    const flat = r <= 0.15 ? ' This is a very flat curve, so the sideways force is large.' : r >= 0.45 ? ' This is a tall curve, so the sideways force is small.' : '';
    status.textContent = `With a ${mode === 'arch' ? 'rise' : 'sag'} of ${Math.round(r * 100)}% of the span, each ${mode === 'arch' ? 'foot' : 'tower top'} is ${word} down with ${f.vertical.toFixed(2)} of the whole load and ${side} with ${f.sideways.toFixed(2)} of the whole load. Along the ${mode === 'arch' ? 'arch' : 'cable'} at the end the force is ${f.along.toFixed(2)}.${flat}`;
    if (!quiet) sound.play('tick');
  }

  for (const b of modes) {
    b.addEventListener('click', () => {
      mode = b.dataset.archMode as 'arch' | 'cable';
      for (const m of modes) m.setAttribute('aria-pressed', String(m === b));
      update();
      sound.play('pop');
    });
  }
  range.addEventListener('input', () => update());
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-arch-jump]')) {
    b.addEventListener('click', () => {
      range.value = b.dataset.archJump!;
      update();
    });
  }
  update(true);
}
