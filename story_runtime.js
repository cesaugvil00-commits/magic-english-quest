'use strict';

// MVP 0.9 — declarative story helpers. New chapters can describe most repeated
// teaching/checking patterns as data instead of creating a bespoke DOM flow for
// every screen. Chapter 4 is the first story built primarily on these helpers.

function meqStoryData(id){return window.MEQ_STORY_DATA?.[id]||null;}
function meqStoryScene(storyId,index){return meqStoryData(storyId)?.scenes?.[index-1]||null;}
function meqEnsureEvidence(stateKey){
  state[stateKey] ||= {listeningCorrect:0,listeningTotal:0,usageCorrect:0,usageTotal:0,readingCorrect:0,readingTotal:0,speakingScore:0,speakingAttempts:0,helpUses:0};
  return state[stateKey];
}
function meqRecordEvidence(stateKey,kind,correct,weight=1){
  const e=meqEnsureEvidence(stateKey);
  if(kind==='listening'){e.listeningTotal+=weight;if(correct)e.listeningCorrect+=weight;}
  if(kind==='usage'){e.usageTotal+=weight;if(correct)e.usageCorrect+=weight;}
  if(kind==='reading'){e.readingTotal+=weight;if(correct)e.readingCorrect+=weight;}
  saveState();
}
function meqRecordSpeech(stateKey,score){const e=meqEnsureEvidence(stateKey);e.speakingAttempts++;e.speakingScore+=score;saveState();}
function meqEvidenceRatios(stateKey){
  const e=meqEnsureEvidence(stateKey);
  return {
    listening:e.listeningTotal?e.listeningCorrect/e.listeningTotal:0,
    usage:e.usageTotal?e.usageCorrect/e.usageTotal:0,
    reading:e.readingTotal?e.readingCorrect/e.readingTotal:0,
    speaking:e.speakingAttempts?e.speakingScore/e.speakingAttempts:0,
  };
}
function meqStoryHeader(chapterLabel,scene,total,title){return `${meqSceneProgress(chapterLabel,scene,total)}<div class="eyebrow" style="margin-top:12px">${title}</div>`;}
function meqStoryHelp(text,translation='',unitId=''){
  const safe=(x)=>String(x||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  return `<div class="help-box meq-progressive-help" data-level="0" data-unit="${safe(unitId)}" data-translation="${safe(translation)}"><b>💡 Milo:</b> Primero intentá sin ayuda.<div class="meq-help-content microcopy">Si te trabás, abrí una pista. El español queda para el final.</div><button class="btn secondary meq-help-step" style="margin-top:8px" onclick="meqStoryHelpStep(this)">💡 Necesito una pista</button><template class="meq-help-visual">${safe(text)}</template></div>`;
}
function meqStoryHelpStep(btn){
  const box=btn.closest('.meq-progressive-help');if(!box)return;const level=Math.min(4,(Number(box.dataset.level)||0)+1);box.dataset.level=String(level);session.meqHelpLevel=level;if(session.meqDialogue)session.meqDialogue.helpLevel=Math.max(session.meqDialogue.helpLevel||0,level);
  const unitId=box.dataset.unit||'';if(unitId)window.MEQPedagogy?.recordHelp(unitId,level,'story','progressive_help');else{state.helpUses=(state.helpUses||0)+1;saveState();}
  const content=box.querySelector('.meq-help-content'),visual=box.querySelector('.meq-help-visual')?.innerHTML||'';
  if(level===1)content.innerHTML=`👀 ${visual||'Mirá qué objeto, gesto o acción cambia.'}`;
  if(level===2)content.textContent='🐢 Volvé a escuchar el audio más despacio y prestá atención a la palabra clave.';
  if(level===3)content.textContent='✨ Buscá la misma idea en otra imagen, objeto o situación; no traduzcas todavía.';
  if(level===4){const tr=box.dataset.translation||'';content.textContent=tr?`🇦🇷 Rescate: ${tr}`:'🇦🇷 Rescate: Milo explica brevemente en español lo necesario para seguir.';btn.disabled=true;btn.textContent='Ayuda completa';}
  else btn.textContent=level===1?'🐢 Otra pista':level===2?'✨ Otro ejemplo':'🇦🇷 Último rescate';
}
function meqRecordUnitTask(id,ok,{dimensions=['listening','usage'],context='story_task',mode='story_task',distractorId=null,helpLevel=null,weight=1}={}){
  if(!id||!window.MEQ_VOCAB_DATA?.[id])return;const h=helpLevel==null?(session.meqHelpLevel||0):helpLevel;for(const dim of dimensions)window.MEQPedagogy?.record(id,dim,ok,weight,{source:'story',context,mode,helpLevel:h,distractorId:ok?null:distractorId});
}
function meqStoryUnitGate(storyId){
  const d=meqStoryData(storyId);if(!d)return true;const ids=(d.new_vocabulary||[]).filter(id=>window.MEQ_VOCAB_DATA?.[id]);return ids.every(id=>window.MEQPedagogy?.learned(id));
}
function meqStoryRepairPlan(storyId,limit=3){const d=meqStoryData(storyId);const ids=(d?.new_vocabulary||[]).filter(id=>window.MEQ_VOCAB_DATA?.[id]);return window.MEQPedagogy?.repairPlan(ids,limit)||[];}
function meqAwardStory(prefix,id,coins){claim(`${prefix}_${id}`,coins);window.MEQPedagogy?.scheduleSceneById(id);}
function meqChoiceVisual(choice){
  if(choice.img)return meqImg(choice.img,choice.label||choice.id,'runtime-choice-img');
  return `<span class="runtime-choice-emoji">${choice.visual||choice.label||'✨'}</span>`;
}
function meqRuntimeListenChoices(opts){
  const {stateKey,chapterLabel,scene,total,title,tasks,onDone,recordUsage=true,recordReading=false,help='Escuchá otra vez y mirá qué cambia en la escena.'}=opts;
  session={...session,meqHelpLevel:0,meqRuntime:{kind:'listenChoices',round:0,tasks,opts:{stateKey,chapterLabel,scene,total,title,onDone,recordUsage,recordReading,help}}};
  meqRuntimeRenderChoice();
}
function meqRuntimeRenderChoice(){
  const rt=session.meqRuntime;if(!rt||rt.kind!=='listenChoices')return;
  if(rt.round>=rt.tasks.length){const done=rt.opts.onDone;session.meqRuntime=null;return done?.();}
  const t=rt.tasks[rt.round],o=rt.opts,choices=shuffle(t.choices);
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(o.chapterLabel,o.scene,o.total,o.title)}<span class="game-label">👂 Escuchá + 🎮 actuá</span><div class="prompt">${t.prompt||'Escuchá la pista.'}</div><button id="rtAudio" class="sound-orb">🔊</button><div class="runtime-choice-grid">${choices.map(c=>`<button class="runtime-choice" data-id="${c.id}">${meqChoiceVisual(c)}${c.showLabel?`<b>${c.label||c.id}</b>`:''}</button>`).join('')}</div><div id="rtFb" class="feedback"></div>${meqStoryHelp(o.help,t.translation||'',t.target)}</section>`;
  setTimeout(()=>speak(t.audio),220);$('rtAudio').onclick=()=>speak(t.audio);
  document.querySelectorAll('.runtime-choice').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.id===t.target,ctx=`${o.stateKey}:scene${o.scene}:round${rt.round}`;meqRecordEvidence(o.stateKey,'listening',ok);if(window.MEQ_VOCAB_DATA?.[t.target]){const meta={source:'story',context:ctx,mode:'audio_to_visual',helpLevel:session.meqHelpLevel||0,distractorId:ok?null:b.dataset.id};window.MEQPedagogy?.record(t.target,'listening',ok,1,meta);window.MEQPedagogy?.record(t.target,'visual',ok,1,meta)}if(o.recordUsage){meqRecordEvidence(o.stateKey,'usage',ok);if(window.MEQ_VOCAB_DATA?.[t.target])window.MEQPedagogy?.record(t.target,'usage',ok,1,{source:'story',context:ctx+':use',mode:'context_use',helpLevel:session.meqHelpLevel||0,distractorId:ok?null:b.dataset.id})}if(o.recordReading)meqRecordEvidence(o.stateKey,'reading',ok);
    document.querySelectorAll('.runtime-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('rtFb').className=`feedback ${ok?'good':'soft'}`;$('rtFb').textContent=ok?(t.success||'✨ Bien. La pista y la escena coincidieron.'):(t.retry||'Todavía no. Milo la repite lento.');
    if(ok)playSfx('success');else{playSfx('retry');speak(t.audio,true)}
    setTimeout(()=>{if(ok||t.advanceOnMiss){rt.round++;session.meqHelpLevel=0;meqRuntimeRenderChoice()}else meqRuntimeRenderChoice()},780);
  });
}
function meqRuntimeTeachCarousel(opts){
  const {chapterLabel,scene,total,title,items,onDone,helpTranslation=true}=opts;session={...session,meqHelpLevel:0,meqTeach:{index:0,opts:{chapterLabel,scene,total,title,items,onDone,helpTranslation}}};meqRuntimeRenderTeach();
}
function meqRuntimeRenderTeach(){
  const rt=session.meqTeach,o=rt?.opts;if(!rt||!o)return;const item=o.items[rt.index],art=meqChoiceVisual(item);window.MEQPedagogy?.present(item.id,'story',`teach:${o.scene}:${rt.index}`);
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(o.chapterLabel,o.scene,o.total,o.title)}<span class="game-label">👀 Mirá + 👂 escuchá</span><div class="runtime-teach-card">${art}<b id="rtTeachWritten" class="hidden">${(item.label||item.en||item.id).toUpperCase()}</b></div><button id="rtTeachAudio" class="sound-orb">🔊</button><button id="rtTeachReveal" class="btn secondary" style="margin-top:8px">🔤 Ver palabra</button><p class="instruction">Primero sonido + imagen. La escritura es un segundo paso opcional.</p><div class="step-dots">${o.items.map((_,i)=>`<div class="dot ${i<rt.index?'done':i===rt.index?'now':''}"></div>`).join('')}</div><div class="btn-row"><button id="rtTeachNext" class="btn primary">${rt.index===o.items.length-1?'Ahora sin texto →':'Siguiente →'}</button></div>${meqStoryHelp('Mirá de nuevo la imagen o acción. Después escuchá otra vez.',item.es?`${item.en||item.label||item.id} = ${item.es}`:'',item.id)}</section>`;
  setTimeout(()=>speak(item.en||item.label||item.id),180);$('rtTeachAudio').onclick=()=>speak(item.en||item.label||item.id);$('rtTeachReveal').onclick=()=>{$('rtTeachWritten').classList.remove('hidden');$('rtTeachReveal').disabled=true};
  $('rtTeachNext').onclick=()=>{if(rt.index<o.items.length-1){rt.index++;session.meqHelpLevel=0;meqRuntimeRenderTeach()}else{const done=o.onDone;session.meqTeach=null;done?.()}};
}
function meqRuntimeVoicePrompt({stateKey,chapterLabel,scene,total,title,target,intro,onPass,onFallback}){
  screen.innerHTML=`<section class="card word-stage scene-card">${meqStoryHeader(chapterLabel,scene,total,title)}<span class="game-label">🎤 Tu turno</span><div class="prompt">${intro}</div><div class="speech-model"><button id="rtVoiceModel" class="sound-orb">🔊</button><strong>${target}</strong></div><button id="rtVoiceTry" class="btn primary wide">🎤 Decirlo</button><button id="rtVoiceFallback" class="btn secondary wide" style="margin-top:9px">Usar opción guiada</button><div id="rtVoiceFb" class="feedback"></div></section>`;
  $('rtVoiceModel').onclick=()=>speak(target);setTimeout(()=>speak(target),180);
  $('rtVoiceFallback').onclick=()=>{meqRecordSpeech(stateKey,.68);meqRecordVoiceUnits(target,.68,{context:`${stateKey}:guided_voice`,helpLevel:3});onFallback?.();};
  $('rtVoiceTry').onclick=()=>{
    if(!speechRecognitionSupported()){meqRecordSpeech(stateKey,.7);meqRecordVoiceUnits(target,.7,{context:`${stateKey}:voice_fallback`,helpLevel:3});$('rtVoiceFb').className='feedback good';$('rtVoiceFb').textContent='🎤 En este navegador usamos el modo guiado.';return setTimeout(()=>onPass?.(.7),650)}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition,r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=5;$('rtVoiceFb').textContent='🎧 Escuchando…';
    r.onresult=e=>{const alts=[...e.results[0]].map(a=>a.transcript),res=scorePronunciationTranscript(target,alts),ok=res.phrase>=.64;meqRecordSpeech(stateKey,res.phrase);meqRecordVoiceUnits(target,res.phrase,{context:`${stateKey}:voice`,helpLevel:0});storePronunciation(`runtime:${normalize(target)}`,res);$('rtVoiceFb').className=`feedback ${ok?'good':'soft'}`;$('rtVoiceFb').innerHTML=(ok?'🌟 Te entendí.':'Casi. Probemos más lento.')+pronunciationHtml(res);if(ok)setTimeout(()=>onPass?.(res.phrase),800);else speak(target,true)};
    r.onerror=()=>{$('rtVoiceFb').className='feedback soft';$('rtVoiceFb').textContent='No te escuché bien. Podés volver a intentar o usar la opción guiada.';};r.start();
  };
}
window.MEQ_RUNTIME_VERSION='1.9.0';

