(function () {
  const hero = document.querySelector('.hero');
  const slides = document.querySelectorAll('.hero-slide');
  if (!hero || slides.length < 2) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let current = 0;
  let timer = null;
  let paused = false;

  const advance = () => {
    if (paused) return;

    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  };

  const start = () => {
    if (timer || paused) return;
    timer = window.setInterval(advance, 5000);
  };

  const stop = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  const pause = () => {
    paused = true;
    stop();
  };

  const resume = () => {
    paused = false;
    start();
  };

  // Pause while the pointer is over the hero so visitors have time to read it.
  hero.addEventListener('mouseenter', pause);
  hero.addEventListener('mouseleave', resume);

  // Pause while keyboard focus is inside the hero. Ignore focus transitions
  // between controls within the hero so the slideshow doesn't restart.
  hero.addEventListener('focusin', pause);
  hero.addEventListener('focusout', (event) => {
    if (!hero.contains(event.relatedTarget)) {
      resume();
    }
  });

  start();
})();
