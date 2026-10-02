// The lamp: pull the cord and the page switches between light and dark.
// You can drag the knob down, tap it, or press Enter or Space while it has focus.
// The choice is remembered in localStorage, and wins over the system setting from then on.

const root = document.documentElement;
const lamp = document.querySelector<HTMLElement>('[data-lamp]');
const button = lamp?.querySelector<HTMLButtonElement>('[data-lamp-button]');
const line = lamp?.querySelector<SVGLineElement>('[data-pull-line]');
const knob = lamp?.querySelector<SVGCircleElement>('[data-pull-knob]');
const art = lamp?.querySelector<SVGSVGElement>('.art');

const REST_LINE = 202; // where the cord ends at rest, in drawing units
const REST_KNOB = 208;
const MAX_PULL = 46; // how far the cord can be pulled
const PULL_TO_SWITCH = 22; // how far it must be pulled to switch

if (lamp && button && line && knob && art) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const systemDark = matchMedia('(prefers-color-scheme: dark)');

  const currentTheme = () => root.getAttribute('data-theme') ?? (systemDark.matches ? 'dark' : 'light');

  /** The lamp is on in the light theme. */
  const syncSwitch = () => button.setAttribute('aria-checked', String(currentTheme() === 'light'));

  const setTheme = (theme: 'light' | 'dark') => {
    root.classList.add('theme-fade');
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Storage can be blocked. The choice then lasts until the page is closed.
    }
    lamp.classList.add('pulled');
    syncSwitch();
    if (!reduced) {
      lamp.classList.remove('flicker');
      void lamp.getBoundingClientRect(); // restart the animation
      lamp.classList.add('flicker');
    }
    setTimeout(() => root.classList.remove('theme-fade'), 550);
    setTimeout(() => lamp.classList.remove('flicker'), 750);
  };

  const toggle = () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark');

  // ---------- The cord: it follows the pointer and springs back ----------

  let y = 0; // how far the cord is pulled, in drawing units
  let v = 0;
  let dragging = false;
  let raf = 0;
  let last = 0;

  const unitsToPixels = () => art.getBoundingClientRect().width / 200;

  const render = () => {
    line.setAttribute('y2', String(REST_LINE + y));
    knob.setAttribute('cy', String(REST_KNOB + y));
    button.style.transform = `translateY(${y * unitsToPixels()}px)`;
  };

  const step = (now: number) => {
    const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
    last = now;
    if (!dragging) {
      // A spring that pulls the cord back to rest and wobbles a little on the way
      v += (-190 * y - 11 * v) * dt;
      y += v * dt;
    }
    render();
    if (dragging || Math.abs(y) > 0.15 || Math.abs(v) > 0.15) {
      raf = requestAnimationFrame(step);
    } else {
      y = 0;
      v = 0;
      render();
      raf = 0;
    }
  };

  const kick = () => {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(step);
    }
  };

  // Drag
  let startY = 0;
  let startOffset = 0;
  let moved = false;
  let suppressClick = false;

  button.addEventListener('pointerdown', (event) => {
    button.setPointerCapture(event.pointerId);
    dragging = true;
    moved = false;
    startY = event.clientY;
    startOffset = y;
    v = 0;
    kick();
  });

  button.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dy = event.clientY - startY;
    if (Math.abs(dy) > 4) moved = true;
    y = Math.min(MAX_PULL, Math.max(0, startOffset + dy / unitsToPixels()));
  });

  const release = () => {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      suppressClick = true;
      if (y > PULL_TO_SWITCH) toggle();
    }
    kick();
  };
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);

  // Tap or keyboard: the cord gives a quick tug and the lamp switches
  button.addEventListener('click', () => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (!reduced) {
      v = 320;
      kick();
    }
    toggle();
  });

  // If the system theme changes while no choice has been made, keep the switch in step
  systemDark.addEventListener('change', syncSwitch);

  try {
    if (localStorage.getItem('theme')) lamp.classList.add('pulled');
  } catch {
    // Ignore: the hint just stays visible.
  }
  syncSwitch();
  render();
}

// The hand-drawn marks and the lamp only play on the first visit of a session
try {
  sessionStorage.setItem('seen', '1');
} catch {
  // Ignore: the intro will simply play again next time.
}
