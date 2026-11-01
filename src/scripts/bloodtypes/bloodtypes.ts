// The blood types page: three branches. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, fillRange, q } from '../util';
import { child, family, familySvg, fmt, GENOTYPES, possible, punnettSvg, TYPES, typeOf } from '../../lib/bloodtypes';

const root = document.querySelector<HTMLElement>('[data-bloodtypes]');

/** A row of buttons, one of which is chosen. */
function picks(host: HTMLElement, labels: string[], start: string, on: (v: string) => void) {
  labels.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = l;
    b.setAttribute('aria-pressed', l === start ? 'true' : 'false');
    b.addEventListener('click', () => {
      host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      on(l);
      sound.play('tick', 0.3);
    });
    host.appendChild(b);
  });
}

const row = (body: Element, label: string, cells: string[]) => {
  const tr = document.createElement('tr');
  const th = document.createElement('th');
  th.scope = 'row';
  th.textContent = label;
  tr.appendChild(th);
  cells.forEach((c) => {
    const td = document.createElement('td');
    td.textContent = c;
    tr.appendChild(td);
  });
  body.appendChild(tr);
};

if (root) {
  initSoundButton(root);

  // Branch 1: a square for two parents
  const sq = root.querySelector<HTMLElement>('[data-square-tool]');
  if (sq) {
    let a = 'AO';
    let b = 'BO';
    const draw = () => {
      q(sq, '[data-square-g]').innerHTML = punnettSvg(a, b);
      const c = child(a, b);
      const body = q(sq, '[data-square-body]');
      clear(body);
      TYPES.filter((t) => c.types[t]).forEach((t) => row(body, t, [`${fmt(c.types[t] * 100)}%`]));
      q(sq, '[data-square-status]').textContent = `Parents ${a} and ${b}: ${Object.entries(c.genotypes).map(([g, p]) => `${g} ${fmt(p * 100)}%`).join(', ')}. In blood groups: ${TYPES.filter((t) => c.types[t]).map((t) => `${t} ${fmt(c.types[t] * 100)}%`).join(', ')}.`;
    };
    picks(q(sq, '[data-square-first]'), GENOTYPES, a, (v) => {
      a = v;
      draw();
    });
    picks(q(sq, '[data-square-second]'), GENOTYPES, b, (v) => {
      b = v;
      draw();
    });
    draw();
  }

  // Branch 2: which groups can a child have
  const po = root.querySelector<HTMLElement>('[data-possible-tool]');
  if (po) {
    let a = 'A';
    let b = 'B';
    const draw = () => {
      const list = possible(a, b);
      const say = (p: { possible: boolean; min: number; max: number }) => (!p.possible ? 'impossible' : p.min === p.max ? `${Math.round(p.max * 100)}%` : `${Math.round(p.min * 100)} to ${Math.round(p.max * 100)}%`);
      const body = q(po, '[data-possible-body]');
      clear(body);
      row(body, `${a} and ${b}`, list.map(say));
      const yes = list.filter((p) => p.possible).map((p) => p.type);
      const no = list.filter((p) => !p.possible).map((p) => p.type);
      const list2 = (xs: string[], word = 'and') => (xs.length === 1 ? `group ${xs[0]}` : `group ${xs.slice(0, -1).join(', ')} ${word} ${xs[xs.length - 1]}`);
      const varies = list.some((p) => p.possible && p.min !== p.max);
      q(po, '[data-possible-status]').textContent = `Parents of group ${a} and group ${b}: a child can be ${list2(yes, 'or')}.${no.length ? ` A child of ${list2(no, 'or')} is impossible.` : ' Every group is possible.'}${varies ? ' The ranges are because a parent of a group may have hidden copies of O.' : ''}`;
    };
    picks(q(po, '[data-possible-first]'), TYPES, a, (v) => {
      a = v;
      draw();
    });
    picks(q(po, '[data-possible-second]'), TYPES, b, (v) => {
      b = v;
      draw();
    });
    draw();
  }

  // Branch 3: a family by chance
  const fa = root.querySelector<HTMLElement>('[data-family-tool]');
  if (fa) {
    let a = 'AO';
    let b = 'BO';
    let seed = 3;
    const range = q<HTMLInputElement>(fa, '[data-family-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(fa, '[data-family-out]').textContent = String(n);
      const kids = family(a, b, n, seed);
      q(fa, '[data-family-g]').innerHTML = familySvg(a, b, kids);
      const counts = TYPES.map((t) => `${kids.filter((k) => typeOf(k) === t).length} of group ${t}`).join(', ');
      q(fa, '[data-family-status]').textContent = `Parents ${a} and ${b} have ${n} ${n === 1 ? 'child' : 'children'}: ${counts}.`;
    };
    picks(q(fa, '[data-family-first]'), GENOTYPES, a, (v) => {
      a = v;
      draw();
    });
    picks(q(fa, '[data-family-second]'), GENOTYPES, b, (v) => {
      b = v;
      draw();
    });
    range.addEventListener('input', draw);
    q(fa, '[data-family-next]').addEventListener('click', () => {
      seed += 1;
      draw();
      sound.play('pop', 0.3);
    });
    draw();
  }
}
