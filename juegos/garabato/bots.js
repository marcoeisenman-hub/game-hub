/* Artistas robot de Garabato.
   dibujar(texto) -> trazos [{c,w,p:[x,y,x,y…]}] en un lienzo 800x600
   adivinar(trazos) -> frase
   Los bots arman el dibujo con una biblioteca de íconos (sujeto + accesorios + escena)
   y adivinan comparando cada grupo de trazos con esa biblioteca (forma + colores). */
(function(){
'use strict';
// colores: 0 negro 1 blanco 2 rojo 3 naranja 4 amarillo 5 verde 6 azul 7 morado 8 rosa 9 café 10 gris 11 celeste
const NC=12;
/* ---------- primitivas en una caja de 100x100 ---------- */
const C=(x,y,r,c=0,w=1,a0=0,a1=360)=>({k:'c',x,y,r,ry:r,c,w,a0,a1});
const E=(x,y,rx,ry,c=0,w=1)=>({k:'c',x,y,r:rx,ry,c,w,a0:0,a1:360});
const L=(pts,c=0,w=1)=>({k:'l',pts,c,w});
const P=(pts,c=0,w=1)=>({k:'l',pts:[...pts,pts[0]],c,w});
const F=(x,y,r,c=0)=>({k:'f',x,y,r,c}); // círculo relleno
const R=(x,y,w,h,c=0,g=1)=>P([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],c,g);
const ojos=(y,d=10,x=50,r=3)=>[F(x-d,y,r,0),F(x+d,y,r,0)];
const sonrisa=(y,a=8,x=50)=>L([[x-a,y],[x-a/2,y+a/2.5],[x+a/2,y+a/2.5],[x+a,y]],0);
const ondas=(x,y,len,n,amp,c,w=1,vert=true)=>L(Array.from({length:n*4+1},(_,i)=>vert?[x+Math.sin(i*Math.PI/2)*amp,y+i*len/(n*4)]:[x+i*len/(n*4),y+Math.sin(i*Math.PI/2)*amp]),c,w);
const persona=(cab=7,extra=[])=>[C(50,22,14,cab),...ojos(20,5,50,2),sonrisa(27,5),L([[50,36],[50,68]],cab),L([[30,50],[50,44],[70,50]],cab),L([[50,68],[36,95]],cab),L([[50,68],[64,95]],cab),...extra];

/* cada ícono: n = nombre con artículo, s = trazos, h = cabeza [x,y,r] para accesorios */
const I={
 gato:{n:'un gato',h:[50,45,28],s:[C(50,45,28,3),P([[27,32],[30,8],[45,20]],3),P([[55,20],[70,8],[73,32]],3),...ojos(42),P([[47,52],[53,52],[50,56]],8),L([[30,52],[10,48]]),L([[30,57],[10,62]]),L([[70,52],[90,48]]),L([[70,57],[90,62]]),E(50,88,18,11,3)]},
 perro:{n:'un perro',h:[50,45,26],s:[C(50,45,26,9),E(22,48,8,18,9),E(78,48,8,18,9),...ojos(40),F(50,52,5,0),L([[42,60],[50,64],[58,60]]),F(50,68,4,2),E(50,90,18,9,9)]},
 pez:{n:'un pez',s:[E(45,50,32,18,6),P([[77,50],[97,30],[97,70]],6),F(26,45,3,0),L([[38,38],[45,50],[38,62]],6),L([[10,52],[16,55]])]},
 tiburon:{n:'un tiburón',s:[E(45,55,36,16,10),P([[38,40],[50,14],[60,40]],10),P([[80,55],[98,35],[98,75]],10),F(22,50,3,0),L([[14,62],[18,58],[22,62],[26,58],[30,62],[34,58]],0)]},
 pulpo:{n:'un pulpo',h:[50,32,25],s:[C(50,32,25,7),...ojos(30,9),sonrisa(40,6),...[22,35,48,62,75].map(x=>ondas(x,55,40,2,4,7))]},
 vaca:{n:'una vaca',h:[50,45,26],s:[E(50,45,26,24,0),F(38,32,5,0),F(64,56,4,0),E(50,64,14,8,8),F(45,64,2,0),F(55,64,2,0),...ojos(40,10),L([[30,24],[22,10]],10),L([[70,24],[78,10]],10)]},
 pollo:{n:'un pollo',h:[50,50,25],s:[C(50,55,25,4),P([[72,52],[86,56],[72,60]],3),L([[42,30],[46,22],[50,30],[54,22],[58,30]],2),F(58,48,3,0),L([[42,80],[40,95]],3),L([[58,80],[60,95]],3)]},
 pinguino:{n:'un pingüino',h:[50,30,20],s:[E(50,55,24,38,0),E(50,62,15,26,10),...ojos(32,7),P([[46,40],[54,40],[50,47]],3),E(40,95,7,3,3),E(60,95,7,3,3)]},
 mono:{n:'un mono',h:[50,45,24],s:[C(50,45,24,9),C(24,42,8,9),C(76,42,8,9),E(50,54,14,11,3),...ojos(40,8),sonrisa(56,6),ondas(78,72,24,2,5,9)]},
 sapo:{n:'un sapo',h:[50,55,30],s:[E(50,62,34,22,5),C(34,38,10,5),C(66,38,10,5),F(34,38,3,0),F(66,38,3,0),L([[28,66],[40,72],[60,72],[72,66]],0)]},
 abeja:{n:'una abeja',h:[30,52,10],s:[E(50,55,28,18,4),L([[45,38],[45,72]],0,2),L([[58,38],[58,72]],0,2),E(42,30,10,14,11),E(60,30,10,14,11),F(30,52,3,0),P([[78,55],[90,55],[78,59]],0)]},
 elefante:{n:'un elefante',h:[48,40,24],s:[C(48,40,24,10),E(18,42,14,22,10),E(78,42,14,22,10),...ojos(36,8,48),L([[48,52],[46,70],[42,86],[50,92],[56,88]],10,1)]},
 dinosaurio:{n:'un dinosaurio',h:[80,24,10],s:[E(48,62,30,18,5),L([[70,52],[76,34]],5),C(80,24,10,5),F(83,22,2,0),L([[18,62],[2,74]],5),L([[28,46],[34,36],[40,46],[46,34],[52,46],[58,36],[64,48]],2),L([[36,78],[36,96]],5),L([[60,78],[60,96]],5)]},
 pajaro:{n:'un pájaro',h:[64,40,14],s:[E(48,56,24,17,6),C(64,40,14,6),P([[76,38],[92,42],[76,46]],3),F(66,37,2,0),L([[30,52],[18,40],[36,48]],6),L([[44,73],[42,88]],3),L([[54,73],[56,88]],3)]},
 tucan:{n:'un tucán',h:[54,38,14],s:[E(44,58,20,26,0),C(54,38,14,0),P([[64,32],[96,40],[66,50]],3),L([[66,36],[94,41]],4),F(56,36,3,4),E(44,64,9,14,4)]},
 caracol:{n:'un caracol',s:[L(Array.from({length:40},(_,i)=>{const a=i*0.45,r=4+i*0.75;return[48+Math.cos(a)*r,48+Math.sin(a)*r]}),9,1),L([[18,78],[88,78],[94,66],[88,58]],5),L([[90,58],[86,44]],5),L([[94,60],[98,46]],5)]},
 unicornio:{n:'un unicornio',h:[50,50,22],s:[E(50,55,20,30,7),P([[44,26],[50,2],[56,26]],4),ondas(30,24,50,3,4,8,1),...ojos(48,8),E(50,76,10,6,8)]},
 oso:{n:'un oso',h:[50,50,26],s:[C(50,50,26,9),C(28,26,9,9),C(72,26,9,9),E(50,60,10,7,9),F(50,57,3,0),...ojos(45,10)]},
 raton:{n:'un ratón',h:[50,56,20],s:[C(50,56,20,10),C(30,32,12,10),C(70,32,12,10),...ojos(52,7),F(50,62,3,8),L([[70,66],[90,72],[96,90]],10)]},
 cerdo:{n:'un cerdo',h:[50,50,26],s:[C(50,50,26,8),E(50,58,10,7,8),F(46,58,2,0),F(54,58,2,0),...ojos(42,10),P([[30,30],[28,14],[42,26]],8),P([[58,26],[72,14],[70,30]],8)]},
 sol:{n:'el sol',h:[50,50,22],s:[C(50,50,22,4),...Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return L([[50+Math.cos(a)*30,50+Math.sin(a)*30],[50+Math.cos(a)*44,50+Math.sin(a)*44]],3)}),...ojos(46,8),sonrisa(54,7)]},
 luna:{n:'la luna',s:[L([...Array.from({length:19},(_,i)=>{const a=-Math.PI/2+i*Math.PI/18;return[50+Math.cos(a)*36,50+Math.sin(a)*36]}),...Array.from({length:19},(_,i)=>{const a=Math.PI/2-i*Math.PI/18;return[40+Math.cos(a)*26,50+Math.sin(a)*30]})],4)]},
 nube:{n:'una nube',s:[C(32,58,15,11),C(52,46,19,11),C(70,58,15,11),L([[18,70],[84,70]],11)]},
 estrella:{n:'una estrella',s:[P(Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?18:42;return[50+Math.cos(a)*r,52+Math.sin(a)*r]}),4)]},
 arcoiris:{n:'un arcoíris',s:[2,3,4,5,6,7].map((c,i)=>C(50,80,44-i*5,c,1,180,360))},
 lluvia:{n:'la lluvia',s:[C(32,40,14,10),C(52,30,17,10),C(70,40,14,10),L([[18,52],[84,52]],10),...[24,38,52,66,80].flatMap((x,i)=>[L([[x,62+i%2*6],[x-3,72+i%2*6]],6),L([[x+4,82],[x+1,92]],6)])]},
 volcan:{n:'un volcán',s:[P([[6,96],[38,32],[62,32],[94,96]],9),L([[40,32],[46,46],[52,36],[58,48],[60,32]],2),L([[46,26],[44,14],[50,6]],10),C(56,10,6,10)]},
 arbol:{n:'un árbol',s:[R(42,58,16,38,9),C(50,36,30,5),C(36,40,10,5),C(62,30,10,5)]},
 flor:{n:'una flor',h:[50,30,8],s:[L([[50,40],[50,96]],5),E(40,74,10,4,5),E(60,64,10,4,5),...Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return C(50+Math.cos(a)*14,30+Math.sin(a)*14,8,8)}),F(50,30,7,4)]},
 casa:{n:'una casa',s:[R(18,46,64,50,6),P([[10,48],[50,10],[90,48]],2),R(42,68,16,28,9),R(24,56,12,12,11),R(64,56,12,12,11)]},
 carro:{n:'un carro',s:[P([[6,70],[6,54],[24,52],[34,34],[66,34],[78,52],[94,56],[94,70]],2),R(38,38,24,13,11),C(26,72,9,0),C(74,72,9,0)]},
 bus:{n:'un bus',s:[R(4,28,92,46,2),...[10,30,50,70].map(x=>R(x,36,14,14,11)),L([[4,60],[96,60]],4),C(22,78,8,0),C(78,78,8,0)]},
 bicicleta:{n:'una bicicleta',s:[C(24,66,18,0),C(76,66,18,0),L([[24,66],[44,42],[64,42],[76,66]],2),L([[44,42],[50,66],[24,66]],2),L([[64,42],[62,30],[72,30]],0),L([[40,36],[50,36]],0)]},
 patineta:{n:'una patineta',s:[L([[8,58],[16,64],[84,64],[92,58]],8,2),F(26,74,6,0),F(74,74,6,0)]},
 cohete:{n:'un cohete',s:[P([[38,78],[38,36],[50,8],[62,36],[62,78]],10),C(50,40,8,6),P([[38,60],[24,84],[38,76]],2),P([[62,60],[76,84],[62,76]],2),L([[42,82],[46,96],[50,86],[54,96],[58,82]],3)]},
 robot:{n:'un robot',h:[50,24,16],s:[R(34,10,32,28,10),L([[50,10],[50,2]],10),F(50,2,3,2),R(40,18,6,6,6),R(54,18,6,6,6),L([[42,31],[58,31]]),R(30,42,40,34,10),L([[30,50],[14,64]],10),L([[70,50],[86,64]],10),L([[40,76],[40,96]],10),L([[60,76],[60,96]],10)]},
 fantasma:{n:'un fantasma',h:[50,34,20],s:[L([[24,90],[24,36],[30,20],[50,12],[70,20],[76,36],[76,90],[68,82],[60,90],[50,82],[40,90],[32,82],[24,90]],10),E(42,38,4,7,0),E(58,38,4,7,0),C(50,54,5,0)]},
 persona:{n:'una persona',h:[50,22,14],s:persona(7)},
 zombie:{n:'un zombie',h:[50,22,14],s:[C(50,22,14,5),L([[44,17],[48,21]]),L([[48,17],[44,21]]),L([[52,17],[56,21]]),L([[56,17],[52,21]]),L([[42,29],[58,27]]),L([[50,36],[50,68]],5),L([[50,46],[84,46]],5),L([[50,52],[84,52]],5),L([[50,68],[38,95]],5),L([[50,68],[62,95]],5)]},
 astronauta:{n:'un astronauta',h:[50,22,14],s:[C(50,22,20,6),...persona(10)]},
 ninja:{n:'un ninja',h:[50,22,14],s:[...persona(0),L([[36,20],[64,20]],0,2),L([[64,20],[78,14]],2)]},
 rey:{n:'un rey',h:[50,22,14],s:[...persona(7),P([[38,10],[38,0],[44,6],[50,0],[56,6],[62,0],[62,10]],4)]},
 pizza:{n:'una pizza',s:[P([[10,20],[90,20],[50,95]],3),L([[12,24],[88,24]],9,1),F(36,36,5,2),F(60,36,5,2),F(48,58,5,2),F(52,78,3,2)]},
 hamburguesa:{n:'una hamburguesa',s:[L([[14,44],[20,22],[50,14],[80,22],[86,44],[14,44]],3),ondas(14,52,72,4,3,5,1,false),R(14,58,72,10,9),R(14,72,72,10,3)]},
 helado:{n:'un helado',s:[P([[34,48],[66,48],[50,96]],3),L([[40,60],[58,72]],9),L([[60,60],[44,78]],9),C(50,36,16,8),C(40,22,12,6)]},
 raspao:{n:'un raspao',s:[P([[30,48],[70,48],[62,96],[38,96]],10),C(50,40,22,2,1,180,360),L([[30,48],[70,48]],2),L([[40,30],[46,46]],2),L([[56,26],[60,46]],7)]},
 pina:{n:'una piña',s:[E(50,64,22,30,4),L([[34,46],[66,82]],3),L([[66,46],[34,82]],3),L([[30,62],[50,40],[70,62]],3),P([[50,34],[40,6],[50,22],[60,6]],5)]},
 platano:{n:'un plátano',s:[L(Array.from({length:12},(_,i)=>{const a=Math.PI*0.15+i*Math.PI*0.06;return[50+Math.cos(a)*40,20+Math.sin(a)*60]}),4,2),L([[88,28],[92,20]],9)]},
 empanada:{n:'una empanada',s:[L([...Array.from({length:19},(_,i)=>{const a=Math.PI+i*Math.PI/18;return[50+Math.cos(a)*40,66+Math.sin(a)*40]}),[10,66]],3),L(Array.from({length:17},(_,i)=>[12+i*4.75,66+(i%2)*5]),9)]},
 corazon:{n:'un corazón',s:[P([[50,92],[12,52],[10,30],[22,16],[38,16],[50,30],[62,16],[78,16],[90,30],[88,52]],2),F(50,46,10,2)]},
 balon:{n:'un balón',s:[C(50,50,34,0),P([[50,38],[61,46],[57,59],[43,59],[39,46]],0),F(50,49,6,0),L([[50,38],[50,16]]),L([[61,46],[82,40]]),L([[39,46],[18,40]]),L([[57,59],[68,78]]),L([[43,59],[32,78]])]},
 celular:{n:'un celular',s:[R(32,8,36,84,0),R(36,16,28,62,11),C(50,85,3,0)]},
 wifi:{n:'el wifi',s:[C(50,78,16,6,1,225,315),C(50,78,30,6,1,225,315),C(50,78,44,6,1,225,315),F(50,80,4,6)]},
 libro:{n:'un libro',s:[P([[50,24],[10,16],[10,80],[50,88],[90,80],[90,16]],6),L([[50,24],[50,88]],6),L([[18,32],[42,36]],10),L([[18,44],[42,48]],10),L([[58,36],[82,32]],10),L([[58,48],[82,44]],10)]},
 guitarra:{n:'una guitarra',s:[C(40,68,20,9),C(52,44,14,9),F(42,66,5,0),L([[56,40],[86,10]],0,1),R(84,4,10,8,9)]},
 bateria:{n:'una batería',s:[E(50,36,30,8,2),L([[20,36],[20,76]],2),L([[80,36],[80,76]],2),E(50,76,30,8,2),L([[34,26],[14,4]],9),L([[66,26],[86,4]],9)]},
 corona:{n:'una corona',s:[P([[16,74],[16,30],[32,50],[50,24],[68,50],[84,30],[84,74]],4),F(50,62,5,2)]},
 lentes:{n:'unos lentes',s:[R(12,40,30,20,0),R(58,40,30,20,0),L([[42,46],[58,46]])]},
 sombrero:{n:'un sombrero',s:[L([[8,74],[92,74]],9,1),R(28,34,44,40,9),L([[28,62],[72,62]],2)]},
 audifonos:{n:'unos audífonos',s:[C(50,56,34,0,1,180,360),R(10,52,14,24,2),R(76,52,14,24,2)]},
 alas:{n:'unas alas',s:[P([[44,50],[16,22],[4,40],[16,62]],11),P([[56,50],[84,22],[96,40],[84,62]],11)]},
 tenis:{n:'unos tenis',s:[P([[10,70],[10,44],[34,44],[48,58],[86,62],[90,74],[10,74]],2),L([[22,50],[28,58]],1)]},
 regalo:{n:'un regalo',s:[R(18,40,64,54,8),L([[50,40],[50,94]],4,1),L([[18,64],[82,64]],4,1),C(42,32,8,4),C(58,32,8,4)]},
 reloj:{n:'un reloj',s:[C(50,52,36,0),L([[50,52],[50,28]],0),L([[50,52],[66,60]],0),F(50,52,3,2)]},
 lapiz:{n:'un lápiz',s:[P([[14,80],[70,24],[82,36],[26,92]],4),P([[14,80],[8,98],[26,92]],9),R(70,16,16,10,8)]},
 papa:{n:'una papa',s:[E(50,56,36,26,9),F(36,48,2,9),F(60,62,2,9),F(56,44,2,9)]},
};
/* palabras -> ícono (en orden de importancia) */
const PAL=[
 ['astronauta','astronaut'],['robot'],['fantasma','ghost'],['zombie','zombi'],['ninja'],['rey','reina','king','queen','princesa','principe'],
 ['gato','gata','gatito','cat','michi'],['perro','perrito','perra','dog','cachorro'],['tiburon','shark'],['pulpo','octopus'],['pez','pescado','fish','pescar','pescando'],['vaca','toro','cow'],['pollo','gallina','gallo','chicken'],['pinguino','penguin'],['mono','chango','monkey'],['sapo','rana','frog'],['abeja','bee'],['elefante','elephant'],['dinosaurio','dino','t rex','dinosaur'],['tucan','toucan'],['pajaro','ave','loro','bird','paloma'],['caracol','snail'],['unicornio','caballo','unicorn','horse'],['oso','bear','perezoso','panda'],['raton','mouse','rata'],['cerdo','chancho','puerco','pig'],
 ['persona','profe','profesor','maestra','abuela','abuelo','mama','papa','nino','nina','senor','senora','messi','cristiano','batman','hombre','mujer','chico','chica','yo','mi hermano','mi hermana','amigo','doctor','policia','bailando','persona'],
 ['pizza'],['hamburguesa','burger'],['helado','ice cream'],['raspao','raspado'],['pina','pineapple'],['platano','banana','guineo'],['empanada'],['papa frita','papas'],
 ['cohete','rocket','nave'],['carro','auto','coche','car'],['bus','diablo rojo','metro','tren','autobus'],['bicicleta','bici','bike'],['patineta','skate'],
 ['casa','colegio','escuela','kiosko','super','banco','house','castillo','tienda'],['volcan','volcano'],['arbol','tree','bosque','selva'],['flor','flower','rosa'],
 ['corazon','enamorad','amor','heart','love'],['balon','pelota','messi','cristiano','futbol','basquet','basket','ball','fifa','gol'],['celular','telefono','phone','tiktok'],['wifi','internet'],['libro','tarea','examen','book','leyendo','mate'],['guitarra','guitar'],['bateria','tambor','drum'],['regalo','gift','cumple'],['reloj','clock','tarde'],['lapiz','pencil','dibujando'],
 ['corona','crown'],['lentes','gafas','glasses'],['sombrero','gorra','hat'],['audifonos','headphones','dj'],['alas','volando','wings','vuela'],['tenis','zapatos','shoes'],
 ['sol','sun','playa','verano','calor'],['luna','moon','noche','night'],['estrella','star'],['arcoiris','rainbow'],['lluvia','llorando','llora','rain','tormenta'],['nube','cloud','cielo'],
];
const CLAVE=['astronauta','robot','fantasma','zombie','ninja','rey','gato','perro','tiburon','pulpo','pez','vaca','pollo','pinguino','mono','sapo','abeja','elefante','dinosaurio','tucan','pajaro','caracol','unicornio','oso','raton','cerdo','persona','pizza','hamburguesa','helado','raspao','pina','platano','empanada','papa','cohete','carro','bus','bicicleta','patineta','casa','volcan','arbol','flor','corazon','balon','celular','wifi','libro','guitarra','bateria','regalo','reloj','lapiz','corona','lentes','sombrero','audifonos','alas','tenis','sol','luna','estrella','arcoiris','lluvia','nube'];
const ACCES=new Set(['corona','lentes','sombrero','audifonos','alas']);
const ESCENA=new Set(['sol','luna','estrella','arcoiris','lluvia','nube']);
const norm=t=>String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9ñ ]/g,' ').replace(/\s+/g,' ');

