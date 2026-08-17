'use strict';

const CORE = {
  1: {id:'first_signals',title:'First Signals',story:'The Owl Chooses Amanda',icon:'👋',reward:40,units:[
    {id:'hello',en:'hello',es:'hola',visual:'👋',example:'Amanda smiles and waves.'},
    {id:'goodbye',en:'goodbye',es:'chau / adiós',visual:'🚶‍♀️👋',example:'Amanda walks away and waves.'},
    {id:'yes',en:'yes',es:'sí',visual:'✅',example:'Amanda nods.'},
    {id:'no',en:'no',es:'no',visual:'❌',example:'Amanda shakes her head.'},
    {id:'please',en:'please',es:'por favor',visual:'🙏',example:'Amanda asks politely.'}]},
  2: {id:'follow_milo',title:'Follow Milo',story:'A Tiny Hallway',icon:'🦊',reward:40,units:[
    {id:'thank_you',en:'thank you',es:'gracias',visual:'💜',action:'heart'},
    {id:'look',en:'look',es:'mirá',visual:'👀',action:'eyes'},
    {id:'listen',en:'listen',es:'escuchá',visual:'👂',action:'ear'},
    {id:'come',en:'come',es:'vení',visual:'🫴',action:'come'},
    {id:'go',en:'go',es:'andá / ir',visual:'➡️',action:'go'}]},
  3: {id:'me_and_you',title:'Me and You',story:'Name Tags',icon:'🏷️',reward:40,units:[
    {id:'i',en:'I',es:'yo',visual:'🙋‍♀️'},{id:'you',en:'you',es:'vos / tú',visual:'👉'},
    {id:'my',en:'my',es:'mi',visual:'🙋‍♀️🏷️'},{id:'your',en:'your',es:'tu',visual:'👉🏷️'},
    {id:'name',en:'name',es:'nombre',visual:'🏷️'}]},
  4: {id:'tiny_questions',title:'Tiny Questions',story:'The Question Appears',icon:'❓',reward:45,units:[
    {id:'what',en:'what',es:'qué / cuál',visual:'❓✨',example:'Milo points to a mystery object.'},
    {id:'is',en:'is',es:'es / está',visual:'🔗',example:'The scene connects a person with a name.'},
    {id:'am',en:'am',es:'soy / estoy',visual:'🙋‍♀️✨',example:'Amanda points to herself: I am here.'},
    {id:'this',en:'this',es:'esto / este / esta',visual:'👇📘',example:'Milo points to the object close to him.'},
    {id:'here',en:'here',es:'aquí / acá',visual:'📍👇',example:'A glowing marker appears beside Amanda.'}]},
  5: {id:'team',title:'Meet the Team',story:'New Companions',icon:'🤝',reward:45,units:[
    {id:'there',en:'there',es:'allí / allá',visual:'📍➡️'},{id:'friend',en:'friend',es:'amigo/a',visual:'🧒🤝🧒'},
    {id:'help',en:'help',es:'ayuda / ayudar',visual:'🫴✨'},{id:'ready',en:'ready',es:'listo/a',visual:'🎒✅'},
    {id:'good',en:'good',es:'bien / bueno',visual:'⭐👍'}]},
  6: {id:'objects',title:'Five Magic Objects',story:'Prepare the Room',icon:'🔑',reward:50,units:[
    {id:'book',en:'book',es:'libro',visual:'📘'},{id:'key',en:'key',es:'llave',visual:'🔑'},
    {id:'door',en:'door',es:'puerta',visual:'🚪'},{id:'window',en:'window',es:'ventana',visual:'🪟'},
    {id:'bag',en:'bag',es:'bolso / mochila',visual:'🎒'}]},
  7: {id:'room',title:'The Little Room',story:'A Room Before the Trip',icon:'🏠',reward:50,units:[
    {id:'table',en:'table',es:'mesa',visual:'🪵'},{id:'chair',en:'chair',es:'silla',visual:'🪑'},
    {id:'water',en:'water',es:'agua',visual:'💧'},{id:'food',en:'food',es:'comida',visual:'🍎🥪'},
    {id:'home',en:'home',es:'hogar / casa',visual:'🏠'}]},
  8: {id:'actions',title:'Open the Secret Box',story:'The First Clue',icon:'📦',reward:55,units:[
    {id:'open',en:'open',es:'abrir',visual:'📦✨'},{id:'close',en:'close',es:'cerrar',visual:'📦🔒'},
    {id:'take',en:'take',es:'tomar / agarrar',visual:'🤲🔑'},{id:'give',en:'give',es:'dar',visual:'🫴🎁'},
    {id:'find',en:'find',es:'encontrar',visual:'🔎✨'}]},
  9: {id:'platform',title:'At the Platform',story:'Wait for the Academy Ride',icon:'🚉',reward:55,units:[
    {id:'stop',en:'stop',es:'parar',visual:'🛑'},{id:'wait',en:'wait',es:'esperar',visual:'⏳'},
    {id:'sit',en:'sit',es:'sentarse',visual:'🪑⬇️'},{id:'stand',en:'stand',es:'pararse',visual:'🧍'},
    {id:'school',en:'school',es:'escuela',visual:'🏫'}]},
  10: {id:'ready_letter',title:'Ready for the Letter',story:'The Owl Turns Toward You',icon:'🦉',reward:70,units:[
    {id:'happy',en:'happy',es:'feliz',visual:'😊'},{id:'one',en:'one',es:'uno',visual:'1️⃣'},
    {id:'two',en:'two',es:'dos',visual:'2️⃣'},{id:'three',en:'three',es:'tres',visual:'3️⃣'},
    {id:'again',en:'again',es:'otra vez',visual:'🔁'}]}
};

const MAP = [
  ['The Owl Chooses Amanda','hello · goodbye · yes · no · please','👋'],
  ['Follow Milo','look · listen · come · go · thank you','👂'],
  ['Me and You','I · you · my · your · name','🏷️'],
  ['The Question Appears','what · is · am · this · here','❓'],
  ['Meet the Team','friend · help · ready · good','🤝'],
  ['Five Magic Objects','book · key · door · window · bag','🔑'],
  ['The Little Room','table · chair · water · food · home','🏠'],
  ['Open the Secret Box','open · close · take · give · find','📦'],
  ['At the Platform','stop · wait · sit · stand · school','🚉'],
  ['Ready for the Letter','happy · one · two · three · again','🦉']
];

const DEFAULT_STATE = {
  coins:0,
  weeklyCapArs:2000,
  dailyCapArs:null,
  coinValueArs:2,
  currentStep:1,
  unlockedStep:1,
  introSeen:false,
  stage:{},
  claimed:{},
  reviews:{},
  unitMastery:{},
  rewardLedger:[],
  rewardPayouts:{},
  helpUses:0,
  soundOn:true
};

const ALL_UNITS = Object.values(CORE).flatMap((stage,stageIndex)=>
  stage.units.map(unit=>({...unit,stage:Number(Object.keys(CORE)[stageIndex])}))
);
const UNIT_BY_ID = Object.fromEntries(ALL_UNITS.map(unit=>[unit.id,unit]));
const REVIEW_INTERVAL_DAYS=[1,3,7,14,30,60];

let state = loadState();
let session = {};
const screen = document.getElementById('screen');
const $ = (id)=>document.getElementById(id);

