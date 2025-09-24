import { $, $$, toast, rand, save, load, debounce } from './utils.js';
import { SAMPLE_BOOKS, K } from './constants.js';
import { drawCover } from './covers.js';
import { showMatch } from './modal.js';
import { renderMatches } from './matches.js';

let deck = [];
let isDragging = false;
let startX=0, startY=0, currentX=0, currentY=0;
let activeCard = null;

function burst(whereEl, kind="g"){
  const host = document.createElement("div");
  host.className = "burst";
  const bbox = whereEl.getBoundingClientRect();
  const cx = bbox.width/2, cy = bbox.height*0.25;
  for(let i=0;i<12;i++){
    const dot = document.createElement("i");
    dot.className = kind;
    const ang = (Math.PI*2/12)*i;
    const radius = 80 + rand(-18,18);
    const tx = Math.cos(ang)*radius, ty = Math.sin(ang)*radius;
    dot.style.left = cx+"px"; dot.style.top = cy+"px";
    dot.style.setProperty("--tx", `${tx}px`);
    dot.style.setProperty("--ty", `${ty}px`);
    host.appendChild(dot);
  }
  whereEl.appendChild(host);
  setTimeout(()=>host.remove(), 650);
}

export function loadDeck(){
  const liked = load(K.liked, []), passed = load(K.passed, []), mine = load(K.mine, []);
  let base = SAMPLE_BOOKS.filter(b => !liked.includes(b.id) && !passed.includes(b.id));
  if(mine.length>0){ base = base.map(b => ({...b, otherLikedYou: b.otherLikedYou || Math.random() < 0.3})); }
  for(let i=base.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [base[i],base[j]]=[base[j],base[i]]; }
  deck = base; save(K.deck, deck.map(b=>b.id)); renderStack();
}

function renderStack(){
  const stack = $("#cardStack");
  stack.querySelectorAll(".card").forEach(el=>el.remove());

  if(deck.length===0){
    $("#emptyState").style.display="block";
    return;
  }
  $("#emptyState").style.display="none";

  deck.forEach((book, idx) => {
    const el = document.createElement("article");
    el.className = "card"; el.style.zIndex = 10+idx; el.dataset.id = book.id;

    const hasImg = !!book.img;
    el.innerHTML = `
      <div class="overlay"><div class="badge like">MATCH</div><div class="badge nope">NOPE</div></div>

      <div class="cover">
        ${hasImg
          ? `<img class="cover-img" src="${book.img}" alt="Portada ${book.title}">`
          : `<canvas class="cover-canvas"></canvas>`
        }
        <span class="chip">${book.condition || ""}</span>
      </div>

      <div class="info">
        <div class="title">${book.title}</div>
        <div class="meta">de ${book.author} · ${book.city ?? "Zona a coordinar"}</div>

        <div class="owner">
          <div class="avatar">${(book.owner||'')[0]?.toUpperCase()||'?'}</div>
          <div>Dueño/a: <strong>${book.owner||""}</strong></div>
        </div>

        <div class="prefs"><strong>Quiere:</strong> ${book.prefs || "A acordar"}</div>

        <div class="tags">${(book.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      </div>`;

    stack.appendChild(el);
    if (!hasImg){
      const c = el.querySelector(".cover-canvas");
      setTimeout(()=>drawCover(c), 0);
    }
    enableDrag(el);
  });
}
export function topCard(){ const cards = $$("#cardStack .card"); return cards[cards.length-1] || null; }

window.addEventListener('resize', debounce(()=>{
  document.querySelectorAll('.cover-canvas').forEach(c=> drawCover(c));
}, 150));

function enableDrag(el){ el.addEventListener("pointerdown", onDown); el.addEventListener("pointerup", onUp); el.addEventListener("pointercancel", onUp); el.addEventListener("pointermove", onMove); }
function onDown(e){ if(!e.isPrimary) return; if(e.currentTarget !== topCard()) return; isDragging = true; activeCard = e.currentTarget; startX = e.clientX; startY = e.clientY; activeCard.setPointerCapture(e.pointerId); }
function onMove(e){
  if(!isDragging || !activeCard) return;
  currentX = e.clientX - startX; currentY = e.clientY - startY; const rot = currentX/18;
  activeCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rot}deg)`;
  const likeBadge = activeCard.querySelector(".badge.like"); const nopeBadge = activeCard.querySelector(".badge.nope");
  likeBadge.style.opacity = Math.min(1, Math.max(0, currentX/120));
  nopeBadge.style.opacity = Math.min(1, Math.max(0, -currentX/120));
}
function onUp(e){
  if(!isDragging || !activeCard) return; isDragging = false;
  const dx = currentX; const threshold = 110; const dir = dx > threshold ? "like" : dx < -threshold ? "nope" : "reset";
  try{ activeCard.releasePointerCapture(e.pointerId); }catch{}
  if(dir==="reset"){
    activeCard.style.transition = "transform .22s ease"; activeCard.style.transform = "";
    activeCard.querySelector(".badge.like").style.opacity = 0; activeCard.querySelector(".badge.nope").style.opacity = 0;
    setTimeout(()=>activeCard && (activeCard.style.transition=""), 220);
  }else{ swipe(activeCard, dir); }
  activeCard = null; currentX=0; currentY=0;
}

export function swipe(cardEl, action){
  const id = cardEl.dataset.id; const book = deck.find(b=>b.id===id);
  const toX = action==="like" ? window.innerWidth*1.2 : -window.innerWidth*1.2;
  if(action==="like"){ cardEl.classList.add("is-like"); burst(cardEl, "g"); }
  if(action==="nope"){ cardEl.classList.add("is-nope"); burst(cardEl, "r"); }
  if(action==="super"){ cardEl.classList.add("is-super"); burst(cardEl, "a"); }
  cardEl.style.transition = "transform .35s ease";
  cardEl.style.transform = action==="super"
    ? `translate(0px, -${window.innerHeight}px) rotate(0deg)`
    : `translate(${toX}px, ${rand(-30,30)}px) rotate(${action==="like"?18:-18}deg)`;
  setTimeout(()=>{
    cardEl.remove();
    if(action==="like" || action==="super") likeBook(book, action==="super");
    if(action==="nope") passBook(book);
    deck = deck.filter(b=>b.id!==id); if(deck.length===0) $("#emptyState").style.display="block";
  }, 260);
}

function likeBook(book, superlike=false){
  const liked = load(K.liked, []); if(!liked.includes(book.id)){ liked.push(book.id); save(K.liked, liked); }
  if(book.otherLikedYou || superlike){
    const matches = load(K.matches, []); if(!matches.find(m=>m.id===book.id)){ matches.push(book); save(K.matches, matches); showMatch(book); renderMatches(); }
    else toast("Ya era un match ✨");
  } else toast("Guardado en Me gusta ❤️");
}
function passBook(book){ const passed = load(K.passed, []); if(!passed.includes(book.id)){ passed.push(book.id); save(K.passed, passed); } toast("Descartado 👋"); }

export function resetDeck(){ save(K.liked, []); save(K.passed, []); loadDeck(); toast("Reiniciaste el mazo"); }
window.resetDeck = resetDeck;
