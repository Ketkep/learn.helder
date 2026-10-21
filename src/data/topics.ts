// The topic registry: one list that drives the homepage grid,
// the "next topic" links and the numbering. To add a topic, add an entry here
// and create src/pages/<slug>/index.astro (see README.md).

import type { Lang } from '../lib/text';

export type TopicStatus = 'live' | 'draft';

/** A topic page written in another language. It shows up at /<language>/<slug>/. */
export interface TopicTranslation {
  slug: string;
  title: string;
  hook: string;
  category: string;
}

export interface Topic {
  /** URL part and folder name: src/pages/<slug>/index.astro */
  slug: string;
  title: string;
  /** One line that makes people want to click. */
  hook: string;
  category: string;
  /** The cover color (hex). Text and drawing colors on it are picked automatically. */
  accent: string;
  /** Name of an SVG file in src/previews, without ".svg". */
  preview: string;
  /** YYYY-MM-DD. Topics are ordered by this date, oldest first. */
  dateAdded: string;
  /** "draft" topics show up in `npm run dev` only. */
  status: TopicStatus;
  /** Other languages this topic is available in. The numbering and the category filter stay English. */
  translations?: { nl?: TopicTranslation };
  /** Which language the homepage card and the "next topic" cards lead to. English when left out. */
  hubLanguage?: Lang;
}

