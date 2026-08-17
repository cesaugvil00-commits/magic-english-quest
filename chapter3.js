'use strict';

// MVP 0.8 — Chapter 3 proves that the reusable scene/game engine can carry a
// new story with more listening + short meaningful reading/writing, without
// turning the adventure into a grammar worksheet.

const C3_OBJECTS = [
  {id:'paper',en:'paper',es:'papel',img:'blue_paper.svg'},
  {id:'pen',en:'pen',es:'lapicera',img:'pen.svg'},
  {id:'pencil',en:'pencil',es:'lápiz',img:'pencil.svg'},
  {id:'desk',en:'desk',es:'pupitre / escritorio',visual:'🪵'}
];

function ensureC3State(){
  state.chapter3Evidence ||= {listeningCorrect:0,listeningTotal:0,usageCorrect:0,usageTotal:0,speakingScore:0,speakingAttempts:0,readingCorrect:0,readingTotal:0,helpUses:0};
  state.chapter3Scene ||= 1;
  state.chapter3Complete ||= false;
  state.playerName ||= 'Alex';
}
function c3Record(kind, correct, weight=1){
  ensureC3State(); const e=state.chapter3Evidence;
  if(kind==='listening'){e.listeningTotal+=weight;if(correct)e.listeningCorrect+=weight;}
  if(kind==='usage'){e.usageTotal+=weight;if(correct)e.usageCorrect+=weight;}
  if(kind==='reading'){e.readingTotal+=weight;if(correct)e.readingCorrect+=weight;}
  saveState();
}
function c3RecordSpeech(score){ensureC3State();const e=state.chapter3Evidence;e.speakingAttempts++;e.speakingScore+=score;saveState();}
function c3Ratios(){
  ensureC3State();const e=state.chapter3Evidence;
  return {
    listening:e.listeningTotal?e.listeningCorrect/e.listeningTotal:0,
    usage:e.usageTotal?e.usageCorrect/e.usageTotal:0,
    reading:e.readingTotal?e.readingCorrect/e.readingTotal:0,
    speaking:e.speakingAttempts?e.speakingScore/e.speakingAttempts:0
  };
}
function c3Header(scene,title){return `${meqSceneProgress('🦉 Chapter 3',scene,10)}<div class="eyebrow" style="margin-top:12px">${title}</div>`;}
function c3Award(id,coins){claim(`chapter3_${id}`,coins);const m=String(id).match(/^scene(\d+)$/);if(m)window.MEQPedagogy?.scheduleSceneByNumber('chapter_3_owl_message',Number(m[1]));}
function c3Help(short,es,unitId=''){return meqStoryHelp(short,es,unitId);}
function c3Img(name,alt=''){return meqImg(name,alt,'c3-object-img');}
function c3SpeakTarget(target,onDone){
  if(!speechRecognitionSupported()){c3RecordSpeech(.7);onDone?.(.7,true);return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=5;
  const fb=$('c3VoiceFb');if(fb)fb.textContent='🎧 Escuchando…';
  r.onresult=e=>{const alts=[...e.results[0]].map(a=>a.transcript);const result=scorePronunciationTranscript(target,alts);storePronunciation(`c3:${normalize(target)}`,result);c3RecordSpeech(result.phrase);meqRecordVoiceUnits(target,result.phrase,{context:'chapter3:voice',helpLevel:0});const ok=result.phrase>=.66;if(fb){fb.className=`feedback ${ok?'good':'soft'}`;fb.innerHTML=(ok?'🌟 Te entendí.':'Casi. Escuchá el modelo y probá de nuevo.')+pronunciationHtml(result);}if(!ok)speak(target,true);onDone?.(result.phrase,ok);};
  r.onerror=()=>{if(fb){fb.className='feedback soft';fb.textContent='No te escuché bien. Podés intentar otra vez o seguir con la opción guiada.';}onDone?.(0,false);};r.start();
}

function showChapter3Intro(){
  ensureC3State();setActiveNav('story');const complete=!!state.chapter3Complete;
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">${complete?'Chapter 3 complete':'Nueva historia desbloqueada'}</div><h1 class="title">Chapter 3 · Owl Message</h1><p class="subtitle">${complete?'El mensaje ya fue entregado. Podés repetir la historia para ganar fluidez y memoria.':'La lechuza vuelve con un papel azul. Esta vez no alcanza con reconocer objetos: vas a empezar a entender mensajes cortos.'}</p>
  ${meqSceneFrame({backdrop:'classroom_night.svg',actors:[{src:'milo.svg',alt:'Milo',pos:'right-ground',motion:'gentle-bob',scale:.61},{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.66},{src:'owl.svg',alt:'owl',pos:'upper-right',motion:'owl-hover',scale:.48}],props:[{src:'blue_paper.svg',alt:'blue paper',pos:'upper-mid',motion:'letter-glow',scale:.34}],caption:complete?'Message delivered.':'A blue paper falls from the owl…',label:'OWL MESSAGE'})}
  ${meqGuideVisual(complete?'Esta historia mezcla escuchar, leer un poquito, escribir y conversar. Repetir no vuelve a pagar el premio familiar.':'Primero vas a escuchar y ver. El texto escrito aparece después, cuando la frase ya tiene sentido.')}
  <div class="scene-skill-row"><span>👂 escuchar</span><span>👀 relacionar</span><span>📖 leer</span><span>✍️ escribir</span><span>🎤 hablar</span></div>
  <button id="c3Start" class="btn primary wide">${complete?'Jugar de nuevo →':'Seguir al búho →'}</button>${complete?'<button id="c3Campaign" class="btn secondary wide" style="margin-top:9px">📚 Ver campaña</button>':''}</section>`;
  $('c3Start').onclick=c3Scene1;if(complete)$('c3Campaign').onclick=showCampaign;
}

function c3Scene1(){
  ensureC3State();state.chapter3Scene=1;saveState();window.MEQPedagogy?.present('paper','chapter3','c3s1:story_drop');
  screen.innerHTML=`<section class="card word-stage scene-card">${c3Header(1,'A Different Letter')}<div class="prompt">Look! Take the paper.</div><button id="c3s1Audio" class="sound-orb">🔊</button>
  <div class="c3-hotspot-scene">${meqImg('classroom_night.svg','','c3-hotspot-bg')}${meqImg('owl.svg','owl','c3-owl-corner')}
    <button class="c3-hotspot hs-c3book" data-id="book" aria-label="book">📘</button>
    <button class="c3-hotspot hs-c3pen" data-id="pen" aria-label="pen">${c3Img('pen.svg','pen')}</button>
    <button class="c3-hotspot hs-c3paper" data-id="paper" aria-label="paper">${c3Img('blue_paper.svg','paper')}</button>
  </div><div id="c3s1Fb" class="feedback"></div>${c3Help('El papel azul brilla sólo si necesitás una pista.','paper = papel','paper')}</section>`;
  setTimeout(()=>speak('Look! Take the paper.'),260);$('c3s1Audio').onclick=()=>speak('Look! Take the paper.');
  document.querySelectorAll('.c3-hotspot').forEach(b=>b.onclick=()=>{const ok=b.dataset.id==='paper';c3Record('listening',ok);c3Record('usage',ok);meqRecordUnitTask('paper',ok,{dimensions:['listening','visual','usage'],context:'c3s1:paper_story',mode:'hotspot_transfer',distractorId:b.dataset.id});if(ok){b.classList.add('found');$('c3s1Fb').className='feedback good';$('c3s1Fb').textContent='✨ Paper. La historia ya tiene una nueva pista.';playSfx('success');c3Award('scene1',30);setTimeout(c3Scene2Observe,900)}else{$('c3s1Fb').className='feedback soft';$('c3s1Fb').textContent='Ese no es PAPER. Escuchalo y mirá qué objeto cae del búho.';playSfx('retry');speak('paper',true);}});
}

function c3Scene2Observe(index=0){
  ensureC3State();state.chapter3Scene=2;saveState();const items=C3_OBJECTS.slice(1);const u=items[index];window.MEQPedagogy?.present(u.id,'chapter3',`c3s2:teach:${index}`);
  const art=u.img?c3Img(u.img,u.en):`<div class="c3-desk-icon">🪵</div>`;
  screen.innerHTML=`<section class="card word-stage">${c3Header(2,'The Desk Kit')}<span class="game-label">👀 Mirá + 👂 escuchá</span><div class="c3-teach-object">${art}<b id="c3ObjWritten" class="hidden">${u.en.toUpperCase()}</b></div><button id="c3ObjAudio" class="sound-orb">🔊</button><p class="instruction">La palabra aparece pegada al objeto sólo en la presentación. Después desaparece.</p><div class="step-dots">${items.map((_,i)=>`<div class="dot ${i<index?'done':i===index?'now':''}"></div>`).join('')}</div><div class="btn-row"><button id="c3ObjReveal" class="btn secondary">🔤 Ver palabra</button><button id="c3ObjHelp" class="btn secondary">💡 Ayuda</button><button id="c3ObjNext" class="btn primary">${index===items.length-1?'Ahora sin texto →':'Siguiente →'}</button></div><div id="c3ObjHelpBox" class="help-box hidden"></div></section>`;
  setTimeout(()=>speak(u.en),220);$('c3ObjAudio').onclick=()=>speak(u.en);$('c3ObjReveal').onclick=()=>{$('c3ObjWritten').classList.remove('hidden');$('c3ObjReveal').disabled=true};$('c3ObjHelp').onclick=()=>{session.help=session.help||0;progressiveHelp(u,'c3ObjHelpBox')};$('c3ObjNext').onclick=()=>index<items.length-1?c3Scene2Observe(index+1):c3Scene2Game();
}
function c3Scene2Game(){session={round:0,targets:shuffle(C3_OBJECTS.slice(1))};renderC3ObjectRound();}
function renderC3ObjectRound(){
  if(session.round>=session.targets.length){c3Award('scene2',40);return c3Scene3();}const t=session.targets[session.round],choices=C3_OBJECTS.slice(1);
  screen.innerHTML=`<section class="card word-stage">${c3Header(2,'The Desk Kit')}<span class="game-label">👂 Sin leer</span><div class="prompt">¿Qué objeto nombró Milo?</div><button id="c3ObjRoundAudio" class="sound-orb">🔊</button><div class="c3-object-grid">${shuffle(choices).map(u=>`<button class="c3-object-choice" data-id="${u.id}">${u.img?c3Img(u.img,u.en):'<span class="c3-desk-icon">🪵</span>'}</button>`).join('')}</div><div id="c3ObjFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.en),220);$('c3ObjRoundAudio').onclick=()=>speak(t.en);document.querySelectorAll('.c3-object-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.id;c3Record('listening',ok);meqRecordUnitTask(t.id,ok,{dimensions:['listening','visual'],context:`c3s2:object:${t.id}`,mode:'audio_to_object',distractorId:b.dataset.id});document.querySelectorAll('.c3-object-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('c3ObjFb').className=`feedback ${ok?'good':'soft'}`;$('c3ObjFb').textContent=ok?'⭐ Sonido + objeto conectados.':`Escuchá ${t.en.toUpperCase()} otra vez.`;if(!ok)speak(t.en,true);setTimeout(()=>{session.round++;renderC3ObjectRound()},720)});
}

function c3Scene3(){
  ensureC3State();state.chapter3Scene=3;saveState();session={round:0,tasks:[
    {audio:'Come to class.',target:'class'},
    {audio:'The teacher is here.',target:'teacher'},
    {audio:'Sit at the desk.',target:'desk'}
  ]};renderC3ClassRound();
}
function renderC3ClassRound(){
  if(session.round>=session.tasks.length){c3Award('scene3',35);return c3Scene4Teach();}const t=session.tasks[session.round];
  screen.innerHTML=`<section class="card word-stage scene-card">${c3Header(3,'A New Class')}<div class="prompt">Escuchá. La frase tiene que cambiar algo en la escena.</div><button id="c3ClassAudio" class="sound-orb">🔊</button><div class="c3-class-scene">${meqImg('classroom_night.svg','','c3-hotspot-bg')}<button data-id="teacher" class="c3-person teacher-spot">${meqImg('teacher.svg','teacher')}</button><button data-id="class" class="c3-place class-spot">🏫<small>room</small></button><button data-id="desk" class="c3-place desk-spot">🪵<small>desk</small></button></div><div id="c3ClassFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c3ClassAudio').onclick=()=>speak(t.audio);document.querySelectorAll('[data-id].c3-person,[data-id].c3-place').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c3Record('listening',ok);c3Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual','usage'],context:`c3s3:class:${t.target}`,mode:'scene_transfer',distractorId:b.dataset.id});b.classList.add(ok?'correct':'wrong');$('c3ClassFb').className=`feedback ${ok?'good':'soft'}`;$('c3ClassFb').textContent=ok?'✨ La frase encontró su lugar.':'Milo marca la parte importante y la repite lento.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC3ClassRound()},760)});
}

function c3Scene4Teach(){
  ensureC3State();state.chapter3Scene=4;saveState();window.MEQPedagogy?.present('read','chapter3','c3s4:demo');window.MEQPedagogy?.present('write','chapter3','c3s4:demo');
  screen.innerHTML=`<section class="card word-stage">${c3Header(4,'Read It, Write It')}<div class="c3-action-demo"><button id="readDemo" class="c3-action-tile"><span>👀📄</span><b class="c3-action-word hidden">READ</b></button><button id="writeDemo" class="c3-action-tile"><span>✍️📄</span><b class="c3-action-word hidden">WRITE</b></button></div><p class="instruction">Primero ves la acción: ojos sobre el papel = READ. Lápiz sobre el papel = WRITE.</p><div class="btn-row"><button id="c3ReadHear" class="btn secondary">🔊 👀📄</button><button id="c3WriteHear" class="btn secondary">🔊 ✍️📄</button><button id="c3ActionReveal" class="btn secondary">🔤 Ver palabras</button></div><button id="c3NameGo" class="btn primary wide" style="margin-top:14px">Usarlas en la historia →</button></section>`;
  $('readDemo').onclick=$('c3ReadHear').onclick=()=>speak('Read.');$('writeDemo').onclick=$('c3WriteHear').onclick=()=>speak('Write.');$('c3ActionReveal').onclick=()=>{document.querySelectorAll('.c3-action-word').forEach(x=>x.classList.remove('hidden'));$('c3ActionReveal').disabled=true};$('c3NameGo').onclick=c3Scene4Write;
}
function c3Scene4Write(){
  screen.innerHTML=`<section class="card word-stage">${c3Header(4,'Read It, Write It')}<div class="prompt">Write your name.</div><button id="c3WriteNameAudio" class="sound-orb">🔊</button><div class="c3-name-card"><span>🏷️</span><input id="c3NameInput" maxlength="18" autocomplete="off" placeholder="Your name" value="${state.playerName==='Alex'?'':state.playerName}"/><button id="c3NameSave" class="btn primary">Write ✍️</button></div><div id="c3NameFb" class="feedback"></div>${c3Help('Podés escribir sólo tu nombre. No evaluamos ortografía inglesa acá.','Write your name = escribí tu nombre','write')}</section>`;
  setTimeout(()=>speak('Write your name.'),220);$('c3WriteNameAudio').onclick=()=>speak('Write your name.');$('c3NameSave').onclick=()=>{const n=$('c3NameInput').value.trim();const ok=n.length>=2;c3Record('usage',ok);meqRecordUnitTask('write',ok,{dimensions:['listening','usage'],context:'c3s4:write_name',mode:'functional_writing'});$('c3NameFb').className=`feedback ${ok?'good':'soft'}`;$('c3NameFb').textContent=ok?`✨ ${n}. Ahora ese nombre forma parte de la historia.`:'Escribí al menos dos letras para que el mensaje tenga un nombre.';if(ok){state.playerName=n;saveState();c3Award('scene4',45);setTimeout(c3Scene5,850)}};
}

function c3Scene5(){
  ensureC3State();state.chapter3Scene=5;saveState();session={round:0,tasks:[
    {q:'What is your name?',a:`My name is ${state.playerName}.`,wrong:'The paper is blue.'},
    {q:'Where is the paper?',a:'It is on the desk.',wrong:`My name is ${state.playerName}.`}
  ]};renderC3DialoguePair();
}
function renderC3DialoguePair(){
  if(session.round>=session.tasks.length){return c3Scene5Voice();}const t=session.tasks[session.round];
  screen.innerHTML=`<section class="card word-stage">${c3Header(5,'Question and Answer')}<span class="game-label">❓ QUESTION → 💬 ANSWER</span><div class="c3-dialogue-card"><b>Milo asks:</b><button id="c3QuestionAudio" class="dialogue-line">🔊 ${t.q}</button></div><p class="instruction">Elegí la respuesta que hace que la conversación tenga sentido.</p><div class="choice-grid">${shuffle([t.a,t.wrong]).map(x=>`<button class="choice-card" data-answer="${encodeURIComponent(x)}">${x}</button>`).join('')}</div><div id="c3DialogFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.q),220);$('c3QuestionAudio').onclick=()=>speak(t.q);document.querySelectorAll('.choice-card').forEach(b=>b.onclick=()=>{const ans=decodeURIComponent(b.dataset.answer),ok=ans===t.a;c3Record('listening',ok);c3Record('usage',ok);meqRecordTextUnits(t.q,ok,{dimensions:['listening'],context:`c3s5:q${session.round}`,mode:'question_comprehension'});meqRecordTextUnits(t.a,ok,{dimensions:['usage'],context:`c3s5:a${session.round}`,mode:'answer_selection'});b.classList.add(ok?'correct':'wrong');$('c3DialogFb').className=`feedback ${ok?'good':'soft'}`;$('c3DialogFb').textContent=ok?'✨ Question → answer. La charla tiene sentido.':'Esa frase es posible en inglés, pero no responde esta pregunta.';if(ok)speak(t.a);setTimeout(()=>{session.round++;renderC3DialoguePair()},900)});
}
function c3Scene5Voice(){
  const target=`My name is ${state.playerName}.`;
  screen.innerHTML=`<section class="card word-stage">${c3Header(5,'Question and Answer')}<div class="prompt">What is your name?</div><button id="c3Q5Audio" class="sound-orb">🔊</button><div class="model-phrase">${target}</div><div class="btn-row"><button id="c3Q5Speak" class="btn primary">🎤 Say it</button><button id="c3Q5Guided" class="btn secondary">👉 Usar respuesta guiada</button></div><div id="c3VoiceFb" class="feedback"></div><div class="microcopy">La voz suma evidencia, pero nunca es el único bloqueo del capítulo.</div></section>`;
  setTimeout(()=>speak('What is your name?'),220);$('c3Q5Audio').onclick=()=>speak('What is your name?');$('c3Q5Speak').onclick=()=>c3SpeakTarget(target,(score,ok)=>{if(ok){c3Award('scene5',50);setTimeout(c3Scene6,1300)}});$('c3Q5Guided').onclick=()=>{c3RecordSpeech(.7);c3Award('scene5',50);speak(target);setTimeout(c3Scene6,900)};
}

function c3Scene6(){
  ensureC3State();state.chapter3Scene=6;saveState();session={round:0,tasks:[
    {audio:'Who is the teacher?',target:'teacher'},
    {audio:'Who is the student?',target:'student'}
  ]};renderC3Who();
}
function renderC3Who(){
  if(session.round>=session.tasks.length){c3Award('scene6',45);return c3Scene7();}const t=session.tasks[session.round];
  screen.innerHTML=`<section class="card word-stage scene-card">${c3Header(6,'Who Is It?')}<div class="prompt">Escuchá WHO como una pregunta por una persona.</div><button id="c3WhoAudio" class="sound-orb">🔊</button><div class="c3-people-grid"><button data-id="teacher" class="c3-person-card">${meqImg('teacher.svg','teacher')}<small>1</small></button><button data-id="student" class="c3-person-card">${meqImg('amanda.svg','student')}<small>2</small></button><button data-id="milo" class="c3-person-card">${meqImg('milo.svg','Milo')}<small>3</small></button></div><div id="c3WhoFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c3WhoAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c3-person-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c3Record('listening',ok);c3Record('usage',ok);meqRecordUnitTask('who',ok,{dimensions:['listening','usage'],context:`c3s6:who:${session.round}`,mode:'question_transfer',distractorId:b.dataset.id});meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual'],context:`c3s6:person:${t.target}`,mode:'role_identification',distractorId:b.dataset.id});b.classList.add(ok?'correct':'wrong');$('c3WhoFb').className=`feedback ${ok?'good':'soft'}`;$('c3WhoFb').textContent=ok?'⭐ WHO encontró a la persona correcta.':'WHO pregunta por una persona. Mirá el rol y escuchá otra vez.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC3Who()},780)});
}

function c3Scene7(){
  ensureC3State();state.chapter3Scene=7;saveState();session={round:0,tasks:[
    {audio:'The pencil is next to the book.',target:'next_to',piece:'pencil'},
    {audio:'The paper is under the desk.',target:'under',piece:'paper'},
    {audio:'The pen is on the desk.',target:'on',piece:'pen'}
  ]};renderC3Spatial();
}
function renderC3Spatial(){
  if(session.round>=session.tasks.length){c3Award('scene7',55);return c3Scene8Intro();}const t=session.tasks[session.round];
  const src=t.piece==='pencil'?'pencil.svg':t.piece==='paper'?'blue_paper.svg':'pen.svg';
  screen.innerHTML=`<section class="card word-stage">${c3Header(7,'Next to the Book')}<div class="prompt">Escuchá y colocá el objeto donde describe la frase.</div><button id="c3SpatialAudio" class="sound-orb">🔊</button><div class="c3-spatial-board"><div class="c3-piece">${c3Img(src,t.piece)}</div><div class="c3-book-anchor">📘<small>book</small></div><button data-id="next_to" class="c3-spatial-zone z-next">↔️<small>next to</small></button><button data-id="on" class="c3-spatial-zone z-on">⬆️<small>on</small></button><button data-id="under" class="c3-spatial-zone z-under">⬇️<small>under</small></button></div><div id="c3SpatialFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c3SpatialAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.c3-spatial-zone').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c3Record('listening',ok);c3Record('usage',ok);meqRecordUnitTask(t.target,ok,{dimensions:['listening','visual','usage'],context:`c3s7:spatial:${t.target}`,mode:'spatial_transfer',distractorId:b.dataset.id});meqRecordUnitTask(t.piece,ok,{dimensions:['listening','visual'],context:`c3s7:object:${t.piece}`,mode:'object_in_new_context'});b.classList.add(ok?'correct':'wrong');$('c3SpatialFb').className=`feedback ${ok?'good':'soft'}`;$('c3SpatialFb').textContent=ok?'✨ La posición coincide con la frase.':'La relación todavía no coincide. La frase vuelve más lenta.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC3Spatial()},820)});
}

function c3Scene8Intro(){
  ensureC3State();state.chapter3Scene=8;saveState();session={line:0,lines:[
    {audio:'Find the blue paper.',text:'Find the blue paper.',visual:'🔎 📄🔵'},
    {audio:'Read it.',text:'Read it.',visual:'👀 📄'},
    {audio:'Write your name.',text:'Write your name.',visual:'✍️ 🏷️'}
  ]};renderC3MessageAudioFirst();
}
function renderC3MessageAudioFirst(){
  if(session.line>=session.lines.length){c3Award('scene8',55);return c3Scene9();}const l=session.lines[session.line];
  screen.innerHTML=`<section class="card word-stage">${c3Header(8,'The Short Message')}<span class="game-label">1. ESCUCHAR → 2. IMAGEN → 3. TEXTO</span><div class="big-emoji">${l.visual}</div><button id="c3MsgAudio" class="sound-orb">🔊</button><p class="instruction">Primero escuchá. Después revelamos el texto escrito que corresponde a algo que ya entendiste.</p><button id="c3RevealText" class="btn primary wide">Revelar texto →</button><div id="c3TextArea"></div></section>`;
  setTimeout(()=>speak(l.audio),220);$('c3MsgAudio').onclick=()=>speak(l.audio);$('c3RevealText').onclick=()=>{const wrong=session.line===0?'Take the red paper.':session.line===1?'Write it.':'Read your name.';$('c3TextArea').innerHTML=`<div class="c3-text-match"><button class="c3-text-choice" data-ok="1">${l.text}</button><button class="c3-text-choice" data-ok="0">${wrong}</button></div><div id="c3TextFb" class="feedback"></div>`;document.querySelectorAll('.c3-text-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.ok==='1';c3Record('reading',ok);c3Record('usage',ok);b.classList.add(ok?'correct':'wrong');$('c3TextFb').className=`feedback ${ok?'good':'soft'}`;$('c3TextFb').textContent=ok?'📖 El sonido, la imagen y el texto dicen lo mismo.':'Ese texto cambia la acción. Volvé a escuchar antes de comparar.';setTimeout(()=>{session.line++;renderC3MessageAudioFirst()},860)});};
}

function c3Scene9(){
  ensureC3State();state.chapter3Scene=9;saveState();
  screen.innerHTML=`<section class="card word-stage scene-card">${c3Header(9,'Deliver the Message')}<div class="prompt">Please give it to the teacher.</div><button id="c3DeliverAudio" class="sound-orb">🔊</button><div class="c3-delivery-scene">${meqImg('classroom_night.svg','','c3-hotspot-bg')}<button id="c3TeacherDeliver" class="c3-delivery-person teacher-delivery">${meqImg('teacher.svg','teacher')}</button><button class="c3-delivery-person amanda-delivery" data-wrong="1">${meqImg('amanda.svg','Amanda')}</button><div class="c3-delivery-paper">${c3Img('blue_paper.svg','paper')}</div></div><div id="c3DeliverFb" class="feedback"></div></section>`;
  setTimeout(()=>speak('Please give it to the teacher.'),220);$('c3DeliverAudio').onclick=()=>speak('Please give it to the teacher.');$('c3TeacherDeliver').onclick=()=>{c3Record('listening',true);c3Record('usage',true);meqRecordUnitTask('teacher',true,{dimensions:['listening','visual','usage'],context:'c3s9:deliver_teacher',mode:'functional_transfer'});c3Scene9Here();};document.querySelectorAll('[data-wrong="1"]').forEach(b=>b.onclick=()=>{c3Record('listening',false);meqRecordUnitTask('teacher',false,{dimensions:['listening','visual'],context:'c3s9:deliver_teacher',mode:'functional_transfer',distractorId:'student'});$('c3DeliverFb').className='feedback soft';$('c3DeliverFb').textContent='Escuchaste TEACHER. Buscá a la persona que cumple ese rol.';speak('teacher',true)});
}
function c3Scene9Here(){
  screen.innerHTML=`<section class="card word-stage">${c3Header(9,'Deliver the Message')}<div class="c3-dialogue-card"><b>Milo:</b><div class="dialogue-line">Give it to her. Say: “Here.”</div></div><div class="prompt">Entregá el papel diciendo “Here.”</div><div class="btn-row"><button id="c3ThanksSpeak" class="btn primary">🎤 Here</button><button id="c3ThanksGuided" class="btn secondary">👉 Respuesta guiada</button></div><div id="c3VoiceFb" class="feedback"></div></section>`;
  speak('Here.');$('c3ThanksSpeak').onclick=()=>c3SpeakTarget('Here.',(score,ok)=>{if(ok){c3Award('scene9',60);setTimeout(c3Scene10Intro,1200)}});$('c3ThanksGuided').onclick=()=>{c3RecordSpeech(.72);c3Award('scene9',60);speak('Here.');setTimeout(()=>{speak('Thank you.');c3Scene10Intro();},800)};
}

function c3Scene10Intro(){
  ensureC3State();state.chapter3Scene=10;saveState();const r=c3Ratios();
  screen.innerHTML=`<section class="card hero-card">${c3Header(10,'Finale · Decode the Owl Message')}<div class="big-emoji">🦉📄🔎</div><h1 class="title">Ahora el mensaje es uno solo.</h1><p class="subtitle">No aparece vocabulario nuevo. Tenés que escuchar, encontrar, leer, escribir y entregar.</p><div class="mastery-grid">${metric('Escucha',r.listening)}${metric('Uso',r.usage)}${metric('Lectura',r.reading)}${metric('Voz',r.speaking)}</div>${meqGuideVisual('Si el jefe final detecta un punto flojo, sólo repara esa habilidad. No repetimos toda la historia.')}<button id="c3FinalStart" class="btn primary wide" style="margin-top:15px">Decodificar el mensaje →</button></section>`;$('c3FinalStart').onclick=c3FinaleStart;
}
function c3FinaleStart(){
  session={round:0,score:0,tasks:[
    {audio:'Find the blue paper.',target:'paper',kind:'listen',opts:[['paper','📄🔵'],['book','📘'],['pen','🖊️']]},
    {audio:'It is next to the book.',target:'next_to',kind:'listen',opts:[['under','⬇️ under'],['next_to','↔️ next to'],['on','⬆️ on']]},
    {audio:'Read it.',target:'read',kind:'read',opts:[['read','👀 READ'],['write','✍️ WRITE'],['close','🔒 CLOSE']]},
    {audio:'Write your name.',target:'write',kind:'use',opts:[['write','✍️ '+state.playerName],['read','👀 '+state.playerName],['give','🤲 '+state.playerName]]},
    {audio:'Give it to the teacher.',target:'teacher',kind:'listen',opts:[['teacher','🧑‍🏫'],['student','👧'],['milo','🦊']]}
  ]};renderC3Finale();
}
function renderC3Finale(){
  if(session.round>=session.tasks.length)return finishC3Finale();const t=session.tasks[session.round];
  screen.innerHTML=`<section class="card word-stage">${c3Header(10,'Finale · Decode the Owl Message')}<span class="game-label">🏆 Parte ${session.round+1}/5</span><button id="c3BossAudio" class="sound-orb">🔊</button><div class="action-grid">${shuffle(t.opts).map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div></button>`).join('')}</div><div id="c3BossFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c3BossAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;if(ok)session.score++;c3Record('listening',ok);c3Record('usage',ok);if(t.kind==='read')c3Record('reading',ok);meqRecordUnitTask(t.target,ok,{dimensions:t.kind==='read'?['listening','reading','usage']:['listening','usage'],context:`c3boss:${session.round}:${t.target}`,mode:'micro_assessment',distractorId:b.dataset.id,weight:1.25});b.classList.add(ok?'correct':'wrong');$('c3BossFb').className=`feedback ${ok?'good':'soft'}`;$('c3BossFb').textContent=ok?'⭐ El mensaje sigue.':'Esta parte queda marcada para una reparación corta.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC3Finale()},700)});
}
function finishC3Finale(){
  const r=c3Ratios(),boss=session.score/5;const evidencePass=r.listening>=.78&&r.usage>=.75&&r.reading>=.68;const pass=boss>=.8&&evidencePass;
  if(pass){state.chapter3Complete=true;saveState();c3Award('finale',130);}
  screen.innerHTML=`<section class="card reward-card">${c3Header(10,'Finale · Decode the Owl Message')}<div class="big-emoji">${pass?'🦉✅✨':'🦊🛠️📄'}</div><h1 class="title">${pass?'Mensaje entregado':'Una parte necesita práctica'}</h1><p class="subtitle">${pass?'Escuchaste un mensaje de varios pasos y lo convertiste en acciones. Eso ya es comprensión funcional, no memoria de una lista.':'Milo detectó qué tipo de pista salió floja. Hacemos tres micropruebas y volvemos al final.'}</p><div class="mastery-grid">${metric('Boss',boss)}${metric('Escucha',r.listening)}${metric('Uso',r.usage)}${metric('Lectura',r.reading)}${metric('Voz',r.speaking)}</div><div class="btn-row" style="margin-top:15px"><button id="c3ResultCampaign" class="btn secondary">📚 Campaña</button><button id="c3ResultNext" class="btn primary">${pass?'Ver el cierre →':'Reforzar sólo esto →'}</button></div></section>`;
  $('c3ResultCampaign').onclick=showCampaign;$('c3ResultNext').onclick=()=>pass?c3Ending():c3Repair();
}
function c3Repair(){
  const r=c3Ratios();const weak=r.listening<.78?'listening':r.usage<.75?'usage':'reading';
  const banks={
    listening:[{audio:'Pen.',target:'pen',opts:[['pen','🖊️'],['pencil','✏️'],['paper','📄']]},{audio:'Who is the teacher?',target:'teacher',opts:[['teacher','🧑‍🏫'],['student','👧'],['milo','🦊']]},{audio:'The paper is next to the book.',target:'next_to',opts:[['next_to','↔️'],['under','⬇️'],['on','⬆️']]}],
    usage:[{audio:'Write your name.',target:'write',opts:[['write','✍️'],['read','👀'],['give','🤲']]},{audio:'Give it to the teacher.',target:'teacher',opts:[['teacher','🧑‍🏫'],['student','👧'],['milo','🦊']]},{audio:'Take the pencil.',target:'pencil',opts:[['pen','🖊️'],['pencil','✏️'],['paper','📄']]}],
    reading:[{audio:'Find the blue paper.',target:'find',opts:[['find','Find the blue paper.'],['take','Take the red pen.'],['write','Write your name.']]},{audio:'Read it.',target:'read',opts:[['read','Read it.'],['write','Write it.'],['give','Give it.']]},{audio:'Write your name.',target:'write',opts:[['write','Write your name.'],['read','Read your name.'],['find','Find your name.']]}]
  };
  session={repairSkill:weak,round:0,tasks:shuffle(banks[weak]).slice(0,3)};renderC3Repair();
}
function renderC3Repair(){
  if(session.round>=session.tasks.length)return c3Scene10Intro();const t=session.tasks[session.round];
  screen.innerHTML=`<section class="card word-stage">${c3Header(10,'Milo’s Quick Repair')}<span class="game-label">🛠️ Sólo reforzamos ${session.repairSkill}</span><div class="prompt">Tres pistas y volvés al final.</div><button id="c3RepairAudio" class="sound-orb">🔊</button><div class="action-grid">${shuffle(t.opts).map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div></button>`).join('')}</div><div id="c3RepairFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),220);$('c3RepairAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c3Record(session.repairSkill,ok,2);meqRecordUnitTask(t.target,ok,{dimensions:[session.repairSkill==='reading'?'usage':session.repairSkill],context:`c3repair:${session.round}:${t.target}`,mode:'adaptive_repair',distractorId:b.dataset.id,weight:1.3});if(session.repairSkill!=='listening')c3Record('listening',true,.4);b.classList.add(ok?'correct':'wrong');$('c3RepairFb').className=`feedback ${ok?'good':'soft'}`;$('c3RepairFb').textContent=ok?'✨ Reforzado.':'La repetimos lenta y aparece en otra forma.';if(!ok)speak(t.audio,true);setTimeout(()=>{session.round++;renderC3Repair()},720)});
}
function c3Ending(){
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 3 complete</div><h1 class="title">Owl Message · End</h1>${meqSceneFrame({backdrop:'classroom_night.svg',actors:[{src:'amanda.svg',alt:'student',pos:'left-ground',scale:.65},{src:'teacher.svg',alt:'teacher',pos:'right-ground',scale:.63},{src:'owl.svg',alt:'owl',pos:'upper-right',motion:'owl-hover',scale:.43}],props:[{src:'blue_paper.svg',alt:'message',pos:'upper-mid',motion:'letter-glow',scale:.28}],caption:'The message opens a new path.',label:'STORY COMPLETE'})}<p class="subtitle">La profesora gira el papel. Del otro lado hay un dibujo de árboles, una luna y dos flechas. La próxima historia sale del aula.</p>${meqGuideVisual('Chapter 4 va a reutilizar WHO, WHERE, objetos y órdenes; después agrega naturaleza, izquierda/derecha y pequeñas decisiones de exploración.')}<div class="chapter-hook"><span>🌲🧭</span><div><b>Next: Chapter 4</b><strong>Forest Riddle</strong><small>nature · left/right · follow clues · short descriptions</small></div></div><button id="c3EndCampaign" class="btn primary wide" style="margin-top:14px">Volver a la campaña →</button></section>`;$('c3EndCampaign').onclick=showCampaign;
}

// Add a repeatable classroom rhythm pack; it awards XP/stars only.
if(typeof SONGS!=='undefined'){
  SONGS.classroom={id:'classroom',title:'Classroom Beat',unlock:()=>!!state.chapter2Complete,icon:'📚🎵',phrases:[
    {text:'Read the paper.',visual:'👀📄',words:['read','the','paper']},
    {text:'Write your name.',visual:'✍️🏷️',words:['write','your','name']},
    {text:'Pen and pencil.',visual:'🖊️✏️',words:['pen','and','pencil']},
    {text:'Who is the teacher?',visual:'❓🧑‍🏫',words:['who','is','the','teacher']},
    {text:'The paper is next to the book.',visual:'📄↔️📘',words:['the','paper','is','next','to','the','book']}
  ]};
}

// Campaign-aware routes upgraded through Chapter 3.
showCampaign = function(){
  ensureC2State();ensureC3State();const c1=!!state.chapter1Complete,c2=!!state.chapter2Complete,c3=!!state.chapter3Complete;
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Tu aventura</div><h1 class="title">Cada historia usa el inglés de la anterior</h1><p class="subtitle">El mundo pide habilidades nuevas de a poco. La gramática queda escondida dentro de acciones, mensajes y conversaciones.</p>${meqGuideVisual(c3?'Ya completaste tres historias. Ahora podemos salir del aula y usar el inglés para orientarnos.':c2?'El mensaje del búho ya está listo.':c1?'La cocina te espera antes del mensaje del búho.':'Primero completá The Magic Letter.')}
  <div class="chapter-grid">
    <button class="chapter-card ${c1?'done':'active'}" id="campaignC1"><span>✉️</span><div><b>Chapter 1</b><strong>The Magic Letter</strong><small>${c1?'✓ Terminado':'En curso'}</small></div></button>
    <button class="chapter-card ${c1?(c2?'done':'active'):'locked'}" id="campaignC2" ${c1?'':'disabled'}><span>🧪</span><div><b>Chapter 2</b><strong>Potion Mystery</strong><small>${!c1?'🔒 Bloqueado':c2?'✓ Terminado':'Listo para jugar'}</small></div></button>
    <button class="chapter-card ${c2?(c3?'done':'active'):'locked'}" id="campaignC3" ${c2?'':'disabled'}><span>🦉</span><div><b>Chapter 3</b><strong>Owl Message</strong><small>${!c2?'🔒 Bloqueado':c3?'✓ Terminado':'Listo para jugar'}</small></div></button>
    <button class="chapter-card locked" disabled><span>🌲</span><div><b>Chapter 4</b><strong>Forest Riddle</strong><small>${c3?'🔒 Próximo':'🔒 Bloqueado'}</small></div></button>
  </div></section>`;
  $('campaignC1').onclick=showChapter1Intro;if(c1)$('campaignC2').onclick=showChapter2Intro;if(c2)$('campaignC3').onclick=showChapter3Intro;setActiveNav('story');
};

