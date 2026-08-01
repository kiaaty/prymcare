/* PrymCare Health — shared site behaviour (nav, scroll effects, cookie bar, forms, counters, carousel) */

document.addEventListener('DOMContentLoaded', function () {

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- Scroll progress: vine + mobile bar + back-to-top ---------- */
  var vineProgress = document.getElementById('vineProgress');
  var mobileProgress = document.getElementById('mobileProgress');
  var toTopBtn = document.getElementById('toTop');
  var vineLength = 2000;
  function onScroll() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    if (vineProgress) vineProgress.style.strokeDashoffset = String(vineLength - (vineLength * pct));
    if (mobileProgress) mobileProgress.style.width = (pct * 100) + '%';
    if (toTopBtn) toTopBtn.classList.toggle('show', scrollTop > 500);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTopBtn) toTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Contact form (client-side demo submit) ---------- */
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      if (formSuccess) formSuccess.classList.add('show');
      contactForm.reset();
    });
  }

  /* ---------- Newsletter (client-side demo submit) ---------- */
  var nlForm = document.getElementById('nlForm');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = nlForm.querySelector('button');
      var original = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      nlForm.reset();
      setTimeout(function () { btn.textContent = original; }, 2500);
    });
  }

  /* ---------- Cookie bar ---------- */
  var cookieBar = document.getElementById('cookieBar');
  function hasCookieChoice() {
    try { return document.cookie.indexOf('prymcare_cookie_choice=') !== -1; } catch (e) { return true; }
  }
  function setCookieChoice(choice) {
    try { document.cookie = 'prymcare_cookie_choice=' + choice + ';max-age=' + (60 * 60 * 24 * 180) + ';path=/'; } catch (e) {}
    if (cookieBar) cookieBar.classList.remove('show');
  }
  if (cookieBar) {
    if (!hasCookieChoice()) { setTimeout(function () { cookieBar.classList.add('show'); }, 1200); }
    var cookieAccept = document.getElementById('cookieAccept');
    var cookieDecline = document.getElementById('cookieDecline');
    if (cookieAccept) cookieAccept.addEventListener('click', function () { setCookieChoice('accepted'); });
    if (cookieDecline) cookieDecline.addEventListener('click', function () { setCookieChoice('declined'); });
  }

  /* ---------- Animated stat counters ---------- */
  var countEls = document.querySelectorAll('.count-up');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animateCount(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var isDecimal = target % 1 !== 0;
    if (reduceMotion) {
      el.textContent = (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
      return;
    }
    var duration = 1400;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var value = isDecimal ? (target * progress).toFixed(1) : Math.floor(target * progress).toLocaleString();
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
    }
    requestAnimationFrame(step);
  }
  if (countEls.length) {
    if ('IntersectionObserver' in window) {
      var countIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); countIo.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      countEls.forEach(function (el) { countIo.observe(el); });
    } else {
      countEls.forEach(animateCount);
    }
  }

  /* ---------- Testimonial carousel ---------- */
  var tTrack = document.getElementById('tTrack');
  var tPrev = document.getElementById('tPrev');
  var tNext = document.getElementById('tNext');
  function tScrollByCard(dir) {
    var card = tTrack.querySelector('.t-card');
    if (!card) return;
    var gap = 22;
    var amount = (card.getBoundingClientRect().width + gap) * dir;
    tTrack.scrollBy({ left: amount, behavior: 'smooth' });
  }
  if (tTrack) {
    if (tPrev) tPrev.addEventListener('click', function () { tScrollByCard(-1); });
    if (tNext) tNext.addEventListener('click', function () { tScrollByCard(1); });
    var tPaused = false;
    function tAutoAdvance() {
      if (tPaused || reduceMotion) return;
      var atEnd = tTrack.scrollLeft + tTrack.clientWidth >= tTrack.scrollWidth - 5;
      if (atEnd) { tTrack.scrollTo({ left: 0, behavior: 'smooth' }); }
      else { tScrollByCard(1); }
    }
    setInterval(tAutoAdvance, 5500);
    tTrack.addEventListener('mouseenter', function () { tPaused = true; });
    tTrack.addEventListener('mouseleave', function () { tPaused = false; });
    tTrack.addEventListener('touchstart', function () { tPaused = true; }, { passive: true });
  }

  /* ---------- FAQ accordion: keep only one open at a time (progressive enhancement) ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (item.open) {
          faqItems.forEach(function (other) { if (other !== item) other.open = false; });
        }
      });
    });
  }

  /* ================================================================
     Shared cart + checkout (guarded — only activates on pages that
     actually include the cart drawer / checkout modal markup, and
     only uses product data if products-data.js has been loaded).
     ================================================================ */
  var cartDrawer = document.getElementById('cartDrawer');
  var checkoutModal = document.getElementById('checkoutModal');
  var catalogue = (typeof ALL_PRODUCTS !== 'undefined') ? ALL_PRODUCTS : [];

  if (cartDrawer && checkoutModal) {
    (function () {
      function money(n) { return '₵' + n.toFixed(2); }
      function findProduct(id) { return catalogue.find(function (p) { return p.id === id; }); }

      var cart = {};
      try { cart = JSON.parse(localStorage.getItem('prymcare_cart') || '{}'); } catch (e) { cart = {}; }
      function saveCart() { try { localStorage.setItem('prymcare_cart', JSON.stringify(cart)); } catch (e) {} }

      function addToCart(id, qty) {
        if (!cart[id]) cart[id] = { qty: 0 };
        cart[id].qty += qty;
        saveCart();
        updateCartUI();
      }
      function changeCartQty(id, delta) {
        if (!cart[id]) return;
        cart[id].qty += delta;
        if (cart[id].qty <= 0) delete cart[id];
        saveCart();
        updateCartUI();
      }
      function removeFromCart(id) { delete cart[id]; saveCart(); updateCartUI(); }
      function cartCount() { return Object.values(cart).reduce(function (s, i) { return s + i.qty; }, 0); }
      function cartSubtotal() {
        return Object.entries(cart).reduce(function (sum, entry) {
          var p = findProduct(entry[0]);
          return p ? sum + p.price * entry[1].qty : sum;
        }, 0);
      }

      var cartBadge = document.getElementById('cartBadge');
      var qbBadge = document.getElementById('qbBadge');
      var cartItemsEl = document.getElementById('cartItems');
      var cartFoot = document.getElementById('cartFoot');
      var cartSubtotalEl = document.getElementById('cartSubtotal');

      function updateCartUI() {
        var count = cartCount();
        [cartBadge, qbBadge].forEach(function (el) {
          if (el) { el.textContent = count; el.style.display = count > 0 ? 'flex' : 'none'; }
        });

        var entries = Object.entries(cart);
        if (entries.length === 0) {
          cartItemsEl.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg><p>Your cart is empty.<br>Browse products and add a few favourites.</p></div>';
          cartFoot.style.display = 'none';
        } else {
          cartItemsEl.innerHTML = entries.map(function (entry) {
            var id = entry[0], item = entry[1];
            var p = findProduct(id);
            if (!p) return '';
            return '' +
              '<div class="cart-item" data-id="' + id + '">' +
                '<div class="cart-item-media"><img src="' + (window.__ASSET_BASE__ || '') + 'assets/products/' + p.img + '.svg" alt="' + p.name + '"></div>' +
                '<div class="cart-item-info">' +
                  '<h4>' + p.name + '</h4>' +
                  '<div class="price">' + money(p.price) + ' × ' + item.qty + ' = <strong>' + money(p.price * item.qty) + '</strong></div>' +
                  '<div class="cart-item-controls">' +
                    '<div class="qty-stepper">' +
                      '<button type="button" class="qty-minus" aria-label="Decrease quantity">−</button>' +
                      '<span class="qty-val">' + item.qty + '</span>' +
                      '<button type="button" class="qty-plus" aria-label="Increase quantity">+</button>' +
                    '</div>' +
                    '<button type="button" class="cart-item-remove">Remove</button>' +
                  '</div>' +
                '</div>' +
              '</div>';
          }).join('');
          cartFoot.style.display = 'block';
          cartSubtotalEl.textContent = money(cartSubtotal());

          cartItemsEl.querySelectorAll('.cart-item').forEach(function (row) {
            var id = row.dataset.id;
            row.querySelector('.qty-minus').addEventListener('click', function () { changeCartQty(id, -1); });
            row.querySelector('.qty-plus').addEventListener('click', function () { changeCartQty(id, 1); });
            row.querySelector('.cart-item-remove').addEventListener('click', function () { removeFromCart(id); });
          });
        }
      }

      var overlay = document.getElementById('overlay');
      function anyPanelOpen() { return cartDrawer.classList.contains('show') || checkoutModal.classList.contains('show'); }
      function showOverlay() { overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
      function hideOverlayIfNoneOpen() { if (!anyPanelOpen()) { overlay.classList.remove('show'); document.body.style.overflow = ''; } }
      function openCart() { cartDrawer.classList.add('show'); showOverlay(); }
      function closeCart() { cartDrawer.classList.remove('show'); hideOverlayIfNoneOpen(); }

      function renderOrderRecap() {
        var rows = Object.entries(cart).map(function (entry) {
          var p = findProduct(entry[0]);
          if (!p) return '';
          return '<div class="order-recap-row"><span>' + p.name + ' × ' + entry[1].qty + '</span><span>' + money(p.price * entry[1].qty) + '</span></div>';
        }).join('');
        document.getElementById('orderRecap').innerHTML = rows + '<div class="order-recap-row total"><span>Total</span><span>' + money(cartSubtotal()) + '</span></div>';
      }
      function openCheckout() {
        if (cartCount() === 0) return;
        renderOrderRecap();
        checkoutModal.classList.add('show');
        showOverlay();
      }
      function closeCheckout() { checkoutModal.classList.remove('show'); hideOverlayIfNoneOpen(); }

      var cartOpenBtn = document.getElementById('cartOpenBtn');
      var qbCartBtn = document.getElementById('qbCartBtn');
      if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCart);
      if (qbCartBtn) qbCartBtn.addEventListener('click', openCart);
      var cartCloseBtn = document.getElementById('cartCloseBtn');
      if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
      var checkoutOpenBtn = document.getElementById('checkoutOpenBtn');
      if (checkoutOpenBtn) checkoutOpenBtn.addEventListener('click', function () { closeCart(); openCheckout(); });
      var checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
      if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckout);
      if (overlay) overlay.addEventListener('click', function () { closeCart(); closeCheckout(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCart(); closeCheckout(); } });

      var toastEl = document.getElementById('toast');
      var toastTimer;
      function showToast(msg) {
        if (!toastEl) return;
        document.getElementById('toastMsg').textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
      }

      var checkoutForm = document.getElementById('checkoutForm');
      if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
          e.preventDefault();
          if (!checkoutForm.checkValidity()) { checkoutForm.reportValidity(); return; }

          var name = document.getElementById('coName').value.trim();
          var phone = document.getElementById('coPhone').value.trim();
          var email = document.getElementById('coEmail').value.trim();
          var address = document.getElementById('coAddress').value.trim();
          var notes = document.getElementById('coNotes').value.trim();

          var lines = [];
          lines.push('Hi PrymCare Health, I would like to place an order:');
          lines.push('');
          Object.entries(cart).forEach(function (entry) {
            var p = findProduct(entry[0]);
            if (p) lines.push('- ' + p.name + ' x' + entry[1].qty + ' = ' + money(p.price * entry[1].qty));
          });
          lines.push('');
          lines.push('TOTAL: ' + money(cartSubtotal()));
          lines.push('');
          lines.push('Name: ' + name);
          lines.push('Phone: ' + phone);
          if (email) lines.push('Email: ' + email);
          lines.push('Delivery Address: ' + address);
          if (notes) lines.push('Notes: ' + notes);

          var message = encodeURIComponent(lines.join('\n'));
          window.open('https://wa.me/233544003712?text=' + message, '_blank', 'noopener');

          showToast('Order ready — check WhatsApp to send it!');
          cart = {};
          saveCart();
          updateCartUI();
          checkoutForm.reset();
          setTimeout(function () { closeCheckout(); }, 600);
        });
      }

      /* Wire any product card / buy-row on the page: qty stepper + add-to-cart button.
         Works for shop.html's grid (many `.prod-card[data-id]`) and individual product
         pages (one `.product-buy-row` with a `data-id` on its ancestor). */
      function wireBuyControl(container, id) {
        var qtyVal = container.querySelector('.qty-val');
        var localQty = qtyVal ? (parseInt(qtyVal.textContent, 10) || 1) : 1;
        var minus = container.querySelector('.qty-minus');
        var plus = container.querySelector('.qty-plus');
        if (minus) minus.addEventListener('click', function (e) { if (e.stopPropagation) e.stopPropagation(); localQty = Math.max(1, localQty - 1); qtyVal.textContent = localQty; });
        if (plus) plus.addEventListener('click', function (e) { if (e.stopPropagation) e.stopPropagation(); localQty = Math.min(20, localQty + 1); qtyVal.textContent = localQty; });
        var addBtn = container.querySelector('button.add-cart-btn');
        if (addBtn) addBtn.addEventListener('click', function (e) {
          if (e.stopPropagation) e.stopPropagation();
          addToCart(id, localQty);
          var p = findProduct(id);
          showToast((p ? p.name : 'Item') + ' added to cart');
        });
      }

      document.querySelectorAll('.prod-card[data-id]').forEach(function (card) {
        wireBuyControl(card, card.dataset.id);
        card.addEventListener('click', function (e) {
          if (e.target.closest('.qty-stepper') || e.target.closest('.add-cart-btn')) return;
          if (card.dataset.href) window.location.href = card.dataset.href;
        });
      });
      var singleBuyRow = document.querySelector('[data-product-id] .product-buy-row');
      var singleBuyWrap = document.querySelector('[data-product-id]');
      if (singleBuyRow && singleBuyWrap) {
        wireBuyControl(singleBuyRow, singleBuyWrap.dataset.productId);
      }

      updateCartUI();
    })();
  }

  /* ---------- Shop catalogue filter / search / sort (guarded to shop.html only) ---------- */
  var shopGrid = document.getElementById('shopGrid');
  if (shopGrid) {
    (function () {
      var noResults = document.getElementById('noResults');
      var resultCount = document.getElementById('resultCount');
      var activeFilter = 'all';
      var searchTerm = '';
      var sortMode = 'default';

      function applyProductFilter() {
        var cards = Array.from(shopGrid.querySelectorAll('.prod-card'));
        var visibleCount = 0;
        cards.forEach(function (card) {
          var matchCat = activeFilter === 'all' || card.dataset.cat === activeFilter;
          var matchSearch = !searchTerm || card.textContent.toLowerCase().includes(searchTerm);
          var show = matchCat && matchSearch;
          card.style.display = show ? '' : 'none';
          if (show) visibleCount++;
        });
        if (noResults) noResults.classList.toggle('show', visibleCount === 0);
        if (resultCount) resultCount.textContent = visibleCount + ' product' + (visibleCount !== 1 ? 's' : '');
      }

      function applySort() {
        var cards = Array.from(shopGrid.querySelectorAll('.prod-card'));
        cards.sort(function (a, b) {
          if (sortMode === 'price-asc') {
            var pa = a.dataset.price ? parseFloat(a.dataset.price) : Infinity;
            var pb = b.dataset.price ? parseFloat(b.dataset.price) : Infinity;
            return pa - pb;
          }
          if (sortMode === 'price-desc') {
            var pa2 = a.dataset.price ? parseFloat(a.dataset.price) : -Infinity;
            var pb2 = b.dataset.price ? parseFloat(b.dataset.price) : -Infinity;
            return pb2 - pa2;
          }
          if (sortMode === 'rating') {
            var ra = parseFloat(a.dataset.rating), rb = parseFloat(b.dataset.rating);
            if (rb !== ra) return rb - ra;
            return parseInt(b.dataset.reviews, 10) - parseInt(a.dataset.reviews, 10);
          }
          if (sortMode === 'name') {
            var na = a.querySelector('h3').textContent, nb = b.querySelector('h3').textContent;
            return na.localeCompare(nb);
          }
          return 0;
        });
        cards.forEach(function (card) { shopGrid.appendChild(card); });
      }

      function setFilter(key) {
        activeFilter = key;
        document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.filter === key); });
        applyProductFilter();
      }

      document.querySelectorAll('.filter-btn').forEach(function (btn) { btn.addEventListener('click', function () { setFilter(btn.dataset.filter); }); });
      var shopSearch = document.getElementById('shopSearch');
      if (shopSearch) shopSearch.addEventListener('input', function (e) { searchTerm = e.target.value.trim().toLowerCase(); applyProductFilter(); });
      var sortSelect = document.getElementById('sortSelect');
      if (sortSelect) sortSelect.addEventListener('change', function (e) { sortMode = e.target.value; applySort(); applyProductFilter(); });

      var urlParams = new URLSearchParams(window.location.search);
      var catParam = urlParams.get('cat');
      if (catParam) { setFilter(catParam); } else { applyProductFilter(); }
    })();
  }

});
