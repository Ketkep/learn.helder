// Stop 1: where the water is. USGS shares (a rounded 1993 estimate), in three steps of looking closer.

import * as sound from '../sound';
import { clear, q } from '../util';
import { litres } from './air';
import { earthWater as w } from '../../data/water';

interface Part {
  label: string;
  value: number;
  cls: string;
  text: string;
}

export function initWhere(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-where-tool]');
  if (!tool) return;
  const stack = q<HTMLElement>(tool, '[data-where-stack]');
  const keys = q<HTMLElement>(tool, '[data-where-keys]');
  const title = q<HTMLElement>(tool, '[data-where-title]');
  const status = q<HTMLElement>(tool, '[data-where-status]');
  const buttons = [...tool.querySelectorAll<HTMLButtonElement>('[data-where-step]')];

  const steps: { title: string; aria: string; parts: Part[]; status: string; scaled?: boolean }[] = [
    {
      title: 'All the water on Earth',
      aria: 'A bar split into the sea, fresh water and other salty water.',
      parts: [
        { label: 'The sea', value: w.ocean, cls: 'sea', text: `${w.ocean}%` },
        { label: 'Fresh water', value: w.freshShare, cls: 'fresh', text: `about ${w.freshShare}%` },
        { label: 'Salty lakes and salty groundwater', value: 100 - w.ocean - w.freshShare, cls: 'other', text: 'about 1%' },
      ],
      status: 'About 96.5 per cent of all the water on Earth is in the sea. Only about 2.5 per cent is fresh water.',
    },
    {
      title: 'Only the fresh water',
      aria: 'A bar split into ice, groundwater and a very thin slice of everything else.',
      parts: [
        { label: 'Ice and permanent snow', value: w.ice, cls: 'ice', text: `${w.ice}%` },
        { label: 'Groundwater', value: w.groundwater, cls: 'ground', text: `${w.groundwater}%` },
        { label: 'Everything else: lakes, rivers, soil, air', value: 100 - w.ice - w.groundwater, cls: 'other', text: 'about 1.2%' },
      ],
      status: 'Of the fresh water, 68.7 per cent is frozen as ice and snow, and 30.1 per cent is underground. Only about 1.2 per cent is on the surface or in the air.',
    },
    {
      title: 'In one million litres of all the world’s water, we can see:',
      aria: 'Four short bars: lakes, the air, the soil and rivers, in litres out of a million.',
      scaled: true,
      parts: [
        { label: 'Fresh lakes', value: litres(w.freshLakes), cls: 'lake', text: `${litres(w.freshLakes)} litres` },
        { label: 'The air', value: litres(w.atmosphere), cls: 'air', text: `${litres(w.atmosphere)} litres` },
        { label: 'The soil', value: litres(w.soil), cls: 'soil', text: `${litres(w.soil)} litres` },
        { label: 'Rivers', value: litres(w.rivers), cls: 'river', text: `${litres(w.rivers)} litres` },
      ],
      status: 'If all the water on Earth were a million litres, the fresh lakes would hold 70 litres, the air 10 litres, the soil 10 litres and all the rivers about 2 litres. The sea would hold about 965,400 litres.',
    },
  ];

  function show(n: number) {
    const step = steps[n - 1];
    title.textContent = step.title;
    clear(stack);
    clear(keys);
    stack.setAttribute('aria-label', step.aria);
    stack.classList.toggle('scaled', !!step.scaled);
    const top = Math.max(...step.parts.map((p) => p.value));
    for (const p of step.parts) {
      const seg = document.createElement('span');
      seg.className = `seg ${p.cls}`;
      seg.style.flex = step.scaled ? `0 0 ${Math.max((p.value / top) * 100, 2)}%` : `${p.value} 0 0`;
      stack.appendChild(seg);
      const li = document.createElement('li');
      const dot = document.createElement('span');
      dot.className = `dot ${p.cls}`;
      li.appendChild(dot);
      li.appendChild(document.createTextNode(` ${p.label}: ${p.text}`));
      keys.appendChild(li);
    }
    status.textContent = step.status;
    buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === n - 1)));
  }

  for (const b of buttons) {
    b.addEventListener('click', () => {
      show(Number(b.dataset.whereStep));
      sound.play('pop');
    });
  }
}
