// Everything the "How a rainbow forms" page says, in one place.
// A rain shower and four things to try: a ray through one drop, the colours, where the bow is in the sky, and the second bow.
// The angles come from the sources, and the sums are plain optics worked out for the page.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Sunlight and a million drops',
  paras: [
    'A rainbow is not a thing in the sky. It is sunlight that has gone into raindrops and come back out again, and you see it only from one place. Each drop is a tiny ball of water. Light enters it, bounces once off the back and leaves. The light that comes back to you is brightest at one angle, about 42 degrees from the point exactly opposite the Sun.',
    'Four things to try. Send a ray through one drop. See why each colour comes out at its own angle. Find where the bow stands in the sky for a high or a low Sun. And add the second bow, which has the colours the other way round. The angles come from the sources and the sums are plain optics. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'drop',
    kicker: 'Drop one',
    title: 'One ray, one drop',
    paras: [
      'Sunlight hits a spherical drop. It bends as it goes in, because light slows down in water. It reflects off the back of the drop, and it bends again as it comes out. The total turn depends on where the ray hits. A ray through the middle goes straight back. A ray near the edge turns the least possible amount, and many rays crowd together there.',
      'Slide where the ray hits. The curve shows the turn. The turn is smallest at about 138 degrees, and the light piles up near there. That is why the bow has a fixed angle. 180 minus 138 is about 42 degrees.',
    ],
  },
  {
    id: 'colours',
    kicker: 'Drop two',
    title: 'Each colour its own angle',
    paras: [
      'Water bends violet light a little more than red light. So the pile of light for each colour sits at a slightly different angle. Red comes out at about 42.5 degrees from the point opposite the Sun and violet at about 40.5 degrees. Violet is therefore on the inside of the bow and red on the outside.',
      'Slide the wavelength of the light. The page works out how much water bends it, and where its bow would stand.',
    ],
  },
  {
    id: 'sky',
    kicker: 'Drop three',
    title: 'Where to look',
    paras: [
      'The bow is a circle round the point opposite the Sun, which is where the shadow of your head falls. The Sun is behind you. When the Sun is low, that point is near the horizon, and you see a big arc. When the Sun is higher, the point is lower below the horizon, and only the top of the arc is above it.',
      'Slide the height of the Sun. When the Sun is higher than about 42 degrees, the bow is below the horizon and you cannot see it from the ground. The bands are drawn wider than they are, so that you can see the colours.',
    ],
  },
  {
    id: 'second',
    kicker: 'Drop four',
    title: 'The second bow',
    paras: [
      'Sometimes there is a fainter bow outside the first, at about 51 degrees. Its light bounced twice inside the drops. The second bounce flips the colours, so red is on the inside. The strip between the two bows is darker. It is called Alexander’s dark band.',
      'Switch between one bounce and two. See the path of the ray in the drop and the angle of the bow.',
    ],
    tags: [{ label: 'Never look at the Sun', text: 'A rainbow is seen with your back to the Sun. Do not look at the Sun to find one. Looking straight at it can hurt your eyes.' }],
  },
];

export const takeaways = [
  'A rainbow is sunlight that enters raindrops, reflects once off the back and leaves. You see it only with the Sun behind you.',
  'The light piles up where the turn is smallest, which gives a bow about 42 degrees from the point opposite the Sun.',
  'Red is bent least and violet most, so red is on the outside of the bow and violet on the inside.',
  'When the Sun is higher than about 42 degrees, the bow is below the horizon and cannot be seen from the ground.',
  'The second bow is at about 51 degrees, from two bounces, with the colours the other way round and a dark band between the bows.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Rainbows as full circles at about 42 degrees from the antisolar point, one reflection inside the drop with red on the outside and violet on the inside, the minimum deviation of about 137.6 degrees for red and 139.4 degrees for violet, the second bow at about 51 degrees from two internal reflections with the colours reversed and a darker band (Alexander’s band) between the bows, and the Sun behind the viewer each appeared in at least two places. The fitted formula for the refractive index of water (about 1.330 for red and 1.343 for violet) also appeared in a source. The page worked out the angles itself from Snell’s law and they agree: red at 42.5 degrees and violet at 40.6 degrees for the first bow, and 50.2 to 53.6 degrees for the second. The statement that the whole bow is below the horizon when the Sun is higher than about 42 degrees is the page’s own reasoning from the geometry and no source stated it. Sources differ on the date of Alexander of Aphrodisias, so the page gives none. The bands in the sky picture are drawn wider than they are.';

export const sources = [
  { label: 'National Weather Service: rainbows', url: 'https://www.weather.gov/fgz/Rainbow', for: 'How a rainbow forms.' },
  { label: 'MeteoSwiss: the rainbow', url: 'https://www.meteoswiss.admin.ch/weather/weather-and-climate-from-a-to-z/rainbow.html', for: 'The angle and the colours.' },
  { label: 'University of St Andrews: rainbow', url: 'https://www.st-andrews.ac.uk/~bds2/optics/rainbow', for: 'Minimum deviation for each colour.' },
  { label: 'Harvard Chandra: rainbow guide', url: 'https://www.chandra.harvard.edu/edu/stop/rainbow_guide.pdf', for: 'Light through a raindrop.' },
  { label: 'Scientific American: why rainbows are curved', url: 'https://www.scientificamerican.com/article/why-are-rainbows-curved-i', for: 'The circle and the order of colours.' },
  { label: 'Atmospheric Optics: the second bow', url: 'https://atoptics.co.uk/rainbows/ord2form.htm', for: 'Two reflections and the second bow.' },
  { label: 'UNSW: dispersion, rainbows and Alexander’s dark band', url: 'https://animations.physics.unsw.edu.au/jw/light/chromatic_dispersion_rainbows_Alexanders_dark_band.htm', for: 'Colours and the dark band.' },
  { label: 'Plus Maths: the maths behind the rainbow', url: 'https://plus.maths.org/rainbows', for: 'Snell’s law and the angle.' },
];
