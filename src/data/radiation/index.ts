// The "Radiation therapy" page in one place: pick a language and get the words, plus the numbers
// that are the same in every language.
// The page is a zoom: you scroll and the picture zooms from a treatment room down to a single
// strand of DNA, then back out to the person. Each scene has one tool to try.
// This page explains the idea. It is not medical advice, and the tools are simple models.

import { en } from './en';
import { nl } from './nl';
import type { Copy, Lang, Phase, Scene, Ui } from './types';

export type { Lang, Phase, Scene, Source, Ui } from './types';
export { rayResults } from './results';

/** The numbers behind each scene, in order. The words come from the language files. */
const sceneBase: Pick<Scene, 'id' | 'size' | 'zoom'>[] = [
  { id: 'room', size: 4, zoom: { ratio: 7, dir: 'in' } },
  { id: 'body', size: 0.5, zoom: { ratio: 8, dir: 'in' } },
  { id: 'tumour', size: 0.0005, zoom: { ratio: 8, dir: 'in' } },
  { id: 'cell', size: 0.00004, zoom: { ratio: 8, dir: 'in' } },
  { id: 'dna', size: 0.00000002, zoom: { ratio: 8, dir: 'in' } },
  { id: 'rays', size: 0.000000001, zoom: { ratio: 30, dir: 'out' } },
  { id: 'weeks', size: 0.0005, zoom: { ratio: 30, dir: 'out' } },
  { id: 'person', size: 2 },
];

/** The cell cycle: where each phase starts and ends (0 to 1), and how much damage a shot does in it. */
const phaseBase: Omit<Phase, 'name' | 'words'>[] = [
  { id: 'g1', label: 'G1', from: 0, to: 0.4, damage: 0.45 },
  { id: 's', label: 'S', from: 0.4, to: 0.72, damage: 0.28 },
  { id: 'g2', label: 'G2', from: 0.72, to: 0.88, damage: 0.75 },
  { id: 'm', label: 'M', from: 0.88, to: 1, damage: 1 },
];

const copies: Record<Lang, Copy> = { en, nl };

/** The words of the page in one language, joined with the numbers. */
export function getRadiation(lang: Lang) {
  const copy = copies[lang];
  const scenes: Scene[] = sceneBase.map((base, i) => ({ ...base, ...copy.scenes[i] }));
  const phases: Phase[] = phaseBase.map((base, i) => ({ ...base, ...copy.phases[i] }));
  const ui: Ui = {
    hud: copy.hud,
    body: copy.body,
    tumour: copy.tumour,
    cell: copy.cell,
    dna: copy.dna,
    rays: copy.rays,
    weeks: copy.weeks,
    person: copy.person,
    rayKinds: copy.rayKinds,
    walls: copy.walls,
    lastSession: copy.lastSession,
  };
  return { ...copy, scenes, phases, ui };
}

export type Radiation = ReturnType<typeof getRadiation>;
