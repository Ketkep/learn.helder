// Everything the "Tides and the Moon" page says, in one place.
// The page is a harbour wall with a tide staff on it. Each bench has one tool, and the tool moves the water on the staff.

export interface Bench {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  /** The caption in the corner of the picture. */
  chyron: string;
  /** Small paper tags, each with one extra fact. */
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Harbour log',
  paras: [
    'A tide staff is a painted ruler fixed to a harbour wall. It shows how high the sea stands. The one on this page sits next to the benches below (above them on a phone).',
    'Each bench has one thing to try. Whatever you move, the water on the staff moves with it. The staff uses a made-up scale, so read it as high and low, not as metres.',
  ],
};

export const benches: Bench[] = [
  {
    id: 'bulges',
    kicker: 'Bench one',
    title: 'Two bulges, not one',
    chyron: 'Looking down on the North Pole. Not to scale.',
    paras: [
      'The Moon pulls on every part of the Earth, but not equally. The sea on the Moon side is pulled harder than the centre of the Earth, and the centre is pulled harder than the sea on the far side.',
      'Measured from the centre, the near water is pulled towards the Moon and the far water is left behind. That makes two bulges of water: one facing the Moon and one on the opposite side.',
      'The Earth turns under the bulges. A coast passes through both of them in one turn, so most coasts get two high tides and two low tides.',
    ],
    tags: [
      {
        label: 'Not to scale',
        text: 'The Moon is about 384,400 km away and the Earth is about 6,371 km in radius. The bulges are drawn thousands of times too tall, so you can see them.',
      },
      {
        label: 'Not the whole story',
        text: 'Real oceans cannot keep up with the bulges, and continents get in the way. Real tides are long waves that roll around the ocean basins, so the times and sizes differ from coast to coast.',
      },
    ],
  },
  {
    id: 'clock',
    kicker: 'Bench two',
    title: 'Fifty minutes late',
    chyron: 'One day on a tide clock. The first high tide on day 1 is made up.',
    paras: [
      'The Moon travels around the Earth in the same direction as the Earth spins. When the Earth has turned once, the Moon has moved on, so the Earth needs a little longer to catch up with it.',
      'That makes a lunar day 24 hours and 50 minutes long. High tides come about 12 hours and 25 minutes apart, so each day the tides arrive about 50 minutes later than the day before.',
      'Move the day and watch the high tides slide along the clock.',
    ],
    tags: [
      {
        label: 'One high tide only',
        text: 'Because 24 hours is a bit less than two tides, now and then a day has only one high water. The tool shows it. Real tide tables also move times around by hours, because the shape of the coast changes them.',
      },
    ],
  },
  {
    id: 'spring',
    kicker: 'Bench three',
    title: 'Big tides, small tides',
    chyron: 'Looking down on the North Pole. Sizes and distances are not to scale.',
    paras: [
      'The Sun makes tides too. It is far bigger than the Moon, but also far away. Its tide is only about 46 per cent as strong as the Moon’s.',
      'At new moon and full moon the Sun, Earth and Moon line up, the two tides add together, and the range is large. These are spring tides. At the quarter moons the pulls are at right angles and partly cancel. These are neap tides.',
      'So the tide swings between big and small about every two weeks. Drag the Moon around its month and read the range.',
    ],
    tags: [
      {
        label: 'Not the season',
        text: 'Spring tides have nothing to do with spring. The name comes from the sea “springing up”.',
      },
      {
        label: 'Two calendars',
        text: 'The Moon goes once around the Earth in 27.32 days, but the phases take 29.53 days to repeat, because the Earth has moved round the Sun in the meantime. The tides follow the phases.',
      },
      {
        label: 'Close and far',
        text: 'The Moon’s orbit is an oval. Its distance changes from about 363,000 km to about 406,000 km, and tides are bigger when the Moon is nearer.',
      },
    ],
  },
  {
    id: 'basin',
    kicker: 'Bench four',
    title: 'The sea is a bath tub',
    chyron: 'A toy tank from the side. The dark band is the range of the tide. Not a real bay.',
    paras: [
      'The Moon sets the beat. How big the tide grows at a coast depends on the shape of the water there.',
      'Water in a basin sloshes back and forth at its own natural period, which depends on how long and how deep it is. If the natural period matches the 12 hours 25 minutes beat, each push adds to the last one, like pushing a swing at the right moment. This is called resonance.',
      'Slide the length and depth of the tank and see how much bigger it makes the tide.',
    ],
    tags: [
      {
        label: 'The record',
        text: 'The Bay of Fundy in Canada has a natural period of about 12 to 13 hours. At Burntcoat Head the mean spring range is 14.5 m, and the largest range recorded there is 16.3 m.',
      },
      {
        label: 'The other end',
        text: 'Enclosed seas such as the Mediterranean are small and cannot be pushed far. Their tides are only about 30 cm.',
      },
    ],
  },
];

