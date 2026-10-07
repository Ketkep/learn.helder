// Everything the "How bridges carry a load" page says, in one place.
// The page is a river crossing with four spans. Each span is one idea, drawn on a blueprint.

export interface Span {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Before you cross',
  paras: [
    'Every bridge has the same job: to carry a weight across a gap without falling in. It does that by turning the weight into pushing and pulling inside its parts. Parts that are squeezed are in compression. Parts that are stretched are in tension.',
    'This page has four spans. On each one you load a bridge part and see which bits push and which bits pull. On the drawings, orange is pushing (compression) and light blue is pulling (tension). The numbers are in relative units. They show the idea and are not a design.',
  ],
};

export const spans: Span[] = [
  {
    id: 'beam',
    kicker: 'Span one',
    title: 'A plank bends',
    paras: [
      'The simplest bridge is a plank across a gap. Put a weight on it and it bends. The top of the plank is squeezed and the bottom is stretched, and the bending is biggest right under the weight.',
      'Move the weight and change the depth of the plank. A thicker plank bends far less than a thin one, and it needs less material to do the same job than you would think.',
    ],
    tags: [
      { label: 'Cubed', text: 'The stiffness of a beam goes with the cube of its depth. A beam twice as deep is eight times as stiff. This is why bridge girders are deep and thin, and why a plank is stiffer on its edge.' },
    ],
  },
  {
    id: 'arch',
    kicker: 'Span two',
    title: 'Arch and cable',
    paras: [
      'An arch carries a weight by squeezing. A cable carries a weight by pulling. Both are the same curve, upside down. The feet of an arch push outwards on the ground. The towers of a cable bridge are pulled inwards.',
      'The sideways force depends on how high the arch is, or how far the cable sags. A flat curve pushes or pulls far harder than a tall one. Switch between arch and cable and slide the height.',
    ],
    tags: [
      { label: 'Hang it, then flip it', text: 'In 1675 Robert Hooke saw that a hanging chain, turned upside down, gives the right shape for an arch.' },
      { label: 'How long', text: 'The main span of the Golden Gate Bridge, which opened in 1937, is 1,280 m. The main span of the Akashi Kaikyo Bridge in Japan, which was finished in 1998, is 1,991 m. Both hang from cables.' },
    ],
  },
  {
    id: 'frame',
    kicker: 'Span three',
    title: 'Triangles hold their shape',
    paras: [
      'A frame of four bars with loose corners is not a safe shape. Push the top sideways and it folds into a leaning slab. A triangle cannot do that: its corners cannot move unless a side gets longer or shorter.',
      'Push the frame, then add a diagonal bar and push it again. The diagonal turns one wobbly square into two triangles, and it takes the push as tension.',
    ],
    tags: [
      { label: 'Look for triangles', text: 'Cranes, roof frames, pylons and the iron bridges of old railways are built from triangles for this reason.' },
    ],
  },
  {
    id: 'truss',
    kicker: 'Span four',
    title: 'A truss pushes and pulls',
    paras: [
      'A truss is a chain of triangles. The simplest one has two sloping rafters and a bar across the bottom, called the tie. Hang a weight from the top. The rafters are squeezed and the tie is stretched.',
      'Change the height of the triangle and the weight. A flat triangle needs far stronger bars than a tall one. Then take the tie away, and watch the rafters spread apart.',
    ],
  },
];

export const takeaways = [
  'A bridge turns a weight into pushing (compression) and pulling (tension) inside its parts.',
  'A loaded beam bends: the top is squeezed and the bottom is stretched. A beam twice as deep is eight times as stiff.',
  'An arch squeezes and a cable pulls. They are the same curve upside down, and a flat curve means a bigger sideways force.',
  'A triangle cannot change shape without changing the length of a side, so triangles keep frames from folding.',
  'In a simple truss the rafters are squeezed and the tie is stretched. The flatter the triangle, the bigger the forces.',
  'The tools use relative units and a few simple formulas. They are not a design for anything real.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The depth cubed rule, the formula for the sideways force in an arch or a cable (the load times the span, divided by eight times the rise), and the rule that a triangle is the only rigid shape each appeared in at least two places. The beam sag formula is the standard one for a weight on a beam on two supports, scaled so that the middle of the beam gives 1. The truss forces come from resolving the weight along the rafters and the tie. The bridge lengths are from lists of bridge spans. All the numbers on the tools are relative and show the idea. This page is not engineering advice and should not be used to design or judge a structure.';

export const sources = [
  { label: 'University of Manchester: span and deflection', url: 'https://www.sites.se.manchester.ac.uk/structural-concepts/?p=996', for: 'Deflection of a beam and why depth matters.' },
  { label: 'Studio Matrx: bending moments, deflection and stiffness', url: 'https://www.studiomatrx.org/students/structural-systems-for-architects/bending-moments-deflection-and-stiffness', for: 'Twice as deep is eight times as stiff.' },
  { label: 'Najah University: cables (PDF)', url: 'https://staff-old.najah.edu/sites/default/files/Cables.pdf', for: 'The tension in a cable with a load spread along the span.' },
  { label: 'PrincetonX: suspension bridges (PDF)', url: 'https://courses.edx.org/assets/courseware/v1/dd1b6cecfa6e90acabb9338c13b8a608/asset-v1:PrincetonX+CEE262.1x+1T2019+type@asset+block/Br-Suspension2_v31Jan19__1_.pdf', for: 'The shape of a suspension cable and the forces in it.' },
  { label: 'Wikipedia: catenary', url: 'https://en.wikipedia.org/wiki/Catenary', for: 'Hooke and the hanging chain turned into an arch.' },
  { label: 'Engineerfix: how diagonal bracing stabilizes a structure', url: 'https://engineerfix.com/how-diagonal-bracing-stabilizes-a-structure/', for: 'Why a frame folds and a braced frame does not.' },
  { label: 'Studio Matrx: trusses and space frames', url: 'https://www.studiomatrx.org/students/structural-systems-for-architects/trusses-and-space-frames', for: 'A truss as a chain of triangles, with pushing and pulling members.' },
  { label: 'Golden Gate Bridge: educational resources', url: 'https://www.goldengate.org/bridge/history-research/educational-resources/school-projects/', for: 'The Golden Gate Bridge and its main span.' },
  { label: 'Wikipedia: Akashi Kaikyo Bridge', url: 'https://en.wikipedia.org/wiki/Akashi_Kaikyo_Bridge', for: 'The main span of 1,991 m and the year 1998.' },
  { label: 'Wikipedia: list of longest suspension bridge spans', url: 'https://en.wikipedia.org/wiki/List_of_longest_suspension_bridge_spans', for: 'Main spans of suspension bridges.' },
];
