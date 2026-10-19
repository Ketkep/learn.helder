// Everything the "How the heart pumps" page says, in one place.
// A flat heart and four things to try: follow a drop of blood, work out litres a minute, count beats in a life, and watch the valves.
// The sums are plain arithmetic and the drawings are simple. The page explains how the heart works.
// It is not medical advice, and no number here is a target for anyone.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A pump with two sides',
  paras: [
    'The heart is a muscle about the size of a closed fist. It has four chambers, two on the right and two on the left. The two upper chambers are the atria and the two lower ones are the ventricles. A wall in the middle keeps the two sides apart. The right side sends blood to the lungs. The left side sends it to the rest of the body.',
    'Four things to try. Follow a drop of blood round the whole trip. Work out how many litres the heart pumps in a minute. Count the beats of a lifetime. And watch the valves that keep the blood going one way. This page explains how the heart works. It is not medical advice, and no number here is a target for anyone. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'route',
    kicker: 'Beat one',
    title: 'Follow a drop of blood',
    paras: [
      'Blood goes round in a figure of eight. From the body it goes into the right side of the heart, then to the lungs, then back to the left side, then out to the body. It passes through the heart twice on every round.',
      'Press next to move the drop on one step. Blue means blood that has less oxygen and red means blood that has taken up oxygen in the lungs.',
    ],
  },
  {
    id: 'litres',
    kicker: 'Beat two',
    title: 'Litres a minute',
    paras: [
      'What the heart pumps in a minute is the number of beats a minute times the amount pumped in each beat. In a resting adult the heart rate is usually in the range of 60 to 100 beats a minute, and each beat pumps in the range of 60 to 100 millilitres. That comes to about 4 to 8 litres a minute.',
      'Slide the two numbers and see the total. The page also works out beats and litres for a whole day. These are sums, not targets.',
    ],
  },
  {
    id: 'life',
    kicker: 'Beat three',
    title: 'A lifetime of beats',
    paras: [
      'A heart never stops. At 70 beats a minute it beats about 100,000 times a day. Over the years that adds up to billions.',
      'Slide the age and the rate. The page multiplies it out. People’s hearts beat at different rates, and the rate changes with activity, so this is just arithmetic.',
    ],
  },
  {
    id: 'valves',
    kicker: 'Beat four',
    title: 'Doors that open one way',
    paras: [
      'The heart has four valves. One sits between each atrium and its ventricle and one at the exit of each ventricle. They open one way only, so the blood cannot flow backwards.',
      'Switch between the two halves of a beat and see which valves are open and which are shut.',
    ],
    tags: [{ label: 'Not medical advice', text: 'This page explains how the heart works with simple drawings and sums. It cannot say anything about anyone’s own heart. If you have a worry about your health, talk to a doctor.' }],
  },
];

export const takeaways = [
  'The heart has four chambers: two atria on top and two ventricles below. The right side sends blood to the lungs and the left side sends it to the body.',
  'Blood passes through the heart twice on every round of the body.',
  'Litres a minute are beats a minute times millilitres a beat. At 70 beats of 70 millilitres, that is 4.9 litres a minute.',
  'At 70 beats a minute the heart beats about 100,000 times a day.',
  'Four valves keep the blood going one way. This page is not medical advice.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The four chambers with the atria above and the ventricles below and a wall between the two sides, the four valves (one between each atrium and ventricle and one at each exit), the route of the blood through the right side, the lungs, the left side and the aorta, cardiac output as heart rate times stroke volume, resting values of about 60 to 100 beats a minute and 60 to 100 millilitres a beat giving about 4 to 8 litres a minute, and the heart as about the size of a fist each appeared in at least two places. Popular figures for the beats of a day (about 100,000, or up to about 115,000) and for the litres of a day differ between sources, so the page works those out itself from the rate. A source had a typing mistake in the unit of stroke volume, which was corrected to millilitres. The drawings are simple and not anatomy. The page explains how the heart works and is not medical advice.';

export const sources = [
  { label: 'British Heart Foundation: the heart (leaflet)', url: 'https://www.lhch.nhs.uk/leaflets/download/lhch-64ad25cf5512c7.57257962', for: 'The four chambers and the wall.' },
  { label: 'HealthNavigator NZ: heart valve disease', url: 'https://HealthNavigator.org.nz/health-a-z/h/heart-valve-disease/', for: 'The four valves.' },
  { label: 'The Royal Melbourne Hospital: the heart', url: 'https://www.thermh.org.au/services/cardiology/learn-about/the-heart', for: 'The route of the blood.' },
  { label: 'JoVE: cardiac output and stroke volume', url: 'https://jove.com/science-education/15278/cardiac-output-and-stroke-volume', for: 'Heart rate times stroke volume.' },
  { label: 'IU Pressbooks: cardiac output', url: 'https://iu.pressbooks.pub/humanphys/chapter/cardiac-output/', for: 'Resting values and the formula.' },
  { label: 'Science Museum of Minnesota: habits of the heart', url: 'https://new.smm.org/habits-of-the-heart/heart', for: 'Beats in a day.' },
  { label: 'PeaceHealth: how the heart works', url: 'https://www.peacehealth.org/locations/springfield/peacehealth-cardiac-surgery-riverbend-pavilion/how-the-heart-works', for: 'The size of the heart and its work.' },
  { label: 'Vedantu: facts about the heart', url: 'https://www.vedantu.com/biology/facts-about-heart', for: 'General facts about the heart.' },
];
