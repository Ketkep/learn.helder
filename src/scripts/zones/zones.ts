// The time zone page: four maps. This file starts each one.

import { fillRange, q } from '../util';
import { arrive, cities, clockAheadMin, dayShift, dayWord, fmtClock, fmtOffset, subsolarLon, trips, worldSvg } from '../../lib/zones';

const root = document.querySelector<HTMLElement>('[data-zones]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Map 1: move the Sun
  const sun = root.querySelector<HTMLElement>('[data-sun-tool]');
  if (sun) {
    const range = q<HTMLInputElement>(sun, '[data-sun-range]');
    const draw = () => {
      fillRange(range);
      const h = Number(range.value);
      q(sun, '[data-sun-out]').textContent = fmtClock(h);
      q(sun, '[data-sun-g]').innerHTML = worldSvg(h);
      const lon = subsolarLon(h);
      q(sun, '[data-sun-status]').textContent = `At ${fmtClock(h)} at Greenwich the Sun is highest at longitude ${Math.abs(Math.round(lon))} degrees ${lon >= 0 ? 'east' : 'west'}, so it is noon there. The pale band is where it is day.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Map 2: eight clocks
  const clocks = root.querySelector<HTMLElement>('[data-clocks-tool]');
  if (clocks) {
    const range = q<HTMLInputElement>(clocks, '[data-clocks-range]');
    const ams = cities[0];
    const draw = () => {
      fillRange(range);
      const h = Number(range.value);
      q(clocks, '[data-clocks-out]').textContent = fmtClock(h);
      q(clocks, '[data-clocks-body]').innerHTML = cities
        .map((c) => {
          const t = h - ams.off + c.off;
          return `<tr><th scope="row">${c.name}</th><td>${fmtOffset(c.off)}</td><td>${fmtClock(t)}${dayShift(t) !== 0 ? `, ${dayWord(dayShift(t))}` : ''}</td></tr>`;
        })
        .join('');
      q(clocks, '[data-clocks-status]').textContent = `When it is ${fmtClock(h)} in Amsterdam, it is ${fmtClock(h - ams.off + cities[4].off)} in Tokyo and ${fmtClock(h - ams.off + cities[2].off)} in New York, in winter time.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Map 3: the clock against the Sun
  const drift = root.querySelector<HTMLElement>('[data-drift-tool]');
  if (drift) {
    const btn = q<HTMLElement>(drift, '[data-drift-summer]');
    let summer = false;
    const draw = () => {
      q(drift, '[data-drift-bars]').innerHTML = cities
        .map((c) => {
          const m = clockAheadMin(c, summer);
          return `<li><span class="nm">${c.name}</span><span class="track"><span class="${m >= 0 ? 'fill ahead' : 'fill behind'}" style="width:${Math.max(1, (Math.abs(m) / 120) * 100)}%"></span></span><span class="val">${m >= 0 ? '+' : '-'}${Math.abs(m)} min</span></li>`;
        })
        .join('');
      q(drift, '[data-drift-status]').textContent = `${summer ? 'Summer time in Europe and the US.' : 'Winter time.'} A plus means the clock is ahead of the Sun, a minus that it is behind. Amsterdam is ${clockAheadMin(cities[0], summer)} minutes ahead.`;
    };
    btn.addEventListener('click', () => {
      summer = !summer;
      btn.setAttribute('aria-pressed', summer ? 'true' : 'false');
      draw();
    });
  }

  // Map 4: flying across zones
  const fly = root.querySelector<HTMLElement>('[data-fly-tool]');
  if (fly) {
    const picks = fly.querySelectorAll<HTMLElement>('[data-fly-pick]');
    const leave = q<HTMLInputElement>(fly, '[data-fly-leave]');
    const hours = q<HTMLInputElement>(fly, '[data-fly-hours]');
    let trip = trips[1];
    const draw = () => {
      fillRange(leave);
      fillRange(hours);
      const [l, f] = [Number(leave.value), Number(hours.value)];
      q(fly, '[data-fly-leave-out]').textContent = fmtClock(l);
      q(fly, '[data-fly-hours-out]').textContent = `${f} hours`;
      const r = arrive(trip, l, f, false);
      const earlier = r.shift === 0 && r.local % 24 < l;
      q(fly, '[data-fly-status]').textContent = `${trip.label}: you leave at ${fmtClock(l)} and fly ${f} hours. The clock at the other end reads ${r.clock}, ${dayWord(r.shift)}. The two clocks differ by ${Math.abs(r.diff)} hours.${earlier ? ' That is earlier on the clock than when you left.' : ''}`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        trip = trips.find((t) => t.id === b.getAttribute('data-fly-pick')) || trip;
        press(picks, b);
        draw();
      }),
    );
    leave.addEventListener('input', draw);
    hours.addEventListener('input', draw);
    draw();
  }
}
