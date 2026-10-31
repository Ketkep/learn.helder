// Everything the "How an abacus works" page says, in one place.
// A counting house with three abacus frames and three things to try: reading the rods, adding with a carry,
// and comparing the Chinese and Japanese layouts. The history comes from the sources. The sums are worked out on the page.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Place value you can push with a finger',
  paras: [
    'An abacus is a frame of rods with beads that slide. Each rod is one place in a number: units, tens, hundreds. Beads pushed toward the beam in the middle count, and beads left away from it do not. The idea is the same as written numbers, but the digits are made of beads, and a person can add, subtract, multiply and divide by moving them. Counting boards and abacuses were used for thousands of years, long before paper sums.',
    'Three frames to try. Push beads and read the number. Add two numbers rod by rod and watch a carry. And compare the Chinese layout, which has extra beads, with the Japanese one. The page works out each sum for you. The history comes from the sources, and where they disagree the page says so. Without a script each frame shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'read',
    kicker: 'First frame',
    title: 'Read the rods',
    paras: [
      'On a Japanese abacus, called a soroban, each rod has one bead above the beam, worth five, and four beads below it, each worth one. The beads that are pushed to the beam count. A rod with the upper bead and two lower beads at the beam reads 5 plus 2, which is 7. The rightmost rod is the units, the next is the tens, and so on.',
      'Push the beads to set a number, or type one. The page reads the number from the rods. There are seven rods, so the biggest number is 9,999,999. Every digit from 0 to 9 has one way to be shown.',
    ],
  },
  {
    id: 'add',
    kicker: 'Second frame',
    title: 'Add with a carry',
    paras: [
      'To add on an abacus, you set the first number and then add the second one rod at a time, starting with the units. If a rod would go past nine, it keeps the amount over ten and one is carried to the next rod. It is the same carry as in a written sum, but you can see it happen as beads move.',
      'Choose two numbers and press next to go step by step. The page says which rod you are on and what it holds. With a long run of nines, such as 999 plus 1, the carry travels all the way along.',
    ],
  },
  {
    id: 'designs',
    kicker: 'Third frame',
    title: 'Two layouts',
    paras: [
      'The Chinese abacus, the suanpan, has two beads above the beam and five below. A rod can show anything from 0 to 15. That is more than a digit, and some numbers can be shown in two ways, such as 5, which is one upper bead or five lower beads. The extra room was used for carrying and for sums in which one unit was made of 16 parts. The Japanese layout has one bead above and four below, so a rod shows 0 to 9 and each digit has one way.',
      'Pick a layout and a value. The page lists every way to show it. The Roman hand abacus also had one bead above and four below, so it looks like the soroban, although the soroban came from the suanpan.',
    ],
    tags: [
      { label: 'History', text: 'A tablet found on the Greek island of Salamis in 1846, from about 300 BC, is the oldest counting board found so far. The earliest written mention of the Chinese suanpan is from the second century BC. The one above, four below layout appeared in Japan around 1930, by one source, and the abacus reached Japan in the 14th century or about 1600, depending on the source.' },
    ],
  },
];

export const takeaways = [
  'Each rod of an abacus is one place in a number, and beads pushed to the beam count.',
  'On a soroban a rod has one upper bead worth five and four lower beads worth one, so it shows 0 to 9 in exactly one way.',
  'To add, you work rod by rod from the units, and carry one to the next rod when a rod would pass nine.',
  'The suanpan has two upper and five lower beads. A rod can show 0 to 15, and some values can be shown in two ways.',
  'The oldest counting board found so far is the Salamis tablet from about 300 BC.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. A soroban rod with one upper bead worth five and four lower beads worth one, the units rod on the right, the beads at the beam being the ones counted, the carry to the next rod, the suanpan with two upper and five lower beads, the Roman hand abacus with one above and four below, the Salamis tablet found in 1846 and dated to about 300 BC, and the earliest written mention of the suanpan in the second century BC each appeared in at least two places. Sources differ on when the one above, four below layout appeared in Japan (about 1930 for that layout) and on when the abacus reached Japan (the 14th century or about 1600), and the page says so. The use of the extra beads of the suanpan for a unit of 16 and for carrying is described by the sources, and the page does not give more detail. A contest between an abacus and a calculator in 1946 was suggested, and no source confirmed it, so the page leaves it out. The sums are computed on the page.';

export const sources = [
  { label: 'Wikipedia: abacus (archived copy)', url: 'https://webarchive.library.unt.edu/web/20161213142909/https://en.wikipedia.org/wiki/Abacus', for: 'The history and the layouts.' },
  { label: 'Toronto Metropolitan University: abacus history', url: 'https://www.ecb.torontomu.ca/~elf/abacus/history.html', for: 'The Salamis tablet and the suanpan.' },
  { label: 'Slide Rule Museum: abaci', url: 'https://sliderulemuseum.com/Abaci.shtml', for: 'Kinds of abacus.' },
  { label: 'Wikipedia: Roman abacus', url: 'https://www.wikipedia.org/wiki/Roman_abacus', for: 'The Roman hand abacus.' },
  { label: 'New World Encyclopedia: abacus', url: 'https://www.newworldencyclopedia.org/entry/Abacus', for: 'The history of the abacus.' },
  { label: 'Cuemath: abacus history', url: 'https://cuemath.com/learn/abacus-history', for: 'How the abacus spread.' },
  { label: 'Woodcraft: using a soroban', url: 'https://www.woodcraft.com/blog_entries/using-a-soroban-japanese-abacus?tag=How_To', for: 'Reading a number on a soroban.' },
  { label: 'YM Imports: how to use a soroban abacus', url: 'https://www.ymimports.com/pages/how-to-use-a-soroban-abacus', for: 'Adding and carrying.' },
  { label: 'Kellscraft: Roman numerals and counting devices (Wikipedia mirror, Salamis)', url: 'https://solarspell-dls.sfis.asu.edu/mea/wikipedia/wp/a/Abacus.htm', for: 'The abacus in different places.' },
];
