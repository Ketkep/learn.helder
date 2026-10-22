// Everything the "How far away are the stars" page says, in one place.
// A sky atlas with four plates: the shift of a near star, from angle to distance, the smallest angle, and old light.
// The distances come from the sources. The drawing of the shift is magnified, and the page says so.

export interface Panel {
  id: string;
  plate: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'The star that moves when you do',
  paras: [
    'Hold up a finger and look at it with one eye, then the other. It jumps against the wall behind. The nearer the finger, the bigger the jump. Astronomers do the same with stars. The Earth goes round the Sun, so in six months we look from the other side of an orbit about 300 million kilometres across. A near star shifts a tiny bit against the far stars. This shift is called parallax.',
    'Four plates to try. Slide a star nearer and farther and watch it swing. Turn an angle into a distance. See how small an angle it is, and which instruments can measure it. And find out how old the light from a star is. The drawing of the shift is magnified so you can see it, and the page says so. Without a script each plate shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'shift',
    plate: 'I',
    kicker: 'Plate one',
    title: 'The yearly swing',
    paras: [
      'Over a year a near star seems to trace a small circle among the far stars, if it lies straight above the Earth’s orbit. The parallax is the angle from the middle to the edge of that circle. It is measured in arcseconds. There are 3,600 arcseconds in one degree.',
      'Slide the distance of the star, from 4 to 1,000 light years, and the month of the year. The farther the star, the smaller the circle. The circle is drawn about 120 pixels to the arcsecond, which is far bigger than the real sky.',
    ],
  },
  {
    id: 'angle',
    plate: 'II',
    kicker: 'Plate two',
    title: 'From angle to distance',
    paras: [
      'The parsec is defined by this angle. A star with a parallax of one arcsecond is one parsec away, which is 206,265 times the distance from the Earth to the Sun, or about 3.26 light years. So the distance in parsecs is one divided by the parallax in arcseconds. A parallax of half an arcsecond means two parsecs.',
      'Slide the parallax or pick a star. The distances of the stars are as the sources give them, and the parallax is worked out from them.',
    ],
    tags: [{ label: 'The first', text: 'In 1838 Friedrich Bessel measured a parallax of about 0.314 arcseconds for 61 Cygni, which put it about 10 light years away. Gaia now gives about 0.286, so he was about 10 per cent high, but within his stated error. Others were close behind him, so who was first is not completely settled.' }],
  },
  {
    id: 'small',
    plate: 'III',
    kicker: 'Plate three',
    title: 'The thinnest angle',
    paras: [
      'An arcsecond is very small. A one euro coin, 23.25 millimetres across, spans one arcsecond from about 4.8 kilometres away. The air blurs starlight, so telescopes on the ground cannot measure parallaxes much smaller than about 0.01 arcseconds. That limits the reach to about 100 parsecs.',
      'Slide the angle, or pick an instrument. The page shows how far away the coin would be and how far a parallax of that size reaches. A parallax as small as the error is a poor distance, so this is a rough reach.',
    ],
  },
  {
    id: 'old',
    plate: 'IV',
    kicker: 'Plate four',
    title: 'Old light',
    paras: [
      'Light travels about 300,000 kilometres a second. A light year is the distance it covers in a year, about 9.46 trillion kilometres. The light of the Sun takes about 8.3 minutes to reach us. The light of Proxima Centauri takes about 4.24 years.',
      'Pick a star. What you see is the star as it was when the light left, not as it is now.',
    ],
    tags: [{ label: 'Gaia', text: 'The Gaia satellite, launched in 2013, has measured positions of about 1.8 billion sources. For about 1.5 billion of them the data release also has a parallax and a motion across the sky.' }],
  },
];

export const takeaways = [
  'Parallax is the small shift of a near star against far stars as the Earth moves round the Sun.',
  'The distance in parsecs is one divided by the parallax in arcseconds. One parsec is about 3.26 light years.',
  'Bessel measured the first parallax in 1838, for 61 Cygni, about 0.3 arcseconds. Even the nearest star, Proxima Centauri at about 4.24 light years, has a parallax under one arcsecond.',
  'From the ground the air limits parallax to about 0.01 arcseconds. Satellites above the air, Hipparcos and Gaia, measure far smaller angles.',
  'Light from a star is old. The light of Proxima Centauri left about 4.24 years ago and the light of the Sun about 8.3 minutes ago.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The parsec as one over the parallax in arcseconds and 206,265 AU, the factor of about 3.26 light years to the parsec, Bessel’s 0.314 arcseconds for 61 Cygni in 1838 and Gaia’s 0.286, the distances of Proxima Centauri (4.24), Alpha Centauri (4.37), Barnard’s Star (5.9) and Sirius (8.6) light years, the 0.01 arcsecond limit from the ground, Hipparcos at about 0.001 and launched in 1989, Gaia launched in 2013 with 25 microarcseconds as its aim, and about 1.8 billion Gaia sources each appeared in at least two places. The parallaxes on the page are worked out from the distances in light years, so they may differ in the last digit from published values (Proxima is often given as 0.77 arcseconds). Sources differ on how long Bessel observed and on who was first. The 61 Cygni distance of 11.4 light years is worked out from Gaia’s parallax. The size of the swing in plate one is magnified. The reach in plate three is the distance at which the parallax equals the instrument’s precision, which is a rough figure made for this page.';

export const sources = [
  { label: 'UNLV: stellar parallax', url: 'https://www.physics.unlv.edu/~jeffery/astro/star/parallax_stellar.html', for: 'How parallax and the parsec are defined.' },
  { label: 'EarthSky: what is a parsec', url: 'https://earthsky.org/space/what-is-a-parsec', for: 'The parsec as 3.26 light years.' },
  { label: 'arXiv: the first stellar parallaxes revisited', url: 'https://arxiv.org/pdf/2009.11913', for: 'Bessel, 61 Cygni and the rivals.' },
  { label: 'Wikipedia: 61 Cygni', url: 'https://en.wikipedia.org/wiki/61_Cygni', for: 'Its parallax and distance.' },
  { label: 'Linda Hall Library: Friedrich Bessel', url: 'https://www.lindahall.org/friedrich-wilhelm-bessel/', for: 'Bessel’s 1838 measurement.' },
  { label: 'Ohio State: distances to the stars', url: 'https://www.astronomy.ohio-state.edu/pogge.1/Ast162/Unit1/distances.html', for: 'The limit from the ground and Hipparcos.' },
  { label: 'Universe Today: nearest stars', url: 'https://www.universetoday.com/articles/nearest-stars', for: 'Distances to Proxima, Alpha Centauri, Barnard’s Star and Sirius.' },
  { label: 'Gaia early data release 3: summary', url: 'https://arxiv.org/pdf/2012.01533', for: 'The number of sources and parallaxes.' },
  { label: 'Wikipedia: astronomical unit', url: 'https://en.wikipedia.org/wiki/Astronomical_unit', for: 'The exact value of the AU.' },
];