function buscar(texto){const t=' '+norm(texto)+' ',hall=[];
  PAL.forEach((ws,i)=>{let pos=Infinity;for(const w of ws){const m=t.indexOf(' '+w);if(m>=0&&m<pos&&!(w==='sol'&&t.includes('lentes de sol'))&&!(w==='papa'&&/papa frita|papas/.test(t)===false&&false))pos=m}
    if(pos<Infinity)hall.push({id:CLAVE[i],pos})});
  // "lentes de sol" son lentes, no el sol
  hall.sort((a,b)=>a.pos-b.pos);return hall.map(h=>h.id).filter((v,i,a)=>a.indexOf(v)===i)}

/* ---------- convertir primitivas a trazos ---------- */
function trazos(icon,ox,oy,tam,jit=1.1){const out=[],k=tam/100,j=()=>(Math.random()-.5)*jit*2;
  const pt=(x,y)=>[Math.round(ox+x*k+j()),Math.round(oy+y*k+j())];
  for(const s of icon.s){
    if(s.k==='l')out.push({c:s.c,w:s.w,p:s.pts.flatMap(([x,y])=>pt(x,y))});
    else if(s.k==='c'){const n=Math.max(10,Math.round(Math.abs(s.a1-s.a0)/10)),p=[];for(let i=0;i<=n;i++){const a=(s.a0+(s.a1-s.a0)*i/n)*Math.PI/180;p.push(...pt(s.x+Math.cos(a)*s.r,s.y+Math.sin(a)*s.ry))}out.push({c:s.c,w:s.w,p})}
    else if(s.k==='f'){if(s.r*k<7)out.push({c:s.c,w:s.r*k<3?0:1,p:pt(s.x,s.y)});else{const p=[];for(let i=0;i<=24;i++){const a=i*Math.PI/6,r=s.r*(1-i/26);p.push(...pt(s.x+Math.cos(a)*r,s.y+Math.sin(a)*r))}out.push({c:s.c,w:2,p})}}}
  return out}

