'use strict';

// MVP 1.3 — Chapter 8: Creature Class.
// Body vocabulary is anchored to visible creature anatomy, then recombined with
// known colors, sizes and numbers. "Has" is learned as a whole useful chunk.

const C8_ID='chapter_8_creature_class';
const C8_EVIDENCE='chapter8Evidence';
const C8_TOTAL=10;
const C8_CHAPTER='🐾 Chapter 8';

function ensureC8State(){
  meqEnsureEvidence(C8_EVIDENCE);
  state.chapter8Scene ||= 1;
  state.chapter8Complete ||= false;
}
function c8SceneData(n){return meqStoryScene(C8_ID,n)||{title:`Scene ${n}`,reward_coins:0};}
function c8SetScene(n){ensureC8State();state.chapter8Scene=n;saveState();}
function c8Award(n){const s=c8SceneData(n);meqAwardStory('chapter8',s.id||`scene${n}`,s.reward_coins||0);}
function c8Record(kind,ok,w=1){meqRecordEvidence(C8_EVIDENCE,kind,ok,w);}
function c8Ratios(){return meqEvidenceRatios(C8_EVIDENCE);}

const C8_PARTS={
  head:{en:'head',es:'cabeza',visual:'🙂',pos:'p-head'},
  eye:{en:'eye',es:'ojo',visual:'👁️',pos:'p-eye'},
  ear:{en:'ear',es:'oreja',visual:'👂',pos:'p-ear'},
  mouth:{en:'mouth',es:'boca',visual:'👄',pos:'p-mouth'},
  arm:{en:'arm',es:'brazo',visual:'💪',pos:'p-arm'},
  hand:{en:'hand',es:'mano',visual:'🖐️',pos:'p-hand'},
  leg:{en:'leg',es:'pierna',visual:'🦵',pos:'p-leg'},
  foot:{en:'foot',es:'pie',visual:'🦶',pos:'p-foot'},
  hair:{en:'hair',es:'pelo',visual:'〰️',pos:'p-hair'}
};
function c8Part(id){const p=C8_PARTS[id];return {id,label:p.en,en:p.en,es:p.es,visual:p.visual};}
function c8Creature(id){
  const map={
    pip:{id:'pip',label:'Pip',img:'creature_pip.svg'},
    luma:{id:'luma',label:'Luma',img:'creature_luma.svg'},
    nox:{id:'nox',label:'Nox',img:'creature_nox.svg'},
    moss:{id:'moss',label:'Moss',img:'creature_moss.svg'}
  };return map[id];
}
function c8BodyStage(active='',interactive=false){
  const buttons=Object.entries(C8_PARTS).map(([id,p])=>`<button class="creature-hotspot ${p.pos} ${active===id?'spotlight':''}" data-id="${id}" aria-label="${p.en}"><span>${interactive?'':'•'}</span></button>`).join('');
  return `<div class="creature-body-stage">${meqImg('creature_pip.svg','Pip','creature-body-img')}${buttons}</div>`;
}
function c8TeachParts(parts,scene,title,onDone){
  session={...session,c8Teach:{parts,index:0,scene,title,onDone}};renderC8TeachPart();
}
function renderC8TeachPart(){
  const rt=session.c8Teach;if(!rt)return;const id=rt.parts[rt.index],p=C8_PARTS[id];window.MEQPedagogy?.present(id,'chapter8',`c8:teach:${rt.scene}:${rt.index}`);
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C8_CHAPTER,rt.scene,C8_TOTAL,rt.title)}<span class="game-label">👀 Mirá + 👂 escuchá</span>${c8BodyStage(id,false)}<div id="c8TeachWritten" class="big-word hidden">${p.en.toUpperCase()}</div><button id="c8TeachAudio" class="sound-orb">🔊</button><p class="instruction">La palabra aparece pegada a una parte visible. Después desaparece y tenés que encontrarla sólo por sonido.</p><div class="btn-row"><button id="c8TeachReveal" class="btn secondary">🔤 Ver palabra</button><button id="c8TeachHelp" class="btn secondary">💡 Ayuda</button><button id="c8TeachNext" class="btn primary">${rt.index===rt.parts.length-1?'Ahora sin texto →':'Siguiente →'}</button></div><div id="c8TeachHelpBox" class="help-box hidden"></div></section>`;
  setTimeout(()=>speak(p.en),200);$('c8TeachAudio').onclick=()=>speak(p.en);$('c8TeachReveal').onclick=()=>{$('c8TeachWritten').classList.remove('hidden');$('c8TeachReveal').disabled=true};$('c8TeachHelp').onclick=()=>{session.help=session.help||0;progressiveHelp(p,'c8TeachHelpBox')};
  $('c8TeachNext').onclick=()=>{if(rt.index<rt.parts.length-1){rt.index++;renderC8TeachPart()}else{const done=rt.onDone;session.c8Teach=null;done?.()}};
}
function c8FindParts(tasks,scene,title,onDone){session={...session,c8Find:{tasks,index:0,scene,title,onDone}};renderC8FindPart();}
function renderC8FindPart(){
  const rt=session.c8Find;if(!rt)return;if(rt.index>=rt.tasks.length){const done=rt.onDone;session.c8Find=null;return done?.();}
  const t=rt.tasks[rt.index];
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C8_CHAPTER,rt.scene,C8_TOTAL,rt.title)}<span class="game-label">👂 Escuchá + 🔎 encontrá</span><div class="prompt">La palabra ya no está escrita. Tocá la parte que escuchás.</div><button id="c8FindAudio" class="sound-orb">🔊</button>${c8BodyStage('',true)}<div id="c8FindFb" class="feedback"></div>${meqStoryHelp('Primero escuchá. Si falla, Milo repite lento y la zona correcta pulsa una vez.',t.translation||'')}</section>`;
  setTimeout(()=>speak(t.audio),220);$('c8FindAudio').onclick=()=>speak(t.audio);
  document.querySelectorAll('.creature-hotspot').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.id===t.target;c8Record('listening',ok);c8Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual','usage'],context:`c8:body_find:${rt.scene}:${t.target}`,mode:'body_hotspot',distractorId:b.dataset.id});document.querySelectorAll('.creature-hotspot').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('c8FindFb').className=`feedback ${ok?'good':'soft'}`;$('c8FindFb').textContent=ok?'✨ Sí. Sonido y parte del cuerpo conectados.':'Todavía no. Escuchá lento y mirá el pulso.';
    if(ok){playSfx('success');rt.index++;setTimeout(renderC8FindPart,700)}else{playSfx('retry');speak(t.audio,true);const target=document.querySelector(`.creature-hotspot[data-id="${t.target}"]`);target?.classList.add('spotlight');setTimeout(renderC8FindPart,1000)}
  });
}

