const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => n == null ? '—' : Math.round(n).toLocaleString('en-US');
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const state = { catalog: [], people: {}, map: null, election: null, town: '', village: '', candidate: null, mode: 'area', view: '3d', playing: false, timer: null, request: 0, zoom: 1 };
const cache = new Map();
const numberTweens = new WeakMap();
const townOrder = ['金城鎮','金寧鄉','金湖鎮','金沙鎮','烈嶼鄉','烏坵鄉'];
const typeOrder = ['總統副總統','區域立委','不分區立委','縣長','縣議員','鄉鎮長','鄉鎮民代表','村里長','國大代表','全國性公投','地方性公投'];
const typeNames = {'區域立委':'立法委員・區域','不分區立委':'立法委員・不分區'};
const baseView = {x:0,y:35,w:1000,h:620};
let camera = {...baseView};
let timelineEntries = [];
let insetBounds = [0,0,1,1];

function animate(target, props) {
  if (window.gsap) return gsap.to(target, {...props, duration: reduceMotion.matches ? 0 : (props.duration ?? .5), overwrite: 'auto'});
  if (props.onUpdate) props.onUpdate();
  if (props.onComplete) props.onComplete();
}
async function json(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`無法讀取 ${path}（${r.status}）`);
  return r.json();
}
async function getElection(id) {
  if (!cache.has(id)) cache.set(id, json(`data/${encodeURIComponent(id)}.json`).catch(error => {cache.delete(id);throw error;}));
  return cache.get(id);
}
function color(c, index = 0) {
  const palette = {'中國國民黨':'#5498ff','民主進步黨':'#53c999','台灣民眾黨':'#53d5df','親民黨':'#ffad62','新黨':'#f1cf65','台灣團結聯盟':'#cd8b5f'};
  return palette[c.party] || ['#af98ee','#ec9bb5','#e7bb6b','#8ecbd2','#9baddc','#cf9e76'][index % 6];
}
function resultFor(town = state.town, village = state.village) {
  if (!state.election) return null;
  if (!town) return state.election.county;
  const t = state.election.towns[town];
  return village ? t?.villages[village] : t;
}
function turnout(r) {return r?.eligible > 0 && r?.valid != null && r?.invalid != null ? (r.valid+r.invalid)/r.eligible*100 : null;}
function ranked(r) {
  return state.election.candidates.map((c,i) => ({...c,i,votes:r?.votes[i] ?? null})).sort((a,b) => (b.votes??0)-(a.votes??0) || Number(a.number)-Number(b.number));
}
function percent(v, total) {return total > 0 && v != null ? `${(v/total*100).toFixed(2)}%` : '—';}
function animateNumber(el, value, suffix = '') {
  numberTweens.get(el)?.kill();
  if (value == null || state.election.pending) {el.textContent='—'; el.dataset.number='0';return;}
  const counter = {n:Number(el.dataset.number || 0)};
  if(!window.gsap){el.textContent=suffix?`${value.toFixed(2)}${suffix}`:fmt(value);el.dataset.number=String(value);return;}
  numberTweens.set(el,animate(counter, {n:value,duration:.65,ease:'power2.out',onUpdate:()=>{el.textContent = suffix ? `${counter.n.toFixed(2)}${suffix}` : fmt(counter.n);}}));
  el.dataset.number=String(value);
}

function updateSelectors() {
  const e = state.election;
  $('#type-select').value=e.type;
  const entries = state.catalog.filter(x=>x.type===e.type);
  const years = [...new Set(entries.map(x=>x.year))].sort((a,b)=>b-a);
  $('#year-select').innerHTML=years.map(y=>`<option value="${y}">${y}</option>`).join('');
  $('#year-select').value=e.year;
  const races = entries.filter(x=>x.year===e.year);
  $('#race-field').hidden = races.length < 2;
  $('#race-select').innerHTML=races.map(x=>`<option value="${esc(x.id)}">${esc(x.title.replace(/^\d+年\s*/,''))}</option>`).join('');
  $('#race-select').value=e.id;
}

