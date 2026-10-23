// Everything the "How a river shapes the land" page says, in one place.
// A river drawn down the page from the spring to the sea, with four stops: the long profile, grains and speed, a bend, and a delta.
// The shapes follow the sources. The made up river, the curves for grains and the delta drawings are toys, and the page says so.

export interface Panel {
  id: string;
  stop: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'From the spring to the sea',
  paras: [
    'A river is water on its way down. On the way it picks up soil and stones, carries them, and drops them somewhere else. Over thousands of years this carves valleys, builds plains and pushes the coast out into the sea. The same few ideas explain what a river does from its first trickle to its mouth.',
    'Follow one river down the page, with four stops. See how steeply the river falls along its way. See which grains the water can lift, carry or drop. Make a river bend and measure how crooked it is. And see what builds a delta. The river and the curves are toys that show the idea, and the page says so. Without a script each stop shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'profile',
    stop: 'The spring',
    kicker: 'Stop one, the source',
    title: 'Steep at the start, flat at the end',
    paras: [
      'If you plot the height of a river against the distance from its source, you get a curve that dips steeply at first and flattens out towards the sea. Geographers call it the long profile. In the steep upper course the river cuts down. In the middle course it cuts sideways and begins to meander. In the lower course the slope is very gentle and deposition is the main thing.',
      'Slide along a made up river, 500 kilometres long and starting at 1,000 metres above the sea. The page shows the height, the slope and what the river is mostly doing there. The curve is a smooth made up one with the shape the sources describe.',
    ],
  },
  {
    id: 'grains',
    stop: 'The stream',
    kicker: 'Stop two, the bed',
    title: 'What the water can lift',
    paras: [
      'Fast water picks up grains from the bed. Slower water cannot lift them, but can keep moving grains it already carries. Slower still, and the grains settle. Sand is the easiest to lift. You might expect fine clay to be easier, but its flat grains stick together and need a faster flow to pull apart. Once clay is in the water it stays up for a long time, because it settles very slowly. A graph of this is called a Hjulström curve.',
      'Slide the size of the grain and the speed of the water. The page names the grain and says whether the river lifts it, carries it or drops it. The curves are made up, with the shape of the real ones.',
    ],
  },
  {
    id: 'bend',
    stop: 'The plain',
    kicker: 'Stop three, the bend',
    title: 'A river that bends',
    paras: [
      'On a bend the water moves fastest on the outside. It wears away the outer bank, and slows on the inside, where it drops sand and builds a bank called a point bar. So the bend moves sideways and the river gets more crooked. How crooked is measured by the sinuosity, the length of the channel divided by the length of the valley. A straight river has a sinuosity of 1.',
      'Slide the size of the bends. The page measures the sinuosity of the drawn river and names the class. One common scheme calls a river meandering from 1.5 up. The limits differ between sources. The marks show the outer banks, where the river eats the land.',
    ],
    tags: [{ label: 'Oxbow lakes', text: 'When a bend gets so tight that the river breaks through the narrow neck, the old loop is cut off and becomes a curved lake. This is general knowledge and the sources the page lists do not give figures for it.' }],
  },
  {
    id: 'delta',
    stop: 'The sea',
    kicker: 'Stop four, the mouth',
    title: 'What builds a delta',
    paras: [
      'At the sea the river slows and drops the last of its load, and a delta grows. Its shape depends on a contest between three forces: the river pushing mud out, waves pushing it back and tides stretching it along the coast. In a classic scheme from 1975 a delta is called river dominated, wave dominated or tide dominated. The groups are broad and the sources do not agree on every river.',
      'Turn the three forces up and down. The biggest one decides the drawn shape. These are simple drawings, not maps.',
    ],
  },
];

export const takeaways = [
  'A river’s long profile is steep near the source and nearly flat near the sea. It cuts down in the upper course and drops its load in the lower course.',
  'Fast water lifts grains, slower water only carries them, and still slower water drops them. Sand is the easiest to lift, because clay grains stick together.',
  'On a bend the outside bank is eaten and the inside gains a point bar. Sinuosity is channel length over valley length, and from about 1.5 a river is called meandering.',
  'A delta’s shape comes from river, waves and tides. The Mississippi is the usual bird’s foot example.',
  'The river and the curves on the page are toys, with the shapes the sources describe.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The long profile that is concave, steep in the upper course and gentle in the lower, erosion in the upper course and deposition in the lower, sand being the easiest grain to lift and clay needing more speed because the grains stick together, settling velocity falling with grain size, faster water and erosion on the outside of a bend with deposition on the inside, sinuosity as channel length over valley length with 1.5 and above called meandering, and the three delta groups of river, wave and tide with the Mississippi as the bird’s foot example each appeared in at least two places. Sources differ on the sand size that erodes at the lowest speed (about 0.1 to 0.5 millimetres), on the class limits of sinuosity, and on the labels of deltas such as the Nile and the Mississippi, which the page says. The oxbow lake paragraph is general knowledge and is marked as such. The river of 500 kilometres, its heights, the curves for lifting and settling and the drawings of the deltas are made up.';

export const sources = [
  { label: 'Wikipedia: Hjulström curve', url: 'https://en.wikipedia.org/wiki/Hjulstr%C3%B6m_curve', for: 'Erosion, transport and deposition by grain size and speed.' },
  { label: 'Open Education Alberta: stream erosion and deposition', url: 'https://pressbooks.openeducationalberta.ca/practicalgeology/chapter/8-1-stream-erosion-and-deposition/', for: 'Sand as the easiest grain to lift.' },
  { label: 'Internet Geography: the long profile', url: 'https://www.internetgeography.net/cambridge-igcse-geography/cambridge-igcse-the-natural-environment/river-landforms-the-long-profile-and-shape-in-cross-section/', for: 'Upper, middle and lower course.' },
  { label: 'Wikipedia: meander', url: 'https://en.wikipedia.org/wiki/Meander', for: 'Outer bank erosion, point bars and cut offs.' },
  { label: 'MIT OpenCourseWare: flow around bends', url: 'https://ocw.mit.edu/courses/12-163-surface-processes-and-landscape-evolution-fall-2004/3aa6d00113cc4b115d0c97630585e198_3_flow_around_bends.pdf', for: 'Why the flow is fastest on the outside.' },
  { label: 'Ohio University: alluvial landforms', url: 'https://people.ohio.edu/dyer/TPE/tpe_3e/fluvial_systems/alluvial_landforms_page_2.html', for: 'Meanders and point bars.' },
  { label: 'Penn State: number of channels and sinuosity', url: 'https://courses.ems.psu.edu/earth111/book/export/html/871', for: 'Sinuosity as channel length over valley length.' },
  { label: 'LibreTexts: classification of deltas', url: 'https://geo.libretexts.org/Bookshelves/Oceanography/Coastal_Dynamics_(Bosboom_and_Stive)/02%3A_Large-scale_geographical_variation_of_coasts/2.07%3A_Process-based_classification/2.7.3%3A_Classification_of_deltas', for: 'River, wave and tide dominated deltas.' },
  { label: 'arXiv: modelling river delta formation', url: 'https://arxiv.org/pdf/0711.3283', for: 'Delta shapes from river, wave and tide.' },
];
