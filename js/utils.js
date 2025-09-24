// Selectores
export const $  = (sel, ctx=document) => ctx.querySelector(sel);
export const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Toast
export function toast(msg){
  const el = $("#toast"); if(!el) return;
  el.textContent = msg;
  el.classList.remove("show"); el.offsetHeight;
  el.classList.add("show");
}

// Random
export const rand = (min, max) => Math.floor(Math.random()*(max-min+1))+min;

// LocalStorage seguro
function safeGet(k, fallback){ try{ const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; }catch{ return fallback; } }
function safeSet(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }

export const load = (k, fallback=[]) => safeGet(k, fallback);
export const save = (k, val) => safeSet(k, val);

// Debounce
export function debounce(fn, wait=200){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); }; }

// UID
export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Iniciales
export function initials(name=""){ const parts = String(name).trim().split(/\s+/).slice(0,2); return parts.map(p=>p[0]?.toUpperCase()||"").join("")||"?"; }

// ===== Premium helpers =====
import { K } from './constants.js';

export const isPremium  = () => !!load(K.premium, false);
export const setPremium = (v) => save(K.premium, !!v);

// ===== Publicados (con soporte a legado) =====
export function getPublishedIds(){
  const arr = load(K.publishedIds, null);
  if (Array.isArray(arr)) return arr;
  const legacy = (typeof localStorage !== "undefined") ? localStorage.getItem(K.published) : null;
  if (legacy) return [legacy];
  return [];
}

export function setPublishedIds(ids=[]){
  save(K.publishedIds, Array.from(new Set(ids)));
  try{ localStorage.removeItem(K.published); }catch{}
}

/**
 * Publica/despublica respetando límites:
 * - Sin premium: máx 1 publicado
 * - Con premium: máx 3 publicados
 */
export function togglePublished(id){
  if(!id) return {action:"error", reason:"invalid"};
  const current = getPublishedIds();
  const has = current.includes(id);
  if (has){
    setPublishedIds(current.filter(x => x !== id));
    return { action:"unpublish" };
  }
  const limit = isPremium() ? 3 : 1;
  if (current.length >= limit){
    return { action:"error", reason:"limit" };
  }
  current.push(id);
  setPublishedIds(current);
  return { action:"publish" };
}

/** Cancela Premium y aplica restricciones gratuitas.
 *  Si hay >1 publicados, deja sólo el primero y despublica el resto. */
export function cancelPremium(){
  setPremium(false);
  const current = getPublishedIds();
  if (current.length > 1){
    const keep = current[0];
    setPublishedIds([keep]);
    return { trimmed: current.length - 1 };
  }
  return { trimmed: 0 };
}
