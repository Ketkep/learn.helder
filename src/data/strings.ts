// Everything the "Strings and notes" page says, in one place.
// The page is a row of strings stretched across the screen, one string for each idea.

export interface Lesson {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Tuning up',
  paras: [
    'A guitar, a piano and a harp all make sound the same way: something stretched tight is set shaking, and the shaking makes the air shake. This page has five strings. Each one is stretched across the screen so that you can pluck it and change one thing.',
    'Sound is on by default, with a switch at the top right. Your browser keeps sound locked until your first click or key press. Every number on the page can be read without sound.',
  ],
};

export const lessons: Lesson[] = [
  {
    id: 'length',
    kicker: 'String one',
    title: 'Shorter is higher',
    paras: [
      'This string, plucked whole, makes a low note: 110 vibrations a second, which is the note A2. Pluck it, then drag the orange bridge to the right to shorten the part that can shake.',
      'The shorter the string, the faster it shakes and the higher the note. Half the length gives twice the vibrations: 220 a second, a note exactly one octave higher. A quarter of the length gives 440, two octaves up.',
    ],
    tags: [
      { label: 'The standard A', text: 'Orchestras tune to an A that vibrates 440 times a second. The International Organization for Standardization took up this pitch in 1955 and made it the standard ISO 16 in 1975.' },
    ],
  },
  {
    id: 'wave',
    kicker: 'String two',
    title: 'Seeing the shake',
    paras: [
      'A string moves far too fast to see. Here two strings are shown in slow motion: the long one and a string half as long. Drag the time slider, or press play, and count how often each one swings.',
      'The short string swings twice for every swing of the long one. Pitch is nothing more than how many swings there are in a second. The note you hear is a number of vibrations a second, which is called its frequency, and it is counted in hertz (Hz).',
    ],
  },
  {
    id: 'tight',
    kicker: 'String three',
    title: 'Tight and thick',
    paras: [
      'Length is not the only thing that sets the note. Turning the tuning peg makes the string tighter, and a tighter string shakes faster. A thicker string is heavier, and a heavier string shakes slower.',
      'The rule is the same for every string: the frequency goes with the square root of the tension, and falls with the thickness. To go up one octave by tightening alone you need four times the tension. Try it with the sliders.',
    ],
    tags: [{ label: 'Why low strings are thick', text: 'This is why the low strings of a guitar are thicker than the high ones. The strings can be about the same length and still sound far apart.' }],
  },
  {
    id: 'ratio',
    kicker: 'String four',
    title: 'Friends and strangers',
    paras: [
      'Pythagoras and his followers, about 2,500 years ago, are said to have tried this on an instrument with a single string and a movable bridge. They found that string lengths in simple ratios gave notes that sound good together. Half the length (2 to 1) is the octave. Two thirds (3 to 2) is a fifth. Three quarters (4 to 3) is a fourth.',
      'Here is one way to see why. Add the two vibrations together. With a simple ratio the sum repeats after a short time and looks tidy. With a complicated ratio it takes a long time to repeat, and looks ragged. Pick an interval, look at the sum, and listen.',
    ],
    tags: [
      { label: 'A rule of thumb', text: 'Many people hear simple ratios as smooth and complicated ones as tense, but taste in music also depends on the culture and on how the instrument is tuned.' },
      { label: 'On a piano', text: 'A piano is tuned so that every key sounds the same. Each step up (a semitone) multiplies the frequency by about 1.0595, the twelfth root of 2. Its fifth is therefore very slightly off the perfect ratio of 3 to 2.' },
    ],
  },
  {
    id: 'sound',
    kicker: 'String five',
    title: 'Building a sound',
    paras: [
      'A real string does not shake in only one way. It also shakes in halves, in thirds and in quarters, all at once. These extra shakes are called harmonics. They have 2, 3, 4 and more times the frequency of the note.',
      'The mix of harmonics gives an instrument its character. A flute and a guitar can play the same note and still sound different, because they have different mixes. Move the sliders to mix your own sound, then press play. The line shows the shape of your mix.',
    ],
    tags: [
      { label: 'Touch it lightly', text: 'Guitar players can bring out a harmonic by touching a string lightly at half its length instead of pressing it down. The dots on the strings below show where those places are.' },
    ],
  },
];

export const takeaways = [
  'A string that is half as long vibrates twice as fast and sounds one octave higher.',
  'Pitch is a count: the number of vibrations in a second, measured in hertz.',
  'Tighter makes higher, thicker makes lower. Four times the tension is one octave up.',
  'Notes whose frequencies are in simple ratios, such as 2 to 1 or 3 to 2, add up to a pattern that repeats quickly. Many people find them smooth.',
  'A real note is a mix of harmonics. The mix is what makes a guitar sound different from a flute.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The formula for a vibrating string, the ratios 2 to 1, 3 to 2 and 4 to 3, and the standard A of 440 Hz each appeared in at least two places. The strings on this page are drawn and played by simple models made for this page. Real strings also stiffen, lose energy and vibrate in more ways than shown. The made-up numbers are the starting note (110 Hz for the whole string) and the scale of the tension and thickness sliders.';

export const sources = [
  { label: 'Stanford CCRMA: fundamental frequency of a vibrating string', url: 'https://ccrma.stanford.edu/realsimple/weighted_mono/Fundamental_Frequency_Vibration.html', for: 'The frequency of a string from its length, tension and weight per length.' },
  { label: 'arXiv: intonation and compensation of fretted string instruments', url: 'https://arxiv.org/pdf/0906.0127', for: 'The same formula, applied to a guitar.' },
  { label: 'Physics of Music, University of Modena and Reggio Emilia: from the monochord to the musical scales', url: 'https://fisicaondemusica.unimore.it/Dal_monocordo_alle_scale_musicali_en.html', for: 'Pythagoras, the monochord and the ratios 2:1, 3:2 and 4:3.' },
  { label: 'College of the Holy Cross: Math, music and memory (monochord)', url: 'https://mathcs.holycross.edu/~groberts/Courses/Mont1/HW/Monochord.pdf', for: 'Dividing a string to find the octave, fifth and fourth.' },
  { label: 'teoria.com: Pythagorean tuning', url: 'https://www.teoria.com/en/articles/temperaments/02-pythagoras.php', for: 'Simple ratios and the history of tuning.' },
  { label: 'Wikipedia: A440 (pitch standard)', url: 'https://en.wikipedia.org/wiki/A440_(pitch_standard)', for: 'A4 is 440 Hz, ISO 16, and the twelfth root of 2 for a semitone.' },
  { label: 'Wikipedia: string harmonic', url: 'https://en.wikipedia.org/wiki/String_harmonic', for: 'Touching a string lightly at a node to bring out a harmonic.' },
  { label: 'Ethan Hein: why do musical notes sound different on different instruments?', url: 'https://www.ethanhein.com/wp/2011/why-do-musical-notes-sound-different-on-different-instruments/', for: 'Timbre comes from the mix of overtones.' },
];
