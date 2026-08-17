'use strict';

// MVP 1.2 — Chapter 7: First Morning.
// Everyday routine verbs are learned through visible action and then chained into a story goal.

const C7_ID='chapter_7_first_morning';
const C7_EVIDENCE='chapter7Evidence';
const C7_TOTAL=10;
const C7_CHAPTER='🌅 Chapter 7';

function ensureC7State(){
  meqEnsureEvidence(C7_EVIDENCE);
  state.chapter7Scene ||= 1;
  state.chapter7Complete ||= false;
}
function c7SceneData(n){return meqStoryScene(C7_ID,n)||{title:`Scene ${n}`,reward_coins:0};}
function c7SetScene(n){ensureC7State();state.chapter7Scene=n;saveState();}
function c7Award(n){const s=c7SceneData(n);meqAwardStory('chapter7',s.id||`scene${n}`,s.reward_coins||0);}
function c7Record(kind,ok,w=1){meqRecordEvidence(C7_EVIDENCE,kind,ok,w);}
function c7Ratios(){return meqEvidenceRatios(C7_EVIDENCE);}
function c7Visual(id){
  const map={
    sleep:{id:'sleep',label:'sleep',en:'sleep',es:'dormir',visual:'😴🛏️'},
    wake:{id:'wake',label:'wake',en:'wake',es:'despertarse',visual:'🌅🙋'},
    wash:{id:'wash',label:'wash',en:'wash',es:'lavarse',img:'morning_sink.svg'},
    breakfast:{id:'breakfast',label:'breakfast',en:'breakfast',es:'desayuno',img:'breakfast_table.svg'},
    hungry:{id:'hungry',label:'hungry',en:'hungry',es:'con hambre',visual:'😋🍽️'},
    eat:{id:'eat',label:'eat',en:'eat',es:'comer',visual:'🍎➡️😋'},
    drink:{id:'drink',label:'drink',en:'drink',es:'beber / tomar',visual:'🥛➡️🙂'},
    wear:{id:'wear',label:'wear',en:'wear',es:'llevar puesto',img:'morning_outfit.svg'},
    carry:{id:'carry',label:'carry',en:'carry',es:'llevar / cargar',img:'school_bag.svg'},
    walk:{id:'walk',label:'walk',en:'walk',es:'caminar',visual:'🚶‍♀️➡️🏫'},
    bag:{id:'bag',label:'bag',en:'bag',es:'mochila',img:'school_bag.svg'},
    school:{id:'school',label:'school',en:'school',es:'escuela',img:'academy_morning.svg'},
    water:{id:'water',label:'water',en:'water',es:'agua',visual:'💧'},
    apple:{id:'apple',label:'apple',en:'apple',es:'manzana',img:'market_apple.svg'},
    bread:{id:'bread',label:'bread',en:'bread',es:'pan',img:'market_bread.svg'},
    milk:{id:'milk',label:'milk',en:'milk',es:'leche',img:'market_milk.svg'},
    juice:{id:'juice',label:'juice',en:'juice',es:'jugo',img:'market_juice.svg'},
    ready:{id:'ready',label:'ready',en:'ready',es:'lista / listo',visual:'✨🎒'},
    left:{id:'left',label:'left',en:'left',es:'izquierda',visual:'⬅️'},
    right:{id:'right',label:'right',en:'right',es:'derecha',visual:'➡️'}
  };
  return map[id];
}

function showChapter7Intro(){
  ensureC7State();setActiveNav('story');const complete=!!state.chapter7Complete;
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">${complete?'Chapter 7 complete':'Nueva historia desbloqueada'}</div><h1 class="title">Chapter 7 · First Morning</h1><p class="subtitle">${complete?'La primera mañana ya es parte de tu vocabulario activo. Podés repetirla por fluidez y memoria.':'Suena la primera campana de la academia. Hay que despertarse, prepararse, desayunar y llegar a clase a tiempo.'}</p>${meqSceneFrame({backdrop:'morning_bedroom.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.58},{src:'milo.svg',alt:'Milo',pos:'right-ground',motion:'gentle-bob',scale:.52}],props:[{src:'school_bag.svg',alt:'school bag',pos:'center-letter',motion:'letter-glow',scale:.24}],caption:complete?'Your morning route is ready to replay.':'The first bell will ring soon…',label:'FIRST MORNING'})}${meqGuideVisual(complete?'Ahora el objetivo es responder cada vez con menos ayuda.':'No vamos a estudiar una lista de verbos. Vas a ver cada acción, escucharla, hacerla y después encadenarla dentro de una mañana real.')}<div class="scene-skill-row"><span>🌅 rutina</span><span>👂 escuchar</span><span>🎮 actuar</span><span>🎤 responder</span><span>🧠 ordenar</span></div><button id="c7Start" class="btn primary wide">${complete?'Jugar de nuevo →':'Empezar la mañana →'}</button>${complete?'<button id="c7Campaign" class="btn secondary wide" style="margin-top:9px">📚 Ver campaña</button>':''}</section>`;
  $('c7Start').onclick=c7Scene1Teach;if(complete)$('c7Campaign').onclick=showCampaign;
}

