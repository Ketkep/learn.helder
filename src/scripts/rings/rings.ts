// The Rings page: four cuts through a tree. This file starts each one.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { bestStart, chain, chartSvg, climate, fit, indexOf, reachBack, ringWidths, sample, samples, stumpSvg, timbers } from '../../lib/rings';

const root = document.querySelector<HTMLElement>('[data-rings]');

if (root) {
  // Cut 1: grow a stump
  const grow = root.querySelector<HTMLElement>('[data-grow-tool]');
  if (grow) {
    const n = q<HTMLInputElement>(grow, '[data-grow-n]');
    const k = q<HTMLInputElement>(grow, '[data-grow-k]');
    const g = q(grow, '[data-grow-g]');
    const status = q<HTMLElement>(grow, '[data-grow-status]');
    const first = 1900;
    const draw = () => {
      const years = Number(n.value);
      k.max = String(years);
      if (Number(k.value) > years) k.value = String(years);
      const look = Number(k.value);
      fillRange(n);
      fillRange(k);
      q(grow, '[data-grow-n-out]').textContent = String(years);
      q(grow, '[data-grow-k-out]').textContent = String(look);
      g.innerHTML = stumpSvg(ringWidths(first, first + years - 1), look);
      const idx = climate[indexOf(first + look - 1)];
      const word = idx > 1.2 ? 'a good year, so the ring is wide' : idx < 0.75 ? 'a poor year, so the ring is narrow' : 'an ordinary year';
      status.textContent = `The tree has grown for ${years} years and has ${years} rings. Ring ${look}, from the year ${first + look - 1}, was ${word}. The red ring is the one you are looking at.`;
    };
    n.addEventListener('input', draw);
    k.addEventListener('input', draw);
    draw();
  }

  // Cut 2: count the rings
  const count = root.querySelector<HTMLElement>('[data-count-tool]');
  if (count) {
    const stumps = [{ first: 1998, last: 2020 }, { first: 1984, last: 2020 }, { first: 2007, last: 2020 }];
    let at = 0;
    const g = q(count, '[data-count-g]');
    const guess = q<HTMLInputElement>(count, '[data-count-guess]');
    const status = q<HTMLElement>(count, '[data-count-status]');
    const show = () => {
      const s = stumps[at];
      g.innerHTML = stumpSvg(ringWidths(s.first, s.last));
      guess.value = '';
    };
    q(count, '[data-count-check]').addEventListener('click', () => {
      const s = stumps[at];
      const real = s.last - s.first + 1;
      const v = Number(guess.value);
      if (!guess.value) {
        status.textContent = 'Enter how many rings you counted.';
        return;
      }
      if (v === real) {
        status.textContent = `Yes, ${real} rings, so the tree grew for ${real} years at this height.`;
        sound.play('good', 0.5);
      } else {
        status.textContent = `You counted ${v}, but there are ${real}. Count along one line from the middle to the bark and do not skip the thin rings near the edge. ${v > real ? 'You counted too many.' : 'You counted too few.'}`;
        sound.play('thud', 0.5);
      }
    });
    q(count, '[data-count-next]').addEventListener('click', () => {
      at = (at + 1) % stumps.length;
      show();
      status.textContent = 'A new stump. Count the rings from the middle to the bark.';
    });
    show();
  }

  // Cut 3: match the patterns
  const match = root.querySelector<HTMLElement>('[data-match-tool]');
  if (match) {
    const range = q<HTMLInputElement>(match, '[data-match-range]');
    const g = q(match, '[data-match-g]');
    const status = q<HTMLElement>(match, '[data-match-status]');
    let t = 0;
    let s = sample(timbers[0].first, timbers[0].last, timbers[0].seed);
    const draw = () => {
      const start = Number(range.value);
      fillRange(range);
      range.max = String(2020 - s.length + 1);
      q(match, '[data-match-out]').textContent = String(start);
      g.innerHTML = chartSvg(s, start);
      const r = fit(s, start);
      const best = bestStart(s);
      const where = start === best.year ? `That is the best fit of any year, so ${timbers[t].name} grew from ${start} to ${start + s.length - 1}.` : r > 0.8 ? 'That is a good fit, but check the years next to it.' : 'The ups and downs do not line up here.';
      status.textContent = `${timbers[t].name} has ${s.length} rings. If its first ring grew in ${start}, the patterns agree with r = ${r.toFixed(2)}. ${where}`;
    };
    range.addEventListener('input', draw);
    q(match, '[data-match-best]').addEventListener('click', () => {
      range.value = String(bestStart(s).year);
      sound.play('snap', 0.5);
      draw();
    });
    q(match, '[data-match-next]').addEventListener('click', () => {
      t = (t + 1) % timbers.length;
      s = sample(timbers[t].first, timbers[t].last, timbers[t].seed);
      range.value = '1800';
      draw();
    });
    draw();
  }

  // Cut 4: a very long record
  const long = root.querySelector<HTMLElement>('[data-long-tool]');
  if (long) {
    const range = q<HTMLInputElement>(long, '[data-long-range]');
    const g = q(long, '[data-long-g]');
    const status = q<HTMLElement>(long, '[data-long-status]');
    const draw = () => {
      const n = Number(range.value);
      fillRange(range);
      q(long, '[data-long-out]').textContent = String(n);
      g.innerHTML = chain(n);
      const back = reachBack(n);
      status.textContent = `With ${n} sample${n === 1 ? '' : 's'} (the oldest is ${samples[n - 1].name.toLowerCase()}) the record reaches back to the year ${back}, which is ${2020 - back} years.${n > 1 ? ' Each sample overlaps the one before it by about 20 rings, which is enough to tie the two together.' : ''}`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
