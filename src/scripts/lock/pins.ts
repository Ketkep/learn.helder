// Draws the pin lock for a key with these cuts, pushed in by t (0 to 1), and says what each pin is doing.

import { DRIVER, keyPath, keyShift, pinViews, springPath, type PinView } from '../../lib/lock';
import { q } from '../util';

export function drawPins(svg: SVGElement, cuts: number[], t: number): PinView[] {
  const views = pinViews(cuts, t);
  q<SVGElement>(svg, '[data-key]').style.transform = `translateX(${keyShift(t)}px)`;
  q(svg, '[data-blade]').setAttribute('d', keyPath(cuts));
  views.forEach((v, i) => {
    const pin = q(svg, `[data-pin="${i}"]`);
    q(pin, '[data-spring]').setAttribute('d', springPath(v.x, 4, v.driverTop));
    q(pin, '[data-driver]').setAttribute('y', String(v.driverTop));
    q(pin, '[data-driver]').setAttribute('height', String(DRIVER));
    const kp = q(pin, '[data-keypin]');
    kp.setAttribute('y', String(v.keyTop));
    kp.setAttribute('height', String(v.keyBottom - v.keyTop));
    kp.setAttribute('class', `keypin ${v.state}`);
  });
  return views;
}

/** The pins that stop the plug, in words. */
export function blockers(views: PinView[]): string {
  const bad = views.map((v, i) => ({ v, n: i + 1 })).filter((p) => p.v.state !== 'ok');
  return bad.map((p) => (p.v.state === 'high' ? `pin ${p.n} is lifted too high (its cut is too shallow)` : `pin ${p.n} is not lifted enough (its cut is too deep)`)).join(', ');
}

export function setBolt(svg: SVGElement, open: boolean) {
  q<SVGElement>(svg, '[data-bolt]').style.transform = `translateX(${open ? -26 : 0}px)`;
}
