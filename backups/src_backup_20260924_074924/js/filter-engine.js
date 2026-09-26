function scoreQuiz(answers, segments) {
  const tally = {};
  answers.forEach(key => {
    tally[key] = (tally[key] || 0) + 1;
  });

  const priority = ["balanced-explorer", "romantic-retreat", "social-celebration"];
  const maxCount = Math.max(...Object.values(tally), 0);
  const leaders = priority.filter(key => (tally[key] || 0) === maxCount);
  const topSegment = leaders.length === 1 ? leaders[0] : "balanced-explorer";

  return {
    segment: topSegment,
    data: segments[topSegment] || {
      label: "Custom Match",
      resort: "Desire Resorts",
      primaryTrigger: "Explore our resort comparison guide to find your pace.",
      recommendedWing: "Garden or Ocean Suites",
      propertyUrl: "/compare/",
      bestFor: "Couples looking to explore at their own speed."
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const quizCard = document.getElementById("quiz-card");
  if (!quizCard) return;

  const segments = window.QUIZ_SEGMENTS || {};

  const steps = quizCard.querySelectorAll(".quiz-step");
  const progressFill = document.getElementById("progress-bar-fill");
  const stepIndicator = document.getElementById("step-indicator");
  const resultBox = document.getElementById("quiz-result");

  const answers = [];
  let currentStep = 0;

  quizCard.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.val;
      answers.push(val);

      steps[currentStep].style.display = "none";
      currentStep++;

      if (currentStep < steps.length) {
        steps[currentStep].style.display = "block";
        const progress = Math.round(((currentStep + 1) / steps.length) * 100);
        if (progressFill) {
          progressFill.style.width = `${progress}%`;
          progressFill.parentElement.setAttribute("aria-valuenow", String(currentStep + 1));
        }
        if (stepIndicator) stepIndicator.textContent = `Question ${currentStep + 1} of ${steps.length}`;
      } else {
        if (stepIndicator) stepIndicator.textContent = "Complete";
        if (progressFill) {
          progressFill.style.width = "100%";
          progressFill.parentElement.setAttribute("aria-valuenow", String(steps.length));
        }

        const result = scoreQuiz(answers, segments);
        document.getElementById("result-label").textContent = result.data.label;
        document.getElementById("result-resort").textContent = result.data.resort;
        document.getElementById("result-trigger").textContent = result.data.primaryTrigger;
        document.getElementById("result-wing").textContent = result.data.recommendedWing;
        document.getElementById("result-best").textContent = result.data.bestFor;

        const link = document.getElementById("result-link");
        if (link) link.href = result.data.propertyUrl;

        resultBox.style.display = "block";
        resultBox.focus();
      }
    });
  });
});
