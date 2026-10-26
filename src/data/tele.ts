// Everything the "How a telescope sees far" page says, in one place.
// A telescope tube cut into four stations and four things to try: two lenses, the light bucket, the sharpest view, and the history from 1608 to now.
// The formulas are standard and computed on the page. The sources give the history and the mirror sizes.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A tube that collects light',
  paras: [
    'A telescope does two jobs. It makes far things look bigger, and it collects much more light than an eye can. The first telescope that history records was a Dutch looker of 1608, which made things look about three times as large. A year later Galileo pointed an improved one at the sky and saw the moons of Jupiter.',
    'Four stations along the tube. Two lenses that magnify. A wide opening that gathers light. The sharpest view a telescope can give, and why it depends on the width of the opening. And the history from the Dutch looker to the James Webb Space Telescope. The formulas are worked out by the page. Without a script each station shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'lenses',
    kicker: 'Station one',
    title: 'Two lenses',
    paras: [
      'A simple telescope has two lenses. The big lens at the front, the objective, bends the light from a far star to a point, the focus. The small lens at the back, the eyepiece, works like a magnifying glass on that point. The magnification is the focal length of the objective divided by the focal length of the eyepiece. A 1,000 millimetre objective with a 25 millimetre eyepiece gives 40 times.',
      'Slide the two focal lengths. The drawing is not to scale. The page also shows how wide the Moon, which is about half a degree across, would look.',
    ],
  },
  {
    id: 'bucket',
    kicker: 'Station two',
    title: 'The light bucket',
    paras: [
      'The width of the opening decides how much light comes in. The light collected goes with the square of the width. A telescope with a 50 millimetre lens has ten times the width of a dark adapted eye, which is about 5 millimetres, and so gathers 100 times as much light. That is what makes faint stars visible.',
      'Slide the width of the opening, or pick one of the telescopes. The two circles have areas in the right proportion, as far as the picture allows.',
    ],
  },
  {
    id: 'sharp',
    kicker: 'Station three',
    title: 'How sharp it can be',
    paras: [
      'Light is a wave, and a wave spreads a little when it goes through an opening. So a star is never a perfect point. It is a small disc, and two stars very close together merge. The limit is called the Rayleigh limit. It is 1.22 times the wavelength of the light divided by the width of the opening, as an angle. For green light, 138 divided by the width in millimetres gives the angle in arcseconds, and an arcsecond is a 3,600th of a degree. A wider opening can see finer detail.',
      'Slide the width. The page shows the smallest gap, in arcseconds and as a fraction of the width of the Moon. This is the theory limit for good optics. The air blurs the view from the ground, which is why Hubble is in space.',
    ],
  },
  {
    id: 'history',
    kicker: 'Station four',
    title: 'From a Dutch looker to Webb',
    paras: [
      'The story is not simple. In 1608 several people in the Netherlands claimed the idea, and Lippershey was the first to ask for a patent. Within a year the telescope had reached Italy. Newton replaced the big lens by a mirror in 1668. Today the biggest ones fly in space.',
      'Press next to step along the story.',
    ],
    tags: [{ label: 'Who was first?', text: 'Hans Lippershey applied for a patent on 2 October 1608 and was refused. Jacob Metius applied a few weeks later, and Zacharias Jansen is named in several accounts. Who made the very first one is not settled.' }],
  },
];

export const takeaways = [
  'Magnification is the focal length of the big lens divided by the focal length of the eyepiece.',
  'Light gathering goes with the square of the width of the opening. A 50 millimetre telescope collects 100 times the light of a 5 millimetre eye.',
  'The sharpest view depends on the width. The Rayleigh limit is 1.22 times the wavelength over the width, about 138 divided by the width in millimetres, in arcseconds.',
  'Lippershey asked for a patent on a looker in the Netherlands on 2 October 1608. Galileo built his own in 1609 and used one of about 20 times magnification.',
  'Newton made the first working reflector in 1668. Hubble has a 2.4 metre mirror and Webb a 6.5 metre mirror made of 18 hexagons.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Lippershey’s application on 2 October 1608 to the States General in The Hague for a looker of about three times magnification and its refusal, the rival claims of Metius and Jansen, Galileo’s telescopes of 8 to 10 times and then 20 times and his moons of Jupiter in January 1610, magnification as the ratio of focal lengths, light gathering with the square of the width, a 5 millimetre dark adapted eye, the Rayleigh limit of 1.22 over the width and 138 over the width in millimetres for green light, Newton’s first working reflector in late 1668, Hubble’s 2.4 metre mirror and launch on 24 April 1990, and Webb’s 6.5 metre mirror of 18 hexagons each appeared in at least two places. Sources differ on the lenses Lippershey used, on the exact date Galileo built his first telescope, on the date of Sidereus Nuncius (March 1610) and on whether Hubble deployed on 24 or 25 April. The page gives no launch date for Webb, which the sources checked did not give, and takes the width of the Moon as about half a degree. The sums are computed on the page.';

export const sources = [
  { label: 'Linda Hall Library: Hans Lipperhey', url: 'https://www.lindahall.org/hans-lipperhey/', for: 'The patent application and the lenses.' },
  { label: 'EBSCO: the invention of the telescope', url: 'https://ebsco.com/research-starters/history/invention-telescope', for: 'The Dutch looker and the rival claims.' },
  { label: 'World Atlas: who invented the telescope', url: 'https://www.worldatlas.com/articles/who-invented-the-telescope.html', for: 'Lippershey, Metius and Jansen.' },
  { label: 'Wikipedia: Sidereus Nuncius', url: 'https://en.wikipedia.org/wiki/Sidereus_Nuncius', for: 'Galileo’s telescopes and his moons of Jupiter.' },
  { label: 'The Universe: magnification and light gathering', url: 'https://digfir-published.macmillanusa.com/universe10e/asset/boxes/6_1.html', for: 'The two formulas.' },
  { label: 'Astroshop: magnification', url: 'https://www.astroshop.eu/magazine/information/telescope-information/the-right-telescope/magnification/i,1063', for: 'Focal lengths and magnification.' },
  { label: 'University of Iowa: the Rayleigh criterion', url: 'https://pressbooks.uiowa.edu/clonedbook/chapter/limits-of-resolution-the-rayleigh-criterion', for: 'The limit of resolution.' },
  { label: 'Wikipedia: Newton’s reflector', url: 'https://en.wikipedia.org/wiki/Newton%27s_reflector', for: 'Newton’s first reflector.' },
  { label: 'NASA: Hubble’s mirror flaw', url: 'https://www.nasa.gov/content/hubbles-mirror-flaw', for: 'The size of Hubble’s mirror and its launch.' },
  { label: 'NASA Webb: scope it out', url: 'https://webb.nasa.gov/education/scopeitoutworksheet.pdf', for: 'Webb’s 18 segments and its size compared with Hubble.' },
];
