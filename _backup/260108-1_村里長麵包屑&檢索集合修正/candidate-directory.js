/* =========================
   候選人檢索（獨立功能模組）
   檔名：candidate-directory.js


   可選排序設定（可放在 index.html 內、載入本檔前）
   window.CANDIDATE_DIRECTORY_PARTY_SORT = 'freq' | 'name' | 'custom'   // 預設 freq
   window.CANDIDATE_DIRECTORY_PARTY_CUSTOM_ORDER = ['中國國民黨','民主進步黨',...]
   window.CANDIDATE_DIRECTORY_TYPE_SORT  = 'freq' | 'name' | 'custom'   // 預設 name
   window.CANDIDATE_DIRECTORY_TYPE_CUSTOM_ORDER  = ['縣長','縣議員',...]
   ========================= */

(function () {
  'use strict';

  const VIEW = 'candidateDirectory';

  // 排除：總統副總統、政黨票型（不分區立委）與公投
  const EXCLUDED_ELECTION_TYPES = new Set(['總統副總統', '不分區立委']);

  // 預設選舉類型顯示順序（未指定時使用）
  const DEFAULT_TYPE_CUSTOM_ORDER = ['區域立委','國大代表','縣長','縣議員','鄉鎮長','鄉鎮民代表','村里長'];

  function isReferendumType(t){
    const s = (t ?? '').toString();
    return /公投|公民投票/.test(s);
  }

  function isExcludedElectionType(t){
    const s = (t ?? '').toString();
    if (!s) return false;
    if (EXCLUDED_ELECTION_TYPES.has(s)) return true;
    // 保險：資料若用不同命名，也一律排除
    if (/總統/.test(s)) return true;
    if (/不分區|政黨票/.test(s)) return true;
if (isReferendumType(s)) return true;
    return false;
  }

  // --- 狀態 ---
  const state = {
    q: '',
    gender: '', // '' | '男' | '女'
    parties: new Set(),
    types: new Set()
  };

  let __index = null;      // { candidates, partyOptions, typeOptions, partyCount, typeCount }
  let __rendering = false;

  // ---------- Global access (兼容 script.js 的 const/let 全域綁定) ----------
  function getElections() {
    try {
      // global lexical binding
      // eslint-disable-next-line no-undef
      if (typeof availableElections !== 'undefined' && Array.isArray(availableElections)) return availableElections;
    } catch (e) { /* ignore */ }
    return Array.isArray(window.availableElections) ? window.availableElections : [];
  }

  function getCandidateData() {
    try {
      // eslint-disable-next-line no-undef
      if (typeof globalCandidateData !== 'undefined' && globalCandidateData) return globalCandidateData;
    } catch (e) { /* ignore */ }
    return window.globalCandidateData || {};
  }

  function getDisplayNameFn() {
    try {
      // eslint-disable-next-line no-undef
      if (typeof getDisplayName === 'function') return getDisplayName;
    } catch (e) { /* ignore */ }
    return (typeof window.getDisplayName === 'function') ? window.getDisplayName : null;
  }

  function getUpdateUrlFn() {
    try {
      // eslint-disable-next-line no-undef
      if (typeof updateUrl === 'function') return updateUrl;
    } catch (e) { /* ignore */ }
    return (typeof window.updateUrl === 'function') ? window.updateUrl : null;
  }

  function getCheckUrlAndRenderFn() {
    try {
      // eslint-disable-next-line no-undef
      if (typeof checkUrlAndRender === 'function') return checkUrlAndRender;
    } catch (e) { /* ignore */ }
    return (typeof window.checkUrlAndRender === 'function') ? window.checkUrlAndRender : null;
  }

  function setCheckUrlAndRenderFn(fn) {
    let ok = false;
    try {
      // eslint-disable-next-line no-undef
      if (typeof checkUrlAndRender === 'function') { checkUrlAndRender = fn; ok = true; }
    } catch (e) { /* ignore */ }
    if (!ok) window.checkUrlAndRender = fn;
  }

  function getAppState() {
    try {
      // eslint-disable-next-line no-undef
      if (typeof appState !== 'undefined' && appState) return appState;
    } catch (e) { /* ignore */ }
    return window.appState || null;
  }

  // ---------- DOM helpers ----------
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function getDom() {
    return {
      content: document.getElementById('content'),
      breadcrumb: document.getElementById('breadcrumb'),
      breadcrumbBottom: document.getElementById('breadcrumb-bottom')
    };
  }

  function hideBreadcrumb() {
    const dom = getDom();
    if (dom.breadcrumb) dom.breadcrumb.style.display = 'none';
    if (dom.breadcrumbBottom) dom.breadcrumbBottom.style.display = 'none';
  }

  function safeDisplayName(name) {
    const fn = getDisplayNameFn();
    if (fn) {
      try { return fn(name); } catch (e) { /* ignore */ }
    }
    return (name || '').toString();
  }

  function toIntYear(y) {
    const n = parseInt(String(y || '').replace(/[^\d]/g, ''), 10);
    return Number.isFinite(n) ? n : 0;
  }

  function setTitle(t) {
    try { document.title = t; } catch (e) { /* ignore */ }
  }

  function updateUrlSafe(stateObj, title, url, pushState) {
    const fn = getUpdateUrlFn();
    if (fn) {
      fn(stateObj, title, url, pushState);
      return;
    }
    setTitle(title);
    if (pushState) history.pushState(stateObj, '', url);
    else history.replaceState(stateObj, '', url);
  }

  // ---------- Readiness ----------
  function hasAnySummary(elections) {
    return elections.some(e => e && e.summaryData && Array.isArray(e.summaryData.allCandidates) && e.summaryData.allCandidates.length > 0);
  }

  function waitForDataReady() {
    // 不強制 candidates.csv 一定要載入成功：沒有也要能跑名鑑
    return new Promise((resolve) => {
      const start = Date.now();
      const MAX_WAIT = 15000; // 15s 保險，不要無限轉圈

      const tick = () => {
        const elections = getElections();
        if (elections.length > 0 && hasAnySummary(elections)) return resolve(true);

        if (Date.now() - start > MAX_WAIT) return resolve(false);
        setTimeout(tick, 150);
      };
      tick();
    });
  }

  // ---------- Index building ----------
  function buildIdToProfileMap(candidateData) {
    const idToProfile = new Map();
    if (!candidateData) return idToProfile;
    for (const nameKey of Object.keys(candidateData)) {
      const p = candidateData[nameKey];
      if (p && p.id && !idToProfile.has(p.id)) idToProfile.set(p.id, p);
    }
    return idToProfile;
  }

  function resolveCandidateId(rawName, candidateData) {
    if (!rawName) return null;
    const direct = candidateData[rawName];
    if (direct && direct.id) return direct.id;

    const dn = safeDisplayName(rawName);
    const byDn = candidateData[dn];
    if (byDn && byDn.id) return byDn.id;

    return null;
  }

  function pickBestNameForModal(rawName, candidateData) {
    if (!rawName) return '';
    if (candidateData[rawName]) return rawName;
    const dn = safeDisplayName(rawName);
    if (candidateData[dn]) return dn;
    return rawName;
  }

  function normalizeGender(v){
    const s = (v ?? '').toString().trim();
    if (!s) return '';
    if (s === '男' || s === '男性' || s === '男生') return '男';
    if (s === '女' || s === '女性' || s === '女生') return '女';
    if (s.includes('男')) return '男';
    if (s.includes('女')) return '女';
    return '';
  }

  function getLongPartyNameSafe(partyName){
    try{
      // eslint-disable-next-line no-undef
      if (typeof getLongPartyName === 'function') return getLongPartyName(partyName);
    }catch(e){}
    try{
      if (typeof window.getLongPartyName === 'function') return window.getLongPartyName(partyName);
    }catch(e){}
    return (partyName ?? '').toString();
  }

  function normalizeParty(p) {
    let party = (p || '').toString().trim();
    if (!party) return '';

    // 排除公投選項（同意/不同意/贊成/反對）不列入「推薦政黨」
    if (/^(同意|不同意|贊成|反對)(票|方)?$/.test(party)) return '';

    if (party.startsWith('無黨籍')) return '無黨籍';
    party = getLongPartyNameSafe(party);
    return party;
  }

  function sortOptions(items, countMap, mode, customOrder) {
    const list = Array.from(items);
    const collator = new Intl.Collator('zh-Hant', { numeric: true, sensitivity: 'base' });

    if (mode === 'custom' && Array.isArray(customOrder) && customOrder.length) {
      const rank = new Map(customOrder.map((n, i) => [n, i]));
      list.sort((a, b) => {
        const ra = rank.has(a) ? rank.get(a) : 1e9;
        const rb = rank.has(b) ? rank.get(b) : 1e9;
        if (ra !== rb) return ra - rb;

        const ca = countMap[a] || 0;
        const cb = countMap[b] || 0;
        if (cb !== ca) return cb - ca;

        return collator.compare(a, b);
      });
      return list;
    }

    if (mode === 'name') {
      list.sort((a, b) => collator.compare(a, b));
      return list;
    }

    // freq（預設）
    list.sort((a, b) => {
      const ca = countMap[a] || 0;
      const cb = countMap[b] || 0;
      if (cb !== ca) return cb - ca;
      return collator.compare(a, b);
    });
    return list;
  }

  function buildCandidateIndex() {
    const candidateData = getCandidateData();
    const idToProfile = buildIdToProfileMap(candidateData);

    const map = new Map(); // key -> candidate object
    const partyCount = Object.create(null);
    const typeCount = Object.create(null);

    const elections = getElections().filter(e => e && !isExcludedElectionType(e.type));

    for (const e of elections) {
      if (!e.summaryData || !Array.isArray(e.summaryData.allCandidates)) continue;

      const etype = (e.type || '').toString();
      const year = toIntYear(e.year);
      const uiName = e.uiName || `${e.year || ''}年 ${etype}`;

      for (const c of e.summaryData.allCandidates) {
        const rawName = (c && c.name) ? String(c.name) : '';
        if (!rawName) continue;

        // 排除「政黨名稱」條目（候選人名稱與推薦政黨相同的情況）
        // 常見於政黨票/彙整資料：避免在名鑑中出現「候選人=政黨」的假資料
        const partyNormalized = normalizeParty(c.party);
        if (partyNormalized && safeDisplayName(rawName) === partyNormalized) continue;

        const id = resolveCandidateId(rawName, candidateData);
        const key = id ? `id:${id}` : `name:${safeDisplayName(rawName)}`;

        if (!map.has(key)) {
          const profile = id ? idToProfile.get(id) : (candidateData[safeDisplayName(rawName)] || candidateData[rawName] || null);

          map.set(key, {
            key,
            id: id || null,
            displayName: safeDisplayName(rawName),
            gender: normalizeGender(profile?.sex || profile?.gender || ''),
            photo: profile?.photo || '',
            birthYear: profile?.birthYear || '',
            birthPlace: profile?.birthPlace || '',
            modalName: pickBestNameForModal(rawName, candidateData),
            histories: [],
            partiesSet: new Set(),
            typesSet: new Set()
          });
        }

        const item = map.get(key);
        const party = partyNormalized;
        const isWinner = !!c.isWinner;
        const isIncumbent = !!c.isIncumbent;

        item.histories.push({
          year,
          electionType: etype,
          electionName: uiName,
          party,
          isWinner,
          isIncumbent
        });

        item.typesSet.add(etype);
        if (party) item.partiesSet.add(party);

        if (party) partyCount[party] = (partyCount[party] || 0) + 1;
        if (etype) typeCount[etype] = (typeCount[etype] || 0) + 1;
      }
    }

    const candidates = Array.from(map.values()).map(c => {
      c.histories.sort((a, b) => (b.year - a.year) || String(b.electionName).localeCompare(String(a.electionName), 'zh-Hant'));
      return c;
    });

    const partySortMode = window.CANDIDATE_DIRECTORY_PARTY_SORT || 'freq';
    const partyCustom = window.CANDIDATE_DIRECTORY_PARTY_CUSTOM_ORDER || [];
    const typeSortMode = window.CANDIDATE_DIRECTORY_TYPE_SORT || 'custom';
    const typeCustom = window.CANDIDATE_DIRECTORY_TYPE_CUSTOM_ORDER || DEFAULT_TYPE_CUSTOM_ORDER;

    const partyOptions = sortOptions(Object.keys(partyCount), partyCount, partySortMode, partyCustom);
    const typeOptions = sortOptions(Object.keys(typeCount), typeCount, typeSortMode, typeCustom);

    return { candidates, partyOptions, typeOptions, partyCount, typeCount };
  }

  // ---------- UI ----------
  function ensureHeaderButton() {
    const header = document.querySelector('header');
    if (!header) return;

    if (document.getElementById('cd-header-btn')) return;

    // header 可能是 text-align:center，改用 absolute 佈局（CSS 控制）
    const btn = document.createElement('button');
    btn.id = 'cd-header-btn';
    btn.className = 'cd-header-btn';
    btn.type = 'button';
    btn.title = '候選人檢索';
    btn.setAttribute('aria-label', '候選人檢索');

    // 放大鏡（一般搜尋 icon）
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2"/>
        <path d="M16.2 16.2L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    btn.addEventListener('click', () => renderCandidateDirectory(true));

    header.appendChild(btn);
  }

  function renderShell() {
    const dom = getDom();
    if (!dom.content) return;

    dom.content.innerHTML = `
      <div class="cd-wrap">
        <div class="card cd-panel" id="cd-panel">
          <div class="cd-title-row">
            <div class="cd-title">候選人檢索</div>
            <div class="cd-count" id="cd-count">索引建立中…</div>
          </div>

          <div class="cd-filter-grid">
            <div class="cd-field">
              <label>姓名</label>
              <input id="cd-q" class="cd-input" type="text" placeholder="輸入姓名關鍵字" autocomplete="off">
            </div>

            <div class="cd-field">
              <label>性別</label>
              <select id="cd-gender" class="cd-input">
                <option value="">全部</option>
                <option value="男">男性</option>
                <option value="女">女性</option>
              </select>
            </div>

            <div class="cd-field">
              <label>推薦政黨</label>
              <div class="cd-multi" id="cd-party">
                <div class="cd-select-like" tabindex="0" role="button" aria-haspopup="listbox" aria-expanded="false">
                  <div class="cd-selected cd-placeholder">全部政黨</div>
                  <div class="cd-caret"></div>
                </div>
                <div class="cd-dropdown" role="listbox" aria-multiselectable="true"></div>
              </div>
            </div>

            <div class="cd-field">
              <label>選舉類型</label>
              <div class="cd-multi" id="cd-type">
                <div class="cd-select-like" tabindex="0" role="button" aria-haspopup="listbox" aria-expanded="false">
                  <div class="cd-selected cd-placeholder">全部選舉</div>
                  <div class="cd-caret"></div>
                </div>
                <div class="cd-dropdown" role="listbox" aria-multiselectable="true"></div>
              </div>
            </div>
          
<div class="cd-field cd-field-reset">
  <label class="cd-label-blank">&nbsp;</label>
  <button class="cd-reset-btn cd-reset-ingrid" id="cd-reset" type="button">清除條件</button>
</div>
          </div>
</div>

        <div class="cd-results" id="cd-results">
          <div class="cd-empty">資料載入中…</div>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function unescapeHtml(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = String(str || '');
    return txt.value;
  }

  function setMultiSelectedText(wrapperEl, selectedSet, placeholder) {
    const labelEl = $('.cd-selected', wrapperEl);
    if (!labelEl) return;
    const arr = Array.from(selectedSet);
    if (arr.length === 0) {
      labelEl.textContent = placeholder;
      labelEl.classList.add('cd-placeholder');
    } else {
      labelEl.textContent = arr.join('、');
      labelEl.classList.remove('cd-placeholder');
    }
  }

  function fillMultiOptions(wrapperEl, options, countMap, selectedSet) {
    const dd = $('.cd-dropdown', wrapperEl);
    if (!dd) return;

    const isParty = wrapperEl && wrapperEl.id === 'cd-party';
    const allLabel = isParty ? '全部政黨' : '全部選舉';
    const allChecked = selectedSet.size === 0 ? 'checked' : '';

    const allRow = `
      <div class="cd-opt cd-opt-all" data-value="__ALL__">
        <input type="checkbox" ${allChecked} aria-label="${escapeHtml(allLabel)}">
        <div class="cd-opt-name">${escapeHtml(allLabel)}</div>
      </div>
    `;

    const rows = options.map(name => {
      const safeVal = escapeHtml(name);
      const checked = selectedSet.has(name) ? 'checked' : '';
      const meta = (countMap && countMap[name]) ? `(${countMap[name]})` : '';
      const showName = isParty ? escapeHtml(getLongPartyNameSafe(name)) : safeVal;
      return `
        <div class="cd-opt" data-value="${safeVal}">
          <input type="checkbox" ${checked} aria-label="${showName}">
          <div class="cd-opt-name">${showName}</div>
          <div class="cd-opt-meta">${meta}</div>
        </div>
      `;
    }).join('');

    dd.innerHTML = allRow + rows;
  }

  function applyFilters(list) {
    const q = (state.q || '').trim();
    const gender = state.gender || '';
    const parties = state.parties;
    const types = state.types;

    return list.filter(c => {
      if (q) {
        const name = c.displayName || '';
        if (!name.includes(q)) return false;
      }
      if (gender && normalizeGender(c.gender) !== gender) return false;

      const hasPartyFilter = parties.size > 0;
      const hasTypeFilter = types.size > 0;

      // ✅ 關鍵修正：同時選「政黨 + 選舉類型」時，必須在「同一筆參選經歷」同時成立
      // 例：選「新黨 + 區域立委」→ 必須曾以「新黨」參加過「區域立委」才顯示
      if (hasPartyFilter && hasTypeFilter) {
        let ok = false;
        for (const h of (c.histories || [])) {
          if (!h) continue;
          const p = (h.party || '').toString();
          const t = (h.electionType || '').toString();
          if (p && parties.has(p) && t && types.has(t)) { ok = true; break; }
        }
        if (!ok) return false;
      } else if (hasPartyFilter) {
        let ok = false;
        for (const p of parties) {
          if (c.partiesSet && c.partiesSet.has(p)) { ok = true; break; }
        }
        if (!ok) return false;
      } else if (hasTypeFilter) {
        let ok = false;
        for (const t of types) {
          if (c.typesSet && c.typesSet.has(t)) { ok = true; break; }
        }
        if (!ok) return false;
      }
      return true;
    });
  }

  function cleanElectionName(name, year){
    const s = (name ?? '').toString().trim();
    const y = String(year ?? '').trim();
    if (!y) return s;
    return s
      .replace(new RegExp('^\\s*' + y + '\\s*年\\s*'), '')
      .replace(new RegExp('^\\s*' + y + '\\s*'), '')
      .trim();
  }

  function renderCandidateCard(c) {
    const photoSrc = c.photo ? `candidates/${c.photo}` : '';
    const photo = photoSrc
      ? `<img class="profile-photo" src="${escapeHtml(photoSrc)}" alt="${escapeHtml(c.displayName)}" onerror="this.style.display='none'; this.parentElement.querySelector('.cd-photo-fallback').style.display='flex';">`
      : '';

    const fallback = `
      <div class="profile-photo cd-photo-fallback" style="display:${photoSrc ? 'none' : 'flex'};align-items:center;justify-content:center;">
        <div style="font-size:30px;opacity:0.7;">👤</div>
      </div>
    `;

    const genderN = normalizeGender(c.gender);
    const genderDisplay = genderN ? (genderN === '男' ? '男性' : '女性') : '—';

    // 出生年（candidates.csv 多半是 birthYear）
    const birthRaw = (c.birthYear || '').toString().trim();
    let birthYear = '';
    if (birthRaw) {
      const mm = birthRaw.match(/\d{3,4}/);
      birthYear = mm ? mm[0] : birthRaw;
    }
    const birthYText = birthYear ? (/^\d{3,4}$/.test(birthYear) ? `${escapeHtml(birthYear)}年` : escapeHtml(birthYear)) : '';
    const birthPlace = (c.birthPlace || '').toString().trim() ? escapeHtml(c.birthPlace) : '';
    const birthLine = (birthYText && birthPlace)
      ? `${birthYText}／${birthPlace} 出生`
      : (birthYText ? `${birthYText} 出生` : (birthPlace ? `${birthPlace} 出生` : '—'));

    const histCount = c.histories ? c.histories.length : 0;
    const modalYear = (c.histories && c.histories.length) ? c.histories[0].year : '';

    const historyHtml = (c.histories || []).map(h => {
      const party = h.party ? `<span class="history-party">${escapeHtml(getLongPartyNameSafe(h.party))}</span>` : '';
      const result = h.isWinner
        ? `<span class="history-result cd-win">當選</span>`
        : `<span class="history-result cd-lose">未當選</span>`;
      const ename = escapeHtml(cleanElectionName(h.electionName, h.year));
      return `
        <li class="history-item">
          <div class="cd-history-left">
            <span class="history-year-tag">${escapeHtml(h.year)}</span>
            <span class="history-name">${ename}</span>
            ${party}
          </div>
          ${result}
        </li>
      `;
    }).join('');

    return `
      <div class="card cd-result-card">
        <div class="profile-header cd-profile-header">
          <div>
            ${photo}
            ${fallback}
          </div>
          <div class="profile-info">
            <h2>
              <a href="#" class="cd-open-modal" data-name="${escapeHtml(c.modalName)}" data-year="${escapeHtml(modalYear)}">${escapeHtml(c.displayName)}</a>
            </h2>
            <div class="profile-detail">${escapeHtml(genderDisplay)}</div>
            <div class="profile-detail">${birthLine}</div>
          </div>
        </div>

        <div class="history-title">參選經歷（${histCount}次）</div>
        <ul class="history-list">
          ${historyHtml}
        </ul>
      </div>
    `;
  }

  function renderResults() {
    if (!__index) return;
    const resultsEl = document.getElementById('cd-results');
    const countEl = document.getElementById('cd-count');
    if (!resultsEl || !countEl) return;

    const filtered = applyFilters(__index.candidates);
    countEl.textContent = `共 ${filtered.length} 人`;

    if (filtered.length === 0) {
      resultsEl.innerHTML = `<div class="cd-empty">找不到符合條件的候選人。試試看清除條件，或換個關鍵字😉</div>`;
      return;
    }

    resultsEl.innerHTML = filtered.map(c => renderCandidateCard(c)).join('');

    // 點名字 → 既有 Modal
    $all('.cd-open-modal', resultsEl).forEach(a => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const modalName = a.getAttribute('data-name') || '';
        const year = a.getAttribute('data-year') || '';
        if (modalName && typeof window.showCandidateModal === 'function') {
          window.showCandidateModal(modalName, year);
        }
      });
    });
  }

  function closeAllDropdowns() {
    $all('.cd-multi').forEach(w => closeMulti(w));
  }

  function toggleMulti(wrapperEl) {
    const box = $('.cd-select-like', wrapperEl);
    if (!box) return;
    const isOpen = wrapperEl.classList.contains('open');

    closeAllDropdowns();
    if (!isOpen) {
      wrapperEl.classList.add('open');
      box.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMulti(wrapperEl) {
    if (!wrapperEl) return;
    const box = $('.cd-select-like', wrapperEl);
    wrapperEl.classList.remove('open');
    if (box) box.setAttribute('aria-expanded', 'false');
  }

  function bindMulti(wrapperEl, options, countMap, selectedSet, placeholder, onChange) {
    if (!wrapperEl) return;

    fillMultiOptions(wrapperEl, options, countMap, selectedSet);
    setMultiSelectedText(wrapperEl, selectedSet, placeholder);

    const box = $('.cd-select-like', wrapperEl);
    if (box) {
      box.addEventListener('click', (ev) => {
        ev.preventDefault();
        toggleMulti(wrapperEl);
      });

      box.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          toggleMulti(wrapperEl);
        }
        if (ev.key === 'Escape') closeMulti(wrapperEl);
      });
    }

    wrapperEl.addEventListener('click', (ev) => {
      const opt = ev.target.closest('.cd-opt');
      if (!opt) return;

      const value = opt.getAttribute('data-value');
      if (!value) return;

      // 點 checkbox 本身：尊重瀏覽器切換後的 checked 狀態
      const cb = opt.querySelector('input[type="checkbox"]');
      const clickedCheckbox = ev.target && ev.target.matches && ev.target.matches('input[type="checkbox"]');

      let next = cb ? cb.checked : false;
      if (!clickedCheckbox && cb) {
        // 點整列：手動切換
        next = !cb.checked;
        cb.checked = next;
      }

      const v = unescapeHtml(value);

      if (v === '__ALL__') {
        // 「全部...」：清空選取
        selectedSet.clear();
      } else {
        if (next) selectedSet.add(v);
        else selectedSet.delete(v);
      }

      // 重新渲染選項，確保勾選符號與「全部...」狀態一致
      fillMultiOptions(wrapperEl, options, countMap, selectedSet);
      setMultiSelectedText(wrapperEl, selectedSet, placeholder);

      if (typeof onChange === 'function') onChange();
    });
  }

  function attachEvents() {
    const qEl = document.getElementById('cd-q');
    const genderEl = document.getElementById('cd-gender');
    const resetEl = document.getElementById('cd-reset');
    const partyEl = document.getElementById('cd-party');
    const typeEl = document.getElementById('cd-type');

    if (qEl) {
      qEl.value = state.q || '';
      qEl.addEventListener('input', () => {
        state.q = qEl.value || '';
        renderResults();
      });
    }

    if (genderEl) {
      genderEl.value = state.gender || '';
      genderEl.addEventListener('change', () => {
        state.gender = genderEl.value || '';
        renderResults();
      });
    }

    if (resetEl) {
      resetEl.addEventListener('click', () => {
        state.q = '';
        state.gender = '';
        state.parties.clear();
        state.types.clear();

        if (qEl) qEl.value = '';
        if (genderEl) genderEl.value = '';

        setMultiSelectedText(partyEl, state.parties, '全部政黨');
        setMultiSelectedText(typeEl, state.types, '全部選舉');

        fillMultiOptions(partyEl, __index.partyOptions, __index.partyCount, state.parties);
        fillMultiOptions(typeEl, __index.typeOptions, __index.typeCount, state.types);

        renderResults();
      });
    }

    // Multi dropdowns
    bindMulti(partyEl, __index.partyOptions, __index.partyCount, state.parties, '全部政黨', renderResults);
    bindMulti(typeEl, __index.typeOptions, __index.typeCount, state.types, '全部選舉', renderResults);

    // 點外面關閉
    document.addEventListener('click', (ev) => {
      if (ev.target.closest('.cd-multi')) return;
      closeAllDropdowns();
    }, { capture: true });
  }

  // ---------- Render ----------
  function renderCandidateDirectory(pushState = true) {
    if (__rendering) return;
    __rendering = true;

    hideBreadcrumb();
    ensureHeaderButton();

    const as = getAppState();
    if (as) {
      try { as.currentLevel = VIEW; } catch (e) { /* ignore */ }
    }

    updateUrlSafe({ view: VIEW }, '金門選舉資料庫 - 候選人檢索', `?view=${VIEW}`, pushState);
    renderShell();

    waitForDataReady().then((ready) => {
      const countEl = document.getElementById('cd-count');
      if (!ready) {
        if (countEl) countEl.textContent = '資料尚未就緒（可能仍在載入）';
      }

      // 建索引（即使 candidates.csv 沒成功，也能跑）
      __index = buildCandidateIndex();

      // 若資料尚未就緒且目前索引仍為空，稍後自動再嘗試一次
      if (!ready && __index && Array.isArray(__index.candidates) && __index.candidates.length === 0) {
        const retry = () => {
          if (hasAnySummary(getElections())) {
            __index = buildCandidateIndex();

            const partyEl2 = document.getElementById('cd-party');
            const typeEl2 = document.getElementById('cd-type');
            fillMultiOptions(partyEl2, __index.partyOptions, __index.partyCount, state.parties);
            fillMultiOptions(typeEl2, __index.typeOptions, __index.typeCount, state.types);
            setMultiSelectedText(partyEl2, state.parties, '全部政黨');
            setMultiSelectedText(typeEl2, state.types, '全部選舉');
            renderResults();
            return;
          }
          setTimeout(retry, 500);
        };
        setTimeout(retry, 500);
      }

      // 注入選項
      const partyEl = document.getElementById('cd-party');
      const typeEl = document.getElementById('cd-type');

      fillMultiOptions(partyEl, __index.partyOptions, __index.partyCount, state.parties);
      fillMultiOptions(typeEl, __index.typeOptions, __index.typeCount, state.types);

      setMultiSelectedText(partyEl, state.parties, '全部政黨');
      setMultiSelectedText(typeEl, state.types, '全部選舉');

      attachEvents();
      renderResults();
    }).finally(() => {
      __rendering = false;
    });
  }

  // ---------- Router hook ----------
  function hookRouter() {
    if (window.__kmdb_candidateDirectory_routerHooked) return;
    window.__kmdb_candidateDirectory_routerHooked = true;

    ensureHeaderButton();

    // wrap checkUrlAndRender（優先），讓 init / popstate 都能支援 ?view=candidateDirectory
    const wrap = () => {
      const orig = getCheckUrlAndRenderFn();
      if (typeof orig !== 'function' || orig.__kmdbWrapped) return false;

      const wrapped = function (params, pushState = false) {
        const s = window.history && window.history.state;
        if (s && s.view) params = s;

        if (params && params.view === VIEW) {
          renderCandidateDirectory(pushState);
          return;
        }
        return orig(params, pushState);
      };
      wrapped.__kmdbWrapped = true;

      setCheckUrlAndRenderFn(wrapped);
      return true;
    };

    // 可能本檔先於 script.js 載入：輪詢直到 checkUrlAndRender 出現
    const start = Date.now();
    const poll = () => {
      if (wrap()) return;

      if (Date.now() - start > 8000) {
        // fallback：包 onpopstate（至少回上一頁/前進不會卡死）
        const prev = window.onpopstate;
        window.onpopstate = function (event) {
          try {
            const st = event && event.state ? event.state : null;
            const view = st && st.view ? st.view : (new URL(location.href)).searchParams.get('view');
            if (view === VIEW) {
              renderCandidateDirectory(false);
              return;
            }
          } catch (e) { /* ignore */ }
          if (typeof prev === 'function') return prev.call(this, event);
        };
        return;
      }
      setTimeout(poll, 120);
    };
    poll();

    // 若目前網址就是名鑑，直接渲染
    try {
      const url = new URL(location.href);
      if (url.searchParams.get('view') === VIEW) renderCandidateDirectory(false);
    } catch (e) { /* ignore */ }
  }

  // Expose + init
  window.renderCandidateDirectory = renderCandidateDirectory;
  hookRouter();

})();