const hamburger = document.querySelector('.hamburger');

// The panel itself is animated in menu.scss from body.is-open-menu, so this only flips the class
attachEvent('.hamburger', 'click', () => {
  const isOpen = body.classList.toggle('is-open-menu');
  hamburger?.setAttribute('aria-expanded', String(isOpen));
});
