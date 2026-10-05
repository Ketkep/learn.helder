#!/usr/bin/env node
// Checks one page of the site the way a careful reader would, and writes screenshots to look at.
//
//   node tools/check-topic.mjs /my-new-topic/ [--base http://localhost:4322] [--out DIR] [--no-shots] [--min-chars 800]
//
// --min-chars is how much text a topic must show with scripts off. The home page is shorter: use 300 there.
//
// Run it on a production build (npm run build, then npm run preview -- --port 4322). The dev server
// adds comments and extra requests that the real site does not have.
//
// FAIL means fix it before publishing. WARN means look at it with your own eyes (screenshots are in
// the out folder) and decide. The exit code is 1 when anything fails.
//
// Playwright is not a dependency of the site. It comes with the environment (Chromium is at
// /opt/pw-browsers/chromium), so it is loaded in a way that finds the global install.

import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const pagePath = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--')) ?? '/';
const base = opt('base', 'http://localhost:4322');
const out = opt('out', path.join(os.tmpdir(), 'check-topic'));
const shots = !args.includes('--no-shots');
const minChars = Number(opt('min-chars', '800'));
const url = new URL(pagePath, base).href;
fs.mkdirSync(out, { recursive: true });

let fails = 0;
let warns = 0;
const say = (level, name, detail = '') => {
  if (level === 'FAIL') fails++;
  if (level === 'WARN') warns++;
  console.log(`${level} ${name}${detail ? ': ' + detail : ''}`);
};
const pass = (name, detail) => say('PASS', name, detail);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ownHost = new URL(base).host;

/** Opens the page in a fresh context and gives back what happened while it loaded. */
async function open(label, contextOptions) {
  const ctx = await browser.newContext(contextOptions);
  const page = await ctx.newPage();
  const problems = [];
  const hosts = new Set();
  page.on('pageerror', (e) => problems.push(`script error: ${e.message}`));
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && problems.push(`console ${m.type()}: ${m.text().slice(0, 160)}`));
  page.on('requestfailed', (r) => problems.push(`request failed: ${r.url().slice(0, 120)}`));
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (!['data:', 'blob:'].includes(u.protocol)) hosts.add(u.host);
  });
  const res = await page.goto(url, { waitUntil: 'networkidle' });
  if (!res || res.status() !== 200) problems.push(`status ${res?.status()}`);
  return { ctx, page, problems, hosts, label };
}

/** Anything that sticks out sideways past the screen, unless it sits inside a box that clips it. */
const overflowAudit = () => {
  const vw = document.documentElement.clientWidth;
  const bad = [];
  document.querySelectorAll('body *').forEach((e) => {
    if (e.closest('svg')) return;
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return;
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.right <= vw + 1 && r.left >= -1) return;
    for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (['auto', 'scroll', 'hidden', 'clip'].includes(o)) {
        const pr = p.getBoundingClientRect();
        if (pr.right <= vw + 1 && pr.left >= -1) return;
      }
    }
    bad.push(`${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''} ${Math.round(r.left)}..${Math.round(r.right)}`);
  });
  return { scrollW: document.documentElement.scrollWidth, vw, bad: bad.slice(0, 6) };
};

// ------------------------------------------------------------------ 1. every width, with scripts on
const sizes = [[320, 700], [360, 740], [390, 844], [414, 896], [768, 1024], [1024, 768], [1366, 768], [1440, 900]];
const hostsSeen = new Set();
for (const [w, h] of sizes) {
  const { ctx, page, problems, hosts } = await open(`${w}`, { viewport: { width: w, height: h }, hasTouch: w < 800, isMobile: w < 800 });
  // scroll to the bottom in steps, so lazy parts wake up and late errors show
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    scrollTo(0, 0);
  });
  const o = await page.evaluate(overflowAudit);
  hosts.forEach((x) => hostsSeen.add(x));
  if (problems.length) say('FAIL', `${w}px loads without errors`, problems.slice(0, 4).join(' | '));
  else pass(`${w}px loads without errors`);
  if (o.scrollW > o.vw + 1 || o.bad.length) say('FAIL', `${w}px has no sideways overflow`, `scrollWidth ${o.scrollW} vs ${o.vw}; ${o.bad.join('; ')}`);
  else pass(`${w}px has no sideways overflow`);
  await ctx.close();
}
const strangers = [...hostsSeen].filter((x) => x !== ownHost);
if (strangers.length) say('FAIL', 'only the site itself is contacted', strangers.join(', '));
else pass('only the site itself is contacted (no tracking, no outside fonts)');

