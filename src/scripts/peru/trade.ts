// Shot 5: cotton goes to the coast, fish comes to the valley. Switch each on and off.

import * as sound from '../sound';
import { q } from './util';

const TEXT = {
  both: 'Cotton goes to the coast and fish comes back. Nets catch fish, and fish feeds the valley. A big town can grow.',
  noCotton: 'No cotton means no nets. The fishers catch far less, and there is little to send back to the valley.',
  noFish: 'No fish arrives. The valley has fewer people to feed, so there are fewer hands to build with.',
  none: 'No trade at all. Two small groups, side by side. No city.',
};

export function initTrade(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-trade-tool]');
  if (!tool) return;
  const status = q<HTMLElement>(root, '[data-trade-status]');
  const switches = [...root.querySelectorAll<HTMLButtonElement>('[data-trade-switch]')];

  const update = () => {
    const cotton = tool.dataset.cotton === 'on';
    const fish = tool.dataset.fish === 'on';
    status.textContent = cotton && fish ? TEXT.both : !cotton && fish ? TEXT.noCotton : cotton && !fish ? TEXT.noFish : TEXT.none;
  };

  for (const s of switches) {
    s.addEventListener('click', () => {
      const key = s.dataset.tradeSwitch as 'cotton' | 'fish';
      const next = tool.dataset[key] === 'on' ? 'off' : 'on';
      tool.dataset[key] = next;
      s.setAttribute('aria-checked', String(next === 'on'));
      sound.play(next === 'on' ? 'good' : 'thud', 0.8);
      update();
    });
  }
}
