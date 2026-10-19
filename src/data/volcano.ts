// Everything the "How a volcano erupts" page says, in one place.
// A cone and four things to try: how sticky the magma is, how gas bubbles grow as magma rises, where volcanoes form, and the VEI scale.
// The sliders and the scores are toys. The facts come from the sources, and the page says which is which.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A bottle that has been shaken',
  paras: [
    'Magma is melted rock under the ground. It holds dissolved gas, mostly water vapour and carbon dioxide, a bit like the fizz in a bottle. When the magma rises, the pressure drops and the gas comes out as bubbles. What happens next depends on how sticky the magma is. If the gas can slip out, the lava flows. If it is trapped, the volcano can blow.',
    'Four things to try. Change how sticky the magma is and how much gas it holds. Watch a bubble grow as it rises. See where volcanoes form. And read the size scale for eruptions. The sliders and the scores are toys, and the page says which numbers are facts. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'pot',
    kicker: 'Vent one',
    title: 'Sticky or runny',
    paras: [
      'The more silica magma holds, the stickier it is. Basalt has about 45 to 52 per cent silica, it is hot, and it is fairly runny. Rhyolite has more than about 69 per cent, it is several hundred degrees cooler, and it is very thick. Gas escapes easily from runny magma. In thick magma it gets stuck, and the pressure builds until the magma blows apart.',
      'Slide the silica and the gas. The cone shows what comes out. The stickiness figures are rough, and the score that turns them into an eruption is a toy.',
    ],
  },
  {
    id: 'bubble',
    kicker: 'Vent two',
    title: 'A bubble on its way up',
    paras: [
      'Deep down, the weight of the rock above squeezes the gas into tiny bubbles. As the magma rises there is less rock above it, so the pressure falls and the bubbles swell. If the temperature stays the same, a bubble grows in proportion to how much the pressure drops.',
      'Slide the depth the bubble starts from. The page works out the pressure from the weight of rock, and how many times bigger the bubble would be at the surface. Real bubbles also dissolve, join and cool, so this is only the idea.',
    ],
  },
  {
    id: 'where',
    kicker: 'Vent three',
    title: 'Where volcanoes form',
    paras: [
      'Most volcanoes sit at the edges of the great plates of the Earth’s crust, or over hot spots. Pick a setting to see how magma is made there.',
      'More than half of the world’s active volcanoes above sea level circle the Pacific Ocean, in the Ring of Fire. Some sources give a share of over three quarters, because they count in a different way.',
    ],
  },
  {
    id: 'vei',
    kicker: 'Vent four',
    title: 'The size of an eruption',
    paras: [
      'The Volcanic Explosivity Index, VEI, goes from 0 to 8. Each step is roughly ten times more than the one before. A VEI of 0 is an eruption that is not explosive. The 1980 eruption of Mount St. Helens was a VEI of 5.',
      'Slide the index and see how much more than a VEI of 2 it is. The bars show the true sizes against a VEI of 8. Sources give different values for some old eruptions, such as Tambora and Krakatoa, so the page leaves them out.',
    ],
    tags: [{ label: 'Not a warning system', text: 'This page explains how eruptions work. It does not tell anyone what to do near a volcano. For that, follow the official volcano observatory.' }],
  },
];

export const takeaways = [
  'Magma holds dissolved gas. As it rises the pressure drops and the gas forms bubbles.',
  'The more silica magma holds, the stickier it is. Sticky magma traps gas and tends to erupt explosively. Runny basalt tends to flow.',
  'A bubble grows as the pressure falls, so one that starts 5 kilometres down would be more than a thousand times bigger at the surface.',
  'Volcanoes form where plates meet, where plates pull apart and over hot spots. Hawaii is a chain made by a hot spot.',
  'The VEI scale runs from 0 to 8, and each step is roughly ten times more than the one before.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Silica making magma more viscous, basalt at about 45 to 52 per cent silica and rhyolite at above about 69 per cent and several hundred degrees cooler, gas escaping from runny magma and being trapped in thick magma, volcanoes forming at plate boundaries and over hot spots with Hawaii as the example, water lowering the melting point of the mantle by about 60 to 100 degrees, and the VEI as a scale from 0 to 8 with each step roughly ten times with Mount St. Helens at 5 each appeared in at least two places. Sources disagree on the VEI of Tambora and Krakatoa and on the share of volcanoes in the Ring of Fire (more than half or over three quarters), so the page gives the lower figure and leaves the eruptions out. The sliders for stickiness and temperature, the score that turns stickiness and gas into an eruption style, and the pictures are toys. The pressure from the weight of rock (about 2,500 kilograms for every cubic metre) and the growth of a bubble in proportion to the drop in pressure are plain physics worked out for the page. Nothing here is advice about safety.';

export const sources = [
  { label: 'San Diego State: how volcanoes work', url: 'https://volcanoes.sdsu.edu/Controls.html', for: 'What controls an eruption.' },
  { label: 'USGS: silica in magma', url: 'https://volcanoes.usgs.gov/vsc/glossary/silica.html', for: 'Silica and viscosity.' },
  { label: 'National Park Service: volcanic eruptions', url: 'https://www.nps.gov/subjects/volcanoes/volcanic-eruptions.htm', for: 'Quiet and explosive eruptions.' },
  { label: 'Bridgewater State: volcanoes and viscosity', url: 'https://bridgew.edu/sites/bridgew/files/media/pdf_document/Volcanoes and Viscosity BSU (4-6) (3).pdf', for: 'Viscosity and eruption style.' },
  { label: 'British Geological Survey: how volcanoes form', url: 'https://www.bgs.ac.uk/discovering geology/earth hazards/volcanoes/how volcanoes form-2/', for: 'Plate boundaries and hot spots.' },
  { label: 'Maricopa: where are the volcanoes', url: 'https://open.maricopa.edu/hazards/chapter/5-1-what-is-a-volcano/', for: 'Volcanoes and the plates.' },
  { label: 'USGS: Mount St. Helens compared', url: 'https://pubs.usgs.gov/gip/msh/comparisons.html', for: 'The VEI and the 1980 eruption.' },
  { label: 'San Diego State: variability of eruptions', url: 'https://volcanoes.sdsu.edu/Variability.html', for: 'The size scale of eruptions.' },
];
