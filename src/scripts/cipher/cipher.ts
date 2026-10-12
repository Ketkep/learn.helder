// The Cipher page: four tries. This file starts each one and the sound switch.

import { initSoundButton } from '../soundButton';
import { initWheel } from './wheel';
import { initBreak } from './break';
import { initKeys } from './keys';
import { initKeyword } from './keyword';

const root = document.querySelector<HTMLElement>('[data-cipher]');

if (root) {
  initWheel(root);
  initBreak(root);
  initKeys(root);
  initKeyword(root);
  initSoundButton(root);
}
