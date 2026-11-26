/* eslint no-param-reassign: "error" */
/* eslint-disable no-new */

// *******************************************************************************
// GLOBALS
// *******************************************************************************
axios.defaults.headers['Content-Type'] = 'multipart/form-data';

// *******************************************************************************
// 0.1 - BREAKPOINT VARS
// *******************************************************************************
const breakpointSm = 767;
const breakpointMd = 1023;
const breakpointLg = 1171;

// *******************************************************************************
// 0.2 - VARIOUS FUNCTIONS
// *******************************************************************************

// Return Window Width
function windowWidth() {
  return window.innerWidth || document.documentElement.clientWidth;
}

const isFractal = () =>
  !!document.querySelector('.Frame') ||
  window.location.href.includes('localhost:3010') ||
  window.location.href.includes('/preview/components/');

const isLocal = () => window.location.href.includes('localhost');

// *******************************************************************************
// 0.3 - FUNCTIONS
// *******************************************************************************

// Attach Events
function attachEvent(selector, event, handler) {
  document.addEventListener(
    event,
    (ev) => {
      let { target } = ev;
      for (; target && target !== document; target = target.parentNode) {
        if (target.matches(selector)) {
          try {
            handler.call(target, ev);
          } catch (e) {
            console.error(e);
          }
          break;
        }
      }
    },
    false,
  );
}

const euro = Intl.NumberFormat('sl-SI', {
  style: 'currency',
  currency: 'EUR',
  useGrouping: false,
});

// Animate
function animate(elementToAnimate, type) {
  switch (type) {
    case 'show':
      elementToAnimate.classList.add('is-visible');
      elementToAnimate.classList.remove('is-hidden');
      break;
    case 'hide':
      elementToAnimate.classList.add('is-hidden');
      elementToAnimate.classList.remove('is-visible');
      break;
    default:
      break;
  }
}

// Validate email input
const validateEmailInput = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// *******************************************************************************
// 0.4 - DEBOUNCE FUNCTION
// *******************************************************************************

function debounce(func, wait, immediate) {
  let timeout;
  return function (...args) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// *******************************************************************************
// 0.5 - SLIDE FUNCTIONS
// *******************************************************************************

const slideUp = (target, duration) => {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = `${duration}ms`;
  target.style.boxSizing = 'border-box';
  target.style.height = `${target.offsetHeight}px`;
  // eslint-disable-next-line no-unused-expressions
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout(() => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};

const slideDown = (target, duration, displayType) => {
  target.style.removeProperty('display');

  let { display } = window.getComputedStyle(target);

  if (display === 'none') {
    display = displayType;
  }
  target.style.display = display;

  target.style.display = display;
  const height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  // eslint-disable-next-line no-unused-expressions
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = `${duration}ms`;
  target.style.height = `${height}px`;
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout(() => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};

const slideToggle = (target, duration, displayType) => {
  /* Slide-toggle logic */

  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration, displayType);
  }
  return slideUp(target, duration, displayType);
};

// *******************************************************************************
// 0.7 - Smooth Scroll
// *******************************************************************************

const smoothScroll = new scrollToSmooth('a', {
  targetAttribute: 'data-scrollto',
  duration: 1000,
  durationRelative: false,
  durationMin: false,
  durationMax: false,
  easing: easeInOutCubic,
  offset: '#site-header',
  onScrollStart: (data) => {
    // do something
    document.documentElement.style.scrollBehavior = 'initial';
  },
  onScrollUpdate: (data) => {
    // do something
  },
  onScrollEnd: (data) => {
    // do something
    document.documentElement.style.scrollBehavior = 'smooth';
  },
});
smoothScroll.init();

// function scrollToSmoothly(pos, time = 500) {
//   const currentPos = window.pageYOffset;
//   let start = null;

//   const step = (currentTime) => {
//     start = !start ? currentTime : start;
//     const progress = currentTime - start;
//     const positionUpY = currentPos - ((currentPos - pos) * progress) / time;
//     const positionDownY = ((pos - currentPos) * progress) / time + currentPos;

//     window.scrollTo(0, currentPos < pos ? positionDownY : positionUpY);

//     if (progress < time) {
//       window.requestAnimationFrame(step);
//     } else {
//       window.scrollTo(0, pos);
//     }
//   };

//   window.requestAnimationFrame(step);
// }

// *******************************************************************************
// 0.8 - Lazy loading (https://github.com/verlok/vanilla-lazyload)
// *******************************************************************************
// const lazyLoadInstance = new LazyLoad({
//   elements_selector: '.lazyload',
// });

// This can be called whenever you need to update the lazyload instance
// lazyLoadInstance.update();

// *******************************************************************************
// 0.9 - Match Height / Equal height : https://dev.to/dhruvangg/equal-height-in-vanilla-javascript-49ch
// *******************************************************************************

const equalHeight = document.querySelector('.equal-height');

if (equalHeight) {
  const setHeight = (el, val) => {
    if (typeof val === 'function') {
      val = val();
    }

    if (typeof val === 'string') el.style.height = val;
    else el.style.height = `${val}px`;
  };

  const equalheight = function (container) {
    let currentTallest = 0;
    let currentRowStart = 0;
    const rowDivs = new Array();
    let $el;
    const topPosition = 0;

    Array.from(document.querySelectorAll(container)).forEach((el, i) => {
      el.style.height = 'auto';
      const topPostion = el.offsetTop;
      if (currentRowStart !== topPostion) {
        let currentDiv = 0;

        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
          setHeight(rowDivs[currentDiv], currentTallest);
        }
        rowDivs.length = 0;
        currentRowStart = topPostion;
        currentTallest = parseFloat(getComputedStyle(el, null).height.replace('px', ''));
        rowDivs.push(el);
      } else {
        rowDivs.push(el);
        currentTallest =
          currentTallest < parseFloat(getComputedStyle(el, null).height.replace('px', ''))
            ? parseFloat(getComputedStyle(el, null).height.replace('px', ''))
            : currentTallest;
      }

      let currentDiv = 0;
      for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
        setHeight(rowDivs[currentDiv], currentTallest);
      }
    });
  };

  window.addEventListener('load', () => {
    equalheight('.equal-height');
  });

  window.addEventListener('resize', () => {
    setTimeout(() => {
      equalheight('.equal-height');
    });
  });
}

