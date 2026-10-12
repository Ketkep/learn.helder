// Everything the "Why leaves change colour" page says, in one place.
// A leaf holds three kinds of colour. Three panels mix them, separate them on paper and follow them through the autumn.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Three colours in a leaf',
  paras: [
    'A green leaf holds more than green. It holds yellow and orange colours as well, but the green is so strong that it hides them. In autumn the green breaks down faster than the leaf can make more. The yellow and orange that were there all along show through. Some trees also make a new colour, red.',
    'Three panels look at this: a mixer for the three colours, a strip of paper that pulls them apart, and a slider through the weeks of autumn. The numbers are toy models made for this page, based on typical patterns, and real trees vary. Without a script, each panel shows a table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'mix',
    kicker: 'Panel one',
    title: 'The colours in a leaf',
    paras: [
      'Chlorophyll is the green colour that lets a leaf catch sunlight to make food. Carotenoids are yellow and orange colours. Anthocyanins are red and purple colours. Each one soaks up some colours of light and lets the rest through, and what is left is the colour you see.',
      'Slide the three colours up and down. Start with a lot of chlorophyll and the leaf is green. Take the chlorophyll away and the yellow shows. Add anthocyanins and it turns orange or red.',
    ],
    tags: [{ label: 'Carotenoids', text: 'The same colours make carrots orange. In a green leaf they are there all summer, hidden under the chlorophyll.' }],
  },
  {
    id: 'paper',
    kicker: 'Panel two',
    title: 'A leaf on paper',
    paras: [
      'You can pull the colours of a leaf apart with a strip of paper. Rub a leaf on the strip, stand the end in a liquid, and the liquid creeps up the paper and carries each colour along at its own speed. This is called paper chromatography.',
      'Pick a summer leaf or an autumn leaf and slide the liquid up the strip. In the summer leaf the green bands are strong. In the autumn leaf they are faint, and the yellow and orange bands are what is left.',
    ],
    tags: [{ label: 'Rough positions', text: 'Carotene travels farthest, then xanthophyll, then chlorophyll a, then chlorophyll b. The exact heights depend on the liquid used, and sources give different numbers, so the heights here are only typical.' }],
  },
  {
    id: 'season',
    kicker: 'Panel three',
    title: 'From summer to frost',
    paras: [
      'As the days shorten and the nights cool, the leaf makes less chlorophyll and the old chlorophyll breaks down. The yellow and orange are revealed. Red anthocyanins are made in the autumn, and the leaf makes more of them when the days are bright and sugar builds up in it.',
      'Slide through the weeks. Switch the weather between bright sunny days with cool nights and dull weather. Then add a hard frost, which in this model stops the leaf making any more red.',
    ],
    tags: [{ label: 'A rule of thumb', text: 'Sources say warm sunny days and cool nights that stay above freezing tend to give the brightest reds, and that the weather and moisture change how strong the colours are. This model turns that rule into numbers, so it is a picture of the idea and not a forecast.' }],
  },
];

export const takeaways = [
  'A leaf holds green chlorophyll, yellow and orange carotenoids and, in some trees, red anthocyanins. Each soaks up some colours of light.',
  'In autumn the leaf makes less chlorophyll and the old chlorophyll breaks down, so the yellow and orange that were already there show through.',
  'Red anthocyanins are mostly made in the autumn, more when the days are bright and sugar builds up in the leaf.',
  'Paper chromatography pulls the colours apart: carotene travels farthest, then xanthophyll, then chlorophyll a, then chlorophyll b.',
  'Bright sunny days with cool nights tend to give the best reds, and a hard frost can end the show.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Chlorophyll breaking down in autumn and revealing the carotenoids, anthocyanins being mostly made in the autumn, sunny days with cool nights giving the best reds, and the order of the bands on paper (carotene, xanthophyll, chlorophyll a, chlorophyll b) each appeared in at least two places. The sources disagree on the exact heights of the bands, which depend on the liquid, so only the order is firm. The colours of the mixer, the weeks of the season and the effects of sun and frost are toy models made for this page, based on rules of thumb, and they do not forecast a real autumn.';

export const sources = [
  { label: 'USDA: why leaves change colour', url: 'https://www.usda.gov/node/19309', for: 'Chlorophyll breaks down and carotenoids show.' },
  { label: 'Mass.gov: why leaves change colour (PDF)', url: 'https://www.mass.gov/doc/why-leaves-change-color/download', for: 'Weather and species change the colours.' },
  { label: 'New England: why leaves change colour', url: 'https://newengland.com/today/seasons/fall/why-leaves-change-color/', for: 'The three kinds of colour.' },
  { label: 'Hike New England: why leaves change colour', url: 'https://hikenewengland.com/ArticleWhyLeavesChangeColor080111.php', for: 'Anthocyanins and the best weather for red.' },
  { label: 'Gizmodo: the science of autumnal beauty', url: 'https://gizmodo.com/the-science-of-autumnal-beauty-5659538', for: 'Pigments in autumn leaves.' },
  { label: 'IB Bioninja: chromatography (PDF)', url: 'https://ib.bioninja.com.au/downloads/Chromatography.pdf', for: 'Separating leaf pigments on paper.' },
  { label: 'AQA practical: chromatography in different leaves', url: 'https://myedspace.co.uk/myresources/a-level/biology/aqa/revision-notes/required-practical-7-chromatography-in-different-leaves', for: 'The order of the pigment bands.' },
  { label: 'TutorChase: pigment separation by chromatography', url: 'https://www.tutorchase.com/notes/cie-a-level/biology/13-1-6-pigment-separation-by-chromatography', for: 'Carotene travels farthest.' },
];
