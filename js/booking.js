'use strict';

(function() {
    var STORAGE_KEY = 'satunscape_bookings';

    function $(id) {
        return document.getElementById(id);
    }

    function getBookingMessages() {
        var lang = localStorage.getItem('language') || 'en';
        var root = window.I18N && window.I18N[lang];
        return (root && root.bookingForm) || (window.I18N && window.I18N.en.bookingForm) || {
            thanks: 'Booking request received!',
            thanksRef: 'Reference: ',
            error: 'Could not send your request. Saved locally—please try again or contact us.',
            validation: 'Please fill in all required fields.'
        };
    }

    function showToast(message, isError) {
        var toast = $('booking-toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.toggle('booking-toast-error', !!isError);
        toast.hidden = false;
        toast.classList.add('booking-toast-visible');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(function() {
            toast.classList.remove('booking-toast-visible');
            setTimeout(function() { toast.hidden = true; }, 300);
        }, 5000);
    }

    function saveLocalBooking(record) {
        try {
            var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            list.unshift(record);
            if (list.length > 8) list = list.slice(0, 8);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
            renderRecentBookings();
        } catch (e) {
            console.error(e);
        }
    }

    function renderRecentBookings() {
        var wrap = $('booking-recent');
        var listEl = $('booking-recent-list');
        if (!wrap || !listEl) return;

        var list;
        try {
            list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            list = [];
        }

        if (!list.length) {
            wrap.hidden = true;
            return;
        }

        wrap.hidden = false;
        listEl.innerHTML = '';
        list.forEach(function(item) {
            var li = document.createElement('li');
            li.className = 'booking-recent-item';
            var typeLabel = item.type || 'booking';
            var ref = item.reference ? ' · ' + item.reference : '';
            li.innerHTML = '<strong>' + escapeHtml(typeLabel) + ref + '</strong><span>' +
                escapeHtml(item.summary || '') + '</span><time datetime="' + escapeHtml(item.created || '') + '">' +
                formatDate(item.created) + '</time>';
            listEl.appendChild(li);
        });
    }

    function escapeHtml(s) {
        if (!s) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatDate(iso) {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleString();
        } catch (e) {
            return iso;
        }
    }

    function buildSummary(type, data) {
        if (type === 'tour') {
            return (data.package || '') + ' · ' + (data.date || '') + ' · ' + (data.adults || '') + ' adults';
        }
        if (type === 'car') {
            return (data.vehicle || '') + ' · ' + (data.pickup_date || '') + ' – ' + (data.return_date || '');
        }
        if (type === 'boat') {
            return (data.route || '') + ' · ' + (data.date || '') + ' · ' + (data.passengers || '') + ' pax';
        }
        if (type === 'stay') {
            return (data.property || '') + ' · ' + (data.checkin || '') + ' → ' + (data.checkout || '');
        }
        return data.name || '';
    }

    function addDays(isoDate, days) {
        var d = new Date(isoDate + 'T12:00:00');
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
    }

    var activePackageCard = null;
    var activePackageId = null;

    function fillList(el, items) {
        if (!el) return;
        el.innerHTML = '';
        if (!items || !items.length) return;
        items.forEach(function(text) {
            var li = document.createElement('li');
            li.textContent = text;
            el.appendChild(li);
        });
    }

    function getPackageDetail(pkgId) {
        var lang = localStorage.getItem('language') || 'en';
        var store = window.PACKAGE_DETAILS || {};
        var L = store[lang] || store.en || {};
        return L[pkgId] || null;
    }

    function getBadgeForType(type) {
        var msg = getBookingMessages();
        if (type === 'tour') return msg.badgeTour || 'Tour';
        if (type === 'boat') return msg.badgeBoat || 'Boat';
        if (type === 'car') return msg.badgeCar || 'Car';
        if (type === 'stay') return msg.badgeStay || 'Stay';
        return '';
    }

    function populatePackageModal(card, pkgId) {
        var detail = getPackageDetail(pkgId);
        if (!card || !detail) return;

        var imgEl = card.querySelector('.booking-pkg-img img');
        var modalImg = $('pkg-modal-img');
        if (modalImg && imgEl) {
            modalImg.src = imgEl.src;
            modalImg.alt = imgEl.alt || '';
        }

        var type = card.getAttribute('data-type');
        var badge = $('pkg-modal-badge');
        if (badge) {
            badge.textContent = getBadgeForType(type);
            badge.className = 'booking-pkg-badge booking-pkg-badge-' + type;
        }

        var n = parseInt(pkgId, 10);
        var msg = getBookingMessages();
        var titleKey = 'pkg' + n + 'title';
        setModalText('pkg-modal-title', msg[titleKey] || card.querySelector('h3').textContent);
        setModalText('pkg-modal-meta', msg['pkg' + n + 'meta'] || '');
        setModalText('pkg-modal-price', msg['pkg' + n + 'price'] || '');
        setModalText('pkg-modal-overview', detail.overview || '');
        setModalText('pkg-modal-duration', detail.duration || '');
        setModalText('pkg-modal-group', detail.groupSize || '');
        fillList($('pkg-modal-itinerary'), detail.itinerary);
        fillList($('pkg-modal-includes'), detail.includes);
        fillList($('pkg-modal-excludes'), detail.excludes);
        fillList($('pkg-modal-bring'), detail.bring);
        setModalText('pkg-modal-notes-text', detail.notes || '');
    }

    function setModalText(id, text) {
        var el = $(id);
        if (el) el.textContent = text || '';
    }

    function openPackageModal(card) {
        if (!card) return;
        var pkgId = card.getAttribute('data-pkg-id');
        if (!pkgId) return;

        activePackageCard = card;
        activePackageId = pkgId;
        populatePackageModal(card, pkgId);

        var modal = $('pkg-modal');
        if (!modal) return;
        modal.hidden = false;
        document.body.classList.add('pkg-modal-open');
        requestAnimationFrame(function() {
            modal.classList.add('pkg-modal-visible');
        });
        var closeBtn = $('pkg-modal-close');
        if (closeBtn) closeBtn.focus();
    }

    function closePackageModal() {
        var modal = $('pkg-modal');
        if (!modal) return;
        modal.classList.remove('pkg-modal-visible');
        document.body.classList.remove('pkg-modal-open');
        setTimeout(function() {
            modal.hidden = true;
        }, 280);
        activePackageCard = null;
    }

    window.refreshPackageModal = function() {
        if (activePackageCard && activePackageId) {
            populatePackageModal(activePackageCard, activePackageId);
        }
    };

    function applyRecommendedPackage(card) {
        if (!card) return;
        var type = card.getAttribute('data-type');
        switchTab(type);

        document.querySelectorAll('.booking-pkg-card').forEach(function(c) {
            c.classList.remove('booking-pkg-card-selected');
        });
        card.classList.add('booking-pkg-card-selected');

        if (type === 'tour') {
            var tourPkg = $('tour-package');
            if (tourPkg && card.getAttribute('data-tour-package')) {
                tourPkg.value = card.getAttribute('data-tour-package');
            }
        } else if (type === 'boat') {
            var route = $('boat-route');
            var ret = $('boat-return');
            if (route && card.getAttribute('data-boat-route')) route.value = card.getAttribute('data-boat-route');
            if (ret && card.getAttribute('data-boat-return')) {
                ret.value = card.getAttribute('data-boat-return');
                toggleBoatReturnDate();
            }
        } else if (type === 'car') {
            var vehicle = $('car-type');
            var driver = $('car-driver');
            var pickup = $('car-pickup-date');
            var retDate = $('car-return-date');
            var days = parseInt(card.getAttribute('data-car-days') || '1', 10);
            if (vehicle && card.getAttribute('data-car-vehicle')) vehicle.value = card.getAttribute('data-car-vehicle');
            if (driver && card.getAttribute('data-car-driver')) driver.value = card.getAttribute('data-car-driver');
            if (pickup && !pickup.value) pickup.value = new Date().toISOString().slice(0, 10);
            if (retDate && pickup && pickup.value) retDate.value = addDays(pickup.value, days);
        } else if (type === 'stay') {
            var prop = $('stay-property');
            var checkin = $('stay-checkin');
            var checkout = $('stay-checkout');
            var nights = parseInt(card.getAttribute('data-stay-nights') || '2', 10);
            if (prop && card.getAttribute('data-stay-property')) prop.value = card.getAttribute('data-stay-property');
            if (checkin && !checkin.value) checkin.value = new Date().toISOString().slice(0, 10);
            if (checkout && checkin && checkin.value) checkout.value = addDays(checkin.value, nights);
        }

        var panel = $('panel-' + type);
        if (panel) {
            setTimeout(function() {
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
        }

        var msg = getBookingMessages();
        if (msg.pkgSelected) showToast(msg.pkgSelected, false);
    }

    function initRecommendedPackages() {
        document.querySelectorAll('.booking-pkg-card').forEach(function(card) {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.btn-pkg-select')) return;
                openPackageModal(card);
            });
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPackageModal(card);
                }
            });
        });

        document.querySelectorAll('.btn-pkg-select').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                openPackageModal(btn.closest('.booking-pkg-card'));
            });
        });

        var backdrop = $('pkg-modal-backdrop');
        var closeBtn = $('pkg-modal-close');
        var bookBtn = $('pkg-modal-book');

        if (backdrop) backdrop.addEventListener('click', closePackageModal);
        if (closeBtn) closeBtn.addEventListener('click', closePackageModal);
        if (bookBtn) {
            bookBtn.addEventListener('click', function() {
                if (activePackageCard) {
                    closePackageModal();
                    applyRecommendedPackage(activePackageCard);
                }
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && $('pkg-modal') && !$('pkg-modal').hidden) {
                closePackageModal();
            }
        });
    }

    function switchTab(type) {
        document.querySelectorAll('.booking-tab').forEach(function(tab) {
            var active = tab.getAttribute('data-booking-type') === type;
            tab.classList.toggle('booking-tab-active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        document.querySelectorAll('.booking-panel').forEach(function(panel) {
            var isTarget = panel.id === 'panel-' + type;
            panel.classList.toggle('booking-panel-active', isTarget);
            panel.hidden = !isTarget;
        });
        if (history.replaceState) {
            history.replaceState(null, '', '#panel-' + type);
        }
    }

    function initTabs() {
        document.querySelectorAll('.booking-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                switchTab(tab.getAttribute('data-booking-type'));
            });
        });

        var hash = (window.location.hash || '').replace('#panel-', '');
        if (['tour', 'car', 'boat', 'stay'].indexOf(hash) !== -1) {
            switchTab(hash);
        }
    }

    function toggleBoatReturnDate() {
        var sel = $('boat-return');
        var group = $('boat-return-date-group');
        var input = $('boat-return-date');
        if (!sel || !group) return;
        var round = sel.value === 'round-trip';
        group.style.display = round ? '' : 'none';
        if (input) input.required = round;
    }

    function setMinDates() {
        var today = new Date().toISOString().slice(0, 10);
        document.querySelectorAll('input[type="date"]').forEach(function(inp) {
            if (!inp.min) inp.min = today;
        });
    }

    function validateForm(form) {
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        return true;
    }

    function submitBooking(form) {
        var type = form.getAttribute('data-type');
        if (!validateForm(form)) {
            showToast(getBookingMessages().validation, true);
            return;
        }

        var formData = new FormData(form);
        formData.append('type', type);
        formData.append('lang', localStorage.getItem('language') || 'en');

        var plain = {};
        formData.forEach(function(v, k) {
            plain[k] = v;
        });

        var btn = form.querySelector('.btn-booking-submit');
        if (btn) btn.disabled = true;

        fetch('booking.php', { method: 'POST', body: formData })
            .then(function(res) {
                return res.json().then(function(data) {
                    if (!res.ok || !data.success) {
                        throw new Error((data && data.error) || 'Request failed');
                    }
                    return data;
                });
            })
            .then(function(data) {
                var msg = getBookingMessages();
                var ref = data.reference || '';
                var text = msg.thanks + (ref ? ' ' + msg.thanksRef + ref : '');
                if (data.emailSent) {
                    text += ' ' + (msg.emailSentNote || '');
                } else {
                    text += ' ' + (msg.emailPendingNote || '');
                }
                showToast(text, !data.emailSent);
                var record = {
                    type: type,
                    reference: ref,
                    summary: buildSummary(type, plain),
                    created: new Date().toISOString()
                };
                saveLocalBooking(record);
                form.reset();
                toggleBoatReturnDate();
            })
            .catch(function() {
                var msg = getBookingMessages();
                var ref = 'LOCAL-' + Date.now().toString(36).toUpperCase();
                saveLocalBooking({
                    type: type,
                    reference: ref,
                    summary: buildSummary(type, plain),
                    created: new Date().toISOString()
                });
                showToast(msg.error + ' ' + msg.thanksRef + ref, true);
                form.reset();
            })
            .finally(function() {
                if (btn) btn.disabled = false;
            });
    }

    function initForms() {
        document.querySelectorAll('.booking-form').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                submitBooking(form);
            });
        });

        var boatReturn = $('boat-return');
        if (boatReturn) {
            boatReturn.addEventListener('change', toggleBoatReturnDate);
            toggleBoatReturnDate();
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (!document.body.classList.contains('page-booking')) return;
        setMinDates();
        initTabs();
        initRecommendedPackages();
        initForms();
        renderRecentBookings();

        document.addEventListener('languageChanged', function() {
            renderRecentBookings();
        });
    });
})();
