'use strict';

// MVP 0.5 — Chapter 2 is intentionally isolated from the Phase 0 engine so the
// campaign can be tested before the content-driven chapter renderer lands.

const C2_COLORS = [
  {id:'red', en:'red', es:'rojo', hex:'#ef5b63', visual:'🧪'},
  {id:'blue', en:'blue', es:'azul', hex:'#4b86ff', visual:'🧪'},
  {id:'green', en:'green', es:'verde', hex:'#42b883', visual:'🧪'},
  {id:'yellow', en:'yellow', es:'amarillo', hex:'#f3c84b', visual:'🧪'}
];
const C2_INGREDIENTS = [
  {id:'apple',en:'apple',es:'manzana',visual:'🍎'},
  {id:'bread',en:'bread',es:'pan',visual:'🍞'},
  {id:'milk',en:'milk',es:'leche',visual:'🥛'},
  {id:'juice',en:'juice',es:'jugo',visual:'🧃'}
];

function ensureC2State(){
  state.chapter2Evidence ||= {listeningCorrect:0,listeningTotal:0,usageCorrect:0,usageTotal:0,speakingScore:0,speakingAttempts:0,helpUses:0};
  state.chapter2Scene ||= 1;
  state.chapter2Complete ||= false;
}
function c2Record(kind, correct, weight=1){
  ensureC2State();
  const e=state.chapter2Evidence;
  if(kind==='listening'){e.listeningTotal+=weight;if(correct)e.listeningCorrect+=weight;}
  if(kind==='usage'){e.usageTotal+=weight;if(correct)e.usageCorrect+=weight;}
  saveState();
}
function c2RecordSpeech(score){
  ensureC2State();
  const e=state.chapter2Evidence;e.speakingAttempts++;e.speakingScore+=score;saveState();
}
function c2Ratios(){
  ensureC2State();const e=state.chapter2Evidence;
  return {
    listening:e.listeningTotal?e.listeningCorrect/e.listeningTotal:0,
    usage:e.usageTotal?e.usageCorrect/e.usageTotal:0,
    speaking:e.speakingAttempts?e.speakingScore/e.speakingAttempts:0
  };
}
function c2Header(scene,title){
  return `<div class="chapter-progress"><span>🧪 Chapter 2</span><div class="chapter-progress-track"><i style="width:${Math.round(scene/10*100)}%"></i></div><b>${scene}/10</b></div><div class="eyebrow" style="margin-top:12px">${title}</div>`;
}
function c2Award(id,coins){claim(`chapter2_${id}`,coins);const m=String(id).match(/^scene(\d+)$/);if(m)window.MEQPedagogy?.scheduleSceneByNumber('chapter_2_potion_mystery',Number(m[1]))}
function c2Next(sceneFn, awardId, coins){if(awardId)c2Award(awardId,coins);sceneFn();}
function c2Help(text, es, unitId=''){return meqStoryHelp(text,es,unitId);}
function colorBottle(c,label=false){
  return `<div class="magic-bottle" style="--liquid:${c.hex}"><span>🧪</span>${label?`<b>${c.en}</b>`:''}</div>`;
}

