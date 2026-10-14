// Everything the "How tree rings work" page says, in one place.
// A stump with rings, and four ways to read it: grow one, count one, match patterns, and build a long record.
// The weather in the pictures is made up, so the same stumps appear every time.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A tree keeps a diary',
  paras: [
    'In places with seasons, a tree adds a new layer of wood each year, just under the bark. Cut across the trunk and the layers show as rings. Each ring is one year. A wide ring means the tree grew well that year, with plenty of water and a long growing season. A narrow ring means a poor year, such as a dry one.',
    'That makes every stump a diary of the weather. Four panels read it: grow a stump, count the rings, match a beam to a long record to find the year it grew, and see how a record can reach back thousands of years. The weather in the pictures is made up, and each tree is a toy. Without a script, each panel shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'grow',
    kicker: 'Cut one',
    title: 'Grow a stump',
    paras: [
      'Each spring the tree grows fast and makes big, pale cells, called earlywood. Later in the summer it slows down and makes small, dark cells, called latewood. In winter it stops. The sharp line between the dark latewood of one year and the pale earlywood of the next is where one ring ends and another begins.',
      'Slide the number of years the tree has grown, then slide to a year to see its ring. The rings are widest when the tree is young and get thinner as it ages, and good and poor years show on top of that.',
    ],
    tags: [{ label: 'Early and late', text: 'Earlywood forms in fast spring growth with large, thin walled cells. Latewood forms as growth slows towards late summer. The cambium, the thin growing layer under the bark, is inactive in winter.' }],
  },
  {
    id: 'count',
    kicker: 'Cut two',
    title: 'Count the rings',
    paras: [
      'To find the age of a tree, count the rings from the middle to the bark. A tree that fell has an age of one ring for each year it lived at that height. A tree is a little older than the count at the cut, because it took some years to grow up to where it was cut.',
      'Here are three stumps. Count the rings along a line from the middle to the edge, enter your count and check it.',
    ],
    tags: [{ label: 'Not always exact', text: 'Counting alone can go wrong. A dry spell in mid summer can make two rings in one year, and in a very poor year a ring can be missing. That is one reason scientists match patterns between trees and do not only count.' }],
  },
  {
    id: 'match',
    kicker: 'Cut three',
    title: 'Match the patterns',
    paras: [
      'Trees that grew in the same place at the same time had the same weather, so their ring widths rise and fall in the same pattern. This is how an old beam can be dated. Measure its rings, then slide that pattern along a long record from living trees until the ups and downs line up. The year it lines up at is the year it grew. This is called cross dating.',
      'Slide the start year of the beam. The number r says how well the two patterns agree, from 1 for a perfect match to 0 for none. Only one start year gives a high r. Try the button to let the computer find it.',
    ],
    tags: [{ label: 'A. E. Douglass', text: 'The astronomer Andrew Ellicott Douglass founded the Laboratory of Tree-Ring Research at the University of Arizona. In the 1920s he showed that rainfall, temperature and sunlight leave a pattern in the ring widths.' }],
  },
  {
    id: 'long',
    kicker: 'Cut four',
    title: 'A very long record',
    paras: [
      'No living tree is thousands of years old, but the records are. Beams and dead wood from older trees overlap with the younger ones, and each match lets the record reach farther back. Link them in a chain and you can go back thousands of years, one year at a time.',
      'Add samples one at a time. Each one overlaps the one before it by enough rings to be sure of the match, and the record grows older.',
    ],
    tags: [{ label: 'Bristlecone pines', text: 'The oldest known single tree is a bristlecone pine called Methuselah, said to be 4,765 years old. A record built from dead and living bristlecone pines in the southwest of the United States reaches back about 8,500 years. Narrow rings in such records show droughts that lasted 20 to 40 years.' }],
  },
];

export const takeaways = [
  'In places with seasons a tree adds one ring a year. A wide ring means a good growing year and a narrow ring means a poor one.',
  'A ring has pale earlywood, grown in spring, and dark latewood, grown in late summer. The sharp line where dark meets pale marks the end of a year.',
  'Counting rings gives the age, but dry spells can make false rings and poor years can leave a ring out.',
  'Cross dating matches the pattern of wide and narrow rings of a beam against a long record. Only one position fits well, and that gives the year.',
  'Overlapping samples link up into records that go back thousands of years, such as about 8,500 years for bristlecone pines.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. One ring a year in places with seasons, wide rings for good years and narrow rings for dry ones, earlywood and latewood and the boundary between them, cross dating as the main method, false and missing rings, A. E. Douglass and the Laboratory of Tree-Ring Research, and a bristlecone pine chronology of about 8,500 years with the oldest tree about 4,765 years each appeared in at least two places. The sources give slightly different ages for the oldest tree, and the page uses 4,765 as one source says it. The stumps, the weather and the beams are toy models made for this page with a seeded random series, and the best match was found by computing the correlation at every start year.';

export const sources = [
  { label: 'Wikipedia: tree ring', url: 'https://en.wikipedia.com/wiki/Tree_ring', for: 'Rings, earlywood and latewood.' },
  { label: 'Earth Science: dendrochronology (tree ring dating)', url: 'https://earthsci.org/space/space/geotime/dendro/dendro.html', for: 'Ring widths and dating.' },
  { label: 'SERC Carleton: tree rings and climate', url: 'https://serc.carleton.edu/trex/students/labs/lab1_1.html', for: 'Reading rings as climate records.' },
  { label: 'University of Arizona LTRR: crossdating', url: 'https://www.ltrr.arizona.edu/archaeology/dafsprojects/08142007_Final_Update/Dendroarchaeology_in_the_La_Ventana/Methods_Cross_Dating.html', for: 'Matching ring patterns to give each ring its year.' },
  { label: 'University of Arizona LTRR: about tree rings', url: 'https://ltrr.arizona.edu/node/7096', for: 'What tree rings are.' },
  { label: 'Missouri Conservationist: tree rings', url: 'https://mdc.mo.gov/magazines/conservationist/1996-10/tree-rings', for: 'Earlywood, latewood and annual rings.' },
  { label: 'Oxford: geological methods for archaeology', url: 'https://academic.oup.com/book/40686/chapter/348383461', for: 'Tree ring dating in archaeology.' },
  { label: 'New World Encyclopedia: dendrochronology', url: 'https://newworldencyclopedia.org/entry/Dendrochronology', for: 'The history of the method.' },
];
