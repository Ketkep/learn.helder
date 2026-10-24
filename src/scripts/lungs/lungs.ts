// The lungs page: four jars. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { AIR, fmt, jarSvg, jarText, pctText, perDay, perMinute, syringeSvg, syringeText, type Which } from '../../lib/lungs';

const root = document.querySelector<HTMLElement>('[data-lungs]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  initSoundButton(root);

  // Jar 1: the syringe
  const sy = root.querySelector<HTMLElement>('[data-syringe-tool]');
  if (sy) {
    const range = q<HTMLInputElement>(sy, '[data-syringe-range]');
    const draw = () => {
      fillRange(range);
      const ml = Number(range.value);
      q(sy, '[data-syringe-out]').textContent = String(ml);
      q(sy, '[data-syringe-g]').innerHTML = syringeSvg(ml);
      q(sy, '[data-syringe-status]').textContent = syringeText(ml);
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Jar 2: the chest
  const ch = root.querySelector<HTMLElement>('[data-chest-tool]');
  if (ch) {
    const range = q<HTMLInputElement>(ch, '[data-chest-range]');
    const tubes = ch.querySelectorAll<HTMLElement>('[data-chest-tube]');
    let open = true;
    const draw = () => {
      fillRange(range);
      const pull = Number(range.value);
      q(ch, '[data-chest-out]').textContent = String(pull);
      q(ch, '[data-chest-g]').innerHTML = jarSvg(pull);
      q(ch, '[data-chest-status]').textContent = jarText(pull, open);
    };
    tubes.forEach((b) =>
      b.addEventListener('click', () => {
        open = b.getAttribute('data-chest-tube') === 'open';
        press(tubes, b);
        if (open && Number(range.value) > 0) sound.play('whoosh', 0.3);
        draw();
      }),
    );
    range.addEventListener('input', draw);
    draw();
  }

  // Jar 3: breaths and litres
  const mi = root.querySelector<HTMLElement>('[data-minute-tool]');
  if (mi) {
    const rate = q<HTMLInputElement>(mi, '[data-minute-rate-range]');
    const lit = q<HTMLInputElement>(mi, '[data-minute-litres-range]');
    const draw = () => {
      [rate, lit].forEach(fillRange);
      const r = Number(rate.value);
      const l = Number(lit.value) / 10;
      q(mi, '[data-minute-rate]').textContent = String(r);
      q(mi, '[data-minute-litres]').textContent = l.toFixed(1);
      q(mi, '[data-minute-status]').textContent = `${r} breaths of ${l.toFixed(1)} litres make ${fmt(perMinute(r, l), 1)} litres a minute, about ${fmt(perDay(r, l))} litres in a day.${r === 12 && l === 0.5 ? ' A resting adult is around there.' : ''}`;
    };
    rate.addEventListener('input', draw);
    lit.addEventListener('input', draw);
    draw();
  }

  // Jar 4: air in, air out
  const ai = root.querySelector<HTMLElement>('[data-air-tool]');
  if (ai) {
    const picks = ai.querySelectorAll<HTMLElement>('[data-air-pick]');
    const show = (w: Which) => {
      const a = AIR[w];
      q<HTMLElement>(ai, '[data-air-o]').style.width = `${(a.oxygen / 25) * 100}%`;
      q<HTMLElement>(ai, '[data-air-c]').style.width = `${Math.max((a.carbon / 25) * 100, 1)}%`;
      q(ai, '[data-air-o-num]').textContent = pctText(a.oxygen);
      q(ai, '[data-air-c-num]').textContent = pctText(a.carbon);
      q(ai, '[data-air-status]').textContent = `${a.name}: about ${pctText(a.oxygen)} oxygen, ${pctText(a.carbon)} carbon dioxide and ${pctText(a.nitrogen)} nitrogen.${w === 'exhaled' ? ' The lungs took up about a quarter of the oxygen, and the carbon dioxide is about a hundred times higher.' : ''}`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        press(picks, b);
        show((b.getAttribute('data-air-pick') as Which) || 'inhaled');
        sound.play('tick', 0.3);
      }),
    );
    show('inhaled');
  }
}
