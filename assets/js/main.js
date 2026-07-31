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

});
