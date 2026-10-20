// Everything the "How a camera makes a picture" page says, in one place.
// A dark room and four things to try: a pinhole, the f-number, the exposure, and the pixels.
// The toy scene and the pinhole box are made up. The facts come from the sources.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A dark box with a hole',
  paras: [
    'A camera is a box that keeps out all light except what comes through one opening. The light from a scene falls on the back of the box and makes a picture there. A film or a sensor records it. Everything else in a camera is about controlling how much light comes in, for how long, and how sharp the picture is.',
    'Four things to try. Make a picture with a plain pinhole and no lens. Open and close the aperture and see the light and the blur change. Balance the aperture, the shutter time and the ISO to get the right amount of light. And see how a picture is a grid of numbers. The scene and the box are toys, and the page works out the sums itself. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'pinhole',
    kicker: 'Shot one',
    title: 'A hole and no lens',
    paras: [
      'A box with a tiny hole makes a picture on its back wall. The picture is upside down, because rays from the top of the scene cross at the hole and land at the bottom. A smaller hole gives a sharper but dimmer picture. A bigger hole gives a brighter but blurrier one.',
      'Slide the size of the hole. The brightness goes with the area of the hole. The blur is the width of the hole plus the spreading of light at a very small hole. So there is a best size in between. The page works this out for a box 10 centimetres deep. It is a toy sum.',
    ],
  },
  {
    id: 'aperture',
    kicker: 'Shot two',
    title: 'The f-number',
    paras: [
      'A lens camera has an opening that can change size, called the aperture. The f-number is the focal length of the lens divided by the width of the opening. A small f-number means a wide opening and more light. Each full step in the series 1.4, 2, 2.8, 4, 5.6, 8, 11, 16 halves the light, because the area of the opening shrinks to half.',
      'Pick an f-number. A wide opening also makes the blur behind the subject bigger, which is a shallower depth of field. The size of the blurred lights in the picture here is a toy.',
    ],
  },
  {
    id: 'exposure',
    kicker: 'Shot three',
    title: 'Balance the light',
    paras: [
      'Three things set how bright a picture is. The aperture sets how much light comes in. The shutter time sets for how long. The ISO sets how much the signal from the sensor is boosted. Doubling any one of them makes the picture twice as bright, which is a stop. You can trade one for another, but each has a price. A slow shutter smears things that move. A high ISO adds noise.',
      'Set the three. The picture is dark or bright against what this toy scene needs, which is f/4 at 1/250 of a second and ISO 100. A ball is moving, so watch the smear.',
    ],
  },
  {
    id: 'pixels',
    kicker: 'Shot four',
    title: 'A picture is numbers',
    paras: [
      'A digital sensor measures the light at a grid of points. Each point is a pixel, and a colour is stored as three numbers, for red, green and blue, each from 0 to 255. A picture is a long list of such numbers.',
      'Slide the number of pixels along each side. With a few pixels the picture is blocks. With more, it fills in. The page also works out the size of the list if every pixel is kept as three bytes.',
    ],
  },
];

export const takeaways = [
  'A camera is a dark box with an opening. Light from the scene makes a picture on the back wall, upside down.',
  'A smaller pinhole is sharper but dimmer. There is a best size, because a very small hole also spreads the light.',
  'The f-number is the focal length divided by the opening. Each full step in the series 1.4, 2, 2.8, 4, 5.6, 8, 11, 16 halves the light.',
  'Aperture, shutter time and ISO each double the brightness for one stop. A slow shutter smears movement and a high ISO adds noise.',
  'A digital picture is a grid of pixels, and each pixel is three numbers for red, green and blue.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The pinhole camera as a light tight box with a small hole and no lens, an upside down image, a smaller hole giving a sharper but dimmer image, the f-number as focal length divided by the width of the opening, each full stop halving the light with the series 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, a wider aperture giving a shallower depth of field, a faster shutter freezing motion, and a higher ISO adding noise each appeared in at least two places. Sources did not explain the sensor in detail, so the pixel panel keeps to the plain idea of a grid of colour numbers. The sum for the best pinhole size (a hole width plus the spreading of light, for a box 10 centimetres deep and green light) is the page’s own simple optics. The toy scene that needs f/4 at 1/250 of a second and ISO 100, the size of the blurred lights and the smear of the ball are made up. Real cameras and real scenes differ.';

export const sources = [
  { label: 'UC Berkeley: building a pinhole camera', url: 'https://inst.eecs.berkeley.edu/~cs194-26/fa17/upload/files/proj2/cs194-26-afm/', for: 'Hole size, sharpness and brightness.' },
  { label: 'UC Berkeley: camera obscura', url: 'https://inst.eecs.berkeley.edu/~cs194-26/fa17/upload/files/proj2/cs194-26-aal/', for: 'The pinhole camera and the upside down image.' },
  { label: 'Unacademy: the pinhole camera', url: 'https://unacademy.com/content/pinhole-camera/', for: 'How a pinhole camera works.' },
  { label: 'Wikipedia: f-number', url: 'https://en.wikipedia.org/wiki/F-number', for: 'The definition and the stop series.' },
  { label: 'University of Arizona: the f stops here', url: 'https://wp.optics.arizona.edu/jpalmer/wp-content/uploads/sites/65/2018/11/The-f-stops-here.pdf', for: 'Why each stop halves the light.' },
  { label: 'Stanford: variables that affect exposure', url: 'https://graphics.stanford.edu/courses/cs178/applets/exposure.html', for: 'Aperture, shutter and ISO.' },
  { label: 'MIT: photography', url: 'https://people.csail.mit.edu/fredo/Photography_GSA.pdf', for: 'Exposure, depth of field and noise.' },
  { label: 'GetAdapt: camera functions and settings', url: 'https://getadapt.co.uk/revision-content/gcse/photography/eduqas', for: 'Shutter speed, aperture, ISO and depth of field.' },
];
