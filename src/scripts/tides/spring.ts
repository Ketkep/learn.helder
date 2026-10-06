// Bench 3: spring and neap tides. The Sun's tide and the Moon's tide are two bulges that add up or cancel.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import type { Staff } from './quay';
import { MONTH_D, SUN_SHARE, rangeShare } from './model';

const CX = 400;
const CY = 175;
const R = 64;
const ORBIT = 150;
const BUMP = 22;
const SX0 = 96;
const SX1 = 750;
const STOP = 376;
const SBOT = 428;

const phaseName = (age: number) => {
  const a = ((age % MONTH_D) + MONTH_D) % MONTH_D;
  const q = MONTH_D / 4;
  const near = (target: number) => Math.min(Math.abs(a - target), MONTH_D - Math.abs(a - target)) < 0.9;
  if (near(0)) return 'new moon';
  if (near(q)) return 'first quarter';
  if (near(2 * q)) return 'full moon';
  if (near(3 * q)) return 'last quarter';
  if (a < q) return 'waxing crescent';
  if (a < 2 * q) return 'waxing gibbous';
  if (a < 3 * q) return 'waning gibbous';
  return 'waning crescent';
};

export function initSpring(root: HTMLElement, staff: Staff) {
  const tool = root.querySelector<HTMLElement>('[data-spring-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(root, '[data-spring-range]');
  const out = q<HTMLOutputElement>(root, '[data-spring-out]');
  const status = q<HTMLElement>(root, '[data-spring-status]');
  const water = q<SVGPathElement>(tool, '[data-spring-water]');
  const moon = q<SVGGElement>(tool, '[data-spring-moon]');
  const cursor = q<SVGLineElement>(tool, '[data-spring-cursor]');
  const dot = q<SVGCircleElement>(tool, '[data-spring-dot]');
  let lastKind = '';

  function draw(age: number) {
    // Angles run anticlockwise from the right. The Sun is on the left (180 degrees).
    const sun = Math.PI;
    const moonAngle = sun + (2 * Math.PI * age) / MONTH_D;
    moon.setAttribute('transform', `translate(${(CX + ORBIT * Math.cos(moonAngle)).toFixed(1)} ${(CY - ORBIT * Math.sin(moonAngle)).toFixed(1)})`);

    // The water is a circle with two bumps: the Moon's (size 1) and the Sun's (size 0.46)
    let d = '';
    for (let i = 0; i < 90; i++) {
      const a = (i / 90) * Math.PI * 2;
      const sum = Math.cos(2 * (a - moonAngle)) + SUN_SHARE * Math.cos(2 * (a - sun));
      const r = R + 3 + (BUMP * (1 + SUN_SHARE + sum)) / (1 + SUN_SHARE);
      d += `${i ? 'L' : 'M'}${(CX + r * Math.cos(a)).toFixed(1)} ${(CY - r * Math.sin(a)).toFixed(1)}`;
    }
    water.setAttribute('d', `${d}Z`);

    const share = rangeShare(age);
    const x = SX0 + ((SX1 - SX0) * age) / MONTH_D;
    const y = SBOT - (SBOT - STOP) * ((share - 0.3) / 0.7);
    cursor.setAttribute('x1', String(x));
    cursor.setAttribute('x2', String(x));
    dot.setAttribute('cx', String(x));
    dot.setAttribute('cy', String(y));
    return share;
  }

  function set(age: number, quiet = false) {
    range.value = String(age);
    fillRange(range);
    out.textContent = age.toFixed(1);
    const share = draw(age);
    const pct = Math.round(share * 100);
    const name = phaseName(age);
    const kind = share > 0.9 ? 'spring' : share < 0.5 ? 'neap' : 'between';
    const what =
      kind === 'spring'
        ? 'The Sun and the Moon pull along the same line, so their tides add up. This is a spring tide.'
        : kind === 'neap'
          ? 'The Sun and the Moon pull at right angles, so the Sun’s tide partly cancels the Moon’s. This is a neap tide.'
          : 'The Sun and the Moon pull at a slant, so the tide is between a spring tide and a neap tide.';
    status.textContent = `Day ${age.toFixed(1)}, ${name}. ${what} The range is about ${pct} per cent of a spring tide.`;
    staff.set('spring', { level: 0.5 + share / 2, range: share, text: `Tide range ${pct}% of a spring tide` });
    if (!quiet && kind !== lastKind) sound.play('tick');
    lastKind = kind;
  }

  range.addEventListener('input', () => set(Number(range.value)));
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-spring-jump]')) {
    b.addEventListener('click', () => {
      set(Number(b.dataset.springJump));
      sound.play('pop');
    });
  }
  set(0, true);
}
