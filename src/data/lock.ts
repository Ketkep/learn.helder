// Everything the "How a lock works" page says, in one place.
// Four benches in a workshop, from a wooden peg lock to the brass pins of a modern lock.

export interface Bench {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'From a wooden peg to a brass pin',
  paras: [
    'A lock holds a bolt in place with parts that only the right key moves out of the way. That idea is very old. The four benches below start with a lock made of wood and end with the pins in most door locks today.',
    'Each bench has a lock you can try. These are toy versions made for this page. Without a script, each bench shows one picture and its numbers.',
  ],
};

export const benches: Bench[] = [
  {
    id: 'wood',
    kicker: 'Bench one',
    title: 'The wooden peg lock',
    paras: [
      'One of the oldest kinds of lock is made of wood. A bolt on the door has holes in it. Loose pegs sit above the holes and drop into them, so the bolt cannot slide. The key is a wooden bar with upright prongs. Push it in and each prong lifts one peg out of its hole.',
      'Try three keys. Only a key with the right number of prongs, the right distance apart, lifts all the pegs at once.',
    ],
    tags: [
      { label: 'Very old', text: 'A lock like this was found at the palace of Khorsabad, in what is now Iraq. Britannica says it may be 4,000 years old. It is often called the Egyptian lock because it was widely used in Egypt. Scholars still argue about which find is the oldest.' },
    ],
  },
  {
    id: 'pins',
    kicker: 'Bench two',
    title: 'Pins and the shear line',
    paras: [
      'Most door locks today use the same idea with metal pins. A round plug sits inside a housing and turns when you turn the key. Pins stand in holes that cross the gap between the plug and the housing. That gap is called the shear line. Springs push the pins down, so in a locked lock the pins stop the plug from turning.',
      'Each hole holds two pins: a key pin at the bottom and a driver pin above it. The cuts of the right key lift each pair by exactly the right amount, so the gap between the two pins sits on the shear line. Push a key in and watch the pins ride its cuts.',
    ],
    tags: [
      { label: 'Yale', text: 'Linus Yale Jr. patented a pin lock with a small flat key in the 1860s. Sources give 1861 and 1865 for his patents. Most door locks still follow his pattern.' },
    ],
  },
  {
    id: 'cut',
    kicker: 'Bench three',
    title: 'Cut your own key',
    paras: [
      'Each cut on a key has a depth from 0 to 9. A deeper cut needs a longer key pin to reach the shear line. Change the cuts below. A pin that does not split at the shear line stops the plug. Here you can see the pins, but in a real lock they are hidden inside.',
      'Being close is not enough. One cut that is a single step too deep or too shallow is enough to block the lock.',
    ],
    tags: [
      { label: 'A toy lock', text: 'This lock has five pins and ten depths. Real locks vary, and their parts are far smaller than the picture.' },
    ],
  },
  {
    id: 'count',
    kicker: 'Bench four',
    title: 'How many keys',
    paras: [
      'Each pin can have any of the depths, so the number of different keys is the number of depths multiplied by itself once for each pin. Five pins with ten depths make 10 × 10 × 10 × 10 × 10 = 100,000 keys.',
      'Makers also limit how different two neighbouring cuts may be, so a key does not get a steep cliff that would wear or break. That removes some of the keys. Change the number of pins, the depths and the limit.',
    ],
    tags: [
      { label: 'A toy count', text: 'This counts possible keys only. It says nothing about how safe a real lock is, which depends on much more, such as how well the parts are made.' },
    ],
  },
];

export const takeaways = [
  'A lock holds a bolt or plug in place with parts that only the right key moves out of the way.',
  'In a wooden peg lock, prongs on the key lift loose pegs out of holes in the bolt. The prongs must be the right number and the right distance apart.',
  'In a pin lock, springs push pairs of pins across the shear line. The right key lifts each pair by exactly the right amount, so the gap between its two pins sits on the shear line.',
  'One pin that is a single step off is enough to block the plug.',
  'The number of possible keys is the number of depths to the power of the number of pins. Five pins and ten depths make 100,000, and fewer when neighbouring cuts are limited.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The wooden peg lock with a key that lifts pegs and the age of about 4,000 years at Khorsabad, the pin, spring, shear line and key pin and driver pin parts, Linus Yale Jr. and a small flat key in the 1860s, and the number of keys as depths to the power of pins each appeared in at least two places. The sources disagree on the Yale dates (1848 for his father, 1861 and 1865 for the son), so only the 1860s are given, and scholars question which find is the oldest lock. The key count with a limit on neighbouring cuts was checked by counting every key one by one. The locks on this page are toy models made for this page.';

export const sources = [
  { label: 'Britannica: lock (security device)', url: 'https://www.britannica.com/technology/lock-security/Introduction', for: 'The wooden peg lock from Khorsabad.' },
  { label: 'Potts: lock and key in ancient Mesopotamia (PDF)', url: 'https://www.yeshiva.org.il/midrash/pdf/wiki/potts_1990_-_lock_and_key_in_ancient_mes.pdf', for: 'Why the oldest lock is still argued about.' },
  { label: 'Wikipedia: pin tumbler lock', url: 'https://en.wikipedia.org/wiki/Pin_tumbler_lock', for: 'Pins, springs, plug and shear line.' },
  { label: 'Wikipedia: Linus Yale Jr.', url: 'https://en.wikipedia.org/wiki/Linus_Yale_Jr.', for: 'The small flat key and the patents.' },
  { label: 'Yale: history', url: 'https://yale.co.uk/history-of-yale', for: 'Patents of 1861 and 1865.' },
  { label: 'Lemelson-MIT: Linus Yale', url: 'https://lemelson.mit.edu/resources/linus-yale', for: 'The Yale lock shop and the early locks.' },
  { label: 'LockWiki: pin tumbler', url: 'https://lockwiki.com/index.php/Pin-tumbler', for: 'Key pins and driver pins.' },
  { label: 'Science ABC: how a pin tumbler lock works', url: 'https://www.scienceabc.com/innovation/pick-door-locks-pin-tumbler-sherlock-doors-open', for: 'How the pins hold the plug, and how the key frees it.' },
  { label: 'The Engineering Mindset: how padlocks work', url: 'https://theengineeringmindset.com/how-padlocks-work/', for: 'The right key splits the pins at the shear line.' },
  { label: 'LockWiki: differs', url: 'https://lockwiki.com/index.php/Differs', for: 'Key combinations and the limit on neighbouring cuts.' },
];
