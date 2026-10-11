// Everything the "Why the sky is blue" page says, in one place.
// Four windows, each an arch of sky with one thing to move. Every model is a toy made for this page.

export interface Win {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'White light, blue sky',
  paras: [
    'Sunlight looks white, but it is a mix of all the colours of the rainbow. When it passes through the air, the tiny molecules of gas bounce some of it sideways. They bounce blue light far more than red light. So blue light reaches you from every part of the sky, and the sky looks blue.',
    'Four windows look at the idea in four ways. The pictures and numbers come from simple models made for this page, so they show the idea and not an exact sky. Without a script, each window shows one picture and a table.',
  ],
};

export const windows: Win[] = [
  {
    id: 'waves',
    kicker: 'Window one',
    title: 'Short waves scatter more',
    paras: [
      'Light is a wave, and each colour has its own wavelength. Violet has the shortest, about 400 nanometres, and red the longest, about 700. Air molecules are much smaller than any of these waves, and for particles that small the scattering gets weaker very quickly as the wavelength grows: it goes with one divided by the wavelength to the fourth power.',
      'Slide through the colours. The number says how many times more strongly air scatters that colour than it scatters red light.',
    ],
    tags: [{ label: 'Lord Rayleigh', text: 'This kind of scattering is called Rayleigh scattering, after the British physicist Lord Rayleigh, who worked out the fourth power rule in the 1870s.' }],
  },
  {
    id: 'sun',
    kicker: 'Window two',
    title: 'The sun and the sky',
    paras: [
      'When the sun is low, its light has to cross much more air to reach you. Along the way the blue is scattered out of the beam, and what is left is yellow, orange and then red. That is why a low sun is red, and why the sky around it glows.',
      'Slide the sun from straight overhead down to the horizon. The window shows the colour of the sun and of the sky overhead. At the horizon the light crosses about 38 times as much air as straight overhead.',
    ],
    tags: [{ label: 'A toy model', text: 'This window uses three colours instead of the whole spectrum, and it treats the air as one layer. It is good for the idea, not for painting a real sunset. Dust, smoke and clouds change real sunsets a lot.' }],
  },
  {
    id: 'violet',
    kicker: 'Window three',
    title: 'Why not violet?',
    paras: [
      'Violet is scattered even more than blue, so you might expect a violet sky. There are three reasons it is blue. The sun gives out a little less violet than blue, some of the violet is absorbed high in the atmosphere, and our eyes are much less sensitive to violet.',
      'Switch the effects on one at a time. The bars show how the scattered light is shared between the colour bands. The sentence below the bars compares violet and blue.',
    ],
    tags: [{ label: 'Only brightness', text: 'The eye sees colour with three kinds of cell, and this window only counts how bright each band looks. It does not mix colours, so it does not say what colour the sky is. It only shows why violet adds so little.' }],
  },
  {
    id: 'cloud',
    kicker: 'Window four',
    title: 'White clouds',
    paras: [
      'Clouds are made of water drops that are far bigger than air molecules. Drops that big scatter all the colours about equally, so the light from a cloud stays white. A bit of mist or haze, with particles in between, gives a pale blue or grey.',
      'Slide the size of the particle from a gas molecule up to a cloud drop. The swatch shows the colour of the light it scatters.',
    ],
    tags: [{ label: 'Sizes', text: 'A gas molecule is far less than a thousandth of a micrometre across. A cloud drop is about 10 micrometres. The switch from blue to white in this window is a toy curve that goes smoothly between the two.' }],
  },
];

export const takeaways = [
  'Sunlight is a mix of all colours. Air molecules scatter it sideways, and short waves are scattered much more than long ones.',
  'The scattering goes with one over the wavelength to the fourth power, so blue light at 450 nm is scattered about 6 times more than red light at 700 nm.',
  'A low sun is red because its light crosses more air and the blue is scattered out of the beam.',
  'The sky is blue and not violet because the sun gives out less violet, some is absorbed high up, and the eye is much less sensitive to violet.',
  'Cloud drops are much bigger than air molecules and scatter all colours about equally, so clouds look white.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The one over wavelength to the fourth power rule, blue scattered much more than red, the long path of a low sun, the three reasons for blue and not violet, and white clouds from large drops each appeared in at least two places. The ratios on this page (5.9 for blue at 450 nm and 9.4 for violet at 400 nm, both against red at 700 nm) were computed from the rule. A typical optical depth of about 0.10 at 550 nm for the whole atmosphere was found in a research paper through a search result. The colours of the sun and sky, the violet and blue shares and the cloud colours are toy models made for this page, and the sources do not agree on every detail, such as the exact size where Rayleigh scattering ends.';

export const sources = [
  { label: 'Wikipedia: Rayleigh scattering', url: 'https://en.wikipedia.org/wiki/Rayleigh_scattering', for: 'Scattering goes with one over wavelength to the fourth power.' },
  { label: 'The Conversation: why is the sky blue?', url: 'https://theconversation.com/explainer-why-is-the-sky-blue-10821', for: 'The sky and the low sun.' },
  { label: 'SBS: why is the sky blue?', url: 'https://www.sbs.com.au/news/article/explainer-why-is-the-sky-blue/zsezth360', for: 'The same explainer, with the long path at sunset.' },
  { label: 'Physics FAQ: why the sky is blue (UC Riverside)', url: 'https://math.ucr.edu/home/baez/physics/General/BlueSky/blue_sky.html', for: 'Why the sky is not violet.' },
  { label: 'Big Think: why the sky is blue according to science', url: 'https://bigthink.com/starts-with-a-bang/why-the-sky-is-blue-according-to-science/', for: 'Sunlight, scattering and the eye.' },
  { label: 'University of British Columbia: sky colours (PDF)', url: 'https://personal.math.ubc.ca/~cass/courses/m309/sky-colours.pdf', for: 'The colours of the sky.' },
  { label: 'Hong Kong Observatory: colours of clouds', url: 'https://www.hko.gov.hk/en/education/earth-science/optical-phenomena/00349-colours-of-clouds.html', for: 'Why clouds are white.' },
  { label: 'Gizmodo: why are clouds white?', url: 'https://gizmodo.com/why-are-clouds-white-5583751', for: 'Large drops scatter all colours.' },
  { label: 'arXiv: detecting changes in anthropogenic light emissions', url: 'https://arxiv.org/pdf/2405.08279', for: 'A typical air optical depth of about 0.10 at 550 nm.' },
];
