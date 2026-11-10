/* ==========================================================
   FARMEKO - Corporate page logic
   - Page translations (TR/EN)
   - Certificates + documents lists (PLACEHOLDERS - edit below)
   - Document viewer modal (PDF in iframe, images in <img>)
   Files go in the /documents folder, e.g. documents/kalite-belgesi.pdf
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. EDIT HERE: your real certificates and documents ----------
     type: "pdf" or "image" (jpg/png/webp)
     file: path to the file (put the files in a "documents" folder) */
  const CERTIFICATES = [
    {
      id: "cert-1", icon: "bi-patch-check-fill", type: "pdf", file: "documents/sertifika-1.pdf",
      title: { tr: "Kalite Belgesi 1 (örnek)", en: "Quality Certificate 1 (sample)" },
      issuer: { tr: "Veren kurum adı", en: "Issuing body name" }
    },
    {
      id: "cert-2", icon: "bi-award-fill", type: "pdf", file: "documents/sertifika-2.pdf",
      title: { tr: "Kalite Belgesi 2 (örnek)", en: "Quality Certificate 2 (sample)" },
      issuer: { tr: "Veren kurum adı", en: "Issuing body name" }
    },
    {
      id: "cert-3", icon: "bi-shield-check", type: "pdf", file: "documents/sertifika-3.pdf",
      title: { tr: "Uygunluk Belgesi (örnek)", en: "Conformity Certificate (sample)" },
      issuer: { tr: "Veren kurum adı", en: "Issuing body name" }
    },
    {
      id: "cert-4", icon: "bi-file-earmark-check-fill", type: "image", file: "documents/sertifika-4.jpg",
      title: { tr: "Faaliyet Belgesi (örnek)", en: "Activity Certificate (sample)" },
      issuer: { tr: "Veren kurum adı", en: "Issuing body name" }
    }
  ];

  const DOCUMENTS = [
    {
      id: "doc-1", type: "pdf", file: "documents/firma-profili.pdf",
      title: { tr: "Firma Profili", en: "Company Profile" },
      note: { tr: "PDF", en: "PDF" }
    },
    {
      id: "doc-2", type: "pdf", file: "documents/urun-katalogu.pdf",
      title: { tr: "Ürün Kataloğu", en: "Product Catalogue" },
      note: { tr: "PDF", en: "PDF" }
    }
  ];

  /* ---------- 2. Translations ---------- */
  Farmeko.addTranslations("tr", {
    "corp.title": "Kurumsal",
    "corp.about.title": "Hakkımızda",
    "corp.about.lead": "Farmeko; tarım, hayvancılık ve veteriner alanında çiftçilere, işletmelere ve bayilere hizmet eden bir tedarik ortağıdır.",
    "corp.about.text": "Yem katkıları, hayvancılık ekipmanları, endüstriyel tarım makineleri ve veteriner sarf malzemelerini tek çatı altında sunuyoruz. Amacımız, üreticilerin verimini ve hayvan sağlığını destekleyen doğru ürünü doğru zamanda ulaştırmaktır. (Bu metni kendi şirket hikayenizle değiştirin.)",
    "corp.point1.title": "Geniş ürün yelpazesi",
    "corp.point1.text": "Beslenmeden ekipmana, makineden veteriner ürünlerine tek adres.",
    "corp.point2.title": "Ulusal ve uluslararası hizmet",
    "corp.point2.text": "Türkiye genelinde ve yurt dışında müşterilere ulaşıyoruz.",
    "corp.point3.title": "Teknik destek",
    "corp.point3.text": "Ürün seçiminde uzman ekibimizden danışmanlık alabilirsiniz.",
    "corp.mission.title": "Misyonumuz",
    "corp.mission.text": "Üreticilere güvenilir, kaliteli ve ulaşılabilir çözümler sunarak sürdürülebilir hayvancılık ve tarıma katkı sağlamak.",
    "corp.vision.title": "Vizyonumuz",
    "corp.vision.text": "Tarım ve hayvancılık sektöründe ulusal ve uluslararası ölçekte tercih edilen, güvenilir bir marka olmak.",
    "corp.values.title": "Değerlerimiz",
    "corp.values.text": "Güven, kalite, şeffaflık, müşteri odaklılık ve sürekli gelişim.",
    "corp.cert.title": "Kalite Sertifikalarımız",
    "corp.cert.subtitle": "Belgelerimizi inceleyebilir ve indirebilirsiniz.",
    "corp.docs.title": "Belgeler ve Dökümanlar",
    "corp.view": "Görüntüle",
    "corp.download": "İndir",
    "corp.close": "Kapat",
    "corp.viewer.hint": "Belge açılmıyorsa İndir düğmesini kullanın.",
    "corp.viewer.error": "Belge bulunamadı.",
    "corp.viewer.error": "Belge bulunamadı.",
    "corp.cta.title": "Bayimiz Olmak İster misiniz?",
    "corp.cta.text": "B2B başvuru formunu doldurun, ekibimiz sizinle iletişime geçsin.",
    "corp.cta.button": "Bayi Başvurusu Yap"
  });

  Farmeko.addTranslations("en", {
    "corp.title": "Corporate",
    "corp.about.title": "About Us",
    "corp.about.lead": "Farmeko is a supply partner serving farmers, livestock operations and dealers in agriculture, livestock and veterinary fields.",
    "corp.about.text": "We offer feed supplements, livestock equipment, industrial farming machinery and veterinary consumables under one roof. Our goal is to deliver the right product at the right time to support producers' productivity and animal health. (Replace this text with your own company story.)",
    "corp.point1.title": "Wide product range",
    "corp.point1.text": "From nutrition to equipment, machinery to veterinary products, one address.",
    "corp.point2.title": "National and international service",
    "corp.point2.text": "We reach customers across Türkiye and abroad.",
    "corp.point3.title": "Technical support",
    "corp.point3.text": "Get advice from our expert team when choosing products.",
    "corp.mission.title": "Our Mission",
    "corp.mission.text": "To contribute to sustainable livestock farming and agriculture by offering producers reliable, high-quality and accessible solutions.",
    "corp.vision.title": "Our Vision",
    "corp.vision.text": "To be a trusted brand of choice in the agriculture and livestock sector, nationally and internationally.",
    "corp.values.title": "Our Values",
    "corp.values.text": "Trust, quality, transparency, customer focus and continuous improvement.",
    "corp.cert.title": "Our Quality Certificates",
    "corp.cert.subtitle": "You can view and download our documents.",
    "corp.docs.title": "Documents & Downloads",
    "corp.view": "View",
    "corp.download": "Download",
    "corp.close": "Close",
    "corp.viewer.hint": "If the document does not open, use the Download button.",
    "corp.viewer.error": "Document not found.",
    "corp.viewer.error": "Document not found.",
    "corp.cta.title": "Would You Like to Become Our Dealer?",
    "corp.cta.text": "Fill in the B2B application form and our team will contact you.",
    "corp.cta.button": "Apply as a Dealer"
  });

  /* ---------- 3. Helpers ---------- */
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

  /* ---------- 4. Rendering ---------- */
  function renderCertificates() {
    const grid = document.getElementById("certGrid");
    if (!grid) return;
    grid.innerHTML = CERTIFICATES.map(function (c) {
      return (
        '<div class="col-12 col-sm-6 col-lg-3">' +
          '<article class="fk-doc-card">' +
            '<div class="fk-doc-thumb"><i class="bi ' + esc(c.icon) + '"></i></div>' +
            '<div class="p-3 d-flex flex-column flex-grow-1">' +
              '<h3 class="h6 fw-bold mb-1">' + esc(pick(c.title)) + "</h3>" +
              '<p class="small text-body-secondary flex-grow-1">' + esc(pick(c.issuer)) + "</p>" +
              '<button type="button" class="btn btn-outline-farmeko btn-sm" data-doc="' + esc(c.id) + '">' +
                '<i class="bi bi-eye me-1"></i><span data-i18n="corp.view"></span>' +
              "</button>" +
            "</div>" +
          "</article>" +
        "</div>"
      );
    }).join("");
  }

  function renderDocuments() {
    const list = document.getElementById("docList");
    if (!list) return;
    list.innerHTML = DOCUMENTS.map(function (d) {
      return (
        '<div class="col-12 col-md-6">' +
          '<div class="fk-doc-row">' +
            '<i class="bi bi-file-earmark-pdf-fill"></i>' +
            '<div class="flex-grow-1"><strong>' + esc(pick(d.title)) + '</strong><br><small class="text-body-secondary">' + esc(pick(d.note)) + "</small></div>" +
            '<button type="button" class="btn btn-outline-farmeko btn-sm" data-doc="' + esc(d.id) + '">' +
              '<i class="bi bi-eye me-1"></i><span data-i18n="corp.view"></span>' +
            "</button>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderAll() {
    renderCertificates();
    renderDocuments();
    Farmeko.applyLanguage();
  }

  /* ---------- 5. Document viewer ---------- */
  function openDocument(id) {
    const doc = CERTIFICATES.concat(DOCUMENTS).find(function (d) { return d.id === id; });
    if (!doc) return;

    const viewer = document.getElementById("docViewer");
    document.getElementById("docModalTitle").textContent = pick(doc.title);

    const dl = document.getElementById("docDownload");
    dl.setAttribute("href", doc.file);

    if (doc.type === "image") {
      viewer.innerHTML = '<img src="' + esc(doc.file) + '" alt="' + esc(pick(doc.title)) + '">';
      viewer.querySelector("img").onerror = function () {
        viewer.innerHTML = '<p class="p-4 mb-0 text-body-secondary">' + esc(Farmeko.t("corp.viewer.error")) + "</p>";
      };
    } else {
      viewer.innerHTML = '<iframe src="' + esc(doc.file) + '" title="' + esc(pick(doc.title)) + '"></iframe>';
    }

    bootstrap.Modal.getOrCreateInstance(document.getElementById("docModal")).show();
  }

  function bindEvents() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-doc]");
      if (btn) openDocument(btn.getAttribute("data-doc"));
    });

    // Empty the viewer when the modal closes (stops loading the PDF)
    document.getElementById("docModal").addEventListener("hidden.bs.modal", function () {
      document.getElementById("docViewer").innerHTML = "";
    });

    document.addEventListener("languagechange", renderAll);
  }

  /* ---------- 6. Init ---------- */
  function init() {
    bindEvents();
    renderAll();
  }
  document.addEventListener("DOMContentLoaded", init);
})();