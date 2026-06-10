// ── VENTAS ANIMATION ──
function initVentasAnimation() {
  const ventEl = document.getElementById('ventas');
  if (!ventEl) return;

  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      document.querySelectorAll('.vent-icon-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('on'), i * 160 + 100);
      });
      document.querySelectorAll('.vent-dm-circle').forEach((el, i) => {
        setTimeout(() => {
          el.style.transition = 'transform .65s cubic-bezier(.34,1.56,.64,1) ' + i * .18 + 's, opacity .4s ease ' + i * .18 + 's, border-color .3s';
          el.classList.add('on');
        }, i * 180 + 300);
      });
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -100px 0px' }).observe(ventEl);
}

// ── SECTION ARROWS ──
function initSectionArrows() {
  const arrowSVG = `<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`;

  SECTION_ARROWS.forEach(s => {
    const el = document.querySelector(s.from);
    if (!el) return;
    const arrow = document.createElement('div');
    arrow.className = 'sec-arrow' + (s.dark ? ' sec-arrow-w' : '');
    arrow.style.background = s.bg || (s.dark ? 'var(--color-dark)' : 'var(--color-white)');
    if (s.pad) {
      const h = s.pad * 2 + 64;
      arrow.style.height = h + 'px';
      arrow.style.marginTop = -(h / 2) + 'px';
      arrow.style.marginBottom = -(h / 2) + 'px';
    }
    if (s.padBot) { arrow.style.marginBottom = (s.padBot - 32) + 'px'; }
    arrow.innerHTML = `<a href="${s.to}" aria-label="Siguiente sección">${arrowSVG}</a>`;
    if (s.inside) {
      arrow.style.position = 'absolute';
      arrow.style.bottom = '28px';
      arrow.style.left = '0';
      arrow.style.right = '0';
      arrow.style.margin = '0';
      el.appendChild(arrow);
    } else {
      el.insertAdjacentElement('afterend', arrow);
    }
  });

  // Fix scroll offset for #posicion-financiera anchor
  const posLink = document.querySelector('a[href="#posicion-financiera"]');
  if (posLink) {
    posLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('posicion-financiera');
      const navH = document.querySelector('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  // Fix scroll para #sostenibilidad: las imágenes lazy cargadas durante el
  // scroll desplazan el layout, así que el destino calculado al inicio queda
  // desviado. Se anima el scroll manualmente recalculando el destino en cada
  // frame, de modo que se aterriza directo en la sección sin pasarse.
  const sostLink = document.querySelector('.n-links a[href="#sostenibilidad"]');
  if (sostLink) {
    let pending = 0;
    sostLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('sostenibilidad');
      const dist = Math.abs(target.getBoundingClientRect().top - 80);
      if (dist < 4) return; // ya estamos en la sección
      const token = ++pending;
      const startY = window.pageYOffset;
      const duration = Math.min(1400, 500 + dist * 0.045);
      const start = performance.now();
      const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const step = now => {
        if (token !== pending) return; // otra navegación o scroll manual
        const t = Math.min((now - start) / duration, 1);
        const destY = window.pageYOffset + target.getBoundingClientRect().top - 80;
        window.scrollTo({ top: startY + (destY - startY) * ease(t), behavior: 'instant' });
        if (t < 1) { requestAnimationFrame(step); return; }
        // mantiene la posición ~700ms más mientras acaban de cargar imágenes
        const until = now + 700;
        const pin = ts => {
          if (token !== pending || ts > until) return;
          const off = target.getBoundingClientRect().top - 80;
          if (Math.abs(off) > 1 && Math.abs(off) < 2500) {
            window.scrollBy({ top: off, behavior: 'instant' });
          }
          requestAnimationFrame(pin);
        };
        requestAnimationFrame(pin);
      };
      requestAnimationFrame(step);
    });
    // otra navegación o un gesto de scroll del usuario cancela la animación
    document.querySelectorAll('.n-links a:not([href="#sostenibilidad"])').forEach(a =>
      a.addEventListener('click', () => pending++));
    ['wheel', 'touchstart'].forEach(ev =>
      addEventListener(ev, () => pending++, { passive: true }));
  }
}