async function loadElection(id, {playback = false, initial = false} = {}) {
  if (!playback) stopPlayback();
  const request = ++state.request;
  $('#error-banner').hidden=true;
  $('#result-panel').setAttribute('aria-busy','true');
  try {
    const previous = state.election;
    const election = await getElection(id);
    if (request !== state.request) return;
    state.election=election;
    if (state.candidate && !election.candidates.some(c=>c.name===state.candidate)) state.candidate=null;
    updateSelectors();
    $('#election-subtitle').textContent = election.title;
    $('#map-watermark').textContent=election.year;
    $('#year-badge').textContent=election.year;
    $('#map-watermark').classList.remove('year-flash');
    requestAnimationFrame(()=>$('#map-watermark').classList.add('year-flash'));
    renderResults(); renderRegions(); renderMap(initial); renderTimeline();
    const url = new URL(location.href);
    url.searchParams.set('election', id);
    state.town ? url.searchParams.set('town',state.town) : url.searchParams.delete('town');
    state.village ? url.searchParams.set('village',state.village) : url.searchParams.delete('village');
    history.replaceState(null,'',url);
    document.title=`${election.title}｜金門政治山 LAB`;
    $('#announcement').textContent=`${election.title}，${state.village||state.town||'全縣'}結果已更新。`;
    if (previous?.series !== election.series || initial) resetCamera(false);
    if (playback && state.playing) schedulePlayback();
  } catch (error) {
    if (request !== state.request) return;
    stopPlayback();
    $('#error-banner').textContent=`${error.message}。請重新選擇場次或重新整理。`;
    $('#error-banner').hidden=false;
  } finally {if(request===state.request) $('#result-panel').removeAttribute('aria-busy');}
}

function renderResults() {
  const e = state.election, r = resultFor(), list = ranked(r);
  const scope = state.village||state.town;
  $('#result-title').textContent=scope || (e.towns && Object.keys(e.towns).length===1 ? '選區結果' : '全縣結果');
  $('#result-kicker').textContent=scope ? 'A CLOSER LOOK' : 'ELECTION RESULTS';
  $('#result-description').textContent=e.title.replace(/^\d+年\s*/,'') + (e.date ? ` · ${e.date}` : '');
  const missing = !r;
  const notice = $('#pending-notice');
  notice.hidden = !e.pending && !missing;
  notice.textContent = e.pending ? '尚未開票・名單依現有資料顯示，預留的零值不代表選舉結果。' : `這場選舉沒有${state.village ? '此村里' : '此鄉鎮'}的獨立資料。請返回上一層查看。`;
  animateNumber($('#valid-count'),r?.valid);
  animateNumber($('#turnout-count'),turnout(r),'%');
  animateNumber($('#margin-count'),r && list.length>1 ? list[0].votes-list[1].votes : null);
  $('#ranking-title').textContent = state.candidate ? `${state.candidate}・已選取` : '候選人得票';
  $('#candidate-list').innerHTML=missing ? '<div class="empty-state">保留目前地區，方便繼續切換年份。<br>沒有資料的區域不會顯示為零票。</div>' : list.map((c,rank)=>{
    const p = state.people[c.name], photo = p?.photo;
    const col = color(c,c.i);
    return `<button class="candidate-row ${state.candidate===c.name?'selected':''}" data-candidate="${esc(c.name)}" aria-pressed="${state.candidate===c.name}" aria-label="查看${esc(c.name)}得票分布" style="--candidate-color:${col}">
      <div class="candidate-top"><span class="rank-number">${e.pending?'—':String(rank+1).padStart(2,'0')}</span>
      ${photo?`<img class="candidate-avatar" src="../candidates/${encodeURIComponent(photo)}" alt="${esc(c.name)}" loading="lazy">`:`<span class="candidate-avatar candidate-initial" aria-hidden="true">${esc(c.name.charAt(0))}</span>`}
      <div class="candidate-identity"><div class="candidate-name">${esc(c.name)}${c.elected&&!e.pending?'<span class="elected-mark" title="依原始資料標記當選，不代表此地區最高票">當選</span>':''}</div><div class="candidate-party">${esc(c.party)}${c.partner?` · ${esc(c.partner)}`:''}</div></div>
      <div class="candidate-tally"><strong>${e.pending?'—':fmt(c.votes)}</strong><small>${e.pending?'待開票':percent(c.votes,r?.valid)}</small></div></div>
      <div class="candidate-track"><div class="candidate-bar" data-pct="${!e.pending&&r?.valid?c.votes/r.valid*100:0}"></div></div></button>`;
  }).join('');
  $$('.candidate-avatar[src]').forEach(img=>img.addEventListener('error',()=>{
    const fallback=document.createElement('span');fallback.className='candidate-avatar candidate-initial';fallback.textContent=img.alt[0];img.replaceWith(fallback);
  },{once:true}));
  $$('.candidate-bar').forEach((el,i)=>animate(el,{width:`${el.dataset.pct}%`,duration:.75,delay:reduceMotion.matches?0:i*.045,ease:'power3.out'}));
  $('#detail-button').disabled=missing;
  $('#detail-button span').textContent=state.village?'查看村里與投開票所明細':'查看完整票數';
}

