// The Dutch page: the camera. The page is one wide set of stops. Scrolling down slides the set
// sideways past a pinned screen, and the coin rolls along the film strip underneath.
// Each stop has a short pause (a "dwell") where the set stands still, so you can use its toy.
// If the screen is too short, or the reader asked for less motion, none of this runs and the
// page stays a plain stack.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clamp, onMedia, q } from '../util';
import { initWind } from './wind';
import { initExchange } from './exchange';
import { initVoyage } from './voyage';
import { initTulip } from './tulip';
import { initStudio } from './studio';
import { initFlip } from './flip';
import { initEnd } from './end';

interface Stop {
  /** The element the camera centers on: a whole stop on a wide screen, one panel on a phone. */
  el: HTMLElement;
  station: number;
  /** Camera position (how far the set has slid to the left, in pixels). */
  x: number;
  /** How much scrolling the camera waits here. */
  dwell: number;
  /** The scroll position in the middle of the wait. */
  mid: number;
}

interface Segment {
  s0: number;
  s1: number;
  x0: number;
  x1: number;
  st0: number;
  st1: number;
}

interface Marker {
  x: number;
  year: string;
  title: string;
  station: number;
}

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const ease = (t: number) => t * 0.4 + t * t * (3 - 2 * t) * 0.6;
const mod = (a: number, b: number) => ((a % b) + b) % b;

