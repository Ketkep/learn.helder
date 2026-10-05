// Scene 7: the weeks. A dish of tumour cells and healthy cells is treated day by day, on weekdays,
// with the same total dose split into more or fewer sessions. Each cell has a place in the cell
// cycle, and the cells about to divide take the most damage. Healthy cells grow back from their
// neighbours between sessions. The numbers are made up to show the idea.

import * as sound from '../sound';
import { fillRange, q, reducedMotion } from '../util';
import { seeded } from '../../lib/rand';
import { fill, pick, readUi } from './ui';

const SIZE = 800;
const SPACING = 42;
const REACH = 350;
const TUMOUR_R = 138;
const TOTAL = 60;
const STOPS = [1, 5, 10, 20, 30];
/** How much of the damage a cell takes for a dose of 2 gray, by phase: dividing is the worst. */
const KILL = { m: 0.55, g2: 0.45, g1: 0.35, s: 0.2 };
/** Healthy cells repair better, so they take less of it. */
const HEALTHY_FACTOR = 0.3;
/** The average of the four numbers above, weighted by how long a cell spends in each phase. */
const AVERAGE = 0.32;

interface Cell {
  x: number;
  y: number;
  n: number[];
  tumour: boolean;
  phi0: number;
  period: number;
  jx: number;
  jy: number;
}