function renderRegions() {
  $('#scope-path').innerHTML=state.town?`<span>›</span><button data-town="${esc(state.town)}">${esc(state.town)}</button>${state.village?`<span>›</span><span>${esc(state.village)}</span>`:''}`:'';
  let regions;
  if(state.town){
    regions=state.map.villages.filter(x=>x.town===state.town).map(x=>({name:x.village,town:x.town,village:x.village}));
    // Some historical village names are not present in current geometry; keep their data accessible.
    Object.keys(state.election.towns[state.town]?.villages||{}).forEach(v=>{if(!regions.some(x=>x.name===v))regions.push({name:v,town:state.town,village:v});});
  }else regions=townOrder.map(t=>({name:t,town:t,village:''}));
  $('#region-picker').innerHTML=(state.town?'<button class="region-chip" data-town="" data-village="">← 返回全縣</button>':'')+regions.map(r=>`<button class="region-chip ${state.village===r.village&&state.town===r.town?'active':''}" data-town="${esc(r.town)}" data-village="${esc(r.village)}">${esc(r.name)}</button>`).join('');
  $('#map-hint').innerHTML=state.town?`<span class="spark">✳</span> ${esc(state.village||state.town)}，每一票都有故事 ${icon('arrow')}`:`<span class="spark">✳</span> 點選一個鄉鎮，往村里探索 ${icon('arrow')}`;
}

function selectRegion(town='',village='') {
  stopPlayback();
  const oldTown=state.town;
  state.town=town;state.village=village;state.zoom=1;
  renderResults();renderRegions();renderMap();
  if(oldTown!==town) resetCamera(true);
  const url=new URL(location.href);
  town?url.searchParams.set('town',town):url.searchParams.delete('town');
  village?url.searchParams.set('village',village):url.searchParams.delete('village');
  history.replaceState(null,'',url);
  $('#announcement').textContent=`已選取${village||town||'全縣'}。`;
}

function point(p,inset=false) {
  if(inset) {
    const [x0,y0,x1,y1]=insetBounds, scale=Math.min(126/(x1-x0),75/(y1-y0));
    return [145+(p[0]-(x0+x1)/2)*scale,565+(p[1]-(y0+y1)/2)*scale];
  }
  const x=(p[0]+95)*.94+20;
  const y=state.view==='3d' ? p[1]*.91-(p[0]-460)*.14+52 : p[1]+10;
  return [x,y];
}
function topPath(f) {
  return f.polygons.flatMap(poly=>poly.map(ring=>ring.map((p,i)=>{const [x,y]=point(p,f.inset);return `${i?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`;}).join('')+'Z')).join('');
}
function sidePath(f,depth) {
  return f.polygons.flatMap(poly=>poly.map(ring=>ring.slice(0,-1).map((p,i)=>{
    const a=point(p,f.inset),b=point(ring[i+1],f.inset);
    return `M${a[0]},${a[1]}L${b[0]},${b[1]}L${b[0]},${b[1]+depth}L${a[0]},${a[1]+depth}Z`;
  }).join(''))).join('');
}
function featureFill(f) {
  const selected = state.town===f.town && (!state.village||state.village===f.village);
  if(state.mode==='area') return selected?'url(#select-gradient)':'url(#land-gradient)';
  const r=resultFor(f.town,f.village);
  if(!r || state.election.pending || r.valid==null) return '#354159';
  if(state.mode==='turnout'){
    const t=turnout(r);return t==null?'#354159':mix('#26334b','#a0f4ce',Math.min(t/100,1));
  }
  if(state.candidate){
    const i=state.election.candidates.findIndex(c=>c.name===state.candidate);
    return r.valid>0&&i>=0?mix('#26334b',color(state.election.candidates[i],i),r.votes[i]/r.valid):'#354159';
  }
  const order=ranked(r);
  if(!order[0]?.votes || order[0]?.votes===order[1]?.votes) return '#64718e';
  return color(order[0],order[0].i);
}
function mix(a,b,n){const rgb=h=>h.match(/[\da-f]{2}/gi).map(x=>parseInt(x,16));const x=rgb(a),y=rgb(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*n).toString(16).padStart(2,'0')).join('');}

