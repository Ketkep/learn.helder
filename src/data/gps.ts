// Everything the "How GPS finds you" page says, in one place.
// A ground station console and four things to try: rings around satellites, the clock that is never right, how the satellites are spread, and the clocks of Einstein.
// The facts come from the sources. The map is a toy with made up distances and timing noise, and the page says so.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Nobody tells your phone where it is',
  paras: [
    'GPS is a set of satellites that each send out the time. They do not receive anything from your phone. Your phone listens, notes how late each signal arrives, and works out how far away each satellite is, because the signal travels at the speed of light. With several distances it can find the one place that fits. The US Space Force flies 31 satellites for this, at about 20,200 km up. The first one went up in 1978.',
    'Four things to try on a toy map. Draw the rings that a distance gives and see where they cross. Fix a clock that is wrong. See why satellites that bunch together give a worse fix. And see what Einstein has to do with it. The map and the timing noise are made up, and the page says which numbers are real. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'rings',
    kicker: 'Channel one',
    title: 'Rings on a map',
    paras: [
      'A distance to one satellite means you are somewhere on a ring around it. A second distance gives a second ring, and the rings cross in two points. A third ring picks one of the two. On the real Earth you work in three dimensions, so each distance is a sphere, but the idea is the same.',
      'Move yourself on the toy map and add the satellites one at a time. The rings are drawn from the distances only.',
    ],
  },
  {
    id: 'clock',
    kicker: 'Channel two',
    title: 'The clock that is never right',
    paras: [
      'Light travels about 300 metres in a millionth of a second. So a clock that is off by one microsecond moves the fix by 300 metres. The satellites carry atomic clocks. A phone has a cheap quartz clock, which is far less exact, so every distance it measures is too long or too short by the same amount.',
      'That is why the real system needs four satellites. Three give the position and the fourth lets the phone work out its own clock error as well. In this flat toy, three rings do the same job. Slide the fix until the three rings meet in one point.',
    ],
    tags: [{ label: 'Pseudo', text: 'The distances with the clock error in them are called pseudoranges. Strictly the method is pseudo-trilateration, because the receiver solves for its clock error along with its position.' }],
  },
  {
    id: 'spread',
    kicker: 'Channel three',
    title: 'Spread out or bunched up',
    paras: [
      'Every distance is a little uncertain. Two bands of uncertainty cross in a patch, and the patch is small when the bands cross at a right angle, and long and thin when they cross at a shallow angle. So satellites spread across the sky give a better fix than satellites that sit close together.',
      'Slide the angle between two satellites, as seen from where you stand, from 10° to 90°. Past 90° the patch would grow again, so a right angle is the best. The noise of ±5 metres in each distance is made up. The patch and the factor that multiplies the error come from the geometry.',
    ],
    tags: [{ label: 'In a city', text: 'Tall buildings block some satellites and reflect the signals of others. A reflected signal arrives late, so it looks like a longer distance. Reports put city errors at 10 metres or more.' }],
  },
  {
    id: 'einstein',
    kicker: 'Channel four',
    title: 'Einstein’s clocks',
    paras: [
      'Clocks in orbit do not tick at the same rate as clocks on the ground. Gravity is weaker up there, which makes a clock run faster, by about 45 microseconds a day. The satellite also moves fast, which makes its clock run slower, by about 7 microseconds a day. The net is about 38 microseconds a day fast.',
      'Slide the number of days to see what this adds up to if nobody corrected it. The satellite clocks are set to compensate before launch, so the real system does not drift this way.',
    ],
    tags: [{ label: 'Check', text: 'Sources give the uncorrected effect as about 10 to 11 kilometres a day, which is what 38 microseconds of light travel comes to. One source points out that a known clock offset does not stop a receiver from finding its position, so treat the drift as a picture of the size of the effect.' }],
  },
];

export const takeaways = [
  'A satellite sends the time. The phone measures how late the signal arrives and turns that into a distance at the speed of light.',
  'One distance is a ring on a map, two give two crossing points, and three give one. On Earth the rings are spheres.',
  'Light travels about 300 metres in a microsecond, so a small clock error is a big position error. A fourth satellite lets the phone solve for its own clock.',
  'Satellites spread across the sky give a better fix than satellites bunched together.',
  'Satellite clocks run about 38 microseconds a day fast because of gravity and speed, and are corrected for it. Typical phone accuracy in the open is about 5 metres.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. 31 operational satellites, about 20,200 km up, six orbital planes, an orbit of about 12 hours and a signal on 1575.42 MHz, light covering about 300 metres a microsecond, the need for a fourth satellite for the clock, the net of about 38 microseconds a day (45 for gravity and 7 for speed), the 4.9 metre open sky accuracy of a smartphone, and the first launch in 1978 each appeared in at least two places. Sources differ on the date full operation was declared in 1995, so the page gives only the year. They also differ on the uncorrected drift (10 to 11 km a day), which the page says. The accuracy page of gps.gov says it has not been updated since February 2025. The toy map, the timing noise of 5 metres and the clock error in channel two are made up. The 67 millisecond figure is worked out here from 20,200 km and the speed of light, and a signal from a satellite lower in the sky takes longer.';

export const sources = [
  { label: 'GPS.gov: space segment', url: 'https://gps.gov/systems/gps/space', for: 'Number of satellites, altitude and orbital planes.' },
  { label: 'GPS.gov: how accurate is GPS', url: 'https://www.gps.gov/systems/gps/performance/accuracy/', for: 'The 4.9 metre figure for a smartphone in the open.' },
  { label: 'ESA Navipedia: GPS space segment', url: 'https://gssc.esa.int/navipedia/index.php/GPS_Space_Segment', for: 'Orbit period and inclination.' },
  { label: 'Wikipedia: pseudorange', url: 'https://en.wikipedia.org/wiki/Pseudorange', for: 'Receiver clock error and 300 metres per microsecond.' },
  { label: 'SEOS: global positioning through trilateration', url: 'https://www.seos-project.eu/GPS/GPS-c01-p02.html', for: 'Distances, spheres and the fourth satellite.' },
  { label: 'Ohio State: GPS and relativity', url: 'https://www.astronomy.ohio-state.edu/pogge.1/Ast162/Unit5/gps', for: 'The 45, 7 and 38 microseconds a day.' },
  { label: 'Swift Navigation: multipath error', url: 'https://www.swiftnav.com/glossary/what-is-multipath-error-in-gnss', for: 'Reflected signals and city errors.' },
  { label: 'History.com: Navstar 1 launches', url: 'https://www.history.com/this-day-in-history/february-22/navstar-1-first-operational-gps-satellite-launches', for: 'The first satellite in 1978.' },
];
