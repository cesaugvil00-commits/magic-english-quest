'use strict';

// MVP 0.6 — quality layer: visual polish, repeatable music practice,
// word-level speech feedback, performance helpers and a richer home hub.

function ensureQState(){
  state.songStars ||= {};
  state.pronunciation ||= {};
  state.totalXp ||= 0;
  state.lastRoute ||= 'home';
}
ensureQState();

// ---------- Lightweight pronunciation scoring (browser prototype) ----------
// This scores what the browser recognizer transcribed. It is useful feedback,
// but it is NOT phoneme/acoustic scoring. The production app will replace it
// with a real pronunciation provider while preserving this UI contract.
function qLev(a,b){
  a=normalize(a); b=normalize(b);
  const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++)dp[i][0]=i; for(let j=0;j<=n;j++)dp[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return dp[m][n];
}
function qSimilarity(a,b){
  a=normalize(a);b=normalize(b);if(!a&&!b)return 1;if(!a||!b)return 0;
  return Math.max(0,1-qLev(a,b)/Math.max(a.length,b.length));
}
function qBestWordScore(targetWord,heardWords){
  if(!heardWords.length)return 0;
  return Math.max(...heardWords.map(w=>qSimilarity(targetWord,w)));
}
function scorePronunciationTranscript(target,alternatives){
  const t=normalize(target),tWords=t.split(/\s+/).filter(Boolean);
  const altNorm=alternatives.map(normalize).filter(Boolean);
  let best={phrase:0,heard:altNorm[0]||'',words:tWords.map(w=>({word:w,score:0}))};
  for(const alt of altNorm){
    const hWords=alt.split(/\s+/).filter(Boolean);
    const phrase=qSimilarity(t,alt);
    const words=tWords.map((w,i)=>{
      const positional=hWords[i]?qSimilarity(w,hWords[i]):0;
      const flexible=qBestWordScore(w,hWords);
      return {word:w,score:Math.max(positional,flexible*.92)};
    });
    const wordAvg=words.reduce((s,x)=>s+x.score,0)/Math.max(1,words.length);
    const combined=phrase*.48+wordAvg*.52;
    if(combined>best.phrase)best={phrase:combined,heard:alt,words};
  }
  return best;
}
function pronunciationHtml(result){
  const chips=result.words.map(x=>{
    const p=Math.round(x.score*100),klass=p>=84?'pron-good':p>=66?'pron-warn':'pron-retry';
    return `<span class="pron-chip ${klass}"><b>${x.word}</b><small>${p}%</small></span>`;
  }).join('');
  return `<div class="pron-result"><div class="pron-heard">Escuché: <b>“${result.heard||'…'}”</b></div><div class="pron-chips">${chips}</div><div class="microcopy">Prototipo: compara la transcripción reconocida palabra por palabra. La versión final usará puntuación fonética/acústica.</div></div>`;
}
function storePronunciation(key,result){
  const prev=state.pronunciation[key]||{best:0,attempts:0};
  state.pronunciation[key]={best:Math.max(prev.best,result.phrase),attempts:prev.attempts+1,last:Date.now()};
  state.totalXp+=Math.round(3+result.phrase*7);saveState();
}

// Override Phase 0 recognizer with graded word feedback.
recognize = function(u){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=5;$('voiceFeedback').textContent='🎧 Escuchando…';
  r.onresult=e=>{
    const alts=[...e.results[0]].map(a=>a.transcript);const result=scorePronunciationTranscript(u.en,alts);storePronunciation(u.id,result);
    const ok=result.phrase>=.72;if(ok){session.score++;claim(`s${session.step}_speak_${u.id}`,3);playSfx('success')}else playSfx('retry');
    $('voiceFeedback').className=`feedback ${ok?'good':'soft'}`;
    $('voiceFeedback').innerHTML=(ok?'🌟 Te entendí.':'Casi. Escuchá el modelo y probá la parte amarilla/roja.')+pronunciationHtml(result);
    if(!ok)speak(u.en,true);setTimeout(nextVoiceRound,ok?1350:1850);
  };
  r.onerror=()=>{$('voiceFeedback').className='feedback soft';$('voiceFeedback').textContent='No te escuché bien. Podés probar otra vez; esto no borra tu progreso.'};r.start();
};