function showCampaign(){
  ensureC2State();
  const c1=!!state.chapter1Complete,c2=!!state.chapter2Complete;
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Tu aventura</div><h1 class="title">Historias que se aprenden terminándolas</h1><p class="subtitle">Cada capítulo necesita el inglés del anterior. La dificultad sube porque el mundo pide más, no porque aparezca una hoja de gramática.</p>${guide(c2?'Ya resolviste dos historias. Ahora el inglés empieza a volver en contextos distintos.':c1?'Entraste a la academia. El siguiente misterio ya está abierto.':'Primero termina The Magic Letter para entrar a la academia.')}
  <div class="chapter-grid">
    <button class="chapter-card ${c1?'done':'active'}" id="campaignC1"><span>✉️</span><div><b>Chapter 1</b><strong>The Magic Letter</strong><small>${c1?'✓ Terminado':'En curso'}</small></div></button>
    <button class="chapter-card ${c1?(c2?'done':'active'):'locked'}" id="campaignC2" ${c1?'':'disabled'}><span>🧪</span><div><b>Chapter 2</b><strong>Potion Mystery</strong><small>${!c1?'🔒 Bloqueado':c2?'✓ Terminado':'Listo para jugar'}</small></div></button>
    <button class="chapter-card locked" disabled><span>🦉</span><div><b>Chapter 3</b><strong>Owl Message</strong><small>${c2?'🔒 Próximo':'🔒 Bloqueado'}</small></div></button>
  </div></section>`;
  $('campaignC1').onclick=showChapter1Intro;if(c1)$('campaignC2').onclick=showChapter2Intro;setActiveNav('story');
}

showChapter2Teaser = function(){ showChapter2Intro(); };

function showChapter2Intro(){
  ensureC2State();setActiveNav('story');
  const complete=!!state.chapter2Complete;
  screen.innerHTML=`<section class="card hero-card chapter2-hero"><div class="eyebrow">${complete?'Chapter 2 complete':'Nueva historia desbloqueada'}</div><h1 class="title">🧪 Chapter 2 · Potion Mystery</h1><p class="subtitle">${complete?'El misterio ya está resuelto. Podés volver a jugarlo sin volver a cobrar las recompensas de dominio.':'Una poción cambió de color. Para descubrir qué pasó vas a necesitar escuchar, mirar, buscar, comparar y hablar.'}</p><img class="concept-banner" src="images/potion_game_concept.png" alt="Concepto visual de la cocina de pociones" />${guide(complete?'Repetir sirve para practicar; las monedas familiares de estos logros se acreditan una sola vez.':'No te voy a enseñar una lista de colores. Si querés resolver el misterio, vas a necesitar entenderlos dentro de la cocina.')}
  <div class="skill-chips"><span>👂 escuchar</span><span>👀 reconocer</span><span>🔎 buscar</span><span>🎤 hablar</span><span>🧠 recordar</span></div>
  <button id="c2Start" class="btn primary wide" style="margin-top:15px">${complete?'Jugar de nuevo →':'Entrar a la cocina →'}</button>${complete?'<button id="c2Campaign" class="btn secondary wide" style="margin-top:9px">📚 Ver campaña</button>':''}</section>`;
  $('c2Start').onclick=c2Scene1;if(complete)$('c2Campaign').onclick=showCampaign;
}

function c2Scene1(){
  ensureC2State();state.chapter2Scene=1;saveState();session={c2s1:0};renderC2Scene1();
}
function renderC2Scene1(){
  const tasks=[
    {audio:'Come!',target:'come',art:'🦊 ➡️ 🚪',opts:[['come','🫴','come'],['wait','⏳','wait'],['stop','🛑','stop']]},
    {audio:'Open the door.',target:'open',art:'🚪✨',opts:[['open','🚪✨','open'],['close','🚪🔒','close'],['sit','🪑','sit']]}
  ];
  if(session.c2s1>=tasks.length){
    screen.innerHTML=`<section class="card word-stage">${c2Header(1,'The Wrong Color')}<div class="big-emoji">🧪✨❓</div><div class="big-word">POTION</div><button id="c2PotionAudio" class="sound-orb">🔊</button><p class="instruction">Una palabra de historia aparece porque la escena la necesita. Mirá el frasco mientras la escuchás.</p>${c2Help('No hace falta memorizar “potion” para sobrevivir fuera del juego; la palabra útil acá es entender qué objeto señala la historia.','potion = poción')}<button id="c2s1Next" class="btn primary wide" style="margin-top:14px">Ver qué color cambió →</button></section>`;
    setTimeout(()=>speak('Potion.'),220);$('c2PotionAudio').onclick=()=>speak('Potion.');$('c2s1Next').onclick=()=>c2Next(c2Scene2Observe,'scene1',30);return;
  }
  const t=tasks[session.c2s1];
  screen.innerHTML=`<section class="card word-stage">${c2Header(1,'The Wrong Color')}<div class="big-emoji">${t.art}</div><div class="prompt">Primero reutilizamos inglés que ya conocés.</div><button id="c2s1Audio" class="sound-orb">🔊</button><div class="action-grid">${shuffle(t.opts).map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div><div class="action-name">${o[2]}</div></button>`).join('')}</div><div id="c2s1Fb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c2s1Audio').onclick=()=>speak(t.audio);
  document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c2Record('listening',ok);c2Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','usage'],context:`c2s1:${session.c2s1}:${t.target}`,mode:'recycled_command',distractorId:b.dataset.id});document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('c2s1Fb').className=`feedback ${ok?'good':'soft'}`;$('c2s1Fb').textContent=ok?'✨ La orden movió la historia.':'Milo la muestra una vez más. No perdés la historia por equivocarte.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.c2s1++;renderC2Scene1()},700)});
}

function c2Scene2Observe(index=0){
  ensureC2State();state.chapter2Scene=2;saveState();const c=C2_COLORS[index];window.MEQPedagogy?.present(c.id,'chapter2',`c2s2:teach:${index}`);
  screen.innerHTML=`<section class="card word-stage">${c2Header(2,'Four Color Clues')}<span class="game-label">👀 Ver + 👂 escuchar antes de jugar</span>${colorBottle(c,false)}<div id="colorWritten" class="big-word hidden">${c.en.toUpperCase()}</div><button id="colorHear" class="sound-orb">🔊</button><p class="instruction">El líquido cambia al mismo tiempo que escuchás la palabra. Primero conexión directa; la traducción queda de rescate.</p><div class="step-dots">${C2_COLORS.map((_,i)=>`<div class="dot ${i<index?'done':i===index?'now':''}"></div>`).join('')}</div><div class="btn-row"><button id="colorReveal" class="btn secondary">🔤 Ver palabra</button><button id="colorHelp" class="btn secondary">💡 Ayuda</button><button id="colorNext" class="btn primary">${index===3?'Ahora sin palabras →':'Siguiente →'}</button></div><div id="colorHelpBox" class="help-box hidden"></div></section>`;
  setTimeout(()=>speak(c.en),220);$('colorHear').onclick=()=>speak(c.en);$('colorReveal').onclick=()=>{$('colorWritten').classList.remove('hidden');$('colorReveal').disabled=true};$('colorHelp').onclick=()=>{session.help=session.help||0;progressiveHelp(c,'colorHelpBox')};$('colorNext').onclick=()=>index<3?c2Scene2Observe(index+1):c2Scene2Game();
}
function c2Scene2Game(){session={round:0,targets:shuffle(C2_COLORS)};renderC2ColorRound();}
function renderC2ColorRound(){
  if(session.round>=session.targets.length){c2Award('scene2',40);return c2Scene3();}
  const t=session.targets[session.round];
  screen.innerHTML=`<section class="card word-stage">${c2Header(2,'Four Color Clues')}<span class="game-label">👂 Escuchá sin leer</span><div class="prompt">¿Qué botella nombró Milo?</div><button id="colorRoundAudio" class="sound-orb">🔊</button><div class="color-choice-grid">${shuffle(C2_COLORS).map(c=>`<button class="color-choice" data-id="${c.id}" aria-label="botella"><i style="background:${c.hex}"></i><span>🧪</span></button>`).join('')}</div><div id="colorFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.en),220);$('colorRoundAudio').onclick=()=>speak(t.en);document.querySelectorAll('.color-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.id;c2Record('listening',ok);meqRecordUnitTask(t.id,ok,{dimensions:['listening','visual'],context:`c2s2:color:${t.id}`,mode:'audio_to_color',distractorId:b.dataset.id});document.querySelectorAll('.color-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('colorFb').className=`feedback ${ok?'good':'soft'}`;$('colorFb').textContent=ok?'⭐ Color entendido por sonido.':`Era ${t.en}. La botella correcta brilla y vuelve a sonar.`;if(!ok)speak(t.en,true);setTimeout(()=>{session.round++;renderC2ColorRound()},650)});
}

function c2Scene3(){
  ensureC2State();state.chapter2Scene=3;saveState();session={round:0,score:0,items:[{audio:'Big.',target:'big'},{audio:'Small.',target:'small'},{audio:'A big potion.',target:'big'},{audio:'A small potion.',target:'small'}]};renderC2Size();
}
function renderC2Size(){
  if(session.round>=session.items.length){c2Award('scene3',35);return c2Scene4Observe();}
  const t=session.items[session.round];
  screen.innerHTML=`<section class="card word-stage">${c2Header(3,'Big or Small?')}<div class="prompt">Los dos calderos no son iguales. Escuchá cuál necesita Milo.</div><button id="sizeAudio" class="sound-orb">🔊</button><div class="size-grid"><button class="size-choice" data-id="big"><span class="cauldron big">⚗️</span><b>BIG</b></button><button class="size-choice" data-id="small"><span class="cauldron small">⚗️</span><b>SMALL</b></button></div><div id="sizeFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('sizeAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.size-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c2Record('listening',ok);c2Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual','usage'],context:`c2s3:size:${t.target}`,mode:'size_contrast',distractorId:b.dataset.id});document.querySelectorAll('.size-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('sizeFb').className=`feedback ${ok?'good':'soft'}`;$('sizeFb').textContent=ok?'✨ La comparación tiene sentido.':'Mirá la diferencia de tamaño y escuchá otra vez.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC2Size()},650)});
}

function c2Scene4Observe(index=0){
  ensureC2State();state.chapter2Scene=4;saveState();const u=C2_INGREDIENTS[index];window.MEQPedagogy?.present(u.id,'chapter2',`c2s4:teach:${index}`);
  screen.innerHTML=`<section class="card word-stage">${c2Header(4,'Ingredient Table')}<span class="game-label">👀 Objeto real + sonido</span><div class="big-emoji">${u.visual}</div><div id="ingWritten" class="big-word hidden">${u.en.toUpperCase()}</div><button id="ingHear" class="sound-orb">🔊</button><p class="instruction">Estas sí son palabras de vida cotidiana. La historia las necesita, pero también sirven fuera de la academia.</p><div class="btn-row"><button id="ingReveal" class="btn secondary">🔤 Ver palabra</button><button id="ingHelp" class="btn secondary">💡 Ayuda</button><button id="ingNext" class="btn primary">${index===3?'Jugar sin texto →':'Siguiente →'}</button></div><div id="ingHelpBox" class="help-box hidden"></div></section>`;
  setTimeout(()=>speak(u.en),220);$('ingHear').onclick=()=>speak(u.en);$('ingReveal').onclick=()=>{$('ingWritten').classList.remove('hidden');$('ingReveal').disabled=true};$('ingHelp').onclick=()=>{session.help=session.help||0;progressiveHelp(u,'ingHelpBox')};$('ingNext').onclick=()=>index<3?c2Scene4Observe(index+1):c2Scene4Game();
}
function c2Scene4Game(){session={round:0,targets:shuffle(C2_INGREDIENTS)};renderC2IngredientRound();}
function renderC2IngredientRound(){
  if(session.round>=session.targets.length){c2Award('scene4',45);return c2Scene5();}
  const t=session.targets[session.round];
  screen.innerHTML=`<section class="card word-stage">${c2Header(4,'Ingredient Table')}<div class="prompt">Milo pide un ingrediente. Tocá el objeto, no la traducción.</div><button id="ingRoundAudio" class="sound-orb">🔊</button><div class="choice-grid">${shuffle(C2_INGREDIENTS).map(u=>`<button class="choice ingredient-choice" data-id="${u.id}">${u.visual}</button>`).join('')}</div><div id="ingFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.en),220);$('ingRoundAudio').onclick=()=>speak(t.en);document.querySelectorAll('.ingredient-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.id;c2Record('listening',ok);meqRecordUnitTask(t.id,ok,{dimensions:['listening','visual'],context:`c2s4:ingredient:${t.id}`,mode:'audio_to_object',distractorId:b.dataset.id});document.querySelectorAll('.ingredient-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('ingFb').className=`feedback ${ok?'good':'soft'}`;$('ingFb').textContent=ok?'⭐ Sonido + objeto conectados.':`Escuchá ${t.en} otra vez y mirá el objeto.`;if(!ok)speak(t.en,true);setTimeout(()=>{session.round++;renderC2IngredientRound()},650)});
}

function c2Scene5(){
  ensureC2State();state.chapter2Scene=5;saveState();session={round:0,clues:[
    {audio:'The apple is on the table.',target:'on',art:'🍎\n🪵',opts:[['on','🍎 encima de 🪵'],['under','🪵 encima de 🍎'],['in','🎒 con 🍎 adentro']]},
    {audio:'The milk is under the table.',target:'under',art:'🪵\n🥛',opts:[['under','🪵 / 🥛 debajo'],['on','🥛 encima de 🪵'],['in','🎒 con 🥛 adentro']]},
    {audio:'The key is in the bag.',target:'in',art:'🎒🔑',opts:[['in','🎒 con 🔑 adentro'],['on','🔑 encima de 🎒'],['under','🎒 / 🔑 debajo']]}
  ]};renderC2Spatial();
}
function renderC2Spatial(){
  if(session.round>=session.clues.length){c2Award('scene5',50);return c2Scene6();}
  const t=session.clues[session.round];
  screen.innerHTML=`<section class="card word-stage">${c2Header(5,'Where Is It?')}<div class="prompt">Ahora la posición es la pista. Escuchá y elegí la escena correcta.</div><button id="spatialAudio" class="sound-orb">🔊</button><div class="spatial-grid">${shuffle(t.opts).map(o=>`<button class="spatial-choice" data-id="${o[0]}"><span>${o[1]}</span></button>`).join('')}</div><div id="spatialFb" class="feedback"></div>${c2Help('Primero mirá dónde está el objeto respecto de la mesa o bolsa.','in = dentro · on = sobre/encima · under = debajo')}</section>`;
  setTimeout(()=>speak(t.audio),220);$('spatialAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.spatial-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c2Record('listening',ok);c2Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual','usage'],context:`c2s5:spatial:${t.target}`,mode:'spatial_transfer',distractorId:b.dataset.id});document.querySelectorAll('.spatial-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('spatialFb').className=`feedback ${ok?'good':'soft'}`;$('spatialFb').textContent=ok?'🔎 Encontraste la relación espacial.':'No pasa nada. Milo ilumina la relación y la frase vuelve más lenta.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC2Spatial()},780)});
}

