// Scroll helper
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Envelope open + scroll to letter
const openButton = document.getElementById('open-button');
const envelope = document.getElementById('valentine-envelope');

if (openButton && envelope) {
    openButton.addEventListener('click', () => {
        envelope.classList.remove('env--closed');
        envelope.classList.add('env--open');
        setTimeout(() => scrollToSection('letter-section'), 900);
    });
}

// "Our memories" button → scroll to photos section
const memoriesButton = document.getElementById('memories-button');
if (memoriesButton) {
    memoriesButton.addEventListener('click', () => {
        scrollToSection('photos-section');
    });
}

// Restart button → back to top
const restartButton = document.getElementById('restart-button');
if (restartButton) {
    restartButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* Floating hearts generation */
const heartsContainer = document.querySelector('.hearts-container');

function createHeart() {
    if (!heartsContainer) return;

    const heart = document.createElement('div');
    heart.className = 'heart';

    const size = 16 + Math.random() * 14; // 16–30px
    heart.style.fontSize = `${size}px`;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = 6 + Math.random() * 5 + 's';
    heart.style.opacity = 0.4 + Math.random() * 0.5;

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 12000);
}

// Create hearts periodically
setInterval(createHeart, 800);

//Spawn hearts on tap/click
document.addEventListener('click', (e) => {
    if (!heartsContainer) return;

    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';

        const size = 14 + Math.random() * 12;
        heart.style.fontSize = `${size}px`;

        // Position around click location
        heart.style.left = `${(e.clientX / window.innerWidth) * 100}%`;
        heart.style.top = `${(e.clientY / window.innerHeight) * 100}%`;

        heart.style.animationDuration = 4 + Math.random() * 3 + 's';

        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 8000);
    }
});

/* Photo carousel */
const slidesData = [
    { src: 'images/photo1.jpg', caption: 'Greenwich Picnic Date' },
    { src: 'images/photo2.jpg', caption: 'Windy Surrey Beach Day' },
    { src: 'images/photo3.jpg', caption: 'Polesden Lacey Summer Walk' },
    { src: 'images/photo4.jpg', caption: 'Jetsetting in SleasyJet' },
    { src: 'images/photo5.jpg', caption: 'Suprise trip to San Marino' },
    { src: 'images/photo6.jpg', caption: 'Macau Garden Exploring' },
    { src: 'images/photo7.jpg', caption: 'Snowy Romania Valentines' },
];

const track = document.querySelector('.carousel-track');
const dotsContainer = document.querySelector('.carousel-dots');
const prevBtn = document.querySelector('.carousel-control.prev');
const nextBtn = document.querySelector('.carousel-control.next');

let currentSlide = 0;

function buildCarousel() {
    if (!track || !dotsContainer || !slidesData || !slidesData.length) return;

    // Build slides
    slidesData.forEach((slide, index) => {
        const slideEl = document.createElement('div');
        slideEl.className = 'carousel-slide';

        const img = document.createElement('img');
        img.src = slide.src;
        img.alt = `Memory ${index + 1}`;

        const caption = document.createElement('div');
        caption.className = 'carousel-caption';
        caption.textContent = slide.caption;

        slideEl.appendChild(img);
        slideEl.appendChild(caption);
        track.appendChild(slideEl);

        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    updateCarousel();
}

function updateCarousel() {
    if (!track || !dotsContainer) return;
    const firstSlide = track.firstElementChild;
    if (!firstSlide) return;

    const slideWidth = firstSlide.getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    if (!slidesData || !slidesData.length) return;
    currentSlide = (index + slidesData.length) % slidesData.length;
    updateCarousel();
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });
}

// Recalculate width on resize (to keep alignment)
window.addEventListener('resize', () => {
    updateCarousel();
});

// Init carousel
buildCarousel();

const AUTO_INTERVAL_MS = 3800;  // time between slides
const RESUME_AFTER_MS   = 6000;  // wait time to resume after user interaction
let autoTimer = null;
let resumeTimer = null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startAutoPlay() {
  if (prefersReducedMotion) return;
  stopAutoPlay();
  autoTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, AUTO_INTERVAL_MS);
}

function stopAutoPlay() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

function pauseThenResumeAutoPlay() {
  stopAutoPlay();
  if (resumeTimer) clearTimeout(resumeTimer);
  resumeTimer = setTimeout(() => {
    startAutoPlay();
  }, RESUME_AFTER_MS);
}

// Pause when the tab is hidden; resume when visible again
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
});

// Pause when the carousel is scrolled out of view; resume when in view
(function setupVisibilityObserver() {
  const carouselRoot = document.querySelector('.carousel');
  if (!('IntersectionObserver' in window) || !carouselRoot) {
    startAutoPlay();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    },
    { threshold: [0, 0.35, 1] }
  );

  observer.observe(carouselRoot);
})();

// User interactions pause autoplay and then resume after a delay
const carouselWindow = document.querySelector('.carousel-window');
const dots = () => document.querySelectorAll('.carousel-dot');

['click', 'touchstart', 'pointerdown'].forEach(evt => {
  if (prevBtn) prevBtn.addEventListener(evt, pauseThenResumeAutoPlay, { passive: true });
  if (nextBtn) nextBtn.addEventListener(evt, pauseThenResumeAutoPlay, { passive: true });
  if (carouselWindow) carouselWindow.addEventListener(evt, pauseThenResumeAutoPlay, { passive: true });
});

document.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('carousel-dot')) {
    pauseThenResumeAutoPlay();
  }
});

startAutoPlay();


function resetEnvelopeInstant(envelopeEl) {
  if (!envelopeEl) return;
  // Disable transitions on flap & letter during reset
  const flap = envelopeEl.querySelector('.env__flap');
  const letter = envelopeEl.querySelector('.env__letter');

  const els = [envelopeEl, flap, letter].filter(Boolean);
  els.forEach(el => (el.style.transition = 'none'));

  envelopeEl.classList.remove('env--open');
  envelopeEl.classList.add('env--closed');

  // Force reflow to apply the no-transition styles
  void envelopeEl.offsetHeight;

  // Re-enable transitions for future interactions
  els.forEach(el => (el.style.transition = ''));
}

if (restartButton) {
  restartButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    resetEnvelopeInstant(envelope);
    if (valHeading) valHeading.classList.remove('is-visible');
    try {
      currentSlide = 0;
      updateCarousel && updateCarousel();
    } catch (e) {}
  });
}