// ------------------------------------------------------------------ 2. structure, words, contrast (desktop)
{
  const { ctx, page } = await open('audit', { viewport: { width: 1366, height: 768 } });
  const a = await page.evaluate(() => {
    const out = {};
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => h.offsetParent !== null || getComputedStyle(h).position === 'fixed' || h.getClientRects().length);
    out.h1 = document.querySelectorAll('h1').length;
    out.skips = [];
    let prev = 0;
    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
      const n = Number(h.tagName[1]);
      if (prev && n > prev + 1) out.skips.push(`${h.tagName.toLowerCase()} after h${prev}: ${h.textContent.trim().slice(0, 40)}`);
      prev = n;
    });
    out.headings = hs.length;
    out.lang = document.documentElement.lang;
    out.title = document.title;
    out.desc = document.querySelector('meta[name=description]')?.content ?? '';
    out.canonical = !!document.querySelector('link[rel=canonical]');
    out.unnamedImg = [...document.querySelectorAll('[role=img]')].filter((e) => !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby')).length;
    out.unnamedButtons = [...document.querySelectorAll('button')].filter((b) => !(b.getAttribute('aria-label') || b.textContent.trim() || b.getAttribute('aria-labelledby'))).map((b) => b.outerHTML.slice(0, 80));
    out.unlabelled = [...document.querySelectorAll('input,select,textarea')].filter((i) => i.type !== 'hidden' && !(i.getAttribute('aria-label') || i.getAttribute('aria-labelledby') || (i.id && document.querySelector(`label[for="${i.id}"]`)) || i.closest('label'))).map((i) => i.outerHTML.slice(0, 80));
    out.badLinks = [...document.querySelectorAll('a')].filter((l) => !l.getAttribute('href')).length;
    out.imgNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;

    // all the words a person or a screen reader could meet: text, plus the words in attributes
    const words = [document.body.textContent, document.title];
    document.querySelectorAll('[aria-label],[alt],[title],[placeholder],meta[name=description],meta[property^="og:"]').forEach((e) => {
      ['aria-label', 'alt', 'title', 'placeholder', 'content'].forEach((n) => e.getAttribute(n) && words.push(e.getAttribute(n)));
    });
    const text = words.join('\n');
    out.dashes = (text.match(/[\u2013\u2014]/g) ?? []).length;
    out.buzz = [...new Set((text.match(/\b(unlock(?:ed|ing|s)?|dive[sd]? into|diving into|elevate[sd]?|seamless(?:ly)?|journey|empower(?:s|ed|ing)?|harness(?:es|ed|ing)?|delve[sd]?|game-changer|in today's world|whether you're)\b/gi) ?? []).map((x) => x.toLowerCase()))];
    out.emoji = [...new Set((text.match(/\p{Extended_Pictographic}/gu) ?? []).filter((c) => !'©®™'.includes(c)))];
    out.words = text.split(/\s+/).filter(Boolean).length;

    // contrast of text on plain backgrounds (text on pictures or gradients is skipped and must be checked by eye)
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const g = cv.getContext('2d', { willReadFrequently: true });
    const rgba = (css) => {
      g.clearRect(0, 0, 1, 1);
      g.fillStyle = '#000';
      g.fillStyle = css;
      g.fillRect(0, 0, 1, 1);
      const d = g.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };
    const over = (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3])).concat([1]);
    const lum = ([r, gg, b]) => {
      const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b);
    };
    const backdrop = (el) => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.backgroundImage !== 'none') return null;
        const c = rgba(cs.backgroundColor);
        if (c[3] > 0) layers.push(c);
        if (c[3] === 1) break;
      }
      let acc = [255, 255, 255, 1];
      for (let i = layers.length - 1; i >= 0; i--) acc = over(layers[i], acc);
      return acc;
    };
    const low = new Map();
    let checked = 0;
    document.querySelectorAll('body *').forEach((el) => {
      if (el.closest('svg, canvas, script, style, noscript')) return;
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width < 2 || r.height < 2 || cs.visibility === 'hidden' || cs.display === 'none') return;
      let op = 1;
      for (let e = el; e; e = e.parentElement) op *= Number(getComputedStyle(e).opacity);
      if (op < 0.05) return;
      const bg = backdrop(el);
      if (!bg) return;
      const fg0 = rgba(cs.color);
      const fg = over([fg0[0], fg0[1], fg0[2], fg0[3] * op], bg);
      const l1 = lum(fg);
      const l2 = lum(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const size = parseFloat(cs.fontSize);
      const need = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700) ? 3 : 4.5;
      checked++;
      if (ratio < need) {
        const key = `${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : ''}`;
        if (!low.has(key)) low.set(key, `${ratio.toFixed(2)} (needs ${need}) "${el.textContent.trim().slice(0, 30)}"`);
      }
    });
    out.contrast = { checked, low: [...low].slice(0, 12).map(([k, v]) => `${k} ${v}`) };
    return out;
  });
  a.h1 === 1 ? pass('one h1') : say('FAIL', 'one h1', `found ${a.h1}`);
  a.skips.length ? say('FAIL', 'heading levels do not skip', a.skips.join('; ')) : pass(`heading levels do not skip (${a.headings} headings)`);
  a.lang ? pass('html lang is set', a.lang) : say('FAIL', 'html lang is set');
  a.title && a.desc && a.canonical ? pass('title, description, canonical present') : say('FAIL', 'title, description, canonical present', JSON.stringify({ title: !!a.title, desc: !!a.desc, canonical: a.canonical }));
  a.unnamedImg ? say('FAIL', 'role=img elements have a label', `${a.unnamedImg} without`) : pass('role=img elements have a label');
  a.imgNoAlt ? say('FAIL', 'images have alt text', `${a.imgNoAlt} without`) : pass('images have alt text');
  a.unnamedButtons.length ? say('FAIL', 'buttons have a name', a.unnamedButtons.join(' | ')) : pass('buttons have a name');
  a.unlabelled.length ? say('FAIL', 'inputs have a label', a.unlabelled.join(' | ')) : pass('inputs have a label');
  a.badLinks ? say('FAIL', 'links have an href', `${a.badLinks} without`) : pass('links have an href');
  a.dashes ? say('FAIL', 'no em or en dashes in any word on the page', `${a.dashes} found`) : pass('no em or en dashes in any word on the page');
  a.buzz.length ? say('FAIL', 'no buzzwords', a.buzz.join(', ')) : pass('no buzzwords');
  a.emoji.length ? say('FAIL', 'no emojis', a.emoji.join(' ')) : pass('no emojis');
  a.words < 250 ? say('WARN', 'the page has enough words', `only ${a.words}`) : pass(`the page has enough words (${a.words})`);
  a.contrast.low.length ? say('WARN', `contrast under the limit on ${a.contrast.low.length} kinds of text (of ${a.contrast.checked} checked), look at them by eye`, a.contrast.low.join(' | ')) : pass(`text contrast is fine (${a.contrast.checked} text boxes on plain backgrounds)`);
  await ctx.close();
}

