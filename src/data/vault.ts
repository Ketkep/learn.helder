// Everything the "Why long passwords are strong" page says, in one place.
// A vault door with three locks to try: how the number of tries grows with each extra place, how words compare with random characters, and
// why a password that follows a habit is weaker than it looks. The sums are plain maths. The speeds of the attacks and the sizes of the
// sets of habits are round numbers made up for this page, and the page says so. It explains the maths and is not security advice.

export interface Lock {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A lock with no key, only guesses',
  paras: [
    'Someone who wants to get into an account without the password has only one way: guess. A guess costs a little time, and the number of guesses needed depends on how many possible passwords there are. This page is about that sum. It explains the maths and is not security advice. For your own accounts, follow the guidance of the service you use.',
    'Three locks on the vault door. On the first, see how the number of tries grows with each extra place in the password. On the second, compare a few random words with random characters. On the third, see why a password that follows a habit is weaker than it looks. The speeds and the sizes of the habits on this page are round numbers made up for the page. Without a script each lock shows one picture or table.',
  ],
};

export const locks: Lock[] = [
  {
    id: 'length',
    kicker: 'First lock',
    title: 'Every extra place multiplies the tries',
    paras: [
      'A password made of random characters has as many possibilities as the number of choices for each place, multiplied once for every place. Eight places with 26 choices give 26 to the power 8, which is about 209 billion. Add one more place and the number is multiplied by 26 again. Strength is often written in bits. Each bit doubles the number of tries.',
      'Pick the set of characters and slide the length. The page shows the bits and the average time to hit the right password for three kinds of attacker. The speeds are made up: one guess a second for a web login that limits the guesses, ten thousand a second for a stolen file protected by a slow hash, and ten billion a second for a stolen file with a fast hash. Real speeds differ and sources give different figures.',
    ],
    tags: [
      { label: 'Why length wins', text: 'Adding one place multiplies the work by the size of the set. Adding a kind of character to a short password only makes the set a little bigger. That is why guidance now tends to ask for longer passwords and not for odd mixes of characters.' },
    ],
  },
  {
    id: 'words',
    kicker: 'Second lock',
    title: 'Words against characters',
    paras: [
      'A password can be made of random words as well as random characters. A list of 7776 words, as used for dice-picked passphrases, gives about 12.9 bits for each word, because 7776 is 6 to the power 5. Four words picked at random give about 51.7 bits, as much as eight random characters from all 94 keys on a keyboard, which give about 52.4 bits.',
      'Slide the number of words and the number of characters. The words are easier to remember and to type, but only if they are really picked at random, by dice or by a program, and not chosen by a person. A phrase from a song or a saying does not count as random.',
    ],
  },
  {
    id: 'habit',
    kicker: 'Third lock',
    title: 'A habit is not random',
    paras: [
      'An attacker does not try passwords in a random order. They try the likely ones first: common passwords, words with a number added, names and dates. A password that follows a habit has few real possibilities, however complicated it looks. A word, a capital, two digits and a symbol has the look of a strong password and the strength of a weak one.',
      'Pick a kind of password. The page shows its strength in bits and the time to guess it at the speed of a stolen file with a fast hash. The sizes of the sets of habits are made up. Real attackers use lists of passwords that have leaked in the past, and some services block those passwords for that reason.',
    ],
  },
];

export const takeaways = [
  'The strength of a random password is its length times the base 2 logarithm of the size of the set it is drawn from. Each bit doubles the tries.',
  'One more place multiplies the number of tries by the size of the set. Length matters more than odd mixes of characters.',
  'Four words picked at random from 7776 are about as strong as eight random characters from 94.',
  'A password that follows a habit has far fewer real possibilities than it looks.',
  'The speeds of the attacks on this page are made up. The page explains the maths and gives no security advice.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. That strength is the length times the base 2 logarithm of the size of the set, and the arithmetic of 26 to the 8 and 94 to the 8, are plain maths and were computed. That guidance has moved from forced mixes of characters towards length, that it asks services to block passwords that have leaked and to limit failed guesses, and that passwords should be stored hashed, appeared in several places, but sources disagree on the exact minimum length (8, 12 or 15), so the page gives none. That slow hashes cut the speed of a stolen file attack from billions of guesses a second to thousands, that a web login can be limited, and that attackers try likely passwords first, appeared in several places. The speeds on the page, one a second, ten thousand a second and ten billion a second, are round numbers made up for the page, inspired by the order of magnitude in the sources. A word list of 7776 words and 12.9 bits a word is general knowledge about dice-picked passphrases and was not confirmed in the search, so the page says only that such lists are used. The sizes of the sets of habits are made up. Nothing here is security advice.';

export const sources = [
  { label: 'Wikipedia: password strength', url: 'https://en.wikipedia.org/wiki/Password_strength', for: 'Entropy in bits and the strength of passwords.' },
  { label: 'Wikipedia: password policy', url: 'https://en.wikipedia.org/wiki/Password_policy', for: 'The move from complexity rules to length.' },
  { label: 'Wikipedia: password cracking', url: 'https://en.wikipedia.org/wiki/Password_cracking', for: 'Dictionary and brute force attacks.' },
  { label: 'arXiv: system password security, attack and defence', url: 'https://arxiv.org/pdf/2510.10246', for: 'Attack and defence mechanisms.' },
  { label: 'Hive Systems: the password table', url: 'https://www.hivesystems.com/blog/are-your-passwords-in-the-green', for: 'Guess speeds against different hashes.' },
  { label: 'Password Strength: how hackers crack passwords', url: 'https://www.passwordstrength.io/blog/how-hackers-crack-passwords', for: 'Brute force and dictionary attacks.' },
  { label: 'DEV Community: SHA-256 vs bcrypt', url: 'https://dev.to/doogal/sha-256-vs-bcrypt-why-speed-kills-password-security-337e', for: 'Why a slow hash cuts the guess rate.' },
  { label: 'Have I Been Pwned: NIST-compliant password checking', url: 'https://haveibeenpwned.com/NIST', for: 'Checking passwords against leaked lists.' },
  { label: 'SailPoint: NIST 800-63B', url: 'https://www.sailpoint.com/identity-library/nist-800-63b', for: 'Guidance on length and blocklists.' },
  { label: 'Start-up Defense: NIST password guidelines', url: 'https://www.startupdefense.io/blog/nist-password-guidelines', for: 'What the guidance asks for.' },
  { label: 'Captain DNS: NIST password recommendations', url: 'https://www.captaindns.com/en/blog/nist-2025-password-recommendations', for: 'Changes in the guidance.' },
];
