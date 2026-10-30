// Everything the "How a nerve fires" page says, in one place.
// An oscilloscope with four screens and four things to try: the threshold, a stronger push giving more spikes,
// the rest after a spike, and how fast a signal travels. The voltages and speeds come from the sources.
// The timings of the spike are rounded and made up for the page, and the page says so. Not medical advice.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A signal that is either there or not',
  paras: [
    'A nerve cell sends a message as a brief jump in the voltage across its skin, called a spike or an action potential. At rest the inside of the cell sits about 70 millivolts below the outside. A push that lifts it to about 55 millivolts below sets off a spike. A push that falls short does nothing. The spike always has the same size, and it travels along the cell like a flame along a fuse.',
    'Four screens of an oscilloscope to try. Push a cell and see the threshold. Push harder and see more spikes. Send two pushes close together. And race a signal down a nerve with and without a fatty sheath. The page makes a toy cell with rounded, made up timings, but the voltages and speeds are from the sources. Without a script each screen shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'push',
    kicker: 'First screen',
    title: 'The threshold',
    paras: [
      'A cell at rest sits at about minus 70 millivolts. Tiny channels in its skin let sodium ions in when the voltage climbs to about minus 55. That lets in more sodium, which pushes the voltage higher, which opens more channels. The voltage shoots up to about plus 35 and then falls back, a little below where it began.',
      'Slide the size of the push. Below the threshold the voltage just fades back. At or above it, a full spike. A push twice as big does not make a bigger spike. This is the all or nothing rule.',
    ],
    tags: [
      { label: 'Check', text: 'Sources give the threshold as about minus 55 millivolts, and one uses minus 50. The peak is given as about plus 30 to plus 40, and the undershoot as about minus 80. The timings in the drawing are rounded and made up.' },
    ],
  },
  {
    id: 'train',
    kicker: 'Second screen',
    title: 'Harder push, more spikes',
    paras: [
      'If every spike is the same, how does a cell say that something is strong? It spikes more often. A steady push that is just above the threshold makes a slow rhythm of spikes. A stronger push makes them come faster. This is called rate coding.',
      'Slide a steady push over a tenth of a second. The page counts the spikes. There is a limit: just after a spike the cell cannot fire again for a short time, which the next screen shows. In this toy that time is 2 milliseconds, so the fastest rate is under 500 spikes a second.',
    ],
    tags: [
      { label: 'Check', text: 'Sources agree that a stronger push means more spikes and not bigger ones. They give the top rate as about 200 to 500 spikes a second, depending on the refractory period they assume.' },
    ],
  },
  {
    id: 'two',
    kicker: 'Third screen',
    title: 'A rest after every spike',
    paras: [
      'Right after a spike the sodium channels are stuck shut for a moment. During this absolute refractory period no push, however big, can start another spike. After it comes a relative refractory period, when the voltage is still below rest and only a stronger push works. Then the cell is ready again.',
      'A first spike starts at 1 millisecond. Slide the time of a second push and its size. In this toy the absolute period is 2 milliseconds and the relative period lasts to 5, and a push then needs to be two and a half times the usual size. Those timings are made up for the page.',
    ],
  },
  {
    id: 'speed',
    kicker: 'Fourth screen',
    title: 'How fast it travels',
    paras: [
      'A spike moves along the long fibre of a nerve cell. In a bare fibre it travels at about 0.5 to 2 metres a second. Many fibres are wrapped in a fatty sheath called myelin, with small gaps called nodes. The spike jumps from node to node and travels at about 70 to 120 metres a second. That is how a signal reaches your foot or your hand in a fraction of a second.',
      'Slide the length of the fibre. The page works out the time with 1 metre a second for a bare fibre and 100 for a myelinated one. These are round values from inside the ranges in the sources.',
    ],
    tags: [
      { label: 'History', text: 'Alan Hodgkin and Andrew Huxley worked out the ionic basis of the spike in 1952 with the giant axon of the squid. They shared the Nobel Prize in Physiology or Medicine in 1963 with John Eccles, who was honoured for work on synapses.' },
    ],
  },
];

