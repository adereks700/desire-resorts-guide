(() => {
  const CONSENT_KEY = "twn_cookie_consent";

  const setAnalyticsConsent = (accepted) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: accepted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  };

  const initConsent = () => {
    const banner = document.getElementById("cookie-consent-banner");
    if (!banner) return;

    const acceptBtn = document.getElementById("cookie-consent-accept");
    const rejectBtn = document.getElementById("cookie-consent-reject");

    let consent = null;
    try { consent = localStorage.getItem(CONSENT_KEY); } catch (e) {}

    const showBanner = (moveFocus = false) => {
      banner.hidden = false;
      banner.removeAttribute("aria-hidden");
      banner.classList.add("is-visible");
      if (moveFocus) acceptBtn?.focus();
    };

    const hideBanner = () => {
      banner.classList.remove("is-visible");
      banner.setAttribute("aria-hidden", "true");
      banner.hidden = true;
    };

    const finish = (value) => {
      const accepted = value === "accepted";
      try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
      setAnalyticsConsent(accepted);
      hideBanner();
    };

    if (consent === "accepted" || consent === "rejected") {
      setAnalyticsConsent(consent === "accepted");
      hideBanner();
    } else {
      showBanner();
    }

    acceptBtn?.addEventListener("click", () => finish("accepted"));
    rejectBtn?.addEventListener("click", () => finish("rejected"));

    document.querySelectorAll(".js-open-cookie-preferences").forEach((button) => {
      button.addEventListener("click", () => showBanner(true));
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initConsent);
  else initConsent();
})();