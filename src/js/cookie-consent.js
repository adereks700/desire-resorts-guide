(() => {
  const CONSENT_KEY = "twn_cookie_consent";

  const initConsent = () => {
    const banner = document.getElementById("cookie-consent-banner");
    if (!banner) return;

    let consent = null;
    try { consent = localStorage.getItem(CONSENT_KEY); } catch (e) {}

    if (consent) {
      banner.remove();
      return;
    }

    banner.classList.add("is-visible");

    const acceptBtn = document.getElementById("cookie-consent-accept");
    const rejectBtn = document.getElementById("cookie-consent-reject");

    const finish = (value) => {
      try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
      banner.classList.remove("is-visible");
      window.setTimeout(() => banner.remove(), 300);
    };

    acceptBtn?.addEventListener("click", () => finish("accepted"));
    rejectBtn?.addEventListener("click", () => finish("rejected"));
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initConsent);
  else initConsent();
})();