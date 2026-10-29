// Everything the "How mountains are made" page says, in one place.
// A model maker's sandbox with four glass fronted trays and four things to try: squeezing layers, floating roots,
// a race between lifting and wearing away, and the three kinds of mountain.
// The numbers come from the sources. The drawings are toys, and the page says so.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Crust that gets pushed up',
  paras: [
    'Mountains are not stuck on the ground. The outer shell of the Earth is cracked into plates that move a few centimetres a year. Where two plates push together, rock gets squeezed, piled up and lifted. Mountains also sink and wear away at the same time. The height you see is what is left of a long race between lifting and wearing away.',
    'Four glass fronted trays to try. Squeeze a stack of layers from the side. Float a block of crust like an iceberg. Race lifting against wearing away. And see three different ways to make a mountain. The drawings are toys, because real mountains are not neat waves. Without a script each tray shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'fold',
    kicker: 'First tray',
    title: 'Squeeze the layers',
    paras: [
      'Think of a stack of layered rock as a stack of cloths on a table. Push the ends together and the cloths cannot get shorter without going somewhere. They buckle into folds and pile up, so the stack gets thicker. This is how fold mountains such as the Alps form. When India ran into Asia, the rock between them was squeezed in the same way.',
      'Slide how much the stack is squeezed from the side. If the volume stays the same, a stack squeezed to half its width has to be twice as thick. The folds in the drawing are a toy shape, and the thickness number is the sum.',
    ],
    tags: [
      { label: 'History', text: 'The Himalayas began to form when India and Eurasia collided, 40 to 50 million years ago by the sources checked. A study of 2015 dated first contact to about 47 million years ago.' },
    ],
  },
  {
    id: 'float',
    kicker: 'Second tray',
    title: 'A mountain floats',
    paras: [
      'Mountains are made of light rock sitting on denser rock below, like an iceberg in water. A mountain does not sit on the ground. Most of it is below, as a root that pushes down into the mantle. In the simplest model, called Airy isostasy, the root is the height times the density of the crust, divided by the difference between the densities of the mantle and the crust. With textbook densities of 2.7 and 3.3 grams per cubic centimetre, that is 4.5 times the height.',
      'Slide the height of the mountain. The page draws the root and works out its depth. Another lecture uses a crust density of 2.8, which gives 5.6 times, so the sums depend on the numbers you pick. Under the Himalaya and Tibet the crust is measured at about 70 to 75 kilometres thick by one source and 60 to 70 by another, about twice the normal thickness.',
    ],
    tags: [
      { label: 'Check', text: 'Normal continental crust is about 35 kilometres thick in some sources and about 40 in others. This toy uses 35. Real roots are not as neat as this model.' },
    ],
  },
  {
    id: 'race',
    kicker: 'Third tray',
    title: 'Lifting against wearing away',
    paras: [
      'A mountain grows only while it is lifted faster than it wears away. Rock rises as plates keep pushing. Rain, ice and rivers carry it off. One conference abstract gives the rise of the Himalayas as about 4 to 10 millimetres a year, as the plate moves at nearly 5 centimetres a year. A study reported that erosion near Everest lightens the load and lets the peak rise about 2 millimetres a year more, though that is a model result.',
      'Set a rate of lifting and a rate of wearing away. One millimetre a year for a million years is one kilometre. The line shows the peak at the net rate, and the dashed line shows what would happen with no wearing away. The real rates change over time, so this is a toy. The page also tells you how far a plate at 5 centimetres a year travels in the same time.',
    ],
    tags: [
      { label: 'Check', text: 'Everest is 8,848.86 metres tall by the official figure that China and Nepal announced in December 2020. Older figures were 8,848, 8,850 and 8,844.43 metres, because of snow and methods.' },
    ],
  },
  {
    id: 'kinds',
    kicker: 'Fourth tray',
    title: 'Three kinds of mountain',
    paras: [
      'Not every mountain is a fold. Fold mountains come from plates pushing together. Fault block mountains come from big blocks of crust lifted or tilted along cracks. Volcanic mountains are built from melted rock that reaches the surface.',
      'Pick a kind. The page draws a cross section and names an example from the sources. The drawings are simple, and the same range can be a mix of kinds.',
    ],
  },
];

