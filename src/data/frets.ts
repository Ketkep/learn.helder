// Everything the "Why frets get closer together" page says, in one place.
// A guitar neck in three positions with a thing to try in each: where the frets go, why the gaps shrink and what a fret on a string
// sounds like, and why the frets of equal temperament are close to, but not exactly at, the places a simple fraction would give.
// The rule for the frets and the ratios come from the sources. The strings are in the usual tuning and sound only when a button is pressed.

export interface Position {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Twelve steps, each one a little narrower',
  paras: [
    'Look along the neck of a guitar and you see that the frets crowd closer together as they go up. The gap between the nut and the first fret is the widest, and the gaps get smaller all the way to the body. This is not a trick of the eye or a habit of makers. It follows from how a string makes its note.',
    'Three positions on the neck. In the first, see where the frets go for a given length of string. In the second, see why the gaps shrink and play the note at each fret. In the third, compare the fret of a simple fraction with the fret of the usual tuning. Notes sound only when you press a button. Without a script each position shows one picture or table.',
  ],
};

export const positions: Position[] = [
  {
    id: 'where',
    kicker: 'First position',
    title: 'Where the frets go',
    paras: [
      'The pitch of a string goes up when the part that vibrates gets shorter. In fact the pitch is inversely proportional to the length: halve the length and the pitch doubles, which is an octave. Pressing a string against a fret shortens the part that can vibrate.',
      'In the usual tuning of a guitar there are twelve equal steps in an octave. Each step raises the pitch by the same ratio, the twelfth root of 2, which is about 1.0595. So the length left after n frets is the scale length divided by that ratio n times. The distance from the nut to fret n is the scale length times 1 minus 2 to the power minus n over 12. The twelfth fret is exactly halfway along the string. Pick a scale length and press a fret.',
    ],
    tags: [
      { label: 'Example', text: 'For a scale length of 25.5 inches, the first fret is about 1.43 inches from the nut and the twelfth fret is at 12.75 inches, exactly half.' },
    ],
  },
  {
    id: 'gaps',
    kicker: 'Second position',
    title: 'Why the gaps shrink',
    paras: [
      'Each fret takes the same fraction off the string that is left, about 5.6 per cent, and not the same length. As the string gets shorter, the same fraction is a smaller length, so the gaps shrink. This is why makers used a rule of thumb, dividing the length left by 17.817 to find the next fret, and why that rule is a shortcut for the same maths.',
      'Pick a string and slide the fret. The page shows the length left and the pitch, and the bars show the gap before each fret. Press Play to hear the note. The note names are for the usual tuning, and the pitches follow from the open string multiplied by the twelfth root of 2 once for every fret.',
    ],
  },
  {
    id: 'pure',
    kicker: 'Third position',
    title: 'A fret and a simple fraction',
    paras: [
      'Players have long known that a string pressed at two thirds of its length gives a note a fifth above the open string, with a ratio of 3 to 2. A string at three quarters gives a fourth, and at four fifths a major third. These simple fractions sound very smooth together.',
      'The frets of equal temperament are close to those places, but not at them. Pick an interval and see the difference in millimetres, and in cents, a hundredth of a semitone. The fifth is off by about 2 cents, so little that the seventh fret is very close to two thirds. The major third is off by about 14 cents, which is easy to hear on a long held chord.',
    ],
  },
];

export const takeaways = [
  'The pitch of a string is inversely proportional to the length that vibrates. Halve the length and the pitch doubles.',
  'In equal temperament each fret raises the pitch by the twelfth root of 2, about 1.0595. The twelfth fret is exactly halfway.',
  'The distance from the nut to fret n is the scale length times 1 minus 2 to the power minus n over 12.',
  'Each fret takes the same share, about 5.6 per cent, off the string that is left, so the gaps shrink.',
  'The frets are close to, but not at, the places a simple fraction would give. A fifth is 2 cents away and a major third about 14.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. That the pitch of a string is inversely proportional to its vibrating length (Mersenne’s law), that halving the length doubles the pitch, the formula for the distance from the nut as the scale length times 1 minus 2 to the power minus n over 12, the 12th fret at half the length, and the rule of dividing by 17.817 as an approximation, each appeared in more than one place. The numbers 1.431 inches, 12.75 inches, 1.0595, 17.817, 2 cents and 14 cents were also computed on the page. The scale lengths of 648 millimetres (25.5 inches) and 629 millimetres (24.75 inches) are offered as common lengths. A source used 648 millimetres as an example, and the conversions are arithmetic, but that these are common lengths was not confirmed in the search and no maker is named. The open strings of the usual tuning are general knowledge and not confirmed in the search. A real guitar differs a little from this model, because pressing a string changes its tension, and makers adjust positions. Nothing here is advice.';

export const sources = [
  { label: 'ATE Central: fret spacing mathematics', url: 'https://atecentral.net/downloads/9783/Fret%20Spacing%20Mathematics.pdf', for: 'The maths of fret spacing.' },
  { label: 'Liutaio Mottola: calculating fret positions', url: 'https://www.liutaiomottola.com/formulae/fret.htm', for: 'The formula for fret positions.' },
  { label: 'CMUSE: twelfth root fret position calculator', url: 'https://www.cmuse.org/twelfth-root-fret-position-calculator', for: 'Distance from the nut for each fret.' },
  { label: 'Douglas Niedt: guitar fret distance calculator', url: 'https://douglasniedt.com/fret-calculator.html', for: 'Fret distances.' },
  { label: 'arXiv: music in terms of science', url: 'https://arxiv.org/pdf/1209.3767', for: 'Pitch and string length.' },
  { label: 'arXiv: intonation and compensation of fretted string instruments', url: 'https://arxiv.org/pdf/0906.0127', for: 'The law of the vibrating string.' },
  { label: 'arXiv: simulating a guitar with a conventional sonometer', url: 'https://arxiv.org/pdf/1105.4570', for: 'Why a real guitar differs from the model.' },
  { label: 'University of Connecticut: vibrating strings', url: 'https://www.phys.uconn.edu/~gibson/Notes/Section3_3/Sec3_3.htm', for: 'Halving the length and the octave.' },
  { label: 'EdukateSG: guitar fret maths', url: 'https://edukatesg.com/2026/10/08/why-mathematics-guitar-frets-equal-temperament-logarithms/', for: 'Equal temperament and logarithms.' },
  { label: 'Physics Forums: pitch and fret position', url: 'https://www.physicsforums.com/threads/question-about-the-physics-behind-a-guitar-string.229237/', for: 'Why frets give different pitches.' },
  { label: 'US patent 6218603: note locator for stringed instruments', url: 'https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/6218603', for: 'The ratio of a semitone.' },
];
