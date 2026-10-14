(function () {
  "use strict";

  var STORAGE_KEY = 'scape_trip_items';

  function loadTrip() {
    try {
      var raw = window.localStorage && localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveTrip(items) {
    try {
      if (window.localStorage) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) { /* storage full or unavailable — fail silently */ }
  }

  function findIndex(items, id) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return i;
    }
    return -1;
  }

  function slugify(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lang = function () { return (window.localStorage && localStorage.getItem('language')) || 'en'; };
    var dict = function () { return (window.SCAPE_I18N && SCAPE_I18N[lang()]) || {}; };
    var t = function (key, fallback) { return dict()[key] || fallback; };

    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    /* ---------- floating trip counter (created once, site-wide) ---------- */
    var tripBtn = document.createElement('a');
    tripBtn.href = 'trip.html';
    tripBtn.className = 'trip-float-btn';
    tripBtn.innerHTML = '<i class="fas fa-suitcase" aria-hidden="true"></i> ' +
      '<span data-i18n="trip_float_label">My trip</span> <span class="trip-float-count">0</span>';
    document.body.appendChild(tripBtn);

    function refreshCounter() {
      var items = loadTrip();
      var countEl = tripBtn.querySelector('.trip-float-count');
      countEl.textContent = items.length;
      tripBtn.classList.toggle('is-visible', items.length > 0);
    }

    refreshCounter();

    /* ---------- wire bookmark buttons onto every card, site-wide ---------- */
    var cardSelectors = '.attraction-item, .market-card';
    document.querySelectorAll(cardSelectors).forEach(function (card) {
      var titleEl = card.querySelector('h3, .market-name');
      if (!titleEl) return;
      var name = titleEl.textContent.trim();
      var img = card.querySelector('.image-grid img, .market-images img');
      var imgSrc = img ? img.src : '';
      var id = slugify(currentPage + '__' + name);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'trip-save-btn';
      btn.setAttribute('aria-label', 'Save to trip');
      btn.innerHTML = '<i class="far fa-heart" aria-hidden="true"></i>';

      function syncBtnState() {
        var items = loadTrip();
        var saved = findIndex(items, id) !== -1;
        btn.classList.toggle('is-saved', saved);
        var icon = btn.querySelector('i');
        icon.className = saved ? 'fas fa-heart' : 'far fa-heart';
        btn.setAttribute('aria-label', saved ? t('trip_remove', 'Remove from trip') : t('trip_add', 'Save to trip'));
      }

      btn.addEventListener('click', function (e) {
        e.stopPropagation(); // don't trigger the card-detail modal
        var items = loadTrip();
        var idx = findIndex(items, id);
        if (idx === -1) {
          items.push({ id: id, name: name, image: imgSrc, page: currentPage });
          btn.classList.add('just-saved');
          window.setTimeout(function () { btn.classList.remove('just-saved'); }, 400);
        } else {
          items.splice(idx, 1);
        }
        saveTrip(items);
        syncBtnState();
        refreshCounter();
      });

      syncBtnState();
      card.appendChild(btn);
    });

    /* ---------- trip.html page: render the full list ---------- */
    if (document.body.classList.contains('page-trip')) {
      var MODE_KEY = 'scape_trip_mode';
      var DAY_COUNT_KEY = 'scape_trip_day_count';
      var items = loadTrip();
      var emptyEl = document.getElementById('trip-empty');
      var modeBarEl = document.getElementById('trip-mode-bar');
      var listEl = document.getElementById('trip-list');
      var clearBtn = document.getElementById('trip-clear-btn');
      var printBtn = document.getElementById('trip-print-btn');

      function getMode() {
        return (window.localStorage && localStorage.getItem(MODE_KEY)) || 'list';
      }
      function setMode(mode) {
        if (window.localStorage) localStorage.setItem(MODE_KEY, mode);
      }
      function getDayCount() {
        var n = window.localStorage && parseInt(localStorage.getItem(DAY_COUNT_KEY) || '1', 10);
        return n && n > 0 ? n : 1;
      }
      function setDayCount(n) {
        if (window.localStorage) localStorage.setItem(DAY_COUNT_KEY, String(n));
      }

      function pageLabel(page) {
        var labels = {
          'islands.html': 'cat_islands', 'beaches.html': 'cat_beaches', 'caves.html': 'cat_caves',
          'waterfalls.html': 'cat_waterfalls', 'landmarks.html': 'cat_landmarks', 'temples.html': 'cat_temples',
          'mosque.html': 'cat_mosque', 'museum.html': 'cat_museum', 'shrine.html': 'cat_shrine',
          'cafes.html': 'trip_group_food', 'market.html': 'trip_group_food', 'accommodation.html': 'trip_group_stay'
        };
        var key = labels[page];
        return key ? t(key, page) : page;
      }

      function itemCardHtml(item, showDaySelect, dayOptions) {
        var imgHtml = item.image
          ? '<img src="' + item.image + '" alt="">'
          : '<div style="width:76px;height:76px;border-radius:12px;background:var(--cream);flex-shrink:0;"></div>';
        var daySelectHtml = showDaySelect
          ? '<select class="trip-day-select" data-day-for="' + item.id + '" aria-label="' + t('trip_move_to_day', 'Move to day') + '">' +
            dayOptions.map(function (d) {
              return '<option value="' + d + '"' + (item.day === d ? ' selected' : '') + '>' + t('trip_day_label', 'Day') + ' ' + d + '</option>';
            }).join('') + '</select>'
          : '';
        return '<div class="trip-item-card" data-id="' + item.id + '">' + imgHtml +
          '<div class="trip-item-card-body"><h3>' + item.name + '</h3>' +
          '<a href="' + item.page + '">' + t('trip_view_on_page', 'View on') + ' ' + item.page.replace('.html', '') + '</a></div>' +
          daySelectHtml +
          '<button type="button" class="trip-item-remove" data-remove="' + item.id + '" aria-label="Remove"><i class="fas fa-times" aria-hidden="true"></i></button></div>';
      }

      function renderModeBar() {
        var mode = items.length >= 2 ? getMode() : 'list';
        if (items.length < 2) {
          modeBarEl.innerHTML = '';
          return;
        }
        if (mode === 'itinerary') {
          modeBarEl.innerHTML =
            '<button type="button" class="hero-btn hero-btn-ghost" id="trip-back-to-list" style="background:var(--cream);color:var(--ink);border:1px solid var(--line);">' +
            '<i class="fas fa-list" aria-hidden="true"></i> ' + t('trip_back_to_list', 'Back to simple list') + '</button>' +
            '<button type="button" class="hero-btn" id="trip-add-day" style="background:var(--grad-sea);color:#fff;border:none;margin-left:10px;">' +
            '<i class="fas fa-plus" aria-hidden="true"></i> ' + t('trip_add_day', 'Add a day') + '</button>';
        } else {
          modeBarEl.innerHTML =
            '<button type="button" class="hero-btn hero-btn-primary" id="trip-organize-btn">' +
            '<i class="fas fa-calendar-days" aria-hidden="true"></i> ' + t('trip_organize_btn', 'Organize into a day-by-day itinerary') + '</button>';
        }
      }

      function render() {
        items = loadTrip();
        if (!items.length) {
          if (emptyEl) emptyEl.hidden = false;
          if (listEl) listEl.innerHTML = '';
          if (modeBarEl) modeBarEl.innerHTML = '';
          if (clearBtn) clearBtn.hidden = true;
          if (printBtn) printBtn.hidden = true;
          return;
        }
        if (emptyEl) emptyEl.hidden = true;
        if (clearBtn) clearBtn.hidden = false;
        if (printBtn) printBtn.hidden = false;

        renderModeBar();
        var mode = items.length >= 2 ? getMode() : 'list';

        if (mode === 'itinerary') {
          // ensure every item has a day (default to Day 1 the first time itinerary mode is used)
          var needsSave = false;
          items.forEach(function (item) {
            if (!item.day) { item.day = 1; needsSave = true; }
          });
          if (needsSave) saveTrip(items);

          var maxAssignedDay = 1;
          items.forEach(function (item) { if (item.day > maxAssignedDay) maxAssignedDay = item.day; });
          var dayCount = Math.max(getDayCount(), maxAssignedDay);
          setDayCount(dayCount);

          var dayOptions = [];
          for (var d = 1; d <= dayCount; d++) dayOptions.push(d);

          var byDay = {};
          items.forEach(function (item) {
            if (!byDay[item.day]) byDay[item.day] = [];
            byDay[item.day].push(item);
          });

          listEl.innerHTML = dayOptions.map(function (dNum) {
            var dayItems = byDay[dNum] || [];
            var cards = dayItems.length
              ? dayItems.map(function (item) { return itemCardHtml(item, true, dayOptions); }).join('')
              : '<p style="color:var(--ink-soft);font-size:0.88rem;padding:0 4px;">' + t('trip_day_empty', 'No places assigned to this day yet.') + '</p>';
            return '<section class="trip-section"><h2><i class="fas fa-calendar-day" aria-hidden="true"></i> ' +
              t('trip_day_label', 'Day') + ' ' + dNum + '</h2>' + cards + '</section>';
          }).join('');
        } else {
          var groups = {};
          var order = [];
          items.forEach(function (item) {
            if (!groups[item.page]) { groups[item.page] = []; order.push(item.page); }
            groups[item.page].push(item);
          });

          listEl.innerHTML = order.map(function (page) {
            var cards = groups[page].map(function (item) { return itemCardHtml(item, false, []); }).join('');
            return '<section class="trip-section"><h2><i class="fas fa-map-pin" aria-hidden="true"></i> ' + pageLabel(page) + '</h2>' + cards + '</section>';
          }).join('');
        }
      }

      render();

      listEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-remove]');
        if (!btn) return;
        var id = btn.getAttribute('data-remove');
        var current = loadTrip();
        var idx = findIndex(current, id);
        if (idx !== -1) {
          current.splice(idx, 1);
          saveTrip(current);
          render();
          refreshCounter();
        }
      });

      listEl.addEventListener('change', function (e) {
        var select = e.target.closest('[data-day-for]');
        if (!select) return;
        var id = select.getAttribute('data-day-for');
        var current = loadTrip();
        var idx = findIndex(current, id);
        if (idx !== -1) {
          current[idx].day = parseInt(select.value, 10);
          saveTrip(current);
          render();
        }
      });

      modeBarEl.addEventListener('click', function (e) {
        if (e.target.closest('#trip-organize-btn')) {
          setMode('itinerary');
          setDayCount(1);
          render();
        } else if (e.target.closest('#trip-back-to-list')) {
          setMode('list');
          render();
        } else if (e.target.closest('#trip-add-day')) {
          setDayCount(getDayCount() + 1);
          render();
        }
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          saveTrip([]);
          setMode('list');
          setDayCount(1);
          render();
          refreshCounter();
        });
      }

      if (printBtn) {
        printBtn.addEventListener('click', function () { window.print(); });
      }
    }
  });
})();
