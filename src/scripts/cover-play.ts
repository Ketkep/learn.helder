// Touch screens have no hover, so the cover animations would never start on a tablet or a phone.
// On a touch screen, a cover plays while it is mostly on screen and stops when you scroll away.
// With a mouse nothing changes: covers play on hover or keyboard focus.
// The drawings react to the class "is-playing" the same way as they react to hover.

const targets = document.querySelectorAll<HTMLElement>('[data-play]');

if (targets.length > 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let observer: IntersectionObserver | null = null;

  /** True when most of the element (or most of the screen height, for tall ones) is visible. */
  const mostlyVisible = (entry: IntersectionObserverEntry) => {
    const height = entry.boundingClientRect.height;
    if (!height) return false;
    return entry.intersectionRect.height >= Math.min(height, window.innerHeight) * 0.6;
  };

  const startAuto = () => {
    if (observer) return;
    const watcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.classList.toggle('is-playing', mostlyVisible(entry));
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    targets.forEach((target) => watcher.observe(target));
    observer = watcher;
  };

  const stopAuto = () => {
    observer?.disconnect();
    observer = null;
    targets.forEach((target) => target.classList.remove('is-playing'));
  };

  // Some tablets say they can hover even without a mouse, so also ask whether there is a touch screen
  if (matchMedia('(hover: none)').matches || navigator.maxTouchPoints > 0) startAuto();

  // A real mouse or trackpad means hover works: go back to playing on hover
  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'mouse') stopAuto();
  }, { passive: true });

  // A finger on a device that claimed it could hover: play while visible
  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') startAuto();
  }, { passive: true });
}
