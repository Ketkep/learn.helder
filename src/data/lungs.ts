// Everything the "How the lungs move air" page says, in one place.
// A laboratory bench with four glass jars: a syringe, a chest model, breaths and litres, and air in and air out.
// The gas law and the breathing numbers come from the sources. The size of the model lung is made up and marked. Nothing here is medical advice.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A pump with no pump handle',
  paras: [
    'Your lungs have no muscles of their own. They do not pull air in. Instead, the muscles around them, mainly the diaphragm under the lungs and the muscles between the ribs, make the chest bigger. A bigger space means lower pressure inside, and air flows in from outside to fill it. This is Boyle’s law at work: at the same temperature, when a gas gets more room, its pressure drops.',
    'Four jars on the bench to try. Squeeze and stretch the gas in a syringe. Pull the sheet of a model chest down. Multiply breaths by litres. And compare the air going in with the air coming out. The size of the model lung is made up and the page says so. This page explains how breathing works. It is not medical advice. Without a script each jar shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'syringe',
    kicker: 'Jar one',
    title: 'Squeeze the gas',
    paras: [
      'Robert Boyle found in the 1600s that when you squeeze a gas into half the space, its pressure doubles, and when you let it spread into twice the space, its pressure halves. Pressure times volume stays the same, as long as the temperature does not change.',
      'Slide the plunger of the syringe. The page starts at 50 millilitres and a pressure of 1.00, the same as the air outside. The 28 dots are the same gas every time.',
    ],
  },
  {
    id: 'chest',
    kicker: 'Jar two',
    title: 'Pull the sheet down',
    paras: [
      'The diaphragm is a dome of muscle under the lungs. When it tightens it flattens and pulls down, and the muscles between the ribs lift the chest. The chest space grows and the pressure inside the lungs falls below the pressure outside, so air flows in. When the muscles relax, the lungs spring back and push the air out. A model with a balloon and a rubber sheet shows this.',
      'Pull the sheet down. First the tube is blocked, so you see how far the pressure would fall. Then open the tube and see the air come in instead. The 2.5 litre lung in this model is made up. The 0.5 litre breath is about right for an adult at rest.',
    ],
  },
  {
    id: 'minute',
    kicker: 'Jar three',
    title: 'Breaths and litres',
    paras: [
      'A resting adult takes about 12 to 20 breaths a minute, and moves about 500 millilitres of air each time. The air moved in a minute is the rate times the volume. At 12 breaths of 0.5 litres that is 6 litres a minute, which is about 8,600 litres in a day. The lungs can hold about 6 litres at most.',
      'Slide the rate and the size of the breath. Exercise raises both. The numbers here are those of an adult at rest, and they differ between people.',
    ],
  },
  {
    id: 'air',
    kicker: 'Jar four',
    title: 'Air in, air out',
    paras: [
      'Air has about 21 per cent oxygen and 0.04 per cent carbon dioxide. The rest is mostly nitrogen. In the lungs there are hundreds of millions of tiny air sacs called alveoli, each with a wall thinner than a thousandth of a millimetre and wrapped in tiny blood vessels. Oxygen passes from the air into the blood and carbon dioxide passes out, by diffusion. Air breathed out has about 16 per cent oxygen and about 4 per cent carbon dioxide.',
      'Pick air breathed in or out to see the numbers. The oxygen falls from 21 to 16 per cent, so only about a quarter of it is used up in each breath.',
    ],
    tags: [{ label: 'Not advice', text: 'This page explains the idea. It says nothing about your own health. For breathing problems, ask a doctor.' }],
  },
];

export const takeaways = [
  'Muscles make the chest bigger, the pressure inside falls, and air flows in. When the muscles relax, the lungs spring back and air flows out.',
  'Boyle’s law: at the same temperature, pressure times volume stays the same.',
  'A resting adult breathes about 12 to 20 times a minute, about 500 millilitres each time, so about 6 litres a minute.',
  'Air breathed in has about 21 per cent oxygen and 0.04 per cent carbon dioxide. Air breathed out has about 16 per cent and 4 per cent.',
  'The lungs have hundreds of millions of alveoli with very thin walls, which give a large surface for gases to pass.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The diaphragm and rib muscles enlarging the chest so that the pressure falls below the outside pressure, Boyle’s law as pressure and volume inversely related at constant temperature, passive breathing out through the springing back of the lungs, tidal volume of about 500 millilitres for men and about 400 for women, total lung capacity of about 6 litres, a resting rate of about 12 to 20 breaths a minute, air breathed in with about 21 per cent oxygen and 0.04 per cent carbon dioxide against about 16 and 4 per cent breathed out, and an air to blood barrier of 0.2 to 0.6 micrometres each appeared in at least two places. Sources differ on the number of alveoli (200 to 600 million, with averages of 300 or 480 million) and on their surface (40 to 80 square metres), so the page says hundreds of millions and gives no area. The model lung of 2.5 litres and its sheet are made up for the toy. The sums are exact and computed on the page.';

export const sources = [
  { label: 'University of Guelph: mechanics of breathing', url: 'https://books.lib.uoguelph.ca/human-physiology/chapter/mechanics-of-breathing/', for: 'Muscles, volume and pressure.' },
  { label: 'LibreTexts: the mechanics of human breathing', url: 'https://bio.libretexts.org/Bookshelves/Introductory_and_General_Biology/General_Biology_(Boundless)/39%3A_The_Respiratory_System/39.09%3A_Breathing_-_The_Mechanics_of_Human_Breathing', for: 'Boyle’s law in the chest.' },
  { label: 'Carolina: the mechanics of breathing', url: 'https://knowledge.carolina.com/wp-content/uploads/2025/06/The-Mechanics-of-Breathing_F.pdf', for: 'The balloon and sheet model.' },
  { label: 'JoVE: breathing', url: 'https://www.jove.com/v/10882', for: 'Inhaling and exhaling.' },
  { label: 'BioNinja: lung capacity', url: 'https://old-ib.bioninja.com.au/standard-level/topic-6-human-physiology/64-gas-exchange/lung-capacity.html', for: 'Tidal volume and lung capacity.' },
  { label: 'FP Notebook: lung volumes', url: 'https://www.fpnotebook.com/Lung/Lab/LngVlm.htm', for: 'Volumes of the lung.' },
  { label: 'Airly: inhaled and exhaled air', url: 'https://airly.org/en/the-composition-of-inhaled-and-exhaled-air/', for: 'The composition of the air.' },
  { label: 'Save My Exams: inspired and expired air', url: 'https://savemyexams.com/igcse/biology/cie/23/revision-notes/11-gas-exchange-in-humans/11-1-gas-exchange-in-humans/11-1-4-differences-in-inspired-and-expired-air', for: 'Oxygen and carbon dioxide before and after.' },
  { label: 'Save My Exams: the alveolar epithelium', url: 'https://savemyexams.com/as/biology/aqa/16/revision-notes/3-exchange--transport/3-2-human-gas-exchange/3-2-5-the-alveolar-epithelium', for: 'Thin alveolar walls.' },
];
