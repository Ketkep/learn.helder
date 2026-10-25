// Everything the "How a compass finds north" page says, in one place.
// A navigator's chart table with four things to try: the field of the Earth and the dip of the needle, the two norths, the wandering pole, and a magnet that fools the needle.
// The formulas are standard. The strength of the magnet in the last part is made up and marked. The sources give the history and the pole speeds.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A needle that feels the Earth',
  paras: [
    'A compass needle is a small magnet that is free to turn. The Earth acts like a giant magnet, and the needle lines up with its field. The field comes from the movement of liquid iron in the Earth’s outer core, a process called the geodynamo. The compass has been known in China for a very long time. At first it was used to arrange buildings and for divination, and it was used for travel at sea from about the 10th century.',
    'Four things to try. See how the field of the Earth dips as you go north. See why the compass north and the true north are not the same. Watch the north magnetic pole wander. And see how a magnet or a piece of iron near a compass fools it. The strength of the magnet in the last part is made up, and the page says so. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'dip',
    kicker: 'Chart one',
    title: 'The field dips',
    paras: [
      'To a good approximation the Earth’s field is that of a bar magnet near the middle. Its field lines leave one pole and enter the other, and at the surface they are not level. At the equator they run flat along the ground. Near the poles they point nearly straight down or up. The angle from the level is called the dip, and for a bar magnet the tangent of the dip is twice the tangent of the latitude.',
      'Slide the latitude. The needle shows the direction of the field. A compass keeps its needle level, so only the level part of the pull turns it, and that part gets weaker towards the poles. At 60 degrees it is half of what it is at the equator.',
    ],
  },
  {
    id: 'norths',
    kicker: 'Chart two',
    title: 'Two norths',
    paras: [
      'True north points to the geographic North Pole, where the Earth’s axis of spin comes out. A compass points to magnetic north, which is somewhere else. The angle between the two is called the declination, and it is different in different places. It is larger at high latitudes and smaller near the equator. Maps and charts print the declination of the place.',
      'Slide the declination and a distance to walk. If you follow the compass without correcting, you end up off to the side by the distance times the tangent of the angle.',
    ],
  },
  {
    id: 'wander',
    kicker: 'Chart three',
    title: 'The wandering pole',
    paras: [
      'The magnetic pole is not fixed. The north magnetic pole has been moving from Canada towards Siberia. Around the year 2000 it moved about 10 kilometres a year. Over the 20 years before 2020 it averaged about 55 kilometres a year. The model of 2020 forecast about 40 kilometres a year, slowing down. NOAA and the British Geological Survey keep a World Magnetic Model for navigation and update it, in 2019 ahead of schedule because of how fast the pole was moving.',
      'Pick a speed and slide the number of years. The pole does not keep a steady speed, so the distance is only a picture of how fast it can go.',
    ],
  },
  {
    id: 'fooled',
    kicker: 'Chart four',
    title: 'Fooling the needle',
    paras: [
      'Anything magnetic or iron near a compass pulls on the needle too, and the error is called deviation. Ships and aircraft have it from their own iron and electronics. It depends on where the compass is and not on the place on Earth, so it is a separate error from the declination.',
      'Slide a magnet closer to the compass. A magnet’s field falls with the cube of the distance, so the pull grows fast as it gets near. In this toy the magnet pulls as hard as the Earth does at 20 centimetres. That strength is made up.',
    ],
  },
];

export const takeaways = [
  'The Earth’s field comes from moving liquid iron in the outer core. A compass needle lines up with it.',
  'For a bar magnet model, the field dips by an angle whose tangent is twice the tangent of the latitude. It is level at the equator and nearly vertical near the poles.',
  'The declination is the angle between the compass north and the true north. It is different in different places and it changes over time.',
  'The north magnetic pole has been drifting towards Siberia, at about 55 kilometres a year on average over the 20 years before 2020.',
  'Nearby iron and magnets turn the needle too, which is called deviation. A magnet’s pull falls with the cube of the distance.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The field made by liquid iron in the outer core, the dip given by the tangent of the dip as twice the tangent of the latitude for a centred dipole, declination as the angle between true and magnetic north that is larger at high latitudes, deviation as the local error from nearby metal that is separate from declination, the speed of the north magnetic pole at about 10 kilometres a year around 2000 and about 55 kilometres a year over the 20 years before 2020 with about 40 forecast, and the World Magnetic Model of NOAA and the British Geological Survey each appeared in at least two places. Sources differ on the date of the first compass use at sea (about the 10th or 11th century), on the early use of the compass in China (from at least the first century for divination) and on the sign rule for declination, so the page does not give a rule for adding or taking away. The recent speed is also given as 50 kilometres a year in some reports. The model of the Earth as a centred bar magnet is a simplification, since the real field is more complicated. The strength of the magnet in chart four is made up, and so is its position.';

export const sources = [
  { label: 'University of Washington: Earth’s magnetic field', url: 'https://courses.washington.edu/ess502/Lect2_EarthMagneticField.pdf', for: 'The dipole and the dip formula.' },
  { label: 'Wikipedia: magnetic dip', url: 'https://wikipedia.com/wiki/Magnetic_dip', for: 'What dip is, and who first measured it.' },
  { label: 'Wikipedia: magnetic declination', url: 'https://en.wikipedia.org/wiki/Magnetic_declination', for: 'True north and magnetic north.' },
  { label: 'Wikipedia: magnetic deviation', url: 'https://en.wikipedia.org/wiki/Magnetic_deviation', for: 'The error from nearby metal.' },
  { label: 'Understanding Earth: the geodynamo', url: 'https://digfir-published.macmillanusa.com/understandingearth7e/understandingearth7e_ch14_6.html', for: 'Where the field comes from.' },
  { label: 'EBSCO: the origins of Earth’s magnetic field', url: 'https://ebsco.com/research-starters/science/earths-magnetic-field-origins', for: 'The geodynamo and reversals.' },
  { label: 'arXiv: fluid dynamics of Earth’s core', url: 'https://arxiv.org/pdf/1905.10416', for: 'Early compasses in China.' },
  { label: 'Sci.News: the north magnetic pole keeps drifting', url: 'https://www.sci.news/othersciences/geophysics/world-magnetic-model-07962.html', for: 'The speed of the pole and the 2020 model.' },
  { label: 'Live Science: the magnetic north pole and the model update', url: 'https://www.livescience.com/64685-magnetic-earth-model-updated.html', for: 'The model that was updated early.' },
];
