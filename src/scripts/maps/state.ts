// The projection every panel uses. Picking one in any panel changes them all.

import { getProjection } from '../../lib/projections';

let current = 'mercator';
const listeners: (() => void)[] = [];

export const getId = () => current;
export const getName = () => getProjection(current).name;

export function setProjection(id: string) {
  if (id === current) return;
  current = id;
  for (const fn of listeners) fn();
}

export function watch(fn: () => void) {
  listeners.push(fn);
}
