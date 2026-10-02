// The hero animation: a ruler that is a mess until the knob rolls over it.
//
// One number drives everything: how far the knob has travelled (0 to 1).
// Behind the knob things are tidy: the sticks line up into a ruler, the title
// letters spring into place and sharpen. Ahead of the knob it is still a mess.
// The same number is the value of an invisible range input on top of the ruler,
// so the mouse, touch and keyboard all work like a normal slider.

const KNOB = 15; // knob radius in px
const INTRO_MS = 2600; // how long the knob takes to roll across on the first visit
const WAKE_TICKS = 0.16; // how far behind the knob the ticks finish tidying (0 to 1)
const WAKE_LETTERS = 0.2;

interface Tick {
  u: number; // position along the ruler, 0 to 1
  height: number;
  // where the tick lies when it is a mess
  cx: number;
  cy: number;
  angle: number;
  length: number;
  phase: number;
}

interface Debris {
  x: number;
  y: number;
  length: number;
  angle: number;
  u: number;
  phase: number;
}

interface Letter {
  el: HTMLElement;
  u: number;
  dx: number;
  dy: number;
  rot: number;
  blur: number;
}

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Eases to 1 with a small overshoot, so things snap into place with a little spring. */
const easeOutBack = (t: number, c = 1.4) => 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);

/** A small seeded random generator, so the mess looks the same on every visit. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** How tidy something at position u is (0 = mess, 1 = tidy) when the knob is at p. */
const tidiness = (u: number, p: number, wake: number) => clamp((p * (1 + wake) - u) / wake);

