'use strict';

// MVP 1.1 — Chapter 6: everyday home language inside the magical narrative.
// This chapter deliberately reduces assistance in the conversation scene.

const C6_ID='chapter_6_midnight_room';
const C6_EVIDENCE='chapter6Evidence';
const C6_TOTAL=10;
const C6_CHAPTER='🌙 Chapter 6';

function ensureC6State(){
  meqEnsureEvidence(C6_EVIDENCE);
  state.chapter6Scene ||= 1;
  state.chapter6Complete ||= false;
}
function c6SceneData(n){return meqStoryScene(C6_ID,n)||{title:`Scene ${n}`,reward_coins:0};}
function c6SetScene(n){ensureC6State();state.chapter6Scene=n;saveState();}
function c6Award(n){const s=c6SceneData(n);meqAwardStory('chapter6',s.id||`scene${n}`,s.reward_coins||0);}
function c6Record(kind,ok,w=1){meqRecordEvidence(C6_EVIDENCE,kind,ok,w);}
function c6Ratios(){return meqEvidenceRatios(C6_EVIDENCE);}
function c6Visual(id){
  const map={
    house:{id:'house',label:'house',en:'house',es:'casa',img:'midnight_house.svg'},
    inside:{id:'inside',label:'inside',en:'inside',es:'adentro',visual:'🦊🏠'},
    outside:{id:'outside',label:'outside',en:'outside',es:'afuera',visual:'🏠  🦊'},
    bedroom:{id:'bedroom',label:'bedroom',en:'bedroom',es:'dormitorio / habitación',img:'room_bedroom.svg'},
    bathroom:{id:'bathroom',label:'bathroom',en:'bathroom',es:'baño',img:'room_bathroom.svg'},
    kitchen:{id:'kitchen',label:'kitchen',en:'kitchen',es:'cocina',img:'room_kitchen.svg'},
    bed:{id:'bed',label:'bed',en:'bed',es:'cama',img:'home_bed.svg'},
    light:{id:'light',label:'light',en:'light',es:'luz',img:'home_light.svg'},
    wall:{id:'wall',label:'wall',en:'wall',es:'pared',visual:'🧱'},
    floor:{id:'floor',label:'floor',en:'floor',es:'piso / suelo',visual:'▰'},
    night:{id:'night',label:'night',en:'night',es:'noche',visual:'🌙✨'},
    morning:{id:'morning',label:'morning',en:'morning',es:'mañana',visual:'🌅☀️'},
    window:{id:'window',label:'window',en:'window',es:'ventana',visual:'🪟'},
    door:{id:'door',label:'door',en:'door',es:'puerta',visual:'🚪'},
    key:{id:'key',label:'key',en:'key',es:'llave',img:'magic_key.svg'},
    owl:{id:'owl',label:'owl',en:'owl',es:'búho',img:'owl.svg'},
    under:{id:'under',label:'under',en:'under',es:'debajo',visual:'⬇️🛏️'},
    on:{id:'on',label:'on',en:'on',es:'sobre / encima',visual:'⬆️▰'},
    next_to:{id:'next_to',label:'next to',en:'next to',es:'al lado de',visual:'💡🔑'}
  };
  return map[id];
}

function showChapter6Intro(){
  ensureC6State();setActiveNav('story');const complete=!!state.chapter6Complete;
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">${complete?'Chapter 6 complete':'Nueva historia desbloqueada'}</div><h1 class="title">Chapter 6 · The Midnight Room</h1><p class="subtitle">${complete?'La casa imposible ya no es un misterio. Podés volver para ganar fluidez, no más dinero familiar.':'La llave plateada abre una puerta que sólo aparece de noche. Detrás hay una pequeña casa escondida dentro de la academia.'}</p>${meqSceneFrame({backdrop:'midnight_house.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.58},{src:'milo.svg',alt:'Milo',pos:'right-ground',motion:'gentle-bob',scale:.54}],props:[{src:'magic_key.svg',alt:'silver key',pos:'center-letter',motion:'letter-glow',scale:.24}],caption:complete?'The house remembers your route.':'A silver door appears at midnight…',label:'THE MIDNIGHT ROOM'})}${meqGuideVisual(complete?'Ahora podés repetir habitaciones, ubicaciones y frases de casa para que salgan automáticas.':'Vamos a aprender palabras de la vida real usando una casa mágica: bedroom, bathroom, kitchen, bed, light… pero siempre porque la historia las necesita.')}<div class="scene-skill-row"><span>👂 escuchar</span><span>🏠 explorar</span><span>📍 ubicar</span><span>🎤 responder</span><span>🧠 recordar</span></div><button id="c6Start" class="btn primary wide">${complete?'Jugar de nuevo →':'Abrir la puerta →'}</button>${complete?'<button id="c6Campaign" class="btn secondary wide" style="margin-top:9px">📚 Ver campaña</button>':''}</section>`;
  $('c6Start').onclick=c6Scene1Teach;if(complete)$('c6Campaign').onclick=showCampaign;
}

