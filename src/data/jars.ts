// Everything the "How insurance shares risk" page says, in one place.
// A village hall with four jars and four things to try: a shared jar over twenty years, how steady a pool is,
// whether the jar can pay, and what happens when everyone is hit together. The idea and the history come from the sources.
// The people, the chances and the sizes of the losses are made up for the page. Not money advice.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A jar that everyone pays into',
  paras: [
    'Most of us will never have a house fire, but one of us might, and it would be ruinous. Insurance is an old answer. Many people each pay a small amount into a shared pool, and the few who suffer a loss are paid from it. For one person, whether the loss comes is a gamble. For a large crowd, the number of losses in a year is steady enough to plan around. That is the law of large numbers, and it is what makes insurance work.',
    'Four jars to try. Pay into a village jar for twenty years. See how the steadiness depends on the size of the pool. See the chance that the jar can pay. And see what happens when everyone is hit at once. The people, the chances and the sizes of the losses are made up for the page. It explains how pooling works. It does not tell anyone what to buy. Without a script each jar shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'pool',
    kicker: 'First jar',
    title: 'Twenty years of one village jar',
    paras: [
      'In this made up village each person has a 1 in 100 chance of a loss of 10,000 units in a year. The fair price of the cover is the expected loss, which is 1 in 100 of 10,000, or 100 units. Everyone pays that into the jar. If the number of losses is exactly the expected number, the jar pays out exactly what came in.',
      'Pick the size of the village. Each bar is one year: the claims paid as a share of what was collected. In a village of 10, most years there are no claims and some years one person takes ten times the whole jar. In a village of 10,000 every year is close to 100 per cent.',
    ],
    tags: [
      { label: 'History', text: 'After the Great Fire of London in 1666 many people wanted cover for their houses. Nicholas Barbon set up one of the first fire insurance offices, in 1680 or 1681 depending on the source. Edward Lloyd opened his coffee house in 1688, which became a meeting place for marine insurance.' },
    ],
  },
  {
    id: 'steady',
    kicker: 'Second jar',
    title: 'Why a bigger pool is steadier',
    paras: [
      'The number of losses in a year is not fixed. It swings around the expected number. The swing, as a share of what is expected, gets smaller as the pool grows, in proportion to one over the square root of the number of people. A pool 100 times as big has a swing 10 times as small, relative to its size. Jacob Bernoulli proved a first form of this in a book published in 1713, which he called his golden theorem.',
      'Slide the chance of a loss and pick a size. The bars show the usual swing in losses as a share of the expected number. The rarer the loss, the bigger the pool has to be to be steady.',
    ],
    tags: [
      { label: 'Check', text: 'The sources describe the law of large numbers and give Bernoulli and 1713. The rule that the swing falls with the square root of the pool is standard probability, worked out on the page for a count of independent losses.' },
    ],
  },
  {
    id: 'pay',
    kicker: 'Third jar',
    title: 'Can the jar pay',
    paras: [
      'A fair jar is not enough. In half of the years the claims will be above the expected amount, and then the jar is short. So an insurer charges more than the fair price. The extra pays for running costs and for reserves that carry the bad years, and for profit. Insurers also buy their own cover, called reinsurance, for losses too big for the pool.',
      'Pick the size of the village and slide the extra charged. The page works out the chance that what was collected covers the claims in a year, from the exact odds of the number of losses. With no extra it is about half, or a bit more for small villages.',
    ],
    tags: [
      { label: 'Check', text: 'Sources agree that premiums cover expected losses plus costs, reserves and profit, and that insurers use reinsurance for large losses. The chance of paying is computed on the page for the made up village.' },
    ],
  },
  {
    id: 'together',
    kicker: 'Fourth jar',
    title: 'When everyone is hit together',
    paras: [
      'Pooling works because losses are independent: one house burns while the others do not. If one event can hit everyone at once, such as a flood across the whole village, the pool is no safer than a single person. Some years nobody has a claim, and then once, everybody does. Insurers handle this by spreading risks over many places, by reinsurance, and by leaving out some kinds of disaster.',
      'Compare two villages of 1,000. In one, losses are independent. In the other, one event with a 1 in 100 chance a year hits every house. The bars are claims as a share of what was collected. Press the button for twenty more years.',
    ],
  },
];