// Override Chapter 2 voice moment with the same scoring contract.
c2Recognize = function(target){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=5;$('c2VoiceFb').textContent='🎧 Escuchando…';
  r.onresult=e=>{
    const alts=[...e.results[0]].map(a=>a.transcript);const result=scorePronunciationTranscript(target,alts);storePronunciation(`c2:${normalize(target)}`,result);c2RecordSpeech(result.phrase);
    const ok=result.phrase>=.66;$('c2VoiceFb').className=`feedback ${ok?'good':'soft'}`;$('c2VoiceFb').innerHTML=(ok?'🌟 La cocina te entendió.':'Todavía falta claridad en una parte.')+pronunciationHtml(result);
    if(!ok)speak(target,true);else setTimeout(()=>{c2Award('scene9',55);c2Scene10Intro()},1550);
  };
  r.onerror=()=>{$('c2VoiceFb').className='feedback soft';$('c2VoiceFb').textContent='No te escuché bien. Podés intentar de nuevo o seguir.'};r.start();
};

// ---------- Original rhythm / music practice ----------
let qAudioCtx=null;
function qCtx(){
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
  qAudioCtx ||= new AC(); if(qAudioCtx.state==='suspended')qAudioCtx.resume().catch(()=>{});return qAudioCtx;
}
function qTone(freq=440,when=0,dur=.08,vol=.035){
  if(!state.soundOn)return;const ctx=qCtx();if(!ctx)return;
  const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,ctx.currentTime+when);g.gain.linearRampToValueAtTime(vol,ctx.currentTime+when+.01);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+when+dur);o.connect(g).connect(ctx.destination);o.start(ctx.currentTime+when);o.stop(ctx.currentTime+when+dur+.02);
}
function qBeat(count=4){for(let i=0;i<count;i++)qTone(i===0?660:440,i*.34,.07,i===0?.06:.035)}

