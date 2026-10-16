// The file compression page: four things to try. This file starts each one.

import * as sound from '../sound';
import { clear, q } from '../util';
import { compare, counts, huffman, lz, lzBits, pixelBits, pixelRows, runBits, runs, samples, shown, textBits, token } from '../../lib/shrink';

const root = document.querySelector<HTMLElement>('[data-shrink]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Pack 1: runs
  const runsTool = root.querySelector<HTMLElement>('[data-runs-tool]');
  if (runsTool) {
    let row = pixelRows.stripes.slice();
    const box = q<HTMLElement>(runsTool, '[data-runs-cells]');
    const picks = runsTool.querySelectorAll<HTMLElement>('[data-runs-pick]');
    const status = q<HTMLElement>(runsTool, '[data-runs-status]');
    const word = (x: { value: number; count: number }) => `${x.count} ${x.value ? 'black' : 'white'}`;
    const draw = () => {
      clear(box);
      row.forEach((v, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = v ? 'cell on' : 'cell';
        b.setAttribute('aria-label', `Dot ${i + 1} is ${v ? 'black' : 'white'}. Click to change it.`);
        b.addEventListener('click', () => {
          row[i] = row[i] ? 0 : 1;
          press(picks, null);
          sound.play('tick', 0.3);
          draw();
        });
        box.appendChild(b);
      });
      const r = runs(row);
      const verdict = runBits(row) < pixelBits(row) ? 'That is shorter.' : 'That is longer than the plain row.';
      status.textContent = `The row has ${r.length} runs: ${r.slice(0, 6).map(word).join(', ')}${r.length > 6 ? `, and ${r.length - 6} more` : ''}. Plain it takes ${pixelBits(row)} bits. As runs it takes ${runBits(row)} bits. ${verdict}`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        row = pixelRows[b.getAttribute('data-runs-pick') || 'stripes'].slice();
        press(picks, b);
        draw();
      }),
    );
    draw();
  }

  // Pack 2: repeats
  const rep = root.querySelector<HTMLElement>('[data-repeats-tool]');
  if (rep) {
    const input = q<HTMLInputElement>(rep, '[data-repeats-q]');
    const picks = rep.querySelectorAll<HTMLElement>('[data-repeats-pick]');
    const draw = () => {
      const text = input.value;
      const t = lz(text);
      const chips = q(rep, '[data-repeats-chips]');
      chips.innerHTML = t.map((x) => `<span class="${x.literal !== undefined ? 'chip' : 'chip ptr'}">${token(x).replace('<', '&lt;').replace('>', '&gt;')}</span>`).join('');
      q(rep, '[data-repeats-status]').textContent = text
        ? `The text has ${text.length} letters, which is ${textBits(text)} bits. Written with pointers it has ${t.length} pieces and takes ${lzBits(t)} bits. A pointer shows how far back to go and how many letters to copy, and an underscore is a space.`
        : 'Type some text to compress.';
    };
    input.addEventListener('input', () => {
      press(picks, null);
      draw();
    });
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        input.value = b.getAttribute('data-repeats-pick') || '';
        press(picks, b);
        draw();
      }),
    );
    draw();
  }

  // Pack 3: short codes
  const codes = root.querySelector<HTMLElement>('[data-codes-tool]');
  if (codes) {
    const input = q<HTMLInputElement>(codes, '[data-codes-q]');
    const draw = () => {
      const text = input.value;
      const body = q(codes, '[data-codes-body]');
      const steps = q(codes, '[data-codes-steps]');
      if (!text) {
        clear(body);
        clear(steps);
        q(codes, '[data-codes-status]').textContent = 'Type some text to give it short codes.';
        return;
      }
      const h = huffman(text);
      body.innerHTML = h.codes.map((c) => `<tr><th scope="row">${shown(c.symbol)}</th><td>${c.count}</td><td class="mono">${c.code}</td></tr>`).join('');
      steps.innerHTML = h.steps.slice(0, 4).map((s) => `<li>${s}</li>`).join('');
      q(codes, '[data-codes-status]').textContent = `Plain the text takes ${textBits(text)} bits. With these codes the letters take ${h.bits} bit${h.bits === 1 ? '' : 's'}, and the table takes ${h.table} bits more, so ${h.bits + h.table} bits in all.`;
    };
    input.addEventListener('input', draw);
    draw();
  }

  // Pack 4: what cannot shrink
  const lim = root.querySelector<HTMLElement>('[data-limits-tool]');
  if (lim) {
    const picks = lim.querySelectorAll<HTMLElement>('[data-limits-pick]');
    const draw = (id: string) => {
      const s = samples.find((x) => x.id === id) || samples[0];
      const rows = compare(s.text);
      const max = Math.max(...rows.map((r) => r.bits));
      q(lim, '[data-limits-bars]').innerHTML = rows.map((r) => `<li><span class="nm">${r.method}</span><span class="track"><span class="fill" style="width:${Math.min(100, (r.bits / max) * 100)}%"></span></span></li>`).join('');
      q(lim, '[data-limits-body]').innerHTML = rows.map((r) => `<tr><th scope="row">${r.method}</th><td>${r.bits}</td><td>${Math.round((r.bits / rows[0].bits) * 100)} per cent</td></tr>`).join('');
      const best = rows.slice(1).reduce((a, b) => (b.bits < a.bits ? b : a));
      const c = counts(10);
      q(lim, '[data-limits-status]').textContent = `${s.name}: the plain text takes ${rows[0].bits} bits. ${best.bits < rows[0].bits ? `The best idea here is ${best.method.toLowerCase()}, at ${best.bits} bits.` : 'Every idea gives a result that is no smaller than the plain text.'} Counting messages: there are ${c.exact.toLocaleString('en-US')} messages of exactly 10 bits but only ${c.shorter.toLocaleString('en-US')} shorter ones, so they cannot all shrink.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        press(picks, b);
        draw(b.getAttribute('data-limits-pick') || '');
      }),
    );
  }
}
