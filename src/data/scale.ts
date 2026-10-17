// Everything the "The solar system to scale" page says, in one place.
// A long road from the Sun and four things to try: shrink the Sun, walk the road, guess a distance, and time a trip.
// The distances and sizes come from the sources. The models are scaled down by a fixed number, so they are exact.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A road that is mostly empty',
  paras: [
    'Pictures of the solar system put the planets close together so they fit on a page. In real space they are very far apart. The Sun is a ball more than a million kilometres wide, and the planets are small dots in an enormous gap.',
    'Four things to try. Shrink the Sun to a pea or an apple and see how far away the planets would be. Walk the road from the Sun. Guess how far a planet is, and see how far off you are. And find how long a trip takes by foot, car, jet, spacecraft and light. The distances are averages, because the planets move on ovals. Without a script each part shows one table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'shrink',
    kicker: 'Stop one',
    title: 'Shrink the Sun',
    paras: [
      'Pick a size for the Sun. Everything else shrinks by the same number, so the distances and the planets stay in proportion. With a Sun the size of an apple, the Earth is a speck less than a millimetre wide, about 9 metres away. Look at the table.',
      'The table shows how far each planet is from the Sun and how big it is in the model. The planets are tiny, and the distances are huge compared with their size.',
    ],
  },
  {
    id: 'walk',
    kicker: 'Stop two',
    title: 'Walk the road',
    paras: [
      'Now the Sun is an apple, 8 centimetres across. Slide along the road from the Sun. The strip shows where each planet would be. You pass the four rocky planets in the first stretch, and then a long walk to Jupiter.',
      'Walking at an easy pace of about 1.4 metres a second, the status tells how long your walk has taken and what you come to next.',
    ],
  },
  {
    id: 'guess',
    kicker: 'Stop three',
    title: 'Guess the distance',
    paras: [
      'The outer planets are very far out. Pick a planet and slide to where you think it would be on the road, with the Sun an apple at the start.',
      'Check your guess. The page tells you how many times too near or too far you were. The distances are the mean distances from NASA and JPL material, rounded.',
    ],
  },
  {
    id: 'trip',
    kicker: 'Stop four',
    title: 'How long would it take',
    paras: [
      'Pick a planet and read how long the trip from the Sun takes at different speeds. Light takes about 8 minutes to reach Earth and about 4 hours to reach Neptune. A jet plane would need years. Voyager 1, which moves at about 17 kilometres a second, left Earth in 1977 and is now about 160 astronomical units from the Sun, which light covers in nearly a day.',
      'These are straight line trips from the Sun at a steady speed. Real space missions bend their paths and gain speed from planets on the way.',
    ],
    tags: [{ label: 'One astronomical unit', text: 'The astronomical unit, AU, is the average distance from the Earth to the Sun, about 149.6 million kilometres. Distances inside the solar system are often given in AU.' }],
  },
];

export const takeaways = [
  'Shrink the Sun to an apple and the planets become specks metres apart. The solar system is mostly empty space.',
  'Light takes about 8 minutes to cross from the Sun to Earth, and about 4 hours to reach Neptune.',
  'The outer planets are very far out. Neptune is about 30 times as far from the Sun as the Earth.',
  'At a steady 17 kilometres a second, Voyager 1 would need about 100 days to cover the distance from the Sun to Earth.',
  'The distances are averages. Planets move on ovals, and the distance changes during the year.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The mean distances of the planets in astronomical units (Mercury 0.39, Venus 0.72, Mars 1.52, Jupiter 5.2, Saturn 9.58, Uranus 19.2, Neptune about 30.05), the astronomical unit of about 149.6 million kilometres, light taking about 8 minutes 20 seconds from the Sun to Earth and about 4 hours to Neptune, and Voyager 1 at about 17 kilometres a second and about 160 astronomical units from the Sun in 2025 all appeared in at least two places. Sources differ in the last digit for Saturn and Neptune, so the page uses the NASA fact sheet values. The sizes of the Sun and the planets, and the launch of Voyager 1 in 1977, are from general knowledge and were not in the search results. The page works out the scale models and trip times itself, with a steady speed, and treats the Voyager figures as approximate.';

export const sources = [
  { label: 'NASA JPL: scale of the solar system', url: 'https://www.jpl.nasa.gov/_edu/pdfs/scaless_reference.pdf', for: 'Planet distances in astronomical units.' },
  { label: 'WorldAtlas: how far is each planet', url: 'https://worldatlas.com/space/how-far-is-each-planet.html', for: 'Distances of the planets.' },
  { label: 'EarthSky: the astronomical unit', url: 'https://earthsky.org/space/what-is-the-astronomical-unit/', for: 'The definition of the AU and the NASA fact sheet values.' },
  { label: 'Universe Today: how far are the planets', url: 'https://www.universetoday.com/articles/how-far-are-the-planets-from-the-sun', for: 'Planet distances.' },
  { label: 'New World Encyclopedia: astronomical unit', url: 'https://www.newworldencyclopedia.org/entry/Astronomical_unit', for: 'The size of the AU.' },
  { label: 'NASA Glenn: space math worksheet', url: 'https://www.grc.nasa.gov/www/K-12/WindTunnel/Activities/space_math_wkst1.html', for: 'Light travel times in the solar system.' },
  { label: 'NASA: Solar System activity', url: 'https://www.nasa.gov/wp-content/uploads/2015/01/yoss_act1.pdf', for: 'Scale models of the solar system.' },
  { label: 'PopSci: Voyager 1 almost one light day away', url: 'https://popsci.com/science/voyager-one-light-day-earth', for: 'Voyager 1 and the light day.' },
];
