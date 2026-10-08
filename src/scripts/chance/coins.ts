// Experiment 2: coin flips. The share of heads settles near a half, and a run of five does not change the next flip.

import * as sound from '../sound';
import { q } from '../util';
import { pct } from './stats';

const RUN = 5;

export function initCoins(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-coins-tool]');
  if (!tool) return;
  const x0 = Number(tool.dataset.x0);
  const x1 = Number(tool.dataset.x1);
  const y0 = Number(tool.dataset.y0);
  const y1 = Number(tool.dataset.y1);
  const line = q<SVGPathElement>(tool, '[data-coins-line]');
  const nEl = q<HTMLElement>(tool, '[data-coins-n]');
  const shareEl = q<HTMLElement>(tool, '[data-coins-share]');
  const gapEl = q<HTMLElement>(tool, '[data-coins-gap]');
  const runEl = q<HTMLElement>(tool, '[data-coins-run]');
  const status = q<HTMLElement>(tool, '[data-coins-status]');

  let flips: number[] = []; // 1 for heads, 0 for tails
  let heads = 0;
  let longest = 0;
  let run = 0;
  let afterRun = 0; // flips that came right after a run of 5 or more of the same side
  let matched = 0; // of those, the ones that matched the run

  const shareAt: [number, number][] = []; // [flip number, share of heads]

  function add(n: number) {
    for (let i = 0; i < n; i++) {
      const f = Math.random() < 0.5 ? 1 : 0;
      if (run >= RUN) {
        afterRun++;
        if (f === flips[flips.length - 1]) matched++;
      }
      if (flips.length && f === flips[flips.length - 1]) run++;
      else run = 1;
      longest = Math.max(longest, run);
      flips.push(f);
      heads += f;
      shareAt.push([flips.length, heads / flips.length]);
    }
  }

  const px = (n: number) => x0 + ((x1 - x0) * Math.log10(n)) / 4;
  const py = (s: number) => y1 - (y1 - y0) * s;

  function draw() {
    const total = flips.length;
    if (!total) {
      line.setAttribute('d', '');
      nEl.textContent = '0';
      shareEl.textContent = '-';
      gapEl.textContent = '-';
      runEl.textContent = '-';
      status.textContent = 'Flip the coin. Watch the share of heads wander at first and settle later.';
      return;
    }
    // Draw every flip at the start and then only some, so the picture stays light
    let d = '';
    let lastX = -10;
    shareAt.forEach(([n, s], i) => {
      const x = px(n);
      if (n <= 60 || x - lastX > 1.2 || i === shareAt.length - 1) {
        d += `${d ? 'L' : 'M'}${x.toFixed(1)} ${py(s).toFixed(1)}`;
        lastX = x;
      }
    });
    line.setAttribute('d', d);
    const gap = heads - (total - heads);
    nEl.textContent = total.toLocaleString('en-US');
    shareEl.textContent = pct(heads / total);
    gapEl.textContent = gap === 0 ? '0' : `${gap > 0 ? '+' : ''}${gap.toLocaleString('en-US')}`;
    runEl.textContent = String(longest);
    const after = afterRun
      ? ` After a run of ${RUN} or more of the same side, the next flip matched the run ${matched} of ${afterRun} ${afterRun === 1 ? 'time' : 'times'} (${pct(matched / afterRun, 0)}).`
      : ` No run of ${RUN} of the same side has happened yet.`;
    status.textContent = `${total.toLocaleString('en-US')} flips: ${pct(heads / total)} heads. The share gets closer to 50% as the flips pile up, though heads minus tails can keep growing.${after}`;
  }

  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-coins-flip]')) {
    b.addEventListener('click', () => {
      const n = Number(b.dataset.coinsFlip);
      if (flips.length + n > 10000) {
        status.textContent = 'The chart ends at 10,000 flips. Press Start again to try once more.';
        sound.play('bad', 0.5);
        return;
      }
      add(n);
      draw();
      sound.play(n > 10 ? 'whoosh' : 'coin', 0.5);
    });
  }
  q<HTMLButtonElement>(tool, '[data-coins-reset]').addEventListener('click', () => {
    flips = [];
    heads = 0;
    longest = 0;
    run = 0;
    afterRun = 0;
    matched = 0;
    shareAt.length = 0;
    draw();
    sound.play('pop');
  });
  draw();
}
