// Everything the "How growth compounds" page says, in one place.
// Money here is "coins", made up for the page. Four panels on ledger paper: simple against compound, the rule of 72,
// inflation, and growth added more often. Nothing on this page is money advice.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Growth on top of growth',
  paras: [
    'Suppose 100 coins grow by 10 per cent a year. After one year there are 110. In the second year, do they grow by 10 coins again, or by 10 per cent of 110? If the growth is added to the pile and then grows too, that is compound growth. It starts slowly and then speeds up, and over a long time the difference is large.',
    'This page is about the maths. The coins are made up, and real rates change, differ from place to place and can be negative. Nothing here is advice about money, saving, borrowing or investing. Four panels on ledger paper let you try the sums. Without a script, each panel shows one chart or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'simple',
    kicker: 'Page one',
    title: 'Simple or compound',
    paras: [
      'With simple growth the same amount is added every year: 10 per cent of the starting 100 coins, so 10 coins a year. With compound growth each year adds 10 per cent of whatever is there now. The first year is the same. After that the two lines pull apart.',
      'Move the rate and the number of years. The line for compound growth curves upwards, and the longer the time, the more it leaves the straight line behind.',
    ],
    tags: [{ label: 'The formula', text: 'After t years at a yearly rate r, an amount A grows to A times (1 + r) multiplied by itself t times. For simple growth it grows to A times (1 + r times t).' }],
  },
  {
    id: 'rule',
    kicker: 'Page two',
    title: 'The rule of 72',
    paras: [
      'How long does it take for an amount to double? There is a shortcut called the rule of 72. Divide 72 by the rate in per cent. At 9 per cent a year, 72 divided by 9 is 8, so the amount doubles in about 8 years. The exact answer is 8.04 years.',
      'Move the rate and compare the shortcut with the exact time. The rule is close in the middle and drifts off at the ends.',
    ],
    tags: [{ label: 'Why 72', text: 'The exact doubling time is the natural logarithm of 2 divided by the natural logarithm of one plus the rate, and that is close to 69.3 divided by the rate in per cent. 72 is used because it divides by many whole numbers (2, 3, 4, 6, 8, 9 and 12), which is easy to do in your head. Sources differ on exactly which rates it suits best, usually from about 2 to 15 per cent.' }],
  },
  {
    id: 'inflation',
    kicker: 'Page three',
    title: 'Prices grow too',
    paras: [
      'When prices rise, the same number of coins buys less. The growth that counts is how much more you can buy, which is smaller than the growth in the number of coins. A close rule of thumb is to take the rate of growth and subtract the rate of price rises. The exact way is to divide one plus the rate by one plus the price rise.',
      'Move the sliders. The upper line is the number of coins. The lower line is what they could buy, measured in coins of today. If prices rise as fast as the coins grow, the lower line stays flat.',
    ],
    tags: [{ label: 'Real and nominal', text: 'Economists call the number of coins the nominal amount and what it buys the real amount. The link between them is called the Fisher equation, after Irving Fisher.' }],
  },
  {
    id: 'often',
    kicker: 'Page four',
    title: 'Adding growth more often',
    paras: [
      'Growth can be added once a year, or every month, or every day. The more often it is added, the sooner the added growth starts growing too. But the extra gets smaller and smaller. Adding it every instant, called continuous growth, gives a limit: the number e, about 2.718, shows up when 100 coins grow at 100 per cent for a year.',
      'Move the rate and the years and look at the table. The first jump, from once a year to monthly, is the biggest. After that there is hardly any change.',
    ],
  },
];

export const takeaways = [
  'Compound growth adds growth to the pile, and that growth then grows too. Simple growth adds the same amount every year.',
  'After t years at a rate r, an amount grows to A times (1 + r) to the power t with compound growth, but only to A times (1 + r times t) with simple growth.',
  'The rule of 72 says an amount doubles in about 72 divided by the rate in per cent years. It is close in the middle of the usual range and drifts off at the ends.',
  'Prices rising makes the same coins buy less, so what counts is the real growth: one plus the rate divided by one plus the price rise.',
  'Adding growth more often helps a little, with smaller and smaller gains. Adding it all the time gives a limit, which involves the number e.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The compound formula, the rule of 72 (72 divided by the rate in per cent, with 9 per cent giving about 8 years, where the exact value is 8.04), the reason for choosing 72 over 69.3 (it has many divisors), the real rate as roughly the nominal rate minus inflation with the exact form (1 + i) = (1 + r)(1 + p), and 5,000 growing to about 79,840 at 8 per cent over 36 years each appeared in at least two places. The sources disagree about the exact range of rates for which the rule of 72 is best, so the page only says it is close in the middle. The sums for adding growth more often were computed. The coins are made up, and the page is about the maths and gives no advice about money.';

export const sources = [
  { label: 'Investor.gov: what is compound interest?', url: 'https://www.investor.gov/outreach/teachers/classroom-resources/what-compound-interest', for: 'Compound interest and the rule of 72.' },
  { label: 'St. Louis Fed: how does compound interest work?', url: 'https://www.stlouisfed.org/open-vault/2018/september/how-compound-interest-works', for: 'Compound growth over time, with worked sums.' },
  { label: 'TVM Calcs: future value of lump sums', url: 'https://tvmcalcs.com/tvm-math/lumpsums_fv/', for: 'The formula for compounding several times a year.' },
  { label: 'Wikipedia: rule of 72', url: 'https://en.wikipedia.org/wiki/Rule_of_72', for: 'Where 72 comes from and its accuracy.' },
  { label: 'Stanford: the rule of 72', url: 'https://web.stanford.edu/class/ee204/TheRuleof72.html', for: 'How good the rule is at different rates.' },
  { label: 'Mathwords: rule of 72', url: 'https://www.mathwords.com/r/rule_of_72.htm', for: 'The rule in short.' },
  { label: 'Parabola (UNSW): the rule of 72 (PDF)', url: 'https://parabola.unsw.edu.au/sites/default/files/2024-02/vol36_no1_2.pdf', for: 'The maths behind the rule.' },
  { label: 'Wikipedia: Fisher equation', url: 'https://en.wikipedia.org/wiki/Fisher_equation', for: 'Real and nominal rates.' },
  { label: 'Saylor Academy: the Fisher equation', url: 'https://saylordotorg.github.io/text_macroeconomics-theory-through-applications/s20-14-the-fisher-equation-nominal-an.html', for: 'Nominal and real interest rates.' },
];
