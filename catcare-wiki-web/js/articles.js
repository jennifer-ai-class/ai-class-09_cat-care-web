/* Markdown renderer: intentionally supports a small, safe subset. All output is escaped first. */
(function () {
  'use strict';
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = (raw) => {
    try { const u = new URL(raw); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; }
    catch { return null; }
  };
  function inline(text) {
    // Links are only enabled for http(s), never javascript: or data: URLs.
    const tokens = [];
    const placeholder = (html) => { const id = tokens.length; tokens.push(html); return `ZZLINKTOKEN${id}ZZ`; };
    let result = String(text).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (whole, label, url) => {
      const checked = safeUrl(url);
      return checked ? placeholder(`<a href="${escapeHtml(checked)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`) : whole;
    });
    result = escapeHtml(result).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
    return result.replace(/ZZLINKTOKEN(\d+)ZZ/g, (_, i) => tokens[Number(i)] || '');
  }
  function renderMarkdown(markdown) {
    const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
    const out = []; let paragraph = []; let list = null; let quote = [];
    const flushParagraph = () => { if (paragraph.length) { out.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph=[]; } };
    const flushList = () => { if(list){out.push(`</${list}>`);list=null;} };
    const flushQuote = () => { if(quote.length){out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);quote=[];} };
    for (const raw of lines) {
      const s = raw.trim();
      if(!s){flushParagraph();flushList();flushQuote();continue;}
      const heading = /^(#{1,3})\s+(.+)$/.exec(s);
      if(heading){flushParagraph();flushList();flushQuote();const level=heading[1].length;out.push(`<h${level}>${inline(heading[2])}</h${level}>`);continue;}
      const bullet = /^[-*]\s+(.+)$/.exec(s);
      const numbered = /^\d+\.\s+(.+)$/.exec(s);
      if(bullet||numbered){flushParagraph();flushQuote();const type=bullet?'ul':'ol';if(list!==type){flushList();out.push(`<${type}>`);list=type;}out.push(`<li>${inline((bullet||numbered)[1])}</li>`);continue;}
      if(s.startsWith('> ')){flushParagraph();flushList();quote.push(s.slice(2));continue;}
      flushList();flushQuote();paragraph.push(s);
    }
    flushParagraph();flushList();flushQuote();return out.join('\n');
  }
  async function loadIndex() {
    const response=await fetch('data/articles.json',{cache:'no-cache'});
    if(!response.ok)throw new Error('文章清單讀取失敗');
    const articles=await response.json();
    if(!Array.isArray(articles))throw new Error('文章索引格式錯誤');
    const allowed=new Set(['health','nutrition','behavior','daily-care']);
    const seen=new Set();
    return articles.filter((a)=>{
      if(!a||!(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).test(a.slug)||seen.has(a.slug)||!allowed.has(a.category)||typeof a.title!=='string'||typeof a.summary!=='string'||!Array.isArray(a.tags)||!a.tags.every(t=>typeof t==='string')||a.file!==`articles/${a.slug}.md`)return false;
      seen.add(a.slug);return true;
    });
  }
  async function loadArticle(article){
    const response=await fetch(article.file,{cache:'no-cache'});
    if(!response.ok)throw new Error('文章讀取失敗，請稍後重試。');
    return renderMarkdown(await response.text());
  }
  window.CatCareArticles={loadIndex,loadArticle};
})();
