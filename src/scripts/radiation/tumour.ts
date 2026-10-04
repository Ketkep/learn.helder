// Scene 3: a crowd of cells. Each day a faulty cell may divide into a neighbour, and the immune
// system may clear it away. When the faulty cells win and there are many, some travel and
// settle far away (a metastasis). It is a toy: the numbers only show the idea.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { seeded } from '../../lib/rand';

const SIZE = 800;
const SPACING = 38;
const REACH = 372;
const DIVIDE = 0.42;

interface Cell {
  x: number;
  y: number;
  n: number[];
  jx: number;
  jy: number;
}

export function initTumour(root: HTMLElement) {
  const sec = root.querySelector<HTMLElement>('[data-scene="tumour"]');
  if (!sec) return;
  const canvas = q<HTMLCanvasElement>(sec, '[data-tumour]');
  const slider = q<HTMLInputElement>(sec, '[data-immune]');
  const sliderOut = q<HTMLOutputElement>(sec, '[data-immune-out]');
  const runButton = q<HTMLButtonElement>(sec, '[data-run]');
  const restartButton = q<HTMLButtonElement>(sec, '[data-restart]');
  const status = q<HTMLElement>(sec, '[data-tm-status]');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // The cells sit on a honeycomb inside the lens
  const rnd = seeded(31);
  const cells: Cell[] = [];
  const rowH = SPACING * 0.866;
  for (let row = -12; row <= 12; row++) {
    for (let col = -13; col <= 13; col++) {
      const x = SIZE / 2 + col * SPACING + (row % 2 ? SPACING / 2 : 0);
      const y = SIZE / 2 + row * rowH;
      if (Math.hypot(x - SIZE / 2, y - SIZE / 2) < REACH) {
        cells.push({ x, y, n: [], jx: (rnd() - 0.5) * 6, jy: (rnd() - 0.5) * 6 });
      }
    }
  }
  cells.forEach((a, i) => {
    cells.forEach((b, j) => {
      if (i !== j && Math.hypot(a.x - b.x, a.y - b.y) < SPACING * 1.1) a.n.push(j);
    });
  });
  const middle = cells.reduce((best, c, i) => (Math.hypot(c.x - SIZE / 2, c.y - SIZE / 2) < Math.hypot(cells[best].x - SIZE / 2, cells[best].y - SIZE / 2) ? i : best), 0);

  let faulty = new Uint8Array(cells.length);
  let travelled = 0;
  let running = false;
  let timer = 0;
  let days = 0;

  function reset() {
    faulty = new Uint8Array(cells.length);
    travelled = 0;
    days = 0;
    // The tumour starts as a small clump around the middle
    const seen = new Set([middle]);
    const queue = [middle];
    while (queue.length && seen.size < 30) {
      const i = queue.shift() as number;
      for (const j of cells[i].n) {
        if (!seen.has(j) && seen.size < 30) {
          seen.add(j);
          queue.push(j);
        }
      }
    }
    seen.forEach((i) => (faulty[i] = 1));
  }

  const count = () => faulty.reduce((a, b) => a + b, 0);
  const clearChance = () => 0.04 + 0.44 * (Number(slider.value) / 100);

  function draw() {
    const c = ctx!;
    c.fillStyle = '#f1dce3';
    c.fillRect(0, 0, SIZE, SIZE);
    cells.forEach((cell, i) => {
      const x = cell.x;
      const y = cell.y;
      c.beginPath();
      if (faulty[i]) {
        c.arc(x, y, 19.5, 0, Math.PI * 2);
        c.fillStyle = '#d3a0c6';
        c.fill();
        c.lineWidth = 2.5;
        c.strokeStyle = '#a2619a';
        c.stroke();
        c.fillStyle = '#4a2c7a';
        c.beginPath();
        if (i % 7 === 0) {
          // some are dividing right now
          c.ellipse(x - 6 + cell.jx / 3, y + cell.jy / 3, 6.5, 9, 0.3, 0, Math.PI * 2);
          c.ellipse(x + 8 + cell.jx / 3, y + cell.jy / 3, 6.5, 9, -0.3, 0, Math.PI * 2);
        } else {
          c.ellipse(x + cell.jx / 2, y + cell.jy / 2, 12, 10.5, 0.4, 0, Math.PI * 2);
        }
        c.fill();
      } else {
        c.arc(x, y, 17.5, 0, Math.PI * 2);
        c.fillStyle = '#f7dce4';
        c.fill();
        c.lineWidth = 2;
        c.strokeStyle = '#dcb6c4';
        c.stroke();
        c.fillStyle = '#8a7ab8';
        c.beginPath();
        c.arc(x + cell.jx, y + cell.jy, 6.5, 0, Math.PI * 2);
        c.fill();
      }
    });
  }

  function say() {
    const n = count();
    const k = clearChance();
    // On average a faulty cell adds DIVIDE * (1 - k) new ones and is cleared with chance k
    const net = DIVIDE * (1 - k) - k;
    const trend = n === 0 ? 'cleared' : net > 0.05 ? 'growing' : net < -0.02 ? 'shrinking' : 'holding';
    let line = `<strong>Day ${days}.</strong> Faulty cells: <strong>${n}</strong>.`;
    if (travelled > 0) line += ` Spread to other places: <strong>${travelled}</strong>.`;
    if (n === 0) line += ' The immune system cleared them all.';
    else if (n > 330) line += ' The tumour has taken over this patch.';
    else if (!running) line += trend === 'growing' ? ' With this immune system the tumour grows.' : trend === 'shrinking' ? ' With this immune system the tumour shrinks.' : '';
    status.innerHTML = line;
    sliderOut.textContent = Number(slider.value) < 34 ? 'weak' : Number(slider.value) < 67 ? 'medium' : 'strong';
    fillRange(slider);
  }

  function tick() {
    const k = clearChance();
    const list: number[] = [];
    faulty.forEach((f, i) => f && list.push(i));
    for (const i of list) {
      if (Math.random() < k) {
        faulty[i] = 0;
        continue;
      }
      if (Math.random() < DIVIDE) {
        const ns = cells[i].n;
        faulty[ns[(Math.random() * ns.length) | 0]] = 1;
      }
    }
    days++;

    // A big tumour sends cells through the blood: one lands far away
    const n = count();
    if (n > 120 && Math.random() < 0.35) {
      for (let tries = 0; tries < 30; tries++) {
        const j = (Math.random() * cells.length) | 0;
        if (!faulty[j] && Math.hypot(cells[j].x - SIZE / 2, cells[j].y - SIZE / 2) > 250) {
          faulty[j] = 1;
          travelled++;
          sound.play('pop');
          break;
        }
      }
    }
    draw();
    say();
    if (n === 0 || n > 330) stop();
  }

  function stop() {
    running = false;
    window.clearInterval(timer);
    runButton.textContent = 'Let time pass';
    say();
  }

  runButton.addEventListener('click', () => {
    if (running) {
      stop();
      return;
    }
    if (count() === 0 || count() > 330) {
      reset();
      draw();
    }
    running = true;
    runButton.textContent = 'Pause';
    sound.play('tick');
    timer = window.setInterval(tick, 380);
  });
  restartButton.addEventListener('click', () => {
    stop();
    reset();
    draw();
    say();
  });
  slider.addEventListener('input', say);

  reset();
  draw();
  say();
}
