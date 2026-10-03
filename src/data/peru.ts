// Everything the "Pyramids in Peru" page says, in one place.
// The page is a dig: you scroll down through time, and each stop has one tool to try.

export interface Shot {
  id: string;
  /** The years at the top and the bottom of this shot. The gauge slides between them as you scroll. */
  from: number;
  to: number;
  /** The label next to the gauge. */
  era: string;
  /** The caption in the corner of the picture, like a documentary. */
  chyron: string;
  kicker: string;
  title: string;
  paras: string[];
  /** Small paper tags, each with one extra fact. */
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Dig log',
  paras: [
    'Imagine one hole that goes down through 5,000 years. Scroll to dig. The gauge shows the year you have reached.',
    'In real life these places are far apart. We stack them here so you can feel the time between them.',
  ],
};

/** A strip between two shots: the Inca come late. */
export const incaStrip = {
  year: 1450,
  era: 'The Inca',
  text: 'Around 1450 the Inca build Machu Picchu. Caral is already more than 4,000 years old by then, and has been empty for over 3,000.',
};

export const shots: Shot[] = [
  {
    id: 'surface',
    from: 2026,
    to: 2000,
    era: 'The surface',
    chyron: 'Caral, Supe Valley, Peru. Today.',
    kicker: 'Day one',
    title: 'A dry hill',
    paras: [
      'From here it looks like a dusty hill in the desert. It is the Great Pyramid of Caral, about 182 km north of Lima, and sand covers it.',
      'Take the brush and wipe the hill clean.',
    ],
    tags: [{ label: 'On the list', text: 'The Sacred City of Caral-Supe became a UNESCO World Heritage site in 2009.' }],
  },
  {
    id: 'lima',
    from: 700,
    to: 200,
    era: 'The Lima culture',
    chyron: 'Huaca Pucllana, Lima. AD 200 to 700.',
    kicker: 'Day two',
    title: 'Books on a shelf',
    paras: [
      'In the middle of modern Lima stands a stepped pyramid of handmade adobe bricks, about 22 m high. The Lima culture built it between AD 200 and 700.',
      'Look at how the bricks are laid. Many of them stand on their ends, like books on a shelf, with small gaps between them.',
    ],
    tags: [{ label: 'Find', text: 'The gaps let the wall move with the earth in a quake, then settle back. The bricks were made from local clay, sand and ocean shells.' }],
  },
  {
    id: 'moche',
    from: 600,
    to: 100,
    era: 'The Moche',
    chyron: 'Huaca del Sol, Moche Valley, near Trujillo. About AD 100 to 700.',
    kicker: 'Day three',
    title: 'Every brick has a mark',
    paras: [
      'The Moche built the Huaca del Sol from more than 140 million adobe bricks. Many of the bricks carry a stamp.',
      'The archaeologist Michael Moseley found more than 100 different marks. Different parts of the pyramid use different marks. That suggests different groups of workers each built their own section.',
    ],
    tags: [{ label: 'Find', text: 'The marks were first studied in a paper by Hastings and Moseley in 1975. Pick a mark below and see where it was used.' }],
  },
  {
    id: 'caral',
    from: -2000,
    to: -2600,
    era: 'Caral',
    chyron: 'Caral, about 2600 to 2000 BC.',
    kicker: 'Day four',
    title: 'Bags of stone',
    paras: [
      'Back at Caral, go deeper. The walls of the stepped pyramids are held up from behind.',
      'Workers wove loose bags from reeds and grass, called shicras, filled them with stones, and packed them behind each retaining wall. Slide to peel the wall open.',
    ],
    tags: [{ label: 'Find', text: 'The reeds stretch a little, so the stones could shift in a quake without bringing the wall down.' }],
  },
  {
    id: 'trade',
    from: -2600,
    to: -3000,
    era: 'Before the pyramids',
    chyron: 'The Supe Valley and the coast.',
    kicker: 'Day five',
    title: 'Fish for cotton',
    paras: [
      'Why was a city built here? Caral lies about 20 km from the sea. People in the valley grew cotton, not to eat but for string and nets. People on the coast caught anchovies and sardines.',
      'Each side had something the other needed. Switch the trade on and off and see what happens to the people.',
    ],
    tags: [
      { label: 'Find', text: 'No pottery has been found at Caral. People used dried squash as bowls and floats. Many archaeologists think the city grew from trade and cooperation, not from war.' },
      { label: 'Knots that count', text: 'In 2005 archaeologists announced a quipu from Caral: knotted cotton strings, about 5,000 years old. The oldest known one before it was from about AD 650.' },
    ],
  },
  {
    id: 'lab',
    from: 2026,
    to: 2026,
    era: 'Back at camp',
    chyron: 'Back at camp. A toy model.',
    kicker: 'Night',
    title: 'Shake it',
    paras: [
      'Peru lies on the Pacific coast, where the ground shakes often. Three ways to build a wall: rigid stone, bricks on end, and stone bags.',
      'Set the strength, press Shake, and see which wall stands. This is a toy model. It shows the idea, not real engineering numbers.',
    ],
  },
  {
    id: 'ruler',
    from: 2026,
    to: 2026,
    era: 'Back at camp',
    chyron: 'Back at camp. The year line.',
    kicker: 'Last night',
    title: 'When was all this?',
    paras: ['Drag the year and see what was going on. When the Great Pyramid of Giza went up in Egypt, Caral was already a busy city.'],
  },
];

