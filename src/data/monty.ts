// Everything the "Why switching doors wins" page says, in one place.
// A game show stage with three acts: play the game and keep a score for staying and switching, change the number of doors, and change what
// the host does. The odds are worked out exactly by listing the cases, and the play is random each time. Nothing is saved or sent anywhere.
// The history comes from the sources. A toy game, not advice about gambling.

export interface Act {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Three doors, one car',
  paras: [
    'You are on a game show. There are three closed doors. Behind one is a car and behind the other two are goats. You pick a door. The host knows where the car is. He opens one of the other two doors, and it has a goat. Then he asks: do you want to stay with your door or switch to the other closed door?',
    'Many people say it makes no difference, since two doors are left and one hides the car. It does make a difference. Switching wins two times in three. Three acts. In the first, play the game and keep score. In the second, change the number of doors. In the third, change what the host does. The play is random each time and nothing is saved. Without a script each act shows one table or picture.',
  ],
};

export const acts: Act[] = [
  {
    id: 'play',
    kicker: 'First act',
    title: 'Play it and keep score',
    paras: [
      'Pick a door. The host opens a door with a goat. Then choose Stay or Switch. The page opens all the doors, and it keeps one score for the times you stayed and one for the times you switched.',
      'Play twenty games and always switch, then twenty and always stay. Over a few games luck can fool you, so the scores will not match two in three exactly. Over many games they come close.',
      'Why two in three: your first pick is right one time in three, and it stays one in three whatever the host does. The host never opens the car. So the other two thirds of the chance now sit on the one door he left shut.',
    ],
    tags: [{ label: 'Toy', text: 'This is a game made for the page. The doors and the host are random, and the page keeps the score for this visit only.' }],
  },
  {
    id: 'doors',
    kicker: 'Second act',
    title: 'More doors',
    paras: [
      'Make it bigger. Say there are a hundred doors. You pick one. The host, who knows where the car is, opens ninety-eight doors with goats and leaves one other door shut. Do you switch?',
      'Your first pick was right one time in a hundred. So the shut door has the car ninety-nine times in a hundred. Slide the number of doors and see the chances. Then press Play 1,000 games and the page plays the game a thousand times with the best choice and the worst.',
      'This version is a way to see the idea, and several of the sources use it. The host must open every door but one, and must never open the car.',
    ],
  },
  {
    id: 'host',
    kicker: 'Third act',
    title: 'What the host does',
    paras: [
      'The two in three only holds for a host who knows where the car is and always opens a door with a goat. The way the question was first printed did not say that, and that is part of why people argued about it.',
      'Pick a host. With the first, switching wins two in three. With a host who opens a door at random, and it happens to be a goat, staying and switching are even: one in two each. With a host who offers a switch only when you picked the car, switching never wins. The cards show every case when you pick door 1. Faded cards do not fit what you saw.',
      'So the answer depends on how the host chooses. That is the real lesson. A fact you see means something only when you know how it was picked.',
    ],
    tags: [{ label: 'Rule', text: 'Each case has a weight. Add up the weights of the cases that fit, and see how much of that is a win for staying. That is the chance.' }],
  },
];

export const takeaways = [
  'With three doors, a host who knows where the car is and always opens a goat door, staying wins one time in three and switching wins two in three.',
  'Your first pick keeps its one in three. The host never opens the car, so the rest of the chance sits on the one door he left shut.',
  'With a hundred doors, switching wins ninety-nine times in a hundred.',
  'The result depends on the host. If he opens a door at random and it happens to show a goat, staying and switching are equal.',
  'In one study, pigeons learned over many tries to switch almost every time. People given the same practice did not.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The setting, a letter by Steve Selvin to The American Statistician in 1975, the question sent to Marilyn vos Savant that was printed in Parade in September 1990, her answer to switch, and the thousands of letters that said she was wrong each appeared in several places. The sources differ on whether Selvin posed the puzzle or only gave it its name, so the page says he wrote about it. The two in three result, the hundred door version and the point that the host must always open a goat door each appeared in several places. The one in two result for a host who opens a door at random was in search results and was also worked out here by listing the cases. The trick host is an example worked out for this page and is not from a source. The pigeon study by Herbranson and Schroeder from 2010, in which the birds went from switching about a third of the time on the first day to nearly always after a month, appeared in several news reports and one follow-up paper. A claim that Paul Erdos was convinced only by a computer simulation appeared in search results but is left out because it is a story. The chances on this page were worked out and are the same as in the sources. The game is random. Nothing here is advice about gambling.';

export const sources = [
  { label: 'Wikipedia: Monty Hall problem', url: 'https://en.wikipedia.org/wiki/Monty_Hall_problem', for: 'The history and the answer.' },
  { label: 'Brilliant: Monty Hall problem', url: 'https://brilliant.org/wiki/monty-hall-problem/', for: 'Why the host always opening a goat matters.' },
  { label: 'Cornell: conditional probability and the Monty Hall problem', url: 'https://blogs.cornell.edu/info2040/2017/10/25/conditional-probability-and-the-monty-hall-problem', for: 'The two in three answer.' },
  { label: 'EPFL: expectation and variance course notes', url: 'https://algo.epfl.ch/_media/en/courses/2015-2016/l21expectation_variance.pdf', for: 'The game with a host who knows.' },
  { label: 'University of Notre Dame: the Monty Hall controversy', url: 'https://www3.nd.edu/~rwilliam/stats1/appendices/xappxd.pdf', for: 'The argument after 1990.' },
  { label: 'New York Times, 1991: behind Monty Hall\'s doors', url: 'https://www3.nd.edu/~rwilliam/stats1/appendices/Monty-NYTimes.pdf', for: 'Monty Hall on the puzzle.' },
  { label: 'University of Pennsylvania: Monty Hall notes', url: 'https://www2.math.upenn.edu/~kazdan/210/notes-misc/Monty_Hall.html', for: 'The cases.' },
  { label: 'Discover: pigeons outperform humans at the Monty Hall dilemma', url: 'https://discovermagazine.com/planet-earth/pigeons-outperform-humans-at-the-monty-hall-dilemma', for: 'The pigeon study.' },
  { label: 'National Geographic: pigeons outperform humans at the Monty Hall dilemma', url: 'https://www.nationalgeographic.com/science/article/pigeons-outperform-humans-at-the-monty-hall-dilemma', for: 'The pigeon study.' },
  { label: 'Learning and Behavior, 2015: pigeons and the Monty Hall dilemma', url: 'https://link.springer.com/article/10.3758/s13420-015-0172-3', for: 'A follow-up with pigeons.' },
];
