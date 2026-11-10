/* ==========================================================
   FARMEKO - Blog detail page logic
   - Reads ?id=... from the URL and finds the post in data.js
   - Renders cover, meta, content (trusted HTML from data.js),
     share buttons, previous/next links and other articles
   - To use a real API later, replace the lookup in init() with
     FarmekoAPI.getBlogPost(id).then(...)
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. Translations ---------- */
  Farmeko.addTranslations("tr", {
    "bd.share": "Paylaş",
    "bd.copy": "Bağlantıyı kopyala",
    "bd.copied": "Bağlantı kopyalandı",
    "bd.prev": "Önceki yazı",
    "bd.next": "Sonraki yazı",
    "bd.more": "Diğer Yazılar",
    "bd.readMore": "Devamını Oku",
    "bd.back": "Tüm Yazılara Dön",
    "bd.notFound.title": "Yazı bulunamadı",
    "bd.notFound.text": "Aradığınız yazı kaldırılmış veya adres hatalı olabilir.",
    "bd.cta.title": "Ürünlerimizi İnceleyin",
    "bd.cta.text": "Yem katkılarından sağım sistemlerine, tüm ürünlerimiz için WhatsApp'tan teklif alın.",
    "bd.cta.button": "Ürünlere Git"
  });

  Farmeko.addTranslations("en", {
    "bd.share": "Share",
    "bd.copy": "Copy link",
    "bd.copied": "Link copied",
    "bd.prev": "Previous article",
    "bd.next": "Next article",
    "bd.more": "More Articles",
    "bd.readMore": "Read More",
    "bd.back": "Back to All Articles",
    "bd.notFound.title": "Article not found",
    "bd.notFound.text": "The article may have been removed or the address is incorrect.",
    "bd.cta.title": "Explore Our Products",
    "bd.cta.text": "From feed supplements to milking systems, request a quote on WhatsApp for any product.",
    "bd.cta.button": "Go to Products"
  });

  /* ---------- 2. State & helpers ---------- */
  let POSTS = [];
  let post = null;

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pick(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[Farmeko.getLang()] || obj.tr || "";
  }
  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return "";
    return d.toLocaleDateString(Farmeko.getLang() === "tr" ? "tr-TR" : "en-GB",
      { day: "numeric", month: "long", year: "numeric" });
  }
  /** Newest first */
  function sortedPosts() {
    return POSTS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }

  /* ---------- 3. Rendering ---------- */
  function renderBreadcrumb() {
    const el = document.getElementById("breadcrumb");
    if (!el) return;
    let html =
      '<li><a href="index.html" data-i18n="nav.home"></a></li>' +
      '<li><a href="blog.html" data-i18n="nav.blog"></a></li>';
    if (post) html += "<li>" + esc(pick(post.title)) + "</li>";
    el.innerHTML = html;
  }

  function renderNotFound() {
    document.getElementById("articleBox").innerHTML =
      '<div class="fk-empty">' +
        '<i class="bi bi-exclamation-circle"></i>' +
        '<h1 class="h4 fw-bold mt-3" data-i18n="bd.notFound.title"></h1>' +
        '<p class="text-body-secondary" data-i18n="bd.notFound.text"></p>' +
        '<a href="blog.html" class="btn btn-farmeko mt-2" data-i18n="bd.back"></a>' +
      "</div>";
    document.getElementById("moreSection").classList.add("d-none");
    document.getElementById("ctaSection").classList.add("d-none");
    document.title = Farmeko.t("bd.notFound.title") + " | FARMEKO";
  }

  function shareHTML(title) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      Farmeko.getLang() === "tr"
        ? 'Sektörle ilgili bu yazının ilgini çekeceğini düşündüm: "' + title + '"\nOkumak için:'
        : 'I thought you might find this industry article interesting: "' + title + '"\nRead here:'
    );
    return (
      '<div class="fk-share d-flex flex-wrap align-items-center gap-2 mt-5 pt-4 border-top">' +
        '<strong class="me-2" data-i18n="bd.share"></strong>' +
        '<a class="btn btn-outline-success" target="_blank" rel="noopener" aria-label="WhatsApp" href="https://wa.me/?text=' + text + "%20" + url + '"><i class="bi bi-whatsapp"></i></a>' +
        '<a class="btn btn-outline-secondary" target="_blank" rel="noopener" aria-label="X" href="https://twitter.com/intent/tweet?text=' + text + "&url=" + url + '"><i class="bi bi-twitter-x"></i></a>' +
        '<a class="btn btn-outline-primary" target="_blank" rel="noopener" aria-label="LinkedIn" href="https://www.linkedin.com/sharing/share-offsite/?url=' + url + '"><i class="bi bi-linkedin"></i></a>' +
        '<button type="button" id="copyLinkBtn" class="btn btn-outline-farmeko" data-i18n-aria="bd.copy" data-i18n-title="bd.copy"><i class="bi bi-link-45deg"></i></button>' +
        '<span id="copyMsg" class="small text-body-secondary ms-1" aria-live="polite"></span>' +
      "</div>"
    );
  }

  function prevNextHTML() {
    const list = sortedPosts();
    const i = list.findIndex(function (p) { return p.id === post.id; });
    const newer = i > 0 ? list[i - 1] : null;               // newer article
    const older = i < list.length - 1 ? list[i + 1] : null; // older article

    function box(p, labelKey, alignEnd) {
      if (!p) return '<div class="col-md-6"></div>';
      return (
        '<div class="col-md-6"><a class="fk-nav-post' + (alignEnd ? " text-md-end" : "") + '" href="blog-detail.html?id=' + encodeURIComponent(p.id) + '">' +
          '<small data-i18n="' + labelKey + '"></small>' +
          '<div class="fw-bold mt-1">' + esc(pick(p.title)) + "</div>" +
        "</a></div>"
      );
    }
    if (!newer && !older) return "";
    return '<div class="row g-3 mt-4">' + box(older, "bd.prev", false) + box(newer, "bd.next", true) + "</div>";
  }

  function renderArticle() {
    const title = pick(post.title);
    document.getElementById("articleBox").innerHTML =
      '<article class="fk-article">' +
        '<div class="fk-article-meta mb-2">' +
          '<span class="fk-article-cat">' + esc(pick(post.category)) + "</span>" +
          ' <span class="mx-1">·</span> <i class="bi bi-calendar3 me-1"></i>' + esc(formatDate(post.date)) +
        "</div>" +
        '<h1 class="fk-article-title display-6 mb-4">' + esc(title) + "</h1>" +
        '<div class="fk-article-cover mb-4">' +
          '<i class="bi bi-journal-text"></i>' +
          (post.image ? '<img src="' + esc(post.image) + '" alt="' + esc(title) + '" onerror="this.remove()">' : "") +
        "</div>" +
        /* content is trusted HTML from data.js (our own content) */
        '<div class="fk-article-body">' + pick(post.content) + "</div>" +
        shareHTML(title) +
        prevNextHTML() +
      "</article>";

    document.title = title + " | FARMEKO";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", pick(post.excerpt));
    document.getElementById("ctaSection").classList.remove("d-none");
  }

  function moreCardHTML(p) {
    const title = pick(p.title);
    const href = "blog-detail.html?id=" + encodeURIComponent(p.id);
    return (
      '<div class="col-12 col-md-6 col-lg-4">' +
        '<article class="fk-blog-card d-flex flex-column">' +
          '<a href="' + href + '" class="fk-blog-img" aria-label="' + esc(title) + '">' +
            '<i class="bi bi-journal-text"></i>' +
            (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(title) + '" loading="lazy" onerror="this.remove()">' : "") +
          "</a>" +
          '<div class="p-3 d-flex flex-column flex-grow-1">' +
            '<div class="fk-blog-meta mb-2"><span class="fk-blog-cat">' + esc(pick(p.category)) + "</span>" +
              ' <span class="mx-1">·</span> <i class="bi bi-calendar3 me-1"></i>' + esc(formatDate(p.date)) + "</div>" +
            '<h3 class="card-title h6 fw-bold"><a href="' + href + '">' + esc(title) + "</a></h3>" +
            '<a class="btn btn-outline-farmeko btn-sm align-self-start mt-auto" href="' + href + '">' +
              '<span data-i18n="bd.readMore"></span> <i class="bi bi-arrow-right"></i></a>' +
          "</div>" +
        "</article>" +
      "</div>"
    );
  }

  function renderMore() {
    const section = document.getElementById("moreSection");
    const grid = document.getElementById("moreGrid");
    // Same category first, then the others; the current article is excluded
    const same = sortedPosts().filter(function (p) { return p.id !== post.id && p.category && post.category && p.category.tr === post.category.tr; });
    const others = sortedPosts().filter(function (p) { return p.id !== post.id && !(p.category && post.category && p.category.tr === post.category.tr); });
    const list = same.concat(others).slice(0, 3);
    if (!list.length) { section.classList.add("d-none"); return; }
    grid.innerHTML = list.map(moreCardHTML).join("");
    section.classList.remove("d-none");
  }

  function renderAll() {
    renderBreadcrumb();
    if (!post) { renderNotFound(); Farmeko.applyLanguage(); return; }
    renderArticle();
    renderMore();
    Farmeko.applyLanguage();   // translate the freshly created elements
  }

  /* ---------- 4. Events ---------- */
  function bindEvents() {
    // Copy link (button is created dynamically -> delegated listener)
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("#copyLinkBtn");
      if (!btn) return;
      const msg = document.getElementById("copyMsg");
      function done() {
        if (msg) { msg.textContent = Farmeko.t("bd.copied"); setTimeout(function () { msg.textContent = ""; }, 2500); }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(done, function () { window.prompt(Farmeko.t("bd.copy"), window.location.href); });
      } else {
        window.prompt(Farmeko.t("bd.copy"), window.location.href);
      }
    });

    document.addEventListener("languagechange", renderAll);
  }

  /* ---------- 5. Init ---------- */
  function init() {
    if (window.FARMEKO_DATA && Array.isArray(window.FARMEKO_DATA.blog)) {
      POSTS = window.FARMEKO_DATA.blog;   // later: FarmekoAPI.getBlogPost(id).then(...)
    }
    const id = new URLSearchParams(window.location.search).get("id");
    post = POSTS.find(function (p) { return p.id === id; }) || null;
    bindEvents();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();