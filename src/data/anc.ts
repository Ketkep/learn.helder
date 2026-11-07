// Everything the "How noise cancelling works" page says, in one place.
// A pair of headphones in three parts: adding an upside down copy of a tone, what a small delay does at different pitches, and how
// exact the timing has to be. The idea comes from the sources. The sums are a simple model made for the page, and the page says that real
// headphones are more complicated. The sources say the method works best on steady, low sounds, and that the cups block higher ones.

export interface Part {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Silence made of two sounds',
  paras: [
    'Noise cancelling headphones make a sound to silence a sound. A tiny microphone listens to the noise outside. A circuit makes a copy of the noise turned upside down, so that when the noise pushes the air one way the copy pushes it the other way. Played together the two cancel. This is called destructive interference.',
    'Three parts. In the first, add an upside down copy to a steady tone and see what is left. In the second, see what a small delay does at different pitches. In the third, see how exact the timing must be. The sums are a simple model made for this page. Real headphones are more complicated. Without a script each part shows one picture or table.',
  ],
};

export const parts: Part[] = [
  {
    id: 'cancel',
    kicker: 'First part',
    title: 'An upside down copy',
    paras: [
      'A steady tone is a wave that goes up and down. Turn it upside down and the ups become downs. Add the two and you get a flat line, which is silence. That works only if the copy matches the noise exactly and arrives at exactly the right moment.',
      'Slide the pitch of the noise and the lateness of the copy. The page draws the noise, the copy and the sum. With no delay the sum is flat. With a delay the copy is out of step, and something is left. If the copy is late by more than a sixth of a period, the sum is louder than the noise on its own, and the headphones make it worse.',
    ],
    tags: [
      { label: 'History', text: 'The idea of cancelling sound with sound is from the 1930s. Sources give 1933, 1934 and 1936 for the work of Paul Lueg. An earmuff of 1957 is reported to have cut noise by about 20 decibels between about 50 and 500 hertz.' },
    ],
  },
  {
    id: 'delay',
    kicker: 'Second part',
    title: 'A small delay and the pitch of the noise',
    paras: [
      'Every circuit takes a little time, and sound takes time to travel between the microphone and the ear. A delay of a tenth of a millisecond is tiny. But a high note goes through many more waves in that time than a low note, so the same delay is a bigger mismatch for a high note.',
      'Slide the delay. The graph shows what is left of the noise at each pitch. Low notes are cancelled well. Higher notes are cancelled badly, and above a certain pitch the sum is mostly louder than the noise. The graph rises and falls again at higher pitches, because at some pitches the delay happens to be a whole number of waves. That is a quirk of this simple model. This is why the sources say that noise cancelling works best on steady, low sounds, such as a hum, and that the padding of the cups does the work for higher sounds.',
    ],
  },
  {
    id: 'exact',
    kicker: 'Third part',
    title: 'How exact the timing must be',
    paras: [
      'The amount that is left depends on the phase error, which is how far the copy is out of step, measured as a part of a full turn of the wave. A copy that is 5.7 degrees out of step leaves about a tenth of the noise, which is a reduction of 20 decibels. A copy that is 60 degrees out leaves as much as there was. At 180 degrees it is exactly the wrong way round and doubles the noise.',
      'Pick a pitch and slide the phase error. The page shows the time that it takes, in millionths of a second. For a 100 hertz hum, 5.7 degrees is about 158 millionths of a second. For a 1000 hertz tone it is only about 16. That is why the timing has to be fast, and why higher notes are so hard.',
    ],
  },
];

export const takeaways = [
  'Noise cancelling adds a copy of the noise turned upside down. The two cancel. This is destructive interference.',
  'It works only if the copy matches in size and timing. If it is late by more than a sixth of a period, it makes the noise worse.',
  'A small delay is a small error for a low note and a big one for a high note, so cancelling works best on low, steady sounds.',
  'The padding of the cups blocks the higher sounds that the circuit cannot cancel.',
  'A phase error of 5.7 degrees leaves about a tenth of the noise, a cut of 20 decibels.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. That a microphone picks up the noise and a circuit makes an inverted copy that cancels it by destructive interference, and that the method works best on steady, low sounds while the cups block higher sounds, appeared in several places. The search did not state that delay limits high pitches, but it said that the timing of the anti-noise must be precise, and the effect of a delay at different pitches is computed on the page with a simple model, 2 times the sine of half the phase error, so the page says this is a model. Dates differ for Paul Lueg’s patent (1933, 1934 or 1936), and the earmuff of 1957 with about 20 decibels between about 50 and 500 hertz came from one source. No source for a cutoff of about 1000 hertz was found, so the page gives none. The numbers 5.7 degrees, 20 decibels, 158 and 16 millionths of a second are computed. Nothing here is advice.';

export const sources = [
  { label: 'Wikipedia: active noise control', url: 'https://en.wikipedia.org/wiki/Active_noise_control', for: 'How anti-noise cancels noise.' },
  { label: 'Wikipedia: noise-cancelling headphones', url: 'https://en.wikipedia.org/wiki/Noise-cancelling_headphones', for: 'The history and the method.' },
  { label: 'Scientific American: how do active noise cancelling headphones work', url: 'https://www.scientificamerican.com/blog/psi-vid/how-do-active-noise-canceling-headphones-work/', for: 'Inverted phase.' },
  { label: 'Interesting Engineering: how noise-cancelling headphones work', url: 'https://interestingengineering.com/science/how-do-noise-canceling-headphones-work-and-why-are-they-so-popular', for: 'The microphone, the circuit and the speaker.' },
  { label: 'Soundcore: the science of silence', url: 'https://www.soundcore.com/blogs/earbuds/how-does-active-noise-cancelling-work', for: 'Low, steady sounds.' },
  { label: 'Headphonesty: the history of noise-cancelling headphones', url: 'https://www.headphonesty.com/2020/10/history-of-noise-cancelling-headphones/', for: 'Early work.' },
  { label: 'Hearing Health Matters: headphones, a long way', url: 'https://hearinghealthmatters.org/hearing-international/2016/headphones-they-have-come-a-long-way-baby/', for: 'The history of the headphone.' },
  { label: 'Stuff: how does noise cancelling work', url: 'https://www.stuff.tv/features/how-does-noise-cancelling-work/', for: 'Passive and active noise reduction.' },
  { label: 'Cardinal Communications: active noise cancellation, analogue to digital', url: 'https://cardinalcomms.com/articles/active-noise-cancellation-from-analog-to-digital-and-beyond/', for: 'How the circuits changed.' },
  { label: 'arXiv: feedback active noise control in headphones', url: 'https://arxiv.org/pdf/2509.15864', for: 'Control of headphone noise.' },
  { label: 'Copperpod: evolution of active noise cancellation', url: 'https://copperpod.medium.com/evolution-of-active-noise-cancellation-anc-549070d036bd', for: 'Dates and inventors.' },
];