const STORAGE_KEY='meq_mvp19';
const LEGACY_STORAGE_KEY='meq_mvp18';
const LEGACY_STORAGE_KEY_PREV='meq_mvp17';
const LEGACY_STORAGE_KEY_1='meq_mvp09';
const LEGACY_STORAGE_KEY_0='meq_mvp08';
const LEGACY_STORAGE_KEY_2='meq_mvp07';
const OLDER_STORAGE_KEY='meq_mvp05';
const OLDEST_STORAGE_KEY='meq_mvp04';
const ANCIENT_STORAGE_KEY='meq_mvp03';
function storageGet(){
  try{return window.localStorage.getItem(STORAGE_KEY)||window.localStorage.getItem(LEGACY_STORAGE_KEY)||window.localStorage.getItem(LEGACY_STORAGE_KEY_PREV)||window.localStorage.getItem(LEGACY_STORAGE_KEY_1)||window.localStorage.getItem(LEGACY_STORAGE_KEY_0)||window.localStorage.getItem(LEGACY_STORAGE_KEY_2)||window.localStorage.getItem(OLDER_STORAGE_KEY)||window.localStorage.getItem(OLDEST_STORAGE_KEY)||window.localStorage.getItem(ANCIENT_STORAGE_KEY)}catch{return window.__meqMemoryState||null}
}
function storageSet(value){
  try{window.localStorage.setItem(STORAGE_KEY,value)}catch{window.__meqMemoryState=value}
}
function loadState(){
  try{
    const saved=JSON.parse(storageGet()||'null');
    return {...structuredClone(DEFAULT_STATE),...(saved||{}),stage:{...(saved?.stage||{})},claimed:{...(saved?.claimed||{})},reviews:{...(saved?.reviews||{})},unitMastery:{...(saved?.unitMastery||{})},rewardLedger:[...(saved?.rewardLedger||[])],rewardPayouts:{...(saved?.rewardPayouts||{})}};
  }catch{return structuredClone(DEFAULT_STATE)}
}
function saveState(){storageSet(JSON.stringify(state));updateHud();}
function money(n){return '$'+Math.round(n).toLocaleString('es-AR')}
function dayKey(ts=Date.now()){const d=new Date(ts);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function weekStartMs(ts=Date.now()){const d=new Date(ts);d.setHours(0,0,0,0);const day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return d.getTime()}
function ensureRewardLedgerMigration(){if((state.rewardLedger||[]).length||!state.coins)return;state.rewardLedger=[{id:'legacy_migration',coins:state.coins,earnedAt:Date.now(),eligibleRealWorld:true,legacy:true}]}
function eligibleArs(){
  ensureRewardLedgerMigration();const start=weekStartMs(),ledger=(state.rewardLedger||[]).filter(e=>e.eligibleRealWorld!==false&&e.earnedAt>=start);
  if(!ledger.length)return 0;let ars=0;
  if(state.dailyCapArs==null||state.dailyCapArs===''){ars=ledger.reduce((n,e)=>n+e.coins*state.coinValueArs,0)}else{
    const groups={};for(const e of ledger){const k=dayKey(e.earnedAt);groups[k]=(groups[k]||0)+e.coins*state.coinValueArs}ars=Object.values(groups).reduce((n,v)=>n+Math.min(Number(state.dailyCapArs)||0,v),0)
  }
  return Math.min(state.weeklyCapArs,ars)
}
function weeklyEligibleCoins(){ensureRewardLedgerMigration();const start=weekStartMs();return (state.rewardLedger||[]).filter(e=>e.eligibleRealWorld!==false&&e.earnedAt>=start).reduce((n,e)=>n+e.coins,0)}
function updateHud(){
  $('coinText').textContent=state.coins;
  $('levelText').textContent='Step '+state.currentStep;
  $('rewardText').textContent=`${money(eligibleArs())} / ${money(state.weeklyCapArs)}`;
  $('headerSubtitle').textContent=state.currentStep<=10?'Before the Letter · Zero English':'The Magic Letter';
}
function speak(text, slow=false){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=slow?.55:.82;u.pitch=1.03;speechSynthesis.speak(u);
}
function speakVaried(text,slow=false,variant=0){
  if(!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text),voices=(speechSynthesis.getVoices?.()||[]).filter(v=>/^en[-_]/i.test(v.lang||''));u.lang=voices[variant%Math.max(1,voices.length)]?.lang||'en-US';if(voices.length>1)u.voice=voices[variant%voices.length];u.rate=slow?.55:.82;u.pitch=1.0;speechSynthesis.speak(u);
}

const successSfx=new Audio('audio/success_chime.wav');
const retrySfx=new Audio('audio/soft_retry.wav');
const magicLoop=new Audio('audio/magic_loop.wav');magicLoop.loop=true;magicLoop.volume=.18;successSfx.volume=.45;retrySfx.volume=.35;
function playSfx(kind){if(!state.soundOn)return;const a=kind==='success'?successSfx:retrySfx;try{a.currentTime=0;a.play().catch(()=>{})}catch{}}
function updateSoundButton(){const b=$('soundBtn');if(!b)return;b.textContent=state.soundOn?'🔊':'🔇';b.classList.toggle('sound-on',state.soundOn)}
function ensureAmbient(){if(state.soundOn&&magicLoop.paused){magicLoop.play().catch(()=>{})}}
function toggleSound(){state.soundOn=!state.soundOn;saveState();updateSoundButton();if(state.soundOn){ensureAmbient()}else{magicLoop.pause()}}
function shuffle(arr){return [...arr].sort(()=>Math.random()-.5)}
function pct(v){return Math.round((v||0)*100)}
function stageData(step){return state.stage[step]||{visual:0,listening:0,speaking:0,usage:0,attempts:0,mastered:false}}
function setStageData(step,patch){state.stage[step]={...stageData(step),...patch};saveState()}
function stageMastery(step){
  const d=stageData(step);
  const speakingWeight = speechRecognitionSupported()?0.18:0;
  const weights={visual:.28,listening:.37,usage:.35-speakingWeight,speaking:speakingWeight};
  return d.visual*weights.visual+d.listening*weights.listening+d.usage*weights.usage+d.speaking*weights.speaking;
}
function canMaster(step){const d=stageData(step);const unitReady=window.MEQPedagogy?window.MEQPedagogy.stageReady(CORE[step].units.map(u=>u.id)):true;return unitReady && stageMastery(step)>=.80 && d.listening>=.75 && d.usage>=.65}
function claim(id,coins){if(state.claimed[id])return;state.claimed[id]=true;state.coins+=coins;state.rewardLedger||=[];state.rewardLedger.push({id,coins,earnedAt:Date.now(),eligibleRealWorld:!String(id).includes('song')});saveState();playSfx('success')}
function speechRecognitionSupported(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}


function scheduleStageReviews(step){for(const u of CORE[step].units)window.MEQPedagogy?.scheduleReview(u.id,'phase0',step);saveState();}
function ensureReviewScheduleFromMastery(){for(const step of Object.keys(CORE).map(Number)){if(!stageData(step).mastered)continue;for(const u of CORE[step].units)window.MEQPedagogy?.scheduleReview(u.id,'phase0',step);}saveState();}
function dueReviews(){const now=Date.now();return Object.values(state.reviews).filter(r=>r.nextDueAt<=now).sort((a,b)=>a.nextDueAt-b.nextDueAt)}
function reviewProgress(unitId){const r=state.reviews[unitId];return r?Math.min(1,r.box/(REVIEW_INTERVAL_DAYS.length-1)):0}
function recordReview(unitId,correct,mode='audio_to_visual'){
  const r=state.reviews[unitId];if(!r)return;
  const now=Date.now();
  if(correct){r.box=Math.min(REVIEW_INTERVAL_DAYS.length-1,r.box+1);r.correctStreak=(r.correctStreak||0)+1;r.nextDueAt=now+REVIEW_INTERVAL_DAYS[r.box]*86400000;playSfx('success')}
  else{r.box=Math.max(0,r.box-1);r.correctStreak=0;r.lapses=(r.lapses||0)+1;r.nextDueAt=now+8*3600000;playSfx('retry')}
  r.lastReviewedAt=now;state.reviews[unitId]=r;const dim=mode==='visual_to_word'?'visual':mode==='free_recall_voice'?'usage':'listening';window.MEQPedagogy?.recordReviewOutcome(unitId,correct,r.box,dim,mode);saveState();
}
function makeReviewDueForDemo(){
  ensureReviewScheduleFromMastery();
  const candidate=Object.values(state.reviews).sort((a,b)=>a.nextDueAt-b.nextDueAt)[0];
  if(candidate){candidate.nextDueAt=Date.now()-1000;state.reviews[candidate.unitId]=candidate;saveState();showReview()}
}
function showReview(){
  ensureReviewScheduleFromMastery();const due=dueReviews();setActiveNav('review');
  if(!due.length){
    const scheduled=Object.values(state.reviews).length;
    screen.innerHTML=`<section class="card review-card"><div class="eyebrow">Repaso inteligente</div><h1 class="title">🧠 Nada pendiente ahora</h1><p class="subtitle">Las palabras vuelven después de 1, 3, 7, 14 y 30+ días. Si una falla, vuelve antes; no reiniciamos toda la lección.</p>${guide('Seguir jugando está perfecto. Cuando una palabra necesite demostrar que sobrevivió en la memoria, yo la voy a traer dentro de un mini-juego.') }<div class="help-box"><b>${scheduled}</b> palabras ya están en la cola de memoria.</div>${scheduled?'<button id="demoReview" class="btn secondary wide" style="margin-top:13px">🧪 Probar un repaso ahora</button>':'<div class="help-box">Primero dominá un escalón para que aparezcan repasos.</div>'}</section>`;
    if(scheduled)$('demoReview').onclick=makeReviewDueForDemo;return;
  }
  session={reviewQueue:due,reviewIndex:0,reviewScore:0};renderReviewCard();
}
function renderReviewCard(){
  const card=session.reviewQueue[session.reviewIndex];if(!card)return finishReviewSession();
  const u=window.MEQPedagogy?.reviewUnit(card.unitId)||UNIT_BY_ID[card.unitId];if(!u){recordReview(card.unitId,false);session.reviewIndex++;return renderReviewCard()}
  const pool=window.MEQPedagogy?.reviewPool(u)||ALL_UNITS,ids=pool.map(x=>x.id),preferred=window.MEQPedagogy?.confusionDistractors(u.id,ids)||[];
  const preferredUnits=preferred.map(id=>pool.find(x=>x.id===id)).filter(Boolean),others=shuffle(pool.filter(x=>x.id!==u.id&&!preferred.includes(x.id)));
  const distractors=[...preferredUnits,...others].slice(0,3),opts=shuffle([u,...distractors]);
  let mode=(card.box||0)>=3&&speechRecognitionSupported()&&!session.reviewForceChoice?'free_recall_voice':(card.box||0)>=2?'visual_to_word':'audio_to_visual';session.reviewMode=mode;
  if(mode==='free_recall_voice'){
    screen.innerHTML=`<section class="card word-stage review-card"><span class="game-label">🧠 Recuerdo libre ${session.reviewIndex+1}/${session.reviewQueue.length}</span><div class="prompt">Mirá la imagen y decí la palabra en inglés. No hay opciones primero.</div><div class="big-emoji">${u.visual}</div><div class="btn-row"><button id="reviewFreeSpeak" class="btn primary">🎤 Decirla</button><button id="reviewFreeFallback" class="btn secondary">Prefiero elegir</button></div><div id="reviewFb" class="feedback"></div><div class="retention-strip">${REVIEW_INTERVAL_DAYS.slice(0,5).map((_,i)=>`<span class="retention-dot ${i<card.box?'on':''}"></span>`).join('')}</div><div class="microcopy">Memoria: caja ${card.box+1} · recuerdo libre · la voz nunca es el único bloqueo</div></section>`;
    $('reviewFreeFallback').onclick=()=>{session.reviewForceChoice=true;renderReviewCard()};
    $('reviewFreeSpeak').onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){session.reviewForceChoice=true;return renderReviewCard()}const r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=5;$('reviewFb').textContent='🎧 Escuchando…';r.onresult=e=>{const alts=[...e.results[0]].map(a=>normalize(a.transcript)),target=normalize(u.en),ok=alts.some(x=>x===target||x.includes(target));if(ok){session.reviewScore++;$('reviewFb').className='feedback good';$('reviewFb').textContent=`🌟 La recuperaste sin opciones: “${alts[0]}”.`;}else{$('reviewFb').className='feedback soft';$('reviewFb').textContent='No la tomo como fallo todavía: podés pasar a opciones.';}if(ok){recordReview(u.id,true,'free_recall_voice');session.reviewForceChoice=false;setTimeout(()=>{session.reviewIndex++;renderReviewCard()},850)}else{setTimeout(()=>{session.reviewForceChoice=true;renderReviewCard()},650)}};r.onerror=()=>{session.reviewForceChoice=true;renderReviewCard()};r.start()};return;
  }
  if(mode==='visual_to_word'){
    screen.innerHTML=`<section class="card word-stage review-card"><span class="game-label">🧠 Transfer check ${session.reviewIndex+1}/${session.reviewQueue.length}</span><div class="prompt">Mirá. ¿Cuál palabra escrita corresponde?</div><div class="big-emoji">${u.visual}</div><p class="instruction">El significado ya se aprendió por imagen + audio. Ahora comprobamos si también lo reconocés al leer, sin español.</p><div class="action-grid">${opts.map(o=>`<button class="action-card review-word-choice" data-id="${o.id}"><div class="action-name">${o.en}</div></button>`).join('')}</div><div id="reviewFb" class="feedback"></div><div class="retention-strip">${REVIEW_INTERVAL_DAYS.slice(0,5).map((_,i)=>`<span class="retention-dot ${i<card.box?'on':''}"></span>`).join('')}</div><div class="microcopy">Memoria: caja ${card.box+1} · contexto distinto · fallos previos ${card.lapses||0}</div></section>`;
    document.querySelectorAll('.review-word-choice').forEach(b=>b.onclick=()=>{document.querySelectorAll('.review-word-choice').forEach(x=>x.disabled=true);const ok=b.dataset.id===u.id;if(ok){b.classList.add('correct');session.reviewScore++;$('reviewFb').className='feedback good';$('reviewFb').textContent='⭐ La reconociste en otro formato.';speak(u.en)}else{b.classList.add('wrong');$('reviewFb').className='feedback soft';$('reviewFb').textContent=`Casi. Era “${u.en}”. Vuelve antes.`;speak(u.en,true)}recordReview(u.id,ok,'visual_to_word');session.reviewForceChoice=false;setTimeout(()=>{session.reviewIndex++;renderReviewCard()},900)});return;
  }
  screen.innerHTML=`<section class="card word-stage review-card"><span class="game-label">🧠 Memory check ${session.reviewIndex+1}/${session.reviewQueue.length}</span><div class="prompt">Escuchá. ¿Cuál es?</div><button id="reviewAudio" class="sound-orb">🔊</button><p class="instruction">No te lo enseñamos de nuevo primero. Queremos ver qué quedó en tu memoria.${preferredUnits.length?' Las opciones incluyen algo que antes podía confundirse.':''}</p><div class="choice-grid">${opts.map(o=>`<button class="choice" data-id="${o.id}">${o.visual}</button>`).join('')}</div><div id="reviewFb" class="feedback"></div><div class="retention-strip">${REVIEW_INTERVAL_DAYS.slice(0,5).map((_,i)=>`<span class="retention-dot ${i<card.box?'on':''}"></span>`).join('')}</div><div class="microcopy">Memoria: caja ${card.box+1} · fallos previos ${card.lapses||0}</div></section>`;
  setTimeout(()=>speakVaried(u.en,false,session.reviewIndex+(card.box||0)),250);$('reviewAudio').onclick=()=>speakVaried(u.en,false,session.reviewIndex+(card.box||0));
  document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{document.querySelectorAll('.choice').forEach(x=>x.disabled=true);const ok=b.dataset.id===u.id;if(ok){b.classList.add('correct');session.reviewScore++;$('reviewFb').className='feedback good';$('reviewFb').textContent='⭐ Lo recordaste sin pista.'}else{b.classList.add('wrong');window.MEQPedagogy?.recordConfusion(u.id,b.dataset.id);$('reviewFb').className='feedback soft';$('reviewFb').textContent=`Casi. Era “${u.en}”. La vas a volver a ver antes.`;speak(u.en,true)}recordReview(u.id,ok,'audio_to_visual');session.reviewForceChoice=false;setTimeout(()=>{session.reviewIndex++;renderReviewCard()},850)});
}
function finishReviewSession(){
  const total=session.reviewQueue.length,score=session.reviewScore;
  screen.innerHTML=`<section class="card reward-card"><div class="big-emoji">🧠✨</div><div class="eyebrow">Repaso terminado</div><h1 class="title">${score}/${total} recordadas</h1><p class="subtitle">Esto mide retención, no velocidad. Las acertadas se alejan en el calendario; las que costaron vuelven antes dentro de otros juegos.</p>${guide(score===total?'La memoria ya hizo el trabajo sola.':'Ahora sabemos exactamente qué necesita volver a aparecer; no hace falta repetir una clase entera.')}<div class="help-box"><b>Una pregunta para Milo:</b> ¿Cómo se sintió este repaso? Esto no cambia tu puntaje.</div><div class="btn-row"><button class="btn secondary review-feel" data-v="easy">😊 Fácil</button><button class="btn secondary review-feel" data-v="medium">😐 Medio</button><button class="btn secondary review-feel" data-v="hard">😵 Difícil</button></div><button id="reviewDone" class="btn primary wide" style="margin-top:14px">Seguir sin responder</button></section>`;
  const done=(rating=null)=>{if(rating){state.selfRatings||=[];state.selfRatings.push({type:'review',rating,score,total,at:Date.now()});state.selfRatings=state.selfRatings.slice(-100);saveState();}$('reviewDone')?.setAttribute('disabled','disabled');showMap()};
  document.querySelectorAll('.review-feel').forEach(b=>b.onclick=()=>done(b.dataset.v));$('reviewDone').onclick=()=>done();
}
function guide(text){return `<div class="guide-row"><div class="guide-avatar">🦊</div><div class="guide-bubble">${text}</div></div>`}
function intro(){
  state.currentStep=1;saveState();
  screen.innerHTML=`
    <section class="card hero-card">
      <div class="eyebrow">Prólogo · Antes de tu carta</div>
      <h1 class="title">Primero mirás. Después jugás.</h1>
      <p class="subtitle">No sabés ni una palabra de inglés todavía. Perfecto. Amanda va primero para que veas cómo funciona.</p>
      <div class="scene-art"><div class="stars"></div><div class="moon"></div><div class="scene-characters"><span>👧🏻</span><span class="owl-letter">🦉✉️</span><span>🦊</span></div></div>
      ${guide('Mirá a Amanda. No tenés que responder nada todavía. Primero vamos a conectar imagen, sonido y situación.')}
      <div class="btn-row" style="margin-top:14px"><button id="watchIntro" class="btn primary wide">▶ Ver la primera escena</button></div>
    </section>`;
  $('watchIntro').onclick=playIntroScene;
}

function playIntroScene(){
  ensureAmbient();
  const beats=[
    {art:'👧🏻 👋 🦊',word:'Hello!',es:'Amanda y Milo se saludan.'},
    {art:'🦊 ✅ 👧🏻',word:'Yes.',es:'Amanda asiente.'},
    {art:'👧🏻 ❌ 🦊',word:'No.',es:'Amanda niega.'},
    {art:'🦊 🙏 ✉️',word:'Please.',es:'Milo pide algo con amabilidad.'},
    {art:'👧🏻 🚶‍♀️👋 🦊',word:'Goodbye!',es:'Amanda se va y se despide.'}
  ];
  session={beat:0,beats};renderIntroBeat();
}
function renderIntroBeat(){
  const b=session.beats[session.beat];
  screen.innerHTML=`
    <section class="card word-stage">
      <span class="game-label">🎬 Mirar primero</span>
      <div class="big-emoji">${b.art}</div>
      <div class="big-word">${b.word}</div>
      <p class="subtitle">Todavía no hace falta traducir. Mirá qué ocurre y escuchá.</p>
      <button id="hearBeat" class="sound-orb">🔊</button>
      <div class="step-dots">${session.beats.map((_,i)=>`<div class="dot ${i<session.beat?'done':i===session.beat?'now':''}"></div>`).join('')}</div>
      <div class="btn-row"><button id="introHelp" class="btn secondary">💡 ¿Qué pasó?</button><button id="nextBeat" class="btn primary">${session.beat===session.beats.length-1?'Ahora juego yo →':'Siguiente →'}</button></div>
      <div id="introMeaning" class="help-box hidden"></div>
    </section>`;
  setTimeout(()=>speak(b.word),300);
  $('hearBeat').onclick=()=>speak(b.word);
  $('introHelp').onclick=()=>{$('introMeaning').textContent=b.es;$('introMeaning').classList.remove('hidden')};
  $('nextBeat').onclick=()=>{if(session.beat<session.beats.length-1){session.beat++;renderIntroBeat()}else{state.introSeen=true;saveState();startStep(1)}};
}

function startStep(step){
  if(step>state.unlockedStep)return showMap();
  state.currentStep=step;saveState();
  if(step===1)return step1Overview();
  if(step===2)return step2Overview();
  if(step===3)return step3Overview();
  if(step===4)return step4Overview();
  if(step>=5 && step<=10)return genericStepOverview(step);
  showLockedPreview(step);
}

function step1Overview(){
  const d=stageData(1);const m=stageMastery(1);
  screen.innerHTML=`
    <section class="card hero-card">
      <div class="eyebrow">Escalón 1 de 10</div><h1 class="title">👋 First Signals</h1>
      <p class="subtitle">Cinco señales que vas a ver muchas veces en la aventura. No memorizamos una lista: las vemos en acción.</p>
      ${guide('Primero vamos a reconocerlas. Después vas a escuchar sin ver la palabra. Al final probamos tu voz.')}
      <div class="mastery-grid">
        ${metric('Visual',d.visual)}${metric('Escucha',d.listening)}${metric('Uso',d.usage)}${metric('Voz',d.speaking)}
      </div>
      <div style="margin:14px 0 7px;font-size:12px;font-weight:900">Dominio total ${pct(m)}%</div><div class="progress"><div style="width:${pct(m)}%"></div></div>
      <div class="btn-row" style="margin-top:15px"><button id="startLearn" class="btn primary wide">🎮 Empezar los juegos</button></div>
    </section>`;
  $('startLearn').onclick=()=>startObserve(1);
}
function metric(name,v){const p=pct(v);return `<div class="metric ${p>=75?'good':'warn'}"><div class="metric-name">${name}</div><div class="metric-value">${p}%</div></div>`}

function startObserve(step){session={step,index:0,help:0};renderObserve();}
function renderObserve(){
  const s=CORE[session.step],u=s.units[session.index];window.MEQPedagogy?.present(u.id,'phase0',`phase0:${session.step}:observe:${session.index}`);
  screen.innerHTML=`
    <section class="card word-stage">
      <span class="game-label">👀 Ver + 👂 escuchar</span>
      <div class="big-emoji">${u.visual}</div><div id="observeWritten" class="big-word hidden">${u.en.toUpperCase()}</div>
      <button id="listenWord" class="sound-orb">🔊</button>
      <p class="instruction">Primero imagen + sonido. La palabra escrita aparece después, si la querés mirar.</p>
      <div class="step-dots">${s.units.map((_,i)=>`<div class="dot ${i<session.index?'done':i===session.index?'now':''}"></div>`).join('')}</div>
      <div class="btn-row"><button id="slowWord" class="btn secondary">🐢 Lento</button><button id="revealWord" class="btn secondary">🔤 Ver palabra</button><button id="wordHelp" class="btn secondary">💡 Ayuda</button><button id="nextWord" class="btn primary">${session.index===s.units.length-1?'Ir al juego →':'Siguiente →'}</button></div>
      <div id="wordHelpBox" class="help-box hidden"></div>
    </section>`;
  setTimeout(()=>speak(u.en),250);
  $('listenWord').onclick=()=>speak(u.en);$('slowWord').onclick=()=>speak(u.en,true);$('revealWord').onclick=()=>{$('observeWritten').classList.remove('hidden');$('revealWord').disabled=true};
  $('wordHelp').onclick=()=>progressiveHelp(u,'wordHelpBox');
  $('nextWord').onclick=()=>{if(session.index<s.units.length-1){session.index++;session.help=0;renderObserve()}else{setStageData(session.step,{visual:Math.max(stageData(session.step).visual,.65)});startSoundMatch(session.step)}};
}
function progressiveHelp(u,id){
  session.help=Math.min(4,(session.help||0)+1);window.MEQPedagogy?.recordHelp(u.id,session.help,'phase0',`phase0:${session.step}:help`);const box=$(id);box.classList.remove('hidden');
  if(session.help===1) box.innerHTML='👀 Mirá el gesto o símbolo. ¿Qué está pasando?';
  else if(session.help===2){box.innerHTML='🐢 Escuchala más despacio.';speak(u.en,true)}
  else if(session.help===3) box.innerHTML=`✨ Otro ejemplo: ${u.example||'Milo muestra la misma idea de otra manera.'}`;
  else box.innerHTML=`🇦🇷 <b>${u.en}</b> = ${u.es}`;
}

