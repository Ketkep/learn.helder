// Everything the "Secret writing" page says, in one place.
// A cipher wheel and four tries: shift a message, break it by counting letters, count the keys, and hide the counts.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A wheel of letters',
  paras: [
    'A cipher hides a message by changing its letters by a rule. The simplest rule is to slide every letter along the alphabet by the same number of places. If the shift is 3, A becomes D, B becomes E, and so on, and the end of the alphabet wraps round to the start. This is called a Caesar cipher, after Julius Caesar, who is said to have used it.',
    'Four tries follow. Each is a toy cipher for learning. None of them is safe to use for anything that matters. Without a script, each panel shows a worked example.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'wheel',
    kicker: 'Try one',
    title: 'The wheel',
    paras: [
      'Two rings of letters sit one inside the other. The outer ring is the message. The inner ring turns, and each letter of the message is swapped for the letter of the inner ring that sits under it. The number of places you turn it is the key.',
      'Type a message and turn the wheel. Turn it the other way by the same amount and the secret message becomes readable again. A shift of 13 is special: doing it twice gets you back to the start, so it needs no separate way to decode.',
    ],
    tags: [{ label: 'ROT13', text: 'A shift of 13 is called ROT13. It is used on the internet to hide a spoiler or a joke so that you have to choose to read it. It hides nothing from anyone who tries.' }],
  },
  {
    id: 'break',
    kicker: 'Try two',
    title: 'Break it by counting',
    paras: [
      'There are only 25 shifts, so you could try them all. There is a faster way. In English some letters are used far more than others. E is the most common, then T and A. When you shift a message, the most common letter shifts too. So the tallest bar in the cipher text gives away the key.',
      'The chart shows how often each letter appears in the secret message, with the usual English pattern below it. Turn the guess until the two patterns line up. The idea was first written down by the scholar al-Kindi in the Arab world, in the 9th century.',
    ],
    tags: [{ label: 'Letter counts', text: 'In a long English text E makes up about 12.7 per cent of the letters, T about 9.1 per cent and A about 8.2 per cent. A short message may not follow this closely.' }],
  },
  {
    id: 'keys',
    kicker: 'Try three',
    title: 'More keys',
    paras: [
      'A shift cipher has only 25 keys. A harder rule is to give every letter its own partner, so A might become Q, B become X and so on. The number of ways to do that is 26 × 25 × 24 and so on down to 1, which is about 4 × 10 to the power of 26. That is far too many to try one by one.',
      'Slide the number of guesses a computer can make each second and see how long it would take to try every key. Then remember the lesson of the last panel: counting letters still breaks this cipher, without trying the keys.',
    ],
    tags: [{ label: 'A toy sum', text: 'The time is the number of keys divided by the guesses per second, on average half of that. The speeds here are made up for the page, and this says nothing about any real system.' }],
  },
  {
    id: 'keyword',
    kicker: 'Try four',
    title: 'Hide the counts',
    paras: [
      'A Vigenère cipher uses a keyword. The first letter of the message is shifted by the first letter of the keyword, the second by the second, and when the keyword runs out it starts again. The same letter now turns into different letters, so the letter counts are flatter and the trick of the last panel stops working.',
      'Type a keyword and compare the chart with the one for a plain shift. For a long time this cipher was thought unbreakable. In the 1800s Charles Babbage and Friedrich Kasiski found ways to find the length of the keyword and then count letters one position at a time.',
    ],
    tags: [{ label: 'History', text: 'The cipher is named after Blaise de Vigenère, who described it in 1586, though others described similar ones earlier. Kasiski published a method of breaking it in 1863, and Babbage had found one earlier without publishing it.' }],
  },
];

export const takeaways = [
  'A Caesar cipher slides every letter along the alphabet by the same number of places. The shift is the key.',
  'It has only 25 keys and also falls to letter counting: E is the most common English letter, so the tallest bar in the cipher text points to the shift.',
  'Letter counting was first written down by al-Kindi in the 9th century.',
  'Giving every letter its own partner makes about 4 × 10 to the power of 26 keys, too many to try, but counting letters still breaks it.',
  'A keyword (Vigenère) cipher flattens the counts by shifting by different amounts, and it held out until the 1800s.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The Caesar cipher as a shift of the alphabet, al-Kindi and letter counting in the 9th century, the Vigenère cipher as a series of shifts by the letters of a keyword, Babbage’s unpublished break around the 1840s and Kasiski’s published method in 1863, and the English letter shares (E 12.7, T 9.1, A 8.2 per cent) each appeared in at least two places. The sources differ on who first described the Vigenère cipher (Belaso in 1553, Vigenère in 1586) and on the date of Babbage’s break (1846 or 1854), so the page only says the 1800s for Babbage. The number of letter arrangements (26 factorial, about 4.03 × 10 to the power of 26) was computed. These ciphers are toys and are not safe to use.';

export const sources = [
  { label: 'Wikipedia: Caesar cipher', url: 'https://en.wikipedia.org/wiki/Caesar_cipher', for: 'The shift cipher and ROT13.' },
  { label: 'Encyclopaedia mirror: Vigenère cipher', url: 'https://classicistranieri.com/en/v/i/g/Vigen%C3%A8re_cipher.html', for: 'The keyword cipher and who broke it.' },
  { label: 'Northern Kentucky University: Vigenère cryptanalysis (PDF)', url: 'https://www.nku.edu/~christensen/section%2014%20vigenere%20cryptanalysis.pdf', for: 'Kasiski’s method.' },
  { label: 'Queen Mary University of London: classical ciphers (PDF)', url: 'https://webspace.maths.qmul.ac.uk/j.n.bray/MTH6115/ocn3.pdf', for: 'Shift, substitution and Vigenère ciphers.' },
  { label: 'Naskręcki: the Vigenère cipher and Kasiski examination', url: 'https://bnaskrecki.faculty.wmi.amu.edu.pl/crypto/book/part2_classical_polyalphabetic/ch05_vigenere_kasiski.html', for: 'Finding the length of the keyword.' },
  { label: 'Wikipedia: letter frequency', url: 'https://en.wikipedia.org/wiki/Letter_frequency', for: 'Shares of the English letters.' },
  { label: 'Emory University: letter frequencies in English', url: 'https://math.oxford.emory.edu/site/math125/englishLetterFreqs/', for: 'The order e, t, a, o, i, n.' },
  { label: 'Smith College: English letter frequency patterns', url: 'https://idpnode02.smith.edu/?p=59250', for: 'Letter patterns in English.' },
  { label: 'University of Babylon: ciphers (PDF)', url: 'https://www.uobabylon.edu.iq/eprints/paper_11_1363_649.pdf', for: 'Early cipher history.' },
];
