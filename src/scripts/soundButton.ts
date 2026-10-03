// The sound switch on the topic pages: on by default, with a button to turn it off.
// Browsers keep sound locked until the first tap or key press, so this also unlocks it then.

import * as sound from './sound';

export function initSoundButton(root: ParentNode) {
  const button = root.querySelector<HTMLButtonElement>('[data-sound]');
  const label = root.querySelector<HTMLElement>('[data-sound-label]');

  const refresh = () => {
    const on = sound.isSoundOn();
    button?.setAttribute('aria-pressed', String(on));
    if (label) label.textContent = on ? 'Sound on' : 'Sound off';
  };
  refresh();

  button?.addEventListener('click', () => {
    sound.unlock();
    sound.setSoundOn(!sound.isSoundOn());
    refresh();
    sound.play('pop');
  });

  const unlockOnce = () => {
    sound.unlock();
    document.removeEventListener('pointerdown', unlockOnce, true);
    document.removeEventListener('keydown', unlockOnce, true);
  };
  document.addEventListener('pointerdown', unlockOnce, true);
  document.addEventListener('keydown', unlockOnce, true);
}
