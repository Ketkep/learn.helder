// Everything the "How punctuation was invented" page says, in one place.
// An open book with three spreads and three things to try: words run together, a comma that changes the meaning,
// and one sentence through time. The history comes from the sources. The sentences are made up for the page.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Marks that keep a sentence from running away',
  paras: [
    'Punctuation is not a rule of nature. People invented it, a piece at a time, to help a reader. Late ancient writing had no spaces between words, no capitals and little or no punctuation. The reader had to work it out. Over many centuries scribes and printers added dots, spaces, commas and the rest.',
    'Three spreads of an open book to try. Put the spaces back into words that have been run together. Move a comma and watch a meaning change. And follow one sentence from the old way of writing to ours. The sentences are made up for the page. The history comes from the sources, and where they disagree the page says so. Without a script each spread shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'run',
    kicker: 'First spread',
    title: 'Words run together',
    paras: [
      'Try reading a line with no spaces. You do it by guessing where the words end, and sometimes you guess wrong, or there is more than one way to guess. Ancient writing was often like this, and a reader often read aloud to make sense of it.',
      'Type the words with the spaces put back in. The letters have to stay the same. The first line has two readings, and both are real. Which did the writer mean? With no spaces, you cannot tell.',
    ],
    tags: [
      { label: 'History', text: 'A study of the history of reading says that scribes in Irish monasteries began to separate words in the seventh century. Sources differ on when it became usual on the continent, between the ninth and the twelfth century.' },
    ],
  },
  {
    id: 'comma',
    kicker: 'Second spread',
    title: 'A comma changes the meaning',
    paras: [
      'A comma is a small thing with a large effect. It tells the reader where to pause and where one idea ends and another starts. Move one and a sentence can say something else.',
      'Switch the commas on and off in each sentence. The page says what each version means. The first one is a joke you may know. The last one is based on a real dispute in the United States, and says nothing about what the law should be.',
    ],
    tags: [
      { label: 'History', text: 'In 2017 a United States court of appeals found a Maine overtime law unclear because a list had no comma before “or distribution”. The drivers won, and the dairy later agreed to pay about 5 million dollars. This page only reports what the court said about the sentence.' },
    ],
  },
  {
    id: 'time',
    kicker: 'Third spread',
    title: 'One sentence through time',
    paras: [
      'Here is the same short text written four ways. The first has letters run together, the second adds dots, the third adds spaces, and the fourth has the marks we know, with capitals, commas, full stops and a question mark.',
      'Pick a stage. The page gives the rough time and place, and what the sources say. These are simplified steps, and real writing changed unevenly in different places.',
    ],
    tags: [
      { label: 'Check', text: 'The dates here are the ones most sources agree on. The origin of the question mark is disputed, so it is left out. The semicolon of 1494 is a popular claim that was not confirmed in a primary source.' },
    ],
  },
];

export const takeaways = [
  'Late ancient writing often had no spaces, no capitals and little or no punctuation, so the reader had to work out the words.',
  'Irish scribes of the seventh century began to put spaces between words, and the habit spread over the next centuries.',
  'Aristophanes of Byzantium is credited with dots at three heights. Printers such as Aldus Manutius gave us much of the punctuation we use now.',
  'A comma shows where to pause and where an idea ends. Moving one can change what a sentence says.',
  'Punctuation was invented to help readers, a piece at a time, and it is still being argued over.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Late ancient writing with no spaces, capitals or punctuation, Irish scribes beginning to separate words in the seventh century, Aristophanes of Byzantium and his dots at three heights, the work of Aldus Manutius and his printers on the comma, the full stop and the semicolon, and the Maine overtime case of 2017 (the comma before “or distribution”, the ruling for the drivers and a settlement of about 5 million dollars) each appeared in at least two places. Sources differ on when word spaces became usual on the continent (from the ninth to the twelfth century), on how widely the dots of Aristophanes were used, on who made the question mark, and on the year of the semicolon, which is a popular claim for 1494 that could not be checked in a primary source, so the page leaves the question mark out and calls the date a popular claim. The sentences on the spreads are made up for the page, and their readings are plain language, not legal advice.';

export const sources = [
  { label: 'Britannica: punctuation', url: 'https://www.britannica.com/topic/punctuation/Introduction', for: 'Aristophanes and the later history.' },
  { label: 'Wikipedia: punctuation', url: 'https://en.wikipedia.org/wiki/Punctuation', for: 'The history of the marks.' },
  { label: 'Encyclopedia.com: punctuation', url: 'https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/punctuation', for: 'Marks in medieval manuscripts.' },
  { label: 'Today I Found Out: when did people start using punctuation', url: 'https://www.todayifoundout.com/?p=47038', for: 'The story in short.' },
  { label: 'University of British Columbia: the origins of silent reading', url: 'https://blogs.ubc.ca/originsofsilentreading/silent-reading-development/', for: 'Word spaces and reading.' },
  { label: 'Aleteia: the space between words, an invention of monks', url: 'https://aleteia.org/2024/01/30/the-space-between-words-an-invention-of-monks/', for: 'Irish monks and the first spaces.' },
  { label: 'Boston Magazine: Oxford comma decides a court case', url: 'https://www.bostonmagazine.com/?p=2252231', for: 'The Maine case.' },
  { label: 'ABA Journal: Oxford comma issue benefits drivers', url: 'https://www.abajournal.com/news/article/oxford_comma_issue_benefits_drivers_in_overtime_case', for: 'The ruling for the drivers.' },
  { label: 'Smithsonian: a missing Oxford comma changed a court case', url: 'https://www.smithsonianmag.com/smart-news/missing-oxford-comma-just-changed-course-court-case-180962551/', for: 'The ruling and the sentence.' },
  { label: 'Word Smarts: who invented punctuation', url: 'https://wordsmarts.com/who-invented-punctuation/', for: 'Aldus and the semicolon.' },
];