function c6Scene1Teach(){
  c6SetScene(1);meqRuntimeTeachCarousel({chapterLabel:C6_CHAPTER,scene:1,total:C6_TOTAL,title:c6SceneData(1).title,items:[c6Visual('house'),c6Visual('inside'),c6Visual('outside')],onDone:c6Scene1Game});
}
function c6Scene1Game(){
  meqRuntimeListenChoices({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:1,total:C6_TOTAL,title:c6SceneData(1).title,tasks:[
    {audio:'Go inside.',target:'inside',translation:'inside = adentro',choices:[c6Visual('inside'),c6Visual('outside')],prompt:'Milo cruza la puerta.'},
    {audio:'Go outside.',target:'outside',translation:'outside = afuera',choices:[c6Visual('inside'),c6Visual('outside')],prompt:'Ahora tiene que salir.'},
    {audio:'Find the house.',target:'house',translation:'house = casa',choices:[c6Visual('house'),{id:'castle',visual:'🏰'},{id:'shop',visual:'🛍️'}],prompt:'¿Qué lugar nombró?'}
  ],onDone:()=>{c6Award(1);c6Scene2Teach();}});
}

function c6Scene2Teach(){
  c6SetScene(2);meqRuntimeTeachCarousel({chapterLabel:C6_CHAPTER,scene:2,total:C6_TOTAL,title:c6SceneData(2).title,items:[c6Visual('bedroom'),c6Visual('bathroom'),c6Visual('kitchen')],onDone:c6Scene2Game});
}
function c6Scene2Game(){
  const rooms=[c6Visual('bedroom'),c6Visual('bathroom'),c6Visual('kitchen')];
  meqRuntimeListenChoices({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:2,total:C6_TOTAL,title:c6SceneData(2).title,tasks:[
    {audio:'Find the kitchen.',target:'kitchen',choices:rooms,prompt:'Tres puertas, una pista.'},
    {audio:'Bedroom.',target:'bedroom',choices:rooms,prompt:'Sólo escuchá el nombre.'},
    {audio:'Find the bathroom.',target:'bathroom',choices:rooms,prompt:'¿Qué puerta abrirías?'}
  ],onDone:()=>{c6Award(2);c6Scene3Teach();}});
}

function c6Scene3Teach(){
  c6SetScene(3);meqRuntimeTeachCarousel({chapterLabel:C6_CHAPTER,scene:3,total:C6_TOTAL,title:c6SceneData(3).title,items:[c6Visual('bed'),c6Visual('light')],onDone:c6Scene3Game});
}
function c6Scene3Game(){
  meqRuntimeListenChoices({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:3,total:C6_TOTAL,title:c6SceneData(3).title,tasks:[
    {audio:'Find the bed.',target:'bed',choices:[c6Visual('bed'),c6Visual('light'),{id:'chair',visual:'🪑'}]},
    {audio:'Find the light.',target:'light',choices:[c6Visual('bed'),c6Visual('light'),{id:'book',visual:'📕'}]},
    {audio:'The light is on.',target:'light',choices:[c6Visual('light'),c6Visual('bed')],prompt:'¿Qué objeto está encendido?'}
  ],onDone:()=>{c6Award(3);c6Scene4Teach();}});
}

