// Everything the "Why we have seasons" page says, in one place.
// The page is a wall of four instruments. Each one shows one reason the year has seasons.

export interface Instrument {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'On the wall',
  paras: [
    'Four instruments hang on this wall. Each one shows a different part of why the year has seasons. Turn the dials and read the numbers. They are worked out from the tilt of the Earth, so you can check them against an almanac.',
    'The northern hemisphere is the half of the Earth above the equator, where Europe is. When it is summer in the north, it is winter in the south, and the other way round.',
  ],
};

/** Places for the latitude buttons. The latitudes are rounded. */
export const places = [
  { name: 'Quito', short: 'Equator', lat: 0 },
  { name: 'Sydney', short: 'Sydney', lat: -33.9 },
  { name: 'Amsterdam', short: 'Amsterdam', lat: 52.4 },
  { name: 'Tromso', short: 'Tromso', lat: 69.6 },
  { name: 'The South Pole', short: 'South Pole', lat: -90 },
];

export const instruments: Instrument[] = [
  {
    id: 'orbit',
    kicker: 'Instrument one',
    title: 'Not the distance',
    paras: [
      'Many people think summer comes when the Earth is closest to the Sun. It does not. The Earth is closest in early January, about 147.1 million km away, and farthest in early July, about 152.1 million km away. That is a difference of about 3 per cent, and the north has its winter when the Earth is closest.',
      'Move the date through the year. Watch the distance, and watch which half of the Earth leans towards the Sun.',
    ],
    tags: [
      { label: 'Not to scale', text: 'The Sun and the Earth are drawn far too big, and the orbit is nearly a perfect circle in real life. The Earth’s axis always points the same way in space, which is why it leans towards the Sun in June and away in December.' },
    ],
  },
  {
    id: 'tilt',
    kicker: 'Instrument two',
    title: 'What if the tilt changed?',
    paras: [
      'The seasons come from the tilt. The Earth’s axis is tilted about 23.4 degrees away from straight up as the Earth goes round the Sun. When the north leans towards the Sun, the Sun climbs higher there and the days get longer. Half a year later it leans away.',
      'The chart shows how long the days are through the year at one place. Change the tilt. With no tilt there are no seasons at all. With a big tilt they would be extreme.',
    ],
    tags: [
      { label: 'The Arctic Circle', text: 'The Arctic Circle lies at about 66.5 degrees north. That is 90 degrees minus the tilt. Inside it the Sun does not set at midsummer and does not rise at midwinter. Change the tilt and that line would move.' },
    ],
  },
  {
    id: 'day',
    kicker: 'Instrument three',
    title: 'A day on the clock',
    paras: [
      'This 24 hour clock shows daylight in yellow and night in dark blue. Pick a place and a date. Near the equator, day and night stay close to 12 hours all year. Far from it, the days swing between long and short.',
      'In Amsterdam the longest day is about 16 hours 48 minutes and the shortest about 7 hours 40 minutes. At the poles the Sun stays up for months, then down for months.',
    ],
    tags: [
      { label: 'Sun time', text: 'The clock uses sun time: noon is when the Sun is highest. Your own clock differs by the time zone and by summer time. The numbers match almanacs to within minutes for Amsterdam. Close to the Arctic Circle they can be a few days out.' },
    ],
  },
  {
    id: 'shadow',
    kicker: 'Instrument four',
    title: 'A stick in the sun',
    paras: [
      'Since ancient times people have used a stick in the ground to follow the Sun. At noon the Sun is highest and the shadow is shortest. Through the year the noon shadow of a stick grows and shrinks.',
      'In the north the Sun is in the south at noon, so the shadow points north. Near the equator at the equinox the noon shadow almost disappears. Pick a place and move through the year.',
    ],
  },
];

export const takeaways = [
  'The seasons come from the tilt of the Earth’s axis, about 23.4 degrees. They do not come from the distance to the Sun.',
  'The Earth is closest to the Sun in early January (about 147.1 million km) and farthest in early July (about 152.1 million km). The north has winter when the Earth is closest.',
  'The hemisphere that leans towards the Sun gets a higher Sun and longer days. The other hemisphere has the opposite season at the same time.',
  'Far from the equator the days swing a lot: in Amsterdam from about 7 hours 40 minutes to about 16 hours 48 minutes. Near the equator they hardly change.',
  'The Arctic Circle is at 90 degrees minus the tilt, about 66.5 degrees north.',
  'The instruments are models. They leave out weather, hills and summer time.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The tilt of 23.44 degrees, the distances of 147.1 and 152.1 million km, the dates of the solstices and equinoxes, the Arctic Circle at 66.5 degrees, and the Amsterdam day lengths (16 h 48 min and 7 h 40 min) each appeared in at least two places. The Sun maths is the standard approximation for the Sun’s height through the year. It was tested against the Amsterdam day lengths (it matches to the minute) and against the midnight sun in Tromso (it is out by a few days). The instruments ignore weather, hills and summer time.';

export const sources = [
  { label: 'Universe Today: Earth’s axial tilt', url: 'https://www.universetoday.com/47176/earths-axis/', for: 'The tilt of about 23.44 degrees and how it causes the seasons.' },
  { label: 'Discover Magazine: at the bottom of Earth’s orbit', url: 'https://www.discovermagazine.com/at-the-bottom-of-earths-orbit-22665', for: 'The Earth is closest to the Sun in early January.' },
  { label: 'The Sun Today: perihelion and aphelion', url: 'https://www.thesuntoday.org/solstice-equinox/aphelion-2026/', for: 'The distances at perihelion and aphelion, and their dates.' },
  { label: 'Farmers’ Almanac: equinox and solstice dates', url: 'https://www.farmersalmanac.com/equinox-solstice', for: 'The dates of the equinoxes and solstices.' },
  { label: 'Wikipedia: Arctic Circle', url: 'https://en.wikipedia.org/wiki/Arctic_Circle', for: 'The Arctic Circle, the midnight sun and the polar night.' },
  { label: 'Universal Time Date: daylight hours in Amsterdam', url: 'https://www.universaltimedate.com/daylight-hours/amsterdam', for: 'The longest and shortest days in Amsterdam.' },
  { label: 'timeanddate.com: sun in Tromso', url: 'https://timeanddate.com/sun/norway/tromso', for: 'The midnight sun and the polar night in Tromso.' },
  { label: 'University of Washington: the solstice (PDF)', url: 'https://sites.math.washington.edu/~aloveles/Projects/Soltice.pdf', for: 'Day length from latitude and the Sun’s declination.' },
  { label: 'NOAA Global Monitoring Laboratory: solar calculator', url: 'https://gml.noaa.gov/grad/solcalc/', for: 'The way the Sun’s position is calculated.' },
];
