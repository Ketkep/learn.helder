// Everything the "Why two close notes wobble" page says, in one place.
// A score in three movements: adding two waves, tuning a string by listening for the wobble, and what happens when the notes are further
// apart. The formula for the beats comes from the sources. Where the sources disagree about the point at which beats turn into
// roughness, the page says so. The notes are made in the browser and only play when a button is pressed.

export interface Movement {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Two notes that almost match',
  paras: [
    'Play two notes of almost the same pitch together and you do not hear two notes. You hear one note that swells and fades, again and again. These swells are called beats. Piano tuners listen for them, because when the beats slow down and stop, the two strings match.',
    'Three movements. In the first, add two waves and see where the swells come from. In the second, tune a string against a fixed note by listening for the wobble. In the third, move the notes further apart and see where the swells stop sounding like swells. The sound is made in your browser and plays only when you press a button. Without a script each movement shows one picture or table.',
  ],
};

export const movements: Movement[] = [
  {
    id: 'add',
    kicker: 'First movement',
    title: 'Where the swells come from',
    paras: [
      'A note is a wave. When two waves meet, their heights add. If the waves have the same pitch they always rise and fall together. If one is a little higher, it slowly gets ahead, and every so often the two rise together and the sum is big, and every so often one is up while the other is down and the sum is almost nothing.',
      'Move the second note away from the first. The sum is the wave you hear. It swells and fades once for every full lap the faster wave gains on the slower one, so the number of swells a second is the difference of the two frequencies. Two notes of 440 and 444 hertz give 4 swells a second, and the pitch you hear sits at the average, 442. The waves in the picture are drawn slowed down so that you can see them.',
    ],
  },
  {
    id: 'tune',
    kicker: 'Second movement',
    title: 'Tune a string by ear',
    paras: [
      'To tune a string to a reference note, play them together and listen. A string that is a little off gives slow swells. Turn the peg and the swells get slower as you get closer. When they stop, the two match. This is how a string is tuned by ear.',
      'The reference note here is 440 hertz. Press Listen, then turn the peg until the swells stop. The gauge shows how far off the string is, and the page tells you the swell rate. A new string starts out of tune by a different amount.',
    ],
    tags: [
      { label: 'Example', text: 'A string that moves from 441.7 hertz to 440 hertz at first gives a swell every 0.59 seconds. The swells slow down as it comes closer.' },
    ],
  },
  {
    id: 'rough',
    kicker: 'Third movement',
    title: 'When the swells turn rough',
    paras: [
      'Move the two notes further apart and the swells come faster. At first you can count them. Then they run together into a flutter, then into a roughness that is hard to listen to, and at last you hear two separate notes. The notes have not changed. The ear can only follow slow changes.',
      'Slide the gap and press Listen. Sources do not agree on where one thing turns into the next. They put the change from swells to roughness anywhere from about 7 to 20 hertz, so the zones on the picture are rough guides. Roughness is linked to how the ear separates pitches, in bands that scientists call critical bands.',
    ],
  },
];

export const takeaways = [
  'Two notes of nearly the same pitch swell and fade. These are beats.',
  'The number of beats a second is the difference of the two frequencies, and the pitch you hear is the average.',
  'A tuner minimises the beats. When they stop, the two strings match.',
  'Further apart, the beats run into a flutter, then roughness, then two separate notes.',
  'Sources disagree on exactly where beats turn into roughness, so any such number is a rough guide.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. That the beat rate equals the difference of the two frequencies, that the pitch heard is the average, that the swells vanish when the frequencies match so they are used for tuning, and that loudness peaks twice per cycle of the envelope so the heard rate is the full difference (one source said twice the difference, which is wrong), each appeared in more than one place. The example of a string moving from 441.7 to 440 hertz with a swell every 0.59 seconds came from one source and was checked by computing, 1 over 1.7. Sources disagree on where beats become roughness, at about 7 to 20 hertz in some and up to 40 or 50 in others, so the page says this and calls its zones rough guides. Most of those sources are calculator pages and not textbooks, so no firm figure is given. The waves in the picture are drawn slowed down. The notes on the page are made in the browser from pure tones. Nothing here is advice.';

export const sources = [
  { label: 'Wikipedia: beat (acoustics)', url: 'https://en.wikipedia.org/wiki/Beat_(acoustics)', for: 'The beat rate and the average pitch.' },
  { label: 'Wikiversity: beat (acoustics)', url: 'https://en.wikiversity.org/wiki/Beat_(acoustics)', for: 'Tuning by beats and roughness.' },
  { label: 'University of Wyoming: superposition of waves', url: 'http://physics.uwyo.edu/~dkasper/PHYS_1210/Slides/Day42/superposition.html', for: 'Adding two waves.' },
  { label: 'UC Santa Barbara: beats with signal generators', url: 'https://web.physics.ucsb.edu/~lecturedemonstrations/Composer/Pages/44.54.html', for: 'A demonstration of beats.' },
  { label: 'Institute of Acoustics (Chinese Academy of Sciences): superposition of two waves', url: 'http://english.ioa.cas.cn/psk/200907/t20090708_22086.html', for: 'Interference and beats.' },
  { label: 'Wikipedia: envelope (waves)', url: 'https://en.wikipedia.org/wiki/Envelope_(waves)', for: 'The slowly changing envelope.' },
  { label: 'Physics Tribune: beats in physics', url: 'https://physicstribune.com/waves/beats/', for: 'The formula for beats.' },
  { label: 'CMUSE: beat frequency calculator for musicians', url: 'https://www.cmuse.org/beat-frequency-calculator', for: 'Beats and tuning.' },
  { label: 'Calculate.co.nz: beat frequency calculator', url: 'https://www.calculate.co.nz/beat-frequency-calculator.php', for: 'Beats, roughness and the 440 and 444 example.' },
  { label: 'Firgelli: beat frequency calculator', url: 'https://www.firgelliauto.com/blogs/engineering-calculators/beat-frequency-calculator', for: 'Beats at several rates.' },
  { label: 'arXiv: inharmonicity and noisiness in popular music', url: 'https://arxiv.org/pdf/2408.08127', for: 'Beating and roughness within a critical band.' },
];
