// Fire 2: in one second the ball falls and the ground curves away.

import { fillRange, q } from '../util';
import { curveDrop, fallDrop, getPlanet } from '../../lib/orbit';

const EARTH = getPlanet('earth');
// One metre is drawn 12 units tall, so a drop of 4.9 metres is about 59 units
const PER_METRE = 12;

export function initSecond(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-second-tool]');
  if (!tool) return;
  const svg = q<SVGElement>(tool, '[data-second-svg]');
  const range = q<HTMLInputElement>(tool, '[data-second-range]');
  const ground = q(svg, '.ground');
  const ballEnd = q(svg, '[data-second-fall]');
  const status = q<HTMLElement>(tool, '[data-second-status]');

  function draw() {
    const v = Number(range.value);
    fillRange(range);
    q(tool!, '[data-second-out]').textContent = `${v.toFixed(1)} km/s`;
    // The ground is drawn for ten kilometres of sideways travel across 360 units
    const pts: string[] = [];
    for (let i = 0; i <= 36; i++) pts.push(`${20 + i * 10} ${70 + PER_METRE * curveDrop(EARTH, i / 3.6)}`);
    ground.setAttribute('d', `M${pts.join('L')}L380 200L20 200Z`);
    const x = 20 + (v / 10) * 360;
    ballEnd.setAttribute('cx', String(x));
    ballEnd.setAttribute('cy', String(70 + PER_METRE * fallDrop(EARTH, 1)));
    const [curve, fall] = [curveDrop(EARTH, v), fallDrop(EARTH, 1)];
    const verdict = Math.abs(curve - fall) < 0.2 ? 'the two match, so the ball keeps falling without getting closer.' : curve > fall ? 'the ground curves away faster than the ball falls, so it never lands.' : 'the ball falls more than the ground curves away, so it comes down.';
    status.textContent = `In one second a ball at ${v.toFixed(1)} km/s flies ${v.toFixed(1)} km sideways. It falls ${fall.toFixed(1)} metres, and the ground curves away by ${curve.toFixed(1)} metres: ${verdict}`;
  }
  range.addEventListener('input', draw);
  draw();
}
