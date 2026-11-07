/* game.hub — carrera: partida de competencia igual para todos en la sala.
   El líder (el que creó la sala) la inicia; todos reciben la misma semilla y la misma hora de salida.
   Uso:
     const c=Carrera({app:'calculo',el:caja,limite:45000,mejor:'alto',formato:v=>v+' pts',
                      alEmpezar:(rand,seed)=>{...}, alAcabarTiempo:()=>c.terminar(puntos), alCerrar:()=>{...}});
     c.progreso(n,max)  // barra en vivo
     c.terminar(valor)  // tu resultado final (una vez)
*/
(()=>{
const CSS=`.cr{border:2px solid #15171C;border-radius:18px;padding:14px 16px;background:#fff;margin:16px 0}
.cr-top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.cr-st{font-weight:700}
.cr-st small{display:block;font-weight:500;color:#6B7079}
.cr-btn{font:inherit;font-weight:800;border:0;border-radius:12px;padding:12px 20px;background:#15171C;color:#fff;cursor:pointer;touch-action:manipulation}
.cr-btn:disabled{opacity:.4;cursor:default}
.cr-list{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:8px}
.cr-list:empty{display:none}
.cr-list li{display:grid;grid-template-columns:30px 1fr auto;column-gap:10px;row-gap:4px;align-items:center;font-weight:700}
.cr-list .cr-bar{grid-column:2/4;height:8px;background:#EEF0F3;border-radius:9px;overflow:hidden}
.cr-list .cr-bar i{display:block;height:100%;width:0;background:var(--pc,#2D6CDF);transition:width .2s}
.cr-pos{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--pc,#EEF0F3);color:#fff;font-size:.85rem;grid-row:span 2}
.cr-v{font-variant-numeric:tabular-nums}
.cr-cuenta{position:fixed;inset:0;display:grid;place-items:center;z-index:70;pointer-events:none;font:900 min(42vw,230px)/1 "Schibsted Grotesk",system-ui,sans-serif;color:#15171C;text-shadow:0 5px 0 #fff,0 0 30px #fff}
.cr-cuenta[hidden]{display:none}
@keyframes cr-pop{0%{transform:scale(2.2);opacity:0}35%{transform:scale(.92);opacity:1}100%{transform:scale(1)}}
.cr-cuenta.pop{animation:cr-pop .45s cubic-bezier(.2,1.4,.4,1)}
.cr-son{font:inherit;border:2px solid #15171C;background:#fff;border-radius:99px;padding:6px 10px;cursor:pointer;line-height:1}
.cr-fx{position:fixed;inset:0;width:100vw;height:100vh;z-index:80;pointer-events:none}
.cr-rec{display:inline-block;margin-left:6px;background:#F5B700;color:#15171C;border-radius:99px;padding:1px 9px;font-size:.8rem;font-weight:900;animation:cr-pop .5s}
.cr-tabla{margin-top:12px;border-top:2px dashed #E2E4E8;padding-top:10px;font-weight:700;font-size:.92rem}
.cr-tabla b{display:block;font-size:.8rem;color:#6B7079;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.cr-tabla span{display:inline-flex;align-items:center;gap:6px;margin:0 6px 6px 0;padding:4px 10px;border-radius:99px;background:#F2F3F5}
.cr-tabla i{width:10px;height:10px;border-radius:50%;background:var(--pc)}
.cr-gano{position:fixed;left:50%;top:50%;z-index:85;transform:translate(-50%,-50%);background:#15171C;color:#fff;border-radius:24px;padding:22px 30px;text-align:center;box-shadow:0 10px 0 #0003,0 0 0 6px #F5B700;animation:cr-pop .5s cubic-bezier(.2,1.4,.4,1);max-width:88vw;pointer-events:none}
.cr-gano big{display:block;font:900 clamp(28px,8vw,46px)/1.05 "Schibsted Grotesk",system-ui,sans-serif;letter-spacing:-.03em}
.cr-gano small{display:block;margin-top:8px;font-weight:700;color:#F5B700;font-size:1.05rem}
body.cr-jugando .am-peer,body.cr-jugando .am-edge{display:none!important}`;
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let AC=null;const silencio=()=>{try{return localStorage.getItem('gamehubSilencio')==='1'}catch(e){return false}};
function tono(f,d,tipo,v,cuando){if(silencio())return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime+(cuando||0),os=AC.createOscillator(),g=AC.createGain();os.type=tipo||'triangle';os.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v||.1,t);g.gain.exponentialRampToValueAtTime(.001,t+d);os.connect(g).connect(AC.destination);os.start(t);os.stop(t+d+.02)}catch(e){}}
function fanfarria(){[0,4,7,12,16,19,24].forEach((s,i)=>tono(523*Math.pow(2,s/12),.2,'triangle',.09,i*.08))}
function confeti(n){const cv=document.createElement('canvas');cv.className='cr-fx';document.body.append(cv);const d=Math.min(2,devicePixelRatio||1),W=innerWidth,H=innerHeight;cv.width=W*d;cv.height=H*d;const g=cv.getContext('2d');g.scale(d,d);
  const C=['#E4572E','#2D6CDF','#1E9E6A','#6C4BD8','#F5B700','#E8577A','#0FA3B1'],ps=[];for(let i=0;i<(n||140);i++)ps.push({x:Math.random()*W,y:-20-Math.random()*H*.5,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,r:4+Math.random()*5,a:Math.random()*6,va:(Math.random()-.5)*.3,c:C[i%C.length]});
  const t0=performance.now();(function paso(t){g.clearRect(0,0,W,H);for(const p of ps){p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.a+=p.va;g.save();g.translate(p.x,p.y);g.rotate(p.a);g.fillStyle=p.c;g.fillRect(-p.r,-p.r/2.5,p.r*2,p.r/1.25);g.restore()}
    if(t-t0<3200)requestAnimationFrame(paso);else cv.remove()})(t0)}
