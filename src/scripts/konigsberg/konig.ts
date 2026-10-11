// The Königsberg page: one river town and four panels. This file starts each panel and the sound switch.

import { initSoundButton } from '../soundButton';
import { initTry } from './try';
import { initCount } from './count';
import { initBuild } from './build';
import { initRoute } from './route';

const root = document.querySelector<HTMLElement>('[data-konig]');

if (root) {
  initTry(root);
  initCount(root);
  initBuild(root);
  initRoute(root);
  initSoundButton(root);
}
