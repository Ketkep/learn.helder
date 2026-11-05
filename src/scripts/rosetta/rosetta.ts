// The Rosetta Stone page: three bands. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, q } from '../util';
import { BANDS, CLEOPATRA, PTOLEMY, REBUSES, SHARED, SIGNS, cartouchesSvg, slabSvg } from '../../lib/rosetta';

const root = document.querySelector<HTMLElement>('[data-rosetta]');

/** A row of buttons, one of which is chosen. */
function picks(host: Element, labels: string[], start: string, on: (v: string) => void) {
  labels.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = l;
    b.setAttribute('aria-pressed', l === start ? 'true' : 'false');
    b.addEventListener('click', () => {
      host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      on(l);
      sound.play('tick', 0.3);
    });
    host.appendChild(b);
  });
}

if (root) {
  initSoundButton(root);

  // Band 1: one decree, three scripts
  const th = root.querySelector<HTMLElement>('[data-three-tool]');
  if (th) {
    picks(q(th, '[data-three-picks]'), BANDS.map((b) => b.name), 'Hieroglyphs', (v) => {
      const b = BANDS.filter((x) => x.name === v)[0];
      q(th, '[data-three-g]').innerHTML = slabSvg(b.id);
      q(th, '[data-three-status]').textContent = b.words;
    });
  }

  // Band 2: two names with signs in common. One button for each sign of the first name.
  const na = root.querySelector<HTMLElement>('[data-names-tool]');
  if (na) {
    const draw = (id: string) => {
      q(na, '[data-names-g]').innerHTML = cartouchesSvg(id);
      const both = CLEOPATRA.includes(id);
      const count = CLEOPATRA.filter((x) => x === id).length;
      q(na, '[data-names-status]').textContent = both
        ? `The sign for ${SIGNS[id].sound} is in both names${count > 1 ? `, and twice in the second` : ''}. The same sign in two names stands for the same sound. That was the clue.`
        : `The sign for ${SIGNS[id].sound} is only in the first name. It does not help to compare, since the second name does not have it.`;
    };
    picks(q(na, '[data-names-picks]'), PTOLEMY.map((id) => SIGNS[id].sound.toUpperCase() + (id === 'ii' ? ' (the double leaf)' : '')), 'P', (v) => {
      const i = PTOLEMY.findIndex((id) => SIGNS[id].sound.toUpperCase() + (id === 'ii' ? ' (the double leaf)' : '') === v);
      draw(PTOLEMY[i]);
    });
    void SHARED;
    draw('p');
  }

  // Band 3: signs for sounds and signs for meaning
  const mi = root.querySelector<HTMLElement>('[data-mixed-tool]');
  if (mi) {
    const out = q(mi, '[data-mixed-out]');
    picks(q(mi, '[data-mixed-picks]'), REBUSES.map((r) => r.word), '', (w) => {
      const r = REBUSES.filter((x) => x.word === w)[0];
      clear(out);
      const line = document.createElement('p');
      line.className = 'rebus-line';
      line.textContent = r.parts.map((p) => `${p.pic} (${p.sound})`).join('  +  ') + `  =  ${r.word}`;
      out.appendChild(line);
      q(mi, '[data-mixed-status]').textContent = `${r.word}: the sounds ${r.parts.map((p) => `"${p.sound}"`).join(' and ')} said together make the word. This is a toy.`;
    });
  }
}
