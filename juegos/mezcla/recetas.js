/* Recetas sencillas: asociaciones de juego, no experimentos reales. */
'use strict';
window.MEZCLA=(()=>{
const basics=['Agua','Fuego','Tierra','Aire'];
const source=`
Vapor|♨️|Agua+Fuego
Lodo|🟤|Tierra+Agua
Polvo|💨|Tierra+Aire
Lava|🌋|Tierra+Fuego
Nube|☁️|Vapor+Aire
Lluvia|🌧️|Nube+Agua
Planta|🌱|Tierra+Lluvia
Ladrillo|🧱|Lodo+Fuego
Piedra|🪨|Lava+Agua
Arena|🏖️|Piedra+Aire
Vidrio|🔍|Arena+Fuego
Árbol|🌳|Planta+Agua
Bosque|🌲|Árbol+Árbol
Hoja|🍃|Árbol+Aire
Madera|🪵|Árbol+Piedra
Carbón|⚫|Madera+Fuego
Ceniza|🩶|Hoja+Fuego;Carbón+Fuego
Papel|📄|Madera+Agua
Lápiz|✏️|Madera+Carbón
Dibujo|🎨|Papel+Lápiz
Casa|🏠|Ladrillo+Madera
Ventana|🪟|Vidrio+Madera
Invernadero|🏡|Vidrio+Planta
Playa|⛱️|Arena+Agua
Volcán|🌋|Lava+Piedra
Musgo|🌿|Piedra+Lluvia
`;
const elements=basics.map((name,i)=>({id:i,name,emoji:['💧','🔥','🟫','💨'][i]})),recipes=[],byName=new Map(elements.map(e=>[e.name,e.id])),keys=new Set();
const lines=source.trim().split('\n').map(s=>s.split('|'));
for(const [name,emoji] of lines){if(byName.has(name))throw Error('Nombre duplicado: '+name);byName.set(name,elements.length);elements.push({id:elements.length,name,emoji})}
for(const [name,,pairs] of lines)for(const pair of pairs.split(';')){const names=pair.split('+'),ids=names.map(n=>byName.get(n));if(ids.some(n=>n===undefined))throw Error('Ingrediente: '+pair);const key=ids.sort((a,b)=>a-b).join(':');if(keys.has(key))throw Error('Receta duplicada: '+pair);keys.add(key);recipes.push({a:ids[0],b:ids[1],out:byName.get(name)})}
const depth=elements.map((e,i)=>i<4?0:Infinity),parents=[];
let changed=true;while(changed){changed=false;for(const r of recipes){const d=Math.max(depth[r.a],depth[r.b])+1;if(d<depth[r.out]){depth[r.out]=d;parents[r.out]=[r.a,r.b];changed=true}}}
if(depth.some(d=>!Number.isFinite(d)))throw Error('Árbol incompleto');
return {elements,recipes,depth,parents};
})();
