(() => {
  const CONSENT_KEY = "twn_cookie_consent";
  
  const initConsent = () => {
    const banner = document.querySelector(".cookie-consent-bar, #cookie-consent");
    if (!banner) return;

    if (localStorage.getItem(CONSENT_KEY) === "accepted") {
      banner.style.display = "none";
      banner.remove();
      return;
    }

    banner.removeAttribute("hidden");
    banner.style.display = "flex";

    const acceptBtn = banner.querySelector("button[data-accept], .btn-cookie-accept");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => {
        localStorage.setItem(CONSENT_KEY, "accepted");
        banner.style.opacity = "0";
        banner.style.transform = "translate(-50%, 20px)";
        banner.style.transition = "all 0.3s ease";
        setTimeout(() => banner.remove(), 300);
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsent);
  } else {
    initConsent();
  }
})();
