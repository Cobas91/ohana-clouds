/* Ohana Clouds — Interaktion */
(function () {
  "use strict";

  /* ---- Jahr im Footer ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Mobile Navigation ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Öffnungszeiten: heutigen Tag hervorheben ---- */
  var today = new Date().getDay(); // 0 = So
  document.querySelectorAll("[data-day]").forEach(function (row) {
    if (parseInt(row.getAttribute("data-day"), 10) === today) row.classList.add("today");
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Age gate (nur ab 18) ---- */
  var gate = document.getElementById("ageGate");
  if (gate) {
    var KEY = "ohana_age_ok";
    var confirmed = false;
    try { confirmed = localStorage.getItem(KEY) === "1"; } catch (e) {}
    if (!confirmed) {
      gate.hidden = false;
      document.body.style.overflow = "hidden";
      var yes = document.getElementById("ageYes");
      var no = document.getElementById("ageNo");
      var deny = document.getElementById("ageDeny");
      var conf = gate.querySelector(".age-confirm");
      if (yes) yes.addEventListener("click", function () {
        try { localStorage.setItem(KEY, "1"); } catch (e) {}
        gate.hidden = true;
        document.body.style.overflow = "";
      });
      if (no) no.addEventListener("click", function () {
        if (conf) conf.style.display = "none";
        if (deny) deny.style.display = "block";
      });
    }
  }

  /* ---- Helpers ---- */
  function star() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 5.5L20 8l-4.2 3.9L17 18l-5-3-5 3 1.2-6.1L4 8l5.6-.5z"/></svg>';
  }
  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function fmtDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  }
  function photoPlaceholder(label, sub) {
    return '<div class="photo-ph"><div class="ph-inner">' +
      '<div class="ph-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5" fill="currentColor" stroke="none"/><path d="M21 17l-5-5-4 4-2-2-4 4"/></svg></div>' +
      '<span class="ph-label">' + esc(label) + '</span>' +
      (sub ? '<span class="ph-sub">' + esc(sub) + '</span>' : '') +
      '</div></div>';
  }

  /* ---- Bewertungs-Slider (Google) ---- */
  var slider = document.getElementById("reviewsSlider");
  if (slider) {
    fetch("assets/data/reviews.json")
      .then(function (r) { return r.json(); })
      .then(function (items) { buildReviews(slider, items || []); })
      .catch(function () { slider.style.display = "none"; });
  }
  function buildReviews(root, items) {
    if (!items.length) { root.style.display = "none"; return; }
    var track = root.querySelector(".reviews-track");
    var dotsWrap = root.querySelector(".reviews-dots");
    var i = 0, timer;
    track.innerHTML = items.map(function (rv) {
      var stars = ""; for (var s = 0; s < (rv.rating || 5); s++) stars += star();
      return '<div class="review-slide"><div class="review-card">' +
        '<span class="g-mark"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12.2c0-.7-.06-1.4-.18-2.05H12v3.9h5.6a4.8 4.8 0 01-2.08 3.15v2.6h3.36C20.85 18 22 15.4 22 12.2z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.36-2.6c-.93.62-2.12.99-3.26.99-2.5 0-4.62-1.69-5.38-3.96H3.15v2.68A10 10 0 0012 22z"/><path fill="#FBBC05" d="M6.62 13.99A6 6 0 016.3 12c0-.69.12-1.36.32-1.99V7.33H3.15A10 10 0 002 12c0 1.61.39 3.14 1.15 4.67l3.47-2.68z"/><path fill="#EA4335" d="M12 6.05c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.6 9.6 0 0012 2 10 10 0 003.15 7.33l3.47 2.68C7.38 7.74 9.5 6.05 12 6.05z"/></svg> Google-Bewertung</span>' +
        '<span class="stars" aria-hidden="true">' + stars + '</span>' +
        '<blockquote>&bdquo;' + esc(rv.text) + '&ldquo;</blockquote>' +
        '<p class="r-author"><strong>' + esc(rv.author || "Kundin/Kunde") + '</strong>' + (rv.meta ? ' · ' + esc(rv.meta) : '') + '</p>' +
        '</div></div>';
    }).join("");
    dotsWrap.innerHTML = items.map(function (_, idx) {
      return '<button type="button" aria-label="Bewertung ' + (idx + 1) + '"' + (idx === 0 ? ' class="active"' : '') + '></button>';
    }).join("");
    var dots = dotsWrap.querySelectorAll("button");
    function go(n) {
      i = (n + items.length) % items.length;
      track.style.transform = "translateX(-" + (i * 100) + "%)";
      dots.forEach(function (d, idx) { d.classList.toggle("active", idx === i); });
    }
    function next() { go(i + 1); }
    function prev() { go(i - 1); }
    dots.forEach(function (d, idx) { d.addEventListener("click", function () { go(idx); restart(); }); });
    var pn = root.querySelector(".rev-next"), pp = root.querySelector(".rev-prev");
    if (pn) pn.addEventListener("click", function () { next(); restart(); });
    if (pp) pp.addEventListener("click", function () { prev(); restart(); });
    function start() { timer = setInterval(next, 5500); }
    function restart() { clearInterval(timer); start(); }
    if (items.length > 1) start(); else { root.querySelector(".reviews-nav").style.display = "none"; }
    root.addEventListener("mouseenter", function () { clearInterval(timer); });
    root.addEventListener("mouseleave", function () { if (items.length > 1) start(); });
  }

  /* ---- Blog / Aktuelles ---- */
  var newsRoot = document.getElementById("newsList");
  var newsTeaser = document.getElementById("newsTeaser");
  if (newsRoot || newsTeaser) {
    fetch("assets/data/posts.json")
      .then(function (r) { return r.json(); })
      .then(function (posts) {
        posts = (posts || []).slice().sort(function (a, b) {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.date) - new Date(a.date);
        });
        if (newsRoot) renderPosts(newsRoot, posts);
        if (newsTeaser) renderPosts(newsTeaser, posts.slice(0, 2));
      })
      .catch(function () {
        if (newsRoot) newsRoot.innerHTML = '<p class="news-empty">Momentan gibt es keine Neuigkeiten. Schau bald wieder vorbei!</p>';
        if (newsTeaser && newsTeaser.parentElement) newsTeaser.parentElement.style.display = "none";
      });
  }
  function renderPosts(root, posts) {
    if (!posts.length) {
      root.innerHTML = '<p class="news-empty">Momentan gibt es keine Neuigkeiten. Schau bald wieder vorbei!</p>';
      return;
    }
    root.innerHTML = posts.map(function (p) {
      var media = p.image
        ? '<img src="' + esc(p.image) + '" alt="' + esc(p.image_alt || p.title) + '" loading="lazy">'
        : photoPlaceholder("Bild folgt", "wird später ergänzt");
      var pin = p.pinned
        ? '<span class="post-pin"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3l1 1-3 3 3 5-2 2-5-3-4 4-1-1 4-4-3-5 2-2 5 3 3-3z"/></svg> Wichtig</span>'
        : '';
      return '<article class="post-card reveal in">' +
        '<div class="post-media">' + pin + media + '</div>' +
        '<div class="post-body">' +
          '<span class="post-date"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zM5 9h14v10H5V9z"/></svg> ' + fmtDate(p.date) + '</span>' +
          '<h3>' + esc(p.title) + '</h3>' +
          '<p>' + esc(p.body) + '</p>' +
        '</div></article>';
    }).join("");
  }
})();