export const takeaways = [
  'A nerve cell at rest sits about 70 millivolts below the outside. A push to about 55 millivolts below sets off a spike.',
  'A spike is all or nothing: below the threshold nothing happens, and above it the spike always has the same size.',
  'A stronger push gives more spikes a second, not bigger ones. This is rate coding.',
  'After a spike there is a short rest, the refractory period, which limits the rate to a few hundred a second.',
  'Myelin lets a spike jump between nodes, at about 70 to 120 metres a second, against about 0.5 to 2 in a bare fibre.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. A resting voltage of about minus 70 millivolts, a threshold of about minus 55, a peak of about plus 30 to plus 40, an undershoot of about minus 80, sodium channels opening at the threshold, the all or nothing rule, stronger pushes giving more spikes, the refractory periods, speeds of 70 to 120 metres a second with myelin and 0.5 to 2 without, and Hodgkin and Huxley in 1952 with the Nobel Prize in 1963 each appeared in at least two places. Sources differ on the threshold (minus 55 or minus 50), on the peak, and on the top rate (about 200 to 500 spikes a second). No source checked gave the length of a spike or of the refractory periods, so the timings on the page (a spike of 4 milliseconds, an absolute period of 2 and a relative period to 5) are rounded and made up, and the rule that a push in the relative period must be two and a half times as big is made up. The model cell in the second screen is a simple leaky membrane, a toy. The speeds of 1 and 100 metres a second are round values inside the ranges. The sums are computed on the page. Nothing here is medical advice.';

export const sources = [
  { label: 'Cuyamaca College: action potential worksheet', url: 'https://www.cuyamaca.edu/student-support/tutoring-center/files/student-resources/action-potential-physiology-worksheet.pdf', for: 'The voltages and the phases.' },
  { label: 'Varsity Tutors: understanding action potentials', url: 'https://students.varsitytutors.com/practice/subjects/ap-biology/flashcards/understanding-action-potentials', for: 'Resting voltage, threshold and the pump.' },
  { label: 'JoVE: action potential, phases of stimulation', url: 'https://www.jove.com/science-education/10844/', for: 'The peak and the undershoot.' },
  { label: 'Wikipedia: squid giant axon', url: 'https://en.wikipedia.org/wiki/Squid_giant_axon', for: 'Hodgkin, Huxley and the Nobel Prize.' },
  { label: 'Morris: the nerve impulse (textbook)', url: 'https://digfir-published.macmillanusa.com/morris2e/morris2e_ch35_13.html', for: 'Myelin and the speed of a signal.' },
  { label: 'University of Cyprus: lecture on nerve conduction', url: 'https://www.kios.ucy.ac.cy/cpitris/wp-content/uploads/2024/05/Lecture-5b.pdf', for: 'Speeds with and without myelin.' },
  { label: 'Oxford University Press: Galvani’s spark, the story of the nerve impulse', url: 'https://academic.oup.com/book/8014/chapter/153378643', for: 'The history of the nerve impulse.' },
  { label: 'PhysiologyWeb: frequency coding in the nervous system', url: 'https://www.physiologyweb.com/lecture_notes/neuronal_action_potential/neuronal_action_potential_frequency_coding_in_the_nervous_system.html', for: 'More spikes, not bigger spikes.' },
  { label: 'TutorChase: impulse transmission and frequency coding', url: 'https://www.tutorchase.com/notes/a-level-ocr/biology/7-3-4-impulse-transmission-and-frequency-coding', for: 'Rate coding.' },
  { label: 'Pearson: the refractory period', url: 'https://pearson.com/channels/anp/learn/bruce/nervous-tissue-and-nervous-system/the-refractory-period?isTpi=Y', for: 'Absolute and relative periods.' },
];
