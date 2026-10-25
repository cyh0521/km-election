# A 歡迎區 + A2 首頁圖示

## 網站素材

- 歡迎區：`images/illustrations/political-mountain-a.png`，1940 × 600，透明 PNG。
- 九個首頁圖示：`images/election-categories/a2-atlas.png`，透明 PNG，以 3 × 3 圖集載入。
- 圖集順序：總統副總統、立法委員、國大代表／縣長、縣議員、鄉鎮長／鄉鎮民代表、村里長、公民投票。
- 第二層分類仍使用既有 `palette-v1` 圖示。

## 製作方式

歡迎區依核准的 A 版以 `tools/draw-welcome-a.ps1` 重建，可執行 PowerShell 腳本重新輸出 PNG；文字由 HTML/CSS 呈現。

修正版將兩條山線與淡色塊分開繪製，依 A 版示意圖保留錯位層次。轉播塔參考太武山實景，採窄幅近直立格構塔、頂部天線與三個側邊圓盤的簡化造形。

首頁圖集使用內建 image_gen 工具，參考核准的「A 歡迎區 + A2 圖示」示意圖產生，再以同一工具整理透明背景。沒有使用 CLI/API fallback。

## 圖集提示詞

Production sprite atlas: extract the nine approved A2 category illustrations from the selected homepage mockup. Preserve the simplified geometric filled and outlined shapes, teal figures and architecture, muted clay-brown accents, warm gold details, pale mint/gold geometry and white internal fills. Output one square transparent 3-by-3 sprite sheet. No UI, labels, cards, borders or shadows. Use equal-sized cells, center each illustration with transparent padding, and keep every illustration inside its cell. Order: president/vice-president; legislative podium and ballot; Zhongshan Hall and gavel; magistrate and Kinmen outline; county council; township mayor and signpost; township representatives; Kinmen traditional houses; referendum ballots.

Final cleanup prompt: keep all nine icons, subjects, arrangement, shapes, proportions, teal/clay/gold palette the same. Remove stray floating colored speckles, pixel noise, stray strokes, halos, disconnected fragments and residue from transparent gutters. Keep crisp smooth edges and genuine white internal fills. Register centers at one sixth, one half and five sixths of each axis. Keep each icon within the central eighty percent of its cell, with approximately equal optical heights. No labels, grids, card rectangles, shadows or extra elements.