// *******************************************************************************
// 0.10 - ENVIRONMENT BADGE
// *******************************************************************************
const envBadge = document.querySelector('.sdt-env__badge');
if (envBadge) {
  envBadge.style.top = '150px';
  envBadge.addEventListener('mouseover', (ev) => {
    const { style } = ev.target;
    if (style.top) {
      style.removeProperty('top');
      style.bottom = '250px';
    } else {
      style.removeProperty('bottom');
      style.top = '150px';
    }
  });
}

// *******************************************************************************
// 0.11 - Get nonce for static pages
// *******************************************************************************
const getNonceForAction = async (formAction) => {
  if (isFractal()) {
    return Promise.resolve('');
  }

  try {
    const formDataNonce = {
      action: 'getNonceField',
      nonce_action: formAction,
    };

    const response = await axios.post(localData.apiURL, formDataNonce, {});
    return response.data.data.nonce;
  } catch (error) {
    console.error(error);
  }
};

// *******************************************************************************
// Form helper
// *******************************************************************************
const joinActiveItems = (checkedItems) =>
  Array.from(checkedItems)
    .map((checkedItem) => checkedItem.getAttribute('value'))
    .join(' | ');

const getFormValue = (form, fv) => {
  const formData = {};
  const requiredFormData = {};

  Object.keys(fv.getFields()).forEach((key) => {
    const element = form.querySelector(`[data-fv-name="${key.replace(/\[\]/g, '')}"]`);

    if (!element) {
      return;
    }

    const parentElem = element.closest('[data-input-group-parent]');

    if ((element.type === 'radio' || element.type === 'checkbox') && parentElem) {
      const selectedInputs = [...parentElem.querySelectorAll('input:checked')].filter(
        (input) => !input.hasAttribute('data-select-all'),
      );
      const itemValues = joinActiveItems(selectedInputs);
      formData[key] = itemValues || '';

      if (element.hasAttribute('required')) {
        requiredFormData[key] = itemValues || '';
      }
    } else {
      const elementValue = fv.getElementValue(key, element);
      formData[key] = elementValue;

      if (element.hasAttribute('required')) {
        requiredFormData[key] = elementValue;
      }
    }
  });

  return { inputs: JSON.stringify(formData), requiredInputs: JSON.stringify(requiredFormData) };
};

