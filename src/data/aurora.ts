// Everything the "Why the sky has an aurora" page says, in one place.
// A column down through the sky, from space to the glow, with three things to try: how far the oval spreads with the Kp index,
// the colour at each height, and the light of one atom. The rule for the oval and the colours come from the sources,
// which differ on the heights, and the page says so.

export interface Panel {
  id: string;
  level: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Sunlight is not the only thing the Sun sends',
  paras: [
    'The Sun also blows a thin stream of charged particles into space, called the solar wind. Most of it is turned aside by the magnetic field around the Earth. Some is steered along the field lines toward the poles and into the thin air high up. There the particles knock into atoms of oxygen and nitrogen and give them a bit of extra energy. The atoms give it back as light. That is an aurora, the northern or southern lights.',
    'Three stops on the way down. Start in space and see how far from the pole the lights spread when the Sun is stormy. Come down to the air and see which colour belongs to which height. Then look at the light of one atom and the energy of its light. The sources disagree about some heights, and the page says where. Without a script each stop shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'oval',
    level: 'Space, thousands of kilometres up',
    kicker: 'First stop',
    title: 'How far south the lights spread',
    paras: [
      'The lights do not fall in a circle at the pole. They form a ring called the auroral oval, around the magnetic pole. On a quiet day the ring sits high in the north. When the solar wind is strong, the Kp index, a scale from 0 to 9 of how disturbed the Earth’s magnetic field is, goes up, and the ring widens toward the equator.',
      'Slide the Kp index. The page draws the edge of the oval from a rule of the US Space Weather Prediction Center: at Kp 0 the edge is at about 66 degrees of geomagnetic latitude, and it moves about 2 degrees toward the equator for each step of Kp. This is an average. The latitude is magnetic, not geographic, and the two are not the same.',
    ],
    tags: [
      { label: 'Check', text: 'The rule of 66 degrees minus 2 degrees for each step of Kp comes from NOAA and is an approximate average. One other source says that at Kp 9 the aurora is seen around 40 degrees of latitude, a little further than the rule gives (48).' },
    ],
  },
  {
    id: 'height',
    level: 'The thin air, 60 to 400 kilometres up',
    kicker: 'Second stop',
    title: 'A colour for each height',
    paras: [
      'The colour depends on which atom is hit and how high up. Oxygen gives the common green light, at about 100 to 150 kilometres. Higher up, above about 300 kilometres, oxygen gives a rarer red. Nitrogen gives blue and purple, mostly in the lower fringe of a display, where the air is thicker. In between, the sources disagree, and the page marks that part.',
      'Slide the height. The page names the colour and says what the sources agree on. The faint red needs calm, low energy conditions to be seen.',
    ],
    tags: [
      { label: 'Check', text: 'Sources put green at 100 to 150 kilometres or at 100 to 300. They put the start of red at 200 or 300. One blog said nitrogen gives red, which the others contradict, so the page leaves that out.' },
    ],
  },
  {
    id: 'light',
    level: 'One atom',
    kicker: 'Third stop',
    title: 'The light of an atom',
    paras: [
      'A single atom gives off light of a few exact colours. Excited oxygen gives green light at 557.7 nanometres and red at 630. A photon of light carries an energy that depends on its wavelength: the energy in electronvolts is 1239.84 divided by the wavelength in nanometres. So green light carries more energy per photon than red light.',
      'Slide the wavelength across the visible colours, or pick one of the two oxygen lines. The page gives the energy, the frequency and a rough colour. The colours on the screen are a drawing, and your screen cannot show the true colour of light of a single wavelength.',
    ],
  },
];

export const takeaways = [
  'The solar wind is steered by the Earth’s magnetic field toward the poles. There it excites oxygen and nitrogen atoms in the thin air, which give off the light.',
  'The aurora forms a ring called the auroral oval. At Kp 0 its edge is at about 66 degrees of magnetic latitude, and it moves about 2 degrees toward the equator for each step of Kp.',
  'Green, at about 100 to 150 kilometres, is atomic oxygen at 557.7 nanometres. Red, higher up, is oxygen at 630. Blue and purple come from nitrogen, low in the display.',
  'The energy of a photon in electronvolts is 1239.84 over its wavelength in nanometres. Green light carries more energy than red.',
  'Sources differ on the heights of the colours, so the lines between them are not sharp.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The solar wind being guided by the magnetic field into the upper air, oxygen and nitrogen atoms being excited and giving off light, green light of 557.7 nanometres from oxygen at about 100 to 150 kilometres, red light of 630 nanometres from oxygen higher up, blue and purple from nitrogen lower down, and the NOAA rule that the edge of the oval is at about 66 degrees of geomagnetic latitude at Kp 0 and moves about 2 degrees toward the equator for each step each appeared in at least one authoritative place and in several others. Sources differ on the top of the green (150 or 300 kilometres), on the start of the red (200 or 300), on the aurora at Kp 9 (about 40 degrees by one site and 48 by the rule), and one blog said nitrogen gives red, which the others contradict, so the page leaves that out. The Carrington event and the solar cycle were looked for and could not be confirmed, so they are not on the page. The photon energy (1239.84 divided by the wavelength) and the frequency are computed on the page, and the colours on screen are a rough drawing of a wavelength. The oval and the column are drawings.';

export const sources = [
  { label: 'NOAA Space Weather Prediction Center: tips on viewing the aurora', url: 'https://www.spaceweather.gov/content/tips-viewing-aurora', for: 'The Kp index and the oval.' },
  { label: 'NOAA SWPC: Kp and the aurora (archived)', url: 'https://webarchive.library.unt.edu/eot2008/20090114032943/http://www.swpc.noaa.gov/info/kp-aurora.html', for: 'The rule of 66 degrees and 2 degrees for each step.' },
  { label: 'NASA SPDF: northern lights activity', url: 'https://spdf.gsfc.nasa.gov/pub/data/image/documents/website/image.gsfc.nasa.gov/poetry/activity/nl9.pdf', for: 'How the aurora forms.' },
  { label: 'National Park Service: aurora', url: 'https://www.nps.gov/articles/aurora.htm', for: 'The mechanism and the heights.' },
  { label: 'UiT The Arctic University of Norway: the northern lights', url: 'https://site.uit.no/spaceweather/?p=3492', for: 'How the northern lights form.' },
  { label: 'Science ABC: what makes the aurora beautiful', url: 'https://www.scienceabc.com/nature/makes-aurora-borealis-beautiful', for: 'Colours and altitudes.' },
  { label: 'Space Weather and Space Climate: aurora and latitude', url: 'https://www.swsc-journal.org/articles/swsc/abs/2011/01/swsc110021/swsc110021.html', for: 'The oval and magnetic latitude.' },
  { label: 'Aurora Forecast: the Kp index', url: 'https://auroraforecast.is/kp-index/', for: 'What the Kp index means.' },
  { label: 'spaceweather.live: low, middle and high latitude', url: 'https://spaceweather.live/en/help/the-low-middle-and-high-latitude', for: 'Where the aurora can be seen.' },
  { label: 'Medium: why do the auroras occur', url: 'https://medium.com/everyday-science/auroras-fd556ceab633', for: 'The mechanism in short.' },
];
