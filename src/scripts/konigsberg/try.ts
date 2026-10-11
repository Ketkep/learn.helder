// Try 1: walk the old town yourself.

import * as sound from '../sound';
import { q } from '../util';
import { type Land, byId, landNames, lands, oldIds, other } from '../../lib/konigsberg';
import { bridgeEl, bridgeName, landLabel, landTag, pressable, toggle } from './map';

export function initTry(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-try-tool]');
  if (!tool) return;
  const svg = q<SVGElement>(tool, '[data-town]');
  const status = q<HTMLElement>(tool, '[data-try-status]');
  let at: Land | null = null;
  let used: number[] = [];
  let tries = 0;

  const left = () => oldIds.filter((id) => !used.includes(id) && (byId(id).a === at || byId(id).b === at));

  function draw() {
    for (const id of oldIds) toggle(bridgeEl(svg, id), 'used', used.includes(id));
    for (const l of lands) toggle(landTag(svg, l), 'here', l === at);
  }

  function reset() {
    at = null;
    used = [];
    draw();
    status.textContent = 'Press a piece of land to start there. Then press a bridge next to you to cross it.';
  }

  function start(l: Land) {
    if (at !== null) return;
    at = l;
    tries++;
    draw();
    status.textContent = `You are on ${landNames[l]}. Press a bridge next to you to cross it.`;
    sound.play('tick', 0.3);
  }

  function cross(id: number) {
    if (at === null) {
      status.textContent = 'Press a piece of land first, to choose where to start.';
      return;
    }
    if (used.includes(id)) {
      status.textContent = `You already crossed bridge ${id}. Each bridge can be crossed only once.`;
      sound.play('thud', 0.3);
      return;
    }
    if (byId(id).a !== at && byId(id).b !== at) {
      status.textContent = `Bridge ${id} does not touch ${landNames[at]}. Choose one of the bridges next to you.`;
      sound.play('thud', 0.3);
      return;
    }
    at = other(id, at);
    used.push(id);
    draw();
    sound.play('tick', 0.5);
    if (used.length === oldIds.length) {
      status.textContent = 'You crossed all seven bridges. This should not be possible, so check the map.';
      sound.play('snap');
    } else if (left().length === 0) {
      status.textContent = `You are stuck on ${landNames[at]} after ${used.length} bridge${used.length === 1 ? '' : 's'}: every bridge next to you is used. Walks tried so far: ${tries}. Press Start again to try another way.`;
      sound.play('thud', 0.6);
    } else {
      status.textContent = `You crossed bridge ${id} and are on ${landNames[at]}. ${oldIds.length - used.length} bridge${oldIds.length - used.length === 1 ? '' : 's'} left to cross.`;
    }
  }

  for (const l of lands) {
    pressable(q(svg, `[data-land="${l}"]`), `${landLabel(l)}: start here`, () => start(l));
    pressable(landTag(svg, l), `${landLabel(l)}: start here`, () => start(l));
  }
  for (const id of oldIds) pressable(bridgeEl(svg, id), bridgeName(id), () => cross(id));
  q(tool, '[data-try-reset]').addEventListener('click', reset);
  draw();
}
