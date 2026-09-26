document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn, [data-filter-btn]");
  const filterCards = document.querySelectorAll(".card[data-category], [data-filter-item]");

  if (!filterButtons.length || !filterCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-filter") || btn.getAttribute("data-category") || "all";

      filterButtons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      filterCards.forEach((card) => {
        const itemCat = card.getAttribute("data-category") || "";
        const matches = selected === "all" || itemCat.split(" ").includes(selected);

        if (matches) {
          card.style.display = "";
          card.removeAttribute("hidden");
          setTimeout(() => card.classList.remove("is-hidden"), 10);
        } else {
          card.classList.add("is-hidden");
          card.setAttribute("hidden", "until-found");
          card.style.display = "none";
        }
      });
    });
  });
});
