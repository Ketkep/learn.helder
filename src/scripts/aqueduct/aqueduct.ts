// The aqueduct page: four hills. This file starts each one.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { archShare, dropM, methods, oneIn, pressureBar, ROME, scenes, siphonSvg, slopeSvg } from '../../lib/aqueduct';

const root = document.querySelector<HTMLElement>('[data-aqueduct]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Hill 1: the slope
  const slope = root.querySelector<HTMLElement>('[data-slope-tool]');
  if (slope) {
    const g = q<HTMLInputElement>(slope, '[data-slope-range]');
    const l = q<HTMLInputElement>(slope, '[data-slope-km]');
    const draw = () => {
      fillRange(g);
      fillRange(l);
      const [cm, km] = [Number(g.value), Number(l.value)];
      q(slope, '[data-slope-out]').textContent = `${cm} cm/km`;
      q(slope, '[data-slope-km-out]').textContent = `${km} km`;
      q(slope, '[data-slope-g]').innerHTML = slopeSvg(cm, km);
      const near = cm === 34 && km === 50 ? ' This is the slope of the Nîmes aqueduct.' : '';
      q(slope, '[data-slope-status]').textContent = `A slope of ${cm} cm in every kilometre, over ${km} km, falls ${dropM(cm, km).toFixed(1)} metres. That is a slope of about 1 in ${oneIn(cm).toLocaleString('en-US')}.${near} The fall is drawn much bigger than life.`;
    };
    g.addEventListener('input', draw);
    l.addEventListener('input', draw);
    draw();
  }

  // Hill 2: the siphon
  const siphon = root.querySelector<HTMLElement>('[data-siphon-tool]');
  if (siphon) {
    const d = q<HTMLInputElement>(siphon, '[data-siphon-range]');
    const loss = q<HTMLInputElement>(siphon, '[data-siphon-loss]');
    const draw = () => {
      fillRange(d);
      fillRange(loss);
      const [depth, lost] = [Number(d.value), Number(loss.value)];
      q(siphon, '[data-siphon-out]').textContent = `${depth} m`;
      q(siphon, '[data-siphon-loss-out]').textContent = `${lost} m`;
      q(siphon, '[data-siphon-g]').innerHTML = siphonSvg(depth, lost);
      q(siphon, '[data-siphon-status]').textContent = `A valley ${depth} m deep puts the water at the bottom under about ${pressureBar(depth).toFixed(1)} bar, which is ${(pressureBar(depth) / 1.013).toFixed(1)} times the pressure of the air. The far tank must be at least ${lost} m lower than the top tank.`;
    };
    d.addEventListener('input', draw);
    loss.addEventListener('input', draw);
    draw();
  }

  // Hill 3: choose the crossing
  const choose = root.querySelector<HTMLElement>('[data-choose-tool]');
  if (choose) {
    const picks = choose.querySelectorAll<HTMLElement>('[data-choose-pick]');
    const status = q<HTMLElement>(choose, '[data-choose-status]');
    let i = 0;
    const scene = q<HTMLElement>(choose, '[data-choose-scene]');
    const show = () => {
      scene.textContent = scenes[i].name;
      press(picks, null);
      status.textContent = 'Pick a way to carry the water across.';
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const k = b.getAttribute('data-choose-pick') || '';
        press(picks, b);
        const right = k === scenes[i].best;
        status.textContent = `${right ? '' : `${methods[k]}: not the best here. `}${scenes[i].why[k]}${right ? '' : ` The best choice is: ${methods[scenes[i].best].toLowerCase()}.`}`;
        sound.play(right ? 'good' : 'thud', 0.4);
      }),
    );
    q(choose, '[data-choose-next]').addEventListener('click', () => {
      i = (i + 1) % scenes.length;
      show();
    });
    show();
  }

  // Hill 4: the share on arches
  const share = root.querySelector<HTMLElement>('[data-share-tool]');
  if (share) {
    const r = q<HTMLInputElement>(share, '[data-share-range]');
    const draw = () => {
      fillRange(r);
      q(share, '[data-share-out]').textContent = `${r.value} per cent`;
    };
    r.addEventListener('input', draw);
    q(share, '[data-share-check]').addEventListener('click', () => {
      const guess = Number(r.value);
      const real = archShare();
      const off = Math.abs(guess - real);
      q(share, '[data-share-status]').textContent = `About ${real} per cent of the line, about ${ROME.arches} of about ${ROME.total} km, stood on arches. You guessed ${guess} per cent${off <= 3 ? ', which is very close' : guess > real ? ', which is too many' : ', which is too few'}. About ${ROME.underground} km ran underground.`;
      sound.play(off <= 5 ? 'good' : 'thud', 0.4);
    });
    draw();
  }
}
