// ── GRÁFICOS FINANCIEROS ──
function initFinancialCharts() {
  const navy      = '#00263D';
  const navyLight = '#8BAABA';
  const font      = "'DM Mono',monospace";

  Chart.defaults.font.family = font;
  Chart.defaults.color = 'rgba(0,38,61,0.45)';
  const anim = { duration: 2000, easing: 'easeOutCubic', x: { from: 0 } };

  function build() {
    new Chart(document.getElementById('chartFacturacion'), {
      type: 'bar',
      data: {
        labels: facturacionData.labels,
        datasets: [{
          label: 'Facturación',
          data: facturacionData.values,
          backgroundColor: navy,
          borderRadius: 2,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        animation: anim,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => ' ' + c.raw + 'M€' } }
        },
        scales: {
          x: { grid: { color: 'rgba(0,38,61,0.06)' }, ticks: { callback: v => v + 'M€', font: { size: 10 } }, border: { display: false } },
          y: { grid: { display: false }, ticks: { font: { size: 11, weight: '500' }, color: navy }, border: { display: false } }
        }
      },
      plugins: [{
        afterDatasetsDraw(chart) {
          const ctx = chart.ctx;
          chart.data.datasets[0].data.forEach((v, i) => {
            const b = chart.getDatasetMeta(0).data[i];
            if (!b) return;
            ctx.fillStyle = navy;
            ctx.font = '500 11px ' + font;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(v + 'M€', b.x + 6, b.y);
          });
        }
      }]
    });

    new Chart(document.getElementById('chartGOP'), {
      type: 'bar',
      data: {
        labels: gopData.labels,
        datasets: [
          {
            label: 'EMEA',
            data: gopData.emea,
            backgroundColor: c => c.raw < 0 ? 'rgba(0,38,61,0.25)' : navy,
            borderRadius: 2,
            borderSkipped: false
          },
          {
            label: 'AMER',
            data: gopData.amer,
            backgroundColor: c => c.raw < 0 ? 'rgba(139,170,186,0.35)' : navyLight,
            borderRadius: 2,
            borderSkipped: false
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        animation: anim,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => ' ' + c.dataset.label + ': ' + c.raw + 'M€' } }
        },
        scales: {
          x: { grid: { color: 'rgba(0,38,61,0.06)' }, ticks: { callback: v => v + 'M', font: { size: 10 } }, border: { display: false } },
          y: { grid: { display: false }, ticks: { font: { size: 11, weight: '500' }, color: navy }, border: { display: false } }
        }
      }
    });
  }

  let built = false;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !built) {
      built = true;
      build();
    }
  }, { threshold: 0, rootMargin: '0px 0px -80px 0px' })
    .observe(document.getElementById('graficos-financieros'));
}

