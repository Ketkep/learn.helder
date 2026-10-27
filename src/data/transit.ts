// Everything the "How a transit map is drawn" page says, in one place.
// A draughtsman's desk with four sheets of tracing paper and four things to try: straighten the lines, give the middle room,
// find a route, and guess which trip is farther.
// The history comes from the sources. The city (Maplebury), its distances and its diagram are made up, and the page says so.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A map that tells you the way, not the miles',
  paras: [
    'A map of a train network answers a different question from a map of a city. A rider does not need to know how far apart two stations are. A rider needs to know where the lines go, where they cross and how many stops lie ahead. In 1931 a draughtsman named Harry Beck drew a diagram of the London Underground that kept only that. He bent the lines so that they ran flat, upright or at 45 degrees, and he spaced the stations out evenly.',
    'The company first thought the diagram was too radical. It tried 500 copies in 1932 and printed 700,000 in 1933. Four sheets of tracing paper to try. The city on them is made up: Maplebury, with twelve stations on three lines, and distances in made up kilometres. Straighten the lines. Give the crowded middle more room. Find a route. Then guess which trip is farther. Without a script each sheet shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'straight',
    kicker: 'Sheet one',
    title: 'Straighten the lines',
    paras: [
      'On the real layout, lines wander. They bend toward wherever the track happens to go, so the angles are all different. Beck wanted every stretch of line to be flat, upright or at 45 degrees, like the lines of an electrical circuit diagram, which was part of his work. Some sources say those diagrams were his inspiration, and one says they were not.',
      'Slide from the made up real layout to the diagram. The page counts how many of the 12 stretches between stops lie at one of the tidy angles. At the end all of them do. The price is that the distances are no longer true.',
    ],
    tags: [
      { label: 'History', text: 'Beck first took his design to Frank Pick of the Underground in 1931. It was considered too radical, because it did not show the distances between stations.' },
    ],
  },
  {
    id: 'centre',
    kicker: 'Sheet two',
    title: 'Give the middle room',
    paras: [
      'In a city the stations crowd together in the middle and spread out toward the edge. If you draw them at true scale, the middle is a smudge of names that cannot be read, and the edge has a lot of empty paper. So the diagram makes the middle bigger and the edge smaller. It is a trade: readable, but wrong in size.',
      'Slide to push the real layout outward from the centre, so the middle gets more space. The page works out how many times wider the box around the four central stations has become. This is a toy rule. Real diagrams are drawn by hand, not by one formula.',
    ],
    tags: [
      { label: 'Check', text: 'One article on transit maps says that the centre of London is about 2 per cent of the city’s area but looks four times as big on the Tube map. It is an estimate from one source.' },
    ],
  },
  {
    id: 'route',
    kicker: 'Sheet three',
    title: 'Find the way',
    paras: [
      'What the diagram is good at is route finding. Count the stops, notice where a line crosses another, and you know where to change. The page does the same with a small search. It looks for the route with the fewest stops, and among those the fewest changes.',
      'Pick where you start and where you end. The route is drawn on the diagram, with the number of stops and changes. Then it gives the straight line distance in made up kilometres, which the diagram does not show.',
    ],
  },
  {
    id: 'guess',
    kicker: 'Sheet four',
    title: 'Which is farther',
    paras: [
      'Because the diagram bends distances, a trip with more stops can cover less ground. Two trips are marked on the diagram, one in orange and one in violet. Which one covers more ground in a straight line? The more stops do not always win.',
      'Pick one. The page reveals the stops and the straight line distances of both. The distances are the made up ones of Maplebury. In every pair here, the trip with more stops is the shorter one.',
    ],
    tags: [
      { label: 'History', text: 'Beck’s diagram was later redrawn by others. Sources differ on the year, 1960 or 1961, but one version took out the smooth corners and left cramped places. Paul Garbutt took over in 1964 and brought back the curves and gave the stations more room.' },
    ],
  },
];

export const takeaways = [
  'A transit diagram shows how the lines connect, not how far apart the stations are.',
  'Beck’s style uses only flat, upright and 45 degree lines, and it spaces the stations out evenly.',
  'The crowded middle is drawn bigger and the edge smaller, so readability beats scale.',
  'Counting stops and changes is easy on a diagram, and the same search can be done by a computer.',
  'The price is that distances look wrong, so a trip with more stops can cover less ground.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Beck as a draughtsman who first showed the diagram to Frank Pick in 1931, the verdict that it was too radical because it did not show distances, the lines kept flat, upright or at 45 degrees like a circuit diagram, a trial of 500 copies in 1932 and a full publication of 700,000 copies in 1933, the middle of the map made bigger than its true size, and a later version by Garbutt in 1964 that brought back the curves each appeared in at least two places. Sources differ on whether Beck was laid off or fired at the time, on the year of the redraw that took out the curves (1960 or 1961) and on what he was paid, so the page does not give the pay. The figure that the centre of London is about 2 per cent of the area but looks four times as big comes from one article, and the page says so. Maplebury, its twelve stations, its kilometres, its diagram and the rule that pushes the middle outward are made up. The counts and distances are computed on the page.';

export const sources = [
  { label: 'Wikipedia: Harry Beck', url: 'https://en.wikipedia.org/wiki/Harry_Beck', for: 'Beck, 1931, and the first rejection.' },
  { label: 'Wikipedia: Tube map', url: 'https://en.wikipedia.org/wiki/Tube_map', for: 'The style and the later versions.' },
  { label: 'London Museum: how Harry Beck revolutionised the Tube map', url: 'https://www.londonmuseum.org.uk/collections/london-stories/harry-beck-revolutionised-tube-map/', for: 'The story of the diagram.' },
  { label: 'English Heritage: Harry Beck blue plaque', url: 'https://english-heritage.org.uk/visit/blue-plaques/harry-beck', for: 'Beck and his design.' },
  { label: 'History Hit: the evolution of the London Tube map', url: 'https://www.historyhit.com/in-pictures-the-evolution-of-the-london-tube-map/', for: 'The later redraws.' },
  { label: 'Jenny: distorted network maps', url: 'https://mail.colororacle.org/berniejenny/pdf/2006_Jenny_DistortedNetworkMaps.pdf', for: 'Why the centre is enlarged.' },
  { label: 'Per Square Mile: are our transit maps tricking us', url: 'https://persquaremile.com/2012/08/27/are-our-transit-maps-tricking-us', for: 'The centre looking four times as big.' },
  { label: 'Bates: squeezing the Tube', url: 'https://timetableworld.com/?p=28991', for: 'The history of the map.' },
  { label: 'Manning Fine Art: Harry Beck, the 1933 pocket map', url: 'https://manningfineart.co.uk/shop/harry-c-beck-september-1933-london-underground-pocket-map-first-year-of-issue/', for: 'The first pocket map of 1933.' },
  { label: 'British Council: Paul Garbutt', url: 'https://visualarts.britishcouncil.org/collection/artists/garbutt-paul-e-1919', for: 'Paul Garbutt, who redrew the map.' },
];
