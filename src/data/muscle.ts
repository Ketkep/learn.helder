// Everything the "How a muscle pulls" page says, in one place.
// A coach's whiteboard with four boards and four things to try: the length of a sarcomere, one cycle of a head,
// many sarcomeres in a row, and the two switches (the signal and ATP).
// The lengths come from the sources (frog muscle). The drawings are a toy copy, and the page says so.
// Not medical advice: the page explains how a muscle pulls, and says nothing about training, injury or health.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Hand over hand',
  paras: [
    'A muscle pulls by shortening, and it shortens from the inside. Under a microscope a muscle fibre is striped. The stripes are a row of small units called sarcomeres, end to end. Each one holds two kinds of filament. Thick ones are made of myosin and thin ones of actin. When the muscle pulls, the filaments do not shrink. They slide past each other, like hands pulling a rope hand over hand. This is called the sliding filament idea.',
    'Four boards to try. Change the length of one sarcomere and count the heads that can reach. Step through one pull of a single head. Stack thousands of sarcomeres in a row. And flip the two switches that let a muscle pull and let go. The drawings are a toy copy with far fewer heads than a real muscle, and the page says so. Without a script each board shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'length',
    kicker: 'Board one',
    title: 'How long is the sarcomere',
    paras: [
      'A sarcomere runs from one Z disc to the next. Thin filaments are fixed to the Z discs. A thick filament sits in the middle, with little arms called heads along it. A head can only pull on a thin filament it can reach. So how much a sarcomere can pull depends on how much the two kinds of filament overlap.',
      'Slide the length. In frog muscle a thick filament is about 1.6 micrometres long and the thin filaments reach about 1 micrometre from each Z disc. The middle 0.2 micrometres of the thick filament is bare, with no heads. With these lengths the filaments stop overlapping at 3.65 micrometres, and the overlap is complete between about 2.05 and 2.25. A resting sarcomere is about 2.2 micrometres. Below 2.05 the thin filaments meet in the middle and real force falls fast. This toy does not draw that.',
    ],
    tags: [
      { label: 'Check', text: 'A classic measurement of 1966 found the strongest pull on a plateau between about 2.05 and 2.2 micrometres. This toy gives 2.05 to 2.25 because its numbers are rounded. The drawn heads are 14, a made up number.' },
    ],
  },
  {
    id: 'cycle',
    kicker: 'Board two',
    title: 'One pull of one head',
    paras: [
      'One head pulls in four steps. It is cocked and ready. It attaches to the thin filament. It swings, which is the power stroke, and the thin filament slides toward the middle. Then a fresh ATP molecule binds and the head lets go. The ATP is split, which cocks the head again, and the cycle can start over.',
      'Press next to go through the steps. One study of a single myosin molecule found steps of about 11 nanometres, and other studies found between 5 and 20, so the drawing is not to scale. To make a sarcomere of 2.2 micrometres 10 per cent shorter, each half has to give up 110 nanometres, which is about 10 steps of 11 nanometres for one head. Real muscles use huge numbers of heads that take turns.',
    ],
    tags: [
      { label: 'Idea', text: 'The head needs ATP to let go, not only to pull. That is why a muscle with no ATP is stuck, which the fourth board shows.' },
    ],
  },
  {
    id: 'chain',
    kicker: 'Board three',
    title: 'Thousands in a row',
    paras: [
      'One sarcomere is tiny, about 2.2 micrometres long. But they sit end to end in long threads, so the small pulls add up. In one centimetre of such a thread there are about 4,500 sarcomeres. If each one gets 10 per cent shorter, the whole centimetre gets 10 per cent shorter, which is a millimetre.',
      'Slide how much each sarcomere shortens. The page works out the length and the number of sarcomeres. The count is a toy: it treats a whole muscle as one thread with a resting sarcomere length of 2.2 micrometres. Real muscles are made of many threads side by side, and their fibres are not as long as the muscle.',
    ],
  },
  {
    id: 'switch',
    kicker: 'Board four',
    title: 'The signal and ATP',
    paras: [
      'A resting muscle does not pull, even though the heads and ATP are there, because the binding sites on the thin filament are covered. A signal from a nerve causes calcium to be released inside the fibre. The calcium binds to a protein called troponin, which uncovers the sites. The heads can then bind and pull. When the signal stops, the calcium is taken back and the sites close again.',
      'Choose a state. With the signal on and ATP present the muscle pulls. With the signal off it is relaxed. With the signal on but no ATP, the heads grab and cannot let go. After death the cells run out of ATP and calcium leaks in, and the muscles stiffen. This is rigor mortis.',
    ],
    tags: [
      { label: 'Check', text: 'Sources agree that ATP is needed for the head to let go. They describe the steps after death a little differently, so the page keeps to what they share: no ATP, heads stuck.' },
    ],
  },
];