function start(
  hero: HTMLElement,
  ruler: HTMLElement,
  canvas: HTMLCanvasElement,
  input: HTMLInputElement,
  readout: HTMLElement | null,
  title: HTMLElement,
  plain: HTMLElement,
  layer: HTMLElement,
  ctx: CanvasRenderingContext2D,
) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0;
  let H = 0;
  let base = 0;
  let ticks: Tick[] = [];
  let debris: Debris[] = [];
  let letters: Letter[] = [];
  let ink = '#121315';
  let soft = '#595c61';
  let accent = '#e4501a';

  let p = 1; // where the knob is now
  let target = 1; // where it is heading
  let introPlaying = false;
  let introStart = 0;
  let popUntil = 0;
  let lastInteraction = performance.now();
  let hoverX: number | null = null;
  let speed = 0;
  let last = 0;
  let raf = 0;
  let shownPercent = -1;

  const readColors = () => {
    const style = getComputedStyle(ruler);
    ink = style.getPropertyValue('--ink').trim() || ink;
    soft = style.getPropertyValue('--ink-soft').trim() || soft;
    accent = style.getPropertyValue('--accent').trim() || accent;
  };

  // ---------- Layout: build the ticks, the loose sticks and the title letters ----------

  const measureLetters = () => {
    layer.textContent = '';
    letters = [];
    const box = title.getBoundingClientRect();
    const rulerBox = ruler.getBoundingClientRect();
    const span = Math.max(1, W - 2 * KNOB);
    const rand = seeded(5);
    const range = document.createRange();
    const walker = document.createTreeWalker(plain, NodeFilter.SHOW_TEXT);

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent ?? '';
      for (let i = 0; i < text.length; i++) {
        if (text[i].trim() === '') continue;
        // Ask the browser where this exact letter sits, so the moving copy lands exactly on the real text
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        const el = document.createElement('span');
        el.className = 'ltr';
        el.textContent = text[i];
        el.style.cssText = `left:${r.left - box.left}px;top:${r.top - box.top}px;width:${r.width}px;height:${r.height}px;line-height:${r.height}px;`;
        layer.append(el);
        const centre = r.left + r.width / 2 - rulerBox.left;
        letters.push({
          el,
          u: clamp((centre - KNOB) / span),
          dx: (rand() - 0.5) * 130,
          dy: (rand() - 0.5) * 100,
          rot: (rand() - 0.5) * 80,
          blur: 5 + rand() * 7,
        });
      }
    }
  };

  const layout = () => {
    const box = canvas.getBoundingClientRect();
    W = box.width;
    H = box.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    base = H - KNOB - 8;

    const span = W - 2 * KNOB;
    const gap = W < 560 ? 13 : 16;
    const count = Math.max(8, Math.round(span / gap) + 1);
    const rand = seeded(11);

    ticks = Array.from({ length: count }, (_, i) => {
      const height = i % 10 === 0 || i === count - 1 ? 38 : i % 5 === 0 ? 26 : 16;
      const u = i / (count - 1);
      return {
        u,
        height,
        cx: KNOB + u * span + (rand() - 0.5) * 130,
        cy: 8 + rand() * (H - 16),
        angle: -Math.PI / 2 + (rand() - 0.5) * 2.4,
        length: height * (0.9 + rand() * 1.5),
        phase: rand() * 6.28,
      };
    });

    debris = Array.from({ length: Math.round(W / 20) }, () => {
      const x = rand() * W;
      return {
        x,
        y: rand() * H,
        length: 8 + rand() * 26,
        angle: rand() * Math.PI,
        u: clamp((x - KNOB) / span),
        phase: rand() * 6.28,
      };
    });

    measureLetters();
  };

  // ---------- Drawing ----------

  const stick = (cx: number, cy: number, angle: number, length: number) => {
    const dx = Math.cos(angle) * length * 0.5;
    const dy = Math.sin(angle) * length * 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - dx, cy - dy);
    ctx.lineTo(cx + dx, cy + dy);
    ctx.stroke();
  };

  const draw = (now: number) => {
    ctx.clearRect(0, 0, W, H);
    const span = W - 2 * KNOB;
    const knobX = KNOB + p * span;
    const wobbling = !reduced && now - lastInteraction < 6000;
    const t = now / 1000;

    ctx.lineCap = 'round';

    // The baseline: solid where the knob has been, dotted where it has not
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = ink;
    ctx.beginPath();
    ctx.moveTo(KNOB, base);
    ctx.lineTo(knobX, base);
    ctx.stroke();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = soft;
    ctx.lineWidth = 3;
    ctx.setLineDash([0.5, 9]);
    ctx.beginPath();
    ctx.moveTo(knobX, base);
    ctx.lineTo(W - KNOB, base);
    ctx.stroke();
    ctx.setLineDash([]);

    // Loose sticks: they disappear as the knob tidies them away
    ctx.lineWidth = 2;
    ctx.strokeStyle = soft;
    for (const d of debris) {
      const o = tidiness(d.u, p, WAKE_TICKS);
      if (o >= 1) continue;
      const wob = wobbling ? Math.sin(t * 1.6 + d.phase) : 0;
      ctx.globalAlpha = 0.6 * (1 - o);
      stick(d.x + wob * 3, d.y + Math.cos(t * 1.3 + d.phase) * (wobbling ? 3 : 0), d.angle + wob * 0.15, d.length * (1 - 0.5 * o));
    }

    // The ticks: loose sticks that snap upright into a ruler
    ctx.lineWidth = 2.5;
    for (const tick of ticks) {
      const o = tidiness(tick.u, p, WAKE_TICKS);
      const e = easeOutBack(o);
      const finalX = KNOB + tick.u * span;

      // The ticks around the knob (or the pointer) stand a little taller, like icons in a dock.
      // The ticks right under the knob are pressed flat, so the knob sits on the line like a bead.
      const nearKnob = Math.pow(Math.max(0, 1 - Math.abs(finalX - knobX) / 80), 2);
      const nearHover = hoverX === null ? 0 : Math.pow(Math.max(0, 1 - Math.abs(finalX - hoverX) / 80), 2) * 0.7;
      const pressed = clamp(1 - Math.abs(finalX - knobX) / (KNOB + 3));
      const height = (tick.height + Math.max(nearKnob, nearHover) * 14 * o) * (1 - 0.9 * pressed * o);

      const wob = wobbling ? (1 - o) * Math.sin(t * 1.8 + tick.phase) : 0;
      const cx = lerp(tick.cx + wob * 4, finalX, e);
      const cy = lerp(tick.cy + wob * 3, base - height / 2 - 2, e);
      const angle = lerp(tick.angle + wob * 0.2, -Math.PI / 2, e);
      const length = lerp(tick.length, height, e);

      ctx.globalAlpha = lerp(0.5, 1, o);
      ctx.strokeStyle = o > 0.5 ? ink : soft;
      stick(cx, cy, angle, length);
    }
    ctx.globalAlpha = 1;

    // The knob: it rolls (the notch turns), stretches when it moves fast, and pops when it arrives
    const stretch = Math.min(0.28, speed * 0.2);
    const sincePop = popUntil - now;
    const pop = sincePop > 0 ? 1 + 0.3 * Math.exp(-(700 - sincePop) / 170) * Math.cos((700 - sincePop) / 55) : 1;
    ctx.save();
    ctx.translate(knobX, base);
    ctx.scale((1 + stretch) * pop, (1 / (1 + stretch)) * pop);
    ctx.rotate(knobX / KNOB);
    ctx.beginPath();
    ctx.arc(0, 0, KNOB, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(KNOB * 0.5, 0, 2.6, 0, Math.PI * 2);
    ctx.fillStyle = ink;
    ctx.fill();
    ctx.restore();
  };

  const updateLetters = () => {
    for (const l of letters) {
      const o = tidiness(l.u, p, WAKE_LETTERS);
      if (o >= 1) {
        l.el.style.transform = '';
        l.el.style.filter = '';
        l.el.style.opacity = '';
        continue;
      }
      const e = easeOutBack(o);
      l.el.style.transform = `translate(${l.dx * (1 - e)}px, ${l.dy * (1 - e)}px) rotate(${l.rot * (1 - e)}deg)`;
      l.el.style.filter = `blur(${((1 - o) * l.blur).toFixed(2)}px)`;
      l.el.style.opacity = String(0.45 + 0.55 * o);
    }
  };

  const updateReadout = () => {
    const percent = Math.round(p * 100);
    if (percent === shownPercent) return;
    shownPercent = percent;
    input.value = String(percent);
    input.setAttribute('aria-valuetext', `${percent} percent clear`);
    if (readout) readout.textContent = `${percent}% clear`;
  };

  /** While the knob is not at the end, the moving letters are shown instead of the plain title. */
  const showMovingLetters = (on: boolean) => {
    hero.classList.toggle('is-animating', on);
    if (on) document.documentElement.classList.remove('intro');
  };

  // ---------- The loop ----------

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    const before = p;

    if (introPlaying) {
      const k = clamp((now - introStart) / INTRO_MS);
      p = easeInOut(k);
      target = p;
      if (k >= 1) {
        introPlaying = false;
        target = 1;
        p = 1;
        popUntil = now + 700;
      }
    } else if (reduced) {
      p = target;
    } else {
      p += (target - p) * (1 - Math.exp(-dt * 16));
      if (Math.abs(target - p) < 0.0004) p = target;
    }

    speed = Math.abs(p - before) / dt;
    updateReadout();
    updateLetters();
    showMovingLetters(introPlaying || p < 0.9995);
    draw(now);

    const wobbling = !reduced && now - lastInteraction < 6000 && p < 1;
    if (introPlaying || p !== target || popUntil > now || wobbling) kick();
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  // ---------- Input ----------

  input.addEventListener('input', () => {
    introPlaying = false;
    target = Number(input.value) / 100;
    lastInteraction = performance.now();
    kick();
  });

  // The ticks near the pointer stand a little taller, like icons in a dock
  ruler.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    hoverX = event.clientX - ruler.getBoundingClientRect().left;
    kick();
  });
  ruler.addEventListener('pointerleave', () => {
    hoverX = null;
    kick();
  });

  new ResizeObserver(() => {
    if (!W) return;
    layout();
    kick();
  }).observe(ruler);

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    readColors();
    kick();
  });

  // ---------- Go ----------

  const begin = () => {
    readColors();
    layout();

    let playIntro = document.documentElement.classList.contains('intro');
    if (playIntro) {
      try {
        sessionStorage.setItem('hero-played', '1');
      } catch {
        // Storage can be blocked. The intro then just plays again next time.
      }
    }
    if (reduced) playIntro = false;

    if (playIntro) {
      p = 0;
      target = 0;
      introPlaying = true;
      introStart = performance.now() + 350; // a short pause on the mess first
      lastInteraction = performance.now();
    }
    updateReadout();
    updateLetters();
    showMovingLetters(playIntro);
    draw(performance.now());
    kick();
  };

  // Wait for the fonts, so the letters are measured in their final place
  Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1500))]).then(begin);
}

const hero = document.querySelector<HTMLElement>('[data-hero]');
const ruler = hero?.querySelector<HTMLElement>('[data-ruler]');
const canvas = ruler?.querySelector('canvas');
const input = ruler?.querySelector('input');
const title = hero?.querySelector<HTMLElement>('[data-title]');
const plain = title?.querySelector<HTMLElement>('.plain');
const layer = title?.querySelector<HTMLElement>('.letters');
const ctx = canvas?.getContext('2d');

if (hero && ruler && canvas && input && title && plain && layer && ctx) {
  start(hero, ruler, canvas, input, hero.querySelector<HTMLElement>('[data-ruler-value]'), title, plain, layer, ctx);
}
