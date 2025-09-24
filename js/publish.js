import { $, load, save, toast, uid } from './utils.js';
import { K } from './constants.js';
import { renderMyBooks } from './mine.js';
import { loadDeck } from './deck.js';

const publishForm = $("#publishForm");

// 👉 referencias para imagen
const imgInput   = $("#pImage");
const imgPreview = $("#pPreview");

// buffer en memoria con la imagen actual (DataURL)
let currentImgData = null;

export function initPublish(){
  // preview de imagen al seleccionar archivo
  if (imgInput) {
    imgInput.addEventListener("change", (e)=>{
      const f = e.target.files?.[0];
      if (!f) {
        currentImgData = null;
        if (imgPreview) imgPreview.hidden = true;
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        currentImgData = reader.result;           // DataURL
        if (imgPreview) {
          imgPreview.src = currentImgData;
          imgPreview.hidden = false;
        }
      };
      reader.readAsDataURL(f);
    });
  }

  publishForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const mine = load(K.mine, []);
    const data = {
      id: uid(),
      title: $("#pTitle").value.trim(),
      author: $("#pAuthor").value.trim(),
      owner: $("#pOwner").value.trim(),
      contact: $("#pContact").value.trim(),
      prefs: $("#pPrefs").value.trim(),
      condition: $("#pCondition").value,
      city: $("#pCity").value.trim(),
      notes: $("#pNotes").value.trim(),
      img: null,                                  // se setea más abajo
    };

    // validaciones básicas
    if(!data.title || !data.author || !data.owner || !data.contact){
      toast("Completá los campos obligatorios");
      return;
    }

    const editIdx = publishForm.dataset.editIndex;
    if(editIdx !== undefined){
      // EDITAR
      const idx = Number(editIdx);
      const prev = mine[idx] || {};

      data.id  = prev.id || data.id;
      data.img = currentImgData !== null ? currentImgData : (prev.img || null);

      mine[idx] = data;
      delete publishForm.dataset.editIndex;
      toast("¡Libro actualizado!");
    }else{
      // ALTA
      data.img = currentImgData || null;
      mine.push(data);
      toast("¡Libro agregado!");
    }

    save(K.mine, mine);
    renderMyBooks();
    loadDeck();

    // limpiar formulario + estado imagen
    publishForm.reset();
    if (imgPreview) {
      imgPreview.src = "";
      imgPreview.hidden = true;
    }
    if (imgInput) imgInput.value = "";
    currentImgData = null;
  });

  $("#clearAll").addEventListener("click", ()=>{
    save(K.mine, []);
    renderMyBooks();
    loadDeck();
    toast("Eliminaste todos tus libros");
  });
}

// Cargar datos en el form para editar (incluida imagen + preview)
export function startEdit(x, idx){
  $("#pTitle").value      = x.title   || "";
  $("#pAuthor").value     = x.author  || "";
  $("#pOwner").value      = x.owner   || "";
  $("#pContact").value    = x.contact || "";
  $("#pPrefs").value      = x.prefs   || "";
  $("#pCondition").value  = x.condition || "Muy bueno";
  $("#pCity").value       = x.city    || "";
  $("#pNotes").value      = x.notes   || "";

  // imagen existente -> al buffer y a la vista previa
  currentImgData = x.img || null;
  if (imgPreview) {
    if (currentImgData) {
      imgPreview.src = currentImgData;
      imgPreview.hidden = false;
    } else {
      imgPreview.src = "";
      imgPreview.hidden = true;
    }
  }
  if (imgInput) imgInput.value = "";

  publishForm.dataset.editIndex = idx;

  // UX: llevar al usuario a la pestaña de Publicar y darle foco
  if (window.switchTab) window.switchTab('publish');
  setTimeout(()=> $("#pTitle").focus(), 50);
}
