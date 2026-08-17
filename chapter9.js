'use strict';

// MVP 1.4 — Chapter 9: The Family Portrait.
// High-frequency people/family vocabulary enters through visible relationships.
// Grammar stays implicit inside useful chunks: "This is my..." and "Who is this?".

const C9_ID='chapter_9_family_portrait';
const C9_EVIDENCE='chapter9Evidence';
const C9_TOTAL=10;
const C9_CHAPTER='🖼️ Chapter 9';

function ensureC9State(){meqEnsureEvidence(C9_EVIDENCE);state.chapter9Scene ||= 1;state.chapter9Complete ||= false;}
function c9SceneData(n){return meqStoryScene(C9_ID,n)||{id:`c9s${n}`,title:`Scene ${n}`,reward_coins:0};}
function c9SetScene(n){ensureC9State();state.chapter9Scene=n;saveState();}
function c9Award(n){const s=c9SceneData(n);meqAwardStory('chapter9',s.id||`scene${n}`,s.reward_coins||0);}
function c9Record(kind,ok,w=1){meqRecordEvidence(C9_EVIDENCE,kind,ok,w);}
function c9Ratios(){return meqEvidenceRatios(C9_EVIDENCE);}
function c9Person(id){
  const map={
    mother:{id:'mother',label:'mother',img:'portrait_mother.svg'},
    father:{id:'father',label:'father',img:'portrait_father.svg'},
    sister:{id:'sister',label:'sister',img:'portrait_sister.svg'},
    brother:{id:'brother',label:'brother',img:'portrait_brother.svg'},
    baby:{id:'baby',label:'baby',img:'portrait_baby.svg'},
    woman:{id:'woman',label:'woman',img:'portrait_mother.svg'},
    man:{id:'man',label:'man',img:'portrait_father.svg'},
    girl:{id:'girl',label:'girl',img:'portrait_sister.svg'},
    boy:{id:'boy',label:'boy',img:'portrait_brother.svg'},
    old:{id:'old',label:'old man',img:'portrait_old_man.svg'}
  };return map[id];
}
function c9Teach(items,scene,onDone){
  meqRuntimeTeachCarousel({chapterLabel:C9_CHAPTER,scene,total:C9_TOTAL,title:c9SceneData(scene).title,items,onDone});
}
function c9Choices(scene,tasks,onDone,help='Primero escuchá. Las relaciones visibles son la pista; el español queda como rescate final.'){
  meqRuntimeListenChoices({stateKey:C9_EVIDENCE,chapterLabel:C9_CHAPTER,scene,total:C9_TOTAL,title:c9SceneData(scene).title,tasks,onDone,help});
}

function showChapter9Intro(){
  ensureC9State();setActiveNav('story');const complete=!!state.chapter9Complete;
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">${complete?'Chapter 9 complete':'Nueva historia desbloqueada'}</div><h1 class="title">Chapter 9 · The Family Portrait</h1><p class="subtitle">${complete?'El retrato volvió a tener sus nombres. Podés repetirlo para memoria y fluidez.':'La tarjeta de Pip entra en un marco antiguo. El marco despierta y muestra una familia que perdió todos sus nombres. Para restaurarla vas a tener que entender quién es quién.'}</p>${meqSceneFrame({backdrop:'portrait_gallery.svg',actors:[{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.43},{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.47}],props:[{src:'family_portrait.svg',alt:'family portrait',pos:'center-letter',motion:'letter-glow',scale:.58}],caption:complete?'The names are back in the frame.':'The old portrait begins to move.',label:'PORTRAIT GALLERY'})}${meqGuideVisual('Acá enseñamos palabras muy de la vida real: mother, father, sister, brother, girl, boy, baby… siempre pegadas a personas y relaciones visibles.')}<div class="scene-skill-row"><span>👀 personas</span><span>👂 roles</span><span>💬 quién</span><span>🎤 presentar</span><span>🧠 describir</span></div><button id="c9Start" class="btn primary wide">${complete?'Jugar de nuevo →':'Despertar el retrato →'}</button>${complete?'<button id="c9Campaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button>':''}</section>`;
  $('c9Start').onclick=c9Scene1Teach;if(complete)$('c9Campaign').onclick=showCampaign;
}