function initRoll(root: HTMLElement) {
  const rig = q<HTMLElement>(root, '[data-rig]');
  const world = q<HTMLElement>(root, '[data-world]');
  const far = q<HTMLElement>(root, '[data-far]');
  const mid = q<HTMLElement>(root, '[data-mid]');
  const holes = q<HTMLElement>(root, '[data-holes]');
  const spin = q<HTMLElement>(root, '[data-spin]');
  const yearEl = q<HTMLElement>(root, '[data-year]');
  const titleEl = q<HTMLElement>(root, '[data-title]');
  const stations = [...root.querySelectorAll<HTMLElement>('[data-station]')];
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-jump]')];
  let skies: number[][] = [];
  let layerAmount: number[] = [];
  /** Reads the sky color and the strength of the background from each stop (the coin stop changes them). */
  const readLooks = () => {
    skies = stations.map((s) => rgb(s.dataset.sky ?? '#bcd6ec'));
    layerAmount = stations.map((s) => Number(s.dataset.layers ?? 1));
  };
  readLooks();

  // Wide screens need a little more height than phones, because the picture and the text sit side by side
  const calm = '(prefers-reduced-motion: no-preference)';
  const mq = matchMedia(`(min-width: 48rem) and (min-height: 40rem) and ${calm}, (max-width: 47.99rem) and (min-height: 34rem) and ${calm}`);
  const wide = matchMedia('(min-width: 60rem)');

  let film = false;
  let stops: Stop[] = [];
  let segments: Segment[] = [];
  let markers: Marker[] = [];
  let runway = 0;
  let vw = 0;
  let farTile = 1;
  let midTile = 1;
  let radius = 30;
  let waiting = false;
  let lastMarker = -1;
  let lastStation = -1;
  let lastStop = -1;
  /** The stop the camera last rested at, by station, so a resize or a turned phone can come back to it. */
  let currentStation = 0;

  /** Where the top of the whole film is, measured from the top of the page. */
  const top = () => root.getBoundingClientRect().top + window.scrollY;

  /** A card whose text is too tall for its place gets smaller text, down to a limit. */
  function fitCards() {
    root.querySelectorAll<HTMLElement>('.card').forEach((card) => {
      let k = 1;
      card.style.setProperty('--fit', '1');
      while (card.scrollHeight > card.clientHeight + 1 && k > 0.82) {
        k -= 0.03;
        card.style.setProperty('--fit', k.toFixed(2));
      }
    });
  }

  function measure() {
    root.style.setProperty('--vw', `${rig.clientWidth}px`);
    world.style.transform = 'none';
    fitCards();
    vw = rig.clientWidth;
    const vh = rig.clientHeight;
    const origin = world.getBoundingClientRect().left;
    const maxX = Math.max(0, world.scrollWidth - vw);
    const phone = !wide.matches;

    // The stops: one per stop on a wide screen, one per panel on a phone
    stops = [];
    stations.forEach((st, i) => {
      const targets = [...st.querySelectorAll<HTMLElement>(phone ? '[data-panel]' : '.stop')];
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        const x = clamp(r.left - origin + r.width / 2 - vw / 2, 0, maxX);
        const isStory = phone && el.classList.contains('story');
        stops.push({ el, station: i, x, dwell: (isStory ? 0.5 : 0.75) * vh, mid: 0 });
      });
    });
    stops[0].dwell = 0.4 * vh;
    stops[stops.length - 1].dwell = 0.7 * vh;

    // The timeline: wait, slide, wait, slide...
    segments = [];
    let s = 0;
    stops.forEach((stop, i) => {
      stop.mid = s + stop.dwell / 2;
      segments.push({ s0: s, s1: s + stop.dwell, x0: stop.x, x1: stop.x, st0: stop.station, st1: stop.station });
      s += stop.dwell;
      const next = stops[i + 1];
      if (next) {
        const len = Math.max(Math.abs(next.x - stop.x), 0.55 * vh);
        segments.push({ s0: s, s1: s + len, x0: stop.x, x1: next.x, st0: stop.station, st1: next.station });
        s += len;
      }
    });
    runway = s;
    root.style.height = `${runway + rig.offsetHeight}px`;

    // Things the bar can name while the camera is over them
    markers = [];
    root.querySelectorAll<HTMLElement>('[data-panel], .sign').forEach((el) => {
      const r = el.getBoundingClientRect();
      const owner = el.closest<HTMLElement>('[data-station]');
      const station = owner ? stations.indexOf(owner) : -1;
      const isSign = el.classList.contains('sign');
      const prev = isSign ? stations.indexOf(el.closest('[data-passage]')?.previousElementSibling as HTMLElement) : station;
      markers.push({
        x: r.left - origin + r.width / 2,
        year: isSign ? (el.dataset.year ?? '') : (owner?.dataset.year ?? ''),
        title: isSign ? 'Meanwhile' : (owner?.dataset.title ?? ''),
        station: prev,
      });
    });

    farTile = far.clientHeight * Number(far.dataset.aspect);
    midTile = mid.clientHeight * Number(mid.dataset.aspect);
    far.style.width = `${vw + farTile}px`;
    mid.style.width = `${vw + midTile}px`;
    holes.style.width = `${vw + 44}px`;
    radius = (spin.clientWidth || 60) / 2;
    lastMarker = -1;
    lastStation = -1;
  }

  /** Camera position and (blended) stop number for a scroll position. */
  function at(s: number) {
    let seg = segments[0];
    for (const g of segments) {
      seg = g;
      if (s <= g.s1) break;
    }
    const len = seg.s1 - seg.s0;
    const t = len > 0 ? clamp((s - seg.s0) / len, 0, 1) : 0;
    const e = seg.x0 === seg.x1 ? 0 : ease(t);
    return { x: seg.x0 + (seg.x1 - seg.x0) * e, st: seg.st0 + (seg.st1 - seg.st0) * e };
  }

  function update() {
    waiting = false;
    if (!film) return;
    const s = clamp(-root.getBoundingClientRect().top, 0, runway);
    const { x, st } = at(s);

    world.style.transform = `translate3d(${-x}px,0,0)`;
    far.style.transform = `translate3d(${-mod(x * 0.12, farTile)}px,0,0)`;
    mid.style.transform = `translate3d(${-mod(x * 0.4, midTile)}px,0,0)`;
    holes.style.transform = `translate3d(${-mod(x, 44)}px,0,0)`;
    spin.style.transform = `rotate(${(x / radius) * 57.2958}deg)`;
    root.classList.toggle('moving', x > 40);

    // The sky blends from stop to stop
    const i = clamp(Math.floor(st), 0, stations.length - 1);
    const j = Math.min(i + 1, stations.length - 1);
    const f = st - i;
    const c = [0, 1, 2].map((k) => Math.round(skies[i][k] + (skies[j][k] - skies[i][k]) * f));
    rig.style.backgroundColor = `rgb(${c[0]} ${c[1]} ${c[2]})`;
    const layers = layerAmount[i] + (layerAmount[j] - layerAmount[i]) * f;
    far.style.opacity = String(layers);
    mid.style.opacity = String(layers);

    // The year in the bar: whatever is in the middle of the screen
    const centre = x + vw / 2;
    let best = 0;
    for (let k = 1; k < markers.length; k++) {
      if (Math.abs(markers[k].x - centre) < Math.abs(markers[best].x - centre)) best = k;
    }
    if (best !== lastMarker && markers[best]) {
      lastMarker = best;
      yearEl.textContent = markers[best].year;
      titleEl.textContent = markers[best].title;
    }

    const now = Math.round(st);
    if (now !== lastStation) {
      lastStation = now;
      dots.forEach((d, k) => {
        if (k === now) d.setAttribute('aria-current', 'step');
        else d.removeAttribute('aria-current');
        d.dataset.state = k < now ? 'seen' : 'new';
      });
    }

    // A small chime each time the camera comes to rest at a stop
    let near = -1;
    stops.forEach((stop, k) => {
      if (Math.abs(stop.x - x) < 3) near = k;
    });
    if (near !== lastStop) {
      if (near >= 0 && lastStop !== -1) sound.play('clink');
      lastStop = near;
    }
    if (near >= 0) currentStation = stops[near].station;
  }

  function schedule() {
    if (waiting || !film) return;
    waiting = true;
    requestAnimationFrame(update);
  }

  /** Scrolls the page so the camera rests at a stop. */
  function goTo(stopIndex: number, smooth: boolean) {
    const stop = stops[stopIndex];
    if (!stop) return;
    window.scrollTo({ top: top() + stop.mid, behavior: smooth ? 'smooth' : 'auto' });
  }

  function firstStopOf(station: number) {
    return stops.findIndex((s) => s.station === station);
  }

  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      if (!film) return;
      sound.unlock();
      goTo(firstStopOf(i), true);
    });
  });

  // Tab can reach a control that is off to the side. Bring its stop to the middle first.
  world.addEventListener('focusin', (e) => {
    if (!film) return;
    rig.scrollLeft = 0;
    const target = e.target as HTMLElement;
    const index = stops.findIndex((s) => s.el.contains(target));
    if (index >= 0 && Math.abs(stops[index].x - at(clamp(-root.getBoundingClientRect().top, 0, runway)).x) > 4) {
      goTo(index, false);
    }
  });
  rig.addEventListener('scroll', () => {
    rig.scrollLeft = 0;
  });

  function enable() {
    if (film) return;
    film = true;
    root.classList.add('film');
    measure();
    if (currentStation > 0) goTo(firstStopOf(currentStation), false);
    update();
  }

  function disable() {
    if (!film) return;
    film = false;
    root.classList.remove('film', 'moving');
    root.style.height = '';
    root.style.removeProperty('--vw');
    root.querySelectorAll<HTMLElement>('.card').forEach((c) => c.style.removeProperty('--fit'));
    for (const el of [world, far, mid, holes, spin]) {
      el.style.transform = '';
      el.style.width = '';
    }
    far.style.opacity = '';
    mid.style.opacity = '';
    rig.style.backgroundColor = '';
  }

  function sync() {
    if (mq.matches) enable();
    else disable();
  }

  let size = `${window.innerWidth}x${window.innerHeight}`;
  const relayout = () => {
    if (!film) return;
    const next = `${window.innerWidth}x${window.innerHeight}`;
    const station = currentStation;
    measure();
    // A turned phone or a resized window: stay at the same stop
    if (next !== size) {
      size = next;
      goTo(firstStopOf(station), false);
    }
    update();
  };

  world.addEventListener('skychange', () => {
    readLooks();
    schedule();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', relayout);
  window.addEventListener('load', relayout);
  onMedia(mq, sync);
  onMedia(wide, relayout);
  void document.fonts?.ready.then(relayout);
  sync();
}

const root = document.querySelector<HTMLElement>('[data-roll]');
if (root) {
  initRoll(root);
  initWind(root);
  initExchange(root);
  initVoyage(root);
  initTulip(root);
  initStudio(root);
  initFlip(root);
  initEnd(root);
  initSoundButton(root);
}