window.GameHubFx={tono,confeti,fanfarria,silencio};
const esc=t=>String(t).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');

window.Carrera=function(o){
  const APP='carrera-'+o.app,LIM=o.limite||60000,alto=o.mejor!=='bajo',KEY='gamehub-mejor-'+o.app;
  if(!document.getElementById('cr-css')){const st=document.createElement('style');st.id='cr-css';st.textContent=CSS;document.head.append(st)}
  const box=o.el;box.classList.add('cr');
  box.innerHTML='<div class="cr-top"><span class="cr-st"></span><span style="display:flex;gap:8px;align-items:center"><button class="cr-son" type="button" aria-label="Sonido"></button><button class="cr-btn" type="button">Empezar</button></span></div><ol class="cr-list"></ol>';
  const sonBtn=box.querySelector('.cr-son');const sonTxt=()=>{sonBtn.textContent=silencio()?'🔇':'🔊'};sonTxt();
  sonBtn.onclick=()=>{try{localStorage.setItem('gamehubSilencio',silencio()?'0':'1')}catch(e){}sonTxt();dispatchEvent(new Event('gamehub-silencio'));if(!silencio())tono(660,.1)};
  const stEl=box.querySelector('.cr-st'),btn=box.querySelector('.cr-btn'),list=box.querySelector('.cr-list');
  const cuenta=document.createElement('div');cuenta.className='cr-cuenta';cuenta.hidden=true;document.body.append(cuenta);
  let record=false,festejado=null,ultCuenta=null,sala=null,offset=0,bestRTT=Infinity,pending=new Map(),leaderId='',game=null,prog={},empezo=null,mio,acabo=false,lastProg=0;
  const online=()=>!!(sala&&sala.activo),host=()=>!online()||sala.lider(),me=()=>online()?sala.yo.id:'solo';
  const clock=()=>Date.now()+offset;
  const members=()=>online()?sala.jugadores().map(p=>({id:p.id,name:p.name,color:p.color})):[{id:'solo',name:'Tú',color:'#2D6CDF'}];
  const tx=d=>{if(online())sala.enviar({...d,app:APP})};
  const fmt=v=>v==null?'—':o.formato?o.formato(v):String(v);
  const juego=()=>!!game&&!game.closed&&game.people.some(p=>p.id===me());
  const mejor=()=>{try{const n=Number(localStorage.getItem(KEY));return localStorage.getItem(KEY)!==null&&Number.isFinite(n)?n:null}catch(e){return null}};
  function guardar(v){if(v==null)return;const b=mejor();if(b===null||(alto?v>b:v<b)){record=b!==null;}if(b===null||(alto?v>b:v<b))try{localStorage.setItem(KEY,String(v))}catch(e){}}

  const nombreJuego=(document.title||'').split(' — ')[0]||o.app;
  const tablaKey=()=>'ghTabla-'+(sala&&sala.codigo||'');
  function leerTabla(){try{const t=JSON.parse(sessionStorage.getItem(tablaKey())||'{}');return t&&typeof t==='object'?t:{}}catch(e){return {}}}
  function guardarTabla(t){if(!t||typeof t!=='object')return;try{sessionStorage.setItem(tablaKey(),JSON.stringify(t))}catch(e){}}
  function puntuar(){if(!online()||game.aborted||game.people.length<2||game.ganadores)return;
    const f=orden(),w=f[0];if(!w||w.v==null){game.ganadores=[];return}
    const gan=f.filter(x=>x.v===w.v).map(x=>x.p);const t=leerTabla();
    for(const p of gan){const k=String(p.name||'Amigo').slice(0,24);t[k]={pts:((t[k]&&+t[k].pts)||0)+1,color:p.color||'#2D6CDF'}}
    game.ganadores=gan.map(p=>({id:p.id,name:String(p.name||'Amigo').slice(0,24)}));game.tabla=t;guardarTabla(t)}
  function publish(){tx({type:'state',game});render()}
  function accept(g){if(!g||typeof g!=='object'||!Array.isArray(g.people)||!Number.isFinite(g.start)||!Number.isFinite(g.seed))return;
    const nuevo=!game||game.id!==g.id;const antes=game&&game.closed;game=g;if(online()&&!host()&&g.tabla&&typeof g.tabla==='object')guardarTabla(g.tabla);if(!game.results||typeof game.results!=='object')game.results={};
    if(nuevo){prog={};mio=undefined;record=false;empezo=null;acabo=false;
      if(!g.closed&&g.people.some(p=>p.id===me()))setTimeout(()=>{const t=o.enfocar||box.parentElement.querySelector('canvas')||box.nextElementSibling;if(t&&t.getBoundingClientRect){const r=t.getBoundingClientRect();if(r.bottom>innerHeight||r.top<0)t.scrollIntoView({behavior:'smooth',block:r.height>innerHeight*.8?'start':'center'})}},50)}
    if(game.closed&&!antes&&!nuevo)cerrado();else if(game.closed&&nuevo)cerrado();render()}
  function cerrado(){if(o.alCerrar)try{o.alCerrar(game)}catch(e){console.error(e)}}
  function start(){if(!host()||(game&&!game.closed))return;
    accept({tabla:online()?leerTabla():undefined,id:me()+'-'+Math.random().toString(36).slice(2,9),seed:crypto.getRandomValues(new Uint32Array(1))[0],people:members(),start:clock()+(online()?3600:3100),results:{},closed:false});publish()}
  function reconcile(){if(!game||game.closed)return;const ids=members().map(p=>p.id);
    for(const p of game.people)if(!ids.includes(p.id)&&!Object.hasOwn(game.results,p.id))game.results[p.id]=null;
    if(clock()>game.start+LIM+5000)for(const p of game.people)if(!Object.hasOwn(game.results,p.id))game.results[p.id]=null;
    if(game.people.every(p=>Object.hasOwn(game.results,p.id))){game.closed=true;puntuar();cerrado()}}
  function receive(d,de){if(d.type!=='result'||!host()||!game||game.closed||d.id!==game.id||!game.people.some(p=>p.id===de.id)||Object.hasOwn(game.results,de.id))return;
    if(d.v!==null&&!(Number.isFinite(d.v)&&d.v>=(o.minValor||0)&&d.v<=(o.maxValor||1e9)))return;
    // no se aceptan resultados antes de la salida (salvo 'no terminó')
    if(d.v!==null&&de.id!==me()&&clock()<game.start+300)return;game.results[de.id]=d.v;if(o.primeroGana&&d.v!==null&&o.primeroGana(d.v))for(const p of game.people)if(!Object.hasOwn(game.results,p.id))game.results[p.id]=null;if(typeof d.tag==='string'&&d.tag){if(!game.tags||typeof game.tags!=='object')game.tags={};game.tags[de.id]=d.tag.slice(0,20)}reconcile();publish()}

  function terminar(v){if(!juego()||mio!==undefined)return;mio=(v==null||!Number.isFinite(+v))?null:+v;acabo=true;guardar(mio);
    prog[me()]={...(prog[me()]||{}),fin:true};const d={type:'result',id:game.id,v:mio,tag:tagMio()};if(host())receive(d,{id:me()});else tx(d);render()}
  const tagMio=()=>{try{return o.etiqueta?String(o.etiqueta()).slice(0,20):''}catch(e){return ''}};
  function progreso(n,max){if(!juego())return;prog[me()]={n:+n||0,max:+max||1,tag:tagMio()};const t=Date.now();if(t-lastProg>140){lastProg=t;tx({type:'prog',id:game.id,n:prog[me()].n,max:prog[me()].max,tag:prog[me()].tag})}renderList()}

  function orden(){const r=game.results;return game.people.map(p=>({p,v:Object.hasOwn(r,p.id)?r[p.id]:undefined,pr:prog[p.id]}))
    .sort((a,b)=>{const av=a.v==null?null:a.v,bv=b.v==null?null:b.v;if(av!==null&&bv!==null)return alto?bv-av:av-bv;if(av!==null)return -1;if(bv!==null)return 1;
      const an=a.pr?a.pr.n/a.pr.max:0,bn=b.pr?b.pr.n/b.pr.max:0;return bn-an})}
  function renderList(){if(!game){list.innerHTML='';return}
    const filas=orden(),med=['🥇','🥈','🥉'];
    list.innerHTML=filas.map((f,i)=>{const c=f.p.color||'#2D6CDF',yo=f.p.id===me();
      const pct=f.v!==undefined&&f.v!==null?100:f.pr?Math.min(100,100*f.pr.n/f.pr.max):0;
      const val=f.v!==undefined?fmt(f.v):f.pr?(o.vivo?o.vivo(f.pr.n):f.pr.n):'';
      const rk=f.v!=null?filas.findIndex(x=>x.v===f.v):i,pos=game.closed&&f.v!=null&&rk<3?med[rk]:(rk+1);
      return `<li style="--pc:${esc(c)}"><span class="cr-pos" style="${game.closed&&f.v!=null&&rk<3?'background:#fff;font-size:1.3rem':''}">${pos}</span><span>${esc(yo&&online()?'Tú':f.p.name)}${(()=>{const tg=(f.pr&&f.pr.tag)||(game.tags&&typeof game.tags[f.p.id]==='string'?game.tags[f.p.id]:'');return tg?' <small style="color:#6B7079;font-weight:600">'+esc(tg)+'</small>':''})()}</span><span class="cr-v">${esc(val)}</span><span class="cr-bar"><i style="width:${pct}%"></i></span></li>`}).join('')}
  function render(){
    const t=game?clock()-game.start:0,b=mejor();
    btn.disabled=!host()||juego()||(!!game&&!game.closed);
    btn.textContent=!host()?'El líder inicia':game&&game.closed?'Otra vez':'Empezar';
    let s,sub='';
    if(!game){s=online()?(host()?'Tú eres el líder: dale a Empezar cuando estén todos.':'Esperando a que el líder empiece…'):'¿Listo?';sub=b!==null?'Tu récord: '+fmt(b):(online()?'Todos juegan lo mismo al mismo tiempo.':'')}
    else if(game.closed){const f=orden(),w=f[0],emp=w&&w.v!=null?f.filter(x=>x.v===w.v):[];s=game.aborted?'Cambió la sala. Empiecen otra.':online()&&game.people.length>1?(!emp.length?'Nadie terminó':emp.length>1?(emp.some(x=>x.p.id===me())?'¡Empate! Tú y '+(emp.length-1)+' más':'Empate entre '+emp.map(x=>x.p.name).join(' y ')):(w.p.id===me()?'¡Ganaste!':'Ganó '+w.p.name)):(mio!=null?'Tu resultado: '+fmt(mio):'Se acabó');sub=b!==null?'Tu récord: '+fmt(b):''}
    else if(!juego())s='Entras en la siguiente partida.';
    else if(t<0)s='Prepárate…';
    else if(acabo)s='Esperando a los demás…';
    else{s='¡Ya!';sub=o.sinReloj?'':'Quedan '+Math.max(0,Math.ceil((LIM-t)/1000))+' s'}
    if(game&&game.closed&&!game.aborted&&festejado!==game.id&&game.people.some(p=>p.id===me())){festejado=game.id;const f=orden(),w=f[0];
      const gane=online()&&game.people.length>1&&w&&w.v!=null&&w.v===mio&&mio!=null;
      if(Array.isArray(game.ganadores)&&game.ganadores.length)anunciar(game.ganadores);
      if(gane||record){setTimeout(()=>{confeti(gane?170:110);fanfarria()},150)}else if(mio!=null)tono(392,.25,'triangle',.08)}
    const tt=online()?leerTabla():{},filasT=Object.entries(tt).filter(([,v])=>v&&+v.pts>0).sort((a,b)=>b[1].pts-a[1].pts);
    let tb=box.querySelector('.cr-tabla');if(filasT.length){if(!tb){tb=document.createElement('div');tb.className='cr-tabla';box.append(tb)}
      const h='<b>🏆 Tabla de la sala</b>'+filasT.map(([n,v])=>{const i=filasT.filter(x=>+x[1].pts>+v.pts).length;return '<span style="--pc:'+esc(v.color||'#2D6CDF')+'"><i></i>'+(i<3?['🥇','🥈','🥉'][i]+' ':'')+esc(n)+' · '+(+v.pts)+(+v.pts===1?' punto':' puntos')+'</span>'}).join('');if(tb.innerHTML!==h)tb.innerHTML=h}else if(tb)tb.remove();
    stEl.innerHTML=esc(s)+(game&&game.closed&&record?'<span class="cr-rec">¡Récord!</span>':'')+(sub?'<small>'+esc(sub)+'</small>':'');renderList()}

  function anunciar(gs){const d=document.createElement('div');d.className='cr-gano';
    const yo=gs.some(g=>g.id===me()),nombres=gs.map(g=>g.id===me()?'¡Tú':g.name).join(' y ');
    d.innerHTML='<big>'+esc(gs.length>1?'Empate: '+gs.map(g=>g.name).join(' y '):(yo?'¡Ganaste!':gs[0].name+' ganó'))+'</big><small>'+esc(nombreJuego)+' · +1 punto para '+(gs.length>1?'cada uno':(yo?'ti':gs[0].name))+'</small>';
    document.body.append(d);setTimeout(()=>d.remove(),3200)}
  function tick(){
    document.body.classList.toggle('cr-jugando',juego()&&clock()>=game.start-3000);
    if(game&&!game.closed&&juego()){const t=clock()-game.start;
      if(t<0&&t>-3000){cuenta.hidden=false;const n=Math.ceil(-t/1000);if(ultCuenta!==game.id+':'+n){ultCuenta=game.id+':'+n;cuenta.textContent=n;cuenta.classList.remove('pop');void cuenta.offsetWidth;cuenta.classList.add('pop');tono(440,.12,'square',.05)}}else cuenta.hidden=true;
      if(t>=0&&empezo!==game.id){empezo=game.id;cuenta.hidden=false;cuenta.textContent='¡Ya!';cuenta.classList.remove('pop');void cuenta.offsetWidth;cuenta.classList.add('pop');tono(880,.25,'square',.06);setTimeout(()=>{if(cuenta.textContent==='¡Ya!')cuenta.hidden=true},500);
        try{o.alEmpezar(mulberry(game.seed),game.seed)}catch(e){console.error(e)}}
      if(t>=LIM&&!acabo){acabo=true;if(o.alAcabarTiempo)try{o.alAcabarTiempo()}catch(e){console.error(e)}if(mio===undefined)terminar(null)}
    }else if(cuenta.textContent!=='¡Ya!')cuenta.hidden=true;
    requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
  setInterval(()=>{
    if(online()&&!host()&&game&&!game.closed&&mio!==undefined&&!Object.hasOwn(game.results,me()))tx({type:'result',id:game.id,v:mio});
    if(host()&&game&&!game.closed){const a=game.closed;reconcile();if(game.closed!==a)publish()}
    render()},250);
  setInterval(()=>{if(host()&&online()&&game)tx({type:'state',game})},2000);

  function ping(){if(!online()||host())return;const t=Date.now();pending.set(t,t);tx({type:'ping',t});for(const k of pending.keys())if(t-k>5000)pending.delete(k)}
  function conSala(fn){window.RatitoSala?fn(window.RatitoSala):addEventListener('ratitosala',()=>fn(window.RatitoSala),{once:true})}
  conSala(api=>{sala=api;
    sala.al('mensaje',(d,de)=>{if(!d||d.app!==APP)return;const leader=sala.jugadores()[0]?.id;
      if(d.type==='ping'&&host())tx({type:'pong',to:de.id,t:d.t,now:Date.now()});
      if(d.type==='pong'&&d.to===me()&&de.id===leader&&pending.has(d.t)){const rtt=Date.now()-d.t;pending.delete(d.t);if(rtt<bestRTT){bestRTT=rtt;offset=d.now-(d.t+rtt/2)}}
      if(d.type==='hello'&&host()&&game)publish();
      if(d.type==='state'&&de.id===leader&&d.game)accept(d.game);
      if(d.type==='prog'&&game&&d.id===game.id&&Number.isFinite(d.n)&&Number.isFinite(d.max)&&d.max>0){prog[de.id]={n:d.n,max:d.max,tag:typeof d.tag==='string'?d.tag.slice(0,20):''};renderList()}
      receive(d,de)});
    sala.al('cambio',()=>{const lid=online()?sala.jugadores()[0]?.id:'';
      if(lid!==leaderId){leaderId=lid;offset=0;bestRTT=Infinity;pending.clear();ping();if(game&&!game.closed){game.closed=true;game.aborted=true;cerrado()}}
      if(host()&&game){reconcile();publish()}else tx({type:'hello'});render()});
    tx({type:'hello'});render();ping()});
  setInterval(ping,1500);
  btn.onclick=start;render();
  return{terminar,progreso,get transcurrido(){return game?Math.max(0,clock()-game.start):0},get jugando(){return juego()&&clock()>=game.start&&!acabo},get online(){return online()}};
};
})();