function c6Scene4Teach(){
  c6SetScene(4);meqRuntimeTeachCarousel({chapterLabel:C6_CHAPTER,scene:4,total:C6_TOTAL,title:c6SceneData(4).title,items:[c6Visual('wall'),c6Visual('floor')],onDone:c6Scene4Game});
}
function c6Scene4Game(){
  session={...session,c6WallRound:0,c6WallTasks:[
    {audio:'The book is on the floor.',target:'floor',prop:'📕'},
    {audio:'Look at the wall.',target:'wall',prop:'🖼️'},
    {audio:'The key is on the floor.',target:'floor',prop:'🔑'}
  ]};renderC6WallFloor();
}
function renderC6WallFloor(){
  const t=session.c6WallTasks[session.c6WallRound];if(!t){c6Award(4);return c6Scene5Teach();}
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C6_CHAPTER,4,C6_TOTAL,c6SceneData(4).title)}<span class="game-label">🏠 Tocá una parte real del cuarto</span><div class="prompt">Escuchá dónde está o dónde mirar.</div><button id="c6WallAudio" class="sound-orb">🔊</button><div style="position:relative;max-width:620px;height:320px;margin:14px auto;border-radius:24px;overflow:hidden;border:3px solid #8f76cf;background:#554075"><button data-zone="wall" class="c6-wall-zone" style="position:absolute;inset:0 0 36% 0;border:0;background:rgba(112,84,147,.28);font-size:56px">${t.prop}</button><button data-zone="floor" class="c6-wall-zone" style="position:absolute;inset:64% 0 0 0;border:0;background:rgba(111,77,56,.68);font-size:56px">${t.prop}</button><span style="position:absolute;left:14px;top:12px;color:#fff8;pointer-events:none">WALL</span><span style="position:absolute;left:14px;bottom:12px;color:#fff8;pointer-events:none">FLOOR</span></div><div id="c6WallFb" class="feedback"></div>${meqStoryHelp('Primero usá el espacio físico. Si te trabás, Milo te dice la traducción.','wall = pared · floor = piso')}</section>`;
  setTimeout(()=>speak(t.audio),220);$('c6WallAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c6-wall-zone').forEach(b=>b.onclick=()=>{const ok=b.dataset.zone===t.target;c6Record('listening',ok);c6Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual','usage'],context:`c6s4:room_surface:${t.target}`,mode:'spatial_surface',distractorId:b.dataset.zone});$('c6WallFb').className=`feedback ${ok?'good':'soft'}`;$('c6WallFb').textContent=ok?'✨ Esa parte del cuarto coincide con la frase.':'No coincide. Escuchala una vez más.';if(ok){playSfx('success');session.c6WallRound++;setTimeout(renderC6WallFloor,720)}else{playSfx('retry');speak(t.audio,true)}});
}

function c6Scene5Teach(){
  c6SetScene(5);meqRuntimeTeachCarousel({chapterLabel:C6_CHAPTER,scene:5,total:C6_TOTAL,title:c6SceneData(5).title,items:[c6Visual('night'),c6Visual('morning')],onDone:c6Scene5Game});
}
function c6Scene5Game(){
  meqRuntimeListenChoices({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:5,total:C6_TOTAL,title:c6SceneData(5).title,tasks:[
    {audio:'Night.',target:'night',choices:[c6Visual('night'),c6Visual('morning')]},
    {audio:'Morning.',target:'morning',choices:[c6Visual('night'),c6Visual('morning')]},
    {audio:'Good night.',target:'night',choices:[c6Visual('night'),c6Visual('morning')],prompt:'¿En qué escena encaja ese saludo?'},
    {audio:'Good morning.',target:'morning',choices:[c6Visual('night'),c6Visual('morning')],prompt:'El cielo ya cambió.'}
  ],onDone:()=>{c6Award(5);c6Scene6();}});
}

function c6Scene6(){
  c6SetScene(6);const choices=[
    {id:'open_window',visual:'🪟✨',label:'open window'},
    {id:'close_window',visual:'🪟🔒',label:'close window'},
    {id:'open_door',visual:'🚪✨',label:'open door'},
    {id:'close_door',visual:'🚪🔒',label:'close door'}
  ];
  meqRuntimeListenChoices({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:6,total:C6_TOTAL,title:c6SceneData(6).title,tasks:[
    {audio:'Open the window.',target:'open_window',choices,prompt:'La casa reacciona a la voz.'},
    {audio:'Close the door.',target:'close_door',choices,prompt:'Ahora otra acción.'},
    {audio:'Open the door.',target:'open_door',choices,prompt:'Misma puerta, acción opuesta.'},
    {audio:'Close the window.',target:'close_window',choices,prompt:'Última orden.'}
  ],onDone:()=>{c6Award(6);c6Scene7();}});
}

function c6Scene7(){
  c6SetScene(7);meqRuntimeListenChoices({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:7,total:C6_TOTAL,title:c6SceneData(7).title,tasks:[
    {audio:'The owl is inside.',target:'inside',choices:[{...c6Visual('inside'),visual:'🏠🦉'},{...c6Visual('outside'),visual:'🏠   🦉'}],prompt:'Seguí al búho con los ojos.'},
    {audio:'The owl is outside.',target:'outside',choices:[{...c6Visual('inside'),visual:'🏠🦉'},{...c6Visual('outside'),visual:'🏠   🦉'}],prompt:'Volvió a cruzar la ventana.'},
    {audio:'Where is the owl? Inside.',target:'inside',choices:[c6Visual('inside'),c6Visual('outside')],prompt:'Ahora escuchás pregunta y respuesta.'}
  ],onDone:()=>meqRuntimeVoicePrompt({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:7,total:C6_TOTAL,title:c6SceneData(7).title,target:'Outside.',intro:'El búho vuela afuera. Decí una sola palabra:',onPass:()=>{c6Award(7);c6Scene8();},onFallback:()=>{c6Award(7);c6Scene8();}})});
}

function c6Scene8(){
  c6SetScene(8);session={...session,c6KeyRound:0,c6KeyTasks:[
    {audio:'The key is under the bed.',target:'under',choices:[c6Visual('under'),c6Visual('on'),c6Visual('next_to')]},
    {audio:'The key is on the floor.',target:'on',choices:[c6Visual('under'),c6Visual('on'),c6Visual('next_to')]},
    {audio:'The key is next to the light.',target:'next_to',choices:[c6Visual('under'),c6Visual('on'),c6Visual('next_to')]}
  ]};renderC6KeyMemory();
}
function renderC6KeyMemory(){
  const t=session.c6KeyTasks[session.c6KeyRound];if(!t){c6Award(8);return c6Scene9();}
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C6_CHAPTER,8,C6_TOTAL,c6SceneData(8).title)}<span class="game-label">🧠 Escuchá, recordá, encontrá</span><div class="prompt">La llave aparece un instante y desaparece.</div><button id="c6KeyAudio" class="sound-orb">🔊</button><div style="max-width:620px;margin:14px auto;position:relative">${meqImg('room_bedroom.svg','bedroom','runtime-choice-img')}<div style="position:absolute;inset:12px;display:flex;align-items:flex-end;justify-content:center;font-size:46px;pointer-events:none">🔑</div></div><div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c6-key-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c6KeyFb" class="feedback"></div>${meqStoryHelp('Una repetición está permitida, pero cuenta como ayuda. Después intentá resolverlo de memoria.')}</section>`;
  let replays=0;setTimeout(()=>speak(t.audio),220);$('c6KeyAudio').onclick=()=>{replays++;const e=meqEnsureEvidence(C6_EVIDENCE);e.helpUses=(e.helpUses||0)+1;saveState();speak(t.audio)};document.querySelectorAll('.c6-key-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c6Record('listening',ok,1.4);c6Record('usage',ok,1.2);meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual','usage'],context:`c6s8:key_memory:${t.target}`,mode:'delayed_scene_memory',distractorId:b.dataset.id,helpLevel:replays?2:0,weight:1.2});b.classList.add(ok?'correct':'wrong');$('c6KeyFb').className=`feedback ${ok?'good':'soft'}`;$('c6KeyFb').textContent=ok?(replays?'✨ Correcto con repetición.':'🌟 Correcto de memoria.'):'No coincide con la pista.';if(ok){playSfx('success');session.c6KeyRound++;setTimeout(renderC6KeyMemory,740)}else{playSfx('retry');speak(t.audio,true)}});
}

