// Everything the "Dutch Golden Age" page says, in one place.
// The page follows one coin, a guilder, as the camera rolls sideways through the 1600s.
// The coin is pretend. The facts are not.

export interface Station {
  id: string;
  /** The year shown in the corner while the coin is stopped here. */
  year: string;
  /** A short name for the dots that jump between stops. */
  short: string;
  title: string;
  paras: string[];
  /** A short extra fact, shown under the text. */
  extra?: { label: string; text: string };
}

/** Short lines shown while the coin rolls between two stops. */
export interface Passing {
  /** Shown after this station, before the next one. */
  after: string;
  lines: { year: string; text: string }[];
}

export const stations: Station[] = [
  {
    id: 'start',
    year: '1600s',
    short: 'Start',
    title: 'Follow a guilder',
    paras: [
      'This is a guilder, the coin of the Dutch Republic. Any guilder will do. Scroll down and it rolls.',
      'It stops seven times on the way through the Golden Age. At each stop there is something to try.',
    ],
  },
  {
    id: 'wind',
    year: '1594',
    short: 'Wind',
    title: 'Wind makes planks',
    paras: [
      'Ships need wood, and sawing a log by hand is slow. In 1594 a windmill owner from Uitgeest, Cornelis Corneliszoon, built a sawmill that ran on wind.',
      'A wind sawmill could cut 60 beams in about five days. By hand the same job could take about 120 days. Turn the wind up and race it.',
    ],
    extra: {
      label: 'Mills everywhere',
      text: 'In the Zaan district hundreds of windmills sawed timber, ground spices, pressed oil and made paper. Its shipyards are said to have launched 100 to 150 ships a year.',
    },
  },
  {
    id: 'exchange',
    year: '1602',
    short: 'Shares',
    title: 'Share the risk',
    paras: [
      'In 1602 the Dutch East India Company, the VOC, sold shares to anyone in the Republic. There was no smallest amount and no largest. About 6.4 million guilders came in.',
      'In Amsterdam 1,143 people signed up. One of them was a maid, Neeltgen Cornelis, who put in 100 guilders.',
      'Why share? A ship can sink. If you own a small piece of many ships, one loss hurts less. Try it with pretend numbers.',
    ],
    extra: {
      label: 'Paid out',
      text: 'The VOC paid dividends that averaged about 18 percent a year for almost 200 years. Shares could be sold on, which is how the Amsterdam Exchange began.',
    },
  },
  {
    id: 'voyage',
    year: '1620s',
    short: 'Voyage',
    title: 'Five months at sea',
    paras: [
      'The ships sailed from the Netherlands to Batavia, now Jakarta, around Africa. With luck it took about five months.',
      'Many sailors never arrived. On 15 VOC ships between 1625 and 1631, an average of 14 in every 100 people died on the way. The luckiest ship lost 2 or 3. The unluckiest lost 30.',
    ],
    extra: {
      label: 'Scurvy',
      text: 'Most of the deaths came from scurvy and other diseases. The longer the voyage, the more people died. In 1652 the VOC founded Cape Town as a place to restock ships.',
    },
  },
  {
    id: 'tulip',
    year: '1637',
    short: 'Tulips',
    title: 'The tulip story',
    paras: [
      'In the 1630s tulips were a craze for the rich. The famous story says that in 1637 one bulb cost more than a house, and that thousands of people were ruined.',
      'Historians who read the old records say the real story was smaller. Compare the two.',
    ],
    extra: {
      label: 'Prices',
      text: 'A famous bulb, the Semper Augustus, was said to be offered at 10,000 guilders. That figure may be hearsay.',
    },
  },
  {
    id: 'studio',
    year: '1642',
    short: 'Rembrandt',
    title: 'Light the room',
    paras: [
      'Amsterdam also paid for paintings. In 1642 Rembrandt finished a huge group portrait of a militia company led by Captain Frans Banninck Cocq. Today we call it the Night Watch.',
      'It is 3.63 m by 4.37 m. Rembrandt was paid 1,600 guilders, and the men in the picture paid by how big a part they wanted. The captain and his lieutenant paid the most.',
      'Light is the whole trick. Drag the lamp across the dark room and see who steps out.',
    ],
    extra: {
      label: 'Pictures for everyone',
      text: 'An estimated 5 million paintings were made in the Dutch Republic between 1600 and 1700. A visitor wrote that there was hardly an ordinary tradesman whose house had no pictures.',
    },
  },
  {
    id: 'flip',
    year: 'Both',
    short: 'Two sides',
    title: 'Flip the coin',
    paras: ['Every coin has two sides. So far we have only looked at one of them.'],
  },
  {
    id: 'end',
    year: '1672',
    short: 'The end',
    title: 'The Disaster Year',
    paras: [
      'In 1672 France, England and two German bishoprics, Münster and Cologne, attacked the Republic at the same time. The Dutch opened their dikes and flooded their own land to stop the French army.',
      'The Dutch call it the Rampjaar, the Disaster Year. Many historians say the Golden Age ended here. The coin rolls on, but this is where the film stops.',
    ],
  },
];