export function initWeeks(root: HTMLElement) {
  const ui = readUi(root).weeks;
  const sec = root.querySelector<HTMLElement>('[data-scene="weeks"]');
  if (!sec) return;
  const canvas = q<HTMLCanvasElement>(sec, '[data-weeks]');
  const slider = q<HTMLInputElement>(sec, '[data-sessions]');
  const sliderOut = q<HTMLOutputElement>(sec, '[data-sessions-out]');
  const calendar = q<HTMLElement>(sec, '[data-cal]');
  const startButton = q<HTMLButtonElement>(sec, '[data-start]');
  const resetButton = q<HTMLButtonElement>(sec, '[data-wk-reset]');
  const tumourText = q<HTMLElement>(sec, '[data-tumour-text]');
  const tumourBar = q<HTMLElement>(sec, '[data-tumour-bar]');
  const healthyText = q<HTMLElement>(sec, '[data-healthy-text]');
  const healthyBar = q<HTMLElement>(sec, '[data-healthy-bar]');
  const status = q<HTMLElement>(sec, '[data-wk-status]');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // The dish: a honeycomb with the tumour in the middle
  const rnd = seeded(77);
  const cells: Cell[] = [];
  const rowH = SPACING * 0.866;
  for (let row = -10; row <= 10; row++) {
    for (let col = -11; col <= 11; col++) {
      const x = SIZE / 2 + col * SPACING + (row % 2 ? SPACING / 2 : 0);
      const y = SIZE / 2 + row * rowH;
      const r = Math.hypot(x - SIZE / 2, y - SIZE / 2);
      if (r < REACH) {
        cells.push({ x, y, n: [], tumour: r < TUMOUR_R, phi0: rnd(), period: 20 + rnd() * 10, jx: (rnd() - 0.5) * 6, jy: (rnd() - 0.5) * 6 });
      }
    }
  }
  cells.forEach((a, i) => {
    cells.forEach((b, j) => {
      if (i !== j && Math.hypot(a.x - b.x, a.y - b.y) < SPACING * 1.1) a.n.push(j);
    });
  });
  const tumourCount = cells.filter((c) => c.tumour).length;
  const healthyCount = cells.length - tumourCount;

  let alive = new Uint8Array(cells.length).fill(1);
  let hitAt = new Float64Array(cells.length);
  let day = 0;
  let schedule = new Set<number>();
  let endDay = 0;
  let timer = 0;
  let running = false;
  let flashUntil = 0;
  let lowest = 1;

  const sessions = () => STOPS[Number(slider.value)];

  function plan() {
    schedule = new Set();
    let n = 0;
    for (let d = 0; n < sessions(); d++) {
      if (d % 7 < 5) {
        schedule.add(d);
        n++;
      }
    }
    endDay = Math.max(...schedule) + 3;
  }

  const phase = (c: Cell, d: number) => (c.phi0 + (d * 24) / c.period) % 1;
  const phaseKill = (f: number) => (f >= 0.88 ? KILL.m : f >= 0.72 ? KILL.g2 : f >= 0.4 ? KILL.s : KILL.g1);

  function buildCalendar() {
    calendar.innerHTML = '';
    const weeks = Math.ceil((endDay + 1) / 7);
    for (let d = 0; d < weeks * 7; d++) {
      const s = document.createElement('span');
      s.className = 'wk-day' + (d % 7 >= 5 ? ' rest' : '') + (schedule.has(d) ? ' tx' : '');
      s.dataset.day = String(d);
      calendar.appendChild(s);
    }
  }

  function markCalendar() {
    calendar.querySelectorAll<HTMLElement>('.wk-day').forEach((el) => {
      const d = Number(el.dataset.day);
      el.classList.toggle('past', d < day);
      el.classList.toggle('now', d === day);
    });
  }

  function counts() {
    let t = 0;
    let h = 0;
    cells.forEach((c, i) => {
      if (alive[i]) {
        if (c.tumour) t++;
        else h++;
      }
    });
    return { t, h };
  }

  function draw(now: number) {
    const c = ctx!;
    c.fillStyle = '#f1dce3';
    c.fillRect(0, 0, SIZE, SIZE);
    cells.forEach((cell, i) => {
      const { x, y } = cell;
      if (!alive[i]) {
        c.beginPath();
        c.arc(x, y, 16, 0, Math.PI * 2);
        c.setLineDash([4, 6]);
        c.lineWidth = 2;
        c.strokeStyle = '#d9bcc7';
        c.stroke();
        c.setLineDash([]);
      } else if (cell.tumour) {
        const f = phase(cell, day);
        c.beginPath();
        c.arc(x, y, 19, 0, Math.PI * 2);
        c.fillStyle = '#d3a0c6';
        c.fill();
        c.lineWidth = 2.5;
        c.strokeStyle = f >= 0.72 ? '#f2b705' : '#a2619a';
        c.stroke();
        if (f >= 0.72) {
          c.lineWidth = 4;
          c.beginPath();
          c.arc(x, y, 23, 0, Math.PI * 2);
          c.stroke();
        }
        c.fillStyle = '#4a2c7a';
        c.beginPath();
        if (f >= 0.88) {
          c.ellipse(x - 6, y, 6, 8.5, 0.3, 0, Math.PI * 2);
          c.ellipse(x + 7, y, 6, 8.5, -0.3, 0, Math.PI * 2);
        } else {
          c.ellipse(x + cell.jx / 2, y + cell.jy / 2, 11, 9.5, 0.4, 0, Math.PI * 2);
        }
        c.fill();
      } else {
        c.beginPath();
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
      // a red ring on cells that were just hit
      const since = now - hitAt[i];
      if (hitAt[i] > 0 && since < 700) {
        c.beginPath();
        c.arc(x, y, 22 + since / 40, 0, Math.PI * 2);
        c.lineWidth = 3;
        c.strokeStyle = `rgba(228,80,26,${1 - since / 700})`;
        c.stroke();
      }
    });
    if (now < flashUntil) {
      c.fillStyle = 'rgba(255,138,61,0.22)';
      for (let k = 0; k < 9; k++) c.fillRect(60 + k * 80, 0, 26, SIZE);
    }
  }

  function meters(final = false) {
    const { t, h } = counts();
    const tp = Math.round((t / tumourCount) * 100);
    const hp = Math.round((h / healthyCount) * 100);
    tumourText.textContent = `${tp}%`;
    tumourBar.style.width = `${tp}%`;
    healthyText.textContent = `${hp}%`;
    healthyBar.style.width = `${hp}%`;
    healthyBar.classList.toggle('hot', hp < 50);
    lowest = Math.min(lowest, h / healthyCount);
    if (final) {
      const low = Math.round(lowest * 100);
      let verdict: string;
      if (t === 0 && hp >= 80) verdict = ui.verdictGone;
      else if (t === 0) verdict = ui.verdictCost;
      else verdict = fill(pick(t, ui.verdictLeft), { n: t });
      status.innerHTML = fill(ui.result, { d: day, low, hp, verdict });
    }
  }

  function treat(now: number) {
    const dose = TOTAL / sessions();
    cells.forEach((cell, i) => {
      if (!alive[i]) return;
      const k = cell.tumour ? phaseKill(phase(cell, day)) : AVERAGE * HEALTHY_FACTOR;
      const survive = (1 - k) ** (dose / 2);
      if (Math.random() > survive) {
        alive[i] = 0;
        hitAt[i] = now;
      }
    });
  }

  function regrow() {
    const next = alive.slice();
    cells.forEach((cell, i) => {
      if (alive[i]) return;
      const near = cell.n.filter((j) => alive[j] && cells[j].tumour === cell.tumour);
      if (!near.length) return;
      const share = near.length / cell.n.length;
      // healthy tissue grows back well, a tumour much more slowly
      if (Math.random() < (cell.tumour ? 0.04 : 0.5) * share) next[i] = 1;
    });
    alive = next;
  }

  /** One day of the plan. Gives back true when the plan is over. */
  function step(now: number): boolean {
    if (schedule.has(day)) {
      flashUntil = now + 320;
      treat(now);
      sound.play('beam', 0.7);
    }
    regrow();
    meters();
    draw(now);
    markCalendar();
    day++;
    if (day > endDay) {
      finish(now);
      return true;
    }
    const { t, h } = counts();
    status.innerHTML = fill(ui.day, { d: day, t, h });
    return false;
  }

  function finish(now: number) {
    stopTimer();
    day = endDay;
    markCalendar();
    meters(true);
    draw(now);
    sound.play('good');
    startButton.textContent = ui.again;
  }

  function stopTimer() {
    running = false;
    window.clearInterval(timer);
    startButton.textContent = ui.start;
  }

  function reset() {
    stopTimer();
    alive = new Uint8Array(cells.length).fill(1);
    hitAt = new Float64Array(cells.length);
    day = 0;
    lowest = 1;
    plan();
    buildCalendar();
    markCalendar();
    meters();
    draw(performance.now());
    const n = sessions();
    sliderOut.textContent = fill(pick(n, ui.plan), { n, dose: TOTAL / n });
    fillRange(slider);
    status.innerHTML = fill(pick(n, ui.ready), { total: TOTAL, n });
  }

  startButton.addEventListener('click', () => {
    if (running) {
      stopTimer();
      return;
    }
    if (day >= endDay) reset();
    sound.play('tick');
    if (reducedMotion()) {
      // No animation: run all the days at once
      while (!step(performance.now())) {
        // keep going until the plan is over
      }
      return;
    }
    running = true;
    startButton.textContent = ui.pause;
    const dayMs = Math.min(700, Math.max(220, 9000 / (endDay + 1)));
    timer = window.setInterval(() => {
      step(performance.now());
    }, dayMs);
  });
  resetButton.addEventListener('click', () => {
    reset();
  });
  slider.addEventListener('input', reset);

  // the red rings fade, so the picture is redrawn for a moment after each session
  window.setInterval(() => {
    if (running) draw(performance.now());
  }, 60);

  reset();
}
