// The ear page: four rooms. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { type Air, canalHz, canalSvg, decibels, drumSvg, dullness, fmt, gap, hzFromSlider, leverSvg, placeOf, pressureGain, stripSvg } from '../../lib/ear';

const root = document.querySelector<HTMLElement>('[data-ear]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  initSoundButton(root);

  // Ground floor: the canal
  const ca = root.querySelector<HTMLElement>('[data-canal-tool]');
  if (ca) {
    const range = q<HTMLInputElement>(ca, '[data-canal-range]');
    const draw = () => {
      fillRange(range);
      const mm = Number(range.value);
      q(ca, '[data-canal-out]').textContent = String(mm);
      q(ca, '[data-canal-g]').innerHTML = canalSvg(mm);
      q(ca, '[data-canal-status]').textContent = `A tube ${mm} mm long, closed at one end, boosts sound near ${fmt(canalHz(mm))} hertz. The next boost is near ${fmt(canalHz(mm) * 3)} hertz.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // First floor: the lever
  const le = root.querySelector<HTMLElement>('[data-lever-tool]');
  if (le) {
    const area = q<HTMLInputElement>(le, '[data-lever-area-range]');
    const lever = q<HTMLInputElement>(le, '[data-lever-lever-range]');
    const draw = () => {
      fillRange(area);
      fillRange(lever);
      const a = Number(area.value);
      const l = Number(lever.value) / 10;
      q(le, '[data-lever-area]').textContent = String(a);
      q(le, '[data-lever-lever]').textContent = l.toFixed(1);
      q(le, '[data-lever-g]').innerHTML = leverSvg(a);
      const g = pressureGain(a, l);
      q(le, '[data-lever-status]').textContent = `An area ratio of ${a} and a lever of ${l.toFixed(1)} raise the pressure ${fmt(g, 1)} times. That is ${fmt(decibels(g), 0)} decibels.`;
    };
    area.addEventListener('input', draw);
    lever.addEventListener('input', draw);
    draw();
  }

  // Back stairs: the air pipe
  const pi = root.querySelector<HTMLElement>('[data-pipe-tool]');
  if (pi) {
    const air: Air = { outside: 100, inside: 100 };
    const status = q(pi, '[data-pipe-status]');
    const draw = (text: string) => {
      q(pi, '[data-pipe-g]').innerHTML = drumSvg(air);
      status.textContent = `${text} Outside ${air.outside}%, middle ear ${air.inside}%. Sound seems ${dullness(air) > 0.5 ? 'dull' : 'clear'}. A toy with made up numbers.`;
    };
    q(pi, '[data-pipe-climb]').addEventListener('click', () => {
      air.outside = Math.max(70, air.outside - 6);
      sound.play('whoosh', 0.3);
      draw(gap(air) < 0 ? 'The air outside is thinner and the eardrum bulges outwards.' : 'The pressures are close.');
    });
    q(pi, '[data-pipe-land]').addEventListener('click', () => {
      air.outside = Math.min(100, air.outside + 6);
      sound.play('whoosh', 0.3);
      draw(gap(air) > 0 ? 'The air outside is thicker and pushes the eardrum inwards.' : 'The pressures are close.');
    });
    q(pi, '[data-pipe-swallow]').addEventListener('click', () => {
      const had = Math.abs(gap(air)) > 0;
      air.inside = air.outside;
      if (had) sound.play('pop', 0.6);
      draw(had ? 'The tube opened for a moment. Pop. The pressures are the same again.' : 'The tube opened, but there was nothing to even out.');
    });
    draw('On the ground the pressure is the same on both sides of the eardrum.');
  }

  // Top floor: the cochlea
  const co = root.querySelector<HTMLElement>('[data-cochlea-tool]');
  if (co) {
    const range = q<HTMLInputElement>(co, '[data-cochlea-range]');
    const notes = co.querySelectorAll<HTMLElement>('[data-cochlea-note]');
    let stop: () => void = () => {};
    let hz = 440;
    const draw = () => {
      fillRange(range);
      q(co, '[data-cochlea-out]').textContent = fmt(hz);
      q(co, '[data-cochlea-g]').innerHTML = stripSvg(hz);
      q(co, '[data-cochlea-status]').textContent = `A note of ${fmt(hz)} hertz is felt about ${Math.round(placeOf(hz) * 100)} per cent of the way from the tip to the base, in this toy map.${hz > 16000 ? ' Many adults cannot hear this high.' : ''}`;
    };
    notes.forEach((b) =>
      b.addEventListener('click', () => {
        hz = Number(b.getAttribute('data-cochlea-note'));
        range.value = String(Math.round(placeOf(hz) * 100));
        press(notes, b);
        draw();
        sound.pluck(hz, [1], 1.2);
      }),
    );
    range.addEventListener('input', () => {
      hz = Math.round(hzFromSlider(Number(range.value)));
      press(notes, null);
      draw();
    });
    const play = q(co, '[data-cochlea-play]');
    const end = () => stop();
    play.addEventListener('pointerdown', () => {
      sound.unlock();
      stop = sound.hold(hz);
    });
    play.addEventListener('pointerup', end);
    play.addEventListener('pointerleave', end);
    play.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === ' ' || (e as KeyboardEvent).key === 'Enter') {
        e.preventDefault();
        sound.pluck(hz, [1], 1.2);
      }
    });
    draw();
  }
}