function startSoundMatch(step){
  session={step,round:0,score:0,targets:shuffle(CORE[step].units),help:0};renderSoundMatch();
}
function renderSoundMatch(){
  const s=CORE[session.step],target=session.targets[session.round];
  const opts=shuffle([target,...shuffle(s.units.filter(x=>x.id!==target.id)).slice(0,3)]);
  screen.innerHTML=`
    <section class="card">
      <span class="game-label">👂 Juego 1 · Escuchá y elegí</span>
      <div class="prompt">¿Qué escuchaste?</div><div class="instruction">Ahora escondemos la palabra. Elegí por sonido + imagen.</div>
      <button id="playTarget" class="sound-orb">🔊</button>
      <div class="choice-grid">${opts.map(o=>`<button class="choice" data-id="${o.id}">${o.visual}</button>`).join('')}</div>
      <div id="matchFeedback" class="feedback"></div>
      <div class="btn-row"><button id="matchSlow" class="btn secondary">🐢 Lento</button><button id="matchHelp" class="btn secondary">💡 Ayuda</button></div>
      <div id="matchHelpBox" class="help-box hidden"></div>
    </section>`;
  setTimeout(()=>speak(target.en),280);$('playTarget').onclick=()=>speak(target.en);$('matchSlow').onclick=()=>{session.help=Math.max(session.help||0,2);window.MEQPedagogy?.recordHelp(target.id,2,'phase0',`phase0:${session.step}:sound:slow`);speak(target.en,true)};$('matchHelp').onclick=()=>progressiveHelp(target,'matchHelpBox');
  document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>answerMatch(b,target));
}
function answerMatch(btn,target){
  const ok=btn.dataset.id===target.id,ctx=`phase0:${session.step}:sound:${target.id}`;const meta={source:'phase0',context:ctx,mode:'audio_to_visual',helpLevel:session.help||0,distractorId:ok?null:btn.dataset.id};window.MEQPedagogy?.record(target.id,'listening',ok,1,meta);window.MEQPedagogy?.record(target.id,'visual',ok,1,meta);document.querySelectorAll('.choice').forEach(x=>x.disabled=true);
  if(ok){btn.classList.add('correct');session.score++;claim(`s${session.step}_listen_${target.id}`,3);$('matchFeedback').className='feedback good';$('matchFeedback').textContent='⭐ ¡Bien! Entendiste el sonido.';}
  else{btn.classList.add('wrong');$('matchFeedback').className='feedback soft';$('matchFeedback').textContent='🦊 Casi. Escuchala de nuevo y mirá la escena correcta.';speak(target.en,true)}
  setTimeout(()=>{session.round++;session.help=0;if(session.round<session.targets.length)renderSoundMatch();else finishListeningGame()},850);
}
function finishListeningGame(){
  const ratio=session.score/session.targets.length;const d=stageData(session.step);setStageData(session.step,{listening:Math.max(d.listening,ratio),visual:Math.max(d.visual,ratio)});
  if(session.step===1) startContextGame1(); else if(session.step===2) startMiloSays(); else if(session.step===3) startNameTagGame(); else if(session.step===4) startTinyQuestionGame(); else if(session.step>=5 && session.step<=10) startGenericUsage(session.step); else startPronunciation(session.step);
}

function startContextGame1(){
  const scenarios=[
    {q:'Mirá la escena. ¿Qué palabra encaja?',target:'please',art:'👧🏻 🙏 ✉️'},
    {q:'Mirá la escena. ¿Qué palabra encaja?',target:'yes',art:'🦊 ❓ 👧🏻 ✅'},
    {q:'Mirá la escena. ¿Qué palabra encaja?',target:'no',art:'👧🏻 ❌ 🔴'},
    {q:'Mirá la escena. ¿Qué palabra encaja?',target:'hello',art:'👧🏻 👋 🦊'},
    {q:'Mirá la escena. ¿Qué palabra encaja?',target:'goodbye',art:'👧🏻 🚶‍♀️👋'}
  ];session={step:1,round:0,score:0,scenarios:shuffle(scenarios)};renderContext1();
}
function renderContext1(){
  const sc=session.scenarios[session.round],s=CORE[1],opts=shuffle([s.units.find(x=>x.id===sc.target),...shuffle(s.units.filter(x=>x.id!==sc.target)).slice(0,2)]);
  screen.innerHTML=`<section class="card word-stage"><span class="game-label">🎭 Juego 2 · Usalo en situación</span><div class="big-emoji">${sc.art}</div><div class="prompt">${sc.q}</div><div class="action-grid">${opts.map(o=>`<button class="action-card" data-id="${o.id}"><div class="action-icon">${o.visual}</div></button>`).join('')}</div><div id="contextFeedback" class="feedback"></div></section>`;
  document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===sc.target;window.MEQPedagogy?.record(sc.target,'usage',ok,1,{source:'phase0',context:`phase0:1:context:${sc.target}`,mode:'context_use',helpLevel:0,distractorId:ok?null:b.dataset.id});document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);if(ok){b.classList.add('correct');session.score++;claim(`s1_use_${sc.target}`,3);$('contextFeedback').className='feedback good';$('contextFeedback').textContent='✨ Exacto. La palabra hizo algo dentro de la historia.'}else{b.classList.add('wrong');$('contextFeedback').className='feedback soft';$('contextFeedback').textContent='Probemos otra vez con la escena en mente.'}setTimeout(()=>{session.round++;session.round<session.scenarios.length?renderContext1():finishUsage1()},800)});
}
function finishUsage1(){const ratio=session.score/session.scenarios.length;const d=stageData(1);setStageData(1,{usage:Math.max(d.usage,ratio)});startPronunciation(1)}

function startPronunciation(step){
  const s=CORE[step];const targets=step===1?s.units.slice(0,3):s.units.slice(0,3);session={step,round:0,score:0,targets};renderPronunciation();
}
function renderPronunciation(){
  const u=session.targets[session.round];const supported=speechRecognitionSupported();
  screen.innerHTML=`<section class="card word-stage"><span class="game-label">🎤 Juego 3 · Probá tu voz</span><div class="big-emoji">${u.visual}</div><div class="big-word">${u.en}</div><p class="instruction">Primero escuchá. Después repetí. No buscamos acento perfecto: buscamos que se entienda.</p><button id="voiceListen" class="sound-orb">🔊</button><div class="btn-row"><button id="voiceSlow" class="btn secondary">🐢 Lento</button><button id="voiceTry" class="btn ${supported?'primary':'secondary'}" ${supported?'':'disabled'}>🎤 ${supported?'Hablar':'Voz no disponible aquí'}</button><button id="voiceSkip" class="btn secondary">Seguir sin micrófono →</button></div><div id="voiceFeedback" class="feedback"></div>${!supported?'<div class="help-box">Este navegador no ofrece reconocimiento de voz. En la app Flutter esta prueba se hará con el motor de voz. En Phase 0 la voz suma evidencia, pero no es el único bloqueo.</div>':''}</section>`;
  setTimeout(()=>speak(u.en),250);$('voiceListen').onclick=()=>speak(u.en);$('voiceSlow').onclick=()=>speak(u.en,true);if(supported)$('voiceTry').onclick=()=>recognize(u);$('voiceSkip').onclick=nextVoiceRound;
  if(!supported)setTimeout(nextVoiceRound,900);
}
function normalize(s){return s.toLowerCase().replace(/[.,!?]/g,'').trim()}
function recognize(u){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=3;$('voiceFeedback').textContent='🎧 Escuchando…';
  r.onresult=e=>{const alts=[...e.results[0]].map(a=>normalize(a.transcript));const target=normalize(u.en);const ok=alts.some(x=>x===target||x.includes(target));window.MEQPedagogy?.record(u.id,'speaking',ok,1,{source:'phase0',context:`phase0:${session.step}:voice:${u.id}`,mode:'guided_speech',helpLevel:0});if(ok){session.score++;claim(`s${session.step}_speak_${u.id}`,3);$('voiceFeedback').className='feedback good';$('voiceFeedback').textContent=`🌟 Te entendí: “${alts[0]}”.`}else{$('voiceFeedback').className='feedback soft';$('voiceFeedback').textContent=`Escuché “${alts[0]}”. Probemos más lento.`;speak(u.en,true)}setTimeout(nextVoiceRound,900)};
  r.onerror=()=>{$('voiceFeedback').className='feedback soft';$('voiceFeedback').textContent='No te escuché bien. No pasa nada: probá otra vez.'};r.start();
}
function nextVoiceRound(){session.round++;if(session.round<session.targets.length)renderPronunciation();else finishStage(session.step)}
function syncStageFromUnits(step){
  const units=CORE[step].units.map(u=>window.MEQPedagogy?.unit(u.id)).filter(Boolean);if(!units.length)return stageData(step);
  const avg=dim=>units.reduce((n,u)=>n+(Number(u?.[dim])||0),0)/units.length;const d=stageData(step);
  setStageData(step,{visual:avg('visual'),listening:avg('listening'),usage:avg('usage'),speaking:Math.max(d.speaking,avg('speaking'))});return stageData(step);
}
function finalizeStageGate(step){
  syncStageFromUnits(step);const passed=canMaster(step);if(passed){setStageData(step,{mastered:true});scheduleStageReviews(step);claim(`stage_${step}_mastered`,CORE[step]?.reward||40);if(state.unlockedStep===step)state.unlockedStep=Math.min(10,step+1);if(step===10)state.phase0Complete=true;saveState()}return passed;
}
function finishStage(step){
  const d=stageData(step);const speakScore=speechRecognitionSupported()?session.score/session.targets.length:d.speaking;setStageData(step,{speaking:Math.max(d.speaking,speakScore),attempts:(d.attempts||0)+1});
  renderStageResult(step,finalizeStageGate(step));
}
function startAdaptiveRepair(step){
  const ids=CORE[step].units.map(u=>u.id),plans=window.MEQPedagogy?.microCheckSpec(ids,3)||[];if(!plans.length)return renderStageResult(step,finalizeStageGate(step));
  session={step,repairPlans:plans,repairIndex:0,help:0};renderAdaptiveRepair();
}
function renderAdaptiveRepair(){
  const plan=session.repairPlans[session.repairIndex];if(!plan)return finishAdaptiveRepair();const target=CORE[session.step].units.find(u=>u.id===plan.unitId)||UNIT_BY_ID[plan.unitId];if(!target){session.repairIndex++;return renderAdaptiveRepair()}
  const stageUnits=CORE[session.step].units,preferred=window.MEQPedagogy?.confusionDistractors(target.id,stageUnits.map(x=>x.id))||[];const distractorIds=[...preferred,...stageUnits.map(x=>x.id).filter(id=>id!==target.id&&!preferred.includes(id))].slice(0,3);const opts=shuffle([target,...distractorIds.map(id=>stageUnits.find(x=>x.id===id)).filter(Boolean)]);
  screen.innerHTML=`<section class="card word-stage"><span class="game-label">🦊 Refuerzo inteligente ${session.repairIndex+1}/${session.repairPlans.length}</span><div class="prompt">Escuchá y resolvé una sola debilidad: <b>${plan.dimension==='listening'?'escucha':plan.dimension==='visual'?'reconocimiento':'uso'}</b>.</div><button id="repairAudio" class="sound-orb">🔊</button><div class="choice-grid">${opts.map(o=>`<button class="choice repair-choice" data-id="${o.id}">${o.visual}</button>`).join('')}</div><div id="repairFb" class="feedback"></div><div class="btn-row"><button id="repairSlow" class="btn secondary">🐢 Lento</button><button id="repairHelp" class="btn secondary">💡 Ayuda</button></div><div id="repairHelpBox" class="help-box hidden"></div>${plan.confusedWith?`<div class="microcopy">Milo detectó una posible confusión con <b>${plan.confusedWith.replaceAll('_',' ')}</b>.</div>`:''}</section>`;
  setTimeout(()=>speak(target.en),240);$('repairAudio').onclick=()=>speak(target.en);$('repairSlow').onclick=()=>{session.help=Math.max(session.help||0,2);window.MEQPedagogy?.recordHelp(target.id,2,'repair',`phase0:${session.step}:repair:slow`);speak(target.en,true)};$('repairHelp').onclick=()=>progressiveHelp(target,'repairHelpBox');
  document.querySelectorAll('.repair-choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===target.id,ctx=`phase0:${session.step}:repair:${target.id}:${session.repairIndex}`,meta={source:'repair',context:ctx,mode:'adaptive_repair',helpLevel:session.help||0,distractorId:ok?null:b.dataset.id};window.MEQPedagogy?.record(target.id,'listening',ok,1,meta);window.MEQPedagogy?.record(target.id,'visual',ok,1,meta);if(plan.dimension==='usage')window.MEQPedagogy?.record(target.id,'usage',ok,1,{...meta,context:ctx+':use'});document.querySelectorAll('.repair-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('repairFb').className=`feedback ${ok?'good':'soft'}`;$('repairFb').textContent=ok?'✨ Esa debilidad quedó mejor medida.':'Milo la marca para volver a aparecer; no reiniciamos el escalón.';setTimeout(()=>{session.repairIndex++;session.help=0;renderAdaptiveRepair()},760)});
}
function finishAdaptiveRepair(){const step=session.step;syncStageFromUnits(step);renderStageResult(step,finalizeStageGate(step));}
function renderStageResult(step,passed){
  const d=stageData(step),m=stageMastery(step);
  screen.innerHTML=`<section class="card reward-card"><div class="big-emoji">${passed?'🏆✨':'🦊💪'}</div><div class="eyebrow">Resultado del escalón ${step}</div><h1 class="title">${passed?'¡Dominado!':'Todavía falta un poquito'}</h1><p class="subtitle">${passed?'No avanzaste por tocar pantallas: entendiste y usaste lo aprendido.':'Milo no te hace repetir todo. Vamos directo a lo que necesita refuerzo.'}</p><div class="mastery-grid">${metric('Visual',d.visual)}${metric('Escucha',d.listening)}${metric('Uso',d.usage)}${metric('Voz',d.speaking)}</div><div style="margin:14px 0 7px;font-size:12px;font-weight:900">Dominio ${pct(m)}%</div><div class="progress"><div style="width:${pct(m)}%"></div></div><div class="coin-stack">🪙</div><div><b>${passed?'Premio de dominio acreditado':'Podés volver a intentarlo con otro formato'}</b></div><div class="btn-row" style="margin-top:15px"><button id="resultMap" class="btn secondary">🗺️ Ver mapa</button><button id="resultNext" class="btn primary">${passed&&step<10?'Seguir historia →':passed&&step===10?'La carta llega →':'Reforzar →'}</button></div></section>`;
  $('resultMap').onclick=showMap;$('resultNext').onclick=()=>{if(passed&&step<10)startStep(step+1);else if(passed&&step===10)showChapter1Intro();else startAdaptiveRepair(step)};
}

