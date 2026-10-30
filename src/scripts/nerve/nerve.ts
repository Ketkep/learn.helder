// The nerve page: four oscilloscope screens. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { ABSOLUTE_MS, fires, fmt, FAST, pushSvg, raceSvg, REST, RELATIVE_MS, secondPush, SLOW, spikeTrain, THRESHOLD, trainSvg, travelMs, twoSvg } from '../../lib/nerve';

const root = document.querySelector<HTMLElement>('[data-nerve]');

if (root) {
  initSoundButton(root);

  // Screen 1: the threshold
  const pu = root.querySelector<HTMLElement>('[data-push-tool]');
  if (pu) {
    const range = q<HTMLInputElement>(pu, '[data-push-range]');
    let was = true;
    const draw = () => {
      fillRange(range);
      const p = Number(range.value);
      q(pu, '[data-push-out]').textContent = String(p);
      q(pu, '[data-push-g]').innerHTML = pushSvg(p);
      const f = fires(p);
      q(pu, '[data-push-status]').textContent = f
        ? `A push of ${p} mV lifts the cell from ${REST} to ${REST + p} mV, ${REST + p === THRESHOLD ? 'exactly to' : 'past'} the threshold of ${THRESHOLD}, so there is a full spike. A bigger push gives the same spike.`
        : `A push of ${p} mV lifts the cell only to ${REST + p} mV, short of the threshold of ${THRESHOLD}. The voltage fades back and nothing is sent.`;
      if (f !== was) sound.play(f ? 'good' : 'tick', 0.3);
      was = f;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Screen 2: harder push, more spikes
  const tr = root.querySelector<HTMLElement>('[data-train-tool]');
  if (tr) {
    const range = q<HTMLInputElement>(tr, '[data-train-range]');
    const draw = () => {
      fillRange(range);
      const p = Number(range.value);
      q(tr, '[data-train-out]').textContent = String(p);
      q(tr, '[data-train-g]').innerHTML = trainSvg(p);
      const n = spikeTrain(p).length;
      q(tr, '[data-train-status]').textContent = n === 0 ? `A steady push of ${p} mV does not get past the threshold for long, so there are no spikes.` : `A steady push of ${p} mV gives ${n} ${n === 1 ? 'spike' : 'spikes'} in a tenth of a second, or ${fmt(n * 10)} a second. Every spike is the same size.`;
    };
    range.addEventListener('input', draw);
    range.addEventListener('change', () => {
      const n = spikeTrain(Number(range.value)).length;
      for (let i = 0; i < Math.min(n, 8); i++) window.setTimeout(() => sound.play('tick', 0.25), i * Math.max(40, 400 / Math.max(n, 1)));
    });
    draw();
  }

  // Screen 3: a rest after every spike
  const tw = root.querySelector<HTMLElement>('[data-two-tool]');
  if (tw) {
    const gap = q<HTMLInputElement>(tw, '[data-two-gap]');
    const push = q<HTMLInputElement>(tw, '[data-two-push]');
    const draw = () => {
      [gap, push].forEach(fillRange);
      const g = Number(gap.value);
      const p = Number(push.value);
      q(tw, '[data-two-outg]').textContent = String(g);
      q(tw, '[data-two-outp]').textContent = String(p);
      q(tw, '[data-two-g]').innerHTML = twoSvg(g, p);
      const r = secondPush(g, p);
      const words = {
        blocked: `Under ${ABSOLUTE_MS} ms is the absolute refractory period, so no push can start a second spike.`,
        harder: `This is the relative refractory period (${ABSOLUTE_MS} to ${RELATIVE_MS} ms), and ${p} mV is too weak. No second spike.`,
        fires: g < RELATIVE_MS ? `This is the relative refractory period, but ${p} mV is strong enough. A second spike starts.` : `The cell has recovered, and ${p} mV is enough. A second spike starts.`,
        fades: `The cell has recovered, but ${p} mV is below the push needed (${THRESHOLD - REST} mV). No second spike.`,
      };
      q(tw, '[data-two-status]').textContent = `A second push of ${p} mV after ${g} ms. ${words[r]}`;
    };
    gap.addEventListener('input', draw);
    push.addEventListener('input', draw);
    draw();
  }

  // Screen 4: how fast it travels
  const sp = root.querySelector<HTMLElement>('[data-speed-tool]');
  if (sp) {
    const range = q<HTMLInputElement>(sp, '[data-speed-range]');
    const draw = () => {
      fillRange(range);
      const m = Number(range.value) / 10;
      q(sp, '[data-speed-out]').textContent = m.toFixed(1);
      q(sp, '[data-speed-g]').innerHTML = raceSvg(m);
      const fast = travelMs(m, FAST);
      q(sp, '[data-speed-status]').textContent = `Along ${m.toFixed(1)} m of fibre, a signal takes ${fmt(travelMs(m, SLOW))} ms without myelin and ${fmt(fast, fast < 10 ? 1 : 0)} ms with it, which is ${FAST / SLOW} times as fast.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