// ------------------------------------------------------------------ 3. reduced motion
for (const [w, h] of [[390, 844], [1366, 768]]) {
  const { ctx, page, problems } = await open('reduced', { viewport: { width: w, height: h }, reducedMotion: 'reduce', hasTouch: w < 800, isMobile: w < 800 });
  await page.waitForTimeout(1200);
  const o = await page.evaluate(overflowAudit);
  const running = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((x) => x.playState === 'running' && x.effect && x.effect.getComputedTiming().iterations === Infinity)
      .map((x) => x.animationName || x.constructor.name)
      .slice(0, 5),
  );
  problems.length ? say('FAIL', `reduced motion ${w}px loads without errors`, problems.slice(0, 3).join(' | ')) : pass(`reduced motion ${w}px loads without errors`);
  o.scrollW > o.vw + 1 || o.bad.length ? say('FAIL', `reduced motion ${w}px has no sideways overflow`, o.bad.join('; ')) : pass(`reduced motion ${w}px has no sideways overflow`);
  running.length ? say('WARN', `reduced motion ${w}px: endless animations still run`, running.join(', ')) : pass(`reduced motion ${w}px: nothing loops by itself`);
  await ctx.close();
}

// ------------------------------------------------------------------ 4. without JavaScript
for (const [w, h] of [[390, 844], [1366, 768]]) {
  const { ctx, page } = await open('nojs', { viewport: { width: w, height: h }, javaScriptEnabled: false });
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const idle = [...document.querySelectorAll('.needs-js')].filter((e) => getComputedStyle(e).display !== 'none' && e.getClientRects().length).map((e) => e.className.toString().slice(0, 40));
    return { h1: !!document.querySelector('h1'), chars: document.body.innerText.length, over: document.documentElement.scrollWidth > vw + 1, idle: idle.slice(0, 5) };
  });
  r.h1 && r.chars > minChars ? pass(`no script ${w}px: the words are all there`, `${r.chars} characters`) : say('FAIL', `no script ${w}px: the words are all there`, JSON.stringify(r));
  r.over ? say('FAIL', `no script ${w}px has no sideways overflow`) : pass(`no script ${w}px has no sideways overflow`);
  r.idle.length ? say('FAIL', `no script ${w}px: controls that need a script are hidden`, r.idle.join(', ')) : pass(`no script ${w}px: controls that need a script are hidden`);
  if (shots && w === 1366) await page.screenshot({ path: path.join(out, 'nojs-1366.png') });
  await ctx.close();
}

