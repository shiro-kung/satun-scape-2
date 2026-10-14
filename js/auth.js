(function () {
  "use strict";

  var qs = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var qsa = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // Values rendered here (booking reference, type) are already
  // server-generated/allowlisted, not raw visitor input — but escaping
  // before building HTML strings is cheap insurance against that ever
  // changing later.
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var currentSession = null; // cached result of the last /session.php fetch

  function fetchSession() {
    return fetch('session.php', { credentials: 'same-origin' })
      .then(function (res) { return res.json(); })
      .catch(function () { return { loggedIn: false, user: null, csrf_token: '' }; });
  }

  function firstName(name) {
    if (!name) return '';
    return name.trim().split(/\s+/)[0];
  }

  function initials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    var first = parts[0] ? parts[0][0] : '';
    var second = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + second).toUpperCase();
  }

  /* ---------- nav account slot (present on every page) ---------- */
  function currentLang() {
    return (window.localStorage && localStorage.getItem('language')) || 'en';
  }

  function i18nText(key, fallback) {
    var lang = currentLang();
    if (window.SCAPE_I18N && SCAPE_I18N[lang] && SCAPE_I18N[lang][key] !== undefined) {
      return SCAPE_I18N[lang][key];
    }
    return fallback;
  }

  function syncNavAccount(session) {
    var desktop = document.getElementById('nav-account-desktop');
    var mobile = document.getElementById('nav-account-mobile');
    [desktop, mobile].forEach(function (el) {
      if (!el) return;
      if (session.loggedIn && session.user) {
        el.href = 'account.html';
        el.innerHTML = '<i class="fas fa-user" aria-hidden="true"></i> ' + i18nText('nav_hi', 'Hi') + ' ' + firstName(session.user.name);
      } else {
        el.href = 'login.html';
        el.innerHTML = '<i class="fas fa-user" aria-hidden="true"></i> ' + i18nText('nav_login', 'Log in');
      }
    });
  }

  /* ---------- shared: show a message banner ---------- */
  function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove('is-error', 'is-success');
    el.classList.add('is-visible', type === 'success' ? 'is-success' : 'is-error');
  }

  function hideMessage(el) {
    if (!el) return;
    el.classList.remove('is-visible', 'is-error', 'is-success');
  }

  /* ---------- login form ---------- */
  function initLoginForm(session) {
    var form = document.getElementById('login-form');
    if (!form) return;

    var messageEl = document.getElementById('auth-message');
    var submitBtn = form.querySelector('.auth-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideMessage(messageEl);
      submitBtn.disabled = true;
      submitBtn.textContent = i18nText('btn_logging_in', 'Logging in…');

      var body = new URLSearchParams({
        email: form.email.value,
        password: form.password.value,
        csrf_token: session.csrf_token || ''
      });

      fetch('login.php', { method: 'POST', credentials: 'same-origin', body: body })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            var params = new URLSearchParams(window.location.search);
            window.location.href = params.get('redirect') || 'account.html';
          } else {
            showMessage(messageEl, data.error || 'Could not log in. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = i18nText('btn_login', 'Log in');
          }
        })
        .catch(function () {
          showMessage(messageEl, 'Network error. Please try again.', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = i18nText('btn_login', 'Log in');
        });
    });
  }

  /* ---------- register form ---------- */
  function initNationalityToggle(form) {
    var select = form.querySelector('#nationality');
    var otherGroup = document.getElementById('nationality-other-group');
    var otherInput = document.getElementById('nationality_other');
    if (!select || !otherGroup) return;

    var sync = function () {
      var isOther = select.value === 'other';
      otherGroup.hidden = !isOther;
      if (otherInput) otherInput.required = isOther;
    };
    select.addEventListener('change', sync);
    sync();
  }

  function resolvedNationality(form) {
    var select = form.querySelector('#nationality');
    if (!select) return '';
    if (select.value === 'other') {
      var otherInput = document.getElementById('nationality_other');
      return otherInput ? otherInput.value.trim() : '';
    }
    return select.value;
  }

  function initRegisterForm(session) {
    var form = document.getElementById('register-form');
    if (!form) return;

    initNationalityToggle(form);

    var messageEl = document.getElementById('auth-message');
    var submitBtn = form.querySelector('.auth-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideMessage(messageEl);

      if (form.password.value !== form.confirm_password.value) {
        showMessage(messageEl, 'Passwords do not match.', 'error');
        return;
      }

      var nationality = resolvedNationality(form);
      if (!nationality) {
        showMessage(messageEl, 'Please select or enter your nationality.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = i18nText('btn_creating_account', 'Creating account…');

      var body = new URLSearchParams({
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        nationality: nationality,
        password: form.password.value,
        confirm_password: form.confirm_password.value,
        csrf_token: session.csrf_token || ''
      });

      fetch('register.php', { method: 'POST', credentials: 'same-origin', body: body })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            window.location.href = 'account.html';
          } else {
            showMessage(messageEl, data.error || 'Could not create your account.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = i18nText('btn_create_account', 'Create account');
          }
        })
        .catch(function () {
          showMessage(messageEl, 'Network error. Please try again.', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = i18nText('btn_create_account', 'Create account');
        });
    });
  }

  /* ---------- forgot / reset password ---------- */
  function initForgotPasswordForm(session) {
    var form = document.getElementById('forgot-password-form');
    if (!form) return;

    var messageEl = document.getElementById('auth-message');
    var demoWrap = document.getElementById('forgot-demo-link-wrap');
    var submitBtn = form.querySelector('.auth-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideMessage(messageEl);
      if (demoWrap) demoWrap.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = i18nText('btn_sending', 'Sending…');

      var body = new URLSearchParams({
        email: document.getElementById('email').value,
        website: document.getElementById('forgot-website') ? document.getElementById('forgot-website').value : '',
        csrf_token: session.csrf_token || ''
      });

      fetch('forgot-password.php', { method: 'POST', credentials: 'same-origin', body: body })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            showMessage(messageEl, i18nText('forgot_sent', "If that email has an account, we've sent a reset link to it."), 'success');
            if (data.demoResetLink && demoWrap) {
              demoWrap.hidden = false;
              demoWrap.innerHTML = '<strong>' + i18nText('forgot_demo_note', "This site has no real email set up yet, so here's your link directly (on a live site this would be emailed instead):") + '</strong><br><a href="' + data.demoResetLink + '">' + data.demoResetLink + '</a>';
            }
            form.reset();
          } else {
            showMessage(messageEl, data.error || 'Something went wrong. Please try again.', 'error');
          }
        })
        .catch(function () {
          showMessage(messageEl, 'Network error. Please try again.', 'error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = i18nText('btn_send_reset_link', 'Send reset link');
        });
    });
  }

  function initResetPasswordForm(session) {
    var form = document.getElementById('reset-password-form');
    if (!form) return;

    var messageEl = document.getElementById('auth-message');
    var submitBtn = form.querySelector('.auth-submit');
    var params = new URLSearchParams(window.location.search);
    var email = params.get('email') || '';
    var token = params.get('token') || '';

    if (!email || !token) {
      showMessage(messageEl, i18nText('reset_bad_link', 'This reset link is invalid or incomplete. Please request a new one.'), 'error');
      form.querySelectorAll('input, button').forEach(function (el) { el.disabled = true; });
      return;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideMessage(messageEl);

      if (form.password.value !== form.confirm_password.value) {
        showMessage(messageEl, 'Passwords do not match.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = i18nText('btn_resetting', 'Resetting…');

      var body = new URLSearchParams({
        email: email,
        token: token,
        password: form.password.value,
        confirm_password: form.confirm_password.value,
        csrf_token: session.csrf_token || ''
      });

      fetch('reset-password.php', { method: 'POST', credentials: 'same-origin', body: body })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            showMessage(messageEl, i18nText('reset_success', 'Password updated! You can now log in.'), 'success');
            form.reset();
            form.querySelectorAll('input').forEach(function (el) { el.disabled = true; });
            submitBtn.hidden = true;
            setTimeout(function () { window.location.href = 'login.html'; }, 2000);
          } else {
            showMessage(messageEl, data.error || 'Could not reset your password.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = i18nText('btn_reset_password', 'Reset password');
          }
        })
        .catch(function () {
          showMessage(messageEl, 'Network error. Please try again.', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = i18nText('btn_reset_password', 'Reset password');
        });
    });
  }

  /* ---------- account page ---------- */
  function bookingTypeIcon(type) {
    var icons = { tour: 'fa-map-marked-alt', car: 'fa-car', boat: 'fa-ship', stay: 'fa-bed' };
    return icons[type] || 'fa-suitcase';
  }

  function bookingStatusLabel(status) {
    var map = {
      pending: i18nText('status_pending', 'Pending'),
      confirmed: i18nText('status_confirmed', 'Confirmed'),
      cancelled: i18nText('status_cancelled', 'Cancelled')
    };
    return map[status] || map.pending;
  }

  function renderBookingHistory(bookings, listEl) {
    if (!bookings.length) {
      listEl.innerHTML = '<p class="booking-history-empty">' + i18nText('no_bookings', 'No bookings yet.') + ' <a href="booking.html">' + i18nText('start_planning', 'Start planning your trip →') + '</a></p>';
      return;
    }

    listEl.innerHTML = bookings.map(function (b) {
      var date = b.submitted_at ? new Date(b.submitted_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
      var status = b.status || 'pending';
      var canCancel = status !== 'cancelled';
      return (
        '<div class="booking-history-item">' +
          '<div class="booking-history-top">' +
            '<span class="booking-history-ref">' + escapeHtml(b.reference) + '</span>' +
            '<span class="booking-history-type"><i class="fas ' + bookingTypeIcon(b.type) + '" aria-hidden="true"></i> ' + escapeHtml(b.type) + '</span>' +
          '</div>' +
          '<div class="booking-history-bottom">' +
            '<span class="booking-status-badge booking-status-' + status + '">' + bookingStatusLabel(status) + '</span>' +
            '<div class="booking-history-date">' + i18nText('submitted_on', 'Submitted') + ' ' + date + '</div>' +
          '</div>' +
          (canCancel
            ? '<button type="button" class="booking-cancel-btn" data-reference="' + escapeHtml(b.reference) + '">' + i18nText('btn_cancel_booking', 'Cancel booking') + '</button>'
            : ''
          ) +
        '</div>'
      );
    }).join('');
  }

  function initAccountPage(session) {
    var loggedInView = document.getElementById('account-logged-in');
    var guestView = document.getElementById('account-guest');
    if (!loggedInView || !guestView) return;

    if (!session.loggedIn || !session.user) {
      loggedInView.hidden = true;
      guestView.hidden = false;
      return;
    }

    guestView.hidden = true;
    loggedInView.hidden = false;

    var nameEl = document.getElementById('account-name');
    var emailEl = document.getElementById('account-email');
    var avatarEl = document.getElementById('account-avatar');
    var phoneEl = document.getElementById('account-phone');
    var nationalityEl = document.getElementById('account-nationality');
    if (nameEl) nameEl.textContent = session.user.name;
    if (emailEl) emailEl.textContent = session.user.email;
    if (avatarEl) avatarEl.textContent = initials(session.user.name);
    if (phoneEl) phoneEl.innerHTML = '<i class="fas fa-phone" aria-hidden="true"></i> ' + (session.user.phone || '—');
    if (nationalityEl) nationalityEl.innerHTML = '<i class="fas fa-flag" aria-hidden="true"></i> ' + (session.user.nationality || '—');

    var listEl = document.getElementById('booking-history-list');
    function loadBookings() {
      if (!listEl) return;
      listEl.innerHTML = '<p class="auth-loading">Loading your bookings…</p>';
      fetch('my-bookings.php', { credentials: 'same-origin' })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          renderBookingHistory(data.success ? data.bookings : [], listEl);
        })
        .catch(function () {
          listEl.innerHTML = '<p class="booking-history-empty">Could not load your bookings right now.</p>';
        });
    }
    loadBookings();

    if (listEl) {
      listEl.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.booking-cancel-btn') : null;
        if (!btn) return;

        var confirmMsg = i18nText('confirm_cancel_booking', 'Cancel this booking? This cannot be undone.');
        if (!window.confirm(confirmMsg)) return;

        var reference = btn.getAttribute('data-reference');
        btn.disabled = true;
        btn.textContent = i18nText('btn_cancelling', 'Cancelling…');

        var body = new URLSearchParams({ reference: reference, csrf_token: session.csrf_token || '' });
        fetch('cancel-booking.php', { method: 'POST', credentials: 'same-origin', body: body })
          .then(function (res) { return res.json(); })
          .then(function () { loadBookings(); })
          .catch(function () {
            btn.disabled = false;
            btn.textContent = i18nText('btn_cancel_booking', 'Cancel booking');
          });
      });
    }

    var logoutBtn = document.getElementById('account-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        logoutBtn.disabled = true;
        var body = new URLSearchParams({ csrf_token: session.csrf_token || '' });
        fetch('logout.php', { method: 'POST', credentials: 'same-origin', body: body })
          .then(function () { window.location.href = 'index.html'; })
          .catch(function () { window.location.href = 'index.html'; });
      });
    }
  }

  /* ---------- convenience: prefill contact details for logged-in visitors ---------- */
  function prefillContactFields(session) {
    if (!session.loggedIn || !session.user) return;
    qsa('input[name="name"]').forEach(function (el) {
      if (!el.value) el.value = session.user.name;
    });
    qsa('input[name="email"]').forEach(function (el) {
      if (!el.value) el.value = session.user.email;
    });
    qsa('input[name="phone"]').forEach(function (el) {
      if (!el.value && session.user.phone) el.value = session.user.phone;
    });
    qsa('input[name="nationality"]').forEach(function (el) {
      if (!el.value && session.user.nationality) el.value = session.user.nationality;
    });
  }

  /* ---------- CSRF token for plain forms (contact, booking) ----------
     Login/register/etc build their own request bodies and already read
     session.csrf_token directly. The contact and booking forms instead
     submit themselves via FormData, so they get the token through a
     hidden <input name="csrf_token"> that this fills in once the
     session check comes back — same page-load prefill pattern as the
     contact fields above. */
  function prefillCsrfFields(session) {
    qsa('input[name="csrf_token"]').forEach(function (el) {
      el.value = session.csrf_token || '';
    });
  }

  document.addEventListener('languageChanged', function () {
    if (currentSession) syncNavAccount(currentSession);
  });

  document.addEventListener('DOMContentLoaded', function () {
    fetchSession().then(function (session) {
      currentSession = session;
      syncNavAccount(session);

      var isAuthEntryPage = document.body.classList.contains('page-login') || document.body.classList.contains('page-register');
      if (session.loggedIn && isAuthEntryPage) {
        window.location.replace('account.html');
        return;
      }

      initLoginForm(session);
      initRegisterForm(session);
      initForgotPasswordForm(session);
      initResetPasswordForm(session);
      initAccountPage(session);
      prefillContactFields(session);
      prefillCsrfFields(session);
    });
  });
})();
