// Stop 3: share the risk. The bars are the exact chances for every possible result, so the
// slider shows what spreading the money does. "Send the fleet" then plays one voyage with dice.

import * as sound from '../sound';
import { clear, fillRange, group, q, reducedMotion } from '../util';

const NS = 'http://www.w3.org/2000/svg';

/** The chance that exactly j of k ships come home. */
function chanceOf(k: number, j: number, p: number) {
  let c = 1;
  for (let i = 1; i <= j; i++) c = (c * (k - j + i)) / i;
  return c * p ** j * (1 - p) ** (k - j);
}

/** Where each ship goes in the picture: one row for a few ships, two rows for many. */
function layout(k: number) {
  const x0 = 206;
  const span = 500;
  const rows = k <= 5 ? 1 : 2;
  const perRow = Math.ceil(k / rows);
  const w = k === 1 ? 240 : k === 2 ? 190 : Math.min(130, (span / perRow) * 1.08);
  // Two rows are staggered by half a step, so the front row sits between the back ships
  const step = perRow > 1 ? (span - w) / (perRow - (rows === 2 ? 0.5 : 1)) : 0;
  const out: { x: number; y: number; w: number }[] = [];
  for (let i = 0; i < k; i++) {
    const row = rows === 1 ? 0 : i % 2;
    const col = rows === 1 ? i : Math.floor(i / 2);
    const hull = rows === 1 ? 286 : row === 0 ? 272 : 294;
    const x = perRow === 1 ? x0 + (span - w) / 2 : x0 + col * step + row * (step / 2);
    out.push({ x, y: hull - w * 0.918 * 0.936, w });
  }
  return out;
}

export function initExchange(root: HTMLElement) {
  const station = root.querySelector<HTMLElement>('[data-station="exchange"]');
  if (!station) return;
  const scene = q<HTMLElement>(station, '[data-ex]');
  const fleetG = q<SVGGElement>(station, '[data-ex-fleet]');
  const barsG = q<SVGGElement>(station, '[data-ex-bars]');
  const slider = q<HTMLInputElement>(station, '[data-ex-slider]');
  const out = q<HTMLOutputElement>(station, '[data-ex-out]');
  const send = q<HTMLButtonElement>(station, '[data-ex-send]');
  const info = q<HTMLElement>(station, '[data-ex-info]');
  const status = q<HTMLElement>(station, '[data-ex-status]');

  const fleets = (scene.dataset.fleets ?? '1').split(',').map(Number);
  const p = Number(scene.dataset.chance);
  const payback = Number(scene.dataset.payback);
  const stake = Number(scene.dataset.stake);
  const note = info.textContent?.trim() ?? '';

  let ships: SVGGElement[] = [];
  let timers: number[] = [];
  let bars: SVGRectElement[] = [];

  const count = () => fleets[Number(slider.value)];
  const back = (j: number, k: number) => (stake * payback * j) / k;

  function lossText(k: number) {
    const pct = 100 * (1 - p) ** k;
    if (pct >= 1) return `${pct.toFixed(pct < 10 ? 1 : 0)}%`;
    if (pct >= 0.01) return `${pct.toFixed(2)}%`;
    return 'less than 1 in 10,000';
  }

  function badRun(k: number) {
    let total = 0;
    for (let j = 0; j <= k; j++) {
      total += chanceOf(k, j, p);
      if (total >= 0.1) return back(j, k);
    }
    return back(k, k);
  }

  function drawChart(k: number) {
    const chances = Array.from({ length: k + 1 }, (_, j) => chanceOf(k, j, p));
    const top = Math.max(...chances);
    const bw = Math.min(26, (264 / (k + 1)) * 0.78);
    bars.forEach((b) => b.remove());
    bars = chances.map((c, j) => {
      const h = c > 1e-6 ? Math.max(1.5, (c / top) * 68) : 0;
      const x = 18 + (264 * (160 * j) / k / 160);
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('class', 'ex-bar');
      r.setAttribute('x', String(x - bw / 2));
      r.setAttribute('y', String(100 - h));
      r.setAttribute('width', String(bw));
      r.setAttribute('height', String(h));
      barsG.appendChild(r);
      return r;
    });
  }

  function drawFleet(k: number) {
    timers.forEach(clearTimeout);
    timers = [];
    clear(fleetG);
    ships = layout(k).map((s) => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'ex-ship');
      const use = document.createElementNS(NS, 'use');
      use.setAttribute('href', '#nl-ship');
      use.setAttribute('x', s.x.toFixed(1));
      use.setAttribute('y', s.y.toFixed(1));
      use.setAttribute('width', s.w.toFixed(1));
      use.setAttribute('height', (s.w * 0.918).toFixed(1));
      const coin = document.createElementNS(NS, 'circle');
      coin.setAttribute('class', 'ex-coin');
      coin.setAttribute('cx', (s.x + s.w * 0.5).toFixed(1));
      coin.setAttribute('cy', (s.y - 8).toFixed(1));
      coin.setAttribute('r', (Math.max(5, s.w * 0.05)).toFixed(1));
      g.append(use, coin);
      fleetG.appendChild(g);
      return g;
    });
  }

  function describe() {
    const k = count();
    fillRange(slider);
    out.textContent = k === 1 ? '1 ship' : `${k} ships`;
    drawFleet(k);
    drawChart(k);
    status.innerHTML = '';
    info.innerHTML =
      `${note} ${k === 1 ? 'One ship holds' : `${k} ships hold`} ${group(stake / k)} guilders each. ` +
      `Average: <strong>${group(back(k, k) * p)}</strong> back. Lose everything: <strong>${lossText(k)}</strong>. ` +
      `A bad run, 1 time in 10, gives <strong>${group(badRun(k))}</strong> or less.`;
  }

  function sendFleet() {
    const k = count();
    drawFleet(k);
    const home = ships.map(() => Math.random() < p);
    const j = home.filter(Boolean).length;
    send.disabled = true;
    const finish = () => {
      bars.forEach((b, i) => b.classList.toggle('mine', i === j));
      const lost = k - j;
      status.innerHTML =
        `${lost === 0 ? 'Every ship came home.' : `<strong>${lost}</strong> of ${k} ${k === 1 ? 'ship' : 'ships'} sank.`} ` +
        `You get back <strong>${group(back(j, k))}</strong> guilders for your ${stake}.`;
      send.disabled = false;
    };
    if (reducedMotion()) {
      ships.forEach((g, i) => g.classList.add(home[i] ? 'home' : 'lost'));
      finish();
      return;
    }
    ships.forEach((g, i) => {
      timers.push(
        window.setTimeout(() => {
          g.classList.add(home[i] ? 'home' : 'lost');
          sound.play(home[i] ? 'clink' : 'thud');
        }, 260 + i * (k > 10 ? 70 : 140)),
      );
    });
    timers.push(window.setTimeout(finish, 260 + k * (k > 10 ? 70 : 140) + 600));
  }

  slider.addEventListener('input', describe);
  send.addEventListener('click', sendFleet);
  describe();
}
