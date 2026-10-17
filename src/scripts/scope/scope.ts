// The sound page: four screens. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { beatsSvg, beatStatus, HARMONICS, nearestNote, peak, recipes, scopeSvg, sineWave, sumWave, voices } from '../../lib/wave';

const root = document.querySelector<HTMLElement>('[data-scope]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

const offNote = 'Sound is off. Turn it on with the button at the top of the page.';

if (root) {
  initSoundButton(root);

  // Screen 1: one pure tone, held while the button is down
  const tone = root.querySelector<HTMLElement>('[data-tone-tool]');
  if (tone) {
    const range = q<HTMLInputElement>(tone, '[data-tone-range]');
    const amp = q<HTMLInputElement>(tone, '[data-tone-amp]');
    const status = q<HTMLElement>(tone, '[data-tone-status]');
    let stop: (() => void) | null = null;
    const draw = () => {
      fillRange(range);
      fillRange(amp);
      const f = Number(range.value);
      const a = Number(amp.value) / 100;
      q(tone, '[data-tone-out]').textContent = `${f} Hz`;
      q(tone, '[data-tone-amp-out]').textContent = amp.value;
      q(tone, '[data-tone-g]').innerHTML = scopeSvg(sineWave(a), f * 0.01);
      const n = nearestNote(f);
      status.textContent = `${f} Hz is ${(f * 0.01).toFixed(1)} waves in a hundredth of a second, and each wave takes ${(1000 / f).toFixed(2)} milliseconds. It is near the note ${n.name}${n.cents ? `, ${Math.abs(n.cents)} cents ${n.cents > 0 ? 'above' : 'below'} it` : ''}.`;
    };
    range.addEventListener('input', draw);
    amp.addEventListener('input', draw);
    const play = q<HTMLElement>(tone, '[data-tone-play]');
    const start = () => {
      sound.unlock();
      if (!sound.isSoundOn()) {
        status.textContent = offNote;
        return;
      }
      stop?.();
      stop = sound.hold(Number(range.value));
    };
    const end = () => {
      stop?.();
      stop = null;
    };
    play.addEventListener('pointerdown', start);
    play.addEventListener('pointerup', end);
    play.addEventListener('pointerleave', end);
    play.addEventListener('keydown', (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start();
    });
    play.addEventListener('keyup', end);
    play.addEventListener('blur', end);
    draw();
  }

  // Screen 2: add harmonics
  const sum = root.querySelector<HTMLElement>('[data-sum-tool]');
  if (sum) {
    const ranges = sum.querySelectorAll<HTMLInputElement>('[data-sum-range]');
    const picks = sum.querySelectorAll<HTMLElement>('[data-sum-pick]');
    const status = q<HTMLElement>(sum, '[data-sum-status]');
    let signs: number[] = recipes.square.signs || [];
    const amps = () => Array.from(ranges).map((r) => Number(r.value) / 100);
    const draw = () => {
      const a = amps();
      ranges.forEach((r, i) => {
        fillRange(r);
        q(sum, `[data-sum-out="${i}"]`).textContent = r.value;
      });
      q(sum, '[data-sum-g]').innerHTML = scopeSvg(sumWave(a, signs), 2, 1 / peak(a, signs));
      const on = a.map((v, i) => (v > 0.02 ? i + 1 : 0)).filter(Boolean);
      status.textContent = on.length ? `Harmonics on: ${on.join(', ')}. The wave on the screen is their sum.` : 'All the harmonics are off, so there is no sound.';
    };
    ranges.forEach((r) => r.addEventListener('input', () => {
      picks.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      draw();
    }));
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const r = recipes[b.getAttribute('data-sum-pick') || 'sine'];
        signs = r.signs || [];
        ranges.forEach((el, i) => (el.value = String(Math.round(r.amps[i] * 100))));
        draw();
        press(picks, b);
        status.textContent = `${r.name} wave: ${r.amps.map((v, i) => (v > 0 ? i + 1 : 0)).filter(Boolean).join(', ')} are the harmonics that are on.`;
      }),
    );
    q(sum, '[data-sum-play]').addEventListener('click', () => {
      sound.unlock();
      if (!sound.isSoundOn()) {
        status.textContent = offNote;
        return;
      }
      sound.pluck(220, amps().slice(0, HARMONICS), 1.8);
    });
    draw();
    status.textContent = 'The square wave is the odd harmonics 1, 3, 5 and 7, with heights of 1, one third, one fifth and one seventh.';
  }

  // Screen 3: the voice of an instrument
  const voice = root.querySelector<HTMLElement>('[data-voice-tool]');
  if (voice) {
    const picks = voice.querySelectorAll<HTMLElement>('[data-voice-pick]');
    let key = 'flute';
    const draw = () => {
      const v = voices[key];
      q(voice, '[data-voice-g]').innerHTML = scopeSvg(sumWave(v.amps), 3, 1 / peak(v.amps));
      q(voice, '[data-voice-bars]').innerHTML = v.amps.map((a, i) => `<li><span class="nm">${i + 1}</span><span class="track"><span class="fill" style="width:${Math.max(1, a * 100)}%"></span></span></li>`).join('');
      q(voice, '[data-voice-status]').textContent = `${v.name}: ${v.note} Every voice plays the same pitch of 220 Hz, and the shape of the wave is different.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        key = b.getAttribute('data-voice-pick') || key;
        press(picks, b);
        draw();
      }),
    );
    q(voice, '[data-voice-play]').addEventListener('click', () => {
      sound.unlock();
      if (!sound.isSoundOn()) {
        q(voice, '[data-voice-status]').textContent = offNote;
        return;
      }
      sound.pluck(220, voices[key].amps, 2);
    });
  }

  // Screen 4: beats
  const beats = root.querySelector<HTMLElement>('[data-beats-tool]');
  if (beats) {
    const range = q<HTMLInputElement>(beats, '[data-beats-range]');
    const status = q<HTMLElement>(beats, '[data-beats-status]');
    const draw = () => {
      fillRange(range);
      const f2 = Number(range.value);
      q(beats, '[data-beats-out]').textContent = `${f2} Hz`;
      q(beats, '[data-beats-g]').innerHTML = beatsSvg(440, f2);
      status.textContent = `${beatStatus(440, f2)} The picture shows one second, with the fast wiggle drawn slowly.`;
    };
    range.addEventListener('input', draw);
    q(beats, '[data-beats-play]').addEventListener('click', () => {
      sound.unlock();
      if (!sound.isSoundOn()) {
        status.textContent = offNote;
        return;
      }
      const stopA = sound.hold(440);
      const stopB = sound.hold(Number(range.value));
      setTimeout(() => {
        stopA();
        stopB();
      }, 3000);
    });
    draw();
  }
}
