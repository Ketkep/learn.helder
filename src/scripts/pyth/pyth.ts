// The Pythagoras page: four slabs. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { allTriples, cornerSvg, euclid, fmt, hyp, isTriple, kindOf, moveSvg, moveText, squaresSvg } from '../../lib/pyth';

const root = document.querySelector<HTMLElement>('[data-pyth]');

if (root) {
  initSoundButton(root);

  // Slab 1: three squares
  const sq = root.querySelector<HTMLElement>('[data-squares-tool]');
  if (sq) {
    const ra = q<HTMLInputElement>(sq, '[data-squares-ra]');
    const rb = q<HTMLInputElement>(sq, '[data-squares-rb]');
    let was = true;
    const draw = () => {
      [ra, rb].forEach(fillRange);
      const a = Number(ra.value);
      const b = Number(rb.value);
      q(sq, '[data-squares-a]').textContent = String(a);
      q(sq, '[data-squares-b]').textContent = String(b);
      q(sq, '[data-squares-g]').innerHTML = squaresSvg(a, b);
      const c2 = a * a + b * b;
      const c = hyp(a, b);
      const whole = isTriple(a, b);
      q(sq, '[data-squares-status]').textContent = `${a} × ${a} = ${a * a} and ${b} × ${b} = ${b * b}. Together ${c2}, and the square on the long side is ${c2}. The long side is ${whole ? c : `about ${fmt(c, 3)}`}${whole ? `, a whole number, so ${Math.min(a, b)}, ${Math.max(a, b)}, ${c} is a Pythagorean triple` : ', not a whole number'}.`;
      if (whole && !was) sound.play('good', 0.3);
      was = whole;
    };
    ra.addEventListener('input', draw);
    rb.addEventListener('input', draw);
    draw();
  }

  // Slab 2: move four triangles
  const mo = root.querySelector<HTMLElement>('[data-move-tool]');
  if (mo) {
    const range = q<HTMLInputElement>(mo, '[data-move-range]');
    const draw = () => {
      fillRange(range);
      const t = Number(range.value) / 100;
      q(mo, '[data-move-out]').textContent = range.value;
      q(mo, '[data-move-g]').innerHTML = moveSvg(t);
      q(mo, '[data-move-status]').textContent = moveText(t);
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Slab 3: whole number triangles
  const tr = root.querySelector<HTMLElement>('[data-triples-tool]');
  if (tr) {
    const rm = q<HTMLInputElement>(tr, '[data-triples-rm]');
    const rn = q<HTMLInputElement>(tr, '[data-triples-rn]');
    const body = q(tr, '[data-triples-body]');
    const list = allTriples(100);
    const rows = (n: number) => list.slice(0, n).map((t) => `<tr><td>${t.a}</td><td>${t.b}</td><th scope="row">${t.c}</th><td>${t.primitive ? 'yes' : 'no'}</td></tr>`).join('');
    const draw = () => {
      const m = Number(rm.value);
      rn.max = String(m - 1);
      if (Number(rn.value) >= m) rn.value = String(m - 1);
      [rm, rn].forEach(fillRange);
      const n = Number(rn.value);
      q(tr, '[data-triples-m]').textContent = String(m);
      q(tr, '[data-triples-n]').textContent = String(n);
      const [a, b, c] = euclid(m, n);
      const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);
      const prim = gcd(m, n) === 1 && (m + n) % 2 === 1;
      q(tr, '[data-triples-status]').textContent = `With m = ${m} and n = ${n} the sides are ${a}, ${b} and ${c}. Check: ${a} × ${a} + ${b} × ${b} = ${a * a + b * b} and ${c} × ${c} = ${c * c}. ${prim ? 'This triple is primitive.' : 'This is a multiple of a smaller triple, so it is not primitive.'}`;
    };
    rm.addEventListener('input', draw);
    rn.addEventListener('input', draw);
    q(tr, '[data-triples-all]').addEventListener('click', () => {
      body.innerHTML = rows(list.length);
      sound.play('pop', 0.3);
    });
    draw();
  }

  // Slab 4: is the corner square?
  const co = root.querySelector<HTMLElement>('[data-corner-tool]');
  if (co) {
    const ins = (['x', 'y', 'z'] as const).map((k) => q<HTMLInputElement>(co, `[data-corner-r${k}]`));
    let wasRight = true;
    const draw = () => {
      ins.forEach(fillRange);
      const [x, y, z] = ins.map((i) => Number(i.value));
      (['x', 'y', 'z'] as const).forEach((k, i) => (q(co, `[data-corner-${k}]`).textContent = String(ins[i].value)));
      q(co, '[data-corner-g]').innerHTML = cornerSvg(x, y, z);
      const { kind, sides, angle } = kindOf(x, y, z);
      const [a, b, c] = sides;
      const text = kind === 'none'
        ? `${a} + ${b} is not more than ${c}, so no triangle can have these sides.`
        : `The two short sides give ${a} × ${a} + ${b} × ${b} = ${a * a + b * b} and the long side gives ${c} × ${c} = ${c * c}. ${kind === 'right' ? 'They are equal, so the corner is a right angle.' : kind === 'acute' ? `The sum is bigger, so the biggest angle is sharper than a right angle. It is about ${angle.toFixed(0)} degrees.` : `The sum is smaller, so the biggest angle is wider than a right angle. It is about ${angle.toFixed(0)} degrees.`}`;
      q(co, '[data-corner-status]').textContent = text;
      if (kind === 'right' && !wasRight) sound.play('good', 0.3);
      wasRight = kind === 'right';
    };
    ins.forEach((i) => i.addEventListener('input', draw));
    draw();
  }
}