function step2Overview(){
  const d=stageData(2),m=stageMastery(2);screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Escalón 2 de 10</div><h1 class="title">🦊 Follow Milo</h1><p class="subtitle">Ahora las palabras hacen mover la escena. Milo no traduce: actúa, y vos descubrís qué quiso decir.</p>${guide('Cuando escuches una orden, tocá la acción correcta. Si te trabás, la ayuda va apareciendo de a poco.')}<div class="mastery-grid">${metric('Visual',d.visual)}${metric('Escucha',d.listening)}${metric('Uso',d.usage)}${metric('Voz',d.speaking)}</div><div style="margin:14px 0 7px;font-size:12px;font-weight:900">Dominio total ${pct(m)}%</div><div class="progress"><div style="width:${pct(m)}%"></div></div><button id="s2start" class="btn primary wide" style="margin-top:15px">Entrar al pasillo →</button></section>`;$('s2start').onclick=()=>startObserve(2)
}
function startMiloSays(){
  const s=CORE[2];session={step:2,round:0,score:0,targets:shuffle(s.units),help:0};renderMiloSays();
}
function renderMiloSays(){
  const t=session.targets[session.round];const opts=shuffle(CORE[2].units);
  screen.innerHTML=`<section class="card"><span class="game-label">🦊 Milo Says</span><div class="prompt">Escuchá a Milo y hacé la acción</div><div class="big-emoji">🦊✨</div><button id="miloSpeak" class="sound-orb">🔊</button><div class="action-grid">${opts.map(o=>`<button class="action-card" data-id="${o.id}"><div class="action-icon">${o.visual}</div></button>`).join('')}</div><div id="miloFeedback" class="feedback"></div><div class="btn-row"><button id="miloSlow" class="btn secondary">🐢 Lento</button></div></section>`;setTimeout(()=>speak(t.en),250);$('miloSpeak').onclick=()=>speak(t.en);$('miloSlow').onclick=()=>{session.help=Math.max(session.help||0,2);window.MEQPedagogy?.recordHelp(t.id,2,'phase0','phase0:2:milo:slow');speak(t.en,true)};
  document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.id,meta={source:'phase0',context:`phase0:2:milo:${t.id}`,mode:'command_action',helpLevel:session.help||0,distractorId:ok?null:b.dataset.id};window.MEQPedagogy?.record(t.id,'listening',ok,1,meta);window.MEQPedagogy?.record(t.id,'usage',ok,1,meta);document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);if(ok){b.classList.add('correct');session.score++;claim(`s2_use_${t.id}`,3);$('miloFeedback').className='feedback good';$('miloFeedback').textContent='✨ ¡Eso! Entendiste la orden.'}else{b.classList.add('wrong');$('miloFeedback').className='feedback soft';$('miloFeedback').textContent='Mirá el gesto de Milo y escuchá de nuevo.';speak(t.en,true)}setTimeout(()=>{session.round++;session.help=0;if(session.round<session.targets.length)renderMiloSays();else{const ratio=session.score/session.targets.length;const d=stageData(2);setStageData(2,{usage:Math.max(d.usage,ratio),listening:Math.max(d.listening,ratio)});startPronunciation(2)}},800)})
}

function step3Overview(){
  const d=stageData(3),m=stageMastery(3);screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Escalón 3 de 10</div><h1 class="title">🏷️ Me and You</h1><p class="subtitle">Amanda y Milo intercambian tarjetas con nombres. Primero observás quién es quién. Después aparece la frase.</p>${guide('Todavía no te voy a preguntar “What is your name?”. Antes vamos a construir las piezas que necesitás para entenderla.')}<div class="mastery-grid">${metric('Visual',d.visual)}${metric('Escucha',d.listening)}${metric('Uso',d.usage)}${metric('Voz',d.speaking)}</div><div style="margin:14px 0 7px;font-size:12px;font-weight:900">Dominio total ${pct(m)}%</div><div class="progress"><div style="width:${pct(m)}%"></div></div><button id="s3start" class="btn primary wide" style="margin-top:15px">Ver las tarjetas →</button></section>`;$('s3start').onclick=()=>startObserve(3)
}

function startNameTagGame(){
  const scenarios=[
    {art:'🦊 👉 🦊',target:'i',caption:'Milo se señala a sí mismo.'},
    {art:'🦊 👉 👧🏻',target:'you',caption:'Milo señala a Amanda.'},
    {art:'🦊 🤲 🏷️MILO',target:'my',caption:'Milo sostiene su propia tarjeta.'},
    {art:'🦊 ➡️ 🏷️AMANDA 👧🏻',target:'your',caption:'Milo le devuelve a Amanda su tarjeta.'},
    {art:'🏷️ AMANDA',target:'name',caption:'La tarjeta muestra cómo se llama.'}
  ];
  session={step:3,round:0,score:0,scenarios};renderNameTagGame();
}
function renderNameTagGame(){
  const sc=session.scenarios[session.round],s=CORE[3];
  const answer=s.units.find(x=>x.id===sc.target);const opts=shuffle([answer,...shuffle(s.units.filter(x=>x.id!==sc.target)).slice(0,2)]);
  screen.innerHTML=`<section class="card word-stage"><span class="game-label">🏷️ Juego 2 · ¿Quién es quién?</span><div class="big-emoji">${sc.art}</div><div class="prompt">${sc.caption}</div><div class="instruction">Elegí la pieza inglesa que la escena está mostrando.</div><div class="action-grid">${opts.map(o=>`<button class="action-card" data-id="${o.id}"><div class="action-icon">${o.visual}</div></button>`).join('')}</div><div id="tagFeedback" class="feedback"></div></section>`;
  document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===sc.target;window.MEQPedagogy?.record(sc.target,'usage',ok,1,{source:'phase0',context:`phase0:3:context:${sc.target}`,mode:'context_use',helpLevel:0,distractorId:ok?null:b.dataset.id});document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);if(ok){b.classList.add('correct');session.score++;claim(`s3_use_${sc.target}`,3);$('tagFeedback').className='feedback good';$('tagFeedback').textContent='⭐ Sí. La escena te dio el significado sin una clase de gramática.'}else{b.classList.add('wrong');$('tagFeedback').className='feedback soft';$('tagFeedback').textContent='Mirá de nuevo quién señala o quién tiene la tarjeta.'}setTimeout(()=>{session.round++;if(session.round<session.scenarios.length)renderNameTagGame();else{const r=session.score/session.scenarios.length;const d=stageData(3);setStageData(3,{usage:Math.max(d.usage,r)});startPronunciation(3)}},850)})
}

function step4Overview(){
  const d=stageData(4),m=stageMastery(4);screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Escalón 4 de 10</div><h1 class="title">❓ The Question Appears</h1><p class="subtitle">Ahora sí aparece la primera pregunta, pero Amanda la responde antes. La protagonista nunca recibe una frase que no haya podido construir visualmente.</p>${guide('Primero mirá: “What is your name?” → Amanda señala su tarjeta → “My name is Amanda.” Después te toca reconocer la situación, no memorizar una regla.')}<div class="mastery-grid">${metric('Visual',d.visual)}${metric('Escucha',d.listening)}${metric('Uso',d.usage)}${metric('Voz',d.speaking)}</div><div style="margin:14px 0 7px;font-size:12px;font-weight:900">Dominio total ${pct(m)}%</div><div class="progress"><div style="width:${pct(m)}%"></div></div><button id="s4start" class="btn primary wide" style="margin-top:15px">Mirar a Amanda primero →</button></section>`;$('s4start').onclick=()=>startObserve(4)
}
function startTinyQuestionGame(){
  const scenarios=[
    {art:'🦊 ❓ 🏷️AMANDA 👧🏻',audio:'What is your name?',answer:'name',caption:'Milo hace una pregunta y Amanda mira su tarjeta.'},
    {art:'👧🏻 🙋‍♀️ 📍',audio:'I am here.',answer:'here',caption:'Amanda se señala y aparece un punto luminoso donde está.'},
    {art:'🦊 👇 📘',audio:'This.',answer:'this',caption:'Milo señala un libro que tiene justo al lado.'},
    {art:'❓ 🎁',audio:'What?',answer:'what',caption:'Aparece algo misterioso y Milo pregunta.'},
    {art:'👧🏻 🙋‍♀️ ✨',audio:'I am Amanda.',answer:'am',caption:'Amanda habla de ella misma.'}
  ];session={step:4,round:0,score:0,scenarios};renderTinyQuestionGame();
}
function renderTinyQuestionGame(){
  const sc=session.scenarios[session.round],s=CORE[4];const ans=s.units.find(x=>x.id===sc.answer);const opts=shuffle([ans,...shuffle(s.units.filter(x=>x.id!==sc.answer)).slice(0,2)]);
  screen.innerHTML=`<section class="card word-stage"><span class="game-label">🎬 Juego 2 · Entender la escena</span><div class="big-emoji">${sc.art}</div><div class="prompt">${sc.caption}</div><button id="tinyAudio" class="sound-orb">🔊</button><div class="action-grid">${opts.map(o=>`<button class="action-card" data-id="${o.id}"><div class="action-icon">${o.visual}</div></button>`).join('')}</div><div id="tinyFeedback" class="feedback"></div></section>`;setTimeout(()=>speak(sc.audio),250);$('tinyAudio').onclick=()=>speak(sc.audio);
  document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===sc.answer,meta={source:'phase0',context:`phase0:4:question:${sc.answer}`,mode:'phrase_inference',helpLevel:0,distractorId:ok?null:b.dataset.id};window.MEQPedagogy?.record(sc.answer,'listening',ok,1,meta);window.MEQPedagogy?.record(sc.answer,'usage',ok,1,meta);document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);if(ok){b.classList.add('correct');session.score++;claim(`s4_use_${session.round}`,3);$('tinyFeedback').className='feedback good';$('tinyFeedback').textContent='✨ Exacto. Entendiste la pieza dentro de una frase real.'}else{b.classList.add('wrong');$('tinyFeedback').className='feedback soft';$('tinyFeedback').textContent='No pasa nada: mirá la escena y escuchá una vez más.';speak(sc.audio,true)}setTimeout(()=>{session.round++;if(session.round<session.scenarios.length)renderTinyQuestionGame();else{const r=session.score/session.scenarios.length;const d=stageData(4);setStageData(4,{usage:Math.max(d.usage,r)});startPhraseDemo4()}},900)})
}
function startPhraseDemo4(){
  session={step:4,phraseBeat:0,phraseHelp:0,phraseBeats:[
    {art:'🦊 ❓ 👧🏻 🏷️',en:'What is your name?',es:'¿Cómo te llamás?'},
    {art:'👧🏻 🙋‍♀️ 🏷️AMANDA',en:'My name is Amanda.',es:'Me llamo Amanda.'},
    {art:'👧🏻 📍👇',en:'I am here.',es:'Estoy acá.'}
  ]};renderPhraseDemo4();
}
function renderPhraseDemo4(){const b=session.phraseBeats[session.phraseBeat];screen.innerHTML=`<section class="card word-stage"><span class="game-label">💬 Mirá la mini charla completa</span><div class="big-emoji">${b.art}</div><div class="big-word" style="font-size:28px">${b.en}</div><button id="phraseListen" class="sound-orb">🔊</button><p class="instruction">La traducción está disponible como salvavidas, no aparece sola.</p><div class="btn-row"><button id="phraseHelp" class="btn secondary">🇦🇷 Ayuda</button><button id="phraseNext" class="btn primary">${session.phraseBeat===session.phraseBeats.length-1?'Practicar voz →':'Siguiente →'}</button></div><div id="phraseHelpBox" class="help-box hidden"></div></section>`;setTimeout(()=>speak(b.en),250);$('phraseListen').onclick=()=>speak(b.en);$('phraseHelp').onclick=()=>{session.phraseHelp=Math.min(4,(session.phraseHelp||0)+1);const box=$('phraseHelpBox');box.classList.remove('hidden');if(session.phraseHelp===1)box.textContent='👀 Mirá quién señala, qué objeto aparece y dónde está.';else if(session.phraseHelp===2){box.textContent='🐢 Escuchá la frase más despacio.';speak(b.en,true)}else if(session.phraseHelp===3)box.textContent='✨ Buscá la misma idea en la escena anterior.';else box.textContent=`🇦🇷 ${b.es}`};$('phraseNext').onclick=()=>{session.phraseBeat++;session.phraseHelp=0;session.phraseBeat<session.phraseBeats.length?renderPhraseDemo4():startPronunciation(4)}}


const GENERIC_SCENARIOS = {
  5:[
    {art:'🦊 👉 🌳',target:'there',audio:'Look there.',caption:'Milo señala algo lejos.'},
    {art:'👧🏻 🤝 🧒',target:'friend',audio:'Friend.',caption:'Amanda conoce a otra chica.'},
    {art:'🧒 📚⬇️ 🫴',target:'help',audio:'Help, please.',caption:'Un compañero necesita una mano.'},
    {art:'👧🏻 🎒 ✅',target:'ready',audio:'Ready?',caption:'Amanda tiene su mochila preparada.'},
    {art:'🦊 ⭐ 👍',target:'good',audio:'Good!',caption:'Milo celebra una buena acción.'}
  ],
  6:[
    {art:'📘 ✨',target:'book',audio:'Book.',caption:'Un objeto con páginas.'},
    {art:'🔑 ✨',target:'key',audio:'Key.',caption:'Sirve para abrir algo.'},
    {art:'🚪 ✨',target:'door',audio:'Door.',caption:'La entrada de la habitación.'},
    {art:'🪟 🌙',target:'window',audio:'Window.',caption:'Por acá se ve el cielo.'},
    {art:'🎒 ✨',target:'bag',audio:'Bag.',caption:'Amanda guarda cosas para el viaje.'}
  ],
  7:[
    {art:'📘 ➡️ 🪵',target:'table',audio:'Table.',caption:'Ponemos el libro sobre este mueble.'},
    {art:'👧🏻 ➡️ 🪑',target:'chair',audio:'Chair.',caption:'Amanda necesita sentarse.'},
    {art:'🥵 ➡️ 💧',target:'water',audio:'Water.',caption:'Después del juego necesita tomar.'},
    {art:'😋 ➡️ 🍎🥪',target:'food',audio:'Food.',caption:'Hay algo para comer.'},
    {art:'👧🏻 ❤️ 🏠',target:'home',audio:'Home.',caption:'El lugar al que Amanda llama hogar.'}
  ],
  8:[
    {art:'📦➡️📦✨',target:'open',audio:'Open.',caption:'La caja pasa de cerrada a abierta.'},
    {art:'📦✨➡️📦🔒',target:'close',audio:'Close.',caption:'La caja vuelve a cerrarse.'},
    {art:'🔑➡️🤲',target:'take',audio:'Take the key.',caption:'Agarrá la llave.'},
    {art:'🤲🎁➡️🦊',target:'give',audio:'Give it to Milo.',caption:'Entregale el objeto a Milo.'},
    {art:'🔎 ... 🔑✨',target:'find',audio:'Find the key.',caption:'Buscá hasta encontrar la llave.'}
  ],
  9:[
    {art:'🛑 👧🏻',target:'stop',audio:'Stop.',caption:'Amanda deja de caminar.'},
    {art:'⏳ 🚉',target:'wait',audio:'Wait.',caption:'El transporte todavía no llegó.'},
    {art:'👧🏻 ➡️ 🪑',target:'sit',audio:'Sit here.',caption:'Milo señala el banco.'},
    {art:'🪑 ➡️ 🧍',target:'stand',audio:'Stand.',caption:'Amanda se pone de pie.'},
    {art:'🚉 ➡️ 🏫✨',target:'school',audio:'School.',caption:'Ese es el destino del viaje.'}
  ],
  10:[
    {art:'👧🏻 😊 ✨',target:'happy',audio:'I am happy.',caption:'Amanda sonríe al ver la lechuza.'},
    {art:'⭐',target:'one',audio:'One.',caption:'Una estrella brilla.'},
    {art:'⭐ ⭐',target:'two',audio:'Two.',caption:'Ahora brillan dos.'},
    {art:'⭐ ⭐ ⭐',target:'three',audio:'Three.',caption:'Ahora son tres.'},
    {art:'🎵 🔁 🎵',target:'again',audio:'Again!',caption:'Milo pide repetir el ritmo.'}
  ]
};

function genericStepOverview(step){
  const s=CORE[step],d=stageData(step),m=stageMastery(step);
  const special=step===10?'Este es el último escalón antes de que la lechuza se dé vuelta y la carta sea para vos.':'La historia sigue avanzando porque estas palabras hacen algo dentro de la escena.';
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Escalón ${step} de 10</div><h1 class="title">${s.icon} ${s.title}</h1><p class="subtitle">${special}</p>${guide(step===10?'Vamos a mezclar señales viejas y nuevas. Si las entendés, termina el prólogo.':'Primero observá. Después escuchá sin apoyo y finalmente usá las palabras para mover la historia.')}<div class="mastery-grid">${metric('Visual',d.visual)}${metric('Escucha',d.listening)}${metric('Uso',d.usage)}${metric('Voz',d.speaking)}</div><div style="margin:14px 0 7px;font-size:12px;font-weight:900">Dominio total ${pct(m)}%</div><div class="progress"><div style="width:${pct(m)}%"></div></div><button id="genericStart" class="btn primary wide" style="margin-top:15px">${step===10?'Empezar desafío final →':'Seguir la historia →'}</button></section>`;
  $('genericStart').onclick=()=>startObserve(step);
}

