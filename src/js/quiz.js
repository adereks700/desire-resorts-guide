document.addEventListener("DOMContentLoaded", () => {
  const steps = [...document.querySelectorAll(".quiz-step")];
  const resultEl = document.getElementById("quiz-result");
  if (!steps.length || !resultEl) return;

  const segments = window.QUIZ_SEGMENTS || {};
  const answers = [];
  let current = 1;
  const total = steps.length;

  const stepIndicator = document.getElementById("step-indicator");
  const progressFill = document.getElementById("progress-bar-fill");
  const progressTrack = document.querySelector(".progress-bar-track");
  const backBtn = document.getElementById("quiz-back");
  const restartBtn = document.getElementById("quiz-restart");

  function showStep(n, moveFocus = true) {
    current = n;
    steps.forEach((step) => {
      const active = Number(step.dataset.q) === n;
      step.hidden = !active;
      step.style.display = active ? "" : "none";
    });

    if (stepIndicator) stepIndicator.textContent = "Question " + n + " of " + total;
    if (progressFill) progressFill.style.width = Math.round((n / total) * 100) + "%";
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(n));
    if (backBtn) backBtn.hidden = n === 1;
    if (restartBtn) restartBtn.hidden = false;

    if (moveFocus) {
      const heading = steps[n - 1]?.querySelector("h2");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }
  }

  function tallyWinner() {
    const counts = {};
    answers.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
    const order = ["romantic-retreat", "balanced-explorer", "social-celebration"];
    return order.reduce((winner, key) => {
      return (counts[key] || 0) > (counts[winner] || 0) ? key : winner;
    }, "balanced-explorer");
  }

  function priorityLabels(key) {
    const labels = {
      "romantic-retreat": ["Downtime", "Privacy", "Unhurried pace"],
      "balanced-explorer": ["Flexibility", "Choice", "Balanced access"],
      "social-celebration": ["Social activity", "Entertainment", "Being near activity"]
    };
    return labels[key] || labels["balanced-explorer"];
  }

  function showResult() {
    const key = tallyWinner();
    const data = segments[key] || segments["balanced-explorer"] || {};
    steps.forEach((step) => { step.hidden = true; step.style.display = "none"; });

    const progress = document.querySelector(".quiz-progress");
    if (progress) progress.style.display = "none";
    if (backBtn) backBtn.hidden = true;
    if (restartBtn) restartBtn.hidden = false;

    const label = document.getElementById("result-label");
    const resort = document.getElementById("result-resort");
    const trigger = document.getElementById("result-trigger");
    const wing = document.getElementById("result-wing");
    const best = document.getElementById("result-best");
    const link = document.getElementById("result-link");
    const img = document.getElementById("result-image");
    const figure = document.getElementById("result-figure");
    const priorities = document.getElementById("result-priorities");

    if (label) label.textContent = data.label || "Your Planning Profile";
    if (resort) resort.textContent = data.resort || "";
    if (trigger) trigger.textContent = data.primaryTrigger || "";
    if (wing) wing.textContent = data.recommendedWing || "";
    if (best) best.textContent = data.bestFor || "";
    if (priorities) {
      priorities.innerHTML = priorityLabels(key).map((item) => "<span>" + item + "</span>").join("");
    }
    if (link) {
      link.href = data.propertyUrl || "/compare/";
      link.textContent = key === "balanced-explorer" ? "Compare Both Resorts" : "Explore " + (key === "romantic-retreat" ? "Desire Pearl" : "Riviera Maya");
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

  function resetQuiz() {
    answers.length = 0;
    resultEl.style.display = "none";
    const progress = document.querySelector(".quiz-progress");
    if (progress) progress.style.display = "";
    showStep(1, false);
    const firstHeading = steps[0]?.querySelector("h2");
    if (firstHeading) firstHeading.focus({ preventScroll: true });
  }

  document.querySelectorAll(".quiz-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.val;
      if (!val) return;
      answers[current - 1] = val;
      if (current < total) showStep(current + 1);
      else showResult();
    });
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (current > 1) showStep(current - 1);
    });
  }

  if (restartBtn) restartBtn.addEventListener("click", resetQuiz);

  showStep(1, false);
});
