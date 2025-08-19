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
  // Simplified Agar-like curve: speed ≈ base / sqrt(mass), with hard caps
  // Units here are px/s; 1 tick ≈ 1/60s, so 6.5 px/tick ≈ 390 px/s
  const V_MIN = 24;    // ≈ 0.4 px/tick
  const V_MAX = 390;   // ≈ 6.5 px/tick
  const BASE  = 2100;  // tuned so m=100→~210 px/s, m=1000→~66 px/s, m=5000→~30 px/s
  const raw = BASE / Math.sqrt(Math.max(1, m));
  return clamp(raw, V_MIN, V_MAX);
}
