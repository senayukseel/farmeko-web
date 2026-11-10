/* ==========================================================
   FARMEKO - Blog list page logic
   - Reads window.FARMEKO_DATA.blog (data.js)
   - Category chips are built automatically from the posts
   - Accent-insensitive search (TR + EN)
   - To use a real API later, replace the data line in init()
     with FarmekoAPI.getBlogPosts().then(...)
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. Translations ---------- */
  Farmeko.addTranslations("tr", {
    "blog.title": "Blog",
    "blog.intro": "Tarım, hayvancılık teknolojileri ve hayvan sağlığı hakkında bilgilendirici yazılar.",
    "blog.search.placeholder": "Yazılarda ara...",
    "blog.search.label": "Blog yazılarında ara",
    "blog.all": "Tümü",
    "blog.count": "{n} yazı bulundu",
    "blog.readMore": "Devamını Oku",
    "blog.empty.title": "Aradığınız kriterlere uygun yazı bulunamadı.",
    "blog.empty.text": "Arama kelimesini değiştirmeyi veya başka bir kategori seçmeyi deneyin."
  });

  Farmeko.addTranslations("en", {
    "blog.title": "Blog",
    "blog.intro": "Informative articles about farming, livestock technology and animal health.",
    "blog.search.placeholder": "Search articles...",
    "blog.search.label": "Search blog articles",
    "blog.all": "All",
    "blog.count": "{n} articles found",
    "blog.readMore": "Read More",
    "blog.empty.title": "No articles match your criteria.",
    "blog.empty.text": "Try changing the search term or choosing another category."
  });

  /* ---------- 2. State & helpers ---------- */
  const state = { cat: "all", q: "" };   // cat = the category's Turkish name (used as a stable id)
  let POSTS = [];

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

  /** Lowercase + remove accents so "sigir" finds "Sığır" */
  function norm(str) {
    return String(str == null ? "" : str)
      .toLocaleLowerCase("tr")
      .replace(/ı/g, "i")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return "";
    return d.toLocaleDateString(Farmeko.getLang() === "tr" ? "tr-TR" : "en-GB",
      { day: "numeric", month: "long", year: "numeric" });
  }

  /** Newest first, without changing the original array */
  function sortedPosts() {
    return POSTS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }

  function getCategories() {
    const seen = {};
    const list = [];
    POSTS.forEach(function (p) {
      const id = p.category && p.category.tr;
      if (id && !seen[id]) { seen[id] = true; list.push(p.category); }
    });
    return list;
  }

  function getFiltered() {
    const words = norm(state.q).split(/\s+/).filter(Boolean);
    return sortedPosts().filter(function (p) {
      if (state.cat !== "all" && (!p.category || p.category.tr !== state.cat)) return false;
      if (!words.length) return true;
      const haystack = norm([
        p.title && p.title.tr, p.title && p.title.en,
        p.excerpt && p.excerpt.tr, p.excerpt && p.excerpt.en,
        p.category && p.category.tr, p.category && p.category.en
      ].join(" "));
      return words.every(function (w) { return haystack.indexOf(w) !== -1; });
    });
  }

  /* ---------- 3. Rendering ---------- */
  function renderChips() {
    const box = document.getElementById("blogChips");
    if (!box) return;
    let html =
      '<button type="button" class="fk-chip' + (state.cat === "all" ? " active" : "") +
      '" data-cat="all" data-i18n="blog.all"></button>';
    getCategories().forEach(function (c) {
      html +=
        '<button type="button" class="fk-chip' + (state.cat === c.tr ? " active" : "") +
        '" data-cat="' + esc(c.tr) + '">' + esc(pick(c)) + "</button>";
    });
    box.innerHTML = html;
  }

  function cardHTML(p) {
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
            '<div class="fk-blog-meta mb-2">' +
              '<span class="fk-blog-cat">' + esc(pick(p.category)) + "</span>" +
              ' <span class="mx-1">·</span> <i class="bi bi-calendar3 me-1"></i>' + esc(formatDate(p.date)) +
            "</div>" +
            '<h2 class="card-title h5 fw-bold"><a href="' + href + '">' + esc(title) + "</a></h2>" +
            '<p class="small text-body-secondary flex-grow-1">' + esc(pick(p.excerpt)) + "</p>" +
            '<a class="btn btn-outline-farmeko btn-sm align-self-start" href="' + href + '">' +
              '<span data-i18n="blog.readMore"></span> <i class="bi bi-arrow-right"></i></a>' +
          "</div>" +
        "</article>" +
      "</div>"
    );
  }

  function renderGrid() {
    const grid = document.getElementById("blogGrid");
    const countEl = document.getElementById("blogCount");
    if (!grid) return;

    const items = getFiltered();
    if (countEl) countEl.textContent = Farmeko.t("blog.count").replace("{n}", items.length);

    if (!items.length) {
      grid.innerHTML =
        '<div class="col-12"><div class="fk-empty">' +
          '<i class="bi bi-search"></i>' +
          '<h3 class="h5 fw-bold mt-3" data-i18n="blog.empty.title"></h3>' +
          '<p class="text-body-secondary mb-0" data-i18n="blog.empty.text"></p>' +
        "</div></div>";
    } else {
      grid.innerHTML = items.map(cardHTML).join("");
    }
  }

  function renderAll() {
    renderChips();
    renderGrid();
    Farmeko.applyLanguage();   // translate the freshly created elements
  }

  /* ---------- 4. Events ---------- */
  function bindEvents() {
    document.getElementById("blogChips").addEventListener("click", function (e) {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      state.cat = btn.getAttribute("data-cat");
      renderAll();
    });

    const input = document.getElementById("blogSearchInput");
    input.addEventListener("input", function () {
      state.q = input.value.trim();
      renderGrid();
      Farmeko.applyLanguage();
    });
    document.getElementById("blogSearchForm").addEventListener("submit", function (e) {
      e.preventDefault();
    });

    document.addEventListener("languagechange", renderAll);
  }

  /* ---------- 5. Init ---------- */
  function init() {
    if (window.FARMEKO_DATA && Array.isArray(window.FARMEKO_DATA.blog)) {
      POSTS = window.FARMEKO_DATA.blog;   // later: FarmekoAPI.getBlogPosts().then(...)
    }
    bindEvents();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();