// Portada abstracta (placeholder cuando no hay imagen)
export function drawCover(canvas){
  if(!canvas) return;

  const dpr  = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.max(1, Math.floor(rect.width  * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  const ctx = canvas.getContext("2d");
  if(!ctx) return;

  // Fondo degradé
  const g = ctx.createLinearGradient(0,0,0,canvas.height);
  g.addColorStop(0, "#d9f6ef");
  g.addColorStop(1, "#c7ecf0");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Franja inferior
  ctx.fillStyle = "rgba(15,183,158,0.18)";
  ctx.fillRect(0, canvas.height*0.62, canvas.width, canvas.height*0.38);

  // Luces suaves
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  for(let i=0;i<3;i++){
    const w = canvas.width  * (0.18 + Math.random()*0.25);
    const h = canvas.height * (0.12 + Math.random()*0.18);
    const x = Math.random() * (canvas.width  - w);
    const y = Math.random() * (canvas.height*0.5 - h);
    ctx.beginPath(); ctx.ellipse(x+w/2, y+h/2, w/2, h/2, Math.random(), 0, Math.PI*2); ctx.fill();
  }
}
