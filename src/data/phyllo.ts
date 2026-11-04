// Everything the "Why sunflower seeds spiral" page says, in one place.
// A flower head in three rings with one thing to try in each: turn each new seed by an angle, count the spiral arms that appear, and
// see which angles leave gaps. The model, the golden angle and the Fibonacci counts come from the sources. The gap measure is a toy
// measure made for this page, and the page says that many angles near the golden one look much the same.

export interface Ring {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'One turn, repeated, and spirals appear',
  paras: [
    'Look at the middle of a sunflower and you see seeds in curving spirals, some turning one way and some the other. Nobody drew them. They come from one simple rule: each new seed grows a little further out than the one before, and turned by the same angle.',
    'Three rings to try. In the first, choose the angle and watch the head fill. In the second, count the spiral arms. In the third, see which angles leave gaps. The seeds follow a simple model of a sunflower head, drawn in a flat picture. It is a model and not a photograph. Without a script each ring shows one picture.',
  ],
};

export const rings: Ring[] = [
  {
    id: 'turn',
    kicker: 'First ring',
    title: 'Turn each new seed by the same angle',
    paras: [
      'In the model, seed number n sits at a distance from the middle that grows with the square root of n, and each seed is turned by a fixed angle from the one before. The square root keeps the seeds about the same distance apart, so the head fills evenly.',
      'Pick an angle. Quarter turns and thirds of a turn put the seeds on straight rays and leave wide gaps between them. An angle of about 137.5 degrees gives no rays at all. That angle is called the golden angle. It is 360 divided by the golden ratio squared, which is about 137.508 degrees, and the figure 137.5 is rounded.',
    ],
  },
  {
    id: 'count',
    kicker: 'Second ring',
    title: 'Count the spiral arms',
    paras: [
      'With the golden angle, the seeds line up in curving arms. Count the arms in one direction and you get a Fibonacci number: 5, 8, 13, 21, 34, 55. Count the other direction and you get the next one. Sunflower heads typically show a pair such as 34 and 55, and pine cones often 8 and 13. These are typical and not a rule for every flower.',
      'Pick a number. The page colours the seeds whose numbers differ by that number, so you can see that many arms curving one way. A seed has a neighbour that is exactly that many places further on, and the chain of those neighbours is one arm.',
    ],
    tags: [
      { label: 'Why', text: 'New seeds and leaves form in the biggest gap that is left. This is called Hofmeister’s rule, from 1868. A plant hormone called auxin helps to make it happen, because a new bud draws it away from its neighbours.' },
    ],
  },
  {
    id: 'gaps',
    kicker: 'Third ring',
    title: 'Which angles leave gaps',
    paras: [
      'A turn that is a simple fraction of the circle, such as a third or a fifth, brings the seeds back to the same rays again and again, so they pile up on the rays and leave gaps between. A turn that is not a fraction never repeats, so each new seed lands in a gap.',
      'Slide the angle. The graph shows the biggest empty space in the head for each angle, measured as a share of the average spacing. This measure is a toy made for this page. It shows sharp spikes at simple fractions such as 120, 144 and 180 degrees. Many other angles look about as good as the golden angle at this size, and some sources say that fractions with big bottom numbers are practically indistinguishable from it. One study of gerbera heads found that the spirals can form without the golden angle being put in.',
    ],
  },
];

export const takeaways = [
  'Each new seed is a little further out than the one before and turned by the same angle. The spirals come from that one rule.',
  'The golden angle is about 137.508 degrees. 137.5 is a rounded figure.',
  'With the golden angle, the spiral arms counted in each direction are neighbouring Fibonacci numbers, such as 34 and 55.',
  'A turn that is a simple fraction of the circle puts seeds on straight rays and leaves gaps.',
  'Many angles near the golden one look much the same. The model does not prove that the golden angle is the only good one.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The seed model with a distance growing as the square root of the number and a fixed turn, the golden angle of 137.508 degrees as 360 over the golden ratio squared, spiral counts that are Fibonacci numbers, typical sunflower pairs such as 34 and 55 and pine cone pairs such as 8 and 13, Hofmeister’s rule of 1868 and the part of auxin each appeared in more than one place. A 2022 study of gerbera heads that found spirals without the golden angle was seen in one place, and the page says so. A source says rational angles with big bottom numbers are practically indistinguishable from the golden angle, which matches the graph on the page. The gap measure is a toy made for this page and has no source. The colouring by number modulo a Fibonacci number is how the model shows the arms and is computed on the page. Nothing here is advice.';

export const sources = [
  { label: 'Wikipedia: phyllotaxis', url: 'https://en.wikipedia.org/wiki/Phyllotaxis', for: 'Hofmeister’s rule and the arrangement of seeds.' },
  { label: 'Wikipedia: golden angle', url: 'https://en.wikipedia.org/wiki/Golden_angle', for: 'The value of the golden angle.' },
  { label: 'Wolfram MathWorld: Vogel spiral', url: 'https://mathworld.wolfram.com/VogelSpiral.html', for: 'The seed model.' },
  { label: 'Wikipedia: Fermat’s spiral', url: 'https://en.wikipedia.org/wiki/Fermat%27s_spiral', for: 'The square root spiral.' },
  { label: 'PubMed Central: Fibonacci spirals may not need the golden angle', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10095852/', for: 'The gerbera study.' },
  { label: 'PubMed Central: biophysical optimality of the golden angle in phyllotaxis', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4607949/', for: 'Why the angle is special.' },
  { label: 'PubMed Central: a capitulum of Asteraceae', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6859721/', for: 'The structure of a flower head.' },
  { label: 'arXiv: Fibonacci numbers in phyllotaxis, a simple model', url: 'https://arxiv.org/pdf/1203.6257', for: 'Why the counts are Fibonacci numbers.' },
  { label: 'arXiv: vascular phyllotaxis transition', url: 'https://arxiv.org/pdf/1207.2838', for: 'Rational angles and the golden angle.' },
  { label: 'That’s Maths: sunflowers and Fibonacci', url: 'https://thatsmaths.com/2014/06/05/sunflowers-and-fibonacci-models-of-efficiency/', for: 'Sunflower counts.' },
  { label: 'Zonnebloemen: sunflowers and Fibonacci, the golden angle', url: 'https://zonnebloemen.com/en/biology/fibonacci/', for: 'The golden angle in sunflowers.' },
];
