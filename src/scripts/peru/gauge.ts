// The gauge: as you scroll down the dig, it shows the year you have reached.
// Each shot says which years it starts and ends at, and the gauge slides between them.

import { clamp, formatYear } from './util';

export function initGauge(root: HTMLElement) {
  const year = root.querySelector<HTMLElement>('[data-year]');
  const era = root.querySelector<HTMLElement>('[data-era]');
  if (!year || !era) return;

  const marks = [...root.querySelectorAll<HTMLElement>('[data-shot]')].map((el) => ({
    el,
    from: Number(el.dataset.from),
    to: Number(el.dataset.to),
    era: el.dataset.era ?? '',
  }));

  let waiting = false;

  const update = () => {
    waiting = false;
    const vh = window.innerHeight;
    const line = vh * 0.5;
    const box = root.getBoundingClientRect();
    if (box.bottom < 0 || box.top > vh) return;

    let current = marks[0];
    let t = 0;
    for (const m of marks) {
      const r = m.el.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) {
        current = m;
        t = (line - r.top) / r.height;
        break;
      }
      if (r.bottom <= line) {
        current = m;
        t = 1;
      }
    }

    const y = current.from + (current.to - current.from) * t;
    year.textContent = formatYear(y);
    era.textContent = current.era;
    root.style.setProperty('--prog', String(clamp((line - box.top) / box.height, 0, 1)));
  };

  const onScroll = () => {
    if (waiting) return;
    waiting = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
