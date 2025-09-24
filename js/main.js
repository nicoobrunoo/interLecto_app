// main.js
import { loadDeck, topCard, swipe } from './deck.js';
import { renderMatches } from './matches.js';
import { renderMyBooks } from './mine.js';
import { initPublish } from './publish.js';
import { initDrawer } from './drawer.js';
import { renderLikes } from './likes.js';

// Cambio de pestañas
export function switchTab(tabId) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelector(`#${tabId}`)?.classList.add("active");

  document.querySelectorAll(".tabbar .tab").forEach(b => b.classList.remove("active"));
  const activeTabBtn = document.querySelector(`.tabbar .tab[data-tab='${tabId}']`);
  if (activeTabBtn) activeTabBtn.classList.add("active");

  if (tabId === "matches") renderMatches();
  if (tabId === "mine")    renderMyBooks();
  if (tabId === "likes")   renderLikes();
}
window.switchTab = switchTab;

document.addEventListener("DOMContentLoaded", () => {
  loadDeck();

  // Botones de swipe
  const press = (sel)=>{ const el=document.querySelector(sel); if(!el) return; el.addEventListener('click',()=>{ el.classList.add('pressed'); setTimeout(()=>el.classList.remove('pressed'),120);}); };
  press('#btnLike'); press('#btnNope'); press('#btnSuper');

  document.querySelector("#btnLike")?.addEventListener("click", () => { const card = topCard(); if (card) swipe(card, "like"); });
  document.querySelector("#btnNope")?.addEventListener("click", () => { const card = topCard(); if (card) swipe(card, "nope"); });
  document.querySelector("#btnSuper")?.addEventListener("click", () => { const card = topCard(); if (card) swipe(card, "super"); });

  // Tabs
  document.querySelectorAll(".tabbar .tab").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  initPublish();
  initDrawer();

  // Render inicial
  renderMatches();
  renderMyBooks();
});
