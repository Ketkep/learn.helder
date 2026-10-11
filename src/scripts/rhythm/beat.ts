// Board 1: a steady beat.

import * as sound from '../sound';
import { clear, fillRange, q } from '../util';
import { beatSeconds, signatures } from '../../lib/rhythm';
import { isPlaying, playButton, setPlaying, startLoop, stopLoop } from './clock';

export function initBeat(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-beat-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-beat-range]');
  const lights = q<HTMLElement>(tool, '[data-beat-lights]');
  const status = q<HTMLElement>(tool, '[data-beat-status]');
  const play = q<HTMLButtonElement>(tool, '[data-beat-play]');
  const sigs = [...tool.querySelectorAll<HTMLButtonElement>('[data-beat-sig]')];
  let beats = 4;

  function drawLights() {
    clear(lights);
    for (let i = 0; i < beats; i++) {
      const s = document.createElement('span');
      s.className = i === 0 ? 'light first' : 'light';
      lights.appendChild(s);
    }
  }

  function text() {
    const bpm = Number(range.value);
    const sig = signatures.find((s) => s.beats === beats)!;
    fillRange(range);
    q(tool!, '[data-beat-out]').textContent = `${bpm} BPM`;
    status.textContent = `At ${bpm} BPM there is a beat every ${beatSeconds(bpm).toFixed(2)} seconds. A bar of ${beats} beats (${sig.name}, ${sig.note}) lasts ${(beatSeconds(bpm) * beats).toFixed(1)} seconds.`;
  }

  function start() {
    const ms = beatSeconds(Number(range.value)) * 1000;
    stopLoop();
    setPlaying(play, true);
    startLoop(
      ms * beats,
      Array.from({ length: beats }, (_, i) => ({
        at: i * ms,
        fn: () => {
          lights.querySelectorAll('.light').forEach((l, j) => l.classList.toggle('now', j === i));
          sound.play(i === 0 ? 'pop' : 'tick');
        },
      })),
      () => {
        setPlaying(play, false);
        lights.querySelectorAll('.light').forEach((l) => l.classList.remove('now'));
      },
    );
  }

  playButton(play, start);
  range.addEventListener('input', () => {
    text();
    if (isPlaying() && play.getAttribute('aria-pressed') === 'true') start();
  });
  for (const b of sigs) {
    b.addEventListener('click', () => {
      beats = signatures.find((s) => s.id === b.dataset.beatSig)!.beats;
      for (const o of sigs) {
        o.setAttribute('aria-pressed', String(o === b));
        o.classList.toggle('fill', o === b);
      }
      drawLights();
      text();
      if (play.getAttribute('aria-pressed') === 'true') start();
    });
  }
  drawLights();
  text();
}
