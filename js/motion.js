(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. scroll-reveal on cards & sections ---------- */
  var revealSelectors = [
    '.package-card', '.attraction-card', '.cafe-card', '.attraction-item',
    '.info-section', '.market-card', '.booking-pkg-card', '.large-button',
    '.contact-details', '.contact-form-container', '.booking-cta-strip',
    '.video-section', '.satun-info > h2',
    '.feature-card', '.bento-tile', '.season-card', '.step-mini', '.market-mini-card'
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

  /* ---------- 1b. hero stat count-up ---------- */
  var statEls = Array.prototype.slice.call(document.querySelectorAll('.hero-stat-num[data-count]'));
  if (statEls.length) {
    var animateCount = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      var start = null;
      var duration = 1400;
      var step = function (ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) window.requestAnimationFrame(step);
        else el.textContent = target;
      };
      window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var statIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statEls.forEach(function (el) { statIo.observe(el); });
    } else {
      statEls.forEach(animateCount);
    }
  }

  /* ---------- 1c. scroll cue click ---------- */
  var scrollCue = document.getElementById('scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', function () {
      var target = document.querySelector('.why-satun, #main-content');
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ---------- 1d. listing search (islands / beaches / caves / etc / cafes / accommodation / market) ---------- */
  var listingContainers = Array.prototype.slice.call(document.querySelectorAll('[data-listing]'));
  listingContainers.forEach(function (container) {
    var bar = container.querySelector('.listing-search-bar');
    if (!bar) return;
    var input = bar.querySelector('.listing-search-input');
    var countEl = bar.querySelector('.listing-search-count');
    var items = Array.prototype.slice.call(
      container.querySelectorAll('.market-card, .attraction-item, .package-card')
    );
    if (!input || !items.length) return;

    var dict = function () {
      var lang = (window.localStorage && localStorage.getItem('language')) || 'en';
      return (window.SCAPE_I18N && SCAPE_I18N[lang]) || {};
    };

    /* ---------- district filter chips (built from real data-district attrs) ---------- */
    var activeDistrict = 'all';
    var districtItems = items.filter(function (item) { return item.hasAttribute('data-district'); });
    var chipBar = null;

    var districtLabel = function (slug, fallback) {
      var key = 'dist_' + slug.replace(/-/g, '_');
      var d = dict();
      return d[key] || fallback;
    };

    var districtIcon = function (slug) {
      var icons = {
        'mueang-satun': 'fa-city',
        'la-ngu': 'fa-anchor',
        'khuan-kalong': 'fa-hot-tub',
        'khuan-don': 'fa-water-ladder',
        'thung-wa': 'fa-water',
        'tha-phae': 'fa-leaf',
        'manang': 'fa-mountain'
      };
      return icons[slug] || 'fa-map-marker-alt';
    };

    var groupHeadings = {};

    if (districtItems.length) {
      var counts = {};
      var order = [];
      districtItems.forEach(function (item) {
        var d = item.getAttribute('data-district');
        var label = item.getAttribute('data-district-label') || d;
        if (!counts[d]) { counts[d] = { label: label, count: 0 }; order.push(d); }
        counts[d].count++;
      });

      if (order.length > 1) {
        chipBar = document.createElement('div');
        chipBar.className = 'district-filter-bar';

        var allChip = document.createElement('button');
        allChip.type = 'button';
        allChip.className = 'district-chip is-active';
        allChip.setAttribute('data-district-value', 'all');
        allChip.innerHTML = '<i class="fas fa-border-all" aria-hidden="true"></i><span class="district-chip-label" data-i18n="filter_all">All</span> <span class="district-chip-count">(' + districtItems.length + ')</span>';
        chipBar.appendChild(allChip);

        order.forEach(function (d) {
          var chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'district-chip';
          chip.setAttribute('data-district-value', d);
          chip.innerHTML = '<i class="fas ' + districtIcon(d) + '" aria-hidden="true"></i><span class="district-chip-label">' + districtLabel(d, counts[d].label) + '</span> <span class="district-chip-count">(' + counts[d].count + ')</span>';
          chipBar.appendChild(chip);
        });

        bar.insertAdjacentElement('afterend', chipBar);

        chipBar.addEventListener('click', function (e) {
          var btn = e.target.closest('.district-chip');
          if (!btn) return;
          activeDistrict = btn.getAttribute('data-district-value');
          chipBar.querySelectorAll('.district-chip').forEach(function (c) {
            c.classList.toggle('is-active', c === btn);
          });
          if (btn.scrollIntoView) {
            btn.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
          }
          update();
        });

        document.addEventListener('languageChanged', function () {
          order.forEach(function (d) {
            var chip = chipBar.querySelector('[data-district-value="' + d + '"] .district-chip-label');
            if (chip) chip.textContent = districtLabel(d, counts[d].label);
          });
        });

        /* ---------- grouped section headings for large multi-district listings ---------- */
        if (districtItems.length >= 10) {
          var lastDistrict = null;
          items.forEach(function (item) {
            var d = item.getAttribute('data-district');
            if (d && d !== lastDistrict && !groupHeadings[d]) {
              var heading = document.createElement('div');
              heading.className = 'district-group-heading';
              heading.setAttribute('data-district-group', d);
              heading.innerHTML = '<span class="district-group-icon"><i class="fas ' + districtIcon(d) + '" aria-hidden="true"></i></span>' +
                '<span class="district-group-label">' + districtLabel(d, counts[d].label) + '</span>' +
                '<span class="district-group-count">' + counts[d].count + '</span>';
              item.parentNode.insertBefore(heading, item);
              groupHeadings[d] = heading;
            }
            if (d) lastDistrict = d;
          });

          document.addEventListener('languageChanged', function () {
            order.forEach(function (d) {
              if (groupHeadings[d]) {
                var lbl = groupHeadings[d].querySelector('.district-group-label');
                if (lbl) lbl.textContent = districtLabel(d, counts[d].label);
              }
            });
          });
        }
      }
    }

    var update = function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (item) {
        var matchesText = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
        var matchesDistrict = activeDistrict === 'all' || item.getAttribute('data-district') === activeDistrict;
        var match = matchesText && matchesDistrict;
        item.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      Object.keys(groupHeadings).forEach(function (d) {
        var visible = !q && (activeDistrict === 'all' || activeDistrict === d);
        groupHeadings[d].style.display = visible ? '' : 'none';
      });
      if (countEl) {
        var d = dict();
        var resultWord = shown === 1 ? (d.result_found || 'result found') : (d.results_found || 'results found');
        countEl.textContent = (q || activeDistrict !== 'all') ? (shown + ' ' + resultWord) : '';
      }
    };

    input.addEventListener('input', update);
    document.addEventListener('languageChanged', update);
  });

  /* ---------- 1e. category mosaic stagger reveal (attractions.html) ---------- */
  var mosaic = document.querySelector('.category-mosaic');
  if (mosaic) {
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var mosaicIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
            mosaicIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      mosaicIo.observe(mosaic);
    } else {
      mosaic.classList.add('is-in-view');
    }
  }

  /* ---------- 1f2. contact page: topic selector cards ---------- */
  var topicCards = document.querySelectorAll('.contact-reason-card');
  var topicField = document.getElementById('contact-topic-field');
  if (topicCards.length && topicField) {
    topicCards.forEach(function (card) {
      card.addEventListener('click', function () {
        topicCards.forEach(function (c) { c.classList.remove('is-active'); });
        card.classList.add('is-active');
        topicField.value = card.getAttribute('data-topic') || 'general';
        var messageField = document.getElementById('message');
        if (messageField) messageField.focus();
      });
    });
  }

  /* ---------- 1f. emergency page: print button ---------- */
  var printBtn = document.getElementById('print-emergency-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

  /* ---------- 2. navbar shrink/solidify on scroll is handled by js/nav.js
     for the new .site-nav element (see nav.js) ---------- */

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

  /* ---------- 3b. floating SOS quick-access button (safety-critical: shown
     immediately, not gated behind scroll, on every page except the
     emergency page itself) ---------- */
  if (!document.body.classList.contains('page-emergency')) {
    var sosBtn = document.createElement('a');
    sosBtn.href = 'emergency.html';
    sosBtn.className = 'sos-float-btn';
    var sosLang = (window.localStorage && localStorage.getItem('language')) || 'en';
    var sosAriaText = (window.SCAPE_I18N && SCAPE_I18N[sosLang] && SCAPE_I18N[sosLang].sos_aria) || 'Emergency numbers and safety info';
    sosBtn.setAttribute('data-i18n-aria', 'sos_aria');
    sosBtn.setAttribute('aria-label', sosAriaText);
    sosBtn.innerHTML = '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> <span data-i18n="sos_label">SOS</span>';
    document.body.appendChild(sosBtn);
    window.requestAnimationFrame(function () {
      sosBtn.classList.add('is-visible');
    });
  }

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
