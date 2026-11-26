// *******************************************************************************
// Arrow press nudge (.link-with-arrow, .slider-arrow)
// :active ends the moment the pointer is released, so a quick click would reverse the nudge halfway.
// .is-pressed holds the nudge until the press animation has played in full ($press_duration in _variables.scss).
// *******************************************************************************
(() => {
  const SELECTOR = '.link-with-arrow, .slider-arrow';
  const PRESS_MS = 240;

  const pressedAt = new WeakMap();
  const releaseTimers = new WeakMap();
  let current = null;

  const press = (el) => {
    clearTimeout(releaseTimers.get(el));
    el.classList.add('is-pressed');
    pressedAt.set(el, performance.now());
    current = el;
  };

  const release = () => {
    const el = current;
    if (!el) return;
    current = null;

    const remaining = Math.max(0, PRESS_MS - (performance.now() - (pressedAt.get(el) || 0)));
    releaseTimers.set(
      el,
      setTimeout(() => el.classList.remove('is-pressed'), remaining),
    );
  };

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || !(event.target instanceof Element)) return;
    const el = event.target.closest(SELECTOR);
    if (el) press(el);
  });

  document.addEventListener('pointerup', release);
  document.addEventListener('pointercancel', release);

  // Keyboard: Enter on links and buttons, Space on buttons
  document.addEventListener('keydown', (event) => {
    if (event.repeat || !(event.target instanceof Element)) return;
    const el = event.target.closest(SELECTOR);
    if (!el) return;
    if (event.key === 'Enter' || (event.key === ' ' && el.tagName === 'BUTTON')) press(el);
  });

  document.addEventListener('keyup', release);
})();