// ------------------------------------------------------------------ 5. keyboard
{
  const { ctx, page } = await open('keys', { viewport: { width: 1366, height: 768 } });
  const stops = [];
  let same = 0;
  for (let i = 0; i < 250; i++) {
    await page.keyboard.press('Tab');
    const s = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      const cs = getComputedStyle(e);
      const name = (e.getAttribute('aria-label') || e.textContent || e.getAttribute('alt') || e.id || '').trim().replace(/\s+/g, ' ').slice(0, 30);
      const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none';
      const r = e.getBoundingClientRect();
      return { tag: e.tagName.toLowerCase(), name, ring, shown: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth, id: e.outerHTML.slice(0, 100) };
    });
    if (!s) break;
    same = stops.length && stops[stops.length - 1].id === s.id ? same + 1 : 0;
    stops.push(s);
    if (same >= 4) break;
  }
  const trapped = stops.length >= 4 && stops.slice(-4).every((s) => s.id === stops[stops.length - 1].id);
  trapped ? say('FAIL', 'keyboard can leave every control', `stuck on ${stops[stops.length - 1].tag} "${stops[stops.length - 1].name}"`) : pass(`keyboard moves through ${stops.length} controls and does not get stuck`);
  const hidden = stops.filter((s) => !s.shown);
  hidden.length ? say('WARN', 'every focused control is on screen', hidden.slice(0, 4).map((s) => `${s.tag} "${s.name}"`).join(' | ')) : pass('every focused control is on screen');
  const noRing = stops.filter((s) => !s.ring);
  noRing.length ? say('WARN', `${noRing.length} controls show no outline or shadow when focused (a background change also counts, check by eye)`, noRing.slice(0, 4).map((s) => `${s.tag} "${s.name}"`).join(' | ')) : pass('every focused control shows a focus ring');
  await ctx.close();
}

// ------------------------------------------------------------------ 6. screenshots and contact sheets
if (shots) {
  for (const [w, h, cols] of [[1366, 768, 3], [390, 844, 6]]) {
    const { ctx, page } = await open('shots', { viewport: { width: w, height: h }, hasTouch: w < 800, isMobile: w < 800 });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const n = Math.max(1, Math.min(15, Math.ceil(total / h)));
    const files = [];
    for (let i = 0; i < n; i++) {
      await page.evaluate((y) => scrollTo(0, y), n === 1 ? 0 : (i * (total - h)) / (n - 1));
      await page.waitForTimeout(500);
      const f = path.join(out, `shot-${w}-${String(i).padStart(2, '0')}.png`);
      await page.screenshot({ path: f });
      files.push(f);
    }
    await ctx.close();
    const sheet = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    const imgs = files.map((f) => `<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="width:${Math.floor(1560 / cols)}px">`).join('');
    await sheet.setContent(`<body style="margin:0;background:#222"><div style="display:grid;grid-template-columns:repeat(${cols},auto);gap:6px;padding:6px;width:max-content">${imgs}</div></body>`);
    await sheet.waitForTimeout(400);
    await sheet.screenshot({ path: path.join(out, `sheet-${w}.png`), fullPage: true });
    await sheet.close();
  }
  console.log(`INFO screenshots and contact sheets (sheet-1366.png, sheet-390.png) are in ${out}. Look at them before you publish.`);
}

await browser.close();
console.log(`\nRESULT ${fails} fail, ${warns} warn for ${url}`);
process.exit(fails ? 1 : 0);
