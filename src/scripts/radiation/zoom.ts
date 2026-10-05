// The radiation page: the camera. The page is eight scenes, each one a round picture. Scrolling
// zooms the lens from one scene to the next (in towards the tumour, then back out to the person),
// and waits at each scene so you can use its tool.
// If the screen is too short, or the reader asked for less motion or chose the plain view, none
// of this runs and the page stays a plain stack where every tool still works.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clamp, onMedia, q } from '../util';
import { initRoom } from './room';
import { initBody } from './body';
import { initTumour } from './tumour';
import { initCell } from './cell';
import { initDna } from './dna';
import { initRays } from './rays';
import { initWeeks } from './weeks';
import { initPerson } from './person';
import { fill, readUi } from './ui';

const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
/** A gentle ease for the zoom: mostly even, a little slower at both ends. */
const ease = (t: number) => t * 0.45 + t * t * (3 - 2 * t) * 0.55;

const UNITS: [number, string][] = [
  [1, 'm'],
  [1e-2, 'cm'],
  [1e-3, 'mm'],
  [1e-6, 'µm'],
  [1e-9, 'nm'],
  [1e-12, 'pm'],
];

/** "40 cm", "30 µm", "20 nm": a length for people. The mark is the decimal point or comma of the language. */
function formatSize(m: number, mark: string) {
  for (const [f, name] of UNITS) {
    if (m >= f * 0.95) {
      const v = m / f;
      return `${String(v >= 10 ? Math.round(v) : Math.round(v * 10) / 10).replace('.', mark)} ${name}`;
    }
  }
  return `${Math.round(m * 1e12)} pm`;
}

/** The nearest "round" length at or below x: 1, 2 or 5 times a power of ten. */
function nice(x: number) {
  const p = 10 ** Math.floor(Math.log10(x));
  const f = x / p;
  return (f >= 5 ? 5 : f >= 2 ? 2 : 1) * p;
}

interface Segment {
  s0: number;
  s1: number;
  c0: number;
  c1: number;
}

