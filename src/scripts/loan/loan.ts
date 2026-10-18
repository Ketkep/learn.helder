// The loan page: five lines. This file starts each one.

import { fillRange, q } from '../util';
import { crossover, EXAMPLE, eur, fmtMonths, linearSchedule, payment, schedule, splitSvg, totalInterest, totalPaid, twoSvg } from '../../lib/loan';

const root = document.querySelector<HTMLElement>('[data-loan]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Line 1: the payment
  const pay = root.querySelector<HTMLElement>('[data-pay-tool]');
  if (pay) {
    const [a, r, y] = ['a', 'r', 'y'].map((k) => q<HTMLInputElement>(pay, `[data-pay-${k}]`));
    const draw = () => {
      [a, r, y].forEach(fillRange);
      const [amount, rate, years] = [Number(a.value), Number(r.value), Number(y.value)];
      q(pay, '[data-pay-a-out]').textContent = eur(amount);
      q(pay, '[data-pay-r-out]').textContent = `${rate}%`;
      q(pay, '[data-pay-y-out]').textContent = String(years);
      const p = payment(amount, rate, years);
      const s = schedule(amount, rate, years);
      q(pay, '[data-pay-big]').textContent = `${eur(p)} a month`;
      q(pay, '[data-pay-status]').textContent = `A loan of ${eur(amount)} at ${rate} per cent a year over ${years} year${years === 1 ? '' : 's'} has a payment of ${eur(p)} a month. In all you pay back ${eur(totalPaid(s))}, of which ${eur(totalInterest(s))} is interest.`;
    };
    [a, r, y].forEach((el) => el.addEventListener('input', draw));
    draw();
  }

  // Line 2: where each payment goes
  const split = root.querySelector<HTMLElement>('[data-split-tool]');
  if (split) {
    const s = schedule(EXAMPLE.amount, EXAMPLE.rate, EXAMPLE.years);
    const range = q<HTMLInputElement>(split, '[data-split-range]');
    const draw = () => {
      fillRange(range);
      const m = Number(range.value);
      const row = s[m - 1];
      q(split, '[data-split-out]').textContent = String(m);
      q(split, '[data-split-g]').innerHTML = splitSvg(s, m);
      q(split, '[data-split-status]').textContent = `Month ${m}: of a payment of ${eur(row.paid)}, ${eur(row.interest)} is interest and ${eur(row.principal)} repays the loan. ${eur(row.balance)} is still owed. From month ${crossover(s)} on, more of each payment repays the loan than pays interest.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Line 3: a longer term
  const term = root.querySelector<HTMLElement>('[data-term-tool]');
  if (term) {
    const picks = term.querySelectorAll<HTMLElement>('[data-term-pick]');
    const maxI = totalInterest(schedule(EXAMPLE.amount, EXAMPLE.rate, 30));
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const y = Number(b.getAttribute('data-term-pick'));
        press(picks, b);
        const p = payment(EXAMPLE.amount, EXAMPLE.rate, y);
        const i = totalInterest(schedule(EXAMPLE.amount, EXAMPLE.rate, y));
        q<HTMLElement>(term, '[data-term-bar]').style.width = `${(i / maxI) * 100}%`;
        q(term, '[data-term-status]').textContent = `Over ${y} years a loan of ${eur(EXAMPLE.amount)} at ${EXAMPLE.rate} per cent has a payment of ${eur(p)} a month and costs ${eur(i)} in interest.`;
      }),
    );
  }

  // Line 4: a little extra
  const extra = root.querySelector<HTMLElement>('[data-extra-tool]');
  if (extra) {
    const range = q<HTMLInputElement>(extra, '[data-extra-range]');
    const base = schedule(EXAMPLE.amount, EXAMPLE.rate, EXAMPLE.years);
    const draw = () => {
      fillRange(range);
      const e = Number(range.value);
      q(extra, '[data-extra-out]').textContent = eur(e);
      const s = schedule(EXAMPLE.amount, EXAMPLE.rate, EXAMPLE.years, e);
      q(extra, '[data-extra-status]').textContent = e
        ? `With ${eur(e)} extra a month, the loan takes ${fmtMonths(s.length)} instead of ${fmtMonths(base.length)} and costs ${eur(totalInterest(s))} in interest. That saves ${eur(totalInterest(base) - totalInterest(s))}.`
        : `With no extra, the loan of ${eur(EXAMPLE.amount)} at ${EXAMPLE.rate} per cent takes ${fmtMonths(base.length)} and costs ${eur(totalInterest(base))} in interest. Slide the extra amount to see what changes.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Line 5: level or falling
  const two = root.querySelector<HTMLElement>('[data-two-tool]');
  if (two) {
    const [a, r, y] = ['a', 'r', 'y'].map((k) => q<HTMLInputElement>(two, `[data-two-${k}]`));
    const draw = () => {
      [a, r, y].forEach(fillRange);
      const [amount, rate, years] = [Number(a.value), Number(r.value), Number(y.value)];
      q(two, '[data-two-a-out]').textContent = eur(amount);
      q(two, '[data-two-r-out]').textContent = `${rate}%`;
      q(two, '[data-two-y-out]').textContent = String(years);
      const level = schedule(amount, rate, years);
      const fall = linearSchedule(amount, rate, years);
      q(two, '[data-two-g]').innerHTML = twoSvg(level, fall);
      q(two, '[data-two-head]').textContent = `Loan of ${eur(amount)}, ${rate}%, ${years} years`;
      q(two, '[data-two-body]').innerHTML = `<tr><th scope="row">First payment</th><td>${eur(level[0].paid)}</td><td>${eur(fall[0].paid)}</td></tr><tr><th scope="row">Last payment</th><td>${eur(level[level.length - 1].paid)}</td><td>${eur(fall[fall.length - 1].paid)}</td></tr><tr><th scope="row">Total interest</th><td>${eur(totalInterest(level))}</td><td>${eur(totalInterest(fall))}</td></tr>`;
      q(two, '[data-two-status]').textContent = rate === 0 ? 'With no interest, both ways pay back the same amount every month.' : `The level payment is the same every month. The falling payment starts higher, ends lower and costs ${eur(totalInterest(level) - totalInterest(fall))} less interest in all.`;
    };
    [a, r, y].forEach((el) => el.addEventListener('input', draw));
    draw();
  }
}
