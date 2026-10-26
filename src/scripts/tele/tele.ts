// The telescope page: four stations. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { bucketSvg, fmt, lensesSvg, lightTimes, magnification, MOON_ARCSEC, moonThrough, rayleighArcsec, sharpSvg, STEPS } from '../../lib/tele';

const root = document.querySelector<HTMLElement>('[data-tele]');

if (root) {
  initSoundButton(root);

  // Station 1: two lenses
  const le = root.querySelector<HTMLElement>('[data-lenses-tool]');
  if (le) {
    const ro = q<HTMLInputElement>(le, '[data-lenses-ro]');
    const re = q<HTMLInputElement>(le, '[data-lenses-re]');
    const draw = () => {
      [ro, re].forEach(fillRange);
      const fo = Number(ro.value);
      const fe = Number(re.value);
      q(le, '[data-lenses-fo]').textContent = fmt(fo);
      q(le, '[data-lenses-fe]').textContent = String(fe);
      q(le, '[data-lenses-g]').innerHTML = lensesSvg(fo, fe);
      const m = magnification(fo, fe);
      q(le, '[data-lenses-status]').textContent = `${fmt(fo)} divided by ${fe} gives ${fmt(m, m < 10 ? 1 : 0)} times. The Moon, about half a degree wide, looks ${fmt(moonThrough(m), moonThrough(m) < 10 ? 1 : 0)} degrees wide.${m > 100 ? ' Past a point more magnification only makes a bigger blur.' : ''}`;
    };
    ro.addEventListener('input', draw);
    re.addEventListener('input', draw);
    draw();
  }

  // Station 2: the light bucket
  const bu = root.querySelector<HTMLElement>('[data-bucket-tool]');
  if (bu) {
    const range = q<HTMLInputElement>(bu, '[data-bucket-range]');
    const picks = bu.querySelectorAll<HTMLElement>('[data-bucket-pick]');
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(bu, '[data-bucket-out]').textContent = fmt(d);
      q(bu, '[data-bucket-g]').innerHTML = bucketSvg(d);
      q(bu, '[data-bucket-status]').textContent = `An opening of ${fmt(d)} mm gathers ${fmt(lightTimes(d))} times as much light as a 5 mm eye.${d > 350 ? ' The picture cannot draw it to scale, so the circle stops growing.' : ''}`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const mm = Number(b.getAttribute('data-bucket-pick'));
        range.value = String(Math.min(500, mm));
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        draw();
        if (mm > 500) {
          q(bu, '[data-bucket-out]').textContent = fmt(mm);
          q(bu, '[data-bucket-status]').textContent = `An opening of ${fmt(mm)} mm gathers ${fmt(lightTimes(mm))} times as much light as a 5 mm eye. The slider stops at 500 mm, and the circle stops growing in the picture.`;
        }
        sound.play('tick', 0.3);
      }),
    );
    range.addEventListener('input', () => {
      picks.forEach((p) => p.setAttribute('aria-pressed', 'false'));
      draw();
    });
    draw();
  }

  // Station 3: how sharp
  const sh = root.querySelector<HTMLElement>('[data-sharp-tool]');
  if (sh) {
    const range = q<HTMLInputElement>(sh, '[data-sharp-range]');
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(sh, '[data-sharp-out]').textContent = String(d);
      q(sh, '[data-sharp-g]').innerHTML = sharpSvg(d);
      const a = rayleighArcsec(d);
      q(sh, '[data-sharp-status]').textContent = `An opening of ${d} mm can separate details ${fmt(a, 2)} arcseconds wide, which is ${fmt(MOON_ARCSEC / a)} times finer than the width of the Moon.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Station 4: history
  const hi = root.querySelector<HTMLElement>('[data-history-tool]');
  if (hi) {
    const items = hi.querySelectorAll<HTMLElement>('[data-step]');
    let n = 0;
    const draw = () => {
      items.forEach((li, i) => {
        li.classList.toggle('shown', i <= n);
        li.classList.toggle('now', i === n);
      });
      q(hi, '[data-history-status]').textContent = `Step ${n + 1} of ${STEPS.length}: ${STEPS[n].name}, ${STEPS[n].size}. ${STEPS[n].text}`;
    };
    q(hi, '[data-history-next]').addEventListener('click', () => {
      n = Math.min(n + 1, STEPS.length - 1);
      sound.play('tick', 0.4);
      draw();
    });
    q(hi, '[data-history-reset]').addEventListener('click', () => {
      n = 0;
      draw();
    });
    hi.classList.add('stepper');
    draw();
  }
}
