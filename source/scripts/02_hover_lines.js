// *******************************************************************************
// Directional hover underline (%hover_lines in scss/base/_extensions.scss)
// The line grows from the side the pointer comes in from and retracts toward the side it leaves to.
// *******************************************************************************
(() => {
  // The element that is hovered, and the element that carries the line.
  // In the main menu the whole item is the hover area (the dropdown included), the line is under its text.
  // The menu underline is only for Tablet L and up, as in menu.scss.
  const TARGETS = [
    { trigger: '.site-header__link', line: (el) => el },
    { trigger: '.language-switch__link', line: (el) => el },
    {
      trigger: '.menu__item.level-1',
      line: (el) => el.querySelector(':scope > .menu__item-wrap .menu__text'),
      media: '(min-width: 1201px)',
    },
  ];

  const find = (event) => {
    if (event.pointerType === 'touch' || !(event.target instanceof Element)) return null;

    const target = TARGETS.find(({ trigger }) => event.target.matches(trigger));
    if (!target || (target.media && !window.matchMedia(target.media).matches)) return null;

    const line = target.line(event.target);
    return line ? { trigger: event.target, line } : null;
  };

  // Which half of the line the pointer is on
  const sideOf = (line, event) => {
    const rect = line.getBoundingClientRect();
    return event.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
  };

  // A line that is still moving keeps going from where it is. Only a line that has settled is reset to the entry side
  const isAnimating = (line) =>
    typeof line.getAnimations === 'function' &&
    line.getAnimations({ subtree: true }).some((animation) => animation.playState === 'running');

  // Capture phase, because pointerenter and pointerleave do not bubble
  document.addEventListener(
    'pointerenter',
    (event) => {
      const found = find(event);
      if (!found) return;

      const { line } = found;

      if (!isAnimating(line)) {
        line.classList.add('is-line-reset');
        line.dataset.line = sideOf(line, event);
        void line.offsetWidth; // Apply the new hidden state before the line starts to grow
        line.classList.remove('is-line-reset');
      }

      line.classList.add('is-line-on');
    },
    true,
  );

  document.addEventListener(
    'pointerleave',
    (event) => {
      const found = find(event);
      if (!found) return;

      const { line } = found;

      line.dataset.line = sideOf(line, event);
      line.classList.remove('is-line-on');
    },
    true,
  );
})();
