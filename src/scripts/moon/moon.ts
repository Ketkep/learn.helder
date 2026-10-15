// The Moon page: four stations. This file starts each one.

import { fillRange, q } from '../util';
import { dayStripSvg, eclipseStatus, elongation, faceSvg, fmtHour, litFraction, monthStatus, monthSvg, orbitSvg, phaseName, riseHour, sideSvg, yearStripSvg } from '../../lib/moon';

const root = document.querySelector<HTMLElement>('[data-moon]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Station 1: move the Moon
  const look = root.querySelector<HTMLElement>('[data-look-tool]');
  if (look) {
    const range = q<HTMLInputElement>(look, '[data-look-range]');
    const drawLook = () => {
      fillRange(range);
      const days = Number(range.value);
      const e = elongation(days);
      q(look, '[data-look-out]').textContent = days.toFixed(1);
      q(look, '[data-look-orbit-g]').innerHTML = orbitSvg(e);
      q(look, '[data-look-face-g]').innerHTML = faceSvg(e);
      const lit = Math.round(litFraction(e) * 100);
      q(look, '[data-look-status]').textContent = `${days.toFixed(1)} days after new moon the Moon is ${Math.round(e)} degrees from the Sun in the sky. It is a ${phaseName(e).toLowerCase()}, with about ${lit} per cent of the face lit.`;
    };
    range.addEventListener('input', drawLook);
    drawLook();
  }

  // Station 2: when it comes up
  const rise = root.querySelector<HTMLElement>('[data-rise-tool]');
  if (rise) {
    const picks = rise.querySelectorAll<HTMLElement>('[data-rise-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const e = Number(b.getAttribute('data-rise-pick'));
        press(picks, b);
        q(rise, '[data-rise-g]').innerHTML = dayStripSvg(e);
        const r = riseHour(e);
        q(rise, '[data-rise-status]').textContent = `A ${b.textContent?.toLowerCase()} rises about ${fmtHour(r)} and sets about ${fmtHour((r + 12) % 24)}.`;
      }),
    );
  }

  // Station 3: a month longer than a lap
  const month = root.querySelector<HTMLElement>('[data-month-tool]');
  if (month) {
    const range = q<HTMLInputElement>(month, '[data-month-range]');
    const drawMonth = () => {
      fillRange(range);
      const days = Number(range.value);
      q(month, '[data-month-out]').textContent = days.toFixed(1);
      q(month, '[data-month-g]').innerHTML = monthSvg(days);
      q(month, '[data-month-status]').textContent = monthStatus(days);
    };
    range.addEventListener('input', drawMonth);
    month.querySelectorAll<HTMLElement>('[data-month-set]').forEach((b) =>
      b.addEventListener('click', () => {
        range.value = b.getAttribute('data-month-set') || '0';
        drawMonth();
      }),
    );
    drawMonth();
  }

  // Station 4: why not every month
  const ecl = root.querySelector<HTMLElement>('[data-eclipse-tool]');
  if (ecl) {
    const range = q<HTMLInputElement>(ecl, '[data-eclipse-range]');
    const kinds = ecl.querySelectorAll<HTMLElement>('[data-eclipse-kind]');
    let full = false;
    const drawEcl = () => {
      fillRange(range);
      const k = Number(range.value) - 1;
      q(ecl, '[data-eclipse-out]').textContent = String(k + 1);
      q(ecl, '[data-eclipse-g]').innerHTML = sideSvg(k, full);
      q(ecl, '[data-eclipse-year-g]').innerHTML = yearStripSvg(k, full);
      q(ecl, '[data-eclipse-status]').textContent = eclipseStatus(k, full);
    };
    range.addEventListener('input', drawEcl);
    kinds.forEach((b) =>
      b.addEventListener('click', () => {
        full = b.getAttribute('data-eclipse-kind') === 'full';
        press(kinds, b);
        drawEcl();
      }),
    );
    drawEcl();
  }
}
