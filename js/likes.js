import { $, load, save, toast } from './utils.js';
import { K, SAMPLE_BOOKS } from './constants.js';

export function renderLikes(){
  const list = $("#likesList");
  if(!list) return;

  const liked   = load(K.liked, []);
  const passed  = load(K.passed, []);
  const matches = load(K.matches, []);
  const mine    = load(K.mine, []);

  // Simulación: si tenés libros propios, aumentamos las chances
  const pool = SAMPLE_BOOKS.map(b => mine.length ? ({...b, otherLikedYou: b.otherLikedYou || Math.random()<0.4}) : b);

  const incoming = pool.filter(b =>
    b.otherLikedYou &&
    !liked.includes(b.id) &&
    !passed.includes(b.id) &&
    !matches.find(m=>m.id===b.id)
  );

  list.innerHTML = "";
  if(incoming.length === 0){
    list.innerHTML = `<p class="helper">Aún no hay likes nuevos. ¡Seguí swippeando! 😉</p>`;
    return;
  }

  incoming.forEach(b=>{
    const el = document.createElement("div");
    el.className = "mini mcard";
    el.innerHTML = `
      ${b.img ? `<img src="${b.img}" alt="${b.title}" style="width:46px;height:62px;border-radius:8px;object-fit:cover;border:1px solid #e5e7eb;">`
               : `<div class="coverph">Libro</div>`}
      <div style="flex:1">
        <div style="font-weight:900">${b.title}</div>
        <div style="font-size:12px;color:#475569">de ${b.author} · ${b.city||"Zona a coordinar"}</div>
        <div style="font-size:12px;margin-top:6px;color:#475569">Este usuario te dio like 👀</div>
      </div>
      <div style="display:flex;flex-direction:column; gap:6px">
        <button class="btn primary" data-like="${b.id}">Me gusta también</button>
        <button class="btn ghost" data-skip="${b.id}">Descartar</button>
      </div>
    `;
    list.appendChild(el);

    el.querySelector(`[data-like="${b.id}"]`).addEventListener("click", ()=>{
      const L = load(K.liked, []);
      if(!L.includes(b.id)) { L.push(b.id); save(K.liked, L); }
      const M = load(K.matches, []);
      if(!M.find(m=>m.id===b.id)) { M.push(b); save(K.matches, M); }
      toast("¡Match al instante! 🎉");
      renderLikes();
    });
    el.querySelector(`[data-skip="${b.id}"]`).addEventListener("click", ()=>{
      const P = load(K.passed, []);
      if(!P.includes(b.id)) { P.push(b.id); save(K.passed, P); }
      toast("Descartado 👋");
      renderLikes();
    });
  });
}