export const takeaways = [
  'A muscle shortens because thick and thin filaments slide past each other. The filaments themselves keep their length.',
  'How much a sarcomere can pull depends on how much the filaments overlap. A resting sarcomere is about 2.2 micrometres, close to where the overlap is complete.',
  'A myosin head pulls in a cycle: attach, swing, let go with a new ATP, cock again. A single step is about 11 nanometres in one study.',
  'Sarcomeres sit end to end, so about 4,500 small pulls in a centimetre add up to a visible movement.',
  'Calcium uncovers the sites and ATP lets the heads go. Without ATP the heads stay stuck, which is why muscles stiffen after death.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The sliding of thin filaments past thick ones with filaments that keep their length, the heads attaching, swinging and letting go with a new ATP, the calcium and troponin switch, a thick filament of 1.6 micrometres and thin filaments of 2.05 micrometres for the pair across a Z disc in frog muscle, a bare zone of 0.15 to 0.2 micrometres, a resting sarcomere of about 2.2 micrometres, the plateau of the strongest pull from about 2.05 to 2.2 micrometres, and ATP being needed for the head to let go (with rigor mortis as the result) each appeared in at least two places. The 3.65 micrometres at which the overlap ends is the sum of 1.6 and 2.05, and was found in one commentary on the length and tension graph, so the page marks it as worked out. Studies of a single myosin molecule give steps of 5 to 20 nanometres, and the page uses 11 as one example and says that the others differ. The count of heads, the toy overlap, the 4,500 sarcomeres in a centimetre (worked out from 2.2 micrometres) and the drawings are made up or computed on the page. Sources describe the sequence after death in different words, and the page keeps only what they share.';

export const sources = [
  { label: 'Keynes and Aidley: Nerve and muscle, the mechanism of contraction', url: 'https://resolve.cambridge.org/core/books/keynes-aidleys-nerve-and-muscle/mechanism-of-contraction-in-skeletal-muscle/8BC7282F7506FD452297005896AFF867', for: 'The sliding of the filaments.' },
  { label: 'Western Oregon University: muscle physiology', url: 'https://people.wou.edu/~lemastm/Teaching/BI334/Unit%2003%20-%20Muscle%20Physiology%20(2).pdf', for: 'The cross-bridge cycle and calcium.' },
  { label: 'Morris: how muscles contract (textbook)', url: 'https://digfir-published.macmillanusa.com/morris2e/morris2e_ch37_6.html', for: 'Filaments keeping their length.' },
  { label: 'University of Bristol: tension and muscle length', url: 'https://www.bristol.ac.uk/phys-pharm-neuro/media/plangton/ugteach/ugindex/m1_index/nm_tension/page2.htm', for: 'A resting sarcomere of about 2.2 micrometres.' },
  { label: 'Monash: the length and tension relationship', url: 'https://ilearn.med.monash.edu/physiology/skeletal-muscle/length-tension', for: 'The overlap and the force.' },
  { label: 'Deranged Physiology: muscle length and tension', url: 'https://derangedphysiology.com/main/cicm-primary-exam/musculoskeletal-system/Chapter-141/relationship-between-muscle-length-and-tension', for: 'The filament lengths from Huxley.' },
  { label: 'Gordon, Huxley and Julian (1966), Journal of Physiology', url: 'https://doi.org/10.1113/jphysiol.1966.sp007909', for: 'The plateau from about 2.05 to 2.2 micrometres.' },
  { label: 'Utah Education Network: the cross-bridge cycle', url: 'https://uen.pressbooks.pub/anatomyphysiology/chapter/the-cross-bridge-cycle/', for: 'ATP and letting go.' },
  { label: 'Wikipedia: rigor mortis', url: 'https://en.wikipedia.org/wiki/Rigor_mortis', for: 'Stiffening when ATP runs out.' },
  { label: 'Finer, Simmons and Spudich (1994), Nature', url: 'https://www.nature.com/articles/368113a0', for: 'A single myosin step of about 11 nanometres.' },
];
