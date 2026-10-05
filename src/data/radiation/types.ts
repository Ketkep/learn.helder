// The shape of everything the "Radiation therapy" page says.
// English (en.ts) and Dutch (nl.ts) both fill in this shape, so TypeScript flags a line that is
// missing in either one. Numbers, ids and anything that is the same in every language live in
// index.ts instead.
//
// Some lines are templates. {name} slots are filled in by the page (see fill() in
// src/scripts/radiation/ui.ts), and a pair like [one, many] is picked by the count.

import type { Lang, Plural } from '../../lib/text';

export type { Lang };

export interface SceneText {
  kicker: string;
  title: string;
  paras: string[];
  extra?: { label: string; text: string };
  /** The button on this scene's card that leads to the next one. */
  go: string;
}

export interface Way {
  id: 'linac' | 'mr' | 'inside';
  label: string;
  title: string;
  points: string[];
}

export interface PhaseText {
  /** Finishes the sentence "while the cell ...". */
  name: string;
  /** How much damage a shot does in this phase, in words. */
  words: string;
}

export interface RayKind {
  id: 'alpha' | 'beta' | 'gamma';
  label: string;
  use: string;
}

export interface Wall {
  id: 'paper' | 'metal' | 'concrete';
  /** On the button. */
  label: string;
  /** In a sentence: "stopped by ...". */
  name: string;
}

export interface Area {
  id: 'head' | 'chest' | 'belly';
  label: string;
  complaints: string;
}

export interface Source {
  label: string;
  url: string;
  for: string;
}

export interface Copy {
  page: {
    intro: string;
    sourcesNote: string;
  };
  scenes: SceneText[];
  ways: Way[];
  phases: PhaseText[];
  rayKinds: RayKind[];
  walls: Wall[];
  areas: Area[];
  everyone: string;
  lastSession: string;
  takeaways: string[];
  sources: Source[];

  /** The bar at the top and the controls shared by every scene. */
  hud: {
    across: string;
    routeLabel: string;
    /** {i} and {title} */
    goTo: string;
    /** The view button, as [short part, long part]. On a phone only the short part shows. */
    plain: [string, string];
    zoomView: [string, string];
    soundOn: string;
    soundOff: string;
    /** {i}, {n} and {title} */
    sceneOf: string;
    hint: string;
    readMore: string;
    showLess: string;
    /** The mark in a number like 2.5 m. */
    decimal: '.' | ',';
  };

  room: { art: string; group: string };

  body: {
    art: string;
    front: string;
    back: string;
    model: string;
    kindGroup: string;
    photon: string;
    proton: string;
    add: string;
    reset: string;
    angle: string;
    /** {n} */
    degrees: Plural;
    energy: string;
    matched: string;
    tumourDose: string;
    hottest: string;
    reached: string;
    /** {n} */
    missed: string;
    protonOne: string;
    protonMany: string;
    /** {n} */
    photonOne: string;
    photonMany: string;
  };

  tumour: {
    art: string;
    immune: string;
    weak: string;
    medium: string;
    strong: string;
    run: string;
    pause: string;
    restart: string;
    /** {n} is the day and {cells} the number of faulty cells. */
    day: string;
    /** {n} */
    spread: string;
    cleared: string;
    overrun: string;
    grows: string;
    shrinks: string;
  };

  cell: {
    art: string;
    cycle: string;
    play: string;
    pause: string;
    fire: string;
    logLabel: string;
    note: string;
    /** The words in the list of shots, from most damage to least. */
    levels: { most: string; lot: string; some: string; little: string };
    /** {label}, {name} and {words} */
    fired: string;
    start: string;
  };

  dna: {
    art: string;
    kindGroup: string;
    healthy: string;
    tumour: string;
    radiate: string;
    reset: string;
    breaks: string;
    /** {n} and {limit} */
    breaksOf: string;
    startHealthy: string;
    startTumour: string;
    dead: string;
    /** {n} */
    broken: Plural;
    /** {n} */
    mended: string;
    /** {n} are still open, {m} are mended */
    left: Plural;
  };

  rays: {
    art: string;
    scale: string;
    kindGroup: string;
    wallGroup: string;
    send: string;
    start: string;
    /** {wall} */
    stopped: string;
    weaker: string;
    through: string;
  };

  weeks: {
    art: string;
    sessions: string;
    /** {n} and {dose} */
    plan: Plural;
    tumourLeft: string;
    healthyLeft: string;
    start: string;
    reset: string;
    pause: string;
    again: string;
    /** {total}, {n} */
    ready: Plural;
    /** {d}, {t} and {h} */
    day: string;
    /** {d}, {low}, {hp} and {verdict} */
    result: string;
    verdictGone: string;
    verdictCost: string;
    /** {n} */
    verdictLeft: Plural;
  };

  person: {
    art: string;
    group: string;
    all: string;
    last: string;
  };
}

/** What the scripts need. It travels to the page as JSON on the root element. */
export type Ui = Pick<Copy, 'hud' | 'body' | 'tumour' | 'cell' | 'dna' | 'rays' | 'weeks' | 'person' | 'rayKinds' | 'walls' | 'lastSession'>;

export interface Scene extends SceneText {
  id: 'room' | 'body' | 'tumour' | 'cell' | 'dna' | 'rays' | 'weeks' | 'person';
  /** How wide the picture is in real life, in metres. The scale bar and the number at the top use it. */
  size: number;
  /** The jump to the next scene: how much the picture grows or shrinks, and which way. */
  zoom?: { ratio: number; dir: 'in' | 'out' };
}

export interface Phase extends PhaseText {
  id: 'g1' | 's' | 'g2' | 'm';
  label: string;
  from: number;
  to: number;
  damage: number;
}
