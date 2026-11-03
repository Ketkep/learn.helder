// Everything the "How inflation changes what money buys" page says, in one place.
// A till receipt with three lines to try: how steady price rises add up, how a basket of goods gives one number, and how a pay rise can
// still buy less. The ideas come from the sources. All prices, weights and pay on the page are made up, and the page says so.
// Nothing here is money advice.

export interface Line {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'The same coins, a smaller basket',
  paras: [
    'Inflation means that prices in general go up over time, so the same money buys less. A loaf that cost two euros once costs more later. When people say inflation is 3 per cent, they mean that a typical set of goods costs 3 per cent more than a year before.',
    'This page is a till receipt with three lines. On the first, watch steady rises add up over years. On the second, build the one number that a statistics office reports from a basket of goods. On the third, see how a pay rise can still buy less. All the prices, weights and pay on the page are made up. This explains an idea. It is not money advice. Without a script each line shows one picture or table.',
  ],
};

export const lines: Line[] = [
  {
    id: 'years',
    kicker: 'Line 1',
    title: 'Steady rises add up',
    paras: [
      'A rise of 3 per cent a year does not sound like much. But each year it is applied to a price that already rose. After ten years a price that grew 3 per cent every year is about 34 per cent higher, not 30. The same money buys the reciprocal: after ten years at 3 per cent, a sum that once bought 1000 euros worth of goods buys the amount that 744 euros bought before.',
      'Slide the rate and the number of years. The page shows the price of a made-up loaf and what 100 euros would buy of it. The loaf and its price are invented.',
    ],
  },
  {
    id: 'basket',
    kicker: 'Line 2',
    title: 'A basket gives one number',
    paras: [
      'No one price tells you about inflation, because some things rise and some fall. Statistics offices price a basket of goods and services that stands for what households buy, and each item counts in proportion to how much is spent on it. The result is one index. In the euro area it is called the Harmonised Index of Consumer Prices, and the target of the central bank is 2 per cent over the medium term.',
      'Move the price change of each item. Rent counts for more than clothes, so a change in rent moves the whole figure more. The basket, the weights and the prices here are made up. In the real index the weights change every year.',
    ],
    tags: [
      { label: 'Real weights', text: 'In the euro area for 2026 services make up around 47 per cent of household spending, food, alcohol and tobacco about 19 per cent and energy about 9 per cent. These are rough shares, and each country differs.' },
    ],
  },
  {
    id: 'pay',
    kicker: 'Line 3',
    title: 'A pay rise that buys less',
    paras: [
      'Pay on a payslip is called nominal pay. What it buys is called real pay. If pay rises by less than prices, the number on the payslip goes up and what it buys goes down. The exact change is one plus the pay rise, divided by one plus the price rise, minus one.',
      'Set a pay rise and a price rise. The page shows both and works out what the pay buys. The numbers are made up. This is an arithmetic example and not a statement about any real job or country.',
    ],
  },
];

export const takeaways = [
  'Inflation is a rise in prices in general. The same money then buys less.',
  'Steady yearly rises add up faster than a plain sum. At 3 per cent for ten years, prices are about 34 per cent higher.',
  'An index prices a basket of goods and weights each item by how much is spent on it.',
  'Pay can rise and still buy less if prices rise faster. What it buys is the pay rise divided by the price rise.',
  'The prices on this page are made up. It explains an idea and gives no money advice.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Inflation as a rise in consumer prices over time, measured with a weighted basket, the Harmonised Index of Consumer Prices of Eurostat and the national statistics offices, the symmetric 2 per cent target of the European Central Bank over the medium term, the weights being updated every year and adding to 1000, and the difference between nominal and real pay each appeared in more than one place. The example that a sum loses value to 744 out of 1000 after ten years at 3 per cent appeared in a source and was checked by computing. The rough shares for 2026 (services about 47 per cent, food, alcohol and tobacco about 19 per cent, energy about 9 per cent) came from one search summary of Eurostat data and may be rounded. Current inflation rates were not given because the sources disagreed, so the page gives none. All prices, weights and pay on the page are made up. The Dutch statistics office was not searched, so the page does not describe its method. Nothing here is money advice.';

export const sources = [
  { label: 'ECB: measuring inflation and consumer prices', url: 'https://www.ecb.europa.eu/stats/macroeconomic_and_sectoral/hicp/html/index.en.html', for: 'What the HICP measures.' },
  { label: 'ECB: the monetary policy strategy statement (2025)', url: 'https://www.ecb.europa.eu/mopo/strategy/strategy-review/ecb.strategyreview202506_strategy_statement.en.html', for: 'The 2 per cent target.' },
  { label: 'Bank of Finland: the ECB’s monetary policy strategy', url: 'https://www.suomenpankki.fi/en/Monetary-policy/ECBs-monetary-policy-strategy/', for: 'The target and what it means.' },
  { label: 'Wikipedia: Harmonised Index of Consumer Prices', url: 'https://en.wikipedia.org/wiki/Harmonised_Index_of_Consumer_Prices', for: 'How the index is made.' },
  { label: 'Eurostat: information on HICP data', url: 'https://ec.europa.eu/eurostat/web/hicp/information-data', for: 'Weights and updates each year.' },
  { label: 'Eurostat: HICP item weights', url: 'https://ec.europa.eu/eurostat/databrowser/product/page/prc_hicp_inw', for: 'The weights of each category.' },
  { label: 'Eurostat: inflation in the euro area', url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Inflation_in_the_euro_area', for: 'The basket and its parts.' },
  { label: 'Bank of England: what is inflation', url: 'https://www.bankofengland.co.uk/explainers/what-is-inflation', for: 'Why a low and steady target.' },
  { label: 'Bank of England: inflation and interest rates', url: 'https://www.bankofengland.co.uk/faq/inflation-and-interest-rates', for: 'Prices and purchasing power.' },
  { label: 'The Conversation: UK inflation and wages', url: 'https://theconversation.com/as-uk-inflation-falls-to-2-3-heres-what-it-could-mean-for-wages-230563', for: 'Nominal and real wages.' },
  { label: 'Euroflation: what is in the inflation basket', url: 'https://euroflation.com/explainers/whats-in-the-inflation-basket', for: 'Rough shares of spending.' },
];
