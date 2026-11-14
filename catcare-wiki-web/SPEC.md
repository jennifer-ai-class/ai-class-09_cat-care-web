# CatCare Wiki｜網站規格書

## 1. 專案定位
喵喵照護百科是面向一般貓咪飼主的繁體中文靜態知識網站，提供健康疾病、飲食營養、行為觀察、日常照護四類文章。資訊僅供教育參考，不取代獸醫診斷。

## 2. 第一版範圍
- 首頁：網站介紹、搜尋框、四類分類入口、文章卡片。
- 分類篩選：點選分類後顯示對應文章。
- 即時搜尋：比對標題、摘要、標籤（不要求全文搜尋）。
- 文章閱讀：同一個 `index.html` 內切換視圖，將 Markdown 渲染為 HTML。
- 返回首頁、空結果提示、載入失敗提示、手機版排版。
- 不做登入、後端、資料庫、留言或 AI 聊天。

## 3. 技術架構
- HTML5、CSS3、原生 JavaScript；部署至 GitHub Pages。
- 文章原文：`articles/*.md`；文章索引：`data/articles.json`。
- 網頁透過 `fetch()` 讀取索引及文章，使用經過安全處理的 Markdown 轉換方式呈現文章；不得直接將未經清理的使用者 HTML 插入 DOM。
- 所有檔案使用相對路徑，以支援 GitHub Pages 專案子路徑。
- 頁面需透過本機 HTTP server 或 GitHub Pages 測試，不以 `file://` 開啟測試 `fetch()`。

## 4. 視覺規範
- 溫馨可愛、簡潔易讀；奶油白 `#FFF9F0`、鼠尾草綠 `#8BAF9A`、深灰 `#303A35`。
- 圓角卡片、柔和陰影、適量貓咪插畫，避免過度裝飾。
- 桌面版文章卡片三欄，平板兩欄，手機一欄；依實際寬度調整。
- 可鍵盤操作、明確焦點狀態、圖片替代文字與合理文字對比。

## 5. 文章資料
`data/articles.json` 為 JSON 陣列，每筆包含：
- `slug`：唯一英文小寫連字號 ID
- `title`：繁體中文標題
- `category`：`health`、`nutrition`、`behavior`、`daily-care` 其中之一
- `summary`：簡短摘要
- `tags`：字串陣列
- `file`：相對於專案根目錄的 Markdown 路徑

文章 Markdown 使用 H1 標題，並依序包含「主題介紹」「常見原因或背景」「觀察重點」「照護建議」「何時尋求獸醫協助」「參考資料」。沒有可靠資料時應標明待查證，不可杜撰來源。

## 6. 第一版範例
- `cat-acne.md`：貓咪黑下巴是什麼？（health）
- `cat-water-intake.md`：貓咪每天應該喝多少水？（nutrition）
- `introducing-cats.md`：新舊貓咪如何和平相處？（behavior）

## 7. 驗收標準
1. GitHub Pages 公開網址可開啟首頁。
2. 四類分類入口正常，搜尋有結果與空結果狀態。
3. 至少三篇 Markdown 文章可點開閱讀並返回。
4. 手機及桌面瀏覽不發生明顯溢出。
5. 新增第四篇文章後，無須修改首頁 HTML，即可由索引出現在文章清單中。
6. GitHub Repository 根目錄有 `AGENTS.md`、`SPEC.md`、`README.md`。
