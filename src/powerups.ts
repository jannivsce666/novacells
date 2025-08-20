// powerups.ts
import type { PlayerState, PowerUp, PowerUpType, Virus } from './types';
import { rand, randInt } from './utils';

export const POWERUP_TYPES: PowerUpType[] = ['star','multishot','grow','magnet','lightning'];

function zoneCircle(worldW:number, worldH:number, pad:number){
  const cx = worldW/2, cy = worldH/2; const R = Math.max(0, Math.min(worldW, worldH)/2 - pad);
  return { cx, cy, R };
}

export function spawnPowerUps(worldW:number, worldH:number, count:number, pad:number = 0, viruses: Virus[] = []): PowerUp[]{
  const res: PowerUp[] = [];
  const { cx, cy, R } = zoneCircle(worldW, worldH, pad);
  const margin = 20; // stay inside circle
  const maxR = Math.max(0, R - margin);
  if (maxR <= 0) return res;

  const greens = viruses.filter(v => (v as any).kind === 'green');

  for(let i=0;i<count;i++){
    // Order: ['star','multishot','grow','magnet','lightning']
    // lightning same as multishot (35%), reduce star to 5%
    const type = weightedPick([0.05, 0.35, 0.25, 0.20, 0.35], POWERUP_TYPES);
    let x:number, y:number;
    if (type === 'multishot' && greens.length>0){
      const v = greens[Math.floor(Math.random()*greens.length)];
      const ang = Math.random() * Math.PI * 2;
      const dist = (v.radius ?? 40) + 5;
      x = v.pos.x + Math.cos(ang)*dist;
      y = v.pos.y + Math.sin(ang)*dist;
      // clamp into circle
      const dx = x - cx, dy = y - cy; const d = Math.hypot(dx,dy) || 1;
      if (d > maxR){ const s = maxR / d; x = cx + dx * s; y = cy + dy * s; }
    } else {
      const ang = Math.random() * Math.PI * 2; const r = Math.sqrt(Math.random()) * maxR;
      x = cx + Math.cos(ang)*r; y = cy + Math.sin(ang)*r;
    }
    res.push({ pos:{x, y}, type, ttl: rand(28,40) });
  }
  return res;
}

function weightedPick<T>(weights:number[], items:T[]): T{
  const r = Math.random() * weights.reduce((a,b)=>a+b,0);
  let acc=0;
  for(let i=0;i<weights.length;i++){ acc+=weights[i]; if (r<=acc) return items[i]; }
  return items[items.length-1];
}

export function drawPowerUp(ctx:CanvasRenderingContext2D, pu:PowerUp){
  ctx.save();
  ctx.translate(pu.pos.x, pu.pos.y);
  ctx.shadowColor = 'rgba(255,255,255,0.45)';
  ctx.shadowBlur = 10;
  if (pu.type==='star'){
    const r=12, r2=6;
    ctx.beginPath();
    for (let i=0;i<10;i++){
      const ang = (Math.PI*2/10)*i - Math.PI/2;
      const R = (i%2===0)? r : r2;
      const x = Math.cos(ang)*R, y=Math.sin(ang)*R;
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    const t = performance.now()/400;
    const hue = Math.floor((t*120)%360);
    ctx.fillStyle = `hsla(${hue},95%,60%,0.98)`; // rainbow
    ctx.fill();
  } else if (pu.type==='multishot'){
    ctx.rotate(Math.PI/8);
    ctx.fillStyle='rgba(200,220,255,0.98)';
    ctx.beginPath(); ctx.moveTo(12,0); ctx.lineTo(-8,6); ctx.lineTo(-8,-6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-8,0); ctx.lineTo(-14,4); ctx.lineTo(-14,-4); ctx.closePath();
    ctx.fillStyle='rgba(255,120,0,0.9)'; ctx.fill();
  } else if (pu.type==='grow'){
    ctx.beginPath(); ctx.arc(0,0,12,0,Math.PI*2); ctx.fillStyle='rgba(180,255,180,0.98)'; ctx.fill();
    ctx.fillStyle='rgba(40,120,40,1)'; ctx.fillRect(-2,-8,4,16); ctx.fillRect(-8,-2,16,4);
  } else if (pu.type==='magnet'){
    // horseshoe magnet icon
    const t = performance.now()/500;
    ctx.lineWidth = 4; ctx.strokeStyle='rgba(255,80,80,0.95)';
    ctx.beginPath(); ctx.arc(0,0,10,Math.PI*0.2, Math.PI*1.8); ctx.stroke();
    ctx.strokeStyle='rgba(120,160,255,0.95)';
    ctx.beginPath(); ctx.moveTo(-8,-6); ctx.lineTo(-4,-6); ctx.moveTo(-8,6); ctx.lineTo(-4,6); ctx.stroke();
    // field lines shimmer
    ctx.strokeStyle = `rgba(255,255,255,${0.6 + 0.3*Math.sin(t)})`;
    ctx.beginPath(); ctx.moveTo(6,-8); ctx.lineTo(12,-10); ctx.moveTo(6,8); ctx.lineTo(12,10); ctx.stroke();
  } else if (pu.type==='lightning'){
    // lightning bolt icon with electric shimmer
    const t = performance.now()/300;
    ctx.strokeStyle = `rgba(255,255,0,${0.9 + 0.1*Math.sin(t*4)})`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, -12);
    ctx.lineTo(2, -2);
    ctx.lineTo(-4, -2);
    ctx.lineTo(8, 12);
    ctx.lineTo(-2, 2);
    ctx.lineTo(4, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // electric sparks
    ctx.fillStyle = `rgba(255,255,255,${0.7 + 0.3*Math.sin(t*6)})`;
    for(let i=0; i<3; i++){
      const angle = (t*2 + i*2.1) % (Math.PI*2);
      const x = Math.cos(angle) * 16;
      const y = Math.sin(angle) * 16;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI*2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export function applyPowerUp(p:PlayerState, cIdx:number, pu:PowerUp){
  const c = p.cells[cIdx];
  if (!c) return;
  if (pu.type==='grow'){
    c.mass *= 1.15; c.radius = (Math.sqrt(Math.max(1,c.mass)) * 1.2);
  } else if (pu.type==='star'){
    p.invincibleTimer = Math.max(p.invincibleTimer, 30.0);
  } else if (pu.type==='multishot'){
    p.multishotTimer = Math.max(p.multishotTimer, 14.0);
  } else if (pu.type==='magnet'){
    p.magnetTimer = Math.max(p.magnetTimer || 0, 15.0);
  } else if (pu.type==='lightning'){
    // Only apply lightning if not already active and not invincible
    if ((p.lightningTimer || 0) <= 0 && p.invincibleTimer <= 0) {
      p.lightningTimer = 30.0;
      p.lightningMassDrainTimer = 0; // reset drain timer
    }
  }
}
