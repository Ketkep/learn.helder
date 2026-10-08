// Experiment 1: two dice. The exact odds come from counting the 36 outcomes.

import * as sound from '../sound';
import { q } from '../util';
import { pct, pick, ways } from './stats';

const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export function initDice(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-dice-tool]');
  if (!tool) return;
  const cols = new Map([...tool.querySelectorAll<HTMLElement>('[data-sum]')].map((c) => [Number(c.dataset.sum), c]));
  const dieA = q<HTMLElement>(tool, '[data-die="a"]');
  const dieB = q<HTMLElement>(tool, '[data-die="b"]');
  const last = q<HTMLElement>(tool, '[data-dice-last]');
  const status = q<HTMLElement>(tool, '[data-dice-status]');
  const counts = new Array(13).fill(0);
  let total = 0;

  function draw() {
    // The tallest of the bars or the marks sets the scale
    let top = 0;
    for (let s = 2; s <= 12; s++) top = Math.max(top, counts[s], (total * ways(s)) / 36);
    top = Math.max(top, 1);
    for (const [s, col] of cols) {
      const bar = q<HTMLElement>(col, '[data-bar]');
      const exp = q<HTMLElement>(col, '[data-exp]');
      const n = total ? counts[s] : (ways(s) / 6) * (top || 1);
      const expected = total ? (total * ways(s)) / 36 : (ways(s) / 6) * top;
      bar.style.height = `${((total ? n : expected) / top) * 100}%`;
      exp.style.bottom = `${(expected / top) * 100}%`;
      q<HTMLElement>(col, '[data-count]').textContent = total ? String(counts[s]) : '';
    }
    if (!total) {
      status.textContent = 'The marks show the exact odds: 1 way for a 2, 6 ways for a 7 and 1 way for a 12, out of 36. Roll to see how close you get.';
      return;
    }
    const seven = counts[7];
    const times = (n: number) => (n === 1 ? 'once' : `${n.toLocaleString('en-US')} times`);
    status.textContent = `${total.toLocaleString('en-US')} roll${total === 1 ? '' : 's'}. A 7 came up ${times(seven)} (${pct(seven / total)}), and the exact odds are ${pct(6 / 36)}. A 2 came up ${times(counts[2])} (${pct(counts[2] / total)}) against ${pct(1 / 36)}, and a 12 came up ${times(counts[12])} (${pct(counts[12] / total)}) against ${pct(1 / 36)}.`;
  }

  function roll(n: number) {
    let a = 0;
    let b = 0;
    for (let i = 0; i < n; i++) {
      a = pick(6);
      b = pick(6);
      counts[a + b]++;
      total++;
    }
    dieA.textContent = FACES[a - 1];
    dieB.textContent = FACES[b - 1];
    last.textContent = n === 1 ? `${a} and ${b}: total ${a + b}` : `The last roll was ${a} and ${b}: total ${a + b}`;
    draw();
    sound.play(n > 1 ? 'whoosh' : 'tick', 0.5);
  }

  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-dice-roll]')) b.addEventListener('click', () => roll(Number(b.dataset.diceRoll)));
  q<HTMLButtonElement>(tool, '[data-dice-clear]').addEventListener('click', () => {
    counts.fill(0);
    total = 0;
    dieA.textContent = '?';
    dieB.textContent = '?';
    last.textContent = 'Press Roll to throw two dice.';
    draw();
    sound.play('pop');
  });
  draw();
}
