// Makes the link preview picture of every daily edition: src/editions/<slug>/preview.png, 1200 by 630.
// That is the picture WhatsApp, LinkedIn and others show when someone pastes the link of an edition.
// It is drawn from the edition's own cover, title and question, in the site's fonts, by the browser
// that the checks use, and saved as a plain PNG (many apps do not show SVG previews).
//
//   npm run og            makes the pictures that are missing
//   npm run og -- --all   makes all of them again (after a title or a cover changed)
//
// Commit the PNG files. The build uses them when they are there, and the site's general picture
// when they are not (npm run schedule warns about that).

import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const { editions } = await import('../src/data/editions.ts');
const { readableInk } = await import('../src/lib/color.ts');
const { DAILY, formatDay } = await import('../src/lib/daily.ts');

const root = fileURLToPath(new URL('..', import.meta.url));
const all = process.argv.includes('--all');
const folder = (e) => join(root, 'src', 'editions', e.slug);

const font = (path) => pathToFileURL(join(root, 'node_modules', path)).href;
const display = font('@fontsource/young-serif/files/young-serif-latin-400-normal.woff2');
const body = font('@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function card(e) {
  const ink = readableInk(e.accent);
  const cover = readFileSync(join(folder(e), 'cover.svg'), 'utf8');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Young Serif'; src: url('${display}') format('woff2'); }
  @font-face { font-family: 'Hanken'; src: url('${body}') format('woff2'); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: ${e.accent}; color: ${ink}; font-family: 'Hanken', sans-serif; }
  .card { display: flex; gap: 48px; align-items: center; height: 100%; padding: 56px 64px; }
  .text { flex: 1; display: flex; flex-direction: column; height: 100%; }
  .kicker { font-size: 26px; font-weight: 700; letter-spacing: 0.02em; opacity: 0.9; }
  h1 { margin-top: 22px; font-family: 'Young Serif', serif; font-weight: 400; font-size: 70px; line-height: 1.04; letter-spacing: -0.01em; }
  .q { margin-top: 24px; font-size: 30px; line-height: 1.3; font-weight: 500; }
  .foot { margin-top: auto; display: flex; align-items: center; gap: 14px; font-size: 24px; font-weight: 600; }
  .pic { flex: none; width: 500px; height: 375px; border-radius: 14px; overflow: hidden; box-shadow: 0 0 0 3px ${ink}; }
  .pic svg { display: block; width: 100%; height: 100%; }
  </style></head><body><div class="card">
  <div class="text">
    <p class="kicker">${esc(DAILY.name)} No. ${e.number} &middot; ${esc(formatDay(e.date, { weekday: false }))}</p>
    <h1>${esc(e.title)}</h1>
    <p class="q">${esc(e.question)}</p>
    <p class="foot"><svg width="40" height="34" viewBox="0 0 28 24" aria-hidden="true"><path d="M2 12h24" stroke="${ink}" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="12" r="6" fill="#e4501a" stroke="${ink}" stroke-width="2"/></svg>${esc(DAILY.site)}</p>
  </div>
  <div class="pic">${cover}</div>
</div></body></html>`;
}

const todo = editions.filter((e) => existsSync(join(folder(e), 'cover.svg')) && (all || !existsSync(join(folder(e), 'preview.png'))));
if (!todo.length) {
  console.log('Every edition already has its picture. Use --all to make them again.');
  process.exit(0);
}

const work = mkdtempSync(join(tmpdir(), 'og-'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const e of todo) {
  const file = join(work, `daily-${e.number}.html`);
  writeFileSync(file, card(e));
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  // A title that does not fit in three lines gets a smaller size, so nothing is cut off
  await page.evaluate(() => {
    const h = document.querySelector('h1');
    let size = 70;
    while (h && h.getBoundingClientRect().height > 3 * size * 1.05 && size > 44) {
      size -= 4;
      h.style.fontSize = `${size}px`;
    }
  });
  await page.screenshot({ path: join(folder(e), 'preview.png') });
  console.log(`made src/editions/${e.slug}/preview.png (No. ${e.number}, ${e.title})`);
}
await browser.close();
