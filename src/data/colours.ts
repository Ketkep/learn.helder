// Everything the "Why four colours are enough" page says, in one place.
// A map room with three things to try: colour a made-up map by hand, see why a ring of regions round a hub sometimes needs a fourth colour,
// and see why a colouring found by a quick rule can use more colours than needed. The history comes from the sources. The map is made up.
// The counts come from running the searches on the page.

export interface Table {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Four colours, for any map',
  paras: [
    'Take any map drawn on a flat sheet, with regions that share borders. Colour it so that no two regions that share a border have the same colour. The question is how many colours you need. For every map ever drawn, the answer is four. No map needs five. That is the four colour theorem, and it took mathematicians more than a hundred years to prove.',
    'Three tables in the map room. On the first, colour a made-up map by hand. On the second, see why some maps cannot be done with three colours. On the third, let a quick rule colour the map, and see that it can waste colours. Regions that only touch at a point do not count as neighbours. Without a script each table shows one picture.',
  ],
};

export const tables: Table[] = [
  {
    id: 'hand',
    kicker: 'First table',
    title: 'Colour a map by hand',
    paras: [
      'Here is a made-up map with eleven regions: a hub, a ring of five inside, and a ring of five outside, turned half a step. Pick a colour, then press a region to give it that colour. Each region shows the number of its colour, so you can tell them apart without the colours.',
      'Regions that share a border and have the same colour are marked with a dark outline, and the page counts them. Try to colour the whole map with no clashes. You can do it with four colours. The page also tells you how many colours you used.',
    ],
  },
  {
    id: 'wheel',
    kicker: 'Second table',
    title: 'Why three is sometimes not enough',
    paras: [
      'Take a hub with a ring of regions round it, like the spokes of a wheel. Every ring region touches the hub and its two neighbours on the ring. The hub needs its own colour. The ring regions can then use two more colours, taking turns, round the ring. If the ring has an even number of regions, the turns come out even, and three colours are enough.',
      'If the ring has an odd number, the last region meets the first and they would be the same colour. A third colour is needed on the ring, and with the hub that makes four. Slide the number of ring regions and press Try three colours. The page runs a full search and shows a colouring, or tells you there is none.',
    ],
  },
  {
    id: 'greedy',
    kicker: 'Third table',
    title: 'A quick rule can waste colours',
    paras: [
      'A simple way to colour a map is to go through the regions in some order and give each the first colour its neighbours have not used. This is called a greedy colouring. It is quick, and it always gives a valid colouring, but the number of colours depends on the order.',
      'Press New order. The same made-up map gets four, five or six colours, depending on the order, though four are always enough. Press Search for the fewest to run a full search, which finds a colouring with four. The four colour theorem says four always exist. It does not say that a quick rule will find them.',
    ],
    tags: [
      { label: 'History', text: 'Francis Guthrie posed the question in 1852. Alfred Kempe published a proof in 1879 that was found to be wrong in 1890 by Percy Heawood, who proved that five colours are always enough. Kenneth Appel and Wolfgang Haken proved four with a computer in 1976. A shorter proof by Robertson, Sanders, Seymour and Thomas followed in the 1990s.' },
    ],
  },
];

export const takeaways = [
  'No map needs more than four colours, if regions that only meet at a point are not neighbours. This is the four colour theorem.',
  'Some maps do need four. A hub with a ring of an odd number of regions round it cannot be done with three.',
  'A quick rule that colours the regions one at a time can use more than four colours. The theorem says four are enough, not that every method finds them.',
  'The problem was posed in 1852, a flawed proof was published in 1879, five colours were proved in 1890 and four in 1976, with the help of a computer.',
  'The map on this page is made up. The counts come from running the searches on the page.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The question posed by Francis Guthrie in 1852, the flawed proof of 1879 found out in 1890 by Heawood who proved five colours, the computer proof of Appel and Haken of 1976, and the shorter proof of Robertson, Sanders, Seymour and Thomas appeared in several places, and sources differ on the year of the last one (1994, 1996 or 1997) and on the date of Kempe’s proof, so the page says only that it followed in the 1990s and gives 1879 for Kempe, which is the usual year. That a wheel with an even rim needs three colours and one with an odd rim needs four appeared in several places, and the sources count the hub in the number of points in different ways, so the page uses the number of ring regions. That regions meeting only at a point do not count as neighbours is the usual rule and no source was found for it in the search. That a greedy colouring can use more colours than needed was found by running it on the page and is not from a source. The map is made up and the counts of colours come from running the searches. Nothing here is advice.';

export const sources = [
  { label: 'AMS Notices: the four-colour theorem 1852 to 1976', url: 'https://www.ams.org/journals/notices/202603/noti3305/noti3305.html', for: 'The history of the problem.' },
  { label: 'Wolfram MathWorld: four-colour theorem', url: 'https://mathworld.wolfram.com/Four-ColorTheorem.html', for: 'The statement and the proofs.' },
  { label: 'MacTutor: the four colour theorem', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/The_four_colour_theorem/', for: 'Guthrie, Kempe and Heawood.' },
  { label: 'Wikipedia: four colour theorem', url: 'https://en.wikipedia.org/wiki/Four_color_theorem', for: 'The proofs and the cases.' },
  { label: 'Simple English Wikipedia: four colour theorem', url: 'https://simple.wikipedia.org/wiki/Four_color_theorem', for: 'A plain account of the theorem.' },
  { label: 'arXiv: a manual proof of the four-colour theorem', url: 'https://arxiv.org/pdf/1711.00934', for: 'Recent work on the proof.' },
  { label: 'ResearchGate: a new proof of the four-colour theorem', url: 'https://www.researchgate.net/publication/2430062_A_New_Proof_Of_The_Four-Colour_Theorem', for: 'The shorter proof.' },
  { label: 'Wikipedia: wheel graph', url: 'https://en.wikipedia.org/wiki/Wheel_graph', for: 'The colours a wheel needs.' },
  { label: 'Wolfram MathWorld: wheel graph', url: 'https://mathworld.wolfram.com/WheelGraph.html', for: 'The colours a wheel needs.' },
  { label: 'Vaia: chromatic number of a wheel graph', url: 'https://www.vaia.com/en-us/textbooks/math/discrete-mathematics-with-applications-1-edition/chapter-8/problem-14-find-the-chromatic-number-of-each-map-or-graph-wh/', for: 'An example of colouring a wheel.' },
];
