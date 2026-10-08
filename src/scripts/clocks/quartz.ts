// Plate 4: a crystal at 32,768 Hz (2 to the power 15) and 15 halvings down to 1 Hz.

import * as sound from '../sound';
import { fillRange, q, reducedMotion } from '../util';
import { driftPerDay, perSecond } from './physics';

export function initQuartz(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-quartz-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-quartz-range]');
  const out = q<HTMLOutputElement>(tool, '[data-quartz-out]');
  const ppm = q<HTMLInputElement>(tool, '[data-quartz-ppm]');
  const ppmOut = q<HTMLOutputElement>(tool, '[data-quartz-ppm-out]');
  const status = q<HTMLElement>(tool, '[data-quartz-status]');
  const lamp = q<HTMLElement>(tool, '[data-quartz-lamp]');
  const lampText = q<HTMLElement>(tool, '[data-quartz-lamp-text]');
  const blink = q<HTMLButtonElement>(tool, '[data-quartz-blink]');
  const rows = [...tool.querySelectorAll<HTMLElement>('[data-stage]')];
  let timer = 0;

  function update(quiet = false) {
    const n = Number(range.value);
    const hz = 32768 / 2 ** n;
    const drift = driftPerDay(Number(ppm.value));
    fillRange(range);
    fillRange(ppm);
    out.textContent = String(n);
    ppmOut.textContent = `${ppm.value} parts in a million`;
    rows.forEach((row, i) => {
      row.classList.toggle('on', i === n);
      row.classList.toggle('past', i < n);
    });
    const year = drift * 365;
    const where = n === 0 ? 'The crystal itself shakes' : n === 15 ? 'After 15 halvings the rate is' : `After ${n} halving${n === 1 ? '' : 's'} the rate is`;
    const done = n === 15 ? ' That is the pulse that moves the second hand.' : '';
    status.textContent = `${where} ${perSecond(hz)}.${done} A crystal that is off by ${ppm.value} parts in a million gains or loses about ${drift.toFixed(1)} seconds a day, or ${year < 120 ? `${Math.round(year)} seconds` : `${(year / 60).toFixed(1)} minutes`} in a year.`;
    if (blinkRate() !== blinkShown) restartBlink();
    if (!quiet) sound.play('tick');
  }

  const blinkRate = () => Math.min(32768 / 2 ** Number(range.value), 2);
  let blinkShown = 0;
  function stopBlink() {
    window.clearInterval(timer);
    timer = 0;
    lamp.classList.remove('lit');
    blink.textContent = 'Blink at this rate';
    blinkShown = 0;
  }
  function restartBlink() {
    if (!timer) return;
    window.clearInterval(timer);
    startBlink();
  }
  function startBlink() {
    const rate = blinkRate();
    blinkShown = rate;
    blink.textContent = 'Stop blinking';
    let on = false;
    timer = window.setInterval(() => {
      on = !on;
      lamp.classList.toggle('lit', on);
    }, 500 / rate);
    lampText.textContent = `The lamp blinks ${rate === 2 ? 'at its top rate of 2 times a second, because this rate is too fast to see' : rate === 1 ? 'once a second, like the pulse of a watch' : `${rate} times a second`}.`;
  }
  blink.addEventListener('click', () => (timer ? stopBlink() : startBlink()));
  if (reducedMotion()) {
    blink.hidden = true; // a blinking lamp is movement, so it is left out
    lamp.parentElement!.hidden = true;
  }

  range.addEventListener('input', () => update());
  ppm.addEventListener('input', () => update());
  update(true);
}
