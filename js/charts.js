// ── GRÁFICOS FINANCIEROS (Chart.js) ──
(function(){
  const navy='#00263D', navyLight='#8BAABA', font="'DM Mono',monospace";
  Chart.defaults.font.family=font;
  Chart.defaults.color='rgba(0,38,61,0.45)';
  const anim={duration:2000,easing:'easeOutCubic',x:{from:0}};

  function buildCharts(){
    new Chart(document.getElementById('chartFacturacion'),{
      type:'bar',
      data:{labels:['2019','2020','2021','2022','2023','2024','2025'],datasets:[{label:'Facturación',data:[158,43,86,166,181,191,207],backgroundColor:navy,borderRadius:2,borderSkipped:false}]},
      options:{indexAxis:'y',responsive:true,animation:anim,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' '+c.raw+'M€'}}},scales:{x:{grid:{color:'rgba(0,38,61,0.06)'},ticks:{callback:v=>v+'M€',font:{size:10}},border:{display:false}},y:{grid:{display:false},ticks:{font:{size:11,weight:'500'},color:navy},border:{display:false}}}},
      plugins:[{afterDatasetsDraw(chart){const c=chart.ctx;chart.data.datasets[0].data.forEach((v,i)=>{const b=chart.getDatasetMeta(0).data[i];if(!b)return;c.fillStyle=navy;c.font='500 11px '+font;c.textAlign='left';c.textBaseline='middle';c.fillText(v+'M€',b.x+6,b.y);});}}]
    });
    new Chart(document.getElementById('chartGOP'),{
      type:'bar',
      data:{labels:['2019','2020','2021','2022','2023','2024','2025'],datasets:[{label:'EMEA',data:[26.8,-8.6,18.5,35.6,39.1,44.1,58.2],backgroundColor:c=>c.raw<0?'rgba(0,38,61,0.25)':navy,borderRadius:2,borderSkipped:false},{label:'AMER',data:[0.1,-1.5,-1.5,2.8,4.1,6.3,8],backgroundColor:c=>c.raw<0?'rgba(139,170,186,0.35)':navyLight,borderRadius:2,borderSkipped:false}]},
      options:{indexAxis:'y',responsive:true,animation:anim,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' '+c.dataset.label+': '+c.raw+'M€'}}},scales:{x:{grid:{color:'rgba(0,38,61,0.06)'},ticks:{callback:v=>v+'M',font:{size:10}},border:{display:false}},y:{grid:{display:false},ticks:{font:{size:11,weight:'500'},color:navy},border:{display:false}}}}
    });
  }

  let built=false;
  new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting && !built){
      built=true;
      buildCharts();
    }
  },{threshold:0,rootMargin:'0px 0px -80px 0px'}).observe(document.getElementById('graficos-financieros'));
})();

