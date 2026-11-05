// Everything the "How a moon weighs its planet" page says, in one place.
// A chalkboard with three things to try: Kepler's third law for the planets, weighing a planet from the time and distance of its moon, and
// what a heavier planet does to the same orbit. The law and the orbit numbers come from the sources, and the masses are worked out on
// the page with Newton's form of the law. The page says what the law does and does not tell you.

export interface Board {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Weighing a planet without touching it',
  paras: [
    'No one can put Jupiter on a scale. Yet we know its mass to a few places. The trick uses a moon. The time a moon takes to go round, and how far away it is, tell you how strongly its planet pulls, and so how heavy the planet is. It is the same idea that Kepler found for the planets going round the Sun.',
    'Three boards. On the first, check Kepler’s law on the planets. On the second, weigh the Earth and Jupiter from their moons. On the third, see what a heavier planet does to a moon at the same distance. The masses are worked out on the page from the numbers in the sources. Without a script each board shows one picture or table.',
  ],
};

export const boards: Board[] = [
  {
    id: 'law',
    kicker: 'First board',
    title: 'Kepler’s third law',
    paras: [
      'Johannes Kepler found that for the planets, the square of the time for one orbit is proportional to the cube of the distance from the Sun. In units of years and astronomical units, where Earth is one year and one unit, the two come out equal. A planet at 4 units away takes 8 years, because 4 times 4 times 4 is 64, and 8 times 8 is 64.',
      'Slide the distance to see the time. The table checks the law on five planets: the time squared over the distance cubed comes out at 1, to about one part in a thousand. The numbers for the planets are rounded values from the sources. The simple form only works for things going round the Sun, because the Sun’s mass is built into the 1.',
    ],
  },
  {
    id: 'weigh',
    kicker: 'Second board',
    title: 'Weigh a planet from its moon',
    paras: [
      'Newton showed why Kepler’s law holds, and gave it a form that works for anything going round anything. The mass of the thing in the middle is four times pi squared, times the distance cubed, divided by the gravitational constant times the time squared. The units must be metres, kilograms and seconds, not astronomical units.',
      'Pick a moon. The page puts in its distance and the time of its orbit and gives the mass of the planet. The Moon gives Earth’s mass to within about 1 per cent. Ganymede and Callisto, two moons of Jupiter at very different distances, give the same mass for Jupiter. That agreement is the proof that the method works.',
    ],
    tags: [
      { label: 'Check', text: 'The accepted masses are about 5.97 × 10^24 kilograms for the Earth and 1.898 × 10^27 kilograms for Jupiter. Jupiter is about 318 Earths.' },
    ],
  },
  {
    id: 'mass',
    kicker: 'Third board',
    title: 'A heavier planet, a faster moon',
    paras: [
      'Keep the distance the same as the Moon’s, 384,400 kilometres, and change the mass of the planet in the middle. A heavier planet pulls harder, so the moon must go round faster to stay in orbit. The time of one orbit falls with the square root of the mass.',
      'Slide the mass from a tenth of the Earth to about 3000 Earths. The marks show the Earth and Jupiter. At Jupiter’s mass, a moon at the Moon’s distance would go round in a day and a half instead of 27 days. These are worked-out numbers for a made-up moon, and a real moon of Jupiter is much further out.',
    ],
  },
];

export const takeaways = [
  'Kepler’s third law: for the planets, the square of the time of one orbit equals the cube of the distance, in years and astronomical units.',
  'The time squared over the distance cubed comes out close to 1 for each of the planets.',
  'Newton’s form gives the mass of the thing in the middle from the distance and time of something going round it.',
  'The Moon gives Earth’s mass to about 1 per cent, and two different moons of Jupiter give the same mass for Jupiter.',
  'A heavier planet makes a moon at the same distance go round faster.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Kepler’s third law in years and astronomical units, its general form with the gravitational constant, and the use of a moon to find the mass of its planet appeared in more than one place, and a source says the Moon gives Earth’s mass to about 1 per cent, which the page checks by computing 1.010. The orbit numbers of the planets (87.97, 224.7, 365.25, 686.98 and 4332.59 days, and 0.387, 0.723, 1, 1.524 and 5.203 astronomical units) were each seen in two places. The gravitational constant, 6.6743 × 10^-11, the mass of Jupiter, 1898 × 10^24 kilograms, and Earth’s mass, 5.972 × 10^24 kilograms, are from NASA and JPL pages. The periods of Ganymede (7.1546 days) and Callisto (16.689 days) and their distances (1,070,400 and 1,882,700 kilometres) came from encyclopaedia pages, and a search summary gave the same figures. The masses on the page are computed, and each moon gives Jupiter’s accepted mass to within a thousandth. The day count for the made-up moon at 384,400 kilometres ignores the mass of the moon. Nothing here is advice.';

export const sources = [
  { label: 'Ohio State: lecture 19, orbits', url: 'https://www.astronomy.ohio-state.edu/pogge.1/Ast161/Unit4/orbits.html', for: 'Kepler’s third law.' },
  { label: 'University of New Mexico: Newton’s form of Kepler’s third law', url: 'https://leo.phys.unm.edu/~gbtaylor/astr2110/lectures/07_GravitationPartIII.pdf', for: 'The general form of the law.' },
  { label: 'University of Texas: Kepler’s third law', url: 'https://farside.ph.utexas.edu/teaching/336k/Newton/node41.html', for: 'Newton’s derivation.' },
  { label: 'HSC Physics: Kepler’s laws of planetary motion', url: 'https://scienceready.com.au/pages/keplers-laws-of-planetary-motion', for: 'The law and units.' },
  { label: 'Science Facts: Kepler’s third law', url: 'https://www.sciencefacts.net/keplers-third-law.html', for: 'Worked examples.' },
  { label: 'NASA JPL: planetary physical parameters', url: 'https://ssd.jpl.nasa.gov/planets/phys_par.html', for: 'The masses and the constant G.' },
  { label: 'NASA NSSDC: Jupiter fact sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html', for: 'The period and distance of Jupiter.' },
  { label: 'Wikipedia: Jupiter mass', url: 'https://en.wikipedia.org/wiki/Jupiter_mass', for: 'The mass of Jupiter.' },
  { label: 'Wikipedia: Earth mass', url: 'https://en.wikipedia.org/wiki/Earth_mass', for: 'The mass of the Earth.' },
  { label: 'Wikipedia: Ganymede', url: 'https://en.wikipedia.org/wiki/Ganymede_(moon)', for: 'The orbit of Ganymede.' },
  { label: 'Wikipedia: Callisto', url: 'https://en.wikipedia.org/wiki/Callisto_(moon)', for: 'The orbit of Callisto.' },
  { label: 'Wikipedia: Mars', url: 'https://en.wikipedia.org/wiki/Mars', for: 'The orbit of Mars.' },
  { label: 'Wikipedia: Venus', url: 'https://en.wikipedia.org/wiki/Venus', for: 'The orbit of Venus.' },
  { label: 'Wikipedia: Mercury (planet)', url: 'https://en.wikipedia.org/wiki/Mercury_(planet)', for: 'The orbit of Mercury.' },
];
