// Everything the "How a kaleidoscope makes patterns" page says, in one place.
// A tube with three eyepieces and three things to try: drawing in one wedge and seeing it repeated, counting the images,
// and following one bead and all its images. The history and the mirror rule come from the sources.
// The beads are drawn from fixed seeds, and the picture is a drawing.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A few beads and two mirrors',
  paras: [
    'A kaleidoscope is a tube with two long mirrors set at an angle, and at the end a small cell of loose coloured beads or bits of glass. You look in through the other end. The beads are reflected again and again in the mirrors, and a handful of bits becomes a round pattern with the same shape repeated around the middle. Turn the tube and the beads tumble and the pattern changes.',
    'Three eyepieces to try. Drop beads into one wedge and see the whole pattern. Count the images and find which mirror angles work. And follow one bead and every image of it. The pictures are drawings with beads drawn from fixed seeds, so they look the same each time. Without a script each eyepiece shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'draw',
    kicker: 'First eyepiece',
    title: 'One wedge, a whole pattern',
    paras: [
      'The two mirrors enclose a wedge. What lies in the wedge is the real thing. Everything else you see is a reflection of it, turned around the middle or flipped over, so each wedge is the mirror image of its neighbours. The pattern is the wedge, repeated all the way round.',
      'Pick the angle between the mirrors. Click in the wedge to drop a bead, or press the buttons to add beads, shake in a new set or clear them. The round view fills in at once. A smaller angle gives more wedges.',
    ],
    tags: [
      { label: 'History', text: 'Sir David Brewster, a Scottish scientist, devised the kaleidoscope around 1816 and patented it in 1817. An estimated 200,000 were sold in London and Paris in three months. The patent was flawed and brought him little money. He took the name from Greek words for beautiful, form and to look.' },
    ],
  },
  {
    id: 'count',
    kicker: 'Second eyepiece',
    title: 'Counting the images',
    paras: [
      'Two mirrors at the angle 60 degrees give six copies of an object. At 90 degrees they give four. In general, for an angle that divides 360 evenly, the number of copies is 360 divided by the angle. One of those is the object itself, so the number of images in the mirrors is one fewer.',
      'The table gives the angles that close up neatly, with an even number of wedges. For an angle that does not divide 360, the sources do not agree on the number of images, so the page leaves those out. The pattern with n wedges has n over 2 mirror lines through the middle.',
    ],
    tags: [
      { label: 'Check', text: 'Sources give 4 images at 90 degrees, 5 at 60 and 7 at 45 for the rule 360 over the angle minus one. The page counts the object as well, so it says 4, 6 and 8 copies. For angles that do not divide 360 the sources disagree.' },
    ],
  },
  {
    id: 'follow',
    kicker: 'Third eyepiece',
    title: 'One bead and its images',
    paras: [
      'Follow a single bead. It is in the real wedge, marked o. Its images are numbered around the circle. The images alternate: one is turned, the next is flipped and turned. As the bead moves toward one mirror, its image on the other side of that mirror moves toward it, and the two meet at the mirror.',
      'Slide the bead across the wedge and pick an angle. When the bead touches a mirror, it and its image become one. That is why the pattern has no gaps along the mirror lines.',
    ],
  },
];

export const takeaways = [
  'A kaleidoscope has two mirrors at an angle and a cell of loose beads. The beads are reflected many times.',
  'For a mirror angle that divides 360 evenly, an object has 360 over the angle copies, including itself.',
  'Each wedge is the mirror image of its neighbours, so the pattern is one wedge repeated all round.',
  'At 60 degrees there are six copies, and at 90 four. A smaller angle gives more wedges.',
  'David Brewster devised the kaleidoscope around 1816 and patented it in 1817.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Brewster devising the kaleidoscope around 1816 and patenting it in 1817 (on 10 July by one source), the flaw in the patent and his small gain, an estimate of 200,000 sold in London and Paris in three months, the name from the Greek words for beautiful, form and to look, mirrors at 60 degrees giving a six fold pattern and at 90 degrees a four fold one, the rule of 360 over the angle minus one for the images, and the cell of loose coloured beads each appeared in at least two places. The rule for the images was checked against the examples in the sources (5 at 60 degrees, 3 at 90, 7 at 45). Sources do not agree on what happens when the angle does not divide 360, and one table had an entry that breaks its own rule, so the page does not give those cases. The count of mirror lines (n over 2 for n wedges) is worked out on the page from the drawing. The beads are drawn from fixed seeds and the pictures are drawings, not photographs.';

export const sources = [
  { label: 'Wikipedia: kaleidoscope', url: 'https://en.wikipedia.org/wiki/Kaleidoscope', for: 'The history, the name and the beads.' },
  { label: 'Brewster Society: Sir David Brewster', url: 'https://brewstersociety.com/kaleidoscope-university/sir-david-brewster', for: 'The inventor.' },
  { label: 'Encyclopedia.com: kaleidoscope', url: 'https://www.encyclopedia.com/science-and-technology/technology/technology-terms-and-concepts/kaleidoscope', for: 'The invention and the patent.' },
  { label: 'Britannica: kaleidoscope', url: 'https://www.britannica.com/EBchecked/topic/310099', for: 'How a kaleidoscope works.' },
  { label: 'Whipple Museum: kaleidoscope', url: 'https://collections.whipplemuseum.cam.ac.uk/objects/11119', for: 'An early kaleidoscope.' },
  { label: 'Utah State University: kaleidoscope history and background', url: 'https://5010.mathed.usu.edu/Fall2020/SCarlisle/history.html', for: 'Mirrors and the number of images.' },
  { label: 'Physics World: meet the kaleidoholics', url: 'https://physicsworld.com/a/meet-the-kaleidoholics/', for: 'Kaleidoscopes and their makers.' },
  { label: 'Wonderopolis: what is a kaleidoscope', url: 'https://wonderopolis.org/wonder/What-Is-a-Kaleidoscope', for: 'The parts of a kaleidoscope.' },
  { label: 'Vedantu: number of images formed by two plane mirrors', url: 'https://vedantu.com/iit-jee/number-of-images-formed-by-two-plane-mirrors', for: 'The rule for the images.' },
  { label: 'Aakash: kaleidoscope', url: 'https://www.aakash.ac.in/important-concepts/physics/kaleidoscope', for: 'Images at different angles.' },
];
