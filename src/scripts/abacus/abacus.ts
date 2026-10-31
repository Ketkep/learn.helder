// The abacus page: three frames. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, fillRange, q } from '../util';
import { addSteps, DESIGNS, fmt, largestRod, rodsOf, rodValue, valueOf, waysToShow, type Design, type Rod } from '../../lib/abacus';

const root = document.querySelector<HTMLElement>('[data-abacus]');

/** Builds an abacus out of buttons. onBead runs with the rod, the part and the new bead count. */
function build(host: Element, design: Design, rods: Rod[], onBead?: (rod: number, part: 'up' | 'low', n: number) => void) {
  clear(host);
  const frame = document.createElement('div');
  frame.className = 'soroban';
  rods.forEach((r, i) => {
    const col = document.createElement('div');
    col.className = 'rodcol';
    const mkArea = (part: 'up' | 'low', count: number, active: number) => {
      const area = document.createElement('div');
      area.className = `area ${part}`;
      area.style.setProperty('--n', String(count));
      const beads: HTMLElement[] = [];
      for (let k = 0; k < count; k++) {
        const on = part === 'up' ? k >= count - active : k < active;
        const b = document.createElement(onBead ? 'button' : 'span');
        b.className = `bead${on ? ' on' : ''}`;
        if (onBead) {
          const el = b as HTMLButtonElement;
          el.type = 'button';
          el.setAttribute('aria-pressed', on ? 'true' : 'false');
          el.setAttribute('aria-label', `Rod ${rods.length - i}, ${part === 'up' ? 'upper' : 'lower'} bead ${part === 'up' ? count - k : k + 1}, ${on ? 'at the beam' : 'away from the beam'}`);
          el.addEventListener('click', () => {
            // Pushing a bead moves it and all the beads between it and the beam
            const next = part === 'up' ? (on ? count - k - 1 : count - k) : on ? k : k + 1;
            onBead(i, part, next);
          });
        }
        beads.push(b);
      }
      const spacer = document.createElement('span');
      spacer.className = 'gap';
      const act = part === 'up' ? beads.filter((_, k) => k >= count - active) : beads.filter((_, k) => k < active);
      const idle = beads.filter((b) => !act.includes(b));
      (part === 'up' ? [...idle, spacer, ...act] : [...act, spacer, ...idle]).forEach((n) => area.appendChild(n));
      return area;
    };
    col.appendChild(mkArea('up', design.up, r.up));
    const beam = document.createElement('span');
    beam.className = 'beam';
    col.appendChild(beam);
    col.appendChild(mkArea('low', design.low, r.low));
    frame.appendChild(col);
  });
  host.appendChild(frame);
}

const digitsOnly = (s: string) => s.replace(/\D/g, '');

if (root) {
  initSoundButton(root);

  // Frame 1: read the rods
  const re = root.querySelector<HTMLElement>('[data-read-tool]');
  if (re) {
    const rig = q(re, '[data-read-rig]');
    const input = q<HTMLInputElement>(re, '[data-read-input]');
    let rods = rodsOf(3904);
    const draw = () => {
      build(rig, DESIGNS[0], rods, (i, part, n) => {
        rods[i] = { ...rods[i], [part]: n };
        draw();
        sound.play('tick', 0.3);
      });
      const v = valueOf(rods);
      input.value = String(v);
      q(re, '[data-read-status]').textContent = `The rods read ${fmt(v)}. Rod values from the left: ${rods.map(rodValue).join(', ')}.`;
    };
    input.addEventListener('input', () => {
      const t = digitsOnly(input.value);
      if (t !== input.value) input.value = t;
      if (t === '') return;
      rods = rodsOf(Number(t));
      draw();
      input.value = t;
    });
    q(re, '[data-read-clear]').addEventListener('click', () => {
      rods = rodsOf(0);
      draw();
    });
    draw();
  }

  // Frame 2: add with a carry
  const ad = root.querySelector<HTMLElement>('[data-add-tool]');
  if (ad) {
    const rig = q(ad, '[data-add-rig]');
    const aIn = q<HTMLInputElement>(ad, '[data-add-a]');
    const bIn = q<HTMLInputElement>(ad, '[data-add-b]');
    const list = q(ad, '[data-add-steps]');
    let steps = addSteps(4789, 1536);
    let at = 0;
    const show = () => {
      build(rig, DESIGNS[0], rodsOf(steps[at].value));
      clear(list);
      steps.slice(0, at + 1).forEach((s) => {
        const li = document.createElement('li');
        li.textContent = s.text;
        list.appendChild(li);
      });
      q(ad, '[data-add-status]').textContent = at === steps.length - 1 ? `Done. ${steps[at].text}` : `Step ${at + 1} of ${steps.length}. ${steps[at].text}`;
    };
    const reset = () => {
      const a = Number(digitsOnly(aIn.value) || '0');
      const b = Number(digitsOnly(bIn.value) || '0');
      steps = addSteps(a, b);
      at = 0;
      show();
    };
    q(ad, '[data-add-next]').addEventListener('click', () => {
      if (at < steps.length - 1) at += 1;
      show();
      sound.play('tick', 0.3);
    });
    q(ad, '[data-add-reset]').addEventListener('click', reset);
    q(ad, '[data-add-nines]').addEventListener('click', () => {
      aIn.value = '999';
      bIn.value = '1';
      reset();
    });
    [aIn, bIn].forEach((i) =>
      i.addEventListener('input', () => {
        const t = digitsOnly(i.value);
        if (t !== i.value) i.value = t;
        reset();
      }),
    );
    reset();
  }

  // Frame 3: two layouts
  const de = root.querySelector<HTMLElement>('[data-designs-tool]');
  if (de) {
    const rig = q(de, '[data-designs-rig]');
    const range = q<HTMLInputElement>(de, '[data-designs-range]');
    const picks = q(de, '[data-designs-picks]');
    let k = 0;
    const draw = () => {
      fillRange(range);
      const d = DESIGNS[k];
      const v = Number(range.value);
      q(de, '[data-designs-out]').textContent = String(v);
      const ways = waysToShow(v, d);
      clear(rig);
      if (!ways.length) {
        const p = document.createElement('p');
        p.className = 'none';
        p.textContent = `A ${d.name.split(' (')[0]} rod cannot show ${v}. The most it shows is ${largestRod(d)}.`;
        rig.appendChild(p);
      } else {
        const row = document.createElement('div');
        row.className = 'ways';
        ways.forEach((w) => {
          const holder = document.createElement('div');
          holder.className = 'way';
          build(holder, d, [{ up: w.up, low: w.low }]);
          row.appendChild(holder);
        });
        rig.appendChild(row);
      }
      q(de, '[data-designs-status]').textContent = ways.length
        ? `On the ${d.name.split(' (')[0].toLowerCase()}, ${v} has ${ways.length === 1 ? 'one way' : ways.length + ' ways'} to be shown${ways.length > 1 ? ': ' + ways.map((w) => `${w.up} upper and ${w.low} lower`).join(', or ') : ''}. ${d.where}`
        : `A ${d.name.split(' (')[0].toLowerCase()} rod cannot show ${v}.`;
    };
    DESIGNS.forEach((d, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pick';
      b.textContent = d.name;
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', () => {
        k = i;
        picks.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        draw();
        sound.play('tick', 0.3);
      });
      picks.appendChild(b);
    });
    range.addEventListener('input', draw);
    draw();
  }

}
