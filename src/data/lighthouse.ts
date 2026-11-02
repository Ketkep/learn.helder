// Everything the "How a lighthouse works" page says, in one place.
// A tower with three rooms and one thing to try in each: how far the light reaches, how a ring lens turns a lamp into a beam, and
// how a pattern of flashes names a light. The range formula, the history and the pattern names come from the sources.
// The lens is a toy model and the patterns are examples, not real lighthouses. Nothing here is advice for sailing.

export interface Room {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A tower that stands still and speaks',
  paras: [
    'A lighthouse is a tall tower with a strong lamp. It tells a sailor at night where the coast is and, by the way it flashes, which light this is. Each room of the tower on this page has one thing to try.',
    'On the ground floor, see how far the light reaches. In the middle room, cut a lens into rings. In the lamp room, learn to read a pattern of flashes. The numbers for the range come from the sources. The lens is a toy model and the patterns are examples. This is about how a light works, not a guide to sailing. Without a script each room shows one picture or table.',
  ],
};

export const rooms: Room[] = [
  {
    id: 'range',
    kicker: 'Ground floor',
    title: 'How far the light goes',
    paras: [
      'The sea curves, so there is a limit to how far you can see a light, however bright it is. The higher the lamp and the higher your eye, the farther away the horizon. Sailors use a rule of thumb: the range in nautical miles is 2.08 times the square root of the height of the light in metres, plus the same for the height of your eye. A nautical mile is 1.852 kilometres.',
      'There is a second limit. The lamp can only be seen as far as its light carries through the air, and haze and fog shorten that. The range you can use is the smaller of the two. Move the sliders and pick the weather. The lamp ranges for the weather are made up for this page, and real ones depend on the lamp. The rule gives a theoretical limit, and bending of light in the air changes it a little.',
    ],
    tags: [
      { label: 'Quick sum', text: 'A light 36 metres up, seen from an eye 4 metres up, gives 2.08 × (6 + 2) = about 17 nautical miles, or 31 kilometres.' },
    ],
  },
  {
    id: 'lens',
    kicker: 'First floor',
    title: 'How a lamp becomes a beam',
    paras: [
      'A lamp sends light in every direction, and most of it would be lost over the sea. A lens bends the light into one beam. A big round lens would need a huge block of glass. The glass in the middle does not help much, because the bending happens at the surfaces.',
      'Augustin Fresnel solved this by cutting the lens into rings and keeping only the surface of each ring. Move the slider to cut the lens into more rings and see how much glass is left. The numbers are a toy model: a flat-sided lens, glass with an index of 1.5 and rings of equal width. The drawing of the rays is a sketch, not an exact path.',
    ],
    tags: [
      { label: 'History', text: 'Fresnel’s lens was first used in the Cordouan tower in France in 1823. Sources give 23 July or 25 July. Reflectors used before it lost about half the light, and the new lens used about 80 per cent.' },
    ],
  },
  {
    id: 'pattern',
    kicker: 'Lamp room',
    title: 'How a light says who it is',
    paras: [
      'At night one light looks much like another. So each light has its own pattern. On a chart it is written as a short code. Fl means flashing, with the light on for less time than it is dark. Oc means occulting, where the light is on for longer than it is dark. Iso means isophase, with light and dark of equal length. A number in brackets is the size of a group of flashes, and the last number is the time the whole pattern takes.',
      'Pick a pattern to see it as a strip of 30 seconds and watch the lamp. Then try to name a light from its strip. These patterns are examples. A real lighthouse has its own, and the chart is where to look it up.',
    ],
    tags: [
      { label: 'Old tower', text: 'The Pharos of Alexandria, finished around 280 BCE, burned a fire at night. Its height is an estimate, between 100 and 140 metres. The name Pharos became the word for a lighthouse in several languages.' },
    ],
  },
];

export const takeaways = [
  'The sea curves, so the range of a light is limited by the height of the lamp and of your eye. The range in nautical miles is 2.08 times the sum of the two square roots of the heights in metres.',
  'You can use the smaller of two ranges: the one the curve allows and the one the lamp reaches through the air.',
  'A Fresnel lens keeps the curved surfaces of a thick lens and leaves out the glass in between. It is lighter and uses more of the lamp’s light.',
  'A pattern of flashes names a light. Fl is flashing, Oc is occulting and Iso is isophase, and brackets give the size of a group.',
  'These are ideas, not instructions for sailing. A real light is looked up on a current chart.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The range rule with the constant 2.08, the nominal, geographic and luminous range and the fact that the smaller limit counts appeared in more than one place, and sources use slightly different constants such as 2.04 or 2.10, so the page gives 2.08 as a rule of thumb. Fresnel’s lens, its first use at Cordouan in 1823 and the share of light used appeared in several places, and the exact day differs, 23 or 25 July, so both are given, and an earlier date of 1819 for the invention is left out. The light patterns and their chart names appeared in several places, and sources differ on where a quick flash starts, so quick lights are left out. The height of the Pharos is an estimate of 100 to 140 metres, and a mirror in it was not confirmed, so it is left out. The glass shares for the lens are computed on the page with a simple model and are a toy. The lamp ranges for haze and fog are made up. The patterns are examples and not real lighthouses. Nothing here is advice for sailing.';

export const sources = [
  { label: 'Boatnews: the range of lighthouses at sea', url: 'https://www.boatnews.com/story/48559/the-range-of-lighthouses-at-sea-understanding-and-calculating-distances', for: 'The range formula and the kinds of range.' },
  { label: 'Lighthouse Digest: how far can you see a lighthouse', url: 'https://lighthousedigest.com/Digest/StoryPage.cfm?StoryKey=4119', for: 'Distance to the horizon.' },
  { label: 'Sailing Issues: lights and buoys', url: 'https://sailingissues.com/navcourse9.html', for: 'Geographic and nominal range.' },
  { label: 'Firgelli: floating lighthouse light range', url: 'https://www.firgelliauto.com/blogs/mechanisms/floating-lighthouse', for: 'A worked range sum.' },
  { label: 'US National Park Service: the Fresnel lens', url: 'https://www.nps.gov/caha/learn/historyculture/fresnellens.htm', for: 'How the lens works and when it came.' },
  { label: 'Cordouan lighthouse (French ministry of culture): Fresnel’s lens', url: 'https://cordouan.culture.gouv.fr/en/fresnels-lens', for: 'The first lens in service.' },
  { label: 'Wikipedia: Cordouan Lighthouse', url: 'https://en.wikipedia.org/wiki/Cordouan_Lighthouse', for: 'The date of first use.' },
  { label: 'Boating NZ: the Fresnel lens', url: 'https://www.boatingnz.co.nz/2019/10/leading-light-the-fresnel-lens/', for: 'Rings of glass and the share of light used.' },
  { label: 'Wikipedia: light characteristic', url: 'https://en.wikipedia.org/wiki/Light_characteristic', for: 'Fixed, flashing, occulting and isophase lights.' },
  { label: 'Day Skipper Theory: light characteristics', url: 'https://www.dayskippertheory.co.uk/learn/visual-aids/light-characteristics', for: 'Reading the chart code.' },
  { label: 'Wikipedia: Lighthouse of Alexandria', url: 'https://en.wikipedia.org/wiki/Lighthouse_of_Alexandria', for: 'The date and the height estimate.' },
  { label: 'Britannica: Lighthouse of Alexandria', url: 'https://www.britannica.com/topic/lighthouse-of-Alexandria', for: 'The Pharos.' },
];
