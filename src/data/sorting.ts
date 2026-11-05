// Everything the "How computers sort things" page says, in one place.
// A card table with three trays to try: sort a row by swapping neighbours and compare with the fewest swaps possible, watch three
// methods sort the same list, and see how the work grows with the size of the list. The methods are written out and run on the page,
// and the bounds come from the sources. The lists are drawn from fixed seeds.

export interface Tray {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Putting things in order, one comparison at a time',
  paras: [
    'A computer cannot look at a list and see at once that it is out of order. It can only compare two items and ask which is bigger. Sorting is the art of putting a list in order with as few of these comparisons as possible. It matters because everything from a phone book to a search result has to be sorted.',
    'Three trays on the table. In the first, sort a row of bars yourself by swapping neighbours, and see how few swaps were possible. In the second, watch three methods sort the same list. In the third, see how the work grows when the list gets longer. The methods are run on the page and the comparisons are counted. Without a script each tray shows one picture or table.',
  ],
};

export const trays: Tray[] = [
  {
    id: 'hand',
    kicker: 'First tray',
    title: 'Sort a row by hand',
    paras: [
      'Here are eight bars of different heights in a jumble. You may only swap a bar with the one to its right. Press a bar to swap it with its neighbour. The aim is to put them in order, shortest on the left.',
      'Every pair of bars that stands the wrong way round, a taller one to the left of a shorter one, is called an inversion. One swap of neighbours fixes exactly one inversion at most. So the fewest swaps that can sort a row is the number of inversions at the start, and the page tells you what it is. Beat it, if you can.',
    ],
  },
  {
    id: 'watch',
    kicker: 'Second tray',
    title: 'Three methods on one list',
    paras: [
      'Bubble sort walks along the list swapping any neighbours that are the wrong way round, again and again until nothing moves. Insertion sort takes each item in turn and slides it left until it meets a smaller one. Merge sort splits the list in halves, sorts each half, and then merges the two sorted halves by always taking the smaller of the two front items.',
      'Pick a method and press Next step, or Run. The page counts the comparisons and the moves. All three give the same sorted list, but not at the same cost. Press New list to try another one.',
    ],
    tags: [
      { label: 'History', text: 'John von Neumann is credited with merge sort in 1945. Sources give 1945 and a fuller description in a report of 1948.' },
    ],
  },
  {
    id: 'grow',
    kicker: 'Third tray',
    title: 'How the work grows',
    paras: [
      'Bubble and insertion sort compare a lot of pairs. On a long list the number can grow like the square of its length, so ten times as many items is about a hundred times the work. Merge sort grows much more slowly, a little more than the length itself.',
      'Slide the length of the list. The page sorts a shuffled list of that length with each method and counts the real comparisons. There is also a floor: no method that only compares pairs can always do better than the logarithm of n factorial. Merge sort comes close to it. Methods that do not compare, such as counting items, can get round the floor, but only for special kinds of data.',
    ],
  },
];

export const takeaways = [
  'A computer sorts by comparing two items at a time. A good method uses few comparisons.',
  'A swap of neighbours fixes one wrong pair at most, so the fewest such swaps is the number of inversions.',
  'Bubble sort and insertion sort can need about n times n minus 1, over 2 comparisons. Merge sort needs about n times the base 2 logarithm of n.',
  'Ten times as many items is about a hundred times the work for bubble sort, and only a little more than ten times for merge sort.',
  'No sort that only compares pairs can always beat the base 2 logarithm of n factorial. Merge sort comes close.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Merge sort credited to John von Neumann in 1945 with a fuller account in 1948 appeared in a reference source and several others. That a swap of neighbours removes exactly one inversion, so the fewest such swaps equals the inversions, that a list of n items has at most n times n minus 1, over 2 inversions, and that the average is n times n minus 1, over 4, appeared in lecture notes. That a comparison sort needs at least log base 2 of n factorial comparisons in the worst case, which is about n log n, appeared in several places, and merge sort meets the bound closely. The counts of comparisons on the page come from running plain versions of the three methods on seeded lists and may differ a little from other versions of the same methods, for instance a bubble sort that does not stop early. Counting sort and radix sort are mentioned only as ways to avoid comparing. Nothing here is advice.';

export const sources = [
  { label: 'Wolfram MathWorld: merge sort', url: 'https://mathworld.wolfram.com/MergeSort.html', for: 'Von Neumann and the date.' },
  { label: 'NVIDIA: merge sort explained', url: 'https://developer.nvidia.com/blog/merge-sort-explained-a-data-scientists-algorithm-guide/', for: 'How merge sort works.' },
  { label: 'Wikipedia: comparison sort', url: 'https://en.wikipedia.org/wiki/Comparison_sort', for: 'The lower bound on comparisons.' },
  { label: 'UC Irvine ICS 161: design and analysis of algorithms', url: 'https://www.ics.uci.edu/~eppstein/161/960116.html', for: 'The log of n factorial and Stirling.' },
  { label: 'GeeksforGeeks: lower bound for comparison sorting', url: 'https://www.geeksforgeeks.org/dsa/lower-bound-on-comparison-based-sorting-algorithms/', for: 'The decision tree argument.' },
  { label: 'Sort and Visualize: why n log n is the lower bound', url: 'https://sortandvisualize.com/docs/why-onlogn-is-the-lower-bound', for: 'Why comparing cannot go lower.' },
  { label: 'William & Mary: sorting (chapter 7)', url: 'https://www.cs.wm.edu/~tadavis/cs303/ch07m.pdf', for: 'Inversions and adjacent swaps.' },
  { label: 'University of Hong Kong: sorting, searching and selection', url: 'https://i.cs.hku.hk/~hkual/Notes/SearchingSorting/SortingSearchingSelection.html', for: 'Quadratic sorts.' },
  { label: 'Baeldung: insertion sort vs bubble sort', url: 'https://www.baeldung.com/cs/insertion-vs-bubble-sort', for: 'How the two methods compare.' },
  { label: 'Interview Kickstart: bubble, selection and insertion sort', url: 'https://interviewkickstart.com/blogs/learn/comparison-among-bubble-sort-selection-sort-and-insertion-sort', for: 'Costs of the simple methods.' },
  { label: 'Medium: sorting in linear time', url: 'https://medium.com/@prajun_t/sorting-in-linear-time-166d7b9d2394', for: 'Ways round the comparison floor.' },
];
