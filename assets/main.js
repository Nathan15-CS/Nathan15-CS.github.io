/* Nathan Anapolsky, site behavior.
   Three small things: theme, sticky-header hairline, scroll reveal. */
(function () {
  "use strict";

  /* ---- Theme toggle -------------------------------------------------
     The initial theme is applied by an inline script in <head> so the
     page never flashes the wrong palette. This only handles clicks. */
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");

  function systemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function currentTheme() {
    return root.getAttribute("data-theme") || (systemPrefersDark() ? "dark" : "light");
  }

  if (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      btn.setAttribute("aria-label", "Switch to " + (next === "dark" ? "light" : "dark") + " theme");
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
    });
  }

  /* Follow the OS if the user has never chosen explicitly. */
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  var onSchemeChange = function () {
    var stored = null;
    try { stored = localStorage.getItem("theme"); } catch (e) {}
    if (!stored) root.removeAttribute("data-theme");
  };
  if (mq.addEventListener) mq.addEventListener("change", onSchemeChange);
  else if (mq.addListener) mq.addListener(onSchemeChange);

  /* ---- Sticky header hairline --------------------------------------
     The rule under the masthead only appears once the page has moved. */
  var masthead = document.querySelector(".masthead");
  if (masthead) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;";
    document.body.prepend(sentinel);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        masthead.setAttribute("data-stuck", String(!entries[0].isIntersecting));
      }).observe(sentinel);
    }
  }

  /* ---- Reveal on scroll --------------------------------------------
     Opt-out honored: prefers-reduced-motion users get everything at once
     (the CSS already handles it; this just skips the observer work). */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  function revealAll() {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* A zero-height viewport (hidden tab, collapsed pane, some embed contexts)
     means nothing can ever intersect, and the observer would never fire.
     Content must never be permanently invisible, so bail out to plain text. */
  if (!window.innerHeight) {
    revealAll();
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  targets.forEach(function (el, i) {
    /* A short stagger so groups arrive as a phrase, not a wall. */
    el.style.transitionDelay = Math.min(i, 4) * 55 + "ms";
    io.observe(el);
  });

  /* Failsafe: if nothing above the fold has revealed shortly after load,
     the observer isn't working in this environment. Show everything. */
  window.setTimeout(function () {
    if (!document.querySelector(".reveal.is-visible")) revealAll();
  }, 1200);
})();
