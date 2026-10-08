// Everything the "The water cycle" page says, in one place.
// The page is a river that runs down the side of the page. Each stop on the river is one idea with one tool.

export interface Stop {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Where the river starts',
  paras: [
    'The water in a river was rain, and the rain was sea a few days earlier. The same water goes round and round: up from the sea and the land as vapour, along on the wind as cloud, down as rain and snow, and back to the sea. This is the water cycle.',
    'Follow the river down the page. It stops four times. At each stop there is one thing to try: where the water is, why air lets go of it, what a mountain does to rain, and how long one drop of water takes to get round.',
  ],
};

/** The shares of all the water on Earth, in per cent, from the USGS (a 1993 estimate, rounded). */
export const earthWater = {
  ocean: 96.54,
  freshShare: 2.5,
  /** Of the fresh water: */
  ice: 68.7,
  groundwater: 30.1,
  /** Of all the water, in per cent. */
  freshLakes: 0.007,
  atmosphere: 0.001,
  soil: 0.001,
  rivers: 0.0002,
};

export const stops: Stop[] = [
  {
    id: 'where',
    kicker: 'First stop: the sea',
    title: 'Where the water is',
    paras: [
      'Most of the water on Earth is in the sea, and it is salt. Only about 2.5 per cent of all the water is fresh. Most of that fresh water is locked up as ice, or lies deep underground.',
      'Look closer, step by step. The last step shows how much water is in the places we see most: lakes, rivers, the air and the soil.',
    ],
    tags: [
      { label: 'A guess in 1993', text: 'These shares come from a 1993 estimate that the US Geological Survey still uses, rounded. Scientists keep improving the numbers, so the last digits are not exact.' },
    ],
  },
  {
    id: 'air',
    kicker: 'Second stop: the cloud',
    title: 'Air that cannot hold it',
    paras: [
      'Air can hold water as an invisible gas, but only up to a limit. The limit grows fast with the temperature: warm air holds much more than cold air. At 0 degrees a cubic metre of air holds at most about 4.9 grams. At 20 degrees it holds about 17 grams. At 30 degrees it holds about 30 grams.',
      'Cool air that is full to its limit and the extra water turns into droplets. That is a cloud, or dew. The temperature at which this starts is called the dew point. Set the air and see how far it must cool.',
    ],
    tags: [
      { label: 'About 6 per cent', text: 'For each degree warmer, the air can hold about 6 to 7 per cent more water. That is why a warm day can feel muggy, and why a warming world gets heavier rain.' },
    ],
  },
  {
    id: 'mountain',
    kicker: 'Third stop: the mountain',
    title: 'Over the mountain',
    paras: [
      'When wind meets a mountain, the air is pushed up. Higher air is cooler, because it has more room and the pressure is lower. Air that rises cools by about 10 degrees for each kilometre. Once it gets to its dew point, cloud forms, and it cools more slowly, by about 6.5 degrees a kilometre. The cloud drops its rain on the way up.',
      'On the far side the air goes down and warms again, and it has lost much of its water. So it is warmer and drier than before. The dry land behind a mountain is called a rain shadow. Raise the mountain and watch what changes.',
    ],
    tags: [
      { label: 'Simple model', text: 'This is a simple model. It leaves out the wind, the shape of the land and how air changes density as it rises. It shows the idea and does not predict the weather.' },
    ],
  },
  {
    id: 'drop',
    kicker: 'Fourth stop: back to the sea',
    title: 'A drop’s trail',
    paras: [
      'A drop of water does not stay in one place. It sits in the sea, goes up into the air, falls as rain, runs down a river, soaks into the ground, freezes in a glacier, and comes round again. But it does not spend the same time in each place.',
      'Send a drop on its way. The chances of each move are made up for this page, and the times are rough averages. A drop spends only a few days in the air, and thousands of years in the sea.',
    ],
    tags: [
      { label: 'Rough averages', text: 'Sources disagree about how long water stays in each place, so the times here are rough. Air is about 8 to 9 days, rivers about 2 weeks, soil from weeks to a year, lakes years, groundwater from weeks to thousands of years, and the sea about 3,000 to 4,000 years.' },
    ],
  },
];

export const takeaways = [
  'About 96.5 per cent of Earth’s water is in the sea. Only about 2.5 per cent is fresh, and most of that is ice or groundwater.',
  'Lakes, rivers, soil and the air hold only a tiny share of all the water, yet they are what we see and use.',
  'Warm air can hold much more water vapour than cold air: about 4.9 grams in a cubic metre at 0 degrees, and about 17 grams at 20 degrees.',
  'When air cools below its dew point, extra water turns into droplets. That makes clouds and rain.',
  'Air that goes over a mountain drops its rain on the way up and comes down warmer and drier. This makes a rain shadow.',
  'A drop of water spends days in the air and thousands of years in the sea. The water cycle moves the same water round and round.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The shares of the world’s water (96.5 per cent in the sea, about 2.5 per cent fresh, 68.7 per cent of the fresh water as ice) come from the USGS, and the table of how much vapour air can hold at 0, 10, 20 and 30 degrees (4.85, 9.4, 17.3 and 30.4 grams a cubic metre) each appeared in two places. The residence times in the last tool disagree between sources, so they are marked as rough. The chances in the drop game are made up. The model of air over a mountain is a simple textbook one (about 10 degrees a kilometre dry and about 6.5 degrees a kilometre in cloud) and it shows the idea, not the weather.';

export const sources = [
  { label: 'USGS: where is Earth’s water?', url: 'https://www.usgs.gov/special-topic/water-science-school/science/where-earths-water', for: 'The shares of salt water, fresh water, ice and groundwater.' },
  { label: 'USGS: the distribution of water on, in and above the Earth', url: 'https://usgs.gov/media/images/distribution-water-and-above-earth', for: 'The table behind the shares, with lakes, rivers, soil and the air.' },
  { label: 'Wikipedia: water distribution on Earth', url: 'https://en.wikipedia.org/wiki/Water_distribution_on_Earth', for: 'The same shares in one table.' },
  { label: 'HyperPhysics: saturated vapour pressure and density for water', url: 'https://www.hyperphysics.gsu.edu/hbase/Kinetic/watvap.html', for: 'The most vapour a cubic metre of air can hold at each temperature.' },
  { label: 'Wikipedia: saturation vapour density', url: 'https://en.wikipedia.org/wiki/Saturation_vapor_density', for: 'The same table and the formula behind it.' },
  { label: 'University of British Columbia: orographic uplift and lee shadowing', url: 'https://www.eoas.ubc.ca/courses/atsc113/snow/met_concepts/06-met_concepts/06e-orographic-uplift-lee-shadowing/', for: 'Air cooling over a mountain and the rain shadow.' },
  { label: 'CIMSS: stability and cloud development', url: 'https://cimss.ssec.wisc.edu/wxwise/class/stable.html', for: 'The cooling rates of dry and cloudy air.' },
  { label: 'BC Open Textbooks: the hydrological cycle', url: 'https://opentextbc.ca/geology/chapter/13-1-the-hydrological-cycle/', for: 'How long water stays in each reservoir.' },
  { label: 'Harvard BioNumbers: how long water stays in rivers and the air', url: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=115098', for: 'The average time for water to renew in rivers and in the air.' },
  { label: 'Iowa State University: water reservoirs and residence times', url: 'https://meteor.geol.iastate.edu/gccourse/hydro/aspects/reservoir.html', for: 'Reservoirs of the water cycle and their residence times.' },
];
