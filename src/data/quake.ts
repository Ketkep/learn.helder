// Everything the "How earthquakes are found" page says, in one place.
// A wall of seismograph strips and a map table, with four things to try: the gap between two waves, three circles, the size scale, and the inside of the Earth.
// The wave speeds and the maps are a toy. The real facts come from the sources.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A wiggle on a strip of paper',
  paras: [
    'When rock breaks deep in the ground, waves spread out through the Earth. A seismograph is a machine that draws the shaking of the ground as a line. Two kinds of wave reach it one after the other. The fast one is the P wave and the slower one is the S wave. The gap between them tells how far away the quake was.',
    'Four things to try. Read the gap between the waves. Draw circles from three stations and find the epicentre. See why a quake one step bigger is far more than one step more. And see which waves can cross the Earth. The wave speeds and the maps are a toy model. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'gap',
    kicker: 'Strip one',
    title: 'Two waves, one gap',
    paras: [
      'A P wave is a push and pull wave, like sound. An S wave shakes the ground from side to side. P waves travel faster. Both start at the same moment at the quake, so the farther away you are, the longer the S wave takes to catch up with the first one on the strip, which means the gap grows with distance.',
      'Slide the distance of the station from the quake. In this toy the P wave goes 6 kilometres a second and the S wave a little over 3 kilometres a second. That makes a gap of 1 second for about every 8 kilometres, which is a rule of thumb that is often taught.',
    ],
  },
  {
    id: 'circles',
    kicker: 'Strip two',
    title: 'Three circles meet',
    paras: [
      'One station knows only how far the quake was, not in which direction. So its answer is a circle on the map. A second station gives a second circle, and the circles cross in two places. A third station chooses one. The epicentre is where all three circles meet. The epicentre is the spot on the surface above the place where the rock broke.',
      'The table gives the gap at each station. Multiply it by 8 to get the distance in kilometres, then set the radius of each circle. When all three meet, the epicentre shows up.',
    ],
  },
  {
    id: 'size',
    kicker: 'Strip three',
    title: 'One step is a lot',
    paras: [
      'Magnitude is a scale of multiplying. Each whole number up means the shaking drawn on the strip is 10 times taller. The energy that the quake releases goes up by about 32 times for each whole number, so a quake of magnitude 7 releases about a thousand times the energy of one of magnitude 5.',
      'Slide the magnitude and compare it with a quake of magnitude 5. Both the height on the strip and the energy are shown.',
    ],
    tags: [{ label: 'Not the same as damage', text: 'Magnitude says how big the quake was. How much shaking you feel, and what it damages, depends on the distance, the ground and the buildings. This page is about the maths, not about safety.' }],
  },
  {
    id: 'inside',
    kicker: 'Strip four',
    title: 'The waves that cannot cross',
    paras: [
      'Seismologists found that S waves never arrive on the far side of the Earth. S waves cannot travel through a liquid. So there must be a liquid layer in the middle, which is the outer core. P waves bend as they pass through it, which leaves a ring where neither wave arrives clearly, the shadow zone.',
      'Slide the station round the Earth, measured in degrees from the quake. In 1936 Inge Lehmann explained faint P waves inside the shadow zone by a solid inner core. The page draws the zones, not the bent paths of the waves.',
    ],
  },
];

export const takeaways = [
  'A quake sends out fast P waves and slower S waves. The gap between their arrivals grows with distance, by about 1 second for every 8 kilometres in this toy.',
  'One station gives a distance, which is a circle. Three stations give three circles that meet at the epicentre.',
  'Magnitude is a multiplying scale. One step up is 10 times the height on the strip and about 32 times the energy.',
  'S waves cannot cross a liquid, and that is how we know the outer core is liquid.',
  'The speeds, the maps and the stations on this page are a toy model, and the page does not predict quakes.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Three stations needed to place an epicentre, the gap between the S and the P wave as the measure of distance, the rule of thumb of about 8 kilometres for each second of gap, a tenfold change in wave height and about 31 to 32 times the energy for each whole number of magnitude, S waves not crossing a liquid, the P wave shadow zone between about 103 and 142 degrees, and Inge Lehmann’s 1936 solid inner core each appeared in at least two places. Sources give slightly different distances for the same gap, so the page calls the 8 kilometres a rule of thumb. The wave speeds of 6.0 and about 3.4 kilometres a second, the map, the three stations and the circles are made up for the toy and chosen so the rule gives exactly 8. The drawing of the layers is not to scale. The page does not predict quakes and gives no advice on safety.';

export const sources = [
  { label: 'NOAA PMEL: locating an earthquake', url: 'https://nctr.pmel.noaa.gov/education/ITTI/seismic/EQ_location_USGS.pdf', for: 'The gap between the waves and the three circles.' },
  { label: 'LACCD: how earthquakes are located', url: 'https://ilearn.laccd.edu/courses/141778/modules/items/6627510', for: 'Travel times and the epicentre.' },
  { label: 'University of Bergen: earthquake location', url: 'https://web.geo.uib.no/eworkshop/SEIS-SCHOOL/ariadna/earthquakelocation2.html', for: 'Finding the distance from the gap.' },
  { label: 'Maryland Geological Survey: locating earthquakes', url: 'https://mgs.md.gov/seismic/education/no6.html', for: 'Distance and the gap in minutes.' },
  { label: 'Oregon State: earthquake location', url: 'https://ceetep.prod.acquia.cws.oregonstate.edu/sites/ceetep.oregonstate.edu/files/resources/5-earthquake-location.pdf', for: 'Locating a quake with stations.' },
  { label: 'USGS: how much bigger?', url: 'https://earthquake.usgs.gov/education/how_much_bigger.php', for: 'Magnitude, wave height and energy.' },
  { label: 'AMNH: Inge Lehmann', url: 'https://www.amnh.org/learn-teach/curriculum-collections/earth-inside-and-out/inge-lehmann-discoverer-of-the-earth-s-inner-core', for: 'The inner core and the shadow zone.' },
  { label: 'APS News: Inge Lehmann', url: 'https://aps.org/publications/apsnews/202309/history.cfm', for: 'Lehmann’s 1936 paper.' },
];
