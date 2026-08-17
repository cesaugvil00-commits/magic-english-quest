'use strict';

// MVP 1.5 — Chapter 10: The Lost Map.
// Closes the first campaign arc with practical city/place/transport vocabulary
// and recombines the earlier direction system in one continuous route.

const C10_ID='chapter_10_lost_map';
const C10_EVIDENCE='chapter10Evidence';
const C10_TOTAL=10;
const C10_CHAPTER='🗺️ Chapter 10';

function ensureC10State(){meqEnsureEvidence(C10_EVIDENCE);state.chapter10Scene ||= 1;state.chapter10Complete ||= false;}
function c10SceneData(n){return meqStoryScene(C10_ID,n)||{id:`c10s${n}`,title:`Scene ${n}`,reward_coins:0};}
function c10SetScene(n){ensureC10State();state.chapter10Scene=n;saveState();}
function c10Award(n){const s=c10SceneData(n);meqAwardStory('chapter10',s.id||`scene${n}`,s.reward_coins||0);}
function c10Record(kind,ok,w=1){meqRecordEvidence(C10_EVIDENCE,kind,ok,w);}
function c10Ratios(){return meqEvidenceRatios(C10_EVIDENCE);}
function c10Item(id){
  const map={
    map:{id:'map',label:'map',img:'city_map.svg'},
    place:{id:'place',label:'place',visual:'📍'},
    city:{id:'city',label:'city',img:'city_square.svg'},
    street:{id:'street',label:'street',visual:'🛣️'},
    park:{id:'park',label:'park',img:'city_park.svg'},
    station:{id:'station',label:'station',img:'city_station.svg'},
    car:{id:'car',label:'car',img:'city_car.svg'},
    bus:{id:'bus',label:'bus',img:'city_bus.svg'},
    train:{id:'train',label:'train',img:'city_train.svg'},
    bridge:{id:'bridge',label:'bridge',img:'city_bridge.svg'}
  };return map[id];
}
function c10Teach(scene,items,onDone){meqRuntimeTeachCarousel({chapterLabel:C10_CHAPTER,scene,total:C10_TOTAL,title:c10SceneData(scene).title,items,onDone});}
function c10Choices(scene,tasks,onDone,help='Escuchá primero y usá el mapa o la escena como pista.'){meqRuntimeListenChoices({stateKey:C10_EVIDENCE,chapterLabel:C10_CHAPTER,scene,total:C10_TOTAL,title:c10SceneData(scene).title,tasks,onDone,help});}

function showChapter10Intro(){
  ensureC10State();setActiveNav('story');const complete=!!state.chapter10Complete;
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">${complete?'Chapter 10 complete':'Final de la primera campaña'}</div><h1 class="title">Chapter 10 · The Lost Map</h1><p class="subtitle">${complete?'El mapa ya encontró su camino. Podés repetir la aventura para memoria y fluidez.':'El retrato se abre y deja caer un mapa que se está borrando. Para conservarlo hay que cruzar la ciudad, reconocer lugares y llegar a la estación antes de que desaparezca.'}</p>${meqSceneFrame({backdrop:'city_square.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.47},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.43}],props:[{src:'city_map.svg',alt:'map',pos:'center-letter',motion:'letter-glow',scale:.5}],caption:complete?'The route glows from start to finish.':'The map loses one path at a time.',label:'THE LOST MAP'})}${meqGuideVisual('Este capítulo junta lo aprendido: lugares, direcciones, preguntas, memoria y una conversación realista.')}<div class="scene-skill-row"><span>🗺️ lugares</span><span>🧭 ruta</span><span>🚌 transporte</span><span>💬 preguntar</span><span>🧠 secuencia</span></div><button id="c10Start" class="btn primary wide">${complete?'Jugar de nuevo →':'Abrir el mapa →'}</button>${complete?'<button id="c10Campaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button>':''}</section>`;
  $('c10Start').onclick=c10Scene1Teach;if(complete)$('c10Campaign').onclick=showCampaign;
}

function c10Scene1Teach(){
  c10SetScene(1);c10Teach(1,[{...c10Item('map'),en:'map',es:'mapa'},{...c10Item('place'),en:'place',es:'lugar'}],c10Scene1Game);
}
function c10Scene1Game(){
  c10Choices(1,[
    {audio:'Map.',target:'map',choices:[c10Item('map'),{id:'portrait',label:'portrait',img:'family_portrait.svg'}],translation:'map = mapa'},
    {audio:'Find this place.',target:'place',choices:[c10Item('place'),{id:'person',label:'person',img:'portrait_mother.svg'}],translation:'place = lugar'}
  ],()=>{c10Award(1);c10Scene2Teach();});
}