function c2Scene6(){
  ensureC2State();state.chapter2Scene=6;saveState();session={round:0,tasks:[
    {audio:'Take the apple.',target:'take_apple',opts:[['take_apple','🤲🍎','take apple'],['drink_juice','🧃😋','drink juice'],['eat_bread','🍞😋','eat bread']]},
    {audio:'Drink the juice.',target:'drink_juice',opts:[['take_apple','🤲🍎','take apple'],['drink_juice','🧃😋','drink juice'],['eat_bread','🍞😋','eat bread']]},
    {audio:'Eat the bread.',target:'eat_bread',opts:[['take_apple','🤲🍎','take apple'],['drink_juice','🧃😋','drink juice'],['eat_bread','🍞😋','eat bread']]},
    {audio:'Make the drink.',target:'make_drink',opts:[['make_drink','🥛🧃✨','make drink'],['close','🔒','close'],['wait','⏳','wait']]}
  ]};renderC2Actions();
}
function renderC2Actions(){
  if(session.round>=session.tasks.length){c2Award('scene6',50);return c2Scene7();}
  const t=session.tasks[session.round];
  screen.innerHTML=`<section class="card word-stage">${c2Header(6,'Make the Drink')}<div class="prompt">Las palabras son instrucciones. Si entendés, el laboratorio cambia.</div><button id="actionAudio" class="sound-orb">🔊</button><div class="action-grid">${shuffle(t.opts).map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div><div class="action-name">${o[2]}</div></button>`).join('')}</div><div id="actionFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('actionAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c2Record('listening',ok);c2Record('usage',ok);const unitId=t.target.split('_')[0];meqRecordUnitTask(unitId,ok,{dimensions:['listening','usage'],context:`c2s6:action:${unitId}`,mode:'action_use',distractorId:(b.dataset.id||'').split('_')[0]});document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('actionFb').className=`feedback ${ok?'good':'soft'}`;$('actionFb').textContent=ok?'✨ La acción correcta hizo avanzar la receta.':'Milo la representa con el cuerpo y vuelve a decirla.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC2Actions()},700)});
}

