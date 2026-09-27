document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.getElementById("booking-drawer");
  const drawerTab = document.querySelector(".drawer-tab");
  const closeButton = document.createElement("button");
  const forms = document.querySelectorAll(".custom-booking-bar");

  const localDate = (date = new Date()) => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");

  forms.forEach((form) => {
    const checkin = form.querySelector("input[name='checkin']");
    if (checkin && !checkin.min) checkin.min = localDate();
    if (checkin && !checkin.value) checkin.value = localDate();
  });

  if (!drawer || !drawerTab) return;

  let previousFocus = null;
  closeButton.type = "button";
  closeButton.className = "drawer-close-btn";
  closeButton.textContent = "Close";
  closeButton.setAttribute("aria-label", "Close availability panel");
  drawer.prepend(closeButton);

  const setPageInert = (isInert) => {
    Array.from(document.body.children).forEach((el) => {
      if (el === drawer || el === drawerTab) return;
      if (isInert) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  };

  const close = (restore = true) => {
    drawer.classList.remove("is-expanded");
    drawer.setAttribute("aria-hidden", "true");
    drawer.setAttribute("inert", "");
    drawerTab.setAttribute("aria-expanded", "false");
    document.body.classList.remove("drawer-open");
    setPageInert(false);
    if (restore && previousFocus) previousFocus.focus();
    previousFocus = null;
  };

  const open = () => {
    if (window.innerWidth >= 992) return;
    previousFocus = document.activeElement;
    drawer.classList.add("is-expanded");
    drawer.setAttribute("aria-hidden", "false");
    drawer.removeAttribute("inert");
    drawerTab.setAttribute("aria-expanded", "true");
    document.body.classList.add("drawer-open");
    setPageInert(true);
    window.requestAnimationFrame(() => closeButton.focus());
  };

  drawerTab.addEventListener("click", () => {
    if (drawer.getAttribute("aria-hidden") === "true") open();
    else close();
  });
  closeButton.addEventListener("click", () => close());

  document.addEventListener("keydown", (event) => {
    if (drawer.getAttribute("aria-hidden") !== "false") return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = drawer.querySelectorAll("a, button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992 && drawer.getAttribute("aria-hidden") === "false") close(false);
  });
});