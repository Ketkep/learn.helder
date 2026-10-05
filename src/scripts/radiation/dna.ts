// Scene 5: a break in the code. Each press of Radiate sends a few rays at the DNA and breaks it in
// places. Breaks mend over time: faster in a healthy cell than in a tumour cell. If too many are
// open at the same moment, the cell cannot cope and dies. The rates are made up, to show the idea.

import * as sound from '../sound';
import { q, reducedMotion } from '../util';
import { whenActive } from './active';
import { fill, pick, readUi } from './ui';

const SITES = 14;
/** The cell dies when this many breaks are open at once. */
const LIMIT = 8;
const REPAIR = { healthy: 0.38, tumour: 0.08 };

interface Ray {
  site: number;
  born: number;
}
interface Site {
  broken: boolean;
  since: number;
  flash: number;
}

export function initDna(root: HTMLElement) {
  const ui = readUi(root).dna;
  const sec = root.querySelector<HTMLElement>('[data-scene="dna"]');
  if (!sec) return;
  const canvas = q<HTMLCanvasElement>(sec, '[data-dna]');
  const typeButtons = [...sec.querySelectorAll<HTMLButtonElement>('[data-cell-type]')];
  const radiate = q<HTMLButtonElement>(sec, '[data-radiate]');
  const resetButton = q<HTMLButtonElement>(sec, '[data-dna-reset]');
  const breaksText = q<HTMLElement>(sec, '[data-breaks-text]');
  const breaksBar = q<HTMLElement>(sec, '[data-breaks-bar]');
  const status = q<HTMLElement>(sec, '[data-dna-status]');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const siteX = (k: number) => 130 + k * 41.5;
  const sites: Site[] = Array.from({ length: SITES }, () => ({ broken: false, since: 0, flash: 0 }));
  let rays: Ray[] = [];
  let type: 'healthy' | 'tumour' = 'healthy';
  let dead = false;
  let wasDamaged = false;
  let active = false;
  let raf = 0;
  let last = 0;
  let spin = 0;
  let repaired = 0;

  const open = () => sites.filter((s) => s.broken).length;

  function say(text: string) {
    status.innerHTML = text;
  }

  function reset() {
    sites.forEach((s) => Object.assign(s, { broken: false, since: 0, flash: 0 }));
    rays = [];
    dead = false;
    wasDamaged = false;
    repaired = 0;
    radiate.disabled = false;
    say(type === 'healthy' ? ui.startHealthy : ui.startTumour);
    meters();
    if (!raf) frame(performance.now());
  }

  function meters() {
    const n = open();
    breaksText.textContent = fill(ui.breaksOf, { n, limit: LIMIT });
    breaksBar.style.width = `${Math.min(100, (n / LIMIT) * 100)}%`;
    breaksBar.classList.toggle('hot', n >= LIMIT - 2);
  }

  function burst() {
    if (dead) return;
    const free = sites.map((s, i) => (s.broken || rays.some((r) => r.site === i) ? -1 : i)).filter((i) => i >= 0);
    const now = performance.now();
    const picks = Math.min(3, free.length);
    for (let i = 0; i < picks; i++) {
      const k = (Math.random() * free.length) | 0;
      rays.push({ site: free.splice(k, 1)[0], born: now + i * 90 });
    }
    sound.play('beam');
    if (reducedMotion()) {
      // No flying rays: the breaks appear at once
      rays.forEach((r) => hit(r.site, now));
      rays = [];
      draw(now);
    }
    if (!raf) frame(now);
  }

  function hit(k: number, now: number) {
    const s = sites[k];
    if (s.broken || dead) return;
    s.broken = true;
    s.since = now;
    s.flash = now;
    wasDamaged = true;
    sound.play('snap');
    meters();
    if (open() >= LIMIT) {
      dead = true;
      rays = [];
      radiate.disabled = true;
      sound.play('thud');
      say(ui.dead);
    } else {
      say(fill(pick(open(), ui.broken), { n: open() }));
    }
  }

  // ---- drawing
  function wave(x0: number, y0: number, x1: number, y1: number, t: number) {
    // a short wavy ray, like the drawing of a photon
    const c = ctx!;
    const len = Math.hypot(x1 - x0, y1 - y0);
    const ux = (x1 - x0) / len;
    const uy = (y1 - y0) / len;
    const head = len * t;
    const tail = Math.max(0, head - 120);
    c.beginPath();
    for (let d = tail; d <= head; d += 4) {
      const w = Math.sin(d / 7) * 7;
      const px = x0 + ux * d - uy * w;
      const py = y0 + uy * d + ux * w;
      if (d === tail) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.strokeStyle = '#ffe58a';
    c.lineWidth = 5;
    c.lineCap = 'round';
    c.stroke();
  }

  function draw(now: number) {
    const c = ctx!;
    c.clearRect(0, 0, 800, 800);
    c.fillStyle = '#0a1426';
    c.fillRect(0, 0, 800, 800);

    const amp = 100;
    const k = (2 * Math.PI) / 330;
    const yA = (x: number) => 400 + amp * Math.sin(k * x + spin);
    const yB = (x: number) => 400 - amp * Math.sin(k * x + spin);
    const gap = (x: number) => {
      for (let i = 0; i < SITES; i++) if (sites[i].broken && Math.abs(x - siteX(i)) < 15) return true;
      return false;
    };
    c.globalAlpha = dead ? 0.38 : 1;

    // the rungs between the strands: four colours, like the four bases
    const colours = ['#ffd166', '#06d6a0', '#ef476f', '#4cc9f0'];
    for (let x = 70, i = 0; x < 735; x += 16.6, i++) {
      if (gap(x)) continue;
      const a = yA(x);
      const b = yB(x);
      const mid = (a + b) / 2;
      c.lineWidth = 6;
      c.lineCap = 'butt';
      c.strokeStyle = colours[i % 4];
      c.beginPath();
      c.moveTo(x, a);
      c.lineTo(x, mid);
      c.stroke();
      c.strokeStyle = colours[(i + 2) % 4];
      c.beginPath();
      c.moveTo(x, mid);
      c.lineTo(x, b);
      c.stroke();
    }

    // the two strands, with the one in front drawn over the other
    const strand = (f: (x: number) => number, colour: string, front: boolean) => {
      c.strokeStyle = colour;
      c.lineWidth = front ? 13 : 9;
      c.lineCap = 'round';
      let drawing = false;
      for (let x = 60; x <= 745; x += 3) {
        const isFront = Math.cos(k * x + spin) * (f === yA ? 1 : -1) > 0;
        if (gap(x) || isFront !== front) {
          if (drawing) c.stroke();
          drawing = false;
          continue;
        }
        if (!drawing) {
          c.beginPath();
          c.moveTo(x, f(x));
          drawing = true;
        } else {
          c.lineTo(x, f(x));
        }
      }
      if (drawing) c.stroke();
    };
    strand(yA, '#2f7fd6', false);
    strand(yB, '#d9792f', false);
    strand(yA, '#6cc3ff', true);
    strand(yB, '#ffb066', true);
    c.globalAlpha = 1;

    // the breaks: loose ends with a glow, and a flash when a break has just mended
    sites.forEach((s, i) => {
      const x = siteX(i);
      if (s.broken) {
        const g = c.createRadialGradient(x, 400, 4, x, 400, 70);
        g.addColorStop(0, 'rgba(255,120,60,0.55)');
        g.addColorStop(1, 'rgba(255,120,60,0)');
        c.fillStyle = g;
        c.beginPath();
        c.arc(x, 400, 70, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#ff6a3d';
        c.lineWidth = 5;
        c.lineCap = 'round';
        c.beginPath();
        for (const a of [0.6, 2.2, 3.9, 5.4]) {
          c.moveTo(x + Math.cos(a) * 20, 400 + Math.sin(a) * 20);
          c.lineTo(x + Math.cos(a) * 36, 400 + Math.sin(a) * 36);
        }
        c.stroke();
      } else if (now - s.flash < 500 && s.flash > 0) {
        c.strokeStyle = `rgba(110,255,170,${1 - (now - s.flash) / 500})`;
        c.lineWidth = 6;
        c.beginPath();
        c.arc(x, 400, 24 + (now - s.flash) / 12, 0, Math.PI * 2);
        c.stroke();
      }
    });

    // rays on their way
    rays.forEach((r) => {
      const t = (now - r.born) / 520;
      if (t <= 0) return;
      wave(30, 60 + (r.site % 3) * 40, siteX(r.site), 400, Math.min(1, t));
    });
  }

  function frame(now: number) {
    const dt = Math.min(0.1, (now - last) / 1000 || 0.016);
    last = now;
    if (!reducedMotion()) spin += dt * 0.9;

    // rays that have arrived
    const arrived = rays.filter((r) => now - r.born >= 520);
    if (arrived.length) {
      arrived.forEach((r) => hit(r.site, now));
      rays = rays.filter((r) => !arrived.includes(r));
    }

    // mending: each open break may mend, and a healthy cell does it faster
    if (!dead) {
      sites.forEach((s) => {
        if (s.broken && now - s.since > 500 && Math.random() < REPAIR[type] * dt) {
          s.broken = false;
          s.flash = now;
          repaired++;
          sound.play('tick');
          meters();
          if (open() === 0 && wasDamaged && rays.length === 0) {
            say(fill(ui.mended, { n: repaired }));
            wasDamaged = false;
            sound.play('good');
          } else if (open() > 0) {
            say(fill(pick(open(), ui.left), { n: open(), m: repaired }));
          }
        }
      });
    }

    draw(now);
    const busy = active && (!reducedMotion() || rays.length > 0 || open() > 0);
    raf = busy ? requestAnimationFrame(frame) : 0;
  }

  typeButtons.forEach((b) =>
    b.addEventListener('click', () => {
      type = (b.dataset.cellType as 'healthy' | 'tumour') ?? 'healthy';
      typeButtons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      reset();
    }),
  );
  radiate.addEventListener('click', burst);
  resetButton.addEventListener('click', reset);

  whenActive(sec, (on) => {
    active = on;
    if (on && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });

  reset();
  draw(performance.now());
}