function c10Scene2Teach(){
  c10SetScene(2);c10Teach(2,[{...c10Item('city'),en:'city',es:'ciudad'},{...c10Item('street'),en:'street',es:'calle'}],c10Scene2Game);
}
function c10Scene2Game(){
  c10Choices(2,[
    {audio:'City.',target:'city',choices:[c10Item('city'),c10Item('park')]},
    {audio:'Find the street.',target:'street',choices:[c10Item('street'),c10Item('city')]},
    {audio:'This is the city.',target:'city',choices:[c10Item('street'),c10Item('city')]}
  ],()=>{c10Award(2);c10Scene3Teach();},'El zoom enseña whole vs part: CITY es toda la zona; STREET es un camino entre edificios.');
}

function c10Scene3Teach(){
  c10SetScene(3);c10Teach(3,[{...c10Item('park'),en:'park',es:'parque'}],c10Scene3Game);
}
function c10Scene3Game(){
  c10Choices(3,[
    {audio:'Find the park.',target:'park',choices:[c10Item('park'),c10Item('station'),c10Item('city')]},
    {audio:'The park is here.',target:'park',choices:[c10Item('station'),c10Item('park')]}
  ],()=>{c10Award(3);c10Scene4Teach();});
}

function c10Scene4Teach(){
  c10SetScene(4);c10Teach(4,[{...c10Item('station'),en:'station',es:'estación'}],c10Scene4Game);
}
function c10Scene4Game(){
  c10Choices(4,[
    {audio:'Find the station.',target:'station',choices:[c10Item('station'),c10Item('park'),c10Item('city')]},
    {audio:'Where is the station?',target:'station',prompt:'Milo pregunta por un lugar. Tocá la estación.',choices:[c10Item('park'),c10Item('station')]}
  ],()=>{c10Award(4);c10Scene5Teach();});
}

function c10Scene5Teach(){
  c10SetScene(5);c10Teach(5,[{...c10Item('car'),en:'car',es:'auto'},{...c10Item('bus'),en:'bus',es:'colectivo / autobús'},{...c10Item('train'),en:'train',es:'tren'}],c10Scene5Game);
}
function c10Scene5Game(){
  c10Choices(5,[
    {audio:'Find the car.',target:'car',choices:[c10Item('car'),c10Item('bus'),c10Item('train')]},
    {audio:'Find the bus.',target:'bus',choices:[c10Item('car'),c10Item('bus'),c10Item('train')]},
    {audio:'Find the train.',target:'train',choices:[c10Item('car'),c10Item('bus'),c10Item('train')]}
  ],()=>{c10Award(5);c10Scene6Teach();});
}

