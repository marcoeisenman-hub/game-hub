/* Recetas sencillas: asociaciones de juego, no experimentos reales. */
'use strict';
window.MEZCLA=(()=>{
const basics=['Agua','Fuego','Tierra','Aire'];
const source=`
Vapor|♨️|Agua+Fuego|m
Lodo|🟤|Tierra+Agua|m
Polvo|💨|Tierra+Aire|m
Lava|🌋|Tierra+Fuego|m
Nube|☁️|Vapor+Aire|n
Lluvia|🌧️|Nube+Agua|n
Planta|🌱|Tierra+Lluvia|n
Ladrillo|🧱|Lodo+Fuego|m
Piedra|🪨|Lava+Agua|m
Arena|🏖️|Piedra+Aire|m
Vidrio|🔍|Arena+Fuego|m
Árbol|🌳|Planta+Agua|n
Bosque|🌲|Árbol+Árbol|l
Hoja|🍃|Árbol+Aire|n
Madera|🪵|Árbol+Piedra|m
Carbón|⚫|Madera+Fuego|m
Ceniza|🩶|Hoja+Fuego;Carbón+Fuego|m
Papel|📄|Madera+Agua|c
Lápiz|✏️|Madera+Carbón|c
Dibujo|🎨|Papel+Lápiz|c
Casa|🏠|Ladrillo+Madera|l
Ventana|🪟|Vidrio+Madera|c
Invernadero|🏡|Vidrio+Planta|l
Playa|⛱️|Arena+Agua|l
Volcán|🌋|Lava+Piedra|l
Musgo|🌿|Piedra+Lluvia|n
Energía|⚡|Fuego+Aire|m
Viento|🌬️|Aire+Aire|n
Tormenta|⛈️|Nube+Energía|n
Rayo|🌩️|Tormenta+Aire|n
Huracán|🌀|Viento+Viento;Viento+Tormenta|n
Mar|🌊|Agua+Agua|l
Océano|🐳|Mar+Mar|l
Río|🏞️|Agua+Piedra|l
Lago|🛶|Río+Tierra|l
Hielo|🧊|Agua+Viento|m
Nieve|❄️|Hielo+Nube;Hielo+Lluvia|n
Muñeco de nieve|⛄|Nieve+Nieve|c
Iglú|🛖|Hielo+Casa|l
Montaña|⛰️|Piedra+Piedra;Tierra+Tierra|l
Isla|🏝️|Tierra+Mar;Playa+Mar|l
Desierto|🏜️|Arena+Arena|l
Cactus|🌵|Planta+Desierto|n
Oasis|🐫|Desierto+Agua|l
Cielo|🌤️|Aire+Nube|l
Espacio|🌌|Cielo+Cielo|l
Sol|☀️|Fuego+Cielo|n
Luna|🌙|Piedra+Cielo|n
Estrella|⭐|Sol+Espacio|n
Planeta|🪐|Tierra+Espacio|l
Noche|🌃|Luna+Cielo|n
Arcoíris|🌈|Lluvia+Sol|n
Metal|⚙️|Piedra+Fuego|m
Oro|🪙|Metal+Sol|m
Diamante|💎|Carbón+Piedra|m
Vida|🧬|Agua+Energía|n
Bacteria|🦠|Vida+Agua|s
Pez|🐟|Vida+Mar|s
Tiburón|🦈|Pez+Pez|s
Ballena|🐋|Pez+Océano|s
Pulpo|🐙|Pez+Lodo|s
Cangrejo|🦀|Vida+Playa|s
Tortuga|🐢|Vida+Piedra|s
Pájaro|🐦|Vida+Aire;Vida+Cielo|s
Águila|🦅|Pájaro+Montaña|s
Pingüino|🐧|Pájaro+Hielo|s
Tucán|🦜|Pájaro+Selva|s
Pollo|🐔|Pájaro+Tierra|s
Huevo|🥚|Pollo+Pollo|f
Insecto|🐛|Vida+Tierra|s
Flor|🌸|Planta+Lluvia|n
Abeja|🐝|Insecto+Planta|s
Mariposa|🦋|Insecto+Flor|s
Miel|🍯|Abeja+Flor|f
Hormiga|🐜|Insecto+Arena|s
Araña|🕷️|Insecto+Insecto|s
Serpiente|🐍|Vida+Arena|s
Lagarto|🦎|Vida+Desierto|s
Dinosaurio|🦖|Lagarto+Volcán;Lagarto+Montaña|s
Dragón|🐉|Lagarto+Fuego;Dinosaurio+Fuego|s
Fósil|🦴|Dinosaurio+Piedra|c
Selva|🌴|Bosque+Lluvia|l
Mono|🐒|Vida+Árbol|s
Persona|🧑|Mono+Fuego|s
Lobo|🐺|Vida+Bosque|s
Perro|🐶|Lobo+Casa|s
Tigre|🐯|Vida+Selva|s
Gato|🐱|Tigre+Casa|s
León|🦁|Tigre+Arena|s
Vaca|🐄|Vida+Planta|s
Caballo|🐴|Vaca+Viento|s
Unicornio|🦄|Caballo+Arcoíris|s
Oveja|🐑|Vida+Nube|s
Lana|🧶|Oveja+Aire|m
Ratón|🐭|Vida+Casa|s
Cerdo|🐷|Vida+Lodo|s
Elefante|🐘|Vaca+Montaña|s
Oso|🐻|Vida+Montaña|s
Panda|🐼|Oso+Bosque|s
Rana|🐸|Vida+Musgo|s
Fantasma|👻|Persona+Ceniza|s
Zombi|🧟|Persona+Lodo|s
Mago|🧙|Persona+Energía|s
Magia|✨|Mago+Mago|n
Robot|🤖|Persona+Metal|s
Familia|👪|Persona+Casa|s
Fiesta|🎉|Persona+Persona|l
Amor|❤️|Fiesta+Persona|n
Bebé|👶|Amor+Persona|s
Agricultor|🧑‍🌾|Persona+Planta|s
Pirata|🏴‍☠️|Persona+Barco|s
Tesoro|💰|Pirata+Arena|c
Profe|🧑‍🏫|Persona+Libro|s
Doctor|🧑‍⚕️|Persona+Bacteria|s
Hospital|🏥|Doctor+Casa|l
Astronauta|🧑‍🚀|Persona+Cohete;Persona+Espacio|s
Futbolista|🏃|Persona+Balón|s
Rey|🤴|Persona+Castillo|s
Corona|👑|Rey+Metal|c
Ropa|👕|Lana+Persona|c
Zapato|👟|Ropa+Tierra|c
Castillo|🏰|Casa+Piedra|l
Ciudad|🏙️|Casa+Casa|l
Escuela|🏫|Libro+Casa|l
Estadio|🏟️|Balón+Ciudad|l
Libro|📖|Papel+Papel|c
Herramienta|🔨|Metal+Madera|c
Rueda|🛞|Madera+Piedra|c
Balón|⚽|Rueda+Aire|c
Carro|🚗|Rueda+Metal|c
Bicicleta|🚲|Rueda+Rueda|c
Moto|🏍️|Bicicleta+Energía|c
Tren|🚂|Carro+Carro|c
Bus|🚌|Carro+Persona|c
Avión|✈️|Carro+Cielo;Metal+Pájaro|c
Barco|⛵|Madera+Mar|c
Submarino|🛥️|Barco+Metal|c
Canal|🚢|Barco+Tierra|l
Cohete|🚀|Metal+Cielo|c
Puente|🌉|Río+Madera|c
Paraguas|☂️|Lluvia+Madera|c
Cable|🔌|Metal+Energía|c
Bombillo|💡|Vidrio+Energía|c
Faro|🗼|Bombillo+Playa|c
Computadora|💻|Cable+Vidrio|c
Internet|🌐|Computadora+Computadora|c
Celular|📱|Computadora+Viento|c
Videojuego|🎮|Computadora+Fiesta|c
Música|🎵|Viento+Madera|c
Guitarra|🎸|Madera+Música|c
Película|🎬|Dibujo+Energía|c
Reloj|⏰|Metal+Arena|c
Trigo|🌾|Planta+Sol|f
Harina|🌾|Trigo+Piedra|f
Pan|🍞|Trigo+Fuego|f
Verdura|🥕|Planta+Tierra|f
Sopa|🍲|Agua+Verdura|f
Maíz|🌽|Trigo+Verdura|f
Palomitas|🍿|Maíz+Fuego|f
Arroz|🍚|Trigo+Agua|f
Sushi|🍣|Arroz+Pez|f
Carne|🥩|Vaca+Fuego|f
Leche|🥛|Vaca+Agua|f
Queso|🧀|Leche+Leche|f
Helado|🍦|Leche+Hielo|f
Pizza|🍕|Pan+Queso|f
Hamburguesa|🍔|Pan+Carne|f
Pastel|🎂|Pan+Huevo|f
Empanada|🥟|Harina+Carne|f
Manzana|🍎|Árbol+Flor|f
Jugo|🧃|Manzana+Agua|f
Raspao|🍧|Hielo+Jugo|f
Plátano|🍌|Selva+Planta|f
Patacón|🍘|Plátano+Fuego|f
Coco|🥥|Árbol+Playa|f
Piña|🍍|Planta+Playa|f
Chocolate|🍫|Árbol+Leche|f
Galleta|🍪|Harina+Chocolate|f
Sal|🧂|Mar+Sol|f
`;
const elements=basics.map((name,i)=>({id:i,name,emoji:['💧','🔥','🟫','💨'][i],cat:'m'})),recipes=[],byName=new Map(elements.map(e=>[e.name,e.id])),keys=new Set();
const lines=source.trim().split('\n').map(s=>s.split('|'));
for(const [name,emoji,,cat] of lines){if(byName.has(name))throw Error('Nombre duplicado: '+name);byName.set(name,elements.length);elements.push({id:elements.length,name,emoji,cat})}
for(const [name,,pairs] of lines)for(const pair of pairs.split(';')){const names=pair.split('+'),ids=names.map(n=>byName.get(n));if(ids.some(n=>n===undefined))throw Error('Ingrediente: '+pair);const key=ids.sort((a,b)=>a-b).join(':');if(keys.has(key))throw Error('Receta duplicada: '+pair);keys.add(key);recipes.push({a:ids[0],b:ids[1],out:byName.get(name)})}
const depth=elements.map((e,i)=>i<4?0:Infinity),parents=[];
let changed=true;while(changed){changed=false;for(const r of recipes){const d=Math.max(depth[r.a],depth[r.b])+1;if(d<depth[r.out]){depth[r.out]=d;parents[r.out]=[r.a,r.b];changed=true}}}
if(depth.some(d=>!Number.isFinite(d)))throw Error('Árbol incompleto');
/* Combinaciones infinitas (modo libre): si la pareja no tiene receta, se arma algo nuevo a partir de los dos.
   Siempre da lo mismo con la misma pareja, nunca devuelve uno de los ingredientes y no tiene fin:
   Perro + Fuego = Perro de fuego · + Hielo = Perro de fuego y hielo · + Lodo = Súper perro de hielo y lodo… */
for(const e of elements){e.head=e.name;e.mods=[];e.rank=0;e.ico=e.emoji}
const PESO={s:4,c:3,l:3,f:3,n:2,m:1},PREF=['','Súper','Mega','Ultra','Híper','Giga','Omega'];
const hash=t=>{let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const prefijo=r=>r<PREF.length?PREF[r]:'Omega ×'+(r-PREF.length+2);
function armar(head,mods,rank,cat,ico,ico2){const p=prefijo(rank),n=(p?p+' '+head.toLowerCase():head)+(mods.length?' de '+mods.join(' y '):'');return{name:n,head,mods,rank,cat,ico,emoji:ico2&&ico2!==ico?ico+ico2:ico}}
function fusion(x,y){const[a,b]=x.name<=y.name?[x,y]:[y,x];
  if(a.name===b.name)return armar(a.head,a.mods,a.rank+1,a.cat,a.ico,a.emoji.replace(a.ico,''));
  const sinNada=e=>e.cat==='s'&&!e.mods.length&&!e.rank&&!e.head.includes('-')&&!e.head.includes(' ');
  if(sinNada(a)&&sinNada(b))return armar(a.head+'-'+b.head.toLowerCase(),[],0,'s',a.ico,b.ico);
  const pa=PESO[a.cat]||2,pb=PESO[b.cat]||2,primero=pa>pb||(pa===pb&&hash(a.name+'+'+b.name)%2===0),c=primero?a:b,o=primero?b:a,mod=o.head.toLowerCase();
  let mods=[...c.mods],rank=Math.max(a.rank,b.rank);
  if(mods.includes(mod)||mod===c.head.toLowerCase())rank++;else if(mods.length<2)mods.push(mod);else{mods=[mods[1],mod];rank++}
  return armar(c.head,mods,rank,c.cat,c.ico,o.ico)}
return {elements,recipes,depth,parents,fusion};
})();