export const passing: Passing[] = [
  {
    after: 'wind',
    lines: [
      { year: '1600', text: 'Dutch shipbuilders come up with the fluyt, a cargo ship that needs only a small crew. It makes shipping cheaper.' },
      { year: '1613', text: 'Amsterdam starts digging its famous ring of canals. It takes until 1662.' },
      { year: '1650', text: 'Amsterdam has grown from 54,000 people in 1600 to about 175,000.' },
      { year: '1670', text: 'The Dutch merchant fleet is 568,000 tons, about half of all the shipping in Europe.' },
    ],
  },
  {
    after: 'exchange',
    lines: [{ year: '1609', text: 'The Bank of Amsterdam opens. It is often called the first modern central bank.' }],
  },
  {
    after: 'voyage',
    lines: [{ year: '1634', text: 'Tulip bulbs have become a craze among collectors. A few years later it peaks.' }],
  },
  {
    after: 'studio',
    lines: [{ year: '1650s', text: 'Meanwhile, ships keep sailing. The coin has two sides, and we have only seen one.' }],
  },
];

// ---------------------------------------------------------------- the sawmill (station 2)

/** The same job done two ways: 60 beams. Days are the ones given in the sources. */
export const wind = {
  beams: 60,
  millDays: 5,
  handDays: 120,
};

// ---------------------------------------------------------------- the risk game (station 3)

/** How many ships the 100 guilders can be spread over. */
export const fleets = [1, 2, 5, 10, 20];

export const risk = {
  /** Pretend numbers: each ship comes home with this chance, and pays this much back. */
  chance: 0.85,
  payback: 1.6,
  stake: 100,
};

// ---------------------------------------------------------------- the voyage (station 4)

export const ships = [
  { id: 'lucky', label: 'Lucky', lost: 2.5 },
  { id: 'average', label: 'Average', lost: 14.4 },
  { id: 'unlucky', label: 'Unlucky', lost: 30 },
];

/** The sea route from the Netherlands to Batavia, as points on a map. Named points are landmarks. */
export const route: { lon: number; lat: number; where?: string }[] = [
  { lon: 4.2, lat: 52, where: 'Leaving the Netherlands' },
  { lon: -1.5, lat: 49.5 },
  { lon: -8, lat: 44 },
  { lon: -13, lat: 36 },
  { lon: -19, lat: 27, where: 'Past the Canary Islands' },
  { lon: -24, lat: 15 },
  { lon: -21, lat: 2, where: 'Crossing the equator' },
  { lon: -14, lat: -12 },
  { lon: -4, lat: -26 },
  { lon: 8, lat: -35 },
  { lon: 18, lat: -38, where: 'Rounding the Cape of Good Hope' },
  { lon: 32, lat: -37.5 },
  { lon: 55, lat: -36 },
  { lon: 80, lat: -31, where: 'Crossing the Indian Ocean' },
  { lon: 98, lat: -20 },
  { lon: 104, lat: -9 },
  { lon: 106.8, lat: -6.2, where: 'Arriving at Batavia' },
];

/** The voyage took about this many months with luck. */
export const voyageMonths = 5;

// ---------------------------------------------------------------- the tulips (station 5)

export const tulips = {
  /** A skilled craftsman's pay for a year, in guilders. */
  wage: 300,
  /** The highest price found in the records. */
  record: 5200,
  /** The asking price said to have been named for the Semper Augustus. */
  asking: 10000,
};

export const tulipViews = {
  legend: {
    title: 'The legend',
    items: [
      'One tulip bulb cost more than a house.',
      'Thousands of people lost everything when the prices crashed in 1637.',
      'The crash hurt the whole Dutch economy.',
    ],
  },
  records: {
    title: 'The records',
    items: [
      'The historian Anne Goldgar found fewer than 400 people who were surely in the trade. They were merchants and craftsmen.',
      'She found only 37 people who paid more than 300 guilders for a bulb. That is about what a skilled craftsman earned in a year.',
      'When prices fell, many buyers did not pay. The authorities let them cancel for about 3.5 percent of the price.',
      'She did not find one person who went bankrupt because of the crash.',
    ],
  },
};

// ---------------------------------------------------------------- the painting (station 6)

export const sitters = [
  { id: 'captain', name: 'Captain Frans Banninck Cocq', text: 'He led the militia company. He and his lieutenant paid the most for the painting.' },
  { id: 'lieutenant', name: 'Lieutenant Willem van Ruytenburch', text: 'The captain\'s second in command, and the other man who paid most. Rembrandt gave him light too.' },
  { id: 'guard', name: 'A guardsman', text: 'The other men paid by how big a part they wanted. Each one paid something like 100 guilders.' },
];

