// Everything the "Why ice floats" page says, in one place.
// A frozen lake in cross-section with three things to try: how much of a floating thing is under water, how a lake cools and why it
// freezes from the top, and how much room water needs when it freezes. The densities and the idea of the 4 degree maximum come from the
// sources. The lake temperatures are typical values, not measurements of one lake, and the bottle is a toy.

export interface Layer {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'The solid that is lighter than its liquid',
  paras: [
    'Almost every substance is heavier as a solid than as a liquid, so the solid sinks in its own liquid. Water is odd. Ice is lighter than water, so ice floats. If it did not, lakes would freeze from the bottom up. This one fact shapes life in cold places.',
    'Three layers of a frozen lake. In the first, see how much of a floating thing is under water. In the second, follow a lake through the seasons and see why it freezes from the top. In the third, see how much room water needs when it turns to ice. The densities come from the sources. The lake temperatures are typical values for a lake, not measurements. Without a script each layer shows one picture or table.',
  ],
};

export const layers: Layer[] = [
  {
    id: 'float',
    kicker: 'First layer',
    title: 'Why things float, and how deep',
    paras: [
      'A thing floats if it is lighter than the same volume of water. It sinks into the water until the water it pushes aside weighs as much as it does. So the share of a floating thing that is under the surface is its density divided by the density of the water.',
      'Ice has a density of about 917 kilograms in every cubic metre. Fresh water has about 1000 and sea water about 1025. So an ice block floats with about 92 per cent of it under fresh water, and about 90 per cent under sea water. That is why only a tenth of an iceberg shows. Slide the density of the block and pick the water. Above the density of the water it sinks.',
    ],
    tags: [
      { label: 'Icebergs', text: 'Sea water at 1025 and ice at 917 give about 89.5 per cent of an iceberg under water. Real icebergs vary, because of air trapped inside and the salt and temperature of the water, so about 90 per cent is the usual figure.' },
    ],
  },
  {
    id: 'lake',
    kicker: 'Second layer',
    title: 'A lake from summer to ice',
    paras: [
      'Fresh water is heaviest at about 4 degrees Celsius. Warmer than that, it gets lighter. Colder than that, down to freezing, it also gets lighter, as the molecules start to line up in the open pattern of ice. This is another oddity of water.',
      'Slide through the four stages. In autumn the surface cools and sinks until the whole lake is near 4 degrees. Then the top cools below 4 degrees and, being lighter, stays on top, until it freezes. The ice forms a floating lid, and the water at the bottom stays near 4 degrees, which lets fish and other life survive the winter. The temperatures on the page are typical values and not the measurements of one lake.',
    ],
  },
  {
    id: 'bottle',
    kicker: 'Third layer',
    title: 'Water takes more room as ice',
    paras: [
      'Ice is about 9 per cent less dense than water, so a given mass of water takes about 9 per cent more room when it freezes. A thousand millilitres of water make about a thousand and ninety millilitres of ice. The open hexagonal pattern of the molecules in ice holds them further apart than in liquid water.',
      'Slide how full the bottle is. The page shows the water, and how much room the same water would need as ice. Above about 92 per cent full, the ice has no room. This is a toy bottle that stands for any closed container. It is the reason that frozen water can crack things, and the page makes no claim about a particular container.',
    ],
  },
];

export const takeaways = [
  'A thing floats with a share of its volume under water equal to its density divided by the water’s density.',
  'Ice is about 917 kilograms per cubic metre. Fresh water is about 1000 and sea water about 1025, so about 90 per cent of an iceberg is under water.',
  'Fresh water is heaviest at about 4 degrees Celsius. A lake cools from the top, and ice forms a floating lid.',
  'Under the ice, the water at the bottom stays near 4 degrees, so life can survive the winter.',
  'Water takes about 9 per cent more room as ice.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. That ice is about 917 kilograms per cubic metre and liquid water about 1000, and that ice is about 9 per cent less dense than water because of an open hexagonal arrangement held by hydrogen bonds, appeared in several places. A density of sea water of 1025 and about 89.5 per cent of an iceberg under water appeared in more than one place, and sources say real icebergs vary, so the page says about 90. That fresh water is heaviest at 4 degrees and that lakes under ice are layered with the coldest water at the top and about 4 degrees at the bottom appeared in several places. A table of the density of water at several temperatures was searched for and not found, so the page gives none, and the temperatures of the lake stages are typical values, not measurements. The search did not return a USGS page. The volume of ice from water, 1000 over 917, is computed on the page. The bottle is a toy. Nothing here is advice.';

export const sources = [
  { label: 'Britannica: ice', url: 'https://www.britannica.com/science/ice', for: 'The density and the structure of ice.' },
  { label: 'Britannica: why does ice float on water', url: 'https://www.britannica.com/science/Why-Does-Ice-Float-on-Water', for: 'Hydrogen bonds and the open lattice.' },
  { label: 'Wikipedia: ice', url: 'https://en.wikipedia.org/wiki/Ice', for: 'The densities of ice and water at 0 degrees.' },
  { label: 'arXiv: why does ice float, not so complicated', url: 'https://arxiv.org/pdf/2012.00842', for: 'The reason ice is less dense.' },
  { label: 'Feynmanpedia: why ice floats', url: 'https://feynmanpedia.com/thermodynamics-basics/why-ice-floats/', for: 'The maximum density at 4 degrees.' },
  { label: 'Ohio State: all about icebergs', url: 'https://beyondpenguins.ehe.osu.edu/issue/icebergs-and-glaciers/all-about-icebergs', for: 'About 90 per cent of an iceberg is under water.' },
  { label: 'Wikipedia: sea ice', url: 'https://en.wikipedia.org/wiki/Sea_ice', for: 'The density of sea ice.' },
  { label: 'Wikipedia: lake stratification', url: 'https://en.wikipedia.org/wiki/Lake_stratification', for: 'Layers in a lake.' },
  { label: 'Wikipedia: dimictic lake', url: 'https://en.wikipedia.org/wiki/Dimictic_lake', for: 'Turnover and ice cover.' },
  { label: 'University of Guelph: lakes through the seasons', url: 'http://www.aquatic.uoguelph.ca/lakes/season/page3.htm', for: 'The lake in winter.' },
  { label: 'Basic Water Science: water temperature patterns in lakes', url: 'https://basicwaterscience.com/physical-water-quality-parameters/water-temperature/temperature-ranges-in-lakes/', for: 'Temperatures in a lake.' },
];
