// ── OBSERVER FACTORY ──
function createObserver(selector, callback, options) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) callback(e.target, obs); });
  }, options);
  document.querySelectorAll(selector).forEach(el => obs.observe(el));
  return obs;
}

// ── REVEAL ──
function initReveal() {
  createObserver('.pstrip', (el) => el.classList.add('on'), { threshold: .5 });
  createObserver('.rv',     (el) => el.classList.add('on'), { threshold: .08 });

  // Gastro grids — add .on to the container so nth-child stagger fires in order
  ['.gast-grid', '.gast-grid-2'].forEach(sel => {
    const container = document.querySelector(sel);
    if (!container) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        container.classList.add('on');
        obs.disconnect();
      }
    }, { threshold: 0.08 });
    obs.observe(container);
  });
}

// ── COUNT UP ──
function initCountUp() {
  function animateCount(el) {
    const target = parseInt(el.dataset.target);
    const fmt    = el.dataset.fmt || '';
    const suffix = el.dataset.suffix || '';
    const dur    = 1800;
    const start  = Date.now();
    (function tick() {
      const progress = Math.min((Date.now() - start) / dur, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(target * eased);
      el.textContent = fmt === 'comma' ? value.toLocaleString('es-ES') + suffix : value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    })();
  }

  createObserver('[data-target]', (el, obs) => {
    animateCount(el);
    obs.unobserve(el);
  }, { threshold: .4 });
}