function c2Scene7(){
  ensureC2State();state.chapter2Scene=7;saveState();session={round:0,tasks:[
    {audio:'See.',target:'see',art:'👀 🧪🟢'},
    {audio:'Hear.',target:'hear',art:'👂 🔔'},
    {audio:'I see green.',target:'see',art:'👀 🟢'},
    {audio:'I hear Milo.',target:'hear',art:'👂 🦊💬'}
  ]};renderC2Senses();
}
function renderC2Senses(){
  if(session.round>=session.tasks.length){c2Award('scene7',45);return c2Scene8Intro();}
  const t=session.tasks[session.round];
  screen.innerHTML=`<section class="card word-stage">${c2Header(7,'What Do You See?')}<div class="big-emoji">${t.art}</div><div class="prompt">¿La pista pertenece a mirar o escuchar?</div><button id="senseAudio" class="sound-orb">🔊</button><div class="size-grid"><button class="size-choice" data-id="see"><span class="sense-icon">👀</span><b>SEE</b></button><button class="size-choice" data-id="hear"><span class="sense-icon">👂</span><b>HEAR</b></button></div><div id="senseFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('senseAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.size-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c2Record('listening',ok);c2Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','usage'],context:`c2s7:sense:${t.target}`,mode:'sense_contrast',distractorId:b.dataset.id});document.querySelectorAll('.size-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('senseFb').className=`feedback ${ok?'good':'soft'}`;$('senseFb').textContent=ok?'⭐ El sentido correcto.':'Mirá el icono de ojo/oreja y escuchá la frase otra vez.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC2Senses()},650)});
}

function c2Scene8Intro(){
  ensureC2State();state.chapter2Scene=8;saveState();
  screen.innerHTML=`<section class="card word-stage">${c2Header(8,'The Recipe Test')}<div class="big-emoji">📜 🎧 🧪</div><div class="prompt">Ahora Milo dice tres pasos seguidos. No aparece texto mientras escuchás.</div><button id="recipeHear" class="sound-orb">🔊</button><p class="instruction">Take the red apple. Take the milk. Make the drink.</p><div class="help-box">En la primera escucha la frase queda tapada. Este texto representa lo que el prototipo pronuncia; en producción sólo se revela como ayuda.</div><button id="recipeStart" class="btn primary wide" style="margin-top:14px">Reconstruir la receta →</button></section>`;
  const phrase='Take the red apple. Take the milk. Make the drink.';setTimeout(()=>speak(phrase),260);$('recipeHear').onclick=()=>speak(phrase);$('recipeStart').onclick=c2SequenceGame;
}
function c2SequenceGame(){
  session={sequenceChosen:[],sequence:['apple','milk','make']};renderC2Sequence();
}
function renderC2Sequence(){
  const cards=[['apple','🍎','red apple'],['milk','🥛','milk'],['make','🥛🧃✨','make drink']];
  screen.innerHTML=`<section class="card word-stage">${c2Header(8,'The Recipe Test')}<div class="prompt">Tocá las tres tarjetas en el orden que escuchaste.</div><div class="sequence-slots">${[0,1,2].map(i=>`<div>${session.sequenceChosen[i]?cards.find(c=>c[0]===session.sequenceChosen[i])[1]:'?'}</div>`).join('')}</div><div class="action-grid">${shuffle(cards).map(c=>`<button class="action-card sequence-card" data-id="${c[0]}" ${session.sequenceChosen.includes(c[0])?'disabled':''}><div class="action-icon">${c[1]}</div><div class="action-name">${c[2]}</div></button>`).join('')}</div><button id="seqReplay" class="btn secondary wide">🔊 Escuchar otra vez</button><div id="seqFb" class="feedback"></div></section>`;
  $('seqReplay').onclick=()=>speak('Take the red apple. Take the milk. Make the drink.');document.querySelectorAll('.sequence-card').forEach(b=>b.onclick=()=>{session.sequenceChosen.push(b.dataset.id);if(session.sequenceChosen.length<3)return renderC2Sequence();const ok=session.sequenceChosen.join(',')===session.sequence.join(',');c2Record('listening',ok,2);c2Record('usage',ok,2);$('seqFb').className=`feedback ${ok?'good':'soft'}`;$('seqFb').textContent=ok?'🧠 Escuchaste y conservaste el orden.':'La secuencia se mezcló. La repetimos con pausas, no volvemos al comienzo del capítulo.';setTimeout(()=>{if(ok){c2Award('scene8',55);c2Scene9()}else{session.sequenceChosen=[];speak('Take the red apple. Take the milk. Make the drink.',true);renderC2Sequence()}},850)});
}

function c2Scene9(){
  ensureC2State();state.chapter2Scene=9;saveState();session={round:0,answers:[],questions:[
    {art:colorBottle(C2_COLORS[1],false),audio:'What color is it?',target:'It is blue.',opts:['It is blue.','It is red.','It is green.']},
    {art:'🪵<br>🥛',audio:'Where is the milk?',target:'Under the table.',opts:['Under the table.','On the table.','In the bag.']},
    {art:'🧃 🍎 🥛',audio:'What do you like?',target:null,opts:['I like juice.','I like apples.','I like milk.']}
  ]};renderC2Chat();
}
function renderC2Chat(){
  if(session.round>=session.questions.length)return c2VoiceMoment();
  const q=session.questions[session.round];
  screen.innerHTML=`<section class="card word-stage">${c2Header(9,'Ask the Kitchen')}<div class="big-emoji chat-art">${q.art}</div><button id="chatAudio" class="sound-orb">🔊</button><div class="big-word chat-question">${q.audio}</div><div class="chat-options">${shuffle(q.opts).map(o=>`<button class="btn secondary chat-answer" data-answer="${o}">${o}</button>`).join('')}</div><div id="chatFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(q.audio),250);$('chatAudio').onclick=()=>speak(q.audio);document.querySelectorAll('.chat-answer').forEach(b=>b.onclick=()=>{const chosen=b.dataset.answer;const ok=q.target?chosen===q.target:true;c2Record('listening',true);c2Record('usage',ok);session.answers.push(chosen);document.querySelectorAll('.chat-answer').forEach(x=>x.disabled=true);b.classList.add('primary');$('chatFb').className='feedback good';$('chatFb').textContent=q.target?(ok?'💬 La respuesta encaja con la escena.':'Milo modela la respuesta correcta y seguimos.'):`💜 Elegiste algo de verdad: “${chosen}”`;if(q.target&&!ok)speak(q.target,true);setTimeout(()=>{session.round++;renderC2Chat()},780)});
}
function c2VoiceMoment(){
  const preference=session.answers[2]||'I like juice.';const supported=speechRecognitionSupported();
  screen.innerHTML=`<section class="card word-stage">${c2Header(9,'Ask the Kitchen')}<div class="big-emoji">🎤 🧃✨</div><div class="prompt">Ahora probá decir tu elección.</div><div class="big-word chat-question">${preference}</div><button id="voiceModel" class="sound-orb">🔊</button><div class="btn-row"><button id="c2VoiceTry" class="btn ${supported?'primary':'secondary'}" ${supported?'':'disabled'}>🎤 Hablar</button><button id="c2VoiceSkip" class="btn secondary">Seguir →</button></div><div id="c2VoiceFb" class="feedback"></div><div class="help-box">La voz suma evidencia. Si el navegador no tiene reconocimiento, no bloquea a una principiante.</div></section>`;
  setTimeout(()=>speak(preference),250);$('voiceModel').onclick=()=>speak(preference);$('c2VoiceSkip').onclick=()=>{c2Award('scene9',55);c2Scene10Intro()};if(supported)$('c2VoiceTry').onclick=()=>c2Recognize(preference);
}
function c2Recognize(target){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=3;$('c2VoiceFb').textContent='🎧 Escuchando…';
  r.onresult=e=>{const heard=[...e.results[0]].map(a=>normalize(a.transcript));const t=normalize(target);const targetWords=t.split(/\s+/);const h=heard[0]||'';const hits=targetWords.filter(w=>h.includes(w)).length;const score=Math.min(1,hits/targetWords.length);c2RecordSpeech(score);$('c2VoiceFb').className=`feedback ${score>=.65?'good':'soft'}`;$('c2VoiceFb').textContent=score>=.65?`🌟 Te entendí: “${heard[0]}”.`:`Escuché “${heard[0]}”. Probemos una vez más, lento.`;if(score<.65)speak(target,true);else setTimeout(()=>{c2Award('scene9',55);c2Scene10Intro()},850)};
  r.onerror=()=>{$('c2VoiceFb').className='feedback soft';$('c2VoiceFb').textContent='No te escuché bien. Podés probar otra vez o seguir.'};r.start();
}

