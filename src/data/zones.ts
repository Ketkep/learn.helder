// Everything the "How time zones work" page says, in one place.
// A flat map of the world with the Sun moving over it, and four things to try: the Sun and the clock, clocks round the world, the clock against the Sun, and flying across zones.
// Offsets are standard (winter) time unless a switch says otherwise.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'The Sun is the clock',
  paras: [
    'The Earth turns once in a day, so the Sun is highest in the sky in different places at different moments. If every town set its clock by its own Sun, neighbouring towns would show different times. Time zones fix that: a wide band of the Earth keeps one time.',
    'Four things to try on a flat map of the world. Move the Sun across it. Read the clocks in eight cities at one moment. See how far each city’s clock is from its Sun. And fly across zones, to arrive at a clock time that seems to come before you left. Offsets are for winter time unless a switch says summer. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'sun',
    kicker: 'Map one',
    title: 'Move the Sun',
    paras: [
      'The Earth turns 360 degrees in 24 hours, which is 15 degrees every hour. So the clock should move on by one hour for each 15 degrees of longitude you go east. The zero line runs through Greenwich in England, and time is counted from there.',
      'Slide the time in UTC, the time at Greenwich. The pale band is where it is day. The numbers under the map are the clock hour in each hourly zone. The Sun is highest where the clock reads noon, if the zone matches its longitude.',
    ],
  },
  {
    id: 'clocks',
    kicker: 'Map two',
    title: 'One moment, eight clocks',
    paras: [
      'It is one moment everywhere, but the clocks differ. Pick a time in Amsterdam and read the time in the other cities. Some are on the next day or the day before.',
      'Some places are not a whole hour from UTC. Kolkata is at UTC plus 5:30. The zones follow borders and politics, not only longitude.',
    ],
  },
  {
    id: 'drift',
    kicker: 'Map three',
    title: 'Clock against the Sun',
    paras: [
      'A whole zone shares one clock, so the clock only matches the Sun at one line through the middle. Elsewhere the clock is ahead of the Sun or behind it. The bar shows how many minutes. Switch on summer time and the clock goes one hour further ahead in places that use it.',
      'Look at Amsterdam in winter. Its clock is about 40 minutes ahead of the Sun, and in summer about 100 minutes. Beijing and Perth share a zone, and both clocks run close to the Sun.',
    ],
    tags: [{ label: 'Daylight saving', text: 'In the Netherlands the clock moves one hour forward on the last Sunday in March and back on the last Sunday in October. That is the same rule as most of the European Union.' }],
  },
  {
    id: 'fly',
    kicker: 'Map four',
    title: 'Flying across zones',
    paras: [
      'A plane that flies east goes into zones that are further ahead, and the clock jumps forward. A plane that flies west goes the other way. Fly from Tokyo to Honolulu and you can arrive at a clock time earlier than the time you left, on the same date.',
      'Pick a trip, set the time you leave and how many hours you fly. The page works out the clock at the other end. The flight times are yours to set and are not real timetables.',
    ],
  },
];

export const takeaways = [
  'The Earth turns 15 degrees every hour, so each hourly zone is about 15 degrees of longitude wide.',
  'Time is counted from Greenwich in England, as UTC plus or minus a number of hours.',
  'Zones follow borders as well as longitude. Some are not a whole hour from UTC, such as Kolkata at UTC plus 5:30.',
  'The clock is only right for the Sun along the middle of a zone. In Amsterdam in winter the clock is about 40 minutes ahead of the Sun.',
  'Crossing zones by plane, you can arrive at a clock time that is earlier than the one you left.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The 15 degrees an hour, Greenwich as the starting line, zones that follow borders and do not keep to 15 degrees, a zone at UTC minus 3:30 for Newfoundland, the railway origin of standard time, the 1884 conference at Washington that chose Greenwich, and Dutch time as UTC plus 1 with summer time of UTC plus 2 from the last Sunday in March to the last Sunday in October each appeared in at least two places. Sources differ on whether the 1884 conference adopted the 24 zones, so the page says only that it chose Greenwich. The longitudes of the eight cities and their winter offsets (London 0, Amsterdam plus 1, New York minus 5, Honolulu minus 10, Tokyo plus 9, Perth plus 8, Beijing plus 8, Kolkata plus 5:30) are general knowledge and were not in the search results, and the summer switch applies only to Amsterdam, London and New York. The map is flat, and the day and night band is a simple model. The page does the sums itself.';

export const sources = [
  { label: 'University of Hawaii: time zones lab', url: 'https://www2.hawaii.edu/~dennis/GeoLab_online/location/lab1_time.htm', for: 'Fifteen degrees an hour.' },
  { label: 'GIS Geography: world time zone map', url: 'https://gisgeography.com/world-time-zone-map/', for: 'Zones, offsets and the date line.' },
  { label: 'Wikipedia: time in the Netherlands', url: 'https://en.wikipedia.org/wiki/Time_in_the_Netherlands', for: 'Dutch time and summer time.' },
  { label: 'The Greenwich Meridian: the 1884 conference', url: 'https://www.thegreenwichmeridian.org/tgm/articles.php?article=10', for: 'Why Greenwich became the prime meridian.' },
  { label: 'ETHW: US rails adopt standard time', url: 'https://ethw.org/US_Rails_Adopt_Standard_Time', for: 'The railways and standard time.' },
  { label: 'timeanddate: history of time zones', url: 'https://www.timeanddate.com/time/time-zones-history.html', for: 'How time zones began.' },
  { label: 'Royal Society of Australia: time and the meridian', url: 'https://www.royalsoc.org.au/wp-content/uploads/2025/07/158-1-02Lomb.pdf', for: 'Standard time and the meridian conference.' },
  { label: 'The Collector: railways and standard time in Britain', url: 'https://www.thecollector.com/how-did-railways-standardize-time-in-britain/', for: 'Greenwich Mean Time on the railways.' },
];