// ---------------------------------------------------------------- the Moche bricks

export const marks = [
  { id: 'a', name: 'Circle' },
  { id: 'b', name: 'Cross' },
  { id: 'c', name: 'Zigzag' },
  { id: 'd', name: 'Triangle' },
  { id: 'e', name: 'Dots' },
  { id: 'f', name: 'Bars' },
] as const;

/** Which mark is stamped on each brick of the wall: 5 rows of 8. Letters match `marks`. */
export const markWall = ['aabbccdd', 'aabbccde', 'afbbcedd', 'ffbcceed', 'fffcceee'];

// ---------------------------------------------------------------- the year line

export interface Span {
  id: string;
  label: string;
  from: number;
  to: number;
  note: string;
}

export const spans: Span[] = [
  { id: 'caral', label: 'Caral is a busy city', from: -2600, to: -2000, note: 'People live in the pyramid city of Caral.' },
  { id: 'giza', label: 'The Great Pyramid of Giza goes up', from: -2580, to: -2560, note: 'In Egypt, the Great Pyramid of Giza is being built.' },
  { id: 'moche', label: 'The Moche build the Huaca del Sol', from: 100, to: 700, note: 'The Moche are building their huge adobe pyramids.' },
  { id: 'lima', label: 'The Lima culture builds Huaca Pucllana', from: 200, to: 700, note: 'The Lima culture is building its adobe pyramid in what is now the city of Lima.' },
  { id: 'inca', label: 'The Inca empire', from: 1430, to: 1533, note: 'The Inca empire is growing. Machu Picchu is built around 1450.' },
];

export const jumps = [
  { year: -2600, label: 'Caral, 2600 BC' },
  { year: -2570, label: 'Giza, 2570 BC' },
  { year: 400, label: 'The Moche, AD 400' },
  { year: 1450, label: 'Machu Picchu, 1450' },
  { year: 2026, label: 'Today' },
];

export const yearRange = { min: -3000, max: 2026 };

// ---------------------------------------------------------------- the end of the page

export const takeaways = [
  'Pyramids in Peru are far older than the Inca. Caral was a busy city from about 2600 to 2000 BC.',
  'The builders lived with earthquakes. Stone-filled reed bags at Caral and bricks stood on end in Lima both let a wall move a little and settle back.',
  'Big pyramids were group work. The brick marks at the Huaca del Sol suggest that teams each built their own section.',
  'Caral was tied to the coast. The valley grew cotton for nets, and the coast sent fish.',
];

export interface Source {
  label: string;
  url: string;
  for: string;
}

export const sources: Source[] = [
  { label: 'Wikipedia: Caral', url: 'https://en.wikipedia.org/wiki/Caral', for: 'The size of the Great Pyramid, the dates, the distance from Lima, UNESCO, and the quipu.' },
  { label: 'Wikipedia: Caral-Supe civilization', url: 'https://en.wikipedia.org/wiki/Caral-Supe_civilization', for: 'The wider civilization around Caral.' },
  { label: 'History.com: This Peruvian civilization built pyramids as old as Egypt\'s', url: 'https://www.history.com/articles/caral-peru-norte-chico-oldest-civilization-western-hemisphere', for: 'The shicra bags and how they helped in earthquakes.' },
  { label: 'New World Encyclopedia: Norte Chico civilization', url: 'https://www.newworldencyclopedia.org/entry/Norte_Chico_civilization', for: 'Cotton for nets, fish from the coast, and dried squash instead of pottery.' },
  { label: 'NBC News: Peruvian writing system goes back 5,000 years', url: 'https://www.nbcnews.com/id/wbna8633818', for: 'The quipu from Caral, announced in 2005.' },
  { label: 'Wikipedia: Huaca del Sol', url: 'https://en.wikipedia.org/wiki/Huaca_del_Sol', for: 'The Moche pyramid and its more than 140 million bricks.' },
  { label: 'EBSCO: The Moche build the Huaca del Sol and Huaca de la Luna', url: 'https://www.ebsco.com/research-starters/architecture/moche-build-huaca-del-sol-and-huaca-de-la-luna', for: 'The brick marks and Michael Moseley.' },
  { label: 'History Skills: Huaca Pucllana', url: 'https://www.historyskills.com/classroom/year-8/huaca-pucllana/', for: 'The bookshelf brick technique, the dates and the height.' },
  { label: 'Wikipedia: Machu Picchu', url: 'https://en.wikipedia.org/wiki/Machu_Picchu', for: 'Machu Picchu was built around 1450.' },
  { label: 'Wikipedia: Great Pyramid of Giza', url: 'https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza', for: 'The date of the Great Pyramid of Giza, for the year line.' },
];
