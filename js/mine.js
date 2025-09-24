import { $, load, save, toast } from './utils.js';
import { K } from './constants.js';
import { startEdit } from './publish.js';
import { getPublishedIds, togglePublished } from './utils.js';

export function renderMyBooks(){
  const cont = $("#myBooks");
  const mine = load(K.mine, []);
  const publishedIds = getPublishedIds();

  cont.innerHTML = "";
  if (mine.length === 0){
    cont.innerHTML = `<p class="helper">Aún no agregaste libros. Cargá uno desde <strong>Publicar</strong>.</p>`;
    return;
  }

  mine.forEach((b, idx)=>{
    const isPub = publishedIds.includes(b.id);

    const el = document.createElement("div");
    el.className = "mini" + (isPub ? " published" : "");
    el.innerHTML = `
      ${b.img ? `<img src="${b.img}" alt="${b.title}" style="width:46px;height:62px;border-radius:8px;object-fit:cover;border:1px solid #e5e7eb;">`
               : `<div class="coverph">Libro</div>`}
      <div style="flex:1">
        <div style="font-weight:900">${b.title}</div>
        <div style="font-size:12px;color:#475569">de ${b.author} · ${b.city || "Zona a coordinar"}</div>
        <div style="font-size:12px;margin-top:6px;color:#475569"><strong>Busco:</strong> ${b.prefs || "A acordar"}</div>
      </div>
      <div style="display:flex;flex-direction:column; gap:6px">
        <button class="btn ${isPub ? 'remove' : 'publish'}" data-pub="${idx}">
          ${isPub ? 'Despublicar' : 'Publicar'}
        </button>
        <button class="btn" data-edit="${idx}">Editar</button>
        <button class="btn ghost" data-del="${idx}">Borrar</button>
      </div>
    `;

    cont.appendChild(el);

    // Publicar / Despublicar
    el.querySelector(`[data-pub="${idx}"]`).addEventListener("click", ()=>{
      const arr = load(K.mine, []);
      const id = arr[idx]?.id;
      const res = togglePublished(id);

      if (res.action === 'publish')  toast("Libro publicado ✅");
      if (res.action === 'unpublish') toast("Libro despublicado");
      if (res.action === 'error' && res.reason === 'limit')
        toast("Límite alcanzado. Con Premium podés publicar hasta 3 libros ✨");

      renderMyBooks();
    });

    // Borrar
    el.querySelector(`[data-del="${idx}"]`).addEventListener("click", ()=>{
      const arr = load(K.mine, []);
      const removed = arr.splice(idx, 1)[0];
      save(K.mine, arr);
      // Si estaba publicado, despublica implícitamente
      if (removed?.id) {
        const ids = getPublishedIds().filter(x => x !== removed.id);
        localStorage.setItem(K.publishedIds, JSON.stringify(ids));
      }
      renderMyBooks();
      toast("Libro borrado");
    });

    // Editar
    el.querySelector(`[data-edit="${idx}"]`).addEventListener("click", ()=>{
      const arr = load(K.mine, []);
      startEdit(arr[idx], idx);
      toast("Editando libro…");
    });
  });
}
