// The film: scrolling the page changes the scene, and the pinned board plays it.
// All the chess is worked out when the site is built (see src/lib/chess/analyze.ts). This file
// only plays it back: it moves pieces, shows subtitles, fills the ledger and handles the
// reader's taps. It does not know the rules of chess.

import { Board, wait } from './board';
import * as sound from './sound';
import type { Ply, Ledger } from '../../lib/chess/analyze';
import type { Choice, Flow, Note, Option, Row, Scene } from '../../data/gambits';

interface LineRun {
  start: string;
  plies: Ply[];
  ledger: Ledger;
  notes: Record<number, Note>;
}

interface SceneRun {
  id: string;
  kicker: string;
  title: string;
  ledger?: Scene['ledger'];
  flow: Flow;
}

interface Payload {
  lines: Record<string, LineRun>;
  scenes: SceneRun[];
  legal: Record<string, Record<string, string[]>>;
}

const root = document.querySelector<HTMLElement>('[data-film]');
const dataNode = document.querySelector<HTMLScriptElement>('[data-film-data]');

if (root && dataNode) init(root, JSON.parse(dataNode.textContent ?? '{}') as Payload);

function init(root: HTMLElement, data: Payload) {
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const board = new Board($<HTMLElement>('[data-board]') as unknown as SVGSVGElement);
  const boardDesc = $('[data-board-desc]');
  const nowKicker = $('[data-now-kicker]');
  const nowTitle = $('[data-now-title]');
  const card = $('[data-card]');
  const subMove = $('[data-sub-move]');
  const subText = $('[data-sub-text]');
  const actions = $('[data-actions]');
  const ledgerBox = $('[data-ledger]');
  const scrub = $<HTMLInputElement>('[data-scrub]');
  const count = $('[data-count]');
  const playBtn = $<HTMLButtonElement>('[data-t="play"]');
  const buttons = {
    first: $<HTMLButtonElement>('[data-t="first"]'),
    prev: $<HTMLButtonElement>('[data-t="prev"]'),
    next: $<HTMLButtonElement>('[data-t="next"]'),
    replay: $<HTMLButtonElement>('[data-t="replay"]'),
  };
  const soundBtn = $<HTMLButtonElement>('[data-sound]');
  const soundLabel = $('[data-sound-label]');
  const sceneEls = [...root.querySelectorAll<HTMLElement>('[data-scene]')];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = () => !reduce.matches;
  const stacked = matchMedia('(max-width: 59.99rem)');

  // ---------------------------------------------------------------- state
  let token = 0; // bumped whenever something new takes over, so older sequences stop
  let sceneIdx = -1;
  let line: LineRun = data.lines[Object.keys(data.lines)[0]];
  let ply = 0;
  let maxPly = 0;
  let playing = false;
  let baseCaption = '';
  /** Set while the film waits for the reader (a move or a choice). */
  let awaiting: { at: number; show: () => void; hide: () => void } | null = null;

  const alive = (t: number) => t === token;
  const sleep = async (ms: number, t: number) => {
    await wait(ms);
    return alive(t);
  };

  // ---------------------------------------------------------------- sound
  const refreshSoundButton = () => {
    const on = sound.isSoundOn();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundLabel.textContent = on ? 'Sound on' : 'Sound off';
  };
  refreshSoundButton();
  soundBtn.addEventListener('click', () => {
    sound.unlock();
    sound.setSoundOn(!sound.isSoundOn());
    refreshSoundButton();
    sound.play('pop');
  });
  const unlockOnce = () => {
    sound.unlock();
    document.removeEventListener('pointerdown', unlockOnce, true);
    document.removeEventListener('keydown', unlockOnce, true);
  };
  document.addEventListener('pointerdown', unlockOnce, true);
  document.addEventListener('keydown', unlockOnce, true);

  // ---------------------------------------------------------------- showing things
  const label = (n: number) => `${Math.ceil(n / 2)}${n % 2 ? '.' : '...'} ${line.plies[n - 1].san}`;

  function setLive() {
    subText.setAttribute('aria-live', playing ? 'off' : 'polite');
  }

  function showCaption(text: string, tone: 'plain' | 'good' | 'bad' = 'plain', moveLabel = '') {
    subMove.textContent = moveLabel;
    subText.textContent = text;
    subText.parentElement!.dataset.tone = tone;
  }

  function formatNumber(row: Row, v: number) {
    if (row === 'k') return String(Math.abs(v));
    return v > 0 ? `+${v}` : v < 0 ? `-${Math.abs(v)}` : '0';
  }

  function buildLedger(scene: SceneRun) {
    ledgerBox.replaceChildren();
    const cfg = scene.ledger;
    ledgerBox.hidden = !cfg;
    if (!cfg) return;
    const names: Record<Row, string> = { m: 'Material', c: 'Centre squares', k: cfg.kLabel ?? 'King in danger' };
    const head = document.createElement('div');
    head.className = 'lg-head';
    head.innerHTML = '<span>Paid</span><span>Got</span>';
    ledgerBox.append(head);
    for (const row of cfg.rows) {
      const r = document.createElement('div');
      r.className = 'lg-row';
      r.dataset.row = row;
      r.innerHTML =
        `<span class="lg-label">${names[row]}</span>` +
        '<span class="lg-bar" aria-hidden="true"><i class="neg"></i><i class="pos"></i></span>' +
        '<span class="lg-num">0</span>';
      ledgerBox.append(r);
    }
  }

  function updateLedger(i: number) {
    const cfg = sceneIdx >= 0 ? data.scenes[sceneIdx].ledger : undefined;
    if (!cfg) return;
    for (const row of cfg.rows) {
      const v = line.ledger[row][i] ?? 0;
      const range = cfg.range[row] ?? 3;
      const share = Math.min(1, Math.abs(v) / range) * 50;
      const r = ledgerBox.querySelector<HTMLElement>(`[data-row="${row}"]`);
      if (!r) continue;
      r.querySelector<HTMLElement>('.neg')!.style.width = `${v < 0 ? share : 0}%`;
      r.querySelector<HTMLElement>('.pos')!.style.width = `${v > 0 ? share : 0}%`;
      r.querySelector('.lg-num')!.textContent = formatNumber(row, v);
    }
  }

  /** Brings every part of the screen up to date for position `i`. The board must already be there. */
  function showPly(i: number, captions = true) {
    const move = i > 0 ? line.plies[i - 1] : null;
    board.setHighlights({ last: move ? [move.from, move.to] : null, check: null });
    if (move?.check) {
      // Read the king's square from the position itself, so it is right even mid-animation
      const king = kingIn(move.fen, move.color === 'w' ? 'b' : 'w');
      if (king) board.setHighlights({ check: king });
    }
    const note = line.notes[i];
    board.setNotes(note?.arrows, note?.marks, motion());
    if (captions) {
      if (i === 0 || !move) showCaption(baseCaption);
      else showCaption(note?.text ?? '', 'plain', label(i));
    }
    updateLedger(i);
    scrub.max = String(line.plies.length);
    scrub.value = String(i);
    scrub.style.setProperty('--p', `${line.plies.length ? (i / line.plies.length) * 100 : 0}%`);
    scrub.setAttribute('aria-valuetext', i === 0 ? 'Start' : `After ${label(i)}`);
    count.textContent = `${i} / ${line.plies.length}`;
    buttons.first.disabled = buttons.prev.disabled = i === 0;
    buttons.next.disabled = i >= maxPly;
    scrub.disabled = maxPly === 0;
    boardDesc.textContent = board.describe(i > 0 ? line.plies[i - 1].fen : line.start);
    board.labelSquares();
  }

  /** The square a king stands on in a position (the first part of a FEN is the piece list). */
  function kingIn(fen: string, color: 'w' | 'b'): string | null {
    const want = color === 'w' ? 'K' : 'k';
    const rows = fen.split(' ')[0].split('/');
    for (let r = 0; r < 8; r++) {
      let f = 0;
      for (const ch of rows[r]) {
        if (/\d/.test(ch)) f += Number(ch);
        else {
          if (ch === want) return 'abcdefgh'[f] + (8 - r);
          f++;
        }
      }
    }
    return null;
  }

  const fenAt = (i: number) => (i > 0 ? line.plies[i - 1].fen : line.start);

  /** Jumps to a position with no movement. */
  function setPosition(i: number, captions = true) {
    ply = i;
    board.setFen(fenAt(i));
    showPly(i, captions);
  }

  function setLine(key: string) {
    line = data.lines[key];
    maxPly = line.plies.length;
    scrub.max = String(maxPly);
  }

  function refreshAwaiting() {
    if (!awaiting) return;
    if (ply === awaiting.at) awaiting.show();
    else awaiting.hide();
  }

  function updatePlayButton() {
    playBtn.classList.toggle('is-playing', playing);
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    setLive();
  }

  // ---------------------------------------------------------------- moving through a game
  /** Moves the board one step at a time until it reaches position `target`. */
  async function stepTo(target: number, t: number, fast = false) {
    const anim = motion();
    const previous = board.slide;
    if (fast) board.slide = 130;
    while (ply !== target && alive(t)) {
      if (target > ply) {
        const p = line.plies[ply];
        ply++;
        showPly(ply);
        sound.play(p.mate ? 'mate' : p.check ? 'check' : p.cap ? 'capture' : 'move');
        await board.applyPly(p, anim);
        board.labelSquares();
      } else {
        const p = line.plies[ply - 1];
        ply--;
        showPly(ply);
        if (anim) sound.play('move');
        await board.undoPly(p, anim);
        board.labelSquares();
      }
    }
    board.slide = previous;
  }

  /** Plays forward to `target`, pausing a little on every move and longer where there is a note. */
  async function playTo(target: number, t: number, pace = 560) {
    playing = true;
    updatePlayButton();
    while (ply < target && alive(t)) {
      await stepTo(ply + 1, t);
      if (!alive(t)) return;
      const long = line.notes[ply] ? Math.max(1300, line.notes[ply].text.length * 34) : 0;
      if (ply < target && !(await sleep(pace + long, t))) return;
    }
    if (alive(t)) {
      playing = false;
      updatePlayButton();
    }
  }

  /** Runs the game backwards quickly, like rewinding a tape. */
  async function rewindTo(target: number, t: number) {
    const previous = board.slide;
    board.slide = 70;
    while (ply > target && alive(t)) {
      const p = line.plies[ply - 1];
      ply--;
      showPly(ply, false);
      if (ply % 2 === 0) sound.play('tick');
      await board.undoPly(p, true);
      await wait(35);
    }
    board.slide = previous;
  }

  /** Anything the reader does by hand takes over from whatever the film was doing. */
  function takeOver() {
    token++;
    playing = false;
    updatePlayButton();
    return token;
  }

  // ---------------------------------------------------------------- the reader's controls
  buttons.first.addEventListener('click', () => {
    takeOver();
    setPosition(0);
    refreshAwaiting();
  });
  buttons.prev.addEventListener('click', async () => {
    const t = takeOver();
    if (ply > 0) await stepTo(ply - 1, t);
    refreshAwaiting();
  });
  buttons.next.addEventListener('click', async () => {
    const t = takeOver();
    if (ply < maxPly) await stepTo(ply + 1, t);
    refreshAwaiting();
  });
  playBtn.addEventListener('click', () => {
    if (playing) {
      takeOver();
      return;
    }
    const t = takeOver();
    if (ply >= maxPly) setPosition(0);
    void playTo(maxPly, t);
  });
  buttons.replay.addEventListener('click', () => void loadScene(sceneIdx, true));
  scrub.addEventListener('input', async () => {
    const t = takeOver();
    const target = Number(scrub.value);
    if (Math.abs(target - ply) === 1) await stepTo(target, t);
    else setPosition(target);
    refreshAwaiting();
  });

  // ---------------------------------------------------------------- questions for the reader
  function setActions(items: { text: string; onClick: () => void; primary?: boolean }[]) {
    actions.replaceChildren();
    for (const item of items) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = item.primary === false ? 'act ghost' : 'act';
      b.textContent = item.text;
      b.addEventListener('click', item.onClick);
      actions.append(b);
    }
  }

  interface Parent {
    restart: () => void;
    /** The ply where the first question is asked. */
    setup: number;
    /** True when the first question has just two answers. */
    two: boolean;
  }

  function showChoice(choice: Choice, branch: number, parent: Parent, intro = '') {
    baseCaption = (intro ? `${intro} ` : '') + choice.prompt;
    const show = () => {
      showCaption(baseCaption);
      setActions(choice.options.map((o) => ({ text: o.label, onClick: () => void pickOption(o, branch, parent) })));
    };
    awaiting = {
      at: branch,
      show,
      hide: () => {
        actions.replaceChildren();
      },
    };
    maxPly = branch;
    scrub.max = String(line.plies.length);
    showPly(ply, false);
    show();
  }

  async function pickOption(option: Option, branch: number, parent: Parent) {
    const t = takeOver();
    awaiting = null;
    actions.replaceChildren();
    setLine(option.line);
    await playTo(maxPly, t, 750);
    if (!alive(t)) return;
    const tone = option.verdict.tone;
    if (option.then) {
      showChoice(option.then, maxPly, parent, option.verdict.text);
      return;
    }
    showCaption(option.verdict.text, tone);
    if (tone !== 'plain') {
      await wait(500);
      if (alive(t)) sound.play(tone);
    }
    const text = parent.two && branch === parent.setup ? 'Try the other one' : 'Try again';
    setActions([{ text, onClick: parent.restart }]);
  }

  // ---------------------------------------------------------------- scenes
  async function runReplay(f: Extract<Flow, { type: 'replay' }>, t: number) {
    setLine(f.line);
    baseCaption = f.caption;
    const total = line.plies.length;
    if (f.from === 'end') {
      setPosition(total);
      showCaption(f.caption);
      if (f.rewind && motion()) {
        if (!(await sleep(2600, t))) return;
        showCaption('Rewinding.');
        await rewindTo(0, t);
        if (!alive(t)) return;
        baseCaption = f.captionAfter ?? '';
        setPosition(0);
      } else if (f.rewind) {
        baseCaption = f.captionAfter ?? '';
      }
      return;
    }
    setPosition(0);
    if (f.autoplay && motion()) {
      if (!(await sleep(1200, t))) return;
      await playTo(total, t);
    }
  }

  async function runTry(f: Extract<Flow, { type: 'try' }>, scene: SceneRun, t: number) {
    setLine(f.line);
    setPosition(0, false);
    baseCaption = f.prompt;
    maxPly = f.setup;
    if (motion()) {
      await stepTo(f.setup, t, true);
      if (!alive(t)) return;
    } else {
      setPosition(f.setup, false);
    }
    const expected = line.plies[f.expect - 1];
    const legal = data.legal[scene.id];
    const total = line.plies.length;

    const finish = async (from: string, to: string) => {
      if (from === expected.from && to === expected.to) {
        const t2 = takeOver();
        awaiting = null;
        board.disableInput();
        board.setHighlights({ hint: null });
        actions.replaceChildren();
        maxPly = total;
        await stepTo(f.expect, t2);
        if (!alive(t2)) return;
        if (!(await sleep(motion() ? 1100 : 0, t2))) return;
        await stepTo(total, t2);
        sound.play('good');
        return;
      }
      // A legal move, but not the one in this story
      const t2 = takeOver();
      board.disableInput();
      showCaption('That is a legal move, but this story needs the glowing pawn. Try that one.');
      if (motion()) await board.peek(from, to);
      if (!alive(t2)) return;
      awaiting?.show();
      showCaption(f.prompt);
    };

    const show = () => {
      // The hint goes first, so the glowing pawn is the square the keyboard lands on
      board.setHighlights({ hint: [expected.from, expected.to] });
      board.enableInput({ side: expected.color, legal, onMove: (from, to) => void finish(from, to) });
      showCaption(f.prompt);
      setActions([{ text: f.showMe, primary: false, onClick: () => void finish(expected.from, expected.to) }]);
    };
    awaiting = {
      at: f.setup,
      show,
      hide: () => {
        board.disableInput();
        board.setHighlights({ hint: null });
        actions.replaceChildren();
      },
    };
    showPly(ply, false);
    show();
  }

  async function runChoose(f: Extract<Flow, { type: 'choose' }>, t: number) {
    setLine(f.base);
    setPosition(0, false);
    maxPly = f.setup;
    if (motion()) {
      await stepTo(f.setup, t, true);
      if (!alive(t)) return;
    } else {
      setPosition(f.setup, false);
    }
    const parent: Parent = {
      setup: f.setup,
      two: f.first.options.length === 2,
      restart: async () => {
        const t2 = takeOver();
        actions.replaceChildren();
        // Walk back along the line that is on the board, then switch to the shared start
        await stepTo(f.setup, t2, true);
        if (!alive(t2)) return;
        setLine(f.base);
        showChoice(f.first, f.setup, parent);
      },
    };
    showChoice(f.first, f.setup, parent);
  }

  async function showTitleCard(scene: SceneRun) {
    $('[data-card-k]').textContent = scene.kicker;
    $('[data-card-t]').textContent = scene.title;
    card.classList.remove('show');
    void card.offsetWidth; // restart the animation
    card.classList.add('show');
    await wait(1250);
  }

  async function loadScene(i: number, replay = false) {
    if (i < 0 || i >= data.scenes.length) return;
    const t = takeOver();
    const scene = data.scenes[i];
    sceneIdx = i;
    awaiting = null;
    board.disableInput();
    board.setHighlights({ hint: null });
    actions.replaceChildren();
    nowKicker.textContent = scene.kicker;
    nowTitle.textContent = scene.title;
    buildLedger(scene);

    // Get the board ready under the title card so the cut feels clean
    const f = scene.flow;
    if (f.type === 'replay') {
      setLine(f.line);
      setPosition(f.from === 'end' ? line.plies.length : 0, false);
    } else {
      setLine(f.type === 'try' ? f.line : f.base);
      setPosition(0, false);
    }
    showCaption('');
    if (motion() && !replay) {
      await showTitleCard(scene);
      if (!alive(t)) return;
    }

    if (f.type === 'replay') await runReplay(f, t);
    else if (f.type === 'try') await runTry(f, scene, t);
    else await runChoose(f, t);
  }

  // ---------------------------------------------------------------- which scene is on screen
  let active = -1;
  let filmVisible = false;
  let pending = 0;
  let ticking = false;

  function pickActive() {
    const stage = $('[data-stage]');
    const vh = window.innerHeight;
    // On a phone the board is pinned at the top, so the reading line sits below it
    const top = stacked.matches ? stage.getBoundingClientRect().bottom : 0;
    const reading = top + (vh - top) * (stacked.matches ? 0.3 : 0.5);
    let best = 0;
    let bestDistance = Infinity;
    sceneEls.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = r.top <= reading && r.bottom >= reading ? 0 : Math.min(Math.abs(r.top - reading), Math.abs(r.bottom - reading));
      if (d < bestDistance) {
        best = i;
        bestDistance = d;
      }
    });
    return best;
  }

  function update() {
    ticking = false;
    if (!filmVisible) return;
    const next = pickActive();
    if (next === active) return;
    active = next;
    sceneEls.forEach((s, i) => s.classList.toggle('is-active', i === active));
    clearTimeout(pending);
    pending = window.setTimeout(() => void loadScene(active), 220);
  }

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  new IntersectionObserver(
    (entries) => {
      filmVisible = entries.some((e) => e.isIntersecting);
      if (filmVisible) {
        active = -1;
        update();
      }
    },
    { rootMargin: '-15% 0px -15% 0px' },
  ).observe(root);

  // Reduced motion can change while the page is open
  reduce.addEventListener('change', () => {
    if (reduce.matches) takeOver();
  });

  // Until the first scene loads, show something sensible
  const first = data.scenes[0];
  setLine(first.flow.type === 'replay' ? first.flow.line : 'immortal');
  setPosition(first.flow.type === 'replay' && first.flow.from === 'end' ? line.plies.length : 0, false);
  buildLedger(first);
  nowKicker.textContent = first.kicker;
  nowTitle.textContent = first.title;
  showCaption('');
}
