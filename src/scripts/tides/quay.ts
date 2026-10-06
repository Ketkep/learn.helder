// The Tides page: a harbour wall with a tide staff. This file runs the staff and starts each tool.
// A tool reports how high its water stands. The staff shows the report of the bench you are looking at.

import { initSoundButton } from '../soundButton';
import { clamp, q } from '../util';
import { initBulges } from './bulges';
import { initClock } from './clock';
import { initSpring } from './spring';
import { initBasin } from './basin';

export interface StaffState {
  /** Where the water stands, 0 (bottom of the staff) to 1 (top). */
  level: number;
  /** Optional: the size of the tide, 0 to 1, drawn as a band around the middle. */
  range?: number;
  text: string;
}

export interface Staff {
  set(bench: string, state: StaffState): void;
  /** Looks again at which bench is on screen. */
  refresh(): void;
}

const REST: StaffState = { level: 0.5, text: 'Mid tide' };

function startStaff(root: HTMLElement): Staff {
  const staff = q<HTMLElement>(root, '[data-staff]');
  const text = q<HTMLElement>(staff, '[data-staff-text]');
  const benches = [...root.querySelectorAll<HTMLElement>('[data-bench-id]')];
  const reports = new Map<string, StaffState>();
  let active = '';

  const show = () => {
    const s = reports.get(active) ?? REST;
    const range = s.range ?? 0;
    staff.style.setProperty('--lvl', String(clamp(s.level, 0, 1)));
    staff.style.setProperty('--lo', String(clamp(0.5 - range / 2, 0, 1)));
    staff.style.setProperty('--hi', String(clamp(0.5 + range / 2, 0, 1)));
    staff.classList.toggle('has-band', s.range !== undefined);
    text.textContent = s.text;
  };

  // The active bench is the one on the middle line of the screen
  let waiting = false;
  const update = () => {
    waiting = false;
    const line = window.innerHeight * 0.5;
    let now = active;
    for (const b of benches) {
      const r = b.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) now = b.dataset.benchId ?? '';
    }
    if (now !== active) {
      active = now;
      show();
    }
  };
  const onScroll = () => {
    if (waiting) return;
    waiting = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  return {
    set(bench, state) {
      reports.set(bench, state);
      if (bench === active) show();
    },
    refresh: update,
  };
}

const root = document.querySelector<HTMLElement>('[data-quay]');

if (root) {
  const staff = startStaff(root);
  initBulges(root, staff);
  initClock(root, staff);
  initSpring(root, staff);
  initBasin(root, staff);
  initSoundButton(root);
  staff.refresh();
}