function c9Scene1Teach(){
  c9SetScene(1);c9Teach([
    {id:'family',en:'family',es:'familia',img:'family_portrait.svg'},
    {id:'people',en:'people',es:'personas',img:'family_portrait.svg'}
  ],1,c9Scene1Game);
}
function c9Scene1Game(){
  c9Choices(1,[
    {audio:'Family.',target:'family',choices:[{id:'family',label:'family',img:'family_portrait.svg'},{id:'pip',label:'creature',img:'creature_pip.svg'}],translation:'family = familia'},
    {audio:'People.',target:'people',choices:[{id:'people',label:'people',img:'family_portrait.svg'},{id:'potion',label:'potion',visual:'🧪'}],translation:'people = personas'}
  ],()=>{c9Award(1);c9Scene2Teach();});
}

function c9Scene2Teach(){
  c9SetScene(2);c9Teach([
    {...c9Person('mother'),en:'mother',es:'madre'},
    {...c9Person('father'),en:'father',es:'padre'}
  ],2,c9Scene2Game);
}
function c9Scene2Game(){
  c9Choices(2,[
    {audio:'Find the mother.',target:'mother',choices:[c9Person('mother'),c9Person('father')]},
    {audio:'Find the father.',target:'father',choices:[c9Person('mother'),c9Person('father')]},
    {audio:'This is the mother.',target:'mother',choices:[c9Person('father'),c9Person('mother')]}
  ],()=>{c9Award(2);c9Scene3Teach();});
}

function c9Scene3Teach(){
  c9SetScene(3);c9Teach([
    {...c9Person('sister'),en:'sister',es:'hermana'},
    {...c9Person('brother'),en:'brother',es:'hermano'}
  ],3,c9Scene3Game);
}
function c9Scene3Game(){
  c9Choices(3,[
    {audio:'Sister.',target:'sister',choices:[c9Person('sister'),c9Person('brother')]},
    {audio:'Brother.',target:'brother',choices:[c9Person('sister'),c9Person('brother')]},
    {audio:'This is my sister.',target:'sister',choices:[c9Person('brother'),c9Person('sister')]}
  ],()=>{c9Award(3);c9Scene4Teach();});
}

function c9Scene4Teach(){
  c9SetScene(4);c9Teach([
    {...c9Person('woman'),en:'woman',es:'mujer'},
    {...c9Person('man'),en:'man',es:'hombre'}
  ],4,c9Scene4Game);
}
function c9Scene4Game(){
  c9Choices(4,[
    {audio:'Woman.',target:'woman',choices:[c9Person('woman'),c9Person('man')]},
    {audio:'Man.',target:'man',choices:[c9Person('woman'),c9Person('man')]},
    {audio:'Find the woman.',target:'woman',choices:[c9Person('man'),c9Person('woman')]}
  ],()=>{c9Award(4);c9Scene5Teach();},'Ahora transferimos la idea: una madre también puede reconocerse como woman; un padre como man. No hay definición gramatical.');
}

function c9Scene5Teach(){
  c9SetScene(5);c9Teach([
    {...c9Person('girl'),en:'girl',es:'niña'},
    {...c9Person('boy'),en:'boy',es:'niño'},
    {...c9Person('baby'),en:'baby',es:'bebé'}
  ],5,c9Scene5Game);
}
function c9Scene5Game(){
  c9Choices(5,[
    {audio:'Find the girl.',target:'girl',choices:[c9Person('girl'),c9Person('boy'),c9Person('baby')]},
    {audio:'Find the boy.',target:'boy',choices:[c9Person('girl'),c9Person('boy'),c9Person('baby')]},
    {audio:'Find the baby.',target:'baby',choices:[c9Person('girl'),c9Person('boy'),c9Person('baby')]}
  ],()=>{c9Award(5);c9Scene6();});
}