export const takeaways = [
  'When two plates push together, layers of rock buckle and pile up. If the volume stays the same, a slab squeezed to half its width gets twice as thick.',
  'A mountain floats on the mantle like an iceberg. In the simplest model the root is 4.5 times the height, with densities of 2.7 and 3.3.',
  'Under the Himalaya and Tibet the crust is about twice as thick as normal, around 60 to 75 kilometres by different sources.',
  'A mountain grows only while it is lifted faster than it wears away. One millimetre a year for a million years is one kilometre.',
  'There are fold, fault block and volcanic mountains, and many ranges are a mix.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. India colliding with Eurasia 40 to 50 million years ago and the date of about 47 million years from a study of 2015, India slowing at the collision, the plates moving at about 5 centimetres a year, the rise of 4 to 10 millimetres a year, mountains floating on the mantle with roots, the densities of 2.7 and 3.3 grams per cubic centimetre and the root formula of height times crust density over the difference of densities, the three kinds of mountain with the Alps, the Sierra Nevada and Mount Fuji, and Everest at 8,848.86 metres from the survey announced in December 2020 each appeared in at least two places. Sources differ on the speed of India at the collision (15 or 18 centimetres a year), on the thickness of normal crust (35 or 40 kilometres), on the thickness under Tibet (60 to 70 or 70 to 75 kilometres) and on the density of crust (2.7 or 2.8), and the page says so and does not give the speed at the collision. The rise rates come from a conference abstract that is not peer reviewed, and the 2 millimetres a year for Everest is a model result, and both are marked. The Appalachians could not be confirmed as fold mountains in the results, so they are left out. The folds, the roots, the lines and the sums are toys and are computed on the page.';

export const sources = [
  { label: 'USGS: the Himalayas, two continents collide', url: 'https://pubs.usgs.gov/gip/dynamic/himalaya.html', for: 'The collision and the slowdown.' },
  { label: 'SERC Carleton: the Himalayas, two continents collide', url: 'https://serc.carleton.edu/resources/39314.html', for: 'How the range formed.' },
  { label: 'EarthByte: microplate discovery dates the birth of the Himalayas', url: 'https://www.earthbyte.org/ancient-indian-ocean-microplate-discovery-dates-birth-of-himalayas/', for: 'About 47 million years ago.' },
  { label: 'Live Science: how India slammed into Eurasia', url: 'https://livescience.com/50724-india-eurasia-fast-collision.html', for: 'The speed of India.' },
  { label: 'Christian Science Monitor: growth of the Himalayas is slowing', url: 'https://www.csmonitor.com/Science/2012/0301/Growth-of-Himalayas-slowing-down-study-finds', for: 'The collision rate over time.' },
  { label: 'EGU 2025 abstract on the Himalayas', url: 'https://meetingorganizer.copernicus.org/EGU25/EGU25-12064.html', for: 'The rise of 4 to 10 millimetres a year.' },
  { label: 'Wikipedia: isostasy', url: 'https://en.wikipedia.org/wiki/Isostasy', for: 'Roots and the Airy model.' },
  { label: 'Hong Kong Observatory: what is isostasy', url: 'https://www.hko.gov.hk/en/education/earth-science/earthquake/00343-what-is-isostasy.html', for: 'The root and erosion.' },
  { label: 'UBC: isostasy', url: 'https://www.eoas.ubc.ca/academics/courses/eosc450/ewExternalFiles/D4_Isostacy.pdf', for: 'The root formula.' },
  { label: 'UCSD: gravity and isostasy', url: 'https://igppweb.ucsd.edu/~fialko/tectonics/Lecture2GravityIsostasy.pdf', for: 'A crust density of 2.8.' },
  { label: 'Science ABC: why mountains do not sink', url: 'https://www.scienceabc.com/pure-sciences/mountains-are-so-big-and-heavy-why-dont-they-sink-into-the-ground', for: 'The crust under Tibet.' },
  { label: 'Universe Today: types of mountains', url: 'https://www.universetoday.com/29771/types-of-mountains/', for: 'Fold, fault block and volcanic.' },
  { label: 'World Atlas: how are mountains formed', url: 'https://www.worldatlas.com/articles/how-are-mountains-formed.html', for: 'Examples of each kind.' },
  { label: 'AP: China and Nepal announce the height of Everest', url: 'https://wjla.com/news/nation-world/height-of-mt-everest-taller-than-earlier-reported-1', for: '8,848.86 metres.' },
];
