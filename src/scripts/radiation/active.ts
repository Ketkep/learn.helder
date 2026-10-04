// Tells a tool when its scene is in front of the reader, so loops and animations can rest
// while it is not. In the zoom view the camera says so. In the plain view the scene is "active"
// whenever it is on screen.

import { watchVisible } from '../util';

export function whenActive(section: HTMLElement, callback: (on: boolean) => void) {
  const inZoom = () => !!section.closest('.zoom')?.classList.contains('film');
  let camera = false;
  let onScreen = false;
  const emit = () => callback(inZoom() ? camera : onScreen);
  section.addEventListener('zactive', (e) => {
    camera = (e as CustomEvent<{ on: boolean }>).detail.on;
    emit();
  });
  section.addEventListener('zmode', emit);
  watchVisible(section, (visible) => {
    onScreen = visible;
    emit();
  });
}
