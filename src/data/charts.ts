// Everything the "How a bar chart can mislead" page says, in one place.
// A slide show with three slides and three things to try: where the bars start, which months you show, and drawing a value as a length
// or as an area. The ideas come from the sources. All the numbers in the charts are made up for the page, and the page says so.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Every number true, and still a wrong picture',
  paras: [
    'A chart can be made entirely of true numbers and still leave the wrong idea in your head. The trick is not in the numbers. It is in what is drawn around them: where the axis starts, which stretch of time is shown, how a value is turned into a shape. Darrell Huff called one of these tricks the gee whiz graph in his book How to Lie with Statistics in 1954.',
    'Three slides to try. Move the start of the axis and watch a small difference grow. Pick which months to show and make the same line look like a rise or a fall. And draw a value as a circle, and see what happens to its area. All the numbers in the charts are made up for the page. Without a script each slide shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'baseline',
    kicker: 'First slide',
    title: 'Where the bars start',
    paras: [
      'A bar chart tells the eye that the length of a bar is the size of the value. That only works if the bars start at zero. Cut off the bottom of the axis and the bars are shorter than the values, and a small gap between two of them is blown up. Two products with 50 and 52 can look as if one is twice the other.',
      'Slide where the axis starts. The page says how many times as tall the second bar looks, and the true ratio of the two values. At zero the bars are honest. Past about 40 the picture is far from the truth.',
    ],
    tags: [
      { label: 'Check', text: 'In one study, 83.5 per cent of people judged the difference in a bar chart with a cut axis as larger than in one that starts at zero. The effect stayed even for people who were told about it. Sources say this rule is for bars, and that line charts are treated more leniently.' },
    ],
  },
  {
    id: 'window',
    kicker: 'Second slide',
    title: 'Which months to show',
    paras: [
      'A line is a story, and the story depends on where you start and stop. Take a long series that rises with ups and downs. Pick a stretch just after a dip and it shows a steep rise. Pick a stretch just after a peak and it shows a fall. Each stretch is true. Showing only one of them is not.',
      'Slide the first and last month to choose a window, or press a button to find the best or the worst stretch of at least six months. The page works out the change from the first to the last month of the window. Then it gives the change over the whole series.',
    ],
    tags: [
      { label: 'Check', text: 'The study of how deceptive charts are found that manipulated time intervals, and inverted axes, made viewers much less accurate. The series on this page is made up from a fixed seed.' },
    ],
  },
  {
    id: 'area',
    kicker: 'Third slide',
    title: 'Length or area',
    paras: [
      'A value can be drawn as a length, an area or a volume. If something is twice as big and you draw a circle with twice the radius, the area is four times as big, and it looks four times as big. The eye reads area, and the picture says more than the number. To draw a doubled value fairly, make the area double, which means the radius grows by the square root of two.',
      'Slide how many times bigger the value is. The page draws the first value, a circle whose radius grows by that factor, and a circle whose area grows by that factor. It gives the area ratio of the first. Some studies found that pictorial bars mislead only a little, so this is a risk and not a law.',
    ],
  },
];

export const takeaways = [
  'A bar chart should start at zero, because the eye reads the length of a bar as the value.',
  'Cutting the axis can make two values 50 and 52 look as if one is twice the other.',
  'A true line can tell opposite stories depending on the months you show.',
  'Doubling the radius of a circle makes the area four times as big. To show a doubled value, grow the radius by the square root of two.',
  'A chart is honest when the picture is in proportion to the numbers and the whole story is in view.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. A bar chart with a cut axis breaking the link between the length of a bar and the value, Huff calling them gee whiz graphs in How to Lie with Statistics in 1954, a study finding that 83.5 per cent of people judged the differences in truncated bar charts as larger and that the effect stayed after viewers were told, the study by Pandey and others in 2015 finding that misleading charts reduced accuracy, and inverted axes and manipulated time intervals being among the most misleading each appeared in at least two places. The same study found that some tricks, such as pictorial bars and compressed axes, had little effect, and the page says so. Line charts being treated more leniently than bar charts is a convention, which the sources describe and do not settle. Edward Tufte’s idea of a lie factor was looked for and could not be confirmed, so it is not on the page. The two products, the 24 months of a series and the circles are made up for the page, and the series is drawn from a fixed seed. The sums are computed on the page.';

export const sources = [
  { label: 'Wikipedia: misleading graph (archived)', url: 'https://webarchive.library.unt.edu/web/20131005031150/http://en.wikipedia.org/wiki/Misleading_graph', for: 'Kinds of misleading graph.' },
  { label: 'Tableau: truncating the y-axis, threat or menace', url: 'https://www.tableau.com/blog/truncating-y-axis-threat-or-menace', for: 'Huff, bars and lines.' },
  { label: 'Truncating the y-axis: threat or menace? (arXiv)', url: 'https://arxiv.org/pdf/1907.02035', for: 'Cut axes make differences look larger.' },
  { label: 'Yang and others: truncated axes persist (2021)', url: 'https://www.Gwern.net/doc/psychology/cognitive-bias/2021-yang-4.pdf', for: 'The 83.5 per cent.' },
  { label: 'Datawrapper: why bar charts start at zero', url: 'https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero', for: 'The zero baseline for bars.' },
  { label: 'Pandey and others: how deceptive are deceptive visualizations (Infogram summary)', url: 'https://infogram.com/blog/study-asks-how-deceptive-are-deceptive-visualizations', for: 'Which tricks mislead most.' },
  { label: 'Medium: how deceptive are deceptive visualizations', url: 'https://medium.com/@Infogram/study-asks-how-deceptive-are-deceptive-visualizations-8ff52fd81239', for: 'The study in short.' },
  { label: 'Northwestern: to cut or not', url: 'https://mucollective.northwestern.edu/files/2024-to_cut_or_not.pdf', for: 'Later work on cutting axes.' },
  { label: 'Santa Clara University: lie with a truncated y-axis', url: 'https://blogs.scu.edu/dataviz/2017/03/', for: 'Examples of cut axes.' },
  { label: 'Visualizing data: a misleading y-axis', url: 'https://www.lrs.org/?p=8711', for: 'A cut axis in practice.' },
];
