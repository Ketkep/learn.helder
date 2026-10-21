// The photosynthesis page: five parts of one day. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { absorbs, balance, BREATH, clock, crossings, grams, limiting, making, net, soilLb, sun, terms, treeLb, WILLOW } from '../../lib/photo';
import { colourName, rgb, wavelengthColour } from '../../lib/sky';

const root = document.querySelector<HTMLElement>('[data-photo]');
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

if (root) {
  initSoundButton(root);

  // 06:00 colours
  const co = root.querySelector<HTMLElement>('[data-colours-tool]');
  if (co) {
    const range = q<HTMLInputElement>(co, '[data-colours-range]');
    const draw = () => {
      fillRange(range);
      const nm = Number(range.value);
      q(co, '[data-colours-out]').textContent = String(nm);
      const x = ((nm - 400) / 300) * 280 + 10;
      const mark = q(co, '[data-colours-mark]');
      mark.setAttribute('x1', String(x));
      mark.setAttribute('x2', String(x));
      q<HTMLElement>(co, '[data-colours-swatch]').style.background = rgb(wavelengthColour(nm));
      const a = Math.round(absorbs(nm) * 100);
      q(co, '[data-colours-text]').textContent = `${cap(colourName(nm))} light at ${nm} nm: the toy leaf takes in ${a} per cent of it${a < 20 ? ' and throws most of it back, which is why leaves look green' : ''}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // 09:00 limits
  const li = root.querySelector<HTMLElement>('[data-limits-tool]');
  if (li) {
    const light = q<HTMLInputElement>(li, '[data-limits-light]');
    const co2 = q<HTMLInputElement>(li, '[data-limits-co2]');
    const temp = q<HTMLInputElement>(li, '[data-limits-temp]');
    const draw = () => {
      [light, co2, temp].forEach(fillRange);
      const l = { light: Number(light.value), co2: Number(co2.value), temp: Number(temp.value) };
      q(li, '[data-limits-out-light]').textContent = String(l.light);
      q(li, '[data-limits-out-co2]').textContent = String(l.co2);
      q(li, '[data-limits-out-temp]').textContent = String(l.temp);
      const t = terms(l);
      (['light', 'co2', 'temp'] as const).forEach((k) => {
        q<HTMLElement>(li, `[data-bar="${k}"]`).style.width = `${t[k] * 100}%`;
        q(li, `[data-num="${k}"]`).textContent = `${Math.round(t[k] * 100)}%`;
      });
      const m = limiting(l);
      q(li, '[data-limits-status]').textContent = m.name === 'nothing'
        ? 'The leaf works at its best speed in this toy. Nothing holds it back. A toy with made up curves.'
        : m.rate === 0
        ? `The leaf has stopped. What holds it back is ${m.name}. A toy with made up curves.`
        : `The leaf works at ${Math.round(m.rate * 100)} per cent of its best speed. What holds it back is ${m.name}. More of the others would not help. A toy with made up curves.`;
    };
    [light, co2, temp].forEach((r) => r.addEventListener('input', draw));
    draw();
  }

  // 12:00 grams
  const gr = root.querySelector<HTMLElement>('[data-grams-tool]');
  if (gr) {
    const range = q<HTMLInputElement>(gr, '[data-grams-range]');
    const draw = () => {
      fillRange(range);
      const b = balance(Number(range.value));
      q(gr, '[data-grams-out]').textContent = String(Math.round(b.co2));
      (['co2', 'water', 'glucose', 'oxygen'] as const).forEach((k) => (q(gr, `[data-g="${k}"]`).textContent = grams(b[k])));
      q(gr, '[data-g="in"]').textContent = grams(b.co2 + b.water);
      q(gr, '[data-g="out"]').textContent = grams(b.glucose + b.oxygen);
      q(gr, '[data-grams-status]').textContent = `${grams(b.co2)} g of carbon dioxide and ${grams(b.water)} g of water make ${grams(b.glucose)} g of glucose and ${grams(b.oxygen)} g of oxygen. Both sides weigh ${grams(b.co2 + b.water)} g.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // 15:00 willow
  const wi = root.querySelector<HTMLElement>('[data-willow-tool]');
  if (wi) {
    const range = q<HTMLInputElement>(wi, '[data-willow-range]');
    const guesses = wi.querySelectorAll<HTMLElement>('[data-willow-guess]');
    const answers: Record<string, string> = {
      soil: 'The soil lost only about 2 oz while the tree gained about 164 lb, so the soil cannot be the main source.',
      water: 'That was van Helmont’s own answer. Water gives the hydrogen and oxygen, but a large part of the weight is carbon, and that comes from the air.',
      air: 'Mostly yes. The carbon comes from carbon dioxide in the air. It joins the hydrogen and oxygen of water. Van Helmont missed the air.',
    };
    let said = '';
    const draw = () => {
      fillRange(range);
      const y = Number(range.value);
      q(wi, '[data-willow-out]').textContent = String(y);
      const tree = treeLb(y);
      const soil = soilLb(y);
      q<HTMLElement>(wi, '[data-bar="tree"]').style.width = `${(tree / 200) * 100}%`;
      q<HTMLElement>(wi, '[data-bar="soil"]').style.width = `${(soil / 200) * 100}%`;
      q(wi, '[data-num="tree"]').textContent = `${Math.round(tree)} lb`;
      q(wi, '[data-num="soil"]').textContent = `${Math.round(soil)} lb`;
      q(wi, '[data-willow-status]').textContent = `${said ? said + ' ' : ''}Year ${y}: the tree weighs ${y === 0 ? '' : y === WILLOW.years ? 'about ' : 'roughly '}${Math.round(tree)} lb and the soil about ${soil.toFixed(1)} lb.${y > 0 && y < WILLOW.years ? ' The growth between year 0 and year 5 is a made up curve.' : ''}`;
    };
    guesses.forEach((g) =>
      g.addEventListener('click', () => {
        guesses.forEach((p) => p.setAttribute('aria-pressed', p === g ? 'true' : 'false'));
        said = answers[g.getAttribute('data-willow-guess') || 'soil'];
        sound.play('pop', 0.4);
        draw();
      }),
    );
    range.addEventListener('input', draw);
    draw();
  }

  // 21:00 day
  const dy = root.querySelector<HTMLElement>('[data-day-tool]');
  if (dy) {
    const range = q<HTMLInputElement>(dy, '[data-day-range]');
    const [up, down] = crossings();
    const draw = () => {
      fillRange(range);
      const h = Number(range.value);
      q(dy, '[data-day-out]').textContent = clock(h);
      const x = (h / 24) * 280 + 10;
      const mark = q(dy, '[data-day-mark]');
      mark.setAttribute('x1', String(x));
      mark.setAttribute('x2', String(x));
      const made = Math.round(making(h) * 100);
      const n = Math.round(net(h) * 100);
      const light = sun(h) === 0 ? (h === 6 || h === 18 ? 'The sun is on the horizon.' : 'It is dark.') : sun(h) > 0.95 ? 'The sun is at its highest.' : 'The sun is up.';
      q(dy, '[data-day-status]').textContent = `At ${clock(h)}. ${light} The toy leaf makes ${made} units of sugar and breathes out ${Math.round(BREATH * 100)}, so it ${n >= 0 ? 'gains' : 'loses'} ${Math.abs(n)}. It gains between ${clock(up)} and ${clock(down)}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
