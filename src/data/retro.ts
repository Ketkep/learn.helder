// Everything the "Why the planets seem to go backwards" page says, in one place.
// A dome with three things to try: watch Earth overtake a planet from above, graph its direction in the sky, and compare the two old
// stories that explain the loop. The orbit sizes and periods come from the sources. The orbits are drawn as flat circles around the Sun,
// which is a simplification, so the length of each loop on the page is for this simplified model and real loops differ a little.

export interface Seat {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'The planet that stops, turns and goes on',
  paras: [
    'Night after night, the planets drift slowly eastward against the stars. Now and then one of them stops, slides backwards for weeks, stops again and goes on. People watched this for thousands of years. The planet does not turn round. We are the ones moving.',
    'Three seats under the dome. In the first, look down on the Sun and watch the Earth overtake a planet. In the second, graph the direction of that planet in the sky, day by day. In the third, compare the two old stories that explain the loop. The orbit sizes and times come from the sources. The orbits are drawn as flat circles, which is a simplified model, so the lengths of the loops are for that model. Without a script each seat shows one picture.',
  ],
};

export const seats: Seat[] = [
  {
    id: 'orbit',
    kicker: 'First seat',
    title: 'Earth overtakes a planet',
    paras: [
      'Look down on the solar system from above the Sun. The Earth and a planet both go round the Sun in the same direction. A planet closer to the Sun is faster and a planet farther out is slower. So now and then the Earth passes a planet outside it, like a fast car on a motorway passing a slower one.',
      'The line from you to the planet is your line of sight. As you pass, that line swings the other way for a while. Slide the day and pick a planet. At day 0 the Earth is level with the planet, at the middle of the backwards swing. The white dashed line is the fixed direction of the far stars, and the angle to it is where the planet seems to be.',
    ],
  },
  {
    id: 'graph',
    kicker: 'Second seat',
    title: 'The direction day by day',
    paras: [
      'Now follow only the direction of the planet in the sky, measured against the far stars. Most of the time the line climbs, which is the normal drift. For a few weeks it turns round and falls, and then it climbs again. That dip is the retrograde loop.',
      'Pick a planet and slide the day. The page tells you how many days the loop lasts and how far the planet seems to move back, in this simplified model. The planets that are closer to the Sun than the Earth have shorter loops, and a planet far out has a long, shallow one. A loop comes once every time the Earth catches up, about every 26 months for Mars.',
    ],
    tags: [
      { label: 'Not astrology', text: 'Mercury seems to go backwards three or four times a year, for about three weeks each time. This is an optical effect of where we stand. It changes nothing physical.' },
    ],
  },
  {
    id: 'stories',
    kicker: 'Third seat',
    title: 'Two stories, one sky',
    paras: [
      'Ptolemy, in ancient Greece and Egypt, put the Earth in the middle. A planet rode a small circle, an epicycle, and the middle of that small circle rode a big circle, the deferent, round the Earth. Add the two motions and the planet loops. Copernicus put the Sun in the middle and let the Earth overtake the planet. This is a simplification of both, but they give the same direction in the sky.',
      'Move the day and watch both pictures. They point at the same place all the time, so the sky alone could not tell them apart. What Copernicus gave for free was the timing: the loop of an outer planet always falls when the Earth is level with it, and the planet is closest and brightest then. The older story had to be fitted to do this.',
    ],
    tags: [
      { label: 'History', text: 'Copernicus still used small circles, but he explained that the loop was only apparent: the Earth moves, and overtakes a slower planet.' },
    ],
  },
];

export const takeaways = [
  'A planet does not turn round. The Earth overtakes it, or it overtakes the Earth, and our line of sight swings the other way for a while.',
  'Planets outside the Earth’s orbit go backwards when the Earth passes them. The planets inside it do so when they pass the Earth.',
  'The loop is longest for a far planet and shortest for Mercury, and comes once each time the two line up again.',
  'Ptolemy’s circle on a circle and Copernicus’s Sun in the middle give the same direction in the sky. The difference is in what each explains for free.',
  'The backwards motion is an effect of where we stand. It changes nothing physical, and no sign or horoscope depends on it.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. That retrograde motion is an apparent effect of the Earth overtaking an outer planet or being overtaken by an inner one, that the loops of the outer planets come at opposition, that Ptolemy used a deferent and an epicycle, and that Copernicus explained the loop by the Earth’s motion each appeared in several places. A period of 686.98 days and a distance of 1.524 astronomical units for Mars, 4332.59 days and 5.203 for Jupiter, 224.7 days and 0.723 for Venus and 87.97 days and 0.387 for Mercury, and a time between lining up of about 780 days for Mars, were each seen in two places. The lengths of the loops on the page (about 22 days for Mercury, 42 for Venus, 72 for Mars and 120 for Jupiter) are computed on the page with flat circular orbits. They were not found in a source for real loops, so they are for this simplified model, and real loops differ a little. The claim that Mercury goes backwards three or four times a year for about three weeks was seen at the Planetary Society. Saturn is left out because its distance was not confirmed. Nothing here is advice and the page says astrology has no physical basis.';

export const sources = [
  { label: 'Planetary Society: what does Mercury in retrograde mean', url: 'https://www.planetary.org/articles/what-does-mercury-in-retrograde-actually-mean', for: 'Apparent retrograde motion, and how often Mercury does it.' },
  { label: 'NRAO: Mars retrograde motion', url: 'https://public.nrao.edu/ask/mars-retrograde-motion/', for: 'Why Mars seems to go backwards.' },
  { label: 'Wikipedia: apparent retrograde motion', url: 'https://en.wikipedia.org/wiki/Apparent_retrograde_motion', for: 'The cause of the loops.' },
  { label: 'Saint Mary’s University: how does retrograde motion work', url: 'https://demos.smu.ca/demos/astronomy/27-retrograde-motion', for: 'Earth overtaking a planet.' },
  { label: 'SUNY Oneonta: explaining retrograde motion of the planets', url: 'http://employees.oneonta.edu/gallagha/a108_s10_web/a108_s10_0208.pdf', for: 'The loops at opposition.' },
  { label: 'Ohio State: Ptolemy to Copernicus', url: 'https://www.astronomy.ohio-state.edu/weinberg.21/A161/lecture5.html', for: 'The two models compared.' },
  { label: 'Space.com: the geocentric model', url: 'https://www.space.com/geocentric-model', for: 'Deferent and epicycle.' },
  { label: 'Wikipedia: Copernican heliocentrism', url: 'https://en.wikipedia.org/wiki/Copernican_heliocentrism', for: 'Copernicus’s explanation.' },
  { label: 'Stanford Encyclopedia of Philosophy: Nicolaus Copernicus', url: 'https://plato.stanford.edu/entries/copernicus/', for: 'Copernicus and the apparent motion.' },
  { label: 'NASA NSSDC: Jupiter fact sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html', for: 'The period and distance of Jupiter.' },
  { label: 'Wikipedia: Mars', url: 'https://en.wikipedia.org/wiki/Mars', for: 'The period of Mars and the time between lining up.' },
  { label: 'Wikipedia: Venus', url: 'https://en.wikipedia.org/wiki/Venus', for: 'The period and distance of Venus.' },
  { label: 'Wikipedia: Mercury (planet)', url: 'https://en.wikipedia.org/wiki/Mercury_(planet)', for: 'The period and distance of Mercury.' },
  { label: 'NMSU: planetary configurations and periods', url: 'http://astronomy.nmsu.edu/kurt/Astronomy110G/Handouts/Configurations&Periods.pdf', for: 'The time between lining up.' },
];
