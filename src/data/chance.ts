// Everything the "How chance works" page says, in one place.
// The page is a lab notebook with four experiments. Each page has one thing to run.

export interface Experiment {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Lab notebook',
  paras: [
    'Chance is hard to feel and easy to test. In this notebook you run four small experiments on a computer, thousands of times if you like, and watch what chance really does. The computer picks its random numbers with the browser’s own generator.',
    'Chance is the maths of things that are not certain. This page is about the maths. It is not about games for money, and it gives no tips for any.',
  ],
};

export const experiments: Experiment[] = [
  {
    id: 'dice',
    kicker: 'Experiment one',
    title: 'Two dice',
    paras: [
      'Roll two dice and add them up. There are 36 equally likely ways for the dice to land. Only one of them makes a 2 (1 and 1) and only one makes a 12 (6 and 6). Six of them make a 7. So a 7 comes up 6 times in 36, which is 1 time in 6, and a 2 or a 12 comes up 1 time in 36.',
      'Roll a few times and the bars look ragged. Roll thousands of times and they come close to the exact odds. No sum is ever “due”.',
    ],
  },
  {
    id: 'coins',
    kicker: 'Experiment two',
    title: 'Flipping coins',
    paras: [
      'A fair coin lands heads half of the time. Flip it 10 times and you may get 7 heads. Flip it 10,000 times and the share of heads gets very close to a half. This is the law of large numbers. It was proved by Jacob Bernoulli and printed in 1713.',
      'The law says the share settles down. It does not say that the coin makes up for a streak. Each flip is a fresh start. Flip a lot of coins, and then look at how often the flip after a run of five of the same matches the run.',
    ],
    tags: [
      { label: 'The gambler’s mistake', text: 'Believing that a coin is “due” to change after a run of the same side is called the gambler’s fallacy. The coin does not remember. A run of heads does not change the odds of the next flip.' },
    ],
  },
  {
    id: 'birthday',
    kicker: 'Experiment three',
    title: 'The shared birthday',
    paras: [
      'How many people must be in a room before two of them probably share a birthday? Most people guess about 180, half of 365. The answer is 23. With 23 people the chance of a match is about 50.7 per cent. With 70 people it is about 99.9 per cent.',
      'The reason is pairs. A room of 23 holds 253 pairs of people, and each pair has a small chance to match. Fill a room and see, then slide the number of people and read the odds.',
    ],
    tags: [
      { label: 'Assumptions', text: 'The sums assume 365 days of the year that are equally likely and ignore 29 February. Real birthdays are not spread out quite evenly, which makes a match a little more likely.' },
    ],
  },
  {
    id: 'doors',
    kicker: 'Experiment four',
    title: 'Three doors',
    paras: [
      'A prize is behind one of three doors, and there is nothing behind the other two. You pick a door. A host who knows where the prize is opens one of the other two doors, and always shows you an empty one. Then the host asks whether you want to stay or switch to the other closed door.',
      'Most people think it makes no difference. It does. Switching wins 2 times in 3 and staying wins 1 time in 3. Play it by hand a few times. Then let the computer play a thousand games each way.',
    ],
    tags: [
      { label: 'Why 2 in 3', text: 'Your first pick is right 1 time in 3, and that does not change when the host opens a door. So the other 2 in 3 now sit on the one door left. The result holds only if the host always opens an empty door and always makes the offer.' },
      { label: 'In the newspaper', text: 'The puzzle became famous in September 1990, when Marilyn vos Savant answered it in her column in Parade magazine. Thousands of readers wrote in to say she was wrong. She was right.' },
    ],
  },
];

export const takeaways = [
  'With two dice there are 36 equally likely outcomes. A 7 can happen 6 ways and a 2 or a 12 only 1 way. A sum is never “due”.',
  'The share of heads in many coin flips gets close to a half (the law of large numbers), but the coin does not make up for a streak.',
  'The flip after a run of the same side is just as likely to break the run as to carry it on. The gambler’s fallacy is the belief that it is not.',
  'In a room of 23 people there is about a 50.7 per cent chance that two share a birthday, because there are 253 pairs.',
  'In the three doors puzzle, switching wins 2 times in 3, as long as the host always opens an empty door.',
  'Computer simulations are a way to test an answer. Whether the maths is right is a different question that has to be argued.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The 36 ways for two dice and the odds of 6 in 36 and 1 in 36, the 23 people and 50.7 per cent (and 99.9 per cent for 70), the 2 in 3 of the three doors puzzle with its assumptions, and the law of large numbers in 1713 each appeared in at least two places. The experiments are simulations made for this page. They use the random numbers of your browser, so a run will differ from the next one. This page is about the maths of chance and gives no advice about gambling.';

export const sources = [
  { label: 'Wikipedia: birthday problem', url: 'https://en.wikipedia.org/wiki/Birthday_problem', for: '23 people and 50.7 per cent, the 253 pairs, and the assumptions.' },
  { label: 'Generalist Academy: the birthday paradox', url: 'https://generalist.academy/2021/02/26/the-birthday-paradox/', for: 'A plain walk through the birthday numbers.' },
  { label: 'Encyclopedia of Mathematics: Monty Hall problem', url: 'https://encyclopediaofmath.org/wiki/Monty_Hall_problem', for: 'Switching wins 2 in 3, and the assumptions about the host.' },
  { label: 'Abakcus: Marilyn vos Savant', url: 'https://abakcus.com/articles/marilyn-vos-savant', for: 'The 1990 Parade column and the letters she received.' },
  { label: 'Wikipedia: Ars Conjectandi', url: 'https://en.wikipedia.org/wiki/Ars_Conjectandi', for: 'Bernoulli and the law of large numbers, printed in 1713.' },
  { label: 'American Mathematical Society: Bernoulli (PDF)', url: 'https://www.ams.org/bull/2013-50-03/S0273-0979-2013-01420-4/S0273-0979-2013-01420-4.pdf', for: 'Background on Jacob Bernoulli and his theorem.' },
  { label: 'LibreTexts: the gambler’s fallacy', url: "https://human.libretexts.org/Bookshelves/Philosophy/Critical_Reasoning:_A_User's_Manual_(Southworth_and_Swoyer)/16:_Applications_and_Pitfalls/16.03:_The_Gamblers_Fallacy", for: 'Why a run does not change the odds of the next flip.' },
  { label: 'Basic Mathematics: dice roll simulator', url: 'https://www.basic-mathematics.com/dice-roll-simulator.html', for: 'The 36 outcomes of two dice and the number of ways for each sum.' },
  { label: 'University of Texas: probability models (PDF)', url: 'https://utw11041.utweb.utexas.edu/ORMM/supplements/models/probmodel/intro.pdf', for: 'The sum of two dice as a triangular distribution.' },
];