function c7Scene1Teach(){
  c7SetScene(1);meqRuntimeTeachCarousel({chapterLabel:C7_CHAPTER,scene:1,total:C7_TOTAL,title:c7SceneData(1).title,items:[c7Visual('sleep'),c7Visual('wake')],onDone:c7Scene1Game});
}
function c7Scene1Game(){
  meqRuntimeListenChoices({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:1,total:C7_TOTAL,title:c7SceneData(1).title,tasks:[
    {audio:'Sleep.',target:'sleep',choices:[c7Visual('sleep'),c7Visual('wake')],prompt:'Primero mirá el estado del personaje.'},
    {audio:'Wake up.',target:'wake',choices:[c7Visual('sleep'),c7Visual('wake')],prompt:'El sol entra por la ventana.'},
    {audio:'Good morning.',target:'wake',choices:[c7Visual('wake'),c7Visual('sleep')],prompt:'¿En qué momento encaja ese saludo?'}
  ],onDone:()=>{c7Award(1);c7Scene2Teach();}});
}

function c7Scene2Teach(){
  c7SetScene(2);meqRuntimeTeachCarousel({chapterLabel:C7_CHAPTER,scene:2,total:C7_TOTAL,title:c7SceneData(2).title,items:[c7Visual('wash'),c7Visual('water')],onDone:c7Scene2Game});
}
function c7Scene2Game(){
  meqRuntimeListenChoices({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:2,total:C7_TOTAL,title:c7SceneData(2).title,tasks:[
    {audio:'Wash.',target:'wash',choices:[c7Visual('wash'),c7Visual('sleep'),c7Visual('eat')]},
    {audio:'Wash with water.',target:'wash',choices:[c7Visual('wash'),c7Visual('drink'),c7Visual('walk')]},
    {audio:'Go to the bathroom.',target:'bathroom',choices:[{id:'bathroom',img:'room_bathroom.svg',label:'bathroom'},{id:'kitchen',img:'room_kitchen.svg',label:'kitchen'},{id:'bedroom',img:'room_bedroom.svg',label:'bedroom'}]}
  ],onDone:()=>{c7Award(2);c7Scene3Teach();}});
}

function c7Scene3Teach(){
  c7SetScene(3);meqRuntimeTeachCarousel({chapterLabel:C7_CHAPTER,scene:3,total:C7_TOTAL,title:c7SceneData(3).title,items:[c7Visual('hungry'),c7Visual('breakfast')],onDone:c7Scene3Game});
}
function c7Scene3Game(){
  meqRuntimeListenChoices({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:3,total:C7_TOTAL,title:c7SceneData(3).title,tasks:[
    {audio:'I am hungry.',target:'hungry',choices:[c7Visual('hungry'),c7Visual('ready'),c7Visual('sleep')]},
    {audio:'Breakfast is ready.',target:'breakfast',choices:[c7Visual('breakfast'),c7Visual('school'),c7Visual('wash')]},
    {audio:'Find breakfast.',target:'breakfast',choices:[c7Visual('breakfast'),{id:'bedroom',img:'room_bedroom.svg'},{id:'forest',img:'forest_night.svg'}]}
  ],onDone:()=>{c7Award(3);c7Scene4Teach();}});
}

function c7Scene4Teach(){
  c7SetScene(4);meqRuntimeTeachCarousel({chapterLabel:C7_CHAPTER,scene:4,total:C7_TOTAL,title:c7SceneData(4).title,items:[c7Visual('eat'),c7Visual('drink')],onDone:c7Scene4Game});
}
function c7Scene4Game(){
  meqRuntimeListenChoices({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:4,total:C7_TOTAL,title:c7SceneData(4).title,tasks:[
    {audio:'Eat the apple.',target:'apple',choices:[c7Visual('apple'),c7Visual('milk'),c7Visual('juice')],prompt:'La acción te dice qué tipo de cosa buscar.'},
    {audio:'Drink the milk.',target:'milk',choices:[c7Visual('bread'),c7Visual('milk'),c7Visual('apple')]},
    {audio:'Eat the bread.',target:'bread',choices:[c7Visual('bread'),c7Visual('juice'),c7Visual('water')]},
    {audio:'Drink water.',target:'water',choices:[c7Visual('water'),c7Visual('bread'),c7Visual('apple')]}
  ],onDone:()=>{c7Award(4);c7Scene5Teach();}});
}

