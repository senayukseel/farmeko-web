/* ==========================================================
   FARMEKO - Shared Components (Navbar + Footer)
   Also contains: i18n engine (TR/EN) and Theme engine (light/dark)
   ========================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. GLOBAL CONFIG  (edit your real company info here)
     --------------------------------------------------------- */
  const CONFIG = {
    brand: "Farmeko",
    whatsapp: "905527261308",          // international format, no "+" or spaces
    phone: "+90 5XX XXX XX XX",
    email: "info@farmeko.com.tr",
    address: "Antalya, Türkiye",
    logos: {
      light: "images/farmeko-light-theme.svg",  // used in LIGHT mode
      dark: "images/farmeko-dark-theme.svg"     // used in DARK mode (and the always-dark footer)
    },
    social: {
      instagram: "#",
      facebook: "#",
      linkedin: "#",
      youtube: "#"
    }
  };

  /* ---------------------------------------------------------
     2. TRANSLATION DICTIONARY
     Each page will add its own keys later (we'll extend this).
     --------------------------------------------------------- */
  const I18N = {
    tr: {
      "topbar.tagline": "Tarım, Hayvancılık ve Veteriner Çözümleri",
      "nav.home": "Ana Sayfa",
      "nav.products": "Ürünler",
      "nav.corporate": "Kurumsal",
      "nav.blog": "Blog",
      "nav.b2b": "Bayi Başvurusu",
      "nav.contact": "İletişim",
      "nav.toggleMenu": "Menüyü aç/kapat",
      "theme.toggle": "Açık/Koyu tema değiştir",
      "lang.switch": "Dil seçimi",
      "cat.nutrition": "Yem Katkıları ve Premiksler",
      "cat.equipment": "Hayvancılık Ekipmanları",
      "cat.machinery": "Endüstriyel Tarım Makineleri",
      "cat.veterinary": "Veteriner ve Tıbbi Ürünler",
      "footer.about": "Farmeko; çiftçilere, büyükbaş ve küçükbaş işletmelerine, veteriner kliniklerine ve bayilere yönelik yem katkıları, sağım sistemleri, tarım makineleri ve veteriner sarf malzemeleri sunar.",
      "footer.quickLinks": "Hızlı Bağlantılar",
      "footer.categories": "Ürün Kategorileri",
      "footer.contact": "İletişim",
      "footer.rights": "Tüm hakları saklıdır.",
      "wa.float": "WhatsApp ile iletişime geçin",
      "wa.generalMessage": "Merhaba, Farmeko ürünleri hakkında bilgi almak istiyorum.",
      "wa.productMessage": "Merhaba, {name} hakkında bilgi ve fiyat teklifi almak istiyorum. İncelediğim Ürün: {url}"

    },
    en: {
      "topbar.tagline": "Agriculture, Livestock & Veterinary Solutions",
      "nav.home": "Home",
      "nav.products": "Products",
      "nav.corporate": "Corporate",
      "nav.blog": "Blog",
      "nav.b2b": "Become a Dealer",
      "nav.contact": "Contact",
      "nav.toggleMenu": "Toggle navigation",
      "theme.toggle": "Toggle light/dark theme",
      "lang.switch": "Language selection",
      "cat.nutrition": "Feed Supplements & Premixes",
      "cat.equipment": "Livestock Equipment",
      "cat.machinery": "Industrial Farming Machinery",
      "cat.veterinary": "Veterinary & Medical Products",
      "footer.about": "Farmeko supplies feed supplements, milking systems, farming machinery and veterinary consumables to farmers, livestock operations, veterinary clinics and dealers.",
      "footer.quickLinks": "Quick Links",
      "footer.categories": "Product Categories",
      "footer.contact": "Contact",
      "footer.rights": "All rights reserved.",
      "wa.float": "Contact us on WhatsApp",
      "wa.generalMessage": "Hello, I would like to get information about Farmeko products.",
      "wa.productMessage": "Hello, I would like to get information and a price quote for {name}. Product I reviewed: {url}"
    }
  };

  /* ---------------------------------------------------------
     3. STORAGE HELPERS (safe even if localStorage is blocked)
     --------------------------------------------------------- */
  const store = {
    get(key, fallback) {
      try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
  };

  /* ---------------------------------------------------------
     4. LANGUAGE ENGINE
     --------------------------------------------------------- */
  let currentLang = store.get("farmeko_lang", "tr");
  if (!I18N[currentLang]) currentLang = "tr";

  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || key;
  }

  /** Other files (data.js / main.js) can register extra translations */
  function addTranslations(lang, dict) {
    I18N[lang] = Object.assign(I18N[lang] || {}, dict);
  }

  function applyLanguage() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });

    // Highlight active language button(s)
    document.querySelectorAll("[data-action='set-lang']").forEach(function (btn) {
      const active = btn.getAttribute("data-lang") === currentLang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    // Update the floating WhatsApp link
    const wa = document.getElementById("fkWhatsappFloat");
    if (wa) {
      wa.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(t("wa.generalMessage"));
    }
  }

  function setLanguage(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    store.set("farmeko_lang", lang);
    applyLanguage();
    // Let dynamic content (product grids, blog lists...) re-render themselves
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: lang } }));
  }

  /* ---------------------------------------------------------
     5. THEME ENGINE (Bootstrap 5 data-bs-theme)
     --------------------------------------------------------- */
  function getTheme() {
    return store.get("farmeko_theme", "light");
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.querySelectorAll("[data-action='toggle-theme'] i").forEach(function (icon) {
      icon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    });

        // Swap the navbar logo SVG instantly
    const navLogo = document.getElementById("fkNavLogo");
    if (navLogo) {
      navLogo.src = theme === "dark" ? CONFIG.logos.dark : CONFIG.logos.light;
    }

    // Navbar background follows the theme
    const nav = document.querySelector(".fk-navbar");
    if (nav) {
      nav.classList.toggle("bg-white", theme !== "dark");
      nav.classList.toggle("bg-body-tertiary", theme === "dark");
    }
  }

  function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    store.set("farmeko_theme", next);
    applyTheme(next);
  }

  /* ---------------------------------------------------------
     6. COMPONENT TEMPLATES
     --------------------------------------------------------- */
  function getActivePage() {
    let page = window.location.pathname.split("/").pop() || "index.html";
    if (page === "") page = "index.html";
    // Detail pages highlight their parent menu item
    if (page === "product-detail.html") page = "products.html";
    if (page === "blog-detail.html") page = "blog.html";
    return page;
  }

  function navLink(href, i18nKey, activePage) {
    const active = href === activePage ? " active" : "";
    const current = href === activePage ? ' aria-current="page"' : "";
    return (
      '<li class="nav-item"><a class="nav-link' + active + '" href="' + href + '"' + current +
      ' data-i18n="' + i18nKey + '"></a></li>'
    );
  }

  function langSwitchHTML() {
    return (
      '<div class="btn-group fk-lang-switch" role="group" data-i18n-aria="lang.switch">' +
        '<button type="button" class="btn" data-action="set-lang" data-lang="tr">TR</button>' +
        '<button type="button" class="btn" data-action="set-lang" data-lang="en">EN</button>' +
      "</div>"
    );
  }

  function themeBtnHTML() {
    return (
      '<button type="button" class="fk-theme-btn" data-action="toggle-theme" ' +
      'data-i18n-aria="theme.toggle" data-i18n-title="theme.toggle"><i class="bi bi-moon-stars-fill"></i></button>'
    );
  }

  function navbarHTML() {
    const active = getActivePage();
    return (
      /* Top bar */
      '<div class="fk-topbar d-none d-md-block"><div class="container d-flex justify-content-between align-items-center py-1">' +
        '<span data-i18n="topbar.tagline"></span>' +
        '<div class="d-flex gap-3">' +
          '<a href="tel:' + CONFIG.phone.replace(/\s/g, "") + '"><i class="bi bi-telephone-fill me-1"></i>' + CONFIG.phone + "</a>" +
          '<a href="mailto:' + CONFIG.email + '"><i class="bi bi-envelope-fill me-1"></i>' + CONFIG.email + "</a>" +
        "</div>" +
      "</div></div>" +

      /* Main navbar */
      '<nav class="navbar navbar-expand-lg sticky-top fk-navbar bg-white">' +
        '<div class="container">' +
          '<a class="navbar-brand" href="index.html" aria-label="' + CONFIG.brand + '">' +
            '<img id="fkNavLogo" class="fk-logo-header" src="' +
              (getTheme() === "dark" ? CONFIG.logos.dark : CONFIG.logos.light) +
              '" alt="' + CONFIG.brand + ' logo">' +
          "</a>" +
          '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#fkNavMenu" ' +
            'aria-controls="fkNavMenu" aria-expanded="false" data-i18n-aria="nav.toggleMenu">' +
            '<span class="navbar-toggler-icon"></span>' +
          "</button>" +
          '<div class="collapse navbar-collapse" id="fkNavMenu">' +
            '<ul class="navbar-nav mx-lg-auto mb-2 mb-lg-0">' +
              navLink("index.html", "nav.home", active) +
              navLink("products.html", "nav.products", active) +
              navLink("corporate.html", "nav.corporate", active) +
              navLink("blog.html", "nav.blog", active) +
              navLink("b2b.html", "nav.b2b", active) +
              navLink("contact.html", "nav.contact", active) +
            "</ul>" +
            '<div class="d-flex align-items-center gap-2 py-2 py-lg-0">' +
              langSwitchHTML() +
              themeBtnHTML() +
            "</div>" +
          "</div>" +
        "</div>" +
      "</nav>"
    );
  }

  function footerHTML() {
    const year = new Date().getFullYear();
    return (
      '<footer class="fk-footer pt-5">' +
        '<div class="container"><div class="row g-4 pb-4">' +

          /* Column 1: About */
          '<div class="col-lg-4 col-md-6">' +
            '<img src="' + CONFIG.logos.dark + '" alt="' + CONFIG.brand + ' logo" class="fk-logo-footer mb-3">' +
            '<p class="small" data-i18n="footer.about"></p>' +
            '<div class="fk-social mt-3">' +
              '<a href="' + CONFIG.social.instagram + '" aria-label="Instagram" target="_blank" rel="noopener"><i class="bi bi-instagram"></i></a>' +
              '<a href="' + CONFIG.social.facebook + '" aria-label="Facebook" target="_blank" rel="noopener"><i class="bi bi-facebook"></i></a>' +
              '<a href="' + CONFIG.social.linkedin + '" aria-label="LinkedIn" target="_blank" rel="noopener"><i class="bi bi-linkedin"></i></a>' +
              '<a href="' + CONFIG.social.youtube + '" aria-label="YouTube" target="_blank" rel="noopener"><i class="bi bi-youtube"></i></a>' +
            "</div>" +
          "</div>" +

          /* Column 2: Quick links */
          '<div class="col-lg-2 col-md-6 col-6">' +
            '<h5 data-i18n="footer.quickLinks"></h5>' +
            '<ul class="list-unstyled fk-footer-list small">' +
              '<li><a href="index.html" data-i18n="nav.home"></a></li>' +
              '<li><a href="products.html" data-i18n="nav.products"></a></li>' +
              '<li><a href="corporate.html" data-i18n="nav.corporate"></a></li>' +
              '<li><a href="blog.html" data-i18n="nav.blog"></a></li>' +
              '<li><a href="b2b.html" data-i18n="nav.b2b"></a></li>' +
              '<li><a href="contact.html" data-i18n="nav.contact"></a></li>' +
            "</ul>" +
          "</div>" +

          /* Column 3: Categories */
          '<div class="col-lg-3 col-md-6 col-6">' +
            '<h5 data-i18n="footer.categories"></h5>' +
            '<ul class="list-unstyled fk-footer-list small">' +
              '<li><a href="products.html?category=nutrition" data-i18n="cat.nutrition"></a></li>' +
              '<li><a href="products.html?category=equipment" data-i18n="cat.equipment"></a></li>' +
              '<li><a href="products.html?category=machinery" data-i18n="cat.machinery"></a></li>' +
              '<li><a href="products.html?category=veterinary" data-i18n="cat.veterinary"></a></li>' +
            "</ul>" +
          "</div>" +

          /* Column 4: Contact */
          '<div class="col-lg-3 col-md-6">' +
            '<h5 data-i18n="footer.contact"></h5>' +
            '<ul class="list-unstyled fk-footer-contact small">' +
              '<li class="mb-2"><i class="bi bi-geo-alt-fill"></i>' + CONFIG.address + "</li>" +
              '<li class="mb-2"><i class="bi bi-telephone-fill"></i><a href="tel:' + CONFIG.phone.replace(/\s/g, "") + '">' + CONFIG.phone + "</a></li>" +
              '<li class="mb-2"><i class="bi bi-envelope-fill"></i><a href="mailto:' + CONFIG.email + '">' + CONFIG.email + "</a></li>" +
              '<li class="mb-2"><i class="bi bi-globe2"></i>farmeko.com.tr</li>' +
            "</ul>" +
            '<div class="d-flex align-items-center gap-2 mt-3">' + langSwitchHTML() + themeBtnHTML() + "</div>" +
          "</div>" +

        "</div></div>" +

        '<div class="fk-footer-bottom py-3"><div class="container text-center">' +
          "&copy; " + year + " " + CONFIG.brand + ' – <span data-i18n="footer.rights"></span>' +
        "</div></div>" +
      "</footer>" +

      /* Floating WhatsApp button */
      '<a id="fkWhatsappFloat" class="fk-whatsapp-float" href="#" target="_blank" rel="noopener" ' +
        'data-i18n-aria="wa.float" data-i18n-title="wa.float"><i class="bi bi-whatsapp"></i></a>'
    );
  }


    /** Product WhatsApp link in the CURRENT site language (name + url safely encoded) */
  function buildProductWhatsAppLink(productName, pageUrl) {
    const message = t("wa.productMessage")
      .replace("{name}", function () { return productName; })
      .replace("{url}", function () { return pageUrl; });
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(message);
  }

  /* ---------------------------------------------------------
     7. INIT
     --------------------------------------------------------- */
  function mountComponents() {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    if (header) header.innerHTML = navbarHTML();
    if (footer) footer.innerHTML = footerHTML();
  }

  function bindEvents() {
    // One delegated listener handles every language/theme button on the page
    document.addEventListener("click", function (e) {
      const langBtn = e.target.closest("[data-action='set-lang']");
      if (langBtn) { setLanguage(langBtn.getAttribute("data-lang")); return; }

      const themeBtn = e.target.closest("[data-action='toggle-theme']");
      if (themeBtn) { toggleTheme(); }
    });
  }

  function init() {
    mountComponents();
    bindEvents();
    applyTheme(getTheme());
    applyLanguage();
  }

  // Scripts sit at the end of <body>, so #site-header and #site-footer already exist:
  // mount the navbar/footer immediately (no empty-header flash).
  init();

  // Page scripts add their translations after this file runs,
  // so translate once more when everything is ready.
  document.addEventListener("DOMContentLoaded", applyLanguage);

  /* Public API for other scripts (data.js, main.js, ...) */
  window.Farmeko = {
    config: CONFIG,
    t: t,
    getLang: function () { return currentLang; },
    setLang: setLanguage,
    addTranslations: addTranslations,
    applyLanguage: applyLanguage,
    buildProductWhatsAppLink: buildProductWhatsAppLink,
  };
})();