// Everything the "How a thermos keeps heat" page says, in one place.
// A kitchen shelf with three boards and three things to try: the three ways heat travels, building a flask from its parts,
// and the cooling curve. The ways heat travels, the flask's history and the shape of cooling come from the sources.
// The rates of the toy flask are made up for the page, and the page says so.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A bottle that slows the loss of heat',
  paras: [
    'A hot drink in a mug cools in about an hour. The same drink in a vacuum flask can stay hot for many hours. A flask cannot make heat last for ever. It slows down the three ways heat escapes. A drink in a flask also stays cold longer, for the same reason: the flask slows heat coming in.',
    'Three boards on a kitchen shelf. See the three ways heat travels. Build a flask from its parts and see which part stops which way. Then follow the temperature of a drink over twelve hours. The rates in the toy flask are made up for the page, and the shape of the cooling comes from the sources. Without a script each board shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'ways',
    kicker: 'First board',
    title: 'Three ways out',
    paras: [
      'Heat moves in three ways. Conduction passes it through things that touch. Convection carries it in moving air or liquid. Radiation sends it as invisible heat light, called infrared, which needs no air at all. A good flask has something against each one.',
      'Pick a way. The page says how it works and what stops it. A vacuum, a space with the air taken out, stops conduction and convection across it, but not radiation, because light crosses empty space. That is why the glass of the old flasks was silvered.',
    ],
  },
  {
    id: 'build',
    kicker: 'Second board',
    title: 'Build a flask',
    paras: [
      'Start with an open mug and add the parts of a flask one at a time. A vacuum gap between two walls cuts conduction and stops convection across the gap. Silvered walls reflect heat light. A stopper keeps the warm air from rising out of the top. Each part makes the arrows of lost heat thinner.',
      'Switch the parts on and off. The page adds up the toy rates of loss, as a share of the gap in temperature lost each hour, and works out how long the gap takes to halve. The rates are made up. The idea that each part closes one way out is from the sources.',
    ],
  },
  {
    id: 'curve',
    kicker: 'Third board',
    title: 'The cooling curve',
    paras: [
      'The rate at which a drink loses heat depends on how much hotter it is than the room. Newton’s law of cooling says it is in proportion. So the gap to the room shrinks by the same share every hour: fast at first, then slowly. The drink never quite reaches the room temperature, and it falls most in the first hour.',
      'Choose a hot or a cold drink and slide the room temperature. The three lines are the open mug, a flask with only a vacuum, and a full flask, using the toy rates. The page says when the drink reaches the temperature you pick.',
    ],
    tags: [
      { label: 'History', text: 'James Dewar, a Scottish scientist, invented the vacuum flask in 1892 for his work with very cold liquids. He did not patent it. Two German glassblowers, Reinhold Burger and Albert Aschenbrenner, made a sturdier version, and the name Thermos came from a competition in 1904, though sources differ a little on the dates.' },
    ],
  },
];

export const takeaways = [
  'Heat escapes by conduction, convection and radiation. A good flask has something against each one.',
  'A vacuum between two walls stops conduction and convection across the gap, but radiation crosses empty space, so the walls are silvered.',
  'The gap between a drink and the room shrinks by the same share every hour, so a drink cools fastest at the start.',
  'A flask slows heat coming in as well as going out, so it keeps cold drinks cold.',
  'James Dewar invented the vacuum flask in 1892. The name Thermos came from a competition in 1904.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Dewar inventing the vacuum flask in 1892 as a glass bottle inside a larger one with the air between taken out, his not patenting it, Burger and Aschenbrenner and the sturdier version with a stainless steel cover, the name Thermos from a contest in 1904, the silvered glass making loss by radiation small, the rate of cooling being in proportion to the gap to the surroundings with an exponential fall, and a flask lengthening the time a drink stays hot or cold each appeared in at least two places. Sources differ a little on the dates of the patent and the name (1903 or 1904) and on who named it. The three ways heat travels and the roles of the vacuum and the silvering are standard physics, with the silvering from a source, and the rest is described on the page in plain words. No source gave the rate of cooling of a flask, so the toy rates (0.15, 0.35 and 0.10 a hour for an open mug, and the amounts the parts cut) are made up, and so is the idea that a stopper cuts convection to 30 per cent. The curves and times are computed on the page from those made up rates.';

export const sources = [
  { label: 'Wikipedia: vacuum flask', url: 'https://en.wikipedia.org/wiki/Vacuum_flask', for: 'Dewar, 1892, and how a flask is built.' },
  { label: 'Irish Times: design moment, Thermos vacuum flask, 1892', url: 'https://www.irishtimes.com/life-and-style/homes-and-property/interiors/design-moment-thermos-vacuum-flask-1892-1.3783111', for: 'The invention of the flask.' },
  { label: 'Thermos: the story', url: 'https://thermos.eu/en/about-us/story', for: 'Burger, Aschenbrenner and the name.' },
  { label: 'Thermos: the evolution of Thermos', url: 'https://thermos.co.uk/blogs/news/the-evolution-of-thermos-from-classic-designs-to-modern-innovations', for: 'The sturdier flask.' },
  { label: 'Wikipedia: Newton’s law of cooling', url: 'https://en.wikipedia.org/wiki/Newton%27s_law_of_cooling', for: 'Cooling in proportion to the gap.' },
  { label: 'Vaia: Newton’s law of cooling', url: 'https://www.vaia.com/en-us/explanations/physics/further-mechanics-and-thermal-physics/newtons-law-of-cooling', for: 'The exponential fall.' },
  { label: 'University of Leicester: a paper on cooling in a flask', url: 'https://journals.le.ac.uk/index.php/pst/article/download/3918/3381/12020', for: 'Modelling coffee in a flask.' },
  { label: 'Wikipedia mirror: vacuum flask (Thermos)', url: 'https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.4everland.io/wiki/Thermos.html', for: 'Silvering and radiation.' },
  { label: 'Wikipedia: vacuum flask (archived 2014)', url: 'https://webarchive.library.unt.edu/web/20141030105700/http://en.wikipedia.org/wiki/Vacuum_flask', for: 'The construction of the flask.' },
];