function c7Scene5Teach(){
  c7SetScene(5);meqRuntimeTeachCarousel({chapterLabel:C7_CHAPTER,scene:5,total:C7_TOTAL,title:c7SceneData(5).title,items:[c7Visual('wear')],onDone:c7Scene5Game});
}
function c7Scene5Game(){
  meqRuntimeListenChoices({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:5,total:C7_TOTAL,title:c7SceneData(5).title,tasks:[
    {audio:'Wear this.',target:'wear',choices:[c7Visual('wear'),c7Visual('carry'),c7Visual('wash')]},
    {audio:'Wear blue.',target:'blue',choices:[{id:'blue',visual:'🟦✨',label:'blue'},{id:'red',visual:'🟥',label:'red'},{id:'green',visual:'🟩',label:'green'}],prompt:'No hace falta nombrar la ropa: el contexto muestra la acción.'},
    {audio:'Ready?',target:'ready',choices:[c7Visual('ready'),c7Visual('sleep')]}
  ],onDone:()=>{c7Award(5);c7Scene6();}});
}

function c7Scene6(){
  c7SetScene(6);session={...session,c7PackRound:0,c7PackTasks:[
    {audio:'Take the book.',target:'book',choices:[{id:'book',visual:'📕',label:'book'},c7Visual('bag'),c7Visual('water')]},
    {audio:'Bag.',target:'bag',choices:[c7Visual('bag'),{id:'desk',visual:'🪵',label:'desk'},{id:'bed',visual:'🛏️',label:'bed'}]},
    {audio:'Carry the bag.',target:'carry',choices:[c7Visual('carry'),{id:'give',visual:'🤲➡️',label:'give'},{id:'open',visual:'🎒✨',label:'open'}]}
  ]};renderC7Pack();
}
function renderC7Pack(){
  const t=session.c7PackTasks[session.c7PackRound];if(!t){c7Award(6);return c7Scene7Teach();}
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C7_CHAPTER,6,C7_TOTAL,c7SceneData(6).title)}<span class="game-label">🎒 Mini misión en 3 pasos</span><div class="prompt">Escuchá y prepará la mochila.</div><button id="c7PackAudio" class="sound-orb">🔊</button>${meqSceneFrame({backdrop:'morning_bedroom.svg',props:[{src:'school_bag.svg',alt:'bag',pos:'center-letter',scale:.28}],caption:`Paso ${session.c7PackRound+1} de 3`})}<div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c7-pack-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c7PackFb" class="feedback"></div>${meqStoryHelp('La historia te muestra el resultado físico: tomar, poner dentro y después llevar.')}</section>`;
  setTimeout(()=>speak(t.audio),220);$('c7PackAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c7-pack-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c7Record('listening',ok,1.2);c7Record('usage',ok,1.2);$('c7PackFb').className=`feedback ${ok?'good':'soft'}`;$('c7PackFb').textContent=ok?'✨ Hecho. La mochila cambia con la acción.':'Esa acción no coincide. Escuchá otra vez.';if(ok){playSfx('success');session.c7PackRound++;setTimeout(renderC7Pack,680)}else{playSfx('retry');speak(t.audio,true)}});
}

function c7Scene7Teach(){
  c7SetScene(7);meqRuntimeTeachCarousel({chapterLabel:C7_CHAPTER,scene:7,total:C7_TOTAL,title:c7SceneData(7).title,items:[c7Visual('walk'),c7Visual('school')],onDone:c7Scene7Game});
}
function c7Scene7Game(){
  meqRuntimeListenChoices({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:7,total:C7_TOTAL,title:c7SceneData(7).title,tasks:[
    {audio:'Walk.',target:'walk',choices:[c7Visual('walk'),{id:'run',visual:'🏃‍♀️💨',label:'run'},{id:'jump',visual:'🤸',label:'jump'}]},
    {audio:'Walk to school.',target:'school',choices:[c7Visual('school'),{id:'house',img:'midnight_house.svg',label:'house'},{id:'shop',img:'market_square.svg',label:'shop'}]},
    {audio:'Go left.',target:'left',choices:[c7Visual('left'),c7Visual('right')]},
    {audio:'Go right.',target:'right',choices:[c7Visual('left'),c7Visual('right')]}
  ],onDone:()=>{c7Award(7);c7Scene8();}});
}

