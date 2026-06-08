// ── MAPA ESPAÑA ──
(async function(){
  const W=900, H=560;
  const svg = d3.select('#spain-map').attr('viewBox',`0 0 ${W} ${H}`);

  const PINS = {
    madrid:    { coords:[-3.7038,40.4168], label:'MADRID',    lblDir:'above' },
    huelva:    { coords:[-6.9447,37.2614], label:'HUELVA',    lblDir:'below' },
    sevilla:   { coords:[-5.9845,37.3891], label:'SEVILLA',   lblDir:'above' },
    cadiz:     { coords:[-6.2422,36.5297], label:'CÁDIZ',     lblDir:'below' },
    malaga:    { coords:[-4.4214,36.7213], label:'MÁLAGA',    lblDir:'below' },
    granada:   { coords:[-3.5986,37.1773], label:'GRANADA',   lblDir:'above' },
    almeria:   { coords:[-2.4637,36.8340], label:'ALMERÍA',   lblDir:'below' },
    murcia:    { coords:[-1.1307,37.9922], label:'MURCIA',    lblDir:'above' },
    valencia:  { coords:[-0.3763,39.4699], label:'VALENCIA',  lblDir:'above' },
    barcelona: { coords:[ 2.1734,41.3851], label:'BARCELONA', lblDir:'above' },
    mallorca:  { coords:[ 3.0176,39.6953], label:'MALLORCA',  lblDir:'below' },
    menorca:   { coords:[ 4.0063,39.9495], label:'MENORCA',   lblDir:'above' }
  };

  let topo;
  try { topo = await d3.json('https://unpkg.com/es-atlas@0.5.0/es/provinces.json'); }
  catch(e){ console.warn('Map error',e); return; }

  const features = topojson.feature(topo, topo.objects.provinces).features
    .filter(d=>{ const id=+d.id; return id!==35&&id!==38&&id!==51&&id!==52&&id!==7; });
  let balearesMunis=[];
  try {
    const mt = await d3.json('https://unpkg.com/es-atlas@0.5.0/es/municipalities.json');
    balearesMunis = topojson.feature(mt, mt.objects.municipalities).features
      .filter(d=>{ const id=String(d.id); return id.startsWith('0701')||id.startsWith('0702')||id.startsWith('701')||id.startsWith('702'); });
  } catch(e){}

  const allF = [...features, ...balearesMunis];
  const proj = d3.geoMercator().fitExtent([[30,30],[W-30,H-30]], {type:'FeatureCollection',features});
  const path = d3.geoPath(proj);
  const mapG = svg.append('g').attr('id','map-g');
  mapG.selectAll('path').data(allF).join('path').attr('class','province').attr('d',path);
  const pinG = mapG.append('g');
  const pinCoords = {};
  let currentZoom = null;
  const ZOOM = 3.5;

  Object.entries(PINS).forEach(([id,p])=>{
    const [x,y] = proj(p.coords);
    pinCoords[id] = {x,y};
    const g = pinG.append('g').attr('class','map-pin-g').attr('id','pin-'+id)
      .attr('transform',`translate(${x},${y})`)
      .on('click', function(e){ e.stopPropagation(); handlePin(id); });
    g.append('circle').attr('class','pin-outer').attr('r',11);
    g.append('circle').attr('class','pin-inner').attr('r',5);
    const dy = p.lblDir==='above' ? -18 : 18;
    g.append('text').attr('class','pin-lbl').attr('y',dy).attr('text-anchor','middle')
      .attr('dominant-baseline', p.lblDir==='above'?'auto':'hanging').text(p.label);
  });

  function handlePin(id){
    if(currentZoom===id){ zoomOut(); return; }
    const mapCont = document.getElementById('map-container');
    const rect = mapCont.getBoundingClientRect();
    if(rect.top < 0 || rect.bottom > window.innerHeight){
      mapCont.scrollIntoView({ behavior:'smooth', block:'center' });
    }
    _doZoomPin(id);
  }

  function _doZoomPin(id){
    currentZoom = id;
    document.querySelectorAll('.map-popup').forEach(p=>p.classList.remove('show'));
    document.querySelectorAll('.map-pin-g').forEach(p=>p.classList.remove('active'));
    document.getElementById('pin-'+id).classList.add('active');
    const mapCont = document.getElementById('map-container');
    mapCont.style.transition = 'none';
    mapCont.classList.add('map-zoomed');
    mapCont.parentElement.style.paddingTop = '0';
    mapCont.offsetWidth;
    mapCont.style.transition = '';
    const {x,y} = pinCoords[id];
    const vw = W/ZOOM, vh = H/ZOOM;
    const vx = Math.min(W-vw, Math.max(0, x-vw/2));
    const vy = Math.min(H-vh, Math.max(0, y-vh/2));
    d3.select('#spain-map').transition().duration(700).ease(d3.easeCubicInOut)
      .attr('viewBox',`${vx} ${vy} ${vw} ${vh}`)
      .on('end', ()=>{
        pinG.selectAll('.map-pin-g').each(function(){
          const el=d3.select(this);
          el.select('.pin-outer').attr('r',11/ZOOM);
          el.select('.pin-inner').attr('r',5/ZOOM);
          el.select('.pin-lbl').attr('font-size',10/ZOOM+'px')
            .attr('y', function(){ return +d3.select(this).attr('y')<0 ? -18/ZOOM : 18/ZOOM; });
        });
        showPopup(id);
      });
  }

  function zoomOut(){
    currentZoom = null;
    document.querySelectorAll('.map-popup').forEach(p=>p.classList.remove('show'));
    document.querySelectorAll('.map-pin-g').forEach(p=>p.classList.remove('active'));
    pinG.selectAll('.map-pin-g').each(function(){
      const el=d3.select(this);
      el.select('.pin-outer').attr('r',11);
      el.select('.pin-inner').attr('r',5);
      el.select('.pin-lbl').attr('font-size',null)
        .attr('y', function(){ return +d3.select(this).attr('y')<0 ? -18 : 18; });
    });
    d3.select('#spain-map').transition().duration(600).ease(d3.easeCubicInOut)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .on('end', function(){
        if(currentZoom) return;
        const mc = document.getElementById('map-container');
        mc.classList.remove('map-zoomed');
        mc.parentElement.style.paddingTop = '48px';
      });
  }

  function showPopup(id){
    const wrap   = document.getElementById('map-container');
    const wrapR  = wrap.getBoundingClientRect();
    const pinEl  = document.getElementById('pin-'+id);
    const pinR   = pinEl.getBoundingClientRect();
    const px = pinR.left - wrapR.left + pinR.width  / 2;
    const py = pinR.top  - wrapR.top  + pinR.height / 2;
    const popup=document.getElementById('popup-'+id);
    const popW=264, popH=310;
    let left=px+16, top=py-popH/2;
    if(left+popW > wrapR.width) left=px-popW-16;
    if(left<0) left=8;
    if(top<0) top=8;
    if(top+popH > wrapR.height) top=wrapR.height-popH-8;
    popup.style.left=left+'px';
    popup.style.top=top+'px';
    popup.classList.add('show');
  }

  window.spainZoomOut = zoomOut;

  document.addEventListener('click', function(e){
    if(!e.target.closest('.map-pin-g')&&!e.target.closest('.map-popup')&&currentZoom) zoomOut();
  });
})();

