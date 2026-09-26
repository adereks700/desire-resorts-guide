document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle, [data-nav-toggle]");
  const navMenu = document.querySelector(".nav-menu, [data-nav-menu]");
  const navItemsWithSubmenu = document.querySelectorAll(".nav-item.has-dropdown, .nav-item:has(.nav-dropdown)");

  if (!navToggle || !navMenu) return;

  const toggleMenu = (open) => {
    const isExpanded = open !== undefined ? open : navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(isExpanded));
    navMenu.classList.toggle("is-active", isExpanded);
    document.body.classList.toggle("menu-open", isExpanded);
  };

  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Handle mobile submenu expansion
  navItemsWithSubmenu.forEach((item) => {
    const trigger = item.querySelector(".nav-link, button");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 960) {
        const hasDropdown = item.querySelector(".nav-dropdown");
        if (hasDropdown) {
          e.preventDefault();
          const isOpen = item.classList.toggle("is-open");
          trigger.setAttribute("aria-expanded", String(isOpen));
        }
      }
    });
  });

  // Close menus on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleMenu(false);
      navItemsWithSubmenu.forEach((i) => i.classList.remove("is-open"));
    }
  });

  // Close when clicking outside of navigation
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });
});
