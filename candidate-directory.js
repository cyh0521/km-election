/* =========================
   候選人名鑑（獨立功能模組）
   - 不修改原有資料載入流程，只在路由 / UI 上「掛接」
   - 檔名：candidate-directory.js
   你可以用下面兩個全域設定調整排序（可選）
   window.CANDIDATE_DIRECTORY_PARTY_SORT = 'freq' | 'name' | 'custom'   // 預設 freq
   window.CANDIDATE_DIRECTORY_PARTY_CUSTOM_ORDER = ['中國國民黨', '民主進步黨', ...]
   window.CANDIDATE_DIRECTORY_TYPE_SORT = 'freq' | 'name' | 'custom'    // 預設 name
   window.CANDIDATE_DIRECTORY_TYPE_CUSTOM_ORDER = ['縣長', '縣議員', ...]
   ========================= */

(function () {
    'use strict';

    const VIEW = 'candidateDirectory';

    // 排除：總統副總統、政黨票型（不分區立委、任務型國大）
    const EXCLUDED_ELECTION_TYPES = new Set(['總統副總統', '不分區立委', '國大代表']);

    // --- 狀態 ---
    const state = {
        q: '',
        gender: '',                 // '' | '男' | '女'
        parties: new Set(),
        types: new Set()
    };

    let __index = null;             // { candidates:[], partyOptions:[], typeOptions:[], partyCount, typeCount }
    let __isRendering = false;

    // --- 小工具 ---
    function $(sel, root = document) { return root.querySelector(sel); }
    function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

    function safeDisplayName(name) {
        try {
            if (typeof window.getDisplayName === 'function') return window.getDisplayName(name);
        } catch (e) { /* ignore */ }
        return name || '';
    }

    function toIntYear(y) {
        const n = parseInt(String(y || '').replace(/[^\d]/g, ''), 10);
        return Number.isFinite(n) ? n : 0;
    }

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

    function setTitle(t) {
        try { document.title = t; } catch (e) { /* ignore */ }
    }

    function updateUrlSafe(stateObj, title, url, pushState) {
        if (typeof window.updateUrl === 'function') {
            window.updateUrl(stateObj, title, url, pushState);
            return;
        }
        // fallback
        setTitle(title);
        if (pushState) {
            history.pushState(stateObj, '', url);
        } else {
            history.replaceState(stateObj, '', url);
        }
    }

    function waitForDataReady() {
        return new Promise((resolve) => {
            const tick = () => {
                const hasElections = Array.isArray(window.availableElections) && window.availableElections.length > 0;
                const hasAnySummary = hasElections && window.availableElections.some(e => e && e.summaryData && e.summaryData.allCandidates);
                const hasCandidates = window.globalCandidateData && Object.keys(window.globalCandidateData).length > 0;
                if (hasElections && hasAnySummary && hasCandidates) return resolve();
                setTimeout(tick, 120);
            };
            tick();
        });
    }

    function buildIdToProfileMap(globalCandidateData) {
        const idToProfile = new Map();
        if (!globalCandidateData) return idToProfile;
        for (const k of Object.keys(globalCandidateData)) {
            const p = globalCandidateData[k];
            if (!p) continue;
            const id = p.id;
            if (!id) continue;
            if (!idToProfile.has(id)) idToProfile.set(id, p);
        }
        return idToProfile;
    }

    function resolveCandidateId(rawName, globalCandidateData) {
        if (!rawName) return null;
        const exact = globalCandidateData && globalCandidateData[rawName];
        if (exact && exact.id) return exact.id;

        const dname = safeDisplayName(rawName);
        const byDisp = globalCandidateData && globalCandidateData[dname];
        if (byDisp && byDisp.id) return byDisp.id;

        return null;
    }

    function pickBestNameForModal(rawName, globalCandidateData) {
        // 盡量選一個 globalCandidateData 有收錄的 key，讓既有 Modal 比較不會找不到
        if (!rawName) return '';
        if (globalCandidateData && globalCandidateData[rawName]) return rawName;

        const dn = safeDisplayName(rawName);
        if (globalCandidateData && globalCandidateData[dn]) return dn;

        return rawName;
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
        const globalCandidateData = window.globalCandidateData || {};
        const idToProfile = buildIdToProfileMap(globalCandidateData);

        const map = new Map(); // key -> candidate object
        const partyCount = Object.create(null);
        const typeCount = Object.create(null);

        const elections = (window.availableElections || []).filter(e => e && !EXCLUDED_ELECTION_TYPES.has(e.type));

        for (const e of elections) {
            if (!e.summaryData || !e.summaryData.allCandidates) continue;

            const etype = e.type || '';
            const year = toIntYear(e.year);
            const uiName = e.uiName || `${e.year || ''}年 ${etype}`;

            for (const c of e.summaryData.allCandidates) {
                const rawName = (c && c.name) ? String(c.name) : '';
                if (!rawName) continue;

                const id = resolveCandidateId(rawName, globalCandidateData);
                const key = id ? `id:${id}` : `name:${safeDisplayName(rawName)}`;

                if (!map.has(key)) {
                    const profile = id ? idToProfile.get(id) : (globalCandidateData[safeDisplayName(rawName)] || globalCandidateData[rawName] || null);
                    const displayName = profile?.displayName ? profile.displayName : safeDisplayName(rawName);

                    map.set(key, {
                        key,
                        id: id || null,
                        displayName,
                        gender: (profile && (profile.sex === '男' || profile.sex === '女')) ? profile.sex : '',
                        photo: profile?.photo || '',
                        birth: profile?.birth || '',
                        birthplace: profile?.birthplace || '',
                        modalName: pickBestNameForModal(rawName, globalCandidateData),
                        histories: [],
                        partiesSet: new Set(),
                        typesSet: new Set()
                    });
                }

                const item = map.get(key);
                const party = (c.party || '').trim();
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

        // 性別「未知」不做成選項（但候選人仍可在「全部」中出現）
        const partySortMode = window.CANDIDATE_DIRECTORY_PARTY_SORT || 'freq';
        const partyCustom = window.CANDIDATE_DIRECTORY_PARTY_CUSTOM_ORDER || [];
        const typeSortMode = window.CANDIDATE_DIRECTORY_TYPE_SORT || 'name';
        const typeCustom = window.CANDIDATE_DIRECTORY_TYPE_CUSTOM_ORDER || [];

        const partyOptions = sortOptions(Object.keys(partyCount), partyCount, partySortMode, partyCustom);
        const typeOptions = sortOptions(Object.keys(typeCount), typeCount, typeSortMode, typeCustom);

        return { candidates, partyOptions, typeOptions, partyCount, typeCount };
    }

    // --- UI ---
    function ensureHeaderButton() {
        const header = document.querySelector('header');
        if (!header) return;

        if (document.getElementById('cd-header-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'cd-header-btn';
        btn.className = 'cd-header-btn';
        btn.type = 'button';
        btn.title = '候選人名鑑';
        btn.setAttribute('aria-label', '候選人名鑑');

        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 7.5C7 5.57 8.57 4 10.5 4h3C15.43 4 17 5.57 17 7.5v.5H7v-.5Z" stroke="currentColor" stroke-width="1.7"/>
              <path d="M6 8h12a2 2 0 0 1 2 2v8.5a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 18.5V10a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.7"/>
              <path d="M8 13.2h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
              <path d="M8 16.8h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            </svg>
        `;
        btn.addEventListener('click', () => {
            renderCandidateDirectory(true);
        });

        header.appendChild(btn);
    }

    function renderShell() {
        const dom = getDom();
        if (!dom.content) return;

        dom.content.innerHTML = `
            <div class="cd-wrap">
                <div class="card cd-panel" id="cd-panel">
                    <div class="cd-title-row">
                        <div class="cd-title">候選人名鑑</div>
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
                                <option value="男">男</option>
                                <option value="女">女</option>
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
                                    <div class="cd-selected cd-placeholder">全部類型</div>
                                    <div class="cd-caret"></div>
                                </div>
                                <div class="cd-dropdown" role="listbox" aria-multiselectable="true"></div>
                            </div>
                        </div>
                    </div>

                    <div class="cd-helper-row">
                        <div class="cd-tip">提示：可複選政黨 / 類型，變更選項會即時更新下方結果。</div>
                        <button class="cd-reset-btn" id="cd-reset" type="button">清除條件</button>
                    </div>
                </div>

                <div class="cd-results" id="cd-results">
                    <div class="cd-empty">資料載入中…</div>
                </div>
            </div>
        `;
    }

    function setMultiSelectedText(boxEl, selectedSet, placeholder) {
        const labelEl = $('.cd-selected', boxEl);
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

        dd.innerHTML = options.map(name => {
            const safe = escapeHtml(name);
            const checked = selectedSet.has(name) ? 'checked' : '';
            const meta = (countMap && countMap[name]) ? `(${countMap[name]})` : '';
            return `
                <div class="cd-opt" data-value="${safe}">
                    <input type="checkbox" ${checked} aria-label="${safe}">
                    <div class="cd-opt-name">${safe}</div>
                    <div class="cd-opt-meta">${meta}</div>
                </div>
            `;
        }).join('');
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
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

            if (gender) {
                if (c.gender !== gender) return false;
            }

            if (parties && parties.size > 0) {
                let ok = false;
                for (const p of parties) {
                    if (c.partiesSet && c.partiesSet.has(p)) { ok = true; break; }
                }
                if (!ok) return false;
            }

            if (types && types.size > 0) {
                let ok = false;
                for (const t of types) {
                    if (c.typesSet && c.typesSet.has(t)) { ok = true; break; }
                }
                if (!ok) return false;
            }

            return true;
        });
    }

    function renderResults() {
        if (!__index) return;
        const dom = getDom();
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

        // 綁定：點候選人名稱 → 既有 modal（若存在）
        $all('.cd-open-modal', resultsEl).forEach(a => {
            a.addEventListener('click', (ev) => {
                ev.preventDefault();
                const modalName = a.getAttribute('data-name') || '';
                if (modalName && typeof window.showCandidateModal === 'function') {
                    window.showCandidateModal(modalName);
                }
            });
        });
    }

    function renderCandidateCard(c) {
        const photoSrc = c.photo ? `candidates/${c.photo}` : '';
        const photo = photoSrc
            ? `<img class="cd-photo" src="${escapeHtml(photoSrc)}" alt="${escapeHtml(c.displayName)}" onerror="this.style.display='none'; this.parentElement.querySelector('.cd-photo-fallback').style.display='flex';">`
            : '';

        const fallback = `
            <div class="cd-photo cd-photo-fallback" style="display:${photoSrc ? 'none' : 'flex'};align-items:center;justify-content:center;">
                <div style="font-size:30px;opacity:0.7;">👤</div>
            </div>
        `;

        const badges = [
            (c.gender ? `<span class="cd-pill">${escapeHtml(c.gender)}</span>` : ''),
            (c.id ? `<span class="cd-pill">ID ${escapeHtml(c.id)}</span>` : '')
        ].filter(Boolean).join('');

        const metaParts = [];
        if (c.birth) metaParts.push(`出生：${escapeHtml(c.birth)}`);
        if (c.birthplace) metaParts.push(`籍貫：${escapeHtml(c.birthplace)}`);

        const histCount = c.histories ? c.histories.length : 0;

        const historyHtml = (c.histories || []).map(h => {
            const party = h.party ? `<span class="cd-party">${escapeHtml(h.party)}</span>` : '';
            const result = h.isWinner ? `<span class="cd-h-right cd-win">當選</span>` : `<span class="cd-h-right cd-lose">未當選</span>`;
            const ename = `${escapeHtml(h.electionName)}`;
            return `
                <div class="cd-history-item">
                    <div class="cd-h-left">
                        <span class="cd-year">${escapeHtml(h.year)}</span>
                        <span class="cd-ename">${ename}</span>
                        ${party}
                    </div>
                    ${result}
                </div>
            `;
        }).join('');

        return `
            <div class="card cd-result-card">
                <div class="cd-top">
                    <div>
                        ${photo}
                        ${fallback}
                    </div>
                    <div>
                        <div class="cd-name-row">
                            <div class="cd-name">
                                <a href="#" class="cd-open-modal" data-name="${escapeHtml(c.modalName)}" style="color:inherit;text-decoration:none;">
                                    ${escapeHtml(c.displayName)}
                                </a>
                            </div>
                            <div class="cd-badges">${badges}</div>
                        </div>
                        ${metaParts.length ? `<div class="cd-meta">${metaParts.join('　')}</div>` : `<div class="cd-meta">（尚無更多個人資料）</div>`}
                    </div>
                </div>

                <div class="cd-history">
                    <div class="cd-history-title">
                        <div>參選經歷</div>
                        <span>${histCount} 次</span>
                    </div>
                    <div class="cd-history-list">
                        ${historyHtml}
                    </div>
                </div>
            </div>
        `;
    }

    function attachEvents() {
        const qEl = document.getElementById('cd-q');
        const genderEl = document.getElementById('cd-gender');
        const resetEl = document.getElementById('cd-reset');
        const partyEl = document.getElementById('cd-party');
        const typeEl = document.getElementById('cd-type');

        if (qEl) {
            qEl.value = state.q;
            qEl.addEventListener('input', () => {
                state.q = qEl.value || '';
                renderResults();
            });
        }
        if (genderEl) {
            genderEl.value = state.gender;
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
                setMultiSelectedText(typeEl, state.types, '全部類型');

                // 同步 checkbox
                $all('.cd-opt input[type="checkbox"]', partyEl).forEach(i => (i.checked = false));
                $all('.cd-opt input[type="checkbox"]', typeEl).forEach(i => (i.checked = false));

                renderResults();
            });
        }

        bindMultiSelect(partyEl, state.parties, '全部政黨', () => renderResults());
        bindMultiSelect(typeEl, state.types, '全部類型', () => renderResults());

        // 點外面關閉 dropdown
        document.addEventListener('click', (ev) => {
            const t = ev.target;
            // 如果點在 dropdown / trigger 內，就不關
            if (partyEl && partyEl.contains(t)) return;
            if (typeEl && typeEl.contains(t)) return;

            if (partyEl) closeMulti(partyEl);
            if (typeEl) closeMulti(typeEl);
        }, { passive: true });
    }

    function openMulti(el) {
        if (!el) return;
        el.classList.add('open');
        const trigger = $('.cd-select-like', el);
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    function closeMulti(el) {
        if (!el) return;
        el.classList.remove('open');
        const trigger = $('.cd-select-like', el);
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }

    function toggleMulti(el) {
        if (!el) return;
        if (el.classList.contains('open')) closeMulti(el);
        else openMulti(el);
    }

    function bindMultiSelect(wrapperEl, selectedSet, placeholder, onChange) {
        if (!wrapperEl) return;

        const trigger = $('.cd-select-like', wrapperEl);
        if (trigger) {
            trigger.addEventListener('click', () => toggleMulti(wrapperEl));
            trigger.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    toggleMulti(wrapperEl);
                }
                if (ev.key === 'Escape') {
                    closeMulti(wrapperEl);
                }
            });
        }

        wrapperEl.addEventListener('click', (ev) => {
            const opt = ev.target.closest('.cd-opt');
            if (!opt) return;

            const value = opt.getAttribute('data-value');
            if (!value) return;

            const cb = opt.querySelector('input[type="checkbox"]');
            const next = !(cb && cb.checked);
            if (cb) cb.checked = next;

            if (next) selectedSet.add(unescapeHtml(value));
            else selectedSet.delete(unescapeHtml(value));

            setMultiSelectedText(wrapperEl, selectedSet, placeholder);
            if (typeof onChange === 'function') onChange();
        });

        // 初始化文字
        setMultiSelectedText(wrapperEl, selectedSet, placeholder);
    }

    function unescapeHtml(str) {
        // 因為 data-value 放 escapeHtml，點選後要還原
        const txt = document.createElement('textarea');
        txt.innerHTML = String(str || '');
        return txt.value;
    }

    // --- 對外：render ---
    function renderCandidateDirectory(pushState = true) {
        if (__isRendering) return;
        __isRendering = true;

        hideBreadcrumb();
        ensureHeaderButton();

        try { if (window.appState) window.appState.currentLevel = 'candidateDirectory'; } catch (e) { /* ignore */ }

        updateUrlSafe({ view: VIEW }, '金門選舉資料庫 - 候選人名鑑', `?view=${VIEW}`, pushState);

        renderShell();

        waitForDataReady().then(() => {
            // 首次建立索引
            if (!__index) __index = buildCandidateIndex();

            // 注入 options
            const partyEl = document.getElementById('cd-party');
            const typeEl = document.getElementById('cd-type');

            fillMultiOptions(partyEl, __index.partyOptions, __index.partyCount, state.parties);
            fillMultiOptions(typeEl, __index.typeOptions, __index.typeCount, state.types);

            setMultiSelectedText(partyEl, state.parties, '全部政黨');
            setMultiSelectedText(typeEl, state.types, '全部類型');

            attachEvents();
            renderResults();
        }).finally(() => {
            __isRendering = false;
        });
    }

    // --- 路由掛接：讓 ?view=candidateDirectory 能運作 ---
    function hookRouter() {
        // 避免重複包裝
        if (window.__kmdb_candidateDirectory_routerHooked) return;
        window.__kmdb_candidateDirectory_routerHooked = true;

        // 1) header icon
        ensureHeaderButton();

        // 2) wrap checkUrlAndRender
        const orig = window.checkUrlAndRender;
        if (typeof orig === 'function') {
            window.checkUrlAndRender = function (params, pushState = false) {
                // 優先使用 history.state（與原本一致）
                const s = window.history && window.history.state;
                if (s && s.view) params = s;

                if (params && params.view === VIEW) {
                    renderCandidateDirectory(pushState);
                    return;
                }
                return orig(params, pushState);
            };
        }

        // 3) 如果目前網址就是名鑑，立刻渲染
        try {
            const url = new URL(location.href);
            if (url.searchParams.get('view') === VIEW) {
                renderCandidateDirectory(false);
            }
        } catch (e) { /* ignore */ }
    }

    // 立即掛接
    hookRouter();

    // 也掛到 window，方便手動呼叫（例如 console）
    window.renderCandidateDirectory = renderCandidateDirectory;

})();
