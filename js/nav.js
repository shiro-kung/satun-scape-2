(function () {
  "use strict";

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('mobile-nav-toggle');
    var drawer = document.getElementById('mobile-nav-drawer');
    var backdrop = document.getElementById('mobile-nav-backdrop');
    var siteNav = document.querySelector('.site-nav');

    /* ---------- mobile drawer open/close (fully self-contained) ---------- */
    if (toggle && drawer && backdrop) {
      var isMobile = function () {
        return window.matchMedia('(max-width: 900px)').matches;
      };

      var setOpen = function (open) {
        drawer.hidden = !open;
        backdrop.hidden = !open;
        // allow the browser to register the [hidden] removal before animating
        window.requestAnimationFrame(function () {
          drawer.classList.toggle('is-open', open);
          backdrop.classList.toggle('is-open', open);
        });
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('mobile-nav-open', open);
      };

      var close = function () {
        if (toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
      };

      toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });

      backdrop.addEventListener('click', close);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
      });

      window.addEventListener('resize', function () {
        if (!isMobile()) close();
      });

      drawer.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', close);
      });

      drawer.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', close);
      });
    }

    /* ---------- sticky nav bar solidify-on-scroll ---------- */
    if (siteNav) {
      var setScrolled = function () {
        siteNav.classList.toggle('is-scrolled', window.scrollY > 24);
      };
      setScrolled();
      window.addEventListener('scroll', setScrolled, { passive: true });
    }

    /* ---------- mirror desktop nav text + active state onto the mobile
       drawer, so language switching and "current page" highlighting
       keep working even though the two navs are separate DOM trees ---------- */
    var pageMap = {
      home: 'nav-home',
      attractions: 'nav-attractions',
      accommodation: 'nav-accommodation',
      booking: 'nav-booking',
      cafes: 'nav-cafes',
      market: 'nav-market',
      contact: 'nav-contact'
    };

    var syncMobileNav = function () {
      Object.keys(pageMap).forEach(function (page) {
        var source = document.getElementById(pageMap[page]);
        var target = document.querySelector('.mobile-nav-list [data-page="' + page + '"]');
        if (!source || !target) return;
        target.textContent = source.textContent;
        target.classList.toggle('active', source.classList.contains('active'));
      });
    };

    // Run once after scripts.js has set initial language + active page
    syncMobileNav();
    document.addEventListener('languageChanged', syncMobileNav);
  });
})();