function c7Scene8(){
  c7SetScene(8);session={...session,c7BreakfastChoice:'juice'};renderC7BreakfastChoice();
}
function renderC7BreakfastChoice(){
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C7_CHAPTER,8,C7_TOTAL,c7SceneData(8).title)}<span class="game-label">💬 Elegí primero; hablá después</span><h1 class="title">Breakfast Choice</h1><p class="subtitle">Elegí qué querés. Después Milo te pregunta sin mostrarte la respuesta.</p>${meqSceneFrame({backdrop:'breakfast_table.svg',actors:[{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.5}],caption:'Choose your breakfast.'})}<div class="runtime-choice-grid">${['apple','bread','milk','juice'].map(id=>`<button class="runtime-choice c7-food-choice" data-id="${id}">${meqChoiceVisual(c7Visual(id))}</button>`).join('')}</div><div id="c7FoodFb" class="feedback"></div>${meqStoryHelp('Primero entendé por la situación. La frase escrita aparece sólo si pedís ayuda.')}</section>`;
  document.querySelectorAll('.c7-food-choice').forEach(b=>b.onclick=()=>{session.c7BreakfastChoice=b.dataset.id;c7Record('usage',true,.8);c7BreakfastDialogue();});
}
function c7BreakfastDialogue(){
  const id=session.c7BreakfastChoice||'juice';const phrase=id==='apple'?'I want one apple, please.':`I want ${id}, please.`;
  meqDialogueStart({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:8,total:C7_TOTAL,title:c7SceneData(8).title,help:'Mirá la comida que elegiste. Intentá responder sin texto. Si te trabás, la ayuda revela el modelo.',turns:[
    {speaker:'milo',kind:'response',say:'Hungry?',targetPhrase:'Yes.',prompt:'Milo ve la mesa. Contestá una respuesta corta.',translation:'Hungry? = ¿Tenés hambre?'},
    {speaker:'milo',kind:'response',say:'What do you want?',targetPhrase:phrase,prompt:`Pedí ${id} como ya aprendiste en Market Day.`,translation:'What do you want? = ¿Qué querés?'},
    {speaker:'amanda',kind:'listen',say:'Thank you.',prompt:'Escuchá el cierre.'}
  ],onDone:()=>{c7Award(8);c7Scene9();}});
}

function c7Scene9(){
  c7SetScene(9);session={...session,c7RoutineIndex:0,c7RoutineScore:0,c7RoutineTasks:[
    {audio:'Wake up.',target:'wake'},
    {audio:'Wash.',target:'wash'},
    {audio:'Eat breakfast.',target:'breakfast'},
    {audio:'Carry the bag.',target:'carry'},
    {audio:'Walk to school.',target:'walk'}
  ]};renderC7RoutineMemory();
}
function c7RoutineChoices(){return [c7Visual('wake'),c7Visual('wash'),c7Visual('breakfast'),c7Visual('carry'),c7Visual('walk')];}
function renderC7RoutineMemory(){
  const t=session.c7RoutineTasks[session.c7RoutineIndex];if(!t){c7Award(9);return meqRuntimeVoicePrompt({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:9,total:C7_TOTAL,title:c7SceneData(9).title,target:'Wake up.',intro:'Una última: decí una acción de la rutina.',onPass:c7Scene10Intro,onFallback:c7Scene10Intro});}
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C7_CHAPTER,9,C7_TOTAL,c7SceneData(9).title)}<span class="game-label">🧠 Rutina sin etiquetas</span><div class="prompt">Paso ${session.c7RoutineIndex+1} de 5. Escuchá y tocá la acción.</div><button id="c7RoutineAudio" class="sound-orb">🔊</button><div class="routine-strip">${shuffle(c7RoutineChoices()).map(c=>`<button class="routine-tile c7-routine-choice" data-id="${c.id}">${meqChoiceVisual({...c,label:''})}</button>`).join('')}</div><div id="c7RoutineFb" class="feedback"></div>${meqStoryHelp('Podés repetir una vez. El objetivo es que la imagen dispare la palabra y la acción, no la traducción.')}</section>`;
  let repeats=0;setTimeout(()=>speak(t.audio),220);$('c7RoutineAudio').onclick=()=>{repeats++;if(repeats>1){const e=meqEnsureEvidence(C7_EVIDENCE);e.helpUses=(e.helpUses||0)+1;saveState();}speak(t.audio)};document.querySelectorAll('.c7-routine-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c7Record('listening',ok,1.3);c7Record('usage',ok,1.1);meqRecordUnitTask(t.target,ok,{dimensions:['listening','usage'],context:`c7s9:routine:${session.c7RoutineIndex}:${t.target}`,mode:'sequence_memory',distractorId:b.dataset.id,helpLevel:repeats>1?2:0,weight:1.2});if(ok){session.c7RoutineScore++;playSfx('success');$('c7RoutineFb').className='feedback good';$('c7RoutineFb').textContent='✨ Sí. Ese es el siguiente paso.';session.c7RoutineIndex++;setTimeout(renderC7RoutineMemory,650)}else{playSfx('retry');$('c7RoutineFb').className='feedback soft';$('c7RoutineFb').textContent='No coincide. Escuchá la acción otra vez.';speak(t.audio,true)}});
}

