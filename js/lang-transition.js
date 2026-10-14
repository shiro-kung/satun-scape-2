(function () {
  "use strict";

  var LANG_DISPLAY = {
    en: { name: 'English', native: 'English', mark: 'EN' },
    th: { name: 'Thai', native: 'ไทย', mark: 'TH' },
    zh: { name: 'Chinese', native: '中文', mark: 'ZH' },
    tl: { name: 'Tagalog', native: 'Tagalog', mark: 'TL' },
    ms: { name: 'Malay', native: 'Bahasa Malaysia', mark: 'MY' },
    ar: { name: 'Arabic', native: 'العربية', mark: 'AR' },
    es: { name: 'Spanish', native: 'Español', mark: 'ES' },
    ko: { name: 'Korean', native: '한국어', mark: 'KO' },
    ja: { name: 'Japanese', native: '日本語', mark: 'JA' }
  };

  var isPlaying = false;

  function buildOverlay() {
    var el = document.createElement('div');
    el.className = 'lang-transition-overlay';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<div class="lang-transition-ring lang-transition-ring-a"></div>' +
      '<div class="lang-transition-ring lang-transition-ring-b"></div>' +
      '<div class="lang-transition-core">' +
        '<i class="fas fa-globe lang-transition-globe" aria-hidden="true"></i>' +
        '<div class="lang-transition-word"></div>' +
        '<div class="lang-transition-mark"></div>' +
      '</div>' +
      '<div class="lang-transition-sweep"></div>';
    document.body.appendChild(el);
    return el;
  }

  function playTransition(langCode) {
    if (isPlaying) return;
    isPlaying = true;

    var info = LANG_DISPLAY[langCode] || { native: langCode.toUpperCase(), mark: langCode.toUpperCase() };

    var overlay = buildOverlay();
    var wordEl = overlay.querySelector('.lang-transition-word');
    var markEl = overlay.querySelector('.lang-transition-mark');
    wordEl.textContent = info.native;
    markEl.textContent = info.mark;

    var cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      isPlaying = false;
    }

    // Safety net: no matter what happens with the animation classes below,
    // guarantee the overlay is gone and interaction is never blocked.
    var safetyTimer = window.setTimeout(cleanup, 2000);

    window.requestAnimationFrame(function () {
      overlay.classList.add('is-playing');
    });

    window.setTimeout(function () {
      overlay.classList.add('is-out');
    }, 850);

    window.setTimeout(function () {
      window.clearTimeout(safetyTimer);
      cleanup();
    }, 1350);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-btn');
      if (!btn) return;
      var langCode = btn.getAttribute('data-lang');
      if (!langCode) return;
      // skip the flourish if re-selecting the language already active.
      // Read this in the CAPTURE phase so it runs before scripts.js's own
      // bubble-phase click handler calls setLanguage() and mutates the
      // active class — otherwise this check always sees the post-switch
      // state and the animation would never play.
      var current = window.localStorage && localStorage.getItem('language');
      if (current === langCode) return;
      playTransition(langCode);
    }, true);
  });
})();
