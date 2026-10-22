// Everything the "How the ear hears" page says, in one place.
// A three storey building cut open, drawn as a blueprint, and four things to try: the ear canal as a tube, the lever of the middle ear, the air pipe that makes ears pop, and the cochlea as a keyboard.
// The physics is computed from simple rules. The pressure numbers in the air pipe toy are made up and marked.

export interface Panel {
  id: string;
  level: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A building with a message to deliver',
  paras: [
    'Sound is a pressure wave in air. The ear turns it into signals for the brain, in three steps. The outer ear gathers the wave and sends it down a canal to the eardrum. The middle ear passes the shaking of the eardrum along three tiny bones to a small window. The inner ear is a coiled tube full of fluid, the cochlea, where hair cells turn the shaking into nerve signals.',
    'Think of it as a building of three floors with a back staircase. Four things to try: the ear canal as a tube that sings, the bones as a lever, the air pipe that makes your ears pop, and the cochlea as a keyboard laid along a strip. The physics is simple and the page computes it. The pressure numbers in the air pipe are made up. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'canal',
    level: 'G',
    kicker: 'Ground floor, the outer ear',
    title: 'The tube that sings',
    paras: [
      'The ear canal is a tube closed at one end by the eardrum. A tube like that boosts sound whose wavelength is four times its length, which is a note of about 343 divided by four times the length in metres. For a canal about 3 centimetres long this is near 3,000 hertz. Measurements show a boost there of roughly 10 to 25 decibels, depending on the source.',
      'Slide the length of the canal. The drawing shows the pressure of the wave inside the tube. It is largest at the eardrum and zero at the open end. A real canal is curved and the eardrum is not a hard wall, so this simple tube gives only a rough answer.',
    ],
  },
  {
    id: 'lever',
    level: '1',
    kicker: 'First floor, the middle ear',
    title: 'A lever and a funnel',
    paras: [
      'Behind the eardrum three small bones pass the shaking along: the hammer, the anvil and the stirrup. The last one pushes on the oval window of the cochlea. Fluid is much harder to shake than air, so the middle ear boosts the pressure. The eardrum is much bigger than the oval window, so the same force is squeezed into a smaller area. The bones also act as a lever.',
      'Slide the area ratio and the lever. The lever is usually given as 1.3, and the area ratio as about 14 in one source and 15 in another. Others give larger values, and the total gain is quoted as roughly 18 to 30 times in pressure.',
    ],
  },
  {
    id: 'pipe',
    level: 'S',
    kicker: 'The air pipe',
    title: 'Why ears pop',
    paras: [
      'The middle ear is a small room filled with air. A narrow passage called the Eustachian tube joins it to the back of the throat. It is normally closed. Swallowing, yawning or chewing opens it for a moment and lets the pressure inside match the pressure outside. The pop you hear is the tube opening.',
      'Take a flight. Press climb and the air outside gets thinner, and the eardrum bulges outwards. Press swallow to open the tube. The pressures are percentages of ground level and the numbers are made up for the toy.',
    ],
    tags: [{ label: 'Not advice', text: 'This is a picture of the idea. Ears that stay blocked, or that hurt, are a matter for a doctor.' }],
  },
  {
    id: 'cochlea',
    level: '2',
    kicker: 'Top floor, the inner ear',
    title: 'A keyboard in a snail',
    paras: [
      'The cochlea is coiled like a snail. Along it runs the basilar membrane, narrow and stiff at the base and wide and loose at the tip. High notes make the base shake most and low notes make the tip shake most, so each place answers to its own pitch. The hair cells there turn the shaking into nerve signals. Georg von Békésy won the Nobel Prize in 1961 for showing how the wave travels along the membrane.',
      'Slide the pitch, or pick a note, and the marker shows the place on the unrolled strip. The map is a toy, a smooth curve from 20 hertz at the tip to 20,000 hertz at the base. With the sound on you also hear the note.',
    ],
    tags: [{ label: 'Hair cells', text: 'There are about 3,500 rows of hair cells along the membrane, each with one inner hair cell and three or four outer hair cells. Young adults can already lose the highest notes, above about 15 to 16 kilohertz, and the loss can come with age.' }],
  },
];

export const takeaways = [
  'The ear has three parts: the outer ear gathers sound, the middle ear boosts it with three bones, and the inner ear turns it into nerve signals.',
  'The ear canal is a tube closed at one end. A canal about 3 centimetres long boosts sound near 3,000 hertz.',
  'The middle ear raises the pressure about 18 to 30 times, because the eardrum is larger than the oval window and the bones act as a lever.',
  'The Eustachian tube lets air in and out of the middle ear. Swallowing opens it, and that is the pop.',
  'Each place along the cochlea answers to its own pitch: high notes near the base and low notes near the tip.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The eardrum and the three bones, the lever of 1.3, the area ratio of the eardrum to the oval window (about 14 or 15, with larger values in other sources), the total pressure gain of about 18 to 30 times, the ear canal as a tube closed at one end that resonates at a quarter of a wavelength and near 3,000 hertz, the Eustachian tube opening on swallowing, the basilar membrane that is narrow and stiff at the base and wide and loose at the tip, Békésy’s Nobel Prize in 1961, and the highest notes being lost first each appeared in at least two places. Sources differ on the area ratio, on the gain of the canal (about 10 to 25 decibels) and on the effective length of the canal, and the page says so. The 3,500 rows of hair cells come from one review. The map from place to pitch in the cochlea is a smooth made up curve with its ends at 20 and 20,000 hertz, and the pressure numbers in the air pipe are made up. The speed of sound used is 343 metres a second.';

export const sources = [
  { label: 'Wikipedia: middle ear', url: 'https://en.wikipedia.org/wiki/Middle_ear', for: 'The bones, the lever and the area ratio.' },
  { label: 'UCL: the outer and middle ear', url: 'https://www.phon.ucl.ac.uk/courses/spsci/AUDL4007/12.pdf', for: 'The ear canal as a tube.' },
  { label: 'Popular Science: why ears pop on a plane', url: 'https://www.popsci.com/science/why-do-ears-pop-on-plane/', for: 'The Eustachian tube.' },
  { label: 'University of Minnesota: the mechanics of hearing', url: 'https://open.lib.umn.edu/sensationandperception/chapter/the-inner-ear/', for: 'The cochlea and the basilar membrane.' },
  { label: 'arXiv: the human auditory system', url: 'https://arxiv.org/pdf/2307.00084', for: 'Rows of hair cells.' },
  { label: 'Wikipedia: tonotopy', url: 'https://en.wikipedia.org/wiki/Tonotopy', for: 'High notes at the base, low at the tip.' },
  { label: 'HyperPhysics: von Békésy and the place theory', url: 'https://hyperphysics.gsu.edu/hbase/Sound/bekesy.html', for: 'The travelling wave.' },
  { label: 'Nobel Prize: 1961 award ceremony speech', url: 'https://www.nobelprize.org/prizes/medicine/1961/ceremony-speech/', for: 'Békésy’s prize.' },
  { label: 'Wikipedia: presbycusis', url: 'https://en.wikipedia.org/wiki/Presbycusis', for: 'Loss of the highest notes.' },
];
