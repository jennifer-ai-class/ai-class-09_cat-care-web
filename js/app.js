(function(){
  'use strict';
  const categories={health:{label:'健康疾病',emoji:'🩺'},nutrition:{label:'飲食營養',emoji:'🥣'},behavior:{label:'行為觀察',emoji:'🐈'},'daily-care':{label:'日常照護',emoji:'🧶'}};
  const $=(s)=>document.querySelector(s);
  const state={articles:[],category:'all',query:'',lastFocus:null};
  const grid=$('#article-grid'),notice=$('#notice'),reader=$('#reader-view'),home=$('#home-view');
  function showNotice(text){notice.textContent=text;notice.hidden=!text;}
  function createCard(article){
    const card=document.createElement('div');card.className='article-card';
    const art=document.createElement('div');art.className=`card-art art-${article.category}`;
    const emoji=document.createElement('span');emoji.textContent=categories[article.category].emoji;art.append(emoji);
    const body=document.createElement('div');body.className='card-body';
    const badge=document.createElement('span');badge.className='category-pill';badge.textContent=categories[article.category].label;
    const title=document.createElement('h4');title.textContent=article.title;
    const summary=document.createElement('p');summary.textContent=article.summary;
    const bottom=document.createElement('div');bottom.className='card-bottom';
    const tags=document.createElement('span');tags.className='card-tags';tags.textContent=article.tags.map(t=>'#'+t).join('  ');
    const link=document.createElement('a');link.className='read-link';link.href='#article/'+encodeURIComponent(article.slug);link.textContent='閱讀文章 →';link.setAttribute('aria-label','閱讀文章：'+article.title);
    bottom.append(tags,link);body.append(badge,title,summary,bottom);card.append(art,body);return card;
  }
  function renderCards(){
    const q=state.query.toLocaleLowerCase('zh-Hant');
    const matched=state.articles.filter(a=>(state.category==='all'||a.category===state.category)&&[a.title,a.summary,...a.tags].some(s=>s.toLocaleLowerCase('zh-Hant').includes(q)));
    grid.replaceChildren(...matched.map(createCard));$('#result-count').textContent=`共 ${matched.length} 篇文章`;
    showNotice(matched.length?'':'目前沒有符合條件的文章，試試其他關鍵字或分類吧！');
  }
  function setCategory(category){state.category=category;document.querySelectorAll('[data-category]').forEach(b=>{const selected=b.dataset.category===category;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});renderCards();}
  function showHome(){home.hidden=false;reader.hidden=true;document.title='喵喵照護百科｜CatCare Wiki';if(state.lastFocus&&state.lastFocus.isConnected){state.lastFocus.focus({preventScroll:true});state.lastFocus=null;}}
  async function route(){
    const hash=decodeURIComponent(location.hash.slice(1));
    if(!hash.startsWith('article/')){showHome();if(hash==='about')$('#about').scrollIntoView();else if(hash==='explore')$('#explore').scrollIntoView();return;}
    const slug=hash.slice(8);const article=state.articles.find(a=>a.slug===slug);
    if(!article){showHome();showNotice('找不到這篇文章，請從文章列表重新選擇。');return;}
    home.hidden=true;reader.hidden=false;window.scrollTo(0,0);
    $('#reader-meta').textContent=categories[article.category].label+' · '+article.tags.map(t=>'#'+t).join(' ');
    const content=$('#reader-content'),status=$('#reader-status');content.replaceChildren();status.hidden=false;status.textContent='文章載入中…';
    document.title=article.title+'｜喵喵照護百科';
    try{const html=await window.CatCareArticles.loadArticle(article);if(location.hash.slice(1)!=='article/'+slug)return;content.innerHTML=html;status.hidden=true;const h1=content.querySelector('h1');if(h1){h1.id='reader-title';h1.tabIndex=-1;h1.focus({preventScroll:true});}}
    catch(e){status.textContent=e.message||'文章無法載入，請稍後再試。';}
  }
  document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.category)));
  $('#search').addEventListener('input',e=>{state.query=e.target.value.trim();renderCards();});
  grid.addEventListener('click',e=>{const a=e.target.closest('a.read-link');if(a)state.lastFocus=a;});
  $('#back-button').addEventListener('click',()=>{location.hash='explore';});
  window.addEventListener('hashchange',route);
  async function init(){try{state.articles=await window.CatCareArticles.loadIndex();renderCards();route();}catch(e){grid.replaceChildren();$('#result-count').textContent='載入失敗';showNotice('無法載入文章清單。請確認透過 HTTP 伺服器開啟網站，並重新整理頁面。');}}
  init();
})();
