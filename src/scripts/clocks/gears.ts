// Plate 3: the gear train. Second hand : minute hand = 60 : 1. Minute hand : hour hand = 12 : 1.

import * as sound from '../sound';
import { fillRange, q } from '../util';

const clock2 = (n: number) => String(n).padStart(2, '0');

export function initGears(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-gears-tool]');
  if (!tool) return;
  const cx = Number(tool.dataset.cx);
  const cy = Number(tool.dataset.cy);
  const range = q<HTMLInputElement>(tool, '[data-gears-range]');
  const out = q<HTMLOutputElement>(tool, '[data-gears-out]');
  const timeEl = q<HTMLElement>(tool, '[data-gears-time]');
  const noteEl = q<HTMLElement>(tool, '[data-gears-note]');
  const status = q<HTMLElement>(tool, '[data-gears-status]');
  const hour = q<SVGLineElement>(tool, '[data-gears-hour]');
  const minute = q<SVGLineElement>(tool, '[data-gears-minute]');
  const second = q<SVGLineElement>(tool, '[data-gears-second]');
  let lastMinute = -1;

  const place = (line: SVGLineElement, deg: number, length: number, tail = 0) => {
    const a = (deg * Math.PI) / 180;
    line.setAttribute('x1', (cx - tail * Math.sin(a)).toFixed(1));
    line.setAttribute('y1', (cy + tail * Math.cos(a)).toFixed(1));
    line.setAttribute('x2', (cx + length * Math.sin(a)).toFixed(1));
    line.setAttribute('y2', (cy - length * Math.cos(a)).toFixed(1));
  };

  function update(quiet = false) {
    const s = Number(range.value); // seconds since twelve o'clock
    fillRange(range);
    const turnsSecond = s / 60;
    const turnsMinute = s / 3600;
    const turnsHour = s / 43200;
    place(second, (turnsSecond % 1) * 360, 140, 24);
    place(minute, (turnsMinute % 1) * 360, 125);
    place(hour, (turnsHour % 1) * 360, 80);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const shown = `${h === 0 ? 12 : h}:${clock2(m)}`;
    timeEl.textContent = shown;
    noteEl.textContent = sec ? `and ${sec} seconds` : `after ${h} hour${h === 1 ? '' : 's'} ${m} minute${m === 1 ? '' : 's'}`;
    out.textContent = `${h} h ${clock2(m)} min`;
    const turns = (n: number) => {
      const v = Math.abs(n - Math.round(n)) < 0.005 ? String(Math.round(n)) : n.toFixed(1);
      return `${v} ${v === '1' ? 'turn' : 'turns'}`;
    };
    const unit = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
    status.textContent = `${unit(h, 'hour')} ${unit(m, 'minute')}${sec ? ` ${unit(sec, 'second')}` : ''} after twelve. The second hand has made ${turns(turnsSecond)}, the minute hand ${turns(turnsMinute)} and the hour hand ${turns(turnsHour)}. The second hand makes 60 turns for every turn of the minute hand, and the minute hand 12 turns for every turn of the hour hand.`;
    if (!quiet && m !== lastMinute) sound.play('tick');
    lastMinute = m;
  }

  range.addEventListener('input', () => update());
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-gears-jump]')) {
    b.addEventListener('click', () => {
      range.value = b.dataset.gearsJump!;
      update(true);
      sound.play('pop');
    });
  }
  update(true);
}
