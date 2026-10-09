// Reading 4: three bytes make a colour. The page's byte is the red.

import { fillRange, q } from '../util';
import { getByte, watch } from './byte';

const hex = (n: number) => n.toString(16).toUpperCase().padStart(2, '0');

export function initColour(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-colour-tool]');
  if (!tool) return;
  const g = q<HTMLInputElement>(tool, '[data-colour-g]');
  const b = q<HTMLInputElement>(tool, '[data-colour-b]');
  const gOut = q<HTMLOutputElement>(tool, '[data-colour-g-out]');
  const bOut = q<HTMLOutputElement>(tool, '[data-colour-b-out]');
  const swatch = q<HTMLElement>(tool, '[data-colour-swatch]');
  const code = q<HTMLElement>(tool, '[data-colour-code]');
  const status = q<HTMLElement>(tool, '[data-colour-status]');

  function draw() {
    const r = getByte();
    const gv = Number(g.value);
    const bv = Number(b.value);
    fillRange(g);
    fillRange(b);
    gOut.textContent = String(gv);
    bOut.textContent = String(bv);
    swatch.style.background = `rgb(${r}, ${gv}, ${bv})`;
    code.textContent = `#${hex(r)}${hex(gv)}${hex(bv)}`;
    const word = r === gv && gv === bv ? (r === 0 ? ' This is black: every light is off.' : r === 255 ? ' This is white: every light is full on.' : ' All three are equal, so it is a grey.') : '';
    status.textContent = `Red ${r}, green ${gv}, blue ${bv}. The code ${code.textContent} writes each byte as two characters from 00 to FF.${word}`;
  }
  watch(draw);
  g.addEventListener('input', draw);
  b.addEventListener('input', draw);
}
