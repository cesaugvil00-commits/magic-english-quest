'use strict';

// MVP 0.7 — lightweight story scene engine.
// The educational flow still lives in app.js/chapter2.js. This layer only
// upgrades presentation + interaction so story content can reuse a consistent
// visual grammar instead of hand-built emoji screens.

const MEQ_ART='images/scene/';
const meqImg=(name,alt='',klass='')=>`<img class="${klass}" src="${MEQ_ART}${name}" alt="${alt}" loading="eager" decoding="async" />`;

function meqSceneFrame({backdrop='moon_room.svg',actors=[],props=[],mood='night',caption='',label=''}){
  const actorHtml=actors.map(a=>`<div class="scene-sprite ${a.pos||''} ${a.motion||''}" style="--scale:${a.scale||1}">${meqImg(a.src,a.alt||'', 'scene-sprite-img')}</div>`).join('');
  const propHtml=props.map(p=>`<div class="scene-prop ${p.pos||''} ${p.motion||''}" style="--scale:${p.scale||1}">${meqImg(p.src,p.alt||'', 'scene-prop-img')}</div>`).join('');
  return `<div class="story-stage mood-${mood}">
    ${meqImg(backdrop,'','story-backdrop')}
    <div class="story-vignette"></div>
    <div class="story-glow"></div>
    ${actorHtml}${propHtml}
    ${label?`<div class="story-label">${label}</div>`:''}
    ${caption?`<div class="story-caption">${caption}</div>`:''}
  </div>`;
}

function meqSceneProgress(chapter,scene,total){
  return `<div class="scene-progress"><span>${chapter}</span><div><i style="width:${Math.round(scene/total*100)}%"></i></div><b>${scene}/${total}</b></div>`;
}

function meqGuideVisual(text){
  return `<div class="visual-guide"><div class="visual-guide-avatar">${meqImg('milo.svg','Milo')}</div><div class="visual-guide-copy">${text}</div></div>`;
}

