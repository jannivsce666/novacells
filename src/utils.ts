// utils.ts
export function clamp(v:number, lo:number, hi:number){ return Math.max(lo, Math.min(hi, v)); }
export function rand(a:number, b:number){ return a + Math.random()*(b-a); }
export function randInt(a:number, b:number){ return Math.floor(rand(a, b+1)); }
export function len(x:number,y:number){ return Math.hypot(x,y); }
export function norm(x:number,y:number){ const L=Math.hypot(x,y)||1; return {x:x/L,y:y/L}; }
export function sum<T>(arr:T[], f:(t:T)=>number){ let s=0; for(const it of arr) s+=f(it); return s; }

// A simple non-linear mapping similar to Agar.io
export function radiusFromMass(m:number): number {
  return Math.sqrt(Math.max(1, m)) * 1.2;
}

export function speedFromMass(m:number): number {
  // Requested curve: per 30Hz-tick speed ≈ K / sqrt(m), with caps
  // Convert to px/s (engine integrates with dt): multiply per-tick by 30
  // Caps: 0.35..6.5 px/tick => 10.5..195 px/s
  const V_MIN = 10.5;   // px/s
  const V_MAX = 195;    // px/s
  const BASE  = 1050;   // 35 px/tick * 30 = 1050 px/s
  const raw = BASE / Math.sqrt(Math.max(1, m));
  return clamp(raw, V_MIN, V_MAX);
}
