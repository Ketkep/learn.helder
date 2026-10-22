// Everything the "The Antikythera mechanism" page says, in one place.
// A bronze gearbox with a front face, a back face and an inside, and four things to try: the crank and the Moon, nineteen years and 235 months, the eclipse cycle, and a pair of gear trains.
// The cycle lengths are standard values. The drawings are ours and not copies of the machine, and the page says so.

export interface Panel {
  id: string;
  face: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A calendar made of gears',
  paras: [
    'In 1901 sponge divers pulled a corroded lump of bronze from a Roman era shipwreck off the Greek island of Antikythera. It turned out to be the remains of a device with dozens of interlocking gears, made about 2,000 years ago. The National Archaeological Museum in Athens dates it to about 150 to 100 BC. At least 30 gears survive, and reconstructions suggest it had about 37.',
    'Turn a crank and pointers moved: the Sun and Moon on the front, and cycles of the sky on the back. Four things to try. Turn the crank and watch the Moon change phase. See why 19 years is also 235 months. See why an eclipse comes back after about 18 years. And build a pair of gear trains. The drawings are ours and not copies of the machine. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'moon',
    face: 'Front face',
    kicker: 'Front face',
    title: 'The crank and the Moon',
    paras: [
      'The front dial carried scales for the zodiac and the Egyptian calendar, and the machine showed the phase of the Moon with a small ball, half pale and half dark, that turned. The Moon goes through its phases in 29.53059 days, from one new moon to the next.',
      'Slide the days the crank has been turned. We start at a new moon. The Moon ball shows the phase and the ring shows the Sun going round the year of 365.2422 days.',
    ],
    tags: [{ label: 'Speed', text: 'The real Moon does not move at an even speed across the sky. The machine copied this with a pin in a slot, which makes one gear speed up and slow down. Our crank keeps it simple and turns the Moon at an even speed.' }],
  },
  {
    id: 'metonic',
    face: 'Back face, upper dial',
    kicker: 'Back face, upper dial',
    title: 'Nineteen years, 235 months',
    paras: [
      'The upper back dial tracked a cycle of 19 years, which holds 235 months. After 19 years the phases of the Moon fall on the same dates of the year again. It is named after Meton of Athens. The match is not perfect. We work out how far off it is.',
      'Slide the number of years. The page shows the age of the Moon on the same date, if it was new on the first one.',
    ],
  },
  {
    id: 'saros',
    face: 'Back face, lower dial',
    kicker: 'Back face, lower dial',
    title: 'The eclipse cycle',
    paras: [
      'The lower back dial tracked a cycle of 223 months, called the Saros, which is used to predict eclipses. 223 months is 6,585.32 days, which is 18 years and about 11 days and 8 hours. After a Saros the Sun, Moon and Earth are lined up in nearly the same way, so a similar eclipse comes again.',
      'The extra third of a day means the shadow falls about a third of the way round the Earth farther west. After three Saros periods, about 54 years and a month, the place is nearly the same. Slide the number of periods. The page counts the shift.',
    ],
    tags: [{ label: 'Three in one', text: 'Three Saros periods make a cycle called the Exeligmos, and the machine had a dial for it too. It also had a dial for the four year cycle of the games held at Olympia, the only dial that was not about the sky.' }],
  },
  {
    id: 'gears',
    face: 'Inside',
    kicker: 'Inside the box',
    title: 'Gear it',
    paras: [
      'A gear train changes one turn into another number of turns. A gear with 19 teeth turning a gear with 47 teeth makes the second turn 19 over 47 of a turn for each turn of the first. A second pair multiplies that. The machine used trains like this to turn the crank into the cycles of the dials.',
      'Set the teeth of four gears in two stages. The page shows how many turns the last gear makes for one turn of the first, and how close that is to 235 over 19, the Metonic ratio. Try to get within one part in a thousand. Our gears are made up and are not the machine’s.',
    ],
  },
];

export const takeaways = [
  'The Antikythera mechanism is a bronze device of at least 30 gears, made about 2,000 years ago and found in a wreck in 1901.',
  'The Moon goes through its phases in 29.53059 days. 235 of those months are almost exactly 19 years, which is the Metonic cycle.',
  'The Saros is 223 months, about 18 years 11 days and 8 hours, and brings back a similar eclipse. Three of them, the Exeligmos, bring it back near the same place.',
  'Gear trains multiply turns. Two pairs with 19 to 47 and 10 to 50 teeth make exactly 235 turns for 19.',
  'The machine also followed the Moon’s uneven speed with a pin in a slot, and had a dial for the four year games at Olympia.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The discovery in 1901, at least 30 surviving gears (about 37 in reconstructions), the dating to about 150 to 100 BC, the Metonic dial of 235 months in 19 years, the Saros dial of 223 months, the Exeligmos of three Saros periods, the Olympiad dial, the zodiac and Egyptian calendar scales on the front, the Moon ball and the pin and slot for the Moon’s uneven speed each appeared in at least two places. Sources differ on the date (some give about 80 BC), on whether one upper dial showed the 76 year Callippic cycle or the four year games, and on the Exeligmos (54 years and 33 or 34 days), so the page says about. It does not say who made the machine, because that is not known. The cycle lengths of 29.53059 days, 365.2422 days, 235 months, 223 months and 6,585.32 days are standard values, and the gaps and shifts on the page are worked out from them. The gear teeth in the last part are made up.';

export const sources = [
  { label: 'Wikipedia: Metonic cycle', url: 'https://en.wikipedia.org/wiki/Metonic_cycle', for: '235 months in 19 years.' },
  { label: 'Wikipedia: Saros', url: 'https://en.wikipedia.org/wiki/Saros_(astronomy)', for: '223 months and 6,585.32 days.' },
  { label: 'Britannica: Antikythera mechanism', url: 'https://britannica.com/topic/Antikythera-mechanism', for: 'The gears and the pin and slot.' },
  { label: 'arXiv: the draconic gearing of the mechanism', url: 'https://arxiv.org/pdf/2104.06181', for: 'The dials, the Saros and the Egyptian calendar.' },
  { label: 'Freeth and others, 2008: supplementary notes', url: 'https://archive.nyu.edu/bitstream/2451/60882/2/Freeth_Jones_Steele_Bitsakis_2008_supplementary.pdf', for: 'The Olympiad, Saros and Exeligmos dials.' },
  { label: 'Freeth and others, 2006: decoding the mechanism', url: 'https://www.cse.buffalo.edu/faculty/rapaport/Papers/Papers.by.Others/ComprHist/freethetal06-antikythera.pdf', for: 'The scans and the gear count.' },
  { label: 'ASME: the Antikythera mechanism', url: 'https://www.asme.org/wwwasmeorg/media/ResourceFiles/EngineeringTopics/TechnologySociety/0918_MEM_FEA_antikythera-mechanism.pdf', for: 'How the machine worked.' },
  { label: 'CONICET: the moon phase anomaly in the mechanism', url: 'https://ri.conicet.gov.ar/handle/11336/105811', for: 'The Moon phase ball.' },
  { label: 'University of Groningen: the universe mechanized', url: 'https://www.astro.rug.nl/~weygaert/tim1publication/cosmic_origins2019/cosmic_origins2019.lect5b.universe_mechanized-antikythera.pdf', for: 'The front and back dials.' },
];
