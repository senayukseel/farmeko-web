/* ==========================================================
   FARMEKO - Products page logic
   - Category / subcategory filter (sidebar)
   - Search (accent-insensitive, TR + EN)
   - Dynamic product grid
   - URL sync: products.html?category=...&sub=...&q=...
   - Reads window.FARMEKO_DATA (data.js). To use a real API later,
     replace the data loading line in init() with FarmekoAPI / fetch().
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. Translations ---------- */
  Farmeko.addTranslations("tr", {
    "products.title": "Ürünlerimiz",
    "products.filters": "Filtreler",
    "products.categories": "Kategoriler",
    "products.all": "Tüm Ürünler",
    "products.allSub": "Tümü",
    "products.search.placeholder": "Ürün ara...",
    "products.search.label": "Ürün ara",
    "products.count": "{n} ürün bulundu",
    "products.clear": "Filtreleri Temizle",
    "products.empty.title": "Aradığınız kriterlere uygun ürün bulunamadı.",
    "products.empty.text": "Arama kelimesini değiştirmeyi veya filtreleri temizlemeyi deneyin.",
    "product.details": "Detayları İncele",
    "product.quote": "WhatsApp ile Teklif Al"
  });

  Farmeko.addTranslations("en", {
    "products.title": "Our Products",
    "products.filters": "Filters",
    "products.categories": "Categories",
    "products.all": "All Products",
    "products.allSub": "All",
    "products.search.placeholder": "Search products...",
    "products.search.label": "Search products",
    "products.count": "{n} products found",
    "products.clear": "Clear Filters",
    "products.empty.title": "No products match your criteria.",
    "products.empty.text": "Try changing the search term or clearing the filters.",
    "product.details": "View Details",
    "product.quote": "Request Quote via WhatsApp"
  });

  /* ---------- 2. State & helpers ---------- */
  const state = { category: "all", sub: "all", q: "" };
  let DATA = { categories: [], products: [] };

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** Text for the current language from {tr, en} */
  function pick(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[Farmeko.getLang()] || obj.tr || "";
  }

  /** Lowercase + remove accents (ı→i, ş→s, ğ→g ...) so "sigir" finds "Sığır" */
  function norm(str) {
    return String(str == null ? "" : str)
      .toLocaleLowerCase("tr")
      .replace(/ı/g, "i")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function findCategory(id) {
    return DATA.categories.find(function (c) { return c.id === id; });
  }
  function findSub(cat, subId) {
    return cat && cat.subcategories.find(function (s) { return s.id === subId; });
  }

  function buildWhatsAppLink(productName, pageUrl) {
    return Farmeko.buildProductWhatsAppLink(productName, pageUrl);
  }

  function detailUrl(id) {
    return new URL("product-detail.html?id=" + encodeURIComponent(id), window.location.href).href;
  }

  /* ---------- 3. URL <-> state ---------- */
  function readUrl() {
    const params = new URLSearchParams(window.location.search);
    const cat = findCategory(params.get("category"));
    if (cat) {
      state.category = cat.id;
      const sub = params.get("sub");
      if (sub && findSub(cat, sub)) state.sub = sub;
    }
    state.q = (params.get("q") || "").trim();
  }

  function writeUrl() {
    try {
      const params = new URLSearchParams();
      if (state.category !== "all") params.set("category", state.category);
      if (state.sub !== "all") params.set("sub", state.sub);
      if (state.q) params.set("q", state.q);
      const qs = params.toString();
      history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
    } catch (e) { /* some browsers block this on file:// - safe to ignore */ }
  }

  /* ---------- 4. Filtering ---------- */
  function matchesQuery(p, words) {
    if (!words.length) return true;
    const cat = findCategory(p.category);
    const sub = cat && findSub(cat, p.subcategory);
    const haystack = norm([
      p.name && p.name.tr, p.name && p.name.en,
      p.shortDesc && p.shortDesc.tr, p.shortDesc && p.shortDesc.en,
      cat && cat.name.tr, cat && cat.name.en,
      sub && sub.name.tr, sub && sub.name.en
    ].join(" "));
    return words.every(function (w) { return haystack.indexOf(w) !== -1; });
  }

  function getFiltered() {
    const words = norm(state.q).split(/\s+/).filter(Boolean);
    return DATA.products.filter(function (p) {
      if (state.category !== "all" && p.category !== state.category) return false;
      if (state.sub !== "all" && p.subcategory !== state.sub) return false;
      return matchesQuery(p, words);
    });
  }

  /* ---------- 5. Rendering ---------- */
  function countBadge(n) { return '<span class="fk-count">' + n + "</span>"; }

  function renderSidebar() {
    const list = document.getElementById("categoryList");
    if (!list) return;

    let html =
      '<li><button type="button" class="fk-filter-item' + (state.category === "all" ? " active" : "") +
      '" data-cat="all"><span><i class="bi bi-grid-fill me-2"></i><span data-i18n="products.all"></span></span>' +
      countBadge(DATA.products.length) + "</button></li>";

    DATA.categories.forEach(function (cat) {
      const total = DATA.products.filter(function (p) { return p.category === cat.id; }).length;
      const isOpen = state.category === cat.id;
      const catActive = isOpen && state.sub === "all";

      html +=
        "<li>" +
          '<button type="button" class="fk-filter-item' + (catActive ? " active" : "") + '" data-cat="' + esc(cat.id) + '">' +
            '<span><i class="bi ' + esc(cat.icon) + ' me-2"></i>' + esc(pick(cat.name)) + "</span>" + countBadge(total) +
          "</button>";

      if (isOpen) {
        html += '<ul class="fk-sub-list">';
        cat.subcategories.forEach(function (sub) {
          const n = DATA.products.filter(function (p) {
            return p.category === cat.id && p.subcategory === sub.id;
          }).length;
          html +=
            '<li><button type="button" class="fk-filter-item' + (state.sub === sub.id ? " active" : "") +
            '" data-cat="' + esc(cat.id) + '" data-sub="' + esc(sub.id) + '"><span>' + esc(pick(sub.name)) +
            "</span>" + countBadge(n) + "</button></li>";
        });
        html += "</ul>";
      }
      html += "</li>";
    });

    list.innerHTML = html;
  }

  function productCardHTML(p) {
    const name = pick(p.name);
    const cat = findCategory(p.category);
    const sub = cat && findSub(cat, p.subcategory);
    const label = (cat ? pick(cat.name) : "") + (sub ? " · " + pick(sub.name) : "");
    const href = "product-detail.html?id=" + encodeURIComponent(p.id);

    return (
      '<div class="col-12 col-sm-6 col-xl-4">' +
        '<article class="fk-product-card d-flex flex-column">' +
          '<a href="' + href + '" class="fk-product-img" aria-label="' + esc(name) + '">' +
            '<i class="bi bi-image"></i>' +
            (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(name) + '" loading="lazy" onerror="this.remove()">' : "") +
          "</a>" +
          '<div class="card-body p-3 d-flex flex-column flex-grow-1">' +
            '<span class="fk-product-cat">' + esc(label) + "</span>" +
            '<h3 class="card-title h6 fw-bold mt-1"><a href="' + href + '">' + esc(name) + "</a></h3>" +
            '<p class="small text-body-secondary flex-grow-1">' + esc(pick(p.shortDesc)) + "</p>" +
            '<div class="d-grid gap-2">' +
              '<button type="button" class="btn btn-whatsapp btn-sm" data-wa-product="' + esc(p.id) + '">' +
                '<i class="bi bi-whatsapp me-1"></i><span data-i18n="product.quote"></span>' +
              "</button>" +
              '<a class="btn btn-outline-farmeko btn-sm" href="' + href + '" data-i18n="product.details"></a>' +
            "</div>" +
          "</div>" +
        "</article>" +
      "</div>"
    );
  }

  function renderGrid() {
    const grid = document.getElementById("productGrid");
    const countEl = document.getElementById("resultCount");
    const clearBtn = document.getElementById("clearFilters");
    if (!grid) return;

    const items = getFiltered();

    if (countEl) countEl.textContent = Farmeko.t("products.count").replace("{n}", items.length);
    if (clearBtn) {
      const hasFilter = state.category !== "all" || state.sub !== "all" || state.q !== "";
      clearBtn.classList.toggle("d-none", !hasFilter);
    }

    if (!items.length) {
      grid.innerHTML =
        '<div class="col-12"><div class="fk-empty">' +
          '<i class="bi bi-search"></i>' +
          '<h3 class="h5 fw-bold mt-3" data-i18n="products.empty.title"></h3>' +
          '<p class="text-body-secondary mb-0" data-i18n="products.empty.text"></p>' +
        "</div></div>";
    } else {
      grid.innerHTML = items.map(productCardHTML).join("");
    }

    Farmeko.applyLanguage();   // translate the freshly created elements
  }

  function renderAll() {
    renderSidebar();
    renderGrid();
  }

  /* ---------- 6. Events ---------- */
  function closeMobileFilters() {
    const panel = document.getElementById("filterPanel");
    if (panel && panel.classList.contains("show") && window.innerWidth < 992) {
      bootstrap.Collapse.getOrCreateInstance(panel).hide();
    }
  }

  function bindEvents() {
    // Sidebar clicks (one delegated listener)
    document.getElementById("categoryList").addEventListener("click", function (e) {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      state.category = btn.getAttribute("data-cat");
      state.sub = btn.getAttribute("data-sub") || "all";
      writeUrl();
      renderAll();
      closeMobileFilters();
    });

    // Live search
    const input = document.getElementById("searchInput");
    input.addEventListener("input", function () {
      state.q = input.value.trim();
      writeUrl();
      renderGrid();
    });
    document.getElementById("searchForm").addEventListener("submit", function (e) {
      e.preventDefault();   // Enter key should not reload the page
    });

    // Clear filters
    document.getElementById("clearFilters").addEventListener("click", function () {
      state.category = "all";
      state.sub = "all";
      state.q = "";
      input.value = "";
      writeUrl();
      renderAll();
    });

    // WhatsApp quote button on cards
    document.getElementById("productGrid").addEventListener("click", function (e) {
      const btn = e.target.closest("[data-wa-product]");
      if (!btn) return;
      const product = DATA.products.find(function (p) {
        return String(p.id) === btn.getAttribute("data-wa-product");
      });
      if (!product) return;
      /* On the list page we send the product's own detail-page URL.
         On the detail page itself we will use window.location.href. */
      window.open(buildWhatsAppLink(pick(product.name), detailUrl(product.id)), "_blank", "noopener");
    });

    // Re-render when the language changes
    document.addEventListener("languagechange", renderAll);
  }

  /* ---------- 7. Init ---------- */
  function init() {
    if (window.FARMEKO_DATA) DATA = window.FARMEKO_DATA;   // later: replace with FarmekoAPI / fetch()
    readUrl();
    document.getElementById("searchInput").value = state.q;
    bindEvents();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();