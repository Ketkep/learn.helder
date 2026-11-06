// Everything the "How ocean waves travel" page says, in one place.
// A shoreline with three things to try: in deep water long waves outrun short ones, in shallow water the speed depends only on the depth, and
// a long wave slows down as it comes in to a made-up beach. The formulas come from the sources. The beach is made up and the height of the
// wave in the drawing is not to scale. The page is about how waves move, not a guide to safety.

export interface Stretch {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'How fast a wave goes depends on what it is',
  paras: [
    'A wave in the open sea is not water travelling. It is a shape that moves while the water mostly moves in small circles. How fast the shape moves depends on two things: how long the wave is, and how deep the water is. Wind waves and tsunamis are two ends of the same story.',
    'Three stretches of shore. In the first, see why long waves outrun short ones in deep water. In the second, see that a very long wave, such as a tsunami, goes at a speed set only by the depth. In the third, follow such a wave in towards a made-up beach and see it slow down. This page is about how waves move, not a guide to safety. Without a script each stretch shows one picture or table.',
  ],
};

export const stretches: Stretch[] = [
  {
    id: 'deep',
    kicker: 'First stretch',
    title: 'In deep water, long waves are fast',
    paras: [
      'When the water is deep compared with the wavelength, the depth does not matter. The speed then depends on the wavelength alone: it is the square root of gravity times the wavelength, divided by 2 pi. A wave that is four times as long goes twice as fast. A rule of thumb for the same waves is a speed in metres a second of about 1.56 times the time between crests in seconds.',
      'Slide the wavelength. The table shows the time that waves of different lengths take to cross 1000 kilometres. This is why a swell, the long smooth waves that leave a distant storm, arrives at a far coast before the short choppy waves do. Deep here means the depth is more than half the wavelength.',
    ],
  },
  {
    id: 'shallow',
    kicker: 'Second stretch',
    title: 'A very long wave feels the sea floor',
    paras: [
      'A tsunami has a wavelength of tens or hundreds of kilometres. Even the deep ocean, a few kilometres, is shallow compared with that. A wave counts as a shallow-water wave when the water is shallow compared with its length, and then its speed does not depend on the wavelength. It is the square root of gravity times the depth.',
      'Slide the depth. In 4000 metres of water the speed is about 198 metres a second, about 713 kilometres an hour, as fast as a jet plane. In 100 metres it is about 31 metres a second, 113 kilometres an hour. Near the coast the speed can fall to roughly 40 to 80 kilometres an hour.',
    ],
  },
  {
    id: 'beach',
    kicker: 'Third stretch',
    title: 'Coming in to the beach',
    paras: [
      'As the sea floor rises towards the shore, the water gets shallower and the wave slows. The front of the wave slows first and the back catches up, so the wave gets taller and shorter. The energy that was spread over a long wave is squeezed into a smaller, slower one.',
      'Slide the wave along a made-up beach that slopes evenly from 4000 metres deep to the shore over 200 kilometres. The page works out the speed at each place and the total time from the far edge. At full open-sea speed the trip would take about 17 minutes, and on this beach it takes about 33. The beach is made up and the height of the wave in the drawing is not to scale.',
    ],
    tags: [
      { label: 'Not a guide', text: 'This page shows how the speed of a wave follows from the depth. It is not a guide to what to do in an emergency. Follow the official warnings of the place where you are.' },
    ],
  },
];

export const takeaways = [
  'In deep water the speed of a wave depends on its wavelength: the square root of gravity times the wavelength over 2 pi. Longer waves are faster.',
  'A very long wave, such as a tsunami, acts as a shallow-water wave even in the deep ocean. Its speed is the square root of gravity times the depth.',
  'In 4000 metres of water that is about 713 kilometres an hour. In 100 metres it is about 113.',
  'A wave slows as the water gets shallower, and it grows taller and shorter.',
  'The beach on this page is made up, and the page is not safety advice.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The speed of a shallow-water wave as the square root of gravity times the depth, with 713 kilometres an hour in 4000 metres computed and confirmed, the fact that shallow-water waves are not dispersive and that a tsunami counts as one because its wavelength is far greater than the depth, the slowing near the coast to about 40 to 80 kilometres an hour, and the growth in height in shallow water each appeared in more than one place. The deep-water speed as the square root of gravity times the wavelength over 2 pi, the rule of thumb of about 1.56 times the period, and the limit of half the wavelength for deep water appeared in several places. Sources differ on the wavelength they use for the example of a tsunami (50 or 100 kilometres), but the speed does not depend on it. The depth at which a wave breaks was searched for and not found, so the page does not give it. The made-up beach and its time of about 33 minutes are computed on the page, and the drawing of the wave height is not to scale. Nothing here is safety advice.';

export const sources = [
  { label: 'NOAA Institutional Repository: tsunami', url: 'https://repository.library.noaa.gov/view/noaa/16263/noaa_16263_DS1.pdf', for: 'Tsunami speed and depth.' },
  { label: 'University of Tennessee: water waves', url: 'http://labman.phys.utk.edu/phys221core/modules/m12/Water_waves.html', for: 'Deep and shallow water waves.' },
  { label: 'International Tsunami Information Center: tsunami characteristics', url: 'https://tsunami.org/tsunami-characteristics/', for: 'Speed and height of a tsunami.' },
  { label: 'Geosciences LibreTexts: deep and shallow water waves', url: 'https://geo.libretexts.org/Bookshelves/Oceanography/Our_World_Ocean:_Understanding_the_Most_Important_Ecosystem_on_Earth_Essentials_Edition_(Chamberlin_Shaw_and_Rich)/03:_Voyage_III_Ocean_Physics/13:_Ocean_Waves/13.13:_Deep-_and_Shallow-Water_Waves', for: 'When a wave counts as deep or shallow.' },
  { label: 'Geological Digressions: tsunamis behave as shallow-water waves', url: 'https://www.geological-digressions.com/tsunamis-behave-as-shallow-water-waves/', for: 'Why a tsunami is a shallow-water wave.' },
  { label: 'Wikipedia: dispersion (water waves)', url: 'https://en.wikipedia.org/wiki/Dispersion_(water_waves)', for: 'Speed against wavelength.' },
  { label: 'Wikipedia: wave shoaling', url: 'https://en.wikipedia.org/wiki/Wave_shoaling', for: 'Waves slowing and growing in shallow water.' },
  { label: 'Institute of Physics: the speed of water waves', url: 'https://spark.iop.org/speed-water-waves', for: 'The speed of waves.' },
  { label: 'Roger Williams University: shallow, intermediate and deep waves', url: 'https://rwu.pressbooks.pub/oceanhydro/chapter/shallow-intermediate-and-deep-water-waves/', for: 'The half wavelength rule.' },
  { label: 'University of Manchester: linear wave theory', url: 'https://personalpages.manchester.ac.uk/staff/david.d.apsley/lectures/hydraulics3/WavesLinear.pdf', for: 'The formulas for wave speed.' },
  { label: 'University of Hawaii: waves handout', url: 'https://www.soest.hawaii.edu/oceanography/courses_html/OCN201/instructors/Carter/SP2016/waves2_2016_handout.pdf', for: 'The rule of thumb for speed and the swell.' },
];
