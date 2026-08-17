'use strict';
// MVP 1.9 — Pedagogical Engine v2.
// Tracks what the learner can do per word/chunk, how much help was required,
// whether knowledge transfers across contexts, common confusions, and delayed
// recall. Speaking remains useful evidence but is non-blocking while the web
// prototype relies on speech-to-text rather than acoustic phoneme scoring.
(function(){
  const dimensionFloor={visual:.65,listening:.70,usage:.60,speaking:.50};
  const confusionPairs=[
    ['i','you'],['my','your'],['this','here'],['here','there'],
    ['what','where'],['who','where'],['what','which'],
    ['in','on'],['on','under'],['in','under'],['next_to','between'],
    ['left','right'],['up','down'],['inside','outside'],
    ['big','small'],['morning','night'],['open','close'],
    ['want','need'],['eat','drink'],['see','hear'],['read','write'],['ask','answer'],
    ['mother','father'],['sister','brother'],['woman','man'],['girl','boy']
  ];
  const pairMap={};
  for(const [a,b] of confusionPairs){(pairMap[a]||=[]).push(b);(pairMap[b]||=[]).push(a);}

  function ensureState(){
    state.unitMastery ||= {};
    state.reviews ||= {};
    state.pedagogy ||= {microChecks:0,cleanChecks:0,assistedChecks:0};
    return state.unitMastery;
  }
  function blank(){return {
    visual:0,listening:0,usage:0,speaking:0,delayedRecall:0,
    attempts:{visual:0,listening:0,usage:0,speaking:0},
    cleanCorrect:{visual:0,listening:0,usage:0,speaking:0},
    assistedCorrect:{visual:0,listening:0,usage:0,speaking:0},
    contexts:{},modes:{},confusions:{},
    helpUses:0,helpMax:0,presentedAt:null,lastEvidenceAt:null,lastCorrectAt:null,sources:[]
  };}
  function migrateUnit(u){
    const b=blank();u={...b,...(u||{})};
    u.attempts={...b.attempts,...(u.attempts||{})};
    u.cleanCorrect={...b.cleanCorrect,...(u.cleanCorrect||{})};
    u.assistedCorrect={...b.assistedCorrect,...(u.assistedCorrect||{})};
    u.contexts={...(u.contexts||{})};u.modes={...(u.modes||{})};u.confusions={...(u.confusions||{})};
    u.sources=[...(u.sources||[])];return u;
  }
  function unit(id){const all=ensureState();all[id]=migrateUnit(all[id]);return all[id];}
  function present(id,source='story',context='exposure'){
    if(!id)return null;const u=unit(id);u.presentedAt ||= Date.now();u.lastEvidenceAt=Date.now();
    if(source&&!u.sources.includes(source))u.sources.push(source);u.contexts[context] ||= {correct:0,attempts:0,cleanCorrect:0};
    state.unitMastery[id]=u;saveState();return u;
  }
  function updateScore(old,correct,weight){
    const w=Math.max(.25,Math.min(2,Number(weight)||1));
    if(correct){if(old===0)return .80;return Math.min(1,old+(1-old)*(.55*Math.min(1,w)));}
    return Math.max(0,old*(.68**w));
  }
  function normalizeOptions(sourceOrOptions,maybeOptions){
    if(sourceOrOptions&&typeof sourceOrOptions==='object')return {source:'game',...sourceOrOptions};
    return {source:sourceOrOptions||'game',...(maybeOptions||{})};
  }
  function recordConfusion(id,distractorId){
    if(!id||!distractorId||id===distractorId)return;const u=unit(id);u.confusions[distractorId]=(u.confusions[distractorId]||0)+1;state.unitMastery[id]=u;saveState();
  }
  function record(id,dimension,correct,weight=1,sourceOrOptions='game',maybeOptions={}){
    if(!id||!['visual','listening','usage','speaking'].includes(dimension))return null;
    const o=normalizeOptions(sourceOrOptions,maybeOptions),helpLevel=Math.max(0,Number(o.helpLevel)||0);
    const context=o.context||`${o.source||'game'}:${dimension}`,mode=o.mode||dimension;
    const u=present(id,o.source||'game',context);u[dimension]=updateScore(Number(u[dimension])||0,!!correct,weight);
    u.attempts[dimension]=(u.attempts[dimension]||0)+1;u.lastEvidenceAt=Date.now();u.modes[mode]=(u.modes[mode]||0)+1;
    const cx=u.contexts[context] ||= {correct:0,attempts:0,cleanCorrect:0};cx.attempts++;
    if(correct){cx.correct++;u.lastCorrectAt=Date.now();if(helpLevel===0){u.cleanCorrect[dimension]=(u.cleanCorrect[dimension]||0)+1;cx.cleanCorrect++;state.pedagogy.cleanChecks=(state.pedagogy.cleanChecks||0)+1;}else{u.assistedCorrect[dimension]=(u.assistedCorrect[dimension]||0)+1;state.pedagogy.assistedChecks=(state.pedagogy.assistedChecks||0)+1;}}
    if(helpLevel>0){u.helpUses++;u.helpMax=Math.max(u.helpMax,helpLevel);}
    if(!correct&&o.distractorId)recordConfusion(id,o.distractorId);
    state.unitMastery[id]=u;saveState();maybeScheduleWhenLearned(id);return u;
  }
  function recordHelp(id,level=1,source='game',context='help'){
    if(!id)return;const u=present(id,source,context);u.helpUses++;u.helpMax=Math.max(u.helpMax,Math.max(1,Number(level)||1));state.helpUses=(state.helpUses||0)+1;state.unitMastery[id]=u;saveState();
  }
  function contextFamily(name){return String(name||'').replace(/:(?:use|visual|listen|listening|usage|speech|speaking)$/,'');}
  function contextCount(id){const u=unit(id),families=new Set();for(const [name,c] of Object.entries(u.contexts||{})){if((c.cleanCorrect||0)>0)families.add(contextFamily(name));}return families.size;}
  function cleanCorrectTotal(id){const u=unit(id);return Object.values(u.cleanCorrect||{}).reduce((a,b)=>a+(Number(b)||0),0);}
  function usageWasAssessed(u){return (u.attempts?.usage||0)>0;}
  function unitProfile(id){
    const category=window.MEQ_VOCAB_DATA?.[id]?.category||'other';
    const useFirst=new Set(['function','question','greeting','response','politeness','social','self','language','core_language','thinking','need','concept']);
    const visualFirst=new Set(['object','person','place','body','color','number','food','drink','nature','transport','direction','location','action','command','meal','weather','time','emotion','description','state','sense','quantity','comparison','demonstrative','people','control','feeling']);
    return {category,visualRequired:visualFirst.has(category),usageRequired:useFirst.has(category)};
  }
  function learned(id){
    const u=unit(id);if(!u.presentedAt)return false;const p=unitProfile(id);
    const listenOk=u.listening>=dimensionFloor.listening;
    const visualOk=!p.visualRequired||u.visual>=dimensionFloor.visual;
    const useOk=!p.usageRequired ? (!usageWasAssessed(u)||u.usage>=dimensionFloor.usage) : u.usage>=dimensionFloor.usage;
    return listenOk&&visualOk&&useOk&&cleanCorrectTotal(id)>=2&&contextCount(id)>=2;
  }
  function consolidated(id){
    if(!learned(id))return false;const r=state.reviews?.[id];
    return !!r && (r.box||0)>=2 && (r.correctStreak||0)>=2 && (unit(id).delayedRecall||0)>=.45;
  }
  function status(id){const u=unit(id);if(consolidated(id))return 'consolidated';if(learned(id))return 'learned';if(u.presentedAt)return 'presented';return 'unseen';}
  function stageReady(ids){if(!ids?.length)return true;return ids.every(id=>learned(id));}
  function dimensionDeficit(u,dim){const floor=dimensionFloor[dim]||.6;return Math.max(0,floor-(Number(u[dim])||0));}
  function weakness(id){
    const u=unit(id),p=unitProfile(id),dims=['visual','listening','usage'];let dim='listening',def=-1;
    for(const d of dims){if(d==='visual'&&!p.visualRequired)continue;if(d==='usage'&&!p.usageRequired&&!usageWasAssessed(u))continue;const x=dimensionDeficit(u,d);if(x>def){def=x;dim=d;}}
    const conf=Object.entries(u.confusions||{}).sort((a,b)=>b[1]-a[1])[0]?.[0]||null;
    return {unitId:id,dimension:dim,deficit:Math.max(0,def),helpUses:u.helpUses||0,contextCount:contextCount(id),confusedWith:conf,status:status(id)};
  }
  function repairPlan(ids,limit=3){
    return (ids||[]).map(weakness).filter(x=>x.status!=='consolidated').sort((a,b)=>(b.deficit-a.deficit)||(b.helpUses-a.helpUses)||(a.contextCount-b.contextCount)).slice(0,limit);
  }
  function profileSummary(){
    ensureState();const ids=Object.keys(state.unitMastery||{});const counts={unseen:0,presented:0,learned:0,consolidated:0};
    for(const id of ids)counts[status(id)]++;
    const weak=repairPlan(ids,5);return {...counts,totalTracked:ids.length,weak};
  }
  function interleave(targetIds,poolIds,count=6){
    const fresh=[...(targetIds||[])],old=(poolIds||Object.keys(state.unitMastery||{})).filter(id=>!fresh.includes(id)&&['learned','consolidated'].includes(status(id)));
    const targetCount=Math.max(1,Math.min(fresh.length,Math.round(count*.25))),knownCount=Math.max(0,count-targetCount);
    return [...shuffle(fresh).slice(0,targetCount),...shuffle(old).slice(0,knownCount)];
  }
  function confusionDistractors(id,poolIds=[]){
    const preferred=(pairMap[id]||[]).filter(x=>!poolIds.length||poolIds.includes(x));
    const historical=Object.entries(unit(id).confusions||{}).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).filter(x=>!preferred.includes(x));
    return [...preferred,...historical];
  }
  function scheduleReview(unitId,source='story',stageId=0,{force=false}={}){
    ensureState();if(!unitId||state.reviews[unitId]||(!force&&!learned(unitId)))return false;
    state.reviews[unitId]={unitId,stage:stageId,source,box:0,nextDueAt:Date.now()+86400000,lastReviewedAt:null,correctStreak:0,lapses:0};saveState();return true;
  }
  function maybeScheduleWhenLearned(id){if(learned(id))scheduleReview(id,'mastery',0);}
  function sceneFor(storyId,sceneNumber){const d=window.MEQ_STORY_DATA?.[storyId];return d?.scenes?.[Number(sceneNumber)-1]||null;}
  function scheduleSceneByNumber(storyId,sceneNumber){const s=sceneFor(storyId,sceneNumber);if(!s)return;for(const id of (s.new_units||[]))present(id,storyId,`${storyId}:${s.id}:exposure`);}
  function scheduleSceneById(sceneId){
    for(const [storyId,d] of Object.entries(window.MEQ_STORY_DATA||{})){const s=d.scenes?.find(x=>x.id===sceneId);if(!s)continue;for(const id of (s.new_units||[]))present(id,storyId,`${storyId}:${sceneId}:exposure`);return;}
  }
  function recordReviewOutcome(id,correct,box,dimension='listening',mode='delayed_recall'){
    const before=unit(id),recall=correct?Math.min(1,(before.delayedRecall||0)+.25):Math.max(0,(before.delayedRecall||0)-.20);
    const latest=record(id,dimension,correct,1,{source:'review',context:`review:box${box||0}:${mode}`,mode,helpLevel:0});latest.delayedRecall=recall;state.unitMastery[id]=latest;saveState();return status(id);
  }
  function microCheckSpec(ids,limit=3){state.pedagogy.microChecks=(state.pedagogy.microChecks||0)+1;saveState();return repairPlan(ids,limit);}
  const emoji={
    hello:'👋',goodbye:'👋',yes:'✅',no:'❌',please:'🙏',thank_you:'💜',look:'👀',listen:'👂',come:'🫴',go:'➡️',i:'🙋',you:'👉',my:'🏷️',your:'👉🏷️',name:'🏷️',what:'❓',is:'🔗',am:'🙋',this:'👇',here:'📍',there:'📍',friend:'🤝',help:'🫴',ready:'✅',good:'👍',book:'📘',key:'🔑',door:'🚪',window:'🪟',bag:'🎒',table:'🪵',chair:'🪑',water:'💧',food:'🍎',home:'🏠',open:'📖',close:'🔒',take:'🤲',give:'🎁',find:'🔎',stop:'🛑',wait:'⏳',sit:'🪑',stand:'🧍',school:'🏫',happy:'😊',one:'1️⃣',two:'2️⃣',three:'3️⃣',again:'🔁',owl:'🦉',letter:'✉️',magic:'✨',castle:'🏰',room:'🚪',teacher:'🧑‍🏫',student:'🧑‍🎓',where:'📍❓',who:'👤❓',can:'💪',want:'💭',like:'❤️',red:'🔴',blue:'🔵',green:'🟢',big:'🐘',small:'🐭',apple:'🍎',bread:'🍞',milk:'🥛',juice:'🧃',in:'📥',on:'⬆️',under:'⬇️',see:'👀',hear:'👂',paper:'📄',pen:'🖊️',pencil:'✏️',desk:'🪑',class:'🏫',read:'📖',write:'✍️',question:'❓',ask:'🗣️❓',answer:'💬',next_to:'↔️',tree:'🌳',flower:'🌸',sun:'☀️',moon:'🌙',star:'⭐',left:'⬅️',right:'➡️',up:'⬆️',down:'⬇️',between:'↔️',walk:'🚶',road:'🛣️',wind:'💨',shop:'🏪',need:'❗',have:'🤲',more:'➕',house:'🏠',bedroom:'🛏️',bathroom:'🚿',kitchen:'🍳',bed:'🛏️',light:'💡',wall:'🧱',floor:'⬜',inside:'📥',outside:'🌳',night:'🌙',morning:'🌅',sleep:'😴',wake:'⏰',wash:'🧼',breakfast:'🥣',hungry:'🍽️',eat:'🍴',drink:'🥤',wear:'👕',carry:'🎒',head:'🙂',eye:'👁️',ear:'👂',mouth:'👄',arm:'💪',hand:'✋',leg:'🦵',foot:'🦶',hair:'💇',has:'✨',family:'👨‍👩‍👧‍👦',mother:'👩',father:'👨',sister:'👧',brother:'👦',woman:'👩',man:'👨',girl:'👧',boy:'👦',baby:'👶',people:'👥',old:'👴',map:'🗺️',place:'📍',city:'🏙️',street:'🛣️',park:'🌳',station:'🚉',car:'🚗',bus:'🚌',train:'🚆',over:'⬆️',same:'🟰',which:'❓'
  };

  function reviewUnit(id){
    const v=window.MEQ_VOCAB_DATA?.[id];if(!v)return null;
    return {id,en:v.english||id.replaceAll('_',' '),es:v.help_es_AR||'',visual:emoji[id]||'✨',category:v.category||'other'};
  }
  function reviewPool(target){
    const targetId=target?.id||target?.unitId||null,reviewIds=Object.keys(state.reviews||{}),learnedIds=Object.keys(state.unitMastery||{}).filter(id=>['learned','consolidated'].includes(status(id))),base=[...new Set([...reviewIds,...learnedIds])];
    const mixed=targetId?interleave([targetId],base.filter(id=>id!==targetId),8):shuffle(base).slice(0,8);let known=mixed.map(reviewUnit).filter(Boolean);
    if(targetId&&!known.some(x=>x.id===targetId)){const t=reviewUnit(targetId);if(t)known.unshift(t)}
    if(known.length>=4)return known;const fallback=Object.keys(window.MEQ_VOCAB_DATA||{}).map(reviewUnit).filter(Boolean).filter(x=>!known.some(k=>k.id===x.id));return [...known,...shuffle(fallback).slice(0,6-known.length)];
  }
  window.MEQPedagogy={
    record,present,recordHelp,recordConfusion,recordReviewOutcome,unit,status,learned,consolidated,
    stageReady,scheduleReview,scheduleSceneByNumber,scheduleSceneById,reviewUnit,reviewPool,
    profileSummary,weakness,repairPlan,interleave,confusionDistractors,microCheckSpec,
    dimensionFloor,confusionPairs,contextCount,cleanCorrectTotal,unitProfile,version:'1.9.0'
  };
})();