function c6Scene9(){
  c6SetScene(9);meqDialogueStart({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:9,total:C6_TOTAL,title:c6SceneData(9).title,help:'Esta vez Milo no te muestra la respuesta primero. Escuchá la pregunta, mirá la habitación y contestá. Si te trabás, la pista sigue disponible.',turns:[
    {speaker:'milo',kind:'response',say:'Where is Amanda?',targetPhrase:'Amanda is in the kitchen.',prompt:'Amanda está en la cocina. Respondé sin ver la frase.',translation:'Where is Amanda? = ¿Dónde está Amanda?'},
    {speaker:'amanda',kind:'listen',say:'Hello!',prompt:'Amanda aparece desde la cocina.'},
    {speaker:'amanda',kind:'response',say:'Where is Milo?',targetPhrase:'Milo is in the bedroom.',prompt:'Milo está en el dormitorio. Respondé.'}
  ],onDone:()=>{c6Award(9);c6Scene10Intro();}});
}

function c6Scene10Intro(){
  c6SetScene(10);const r=c6Ratios();screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C6_CHAPTER,10,C6_TOTAL,c6SceneData(10).title)}<h1 class="title">Escape Before Morning</h1><p class="subtitle">La casa empieza a desaparecer. Tenés que recuperar la llave siguiendo solamente las pistas.</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C6_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div>${meqGuideVisual('No entra vocabulario nuevo. El final mezcla casa, habitación, objetos, ubicaciones, acciones y morning.')}<button id="c6BossStart" class="btn primary wide">Empezar final →</button></section>`;$('c6BossStart').onclick=c6BossStart;
}
function c6BossStart(){
  session={...session,c6BossScore:0};const roomChoices=[c6Visual('bedroom'),c6Visual('bathroom'),c6Visual('kitchen')];
  meqRuntimeListenChoices({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:10,total:C6_TOTAL,title:c6SceneData(10).title,help:'La secuencia usa cosas que ya aprendiste. Si necesitás ayuda, podés usarla; después reforzamos sólo lo necesario.',tasks:[
    {audio:'Go inside the house.',target:'inside',choices:[c6Visual('inside'),c6Visual('outside')]},
    {audio:'Go to the bedroom.',target:'bedroom',choices:roomChoices},
    {audio:'Find the light.',target:'light',choices:[c6Visual('bed'),c6Visual('light')]},
    {audio:'Look under the bed.',target:'under',choices:[c6Visual('under'),c6Visual('on'),c6Visual('next_to')]},
    {audio:'Take the key.',target:'key',choices:[c6Visual('key'),{id:'book',visual:'📕'},{id:'pencil',visual:'✏️'}]},
    {audio:'Open the window.',target:'window',choices:[c6Visual('window'),c6Visual('door')]},
    {audio:'Go outside.',target:'outside',choices:[c6Visual('inside'),c6Visual('outside')]}
  ],onDone:c6BossGreeting});
}
function c6BossGreeting(){
  meqDialogueStart({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:10,total:C6_TOTAL,title:c6SceneData(10).title,help:'Último intercambio. La respuesta es una frase que ya escuchaste en este capítulo.',turns:[
    {speaker:'amanda',kind:'response',say:'Good morning.',targetPhrase:'Good morning.',prompt:'Ya salió el sol. Contestale a Amanda.'}
  ],onDone:()=>{session.c6BossScore=1;finishC6Boss();}});
}
function finishC6Boss(){
  const r=c6Ratios(),overall=.44*r.listening+.38*r.usage+.18*Math.max(r.speaking,.62);const pass=session.c6BossScore===1&&overall>=.80&&r.listening>=.75&&r.usage>=.73;
  if(pass){state.chapter6Complete=true;saveState();c6Award(10);}
  screen.innerHTML=`<section class="card reward-card scene-card"><div class="big-emoji">${pass?'🌅🏠✨':'🦊🛠️'}</div><div class="eyebrow">The Midnight Room</div><h1 class="title">${pass?'You made it outside!':'Una habilidad necesita refuerzo'}</h1><p class="subtitle">${pass?'Usaste inglés de casa para moverte, encontrar objetos y responder sin que siempre te mostraran la frase.':'No volvemos al principio. Milo trabaja sólo la habilidad más débil y te devuelve al final.'}</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C6_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div><button id="c6ResultNext" class="btn primary wide">${pass?'Ver final →':'Refuerzo rápido →'}</button><button id="c6ResultCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;
  $('c6ResultNext').onclick=()=>pass?c6Ending():c6Repair();$('c6ResultCampaign').onclick=showCampaign;
}
function c6Repair(){
  const r=c6Ratios(),skill=r.speaking<.62?'speaking':r.listening<=r.usage?'listening':'usage';
  if(skill==='speaking')return meqRuntimeVoicePrompt({stateKey:C6_EVIDENCE,chapterLabel:C6_CHAPTER,scene:10,total:C6_TOTAL,title:"Milo's Quick Repair",target:'Good morning.',intro:'Una frase y volvemos al final:',onPass:c6Scene10Intro,onFallback:c6Scene10Intro});
  session={...session,c6Repair:0,c6RepairSkill:skill,c6RepairTasks:[
    {audio:'Find the bedroom.',target:'bedroom',choices:[c6Visual('bedroom'),c6Visual('bathroom'),c6Visual('kitchen')]},
    {audio:'The key is under the bed.',target:'under',choices:[c6Visual('under'),c6Visual('on'),c6Visual('next_to')]},
    {audio:'Go outside.',target:'outside',choices:[c6Visual('inside'),c6Visual('outside')]}
  ]};renderC6Repair();
}
function renderC6Repair(){
  const t=session.c6RepairTasks[session.c6Repair];if(!t)return c6Scene10Intro();screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C6_CHAPTER,10,C6_TOTAL,"Milo's Quick Repair")}<span class="game-label">🛠️ Sólo reforzamos ${session.c6RepairSkill}</span><div class="prompt">Tres pistas y volvés al final.</div><button id="c6RepairAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c6-repair-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c6RepairFb" class="feedback"></div></section>`;setTimeout(()=>speak(t.audio),220);$('c6RepairAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c6-repair-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c6Record(session.c6RepairSkill,ok,2);meqRecordUnitTask(t.target,ok,{dimensions:[session.c6RepairSkill==='usage'?'usage':'listening'],context:`c6repair:${session.c6Repair}:${t.target}`,mode:'adaptive_repair',distractorId:b.dataset.id,weight:1.3});if(session.c6RepairSkill!=='listening')c6Record('listening',true,.3);b.classList.add(ok?'correct':'wrong');$('c6RepairFb').className=`feedback ${ok?'good':'soft'}`;$('c6RepairFb').textContent=ok?'✨ Reforzado.':'La repetimos lenta.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.c6Repair++;renderC6Repair()},720)});
}
function c6Ending(){
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 6 complete</div><h1 class="title">The Midnight Room · End</h1>${meqSceneFrame({backdrop:'midnight_house.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.58},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.54}],props:[{src:'magic_key.svg',alt:'silver key',pos:'center-letter',motion:'letter-glow',scale:.25}],caption:'The sun rises. The impossible house becomes a normal wall.',label:'STORY COMPLETE'})}<p class="subtitle">La llave ahora tiene un pequeño sol grabado. Suena una campana: es la primera mañana completa en la academia.</p>${meqGuideVisual('La próxima historia puede aprovechar todo esto para una rutina real: wake, wash, wear, carry, breakfast y llegar a clase.')}<div class="chapter-hook"><span>🌅🎒</span><div><b>Next: Chapter 7</b><strong>First Morning</strong><small>wake · wash · wear · carry · breakfast · school routine</small></div></div><button id="c6EndCampaign" class="btn primary wide" style="margin-top:14px">Volver a la campaña →</button></section>`;$('c6EndCampaign').onclick=showCampaign;
}

