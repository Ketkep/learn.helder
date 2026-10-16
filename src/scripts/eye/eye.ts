// The eye page: four tests. This file starts each one.

import { fillRange, q } from '../util';
import { blindSvg, colours, dotOffsetCm, eyeSvg, letterPx, lightRatio, pupilMm, PX_PER_CM, pxFromAngle, readableDegrees } from '../../lib/eye';

const root = document.querySelector<HTMLElement>('[data-eye]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Test 1: the blind spot
  const blind = root.querySelector<HTMLElement>('[data-blind-tool]');
  if (blind) {
    const range = q<HTMLInputElement>(blind, '[data-blind-range]');
    const svg = q<SVGSVGElement>(blind, '[data-blind-svg]');
    const draw = () => {
      // The picture is drawn at its real size on screen, so the dot lands where it should
      const width = svg.getBoundingClientRect().width || 300;
      const scale = 300 / width; // a pixel on screen in picture units
      const d = Number(range.value);
      const maxCm = ((width - 40) / PX_PER_CM);
      range.max = String(Math.floor(maxCm / Math.tan((15 * Math.PI) / 180)));
      const dist = Math.min(d, Number(range.max));
      range.value = String(dist);
      fillRange(range);
      const cm = dotOffsetCm(dist);
      q(blind, '[data-blind-out]').textContent = `${dist} cm`;
      q(blind, '[data-blind-g]').innerHTML = blindSvg(cm * PX_PER_CM * scale);
      q(blind, '[data-blind-status]').textContent = `Cover your left eye and look at the cross with your right eye. With the screen about ${dist} centimetres away, the dot should be about ${cm.toFixed(1)} centimetres to the right of the cross, and it should vanish.`;
    };
    range.addEventListener('input', draw);
    window.addEventListener('resize', draw);
    draw();
  }

  // Test 2: the pupil
  const pupil = root.querySelector<HTMLElement>('[data-pupil-tool]');
  if (pupil) {
    const range = q<HTMLInputElement>(pupil, '[data-pupil-range]');
    const draw = () => {
      fillRange(range);
      const b = Number(range.value);
      const mm = pupilMm(b);
      q(pupil, '[data-pupil-out]').textContent = String(b);
      q(pupil, '[data-pupil-g]').innerHTML = eyeSvg(mm);
      q(pupil, '[data-pupil-status]').textContent = `In this toy the pupil is ${mm.toFixed(1)} mm across. It lets in ${lightRatio(mm).toFixed(1)} times the light of a pupil of 2 mm, because the area goes with the diameter times itself.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Test 3: afterimage
  const after = root.querySelector<HTMLElement>('[data-after-tool]');
  if (after) {
    const patch = q<HTMLElement>(after, '[data-after-patch]');
    const picks = after.querySelectorAll<HTMLElement>('[data-after-pick]');
    let colour = colours[0];
    const status = q<HTMLElement>(after, '[data-after-status]');
    const show = () => {
      patch.style.background = colour.css;
      status.textContent = `Look at the dot in the middle of the ${colour.name.toLowerCase()} patch for about 30 seconds. Then press show blank and keep looking at the same place. You should see a faint ${colour.after} ghost.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        colour = colours.find((c) => c.id === b.getAttribute('data-after-pick')) || colours[0];
        press(picks, b);
        show();
      }),
    );
    q(after, '[data-after-show]').addEventListener('click', show);
    q(after, '[data-after-blank]').addEventListener('click', () => {
      patch.style.background = '#f4f1ea';
      status.textContent = `Keep looking at the dot. If you stared at the ${colour.name.toLowerCase()} patch long enough, a faint ${colour.after} ghost appears. It fades after a few seconds. Blink to see it again.`;
    });
    show();
  }

  // Test 4: the side of vision
  const side = root.querySelector<HTMLElement>('[data-side-tool]');
  if (side) {
    const range = q<HTMLInputElement>(side, '[data-side-range]');
    const letter = q<HTMLElement>(side, '[data-side-letter]');
    const fixedBtn = q<HTMLElement>(side, '[data-side-fixed]');
    const view = q<HTMLElement>(side, '[data-side-view]');
    let fixed = false;
    const draw = () => {
      fillRange(range);
      const a = Number(range.value);
      q(side, '[data-side-out]').textContent = `${a} degrees`;
      // On a narrow screen the whole scene is drawn smaller, so the letter stays inside the box
      const k = Math.min(1, Math.max(0.2, (view.clientWidth - 60) / pxFromAngle(30)));
      letter.style.left = `${Math.round(pxFromAngle(a) * k)}px`;
      letter.style.fontSize = `${fixed ? 28 : Math.max(8, Math.round(letterPx(a) * k))}px`;
      q(side, '[data-side-status]').textContent = fixed
        ? `The letter is a fixed 28 pixels tall. Look at the cross and move the angle. Somewhere out to the side it stops being readable.`
        : `At ${a} degrees from where you look, the smallest letter you can read is about ${readableDegrees(a).toFixed(1)} degrees tall. That is the size shown. Look only at the cross.`;
    };
    range.addEventListener('input', draw);
    window.addEventListener('resize', draw);
    fixedBtn.addEventListener('click', () => {
      fixed = !fixed;
      fixedBtn.setAttribute('aria-pressed', fixed ? 'true' : 'false');
      draw();
    });
    draw();
  }
}
