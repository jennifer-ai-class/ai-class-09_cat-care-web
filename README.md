# 🐾 喵喵照護百科 CatCare Wiki

一個以繁體中文呈現貓咪照護知識的靜態單頁式網站，採用奶油白與鼠尾草綠的溫馨設計。

## 功能
- 四類文章分類、即時關鍵字搜尋、Markdown 文章閱讀與返回列表
- 手機、平板、桌面響應式排版
- 文章以 `articles/*.md` 獨立管理，`data/articles.json` 為唯一索引
- 不需後端或資料庫，可部署至 GitHub Pages

## 本機執行
請在專案根目錄啟動 HTTP server（直接雙擊 `index.html` 的 `file://` 模式無法正常讀取文章）：

```bash
python3 -m http.server 8000
```

開啟 http://localhost:8000/ 。

## GitHub Pages
將整個專案推送至 GitHub Repository，進入 **Settings → Pages → Build and deployment**，選擇 **Deploy from a branch**，設定 `main` 與 `/(root)`，等待部署完成後使用 GitHub 提供的網址開啟。

## AI 擴充流程
先閱讀 [`AGENTS.md`](AGENTS.md) 與 [`SPEC.md`](SPEC.md)。新增文章時建立 `articles/<slug>.md` 並同步新增 `data/articles.json` 的索引項目；無須修改 `index.html`。

建議驗證指令：「請依照 AGENTS.md 新增『貓咪日常梳毛與清潔』文章，更新索引並驗證。」

> 本站資訊僅供一般照護參考，不能取代獸醫診斷與治療。
