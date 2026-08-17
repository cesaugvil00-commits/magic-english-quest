'use strict';

// MVP 0.9 — Chapter 4 is the first chapter built primarily on the generic
// story_runtime helpers plus small custom interactions for spatial navigation.

const C4_ID='chapter_4_forest_riddle';
const C4_EVIDENCE='chapter4Evidence';
const C4_TOTAL=10;
const C4_CHAPTER='🌲 Chapter 4';
const C4_DATA=()=>meqStoryData(C4_ID);

function ensureC4State(){
  meqEnsureEvidence(C4_EVIDENCE);
  state.chapter4Scene ||= 1;
  state.chapter4Complete ||= false;
}
function c4SceneData(n){return meqStoryScene(C4_ID,n)||{title:`Scene ${n}`,reward_coins:0};}
function c4SetScene(n){ensureC4State();state.chapter4Scene=n;saveState();}
function c4Award(n){const s=c4SceneData(n);meqAwardStory('chapter4',s.id||`scene${n}`,s.reward_coins||0);}
function c4Ratios(){return meqEvidenceRatios(C4_EVIDENCE);}
function c4Record(kind,ok,w=1){meqRecordEvidence(C4_EVIDENCE,kind,ok,w);}
function c4Visual(id){
  const map={
    tree:{id:'tree',label:'tree',en:'tree',es:'árbol',img:'forest_tree.svg'},
    flower:{id:'flower',label:'flower',en:'flower',es:'flor',img:'forest_flower.svg'},
    sun:{id:'sun',label:'sun',en:'sun',es:'sol',visual:'☀️'},
    moon:{id:'moon',label:'moon',en:'moon',es:'luna',visual:'🌙'},
    star:{id:'star',label:'star',en:'star',es:'estrella',visual:'⭐'},
    left:{id:'left',label:'left',en:'left',es:'izquierda',visual:'⬅️'},
    right:{id:'right',label:'right',en:'right',es:'derecha',visual:'➡️'},
    up:{id:'up',label:'up',en:'up',es:'arriba',visual:'⬆️'},
    down:{id:'down',label:'down',en:'down',es:'abajo',visual:'⬇️'},
    road:{id:'road',label:'road',en:'road',es:'camino / ruta',img:'road_rune.svg'},
    wind:{id:'wind',label:'wind',en:'wind',es:'viento',visual:'🍃'},
    walk:{id:'walk',label:'walk',en:'walk',es:'caminar',visual:'🚶'}
  };return map[id];
}