if(typeof SONGS!=='undefined'){
  SONGS.home={id:'home',title:'Home at Night Beat',unlock:()=>!!state.chapter5Complete,icon:'🏠🎵',phrases:[
    {text:'Go inside.',visual:'🦊🏠',words:['go','inside']},
    {text:'Find the bedroom.',visual:'🛏️🚪',words:['find','bedroom']},
    {text:'Open the window.',visual:'🪟✨',words:['open','window']},
    {text:'Good night.',visual:'🌙✨',words:['good','night']},
    {text:'Good morning.',visual:'🌅☀️',words:['good','morning']}
  ]};
}

// Campaign + navigation extension. Older chapters remain playable.
showCampaign=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();
  const c1=!!state.chapter1Complete,c2=!!state.chapter2Complete,c3=!!state.chapter3Complete,c4=!!state.chapter4Complete,c5=!!state.chapter5Complete,c6=!!state.chapter6Complete;
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Tu aventura</div><h1 class="title">La historia crece con el inglés que ya dominás</h1><p class="subtitle">Cada capítulo reutiliza lo anterior y agrega una necesidad nueva. No hay listas de gramática sueltas.</p>${meqGuideVisual(c6?'Seis historias completas. Ya podés usar inglés básico en saludos, objetos, aula, bosque, mercado y casa.':c5?'The Midnight Room está abierto. Ahora vamos a un entorno cotidiano dentro de la magia.':'Seguí el capítulo activo.')}<div class="chapter-grid">
  <button class="chapter-card ${c1?'done':'active'}" id="campaignC1"><span>✉️</span><div><b>Chapter 1</b><strong>The Magic Letter</strong><small>${c1?'✓ Terminado':'En curso'}</small></div></button>
  <button class="chapter-card ${c1?(c2?'done':'active'):'locked'}" id="campaignC2" ${c1?'':'disabled'}><span>🧪</span><div><b>Chapter 2</b><strong>Potion Mystery</strong><small>${!c1?'🔒 Bloqueado':c2?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c2?(c3?'done':'active'):'locked'}" id="campaignC3" ${c2?'':'disabled'}><span>🦉</span><div><b>Chapter 3</b><strong>Owl Message</strong><small>${!c2?'🔒 Bloqueado':c3?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c3?(c4?'done':'active'):'locked'}" id="campaignC4" ${c3?'':'disabled'}><span>🌲</span><div><b>Chapter 4</b><strong>Forest Riddle</strong><small>${!c3?'🔒 Bloqueado':c4?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c4?(c5?'done':'active'):'locked'}" id="campaignC5" ${c4?'':'disabled'}><span>🛍️</span><div><b>Chapter 5</b><strong>Market Day</strong><small>${!c4?'🔒 Bloqueado':c5?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c5?(c6?'done':'active'):'locked'}" id="campaignC6" ${c5?'':'disabled'}><span>🌙</span><div><b>Chapter 6</b><strong>The Midnight Room</strong><small>${!c5?'🔒 Bloqueado':c6?'✓ Terminado':'Listo para jugar'}</small></div></button>
  <button class="chapter-card locked" disabled><span>🌅</span><div><b>Chapter 7</b><strong>First Morning</strong><small>${c6?'🔒 Próximo':'🔒 Bloqueado'}</small></div></button>
  </div></section>`;
  $('campaignC1').onclick=showChapter1Intro;if(c1)$('campaignC2').onclick=showChapter2Intro;if(c2)$('campaignC3').onclick=showChapter3Intro;if(c3)$('campaignC4').onclick=showChapter4Intro;if(c4)$('campaignC5').onclick=showChapter5Intro;if(c5)$('campaignC6').onclick=showChapter6Intro;setActiveNav('story');
};
showMap=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();screen.innerHTML=`<section class="card"><div class="eyebrow">Prólogo</div><h1 class="title">Before the Letter</h1><p class="subtitle">Diez escalones antes de la campaña.</p><div class="quest-map">${MAP.map((n,i)=>{const step=i+1,unlock=step<=state.unlockedStep,current=step===state.currentStep,d=stageData(step);return `<button class="map-node ${unlock?'unlocked':'locked'} ${current?'current':''}" data-step="${step}" ${unlock?'':'disabled'}><div class="node-num">${d.mastered?'✓':step}</div><div><div class="node-title">${n[0]}</div><div class="node-sub">${n[1]}</div></div><div class="node-badge">${unlock?n[2]:'🔒'}</div></button>`}).join('')}</div></section><section class="card"><div class="eyebrow">Campaña</div><h2 style="margin:5px 0">Historias</h2><div class="chapter-grid compact"><button class="chapter-card ${state.chapter1Complete?'done':state.phase0Complete?'active':'locked'}" id="mapC1" ${state.phase0Complete?'':'disabled'}><span>✉️</span><div><b>Ch. 1</b><strong>The Magic Letter</strong></div></button><button class="chapter-card ${state.chapter2Complete?'done':state.chapter1Complete?'active':'locked'}" id="mapC2" ${state.chapter1Complete?'':'disabled'}><span>🧪</span><div><b>Ch. 2</b><strong>Potion Mystery</strong></div></button><button class="chapter-card ${state.chapter3Complete?'done':state.chapter2Complete?'active':'locked'}" id="mapC3" ${state.chapter2Complete?'':'disabled'}><span>🦉</span><div><b>Ch. 3</b><strong>Owl Message</strong></div></button><button class="chapter-card ${state.chapter4Complete?'done':state.chapter3Complete?'active':'locked'}" id="mapC4" ${state.chapter3Complete?'':'disabled'}><span>🌲</span><div><b>Ch. 4</b><strong>Forest Riddle</strong></div></button><button class="chapter-card ${state.chapter5Complete?'done':state.chapter4Complete?'active':'locked'}" id="mapC5" ${state.chapter4Complete?'':'disabled'}><span>🛍️</span><div><b>Ch. 5</b><strong>Market Day</strong></div></button><button class="chapter-card ${state.chapter6Complete?'done':state.chapter5Complete?'active':'locked'}" id="mapC6" ${state.chapter5Complete?'':'disabled'}><span>🌙</span><div><b>Ch. 6</b><strong>The Midnight Room</strong></div></button></div></section>`;
  document.querySelectorAll('.map-node.unlocked').forEach(b=>b.onclick=()=>startStep(Number(b.dataset.step)));if(state.phase0Complete)$('mapC1').onclick=showChapter1Intro;if(state.chapter1Complete)$('mapC2').onclick=showChapter2Intro;if(state.chapter2Complete)$('mapC3').onclick=showChapter3Intro;if(state.chapter3Complete)$('mapC4').onclick=showChapter4Intro;if(state.chapter4Complete)$('mapC5').onclick=showChapter5Intro;if(state.chapter5Complete)$('mapC6').onclick=showChapter6Intro;setActiveNav('map');
};

const c6OldC5Ending=c5Ending;
c5Ending=function(){
  if(!state.chapter5Complete)return c6OldC5Ending();
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 5 complete</div><h1 class="title">Market Day · End</h1>${meqSceneFrame({backdrop:'market_square.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.58},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.54}],props:[{src:'market_basket.svg',alt:'picnic basket',pos:'center-letter',motion:'letter-glow',scale:.3},{src:'magic_key.svg',alt:'silver key',pos:'upper-mid',motion:'letter-glow',scale:.18}],caption:'A silver key is underneath the picnic basket.'})}<p class="subtitle">La llave tiene el dibujo de una casa. Al volver a la academia, aparece una puerta que no estaba ahí.</p>${meqGuideVisual('Seguimos con vocabulario de vida cotidiana, pero dentro de la aventura.')}<button id="c5ToC6" class="btn primary wide">Empezar Chapter 6 →</button></section>`;$('c5ToC6').onclick=showChapter6Intro;
};