function startGenericUsage(step){
  session={step,round:0,score:0,scenarios:shuffle(GENERIC_SCENARIOS[step])};renderGenericUsage();
}
function renderGenericUsage(){
  const step=session.step,sc=session.scenarios[session.round],s=CORE[step],ans=s.units.find(x=>x.id===sc.target);const opts=shuffle([ans,...shuffle(s.units.filter(x=>x.id!==sc.target)).slice(0,2)]);
  const gameName=step===6?'🔎 Find It':step===8?'📦 Secret Box':step===9?'🚉 Quick Reaction':step===10?'🎵 Rhythm Review':'🎭 Story Use';
  screen.innerHTML=`<section class="card word-stage"><span class="game-label">${gameName}</span><div class="big-emoji">${sc.art}</div><div class="prompt">${sc.caption}</div><button id="genericAudio" class="sound-orb">🔊</button><div class="action-grid">${opts.map(o=>`<button class="action-card" data-id="${o.id}"><div class="action-icon">${o.visual}</div></button>`).join('')}</div><div id="genericFeedback" class="feedback"></div></section>`;
  setTimeout(()=>speak(sc.audio),250);$('genericAudio').onclick=()=>speak(sc.audio);
  document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===sc.target;window.MEQPedagogy?.record(sc.target,'usage',ok,1,{source:'phase0',context:`phase0:${step}:context:${sc.target}`,mode:'context_use',helpLevel:0,distractorId:ok?null:b.dataset.id});document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);if(ok){b.classList.add('correct');session.score++;claim(`s${step}_use_${sc.target}`,3);$('genericFeedback').className='feedback good';$('genericFeedback').textContent='⭐ Bien. La escena y el inglés coincidieron.'}else{b.classList.add('wrong');$('genericFeedback').className='feedback soft';$('genericFeedback').textContent='Mirá la acción y escuchá una vez más.';speak(sc.audio,true)}setTimeout(()=>{session.round++;if(session.round<session.scenarios.length)renderGenericUsage();else{const r=session.score/session.scenarios.length;const d=stageData(step);setStageData(step,{usage:Math.max(d.usage,r)});startPronunciation(step)}},850)})
}

function showChapter1Intro(){
  ensureAmbient();
  setActiveNav('story');
  const complete=!!state.chapter1Complete;
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">${complete?'Capítulo completado':'Prólogo completado'}</div><h1 class="title">✉️ Chapter 1 · The Magic Letter</h1><p class="subtitle">${complete?'Ya terminaste esta historia. Podés recorrerla de nuevo o mirar qué viene después.':'Durante todo el prólogo viste a otros recibir sus cartas. Ahora la lechuza te mira a vos.'}</p><div class="scene-art"><div class="stars"></div><div class="moon"></div><div class="scene-characters"><span>👧🏻</span><span class="owl-letter">🦉✉️✨</span><span>🦊</span></div></div>${guide(complete?'La aventura queda en tu biblioteca. El siguiente capítulo va a pedir un poco más de inglés, no sólo más pantallas.':'Ahora sí. Ya conocés suficiente inglés como para que la historia pueda hablarte sin tirarte al agua de golpe.')}<div class="help-box"><b>Capítulo:</b> 8 escenas. Palabras de historia: owl, letter, magic, castle. Palabras útiles nuevas: room, teacher, student, who, where, can, want, like.</div><button id="chapterStart" class="btn primary wide" style="margin-top:15px">${complete?'Jugar de nuevo →':'Empezar el capítulo →'}</button>${complete?'<button id="chapter2Teaser" class="btn secondary wide" style="margin-top:9px">🔒 Ver Chapter 2</button>':''}</section>`;
  $('chapterStart').onclick=showChapter1Scene1;
  if(complete)$('chapter2Teaser').onclick=showChapter2Teaser;
}

function c1Header(scene,title){return `<span class="game-label">✉️ Chapter 1 · Scene ${scene}/8</span><div class="eyebrow" style="margin-top:12px">${title}</div>`}
function c1Award(id,coins){claim(`chapter1_${id}`,coins)}

function showChapter1Scene1(){
  state.chapter1Scene=1;saveState();
  screen.innerHTML=`<section class="card word-stage">${c1Header(1,'Your Owl Arrives')}<div class="big-emoji">🪟 🌙 🦉✉️</div><div class="prompt">Milo mira hacia la ventana.</div><div class="big-word" style="font-size:30px">LOOK!</div><button id="c1listen" class="sound-orb">🔊</button><p class="instruction">La palabra ya es conocida. Ahora aparece dentro de tu propia historia.</p><div class="btn-row"><button id="c1next" class="btn primary wide">La lechuza aterriza →</button></div></section>`;
  setTimeout(()=>speak('Look!'),250);$('c1listen').onclick=()=>speak('Look!');$('c1next').onclick=showChapter1Scene1b;
}
function showChapter1Scene1b(){
  screen.innerHTML=`<section class="card word-stage">${c1Header(1,'Your Owl Arrives')}<div class="big-emoji">🦉 ✉️</div><div class="prompt">Primero dos palabras nuevas viven dentro de la escena.</div><div class="action-grid"><button id="owlWord" class="action-card"><div class="action-icon">🦉</div><div class="action-name">owl</div></button><button id="letterWord" class="action-card"><div class="action-icon">✉️</div><div class="action-name">letter</div></button></div><div class="help-box">Son palabras narrativas: entran porque esta historia las necesita. El núcleo cotidiano sigue teniendo prioridad.</div><button id="c1hello" class="btn primary wide" style="margin-top:13px">Saludar a la lechuza →</button></section>`;
  $('owlWord').onclick=()=>speak('owl');$('letterWord').onclick=()=>speak('letter');$('c1hello').onclick=()=>{speak('Hello!');c1Award('scene1',25);screen.innerHTML=`<section class="card reward-card">${c1Header(1,'Your Owl Arrives')}<div class="big-emoji">🦉💌✨</div><h1 class="title">Hello!</h1><p class="subtitle">La primera palabra del prólogo ahora hace avanzar tu propia historia.</p>${guide('Perfecto. Ya no es una palabra de ejercicio: es una herramienta dentro de la aventura.')}<button id="c1s1continue" class="btn primary wide" style="margin-top:15px">Tomar la carta →</button></section>`;$('c1s1continue').onclick=c1Scene2};
}

function c1Scene2(){
  state.chapter1Scene=2;saveState();
  session={c1action:0};renderC1Scene2();
}
function renderC1Scene2(){
  const tasks=[
    {audio:'Take the letter.',target:'take',art:'✉️ ➡️ 🤲',opts:[['take','🤲','take'],['give','🫴','give'],['wait','⏳','wait']]},
    {audio:'Open the letter.',target:'open',art:'✉️ 🔒 ➡️ 💌✨',opts:[['open','✨📖','open'],['close','🔒','close'],['stop','🛑','stop']]}
  ];
  const t=tasks[session.c1action];
  screen.innerHTML=`<section class="card word-stage">${c1Header(2,'Open the Letter')}<div class="big-emoji">${t.art}</div><div class="prompt">Escuchá y hacé que la escena cambie.</div><button id="c1s2audio" class="sound-orb">🔊</button><div class="action-grid">${shuffle(t.opts).map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div><div class="action-name">${o[2]}</div></button>`).join('')}</div><div id="c1s2fb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),250);$('c1s2audio').onclick=()=>speak(t.audio);
  document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;document.querySelectorAll('.action-card').forEach(x=>x.disabled=true);if(ok){b.classList.add('correct');$('c1s2fb').className='feedback good';$('c1s2fb').textContent='✨ La orden conocida movió la historia.'}else{b.classList.add('wrong');$('c1s2fb').className='feedback soft';$('c1s2fb').textContent='Escuchá otra vez. Ya conocés esta acción.';speak(t.audio,true)}setTimeout(()=>{if(session.c1action===0){session.c1action=1;renderC1Scene2()}else c1MagicReveal()},700)})
}
function c1MagicReveal(){
  c1Award('scene2',30);
  screen.innerHTML=`<section class="card word-stage">${c1Header(2,'Open the Letter')}<div class="big-emoji">💌 ✨🌟✨</div><div class="big-word">MAGIC</div><button id="magicAudio" class="sound-orb">🔊</button><p class="instruction">No hace falta explicarla con una regla. La carta acaba de hacer algo imposible.</p><div class="btn-row"><button id="magicHelp" class="btn secondary">💡 Ayuda</button><button id="c1s2next" class="btn primary">Ver el mapa →</button></div><div id="magicHelpBox" class="help-box hidden"></div></section>`;
  setTimeout(()=>speak('magic'),250);$('magicAudio').onclick=()=>speak('magic');$('magicHelp').onclick=()=>{$('magicHelpBox').innerHTML='🇦🇷 <b>magic</b> = magia. La escena ya te dio la idea primero.';$('magicHelpBox').classList.remove('hidden')};$('c1s2next').onclick=c1Scene3;
}

function c1Scene3(){
  state.chapter1Scene=3;saveState();session={c1place:0};renderC1Scene3();
}
function renderC1Scene3(){
  const items=[{en:'castle',es:'castillo',art:'🏰✨'},{en:'room',es:'habitación / cuarto',art:'🛏️🪟'}],u=items[session.c1place];
  screen.innerHTML=`<section class="card word-stage">${c1Header(3,'A Place in the Distance')}<div class="big-emoji">${u.art}</div><div class="big-word">${u.en}</div><button id="c1s3audio" class="sound-orb">🔊</button><p class="instruction">La carta se transforma en un mapa animado. Cada palabra aparece justo cuando la ves.</p><div class="btn-row"><button id="c1s3help" class="btn secondary">💡 Ayuda</button><button id="c1s3next" class="btn primary">${session.c1place===0?'Siguiente lugar →':'Comprobar →'}</button></div><div id="c1s3helpbox" class="help-box hidden"></div></section>`;
  setTimeout(()=>speak(u.en),250);$('c1s3audio').onclick=()=>speak(u.en);$('c1s3help').onclick=()=>{$('c1s3helpbox').textContent=`🇦🇷 ${u.en} = ${u.es}`;$('c1s3helpbox').classList.remove('hidden')};$('c1s3next').onclick=()=>{if(session.c1place===0){session.c1place=1;renderC1Scene3()}else c1Scene3Check()};
}
function c1Scene3Check(){
  const target=Math.random()>.5?'castle':'room';
  screen.innerHTML=`<section class="card word-stage">${c1Header(3,'A Place in the Distance')}<div class="prompt">¿Qué escuchaste?</div><button id="c1s3checkaudio" class="sound-orb">🔊</button><div class="choice-grid"><button class="choice" data-id="castle">🏰</button><button class="choice" data-id="room">🛏️🪟</button></div><div id="c1s3fb" class="feedback"></div></section>`;
  setTimeout(()=>speak(target),250);$('c1s3checkaudio').onclick=()=>speak(target);document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{if(b.dataset.id===target){b.classList.add('correct');c1Award('scene3',30);$('c1s3fb').className='feedback good';$('c1s3fb').textContent='⭐ Entendido sin traducir.';setTimeout(c1Scene4,650)}else{b.classList.add('wrong');$('c1s3fb').textContent='Mirá el dibujo y escuchá otra vez.';speak(target,true)}})
}

function c1Scene4(){
  state.chapter1Scene=4;saveState();
  screen.innerHTML=`<section class="card word-stage">${c1Header(4,'Watch Amanda First')}<div class="big-emoji">👩‍🏫 ↔️ 👧🏻🎒</div><div class="prompt">Amanda llega primero. Vos solamente mirás.</div><div class="help-box"><b>Teacher</b> 👩‍🏫 saluda. <b>Student</b> 👧🏻 responde. La relación se ve antes de preguntarla.</div><div class="btn-row"><button id="teacherAudio" class="btn secondary">🔊 teacher</button><button id="studentAudio" class="btn secondary">🔊 student</button></div><button id="c1s4check" class="btn primary wide" style="margin-top:13px">Ahora sí, jugar →</button></section>`;
  $('teacherAudio').onclick=()=>speak('teacher');$('studentAudio').onclick=()=>speak('student');$('c1s4check').onclick=c1Scene4Check;
}
function c1Scene4Check(){
  screen.innerHTML=`<section class="card word-stage">${c1Header(4,'Watch Amanda First')}<div class="prompt">Escuchá y elegí.</div><button id="c1s4audio" class="sound-orb">🔊</button><div class="choice-grid"><button class="choice" data-id="teacher">👩‍🏫</button><button class="choice" data-id="student">👧🏻🎒</button></div><div id="c1s4fb" class="feedback"></div></section>`;const target=Math.random()>.5?'teacher':'student';setTimeout(()=>speak(target),250);$('c1s4audio').onclick=()=>speak(target);document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{if(b.dataset.id===target){b.classList.add('correct');c1Award('scene4',30);$('c1s4fb').className='feedback good';$('c1s4fb').textContent='⭐ Perfecto.';setTimeout(c1Scene5,650)}else{b.classList.add('wrong');$('c1s4fb').textContent='Probá otra vez.';speak(target,true)}})
}

