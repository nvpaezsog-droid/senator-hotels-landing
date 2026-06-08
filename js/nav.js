// ── NAV ──
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    const scrolled = scrollY > 80;
    nav.classList.toggle('s', scrolled);
    const logoImg = document.getElementById('navLogoImg');
    if (logoImg) {
      logoImg.style.filter = scrolled
        ? 'brightness(0) saturate(100%) invert(13%) sepia(55%) saturate(800%) hue-rotate(175deg) brightness(70%)'
        : 'none';
    }
  });
}

// ── GEO LINES ──
function initGeoLines() {
  const geo = document.getElementById('geo');
  if (!geo) return;
  for (let i = 0; i < 12; i++) {
    const line = document.createElement('div');
    line.className = 'geo-line';
    const isH = Math.random() > .5;
    if (isH) {
      line.style.cssText = `top:${Math.random()*100}%;left:0;right:0;height:1px;transform:scaleX(0);animation:gl ${3+Math.random()*4}s ${Math.random()*4}s ease-in-out infinite alternate`;
    } else {
      line.style.cssText = `left:${Math.random()*100}%;top:0;bottom:0;width:1px;transform:scaleY(0);animation:gv ${3+Math.random()*4}s ${Math.random()*4}s ease-in-out infinite alternate`;
    }
    geo.appendChild(line);
  }
  const geoStyle = document.createElement('style');
  geoStyle.textContent = '@keyframes gl{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}@keyframes gv{from{transform:scaleY(0);transform-origin:top}to{transform:scaleY(1);transform-origin:top}}';
  document.head.appendChild(geoStyle);
}

// ── HERO GRID ──
function initHeroGrid() {
  setTimeout(() => {
    document.querySelectorAll('.hg-cell').forEach(c => c.classList.add('on'));
  }, 200);
}
