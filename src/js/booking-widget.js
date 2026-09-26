document.addEventListener("DOMContentLoaded", () => {
  const bookingForms = document.querySelectorAll(".booking-form, #booking-engine-form");

  const RESORT_URLS = {
    drm: "https://www.desire-experience.com/resorts/desire-riviera-maya-resort/",
    pearl: "https://www.desire-experience.com/resorts/desire-pearl-resort/",
    both: "https://www.desire-experience.com/resorts/"
  };

  bookingForms.forEach((form) => {
    // Default dates (Check-in tomorrow, check-out in 4 days) if unset
    const checkinInput = form.querySelector("input[name='checkin'], #checkin");
    const checkoutInput = form.querySelector("input[name='checkout'], #checkout");

    if (checkinInput && !checkinInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      checkinInput.value = tomorrow.toISOString().split("T")[0];
      checkinInput.min = new Date().toISOString().split("T")[0];

      if (checkoutInput && !checkoutInput.value) {
        const defaultOut = new Date(tomorrow);
        defaultOut.setDate(defaultOut.getDate() + 3);
        checkoutInput.value = defaultOut.toISOString().split("T")[0];
        checkoutInput.min = checkinInput.value;
      }
    }

    if (checkinInput && checkoutInput) {
      checkinInput.addEventListener("change", () => {
        checkoutInput.min = checkinInput.value;
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
          const nextDay = new Date(checkinInput.value);
          nextDay.setDate(nextDay.getDate() + 1);
          checkoutInput.value = nextDay.toISOString().split("T")[0];
        }
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const propertySelect = form.querySelector("select[name='property'], #property");
      const selectedProperty = propertySelect ? propertySelect.value : "drm";
      const baseUrl = RESORT_URLS[selectedProperty] || RESORT_URLS.drm;

      const destinationUrl = new URL(baseUrl);
      const params = destinationUrl.searchParams;

      // Extract form values
      const checkin = checkinInput ? checkinInput.value : "";
      const checkout = checkoutInput ? checkoutInput.value : "";
      const guests = form.querySelector("select[name='guests'], #guests");

      if (checkin) params.set("checkin", checkin);
      if (checkout) params.set("checkout", checkout);
      if (guests && guests.value) params.set("occupancy", guests.value);

      // Append standard affiliate tracking
      params.set("utm_source", "travel_with_nicole");
      params.set("utm_medium", "affiliate");
      params.set("utm_campaign", "suite_check_bar");

      window.open(destinationUrl.toString(), "_blank", "noopener,noreferrer");
    });
  });
});
