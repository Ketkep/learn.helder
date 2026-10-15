// Everything the "How a search engine works" page says, in one place.
// A card room with four drawers: crawl, index, order by words and order by links.
// The web in the pictures is made up: eight small pages of a garden club.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A room full of cards',
  paras: [
    'A search engine does its work before you type anything. A program called a crawler visits pages by following links. The words on each page are written on index cards, filed by word. When you search, the engine finds the cards, puts the pages in an order and shows you the first few.',
    'Four drawers try the steps on a made up web of eight small pages. The pages, the scores and the ranks are a toy model, small enough to follow by hand. Real search engines use many more signals and keep the details private. Without a script each drawer shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'crawl',
    kicker: 'Drawer one',
    title: 'Follow the links',
    paras: [
      'A crawler starts with a few known pages. It reads a page, notes every link on it, and puts the new addresses in a queue. Then it visits the next one in the queue. This is how a search engine finds pages that exist on the web.',
      'Press the button to visit one page at a time. A page that no other page links to can be missed. Site owners can also hand a list of their pages to the engine, which is a sitemap.',
    ],
  },
  {
    id: 'index',
    kicker: 'Drawer two',
    title: 'The index cards',
    paras: [
      'The engine does not read every page again when you search. It keeps an index: for every word, a card that lists the pages that contain it. Looking up a word is then quick, like finding a card in a drawer.',
      'Type one or more words. With several words, the engine keeps only the pages that are on every card.',
    ],
    tags: [{ label: 'Real size', text: 'This index has 35 words and 8 pages. The index of a real engine is a huge database with an entry for every word it has seen, spread over many computers.' }],
  },
  {
    id: 'words',
    kicker: 'Drawer three',
    title: 'Order by words',
    paras: [
      'Many pages can match. A first way to order them is to count how often the words appear, as a share of the page. A second idea is that rare words tell you more than common ones. A word that is on every page, such as the word the, says nothing about which page is the answer.',
      'Pick a search. Switch the weighing of rare words on and off. This is the idea behind a score called tf idf.',
    ],
  },
  {
    id: 'links',
    kicker: 'Drawer four',
    title: 'Order by links',
    paras: [
      'A page that many pages link to is probably useful. A link from an important page counts for more. PageRank, the idea behind the first Google, turns this into sums. Picture a person who clicks links at random. A page’s rank is how often that person lands on it. Now and then the person gets bored and jumps to a random page, which happens 15 per cent of the time in the usual setting.',
      'Slide the rounds. In round 0 every page has the same rank. Each round, every page shares its rank among the pages it links to. The ranks settle after a few rounds. Then add one link and watch the ranks move.',
    ],
    tags: [{ label: 'One signal of many', text: 'Real engines mix many signals. Links are only one of them, and the details are not public. Treat this as the idea, not as how any real engine ranks pages.' }],
  },
];

export const takeaways = [
  'A crawler finds pages by following links. A page that nothing links to can be missed.',
  'An index lists, for every word, the pages that contain it. That is why a search is fast.',
  'A page can be scored by how often the words appear, and rare words count for more than common ones.',
  'A link is like a vote, and a vote from an important page counts for more. PageRank turns this into a rank that settles after a few rounds.',
  'The web and the numbers on this page are a toy model. Real engines use many more signals.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Crawling by following links and reading sitemaps, the index as a catalogue of words and the pages they are on, the random surfer, the damping factor of 0.85 (a 15 per cent chance of a random jump), the PageRank sum with a share of rank divided over the outgoing links, and tf idf as the share of a word times the log of the number of pages over the number of pages with the word, each appeared in at least two places. Google’s own documentation could not be read, and the sources are mostly secondary explainers. The web of eight pages, the page texts, the scores and the ranks are made up and were computed for this page. The page does not describe how any real search engine orders its results.';

export const sources = [
  { label: 'GeeksforGeeks: how Google Search works', url: 'https://www.geeksforgeeks.org/?p=1080659', for: 'Crawling, indexing and ranking.' },
  { label: 'Perficient: how Google’s search results work', url: 'https://blogs.perficient.com/2016/12/21/how-googles-search-results-work-crawling-indexing-and-ranking/', for: 'The three stages.' },
  { label: 'arXiv: PageRank, standing on the shoulders of giants', url: 'https://arxiv.org/pdf/1002.2858', for: 'The idea and the maths of PageRank.' },
  { label: 'arXiv: a survey of PageRank', url: 'https://arxiv.org/pdf/1201.4787.pdf', for: 'The random surfer and the damping factor.' },
  { label: 'TigerGraph: PageRank', url: 'https://docs.tigergraph.com/graph-ml/3.8/centrality-algorithms/pagerank', for: 'The formula and the rounds.' },
  { label: 'Lucidar: PageRank and the random surfer', url: 'https://lucidar.me/en/seo/pagerank-random-surfer/', for: 'The random surfer.' },
  { label: 'O’Reilly: tf idf', url: 'https://oreilly.com/library/view/text-mining-with/9781491981641/ch03.html', for: 'Word and document frequency.' },
  { label: 'Episteme: tf idf', url: 'https://episteme.tllm.fr/wiki/TF-IDF', for: 'Why rare words weigh more.' },
];
