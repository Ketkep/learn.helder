// String 1: the bridge. Frequency is the whole-string frequency divided by the shaking length.

import * as sound from '../sound';
import { clamp, fillRange, q, reducedMotion } from '../util';
import { BASE_HZ, hz, noteName } from './music';

const X0 = 70;
const X1 = 930;
const Y = 125;

export function initLength(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-length-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-length-range]');
  const out = q<HTMLOutputElement>(tool, '[data-length-out]');
  const hzEl = q<HTMLElement>(tool, '[data-length-hz]');
  const noteEl = q<HTMLElement>(tool, '[data-length-note]');
  const status = q<HTMLElement>(tool, '[data-length-status]');
  const string = q<SVGPathElement>(tool, '[data-length-string]');
  const dead = q<SVGPathElement>(tool, '[data-length-dead]');
  const bridge = q<SVGGElement>(tool, '[data-length-bridge]');
  const svg = q<SVGSVGElement>(tool, 'svg');
  let share = 0.5; // the shaking length, 0.2 to 1
  let frame = 0;

  const words = (s: number) => {
    const pct = Math.round(s * 100);
    if (pct === 100) return 'whole';
    if (pct === 50) return '1/2';
    if (pct === 25) return '1/4';
    return `${pct}%`;
  };

  function draw(bend = 0, phase = 0) {
    const xb = X0 + (X1 - X0) * share;
    // A plucked string: a half sine wave that swings
    let d = `M${X0} ${Y}`;
    for (let i = 1; i <= 40; i++) {
      const t = i / 40;
      d += `L${(X0 + (xb - X0) * t).toFixed(1)} ${(Y + bend * Math.cos(phase) * Math.sin(Math.PI * t)).toFixed(1)}`;
    }
    string.setAttribute('d', d);
    dead.setAttribute('d', `M${xb} ${Y}L${X1} ${Y}`);
    bridge.setAttribute('transform', `translate(${xb.toFixed(1)} ${Y})`);
  }

  function update(quiet = false) {
    const f = BASE_HZ / share;
    range.value = String(Math.round(share * 100));
    fillRange(range);
    out.textContent = words(share);
    hzEl.textContent = `${hz(f)} Hz`;
    noteEl.textContent = `closest note ${noteName(f)}`;
    const octaves = Math.log2(1 / share);
    const rel = Math.abs(octaves - Math.round(octaves)) < 0.02 && Math.round(octaves) > 0 ? ` That is ${Math.round(octaves) === 1 ? 'one octave' : `${Math.round(octaves)} octaves`} above the whole string.` : '';
    status.textContent = `${words(share) === 'whole' ? 'The whole string shakes' : `The shaking part is ${words(share)} of the string`}: ${hz(f)} vibrations a second, closest note ${noteName(f)}.${rel}`;
    draw();
    if (!quiet) sound.play('tick');
  }

  function pluck() {
    const f = BASE_HZ / share;
    const length = sound.pluck(f, [1, 0.35, 0.12]);
    cancelAnimationFrame(frame);
    if (reducedMotion()) {
      string.classList.add('plucked');
      window.setTimeout(() => string.classList.remove('plucked'), 350);
      return;
    }
    const began = performance.now();
    const visual = 3 * (f / BASE_HZ); // swings a second on screen, slow enough to see
    const step = (now: number) => {
      const t = (now - began) / 1000;
      const fade = Math.exp(-t / ((length || 1.4) * 0.45));
      if (t > (length || 1.4) || fade < 0.02) return draw();
      draw(30 * fade, 2 * Math.PI * visual * t);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  range.addEventListener('input', () => {
    share = Number(range.value) / 100;
    update();
  });
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-length-jump]')) {
    b.addEventListener('click', () => {
      share = Number(b.dataset.lengthJump) / 100;
      update(true);
      pluck();
    });
  }
  q<HTMLButtonElement>(tool, '[data-length-pluck]').addEventListener('click', pluck);

  // Dragging the bridge, or touching the string, moves and plucks
  const toShare = (e: PointerEvent) => {
    const box = svg.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 1000;
    return clamp((x - X0) / (X1 - X0), 0.2, 1);
  };
  let dragging = false;
  bridge.style.cursor = 'grab';
  bridge.addEventListener('pointerdown', (e) => {
    dragging = true;
    bridge.setPointerCapture(e.pointerId);
    bridge.style.cursor = 'grabbing';
  });
  bridge.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    share = Math.round(toShare(e) * 100) / 100;
    update(true);
  });
  const stop = () => {
    if (!dragging) return;
    dragging = false;
    bridge.style.cursor = 'grab';
    pluck();
  };
  bridge.addEventListener('pointerup', stop);
  bridge.addEventListener('pointercancel', stop);
  svg.addEventListener('pointerdown', (e) => {
    if (!bridge.contains(e.target as Node)) pluck();
  });

  update(true);
}
