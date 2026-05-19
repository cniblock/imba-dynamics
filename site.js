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

  function initNavbarScroll() {
    const navbar = document.querySelector(".navbar-imba");
    if (!navbar) {
      return;
    }

    const updateNavbar = function () {
      if (window.scrollY > 48) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
  }

  function initTechStackAccordion() {
    const columns = document.querySelectorAll(".tech-card-column");
    const accordionRoot = document.getElementById("techStackAccordion");

    if (!columns.length || !accordionRoot) {
      return;
    }

    columns.forEach(function (column, index) {
      const flipCard = column.querySelector(".flip-card");
      if (!flipCard) {
        return;
      }

      const title =
        flipCard.querySelector(".flip-card-front span")?.textContent?.trim() ||
        "Technology";
      const description =
        flipCard.querySelector(".flip-card-back p")?.textContent?.trim() || "";
      const icon = flipCard.querySelector(".flip-card-front img");
      const learnMore = flipCard.querySelector(".learn-more-btn");
      const headingId = "techHeading" + index;
      const collapseId = "techCollapse" + index;
      const isFirst = index === 0;

      const item = document.createElement("div");
      item.className = "accordion-item";

      const header = document.createElement("h2");
      header.className = "accordion-header";
      header.id = headingId;

      const button = document.createElement("button");
      button.className = "accordion-button" + (isFirst ? "" : " collapsed");
      button.type = "button";
      button.setAttribute("data-bs-toggle", "collapse");
      button.setAttribute("data-bs-target", "#" + collapseId);
      button.setAttribute("aria-expanded", isFirst ? "true" : "false");
      button.setAttribute("aria-controls", collapseId);

      if (icon) {
        const iconClone = icon.cloneNode(true);
        iconClone.classList.add("tech-accordion-icon");
        iconClone.removeAttribute("width");
        iconClone.removeAttribute("height");
        button.appendChild(iconClone);
      }

      button.appendChild(document.createTextNode(title));
      header.appendChild(button);

      const collapseWrap = document.createElement("div");
      collapseWrap.id = collapseId;
      collapseWrap.className =
        "accordion-collapse collapse" + (isFirst ? " show" : "");
      collapseWrap.setAttribute("aria-labelledby", headingId);
      collapseWrap.setAttribute("data-bs-parent", "#techStackAccordion");

      const body = document.createElement("div");
      body.className = "accordion-body";
      body.textContent = description;

      if (learnMore) {
        const learnClone = learnMore.cloneNode(true);
        body.appendChild(document.createElement("br"));
        body.appendChild(learnClone);
      }

      collapseWrap.appendChild(body);
      item.appendChild(header);
      item.appendChild(collapseWrap);
      accordionRoot.appendChild(item);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initScrollAnimations();
    initCookieConsent();
    initNavbarScroll();
    initTechStackAccordion();
  });
})();
