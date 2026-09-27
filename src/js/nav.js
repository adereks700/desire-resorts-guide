document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".primary-nav");
  const header = document.querySelector(".site-header");
  if (!navToggle || !navMenu || !header) return;

  const submenuToggles = Array.from(navMenu.querySelectorAll(".nav-submenu-toggle"));
  let previousFocus = null;

  const setPageInert = (isInert) => {
    Array.from(document.body.children).forEach((el) => {
      if (el === header) return;
      if (isInert) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  };

  const closeSubmenus = () => {
    navMenu.querySelectorAll(".nav-item.is-expanded").forEach((item) => item.classList.remove("is-expanded"));
    submenuToggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", `Expand ${toggle.closest(".nav-item").querySelector(".nav-link").textContent.trim()} submenu`);
    });
  };

  const closeMenu = (restoreFocus = false) => {
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("nav-locked");
    setPageInert(false);
    closeSubmenus();
    if (restoreFocus && previousFocus) previousFocus.focus();
    previousFocus = null;
  };

  const openMenu = () => {
    previousFocus = document.activeElement;
    navToggle.setAttribute("aria-expanded", "true");
    navMenu.classList.add("is-open");
    document.body.classList.add("nav-locked");
    setPageInert(true);
  };

  navToggle.addEventListener("click", () => {
    if (navToggle.getAttribute("aria-expanded") === "true") closeMenu();
    else openMenu();
  });

  submenuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".nav-item");
      const open = item.classList.toggle("is-expanded");
      toggle.setAttribute("aria-expanded", String(open));
      const label = item.querySelector(".nav-link").textContent.trim();
      toggle.setAttribute("aria-label", `${open ? "Collapse" : "Expand"} ${label} submenu`);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      closeMenu(true);
    }

    if (event.key === "Tab" && navToggle.getAttribute("aria-expanded") === "true") {
      const focusable = navMenu.querySelectorAll("a, button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        navToggle.focus();
      } else if (!event.shiftKey && document.activeElement === navToggle) {
        event.preventDefault();
        first.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        navToggle.focus();
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (navToggle.getAttribute("aria-expanded") !== "true") return;
    if (!header.contains(event.target)) closeMenu();
  });
});