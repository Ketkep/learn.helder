// Maths and drawings for the Roman aqueduct page: the fall of a channel, the pressure in a siphon, the choice of crossing and the share on arches.
// The drawings are made here, so the same strings are used when the page is built and in the browser.

const f1 = (n: number) => Math.round(n * 10) / 10;

/** Whole fall of a channel, in metres, for a gradient in cm per km over a length in km. */
export function dropM(cmPerKm: number, km: number): number {
  return (cmPerKm / 100) * km;
}

/** "1 in 2,900": how many metres you go for each metre of fall. */
export function oneIn(cmPerKm: number): number {
  return Math.round(100000 / cmPerKm / 10) * 10;
}

export const NIMES = { km: 50, drop: 17, cmPerKm: 34 };

/** A side view of the channel, with the ground under it. The fall is drawn much bigger than life. */
export function slopeSvg(cmPerKm: number, km: number): string {
  const [x0, x1, y0] = [16, 284, 40];
  const drop = dropM(cmPerKm, km);
  const y1 = y0 + drop * 3;
  const ground = `M${x0} 118L${x0} 92Q70 70 110 96T190 84T${x1} 100L${x1} 118Z`;
  const line = `<line class="channel" x1="${x0}" y1="${y0}" x2="${x1}" y2="${f1(y1)}"/>`;
  const level = `<line class="level" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/>`;
  const marks = `<circle class="spring" cx="${x0}" cy="${y0}" r="5"/><circle class="town" cx="${x1}" cy="${f1(y1)}" r="5"/><text class="lab" x="${x0}" y="${y0 - 10}">spring</text><text class="lab" x="${x1}" y="${f1(y1 - 10)}" text-anchor="end">town</text>`;
  const fall = `<line class="fall" x1="${x1 + 3}" y1="${y0}" x2="${x1 + 3}" y2="${f1(y1)}"/>`;
  return `<path class="ground" d="${ground}"/>${level}${line}${fall}${marks}`;
}

/** Water in a siphon: down one side of a valley and up the other. */
export function siphonSvg(depthM: number, lossM: number): string {
  const [x0, x1, top] = [30, 270, 36];
  const k = 0.8;
  const bottom = Math.min(112, top + depthM * k * 0.6 + 8);
  const far = top + lossM * 3;
  const pipe = `<path class="pipe" d="M${x0} ${top + 8}L${x0 + 30} ${f1(bottom)}L${x1 - 30} ${f1(bottom)}L${x1} ${f1(far + 8)}"/>`;
  const tanks = `<rect class="tank" x="${x0 - 22}" y="${top - 14}" width="40" height="24" rx="3"/><rect class="tank" x="${x1 - 18}" y="${f1(far - 14)}" width="40" height="24" rx="3"/>`;
  const water = `<line class="head" x1="${x0 - 22}" y1="${top}" x2="${x1 + 22}" y2="${top}"/>`;
  return `${water}${pipe}${tanks}<text class="lab" x="${x0 - 22}" y="${top - 20}">top tank</text><text class="lab" x="${x1 + 22}" y="${f1(far - 20)}" text-anchor="end">far tank</text>`;
}

export const BAR_PER_M = 0.0981;
export const pressureBar = (depthM: number) => depthM * BAR_PER_M;

export interface Scene {
  id: string;
  name: string;
  picture: string;
  best: string;
  why: Record<string, string>;
}

export const methods: Record<string, string> = {
  contour: 'Follow the slope',
  tunnel: 'Tunnel through',
  arches: 'Carry it on arches',
  siphon: 'Use a siphon',
};

export const scenes: Scene[] = [
  {
    id: 'hillside',
    name: 'A hillside lies across the way, but the ground slopes the right way.',
    picture: 'hill',
    best: 'contour',
    why: {
      contour: 'Yes. Engineers followed the natural slope of the land wherever they could, burying the channel or cutting it into the hillside. That is cheap.',
      tunnel: 'It works, but a tunnel is costly. Where the hillside slopes the right way it is not needed.',
      arches: 'Arches cost a lot. They were used mainly for crossing valleys, and there is no valley here.',
      siphon: 'A siphon needs a pressure pipe made of costly lead or bronze. It is not needed on a slope that already runs the right way.',
    },
  },
  {
    id: 'valley',
    name: 'A wide valley, not very deep, and the water must stay on the same level.',
    picture: 'valley',
    best: 'arches',
    why: {
      contour: 'Going all the way round the valley would add many kilometres, and every kilometre must still slope down.',
      tunnel: 'A tunnel cannot cross open air.',
      arches: 'Yes. Arches carry an open channel across a valley, as at the Pont du Gard. It is costly, but the water stays in an open channel.',
      siphon: 'It can work, but a siphon takes a long pressure pipe of lead or bronze. For a shallow valley, an arched bridge was a common choice.',
    },
  },
  {
    id: 'gorge',
    name: 'A deep valley, much deeper than any arch could be built.',
    picture: 'gorge',
    best: 'siphon',
    why: {
      contour: 'The way round could be very long, and the channel must slope the whole way.',
      tunnel: 'A tunnel cannot cross open air.',
      arches: 'Very tall arcades are costly and hard to build. Siphons were used to avoid them.',
      siphon: 'Yes. Water ran down into the valley in lead pipes and up the other side, to a tank a little lower than the first. This is what the Gier aqueduct did for four valleys.',
    },
  },
  {
    id: 'ridge',
    name: 'A ridge stands in the way, higher than the water source.',
    picture: 'ridge',
    best: 'tunnel',
    why: {
      contour: 'A ridge higher than the channel cannot be gone round without a long detour.',
      tunnel: 'Yes. Water cannot be carried up over a ridge higher than its source, so a tunnel through it keeps the channel sloping down.',
      arches: 'Arches would only help across a gap, and this is a ridge.',
      siphon: 'Water in a siphon cannot rise higher than where it started, so a siphon cannot lift it over a ridge higher than the source.',
    },
  },
];

export const ROME = { total: 500, underground: 430, arches: 48 };

export const archShare = () => Math.round((ROME.arches / ROME.total) * 100);