// ---- Chapter 1 visual upgrade ----
showChapter1Intro = function(){
  ensureAmbient();setActiveNav('story');const complete=!!state.chapter1Complete;
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">${complete?'Capítulo completado':'Prólogo completado'}</div><h1 class="title">Chapter 1 · The Magic Letter</h1><p class="subtitle">${complete?'La historia queda disponible para volver a vivirla sin cobrar dos veces los premios familiares.':'Durante todo el prólogo viste cómo otros recibían una carta. Ahora la lechuza gira hacia tu ventana.'}</p>
  ${meqSceneFrame({backdrop:'moon_room.svg',actors:[{src:'amanda.svg',alt:'protagonista',pos:'left-ground',motion:'gentle-bob',scale:.72},{src:'milo.svg',alt:'Milo',pos:'right-ground',motion:'gentle-bob',scale:.66},{src:'owl.svg',alt:'lechuza con carta',pos:'upper-right',motion:'owl-hover',scale:.53}],props:[{src:'letter.svg',alt:'carta mágica',pos:'upper-mid',motion:'letter-glow',scale:.34}],caption:complete?'The letter changed everything.':'Something is coming to the window…',label:'YOUR STORY'})}
  ${meqGuideVisual(complete?'Ya sabés cómo empieza. Repetir ahora sirve para fluidez y memoria.':'Primero mirás. Después escuchás. Recién cuando la escena tiene sentido, te toca usar el inglés.')}
  <div class="scene-skill-row"><span>👀 mirar</span><span>👂 escuchar</span><span>🎤 hablar</span><span>🧠 recordar</span></div>
  <button id="chapterStart" class="btn primary wide">${complete?'Jugar de nuevo →':'Empezar la historia →'}</button>${complete?'<button id="chapter2Teaser" class="btn secondary wide" style="margin-top:9px">Ir a Chapter 2 →</button>':''}</section>`;
  $('chapterStart').onclick=showChapter1Scene1;if(complete)$('chapter2Teaser').onclick=showChapter2Teaser;
};

showChapter1Scene1 = function(){
  state.chapter1Scene=1;saveState();
  screen.innerHTML=`<section class="card word-stage scene-card">${meqSceneProgress('✉️ Chapter 1',1,8)}<div class="eyebrow">Your Owl Arrives</div>
  ${meqSceneFrame({backdrop:'moon_room.svg',actors:[{src:'amanda.svg',alt:'protagonista',pos:'left-ground',scale:.72},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.66},{src:'owl.svg',alt:'lechuza',pos:'upper-right',motion:'owl-fly-in',scale:.58}],props:[{src:'letter.svg',alt:'carta',pos:'owl-letter-prop',motion:'letter-glow',scale:.28}],caption:'Milo points at the window.'})}
  <div class="prompt">Milo señala la ventana. Primero mirás y escuchás.</div><button id="c1listen" class="sound-orb">🔊</button><div id="c1KnownLook" class="big-word visual-command hidden">LOOK!</div><button id="c1RevealLook" class="btn secondary">🔤 Ver lo que escuché</button><p class="instruction">La escritura es un segundo paso opcional.</p><button id="c1next" class="btn primary wide">La lechuza aterriza →</button></section>`;
  setTimeout(()=>speak('Look!'),300);$('c1listen').onclick=()=>speak('Look!');$('c1RevealLook').onclick=()=>{c1RevealWritten('c1KnownLook');$('c1RevealLook').disabled=true};$('c1next').onclick=showChapter1Scene1b;
};

showChapter1Scene1b = function(){
  screen.innerHTML=`<section class="card word-stage scene-card">${meqSceneProgress('✉️ Chapter 1',1,8)}<div class="eyebrow">Your Owl Arrives</div>
  <div class="object-pair"><button id="owlWord" class="visual-object-card">${meqImg('owl.svg','owl')}<b id="owlWritten" class="hidden">OWL</b><small>🔊 tocar</small></button><button id="letterWord" class="visual-object-card">${meqImg('letter.svg','letter')}<b id="letterWritten" class="hidden">LETTER</b><small>🔊 tocar</small></button></div>
  <p class="instruction">Imagen + sonido primero. Son palabras narrativas que la historia necesita.</p><button id="c1RevealStoryWords" class="btn secondary wide">🔤 Ver palabras</button><button id="c1hello" class="btn primary wide" style="margin-top:10px">Saludar →</button></section>`;
  $('owlWord').onclick=()=>speak('owl');$('letterWord').onclick=()=>speak('letter');$('c1RevealStoryWords').onclick=()=>{c1RevealWritten('owlWritten');c1RevealWritten('letterWritten');$('c1RevealStoryWords').disabled=true};$('c1hello').onclick=()=>{speak('Hello!');c1Award('scene1',25);screen.innerHTML=`<section class="card reward-card scene-card">${meqSceneProgress('✉️ Chapter 1',1,8)}${meqSceneFrame({backdrop:'moon_room.svg',actors:[{src:'amanda.svg',alt:'protagonista',pos:'left-ground',scale:.74},{src:'owl.svg',alt:'lechuza',pos:'center-air',motion:'gentle-bob',scale:.58}],props:[{src:'letter.svg',alt:'carta',pos:'center-letter',motion:'letter-glow',scale:.34}],caption:'Hello!'})}<h1 class="title">La historia respondió.</h1><p class="subtitle">Una palabra aprendida antes acaba de convertirse en herramienta narrativa.</p><button id="c1s1continue" class="btn primary wide">Tomar la carta →</button></section>`;$('c1s1continue').onclick=c1Scene2};
};

// A true visual-search mini-game instead of four isolated emoji buttons.
c1FindKey = function(){
  screen.innerHTML=`<section class="card word-stage scene-card">${meqSceneProgress('✉️ Chapter 1',6,8)}<div class="eyebrow">Can You Help?</div><div class="prompt">Escuchá y buscá.</div><button id="findKeyAudio" class="sound-orb">🔊</button>
  <div class="hotspot-room">${meqImg('moon_room.svg','','hotspot-bg')}
    <button class="room-hotspot hs-book" data-id="book" aria-label="book">📘</button>
    <button class="room-hotspot hs-bag" data-id="bag" aria-label="bag">🎒</button>
    <button class="room-hotspot hs-chair" data-id="chair" aria-label="chair">🪑</button>
    <button class="room-hotspot hs-key" data-id="key" aria-label="key">${meqImg('magic_key.svg','key')}</button>
  </div><div id="findKeyFb" class="feedback"></div><div class="microcopy">No hay palabra escrita sobre los objetos: escuchás y buscás en una escena real.</div></section>`;
  setTimeout(()=>speak('Find the key.'),260);$('findKeyAudio').onclick=()=>speak('Find the key.');
  document.querySelectorAll('.room-hotspot').forEach(b=>b.onclick=()=>{const ok=b.dataset.id==='key';meqRecordTextUnits?.('Find the key.',ok,{dimensions:['listening','usage'],context:'c1:s6:find_key_room',mode:'audio_to_visual_search',helpLevel:0});if(ok){b.classList.add('found');$('findKeyFb').className='feedback good';$('findKeyFb').textContent='🔑 Found it!';playSfx('success');setTimeout(c1CanTransfer,750)}else{b.classList.add('missed');$('findKeyFb').className='feedback soft';$('findKeyFb').textContent='Ese objeto no abre el portón. Escuchá otra vez.';playSfx('retry');speak('Find the key.',true);setTimeout(()=>b.classList.remove('missed'),500)}});
};

c1Ending = function(){
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">Chapter 1 complete</div><h1 class="title">The Magic Letter · End</h1>${meqSceneFrame({backdrop:'castle_night.svg',actors:[{src:'amanda.svg',alt:'protagonista',pos:'left-ground',scale:.69},{src:'milo.svg',alt:'Milo',pos:'right-ground',scale:.62}],caption:'The academy doors close behind you.',label:'STORY COMPLETE'})}<p class="subtitle">La primera historia terminó de verdad. En el pasillo, una luz verde sale de una cocina y Milo frena en seco.</p>${meqGuideVisual('Una historia cerró. La próxima reutiliza lo aprendido y agrega sólo el inglés que el nuevo misterio necesita.')}<button id="chapter2FromEnding" class="btn primary wide">Empezar la siguiente historia →</button></section>`;$('chapter2FromEnding').onclick=showChapter2Teaser;
};