/**
 * @typedef {Object} AxiosOptions - Options object for Axios request.
 * @property {Object} headers - Request headers.
 * @property {string} headers.Content-Type - Content type for the request.
 * @property {string} [method] - HTTP method (e.g., GET, POST, PUT, etc.).
 * @property {string} [url] - Request URL.
 * @property {Object} [params] - URL parameters.
 * @property {Object} [data] - Request payload data.
 * @property {Object} [auth] - Authentication credentials (e.g., { username: 'user', password: 'pass' }).
 * @property {number} [timeout] - Request timeout in milliseconds.
 * @property {boolean} [withCredentials] - Indicates whether cross-site Access-Control requests
 *                                         should be made using credentials.
 */

/**
 * @typedef {Object} Options - Options object for the onFormSubmit function.
 * @property {AxiosOptions} [axiosOptions] - Options for the Axios request.
 * @property {Object} formData - The form data to submit.
 * @property {string} [recaptchaKey] - Recaptcha key.
 * @property {string} [recaptchaAction] - Recaptcha action.
 * @property {number} [timeout] - Timeout for the request in milliseconds.
 * @property {string} [url] - Url of the request.
 * @property {boolean} [forceError] - You should use this to force an form error, to test UI on error.
 */

/**
 * Simulates a form submission using Axios.
 * @param {Options} [options] - Additional options for the request.
 * @returns {Promise} - A promise that resolves to the Axios response.
 */

const onFormSubmit = async (options = { formData: {} }) => {
  // Default values
  if (!options.formData.lang) {
    options.formData.lang = localData.lang;
  }

  // FE / Preview submission of the form without API
  if (isFractal()) {
    console.warn('Fractal - Simulating request');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (options.forceError) {
          reject(new Error('Simulated error'));
          return;
        }

        console.warn('Simulated success, FormData:', options.formData);
        resolve();
      }, options.timeout || 250);
    });
  }

  if (options.recaptchaKey && options.recaptchaAction) {
    const token = await grecaptcha.execute(options.recaptchaKey, { action: options.recaptchaAction });
    const nonce = await getNonceForAction(options.recaptchaAction);

    options.formData = { ...options.formData, action: options.recaptchaAction, nonce, token };
  }

  // Make a request to the API
  return axios.post(options.url || localData.siteURL, options.formData, {
    ...options.axiosOptions,
  });
};

// *******************************************************************************
// Add scrollbar width
// *******************************************************************************

let scrollbarSize = 0;
const getScrollbarWidth = () => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);
  const inner = document.createElement('div');
  outer.appendChild(inner);
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  scrollbarSize = scrollbarWidth;
  outer.parentNode.removeChild(outer);
  document.documentElement.style.setProperty('--scroll-width', `${scrollbarWidth}px`);
};

getScrollbarWidth();

window.addEventListener('resize', () => {
  getScrollbarWidth();
});

// *******************************************************************************
// Toggle class functions
// *******************************************************************************
const toggleBodyScrollLock = (toggle) => {
  document.body.classList.toggle('body-scroll-locked', toggle);
};

// *******************************************************************************
// Email Error
// *******************************************************************************

const getEmailError = (formElement) => {
  let emailMessage = '';
  if (formElement.querySelector('[type="email"]')) {
    emailMessage = formElement.querySelector('[type="email"]').getAttribute('data-fv-email-address___message');
  }
  return emailMessage;
};

// *******************************************************************************
// Redirect page and smooth scroll
// *******************************************************************************
const siteHeader = document.querySelector('.site-header');
const filterBar = document.querySelector('.mod-filter');
const getHeaderHeight = () => (siteHeader?.offsetHeight || 0) + (filterBar?.offsetHeight || 0);

window.addEventListener('load', () => {
  const { hash } = window.location;

  if (!hash) {
    return;
  }

  const targetElement = document.querySelector(hash);

  if (!targetElement) {
    return;
  }

  const scrollPosition = targetElement.getBoundingClientRect().top + window.scrollY;
  setTimeout(() => {
    window.scrollTo({
      top: scrollPosition - getHeaderHeight(),
      behavior: 'smooth',
    });
  }, 300);
});

