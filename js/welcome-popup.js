(function () {
  "use strict";

  var STORAGE_KEY = 'scape_welcome_seen';

  document.addEventListener('DOMContentLoaded', function () {
    // Only show on the home page, and only once per browser (localStorage)
    if (!document.body.classList.contains('page-home')) return;
    if (window.localStorage && localStorage.getItem(STORAGE_KEY)) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var popup = document.createElement('div');
    popup.className = 'scape-welcome-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'Welcome');
    popup.innerHTML =
      '<div class="scape-welcome-panel">' +
        '<button type="button" class="scape-welcome-close" aria-label="Close"><i class="fas fa-times" aria-hidden="true"></i></button>' +
        '<i class="fas fa-umbrella-beach scape-welcome-icon" aria-hidden="true"></i>' +
        '<h2 data-i18n="site_slogan">No one knows Satun like the people of Satun</h2>' +
        '<p data-i18n="welcome_popup_text">Welcome to Satun Scape — built by people who actually live here, to help you explore the islands, food, and culture like a local would.</p>' +
        '<a href="attractions.html" class="hero-btn hero-btn-primary" id="welcome-popup-cta"><i class="fas fa-compass" aria-hidden="true"></i> <span data-i18n="hero_cta_explore">Start exploring</span></a>' +
      '</div>';
    document.body.appendChild(popup);

    var closeBtn = popup.querySelector('.scape-welcome-close');

    function dismiss() {
      popup.classList.remove('is-open');
      if (window.localStorage) localStorage.setItem(STORAGE_KEY, '1');
      window.setTimeout(function () { popup.remove(); }, reduceMotion ? 0 : 350);
    }

    closeBtn.addEventListener('click', dismiss);
    popup.addEventListener('click', function (e) { if (e.target === popup) dismiss(); });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' && popup.classList.contains('is-open')) {
        dismiss();
        document.removeEventListener('keydown', onKey);
      }
    });
    popup.querySelector('#welcome-popup-cta').addEventListener('click', function () {
      if (window.localStorage) localStorage.setItem(STORAGE_KEY, '1');
    });

    // apply current translations to the freshly-created popup, then reveal
    if (window.scapeApplyExtraI18n) {
      var lang = (window.localStorage && localStorage.getItem('language')) || 'en';
      scapeApplyExtraI18n(lang);
    }

    window.setTimeout(function () {
      popup.classList.add('is-open');
    }, 900);
  });
})();
