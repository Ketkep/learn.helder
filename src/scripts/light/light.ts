// The Light page: a beam at the top and four panels that send it. This file starts each panel and the sound switch.

import { initSoundButton } from '../soundButton';
import { initBeam } from './beam';
import { initMoon } from './moon';
import { initLadder } from './ladder';
import { initTalk } from './talk';
import { initYear } from './year';

const root = document.querySelector<HTMLElement>('[data-light]');

if (root) {
  initBeam(root);
  initMoon(root);
  initLadder(root);
  initTalk(root);
  initYear(root);
  initSoundButton(root);
}