function initZoom(root: HTMLElement) {
  const ui = readUi(root).hud;
  const rig = q<HTMLElement>(root, '[data-rig]');
  const secs = [...root.querySelectorAll<HTMLElement>('.zsec')];
  const arts = secs.map((s) => q<HTMLElement>(s, '.zart'));
  const lenses = secs.map((s) => q<HTMLElement>(s, '.zscene'));
  const panels = secs.map((s) => q<HTMLElement>(s, '.zpanel'));
  const fovEl = q<HTMLElement>(root, '[data-fov]');
  const ring = q<HTMLElement>(root, '[data-ring]');
  const bar = q<HTMLElement>(root, '[data-bar]');
  const barLabel = q<HTMLElement>(root, '[data-bar-label]');
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-jump]')];
  const plainButton = q<HTMLButtonElement>(root, '[data-plain]');
  const announce = q<HTMLElement>(root, '[data-announce]');
  const titles = secs.map((s) => s.querySelector('h2')?.textContent ?? '');

  const count = secs.length;
  const sizes = secs.map((s) => Number(s.dataset.size));
  const ratios = secs.map((s) => Number(s.dataset.ratio || 1));
  const dirs = secs.map((s) => (s.dataset.dir === 'out' ? -1 : 1));
  /** How the picture of scene k is scaled for the jump to k + 1. Above 1 grows, below 1 shrinks. */
  const factor = (k: number) => (dirs[k] > 0 ? ratios[k] : 1 / ratios[k]);

  // A short pause on each scene, and a longer scroll for each jump
  const dwell = secs.map((_, i) => (i === 0 ? 0.5 : i === count - 1 ? 0.9 : 0.85));
  const jump = 1.0;

  // Wide screens and tablets/phones both need a little height. Phones are allowed to be shorter.
  const calm = '(prefers-reduced-motion: no-preference)';
  const mq = matchMedia(`(min-width: 48rem) and (min-height: 40rem) and ${calm}, (max-width: 47.99rem) and (min-height: 34rem) and ${calm}`);
  const wide = matchMedia('(min-width: 60rem)');

  let film = false;
  let chosenPlain = false;
  try {
    chosenPlain = localStorage.getItem('zoomView') === 'plain';
  } catch {
    // No storage is fine: the zoom view is the default.
  }

  let segments: Segment[] = [];
  let mids: number[] = [];
  let runway = 0;
  let ld = 600;
  let waiting = false;
  let settled = 0;
  let current = 0;
  let lastActive = -1;
  let lastFov = '';
  let lastBar = '';
  let lastDot = -1;
  /** Set when the reader pressed a Next button: the new card takes the keyboard focus when it arrives. */
  let moveFocus = false;

  const top = () => root.getBoundingClientRect().top + window.scrollY;

  /** Where the lens and the card go on this screen. */
  function layout() {
    const vw = rig.clientWidth;
    const vh = rig.clientHeight;
    const rem = 16;
    const gutter = clamp(vw * 0.04, 16, 32);
    const hud = (vw < 768 ? 3.6 : 4.4) * rem + 8;
    let lx: number;
    let ly: number;
    let d: number;
    let px: number;
    let py: number;
    let pw: number;
    let ph: number;

    if (wide.matches) {
      // a narrower laptop or a tablet held sideways gives the text a bit more of the width
      pw = clamp(vw * (vw < 1200 ? 0.45 : 0.39), 22 * rem, 36 * rem);
      const free = vw - pw - gutter * 3;
      d = Math.min(free, vh - hud - gutter * 1.4);
      lx = pw + gutter * 2 + (free - d) / 2;
      ly = hud + (vh - hud - gutter * 1.4 - d) / 2;
      px = gutter;
      py = hud;
      ph = vh - hud - gutter;
    } else {
      d = Math.min(vw - gutter * 2, vh * 0.37);
      lx = (vw - d) / 2;
      ly = hud;
      px = gutter;
      py = ly + d + 40;
      pw = vw - gutter * 2;
      ph = vh - py - 10;
    }
    ld = d;
    const set = (k: string, v: number) => rig.style.setProperty(k, `${Math.round(v)}px`);
    set('--lx', lx);
    set('--ly', ly);
    set('--ld', d);
    set('--px', px);
    set('--py', py);
    set('--pw', pw);
    set('--ph', ph);
  }

  /** A card whose text is too tall for its place gets smaller text, down to a limit. */
  function fitCards() {
    root.querySelectorAll<HTMLElement>('.zcard').forEach((card) => {
      let k = 1;
      card.style.setProperty('--fit', '1');
      while (card.scrollHeight > card.clientHeight + 1 && k > 0.8) {
        k -= 0.03;
        card.style.setProperty('--fit', k.toFixed(2));
      }
    });
  }

  function measure() {
    const vh = rig.clientHeight;
    layout();
    fitCards();
    segments = [];
    mids = [];
    let s = 0;
    for (let i = 0; i < count; i++) {
      mids.push(s + (dwell[i] * vh) / 2);
      segments.push({ s0: s, s1: s + dwell[i] * vh, c0: i, c1: i });
      s += dwell[i] * vh;
      if (i < count - 1) {
        segments.push({ s0: s, s1: s + jump * vh, c0: i, c1: i + 1 });
        s += jump * vh;
      }
    }
    runway = s;
    root.style.height = `${runway + rig.offsetHeight}px`;
    lastActive = -1;
    lastFov = '';
    lastBar = '';
  }

  /** The camera position, as a scene number with decimals, for a scroll position. */
  function cameraAt(s: number) {
    let seg = segments[0];
    for (const g of segments) {
      seg = g;
      if (s <= g.s1) break;
    }
    const len = seg.s1 - seg.s0;
    const t = len > 0 ? clamp((s - seg.s0) / len, 0, 1) : 0;
    return seg.c0 === seg.c1 ? seg.c0 : seg.c0 + ease(t);
  }

  /** How much scene k is scaled when the camera is at c. */
  function scaleOf(k: number, c: number) {
    if (c >= k) return Math.pow(k < count - 1 ? factor(k) : 1, Math.min(1, c - k));
    return Math.pow(factor(k - 1), Math.max(-1, c - k));
  }

  /** How see-through scene k is: the next scene fades in on top, then the old one goes. */
  function opacityOf(k: number, c: number) {
    const d = c - k;
    if (d >= 0) return 1 - smooth(0.62, 0.82, Math.min(1, d));
    return smooth(0.12, 0.6, 1 + Math.max(-1, d));
  }

  function update() {
    waiting = false;
    if (!film) return;
    const s = clamp(-root.getBoundingClientRect().top, 0, runway);
    const c = cameraAt(s);
    const near = Math.round(c);

    for (let k = 0; k < count; k++) {
      const o = opacityOf(k, c);
      const lens = lenses[k];
      if (o < 0.01) {
        if (lens.style.visibility !== 'hidden') lens.style.visibility = 'hidden';
      } else {
        if (lens.style.visibility) lens.style.visibility = '';
        lens.style.opacity = o.toFixed(3);
        arts[k].style.transform = `scale(${scaleOf(k, c).toFixed(4)})`;
      }
      // The card shows only near its own scene
      const p = 1 - smooth(0.04, 0.28, Math.abs(c - k));
      const panel = panels[k];
      if (p < 0.01) {
        panel.setAttribute('data-hidden', '');
      } else {
        panel.removeAttribute('data-hidden');
        panel.style.opacity = p.toFixed(3);
      }
    }

    // Which scene the tools may be used in
    const active = Math.abs(c - near) < 0.02 ? near : -1;
    if (active !== lastActive) {
      secs.forEach((sec, k) => {
        sec.toggleAttribute('data-active', k === active);
        lenses[k].style.pointerEvents = k === active ? 'auto' : 'none';
      });
      if (lastActive >= 0) secs[lastActive].dispatchEvent(new CustomEvent('zactive', { detail: { on: false } }));
      if (active >= 0) secs[active].dispatchEvent(new CustomEvent('zactive', { detail: { on: true } }));
      lastActive = active;
      if (active >= 0) {
        current = active;
        settled = active;
        announce.textContent = fill(ui.sceneOf, { i: active + 1, n: count, title: titles[active] });
        if (moveFocus) {
          moveFocus = false;
          panels[active].querySelector<HTMLElement>('.zcard')?.focus({ preventScroll: true });
        }
      }
    }
    // A soft whoosh as soon as the lens starts to move
    if (active < 0 && Math.abs(c - settled) > 0.08 && settled !== -1) {
      sound.play('whoosh', 0.5);
      settled = -1;
    }
    root.classList.toggle('moving', c > 0.05);

    // The number at the top: how wide the picture is in real life, sliding between scenes
    const k0 = clamp(Math.floor(c), 0, count - 1);
    const k1 = Math.min(k0 + 1, count - 1);
    const f = c - k0;
    const fov = Math.exp(Math.log(sizes[k0]) + (Math.log(sizes[k1]) - Math.log(sizes[k0])) * f);
    const fovText = formatSize(fov, ui.decimal);
    if (fovText !== lastFov) {
      lastFov = fovText;
      fovEl.textContent = fovText;
    }
    // The scale bar: a round length that fills about a quarter of the lens
    const len = nice(fov * 0.26);
    const px = Math.max(8, (len / fov) * ld);
    bar.style.width = `${px.toFixed(0)}px`;
    const label = formatSize(len, ui.decimal);
    if (label !== lastBar) {
      lastBar = label;
      barLabel.textContent = label;
    }

    // The ring turns as you zoom, like the focus ring of a camera lens
    let l = 0;
    for (let k = 0; k < count - 1; k++) {
      l += Math.log(factor(k)) * clamp(c - k, 0, 1);
    }
    ring.style.transform = `rotate(${(l * 38).toFixed(1)}deg)`;

    if (near !== lastDot) {
      lastDot = near;
      dots.forEach((d, k) => {
        if (k === near) d.setAttribute('aria-current', 'step');
        else d.removeAttribute('aria-current');
        d.dataset.state = k < near ? 'seen' : 'new';
      });
    }
  }

  function schedule() {
    if (waiting || !film) return;
    waiting = true;
    requestAnimationFrame(update);
  }

  function goTo(scene: number, smoothly: boolean) {
    const target = clamp(scene, 0, count - 1);
    window.scrollTo({ top: top() + mids[target], behavior: smoothly ? 'smooth' : 'auto' });
  }

  dots.forEach((d, i) =>
    d.addEventListener('click', () => {
      sound.unlock();
      if (film) goTo(i, true);
      else secs[i].scrollIntoView({ behavior: 'auto', block: 'start' });
    }),
  );

  // On a phone only the first paragraph shows. "Read more" opens the rest.
  secs.forEach((sec) => {
    const more = sec.querySelector<HTMLButtonElement>('[data-more]');
    const card = sec.querySelector<HTMLElement>('.zcard');
    more?.addEventListener('click', () => {
      const open = card?.toggleAttribute('data-more');
      more.textContent = open ? ui.showLess : ui.readMore;
      more.setAttribute('aria-expanded', String(!!open));
    });
  });

  secs.forEach((sec, i) => {
    sec.querySelector('[data-next]')?.addEventListener('click', () => {
      sound.unlock();
      if (!film) {
        const next = secs[i + 1] ?? document.querySelector('.takeaways');
        next?.scrollIntoView({ behavior: 'auto', block: 'start' });
      } else if (i < count - 1) {
        moveFocus = true;
        goTo(i + 1, true);
      } else {
        window.scrollTo({ top: top() + runway + rig.offsetHeight + 40, behavior: 'smooth' });
      }
    });
  });

  function setPlainLabel() {
    const [short, long] = film ? ui.plain : ui.zoomView;
    plainButton.innerHTML = `${short}<span class="zp-more">${long}</span>`;
    plainButton.setAttribute('aria-pressed', String(!film && chosenPlain));
  }

  plainButton.addEventListener('click', () => {
    chosenPlain = !chosenPlain;
    try {
      localStorage.setItem('zoomView', chosenPlain ? 'plain' : 'zoom');
    } catch {
      // Not saving is fine.
    }
    sync();
    root.scrollIntoView({ behavior: 'auto', block: 'start' });
  });

  function announceMode() {
    secs.forEach((sec) => sec.dispatchEvent(new CustomEvent('zmode')));
  }

  function enable() {
    if (film) return;
    film = true;
    root.classList.add('film');
    measure();
    if (current > 0) goTo(current, false);
    update();
    announceMode();
    setPlainLabel();
  }

  function disable() {
    if (!film) return;
    film = false;
    root.classList.remove('film', 'moving');
    root.style.height = '';
    ['--lx', '--ly', '--ld', '--px', '--py', '--pw', '--ph'].forEach((v) => rig.style.removeProperty(v));
    secs.forEach((sec, k) => {
      sec.removeAttribute('data-active');
      lenses[k].removeAttribute('style');
      arts[k].removeAttribute('style');
      panels[k].removeAttribute('style');
      panels[k].removeAttribute('data-hidden');
    });
    root.querySelectorAll<HTMLElement>('.zcard').forEach((c) => c.style.removeProperty('--fit'));
    lastActive = -1;
    announceMode();
    setPlainLabel();
  }

  function sync() {
    root.classList.toggle('can-film', mq.matches);
    if (mq.matches && !chosenPlain) enable();
    else disable();
    setPlainLabel();
  }

  let size = `${window.innerWidth}x${window.innerHeight}`;
  const relayout = () => {
    if (!film) return;
    const next = `${window.innerWidth}x${window.innerHeight}`;
    const scene = current;
    measure();
    if (next !== size) {
      size = next;
      goTo(scene, false);
    }
    update();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', relayout);
  window.addEventListener('load', relayout);
  onMedia(mq, sync);
  onMedia(wide, relayout);
  void document.fonts?.ready.then(relayout);
  sync();
}

const root = document.querySelector<HTMLElement>('[data-zoom]');
if (root) {
  initZoom(root);
  initRoom(root);
  initBody(root);
  initTumour(root);
  initCell(root);
  initDna(root);
  initRays(root);
  initWeeks(root);
  initPerson(root);
  initSoundButton(root);
}
