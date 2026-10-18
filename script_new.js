/* ============================================================
   G.S. Karambi - site behaviour
   Powers: hero slider, mobile menu, gallery lightbox and
   active-link highlighting. No external libraries.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile navigation toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close the menu after choosing a link (mobile)
    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Hero slider ---------- */
  var slider = document.querySelector(".slider");
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".slide"));
    var dotsWrap = slider.querySelector(".dots");
    var prevBtn = slider.querySelector(".prev");
    var nextBtn = slider.querySelector(".next");
    var current = 0;
    var timer = null;
    var DELAY = 6000;

    // Build a dot per slide
    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.className = "dot" + (i === 0 ? " active" : "");
      b.type = "button";
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("active", i === current); });
      dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function start() { timer = setInterval(next, DELAY); }
    function restart() { clearInterval(timer); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    // Pause on hover so readers can finish reading a slide
    slider.addEventListener("mouseenter", function () { clearInterval(timer); });
    slider.addEventListener("mouseleave", start);

    // Pause when the slider isn't visible (saves battery on mobile)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { restart(); } else { clearInterval(timer); }
        });
      }, { threshold: 0.3 }).observe(slider);
    } else {
      start();
    }
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".close");
    var prevB = lightbox.querySelector(".lb-prev");
    var nextB = lightbox.querySelector(".lb-next");
    var sources = [];
    var lbIndex = 0;

    // Collect every gallery thumbnail on the page
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    sources = triggers.map(function (btn) {
      var img = btn.querySelector("img");
      return { src: img.getAttribute("src"), alt: img.getAttribute("alt") || "" };
    });

    function show(i) {
      lbIndex = (i + sources.length) % sources.length;
      lbImg.src = sources[lbIndex].src;
      lbImg.alt = sources[lbIndex].alt;
    }
    function open(i) {
      show(i);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    }
    function close() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    }

    triggers.forEach(function (btn, i) {
      btn.addEventListener("click", function () { open(i); });
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (prevB) prevB.addEventListener("click", function () { show(lbIndex - 1); });
    if (nextB) nextB.addEventListener("click", function () { show(lbIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(lbIndex - 1);
      if (e.key === "ArrowRight") show(lbIndex + 1);
    });
  }

  /* ---------- Highlight the current page in the menu ---------- */
  var here = location.pathname.split("/").pop().toLowerCase();
  if (here === "" || here === "index.html") here = "index.html";
  document.querySelectorAll(".main-nav a").forEach(function (a) {
    var target = a.getAttribute("href").split("/").pop().split("#")[0].toLowerCase();
    if (target === here) a.classList.add("active");
  });
})();