const SONGS={
  hello:{id:'hello',title:'Hello Beat',unlock:()=>true,icon:'👋🎵',phrases:[
    {text:'Hello!',visual:'👋',words:['hello']},
    {text:'Hello, my friend!',visual:'👋🤝',words:['hello','my','friend']},
    {text:'Look and listen.',visual:'👀👂',words:['look','and','listen']},
    {text:'Come with me.',visual:'🫴➡️🙋‍♀️',words:['come','with','me']},
    {text:'Yes! I am ready!',visual:'✅🙋‍♀️🎒',words:['yes','i','am','ready']},
    {text:'Goodbye!',visual:'🚶‍♀️👋',words:['goodbye']},
  ]},
  potion:{id:'potion',title:'Potion Beat',unlock:()=>!!state.chapter1Complete,icon:'🧪🎵',phrases:[
    {text:'Red, blue, green.',visual:'🔴🔵🟢',words:['red','blue','green']},
    {text:'Look at the bottle.',visual:'👀🧪',words:['look','at','the','bottle']},
    {text:'Take the milk.',visual:'🤲🥛',words:['take','the','milk']},
    {text:'Make the drink.',visual:'🧪✨🧃',words:['make','the','drink']},
    {text:'It is green!',visual:'🧪🟢✨',words:['it','is','green']},
  ]}
};
function songBest(id){return state.songStars[id]||0}
function showSongs(){
  ensureQState();setActiveNav('songs');state.lastRoute='songs';saveState();
  const cards=Object.values(SONGS).map(s=>{const unlocked=s.unlock(),stars=songBest(s.id);return `<button class="song-card ${unlocked?'':'locked'}" data-song="${s.id}" ${unlocked?'':'disabled'}><span>${s.icon}</span><div><b>${s.title}</b><small>${unlocked?(stars?`Mejor: ${'⭐'.repeat(stars)}`:'Listo para jugar'):'🔒 Terminá la historia anterior'}</small></div><i>▶</i></button>`}).join('');
  screen.innerHTML=`<section class="card hero-card music-hero"><div class="eyebrow">Música + pronunciación</div><h1 class="title">🎵 Sing & Speak</h1><p class="subtitle">Ritmo original del juego. Escuchás, seguís el pulso y repetís frases que ya aparecieron en la aventura. Acá no entran reglas nuevas.</p>${guide('La canción sirve para que las frases se vuelvan automáticas. Repetir acá da estrellas y XP, no dinero real.')}</section><section class="card"><div class="song-list">${cards}</div></section>`;
  document.querySelectorAll('.song-card:not(.locked)').forEach(b=>b.onclick=()=>startSong(b.dataset.song));
}
function startSong(id){
  const song=SONGS[id];session={song,id,index:0,score:0,taps:0};qBeat(4);setTimeout(()=>renderSongPhrase(song),750);
}
function renderSongPhrase(song){
  const p=song.phrases[session.index];const tokens=p.text.replace(/[!.,?]/g,'').split(/\s+/);session.songExpected=tokens.map(normalize);session.songTapIndex=0;
  screen.innerHTML=`<section class="card word-stage song-stage"><div class="song-top"><span class="game-label">🎵 ${song.title}</span><b>${session.index+1}/${song.phrases.length}</b></div><div class="big-emoji song-visual">${p.visual}</div><div class="karaoke-line">${tokens.map((w,i)=>`<button class="karaoke-word ${i===0?'next':''}" data-i="${i}">${w}</button>`).join('')}</div><p class="instruction">Escuchá la frase. Después tocá las palabras en orden siguiendo el pulso.</p><button id="songHear" class="sound-orb">🔊</button><div class="btn-row"><button id="songSlow" class="btn secondary">🐢 Lento</button><button id="songReplayBeat" class="btn secondary">🥁 Pulso</button></div><div id="songFb" class="feedback"></div></section>`;
  setTimeout(()=>speak(p.text),220);$('songHear').onclick=()=>speak(p.text);$('songSlow').onclick=()=>speak(p.text,true);$('songReplayBeat').onclick=()=>qBeat(Math.min(4,tokens.length));
  document.querySelectorAll('.karaoke-word').forEach(b=>b.onclick=()=>qSongTap(song,p,b));
}
function qSongTap(song,p,b){
  const i=Number(b.dataset.i);if(i!==session.songTapIndex){b.classList.add('miss');playSfx('retry');$('songFb').className='feedback soft';$('songFb').textContent='Seguí el orden de la frase. La palabra que brilla va ahora.';setTimeout(()=>b.classList.remove('miss'),280);return}
  b.classList.remove('next');b.classList.add('hit');qTone(520+session.songTapIndex*55,0,.09,.045);session.songTapIndex++;session.taps++;
  const next=document.querySelector(`.karaoke-word[data-i="${session.songTapIndex}"]`);if(next)next.classList.add('next');
  if(session.songTapIndex>=session.songExpected.length){session.score++;$('songFb').className='feedback good';$('songFb').textContent='✨ Frase completa. Ahora escuchala una vez más como una sola idea.';setTimeout(()=>{session.index++;if(session.index<song.phrases.length){qBeat(3);setTimeout(()=>renderSongPhrase(song),480)}else finishSong(song)},950)}
}
function finishSong(song){
  const ratio=session.score/song.phrases.length;const stars=ratio>=.98?3:ratio>=.75?2:1;state.songStars[song.id]=Math.max(songBest(song.id),stars);state.totalXp+=stars*15;saveState();playSfx('success');
  screen.innerHTML=`<section class="card reward-card"><div class="big-emoji">🎵✨</div><div class="eyebrow">${song.title}</div><h1 class="title">${'⭐'.repeat(stars)} ${stars===3?'Song Star!':'Buen ritmo'}</h1><p class="subtitle">La música reforzó frases conocidas sin sumar premio económico repetible.</p><div class="reward-money">+${stars*15} XP</div>${guide('Podés volver cuando quieras. Acá repetimos para ganar fluidez, no para farmear monedas.') }<button id="songDone" class="btn primary wide" style="margin-top:14px">Volver a Música</button></section>`;$('songDone').onclick=showSongs;
}

