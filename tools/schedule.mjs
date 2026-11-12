// Prints the schedule of daily editions and warns about what a reader would notice: a day without an
// edition coming up soon, a ready edition without its folder, or the end of the prepared editions.
//
//   npm run schedule            the schedule from today (Amsterdam time)
//   npm run schedule -- 2026-12-01   as if it were that day
//
// It reads src/data/editions.ts directly (that file has no imports for this reason), and uses the same
// checks as the build, so a broken schedule stops here with the same message.

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const { editions, checkSchedule } = await import('../src/data/editions.ts');
const { DAILY, dayAt, addDays, daysBetween } = await import('../src/lib/daily.ts');

const root = fileURLToPath(new URL('..', import.meta.url));
const today = process.argv[2] ?? dayAt(Date.now());
const sorted = checkSchedule(editions);
const warnings = [];

console.log(`${DAILY.name} schedule, as seen on ${today} (${DAILY.timeZone})\n`);
for (const e of sorted) {
  const folder = `src/editions/${e.slug}`;
  const missing = ['Edition.astro', 'cover.svg'].filter((f) => !existsSync(`${root}${folder}/${f}`));
  const when = e.date < today ? 'past' : e.date === today ? 'TODAY' : `in ${daysBetween(today, e.date)} d`;
  console.log(`  No. ${String(e.number).padStart(3)}  ${e.date}  ${e.status.padEnd(5)}  ${when.padEnd(8)}  ${e.title}`);
  if (missing.length) warnings.push(`No. ${e.number}: ${folder} is missing ${missing.join(' and ')}.`);
  else if (!existsSync(`${root}${folder}/preview.png`)) warnings.push(`No. ${e.number} has no link preview picture yet: run npm run og.`);
}

const ready = sorted.filter((e) => e.status === 'ready');
const last = ready[ready.length - 1];
if (!last || last.date < today) {
  warnings.push('No ready edition from today on: the home page shows the most recent one and says there is no new discovery today.');
} else {
  // Days in the coming week without an edition
  const dates = new Set(ready.map((e) => e.date));
  const empty = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, i);
    if (!dates.has(d)) empty.push(d);
  }
  if (empty.length) warnings.push(`No edition on ${empty.join(', ')}. Readers get the most recent one, with a note.`);
  console.log(`\nReady up to ${last.date}: ${daysBetween(today, last.date) + 1} day(s) from today.`);
}

console.log(warnings.length ? `\nWarnings:\n- ${warnings.join('\n- ')}` : '\nNo warnings.');
