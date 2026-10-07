// Everything the "Morse code" page says, in one place.
// The page is a strip of paper tape coming out of a telegraph. Each message on the tape is one idea.

export interface Message {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'The tape starts here',
  paras: [
    'Morse code writes letters as short and long signals: dots and dashes. A dot lasts one beat and a dash lasts three. It was made for the telegraph in the 1830s and 1840s, and the same code is still used today.',
    'This tape has four messages, and each one has something to try. Sound is on by default, with a switch above. Your browser keeps sound locked until your first click or key press. Everything also works without sound.',
  ],
};

export const messages: Message[] = [
  {
    id: 'key',
    kicker: 'Message one',
    title: 'Tap the key',
    paras: [
      'A telegraph key is a switch. Press it for a short time to send a dot. Press it for three times as long to send a dash. Leave a gap of about three beats between letters, and about seven between words.',
      'Press and hold the big key below, with the mouse, a finger or the space bar. The tool turns your taps into letters. If timing is hard, the four buttons under the key do the same job.',
    ],
    tags: [
      { label: 'SOS', text: 'SOS is three dots, three dashes and three dots, sent without gaps between the letters. The 1906 international radio rules chose that pattern because it is easy to send and easy to recognise. It was not first an abbreviation of any words.' },
    ],
  },
  {
    id: 'tree',
    kicker: 'Message two',
    title: 'Walk the tree',
    paras: [
      'Every letter is a path of dots and dashes. Start at the top and take a dot to go left or a dash to go right. The letter you end on is the letter you spelled. E is one step left. T is one step right.',
      'The whole alphabet fits on one tree. Press Dot and Dash to walk down it, and watch which letters come up on the way.',
    ],
  },
  {
    id: 'common',
    kicker: 'Message three',
    title: 'Short for the common ones',
    paras: [
      'Samuel Morse and his assistant Alfred Vail gave the shortest codes to the letters that are used most. E is the most common letter in English and its code is a single dot. T is next, and its code is a single dash. Vail is said to have counted the type in the cases of a printer in Morristown, New Jersey, to see which letters were used most.',
      'Sort the bars. Then shuffle the codes between the letters and see how much longer an ordinary message takes to send.',
    ],
    tags: [
      { label: 'English only', text: 'The frequencies are for English text. Other languages use their letters differently, so the code fits English better than it fits them.' },
    ],
  },
  {
    id: 'play',
    kicker: 'Message four',
    title: 'Hear it and copy it',
    paras: [
      'Morse is a code you hear, and timing is everything. A dot is 1 unit of time and a dash is 3. The gap inside a letter is 1 unit, between letters 3 units and between words 7 units. Speed is counted in words per minute, where one word is PARIS and the gap after it, which together are exactly 50 units long.',
      'Type a message and play it back. Or press Give me a word, and try to copy it from the sound, or from the flashing lamp.',
    ],
    tags: [
      { label: 'The first message', text: 'On 24 May 1844 Samuel Morse sent “What hath God wrought” along a wire from Washington to Baltimore, about 60 km away. Alfred Vail read it off a paper tape at the other end. A young woman called Annie Ellsworth chose the words.' },
    ],
  },
];

export const takeaways = [
  'Morse code writes letters as dots and dashes. A dash lasts three times as long as a dot.',
  'The gaps carry meaning too: 1 unit inside a letter, 3 between letters and 7 between words.',
  'Every letter is a path in a tree: a dot goes left and a dash goes right.',
  'The most common letters have the shortest codes. E is one dot and T is one dash.',
  'Speed is counted in words per minute. The word PARIS and the gap after it, 50 units together, is the standard.',
  'SOS is a pattern of three dots, three dashes and three dots. It was not first an abbreviation.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The unit lengths (1, 3, 1, 3 and 7), the 50 units of PARIS and its word gap, the first telegraph message of 24 May 1844 and the SOS rules of 1906 each appeared in at least two places. The letter frequencies are from a standard table for English; the five largest (E, T, A, I and N) were checked in two places and the rest are from the table. The tools are simple models made for this page. How much longer a message takes with shuffled codes comes from the English table, so it will differ for other texts.';

export const sources = [
  { label: 'ITU-R M.1677-1: International Morse code', url: 'https://www.itu.int/rec/R-REC-M.1677-1-200910-I/en', for: 'The official rules for the code and its timing.' },
  { label: 'Wikipedia: Morse code', url: 'https://en.wikipedia.org/wiki/Morse_code', for: 'History, the alphabet and the timing units.' },
  { label: 'John D. Cook: ITU Morse code (PDF)', url: 'https://www.johndcook.com/ITU_Morse_Code.pdf', for: 'A one page table of the code and its units.' },
  { label: 'Morse Code World: timing', url: 'https://morsecode.world/international/timing.html', for: 'The word PARIS and words per minute.' },
  { label: 'Linda Hall Library: Samuel F. B. Morse', url: 'https://www.lindahall.org/samuel-f-b-morse/', for: 'Morse and the telegraph.' },
  { label: 'History.com: What hath God wrought', url: 'https://www.history.com/this-day-in-history/may-24/what-hath-god-wrought', for: 'The first message on 24 May 1844.' },
  { label: 'John D. Cook: how efficient is Morse code?', url: 'https://www.johndcook.com/blog/2017/02/08/how-efficient-is-morse-code/', for: 'Short codes for common letters.' },
  { label: 'Wikipedia: SOS', url: 'https://en.wikipedia.org/wiki/SOS', for: 'The 1906 Berlin convention and the SOS signal.' },
  { label: 'Wikipedia: letter frequency', url: 'https://en.wikipedia.org/wiki/Letter_frequency', for: 'English letter frequencies (E 12.7 per cent, T 9.1 per cent).' },
];
