// Everything the "How rhythm works" page says, in one place.
// A drum machine in four boards: a steady beat, a pattern grid, evenly spread hits, and two beats at once.

export interface Board {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Count it out',
  paras: [
    'Rhythm is when sounds are spaced out in time. Underneath most music there is a steady beat, like a pulse, and the other sounds are placed on it or between it. Change the spacing and the same few sounds make a very different groove.',
    'Four boards of a drum machine follow. Each makes sound when you press play, and none of them starts by itself. There is a switch for the sound. Without a script, each board shows its patterns as plain rows of x for a hit and a dot for a rest.',
  ],
};

export const boards: Board[] = [
  {
    id: 'beat',
    kicker: 'Board one',
    title: 'The steady beat',
    paras: [
      'Tempo is how fast the beat goes, counted in beats per minute, or BPM. At 60 BPM there is one beat every second. At 120 BPM there are two a second. Beats are grouped into bars, and the first beat of each bar is usually the strongest.',
      'The time signature says how many beats are in a bar. 4/4 means four, 3/4 means three, like a waltz. Change the tempo and the bar and press play. The first beat of each bar sounds different.',
    ],
    tags: [{ label: 'The sum', text: 'The time between beats is 60 divided by the tempo. At 120 BPM that is 0.5 seconds.' }],
  },
  {
    id: 'grid',
    kicker: 'Board two',
    title: 'The pattern grid',
    paras: [
      'A bar can be cut into equal steps, here 16 of them, four for each of four beats. A pattern is a choice of which steps get a hit. Press a step to switch it on or off, then press play.',
      'Try the presets. Four hits on the beat sound steady. Moving hits between the beats makes the pattern feel pushed forward, which musicians call syncopation.',
    ],
  },
  {
    id: 'euclid',
    kicker: 'Board three',
    title: 'Hits spread evenly',
    paras: [
      'Pick how many hits you want and how many steps to spread them over, and the board places the hits as evenly as it can. In 2005 the computer scientist Godfried Toussaint showed that this simple rule, based on a method of Euclid, produces many rhythms that people have played for a long time in different parts of the world.',
      'Try 3 hits in 8 steps, 5 in 8, 7 in 12 and 4 in 9. Some patterns are the same rhythm started on a different step, so your pattern may be a turn of the one with the name.',
    ],
    tags: [{ label: 'Names', text: 'Sources agree that 3 in 8 is the Cuban tresillo. For 5 in 8 they differ: Toussaint calls it the cinquillo and some other sources call it a West African bell pattern.' }],
  },
  {
    id: 'poly',
    kicker: 'Board four',
    title: 'Two beats at once',
    paras: [
      'A polyrhythm plays two different beats at the same time, such as 3 evenly spaced hits against 2. The two lines start together, then drift apart, and meet again only after the whole cycle.',
      'Choose two numbers and press play. The low sound is the first line and the high sound is the second. The ring shows both lines on one circle.',
    ],
    tags: [{ label: 'Hemiola', text: 'Three against two is also called a hemiola. It is often written as three notes over two, or as two bars of three beats felt as three bars of two.' }],
  },
];

export const takeaways = [
  'Tempo is counted in beats per minute. The time between beats is 60 divided by the tempo.',
  'Beats are grouped into bars. The time signature says how many beats are in a bar, and the first beat is usually the strongest.',
  'A pattern is a choice of which equal steps of a bar get a hit. Hits between the beats make syncopation.',
  'Spreading hits as evenly as possible over a number of steps gives the Cuban tresillo (3 in 8) and other traditional rhythms, which Godfried Toussaint pointed out in 2005.',
  'A polyrhythm plays two beats at once, such as 3 against 2. The two lines meet again only after the least common multiple of their steps.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Toussaint’s 2005 paper on Euclidean rhythms and Bjorklund’s earlier use of the method for timing, 3 in 8 as the tresillo (also called the habanera rhythm), 7 in 12 as an Ewe bell pattern from Ghana and 4 in 9 as the Turkish aksak rhythm each appeared in at least two places. Sources disagree on the name of 5 in 8, so the page gives both. Three against two as a hemiola appeared in several music theory sites. The tempo sum, the least common multiple and the evenly spread patterns were checked by calculation. The sounds are made in the browser and are not real drums.';

export const sources = [
  { label: 'Toussaint: the Euclidean algorithm generates traditional musical rhythms (PDF)', url: 'https://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf', for: 'The 2005 paper, with tresillo, cinquillo and aksak.' },
  { label: 'Wikipedia: Euclidean rhythm', url: 'https://en.wikipedia.org/wiki/Euclidean_rhythm', for: 'The idea and the named rhythms.' },
  { label: 'Toussaint: the distance geometry of music (arXiv)', url: 'https://arxiv.org/pdf/0705.4085', for: 'Rhythm patterns as points on a circle.' },
  { label: 'Euclidean rhythms (lecture notes, CNRS)', url: 'https://indico.math.cnrs.fr/event/10656/attachments/4527/6791/Euclidean_Rhythms.pdf', for: 'The maths of spreading hits evenly.' },
  { label: 'Lawton Hall: Euclidean rhythms, maximum evenness', url: 'https://www.lawtonhall.com/blog/euclidean-rhythms-pt1', for: 'Ewe bell pattern in 7 of 12.' },
  { label: 'Splice: what are Euclidean rhythms?', url: 'https://splice.com/blog/?p=6377', for: 'Bjorklund, the accelerator and the music use.' },
  { label: 'Wikipedia: polyrhythm', url: 'https://en.wikipedia.org/wiki/Polyrhythm', for: 'Three against two and other cross rhythms.' },
  { label: 'FaChords: hemiola explained', url: 'https://www.fachords.com/hemiola/', for: 'The hemiola.' },
  { label: 'Musical U: all about polyrhythm (PDF)', url: 'https://www.musical-u.com/wp-content/uploads/2020/01/All-About-Polyrhythm.pdf', for: 'X against Y and the cycle.' },
];
