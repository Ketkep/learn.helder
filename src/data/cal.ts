// Everything the "Why ten days went missing" page says, in one place.
// A calendar page in three parts: turn a date from one calendar into the other, see how a small error in the length of the year adds up,
// and see when different places changed over and how many days they left out. The dates come from the sources. Where the sources differ,
// the page says so. The conversions are worked out with the Julian day number.

export interface Part {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Thursday the fourth, then Friday the fifteenth',
  paras: [
    'In 1582, the day after Thursday 4 October was Friday 15 October. Ten days of the calendar never happened, in the lands that followed the pope. The change was made to put the calendar right with the seasons. Other places changed later, and some more than three hundred years later, so for a long time two calendars were in use at once.',
    'Three parts. In the first, turn a date from one calendar into the other. In the second, see how a tiny error in the length of the year adds up. In the third, see when different places changed and how many days they left out. The dates come from the sources, and where they differ the page says so. Without a script each part shows one picture or table.',
  ],
};

export const parts: Part[] = [
  {
    id: 'convert',
    kicker: 'First part',
    title: 'One day, two dates',
    paras: [
      'The Julian calendar, from Roman times, gave every fourth year a leap day. The Gregorian calendar, brought in by Pope Gregory XIII in 1582, keeps that rule but leaves out the leap day in century years that cannot be divided by 400. So 1900 was not a leap year in the Gregorian calendar, but 2000 was.',
      'Because of that, the two calendars drift apart. The same day has a different date in each. Pick a date, pick the calendar it is in, and the page gives the same day in the other one. The gap was 10 days in 1582 and is 13 days today. The page works from the Julian day number, a plain count of days.',
    ],
  },
  {
    id: 'drift',
    kicker: 'Second part',
    title: 'A small error adds up',
    paras: [
      'The true year, from one spring to the next, is about 365.2422 days. The Julian year is 365.25 days, which is too long by about 11 minutes and 14 seconds. That is tiny. But it adds up to a day in about 128 years, and to ten days in about 1280 years, enough to move the start of spring by a week and a half.',
      'The Gregorian year is 365.2425 days, which is still too long, but by only about 26 seconds. Slide the number of years and see how many days each calendar has drifted from the seasons. The Gregorian calendar takes about 3300 years to drift by one day.',
    ],
    tags: [
      { label: 'The rule', text: 'A year can be divided by 4 and is a leap year, unless it can be divided by 100 and not by 400. So 97 years in every 400 are leap years.' },
    ],
  },
  {
    id: 'switch',
    kicker: 'Third part',
    title: 'Who changed, and when',
    paras: [
      'The pope issued the order in February 1582, and Catholic lands such as Spain, Portugal and most Italian states changed that October. Others took longer. The Protestant parts of the Low Countries mostly changed around 1700, Great Britain in 1752, Russia in 1918 and Greece in 1923. The Orthodox Church still uses the Julian calendar for its church year.',
      'Pick a place. The page draws the days around the change, with the days that never happened struck through, and tells you how many days were left out. The more years that had passed since 1582, the more days there were to leave out. Within the Netherlands the change came at different times in different provinces, and for Holland the sources differ on the exact date, so the page does not give one.',
    ],
  },
];

export const takeaways = [
  'The Julian calendar has a leap year every 4 years. The Gregorian calendar leaves out the leap day in century years not divisible by 400.',
  'The Julian year is too long by about 11 minutes and 14 seconds, which adds up to a day in about 128 years.',
  'The Gregorian year is too long by only about 26 seconds, about a day in 3300 years.',
  'In 1582, Thursday 4 October was followed by Friday 15 October. Ten days were left out.',
  'Places changed at different times: Great Britain left out 11 days in 1752, Russia 13 days in 1918.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The order of Pope Gregory XIII of 24 February 1582, Thursday 4 October followed by Friday 15 October, the leap year rule that gives an average year of 365.2425 days, and the Julian year of 365.25 days being too long by about 11 minutes and 14 seconds (one source said about 12 minutes) each appeared in several places. The leftover Gregorian error of about 26 seconds appeared in one place. The change in Great Britain from Wednesday 2 September to Thursday 14 September 1752 (11 days), in Russia from 31 January to 14 February 1918, in Greece for civil use from 16 February to 1 March 1923, and in Overijssel and Utrecht from 30 November to 12 December 1700 appeared in the search results. For Zeeland and Brabant most sources gave 14 to 25 December 1582, and one table differed. For Holland the sources gave different dates in early 1583, so the page gives none. Spain, Portugal and most Italian states are listed with the date in the papal order and were not checked one by one. France is left out because the date was not confirmed. The Julian day number sums and the days left out were computed on the page and checked against the dates in the sources. The date of the Council of Nicaea and the aim of putting the equinox on 21 March are not on this page because they were not confirmed. Nothing here is advice.';

export const sources = [
  { label: 'EBSCO: Gregory XIII reforms the calendar', url: 'https://www.ebsco.com/research-starters/history/gregory-xiii-reforms-calendar/', for: 'The reform of 1582.' },
  { label: 'Encyclopedia Virginia: the Gregorian calendar', url: 'https://encyclopediavirginia.org/entries/the-gregorian-calendar/', for: 'The change from the Julian calendar.' },
  { label: 'Wikipedia: Gregorian calendar', url: 'https://en.wikipedia.org/wiki/Gregorian_calendar', for: 'The rule and the average year.' },
  { label: 'Wikipedia: Inter gravissimas', url: 'https://en.wikipedia.org/wiki/Inter_gravissimas', for: 'The papal order.' },
  { label: 'EBSCO: Britain employs the Gregorian calendar', url: 'https://www.ebsco.com/research-starters/history/britain-employs-gregorian-calendar/', for: 'The change of 1752.' },
  { label: 'The Conversation: Pope Gregory XIII gave us the leap year', url: 'https://theconversation.com/pope-gregory-xiii-gave-us-the-leap-year-but-his-legacy-goes-much-further-223093', for: 'The leap year rule.' },
  { label: 'History: things you may not know about the Gregorian calendar', url: 'https://www.history.com/articles/6-things-you-may-not-know-about-the-gregorian-calendar', for: 'Facts about the change.' },
  { label: 'Wikipedia: list of adoption dates of the Gregorian calendar by country', url: 'https://en.wikipedia.org/wiki/List_of_adoption_dates_of_the_Gregorian_calendar_by_country', for: 'When each place changed.' },
  { label: 'Sizes: adoption of the Gregorian calendar', url: 'https://www.sizes.com/time/cal_Gregadoption.htm', for: 'Dates of adoption.' },
  { label: 'University of Nottingham: Julian and Gregorian calendars', url: 'https://www.nottingham.ac.uk/manuscriptsandspecialcollections/researchguidance/datingdocuments/juliangregorian.aspx', for: 'Dating documents across the change.' },
  { label: 'Dutch Genealogy: a tale of two calendars', url: 'https://www.dutchgenealogy.nl/a-tale-of-two-calendars/', for: 'The change in the Netherlands.' },
  { label: 'Claus Tøndering: the Gregorian calendar', url: 'https://www.tondering.dk/claus/cal/gregorian.php', for: 'The Gregorian calendar and the Dutch provinces.' },
];