function c2Scene10Intro(){
  ensureC2State();state.chapter2Scene=10;saveState();const r=c2Ratios();
  screen.innerHTML=`<section class="card hero-card">${c2Header(10,'Finale · Solve the Potion Mystery')}<div class="big-emoji">🧪🔎🏆</div><h1 class="title">No entra ninguna palabra nueva.</h1><p class="subtitle">Ahora la historia pregunta si lo aprendido sirve junto. Cinco pistas, una solución.</p><div class="mastery-grid">${metric('Escucha',r.listening)}${metric('Uso',r.usage)}${metric('Voz',r.speaking)}</div>${guide('Este es el jefe final del capítulo. Si algo falla, practicamos esa clase de pista; no te mando a repetir las diez escenas.') }<button id="c2FinalStart" class="btn primary wide" style="margin-top:15px">Resolver el misterio →</button></section>`;
  $('c2FinalStart').onclick=c2FinaleStart;
}
function c2FinaleStart(){
  session={round:0,score:0,tasks:[
    {audio:'Find the blue bottle.',target:'blue',art:'🧪🟥 🧪🟦 🧪🟩',opts:[['red','🧪🟥'],['blue','🧪🟦'],['green','🧪🟩']]},
    {audio:'Look under the table.',target:'under',art:'🪵 🔎',opts:[['on','⬆️ on'],['under','⬇️ under'],['in','📦 in']]},
    {audio:'Take the milk.',target:'milk',art:'🍎 🥛 🧃',opts:[['apple','🍎'],['milk','🥛'],['juice','🧃']]},
    {audio:'Make the drink.',target:'make',art:'🥛 + 🍎 → ✨',opts:[['make','🧪✨ make'],['eat','🍞 eat'],['drink','🧃 drink']]},
    {audio:'What color is it?',target:'green',art:'🧪🟢✨',opts:[['red','red'],['blue','blue'],['green','green']]}
  ]};renderC2Finale();
}
function renderC2Finale(){
  if(session.round>=session.tasks.length)return finishC2Finale();const t=session.tasks[session.round];
  screen.innerHTML=`<section class="card word-stage">${c2Header(10,'Finale · Solve the Potion Mystery')}<span class="game-label">🏆 Pista ${session.round+1}/5</span><div class="big-emoji">${t.art}</div><button id="bossAudio" class="sound-orb">🔊</button><div class="action-grid">${shuffle(t.opts).map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div></button>`).join('')}</div><div id="bossFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('bossAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;if(ok)session.score++;c2Record('listening',ok);c2Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','usage'],context:`c2boss:${session.round}:${t.target}`,mode:'micro_assessment',distractorId:b.dataset.id});document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('bossFb').className=`feedback ${ok?'good':'soft'}`;$('bossFb').textContent=ok?'⭐ Pista resuelta.':'Esta pista queda marcada para refuerzo.';setTimeout(()=>{session.round++;renderC2Finale()},620)});
}
function finishC2Finale(){
  const r=c2Ratios();const boss=session.score/5;const evidencePass=r.listening>=.76&&r.usage>=.72;const pass=boss>=.8&&evidencePass;
  if(pass){state.chapter2Complete=true;saveState();c2Award('finale',120)}
  screen.innerHTML=`<section class="card reward-card">${c2Header(10,'Finale · Solve the Potion Mystery')}<div class="big-emoji">${pass?'🧪✅🎉':'🦊🧠🔁'}</div><h1 class="title">${pass?'¡Misterio resuelto!':'Tenemos una pista débil'}</h1><p class="subtitle">${pass?'La botella azul estaba donde no correspondía. Reconstruiste la receta usando inglés dentro de una historia completa.':'No repetimos todo el capítulo. Milo arma un microjuego con el tipo de pista que todavía necesita práctica.'}</p><div class="mastery-grid">${metric('Boss',boss)}${metric('Escucha',r.listening)}${metric('Uso',r.usage)}${metric('Voz',r.speaking)}</div><div class="btn-row" style="margin-top:15px"><button id="c2ResultCampaign" class="btn secondary">📚 Campaña</button><button id="c2ResultNext" class="btn primary">${pass?'Ver el cierre →':'Reforzar sólo esto →'}</button></div></section>`;
  $('c2ResultCampaign').onclick=showCampaign;$('c2ResultNext').onclick=()=>pass?c2Ending():c2Repair();
}
function c2Repair(){
  const r=c2Ratios();const weak=r.listening<.76?'listening':'usage';
  const bank=weak==='listening'?[...C2_COLORS.map(c=>({audio:c.en,target:c.id,opts:C2_COLORS.map(x=>[x.id,colorBottle(x,false)])})),...C2_INGREDIENTS.map(u=>({audio:u.en,target:u.id,opts:C2_INGREDIENTS.map(x=>[x.id,x.visual])}))]:[
    {audio:'The milk is under the table.',target:'under',opts:[['in','in'],['on','on'],['under','under']]},
    {audio:'Take the apple.',target:'apple',opts:[['apple','🍎'],['milk','🥛'],['juice','🧃']]},
    {audio:'Make the drink.',target:'make',opts:[['make','make'],['eat','eat'],['drink','drink']]}
  ];
  session={repairSkill:weak,round:0,score:0,tasks:shuffle(bank).slice(0,3)};renderC2Repair();
}
function renderC2Repair(){
  if(session.round>=session.tasks.length){return c2Scene10Intro();}const t=session.tasks[session.round];
  screen.innerHTML=`<section class="card word-stage">${c2Header(10,'Milo’s Quick Repair')}<span class="game-label">🛠️ Sólo reforzamos ${session.repairSkill==='listening'?'escucha':'uso'}</span><div class="prompt">Tres pistas cortas. Después volvés al final.</div><button id="repairAudio" class="sound-orb">🔊</button><div class="action-grid">${shuffle(t.opts).map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div></button>`).join('')}</div><div id="repairFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('repairAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c2Record(session.repairSkill,ok,2);meqRecordUnitTask(t.target,ok,{dimensions:[session.repairSkill==='usage'?'usage':'listening'],context:`c2repair:${session.round}:${t.target}`,mode:'adaptive_repair',distractorId:b.dataset.id,weight:1.3});if(session.repairSkill==='usage')c2Record('listening',true,.5);document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('repairFb').className=`feedback ${ok?'good':'soft'}`;$('repairFb').textContent=ok?'✨ Reforzado.':'La repetimos lenta y reaparece en otra pista.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC2Repair()},680)});
}
function c2Ending(){
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Chapter 2 complete</div><h1 class="title">Potion Mystery · End</h1><div class="scene-art"><div class="stars"></div><div class="moon"></div><div class="scene-characters"><span>👧🏻</span><span>🧪✅</span><span>🦊</span></div></div><p class="subtitle">La cocina vuelve a la normalidad. Cuando guardás la última botella, una lechuza deja caer un mensaje. Esta vez la carta tiene dibujos, nombres y palabras que todavía no conocés.</p>${guide('Fin de la segunda historia. La próxima aventura puede empezar con gente, objetos de escuela y mensajes cortos: inglés útil que ahora tiene un motivo para aparecer.')}<div class="chapter-hook"><span>🦉✉️</span><div><b>Next: Chapter 3</b><strong>Owl Message</strong><small>People · school objects · read/write · who/where/when</small></div></div><button id="c2EndCampaign" class="btn primary wide" style="margin-top:14px">Volver a la campaña →</button></section>`;$('c2EndCampaign').onclick=showCampaign;
}

// Upgrade the campaign map from 0.4 without touching the Phase 0 learning engine.
showMap = function(){
  ensureC2State();
  screen.innerHTML=`<section class="card"><div class="eyebrow">Prólogo</div><h1 class="title">Before the Letter</h1><p class="subtitle">Diez escalones. La carta de la protagonista recién llega cuando existe una base real.</p><div class="quest-map">${MAP.map((n,i)=>{const step=i+1,unlock=step<=state.unlockedStep,current=step===state.currentStep,d=stageData(step);return `<button class="map-node ${unlock?'unlocked':'locked'} ${current?'current':''}" data-step="${step}" ${unlock?'':'disabled'}><div class="node-num">${d.mastered?'✓':step}</div><div><div class="node-title">${n[0]}</div><div class="node-sub">${n[1]}</div></div><div class="node-badge">${unlock?n[2]:'🔒'}</div></button>`}).join('')}</div></section>
  <section class="card"><div class="eyebrow">Campaña</div><h2 style="margin:5px 0">Historias</h2><div class="chapter-grid compact">
    <button class="chapter-card ${state.chapter1Complete?'done':state.phase0Complete?'active':'locked'}" id="mapC1" ${state.phase0Complete?'':'disabled'}><span>✉️</span><div><b>Chapter 1</b><strong>The Magic Letter</strong><small>${state.chapter1Complete?'✓ Terminado':state.phase0Complete?'Desbloqueado':'🔒 requiere prólogo'}</small></div></button>
    <button class="chapter-card ${state.chapter2Complete?'done':state.chapter1Complete?'active':'locked'}" id="mapC2" ${state.chapter1Complete?'':'disabled'}><span>🧪</span><div><b>Chapter 2</b><strong>Potion Mystery</strong><small>${state.chapter2Complete?'✓ Terminado':state.chapter1Complete?'Desbloqueado':'🔒 requiere Chapter 1'}</small></div></button>
  </div></section>`;
  document.querySelectorAll('.map-node.unlocked').forEach(b=>b.onclick=()=>startStep(Number(b.dataset.step)));if(state.phase0Complete)$('mapC1').onclick=showChapter1Intro;if(state.chapter1Complete)$('mapC2').onclick=showChapter2Intro;setActiveNav('map');
};

updateHud = function(){
  ensureC2State();$('coinText').textContent=state.coins;$('levelText').textContent=state.chapter2Complete?'Ch. 2 ✓':state.chapter1Complete?'Ch. 2':state.phase0Complete?'Ch. 1':'Step '+state.currentStep;$('rewardText').textContent=`${money(eligibleArs())} / ${money(state.weeklyCapArs)}`;$('headerSubtitle').textContent=state.chapter1Complete?'Potion Mystery':state.phase0Complete?'The Magic Letter':'Before the Letter · Zero English';
};

function storyRoute(){
  if(!state.phase0Complete)return state.introSeen?startStep(state.currentStep):intro();
  if(!state.chapter1Complete)return showChapter1Intro();
  if(!state.chapter2Complete)return showChapter2Intro();
  return showCampaign();
}

// Replace 0.4 nav routing with campaign-aware routing.
$('homeBtn').onclick=showMap;
document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>{const n=b.dataset.nav;if(n==='story')storyRoute();if(n==='map')showMap();if(n==='words')showWords();if(n==='review')showReview();if(n==='rewards')showRewards()});
ensureC2State();updateHud();
