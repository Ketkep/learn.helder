// The home page in the browser: picks the discovery for today (Amsterdam time), shows whether the
// reader has started or finished it, the streak, and when the next one opens. When midnight passes
// while the page is open, it says so in a banner instead of swapping the page under the reader.

import { addDays, dayAt, formatDay, formatWait, nextDayStart } from '../../lib/daily';
import { pickToday, streakOf } from '../../lib/schedule';
import { allProgress, type Progress } from './store';

interface Card {
  number: number;
  date: string;
  dateLabel: string;
  title: string;
  question: string;
  teaser: string;
  minutes: number;
  subject: string;
  accent: string;
  ink: string;
  path: string;
  cover: string;
}

const root = document.querySelector<HTMLElement>('[data-today]');
if (root) start(root);

function start(root: HTMLElement) {
  const cards: Card[] = JSON.parse(root.dataset.cards ?? '[]');
  const set = (sel: string, text: string) => {
    const el = root.querySelector(sel);
    if (el) el.textContent = text;
  };
  let shownDay = dayAt(Date.now());

  function statusOf(c: Card, p: Progress | undefined, day: string) {
    if (p?.completedDay) {
      return {
        text: p.completedDay === c.date ? `Done on ${formatDay(p.completedDay)}` : `Done, on ${formatDay(p.completedDay)}`,
        cta: 'See your result',
        href: `${c.path}#step-done`,
        state: 'done',
      };
    }
    if (p && p.reached > 0) {
      const of = p.total ? ` of ${p.total}` : '';
      return { text: `In progress: step ${p.reached + 1}${of}${p.at ? `, ${p.at}` : ''}`, cta: 'Continue', href: c.path, state: 'started' };
    }
    if (c.date > day) return { text: `Opens on ${formatDay(c.date)}`, cta: 'See when it opens', href: c.path, state: 'soon' };
    return { text: 'Not started yet', cta: 'Start the discovery', href: c.path, state: 'new' };
  }

  function render() {
    const now = Date.now();
    const day = dayAt(now);
    shownDay = day;
    const progress = allProgress();
    const pick = pickToday(cards, day);
    const hero = root.querySelector<HTMLElement>('[data-hero]');
    const banner = root.querySelector<HTMLElement>('[data-banner]');
    const card = pick.kind === 'today' ? pick.edition : pick.kind === 'gap' ? pick.latest : pick.kind === 'soon' ? pick.next : undefined;

    if (hero && card) {
      hero.style.setProperty('--ed', card.accent);
      hero.style.setProperty('--ed-ink', card.ink);
      set('[data-hero-label]', pick.kind === 'today' ? 'Today’s discovery' : pick.kind === 'gap' ? 'The most recent discovery' : 'The first discovery');
      set('[data-hero-number]', String(card.number));
      set('[data-hero-date]', card.dateLabel);
      set('[data-hero-title]', card.title);
      set('[data-hero-question]', card.question);
      set('[data-hero-teaser]', card.teaser);
      set('[data-hero-minutes]', String(card.minutes));
      set('[data-hero-subject]', card.subject);
      const img = hero.querySelector<HTMLImageElement>('[data-hero-cover]');
      if (img && img.getAttribute('src') !== card.cover) img.src = card.cover;
      const s = statusOf(card, progress[card.number], day);
      const link = hero.querySelector<HTMLAnchorElement>('[data-hero-link]');
      if (link) link.href = s.href;
      set('[data-hero-cta]', s.cta);
      set('[data-hero-status]', s.text);
      hero.dataset.state = s.state;
    }

    // Say it plainly when there is nothing new today, instead of passing off an old edition as new
    if (banner) {
      if (pick.kind === 'gap') {
        banner.hidden = false;
        banner.textContent = `There is no new discovery today. Below is the most recent one, from ${formatDay(pick.latest.date)}.${pick.next ? ` The next one opens on ${formatDay(pick.next.date)}.` : ''}`;
      } else if (pick.kind === 'soon') {
        banner.hidden = false;
        banner.textContent = `The first discovery opens on ${formatDay(pick.next.date)}.`;
      } else {
        banner.hidden = true;
      }
    }

    const s = streakOf(cards, progress, day);
    const streak = root.querySelector('[data-streak]');
    if (streak) {
      streak.innerHTML = `<strong>${s.current}</strong> ${s.current === 1 ? 'day' : 'days'} in a row<span class="today-sep"></span><strong>${s.finished}</strong> of ${s.open} discoveries finished`;
    }

    const next = root.querySelector('[data-next]');
    const upcoming = cards.find((c) => c.date > day);
    if (next) {
      if (upcoming && upcoming.date === addDays(day, 1)) next.textContent = `The next discovery opens at midnight, Amsterdam time: in ${formatWait(nextDayStart(now).getTime() - now)}.`;
      else if (upcoming) next.textContent = `The next discovery opens on ${formatDay(upcoming.date)}.`;
      else next.textContent = 'The next discovery is not scheduled yet.';
    }

    // Earlier discoveries: every open edition before the one in the big card, newest first
    const current = card?.number ?? 0;
    let shown = 0;
    root.querySelectorAll<HTMLElement>('[data-arch]').forEach((li) => {
      const c = cards.find((x) => x.number === Number(li.dataset.arch));
      const visible = !!c && c.date <= day && c.number !== current && shown < 6;
      li.hidden = !visible;
      if (!c || !visible) return;
      shown++;
      const st = statusOf(c, progress[c.number], day);
      const tag = li.querySelector('[data-arch-status]');
      if (tag) tag.textContent = st.state === 'new' ? 'Not started' : st.text;
      li.dataset.state = st.state;
    });
    const empty = root.querySelector<HTMLElement>('[data-recent-empty]');
    if (empty) empty.hidden = shown > 0;
  }

  render();

  // The day can change while the page is open. Tell the reader, and let them choose when to move on.
  const check = () => {
    const day = dayAt(Date.now());
    const banner = root.querySelector<HTMLElement>('[data-banner]');
    if (day !== shownDay && banner) {
      const pick = pickToday(cards, day);
      if (pick.kind === 'today') {
        banner.hidden = false;
        banner.innerHTML = `A new day has started: discovery No. ${pick.edition.number} is out. <a href="/">Show it</a>`;
        return;
      }
    }
    const next = root.querySelector('[data-next]');
    const upcoming = cards.find((c) => c.date > day);
    if (next && upcoming && upcoming.date === addDays(day, 1)) {
      const now = Date.now();
      next.textContent = `The next discovery opens at midnight, Amsterdam time: in ${formatWait(nextDayStart(now).getTime() - now)}.`;
    }
  };
  window.setInterval(check, 30000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Progress may have changed in another tab
      if (dayAt(Date.now()) === shownDay) render();
      else check();
    }
  });
  window.addEventListener('pageshow', (e) => {
    if ((e as PageTransitionEvent).persisted && dayAt(Date.now()) === shownDay) render();
  });
}
