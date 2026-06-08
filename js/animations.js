// ── PSTRIP animate top border on scroll ──
const pso=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');}),{threshold:.5});
document.querySelectorAll('.pstrip').forEach(el=>pso.observe(el));

// ── REVEAL ──
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');}),{threshold:.08});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

// ── COUNT UP ──
function cu(el){
  const t=parseInt(el.dataset.target),f=el.dataset.fmt||'',s=el.dataset.suffix||'',dur=1800,st=Date.now();
  (function tick(){const p=Math.min((Date.now()-st)/dur,1),e=1-Math.pow(1-p,3),v=Math.round(t*e);
    el.textContent=f==='comma'?v.toLocaleString('es-ES')+s:v+s;
    if(p<1)requestAnimationFrame(tick);})();
}
const co=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&e.target.dataset.target){cu(e.target);co.unobserve(e.target);}}),{threshold:.4});
document.querySelectorAll('[data-target]').forEach(el=>co.observe(el));
