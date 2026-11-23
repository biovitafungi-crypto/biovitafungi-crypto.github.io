/* BIOVITA — vista previa de rediseño (no publicada). */
(function(){
  var d=document, b=d.body;

  /* Notas de revisión: mostrar / ocultar */
  var KEY='bv-preview-notes';
  function setNotes(show){
    b.classList.toggle('hide-notes',!show);
    var t=d.getElementById('rvToggle');
    if(t){t.textContent=show?'Ocultar notas de revisión':'Mostrar notas de revisión';t.setAttribute('aria-pressed',show?'true':'false');}
    try{localStorage.setItem(KEY,show?'1':'0');}catch(e){}
  }
  var initial=true;
  try{ if(localStorage.getItem(KEY)==='0') initial=false; }catch(e){}
  if(/[?&]notas=0/.test(location.search)) initial=false;
  setNotes(initial);
  var tg=d.getElementById('rvToggle');
  if(tg) tg.addEventListener('click',function(){setNotes(b.classList.contains('hide-notes'));});

  /* Copiar BIO10 */
  d.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var code=btn.getAttribute('data-copy');
      function done(){btn.classList.add('ok');var l=btn.querySelector('.l');if(l){var o=l.textContent;l.textContent='Copiado';setTimeout(function(){l.textContent=o;btn.classList.remove('ok');},1600);}}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(code).then(done,done);}else{done();}
    });
  });

  /* Menú móvil */
  var mb=d.getElementById('menuBtn'), mn=d.getElementById('mnav');
  if(mb&&mn){
    mb.addEventListener('click',function(){var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o?'true':'false');});
    mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('open');mb.setAttribute('aria-expanded','false');});});
  }

  /* Aparición al hacer scroll */
  var els=d.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e);});
  }else{els.forEach(function(e){e.classList.add('in');});}

  /* Catálogo: filtros por tipo y por objetivo */
  var grid=d.getElementById('catGrid');
  if(grid){
    var type='todos', goal='todos';
    var cards=grid.querySelectorAll('.pc'), cnt=d.getElementById('catCount'), empty=d.getElementById('catEmpty');
    function apply(){
      var n=0;
      cards.forEach(function(c){
        var okT= type==='todos' || c.dataset.type===type;
        var okG= goal==='todos' || (' '+c.dataset.goal+' ').indexOf(' '+goal+' ')>-1;
        var on=okT&&okG; c.hidden=!on; if(on) n++;
      });
      if(cnt) cnt.textContent='Mostrando '+n+(n===1?' extracto':' extractos');
      if(empty) empty.classList.toggle('on',n===0);
    }
    function group(sel,setter){
      d.querySelectorAll(sel+' button').forEach(function(btn){
        btn.addEventListener('click',function(){
          d.querySelectorAll(sel+' button').forEach(function(x){x.setAttribute('aria-pressed','false');});
          btn.setAttribute('aria-pressed','true'); setter(btn.dataset.v); apply();
        });
      });
    }
    group('#segType',function(v){type=v;});
    group('#goalChips',function(v){goal=v;});
    var reset=d.getElementById('catReset');
    if(reset) reset.addEventListener('click',function(){
      type='todos';goal='todos';
      d.querySelectorAll('#segType button,#goalChips button').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.v==='todos'?'true':'false');});
      apply();
    });
    apply();
  }

  /* Ficha: galería */
  var stage=d.getElementById('stageImg');
  if(stage){
    d.querySelectorAll('.thumbs button').forEach(function(t){
      t.addEventListener('click',function(){
        d.querySelectorAll('.thumbs button').forEach(function(x){x.setAttribute('aria-current','false');});
        t.setAttribute('aria-current','true');
        stage.src=t.dataset.src; stage.alt=t.dataset.alt;
        var tag=d.getElementById('stageTag'); if(tag){tag.style.display=t.dataset.real==='1'?'':'none';}
      });
    });
  }

  /* Ficha: cantidad */
  var q=d.getElementById('qty');
  if(q){
    function clamp(v){v=parseInt(v,10);if(isNaN(v)||v<1)v=1;if(v>20)v=20;return v;}
    function sync(){var v=clamp(q.value);q.value=v;var t=d.getElementById('qtyTotal');if(t){t.textContent=v>1?('Total: $'+(v*30000).toLocaleString('es-AR')+' · $'+(v*28500).toLocaleString('es-AR')+' con transferencia'):'';}}
    d.getElementById('qMinus').addEventListener('click',function(){q.value=clamp(q.value)-1;sync();});
    d.getElementById('qPlus').addEventListener('click',function(){q.value=clamp(q.value)+1;sync();});
    q.addEventListener('change',sync);
  }

  /* Ficha: envío por código postal (el costo exacto lo calcula TiendaNube) */
  var sf=d.getElementById('shipForm');
  if(sf){
    sf.addEventListener('submit',function(ev){
      ev.preventDefault();
      var cp=(d.getElementById('cp').value||'').replace(/\D/g,''), out=d.getElementById('shipOut');
      var v=q?parseInt(q.value,10)||1:1, sub=v*30000;
      if(cp.length<4){out.textContent='Ingresá un código postal de 4 dígitos.';return;}
      out.textContent= sub>=150000
        ? 'CP '+cp+': tu compra supera los $150.000, así que el envío es gratis.'
        : 'CP '+cp+': el precio y el plazo de Correo Argentino y Andreani se calculan en el paso siguiente, dentro de la tienda. Te faltan $'+(150000-sub).toLocaleString('es-AR')+' para el envío gratis.';
    });
  }

  /* Ficha: barra de compra fija en móvil */
  var sb=d.getElementById('stickyBuy'), anchor=d.getElementById('buyBtn');
  if(sb&&anchor){
    var ticking=false;
    function upd(){ticking=false;sb.classList.toggle('on',anchor.getBoundingClientRect().bottom<0);}
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd);}},{passive:true});
    upd();
  }
})();