// ── MAPA CARIBE ──
(async function(){
  const CW=900, CH=280;
  const cSvg = d3.select('#caribe-map').attr('viewBox',`0 0 ${CW} ${CH}`);
  const cPinCoords = {};

  const CARIBE_PINS = {
    puertoplata: { coords:[-70.6892,19.7930], label:'PUERTO PLATA', lblDir:'above' }
  };

  let rdGeo;
  try {
    const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
    const countries = topojson.feature(world, world.objects.countries);
    rdGeo = { type:'FeatureCollection', features: countries.features.filter(f => f.id === '214') };
  } catch(e){ console.warn('RD map error',e); return; }

  const cProj = d3.geoMercator()
    .center([-70.1627, 18.9300])
    .scale(4200)
    .translate([CW/2, CH/2]);
  const cPath = d3.geoPath(cProj);

  const cMapG = cSvg.append('g').attr('id','caribe-map-g');
  cMapG.selectAll('path').data(rdGeo.features).join('path')
    .attr('fill','#17384D')
    .attr('stroke','#3A6278').attr('stroke-opacity','0.55').attr('stroke-width','0.5').attr('d', cPath);

  const cPinG = cMapG.append('g');
  let cCurrentZoom = null;
  const CZOOM = 3;

  Object.entries(CARIBE_PINS).forEach(([id, p]) => {
    const [x, y] = cProj(p.coords);
    cPinCoords[id] = {x, y};
    const g = cPinG.append('g')
      .attr('class','map-pin-g').attr('id','pin-'+id)
      .attr('transform',`translate(${x},${y})`)
      .on('click', function(e){ e.stopPropagation(); handleCaribPin(id); });
    g.append('circle').attr('class','pin-outer').attr('r',11);
    g.append('circle').attr('class','pin-inner').attr('r',5);
    const dy = p.lblDir === 'above' ? -18 : 18;
    g.append('text').attr('class','pin-lbl')
      .attr('y', dy).attr('text-anchor','middle')
      .attr('dominant-baseline', p.lblDir === 'above' ? 'auto' : 'hanging')
      .text(p.label);
  });

  function handleCaribPin(id){
    if(cCurrentZoom === id){ caribZoomOut(); return; }
    const caribCont = document.getElementById('caribe-container');
    const rect = caribCont.getBoundingClientRect();
    const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if(!fullyVisible){
      caribCont.scrollIntoView({ behavior:'smooth', block:'center' });
      setTimeout(()=> _doZoomCarib(id), 650);
      return;
    }
    _doZoomCarib(id);
  }

  function _doZoomCarib(id){
    cCurrentZoom = id;
    document.querySelectorAll('.map-popup').forEach(p=>p.classList.remove('show'));
    document.querySelectorAll('.map-pin-g').forEach(p=>p.classList.remove('active'));
    document.getElementById('pin-'+id).classList.add('active');
    const {x, y} = cPinCoords[id];
    const tx = CW/2 - CZOOM*x, ty = CH/2 - CZOOM*y;
    d3.select('#caribe-map-g').transition().duration(700).ease(d3.easeCubicInOut)
      .attr('transform',`translate(${tx},${ty}) scale(${CZOOM})`)
      .on('end', ()=>{
        cPinG.selectAll('.map-pin-g').each(function(){
          const el = d3.select(this);
          el.select('.pin-outer').attr('r', 11/CZOOM);
          el.select('.pin-inner').attr('r', 5/CZOOM);
          el.select('.pin-lbl').attr('font-size', 10/CZOOM+'px')
            .attr('y', function(){ return +d3.select(this).attr('y') < 0 ? -18/CZOOM : 18/CZOOM; });
        });
        showCaribPopup(id);
      });
  }

  function caribZoomOut(){
    cCurrentZoom = null;
    document.querySelectorAll('.map-popup').forEach(p=>p.classList.remove('show'));
    document.querySelectorAll('.map-pin-g').forEach(p=>p.classList.remove('active'));
    cPinG.selectAll('.map-pin-g').each(function(){
      const el = d3.select(this);
      el.select('.pin-outer').attr('r', 11);
      el.select('.pin-inner').attr('r', 5);
      el.select('.pin-lbl').attr('font-size', null)
        .attr('y', function(){ return +d3.select(this).attr('y') < 0 ? -18 : 18; });
    });
    d3.select('#caribe-map-g').transition().duration(600).ease(d3.easeCubicInOut)
      .attr('transform','translate(0,0) scale(1)');
  }

  function showCaribPopup(id){
    const mapEl = document.getElementById('caribe-map');
    const wrap  = document.getElementById('caribe-container');
    const mapR  = mapEl.getBoundingClientRect();
    const wrapR = wrap.getBoundingClientRect();
    const px = (CW/2) * (mapR.width/CW) + (mapR.left - wrapR.left);
    const py = (CH/2) * (mapR.height/CH) + (mapR.top  - wrapR.top);
    const popup = document.getElementById('popup-'+id);
    const popW=264, popH=280;
    let left = px + 16, top = py - popH/2;
    if(left + popW > wrapR.width) left = px - popW - 16;
    if(left < 0) left = 8;
    if(top < 0) top = 8;
    if(top + popH > wrapR.height) top = wrapR.height - popH - 8;
    popup.style.left = left+'px';
    popup.style.top  = top+'px';
    popup.classList.add('show');
  }

  window.closePopup = function(id){
    document.getElementById('popup-'+id).classList.remove('show');
    if(cCurrentZoom === id) caribZoomOut();
    else if(window.spainZoomOut) window.spainZoomOut();
  };

  document.addEventListener('click', function(e){
    if(!e.target.closest('.map-pin-g') && !e.target.closest('.map-popup') && cCurrentZoom){
      caribZoomOut();
    }
  });
})();
