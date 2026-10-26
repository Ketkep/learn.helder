// Everything the "Why the sea is salty" page says, in one place.
// A salt works with four shallow pans and four things to try: a bathtub that fills with salt, a pan that dries out, what the salt is made of, and the salt spread on land.
// The ions and the numbers come from the sources. The bathtub is a toy with made up units, and the page says so.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Rain that carries rock',
  paras: [
    'Seawater holds about 3.5 per cent salt, which is about 35 grams in each kilogram. Most of it is ordinary table salt, sodium chloride. Where does it come from? Rain is slightly acidic, because it picks up carbon dioxide from the air. It slowly wears down rock on land, and rivers carry the dissolved minerals to the sea. When sea water evaporates, the water goes up and the salt stays behind. Hot water seeping through the sea floor adds and removes minerals too.',
    'Four pans to try. Fill a toy sea with salt and see where it settles. Dry out a pan and watch it get saltier. See what the salt is made of. And spread all the sea’s salt on the land. The first one is a toy with made up units, and the page says so. Without a script each pan shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'tub',
    kicker: 'First pan',
    title: 'A bathtub of salt',
    paras: [
      'Think of the sea as a bathtub. Rivers pour in a little salt every year, about four billion tons by one estimate. Rivers are not salty because fresh rain keeps washing them through. The sea has no outlet for its water except evaporation, so the salt stays. But salt is also used by sea life and locked into the sea floor, so the amount does not grow for ever. Today the input and the output are in balance, and the ocean is no longer getting saltier.',
      'Slide the salt coming in and the salt taken out. The toy sea starts fresh and fills up. It settles where what comes in matches what goes out. The numbers are made up. Only the settling point of 35 is the real sea.',
    ],
  },
  {
    id: 'pan',
    kicker: 'Second pan',
    title: 'A pan that dries out',
    paras: [
      'When water evaporates from a closed pool, only the water leaves, and the salt stays. So the water that is left gets saltier. The Dead Sea has no outlet and the sun dries it. It is about 34 per cent salt, nearly ten times as salty as the ocean. Lakes with no way out for their water get salty in the same way.',
      'Slide the share of the water that has gone. The page works out how salty the rest becomes, if no salt leaves. In a real pool some salts begin to form crystals when it gets very salty, so this is simplified.',
    ],
  },
  {
    id: 'ions',
    kicker: 'Third pan',
    title: 'What the salt is made of',
    paras: [
      'Sea salt is not only sodium chloride. It is a mix of several dissolved pieces called ions, and the mix is almost the same in every ocean. Chloride and sodium are by far the biggest, followed by sulfate, magnesium, calcium and potassium. Shares of the dissolved salts are worked out here from a table of amounts in a litre of seawater.',
      'Pick an ion to see its share. Chloride and sodium together are about 85 per cent in this table, and the US Geological Survey says over 90 per cent. The sources do not agree on the exact figure.',
    ],
  },
  {
    id: 'land',
    kicker: 'Fourth pan',
    title: 'All the salt on land',
    paras: [
      'There is a lot of salt in the sea. By one estimate, if all of it were taken out and spread evenly over the land, it would make a layer more than 500 feet, or 166 metres, thick, about the height of a 40 storey building. It is an estimate, not a measurement.',
      'Slide the share of the sea’s salt you spread. The page gives the depth of the layer. At half the salt, the layer is half as deep.',
    ],
    tags: [{ label: 'Check', text: 'The figures on this page are estimates, and sources round them differently. The ocean is about 3.5 per cent salt, from 35 grams to a kilogram. A table of amounts gives about 34.5 grams in a litre.' }],
  },
];

export const takeaways = [
  'Seawater is about 3.5 per cent salt, about 35 grams in a kilogram.',
  'Rain, made slightly acid by carbon dioxide, wears down rock and rivers carry the dissolved minerals to the sea. Vents on the sea floor add and remove minerals too.',
  'Evaporation takes the water and leaves the salt, so a sea with no outlet gets saltier. The Dead Sea is about 34 per cent.',
  'Chloride and sodium are the biggest parts of sea salt, about 55 and 31 per cent of the dissolved salts in one table.',
  'Salt coming in and going out are in balance today. By one estimate, the salt of the sea would make a layer 166 metres thick on land.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Rain made slightly acid by carbon dioxide wearing down rock, rivers carrying the ions to the sea, hydrothermal vents adding and removing minerals, about four billion tons of dissolved salts reaching the sea a year, an ocean that is no longer getting saltier, the ocean at about 3.5 per cent, the Dead Sea at about 34 per cent (33.7 or 34.2 in different sources), a lake with no outlet getting saltier by evaporation, the ion table of 18,980 mg/l chloride, 10,556 sodium, 2,649 sulfate, 1,262 magnesium, 400 calcium and 380 potassium in a total of 34,483 mg/l, and the layer of more than 500 feet or 166 metres on the land each appeared in at least two places. Sources differ on the share of chloride and sodium (about 85 or over 90 per cent), on the Dead Sea figure and on the ways salt is added. The page does not give a residence time for the salt, which the sources checked did not give. The toy bathtub, its start from fresh water and its units are made up, and the drying pan ignores salts that form crystals. The sums are computed on the page.';

export const sources = [
  { label: 'USGS: why is the ocean salty', url: 'https://www.usgs.gov/faqs/why-ocean-salty', for: 'Rain, rock and the ions of the sea.' },
  { label: 'USGS: top 10 things you didn’t know about the ocean', url: 'https://www.usgs.gov/programs/cmhrp/news/top-10-things-you-didnt-know-about-ocean', for: 'The layer of salt on the land.' },
  { label: 'Marine Sanctuary: why is the ocean so salty', url: 'https://marinesanctuary.org/blog/why-is-the-ocean-so-salty/', for: 'Rivers, vents and the balance today.' },
  { label: 'Salinity Remote Sensing: salinity FAQs', url: 'https://salinity.oceansciences.org/overview-faqs-more.htm?id=41', for: 'Why the sea is salty.' },
  { label: 'Wikipedia: sea salt', url: 'https://en.wikipedia.org/wiki/Sea_salt', for: 'The table of ions in seawater.' },
  { label: 'OpenLearn: the oceans', url: 'https://www.open.edu/openlearn/science-maths-technology/the-oceans/content-section-3.1', for: 'The constant proportions of the main ions.' },
  { label: 'Wikipedia: list of bodies of water by salinity', url: 'https://en.wikipedia.org/wiki/List_of_bodies_of_water_by_salinity', for: 'The Dead Sea and other waters.' },
  { label: 'World Atlas: why the Dead Sea has almost no life', url: 'https://www.worldatlas.com/oceans/why-the-dead-sea-has-almost-no-life-in-it.html', for: 'The Dead Sea at 33.7 per cent.' },
  { label: 'Utah State Parks: Great Salt Lake', url: 'https://stateparks.utah.gov/wp-content/uploads/sites/13/2023/08/GSLPart1.docx.pdf', for: 'The ocean at 3.5 per cent and a lake with no outlet.' },
];
