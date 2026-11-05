// Everything the "How hieroglyphs were read again" page says, in one place.
// A slab with three bands and three things to try: look at the three scripts on the stone, match the signs in two royal names the way
// Champollion did, and see how a script can mix signs for sounds with signs for meaning, with a toy picture puzzle. The history comes from
// the sources. The signs on the page are simplified shapes made for the page, not the real hieroglyphs, and the names are simplified.

export interface Band {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A stone that said the same thing three times',
  paras: [
    'For about 1400 years nobody could read the writing of ancient Egypt. Then in 1799 soldiers digging near the town of Rashid, which Europeans called Rosetta, found a broken slab of dark stone. It carried one decree in three scripts. One of them was Greek, which scholars could read. That gave them a way in.',
    'Three bands on the slab. In the first, look at the three scripts. In the second, match the signs in two royal names, the clue that opened the way. In the third, see how a script can use signs for sounds and signs for meaning at once. The signs on this page are simplified shapes made for the page, not the real hieroglyphs. Without a script each band shows one picture.',
  ],
};

export const bands: Band[] = [
  {
    id: 'three',
    kicker: 'First band',
    title: 'One decree, three scripts',
    paras: [
      'The stone is a priestly decree for the young king Ptolemy V, from 196 BCE, written out in hieroglyphs, in demotic and in Greek. It is a very ordinary text about honours for the king. What made it precious was not what it said, but that the same words were there three times.',
      'Press a band to read about it. Greek could be read, so the content was known. If the other two bands said the same, then each sign in them must stand for something in the Greek. That was the hope. It still took more than twenty years to turn it into a method.',
    ],
    tags: [
      { label: 'History', text: 'The stone was found in 1799. It passed to Britain after the French lost Egypt, and has been in the British Museum since 1802. Sources give July or August for the find, and 1801 or 1802 for the transfer.' },
    ],
  },
  {
    id: 'names',
    kicker: 'Second band',
    title: 'Two names with signs in common',
    paras: [
      'Royal names in hieroglyphs were written inside an oval loop called a cartouche. The Greek text said where the name Ptolemy occurred, so scholars could find the cartouche. Thomas Young saw that a foreign name had to be spelt by sound, and worked out some of the signs. Jean-François Champollion went much further. He compared the cartouches of Ptolemy and Cleopatra.',
      'Press a sign in the first name. The same sign is lit in the second name, with its sound. Both names have a p, a t, an o and an l, and the signs in the same positions were the same signs. That meant the signs were sounds, as in an alphabet. Champollion announced his result on 27 September 1822. The shapes and the spelling on this page are simplified.',
    ],
  },
  {
    id: 'mixed',
    kicker: 'Third band',
    title: 'Signs for sounds and signs for meaning',
    paras: [
      'Champollion showed that hieroglyphs were not all pictures of ideas, and not all sounds. They were a mixture. Some signs stood for sounds. Some stood for a whole word. And some, called determinatives, were put at the end of a word to say what kind of thing it was, without being said aloud.',
      'Here is a toy that works in the same spirit, with English. A picture puzzle, called a rebus, writes a word by the sounds of pictures. Press a puzzle to see the pictures, the sounds and the word. It is only a toy to show how pictures can stand for sound, and it is not how Egyptian worked.',
    ],
  },
];

export const takeaways = [
  'The Rosetta Stone carries one decree in three scripts: hieroglyphs, demotic and Greek. Greek could be read.',
  'Royal names were written in an oval called a cartouche. Signs shared by two names gave their sounds.',
  'Thomas Young made the first steps. Jean-François Champollion announced the method in 1822.',
  'Hieroglyphs mix signs for sounds, signs for whole words and signs that only say what kind of word it is.',
  'The decree was found in 1799 and is dated to 196 BCE. It has been in the British Museum since 1802.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The stone as a decree for Ptolemy V from 196 BCE in hieroglyphs, demotic and Greek, found in 1799 by French soldiers near Rashid, and held by the British Museum since 1802, appeared in several places. Sources differ on the month of the find (July or August 1799) and on whether the stone passed to Britain in 1801 or 1802, so the page gives both. Thomas Young’s early work, Champollion’s announcement on 27 September 1822, the comparison of the cartouches of Ptolemy and Cleopatra, and the mixed system of sound signs, whole word signs and determinatives each appeared in more than one place. Dates for Young’s work vary between sources, so no date is given for it. That the script had not been readable for about 1400 years is a rounded figure. The signs on the page are simplified shapes made for the page and the spelling of the two names is simplified, so the page says so. The rebus is a toy. Nothing here is advice.';

export const sources = [
  { label: 'Britannica: hieroglyphic writing, the discovery of the Rosetta Stone', url: 'https://www.britannica.com/topic/hieroglyphic-writing/Discovery-of-the-Rosetta-Stone', for: 'The find and the three scripts.' },
  { label: 'British Museum blog: finding the key to ancient Egypt', url: 'https://www.britishmuseum.org/blog/eureka-finding-key-ancient-egypt', for: 'Champollion and the cartouches.' },
  { label: 'Smithsonian: the Rosetta Stone helped to read ancient Egypt', url: 'https://www.smithsonianmag.com/history/rosetta-stone-hieroglyphs-champollion-decipherment-egypt-180980834/', for: 'The story of the decipherment.' },
  { label: 'History: what is the Rosetta Stone', url: 'https://www.history.com/articles/what-is-the-rosetta-stone', for: 'The find and the stone.' },
  { label: 'History: Champollion cracks the code', url: 'https://www.history.com/this-day-in-history/september-27/rosetta-stone-code-cracked', for: 'The announcement of 27 September 1822.' },
  { label: 'Wikipedia: Rosetta Stone', url: 'https://en.wikipedia.org/wiki/Rosetta_Stone', for: 'The stone and its decree.' },
  { label: 'Wikipedia: Rosetta Stone decree', url: 'https://en.wikipedia.org/wiki/Rosetta_Stone_decree', for: 'The date of 196 BCE.' },
  { label: 'Wikipedia: Jean-François Champollion', url: 'https://en.wikipedia.org/wiki/Jean-Fran%c3%a7ois_Champollion', for: 'His work and the cartouches.' },
  { label: 'Wikipedia: decipherment of ancient Egyptian scripts', url: 'https://en.wikipedia.org/wiki/Decipherment_of_ancient_Egyptian_scripts', for: 'Young, Champollion and the mixed script.' },
  { label: 'World History Encyclopedia: the Rosetta Stone', url: 'https://www.worldhistory.org/Rosetta_Stone/', for: 'The stone and its date.' },
  { label: 'Voices of Ancient Egypt: the Rosetta Stone, Champollion and Young', url: 'https://www.voicesofancientegypt.com/rosetta-stone-champollion-young/', for: 'Young and Champollion compared.' },
];
