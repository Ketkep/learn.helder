// Everything the "Why the Moon has phases" page says, in one place.
// A dark room with a lamp and four stations: move the Moon, read its rise time, find why a month is 29.5 days, and see why eclipses are rare.
// The sky is a toy: circular orbits and a made up year. The real facts come from the sources.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'One lamp and one ball',
  paras: [
    'The Moon does not make light. It is a ball lit by the Sun, and half of it is always lit. The phases are how much of that lit half faces us. They are not the shadow of the Earth.',
    'Four stations try it. Move the Moon round the Earth and watch the shape change. Read when each phase rises. Find out why a month of phases is longer than one trip round the sky. And see why the Moon does not hide in the Earth’s shadow every month. The sky here is a toy, with circular orbits. Without a script each station shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'look',
    kicker: 'Station one',
    title: 'Move the Moon',
    paras: [
      'Sunlight comes in from the left. The Moon goes round the Earth once in about 29.5 days from one new moon to the next. At new moon it is between us and the Sun, so the lit half faces away from us. At full moon the Earth is in the middle and we see the whole lit half.',
      'Slide the days since new moon. The top picture looks down on the orbit. The round picture is what we see from the northern half of the Earth.',
    ],
    tags: [{ label: 'Not the shadow', text: 'A common idea is that the phases come from the shadow of the Earth. They do not. Earth’s shadow only touches the Moon in a lunar eclipse, and that is rare. A quarter moon is half lit because we see the Moon from the side.' }],
  },
  {
    id: 'rise',
    kicker: 'Station two',
    title: 'When it comes up',
    paras: [
      'The Moon rises about 50 minutes later each day, because it moves round the Earth the same way the Earth turns. Each phase has its own time. A full moon rises as the Sun sets. A first quarter moon rises around noon, so you can see it in the afternoon.',
      'Pick a phase. The strip shows a day from midnight to midnight, with the hours of Sun and the hours of Moon. In this toy the Sun rises at 06:00 and sets at 18:00. Real times change with the place and the season.',
    ],
  },
  {
    id: 'month',
    kicker: 'Station three',
    title: 'A month that is longer than a lap',
    paras: [
      'The Moon goes once round the Earth against the stars in about 27.3 days. But the phases take about 29.5 days to repeat. The reason is that the Earth moves round the Sun while the Moon is going round the Earth, so the Sun appears in a new direction.',
      'This view keeps the stars fixed. Slide the days. After 27.3 days the Moon is back at the same star, but the Sun has moved on by about 27 degrees, and the Moon needs about two more days to catch up with it.',
    ],
  },
  {
    id: 'eclipse',
    kicker: 'Station four',
    title: 'Why not an eclipse every month',
    paras: [
      'If the Moon went round in the same plane as the Earth’s orbit, every new moon would cover the Sun and every full moon would enter the Earth’s shadow. But the Moon’s orbit is tilted by about 5 degrees. Most months the Moon passes above or below the line from the Sun to the Earth.',
      'This is a side view of a made up year of 13 new moons and 13 full moons. Pick one, and switch between new and full. The limits for an eclipse are toy values. Real eclipses come in two seasons a year, when the crossing points of the orbit point at the Sun.',
    ],
    tags: [{ label: 'Never look at the Sun', text: 'This page is about the maths of the sky. Looking straight at the Sun, even when it is mostly covered, can damage your eyes. Use proper eclipse glasses or a projection.' }],
  },
];

export const takeaways = [
  'The Moon is lit by the Sun, and half of it is always lit. The phases are how much of that lit half we can see.',
  'The phases are not caused by the shadow of the Earth. That only happens in a lunar eclipse.',
  'A full moon rises as the Sun sets. A first quarter moon rises around noon. Each day the Moon rises about 50 minutes later.',
  'The Moon goes round the Earth in about 27.3 days, but the phases repeat every 29.5 days, because the Sun appears to move on while the Moon is going round.',
  'The Moon’s orbit is tilted by about 5 degrees. That is why eclipses do not happen every month.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The 29.53 day cycle of the phases, the 27.32 day trip against the stars, the order of the eight phases and the quarter moon at 90 degrees from the Sun, the Moon always showing the same face, and the 5 degree tilt of the orbit with eclipses only near the crossing points, each appeared in at least two places. The rise of a first quarter moon around noon came from one source and fits the geometry, which is why the page gives it as a rule of thumb. The figure of about 50 minutes later each day comes from the 29.5 day cycle (a day divided by 29.5). The rise times on the page are a toy with a Sun that rises at 06:00 and sets at 18:00, and the eclipse limits of 1.5 degrees and 0.9 degrees, the 13 new moons and the starting angle are made up. The page counts what its own toy gives and does not predict real eclipses.';

export const sources = [
  { label: 'University of Rochester: the Moon’s orbit', url: 'https://www.pas.rochester.edu/~blackman/ast104/moonorbit.html', for: 'Phases and the Moon’s orbit.' },
  { label: 'timeanddate: the lunar month', url: 'https://timeanddate.com/astronomy/moon/lunar-month.html', for: 'The 29.53 day month.' },
  { label: 'University of Oregon: monthly variations', url: 'https://pages.uoregon.edu/imamura/121/lecture-2/monthly.html', for: 'Phases and the Sun Earth Moon angle.' },
  { label: 'University of Central Arkansas: synodic and sidereal months', url: 'https://faculty.uca.edu/njaustin/PHYS1401/Laboratory/lunarMonth.html', for: 'Why the two months differ.' },
  { label: 'NASA: the Moon in motion', url: 'https://moon.nasa.gov/moon-in-motion/overview', for: 'The orbit and the 29.5 day cycle.' },
  { label: 'NASA: lunar libration', url: 'https://eclipse2017.nasa.gov/what\'s-lunar-libration', for: 'The tilt of the orbit and the one face.' },
  { label: 'Sky at Night: why we see the same side', url: 'https://skyatnightmagazine.com/space-science/why-always-see-same-side-moon', for: 'Tidal locking.' },
  { label: 'Caltech astronomy: the Moon', url: 'https://sites.astro.caltech.edu/~afs/class3_afs_files/slide0019.htm', for: 'The 27.32 day orbit.' },
];
