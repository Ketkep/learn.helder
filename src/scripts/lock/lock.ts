// The Lock page: four benches. This file starts each one.

import { initSoundButton } from '../soundButton';
import { initWood } from './wood';
import { initInsert } from './insert';
import { initCut } from './cut';
import { initCount } from './count';

const root = document.querySelector<HTMLElement>('[data-lock]');

if (root) {
  initWood(root);
  initInsert(root);
  initCut(root);
  initCount(root);
  initSoundButton(root);
}