export const takeaways = [
  'Most coasts have two high tides a day, because the Moon raises two bulges of water, one on each side of the Earth.',
  'A lunar day is 24 hours and 50 minutes, so the tides arrive about 50 minutes later each day.',
  'The Sun’s tide is about 46 per cent of the Moon’s. When they line up (new moon, full moon) the tides are biggest. At the quarter moons they are smallest.',
  'The Moon sets the beat and the shape of the sea sets the size. A bay that sloshes at the same rhythm gets enormous tides.',
  'The tools on this page are toy models. For real plans at the coast, use an official tide table.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The key numbers (24 h 50 min, 12 h 25 min, 46 per cent, 14.5 m and 16.3 m, 12 to 13 hours) each appeared in at least two places. The pictures and tools are toy models made for this page. The tide staff uses a made-up scale. This page is not a tide table and is not for planning anything at the coast.';

export const sources = [
  { label: 'NOAA Ocean Service: the lunar day', url: 'https://oceanservice.noaa.gov/education/tutorial_tides/tides05_lunarday.html', for: 'A lunar day is 24 h 50 min. High tides are 12 h 25 min apart.' },
  { label: 'NOAA Ocean Service: variations in tides', url: 'https://oceanservice.noaa.gov/education/tutorial_tides/tides06_variations.html', for: 'Spring and neap tides, and the Sun’s share of the Moon’s pull.' },
  { label: 'NOAA Ocean Service: perigean spring tide', url: 'https://oceanservice.noaa.gov/facts/perigean-spring-tide.html', for: 'Bigger tides when the Moon is close.' },
  { label: 'TU Delft, Coastal Dynamics: the tide-generating force', url: 'https://geo.libretexts.org/Bookshelves/Oceanography/Coastal_Dynamics_(Bosboom_and_Stive)/03%3A_Ocean_waves/3.07%3A_Generation_of_the_tide/3.7.3%3A_Differential_pull_or_the_tide-generating_force', for: 'Why the pull differs across the Earth, and the ratio of about 0.46 for the Sun.' },
  { label: 'VIMS: the equilibrium theory of tides', url: 'https://www.vims.edu/research/units/labgroups/tc_tutorial/static.php', for: 'Two bulges, and why real tides differ from the simple picture.' },
  { label: 'Matt Strassler: tides and the Moon', url: 'https://profmattstrassler.com/?p=15718', for: 'The two-week cycle of larger and smaller tides.' },
  { label: 'EarthSky: tides and the pull of the Moon and Sun', url: 'https://earthsky.org/earth/tides-and-the-pull-of-the-moon-and-sun', for: 'Plain overview of the same ideas.' },
  { label: 'NASA JPL: lunar distance', url: 'https://ssd.jpl.nasa.gov/glossary/LD.html', for: 'The mean Earth to Moon distance, 384,400 km.' },
  { label: 'Guinness World Records: greatest tidal range', url: 'https://www.guinnessworldrecords.com/world-records/73813-highest-tide-average', for: 'Burntcoat Head: mean spring range 14.5 m, extreme range 16.3 m.' },
  { label: 'Bay of Fundy: highest tides', url: 'https://bayoffundy.com/about/highest-tides', for: 'Why the Bay of Fundy has the biggest tides, including resonance.' },
  { label: 'Garrett (1972), Nature: tidal resonance in the Bay of Fundy and Gulf of Maine', url: 'https://www.doi.org/10.1038/238441A0', for: 'A natural period close to the 12.4 hour tide.' },
  { label: 'Tides Atlas: why France has Europe’s biggest tides', url: 'https://tidesatlas.com/en/blog/france-biggest-tides-europe-tidal-ranges', for: 'Tiny Mediterranean tides and big Atlantic ones.' },
];