// *******************************************************************************
// Stretch item until right of screen
// *******************************************************************************
const lines = document.querySelectorAll('.stretch-item');
const updateLineWidth = () => {
  lines.forEach((line) => {
    const width = window.innerWidth - line.getBoundingClientRect().left - scrollbarSize;
    document.documentElement.style.setProperty('--right-distance', `${width}px`);
    line.style.width = `${Math.floor(width)}px`;
  });
};

updateLineWidth();
window.addEventListener('resize', () => {
  updateLineWidth();
});

// *******************************************************************************
// KeyDown Function
// *******************************************************************************

const onKeydown = (key, callback) => {
  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === key.toLowerCase()) {
      callback(event);
    }
  });
};

// *******************************************************************************
// Email Validation Reg Exp.
// *******************************************************************************

const getEmailRegex = () => '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$';

const validateEmail = (value) => {
  if (value === '') {
    return true;
  }

  const emailRegex = getEmailRegex();

  return (
    FormValidation.validators.emailAddress().validate({
      value,
    }).valid &&
    FormValidation.validators.regexp().validate({
      value,
      options: {
        regexp: emailRegex,
      },
    }).valid
  );
};

// *******************************************************************************
// Popup
// *******************************************************************************

if (document.querySelector('[data-fancybox]')) {
  Fancybox.bind('[data-fancybox]');
}

// *******************************************************************************
// Repeater Pagination via AJAX
// *******************************************************************************

const axiosGetRepeaterPaginateItems = async (parent, pageNumber) => {
  const action = parent.querySelector('[data-action]').value;
  const moduleIndex = parent.querySelector('[data-k]').value;
  const innerElem = parent.querySelector('[data-repeater-items]');
  const noResultElem = parent.querySelector('[data-not-found]');
  const footerElem = parent.querySelector('[data-repeater-pagination]');

  const formDataInput = {
    action,
    pageNumber,
    moduleIndex,
    id: localData.id,
  };

  try {
    const { data } = await axios.post(localData.siteURL, formDataInput);
    innerElem.innerHTML = '';

    if (innerElem && data.data.html_list) {
      innerElem.innerHTML = data.data.html_list;
      noResultElem.classList.add('hide');
    }

    if (noResultElem && !data.data.html_list) {
      noResultElem.classList.remove('hide');
    }

    if (footerElem && data.data.html_pagination) {
      footerElem.innerHTML = data.data.html_pagination;
    }

    const [baseUrl] = window.location.href.split('?');
    const urlParams = ['pageNumber']
      .filter((item) => formDataInput[item] && formDataInput[item].length > 0)
      .map((item) => `${item}=${formDataInput[item]}`)
      .join('&');

    window.history.pushState({}, '', baseUrl + (urlParams ? `?${urlParams}` : ''));

    const moduleTop = parent.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: moduleTop - getHeaderHeight(), behavior: 'smooth' });
  } catch (err) {
    console.error(err);
  }
};

// *******************************************************************************
// Filters - Return Checked Input Data
// *******************************************************************************

function getCheckedData(parent, inputName) {
  const checkedEls = parent.querySelectorAll(`input[name="${inputName}"]:checked`);
  return Array.from(checkedEls).map((el) => el.dataset.slug);
}

// *******************************************************************************
// Filters - Return Active Button Id
// *******************************************************************************

function getActiveCategoryButtonFilter(parent) {
  const activeEls = parent.querySelectorAll('button.is-active');
  return Array.from(activeEls).map((el) => el.id);
}

// *******************************************************************************
// Search - Return Searched Input Data
// *******************************************************************************

function getSearchedData(parent) {
  const searchInput = parent.querySelector('input[type="text"]');
  const searchValue = searchInput ? searchInput.value.trim() : '';
  return searchValue;
}

// *******************************************************************************
// Marquee
// *******************************************************************************