// ── FIDELIZACIÓN CHART ──
function initFidelizacionChart() {
  function fmt(n) { return n.toLocaleString('es-ES'); }

  function buildLegend() {
    const el = document.getElementById('fidLegend');
    if (!el) return;
    el.innerHTML = fidelizacionDonutData.map(d =>
      '<div class="fid-legend-item"><div class="fid-legend-dot" style="background:' + d.color + '"></div>'
      + '<span class="fid-legend-lbl">' + d.label + ': <strong>' + fmt(d.val) + '</strong></span></div>'
    ).join('');
  }

  let fidLogW = 520;
  const fidLogH = 260;

  function drawBar(prog) {
    const c = document.getElementById('fidBarChart');
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = fidLogW, H = fidLogH;
    ctx.clearRect(0, 0, W, H);
    const yearW = 50, rightPad = 100, barAreaW = W - yearW - rightPad;
    const maxVal = 825297;
    const barH = 28, gap = 16;
    const rows = fidelizacionBarData.length;
    const totalH = rows * barH + (rows - 1) * gap;
    const topOff = Math.round((H - totalH) / 2);
    const lineX = [], lineY = [];

    fidelizacionBarData.forEach((d, i) => {
      const y = topOff + i * (barH + gap);
      const fullW = (d.val / maxVal) * barAreaW;
      const animW = fullW * prog;

      ctx.fillStyle = 'rgba(0,38,61,0.08)';
      ctx.fillRect(yearW, y, barAreaW, barH);
      ctx.fillStyle = '#00263D';
      ctx.fillRect(yearW, y, animW, barH);

      ctx.fillStyle = '#00263D';
      ctx.font = '500 10px "DM Mono",monospace';
      ctx.textAlign = 'right';
      ctx.fillText(d.year, yearW - 8, y + barH / 2 + 4);

      if (animW > 68) {
        ctx.fillStyle = '#fff';
        ctx.font = '600 11px "DM Sans",sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(fmt(d.val), yearW + animW - 8, y + barH / 2 + 4);
      }

      if (d.delta && prog > 0.45) {
        const alpha = Math.min(1, (prog - 0.45) / 0.35);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(0,38,61,0.5)';
        ctx.font = '10px "DM Sans",sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('+' + fmt(d.delta), yearW + fullW + 8, y + barH / 2 + 4);
        ctx.restore();
      }

      lineX.push(yearW + animW);
      lineY.push(y + barH / 2);
    });

    if (prog > 0.05) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, (prog - 0.05) / 0.3);
      ctx.strokeStyle = 'rgba(0,38,61,0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      lineX.forEach((x, i) => { i === 0 ? ctx.moveTo(x, lineY[i]) : ctx.lineTo(x, lineY[i]); });
      ctx.stroke();
      ctx.setLineDash([]);
      lineX.forEach((x, i) => {
        ctx.fillStyle = '#00263D';
        ctx.beginPath();
        ctx.arc(x, lineY[i], 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      ctx.restore();
    }
  }

  function drawDonut(prog) {
    const c = document.getElementById('fidDonut');
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = 200, H = 200;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const OR = Math.min(W, H) * 0.46, IR = OR * 0.52;
    let angle = -Math.PI / 2;
    const drawn = Math.PI * 2 * prog;
    let cum = 0;
    fidelizacionDonutData.forEach(d => {
      const seg = (d.val / FIDELIZACION_TOTAL) * Math.PI * 2;
      const draw = Math.min(seg, Math.max(0, drawn - cum));
      if (draw > 0.005) {
        ctx.beginPath();
        ctx.arc(cx, cy, OR, angle, angle + draw);
        ctx.arc(cx, cy, IR, angle + draw, angle, true);
        ctx.closePath();
        ctx.fillStyle = d.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      cum += seg;
      angle += seg;
    });
  }

  let fidAnimated = false;

  function fidAnimate() {
    if (fidAnimated) return;
    fidAnimated = true;
    const dpr = window.devicePixelRatio || 1;
    const bc = document.getElementById('fidBarChart');
    if (bc) {
      fidLogW = Math.round(bc.offsetWidth) || 520;
      bc.width = fidLogW * dpr;
      bc.height = fidLogH * dpr;
      bc.style.width = fidLogW + 'px';
      bc.style.height = fidLogH + 'px';
      bc.getContext('2d').scale(dpr, dpr);
    }
    const dc = document.getElementById('fidDonut');
    if (dc) {
      dc.width = 200 * dpr; dc.height = 200 * dpr;
      dc.style.width = '200px'; dc.style.height = '200px';
      dc.getContext('2d').scale(dpr, dpr);
    }
    buildLegend();
    const dur = 2800, start = Date.now();
    (function frame() {
      const t = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      drawBar(e);
      drawDonut(e);
      if (t < 1) requestAnimationFrame(frame);
    })();
  }

  const fidEl = document.getElementById('fidelizacion');
  if (fidEl) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { fidAnimate(); } });
    }, { threshold: 0.2 }).observe(fidEl);
  }
}

// ── DIGITAL CHART ──
function initDigitalChart() {
  const DPR = window.devicePixelRatio || 1;
  let digLogW = 0;
  const digLogH = 300;

  function setupBar() {
    const c = document.getElementById('digBarChart');
    if (!c) return;
    digLogW = c.offsetWidth || 400;
    c.width = digLogW * DPR; c.height = digLogH * DPR;
    c.style.width = digLogW + 'px'; c.style.height = digLogH + 'px';
    c.getContext('2d').scale(DPR, DPR);
  }

  function setupRing(id) {
    const c = document.getElementById(id);
    if (!c) return;
    c.width = 110 * DPR; c.height = 110 * DPR;
    c.style.width = '110px'; c.style.height = '110px';
    c.getContext('2d').scale(DPR, DPR);
  }

  function drawBars(prog) {
    const c = document.getElementById('digBarChart');
    if (!c || !digLogW) return;
    const ctx = c.getContext('2d');
    const W = digLogW, H = digLogH;
    ctx.clearRect(0, 0, W, H);
    const maxVal = 253, n = digitalBarData.length;
    const topPad = 8, botPad = 6;
    const chartH = H - topPad - botPad;
    const colW = Math.floor(W / n);
    const barW = Math.floor(colW * 0.58);

    digitalBarData.forEach((d, i) => {
      const colX = i * colW;
      const x = colX + Math.floor((colW - barW) / 2);
      const fullH = Math.sqrt(d.val / maxVal) * chartH;
      const animH = fullH * prog;
      const barTop = H - botPad - animH;

      ctx.fillStyle = d.color;
      ctx.fillRect(x, barTop, barW, animH);

      if (animH > 16) {
        ctx.save();
        ctx.translate(x + barW / 2, barTop + animH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px "DM Sans",sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.label, 0, 0);
        ctx.restore();
      }
    });
  }

  function drawRing(cfg, prog) {
    const c = document.getElementById(cfg.id);
    if (!c) return;
    const ctx = c.getContext('2d');
    const S = 110;
    ctx.clearRect(0, 0, S, S);
    const cx = S / 2, cy = S / 2, r = 44, lw = 9;
    const start = -Math.PI / 2;
    const end = start + Math.PI * 2 * cfg.pct * prog;

    ctx.strokeStyle = '#E0E4E8';
    ctx.lineWidth = lw;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#00263D';
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    ctx.stroke();

    ctx.fillStyle = '#00263D';
    ctx.font = 'bold 16px "DM Sans",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cfg.big, cx, cfg.small ? cy - 7 : cy);
    if (cfg.small) {
      ctx.font = '500 8px "DM Mono",monospace';
      ctx.fillStyle = 'rgba(0,38,61,0.5)';
      ctx.fillText(cfg.small, cx, cy + 9);
    }
  }

  let digAnimated = false;

  function digAnimate() {
    if (digAnimated) return;
    digAnimated = true;
    setupBar();
    digitalRingData.forEach(r => setupRing(r.id));
    const dur = 2800, start = Date.now();
    (function frame() {
      const t = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      drawBars(e);
      digitalRingData.forEach(r => drawRing(r, e));
      if (t < 1) requestAnimationFrame(frame);
    })();
  }

  const digEl = document.getElementById('digital');
  if (digEl) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { digAnimate(); } });
    }, { threshold: 0.35, rootMargin: '0px 0px -80px 0px' }).observe(digEl);
  }
}

