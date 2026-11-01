/* Vaina — partidas por rondas, solo o con amigos (usa window.RatitoSala de amigos.js).
   El líder de la sala decide la semilla y cuándo se pasa de ronda; todos mandan su respuesta.
   Uso: const P=Partida({rondas:5,alCambiar:tipo=>render()}); P.responder(datos); P.siguiente(); P.otraVez() */
(function(){
function semillaNueva(){return (Math.random()*2**31)>>>0}
window.Partida=function(o){
  let sala=null,seed=semillaNueva(),r=0,resp={};// resp[r][id]={d,name,color}
  const total=o.rondas||5,avisar=t=>{try{o.alCambiar&&o.alCambiar(t)}catch(e){console.error(e)}};
  const enSala=()=>!!(sala&&sala.activo&&sala.jugadores().length>1);
  const mando=()=>!enSala()||sala.lider();
  const yo=()=>sala&&sala.yo?sala.yo:{id:'yo',name:'Tú',color:'#15171C',yo:true};
  const tx=d=>{if(sala&&sala.activo)sala.enviar({pt:1,...d})};
  function estado(){tx({k:'estado',seed,r})}
  function mia(){const m=resp[r]&&resp[r][yo().id];if(m)tx({k:'resp',seed,r,d:m.d})}
  function poner(rr,de,d){(resp[rr]||(resp[rr]={}))[de.id]={d,name:de.name,color:de.color,yo:!!de.yo}}
  const P={
    get seed(){return seed},get ronda(){return r},get rondas(){return total},
    get enSala(){return enSala()},get mando(){return mando()},
    jugadores(){return enSala()?sala.jugadores():[yo()]},
    lider(){return enSala()?sala.jugadores()[0]:yo()},
    respuestas(rr=r){return resp[rr]||{}},
    mia(rr=r){const x=resp[rr]&&resp[rr][yo().id];return x?x.d:null},
    todos(rr=r){const m=resp[rr]||{};return P.jugadores().every(j=>m[j.id])},
    puntos(){const t={};for(const rr in resp)for(const id in resp[rr]){const x=resp[rr][id];t[id]=(t[id]||0)+(+x.d.pts||0)}return t},
    responder(d){if(P.mia())return;poner(r,{...yo(),yo:true},d);tx({k:'resp',seed,r,d});avisar('respuestas')},
    siguiente(){if(!mando()||r>=total-1)return;r++;estado();avisar('ronda')},
    otraVez(){if(!mando())return;seed=semillaNueva();r=0;resp={};estado();avisar('partida')},
  };
  function conSala(fn){window.RatitoSala?fn(RatitoSala):addEventListener('ratitosala',()=>fn(RatitoSala),{once:true})}
  conSala(S=>{sala=S;
    S.al('mensaje',(m,de)=>{if(!m||m.pt!==1)return;
      if(m.k==='estado'){const lid=S.jugadores()[0];if(!lid||lid.id!==de.id)return;
        const s=m.seed>>>0,rr=Math.max(0,Math.min(total-1,m.r|0));
        if(s!==seed){seed=s;r=rr;resp={};avisar('partida')}else if(rr!==r){r=rr;avisar('ronda')}
        mia()}
      else if(m.k==='resp'&&m.seed>>>0===seed&&Number.isInteger(m.r)&&m.r>=0&&m.r<total&&m.d&&typeof m.d==='object'){
        if(!(resp[m.r]&&resp[m.r][de.id])){poner(m.r,de,m.d);avisar('respuestas')}}
      else if(m.k==='hola'&&S.lider()){estado()}});
    S.al('cambio',()=>{if(!S.activo){avisar('gente');return}
      if(S.lider())estado();else tx({k:'hola'});mia();avisar('gente')});
    avisar('gente')});
  return P};
// generador con semilla (mulberry32)
window.azar=function(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
window.barajar=function(arr,rnd){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
})();
