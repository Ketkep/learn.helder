// Everything the "How fast can you react" page says, in one place.
// A test bench with three things to try: time your own reaction to a signal, see how far something moves in that time, and compare a simple
// reaction with a choice between two. The tests run in your browser and nothing is saved or sent anywhere. The typical times come from the
// sources, which differ a little. This is not a medical test and not advice.

export interface Bench {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A quarter of a second',
  paras: [
    'When something happens, you do not react at once. The light has to reach your eye, your eye has to send a signal, your brain has to notice and decide, and a signal has to travel to a muscle. All that takes time. For a simple signal and a simple action, it comes to roughly a fifth to a quarter of a second.',
    'Three tests on the bench. In the first, time your own reaction. In the second, see how far something moves in that time. In the third, compare a simple reaction with a choice between two. The tests run in your browser, and nothing is saved or sent anywhere. This is a toy and not a medical test, and the page gives no advice. Without a script each test shows one picture or table.',
  ],
};

export const benches: Bench[] = [
  {
    id: 'test',
    kicker: 'First test',
    title: 'Time your own reaction',
    paras: [
      'Press Start. After a wait of a random length, the box changes to say Now. Press the big button, or the space bar, as fast as you can. The page shows your time in milliseconds. If you press before it says Now, the try does not count. Do five tries and look at the average.',
      'Typical times for a simple visual signal are around 200 to 250 milliseconds for healthy young adults, sources say, and times for a sound are often shorter, around 140 to 170. Your time also includes the delay of the screen and your device, which can add tens of milliseconds. So compare your own tries with each other, not with a number from the web.',
    ],
  },
  {
    id: 'far',
    kicker: 'Second test',
    title: 'How far in that time',
    paras: [
      'Things keep moving while you react. The distance travelled is the speed times the time. A walker goes less than half a metre in a quarter of a second. Something at 100 kilometres an hour goes about 7 metres.',
      'Pick a speed and slide the time. The page also shows a ruler test: someone drops a ruler and you catch it, and the distance it fell gives your time, since a ruler falls half the pull of gravity times the time squared. A ruler falls about 20 centimetres in 200 milliseconds. This is plain arithmetic. It is not advice about driving or any other activity.',
    ],
  },
  {
    id: 'choice',
    kicker: 'Third test',
    title: 'A simple reaction and a choice',
    paras: [
      'The Dutch scientist Franciscus Donders began in 1868 to time simple reactions and reactions that need a choice, and to subtract them to estimate how long the choosing takes. A reaction can be split into stages: noticing the signal, deciding what to do, planning the action and doing it. Adding a choice adds time to the deciding.',
      'Do five tries of the simple test in the first test. Then do five here. Each time the box says Left or Right. Press the button for that side, or the left or right arrow key. The page compares the two averages. A wrong press does not count. Your own result may vary a lot from one go to the next.',
    ],
  },
];

export const takeaways = [
  'A reaction takes time: the signal has to reach the eye, the brain has to notice and decide, and a signal has to reach a muscle.',
  'A simple reaction to a visual signal is typically around 200 to 250 milliseconds. A sound is often a little faster. Sources differ.',
  'Your device adds its own delay, so compare your own tries with each other.',
  'Distance is speed times time. In a quarter of a second something at 100 kilometres an hour goes about 7 metres.',
  'A choice between two adds time to a reaction. Donders began to measure this in 1868.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. Typical simple visual reaction times of about 200 to 250 milliseconds for healthy young adults, and shorter times for a sound, about 140 to 170, appeared in several places, and sources differ: one gave about 250 for sight and 170 for sound, a lab review gave 180 to 200 for sight and 140 to 160 for sound, and one small study gave about 331 and 284. That the hardware can move a score by tens of milliseconds appeared in one place. Donders’s work from 1868 on simple and choice reactions and the stages of a reaction (detection, decision, planning and execution) appeared in more than one place. Age, tiredness and the like were searched for and not found, so the page says nothing about them. The distance travelled and the fall of a ruler, 20 centimetres in 200 milliseconds, are plain arithmetic. The tests run in the browser, nothing is saved or sent, and the page is a toy and gives no medical or other advice.';

export const sources = [
  { label: 'ResearchGate: comparison between auditory and visual simple reaction times', url: 'https://www.researchgate.net/publication/228343246_Comparison_between_Auditory_and_Visual_Simple_Reaction_Times', for: 'Typical times for sight and sound.' },
  { label: 'SCIRP: comparison between auditory and visual simple reaction times', url: 'https://www.scirp.org/html/4-2400003_2689.htm', for: 'Typical times for sight and sound.' },
  { label: 'Indian Journal of Medical Research and Review: auditory and visual reaction times', url: 'https://ijmrr.medresearch.in/index.php/ijmrr/article/view/628', for: 'A small study of both.' },
  { label: 'Free Reaction Time Test: visual and auditory reaction time', url: 'https://freereactiontimetest.com/visual-vs-auditory-reaction-time/', for: 'Why sound is faster than sight.' },
  { label: 'Orange Neurosciences: the reaction time of a human', url: 'https://www.orangeneurosciences.ca/guide/reaction-time-of-a-human', for: 'Typical reaction times.' },
  { label: 'Measure Human: what is a good reaction time', url: 'https://measurehuman.com/guides/what-is-a-good-reaction-time', for: 'Typical times and the device delay.' },
  { label: 'PLOS Biology: timing the brain, mental chronometry', url: 'https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.0030051', for: 'Mental chronometry as a tool.' },
  { label: 'Wikipedia: mental chronometry', url: 'https://en.wikipedia.org/wiki/Mental_chronometry', for: 'Donders and the stages of a reaction.' },
  { label: 'ScienceDirect: choice reaction time', url: 'https://www.sciencedirect.com/topics/medicine-and-dentistry/choice-reaction-time', for: 'Simple and choice reactions.' },
  { label: 'Radboud University: reaction times', url: 'https://perception-and-action-37169a.pages.science.ru.nl/content/17_reaction_times.html', for: 'The stages of a reaction.' },
  { label: 'Cognitive Psychology: reaction time, choice and the diffusion model', url: 'https://en.cognitivepsychology.com/Reaction_Time', for: 'Choice reactions.' },
];