// ── FIDELIZACIÓN CHARTS ──
(function(){
  var barData=[
    {year:'2020',val:568280,delta:null},
    {year:'2021',val:604196,delta:35916},
    {year:'2022',val:674676,delta:70480},
    {year:'2023',val:739741,delta:57133},
    {year:'2024',val:782904,delta:46163},
    {year:'2025',val:825297,delta:42393}
  ];
  var donutData=[
    {label:'Internacional',val:372007,color:'#00263D'},
    {label:'Andalucía',val:181589,color:'#1A3B55'},
    {label:'Madrid',val:71579,color:'#2C5878'},
    {label:'Cataluña',val:32197,color:'#3E6D8A'},
    {label:'Castilla y León',val:22050,color:'#527E99'},
    {label:'Comunidad Valenciana',val:33716,color:'#6A95A8'},
    {label:'Castilla-La Mancha',val:20915,color:'#85AEBA'},
    {label:'Murcia',val:18599,color:'#9EC2CC'},
    {label:'País Vasco',val:13868,color:'#B5D2DA'},
    {label:'Extremadura',val:12270,color:'#CCE1E6'},
    {label:'Otros',val:46507,color:'#E2EFF2'}
  ];
  var TOTAL=825297;
  function fmt(n){return n.toLocaleString('es-ES')}

  function buildLegend(){
    var el=document.getElementById('fidLegend');
    if(!el) return;
    el.innerHTML=donutData.map(function(d){
      return '<div class="fid-legend-item"><div class="fid-legend-dot" style="background:'+d.color+'"></div>'
            +'<span class="fid-legend-lbl">'+d.label+': <strong>'+fmt(d.val)+'</strong></span></div>';
    }).join('');
  }

  function drawBar(prog){
    var c=document.getElementById('fidBarChart');
    if(!c) return;
    var ctx=c.getContext('2d');
    var W=fidLogW, H=fidLogH;
    ctx.clearRect(0,0,W,H);
    var yearW=50, rightPad=100, barAreaW=W-yearW-rightPad;
    var maxVal=825297;
    var barH=28, gap=16;
    var rows=barData.length;
    var totalH=rows*barH+(rows-1)*gap;
    var topOff=Math.round((H-totalH)/2);
    var lineX=[], lineY=[];

    barData.forEach(function(d,i){
      var y=topOff+i*(barH+gap);
      var fullW=(d.val/maxVal)*barAreaW;
      var animW=fullW*prog;

      ctx.fillStyle='rgba(0,38,61,0.08)';
      ctx.fillRect(yearW,y,barAreaW,barH);

      ctx.fillStyle='#00263D';
      ctx.fillRect(yearW,y,animW,barH);

      ctx.fillStyle='#00263D';
      ctx.font='500 10px "DM Mono",monospace';
      ctx.textAlign='right';
      ctx.fillText(d.year,yearW-8,y+barH/2+4);

      if(animW>68){
        ctx.fillStyle='#fff';
        ctx.font='600 11px "DM Sans",sans-serif';
        ctx.textAlign='right';
        ctx.fillText(fmt(d.val),yearW+animW-8,y+barH/2+4);
      }

      if(d.delta && prog>0.45){
        var alpha=Math.min(1,(prog-0.45)/0.35);
        ctx.save();
        ctx.globalAlpha=alpha;
        ctx.fillStyle='rgba(0,38,61,0.5)';
        ctx.font='10px "DM Sans",sans-serif';
        ctx.textAlign='left';
        ctx.fillText('+'+fmt(d.delta),yearW+fullW+8,y+barH/2+4);
        ctx.restore();
      }

      lineX.push(yearW+animW);
      lineY.push(y+barH/2);
    });

    if(prog>0.05){
      ctx.save();
      ctx.globalAlpha=Math.min(1,(prog-0.05)/0.3);
      ctx.strokeStyle='rgba(0,38,61,0.4)';
      ctx.lineWidth=1.5;
      ctx.setLineDash([3,3]);
      ctx.beginPath();
      lineX.forEach(function(x,i){i===0?ctx.moveTo(x,lineY[i]):ctx.lineTo(x,lineY[i]);});
      ctx.stroke();
      ctx.setLineDash([]);
      lineX.forEach(function(x,i){
        ctx.fillStyle='#00263D';
        ctx.beginPath();
        ctx.arc(x,lineY[i],3.5,0,Math.PI*2);
        ctx.fill();
        ctx.strokeStyle='#fff';
        ctx.lineWidth=1.5;
        ctx.stroke();
      });
      ctx.restore();
    }
  }

  function drawDonut(prog){
    var c=document.getElementById('fidDonut');
    if(!c) return;
    var ctx=c.getContext('2d');
    var W=200, H=200;
    ctx.clearRect(0,0,W,H);
    var cx=W/2, cy=H/2;
    var OR=Math.min(W,H)*0.46, IR=OR*0.52;
    var angle=-Math.PI/2;
    var drawn=Math.PI*2*prog;
    var cum=0;
    donutData.forEach(function(d){
      var seg=(d.val/TOTAL)*Math.PI*2;
      var draw=Math.min(seg,Math.max(0,drawn-cum));
      if(draw>0.005){
        ctx.beginPath();
        ctx.arc(cx,cy,OR,angle,angle+draw);
        ctx.arc(cx,cy,IR,angle+draw,angle,true);
        ctx.closePath();
        ctx.fillStyle=d.color;
        ctx.fill();
        ctx.strokeStyle='#fff';
        ctx.lineWidth=1.5;
        ctx.stroke();
      }
      cum+=seg;
      angle+=seg;
    });
  }

  var fidAnimated=false;
  var fidLogW=520, fidLogH=260;
  function fidAnimate(){
    if(fidAnimated) return;
    fidAnimated=true;
    var dpr=window.devicePixelRatio||1;
    var bc=document.getElementById('fidBarChart');
    if(bc){
      fidLogW=Math.round(bc.offsetWidth)||520;
      bc.width=fidLogW*dpr;
      bc.height=fidLogH*dpr;
      bc.style.width=fidLogW+'px';
      bc.style.height=fidLogH+'px';
      bc.getContext('2d').scale(dpr,dpr);
    }
    var dc=document.getElementById('fidDonut');
    if(dc){
      dc.width=200*dpr; dc.height=200*dpr;
      dc.style.width='200px'; dc.style.height='200px';
      dc.getContext('2d').scale(dpr,dpr);
    }
    buildLegend();
    var dur=2800, st=Date.now();
    function frame(){
      var t=Math.min((Date.now()-st)/dur,1);
      var e=1-Math.pow(1-t,3);
      drawBar(e);
      drawDonut(e);
      if(t<1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var fidObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){fidAnimate();fidObs.unobserve(e.target);}});
  },{threshold:0.2});
  var fidEl=document.getElementById('fidelizacion');
  if(fidEl) fidObs.observe(fidEl);
})();

