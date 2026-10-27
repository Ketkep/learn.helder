// The transit map page: four sheets. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { coreGrowth, crow, fmt, route, routeSvg, straightSvg, tidySegments, TRIPS, warpSvg } from '../../lib/transit';

const root = document.querySelector<HTMLElement>('[data-transit]');

if (root) {
  initSoundButton(root);

  // Sheet 1: straighten the lines
  const st = root.querySelector<HTMLElement>('[data-straight-tool]');
  if (st) {
    const range = q<HTMLInputElement>(st, '[data-straight-range]');
    const draw = () => {
      fillRange(range);
      const p = Number(range.value);
      q(st, '[data-straight-out]').textContent = String(p);
      q(st, '[data-straight-g]').innerHTML = straightSvg(p / 100);
      const { tidy, total } = tidySegments(p / 100);
      q(st, '[data-straight-status]').textContent = `${tidy} of the ${total} stretches between stops are flat, upright or at 45 degrees.${p === 100 ? ' This is the diagram. The distances are no longer true.' : p === 0 ? ' This is the made up real layout.' : ''}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Sheet 2: give the middle room
  const ce = root.querySelector<HTMLElement>('[data-centre-tool]');
  if (ce) {
    const range = q<HTMLInputElement>(ce, '[data-centre-range]');
    const draw = () => {
      fillRange(range);
      const p = Number(range.value);
      const g = 1 - p / 100;
      q(ce, '[data-centre-out]').textContent = String(p);
      q(ce, '[data-centre-g]').innerHTML = warpSvg(g);
      q(ce, '[data-centre-status]').textContent = p === 0 ? 'No push. This is the made up real layout, and the middle stations are close together.' : `With a ${p}% push the box around the four middle stations is ${fmt(coreGrowth(g), 1)} times as wide.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Sheet 3: find the way
  const ro = root.querySelector<HTMLElement>('[data-route-tool]');
  if (ro) {
    const from = q<HTMLSelectElement>(ro, '[data-route-from]');
    const to = q<HTMLSelectElement>(ro, '[data-route-to]');
    const draw = () => {
      const a = from.value;
      const b = to.value;
      if (a === b) {
        q(ro, '[data-route-g]').innerHTML = routeSvg(null);
        q(ro, '[data-route-status]').textContent = 'Pick two different stations.';
        return;
      }
      const r = route(a, b);
      q(ro, '[data-route-g]').innerHTML = routeSvg(r);
      q(ro, '[data-route-status]').textContent = `${a} to ${b}: ${r.stops} ${r.stops === 1 ? 'stop' : 'stops'} with ${r.changes} ${r.changes === 1 ? 'change' : 'changes'}, ${fmt(crow(a, b), 1)} km in a straight line. Via ${r.stations.join(', ')}.`;
    };
    from.addEventListener('change', () => {
      draw();
      sound.play('tick', 0.3);
    });
    to.addEventListener('change', () => {
      draw();
      sound.play('tick', 0.3);
    });
    draw();
  }

  // Sheet 4: which is farther
  const gu = root.querySelector<HTMLElement>('[data-guess-tool]');
  if (gu) {
    let k = 0;
    let done = false;
    let right = 0;
    let asked = 0;
    const trips = () => {
      const [x, y] = TRIPS[k % TRIPS.length];
      // Every other pair swaps sides, so the one with more stops is not always orange
      return k % 2 === 0 ? [x, y] : [y, x];
    };
    const show = () => {
      const [a, b] = trips();
      q(gu, '[data-guess-g]').innerHTML = routeSvg(route(a[0], a[1]), route(b[0], b[1]));
      q(gu, '[data-guess-status]').textContent = `Orange is ${a[0]} to ${a[1]}. Violet is ${b[0]} to ${b[1]}. Which trip covers more ground in a straight line?`;
      done = false;
    };
    gu.querySelectorAll<HTMLElement>('[data-guess-pick]').forEach((btn) =>
      btn.addEventListener('click', () => {
        if (done) return;
        done = true;
        const [a, b] = trips();
        const da = crow(a[0], a[1]);
        const db = crow(b[0], b[1]);
        const sa = route(a[0], a[1]).stops;
        const sb = route(b[0], b[1]).stops;
        const farther = da > db ? 0 : 1;
        const pick = Number(btn.getAttribute('data-guess-pick'));
        asked += 1;
        if (pick === farther) right += 1;
        sound.play(pick === farther ? 'good' : 'bad', 0.4);
        q(gu, '[data-guess-status]').textContent = `${pick === farther ? 'Yes.' : 'No.'} Orange: ${sa} ${sa === 1 ? 'stop' : 'stops'}, ${fmt(da, 1)} km. Violet: ${sb} ${sb === 1 ? 'stop' : 'stops'}, ${fmt(db, 1)} km. The ${farther === 0 ? 'orange' : 'violet'} trip covers more ground. Right ${right} of ${asked}.`;
      }),
    );
    q(gu, '[data-guess-next]').addEventListener('click', () => {
      k += 1;
      show();
    });
    show();
  }
}