function showChapter8Intro(){
  ensureC8State();setActiveNav('story');const complete=!!state.chapter8Complete;
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">${complete?'Chapter 8 complete':'Nueva historia desbloqueada'}</div><h1 class="title">Chapter 8 · Creature Class</h1><p class="subtitle">${complete?'Pip ya volvió a su rincón. Podés repetir la clase para ganar fluidez, no dinero otra vez.':'La primera clase del día no tiene pupitres normales. Cuatro criaturas cambian de forma, y una de ellas —Pip— va a necesitar que la reconozcas sólo por lo que ves y escuchás.'}</p>${meqSceneFrame({backdrop:'creature_classroom.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.50},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.47},{src:'creature_pip.svg',alt:'Pip',pos:'center-air',motion:'gentle-bob',scale:.43}],caption:complete?'Creature Class complete.':'Pip blinks three times.',label:'CREATURE CLASS'})}${meqGuideVisual('Acá el inglés vuelve a entrar por los ojos: primero ves head, eye, ear, hand... Después los combinamos con números, colores y tamaños que ya conocés.')}<div class="scene-skill-row"><span>👀 cuerpo</span><span>🔢 cantidades</span><span>🎨 colores</span><span>👂 descripción</span><span>🎤 hablar</span></div><button id="c8Start" class="btn primary wide">${complete?'Jugar de nuevo →':'Conocer a Pip →'}</button>${complete?'<button id="c8Campaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button>':''}</section>`;
  $('c8Start').onclick=c8Scene1Teach;if(complete)$('c8Campaign').onclick=showCampaign;
}

function c8Scene1Teach(){c8SetScene(1);c8TeachParts(['head','eye'],1,c8SceneData(1).title,c8Scene1Game);}
function c8Scene1Game(){c8FindParts([{audio:'Find the eye.',target:'eye',translation:'eye = ojo'},{audio:'Find the head.',target:'head',translation:'head = cabeza'}],1,c8SceneData(1).title,()=>{c8Award(1);c8Scene2Teach()});}
function c8Scene2Teach(){c8SetScene(2);c8TeachParts(['ear','mouth'],2,c8SceneData(2).title,c8Scene2Game);}
function c8Scene2Game(){c8FindParts([{audio:'Find the ear.',target:'ear',translation:'ear = oreja'},{audio:'Find the mouth.',target:'mouth',translation:'mouth = boca'}],2,c8SceneData(2).title,()=>{c8Award(2);c8Scene3Teach()});}
function c8Scene3Teach(){c8SetScene(3);c8TeachParts(['arm','hand'],3,c8SceneData(3).title,c8Scene3Game);}
function c8Scene3Game(){c8FindParts([{audio:'Find the hand.',target:'hand',translation:'hand = mano'},{audio:'Find the arm.',target:'arm',translation:'arm = brazo'}],3,c8SceneData(3).title,()=>{c8Award(3);c8Scene4Teach()});}
function c8Scene4Teach(){c8SetScene(4);c8TeachParts(['leg','foot'],4,c8SceneData(4).title,c8Scene4Game);}
function c8Scene4Game(){c8FindParts([{audio:'Find the foot.',target:'foot',translation:'foot = pie'},{audio:'Find the leg.',target:'leg',translation:'leg = pierna'}],4,c8SceneData(4).title,()=>{c8Award(4);c8Scene5Teach()});}