function dibujar(texto){
  const ids=buscar(texto);let suj=ids.find(i=>!ACCES.has(i)&&!ESCENA.has(i));
  const acc=ids.filter(i=>ACCES.has(i)),esc=ids.filter(i=>ESCENA.has(i)),otros=ids.filter(i=>i!==suj&&!ACCES.has(i)&&!ESCENA.has(i));
  if(!suj){suj=esc.length?esc.shift():'persona'}
  const ts=[],S=330,ox=400-S/2,oy=150;
  // escena al fondo, arriba a la izquierda
  esc.slice(0,1).forEach(id=>ts.push(...trazos(I[id],30,20,150)));
  ts.push(...trazos(I[suj],ox,oy,S));
  const h=I[suj].h||[50,30,20],hx=ox+h[0]*S/100,hy=oy+h[1]*S/100,hr=h[2]*S/100;
  for(const a of acc.slice(0,2)){
    if(a==='lentes')ts.push(...trazos(I.lentes,hx-hr*0.95,hy-hr*0.95,hr*1.9));
    else if(a==='corona'||a==='sombrero')ts.push(...trazos(I[a],hx-hr,hy-hr*2.15,hr*2));
    else if(a==='audifonos')ts.push(...trazos(I.audifonos,hx-hr*1.25,hy-hr*1.3,hr*2.5));
    else if(a==='alas')ts.unshift(...trazos(I.alas,ox-40,oy+S*0.1,S+80));
  }
  // un objeto extra a la derecha (más chico)
  otros.slice(0,1).forEach(id=>ts.push(...trazos(I[id],ox+S+10,oy+S-190,180)));
  return ts}

