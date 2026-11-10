/* ==========================================================
   FARMEKO - Data layer (products, categories, blog)
   --------------------------------------------------------
   Bilingual fields use the shape { tr: "...", en: "..." }.
   Images: put files in images/products/ and images/blog/.
   A missing image is fine: the cards show a placeholder icon.

   FUTURE BACKEND: only the FarmekoAPI functions at the bottom
   need to change (see the comments there). Pages stay the same.
   ========================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. CATEGORIES (+ subcategories for the sidebar filter)
        "key" must match the i18n keys already in components.js:
        cat.nutrition / cat.equipment / cat.machinery / cat.veterinary
     --------------------------------------------------------- */
  const categories = [
    {
      id: "nutrition",
      icon: "bi-capsule",
      name: { tr: "Yem Katkıları ve Premiksler", en: "Feed Supplements & Premixes" },
      subcategories: [
        { id: "premix",    name: { tr: "Premiksler",          en: "Premixes" } },
        { id: "mineral",   name: { tr: "Mineral Katkılar",    en: "Mineral Supplements" } },
        { id: "probiotic", name: { tr: "Probiyotikler",       en: "Probiotics" } }
      ]
    },
    {
      id: "equipment",
      icon: "bi-droplet-half",
      name: { tr: "Hayvancılık Ekipmanları", en: "Livestock Equipment" },
      subcategories: [
        { id: "milking", name: { tr: "Sağım Sistemleri",       en: "Milking Systems" } },
        { id: "herd",    name: { tr: "Sürü Yönetimi Cihazları", en: "Herd Management Devices" } },
        { id: "barn",    name: { tr: "Ahır Ekipmanları",        en: "Barn Equipment" } }
      ]
    },
    {
      id: "machinery",
      icon: "bi-truck",
      name: { tr: "Endüstriyel Tarım Makineleri", en: "Industrial Farming Machinery" },
      subcategories: [
        { id: "feeding",   name: { tr: "Yemleme Makineleri",  en: "Feeding Machines" } },
        { id: "harvest",   name: { tr: "Hasat ve Balyalama",  en: "Harvesting & Baling" } },
        { id: "manure",    name: { tr: "Gübre Yönetimi",      en: "Manure Management" } }
      ]
    },
    {
      id: "veterinary",
      icon: "bi-heart-pulse",
      name: { tr: "Veteriner ve Tıbbi Ürünler", en: "Veterinary & Medical Products" },
      subcategories: [
        { id: "consumable",  name: { tr: "Sarf Malzemeleri",  en: "Consumables" } },
        { id: "diagnostic",  name: { tr: "Teşhis Cihazları",  en: "Diagnostic Devices" } },
        { id: "hoofcare",    name: { tr: "Tırnak Bakımı",     en: "Hoof Care" } }
      ]
    }
  ];

  /* ---------------------------------------------------------
     2. PRODUCTS
        id          : URL-safe slug (used in product-detail.html?id=...)
        category    : one of the category ids above
        subcategory : one of that category's subcategory ids
        featured    : true = shown on the Home Page (first 4)
        specs       : [{ l: label, v: value }]  (v can be a string or {tr,en})
     --------------------------------------------------------- */
  const products = [
    /* ---------- NUTRITION ---------- */
    {
      id: "dairy-support-premix",
      category: "nutrition", subcategory: "premix", featured: true,
      image: "images/products/dairy-support-premix.jpg",
      name: { tr: "Süt Sığırı Destek Premiksi", en: "Dairy Cattle Support Premix" },
      shortDesc: {
        tr: "Süt veren sığırların günlük rasyonunu destekleyen vitamin-mineral premiksi.",
        en: "Vitamin-mineral premix that supports the daily ration of lactating cattle."
      },
      description: {
        tr: "<p>Süt sığırı rasyonlarına eklenmek üzere hazırlanmış destekleyici premikstir. Rasyondaki vitamin ve mineral dengesini tamamlamaya yardımcı olur.</p><p>Kullanım miktarı ve uygulama şekli için teknik ekibimizle iletişime geçiniz.</p>",
        en: "<p>A supportive premix designed to be added to dairy cattle rations. It helps complete the vitamin and mineral balance of the ration.</p><p>Please contact our technical team for dosage and application guidance.</p>"
      },
      specs: [
        { l: { tr: "Hedef Hayvan", en: "Target Animal" }, v: { tr: "Süt Sığırı", en: "Dairy Cattle" } },
        { l: { tr: "Form", en: "Form" }, v: { tr: "Toz", en: "Powder" } },
        { l: { tr: "Ambalaj", en: "Packaging" }, v: "25 kg" },
        { l: { tr: "Saklama", en: "Storage" }, v: { tr: "Serin ve kuru yerde", en: "Cool and dry place" } }
      ]
    },
    {
      id: "rumen-probiotic",
      category: "nutrition", subcategory: "probiotic", featured: false,
      image: "images/products/rumen-probiotic.jpg",
      name: { tr: "Rumen Probiyotik Katkısı", en: "Rumen Probiotic Supplement" },
      shortDesc: {
        tr: "Rumen dengesini desteklemeye yardımcı probiyotik yem katkısı.",
        en: "Probiotic feed additive that helps support rumen balance."
      },
      description: {
        tr: "<p>Büyükbaş ve küçükbaş hayvan rasyonlarında kullanılmak üzere geliştirilmiş probiyotik katkıdır.</p>",
        en: "<p>A probiotic additive designed for use in cattle and small ruminant rations.</p>"
      },
      specs: [
        { l: { tr: "Hedef Hayvan", en: "Target Animal" }, v: { tr: "Büyükbaş / Küçükbaş", en: "Cattle / Small ruminants" } },
        { l: { tr: "Form", en: "Form" }, v: { tr: "Toz", en: "Powder" } },
        { l: { tr: "Ambalaj", en: "Packaging" }, v: "10 kg" }
      ]
    },
    {
      id: "mineral-lick-block",
      category: "nutrition", subcategory: "mineral", featured: false,
      image: "images/products/mineral-lick-block.jpg",
      name: { tr: "Mineral Yalama Taşı", en: "Mineral Lick Block" },
      shortDesc: {
        tr: "Meralarda ve ahırlarda serbest tüketim için mineral blok.",
        en: "Mineral block for free-choice intake on pasture and in barns."
      },
      description: {
        tr: "<p>Hayvanların ihtiyaç duydukça tüketebildiği, mineral içerikli yalama taşıdır.</p>",
        en: "<p>A mineral-based lick block that animals can consume as needed.</p>"
      },
      specs: [
        { l: { tr: "Hedef Hayvan", en: "Target Animal" }, v: { tr: "Tüm Çiftlik Hayvanları", en: "All Farm Animals" } },
        { l: { tr: "Form", en: "Form" }, v: { tr: "Blok", en: "Block" } },
        { l: { tr: "Ağırlık", en: "Weight" }, v: "5 kg" }
      ]
    },

    /* ---------- EQUIPMENT ---------- */
    {
      id: "pipeline-milking-system",
      category: "equipment", subcategory: "milking", featured: true,
      image: "images/products/pipeline-milking-system.jpg",
      name: { tr: "Boru Hatlı Sağım Sistemi", en: "Pipeline Milking System" },
      shortDesc: {
        tr: "Orta ve büyük ölçekli işletmeler için boru hatlı sağım çözümü.",
        en: "Pipeline milking solution for medium and large-scale operations."
      },
      description: {
        tr: "<p>Hijyenik süt transferi için tasarlanmış boru hatlı sağım sistemidir. Ünite sayısı işletme ihtiyacına göre planlanır.</p><p>Projelendirme ve kurulum için teklif talep ediniz.</p>",
        en: "<p>A pipeline milking system designed for hygienic milk transfer. The number of units is planned according to the farm's needs.</p><p>Request a quote for project planning and installation.</p>"
      },
      specs: [
        { l: { tr: "Sistem Tipi", en: "System Type" }, v: { tr: "Boru Hatlı", en: "Pipeline" } },
        { l: { tr: "Ünite Sayısı", en: "Number of Units" }, v: { tr: "İhtiyaca göre", en: "Configurable" } },
        { l: { tr: "Kurulum", en: "Installation" }, v: { tr: "Uzman ekip ile", en: "By specialist team" } }
      ]
    },
    {
      id: "bucket-milking-machine",
      category: "equipment", subcategory: "milking", featured: false,
      image: "images/products/bucket-milking-machine.jpg",
      name: { tr: "Bidonlu Sağım Makinesi", en: "Bucket Milking Machine" },
      shortDesc: {
        tr: "Küçük ve orta ölçekli işletmeler için taşınabilir sağım makinesi.",
        en: "Portable milking machine for small and medium-sized farms."
      },
      description: {
        tr: "<p>Kolay taşınabilir yapısıyla küçük ve orta ölçekli işletmeler için uygundur.</p>",
        en: "<p>Its easy-to-move design suits small and medium-sized farms.</p>"
      },
      specs: [
        { l: { tr: "Sistem Tipi", en: "System Type" }, v: { tr: "Bidonlu / Taşınabilir", en: "Bucket / Portable" } },
        { l: { tr: "Kullanım", en: "Use" }, v: { tr: "İnek, Koyun, Keçi", en: "Cow, Sheep, Goat" } }
      ]
    },
    {
      id: "herd-activity-collar",
      category: "equipment", subcategory: "herd", featured: false,
      image: "images/products/herd-activity-collar.jpg",
      name: { tr: "Sürü Takip Tasması", en: "Herd Monitoring Collar" },
      shortDesc: {
        tr: "Hayvan hareketini izlemeye yardımcı sürü yönetimi cihazı.",
        en: "Herd management device that helps monitor animal activity."
      },
      description: {
        tr: "<p>Sürü yönetimini kolaylaştırmak için hayvan aktivite verilerini toplayan takip cihazıdır.</p>",
        en: "<p>A monitoring device that collects animal activity data to make herd management easier.</p>"
      },
      specs: [
        { l: { tr: "Kullanım", en: "Use" }, v: { tr: "Büyükbaş", en: "Cattle" } },
        { l: { tr: "Veri", en: "Data" }, v: { tr: "Aktivite takibi", en: "Activity tracking" } }
      ]
    },
    {
      id: "automatic-waterer",
      category: "equipment", subcategory: "barn", featured: false,
      image: "images/products/automatic-waterer.jpg",
      name: { tr: "Otomatik Suluk", en: "Automatic Waterer" },
      shortDesc: {
        tr: "Ahır ve padoklar için dayanıklı otomatik suluk.",
        en: "Durable automatic waterer for barns and paddocks."
      },
      description: {
        tr: "<p>Hayvanlara sürekli temiz su erişimi sağlamak için tasarlanmış otomatik sulukturdur.</p>",
        en: "<p>An automatic waterer designed to provide animals with continuous access to clean water.</p>"
      },
      specs: [
        { l: { tr: "Kullanım", en: "Use" }, v: { tr: "Ahır / Padok", en: "Barn / Paddock" } },
        { l: { tr: "Malzeme", en: "Material" }, v: { tr: "Dayanıklı gövde", en: "Durable body" } }
      ]
    },

    /* ---------- MACHINERY ---------- */
    {
      id: "tmr-feed-mixer",
      category: "machinery", subcategory: "feeding", featured: true,
      image: "images/products/tmr-feed-mixer.jpg",
      name: { tr: "TMR Yem Karma Makinesi", en: "TMR Feed Mixer" },
      shortDesc: {
        tr: "Karma rasyon hazırlamak için endüstriyel yem karma makinesi.",
        en: "Industrial feed mixer for preparing total mixed rations."
      },
      description: {
        tr: "<p>Kaba ve kesif yemleri homojen biçimde karıştırmak için kullanılan yem karma makinesidir. Kapasite seçenekleri işletme büyüklüğüne göre belirlenir.</p>",
        en: "<p>A feed mixer used to blend roughage and concentrate evenly. Capacity options are chosen according to farm size.</p>"
      },
      specs: [
        { l: { tr: "Tip", en: "Type" }, v: { tr: "Çekilir / Sabit", en: "Towed / Stationary" } },
        { l: { tr: "Kapasite", en: "Capacity" }, v: { tr: "Birden fazla seçenek", en: "Multiple options" } },
        { l: { tr: "Kullanım", en: "Use" }, v: { tr: "Büyük ölçekli işletmeler", en: "Large-scale farms" } }
      ]
    },
    {
      id: "round-baler",
      category: "machinery", subcategory: "harvest", featured: false,
      image: "images/products/round-baler.jpg",
      name: { tr: "Rulo Balya Makinesi", en: "Round Baler" },
      shortDesc: {
        tr: "Saman ve ot için rulo balya makinesi.",
        en: "Round baler for straw and hay."
      },
      description: {
        tr: "<p>Hasat sonrası saman ve otu rulo balyalar halinde toplamak için kullanılır.</p>",
        en: "<p>Used to collect straw and hay into round bales after harvest.</p>"
      },
      specs: [
        { l: { tr: "Tip", en: "Type" }, v: { tr: "Traktör çekili", en: "Tractor-towed" } },
        { l: { tr: "Ürün", en: "Crop" }, v: { tr: "Saman, ot", en: "Straw, hay" } }
      ]
    },
    {
      id: "manure-scraper-system",
      category: "machinery", subcategory: "manure", featured: false,
      image: "images/products/manure-scraper-system.jpg",
      name: { tr: "Gübre Kazıma Sistemi", en: "Manure Scraper System" },
      shortDesc: {
        tr: "Ahır içi gübre temizliği için otomatik kazıma sistemi.",
        en: "Automatic scraper system for in-barn manure cleaning."
      },
      description: {
        tr: "<p>Ahır zeminini düzenli olarak temizleyerek hijyeni destekleyen otomatik sistemdir.</p>",
        en: "<p>An automatic system that supports hygiene by cleaning the barn floor regularly.</p>"
      },
      specs: [
        { l: { tr: "Çalışma", en: "Operation" }, v: { tr: "Otomatik", en: "Automatic" } },
        { l: { tr: "Kullanım", en: "Use" }, v: { tr: "Kapalı ahırlar", en: "Indoor barns" } }
      ]
    },

    /* ---------- VETERINARY ---------- */
    {
      id: "disposable-syringe-set",
      category: "veterinary", subcategory: "consumable", featured: true,
      image: "images/products/disposable-syringe-set.jpg",
      name: { tr: "Tek Kullanımlık Enjektör Seti", en: "Disposable Syringe Set" },
      shortDesc: {
        tr: "Veteriner klinikleri ve çiftlikler için steril tek kullanımlık enjektörler.",
        en: "Sterile disposable syringes for veterinary clinics and farms."
      },
      description: {
        tr: "<p>Klinik ve saha kullanımına uygun, tek kullanımlık veteriner enjektör setidir. Farklı hacim seçenekleri için bizimle iletişime geçiniz.</p>",
        en: "<p>A disposable veterinary syringe set suitable for clinic and field use. Contact us for different volume options.</p>"
      },
      specs: [
        { l: { tr: "Kullanım", en: "Use" }, v: { tr: "Tek kullanımlık", en: "Single use" } },
        { l: { tr: "Hacim", en: "Volume" }, v: { tr: "Birden fazla seçenek", en: "Multiple options" } },
        { l: { tr: "Alıcı", en: "Buyer" }, v: { tr: "Klinik, çiftlik, bayi", en: "Clinic, farm, dealer" } }
      ]
    },
    {
      id: "vet-ultrasound-scanner",
      category: "veterinary", subcategory: "diagnostic", featured: false,
      image: "images/products/vet-ultrasound-scanner.jpg",
      name: { tr: "Veteriner Ultrason Cihazı", en: "Veterinary Ultrasound Scanner" },
      shortDesc: {
        tr: "Gebelik ve genel muayene için taşınabilir veteriner ultrason cihazı.",
        en: "Portable veterinary ultrasound for pregnancy and general examination."
      },
      description: {
        tr: "<p>Saha ve klinik kullanımı için taşınabilir ultrason cihazıdır.</p>",
        en: "<p>A portable ultrasound device for field and clinic use.</p>"
      },
      specs: [
        { l: { tr: "Tip", en: "Type" }, v: { tr: "Taşınabilir", en: "Portable" } },
        { l: { tr: "Kullanım", en: "Use" }, v: { tr: "Büyükbaş, küçükbaş", en: "Cattle, small ruminants" } }
      ]
    },
    {
      id: "hoof-care-kit",
      category: "veterinary", subcategory: "hoofcare", featured: false,
      image: "images/products/hoof-care-kit.jpg",
      name: { tr: "Tırnak Bakım Seti", en: "Hoof Care Kit" },
      shortDesc: {
        tr: "Düzenli tırnak bakımı için profesyonel alet seti.",
        en: "Professional tool set for routine hoof care."
      },
      description: {
        tr: "<p>Sürü tırnak bakımında kullanılan profesyonel alet setidir.</p>",
        en: "<p>A professional tool set used in herd hoof care.</p>"
      },
      specs: [
        { l: { tr: "İçerik", en: "Contents" }, v: { tr: "Alet seti", en: "Tool set" } },
        { l: { tr: "Kullanım", en: "Use" }, v: { tr: "Büyükbaş", en: "Cattle" } }
      ]
    }
  ];

  /* ---------------------------------------------------------
     3. BLOG POSTS (content = HTML, shown in blog-detail.html)
     --------------------------------------------------------- */
  const blog = [
    {
      id: "rumen-health-basics",
      category: { tr: "Hayvan Sağlığı", en: "Animal Health" },
      date: "2026-09-12",
      image: "images/blog/rumen-health-basics.jpg",
      title: { tr: "Rumen Sağlığının Temelleri", en: "Rumen Health Basics" },
      excerpt: {
        tr: "Sağlıklı bir rumen, verimli bir sürünün temelidir. Dikkat edilecek ana noktalar.",
        en: "A healthy rumen is the foundation of a productive herd. Key points to watch."
      },
      content: {
        tr: "<p>Rumen, geviş getiren hayvanlarda beslenmenin merkezidir. Rasyon dengesi, kaba yem kalitesi ve yemleme düzeni rumen sağlığını doğrudan etkiler.</p><h5>Dikkat edilecekler</h5><ul><li>Rasyonda yeterli kaba yem bulunması</li><li>Ani rasyon değişikliklerinden kaçınılması</li><li>Temiz ve sürekli su erişimi</li></ul><p>Rasyonunuzla ilgili sorularınız için veteriner hekiminize danışın.</p>",
        en: "<p>The rumen is the centre of nutrition in ruminants. Ration balance, forage quality and feeding routine directly affect rumen health.</p><h5>Points to watch</h5><ul><li>Enough roughage in the ration</li><li>Avoiding sudden ration changes</li><li>Clean, continuous access to water</li></ul><p>Consult your veterinarian for questions about your ration.</p>"
      }
    },
    {
      id: "milking-hygiene-tips",
      category: { tr: "Hayvancılık Teknolojileri", en: "Livestock Technology" },
      date: "2026-08-25",
      image: "images/blog/milking-hygiene-tips.jpg",
      title: { tr: "Sağımda Hijyen İçin Pratik Öneriler", en: "Practical Tips for Milking Hygiene" },
      excerpt: {
        tr: "Sağım ekipmanlarının düzenli bakımı süt kalitesini korumaya yardımcı olur.",
        en: "Regular maintenance of milking equipment helps protect milk quality."
      },
      content: {
        tr: "<p>Sağım sistemlerinde hijyen, hem süt kalitesi hem de hayvan konforu açısından önemlidir.</p><ul><li>Ekipmanı her sağım sonrası temizleyin</li><li>Contaları ve hortumları düzenli kontrol edin</li><li>Bakımı üretici önerilerine göre yaptırın</li></ul>",
        en: "<p>Hygiene in milking systems matters for both milk quality and animal comfort.</p><ul><li>Clean the equipment after every milking</li><li>Check gaskets and hoses regularly</li><li>Have maintenance done as the manufacturer recommends</li></ul>"
      }
    },
    {
      id: "tmr-feeding-benefits",
      category: { tr: "Tarım Makineleri", en: "Farming Machinery" },
      date: "2026-08-03",
      image: "images/blog/tmr-feeding-benefits.jpg",
      title: { tr: "TMR Yemlemenin Faydaları", en: "Benefits of TMR Feeding" },
      excerpt: {
        tr: "Karma rasyon yemlemesi, her lokmada dengeli beslenmeyi destekler.",
        en: "Total mixed ration feeding supports balanced nutrition in every bite."
      },
      content: {
        tr: "<p>TMR (tam karma rasyon), kaba ve kesif yemlerin homojen karıştırılarak sunulduğu bir yemleme yöntemidir. Hayvanların seçici yemesini azaltmaya yardımcı olur.</p>",
        en: "<p>TMR (total mixed ration) is a feeding method where roughage and concentrate are blended evenly. It helps reduce selective eating by animals.</p>"
      }
    },
    {
      id: "digital-herd-management",
      category: { tr: "Hayvancılık Teknolojileri", en: "Livestock Technology" },
      date: "2026-07-18",
      image: "images/blog/digital-herd-management.jpg",
      title: { tr: "Dijital Sürü Yönetimine Giriş", en: "Introduction to Digital Herd Management" },
      excerpt: {
        tr: "Takip cihazları sürü verilerini toplamayı ve karar vermeyi kolaylaştırır.",
        en: "Monitoring devices make it easier to collect herd data and make decisions."
      },
      content: {
        tr: "<p>Takip tasmaları ve sensörler, aktivite gibi verileri toplayarak çiftlik yönetimine destek olur. Doğru cihaz seçimi işletme büyüklüğüne bağlıdır.</p>",
        en: "<p>Monitoring collars and sensors support farm management by collecting data such as activity. The right device depends on farm size.</p>"
      }
    }
  ];

  /* ---------------------------------------------------------
     4. PUBLIC DATA OBJECT (home.js reads this directly)
     --------------------------------------------------------- */
  window.FARMEKO_DATA = { categories: categories, products: products, blog: blog };

  /* ---------------------------------------------------------
     5. API-READY LAYER
        Every function returns a Promise, exactly like fetch().
        Pages call FarmekoAPI.xxx().then(...), so later you only edit
        the bodies below. Example for a real backend:

          getProducts: function () {
            return fetch("/api/products").then(function (r) { return r.json(); });
          }
     --------------------------------------------------------- */
  function resolve(value) { return Promise.resolve(JSON.parse(JSON.stringify(value))); }

  window.FarmekoAPI = {
    getCategories: function () { return resolve(categories); },
    getProducts: function () { return resolve(products); },
    getProduct: function (id) {
      return resolve(products.find(function (p) { return p.id === id; }) || null);
    },
    getBlogPosts: function () { return resolve(blog); },
    getBlogPost: function (id) {
      return resolve(blog.find(function (b) { return b.id === id; }) || null);
    }
  };
})();