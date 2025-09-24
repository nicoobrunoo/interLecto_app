import { $, load, save, initials, toast } from './utils.js';
import { K } from './constants.js';

export function renderMatches(){
  const list = $("#matchesList"); const matches = load(K.matches, []); list.innerHTML = "";
  if(matches.length===0){ list.innerHTML = `<p class="helper">Todavía no tenés coincidencias.</p>`; return; }
  matches.forEach(m=>{
    const contactHref = m.contact?.startsWith("http") || m.contact?.startsWith("mailto:")
      ? m.contact
      : (m.contact?.includes("@") ? `mailto:${m.contact}` : `https://wa.me/${m.contact.replace(/[^0-9+]/g,"")}`);
    const el = document.createElement("div"); el.className = "mini mcard";
    el.innerHTML = `
      <div class="avatar" style="width:44px;height:44px;border-radius:12px;background:#dfe7ef;display:grid;place-items:center;border:1px solid #cdd7e2;font-weight:900;font-size:18px;color:#1f2937">${initials(m.owner||'?')}</div>
      <div>
        <div style="font-weight:900">${m.title}</div>
        <div style="font-size:13px;color:#475569">con ${m.owner} · ${m.city||"Zona a coordinar"}</div>
      </div>
      <div class="actions" style="margin-left:auto; display:flex; gap:8px">
        <a class="btn contact" href="${contactHref}" target="_blank" rel="noopener">Contactar</a>
        <button class="btn remove" data-remove="${m.id}">Quitar</button>
      </div>`;
    list.appendChild(el);
    el.querySelector("[data-remove]").addEventListener("click", () => {
      const ms = load(K.matches, []).filter(x=>x.id!==m.id); save(K.matches, ms); renderMatches(); toast("Match quitado");
    });
  });
}