function c8Scene5Teach(){
  c8SetScene(5);c8TeachParts(['hair'],5,c8SceneData(5).title,c8Scene5Game);
}
function c8Scene5Game(){
  meqRuntimeListenChoices({stateKey:C8_EVIDENCE,chapterLabel:C8_CHAPTER,scene:5,total:C8_TOTAL,title:c8SceneData(5).title,help:'El pelo cambia de color. No hace falta traducir: buscá el rasgo que coincide con la voz.',tasks:[
    {audio:'Find blue hair.',target:'pip',choices:[c8Creature('pip'),c8Creature('luma'),c8Creature('moss')]},
    {audio:'Find red hair.',target:'luma',choices:[c8Creature('pip'),c8Creature('luma'),c8Creature('moss')]},
    {audio:'Find green hair.',target:'moss',choices:[c8Creature('pip'),c8Creature('luma'),c8Creature('moss')]}
  ],onDone:()=>{c8Award(5);c8Scene6Teach();}});
}

function c8Scene6Teach(){
  c8SetScene(6);session={...session,c8HasIndex:0};renderC8HasTeach();
}
function renderC8HasTeach(){
  const examples=[
    {img:'creature_nox.svg',text:'It has one eye.',help:'has = tiene'},
    {img:'creature_luma.svg',text:'It has two eyes.',help:'has = tiene'},
    {img:'creature_pip.svg',text:'It has three eyes.',help:'has = tiene'},
    {img:'creature_pip.svg',text:'It has two arms.',help:'has = tiene'}
  ],x=examples[session.c8HasIndex];window.MEQPedagogy?.present('has','chapter8',`c8s6:has:${session.c8HasIndex}`);
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C8_CHAPTER,6,C8_TOTAL,c8SceneData(6).title)}<span class="game-label">👀 Patrón visible + 👂 frase completa</span><div class="has-demo-card">${meqImg(x.img,'creature','has-demo-creature')}<div class="has-demo-count">${x.text}</div></div><button id="c8HasAudio" class="sound-orb">🔊</button><p class="instruction">No explicamos una regla. Mirá qué posee cada criatura y escuchá la frase completa.</p><div class="btn-row"><button id="c8HasHelp" class="btn secondary">💡 Ayuda</button><button id="c8HasNext" class="btn primary">${session.c8HasIndex===examples.length-1?'Ahora sólo escucho →':'Siguiente →'}</button></div><div id="c8HasHelpBox" class="help-box hidden"></div></section>`;
  setTimeout(()=>speak(x.text),200);$('c8HasAudio').onclick=()=>speak(x.text);$('c8HasHelp').onclick=()=>{window.MEQPedagogy?.recordHelp('has',Math.min(4,(session.meqHelpLevel||0)+1),'chapter8','c8s6:has_help');session.meqHelpLevel=Math.min(4,(session.meqHelpLevel||0)+1);$('c8HasHelpBox').textContent=session.meqHelpLevel<4?'Mirá qué cambia en la criatura y escuchá de nuevo.':`🇦🇷 ${x.help}. Lo importante es entender el bloque completo.`;$('c8HasHelpBox').classList.remove('hidden')};$('c8HasNext').onclick=()=>{if(session.c8HasIndex<examples.length-1){session.c8HasIndex++;renderC8HasTeach()}else c8Scene6Game()};
}
function c8Scene6Game(){
  meqRuntimeListenChoices({stateKey:C8_EVIDENCE,chapterLabel:C8_CHAPTER,scene:6,total:C8_TOTAL,title:c8SceneData(6).title,help:'Contá lo que ves. “It has…” funciona como una sola llave para describir.',tasks:[
    {audio:'It has one eye.',target:'nox',choices:[c8Creature('nox'),c8Creature('luma'),c8Creature('pip')]},
    {audio:'It has two eyes.',target:'luma',choices:[c8Creature('nox'),c8Creature('luma'),c8Creature('pip')]},
    {audio:'It has three eyes.',target:'pip',choices:[c8Creature('nox'),c8Creature('luma'),c8Creature('pip')]}
  ],onDone:()=>{c8Award(6);c8Scene7();}});
}

function c8Scene7(){
  c8SetScene(7);session={...session,c8BuildIndex:0,c8Build:{head:0,eye:0,arm:0,leg:0,hair:''}};renderC8Builder();
}
function c8BuilderModelHtml(){
  const b=session.c8Build||{};return `<div class="creature-build-model"><div class="build-hair ${b.hair||''}">${b.hair?'〰️〰️〰️':'?'}</div><div class="build-head">${b.head?'🙂':'○'}<div class="build-eyes">${'👁️'.repeat(b.eye||0)}</div></div><div class="build-limbs"><span>${'💪'.repeat(b.arm||0)}</span><span>${'🦵'.repeat(b.leg||0)}</span></div></div>`;
}
function renderC8Builder(){
  const tasks=[
    {audio:'It has one head.',key:'head',target:'1',choices:['1','2','3']},
    {audio:'It has three eyes.',key:'eye',target:'3',choices:['1','2','3']},
    {audio:'It has two arms.',key:'arm',target:'2',choices:['1','2','3']},
    {audio:'It has two legs.',key:'leg',target:'2',choices:['1','2','3']},
    {audio:'It has blue hair.',key:'hair',target:'blue',choices:['blue','red','green']}
  ];const t=tasks[session.c8BuildIndex];if(!t){c8Award(7);return c8Scene8();}
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C8_CHAPTER,7,C8_TOTAL,c8SceneData(7).title)}<span class="game-label">🧩 Construí desde el audio</span><div class="prompt">Paso ${session.c8BuildIndex+1}/5. Escuchá y agregá lo correcto.</div><button id="c8BuildAudio" class="sound-orb">🔊</button>${c8BuilderModelHtml()}<div class="builder-options">${t.choices.map(v=>`<button class="builder-option ${['blue','red','green'].includes(v)?`color-${v}`:''}" data-v="${v}">${['blue','red','green'].includes(v)?'●':v}</button>`).join('')}</div><div id="c8BuildFb" class="feedback"></div>${meqStoryHelp('Una repetición es gratis. Si falla, mostramos un indicador de cantidad o color; no traducimos toda la frase.')}</section>`;
  setTimeout(()=>speak(t.audio),220);$('c8BuildAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.builder-option').forEach(b=>b.onclick=()=>{const ok=b.dataset.v===t.target;c8Record('listening',ok,1.2);c8Record('usage',ok,1.2);meqRecordTextUnits(t.audio,ok,{dimensions:['listening','usage'],context:`c8s7:builder:${session.c8BuildIndex}`,mode:'description_build',weight:1.2});if(ok){session.c8Build[t.key]=['head','eye','arm','leg'].includes(t.key)?Number(t.target):t.target;playSfx('success');$('c8BuildFb').className='feedback good';$('c8BuildFb').textContent='✨ La criatura cambia para coincidir con la frase.';session.c8BuildIndex++;setTimeout(renderC8Builder,650)}else{playSfx('retry');$('c8BuildFb').className='feedback soft';$('c8BuildFb').textContent='No coincide con la descripción. Escuchá otra vez.';speak(t.audio,true)}});
}

