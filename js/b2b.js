/* ==========================================================
   FARMEKO - B2B dealer application form
   - Page translations (TR/EN)
   - Bootstrap validation (novalidate + .was-validated)
   - Temporary submit handler: console.log + alert (NO data is sent anywhere yet)
   - Honeypot field "website": if filled, the submission is silently dropped
   ========================================================== */
(function () {
  "use strict";

  /* ---------- 1. Translations ---------- */
  Farmeko.addTranslations("tr", {
    "b2b.title": "Bayi Başvurusu",
    "b2b.why.title": "Neden Farmeko Bayisi Olmalı?",
    "b2b.why.text": "Ulusal ve uluslararası iş ortaklarımızla birlikte büyüyoruz. Formu doldurun, ekibimiz sizinle iletişime geçsin.",
    "b2b.b1.title": "Özel bayi koşulları",
    "b2b.b1.text": "B2B iş ortaklarına özel fiyatlandırma ve çalışma şartları.",
    "b2b.b2.title": "Geniş ürün yelpazesi",
    "b2b.b2.text": "Yem katkılarından makinelere tek tedarikçiden birçok ürün grubu.",
    "b2b.b3.title": "Teknik ve satış desteği",
    "b2b.b3.text": "Ürün seçimi ve kullanımında uzman ekibimizden destek.",
    "b2b.b4.title": "Ulusal ve uluslararası ağ",
    "b2b.b4.text": "Türkiye geneli ve yurt dışı pazarlarda iş birliği imkânı.",
    "b2b.form.title": "Başvuru Formu",
    "b2b.form.note": "* ile işaretli alanlar zorunludur.",
    "b2b.sec.company": "Firma Bilgileri",
    "b2b.sec.contact": "İletişim Bilgileri",
    "b2b.sec.interest": "İlgi Alanı",
    "b2b.f.company": "Firma Adı",
    "b2b.f.type": "Faaliyet Türü",
    "b2b.f.taxOffice": "Vergi Dairesi",
    "b2b.f.taxNo": "Vergi No / TC Kimlik No",
    "b2b.f.name": "Yetkili Kişi",
    "b2b.f.phone": "Telefon",
    "b2b.f.email": "E-posta",
    "b2b.f.country": "Ülke",
    "b2b.f.city": "Şehir",
    "b2b.f.message": "Mesajınız (isteğe bağlı)",
    "b2b.select": "Seçiniz...",
    "b2b.type.dealer": "Bayi / Satıcı",
    "b2b.type.vet": "Veteriner Kliniği",
    "b2b.type.farm": "Çiftlik / Hayvancılık İşletmesi",
    "b2b.type.distributor": "Distribütör",
    "b2b.type.other": "Diğer",
    "b2b.consent": "Kişisel verilerimin başvurumun değerlendirilmesi amacıyla işlenmesini kabul ediyorum.",
    "b2b.submit": "Başvuruyu Gönder",
    "b2b.err.required": "Bu alan zorunludur.",
    "b2b.err.select": "Lütfen bir seçim yapın.",
    "b2b.err.email": "Geçerli bir e-posta adresi girin.",
    "b2b.err.phone": "Geçerli bir telefon numarası girin.",
    "b2b.err.taxNo": "Vergi no 10, TC kimlik no 11 haneli olmalıdır.",
    "b2b.err.consent": "Devam etmek için onay vermelisiniz.",
    "b2b.success": "Başvurunuz başarıyla alındı ",
    "b2b.f.phoneCode": "Ülke kodu",
  });

  Farmeko.addTranslations("en", {
    "b2b.title": "Dealer Application",
    "b2b.why.title": "Why Become a Farmeko Dealer?",
    "b2b.why.text": "We grow together with our national and international partners. Fill in the form and our team will contact you.",
    "b2b.b1.title": "Special dealer terms",
    "b2b.b1.text": "Exclusive pricing and working conditions for B2B partners.",
    "b2b.b2.title": "Wide product range",
    "b2b.b2.text": "From feed supplements to machinery, many product groups from one supplier.",
    "b2b.b3.title": "Technical and sales support",
    "b2b.b3.text": "Support from our expert team for product selection and use.",
    "b2b.b4.title": "National and international network",
    "b2b.b4.text": "Partnership opportunities across Türkiye and abroad.",
    "b2b.form.title": "Application Form",
    "b2b.form.note": "Fields marked with * are required.",
    "b2b.sec.company": "Company Information",
    "b2b.sec.contact": "Contact Information",
    "b2b.sec.interest": "Areas of Interest",
    "b2b.f.company": "Company Name",
    "b2b.f.type": "Business Type",
    "b2b.f.taxOffice": "Tax Office",
    "b2b.f.taxNo": "Tax No / ID No",
    "b2b.f.name": "Contact Person",
    "b2b.f.phone": "Phone",
    "b2b.f.email": "Email",
    "b2b.f.country": "Country",
    "b2b.f.city": "City",
    "b2b.f.message": "Your message (optional)",
    "b2b.select": "Select...",
    "b2b.type.dealer": "Dealer / Reseller",
    "b2b.type.vet": "Veterinary Clinic",
    "b2b.type.farm": "Farm / Livestock Operation",
    "b2b.type.distributor": "Distributor",
    "b2b.type.other": "Other",
    "b2b.consent": "I consent to my personal data being processed for the evaluation of my application.",
    "b2b.submit": "Submit Application",
    "b2b.err.required": "This field is required.",
    "b2b.err.select": "Please make a selection.",
    "b2b.err.email": "Enter a valid email address.",
    "b2b.err.phone": "Enter a valid phone number.",
    "b2b.err.taxNo": "Tax no must be 10 digits, ID no 11 digits.",
    "b2b.err.consent": "You must agree to continue.",
    "b2b.success": "Application successfully received.",
    "b2b.f.phoneCode": "Country code",
  });


  /* ---------- Phone country codes ---------- */
  // [ISO region code, dial code]. Add more pairs here if you need other countries.
  const COUNTRIES = [
    ["TR","90"],["DE","49"],["GB","44"],["US","1"],["CA","1"],["FR","33"],["NL","31"],["BE","32"],
    ["IT","39"],["ES","34"],["PT","351"],["AT","43"],["CH","41"],["GR","30"],["CY","357"],["BG","359"],
    ["RO","40"],["PL","48"],["CZ","420"],["HU","36"],["SE","46"],["NO","47"],["DK","45"],["FI","358"],
    ["IE","353"],["RS","381"],["BA","387"],["AL","355"],["MK","389"],["XK","383"],["MD","373"],["UA","380"],
    ["BY","375"],["RU","7"],["KZ","7"],["AZ","994"],["GE","995"],["AM","374"],["UZ","998"],["TM","993"],
    ["KG","996"],["TJ","992"],["IR","98"],["IQ","964"],["SY","963"],["LB","961"],["JO","962"],["IL","972"],
    ["SA","966"],["AE","971"],["QA","974"],["KW","965"],["EG","20"],["LY","218"],["TN","216"],["DZ","213"],
    ["MA","212"],["SD","249"],["NG","234"],["KE","254"],["ET","251"],["ZA","27"],["PK","92"],["IN","91"],
    ["CN","86"],["JP","81"],["KR","82"],["AU","61"],["NZ","64"],["BR","55"],["MX","52"],["AR","54"]
  ];

  function renderPhoneCodes(form) {
    const sel = form.elements["phoneCode"];
    if (!sel) return;
    const lang = Farmeko.getLang();
    const current = sel.value || "TR";

    let names = null;
    try { names = new Intl.DisplayNames([lang], { type: "region" }); } catch (e) { /* old browser: show ISO codes */ }

    const list = COUNTRIES.map(function (c) {
      return { iso: c[0], dial: c[1], name: names ? names.of(c[0]) : c[0] };
    }).sort(function (a, b) {
      if (a.iso === "TR") return -1;
      if (b.iso === "TR") return 1;
      return a.name.localeCompare(b.name, lang === "tr" ? "tr" : "en");
    });

    sel.innerHTML = list.map(function (c) {
      return '<option value="' + c.iso + '" data-dial="' + c.dial + '"' + (c.iso === "TR" ? " selected" : "") + ">" +
        c.name + " (+" + c.dial + ")</option>";
    }).join("");
    sel.value = current;
  }

  /** Full international number, e.g. +905321234567 */
  function fullPhone(form) {
    const sel = form.elements["phoneCode"];
    const v = form.elements["phone"].value.trim();
    const digits = v.replace(/\D/g, "");
    if (v.charAt(0) === "+") return "+" + digits;               // user typed full number
    if (v.indexOf("00") === 0) return "+" + digits.slice(2);    // 0044... style
    const dial = sel && sel.selectedOptions[0] ? sel.selectedOptions[0].getAttribute("data-dial") : "";
    return "+" + dial + digits.replace(/^0+/, "");              // national number: drop leading 0
  }



  /* ---------- 2. Submit handling ---------- */
  function collectData(form) {
    const fd = new FormData(form);
    return {
      company: fd.get("company"),
      businessType: fd.get("businessType"),
      taxOffice: fd.get("taxOffice"),
      taxNo: fd.get("taxNo"),
      contactName: fd.get("contactName"),
      phone: fullPhone(form),
      email: fd.get("email"),
      country: fd.get("country"),
      city: fd.get("city"),
      interest: fd.getAll("interest"),
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      language: Farmeko.getLang(),
      submittedAt: new Date().toISOString()
    };
  }

  function init() {
    const form = document.getElementById("b2bForm");
    if (!form) return;

    renderPhoneCodes(form);

    const phoneInput = form.elements["phone"];
    function checkPhone() {
      const v = phoneInput.value.trim();
      const digits = fullPhone(form).replace(/\D/g, "");
      // Allowed characters: optional leading +, digits, spaces, ( ) . - /   |  7-15 digits in total (international maximum)
      const okChars = /^\+?[0-9\s().\-\/]+$/.test(v);
      phoneInput.setCustomValidity(okChars && digits.length >= 7 && digits.length <= 15 ? "" : "invalid");
    }
    phoneInput.addEventListener("input", checkPhone);
    form.elements["phoneCode"].addEventListener("change", checkPhone);

    // Country names change with the site language
    document.addEventListener("languagechange", function () { renderPhoneCodes(form); });

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

      const data = collectData(form);
      console.log("B2B application (temporary - not sent anywhere):", data);

      // TODO (later): send to a real endpoint, e.g.
      // fetch("/api/b2b", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })

      alert(Farmeko.t("b2b.success"));
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();