// The topics, in the order they were added.
export const topics: Topic[] = [
  {
    slug: 'gambits-in-chess',
    title: 'Gambits in chess',
    hook: 'Give away a pawn on purpose and see what you get for it.',
    category: 'Games',
    accent: '#9B2F36',
    preview: 'gambits-in-chess',
    dateAdded: '2026-10-02',
    status: 'live',
  },
  {
    slug: 'pyramids-in-peru',
    title: 'Pyramids in Peru',
    hook: 'Huge stepped pyramids, built thousands of years before the Incas.',
    category: 'Archaeology',
    accent: '#D9A441',
    preview: 'pyramids-in-peru',
    dateAdded: '2026-10-02',
    status: 'live',
  },
  {
    slug: 'the-dutch-golden-age',
    title: 'The Dutch Golden Age',
    hook: 'How a small country at the edge of Europe became a trading giant.',
    category: 'History',
    accent: '#2B4F9E',
    preview: 'the-dutch-golden-age',
    dateAdded: '2026-10-02',
    status: 'live',
  },
  {
    slug: 'radiation-therapy',
    title: 'Radiation therapy',
    hook: 'How invisible beams treat cancer, from the treatment room down to one strand of DNA.',
    category: 'Medicine',
    accent: '#17706B',
    preview: 'radiation-therapy',
    dateAdded: '2026-10-04',
    status: 'live',
    translations: {
      nl: {
        slug: 'radiotherapie',
        title: 'Radiotherapie',
        hook: 'Hoe onzichtbare stralen kanker behandelen, van de behandelkamer tot één streng DNA.',
        category: 'Geneeskunde',
      },
    },
    // For now the homepage shows the Dutch version of this topic. Remove this line to show English again.
    hubLanguage: 'nl',
  },
  {
    slug: 'tides-and-the-moon',
    title: 'Tides and the Moon',
    hook: 'Why the sea rises and falls twice a day, and why some tides are far bigger than others.',
    category: 'Nature',
    accent: '#5A3E8E',
    preview: 'tides-and-the-moon',
    dateAdded: '2026-10-06',
    status: 'live',
  },
  {
    slug: 'prime-numbers',
    title: 'Prime numbers',
    hook: 'Numbers that cannot be split. Strike out the rest, build rectangles and see why there is no last one.',
    category: 'Maths',
    accent: '#A8336A',
    preview: 'prime-numbers',
    dateAdded: '2026-10-06',
    status: 'live',
  },
  {
    slug: 'strings-and-notes',
    title: 'Strings and notes',
    hook: 'Pluck a string, shorten it, tighten it, and hear why some notes sound good together.',
    category: 'Music',
    accent: '#7A4B2A',
    preview: 'strings-and-notes',
    dateAdded: '2026-10-06',
    status: 'live',
  },
  {
    slug: 'why-we-have-seasons',
    title: 'Why we have seasons',
    hook: 'It is not the distance to the Sun. Turn four dials and find out what it is.',
    category: 'Space',
    accent: '#4E6B2E',
    preview: 'why-we-have-seasons',
    dateAdded: '2026-10-07',
    status: 'live',
  },
  {
    slug: 'morse-code',
    title: 'Morse code',
    hook: 'Tap out a message in dots and dashes, and find out why E is just one dot.',
    category: 'Language',
    accent: '#26364F',
    preview: 'morse-code',
    dateAdded: '2026-10-07',
    status: 'live',
  },
  {
    slug: 'how-bridges-carry-load',
    title: 'How bridges carry a load',
    hook: 'Load a plank, an arch, a cable and a triangle, and see which parts push and which pull.',
    category: 'Technology',
    accent: '#A9C4D4',
    preview: 'how-bridges-carry-load',
    dateAdded: '2026-10-07',
    status: 'live',
  },
  {
    slug: 'how-clocks-keep-time',
    title: 'How clocks keep time',
    hook: 'A swinging pendulum, a ticking wheel and a shaking crystal: open a clock and see what counts the seconds.',
    category: 'Technology',
    accent: '#E58B73',
    preview: 'how-clocks-keep-time',
    dateAdded: '2026-10-08',
    status: 'live',
  },
  {
    slug: 'how-chance-works',
    title: 'How chance works',
    hook: 'Roll dice, flip coins, share a birthday and pick a door, and see what chance really does.',
    category: 'Maths',
    accent: '#C5D18A',
    preview: 'how-chance-works',
    dateAdded: '2026-10-08',
    status: 'live',
  },
  {
    slug: 'the-water-cycle',
    title: 'The water cycle',
    hook: 'Follow a drop of water from the sea to the sky, over a mountain and back to the sea.',
    category: 'Nature',
    accent: '#3E8EDE',
    preview: 'the-water-cycle',
    dateAdded: '2026-10-08',
    status: 'live',
  },
  {
    slug: 'how-computers-count',
    title: 'How computers count',
    hook: 'Flip eight switches and see the same pattern as a number, a letter, a counter and a colour.',
    category: 'Technology',
    accent: '#E7B1BC',
    preview: 'how-computers-count',
    dateAdded: '2026-10-09',
    status: 'live',
  },
  {
    slug: 'how-fast-is-light',
    title: 'How fast is light',
    hook: 'Send a beam to the Moon, Mars and the nearest star, and see how old the light is when it arrives.',
    category: 'Space',
    accent: '#7BD88F',
    preview: 'how-fast-is-light',
    dateAdded: '2026-10-09',
    status: 'live',
  },
  {
    slug: 'how-maps-flatten-the-earth',
    title: 'How maps flatten the Earth',
    hook: 'Put a globe next to its flat copy and see what each kind of map gets wrong.',
    category: 'Places',
    accent: '#B9A3E3',
    preview: 'how-maps-flatten-the-earth',
    dateAdded: '2026-10-10',
    status: 'live',
  },
  {
    slug: 'how-a-lock-works',
    title: 'How a lock works',
    hook: 'Push keys into a lock from 4,000 years ago and a modern one, and see which pins stop the door.',
    category: 'Technology',
    accent: '#5E6B78',
    preview: 'how-a-lock-works',
    dateAdded: '2026-10-10',
    status: 'live',
  },
  {
    slug: 'how-bread-rises',
    title: 'How bread rises',
    hook: 'Follow one loaf through a day: the yeast, the gluten net, oven spring and the crust.',
    category: 'Nature',
    accent: '#F0DDB8',
    preview: 'how-bread-rises',
    dateAdded: '2026-10-10',
    status: 'live',
  },
  {
    slug: 'the-seven-bridges-of-konigsberg',
    title: 'The seven bridges of Königsberg',
    hook: 'Try to cross every bridge exactly once, and find out why Euler said you cannot.',
    category: 'Maths',
    accent: '#5BC8D6',
    preview: 'the-seven-bridges-of-konigsberg',
    dateAdded: '2026-10-11',
    status: 'live',
  },
  {
    slug: 'why-the-sky-is-blue',
    title: 'Why the sky is blue',
    hook: 'Slide the sun down the sky and see why the blue goes and the red stays.',
    category: 'Nature',
    accent: '#7FC4F0',
    preview: 'why-the-sky-is-blue',
    dateAdded: '2026-10-11',
    status: 'live',
  },
  {
    slug: 'how-rhythm-works',
    title: 'How rhythm works',
    hook: 'Switch steps on and off, spread hits evenly and play two beats at once.',
    category: 'Music',
    accent: '#6FB5A8',
    preview: 'how-rhythm-works',
    dateAdded: '2026-10-11',
    status: 'live',
  },
  {
    slug: 'newtons-cannonball',
    title: 'Newton’s cannonball',
    hook: 'Fire a ball from a mountain and find the speed at which it never lands.',
    category: 'Space',
    accent: '#9AA7FF',
    preview: 'newtons-cannonball',
    dateAdded: '2026-10-12',
    status: 'live',
  },
  {
    slug: 'secret-writing',
    title: 'Secret writing',
    hook: 'Turn a cipher wheel, then break the message by counting letters.',
    category: 'Language',
    accent: '#E36FA3',
    preview: 'secret-writing',
    dateAdded: '2026-10-12',
    status: 'live',
  },
  {
    slug: 'why-leaves-change-colour',
    title: 'Why leaves change colour',
    hook: 'Take away the green and see the yellow that was hiding all summer.',
    category: 'Nature',
    accent: '#9A3B1F',
    preview: 'why-leaves-change-colour',
    dateAdded: '2026-10-12',
    status: 'live',
  },
  {
    slug: 'the-bee-dance',
    title: 'The bee dance',
    hook: 'Read a dance on the comb and find the flowers it points to.',
    category: 'Nature',
    accent: '#F2C14E',
    preview: 'the-bee-dance',
    dateAdded: '2026-10-13',
    status: 'live',
  },
  {
    slug: 'how-a-thermostat-works',
    title: 'How a thermostat works',
    hook: 'Watch a room warm and cool over a day and see how a switch keeps it steady.',
    category: 'Technology',
    accent: '#3C6E91',
    preview: 'how-a-thermostat-works',
    dateAdded: '2026-10-13',
    status: 'live',
  },
  {
    slug: 'how-growth-compounds',
    title: 'How growth compounds',
    hook: 'See why growth on top of growth pulls away from a straight line, with made up coins.',
    category: 'Maths',
    accent: '#4C9A7A',
    preview: 'how-growth-compounds',
    dateAdded: '2026-10-13',
    status: 'live',
  },
  {
    slug: 'why-we-have-leap-years',
    title: 'Why we have leap years',
    hook: 'Run the calendar for hundreds of years and watch the seasons slip, then fix it.',
    category: 'Maths',
    accent: '#7C6FD6',
    preview: 'why-we-have-leap-years',
    dateAdded: '2026-10-14',
    status: 'live',
  },
  {
    slug: 'how-tree-rings-work',
    title: 'How tree rings work',
    hook: 'Count the rings of a stump, then date an old beam by matching its pattern.',
    category: 'Nature',
    accent: '#86663F',
    preview: 'how-tree-rings-work',
    dateAdded: '2026-10-14',
    status: 'live',
  },
  {
    slug: 'how-loud-is-loud',
    title: 'How loud is loud',
    hook: 'See why 60 decibels is a million times more than zero, and what two sounds add up to.',
    category: 'Body',
    accent: '#E85F5C',
    preview: 'how-loud-is-loud',
    dateAdded: '2026-10-14',
    status: 'live',
  },
  {
    slug: 'why-the-moon-has-phases',
    title: 'Why the Moon has phases',
    hook: 'Move the Moon round the Earth and see why it changes shape, and why that is not a shadow.',
    category: 'Space',
    accent: '#8E9AAF',
    preview: 'why-the-moon-has-phases',
    dateAdded: '2026-10-15',
    status: 'live',
  },
  {
    slug: 'how-a-search-engine-works',
    title: 'How a search engine works',
    hook: 'Follow a crawl, look up words on index cards, and let links vote on a tiny made up web.',
    category: 'Technology',
    accent: '#E07B39',
    preview: 'how-a-search-engine-works',
    dateAdded: '2026-10-15',
    status: 'live',
  },
  {
    slug: 'the-game-of-nim',
    title: 'The game of Nim',
    hook: 'Play a game that looks like luck, then learn the binary rule that decides it.',
    category: 'Games',
    accent: '#2F8F9D',
    preview: 'the-game-of-nim',
    dateAdded: '2026-10-15',
    status: 'live',
  },
  {
    slug: 'how-earthquakes-are-found',
    title: 'How earthquakes are found',
    hook: 'Read the gap between two waves, draw three circles, and find where the ground broke.',
    category: 'Nature',
    accent: '#A5543A',
    preview: 'how-earthquakes-are-found',
    dateAdded: '2026-10-16',
    status: 'live',
  },
  {
    slug: 'how-files-shrink',
    title: 'How files shrink',
    hook: 'Pack dots into runs, point back at repeats, give letters short codes, and see what cannot shrink.',
    category: 'Technology',
    accent: '#9E4A96',
    preview: 'how-files-shrink',
    dateAdded: '2026-10-16',
    status: 'live',
  },
  {
    slug: 'how-the-eye-sees',
    title: 'How the eye sees',
    hook: 'Find your blind spot, make a ghost colour, and see how little of your vision is sharp.',
    category: 'Body',
    accent: '#7F5CB0',
    preview: 'how-the-eye-sees',
    dateAdded: '2026-10-16',
    status: 'live',
  },
  {
    slug: 'how-languages-are-related',
    title: 'How languages are related',
    hook: 'See why water is water in English and Dutch, and build a family tree from the words.',
    category: 'Language',
    accent: '#2E6B5B',
    preview: 'how-languages-are-related',
    dateAdded: '2026-10-17',
    status: 'live',
  },
  {
    slug: 'the-solar-system-to-scale',
    title: 'The solar system to scale',
    hook: 'Shrink the Sun to an apple and walk out to Neptune.',
    category: 'Space',
    accent: '#A5521A',
    preview: 'the-solar-system-to-scale',
    dateAdded: '2026-10-17',
    status: 'live',
  },
  {
    slug: 'how-a-note-is-built',
    title: 'How a note is built',
    hook: 'Add sine waves to build a square wave, a toy flute and a toy violin, and hear two notes beat.',
    category: 'Music',
    accent: '#4A5DBF',
    preview: 'how-a-note-is-built',
    dateAdded: '2026-10-17',
    status: 'live',
  },
  {
    slug: 'how-roman-aqueducts-worked',
    title: 'How Roman aqueducts worked',
    hook: 'Set the slope of a channel, see the pressure in a siphon, and choose how to cross a valley.',
    category: 'History',
    accent: '#8C5A3C',
    preview: 'how-roman-aqueducts-worked',
    dateAdded: '2026-10-18',
    status: 'live',
  },
  {
    slug: 'how-time-zones-work',
    title: 'How time zones work',
    hook: 'Move the Sun over a map, compare eight clocks and fly to a time before you left.',
    category: 'Places',
    accent: '#2C7A7B',
    preview: 'how-time-zones-work',
    dateAdded: '2026-10-18',
    status: 'live',
  },
  {
    slug: 'how-a-loan-is-paid-off',
    title: 'How a loan is paid off',
    hook: 'See where each payment goes, and what a longer term or a little extra does to a made up loan.',
    category: 'Maths',
    accent: '#6B6A2A',
    preview: 'how-a-loan-is-paid-off',
    dateAdded: '2026-10-18',
    status: 'live',
  },
  {
    slug: 'how-a-volcano-erupts',
    title: 'How a volcano erupts',
    hook: 'Make magma sticky or runny and watch a gas bubble swell as it rises.',
    category: 'Nature',
    accent: '#A63A2B',
    preview: 'how-a-volcano-erupts',
    dateAdded: '2026-10-19',
    status: 'live',
  },
  {
    slug: 'how-a-battery-works',
    title: 'How a battery works',
    hook: 'Stack a pile of discs, follow a zinc and copper cell, and work out how long a battery lasts.',
    category: 'Technology',
    accent: '#7A6A14',
    preview: 'how-a-battery-works',
    dateAdded: '2026-10-19',
    status: 'live',
  },
  {
    slug: 'how-the-heart-pumps',
    title: 'How the heart pumps',
    hook: 'Follow a drop of blood round its trip and work out the litres the heart pumps.',
    category: 'Body',
    accent: '#A12F45',
    preview: 'how-the-heart-pumps',
    dateAdded: '2026-10-19',
    status: 'live',
  },
  {
    slug: 'how-a-rainbow-forms',
    title: 'How a rainbow forms',
    hook: 'Send a ray through a raindrop and see why the bow stands at 42 degrees.',
    category: 'Nature',
    accent: '#2D6F9C',
    preview: 'how-a-rainbow-forms',
    dateAdded: '2026-10-20',
    status: 'live',
  },
  {
    slug: 'how-a-camera-makes-a-picture',
    title: 'How a camera makes a picture',
    hook: 'Make a picture with a pinhole, then balance the light with the aperture, the shutter and the ISO.',
    category: 'Technology',
    accent: '#5C5F6B',
    preview: 'how-a-camera-makes-a-picture',
    dateAdded: '2026-10-20',
    status: 'live',
  },
  {
    slug: 'how-the-printing-press-worked',
    title: 'How the printing press worked',
    hook: 'Follow a letter from a steel punch to a printed page and compare copying by hand with printing.',
    category: 'History',
    accent: '#7A5A2E',
    preview: 'how-the-printing-press-worked',
    dateAdded: '2026-10-20',
    status: 'live',
  },
  {
    slug: 'why-tic-tac-toe-is-always-a-draw',
    title: 'Why tic-tac-toe is always a draw',
    hook: 'Play a machine that never errs, pick a first move and count all 255,168 games.',
    category: 'Games',
    accent: '#E3C75A',
    preview: 'why-tic-tac-toe-is-always-a-draw',
    dateAdded: '2026-10-21',
    status: 'live',
  },
  {
    slug: 'how-gps-finds-you',
    title: 'How GPS finds you',
    hook: 'Draw the rings that a satellite signal gives and fix a clock that is wrong.',
    category: 'Technology',
    accent: '#C8D94A',
    preview: 'how-gps-finds-you',
    dateAdded: '2026-10-21',
    status: 'live',
  },
];