function renderMap(entrance=false) {
  const land=$('#map-land'), labels=$('#map-labels');
  const oldFills=new Map($$('.map-region').map(g=>[g.dataset.town+'/'+g.dataset.village,$('.land-top',g)?.getAttribute('fill')]));
  let features=[];
  for(const t of state.map.towns){
    if(state.town===t.town) features.push(...state.map.villages.filter(v=>v.town===t.town));
    else features.push(t);
  }
  features.sort((a,b)=>point(a.label,a.inset)[1]-point(b.label,b.inset)[1]);
  const selected=features.filter(f=>state.town===f.town);
  features=[...features.filter(f=>state.town!==f.town),...selected];
  const depth=state.view==='3d'?17:0;
  land.innerHTML=features.map((f,i)=>{
    const d=topPath(f),active=state.town===f.town&&(!state.village||state.village===f.village),other=state.town&&state.town!==f.town;
    const lift=state.view==='3d'&&active?(state.village?29:18):0;
    const interior=!f.village?state.map.villages.filter(v=>v.town===f.town).map(v=>`<path class="village-line" d="${topPath(v)}"/>`).join(''):'';
    const [lx,ly]=point(f.label,f.inset);
    const label=f.village?f.village:f.town;
    // Dense old-town villages need leader labels instead of overlapping names.
    const labelOffsets=f.town==='金城鎮'?{'西門里':[-48,-18],'北門里':[49,-29],'南門里':[-47,0],'東門里':[48,-1]}:{};
    const offset=labelOffsets[f.village],tx=lx+(offset?.[0]||0),ty=ly+(offset?.[1]||0);
    const leader=offset?`<path d="M${lx},${ly}L${tx},${ty}" stroke="#c9eea8" stroke-width=".8" fill="none" pointer-events="none"/><circle cx="${lx}" cy="${ly}" r="1.8" fill="#c9eea8" pointer-events="none"/>`:'';
    return `${active&&depth?`<path class="map-footprint" d="${d}" transform="translate(0,12)"/>`:''}<g class="map-region ${other?'is-other':''}" role="button" tabindex="0" aria-label="${esc(f.town+(f.village?'・'+f.village:''))}" aria-pressed="${active}" data-index="${i}" data-town="${esc(f.town)}" data-village="${esc(f.village)}" data-lift="${lift}" transform="translate(0,${-lift})" style="filter:url(#map-shadow)">
      ${depth?`<path class="land-side" d="${sidePath(f,depth)}" style="fill:${active&&state.mode==='area'?'#628e30':'#3c50a0'}"/>`:''}
      <path class="land-top" d="${d}" fill="${featureFill(f)}" fill-rule="evenodd"/>${interior}
      ${leader}<text class="map-label ${f.village?'village-label':''} ${active&&state.mode==='area'&&!offset?'selected':''}" x="${tx}" y="${ty}">${esc(label)}</text></g>`;
  }).join('');
  labels.innerHTML='';
  $('#map-base').innerHTML='<rect x="58" y="510" width="178" height="115" rx="10" fill="#111c2b66" stroke="#7f95c544" stroke-dasharray="5 5"/>';
  $$('.map-region').forEach(g=>{
    const top=$('.land-top',g),next=top.getAttribute('fill'),old=oldFills.get(g.dataset.town+'/'+g.dataset.village);
    if(window.gsap && old?.startsWith('#') && next.startsWith('#') && old!==next){top.setAttribute('fill',old);animate(top,{attr:{fill:next},duration:.7,ease:'power2.inOut'});}
    g.addEventListener('click',()=>selectRegion(g.dataset.town,g.dataset.village));
    g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();selectRegion(g.dataset.town,g.dataset.village);}});
    g.addEventListener('pointerenter',ev=>{
      if(state.view==='3d')animate(g,{y:-Number(g.dataset.lift)-8,duration:.25,ease:'power2.out'});
      showTooltip(g,ev);
    });
    g.addEventListener('pointermove',ev=>positionTooltip(ev));
    g.addEventListener('pointerleave',()=>{
      if(state.view==='3d')animate(g,{y:-Number(g.dataset.lift),duration:.45,ease:'back.out(1.5)'});
      $('#map-tooltip').hidden=true;
    });
  });
  if(entrance&&window.gsap&&!reduceMotion.matches)gsap.from('.map-region',{opacity:0,y:'+=28',duration:.9,stagger:.065,ease:'power3.out'});
  updateLegend();
}
function showTooltip(g,ev) {
  const r=resultFor(g.dataset.town,g.dataset.village),lead=r?ranked(r)[0]:null;
  let subtitle=state.election.pending?'尚未開票':!r?'這場選舉沒有此地區資料':`${fmt(r.valid)} 有效票`;
  if(state.mode==='votes'&&lead&&r&&!state.election.pending)subtitle+=` · ${state.candidate||lead.name}`;
  $('#map-tooltip').innerHTML=`<strong>${esc(g.dataset.village||g.dataset.town)}</strong><span>${esc(subtitle)}</span>`;
  $('#map-tooltip').hidden=false;positionTooltip(ev);
}
function positionTooltip(ev){const box=$('#map-stage').getBoundingClientRect();const tip=$('#map-tooltip');tip.style.left=Math.max(5,Math.min(ev.clientX-box.left+14,box.width-tip.offsetWidth-10))+'px';tip.style.top=Math.max(45,ev.clientY-box.top-tip.offsetHeight-12)+'px';}
function updateLegend(){
  const el=$('#map-legend');
  if(state.mode==='area')el.textContent='凸起代表選取區域';
  else if(state.mode==='turnout')el.innerHTML='0% <span class="legend-gradient"></span> 100%';
  else if(state.candidate)el.innerHTML=`${esc(state.candidate)} · 得票率深淺`;
  else el.textContent='各區最高票者・灰色為同票或無資料';
  $$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===state.mode));
}