function c9Scene6(){
  c9SetScene(6);session={...session,c9WhoRound:0};renderC9Who();
}
function renderC9Who(){
  const tasks=[
    {img:'portrait_mother.svg',target:'mother',choices:['mother','sister','baby']},
    {img:'portrait_brother.svg',target:'brother',choices:['father','brother','boy']},
    {img:'portrait_baby.svg',target:'baby',choices:['girl','baby','mother']}
  ];const t=tasks[session.c9WhoRound];if(!t){c9Award(6);return c9Scene7();}
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C9_CHAPTER,6,C9_TOTAL,c9SceneData(6).title)}<span class="game-label">💬 Pregunta + imagen</span><div class="prompt">Milo pregunta. Mirá la persona antes de elegir.</div>${meqImg(t.img,'portrait','c9-focus-portrait')}<button id="c9WhoAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${t.choices.map(id=>`<button class="runtime-choice c9-who-choice" data-id="${id}"><b>${id}</b></button>`).join('')}</div><div id="c9WhoFb" class="feedback"></div>${meqStoryHelp('“Who is this?” se aprende como una pregunta útil completa. No hace falta analizar palabra por palabra.','Who is this? = ¿Quién es?')}</section>`;
  setTimeout(()=>speak('Who is this?'),220);$('c9WhoAudio').onclick=()=>speak('Who is this?');document.querySelectorAll('.c9-who-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c9Record('listening',ok);c9Record('usage',ok);meqRecordUnitTask('who',ok,{dimensions:['listening','usage'],context:`c9s7:who:${session.c9WhoRound}`,mode:'question_transfer'});meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual','usage'],context:`c9s7:family:${t.target}`,mode:'family_identification',distractorId:b.dataset.id});b.classList.add(ok?'correct':'wrong');$('c9WhoFb').className=`feedback ${ok?'good':'soft'}`;$('c9WhoFb').textContent=ok?`✨ This is the ${t.target}.`:'Todavía no. Mirá la relación y probá otra vez.';if(ok){speak(`This is the ${t.target}.`);session.c9WhoRound++;setTimeout(renderC9Who,750)}else playSfx('retry');});
}