// ---- Chapter 2 visual upgrade ----
showChapter2Intro = function(){
  ensureC2State();setActiveNav('story');const complete=!!state.chapter2Complete;
  screen.innerHTML=`<section class="card hero-card scene-card"><div class="eyebrow">${complete?'Chapter 2 complete':'Nueva historia desbloqueada'}</div><h1 class="title">Chapter 2 · Potion Mystery</h1><p class="subtitle">${complete?'El misterio está resuelto, pero la cocina queda disponible para practicar.':'Una poción cambió de color y alguien movió los ingredientes. Para reconstruir lo que pasó necesitás mirar, escuchar y actuar.'}</p>
  ${meqSceneFrame({backdrop:'potion_lab.svg',actors:[{src:'milo.svg',alt:'Milo',pos:'right-ground',motion:'gentle-bob',scale:.62},{src:'amanda.svg',alt:'Amanda',pos:'left-ground',scale:.66}],caption:complete?'Mystery solved.':'One bottle is wrong…',label:'POTION KITCHEN'})}
  ${meqGuideVisual(complete?'Podés repetir para fluidez. Las recompensas familiares de dominio son de una sola vez.':'No vas a memorizar una lista de colores. Los colores importan porque son pistas del misterio.')}
  <div class="scene-skill-row"><span>🎨 color</span><span>📏 tamaño</span><span>🍎 objetos</span><span>📍 posición</span><span>🎤 voz</span></div>
  <button id="c2Start" class="btn primary wide">${complete?'Jugar de nuevo →':'Entrar a la cocina →'}</button>${complete?'<button id="c2Campaign" class="btn secondary wide" style="margin-top:9px">📚 Ver campaña</button>':''}</section>`;
  $('c2Start').onclick=c2Scene1;if(complete)$('c2Campaign').onclick=showCampaign;
};

