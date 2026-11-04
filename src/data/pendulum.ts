// Everything the "Why a pendulum keeps a steady beat" page says, in one place.
// A clockmaker's wall with three pendulums to try: how length and place set the beat, why the weight does not matter but a big swing
// does, and how to set a pendulum so that it beats seconds. The formula and the history come from the sources. The big swing period
// is worked out exactly, and the gravity of each place is a rounded value from the sources.

export interface Hook {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A swing that takes the same time every time',
  paras: [
    'A pendulum is a weight on a string or rod that swings to and fro. Its great use is that for small swings it takes the same time for each swing, whether the swing is a little wider or a little narrower. That is why pendulums kept clocks steady for centuries.',
    'Three pendulums to try. On the first, change the length and the place and see how the beat changes. On the second, change the weight and the size of the swing. On the third, set a pendulum so that each swing takes exactly two seconds. Swings run only when you press the button. Without a script each pendulum shows one picture or table.',
  ],
};

export const hooks: Hook[] = [
  {
    id: 'length',
    kicker: 'First pendulum',
    title: 'Length and place set the beat',
    paras: [
      'The time for one full swing, there and back, is 2 pi times the square root of the length divided by the pull of gravity. A longer pendulum is slower, and a stronger pull makes it faster. To make it twice as slow you do not double the length. You make it four times as long.',
      'Slide the length and pick a place. The Moon pulls about one sixth as hard as the Earth, so the same pendulum is more than twice as slow there. The pulls are rounded values: about 9.81 on Earth, 3.71 on Mars and 1.62 on the Moon, in metres per second per second. Press Swing to watch it.',
    ],
  },
  {
    id: 'swing',
    kicker: 'Second pendulum',
    title: 'The weight does not matter, the swing does',
    paras: [
      'Change the weight of the bob and the time of the swing does not change. A heavier bob is pulled harder by gravity, but it also takes more to move, and the two cancel. That is why the formula has no weight in it.',
      'The size of the swing is different. For small swings the time is almost the same, but a big swing takes longer. The page works out the exact time and shows how much longer. At 15 degrees the swing is about 0.4 per cent slower than the small swing rule says, and at 60 degrees about 7 per cent. Press Swing to watch it.',
    ],
    tags: [
      { label: 'History', text: 'Galileo noticed that a swinging lamp keeps nearly the same time for wide and narrow swings, around 1602, and Christiaan Huygens built the first pendulum clock in 1656. Sources differ on the exact date for Galileo.' },
    ],
  },
  {
    id: 'seconds',
    kicker: 'Third pendulum',
    title: 'Set a pendulum to beat seconds',
    paras: [
      'A clock whose pendulum takes two seconds for a full swing ticks once a second, once for each pass through the middle. The length that does this on Earth is about 0.994 metres, which clockmakers used in good clocks. It is called a seconds pendulum.',
      'Slide the length until the full swing takes two seconds. The page tells you how many seconds a clock with your pendulum would gain or lose in a day. A pendulum one centimetre too short makes a clock gain about 3 minutes a day on Earth. That is how small the changes of a clock’s length have to be.',
    ],
  },
];

export const takeaways = [
  'For a small swing, the time of one full swing is 2 pi times the square root of the length divided by gravity.',
  'The weight of the bob does not change the time. The length and the pull of gravity do.',
  'To make a pendulum twice as slow, make it four times as long.',
  'A big swing takes longer than a small one. At 60 degrees it is about 7 per cent longer.',
  'A seconds pendulum, with a full swing of two seconds, is about 0.994 metres long on Earth.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The formula for the small swing, the fact that the weight of the bob does not matter, the seconds pendulum of about 0.994 metres, and Huygens’s clock of 1656 each appeared in more than one place. The length of 0.994 metres was also checked by computing, 9.81 times 4 over 4 pi squared. Sources give the limit of a small swing in different ways, about 14 or 15 degrees, so the page works out the exact period for each size and does not draw a line. The exact period uses the arithmetic-geometric mean and gives 0.43 per cent more at 15 degrees, 1.7 per cent at 30 and 7.3 per cent at 60, which are computed on the page. The date for Galileo differs between sources, so the page says around 1602. The pull of gravity is rounded: 9.81 for Earth, 3.71 for Mars (the equatorial value in a NASA table, while another NASA sheet gives a mean of 3.73) and 1.62 for the Moon. Jupiter is left out because its value depends on which definition is used. The drift of a clock per day is computed on the page. Nothing here is advice.';

export const sources = [
  { label: 'Wikipedia: pendulum', url: 'https://en.wikipedia.org/wiki/Pendulum', for: 'The period, the small swing and the history.' },
  { label: 'Wikipedia: seconds pendulum', url: 'https://en.wikipedia.org/wiki/Seconds_pendulum', for: 'The seconds pendulum of 0.994 metres.' },
  { label: 'arXiv: the AGM simple pendulum', url: 'https://arxiv.org/pdf/1202.2782', for: 'The exact period of a big swing.' },
  { label: 'Physics Tribune: simple pendulum', url: 'https://physicstribune.com/waves/simple-pendulum/', for: 'The formula for the period.' },
  { label: 'Physics Fundamentals: the simple pendulum and its period formula', url: 'https://physicsfundamentals.org/blog/simple-pendulum', for: 'The formula and its parts.' },
  { label: 'Physics Fundamentals: why mass never matters', url: 'https://physicsfundamentalsinfo.com/blog/mechanics/pendulum-period-formula/', for: 'The weight of the bob.' },
  { label: 'Vedantu: time period of a simple pendulum', url: 'https://www.vedantu.com/jee-main/physics-time-period-of-simple-pendulum', for: 'Factors that change the period.' },
  { label: 'NASA NSSDC: Moon fact sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html', for: 'The pull of gravity on the Moon.' },
  { label: 'NASA NSSDC: Mars fact sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html', for: 'The pull of gravity on Mars.' },
  { label: 'NASA JPL: planetary physical parameters', url: 'https://ssd.jpl.nasa.gov/planets/phys_par.html', for: 'Equatorial gravity of the planets.' },
  { label: 'Wikipedia: Mars', url: 'https://en.wikipedia.org/wiki/Mars', for: 'The gravity of Mars.' },
];