function c9Scene7(){
  c9SetScene(7);screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C9_CHAPTER,7,C9_TOTAL,c9SceneData(7).title)}${meqSceneFrame({backdrop:'portrait_gallery.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.48},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.42}],props:[{src:'family_portrait.svg',alt:'family',pos:'center-letter',scale:.52}],caption:'Amanda points to the portrait.',label:'MY FAMILY'})}<p class="subtitle">Amanda modela una frase completa. Después te toca usarla, sin clase de “posesivos”.</p><button id="c9FamilyTalk" class="btn primary wide">Escuchar y responder →</button></section>`;
  $('c9FamilyTalk').onclick=()=>meqDialogueStart({stateKey:C9_EVIDENCE,chapterLabel:C9_CHAPTER,scene:7,total:C9_TOTAL,title:c9SceneData(7).title,help:'Primero escuchá el bloque completo. La respuesta se muestra sólo si la pedís.',turns:[
    {speaker:'amanda',kind:'listen',say:'This is my family.',prompt:'Escuchá a Amanda.'},
    {speaker:'amanda',kind:'listen',say:'This is my sister.',prompt:'Mirá a quién señala.'},
    {speaker:'player',kind:'voice',targetPhrase:'This is my sister.',say:'This is my sister.',prompt:'Ahora usá el mismo bloque con el retrato.'}
  ],onDone:()=>{c9Award(7);c9Scene8Teach();}});
}

function c9Scene8Teach(){
  c9SetScene(8);c9Teach([{...c9Person('old'),en:'old',es:'viejo / mayor'}],8,c9Scene8Game);
}
function c9Scene8Game(){
  c9Choices(8,[
    {audio:'Find the old man.',target:'old',choices:[c9Person('old'),c9Person('father'),c9Person('brother')]},
    {audio:'The woman has red hair.',target:'woman',choices:[c9Person('woman'),c9Person('man'),c9Person('boy')]},
    {audio:'The girl is happy.',target:'girl',choices:[c9Person('girl'),c9Person('boy'),c9Person('old')]}
  ],()=>{c9Award(8);c9Scene9();},'Las descripciones de Creature Class vuelven, pero ahora sirven para reconocer personas. Eso obliga a reutilizar el inglés en otro contexto.');
}

function c9Scene9(){
  c9SetScene(9);screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C9_CHAPTER,9,C9_TOTAL,c9SceneData(9).title)}${meqSceneFrame({backdrop:'portrait_gallery.svg',actors:[{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.43}],props:[{src:'portrait_sister.svg',alt:'sister',pos:'center-letter',scale:.48}],caption:'Milo points to one person.',label:'YOUR TURN'})}<p class="subtitle">La respuesta no aparece escrita de entrada. Intentá reconocer la situación y hablar.</p><button id="c9TellMilo" class="btn primary wide">Responder a Milo →</button></section>`;
  $('c9TellMilo').onclick=()=>meqDialogueStart({stateKey:C9_EVIDENCE,chapterLabel:C9_CHAPTER,scene:9,total:C9_TOTAL,title:c9SceneData(9).title,help:'Si te trabás: primero imagen, después inicio de frase, recién al final el modelo completo.',turns:[
    {speaker:'milo',kind:'response',say:'Who is this?',targetPhrase:'This is my sister.',prompt:'Respondé mirando el retrato.',translation:'¿Quién es?'}
  ],onDone:()=>{c9Award(9);c9Scene10Intro();}});
}

function c9Scene10Intro(){
  c9SetScene(10);const r=c9Ratios();screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C9_CHAPTER,10,C9_TOTAL,c9SceneData(10).title)}<h1 class="title">Restore the Portrait</h1><p class="subtitle">El marco borra los nombres. Vas a restaurar cinco personas sólo por audio y terminar respondiendo una pregunta hablada.</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C9_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div>${meqGuideVisual('No aparece vocabulario nuevo. Si algo sale flojo, hacemos tres micropruebas de esa habilidad y volvemos al final.')}<button id="c9BossStart" class="btn primary wide">Restaurar el retrato →</button></section>`;$('c9BossStart').onclick=c9BossStart;
}
function c9BossStart(){
  session={...session,c9BossScore:0};c9Choices(10,[
    {audio:'Find the mother.',target:'mother',choices:[c9Person('mother'),c9Person('sister'),c9Person('baby')]},
    {audio:'Find the father.',target:'father',choices:[c9Person('father'),c9Person('brother'),c9Person('old')]},
    {audio:'Find the baby.',target:'baby',choices:[c9Person('girl'),c9Person('boy'),c9Person('baby')]},
    {audio:'The sister has red hair.',target:'sister',choices:[c9Person('sister'),c9Person('brother'),c9Person('mother')]},
    {audio:'Find the old man.',target:'old',choices:[c9Person('old'),c9Person('father'),c9Person('brother')]}
  ],c9BossVoice,'Escuchá cada pista como una parte de la historia. Podés repetir, pero el texto no aparece automáticamente.');
}
function c9BossVoice(){
  meqDialogueStart({stateKey:C9_EVIDENCE,chapterLabel:C9_CHAPTER,scene:10,total:C9_TOTAL,title:c9SceneData(10).title,help:'Último paso: una respuesta corta. El modelo aparece sólo si lo pedís.',turns:[{speaker:'milo',kind:'response',say:'Who is this?',targetPhrase:'This is my brother.',prompt:'Mirá al hermano y respondé.',translation:'¿Quién es?'}],onDone:()=>{session.c9BossScore=1;finishC9Boss();}});
}
function finishC9Boss(){
  const r=c9Ratios(),overall=.48*r.listening+.37*r.usage+.15*Math.max(r.speaking,.64);const pass=session.c9BossScore===1&&overall>=.82&&r.listening>=.78&&r.usage>=.76;
  if(pass){state.chapter9Complete=true;saveState();c9Award(10);}
  screen.innerHTML=`<section class="card reward-card scene-card"><div class="big-emoji">${pass?'🖼️✨🏆':'🦊🛠️'}</div><div class="eyebrow">The Family Portrait</div><h1 class="title">${pass?'The portrait is complete!':'Una relación necesita refuerzo'}</h1><p class="subtitle">${pass?'Restauraste una historia usando palabras de familia y personas, preguntas con Who y frases completas como “This is my…”, sin estudiar una tabla.':'No repetimos la historia. Milo prepara sólo tres pruebas sobre la habilidad más floja.'}</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C9_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div><button id="c9ResultNext" class="btn primary wide">${pass?'Ver cierre →':'Refuerzo rápido →'}</button><button id="c9ResultCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;
  $('c9ResultNext').onclick=()=>pass?c9Ending():c9Repair();$('c9ResultCampaign').onclick=showCampaign;
}
function c9Repair(){
  const r=c9Ratios(),skill=r.speaking<.64?'speaking':r.listening<=r.usage?'listening':'usage';
  if(skill==='speaking')return meqRuntimeVoicePrompt({stateKey:C9_EVIDENCE,chapterLabel:C9_CHAPTER,scene:10,total:C9_TOTAL,title:"Milo's Quick Repair",target:'This is my sister.',intro:'Una frase conocida y volvemos al final:',onPass:c9Scene10Intro,onFallback:c9Scene10Intro});
  session={...session,c9Repair:0,c9RepairSkill:skill,c9RepairTasks:[
    {audio:'Find the mother.',target:'mother',choices:[c9Person('mother'),c9Person('father'),c9Person('sister')]},
    {audio:'Find the baby.',target:'baby',choices:[c9Person('baby'),c9Person('girl'),c9Person('boy')]},
    {audio:'Find the old man.',target:'old',choices:[c9Person('old'),c9Person('father'),c9Person('brother')]}
  ]};renderC9Repair();
}
function renderC9Repair(){
  const t=session.c9RepairTasks[session.c9Repair];if(!t)return c9Scene10Intro();screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C9_CHAPTER,10,C9_TOTAL,"Milo's Quick Repair")}<span class="game-label">🛠️ Sólo reforzamos ${session.c9RepairSkill}</span><div class="prompt">Prueba ${session.c9Repair+1}/3.</div><button id="c9RepairAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c9-repair-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c9RepairFb" class="feedback"></div></section>`;setTimeout(()=>speak(t.audio),220);$('c9RepairAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c9-repair-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c9Record(session.c9RepairSkill,ok,2);meqRecordUnitTask(t.target,ok,{dimensions:[session.c9RepairSkill==='usage'?'usage':'listening'],context:`c9repair:${session.c9Repair}:${t.target}`,mode:'adaptive_repair',distractorId:b.dataset.id,weight:1.3});if(session.c9RepairSkill!=='listening')c9Record('listening',true,.3);$('c9RepairFb').className=`feedback ${ok?'good':'soft'}`;$('c9RepairFb').textContent=ok?'✨ Reforzado.':'Escuchala otra vez lento.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.c9Repair++;renderC9Repair()},680);});
}
function c9Ending(){
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 9 complete</div><h1 class="title">The Family Portrait · End</h1>${meqSceneFrame({backdrop:'portrait_gallery.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.45},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.42}],props:[{src:'family_portrait.svg',alt:'family portrait',pos:'center-letter',motion:'letter-glow',scale:.56}],caption:'Every name returns to the frame.',label:'STORY COMPLETE'})}<p class="subtitle">Cuando el último nombre vuelve a su lugar, el marco se abre como una puerta. Detrás hay un mapa con un camino perdido y tres símbolos que ya conocés.</p>${meqGuideVisual('Ya empezamos a usar el mismo inglés en contextos distintos: “has” pasó de criaturas a personas, y “Who is this?” ahora sirve para conversar.')}<div class="chapter-hook"><span>🗺️✨</span><div><b>Next: Chapter 10</b><strong>The Lost Map</strong><small>map · near · far · first · last · place · route</small></div></div><button id="c9EndCampaign" class="btn primary wide" style="margin-top:14px">Volver a la campaña →</button></section>`;$('c9EndCampaign').onclick=showCampaign;
}

if(typeof SONGS!=='undefined'){
  SONGS.family={id:'family',title:'Family Portrait Beat',unlock:()=>!!state.chapter8Complete,icon:'🖼️🎵',phrases:[
    {text:'Mother, father.',visual:'👩 👨',words:['mother','father']},
    {text:'Sister, brother.',visual:'👧 👦',words:['sister','brother']},
    {text:'Girl, boy, baby.',visual:'👧 👦 👶',words:['girl','boy','baby']},
    {text:'This is my family.',visual:'🖼️❤️',words:['this','is','my','family']},
    {text:'Who is this?',visual:'❓🧑',words:['who','is','this']}
  ]};
}

// Direct handoff from Chapter 8 into Chapter 9.
const c9OldC8Ending=c8Ending;
c8Ending=function(){
  if(!state.chapter8Complete)return c9OldC8Ending();
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 8 complete</div><h1 class="title">Creature Class · End</h1>${meqSceneFrame({backdrop:'creature_classroom.svg',actors:[{src:'creature_pip.svg',alt:'Pip',pos:'center-air',scale:.4},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.42}],props:[{src:'family_portrait.svg',alt:'portrait',pos:'center-letter',motion:'letter-glow',scale:.42}],caption:'Pip touches the old frame.',label:'A NEW STORY'})}<p class="subtitle">El marco cambia. Aparece una familia, pero todos los nombres se borran.</p>${meqGuideVisual('La próxima historia usa vocabulario cotidiano de personas y relaciones, con el mismo método visual y auditivo.')}<button id="c8ToC9" class="btn primary wide">Empezar Chapter 9 →</button><button id="c8EndCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;$('c8ToC9').onclick=showChapter9Intro;$('c8EndCampaign').onclick=showCampaign;
};

showCampaign=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();ensureC7State();ensureC8State();ensureC9State();
  const c1=!!state.chapter1Complete,c2=!!state.chapter2Complete,c3=!!state.chapter3Complete,c4=!!state.chapter4Complete,c5=!!state.chapter5Complete,c6=!!state.chapter6Complete,c7=!!state.chapter7Complete,c8=!!state.chapter8Complete,c9=!!state.chapter9Complete;
  const cards=[
    [1,'✉️','The Magic Letter',true,c1,showChapter1Intro],[2,'🧪','Potion Mystery',c1,c2,showChapter2Intro],[3,'🦉','Owl Message',c2,c3,showChapter3Intro],[4,'🌲','Forest Riddle',c3,c4,showChapter4Intro],[5,'🛍️','Market Day',c4,c5,showChapter5Intro],[6,'🌙','The Midnight Room',c5,c6,showChapter6Intro],[7,'🌅','First Morning',c6,c7,showChapter7Intro],[8,'🐾','Creature Class',c7,c8,showChapter8Intro],[9,'🖼️','The Family Portrait',c8,c9,showChapter9Intro]
  ];
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Tu aventura</div><h1 class="title">Nueve historias conectadas</h1><p class="subtitle">La campaña ya reutiliza vocabulario entre lugares, rutinas, criaturas y personas. El objetivo sigue siendo comprensión y uso, no completar pantallas.</p>${meqGuideVisual(c9?'Nueve historias completas. El siguiente bloque va a combinar orientación, secuencias y lectura de un mapa.':c8?'The Family Portrait está abierto.':'Seguí el capítulo activo.')}<div class="chapter-grid">${cards.map(([n,icon,title,unlocked,done])=>`<button class="chapter-card ${done?'done':unlocked?'active':'locked'}" id="campaignC${n}" ${unlocked?'':'disabled'}><span>${icon}</span><div><b>Chapter ${n}</b><strong>${title}</strong><small>${done?'✓ Terminado':unlocked?'Listo para jugar':'🔒 Bloqueado'}</small></div></button>`).join('')}<button class="chapter-card locked" disabled><span>🗺️</span><div><b>Chapter 10</b><strong>The Lost Map</strong><small>${c9?'🔒 Próximo':'🔒 Bloqueado'}</small></div></button></div></section>`;
  cards.forEach(([n,,,,,fn])=>{const el=$(`campaignC${n}`);if(el&&!el.disabled)el.onclick=fn;});setActiveNav('story');
};

showMap=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();ensureC7State();ensureC8State();ensureC9State();
  const cards=[[1,'✉️','The Magic Letter',state.phase0Complete,state.chapter1Complete,showChapter1Intro],[2,'🧪','Potion Mystery',state.chapter1Complete,state.chapter2Complete,showChapter2Intro],[3,'🦉','Owl Message',state.chapter2Complete,state.chapter3Complete,showChapter3Intro],[4,'🌲','Forest Riddle',state.chapter3Complete,state.chapter4Complete,showChapter4Intro],[5,'🛍️','Market Day',state.chapter4Complete,state.chapter5Complete,showChapter5Intro],[6,'🌙','The Midnight Room',state.chapter5Complete,state.chapter6Complete,showChapter6Intro],[7,'🌅','First Morning',state.chapter6Complete,state.chapter7Complete,showChapter7Intro],[8,'🐾','Creature Class',state.chapter7Complete,state.chapter8Complete,showChapter8Intro],[9,'🖼️','Family Portrait',state.chapter8Complete,state.chapter9Complete,showChapter9Intro]];
  screen.innerHTML=`<section class="card"><div class="eyebrow">Prólogo</div><h1 class="title">Before the Letter</h1><p class="subtitle">Diez escalones antes de la campaña.</p><div class="quest-map">${MAP.map((n,i)=>{const step=i+1,unlock=step<=state.unlockedStep,current=step===state.currentStep,d=stageData(step);return `<button class="map-node ${unlock?'unlocked':'locked'} ${current?'current':''}" data-step="${step}" ${unlock?'':'disabled'}><div class="node-num">${d.mastered?'✓':step}</div><div><div class="node-title">${n[0]}</div><div class="node-sub">${n[1]}</div></div><div class="node-badge">${unlock?n[2]:'🔒'}</div></button>`}).join('')}</div></section><section class="card"><div class="eyebrow">Campaña</div><h2 style="margin:5px 0">Historias</h2><div class="chapter-grid compact">${cards.map(([n,icon,title,unlocked,done])=>`<button class="chapter-card ${done?'done':unlocked?'active':'locked'}" id="mapC${n}" ${unlocked?'':'disabled'}><span>${icon}</span><div><b>Ch. ${n}</b><strong>${title}</strong></div></button>`).join('')}</div></section>`;
  document.querySelectorAll('.map-node.unlocked').forEach(b=>b.onclick=()=>startStep(Number(b.dataset.step)));cards.forEach(([n,,,,,fn])=>{const el=$(`mapC${n}`);if(el&&!el.disabled)el.onclick=fn;});setActiveNav('map');
};

storyRoute=function(){if(!state.phase0Complete)return state.introSeen?startStep(state.currentStep):intro();if(!state.chapter1Complete)return showChapter1Intro();if(!state.chapter2Complete)return showChapter2Intro();if(!state.chapter3Complete)return showChapter3Intro();if(!state.chapter4Complete)return showChapter4Intro();if(!state.chapter5Complete)return showChapter5Intro();if(!state.chapter6Complete)return showChapter6Intro();if(!state.chapter7Complete)return showChapter7Intro();if(!state.chapter8Complete)return showChapter8Intro();if(!state.chapter9Complete)return showChapter9Intro();return showCampaign();};
qCurrentAdventure=function(){if(!state.phase0Complete)return {eyebrow:'Prólogo',title:'Before the Letter',text:`Escalón ${state.currentStep} de 10`,icon:'🦉✉️',action:()=>state.introSeen?startStep(state.currentStep):intro()};if(!state.chapter1Complete)return {eyebrow:'Chapter 1',title:'The Magic Letter',text:'Tu carta ya llegó',icon:'✉️✨',action:showChapter1Intro};if(!state.chapter2Complete)return {eyebrow:'Chapter 2',title:'Potion Mystery',text:'Hay una botella fuera de lugar',icon:'🧪🔎',action:showChapter2Intro};if(!state.chapter3Complete)return {eyebrow:'Chapter 3',title:'Owl Message',text:'Un papel azul espera en el aula',icon:'🦉📄',action:showChapter3Intro};if(!state.chapter4Complete)return {eyebrow:'Chapter 4',title:'Forest Riddle',text:'El bosque necesita direcciones',icon:'🌲🧭',action:showChapter4Intro};if(!state.chapter5Complete)return {eyebrow:'Chapter 5',title:'Market Day',text:'El picnic necesita comida',icon:'🛍️🧺',action:showChapter5Intro};if(!state.chapter6Complete)return {eyebrow:'Chapter 6',title:'The Midnight Room',text:'Una puerta aparece sólo de noche',icon:'🌙🚪',action:showChapter6Intro};if(!state.chapter7Complete)return {eyebrow:'Chapter 7',title:'First Morning',text:'La primera campana está por sonar',icon:'🌅🎒',action:showChapter7Intro};if(!state.chapter8Complete)return {eyebrow:'Chapter 8',title:'Creature Class',text:'Pip necesita que lo reconozcas',icon:'🐾👁️',action:showChapter8Intro};if(!state.chapter9Complete)return {eyebrow:'Chapter 9',title:'The Family Portrait',text:'El retrato perdió todos sus nombres',icon:'🖼️👨‍👩‍👧‍👦',action:showChapter9Intro};return {eyebrow:'Campaña',title:'Nueve historias completadas',text:'The Lost Map está por empezar',icon:'🗺️✨',action:showCampaign};};
const c9OldUpdateHud=updateHud;updateHud=function(){c9OldUpdateHud();ensureC9State();const l=$('levelText');if(l)l.textContent=(state.chapter9Complete?'Ch. 9 ✓':state.chapter8Complete?'Ch. 9':state.chapter7Complete?'Ch. 8':state.chapter6Complete?'Ch. 7':state.chapter5Complete?'Ch. 6':state.chapter4Complete?'Ch. 5':state.chapter3Complete?'Ch. 4':state.chapter2Complete?'Ch. 3':state.chapter1Complete?'Ch. 2':state.phase0Complete?'Ch. 1':`Step ${state.currentStep}`)+` · ${state.totalXp||0} XP`;const sub=$('headerSubtitle');if(sub)sub.textContent=state.chapter9Complete?'The Lost Map · next':state.chapter8Complete?'The Family Portrait':state.chapter7Complete?'Creature Class':state.chapter6Complete?'First Morning':state.chapter5Complete?'The Midnight Room':state.chapter4Complete?'Market Day':state.chapter3Complete?'Forest Riddle':state.chapter2Complete?'Owl Message':state.chapter1Complete?'Potion Mystery':state.phase0Complete?'The Magic Letter':'Before the Letter · Zero English';};

window.MEQ_BUILD='1.9.0';updateHud();if(state.lastRoute==='home')showHome();
