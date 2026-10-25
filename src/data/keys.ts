// Everything the "How a musical scale is built" page says, in one place.
// A keyboard of four white keys and four things to try: build a scale from a pattern, twelve equal steps, stacking fifths, and a listening quiz.
// The patterns and ratios are computed on the page. The sources give the patterns, the tuning and the comma.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Seven notes, one pattern',
  paras: [
    'A piano has 12 different notes in each octave, counting the black keys. A scale picks some of them. The most familiar scale uses seven, and it is built from a short pattern of steps. Start from any note and follow the pattern, and you get a scale that sounds the same, only higher or lower.',
    'Four things to try. Build scales from a pattern of steps and hear them. See why an octave is split into twelve equal steps, and what each step does to the frequency. Stack fifths and find out why twelve of them do not quite come home. And listen to a scale and say whether it is major or minor. The patterns and the sums are worked out by the page. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'build',
    kicker: 'First key',
    title: 'Build a scale',
    paras: [
      'The smallest step on a piano is a half step, from one key to the very next, black or white. Two half steps make a whole step. The major scale goes whole, whole, half, whole, whole, whole, half. Count the steps on the keys and you reach the same note an octave higher. The natural minor scale goes whole, half, whole, whole, half, whole, whole. The pentatonic scales use only five notes, and some of their gaps are three half steps.',
      'Pick a starting note and a kind of scale. The lit keys are the scale. The gaps are shown as W for a whole step and H for a half step, or a number of half steps for a bigger gap. The page names notes with sharps only, so a scale that musicians would write with flats shows the sharp name instead.',
    ],
  },
  {
    id: 'twelve',
    kicker: 'Second key',
    title: 'Twelve equal steps',
    paras: [
      'Going up an octave doubles the frequency. In the usual tuning, equal temperament, the octave is split into 12 equal steps, and each step multiplies the frequency by the same number. Twelve steps must make 2, so each step multiplies by the twelfth root of 2, which is about 1.0595. The note A above middle C is set at 440 hertz, a standard fixed in 1939.',
      'Slide the number of steps up from A. The page shows the frequency and the multiplier. At 12 steps you are at 880 hertz, exactly double.',
    ],
  },
  {
    id: 'fifths',
    kicker: 'Third key',
    title: 'Stacking fifths',
    paras: [
      'The most natural interval after the octave is the fifth, where the frequencies are in the ratio 3 to 2. Start on C and go up a fifth to G, then D, A, E, B and so on. After 12 fifths you come back to a C, but it does not quite match. Twelve fifths of 3 to 2 overshoot seven octaves by a small gap of about 23.46 cents, a quarter of a half step. It is called the Pythagorean comma.',
      'Equal temperament solves this by making every fifth a little narrow, by about 2 cents. A just fifth is 701.96 cents and an equal tempered fifth is exactly 700. Slide the number of fifths and see how the pure stack drifts away from the equal notes.',
    ],
  },
  {
    id: 'quiz',
    kicker: 'Fourth key',
    title: 'Major or minor',
    paras: [
      'Major and minor scales differ by where the half steps fall. In a major scale the third note is a whole step plus a whole step above the first. In minor it is a whole step plus a half step. Many people hear major as bright and minor as darker, though that is a matter of taste and culture.',
      'Press Play to hear a scale on a random starting note, then say which kind it was. Turn the sound on first.',
    ],
  },
];

export const takeaways = [
  'A scale is a pattern of steps. The major scale is whole, whole, half, whole, whole, whole, half, and the natural minor is whole, half, whole, whole, half, whole, whole.',
  'An octave doubles the frequency. Equal temperament splits it into 12 equal steps, each step times about 1.0595. A above middle C is 440 hertz.',
  'A fifth in tune is a ratio of 3 to 2, about 701.96 cents. Twelve of them overshoot seven octaves by about 23.46 cents, the Pythagorean comma.',
  'Equal temperament makes each fifth exactly 700 cents, about 2 cents narrow, so the circle of fifths closes.',
  'The pentatonic scales use five notes and have bigger gaps.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The major scale as whole, whole, half, whole, whole, whole, half with the offsets 0, 2, 4, 5, 7, 9 and 11, the natural minor as whole, half, whole, whole, half, whole, whole with 0, 2, 3, 5, 7, 8 and 10, the equal temperament step of the twelfth root of 2, A above middle C at 440 hertz, standardised in 1939 (before that between about 415 and 466 hertz), the fifth as 3 to 2 and 701.96 cents against 700 in equal temperament, and the Pythagorean comma of 531441 over 524288, or 23.46 cents, each appeared in at least two places. The pentatonic patterns (0, 2, 4, 7, 9 and 0, 3, 5, 7, 10) are standard but were not confirmed by the sources checked here. The sums on the page are computed. The remark that major sounds bright and minor darker is a common view and is marked as a matter of taste.';

export const sources = [
  { label: 'Songtive: scale formulas and intervals', url: 'https://www.songtive.com/en/reference/scale-formulas', for: 'The step patterns and semitone offsets.' },
  { label: 'MasterClass: the basics of musical scales', url: 'https://www.masterclass.com/articles/the-basics-of-musical-scales', for: 'Major and minor patterns.' },
  { label: 'Provo Music Magazine: how to build major and minor scales', url: 'https://provomusicmagazine.com/2023/01/18/how-to-build-major-and-minor-scales/', for: 'The natural minor pattern.' },
  { label: 'LibreTexts: musical intervals and temperament', url: 'https://phys.libretexts.org/Bookshelves/Waves_and_Acoustics/Understanding_Sound_(Abbot)/02%3A_Perception_of_sound/2.04%3A_Musical_intervals_and_temperament', for: 'The twelfth root of 2.' },
  { label: 'arXiv: revising the musical equal temperament', url: 'https://arxiv.org/pdf/1508.02292', for: 'The semitone ratio and A at 440 hertz.' },
  { label: 'Songtive: note frequencies', url: 'https://www.songtive.com/reference/note-frequencies', for: 'Frequencies of the notes.' },
  { label: 'Wikipedia: Pythagorean comma', url: 'https://en.wikipedia.org/wiki/Pythagorean_comma', for: 'The comma of 23.46 cents.' },
  { label: 'Wikipedia: circle of fifths', url: 'https://en.wikipedia.org/wiki/Circle_of_fifths', for: 'Twelve fifths and seven octaves.' },
  { label: 'Wikipedia: perfect fifth', url: 'https://en.wikipedia.org/wiki/Perfect_fifth', for: '3 to 2 and 701.96 cents against 700.' },
];
