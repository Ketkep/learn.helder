// Progress through the daily editions, kept in this browser only (localStorage). No account, nothing
// leaves the device. If storage is blocked (some private windows), everything still works for the
// visit, and the page says that progress will not be kept.

const KEY = 'learndle:v1';

export interface Answer {
  /** The choice picked last. */
  choice: string;
  /** How many choices were tried. */
  tries: number;
  /** Every choice tried, so wrong ones stay marked after a reload. */
  tried?: string[];
  /** For questions with a right answer: whether it has been found, and whether on the first go. */
  correct?: boolean;
  firstTry?: boolean;
}

export interface Progress {
  started: string;
  updated: string;
  /** The furthest step that is open, counted from 0. */
  reached: number;
  /** Things done in the experiments, by id. */
  goals: string[];
  answers: Record<string, Answer>;
  /** How many steps the edition has, and the name of the one the reader is on (for the home page). */
  total?: number;
  at?: string;
  /** When the last step was reached, and on which day (publication time zone). */
  completedAt?: string;
  completedDay?: string;
}

interface Saved {
  v: 1;
  editions: Record<string, Progress>;
}

let memory: Saved = { v: 1, editions: {} };
let works: boolean | undefined;

function read(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    works = true;
    if (!raw) return memory;
    const data = JSON.parse(raw) as Saved;
    if (data && data.v === 1 && data.editions && typeof data.editions === 'object') memory = data;
  } catch {
    works = false;
  }
  return memory;
}

function write(data: Saved) {
  memory = data;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    works = true;
  } catch {
    works = false;
  }
}

/** False when the browser refuses to keep anything (progress then lasts until the tab closes). */
export function storageWorks(): boolean {
  if (works === undefined) read();
  return works !== false;
}

export function allProgress(): Record<string, Progress> {
  return read().editions;
}

export function progressOf(number: number): Progress | undefined {
  return read().editions[number];
}

export function saveProgress(number: number, progress: Progress) {
  const data = read();
  write({ ...data, editions: { ...data.editions, [number]: { ...progress, updated: new Date().toISOString() } } });
}

export function freshProgress(): Progress {
  const now = new Date().toISOString();
  return { started: now, updated: now, reached: 0, goals: [], answers: {} };
}

/** Forget one edition, for "start again". */
export function clearProgress(number: number) {
  const data = read();
  const editions = { ...data.editions };
  delete editions[number];
  write({ ...data, editions });
}
