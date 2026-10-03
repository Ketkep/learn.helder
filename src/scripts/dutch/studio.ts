// Stop 6: the lamp. The picture is drawn twice, dim and in full color. The lamp moves a soft
// circle that shows the full-color one. When the circle is over a person, the card says who it is.

import * as sound from '../sound';
import { clamp, q, reducedMotion } from '../util';

interface Place {
  id: string;
  x: number;
  y: number;
}
interface Sitter {
  id: string;
  name: string;
  text: string;
}

const W = 720;
const H = 400;
const RADIUS = 128;
/** The light circle is centered this far above the lamp, so the lamp never hides a face. */
const LIFT = 46;

export function initStudio(root: HTMLElement) {
  const station = root.querySelector<HTMLElement>('[data-station="studio"]');
  if (!station) return;
  const scene = q<HTMLElement>(station, '[data-st]');
  const frame = q<HTMLElement>(station, '[data-st-frame]');
  const light = q<SVGCircleElement>(station, '[data-st-light]');
  const glow = q<SVGCircleElement>(station, '[data-st-glow]');
  const lamp = q<HTMLButtonElement>(station, '[data-st-lamp]');
  const status = q<HTMLElement>(station, '[data-st-status]');
  const goButtons = [...station.querySelectorAll<HTMLButtonElement>('[data-st-go]')];
  const places: Place[] = JSON.parse(scene.dataset.places ?? '[]');
  const sitters: Sitter[] = JSON.parse(scene.dataset.sitters ?? '[]');

  const intro = status.textContent ?? '';
  let x = 130;
  let y = 300;
  let current = '';
  let glide = 0;

  function move(nx: number, ny: number) {
    x = clamp(nx, 24, W - 24);
    y = clamp(ny, 24, H - 24);
    const ly = y - LIFT;
    light.setAttribute('cx', x.toFixed(1));
    light.setAttribute('cy', ly.toFixed(1));
    light.setAttribute('r', String(RADIUS));
    glow.setAttribute('cx', x.toFixed(1));
    glow.setAttribute('cy', ly.toFixed(1));
    glow.setAttribute('r', String(RADIUS * 1.35));
    lamp.style.left = `${(x / W) * 100}%`;
    lamp.style.top = `${(y / H) * 100}%`;

    // Who is in the light? The nearest person within reach.
    let best: Place | null = null;
    let bestD = 96;
    for (const p of places) {
      const d = Math.hypot(p.x - x, p.y - ly);
      if (d < bestD) {
        best = p;
        bestD = d;
      }
    }
    const id = best?.id ?? '';
    if (id !== current) {
      current = id;
      const sitter = sitters.find((s) => s.id === id);
      status.innerHTML = sitter ? `<strong>${sitter.name}.</strong> ${sitter.text}` : intro;
      if (sitter) sound.play('clink');
      goButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.stGo === id)));
    }
  }

  /** Slides the lamp to a spot instead of jumping, unless the reader asked for less motion. */
  function glideTo(tx: number, ty: number) {
    cancelAnimationFrame(glide);
    if (reducedMotion()) {
      move(tx, ty);
      return;
    }
    const sx = x;
    const sy = y;
    const start = performance.now();
    const step = (t: number) => {
      const k = clamp((t - start) / 450, 0, 1);
      const e = 1 - (1 - k) ** 3;
      move(sx + (tx - sx) * e, sy + (ty - sy) * e);
      if (k < 1) glide = requestAnimationFrame(step);
    };
    glide = requestAnimationFrame(step);
  }

  const toPicture = (e: PointerEvent) => {
    const r = frame.getBoundingClientRect();
    return { px: ((e.clientX - r.left) / r.width) * W, py: ((e.clientY - r.top) / r.height) * H };
  };

  lamp.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    cancelAnimationFrame(glide);
    lamp.setPointerCapture(e.pointerId);
    lamp.dataset.drag = 'on';
  });
  lamp.addEventListener('pointermove', (e) => {
    if (lamp.dataset.drag !== 'on') return;
    const { px, py } = toPicture(e);
    move(px, py);
  });
  const drop = () => {
    delete lamp.dataset.drag;
  };
  lamp.addEventListener('pointerup', drop);
  lamp.addEventListener('pointercancel', drop);

  lamp.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 60 : 24;
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (!d[e.key]) return;
    e.preventDefault();
    move(x + d[e.key][0], y + d[e.key][1]);
  });

  // A tap on the picture sends the lamp there
  frame.addEventListener('click', (e) => {
    if ((e.target as Element).closest('[data-st-lamp]')) return;
    const r = frame.getBoundingClientRect();
    glideTo(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H);
  });

  goButtons.forEach((b) =>
    b.addEventListener('click', () => {
      const p = places.find((o) => o.id === b.dataset.stGo);
      if (p) glideTo(p.x, p.y + 4 + LIFT - 40);
    }),
  );

  scene.classList.add('on');
  move(x, y);
}
