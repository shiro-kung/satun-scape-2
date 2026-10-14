(function () {
  "use strict";

  document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- build the lightbox shell once ---------- */
    var lightbox = document.createElement('div');
    lightbox.className = 'scape-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image viewer');
    lightbox.innerHTML =
      '<button type="button" class="scape-lightbox-close" aria-label="Close"><i class="fas fa-times" aria-hidden="true"></i></button>' +
      '<button type="button" class="scape-lightbox-prev" aria-label="Previous image"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>' +
      '<img class="scape-lightbox-img" src="" alt="">' +
      '<button type="button" class="scape-lightbox-next" aria-label="Next image"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>' +
      '<div class="scape-lightbox-caption"></div>';
    document.body.appendChild(lightbox);

    var imgEl = lightbox.querySelector('.scape-lightbox-img');
    var captionEl = lightbox.querySelector('.scape-lightbox-caption');
    var closeBtn = lightbox.querySelector('.scape-lightbox-close');
    var prevBtn = lightbox.querySelector('.scape-lightbox-prev');
    var nextBtn = lightbox.querySelector('.scape-lightbox-next');

    var currentGroup = [];
    var currentIndex = 0;

    function show(index) {
      if (!currentGroup.length) return;
      currentIndex = (index + currentGroup.length) % currentGroup.length;
      var target = currentGroup[currentIndex];
      imgEl.src = target.src;
      imgEl.alt = target.alt || '';
      captionEl.textContent = target.alt || '';
      var multi = currentGroup.length > 1;
      prevBtn.style.display = multi ? '' : 'none';
      nextBtn.style.display = multi ? '' : 'none';
    }

    function open(group, index) {
      currentGroup = group;
      show(index);
      lightbox.hidden = false;
      window.requestAnimationFrame(function () {
        lightbox.classList.add('is-open');
      });
      document.body.classList.add('lightbox-open');
    }

    function close() {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
      window.setTimeout(function () {
        lightbox.hidden = true;
      }, reduceMotion ? 0 : 300);
    }

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
    nextBtn.addEventListener('click', function () { show(currentIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });

    /* ---------- wire up every clickable image group site-wide ---------- */
    var groupSelectors = ['.image-grid', '.market-images'];
    groupSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (group) {
        var imgs = Array.prototype.slice.call(group.querySelectorAll('img'));
        if (!imgs.length) return;
        imgs.forEach(function (img, i) {
          img.setAttribute('tabindex', '0');
          img.setAttribute('role', 'button');
          img.addEventListener('click', function () { open(imgs, i); });
          img.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(imgs, i); }
          });
        });
      });
    });

    // .image-container (market.html style single-image wrappers) — group by closest market-images parent already handled above; standalone ones (no market-images wrapper) get their own single-image lightbox
    document.querySelectorAll('.image-container').forEach(function (wrap) {
      if (wrap.closest('.market-images')) return;
      var img = wrap.querySelector('img');
      if (!img || img.hasAttribute('tabindex')) return;
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.addEventListener('click', function () { open([img], 0); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open([img], 0); }
      });
    });
  });
})();
