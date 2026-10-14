(function () {
  "use strict";

  var overlay = null;
  var navigating = false;

  function buildOverlay() {
    var el = document.createElement('div');
    el.className = 'page-exit-overlay';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  function isEligibleLink(link, evt) {
    if (!link) return false;
    if (evt.defaultPrevented) return false;
    // only intercept plain left-clicks — let the browser handle
    // ctrl/cmd/shift/alt-click and middle-click (these mean "open in a
    // new tab/window" and must behave exactly as the user expects)
    if (evt.button !== 0 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey) return false;

    var href = link.getAttribute('href');
    if (!href) return false;
    if (href.charAt(0) === '#') return false; // same-page anchor
    if (/^(mailto:|tel:|sms:|javascript:|blob:|data:)/i.test(href)) return false;
    if (link.hasAttribute('download')) return false;

    var targetAttr = link.getAttribute('target');
    if (targetAttr && targetAttr !== '_self') return false; // opens elsewhere

    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (e) {
      return false;
    }

    // external site — never intercept
    if (url.origin !== window.location.origin) return false;

    // only intercept plain .html page navigations we actually control
    if (!/\.html?$/i.test(url.pathname)) return false;

    // same page (e.g. a link back to itself, or with just a query change
    // we don't otherwise handle) — let it behave normally
    if (url.pathname === window.location.pathname && url.search === window.location.search) return false;

    return url.href;
  }

  document.addEventListener('click', function (e) {
    if (navigating) return;

    var link = e.target.closest && e.target.closest('a[href]');
    var destination = isEligibleLink(link, e);
    if (!destination) return;

    e.preventDefault();
    navigating = true;

    if (!overlay) overlay = buildOverlay();

    var navigated = false;
    function go() {
      if (navigated) return;
      navigated = true;
      window.location.href = destination;
    }

    // Navigate once the fade-to-cover transition actually finishes, so the
    // animation is visible rather than being cut off by an unload that
    // fires too early.
    overlay.addEventListener('transitionend', go, { once: true });

    // Hard safety net: no matter what happens with the animation or any
    // other script on the page, the click must always eventually result
    // in navigation, even if transitionend never fires for some reason.
    window.setTimeout(go, 420);

    window.requestAnimationFrame(function () {
      overlay.classList.add('is-active');
    });
  }, false);
})();
