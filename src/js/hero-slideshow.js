document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const toggle = document.querySelector(".hero-slideshow-toggle");
  if (slides.length <= 1) return;

  let currentIndex = slides.findIndex((slide) => slide.classList.contains("active"));
  if (currentIndex === -1) currentIndex = 0;

  let slideInterval = null;
  let pausedByUser = false;
  const ROTATION_TIME = 6000;

  const showSlide = (nextIndex) => {
    slides[currentIndex].classList.remove("active", "is-active");
    slides[currentIndex].setAttribute("aria-hidden", "true");
    slides[currentIndex].alt = "";

    slides[nextIndex].classList.add("active", "is-active");
    slides[nextIndex].setAttribute("aria-hidden", "false");
    slides[nextIndex].alt = slides[nextIndex].dataset.slideAlt || slides[nextIndex].alt;
    currentIndex = nextIndex;
  };

  const nextSlide = () => showSlide((currentIndex + 1) % slides.length);

  const startSlideshow = () => {
    if (pausedByUser || document.hidden || slideInterval) return;
    slideInterval = setInterval(nextSlide, ROTATION_TIME);
  };

  const stopSlideshow = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  };

  const updateToggle = () => {
    if (!toggle) return;
    toggle.textContent = pausedByUser ? "Play slideshow" : "Pause slideshow";
    toggle.setAttribute("aria-label", pausedByUser ? "Play slideshow" : "Pause slideshow");
    toggle.setAttribute("aria-pressed", String(pausedByUser));
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      pausedByUser = !pausedByUser;
      if (pausedByUser) stopSlideshow();
      else startSlideshow();
      updateToggle();
    });
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) pausedByUser = true;

  slides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", index === currentIndex ? "false" : "true");
    if (index !== currentIndex) slide.alt = "";
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSlideshow();
    else startSlideshow();
  });

  updateToggle();
  startSlideshow();
});