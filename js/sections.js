// ── VENTAS ANIMATION ──
(function(){
  var ventObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      document.querySelectorAll('.vent-icon-item').forEach(function(el,i){
        setTimeout(function(){el.classList.add('on');},i*160+100);
      });
      document.querySelectorAll('.vent-dm-circle').forEach(function(el,i){
        setTimeout(function(){
          el.style.transition='transform .65s cubic-bezier(.34,1.56,.64,1) '+i*.18+'s, opacity .4s ease '+i*.18+'s, border-color .3s';
          el.classList.add('on');
        },i*180+300);
      });
      ventObs.unobserve(e.target);
    });
  },{threshold:0.35,rootMargin:'0px 0px -100px 0px'});
  var ventEl=document.getElementById('ventas');
  if(ventEl) ventObs.observe(ventEl);
})();

// ── SECTION ARROWS ──
const arrowSVG = `<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`;
const sections = [
  { from:'#quienes',       to:'#resumen',        dark:false },
  { from:'#resumen',       to:'#rendimiento',    dark:true  },
  { from:'#graficos-financieros', to:'#marcas', dark:false },
  { from:'#marcas',        to:'#portfolio',      dark:true  },
  { from:'#caribe-section', to:'#origenes',    dark:true,  bg:'#001F33' },
  { from:'#origenes',      to:'#valor',          dark:false },
  { from:'#valor',         to:'#por-que',        dark:true  },
  { from:'#por-que',       to:'#fidelizacion',   dark:false, inside:true, bg:'#F2F5F8' },
  { from:'#fidelizacion',  to:'#digital',        dark:false },
  { from:'#digital',       to:'#ventas',         dark:false, padBot:48 },
  { from:'#ventas',        to:'#revalor',        dark:false, pad:20 },
  { from:'#revalor',       to:'#eficiencia',     dark:false, pad:20 },
  { from:'#eficiencia',    to:'#gastro',         dark:false },
  { from:'#gastro',        to:'#hospitalidad',   dark:false },
  { from:'#hospitalidad',  to:'#ocio',           dark:true  },
  { from:'#ocio',          to:'#personas',       dark:false },
  { from:'#personas',      to:'#gobernanza',     dark:false },
  { from:'#gobernanza',    to:'#organigrama',    dark:false },
  { from:'#organigrama',   to:'#sostenibilidad', dark:false },
  { from:'#sostenibilidad',to:'#futuro',         dark:true  },
  { from:'#futuro',        to:'#alquiler',       dark:false },
  { from:'#alquiler',      to:'#alternativas',   dark:false },
  { from:'#alternativas',  to:'#reposicion',     dark:false },
  { from:'#reposicion',    to:'#contacto',       dark:false },
];
sections.forEach((s)=>{ const {from, to, dark} = s;
  const el = document.querySelector(from);
  if(!el) return;
  const arrow = document.createElement('div');
  arrow.className = 'sec-arrow' + (dark ? ' sec-arrow-w' : '');
  arrow.style.background = s.bg || (dark ? 'var(--N)' : 'var(--W)');
  if(s.pad){var h=s.pad*2+64;arrow.style.height=h+'px';arrow.style.marginTop=-(h/2)+'px';arrow.style.marginBottom=-(h/2)+'px';}
  if(s.padBot){arrow.style.marginBottom=(s.padBot-32)+'px';}
  arrow.innerHTML = `<a href="${to}" aria-label="Siguiente sección">${arrowSVG}</a>`;
  if(s.inside){
    arrow.style.position='absolute';
    arrow.style.bottom='28px';
    arrow.style.left='0';
    arrow.style.right='0';
    arrow.style.margin='0';
    el.appendChild(arrow);
  } else {
    el.insertAdjacentElement('afterend', arrow);
  }
});

// Fix scroll offset for #posicion-financiera anchor
document.querySelector('a[href="#posicion-financiera"]').addEventListener('click', function(e) {
  e.preventDefault();
  const target = document.getElementById('posicion-financiera');
  const navH = document.querySelector('nav').offsetHeight;
  const top = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
  window.scrollTo({ top, behavior: 'smooth' });
});
