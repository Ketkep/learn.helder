// Everything the "How fast is light" page says, in one place.
// A beam of light is fixed at the top of the screen. Four panels send it somewhere and read the time it took.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'One beam',
  paras: [
    'Light travels at 299,792 kilometres every second. That is so fast that on Earth it seems to arrive the moment it leaves. In space it does not. Even the light from the Sun is eight minutes old when you see it.',
    'A beam of light is fixed at the top of the screen. Each panel below sends it to a different place and reads how long it took. Without a script, each panel gives its times in a table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'moon',
    kicker: 'Call one',
    title: 'The Moon and back',
    paras: [
      'The Moon is about 384,400 km away, so light needs 1.28 seconds to get there. Astronauts left small mirrors on the Moon in 1969. Scientists aim a laser at them and time how long the pulse takes to come back. That gives the distance to the Moon to about a millimetre.',
      'The Moon is not always the same distance away, because its orbit is an oval. Move the distance and send a pulse to the mirror. The time out and back is what the scientists measure.',
    ],
    tags: [
      { label: 'A hard shot', text: 'The laser beam spreads out on the way, and only about one photon in 250 million comes back to a telescope. So the stations fire thousands of pulses and count the few that return.' },
    ],
  },
  {
    id: 'ladder',
    kicker: 'Call two',
    title: 'Old light',
    paras: [
      'Light takes time, so everything you see is a little in the past. Moonlight is 1.3 seconds old. Sunlight is 8 minutes and 19 seconds old. The light from Neptune left about four hours ago.',
      'Pick a place and send the beam. The clock at the top counts the light seconds. The animation is sped up and squeezed, so the long trips do not take hours. The numbers are true.',
    ],
    tags: [
      { label: 'One light-day', text: 'NASA worked out that Voyager 1, launched in 1977, will be one light-day from Earth on 18 November 2026. A radio signal sent to it then takes a whole day to arrive.' },
    ],
  },
  {
    id: 'talk',
    kicker: 'Call three',
    title: 'Talking to Mars',
    paras: [
      'Radio waves are light too, so a message to a rover on Mars goes at the speed of light, and that is still slow. Mars is between 3 and 22 minutes of light away, depending on where the two planets are in their orbits.',
      'You cannot have a chat with a delay like that. A question takes the one-way time to arrive and the answer takes the same time to come back. Try asking one question, then five, one at a time, then five in one message.',
    ],
    tags: [
      { label: 'A toy model', text: 'This panel assumes the rover answers at once. A real team also needs time to read the reply and decide what to ask. The waiting here is only the light, so it is the least time possible.' },
    ],
  },
  {
    id: 'year',
    kicker: 'Call four',
    title: 'How long is a year of light',
    paras: [
      'A light-year is a distance, not a time. It is how far light goes in one year: about 9.46 trillion kilometres. The nearest star after the Sun is Proxima Centauri, 4.24 light-years away, which is about 40 trillion kilometres.',
      'Choose how fast you travel and see how long the trip takes. Walking, a jet, the fastest spacecraft that has left the Solar System, and light. The rounded numbers are huge, which is the point.',
    ],
    tags: [
      { label: 'Voyager 1 speed', text: 'Voyager 1 moves away from the Sun at about 17 kilometres a second. That is fast for a spacecraft, but it is about 17,600 times slower than light.' },
    ],
  },
];

export const takeaways = [
  'Light in a vacuum travels at exactly 299,792,458 metres per second. The metre is defined from it.',
  'Light takes time to travel: 1.28 seconds from the Moon, 8 minutes 19 seconds from the Sun and about 4 hours from Neptune.',
  'We see the Sun and the stars as they were. The farther away, the older the light.',
  'Signals to Mars take 3 to 22 minutes one way, so a rover cannot be driven in real time.',
  'A light-year is a distance of about 9.46 trillion km. Proxima Centauri is 4.24 light-years away: about 75,000 years at Voyager speed.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The exact speed of light, the Moon at 384,400 km and 1.28 seconds, the Sun at about 8 minutes 19 seconds, Mars at about 3 to 22 minutes, Jupiter at about 33 to 54 minutes, Neptune at about 4 hours, Proxima Centauri at 4.24 light-years and Voyager 1 reaching one light-day on 18 November 2026 each appeared in at least two places. One search result gave 12 minutes for the closest Mars, which is wrong, so it was not used. Distances change as the planets move, so the times are typical values. The Voyager 1 speed of 17 km/s is rounded, and the trip times in the last panel are rounded sums made for this page.';

export const sources = [
  { label: 'Wikipedia: speed of light', url: 'https://en.wikipedia.org/wiki/Speed_of_light', for: 'The exact value and the definition of the metre.' },
  { label: 'NIST: the SI base unit for length', url: 'https://tf.nist.gov/general/pdf/527.pdf', for: 'The metre is fixed by the speed of light.' },
  { label: 'NASA: measuring the Moon’s distance', url: 'https://eclipse.gsfc.nasa.gov/help/ApolloLaser.html', for: 'Apollo mirrors and laser ranging.' },
  { label: 'NIST: the Moon and back in 25 seconds', url: 'https://www.nist.gov/history/moon-and-back-25-seconds', for: 'Laser pulses to the Moon and the round trip time.' },
  { label: 'Lunar laser ranging: the millimetre challenge (arXiv)', url: 'https://arxiv.org/pdf/1309.6294', for: 'The Moon’s distance range and the weak return signal.' },
  { label: 'Space.com: how long to get to Jupiter', url: 'https://www.space.com/how-long-does-it-take-to-get-to-jupiter', for: 'Light time to Jupiter, 33 to 54 minutes.' },
  { label: 'University of Oregon: light distance to Jupiter', url: 'https://pages.uoregon.edu/jimbrau/astr121/Notes/Jupiter/jupiterradio.html', for: 'Jupiter at about 4 AU.' },
  { label: 'I’m a Scientist: light from Earth to Neptune', url: 'https://archive.imascientist.org.uk/physicsn20-zone/question/how-many-seconds-or-minutes-will-it-take-a-light-to-go-from-earth-to-neptune/index.html', for: 'Neptune at 4 to 4.5 light-hours (NASA fact sheet).' },
  { label: 'EarthSky: Voyager 1 one light-day', url: 'https://earthsky.org/space/voyager-1-1-light-day-from-earth-november-17-18-2026/', for: 'NASA’s date of 18 November 2026.' },
  { label: 'PopSci: Voyager 1 is almost one light-day away', url: 'https://popsci.com/science/voyager-one-light-day-earth', for: 'One light-day is about 25.9 billion km.' },
  { label: 'Wikipedia: Proxima Centauri', url: 'https://en.wikipedia.org/wiki/Proxima_Centauri', for: 'About 4.24 light-years away.' },
];
