// Reading 2: the byte as a letter in the ASCII table (codes 0 to 127).

import * as sound from '../sound';
import { q } from '../util';
import { bits, getByte, setByte, watch } from './byte';

/** A short name for a code in the ASCII table. */
function name(v: number) {
  if (v > 127) return 'Outside the table';
  if (v === 32) return 'A space';
  if (v === 127) return 'The delete code';
  if (v < 32) return 'A control code';
  if (v >= 65 && v <= 90) return `Capital ${String.fromCharCode(v)}`;
  if (v >= 97 && v <= 122) return `Small ${String.fromCharCode(v)}`;
  if (v >= 48 && v <= 57) return `The digit ${String.fromCharCode(v)}`;
  return `The sign ${String.fromCharCode(v)}`;
}

export function initLetter(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-letter-tool]');
  if (!tool) return;
  const glyph = q<HTMLElement>(tool, '[data-letter-glyph]');
  const nameEl = q<HTMLElement>(tool, '[data-letter-name]');
  const code = q<HTMLElement>(tool, '[data-letter-code]');
  const status = q<HTMLElement>(tool, '[data-letter-status]');
  const input = q<HTMLInputElement>(tool, '[data-letter-input]');

  watch(() => {
    const v = getByte();
    const printable = v >= 33 && v <= 126;
    glyph.textContent = printable ? String.fromCharCode(v) : v === 32 ? '␣' : '?';
    nameEl.textContent = name(v);
    code.textContent = `${v} = ${bits(v)}`;
    if (document.activeElement !== input) input.value = printable || v === 32 ? String.fromCharCode(v) : '';
    const isLetter = (v >= 65 && v <= 90) || (v >= 97 && v <= 122);
    status.textContent =
      v > 127
        ? `The byte ${v} is outside the ASCII table, which stops at 127. The top switch is always off for ASCII.`
        : v < 32 || v === 127
          ? `The byte ${v} is a control code. It is not a letter: it was made for machines such as printers.`
          : `The byte ${v} is ${name(v).toLowerCase()} in the ASCII table.${isLetter ? ' Flip the switch worth 32 and the case changes.' : ''}`;
  });

  input.addEventListener('input', () => {
    const c = input.value.charCodeAt(0);
    if (!Number.isNaN(c) && c <= 127) setByte(c);
  });
  q<HTMLButtonElement>(tool, '[data-letter-case]').addEventListener('click', () => {
    setByte(getByte() ^ 32);
    sound.play('snap');
  });
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-letter-step]')) {
    b.addEventListener('click', () => {
      setByte(getByte() + Number(b.dataset.letterStep));
      sound.play('tick');
    });
  }
}