function desiredCamera(){
  if(!state.town)return {...baseView};
  const f=state.map.towns.find(x=>x.town===state.town);
  if(!f)return {...baseView};
  // Focus on the largest island polygon, preserving offshore islands in the county overview.
  const poly=f.polygons.reduce((a,b)=>b[0].length>a[0].length?b:a);
  const pts=poly[0].map(p=>point(p,f.inset)),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
  let w=Math.max(300,Math.max(...xs)-Math.min(...xs)+130),h=Math.max(210,Math.max(...ys)-Math.min(...ys)+130);
  w=Math.max(w,h*1000/620);h=w*620/1000;
  return {x:(Math.min(...xs)+Math.max(...xs)-w)/2,y:(Math.min(...ys)+Math.max(...ys)-h)/2-15,w,h};
}
function setCamera(target,animated=true){
  animate(camera,{...target,duration:animated?.7:0,ease:'power3.inOut',onUpdate:()=>$('#election-map').setAttribute('viewBox',`${camera.x} ${camera.y} ${camera.w} ${camera.h}`)});
  if(!window.gsap){Object.assign(camera,target);$('#election-map').setAttribute('viewBox',`${camera.x} ${camera.y} ${camera.w} ${camera.h}`);}
  $('.map-inset-label').hidden=!!state.town;
}
function resetCamera(animated=true){state.zoom=1;setCamera(desiredCamera(),animated);}
function zoomMap(factor){
  const next=Math.max(.7,Math.min(3,state.zoom*factor));if(next===state.zoom)return;
  state.zoom=next;const b=desiredCamera(),w=b.w/next,h=b.h/next;
  setCamera({x:b.x+(b.w-w)/2,y:b.y+(b.h-h)/2,w,h});
}

