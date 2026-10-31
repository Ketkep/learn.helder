// The aurora page: three stops. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { bandAt, columnSvg, edgeLatitude, energyEv, fmt, LINES, ovalSvg, spectrumSvg, terahertz } from '../../lib/aurora';

const root = document.querySelector<HTMLElement>('[data-aurora]');

if (root) {
  initSoundButton(root);

  // Stop 1: how far south the lights spread
  const ov = root.querySelector<HTMLElement>('[data-oval-tool]');
  if (ov) {
    const range = q<HTMLInputElement>(ov, '[data-oval-range]');
    const draw = () => {
      fillRange(range);
      const k = Number(range.value);
      q(ov, '[data-oval-out]').textContent = String(k);
      q(ov, '[data-oval-g]').innerHTML = ovalSvg(k);
      q(ov, '[data-oval-status]').textContent = `At Kp ${k} the edge of the oval is at about ${edgeLatitude(k)} degrees of geomagnetic latitude.${k >= 7 ? ' This is a very disturbed day. The rule is an average, and one source puts the lights near 40 degrees at Kp 9.' : k === 0 ? ' This is a quiet day.' : ''}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Stop 2: a colour for each height
  const he = root.querySelector<HTMLElement>('[data-height-tool]');
  if (he) {
    const range = q<HTMLInputElement>(he, '[data-height-range]');
    const draw = () => {
      fillRange(range);
      const km = Number(range.value);
      q(he, '[data-height-out]').textContent = String(km);
      q(he, '[data-height-g]').innerHTML = columnSvg(km);
      const b = bandAt(km);
      q(he, '[data-height-status]').textContent = `${km} km: ${b.name.toLowerCase()}. ${b.text}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Stop 3: the light of an atom
  const li = root.querySelector<HTMLElement>('[data-light-tool]');
  if (li) {
    const range = q<HTMLInputElement>(li, '[data-light-range]');
    const picks = q(li, '[data-light-picks]');
    const draw = () => {
      fillRange(range);
      const nm = Number(range.value) / 10;
      q(li, '[data-light-out]').textContent = fmt(nm, nm % 1 ? 1 : 0);
      q(li, '[data-light-g]').innerHTML = spectrumSvg(nm);
      q(li, '[data-light-status]').textContent = `Light of ${fmt(nm, nm % 1 ? 1 : 0)} nm carries ${fmt(energyEv(nm), 2)} electronvolts per photon, at a frequency of ${fmt(terahertz(nm))} terahertz.`;
    };
    LINES.forEach((l) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pick';
      b.textContent = `${l.name} ${l.nm} nm`;
      b.addEventListener('click', () => {
        range.value = String(Math.round(l.nm * 10));
        draw();
        sound.play('tick', 0.3);
      });
      picks.appendChild(b);
    });
    range.addEventListener('input', draw);
    draw();
  }
}
