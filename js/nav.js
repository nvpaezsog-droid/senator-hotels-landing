// ── NAV ──
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  const s = scrollY>80;
  nav.classList.toggle('s',s);
  const logoImg = document.getElementById('navLogoImg');
  if(logoImg) logoImg.style.filter = s ? 'brightness(0) saturate(100%) invert(13%) sepia(55%) saturate(800%) hue-rotate(175deg) brightness(70%)' : 'none';
});

// ── GEO LINES ──
const geo=document.getElementById('geo');
for(let i=0;i<12;i++){
  const l=document.createElement('div');
  l.className='geo-line';
  const isH=Math.random()>.5;
  if(isH){l.style.cssText=`top:${Math.random()*100}%;left:0;right:0;height:1px;transform:scaleX(0);animation:gl ${3+Math.random()*4}s ${Math.random()*4}s ease-in-out infinite alternate`}
  else{l.style.cssText=`left:${Math.random()*100}%;top:0;bottom:0;width:1px;transform:scaleY(0);animation:gv ${3+Math.random()*4}s ${Math.random()*4}s ease-in-out infinite alternate`}
  geo.appendChild(l);
}
const gs=document.createElement('style');
gs.textContent='@keyframes gl{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}@keyframes gv{from{transform:scaleY(0);transform-origin:top}to{transform:scaleY(1);transform-origin:top}}';
document.head.appendChild(gs);

// ── HERO GRID ──
setTimeout(()=>{document.querySelectorAll('.hg-cell').forEach(c=>c.classList.add('on'))},200);
