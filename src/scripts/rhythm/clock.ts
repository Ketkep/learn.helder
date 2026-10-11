// A small looping clock for the drum machine. Only one board plays at a time, and nothing starts by itself.

export interface Hit {
  /** Milliseconds after the start of the cycle. */
  at: number;
  fn: () => void;
}

let timer = 0;
let onStop: (() => void) | null = null;

export function stopLoop() {
  window.clearInterval(timer);
  timer = 0;
  const done = onStop;
  onStop = null;
  done?.();
}

export const isPlaying = () => timer !== 0;

/** Plays the hits again and again. `stopped` is called when the loop ends, so a board can reset its button and lights. */
export function startLoop(cycleMs: number, hits: Hit[], stopped: () => void) {
  stopLoop();
  const sorted = [...hits].sort((a, b) => a.at - b.at);
  if (sorted.length === 0) return;
  onStop = stopped;
  const t0 = performance.now();
  let cycle = 0;
  let idx = 0;
  const tick = () => {
    const now = performance.now() - t0;
    for (;;) {
      const hit = sorted[idx];
      if (cycle * cycleMs + hit.at > now) break;
      hit.fn();
      idx++;
      if (idx >= sorted.length) {
        idx = 0;
        cycle++;
      }
    }
  };
  tick();
  timer = window.setInterval(tick, 8);
}

/** Wires a play button to a loop: pressing it starts, and pressing it again stops. */
export function playButton(button: HTMLButtonElement, start: () => void) {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') stopLoop();
    else start();
  });
}

export function setPlaying(button: HTMLButtonElement, on: boolean) {
  button.setAttribute('aria-pressed', String(on));
  button.textContent = on ? 'Stop' : 'Play';
}