function c8Scene8(){
  c8SetScene(8);meqRuntimeListenChoices({stateKey:C8_EVIDENCE,chapterLabel:C8_CHAPTER,scene:8,total:C8_TOTAL,title:c8SceneData(8).title,help:'Las etiquetas desaparecen. Usá tamaño, pelo y cantidad de ojos como pistas acumuladas.',tasks:[
    {audio:'It is small. It has three eyes. It has blue hair.',target:'pip',choices:[c8Creature('pip'),c8Creature('luma'),c8Creature('nox'),c8Creature('moss')]},
    {audio:'It has one eye.',target:'nox',choices:[c8Creature('pip'),c8Creature('luma'),c8Creature('nox')]},
    {audio:'It has two eyes. It has red hair.',target:'luma',choices:[c8Creature('pip'),c8Creature('luma'),c8Creature('moss')]}
  ],onDone:()=>{c8Award(8);c8Scene9();}});
}

function c8Scene9(){
  c8SetScene(9);screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C8_CHAPTER,9,C8_TOTAL,c8SceneData(9).title)}${meqSceneFrame({backdrop:'creature_classroom.svg',actors:[{src:'teacher.svg',alt:'Teacher',pos:'left-ground',scale:.46},{src:'creature_pip.svg',alt:'Pip',pos:'center-air',scale:.40},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.42}],caption:'The teacher covers the creature card.',label:'YOUR TURN'})}<p class="subtitle">La profesora pregunta primero. La frase de respuesta queda escondida salvo que la necesites.</p><button id="c8TalkTeacher" class="btn primary wide">Hablar con la profesora →</button></section>`;
  $('c8TalkTeacher').onclick=()=>meqDialogueStart({stateKey:C8_EVIDENCE,chapterLabel:C8_CHAPTER,scene:9,total:C8_TOTAL,title:c8SceneData(9).title,help:'Intentá responder sin texto. Si te trabás, pedí una pista y la ayuda crece de a poco.',turns:[
    {speaker:'teacher',kind:'response',say:'What do you see?',targetPhrase:'I see three eyes.',prompt:'Mirá a Pip y respondé sin modelo si podés.',translation:'What do you see? = ¿Qué ves?'},
    {speaker:'teacher',kind:'listen',say:'Good!',prompt:'Escuchá la reacción.'},
    {speaker:'player',kind:'voice',targetPhrase:'It has blue hair.',say:'It has blue hair.',prompt:'Ahora describí un rasgo de Pip.'}
  ],onDone:()=>{c8Award(9);c8Scene10Intro();}});
}

function c8Scene10Intro(){
  c8SetScene(10);const r=c8Ratios();screen.innerHTML=`<section class="card hero-card scene-card">${meqStoryHeader(C8_CHAPTER,10,C8_TOTAL,c8SceneData(10).title)}<h1 class="title">Find Pip</h1><p class="subtitle">Se apagan las luces por un segundo y las criaturas cambian de lugar. Para terminar la historia tenés que reconocer a Pip por una descripción completa y decir una pista en voz alta.</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C8_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div>${meqGuideVisual('Nada nuevo aparece en el final. Si una parte falla, reforzamos sólo esa habilidad y volvemos a intentarlo.')}<button id="c8BossStart" class="btn primary wide">Empezar final →</button></section>`;$('c8BossStart').onclick=c8BossStart;
}
function c8BossStart(){
  session={...session,c8BossScore:0};meqRuntimeListenChoices({stateKey:C8_EVIDENCE,chapterLabel:C8_CHAPTER,scene:10,total:C8_TOTAL,title:c8SceneData(10).title,help:'Escuchá la descripción como una escena completa. Podés repetir; no aparece traducción automática.',tasks:[
    {audio:'Pip is small. It has one head. It has three eyes. It has two arms. It has two legs. It has blue hair. Find Pip.',target:'pip',choices:[c8Creature('pip'),c8Creature('luma'),c8Creature('nox'),c8Creature('moss')]},
    {audio:'It has one eye.',target:'nox',choices:[c8Creature('pip'),c8Creature('nox'),c8Creature('luma')]},
    {audio:'It has two eyes. It has red hair.',target:'luma',choices:[c8Creature('pip'),c8Creature('luma'),c8Creature('moss')]}
  ],onDone:c8BossVoice});
}
function c8BossVoice(){
  meqDialogueStart({stateKey:C8_EVIDENCE,chapterLabel:C8_CHAPTER,scene:10,total:C8_TOTAL,title:c8SceneData(10).title,help:'Último paso: describí una pista. El modelo sólo aparece si lo pedís.',turns:[{speaker:'teacher',kind:'response',say:'What do you see?',targetPhrase:'It has three eyes.',prompt:'Respondé con una pista sobre Pip.',translation:'¿Qué ves?'}],onDone:()=>{session.c8BossScore=1;finishC8Boss();}});
}
function finishC8Boss(){
  const r=c8Ratios(),overall=.47*r.listening+.37*r.usage+.16*Math.max(r.speaking,.64);const pass=session.c8BossScore===1&&overall>=.82&&r.listening>=.77&&r.usage>=.75;
  if(pass){state.chapter8Complete=true;saveState();c8Award(10);}
  screen.innerHTML=`<section class="card reward-card scene-card"><div class="big-emoji">${pass?'🐾✨🏆':'🦊🛠️'}</div><div class="eyebrow">Creature Class</div><h1 class="title">${pass?'You found Pip!':'Una pista necesita refuerzo'}</h1><p class="subtitle">${pass?'Terminaste una historia usando partes del cuerpo, cantidades, colores y descripciones completas sin una clase de gramática.':'No repetimos Creature Class. Milo prepara tres pruebas cortas sobre la habilidad más floja y volvés al final.'}</p><div class="mastery-grid"><div><b>${pct(r.listening)}%</b><small>escucha</small></div><div><b>${pct(r.usage)}%</b><small>uso</small></div><div><b>${pct(r.speaking)}%</b><small>voz</small></div><div><b>${meqEnsureEvidence(C8_EVIDENCE).helpUses||0}</b><small>ayudas</small></div></div><button id="c8ResultNext" class="btn primary wide">${pass?'Ver final →':'Refuerzo rápido →'}</button><button id="c8ResultCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;
  $('c8ResultNext').onclick=()=>pass?c8Ending():c8Repair();$('c8ResultCampaign').onclick=showCampaign;
}
function c8Repair(){
  const r=c8Ratios(),skill=r.speaking<.64?'speaking':r.listening<=r.usage?'listening':'usage';
  if(skill==='speaking')return meqRuntimeVoicePrompt({stateKey:C8_EVIDENCE,chapterLabel:C8_CHAPTER,scene:10,total:C8_TOTAL,title:"Milo's Quick Repair",target:'It has three eyes.',intro:'Una frase conocida y volvemos al final:',onPass:c8Scene10Intro,onFallback:c8Scene10Intro});
  session={...session,c8Repair:0,c8RepairSkill:skill,c8RepairTasks:[
    {audio:'Find the eye.',target:'eye',choices:[c8Part('eye'),c8Part('ear'),c8Part('mouth')]},
    {audio:'Find the hand.',target:'hand',choices:[c8Part('hand'),c8Part('foot'),c8Part('head')]},
    {audio:'It has three eyes.',target:'pip',choices:[c8Creature('pip'),c8Creature('luma'),c8Creature('nox')]}
  ]};renderC8Repair();
}
function renderC8Repair(){
  const t=session.c8RepairTasks[session.c8Repair];if(!t)return c8Scene10Intro();
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(C8_CHAPTER,10,C8_TOTAL,"Milo's Quick Repair")}<span class="game-label">🛠️ Sólo reforzamos ${session.c8RepairSkill}</span><div class="prompt">Tres pruebas. No repetimos la historia.</div><button id="c8RepairAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice c8-repair-choice" data-id="${c.id}">${meqChoiceVisual(c)}</button>`).join('')}</div><div id="c8RepairFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c8RepairAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c8-repair-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c8Record(session.c8RepairSkill,ok,2);meqRecordUnitTask(t.target,ok,{dimensions:[session.c8RepairSkill==='usage'?'usage':'listening'],context:`c8repair:${session.c8Repair}:${t.target}`,mode:'adaptive_repair',distractorId:b.dataset.id,weight:1.3});if(session.c8RepairSkill!=='listening')c8Record('listening',true,.3);$('c8RepairFb').className=`feedback ${ok?'good':'soft'}`;$('c8RepairFb').textContent=ok?'✨ Reforzado.':'La repetimos lenta.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.c8Repair++;renderC8Repair()},680)});
}
function c8Ending(){
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 8 complete</div><h1 class="title">Creature Class · End</h1>${meqSceneFrame({backdrop:'creature_classroom.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.48},{src:'creature_pip.svg',alt:'Pip',pos:'center-air',motion:'gentle-bob',scale:.42},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.44}],caption:'Pip curls up safely beside the classroom window.',label:'STORY COMPLETE'})}<p class="subtitle">La profesora guarda una tarjeta con el dibujo de Pip dentro de un marco antiguo. El marco cambia y muestra una familia desconocida que parece estar esperando una respuesta.</p>${meqGuideVisual('Acabás de usar “It has…” sin estudiar una tabla. Ésa es exactamente nuestra gramática escondida: primero funciona, después algún día podremos ponerle nombre si hace falta.')}<div class="chapter-hook"><span>🖼️👨‍👩‍👧‍👦</span><div><b>Next: Chapter 9</b><strong>The Family Portrait</strong><small>mother · father · sister · brother · family · people</small></div></div><button id="c8EndCampaign" class="btn primary wide" style="margin-top:14px">Volver a la campaña →</button></section>`;$('c8EndCampaign').onclick=showCampaign;
}

