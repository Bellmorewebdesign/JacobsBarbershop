/* =====================================================================
   Jacob's Barber Shop — shared script (index.html + gallery.html)
   Vanilla JS only. Handles: mobile nav, reveal-on-scroll, gallery build
   with graceful missing-image placeholders, accessible lightbox, and the
   footer year.
   ===================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------
     Gallery image list — single source of truth for both pages.
     Homepage shows the first 6; the gallery page shows all 15.
     Files live in the /gallery folder. If a file has not been added
     yet, a branded "coming soon" placeholder is shown instead.
  ------------------------------------------------------------------ */
  var GALLERY = [
    { file: "gallery/gallery-01.png", alt: "Fresh men's haircut at Jacob's Barber Shop in Bellmore" },
    { file: "gallery/gallery-02.png", alt: "Clean skin fade by the barbers at Jacob's Barber Shop" },
    { file: "gallery/gallery-03.png", alt: "Kids' haircut at Jacob's Barber Shop in Bellmore" },
    { file: "gallery/gallery-04.png", alt: "Sharp lineup and taper haircut" },
    { file: "gallery/gallery-05.png", alt: "Scissor cut with a natural, textured finish" },
    { file: "gallery/gallery-06.png", alt: "Barbershop business card" },
    { file: "gallery/gallery-07.png", alt: "Low fade haircut detail" },
    { file: "gallery/gallery-08.png", alt: "Hair design and detailed lineup" },
    { file: "gallery/gallery-09.png", alt: "Comfortable kids' haircut in progress" },
    { file: "gallery/gallery-10.png", alt: "Hot towel shave finish at Jacob's Barber Shop" },
    { file: "gallery/gallery-11.png", alt: "Modern textured crop haircut" },
    { file: "gallery/gallery-12.png", alt: "High fade with a clean taper" },
    { file: "gallery/gallery-13.png", alt: "Neat, tapered everyday men's cut" },
    { file: "gallery/gallery-14.png", alt: "Styled finish after a haircut" },
    { file: "gallery/gallery-15.png", alt: "Happy customer after a cut at the shop" }
  ];

  /* Collect images that successfully load so the lightbox can navigate
     only between real photos. */
  var loadedItems = [];

  function buildGallery() {
    var containers = document.querySelectorAll("[data-gallery]");
    containers.forEach(function (container) {
      var mode = container.getAttribute("data-gallery");
      var count = mode === "preview" ? 6 : GALLERY.length;
      var items = GALLERY.slice(0, count);

      items.forEach(function (item, i) {
        var figure = document.createElement("figure");
        figure.className = "gcell";

        // Build the interactive photo cell up front. If the image fails to
        // load (not uploaded yet), swap the whole cell for a placeholder.
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gcell__btn";
        btn.setAttribute("aria-label", "View photo: " + item.alt);

        var img = document.createElement("img");
        img.src = item.file;
        img.alt = item.alt;
        img.loading = "lazy";
        img.decoding = "async";
        img.width = 600;
        img.height = 600;

        var zoom = document.createElement("span");
        zoom.className = "gcell__zoom";
        zoom.setAttribute("aria-hidden", "true");
        zoom.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14ZM9 6h1v2h2v1h-2v2H9V9H7V8h2Z"/></svg>';

        img.addEventListener("load", function () {
          var record = { src: item.file, alt: item.alt };
          loadedItems.push(record);
          var index = loadedItems.length - 1;
          btn.addEventListener("click", function () {
            openLightbox(index);
          });
        });

        img.addEventListener("error", function () {
          renderPlaceholder(figure);
        });

        btn.appendChild(img);
        btn.appendChild(zoom);
        figure.appendChild(btn);
        container.appendChild(figure);
      });
    });
  }

  function renderPlaceholder(figure) {
    figure.classList.add("gcell--placeholder");
    figure.innerHTML =
      '<div class="gcell__ph">' +
      '<span class="gcell__ph-pole" aria-hidden="true"></span>' +
      '<span class="gcell__ph-text">Gallery photo</span>' +
      '<span class="gcell__ph-sub">coming soon</span>' +
      "</div>";
  }

  /* -----------------------------------------------------------------
     Lightbox
  ------------------------------------------------------------------ */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var currentIndex = 0;
  var lastFocused = null;

  function showImage(index) {
    if (!loadedItems.length) return;
    currentIndex = (index + loadedItems.length) % loadedItems.length;
    var item = loadedItems[currentIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    var multiple = loadedItems.length > 1;
    lbPrev.style.display = multiple ? "" : "none";
    lbNext.style.display = multiple ? "" : "none";
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    // force reflow so the CSS transition runs
    void lightbox.offsetWidth;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onLightboxKey);
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.removeEventListener("keydown", onLightboxKey);
    document.body.style.overflow = "";
    var hide = function () {
      lightbox.hidden = true;
      lightbox.removeEventListener("transitionend", hide);
    };
    if (prefersReducedMotion) { lightbox.hidden = true; }
    else { lightbox.addEventListener("transitionend", hide); }
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function onLightboxKey(e) {
    if (e.key === "Escape") { closeLightbox(); }
    else if (e.key === "ArrowRight") { showImage(currentIndex + 1); }
    else if (e.key === "ArrowLeft") { showImage(currentIndex - 1); }
    else if (e.key === "Tab") {
      // Keep focus trapped within the dialog controls.
      var focusable = [lbClose, lbPrev, lbNext].filter(function (el) {
        return el && el.style.display !== "none";
      });
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  if (lightbox) {
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { showImage(currentIndex - 1); });
    lbNext.addEventListener("click", function () { showImage(currentIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* -----------------------------------------------------------------
     Mobile navigation
  ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;

    var backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.hidden = true;

    function openMenu() {
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      document.body.appendChild(backdrop);
      backdrop.hidden = false;
      void backdrop.offsetWidth;
      backdrop.classList.add("is-open");
    }
    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      backdrop.classList.remove("is-open");
      backdrop.hidden = true;
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }
    function toggleMenu() {
      if (menu.classList.contains("is-open")) closeMenu();
      else openMenu();
    }

    toggle.addEventListener("click", toggleMenu);
    backdrop.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });
    // Reset when resizing back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && menu.classList.contains("is-open")) closeMenu();
    });
  }

  /* -----------------------------------------------------------------
     Reveal-on-scroll (IntersectionObserver)
  ------------------------------------------------------------------ */
  function initReveal() {
    var revealEls = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* -----------------------------------------------------------------
     Footer year
  ------------------------------------------------------------------ */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------------
     Graceful fallback for any content image that may not be uploaded
     yet. An <img data-fallback="other.png"> swaps to the fallback the
     first time it fails to load, so the page never shows a broken image.
  ------------------------------------------------------------------ */
  function initImageFallbacks() {
    document.querySelectorAll("img[data-fallback]").forEach(function (img) {
      img.addEventListener("error", function handler() {
        img.removeEventListener("error", handler);
        var fb = img.getAttribute("data-fallback");
        if (fb && img.src.indexOf(fb) === -1) img.src = fb;
      });
      // If it already failed before the listener attached, retrigger.
      if (img.complete && img.naturalWidth === 0) {
        var fb = img.getAttribute("data-fallback");
        if (fb && img.src.indexOf(fb) === -1) img.src = fb;
      }
    });
  }

  /* -----------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    buildGallery();
    initNav();
    initReveal();
    initYear();
    initImageFallbacks();
  });
})();