// ── DIGITAL CHARTS ──
(function(){
  var DPR=window.devicePixelRatio||1;
  var barData=[
    {label:'253K',val:253,color:'#5865B7',icon:'F'},
    {label:'231K',val:231,color:'#D4326B',icon:'I'},
    {label:'23K', val:23, color:'#5C7FB8',icon:'in'},
    {label:'29K', val:29, color:'#C44A7A',icon:'T'},
    {label:'7K',  val:7,  color:'#C0392B',icon:'Y'},
    {label:'3,6K',val:3.6,color:'#111111',icon:'X'}
  ];
  var ringCfg=[
    {id:'digRing1',pct:0.78,big:'+15',small:'MILLION'},
    {id:'digRing2',pct:0.62,big:'+500',small:'THOUSAND'},
    {id:'digRing3',pct:0.22,big:'18%',small:''}
  ];
  var digLogW=0,digLogH=300;

  function setupBar(){
    var c=document.getElementById('digBarChart');
    if(!c) return;
    digLogW=c.offsetWidth||400;
    c.width=digLogW*DPR; c.height=digLogH*DPR;
    c.style.width=digLogW+'px'; c.style.height=digLogH+'px';
    c.getContext('2d').scale(DPR,DPR);
  }
  function setupRing(id){
    var c=document.getElementById(id);
    if(!c) return;
    c.width=110*DPR; c.height=110*DPR;
    c.style.width='110px'; c.style.height='110px';
    c.getContext('2d').scale(DPR,DPR);
  }

  function drawBars(prog){
    var c=document.getElementById('digBarChart');
    if(!c||!digLogW) return;
    var ctx=c.getContext('2d');
    var W=digLogW,H=digLogH;
    ctx.clearRect(0,0,W,H);
    var maxVal=253,n=barData.length;
    var topPad=8,botPad=6;
    var chartH=H-topPad-botPad;
    var colW=Math.floor(W/n);
    var barW=Math.floor(colW*0.58);

    barData.forEach(function(d,i){
      var colX=i*colW;
      var x=colX+Math.floor((colW-barW)/2);
      var fullH=Math.sqrt(d.val/maxVal)*chartH;
      var animH=fullH*prog;
      var barTop=H-botPad-animH;

      ctx.fillStyle=d.color;
      ctx.fillRect(x,barTop,barW,animH);

      if(animH>16){
        ctx.save();
        ctx.translate(x+barW/2,barTop+animH/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillStyle='#fff';
        ctx.font='bold 10px "DM Sans",sans-serif';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(d.label,0,0);
        ctx.restore();
      }
    });
  }

  function drawRing(cfg,prog){
    var c=document.getElementById(cfg.id);
    if(!c) return;
    var ctx=c.getContext('2d');
    var S=110;
    ctx.clearRect(0,0,S,S);
    var cx=S/2,cy=S/2,r=44,lw=9;
    var start=-Math.PI/2;
    var end=start+Math.PI*2*cfg.pct*prog;

    ctx.strokeStyle='#E0E4E8';
    ctx.lineWidth=lw;
    ctx.lineCap='butt';
    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.stroke();

    ctx.strokeStyle='#00263D';
    ctx.lineWidth=lw;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.arc(cx,cy,r,start,end);
    ctx.stroke();

    ctx.fillStyle='#00263D';
    ctx.font='bold 16px "DM Sans",sans-serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(cfg.big,cx,cfg.small?cy-7:cy);
    if(cfg.small){
      ctx.font='500 8px "DM Mono",monospace';
      ctx.fillStyle='rgba(0,38,61,0.5)';
      ctx.fillText(cfg.small,cx,cy+9);
    }
  }

  var digAnimated=false;
  function digAnimate(){
    if(digAnimated) return;
    digAnimated=true;
    setupBar();
    ringCfg.forEach(function(r){setupRing(r.id);});
    var dur=2800,st=Date.now();
    function frame(){
      var t=Math.min((Date.now()-st)/dur,1);
      var e=1-Math.pow(1-t,3);
      drawBars(e);
      ringCfg.forEach(function(r){drawRing(r,e);});
      if(t<1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var digObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){digAnimate();digObs.unobserve(e.target);}});
  },{threshold:0.35,rootMargin:'0px 0px -80px 0px'});
  var digEl=document.getElementById('digital');
  if(digEl) digObs.observe(digEl);
})();

