// The languages page: four cards. This file starts each one.

import * as sound from '../sound';
import { q } from '../util';
import { averageSimilarity, choices, entries, joins, langs, loans, pairSimilarity, shifts, treeStatus, treeSvg } from '../../lib/tongues';

const root = document.querySelector<HTMLElement>('[data-tongues]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Card 1: the same word five times
  const match = root.querySelector<HTMLElement>('[data-match-tool]');
  if (match) {
    const picks = match.querySelectorAll<HTMLElement>('[data-match-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const e = entries[Number(b.getAttribute('data-match-pick'))];
        press(picks, b);
        q(match, '[data-match-bars]').innerHTML = langs
          .map((l) => `<li><span class="nm">${l.name}</span><span class="word">${e.words[l.id]}</span><span class="track"><span class="fill" style="width:${Math.max(1, Math.round(pairSimilarity(e, 'en', l.id) * 100))}%"></span></span></li>`)
          .join('');
        const a = (id: string) => Math.round(averageSimilarity('en', id) * 100);
        q(match, '[data-match-status]').textContent = `"${e.meaning}": the bars show how alike each word is to the English one. Over all twelve words, Dutch is ${a('nl')} per cent like English, German ${a('de')}, French ${a('fr')} and Spanish ${a('es')}.`;
      }),
    );
  }

  // Card 2: the tree
  const tree = root.querySelector<HTMLElement>('[data-tree-tool]');
  if (tree) {
    let step = 0;
    const draw = () => {
      q(tree, '[data-tree-g]').innerHTML = treeSvg(step);
      q(tree, '[data-tree-status]').textContent = treeStatus(step);
    };
    q(tree, '[data-tree-step]').addEventListener('click', () => {
      step = Math.min(step + 1, joins().length);
      sound.play('tick', 0.4);
      draw();
    });
    q(tree, '[data-tree-reset]').addEventListener('click', () => {
      step = 0;
      draw();
    });
    draw();
  }

  // Card 3: the sound shift
  const shift = root.querySelector<HTMLElement>('[data-shift-tool]');
  if (shift) {
    const picks = shift.querySelectorAll<HTMLElement>('[data-shift-pick]');
    let i = 2;
    const status = q<HTMLElement>(shift, '[data-shift-status]');
    const sound1 = (c: string) => (c === 'c' ? 'k' : c);
    const intro = () => {
      const s = shifts[i];
      status.textContent = `Latin ${s.latin} starts with the sound of ${sound1(s.first)}. Press apply the shift to see what the rule says.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        i = Number(b.getAttribute('data-shift-pick'));
        press(picks, b);
        intro();
      }),
    );
    q(shift, '[data-shift-apply]').addEventListener('click', () => {
      const s = shifts[i];
      status.textContent = `Latin ${s.latin} starts with the sound of ${sound1(s.first)}. The rule: ${s.rule}. So the Germanic form should start with ${s.expect}. The real words are English ${s.english}, Dutch ${s.dutch} and German ${s.german}.`;
      sound.play('pop', 0.4);
    });
    intro();
  }

  // Card 4: loanwords
  const loan = root.querySelector<HTMLElement>('[data-loans-tool]');
  if (loan) {
    let i = 0;
    let answered = false;
    const box = q<HTMLElement>(loan, '[data-loans-choices]');
    const status = q<HTMLElement>(loan, '[data-loans-status]');
    const show = () => {
      const l = loans[i];
      answered = false;
      q(loan, '[data-loans-word]').textContent = l.dutch;
      q(loan, '[data-loans-meaning]').textContent = `means: ${l.meaning}`;
      box.innerHTML = choices(i).map((c) => `<button type="button" class="pick" aria-pressed="false" data-loans-choice="${c}">${c}</button>`).join('');
      status.textContent = `Which English word came from the Dutch word ${l.dutch}?`;
      box.querySelectorAll<HTMLElement>('[data-loans-choice]').forEach((b) =>
        b.addEventListener('click', () => {
          if (answered) return;
          const pickWord = b.getAttribute('data-loans-choice');
          press(box.querySelectorAll<HTMLElement>('[data-loans-choice]'), b);
          if (pickWord === l.english) {
            answered = true;
            status.textContent = `Yes. English ${l.english} comes from Dutch ${l.dutch}.`;
            sound.play('good', 0.5);
          } else {
            status.textContent = `Not ${pickWord}. Try another word.`;
            sound.play('thud', 0.4);
          }
        }),
      );
    };
    q(loan, '[data-loans-next]').addEventListener('click', () => {
      i = (i + 1) % loans.length;
      show();
    });
    show();
  }
}