const horizontalLoop = (
  items,
  { repeat = -1, paused = false, speed = 1, snap = 1, paddingRight = 0, reversed = false } = {},
) => {
  items = gsap.utils.toArray(items);
  const tl = gsap.timeline({ repeat, paused, defaults: { ease: 'none' } });
  const widths = items.map((el) => parseFloat(gsap.getProperty(el, 'width', 'px')));
  const xPercents = items.map((el, i) =>
    gsap.utils.snap(
      snap,
      (parseFloat(gsap.getProperty(el, 'x', 'px')) / widths[i]) * 100 + gsap.getProperty(el, 'xPercent'),
    ),
  );

  const totalWidth = items.reduce(
    (acc, item, i) => acc + widths[i] * gsap.getProperty(item, 'scaleX'),
    parseFloat(paddingRight),
  );
  const times = [];
  let curIndex = 0;
  const pixelsPerSecond = speed * 100;

  gsap.set(items, { xPercent: (i) => xPercents[i] });
  gsap.set(items, { x: 0 });

  items.forEach((item, i) => {
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - items[0].offsetLeft;
    const distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX');
    const duration1 = distanceToLoop / pixelsPerSecond;
    const duration2 = (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond;

    tl.to(
      item,
      { xPercent: gsap.utils.snap(snap, ((curX - distanceToLoop) / widths[i]) * 100), duration: duration1 },
      0,
    )
      .fromTo(
        item,
        { xPercent: gsap.utils.snap(snap, ((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
        { xPercent: xPercents[i], duration: duration2, immediateRender: false },
        duration1,
      )
      .add(`label${i}`, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  });

  const toIndex = (index, vars = {}) => {
    const newIndex = gsap.utils.wrap(0, items.length, index);
    let time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    return tl.tweenTo(time, { overwrite: true, ...vars });
  };

  Object.assign(tl, {
    next: (vars) => toIndex(curIndex + 1, vars),
    previous: (vars) => toIndex(curIndex - 1, vars),
    current: () => curIndex,
    toIndex,
    times,
  });

  tl.progress(1, true).progress(0, true);
  if (reversed) tl.reverse();
  return tl;
};

document.addEventListener('DOMContentLoaded', () => {
  const marquee = document.querySelectorAll('.marquee__item');
  if (marquee.length > 0) {
    marquee.forEach((el) => {
      horizontalLoop(el, {
        repeat: -1,
        paused: false,
        speed: 0.5,
      });
    });
  }
});

// *******************************************************************************
// Axios with Pagination and Filter
// *******************************************************************************

const axiosGetPaginateAndFilteredPosts = async (
  parent,
  pageNumber,
  urlParams,
  extraFormDataInput = {},
  scrollToTop = true,
) => {
  const action = parent.querySelector('[data-action]').value;
  const formDataInput = {
    action,
    pageNumber,
    id: localData.id,
    ...extraFormDataInput,
  };

  const innerElem = parent.querySelector('[data-list-row]');
  const noResultElem = parent.querySelector('[data-not-found]');
  const paginationElem = parent.querySelector('[data-pagination]');
  const loadMoreElem = parent.querySelector('[data-load-more]');
  const listLoadMoreElem = parent.querySelector('[data-list-load-more]');
  const nextMonthStartIndexElem = parent.querySelector('[data-next-month-start-index]');

  loadMoreElem?.classList.add('is-disabled');
  parent.classList.add('show-loader');

  try {
    const { data } = await axios.post(localData.siteURL, formDataInput);
    const isAppend = data?.data?.isAppend === true || data?.data?.isAppend === 'true'; // handle boolean or string

    if (innerElem && !isAppend) {
      innerElem.innerHTML = '';
    }

    if (nextMonthStartIndexElem) {
      nextMonthStartIndexElem.value = data.data.startNextMonthIndex;
    }

    if (listLoadMoreElem) {
      if (data.data.html_list) {
        if ((!pageNumber || pageNumber === 1) && !isAppend) {
          listLoadMoreElem.innerHTML = data.data.html_list;
        } else {
          listLoadMoreElem.insertAdjacentHTML('beforeend', data.data.html_list);
        }
        parent.classList.remove('no-result-found');
        noResultElem?.classList.add('hide');
      } else {
        listLoadMoreElem.innerHTML = '';
      }
    }

    if (innerElem && data.data.html_list) {
      innerElem.innerHTML = data.data.html_list;
      parent.classList.remove('no-result-found');
      noResultElem.classList.add('hide');
    }

    if (noResultElem && !data.data.html_list) {
      parent.classList.add('no-result-found');
      noResultElem.classList.remove('hide');
    }

    if (paginationElem && data.data.html_pagination) {
      paginationElem.innerHTML = data.data.html_pagination;
    }

    if (loadMoreElem) {
      loadMoreElem.classList.toggle('hide', !data.data.loadMore);
    }

    const [baseUrl] = window.location.href.split('?');
    const urlParamsWithValue = urlParams
      .filter((item) => formDataInput[item] && formDataInput[item].length > 0)
      .map((item) => `${item}=${formDataInput[item]}`)
      .join('&');

    parent.classList.remove('show-loader');
    window.history.pushState({}, '', baseUrl + (urlParamsWithValue ? `?${urlParamsWithValue}` : ''));

    if (scrollToTop) {
      const moduleTop = parent.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: moduleTop - getHeaderHeight(), behavior: 'smooth' });
    }

    const marqueeElem = document.querySelectorAll('.marquee__item');

    marqueeElem.forEach((el) => {
      horizontalLoop(el, {
        repeat: -1,
        paused: false,
        speed: 0.5,
      });
    });
  } catch (err) {
    console.error(err);
    parent.classList.remove('show-loader');
  }
  loadMoreElem?.classList.remove('is-disabled');
};

if (isFractal()) {
  const themeClasses = [
    'mgml',
    'arheopark-emona',
    'bezigrad-gallery',
    'bezigrajska-galerija-1',
    'bezigrajska-galerija-2',
    'cukrarna',
    'galerija-bezigrad',
    'galerija-jakopic',
    'galerija-vzigalica',
    'mestna-galerija-ljubljana',
    'mestni-muzej-ljubljana',
    'plecnikova-hisa',
    'vila-zlatica',
  ];

  themeClasses.forEach((themeClass) => {
    const el = document.querySelector(`.${themeClass}`);
    if (el) {
      el.classList.remove(themeClass);
      themeClasses.forEach((cls) => document.body.classList.remove(cls));
      document.body.classList.add(themeClass);
    }
  });
}

// *******************************************************************************
// Word splitting
// *******************************************************************************

Splitting();

// *******************************************************************************
// Scroll function
// *******************************************************************************

const scrollTop = (element) => {
  const scrollPosition = element.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: scrollPosition - getHeaderHeight(),
    behavior: 'smooth',
  });
};

// *******************************************************************************
// Header scroll
// *******************************************************************************
const { body } = document;
const header = document.querySelector('.site-header');
const isCukrarna = body.classList.contains('cukrarna');
const isCukrarnaMdUp = () => windowWidth() > breakpointMd;

const updateHeights = () => {
  const root = document.documentElement;
  const secondaryNav = document.querySelector('.secondary-nav');
  const fullHeight = header?.offsetHeight || 0;
  let headerHeight = fullHeight;

  if (isCukrarna) {
    const largeLogo = document.querySelector('.site-header__large-logo');
    const logoHeight = largeLogo?.offsetHeight || 0;
    root.style.setProperty('--large-logo-height', `${logoHeight}px`);
    const scrolled = body.classList.contains('is-scrolled');
    const useCollapsedHeight = scrolled && isCukrarnaMdUp();
    headerHeight = useCollapsedHeight ? fullHeight - logoHeight : fullHeight;
  }

  root.style.setProperty('--header-height', `${headerHeight}px`);
  root.style.setProperty('--second-nav-height', `${secondaryNav?.offsetHeight || 0}px`);
};

let lastScrollTop = window.scrollY;
let isScrolled = lastScrollTop > 30;
body.classList.toggle('is-scrolled', isScrolled);
let isScrolledUp = false;
let ticking = false;

const updateScrollState = () => {
  const y = window.scrollY;
  const nextScrolled = y > 30;

  if (nextScrolled !== isScrolled) {
    body.classList.toggle('is-scrolled', nextScrolled);
    isScrolled = nextScrolled;
    updateHeights();
  }

  const nextScrolledUp = y < lastScrollTop;
  if (nextScrolledUp !== isScrolledUp) {
    body.classList.toggle('is-scrolled-up', nextScrolledUp);
    isScrolledUp = nextScrolledUp;
  }

  lastScrollTop = y > 0 ? y : 0;
};

updateScrollState();
updateHeights();
window.addEventListener('resize', updateHeights);
window.addEventListener(
  'scroll',
  () => {
    if (ticking) {
      return;
    }
    ticking = true;
    requestAnimationFrame(() => {
      updateScrollState();
      ticking = false;
    });
  },
  { passive: true },
);
