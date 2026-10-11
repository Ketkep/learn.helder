// Everything the "The seven bridges of Königsberg" page says, in one place.
// One map of a river town, four panels: walk it, count the bridges, change the town, find a walk.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A walk over every bridge',
  paras: [
    'In the 1700s the town of Königsberg had a river with two islands in it and seven bridges. People liked to ask a puzzle: can you take a walk that crosses every bridge exactly once? Nobody could find one. In 1736 the mathematician Leonhard Euler showed why, and in doing so he started a new kind of maths about dots and lines.',
    'The map below is a simple drawing of the town, with four pieces of land called A, B, C and D. Each panel lets you try something. Without a script, each panel shows the map and its numbers.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'try',
    kicker: 'Try one',
    title: 'Try the walk',
    paras: [
      'Press a piece of land to start there. Then press a bridge next to you to cross it. A bridge can only be crossed once, so the ones you have used are marked. Can you cross all seven?',
      'You can try as often as you like. Nobody can do it, and the next panels show why.',
    ],
    tags: [
      { label: 'The town today', text: 'Königsberg is now Kaliningrad, in Russia. Some bridges were lost in the war and the town was rebuilt, and the sources disagree about what is left. This page only uses the town as Euler knew it.' },
    ],
  },
  {
    id: 'count',
    kicker: 'Try two',
    title: 'Count the bridges',
    paras: [
      'Euler noticed that only one thing matters about each piece of land: how many bridges touch it. Press a piece of land to count its bridges. Here the counts are 3, 3, 5 and 3, and all four are odd.',
      'Every bridge has two ends, so if you add up the counts you get twice the number of bridges: 3 + 3 + 5 + 3 = 14, and 14 is 2 × 7. That means the number of odd counts is always even.',
    ],
  },
  {
    id: 'build',
    kicker: 'Try three',
    title: 'Change the town',
    paras: [
      'Here you can build and take away bridges. Press a bridge to remove it, or press a faint one to build it. The panel says whether a walk over every bridge is possible, and why.',
      'The rule Euler found: a walk over every bridge once exists if the bridges are all joined up and the number of lands with an odd count is 0 or 2. With 2, the walk has to start at one of them and end at the other. With 0 it can start anywhere and end where it began.',
    ],
    tags: [
      { label: 'Try this', text: 'Start with the seven old bridges and build one more. Which bridge gives you a walk? And is there a bridge you can take away to get one?' },
    ],
  },
  {
    id: 'route',
    kicker: 'Try four',
    title: 'Find a walk',
    paras: [
      'Choose where to start and the page works out a walk over every bridge in your town, if there is one. It uses the town from the last panel.',
      'When the town has two odd lands, only those two work as a start. Choose any other and the page tells you there is no walk from there.',
    ],
  },
];

export const takeaways = [
  'Euler solved the puzzle in 1736 by throwing away the map and keeping only the lands and which bridges join them.',
  'What matters about a land is how many bridges touch it. Königsberg had four lands with 3, 3, 5 and 3 bridges.',
  'The counts add up to twice the number of bridges, so the number of odd counts is always even.',
  'A walk over every bridge exactly once is possible if the bridges are joined up and 0 or 2 lands have an odd count.',
  'Königsberg had 4 odd lands, so the walk was impossible. Dots and lines like these are called graphs.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Euler’s 1736 proof, the seven bridges and four lands with 3, 3, 3 and 5 bridges, the rule that a walk needs 0 or 2 odd lands, and the fact that the counts add up to twice the number of edges each appeared in at least two places. Hierholzer is credited with proving that the rule is enough. Sources disagree about which bridges Kaliningrad has today, so the page does not say. The map is a simple drawing made for this page and is not to scale.';

export const sources = [
  { label: 'Wikipedia: Seven Bridges of Königsberg', url: 'https://en.wikipedia.org/wiki/Seven_Bridges_of_K%C3%B6nigsberg', for: 'The puzzle, Euler’s 1736 solution and the degrees 3, 3, 3 and 5.' },
  { label: 'Wikipedia: handshaking lemma', url: 'https://en.wikipedia.org/wiki/Handshaking_lemma', for: 'The counts add up to twice the number of edges.' },
  { label: 'Mathwords: seven bridges of Königsberg', url: 'https://www.mathwords.com/s/seven_bridges_konigsberg.htm', for: 'The puzzle in short.' },
  { label: 'Stony Brook University: lecture 2 (PDF)', url: 'https://www.math.stonybrook.edu/~oleg/mat150-spr16/lecture-2.pdf', for: 'Euler paths and circuits.' },
  { label: 'UC San Diego: Königsberg bridges', url: 'https://fanchung.ucsd.edu/152/class/konig.htm', for: 'The graph of the bridges.' },
  { label: 'NRICH: the Königsberg bridge problem', url: 'https://nrich.maths.org/2484', for: 'Trying the walk and counting odd lands.' },
  { label: 'Mathematical Association: a bridge too far (PDF)', url: 'https://m-a.org.uk/resources/PE6%20A%20Bridge%20Too%20Far.pdf', for: 'Which bridges make the walk possible.' },
  { label: 'Boston University: Euler paths (PDF)', url: 'https://www.bu.edu/lernet/artemis/years/2011/slides/introeuler.pdf', for: 'Zero or two odd vertices.' },
  { label: 'Division by Zero: Königsberg today', url: 'https://divisbyzero.com/2008/09/25/konigsberg-today/', for: 'The bridges of Kaliningrad, which sources disagree about.' },
];