// Replace Chapter 2 spatial clue screen with a reusable move-the-object interaction.
c2Scene5 = function(){
  ensureC2State();state.chapter2Scene=5;saveState();session={round:0,spatialTasks:[
    {audio:'The apple is on the table.',target:'on',object:'🍎',objectName:'apple'},
    {audio:'The milk is under the table.',target:'under',object:'🥛',objectName:'milk'},
    {audio:'The key is in the bag.',target:'in',objectImg:'magic_key.svg',objectName:'key'}
  ]};renderC2SpatialMove();
};

function renderC2SpatialMove(){
  if(session.round>=session.spatialTasks.length){c2Award('scene5',50);return c2Scene6();}
  const t=session.spatialTasks[session.round],obj=t.objectImg?meqImg(t.objectImg,t.objectName,'move-object-img'):t.object;
  screen.innerHTML=`<section class="card word-stage scene-card">${c2Header(5,'Where Is It?')}<div class="prompt">Escuchá la pista y mové el objeto al lugar correcto.</div><button id="spatialAudio" class="sound-orb">🔊</button>
  <div class="move-board"><div id="movePiece" class="move-piece" role="button" tabindex="0" aria-label="${t.objectName}">${obj}</div>
    <button class="move-zone zone-in" data-id="in"><span>🎒</span><small>dentro</small></button>
    <button class="move-zone zone-on" data-id="on"><span>🪵</span><small>encima</small></button>
    <button class="move-zone zone-under" data-id="under"><span>🪵<br>⬇️</span><small>debajo</small></button>
  </div><div id="spatialFb" class="feedback"></div><div class="microcopy">En móvil se puede tocar un destino; en escritorio también se puede arrastrar.</div></section>`;
  setTimeout(()=>speak(t.audio),250);$('spatialAudio').onclick=()=>speak(t.audio);
  const check=(id)=>{const ok=id===t.target;c2Record('listening',ok);c2Record('usage',ok);document.querySelectorAll('.move-zone').forEach(z=>z.disabled=true);const z=document.querySelector(`.move-zone[data-id="${id}"]`);if(z)z.classList.add(ok?'correct':'wrong');$('spatialFb').className=`feedback ${ok?'good':'soft'}`;$('spatialFb').textContent=ok?'✨ La escena quedó igual que la frase.':'Todavía no coincide con la frase. Milo la repite lento.';if(!ok){playSfx('retry');speak(t.audio,true)}else playSfx('success');setTimeout(()=>{if(ok){session.round++;renderC2SpatialMove()}else renderC2SpatialMove()},900)};
  document.querySelectorAll('.move-zone').forEach(z=>z.onclick=()=>check(z.dataset.id));
  meqAttachDrag(check);
}

function meqAttachDrag(onDrop){
  const piece=document.querySelector('#movePiece'),board=document.querySelector('.move-board');if(!piece||!board||!piece.addEventListener)return;
  let drag=false,startX=0,startY=0,ox=0,oy=0;
  const move=e=>{if(!drag)return;piece.style.transform=`translate(${ox+(e.clientX-startX)}px,${oy+(e.clientY-startY)}px) scale(1.05)`;};
  const up=e=>{if(!drag)return;drag=false;piece.releasePointerCapture?.(e.pointerId);const el=document.elementFromPoint?.(e.clientX,e.clientY);const zone=el?.closest?.('.move-zone');piece.style.transform='';if(zone)onDrop(zone.dataset.id);};
  piece.addEventListener('pointerdown',e=>{drag=true;startX=e.clientX;startY=e.clientY;piece.setPointerCapture?.(e.pointerId);});piece.addEventListener('pointermove',move);piece.addEventListener('pointerup',up);piece.addEventListener('pointercancel',()=>{drag=false;piece.style.transform='';});
}

// Mark current build for acceptance tests / diagnostics.
window.MEQ_BUILD='0.7.0';
