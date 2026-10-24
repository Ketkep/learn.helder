// Everything the "Why we always see the same side of the Moon" page says, in one place.
// A darkroom with prints hung on a line, and four things to try: spinning or not, how tides lock a moon, moving away, and other worlds.
// The periods and the distance come from the sources. The spin-down steps in print two are a toy with made up time steps, and the page says so.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'The Moon turns, and we never see it',
  paras: [
    'We always see the same face of the Moon. People used to think this meant the Moon does not spin. It does spin. It turns exactly once for every trip round the Earth, so the two turns cancel. This is called tidal locking, or synchronous rotation. Both the spin and the orbit take 27.32 days.',
    'Four prints hang on the line. Spin the Moon and see when one face stays towards Earth. See how tides slow a spinning moon until it locks. Watch the Moon drift away. And look at other worlds that are locked, or nearly. The spin steps in the second print are a toy with made up time steps. Without a script each print shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'spin',
    kicker: 'Print one',
    title: 'Spin it or not',
    paras: [
      'Seen from above, the Moon goes round the Earth. Mark one side of it. If the Moon did not spin, it would keep pointing in the same direction among the stars, and over one orbit we would see every side of it. If it spins once per orbit, the marked side always points at Earth.',
      'Pick how the Moon spins and slide it round its orbit. The page says where the marked side points.',
    ],
    tags: [{ label: 'The far side', text: 'The far side is not dark. It gets sunlight like the near side. The Soviet probe Luna 3 took the first pictures of it on 7 October 1959. It has far fewer dark plains than the near side: about 2 per cent of the far side is covered by them, against about 31 per cent of the near side.' }],
  },
  {
    id: 'lock',
    kicker: 'Print two',
    title: 'How tides lock it',
    paras: [
      'Earth’s pull stretches the Moon a little, so it has a small bulge towards Earth. If the Moon spins faster than it orbits, the spin carries the bulge ahead of the line to Earth, and Earth’s pull on the bulge acts like a brake. It slows the spin. This goes on until the spin matches the orbit and the bulge points straight at Earth. Sources say this took about a billion years for the Moon.',
      'Press age to let some time pass. The Moon starts, in this toy, spinning once in 10 hours. Each step makes the gap to the orbit 40 per cent smaller. The starting spin and the size of each step are made up. Only the end, 27.32 days, is real.',
    ],
  },
  {
    id: 'away',
    kicker: 'Print three',
    title: 'The Moon moving away',
    paras: [
      'The same tides push the Moon outwards. Laser beams bounced off mirrors left on the Moon by Apollo astronauts and Soviet rovers show that the Moon is moving away from us by about 3.8 centimetres a year. The distance is measured to about a centimetre. The average distance is about 384,400 kilometres.',
      'Slide the time forward. The page adds 3.8 centimetres for each year and works out the new distance, and how long one orbit would then take. The rate has not been constant over history, so this is a rough picture of the idea and not a forecast.',
    ],
  },
  {
    id: 'worlds',
    kicker: 'Print four',
    title: 'Other worlds',
    paras: [
      'The Moon is not alone. Typically only the smaller body locks to the larger one. Where the two are close in size, both can lock to each other, as Pluto and Charon do. And a world on an oval orbit can settle into a different match. Mercury turns three times for every two of its years.',
      'Pick a world and read what it does.',
    ],
  },
];

export const takeaways = [
  'The Moon spins once for every orbit of the Earth, both in 27.32 days, so the same face always points at us.',
  'Tides slowed the Moon’s spin until it matched its orbit. Sources say this took about a billion years.',
  'The Moon is moving away from Earth by about 3.8 centimetres a year, from laser measurements.',
  'The far side is lit as much as the near side. It has far fewer dark plains, about 2 per cent against 31 per cent.',
  'Pluto and Charon are locked to each other. Mercury is in a 3 to 2 spin and orbit match, which some call locking and others do not.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The 27.32 day spin and orbit, the lock over about a billion years, about 59 per cent of the surface seen over time, the first pictures of the far side by Luna 3 on 7 October 1959, the far side with about 2 per cent maria against about 31 per cent, the 3.8 centimetres a year found with laser ranging to mirrors left by three Apollo missions and two Soviet rovers, the average distance of about 384,400 kilometres, Pluto and Charon locked to each other and Mercury in a 3 to 2 resonance each appeared in at least two places. Sources differ on how to word Mercury and on the day length change from tides (about 1.7 to 2 milliseconds a century, which the page leaves out). The steps of the spin down are made up and so is the starting spin of 10 hours. The distances after millions of years assume the same rate and are rough. The orbit time after that is worked out from Kepler’s rule.';

export const sources = [
  { label: 'Universe Today: the Moon is tidally locked', url: 'https://www.universetoday.com/articles/every-year-nasa-simulates-our-view-of-the-moon-for-the-upcoming-12-months-heres-2021-hour-by-hour', for: 'Rotation period of 27.32 days.' },
  { label: 'Astronomy magazine: the Moon’s far side', url: 'https://www.astronomy.com/?p=38883', for: 'Up to 59 per cent seen because of libration.' },
  { label: 'Simple Wikipedia: tidal locking', url: 'https://simple.wikipedia.com/wiki/Tidal_locking', for: 'How tidal locking works.' },
  { label: 'Wikipedia: tidal locking', url: 'https://en.wikipedia.org/wiki/Tidal_locking', for: 'Pluto and Charon, and Mercury’s 3 to 2.' },
  { label: 'Wikipedia: Luna 3', url: 'https://en.wikipedia.org/wiki/Luna_3', for: 'The first pictures of the far side.' },
  { label: 'NSSDC: Luna 3 photographs', url: 'https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/lu3_27.html', for: 'Fewer dark plains on the far side.' },
  { label: 'Guinness World Records: longest laser ranging experiment', url: 'https://www.guinnessworldrecords.com/world-records/longest-laser-ranging-experiment', for: 'The Moon moving away by 3.8 centimetres a year.' },
  { label: 'EarthSky: the receding Moon', url: 'https://earthsky.org/tonight/wayward-moon-receding-from-earth/', for: 'Tidal friction and the Moon’s distance.' },
  { label: 'Wikipedia: the Moon', url: 'https://en.wikipedia.org/wiki/Moon', for: 'Distance, orbit period and maria on the near and far side.' },
];
