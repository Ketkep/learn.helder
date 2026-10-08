// The places a drop of water can be. The chances of each move are made up for this page. The times are rough averages.

export interface Place {
  id: string;
  name: string;
  /** Average stay in years. */
  years: number;
  note: string;
  /** Where the drop can go next, with made-up chances that add up to 1. */
  next: [string, number][];
}

export const places: Place[] = [
  { id: 'sea', name: 'The sea', years: 3500, note: 'Thousands of years (about 3,000 to 4,000)', next: [['air', 1]] },
  { id: 'air', name: 'The air', years: 9 / 365, note: 'About 8 or 9 days', next: [['sea', 0.77], ['river', 0.1], ['soil', 0.08], ['ice', 0.05]] },
  { id: 'river', name: 'A river', years: 14 / 365, note: 'About 2 weeks', next: [['sea', 0.75], ['air', 0.15], ['ground', 0.1]] },
  { id: 'soil', name: 'The soil', years: 0.3, note: 'Weeks to a year', next: [['air', 0.6], ['ground', 0.25], ['river', 0.15]] },
  { id: 'ground', name: 'Groundwater', years: 300, note: 'Weeks to thousands of years (hundreds, on average)', next: [['river', 0.6], ['sea', 0.4]] },
  { id: 'ice', name: 'Ice and snow', years: 1000, note: 'Tens to thousands of years', next: [['river', 0.7], ['air', 0.3]] },
];

export const placeById = (id: string) => places.find((p) => p.id === id)!;

/** The next place, picked by the made-up chances. */
export function nextPlace(from: Place) {
  let r = Math.random();
  for (const [id, chance] of from.next) {
    if (r < chance) return placeById(id);
    r -= chance;
  }
  return placeById(from.next[from.next.length - 1][0]);
}

/** How long the drop stays: a random time with the average of the place (short stays are common, long ones rare). */
export const stay = (p: Place) => -p.years * Math.log(1 - Math.random());

/** A time in years as words: "6 days", "3 months", "2,840 years". */
export function words(years: number) {
  const days = years * 365;
  if (days < 1) return 'less than a day';
  if (days < 60) return `${Math.round(days)} day${Math.round(days) === 1 ? '' : 's'}`;
  if (years < 1.5) return `${Math.round(days / 30)} months`;
  if (years < 100) return `${years < 10 ? years.toFixed(1) : Math.round(years)} years`;
  return `${Math.round(years).toLocaleString('en-US')} years`;
}
