// Everything the "How a music box plays" page says, in one place.
// A music box opened up, with three compartments and three things to try: the tuned teeth, the pins on the cylinder,
// and what changes a pitch. The history comes from the sources. The maths is computed on the page.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A comb that is plucked in order',
  paras: [
    'A music box plays a tune with a steel comb. Each tooth of the comb is a springy bar fixed at one end, and each one rings at its own pitch. A turning cylinder covered in small pins plucks the teeth, one after another, in the order of the tune. A spring drives the cylinder, and a small governor keeps it turning at an even speed so the tune does not rush.',
    'Three compartments to try. Hear how the length of a tooth sets its pitch. Place the pins on a cylinder and play your own tune. And find out what happens to a note when a maker files or loads a tooth. The page makes sound in your browser, and you can turn it off. Nothing plays by itself. Without a script each compartment shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'teeth',
    kicker: 'First compartment',
    title: 'The tuned teeth',
    paras: [
      'A tooth is a bar fixed at one end and free at the other. Pluck it and it swings back and forth at a pitch set by its shape. For bars of the same thickness, the pitch falls with the square of the length. So to go down an octave, which halves the pitch, the tooth has to be about 1.41 times as long. The low notes of a comb are the long teeth and the high notes the short ones.',
      'Press a tooth to hear it. The lengths are worked out from the notes of a C major scale, with A at 440 hertz. Then try the sliders: change the length and the thickness of one tooth and see how far the pitch moves.',
    ],
    tags: [
      { label: 'Check', text: 'Sources agree that longer teeth sound lower and thicker teeth sound higher. The rule that the pitch goes as thickness over length squared comes from the formula for a springy bar fixed at one end, and the page works the sums out from it. Real teeth are also tuned by ear.' },
    ],
  },
  {
    id: 'pins',
    kicker: 'Second compartment',
    title: 'The pinned cylinder',
    paras: [
      'The cylinder is the memory of the music box. Each pin is one note at one moment. A pin high on the cylinder meets a long tooth and a pin low on it meets a short one. As the cylinder turns, the pins pass the comb in order and pluck the teeth. A tune that fits on one turn plays and then starts again.',
      'The drawing shows the cylinder rolled flat: a row for each note, and a column for each moment. Click a spot to place or remove a pin. Press play to turn the cylinder. The preset tune is Twinkle, twinkle, little star. The speed slider stands in for the governor.',
    ],
    tags: [
      { label: 'History', text: 'Most sources credit Antoine Favre, a watchmaker in Geneva, with a musical mechanism of 1796 that used a tuned steel comb in place of bells. Early teeth were fixed one at a time, then in pairs, before a whole comb was cut from one piece of steel. Sources give different dates for Favre’s life.' },
    ],
  },
  {
    id: 'tuning',
    kicker: 'Third compartment',
    title: 'What changes a pitch',
    paras: [
      'A maker has to tune every tooth. A comb is cut roughly, and the last step is by ear and file. Metal is taken off, or a little is added, until the tooth rings at the right pitch. Adding weight to the free end lowers a note, and so does thinning the tooth near the fixed end. Thickness does the opposite of length.',
      'Pick a change to a tooth. The page says whether the note goes up or down, and why. The speed of the cylinder changes how fast the tune plays, but not the pitch of any note, because each note belongs to its tooth.',
    ],
    tags: [
      { label: 'Check', text: 'The advice on filing and weights comes from people who restore and tune music boxes, and they do not all agree on the details. The page keeps to the changes they share.' },
    ],
  },
];

export const takeaways = [
  'A music box plays a tune by plucking the teeth of a steel comb with pins on a turning cylinder.',
  'A tooth is a springy bar. Its pitch rises with its thickness and falls with the square of its length.',
  'To lower a note by an octave a tooth has to be about 1.41 times as long, if it is just as thick.',
  'The pins on the cylinder are the memory of the tune: a row for each note and a column for each moment.',
  'A spring drives the cylinder and a governor keeps its speed even. Teeth are tuned by taking metal off or adding a little weight.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. A tuned steel comb plucked by pins on a rotating cylinder, longer teeth giving lower notes and thicker teeth higher notes, Antoine Favre of Geneva and the year 1796, early teeth fixed separately then in pairs before a comb cut from one piece, tuning by taking metal off or adding a little at the tip, and the spring and governor that keep the cylinder at an even speed each appeared in at least two places. Sources differ on the dates of Favre’s life, on the details of tuning, and on how many teeth a comb has (a typical box has about 96, one made by Symphonion 118), so the page does not give a tooth count. The rule that pitch goes as thickness over length squared comes from the formula for a bar fixed at one end and is worked out on the page. Real teeth are not simple bars. The notes are the equal tempered ones with A at 440 hertz, and the cylinder, its grid and its tune are made up for the page. The sums are computed on the page.';

export const sources = [
  { label: 'Wikipedia: music box', url: 'https://en.wikipedia.org/wiki/Music_box', for: 'The comb, the cylinder and Favre.' },
  { label: 'Museum Speelklok: musical boxes', url: 'https://www.museumspeelklok.nl/en/musical-boxes/', for: 'How a musical box works.' },
  { label: 'Technik Museum Speyer: music boxes and musical movements', url: 'https://speyer.technik-museum.de/en/music-boxes', for: 'The movement and the comb.' },
  { label: 'Musical Box Society of Great Britain: mechanical music', url: 'https://www.mbsgb.org.uk/?p=35', for: 'The parts of a cylinder box.' },
  { label: 'Music Box Attic: the history of the music box', url: 'https://musicboxattic.com/blog/the-history-of-the-music-box', for: 'From bells to combs.' },
  { label: 'Learn Antiques: the music box', url: 'https://learnantiques.com.au/miniature-music-players-the-music-box/', for: 'Teeth and pitch.' },
  { label: 'Mechanical Music Digest: tuning a tooth', url: 'https://www.mmdigest.com/Archives/Digests/200903/2009.03.14.03.html', for: 'Adding and removing metal.' },
  { label: 'Mechanical Music Digest: the governor', url: 'https://mmdigest.com/Archives/Digests/200203/2002.03.27.01.html', for: 'The governor and the worm gear.' },
  { label: 'US patent 9622562: musical comb', url: 'https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9622562', for: 'Frequency, length and stiffness.' },
  { label: 'Kai’s Tale: the sound of a music box', url: 'https://blog.kaistale.com/?p=1568', for: 'The formula for a bar fixed at one end.' },
  { label: 'SolidWorks: frequency analysis of a cantilever beam', url: 'https://help.solidworks.com/2025/English/simconntutorial/Dynamic_Analysis_of_a_Cantilever_Beam.htm', for: 'The frequency of a bar fixed at one end.' },
];
