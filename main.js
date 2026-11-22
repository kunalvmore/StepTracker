// Step Tracker website — small, dependency-free interactions.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav: glass background once the page scrolls; mobile menu toggle.
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('menu-open')));
  }

  // Split the hero headline into words for the staggered entrance.
  document.querySelectorAll('[data-split]').forEach(el => {
    let i = 0;
    el.innerHTML = el.innerHTML.split(/(<br\s*\/?>)/).map(part => {
      if (part.startsWith('<br')) return part;
      return part.split(' ').filter(Boolean).map(w => `<span class="w" style="--i:${i++}">${w}</span>`).join(' ');
    }).join('');
  });

  // Scroll reveal.
  const targets = document.querySelectorAll('.reveal, .stagger, .visual, .widgets-in, .duo-in');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
  }

  if (reduce) return;

  // Hero phone: gentle 3D tilt that follows the pointer.
  const stage = document.querySelector('.stage');
  const tilt = stage && stage.querySelector('.tilt');
  if (tilt && matchMedia('(hover: hover)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / innerWidth) * 14;
      ty = ((e.clientY - (r.top + r.height / 2)) / innerHeight) * -10;
    }, { passive: true });
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      tilt.style.transform = `rotateY(${cx.toFixed(2)}deg) rotateX(${cy.toFixed(2)}deg)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  // Parallax: phones drift a little slower than the page.
  const par = [...document.querySelectorAll('[data-parallax]')];
  if (par.length && matchMedia('(min-width: 981px)').matches) {
    const update = () => {
      const vh = innerHeight;
      par.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));   // -1 … 1 around the centre
        el.style.transform = `translate3d(0, ${(p * -parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    let ticking = false;
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // iPhone Duo: the screen folds open as it scrolls into view.
  const duo = document.querySelector('.duo-hinge');
  if (duo) {
    duo.style.setProperty('--fold', '28deg');
    const io2 = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { duo.style.setProperty('--fold', '0deg'); io2.disconnect(); }
    }), { threshold: 0.35 });
    io2.observe(duo);
  }

  // Live Activities: the walk timer and steps keep going, like the real thing.
  const las = document.querySelectorAll('[data-la]');
  if (las.length) {
    let secs = 12 * 60 + 50, steps = 1288;
    const goal = 28 * 60;
    const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    setInterval(() => {
      secs = secs >= goal ? 12 * 60 + 50 : secs + 1;
      steps += 1 + (Math.random() < 0.6 ? 1 : 0);
      if (secs === 12 * 60 + 50) steps = 1288;
      las.forEach(la => {
        la.querySelectorAll('[data-la-time]').forEach(t => t.textContent = fmt(secs));
        la.querySelectorAll('[data-la-steps]').forEach(t => t.textContent = steps.toLocaleString('en-US'));
        la.querySelectorAll('[data-la-bar]').forEach(b => b.style.width = `${(secs / goal * 100).toFixed(1)}%`);
      });
    }, 1000);
  }

  // Count-up numbers.
  document.querySelectorAll('[data-count]').forEach(el => {
    const end = parseFloat(el.dataset.count);
    const run = () => {
      const t0 = performance.now(), dur = 1400;
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(end * e).toLocaleString('en-US');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io3 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(); io3.disconnect(); } }), { threshold: 0.5 });
    io3.observe(el);
  });

  // FAQ: smooth open and close.
  document.querySelectorAll('details').forEach(d => {
    const summary = d.querySelector('summary');
    const body = d.querySelector('.answer');
    summary.addEventListener('click', e => {
      e.preventDefault();
      if (d.dataset.busy) return;
      d.dataset.busy = '1';
      if (!d.open) {
        d.open = true;
        const h = body.scrollHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' })
          .onfinish = () => delete d.dataset.busy;
      } else {
        const h = body.scrollHeight;
        body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: 'cubic-bezier(.4,0,.2,1)' })
          .onfinish = () => { d.open = false; delete d.dataset.busy; };
      }
    });
  });

  // Legal pages: highlight the section you're reading.
  const toc = document.querySelectorAll('.toc a');
  if (toc.length) {
    const map = new Map([...toc].map(a => [a.getAttribute('href').slice(1), a]));
    const io4 = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { toc.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); }
    }), { rootMargin: '-30% 0px -60% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io4.observe(s); });
  }
})();