function c7Scene10Intro(){
  c7SetScene(10);const r=c7Ratios();screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C7_CHAPTER,10,C7_TOTAL,c7SceneData(10).title)}<h1 class="title">Beat the First Bell</h1><p class="subtitle">La campana está por sonar. Completá toda la mañana usando lo que ya aprendiste.</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C7_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div>${meqGuideVisual('El final no enseña nada nuevo: wake, wash, breakfast, eat, drink, wear, carry, walk y ready aparecen dentro de una sola secuencia.')}<button id="c7BossStart" class="btn primary wide">Empezar final →</button></section>`;$('c7BossStart').onclick=c7BossStart;
}
function c7BossStart(){
  session={...session,c7BossScore:0};
  meqRuntimeListenChoices({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:10,total:C7_TOTAL,title:c7SceneData(10).title,help:'No hay vocabulario nuevo. Si pedís ayuda, después reforzamos sólo esa habilidad.',tasks:[
    {audio:'Wake up.',target:'wake',choices:[c7Visual('wake'),c7Visual('sleep')]},
    {audio:'Wash with water.',target:'wash',choices:[c7Visual('wash'),c7Visual('drink'),c7Visual('walk')]},
    {audio:'Eat breakfast.',target:'breakfast',choices:[c7Visual('breakfast'),c7Visual('school'),c7Visual('bag')]},
    {audio:'Drink milk.',target:'milk',choices:[c7Visual('milk'),c7Visual('bread'),c7Visual('apple')]},
    {audio:'Wear this.',target:'wear',choices:[c7Visual('wear'),c7Visual('carry'),c7Visual('wash')]},
    {audio:'Carry the bag.',target:'carry',choices:[c7Visual('carry'),c7Visual('walk'),c7Visual('eat')]},
    {audio:'Walk to school.',target:'school',choices:[c7Visual('school'),{id:'house',img:'midnight_house.svg'},{id:'shop',img:'market_square.svg'}]}
  ],onDone:c7BossReady});
}
function c7BossReady(){
  meqDialogueStart({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:10,total:C7_TOTAL,title:c7SceneData(10).title,help:'Última respuesta. La frase ya estaba en el prólogo; ahora debería salir con mucha menos ayuda.',turns:[
    {speaker:'milo',kind:'response',say:'Ready?',targetPhrase:'I am ready.',prompt:'La campana está por sonar. Respondé sin texto si podés.',translation:'Ready? = ¿Lista?'}
  ],onDone:()=>{session.c7BossScore=1;finishC7Boss();}});
}
function finishC7Boss(){
  const r=c7Ratios(),overall=.46*r.listening+.38*r.usage+.16*Math.max(r.speaking,.63);const pass=session.c7BossScore===1&&overall>=.81&&r.listening>=.76&&r.usage>=.74;
  if(pass){state.chapter7Complete=true;saveState();c7Award(10);}
  screen.innerHTML=`<section class="card reward-card scene-card"><div class="big-emoji">${pass?'🔔🌅🎒':'🦊🛠️'}</div><div class="eyebrow">First Morning</div><h1 class="title">${pass?'You made the first bell!':'Una parte de la rutina necesita refuerzo'}</h1><p class="subtitle">${pass?'Completaste una mañana completa en inglés: acciones, comida, mochila, camino y una respuesta hablada.':'No repetimos el capítulo. Milo te da tres pruebas cortas sobre la habilidad más floja y volvés al final.'}</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C7_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div><button id="c7ResultNext" class="btn primary wide">${pass?'Ver final →':'Refuerzo rápido →'}</button><button id="c7ResultCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;
  $('c7ResultNext').onclick=()=>pass?c7Ending():c7Repair();$('c7ResultCampaign').onclick=showCampaign;
}
function c7Repair(){
  const r=c7Ratios(),skill=r.speaking<.63?'speaking':r.listening<=r.usage?'listening':'usage';
  if(skill==='speaking')return meqRuntimeVoicePrompt({stateKey:C7_EVIDENCE,chapterLabel:C7_CHAPTER,scene:10,total:C7_TOTAL,title:"Milo's Quick Repair",target:'I am ready.',intro:'Una frase conocida y volvemos al final:',onPass:c7Scene10Intro,onFallback:c7Scene10Intro});
  session={...session,c7Repair:0,c7RepairSkill:skill,c7RepairTasks:[
    {audio:'Wake up.',target:'wake',choices:[c7Visual('wake'),c7Visual('sleep')]},
    {audio:'Drink water.',target:'water',choices:[c7Visual('water'),c7Visual('bread'),c7Visual('apple')]},
    {audio:'Carry the bag.',target:'carry',choices:[c7Visual('carry'),c7Visual('walk'),c7Visual('wash')]}
  ]};renderC7Repair();
}
function renderC7Repair(){
  const t=session.c7RepairTasks[session.c7Repair];if(!t)return c7Scene10Intro();
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C7_CHAPTER,10,C7_TOTAL,"Milo's Quick Repair")}<span class="game-label">🛠️ Sólo reforzamos ${session.c7RepairSkill}</span><div class="prompt">Tres pruebas, nada de repetir la historia.</div><button id="c7RepairAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c7-repair-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c7RepairFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c7RepairAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c7-repair-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c7Record(session.c7RepairSkill,ok,2);meqRecordUnitTask(t.target,ok,{dimensions:[session.c7RepairSkill==='usage'?'usage':'listening'],context:`c7repair:${session.c7Repair}:${t.target}`,mode:'adaptive_repair',distractorId:b.dataset.id,weight:1.3});if(session.c7RepairSkill!=='listening')c7Record('listening',true,.3);$('c7RepairFb').className=`feedback ${ok?'good':'soft'}`;$('c7RepairFb').textContent=ok?'✨ Reforzado.':'La repetimos lenta.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.c7Repair++;renderC7Repair()},680)});
}
function c7Ending(){
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 7 complete</div><h1 class="title">First Morning · End</h1>${meqSceneFrame({backdrop:'academy_morning.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.58},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.52}],props:[{src:'school_bag.svg',alt:'school bag',pos:'center-letter',scale:.22}],caption:'The bell rings as you reach the academy.',label:'STORY COMPLETE'})}<p class="subtitle">La puerta del aula se abre y aparece un tablero lleno de símbolos de animales. La siguiente aventura va a exigir describir lo que vemos y elegir entre varias criaturas.</p>${meqGuideVisual('Ya no estamos enseñando sólo palabras: empezamos a encadenar acciones en una rutina completa. En los próximos capítulos la ayuda seguirá bajando gradualmente.')}<div class="chapter-hook"><span>🐾🔍</span><div><b>Next: Chapter 8</b><strong>Creature Class</strong><small>animals · body · colors · have · see · simple descriptions</small></div></div><button id="c7EndCampaign" class="btn primary wide" style="margin-top:14px">Volver a la campaña →</button></section>`;$('c7EndCampaign').onclick=showCampaign;
}

if(typeof SONGS!=='undefined'){
  SONGS.morning={id:'morning',title:'Morning Routine Beat',unlock:()=>!!state.chapter6Complete,icon:'🌅🎵',phrases:[
    {text:'Wake up.',visual:'🌅🙋',words:['wake','up']},
    {text:'Wash with water.',visual:'💧👐',words:['wash','water']},
    {text:'Eat breakfast.',visual:'🍎🍞',words:['eat','breakfast']},
    {text:'Carry the bag.',visual:'🎒🙋',words:['carry','bag']},
    {text:'Walk to school.',visual:'🚶‍♀️🏫',words:['walk','school']}
  ]};
}

// Extend Chapter 6 ending so the next story can start immediately.
const c7OldC6Ending=c6Ending;
c6Ending=function(){
  if(!state.chapter6Complete)return c7OldC6Ending();
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 6 complete</div><h1 class="title">The Midnight Room · End</h1>${meqSceneFrame({backdrop:'midnight_house.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.58},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.54}],props:[{src:'magic_key.svg',alt:'silver key',pos:'center-letter',motion:'letter-glow',scale:.25}],caption:'The sun rises. The impossible house becomes a normal wall.',label:'STORY COMPLETE'})}<p class="subtitle">La llave ahora tiene un pequeño sol grabado. Suena una campana: es la primera mañana completa en la academia.</p>${meqGuideVisual('La nueva historia usa acciones de todos los días dentro de la aventura: wake, wash, breakfast, eat, drink, wear, carry y walk.')}<button id="c6ToC7" class="btn primary wide">Empezar Chapter 7 →</button><button id="c6EndCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;
  $('c6ToC7').onclick=showChapter7Intro;$('c6EndCampaign').onclick=showCampaign;
};

showCampaign=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();ensureC7State();
  const c1=!!state.chapter1Complete,c2=!!state.chapter2Complete,c3=!!state.chapter3Complete,c4=!!state.chapter4Complete,c5=!!state.chapter5Complete,c6=!!state.chapter6Complete,c7=!!state.chapter7Complete;
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Tu aventura</div><h1 class="title">La historia crece con el inglés que ya dominás</h1><p class="subtitle">Cada capítulo recicla vocabulario anterior y agrega una necesidad nueva. La gramática sigue escondida dentro de la acción.</p>${meqGuideVisual(c7?'Siete historias completas. Ya encadenás una rutina diaria entera además de moverte, comprar, leer mensajes y resolver misiones.':c6?'First Morning está abierto: ahora convertimos acciones cotidianas en una misión completa.':'Seguí el capítulo activo.')}<div class="chapter-grid">
  <button class="chapter-card ${c1?'done':'active'}" id="campaignC1"><span>✉️</span><div><b>Chapter 1</b><strong>The Magic Letter</strong><small>${c1?'✓ Terminado':'En curso'}</small></div></button>
  <button class="chapter-card ${c1?(c2?'done':'active'):'locked'}" id="campaignC2" ${c1?'':'disabled'}><span>🧪</span><div><b>Chapter 2</b><strong>Potion Mystery</strong><small>${!c1?'🔒 Bloqueado':c2?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c2?(c3?'done':'active'):'locked'}" id="campaignC3" ${c2?'':'disabled'}><span>🦉</span><div><b>Chapter 3</b><strong>Owl Message</strong><small>${!c2?'🔒 Bloqueado':c3?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c3?(c4?'done':'active'):'locked'}" id="campaignC4" ${c3?'':'disabled'}><span>🌲</span><div><b>Chapter 4</b><strong>Forest Riddle</strong><small>${!c3?'🔒 Bloqueado':c4?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c4?(c5?'done':'active'):'locked'}" id="campaignC5" ${c4?'':'disabled'}><span>🛍️</span><div><b>Chapter 5</b><strong>Market Day</strong><small>${!c4?'🔒 Bloqueado':c5?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c5?(c6?'done':'active'):'locked'}" id="campaignC6" ${c5?'':'disabled'}><span>🌙</span><div><b>Chapter 6</b><strong>The Midnight Room</strong><small>${!c5?'🔒 Bloqueado':c6?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c6?(c7?'done':'active'):'locked'}" id="campaignC7" ${c6?'':'disabled'}><span>🌅</span><div><b>Chapter 7</b><strong>First Morning</strong><small>${!c6?'🔒 Bloqueado':c7?'✓ Terminado':'Listo para jugar'}</small></div></button>
  <button class="chapter-card locked" disabled><span>🐾</span><div><b>Chapter 8</b><strong>Creature Class</strong><small>${c7?'🔒 Próximo':'🔒 Bloqueado'}</small></div></button>
  </div></section>`;
  $('campaignC1').onclick=showChapter1Intro;if(c1)$('campaignC2').onclick=showChapter2Intro;if(c2)$('campaignC3').onclick=showChapter3Intro;if(c3)$('campaignC4').onclick=showChapter4Intro;if(c4)$('campaignC5').onclick=showChapter5Intro;if(c5)$('campaignC6').onclick=showChapter6Intro;if(c6)$('campaignC7').onclick=showChapter7Intro;setActiveNav('story');
};

showMap=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();ensureC7State();
  screen.innerHTML=`<section class="card"><div class="eyebrow">Prólogo</div><h1 class="title">Before the Letter</h1><p class="subtitle">Diez escalones antes de la campaña.</p><div class="quest-map">${MAP.map((n,i)=>{const step=i+1,unlock=step<=state.unlockedStep,current=step===state.currentStep,d=stageData(step);return `<button class="map-node ${unlock?'unlocked':'locked'} ${current?'current':''}" data-step="${step}" ${unlock?'':'disabled'}><div class="node-num">${d.mastered?'✓':step}</div><div><div class="node-title">${n[0]}</div><div class="node-sub">${n[1]}</div></div><div class="node-badge">${unlock?n[2]:'🔒'}</div></button>`}).join('')}</div></section><section class="card"><div class="eyebrow">Campaña</div><h2 style="margin:5px 0">Historias</h2><div class="chapter-grid compact"><button class="chapter-card ${state.chapter1Complete?'done':state.phase0Complete?'active':'locked'}" id="mapC1" ${state.phase0Complete?'':'disabled'}><span>✉️</span><div><b>Ch. 1</b><strong>The Magic Letter</strong></div></button><button class="chapter-card ${state.chapter2Complete?'done':state.chapter1Complete?'active':'locked'}" id="mapC2" ${state.chapter1Complete?'':'disabled'}><span>🧪</span><div><b>Ch. 2</b><strong>Potion Mystery</strong></div></button><button class="chapter-card ${state.chapter3Complete?'done':state.chapter2Complete?'active':'locked'}" id="mapC3" ${state.chapter2Complete?'':'disabled'}><span>🦉</span><div><b>Ch. 3</b><strong>Owl Message</strong></div></button><button class="chapter-card ${state.chapter4Complete?'done':state.chapter3Complete?'active':'locked'}" id="mapC4" ${state.chapter3Complete?'':'disabled'}><span>🌲</span><div><b>Ch. 4</b><strong>Forest Riddle</strong></div></button><button class="chapter-card ${state.chapter5Complete?'done':state.chapter4Complete?'active':'locked'}" id="mapC5" ${state.chapter4Complete?'':'disabled'}><span>🛍️</span><div><b>Ch. 5</b><strong>Market Day</strong></div></button><button class="chapter-card ${state.chapter6Complete?'done':state.chapter5Complete?'active':'locked'}" id="mapC6" ${state.chapter5Complete?'':'disabled'}><span>🌙</span><div><b>Ch. 6</b><strong>The Midnight Room</strong></div></button><button class="chapter-card ${state.chapter7Complete?'done':state.chapter6Complete?'active':'locked'}" id="mapC7" ${state.chapter6Complete?'':'disabled'}><span>🌅</span><div><b>Ch. 7</b><strong>First Morning</strong></div></button></div></section>`;
  document.querySelectorAll('.map-node.unlocked').forEach(b=>b.onclick=()=>startStep(Number(b.dataset.step)));if(state.phase0Complete)$('mapC1').onclick=showChapter1Intro;if(state.chapter1Complete)$('mapC2').onclick=showChapter2Intro;if(state.chapter2Complete)$('mapC3').onclick=showChapter3Intro;if(state.chapter3Complete)$('mapC4').onclick=showChapter4Intro;if(state.chapter4Complete)$('mapC5').onclick=showChapter5Intro;if(state.chapter5Complete)$('mapC6').onclick=showChapter6Intro;if(state.chapter6Complete)$('mapC7').onclick=showChapter7Intro;setActiveNav('map');
};

storyRoute=function(){if(!state.phase0Complete)return state.introSeen?startStep(state.currentStep):intro();if(!state.chapter1Complete)return showChapter1Intro();if(!state.chapter2Complete)return showChapter2Intro();if(!state.chapter3Complete)return showChapter3Intro();if(!state.chapter4Complete)return showChapter4Intro();if(!state.chapter5Complete)return showChapter5Intro();if(!state.chapter6Complete)return showChapter6Intro();if(!state.chapter7Complete)return showChapter7Intro();return showCampaign();};
qCurrentAdventure=function(){if(!state.phase0Complete)return {eyebrow:'Prólogo',title:'Before the Letter',text:`Escalón ${state.currentStep} de 10`,icon:'🦉✉️',action:()=>state.introSeen?startStep(state.currentStep):intro()};if(!state.chapter1Complete)return {eyebrow:'Chapter 1',title:'The Magic Letter',text:'Tu carta ya llegó',icon:'✉️✨',action:showChapter1Intro};if(!state.chapter2Complete)return {eyebrow:'Chapter 2',title:'Potion Mystery',text:'Hay una botella fuera de lugar',icon:'🧪🔎',action:showChapter2Intro};if(!state.chapter3Complete)return {eyebrow:'Chapter 3',title:'Owl Message',text:'Un papel azul espera en el aula',icon:'🦉📄',action:showChapter3Intro};if(!state.chapter4Complete)return {eyebrow:'Chapter 4',title:'Forest Riddle',text:'El bosque necesita direcciones',icon:'🌲🧭',action:showChapter4Intro};if(!state.chapter5Complete)return {eyebrow:'Chapter 5',title:'Market Day',text:'El picnic necesita comida',icon:'🛍️🧺',action:showChapter5Intro};if(!state.chapter6Complete)return {eyebrow:'Chapter 6',title:'The Midnight Room',text:'Una puerta aparece sólo de noche',icon:'🌙🚪',action:showChapter6Intro};if(!state.chapter7Complete)return {eyebrow:'Chapter 7',title:'First Morning',text:'La primera campana está por sonar',icon:'🌅🎒',action:showChapter7Intro};return {eyebrow:'Campaña',title:'Siete historias completadas',text:'Creature Class está por empezar',icon:'🐾🔍',action:showCampaign};};
const c7OldUpdateHud=updateHud;updateHud=function(){c7OldUpdateHud();ensureC7State();const l=$('levelText');if(l)l.textContent=(state.chapter7Complete?'Ch. 7 ✓':state.chapter6Complete?'Ch. 7':state.chapter5Complete?'Ch. 6':state.chapter4Complete?'Ch. 5':state.chapter3Complete?'Ch. 4':state.chapter2Complete?'Ch. 3':state.chapter1Complete?'Ch. 2':state.phase0Complete?'Ch. 1':`Step ${state.currentStep}`)+` · ${state.totalXp||0} XP`;const sub=$('headerSubtitle');if(sub)sub.textContent=state.chapter7Complete?'Creature Class · next':state.chapter6Complete?'First Morning':state.chapter5Complete?'The Midnight Room':state.chapter4Complete?'Market Day':state.chapter3Complete?'Forest Riddle':state.chapter2Complete?'Owl Message':state.chapter1Complete?'Potion Mystery':state.phase0Complete?'The Magic Letter':'Before the Letter · Zero English';};

window.MEQ_BUILD='1.9.0';updateHud();if(state.lastRoute==='home')showHome();