// ---------- Rich home hub ----------
function qCurrentAdventure(){
  if(!state.phase0Complete)return {eyebrow:'Prólogo',title:'Before the Letter',text:`Escalón ${state.currentStep} de 10`,icon:'🦉✉️',action:()=>state.introSeen?startStep(state.currentStep):intro()};
  if(!state.chapter1Complete)return {eyebrow:'Chapter 1',title:'The Magic Letter',text:'Tu carta ya llegó',icon:'✉️✨',action:showChapter1Intro};
  if(!state.chapter2Complete)return {eyebrow:'Chapter 2',title:'Potion Mystery',text:'Hay una botella fuera de lugar',icon:'🧪🔎',action:showChapter2Intro};
  return {eyebrow:'Campaña',title:'Dos historias completadas',text:'Chapter 3 está preparado como próximo bloque',icon:'🏰🦉',action:showCampaign};
}
function qKnownCount(){const p=window.MEQPedagogy?.profileSummary?.();return p?(p.learned||0)+(p.consolidated||0):Object.values(state.stage).filter(x=>x?.mastered).length*5}
function showHome(){
  ensureQState();setActiveNav('');state.lastRoute='home';saveState();const a=qCurrentAdventure(),due=dueReviews().length,known=qKnownCount();
  screen.innerHTML=`<section class="card home-visual hero-card"><div class="home-sky"></div><div class="home-content"><div class="eyebrow">${a.eyebrow}</div><h1 class="title">${a.title}</h1><p class="subtitle">${a.text}</p><div class="home-adventure-icon">${a.icon}</div><button id="continueAdventure" class="btn primary wide">▶ Seguir aventura</button></div></section>
  <section class="home-stats"><button id="homeReview" class="stat-tile"><span>🧠</span><b>${due}</b><small>repasos hoy</small></button><button id="homeWords" class="stat-tile"><span>✨</span><b>${known}</b><small>unidades aprendidas</small></button><button id="homeSongs" class="stat-tile"><span>🎵</span><b>${Object.values(state.songStars).reduce((a,b)=>a+b,0)}</b><small>estrellas música</small></button></section>
  <section class="card"><div class="guide-row"><div class="guide-avatar milo-pulse">🦊</div><div class="guide-bubble"><b>Milo:</b> ${due?'Tenés palabras listas para comprobar si siguen en tu memoria.':'Hoy podemos avanzar en la historia o volver a una canción para ganar fluidez.'}</div></div><div class="quick-grid"><button id="quickMap" class="quick-btn">🗺️<b>Mapa</b><small>Ver escalones</small></button><button id="quickReward" class="quick-btn">🎁<b>${money(eligibleArs())}</b><small>premio semanal</small></button></div></section>`;
  $('continueAdventure').onclick=a.action;$('homeReview').onclick=showReview;$('homeWords').onclick=showWords;$('homeSongs').onclick=showSongs;$('quickMap').onclick=showMap;$('quickReward').onclick=showRewards;
}

// ---------- Route / UI upgrades ----------
const qOldUpdateHud=updateHud;
updateHud=function(){qOldUpdateHud();ensureQState();const l=$('levelText');if(l)l.textContent=(state.chapter2Complete?'Ch. 2 ✓':state.chapter1Complete?'Ch. 2':state.phase0Complete?'Ch. 1':`Step ${state.currentStep}`)+` · ${state.totalXp} XP`;};

// Home button now behaves like a real app home, map remains one tap away.
$('homeBtn').onclick=showHome;

document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>{
  const n=b.dataset.nav;
  if(n==='story')storyRoute();if(n==='map')showMap();if(n==='songs')showSongs();if(n==='review')showReview();if(n==='rewards')showRewards();
});

// Load the optimized image instead of the 2.3 MB PNG where Chapter 2 uses it.
const qOldC2Intro=showChapter2Intro;
showChapter2Intro=function(){qOldC2Intro();const img=document.querySelector('.concept-banner');if(img){img.src='images/potion_game_concept.webp';img.loading='lazy';img.decoding='async';}};

function qInstallParticles(){
  if(document.querySelector('.ambient-sparkles'))return;const layer=document.createElement('div');layer.className='ambient-sparkles';layer.setAttribute('aria-hidden','true');
  for(let i=0;i<18;i++){const s=document.createElement('i');s.style.setProperty('--x',`${Math.random()*100}%`);s.style.setProperty('--delay',`${Math.random()*7}s`);s.style.setProperty('--dur',`${6+Math.random()*7}s`);s.style.setProperty('--size',`${2+Math.random()*3}px`);layer.appendChild(s)}document.body.appendChild(layer);
}
qInstallParticles();
updateHud();updateSoundButton();

// Service worker only works on http(s), never blocks file:// prototype use.
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});

// First 0.6 route is the richer home hub.
showHome();