// ── REVALORIZACIÓN CHART ──
(function(){
  var DPR=window.devicePixelRatio||1;
  var revData=[
    {year:'2018',total:52,   annual:0},
    {year:'2019',total:65,   annual:13},
    {year:'2020',total:72,   annual:7},
    {year:'2021',total:81,   annual:9},
    {year:'2022',total:95,   annual:14},
    {year:'2023',total:100,  annual:5},
    {year:'2024',total:104,  annual:4},
    {year:'2025',total:109.3,annual:5.3}
  ];
  var ORANGE='#F5A623', BAR='#728FA6';
  var revLogW=0,revLogH=260;

  function setupRev(){
    var c=document.getElementById('revChart');
    if(!c) return;
    revLogW=c.offsetWidth||560;
    c.width=revLogW*DPR; c.height=revLogH*DPR;
    c.style.width=revLogW+'px'; c.style.height=revLogH+'px';
    c.getContext('2d').scale(DPR,DPR);
  }

  function drawRev(barP,lineP){
    var c=document.getElementById('revChart');
    if(!c||!revLogW) return;
    var ctx=c.getContext('2d');
    var W=revLogW,H=revLogH;
    ctx.clearRect(0,0,W,H);
    var n=revData.length,botPad=26,topPad=22,chartH=H-botPad-topPad;
    var maxT=109.3,maxA=14;
    var colW=W/n,barW=Math.floor(colW*0.55);
    var linePoints=[];

    revData.forEach(function(d,i){
      var cx=i*colW+colW/2;
      var x=cx-barW/2;
      var fullH=(d.total/maxT)*chartH;
      var animH=fullH*barP;
      var barTop=H-botPad-animH;

      ctx.fillStyle=BAR;
      ctx.fillRect(x,barTop,barW,animH);

      if(barP>0.3){
        var a=Math.min(1,(barP-0.3)/0.4);
        ctx.save(); ctx.globalAlpha=a;
        ctx.fillStyle='#fff';
        ctx.font='600 9px "DM Sans",sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='bottom';
        ctx.fillText('€'+d.total+'M',cx,barTop-3);
        ctx.restore();
      }

      if(d.annual>0&&barP>0.55){
        var a2=Math.min(1,(barP-0.55)/0.35);
        ctx.save(); ctx.globalAlpha=a2;
        ctx.translate(cx,barTop+animH/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillStyle='#fff';
        ctx.font='bold 9px "DM Sans",sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('+'+d.annual,0,0);
        ctx.restore();
      }

      ctx.fillStyle='rgba(255,255,255,.45)';
      ctx.font='9px "DM Mono",monospace';
      ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText(d.year,cx,H-botPad+6);

      if(d.annual>=0){
        var lineAreaTop=topPad+chartH*0.35;
        var lineAreaH=chartH*0.4;
        var ly=lineAreaTop+lineAreaH-(d.annual/maxA)*lineAreaH;
        linePoints.push({x:cx,y:ly});
      }
    });

    if(lineP>0&&linePoints.length>1){
      var total=linePoints.length-1;
      var drawTo=lineP*total;
      ctx.strokeStyle=ORANGE; ctx.lineWidth=2;
      ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.setLineDash([]);
      ctx.beginPath();
      linePoints.forEach(function(p,i){
        if(i===0){ctx.moveTo(p.x,p.y);}
        else if(i<=drawTo){ctx.lineTo(p.x,p.y);}
        else if(i-1<drawTo){
          var f=drawTo-(i-1);
          var prev=linePoints[i-1];
          ctx.lineTo(prev.x+(p.x-prev.x)*f,prev.y+(p.y-prev.y)*f);
        }
      });
      ctx.stroke();
      linePoints.forEach(function(p,i){
        if(i<=drawTo){
          ctx.fillStyle=ORANGE;
          ctx.beginPath(); ctx.arc(p.x,p.y,4.5,0,Math.PI*2); ctx.fill();
          ctx.fillStyle='#0B1F30';
          ctx.beginPath(); ctx.arc(p.x,p.y,2,0,Math.PI*2); ctx.fill();
        }
      });
    }
  }

  var revAnimated=false;
  function revAnimate(){
    if(revAnimated) return; revAnimated=true;
    setupRev();
    var dur=3400,st=Date.now();
    function frame(){
      var t=Math.min((Date.now()-st)/dur,1);
      var e=1-Math.pow(1-t,3);
      drawRev(Math.min(1,e*1.4),Math.max(0,(e-0.35)/0.65));
      if(t<1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var revObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){revAnimate();revObs.unobserve(e.target);}});
  },{threshold:0.35,rootMargin:'0px 0px -80px 0px'});
  var revEl=document.getElementById('revalor');
  if(revEl) revObs.observe(revEl);
})();
