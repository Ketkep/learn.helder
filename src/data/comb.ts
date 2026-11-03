// Everything the "How bees get their hexagons" page says, in one place.
// A hive frame with three cells to try: which regular shapes fit together without gaps, how much wall each one needs for the same area,
// and how round cells squeezed together become hexagons. The tiling and the honeycomb theorem come from the sources. The squeezing is a
// toy model, and the page says that how real bees and wax make the shape is still debated.

export interface Cell {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Six sides, and no gaps',
  paras: [
    'Look inside a honeybee nest and the wax is made of six-sided cells packed side by side. People have asked for thousands of years why. Part of the answer is geometry, which is the same for anyone. Part is how soft wax behaves, and that part is still being argued about.',
    'Three cells to try. In the first, see which shapes fit together with no gaps. In the second, see how much wall each shape needs for the same area. In the third, squeeze round cells into hexagons. The first two are exact maths. The third is a toy model. Without a script each cell shows one picture or table.',
  ],
};

export const cells: Cell[] = [
  {
    id: 'tile',
    kicker: 'First cell',
    title: 'Which shapes fit together',
    paras: [
      'To cover a flat floor with copies of one regular shape and leave no gaps, the corners that meet at a point must add up to a full turn, 360 degrees. A regular shape with n sides has corners of 180 minus 360 over n degrees. So only some shapes work.',
      'Pick a shape. The page puts as many copies round one corner as fit, and shows the gap that is left. Triangles fit six round a corner, squares four and hexagons three. A pentagon leaves a gap of 36 degrees, and shapes with more than six sides leave bigger ones. Only the triangle, the square and the hexagon tile a plane.',
    ],
  },
  {
    id: 'wax',
    kicker: 'Second cell',
    title: 'The same room with less wall',
    paras: [
      'Of the three shapes that fit, which one needs the least wall to enclose the same area? Wax is costly for the bees to make, so a cell with a shorter wall saves it. The length of the outline of a regular shape of area 1 is 2 times the square root of n times the tangent of 180 over n degrees.',
      'The bars show the outline for each shape with the same area. The hexagon has the shortest of the three that tile. A circle is shorter still, but circles cannot fill a flat floor without gaps. Slide the number of cells to see the wax for a comb of that many cells. Each wall is shared by two cells, so it counts half.',
    ],
    tags: [
      { label: 'Theorem', text: 'Thomas Hales proved in 1999 that a regular hexagonal grid has the least total wall of any way to divide a plane into pieces of equal area, even with curved walls. This is called the honeycomb conjecture, or the honeycomb theorem. Pappus of Alexandria wrote about it long before, and his proof is lost.' },
    ],
  },
  {
    id: 'soft',
    kicker: 'Third cell',
    title: 'Round cells squeezed into hexagons',
    paras: [
      'Bees do not measure angles. Photographs of new comb show cells that start round. Where three round cells meet, the soft wax is pulled into straight walls with corners of 120 degrees, rather like soap bubbles pressed together. Some researchers think warm wax flows into place. Others think the cells are shaped by squeezing and not by melting. How it really happens is still debated.',
      'Slide the squeeze from round to hexagon. This is a toy model: cells that start as circles touching their neighbours, and walls moved outwards until the gaps close. Round cells leave gaps that are about 9 per cent of the space. The hexagon leaves none.',
    ],
  },
];

export const takeaways = [
  'Only triangles, squares and hexagons fit together with no gaps, because their corners divide 360 degrees evenly.',
  'For the same area, the hexagon needs the shortest wall of the three. About 7 per cent less than the square, and about 18 per cent less than the triangle.',
  'Hales proved in 1999 that a hexagonal grid has the least wall of any way to divide a plane into equal pieces.',
  'Round cells packed together leave gaps of about 9 per cent of the space. Squeezing them closes the gaps.',
  'The bees do not calculate. How wax and bees produce the hexagons is still debated.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. That only triangles, squares and hexagons tile a plane with one regular shape, the honeycomb theorem and Hales’s proof of 1999, and Pappus of Alexandria as the classical source whose proof is lost each appeared in more than one place. The wall lengths, the percentages and the share lost between round cells are computed on the page from exact formulas, and checked against the known values (the hexagon outline of 3.72 for area 1, and a circle packing of 90.69 per cent). The search found no reliable ratio of wax to honey, so the page gives none. Sources disagree on how the hexagons form: some say warm, flowing wax is pulled into shape by surface tension, and others argue that the bees do not heat the wax enough and that the shape comes from mechanical squeezing. The page says it is debated and calls its drawing a toy model. The date of Hales’s publication differs between sources, 1999 or 2001, so the page says only that he proved it in 1999. Nothing here is advice.';

export const sources = [
  { label: 'Wikipedia: honeycomb conjecture', url: 'https://en.wikipedia.org/wiki/Honeycomb_conjecture', for: 'The theorem and its history.' },
  { label: 'Wolfram MathWorld: honeycomb conjecture', url: 'https://mathworld.wolfram.com/HoneycombConjecture.html', for: 'The statement of the theorem.' },
  { label: 'Thomas Hales: cannonballs and honeycombs (Notices of the AMS)', url: 'https://www.ams.org/notices/200004/fea-hales.pdf', for: 'The proof and the history.' },
  { label: 'ResearchGate: the honeycomb conjecture', url: 'https://www.researchgate.net/publication/226672826_The_Honeycomb_Conjecture', for: 'Hales’s paper.' },
  { label: 'PubMed Central: the hexagonal shape of honeycomb cells', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4913256/', for: 'How bees build and shape the cells.' },
  { label: 'bioRxiv: hexagonal structure of honeycomb from closely built cylindrical cells', url: 'https://www.biorxiv.org/content/10.1101/2022.07.13.499872.full.pdf', for: 'Round cells squeezed into hexagons.' },
  { label: 'NBC News: bees do not do maths, hexagons emerge naturally', url: 'https://www.nbcnews.com/sciencemain/bees-dont-do-math-hexagonal-honeycombs-emerge-naturally-6c10677058', for: 'Cells start round.' },
  { label: 'Honey Bee Suite: how honey bees make hexagons', url: 'https://www.honeybeesuite.com/how-honey-bees-make-hexagons/', for: 'The debate on heat and wax.' },
  { label: 'AskNature: honeycomb structure', url: 'https://asknature.org/strategy/honeycomb-structure-is-space-efficient-and-strong/', for: 'Space and strength of the hexagon.' },
  { label: 'Perfect Bee: the secrets of honeycomb', url: 'https://www.perfectbee.com/learn-about-bees/the-science-of-bees/the-secrets-of-honeycomb', for: 'The comb of the honeybee.' },
  { label: 'Best Bees: honeycomb', url: 'https://bestbees.com/honeycomb/', for: 'The cells and the wax.' },
];
