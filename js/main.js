/* MBA Construction SA — interactions (vanilla) */
(function () {
  'use strict';

  // Menu mobile
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    function setMenu(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    // Fermer le menu si on repasse en grand écran
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && nav.classList.contains('open')) setMenu(false);
    });
  }

  // Ombre du header au scroll
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Apparition au scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.14 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Compteurs animés
  function run(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var v = Math.floor((0.5 - Math.cos(p * Math.PI) / 2) * target);
      el.textContent = prefix + v + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // Année courante
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Lightbox galerie : clic pour agrandir + navigation
  var figs = Array.prototype.slice.call(document.querySelectorAll('.gallery figure'));
  figs = figs.filter(function (f) { return f.querySelector('img'); });
  if (figs.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Visionneuse de photos');
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Fermer">&times;</button>' +
      '<button class="lightbox__nav lightbox__prev" type="button" aria-label="Précédent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<figure class="lightbox__stage"><img class="lightbox__img" src="" alt=""><figcaption class="lightbox__cap"></figcaption></figure>' +
      '<button class="lightbox__nav lightbox__next" type="button" aria-label="Suivant"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>' +
      '<span class="lightbox__count"></span>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('.lightbox__img');
    var lbCap = lb.querySelector('.lightbox__cap');
    var lbCount = lb.querySelector('.lightbox__count');
    var idx = 0;

    function show(i) {
      idx = (i + figs.length) % figs.length;
      var img = figs[idx].querySelector('img');
      var cap = figs[idx].querySelector('figcaption');
      lbImg.setAttribute('src', img.getAttribute('src'));
      lbImg.setAttribute('alt', img.getAttribute('alt') || '');
      lbCap.innerHTML = cap ? cap.innerHTML : '';
      lbCount.textContent = (idx + 1) + ' / ' + figs.length;
    }
    function open(i) { show(i); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
    function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

    figs.forEach(function (f, i) { f.addEventListener('click', function () { open(i); }); });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox__stage')) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();
