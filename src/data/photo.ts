// Everything the "How photosynthesis works" page says, in one place.
// A day in a leaf, shown on a 24 hour dial, with five things to try: the colours a leaf uses, what limits it, grams in and grams out, a willow tree weighed over five years, and a whole day.
// The facts come from the sources. The curves are toys and the page says so. The masses are worked out from the atomic masses.

export interface Panel {
  id: string;
  hour: number;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A day in a leaf',
  paras: [
    'A leaf is a small factory that runs on sunlight. It takes carbon dioxide from the air and water from the roots, and makes sugar and oxygen. This is photosynthesis. It happens in tiny green parts of the cell called chloroplasts, and the green is chlorophyll.',
    'The page follows one day on a 24 hour dial, with five things to try. See which colours of light a leaf uses. See what limits how fast it works. Weigh the molecules going in and coming out. Look at a tree that grew from 5 pounds to about 169 and ask where the weight came from. And scrub through a whole day and night. The curves are toys and the page says so. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'colours',
    hour: 6,
    kicker: 'Morning, 06:00',
    title: 'The colours a leaf uses',
    paras: [
      'Chlorophyll takes in light mostly in the blue and the red. Measurements of chlorophyll a put its two peaks near 430 and 662 nanometres. It takes in little green, and the green light that is left is thrown back to your eye. That is why leaves look green.',
      'Slide the colour of the light. The toy curve has its peaks at the two measured places. The shape between them is made up.',
    ],
  },
  {
    id: 'limits',
    hour: 9,
    kicker: 'Mid morning, 09:00',
    title: 'What holds it back',
    paras: [
      'A leaf needs light, carbon dioxide and a fitting temperature. Frederick Blackman suggested that the factor in shortest supply sets the speed. More of the others does not help. Real leaves change more gradually than that, so this is a toy with sharp corners.',
      'Slide the light, the carbon dioxide and the temperature. The page names the one that is holding the leaf back. The air today holds about 420 parts per million of carbon dioxide, which is the starting setting. All the curves are made up.',
    ],
  },
  {
    id: 'grams',
    hour: 12,
    kicker: 'Noon, 12:00',
    title: 'Grams in, grams out',
    paras: [
      'The overall change is six carbon dioxide and six water making one glucose and six oxygen. Atoms are only rearranged, so the mass going in equals the mass coming out. The oxygen released comes from the water, as isotope labelling experiments showed.',
      'Slide the grams of carbon dioxide taken in. The page works out the water needed and the glucose and oxygen made, from the atomic masses, and shows that the two sides weigh the same.',
    ],
    tags: [{ label: 'Where it happens', text: 'In the chloroplast, the light reactions run on the thylakoid membranes. They split water and give off oxygen. The sugar is built in the fluid around them, the stroma, in a cycle called the Calvin cycle.' }],
  },
  {
    id: 'willow',
    hour: 15,
    kicker: 'Afternoon, 15:00',
    title: 'Where did the weight come from?',
    paras: [
      'In the 1600s Jan van Helmont dried 200 pounds of soil and planted a willow shoot of 5 pounds in it. He gave it only rain water. After five years the tree weighed about 169 pounds, and the soil had lost about 2 ounces.',
      'Take a guess, then slide through the five years. Van Helmont decided that the water had become the tree. He did not think about the air.',
    ],
    tags: [{ label: 'The answer today', text: 'Most of the new weight is carbon taken from the carbon dioxide in the air, joined with the hydrogen and oxygen of water. The soil gives only small amounts of minerals. Van Helmont also weighed the tree wet, and a tree is about half water.' }],
  },
  {
    id: 'day',
    hour: 21,
    kicker: 'Night, 21:00',
    title: 'Scrub a whole day',
    paras: [
      'Photosynthesis needs light, so it stops at night. But the leaf breathes all the time, and breathing uses sugar and gives off carbon dioxide. By day the leaf makes more than it uses. At night it only uses.',
      'Slide the hour. The page shows the sunlight, how much sugar the leaf makes, and the balance after breathing. Both the sunlight and the breathing are made up numbers for a toy leaf.',
    ],
    tags: [{ label: 'The big picture', text: 'Phytoplankton in the sea also photosynthesise. Estimates say they make about half of the oxygen in the air, with a range from 50 to 85 per cent. The air is about 21 per cent oxygen, built up over hundreds of millions of years.' }],
  },
];

export const takeaways = [
  'Photosynthesis turns six carbon dioxide and six water into one glucose and six oxygen, using light. The mass in equals the mass out.',
  'Chlorophyll uses mostly blue and red light and reflects green, which is why leaves look green.',
  'The oxygen comes from the water. The sugar is built in the stroma of the chloroplast.',
  'Van Helmont’s willow gained about 164 pounds while the soil lost about 2 ounces. Most of the weight came from air and water, not soil.',
  'A leaf breathes all day and night, so it only gains sugar when the light is strong enough.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The equation of six carbon dioxide and six water making glucose and six oxygen, the oxygen coming from water, the thylakoid membranes and the stroma, the chlorophyll a peaks near 430 and 662 nanometres and its reflection of green, the three limiting factors and Blackman’s idea, and van Helmont’s 200 pounds of soil, 5 pound willow, about 169 pounds after five years and about 2 ounces of soil lost, each appeared in at least two places. The peak positions depend a little on the solvent and the 430 and 662 figures come from a student lab report, so the page says near. Sources say the oceans give 50 to 85 per cent of the oxygen, so the page gives the range. The curves of the colours, the limits and the day, the sunlight and breathing numbers, the growth of the willow in the years between and the setting of 420 parts per million are made up or round numbers for the toy and are marked. The masses are worked out from standard atomic masses.';

export const sources = [
  { label: 'St John’s University: van Helmont’s experiment', url: 'https://faculty.csbsju.edu/ssaupe/biol115/van_helmont.htm', for: 'The willow, the soil and the weights.' },
  { label: 'Encyclopedia.com: Jan van Helmont', url: 'https://encyclopedia.com/science/news-wires-white-papers-and-books/van-helmont-jan', for: 'His idea that water made the tree.' },
  { label: 'McGraw Hill: photosynthesis chapter', url: 'https://highered.mheducation.com/sites/dl/free/0073031216/29135/ch10.pdf', for: 'The equation, the stages and the pigments.' },
  { label: 'ChemistryTalk: the photosynthesis equation', url: 'https://chemistrytalk.org/photosynthesis-equation-formula-products/', for: 'The equation and its products.' },
  { label: 'Albert: the site of photosynthesis', url: 'https://www.albert.io/blog/what-is-the-site-of-photosynthesis', for: 'Chloroplast, thylakoids and stroma.' },
  { label: 'Royal Society of Chemistry: limiting factors', url: 'https://edu.rsc.org/download?ac=12620', for: 'Light, carbon dioxide and temperature.' },
  { label: 'University of Pennsylvania: chlorophyll spectroscopy', url: 'https://www.seas.upenn.edu/~belab/LabProjects/1997/BE210S97R1R01.doc', for: 'The absorption peaks near 430 and 662 nm.' },
  { label: 'EarthSky: how much oxygen the oceans add', url: 'https://earthsky.org/earth/how-much-do-oceans-add-to-worlds-oxygen', for: 'The range of 50 to 85 per cent from phytoplankton.' },
  { label: 'NOAA: ocean oxygen', url: 'https://oceanservice.noaa.gov/facts/ocean-oxygen.html', for: 'Oxygen in the air built up over a long time.' },
];
