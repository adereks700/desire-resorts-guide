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
  const nextStep = document.getElementById("result-next-step");
  const nextLink = document.getElementById("result-next-link");

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
    const focus = document.getElementById("result-focus");
    const context = document.getElementById("result-context");
    const img = document.getElementById("result-image");
    const figure = document.getElementById("result-figure");
    const priorities = document.getElementById("result-priorities");

    if (label) label.textContent = data.label || "Your Planning Profile";
    if (focus) focus.textContent = priorityLabels(key).join(", ") + ". Compare those characteristics on the resort comparison and room pages.";
    if (context) context.textContent = "Your answers describe planning priorities, not a resort recommendation. Current room categories, schedules, policies, and availability still need to be checked.";
    if (nextStep) nextStep.textContent = "Use the comparison page to review the two properties side by side, then move into room selection.";
    if (nextLink) { nextLink.href = "/compare/"; nextLink.textContent = "Compare the Resorts"; }
    if (priorities) {
      priorities.innerHTML = priorityLabels(key).map((item) => "<span>" + item + "</span>").join("");
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