function c10Scene6Teach(){
  c10SetScene(6);screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C10_CHAPTER,6,C10_TOTAL,c10SceneData(6).title)}<span class="game-label">👀 Contraste visible</span>${meqImg('city_bridge.svg','bridge','c10-bridge')}<div class="big-word">OVER</div><button id="c10OverAudio" class="sound-orb">🔊</button><p class="instruction">UNDER ya existe. Ahora el mapa muestra el camino contrario: uno pasa arriba del puente.</p><div class="btn-row"><button id="c10OverHelp" class="btn secondary">💡 Ayuda</button><button id="c10OverNext" class="btn primary">Probar rutas →</button></div><div id="c10OverHelpBox" class="help-box hidden"></div></section>`;setTimeout(()=>speak('Over.'),200);$('c10OverAudio').onclick=()=>speak('Over.');$('c10OverHelp').onclick=()=>{$('c10OverHelpBox').textContent='🇦🇷 over = por encima / sobre';$('c10OverHelpBox').classList.remove('hidden');};$('c10OverNext').onclick=c10Scene6Game;
}
function c10Scene6Game(){
  c10Choices(6,[
    {audio:'Go over the bridge.',target:'over',choices:[{id:'over',label:'over',img:'city_bridge.svg'},{id:'under',label:'under',visual:'⬇️🌉'}]},
    {audio:'Go under the bridge.',target:'under',choices:[{id:'over',label:'over',visual:'⬆️🌉'},{id:'under',label:'under',visual:'⬇️🌉'}]}
  ],()=>{c10Award(6);c10Scene7Teach();},'OVER se entiende por contraste con UNDER: la acción cambia el camino, no una definición en una hoja.');
}

function c10Scene7Teach(){
  c10SetScene(7);session={...session,c10SameRound:0};renderC10SameTeach();
}
function renderC10SameTeach(){
  const same=session.c10SameRound===0;screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C10_CHAPTER,7,C10_TOTAL,c10SceneData(7).title)}<span class="game-label">🧠 Identidad visual</span><div class="c10-map-pair"><div>${meqImg('city_map.svg','map A')}</div><div class="${same?'map-rotated':'map-shifted'}">${meqImg(same?'city_map.svg':'city_square.svg','map B')}</div></div><div class="big-word">${same?'SAME':'?'}</div><button id="c10SameAudio" class="sound-orb">🔊</button><p class="instruction">El mapa puede girar o cambiar de color y seguir marcando el mismo lugar.</p><button id="c10SameNext" class="btn primary wide">${same?'Entendido →':'Seguir →'}</button></section>`;setTimeout(()=>speak(same?'Same. The same place.':'Find the same place.'),200);$('c10SameAudio').onclick=()=>speak(same?'The same place.':'Find the same place.');$('c10SameNext').onclick=()=>{if(session.c10SameRound===0){session.c10SameRound=1;renderC10SameGame()}else{c10Award(7);c10Scene8Teach();}};
}
function renderC10SameGame(){
  c10Choices(7,[{audio:'Find the same place.',target:'same',choices:[{id:'same',label:'same place',img:'city_map.svg'},{id:'different',label:'different place',img:'city_square.svg'}]}],()=>{session.c10SameRound=1;c10Award(7);c10Scene8Teach();},'Buscá el marcador que representa el mismo destino aunque la presentación visual cambie.');
}

function c10Scene8Teach(){
  c10SetScene(8);screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C10_CHAPTER,8,C10_TOTAL,c10SceneData(8).title)}<span class="game-label">💬 Pregunta útil completa</span><div class="prompt">Tres buses esperan. Milo mira de uno a otro.</div><div class="c10-vehicles"><div class="tint-blue">${meqImg('city_bus.svg','blue bus')}</div><div class="tint-red">${meqImg('city_bus.svg','red bus')}</div><div class="tint-green">${meqImg('city_bus.svg','green bus')}</div></div><div class="big-word">WHICH?</div><button id="c10WhichAudio" class="sound-orb">🔊</button><p class="instruction">WHICH aparece como una señal de “elegí uno entre varios”. No enseñamos una categoría gramatical.</p><button id="c10WhichNext" class="btn primary wide">Elegir por audio →</button></section>`;setTimeout(()=>speak('Which bus?'),200);$('c10WhichAudio').onclick=()=>speak('Which bus?');$('c10WhichNext').onclick=c10Scene8Game;
}
function c10Scene8Game(){
  c10Choices(8,[
    {audio:'Which bus? The blue bus.',target:'blue',choices:[{id:'blue',label:'blue bus',img:'city_bus.svg'},{id:'red',label:'red bus',visual:'🔴🚌'},{id:'green',label:'green bus',visual:'🟢🚌'}]},
    {audio:'Which one? The red bus.',target:'red',choices:[{id:'blue',label:'blue bus',visual:'🔵🚌'},{id:'red',label:'red bus',visual:'🔴🚌'},{id:'green',label:'green bus',visual:'🟢🚌'}]}
  ],()=>{c10Award(8);c10Scene9();},'Escuchá la pregunta como un bloque y usá el color conocido para elegir.');
}

function c10Scene9(){
  c10SetScene(9);screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C10_CHAPTER,9,C10_TOTAL,c10SceneData(9).title)}${meqSceneFrame({backdrop:'city_square.svg',actors:[{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.42}],props:[{src:'city_station.svg',alt:'station',pos:'center-letter',scale:.42}],caption:'The station clock is visible far down the street.',label:'ASK FOR DIRECTIONS'})}<p class="subtitle">Ahora la pregunta la hacés vos. El texto no aparece primero.</p><button id="c10AskStation" class="btn primary wide">Preguntar →</button></section>`;
  $('c10AskStation').onclick=()=>meqDialogueStart({stateKey:C10_EVIDENCE,chapterLabel:C10_CHAPTER,scene:9,total:C10_TOTAL,title:c10SceneData(9).title,help:'Intentá decir la pregunta sin modelo. Si te trabás, la pista crece de a poco.',turns:[
    {speaker:'player',kind:'voice',targetPhrase:'Where is the station?',say:'Where is the station?',prompt:'Preguntá por la estación.'},
    {speaker:'guardian',kind:'listen',say:'Go right.',prompt:'Escuchá la dirección.'},
    {speaker:'player',kind:'voice',targetPhrase:'Thank you.',say:'Thank you.',prompt:'Cerrá el intercambio.'}
  ],onDone:()=>{c10Record('listening',true,1.5);c10Record('usage',true,1.5);c10Award(9);c10Scene10Intro();}});
}

