// The kaleidoscope page: three eyepieces. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { ANGLES, beads, copies, imagesSvg, images, mirrorLines, roseSvg, wedgeSvg, type Bead } from '../../lib/kaleido';

const root = document.querySelector<HTMLElement>('[data-kaleido]');

const anglePicks = (host: HTMLElement, start: number, on: (a: number) => void) => {
  ANGLES.forEach((a) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = `${a} degrees`;
    b.setAttribute('aria-pressed', a === start ? 'true' : 'false');
    b.addEventListener('click', () => {
      host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      on(a);
      sound.play('tick', 0.3);
    });
    host.appendChild(b);
  });
};

if (root) {
  initSoundButton(root);

  // Eyepiece 1: one wedge, a whole pattern
  const dr = root.querySelector<HTMLElement>('[data-draw-tool]');
  if (dr) {
    let angle = 60;
    let list: Bead[] = beads(5, 3);
    let seed = 20;
    const draw = () => {
      q(dr, '[data-draw-rose-g]').innerHTML = roseSvg(angle, list);
      q(dr, '[data-draw-wedge-g]').innerHTML = wedgeSvg(angle, list);
      q(dr, '[data-draw-status]').textContent = `At ${angle} degrees the pattern has ${copies(angle)} wedges. The wedge holds ${list.length} ${list.length === 1 ? 'bead' : 'beads'}, so the view shows ${list.length * copies(angle)}.`;
    };
    anglePicks(q(dr, '[data-draw-angles]'), angle, (a) => {
      angle = a;
      draw();
    });
    const add = () => {
      seed += 1;
      list = [...list, ...beads(1, seed)].slice(-30);
      draw();
      sound.play('pop', 0.3);
    };
    q(dr, '[data-draw-add]').addEventListener('click', add);
    q(dr, '[data-draw-shake]').addEventListener('click', () => {
      seed += 1;
      list = beads(5, seed);
      draw();
      sound.play('scrape', 0.3);
    });
    q(dr, '[data-draw-clear]').addEventListener('click', () => {
      list = [];
      draw();
    });
    // A click inside the wedge drops a bead there
    const wedge = q<SVGSVGElement>(dr, '[data-draw-wedge]');
    wedge.addEventListener('click', (e) => {
      const box = wedge.getBoundingClientRect();
      const x = ((e.clientX - box.left) / box.width) * 200 - 30;
      const y = 150 - ((e.clientY - box.top) / box.height) * 170;
      const r = Math.hypot(x, y) / 130;
      const deg = (Math.atan2(y, x) * 180) / Math.PI;
      if (r > 1 || r < 0.05 || deg < 0 || deg > angle) return;
      list = [...list, { r, a: deg / angle, hue: list.length % 6, size: 0.06 }].slice(-30);
      draw();
      sound.play('pop', 0.3);
    });
    draw();
  }

  // Eyepiece 2: counting the images
  const co = root.querySelector<HTMLElement>('[data-count-tool]');
  if (co) {
    const range = q<HTMLInputElement>(co, '[data-count-range]');
    const draw = () => {
      fillRange(range);
      const a = Number(range.value);
      q(co, '[data-count-out]').textContent = String(a);
      const n = 360 / a;
      q(co, '[data-count-status]').textContent = ANGLES.includes(a) || (Number.isInteger(n) && n % 2 === 0)
        ? `At ${a} degrees, 360 over ${a} is ${n}, so an object has ${n} copies, ${images(a)} of them images in the mirrors. The pattern has ${mirrorLines(a)} mirror ${mirrorLines(a) === 1 ? 'line' : 'lines'}.`
        : Number.isInteger(n)
          ? `At ${a} degrees, 360 over ${a} is ${n}, an odd number of wedges. The sources give ${n - 1} images by the rule, but the pattern does not close without a seam, so the page does not draw it.`
          : `360 does not divide by ${a}, so the wedges do not fit round the middle. The sources do not agree on the number of images for this angle.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Eyepiece 3: one bead and its images
  const fo = root.querySelector<HTMLElement>('[data-follow-tool]');
  if (fo) {
    const range = q<HTMLInputElement>(fo, '[data-follow-range]');
    let angle = 60;
    const draw = () => {
      fillRange(range);
      const p = Number(range.value);
      q(fo, '[data-follow-out]').textContent = String(p);
      q(fo, '[data-follow-g]').innerHTML = imagesSvg(angle, p / 100);
      q(fo, '[data-follow-status]').textContent = `At ${angle} degrees there are ${images(angle)} images of the bead.${p === 0 || p === 100 ? ' The bead touches a mirror, so it and its image become one.' : ' Image 1 is flipped, image 2 is turned, and so on round the circle.'}`;
    };
    anglePicks(q(fo, '[data-follow-angles]'), angle, (a) => {
      angle = a;
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }
}