/* ---------- reconocer ---------- */
const G=14;
function rasgos(ts){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const s of ts)for(let i=0;i<s.p.length;i+=2){x0=Math.min(x0,s.p[i]);x1=Math.max(x1,s.p[i]);y0=Math.min(y0,s.p[i+1]);y1=Math.max(y1,s.p[i+1])}
  const lado=Math.max(x1-x0,y1-y0,1),cx=(x0+x1)/2,cy=(y0+y1)/2,g=new Float32Array(G*G),col=new Float32Array(NC);
  const marca=(x,y,c,peso)=>{const gx=Math.max(0,Math.min(G-1,Math.floor(((x-cx)/lado+.5)*G*.999))),gy=Math.max(0,Math.min(G-1,Math.floor(((y-cy)/lado+.5)*G*.999)));g[gy*G+gx]+=peso;col[c]+=peso};
  for(const s of ts){const p=s.p,c=Math.max(0,Math.min(NC-1,s.c|0)),grosor=[1,1.6,3][s.w|0]||1;
    if(p.length<4){marca(p[0],p[1],c,grosor*2);continue}
    for(let i=0;i+3<p.length;i+=2){const dx=p[i+2]-p[i],dy=p[i+3]-p[i+1],d=Math.hypot(dx,dy),n=Math.max(1,Math.ceil(d/(lado/G/2)));for(let k=0;k<n;k++)marca(p[i]+dx*k/n,p[i+1]+dy*k/n,c,grosor*d/n/lado)}}
  // suavizar
  const b=new Float32Array(G*G);for(let y=0;y<G;y++)for(let x=0;x<G;x++){let s=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<G&&Y<G)s+=g[Y*G+X]*(dx||dy?.5:1)}b[y*G+x]=s}
  return{g:unit(b),col:unit(col),asp:(x1-x0+1)/(y1-y0+1),caja:[x0,y0,x1,y1]}}
