(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. scroll-reveal on cards & sections ---------- */
  var revealSelectors = [
    '.package-card', '.attraction-card', '.cafe-card', '.attraction-item',
    '.info-section', '.market-card', '.booking-pkg-card', '.large-button',
    '.contact-details', '.contact-form-container', '.booking-cta-strip',
    '.video-section', '.satun-info > h2'
  ];

  var revealEls = [];
  try {
    revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSelectors.join(',')));
  } catch (e) { revealEls = []; }

  revealEls.forEach(function (el) { el.classList.add('reveal-on-scroll'); });

  if (!reduceMotion && 'IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });

    // Safety net: reveal everything left after a while (e.g. layout quirks)
    window.setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }, 4000);
  } else {
    // No IO support or reduced motion requested: show immediately
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- 2. navbar shrink / solidify on scroll ---------- */
  var navBar = document.querySelector('.top-nav-bar');
  if (navBar) {
    var setScrolled = function () {
      navBar.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  /* ---------- 3. floating back-to-top button ---------- */
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'scape-top-btn';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
  document.body.appendChild(topBtn);

  var toggleTopBtn = function () {
    topBtn.classList.toggle('is-visible', window.scrollY > 480);
  };
  toggleTopBtn();
  window.addEventListener('scroll', toggleTopBtn, { passive: true });

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- 4. gentle hover-lift on card links (pointer devices only) ---------- */
  if (!reduceMotion && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    var tiltTargets = document.querySelectorAll('.package-card, .attraction-card, .cafe-card, .booking-pkg-card');
    tiltTargets.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-8px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }
})();
