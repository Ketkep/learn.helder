// The search engine page: four drawers. This file starts each one.

import { fillRange, q } from '../util';
import { crawlOrder, crawlState, crawlStatus, graphSvg, lookup, pageRank, pages, scores } from '../../lib/search';

const root = document.querySelector<HTMLElement>('[data-search]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Drawer 1: follow the links
  const crawl = root.querySelector<HTMLElement>('[data-crawl-tool]');
  if (crawl) {
    let step = 0;
    const draw = () => {
      q(crawl, '[data-crawl-g]').innerHTML = graphSvg(crawlState(step));
      q(crawl, '[data-crawl-status]').textContent = crawlStatus(step);
    };
    q(crawl, '[data-crawl-step]').addEventListener('click', () => {
      step = Math.min(step + 1, crawlOrder().length);
      draw();
    });
    q(crawl, '[data-crawl-reset]').addEventListener('click', () => {
      step = 0;
      draw();
    });
  }

  // Drawer 2: the index cards
  const index = root.querySelector<HTMLElement>('[data-index-tool]');
  if (index) {
    const input = q<HTMLInputElement>(index, '[data-index-q]');
    const draw = () => {
      const r = lookup(input.value);
      const status = q(index, '[data-index-status]');
      if (!r.words.length) status.textContent = 'Type a word to look it up.';
      else if (!r.hits.length) status.textContent = `No page has ${r.words.join(' and ')}.`;
      else status.textContent = `Pages with ${r.words.join(' and ')}: ${r.hits.map((i) => pages[i].name).join(', ')}.`;
    };
    input.addEventListener('input', draw);
  }

  // Drawer 3: order by words
  const words = root.querySelector<HTMLElement>('[data-words-tool]');
  if (words) {
    const picks = words.querySelectorAll<HTMLElement>('[data-words-pick]');
    const rareBtn = q<HTMLElement>(words, '[data-words-rare]');
    let query = 'the tomatoes';
    let rare = true;
    const draw = () => {
      const rows = scores(query, rare).slice(0, 5);
      const top = rows[0].score || 1;
      q(words, '[data-words-list]').innerHTML = rows
        .map((r) => `<li><span class="nm">${pages[r.id].name}</span><span class="bar" style="width:${Math.round((r.score / top) * 100)}%"></span><span class="val">${r.score.toFixed(3)}</span></li>`)
        .join('');
      const best = rows[0].score ? `the order is ${rows.filter((r) => r.score).slice(0, 3).map((r) => pages[r.id].name).join(', ')}` : 'no page matches';
      q(words, '[data-words-status]').textContent = `For "${query}" ${rare ? 'with rare words weighed more' : 'counting every word the same'} ${best}.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        query = b.getAttribute('data-words-pick') || query;
        press(picks, b);
        draw();
      }),
    );
    rareBtn.addEventListener('click', () => {
      rare = !rare;
      rareBtn.setAttribute('aria-pressed', rare ? 'true' : 'false');
      draw();
    });
  }

  // Drawer 4: order by links
  const links = root.querySelector<HTMLElement>('[data-links-tool]');
  if (links) {
    const range = q<HTMLInputElement>(links, '[data-links-range]');
    const extraBtn = q<HTMLElement>(links, '[data-links-extra]');
    let extra = false;
    const draw = () => {
      fillRange(range);
      const rounds = Number(range.value);
      const r = pageRank(rounds, extra);
      const order = pages.map((p) => p.id).sort((a, b) => r[b] - r[a]);
      const pc = (v: number) => `${(v * 100).toFixed(1)} per cent`;
      q(links, '[data-links-out]').textContent = String(rounds);
      q(links, '[data-links-g]').innerHTML = graphSvg(undefined, r, extra);
      const round = `${rounds} round${rounds === 1 ? '' : 's'}`;
      const gain = extra ? ` With the new link, Compost goes from ${pc(pageRank(rounds, false)[2])} to ${pc(r[2])}.` : '';
      q(links, '[data-links-status]').textContent = rounds
        ? `After ${round} the highest rank is ${pages[order[0]].name} (${pc(r[order[0]])}) and the lowest is ${pages[order[7]].name} (${pc(r[order[7]])}). The ranks add up to 100 per cent.${gain}`
        : `Every page starts with the same rank, ${pc(r[0])}. Slide the rounds to share the ranks out along the links.`;
      const body = q(links, 'tbody');
      body.innerHTML = order.map((id) => `<tr><th scope="row">${pages[id].name}</th><td>${pc(r[id])}</td></tr>`).join('');
    };
    range.addEventListener('input', draw);
    extraBtn.addEventListener('click', () => {
      extra = !extra;
      extraBtn.setAttribute('aria-pressed', extra ? 'true' : 'false');
      draw();
    });
  }
}
