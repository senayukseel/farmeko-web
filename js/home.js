/* ==========================================================
   FARMEKO - Home page logic
   1) Page translations (TR/EN)
   2) Featured products renderer (reads window.FARMEKO_DATA from data.js)
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. Translations ---------- */
  Farmeko.addTranslations("tr", {
    "home.hero1.badge": "Yem Katkıları ve Premiksler",
    "home.hero1.title": "Sürünüzün Verimi İçin Güçlü Beslenme Çözümleri",
    "home.hero1.text": "Destekleyici premiksler ve yem katkılarıyla hayvan sağlığını ve üretim performansını artırın.",
    "home.hero2.badge": "Hayvancılık Ekipmanları",
    "home.hero2.title": "Modern Sağım Sistemleri ve Çiftlik Ekipmanları",
    "home.hero2.text": "Büyük ölçekli işletmeler için dayanıklı, verimli ve endüstriyel kalitede ekipmanlar.",
    "home.hero3.badge": "B2B ve Bayilik",
    "home.hero3.title": "Farmeko Bayi Ağına Katılın",
    "home.hero3.text": "Ulusal ve uluslararası pazarda güçlü bir iş ortaklığı için hemen başvurun.",
    "home.hero3.cta": "Bayi Ol",
    "home.hero3.cta2": "Kurumsal",
    "home.hero.cta.products": "Ürünleri İncele",
    "home.hero.cta.contact": "Bize Ulaşın",

    "home.categories.title": "Ürün Kategorileri",
    "home.categories.subtitle": "İhtiyacınıza uygun ürün grubunu seçin.",
    "home.cat.nutrition.desc": "Hayvan beslenmesini destekleyen premiksler ve katkı maddeleri.",
    "home.cat.equipment.desc": "Sağım sistemleri, sürü yönetimi cihazları ve ahır ekipmanları.",
    "home.cat.machinery.desc": "Endüstriyel çiftlik ve tarım makineleri.",
    "home.cat.veterinary.desc": "Veteriner klinikleri için tıbbi sarf malzemeleri.",
    "home.viewAll": "Ürünleri Gör",

    "home.featured.title": "Öne Çıkan Ürünler",
    "home.featured.all": "Tüm Ürünler",
    "home.featured.empty": "Ürün verileri henüz yüklenmedi (data.js sonraki adımda eklenecek).",
    "product.details": "Detayları İncele",
    "product.quote": "WhatsApp ile Teklif Al",

    "home.trust.title": "Neden Farmeko?",
    "home.trust1.title": "Kalite Güvencesi",
    "home.trust1.text": "Standartlara uygun, kontrollü ve belgeli ürünler.",
    "home.trust2.title": "Ulusal ve Uluslararası",
    "home.trust2.text": "Türkiye genelinde ve yurt dışına hızlı sevkiyat.",
    "home.trust3.title": "Uzman Destek",
    "home.trust3.text": "Ürün seçiminde teknik ve veteriner danışmanlık.",
    "home.trust4.title": "Güçlü Bayi Ağı",
    "home.trust4.text": "B2B iş ortakları için özel koşullar.",

    "home.cta.title": "Bayimiz Olmak İster misiniz?",
    "home.cta.text": "B2B başvuru formunu doldurun, ekibimiz sizinle iletişime geçsin.",
    "home.cta.button": "Bayi Başvurusu Yap"
  });

  Farmeko.addTranslations("en", {
    "home.hero1.badge": "Feed Supplements & Premixes",
    "home.hero1.title": "Powerful Nutrition Solutions for Your Herd's Performance",
    "home.hero1.text": "Improve animal health and production performance with supportive premixes and feed additives.",
    "home.hero2.badge": "Livestock Equipment",
    "home.hero2.title": "Modern Milking Systems & Farm Equipment",
    "home.hero2.text": "Durable, efficient, industrial-grade equipment for large-scale operations.",
    "home.hero3.badge": "B2B & Dealership",
    "home.hero3.title": "Join the Farmeko Dealer Network",
    "home.hero3.text": "Apply now for a strong partnership in the national and international market.",
    "home.hero3.cta": "Become a Dealer",
    "home.hero3.cta2": "Corporate",
    "home.hero.cta.products": "Browse Products",
    "home.hero.cta.contact": "Contact Us",

    "home.categories.title": "Product Categories",
    "home.categories.subtitle": "Choose the product group that fits your needs.",
    "home.cat.nutrition.desc": "Premixes and additives that support animal nutrition.",
    "home.cat.equipment.desc": "Milking systems, herd management devices and barn equipment.",
    "home.cat.machinery.desc": "Industrial farm and agricultural machinery.",
    "home.cat.veterinary.desc": "Medical consumables for veterinary clinics.",
    "home.viewAll": "View Products",

    "home.featured.title": "Featured Products",
    "home.featured.all": "All Products",
    "home.featured.empty": "Product data is not loaded yet (data.js will be added in the next step).",
    "product.details": "View Details",
    "product.quote": "Request Quote via WhatsApp",

    "home.trust.title": "Why Farmeko?",
    "home.trust1.title": "Quality Assurance",
    "home.trust1.text": "Controlled, documented products that meet standards.",
    "home.trust2.title": "National & International",
    "home.trust2.text": "Fast shipping across Türkiye and abroad.",
    "home.trust3.title": "Expert Support",
    "home.trust3.text": "Technical and veterinary advice for product selection.",
    "home.trust4.title": "Strong Dealer Network",
    "home.trust4.text": "Special terms for B2B partners.",

    "home.cta.title": "Would You Like to Become Our Dealer?",
    "home.cta.text": "Fill in the B2B application form and our team will contact you.",
    "home.cta.button": "Apply as a Dealer"
  });

  /* ---------- 2. Helpers ---------- */
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** Pick the text for the current language from {tr:"..", en:".."} */
  function pick(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[Farmeko.getLang()] || obj.tr || "";
  }

  /** Build the WhatsApp link (Product name + page URL, safely encoded) */
  function buildWhatsAppLink(productName, pageUrl) {
    return Farmeko.buildProductWhatsAppLink(productName, pageUrl);
  }

  /** Absolute URL of a product's detail page (works in any folder / domain) */
  function detailUrl(id) {
    return new URL("product-detail.html?id=" + encodeURIComponent(id), window.location.href).href;
  }

  /* ---------- 3. Featured products ---------- */
  function renderFeatured() {
    const box = document.getElementById("featuredProducts");
    if (!box) return;

    const data = window.FARMEKO_DATA;
    if (!data || !Array.isArray(data.products)) {
      box.innerHTML =
        '<div class="col-12"><div class="alert alert-secondary mb-0" data-i18n="home.featured.empty"></div></div>';
      Farmeko.applyLanguage();
      return;
    }

    const featured = data.products.filter(function (p) { return p.featured; }).slice(0, 4);

    box.innerHTML = featured.map(function (p) {
      const name = pick(p.name);
      const catKey = "cat." + p.category;
      return (
        '<div class="col-12 col-sm-6 col-lg-3">' +
          '<article class="fk-product-card d-flex flex-column">' +
            '<a href="product-detail.html?id=' + encodeURIComponent(p.id) + '" class="fk-product-img">' +
              '<i class="bi bi-image"></i>' +
              (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(name) + '" loading="lazy" onerror="this.remove()">' : "") +
            "</a>" +
            '<div class="card-body p-3 d-flex flex-column flex-grow-1">' +
              '<span class="fk-product-cat" data-i18n="' + esc(catKey) + '"></span>' +
              '<h3 class="card-title h6 fw-bold mt-1"><a href="product-detail.html?id=' + encodeURIComponent(p.id) + '">' + esc(name) + "</a></h3>" +
              '<p class="small text-body-secondary flex-grow-1">' + esc(pick(p.shortDesc)) + "</p>" +
              '<div class="d-grid gap-2">' +
                '<button type="button" class="btn btn-whatsapp btn-sm" data-wa-product="' + esc(p.id) + '">' +
                  '<i class="bi bi-whatsapp me-1"></i><span data-i18n="product.quote"></span>' +
                "</button>" +
                '<a class="btn btn-outline-farmeko btn-sm" href="product-detail.html?id=' + encodeURIComponent(p.id) + '" data-i18n="product.details"></a>' +
              "</div>" +
            "</div>" +
          "</article>" +
        "</div>"
      );
    }).join("");

    Farmeko.applyLanguage();   // translate the freshly created elements
  }

  /* ---------- 4. WhatsApp button click (delegated) ---------- */
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-wa-product]");
    if (!btn) return;

    const product = (window.FARMEKO_DATA && window.FARMEKO_DATA.products || []).find(function (p) {
      return String(p.id) === btn.getAttribute("data-wa-product");
    });
    if (!product) return;

    /* On cards we send the product's own detail-page URL (more useful than the home URL).
       On the detail page itself, we will use window.location.href. */
    const link = buildWhatsAppLink(pick(product.name), detailUrl(product.id));
    window.open(link, "_blank", "noopener");
  });

  /* ---------- 5. Init ---------- */
  document.addEventListener("DOMContentLoaded", renderFeatured);
  document.addEventListener("languagechange", renderFeatured);
})();