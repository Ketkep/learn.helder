// Scene 2: the beams. Pick X-rays or protons, set the angle of the last beam, add more beams, and
// watch the dose map and the three numbers. All beams use the same kind, so you can switch and
// compare the same angles.

import * as sound from '../sound';
import { clamp, fillRange, q } from '../util';
import { colour, computeDose, GRID, SPAN, type Kind } from './dose';
import { fill, pick, readUi } from './ui';

const MAX_BEAMS = 6;
/** Picture units for one centimetre: the picture is 800 wide and shows 48 cm. */
const UNIT = 800 / SPAN;

export function initBody(root: HTMLElement) {
  const ui = readUi(root).body;
  const sec = root.querySelector<HTMLElement>('[data-scene="body"]');
  if (!sec) return;
  const canvas = q<HTMLCanvasElement>(sec, '[data-dose]');
  const beamsG = q<SVGGElement>(sec, '[data-beams]');
  const angleInput = q<HTMLInputElement>(sec, '[data-angle]');
  const angleOut = q<HTMLOutputElement>(sec, '[data-angle-out]');
  const energyRow = q<HTMLElement>(sec, '[data-energy-row]');
  const energyInput = q<HTMLInputElement>(sec, '[data-energy]');
  const energyOut = q<HTMLOutputElement>(sec, '[data-energy-out]');
  const addButton = q<HTMLButtonElement>(sec, '[data-add]');
  const resetButton = q<HTMLButtonElement>(sec, '[data-reset]');
  const kindButtons = [...sec.querySelectorAll<HTMLButtonElement>('[data-kind]')];
  const status = q<HTMLElement>(sec, '[data-bd-status]');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const image = ctx.createImageData(GRID, GRID);

  let angles = [0];
  let kind: Kind = 'photon';
  let shift = 0;

  const text = (name: string) => q<HTMLElement>(sec, `[data-v="${name}"]`);
  const bar = (name: string) => q<HTMLElement>(sec, `[data-bar="${name}"]`);

  /** The picture of the beams: two dashed edges and a machine head for each one. */
  function drawBeams() {
    const R = 350;
    const half = 3 * UNIT;
    let svg = '';
    angles.forEach((angle, i) => {
      const a = (angle * Math.PI) / 180;
      const hx = 400 + R * Math.sin(a);
      const hy = 400 - R * Math.cos(a);
      const dx = -Math.sin(a);
      const dy = Math.cos(a);
      const nx = Math.cos(a);
      const ny = Math.sin(a);
      const last = i === angles.length - 1;
      const stroke = last ? '#ff9a55' : '#ffffff';
      for (const side of [-1, 1]) {
        const sx = hx + nx * half * side;
        const sy = hy + ny * half * side;
        svg += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)}L${(sx + dx * 720).toFixed(1)} ${(sy + dy * 720).toFixed(1)}" stroke="${stroke}" stroke-width="2.5" stroke-dasharray="8 8" opacity="${last ? 0.95 : 0.5}" fill="none"/>`;
      }
      svg +=
        `<g transform="translate(${hx.toFixed(1)} ${hy.toFixed(1)}) rotate(${angle})">` +
        `<rect x="-30" y="-26" width="60" height="32" rx="9" fill="${last ? '#ffd9bf' : '#cfdcd9'}" stroke="#0e1b1d" stroke-width="3.5"/>` +
        `<rect x="-11" y="6" width="22" height="12" rx="4" fill="#9fb3b0" stroke="#0e1b1d" stroke-width="3"/></g>`;
    });
    beamsG.innerHTML = svg;
  }

  function message(r: ReturnType<typeof computeDose>) {
    const n = angles.length;
    if (kind === 'proton') {
      if (Math.abs(shift) >= 1) return fill(ui.missed, { n: Math.round(r.tumour) });
      return n === 1 ? ui.protonOne : ui.protonMany;
    }
    if (n === 1) return fill(ui.photonOne, { n: Math.round(r.hot) });
    return ui.photonMany;
  }

  function render() {
    const r = computeDose(angles, kind, shift);

    // The colour map on the canvas
    const data = image.data;
    for (let i = 0; i < GRID * GRID; i++) {
      const [R, G, B, A] = colour(r.dose[i]);
      data[i * 4] = R;
      data[i * 4 + 1] = G;
      data[i * 4 + 2] = B;
      data[i * 4 + 3] = A;
    }
    ctx!.putImageData(image, 0, 0);
    drawBeams();

    const t = Math.round(r.tumour);
    const h = Math.round(r.hot);
    const e = Math.round(r.exposed);
    text('tumour').textContent = `${t}%`;
    text('hot').textContent = `${h}%`;
    text('exposed').textContent = `${e}%`;
    bar('tumour').style.width = `${clamp(t / 1.5, 0, 100)}%`;
    bar('hot').style.width = `${clamp(h / 2, 0, 100)}%`;
    bar('exposed').style.width = `${clamp(e, 0, 100)}%`;
    bar('hot').classList.toggle('hot', h > 100);
    bar('tumour').classList.toggle('hot', t < 90);

    const last = angles[angles.length - 1];
    angleInput.value = String(last);
    fillRange(angleInput);
    angleOut.textContent = fill(pick(last, ui.degrees), { n: last });
    fillRange(energyInput);
    energyOut.textContent = shift === 0 ? ui.matched : `${shift > 0 ? '+' : ''}${shift} cm`;
    energyRow.hidden = kind !== 'proton';
    addButton.disabled = angles.length >= MAX_BEAMS;
    status.innerHTML = message(r);
  }

  kindButtons.forEach((b) =>
    b.addEventListener('click', () => {
      kind = (b.dataset.kind as Kind) ?? 'photon';
      kindButtons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      shift = 0;
      energyInput.value = '0';
      sound.play('pop');
      render();
    }),
  );
  angleInput.addEventListener('input', () => {
    angles[angles.length - 1] = Number(angleInput.value);
    render();
  });
  energyInput.addEventListener('input', () => {
    shift = Number(energyInput.value);
    render();
  });
  addButton.addEventListener('click', () => {
    if (angles.length >= MAX_BEAMS) return;
    angles.push((angles[angles.length - 1] + (angles.length === 1 ? 120 : 360 / (angles.length + 1) + 60)) % 360 | 0);
    sound.play('beam');
    render();
  });
  resetButton.addEventListener('click', () => {
    angles = [0];
    shift = 0;
    energyInput.value = '0';
    sound.play('pop');
    render();
  });

  render();
}