showMap = function(){
  ensureC2State();ensureC3State();screen.innerHTML=`<section class="card"><div class="eyebrow">Prólogo</div><h1 class="title">Before the Letter</h1><p class="subtitle">Diez escalones. La historia empieza cuando existe una base mínima real.</p><div class="quest-map">${MAP.map((n,i)=>{const step=i+1,unlock=step<=state.unlockedStep,current=step===state.currentStep,d=stageData(step);return `<button class="map-node ${unlock?'unlocked':'locked'} ${current?'current':''}" data-step="${step}" ${unlock?'':'disabled'}><div class="node-num">${d.mastered?'✓':step}</div><div><div class="node-title">${n[0]}</div><div class="node-sub">${n[1]}</div></div><div class="node-badge">${unlock?n[2]:'🔒'}</div></button>`}).join('')}</div></section>
  <section class="card"><div class="eyebrow">Campaña</div><h2 style="margin:5px 0">Historias</h2><div class="chapter-grid compact">
    <button class="chapter-card ${state.chapter1Complete?'done':state.phase0Complete?'active':'locked'}" id="mapC1" ${state.phase0Complete?'':'disabled'}><span>✉️</span><div><b>Chapter 1</b><strong>The Magic Letter</strong><small>${state.chapter1Complete?'✓ Terminado':state.phase0Complete?'Desbloqueado':'🔒 requiere prólogo'}</small></div></button>
    <button class="chapter-card ${state.chapter2Complete?'done':state.chapter1Complete?'active':'locked'}" id="mapC2" ${state.chapter1Complete?'':'disabled'}><span>🧪</span><div><b>Chapter 2</b><strong>Potion Mystery</strong><small>${state.chapter2Complete?'✓ Terminado':state.chapter1Complete?'Desbloqueado':'🔒 requiere Chapter 1'}</small></div></button>
    <button class="chapter-card ${state.chapter3Complete?'done':state.chapter2Complete?'active':'locked'}" id="mapC3" ${state.chapter2Complete?'':'disabled'}><span>🦉</span><div><b>Chapter 3</b><strong>Owl Message</strong><small>${state.chapter3Complete?'✓ Terminado':state.chapter2Complete?'Desbloqueado':'🔒 requiere Chapter 2'}</small></div></button>
  </div></section>`;
  document.querySelectorAll('.map-node.unlocked').forEach(b=>b.onclick=()=>startStep(Number(b.dataset.step)));if(state.phase0Complete)$('mapC1').onclick=showChapter1Intro;if(state.chapter1Complete)$('mapC2').onclick=showChapter2Intro;if(state.chapter2Complete)$('mapC3').onclick=showChapter3Intro;setActiveNav('map');
};

