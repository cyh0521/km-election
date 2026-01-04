/* ============================================================
   候選人名鑑（獨立模組）
   - 依姓名/性別/推薦政黨/選舉類型篩選
   - 即時更新結果
   - 盡量不改動既有主程式，只透過 window.* 掛接
   ============================================================ */

(() => {
  'use strict';

  // ====== 你可以自行調整的排序規則（#2）======
  // 若要自訂排序：把想置頂的名稱依序放進陣列，其餘則依「出現次數多→少」再「名稱」排序。
  // 例：window.CANDIDATE_DIRECTORY_PARTY_ORDER = ['中國國民黨', '民主進步黨', '無黨籍'];
  // 例：window.CANDIDATE_DIRECTORY_TYPE_ORDER = ['縣長', '立法委員', '議員', '鄉鎮長', '鄉鎮民代表', '村里長'];
  window.CANDIDATE_DIRECTORY_PARTY_ORDER = window.CANDIDATE_DIRECTORY_PARTY_ORDER || [];
  window.CANDIDATE_DIRECTORY_TYPE_ORDER  = window.CANDIDATE_DIRECTORY_TYPE_ORDER  || [];

  // ====== 不列入「選舉類型」選項與候選人名鑑資料池（#3）======
  const EXCLUDED_ELECTION_TYPE_FOR_DIRECTORY = new Set([
    '總統副總統',  // 總統副總統選舉
    '不分區立委',  // 政黨票型（不分區立委）
  ]);

  // 任務型國大、政黨票、與公投等：以名稱關鍵字排除
  const EXCLUDED_ELECTION_UI_KEYWORDS = [
    '任務型',  // 任務型國大
    '政黨票',  // 政黨票
    '不分區',  // 不分區立委
    '公民投票' // 公投不屬候選人
  ];

  const SEX_ALLOWED = new Set(['男', '女']); // #4：性別選項不提供「未知」

  // ====== 內部狀態 ======
  let cachedIndex = null; // { candidates: Map<id, {...}>, parties: [...], types:[...] }
  let ready = false;

  // 外部初始化：由主 script 在資料載入完成後呼叫
  window.initCandidateDirectory = function initCandidateDirectory() {
    ready = true;
    const btn = document.getElementById('candidate-directory-open');
    if (btn) {
      btn.disabled = false;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.renderCandidateDirectory?.(true);
      });
    }
  };

  // ====== 路由入口：由 checkUrlAndRender 呼叫 ======
  window.renderCandidateDirectory = function renderCandidateDirectory(pushState = true) {
    if (!ready) {
      // 還沒載完資料就點：不爆炸，給提示
      const content = document.getElementById('content');
      if (content) content.innerHTML = `<div class="loading-state">候選人名鑑正在準備資料，請稍候…</div>`;
      return;
    }

    const url = `?view=candidateDirectory`;
    const state = { view: 'candidateDirectory' };

    try {
      if (typeof updateUrl === 'function') {
        updateUrl(state, '金門選舉資料庫 - 候選人名鑑', url, pushState);
      } else {
        // fallback：至少改網址（不影響原站功能）
        if (pushState) history.pushState(state, '', url);
      }
    } catch (_) {}

    // 設定層級狀態
    if (window.appState) {
      window.appState.currentLevel = 'candidateDirectory';
      // 清理舊圖表
      if (Array.isArray(window.appState.chartInstances)) {
        window.appState.chartInstances.forEach(ch => { try { ch.destroy(); } catch (_) {} });
        window.appState.chartInstances = [];
      }
    }

    // scroll
    try {
      if (pushState) {
        window.scrollTo(0, 0);
      } else {
        const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
        setTimeout(() => window.scrollTo(0, savedY), 0);
      }
    } catch (_) {}

    // 更新麵包屑（已在主程式加上 candidateDirectory case）
    try { window.updateBreadcrumb?.(); } catch (_) {}

    // 內容渲染
    const domContent = document.getElementById('content');
    if (!domContent) return;

    domContent.innerHTML = buildShell();

    // 建索引 & 填入選項 & 綁事件
    const index = getOrBuildIndex();
    bindUI(index);
    applyFiltersAndRender(index);
  };

  // ====== UI 殼 ======
  function buildShell() {
    return `
      <section class="main-section">
        <div class="section-header">
          <div class="section-title">候選人名鑑</div>
          <div class="section-badge">即時篩選</div>
        </div>

        <div class="cd-filters card">
          <div class="cd-filter-row">
            <label class="cd-label" for="cd-name">姓名</label>
            <input id="cd-name" class="cd-input" type="text" placeholder="輸入姓名（可部分比對）" autocomplete="off">
          </div>

          <div class="cd-filter-row cd-two-cols">
            <div class="cd-col">
              <label class="cd-label" for="cd-sex">性別</label>
              <select id="cd-sex" class="cd-select">
                <option value="">全部</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>

            <div class="cd-col">
              <label class="cd-label">推薦政黨</label>
              <div class="cd-multi-wrap">
              <div id="cd-party" class="cd-multi" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">
                <span class="cd-multi-text cd-placeholder">全部</span>
                <span class="cd-multi-caret">▾</span>
              </div>
              <div id="cd-party-panel" class="cd-panel" role="listbox" aria-multiselectable="true"></div>
              </div>
            </div>
          </div>

          <div class="cd-filter-row">
            <label class="cd-label">選舉類型</label>
            <div class="cd-multi-wrap">
            <div id="cd-type" class="cd-multi" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">
              <span class="cd-multi-text cd-placeholder">全部</span>
              <span class="cd-multi-caret">▾</span>
            </div>
            <div id="cd-type-panel" class="cd-panel" role="listbox" aria-multiselectable="true"></div>
            </div>
          </div>

          <div class="cd-filter-row cd-actions">
            <button id="cd-clear" class="cd-btn" type="button">清除條件</button>
            <div id="cd-count" class="cd-count"></div>
          </div>
        </div>

        <div id="cd-results" class="cd-results"></div>
      </section>
    `;
  }

  // ====== 建立候選人索引 ======
  function getOrBuildIndex() {
    if (cachedIndex) return cachedIndex;

    // 依既有資料結構建立：availableElections + globalCandidateData
    const elections = window.availableElections || [];
    const g = window.globalCandidateData || {};

    const byId = new Map();
    const partyCount = new Map();
    const typeCount = new Map();

    const shouldExcludeElection = (e) => {
      if (!e) return true;
      if (EXCLUDED_ELECTION_TYPE_FOR_DIRECTORY.has(String(e.type || '').trim())) return true;
      const ui = String(e.uiName || '');
      for (const kw of EXCLUDED_ELECTION_UI_KEYWORDS) {
        if (ui.includes(kw)) return true;
      }
      return false;
    };

    for (const e of elections) {
      if (!e || !e.summaryData || !Array.isArray(e.summaryData.allCandidates)) continue;
      if (shouldExcludeElection(e)) continue;

      for (const c of e.summaryData.allCandidates) {
        if (!c || !c.name) continue;
        const cd = g[c.name];
        if (!cd || !cd.id) continue;

        const id = cd.id;
        if (!byId.has(id)) {
          byId.set(id, {
            id,
            // nameKey：保留原 key（可能含尾碼，用來精準對回 globalCandidateData）
            nameKey: c.name,
            displayName: safeDisplayName(c.name),
            sex: normalizeSex(cd.sex),
            birthYear: cd.birthYear || '',
            photo: cd.photo || '',
            // 這裡先保留「最後一次」的現職/當選旗標等（非必要，可擴充）
            histories: []
          });
        }

        const entry = {
          year: e.year,
          electionName: e.uiName,
          type: e.type,
          party: c.party || '',
          isWinner: !!c.isWinner,
          isIncumbent: !!c.isIncumbent
        };

        byId.get(id).histories.push(entry);

        const p = normalizePartyLabel(entry.party);
        if (p) partyCount.set(p, (partyCount.get(p) || 0) + 1);

        const t = String(e.type || '').trim();
        if (t) typeCount.set(t, (typeCount.get(t) || 0) + 1);
      }
    }

    // histories 排序：新→舊
    for (const item of byId.values()) {
      item.histories.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    const parties = sortByPriorityThenCountThenName(Array.from(partyCount.entries()), window.CANDIDATE_DIRECTORY_PARTY_ORDER);
    const types   = sortByPriorityThenCountThenName(Array.from(typeCount.entries()), window.CANDIDATE_DIRECTORY_TYPE_ORDER);

    cachedIndex = {
      candidates: byId,
      parties: parties.map(([name]) => name),
      types: types.map(([name]) => name)
    };
    return cachedIndex;
  }

  function safeDisplayName(nameKey) {
    try {
      if (typeof getDisplayName === 'function') return getDisplayName(nameKey);
    } catch (_) {}
    // fallback：移除尾端數字（重名後綴）
    return String(nameKey).replace(/\d+$/, '');
  }

  function normalizeSex(sex) {
    const s = String(sex || '').trim();
    if (s === 'M' || s === '男') return '男';
    if (s === 'F' || s === '女') return '女';
    return s || '';
  }

  function normalizePartyLabel(partyRaw) {
    if (!partyRaw) return '';
    // 既有 helper：getLongPartyName（能處理縮寫/尾碼）
    try {
      if (typeof getLongPartyName === 'function') {
        return getLongPartyName(String(partyRaw));
      }
    } catch (_) {}
    // fallback：拿掉尾碼 -1/-2
    return String(partyRaw).split('-')[0].trim();
  }

  function sortByPriorityThenCountThenName(entries, priorityList) {
    const pri = Array.isArray(priorityList) ? priorityList : [];
    const priorityMap = new Map(pri.map((name, idx) => [name, idx]));

    return entries.sort((a, b) => {
      const [nameA, cntA] = a;
      const [nameB, cntB] = b;

      const pa = priorityMap.has(nameA) ? priorityMap.get(nameA) : Infinity;
      const pb = priorityMap.has(nameB) ? priorityMap.get(nameB) : Infinity;
      if (pa !== pb) return pa - pb;

      if (cntA !== cntB) return cntB - cntA;
      return String(nameA).localeCompare(String(nameB), 'zh-Hant');
    });
  }

  // ====== 綁定 UI 與選項 ======
  function bindUI(index) {
    // options
    renderMultiPanel('cd-party-panel', index.parties);
    renderMultiPanel('cd-type-panel', index.types);

    // toggles
    setupMultiSelect('cd-party', 'cd-party-panel', 'cd-party');
    setupMultiSelect('cd-type', 'cd-type-panel', 'cd-type');

    // instant filters
    const nameEl = document.getElementById('cd-name');
    const sexEl = document.getElementById('cd-sex');
    const clearEl = document.getElementById('cd-clear');

    const onChange = () => applyFiltersAndRender(index);

    nameEl?.addEventListener('input', onChange, { passive: true });
    sexEl?.addEventListener('change', onChange);
    document.getElementById('cd-party-panel')?.addEventListener('change', onChange);
    document.getElementById('cd-type-panel')?.addEventListener('change', onChange);

    clearEl?.addEventListener('click', () => {
      if (nameEl) nameEl.value = '';
      if (sexEl) sexEl.value = '';
      clearMultiPanel('cd-party-panel');
      clearMultiPanel('cd-type-panel');
      refreshMultiText('cd-party', 'cd-party-panel', '全部');
      refreshMultiText('cd-type', 'cd-type-panel', '全部');
      applyFiltersAndRender(index);
    });

    // 外部點擊關閉 panel
    document.addEventListener('click', (ev) => {
      const t = ev.target;
      closePanelIfClickedOutside('cd-party', 'cd-party-panel', t);
      closePanelIfClickedOutside('cd-type', 'cd-type-panel', t);
    }, { passive: true });
  }

  function renderMultiPanel(panelId, items) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    if (!items || items.length === 0) {
      panel.innerHTML = `<div class="cd-panel-empty">（無可用選項）</div>`;
      return;
    }

    panel.innerHTML = items.map((name, i) => {
      const safe = escapeHtml(name);
      const inputId = `${panelId}-opt-${i}`;
      return `
        <label class="cd-option" for="${inputId}">
          <input id="${inputId}" type="checkbox" value="${safe}">
          <span class="cd-option-text">${safe}</span>
        </label>
      `;
    }).join('');
  }

  function setupMultiSelect(triggerId, panelId, groupName) {
    const trigger = document.getElementById(triggerId);
    const panel = document.getElementById(panelId);
    if (!trigger || !panel) return;

    const toggle = () => {
      const isOpen = panel.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        // 對齊寬度
        panel.style.minWidth = `${trigger.getBoundingClientRect().width}px`;
      }
    };

    trigger.addEventListener('click', (ev) => {
      ev.stopPropagation();
      toggle();
    });
    trigger.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        toggle();
      }
      if (ev.key === 'Escape') {
        panel.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    panel.addEventListener('change', () => {
      refreshMultiText(triggerId, panelId, groupName === 'cd-party' ? '全部' : '全部');
    });
  }

  function closePanelIfClickedOutside(triggerId, panelId, target) {
    const trigger = document.getElementById(triggerId);
    const panel = document.getElementById(panelId);
    if (!trigger || !panel) return;

    const clickedInside = trigger.contains(target) || panel.contains(target);
    if (!clickedInside) {
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  function clearMultiPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    panel.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  }

  function refreshMultiText(triggerId, panelId, emptyText = '全部') {
    const trigger = document.getElementById(triggerId);
    const panel = document.getElementById(panelId);
    if (!trigger || !panel) return;

    const selected = Array.from(panel.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const textEl = trigger.querySelector('.cd-multi-text');
    if (!textEl) return;

    if (selected.length === 0) {
      textEl.textContent = emptyText;
      textEl.classList.add('cd-placeholder');
    } else {
      textEl.textContent = selected.join('、'); // #5：框框內列出已選政黨/類型
      textEl.classList.remove('cd-placeholder');
    }
  }

  // ====== 套用篩選並渲染 ======
  function applyFiltersAndRender(index) {
    const nameQuery = (document.getElementById('cd-name')?.value || '').trim();
    const sex = (document.getElementById('cd-sex')?.value || '').trim();

    const partiesSelected = getSelectedValues('cd-party-panel').map(normalizePartyLabel);
    const typesSelected = getSelectedValues('cd-type-panel');

    // 更新選取文字
    refreshMultiText('cd-party', 'cd-party-panel', '全部');
    refreshMultiText('cd-type', 'cd-type-panel', '全部');

    const q = normalizeText(nameQuery);

    const results = [];
    for (const cand of index.candidates.values()) {
      // name
      if (q) {
        const dn = normalizeText(cand.displayName);
        const nk = normalizeText(cand.nameKey);
        if (!dn.includes(q) && !nk.includes(q)) continue;
      }

      // sex
      if (sex) {
        if (normalizeSex(cand.sex) !== sex) continue;
      }

      // party
      if (partiesSelected.length > 0) {
        const candParties = new Set(cand.histories.map(h => normalizePartyLabel(h.party)).filter(Boolean));
        let ok = false;
        for (const p of partiesSelected) {
          if (candParties.has(p)) { ok = true; break; }
        }
        if (!ok) continue;
      }

      // type
      if (typesSelected.length > 0) {
        const candTypes = new Set(cand.histories.map(h => String(h.type || '').trim()).filter(Boolean));
        let ok = false;
        for (const t of typesSelected) {
          if (candTypes.has(t)) { ok = true; break; }
        }
        if (!ok) continue;
      }

      results.push(cand);
    }

    // 預設排序：姓名（繁中排序），若想改可自行調整這裡
    results.sort((a, b) => a.displayName.localeCompare(b.displayName, 'zh-Hant'));

    const countEl = document.getElementById('cd-count');
    if (countEl) countEl.textContent = `共 ${results.length.toLocaleString('zh-Hant')} 人`;

    renderResults(results);
  }

  function getSelectedValues(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return [];
    return Array.from(panel.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
  }

  function renderResults(list) {
    const wrap = document.getElementById('cd-results');
    if (!wrap) return;

    if (!list || list.length === 0) {
      wrap.innerHTML = `<div class="loading-state">沒有符合條件的候選人。</div>`;
      return;
    }

    wrap.innerHTML = list.map(c => renderCandidateCard(c)).join('');

    // 綁定「查看詳情」：沿用既有候選人 modal
    wrap.querySelectorAll('[data-open-candidate]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const nameKey = btn.getAttribute('data-open-candidate');
        if (!nameKey) return;
        try { window.showCandidateModal?.(nameKey); } catch (_) {}
      });
    });
  }

  function renderCandidateCard(c) {
    const photo = c.photo ? `candidates/${encodeURIComponent(c.photo)}` : '';
    const sex = normalizeSex(c.sex);
    const sexLabel = SEX_ALLOWED.has(sex) ? sex : ''; // #4：不顯示「未知」

    const detailLine = [
      sexLabel ? `性別：${sexLabel}` : '',
      c.birthYear ? `出生：${escapeHtml(String(c.birthYear))}` : ''
    ].filter(Boolean).join('　');

    const historiesHtml = c.histories.map(h => renderHistoryItem(h)).join('');

    return `
      <div class="cd-card card">
        <div class="cd-top">
          <div class="cd-photo-wrap">
            ${photo ? `<img class="cd-photo" src="${photo}" alt="">` : `<div class="cd-photo-placeholder">${escapeHtml((c.displayName || '').slice(0,1) || '?')}</div>`}
          </div>

          <div class="cd-info">
            <div class="cd-name-row">
              <div class="cd-name">${escapeHtml(c.displayName)}</div>
              <button class="cd-mini-link" type="button" data-open-candidate="${escapeHtml(c.nameKey)}">查看詳情 ➜</button>
            </div>
            <div class="cd-detail">${detailLine || '—'}</div>
          </div>
        </div>

        <div class="cd-history">
          <div class="cd-history-title">參選紀錄</div>
          <div class="cd-history-list">
            ${historiesHtml || `<div class="cd-history-empty">（查無參選紀錄）</div>`}
          </div>
        </div>
      </div>
    `;
  }

  function renderHistoryItem(h) {
    const year = escapeHtml(String(h.year || ''));
    const name = escapeHtml(String(h.electionName || ''));
    const type = escapeHtml(String(h.type || ''));
    const party = normalizePartyLabel(h.party);
    const partyBadge = party ? `<span class="party-badge">${escapeHtml(party)}</span>` : '';
    const winBadge = h.isWinner ? `<span class="cd-win">當選</span>` : `<span class="cd-lose">未當選</span>`;
    const incBadge = h.isIncumbent ? `<span class="incumbent-badge">現任</span>` : '';

    return `
      <div class="cd-history-item">
        <div class="cd-history-left">
          <span class="cd-year">${year}</span>
          <span class="cd-type">${type}</span>
        </div>
        <div class="cd-history-mid">
          <div class="cd-election">${name}</div>
          <div class="cd-partyline">${partyBadge} ${incBadge}</div>
        </div>
        <div class="cd-history-right">
          ${winBadge}
        </div>
      </div>
    `;
  }

  // ====== helpers ======
  function normalizeText(s) {
    return String(s || '').replace(/\s+/g, '').toLowerCase();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

})();