function showChapter4Intro(){
  ensureC4State();setActiveNav('story');const complete=!!state.chapter4Complete;
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">${complete?'Chapter 4 complete':'Nueva historia desbloqueada'}</div><h1 class="title">Chapter 4 · Forest Riddle</h1><p class="subtitle">${complete?'El camino del bosque ya está resuelto. Podés repetirlo para memoria y fluidez.':'El mensaje del búho termina en el borde de un bosque. Esta vez el inglés no sólo describe: te dice por dónde moverte.'}</p>
  ${meqSceneFrame({backdrop:'forest_night.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.63},{src:'milo.svg',alt:'Milo',pos:'right-ground',motion:'gentle-bob',scale:.58}],props:[{src:'direction_sign.svg',alt:'direction sign',pos:'center-letter',motion:'letter-glow',scale:.38}],caption:complete?'The road remembers you.':'The path splits in two…',label:'FOREST RIDDLE'})}
  ${meqGuideVisual(complete?'Repetir ahora refuerza direcciones y comprensión auditiva. Los premios familiares no se duplican.':'Acá LEFT y RIGHT no son una lista: si entendés mal, caminás por el sendero equivocado.')}<div class="scene-skill-row"><span>👂 escuchar</span><span>🧭 orientarse</span><span>👀 buscar</span><span>📖 leer después</span><span>🎤 preguntar</span></div><button id="c4Start" class="btn primary wide">${complete?'Jugar de nuevo →':'Entrar al bosque →'}</button>${complete?'<button id="c4Campaign" class="btn secondary wide" style="margin-top:9px">📚 Ver campaña</button>':''}</section>`;
  $('c4Start').onclick=c4Scene1Teach;if(complete)$('c4Campaign').onclick=showCampaign;
}

function c4Scene1Teach(){
  c4SetScene(1);meqRuntimeTeachCarousel({chapterLabel:C4_CHAPTER,scene:1,total:C4_TOTAL,title:c4SceneData(1).title,items:[c4Visual('tree'),c4Visual('flower')],onDone:c4Scene1Game});
}
function c4Scene1Game(){
  meqRuntimeListenChoices({stateKey:C4_EVIDENCE,chapterLabel:C4_CHAPTER,scene:1,total:C4_TOTAL,title:c4SceneData(1).title,tasks:[
    {audio:'Find the flower.',target:'flower',translation:'flower = flor',choices:[c4Visual('tree'),c4Visual('flower'),{id:'star',visual:'⭐'}]},
    {audio:'Find the tree.',target:'tree',translation:'tree = árbol',choices:[c4Visual('tree'),c4Visual('flower'),{id:'moon',visual:'🌙'}]}
  ],onDone:()=>{c4Award(1);c4Scene2Teach();}});
}

function c4Scene2Teach(){
  c4SetScene(2);meqRuntimeTeachCarousel({chapterLabel:C4_CHAPTER,scene:2,total:C4_TOTAL,title:c4SceneData(2).title,items:[c4Visual('sun'),c4Visual('moon'),c4Visual('star')],onDone:c4Scene2Game});
}
function c4Scene2Game(){
  meqRuntimeListenChoices({stateKey:C4_EVIDENCE,chapterLabel:C4_CHAPTER,scene:2,total:C4_TOTAL,title:c4SceneData(2).title,tasks:[
    {audio:'Find the star.',target:'star',choices:[c4Visual('sun'),c4Visual('moon'),c4Visual('star')]},
    {audio:'Moon.',target:'moon',choices:[c4Visual('sun'),c4Visual('moon'),c4Visual('star')]},
    {audio:'Sun.',target:'sun',choices:[c4Visual('sun'),c4Visual('moon'),c4Visual('star')]}
  ],onDone:()=>{c4Award(2);c4Scene3();}});
}

function c4Scene3(){
  c4SetScene(3);const dirs=[c4Visual('left'),c4Visual('right')];
  meqRuntimeListenChoices({stateKey:C4_EVIDENCE,chapterLabel:C4_CHAPTER,scene:3,total:C4_TOTAL,title:c4SceneData(3).title,tasks:[
    {audio:'Go left.',target:'left',translation:'left = izquierda',choices:dirs,prompt:'El sendero se divide. ¿Por dónde dijo Milo?'},
    {audio:'Go right.',target:'right',translation:'right = derecha',choices:dirs,prompt:'Otra bifurcación.'},
    {audio:'Look left.',target:'left',choices:dirs,prompt:'No camines: sólo mirá.'},
    {audio:'Look right.',target:'right',choices:dirs,prompt:'Seguí la dirección con los ojos.'}
  ],onDone:()=>{c4Award(3);c4Scene4();}});
}

function c4Scene4(){
  c4SetScene(4);const dirs=[c4Visual('up'),c4Visual('down')];
  meqRuntimeListenChoices({stateKey:C4_EVIDENCE,chapterLabel:C4_CHAPTER,scene:4,total:C4_TOTAL,title:c4SceneData(4).title,tasks:[
    {audio:'Look up.',target:'up',translation:'up = arriba',choices:dirs,prompt:'Una luz aparece sobre los árboles.'},
    {audio:'Look down.',target:'down',translation:'down = abajo',choices:dirs,prompt:'Algo brilla cerca del piso.'},
    {audio:'The star is up.',target:'up',choices:dirs,prompt:'¿Dónde está la estrella?'},
    {audio:'The flower is down.',target:'down',choices:dirs,prompt:'¿Dónde está la flor?'}
  ],onDone:()=>{c4Award(4);c4Scene5();}});
}

function c4Scene5(){
  c4SetScene(5);
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C4_CHAPTER,5,C4_TOTAL,c4SceneData(5).title)}<span class="game-label">📍 Entender una relación</span><div class="prompt">The star is between the trees.</div><button id="c4BetweenAudio" class="sound-orb">🔊</button><div class="between-board"><div class="between-tree left-tree">${meqImg('forest_tree.svg','tree')}</div><button class="between-slot slot-left" data-id="left">⭐</button><button class="between-slot slot-between" data-id="between">⭐</button><button class="between-slot slot-right" data-id="right">⭐</button><div class="between-tree right-tree">${meqImg('forest_tree.svg','tree')}</div></div><div id="c4BetweenFb" class="feedback"></div>${meqStoryHelp('BETWEEN se aprende viendo dónde queda la estrella.','between = entre')}</section>`;
  setTimeout(()=>speak('The star is between the trees.'),220);$('c4BetweenAudio').onclick=()=>speak('The star is between the trees.');document.querySelectorAll('.between-slot').forEach(b=>b.onclick=()=>{const ok=b.dataset.id==='between';c4Record('listening',ok);c4Record('usage',ok);meqRecordUnitTask('between',ok,{dimensions:['listening','visual','usage'],context:'c4s5:between_trees',mode:'spatial_transfer',distractorId:b.dataset.id});document.querySelectorAll('.between-slot').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('c4BetweenFb').className=`feedback ${ok?'good':'soft'}`;$('c4BetweenFb').textContent=ok?'⭐ Exacto. BETWEEN quedó convertido en una posición real.':'La estrella tiene que quedar entre los dos árboles.';if(ok){playSfx('success');c4Award(5);setTimeout(c4Scene6Teach,850)}else{playSfx('retry');speak('between',true);setTimeout(c4Scene5,850)}});
}

function c4Scene6Teach(){
  c4SetScene(6);meqRuntimeTeachCarousel({chapterLabel:C4_CHAPTER,scene:6,total:C4_TOTAL,title:c4SceneData(6).title,items:[c4Visual('walk')],onDone:c4Scene6Game});
}
function c4Scene6Game(){
  const walk={id:'walk',visual:'🚶'},stop={id:'stop',visual:'🛑'},left={id:'left',visual:'🚶⬅️'},right={id:'right',visual:'🚶➡️'};
  meqRuntimeListenChoices({stateKey:C4_EVIDENCE,chapterLabel:C4_CHAPTER,scene:6,total:C4_TOTAL,title:c4SceneData(6).title,tasks:[
    {audio:'Walk.',target:'walk',choices:[walk,stop,{id:'sit',visual:'🪑'}]},
    {audio:'Walk left.',target:'left',choices:[left,right,stop]},
    {audio:'Walk right.',target:'right',choices:[left,right,stop]},
    {audio:'Walk and stop.',target:'stop',choices:[stop,walk,{id:'look',visual:'👀'}]}
  ],onDone:()=>{c4Award(6);c4Scene7Teach();}});
}

function c4Scene7Teach(){
  c4SetScene(7);meqRuntimeTeachCarousel({chapterLabel:C4_CHAPTER,scene:7,total:C4_TOTAL,title:c4SceneData(7).title,items:[c4Visual('wind'),c4Visual('road')],onDone:c4Scene7Game});
}
function c4Scene7Game(){
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C4_CHAPTER,7,C4_TOTAL,c4SceneData(7).title)}<div class="prompt">I hear the wind. Find the road.</div><button id="c4RoadAudio" class="sound-orb">🔊</button><div class="forest-road-hunt">${meqImg('forest_night.svg','','forest-hunt-bg')}<div class="wind-leaves">🍃 🍃 🍃</div><button data-id="tree" class="forest-hunt-target hunt-tree">${meqImg('forest_tree.svg','tree')}</button><button data-id="road" class="forest-hunt-target hunt-road">${meqImg('road_rune.svg','road')}</button></div><div id="c4RoadFb" class="feedback"></div>${meqStoryHelp('El viento mueve las hojas. ROAD es el camino que necesitás para salir.','wind = viento · road = camino/ruta')}</section>`;
  setTimeout(()=>speak('I hear the wind. Find the road.'),220);$('c4RoadAudio').onclick=()=>speak('I hear the wind. Find the road.');document.querySelectorAll('.forest-hunt-target').forEach(b=>b.onclick=()=>{const ok=b.dataset.id==='road';c4Record('listening',ok);c4Record('usage',ok);meqRecordUnitTask('road',ok,{dimensions:['listening','visual','usage'],context:'c4s7:road_hunt',mode:'hotspot_transfer',distractorId:b.dataset.id});meqRecordUnitTask('wind',ok,{dimensions:['listening'],context:'c4s7:wind_road',mode:'phrase_comprehension'});if(ok){b.classList.add('found');$('c4RoadFb').className='feedback good';$('c4RoadFb').textContent='🛤️ Road. Ya aparece la siguiente parte del acertijo.';playSfx('success');c4Award(7);setTimeout(c4Scene8,850)}else{$('c4RoadFb').className='feedback soft';$('c4RoadFb').textContent='Ese es TREE. Milo repite ROAD.';playSfx('retry');speak('road',true)}});
}

function c4Scene8(){
  c4SetScene(8);session={c4Riddle:0,lines:[
    {audio:'Walk left.',text:'Walk left.',target:'left',choices:[{id:'left',visual:'🚶⬅️'},{id:'right',visual:'🚶➡️'}]},
    {audio:'Find the star between the trees.',text:'Find the star between the trees.',target:'between',choices:[{id:'between',visual:'🌲⭐🌲'},{id:'up',visual:'⭐⬆️'},{id:'road',visual:'🛤️'}]},
    {audio:'Look up.',text:'Look up.',target:'up',choices:[{id:'up',visual:'👀⬆️'},{id:'down',visual:'👀⬇️'}]},
    {audio:'Find the road.',text:'Find the road.',target:'road',choices:[{id:'road',img:'road_rune.svg'},{id:'flower',img:'forest_flower.svg'},{id:'tree',img:'forest_tree.svg'}]}
  ]};renderC4Riddle();
}
function renderC4Riddle(){
  const t=session.lines[session.c4Riddle];if(!t){c4Award(8);return c4Scene9();}
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C4_CHAPTER,8,C4_TOTAL,c4SceneData(8).title)}<span class="game-label">👂 primero · 📖 después</span><div class="prompt">Escuchá la línea del acertijo. El texto todavía está escondido.</div><button id="c4RiddleAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c4-riddle-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c4RiddleFb" class="feedback"></div><div id="c4RiddleText" class="riddle-reveal hidden"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c4RiddleAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c4-riddle-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c4Record('listening',ok);c4Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual','usage'],context:`c4s8:riddle:${t.target}`,mode:'riddle_transfer',distractorId:b.dataset.id});document.querySelectorAll('.c4-riddle-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');if(ok){c4Record('reading',true);$('c4RiddleText').textContent=t.text;$('c4RiddleText').classList.remove('hidden');$('c4RiddleFb').className='feedback good';$('c4RiddleFb').textContent='✨ Ahora sí aparece escrito lo que ya entendiste.';playSfx('success');setTimeout(()=>{session.c4Riddle++;renderC4Riddle()},950)}else{$('c4RiddleFb').className='feedback soft';$('c4RiddleFb').textContent='Todavía no mostramos el texto. Primero entendamos el sonido.';playSfx('retry');speak(t.audio,true);setTimeout(renderC4Riddle,850)}});
}

function c4Scene9(){
  c4SetScene(9);meqRuntimeVoicePrompt({stateKey:C4_EVIDENCE,chapterLabel:C4_CHAPTER,scene:9,total:C4_TOTAL,title:c4SceneData(9).title,target:'Where is the road?',intro:'El guardián conoce la salida. Preguntale:',onPass:c4GuardianAnswer,onFallback:c4GuardianAnswer});
}
function c4GuardianAnswer(){
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C4_CHAPTER,9,C4_TOTAL,c4SceneData(9).title)}${meqSceneFrame({backdrop:'forest_night.svg',actors:[{src:'forest_guardian.svg',alt:'forest guardian',pos:'right-ground',scale:.54},{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.55}],caption:'Go right, please.'})}<div class="prompt">Go right, please.</div><button id="c4GuardianAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid"><button class="runtime-choice c4-guide-dir" data-id="left">⬅️</button><button class="runtime-choice c4-guide-dir" data-id="right">➡️</button></div><div id="c4GuideFb" class="feedback"></div></section>`;
  setTimeout(()=>speak('Go right, please.'),220);$('c4GuardianAudio').onclick=()=>speak('Go right, please.');document.querySelectorAll('.c4-guide-dir').forEach(b=>b.onclick=()=>{const ok=b.dataset.id==='right';c4Record('listening',ok);c4Record('usage',ok);meqRecordUnitTask('right',ok,{dimensions:['listening','usage'],context:'c4s9:guardian_reply',mode:'dialogue_transfer',distractorId:b.dataset.id});b.classList.add(ok?'correct':'wrong');$('c4GuideFb').className=`feedback ${ok?'good':'soft'}`;$('c4GuideFb').textContent=ok?'Thank you! La conversación cambió el camino.':'Escuchá RIGHT otra vez.';if(ok){c4Award(9);playSfx('success');setTimeout(c4Scene10Intro,850)}else{playSfx('retry');speak('right',true)}});
}

function c4Scene10Intro(){
  c4SetScene(10);const r=c4Ratios();screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C4_CHAPTER,10,C4_TOTAL,c4SceneData(10).title)}<h1 class="title">Find the Forest Exit</h1><p class="subtitle">Una sola ruta hablada. No aparece vocabulario nuevo.</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.reading)}%</b><small>lectura</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div></div>${meqGuideVisual('El final combina lo que ya usaste. Si algo sale flojo, reforzamos sólo esa habilidad y volvemos acá.')}<button id="c4BossStart" class="btn primary wide">Empezar ruta final →</button></section>`;$('c4BossStart').onclick=c4BossStart;
}
function c4BossStart(){
  session={c4Boss:0,c4BossScore:0,boss:[
    {audio:'Walk left.',target:'left',choices:[c4Visual('left'),c4Visual('right')]},
    {audio:'Stop between the trees.',target:'between',choices:[{id:'between',visual:'🌲🛑🌲'},{id:'left',visual:'⬅️🌲'},{id:'right',visual:'🌲➡️'}]},
    {audio:'Look up.',target:'up',choices:[c4Visual('up'),c4Visual('down')]},
    {audio:'Find the star.',target:'star',choices:[c4Visual('star'),c4Visual('flower'),c4Visual('moon')]},
    {audio:'Walk right.',target:'right',choices:[c4Visual('left'),c4Visual('right')]},
    {audio:'Find the road.',target:'road',choices:[c4Visual('road'),c4Visual('tree'),c4Visual('flower')]}
  ]};renderC4Boss();
}
function renderC4Boss(){
  const t=session.boss[session.c4Boss];if(!t)return finishC4Boss();
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C4_CHAPTER,10,C4_TOTAL,c4SceneData(10).title)}<div class="boss-route"><b>Ruta ${session.c4Boss+1}/6</b><div>${'●'.repeat(session.c4Boss)}${'○'.repeat(6-session.c4Boss)}</div></div><div class="prompt">Escuchá y avanzá.</div><button id="c4BossAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c4-boss-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c4BossFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c4BossAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c4-boss-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c4Record('listening',ok,1.5);c4Record('usage',ok,1.5);meqRecordUnitTask(t.target,ok,{dimensions:['listening','usage'],context:`c4boss:${session.c4Boss}:${t.target}`,mode:'micro_assessment',distractorId:b.dataset.id,weight:1.3});if(ok)session.c4BossScore++;document.querySelectorAll('.c4-boss-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('c4BossFb').className=`feedback ${ok?'good':'soft'}`;$('c4BossFb').textContent=ok?'✨ El sendero se abre.':'El bosque no se abre todavía. Milo repite la instrucción.';if(ok)playSfx('success');else{playSfx('retry');speak(t.audio,true)}setTimeout(()=>{session.c4Boss++;renderC4Boss()},780)});
}
function finishC4Boss(){
  const r=c4Ratios(),boss=session.c4BossScore/6;const overall=.4*r.listening+.36*r.usage+.12*Math.max(r.reading,.7)+.12*Math.max(r.speaking,.62);const pass=boss>=.67&&overall>=.80&&r.listening>=.74&&r.usage>=.72;
  if(pass){state.chapter4Complete=true;saveState();c4Award(10);}
  screen.innerHTML=`<section class="card reward-card scene-card"><div class="big-emoji">${pass?'🌲🛤️✨':'🦊🛠️'}</div><div class="eyebrow">Forest Riddle</div><h1 class="title">${pass?'The road is open!':'Una pista necesita refuerzo'}</h1><p class="subtitle">${pass?'Seguiste una ruta completa usando inglés como herramienta.':'No repetimos toda la historia. Milo va a trabajar sólo la habilidad más baja.'}</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.reading)}%</b><small>lectura</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div></div><button id="c4ResultNext" class="btn primary wide">${pass?'Ver final →':'Refuerzo rápido →'}</button><button id="c4ResultCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;
  $('c4ResultNext').onclick=()=>pass?c4Ending():c4Repair();$('c4ResultCampaign').onclick=showCampaign;
}
function c4Repair(){
  const r=c4Ratios(),skill=r.listening<=r.usage?'listening':'usage';session={c4Repair:0,c4RepairSkill:skill,tasks:[
    {audio:'Go left.',target:'left',choices:[c4Visual('left'),c4Visual('right')]},
    {audio:'The star is between the trees.',target:'between',choices:[{id:'between',visual:'🌲⭐🌲'},{id:'up',visual:'⭐⬆️'}]},
    {audio:'Find the road.',target:'road',choices:[c4Visual('road'),c4Visual('flower')]}
  ]};renderC4Repair();
}
function renderC4Repair(){
  const t=session.tasks[session.c4Repair];if(!t)return c4Scene10Intro();
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C4_CHAPTER,10,C4_TOTAL,"Milo's Quick Repair")}<span class="game-label">🛠️ Sólo reforzamos ${session.c4RepairSkill}</span><div class="prompt">Tres pistas y volvés al final.</div><button id="c4RepairAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c4-repair-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c4RepairFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c4RepairAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c4-repair-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c4Record(session.c4RepairSkill,ok,2);meqRecordUnitTask(t.target,ok,{dimensions:[session.c4RepairSkill==='usage'?'usage':'listening'],context:`c4repair:${session.c4Repair}:${t.target}`,mode:'adaptive_repair',distractorId:b.dataset.id,weight:1.3});if(session.c4RepairSkill!=='listening')c4Record('listening',true,.35);b.classList.add(ok?'correct':'wrong');$('c4RepairFb').className=`feedback ${ok?'good':'soft'}`;$('c4RepairFb').textContent=ok?'✨ Reforzado.':'La repetimos lenta.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.c4Repair++;renderC4Repair()},720)});
}
function c4Ending(){
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 4 complete</div><h1 class="title">Forest Riddle · End</h1>${meqSceneFrame({backdrop:'forest_night.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.58},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.55}],props:[{src:'road_rune.svg',alt:'road',pos:'center-letter',motion:'letter-glow',scale:.36}],caption:'The forest opens onto a busy little town.',label:'STORY COMPLETE'})}<p class="subtitle">El camino sale del bosque y desemboca en un pequeño mercado cerca de la academia. Hay carteles, comida, números y gente hablando.</p>${meqGuideVisual('La próxima historia puede llevar vocabulario cotidiano todavía más útil: comprar, cantidades, comida y números, siempre dentro de una misión.')}<div class="chapter-hook"><span>🛍️🍎</span><div><b>Next: Chapter 5</b><strong>Market Day</strong><small>food · numbers · want/need · simple exchanges</small></div></div><button id="c4EndCampaign" class="btn primary wide" style="margin-top:14px">Volver a la campaña →</button></section>`;$('c4EndCampaign').onclick=showCampaign;
}

// Add a repeatable direction rhythm pack: XP only, never family-money farming.
if(typeof SONGS!=='undefined'){
  SONGS.forest={id:'forest',title:'Forest Directions Beat',unlock:()=>!!state.chapter3Complete,icon:'🌲🎵',phrases:[
    {text:'Go left.',visual:'⬅️🚶',words:['go','left']},
    {text:'Go right.',visual:'🚶➡️',words:['go','right']},
    {text:'Look up.',visual:'👀⬆️',words:['look','up']},
    {text:'Look down.',visual:'👀⬇️',words:['look','down']},
    {text:'Find the road.',visual:'🔎🛤️',words:['find','the','road']}
  ]};
}

showCampaign = function(){
  ensureC2State();ensureC3State();ensureC4State();const c1=!!state.chapter1Complete,c2=!!state.chapter2Complete,c3=!!state.chapter3Complete,c4=!!state.chapter4Complete;
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Tu aventura</div><h1 class="title">Cada historia usa el inglés de la anterior</h1><p class="subtitle">No hay capítulos sueltos: cada final abre una necesidad nueva dentro del mundo.</p>${meqGuideVisual(c4?'Cuatro historias completadas. La siguiente va a llevar el inglés a intercambios cotidianos.':c3?'El acertijo del bosque ya está desbloqueado.':c2?'El mensaje del búho espera en el aula.':'Seguí el capítulo activo.')}
  <div class="chapter-grid">
    <button class="chapter-card ${c1?'done':'active'}" id="campaignC1"><span>✉️</span><div><b>Chapter 1</b><strong>The Magic Letter</strong><small>${c1?'✓ Terminado':'En curso'}</small></div></button>
    <button class="chapter-card ${c1?(c2?'done':'active'):'locked'}" id="campaignC2" ${c1?'':'disabled'}><span>🧪</span><div><b>Chapter 2</b><strong>Potion Mystery</strong><small>${!c1?'🔒 Bloqueado':c2?'✓ Terminado':'Listo para jugar'}</small></div></button>
    <button class="chapter-card ${c2?(c3?'done':'active'):'locked'}" id="campaignC3" ${c2?'':'disabled'}><span>🦉</span><div><b>Chapter 3</b><strong>Owl Message</strong><small>${!c2?'🔒 Bloqueado':c3?'✓ Terminado':'Listo para jugar'}</small></div></button>
    <button class="chapter-card ${c3?(c4?'done':'active'):'locked'}" id="campaignC4" ${c3?'':'disabled'}><span>🌲</span><div><b>Chapter 4</b><strong>Forest Riddle</strong><small>${!c3?'🔒 Bloqueado':c4?'✓ Terminado':'Listo para jugar'}</small></div></button>
    <button class="chapter-card locked" disabled><span>🛍️</span><div><b>Chapter 5</b><strong>Market Day</strong><small>${c4?'🔒 Próximo':'🔒 Bloqueado'}</small></div></button>
  </div></section>`;
  $('campaignC1').onclick=showChapter1Intro;if(c1)$('campaignC2').onclick=showChapter2Intro;if(c2)$('campaignC3').onclick=showChapter3Intro;if(c3)$('campaignC4').onclick=showChapter4Intro;setActiveNav('story');
};

showMap = function(){
  ensureC2State();ensureC3State();ensureC4State();screen.innerHTML=`<section class="card"><div class="eyebrow">Prólogo</div><h1 class="title">Before the Letter</h1><p class="subtitle">Diez escalones. La historia empieza cuando existe una base mínima real.</p><div class="quest-map">${MAP.map((n,i)=>{const step=i+1,unlock=step<=state.unlockedStep,current=step===state.currentStep,d=stageData(step);return `<button class="map-node ${unlock?'unlocked':'locked'} ${current?'current':''}" data-step="${step}" ${unlock?'':'disabled'}><div class="node-num">${d.mastered?'✓':step}</div><div><div class="node-title">${n[0]}</div><div class="node-sub">${n[1]}</div></div><div class="node-badge">${unlock?n[2]:'🔒'}</div></button>`}).join('')}</div></section><section class="card"><div class="eyebrow">Campaña</div><h2 style="margin:5px 0">Historias</h2><div class="chapter-grid compact"><button class="chapter-card ${state.chapter1Complete?'done':state.phase0Complete?'active':'locked'}" id="mapC1" ${state.phase0Complete?'':'disabled'}><span>✉️</span><div><b>Chapter 1</b><strong>The Magic Letter</strong></div></button><button class="chapter-card ${state.chapter2Complete?'done':state.chapter1Complete?'active':'locked'}" id="mapC2" ${state.chapter1Complete?'':'disabled'}><span>🧪</span><div><b>Chapter 2</b><strong>Potion Mystery</strong></div></button><button class="chapter-card ${state.chapter3Complete?'done':state.chapter2Complete?'active':'locked'}" id="mapC3" ${state.chapter2Complete?'':'disabled'}><span>🦉</span><div><b>Chapter 3</b><strong>Owl Message</strong></div></button><button class="chapter-card ${state.chapter4Complete?'done':state.chapter3Complete?'active':'locked'}" id="mapC4" ${state.chapter3Complete?'':'disabled'}><span>🌲</span><div><b>Chapter 4</b><strong>Forest Riddle</strong></div></button></div></section>`;
  document.querySelectorAll('.map-node.unlocked').forEach(b=>b.onclick=()=>startStep(Number(b.dataset.step)));if(state.phase0Complete)$('mapC1').onclick=showChapter1Intro;if(state.chapter1Complete)$('mapC2').onclick=showChapter2Intro;if(state.chapter2Complete)$('mapC3').onclick=showChapter3Intro;if(state.chapter3Complete)$('mapC4').onclick=showChapter4Intro;setActiveNav('map');
};

const c4OldC3Ending=c3Ending;
c3Ending=function(){
  if(!state.chapter3Complete)return c4OldC3Ending();
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 3 complete</div><h1 class="title">Owl Message · End</h1>${meqSceneFrame({backdrop:'classroom_night.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.62},{src:'teacher.svg',alt:'teacher',pos:'right-ground',scale:.59}],props:[{src:'blue_paper.svg',alt:'message',pos:'upper-mid',motion:'letter-glow',scale:.27}],caption:'The back of the paper is a forest map.'})}<p class="subtitle">El reverso del mensaje muestra árboles, una estrella y dos flechas. La puerta del aula se abre hacia el jardín nocturno.</p>${meqGuideVisual('Ya podés usar preguntas y mensajes. Ahora el inglés va a servir para orientarte y tomar decisiones físicas.')}<button id="c3ToC4" class="btn primary wide">Empezar Chapter 4 →</button></section>`;$('c3ToC4').onclick=showChapter4Intro;
};

storyRoute=function(){
  if(!state.phase0Complete)return state.introSeen?startStep(state.currentStep):intro();
  if(!state.chapter1Complete)return showChapter1Intro();
  if(!state.chapter2Complete)return showChapter2Intro();
  if(!state.chapter3Complete)return showChapter3Intro();
  if(!state.chapter4Complete)return showChapter4Intro();
  return showCampaign();
};
qCurrentAdventure=function(){
  if(!state.phase0Complete)return {eyebrow:'Prólogo',title:'Before the Letter',text:`Escalón ${state.currentStep} de 10`,icon:'🦉✉️',action:()=>state.introSeen?startStep(state.currentStep):intro()};
  if(!state.chapter1Complete)return {eyebrow:'Chapter 1',title:'The Magic Letter',text:'Tu carta ya llegó',icon:'✉️✨',action:showChapter1Intro};
  if(!state.chapter2Complete)return {eyebrow:'Chapter 2',title:'Potion Mystery',text:'Hay una botella fuera de lugar',icon:'🧪🔎',action:showChapter2Intro};
  if(!state.chapter3Complete)return {eyebrow:'Chapter 3',title:'Owl Message',text:'Un papel azul espera en el aula',icon:'🦉📄',action:showChapter3Intro};
  if(!state.chapter4Complete)return {eyebrow:'Chapter 4',title:'Forest Riddle',text:'El bosque necesita direcciones',icon:'🌲🧭',action:showChapter4Intro};
  return {eyebrow:'Campaña',title:'Cuatro historias completadas',text:'El camino termina en un mercado',icon:'🛍️🍎',action:showCampaign};
};
const c4OldUpdateHud=updateHud;
updateHud=function(){c4OldUpdateHud();ensureC4State();const l=$('levelText');if(l)l.textContent=(state.chapter4Complete?'Ch. 4 ✓':state.chapter3Complete?'Ch. 4':state.chapter2Complete?'Ch. 3':state.chapter1Complete?'Ch. 2':state.phase0Complete?'Ch. 1':`Step ${state.currentStep}`)+` · ${state.totalXp||0} XP`;const sub=$('headerSubtitle');if(sub)sub.textContent=state.chapter4Complete?'Market Day · next':state.chapter3Complete?'Forest Riddle':state.chapter2Complete?'Owl Message':state.chapter1Complete?'Potion Mystery':state.phase0Complete?'The Magic Letter':'Before the Letter · Zero English';};

window.MEQ_BUILD='1.9.0';
updateHud();if(state.lastRoute==='home')showHome();
