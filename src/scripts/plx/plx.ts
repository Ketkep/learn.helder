// The parallax page: four plates. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { angleFromSlider, barShare, coinKm, fmt, lyFromSlider, lyOf, parallaxFromSlider, parallaxOf, reachLy, shiftSvg, shiftText, sig, SUN_MIN, sliderFromAngle, sliderFromParallax, stars, tools } from '../../lib/plx';

const root = document.querySelector<HTMLElement>('[data-plx]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  initSoundButton(root);

  // Plate 1: the yearly swing
  const sh = root.querySelector<HTMLElement>('[data-shift-tool]');
  if (sh) {
    const dist = q<HTMLInputElement>(sh, '[data-shift-dist]');
    const time = q<HTMLInputElement>(sh, '[data-shift-time]');
    const draw = () => {
      fillRange(dist);
      fillRange(time);
      const ly = lyFromSlider(Number(dist.value));
      const m = Number(time.value);
      q(sh, '[data-shift-ly]').textContent = sig(ly);
      q(sh, '[data-shift-month]').textContent = String(m);
      q(sh, '[data-shift-g]').innerHTML = shiftSvg(ly, m);
      q(sh, '[data-shift-status]').textContent = shiftText(ly);
    };
    dist.addEventListener('input', draw);
    time.addEventListener('input', draw);
    draw();
  }

  // Plate 2: from angle to distance
  const an = root.querySelector<HTMLElement>('[data-angle-tool]');
  if (an) {
    const picks = an.querySelectorAll<HTMLElement>('[data-angle-pick]');
    const range = q<HTMLInputElement>(an, '[data-angle-range]');
    let note = '';
    const draw = () => {
      fillRange(range);
      const p = parallaxFromSlider(Number(range.value));
      const ly = lyOf(p);
      q(an, '[data-angle-out]').textContent = sig(p);
      q<HTMLElement>(an, '[data-angle-bar]').style.width = `${barShare(ly) * 100}%`;
      q(an, '[data-angle-status]').textContent = `${note ? note + ': ' : ''}a parallax of ${sig(p)} arcseconds is ${sig(1 / p)} parsecs, or ${ly >= 100 ? fmt(ly) : fmt(ly, 2)} light years.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const s = stars.find((x) => x.id === b.getAttribute('data-angle-pick'));
        if (!s) return;
        press(picks, b);
        note = s.name;
        range.value = String(sliderFromParallax(parallaxOf(s.ly)));
        sound.play('tick', 0.4);
        draw();
        q(an, '[data-angle-status]').textContent = `${s.name}: a parallax of ${sig(parallaxOf(s.ly))} arcseconds is ${sig(1 / parallaxOf(s.ly))} parsecs, or ${fmt(s.ly, 2)} light years. ${s.note}`;
      }),
    );
    range.addEventListener('input', () => {
      note = '';
      press(picks, null);
      draw();
    });
    draw();
  }

  // Plate 3: the thinnest angle
  const sm = root.querySelector<HTMLElement>('[data-small-tool]');
  if (sm) {
    const picks = sm.querySelectorAll<HTMLElement>('[data-small-pick]');
    const range = q<HTMLInputElement>(sm, '[data-small-range]');
    let note = '';
    const draw = () => {
      fillRange(range);
      const a = angleFromSlider(Number(range.value));
      q(sm, '[data-small-out]').textContent = sig(a);
      q(sm, '[data-small-status]').textContent = `${note ? note + ' ' : ''}An angle of ${sig(a)} arcseconds is a one euro coin about ${fmt(coinKm(a), coinKm(a) < 10 ? 1 : 0)} km away. A parallax that small reaches about ${fmt(reachLy(a))} light years.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const t = tools.find((x) => x.id === b.getAttribute('data-small-pick'));
        if (!t) return;
        press(picks, b);
        note = t.note;
        range.value = String(sliderFromAngle(t.precision));
        sound.play('tick', 0.4);
        draw();
      }),
    );
    range.addEventListener('input', () => {
      note = '';
      press(picks, null);
      draw();
    });
    draw();
  }

  // Plate 4: old light
  const ol = root.querySelector<HTMLElement>('[data-old-tool]');
  if (ol) {
    const picks = ol.querySelectorAll<HTMLElement>('[data-old-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        press(picks, b);
        const id = b.getAttribute('data-old-pick');
        sound.play('tick', 0.4);
        q(ol, '[data-old-status]').textContent =
          id === 'sun'
            ? `The Sun: the light you see left it ${fmt(SUN_MIN, 1)} minutes ago. It is the nearest star, 1 AU away.`
            : (() => {
                const s = stars.find((x) => x.id === id);
                return s ? `${s.name}: the light you see tonight left it ${fmt(s.ly, 2)} years ago. ${s.note}` : '';
              })();
      }),
    );
  }
}
