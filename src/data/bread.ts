// Everything the "How bread rises" page says, in one place.
// One loaf, followed through a day in four stops. Every number is a toy model made for this page.

export interface Stop {
  id: string;
  time: string;
  title: string;
  heading: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A day with one loaf',
  paras: [
    'Bread rises because yeast, a tiny living fungus, eats sugar in the dough and gives off a gas. The gas is trapped in a stretchy net of protein called gluten, so the dough swells like a balloon. The oven then sets the loaf and turns its outside brown.',
    'Four stops follow one loaf through a day. Each has something to move. The numbers are toy models made for this page, based on typical values, and real doughs vary. Without a script, each stop shows a table.',
  ],
};

export const stops: Stop[] = [
  {
    id: 'knead',
    time: '07:30',
    title: 'The net',
    heading: 'Kneading and gluten',
    paras: [
      'Flour has two proteins, glutenin and gliadin. With water and mixing they join into a stretchy net called gluten. Glutenin makes the net springy and gliadin lets it stretch. Kneading lines the net up and makes it stronger.',
      'Knead for longer and the net holds more of the gas. A weak net lets bubbles join up and burst. A net that is too strong would hardly stretch at all. The picture is a slice of dough with its bubbles.',
    ],
    tags: [{ label: 'Salt', text: 'Salt makes the net tighter and also slows the yeast. Bakers use about 2 per cent of the weight of the flour.' }],
  },
  {
    id: 'rise',
    time: '09:00',
    title: 'The rise',
    heading: 'Warm or cold',
    paras: [
      'Yeast works faster when it is warm. Around 25 to 32 degrees it is at its best. In a fridge it is slow but not stopped, which is why some bakers let dough rise overnight in the cold. Above about 55 to 60 degrees the yeast dies.',
      'Move the temperature and the hours. The jar shows how far the dough has grown. The times are a toy model: real doughs vary with the flour, the amount of yeast and the salt.',
    ],
    tags: [{ label: 'Gas, not magic', text: 'Yeast turns sugar into carbon dioxide gas and a little alcohol. The gas puffs the dough up, and most of the alcohol goes away in the oven.' }],
  },
  {
    id: 'spring',
    time: '12:00',
    title: 'The oven',
    heading: 'Oven spring',
    paras: [
      'When the dough goes into the oven, the gas in its bubbles warms up and takes more room. For a while the loaf grows fast. This is called oven spring. By about 58 degrees the yeast is dead, and by about 76 degrees the starch and protein have set, so the shape is fixed.',
      'Slide the temperature at the middle of the loaf up from 30 degrees. The loaf grows, then stops.',
    ],
    tags: [{ label: 'The gas law', text: 'Gas takes up more room as it warms: its volume goes up in step with its temperature in kelvin. From 30 to 76 degrees that is about 15 per cent, and water and alcohol turning to vapour add more.' }],
  },
  {
    id: 'crust',
    time: '12:40',
    title: 'The crust',
    heading: 'Crust and crumb',
    paras: [
      'The outside of the loaf gets much hotter than the inside. The crumb stays near the boiling point of water, about 90 to 100 degrees, because it is full of water. The crust dries out and goes above 100 degrees, and then sugars and proteins react and turn it brown.',
      'Move the temperature of the surface and watch the crust change colour. Browning starts a little above 100 degrees and gets darker as it climbs. Too dark and the bread tastes bitter.',
    ],
    tags: [{ label: 'Maillard', text: 'The browning reaction between sugars and amino acids is called the Maillard reaction. It also makes the smell of fresh bread. Sources give different start temperatures, from about 100 to 140 degrees, so the numbers here are rough.' }],
  },
];

export const takeaways = [
  'Yeast eats sugar in the dough and gives off carbon dioxide gas and a little alcohol.',
  'Yeast is fastest when it is warm, about 25 to 32 degrees. It is slow in the cold and dies at about 55 to 60 degrees.',
  'Gluten, which forms from two flour proteins with water and kneading, is a stretchy net that traps the gas. Salt tightens it.',
  'In the oven the gas warms and takes up more room, which is oven spring, until the starch and protein set at about 76 degrees.',
  'The crumb stays near 100 degrees. The dry crust goes hotter and browns by the Maillard reaction.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Yeast making gas from sugar, the best dough range of about 25 to 32 degrees and the death point of about 55 to 60 degrees, glutenin and gliadin forming a net with water and kneading, salt at about 2 per cent of the flour weight, the setting of starch and protein at about 76 degrees, and a crumb that stays at about 90 to 100 degrees each appeared in at least two places. Several sources are baking guides and not research papers, and they disagree on the start of browning (about 100 to 140 degrees), so those numbers are marked as rough. The rise times, the kneading curve and the crust colours are toy models made for this page, and the gas law figure is a simple sum.';

export const sources = [
  { label: 'Exploratorium: yeast and temperature', url: 'https://annex.exploratorium.edu/cooking/bread/yeast_temp.html', for: 'Best range for dough and the death point of yeast.' },
  { label: 'American Society of Baking: baking', url: 'https://asbe.org/article/baking/', for: 'Oven spring, yeast death and the setting of starch.' },
  { label: 'American Society of Baking: salt', url: 'https://asbe.org/article/salt', for: 'Salt slows yeast and firms the dough.' },
  { label: 'King Arthur Baking: salt', url: 'https://www.kingarthurbaking.com/pro/reference/salt', for: 'About 2 per cent salt on the weight of the flour.' },
  { label: 'Scientific American: gluten’s complex chemistry', url: 'https://www.scientificamerican.com/article/glutens-complex-chemistry-contributes-to-delicious-baked-goods/', for: 'Glutenin, gliadin and the net.' },
  { label: 'Food Manufacturing: gluten and baked goods', url: 'https://www.foodmanufacturing.com/ingredients/news/22879923/glutens-complex-chemistry-behind-light-and-fluffy-baked-goods', for: 'The net traps the gas.' },
  { label: 'BakeInfo: gluten (PDF)', url: 'https://www.bakeinfo.co.nz/wp-content/uploads/2021/11/BakeInfo_Info_Gluten.pdf', for: 'Gluten, elasticity and kneading.' },
  { label: 'PubMed Central: kneaded dough', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10708170', for: 'How kneaded dough stretches.' },
  { label: 'BakerPedia: browning', url: 'https://bakerpedia.com/?p=3586', for: 'Maillard browning of the crust.' },
  { label: 'Mother Earth News: temperature influences on bread', url: 'https://www.motherearthnews.com/real-food/temperature-influences-on-bread-as-it-bakes/', for: 'Temperatures at which things happen in a baking loaf.' },
  { label: 'The Fresh Loaf: temperature influences on bread', url: 'https://www.thefreshloaf.com/node/13315/temperature-influences-bread-it-bakes', for: 'The crumb stays near 90 to 100 degrees.' },
];