function unit(v){let s=0;for(const x of v)s+=x*x;s=Math.sqrt(s)||1;return v.map(x=>x/s)}
const dot=(a,b)=>{let s=0;for(let i=0;i<a.length;i++)s+=a[i]*b[i];return s};
let MOLDES=null;
function moldes(){if(MOLDES)return MOLDES;MOLDES=[];for(const id of CLAVE){if(id==='persona'&&0)continue;MOLDES.push({id,...rasgos(trazos(I[id],0,0,300,0))})}return MOLDES}
function grupos(ts){// juntar trazos cuyas cajas se tocan
  const cajas=ts.map(s=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(let i=0;i<s.p.length;i+=2){x0=Math.min(x0,s.p[i]);x1=Math.max(x1,s.p[i]);y0=Math.min(y0,s.p[i+1]);y1=Math.max(y1,s.p[i+1])}return[x0-14,y0-14,x1+14,y1+14]});
  const pad=ts.map((_,i)=>i),raiz=i=>pad[i]===i?i:(pad[i]=raiz(pad[i]));
  for(let i=0;i<ts.length;i++)for(let j=i+1;j<ts.length;j++){const a=cajas[i],b=cajas[j];if(a[0]<b[2]&&b[0]<a[2]&&a[1]<b[3]&&b[1]<a[3])pad[raiz(i)]=raiz(j)}
  const m=new Map();ts.forEach((s,i)=>{const r=raiz(i);if(!m.has(r))m.set(r,[]);m.get(r).push(s)});
  return[...m.values()].map(g=>{const r=rasgos(g),[x0,y0,x1,y1]=r.caja;return{ts:g,r,area:(x1-x0)*(y1-y0)}}).filter(g=>g.area>900).sort((a,b)=>b.area-a.area)}