function renderTimeline(){
  const e=state.election;
  timelineEntries=state.catalog.filter(x=>x.series===e.series&&x.type===e.type).sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
  // Keep one control per actual election, including same-year by-elections.
  const index=timelineEntries.findIndex(x=>x.id===e.id);
  $('#timeline-years').innerHTML=timelineEntries.map((x,i)=>`<button class="timeline-year ${x.pending?'pending':''}" data-index="${i}" title="${esc(x.title)}${x.pending?'・尚未開票':''}" aria-label="${esc(x.title)}" aria-pressed="${x.id===e.id}">${x.year}</button>`).join('');
  $('#timeline-range').max=Math.max(0,timelineEntries.length-1);$('#timeline-range').value=index;
  $('#timeline-range').disabled=timelineEntries.length<2;
  $('#timeline-range').setAttribute('aria-valuetext',`${e.year}年，${e.title}`);
  const activeYear=$('#timeline-years [aria-pressed=true]');
  if(activeYear) $('#timeline-years').scrollLeft=Math.max(0,activeYear.offsetLeft-$('#timeline-years').clientWidth/2);
  animate($('#timeline-progress'),{width:`${timelineEntries.length>1?index/(timelineEntries.length-1)*100:0}%`,duration:.45});
  $('#play-button').disabled=timelineEntries.filter(x=>!x.pending).length<2;
  $('#replay-status').textContent=state.playing?`${e.year} · 歷屆結果回放中`:`${timelineEntries[0]?.year} — ${timelineEntries.at(-1)?.year} · 拖曳年份，或按播放`;
}
function stopPlayback(){
  clearTimeout(state.timer);state.playing=false;
  $('#play-button').innerHTML=icon('play');$('#play-button').setAttribute('aria-label','播放歷屆選舉');$('#play-button').setAttribute('aria-pressed','false');
  if(state.election)$('#replay-status').textContent=`${state.election.year} · 回放已暫停，可自由探索`;
}
function schedulePlayback(){
  clearTimeout(state.timer);
  const index=timelineEntries.findIndex(x=>x.id===state.election.id);
  const next=timelineEntries.slice(index+1).find(x=>!x.pending);
  if(!next){stopPlayback();$('#replay-status').textContent='已抵達最新結果・再按播放從頭探索';return;}
  state.timer=setTimeout(()=>{if(state.playing)loadElection(next.id,{playback:true});},Number($('#speed-select').value));
}
async function play(){
  if(state.playing){stopPlayback();return;}
  if(state.mode==='area'){state.mode='votes';state.candidate=null;renderMap();}
  state.playing=true;$('#play-button').innerHTML=icon('pause');$('#play-button').setAttribute('aria-label','暫停歷屆選舉');$('#play-button').setAttribute('aria-pressed','true');
  const complete=timelineEntries.filter(x=>!x.pending);
  if(state.election.id===complete.at(-1)?.id||state.election.pending)await loadElection(complete[0].id,{playback:true});
  else{ $('#replay-status').textContent=`${state.election.year} · 歷屆結果回放中`;schedulePlayback();}
}

