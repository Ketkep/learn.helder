// The experiment of "Twenty-three strangers": a room of people with random birthdays. "New room" fills
// one room, "Run 1,000 rooms" fills a thousand and adds a point to the chart. A switch changes what
// counts as a match. The goals go to the edition (flow.ts) as the reader does the things on the list.
// Nothing moves by itself, so there is nothing to stop for reduced motion.

import { anyMatch, meMatch, pairs, room, rooms, type Mode } from './model';
import { grid, runsChart, wheel, type Run } from './draw';
import { seeded } from '../../lib/rand';
import { fillRange, group } from '../../scripts/util';

const sim = document.querySelector<HTMLElement>('[data-ts-sim]');
if (sim) start(sim);

function start(sim: HTMLElement) {
  const $ = <T extends Element>(s: string) => sim.querySelector<T>(s);
  const input = $<HTMLInputElement>('[data-ts-n]');
  if (!input) return;

  // The same sequence of rooms for everyone, so a test can count on it
  const rand = seeded(1914);
  let n = 23;
  let mode: Mode = 'any';
  const runs: Run[] = [];
  const sizes = new Set<number>();

  const goal = (id: string) => sim.dispatchEvent(new CustomEvent('learndle:goal', { detail: id, bubbles: true }));
  const put = (sel: string, html: string) => {
    const el = $<HTMLElement>(sel);
    if (el) el.innerHTML = html;
  };
  const text = (sel: string, t: string) => {
    const el = $<HTMLElement>(sel);
    if (el) el.textContent = t;
  };
  const exact = () => (mode === 'any' ? anyMatch(n) : meMatch(n));
  const percent = (x: number) => `${(x * 100).toFixed(1)} per cent`;

  function pairsLine() {
    text(
      '[data-ts-pairs]',
      mode === 'any'
        ? `${n} people make ${group(pairs(n))} pairs. Each pair has a 1 in 365 chance of sharing a birthday.`
        : `You can be paired with ${n - 1} ${n - 1 === 1 ? 'other' : 'others'}: ${n - 1} ${n - 1 === 1 ? 'pair' : 'pairs'} with you in them. Your birthday here is 13 November.`,
    );
  }

  function oneRoom() {
    put('[data-ts-wheel]', wheel(room(n, mode, rand), mode));
  }

  function blank() {
    put('[data-ts-grid]', grid(Array.from({ length: 1000 }, () => false)));
    text('[data-ts-tally]', `Not run yet for ${n} people.`);
  }

  function sync() {
    input!.value = String(n);
    fillRange(input!);
    text('[data-ts-n-out]', String(n));
    sim.querySelectorAll('[data-ts-jump]').forEach((b) => b.setAttribute('aria-pressed', String(Number((b as HTMLElement).dataset.tsJump) === n)));
    sim.querySelectorAll('[data-ts-mode]').forEach((b) => b.setAttribute('aria-pressed', String((b as HTMLElement).dataset.tsMode === mode)));
    pairsLine();
    put('[data-ts-runs]', runsChart(runs, n));
  }

  function change() {
    sync();
    oneRoom();
    blank();
  }

  input.addEventListener('input', () => {
    n = Number(input.value);
    change();
  });

  sim.querySelectorAll<HTMLButtonElement>('[data-ts-jump]').forEach((b) =>
    b.addEventListener('click', () => {
      n = Number(b.dataset.tsJump);
      change();
    }),
  );

  sim.querySelectorAll<HTMLButtonElement>('[data-ts-mode]').forEach((b) =>
    b.addEventListener('click', () => {
      mode = b.dataset.tsMode === 'me' ? 'me' : 'any';
      change();
    }),
  );

  $('[data-ts-one]')?.addEventListener('click', () => {
    oneRoom();
    const label = $('[data-ts-wheel] svg')?.getAttribute('aria-label') ?? '';
    text('[data-ts-say]', label);
  });

  $('[data-ts-many]')?.addEventListener('click', () => {
    const results = rooms(n, mode, 1000, rand);
    const hits = results.filter(Boolean).length;
    put('[data-ts-grid]', grid(results));
    const what = mode === 'any' ? 'had a shared birthday' : 'had someone with your birthday';
    const line = `In 1,000 rooms of ${n} people, ${group(hits)} ${what}. The exact chance is ${percent(exact())}.`;
    text('[data-ts-tally]', line);
    text('[data-ts-say]', line);
    // One point per size and question: a new run at the same size replaces the old one
    const old = runs.findIndex((r) => r.n === n && r.mode === mode);
    if (old >= 0) runs.splice(old, 1);
    runs.push({ n, mode, share: hits / 1000 });
    put('[data-ts-runs]', runsChart(runs, n));
    if (mode === 'any') {
      sizes.add(n);
      if (n === 23) goal('ran-23');
      if ([...sizes].filter((s) => s !== 23).length >= 2) goal('sizes');
    } else if (n === 23) {
      goal('me-23');
    }
  });

  sync();
  blank();
}
