// Everything the "How clocks keep time" page says, in one place.
// The page is a clock movement taken apart into four brass plates. Each plate is one idea with one tool.

export interface Plate {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Under the dial',
  paras: [
    'Every clock does two jobs. It needs something that repeats at a steady rate, and it needs something that counts the repeats. In an old clock the steady thing is a swinging pendulum. In a watch it is a tiny crystal. In the most exact clocks it is an atom.',
    'This page opens a clock and shows four of its parts, from the swing to the count. Each plate has one thing to try. The numbers are real physics, and the pictures are simple models.',
  ],
};

export const plates: Plate[] = [
  {
    id: 'pendulum',
    kicker: 'Plate one',
    title: 'The swing',
    paras: [
      'A pendulum swings back and forth at a rate that depends on one thing: its length. A longer pendulum swings more slowly. The time of one full swing is about 2 times pi times the square root of the length divided by gravity.',
      'A pendulum about 0.994 m long takes 2 seconds for a full swing, one second each way. That is why the pendulums in old floor clocks are about a metre long. Change the length, the weight and the size of the swing, and see which of them the clock cares about.',
    ],
    tags: [
      { label: 'Galileo and Huygens', text: 'Galileo wrote about how steady a pendulum is in 1602. The first working pendulum clock was made by Christiaan Huygens in 1656 and 1657, and it was built by Salomon Coster.' },
      { label: 'Big swings', text: 'A pendulum is only nearly steady. A very wide swing takes a little longer than a small one. A clock keeps its swings small for this reason.' },
    ],
  },
  {
    id: 'escapement',
    kicker: 'Plate two',
    title: 'The count',
    paras: [
      'A pendulum would stop swinging after a while. A clock has a falling weight or a spring to keep it going, and a part called the escapement. The escapement does two things at once. It lets the clock’s toothed wheel move on by one tooth for each swing, and it gives the pendulum a small push.',
      'Swing the pendulum yourself with the buttons. Each half swing lets one tooth go by. That is the tick, and then the tock.',
    ],
    tags: [
      { label: 'Thirty teeth', text: 'A common escape wheel has 30 teeth. With a pendulum that takes 2 seconds for a full swing, each tooth passes in one second, so the wheel turns once a minute and can carry the second hand.' },
    ],
  },
  {
    id: 'gears',
    kicker: 'Plate three',
    title: 'The hands',
    paras: [
      'The wheel turns once a minute. Gears turn that slow count into the hands. A gear train slows each hand down to a fraction of the one before it. The minute hand goes round 60 times more slowly than the second hand. The hour hand goes round 12 times more slowly than the minute hand.',
      'Turn the time and watch all three hands. Count how many times the second hand goes round while the hour hand moves one hour.',
    ],
  },
  {
    id: 'quartz',
    kicker: 'Plate four',
    title: 'The crystal',
    paras: [
      'A quartz watch has no pendulum. It has a tiny crystal cut like a tuning fork. An electric current makes it shake 32,768 times a second. That number is 2 multiplied by itself 15 times. A chain of 15 simple circuits each cut the rate in half, and after 15 halvings exactly 1 pulse a second is left.',
      'Step down the chain and watch the rate halve. Then see what happens when the crystal is a little too fast or too slow.',
    ],
    tags: [
      { label: 'The atomic second', text: 'Since 1967 the official second has been defined by an atom: 9,192,631,770 vibrations of the light given off by a caesium-133 atom. An atomic clock counts those, in the same way that this chain counts the crystal.' },
      { label: 'Heat', text: 'A pendulum rod gets longer when it is warm, and the clock slows down. In the 1700s John Harrison made a pendulum from two metals that cancelled each other out, so that heat did not change its length.' },
    ],
  },
];

export const takeaways = [
  'A clock needs something that repeats at a steady rate, and something that counts the repeats.',
  'A pendulum’s swing depends on its length, not on its weight. A pendulum about 0.994 m long takes 2 seconds for a full swing.',
  'The escapement lets one tooth of the wheel pass for each half swing, and gives the pendulum a push to keep it going.',
  'Gears slow the count down: 60 to 1 from the second hand to the minute hand, and 12 to 1 from the minute hand to the hour hand.',
  'A quartz watch halves a crystal’s 32,768 vibrations a second 15 times to get one pulse a second.',
  'The tools are simple models. A real clock also has friction, heat and other things to deal with.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The seconds pendulum of about 0.994 m, the 32,768 Hz crystal (2 to the power 15), the 12 to 1 ratio between the minute hand and the hour hand, the caesium definition of the second and Huygens’ clock of 1656 and 1657 each appeared in at least two places. The escapement dates in the search results disagreed, so none are given here. The slow-down for a wide swing is the standard first approximation (about one part in sixteen of the square of the angle in radians). The tools are simple models made for this page and the drift numbers show the idea, not any real clock.';

export const sources = [
  { label: 'Wikipedia: seconds pendulum', url: 'https://en.wikipedia.org/wiki/Seconds_pendulum', for: 'A pendulum of about 0.994 m has a period of 2 seconds.' },
  { label: 'Linda Hall Library: Christiaan Huygens', url: 'https://www.lindahall.org/about/news/scientist-of-the-day/christian-huygens/', for: 'Huygens and the first pendulum clock.' },
  { label: 'Guinness World Records: first operational pendulum clock', url: 'https://www.guinnessworldrecords.com/world-records/first-operational-pendulum-clock', for: 'The first pendulum clock, 1656 and 1657.' },
  { label: 'Science Museum Group: early pendulum clock by Salomon Coster', url: 'https://collection.sciencemuseumgroup.org.uk/objects/co1031/early-pendulum-clock-by-salomon-coster-c-1657', for: 'A pendulum clock of about 1657 with a verge escapement.' },
  { label: 'Royal Holloway: Galileo and the pendulum clock', url: 'https://www.cs.rhul.ac.uk/~adrian/timekeeping/galileo', for: 'Galileo and the steady swing of a pendulum.' },
  { label: 'Wikipedia: quartz clock', url: 'https://en.wikipedia.org/wiki/Quartz_clock', for: 'The 32,768 Hz crystal and the chain of divide-by-two circuits.' },
  { label: 'BIPM: 13th CGPM, resolution 1 (1967)', url: 'https://www.bipm.org/committees/cg/cgpm/13-1967/resolution-1', for: 'The second defined by the caesium-133 atom.' },
  { label: 'Wikipedia: wheel train', url: 'https://en.wikipedia.org/wiki/Wheel_train', for: 'Gear trains in a clock.' },
  { label: 'Wikipedia: gridiron pendulum', url: 'https://en.wikipedia.org/wiki/Gridiron_pendulum', for: 'Harrison and the pendulum that cancels out heat.' },
  { label: 'Seiko Museum: a regulator that could compensate for temperature', url: 'https://museum.seiko.co.jp/en/knowledge/MechanicalTimepieces07/', for: 'Why heat changes the rate of a pendulum clock.' },
];
