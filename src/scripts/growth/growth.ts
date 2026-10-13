// The Growth page: four panels on ledger paper. This file starts each one.

import { fillRange, q } from '../util';
import { chartSvg, compound, compoundN, doubleExact, fmt, realFactor, rule72, simple, years } from '../../lib/growth';

const root = document.querySelector<HTMLElement>('[data-growth]');

function slider(tool: HTMLElement, name: string, show: (v: number) => string) {
  const el = q<HTMLInputElement>(tool, `[data-${name}]`);
  const out = q(tool, `[data-${name}-out]`);
  const read = () => {
    fillRange(el);
    out.textContent = show(Number(el.value));
    return Number(el.value);
  };
  return { el, read };
}

if (root) {
  const pct = (v: number) => `${v} per cent`;

  const simpleTool = root.querySelector<HTMLElement>('[data-simple-tool]');
  if (simpleTool) {
    const r = slider(simpleTool, 'simple-r', pct);
    const t = slider(simpleTool, 'simple-t', String);
    const g = q(simpleTool, '[data-simple-g]');
    const status = q<HTMLElement>(simpleTool, '[data-simple-status]');
    const draw = () => {
      const [rate, n] = [r.read() / 100, t.read()];
      const ys = years(n);
      g.innerHTML = chartSvg([{ name: 'Simple', cls: 'line a', values: ys.map((y) => simple(100, rate, y)) }, { name: 'Compound', cls: 'line b', values: ys.map((y) => compound(100, rate, y)) }], n);
      status.textContent = `100 coins at ${Math.round(rate * 100)} per cent for ${n} years: simple growth gives ${fmt(simple(100, rate, n))} coins and compound growth gives ${fmt(compound(100, rate, n))} coins, which is ${fmt(compound(100, rate, n) - simple(100, rate, n))} more.`;
    };
    r.el.addEventListener('input', draw);
    t.el.addEventListener('input', draw);
    draw();
  }

  const ruleTool = root.querySelector<HTMLElement>('[data-rule-tool]');
  if (ruleTool) {
    const r = slider(ruleTool, 'rule', pct);
    const status = q<HTMLElement>(ruleTool, '[data-rule-status]');
    const draw = () => {
      const rate = r.read();
      const [a, b] = [rule72(rate), doubleExact(rate / 100)];
      const err = ((a - b) / b) * 100;
      status.textContent = `At ${rate} per cent a year the rule of 72 says ${a.toFixed(1)} years, and the exact time is ${b.toFixed(2)} years. The rule is ${Math.abs(err) < 0.6 ? 'almost exactly right' : err > 0 ? `${err.toFixed(1)} per cent too long` : `${(-err).toFixed(1)} per cent too short`} here.`;
    };
    r.el.addEventListener('input', draw);
    draw();
  }

  const inflTool = root.querySelector<HTMLElement>('[data-inflation-tool]');
  if (inflTool) {
    const r = slider(inflTool, 'inflation-r', pct);
    const p = slider(inflTool, 'inflation-p', pct);
    const g = q(inflTool, '[data-inflation-g]');
    const status = q<HTMLElement>(inflTool, '[data-inflation-status]');
    const n = 30;
    const draw = () => {
      const [rate, infl] = [r.read() / 100, p.read() / 100];
      const ys = years(n);
      g.innerHTML = chartSvg([{ name: 'Coins', cls: 'line b', values: ys.map((y) => compound(100, rate, y)) }, { name: 'What they buy', cls: 'line a', values: ys.map((y) => 100 * realFactor(rate, infl, y)) }], n);
      const real = 100 * realFactor(rate, infl, n);
      status.textContent = `After ${n} years 100 coins have grown to ${fmt(compound(100, rate, n))} coins. With prices rising ${Math.round(infl * 100)} per cent a year, those coins buy what ${fmt(real)} coins buy today.${real < 100 ? ' That is less than at the start.' : ''}`;
    };
    r.el.addEventListener('input', draw);
    p.el.addEventListener('input', draw);
    draw();
  }

  const oftenTool = root.querySelector<HTMLElement>('[data-often-tool]');
  if (oftenTool) {
    const r = slider(oftenTool, 'often-r', pct);
    const t = slider(oftenTool, 'often-t', String);
    const rows = q(oftenTool, '[data-often-rows]');
    const status = q<HTMLElement>(oftenTool, '[data-often-status]');
    const kinds = [{ name: 'Once a year', n: 1 }, { name: 'Four times a year', n: 4 }, { name: 'Every month', n: 12 }, { name: 'Every day', n: 365 }, { name: 'All the time', n: 0 }];
    const draw = () => {
      const [rate, n] = [r.read() / 100, t.read()];
      rows.innerHTML = kinds.map((k) => `<tr><th scope="row">${k.name}</th><td>${compoundN(100, rate, n, k.n).toFixed(2)} coins</td></tr>`).join('');
      status.textContent = `At ${Math.round(rate * 100)} per cent for ${n} year${n === 1 ? '' : 's'}, adding growth every month instead of once a year gives ${(compoundN(100, rate, n, 12) - compoundN(100, rate, n, 1)).toFixed(2)} coins more, and adding it all the time gives only ${(compoundN(100, rate, n, 0) - compoundN(100, rate, n, 12)).toFixed(2)} more on top of that.`;
    };
    r.el.addEventListener('input', draw);
    t.el.addEventListener('input', draw);
    draw();
  }
}
