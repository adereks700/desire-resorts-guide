(function () {
  // Prevent guests from picking a check-in date in the past.
  const today = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('.custom-booking-bar input[type="date"]').forEach((input) => {
    input.setAttribute("min", today);
  });

  const drawer = document.querySelector(".booking-widget--vertical, .booking-widget--drawer");
  const drawerTab = document.querySelector(".drawer-tab");

  if (!drawerTab || !drawer) return;

  if (!drawer.querySelector(".drawer-close-btn")) {
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "drawer-close-btn";
    closeBtn.setAttribute("aria-label", "Close booking panel");
    closeBtn.innerHTML = "&times; Close";
    drawer.insertBefore(closeBtn, drawer.firstChild);
    closeBtn.addEventListener("click", closeDrawer);
  }

  const closeBtn = drawer.querySelector(".drawer-close-btn");
  let lastFocusedElement = drawerTab;

  function getFocusable() {
    return Array.from(drawer.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  function openDrawer() {
    lastFocusedElement = document.activeElement || drawerTab;
    drawer.classList.add("is-expanded");
    drawerTab.setAttribute("aria-expanded", "true");
    drawerTab.classList.add("is-active");
    drawer.setAttribute("aria-hidden", "false");
    drawer.removeAttribute("inert");

    window.requestAnimationFrame(() => {
      if (closeBtn) closeBtn.focus();
    });
  }

  function closeDrawer() {
    drawer.classList.remove("is-expanded");
    drawerTab.setAttribute("aria-expanded", "false");
    drawerTab.classList.remove("is-active");
    drawer.setAttribute("aria-hidden", "true");
    drawer.setAttribute("inert", "");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    } else {
      drawerTab.focus();
    }
  }

  drawerTab.setAttribute("aria-expanded", "false");
  drawerTab.setAttribute("aria-controls", drawer.id);
  drawer.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeDrawer();
      return;
    }

    if (e.key !== "Tab") return;

    const focusable = getFocusable();
    if (!focusable.length) {
      e.preventDefault();
      closeBtn?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  drawerTab.addEventListener("click", () => {
    if (drawer.classList.contains("is-expanded")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
})();
