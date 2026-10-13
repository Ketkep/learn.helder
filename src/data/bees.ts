// Everything the "The bee dance" page says, in one place.
// A honey bee that finds flowers dances on the comb to tell the others where they are. Four panels read it.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A dance with a map in it',
  paras: [
    'A honey bee that finds flowers flies back to the hive and dances on the comb in the dark. Other bees crowd round and follow it. A little later they fly straight to the flowers. The dance tells them the way. The Austrian scientist Karl von Frisch worked this out by watching bees for years.',
    'The dance has a straight part, the waggle run, where the bee shakes its body as it walks forward. The direction of the run tells the way, and how long it lasts tells how far. Four panels let you read it, send a bee, watch the sun move and see why bees watch more than one run. Without a script, each panel shows one example.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'read',
    kicker: 'Look one',
    title: 'Read the dance',
    paras: [
      'The comb hangs upright in the dark, so the bee uses gravity as its compass. Straight up on the comb means the direction of the sun. If the waggle run points 60 degrees to the right of straight up, the flowers are 60 degrees to the right of the sun.',
      'The longer the waggle run, the farther the flowers. As a rule of thumb, each second of waggling means about a kilometre. Set the angle and the length of the run and the map shows where the other bees will fly.',
    ],
    tags: [{ label: 'About a kilometre', text: 'A waggle run of 2.5 seconds was described as sending bees to flowers about 2.6 kilometres away. The rule of one second for each kilometre is only approximate, and it differs a little between kinds of honey bee.' }],
  },
  {
    id: 'send',
    kicker: 'Look two',
    title: 'Send a bee',
    paras: [
      'Now go the other way. Press a spot on the map, or move the sliders, to put flowers somewhere. The comb shows the dance the bee would do to send the others there.',
      'Choose where the sun is. When the flowers lie in the same direction as the sun, the bee waggles straight up. When they lie in the opposite direction, it waggles straight down.',
    ],
  },
  {
    id: 'sun',
    kicker: 'Look three',
    title: 'The sun moves',
    paras: [
      'The sun moves across the sky during the day, but the flowers stay where they are. So the bee changes the angle of its dance as the hours pass, to keep the dance pointing the right way. Bees inside the dark hive keep up with the sun even though they cannot see it.',
      'Slide through the day with the flowers fixed. The sun moves about 15 degrees an hour in this model, so the angle of the dance changes by about that much each hour.',
    ],
    tags: [{ label: 'A toy sun', text: 'This panel treats the sun as moving 15 degrees an hour and being due south at noon. The real sun moves at different speeds through the day and its path depends on the place and the season.' }],
  },
  {
    id: 'noise',
    kicker: 'Look four',
    title: 'Many runs',
    paras: [
      'One waggle run is not exact. Field studies found the angle of a run can vary by about 15 degrees either way, and its length by about 15 per cent. That is a big miss if you only watch one run. A bee dances for a long time and repeats the run again and again, and followers see many runs.',
      'Slide the number of runs a follower watches. The dots are what each run suggests, and the ring shows their average. With more runs the average lands closer to the flowers.',
    ],
    tags: [{ label: 'On average', text: 'One sample can still be lucky or unlucky, so the page also shows the typical error over many tries. It shrinks as the number of runs goes up.' }],
  },
];

export const takeaways = [
  'A bee that finds flowers dances on the comb. The waggle run points the way and its length tells how far.',
  'Straight up on the comb means the direction of the sun. A run 60 degrees to the right of up points 60 degrees to the right of the sun.',
  'As a rule of thumb one second of waggling means about a kilometre, but it differs a little between kinds of honey bee.',
  'The dancer changes the angle through the day to follow the sun, so the flowers stay in the same place on the map.',
  'One run can be about 15 degrees and 15 per cent off, so followers watch many runs and the average is better.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The waggle run as the straight part of the dance, straight up on the comb standing for the sun, the angle to the right or left of up equal to the angle from the sun, the length of the run growing with distance, Karl von Frisch as the one who decoded it, and run to run variation of about 15 degrees and 15 per cent each appeared in at least two places. The distance scale is a rule of thumb of about a kilometre a second, and the sources say it depends on the kind of bee. The map, the sun and the noise are simple models made for this page. The sun is treated as moving 15 degrees an hour and being south at noon.';

export const sources = [
  { label: 'Wikipedia: waggle dance', url: 'https://en.wikipedia.org/wiki/Waggle_dance', for: 'The dance and how it was decoded.' },
  { label: 'NC State Extension: honey bee dance language', url: 'https://content.ces.ncsu.edu/honey-bee-dance-language', for: 'Angle from the sun and length of the run, with an example.' },
  { label: 'Springer: waggle dance study (Acta Biologica)', url: 'https://link.springer.com/article/10.1556/ABiol.59.2008.Suppl.24', for: 'Research on the dance language.' },
  { label: 'Springer: waggle dance study (Behavioral Ecology and Sociobiology)', url: 'https://link.springer.com/article/10.1007/s00265-010-0922-3', for: 'Variation of angle and duration from run to run.' },
  { label: 'American Bee Journal: the dance language', url: 'https://americanbeejournal.mydigitalpublication.com/july-2009-vol-149-no-7/pg-652', for: 'The dance in a beekeepers’ journal.' },
  { label: 'Pioneer Works: the honey bee waggle dance', url: 'https://pioneerworks.org/broadcast/honey-bee-waggle-dance', for: 'The dance explained.' },
  { label: 'Amerisurv: a zoological datum', url: 'https://amerisurv.com/?p=2440', for: 'The dance as a way of giving a direction.' },
];
