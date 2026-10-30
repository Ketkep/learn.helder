// Everything the "Why rockets have stages" page says, in one place.
// A set of blueprint sheets with three things to try: how fuel buys speed, what one stage can do, and what stages add.
// The exhaust speeds and the speed needed for orbit come from the sources. The shares of structure and payload are made up for the page.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Throw mass backwards to go forwards',
  paras: [
    'A rocket has nothing to push against. It speeds up by throwing its own propellant out of the back, and the faster it throws it, the more speed it gains from each kilogram. As the propellant burns, the rocket gets lighter, so the same push gives it more speed. The rocket equation says how much: the gain in speed is the exhaust speed times the natural logarithm of the launch mass over the final mass.',
    'To get into low orbit, a rocket must reach a sideways speed of about 7.8 kilometres a second. With the losses to gravity and air, the sources put the total at about 9.4. Three blueprint sheets to try. See how fuel buys speed, with ever smaller returns. See what one stage can do. And see what dropping empty stages adds. The shares of structure and payload are made up for the page. Without a script each sheet shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'fuel',
    kicker: 'Sheet one',
    title: 'Fuel buys speed, with a catch',
    paras: [
      'Because of the logarithm, each extra bit of fuel buys less speed than the one before. To double the gain from a rocket you do not double the fuel. You need to square the mass ratio. The exhaust speed matters just as much. A kerosene and oxygen engine in a vacuum, like the Merlin Vacuum, has a specific impulse of about 348 seconds, which is an exhaust speed of about 3.4 kilometres a second. A hydrogen and oxygen engine, like the RS-25, has about 452 seconds, or 4.4.',
      'Choose an engine and slide the share of the launch mass that is propellant. The curve climbs fast and then flattens. The page also works out how much of the rocket would have to be propellant to reach 9.4, if the rocket had no structure at all.',
    ],
    tags: [
      { label: 'Check', text: 'Sources give about 7.8 kilometres a second as the sideways speed of low orbit, and 9.4 or 9.7 for the total change in speed with losses. The page uses 9.4. The specific impulses are 348 seconds for the Merlin Vacuum and 452.3 for the RS-25, and the exhaust speed is that times 9.80665.' },
    ],
  },
  {
    id: 'single',
    kicker: 'Sheet two',
    title: 'What one stage can do',
    paras: [
      'A real rocket is not all propellant. It needs tanks, engines and a payload. Say the structure is a share of the launch mass, and the payload is 2 per cent. When all the propellant is burnt, what is left is the structure and the payload, and the gain in speed is the exhaust speed times the logarithm of one over that share.',
      'Slide the share of structure and pick an engine. See how little it takes for one stage to fall short. The numbers are made up for the page, but the lesson is from the sources: the speed needed for orbit asks for a mass ratio that one stage can barely reach, or cannot.',
    ],
  },
  {
    id: 'stages',
    kicker: 'Sheet three',
    title: 'Drop the empty tanks',
    paras: [
      'The fix is to throw away the dead weight. When the first stage is empty, it is dropped, and the rest of the rocket carries on with a smaller mass to push. Each stage gives its own gain in speed, and they add up. Upper stages also tend to have engines that work better in a vacuum.',
      'Choose the number of stages and the share of structure in each. The page splits the rocket into stages of equal step in mass and adds the gains in speed. Going from one stage to two helps a great deal. A third helps less, and a fourth hardly at all.',
    ],
    tags: [
      { label: 'History', text: 'Konstantin Tsiolkovsky published the rocket equation in 1903, though sources note that others, such as William Moore in 1810 and Robert Goddard in 1912, found it independently. The first artificial satellite, Sputnik 1, was launched on 4 October 1957.' },
    ],
  },
];

export const takeaways = [
  'A rocket gains speed by throwing propellant backwards. The gain is the exhaust speed times the natural log of launch mass over final mass.',
  'Because of the logarithm, each extra bit of fuel buys less speed than the one before.',
  'Low orbit needs a sideways speed of about 7.8 kilometres a second, and about 9.4 of change in speed once gravity and air are counted.',
  'A hydrogen and oxygen engine has an exhaust speed of about 4.4 kilometres a second, and a kerosene one about 3.4.',
  'Dropping empty stages adds speed. Two stages help a lot, and each one after that helps less.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The rocket equation with its logarithm, about 7.8 kilometres a second as the sideways speed of low orbit, about 9.4 kilometres a second as the total with gravity and air losses, the specific impulse of the RS-25 at 452.3 seconds in a vacuum and of the Merlin Vacuum at 348 seconds, the exhaust speed as specific impulse times standard gravity, the reason for staging, Tsiolkovsky in 1903 and Sputnik 1 on 4 October 1957 each appeared in at least two places. Sources differ on the total change in speed (9.4 or 9.7), on the date of the equation (1897 for his notes, 1903 for the paper) and on who found it first, and the page says so. The engine figures come from a table of engines and were not checked against the makers. Other figures that were suggested for the Saturn V and the F-1 engine did not agree between sources, so the page does not use them. The share of structure, the payload of 2 per cent and the equal steps between stages are made up for the page, and the loss of speed to gravity and air is taken from the total. The sums are computed on the page.';

export const sources = [
  { label: 'Wikipedia: Tsiolkovsky rocket equation', url: 'https://en.wikipedia.com/wiki/Rocket_equation', for: 'The equation and who found it.' },
  { label: 'Wikipedia: delta-v budget', url: 'https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.4everland.io/wiki/Delta-v_budget.html', for: 'The speed needed for low orbit.' },
  { label: 'Wikipedia: comparison of orbital rocket engines', url: 'https://www.wikipedia.org/wiki/Comparison_of_orbital_rocket_engines', for: 'Specific impulse of the RS-25 and the Merlin.' },
  { label: 'L3Harris: the RS-25 engine', url: 'https://l3harris.com/all-capabilities/rs-25-engine', for: 'The RS-25.' },
  { label: 'Team Indus: the tyranny of the rocket equation', url: 'https://medium.com/teamindus/rocket-science-101-the-tyranny-of-the-rocket-equation-491e0cf4dc6a', for: 'Why mass ratio is the problem.' },
  { label: 'Rocket staging (Vaia)', url: 'https://vaia.com/en-us/explanations/engineering/mechanical-engineering/rocket-staging', for: 'Why rockets have stages.' },
  { label: 'Multistage rocket (Wikipedia mirror)', url: 'https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.4everland.io/wiki/Two-stage.html', for: 'Staging and upper stage engines.' },
  { label: 'NASA technical report on launch vehicles', url: 'https://ntrs.nasa.gov/api/citations/20150016477/downloads/20150016477.pdf', for: 'Staging and mass ratio.' },
  { label: 'Encyclopedia.com: Konstantin Tsiolkovsky', url: 'https://www.encyclopedia.com/science/encyclopedias-almanacs-transcripts-and-maps/tsiolkovsky-konstantin', for: 'Tsiolkovsky and the work of 1903.' },
  { label: 'East Tennessee State University: ideas of space flight', url: 'https://faculty.etsu.edu/gardnerr/sputnik/engineers.htm', for: 'Early rocket engineers and Sputnik.' },
];
