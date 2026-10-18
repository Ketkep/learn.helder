// Everything the "How Roman aqueducts worked" page says, in one place.
// A hillside profile with four things to try: the gentle slope, the siphon, choosing a crossing, and how much was on arches.
// The numbers come from the sources. The pressure sums are plain physics.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Water that only goes downhill',
  paras: [
    'The Romans had no pumps for their long water lines. Water ran by gravity, from a spring in the hills to a town, in a channel that sloped down the whole way. That one rule shaped every aqueduct: the line must never go up.',
    'Four things to try. Set the slope of a channel and see how far it falls. See the pressure in a siphon that takes water down a valley and up the other side. Choose how to cross four kinds of land. And guess how much of Rome’s water line was on arches. The numbers come from the sources, and the sums are plain physics. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'slope',
    kicker: 'Hill one',
    title: 'A very gentle slope',
    paras: [
      'The aqueduct that supplied Nîmes in France was about 50 kilometres long and fell about 17 metres in all. That is 34 centimetres in every kilometre, a slope of about 1 in 3,000. The water moved slowly but surely.',
      'Slide the slope and the length. The fall is the slope times the length. The picture draws the fall much bigger than life, so that you can see it.',
    ],
  },
  {
    id: 'siphon',
    kicker: 'Hill two',
    title: 'Down a valley and up again',
    paras: [
      'When a valley was too deep for a bridge, engineers sent the water down into the valley in sealed pipes and up the other side. Water finds its own level, so it climbs back almost to the height where it started. The far tank has to sit a little lower than the first, to pay for the head lost on the way.',
      'Slide the depth of the valley. The pressure at the bottom is the weight of the water above it, about 0.1 bar for each metre of depth. The pipes were made of lead, which is why a siphon cost so much.',
    ],
  },
  {
    id: 'choose',
    kicker: 'Hill three',
    title: 'How would you cross it?',
    paras: [
      'Engineers had four tools. They could follow the slope of the land, bury the channel or cut it into a hillside, tunnel through a ridge, carry the channel across a valley on arches, or send it through a siphon.',
      'Read each piece of land and pick the tool. You get the reason, whichever you pick.',
    ],
  },
  {
    id: 'share',
    kicker: 'Hill four',
    title: 'Mostly hidden',
    paras: [
      'The great arches are what we remember. But most of a water line was out of sight. The aqueducts of Rome came to about 500 kilometres in all, and only about 48 kilometres of that stood on arches. Most of the rest ran underground.',
      'Slide to your guess for the share on arches, then check.',
    ],
    tags: [{ label: 'Approximate', text: 'Sources give different totals for Rome’s aqueducts, and the lengths of the parts do not add up exactly. The page uses about 500 km in all, about 430 km underground and about 48 km on arches.' }],
  },
];

export const takeaways = [
  'Roman aqueducts ran by gravity, in a channel that sloped down the whole way, with no pumps.',
  'The Nîmes aqueduct fell about 17 metres over about 50 kilometres, which is 34 centimetres in every kilometre.',
  'A siphon takes water down into a valley in sealed pipes and up the other side. The pressure at the bottom is about 0.1 bar for each metre of depth.',
  'Engineers followed the slope of the land where they could, tunnelled through ridges, and used arches or siphons to cross valleys.',
  'Most of Rome’s water line, about 430 of about 500 kilometres, ran underground. Only about one tenth stood on arches.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The Nîmes aqueduct falling about 17 metres over about 50 kilometres at 34 centimetres a kilometre, the siphons of the Gier aqueduct with lead pipes between two tanks, siphons being cheaper than tall arcades but needing costly lead or bronze pipe, engineers following the slope and burying the channel, arches mainly crossing valleys, and Rome’s lines of about 500 kilometres with about 430 kilometres underground and about 48 kilometres on arches each appeared in at least two places. Sources differ on the daily flow of the Nîmes aqueduct and on the dates of the Pont du Gard and the Gier aqueduct, so the page gives neither. One source gave the fall of the Pont du Gard itself differently from its own slope figure, so the page leaves it out. Water pressure of 0.0981 bar for each metre of depth is plain physics and was worked out for the page. The sums are exact for the toy values and the pictures are not to scale.';

export const sources = [
  { label: 'Archaeology Travel: the Nîmes aqueduct', url: 'https://archaeology-travel.com/france/nimes-aqueduct/', for: 'The length and the fall of the line.' },
  { label: 'World History Encyclopedia: Pont du Gard', url: 'https://www.worldhistory.org/image/125/the-roman-aqueduct-of-pont-du-gard', for: 'The gradient and the bridge.' },
  { label: 'Wikipedia: Aqueduct of the Gier', url: 'https://en.wikipedia.org/wiki/Aqueduct_of_the_Gier', for: 'The siphons and the lead pipes.' },
  { label: 'MDPI Water: Roman pressure conduits', url: 'https://mdpi-res.com/d_attachment/water/water-14-00028/article_deploy/water-14-00028.pdf', for: 'Pipes under pressure.' },
  { label: 'Roman Aqueducts: the Gier', url: 'https://www.romaq.org/the-project/aqueducts/156', for: 'The tanks and the siphon design.' },
  { label: 'NCBI: the aqueducts and water supply of ancient Rome', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7004096/', for: 'The lines of Rome and their length.' },
  { label: 'Frontinus on the water supply of Rome', url: 'https://waters.iath.virginia.edu/front.html', for: 'The old account of the aqueducts.' },
  { label: 'History Crunch: Roman aqueducts', url: 'https://historycrunch.com/roman-aqueducts/', for: 'Following the land and using arches.' },
];
