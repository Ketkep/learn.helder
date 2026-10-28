// Everything the "How a barcode is read" page says, in one place.
// A checkout lane with four scanner windows and four things to try: digits to bars, the check digit,
// catching a typo, and a smudge on the bars.
// The patterns and the check rule come from the sources (the UPC-A code). The counts are computed on the page.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Twelve digits in a row of stripes',
  paras: [
    'The stripes on a pack of tea are a number. In the common UPC-A code the number has 12 digits, and each digit is drawn as a pattern of 7 narrow slots, each one dark or light. A scanner sweeps a beam across the stripes, measures how long it sees dark and light, and turns the lengths back into digits. The last digit is not part of the product number. It is a check on the other eleven.',
    'Four scanner windows to try. See how digits become bars. Work out the check digit. Make a typo and see if the check catches it. Then smudge the stripes and see what the scanner does. The code in the windows is an example. You can type your own 11 digits. Without a script each window shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'bars',
    kicker: 'Window one',
    title: 'From digits to bars',
    paras: [
      'A UPC-A code is 95 slots wide. It starts with a guard of three slots, dark, light, dark. Then come six digits of 7 slots each, a middle guard of five slots, six more digits, and an end guard like the start. Each digit has its own pattern. On the right half the patterns are the left ones turned inside out, dark where the left had light. That way a scanner can tell which half it is looking at, and which way up the code is.',
      'Type 11 digits. The page works out the twelfth and draws the whole code. The guards are drawn a little longer than the digits.',
    ],
    tags: [
      { label: 'Check', text: 'The patterns, the guards and the 95 slots appear in several guides to the UPC-A code. Sources describe the right guard a little differently, and this page uses the three slots of dark, light, dark.' },
    ],
  },
  {
    id: 'check',
    kicker: 'Window two',
    title: 'The check digit',
    paras: [
      'The twelfth digit is worked out from the first eleven. Add the digits in places 1, 3, 5, 7, 9 and 11, counting from the left, and multiply by 3. Add the digits in places 2, 4, 6, 8 and 10. Add the two results. Take the last digit of the total. If it is 0, the check digit is 0. Otherwise it is 10 minus that last digit.',
      'The page shows each step for the code in the window. Change a digit and watch the sums move. The scanner does the same sum on what it reads, and compares the answer with the twelfth digit.',
    ],
  },
  {
    id: 'typo',
    kicker: 'Window three',
    title: 'Catch the typo',
    paras: [
      'A check digit is for typing mistakes, and for reading mistakes. Change one digit of a code and the check no longer matches, every time. The weights 3 and 1 never cancel out when only one digit changes. Swapping two neighbouring digits is caught most of the time. It slips through only when the two digits differ by exactly 5, because the sum changes by twice the difference, which is a multiple of 10.',
      'Pick a place and a new digit, or swap two neighbours. The page says whether the changed code passes. Below that it tries every one digit mistake and every swap for the code in the window.',
    ],
    tags: [
      { label: 'Idea', text: 'No check digit catches everything. This one catches every single wrong digit and most swaps, and it costs one digit.' },
    ],
  },
  {
    id: 'scan',
    kicker: 'Window four',
    title: 'A smudge on the stripes',
    paras: [
      'A scanner measures the widths of the bars and the gaps, not their size. So the same code can be big or small, as long as the narrowest bar is wide enough for the scanner to see. The code also needs a blank margin, called the quiet zone, around it so the scanner knows where the stripes begin.',
      'Flip one or two slots, as a smudge or a gap would. The page reads the stripes back the way a scanner does. Every digit pattern here has an odd number of dark slots on the left and an even number on the right, so a single smudge makes a pattern that is not a digit. Two smudges in one digit can turn it into another digit, and then the check digit catches it.',
    ],
    tags: [
      { label: 'History', text: 'The first product with a UPC was scanned on 26 June 1974 at a Marsh supermarket in Troy, Ohio. It was a pack of Wrigley’s chewing gum, and sources differ on which kind and the price. Woodland and Silver had applied in 1949 for a code of circles. The rectangular design of George Laurer at IBM became the standard.' },
    ],
  },
];

export const takeaways = [
  'A UPC-A code is 95 slots wide: three of guard, six digits of seven, five in the middle, six more digits and three of guard.',
  'The right half of the digit patterns is the left half turned inside out, so a scanner knows which half it sees.',
  'The twelfth digit comes from the other eleven: three times the odd places plus the even places, then ten minus the last digit.',
  'The check catches every wrong single digit and every swap of neighbours, except those that differ by exactly 5.',
  'A scanner uses the widths of the stripes, so the size does not matter. A smudge gives a pattern that is not a digit, or a code that fails the check.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The 7 slots of each digit, the guards of 3, 5 and 3 slots, the 95 slots in all, the first six digits on the left and the last six on the right, the right patterns being the left ones inverted, the check rule (3 times the odd places plus the even places, then ten minus the last digit modulo 10), the widths and not the size being what a scanner measures, the quiet zone, the first scan on 26 June 1974 in Troy, Ohio, Woodland and Silver in 1949 and Laurer’s rectangular design each appeared in at least two places. The ten patterns were checked against a table in one source for digits 0 to 5 and the rest follow the standard table. Sources differ on the right guard, on the kind of gum and its price, and on the exact day in 1973 when the code was chosen, so the page does not give that day. The claim that one changed digit is always caught and a swap of digits that differ by 5 is not comes from the sum, and is computed on the page. The counts of smudges are computed on the page for the code in the window.';

export const sources = [
  { label: 'Aspose: UPC-A', url: 'https://docs.aspose.com/barcode/info-cards/upc-a/', for: 'The structure of a UPC-A code.' },
  { label: 'Seagull Scientific: UPC-A', url: 'https://barcodeguide.seagullscientific.com/Content/Symbologies/upc_a.htm', for: 'The guards and the digits.' },
  { label: 'Tungsten Automation: UPC-A', url: 'https://docshield.tungstenautomation.com/KC/en_US/11.1.0-40hy9nfk91/help/main/KC_administration/barcode/c_upc_a.html', for: 'The bit patterns of the digits.' },
  { label: 'Yasoob Khalid: understanding UPC-A', url: 'https://yasoob.me/posts/understanding-and-generating-upc-a-barcode-using-python/', for: 'The check digit sum.' },
  { label: 'GS1 UK: how to calculate your check digit', url: 'https://www.gs1uk.org/sites/default/files/how_to_calculate_your_check_digit.pdf', for: 'The check digit rule.' },
  { label: 'GS1 UK: the history of the barcode', url: 'https://www.gs1uk.org/insights/news/the-history-of-the-barcode', for: 'Woodland, Silver and the first scan.' },
  { label: 'IBM: the UPC', url: 'https://www.ibm.com/mx-es/history/upc', for: 'Laurer and the rectangular design.' },
  { label: 'History.com: the first barcode scan', url: 'https://www.history.com/this-day-in-history/barcode-scanner-invention-first-use', for: 'The first scan on 26 June 1974.' },
  { label: 'MIT Technology Review: behind bars', url: 'https://www.technologyreview.com/2003/04/01/234345/behind-bars/', for: 'How the barcode was invented.' },
  { label: 'Keyence: barcode mechanisms', url: 'https://www.keyence.com/ss/products/auto_id/barcode_lecture/basic/mechanism/', for: 'Scanners measure widths.' },
  { label: 'Leuze: bar code detection', url: 'https://files.leuze.com/shopware/media/d5/2e/a8/1639045065/wp_lab-automation_bar_code_detection_chapter_02.pdf', for: 'The quiet zone and the narrow element.' },
];
