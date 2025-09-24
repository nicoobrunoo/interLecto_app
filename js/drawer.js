import { $, isPremium, setPremium, toast, cancelPremium } from './utils.js';

export function initDrawer() {
  const drawer   = $('#drawer');
  const backdrop = $('#drawerBackdrop');
  const openBtn  = $('#openDrawerBtn');
  const closeBtn = $('#closeDrawerBtn');

  if (!drawer || !backdrop || !openBtn || !closeBtn) {
    console.warn('[drawer] faltan elementos en el DOM');
    return;
  }

  const isOpen = () => drawer.classList.contains('open');

  const open = () => {
    drawer.classList.add('open');
    backdrop.classList.add('show');
    drawer.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    refreshPremiumUI();
    setTimeout(() => closeBtn.focus(), 0);
  };

  const close = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    drawer.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    openBtn.focus();
  };

  openBtn.addEventListener('click', () => (isOpen() ? close() : open()));
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) close(); });

  // Likes (gating)
  $('#goLikes')?.addEventListener('click', ()=>{
    if(!isPremium()){
      openPremiumModal();
      return;
    }
    window.switchTab?.('likes');
    close();
  });

  // CTA Premium dentro del drawer
  $('#goPremium')?.addEventListener('click', (e)=>{
    e.stopPropagation();
    openPremiumModal();
  });

  // Botón "Cancelar suscripción"
  $('#cancelPremium')?.addEventListener('click', ()=>{
    const res = cancelPremium();
    if (res.trimmed > 0){
      toast(`Premium cancelado. Se despublicaron ${res.trimmed} libro(s).`);
    }else{
      toast('Premium cancelado. Volvés al plan gratis.');
    }
    refreshPremiumUI();
  });

  // Modal Premium
  function openPremiumModal(){
    const m = $('#premiumModal');
    if(!m) {
      setPremium(true);
      toast("¡Premium activado! ✨");
      refreshPremiumUI();
      return;
    }
    m.classList.add('open');
  }
  window.closePremium = function(){
    $('#premiumModal')?.classList.remove('open');
  };
  $('#premiumYes')?.addEventListener('click', ()=>{
    setPremium(true);
    toast("¡Premium activado! ✨");
    refreshPremiumUI();
    window.closePremium();
  });
  $('#premiumNo')?.addEventListener('click', ()=> window.closePremium());

  function refreshPremiumUI(){
    const cta = $('#goPremium');
    const likesItem = $('#goLikes');
    const cancelBtn = $('#cancelPremium');
    if(!cta) return;

    if(isPremium()){
      cta.textContent = 'Premium activo ✓';
      cta.style.opacity = '0.85';
      cta.style.cursor  = 'default';
      likesItem?.classList.remove('disabled');
      if (cancelBtn) cancelBtn.style.display = 'inline-block';
    }else{
      cta.textContent = 'Activar Premium';
      cta.style.opacity = '1';
      cta.style.cursor  = 'pointer';
      likesItem?.classList.add('disabled');
      if (cancelBtn) cancelBtn.style.display = 'none';
    }
  }

  window.openDrawer  = open;
  window.closeDrawer = close;
}
