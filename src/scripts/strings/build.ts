// String 5: additive sound. Six harmonics of 110 Hz, each with a level from 0 to 10. The line shows their sum.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { BASE_HZ } from './music';

export function initSound(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-sound-tool]');
  if (!tool) return;
  const sliders = [...tool.querySelectorAll<HTMLInputElement>('[data-harm]')];
  const wave = q<SVGPathElement>(tool, '[data-sound-wave]');
  const status = q<HTMLElement>(tool, '[data-sound-status]');

  const levels = () => sliders.map((s) => Number(s.value) / 10);

  function draw() {
    const l = levels();
    const peak = Math.max(1, ...Array.from({ length: 200 }, (_, i) => Math.abs(l.reduce((sum, v, n) => sum + v * Math.sin(2 * Math.PI * (n + 1) * (i / 100)), 0))));
    let d = '';
    for (let i = 0; i <= 400; i++) {
      const x = i / 200; // 0 to 2 vibrations
      const y = l.reduce((sum, v, n) => sum + v * Math.sin(2 * Math.PI * (n + 1) * x), 0) / peak;
      d += `${i ? 'L' : 'M'}${(40 + 920 * (i / 400)).toFixed(1)} ${(100 - 70 * y).toFixed(1)}`;
    }
    wave.setAttribute('d', d);
    sliders.forEach(fillRange);
    const on = l.map((v, i) => (v > 0 ? i + 1 : 0)).filter(Boolean);
    const odd = on.length > 1 && on.every((n) => n % 2 === 1);
    status.textContent =
      on.length === 0
        ? 'All the levels are at zero, so there is no sound.'
        : on.length === 1 && on[0] === 1
          ? 'Only harmonic 1: a pure tone, the plainest sound there is. Raise another slider to add a harmonic.'
          : `Harmonics ${on.join(', ')} are in the mix${odd ? ': only the odd ones, which gives a hollow sound' : ''}. The line shows a different shape from a plain wave, and the ear hears a different character. The note is still ${BASE_HZ} vibrations a second.`;
  }

  function play() {
    sound.pluck(BASE_HZ, levels(), 2);
  }

  for (const s of sliders) s.addEventListener('input', draw);
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-sound-preset]')) {
    b.addEventListener('click', () => {
      b.dataset.soundPreset!.split(',').forEach((v, i) => (sliders[i].value = v));
      draw();
      play();
    });
  }
  q<HTMLButtonElement>(tool, '[data-sound-play]').addEventListener('click', play);
  draw();
}
