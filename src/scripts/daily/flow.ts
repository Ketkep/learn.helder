// A daily edition in the browser: opens the steps one by one, keeps the reader's answers and goals,
// comes back to the same place after a reload, and fills in the result at the end.
//
// The page never changes under the reader: an edition stays the same edition at its own address, also
// when midnight passes while it is open. Only the home page moves on to the new day.

import { addDays, DAILY, dayAt, formatDay, formatWait, nextDayStart } from '../../lib/daily';
import { streakOf } from '../../lib/schedule';
import { allProgress, freshProgress, progressOf, saveProgress, storageWorks, type Progress } from './store';
import { reducedMotion } from '../util';

interface Slot {
  number: number;
  date: string;
  title: string;
  path: string;
}

const root = document.querySelector<HTMLElement>('[data-edition]');
if (root) start(root);

function start(root: HTMLElement) {
  const number = Number(root.dataset.number);
  const date = root.dataset.date ?? '';
  const schedule: Slot[] = JSON.parse(root.dataset.schedule ?? '[]');
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const rail = [...root.querySelectorAll<HTMLElement>('[data-rail]')];
  const today = dayAt(Date.now());
  const early = date > today;
  const preview = early && new URLSearchParams(location.search).has('preview');
  // Practice runs of an edition that has not opened yet are not kept, so they cannot count
  const persist = !early;

  if (early && !preview) {
    gate(root, number, date);
    return;
  }

  const previewNote = root.querySelector<HTMLElement>('[data-preview-note]');
  if (preview && previewNote) {
    previewNote.hidden = false;
    previewNote.textContent = `Preview. This discovery opens for everyone on ${formatDay(date)}. Nothing you do here is saved.`;
  }
  const storageNote = root.querySelector<HTMLElement>('[data-storage-note]');
  if (persist && storageNote && !storageWorks()) storageNote.hidden = false;

  const saved = persist ? progressOf(number) : undefined;
  let p: Progress = saved ?? freshProgress();
  const labels = rail.map((li) => li.querySelector('.ed-rail-t')?.textContent ?? '');
  const save = () => {
    p.total = steps.length;
    p.at = labels[p.reached];
    if (persist) saveProgress(number, p);
  };

  const has = (need: string) => {
    if (need.startsWith('answered:')) return !!p.answers[need.slice(9)];
    if (need.startsWith('correct:')) return !!p.answers[need.slice(8)]?.correct;
    return p.goals.includes(need);
  };
  const needsOf = (step: HTMLElement) => (step.dataset.needs ?? '').split(' ').filter(Boolean);
  const indexOf = (el: Element) => Number(el.closest<HTMLElement>('[data-step]')?.dataset.index ?? 0);

  // ------------------------------------------------------------------ goals from the experiments
  root.addEventListener('learndle:goal', (e) => {
    const id = (e as CustomEvent<string>).detail;
    if (id && !p.goals.includes(id)) {
      p.goals = [...p.goals, id];
      save();
      render();
    }
  });

  // ------------------------------------------------------------------ questions
  const questions = [...root.querySelectorAll<HTMLElement>('[data-q]')];
  const verdict = (right: boolean) => (right ? '<strong class="q-verdict q-right">Right.</strong> ' : '<strong class="q-verdict q-wrong">Not quite.</strong> ');

  function showQuestion(q: HTMLElement, shown?: string) {
    const id = q.dataset.q ?? '';
    const kind = q.dataset.kind;
    const a = p.answers[id];
    const fb = q.querySelector<HTMLElement>('[data-feedback]');
    const locked = indexOf(q) < p.reached;
    if (kind === 'guess') {
      const input = q.querySelector<HTMLInputElement>('[data-guess-input]');
      const lock = q.querySelector<HTMLButtonElement>('[data-guess-lock]');
      if (a && input) {
        input.value = a.choice;
        q.querySelector('[data-guess-num]')!.textContent = a.choice;
      }
      if (input) input.disabled = locked;
      if (lock) lock.hidden = locked;
      if (fb) fb.innerHTML = a ? (q.querySelector('template[data-noted]')?.innerHTML ?? '') : '';
      return;
    }
    const pick = shown ?? a?.choice;
    q.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((b) => {
      const c = b.dataset.choice ?? '';
      b.setAttribute('aria-pressed', String(c === pick));
      if (kind === 'predict') {
        b.toggleAttribute('data-locked', locked);
        b.setAttribute('aria-disabled', String(locked && c !== pick));
        return;
      }
      const tried = a?.tried?.includes(c);
      b.dataset.result = tried || c === pick ? (b.dataset.correct === 'true' ? 'right' : 'wrong') : '';
    });
    if (!fb) return;
    if (!pick) {
      fb.innerHTML = '';
      return;
    }
    if (kind === 'predict') {
      fb.innerHTML = q.querySelector('template[data-noted]')?.innerHTML ?? '';
      return;
    }
    const button = q.querySelector<HTMLElement>(`[data-choice="${pick}"]`);
    const right = button?.dataset.correct === 'true';
    const text = q.querySelector(`template[data-feedback-for="${pick}"]`)?.innerHTML ?? '';
    const again = !right && !a?.correct ? ' <span class="q-again">Try another answer.</span>' : '';
    fb.innerHTML = `<p>${verdict(right)}${text}${again}</p>`;
  }

  questions.forEach((q) => {
    const id = q.dataset.q ?? '';
    const kind = q.dataset.kind;
    if (kind === 'guess') {
      const input = q.querySelector<HTMLInputElement>('[data-guess-input]');
      const num = q.querySelector('[data-guess-num]');
      input?.addEventListener('input', () => {
        if (num) num.textContent = input.value;
      });
      q.querySelector('[data-guess-lock]')?.addEventListener('click', () => {
        if (!input || indexOf(q) < p.reached) return;
        p.answers[id] = { choice: input.value, tries: (p.answers[id]?.tries ?? 0) + 1 };
        save();
        showQuestion(q);
        render();
      });
      return;
    }
    q.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((b) =>
      b.addEventListener('click', () => {
        const c = b.dataset.choice ?? '';
        const right = b.dataset.correct === 'true';
        const a = p.answers[id];
        if (kind === 'predict') {
          if (indexOf(q) < p.reached) return; // a guess is final once the reader moves on
          p.answers[id] = { choice: c, tries: (a?.tries ?? 0) + 1 };
        } else if (!a?.correct) {
          const tries = (a?.tries ?? 0) + 1;
          const tried = [...new Set([...(a?.tried ?? []), c])];
          p.answers[id] = { choice: c, tries, tried, correct: right, firstTry: right ? tries === 1 : undefined };
        } else {
          // Already solved: the other choices can still be read, without changing the result
          showQuestion(q, c);
          return;
        }
        save();
        showQuestion(q);
        render();
      }),
    );
  });

  // ------------------------------------------------------------------ steps
  function render() {
    steps.forEach((s, i) => {
      s.hidden = i > p.reached;
      s.dataset.state = i < p.reached ? 'done' : i === p.reached ? 'current' : 'locked';
      s.querySelectorAll<HTMLElement>('[data-goal]').forEach((li) => {
        const ok = has(li.dataset.goal ?? '');
        li.toggleAttribute('data-done', ok);
        const state = li.querySelector('[data-todo-state]');
        if (state) state.textContent = ok ? 'done' : 'not done yet';
      });
      const next = s.querySelector<HTMLElement>('.ed-next');
      const button = s.querySelector<HTMLButtonElement>('[data-continue]');
      if (next && button) {
        const ready = needsOf(s).every(has);
        next.hidden = i < p.reached;
        button.setAttribute('aria-disabled', String(!ready));
        next.toggleAttribute('data-ready', ready);
      }
    });
    rail.forEach((li, i) => {
      const state = i < p.reached ? 'done' : i === p.reached ? 'current' : 'locked';
      li.dataset.state = state;
      const a = li.querySelector('a');
      if (!a) return;
      if (state === 'locked') {
        a.setAttribute('aria-disabled', 'true');
        a.tabIndex = -1;
      } else {
        a.removeAttribute('aria-disabled');
        a.removeAttribute('tabindex');
      }
      if (state === 'current') a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    reveals();
    if (steps[p.reached]?.dataset.step === 'done') done();
  }

  function go(i: number, smoothly: boolean) {
    const step = steps[i];
    if (!step) return;
    step.scrollIntoView({ block: 'start', behavior: smoothly && !reducedMotion() ? 'smooth' : 'auto' });
    step.querySelector<HTMLElement>('.ed-step-title')?.focus({ preventScroll: true });
  }

  steps.forEach((s, i) =>
    s.querySelector('[data-continue]')?.addEventListener('click', () => {
      const next = s.querySelector<HTMLElement>('.ed-next');
      if (!needsOf(s).every(has)) {
        // Say what is still missing, right next to the button
        next?.classList.remove('ed-nudge');
        void next?.offsetWidth;
        next?.classList.add('ed-nudge');
        return;
      }
      if (p.reached === i) {
        p.reached = i + 1;
        if (steps[i + 1]?.dataset.step === 'done' && !p.completedAt) {
          p.completedAt = new Date().toISOString();
          if (persist) p.completedDay = dayAt(Date.now());
        }
        save();
      }
      render();
      questions.forEach((q) => showQuestion(q));
      go(i + 1, true);
    }),
  );

  rail.forEach((li, i) =>
    li.querySelector('a')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (i <= p.reached) go(i, true);
    }),
  );

  // ------------------------------------------------------------------ coming back to the guess
  function reveals() {
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((r) => {
      const a = p.answers[r.dataset.reveal ?? ''];
      r.querySelectorAll<HTMLElement>('.reveal-case').forEach((c) => {
        if (c.dataset.html === undefined) c.dataset.html = c.innerHTML;
        let match = false;
        if (a && c.dataset.when) match = c.dataset.when.split(' ').includes(a.choice);
        else if (a && c.dataset.from !== undefined) match = Number(a.choice) >= Number(c.dataset.from) && Number(a.choice) <= Number(c.dataset.to);
        c.hidden = !match;
        if (match) c.innerHTML = (c.dataset.html ?? '').split('{guess}').join(a ? a.choice : '');
      });
    });
  }

  // ------------------------------------------------------------------ the end
  let shareText = '';
  let timer = 0;

  function done() {
    const lines: string[] = [];
    const marks: string[] = [];
    questions.forEach((q) => {
      const a = p.answers[q.dataset.q ?? ''];
      if (q.dataset.kind === 'predict' || q.dataset.kind === 'guess') {
        const right =
          q.dataset.kind === 'predict'
            ? a?.choice === q.dataset.right
            : !!a && Number(a.choice) >= Number(q.dataset.rightMin) && Number(a.choice) <= Number(q.dataset.rightMax);
        lines.push(right ? 'Your guess at the start was right.' : 'Your guess at the start was off, and now you know why.');
        marks.unshift(`Guess ${right ? '●' : '○'}`);
      }
    });
    const apply = questions.filter((q) => q.dataset.kind === 'apply');
    if (apply.length) {
      const first = apply.filter((q) => p.answers[q.dataset.q ?? '']?.firstTry).length;
      lines.push(`You answered ${first} of ${apply.length} new situations right on the first try.`);
      marks.push(`Use it ${apply.map((q) => (p.answers[q.dataset.q ?? '']?.firstTry ? '●' : '○')).join('')}`);
    }
    if (p.completedDay && p.completedDay !== date) lines.push(`You finished it on ${formatDay(p.completedDay)}, after its own day.`);
    if (preview) lines.push('This was a preview, so it is not saved.');

    const list = root.querySelector('[data-result-lines]');
    if (list) list.innerHTML = lines.map((l) => `<li>${l}</li>`).join('');

    shareText = `${DAILY.name} No. ${number} · ${formatDay(date, { weekday: false, short: true })}\n${marks.join('   ')}\n${DAILY.site}/daily/${number}/`;
    const pre = root.querySelector<HTMLElement>('[data-share-text]');
    if (pre) {
      pre.hidden = false;
      pre.textContent = shareText;
    }

    const now = Date.now();
    const day = dayAt(now);
    const s = streakOf(schedule, allProgress(), day);
    const streakLine = root.querySelector('[data-streak-line]');
    if (streakLine) {
      const late = p.completedDay && p.completedDay !== date ? ' This one was finished after its day, so it does not add to it.' : '';
      streakLine.textContent = preview ? '' : `Your streak: ${s.current} ${s.current === 1 ? 'day' : 'days'} in a row. You have finished ${s.finished} of ${s.open} discoveries so far.${late}`;
    }

    const nextLine = root.querySelector('[data-next-line]');
    if (nextLine) {
      const upcoming = schedule.find((e) => e.date > day);
      const current = [...schedule].reverse().find((e) => e.date <= day);
      let text = '';
      if (current && current.number !== number && current.date === day) {
        text = `Today’s discovery is <a href="${current.path}">No. ${current.number}: ${current.title}</a>. `;
      }
      if (upcoming && upcoming.date === addDays(day, 1)) {
        text += `The next discovery opens at midnight, Amsterdam time: in ${formatWait(nextDayStart(now).getTime() - now)}.`;
      } else if (upcoming) {
        text += `The next discovery opens on ${formatDay(upcoming.date)}.`;
      } else {
        text += 'The next discovery is not scheduled yet. Look again tomorrow.';
      }
      nextLine.innerHTML = text;
    }
    window.clearInterval(timer);
    timer = window.setInterval(done, 30000);
  }

  root.querySelector('[data-share]')?.addEventListener('click', async () => {
    const note = root.querySelector('[data-share-note]');
    const say = (t: string) => {
      if (note) note.textContent = t;
    };
    const touch = matchMedia('(pointer: coarse)').matches;
    if (touch && navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // The share sheet was closed: fall through to copying
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      say('Copied. Paste it wherever you like.');
    } catch {
      const pre = root.querySelector('[data-share-text]');
      if (pre) getSelection()?.selectAllChildren(pre);
      say('Select the text below and copy it.');
    }
  });

  root.querySelector('[data-again]')?.addEventListener('click', () => {
    // Starting again keeps the record of having finished it (and on which day)
    p = { ...freshProgress(), completedAt: p.completedAt, completedDay: p.completedDay };
    save();
    location.hash = '';
    location.reload();
  });

  // ------------------------------------------------------------------ start
  questions.forEach((q) => showQuestion(q));
  render();
  root.dataset.ready = '';

  // Coming back: go to the step the reader was on, and say so
  if (saved && p.reached > 0 && !location.hash) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const current = steps[p.reached];
    if (current && current.dataset.step !== 'done') {
      const w = current.querySelector<HTMLElement>('[data-welcome]');
      if (w) w.hidden = false;
    }
    requestAnimationFrame(() => go(p.reached, false));
  }
}

/** An edition before its day: say when it opens, and offer a reload when it does. */
function gate(root: HTMLElement, number: number, date: string) {
  root.querySelector<HTMLElement>('[data-steps]')!.hidden = true;
  root.querySelector<HTMLElement>('[data-rail-bar]')!.hidden = true;
  const box = root.querySelector<HTMLElement>('[data-gate]');
  const text = root.querySelector<HTMLElement>('[data-gate-text]');
  if (!box || !text) return;
  box.hidden = false;
  const tick = () => {
    const now = Date.now();
    const day = dayAt(now);
    if (day >= date) {
      text.innerHTML = `No. ${number} is open now. <a href="${location.pathname}">Start it</a>.`;
      return;
    }
    const soon = date === addDays(day, 1) ? ` That is in ${formatWait(nextDayStart(now).getTime() - now)}.` : '';
    text.textContent = `No. ${number} opens on ${formatDay(date)} at midnight, Amsterdam time.${soon}`;
  };
  tick();
  window.setInterval(tick, 30000);
}
