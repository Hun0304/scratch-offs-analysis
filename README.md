# Scratch Lab｜算一算好奇心

依提供的米白／深綠設計製作，純前端運算、手機與桌面皆可操作。

## 功能

- 六碼拆分，或分別輸入 A、B、C。
- 中獎率以百分比輸入；步長自動等於中獎率小數值 ÷ 10。
- 指定 N、票號上下限、批次次數（預設 30）；向下／向上取整並去除重複。
- 展示逐步公式、批次列表、匯出 UTF-8 CSV。
- 預算與不同票價比較、不重複隨機挑號。
- 收支筆記保存在 localStorage，可匯出 CSV。

## 算式

```text
D = A + B + C
p = 輸入的百分比 / 100
s = p / 10
結果 = D × (p + s × N)
```

03、43、91；30%；N=3 → 137 × (0.3 + 0.03 × 3) = 53.43 → 候選 53、54。
計算使用 BigInt 定點數，支援中獎率最多六位小數，避免浮點誤差。
這是依指定規則產生候選票號，並非經驗證的中獎預測。

## 本機開發

需 Node.js 22 或以上。

```bash
npm ci
npm run dev
node --test tests/calculations.test.mjs
npm run build
```

## 版本控制與 GitHub Pages

此專案使用 `Hun0304/scratch-offs-analysis` 的 `main` 分支做版本控制。
網站原始碼在 `src/`；可以直接發布的靜態成品在 `docs/`。

### 首次啟用 Pages

1. 進入儲存庫 **Settings → Pages**。
2. 在 Build and deployment 選擇 **Deploy from a branch**。
3. Branch 選擇 **main**，資料夾選擇 **/docs**，按 **Save**。
4. 等待 GitHub Pages 的部署工作成功，使用 Settings → Pages 顯示的網站網址。

這個專案站點預期路徑為 `https://hun0304.github.io/scratch-offs-analysis/`；首次啟用前不會有可用網站。
目前儲存庫為私人：GitHub Free 的 Pages 僅支援公開儲存庫，私人儲存庫需 GitHub Pro 或其他支援方案。
本次實作不修改儲存庫可見性。請依你的方案確認 Pages 是否可用。

### 後續更新

```bash
npm ci
npm test
npm run build:pages
```

將原始碼與更新後的 `docs/` 一起提交到 `main`，已設定的 Pages 會重新發布。
`.github/workflows/ci.yml` 每次推送及 PR 會執行公式測試、建置，並保留靜態成品 artifact。
這個工作流程不會自動啟用或變更 Pages 設定。

### 驗證狀態

- 6 項 Node.js 功能測試通過，包含精確公式、步長連動、錯誤輸入、票號範圍、預算與隨機抽樣。
- 正式建置通過。
- 雲端瀏覽器預覽逾時，尚未完成瀏覽器操作及畫面驗證；詳見 `design-qa.md`。

## 資料與限制

筆記只保存在目前瀏覽器，不會傳送到 GitHub 或伺服器；清除網站資料將移除筆記。
沒有跨裝置同步，請用 CSV 定期備份。網站字型由 Google Fonts 載入，無網路時使用系統字型。
輸入範圍與預設機率為示範，實際票號及官方中獎率由使用者自行提供。
