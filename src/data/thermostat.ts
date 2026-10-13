// Everything the "How a thermostat works" page says, in one place.
// A strip chart shows a room over a day. Four panels change the room, the gap, the walls and the heater.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A switch that watches the room',
  paras: [
    'A thermostat is a switch that watches the temperature. When the room gets too cold it turns the heater on. When the room is warm enough it turns the heater off. The heater warms the room, the room cools by itself, and the thermostat keeps it going round. This kind of loop, where the result switches off the cause, is called negative feedback.',
    'Each panel draws a strip chart of a room over one day. The grey blue band is the gap between switch on and switch off, the dashed line is the temperature you asked for, and the orange marks along the bottom show when the heater is on. The room and heater are toy models made for this page, with typical numbers. Without a script, each panel shows one chart and a table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'loop',
    kicker: 'Strip one',
    title: 'The loop',
    paras: [
      'Choose the temperature you want and how cold it is outside. The room loses heat to the outside, and the colder it is out there the faster it loses it. The thermostat has to turn the heater on more often to make up for it.',
      'Move the sliders and watch how much of the day the heater has to be on. Make it very cold outside and the heater cannot keep up at all.',
    ],
    tags: [{ label: 'Negative feedback', text: 'Too cold turns the heater on, which makes the room warmer. Too warm turns the heater off, which lets the room cool. The result of the heater cancels its own cause, and that keeps the room near the set temperature.' }],
  },
  {
    id: 'gap',
    kicker: 'Strip two',
    title: 'The gap',
    paras: [
      'A thermostat does not switch on and off at exactly one temperature. It has a gap. It switches the heater on a little below the set point and off a little above it. One example is a furnace that comes on at 18 degrees and goes off at 22. This gap is called hysteresis, or a deadband.',
      'Make the gap very small and the heater clicks on and off many times an hour, which wears out the switch. Make it big and the heater rarely switches, but the room swings far above and below what you asked for.',
    ],
  },
  {
    id: 'walls',
    kicker: 'Strip three',
    title: 'The walls',
    paras: [
      'How fast a room loses heat depends on its walls, roof and windows. The heat that leaks out is roughly proportional to the difference between the inside and the outside temperature. Better insulation lowers the number that this difference is multiplied by.',
      'Slide from a well insulated room to a draughty one. In the draughty room the heater is on for most of the day, and it may not be able to keep up.',
    ],
    tags: [{ label: 'U-value', text: 'Builders measure how well a wall keeps in heat with its U-value: the heat that flows through one square metre for each degree of difference. A smaller U-value is better. The leak number in this panel plays the same part for the whole room.' }],
  },
  {
    id: 'lag',
    kicker: 'Strip four',
    title: 'A slow heater',
    paras: [
      'A real heater does not warm up the moment it is switched on, and it keeps giving heat for a while after it is switched off. Radiators full of hot water do this a lot. So the room keeps warming after the thermostat has said stop, and the temperature overshoots.',
      'Slide the lag from a heater that reacts at once to one that takes an hour to warm up and cool down. Watch the swings grow past the gap.',
    ],
  },
];

export const takeaways = [
  'A thermostat is a switch that watches the temperature: too cold turns the heater on, warm enough turns it off. This is negative feedback.',
  'The heater has to make up for the heat the room loses, so it is on more of the time when it is colder outside.',
  'A gap between switching on and switching off (hysteresis) stops the heater clicking on and off all the time. A wider gap means fewer switches and bigger swings.',
  'Heat leaks out roughly in proportion to the temperature difference, so better insulation means a smaller heater duty.',
  'A slow heater makes the room overshoot the gap, because it keeps giving heat after it is switched off.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. A thermostat as on and off control with negative feedback, a gap (hysteresis or deadband) around the set point to stop constant switching, the furnace example that comes on at 18 degrees and goes off at 22, heat loss roughly proportional to the temperature difference and the U-value as the heat flow for each square metre and degree of difference each appeared in at least two places. The sources note that the proportion only holds within reasonable limits. The room, the heater power of 3 degrees an hour, the leak numbers and the lag are a toy model made for this page, and the numbers are typical but not measured. The page gives no advice on heating a home.';

export const sources = [
  { label: 'Wikipedia: deadband', url: 'https://en.wikipedia.org/wiki/Deadband', for: 'The gap around a set point and the furnace example.' },
  { label: 'Automation Forum: basics of an on/off controller', url: 'https://automationforum.co/basics-off-controller/', for: 'On and off control.' },
  { label: 'iDM: on/off control in a heat pump', url: 'https://www.idm-energie.at/en/heat-pump-control/on-off-control/', for: 'The acceptable range between switching on and off.' },
  { label: 'Southern Illinois University: on/off control lesson (PDF)', url: 'https://www.engr.siu.edu/staff/spezia/NewWeb438B/Lecture Notes/Lesson 4_et438b.pdf', for: 'On/off control and hysteresis.' },
  { label: 'CalPlug: negative feedback with an Arduino', url: 'https://github.com/CalPlug/NegativeFeedbackArduino', for: 'A thermostat as negative feedback.' },
  { label: 'Open University: heat loss through the building (OpenLearn)', url: 'https://www.open.edu/openlearn/nature-environment/energy-buildings/content-section-3.2.2', for: 'Heat loss and temperature difference.' },
  { label: 'Passipedia: thermal transmittance', url: 'https://passipedia.org/basics/building_physics_-_basics/thermal_transmittance', for: 'The U-value and its limits.' },
  { label: 'CyberPhysics: U-values', url: 'https://cyberphysics.co.uk/topics/heat/uvalue.htm', for: 'Heat flow for each square metre and degree.' },
  { label: 'Vedantu: Newton’s law of cooling', url: 'https://www.vedantu.com/jee-main/physics-newtons-law-of-cooling', for: 'Cooling rate proportional to the difference.' },
];
