// Maths and drawings for the loan page: the monthly payment, where each payment goes, longer terms, extra payments, and two ways to repay.
// A toy loan: a fixed yearly rate, one payment a month, no fees and no taxes. The made up amounts are in euros.

const f1 = (n: number) => Math.round(n * 10) / 10;

export const eur = (n: number) => `€${Math.round(n).toLocaleString('en-US')}`;

/** The level monthly payment of an annuity loan. */
export function payment(principal: number, yearlyRate: number, years: number): number {
  const r = yearlyRate / 1200;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - (1 + r) ** -n);
}

export interface Month {
  interest: number;
  principal: number;
  balance: number;
  paid: number;
}

/** Month by month, with an optional extra amount paid every month. The loan ends when the balance reaches zero. */
export function schedule(principal: number, yearlyRate: number, years: number, extra = 0): Month[] {
  const r = yearlyRate / 1200;
  const pay = payment(principal, yearlyRate, years) + extra;
  const out: Month[] = [];
  let balance = principal;
  while (balance > 0.005 && out.length < years * 12 + 1) {
    const interest = balance * r;
    const paid = Math.min(pay, balance + interest);
    const pr = paid - interest;
    balance = Math.max(0, balance - pr);
    out.push({ interest, principal: pr, balance, paid });
  }
  return out;
}

/** A linear loan: the same amount of principal every month, so the payment falls. */
export function linearSchedule(principal: number, yearlyRate: number, years: number): Month[] {
  const r = yearlyRate / 1200;
  const n = years * 12;
  const step = principal / n;
  const out: Month[] = [];
  let balance = principal;
  for (let i = 0; i < n; i++) {
    const interest = balance * r;
    balance = Math.max(0, balance - step);
    out.push({ interest, principal: step, balance, paid: interest + step });
  }
  return out;
}

export const totalInterest = (s: Month[]) => s.reduce((n, m) => n + m.interest, 0);
export const totalPaid = (s: Month[]) => s.reduce((n, m) => n + m.paid, 0);

/** The first month in which more of the payment goes to the loan than to interest. */
export function crossover(s: Month[]): number {
  const i = s.findIndex((m) => m.principal > m.interest);
  return i < 0 ? s.length : i + 1;
}

export function fmtMonths(m: number): string {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  const parts = [] as string[];
  if (y) parts.push(`${y} year${y === 1 ? '' : 's'}`);
  if (mo || !y) parts.push(`${mo} month${mo === 1 ? '' : 's'}`);
  return parts.join(' and ');
}

/** A stacked area of every payment: interest at the bottom, principal on top. A line marks a month. */
export function splitSvg(s: Month[], mark: number, w = 280, h = 100): string {
  const [x0, top] = [10, 10];
  const maxPay = Math.max(...s.map((m) => m.paid), 1);
  const X = (i: number) => x0 + (w * i) / Math.max(1, s.length - 1);
  const Y = (v: number) => top + h - (h * v) / maxPay;
  let pi = `M${X(0)} ${Y(0)}`;
  let pt = '';
  s.forEach((m, i) => {
    pi += `L${f1(X(i))} ${f1(Y(m.interest))}`;
  });
  pi += `L${f1(X(s.length - 1))} ${Y(0)}Z`;
  pt = `M${X(0)} ${f1(Y(s[0].interest))}`;
  s.forEach((m, i) => {
    pt += `L${f1(X(i))} ${f1(Y(m.interest))}`;
  });
  for (let i = s.length - 1; i >= 0; i--) pt += `L${f1(X(i))} ${f1(Y(s[i].paid))}`;
  pt += 'Z';
  const m = Math.max(0, Math.min(s.length - 1, mark - 1));
  return `<path class="principal" d="${pt}"/><path class="interest" d="${pi}"/><line class="mark" x1="${f1(X(m))}" y1="${top}" x2="${f1(X(m))}" y2="${top + h}"/><line class="axis" x1="${x0}" y1="${top + h}" x2="${x0 + w}" y2="${top + h}"/><text class="lab" x="${x0}" y="${top + h + 12}">month 1</text><text class="lab" x="${x0 + w}" y="${top + h + 12}" text-anchor="end">month ${s.length}</text>`;
}

/** Two payment lines on one chart: the level one and the falling one. */
export function twoSvg(a: Month[], b: Month[], w = 280, h = 100): string {
  const [x0, top] = [10, 10];
  const max = Math.max(...a.map((m) => m.paid), ...b.map((m) => m.paid), 1);
  const line = (s: Month[]) => s.map((m, i) => `${i ? 'L' : 'M'}${f1(x0 + (w * i) / Math.max(1, s.length - 1))} ${f1(top + h - (h * m.paid) / max)}`).join('');
  return `<path class="lineA" d="${line(a)}"/><path class="lineB" d="${line(b)}"/><line class="axis" x1="${x0}" y1="${top + h}" x2="${x0 + w}" y2="${top + h}"/><text class="lab" x="${x0}" y="${top + h + 12}">month 1</text><text class="lab" x="${x0 + w}" y="${top + h + 12}" text-anchor="end">month ${a.length}</text>`;
}

export const EXAMPLE = { amount: 100000, rate: 5, years: 25 };
export const SOURCE_EXAMPLE = { amount: 500000, rate: 4, years: 30 };