const c3OldC2Ending = c2Ending;
c2Ending = function(){
  if(!state.chapter2Complete)return c3OldC2Ending();
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 2 complete</div><h1 class="title">Potion Mystery · End</h1>${meqSceneFrame({backdrop:'potion_lab.svg',actors:[{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.66},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.61},{src:'owl.svg',alt:'owl',pos:'upper-right',motion:'owl-fly-in',scale:.45}],props:[{src:'blue_paper.svg',alt:'blue paper',pos:'upper-mid',motion:'letter-glow',scale:.28}],caption:'A new message arrives…'})}<p class="subtitle">Cuando guardás la última botella, la lechuza deja caer un papel azul. La siguiente historia ya está abierta.</p>${meqGuideVisual('Ahora vamos a usar palabras de escuela, preguntas y mensajes cortos. Escuchar sigue primero; leer aparece después como apoyo.')}<button id="c2ToC3" class="btn primary wide">Empezar Chapter 3 →</button></section>`;$('c2ToC3').onclick=showChapter3Intro;
};

storyRoute = function(){
  if(!state.phase0Complete)return state.introSeen?startStep(state.currentStep):intro();
  if(!state.chapter1Complete)return showChapter1Intro();
  if(!state.chapter2Complete)return showChapter2Intro();
  if(!state.chapter3Complete)return showChapter3Intro();
  return showCampaign();
};

// Quality-layer route text needs to understand Chapter 3 as well.
qCurrentAdventure = function(){
  if(!state.phase0Complete)return {eyebrow:'Prólogo',title:'Before the Letter',text:`Escalón ${state.currentStep} de 10`,icon:'🦉✉️',action:()=>state.introSeen?startStep(state.currentStep):intro()};
  if(!state.chapter1Complete)return {eyebrow:'Chapter 1',title:'The Magic Letter',text:'Tu carta ya llegó',icon:'✉️✨',action:showChapter1Intro};
  if(!state.chapter2Complete)return {eyebrow:'Chapter 2',title:'Potion Mystery',text:'Hay una botella fuera de lugar',icon:'🧪🔎',action:showChapter2Intro};
  if(!state.chapter3Complete)return {eyebrow:'Chapter 3',title:'Owl Message',text:'Un papel azul espera en el aula',icon:'🦉📄',action:showChapter3Intro};
  return {eyebrow:'Campaña',title:'Tres historias completadas',text:'La próxima pista apunta al bosque',icon:'🌲🧭',action:showCampaign};
};

const c3OldUpdateHud=updateHud;
updateHud=function(){c3OldUpdateHud();ensureQState();ensureC3State();const l=$('levelText');if(l)l.textContent=(state.chapter3Complete?'Ch. 3 ✓':state.chapter2Complete?'Ch. 3':state.chapter1Complete?'Ch. 2':state.phase0Complete?'Ch. 1':`Step ${state.currentStep}`)+` · ${state.totalXp} XP`;const sub=$('headerSubtitle');if(sub)sub.textContent=state.chapter3Complete?'Forest Riddle · next':state.chapter2Complete?'Owl Message':state.chapter1Complete?'Potion Mystery':state.phase0Complete?'The Magic Letter':'Before the Letter · Zero English';};

window.MEQ_BUILD='1.9.0';
updateHud();
if(state.lastRoute==='home')showHome();
