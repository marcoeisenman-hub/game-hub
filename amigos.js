/* Ratito — "Jugar con amigos": cursores en vivo entre amigos (PeerJS, sin servidor propio).
   Cualquiera de la sala puede ser el centro: si el que la creó se va o cambia de juego, otro toma su lugar. */
(()=>{
'use strict';
const PRE='ratito-sala-',COLORS=['#2563EB','#059669','#D97706','#7C3AED','#DB2777','#0891B2','#DC2626','#4D7C0F'];
const ABC='abcdefghijklmnopqrstuvwxyz0123456789';
const rid=n=>Array.from(crypto.getRandomValues(new Uint8Array(n)),x=>ABC[x%36]).join('');
const me={id:rid(10),name:localStorage.getItem('ratitoNombre')||'Amigo '+(10+crypto.getRandomValues(new Uint8Array(1))[0]%90)};
let OFF=0; // diferencia con el reloj del anfitrión de la sala: así todos miden la llegada con el mismo reloj
let SINCE=Date.now(); // cuándo entré a la sala en esta página (reloj propio: todos ordenan igual)
const PAGE=location.pathname.replace(/index\.html$/,'');
const PAGES={'/':'la portada','/juegos/vida/':'Tu vida en vivo','/juegos/orbitas/':'Órbitas','/juegos/isla/':'Isla 3D','/juegos/ondas/':'Ondas','/juegos/demolicion/':'Demolición','/juegos/circulo/':'Círculo perfecto','/juegos/arena/':'Arena','/juegos/reflejos/':'Reflejos'};
function color(id){const ids=[me.id].concat(Object.keys(people)).sort();const k=Math.max(0,ids.indexOf(id));return COLORS[k%COLORS.length]}
const clean=s=>String(s||'').replace(/[<>&"]/g,'').slice(0,16)||'Amigo';

/* ---------- interfaz ---------- */
const css=`
.am-btn{position:fixed;top:14px;left:112px;z-index:60;display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:999px;background:#fff;color:#15171C;border:1px solid #E2E4E8;font:700 .9rem "Schibsted Grotesk",system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 10px #0000000f}
.am-btn:hover{border-color:#15171C}
.am-btn b{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#E4572E;color:#fff;font-size:.75rem}
.am-panel{position:fixed;top:58px;left:14px;z-index:60;width:300px;max-width:calc(100vw - 28px);background:#fff;color:#15171C;border:1px solid #E2E4E8;border-radius:14px;padding:14px;box-shadow:0 10px 30px #0000001f;font:400 .9rem/1.45 "Schibsted Grotesk",system-ui,sans-serif}
.am-panel[hidden]{display:none}
.am-panel h3{margin:0 0 4px;font-size:1rem}
.am-panel p{margin:0 0 10px;color:#6B7079;font-size:.85rem}
.am-panel input{width:100%;font:inherit;padding:8px 10px;border-radius:8px;border:1px solid #E2E4E8;background:#F2F3F5;color:#15171C}
.am-panel label{display:block;font-size:.78rem;color:#6B7079;margin:8px 0 3px}
.am-row{display:flex;gap:6px}.am-row input{font-size:.78rem}
.am-panel button{font:inherit;font-weight:700;cursor:pointer;border-radius:8px;padding:8px 12px;border:0;background:#15171C;color:#fff}
.am-panel button.sec{background:#fff;color:#15171C;border:1px solid #E2E4E8}
.am-panel .w{width:100%;margin-top:10px}
.am-list{list-style:none;margin:10px 0 0;padding:0}
.am-list li{display:flex;align-items:center;gap:8px;padding:3px 0;font-size:.86rem}
.am-list i{width:10px;height:10px;border-radius:50%;flex:none}
.am-list small{color:#6B7079;margin-left:auto;white-space:nowrap}
.am-peer{position:fixed;left:0;top:0;z-index:9998;pointer-events:none;will-change:transform}
.am-peer svg{display:block;filter:drop-shadow(0 1px 1.5px #0006)}
.am-peer span{position:absolute;left:15px;top:18px;color:#fff;font:700 .74rem "Schibsted Grotesk",system-ui,sans-serif;padding:2px 7px;border-radius:6px;white-space:nowrap}
.am-peer.click::after{content:"";position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;border:2px solid var(--pc);animation:am-ping .5s ease-out}
@keyframes am-ping{from{transform:scale(.3);opacity:1}to{transform:scale(1.4);opacity:0}}
.am-edge{position:fixed;left:50%;transform:translateX(-50%);z-index:9998;color:#fff;font:700 .8rem "Schibsted Grotesk",system-ui,sans-serif;padding:6px 12px;border-radius:999px;border:0;cursor:pointer;box-shadow:0 2px 10px #0003}
@media (prefers-reduced-motion:reduce){.am-peer.click::after{animation:none}}
@media (max-width:420px){.am-btn{padding:8px 11px;font-size:.82rem}}
`;
const st=document.createElement('style');st.textContent=css;document.head.append(st);
const btn=document.createElement('button');btn.className='am-btn';btn.type='button';btn.innerHTML='Jugar con amigos';
const panel=document.createElement('div');panel.className='am-panel';panel.hidden=true;
panel.innerHTML=`<h3>Jugar con amigos</h3>
<p id="am-st">Crea una sala y manda el link: jugarán la misma partida y verán el cursor del otro, en cualquier juego.</p>
<div id="am-off"><button class="w" id="am-new">Crear sala</button></div>
<div id="am-on" hidden>
  <div class="am-row"><input id="am-url" readonly aria-label="Link de la sala"><button class="sec" id="am-copy">Copiar</button></div>
  <label for="am-name">Tu nombre</label><input id="am-name" maxlength="16">
  <ul class="am-list" id="am-list"></ul>
  <button class="sec w" id="am-leave">Salir de la sala</button>
</div>`;
document.body.append(btn,panel);
if(!document.querySelector('.volver')){btn.style.left='auto';btn.style.right='14px';panel.style.left='auto';panel.style.right='14px'}
const $=id=>panel.querySelector('#'+id);
btn.onclick=()=>{panel.hidden=!panel.hidden};
$('am-name').value=me.name;
$('am-name').oninput=()=>{me.name=clean($('am-name').value.trim());localStorage.setItem('ratitoNombre',me.name);send({t:'hi'});list()};

/* ---------- red ---------- */
let peer=null,host=false,conns=[],hc=null,code=null,people=Object.create(null),sendT=0,lc=null,retry=0,running=false,gen=0;
const status=t=>$('am-st').textContent=t;
function send(m){m.id=me.id;m.name=me.name;m.page=PAGE;m.since=SINCE+OFF;
  if(host)conns.forEach(c=>c.open&&c.send(m));else if(hc&&hc.open)hc.send(m)}
function relay(m,from){conns.forEach(c=>{if(c===from||!c.open)return;if(m.t==='g'){const p=people[c._pid];if(!p||p.page!==m.page)return}c.send(m)})}
function recolor(){for(const p of Object.values(people)){const c=color(p.id);if(p.c===c)continue;p.c=c;p.el.style.setProperty('--pc',c);p.el.querySelector('path').setAttribute('fill',c);p.el.querySelector('span').style.background=c;p.edge.style.background=c}}
function list(){
  recolor();
  const all=[{id:me.id,name:me.name+' (tú)',page:PAGE}].concat(Object.values(people));
  $('am-list').innerHTML=all.map(p=>`<li><i style="background:${color(p.id)}"></i>${clean(p.name.replace(' (tú)',''))}${p.id===me.id?' (tú)':''}<small>${p.page===PAGE?'aquí':'en '+(PAGES[p.page]||'otra página')}</small></li>`).join('');
  const n=Object.keys(people).length;
  btn.innerHTML=code?`Amigos <b>${n+1}</b>`:'Jugar con amigos';
  if(code)status(n?`En la sala: ${n+1} personas. Ya están jugando juntos.`:'Esperando a tus amigos… mándales el link.');
  changed();
}
function getP(m){
  let p=people[m.id];
  if(!p){const c=color(m.id),el=document.createElement('div');el.className='am-peer';el.style.setProperty('--pc',c);el.hidden=true;
    el.innerHTML=`<svg width="18" height="22" viewBox="0 0 18 22"><path d="M1 1l15 11-6.5 1L13 21l-3 1-3.5-8L1 18z" fill="${c}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg><span style="background:${c}"></span>`;
    const edge=document.createElement('button');edge.className='am-edge';edge.style.background=c;edge.hidden=true;
    document.body.append(el,edge);
    p=people[m.id]={id:m.id,name:'',page:'',el,edge,x:null,y:null,d:null,seen:Date.now()};
    edge.onclick=()=>{const t=target(p);if(t)scrollTo({top:scrollY+t.y-innerHeight/2,behavior:'smooth'})};}
  const pg=typeof m.page==='string'?m.page.slice(0,40):'';
  if(pg!==p.page)p.since=null;
  if(Number.isFinite(m.since)&&m.since>0)p.since=m.since;
  p.name=clean(m.name);p.page=pg;p.seen=Date.now();
  p.el.querySelector('span').textContent=p.name;list();return p}
function drop(id){const p=people[id];if(!p)return;p.el.remove();p.edge.remove();delete people[id];list()}
function onMsg(m,from){
  if(!m||typeof m!=='object'||typeof m.id!=='string'||!/^[a-z0-9]{6,12}$/.test(m.id)||m.id===me.id)return;
  if(from){if(!from._pid)from._pid=m.id;else if(from._pid!==m.id)return}
  if(m.t==='bye')drop(m.id);
  else if(m.t==='m'){const p=getP(m);p.d={k:typeof m.k==='string'?m.k.slice(0,80):'',fx:+m.fx,fy:+m.fy,px:+m.px,py:+m.py}}
  else if(m.t==='c'){const p=getP(m);p.el.classList.remove('click');void p.el.offsetWidth;p.el.classList.add('click')}
  else if(m.t==='hi')getP(m);
  else if(m.t==='g'){getP(m);if(m.page===PAGE)emit('mensaje',m.d,info(m.id))}
  if(host&&from)relay(m,from);
}
function wire(c,isHost){
  const wg=gen;
  c.on('open',()=>{c.send({t:'hi',id:me.id,name:me.name,page:PAGE,since:SINCE+OFF,now:isHost?Date.now()+OFF:undefined});
    if(isHost)for(const p of Object.values(people))c.send({t:'hi',id:p.id,name:p.name,page:p.page,since:p.since==null?undefined:p.since})});
  c.on('data',m=>{if(!isHost&&m&&m.t==='hi'&&Number.isFinite(m.now)&&!c._off){c._off=1;OFF=m.now-Date.now();send({t:'hi'})}
    if(!isHost&&m&&m.t==='full'){leave();status('La sala está llena (máximo 8 personas). Crea otra sala.');return}onMsg(m,isHost?c:null)});
  c.on('close',()=>{
    if(wg!==gen)return;
    if(isHost){conns=conns.filter(x=>x!==c);if(c._pid){drop(c._pid);relay({t:'bye',id:c._pid,name:''},null)}}
    else if(code&&c===hc){for(const id of Object.keys(people))drop(id);status('Reconectando…');again()}});
}
function again(){const g=gen;setTimeout(()=>{if(code&&g===gen)connect(code)},300+Math.random()*1200+Math.min(retry++,10)*400)}
function connect(c){
  const g=++gen;
  hc=null;conns=[];host=false;for(const id of Object.keys(people))drop(id);
  if(peer)try{peer.destroy()}catch(e){}
  // 1) intentar ser el centro de la sala
  const p=new Peer(PRE+c);peer=p;
  p.on('disconnected',()=>{if(g!==gen||p.destroyed)return;try{p.reconnect()}catch(e){again()}});
  p.on('open',()=>{if(g!==gen)return;host=true;retry=0;setCode(c)});
  p.on('connection',cn=>{if(g!==gen)return;if(conns.length>=7){cn.on('open',()=>{cn.send({t:'full'});setTimeout(()=>cn.close(),300)});return}conns.push(cn);wire(cn,true)});
  p.on('error',err=>{if(g!==gen)return;
    if(err.type==='unavailable-id'){ // 2) ya hay centro: entrar como invitado
      try{p.destroy()}catch(e){}
      const q=new Peer();peer=q;
      q.on('disconnected',()=>{if(g!==gen||q.destroyed)return;try{q.reconnect()}catch(e){again()}});
      q.on('open',()=>{if(g!==gen)return;const h=hc=q.connect(PRE+c,{reliable:true});wire(h,false);
        h.on('open',()=>{if(g!==gen)return;retry=0;setCode(c)});
        setTimeout(()=>{if(g===gen&&hc===h&&!h.open){status('Reconectando…');again()}},6000)});
      q.on('error',e2=>{if(g!==gen)return;if(e2.type==='peer-unavailable'||e2.type==='network'||e2.type==='disconnected')again();else status('No se pudo conectar. Revisa tu internet.')});
    }else if(err.type==='network'||err.type==='server-error'||err.type==='socket-error'){status('Sin conexión. Reintentando…');again()}
    else status('No se pudo conectar. Revisa tu internet.')});
}
function setCode(c){code=c;sessionStorage.setItem('ratitoSala',c);const u=new URL(location.origin+'/');u.searchParams.set('sala',c);$('am-url').value=u.href;
  $('am-off').hidden=true;$('am-on').hidden=false;if(!running){running=true;requestAnimationFrame(frame)}list();send({t:'hi'})}
function start(c){
  if(typeof Peer==='undefined'){status('Cargando…');const s=document.createElement('script');s.src='https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';
    s.onload=()=>start(c);s.onerror=()=>status('No se pudo cargar la conexión. Recarga la página.');document.head.append(s);return}
  if(code!==c)SINCE=Date.now();code=c;status('Conectando a la sala '+c+'…');$('am-off').hidden=true;$('am-on').hidden=false;
  const u=new URL(location.origin+'/');u.searchParams.set('sala',c);$('am-url').value=u.href;list();connect(c);
}
function leave(){if(code)send({t:'bye'});gen++;code=null;sessionStorage.removeItem('ratitoSala');
  for(const id of Object.keys(people))drop(id);if(peer)try{peer.destroy()}catch(e){}peer=null;conns=[];hc=null;host=false;
  $('am-off').hidden=false;$('am-on').hidden=true;btn.innerHTML='Jugar con amigos';status('Crea una sala y manda el link: jugarán la misma partida y verán el cursor del otro, en cualquier juego.');changed()}
$('am-new').onclick=()=>{const A='ABCDEFGHJKMNPQRSTUVWXYZ23456789';start(Array.from(crypto.getRandomValues(new Uint8Array(6)),x=>A[x%A.length]).join(''))};
$('am-leave').onclick=leave;
$('am-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('am-url').value);$('am-copy').textContent='¡Listo!';setTimeout(()=>$('am-copy').textContent='Copiar',1200)}catch(e){$('am-url').select()}};
addEventListener('pagehide',()=>{if(code)send({t:'bye'})});


/* ---------- API para los juegos: window.RatitoSala ---------- */
const handlers={mensaje:[],cambio:[]};
function emit(ev,...a){for(const f of handlers[ev])try{f(...a)}catch(e){console.error(e)}}
function info(id){const p=id===me.id?me:people[id];return{id,name:p?clean(p.name):'Amigo',color:color(id),yo:id===me.id}}
function jugadores(){const list=[{...info(me.id),since:SINCE}];for(const p of Object.values(people))if(p.page===PAGE)list.push({...info(p.id),since:p.since==null?0:p.since});
  // el líder es el que llegó primero a este juego (así nadie que entra tarde borra la partida)
  return list.sort((a,b)=>a.since-b.since||(a.id<b.id?-1:a.id>b.id?1:0)).map(({since,...j})=>j)}
let lastSig='';
function changed(){const act=!!code&&(host||(hc&&hc.open));const sig=(act?'1':'0')+jugadores().map(j=>j.id+j.name).join(',');if(sig!==lastSig){lastSig=sig;emit('cambio')}}
window.RatitoSala={
  get activo(){return !!code&&!!(host||(hc&&hc.open))},
  get yo(){return info(me.id)},
  jugadores,
  lider(){return jugadores()[0].id===me.id},
  enviar(d){if(code)send({t:'g',d})},
  al(ev,fn){if(handlers[ev])handlers[ev].push(fn)},
};
dispatchEvent(new Event('ratitosala'));

/* ---------- posiciones ---------- */
function keyOf(el){
  const a=el.closest('a[href]');if(a&&!a.closest('.am-panel'))return 'a:'+a.getAttribute('href');
  const e=el.closest('[id]');if(e&&e!==document.body&&!e.closest('.am-panel'))return '#'+e.id;return ''}
function resolve(k){try{if(k.startsWith('#'))return document.getElementById(k.slice(1));if(k.startsWith('a:'))return document.querySelector(`a[href="${CSS.escape(k.slice(2))}"]`)}catch(e){}return null}
function myPos(target,cx,cy){
  const m={t:'m',k:''},el=target&&target.closest?target:null,de=document.documentElement;
  if(el){const k=keyOf(el),n=k&&resolve(k);if(n){const r=n.getBoundingClientRect();if(r.width&&r.height){m.k=k;m.fx=(cx-r.left)/r.width;m.fy=(cy-r.top)/r.height}}}
  m.px=(cx+scrollX)/de.scrollWidth;m.py=(cy+scrollY)/de.scrollHeight;return m}
const ok=v=>Number.isFinite(v)&&v>-1&&v<2;
function target(p){const d=p.d;if(!d)return null;
  if(d.k&&ok(d.fx)&&ok(d.fy)){const n=resolve(d.k);if(n){const r=n.getBoundingClientRect();if(r.width&&r.height)return{x:r.left+d.fx*r.width,y:r.top+d.fy*r.height}}}
  if(!ok(d.px)||!ok(d.py))return null;const de=document.documentElement;return{x:d.px*de.scrollWidth-scrollX,y:d.py*de.scrollHeight-scrollY}}
addEventListener('pointermove',e=>{lc={x:e.clientX,y:e.clientY,t:e.target};if(!code)return;const n=performance.now();if(n-sendT>45){sendT=n;send(myPos(e.target,e.clientX,e.clientY))}},{passive:true});
addEventListener('scroll',()=>{if(!code||!lc)return;const el=document.elementFromPoint(lc.x,lc.y);const n=performance.now();if(el&&n-sendT>45){sendT=n;send(myPos(el,lc.x,lc.y))}},{passive:true});
addEventListener('pointerdown',e=>{if(code){send(myPos(e.target,e.clientX,e.clientY));send({t:'c'})}},{passive:true});
function frame(){
  if(!code){running=false;return}
  for(const p of Object.values(people)){
    const t=p.page===PAGE?target(p):null;
    if(!t){p.el.hidden=true;p.edge.hidden=true;continue}
    if(p.x===null){p.x=t.x;p.y=t.y}else{p.x+=(t.x-p.x)*.35;p.y+=(t.y-p.y)*.35}
    const off=p.y<-4?'up':p.y>innerHeight+4?'down':null;
    p.el.hidden=!!off;p.el.style.transform=`translate(${p.x}px,${p.y}px)`;p.edge.hidden=!off;
    if(off){p.edge.textContent=`${p.name} está más ${off==='up'?'arriba ↑':'abajo ↓'}`;p.edge.style.top=off==='up'?'60px':'';p.edge.style.bottom=off==='down'?'80px':''}
  }
  requestAnimationFrame(frame)}

/* ---------- arranque: link con ?sala o sala guardada al cambiar de juego ---------- */
const q=(new URLSearchParams(location.search).get('sala')||'').toUpperCase();
const saved=sessionStorage.getItem('ratitoSala');
const c0=/^[A-Z0-9]{5,8}$/.test(q)?q:saved;
if(q)history.replaceState(null,'',location.pathname+location.hash);
if(c0&&/^[A-Z0-9]{5,8}$/.test(c0))start(c0);
})();
