(function () {
  function getStoredConsent() {
    try {
      const rawValue = window.localStorage.getItem("cookieConsent");
      return rawValue ? JSON.parse(rawValue) : null;
    } catch (error) {
      return null;
    }
  }

  function storeConsent(preferences) {
    try {
      window.localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    } catch (error) {
      return;
    }
  }

  function closeCookieBanner() {
    const cookieBanner = document.getElementById("cookieConsent");
    if (cookieBanner) {
      cookieBanner.classList.remove("show");
    }
  }

  function syncCookieControls(preferences) {
    const analyticsCheckbox = document.getElementById("analyticsCookies");
    const marketingCheckbox = document.getElementById("marketingCookies");

    if (analyticsCheckbox) {
      analyticsCheckbox.checked = Boolean(preferences && preferences.analytics);
    }

    if (marketingCheckbox) {
      marketingCheckbox.checked = Boolean(preferences && preferences.marketing);
    }
  }

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    if (!animatedElements.length) {
      return;
    }

    animatedElements.forEach((element) => {
      element.classList.add("ready");
    });

    if (!("IntersectionObserver" in window)) {
      animatedElements.forEach((element) => {
        element.classList.add("is-visible");
        element.classList.remove("ready");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    animatedElements.forEach((element) => observer.observe(element));
  }

  function initCookieConsent() {
    const cookieBanner = document.getElementById("cookieConsent");
    const cookieSettingsModal = document.getElementById("cookieSettingsModal");

    if (!cookieBanner || !cookieSettingsModal) {
      return;
    }

    const savedPreferences = getStoredConsent();
    syncCookieControls(savedPreferences);

    if (!savedPreferences) {
      window.setTimeout(function () {
        cookieBanner.classList.add("show");
      }, 1000);
    }

    cookieSettingsModal.addEventListener("click", function (event) {
      if (event.target === cookieSettingsModal) {
        window.closeCookieSettings();
      }
    });
  }

  window.acceptAllCookies = function () {
    storeConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
    closeCookieBanner();
    window.closeCookieSettings();
  };

  window.declineCookies = function () {
    storeConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
    closeCookieBanner();
    window.closeCookieSettings();
  };

  window.openCookieSettings = function () {
    const cookieSettingsModal = document.getElementById("cookieSettingsModal");
    if (!cookieSettingsModal) {
      return;
    }

    syncCookieControls(getStoredConsent());
    cookieSettingsModal.classList.add("show");
  };

  window.closeCookieSettings = function () {
    const cookieSettingsModal = document.getElementById("cookieSettingsModal");
    if (cookieSettingsModal) {
      cookieSettingsModal.classList.remove("show");
    }
  };

  window.savePreferences = function () {
    const analyticsCheckbox = document.getElementById("analyticsCookies");
    const marketingCheckbox = document.getElementById("marketingCookies");

    storeConsent({
      necessary: true,
      analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
      marketing: marketingCheckbox ? marketingCheckbox.checked : false,
      timestamp: new Date().toISOString(),
    });

    closeCookieBanner();
    window.closeCookieSettings();
  };

  document.addEventListener("DOMContentLoaded", function () {
    initScrollAnimations();
    initCookieConsent();
  });
})();
