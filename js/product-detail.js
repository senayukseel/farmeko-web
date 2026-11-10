/* ==========================================================
   FARMEKO - Product detail page logic
   - Reads ?id=... from the URL and finds the product in data.js
   - Renders image, info, description, specs table, related products
   - WhatsApp button uses window.location.href + product name
   - To use a real API later, replace the lookup in init() with
     FarmekoAPI.getProduct(id).then(...)
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. Translations ---------- */
  Farmeko.addTranslations("tr", {
    "detail.description": "Ürün Açıklaması",
    "detail.specs": "Teknik Özellikler",
    "detail.related": "Benzer Ürünler",
    "detail.quoteNote": "Fiyat bilgisi için bize WhatsApp'tan yazın, size hemen dönüş yapalım.",
    "detail.call": "Bizi Arayın",
    "detail.notFound.title": "Ürün bulunamadı",
    "detail.notFound.text": "Aradığınız ürün kaldırılmış veya adres hatalı olabilir.",
    "detail.back": "Tüm Ürünlere Dön",
    "product.details": "Detayları İncele",
    "product.quote": "WhatsApp ile Teklif Al"
  });

  Farmeko.addTranslations("en", {
    "detail.description": "Product Description",
    "detail.specs": "Specifications",
    "detail.related": "Related Products",
    "detail.quoteNote": "Message us on WhatsApp for pricing and we will get back to you quickly.",
    "detail.call": "Call Us",
    "detail.notFound.title": "Product not found",
    "detail.notFound.text": "The product may have been removed or the address is incorrect.",
    "detail.back": "Back to All Products",
    "product.details": "View Details",
    "product.quote": "Request Quote via WhatsApp"
  });

  /* ---------- 2. State & helpers ---------- */
  let DATA = { categories: [], products: [] };
  let product = null;

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** Text for the current language from {tr, en} (plain strings pass through) */
  function pick(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[Farmeko.getLang()] || obj.tr || "";
  }

  function findCategory(id) {
    return DATA.categories.find(function (c) { return c.id === id; });
  }
  function findSub(cat, subId) {
    return cat && cat.subcategories.find(function (s) { return s.id === subId; });
  }

  /** WhatsApp link: product name + CURRENT page URL, safely encoded */
  function buildWhatsAppLink(productName) {
    return Farmeko.buildProductWhatsAppLink(productName, window.location.href);
  }

  /* ---------- 3. Rendering ---------- */
  function renderBreadcrumb() {
    const el = document.getElementById("breadcrumb");
    if (!el) return;

    let html =
      '<li><a href="index.html" data-i18n="nav.home"></a></li>' +
      '<li><a href="products.html" data-i18n="nav.products"></a></li>';

    if (product) {
      const cat = findCategory(product.category);
      if (cat) {
        html += '<li><a href="products.html?category=' + encodeURIComponent(cat.id) + '">' + esc(pick(cat.name)) + "</a></li>";
      }
      html += "<li>" + esc(pick(product.name)) + "</li>";
    }
    el.innerHTML = html;
  }

  function renderNotFound() {
    document.getElementById("productDetail").innerHTML =
      '<div class="fk-empty">' +
        '<i class="bi bi-exclamation-circle"></i>' +
        '<h1 class="h4 fw-bold mt-3" data-i18n="detail.notFound.title"></h1>' +
        '<p class="text-body-secondary" data-i18n="detail.notFound.text"></p>' +
        '<a href="products.html" class="btn btn-farmeko mt-2" data-i18n="detail.back"></a>' +
      "</div>";
    document.getElementById("relatedSection").classList.add("d-none");
    document.title = Farmeko.t("detail.notFound.title") + " | FARMEKO";
  }

  function specsTableHTML() {
    if (!product.specs || !product.specs.length) return "";
    const rows = product.specs.map(function (s) {
      return "<tr><th scope='row'>" + esc(pick(s.l)) + "</th><td>" + esc(pick(s.v)) + "</td></tr>";
    }).join("");
    return (
      '<h2 class="fk-section-title h4" data-i18n="detail.specs"></h2>' +
      '<div class="table-responsive"><table class="table table-bordered fk-spec-table mb-0"><tbody>' + rows + "</tbody></table></div>"
    );
  }

  function renderProduct() {
    const name = pick(product.name);
    const cat = findCategory(product.category);
    const sub = cat && findSub(cat, product.subcategory);
    const label = (cat ? pick(cat.name) : "") + (sub ? " · " + pick(sub.name) : "");
    const phoneHref = "tel:" + Farmeko.config.phone.replace(/\s/g, "");

    document.getElementById("productDetail").innerHTML =
      '<div class="row g-5">' +

        /* Image column */
        '<div class="col-lg-6">' +
          '<div class="fk-detail-img">' +
            '<i class="bi bi-image"></i>' +
            (product.image ? '<img src="' + esc(product.image) + '" alt="' + esc(name) + '" onerror="this.remove()">' : "") +
          "</div>" +
        "</div>" +

        /* Info column */
        '<div class="col-lg-6">' +
          '<span class="fk-detail-cat">' + esc(label) + "</span>" +
          '<h1 class="fk-detail-title h2 mt-2">' + esc(name) + "</h1>" +
          '<p class="lead text-body-secondary mt-3">' + esc(pick(product.shortDesc)) + "</p>" +

          '<div class="d-grid gap-2 d-sm-flex mt-4">' +
            '<button type="button" id="waDetailBtn" class="btn btn-whatsapp btn-lg flex-grow-1">' +
              '<i class="bi bi-whatsapp me-2"></i><span data-i18n="product.quote"></span>' +
            "</button>" +
            '<a href="' + phoneHref + '" class="btn btn-outline-farmeko btn-lg">' +
              '<i class="bi bi-telephone-fill me-2"></i><span data-i18n="detail.call"></span>' +
            "</a>" +
          "</div>" +
          '<p class="fk-detail-note text-body-secondary mt-3 mb-0"><i class="bi bi-info-circle-fill me-1"></i><span data-i18n="detail.quoteNote"></span></p>' +
        "</div>" +

      "</div>" +

      /* Description + specs */
      '<div class="row g-5 mt-1">' +
        '<div class="col-lg-7">' +
          '<h2 class="fk-section-title h4" data-i18n="detail.description"></h2>' +
          /* description is trusted HTML from data.js (our own content) */
          '<div class="fk-detail-desc">' + pick(product.description) + "</div>" +
        "</div>" +
        '<div class="col-lg-5">' + specsTableHTML() + "</div>" +
      "</div>";

    document.title = name + " | FARMEKO";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", pick(product.shortDesc));
  }

  function relatedCardHTML(p) {
    const name = pick(p.name);
    const href = "product-detail.html?id=" + encodeURIComponent(p.id);
    const cat = findCategory(p.category);
    const sub = cat && findSub(cat, p.subcategory);
    return (
      '<div class="col-12 col-sm-6 col-lg-3">' +
        '<article class="fk-product-card d-flex flex-column">' +
          '<a href="' + href + '" class="fk-product-img" aria-label="' + esc(name) + '">' +
            '<i class="bi bi-image"></i>' +
            (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(name) + '" loading="lazy" onerror="this.remove()">' : "") +
          "</a>" +
          '<div class="card-body p-3 d-flex flex-column flex-grow-1">' +
            '<span class="fk-product-cat">' + esc(sub ? pick(sub.name) : "") + "</span>" +
            '<h3 class="card-title h6 fw-bold mt-1"><a href="' + href + '">' + esc(name) + "</a></h3>" +
            '<p class="small text-body-secondary flex-grow-1">' + esc(pick(p.shortDesc)) + "</p>" +
            '<a class="btn btn-outline-farmeko btn-sm" href="' + href + '" data-i18n="product.details"></a>' +
          "</div>" +
        "</article>" +
      "</div>"
    );
  }

  function renderRelated() {
    const section = document.getElementById("relatedSection");
    const grid = document.getElementById("relatedGrid");

    // Same category first, other categories fill in if there are fewer than 4
    const same = DATA.products.filter(function (p) { return p.id !== product.id && p.category === product.category; });
    const others = DATA.products.filter(function (p) { return p.id !== product.id && p.category !== product.category; });
    const related = same.concat(others).slice(0, 4);

    if (!related.length) { section.classList.add("d-none"); return; }
    grid.innerHTML = related.map(relatedCardHTML).join("");
    section.classList.remove("d-none");
  }

  function renderAll() {
    renderBreadcrumb();
    if (!product) { renderNotFound(); Farmeko.applyLanguage(); return; }
    renderProduct();
    renderRelated();
    Farmeko.applyLanguage();   // translate the freshly created elements
  }

  /* ---------- 4. Events ---------- */
  function bindEvents() {
    // WhatsApp button (created dynamically -> delegated listener)
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("#waDetailBtn");
      if (!btn || !product) return;
      window.open(buildWhatsAppLink(pick(product.name)), "_blank", "noopener");
    });

    // Re-render when the language changes
    document.addEventListener("languagechange", renderAll);
  }

  /* ---------- 5. Init ---------- */
  function init() {
    if (window.FARMEKO_DATA) DATA = window.FARMEKO_DATA;   // later: replace with FarmekoAPI.getProduct(id)
    const id = new URLSearchParams(window.location.search).get("id");
    product = DATA.products.find(function (p) { return p.id === id; }) || null;
    bindEvents();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();