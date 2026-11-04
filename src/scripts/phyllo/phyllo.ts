// The sunflower page: three rings. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { FIB, GOLDEN, fmt, gap, headSvg, landscapeSvg, rays } from '../../lib/phyllo';

const root = document.querySelector<HTMLElement>('[data-phyllo]');

/** A row of buttons, one of which is chosen. */
function picks(host: Element, labels: string[], start: string, on: (v: string) => void) {
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

/** What an angle does, in words. */
function says(angle: number, g: number): string {
  const r = rays(angle);
  if (r) return `A turn of ${fmt(angle, 1).replace('.0', '')} degrees is a simple fraction of the circle, so the seeds fall on ${r} straight ${r === 1 ? 'ray' : 'rays'} and leave wide gaps. The biggest gap is about ${fmt(g, 1)} times the average spacing.`;
  return `A turn of ${fmt(angle, 1).replace('.0', '')} degrees is not a simple fraction of the circle, so the seeds fall on no straight rays. The biggest gap is about ${fmt(g, 1)} times the average spacing.`;
}

if (root) {
  initSoundButton(root);

  // Ring 1: turn each new seed by the same angle
  const tu = root.querySelector<HTMLElement>('[data-turn-tool]');
  if (tu) {
    const range = q<HTMLInputElement>(tu, '[data-turn-range]');
    const count = q<HTMLInputElement>(tu, '[data-turn-n]');
    const draw = () => {
      [range, count].forEach(fillRange);
      const a = Number(range.value);
      const n = Number(count.value);
      q(tu, '[data-turn-out]').textContent = fmt(a, 1);
      q(tu, '[data-turn-n-out]').textContent = String(n);
      q(tu, '[data-turn-g]').innerHTML = headSvg(a, n);
      q(tu, '[data-turn-status]').textContent = says(a, gap(a, Math.min(n, 400)));
    };
    const set = (a: number) => {
      range.value = String(a);
      draw();
    };
    picks(q(tu, '[data-turn-picks]'), ['90°', '120°', '144°', '137.5° (golden)'], '137.5° (golden)', (v) => set(v.startsWith('137') ? Math.round(GOLDEN * 10) / 10 : Number(v.replace('°', ''))));
    [range, count].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Ring 2: count the spiral arms
  const co = root.querySelector<HTMLElement>('[data-count-tool]');
  if (co) {
    const draw = (k: number) => {
      q(co, '[data-count-g]').innerHTML = headSvg(GOLDEN, 500, k);
      const i = FIB.indexOf(k);
      const other = [FIB[i + 1] ?? 89, i > 0 ? FIB[i - 1] : 3];
      q(co, '[data-count-status]').textContent = `The seeds picked out make ${k} arms curving one way. The other way there are ${other[0]}, or ${other[1]}, depending on how far out you look.`;
    };
    picks(q(co, '[data-count-picks]'), FIB.map(String), '21', (v) => draw(Number(v)));
    draw(21);
  }

  // Ring 3: which angles leave gaps
  const ga = root.querySelector<HTMLElement>('[data-gaps-tool]');
  if (ga) {
    const range = q<HTMLInputElement>(ga, '[data-gaps-range]');
    const draw = () => {
      fillRange(range);
      const a = Number(range.value);
      q(ga, '[data-gaps-out]').textContent = fmt(a, 1);
      q(ga, '[data-gaps-g]').innerHTML = landscapeSvg(a);
      q(ga, '[data-gaps-status]').textContent = says(a, gap(a, 300));
    };
    range.addEventListener('input', draw);
    draw();
  }
}
