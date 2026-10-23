// Everything the "How computers fix their own mistakes" page says, in one place.
// A postal sorting office with a wire that flips bits, and four things to try: a noisy wire, saying it three times, one check bit, and three circles that find the bad bit.
// The sums are exact and computed by the page. The sources give the history and the QR code levels.

export interface Panel {
  id: string;
  stamp: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A wire that flips bits',
  paras: [
    'Everything a computer stores or sends is a row of bits, each a 0 or a 1. A scratch on a disc, a burst of static on a line or a stray particle can flip a bit. A flipped bit can turn one letter into another. Computers cope by sending a little extra, in a clever way, so that the receiver can tell that something went wrong, and often put it right.',
    'Four things to try. See what a noisy wire does to a letter. Say everything three times and vote. Add one check bit. And find a flipped bit with three circles, the idea of Richard Hamming. The sums are exact, and the page works them out itself. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'noise',
    stamp: '1',
    kicker: 'Counter one',
    title: 'The noisy wire',
    paras: [
      'A letter is stored as eight bits. The letter H is 01001000. Suppose each bit on the wire has a small chance of being flipped. The chance that all eight arrive unharmed is one minus that chance, eight times over. With 1 flip in 10, only about 43 letters in 100 arrive intact.',
      'Slide the chance of a flip, then send the letter. Each press uses fresh random flips, so you will see a different result each time.',
    ],
  },
  {
    id: 'triple',
    stamp: '2',
    kicker: 'Counter two',
    title: 'Say it three times',
    paras: [
      'The simplest fix is to send every bit three times and let the receiver take a vote. A bit is wrong only if at least two of its three copies flip. With a flip chance of p, that is 3p² minus 2p³ or, in plain numbers, three times p squared, times one minus p, plus p cubed. For small p this is much smaller than p.',
      'Slide the chance of a flip. The price is steep: three times as many bits for the same letter. Better codes pay much less.',
    ],
  },
  {
    id: 'check',
    stamp: '3',
    kicker: 'Counter three',
    title: 'One check bit',
    paras: [
      'A cheaper trick adds one bit so that the number of ones is always even. This is a parity bit. If one bit flips, the count turns odd, and the receiver knows something is wrong. But it cannot tell which bit, so it cannot fix it. And if two bits flip, the count is even again and the error slips through.',
      'Press the bits to flip them. Try one flip, then two.',
    ],
  },
  {
    id: 'circles',
    stamp: '4',
    kicker: 'Counter four',
    title: 'Three circles',
    paras: [
      'In 1950 Richard Hamming, at Bell Labs, published a code that finds and fixes a single flipped bit. He had been working with a relay computer that ran jobs unattended at weekends and simply moved on to the next job when it hit an error. The code takes four bits of message and adds three check bits, seven in all. Each of three circles must hold an even number of ones. When a bit flips, the circles that fail point straight at it.',
      'Set the four message bits. Then press any bit to flip it. The circles that fail turn red, and the decoder puts the bit right. Then try flipping two bits and see what happens.',
    ],
    tags: [
      { label: 'Checked here', text: 'When this page loads it tries every one of the 16 messages with every one of the 7 single flips. That is 112 cases, and the decoder puts all of them right. With two flips it is wrong every time, which is the limit of this code.' },
      { label: 'In real life', text: 'QR codes use a stronger code, Reed Solomon. At the lowest setting a QR code can restore up to 7 per cent of its data, and at the highest up to 30 per cent, at the cost of room for the message. Shannon showed in 1948 that with good enough codes a message can be sent almost without error, up to a limit set by the noise.' },
    ],
  },
];

export const takeaways = [
  'Bits get flipped by noise and scratches. Computers send extra bits so the receiver can notice and often fix the damage.',
  'Sending each bit three times and voting turns an error chance of p into 3p² minus 2p³, at three times the cost.',
  'One parity bit detects a single flip but cannot say which bit it was, and misses two flips.',
  'The Hamming code uses three checks for four message bits. The failed checks spell out the place of the flipped bit. It fixes any single flip and fails on two.',
  'Real codes are stronger. A QR code can lose 7 to 30 per cent of its data and still be read, depending on the setting.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Hamming’s code published in 1950 and the story of the relay machine that moved on after errors at weekends, the (7,4) shape, the failed checks pointing at the position of the bad bit, Shannon’s theorem of 1948, the vote of three copies failing with chance 3p² minus 2p³, and the four QR code levels of 7, 15, 25 and 30 per cent each appeared in at least two places. Sources differ on whether the machine read punched tape or punched cards, so the page does not say. The page does not say how much of a disc or a QR code real scratches destroy. The sums for the noisy wire, the vote and the circles are exact and are computed on the page. The parity bit facts are standard coding theory.';

export const sources = [
  { label: 'Wikipedia: Hamming code', url: 'https://en.wikipedia.org/wiki/Hamming_code', for: 'The code, its history and the (7,4) form.' },
  { label: 'IEEE Computer Society: Richard Hamming', url: 'https://history.computer.org/pioneers/hamming.html', for: 'Hamming and Bell Labs.' },
  { label: 'Quantum Zeitgeist: Richard Hamming', url: 'https://quantumzeitgeist.com/richard-hamming/', for: 'The weekend relay machine story.' },
  { label: 'Wikipedia: noisy channel coding theorem', url: 'https://en.wikipedia.org/wiki/Noisy-channel_coding_theorem', for: 'Shannon’s limit.' },
  { label: 'MIT: notes on noisy coding', url: 'https://math.mit.edu/~goemans/18310S15/noisy-coding-notes.pdf', for: 'Repetition codes and their cost.' },
  { label: 'LibreTexts: repetition codes', url: 'https://eng.libretexts.org/Bookshelves/Electrical_Engineering/Introductory_Electrical_Engineering/Electrical_Engineering_(Johnson)/06%3A_Information_Communication/6.25%3A_Repetition_Codes', for: 'The chance that a vote of three fails.' },
  { label: 'CircuitBread: repetition codes', url: 'https://www.circuitbread.com/textbooks/fundamentals-of-electrical-engineering-i/information-communication/repetition-codes', for: 'The same sum, worked in another way.' },
  { label: 'DevExpress: QR code error correction levels', url: 'https://docs.devexpress.com/OfficeFileApiJava/com.devexpress.docs.barcode.QRCodeErrorCorrectionLevel', for: 'The four levels of 7, 15, 25 and 30 per cent.' },
  { label: 'Aspose: QR error levels', url: 'https://reference.aspose.com/barcode/net/aspose.barcode.generation/qrerrorlevel', for: 'The same four levels.' },
];
