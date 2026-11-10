/* ==========================================================
   FARMEKO - Contact page logic
   - Page translations (TR/EN)
   - Contact cards + social links (values come from CONFIG in components.js)
   - Map placeholder (set MAP_EMBED_URL below for a real Google Map)
   - Temporary submit handler: console.log + alert (NO data is sent anywhere yet)
   - Honeypot field "website": if filled, the submission is silently dropped
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. EDIT HERE ----------
     Google Maps: open your location on Google Maps -> Share -> Embed a map ->
     copy ONLY the address inside src="..." and paste it between the quotes.
     It must start with https://www.google.com/maps/embed?  Leave "" for the placeholder. */
  const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3477.8588949603204!2d34.04627087619908!3d37.515305272052196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d7974e1f232ec1%3A0x4cd37af1a8259469!2zRVJFxJ5MxLAgw4fEsEZUTMSwSyBNQVJLRVQ!5e1!3m2!1str!2str!4v1794233583257!5m2!1str!2str";

  const WORKING_HOURS = {
    tr: "Pazartesi - Cuma: 08:30 - 18:00",
    en: "Monday - Friday: 08:30 - 18:00"
  };

  /* ---------- 2. Translations ---------- */
  Farmeko.addTranslations("tr", {
    "ct.title": "İletişim",
    "ct.info.title": "Bize Ulaşın",
    "ct.info.text": "Sorularınız, ürün ve fiyat talepleriniz için bize aşağıdaki kanallardan ulaşabilirsiniz.",
    "ct.address": "Adres",
    "ct.phone": "Telefon",
    "ct.whatsapp": "WhatsApp",
    "ct.whatsapp.cta": "WhatsApp ile yazın",
    "ct.email": "E-posta",
    "ct.hours": "Çalışma Saatleri",
    "ct.follow": "Bizi Takip Edin",
    "ct.form.title": "Bize Yazın",
    "ct.form.note": "* ile işaretli alanlar zorunludur.",
    "ct.f.name": "Ad Soyad",
    "ct.f.email": "E-posta",
    "ct.f.phone": "Telefon (isteğe bağlı)",
    "ct.f.subject": "Konu",
    "ct.f.message": "Mesajınız",
    "ct.select": "Seçiniz...",
    "ct.subject.quote": "Fiyat / Teklif Talebi",
    "ct.subject.info": "Ürün Bilgisi",
    "ct.subject.support": "Teknik Destek",
    "ct.subject.other": "Diğer",
    "ct.consent": "Kişisel verilerimin talebimin yanıtlanması amacıyla işlenmesini kabul ediyorum.",
    "ct.submit": "Mesajı Gönder",
    "ct.err.required": "Bu alan zorunludur.",
    "ct.err.email": "Geçerli bir e-posta adresi girin.",
    "ct.err.phone": "Geçerli bir telefon numarası girin (ülke kodu ile, örn. +90 532 123 45 67).",
    "ct.err.select": "Lütfen bir seçim yapın.",
    "ct.err.message": "Mesajınız en az 10 karakter olmalıdır.",
    "ct.err.consent": "Devam etmek için onay vermelisiniz.",
    "ct.map.title": "Harita burada görünecek",
    "ct.map.text": "Gerçek konumunuzu eklemek için contact.js içindeki MAP_EMBED_URL değerini doldurun.",
    "ct.success": "Başvurunuz başarıyla alındı / Application successfully received."
  });

  Farmeko.addTranslations("en", {
    "ct.title": "Contact",
    "ct.info.title": "Get in Touch",
    "ct.info.text": "For questions, product and price requests, reach us through the channels below.",
    "ct.address": "Address",
    "ct.phone": "Phone",
    "ct.whatsapp": "WhatsApp",
    "ct.whatsapp.cta": "Message us on WhatsApp",
    "ct.email": "Email",
    "ct.hours": "Working Hours",
    "ct.follow": "Follow Us",
    "ct.form.title": "Write to Us",
    "ct.form.note": "Fields marked with * are required.",
    "ct.f.name": "Full Name",
    "ct.f.email": "Email",
    "ct.f.phone": "Phone (optional)",
    "ct.f.subject": "Subject",
    "ct.f.message": "Your message",
    "ct.select": "Select...",
    "ct.subject.quote": "Price / Quote Request",
    "ct.subject.info": "Product Information",
    "ct.subject.support": "Technical Support",
    "ct.subject.other": "Other",
    "ct.consent": "I consent to my personal data being processed to respond to my request.",
    "ct.submit": "Send Message",
    "ct.err.required": "This field is required.",
    "ct.err.email": "Enter a valid email address.",
    "ct.err.phone": "Enter a valid phone number (with country code, e.g. +90 532 123 45 67).",
    "ct.err.select": "Please make a selection.",
    "ct.err.message": "Your message must be at least 10 characters.",
    "ct.err.consent": "You must agree to continue.",
    "ct.map.title": "The map will appear here",
    "ct.map.text": "To add your real location, fill in MAP_EMBED_URL in contact.js.",
    "ct.success": "Application successfully received. / Başvurunuz başarıyla alındı."
  });

  /* ---------- 3. Helpers ---------- */
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 4. Rendering ---------- */
  function cardHTML(icon, labelKey, valueHTML, href, external) {
    const inner =
      '<div class="fk-info-icon"><i class="bi ' + icon + '"></i></div>' +
      '<div><small data-i18n="' + labelKey + '"></small><div class="fk-info-value">' + valueHTML + "</div></div>";
    const tag = href
      ? '<a class="fk-info-card" href="' + esc(href) + '"' + (external ? ' target="_blank" rel="noopener"' : "") + ">" + inner + "</a>"
      : '<div class="fk-info-card">' + inner + "</div>";
    return '<div class="col-12 col-sm-6 col-lg-12 col-xl-6">' + tag + "</div>";
  }

  function renderCards() {
    const box = document.getElementById("contactCards");
    if (!box) return;
    const c = Farmeko.config;
    const lang = Farmeko.getLang();
    const wa = "https://wa.me/" + c.whatsapp + "?text=" + encodeURIComponent(Farmeko.t("wa.generalMessage"));

    box.innerHTML =
      cardHTML("bi-geo-alt-fill", "ct.address", esc(c.address), "", false) +
      cardHTML("bi-telephone-fill", "ct.phone", esc(c.phone), "tel:" + c.phone.replace(/\s/g, ""), false) +
      cardHTML("bi-whatsapp", "ct.whatsapp", '<span data-i18n="ct.whatsapp.cta"></span>', wa, true) +
      cardHTML("bi-envelope-fill", "ct.email", esc(c.email), "mailto:" + c.email, false) +
      cardHTML("bi-clock-fill", "ct.hours", esc(WORKING_HOURS[lang] || WORKING_HOURS.tr), "", false);
  }

  function renderSocial() {
    const box = document.getElementById("contactSocial");
    if (!box) return;
    const s = Farmeko.config.social || {};
    const items = [
      ["instagram", "bi-instagram", "Instagram"],
      ["facebook", "bi-facebook", "Facebook"],
      ["linkedin", "bi-linkedin", "LinkedIn"],
      ["youtube", "bi-youtube", "YouTube"]
    ];
    box.innerHTML = items.map(function (it) {
      return '<a href="' + esc(s[it[0]] || "#") + '" target="_blank" rel="noopener" aria-label="' + it[2] + '"><i class="bi ' + it[1] + '"></i></a>';
    }).join("");
  }

  function renderMap() {
    const box = document.getElementById("mapBox");
    if (!box) return;
    if (MAP_EMBED_URL && MAP_EMBED_URL.indexOf("https://www.google.com/maps/embed") === 0) {
      box.innerHTML = '<iframe src="' + esc(MAP_EMBED_URL) + '" title="Farmeko map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
    } else {
      box.innerHTML =
        "<div>" +
          '<i class="bi bi-map"></i>' +
          '<h3 class="h5 fw-bold mt-3" data-i18n="ct.map.title"></h3>' +
          '<p class="text-body-secondary mb-0" data-i18n="ct.map.text"></p>' +
        "</div>";
    }
  }

  function renderAll() {
    renderCards();
    renderSocial();
    renderMap();
    Farmeko.applyLanguage();   // translate the freshly created elements
  }

  /* ---------- 5. Form ---------- */
  function initForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    // Phone is optional: when filled, accept international formats (7-15 digits)
    const phoneInput = form.elements["phone"];
    function checkPhone() {
      const v = phoneInput.value.trim();
      if (!v) { phoneInput.setCustomValidity(""); return; }
      const digits = v.replace(/\D/g, "");
      const okChars = /^\+?[0-9\s().\-\/]+$/.test(v);
      phoneInput.setCustomValidity(okChars && digits.length >= 7 && digits.length <= 15 ? "" : "invalid");
    }
    phoneInput.addEventListener("input", checkPhone);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Honeypot: bots fill the hidden field, people never see it
      if (form.elements["website"].value) return;

      checkPhone();
      form.classList.add("was-validated");
      if (!form.checkValidity()) {
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const fd = new FormData(form);
      const data = {
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        subject: fd.get("subject"),
        message: fd.get("message"),
        consent: fd.get("consent") === "on",
        language: Farmeko.getLang(),
        submittedAt: new Date().toISOString()
      };
      console.log("Contact message (temporary - not sent anywhere):", data);

      // TODO (later): send to a real endpoint, e.g.
      // fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })

      alert(Farmeko.t("ct.success"));
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  /* ---------- 6. Init ---------- */
  function init() {
    initForm();
    renderAll();
    document.addEventListener("languagechange", renderAll);
  }
  document.addEventListener("DOMContentLoaded", init);
})();