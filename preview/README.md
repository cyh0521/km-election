# 金門政治山・互動版試作

此目錄為**獨立版本**。不修改根目錄的 HTML、CSS、JavaScript、CSV 或候選人照片。

## 開啟

在專案根目錄執行：

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

瀏覽 `http://127.0.0.1:8766/preview/`。請透過 HTTP 開啟，直接雙擊 HTML 無法載入 JSON。
亦可執行本目錄的 `start-preview.ps1`。

預設使用 2024 區域立委選舉，直接引用現有候選人照片。可由上方選單切換總統、縣長、議員等選舉。

## 已完成

- 深色、藍紫地圖、螢光綠選取的獨立響應式介面。
- SVG 立體側面、GSAP 浮起與鏡頭聚焦，平面／立體切換、縮放、鍵盤操作。
- 縣／鄉鎮／村里結果連動，候選人得票率與投票率著色。
- 歷屆時間軸可點選、拖動、播放、暫停與切換速度；只播放同系列已開票場次。
- 332 場現有 CSV 的讀取快照，真實照片、票數、當選標記與明細；原始 CSV 下載。
- 未開票、不存在的地區明細、無資料與零票分開處理。
- 支援 `prefers-reduced-motion`；切出頁面自動暫停回放。

## 更新選舉資料

```powershell
python preview/tools/build_data.py
```

此工具讀取原 `script.js` 的選舉目錄與原 CSV，在 `preview/data/` 產生唯讀顯示用 JSON。
不寫回原檔。照片仍由 `../candidates/` 引用，新增／改名照片後請重建資料。

`data/data-audit.json` 記錄缺漏。原選舉目錄列出的 37 場 2026 村里長選舉沒有對應 CSV，未列入試作。
2026 有名單的未開票場次可查看，但不會把預留零票呈現為結果。

## 地圖與授權

- 行政區：內政部國土測繪中心「村(里)界(TWD97經緯度)」，下載來源見 `tools/fetch_maps.py`。依政府資料開放授權條款使用。
- 海岸線：© OpenStreetMap contributors，ODbL，透過 Overpass API 取得。
- 六鄉鎮、三十七村里與海岸陸地面相交裁切，再簡化為網站向量。`data/map.json` 包含來源註記。
- 烏坵以獨立比例附圖呈現；微小島礁保留至顯示精度，縮放可查看。
- **目前行政界只作地名導覽，不代表歷年選區界線**。歷史資料以鄉鎮／村里名稱連接；無對應不推估。
- 高度代表互動選取，不代表真實海拔或票數。
- 這是 SVG 投影立體效果，並非可任意旋轉的 WebGL 地形模型。

重建圖資需 Python 的 `pyshp` 與 `shapely`，可安裝至 `preview/.build/python`，執行 `tools/fetch_maps.py` 再執行 `tools/build_map.py`。
下載及中間檔在忽略的 `.build/` 內，前端不依賴它們。

GSAP 3.13.0 已放在 `vendor/gsap.min.js`，保留原廠授權標頭。字體透過 Google Fonts 載入，無網路時使用系統字體。

## 驗證

```powershell
python preview/tools/check_data.py
node --check preview/app.js
```

前端沒有建置步驟；可連同原有 `candidates/`、`elections/` 放到相同靜態主機。此試作尚未部署。