function c10Scene10Intro(){
  c10SetScene(10);const r=c10Ratios();screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C10_CHAPTER,10,C10_TOTAL,c10SceneData(10).title)}<h1 class="title">Reach the Train</h1><p class="subtitle">El mapa se está borrando. Una sola ruta combina parque, derecha, puente, estación y tren. Después queda una última pregunta hablada.</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C10_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div>${meqGuideVisual('Es un boss de integración: no hay palabras nuevas y cada paso tiene una consecuencia visual.')}<button id="c10BossStart" class="btn primary wide">Seguir la ruta →</button></section>`;$('c10BossStart').onclick=c10BossStart;
}
function c10BossStart(){
  session={...session,c10BossScore:0};c10Choices(10,[
    {audio:'Find the park.',target:'park',choices:[c10Item('park'),c10Item('station'),c10Item('city')]},
    {audio:'Go right.',target:'right',choices:[{id:'left',label:'left',visual:'⬅️'},{id:'right',label:'right',visual:'➡️'}]},
    {audio:'Go over the bridge.',target:'over',choices:[{id:'over',label:'over',img:'city_bridge.svg'},{id:'under',label:'under',visual:'⬇️🌉'}]},
    {audio:'Find the station.',target:'station',choices:[c10Item('park'),c10Item('station'),c10Item('city')]},
    {audio:'Which one? The blue train.',target:'train',choices:[c10Item('car'),c10Item('bus'),c10Item('train')]}
  ],c10BossVoice,'No leas una lista. Escuchá una instrucción, hacela, y recién después llega la siguiente.');
}
function c10BossVoice(){
  meqDialogueStart({stateKey:C10_EVIDENCE,chapterLabel:C10_CHAPTER,scene:10,total:C10_TOTAL,title:c10SceneData(10).title,help:'La última llave es una pregunta que ya usaste en la escena anterior.',turns:[{speaker:'player',kind:'voice',targetPhrase:'Where is the station?',say:'Where is the station?',prompt:'Decí la pregunta una vez más sin mirar un modelo si podés.'}],onDone:()=>{session.c10BossScore=1;finishC10Boss();}});
}
function finishC10Boss(){
  const r=c10Ratios(),overall=.49*r.listening+.36*r.usage+.15*Math.max(r.speaking,.65);const pass=session.c10BossScore===1&&overall>=.83&&r.listening>=.79&&r.usage>=.77;
  if(pass){state.chapter10Complete=true;saveState();c10Award(10);}
  screen.innerHTML=`<section class="card reward-card scene-card"><div class="big-emoji">${pass?'🗺️🚆✨🏆':'🦊🛠️'}</div><div class="eyebrow">The Lost Map</div><h1 class="title">${pass?'Season One complete!':'La ruta necesita un refuerzo'}</h1><p class="subtitle">${pass?'Llegaste al tren y cerraste el primer arco de historias usando inglés para actuar, preguntar, describir, comprar, orientarte y conversar.':'No repetimos la ciudad completa. Milo te da tres pruebas de la habilidad más floja y volvemos al final.'}</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C10_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div><button id="c10ResultNext" class="btn primary wide">${pass?'Ver cierre de campaña →':'Refuerzo rápido →'}</button><button id="c10ResultCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;
  $('c10ResultNext').onclick=()=>pass?c10Ending():c10Repair();$('c10ResultCampaign').onclick=showCampaign;
}
function c10Repair(){
  const r=c10Ratios(),skill=r.speaking<.65?'speaking':r.listening<=r.usage?'listening':'usage';
  if(skill==='speaking')return meqRuntimeVoicePrompt({stateKey:C10_EVIDENCE,chapterLabel:C10_CHAPTER,scene:10,total:C10_TOTAL,title:"Milo's Quick Repair",target:'Where is the station?',intro:'Una pregunta conocida y volvemos al final:',onPass:c10Scene10Intro,onFallback:c10Scene10Intro});
  session={...session,c10Repair:0,c10RepairSkill:skill,c10RepairTasks:[
    {audio:'Find the park.',target:'park',choices:[c10Item('park'),c10Item('station'),c10Item('city')]},
    {audio:'Find the train.',target:'train',choices:[c10Item('car'),c10Item('bus'),c10Item('train')]},
    {audio:'Go over the bridge.',target:'over',choices:[{id:'over',label:'over',img:'city_bridge.svg'},{id:'under',label:'under',visual:'⬇️🌉'}]}
  ]};renderC10Repair();
}
function renderC10Repair(){
  const t=session.c10RepairTasks[session.c10Repair];if(!t)return c10Scene10Intro();screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C10_CHAPTER,10,C10_TOTAL,"Milo's Quick Repair")}<span class="game-label">🛠️ Sólo reforzamos ${session.c10RepairSkill}</span><div class="prompt">Prueba ${session.c10Repair+1}/3.</div><button id="c10RepairAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c10-repair-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c10RepairFb" class="feedback"></div></section>`;setTimeout(()=>speak(t.audio),220);$('c10RepairAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c10-repair-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c10Record(session.c10RepairSkill,ok,2);meqRecordUnitTask(t.target,ok,{dimensions:[session.c10RepairSkill==='usage'?'usage':'listening'],context:`c10repair:${session.c10Repair}:${t.target}`,mode:'adaptive_repair',distractorId:b.dataset.id,weight:1.3});if(session.c10RepairSkill!=='listening')c10Record('listening',true,.3);$('c10RepairFb').className=`feedback ${ok?'good':'soft'}`;$('c10RepairFb').textContent=ok?'✨ Reforzado.':'La repetimos lento.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.c10Repair++;renderC10Repair()},680);});
}
function c10Ending(){
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Season One complete</div><h1 class="title">The First Ten Stories · End</h1>${meqSceneFrame({backdrop:'city_square.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.46},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.43}],props:[{src:'city_map.svg',alt:'map',pos:'center-letter',motion:'letter-glow',scale:.48},{src:'city_train.svg',alt:'train',pos:'lower-mid',scale:.28}],caption:'The map stops fading.',label:'SEASON ONE COMPLETE'})}<p class="subtitle">La primera campaña termina con una base funcional: escuchar instrucciones, usar vocabulario cotidiano, responder preguntas, pedir cosas, orientarse y producir frases cortas.</p>${meqGuideVisual('Desde acá el contenido puede crecer por temporadas sin cambiar el motor. La siguiente etapa amplía vocabulario y conversación, no reinicia el aprendizaje.')}<div class="chapter-hook"><span>✨📚</span><div><b>Next</b><strong>Season Two</strong><small>more everyday English · longer stories · less help · richer conversation</small></div></div><button id="c10EndCampaign" class="btn primary wide" style="margin-top:14px">Ver campaña completa →</button></section>`;$('c10EndCampaign').onclick=showCampaign;
}

