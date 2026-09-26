document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  if (slides.length <= 1) return;

  let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (currentIndex === -1) {
    currentIndex = 0;
    slides[0].classList.add("is-active");
  }

  let slideInterval = null;
  const ROTATION_TIME = 6000;

  const showSlide = (nextIndex) => {
    slides[currentIndex].classList.remove("is-active");
    slides[currentIndex].setAttribute("aria-hidden", "true");
    
    slides[nextIndex].classList.add("is-active");
    slides[nextIndex].setAttribute("aria-hidden", "false");
    
    currentIndex = nextIndex;
  };

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  };

  const startSlideshow = () => {
    if (!slideInterval) {
      slideInterval = setInterval(nextSlide, ROTATION_TIME);
    }
  };

  const stopSlideshow = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  };

  // Pause when window/tab is in the background to save battery and GPU cycles
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  startSlideshow();
});