// ── REVALORIZACIÓN CHART ──
function initRevalorizacionChart() {
  const DPR    = window.devicePixelRatio || 1;
  const ORANGE = '#F5A623';
  const BAR    = '#728FA6';
  let revLogW  = 0;
  const revLogH = 260;

  function setupRev() {
    const c = document.getElementById('revChart');
    if (!c) return;
    revLogW = c.offsetWidth || 560;
    c.width = revLogW * DPR; c.height = revLogH * DPR;
    c.style.width = revLogW + 'px'; c.style.height = revLogH + 'px';
    c.getContext('2d').scale(DPR, DPR);
  }

  function drawRev(barP, lineP) {
    const c = document.getElementById('revChart');
    if (!c || !revLogW) return;
    const ctx = c.getContext('2d');
    const W = revLogW, H = revLogH;
    ctx.clearRect(0, 0, W, H);
    const n = revalorizacionData.length, botPad = 26, topPad = 22, chartH = H - botPad - topPad;
    const maxT = 109.3, maxA = 14;
    const colW = W / n, barW = Math.floor(colW * 0.55);
    const linePoints = [];

    revalorizacionData.forEach((d, i) => {
      const cx = i * colW + colW / 2;
      const x = cx - barW / 2;
      const fullH = (d.total / maxT) * chartH;
      const animH = fullH * barP;
      const barTop = H - botPad - animH;

      ctx.fillStyle = BAR;
      ctx.fillRect(x, barTop, barW, animH);

      if (barP > 0.3) {
        const a = Math.min(1, (barP - 0.3) / 0.4);
        ctx.save(); ctx.globalAlpha = a;
        ctx.fillStyle = '#fff';
        ctx.font = '600 9px "DM Sans",sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('€' + d.total + 'M', cx, barTop - 3);
        ctx.restore();
      }

      if (d.annual > 0 && barP > 0.55) {
        const a2 = Math.min(1, (barP - 0.55) / 0.35);
        ctx.save(); ctx.globalAlpha = a2;
        ctx.translate(cx, barTop + animH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px "DM Sans",sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('+' + d.annual, 0, 0);
        ctx.restore();
      }

      ctx.fillStyle = 'rgba(255,255,255,.45)';
      ctx.font = '9px "DM Mono",monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(d.year, cx, H - botPad + 6);

      if (d.annual >= 0) {
        const lineAreaTop = topPad + chartH * 0.35;
        const lineAreaH = chartH * 0.4;
        const ly = lineAreaTop + lineAreaH - (d.annual / maxA) * lineAreaH;
        linePoints.push({ x: cx, y: ly });
      }
    });

    if (lineP > 0 && linePoints.length > 1) {
      const total = linePoints.length - 1;
      const drawTo = lineP * total;
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 2;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.setLineDash([]);
      ctx.beginPath();
      linePoints.forEach((p, i) => {
        if (i === 0) { ctx.moveTo(p.x, p.y); }
        else if (i <= drawTo) { ctx.lineTo(p.x, p.y); }
        else if (i - 1 < drawTo) {
          const f = drawTo - (i - 1);
          const prev = linePoints[i - 1];
          ctx.lineTo(prev.x + (p.x - prev.x) * f, prev.y + (p.y - prev.y) * f);
        }
      });
      ctx.stroke();
      linePoints.forEach((p, i) => {
        if (i <= drawTo) {
          ctx.fillStyle = ORANGE;
          ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#0B1F30';
          ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        }
      });
    }
  }

  let revAnimated = false;

  function revAnimate() {
    if (revAnimated) return;
    revAnimated = true;
    setupRev();
    const dur = 3400, start = Date.now();
    (function frame() {
      const t = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      drawRev(Math.min(1, e * 1.4), Math.max(0, (e - 0.35) / 0.65));
      if (t < 1) requestAnimationFrame(frame);
    })();
  }

  const revEl = document.getElementById('revalor');
  if (revEl) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { revAnimate(); } });
    }, { threshold: 0.35, rootMargin: '0px 0px -80px 0px' }).observe(revEl);
  }
}
