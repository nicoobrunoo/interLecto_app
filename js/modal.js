// Modal de "match"
export function showMatch(book){
  const modal = document.getElementById("matchModal");
  const txt   = document.getElementById("matchText");
  if(!modal){ console.warn("showMatch(): falta #matchModal"); return; }

  if(txt && book){
    const who = book?.owner ? ` con ${book.owner}` : "";
    txt.innerHTML = `¡Hiciste match en <strong>${book.title}</strong>${who}!<br>Pueden coordinar desde <strong>Matches</strong>.`;
  }
  modal.classList.add("open");
}

export function closeMatch(){
  const modal = document.getElementById("matchModal");
  if(!modal) return;
  modal.classList.remove("open");
}

// Opcional: exponer global para onclick del HTML
window.closeMatch = closeMatch;