function clasificar(r){const M=moldes();return M.map(m=>({id:m.id,s:dot(r.g,m.g)*0.62+dot(r.col,m.col)*0.38-Math.abs(Math.log(r.asp/m.asp))*0.08})).sort((a,b)=>b.s-a.s)}
const elegir=a=>a[Math.floor(Math.random()*a.length)];
function adivinar(ts){
  if(!Array.isArray(ts)||!ts.length)return elegir(['Un dibujo invisible','Nada… ¿un fantasma muy tímido?','Una hoja en blanco muy misteriosa']);
  if(ts.length<=2&&ts.every(s=>s.p.length<=40))return elegir(['Una raya','Un palito muy serio','Una línea que se perdió']);
  const gs=grupos(ts).slice(0,4);if(!gs.length)return 'Unos puntitos misteriosos';
  const usados=new Set(),cosas=[];
  for(const g of gs){const c=clasificar(g.r).filter(x=>!usados.has(x.id));if(!c.length)continue;const top=c[0];usados.add(top.id);cosas.push({id:top.id,s:top.s,area:g.area,y:(g.r.caja[1]+g.r.caja[3])/2})}
  if(!cosas.length)return 'Un garabato abstracto';
  const prin=cosas[0],n=id=>I[id].n,mayus=t=>t.charAt(0).toUpperCase()+t.slice(1);
  if(prin.s<0.42)return mayus(n(prin.id))+'… creo';
  const resto=cosas.slice(1).filter(c=>c.s>0.45);
  const esc=resto.find(c=>ESCENA.has(c.id)),obj=resto.find(c=>!ESCENA.has(c.id));
  let f=n(prin.id);
  if(obj)f+=' con '+n(obj.id);
  if(esc)f+=esc.id==='sol'?' en un día de sol':esc.id==='luna'||esc.id==='estrella'?' de noche':esc.id==='lluvia'?' bajo la lluvia':esc.id==='nube'?' en el cielo':' con un arcoíris';
  return mayus(f)}
window.GarabatoBot={dibujar,adivinar,_buscar:buscar,_I:I};
})();