function c1Scene5(){
  state.chapter1Scene=5;saveState();
  screen.innerHTML=`<section class="card word-stage">${c1Header(5,'Your Turn at the Gate')}<div class="big-emoji">🚪✨🗣️</div><div class="prompt">Primero Amanda demuestra:</div><div class="big-word" style="font-size:25px">My name is Amanda.</div><button id="amandaModel" class="sound-orb">🔊</button><p class="instruction">Ahora personalizamos la misma estructura con tu nombre.</p><label class="instruction" for="playerNameInput">Tu nombre para esta demo</label><input id="playerNameInput" style="width:100%;padding:13px;border:1px solid #d8cff0;border-radius:14px;font-size:17px;margin:8px 0" maxlength="24" value="${state.playerName||''}" placeholder="Escribí tu nombre"/><button id="saveName" class="btn primary wide">Crear mi frase →</button></section>`;
  $('amandaModel').onclick=()=>speak('My name is Amanda.');$('saveName').onclick=()=>{const name=$('playerNameInput').value.trim()||'Alex';state.playerName=name;saveState();c1Scene5Name(name)};
}
function c1Scene5Name(name){
  const phrase=`My name is ${name}.`;
  screen.innerHTML=`<section class="card word-stage">${c1Header(5,'Your Turn at the Gate')}<div class="big-emoji">🙋‍♀️ 🏷️✨</div><div class="big-word" style="font-size:26px">${phrase}</div><button id="myNameAudio" class="sound-orb">🔊</button><p class="instruction">No te enseñamos “posesivos”. Usás la frase porque el portón necesita saber quién sos.</p><button id="gateQuestions" class="btn primary wide">El portón pregunta algo más →</button></section>`;
  setTimeout(()=>speak(phrase),250);$('myNameAudio').onclick=()=>speak(phrase);$('gateQuestions').onclick=c1GateQuestions;
}
function c1GateQuestions(){
  session={gateRound:0,gateScore:0};renderGateQuestion();
}
function renderGateQuestion(){
  const qs=[
    {audio:'Who is Milo?',art:'🦊 👧🏻 🦉',target:'milo',opts:[['milo','🦊'],['girl','👧🏻'],['owl','🦉']]},
    {audio:'Where is the key?',art:'📘 🔑⬇️ 🪑',target:'key',opts:[['book','📘'],['key','🔑'],['chair','🪑']]}
  ],q=qs[session.gateRound];
  screen.innerHTML=`<section class="card word-stage">${c1Header(5,'Your Turn at the Gate')}<div class="big-emoji">${q.art}</div><button id="gateAudio" class="sound-orb">🔊</button><div class="action-grid">${q.opts.map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div></button>`).join('')}</div><div id="gateFb" class="feedback"></div><div class="help-box"><b>who</b> pregunta por una persona. <b>where</b> pregunta por un lugar. La escena lo muestra; no hace falta memorizar esa explicación para jugar.</div></section>`;
  setTimeout(()=>speak(q.audio),250);$('gateAudio').onclick=()=>speak(q.audio);document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===q.target;if(ok){session.gateScore++;b.classList.add('correct');$('gateFb').className='feedback good';$('gateFb').textContent='✨ Sí.'}else{b.classList.add('wrong');$('gateFb').textContent='Escuchá y mirá la escena otra vez.'}setTimeout(()=>{session.gateRound++;if(session.gateRound<2)renderGateQuestion();else{c1Award('scene5',45);c1Scene6()}},650)})
}

function c1Scene6(){
  state.chapter1Scene=6;saveState();
  screen.innerHTML=`<section class="card word-stage">${c1Header(6,'Can You Help?')}<div class="big-emoji">🚪😟 🔑❓</div><div class="big-word" style="font-size:28px">Can you help?</div><button id="canHelpAudio" class="sound-orb">🔊</button><p class="instruction">Aprendemos el bloque entero por situación: el portón perdió su llave y necesita ayuda.</p><div class="btn-row"><button id="canHelpYes" class="btn green">✅ Yes!</button><button id="canHelpRescue" class="btn secondary">🇦🇷 Ayuda</button></div><div id="canHelpBox" class="help-box hidden"></div></section>`;
  setTimeout(()=>speak('Can you help?'),250);$('canHelpAudio').onclick=()=>speak('Can you help?');$('canHelpRescue').onclick=()=>{$('canHelpBox').textContent='“Can you help?” = “¿Podés ayudar?”';$('canHelpBox').classList.remove('hidden')};$('canHelpYes').onclick=c1FindKey;
}
function c1FindKey(){
  const target='key';screen.innerHTML=`<section class="card word-stage">${c1Header(6,'Can You Help?')}<div class="prompt">Find the key.</div><button id="findKeyAudio" class="sound-orb">🔊</button><div class="choice-grid"><button class="choice" data-id="book">📘</button><button class="choice" data-id="key">🔑</button><button class="choice" data-id="bag">🎒</button><button class="choice" data-id="chair">🪑</button></div><div id="findKeyFb" class="feedback"></div></section>`;setTimeout(()=>speak('Find the key.'),250);$('findKeyAudio').onclick=()=>speak('Find the key.');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{if(b.dataset.id===target){b.classList.add('correct');c1Award('scene6',40);$('findKeyFb').className='feedback good';$('findKeyFb').textContent='🔑 Encontrada. El portón puede abrirse.';setTimeout(c1Scene7,650)}else{b.classList.add('wrong');$('findKeyFb').textContent='No es esa. Escuchá de nuevo.'}})
}

function c1Scene7(){
  state.chapter1Scene=7;saveState();
  screen.innerHTML=`<section class="card word-stage">${c1Header(7,'Choose Your First Room')}<div class="prompt">Amanda muestra primero una preferencia:</div><div class="big-word" style="font-size:27px">I like books.</div><button id="likeModel" class="sound-orb">🔊</button><p class="instruction">Ahora elegís algo de verdad. La decisión cambia tu habitación de bienvenida.</p><div class="action-grid"><button class="action-card room-choice" data-room="books"><div class="action-icon">📚✨</div><div class="action-name">books</div></button><button class="action-card room-choice" data-room="music"><div class="action-icon">🎵🎧</div><div class="action-name">music</div></button><button class="action-card room-choice" data-room="animals"><div class="action-icon">🐾🦉</div><div class="action-name">animals</div></button></div></section>`;
  $('likeModel').onclick=()=>speak('I like books.');document.querySelectorAll('.room-choice').forEach(b=>b.onclick=()=>{state.chosenRoom=b.dataset.room;saveState();c1Scene7Choice(b.dataset.room)})
}
function c1Scene7Choice(room){
  const labels={books:['books','📚✨'],music:['music','🎵🎧'],animals:['animals','🐾🦉']};const [word,art]=labels[room];
  screen.innerHTML=`<section class="card word-stage">${c1Header(7,'Choose Your First Room')}<div class="big-emoji">${art}</div><div class="big-word" style="font-size:26px">I like ${word}.</div><button id="choiceAudio" class="sound-orb">🔊</button><div class="help-box">Después aparece otra intención: <b>I want this room.</b> No estudiamos el verbo “want”; la frase existe porque estás eligiendo.</div><button id="wantRoom" class="btn primary wide">I want this room →</button></section>`;setTimeout(()=>speak(`I like ${word}.`),250);$('choiceAudio').onclick=()=>speak(`I like ${word}.`);$('wantRoom').onclick=()=>{speak('I want this room.');c1Award('scene7',45);setTimeout(c1Scene8,650)}
}

function c1Scene8(){
  state.chapter1Scene=8;saveState();session={finaleRound:0,finaleScore:0};renderC1Finale();
}
function renderC1Finale(){
  const tasks=[
    {audio:'Hello!',target:'hello',art:'🚪✨ 👋',opts:[['hello','👋'],['no','❌'],['wait','⏳']]},
    {audio:'Find the key.',target:'key',art:'📘 🎒 🔑',opts:[['book','📘'],['bag','🎒'],['key','🔑']]},
    {audio:'Open the door.',target:'open',art:'🚪🔒',opts:[['open','✨🚪'],['close','🔒'],['sit','🪑']]},
    {audio:'Ready?',target:'yes',art:'🏰✨ ❓',opts:[['yes','✅'],['no','❌'],['goodbye','👋🚶']]},
    {audio:'Where is Milo?',target:'milo',art:'👧🏻 🦊 🦉',opts:[['girl','👧🏻'],['milo','🦊'],['owl','🦉']]}
  ];
  const t=tasks[session.finaleRound];
  screen.innerHTML=`<section class="card word-stage">${c1Header(8,'Finale · Enter the Academy')}<div class="eyebrow" style="margin-top:12px">Final challenge ${session.finaleRound+1}/5</div><div class="big-emoji">${t.art}</div><button id="finaleAudio" class="sound-orb">🔊</button><p class="instruction">No hay palabras nuevas. La historia comprueba si podés usar lo que ya conocés.</p><div class="action-grid">${t.opts.map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div></button>`).join('')}</div><div id="finaleFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),250);$('finaleAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;if(ok){session.finaleScore++;b.classList.add('correct');$('finaleFb').className='feedback good';$('finaleFb').textContent='⭐ Bien.'}else{b.classList.add('wrong');$('finaleFb').className='feedback soft';$('finaleFb').textContent='La aventura sigue, pero esto queda marcado para repasar.'}setTimeout(()=>{session.finaleRound++;if(session.finaleRound<tasks.length)renderC1Finale();else finishC1Finale()},650)})
}
function finishC1Finale(){
  const pass=session.finaleScore>=4;
  if(pass){state.chapter1Complete=true;saveState();c1Award('finale',100)}
  screen.innerHTML=`<section class="card reward-card">${c1Header(8,'Finale · Enter the Academy')}<div class="big-emoji">${pass?'🏰🎉✨':'🦊🔁'}</div><h1 class="title">${pass?'¡Entraste a la academia!':'Casi. Falta una vuelta más.'}</h1><p class="subtitle">${pass?`Completaste una historia entera usando inglés. Tu habitación elegida: ${state.chosenRoom||'magic room'}.`:'No repetimos todo el capítulo. El boss puede volver a probar sólo esta mezcla final.'}</p><div class="reward-money">${session.finaleScore}/5</div><p class="reward-note">Respuestas correctas del desafío final</p><button id="finaleNext" class="btn primary wide" style="margin-top:14px">${pass?'Ver el cierre →':'Reintentar final →'}</button></section>`;
  $('finaleNext').onclick=()=>pass?c1Ending():c1Scene8();
}
function c1Ending(){
  screen.innerHTML=`<section class="card hero-card"><div class="eyebrow">Chapter 1 complete</div><h1 class="title">The Magic Letter · End</h1><div class="scene-art"><div class="stars"></div><div class="moon"></div><div class="scene-characters"><span>👧🏻</span><span>🏰✨</span><span>🦊</span></div></div><p class="subtitle">La puerta se cierra detrás de vos. Milo mira un pasillo donde varias botellas brillan de colores. Una tiene una etiqueta equivocada…</p>${guide('Fin de esta historia. La próxima empieza con un misterio nuevo y reutiliza lo que ya sabés, en vez de borrar el progreso y empezar de cero.')}<button id="chapter2FromEnding" class="btn primary wide" style="margin-top:14px">Ver la próxima historia →</button></section>`;$('chapter2FromEnding').onclick=showChapter2Teaser;
}
function showChapter2Teaser(){
  screen.innerHTML=`<section class="card hero-card"><div class="big-emoji">🧪🔒✨</div><div class="eyebrow">Chapter 2</div><h1 class="title">Potion Mystery</h1><p class="subtitle">Una poción cambió de color y nadie sabe por qué. El capítulo 2 sumará colores, tamaño, comida/bebida y nuevas instrucciones útiles dentro de ese misterio.</p>${guide('No vamos a enseñar “vocabulario de colores” como una lista. Vas a necesitar red, blue, green, big y small para resolver qué pasó.')}<div class="help-box">Diseño previsto: nueva historia, más comprensión auditiva, más decisiones habladas y repaso espaciado de palabras del prólogo y Chapter 1.</div><button id="chapter2Back" class="btn secondary wide" style="margin-top:14px">Volver a Chapter 1</button></section>`;$('chapter2Back').onclick=showChapter1Intro;
}

function showLockedPreview(step){
  screen.innerHTML=`<section class="card hero-card"><div class="big-emoji">🔒🪄</div><div class="eyebrow">Escalón ${step}</div><h1 class="title">${MAP[step-1]?.[0]||'Próxima aventura'}</h1><p class="subtitle">Este escalón ya está definido en el contenido maestro, pero todavía no está implementado como minijuego en el prototipo 0.4.</p>${guide('La historia está preparada. El siguiente bloque de desarrollo convierte este escalón en juego real.') }<button id="backMap" class="btn primary wide" style="margin-top:15px">Volver al mapa</button></section>`;$('backMap').onclick=showMap
}

function showMap(){
  screen.innerHTML=`<section class="card"><div class="eyebrow">Prólogo</div><h1 class="title">Before the Letter</h1><p class="subtitle">Diez escalones. La carta de la protagonista recién llega cuando existe una base real.</p><div class="quest-map">${MAP.map((n,i)=>{const step=i+1,unlock=step<=state.unlockedStep,current=step===state.currentStep,d=stageData(step);return `<button class="map-node ${unlock?'unlocked':'locked'} ${current?'current':''}" data-step="${step}" ${unlock?'':'disabled'}><div class="node-num">${d.mastered?'✓':step}</div><div><div class="node-title">${n[0]}</div><div class="node-sub">${n[1]}</div></div><div class="node-badge">${unlock?n[2]:'🔒'}</div></button>`}).join('')}</div></section><section class="card"><div class="eyebrow">Después del prólogo</div><h2 style="margin:5px 0">✉️ Chapter 1 · The Magic Letter</h2><p class="subtitle">${state.chapter1Complete?'Historia terminada. Podés volver a jugarla o mirar el teaser del siguiente capítulo.':state.phase0Complete?'La lechuza ya está mirando a la protagonista. Chapter 1 está desbloqueado.':'Cuando los 10 escalones estén dominados, la lechuza gira hacia la protagonista y empieza su propia historia.'}</p><button id="chapterMapBtn" class="btn ${state.phase0Complete?'primary':'secondary'} wide" ${state.phase0Complete?'':'disabled'} style="margin-top:12px">${state.chapter1Complete?'✓ Chapter 1 completado':state.phase0Complete?'Entrar al capítulo →':'🔒 Completar los 10 escalones'}</button></section>`;
  document.querySelectorAll('.map-node.unlocked').forEach(b=>b.onclick=()=>startStep(Number(b.dataset.step)));
  if(state.phase0Complete)$('chapterMapBtn').onclick=showChapter1Intro;
  setActiveNav('map');
}

function showWords(){
  const all=Object.values(window.MEQ_VOCAB_DATA||{}),tracked=all.filter(v=>state.unitMastery?.[v.id]?.presentedAt);
  const statusLabel={presented:'Presentada',learned:'Aprendida',consolidated:'Consolidada',unseen:'No vista'};
  const statusIcon={presented:'👀',learned:'✅',consolidated:'🧠',unseen:'○'};
  const summary=window.MEQPedagogy?.profileSummary?.()||{presented:0,learned:0,consolidated:0,totalTracked:0};
  const rows=tracked.sort((a,b)=>{const order={presented:0,learned:1,consolidated:2};return (order[window.MEQPedagogy.status(a.id)]||0)-(order[window.MEQPedagogy.status(b.id)]||0)}).map(v=>{
    const u=window.MEQPedagogy.unit(v.id),st=window.MEQPedagogy.status(v.id),w=window.MEQPedagogy.weakness(v.id),contexts=window.MEQPedagogy.contextCount(v.id),review=state.reviews?.[v.id];
    const skill=`👀 ${pct(u.visual||0)} · 👂 ${pct(u.listening||0)} · 🎮 ${pct(u.usage||0)}${u.attempts?.speaking?` · 🎤 ${pct(u.speaking||0)}`:''}`;
    const memory=review?`repaso caja ${review.box||0} · ${u.delayedRecall?pct(u.delayedRecall)+'% recuerdo':'sin recuerdo demorado aún'}`:'todavía sin repaso programado';
    return `<div class="word-row"><div><div class="word-en">${statusIcon[st]} ${v.english||v.id.replaceAll('_',' ')}</div><div class="word-meta">${skill}<br>contextos limpios: ${contexts} · ayudas: ${u.helpUses||0} · ${memory}${st!=='consolidated'&&w?` · reforzar: ${w.dimension}`:''}</div></div><div class="mastery-pill ${st==='consolidated'?'mastered':''}">${statusLabel[st]}</div></div>`;
  }).join('');
  screen.innerHTML=`<section class="card"><div class="eyebrow">Perfil de aprendizaje</div><h1 class="title">Qué sabe realmente</h1><p class="subtitle">Presentada ≠ aprendida. Aprendida exige evidencia limpia en más de un contexto. Consolidada exige volver días después y recordarla.</p><div class="mastery-grid"><div><b>${summary.totalTracked||0}</b><small>seguidas</small></div><div><b>${summary.presented||0}</b><small>presentadas</small></div><div><b>${summary.learned||0}</b><small>aprendidas</small></div><div><b>${summary.consolidated||0}</b><small>consolidadas</small></div></div><div class="word-list">${rows||'<div class="help-box">Todavía no hay unidades con evidencia. Empezá el prólogo.</div>'}</div></section>`;setActiveNav('words')
}
function showRewards(){
  const e=eligibleArs(),ratio=state.weeklyCapArs?Math.min(1,e/state.weeklyCapArs):0;screen.innerHTML=`<section class="card reward-card"><div class="eyebrow">Recompensa familiar</div><h1 class="title">Aprender → dominar → ganar</h1><div class="coin-stack">🪙✨</div><div class="reward-money">${money(e)}</div><div class="reward-note">de un máximo semanal de ${money(state.weeklyCapArs)}</div><div class="cap-bar progress"><div style="width:${Math.round(ratio*100)}%"></div></div><p class="reward-note">Las monedas se entregan por desafíos y dominio verificado, no por quedarse mirando la pantalla. Al alcanzar el máximo semanal puede seguir jugando por XP y recompensas internas.</p><div class="help-box"><b>Importante:</b> esto es un registro familiar. El adulto aprueba y entrega el premio por fuera de la app. No hay pagos ni cuentas financieras de menores.</div><button id="openParentFromReward" class="btn secondary wide" style="margin-top:13px">⚙️ Configurar como adulto</button></section>`;$('openParentFromReward').onclick=openParent;setActiveNav('rewards')
}

function setActiveNav(name){document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('nav-active',b.dataset.nav===name))}
function openParent(){
  const ps=window.MEQPedagogy?.profileSummary?.()||{totalTracked:0,presented:0,learned:0,consolidated:0,weak:[]};const weak=(ps.weak||[]).slice(0,3).map(x=>`${x.unitId} (${x.dimension}${x.confusedWith?` ↔ ${x.confusedWith}`:''})`).join(', ')||'ninguna prioritaria';
  $('weeklyCapInput').value=state.weeklyCapArs;if($('dailyCapInput'))$('dailyCapInput').value=state.dailyCapArs??'';$('coinValueInput').value=state.coinValueArs;$('parentSummary').innerHTML=`Unidades con seguimiento: <b>${ps.totalTracked}</b><br>Presentadas: <b>${ps.presented}</b> · Aprendidas: <b>${ps.learned}</b> · Consolidadas: <b>${ps.consolidated}</b><br>Próximo refuerzo: <b>${weak}</b><br>Repasos pendientes: <b>${dueReviews().length}</b><br>Ayudas usadas: <b>${state.helpUses||0}</b><hr>Monedas internas acumuladas: <b>${state.coins}</b><br>Monedas elegibles esta semana: <b>${weeklyEligibleCoins()}</b><br>Equivalente semanal actual: <b>${money(eligibleArs())}</b>`;$('parentDialog').showModal();
}

$('parentBtn').onclick=openParent;$('soundBtn').onclick=toggleSound;$('homeBtn').onclick=()=>state.introSeen?showMap():intro();
$('saveParentSettings').onclick=()=>{state.weeklyCapArs=Math.max(0,Number($('weeklyCapInput').value)||0);const dailyRaw=$('dailyCapInput')?.value;state.dailyCapArs=(dailyRaw==null||dailyRaw==='')?null:Math.max(0,Number(dailyRaw)||0);state.coinValueArs=Math.max(0,Number($('coinValueInput').value)||0);saveState();$('parentDialog').close();showRewards()};
$('resetProgress').onclick=()=>{if(confirm('¿Reiniciar todo el progreso local de esta demo?')){state=structuredClone(DEFAULT_STATE);saveState();$('parentDialog').close();intro()}};
document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>{const n=b.dataset.nav;if(n==='story')state.phase0Complete?showChapter1Intro():state.introSeen?startStep(state.currentStep):intro();if(n==='map')showMap();if(n==='words')showWords();if(n==='review')showReview();if(n==='rewards')showRewards()});

ensureReviewScheduleFromMastery();updateHud();updateSoundButton();
state.introSeen?showMap():intro();

// MVP 1.9 — Chapter 1 pedagogical baseline retained under Competitive Learning Bible guardrails.
// These replace the early bespoke screens with the same Pedagogical Engine v2
// contract used by later chapters: audio/visual first, clean attempt before help,
// per-unit evidence, transfer across contexts, and targeted repair.
function c1PedPresent(id,context){window.MEQPedagogy?.present(id,'chapter1',context)}
function c1PedRecord(id,ok,dimensions,context,{distractorId=null,mode='chapter1_transfer',helpLevel=0}={}){
  meqRecordUnitTask(id,ok,{dimensions,context,mode,distractorId,helpLevel});
}
function c1HelpBox(visual,translation='',unit=''){
  return typeof meqStoryHelp==='function'?meqStoryHelp(visual,translation,unit):'';
}
function c1RevealWritten(id){const el=$(id);if(el)el.classList.remove('hidden')}

function showChapter1Scene1(){
  state.chapter1Scene=1;saveState();
  screen.innerHTML=`<section class="card word-stage">${c1Header(1,'Your Owl Arrives')}<div class="big-emoji">🪟 🌙 🦉✉️</div><div class="prompt">Milo mira hacia la ventana.</div><button id="c1listen" class="sound-orb">🔊</button><div id="c1KnownLook" class="big-word hidden" style="font-size:30px">LOOK!</div><button id="c1RevealLook" class="btn secondary">🔤 Ver lo que escuché</button><p class="instruction">Primero escuchás y mirás. La escritura aparece después.</p><div class="btn-row"><button id="c1next" class="btn primary wide">La lechuza aterriza →</button></div></section>`;
  setTimeout(()=>speak('Look!'),250);$('c1listen').onclick=()=>speak('Look!');$('c1RevealLook').onclick=()=>{c1RevealWritten('c1KnownLook');$('c1RevealLook').disabled=true};$('c1next').onclick=showChapter1Scene1b;
}
function showChapter1Scene1b(){
  screen.innerHTML=`<section class="card word-stage">${c1Header(1,'Your Owl Arrives')}<div class="big-emoji">🦉 ✉️</div><div class="prompt">Tocá cada dibujo y escuchá. Todavía no hace falta leer.</div><div class="action-grid"><button id="owlWord" class="action-card"><div class="action-icon">🦉</div><div id="owlWritten" class="action-name hidden">owl</div></button><button id="letterWord" class="action-card"><div class="action-icon">✉️</div><div id="letterWritten" class="action-name hidden">letter</div></button></div><button id="c1RevealStoryWords" class="btn secondary wide">🔤 Ver palabras de la historia</button><button id="c1hello" class="btn primary wide" style="margin-top:13px">Saludar a la lechuza →</button></section>`;
  $('owlWord').onclick=()=>speak('owl');$('letterWord').onclick=()=>speak('letter');$('c1RevealStoryWords').onclick=()=>{c1RevealWritten('owlWritten');c1RevealWritten('letterWritten');$('c1RevealStoryWords').disabled=true};$('c1hello').onclick=()=>{speak('Hello!');c1Award('scene1',25);screen.innerHTML=`<section class="card reward-card">${c1Header(1,'Your Owl Arrives')}<div class="big-emoji">🦉💌✨</div><h1 class="title">Hello!</h1><p class="subtitle">Una palabra conocida ahora hace avanzar tu propia historia.</p>${guide('Bien. El inglés empieza a servir para hacer cosas dentro de la aventura.')}<button id="c1s1continue" class="btn primary wide" style="margin-top:15px">Tomar la carta →</button></section>`;$('c1s1continue').onclick=c1Scene2};
}
function renderC1Scene2(){
  const tasks=[
    {audio:'Take the letter.',target:'take',art:'✉️ ➡️ 🤲',opts:[['take','🤲'],['give','🫴'],['wait','⏳']]},
    {audio:'Open the letter.',target:'open',art:'✉️ 🔒 ➡️ 💌✨',opts:[['open','✨📖'],['close','🔒'],['stop','🛑']]}
  ];
  const t=tasks[session.c1action];session.c1HelpLevel ||= 0;
  screen.innerHTML=`<section class="card word-stage">${c1Header(2,'Open the Letter')}<div class="big-emoji">${t.art}</div><div class="prompt">Escuchá y hacé que la escena cambie.</div><button id="c1s2audio" class="sound-orb">🔊</button><div class="action-grid">${shuffle(t.opts).map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div></button>`).join('')}</div><div id="c1s2fb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),250);$('c1s2audio').onclick=()=>speak(t.audio);
  document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;meqRecordTextUnits?.(t.audio,ok,{dimensions:['listening','usage'],context:`c1:s2:action${session.c1action}`,mode:'audio_to_action',helpLevel:session.c1HelpLevel||0});if(ok){b.classList.add('correct');$('c1s2fb').className='feedback good';$('c1s2fb').textContent='✨ La orden movió la historia.';setTimeout(()=>{session.c1HelpLevel=0;if(session.c1action===0){session.c1action=1;renderC1Scene2()}else c1MagicReveal()},650)}else{b.classList.add('wrong');$('c1s2fb').className='feedback soft';$('c1s2fb').textContent='Todavía no. Escuchala otra vez.';session.c1HelpLevel=Math.max(1,session.c1HelpLevel||0);speak(t.audio,true);setTimeout(renderC1Scene2,700)}});
}
function c1MagicReveal(){
  c1Award('scene2',30);
  screen.innerHTML=`<section class="card word-stage">${c1Header(2,'Open the Letter')}<div class="big-emoji">💌 ✨🌟✨</div><div id="magicWritten" class="big-word hidden">MAGIC</div><button id="magicAudio" class="sound-orb">🔊</button><button id="magicReveal" class="btn secondary">🔤 Ver palabra</button><p class="instruction">La escena da el significado antes de la escritura.</p>${c1HelpBox('Mirá qué le pasó a la carta: brilló e hizo algo imposible.','magic = magia')}<button id="c1s2next" class="btn primary wide" style="margin-top:12px">Ver el mapa →</button></section>`;
  setTimeout(()=>speak('magic'),250);$('magicAudio').onclick=()=>speak('magic');$('magicReveal').onclick=()=>{c1RevealWritten('magicWritten');$('magicReveal').disabled=true};$('c1s2next').onclick=c1Scene3;
}
function renderC1Scene3(){
  const items=[{en:'castle',es:'castillo',art:'🏰✨'},{en:'room',es:'habitación / cuarto',art:'🛏️🪟'}],u=items[session.c1place];
  screen.innerHTML=`<section class="card word-stage">${c1Header(3,'A Place in the Distance')}<div class="big-emoji">${u.art}</div><div id="c1PlaceWritten" class="big-word hidden">${u.en}</div><button id="c1s3audio" class="sound-orb">🔊</button><button id="c1PlaceReveal" class="btn secondary">🔤 Ver palabra</button><p class="instruction">Mapa + sonido primero. La lectura viene después.</p>${c1HelpBox('Mirá el lugar que se ilumina en el mapa.',`${u.en} = ${u.es}`)}<button id="c1s3next" class="btn primary wide" style="margin-top:12px">${session.c1place===0?'Siguiente lugar →':'Comprobar →'}</button></section>`;
  setTimeout(()=>speak(u.en),250);$('c1s3audio').onclick=()=>speak(u.en);$('c1PlaceReveal').onclick=()=>{c1RevealWritten('c1PlaceWritten');$('c1PlaceReveal').disabled=true};$('c1s3next').onclick=()=>{if(session.c1place===0){session.c1place=1;renderC1Scene3()}else{session.c1PlaceCheckRound=0;c1Scene3Check()}};
}
function c1Scene3Check(){
  const targets=['castle','room'],target=targets[session.c1PlaceCheckRound||0];
  screen.innerHTML=`<section class="card word-stage">${c1Header(3,'A Place in the Distance')}<div class="prompt">Escuchá y elegí el lugar.</div><button id="c1s3checkaudio" class="sound-orb">🔊</button><div class="choice-grid"><button class="choice" data-id="castle">🏰</button><button class="choice" data-id="room">🛏️🪟</button></div><div id="c1s3fb" class="feedback"></div></section>`;
  setTimeout(()=>speak(target),250);$('c1s3checkaudio').onclick=()=>speak(target);document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===target;if(ok){b.classList.add('correct');$('c1s3fb').className='feedback good';$('c1s3fb').textContent='⭐ Entendido sin traducir.';session.c1PlaceCheckRound=(session.c1PlaceCheckRound||0)+1;setTimeout(()=>{if(session.c1PlaceCheckRound<2)c1Scene3Check();else{c1Award('scene3',30);c1Scene4()}},550)}else{b.classList.add('wrong');$('c1s3fb').className='feedback soft';$('c1s3fb').textContent='Mirá el dibujo y escuchá otra vez.';speak(target,true)}});
}
function c1Scene4(){
  state.chapter1Scene=4;saveState();c1PedPresent('teacher','c1:s4:portrait');c1PedPresent('student','c1:s4:portrait');
  screen.innerHTML=`<section class="card word-stage">${c1Header(4,'Watch Amanda First')}<div class="big-emoji">👩‍🏫 ↔️ 👧🏻🎒</div><div class="prompt">Amanda llega primero. Vos solamente mirás y escuchás.</div><div class="btn-row"><button id="teacherAudio" class="btn secondary">🔊 👩‍🏫</button><button id="studentAudio" class="btn secondary">🔊 👧🏻🎒</button></div><div id="roleWritten" class="help-box hidden"><b>teacher</b> 👩‍🏫 · <b>student</b> 👧🏻🎒</div><button id="roleReveal" class="btn secondary wide">🔤 Ver palabras</button><button id="c1s4check" class="btn primary wide" style="margin-top:13px">Ahora sí, jugar →</button></section>`;
  $('teacherAudio').onclick=()=>speak('teacher');$('studentAudio').onclick=()=>speak('student');$('roleReveal').onclick=()=>{c1RevealWritten('roleWritten');$('roleReveal').disabled=true};$('c1s4check').onclick=()=>{session.c1RoleRound=0;session.c1RoleHelp=0;c1Scene4Check()};
}
function c1Scene4Check(){
  const rounds=[
    {target:'teacher',ctx:'c1:s4:portrait_teacher',teacher:'👩‍🏫',student:'👧🏻🎒'},
    {target:'student',ctx:'c1:s4:portrait_student',teacher:'👩‍🏫',student:'👧🏻🎒'},
    {target:'teacher',ctx:'c1:s4:hallway_teacher',teacher:'🧑‍🏫📚',student:'🧒🎒'},
    {target:'student',ctx:'c1:s4:hallway_student',teacher:'🧑‍🏫📚',student:'🧒🎒'}
  ],r=rounds[session.c1RoleRound||0];
  screen.innerHTML=`<section class="card word-stage">${c1Header(4,'Watch Amanda First')}<div class="prompt">Escuchá y elegí. ${session.c1RoleRound>=2?'Ahora cambió la escena.':''}</div><button id="c1s4audio" class="sound-orb">🔊</button><div class="choice-grid"><button class="choice" data-id="teacher">${r.teacher}</button><button class="choice" data-id="student">${r.student}</button></div><div id="c1s4fb" class="feedback"></div></section>`;
  setTimeout(()=>speak(r.target),250);$('c1s4audio').onclick=()=>speak(r.target);document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===r.target;c1PedRecord(r.target,ok,['listening','visual'],r.ctx,{distractorId:b.dataset.id,mode:'audio_to_person',helpLevel:session.c1RoleHelp||0});if(ok){b.classList.add('correct');$('c1s4fb').className='feedback good';$('c1s4fb').textContent='⭐ Sí.';session.c1RoleRound++;session.c1RoleHelp=0;setTimeout(()=>{if(session.c1RoleRound<rounds.length)c1Scene4Check();else{c1Award('scene4',30);c1Scene5()}},480)}else{b.classList.add('wrong');$('c1s4fb').className='feedback soft';$('c1s4fb').textContent='Otra vez, con audio lento.';session.c1RoleHelp=1;speak(r.target,true);setTimeout(c1Scene4Check,650)}});
}
function c1Scene5(){
  state.chapter1Scene=5;saveState();c1PedPresent('who','c1:s5:gate');c1PedPresent('where','c1:s5:gate');
  screen.innerHTML=`<section class="card word-stage">${c1Header(5,'Your Turn at the Gate')}<div class="big-emoji">🚪✨🗣️</div><div class="prompt">Primero Amanda demuestra. Escuchala antes de mirar la frase.</div><button id="amandaModel" class="sound-orb">🔊</button><div id="amandaPhrase" class="big-word hidden" style="font-size:25px">My name is Amanda.</div><button id="amandaReveal" class="btn secondary">🔤 Ver frase</button><label class="instruction" for="playerNameInput">Tu nombre para esta demo</label><input id="playerNameInput" style="width:100%;padding:13px;border:1px solid #d8cff0;border-radius:14px;font-size:17px;margin:8px 0" maxlength="24" value="${state.playerName||''}" placeholder="Escribí tu nombre"/><button id="saveName" class="btn primary wide">Crear mi frase →</button></section>`;
  setTimeout(()=>speak('My name is Amanda.'),220);$('amandaModel').onclick=()=>speak('My name is Amanda.');$('amandaReveal').onclick=()=>{c1RevealWritten('amandaPhrase');$('amandaReveal').disabled=true};$('saveName').onclick=()=>{const name=$('playerNameInput').value.trim()||'Alex';state.playerName=name;saveState();c1Scene5Name(name)};
}
function c1Scene5Name(name){
  const phrase=`My name is ${name}.`;
  screen.innerHTML=`<section class="card word-stage">${c1Header(5,'Your Turn at the Gate')}<div class="big-emoji">🙋‍♀️ 🏷️✨</div><button id="myNameAudio" class="sound-orb">🔊</button><div id="myNameWritten" class="big-word hidden" style="font-size:26px">${phrase}</div><button id="myNameReveal" class="btn secondary">🔤 Ver mi frase</button><p class="instruction">Usás la frase porque el portón necesita saber quién sos.</p><button id="gateQuestions" class="btn primary wide">El portón pregunta algo más →</button></section>`;
  setTimeout(()=>speak(phrase),250);$('myNameAudio').onclick=()=>speak(phrase);$('myNameReveal').onclick=()=>{c1RevealWritten('myNameWritten');$('myNameReveal').disabled=true};$('gateQuestions').onclick=c1GateQuestions;
}
function c1GateQuestions(){session={...session,gateRound:0,gateScore:0,gateHelp:0};renderGateQuestion()}
function renderGateQuestion(){
  const qs=[
    {unit:'who',audio:'Who is Milo?',art:'🦊 👧🏻 🦉',target:'milo',opts:[['milo','🦊'],['girl','👧🏻'],['owl','🦉']],ctx:'c1:s5:who_milo'},
    {unit:'where',audio:'Where is the key?',art:'📘 🔑⬇️ 🪑',target:'key',opts:[['book','📘'],['key','🔑'],['chair','🪑']],ctx:'c1:s5:where_key'},
    {unit:'who',audio:'Who is the teacher?',art:'👩‍🏫 👧🏻 🦊',target:'teacher',opts:[['teacher','👩‍🏫'],['student','👧🏻'],['milo','🦊']],ctx:'c1:s5:who_teacher'},
    {unit:'where',audio:'Where is the book?',art:'🎒 📘🪑 🔑',target:'book',opts:[['bag','🎒'],['book','📘'],['key','🔑']],ctx:'c1:s5:where_book'}
  ],q=qs[session.gateRound];
  screen.innerHTML=`<section class="card word-stage">${c1Header(5,'Your Turn at the Gate')}<div class="big-emoji">${q.art}</div><button id="gateAudio" class="sound-orb">🔊</button><div class="action-grid">${q.opts.map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div></button>`).join('')}</div><div id="gateFb" class="feedback"></div>${c1HelpBox(q.unit==='who'?'Buscá una persona en la escena.':'Buscá un lugar u objeto en la escena.',q.unit==='who'?'who = quién':'where = dónde',q.unit)}</section>`;
  setTimeout(()=>speak(q.audio),250);$('gateAudio').onclick=()=>speak(q.audio);document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===q.target;c1PedRecord(q.unit,ok,['listening','usage'],q.ctx,{distractorId:b.dataset.id,mode:'question_comprehension',helpLevel:session.gateHelp||0});if(ok){session.gateScore++;b.classList.add('correct');$('gateFb').className='feedback good';$('gateFb').textContent='✨ Sí.';session.gateRound++;session.gateHelp=0;setTimeout(()=>{if(session.gateRound<qs.length)renderGateQuestion();else{c1Award('scene5',45);c1Scene6()}},500)}else{b.classList.add('wrong');$('gateFb').className='feedback soft';$('gateFb').textContent='Escuchá y mirá la escena otra vez.';session.gateHelp=1;speak(q.audio,true);setTimeout(renderGateQuestion,700)}});
}
function c1Scene6(){
  state.chapter1Scene=6;saveState();c1PedPresent('can','c1:s6:gate');session.c1CanHelp=0;
  screen.innerHTML=`<section class="card word-stage">${c1Header(6,'Can You Help?')}<div class="big-emoji">🚪😟 🔑❓</div><div class="prompt">El portón perdió su llave. Escuchá qué necesita.</div><button id="canHelpAudio" class="sound-orb">🔊</button><div id="canHelpWritten" class="big-word hidden" style="font-size:28px">Can you help?</div><button id="canHelpReveal" class="btn secondary">🔤 Ver frase</button>${c1HelpBox('Milo se acerca al portón y se prepara para ayudar.','Can you help? = ¿Podés ayudar?','can')}<button id="canHelpYes" class="btn green wide" style="margin-top:12px">✅ Yes!</button></section>`;
  setTimeout(()=>speak('Can you help?'),250);$('canHelpAudio').onclick=()=>speak('Can you help?');$('canHelpReveal').onclick=()=>{c1RevealWritten('canHelpWritten');$('canHelpReveal').disabled=true};$('canHelpYes').onclick=()=>{c1PedRecord('can',true,['listening','usage'],'c1:s6:gate_help',{mode:'chunk_response',helpLevel:session.meqHelpLevel||0});c1FindKey()};
}
function c1FindKey(){
  const target='key';screen.innerHTML=`<section class="card word-stage">${c1Header(6,'Can You Help?')}<div class="prompt">Escuchá la orden y buscá.</div><button id="findKeyAudio" class="sound-orb">🔊</button><div class="choice-grid"><button class="choice" data-id="book">📘</button><button class="choice" data-id="key">🔑</button><button class="choice" data-id="bag">🎒</button><button class="choice" data-id="chair">🪑</button></div><div id="findKeyFb" class="feedback"></div></section>`;setTimeout(()=>speak('Find the key.'),250);$('findKeyAudio').onclick=()=>speak('Find the key.');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===target;meqRecordTextUnits?.('Find the key.',ok,{dimensions:['listening','usage'],context:'c1:s6:find_key',mode:'audio_to_search',helpLevel:0});if(ok){b.classList.add('correct');$('findKeyFb').className='feedback good';$('findKeyFb').textContent='🔑 Encontrada.';setTimeout(c1CanTransfer,550)}else{b.classList.add('wrong');$('findKeyFb').className='feedback soft';$('findKeyFb').textContent='No es esa. Escuchá de nuevo.';speak('Find the key.',true)}});
}
function c1CanTransfer(){
  screen.innerHTML=`<section class="card word-stage">${c1Header(6,'Can You Help?')}<div class="big-emoji">🔑 ➡️ 🚪🔒</div><div class="prompt">Nueva situación. Escuchá antes de responder.</div><button id="c1Can2Audio" class="sound-orb">🔊</button><div class="choice-grid"><button class="choice" data-id="yes">✅</button><button class="choice" data-id="no">❌</button></div><div id="c1Can2Fb" class="feedback"></div></section>`;
  setTimeout(()=>speak('Can you open the door?'),250);$('c1Can2Audio').onclick=()=>speak('Can you open the door?');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id==='yes';c1PedRecord('can',ok,['listening','usage'],'c1:s6:door_transfer',{distractorId:b.dataset.id,mode:'chunk_transfer',helpLevel:0});if(ok){b.classList.add('correct');$('c1Can2Fb').className='feedback good';$('c1Can2Fb').textContent='✨ Yes! La misma idea funcionó en otra situación.';c1Award('scene6',40);setTimeout(c1Scene7,600)}else{b.classList.add('wrong');$('c1Can2Fb').className='feedback soft';$('c1Can2Fb').textContent='Mirá la llave y la puerta. Escuchá otra vez.';speak('Can you open the door?',true)}});
}
function c1Scene7(){
  state.chapter1Scene=7;saveState();c1PedPresent('like','c1:s7:model');c1PedPresent('want','c1:s7:choice');session.c1LikeHelp=0;
  screen.innerHTML=`<section class="card word-stage">${c1Header(7,'Choose Your First Room')}<div class="prompt">Amanda demuestra una preferencia. Escuchá y elegí qué imagen coincide.</div><button id="likeModel" class="sound-orb">🔊</button><div class="choice-grid"><button class="choice" data-room="books">📚✨</button><button class="choice" data-room="music">🎵🎧</button><button class="choice" data-room="animals">🐾🦉</button></div><div id="likeFb" class="feedback"></div>${c1HelpBox('Amanda abraza los libros que eligió.','I like books. = Me gustan los libros.','like')}</section>`;
  setTimeout(()=>speak('I like books.'),250);$('likeModel').onclick=()=>speak('I like books.');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.room==='books';c1PedRecord('like',ok,['listening','usage'],'c1:s7:like_books',{distractorId:b.dataset.room,mode:'preference_comprehension',helpLevel:session.c1LikeHelp||0});if(ok){b.classList.add('correct');$('likeFb').className='feedback good';$('likeFb').textContent='✨ Sí. Ahora elegí vos.';setTimeout(c1PersonalPreference,550)}else{b.classList.add('wrong');$('likeFb').className='feedback soft';$('likeFb').textContent='Escuchá de nuevo y mirá a Amanda.';session.c1LikeHelp=1;speak('I like books.',true)}});
}
function c1PersonalPreference(){
  screen.innerHTML=`<section class="card word-stage">${c1Header(7,'Choose Your First Room')}<div class="prompt">Ahora elegí algo de verdad. No hay respuesta incorrecta.</div><div class="action-grid"><button class="action-card room-choice" data-room="books"><div class="action-icon">📚✨</div></button><button class="action-card room-choice" data-room="music"><div class="action-icon">🎵🎧</div></button><button class="action-card room-choice" data-room="animals"><div class="action-icon">🐾🦉</div></button></div></section>`;
  document.querySelectorAll('.room-choice').forEach(b=>b.onclick=()=>{state.chosenRoom=b.dataset.room;saveState();c1PedRecord('like',true,['usage'],'c1:s7:personal_preference',{mode:'personal_choice',helpLevel:0});c1Scene7Choice(b.dataset.room)});
}
function c1Scene7Choice(room){
  const labels={books:['books','📚✨'],music:['music','🎵🎧'],animals:['animals','🐾🦉']};const [word,art]=labels[room];
  screen.innerHTML=`<section class="card word-stage">${c1Header(7,'Choose Your First Room')}<div class="big-emoji">${art}</div><div class="prompt">Escuchá la intención que confirma tu elección.</div><button id="choiceAudio" class="sound-orb">🔊</button><div id="wantWritten" class="big-word hidden" style="font-size:26px">I want this room.</div><button id="wantReveal" class="btn secondary">🔤 Ver frase</button><button id="wantRoom" class="btn primary wide" style="margin-top:12px">✅ Confirmar mi habitación</button>${c1HelpBox('La persona señala la habitación que eligió y quiere quedarse ahí.','I want this room. = Quiero esta habitación.','want')}</section>`;
  setTimeout(()=>speak('I want this room.'),250);$('choiceAudio').onclick=()=>speak('I want this room.');$('wantReveal').onclick=()=>{c1RevealWritten('wantWritten');$('wantReveal').disabled=true};$('wantRoom').onclick=()=>{c1PedRecord('want',true,['listening','usage'],'c1:s7:want_room',{mode:'personal_intention',helpLevel:session.meqHelpLevel||0});c1WantTransfer()};
}
function c1WantTransfer(){
  screen.innerHTML=`<section class="card word-stage">${c1Header(7,'Choose Your First Room')}<div class="prompt">Una última transferencia. Escuchá qué quiere Milo.</div><button id="want2Audio" class="sound-orb">🔊</button><div class="choice-grid"><button class="choice" data-id="book">📘</button><button class="choice" data-id="key">🔑</button><button class="choice" data-id="bag">🎒</button></div><div id="want2Fb" class="feedback"></div></section>`;
  setTimeout(()=>speak('I want the book.'),250);$('want2Audio').onclick=()=>speak('I want the book.');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id==='book';c1PedRecord('want',ok,['listening','usage'],'c1:s7:want_book_transfer',{distractorId:b.dataset.id,mode:'intention_transfer',helpLevel:0});if(ok){b.classList.add('correct');$('want2Fb').className='feedback good';$('want2Fb').textContent='✨ Entendido en otra situación.';c1Award('scene7',45);setTimeout(c1Scene8,550)}else{b.classList.add('wrong');$('want2Fb').className='feedback soft';$('want2Fb').textContent='Escuchá otra vez.';speak('I want the book.',true)}});
}
function renderC1Finale(){
  const tasks=[
    {audio:'Hello!',target:'hello',unit:'hello',art:'🚪✨ 👋',opts:[['hello','👋'],['no','❌'],['wait','⏳']]},
    {audio:'Find the key.',target:'key',unit:'key',art:'📘 🎒 🔑',opts:[['book','📘'],['bag','🎒'],['key','🔑']]},
    {audio:'Open the door.',target:'open',unit:'open',art:'🚪🔒',opts:[['open','✨🚪'],['close','🔒'],['sit','🪑']]},
    {audio:'Ready?',target:'yes',unit:'ready',art:'🏰✨ ❓',opts:[['yes','✅'],['no','❌'],['goodbye','👋🚶']]},
    {audio:'Where is Milo?',target:'milo',unit:'where',art:'👧🏻 🦊 🦉',opts:[['girl','👧🏻'],['milo','🦊'],['owl','🦉']]}
  ];
  const t=tasks[session.finaleRound];
  screen.innerHTML=`<section class="card word-stage">${c1Header(8,'Finale · Enter the Academy')}<div class="eyebrow" style="margin-top:12px">Final challenge ${session.finaleRound+1}/5</div><div class="big-emoji">${t.art}</div><button id="finaleAudio" class="sound-orb">🔊</button><p class="instruction">Microevaluación invisible: sin texto y sin pista inicial.</p><div class="action-grid">${t.opts.map(o=>`<button class="action-card" data-id="${o[0]}"><div class="action-icon">${o[1]}</div></button>`).join('')}</div><div id="finaleFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),250);$('finaleAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.action-card').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;meqRecordTextUnits?.(t.audio,ok,{dimensions:['listening','usage'],context:`c1:s8:boss${session.finaleRound}`,mode:'global_story_check',helpLevel:0});if(t.unit==='where')c1PedRecord('where',ok,['listening','usage'],'c1:s8:where_milo',{distractorId:b.dataset.id,mode:'global_story_check',helpLevel:0});if(ok){session.finaleScore++;b.classList.add('correct');$('finaleFb').className='feedback good';$('finaleFb').textContent='⭐ Bien.'}else{b.classList.add('wrong');$('finaleFb').className='feedback soft';$('finaleFb').textContent='Esto queda marcado para refuerzo, no para repetir todo.'}setTimeout(()=>{session.finaleRound++;if(session.finaleRound<tasks.length)renderC1Finale();else finishC1Finale()},600)});
}
function finishC1Finale(){
  const aggregatePass=session.finaleScore>=4,unitPass=typeof meqStoryUnitGate==='function'?meqStoryUnitGate('chapter_1_magic_letter'):true;
  if(aggregatePass&&unitPass){state.chapter1Complete=true;saveState();c1Award('finale',100);return c1Ending()}
  const plan=typeof meqStoryRepairPlan==='function'?meqStoryRepairPlan('chapter_1_magic_letter',3):[];
  if(plan.length){session.c1RepairPlan=plan;session.c1RepairIndex=0;session.c1RepairCycle=(session.c1RepairCycle||0)+1;return c1RenderRepair()}
  screen.innerHTML=`<section class="card reward-card">${c1Header(8,'Finale · Enter the Academy')}<div class="big-emoji">🦊🔁</div><h1 class="title">Un refuerzo corto</h1><p class="subtitle">No repetimos el capítulo. Volvemos solamente a la parte que todavía no quedó firme.</p><button id="finaleNext" class="btn primary wide">Reintentar el desafío final →</button></section>`;$('finaleNext').onclick=c1Scene8;
}
function c1RepairTaskFor(id){
  const cycle=session.c1RepairCycle||1;
  const bank={
    teacher:{audio:'Teacher.',target:'teacher',opts:[['teacher','🧑‍🏫'],['student','🧒🎒']],dims:['listening','visual']},
    student:{audio:'Student.',target:'student',opts:[['teacher','🧑‍🏫'],['student','🧒🎒']],dims:['listening','visual']},
    who:{audio:'Who is Milo?',target:'milo',opts:[['milo','🦊'],['teacher','🧑‍🏫']],dims:['listening','usage']},
    where:{audio:cycle%2?'Where is the key?':'Where is the book?',target:cycle%2?'key':'book',opts:cycle%2?[['key','🔑'],['book','📘']]:[['book','📘'],['key','🔑']],dims:['listening','usage']},
    can:{audio:cycle%2?'Can you open the door?':'Can you help?',target:'yes',opts:[['yes','✅'],['no','❌']],dims:['listening','usage']},
    like:{audio:cycle%2?'I like books.':'I like music.',target:cycle%2?'books':'music',opts:[['books','📚'],['music','🎵']],dims:['listening','usage']},
    want:{audio:cycle%2?'I want the key.':'I want the book.',target:cycle%2?'key':'book',opts:[['key','🔑'],['book','📘']],dims:['listening','usage']}
  };return bank[id]||null;
}
function c1RenderRepair(){
  const id=session.c1RepairPlan?.[session.c1RepairIndex],t=c1RepairTaskFor(id);if(!id||!t)return finishC1Finale();
  screen.innerHTML=`<section class="card word-stage">${c1Header(8,'Focused Repair')}<div class="eyebrow">Refuerzo ${session.c1RepairIndex+1}/${session.c1RepairPlan.length}</div><div class="prompt">Una prueba nueva para <b>${id}</b>. Primero sin ayuda.</div><button id="c1RepairAudio" class="sound-orb">🔊</button><div class="choice-grid">${t.opts.map(o=>`<button class="choice" data-id="${o[0]}">${o[1]}</button>`).join('')}</div><div id="c1RepairFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(t.audio),230);$('c1RepairAudio').onclick=()=>speak(t.audio);document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const ok=b.dataset.id===t.target;c1PedRecord(id,ok,t.dims,`c1:repair:${id}:cycle${session.c1RepairCycle}`,{distractorId:b.dataset.id,mode:'targeted_repair',helpLevel:0});if(ok){b.classList.add('correct');$('c1RepairFb').className='feedback good';$('c1RepairFb').textContent='✨ Mejor. Seguimos sólo con lo necesario.';session.c1RepairIndex++;setTimeout(()=>{if(session.c1RepairIndex<session.c1RepairPlan.length)c1RenderRepair();else finishC1Finale()},520)}else{b.classList.add('wrong');$('c1RepairFb').className='feedback soft';$('c1RepairFb').textContent='Milo lo repite lento. Después lo probamos en otra situación.';window.MEQPedagogy?.recordHelp(id,1,'chapter1','repair_retry');speak(t.audio,true);setTimeout(()=>{session.c1RepairCycle++;c1RenderRepair()},700)}});
}
