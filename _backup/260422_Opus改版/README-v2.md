# 金門選舉資料庫 · 重構版本（v2）

本次重構的核心目標：**大幅改善首頁載入效能 + 整理程式碼結構**，同時完全保留原有介面與功能。

---

## 📊 效能改善（重點）

| 項目 | 原本 | 重構後 | 改善 |
|---|---|---|---|
| 首頁 CSV 請求數 | 316 個 | 0 個 | ↓ 100% |
| 首頁總請求數 | 316+ | 1（載入 summaries.json）| ↓ 99.7% |
| 首頁下載量 | 436 KB（CSV）+ 200 KB（Chart.js）≈ 636 KB | 248 KB 原始 / **24 KB gzip** | ↓ 96%（gzip 後）|
| 同場選舉縣→鎮→村切換 | 每層 fetch 1 次 | 快取只 fetch 1 次 | ↓ 67% |

---

## 📁 檔案變更清單

### ✨ 新增檔案
| 檔案 | 用途 |
|---|---|
| `elections-data.js` | 316 筆選舉清單 + 類別定義（由 script.js 抽出） |
| `build-summaries.js` | **離線腳本** — 將 316 個 CSV 預先聚合成 JSON（Node.js） |
| `elections-summaries.json` | **預產生的摘要檔** — 前端首頁只需 fetch 這一個檔 |

### 🔧 修改檔案
| 檔案 | 變更內容 |
|---|---|
| `index.html` | 引入 `elections-data.js`；移除未使用的 Chart.js CDN |
| `script.js` | 從 3136 行降到 2857 行；改造載入邏輯；新增 CSV 快取 |

### 📦 未變更檔案
- `style.css`、`candidate-directory.css` — 完全沒動
- `candidate-directory.js` — 完全沒動
- `elections/` 目錄下所有 CSV — 完全沒動
- `candidates/` 目錄下所有照片 — 完全沒動
- `candidates.csv`、`sitemap.xml` — 完全沒動

---

## 🚀 部署指南

### 首次部署
把整個 v2 目錄上傳到 Cloudflare Pages（或原本的部署環境）即可。**一切原有功能都保留**，使用者不會察覺到任何介面變化，只會發現開啟速度變快。

### 日後維護 — 新增選舉資料時

以前：
1. 把新 CSV 放進 `elections/` 對應子目錄
2. 在 `script.js` 的 `availableElections` 陣列加一行

現在：
1. 把新 CSV 放進 `elections/` 對應子目錄
2. 在 **`elections-data.js`**（不是 script.js 了）的 `availableElections` 加一行
3. **跑一次腳本更新摘要檔**：
   ```bash
   cd km-election/
   node build-summaries.js
   ```
   會自動重新產生 `elections-summaries.json`
4. 上傳所有變更（新 CSV + elections-data.js + elections-summaries.json）

> 💡 **要讓使用者立即看到新版本**：把 `index.html` 裡三處 `?v=260317-1` 改成新的版本號，例如 `?v=260322-1`

### 若 elections-summaries.json 不存在的 fallback 行為
萬一忘了跑 `build-summaries.js`，或 JSON 檔損壞，前端會自動**退回到舊模式**（一個一個 fetch CSV）。功能仍正常，只是較慢。這個設計是為了確保不會因為漏跑腳本而整站壞掉。

---

## 🔍 內部技術變更細節

### 1. `loadAllElectionSummaries` 改造（script.js）
- 原本：並發 fetch 所有 316 個 CSV，每個都 parse
- 現在：fetch 1 個 `elections-summaries.json`，同步填入 `summaryData`
- 失敗時自動 fallback 到 `loadAllElectionSummariesLegacy`（舊邏輯）

### 2. 新增 `fetchElectionCSV` 函式（script.js）
- 使用 `csvCache = new Map()` 實作
- 同一檔第二次以後直接回傳已解析的 Promise
- 用於三處：`loadData`、`checkUrlAndRender` 的 town 分支、village 分支
- 例如：點進 2022 縣長選舉 → 切到金城鎮 → 切到東門里，原本要 fetch 3 次（同一個 CSV），現在 1 次

### 3. `elections-data.js` 模組化
- 用 IIFE 封裝，避免全域汙染
- 在 IIFE 內為每筆資料產生 `uniqueId`
- 最後以 `window.availableElections` / `window.electionCategories` 導出
- 相容原 `script.js` 所有使用方式，不需改變呼叫端

### 4. 移除 Chart.js CDN
- 原 index.html 載入 `https://cdn.jsdelivr.net/npm/chart.js`（完整版 ~200 KB）
- 搜尋全專案發現：**沒有任何 `new Chart()` 或 `Chart(` 呼叫**
- `appState.chartInstances` 只有清空邏輯，沒有填入邏輯，是舊殘留
- 安全移除，零影響

---

## 🧪 驗證狀態

| 驗證項目 | 結果 |
|---|---|
| elections-data.js 可正確載入 316 筆 | ✅ |
| build-summaries.js 成功產生 316/316 摘要 | ✅ |
| script.js 語法驗證（Node.js new Function） | ✅ |
| candidate-directory.js 語法驗證 | ✅ |
| summaries.json 316 筆全部 non-null | ✅ |
| 互動測試（實際瀏覽器操作） | ⚠️ 環境限制未能完成，建議部署前本機實測 |

### 本地測試建議
把 v2 解壓到任意目錄後：
```bash
cd km-election-v2/
node build-summaries.js  # 如果要重新產生 JSON
python3 -m http.server 8000
# 開 http://localhost:8000/ 測試
```

測試重點：
1. 首頁開啟速度是否變快（開 DevTools Network 看請求數）
2. 點「縣長」等類別，列表是否正常
3. 點「查看詳情」進入某場選舉
4. 切換鄉鎮、村里，看 Network 是否只 fetch 一次同檔
5. 點候選人姓名，彈窗是否正常顯示參選經歷
6. 點右上放大鏡，候選人名鑑是否正常運作

---

## ❓ 其他未處理項目（可選）

這些原本討論過但本次未動的項目：

- **介面視覺升級**：依你最終指示「只改效能與結構」，故未動任何 CSS
- **候選人名鑑入口不明顯**：未動介面
- **script.js 進一步模組化**：雖然已降到 2857 行，仍可再拆成 router / renderer / utils 等多檔。這次只做了最有價值的「抽出資料」這一步，避免風險擴大

有需要可再開新對話處理。

---

Made with ❤️ for 金門選舉資料庫
重構日期：2026-04-22
