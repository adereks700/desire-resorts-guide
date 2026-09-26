document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (!navToggle || !primaryNav) return;

  function openNav() {
    navToggle.setAttribute('aria-expanded', 'true');
    primaryNav.classList.add('is-open');
    document.body.classList.add('nav-locked');
  }

  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
    document.body.classList.remove('nav-locked');
    primaryNav.querySelectorAll('.has-dropdown').forEach(item => {
      item.classList.remove('is-expanded');
      const itemLink = item.querySelector(':scope > .nav-link');
      if (itemLink) itemLink.setAttribute('aria-expanded', 'false');
    });
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Handle dropdown accordions on mobile
  const dropdownItems = primaryNav.querySelectorAll('.has-dropdown > .nav-link');
  dropdownItems.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        const parent = link.closest('.has-dropdown');
        const wasOpen = parent.classList.contains('is-expanded');

        // Close other open mobile accordions
        primaryNav.querySelectorAll('.has-dropdown').forEach(item => {
          item.classList.remove('is-expanded');
          const itemLink = item.querySelector(':scope > .nav-link');
          if (itemLink) itemLink.setAttribute('aria-expanded', 'false');
        });

        if (!wasOpen) {
          parent.classList.add('is-expanded');
          link.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });

  // Announce dropdown state to screen readers as keyboard/focus moves through
  // the desktop menu (the dropdown itself is shown via CSS :focus-within).
  document.addEventListener('focusin', () => {
    dropdownItems.forEach((link) => {
      const parent = link.closest('.has-dropdown');
      const isOpen = parent.contains(document.activeElement);
      link.setAttribute('aria-expanded', String(isOpen));
    });
  });

  // Close when clicking any direct link inside mobile drawer
  primaryNav.querySelectorAll('.dropdown-menu a, .nav-item--cta a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        closeNav();
      }
    });
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeNav();
      navToggle.focus();
    }
  });

  // Close when clicking outside of nav container
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth <= 991 &&
      primaryNav.classList.contains('is-open') &&
      !primaryNav.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeNav();
    }
  });
});