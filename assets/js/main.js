/* =====================================================================
   Regina Valenzuela — Salon & Makeup School
   All content comes from window.SITE_CONFIG (assets/js/config.js).
   ===================================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var B = C.business || {};
  var L = C.links || {};
  var PREVIEW = !!C.preview;
  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("js");
  if (reduceMotion) root.classList.add("reduce-motion");
  if (PREVIEW) doc.body.classList.add("is-preview");

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function filled(v) { return typeof v === "string" ? v.trim() !== "" : v != null; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) {
    // Only allow http(s), mailto, tel, sms and relative paths.
    if (!filled(u)) return "";
    var s = String(u).trim();
    if (/^(https?:|mailto:|tel:|sms:)/i.test(s) || /^[\w./#?=&-]+$/.test(s)) return s;
    return "";
  }
  function h(html) { var t = doc.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function draftBadge(text) { return '<span class="draft-badge">' + esc(text || "Draft — confirm before launch") + "</span>"; }
  function visible(items) {
    return (items || []).filter(function (i) { return i && (i.confirmed !== false || PREVIEW); });
  }
  function isExternal(u) { return /^https?:/i.test(u); }

  var addressParts = (function () {
    var a = B.address || {};
    return [a.street, a.city, [a.region, a.postalCode].filter(filled).join(" "), a.country].filter(filled);
  })();
  var addressText = addressParts.join(", ");
  var mapsUrl = addressText ? "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(B.name + " " + B.descriptor + ", " + addressText) : "";

  // Remove a section and every in-page link that points to it.
  function removeSection(id) {
    var s = doc.getElementById(id);
    if (s) s.remove();
    $$('a[href="#' + id + '"]').forEach(function (a) {
      var li = a.closest("li");
      (li || a).remove();
    });
  }

  /* ------------------------------------------------------------------
     Image slots → real photo or abstract art-directed panel
     ------------------------------------------------------------------ */
  function artPanel(tone, shot) {
    return '<div class="art" data-tone="' + esc(tone || "champagne") + '" aria-hidden="true">' +
      '<svg class="art__lines" viewBox="0 0 400 500" preserveAspectRatio="none"><path d="M-20 360 C 80 300, 160 420, 260 330 S 380 250, 430 290" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1"/><path d="M-20 390 C 90 330, 170 450, 270 360 S 390 280, 430 320" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1"/></svg>' +
      (shot ? '<span class="art__cap">' + esc(shot) + "</span>" : "") + "</div>";
  }
  function imgTag(src, alt, eager) {
    return '<img src="' + esc(safeUrl(src)) + '" alt="' + esc(alt || "") + '"' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  }
  function fillSlots() {
    var slots = (C.media && C.media.slots) || {};
    $$("[data-slot]").forEach(function (el) {
      var s = slots[el.getAttribute("data-slot")] || {};
      if (filled(s.src)) el.innerHTML = imgTag(s.src, s.alt);
      else el.innerHTML = artPanel(el.getAttribute("data-tone"), el.getAttribute("data-shot"));
    });
  }

  /* ------------------------------------------------------------------
     Calls to action — never dead
     ------------------------------------------------------------------ */
  var forms = {};
  function openInquiry(kind, interest) {
    selectForm(kind);
    if (interest) {
      var sel = kind === "school" ? $("#c-course") : $("#s-service");
      if (sel) {
        var opt = $$("option", sel).filter(function (o) { return o.value === interest || o.textContent === interest; })[0];
        if (opt) sel.value = opt.value;
      }
    }
    var target = $("#inquire");
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      var first = $((kind === "school" ? "#c-name" : "#s-name"));
      setTimeout(function () { if (first) first.focus({ preventScroll: true }); }, reduceMotion ? 0 : 700);
    }
  }
  function wireCTAs() {
    var booking = safeUrl(L.booking);
    var enroll = safeUrl(L.enrollment);
    $$(".js-book").forEach(function (a) {
      if (booking) {
        a.href = booking;
        if (isExternal(booking)) { a.target = "_blank"; a.rel = "noopener"; }
      } else {
        a.addEventListener("click", function (e) { e.preventDefault(); closeMenu(); openInquiry("salon"); });
      }
    });
    $$(".js-enroll").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); closeMenu(); openInquiry("school"); });
    });
    doc.addEventListener("click", function (e) {
      var t = e.target.closest("[data-inquiry]");
      if (!t) return;
      e.preventDefault();
      openInquiry(t.getAttribute("data-inquiry"), t.getAttribute("data-interest"));
    });
  }

  /* ------------------------------------------------------------------
     Header, nav & mobile menu
     ------------------------------------------------------------------ */
  var header = $("#site-header");
  var menu = $("#mobile-menu");
  var toggle = $("#menu-toggle");
  var lastFocus = null;

  function openMenu() {
    lastFocus = doc.activeElement;
    menu.hidden = false;
    $$(".mobile-menu__list li", menu).forEach(function (li, i) { li.style.setProperty("--i", i); });
    toggle.setAttribute("aria-expanded", "true");
    toggle.querySelector(".visually-hidden").textContent = "Close menu";
    doc.body.classList.add("menu-open");
    doc.body.style.overflow = "hidden";
    header.classList.add("is-solid");
    header.classList.remove("is-hidden");
    var f = $("a", menu); if (f) f.focus();
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.querySelector(".visually-hidden").textContent = "Menu";
    doc.body.classList.remove("menu-open");
    doc.body.style.overflow = "";
    onScroll();
    if (lastFocus && lastFocus === toggle) toggle.focus();
  }
  function wireMenu() {
    toggle.addEventListener("click", function () { menu.hidden ? openMenu() : closeMenu(); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    doc.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") { closeMenu(); toggle.focus(); }
      if (e.key === "Tab") {
        // Trap focus within toggle + menu
        var items = [toggle].concat($$("a, button", menu));
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 1140) closeMenu(); });
  }

  var lastY = 0;
  var dock = $("#dock");
  function onScroll() {
    var y = window.scrollY;
    var menuOpen = menu && !menu.hidden;
    header.classList.toggle("is-solid", y > 40 || menuOpen);
    if (!menuOpen) header.classList.toggle("is-hidden", y > 400 && y > lastY + 4 && !header.contains(doc.activeElement));
    if (y < lastY - 4) header.classList.remove("is-hidden");
    if (dock) {
      var contact = $("#contact");
      var nearContact = contact && contact.getBoundingClientRect().top < window.innerHeight * .6;
      dock.classList.toggle("is-visible", y > window.innerHeight * .8 && !nearContact);
    }
    lastY = y;
  }

  function wireActiveNav() {
    var links = $$(".nav__list a");
    if (!("IntersectionObserver" in window) || !links.length) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (l) { l.removeAttribute("aria-current"); });
          map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = doc.getElementById(id); if (s) io.observe(s); });
  }

  /* ------------------------------------------------------------------
     Hero — cinematic powder, optional video, editorial reel
     ------------------------------------------------------------------ */
  function heroVideo() {
    var v = (C.media && C.media.heroVideo) || {};
    var video = $("#hero-video");
    if (!video || reduceMotion) return;
    var small = window.matchMedia("(max-width: 720px)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    var src = small ? (v.mobile || "") : (v.desktop || v.mobile || "");
    if (!filled(src) || saveData) return;
    if (filled(v.poster)) video.poster = safeUrl(v.poster);
    video.src = safeUrl(src);
    video.hidden = false;
    video.addEventListener("canplay", function () { video.classList.add("is-ready"); $(".hero").classList.add("has-video"); }, { once: true });
    video.play().catch(function () { /* autoplay blocked: powder animation remains */ });
  }

  function powder() {
    var canvas = $("#powder");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W, H, parts = [], running = false, raf;

    function size() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(170, Math.round((W * H) / 8500));
      parts = [];
      for (var i = 0; i < n; i++) parts.push(make(true));
      for (var j = 0; j < 7; j++) parts.push(make(true, true));
    }
    function make(anywhere, bokeh) {
      return {
        x: anywhere ? Math.random() * W : -10,
        y: Math.random() * H,
        r: bokeh ? 8 + Math.random() * 22 : .3 + Math.random() * 1.9,
        vx: .08 + Math.random() * .32,
        vy: -.05 - Math.random() * .22,
        w: Math.random() * Math.PI * 2,
        a: bokeh ? .03 + Math.random() * .05 : .25 + Math.random() * .6,
        bokeh: !!bokeh
      };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var lx = W * .5, ly = H * .3, lr = Math.max(W, H) * .55;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.w += .01; p.x += p.vx + Math.sin(p.w) * .15; p.y += p.vy + Math.cos(p.w * .8) * .08;
        if (p.x > W + 30 || p.y < -30) { parts[i] = make(false, p.bokeh); parts[i].x = Math.random() * W * .6; parts[i].y = H + 10; continue; }
        var d = Math.hypot(p.x - lx, p.y - ly) / lr;
        var glow = Math.max(.12, 1 - d);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255," + (p.a * glow).toFixed(3) + ")";
        ctx.fill();
      }
    }
    function loop() { draw(); raf = requestAnimationFrame(loop); }
    function start() { if (!running && !reduceMotion) { running = true; loop(); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    size(); draw();
    var t; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(function () { size(); draw(); }, 200); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting && !doc.hidden ? start() : stop(); }).observe(canvas);
    } else start();
    doc.addEventListener("visibilitychange", function () { doc.hidden ? stop() : start(); });
  }

  function reel() {
    var el = $("#reel-word");
    if (!el || reduceMotion) return;
    var words = ["Brushes", "Palettes", "Lashes", "Hairstyling", "Instruction", "Practice", "Artistry"];
    var i = 0;
    setInterval(function () {
      el.classList.add("is-out");
      setTimeout(function () { i = (i + 1) % words.length; el.textContent = words[i]; el.classList.remove("is-out"); }, 600);
    }, 2800);
  }

  /* ------------------------------------------------------------------
     Salon services
     ------------------------------------------------------------------ */
  function renderServices() {
    var list = $("#service-list");
    var filters = $("#service-filters");
    var note = $("#services-note");
    var cats = C.serviceCategories || {};
    var items = visible(C.services);
    var select = $("#s-service");

    // Form select
    var opts = ['<option value="">Select a service</option>'];
    items.forEach(function (s) { opts.push('<option value="' + esc(s.name) + '">' + esc(s.name) + "</option>"); });
    if (C.bridalOffered === true || (PREVIEW && C.bridalOffered !== false)) {
      if (!items.some(function (s) { return s.name === "Bridal"; })) opts.push('<option value="Bridal">Bridal inquiry</option>');
    }
    opts.push('<option value="Not sure yet">Not sure yet — I’d like advice</option>');
    select.innerHTML = opts.join("");

    if (!items.length) {
      filters.remove();
      list.remove();
      note.hidden = false;
      note.innerHTML = "Our full service menu is being finalized. <a class='text-link' href='#inquire' data-inquiry='salon'>Send an appointment request</a> and we’ll help you choose.";
      return;
    }

    var used = Object.keys(cats).filter(function (k) { return items.some(function (s) { return s.category === k; }); });
    filters.innerHTML = ['<button type="button" class="chip" data-f="all" aria-pressed="true">All</button>']
      .concat(used.map(function (k) { return '<button type="button" class="chip" data-f="' + esc(k) + '" aria-pressed="false">' + esc(cats[k]) + "</button>"; })).join("");
    if (used.length < 2) filters.remove();

    function draw(f) {
      list.innerHTML = items.filter(function (s) { return f === "all" || s.category === f; }).map(function (s, i) {
        var bookAttr = filled(L.booking)
          ? 'href="' + esc(safeUrl(L.booking)) + '"' + (isExternal(L.booking) ? ' target="_blank" rel="noopener"' : "")
          : 'href="#inquire" data-inquiry="salon" data-interest="' + esc(s.name) + '"';
        return '<article class="service" style="animation-delay:' + (i * 60) + 'ms">' +
          '<span class="service__n">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<h3 class="service__name">' + esc(s.name) + '<span class="service__cat">' + esc(cats[s.category] || "") + "</span></h3>" +
          '<div class="service__desc-wrap"><p class="service__desc">' + esc(s.description) + "</p>" +
            '<p class="service__meta"><span>' + (filled(s.price) ? esc(s.price) : "") + "</span><span>" + (filled(s.duration) ? esc(s.duration) : "") + "</span></p></div>" +
          '<div class="service__side">' + (s.confirmed === false ? draftBadge("Draft — confirm service & price") : "") +
            '<a class="btn btn--small btn--outline" ' + bookAttr + ' aria-label="Book ' + esc(s.name) + '">Book</a></div>' +
          "</article>";
      }).join("");
    }
    draw("all");
    filters.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      $$(".chip", filters).forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
      draw(b.getAttribute("data-f"));
    });
    if (PREVIEW && items.some(function (s) { return s.confirmed === false; })) {
      note.hidden = false;
      note.innerHTML = "<strong>Draft:</strong> the services marked Draft are suggestions. Please confirm which ones you offer and send the price and duration for each. Anything unconfirmed won’t appear on the live site.";
    }
  }

  /* ------------------------------------------------------------------
     Bridal
     ------------------------------------------------------------------ */
  function renderBridal() {
    if (C.bridalOffered === true) return;
    if (C.bridalOffered === false || !PREVIEW) { removeSection("bridal"); return; }
    $("#bridal-draft").hidden = false;
  }

  /* ------------------------------------------------------------------
     Before & after
     ------------------------------------------------------------------ */
  function baSlider(item, demo) {
    var before = demo ? artPanel("nude", "") : imgTag(item.before, "Before: " + (item.alt || item.caption || ""));
    var after = demo ? artPanel("blush", "") : imgTag(item.after, "After: " + (item.alt || item.caption || ""));
    var fig = h('<figure class="reveal"><div class="ba' + (demo ? " ba--demo" : "") + '">' +
      '<div class="ba__img ba__before">' + before + "</div>" +
      '<div class="ba__after-wrap"><div class="ba__img">' + after + "</div></div>" +
      '<span class="ba__label ba__label--before">Before</span><span class="ba__label ba__label--after">After</span>' +
      '<span class="ba__handle" aria-hidden="true"></span>' +
      '<input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Compare before and after' + (item.caption ? ": " + esc(item.caption) : "") + '">' +
      "</div>" + (item.caption || demo ? '<figcaption class="ba__cap">' + (demo ? draftBadge("Demo slider — add genuine client before/after photos") : esc(item.caption)) + "</figcaption>" : "") + "</figure>");
    var ba = $(".ba", fig), range = $(".ba__range", fig);
    function set(v) { ba.style.setProperty("--pos", v + "%"); range.setAttribute("aria-valuetext", v + "% after"); }
    range.addEventListener("input", function () { set(range.value); });
    set(50);
    return fig;
  }
  function renderBeforeAfter() {
    var stage = $("#ba-stage"), filters = $("#ba-filters");
    var items = (C.beforeAfter || []).filter(function (i) { return filled(i.before) && filled(i.after); });
    if (!items.length) {
      if (!PREVIEW) { removeSection("transformations"); return; }
      filters.remove();
      stage.appendChild(baSlider({ caption: "" }, true));
      return;
    }
    var cats = [];
    items.forEach(function (i) { if (i.category && cats.indexOf(i.category) < 0) cats.push(i.category); });
    function draw(f) {
      stage.innerHTML = "";
      items.filter(function (i) { return f === "all" || i.category === f; }).forEach(function (i) {
        var s = baSlider(i); s.classList.add("is-in"); stage.appendChild(s);
      });
    }
    if (cats.length > 1) {
      filters.innerHTML = ['<button type="button" class="chip" data-f="all" aria-pressed="true">All</button>']
        .concat(cats.map(function (c) { return '<button type="button" class="chip" data-f="' + esc(c) + '" aria-pressed="false">' + esc(c) + "</button>"; })).join("");
      filters.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b) return;
        $$(".chip", filters).forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
        draw(b.getAttribute("data-f"));
      });
    } else filters.remove();
    draw("all");
  }

  /* ------------------------------------------------------------------
     Portfolio
     ------------------------------------------------------------------ */
  var PF_LABELS = { makeup: "Makeup", hair: "Hair", bridal: "Bridal", editorial: "Editorial", transformations: "Transformations" };
  function renderPortfolio() {
    var grid = $("#portfolio-grid"), filters = $("#portfolio-filters");
    var items = (C.portfolio || []).filter(function (i) { return filled(i.src); });
    var demo = false;
    if (!items.length) {
      if (!PREVIEW) { removeSection("portfolio"); return; }
      demo = true;
      var shapes = ["tall", "wide", "square", "square", "wide", "tall", "square", "square"];
      var tones = ["champagne", "blush", "nude", "espresso", "nude", "champagne", "blush", "nude"];
      var cats = ["makeup", "bridal", "hair", "editorial", "makeup", "transformations", "bridal", "hair"];
      items = shapes.map(function (s, i) { return { shape: s, tone: tones[i], category: cats[i], caption: PF_LABELS[cats[i]] + " — Regina’s work" }; });
    }
    var used = Object.keys(PF_LABELS).filter(function (k) { return items.some(function (i) { return i.category === k; }); });
    if (used.length > 1) {
      filters.innerHTML = ['<button type="button" class="chip" data-f="all" aria-pressed="true">All</button>']
        .concat(used.map(function (k) { return '<button type="button" class="chip" data-f="' + k + '" aria-pressed="false">' + PF_LABELS[k] + "</button>"; })).join("");
    } else filters.remove();

    function draw(f) {
      grid.innerHTML = items.filter(function (i) { return f === "all" || i.category === f; }).map(function (i, n) {
        var shape = ["tall", "wide", "square"].indexOf(i.shape) > -1 ? i.shape : "square";
        var inner = demo
          ? artPanel(i.tone, i.caption)
          : '<button type="button" class="pf__btn" data-lightbox="' + esc(safeUrl(i.src)) + '" data-cap="' + esc(i.caption || i.alt || "") + '" aria-label="View larger: ' + esc(i.alt || i.caption || "portfolio image") + '">' + imgTag(i.src, i.alt) + "</button>";
        return '<figure class="pf pf--' + shape + '" style="animation-delay:' + (n * 70) + 'ms">' + inner +
          (!demo && (i.caption || PF_LABELS[i.category]) ? "<figcaption>" + esc(i.caption || PF_LABELS[i.category]) + "</figcaption>" : "") + "</figure>";
      }).join("");
    }
    draw("all");
    if (filters.isConnected) filters.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      $$(".chip", filters).forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
      draw(b.getAttribute("data-f"));
    });
  }

  /* ------------------------------------------------------------------
     Courses
     ------------------------------------------------------------------ */
  var DETAIL_LABELS = [["duration", "Duration"], ["schedule", "Schedule"], ["tuition", "Tuition"], ["requirements", "Requirements"], ["materials", "Materials / kit"], ["certification", "Certification"]];
  function renderCourses() {
    var tabs = $("#course-tabs"), panels = $("#course-panels"), note = $("#courses-note");
    var items = visible(C.courses);
    var select = $("#c-course");
    select.innerHTML = ['<option value="">Select a course</option>']
      .concat(items.map(function (c) { return '<option value="' + esc(c.name) + '">' + esc(c.name) + "</option>"; }))
      .concat(['<option value="General information">General school information</option>']).join("");

    if (!items.length) {
      tabs.remove(); panels.remove();
      note.hidden = false;
      note.innerHTML = "Course details are being finalized. <a class='text-link' href='#inquire' data-inquiry='school'>Request school information</a> to be the first to hear about upcoming programs.";
      return;
    }

    tabs.innerHTML = items.map(function (c, i) {
      return '<button class="course-tab" role="tab" id="ctab-' + esc(c.id) + '" aria-controls="cpanel-' + esc(c.id) + '" aria-selected="' + (i === 0) + '"' + (i ? ' tabindex="-1"' : "") + ">" + esc(c.name) + "</button>";
    }).join("");
    if (items.length < 2) tabs.hidden = true;

    panels.innerHTML = items.map(function (c, i) {
      var d = c.details || {};
      var rows = DETAIL_LABELS.map(function (p) {
        var v = d[p[0]];
        if (!filled(v) && !PREVIEW) return "";
        return "<div><dt>" + p[1] + "</dt><dd>" + (filled(v) ? esc(v) : '<span class="tbc">To be confirmed</span>') + "</dd></div>";
      }).join("");
      var enroll = safeUrl(L.enrollment);
      return '<div class="course" role="tabpanel" id="cpanel-' + esc(c.id) + '" aria-labelledby="ctab-' + esc(c.id) + '" tabindex="0"' + (i ? " hidden" : "") + ">" +
        "<div>" +
          '<p class="course__num">Program ' + String(i + 1).padStart(2, "0") + "</p>" +
          '<h3 class="course__name">' + esc(c.name) + "</h3>" +
          (c.confirmed === false ? '<p style="margin:-6px 0 20px">' + draftBadge("Draft — replace with a real course") + "</p>" : "") +
          '<p class="course__overview">' + esc(c.overview) + "</p>" +
          (c.learn && c.learn.length ? '<h4 class="course__h">What you’ll learn</h4><ul class="course__learn">' + c.learn.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" : "") +
        "</div>" +
        '<div class="course__card">' +
          '<h4 class="course__h">Course details</h4>' +
          (rows ? '<dl class="course__details">' + rows + "</dl>" : "") +
          '<div class="course__actions">' +
            (enroll ? '<a class="btn btn--dark" href="' + esc(enroll) + '"' + (isExternal(enroll) ? ' target="_blank" rel="noopener"' : "") + ">Enroll / Apply</a>" : "") +
            '<a class="btn ' + (enroll ? "btn--outline" : "btn--dark") + '" href="#inquire" data-inquiry="school" data-interest="' + esc(c.name) + '">' + (enroll ? "Request Information" : "Enroll / Request Information") + "</a>" +
          "</div>" +
        "</div></div>";
    }).join("");
    wireTablist(tabs);
    if (PREVIEW && items.some(function (c) { return c.confirmed === false; })) {
      note.hidden = false;
      note.innerHTML = "<strong>Draft:</strong> these cards show the course layout only. Please send each program’s name and overview, plus its duration, schedule, tuition, requirements, kit and certification where they apply.";
    }
  }

  /* ------------------------------------------------------------------
     Why study here, Regina, student work, testimonials, social
     ------------------------------------------------------------------ */
  function renderWhy() {
    var items = visible(C.schoolReasons);
    if (!items.length) { removeSection("why"); return; }
    $("#why-list").innerHTML = items.map(function (r, i) {
      return '<li class="why__item reveal" style="--rd:' + (i % 3) * .12 + 's"><h3 class="why__title">' + esc(r.title) + '</h3><p class="why__text">' + esc(r.text) + "</p>" +
        (r.confirmed === false ? draftBadge("Draft — include only if accurate") : "") + "</li>";
    }).join("");
  }

  function renderRegina() {
    var R = C.regina || {};
    var story = $("#regina-story");
    if (R.story && R.story.length) {
      story.innerHTML = R.story.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    } else if (PREVIEW) {
      story.innerHTML = '<div class="note"><strong>Regina’s story goes here — in her own words.</strong> Add a few short paragraphs covering:<ul>' +
        ["Her beauty journey and experience", "Her philosophy", "Why she created the salon", "Why she teaches makeup", "How she approaches clients and students", "Verified achievements and credentials"]
          .map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>";
    } else {
      story.innerHTML = "<p>Founder of Regina Valenzuela Salon &amp; Makeup School.</p>";
    }
    if (R.credentials && R.credentials.length) {
      var cl = $("#regina-credentials");
      cl.innerHTML = R.credentials.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
      cl.hidden = false;
    }
    if (filled(R.quote) && (R.quoteVerified || PREVIEW)) {
      $("#regina-quote-text").textContent = R.quote;
      if (!R.quoteVerified) $("#quote-draft").hidden = false;
    } else $("#regina-quote").remove();
  }

  function emptyState(title, text, cta) {
    return '<div class="empty"><p class="empty__title">' + title + "</p><p>" + text + "</p>" + (cta || "") + draftBadge("Preview only — hidden at launch until content is added") + "</div>";
  }

  function renderStudentWork() {
    var items = (C.studentWork || []).filter(function (i) { return filled(i.src) && i.permission !== false; });
    var grid = $("#student-grid");
    if (!items.length) {
      if (!PREVIEW) { removeSection("student-work"); return; }
      grid.outerHTML = emptyState("Student work coming soon", "Add real student looks — with each student’s permission — including first name and course if they agree. AI-generated or stock images must never appear here.");
      return;
    }
    grid.innerHTML = items.map(function (i) {
      return '<figure class="pf reveal"><button type="button" class="pf__btn" data-lightbox="' + esc(safeUrl(i.src)) + '" data-cap="' + esc([i.studentFirstName, i.course].filter(filled).join(" — ")) + '" aria-label="View larger: ' + esc(i.alt) + '">' + imgTag(i.src, i.alt) + "</button>" +
        (filled(i.studentFirstName) || filled(i.course) ? "<figcaption>" + (filled(i.studentFirstName) ? "<strong>" + esc(i.studentFirstName) + "</strong>" : "") + esc(i.course || "") + "</figcaption>" : "") + "</figure>";
    }).join("");
  }

  function renderReviews() {
    var T = C.testimonials || {};
    var salon = T.salon || [], school = T.school || [];
    if (!salon.length && !school.length && !PREVIEW) { removeSection("reviews"); return; }
    function fill(id, list, who) {
      var p = $("#" + id);
      if (!list.length) {
        p.innerHTML = emptyState("Reviews from " + who + " will appear here", "Only authentic reviews are published — copied from Google, Facebook or written feedback, with the reviewer’s permission to show their name.");
        return;
      }
      p.innerHTML = '<div class="review-list">' + list.map(function (r) {
        return '<figure class="review"><blockquote><p>' + esc(r.quote) + "</p></blockquote><figcaption>" + esc(r.name || "Verified client") +
          (filled(r.detail) || filled(r.source) ? "<span>" + esc([r.detail, r.source ? "via " + r.source : ""].filter(filled).join(" · ")) + "</span>" : "") + "</figcaption></figure>";
      }).join("") + "</div>";
    }
    fill("rev-salon", salon, "salon clients");
    fill("rev-school", school, "makeup students");
    if (!PREVIEW) {
      // Show only categories that have reviews.
      if (!salon.length || !school.length) {
        $("#reviews .tabs").remove();
        var show = salon.length ? "rev-salon" : "rev-school";
        $("#rev-salon").hidden = show !== "rev-salon";
        $("#rev-school").hidden = show !== "rev-school";
      }
    }
  }

  function renderSocial() {
    var tiles = (C.social || []).filter(function (s) { return filled(s.src); });
    var follow = $("#social-follow");
    var ig = safeUrl(L.instagram);
    if (ig) {
      follow.href = ig;
      follow.textContent = filled(L.instagramHandle) ? "@" + L.instagramHandle : "Follow on Instagram";
    } else {
      follow.remove();
    }
    var grid = $("#social-grid");
    if (!tiles.length) {
      if (!PREVIEW && !ig) { removeSection("social"); return; }
      if (!PREVIEW) { grid.remove(); return; }
      grid.outerHTML = emptyState("Instagram feed", "Add the official Instagram link and a handful of recent posts (image + post link) — or connect a feed service. Tiles link back to the real posts.");
      return;
    }
    grid.innerHTML = tiles.slice(0, 12).map(function (s) {
      var href = safeUrl(s.url) || ig;
      return '<a class="social__tile" href="' + esc(href) + '" target="_blank" rel="noopener" aria-label="' + esc(s.alt || "Instagram post") + ' (opens Instagram)">' + imgTag(s.src, s.alt) + "</a>";
    }).join("");
  }

  /* ------------------------------------------------------------------
     FAQ
     ------------------------------------------------------------------ */
  function faqAnswer(a) {
    if (a === "@booking") {
      if (filled(L.booking)) return "Book online anytime using the “Book Appointment” button — you’ll be taken to our booking page to choose your service and time.";
      return "Use the “Book Appointment” button to send an appointment request with your preferred service and date. We’ll contact you to confirm." + (filled(B.phone) ? " You can also call us at " + (B.phoneDisplay || B.phone) + "." : "");
    }
    if (a === "@enroll") {
      if (filled(L.enrollment)) return "Apply online using the “Enroll / Apply” button on any course, or send a student inquiry and we’ll guide you through the next steps.";
      return "Send a student inquiry using the form on this page and we’ll reply with enrollment details and next steps.";
    }
    if (a === "@address") return addressText ? "You’ll find us at " + addressText + ". Use “Get Directions” in the contact section for turn-by-turn directions." : "";
    return a || "";
  }
  function renderFaq() {
    ["salon", "school"].forEach(function (k) {
      var panel = $("#faq-" + k);
      var items = ((C.faq || {})[k] || []).map(function (f) { return { q: f.q, a: faqAnswer(f.a) }; })
        .filter(function (f) { return filled(f.a) || PREVIEW; });
      if (!items.length) { panel.innerHTML = "<p class='section-sub'>Questions? <a class='text-link' href='#inquire' data-inquiry='" + k + "'>Send us a message</a>.</p>"; return; }
      panel.innerHTML = items.map(function (f, i) {
        var id = "faq-" + k + "-" + i;
        return '<div class="faq__item"><h3><button type="button" class="faq__q" aria-expanded="false" aria-controls="' + id + '">' + esc(f.q) + '<span class="faq__icon" aria-hidden="true"></span></button></h3>' +
          '<div class="faq__a" id="' + id + '" role="region" aria-label="' + esc(f.q) + '"><div><p>' + (filled(f.a) ? esc(f.a) : draftBadge("Answer to be confirmed by the business")) + "</p></div></div></div>";
      }).join("");
    });
    doc.addEventListener("click", function (e) {
      var q = e.target.closest(".faq__q"); if (!q) return;
      q.setAttribute("aria-expanded", String(q.getAttribute("aria-expanded") !== "true"));
    });
  }

  /* ------------------------------------------------------------------
     Contact details, map, social
     ------------------------------------------------------------------ */
  function renderContact() {
    var actions = [], rows = [];
    var tel = filled(B.phone) ? "tel:" + B.phone.replace(/[^\d+]/g, "") : "";
    if (tel) actions.push('<a class="btn btn--gold" href="' + tel + '">Call Now</a>');
    if (filled(B.whatsapp)) actions.push('<a class="btn btn--outline-light" href="https://wa.me/' + esc(B.whatsapp.replace(/\D/g, "")) + '" target="_blank" rel="noopener">Message Us</a>');
    else if (filled(B.sms)) actions.push('<a class="btn btn--outline-light" href="sms:' + esc(B.sms.replace(/[^\d+]/g, "")) + '">Message Us</a>');
    else actions.push('<a class="btn btn--outline-light" href="#inquire" id="message-us">Message Us</a>');
    if (mapsUrl) actions.push('<a class="btn btn--outline-light" href="' + esc(mapsUrl) + '" target="_blank" rel="noopener">Get Directions</a>');
    if (filled(B.email)) actions.push('<a class="btn btn--outline-light" href="mailto:' + esc(B.email) + '">Email Us</a>');
    $("#contact-actions").innerHTML = actions.join("");
    var mu = $("#message-us");
    if (mu) mu.addEventListener("click", function (e) {
      e.preventDefault();
      var current = $("#form-school").hidden ? "salon" : "school";
      openInquiry(current);
    });

    function row(label, val, draftLabel) {
      if (filled(val)) return "<div><dt>" + label + "</dt><dd>" + val + "</dd></div>";
      if (PREVIEW) return "<div><dt>" + label + '</dt><dd><span class="tbc">' + (draftLabel || "To be added") + "</span></dd></div>";
      return "";
    }
    rows.push(row("Phone", tel ? '<a href="' + tel + '">' + esc(B.phoneDisplay || B.phone) + "</a>" : ""));
    rows.push(row("Email", filled(B.email) ? '<a href="mailto:' + esc(B.email) + '">' + esc(B.email) + "</a>" : ""));
    rows.push(row("Studio", addressText ? esc(addressText) + (mapsUrl ? '<br><a href="' + esc(mapsUrl) + '" target="_blank" rel="noopener">Get directions →</a>' : "") : ""));
    rows.push(row("Hours", (B.hours || []).length ? '<div class="hours">' + B.hours.map(function (x) { return "<div><span>" + esc(x.days) + "</span><span>" + esc(x.time) + "</span></div>"; }).join("") + "</div>" : ""));
    var socials = socialLinks();
    rows.push(row("Social", socials.length ? socials.map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>"; }).join(" · ") : ""));
    $("#contact-list").innerHTML = rows.join("");

    var map = $("#map");
    if (addressText) {
      // Load the embedded map only on request: faster pages, no third-party tracking until asked.
      map.innerHTML = '<div class="map__load"><button type="button" class="btn btn--outline-light">Show Map</button></div>';
      $("button", map).addEventListener("click", function () {
        map.innerHTML = '<iframe title="Map showing Regina Valenzuela Salon & Makeup School" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + encodeURIComponent(addressText) + '&output=embed"></iframe>';
      });
    } else if (PREVIEW) {
      map.innerHTML = '<p class="map__empty">Map appears here once the studio address is added.</p>';
    } else map.remove();

    var fs = $("#footer-social");
    fs.innerHTML = socials.length
      ? socials.map(function (s) { return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a></li>"; }).join("")
      : '<li><a href="#contact">Contact us</a></li>';
  }
  function socialLinks() {
    return [["instagram", "Instagram"], ["facebook", "Facebook"], ["tiktok", "TikTok"], ["youtube", "YouTube"]]
      .filter(function (s) { return safeUrl(L[s[0]]); })
      .map(function (s) { return { url: safeUrl(L[s[0]]), label: s[1] }; });
  }

  /* ------------------------------------------------------------------
     Forms — validation, submission, success/error states
     ------------------------------------------------------------------ */
  function selectForm(kind) {
    $$(".choose__card").forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-choose") === kind)); });
    $("#form-salon").hidden = kind !== "salon";
    $("#form-school").hidden = kind !== "school";
  }
  function wireChoose() {
    $$(".choose__card").forEach(function (c) {
      c.addEventListener("click", function () {
        var kind = c.getAttribute("data-choose");
        selectForm(kind);
        if (kind === "salon" && filled(L.booking)) {
          // A real booking system exists: the form stays as a fallback for questions.
          $("#salon-form-intro").innerHTML = 'Prefer to choose your own time? <a class="text-link" href="' + esc(safeUrl(L.booking)) + '" target="_blank" rel="noopener">Book online</a>. Or send a request below.';
        }
      });
    });
    if (filled(L.booking)) {
      $("#salon-form-intro").innerHTML = 'Prefer to choose your own time? <a class="text-link" href="' + esc(safeUrl(L.booking)) + '" target="_blank" rel="noopener">Book online</a>. Or send a request below and we’ll confirm with you.';
    }
    if (filled(L.enrollment)) {
      $("#school-form-intro").innerHTML = 'Ready to enroll? <a class="text-link" href="' + esc(safeUrl(L.enrollment)) + '" target="_blank" rel="noopener">Apply online</a>. Or ask us anything below.';
    }
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validate(form) {
    var errors = [];
    function setErr(input, msg) {
      var err = doc.getElementById(input.id + "-err");
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) { err.textContent = msg || ""; if (msg) input.setAttribute("aria-describedby", err.id); else input.removeAttribute("aria-describedby"); }
      if (msg) errors.push(input);
    }
    $$("input, select, textarea", form).forEach(function (input) {
      if (!input.id || input.closest(".hp") || input.type === "radio") return;
      var v = input.type === "checkbox" ? input.checked : input.value.trim();
      var msg = "";
      if (input.required && !v) {
        msg = input.type === "checkbox" ? "Please confirm so we can reply to you." :
          input.tagName === "SELECT" ? "Please choose an option." : "This field is required.";
      } else if (input.type === "email" && v && !EMAIL_RE.test(v)) msg = "Please enter a valid email address.";
      else if (input.type === "tel" && v && v.replace(/\D/g, "").length < 7) msg = "Please enter a valid phone number.";
      else if (input.type === "date" && v) {
        var today = new Date(); today.setHours(0, 0, 0, 0);
        if (new Date(v + "T00:00:00") < today) msg = "Please choose a date in the future.";
      } else if (input.name === "name" && v && v.length < 2) msg = "Please enter your full name.";
      setErr(input, msg);
    });
    return errors;
  }

  function status(form, type, title, text) {
    var s = $(".form__status", form);
    s.className = "form__status is-" + type;
    s.innerHTML = "<strong>" + esc(title) + "</strong>" + text;
  }

  function wireForms() {
    var today = new Date();
    var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    var d = $("#s-date"); if (d) d.min = iso;

    $$("form[data-form]").forEach(function (form) {
      forms[form.getAttribute("data-form")] = form;
      form.addEventListener("input", function (e) {
        var t = e.target;
        if (t.getAttribute("aria-invalid") === "true") {
          t.setAttribute("aria-invalid", "false");
          var err = doc.getElementById(t.id + "-err"); if (err) err.textContent = "";
        }
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var kind = form.getAttribute("data-form");
        var errors = validate(form);
        if (errors.length) {
          status(form, "error", "Please check the highlighted fields.", "");
          errors[0].focus();
          return;
        }
        // Honeypot: silently accept bots without sending.
        if ($(".hp input", form).value) { form.reset(); status(form, "success", "Thank you.", "We’ve received your message."); return; }

        var data = {};
        new FormData(form).forEach(function (v, k) { if (k !== "company") data[k] = v; });
        data.consent = !!data.consent;
        data.inquiryType = kind === "salon" ? "Salon appointment request" : "Makeup school inquiry";
        data._subject = (kind === "salon" ? "Appointment request" : "Makeup school inquiry") + " — " + data.name;

        var btn = $('button[type="submit"]', form);
        var endpoint = safeUrl(L.formEndpoint);
        var contactFallback = [filled(B.phone) ? '<a class="text-link" href="tel:' + esc(B.phone.replace(/[^\d+]/g, "")) + '">' + esc(B.phoneDisplay || B.phone) + "</a>" : "",
          filled(B.email) ? '<a class="text-link" href="mailto:' + esc(B.email) + '">' + esc(B.email) + "</a>" : ""].filter(filled).join(" or ");

        if (endpoint) {
          btn.setAttribute("aria-busy", "true");
          var original = btn.textContent; btn.textContent = "Sending…";
          fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
            .then(function (r) { if (!r.ok) throw new Error(r.status); })
            .then(function () {
              form.reset();
              status(form, "success", "Thank you, " + data.name.split(" ")[0] + ".",
                kind === "salon" ? "Your request has been sent. We’ll be in touch to confirm your appointment." : "Your inquiry has been sent. We’ll reply with course information soon.");
            })
            .catch(function () {
              status(form, "error", "Your message couldn’t be sent.", "Please try again in a moment" + (contactFallback ? ", or reach us directly at " + contactFallback : "") + ".");
            })
            .then(function () { btn.removeAttribute("aria-busy"); btn.textContent = original; });
          return;
        }

        if (filled(B.email)) {
          var lines = Object.keys(data).filter(function (k) { return k.charAt(0) !== "_" && k !== "consent"; })
            .map(function (k) { return k.replace(/([A-Z])/g, " $1").replace(/^./, function (c) { return c.toUpperCase(); }) + ": " + data[k]; });
          window.location.href = "mailto:" + B.email + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(lines.join("\n"));
          status(form, "info", "Almost done.", "Your email app should open with your message ready — just press send. If it didn’t open, email us at " + contactFallback + ".");
          return;
        }

        if (PREVIEW) {
          status(form, "info", "Draft preview: nothing was sent.", "The form checked your entries correctly. Once the site is connected, requests like this will arrive in your inbox.");
        } else {
          status(form, "error", "Online messages are unavailable right now.", contactFallback ? "Please reach us at " + contactFallback + "." : "Please try again later.");
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Accessible tabs (roving tabindex, arrow keys)
     ------------------------------------------------------------------ */
  function wireTablist(list) {
    var tabs = $$('[role="tab"]', list);
    function activate(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var p = doc.getElementById(t.getAttribute("aria-controls"));
        if (p) {
          p.hidden = !on;
          if (on) $$(".reveal, li", p).forEach(function (el) { el.classList.add("is-in"); });
        }
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { activate(t); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") n = tabs[0];
        if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); activate(n, true); }
      });
    });
  }

  /* ------------------------------------------------------------------
     Motion: reveals, school transition, parallax
     ------------------------------------------------------------------ */
  function wireReveals() {
    var els = $$(".reveal, .reveal-mask, .steps li");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    els.forEach(function (e) { io.observe(e); });
    // Stagger step words
    $$(".steps").forEach(function (list) { $$("li", list).forEach(function (li, i) { li.style.transitionDelay = i * 90 + "ms"; $(".steps__word", li).style.transitionDelay = i * 120 + "ms"; }); });
  }

  function wireSchoolTransition() {
    var sec = $(".school-transition");
    var path = $("#stroke-path");
    if (!sec || !path) return;
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    if (reduceMotion) { path.style.strokeDashoffset = 0; return; }
    path.style.strokeDashoffset = len;
    var ticking = false;
    function update() {
      ticking = false;
      var r = sec.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / (total || 1)));
      sec.style.setProperty("--p", p.toFixed(3));
      path.style.strokeDashoffset = (len * (1 - Math.min(1, p * 1.7))).toFixed(1);
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------ */
  function wireDialogs() {
    var lb = $("#lightbox");
    doc.addEventListener("click", function (e) {
      var t = e.target.closest("[data-lightbox]");
      if (t && lb && lb.showModal) {
        $("#lightbox-img").src = t.getAttribute("data-lightbox");
        $("#lightbox-img").alt = ($("img", t) || {}).alt || "";
        $("#lightbox-cap").textContent = t.getAttribute("data-cap") || "";
        lb.showModal();
      }
      var c = e.target.closest("[data-close]");
      if (c) c.closest("dialog").close();
    });
    $$("dialog").forEach(function (d) {
      d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    });
  }

  /* ------------------------------------------------------------------
     SEO — local business, school and course structured data
     ------------------------------------------------------------------ */
  function seo() {
    var a = B.address || {};
    var city = a.city;
    if (filled(city)) {
      doc.title = "Regina Valenzuela Salon & Makeup School | " + city + " Beauty Salon & Makeup Classes";
      var md = $('meta[name="description"]');
      md.setAttribute("content", "Regina Valenzuela Salon & Makeup School in " + city + (filled(a.region) ? ", " + a.region : "") + " — professional beauty services and hands-on makeup education. Book an appointment or explore makeup courses.");
    }
    if (filled(B.url)) {
      var link = doc.createElement("link"); link.rel = "canonical"; link.href = B.url; doc.head.appendChild(link);
      var og = doc.createElement("meta"); og.setAttribute("property", "og:url"); og.content = B.url; doc.head.appendChild(og);
    }
    function clean(o) {
      Object.keys(o).forEach(function (k) {
        var v = o[k];
        if (v == null || v === "" || (Array.isArray(v) && !v.length)) delete o[k];
        else if (typeof v === "object" && !Array.isArray(v)) { clean(v); if (Object.keys(v).length <= 1 && v["@type"]) delete o[k]; }
      });
      return o;
    }
    var address = { "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.city, addressRegion: a.region, postalCode: a.postalCode, addressCountry: a.country };
    var sameAs = socialLinks().map(function (s) { return s.url; });
    var base = B.url || undefined;
    var salonId = (base || "") + "#salon", schoolId = (base || "") + "#school";
    var graph = [];
    var services = (C.services || []).filter(function (s) { return s.confirmed !== false; });
    graph.push(clean({
      "@type": "BeautySalon", "@id": salonId, name: "Regina Valenzuela Salon", url: base,
      telephone: B.phone, email: B.email, address: address, sameAs: sameAs,
      image: filled(B.url) ? B.url.replace(/\/$/, "") + "/assets/img/og-image.png" : undefined,
      openingHours: (B.hours || []).map(function (x) { return x.schema; }).filter(filled),
      hasOfferCatalog: services.length ? { "@type": "OfferCatalog", name: "Salon services", itemListElement: services.map(function (s) {
        return clean({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, description: s.description }, priceSpecification: s.priceValue ? { "@type": "PriceSpecification", price: s.priceValue, priceCurrency: s.currency } : undefined });
      }) } : undefined
    }));
    graph.push(clean({
      "@type": "EducationalOrganization", "@id": schoolId, name: "Regina Valenzuela Makeup School", url: base,
      telephone: B.phone, email: B.email, address: address, sameAs: sameAs
    }));
    (C.courses || []).filter(function (c) { return c.confirmed !== false; }).forEach(function (c) {
      graph.push(clean({ "@type": "Course", name: c.name, description: c.overview, provider: { "@id": schoolId, "@type": "EducationalOrganization", name: "Regina Valenzuela Makeup School" } }));
    });
    var s = doc.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    doc.head.appendChild(s);
  }

  /* ------------------------------------------------------------------
     Preview launch checklist
     ------------------------------------------------------------------ */
  function checklist() {
    if (!PREVIEW) return;
    var a = B.address || {};
    var items = [];
    function need(ok, title, where) { if (!ok) items.push([title, where]); }
    need(filled(B.phone), "Phone number", "business.phone / phoneDisplay");
    need(filled(B.email), "Email address", "business.email");
    need(filled(a.street) && filled(a.city), "Studio address (enables map, directions & local SEO)", "business.address");
    need((B.hours || []).length, "Business hours", "business.hours");
    need(filled(B.url), "Website domain (canonical URL & social previews)", "business.url");
    need(filled(L.booking), "Online booking link — until then, ‘Book’ opens the request form", "links.booking");
    need(filled(L.formEndpoint), "Form delivery endpoint — forms fall back to email if only an address is set", "links.formEndpoint");
    need(filled(L.instagram), "Instagram and other social profiles", "links.instagram / facebook / tiktok");
    need((C.services || []).some(function (s) { return s.confirmed !== false; }), "Confirmed services with prices and durations", "services[] → confirmed: true");
    need(C.bridalOffered !== null, "Whether bridal services are offered", "bridalOffered: true / false");
    need((C.courses || []).some(function (c) { return c.confirmed !== false; }), "Real course names and verified details", "courses[]");
    need((C.regina || {}).story && C.regina.story.length, "Regina’s story in her own words", "regina.story");
    need((C.regina || {}).quoteVerified, "Regina’s approved quote", "regina.quote / quoteVerified");
    need((C.schoolReasons || []).every(function (r) { return r.confirmed !== false; }), "Verify each ‘Why study here’ point", "schoolReasons[]");
    var slots = (C.media && C.media.slots) || {};
    need(Object.keys(slots).every(function (k) { return filled(slots[k].src); }), "Professional photography for every image slot", "media.slots");
    need((C.portfolio || []).length, "Portfolio images", "portfolio[]");
    need((C.beforeAfter || []).length, "Genuine before/after pairs (with client consent)", "beforeAfter[]");
    need((C.studentWork || []).length, "Student work (with permission)", "studentWork[]");
    need(((C.testimonials || {}).salon || []).length + ((C.testimonials || {}).school || []).length, "Authentic reviews", "testimonials");
    need(["salon", "school"].every(function (k) { return ((C.faq || {})[k] || []).every(function (f) { return filled(faqAnswer(f.a)); }); }), "FAQ answers", "faq");
    items.push(["Legal review of Privacy Policy & Terms", "privacy.html / terms.html"]);
    items.push(["Final approval to go live", "top of config.js → preview: false"]);

    var bar = $("#preview-bar");
    bar.hidden = false;
    $("#preview-count").textContent = (items.length - 1) + " details needed from you before launch.";
    $("#preview-open").textContent = "What we need (" + (items.length - 1) + ")";
    $("#checklist-list").innerHTML = items.map(function (i) { return "<li><strong>" + esc(i[0]) + "</strong><span>" + esc(i[1]) + "</span></li>"; }).join("");
    $("#preview-open").addEventListener("click", function () { $("#checklist").showModal(); });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function boot() {
    var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
    fillSlots();
    renderServices();
    renderBridal();
    renderBeforeAfter();
    renderPortfolio();
    renderCourses();
    renderWhy();
    renderRegina();
    renderStudentWork();
    renderReviews();
    renderSocial();
    renderFaq();
    renderContact();
    wireMenu();
    wireCTAs();
    wireChoose();
    wireForms();
    $$('[role="tablist"]').forEach(function (l) { if (l.id !== "course-tabs") wireTablist(l); });
    wireDialogs();
    wireReveals();
    wireSchoolTransition();
    wireActiveNav();
    heroVideo();
    powder();
    reel();
    seo();
    checklist();
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
