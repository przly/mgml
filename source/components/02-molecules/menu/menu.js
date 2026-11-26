// The accordion is animated in menu.scss from .is-open-submenu, so this only flips the class
attachEvent('.menu__arrow', 'click', (el) => {
  const item = el.target.closest('.menu__item');
  if (item?.querySelector('.menu__dropdown')) {
    const isOpen = item.classList.toggle('is-open-submenu');
    el.target.setAttribute('aria-expanded', String(isOpen));
  }
});
