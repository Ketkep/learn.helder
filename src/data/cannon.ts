// Everything the "Newton's cannonball" page says, in one place.
// A cannon on a very high mountain fires sideways over a round planet with no air. Three panels try it.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A cannon on a mountain',
  paras: [
    'Why does the Moon not fall down? Isaac Newton answered with a picture in his head. Put a cannon on top of a very high mountain on a round Earth, with no air to slow anything down, and fire a ball sideways. The faster the shot, the farther it lands. Make it fast enough and the ground curves away as fast as the ball falls, and the ball never lands. It is in orbit.',
    'An orbit is a fall that keeps missing the ground. Three panels let you try it. Without a script, each panel shows one picture and a table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'fire',
    kicker: 'Fire one',
    title: 'Fire the cannon',
    paras: [
      'Choose a planet, the height of the mountain and the speed of the shot. The picture shows where the ball goes. A slow ball falls to the ground. A faster one lands farther away. At about 7.9 kilometres a second on Earth the ball goes round the planet. Faster still and it flies out in a long oval, and above about 11.2 kilometres a second it leaves for good.',
      'The mountain is much higher than any real one, so the shot has time to travel before it lands. The picture is not to scale for the cannon, which is drawn big so you can see it.',
    ],
    tags: [{ label: 'No air', text: 'Real shots would be slowed by the air, and a ball at these speeds would burn up. Rockets climb above most of the air before they speed up sideways. This panel leaves air out so you can see the idea.' }],
  },
  {
    id: 'second',
    kicker: 'Fire two',
    title: 'What happens in one second',
    paras: [
      'In one second a falling thing drops about 4.9 metres. Now picture the ball flying sideways. In that second the ground curves away below it too, because the Earth is round. At about 8 kilometres sideways the ground has curved away by about 4.9 metres.',
      'So a ball that flies 8 kilometres every second falls just as fast as the ground drops away. It keeps falling without getting any closer. Slide the speed and compare the two numbers.',
    ],
    tags: [{ label: 'Weightless', text: 'Astronauts in orbit are not out of reach of gravity. Gravity is still about 88 per cent as strong at the height of the space station. They float because they are falling around the Earth together with their station.' }],
  },
  {
    id: 'heights',
    kicker: 'Fire three',
    title: 'Higher orbits are slower',
    paras: [
      'The pull of gravity gets weaker with distance, so a higher orbit needs less speed, and it takes much longer to go round. The space station, about 420 kilometres up, goes round in about 93 minutes at about 7.7 kilometres a second. A satellite 35,786 kilometres up takes about a day, so it stays above the same spot. The Moon is about 384,000 kilometres away and takes about a month.',
      'Pick a height to see the speed and the time for one lap. The numbers come from one formula.',
    ],
  },
];

export const takeaways = [
  'An orbit is a fall that keeps missing the ground. Newton showed it by picturing a cannon on a mountain.',
  'A faster shot lands farther away. At about 7.9 km/s on Earth, with no air, the ground curves away as fast as the ball falls, so the ball goes round the planet.',
  'Between about 7.9 and 11.2 km/s the ball goes round in an oval. Above about 11.2 km/s it escapes the Earth.',
  'In one second a thing falls about 4.9 metres, and the ground curves away 4.9 metres over about 8 kilometres.',
  'Higher orbits are slower and take longer: about 93 minutes for the space station, about a day at 35,786 km and about a month for the Moon.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Newton’s cannonball as a way to show that an orbit is a fall, the shots that fall, orbit in a circle or an oval, or escape, and an orbital speed near 7.7 km/s at the height of the space station with a lap of about 92 to 93 minutes each appeared in at least two places. The surface speeds of about 7.9 km/s and 11.2 km/s, the heights of the geostationary orbit and the Moon and the planet numbers are standard values that were computed with the formulas on this page, and the results agree with the figures in the sources. One search result described the thought experiment as appearing in a 1728 work, so the page does not give a year. The shots are worked out by stepping the motion in small time steps, with no air.';

export const sources = [
  { label: 'Wikipedia: Newton’s cannonball', url: 'https://en.wikipedia.org/wiki/Newton%27s_cannonball', for: 'The thought experiment and its shots.' },
  { label: 'University of Nevada, Las Vegas: Newton’s cannonball', url: 'https://www.physics.unlv.edu/~jeffery/astro/orbit/savedir/newton_cannonball.html', for: 'Being in orbit is falling all the time.' },
  { label: 'College of Wooster: Newton’s cannon', url: 'https://woosterphysicists.scotblogs.wooster.edu/?p=1305', for: 'The cannon on a mountain.' },
  { label: 'Science ABC: what is orbital velocity?', url: 'https://scienceabc.com/nature/universe/what-is-orbital-velocity', for: 'Orbital speed and height.' },
  { label: 'Michigan State University: Newton’s gravity', url: 'https://qstbb.pa.msu.edu/storage/ISP220_fall2020/QS&BB2020/cosmology/J-100_Cosmology_Two_2_g_S3.html', for: 'The cannonball and orbits.' },
  { label: 'Michigan State University: orbits project (PDF)', url: 'https://qstbb.pa.msu.edu/storage/ISP220_stuff/Keys/6_project_09232021_1.pdf.pdf', for: 'Speed and lap time at the height of the space station.' },
  { label: 'Orbital Radar: International Space Station', url: 'https://orbitalradar.com/satellites/international-space-station', for: 'About 7.66 km/s and 92 minutes.' },
  { label: 'ISS Info: why the orbit, altitude and speed change', url: 'https://issinfo.net/blog/tracking-the-iss-why-its-orbit-altitude-and-speed-constantly-change', for: 'The height of the station is not fixed.' },
];