// ---------------------------------------------------------------- the coin (station 7)

export const sides = {
  bright: {
    title: 'The bright side',
    paras: [
      'Amsterdam grew from 54,000 people in 1600 to about 175,000 in 1650. In 1670 the Dutch fleet was about half of Europe\'s shipping.',
      'The guilder was a trusted coin all over Europe. The Bank of Amsterdam, opened in 1609, helped make it so.',
    ],
  },
  dark: {
    title: 'The other side',
    paras: [
      'The Dutch traded an estimated 600,000 enslaved Africans across the Atlantic. Almost half of them were shipped by the Dutch West India Company.',
      'In 1621 the VOC conquered the Banda Islands, the main home of nutmeg. Soldiers killed, drove out or enslaved almost all of the roughly 15,000 people who lived there. It is regarded as an act of genocide.',
    ],
  },
};

// ---------------------------------------------------------------- the end of the page

export const takeaways = [
  'The Dutch grew rich through trade. Wind-powered mills, cheap ships and shares in a company all pushed the same way.',
  'Shares let many people each take a small part of a big risk, so one lost ship did not ruin anyone.',
  'Tulip mania is partly a myth. The records show a smaller story than the legend.',
  'The same trade that made Amsterdam rich also ran on slavery and force, in the Atlantic and in the East Indies.',
  'The Golden Age was short. Many historians end it in 1672, the Disaster Year.',
];

export interface Source {
  label: string;
  url: string;
  for: string;
}

export const sources: Source[] = [
  { label: 'Exchange History: 400 years, the story', url: 'https://www.beursgeschiedenis.nl/en/the-story/', for: 'The VOC and the start of share trading in Amsterdam.' },
  { label: 'The World\'s First Stock Exchange: the world\'s first IPO', url: 'https://www.worldsfirststockexchange.com/2020/10/15/the-worlds-first-ipo/', for: 'The 1602 share sale, the 1,143 investors and the maid.' },
  { label: 'Wikipedia: Dutch East India Company', url: 'https://en.wikipedia.org/wiki/Dutch_East_India_Company', for: 'The company, its dividends and the Bank of Amsterdam link.' },
  { label: 'Wikipedia: Cornelis Corneliszoon van Uitgeest', url: 'https://en.wikipedia.org/wiki/Cornelis_Corneliszoon_van_Uitgeest', for: 'The wind sawmill of 1594 and how much faster it was.' },
  { label: 'Wikipedia: Fluyt', url: 'https://en.wikipedia.org/wiki/Fluyt', for: 'The cargo ship that needed a small crew, and the size of the Dutch fleet.' },
  { label: 'Wikipedia: Grachtengordel', url: 'https://en.wikipedia.org/wiki/Grachtengordel', for: 'The Amsterdam canal ring, from 1613.' },
  { label: 'Wikipedia: Timeline of Amsterdam', url: 'https://en.wikipedia.org/wiki/Timeline_of_Amsterdam', for: 'How many people lived in Amsterdam in 1600, 1622 and 1650.' },
  { label: 'South African Medical Journal: the Cape passage', url: 'https://journals.co.za/doi/pdf/10.10520/EJC68664', for: 'Deaths on VOC voyages to Batavia, 1625 to 1631, and the length of the voyage.' },
  { label: 'Wikipedia: Tulip mania', url: 'https://en.wikipedia.org/wiki/Tulip_mania', for: 'The prices in 1637 and what historians now say.' },
  { label: 'History.com: The real story behind tulip mania', url: 'https://www.history.com/articles/tulip-mania-financial-crash-holland', for: 'Anne Goldgar\'s findings: how few people were involved, and that no ruin was found.' },
  { label: 'Wikipedia: The Night Watch', url: 'https://en.wikipedia.org/wiki/The_Night_Watch', for: 'The size of the painting, the payment and the sitters.' },
  { label: 'Smarthistory: the Dutch art market in the 17th century', url: 'https://smarthistory.org/the-dutch-art-market-in-the-17th-century/', for: 'How many paintings were made and who owned them.' },
  { label: 'The Low Countries: the slave trade of the Dutch West India Company', url: 'https://www.the-low-countries.com/article/approved-by-the-bible-the-slave-trade-of-the-dutch-west-india-company/', for: 'The number of enslaved Africans carried by the Dutch.' },
  { label: 'Wikipedia: Dutch conquest of the Banda Islands', url: 'https://en.wikipedia.org/wiki/Dutch_conquest_of_the_Banda_Islands', for: 'The 1621 conquest of Banda.' },
  { label: 'Wikipedia: Rampjaar', url: 'https://en.wikipedia.org/wiki/Rampjaar', for: 'The Disaster Year of 1672.' },
];