if(typeof SONGS!=='undefined'){
  SONGS.city={id:'city',title:'City Route Beat',unlock:()=>!!state.chapter9Complete,icon:'🗺️🎵',phrases:[
    {text:'City, street, park.',visual:'🏙️🛣️🌳',words:['city','street','park']},
    {text:'Car, bus, train.',visual:'🚗🚌🚆',words:['car','bus','train']},
    {text:'Find the station.',visual:'🔎🚉',words:['find','station']},
    {text:'Go over the bridge.',visual:'➡️🌉',words:['go','over']},
    {text:'Where is the station?',visual:'❓🚉',words:['where','is','station']}
  ]};
}

// Direct handoff from Chapter 9.
const c10OldC9Ending=c9Ending;
c9Ending=function(){
  if(!state.chapter9Complete)return c10OldC9Ending();
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 9 complete</div><h1 class="title">The Family Portrait · End</h1>${meqSceneFrame({backdrop:'portrait_gallery.svg',actors:[{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.42}],props:[{src:'city_map.svg',alt:'map',pos:'center-letter',motion:'letter-glow',scale:.48}],caption:'The portrait opens and drops a glowing map.',label:'FINAL STORY'})}<p class="subtitle">El mapa pierde una línea frente a tus ojos. Si desaparece por completo, nadie podrá volver a la estación.</p>${meqGuideVisual('El final de la primera campaña combina vocabulario nuevo de ciudad con direcciones que ya usaste en Forest Riddle.')}<button id="c9ToC10" class="btn primary wide">Empezar Chapter 10 →</button><button id="c9EndCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;$('c9ToC10').onclick=showChapter10Intro;$('c9EndCampaign').onclick=showCampaign;
};