function openDialog(title,html){stopPlayback();$('#dialog-title').textContent=title;$('#dialog-body').innerHTML=html;$('#detail-dialog').showModal();}
function showDetails(){
  const e=state.election,r=resultFor();if(!r)return;
  const list=ranked(r),p=e.pending;
  const candidateTable=`<div class="table-wrap"><table><thead><tr><th>候選人／政黨</th><th>得票數</th><th>得票率</th><th>當選標記</th></tr></thead><tbody>${list.map(c=>`<tr><td>${esc(c.name)}<small>${esc(c.party)}</small></td><td>${p?'—':fmt(c.votes)}</td><td>${p?'—':percent(c.votes,r.valid)}</td><td>${p?'待開票':c.elected?'當選':'—'}</td></tr>`).join('')}</tbody></table></div>`;
  let areas=[];
  if(!state.town)areas=Object.entries(e.towns).map(([name,x])=>({name,...x}));
  else if(!state.village)areas=Object.entries(e.towns[state.town]?.villages||{}).map(([name,x])=>({name,...x}));
  else areas=(r.stations||[]).map(x=>({name:`${x.station} ${x.location}`,...x}));
  const areaTable=areas.length?`<h3>${state.village?'投開票所':state.town?'各村里':'各鄉鎮'}明細</h3><div class="table-wrap"><table><thead><tr><th>地區</th>${e.candidates.map(c=>`<th>${esc(c.name)}</th>`).join('')}<th>有效票</th><th>無效票</th><th>選舉人數</th><th>投票率</th></tr></thead><tbody>${areas.map(a=>`<tr><td>${esc(a.name)}</td>${a.votes.map(v=>`<td>${p?'—':fmt(v)}</td>`).join('')}<td>${p?'—':fmt(a.valid)}</td><td>${p?'—':fmt(a.invalid)}</td><td>${fmt(a.eligible)}</td><td>${!p&&turnout(a)!=null?turnout(a).toFixed(2)+'%':'—'}</td></tr>`).join('')}</tbody></table></div>`:`<p class="table-caption">這份原始資料沒有更細層級的獨立明細。</p>`;
  openDialog(`${state.village||state.town||'全縣'}・${e.year} 年票數`, `<div class="dialog-toolbar"><span>${esc(e.title)}</span><a class="download-link" href="../${encodeURI(e.source)}" download>下載原始 CSV ${icon('arrow')}</a></div>${candidateTable}${areaTable}<p class="table-caption">得票率＝候選人票數 ÷ 有效票。投票率＝（有效票＋無效票）÷ 選舉人數。當選標記沿用原始資料；多席次選舉的區域最高票不等於當選名單。</p>`);
}
function showAbout(){openDialog('一座島的選舉資料，換個方式探索。',`<div class="dialog-copy"><p>這是「金門政治山」的獨立互動試作。選取鄉鎮、深入村里，或拖動時間軸，觀看同類選舉的歷屆結果。點選候選人可查看得票率分布。</p><h3>資料與範圍</h3><p>本版由既有 CSV 建立 ${state.catalog.length} 場選舉的唯讀快照，候選人照片直接引用原網站。2026 年未開票場次顯示「尚未開票」，不將預留的零值當成結果。原目錄列出的 37 場 2026 村里長選舉沒有對應 CSV，本版未列入。</p><p>較早年度可能只有鄉鎮資料，缺少村里或投開票所明細時不做推估。歷屆回放只播放同一系列中已有結果的場次；播放結束會自動暫停。</p><h3>陸地輪廓與行政區界</h3><p>行政區來源：<a href="https://maps.nlsc.gov.tw/pro/download.jsp" target="_blank" rel="noopener">內政部國土測繪中心村里界</a>，依<a href="https://data.gov.tw/license" target="_blank" rel="noopener">政府資料開放授權條款</a>使用。海岸線：<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors / ODbL</a>。兩者相交裁切後產出六鄉鎮、三十七村里的陸地顯示圖。烏坵以獨立比例附圖呈現。</p><p>本圖使用目前行政界作為地名導覽，<strong>不表示歷年選區界線</strong>。歷年資料依鄉鎮與村里名稱對應；凸起高度只代表選取狀態，不代表地形或票數。地圖有適度簡化，非測量用途。</p><h3>互動與動態</h3><p>SVG 向量立體圖搭配 GSAP ${window.gsap?.version||''} 動畫。可切換平面視角，並支援鍵盤及系統「減少動態效果」。照片缺漏時使用姓名字首。</p><p>既有資料來源註記：中選會選舉及公投資料庫、政大選研中心資料庫。<a href="../index.html" target="_blank" rel="noopener">開啟經典版 ↗</a></p></div>`);}

