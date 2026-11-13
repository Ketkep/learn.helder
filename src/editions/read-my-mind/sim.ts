// The experiment of "The page that guessed your keys": two lanes, one for your keys and one for a coin
// that the page flips. The same guesser reads both. Nothing is sent anywhere, and nothing moves by
// itself: every key is a press by the reader, and "Let the coin play" runs 200 flips on one click.

import { type Key, longestRun, newLane, press, rate, switchRate } from './model';
import { bars, learnedTable, trackView } from './draw';

const sim = document.querySelector<HTMLElement>('[data-rm-sim]');
if (sim) start(sim);

function start(sim: HTMLElement) {
  const $ = <T extends Element>(s: string) => sim.querySelector<T>(s);
  const you = newLane();
  const coin = newLane();
  let mode: 'you' | 'coin' = 'you';
  const goal = (id: string) => sim.dispatchEvent(new CustomEvent('learndle:goal', { detail: id, bubbles: true }));
  const put = (sel: string, html: string) => {
    const el = $<HTMLElement>(sel);
    if (el) el.innerHTML = html;
  };
  const text = (sel: string, t: string) => {
    const el = $<HTMLElement>(sel);
    if (el) el.textContent = t;
  };
  const lane = () => (mode === 'you' ? you : coin);
  const who = () => (mode === 'you' ? 'Your keys' : 'Coin flips');
  const pct = (l: typeof you) => (l.keys.length >= 5 ? `${Math.round(rate(l) * 100)}%` : 'too few keys yet');

  let sayTimer = 0;
  function say() {
    window.clearTimeout(sayTimer);
    sayTimer = window.setTimeout(() => {
      text('[data-rm-say]', `You: ${you.keys.length} keys, the page guessed ${pct(you)}. Coin: ${coin.keys.length} flips, the page guessed ${pct(coin)}.`);
    }, 600);
  }

  function draw() {
    const l = lane();
    put('[data-rm-track]', trackView(l, 24, who()));
    put('[data-rm-track-narrow]', trackView(l, 9, who()));
    put('[data-rm-bars]', bars(you, coin));
    put('[data-rm-learned]', learnedTable(l));
    text('[data-rm-n-you]', String(you.keys.length));
    text('[data-rm-n-coin]', String(coin.keys.length));
    text('[data-rm-r-you]', pct(you));
    text('[data-rm-r-coin]', pct(coin));
    text('[data-rm-run-you]', you.keys.length ? String(longestRun(you.keys)) : 'none yet');
    text('[data-rm-run-coin]', coin.keys.length ? String(longestRun(coin.keys)) : 'none yet');
    text('[data-rm-sw-you]', you.keys.length > 1 ? `${Math.round(switchRate(you.keys) * 100)}%` : 'none yet');
    text('[data-rm-sw-coin]', coin.keys.length > 1 ? `${Math.round(switchRate(coin.keys) * 100)}%` : 'none yet');
    // Quoted again in the explanation, so the reader sees their own numbers there
    document.querySelectorAll('[data-rm-mine-run]').forEach((e) => (e.textContent = you.keys.length ? String(longestRun(you.keys)) : 'not measured yet'));
    document.querySelectorAll('[data-rm-mine-switch]').forEach((e) => (e.textContent = you.keys.length > 1 ? `${Math.round(switchRate(you.keys) * 100)} per cent` : 'not measured yet'));
    document.querySelectorAll('[data-rm-mine-rate]').forEach((e) => (e.textContent = you.keys.length >= 5 ? `${Math.round(rate(you) * 100)} per cent` : 'not measured yet'));
    sim.querySelectorAll<HTMLButtonElement>('[data-rm-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.rmMode === mode)));
    sim.querySelectorAll<HTMLElement>('[data-rm-for]').forEach((e) => (e.hidden = e.dataset.rmFor !== mode));
  }

  function add(key: Key, l = lane()) {
    press(l, key);
    if (l === you && you.keys.length === 60) goal('typed-60');
    if (l === coin && coin.keys.length >= 200) goal('coin-200');
  }

  sim.querySelectorAll<HTMLButtonElement>('[data-rm-key]').forEach((b) =>
    b.addEventListener('click', () => {
      if (mode !== 'you') return;
      add(b.dataset.rmKey as Key);
      draw();
      say();
    }),
  );

  // The F and J keys of a real keyboard, while nothing like a text box has the focus
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || !sim.isConnected) return;
    const t = e.target as HTMLElement;
    if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
    const k = e.key.toUpperCase();
    if (mode === 'you' && (k === 'F' || k === 'J') && sim.closest('.ed-step:not([hidden])')) {
      const r = sim.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      e.preventDefault();
      add(k as Key);
      draw();
      say();
    }
  });

  $('[data-rm-flip]')?.addEventListener('click', () => {
    add(Math.random() < 0.5 ? 'F' : 'J', coin);
    draw();
    say();
  });
  $('[data-rm-flip-many]')?.addEventListener('click', () => {
    for (let i = 0; i < 200; i++) add(Math.random() < 0.5 ? 'F' : 'J', coin);
    draw();
    say();
  });

  sim.querySelectorAll<HTMLButtonElement>('[data-rm-mode]').forEach((b) =>
    b.addEventListener('click', () => {
      mode = b.dataset.rmMode === 'coin' ? 'coin' : 'you';
      draw();
    }),
  );

  $('[data-rm-reset]')?.addEventListener('click', () => {
    you.keys.length = you.guesses.length = 0;
    coin.keys.length = coin.guesses.length = 0;
    you.counts = {};
    coin.counts = {};
    draw();
    say();
  });

  $<HTMLDetailsElement>('[data-rm-details]')?.addEventListener('toggle', (e) => {
    if ((e.target as HTMLDetailsElement).open) goal('saw-table');
  });

  draw();
}
