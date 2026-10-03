// Shot 6: a toy shake table. Three walls stand on slabs that shake side to side.
// The rigid wall cracks and falls when the shaking is strong. The other two can give and settle.
// This is a model of an idea, not an engineering test, and the page says so.

import * as sound from '../sound';
import { seeded } from '../../lib/rand';
import { reducedMotion, fillRange, q } from './util';

const FLOOR = 360; // the top of the slab in the drawing
const GRAVITY = 1200;
const SHAKE_HZ = 3.2;

interface Body {
  el: SVGRectElement;
  x0: number;
  y0: number;
  w: number;
  h: number;
  dx: number;
  dy: number;
  rot: number;
  vx: number;
  vy: number;
  om: number;
}

export function initLab(root: HTMLElement) {
  const found = root.querySelector<HTMLElement>('[data-lab-tool]');
  if (!found) return;
  const tool: HTMLElement = found;
  const range = q<HTMLInputElement>(root, '[data-lab-range]');
  const out = q<HTMLOutputElement>(root, '[data-lab-out]');
  const shakeBtn = q<HTMLButtonElement>(root, '[data-lab-shake]');
  const resetBtn = q<HTMLButtonElement>(root, '[data-lab-reset]');
  const status = q<HTMLElement>(root, '[data-lab-status]');
  const startText = status.textContent ?? '';
  const slabs = [...tool.querySelectorAll<SVGGElement>('[data-slab]')];
  const result = (id: string) => q<HTMLElement>(root, `[data-result="${id}"] span`);

  // The three walls
  const rigid = [...tool.querySelectorAll<SVGRectElement>('[data-model="rigid"] .blk')].map<Body>((el) => ({
    el,
    x0: Number(el.getAttribute('x')),
    y0: Number(el.getAttribute('y')),
    w: Number(el.getAttribute('width')),
    h: Number(el.getAttribute('height')),
    dx: 0,
    dy: 0,
    rot: 0,
    vx: 0,
    vy: 0,
    om: 0,
  }));
  const bricks = [...tool.querySelectorAll<SVGRectElement>('[data-model="shelf"] .brk')].map((el) => ({
    el,
    lean: Number(el.dataset.lean),
    k: Number(el.dataset.k),
    row: Number(el.parentElement?.getAttribute('data-row') ?? 0),
    shiftX: 0,
    shiftRot: 0,
  }));
  const bagRows = [...tool.querySelectorAll<SVGGElement>('[data-model="bags"] .row')].map((el) => ({
    el,
    r: Number(el.dataset.row),
    settle: 0,
  }));

  let collapsed = false;
  let cracked = false;
  let running = 0;

  const placeBody = (b: Body) => {
    b.el.style.transform = `translate(${b.dx.toFixed(2)}px, ${b.dy.toFixed(2)}px) rotate(${b.rot.toFixed(2)}deg)`;
  };

  function launch(strength: number) {
    const rnd = seeded(91 + strength);
    for (const b of rigid) {
      const cx = b.x0 + b.w / 2;
      b.vx = Math.sign(cx || 1) * (20 + rnd() * 70) + (rnd() - 0.5) * 40;
      b.vy = -rnd() * 50;
      b.om = (rnd() - 0.5) * 260;
    }
    collapsed = true;
  }

  /** One small step of the falling blocks. Returns true while anything is still moving. */
  function fall(dt: number) {
    let moving = false;
    for (const b of rigid) {
      b.vy += GRAVITY * dt;
      b.dx += b.vx * dt;
      b.dy += b.vy * dt;
      b.rot += b.om * dt;
      const left = -122 - b.x0;
      const right = 122 - (b.x0 + b.w);
      b.dx = Math.min(right, Math.max(left, b.dx));
      const floorDy = FLOOR - (b.y0 + b.h);
      if (b.dy > floorDy) {
        b.dy = floorDy;
        b.vy *= -0.22;
        b.vx *= 0.7;
        b.om *= 0.6;
      }
      if (Math.abs(b.vx) > 3 || Math.abs(b.vy) > 12 || Math.abs(b.om) > 6) moving = true;
      else {
        b.vx = 0;
        b.vy = 0;
        b.om = 0;
      }
      placeBody(b);
    }
    return moving;
  }

  function finish(strength: number) {
    // Where everything ends up, and what to say about it
    if (strength >= 8) {
      for (const b of bricks) {
        if (b.row === 2 && (b.k === 1 || b.k === 4 || b.k === 5)) {
          b.shiftX = b.k === 4 ? -3 : 3;
          b.shiftRot = b.k === 4 ? -5 : 4;
        }
        b.el.style.transform = `translate(${b.shiftX}px, 0px) rotate(${b.lean + b.shiftRot}deg)`;
      }
      for (const r of bagRows) {
        r.settle = (r.r % 2 ? -1 : 1) * 3;
        r.el.style.transform = `translate(${r.settle}px, 0px) scaleY(0.985)`;
      }
    } else {
      for (const b of bricks) b.el.style.transform = `translate(${b.shiftX}px, 0px) rotate(${b.lean + b.shiftRot}deg)`;
      for (const r of bagRows) r.el.style.transform = `translate(${r.settle}px, 0px)`;
    }
    for (const s of slabs) s.style.transform = 'translate(0px, 0px)';

    if (strength >= 4 && !collapsed) {
      tool.setAttribute('data-cracks', '');
      cracked = true;
    }
    result('rigid').textContent = collapsed
      ? 'Cracked and fell.'
      : cracked
        ? 'Still standing, but cracked.'
        : 'Still standing. That was a gentle shake.';
    result('shelf').textContent = strength >= 8 ? 'Rocked hard and some bricks shifted. Still standing.' : 'Rocked and settled back. Still standing.';
    result('bags').textContent = strength >= 8 ? 'The bags shifted and settled. Still standing.' : 'The stones shifted a little inside the bags. Still standing.';
    status.textContent = 'In this toy, the wall that cannot give fails first. Walls that can give a little last longer. That is the idea behind the bricks on end in Lima and the stone bags at Caral. Press Rebuild to try again.';
    shakeBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function shake() {
    const strength = Number(range.value);
    shakeBtn.disabled = true;
    resetBtn.disabled = true;
    const falls = strength >= 6 && !collapsed;
    sound.play('rumble', strength / 10);
    if (falls) launch(strength);

    // Without motion, show the end of the shake straight away
    if (reducedMotion()) {
      if (falls) for (let i = 0; i < 300; i++) fall(1 / 60);
      finish(strength);
      return;
    }

    const dur = 2.2 + strength * 0.09;
    const amp = strength * 2.3;
    const crackAt = Math.min(1, dur * 0.4);
    let falling = false;
    let moving = falls;
    let last = performance.now();
    const t0 = last;

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const env = Math.pow(Math.sin(Math.min(1, t / dur) * Math.PI), 0.7);
      const phase = 2 * Math.PI * SHAKE_HZ * t;
      const slabX = t < dur ? amp * Math.sin(phase) * env : 0;
      for (const s of slabs) s.style.transform = `translate(${slabX.toFixed(2)}px, 0px)`;

      if (t < dur) {
        for (const b of bricks) {
          const rot = b.lean + b.shiftRot + strength * 0.5 * Math.sin(phase - b.k * 0.5 - b.row * 0.4) * env;
          b.el.style.transform = `translate(${b.shiftX}px, 0px) rotate(${rot.toFixed(2)}deg)`;
        }
        for (const r of bagRows) {
          const dx = amp * 0.4 * ((r.r + 1) / 5) * Math.sin(phase - r.r * 0.35) * env + r.settle;
          const sy = 1 - 0.011 * strength * Math.abs(Math.sin(phase * 0.5 - r.r * 0.3)) * env;
          r.el.style.transform = `translate(${dx.toFixed(2)}px, 0px) scaleY(${sy.toFixed(3)})`;
        }
      }

      // The rigid wall holds for a moment, then cracks and the blocks fall
      if (falls && t >= crackAt) {
        if (!falling) {
          falling = true;
          sound.play('crack');
        }
        moving = fall(dt);
      }

      if (t < dur || (falls && (!falling || moving))) {
        running = requestAnimationFrame(frame);
      } else {
        finish(strength);
      }
    };
    running = requestAnimationFrame(frame);
  }

  function rebuild() {
    cancelAnimationFrame(running);
    for (const b of rigid) {
      b.dx = b.dy = b.rot = b.vx = b.vy = b.om = 0;
      b.el.style.transform = '';
    }
    for (const b of bricks) {
      b.shiftX = 0;
      b.shiftRot = 0;
      b.el.style.transform = `rotate(${b.lean}deg)`;
    }
    for (const r of bagRows) {
      r.settle = 0;
      r.el.style.transform = '';
    }
    for (const s of slabs) s.style.transform = '';
    tool.removeAttribute('data-cracks');
    collapsed = false;
    cracked = false;
    for (const id of ['rigid', 'shelf', 'bags']) result(id).textContent = 'Not shaken yet.';
    status.textContent = startText;
    shakeBtn.disabled = false;
    resetBtn.disabled = true;
    sound.play('pop');
  }

  range.addEventListener('input', () => {
    out.textContent = range.value;
    fillRange(range);
  });
  shakeBtn.addEventListener('click', shake);
  resetBtn.addEventListener('click', rebuild);
  fillRange(range);
}
