(function () {
  var STORAGE_KEY = 'twn-cookie-consent';
  var banner = document.getElementById('cookie-consent-banner');
  if (!banner) return;

  function applyConsent(status) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': status === 'granted' ? 'granted' : 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
  }

  function showBanner() {
    banner.classList.add('is-visible');
  }

  function hideBanner() {
    banner.classList.remove('is-visible');
  }

  function getStoredConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeConsent(status) {
    try {
      localStorage.setItem(STORAGE_KEY, status);
    } catch (e) {
      /* localStorage unavailable (private browsing, etc.) - consent
         still applies for this page load via applyConsent(), it just
         won't be remembered next visit. */
    }
  }

  function whenAgeGateClear(callback) {
    var gate = document.getElementById('age-gate');
    if (!gate) {
      callback();
      return;
    }
    var observer = new MutationObserver(function () {
      if (!document.getElementById('age-gate')) {
        observer.disconnect();
        callback();
      }
    });
    observer.observe(document.body, { childList: true });
  }

  var stored = getStoredConsent();

  if (stored === 'granted' || stored === 'denied') {
    applyConsent(stored);
  } else {
    whenAgeGateClear(showBanner);
  }

  var acceptBtn = document.getElementById('cookie-consent-accept');
  var rejectBtn = document.getElementById('cookie-consent-reject');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      storeConsent('granted');
      applyConsent('granted');
      hideBanner();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', function () {
      storeConsent('denied');
      applyConsent('denied');
      hideBanner();
    });
  }

  var preferencesLinks = document.querySelectorAll('.js-open-cookie-preferences');
  preferencesLinks.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      showBanner();
    });
  });
})();