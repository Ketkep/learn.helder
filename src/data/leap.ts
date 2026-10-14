// Everything the "Why we have leap years" page says, in one place.
// A year of the Earth is not a whole number of days. Four pages try the rules people have used to fit them together.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A year is not a whole number of days',
  paras: [
    'The Earth takes about 365 and a quarter days to go once round the Sun. A calendar year has to have a whole number of days. If the calendar ignores the extra quarter, the seasons slip out of place, a little more each year. Leap years are the fix, and the rule for them has changed once, in 1582.',
    'Four pages try it: what happens with no leap days, what a leap day every four years does, why the century rule was added, and the days that were skipped when the calendar was changed. The sums are exact, but the model is simple: the year length is taken as an average. Without a script, each page shows one chart or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'slip',
    kicker: 'Page one',
    title: 'With no leap days',
    paras: [
      'The time from one spring equinox to the next is about 365.2422 days. That is called the tropical year. A calendar of 365 days is a quarter of a day short each year, so after four years it is a whole day behind the seasons, and after a hundred years it is about 24 days behind.',
      'Slide the years and watch where the spring equinox falls. It starts on 21 March. Without leap days it creeps later and later, until spring would begin in April, then May.',
    ],
    tags: [{ label: 'Equinox', text: 'The equinox is the moment when the Sun is straight above the equator and day and night are about equal. The spring one in the north falls around 20 or 21 March.' }],
  },
  {
    id: 'julian',
    kicker: 'Page two',
    title: 'Every four years',
    paras: [
      'The Julian calendar added a leap day every fourth year. That gives an average year of 365.25 days, which is very close, but a little too long: 365.25 minus 365.2422 is 0.0078 of a day, about 11 minutes. Now the calendar runs ahead of the seasons, one day every 128 years or so.',
      'Slide the years. It looks like nothing at first. After about 1,300 years the spring equinox has slid about 10 days earlier in the calendar. By 1582 the calendar was about 10 days off.',
    ],
  },
  {
    id: 'century',
    kicker: 'Page three',
    title: 'The century rule',
    paras: [
      'In 1582 Pope Gregory XIII changed the rule. A year that divides by 4 is a leap year, except that a year that divides by 100 is not, unless it also divides by 400. So 1900 and 2100 are not leap years, but 2000 was. Over 400 years this leaves out 3 leap days, and the average year becomes 365.2425 days.',
      'Type a year to see the rule at work. The Gregorian rule is only 0.0003 of a day too long each year, so it takes thousands of years to drift by a day. It is about 3 days in 10,000 years.',
    ],
    tags: [{ label: 'Still not exact', text: 'The Gregorian year is 365.2425 days and the tropical year is about 365.2422. So even this calendar drifts, though so slowly that nobody has needed to change it.' }],
  },
  {
    id: 'skip',
    kicker: 'Page four',
    title: 'Days that never were',
    paras: [
      'Changing the rule did not fix the calendar that was already ten days off. So the days were simply skipped. In Catholic countries Thursday 4 October 1582 was followed by Friday 15 October. Ten days never happened.',
      'Not everyone changed at once. Britain and its colonies waited until 1752, by which time 11 days had to go: Wednesday 2 September was followed by Thursday 14 September. Pick a page and see the days crossed out.',
    ],
    tags: [{ label: 'Not everyone at once', text: 'Many Protestant countries refused for a long time, because the change came from the Pope. This page does not give dates for the Netherlands, because the sources found for it did not agree or did not say.' }],
  },
];

export const takeaways = [
  'The Earth takes about 365.2422 days to go once round the Sun, so a calendar year of 365 days is a quarter day short and the seasons slip.',
  'The Julian calendar added a leap day every 4 years, an average of 365.25 days. It was a little too long, about a day every 128 years, so by 1582 it was about 10 days off.',
  'The Gregorian rule: a year divisible by 4 is a leap year, except years divisible by 100, unless they are divisible by 400. The average year is 365.2425 days.',
  'The Gregorian calendar still drifts, by about 3 days in 10,000 years.',
  'In 1582 ten days were skipped in Catholic countries, and in 1752 eleven in Britain, to catch up with the seasons.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The Julian year of 365.25 days and the Gregorian average of 365.2425, the tropical year of about 365.2422 days, the leap year rule with centuries, 4 October 1582 followed by 15 October, Britain skipping 11 days in September 1752 and a drift of about 3 days in 10,000 years each appeared in at least two places. The sums for the shift of the equinox are year length differences multiplied by years, and the 400 year count of leap days was checked by counting. The sources did not agree on the date for the Netherlands, so the page does not give one. The model uses the average year and ignores that the real tropical year changes a little over time.';

export const sources = [
  { label: 'Wikipedia: Gregorian calendar', url: 'https://en.wikipedia.org/wiki/Gregorian_calendar', for: 'The rule, the 1582 change and the average year.' },
  { label: 'Wikipedia: century leap year', url: 'https://en.wikipedia.org/wiki/Century_leap_year', for: 'Why 1900 was not a leap year and 2000 was.' },
  { label: 'St Andrews: errors in the Julian calendar', url: 'https://mathshistory.st-andrews.ac.uk/Extras/JulianErrors/', for: 'How the Julian calendar drifted.' },
  { label: 'Amusing Planet: why Britain lost 11 days in September 1752', url: 'https://www.amusingplanet.com/2020/08/why-britain-lost-11-days-in-september.html', for: '2 September followed by 14 September.' },
  { label: 'EBSCO: Britain employs the Gregorian calendar', url: 'https://ebsco.com/research-starters/history/britain-employs-gregorian-calendar', for: 'Britain’s change in 1752.' },
  { label: 'JSTOR Daily: what happened to those 11 days', url: 'https://daily.jstor.org/never-mind-that-extra-second-what-happened-to-those-11-days', for: 'The days that were skipped.' },
  { label: 'KStars: leap years', url: 'https://kstars-docs.kde.org/de/user_manual/ai-leapyear.html', for: 'Leap years and the length of the year.' },
  { label: 'Maidens and Manuscripts: the Gregorian calendar is adopted in 1582', url: 'https://maidensandmanuscripts.com/2020/10/15/the-gregorian-calendar-is-adopted-in-1582/', for: 'The change of October 1582.' },
];
