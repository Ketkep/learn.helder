// Helpers for the town map drawn in every panel.

import { type Land, byId, landNames } from '../../lib/konigsberg';
import { q } from '../util';

/** Makes an SVG shape work like a button: reachable with the keyboard, with a name, and Enter or Space press it. */
export function pressable(el: Element, label: string, fn: () => void) {
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', label);
  el.addEventListener('click', fn);
  el.addEventListener('keydown', (e) => {
    const key = (e as KeyboardEvent).key;
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      fn();
    }
  });
}

export const bridgeEl = (svg: Element, id: number) => q<SVGElement>(svg, `[data-bridge="${id}"]`);
export const landTag = (svg: Element, l: Land) => q<SVGElement>(svg, `[data-land-tag="${l}"]`);

export const bridgeName = (id: number) => `Bridge ${id}, between ${byId(id).a} and ${byId(id).b}`;
export const landLabel = (l: Land) => `Land ${l}, ${landNames[l]}`;

export const toggle = (el: Element, cls: string, on: boolean) => el.classList.toggle(cls, on);
