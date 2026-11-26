const latestExhibitions = document.querySelectorAll('[data-slider="latest-exhibitions"]');

const latestExhibitionsOptions = {
  slidesPerView: 'auto',
  spaceBetween: 20,
  // With the ease-out in latest-exhibitions.scss most of the travel happens early, so 600ms still lands softly
  speed: 600,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};

// Reduced motion: the cards jump to the new position instead of travelling ~720px
const latestExhibitionsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ##################################################
// Counter ("1 / 4") with a rolling current number.
// Swiper's own fraction pagination rewrites the number's text on every change, so the old number can not animate
// out. The counter is built here instead, with the same markup and the same numbers (snap positions, as Swiper counts).
// The old number leaves and the new one enters in the direction the cards move: up for next, down for previous.

const latestExhibitionsCounter = {
  // Shorter than the 600ms slide on purpose: the number confirms the click, the cards are still travelling
  duration: 320,
  easing: 'cubic-bezier(0.23, 1, 0.32, 1)', // $ease_out_strong in scss/base/_variables.scss
  // How far each number travels, in % of its own height. Below 100 the old and the new number overlap while they
  // cross, so they read as one number rolling over instead of two passing each other. The fade hides the overlap.
  distance: 50,
  // Blur at the far end of the roll. It blends the two crossing numbers into one movement instead of two shapes.
  blur: '3px',
};

const createLatestExhibitionsCounter = (el) => {
  el.innerHTML =
    '<span class="swiper-pagination-current : slider-counter__current"></span> / <span class="swiper-pagination-total"></span>';

  const current = el.querySelector('.slider-counter__current');
  const total = el.querySelector('.swiper-pagination-total');

  const createNumber = (value) => {
    const number = document.createElement('span');
    number.className = 'slider-counter__number';
    number.textContent = value;
    return number;
  };

  let value = null;

  const set = (next, direction = 0) => {
    if (next === value) return;
    value = next;

    const incoming = createNumber(next);
    const outgoing = [...current.children];

    // First render, or no direction: no animation
    if (!direction || !outgoing.length) {
      current.replaceChildren(incoming);
      return;
    }

    const reduced = latestExhibitionsReducedMotion.matches;
    const distance = `${direction * latestExhibitionsCounter.distance}%`;
    const { blur } = latestExhibitionsCounter;
    const options = { duration: latestExhibitionsCounter.duration, easing: latestExhibitionsCounter.easing };

    // Numbers still on their way (fast clicks) leave from where they are now, not from their start
    outgoing.forEach((number) => {
      number.getAnimations().forEach((animation) => {
        animation.commitStyles();
        animation.cancel();
      });

      number.classList.add('is-leaving');
      number.setAttribute('aria-hidden', 'true');

      // Leaving is quicker than arriving, so the two numbers barely overlap
      const leave = number.animate(
        reduced
          ? [{ opacity: 0, filter: `blur(${blur})` }]
          : [{ transform: `translateY(calc(${distance} * -1))`, opacity: 0, filter: `blur(${blur})` }],
        { ...options, duration: options.duration * 0.6, fill: 'forwards' },
      );
      leave.finished.then(() => number.remove()).catch(() => {});
    });

    current.append(incoming);
    incoming.animate(
      reduced
        ? [
            { opacity: 0, filter: `blur(${blur})` },
            { opacity: 1, filter: 'blur(0)' },
          ]
        : [
            { transform: `translateY(${distance})`, opacity: 0, filter: `blur(${blur})` },
            { transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' },
          ],
      options,
    );
  };

  return {
    set,
    setTotal: (next) => {
      total.textContent = next;
    },
  };
};

latestExhibitions.forEach((el) => {
  const parentElem = el.closest('.latest-exhibitions');

  const arrowLeft = parentElem.querySelector('.swiper-button-prev');
  const arrowRight = parentElem.querySelector('.swiper-button-next');
  const pagination = parentElem.querySelector('.swiper-pagination');
  const counter = pagination ? createLatestExhibitionsCounter(pagination) : null;

  latestExhibitionsOptions.navigation.prevEl = arrowLeft;
  latestExhibitionsOptions.navigation.nextEl = arrowRight;

  const updateCounter = (swiper, direction = 0) => {
    if (!counter) return;
    counter.setTotal(swiper.snapGrid.length);
    counter.set(swiper.snapIndex + 1, direction);
  };

  const swiper = new Swiper(el, {
    ...latestExhibitionsOptions,
    speed: latestExhibitionsReducedMotion.matches ? 0 : latestExhibitionsOptions.speed,
    on: {
      init: (instance) => updateCounter(instance),
      snapGridLengthChange: (instance) => updateCounter(instance),
      snapIndexChange: (instance) => {
        updateCounter(instance, instance.snapIndex > instance.previousSnapIndex ? 1 : -1);
      },
    },
  });

  latestExhibitionsReducedMotion.addEventListener('change', (event) => {
    swiper.params.speed = event.matches ? 0 : latestExhibitionsOptions.speed;
  });
});
