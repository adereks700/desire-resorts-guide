document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".quiz-step");
  const resultEl = document.getElementById("quiz-result");
  if (!steps.length || !resultEl) return;

  const segments = window.QUIZ_SEGMENTS || {};
  const answers = [];
  let current = 1;
  const total = steps.length;

  const stepIndicator = document.getElementById("step-indicator");
  const progressFill = document.getElementById("progress-bar-fill");
  const progressTrack = document.querySelector(".progress-bar-track");

  function showStep(n) {
    steps.forEach((step) => {
      const q = Number(step.getAttribute("data-q"));
      step.style.display = q === n ? "" : "none";
    });
    if (stepIndicator) stepIndicator.textContent = "Question " + n + " of " + total;
    if (progressFill) progressFill.style.width = Math.round((n / total) * 100) + "%";
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(n));
  }

  function tallyWinner() {
    const counts = {};
    answers.forEach((v) => {
      counts[v] = (counts[v] || 0) + 1;
    });
    let winner = answers[answers.length - 1] || "balanced-explorer";
    let max = 0;
    Object.keys(counts).forEach((k) => {
      if (counts[k] > max) {
        max = counts[k];
        winner = k;
      }
    });
    return winner;
  }

  function showResult() {
    const key = tallyWinner();
    const data = segments[key] || segments["balanced-explorer"] || {};

    steps.forEach((s) => {
      s.style.display = "none";
    });
    const progress = document.querySelector(".quiz-progress");
    if (progress) progress.style.display = "none";

    const label = document.getElementById("result-label");
    const resort = document.getElementById("result-resort");
    const trigger = document.getElementById("result-trigger");
    const wing = document.getElementById("result-wing");
    const best = document.getElementById("result-best");
    const link = document.getElementById("result-link");
    const img = document.getElementById("result-image");
    const figure = document.getElementById("result-figure");

    if (label) label.textContent = data.label || "Your Match";
    if (resort) resort.textContent = data.resort || "";
    if (trigger) trigger.textContent = data.primaryTrigger || "";
    if (wing) wing.textContent = data.recommendedWing || "";
    if (best) best.textContent = data.bestFor || "";
    if (link) {
      link.href = data.propertyUrl || "/compare/";
      link.textContent =
        key === "balanced-explorer"
          ? "Compare Both Resorts"
          : key === "romantic-retreat"
            ? "Explore Desire Pearl"
            : "Explore Riviera Maya";
    }

    if (img && data.image) {
      img.src = data.image;
      img.alt = data.imageAlt || data.label || "Quiz result";
      if (figure) figure.hidden = false;
    } else if (figure) {
      figure.hidden = true;
    }

    resultEl.style.display = "";
    resultEl.focus({ preventScroll: true });
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll(".quiz-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-val");
      if (!val) return;
      answers.push(val);

      if (current < total) {
        current += 1;
        showStep(current);
      } else {
        showResult();
      }
    });
  });

  showStep(1);
});