showCampaign=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();ensureC7State();ensureC8State();ensureC9State();ensureC10State();
  const done=n=>!!state[`chapter${n}Complete`];
  const info=[
    [1,'✉️','The Magic Letter',true,showChapter1Intro],[2,'🧪','Potion Mystery',done(1),showChapter2Intro],[3,'🦉','Owl Message',done(2),showChapter3Intro],[4,'🌲','Forest Riddle',done(3),showChapter4Intro],[5,'🛍️','Market Day',done(4),showChapter5Intro],[6,'🌙','The Midnight Room',done(5),showChapter6Intro],[7,'🌅','First Morning',done(6),showChapter7Intro],[8,'🐾','Creature Class',done(7),showChapter8Intro],[9,'🖼️','The Family Portrait',done(8),showChapter9Intro],[10,'🗺️','The Lost Map',done(9),showChapter10Intro]
  ];
  const all=done(10);screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Season One</div><h1 class="title">Diez historias conectadas</h1><p class="subtitle">${all?'Primera campaña completa. El motor, la progresión y el contenido quedan listos para crecer por nuevas temporadas.':'Cada historia termina antes de abrir la siguiente; el inglés conocido reaparece en contextos nuevos.'}</p>${meqGuideVisual(all?'No reiniciamos en Season Two: vocabulario, memoria y pronunciación acumulados siguen vivos.':'Seguí el capítulo activo.')}<div class="chapter-grid">${info.map(([n,icon,title,unlocked])=>`<button class="chapter-card ${done(n)?'done':unlocked?'active':'locked'}" id="campaignC${n}" ${unlocked?'':'disabled'}><span>${icon}</span><div><b>Chapter ${n}</b><strong>${title}</strong><small>${done(n)?'✓ Terminado':unlocked?'Listo para jugar':'🔒 Bloqueado'}</small></div></button>`).join('')}</div>${all?'<div class="help-box"><b>Season One complete:</b> Prologue + 10 stories · audio-first · mastery gates · targeted repair · delayed review · family rewards.</div>':''}</section>`;info.forEach(([n,,,unlocked,fn])=>{const el=$(`campaignC${n}`);if(el&&unlocked)el.onclick=fn;});setActiveNav('story');
};

showMap=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();ensureC7State();ensureC8State();ensureC9State();ensureC10State();const done=n=>!!state[`chapter${n}Complete`];
  const info=[[1,'✉️','Magic Letter',state.phase0Complete,showChapter1Intro],[2,'🧪','Potion Mystery',done(1),showChapter2Intro],[3,'🦉','Owl Message',done(2),showChapter3Intro],[4,'🌲','Forest Riddle',done(3),showChapter4Intro],[5,'🛍️','Market Day',done(4),showChapter5Intro],[6,'🌙','Midnight Room',done(5),showChapter6Intro],[7,'🌅','First Morning',done(6),showChapter7Intro],[8,'🐾','Creature Class',done(7),showChapter8Intro],[9,'🖼️','Family Portrait',done(8),showChapter9Intro],[10,'🗺️','Lost Map',done(9),showChapter10Intro]];
  screen.innerHTML=`<section class="card"><div class="eyebrow">Prólogo</div><h1 class="title">Before the Letter</h1><p class="subtitle">Diez escalones antes de la campaña.</p><div class="quest-map">${MAP.map((n,i)=>{const step=i+1,unlock=step<=state.unlockedStep,current=step===state.currentStep,d=stageData(step);return `<button class="map-node ${unlock?'unlocked':'locked'} ${current?'current':''}" data-step="${step}" ${unlock?'':'disabled'}><div class="node-num">${d.mastered?'✓':step}</div><div><div class="node-title">${n[0]}</div><div class="node-sub">${n[1]}</div></div><div class="node-badge">${unlock?n[2]:'🔒'}</div></button>`}).join('')}</div></section><section class="card"><div class="eyebrow">Season One</div><h2 style="margin:5px 0">Historias</h2><div class="chapter-grid compact">${info.map(([n,icon,title,unlocked])=>`<button class="chapter-card ${done(n)?'done':unlocked?'active':'locked'}" id="mapC${n}" ${unlocked?'':'disabled'}><span>${icon}</span><div><b>Ch. ${n}</b><strong>${title}</strong></div></button>`).join('')}</div></section>`;document.querySelectorAll('.map-node.unlocked').forEach(b=>b.onclick=()=>startStep(Number(b.dataset.step)));info.forEach(([n,,,unlocked,fn])=>{const el=$(`mapC${n}`);if(el&&unlocked)el.onclick=fn;});setActiveNav('map');
};

storyRoute=function(){if(!state.phase0Complete)return state.introSeen?startStep(state.currentStep):intro();for(let n=1;n<=10;n++){if(!state[`chapter${n}Complete`])return [showChapter1Intro,showChapter2Intro,showChapter3Intro,showChapter4Intro,showChapter5Intro,showChapter6Intro,showChapter7Intro,showChapter8Intro,showChapter9Intro,showChapter10Intro][n-1]();}return showCampaign();};
qCurrentAdventure=function(){const routes=[['Chapter 1','The Magic Letter','Tu carta ya llegó','✉️✨',showChapter1Intro],['Chapter 2','Potion Mystery','Hay una botella fuera de lugar','🧪🔎',showChapter2Intro],['Chapter 3','Owl Message','Un papel azul espera en el aula','🦉📄',showChapter3Intro],['Chapter 4','Forest Riddle','El bosque necesita direcciones','🌲🧭',showChapter4Intro],['Chapter 5','Market Day','El picnic necesita comida','🛍️🧺',showChapter5Intro],['Chapter 6','The Midnight Room','Una puerta aparece sólo de noche','🌙🚪',showChapter6Intro],['Chapter 7','First Morning','La primera campana está por sonar','🌅🎒',showChapter7Intro],['Chapter 8','Creature Class','Pip necesita que lo reconozcas','🐾👁️',showChapter8Intro],['Chapter 9','The Family Portrait','El retrato perdió sus nombres','🖼️👨‍👩‍👧‍👦',showChapter9Intro],['Chapter 10','The Lost Map','El mapa se está borrando','🗺️✨',showChapter10Intro]];if(!state.phase0Complete)return {eyebrow:'Prólogo',title:'Before the Letter',text:`Escalón ${state.currentStep} de 10`,icon:'🦉✉️',action:()=>state.introSeen?startStep(state.currentStep):intro()};for(let i=0;i<10;i++)if(!state[`chapter${i+1}Complete`]){const r=routes[i];return {eyebrow:r[0],title:r[1],text:r[2],icon:r[3],action:r[4]};}return {eyebrow:'Season One',title:'Primera campaña completa',text:'Lista para seguir creciendo',icon:'🏆📚',action:showCampaign};};
const c10OldUpdateHud=updateHud;updateHud=function(){c10OldUpdateHud();ensureC10State();const done=[1,2,3,4,5,6,7,8,9,10].filter(n=>state[`chapter${n}Complete`]).length;const next=Math.min(10,done+1);const l=$('levelText');if(l)l.textContent=(done===10?'Season 1 ✓':state.phase0Complete?`Ch. ${next}`:`Step ${state.currentStep}`)+` · ${state.totalXp||0} XP`;const sub=$('headerSubtitle');if(sub)sub.textContent=done===10?'Season One complete':done===9?'The Lost Map':done===8?'The Family Portrait':done===7?'Creature Class':done===6?'First Morning':done===5?'The Midnight Room':done===4?'Market Day':done===3?'Forest Riddle':done===2?'Owl Message':done===1?'Potion Mystery':state.phase0Complete?'The Magic Letter':'Before the Letter · Zero English';};

window.MEQ_BUILD='1.9.0';updateHud();if(state.lastRoute==='home')showHome();
