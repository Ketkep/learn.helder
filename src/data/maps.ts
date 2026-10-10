// Everything the "How maps flatten the Earth" page says, in one place.
// Every panel shows a globe next to a flat copy of it. The copy follows the projection the reader picks.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'One globe, many copies',
  paras: [
    'The Earth is a ball and a map is flat. You cannot flatten a ball without stretching it or tearing it, so every flat world map gets something wrong. A map projection is a rule for making the flat copy. Each rule keeps some things true and gives up others.',
    'In each panel the globe on the left is the truth and the map on the right is the copy. Pick a projection and see what it does. Without a script, each panel shows the Mercator map, which is the one on most classroom walls.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'circles',
    kicker: 'Look one',
    title: 'Equal circles',
    paras: [
      'Imagine the same small circle stamped all over the globe. On the globe every stamp has the same size and shape. Put the stamps on a flat map and they change. Where they grow, the map stretches the Earth. Where they turn into ovals, the map bends shapes.',
      'Mercator keeps every circle round, which is why it keeps small shapes and compass directions right, but the circles grow fast towards the poles. The equal-area maps keep every circle the same size, but the circles turn into ovals.',
    ],
    tags: [
      { label: 'Why not fix it?', text: 'Carl Friedrich Gauss showed in the 1820s that a curved surface like a ball cannot be laid flat without distortion. No projection can keep both shapes and sizes right everywhere.' },
    ],
  },
  {
    id: 'size',
    kicker: 'Look two',
    title: 'Greenland and Africa',
    paras: [
      'On a Mercator map Greenland looks about as big as Africa. In truth Africa is about 14 times bigger: roughly 30.4 million square kilometres against 2.2 million.',
      'The two patches below are circles with the same areas as Africa and Greenland, not their real outlines. Slide the Greenland patch from the equator up to 72 degrees north, where Greenland lies, and watch the map stretch it. Switch to an equal-area map and the sizes come out right.',
    ],
    tags: [
      { label: 'Why Mercator?', text: 'Gerardus Mercator drew his famous map in 1569 for sailors. On it a line of constant compass direction is a straight line, which makes a course easy to plot. To do that he had to stretch the map more and more towards the poles.' },
    ],
  },
  {
    id: 'route',
    kicker: 'Look three',
    title: 'The shortest way',
    paras: [
      'The shortest way between two places on a globe is a great circle, the line you get by pulling a string tight. On most flat maps it looks like a curve. A flight from London to New York bows up towards Greenland on a Mercator map, and it is still the shortest way.',
      'The straight line on a Mercator map is a different route: one with a constant compass bearing. It is easier to steer, but it is longer. Pick two cities to compare the two routes. Both are drawn on the globe as well.',
    ],
    tags: [
      { label: 'In real life', text: 'Real flights do not follow the perfect great circle. Wind, weather and air traffic control change the route. The distances here are the ideal ones, for a ball with a radius of 6,371 km.' },
    ],
  },
];

export const takeaways = [
  'A ball cannot be flattened without stretching or tearing it, so every flat world map distorts something.',
  'A projection is a rule for making the flat copy. Each one keeps some things true and gives up others.',
  'Mercator (1569) keeps shapes and compass directions. It stretches lengths by 1 divided by the cosine of the latitude, so at 60 degrees north a thing looks twice as wide and four times as big.',
  'Greenland looks about as big as Africa on a Mercator map. Africa is really about 14 times bigger.',
  'The shortest way between two places is a great circle. It looks curved on most flat maps, and the straight line on a Mercator map is longer.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The 1569 date of the Mercator map and its use for plotting compass courses, Gauss and the impossibility of a distortion free flat map, Tissot’s circles, the Equal Earth formula and its 2018 date, Africa at about 30.4 million km² against Greenland at about 2.17 million km² (about 14 times), and London to New York at about 5,570 km each appeared in at least two places. The 1 over cosine rule for Mercator is standard maths and was checked by computing it. The map pictures contain no coastlines: they show only the grid and shapes made for this page, with the Earth treated as a ball of radius 6,371 km.';

export const sources = [
  { label: 'Wikipedia: map projection', url: 'https://en.wikipedia.org/wiki/Map_projection', for: 'Why a ball cannot be flattened without distortion.' },
  { label: 'Wikipedia: Theorema Egregium', url: 'https://en.wikipedia.org/wiki/Theorema_Egregium', for: 'Gauss and curvature that does not change when bent.' },
  { label: 'Wikipedia: Mercator projection', url: 'https://en.wikipedia.org/wiki/Mercator_projection', for: 'Shape and direction kept, size stretched.' },
  { label: 'Wikipedia: Mercator 1569 world map', url: 'https://en.wikipedia.org/wiki/Mercator_1569_world_map', for: 'The map made for navigation.' },
  { label: 'Esri: Mercator’s 500th birthday', url: 'https://www.esri.com/arcgis-blog/products/product/mapping/mercators-500th-birthday', for: 'Straight lines of constant bearing.' },
  { label: 'Penn State: map projections', url: 'https://courseware.e-education.psu.edu/projection/chapter10.html', for: 'Rhumb lines on the Mercator map.' },
  { label: 'Wikipedia: Tissot’s indicatrix', url: 'https://en.wikipedia.org/wiki/Tissot%27s_indicatrix', for: 'Equal circles to show distortion.' },
  { label: 'GIS Geography: map distortion with Tissot’s indicatrix', url: 'https://gisgeography.com/map-distortion-tissots-indicatrix/', for: 'Circles turn into ovals or change size.' },
  { label: 'Esri ArcUser: Equal Earth', url: 'https://www.esri.com/about/newsroom/arcuser/equal-earth/', for: 'An equal-area map from 2018.' },
  { label: 'John D. Cook: the Equal Earth projection', url: 'https://www.johndcook.com/blog/2018/08/10/equal-earth-projection/', for: 'The formula and its four numbers.' },
  { label: 'WorldAtlas: is Greenland larger than Africa?', url: 'https://www.worldatlas.com/articles/is-greenland-larger-than-africa.html', for: 'Africa is about 14 times bigger.' },
  { label: 'Mental Floss: things the Mercator map gets wrong', url: 'https://www.mentalfloss.com/geography/maps/things-mercator-map-gets-wrong', for: 'Greenland against Africa on Mercator.' },
];
