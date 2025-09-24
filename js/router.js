import { $$ } from './utils.js';

export function switchTab(id){
  $$(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  $$(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab===id));
  if(location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
}
export function initRouter(){
  $$(".tab").forEach(btn=>btn.addEventListener("click", ()=> switchTab(btn.dataset.tab)));
  window.addEventListener('hashchange', ()=>{
    const id = location.hash.replace('#','');
    if(["discover","matches","mine","publish"].includes(id)) switchTab(id);
  });
  if(location.hash){
    const id = location.hash.replace('#','');
    if(["discover","matches","mine","publish"].includes(id)) switchTab(id);
  }
}
window.switchTab = switchTab;