function bindEvents(){
  $('#type-select').addEventListener('change',()=>{
    const options=state.catalog.filter(x=>x.type===$('#type-select').value),same=options.find(x=>x.year===state.election.year&&!x.pending);
    const target=same||options.filter(x=>!x.pending).sort((a,b)=>b.year-a.year)[0]||options[0];
    state.town='';state.village='';state.candidate=null;loadElection(target.id);
  });
  $('#year-select').addEventListener('change',()=>{
    const opts=state.catalog.filter(x=>x.type===state.election.type&&x.year===Number($('#year-select').value));
    loadElection((opts.find(x=>x.series===state.election.series)||opts[0]).id);
  });
  $('#race-select').addEventListener('change',()=>{state.town='';state.village='';loadElection($('#race-select').value);});
  $('#candidate-list').addEventListener('click',ev=>{const b=ev.target.closest('[data-candidate]');if(!b)return;state.candidate=state.candidate===b.dataset.candidate?null:b.dataset.candidate;state.mode='votes';renderResults();renderMap();});
  $('#region-picker').addEventListener('click',ev=>{const b=ev.target.closest('[data-town]');if(b)selectRegion(b.dataset.town,b.dataset.village||'');});
  $('#scope-path').addEventListener('click',ev=>{const b=ev.target.closest('[data-town]');if(b)selectRegion(b.dataset.town);});
  $('#county-button').addEventListener('click',()=>selectRegion());
  $$('[data-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;$$('[data-view]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderMap();resetCamera();}));
  $$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;if(state.mode!=='votes')state.candidate=null;renderResults();renderMap();}));
  $('#zoom-in').addEventListener('click',()=>zoomMap(1.25));$('#zoom-out').addEventListener('click',()=>zoomMap(.8));$('#reset-map').addEventListener('click',()=>resetCamera());
  $('#timeline-years').addEventListener('click',ev=>{const b=ev.target.closest('[data-index]');if(b)loadElection(timelineEntries[Number(b.dataset.index)].id);});
  $('#timeline-range').addEventListener('input',()=>{const entry=timelineEntries[Number($('#timeline-range').value)];if(entry)loadElection(entry.id);});
  $('#play-button').addEventListener('click',play);$('#speed-select').addEventListener('change',()=>{if(state.playing)schedulePlayback();});
  $('#replay-link').addEventListener('click',()=>{setTimeout(()=>$('#play-button').focus({preventScroll:true}),250);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback();});
  $('#detail-button').addEventListener('click',showDetails);$('#about-button').addEventListener('click',showAbout);$('#source-button').addEventListener('click',showAbout);
  $('[data-close]').addEventListener('click',()=>$('#detail-dialog').close());
  $('#detail-dialog').addEventListener('click',ev=>{if(ev.target===$('#detail-dialog')){const r=ev.target.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)ev.target.close();}});
}

async function init(){
  try{
    [state.catalog,state.people,state.map]=await Promise.all([json('data/catalog.json'),json('data/people.json'),json('data/map.json')]);
    const ip=state.map.towns.filter(f=>f.inset).flatMap(f=>f.polygons.flatMap(poly=>poly.flat()));
    insetBounds=[Math.min(...ip.map(p=>p[0])),Math.min(...ip.map(p=>p[1])),Math.max(...ip.map(p=>p[0])),Math.max(...ip.map(p=>p[1]))];
    const types=[...new Set(state.catalog.map(x=>x.type))].sort((a,b)=>typeOrder.indexOf(a)-typeOrder.indexOf(b));
    $('#type-select').innerHTML=types.map(t=>`<option value="${esc(t)}">${esc(typeNames[t]||t)}</option>`).join('');
    $('#archive-count').textContent=`${state.catalog.length} 場選舉 / 1972 — 2026`;
    const params=new URLSearchParams(location.search),id=params.get('election');
    state.town=townOrder.includes(params.get('town'))?params.get('town'):'';
    state.village=state.town&&state.map.villages.some(x=>x.town===state.town&&x.village===params.get('village'))?params.get('village'):'';
    bindEvents();
    await loadElection(state.catalog.some(x=>x.id===id)?id:'B2024',{initial:true});
    if(window.gsap&&!reduceMotion.matches)gsap.from('.hero > *, .result-panel, .replay-panel',{opacity:0,y:16,duration:.8,stagger:.1,ease:'power3.out'});
  }catch(error){$('#error-banner').textContent=`資料載入失敗：${error.message}。請使用本機 HTTP 預覽開啟此頁，勿直接開啟檔案。`;$('#error-banner').hidden=false;}
}
init();
