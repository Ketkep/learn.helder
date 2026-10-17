// Everything the "How a note is built" page says, in one place.
// A scope screen and four things to try: one pure tone, adding harmonics, the voice of an instrument, and beats.
// The recipes of instruments are toys. The facts about waves come from the sources.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Every sound is a sum of sines',
  paras: [
    'A sound is air moving back and forth. A scope draws it as a wavy line. The simplest wave is a sine wave, which has one pitch. Every other steady sound is a mix of sine waves, a note and then notes above it.',
    'Four things to try on the screen. Make one pure tone and see its pitch and loudness. Add harmonics to build a square wave. Mix harmonics to make a toy flute and a toy violin. And play two notes that are nearly the same, to hear beats. Press the play buttons to hear each one. The instrument recipes are toys, and the drawings of fast waves are slowed down. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'tone',
    kicker: 'Screen one',
    title: 'One pure tone',
    paras: [
      'The pitch of a sine wave is the number of waves a second, in hertz. A higher number is a higher note. Double the number and you go up one octave. The height of the wave is how loud it is.',
      'Slide the frequency. The screen shows a tiny slice of time, one hundredth of a second. People hear roughly 20 to 20,000 hertz, and the top of the range gets lower with age. The standard tuning note, the A above middle C, is 440 hertz.',
    ],
  },
  {
    id: 'sum',
    kicker: 'Screen two',
    title: 'Add the harmonics',
    paras: [
      'A harmonic is a sine wave at two, three, four times the frequency of the note. Add them with the right heights and the shape of the wave changes. A square wave is the odd harmonics, with each one 1 over its number as tall as the first. A sawtooth uses all of them.',
      'Pick a shape, or set the eight heights yourself. The screen shows the sum. The square has a hollow sound, and the sawtooth a buzzing one.',
    ],
  },
  {
    id: 'voice',
    kicker: 'Screen three',
    title: 'Why a flute is not a violin',
    paras: [
      'Two instruments playing the same note have the same pitch. They sound different because the harmonics have different heights. This mix is called timbre. The wave repeats at the same rate, but its shape is different.',
      'Pick a voice and play it. These recipes are toys, with eight harmonics and a fixed mix. A real instrument changes its mix from moment to moment, and the start of a note matters a lot.',
    ],
  },
  {
    id: 'beats',
    kicker: 'Screen four',
    title: 'Two notes that nearly match',
    paras: [
      'Play two notes with slightly different frequencies. Now and then the waves add up, and now and then they cancel. You hear the loudness rise and fall. The number of swells a second is the difference between the two frequencies.',
      'Slide the second note. The fast wiggle in the picture is drawn slowly, but the slow swell is true to time. Piano tuners listen for these beats, and when they stop the strings match.',
    ],
    tags: [{ label: 'Keep it quiet', text: 'The page plays only soft tones. If you wear headphones, keep the volume low. This page is not medical advice, and it makes no claim about hearing.' }],
  },
];

export const takeaways = [
  'Pitch is the number of waves a second. Double it for one octave up. The standard A is 440 hertz.',
  'The height of a wave is how loud it is.',
  'Any steady sound is a sum of sine waves at the note and its harmonics. A square wave is the odd harmonics with heights of 1 over the number.',
  'Instruments sound different because their harmonics have different heights, which is called timbre.',
  'Two close notes make beats. The swells a second equal the difference in frequency.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Pitch as frequency in hertz and loudness as the height of the wave, the octave as a doubling, the tuning note A of 440 hertz, the hearing range of about 20 to 20,000 hertz, a square wave as odd harmonics at 1 over n, a sawtooth as all harmonics at 1 over n, a triangle as odd harmonics at 1 over n squared, and the beat frequency as the difference of two frequencies each appeared in at least two places. The recipes for the flute, clarinet, violin and organ sounds are made up for the toy, from the idea that instruments differ in how loud their harmonics are, and real instruments are more complicated. The slow drawing of the fast waves is marked on the page. Nothing here is advice about hearing or health.';

export const sources = [
  { label: 'Carleton College: six properties of sound', url: 'https://people.carleton.edu/~jellinge/m208w14/pdf/01SixPropertiesOfSound.pdf', for: 'Frequency, amplitude and pitch.' },
  { label: 'UNSW: musical sounds and musical signals', url: 'https://www.phys.unsw.edu.au/jw/reprints/Musical-Sounds-and-Musical-Signals.pdf', for: 'Waves, harmonics and timbre.' },
  { label: 'UNSW: pitch, loudness and timbre', url: 'https://www.animations.physics.unsw.edu.au/jw/sound-pitch-loudness-timbre.htm', for: 'The three properties of a note.' },
  { label: 'Columbia: music and computers, sound', url: 'https://sites.music.columbia.edu/cmc/MusicAndComputers/chapter1/01_03.php', for: 'Frequency, amplitude and the sine wave.' },
  { label: 'Sound On Sound: introduction to additive synthesis', url: 'https://www.soundonsound.com/techniques/introduction-additive-synthesis', for: 'Building waves from harmonics.' },
  { label: 'Bytenoise: additive synthesis', url: 'https://bytenoise.co.uk/Additive_synthesis', for: 'Square, sawtooth and triangle waves.' },
  { label: 'OpenStax: beats', url: 'https://openstax.org/books/university-physics-volume-1/pages/17-6-beats', for: 'The beat frequency.' },
  { label: 'Cerritos College: Fourier lab', url: 'https://www.cerritos.edu/cmera/Physics201/Lab/Labs/Fourier/Fourier.pdf', for: 'Adding sines to make other waves.' },
];
