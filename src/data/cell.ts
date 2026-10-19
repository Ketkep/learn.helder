// Everything the "How a battery works" page says, in one place.
// A bench with four things to try: a pile of discs, one cell step by step, cells in series and in parallel, and how long a battery lasts.
// The cell values are made up unless the page says they come from a source.
// The page explains how batteries work. It gives no advice on using or charging them.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Chemistry that pushes electrons',
  paras: [
    'A battery turns chemical energy into electrical energy. Inside it, two different materials want to swap electrons. When you join them with a wire, the electrons go through the wire, and that flow is the current. The battery runs flat when the chemicals are used up.',
    'Four things to try. Stack a pile of discs and watch the voltage rise. Follow one cell step by step. Wire four cells in a row, in two rows and side by side. And work out how long a battery lasts. The page explains how batteries work and gives no advice on using or charging them. The cell values are made up unless the page says they come from a source. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'pile',
    kicker: 'Bench one',
    title: 'Volta’s pile',
    paras: [
      'In 1800 Alessandro Volta showed the first battery that worked, a pile of zinc discs and copper discs with card soaked in salt water between them. Each zinc and copper pair adds a little voltage, so a taller pile gives more. The unit of voltage, the volt, is named after him.',
      'Slide the number of pairs. In this toy each pair adds 1.1 volts, which is the voltage of a zinc and copper cell. A real pile gives less per pair.',
    ],
  },
  {
    id: 'cell',
    kicker: 'Bench two',
    title: 'One cell, step by step',
    paras: [
      'The Daniell cell is a zinc bar and a copper bar, each in its own liquid, with a porous barrier between them. It gives about 1.1 volts. The electrons carry current in the wire. Ions carry current inside the cell.',
      'Press next to go through the five steps. The picture lights up the part that is working.',
    ],
  },
  {
    id: 'wire',
    kicker: 'Bench three',
    title: 'In a row or side by side',
    paras: [
      'Cells in series, one after another, add their voltages. Cells in parallel, side by side, keep the same voltage and add their capacity. Capacity is how much charge the battery holds, counted in milliamp hours.',
      'Here are four toy cells of 1.5 volts and 2,000 milliamp hours each. Pick a layout. The energy stored is voltage times capacity, and it is the same in every layout.',
    ],
  },
  {
    id: 'last',
    kicker: 'Bench four',
    title: 'How long will it last',
    paras: [
      'The energy in watt hours divided by the power of the thing it runs, in watts, gives the hours it can run. A device that uses twice the power empties the same battery in half the time.',
      'Pick a layout and a device. In real life a battery gives less than this when it is drained fast, and its voltage falls as it empties, so treat the answer as a rough guide.',
    ],
    tags: [{ label: 'Not advice', text: 'This page explains how batteries work with made up values. It does not tell anyone how to use, charge or throw away a battery. Follow the instructions that come with a battery.' }],
  },
];

export const takeaways = [
  'A battery turns chemical energy into electrical energy. Electrons carry the current in the wire and ions carry it inside the cell.',
  'Volta’s pile of 1800 was the first working battery. Each pair of discs added voltage.',
  'A zinc and copper cell gives about 1.1 volts.',
  'Cells in series add voltage. Cells in parallel add capacity. The energy is voltage times capacity.',
  'Run time is energy divided by power. Real batteries give less when they are drained fast.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The zinc and copper (Daniell) cell giving about 1.1 volts, zinc as the anode and copper as the cathode, electrons carrying the current in the wire and ions in the liquid, a porous barrier between the two solutions, Volta presenting the voltaic pile in 1800 as zinc and copper discs with card soaked in salt water, the volt being named after him, series cells adding voltage and parallel cells adding capacity, and energy as voltage times capacity each appeared in at least two places. The step by step wording is the page’s own. The 1.1 volts a pair in the pile, the 1.5 volt and 2,000 milliamp hour toy cells, the powers of the four devices and the run time sum (energy divided by power) are made up or worked out for the page, and real batteries give less when they are drained fast. The page explains how batteries work and gives no advice on using, charging or throwing them away.';

export const sources = [
  { label: 'Wikipedia: Daniell cell', url: 'https://en.wikipedia.org/wiki/Daniell_cell', for: 'The zinc and copper cell.' },
  { label: 'HyperPhysics: electrochemical cells', url: 'https://hyperphysics.gsu.edu/hbase/chemical/electrochem.html', for: 'How a cell makes a current.' },
  { label: 'National MagLab: the Daniell cell', url: 'https://nationalmaglab.org/magnet-academy/watch-play/interactive-tutorials/daniell-cell/', for: 'The two half cells and the barrier.' },
  { label: 'Vedantu: Daniell cell', url: 'https://www.vedantu.com/chemistry/daniell-cell', for: 'The reactions at each bar.' },
  { label: 'BASF: electricity from chemistry', url: 'https://www.basf.com/global/en/media/magazine/creatingchemistrystories/2017/pioneering-thinker-electricity-from-chemistry', for: 'Volta and the pile.' },
  { label: 'Renogy: who invented the battery', url: 'https://renogy.com/blog/who-invented-the-battery', for: 'The voltaic pile in 1800.' },
  { label: 'Discover Battery: batteries in parallel', url: 'https://discoverbattery.com/support/learning-center/battery-101/why-are-batteries-connected-in-parallel', for: 'Series and parallel.' },
  { label: 'Volts: wiring batteries in series and parallel', url: 'https://volts.ca/blogs/educational/wiring-batteries-in-series-vs-parallel', for: 'Voltage, capacity and energy.' },
];
