// The salty sea page: four pans. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { fmt, IONS, layerAt, LAYER_M, panSvg, saltier, settles, share, tubSvg } from '../../lib/brine';

const root = document.querySelector<HTMLElement>('[data-brine]');

if (root) {
  initSoundButton(root);

  // Pan 1: a bathtub of salt
  const tu = root.querySelector<HTMLElement>('[data-tub-tool]');
  if (tu) {
    const rin = q<HTMLInputElement>(tu, '[data-tub-rin]');
    const rout = q<HTMLInputElement>(tu, '[data-tub-rout]');
    const draw = () => {
      [rin, rout].forEach(fillRange);
      const i = Number(rin.value) / 10;
      const o = Number(rout.value) / 10;
      q(tu, '[data-tub-in]').textContent = i.toFixed(1);
      q(tu, '[data-tub-out]').textContent = o.toFixed(1);
      q(tu, '[data-tub-g]').innerHTML = tubSvg(i, o);
      const s = settles(i, o);
      q(tu, '[data-tub-status]').textContent = `With ${i.toFixed(1)} coming in and ${o.toFixed(1)} taken out, the toy sea settles at ${fmt(s, 1)}. ${Math.abs(s - 35) < 0.5 ? 'That is the saltiness of today’s sea.' : s > 35 ? 'That is saltier than the real sea.' : 'That is fresher than the real sea.'} Made up units.`;
    };
    rin.addEventListener('input', draw);
    rout.addEventListener('input', draw);
    draw();
  }

  // Pan 2: a pan that dries out
  const pa = root.querySelector<HTMLElement>('[data-pan-tool]');
  if (pa) {
    const range = q<HTMLInputElement>(pa, '[data-pan-range]');
    const draw = () => {
      fillRange(range);
      const share01 = Number(range.value) / 100;
      q(pa, '[data-pan-out]').textContent = range.value;
      q(pa, '[data-pan-g]').innerHTML = panSvg(share01);
      const g = saltier(share01);
      q(pa, '[data-pan-status]').textContent = `With ${range.value}% of the water gone the rest holds ${fmt(g)} grams of salt in each kilogram, ${fmt(g / 35, 1)} times as much as the sea. The Dead Sea has about 342.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Pan 3: what the salt is made of
  const io = root.querySelector<HTMLElement>('[data-ions-tool]');
  if (io) {
    const picks = io.querySelectorAll<HTMLElement>('[data-ions-pick]');
    const mark = (k: number) => io.querySelectorAll('[data-ion]').forEach((li) => li.classList.toggle('on', Number(li.getAttribute('data-ion')) === k));
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const k = Number(b.getAttribute('data-ions-pick'));
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        mark(k);
        q(io, '[data-ions-status]').textContent = `${IONS[k].name} is ${fmt(share(IONS[k].mgl), 1)}% of the dissolved salts, ${fmt(IONS[k].mgl)} milligrams in a litre of seawater.`;
        sound.play('tick', 0.3);
      }),
    );
    mark(0);
  }

  // Pan 4: all the salt on land
  const la = root.querySelector<HTMLElement>('[data-land-tool]');
  if (la) {
    const range = q<HTMLInputElement>(la, '[data-land-range]');
    const draw = () => {
      fillRange(range);
      const p = Number(range.value);
      q(la, '[data-land-out]').textContent = String(p);
      q<HTMLElement>(la, '[data-land-bar]').style.width = `${p}%`;
      const m = layerAt(p / 100);
      q(la, '[data-land-status]').textContent = `${p}% of the sea’s salt spread on the land would be about ${fmt(m, m < 10 ? 1 : 0)} metres deep, by one estimate. All of it is ${LAYER_M} metres.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
