/* Kinmen participation story. All rates are calculated from the source CSVs. */
(() => {
  'use strict';
  const categories = [
    {key:'A',name:'總統副總統',color:'#276b60',years:[1996,2000,2004,2008,2012,2016,2020,2024]},
    {key:'B',name:'區域立委',color:'#b75d3e',years:[1992,1995,1998,2001,2004,2008,2012,2016,2019,2020,2024]},
    {key:'D',name:'國大代表',color:'#526e9c',years:[1991,1996,2005]},
    {key:'E',name:'縣長',color:'#93701f',years:[1993,1997,2001,2005,2009,2014,2018,2022]}
  ];
  const towns = ['金城鎮','金寧鄉','金湖鎮','金沙鎮','烈嶼鄉','烏坵鄉'];
  const $ = id => document.getElementById(id);
  const number = value => value.toLocaleString('zh-TW');
  const rate = value => value.toFixed(1);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const visible = new Set(categories.map(c => c.key));
  let elections = [], years = [], index = 0, selected = null, timer = null;
  let W=1000,H=340;
  const left=44,right=20,top=22,bottom=42;
  const x = year => left+(year-1991)/(2024-1991)*(W-left-right);
  const y = percent => H-bottom-percent/100*(H-top-bottom);

  // Handle quoted CSV fields as well as the simple unquoted rows in the archive.
  function parseCSV(text) {
    const rows=[]; let row=[],field='',quoted=false;
    text=text.replace(/^\uFEFF/,'');
    for(let i=0;i<text.length;i++) {
      const c=text[i];
      if(c==='"') { if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted; }
      else if(c===','&&!quoted){row.push(field);field='';}
      else if((c==='\n'||c==='\r')&&!quoted){row.push(field);if(row.some(v=>v.trim()))rows.push(row);row=[];field='';if(c==='\r'&&text[i+1]==='\n')i++;}
      else field+=c;
    }
    row.push(field);if(row.some(v=>v.trim()))rows.push(row);
    return rows;
  }
  function summarize(text,category,year) {
    const rows=parseCSV(text),header=rows[2]||[];
    const validCol=header.findIndex(v=>/^有效票/.test(v.trim()));
    const invalidCol=header.findIndex(v=>/^無效票/.test(v.trim()));
    const eligibleCol=header.findIndex(v=>/^選舉人數/.test(v.trim()));
    if([validCol,invalidCol,eligibleCol].some(v=>v<0))throw new Error(`${year} 年${category.name}缺少投票率欄位`);
    const numeric = (row,col) => {
      const value=Number(String(row[col]??'').replace(/,/g,'').trim());
      if(!Number.isFinite(value)||value<0||String(row[col]??'').trim()==='')throw new Error(`${year} 年${category.name}有不完整人數`);
      return value;
    };
    const records=rows.slice(3).filter(r=>r[0]?.trim()&&r.length>eligibleCol&&!r[0].includes('鄉鎮'));
    // A county total, when present, takes precedence over its constituent rows.
    const countyRows=records.filter(r=>r[0].trim()==='金門縣'&&r[1]?.trim()==='總計');
    const totals={valid:0,invalid:0,eligible:0};
    for(const row of countyRows.length?countyRows:records){totals.valid+=numeric(row,validCol);totals.invalid+=numeric(row,invalidCol);totals.eligible+=numeric(row,eligibleCol);}
    if(!totals.eligible||totals.valid+totals.invalid>totals.eligible)throw new Error(`${year} 年${category.name}的投票人數需要確認`);
    const townshipData=towns.map(name=>{
      const rowsForTown=records.filter(r=>r[0].trim()===name);
      const townTotals=rowsForTown.filter(r=>r[1]?.trim()==='總計');
      const values={name,valid:0,invalid:0,eligible:0};
      for(const row of townTotals.length?townTotals:rowsForTown){values.valid+=numeric(row,validCol);values.invalid+=numeric(row,invalidCol);values.eligible+=numeric(row,eligibleCol);}
      return {...values,rate:values.eligible?(values.valid+values.invalid)/values.eligible*100:null};
    }).filter(t=>t.rate!==null);
    return {...totals,category,year,id:`${category.key}${year}`,rate:(totals.valid+totals.invalid)/totals.eligible*100,towns:townshipData,
      special:category.key==='B'&&year===2019?'補選':category.key==='D'&&year===2005?'任務型選舉':'',file:`../elections/${category.key}/${category.key}${year}.csv`};
  }
  function drawChart() {
    W=Math.max(320,Math.min(1000,$('plot-wrap').clientWidth));
    H=W<600?280:340;
    const grid=[0,20,40,60,80,100].map(v=>`<line class="plot-grid" x1="${left}" x2="${W-right}" y1="${y(v)}" y2="${y(v)}"/><text class="plot-label" x="${left-10}" y="${y(v)+4}" text-anchor="end">${v}%</text>`).join('');
    const tickYears=W<600?[1991,2000,2010,2024]:[1991,1996,2001,2006,2011,2016,2020,2024];
    const ticks=tickYears.map(v=>`<text class="plot-label" x="${x(v)}" y="${H-13}" text-anchor="middle">${v}</text>`).join('');
    const paths=categories.map(c=>{
      const events=elections.filter(e=>e.category.key===c.key);
      const d=events.map((e,i)=>`${i?'L':'M'}${x(e.year)},${y(e.rate)}`).join(' ');
      return `<g class="series-line" data-series="${c.key}" stroke="${c.color}"><path d="${d}" class="series-path series-ghost"/><g clip-path="url(#time-reveal)"><path d="${d}" class="series-path"/></g></g>`;
    }).join('');
    const points=elections.map(e=>`<g class="point-group" data-series="${e.category.key}" data-year="${e.year}" data-id="${e.id}" style="color:${e.category.color}"><circle class="point-dot" cx="${x(e.year)}" cy="${y(e.rate)}" r="4" fill="currentColor"/><circle class="point-selected" cx="${x(e.year)}" cy="${y(e.rate)}" r="8" stroke="currentColor" visibility="hidden"/><circle class="point-hit" cx="${x(e.year)}" cy="${y(e.rate)}" r="12" tabindex="0" role="button" aria-label="${e.year}年${e.category.name}${e.special}，投票率${rate(e.rate)}%"><title>${e.year} ${e.category.name}${e.special?'・'+e.special:''} ${rate(e.rate)}%</title></circle></g>`).join('');
    $('plot-wrap').innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="金門四類選舉投票率折線圖，橫軸1991至2024年，縱軸0至100%。可用Tab選擇各選舉圓點，按Enter查看明細。"><defs><clipPath id="time-reveal"><rect class="plot-reveal" id="reveal" x="0" y="0" width="${x(1991)}" height="${H}"/></clipPath></defs>${grid}${ticks}<line class="plot-cursor" id="cursor" x1="${x(1991)}" x2="${x(1991)}" y1="${top}" y2="${H-bottom}"/>${paths}${points}</svg>`;
    $('plot-wrap').querySelectorAll('.point-hit').forEach(point=>{
      const choose=()=>{stop();const e=elections.find(e=>e.id===point.parentElement.dataset.id);index=years.indexOf(e.year);selected=e;render();};
      point.addEventListener('click',choose);
      point.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose();}});
    });
  }
  function detail() {
    const events=elections.filter(e=>e.year===years[index]&&visible.has(e.category.key));
    if(!events.includes(selected))selected=events[0]||elections.find(e=>e.year===years[index]);
    $('detail-title').textContent=`${years[index]} 年的選票`;
    $('event-tabs').innerHTML=events.map(e=>`<button type="button" data-event="${e.id}" style="--series:${e.category.color}" aria-pressed="${selected===e}">${e.category.name}${e.special?'・'+e.special:''}</button>`).join('');
    $('event-tabs').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.event;selected=elections.find(e=>e.id===id);render();$('event-tabs').querySelector(`[data-event="${id}"]`)?.focus();}));
    if(!events.length){$('event-detail').innerHTML='<p class="no-towns">這一年沒有目前勾選類別的選舉。請切換年份，或顯示其他類別。</p>';return;}
    const e=selected,total=e.valid+e.invalid;
    const townHTML=e.towns.length?`<div><div class="town-heading"><span>各鄉鎮投票率</span><small>長條固定以 100% 為滿格</small></div>${e.towns.map(t=>`<div class="town-row"><span>${t.name}</span><div class="town-track"><div class="town-bar" style="width:${t.rate}%"></div></div><span class="town-value">${rate(t.rate)}%</span></div>`).join('')}</div>`:'<div class="no-towns">這場選舉的站內資料只有全縣總計，<br>尚無可供比較的鄉鎮明細。</div>';
    const note=e.special==='補選'?'2019 年立委補選。補選與定期選舉的投票情境不同，請一併考量。':e.special==='任務型選舉'?'2005 年任務型國大代表選舉，採政黨比例代表方式選出代表。':'以本場選舉的選舉人數為分母；不同類別選舉的選舉人數可能不同。';
    $('event-detail').innerHTML=`<div class="detail-layout" style="--series:${e.category.color}"><div><p class="detail-label">${e.category.name}${e.special?`<span class="special-tag">${e.special}</span>`:''}</p><div class="detail-rate">${rate(e.rate)}<small>%</small></div><div class="detail-counts"><span>投票人數<strong>${number(total)}</strong></span><span>選舉人數<strong>${number(e.eligible)}</strong></span></div><p class="detail-note">${note}</p><a class="detail-source" href="${e.file}">查看本場原始資料 ↗</a></div>${townHTML}</div>`;
  }
  function render() {
    const year=years[index];
    $('current-year').textContent=year;
    $('year-range').value=index;
    $('year-range').setAttribute('aria-valuetext',`${year}年`);
    $('reveal').setAttribute('width',x(year)+1);
    for(const attr of ['x1','x2'])$('cursor').setAttribute(attr,x(year));
    detail();
    document.querySelectorAll('.series-line').forEach(g=>g.style.opacity=visible.has(g.dataset.series)?'1':'0');
    document.querySelectorAll('.point-group').forEach(g=>{
      const enabled=visible.has(g.dataset.series),past=Number(g.dataset.year)<=year;
      g.style.opacity=enabled?(past?'1':'.2'):'0';
      g.setAttribute('aria-hidden',String(!enabled));
      g.querySelector('.point-hit').setAttribute('tabindex',enabled?'0':'-1');
      g.style.pointerEvents=enabled?'auto':'none';
      g.querySelector('.point-selected').setAttribute('visibility',enabled&&selected?.id===g.dataset.id?'visible':'hidden');
    });
    $('stat-grid').innerHTML=categories.map(c=>{
      const past=elections.filter(e=>e.category.key===c.key&&e.year<=year),e=past[past.length-1];
      return `<div class="stat-card ${visible.has(c.key)?'':'is-hidden'}" style="--series:${c.color}"><div class="stat-name">${c.name}</div><div class="stat-rate">${e?rate(e.rate):'—'}${e?'<small>%</small>':''}</div><div class="stat-year">${e?`最近一場：${e.year} 年${e.special?'・'+e.special:''}`:'尚未有選舉資料'}</div></div>`;
    }).join('');
  }
  function stop(){if(timer!==null)clearInterval(timer);timer=null;$('play').innerHTML='▶ <span>播放變化</span>';$('play').setAttribute('aria-label','播放歷年變化');}
  function start(){if(index===years.length-1)index=0;render();$('play').innerHTML='Ⅱ <span>暫停播放</span>';$('play').setAttribute('aria-label','暫停播放');timer=setInterval(()=>{if(index<years.length-1){index++;render();}if(index===years.length-1)stop();},Number($('speed').value));}
  async function init(){
    try {
      const requested=categories.flatMap(c=>c.years.map(year=>({category:c,year})));
      elections=await Promise.all(requested.map(async({category,year})=>{
        const file=`../elections/${category.key}/${category.key}${year}.csv`,response=await fetch(file);
        if(!response.ok)throw new Error(`${year}年${category.name}讀取失敗`);
        return summarize(await response.text(),category,year);
      }));
      elections.sort((a,b)=>a.year-b.year||a.category.key.localeCompare(b.category.key));
      years=[...new Set(elections.map(e=>e.year))];
      $('legend').innerHTML=categories.map(c=>`<button type="button" data-category="${c.key}" aria-pressed="true" style="--series:${c.color}"><span class="legend-dot" aria-hidden="true"></span>${c.name}</button>`).join('');
      $('legend').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
        const key=button.dataset.category;if(visible.has(key)){if(visible.size===1)return;visible.delete(key);}else visible.add(key);
        button.setAttribute('aria-pressed',String(visible.has(key)));render();
      }));
      drawChart();
      $('year-range').max=years.length-1;$('year-range').disabled=false;$('play').disabled=false;
      $('year-range').addEventListener('input',()=>{stop();index=Number($('year-range').value);render();});
      $('play').addEventListener('click',()=>timer!==null?stop():start());
      $('speed').addEventListener('change',()=>{if(timer!==null){stop();start();}});
      document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
      window.addEventListener('pagehide',stop);
      render();$('story-panel').setAttribute('aria-busy','false');
      new ResizeObserver(()=>{const width=Math.max(320,Math.min(1000,$('plot-wrap').clientWidth));if(Math.abs(width-W)>1){drawChart();render();}}).observe($('plot-wrap'));
    }catch(error){
      $('plot-wrap').innerHTML=`<p class="error-message" role="alert">${escape(error.message)}。請重新整理頁面再試一次。</p>`;
      $('event-detail').innerHTML='<p class="no-towns">選舉資料載入完成後，這裡會顯示當年明細。</p>';
      $('story-panel').setAttribute('aria-busy','false');
    }
  }
  init();
})();
