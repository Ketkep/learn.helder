// Call 3: asking a rover on Mars questions when every message takes minutes.

import { clear, fillRange, q } from '../util';
import { fmtTime, seconds } from '../../lib/light';
import { send } from './beam';

export function initTalk(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-talk-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-talk-range]');
  const out = q<HTMLOutputElement>(tool, '[data-talk-out]');
  const sum = q<HTMLElement>(tool, '[data-talk-sum]');
  const log = q<HTMLElement>(tool, '[data-talk-log]');
  const status = q<HTMLElement>(tool, '[data-talk-status]');

  const km = () => Number(range.value) * 1e6;
  const oneWay = () => seconds(km());
  function draw() {
    fillRange(range);
    out.textContent = `${range.value} million km`;
    sum.textContent = `At ${range.value} million km, a message takes ${fmtTime(oneWay())} one way.`;
    clear(log);
  }
  range.addEventListener('input', draw);
  draw();

  const line = (text: string) => {
    const li = document.createElement('li');
    li.textContent = text;
    log.appendChild(li);
  };

  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-talk-ask]')) {
    b.addEventListener('click', () => {
      const t = oneWay();
      const kind = b.dataset.talkAsk!;
      clear(log);
      let legs = 2;
      let note: string;
      if (kind === '1') {
        line(`At 0: the question is sent.`);
        line(`At ${fmtTime(t)}: it reaches Mars.`);
        line(`At ${fmtTime(2 * t)}: the answer is back.`);
        note = `One question and its answer take ${fmtTime(2 * t)}, with a rover that answers at once.`;
      } else if (kind === '5') {
        legs = 10;
        for (let i = 0; i < 5; i++) line(`Question ${i + 1}: sent at ${i === 0 ? '0' : fmtTime(2 * t * i)}, answer back at ${fmtTime(2 * t * (i + 1))}.`);
        note = `Five questions, each sent after the last answer, take ${fmtTime(10 * t)}.`;
      } else {
        line('At 0: all five questions are sent in one message.');
        line(`At ${fmtTime(t)}: the message reaches Mars.`);
        line(`At ${fmtTime(2 * t)}: all five answers are back.`);
        note = `Five questions in one message take ${fmtTime(2 * t)}. That is why mission teams send a plan for a whole day at once.`;
      }
      send({ name: 'A rover on Mars', km: km(), legs, done: () => (status.textContent = note) });
    });
  }
}
