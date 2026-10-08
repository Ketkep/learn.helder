// The Chance page: a lab notebook with four experiments. This file starts each one and the sound switch.

import { initSoundButton } from '../soundButton';
import { initDice } from './dice';
import { initCoins } from './coins';
import { initBirthday } from './birthday';
import { initDoors } from './doors';

const root = document.querySelector<HTMLElement>('[data-chance]');

if (root) {
  initDice(root);
  initCoins(root);
  initBirthday(root);
  initDoors(root);
  initSoundButton(root);
}