/** How a topic is shown in a list (homepage card, "next topic" card): where it leads, and in which words. */
export function getTopicView(topic: Topic) {
  const lang: Lang = topic.hubLanguage ?? 'en';
  const translation = lang === 'en' ? undefined : topic.translations?.[lang];
  if (lang !== 'en' && !translation) throw new Error(`Topic "${topic.slug}" has hubLanguage "${lang}" but no translation for it`);
  return {
    lang,
    href: translation ? `/${lang}/${translation.slug}/` : `/${topic.slug}/`,
    title: translation?.title ?? topic.title,
    hook: translation?.hook ?? topic.hook,
  };
}

/** Topics that should appear right now: everything in dev, only "live" in production. */
export function getVisibleTopics(): Topic[] {
  const showDrafts = import.meta.env.DEV;
  return topics
    .filter((t) => showDrafts || t.status === 'live')
    .sort((a, b) => a.dateAdded.localeCompare(b.dateAdded));
}

/** Categories that have at least one visible topic, in order of first appearance. */
export function getCategories(): string[] {
  return [...new Set(getVisibleTopics().map((t) => t.category))];
}

/** Display number ("01", "02", ...) based on position in the visible list. */
export function getTopicNumber(slug: string): string {
  const index = getVisibleTopics().findIndex((t) => t.slug === slug);
  return String(index + 1).padStart(2, '0');
}

export function getTopic(slug: string): Topic {
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) throw new Error(`No topic with slug "${slug}" in src/data/topics.ts`);
  return topic;
}

/** The topic after this one (wraps around). Undefined if there is no other topic. */
export function getNextTopic(slug: string): Topic | undefined {
  const visible = getVisibleTopics();
  const index = visible.findIndex((t) => t.slug === slug);
  const next = visible[(index + 1) % visible.length];
  return next && next.slug !== slug ? next : undefined;
}