export const takeaways = [
  'Insurance pools many small payments to pay the few large losses. For one person a loss is a gamble. For a crowd it is predictable.',
  'The swing in the number of losses, compared with what is expected, falls with the square root of the size of the pool.',
  'The fair price is the expected loss. Insurers charge more for costs, reserves and profit, so that the jar can pay in a bad year.',
  'Pooling fails when everyone is hit at once. Insurers spread risk over places and buy reinsurance.',
  'Insurance as we know it grew in London after the Great Fire of 1666. The page explains how pooling works and gives no advice on buying cover.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Pooling many similar risks so that losses become predictable, premiums covering expected losses plus costs, reserves and profit, reinsurance for large losses, catastrophes being left out or spread, the Great Fire of London in 1666, Nicholas Barbon’s fire insurance office, Edward Lloyd’s coffee house in 1688, and Bernoulli’s law of large numbers in a book of 1713 (his golden theorem) each appeared in at least two places. Sources differ on the date of Barbon’s office (1680 or 1681, and one says 1667), and one source calls Lloyd’s the first marine insurer, which others say overstates it, since it was a meeting place for individual underwriters. The people, the 1 in 100 chance, the loss of 10,000 units and the years of losses are made up for the page, and the years are drawn from fixed seeds so the same picture appears each time. The size of the swing (one over the square root of the number of people times the chance) and the chance that the jar can pay come from the exact odds of the number of losses and are computed on the page. This is a toy village. It is not money advice, and it does not describe any real policy.';

export const sources = [
  { label: 'Wikipedia: Nicholas Barbon', url: 'https://en.wikipedia.org/wiki/Nicholas_Barbon', for: 'The fire insurance office after 1666.' },
  { label: 'Museum of London: how the Great Fire created insurance', url: 'https://www.museumoflondon.org.uk/discover/how-great-fire-london-created-insurance', for: 'The Great Fire and the first insurers.' },
  { label: 'IRMI: the world’s first insurance company', url: 'https://www.irmi.com/articles/expert-commentary/the-worlds-first-insurance-company', for: 'The Fire Office.' },
  { label: 'Association of British Insurers: out of the ashes of the Great Fire', url: 'https://www.abi.org.uk/news/speeches/2016/07/james-daltons-speech-at-the-worshipful-company-of-firefighters-fire-lecture-2016/', for: 'The birth of the insurance industry.' },
  { label: 'Property Casualty 360: Lloyd’s and the Great Fire', url: 'https://www.propertycasualty360.com/2014/02/14/history-of-adjusting-part-3-lloyds-and-the-great-f', for: 'Lloyd’s coffee house.' },
  { label: 'Saylor: the nature of insurance', url: 'https://saylordotorg.github.io/text_risk-management-for-enterprises-and-individuals/s10-02-nature-of-insurance.html', for: 'Pooling and the law of large numbers.' },
  { label: 'King Saud University: insurance and risk', url: 'https://faculty.ksu.edu.sa/sites/default/files/chapter_2_insurance_and_risk_pdf_0.pdf', for: 'How pooling works.' },
  { label: 'Achievable: transferring losses', url: 'https://app.achievable.me/study/insurance-casualty/learn/general-insurance-concepts-transferring-losses', for: 'Premiums, reserves and reinsurance.' },
  { label: 'Wikipedia: Ars Conjectandi', url: 'https://en.wikipedia.org/wiki/Ars_Conjectandi', for: 'Bernoulli and the law of large numbers.' },
  { label: 'Cambridge: Bernoulli’s law of large numbers', url: 'https://www.cambridge.org/core/services/aop-cambridge-core/content/view/103E1519C96A3C1787DFEB777A30DFB2/S0515036113000111a.pdf/bernoullis_law_of_large_numbers.pdf', for: 'The golden theorem.' },
];
