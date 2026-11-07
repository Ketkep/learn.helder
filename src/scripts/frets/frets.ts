// The guitar fret page: three positions. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { INTERVALS, SCALES, STRINGS, cents, fmt, fretAt, gapsSvg, hzAt, neckSvg, noteAt, pureAt, remaining } from '../../lib/frets';

const root = document.querySelector<HTMLElement>('[data-frets]');

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

if (root) {
  initSoundButton(root);

  // Position 1: where the frets go
  const wh = root.querySelector<HTMLElement>('[data-where-tool]');
  if (wh) {
    let scale = SCALES[0];
    const range = q<HTMLInputElement>(wh, '[data-where-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(wh, '[data-where-out]').textContent = String(n);
      q(wh, '[data-where-g]').innerHTML = neckSvg(scale.mm, n);
      q(wh, '[data-where-status]').textContent =
        n === 0
          ? `With a scale length of ${scale.name}, the first fret is ${fmt(fretAt(scale.mm, 1), 1)} millimetres from the nut and the twelfth fret is ${fmt(fretAt(scale.mm, 12), 1)}, exactly halfway.`
          : `Fret ${n} is ${fmt(fretAt(scale.mm, n), 1)} millimetres from the nut. That leaves ${fmt(remaining(scale.mm, n), 1)} millimetres of string to vibrate, ${fmt((remaining(scale.mm, n) / scale.mm) * 100, 1)}% of the scale length.`;
    };
    picks(q(wh, '[data-where-picks]'), SCALES.map((s) => s.name), SCALES[0].name, (v) => {
      scale = SCALES.filter((s) => s.name === v)[0];
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Position 2: why the gaps shrink
  const ga = root.querySelector<HTMLElement>('[data-gaps-tool]');
  if (ga) {
    let str = STRINGS[0];
    const range = q<HTMLInputElement>(ga, '[data-gaps-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(ga, '[data-gaps-out]').textContent = String(n);
      q(ga, '[data-gaps-g]').innerHTML = gapsSvg(648, n);
      const hz = hzAt(str.hz, n);
      q(ga, '[data-gaps-status]').textContent = `${str.name} string, ${n === 0 ? 'open' : `fret ${n}`}: the note is ${noteAt(str.name, n)} at ${fmt(hz, 1)} hertz. The string left to vibrate is ${fmt((remaining(648, n) / 648) * 100, 1)}% of its length. Each fret multiplies the pitch by 1.0595.`;
    };
    picks(q(ga, '[data-gaps-picks]'), STRINGS.map((s) => s.name), STRINGS[0].name, (v) => {
      str = STRINGS.filter((s) => s.name === v)[0];
      draw();
    });
    range.addEventListener('input', draw);
    q(ga, '[data-gaps-play]').addEventListener('click', () => sound.pluck(hzAt(str.hz, Number(range.value)), [1, 0.5, 0.25]));
    draw();
  }

  // Position 3: a fret and a simple fraction
  const pu = root.querySelector<HTMLElement>('[data-pure-tool]');
  if (pu) {
    const draw = (name: string) => {
      const i = INTERVALS.filter((x) => x.name === name)[0];
      const x = (mm: number) => 20 + (mm / 648) * 260;
      const eq = fretAt(648, i.fret);
      const pure = pureAt(648, i.ratio);
      q(pu, '[data-pure-g]').innerHTML = `<rect class="neck" x="1" y="1" width="298" height="98" rx="8"/><line class="str" x1="20" y1="60" x2="280" y2="60" style="stroke-width:3"/><line class="fret hot" x1="${x(eq).toFixed(1)}" y1="40" x2="${x(eq).toFixed(1)}" y2="80"/><line class="fret" x1="${x(pure).toFixed(1)}" y1="40" x2="${x(pure).toFixed(1)}" y2="80" style="stroke-dasharray:3 3"/><text class="lab" x="12" y="18">${i.name}: fret ${i.fret} against ${i.simple}</text><text class="lab small" x="12" y="94">Solid: equal temperament. Dashed: simple fraction.</text>`;
      const off = cents(i.ratio) - i.fret * 100;
      q(pu, '[data-pure-status]').textContent = `${i.name}, a ratio of ${i.simple}. The fret of equal temperament is at ${fmt(eq, 1)} millimetres and the place of the simple fraction is at ${fmt(pure, 1)}, a difference of ${fmt(Math.abs(eq - pure), 1)} millimetres. The pitches differ by ${fmt(Math.abs(off), 1)} cents. A cent is a hundredth of a semitone.`;
    };
    picks(q(pu, '[data-pure-picks]'), INTERVALS.map((i) => i.name), 'Fifth', draw);
    draw('Fifth');
  }
}
