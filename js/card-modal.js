(function () {
  "use strict";

  document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var lang = function () { return (window.localStorage && localStorage.getItem('language')) || 'en'; };
    var dict = function () { return (window.SCAPE_I18N && SCAPE_I18N[lang()]) || {}; };
    var t = function (key, fallback) { return dict()[key] || fallback; };

    /* ---------- build modal shell once ---------- */
    var modal = document.createElement('div');
    modal.className = 'scape-card-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div class="scape-card-modal-panel">' +
        '<button type="button" class="scape-card-modal-close" aria-label="Close"><i class="fas fa-times" aria-hidden="true"></i></button>' +
        '<div class="scape-card-modal-gallery"></div>' +
        '<div class="scape-card-modal-body"></div>' +
      '</div>';
    document.body.appendChild(modal);

    var panel = modal.querySelector('.scape-card-modal-panel');
    var galleryEl = modal.querySelector('.scape-card-modal-gallery');
    var bodyEl = modal.querySelector('.scape-card-modal-body');
    var closeBtn = modal.querySelector('.scape-card-modal-close');

    function openModal() {
      modal.hidden = false;
      window.requestAnimationFrame(function () { modal.classList.add('is-open'); });
      document.body.classList.add('card-modal-open');
      panel.scrollTop = 0;
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.classList.remove('card-modal-open');
      window.setTimeout(function () { modal.hidden = true; }, reduceMotion ? 0 : 300);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (!modal.hidden && e.key === 'Escape') closeModal();
    });

    function el(html) {
      var wrap = document.createElement('div');
      wrap.innerHTML = html;
      return wrap.firstElementChild;
    }

    function escapeHtml(str) {
      var d = document.createElement('div');
      d.textContent = str || '';
      return d.innerHTML;
    }

    /* ---------- build modal content for an .attraction-item ---------- */
    function buildAttractionDetail(card) {
      var imgs = Array.prototype.slice.call(card.querySelectorAll('.image-grid img'));
      galleryEl.innerHTML = imgs.map(function (img) {
        return '<img src="' + img.src + '" alt="' + escapeHtml(img.alt) + '">';
      }).join('');
      galleryEl.style.display = imgs.length ? '' : 'none';

      var title = card.querySelector('h3');
      var chips = Array.prototype.slice.call(card.querySelectorAll('.attraction-meta-chip')).map(function (chip) {
        return chip.outerHTML;
      }).join('');

      var paragraphs = Array.prototype.slice.call(card.querySelectorAll(':scope > p')).map(function (p) {
        return '<p>' + p.innerHTML + '</p>';
      }).join('');

      var list = card.querySelector('ul');
      var listHtml = list ? '<ul>' + list.innerHTML + '</ul>' : '';

      bodyEl.innerHTML =
        '<h2>' + escapeHtml(title ? title.textContent : '') + '</h2>' +
        '<div class="scape-card-modal-meta">' + chips + '</div>' +
        '<div class="scape-card-modal-section">' + paragraphs + listHtml + '</div>' +
        '<div class="scape-card-modal-actions">' +
          '<a class="action-primary" href="booking.html"><i class="fas fa-calendar-check" aria-hidden="true"></i> ' + t('modal_plan_visit', 'Plan a visit') + '</a>' +
          '<a class="action-secondary" href="emergency.html"><i class="fas fa-kit-medical" aria-hidden="true"></i> ' + t('nav_emergency', 'Emergency') + '</a>' +
        '</div>';
    }

    /* ---------- build modal content for a .market-card ---------- */
    function buildMarketDetail(card) {
      var imgs = Array.prototype.slice.call(card.querySelectorAll('.market-images img'));
      galleryEl.innerHTML = imgs.map(function (img) {
        return '<img src="' + img.src + '" alt="' + escapeHtml(img.alt) + '">';
      }).join('');
      galleryEl.style.display = imgs.length ? '' : 'none';

      var name = card.querySelector('.market-name');
      var ratingBadge = card.querySelector('.google-rating-badge');
      var description = card.querySelector('.market-description');
      var hoursP = card.querySelector('.market-hours');
      var locationP = card.querySelector('.market-location');
      var contactP = card.querySelector('.market-contact');
      var mapIframe = card.querySelector('.market-map iframe');
      var extraScript = card.querySelector('.google-extra-data');
      var extra = null;
      if (extraScript) {
        try { extra = JSON.parse(extraScript.textContent); } catch (e) { extra = null; }
      }

      var metaHtml = '';
      if (ratingBadge) {
        metaHtml += '<span class="scape-card-modal-badge"><i class="fab fa-google" aria-hidden="true"></i>' +
          ratingBadge.querySelector('.google-rating-score').textContent + ' <i class="fas fa-star"></i> ' +
          ratingBadge.querySelector('.google-rating-count').textContent + '</span>';
      }
      if (extra && extra.price_level) {
        metaHtml += '<span class="scape-card-modal-badge is-price"><i class="fas fa-dollar-sign" aria-hidden="true"></i>' +
          Array(extra.price_level + 1).join('$') + '</span>';
      }

      var descHtml = description && description.textContent.trim()
        ? '<div class="scape-card-modal-section"><p>' + description.innerHTML + '</p></div>' : '';

      var hoursHtml = '';
      if (extra && extra.hours && extra.hours.length) {
        hoursHtml = '<div class="scape-card-modal-section"><h3><i class="fas fa-clock" aria-hidden="true"></i> ' +
          t('modal_hours', 'Hours') + '</h3><table class="scape-card-modal-hours-table">' +
          extra.hours.map(function (line) {
            var parts = line.split(':');
            var day = parts.shift();
            return '<tr><td>' + escapeHtml(day) + '</td><td>' + escapeHtml(parts.join(':').trim()) + '</td></tr>';
          }).join('') + '</table></div>';
      } else if (hoursP) {
        hoursHtml = '<div class="scape-card-modal-section"><h3><i class="fas fa-clock" aria-hidden="true"></i> ' +
          t('modal_hours', 'Hours') + '</h3><p>' + hoursP.innerHTML.replace(/<strong>Hours:<\/strong>\s*/i, '') + '</p></div>';
      }

      var locationHtml = locationP
        ? '<div class="scape-card-modal-section"><h3><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ' +
          t('modal_location', 'Location') + '</h3><p>' + locationP.innerHTML.replace(/<strong>Location:<\/strong>\s*/i, '') + '</p></div>' : '';

      var contactText = contactP ? contactP.textContent.replace(/Contact:\s*/i, '').trim() : '';
      var phoneMatch = contactText.match(/[\d+][\d\s-]{6,}/);
      var contactHtml = contactP
        ? '<div class="scape-card-modal-section"><h3><i class="fas fa-phone-alt" aria-hidden="true"></i> ' +
          t('modal_contact', 'Contact') + '</h3><p>' +
          (phoneMatch ? '<a href="tel:' + phoneMatch[0].replace(/[\s-]/g, '') + '">' + escapeHtml(contactText) + '</a>' : escapeHtml(contactText)) +
          '</p></div>' : '';

      var mapHtml = mapIframe
        ? '<div class="scape-card-modal-section"><h3><i class="fas fa-map" aria-hidden="true"></i> ' + t('modal_map', 'Map') + '</h3>' +
          '<div class="scape-card-modal-map"><iframe src="' + mapIframe.src + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>' : '';

      var directionsUrl = ratingBadge ? ratingBadge.href :
        'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((name ? name.textContent : '') + ' Satun Thailand');

      bodyEl.innerHTML =
        '<h2>' + escapeHtml(name ? name.textContent : '') + '</h2>' +
        '<div class="scape-card-modal-meta">' + metaHtml + '</div>' +
        descHtml + hoursHtml + locationHtml + contactHtml + mapHtml +
        '<div class="scape-card-modal-actions">' +
          '<a class="action-primary" href="' + directionsUrl + '" target="_blank" rel="noopener noreferrer"><i class="fas fa-diamond-turn-right" aria-hidden="true"></i> ' + t('modal_directions', 'Get directions') + '</a>' +
        '</div>';
    }

    /* ---------- wire up cards site-wide ---------- */
    var cardSelectors = '.attraction-item, .market-card';
    document.querySelectorAll(cardSelectors).forEach(function (card) {
      card.classList.add('card-clickable');
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');

      var hint = document.createElement('span');
      hint.className = 'card-detail-hint';
      hint.innerHTML = '<i class="fas fa-expand" aria-hidden="true"></i> <span data-i18n="modal_view_details">View full details</span>';
      card.appendChild(hint);

      var handleOpen = function () {
        if (card.classList.contains('attraction-item')) {
          buildAttractionDetail(card);
        } else {
          buildMarketDetail(card);
        }
        openModal();
      };

      card.addEventListener('click', function (e) {
        var interactive = e.target.closest('a, button, img, iframe');
        if (interactive) return;
        handleOpen();
      });

      card.addEventListener('keydown', function (e) {
        if (e.target !== card) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); }
      });
    });

    /* ---------- re-translate the hint + modal on language change ---------- */
    if (window.scapeApplyExtraI18n) scapeApplyExtraI18n(lang());

    document.addEventListener('languageChanged', function () {
      if (window.scapeApplyExtraI18n) scapeApplyExtraI18n(lang());
    });
  });
})();
