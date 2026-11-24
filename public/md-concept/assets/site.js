// Material Depot concept redesign — small interactions, no dependencies.
(function () {
  var toastEl = document.getElementById('toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
  }

  // Links and buttons that would go to pages this concept doesn't include
  document.querySelectorAll('[data-concept]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      toast('This page isn’t part of the concept yet.');
    });
  });

  // Carousels: arrow buttons and progress track
  document.querySelectorAll('.rail').forEach(function (rail) {
    var bar = document.querySelector('[data-track="' + rail.id + '"]');
    function update() {
      if (!bar) return;
      var max = rail.scrollWidth - rail.clientWidth;
      var share = rail.clientWidth / rail.scrollWidth;
      bar.style.width = Math.max(share * 100, 12) + '%';
      bar.style.left = (max > 0 ? (rail.scrollLeft / max) * (100 - share * 100) : 0) + '%';
    }
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
  document.querySelectorAll('[data-rail]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var rail = document.getElementById(btn.dataset.rail);
      rail.scrollBy({ left: Number(btn.dataset.dir) * rail.clientWidth * 0.8, behavior: 'smooth' });
    });
  });

  // Experience Centres: show all
  var all = document.getElementById('allCentres');
  if (all) {
    all.addEventListener('click', function () {
      var sec = document.getElementById('centres');
      var open = sec.classList.toggle('all');
      all.setAttribute('aria-expanded', String(open));
      all.textContent = open ? 'Show fewer centres' : 'See all 10 centres';
    });
  }

  // Cart count (kept for this browser session only)
  var countEl = document.getElementById('cartCount');
  function setCount(n) {
    if (!countEl) return;
    countEl.textContent = n;
    countEl.classList.toggle('on', n > 0);
  }
  var stored = 0;
  try { stored = Number(sessionStorage.getItem('mdConceptCart') || 0); } catch (e) {}
  setCount(stored);

  // ----- Product page -----
  var stage = document.getElementById('stageImg');
  if (stage) {
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('.thumbs button'));
    var counter = document.getElementById('counter');
    var current = 0;
    function show(i) {
      current = (i + thumbs.length) % thumbs.length;
      var t = thumbs[current];
      stage.src = t.dataset.src;
      stage.alt = t.dataset.alt;
      stage.classList.toggle('fill', t.dataset.fill === '1');
      thumbs.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === current)); });
      if (counter) counter.lastChild.textContent = (current + 1) + ' / ' + thumbs.length;
    }
    thumbs.forEach(function (b, i) { b.addEventListener('click', function () { show(i); }); });
    // swipe on phones
    var x0 = null;
    stage.parentElement.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.parentElement.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      x0 = null;
    });

    var qty = 1, qtyEl = document.getElementById('qty');
    var minus = document.getElementById('minus'), plus = document.getElementById('plus');
    function setQty(n) {
      qty = Math.min(Math.max(n, 1), 20);
      qtyEl.textContent = qty;
      minus.disabled = qty <= 1;
      plus.disabled = qty >= 20;
    }
    minus.addEventListener('click', function () { setQty(qty - 1); });
    plus.addEventListener('click', function () { setQty(qty + 1); });

    function add() {
      stored += qty;
      try { sessionStorage.setItem('mdConceptCart', String(stored)); } catch (e) {}
      setCount(stored);
      toast(qty + (qty === 1 ? ' mural' : ' murals') + ' added. This is a concept, so no order is placed.');
    }
    document.getElementById('addCart').addEventListener('click', add);
    document.querySelectorAll('[data-addcart]').forEach(function (b) { b.addEventListener('click', add); });

    var wish = document.getElementById('wish');
    wish.addEventListener('click', function () {
      var on = wish.getAttribute('aria-pressed') !== 'true';
      wish.setAttribute('aria-pressed', String(on));
      wish.querySelector('svg').style.fill = on ? '#CC491E' : 'none';
      wish.querySelector('svg').style.stroke = on ? '#CC491E' : 'currentColor';
      toast(on ? 'Saved to your wishlist.' : 'Removed from your wishlist.');
    });

    // Sticky add-to-cart bar on phones once the main button scrolls away
    var mbar = document.getElementById('mbar'), row = document.getElementById('cartRow');
    if (mbar && row && 'IntersectionObserver' in window) {
      document.body.classList.add('has-mbar');
      new IntersectionObserver(function (entries) {
        var hidden = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
        mbar.classList.toggle('on', hidden);
        mbar.setAttribute('aria-hidden', String(!hidden));
        mbar.querySelector('button').tabIndex = hidden ? 0 : -1;
      }).observe(row);
    }

    // On-page section links: underline the section in view
    var links = Array.prototype.slice.call(document.querySelectorAll('.anch a'));
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); });
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      ['overview', 'measurements', 'more'].forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
    }
  }
})();
