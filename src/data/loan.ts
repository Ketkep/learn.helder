// Everything the "How a loan is paid off" page says, in one place.
// A ledger with five things to try: the payment, where each payment goes, a longer term, a little extra, and two ways to repay.
// The loans are made up and the sums are exact for the toy: a fixed rate, one payment a month, no fees and no taxes.
// The page explains the maths of loans. It is not financial advice.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Where each payment goes',
  paras: [
    'When you borrow money you pay it back in equal monthly payments. Each payment does two jobs. Part pays the interest for that month, which is a charge for borrowing. The rest pays down the loan. At the start most of the payment is interest. At the end it is almost all repayment.',
    'Five things to try on a made up loan. Work out the payment. See where each payment goes. Stretch the loan over a longer term. Pay a little extra each month. And compare two ways to repay, a level payment and a falling one. The page explains the maths of loans with a toy loan. It is not financial advice, and real loans have fees, taxes and rules that this page leaves out. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'pay',
    kicker: 'Line one',
    title: 'The monthly payment',
    paras: [
      'The payment is worked out so that the loan is exactly paid off at the end. It depends on three things: how much you borrow, the yearly interest rate and the number of years. The interest for a month is the balance times the rate for one month, which is a twelfth of the yearly rate.',
      'Slide the three numbers. The page shows the payment, the total you pay back and how much of that is interest.',
    ],
  },
  {
    id: 'split',
    kicker: 'Line two',
    title: 'Interest first',
    paras: [
      'Interest is charged on what you still owe. So early on, when the balance is high, the interest is high, and most of the payment goes to it. As the balance falls, the interest falls, and more of the same payment goes to the loan.',
      'The chart shows every payment of a loan of €100,000 at 5 per cent over 25 years. The dark part is interest and the pale part is repayment. Slide the month. There is a month where repayment first becomes bigger than interest.',
    ],
  },
  {
    id: 'term',
    kicker: 'Line three',
    title: 'A longer term',
    paras: [
      'A longer term lowers the monthly payment. But you owe money for longer, so you pay more interest in all. Lenders’ own examples show this: stretching a car loan from 48 to 60 months lowers the payment and raises the total interest, and so does stretching a mortgage from 25 to 30 years.',
      'Pick a term for the same loan of €100,000 at 5 per cent. Compare the payment and the total interest.',
    ],
  },
  {
    id: 'extra',
    kicker: 'Line four',
    title: 'A little extra',
    paras: [
      'If you add a little extra to each payment, it all goes to the loan, so the balance falls faster and the interest each month falls faster too. The loan ends sooner and you pay less interest in all.',
      'Slide the extra amount for the loan of €100,000 at 5 per cent over 25 years. Some loans have rules or fees for paying early, which this toy leaves out.',
    ],
  },
  {
    id: 'two',
    kicker: 'Line five',
    title: 'Level or falling',
    paras: [
      'There are two common ways to repay. With a level payment, an annuity, the payment is the same every month, and the share that is repayment grows. With a linear loan the repayment is the same every month, so the payment starts higher and falls. In the Netherlands both are common types of mortgage.',
      'Compare them on a loan of €500,000 at 4 per cent over 30 years. The level payment is about €2,387. The linear payment starts at about €3,056 and ends at about €1,394, and it costs less interest in all.',
    ],
    tags: [{ label: 'Not advice', text: 'This page shows how the maths of a loan works. It does not say which loan or term is right for anyone. The numbers are made up, and real loans have fees, taxes and other rules.' }],
  },
];

export const takeaways = [
  'Each payment pays the interest for the month first. The rest repays the loan.',
  'Early in a loan most of the payment is interest. Later most of it is repayment.',
  'A longer term lowers the monthly payment but raises the total interest.',
  'A little extra each month ends the loan sooner and saves interest.',
  'A level payment and a falling payment are two ways to repay. The falling one costs less interest in all in this example. This page is not financial advice.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The payment formula with the monthly rate and the number of payments, interest charged on the remaining balance with interest shrinking and repayment growing, the month where repayment first passes interest for a 30 year loan at 6 per cent, a longer term giving a lower payment and more total interest in lenders’ own examples, and the level (annuity) and falling (linear) types of Dutch mortgage with the example of €500,000 at 4 per cent over 30 years each appeared in at least two places. The page worked the sums itself and they match those examples: a level payment of €2,387, a linear payment from €3,056 to €1,394, a car loan of 25,000 at 3 per cent costing 1,561 in interest over 48 months and 1,953 over 60, and the crossover in month 223 for 300,000 at 6 per cent over 30 years. No source covered extra payments, so that panel is the page’s own sum. The loans are made up. The page explains maths and is not financial advice.';

export const sources = [
  { label: 'Mathwords: amortization', url: 'https://www.mathwords.com/a/amortization.htm', for: 'The payment formula.' },
  { label: 'eCampusOntario: loan amortization', url: 'https://ecampusontario.pressbooks.pub/financemath/chapter/4-3-loan-amortization-formula-approach/', for: 'The formula and the schedule.' },
  { label: 'Ryan O’Connell: loan amortization', url: 'https://ryanoconnellfinance.com/?p=10702', for: 'The monthly rate and the schedule.' },
  { label: 'Hypotheek berekenen: annuity mortgage', url: 'https://hypotheekberekenen.nl/en/mortgage-types/annuity-mortgage', for: 'The level payment.' },
  { label: 'Hypotheek berekenen: linear mortgage', url: 'https://hypotheekberekenen.nl/en/mortgage-types/linear-mortgage', for: 'The falling payment.' },
  { label: 'DutchNews: linear or annuity', url: 'https://www.dutchnews.nl/2025/11/linear-or-annuity-which-mortgage-type-is-right-for-you/', for: 'The two types compared.' },
  { label: 'Bank of America: how car loans work', url: 'https://www.bankofamerica.com/auto-loans/how-car-loans-work/', for: 'Term and total interest.' },
  { label: 'RBC: mortgage amortization', url: 'https://rbcroyalbank.com/mortgages/amortization.html', for: 'A longer term and its cost.' },
];
