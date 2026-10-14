// Everything the "How loud is loud" page says, in one place.
// A level meter and four panels: the decibel ruler, two sounds together, distance, and how long a sound is safe.
// The page explains the maths of sound levels. It is not medical advice.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A ruler that is not a ruler',
  paras: [
    'Sound levels are measured in decibels, and the scale does not behave like a ruler. It is a scale of multiplying. Every 10 steps up means the sound is 10 times more intense. Zero decibels is not silence but the quietest sound a young ear can just hear. A whisper is about 30, and 30 steps up from zero is a thousand times more intense.',
    'Four panels try the maths. The page does not give medical advice. If your ears ring, or sounds seem muffled, after loud noise, or you notice that your hearing is changing, see a doctor or a hearing professional. Without a script, each panel shows a table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'ruler',
    kicker: 'Meter one',
    title: 'The decibel ruler',
    paras: [
      'A sound level in decibels is ten times the logarithm of how many times the sound is more intense than the quietest one we can hear. That is a way of saying that each 10 decibels is a tenfold step. So 60 decibels, a normal conversation, is a million times more intense than 0.',
      'Slide the level and see how many times more intense it is. The nearest everyday sound is shown with it.',
    ],
    tags: [{ label: 'Where zero is', text: 'In air, 0 decibels is a sound pressure of 20 micropascals, which is about the quietest sound a young ear can just hear at a middle pitch. Louder sounds go up from there. Sources put the threshold of pain somewhere between 120 and 140 decibels.' }],
  },
  {
    id: 'two',
    kicker: 'Meter two',
    title: 'Two sounds at once',
    paras: [
      'If two sounds play together, their intensities add up, and their decibel levels do not. Two equal sounds of 60 decibels are not 120. They are about 63, which is 3 decibels more. Doubling the intensity always adds about 3 decibels.',
      'Set the two levels. Notice that when one sound is much louder than the other, the quieter one hardly changes the total.',
    ],
  },
  {
    id: 'far',
    kicker: 'Meter three',
    title: 'Further away',
    paras: [
      'A sound spreads out in all directions as it travels, so it gets weaker with distance. In open air each time you double your distance from a small source, the level drops by about 6 decibels. Ten times as far is 20 decibels less.',
      'Set how loud a source is at one metre and how far away you are. Real places have walls, ground and wind, so this is only the simplest case.',
    ],
  },
  {
    id: 'time',
    kicker: 'Meter four',
    title: 'How long is too long',
    paras: [
      'Harm to hearing depends on how loud the sound is and how long you hear it. In the United States, NIOSH recommends no more than 85 decibels (A weighted) for 8 hours a day, and every 3 decibels louder halves the time. At 100 decibels that is 15 minutes. OSHA, which sets legal limits at work, uses 90 decibels for 8 hours and halves the time for every 5 decibels, so at 100 it allows 2 hours.',
      'Slide the level and compare the two. The 3 decibel rule fits the fact that 3 decibels is double the intensity: twice the sound, half the time. The numbers describe a working day in a factory and are not a way to judge any one night out.',
    ],
    tags: [{ label: 'dBA', text: 'The letter A means the level is weighted to count the pitches the ear is most sensitive to more than the ones it is not. Noise limits are usually given in dBA.' }],
  },
];

export const takeaways = [
  'Decibels are a scale of multiplying: every 10 decibels is a tenfold step in intensity, and 0 decibels is about the quietest sound a young ear can hear.',
  'Two equal sounds together are 3 decibels louder than one, because doubling the intensity adds about 3 decibels.',
  'In open air the level drops by about 6 decibels each time you double the distance from a small source.',
  'NIOSH recommends no more than 85 dBA for 8 hours, halving the time for every 3 dBA more. OSHA uses 90 dBA and a 5 dBA step.',
  'This page explains the maths of sound levels and is not medical advice.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The decibel as ten times a logarithm of an intensity ratio, a tenfold intensity for each 10 decibels and about 3 decibels for a doubling, 0 decibels as 20 micropascals, a whisper near 30 and a conversation near 60, the NIOSH limit of 85 dBA for 8 hours with a 3 dBA exchange rate (15 minutes at 100), the OSHA limit of 90 dBA with a 5 dBA exchange rate (2 hours at 100), and a pain threshold starting around 120 decibels each appeared in at least two places. The sources give ranges for a rock concert (110 to 140) and for the pain threshold (120 to 140), and one level chart is dated 1990, so the page gives ranges. The drop of about 6 decibels for each doubling of the distance is the standard result for a small source in open air, and it was computed here. The page is about the maths of sound levels and gives no medical advice.';

export const sources = [
  { label: 'NIDCD Noisy Planet: how loud is too loud (PDF)', url: 'https://www.noisyplanet.nidcd.nih.gov/sites/noisyplanet/files/ShareableImages/HowLoudisTooLoud_Bookmark.pdf', for: 'Everyday sound levels and how long they are safe.' },
  { label: 'CHC Hearing: common environmental noise levels', url: 'https://www.chchearing.org/common-environmental-noise-levels', for: 'A whisper and a normal conversation.' },
  { label: 'TeachEngineering: sound chart (PDF)', url: 'https://www.teachengineering.org/content/cub_/activities/cub_human/cub_human_lesson06_activity2_soundchart.pdf', for: 'Typical sound levels.' },
  { label: 'NIOSH: criteria for a recommended standard', url: 'https://nonoise.org/library/niosh/criteria.htm', for: '85 dBA for 8 hours and the 3 dBA exchange rate.' },
  { label: 'CDC and NIOSH: noise and hearing loss prevention (PDF)', url: 'https://inside.sou.edu/assets/ehs/2019_Oct_CDC_-_Noise_and_Hearing_Loss_Prevention_-_NIOSH.pdf', for: 'The recommended limit and the risk.' },
  { label: 'National Safety Council: hearing protection (PDF)', url: 'https://nsc.org/getattachment/d757a5a0-17a5-4c92-811b-df8db23022d0/W-Hearing-Protection-146', for: 'NIOSH and OSHA limits side by side.' },
  { label: 'Simon Fraser University: decibels', url: 'https://www.sfu.ca/sonic-studio-webdav/handbook/Decibel.html', for: 'The decibel and the 3 dB and 10 dB rules.' },
  { label: 'Physics LibreTexts: decibels, the maths', url: 'https://phys.libretexts.org/Bookshelves/Waves_and_Acoustics/Understanding_Sound_(Abbot)/06%3A_Loudness_perception/6.04%3A_Decibels_(the_math)', for: 'Intensity level and its logarithm.' },
  { label: 'Svantek: sound pressure level', url: 'https://svantek.com/academy/sound-pressure-level-spl/', for: '20 micropascals as the reference.' },
  { label: 'Indiana University: an acoustics primer', url: 'https://cmtext.indiana.edu/acoustics/chapter1_amplitude5.php', for: 'The threshold of hearing and of pain.' },
];
