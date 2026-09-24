/* =====================================================================
   REGINA VALENZUELA — SALON & MAKEUP SCHOOL
   Site content & business facts
   ---------------------------------------------------------------------
   This file is the ONLY place business facts live. Nothing in the site
   invents a price, phone number, address, credential, course detail or
   review — every one of those is read from here.

   HOW IT WORKS
   • `preview: true`  → draft items (confirmed: false) are shown with a
     "Draft — confirm before launch" badge, and a launch-checklist
     banner lists every fact still missing.
   • `preview: false` → drafts are hidden; empty sections (reviews,
     student work, before/after, social) are removed along with any
     menu links that pointed to them, so visitors never hit a dead end.

   Leave a value as "" (empty) until it is verified. Empty values are
   never displayed as facts.
   ===================================================================== */

window.SITE_CONFIG = {
  preview: true,

  business: {
    name: "Regina Valenzuela",
    descriptor: "Salon & Makeup School",
    // Public website address, e.g. "https://www.reginavalenzuela.com"
    url: "",
    // Digits with country code for tel: links, e.g. "+15551234567"
    phone: "",
    // How the number should be shown, e.g. "(555) 123-4567"
    phoneDisplay: "",
    email: "",
    // Mobile number for SMS (digits with country code). Optional.
    sms: "",
    // WhatsApp number (digits only, country code, no +). Optional.
    whatsapp: "",
    address: {
      street: "",
      city: "",
      region: "", // state / province
      postalCode: "",
      country: ""
    },
    // e.g. [{ days: "Tuesday – Friday", time: "10:00 am – 7:00 pm", schema: "Tu-Fr 10:00-19:00" }]
    hours: [],
    // Languages spoken in the salon/school, e.g. ["English", "Español"]
    languages: []
  },

  links: {
    // Online booking page (Square, Vagaro, Fresha, Booksy, GlossGenius…).
    // When empty, "Book" buttons open the appointment-request form.
    booking: "",
    // External school application / enrollment page. When empty,
    // "Enroll" buttons open the student-inquiry form.
    enrollment: "",
    instagram: "",
    instagramHandle: "", // without @
    facebook: "",
    tiktok: "",
    youtube: "",
    // Where contact & inquiry forms are delivered. Any endpoint that
    // accepts a JSON POST works (Formspree, Getform, Basin, a serverless
    // function…). When empty, forms fall back to opening the visitor's
    // email app addressed to business.email.
    formEndpoint: ""
  },

  /* ---------- Media -------------------------------------------------
     Paths are relative to the site root, e.g. "assets/media/hero.webp".
     Provide optimized WebP/AVIF images (≈1600px wide max) and short,
     muted, compressed MP4/WebM clips (≤ 4 MB desktop, ≤ 1.5 MB mobile).
     Slots left empty show an abstract art-directed panel instead of a
     photograph — never a stock photo passed off as real work.       */
  media: {
    heroVideo: { desktop: "", mobile: "", poster: "" },
    // Each slot: { src: "", alt: "" }
    slots: {
      "salon-intro-1": { src: "", alt: "" },
      "salon-intro-2": { src: "", alt: "" },
      "path-salon": { src: "", alt: "" },
      "path-school": { src: "", alt: "" },
      "bridal-1": { src: "", alt: "" },
      "bridal-2": { src: "", alt: "" },
      "bridal-3": { src: "", alt: "" },
      "school-1": { src: "", alt: "" },
      "school-2": { src: "", alt: "" },
      "regina-portrait": { src: "", alt: "" }
    }
  },

  /* ---------- Salon services ----------------------------------------
     Only services with confirmed: true are shown after launch.
     category must be one of the keys in serviceCategories.          */
  serviceCategories: {
    hair: "Hair",
    makeup: "Makeup",
    bridal: "Bridal",
    lashes: "Lashes & Brows",
    packages: "Packages"
  },
  services: [
    { id: "event-makeup", name: "Special Event Makeup", category: "makeup",
      description: "Polished, camera-ready makeup tailored to your features and your occasion.",
      price: "", duration: "", image: "", confirmed: false },
    { id: "hairstyling", name: "Hairstyling", category: "hair",
      description: "Soft waves, sleek finishes and elegant updos designed around your look.",
      price: "", duration: "", image: "", confirmed: false },
    { id: "hair-color", name: "Hair Color", category: "hair",
      description: "Considered color that complements your skin tone and lifestyle.",
      price: "", duration: "", image: "", confirmed: false },
    { id: "hair-treatment", name: "Hair Treatments", category: "hair",
      description: "Restorative care for softness, strength and shine.",
      price: "", duration: "", image: "", confirmed: false },
    { id: "bridal-beauty", name: "Bridal Beauty", category: "bridal",
      description: "Hair and makeup for your wedding day, planned with you in advance.",
      price: "", duration: "", image: "", confirmed: false },
    { id: "lashes", name: "Lashes", category: "lashes",
      description: "Lash enhancement that defines the eye without overpowering it.",
      price: "", duration: "", image: "", confirmed: false },
    { id: "brows", name: "Brows", category: "lashes",
      description: "Shaping and definition to frame your face.",
      price: "", duration: "", image: "", confirmed: false },
    { id: "beauty-package", name: "Hair & Makeup Package", category: "packages",
      description: "A complete look — hair and makeup in a single appointment.",
      price: "", duration: "", image: "", confirmed: false }
  ],

  // Set to true only if bridal services are offered. null = unknown.
  bridalOffered: null,

  /* ---------- Before & after ----------------------------------------
     Genuine client results only, with the client's permission.
     { category: "Makeup", before: "", after: "", alt: "", caption: "" } */
  beforeAfter: [],

  /* ---------- Portfolio ---------------------------------------------
     { src: "", alt: "", category: "makeup|hair|bridal|editorial|transformations",
       shape: "tall|wide|square", caption: "" }                          */
  portfolio: [],

  /* ---------- Makeup courses ----------------------------------------
     Use only verified details. Leave any unknown detail as "".       */
  courses: [
    {
      id: "course-1",
      name: "Course name to be confirmed",
      overview: "A short overview of who this course is for and what it covers.",
      learn: ["Technique", "Application", "Product knowledge", "Tools",
              "Hygiene and sanitation", "Client preparation", "Professional workflow"],
      details: { duration: "", schedule: "", tuition: "", requirements: "",
                 materials: "", certification: "" },
      startDate: "", // ISO date, e.g. "2027-01-15" (used for structured data)
      confirmed: false
    },
    {
      id: "course-2",
      name: "Second course — to be confirmed",
      overview: "Add a second program here, or delete this entry if there is only one.",
      learn: ["Technique", "Application", "Professional workflow"],
      details: { duration: "", schedule: "", tuition: "", requirements: "",
                 materials: "", certification: "" },
      startDate: "",
      confirmed: false
    }
  ],

  /* ---------- Why study here ---------------------------------------- */
  schoolReasons: [
    { title: "Hands-on education", text: "Learn by practicing professional techniques yourself — not only by watching.", confirmed: true },
    { title: "Real techniques", text: "Understand professional application from preparation through the final look.", confirmed: false },
    { title: "Professional guidance", text: "Learn directly from experienced beauty professionals.", confirmed: false },
    { title: "Small-group learning", text: "Confirm maximum class size before publishing this point.", confirmed: false },
    { title: "Portfolio development", text: "Include only if students build a portfolio during the program.", confirmed: false },
    { title: "Career preparation", text: "Describe only specific, verifiable career support.", confirmed: false }
  ],

  /* ---------- Meet Regina ------------------------------------------- */
  regina: {
    // Paragraphs of Regina's own story. Empty until she supplies it.
    story: [],
    quote: "Beauty is more than the final look. It’s the confidence, skill, and artistry behind it.",
    quoteVerified: false, // true once Regina approves (or replaces) the quote
    // e.g. ["Licensed Cosmetologist — State of …"]; verified only.
    credentials: []
  },

  /* ---------- Student work ------------------------------------------
     { src: "", alt: "", studentFirstName: "", course: "", permission: true } */
  studentWork: [],

  /* ---------- Testimonials ------------------------------------------
     Authentic reviews only. { quote: "", name: "", detail: "", source: "Google" } */
  testimonials: { salon: [], school: [] },

  /* ---------- Instagram / social grid -------------------------------
     { src: "", alt: "", url: "" } — link each tile to the real post.   */
  social: [],

  /* ---------- FAQ ----------------------------------------------------
     Questions with an empty answer are hidden after launch.          */
  faq: {
    salon: [
      { q: "How do I book?", a: "@booking" }, // "@booking" = auto answer from links.booking
      { q: "What should I do before my appointment?", a: "" },
      { q: "What is your cancellation policy?", a: "" },
      { q: "Do you offer bridal services?", a: "" },
      { q: "Where are you located?", a: "@address" }
    ],
    school: [
      { q: "Do I need previous makeup experience?", a: "" },
      { q: "What is included in the course?", a: "" },
      { q: "How long is training?", a: "" },
      { q: "Are payment plans available?", a: "" },
      { q: "Do students receive a certificate?", a: "" },
      { q: "What products or tools do I need?", a: "" },
      { q: "How do I enroll?", a: "@enroll" }
    ]
  }
};
