'use strict';

const MEQ_CONVERSATION_POLICY={
  version:'1.9.0',
  absoluteBeginnerFreeChat:false,
  transcriptHiddenBeforeAudio:true,
  spokenCorrectionBudget:2,
  keyTakeawaysMax:1,
  lowConfidenceIsNotSuccess:true,
  oneTapRetry:true
};
window.MEQ_CONVERSATION_POLICY=MEQ_CONVERSATION_POLICY;

// MVP 1.9 — guided conversation with measurable autonomy + competitor-informed flow guardrails.
// A turn starts with audio and context, not text. Help is progressive and the
// engine records whether the learner succeeded cleanly or after assistance.

function meqSpeakerLabel(id){
  return ({shopkeeper:'Shopkeeper',milo:'Milo',amanda:'Amanda',player:'You',teacher:'Teacher',guardian:'Guardian'})[id]||id||'Speaker';
}
function meqDialogueNormalize(text){return String(text||'').toLowerCase().replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ').trim();}
function meqDialogueUnitIds(text){
  const phrase=` ${meqDialogueNormalize(text)} `,out=[];
  for(const [id,v] of Object.entries(window.MEQ_VOCAB_DATA||{})){
    const en=meqDialogueNormalize(v.english||'');if(!en)continue;
    if(phrase.includes(` ${en} `))out.push(id);
  }
  return [...new Set(out)];
}
function meqDialogueRecordUnits(text,dimension,correct,rt,t,{score=1,mode='dialogue',distractorId=null}={}){
  const ids=meqDialogueUnitIds(text),ctx=`${rt.opts.stateKey}:dialogue:s${rt.opts.scene}:turn${rt.index}`;
  for(const id of ids)window.MEQPedagogy?.record(id,dimension,correct,score,{source:'dialogue',context:ctx,mode,helpLevel:rt.helpLevel||0,distractorId});
}
function meqDialogueMarkHelp(rt,t,level){
  rt.helpLevel=Math.max(rt.helpLevel||0,level);session.meqHelpLevel=rt.helpLevel;
  const text=t.targetPhrase||t.say||'';for(const id of meqDialogueUnitIds(text))window.MEQPedagogy?.recordHelp(id,level,'dialogue',`${rt.opts.stateKey}:dialogue:s${rt.opts.scene}:turn${rt.index}:help`);
  const e=meqEnsureEvidence(rt.opts.stateKey);e.helpUses=(e.helpUses||0)+1;saveState();
}
function meqDialogueStart(opts){
  const {stateKey,chapterLabel,scene,total,title,turns,onDone,help='Escuchá la intención. El texto aparece sólo si lo necesitás.'}=opts;
  session={...session,meqHelpLevel:0,meqDialogue:{index:0,helpLevel:0,history:[],corrections:[],spokenCorrections:0,summaryShown:false,opts:{stateKey,chapterLabel,scene,total,title,turns,onDone,help}}};
  meqDialogueRender();
}
function meqDialogueNoteCorrection(rt,text,{speakCorrection=false}={}){
  const clean=String(text||'').trim();
  if(clean && !rt.corrections.includes(clean))rt.corrections.push(clean);
  if(speakCorrection && rt.spokenCorrections<MEQ_CONVERSATION_POLICY.spokenCorrectionBudget){
    rt.spokenCorrections++;
    speak(clean,true);
    return true;
  }
  return false;
}
function meqDialogueFinish(rt,o){
  const done=o.onDone;
  const takeaway=(rt.corrections||[])[0]||null;
  if(takeaway && !rt.summaryShown){
    rt.summaryShown=true;
    state.pedagogy=state.pedagogy||{};
    state.pedagogy.lastConversationTakeaway={text:takeaway,at:Date.now(),stateKey:o.stateKey};
    saveState();
    screen.innerHTML=`<section class="card scene-card">${meqStoryHeader(o.chapterLabel,o.scene,o.total,o.title)}<span class="game-label">💬 Conversación terminada</span><h2>Una sola cosa para llevarte</h2><div class="help-box"><b>🎯 ${takeaway}</b><br><span>Podés volver a escucharla ahora; el resto de las correcciones queda para práctica, sin cortar la conversación.</span><div style="margin-top:10px"><button id="dialogueTakeawayAudio" class="btn secondary">🔊 Escuchar</button></div></div><button id="dialogueSummaryContinue" class="btn primary wide">Seguir →</button></section>`;
    $('dialogueTakeawayAudio').onclick=()=>speak(takeaway,true);
    $('dialogueSummaryContinue').onclick=()=>{session.meqDialogue=null;session.meqHelpLevel=0;done?.();};
    return;
  }
  session.meqDialogue=null;session.meqHelpLevel=0;done?.();
}
function meqDialogueHistoryHtml(rt){
  return rt.history.map(h=>`<div class="dialogue-bubble ${h.speaker==='player'?'player':'npc'}"><small>${meqSpeakerLabel(h.speaker)}</small><b>${h.text}</b></div>`).join('');
}
function meqDialogueAdvance(rt,t,text){
  rt.history.push({speaker:t.speaker==='player'?'player':t.speaker,text:text||t.say||t.targetPhrase||''});rt.index++;rt.helpLevel=0;session.meqHelpLevel=0;meqDialogueRender();
}
function meqDialogueRender(){
  const rt=session.meqDialogue,o=rt?.opts;if(!rt||!o)return;
  if(rt.index>=o.turns.length)return meqDialogueFinish(rt,o);
  const t=o.turns[rt.index];rt.helpLevel=rt.helpLevel||0;
  const spoken=t.kind==='voice'?(t.targetPhrase||t.say):t.say;
  const currentText=t.revealText===true?spoken:'•••';
  const choiceHtml=t.kind==='choice'?`<div class="runtime-choice-grid">${shuffle(t.choices).map(c=>`<button class="runtime-choice meq-dialogue-choice" data-id="${c.id}">${meqChoiceVisual(c)}${c.showLabel?`<b>${c.label||c.id}</b>`:''}</button>`).join('')}</div>`:'';
  const voiceHtml=t.kind==='voice'?`<button id="dialogueSpeak" class="btn primary wide">🎤 Decirlo</button><button id="dialogueGuided" class="btn secondary wide" style="margin-top:9px">Usar opción guiada</button>`:'';
  const responseHtml=t.kind==='response'?`<button id="dialogueRespond" class="btn primary wide">🎤 Responder sin texto</button><button id="dialogueResponseHelp" class="btn secondary wide" style="margin-top:9px">💡 Necesito una pista</button><div id="dialogueResponseModel" class="help-box hidden"></div>`:'';
  const listenHtml=t.kind==='listen'?`<button id="dialogueContinue" class="btn primary wide">Seguir →</button>`:'';
  screen.innerHTML=`<section class="card scene-card">${meqStoryHeader(o.chapterLabel,o.scene,o.total,o.title)}<span class="game-label">💬 Conversación · autonomía ${rt.helpLevel===0?'sin ayuda':`ayuda ${rt.helpLevel}/4`}</span><div class="dialogue-stage">${meqDialogueHistoryHtml(rt)}<div class="dialogue-bubble current ${t.speaker==='player'?'player':'npc'}"><small>${meqSpeakerLabel(t.speaker)}</small><b id="dialogueCurrentText">${currentText}</b></div></div><div class="dialogue-listen-row"><button id="dialogueAudio" class="sound-orb">🔊</button><button id="dialogueReveal" class="btn secondary">📖 Ver texto</button></div><div class="instruction">${t.prompt||'Escuchá primero.'}</div>${choiceHtml}${voiceHtml}${responseHtml}${listenHtml}<div id="dialogueFb" class="feedback"></div>${meqStoryHelp(o.help,t.translation||'',meqDialogueUnitIds(t.targetPhrase||t.say||'')[0]||'')}</section>`;
  setTimeout(()=>speak(spoken),220);$('dialogueAudio').onclick=()=>speak(spoken);
  $('dialogueReveal').onclick=()=>{meqDialogueMarkHelp(rt,t,2);$('dialogueCurrentText').textContent=spoken;$('dialogueReveal').disabled=true;};

  if(t.kind==='listen')$('dialogueContinue').onclick=()=>meqDialogueAdvance(rt,t,t.say);

  if(t.kind==='choice')document.querySelectorAll('.meq-dialogue-choice').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.id===t.target;meqRecordEvidence(o.stateKey,'listening',ok);meqRecordEvidence(o.stateKey,'usage',ok);
    if(window.MEQ_VOCAB_DATA?.[t.target]){
      const meta={source:'dialogue',context:`${o.stateKey}:dialogue:s${o.scene}:turn${rt.index}`,mode:'conversation_choice',helpLevel:rt.helpLevel||0,distractorId:ok?null:b.dataset.id};
      window.MEQPedagogy?.record(t.target,'listening',ok,1,meta);window.MEQPedagogy?.record(t.target,'usage',ok,1,meta);
    }
    document.querySelectorAll('.meq-dialogue-choice').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$('dialogueFb').className=`feedback ${ok?'good':'soft'}`;$('dialogueFb').textContent=ok?(t.success||'✨ La respuesta encaja con la conversación.'):(t.retry||'Todavía no. Escuchá otra vez.');
    if(ok){playSfx('success');setTimeout(()=>meqDialogueAdvance(rt,t,t.say),780)}else{playSfx('retry');meqDialogueNoteCorrection(rt,t.retry||t.say||t.targetPhrase||'Escuchá otra vez.',{speakCorrection:true})}
  });

  if(t.kind==='response'){
    const passResponse=(score,text,assisted=false)=>{
      const ok=score>=.64||assisted;meqRecordSpeech(o.stateKey,score);meqRecordEvidence(o.stateKey,'listening',ok);meqRecordEvidence(o.stateKey,'usage',ok);
      meqDialogueRecordUnits(t.targetPhrase,'usage',ok,rt,t,{score:1,mode:'spontaneous_response'});if(!assisted)meqDialogueRecordUnits(t.targetPhrase,'speaking',ok,rt,t,{score:Math.max(.25,score),mode:'spontaneous_speech'});
      meqDialogueAdvance(rt,{...t,speaker:'player'},text||t.targetPhrase);
    };
    $('dialogueResponseHelp').onclick=()=>{
      const next=Math.min(4,(rt.helpLevel||0)+1);meqDialogueMarkHelp(rt,t,next);const box=$('dialogueResponseModel');box.classList.remove('hidden');
      if(next===1)box.innerHTML='<b>👀 Pista 1:</b> Mirá la escena: ¿quién, dónde o qué cosa tenés que responder? Todavía no aparece la frase.';
      if(next===2){box.innerHTML='<b>🐢 Pista 2:</b> Escuchá la pregunta más lento. La respuesta sigue oculta.<div style="margin-top:8px"><button id="dialogueQuestionSlow" class="btn secondary">🔊 Pregunta lenta</button></div>';$('dialogueQuestionSlow').onclick=()=>speak(t.say,true);}
      if(next===3){box.innerHTML=`<b>✨ Pista 3:</b> Modelo: ${t.targetPhrase}<div style="margin-top:8px"><button id="dialogueResponseModelAudio" class="btn secondary">🔊 Escuchar modelo</button> <button id="dialogueResponseGuided" class="btn primary">Usar con ayuda →</button></div>`;$('dialogueResponseModelAudio').onclick=()=>speak(t.targetPhrase);$('dialogueResponseGuided').onclick=()=>passResponse(.55,t.targetPhrase,true);}
      if(next===4){box.innerHTML=`<b>🇦🇷 Rescate final:</b> ${t.translation||'La escena se explica brevemente en español.'}<br><b>Respuesta modelo:</b> ${t.targetPhrase}<div style="margin-top:8px"><button id="dialogueResponseGuided" class="btn primary">Continuar con ayuda →</button></div>`;$('dialogueResponseGuided').onclick=()=>passResponse(.50,t.targetPhrase,true);$('dialogueResponseHelp').disabled=true;}
    };
    $('dialogueRespond').onclick=()=>{
      if(!speechRecognitionSupported()){$('dialogueFb').className='feedback soft';$('dialogueFb').textContent='🎤 Este navegador no permite voz. Pedí pistas; en la tercera aparece un modelo para continuar.';return;}
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition,r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=5;$('dialogueFb').textContent='🎧 Escuchando tu respuesta…';
      r.onresult=e=>{const alts=[...e.results[0]].map(a=>a.transcript),res=scorePronunciationTranscript(t.targetPhrase,alts),ok=res.phrase>=.64;meqRecordSpeech(o.stateKey,res.phrase);meqRecordEvidence(o.stateKey,'listening',ok);meqRecordEvidence(o.stateKey,'usage',ok);meqDialogueRecordUnits(t.targetPhrase,'usage',ok,rt,t,{mode:'spontaneous_response'});meqDialogueRecordUnits(t.targetPhrase,'speaking',ok,rt,t,{score:Math.max(.25,res.phrase),mode:'spontaneous_speech'});storePronunciation(`dialogue-response:${normalize(t.targetPhrase)}`,res);$('dialogueFb').className=`feedback ${ok?'good':'soft'}`;$('dialogueFb').innerHTML=(ok?'🌟 Te entendí sin mostrarte la frase.':'Casi. Podés volver a intentar o pedir una pista.')+pronunciationHtml(res);if(ok)setTimeout(()=>meqDialogueAdvance(rt,{...t,speaker:'player'},t.targetPhrase),850);else meqDialogueNoteCorrection(rt,t.targetPhrase||t.say||'Probá otra vez.')} ;
      r.onerror=()=>{$('dialogueFb').className='feedback soft';$('dialogueFb').textContent='No te escuché bien. Probá otra vez o pedí una pista.';};r.start();
    };
  }

  if(t.kind==='voice'){
    $('dialogueGuided').onclick=()=>{meqDialogueMarkHelp(rt,t,3);meqRecordSpeech(o.stateKey,.55);meqDialogueRecordUnits(t.targetPhrase,'usage',true,rt,t,{mode:'guided_phrase'});meqDialogueAdvance(rt,{...t,speaker:'player'},t.targetPhrase);};
    $('dialogueSpeak').onclick=()=>{
      if(!speechRecognitionSupported()){$('dialogueFb').className='feedback soft';$('dialogueFb').textContent='🎤 Voz no disponible. Usá la opción guiada; contará como respuesta asistida, no como producción independiente.';return;}
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition,r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=5;$('dialogueFb').textContent='🎧 Escuchando…';
      r.onresult=e=>{const alts=[...e.results[0]].map(a=>a.transcript),res=scorePronunciationTranscript(t.targetPhrase,alts),ok=res.phrase>=.64;meqRecordSpeech(o.stateKey,res.phrase);meqDialogueRecordUnits(t.targetPhrase,'speaking',ok,rt,t,{score:Math.max(.25,res.phrase),mode:'guided_repetition'});storePronunciation(`dialogue:${normalize(t.targetPhrase)}`,res);$('dialogueFb').className=`feedback ${ok?'good':'soft'}`;$('dialogueFb').innerHTML=(ok?'🌟 Te entendí.':'Casi. Probemos más lento.')+pronunciationHtml(res);if(ok)setTimeout(()=>meqDialogueAdvance(rt,{...t,speaker:'player'},t.targetPhrase),850);else meqDialogueNoteCorrection(rt,t.targetPhrase,{speakCorrection:true})};
      r.onerror=()=>{$('dialogueFb').className='feedback soft';$('dialogueFb').textContent='No te escuché bien. Podés volver a intentar o usar la opción guiada.';};r.start();
    };
  }
}
window.MEQ_DIALOGUE_RUNTIME_VERSION='1.9.0';
