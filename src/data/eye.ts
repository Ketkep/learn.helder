// Everything the "How the eye sees" page says, in one place.
// A dark room with four tests: the blind spot, the pupil, afterimages and the side of vision.
// The page explains how seeing works. It is not an eye test and not medical advice.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Four tests for your own eyes',
  paras: [
    'The eye works like a camera with a moving lens and a screen at the back, called the retina. But the picture you see is not the picture on the retina. The brain edits it. Four tests show how: a spot you cannot see, a pupil that changes size, a ghost colour after you look away, and a side of vision that is much less sharp than the middle.',
    'This page explains how seeing works. It is not an eye test and not medical advice. If you notice a change in your sight, see an eye doctor. Some tests need your own eyes and a screen held at the distance given. Without a script each test shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'blind',
    kicker: 'Test one',
    title: 'The spot you cannot see',
    paras: [
      'Where the nerve leaves the back of each eye there are no light cells. That patch is the blind spot, about 15 degrees to the side of where you look. You do not notice it, because the other eye covers it and the brain fills in the gap from what is around it.',
      'Cover your left eye. Look at the cross with your right eye and do not look at the dot. Choose how far your eye is from the screen, and the dot moves to the right place. At the right distance the dot disappears. The sizes on screen are approximate.',
    ],
  },
  {
    id: 'pupil',
    kicker: 'Test two',
    title: 'The pupil is a door',
    paras: [
      'The pupil is the hole that lets light into the eye. Muscles in the iris make it smaller in bright light and larger in the dark. In adults it is roughly 2 to 4 millimetres across in bright light and 4 to 8 in the dark.',
      'Slide the brightness. The light that gets in depends on the area of the hole, which goes with the diameter times itself. In this toy the pupil changes in a straight line with the brightness, which is a simplification.',
    ],
  },
  {
    id: 'after',
    kicker: 'Test three',
    title: 'A ghost colour',
    paras: [
      'Stare at a bright colour for half a minute and then look at a white page. You see a ghost in the opposite colour. The usual explanation is that the cells that sense the colour get tired, so for a moment the opposite colour wins. Scientists still argue about which cells are involved.',
      'Pick a colour. Press show colour, look at the dot in the middle for about 30 seconds, then press show blank and keep looking at the same place. The page cannot show you the ghost. You make it.',
    ],
  },
  {
    id: 'side',
    kicker: 'Test four',
    title: 'Sharp in the middle only',
    paras: [
      'Only a tiny area at the centre of the retina, the fovea, has many of the cells that see fine detail and colour. Toward the edge there are far fewer of them, and most of the cells are the kind that see in dim light. So you can read only what you look at straight on.',
      'Look at the cross and do not move your eyes. Slide the angle. The letter next to the cross gets harder to read as it moves to the side. The size of letter you need to read grows with the angle. This is a rough toy, with the screen about 50 centimetres away.',
    ],
    tags: [{ label: 'Not an eye test', text: 'These are demonstrations of how seeing works. They cannot tell you whether your eyes are healthy. For that, see an eye doctor.' }],
  },
];

export const takeaways = [
  'Where the nerve leaves the eye there is a blind spot with no light cells, about 15 degrees to the side of where you look. The brain fills in the gap.',
  'The pupil is a hole that gets smaller in bright light and larger in the dark. The light that gets in goes with its area.',
  'Staring at a colour and then looking at white gives a ghost in the opposite colour. The exact cause is still debated.',
  'Sharp, coloured sight comes from the small central area, the fovea. Toward the side you see much less detail.',
  'This page explains how seeing works. It is not an eye test and not medical advice.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The blind spot at the optic disc with no rods or cones, the brain filling it in, the fovea with many cones and few rods and the rods in the periphery, the pupil of about 2 to 4 mm in bright light and 4 to 8 mm in the dark, and afterimages as an opposite colour from tired colour cells were each found in at least two places. The angle of about 15 degrees for the blind spot comes from general knowledge of vision science and is given as approximate. The pupil moving in a straight line with brightness, the 33 pixels for a degree, the 50 centimetres and the rule for the size of readable letters are made up for the toy. The page explains how seeing works and is not an eye test or medical advice.';

export const sources = [
  { label: 'Wikipedia: blind spot', url: 'https://en.wikipedia.org/wiki/Blind_spot_(vision)', for: 'The optic disc and filling in.' },
  { label: 'Stony Brook: Zelinsky lecture', url: 'https://www3.cs.stonybrook.edu/~mueller/teaching/cse591_visAnalytics/Zelinsky_guest_lecture.pdf', for: 'Filling in at the blind spot.' },
  { label: 'University of Warsaw: neurobiology of vision', url: 'https://www.fuw.edu.pl/~suffa/Neurobiologia/Neurobiologia%2010%20EN.pdf', for: 'The retina and its cells.' },
  { label: 'LaValle: photoreceptor density', url: 'https://lavalle.pl/vr/node135.html', for: 'Rods and cones across the retina.' },
  { label: 'NCBI Bookshelf: the pupil', url: 'https://www.ncbi.nlm.nih.gov/books/NBK381/', for: 'Pupil size in light and dark.' },
  { label: 'Wikipedia: pupil', url: 'https://en.wikipedia.org/wiki/Pupil', for: 'The iris muscles and the pupil range.' },
  { label: 'Wikipedia: afterimage', url: 'https://en.wikipedia.org/wiki/Afterimage', for: 'Afterimages and opponent colours.' },
  { label: 'bioRxiv: the mechanisms behind colour afterimages', url: 'https://www.biorxiv.org/content/10.1101/2022.09.22.508985.full.pdf', for: 'Why the cause is still debated.' },
];
