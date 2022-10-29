'use strict';

// Selections
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button smooth scroll
scrollBtn.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation using event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Enabling tabs section
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Removing the active class on all tabs so that they all stay down, unless being clicked
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  // Removing the active class on all content so that we see only the one according to the clicked button
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Adding the active class just to the clicked one
  clicked.classList.add('operations__tab--active');

  // Activating the content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const nav = document.querySelector('.nav');
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(function (el) {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

// Sticky navigation bar
const observerOptions = {
  root: null,
  threshold: 0.1,
};

const observerCallback = function (entries, observer) {
  entries.forEach(entry => {});
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting === false) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections when scrolling
// 1. Selecting all sections
const allSections = document.querySelectorAll('.section');
// 2. Callback function with both parameters
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
// 3. Intersection observer
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
// 4. loop all sections and call the function for each one
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const lazyImgs = document.querySelectorAll('img[data-src]');

const lazyImgCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // Replacing the src of the image (small image) with the data-src (big image)
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    // Removing the lazy-img class after loading the image
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const lazyImgObserver = new IntersectionObserver(lazyImgCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImgs.forEach(lazyImage => lazyImgObserver.observe(lazyImage));

// Slider
const slider = function () {
  // Variables
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSLide = 0;
  const maxSlide = slides.length;
  const dotsContainer = document.querySelector('.dots');

  // Functions
  const nextSlide = function () {
    if (curSLide === maxSlide - 1) {
      curSLide = 0;
    } else {
      curSLide++;
    }
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - curSLide)}%`)
    );
    activeDot(curSLide);
  };

  const prevSlide = function () {
    if (curSLide === 0) {
      curSLide = maxSlide - 1;
    } else {
      curSLide--;
    }
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - curSLide)}%`)
    );
    activeDot(curSLide);
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    createDots();
    activeDot(0);
  };
  init();

  // Event handlers
  // Moving each slide on the X axis, 0%, 100%, 200%, etc.
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%`));

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      slides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%`)
      );
      activeDot(slide);
    }
  });
};
slider();
