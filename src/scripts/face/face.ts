// The Moon face page: four prints. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { bulgeSvg, distanceAfter, facing, fmt, MODE_TEXT, type Mode, ORBIT_DAYS, orbitAfter, periodDays, periodText, viewSvg, WORLDS } from '../../lib/face';

const root = document.querySelector<HTMLElement>('[data-face]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  initSoundButton(root);

  // Print 1: spin it or not
  const sp = root.querySelector<HTMLElement>('[data-spin-tool]');
  if (sp) {
    const modes = sp.querySelectorAll<HTMLElement>('[data-spin-mode]');
    const range = q<HTMLInputElement>(sp, '[data-spin-range]');
    let mode: Mode = 'locked';
    const draw = () => {
      fillRange(range);
      const o = Number(range.value);
      q(sp, '[data-spin-out]').textContent = String(o);
      q(sp, '[data-spin-day]').textContent = fmt((o / 360) * ORBIT_DAYS, 1);
      q(sp, '[data-spin-g]').innerHTML = viewSvg(mode, o);
      q(sp, '[data-spin-status]').textContent = `${MODE_TEXT[mode]} At this point the marked side points ${facing(mode, o)}.`;
    };
    modes.forEach((b) =>
      b.addEventListener('click', () => {
        mode = (b.getAttribute('data-spin-mode') as Mode) || 'locked';
        press(modes, b);
        sound.play('tick', 0.3);
        draw();
      }),
    );
    range.addEventListener('input', draw);
    draw();
  }

  // Print 2: how tides lock it
  const lo = root.querySelector<HTMLElement>('[data-lock-tool]');
  if (lo) {
    let steps = 0;
    const draw = () => {
      q(lo, '[data-lock-g]').innerHTML = bulgeSvg(steps);
      const d = periodDays(steps);
      const done = Math.abs(d - ORBIT_DAYS) / ORBIT_DAYS < 0.005;
      q(lo, '[data-lock-status]').textContent = steps === 0
        ? `At the start, in this toy, the Moon spins once in ${periodText(d)}. Real Moon: it is locked, with a spin of 27.32 days.`
        : `After ${steps} step${steps === 1 ? '' : 's'} the toy Moon spins once in ${periodText(d)}.${done ? ' That is within half a per cent of the 27.32 days of its orbit. The bulge points straight at Earth. The Moon is locked.' : ' The bulge is still carried a little ahead of the line to Earth, and Earth’s pull on it keeps braking the spin.'}`;
    };
    q(lo, '[data-lock-age]').addEventListener('click', () => {
      steps = Math.min(steps + 1, 40);
      sound.play('tick', 0.3);
      draw();
    });
    q(lo, '[data-lock-reset]').addEventListener('click', () => {
      steps = 0;
      draw();
    });
    draw();
  }

  // Print 3: the Moon moving away
  const aw = root.querySelector<HTMLElement>('[data-away-tool]');
  if (aw) {
    const range = q<HTMLInputElement>(aw, '[data-away-range]');
    const draw = () => {
      fillRange(range);
      const m = Number(range.value);
      q(aw, '[data-away-out]').textContent = String(m);
      q(aw, '[data-away-status]').textContent = m === 0
        ? `Today the average distance is about ${fmt(distanceAfter(0))} km and one orbit takes ${fmt(orbitAfter(0), 2)} days. At 3.8 cm a year the Moon moves about 38 km in a million years.`
        : `After ${m} million years at the same rate the distance would be about ${fmt(distanceAfter(m))} km, which is ${fmt(distanceAfter(m) - distanceAfter(0))} km more, and one orbit would take about ${fmt(orbitAfter(m), 2)} days. The rate has not stayed the same, so this is a rough picture.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Print 4: other worlds
  const wo = root.querySelector<HTMLElement>('[data-worlds-tool]');
  if (wo) {
    const picks = wo.querySelectorAll<HTMLElement>('[data-worlds-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const w = WORLDS.find((x) => x.id === b.getAttribute('data-worlds-pick'));
        if (!w) return;
        press(picks, b);
        q(wo, '[data-worlds-status]').textContent = `${w.name}: ${w.text}`;
        sound.play('tick', 0.3);
      }),
    );
    wo.classList.add('picker');
  }
}
