// Everything the "How a sundial tells the time" page says, in one place.
// Three stone slabs with one thing to try on each: how the shadow moves over a flat dial, why the shadow-casting edge must tilt at the
// latitude, and why a sundial and a clock disagree. The geometry and the history come from the sources. The equation of time is an
// approximate formula, so the minutes on the page are close and not exact.

export interface Slab {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A shadow that keeps the hours',
  paras: [
    'A sundial tells the time with a shadow. A pointed edge, called the gnomon or the style, sticks up from a flat plate. As the Sun moves round the sky, the shadow of the edge turns across the plate and falls on marks for the hours. It has no parts that move and needs no power.',
    'Three slabs to try. On the first, slide the hour and see where the shadow falls on a flat dial, and why the marks are not evenly spaced. On the second, tilt the edge and see how wrong the dial gets if the tilt is wrong. On the third, see why a sundial and a clock do not agree. This is how a sundial works. It is not a guide to building one. Without a script each slab shows one picture or table.',
  ],
};

export const slabs: Slab[] = [
  {
    id: 'plate',
    kicker: 'First slab',
    title: 'The shadow over a flat dial',
    paras: [
      'The Sun seems to turn round the sky once a day, 15 degrees every hour. A flat dial lies on the ground, but the Sun’s turning happens round a tilted line, so the shadow does not turn at an even rate. The rule for the angle of an hour line on a flat dial is: the tangent of the angle equals the sine of the latitude times the tangent of the hour angle, with the hour angle measured from noon.',
      'Slide the hour and the latitude. At noon the shadow lies on the noon line. Near the poles the lines are spread more evenly. At the equator the sine of the latitude is zero, so all the lines fall on top of each other and a flat dial cannot tell the time. The page draws the dial for the northern half of the world.',
    ],
    tags: [
      { label: 'Place', text: 'Latitudes are about 30 degrees for Cairo, 40 for Madrid, 52 for Amsterdam and 64 for Reykjavik. These are rounded.' },
    ],
  },
  {
    id: 'tilt',
    kicker: 'Second slab',
    title: 'Why the edge must tilt',
    paras: [
      'The shadow-casting edge has to point at the pole of the sky, the point the stars seem to turn round, because the Sun’s daily turn is round the same line as the Earth’s spin. That line rises above the horizon at an angle equal to your latitude. So the edge of a flat dial tilts up at the latitude of the place.',
      'Pick a place, then tilt the edge to a wrong angle. The page shows what time the dial would read when the true time is the hour you chose, and how many minutes it is off. When the tilt matches the latitude, the error is zero at every hour.',
    ],
  },
  {
    id: 'clock',
    kicker: 'Third slab',
    title: 'Why a sundial and a clock disagree',
    paras: [
      'Even a perfect sundial is not the same as a clock. The Sun does not cross the sky at an even pace through the year. There are two reasons. The Earth’s axis is tilted, and its orbit is an oval and not a circle. Together they make the Sun run a little ahead of the clock at some times and behind at others.',
      'Slide through the year. The gap is called the equation of time. It is about 16 minutes ahead in early November and about 14 or 15 minutes behind in mid-February, and it is zero four times a year. The numbers come from the usual approximate formula, so they are close but not exact for any one year. A dial also differs from a clock by where you are in your time zone, which this page leaves out.',
    ],
    tags: [
      { label: 'History', text: 'Shadow sticks are very old: sources date a vertical gnomon to about 3500 BCE, a rough date, and shadow clocks of about 1500 BCE. The Roman writer Vitruvius listed many kinds of dial around 25 BCE.' },
    ],
  },
];

export const takeaways = [
  'A sundial tells the time by the shadow of a pointed edge. The Sun turns 15 degrees round the sky each hour.',
  'On a flat dial the hour lines are not evenly spaced. The angle of a line follows tan(angle) = sin(latitude) x tan(hour angle).',
  'The edge of a dial must point at the pole of the sky, so it rises at the latitude of the place. A wrong tilt gives wrong hours.',
  'A sundial and a clock disagree by up to about 16 minutes through the year. This is called the equation of time.',
  'The two causes are the tilt of the Earth’s axis and the oval shape of its orbit.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The rule for the hour lines of a flat dial, tan(angle) = sin(latitude) x tan(hour angle), and the edge rising at the latitude because it points at the pole of the sky, appeared in several places. The equation of time of about 16 minutes ahead in early November and about 14 minutes behind in mid-February appeared in more than one place, and sources disagree on the sign because they define the difference in opposite ways, so the page says what it means: sundial minus clock. The page uses the usual approximate formula, which gives about 16.5 and minus 14.6 minutes, so it says about 14 or 15. The zero dates near 15 April, 13 June, 1 September and 25 December appeared in one source. The age of the vertical gnomon, about 3500 BCE, is rough and was not confirmed in a second place, so the page says the sources date it so. The Roman writer Vitruvius around 25 BCE and shadow clocks of about 1500 BCE each appeared in more than one place. The latitudes of the four cities are rounded values from general knowledge. The minutes of error in the second tool and the dial drawings are computed on the page. Nothing here is advice for building a dial.';

export const sources = [
  { label: 'Wikipedia: sundial', url: 'https://en.wikipedia.org/wiki/Sundial', for: 'The edge and the pole of the sky.' },
  { label: 'US Sundial Society: calculating dial lines', url: 'https://sundials.org/teachers-corner/sundial-mathematics/9-calculating-dial-lines-1.html', for: 'The rule for the hour lines.' },
  { label: 'Jill Vincent, University of Melbourne: the mathematics of sundials', url: 'https://files.eric.ed.gov/fulltext/EJ802706.pdf', for: 'The geometry of a flat dial.' },
  { label: 'DEV Community: everything about sundials', url: 'https://dev.to/pauljlucas/everything-you-ever-wanted-to-know-about-sundials-5h2l', for: 'Tilt of the edge and latitude.' },
  { label: 'Wikipedia: equation of time', url: 'https://en.wikipedia.org/wiki/Equation_of_time', for: 'The gap between sundial and clock.' },
  { label: 'Bureau of Meteorology (Australia): the equation of time', url: 'https://www.sws.bom.gov.au/Category/Educational/The%20Sun%20and%20Solar%20Activity/General%20Info/EquationOfTime.pdf', for: 'The causes of the gap.' },
  { label: 'Caltech Submillimeter Observatory: time, night and day', url: 'http://www.cso.caltech.edu/outreach/log/NIGHT%20and%20DAY.pdf', for: 'Solar time minus clock time.' },
  { label: 'Wikipedia: analemma', url: 'https://en.wikipedia.org/wiki/Analemma', for: 'The Sun’s path through the year.' },
  { label: 'MacTutor: sundials', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Sundials/', for: 'The history of sundials.' },
  { label: 'Britannica: sundial', url: 'https://britannica.com/technology/sundial', for: 'The first gnomon and the kinds of dial.' },
  { label: 'EAAE: short history of sundials', url: 'https://eaae-astronomy.org/projects/find-a-sundial/short-history-of-sundials', for: 'Greek and Roman dials.' },
  { label: 'Wikipedia: history of sundials', url: 'https://en.wikipedia.org/wiki/History_of_sundials', for: 'Vitruvius and the early dials.' },
  { label: 'Seiko Museum: the origin of the sundial', url: 'https://museum.seiko.co.jp/en/knowledge/ElementalTimepieces01/', for: 'Shadow clocks.' },
];
