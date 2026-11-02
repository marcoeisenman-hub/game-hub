/* MEZCLA: árbol original. Formato: nombre | emoji | ingredientes; alternativas separadas por ; */
'use strict';
window.MEZCLA=(()=>{
const basics=['Agua','Fuego','Tierra','Aire'];
const source=`
Vapor|♨️|Agua+Fuego
Barro|🟤|Agua+Tierra
Brisa|🍃|Agua+Aire
Polvo|💨|Tierra+Aire
Lava|🌋|Tierra+Fuego
Chispa|✨|Aire+Fuego
Nube|☁️|Vapor+Aire;Vapor+Brisa
Lluvia|🌧️|Nube+Agua;Nube+Brisa
Piedra|🪨|Lava+Agua;Lava+Brisa
Arena|🏖️|Piedra+Aire;Piedra+Polvo
Arcilla|🏺|Barro+Tierra;Barro+Polvo
Charco|💧|Lluvia+Tierra;Agua+Barro
Río|🏞️|Agua+Charco;Lluvia+Charco
Mar|🌊|Agua+Río;Agua+Agua
Sal|🧂|Mar+Fuego;Mar+Vapor
Sol|☀️|Fuego+Chispa;Fuego+Fuego
Arcoíris|🌈|Sol+Lluvia;Sol+Nube
Semilla|🌰|Tierra+Charco
Brote|🌱|Semilla+Agua;Semilla+Lluvia
Planta|🪴|Brote+Sol;Brote+Tierra
Árbol|🌳|Planta+Tierra;Planta+Lluvia
Hoja|🍃|Árbol+Aire;Planta+Aire
Flor|🌺|Planta+Arcoíris;Brote+Arcoíris
Bosque|🌲|Árbol+Árbol;Árbol+Planta
Madera|🪵|Árbol+Piedra;Árbol+Lava
Carbón|⚫|Madera+Fuego;Bosque+Fuego
Ceniza|🩶|Hoja+Fuego;Carbón+Aire
Metal|🔩|Piedra+Fuego;Piedra+Carbón
Vidrio|🔍|Arena+Fuego;Arena+Lava
Ladrillo|🧱|Arcilla+Fuego;Barro+Fuego
Isla|🏝️|Tierra+Mar;Lava+Mar
Playa|⛱️|Arena+Mar;Arena+Isla
Montaña|⛰️|Tierra+Piedra;Piedra+Piedra
Volcán|🌋|Montaña+Lava;Montaña+Fuego
Valle|🏞️|Montaña+Río;Montaña+Lluvia
Cascada|💦|Río+Piedra
Manglar|🌿|Árbol+Mar;Bosque+Mar
Humedal|🪷|Planta+Charco;Bosque+Charco
Musgo|🟢|Piedra+Planta;Piedra+Lluvia
Hongo|🍄|Bosque+Lluvia;Madera+Charco
Alga|🌿|Planta+Mar;Hoja+Mar
Coral|🪸|Piedra+Mar;Piedra+Alga
Concha|🐚|Arena+Coral;Coral+Playa
Coco|🥥|Árbol+Playa;Semilla+Playa
Palmera|🌴|Árbol+Arena;Árbol+Coco
Fruta|🍎|Árbol+Flor;Flor+Sol
Mango|🥭|Fruta+Sol;Fruta+Brisa
Limón|🍋|Fruta+Agua;Fruta+Lluvia
Piña|🍍|Fruta+Tierra;Fruta+Arena
Guineo|🍌|Fruta+Hoja;Fruta+Planta
Plátano|🍌|Guineo+Tierra;Guineo+Semilla
Maíz|🌽|Semilla+Sol;Semilla+Planta
Arroz|🍚|Semilla+Charco;Semilla+Río
Yuca|🥔|Planta+Barro;Brote+Barro
Papa|🥔|Semilla+Montaña;Planta+Montaña
Ají|🌶️|Planta+Fuego;Fruta+Chispa
Culantro|🌿|Hoja+Lluvia;Hoja+Tierra
Café|☕|Semilla+Fuego;Semilla+Carbón
Cacao|🍫|Semilla+Bosque;Fruta+Bosque
Caña|🎋|Planta+Río;Planta+Valle
Azúcar|🍬|Caña+Fuego;Caña+Sol
Harina|🥣|Maíz+Piedra;Maíz+Polvo
Masa|🫓|Harina+Agua;Harina+Lluvia
Tortilla|🫓|Masa+Fuego;Masa+Carbón
Olla|🍲|Metal+Arcilla;Metal+Fuego
Sartén|🍳|Metal+Piedra;Metal+Carbón
Cuchara|🥄|Metal+Madera;Madera+Olla
Plato|🍽️|Arcilla+Piedra;Arcilla+Vidrio
Vaso|🥛|Vidrio+Agua;Vidrio+Olla
Botella|🍶|Vidrio+Metal
Hielo|🧊|Agua+Montaña;Agua+Brisa
Nieve|❄️|Hielo+Aire;Hielo+Nube
Granizado|🍧|Hielo+Fruta;Nieve+Fruta
Raspao|🍧|Granizado+Azúcar;Hielo+Azúcar
Limonada|🍋|Limón+Agua;Limón+Hielo
Chicha de piña|🍹|Piña+Agua;Piña+Hielo
Agua de pipa|🥥|Coco+Agua;Coco+Vaso
Chocolate|🍫|Cacao+Azúcar;Cacao+Fuego
Caramelo|🍬|Azúcar+Fuego;Azúcar+Carbón
Melcocha|🍯|Caramelo+Caña;Azúcar+Caña
Cocada|🥥|Coco+Azúcar;Coco+Caramelo
Patacón|🟡|Plátano+Sartén;Plátano+Fuego
Yuca frita|🍟|Yuca+Sartén;Yuca+Fuego
Papas fritas|🍟|Papa+Sartén;Papa+Fuego
Bollo|🫔|Masa+Hoja;Maíz+Hoja
Tamal de patio|🫔|Bollo+Olla;Masa+Olla
Hojaldra|🫓|Masa+Sartén;Harina+Sartén
Almojábano|🧀|Maíz+Sartén;Tortilla+Sartén
Arroz con coco|🍚|Arroz+Coco;Arroz+Agua de pipa
Sopa de lluvia|🥣|Olla+Lluvia;Olla+Agua
Sancocho de huerto|🍲|Yuca+Culantro;Sopa de lluvia+Culantro
Picante de la abuela|🌶️|Ají+Botella;Ají+Limón
Ensalada tropical|🥗|Mango+Piña;Mango+Limón
Desayuno ganador|🍽️|Hojaldra+Café;Tortilla+Café
Merienda legendaria|🥡|Patacón+Chicha de piña;Bollo+Raspao
Papel|📄|Madera+Agua;Hoja+Agua
Tinta|🖋️|Carbón+Agua;Ceniza+Agua
Lápiz|✏️|Madera+Carbón;Madera+Tinta
Cuaderno|📓|Papel+Papel;Papel+Madera
Dibujo|🎨|Papel+Tinta;Papel+Lápiz
Mapa|🗺️|Dibujo+Tierra;Papel+Isla
Libro|📚|Cuaderno+Tinta;Cuaderno+Papel
Idea|💡|Libro+Chispa;Dibujo+Chispa
Historia|📖|Libro+Aire;Libro+Tinta
Persona|🧑|Barro+Chispa;Arcilla+Chispa
Amistad|🤝|Persona+Persona;Persona+Flor
Risa|😂|Persona+Arcoíris;Persona+Brisa
Abrazo|🫂|Amistad+Persona;Amistad+Brisa
Familia|👨‍👩‍👧|Amistad+Casa;Persona+Abrazo
Casa|🏠|Ladrillo+Madera;Ladrillo+Vidrio
Techo|🏡|Casa+Hoja
Ventana|🪟|Casa+Vidrio;Madera+Vidrio
Barrio|🏘️|Casa+Casa
Calle|🛣️|Piedra+Barrio;Tierra+Barrio
Ciudad|🏙️|Barrio+Calle;Barrio+Barrio
Escuela|🏫|Casa+Libro;Barrio+Libro
Estudiante|🎒|Persona+Cuaderno;Persona+Escuela
Profe|🧑‍🏫|Persona+Libro;Persona+Lápiz
Tarea|📝|Estudiante+Cuaderno;Profe+Cuaderno
Recreo|🛝|Escuela+Risa;Estudiante+Amistad
Examen sorpresa|😱|Profe+Chispa;Tarea+Chispa
Tarea en grupo|🧑‍🤝‍🧑|Tarea+Amistad;Tarea+Abrazo
Exposición|🗣️|Estudiante+Historia;Estudiante+Mapa
Diploma|📜|Estudiante+Libro;Estudiante+Examen sorpresa
Vacaciones|🏖️|Estudiante+Playa;Escuela+Playa
Mochila|🎒|Estudiante+Hoja;Cuaderno+Madera
Biblioteca|📚|Escuela+Libro
Experimento|🧪|Idea+Olla;Idea+Vaso
Laboratorio|🔬|Escuela+Experimento;Casa+Experimento
Invento|🛠️|Idea+Metal;Experimento+Metal
Rueda|🛞|Madera+Idea;Piedra+Idea
Bicicleta|🚲|Rueda+Rueda;Rueda+Metal
Carrito|🛒|Rueda+Madera;Rueda+Casa
Bus|🚌|Carrito+Barrio;Carrito+Ciudad
Parada|🚏|Bus+Calle;Bus+Techo
Tranque|🚦|Bus+Bus;Bus+Carrito
Metro|🚇|Bus+Metal;Bus+Idea
Puente|🌉|Calle+Río;Madera+Río
Barco|🚢|Madera+Mar;Metal+Mar
Puerto|⚓|Barco+Ciudad;Barco+Barrio
Canal|🚢|Barco+Tierra;Río+Barco
Esclusa|🚧|Canal+Olla;Canal+Metal
Tránsito del Canal|🚢|Canal+Esclusa;Barco+Esclusa
Istmo|🌎|Tierra+Puente;Isla+Puente
Panamá|🇵🇦|Istmo+Canal;Istmo+Ciudad
Casco de colores|🏘️|Panamá+Ladrillo;Panamá+Dibujo
Cinta costera|🌊|Ciudad+Playa;Panamá+Calle
Cerro Ancón|⛰️|Panamá+Montaña;Panamá+Bosque
Darién verde|🌳|Istmo+Bosque
Archipiélago|🏝️|Isla+Isla;Isla+Mapa
Bocas de colores|🌴|Panamá+Coral;Archipiélago+Palmera
Azuero festivo|🎉|Panamá+Música;Panamá+Tambor
Chiriquí fresco|🌄|Panamá+Café;Panamá+Valle
Boquete entre nubes|☁️|Chiriquí fresco+Nube;Chiriquí fresco+Flor
Sombrero pintao|👒|Hoja+Dibujo;Panamá+Hoja
Pollera|💃|Panamá+Flor
Tambor|🥁|Madera+Risa
Ritmo|🎶|Tambor+Aire;Tambor+Persona
Música|🎵|Ritmo+Brisa;Ritmo+Ritmo
Baile|🕺|Música+Persona;Música+Risa
Murga de bolsillo|🎺|Música+Metal;Tambor+Metal
Festival|🎉|Barrio+Música;Baile+Amistad
Desfile|🥁|Calle+Tambor;Calle+Festival
Bandera|🇵🇦|Papel+Panamá
Orgullo del istmo|❤️|Bandera+Abrazo;Panamá+Amistad
Pelota|⚽|Aire+Masa;Aire+Arcilla
Cancha|🥅|Tierra+Pelota;Barrio+Pelota
Fútbol|⚽|Persona+Pelota;Cancha+Persona
Equipo|👕|Fútbol+Amistad;Cancha+Amistad
Portería|🥅|Madera+Cancha;Metal+Cancha
Gol|⚽|Pelota+Portería;Fútbol+Portería
Portero|🧤|Persona+Portería;Estudiante+Portería
Pase|🤝|Pelota+Amistad;Equipo+Pelota
Gambeta|👟|Pelota+Idea;Fútbol+Idea
Chilena de recreo|🤸|Gol+Aire;Gambeta+Aire
Hincha|📣|Persona+Equipo;Persona+Gol
Grada|🏟️|Cancha+Ladrillo;Cancha+Casa
Estadio|🏟️|Grada+Equipo;Grada+Cancha
Camiseta|👕|Equipo+Hoja;Equipo+Dibujo
La sele del patio|🇵🇦|Panamá+Equipo;Panamá+Fútbol
Remontada|🔥|Gol+Gol;Equipo+Fuego
Trofeo|🏆|Metal+Gol;Equipo+Metal
Liga del recreo|🏆|Recreo+Fútbol;Recreo+Equipo
VAR de amigos|📺|Fútbol+Ventana;Gol+Vidrio
Balón al techo|🏠|Pelota+Techo;Gol+Techo
Energía|⚡|Chispa+Metal;Chispa+Chispa
Cable|🔌|Metal+Energía;Metal+Hoja
Batería|🔋|Metal+Limón;Energía+Botella
Bombillo|💡|Vidrio+Energía;Vidrio+Chispa
Pantalla|🖥️|Vidrio+Cable;Vidrio+Batería
Teclado|⌨️|Metal+Tinta;Cable+Lápiz
Computadora|💻|Pantalla+Teclado;Pantalla+Idea
Código|👨‍💻|Computadora+Libro;Computadora+Tinta
Robot|🤖|Código+Metal;Computadora+Metal
Celular|📱|Pantalla+Batería;Computadora+Batería
Antena|📡|Metal+Aire;Cable+Aire
Señal|📶|Antena+Energía;Antena+Chispa
Wifi|📶|Señal+Computadora;Señal+Celular
Internet|🌐|Wifi+Wifi;Wifi+Cable
Chat|💬|Celular+Amistad;Internet+Amistad
Emoji|😎|Chat+Dibujo;Celular+Dibujo
Meme|🐸|Internet+Risa;Chat+Risa
Sticker|🫠|Emoji+Papel;Meme+Papel
Audio eterno|🎙️|Chat+Historia;Chat+Libro
Visto sin drama|👀|Chat+Brisa;Chat+Abrazo
Grupo del salón|💬|Chat+Escuela;Chat+Estudiante
Tarea por foto|📸|Tarea+Celular;Tarea+Pantalla
Modo avión|✈️|Celular+Aire;Celular+Nube
Cargador prestado|🔌|Batería+Amistad;Cable+Amistad
Un por ciento|🪫|Batería+Polvo;Celular+Ceniza
Lag|🐢|Internet+Barro;Wifi+Barro
Se fue el wifi|🫥|Wifi+Lluvia;Antena+Lluvia
Bug|🐛|Código+Barro;Código+Polvo
Parche|🩹|Bug+Idea;Bug+Código
Videojuego|🎮|Código+Risa;Computadora+Pelota
Control|🎮|Videojuego+Metal;Videojuego+Teclado
Partida cooperativa|🕹️|Videojuego+Amistad;Control+Amistad
Jefe final|👾|Videojuego+Montaña;Robot+Videojuego
Victoria épica|🏆|Jefe final+Equipo;Jefe final+Idea
GG del bueno|🤝|Videojuego+Abrazo;Victoria épica+Amistad
Skin de patacón|🟡|Videojuego+Patacón;Control+Patacón
Servidor en chanclas|🩴|Computadora+Playa;Internet+Playa
Nube digital|☁️|Internet+Nube;Código+Nube
IA de bolsillo|🤖|Código+Celular;Robot+Celular
Robot cocinero|🧑‍🍳|Robot+Sartén;Robot+Olla
Robot goleador|⚽|Robot+Fútbol;Robot+Gol
Dron|🚁|Robot+Aire;Robot+Brisa
Foto aérea|📷|Dron+Mapa;Dron+Celular
Satélite|🛰️|Antena+Nube;Antena+Sol
Estrella|⭐|Sol+Noche;Chispa+Noche
Noche|🌃|Sol+Carbón;Sol+Ceniza
Luna|🌙|Piedra+Noche;Noche+Mar
Telescopio|🔭|Vidrio+Estrella;Vidrio+Luna
Constelación del patacón|✨|Estrella+Patacón;Noche+Patacón
Cohete del istmo|🚀|Panamá+Chispa;Barco+Energía
Astronauta de recreo|🧑‍🚀|Estudiante+Cohete del istmo;Recreo+Luna
Huerto lunar|🌱|Luna+Planta;Luna+Semilla
Meteorito con sueño|☄️|Piedra+Estrella;Piedra+Luna
Brisa espacial|🪐|Brisa+Luna;Aire+Estrella
Planeta de raspao|🍧|Luna+Raspao;Estrella+Raspao
Mascota|🐾|Persona+Bosque;Amistad+Bosque
Rana|🐸|Charco+Mascota;Lluvia+Mascota
Rana dorada|🐸|Rana+Sol;Rana+Panamá
Perezoso|🦥|Mascota+Árbol;Mascota+Hamaca
Tucán|🦜|Mascota+Arcoíris;Mascota+Mango
Mariposa|🦋|Flor+Aire;Flor+Brisa
Abeja|🐝|Flor+Chispa;Flor+Música
Miel|🍯|Abeja+Azúcar;Abeja+Caña
Tortuga|🐢|Mascota+Concha;Mascota+Piedra
Pez|🐟|Mascota+Mar;Mascota+Río
Cardumen|🐠|Pez+Pez;Pez+Amistad
Avistamiento|🔭|Telescopio+Tucán;Telescopio+Bosque
Hamaca|🛌|Madera+Hoja;Árbol+Abrazo
Siesta|😴|Persona+Hamaca;Estudiante+Hamaca
Lunes sin alarma|⏰|Siesta+Escuela;Siesta+Tarea
Sombrilla|☂️|Lluvia+Madera;Lluvia+Techo
Aguacero puntual|⛈️|Lluvia+Escuela;Nube+Escuela
Zapatilla mojada|👟|Estudiante+Charco;Fútbol+Charco
Plan bajo techo|🎲|Amistad+Lluvia;Recreo+Lluvia
Paseo de domingo|🧺|Familia+Playa;Familia+Río
Picnic istmeño|🧺|Patacón+Playa;Bollo+Playa
Ecoequipo|♻️|Equipo+Bosque;Estudiante+Bosque
Reciclaje|♻️|Botella+Idea;Papel+Idea
Jardín del salón|🪴|Escuela+Planta;Escuela+Brote
Limpieza de playa|🧹|Ecoequipo+Playa;Reciclaje+Playa
Canal solar|☀️|Canal+Sol;Esclusa+Sol
Metro de brisa|🚇|Metro+Brisa;Metro+Aire
Ciudad esponja|🧽|Ciudad+Musgo;Ciudad+Humedal
Festival sin basura|♻️|Festival+Reciclaje;Festival+Ecoequipo
Meme del istmo|🇵🇦|Meme+Panamá;Sticker+Panamá
Patacón con wifi|📶|Patacón+Wifi;Patacón+Internet
Raspao de campeón|🏆|Raspao+Trofeo;Raspao+Gol
Canal de chocolate|🍫|Canal+Chocolate;Esclusa+Chocolate
Tarea resuelta en equipo|✅|Tarea en grupo+Idea;Tarea en grupo+Libro
Recreo infinito|🛝|Recreo+Internet;Recreo+Videojuego
Abuela tecnológica|👵|Familia+Computadora;Familia+Código
Sancocho del futuro|🍲|Robot cocinero+Sancocho de huerto;IA de bolsillo+Sancocho de huerto
Gol entre esclusas|⚽|Canal+Gol;Esclusa+Pelota
Istmo del mañana|🇵🇦|Panamá+Invento;Panamá+Ecoequipo
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