storyRoute=function(){if(!state.phase0Complete)return state.introSeen?startStep(state.currentStep):intro();if(!state.chapter1Complete)return showChapter1Intro();if(!state.chapter2Complete)return showChapter2Intro();if(!state.chapter3Complete)return showChapter3Intro();if(!state.chapter4Complete)return showChapter4Intro();if(!state.chapter5Complete)return showChapter5Intro();if(!state.chapter6Complete)return showChapter6Intro();return showCampaign();};
qCurrentAdventure=function(){if(!state.phase0Complete)return {eyebrow:'Prólogo',title:'Before the Letter',text:`Escalón ${state.currentStep} de 10`,icon:'🦉✉️',action:()=>state.introSeen?startStep(state.currentStep):intro()};if(!state.chapter1Complete)return {eyebrow:'Chapter 1',title:'The Magic Letter',text:'Tu carta ya llegó',icon:'✉️✨',action:showChapter1Intro};if(!state.chapter2Complete)return {eyebrow:'Chapter 2',title:'Potion Mystery',text:'Hay una botella fuera de lugar',icon:'🧪🔎',action:showChapter2Intro};if(!state.chapter3Complete)return {eyebrow:'Chapter 3',title:'Owl Message',text:'Un papel azul espera en el aula',icon:'🦉📄',action:showChapter3Intro};if(!state.chapter4Complete)return {eyebrow:'Chapter 4',title:'Forest Riddle',text:'El bosque necesita direcciones',icon:'🌲🧭',action:showChapter4Intro};if(!state.chapter5Complete)return {eyebrow:'Chapter 5',title:'Market Day',text:'El picnic necesita comida',icon:'🛍️🧺',action:showChapter5Intro};if(!state.chapter6Complete)return {eyebrow:'Chapter 6',title:'The Midnight Room',text:'Una puerta aparece sólo de noche',icon:'🌙🚪',action:showChapter6Intro};return {eyebrow:'Campaña',title:'Seis historias completadas',text:'La primera mañana en la academia está por empezar',icon:'🌅🎒',action:showCampaign};};
const c6OldUpdateHud=updateHud;updateHud=function(){c6OldUpdateHud();ensureC6State();const l=$('levelText');if(l)l.textContent=(state.chapter6Complete?'Ch. 6 ✓':state.chapter5Complete?'Ch. 6':state.chapter4Complete?'Ch. 5':state.chapter3Complete?'Ch. 4':state.chapter2Complete?'Ch. 3':state.chapter1Complete?'Ch. 2':state.phase0Complete?'Ch. 1':`Step ${state.currentStep}`)+` · ${state.totalXp||0} XP`;const sub=$('headerSubtitle');if(sub)sub.textContent=state.chapter6Complete?'First Morning · next':state.chapter5Complete?'The Midnight Room':state.chapter4Complete?'Market Day':state.chapter3Complete?'Forest Riddle':state.chapter2Complete?'Owl Message':state.chapter1Complete?'Potion Mystery':state.phase0Complete?'The Magic Letter':'Before the Letter · Zero English';};
window.MEQ_BUILD='1.9.0';updateHud();if(state.lastRoute==='home')showHome();
