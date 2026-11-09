// Everything the "Why shared birthdays are common" page says, in one place.
// A party with three things to try: let guests arrive on a year of 365 days and watch for the first shared birthday, see the chance grow with
// the size of the room, and see why a match with you in particular needs far more people. The chances are worked out, the party is random.
// Leap days and the uneven spread of real birthdays are left out, as in the sources. A toy, not a prediction.

export interface Room {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'How many guests until two match',
  paras: [
    'There are 365 days in a year. How many people must be in a room before two of them probably have the same birthday? Many people guess about 180, half of 365. The answer is 23. With 23 people, the chance is just over a half.',
    'Three rooms. In the first, let guests arrive and watch for the first match. In the second, see how the chance grows with the size of the room. In the third, see why a match with you in particular is a different question that needs far more people. The party is random each time. Without a script each room shows one picture or table.',
  ],
};

export const rooms: Room[] = [
  {
    id: 'party',
    kicker: 'First room',
    title: 'Guests arrive',
    paras: [
      'The grid is a year, one small square for each day. Press Next guest. A guest arrives with a random birthday and fills that day. When a second guest lands on a day that is already filled, the day turns red. That is a shared birthday.',
      'Start again and try a few parties. The first match often comes sooner than you expect. Then press Run 1,000 parties. The page plays a thousand parties and says how many guests it took until the first match, on average and at the middle.',
      'The average comes out near 25, and about half of the parties have a match by guest 23, in line with the sources. A party can still be lucky or unlucky. A match can come with the third guest, or after sixty.',
    ],
    tags: [{ label: 'Toy', text: 'The guests and their birthdays are random numbers made by the page. They are not real people, and real birthdays are not spread quite evenly over the year.' }],
  },
  {
    id: 'odds',
    kicker: 'Second room',
    title: 'Why it grows so fast',
    paras: [
      'Count the pairs, not the people. With 23 people there are 253 pairs, since each person can pair with the 22 others and every pair is counted once. Each pair has one chance in 365 to match. So the chances add up fast.',
      'The sum goes the other way round. The chance that all birthdays differ is 365 over 365, times 364 over 365, times 363 over 365, and so on for each new guest. The chance of at least one match is one minus that. It is 50.7 per cent for 23 people and above 99 per cent for 57.',
      'Slide the number of people and read the chance. The curve starts slowly and then climbs.',
    ],
  },
  {
    id: 'you',
    kicker: 'Third room',
    title: 'A match with you',
    paras: [
      'A different question: how many other people must be in the room for someone to share your birthday? Now only the pairs that include you count. Each other person has one chance in 365 to match you, so the chance that nobody does is 364 over 365 for each person.',
      'You need 253 others, a room of 254, for a better than even chance. That is far more than 23. In a room of 23, the chance that one of the other 22 shares your birthday is only about 6 per cent.',
      'Slide the number of people in the room. The solid curve is any match in the room and the dashed curve is a match with you. The first question is about all the pairs and the second is only about you.',
    ],
  },
];

export const takeaways = [
  'With 23 people the chance that two share a birthday is just over 50 per cent. With 57 it is above 99 per cent. Leap days and uneven birth dates are left out.',
  'The result looks wrong because of the pairs. 23 people make 253 pairs, and every pair is a chance to match.',
  'The chance is easiest to work out the other way: the chance that all birthdays differ is 365 over 365 times 364 over 365 and so on. Then take it away from one.',
  'A match with you in particular is a different question. It takes 253 other people to pass 50 per cent.',
  'The problem is often credited to Richard von Mises in 1939. Some sources credit Harold Davenport at an earlier time, and the history is unclear.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The chance of just over 50 per cent for 23 people (50.7 per cent), the 49.3 per cent for no match, above 99 per cent for 57 people, the 253 pairs among 23 people and the way of working it out through the chance of no match each appeared in several places. The chance of a match with one chosen person, one minus 364 over 365 to the power n, appeared in the search results as the standard way to work it out. The figure of 253 other people for a better than even chance of that kind was worked out here and was not found in a source. The 1939 credit to Richard von Mises, the earlier unpublished credit to Harold Davenport and the average of about 24.6 guests to the first match appeared in the search results. The sources differ on the history, so the page says it is unclear. That real birthdays are not evenly spread and that leap years are ignored appeared in the search results. The size of the effect of uneven birthdays was not found, so the page gives none. The chances on this page were worked out, and the party is random. Nothing here is advice.';

export const sources = [
  { label: 'Cornell University: the birthday problem', url: 'https://pi.math.cornell.edu/%7Emec/2008-2009/TianyiZheng/Birthday.html', for: 'The sum and the figure for 23.' },
  { label: 'FlowingData: the birthday problem explained', url: 'https://flowingdata.com/2012/10/05/the-birthday-problem-explained', for: 'Why the answer is 23.' },
  { label: 'University of Colombo: the birthday paradox', url: 'https://fos.cmb.ac.lk/blog/post_the-birthday-paradox/', for: 'The pairs and the chances.' },
  { label: 'Australian Association of Mathematics Teachers: the birthday paradox', url: 'https://albert.aamt.edu.au/Student-activities/National-Maths-Day/National-Maths-Day-2014/The-birthday-paradox', for: 'A classroom version.' },
  { label: 'Wikipedia: birthday problem', url: 'https://en.wikipedia.org/wiki/Birthday_problem', for: 'The history and the chances.' },
  { label: 'Utah State University: the birthday problem, history and background', url: 'https://5010.mathed.usu.edu/Fall2023/RDayton/HistoryandBackground.html', for: 'Von Mises and Davenport.' },
  { label: 'Encyclopaedia Britannica: Richard von Mises', url: 'https://www.britannica.com/biography/Richard-von-Mises', for: 'The 1939 version.' },
  { label: 'MacTutor, University of St Andrews: Richard von Mises', url: 'https://mathshistory.st-andrews.ac.uk/Strick/mises.pdf', for: 'The expected value near 24.6.' },
  { label: 'Wolfram Demonstrations: birthday paradox probability estimates', url: 'https://www.wolframcloud.com/objects/demonstrations/BirthdayParadoxProbabilityEstimates-source.nb', for: 'Estimates of the chance.' },
];