if(typeof SONGS!=='undefined'){
  SONGS.creature={id:'creature',title:'Creature Body Beat',unlock:()=>!!state.chapter7Complete,icon:'🐾🎵',phrases:[
    {text:'Head, eye, ear.',visual:'🙂👁️👂',words:['head','eye','ear']},
    {text:'Mouth and hand.',visual:'👄🖐️',words:['mouth','hand']},
    {text:'Arm, leg, foot.',visual:'💪🦵🦶',words:['arm','leg','foot']},
    {text:'It has three eyes.',visual:'👁️👁️👁️',words:['it','has','three','eye']},
    {text:'It has blue hair.',visual:'〰️🔵',words:['it','has','blue','hair']}
  ]};
}

// Chapter 7 can now continue directly into the creature class.
const c8OldC7Ending=c7Ending;
c7Ending=function(){
  if(!state.chapter7Complete)return c8OldC7Ending();
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 7 complete</div><h1 class="title">First Morning · End</h1>${meqSceneFrame({backdrop:'academy_morning.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.58},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.52}],props:[{src:'school_bag.svg',alt:'school bag',pos:'center-letter',scale:.22}],caption:'The bell rings as you reach the academy.',label:'STORY COMPLETE'})}<p class="subtitle">La puerta de la primera clase se abre. Algo pequeño, peludo y de tres ojos asoma desde una canasta.</p>${meqGuideVisual('La próxima historia usa el cuerpo de criaturas originales para enseñar vocabulario visual sin salir de la aventura.')}<button id="c7ToC8" class="btn primary wide">Empezar Chapter 8 →</button><button id="c7EndCampaign" class="btn secondary wide" style="margin-top:9px">Ver campaña</button></section>`;
  $('c7ToC8').onclick=showChapter8Intro;$('c7EndCampaign').onclick=showCampaign;
};

showCampaign=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();ensureC7State();ensureC8State();
  const c1=!!state.chapter1Complete,c2=!!state.chapter2Complete,c3=!!state.chapter3Complete,c4=!!state.chapter4Complete,c5=!!state.chapter5Complete,c6=!!state.chapter6Complete,c7=!!state.chapter7Complete,c8=!!state.chapter8Complete;
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Tu aventura</div><h1 class="title">La historia crece con el inglés que ya dominás</h1><p class="subtitle">La campaña ahora mezcla acciones, lugares, compras, lectura, rutinas y descripción visual. Cada historia termina antes de abrir la siguiente.</p>${meqGuideVisual(c8?'Ocho historias completas. Ya podés entender y producir descripciones cortas además de resolver situaciones cotidianas.':c7?'Creature Class está abierto: el cuerpo se aprende mirando criaturas, no estudiando una lista.':'Seguí el capítulo activo.')}<div class="chapter-grid">
  <button class="chapter-card ${c1?'done':'active'}" id="campaignC1"><span>✉️</span><div><b>Chapter 1</b><strong>The Magic Letter</strong><small>${c1?'✓ Terminado':'En curso'}</small></div></button>
  <button class="chapter-card ${c1?(c2?'done':'active'):'locked'}" id="campaignC2" ${c1?'':'disabled'}><span>🧪</span><div><b>Chapter 2</b><strong>Potion Mystery</strong><small>${!c1?'🔒 Bloqueado':c2?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c2?(c3?'done':'active'):'locked'}" id="campaignC3" ${c2?'':'disabled'}><span>🦉</span><div><b>Chapter 3</b><strong>Owl Message</strong><small>${!c2?'🔒 Bloqueado':c3?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c3?(c4?'done':'active'):'locked'}" id="campaignC4" ${c3?'':'disabled'}><span>🌲</span><div><b>Chapter 4</b><strong>Forest Riddle</strong><small>${!c3?'🔒 Bloqueado':c4?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c4?(c5?'done':'active'):'locked'}" id="campaignC5" ${c4?'':'disabled'}><span>🛍️</span><div><b>Chapter 5</b><strong>Market Day</strong><small>${!c4?'🔒 Bloqueado':c5?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c5?(c6?'done':'active'):'locked'}" id="campaignC6" ${c5?'':'disabled'}><span>🌙</span><div><b>Chapter 6</b><strong>The Midnight Room</strong><small>${!c5?'🔒 Bloqueado':c6?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c6?(c7?'done':'active'):'locked'}" id="campaignC7" ${c6?'':'disabled'}><span>🌅</span><div><b>Chapter 7</b><strong>First Morning</strong><small>${!c6?'🔒 Bloqueado':c7?'✓ Terminado':'Listo'}</small></div></button>
  <button class="chapter-card ${c7?(c8?'done':'active'):'locked'}" id="campaignC8" ${c7?'':'disabled'}><span>🐾</span><div><b>Chapter 8</b><strong>Creature Class</strong><small>${!c7?'🔒 Bloqueado':c8?'✓ Terminado':'Listo para jugar'}</small></div></button>
  <button class="chapter-card locked" disabled><span>🖼️</span><div><b>Chapter 9</b><strong>The Family Portrait</strong><small>${c8?'🔒 Próximo':'🔒 Bloqueado'}</small></div></button>
  </div></section>`;
  $('campaignC1').onclick=showChapter1Intro;if(c1)$('campaignC2').onclick=showChapter2Intro;if(c2)$('campaignC3').onclick=showChapter3Intro;if(c3)$('campaignC4').onclick=showChapter4Intro;if(c4)$('campaignC5').onclick=showChapter5Intro;if(c5)$('campaignC6').onclick=showChapter6Intro;if(c6)$('campaignC7').onclick=showChapter7Intro;if(c7)$('campaignC8').onclick=showChapter8Intro;setActiveNav('story');
};

showMap=function(){
  ensureC2State();ensureC3State();ensureC4State();ensureC5State();ensureC6State();ensureC7State();ensureC8State();
  screen.innerHTML=`<section class="card"><div class="eyebrow">Prólogo</div><h1 class="title">Before the Letter</h1><p class="subtitle">Diez escalones antes de la campaña.</p><div class="quest-map">${MAP.map((n,i)=>{const step=i+1,unlock=step<=state.unlockedStep,current=step===state.currentStep,d=stageData(step);return `<button class="map-node ${unlock?'unlocked':'locked'} ${current?'current':''}" data-step="${step}" ${unlock?'':'disabled'}><div class="node-num">${d.mastered?'✓':step}</div><div><div class="node-title">${n[0]}</div><div class="node-sub">${n[1]}</div></div><div class="node-badge">${unlock?n[2]:'🔒'}</div></button>`}).join('')}</div></section><section class="card"><div class="eyebrow">Campaña</div><h2 style="margin:5px 0">Historias</h2><div class="chapter-grid compact"><button class="chapter-card ${state.chapter1Complete?'done':state.phase0Complete?'active':'locked'}" id="mapC1" ${state.phase0Complete?'':'disabled'}><span>✉️</span><div><b>Ch. 1</b><strong>The Magic Letter</strong></div></button><button class="chapter-card ${state.chapter2Complete?'done':state.chapter1Complete?'active':'locked'}" id="mapC2" ${state.chapter1Complete?'':'disabled'}><span>🧪</span><div><b>Ch. 2</b><strong>Potion Mystery</strong></div></button><button class="chapter-card ${state.chapter3Complete?'done':state.chapter2Complete?'active':'locked'}" id="mapC3" ${state.chapter2Complete?'':'disabled'}><span>🦉</span><div><b>Ch. 3</b><strong>Owl Message</strong></div></button><button class="chapter-card ${state.chapter4Complete?'done':state.chapter3Complete?'active':'locked'}" id="mapC4" ${state.chapter3Complete?'':'disabled'}><span>🌲</span><div><b>Ch. 4</b><strong>Forest Riddle</strong></div></button><button class="chapter-card ${state.chapter5Complete?'done':state.chapter4Complete?'active':'locked'}" id="mapC5" ${state.chapter4Complete?'':'disabled'}><span>🛍️</span><div><b>Ch. 5</b><strong>Market Day</strong></div></button><button class="chapter-card ${state.chapter6Complete?'done':state.chapter5Complete?'active':'locked'}" id="mapC6" ${state.chapter5Complete?'':'disabled'}><span>🌙</span><div><b>Ch. 6</b><strong>The Midnight Room</strong></div></button><button class="chapter-card ${state.chapter7Complete?'done':state.chapter6Complete?'active':'locked'}" id="mapC7" ${state.chapter6Complete?'':'disabled'}><span>🌅</span><div><b>Ch. 7</b><strong>First Morning</strong></div></button><button class="chapter-card ${state.chapter8Complete?'done':state.chapter7Complete?'active':'locked'}" id="mapC8" ${state.chapter7Complete?'':'disabled'}><span>🐾</span><div><b>Ch. 8</b><strong>Creature Class</strong></div></button></div></section>`;
  document.querySelectorAll('.map-node.unlocked').forEach(b=>b.onclick=()=>startStep(Number(b.dataset.step)));if(state.phase0Complete)$('mapC1').onclick=showChapter1Intro;if(state.chapter1Complete)$('mapC2').onclick=showChapter2Intro;if(state.chapter2Complete)$('mapC3').onclick=showChapter3Intro;if(state.chapter3Complete)$('mapC4').onclick=showChapter4Intro;if(state.chapter4Complete)$('mapC5').onclick=showChapter5Intro;if(state.chapter5Complete)$('mapC6').onclick=showChapter6Intro;if(state.chapter6Complete)$('mapC7').onclick=showChapter7Intro;if(state.chapter7Complete)$('mapC8').onclick=showChapter8Intro;setActiveNav('map');
};

storyRoute=function(){if(!state.phase0Complete)return state.introSeen?startStep(state.currentStep):intro();if(!state.chapter1Complete)return showChapter1Intro();if(!state.chapter2Complete)return showChapter2Intro();if(!state.chapter3Complete)return showChapter3Intro();if(!state.chapter4Complete)return showChapter4Intro();if(!state.chapter5Complete)return showChapter5Intro();if(!state.chapter6Complete)return showChapter6Intro();if(!state.chapter7Complete)return showChapter7Intro();if(!state.chapter8Complete)return showChapter8Intro();return showCampaign();};
qCurrentAdventure=function(){if(!state.phase0Complete)return {eyebrow:'Prólogo',title:'Before the Letter',text:`Escalón ${state.currentStep} de 10`,icon:'🦉✉️',action:()=>state.introSeen?startStep(state.currentStep):intro()};if(!state.chapter1Complete)return {eyebrow:'Chapter 1',title:'The Magic Letter',text:'Tu carta ya llegó',icon:'✉️✨',action:showChapter1Intro};if(!state.chapter2Complete)return {eyebrow:'Chapter 2',title:'Potion Mystery',text:'Hay una botella fuera de lugar',icon:'🧪🔎',action:showChapter2Intro};if(!state.chapter3Complete)return {eyebrow:'Chapter 3',title:'Owl Message',text:'Un papel azul espera en el aula',icon:'🦉📄',action:showChapter3Intro};if(!state.chapter4Complete)return {eyebrow:'Chapter 4',title:'Forest Riddle',text:'El bosque necesita direcciones',icon:'🌲🧭',action:showChapter4Intro};if(!state.chapter5Complete)return {eyebrow:'Chapter 5',title:'Market Day',text:'El picnic necesita comida',icon:'🛍️🧺',action:showChapter5Intro};if(!state.chapter6Complete)return {eyebrow:'Chapter 6',title:'The Midnight Room',text:'Una puerta aparece sólo de noche',icon:'🌙🚪',action:showChapter6Intro};if(!state.chapter7Complete)return {eyebrow:'Chapter 7',title:'First Morning',text:'La primera campana está por sonar',icon:'🌅🎒',action:showChapter7Intro};if(!state.chapter8Complete)return {eyebrow:'Chapter 8',title:'Creature Class',text:'Pip necesita que lo reconozcas',icon:'🐾👁️',action:showChapter8Intro};return {eyebrow:'Campaña',title:'Ocho historias completadas',text:'The Family Portrait está por empezar',icon:'🖼️👨‍👩‍👧‍👦',action:showCampaign};};
const c8OldUpdateHud=updateHud;updateHud=function(){c8OldUpdateHud();ensureC8State();const l=$('levelText');if(l)l.textContent=(state.chapter8Complete?'Ch. 8 ✓':state.chapter7Complete?'Ch. 8':state.chapter6Complete?'Ch. 7':state.chapter5Complete?'Ch. 6':state.chapter4Complete?'Ch. 5':state.chapter3Complete?'Ch. 4':state.chapter2Complete?'Ch. 3':state.chapter1Complete?'Ch. 2':state.phase0Complete?'Ch. 1':`Step ${state.currentStep}`)+` · ${state.totalXp||0} XP`;const sub=$('headerSubtitle');if(sub)sub.textContent=state.chapter8Complete?'The Family Portrait · next':state.chapter7Complete?'Creature Class':state.chapter6Complete?'First Morning':state.chapter5Complete?'The Midnight Room':state.chapter4Complete?'Market Day':state.chapter3Complete?'Forest Riddle':state.chapter2Complete?'Owl Message':state.chapter1Complete?'Potion Mystery':state.phase0Complete?'The Magic Letter':'Before the Letter · Zero English';};

window.MEQ_BUILD='1.9.0';updateHud();if(state.lastRoute==='home')showHome();
