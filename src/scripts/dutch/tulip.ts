// Stop 5: tulips. A switch between the legend and the records, and a price slider that
// counts the price in years of a craftsman's pay (300 guilders a year).

import * as sound from '../sound';
import { fillRange, group, q } from '../util';

export function initTulip(root: HTMLElement) {
  const station = root.querySelector<HTMLElement>('[data-station="tulip"]');
  if (!station) return;

  // ---- legend or records
  const compare = q<HTMLElement>(station, '[data-tl-compare]');
  const modes = [...compare.querySelectorAll<HTMLButtonElement>('[data-tl-mode]')];
  const views = [...compare.querySelectorAll<HTMLElement>('[data-tl-view]')];
  compare.classList.add('on');

  const show = (mode: string) => {
    modes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tlMode === mode)));
    views.forEach((v) => {
      v.hidden = v.dataset.tlView !== mode;
    });
  };
  modes.forEach((b) =>
    b.addEventListener('click', () => {
      show(b.dataset.tlMode ?? 'legend');
      sound.play('pop');
    }),
  );
  show('legend');

  // ---- the price
  const stage = q<HTMLElement>(station, '[data-tl]');
  const slider = q<HTMLInputElement>(station, '[data-tl-slider]');
  const tag = q<SVGTextElement>(station, '[data-tl-tag]');
  const status = q<HTMLElement>(station, '[data-tl-status]');
  const coins = [...station.querySelectorAll<SVGCircleElement>('.tl-coin')];
  const presets = [...station.querySelectorAll<HTMLButtonElement>('[data-tl-preset]')];
  const wage = Number(stage.dataset.wage);
  const record = Number(stage.dataset.record);
  const asking = Number(stage.dataset.asking);
  let lastWhole = -1;

  function render() {
    const price = Number(slider.value);
    const years = price / wage;
    fillRange(slider);
    tag.textContent = group(price);
    coins.forEach((c, i) => {
      c.style.opacity = String(0.14 + 0.86 * Math.min(1, Math.max(0, years - i)));
    });
    presets.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.tlPreset) === price)));

    let note = '';
    if (price === wage) note = ' That is a craftsman\'s pay for one year.';
    else if (price === record) note = ' The highest price found in the old records.';
    else if (price === asking) note = ' The asking price named for the rarest bulb. That figure may be hearsay.';
    const text = years < 0.05 ? 'a few days' : `${years.toFixed(1).replace(/\.0$/, '')} ${years === 1 ? 'year' : 'years'}`;
    status.innerHTML = `<strong>${group(price)} guilders</strong> is about <strong>${text}</strong> of a craftsman's pay.${note}`;

    const whole = Math.floor(years);
    if (whole !== lastWhole && lastWhole !== -1) sound.play('clink');
    lastWhole = whole;
  }

  slider.addEventListener('input', render);
  presets.forEach((b) =>
    b.addEventListener('click', () => {
      slider.value = b.dataset.tlPreset ?? '0';
      render();
    }),
  );
  render();
}