// Pedagogical Engine v2 helpers shared by bespoke and declarative scenes.
function meqUnitIdsFromText(text){
  const norm=String(text||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  if(!norm)return [];
  const vocab=window.MEQ_VOCAB_DATA||{};
  const entries=Object.entries(vocab).map(([id,u])=>[id,String(u.english||u.en||id).toLowerCase().replace(/_/g,' ')]).sort((a,b)=>b[1].length-a[1].length);
  const padded=` ${norm} `, out=[];
  for(const [id,phrase] of entries){if(phrase&&padded.includes(` ${phrase} `)&&!out.includes(id))out.push(id)}
  return out;
}
function meqRecordTextUnits(text,ok,{dimensions=['listening'],context='story_text',mode='phrase_transfer',helpLevel=null,weight=1}={}){
  for(const id of meqUnitIdsFromText(text))meqRecordUnitTask(id,ok,{dimensions,context:`${context}:${id}`,mode,helpLevel,weight});
}
function meqRecordVoiceUnits(text,score,{context='story_voice',helpLevel=0}={}){
  const ok=score>=.64;for(const id of meqUnitIdsFromText(text))meqRecordUnitTask(id,ok,{dimensions:['speaking'],context:`${context}:${id}`,mode:'voice_attempt',helpLevel,weight:Math.max(.35,score||.35)});
}
function meqPedagogySummary(ids=null){
  const vocab=window.MEQ_VOCAB_DATA||{}, pool=(ids||Object.keys(vocab)).filter(id=>vocab[id]);
  const counts={presented:0,learned:0,consolidated:0,tracked:0};
  const weak=[];
  for(const id of pool){const u=window.MEQPedagogy?.unit(id);if(!u)continue;counts.tracked++;const status=window.MEQPedagogy.status(id);if(status==='presented'||status==='learned'||status==='consolidated')counts.presented++;if(status==='learned'||status==='consolidated')counts.learned++;if(status==='consolidated')counts.consolidated++;const w=window.MEQPedagogy.weakness?.(id);if(w&&status!=='consolidated')weak.push({id,status,weakness:w,helpMax:u.helpMax||0,confusions:u.confusions||{}})}
  weak.sort((a,b)=>(b.helpMax-a.helpMax)||String(a.status).localeCompare(String(b.status)));return {counts,weak};
}
function meqStoryMasterySummary(storyId){
  const d=meqStoryData(storyId),ids=(d?.new_vocabulary||[]).filter(id=>window.MEQ_VOCAB_DATA?.[id]);return {ids,...meqPedagogySummary(ids)};
}
