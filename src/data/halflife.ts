// Everything the "How old is a rock" page says, in one place.
// A museum wall of three arched alcoves and three things to try: atoms that decay at random, reading a clock from what is left,
// and choosing the right clock for the age. The half-lives and the age of the Earth come from the sources.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Clocks inside the rock',
  paras: [
    'Some kinds of atom are unstable. Sooner or later each one falls apart and turns into a different atom. Nobody can say when a single atom will go. But for a large number of them, half are gone after a fixed time called the half-life, half of what is left goes in the next one, and so on. That steady rate makes a clock. A rock or a bone holds the atoms that were left when it formed, so counting what is left tells you how long ago that was.',
    'Three alcoves to try. Watch atoms decay at random and see the half-life appear. Read an age from the share that is left. And find out why one clock cannot measure everything. The sums are computed on the page. The ages use real half-lives from the sources. Without a script each alcove shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'decay',
    kicker: 'First alcove',
    title: 'Atoms that decay at random',
    paras: [
      'Every atom has an even chance of decaying in one half-life. That is all. Some go early and some stay for a long time, and nobody can say which. A small sample is a bit unruly. A large one follows the rule closely.',
      'Pick the size of the sample and press the button to pass one half-life at a time. The page counts the atoms left and shows what the rule expects. With 16 atoms the count wobbles. With 1,000 it is close each time.',
    ],
  },
  {
    id: 'clock',
    kicker: 'Second alcove',
    title: 'Read the clock',
    paras: [
      'If you know how many parent atoms a sample started with and how many are left, you can say how many half-lives have passed. Half left means one half-life. A quarter left means two. In general the age is the half-life times the number of times the share has halved. The daughter atoms the parent turned into are the other part, and they pile up as the parent goes.',
      'Pick a clock and slide the share of parent atoms that is left. Carbon-14 has a half-life of 5,730 years and is used on things that were once alive. Uranium-238 has a half-life of about 4.47 billion years and is used on minerals in old rocks.',
    ],
    tags: [
      { label: 'Check', text: 'Sources give the half-life of carbon-14 as 5,730 years, and sometimes round it to 5,700. For uranium-238 they give 4.5 billion years, and a more exact 4.47 billion.' },
    ],
  },
  {
    id: 'right',
    kicker: 'Third alcove',
    title: 'The right clock for the age',
    paras: [
      'A clock is only useful if the age you want to measure is about the size of its half-life. After ten half-lives, less than a thousandth of the parent is left, which is too little to count. If hardly any has gone, there is nothing to tell. So carbon-14 is useless for a rock that is millions of years old, and uranium-238 is useless for a wooden spoon.',
      'Slide the age of the sample. The page shows how much of each parent would be left, and whether the clock can read it. The limits are a rule of thumb for this page: under 0.2 per cent left is too little to measure, and over 99 per cent left is too little change to tell.',
    ],
    tags: [
      { label: 'History', text: 'Using uranium and lead, scientists estimate that the Earth formed about 4.54 billion years ago, give or take 50 million years. Clair Patterson’s work on meteorites in the 1950s is the basis of that figure. Sources say carbon-14 dating works for samples up to about 50,000 years old.' },
    ],
  },
];

export const takeaways = [
  'A single atom decays at a random moment, but half of a large sample is gone after each half-life.',
  'The age of a sample is the half-life times the number of times the parent share has halved.',
  'Carbon-14 has a half-life of 5,730 years and is used on things that were once alive. Uranium-238 has about 4.47 billion years and is used on old rocks.',
  'A clock works best when the age is about the size of its half-life. Carbon-14 stops being useful at about 50,000 years.',
  'The Earth is about 4.54 billion years old, give or take 50 million.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The half-life of carbon-14 at 5,730 years, the half-life of uranium-238 at about 4.5 billion years with 4.47 billion as the more exact figure, an age of the Earth of 4.54 billion years give or take 50 million, Patterson’s work on meteorites, and carbon-14 dating being useful to about 50,000 years because too little carbon-14 is left after that each appeared in at least two places. Sources round the carbon-14 half-life to 5,700 and the uranium-238 half-life to 4.5 billion. The limits of 0.2 per cent and 99 per cent in the third alcove are a rule of thumb made up for this page. With them carbon-14 reads up to about 51 thousand years, which agrees with the sources. The atoms in the first alcove are drawn at random from a fixed seed, so the same counts appear each time. The page does not use potassium-argon or other clocks, which the sources checked did not give in detail. The sums are computed on the page.';

export const sources = [
  { label: 'USGS: radiometric time scale', url: 'https://pubs.usgs.gov/gip/geotime/radiometric.html', for: 'Half-lives and how the dating works.' },
  { label: 'NIST: the age of the Earth', url: 'https://www.nist.gov/node/1875781', for: 'Uranium-238 and 4.54 billion years.' },
  { label: 'Wikipedia: age of the Earth', url: 'https://en.wikipedia.org/wiki/Age_of_the_Earth', for: '4.54 billion years, plus or minus 0.05.' },
  { label: 'EBSCO: Earth’s age', url: 'https://www.ebsco.com/research-starters/earth-and-atmospheric-sciences/earths-age', for: 'How the age was found.' },
  { label: 'Highline College: radiometric dating notes', url: 'https://people.highline.edu/iglozman/classes/astronotes/radiodating.htm', for: 'Half-life and parent and daughter atoms.' },
  { label: 'I’m a Scientist: how do we know the age of rocks', url: 'https://hafniumj15.imascientist.org.uk/question/how-do-we-know-the-earths-age-how-do-we-know-the-age-of-rocks/index.html', for: 'Patterson and meteorites.' },
  { label: 'SciShow: how do we know how old the Earth is', url: 'https://rosetta.to/u/scishow/how-do-we-know-how-old-the-earth-is', for: 'The age of the Earth.' },
  { label: 'Arizona Ruins: radiocarbon dating', url: 'https://arizonaruins.com/articles/radiocarbon.html', for: 'The limit of carbon-14 dating.' },
  { label: 'Vaia: why carbon-14 dating stops at 50,000 years', url: 'https://www.vaia.com/en-us/textbooks/physics/an-introduction-to-physical-science-13-edition/chapter-10/problem-19-why-cant-carbon-14-dating-be-used-for-ages-50000-', for: 'Too little carbon-14 left.' },
];
