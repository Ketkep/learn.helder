// Everything the "Why the Moon can cover the Sun" page says, in one place.
// A sky in three parts: the Sun and the Moon look the same size, the Moon's shadow only just reaches the Earth, and the Moon's orbit is
// tilted so that most new moons miss the Sun. The sizes and distances come from the sources. The length of the shadow is worked out by
// similar triangles. The limit in the last part is a rough value made up for the page, and the page says so.

export interface Part {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A coincidence in the sky',
  paras: [
    'The Sun is about 400 times wider than the Moon. It is also about 400 times further away. So the two look almost exactly the same size in the sky. Because of that, the Moon can sometimes cover the Sun exactly, and day turns to night for a few minutes. It is a coincidence, and it will not last for ever.',
    'Three parts. In the first, change the distance of the Moon and see whether it covers the Sun. In the second, see how far the Moon’s shadow reaches. In the third, see why there is not an eclipse every month. The sizes and distances come from the sources. Without a script each part shows one picture or table.',
  ],
};

export const parts: Part[] = [
  {
    id: 'sizes',
    kicker: 'First part',
    title: 'The same size in the sky',
    paras: [
      'How big something looks depends on its width and its distance. The Sun is about 1.39 million kilometres across and the Moon about 3475. The Moon’s orbit is not a circle, so its distance changes, from about 363,000 kilometres at its nearest to about 406,000 at its furthest. The Earth’s distance from the Sun changes a little too, between about 147.5 and 152.6 million kilometres.',
      'Slide the distances. The Moon looks between about 29.4 and 32.9 arcminutes wide, and the Sun between about 31.4 and 32.4. On average the Moon is a little smaller than the Sun. When the Moon is near it is bigger, and covers the Sun fully: a total eclipse. When it is far it is smaller, and leaves a ring of Sun: an annular eclipse.',
    ],
  },
  {
    id: 'shadow',
    kicker: 'Second part',
    title: 'A shadow that only just reaches',
    paras: [
      'The Moon casts a shadow shaped like a cone that narrows to a point. Inside the cone the Sun is fully hidden. The length of the cone follows from the sizes of the Sun and the Moon and the distance between them. It is about 370,000 to 382,000 kilometres long, depending on how far the Earth is from the Sun. One source gives about 380,000.',
      'The Moon is on average about 384,000 kilometres from the Earth. So the point of the cone only just reaches the Earth, and sometimes falls short. Where it reaches, there is a small round shadow, which the Earth’s spin drags across the ground, and the people in it see a total eclipse. Where it falls short, the Moon is too far away to cover the Sun. The page draws the Moon and the Earth much too big.',
    ],
    tags: [
      { label: 'Size of the shadow', text: 'On the ground the full shadow is at most about 267 kilometres wide. A total eclipse can last at most about 7 and a half minutes.' },
    ],
  },
  {
    id: 'tilt',
    kicker: 'Third part',
    title: 'Why not every month',
    paras: [
      'The Moon is new about every 29.5 days, when it is between us and the Sun. But there is not an eclipse every time. The Moon’s orbit is tilted by just over 5 degrees compared with the Earth’s orbit round the Sun. So at most new moons the Moon passes above or below the Sun.',
      'An eclipse can happen only when a new moon comes near one of the two places where the Moon’s orbit crosses the Earth’s, called nodes. That happens in two seasons a year. Slide round the orbit and see the height of the Moon. The band marks about 1.5 degrees. That limit is a rough value worked out for this page. With it, about one new moon in five has the Moon close enough to cross the Sun.',
    ],
  },
];

export const takeaways = [
  'The Sun is about 400 times wider than the Moon and about 400 times further away, so they look nearly the same size.',
  'The Moon looks between about 29.4 and 32.9 arcminutes wide, and the Sun between about 31.4 and 32.4. A near Moon covers the Sun. A far Moon leaves a ring.',
  'The Moon’s shadow is about 370,000 to 382,000 kilometres long, and the Moon is about 384,000 kilometres away on average. It only just reaches.',
  'The Moon’s orbit is tilted by just over 5 degrees, so most new moons miss the Sun. Eclipses come in two seasons a year.',
  'On the ground the full shadow is at most about 267 kilometres wide, and totality lasts at most about 7 and a half minutes.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The distances of the Moon, about 363,100 kilometres at its nearest and 405,700 at its furthest, the distances of the Sun, 147.5 and 152.6 million kilometres, and the arcminute sizes, 29.5 to 32.9 for the Moon and 31.4 to 32.4 for the Sun, appeared in one table and were checked by computing from the widths. That a far Moon leaves a ring and a near Moon covers the Sun appeared in several places. The length of the shadow was computed by similar triangles, 369,000 to 382,000 kilometres, and one source says about 380,000. The widths of 400 times were computed from the sizes. The width of the shadow on the ground of at most about 267 kilometres, the tilt of just over 5 degrees, the two eclipse seasons a year, and the longest totality of about 7 and a half minutes appeared in more than one place, with small differences. A claim that totality happens only at the nearest Moon in one source is wrong and was not used. The limit of about 1.5 degrees in the third part and the share of one new moon in five were worked out roughly for this page and are not from a source. Nothing here is advice.';

export const sources = [
  { label: 'Ohio State: lecture 9, eclipses of the Sun and Moon', url: 'https://www.astronomy.ohio-state.edu/pogge.1/Ast161/Unit2/eclipses.html', for: 'The umbra and the sizes.' },
  { label: 'Jean Giesen: solar eclipses at Moon apogee', url: 'http://www.jgiesen.de/saros/apogee.html', for: 'The distances and sizes of the Sun and Moon.' },
  { label: 'Space.com: total and annular eclipses', url: 'https://www.space.com/difference-between-total-solar-eclipse-and-annular-solar-eclipse', for: 'The difference between the two.' },
  { label: 'Study.com: annular eclipse', url: 'https://study.com/learn/lesson/annular-eclipse-overview-causes.html', for: 'Why an annular eclipse leaves a ring.' },
  { label: 'Wikipedia: solar eclipse', url: 'https://en.wikipedia.org/wiki/Solar_eclipse', for: 'Nodes, the tilt and how long totality lasts.' },
  { label: 'American Astronomical Society: how and why solar eclipses happen', url: 'https://eclipse.aas.org/eclipse-basics/how-why', for: 'Why eclipses are rare.' },
  { label: 'Space.com: why eclipses come in pairs, and eclipse seasons', url: 'https://www.space.com/stargazing/eclipses/why-solar-and-lunar-eclipses-come-in-pairs-and-what-an-eclipse-season-really-is', for: 'Eclipse seasons.' },
  { label: 'NowSky: why do eclipses not happen every month', url: 'https://nowsky.org/guide/eclipses-explained', for: 'The tilt of the Moon’s orbit.' },
  { label: 'MIRA: solar eclipses', url: 'https://www.mira.org/fts0/sun/079/text/txt001x.htm', for: 'The size of the Moon’s shadow.' },
  { label: 'Free Tool Online: lunar nodes and eclipse seasons', url: 'https://freetoolonline.com/space-3d/lunar-nodes-eclipse-seasons.html', for: 'The eclipse year.' },
  { label: 'Wikipedia: solar eclipse of 24 August 2063', url: 'https://en.wikipedia.org/wiki/Solar_eclipse_of_August_24,_2063', for: 'An example of the width of the path.' },
];
