// game.ts (modular, with star effect, rainbow border, better merging, shorter rockets, scoreboard)
// ------------------------------------------------------------------------------------------------------------------
import { clamp, rand, randInt, norm, radiusFromMass, speedFromMass, sum } from './utils';
import type { PlayerState, Pellet, Virus, PowerUp, PowerUpType, Bullet, Cell, PlayerConfig } from './types';
import type { InputState } from './input';
import { LevelDesign } from './LevelDesign';
import { makeSkinCanvas, patternFromCanvas, randomSkinCanvas } from './skins';
import { spawnPowerUps, drawPowerUp, applyPowerUp } from './powerups';
import { updateBots, BotParams } from './bots';
import { newMatchTracker, addXp } from './xp';

// --- Agar.io-nahe Tuning (Split/Impulse/Merge) ---
const SPLIT_DIST_MIN = 100;      // minimale Split-Flugdistanz
const SPLIT_DIST_MAX = 200;      // maximale Split-Flugdistanz (wichtig!)
const SPLIT_IMPULSE_SEC = 0.10;  // Dauer des starken Anfangsimpulses (s)
const SPLIT_DAMP_STRONG = 0.85;  // Dämpfung pro Tick in Impulsphase
const SPLIT_DAMP_SOFT   = 0.92;  // Dämpfung pro Tick nach Impulsphase
const SPLIT_SPEED_CAP_BASE = 450;   // Grund-Geschwindigkeitslimit
const SPLIT_SPEED_CAP_K    = 1600;  // +K/sqrt(mass) Anteil
const SPLIT_RECOIL_SOURCE  = 100;   // Rückstoß der Quellzelle (kleiner als vorher)

const MERGE_COOLDOWN_BASE = 4.0;    // s, Grund-Cooldown
const MERGE_COOLDOWN_SQRT = 0.045;  // s pro sqrt(mass)
const MERGE_NEAR_FACTOR   = 1.06;   // „Annäherungszone"
const MERGE_TRIGGER_FACTOR= 0.72;   // tiefe Überdeckung = Merge
const MERGE_PULL_NEAR     = 0.75;   // Stärke des sanften Zugs (0..1) pro Tick, wenn nah & CD=0
const MERGE_PULL_OVERLAP  = 0.90;   // stärkerer Zug bei Überdeckung & CD=0
const MAX_LEASH_DISTANCE  = 150;    // px, maximale Entfernung zwischen Zellen
const FORCE_MERGE_TIME    = 15.0;   // s, nach dieser Zeit forciertes Merge

// ---- Cell helper ----
function makeCell(m:number, pos:{x:number,y:number}, vel={x:0,y:0}): Cell {
  return { pos:{...pos}, vel:{...vel}, mass:m, radius: radiusFromMass(m), mergeCooldown: 6.0 };
}

// Circle zone helpers
function zoneCircle(w:number, h:number, pad:number){
  const cx = w/2, cy = h/2; const R = Math.max(0, Math.min(w,h)/2 - pad);
  return { cx, cy, R };
}

// For circular world: signed distance to boundary (inside distance)
function distToEdgePos(x:number, y:number, w:number, h:number, pad:number){
  const { cx, cy, R } = zoneCircle(w,h,pad);
  const d = Math.hypot(x - cx, y - cy);
  return R - d; // >0 inside, 0 at edge, <0 outside
}

// Score a candidate spawn position based on distance from other cells/viruses and circle edge
function spawnSafetyScore(x:number, y:number, players: Map<string, PlayerState>, viruses: Virus[], w:number, h:number, pad:number){
  let minCell = Infinity;
  for (const [, p] of players){
    if (!p.alive) continue;
    for (const c of p.cells){
      const d = Math.hypot(x - c.pos.x, y - c.pos.y) - c.radius;
      if (d < minCell) minCell = d;
    }
  }
  let minVirus = Infinity;
  for (const v of viruses){
    const d = Math.hypot(x - v.pos.x, y - v.pos.y) - v.radius*1.2;
    if (d < minVirus) minVirus = d;
  }
  const edge = distToEdgePos(x, y, w, h, pad);
  return Math.min(minCell, minVirus, edge*1.1);
}

/**
 * Agar.io Fress-Logik:
 * - Eine Zelle darf eine andere nur fressen, wenn sie mindestens 25% größer ist.
 *   → mathematisch: mass(A) >= 1.25 * mass(B)
 * - Außerdem muss die große Zelle den Mittelpunkt der kleineren vollständig einschließen.
 *   → heißt: Distanz der Mittelpunkte + Radius(B) <= Radius(A)
 *
 * Diese Funktion prüft beide Bedingungen.
 */
function canEat(
  eater: { x: number; y: number; r: number; m: number },
  target: { x: number; y: number; r: number; m: number },
  eaterLightningActive: boolean = false
): boolean {
  // Lightning power-up restriction: can only eat opponents at least 20% smaller
  let massThreshold = 1.25; // Normal: at least 25% more mass required
  if (eaterLightningActive) {
    massThreshold = 1.2; // Lightning: target must be at least 20% smaller (eater needs 1.2x target mass)
  }
  
  // Größenregel: mindestens 25% mehr Masse (oder 20% bei Lightning)
  if (eater.m < target.m * massThreshold) return false;

  // Mittelpunkt-Abstand berechnen
  const dx = eater.x - target.x;
  const dy = eater.y - target.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Kleiner Spielraum (numerische Stabilität / Frame-Schritte), damit es nicht wackelt
  const absorbMargin = Math.min(8, Math.max(2, target.r * 0.08));

  // Ziel komplett in Reichweite (mit kleinem Toleranzrand)?
  return dist + target.r <= eater.r + absorbMargin;
}

// Types (reintroduced)
type GameOverStats = {
  survivedMs: number;
  survivedSec: number;
  maxMass: number;
  score: number;
  rank: number;
  xpBreakdown?: any; // XP breakdown from the match
};

type RocketBullet = Bullet & {
  kind?: "rocket" | "hazard";
  rangeLeft?: number;
  explodeAtEnd?: boolean;
};

type Particle = {
  pos:{x:number;y:number};
  vel:{x:number;y:number};
  life:number; // 0..1
  size:number;
  hue:number;
  type:"spark"|"smoke"|"shock"|"streak";
  fade:number;
};

const BOT_NAMES = [ "Neo","Luna","Hex","Bär","Scorp","Vox","Zed","Milo","Rex","Kiro","Yui","Ivy","Sol","Jax",
  "Kai","Nox","Nia","Rio","Aki","Mika","Orion","Zoe","Uma","Pax","Lux","Jin","Noa","Fox" ];

function pickName(){ return BOT_NAMES[randInt(0, BOT_NAMES.length-1)]; }

export class Game {
  // Replace the stubbed methods with working implementations
  draw(elapsed: number) {
    const { ctx, canvas } = this;
    const me = this.players.get(this.me);
    if (!me || !me.alive || me.cells.length === 0) {
      // Clear to background when dead
      ctx.save();
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      this.level.drawBackgroundScreen(ctx);
      ctx.restore();
      return;
    }

    // Camera target = mass-weighted center of own cells
    let cx=0, cy=0, M=0;
    for (const c of me.cells){ cx += c.pos.x * c.mass; cy += c.pos.y * c.mass; M += c.mass; }
    const center = { x: cx/Math.max(1,M), y: cy/Math.max(1,M) };

    // Zoom: based on total mass and piece count, plus user wheel bias
    const totalMass = Math.max(this.totalMass(me), 100);
    const baseScale = Math.min(canvas.width/1920, canvas.height/1080);
    const pieces = Math.max(1, me.cells.length);
    const massFactor = Math.pow(totalMass / 100, 0.12);
    let targetZoomRaw = 1.9 / (massFactor * (1 + (pieces - 1) * 0.05));
    targetZoomRaw += this.zoomBias;
    const targetZoom = clamp(targetZoomRaw, 1.2, 2.6);
    this.currentZoom = this.currentZoom + (targetZoom - this.currentZoom) * 0.08;
    const scale = baseScale * this.currentZoom;

    // Frame start
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    // Skip background on mobile for performance
    if (!this.simplifiedRendering) {
      this.level.drawBackgroundScreen(ctx);
    }

    // World camera
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(scale, scale);
    ctx.translate(-center.x, -center.y);

    // Rainbow circle border (skip on mobile if simplified rendering)
    const pad = this.outsidePad(elapsed);
    if (!this.simplifiedRendering) {
      this.level.drawRainbowBorder?.(ctx as any, pad, this.world as any);
    }

    // Pellets
    for (const pl of this.pellets){
      ctx.beginPath();
      ctx.arc(pl.pos.x, pl.pos.y, Math.max(2, Math.sqrt(pl.mass)*0.8), 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.fill();
    }

    // Viruses
    for (const v of this.viruses){
      const vv:any = v;
      if (vv.kind === 'blackhole') {
        // Blackhole rendering with cool effects
        const time = performance.now() / 1000;
        const pulseScale = 1 + Math.sin(time * 3) * 0.1;
        const rotationSpeed = vv.imploding ? 8.0 : 2.0;
        
        ctx.save();
        ctx.translate(vv.pos.x, vv.pos.y);
        ctx.rotate(time * rotationSpeed);
        
        // Event horizon (outer dark ring)
        const eventHorizonRadius = vv.radius * pulseScale;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, eventHorizonRadius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.6, 'rgba(20, 0, 40, 0.9)');
        gradient.addColorStop(0.8, 'rgba(80, 20, 120, 0.6)');
        gradient.addColorStop(1, 'rgba(150, 80, 200, 0.3)');
        
        ctx.beginPath();
        ctx.arc(0, 0, eventHorizonRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Accretion disk (swirling matter) - simplified on mobile
        const diskParticles = this.isMobile ? 6 : 12;
        for (let i = 0; i < diskParticles; i++) {
          const angle = (i / diskParticles) * Math.PI * 2 + time * 2;
          const radius = eventHorizonRadius * (0.7 + Math.sin(time * 4 + i) * 0.2);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const size = this.isMobile ? 2 + Math.sin(time * 6 + i) * 1 : 3 + Math.sin(time * 6 + i) * 2;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${270 + i * 10}, 80%, 60%, ${0.8 - (radius / eventHorizonRadius) * 0.5})`;
          ctx.fill();
        }
        
        // Central singularity
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fill();
        
        // Gravitational lensing effect (outer glow) - skip on mobile
        if (!this.mobileNoShadows) {
          ctx.shadowColor = 'rgba(150, 80, 200, 0.8)';
          ctx.shadowBlur = 40;
          ctx.beginPath();
          ctx.arc(0, 0, eventHorizonRadius * 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(150, 80, 200, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        // Implosion effect
        if (vv.imploding && !this.mobileNoShadows) {
          const implodeProgress = vv.implodeProgress || 0;
          ctx.shadowBlur = 60;
          ctx.shadowColor = 'rgba(255, 255, 255, 1)';
          ctx.beginPath();
          ctx.arc(0, 0, eventHorizonRadius * (1 - implodeProgress), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${implodeProgress})`;
          ctx.lineWidth = 6;
          ctx.stroke();
        }
        
        ctx.restore();
      } else {
        const isRed = vv.kind === 'red';
        const spikes = isRed ? 18 : 14;
        const rOuter = vv.radius;
        const rInner = vv.radius * 0.64;
        const ang0 = vv.ang ?? 0;
        ctx.save();
        ctx.translate(vv.pos.x, vv.pos.y);
        ctx.rotate(ang0);
        ctx.beginPath();
        for (let i=0;i<spikes*2;i++){
          const isOuter = (i%2)===0; const R = isOuter? rOuter : rInner;
          const a = (Math.PI*2/(spikes*2))*i; const x=Math.cos(a)*R, y=Math.sin(a)*R;
          if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.closePath();
        if (isRed){ ctx.shadowColor='rgba(255,60,60,0.55)'; ctx.shadowBlur=18; ctx.fillStyle='rgba(255,60,60,0.92)'; ctx.strokeStyle='rgba(120,0,0,0.95)'; }
        else { ctx.shadowColor='rgba(0,255,160,0.45)'; ctx.shadowBlur=14; ctx.fillStyle='rgba(66,245,152,0.9)'; ctx.strokeStyle='rgba(0,120,60,0.9)'; }
        ctx.lineWidth = 3; ctx.fill(); ctx.stroke();
        // core
        ctx.beginPath(); ctx.arc(0,0, rInner*0.45, 0, Math.PI*2); ctx.fillStyle = isRed? 'rgba(255,120,120,0.55)' : 'rgba(120,255,200,0.45)'; ctx.fill();
        ctx.restore();
      }
    }

    // PowerUps
    for (const pu of this.powerups){ drawPowerUp(ctx, pu); }

    // Bullets
    for (const b of this.bullets){
      if (b.kind==='rocket'){
        ctx.save(); ctx.translate(b.pos.x, b.pos.y); const ang=Math.atan2(b.vel.y, b.vel.x); ctx.rotate(ang);
        ctx.fillStyle='rgba(200,220,255,0.95)'; ctx.beginPath(); ctx.moveTo(8,0); ctx.lineTo(-6,4); ctx.lineTo(-6,-4); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-6,0); ctx.lineTo(-12,3); ctx.lineTo(-12,-3); ctx.closePath(); ctx.fillStyle='rgba(255,120,0,0.9)'; ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath(); ctx.arc(b.pos.x, b.pos.y, Math.sqrt(b.mass), 0, Math.PI*2);
        ctx.fillStyle='rgba(255,120,120,0.95)'; ctx.fill();
      }
    }

    // Players with skin fill
    for (const [,p] of this.players){
      if (!p.alive) continue;
      for (const c of p.cells){
        ctx.save();
        if (p.invincibleTimer>0){ ctx.shadowColor='rgba(255,215,0,0.9)'; ctx.shadowBlur=30; }
        ctx.beginPath(); ctx.arc(c.pos.x, c.pos.y, c.radius, 0, Math.PI*2);
        const sc = (p as any).skinCanvas as HTMLCanvasElement | undefined;
        if (sc){ ctx.save(); ctx.clip(); ctx.drawImage(sc, c.pos.x - c.radius, c.pos.y - c.radius, c.radius*2, c.radius*2); ctx.restore(); }
        else { ctx.fillStyle = (p.skinPattern as any) || p.color; ctx.fill(); }
        ctx.lineWidth = 3; ctx.strokeStyle = p.invincibleTimer>0 ? 'rgba(255,215,0,0.9)' : 'rgba(0,0,0,0.35)'; ctx.stroke();
        ctx.restore();
      }
      const lc = this.largestCell(p);
      ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.font='600 14px system-ui, sans-serif'; ctx.textAlign='center';
      ctx.fillText(`${p.name ?? ''} ${Math.round(this.totalMass(p))}`, lc.pos.x, lc.pos.y - lc.radius - 10);
    }

    // Particles
    for (const p of this.particles){
      if (p.type==='spark'){
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = `hsla(${p.hue},100%,60%,${0.9*p.life})`;
        ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI*2); ctx.fill(); ctx.restore();
      } else if (p.type==='shock'){
        ctx.save(); const r = (1-p.life)*120 + 8; ctx.strokeStyle = `rgba(200,220,255,${p.life*0.5})`; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, r, 0, Math.PI*2); ctx.stroke(); ctx.restore();
      } else if (p.type==='streak'){
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life*0.8); ctx.strokeStyle = `hsla(${p.hue},100%,70%,${0.85*p.life})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(p.pos.x - p.vel.x*0.05, p.pos.y - p.vel.y*0.05); ctx.lineTo(p.pos.x, p.pos.y); ctx.stroke(); ctx.restore();
      } else if (p.type==='smoke'){
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life*0.6); ctx.fillStyle = 'rgba(180,200,255,0.3)';
        ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, p.size*1.2, 0, Math.PI*2); ctx.fill(); ctx.restore();
      }
    }

    // End camera and vignette-like overlay
    ctx.restore();
    // soft vignette
    const g = ctx.createRadialGradient(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)*0.6, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)*0.9);
    g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.35)'); ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.restore();
  }

  step(dtMs: number, input: InputState, elapsed: number) {
    const dt = dtMs/1000;
    
    // Performance monitoring for mobile devices
    if (this.isMobile) {
      const now = performance.now();
      if (this.lastFrameTime > 0) {
        this.frameTime = now - this.lastFrameTime;
        this.fpsHistory.push(1000 / this.frameTime);
        
        // Keep only last 60 frames for averaging
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift();
        }
        
        // Auto-adjust performance if FPS drops below 45 consistently
        if (this.fpsHistory.length >= 30 && !this.performanceAdjusted) {
          const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
          if (avgFps < 45) {
            this.autoAdjustPerformance();
            this.performanceAdjusted = true;
            console.log('🔧 Auto-adjusted performance for mobile device');
          }
        }
      }
      this.lastFrameTime = now;
    }
    
    const zonePad = this.outsidePad(elapsed);
    const { cx, cy, R } = zoneCircle(this.world.w, this.world.h, zonePad);
    this.lastZoneR = R;
    this.frameIndex++;

    // zoom bias (handled by input wheel)
    const ticks = (input as any).wheelTicks || 0;
    if (ticks !== 0) {
      this.zoomBias = Math.max(-0.8, Math.min(0.8, this.zoomBias - Math.sign(ticks) * 0.06));
      (input as any).wheelTicks = 0;
    }

    // Stats
    const me = this.players.get(this.me);
    if (me?.alive) {
      this.meSurvivalMs += dtMs;
      this.meMaxMass = Math.max(this.meMaxMass, this.totalMass(me));
      
      // XP tracking: time survival and mass growth
      this.matchTracker.addTime(dt); // Track survival time for XP
      const currentMass = this.totalMass(me);
      if (currentMass > this.lastTrackedMass) {
        this.matchTracker.addMass(currentMass - this.lastTrackedMass);
        this.lastTrackedMass = currentMass;
      }
    }

    // Speed boost taps (mouse left or mobile speed button)
    if (me?.alive) {
      const taps:number = (input as any).speedTapCount || 0;
      if (taps > 0) {
        me.speedBoostTimer = Math.min(2.0, (me.speedBoostTimer || 0) + 0.35);
        const cost = 1;
        let remaining = cost;
        me.cells.sort((a,b)=>a.mass-b.mass);
        for (const c of me.cells){
          if (remaining<=0) break;
          const take = Math.min(c.mass-1, remaining);
          if (take>0){ c.mass -= take; c.radius = radiusFromMass(c.mass); remaining -= take; }
        }
        (input as any).speedTapCount = Math.max(0, taps - 1);
      }
    }

    // timers
    for (const [, p] of this.players){
      if (!p.alive) continue;
      p.invincibleTimer = Math.max(0, p.invincibleTimer - dt);
      p.multishotTimer  = Math.max(0, p.multishotTimer  - dt);
      p.speedBoostTimer = Math.max(0, (p.speedBoostTimer||0) - dt);
      (p as any).magnetTimer = Math.max(0, ((p as any).magnetTimer||0) - dt);
      // Lightning timer and mass drain
      if ((p as any).lightningTimer !== undefined) {
        (p as any).lightningTimer = Math.max(0, ((p as any).lightningTimer||0) - dt);
        if ((p as any).lightningTimer > 0) {
          // Mass drain every 2 seconds
          (p as any).lightningMassDrainTimer = ((p as any).lightningMassDrainTimer || 0) + dt;
          if ((p as any).lightningMassDrainTimer >= 2.0) {
            (p as any).lightningMassDrainTimer = 0;
            // Drain 2 mass points from each cell
            for (const c of p.cells) {
              c.mass = Math.max(10, c.mass - 2);
              c.radius = radiusFromMass(c.mass);
            }
          }
        }
      }
    }

    // Player movement: compute aim direction only (speed handled in 30Hz tick)
    let aimDir = { x: 1, y: 0 };
    if (me?.cells[0]) {
      let mx = 0, my = 0, M = 0;
      for (const c of me.cells) { mx += c.pos.x * c.mass; my += c.pos.y * c.mass; M += c.mass; }
      mx /= Math.max(1, M); my /= Math.max(1, M);
      const scale = Math.min(this.canvas.width/1920, this.canvas.height/1080) * this.currentZoom;
      const aim = this.updateWorldPosition(mx, my, scale, input);
      const dx = aim.worldX - mx, dy = aim.worldY - my;
      const dist = Math.hypot(dx, dy) || 1;
      aimDir = { x: dx/dist, y: dy/dist };

      // Split input (Space key or mobile split button)
      const wantSplit = !!((input as any).splitPressed || (input as any).split || (input as any).space);
      if (wantSplit) {
        const dsplit = Math.hypot(dx, dy);
        const sdir = dsplit > 0.001 ? { x: dx / dsplit, y: dy / dsplit } : { x: 1, y: 0 };
        this.performSplit(this.me, sdir);
        (input as any).splitPressed = false;
        (input as any).split = false;
        (input as any).space = false;
      }
    }

    // Eject (W)
    if (me?.alive) {
      this._ejectCooldown = Math.max(0, this._ejectCooldown - dt);
      const held = !!((input as any).ejectHeld);
      let taps = (input as any).ejectTapCount || 0;
      if (held && this._ejectCooldown <= 0) taps += 1;
      if (taps > 0) {
        const maxShots = Math.min(taps, Math.max(1, Math.floor(this.ejectRate * dt * 2)));
        for (let i=0; i<maxShots; i++) this.playerEject(me, input);
        (input as any).ejectTapCount = Math.max(0, ((input as any).ejectTapCount || 0) - maxShots);
        this._ejectCooldown = 1 / this.ejectRate;
      }
    }

    // Movement tick @ 30 Hz: set per-cell target velocities
    this.moveTickAccum += dt;
    let mvSteps = 0;
    while (this.moveTickAccum >= this.moveTickStep && mvSteps < 2) {
      if (me?.alive) {
        let speedMul = (input as any).dash ? 1.22 : 1.0;
        if (me.invincibleTimer>0) speedMul *= 2.0;
        else if ((me as any).lightningTimer > 0) speedMul *= 1.8; // Lightning 1.8x speed (20% slower than before)
        if ((me.speedBoostTimer||0) > 0) speedMul *= 1.10;
        for (const c of me.cells){
          const vCap = speedFromMass(Math.max(1, c.mass)) * speedMul;
          (c as any)._mvTarget = { x: aimDir.x * vCap, y: aimDir.y * vCap, cap: vCap };
        }
      }
      this.moveTickAccum -= this.moveTickStep;
      mvSteps++;
    }

    // Bot AI @ 30 Hz
    this.botTickAccum += dt;
    let steps = 0;
    while (this.botTickAccum >= this.botTickStep && steps < 2) {
      updateBots(this.botParams, {
        width: this.world.w, height: this.world.h, pad: zonePad,
        pellets: this.pellets, powerups: this.powerups, players: this.players
      }, this.botTickStep);
      this.botTickAccum -= this.botTickStep;
      steps++;
    }

    // integrate cell motion and split flights
    for (const [, p] of this.players){
      if (!p.alive) continue;
      for (const c of p.cells){
        // Use new split motion system
        this.tickSplitMotion(c, dt);
        
        // Apply movement if not actively splitting
        if (!(c as any)._splitTarget) {
          // Check if cell needs to return home after 15 seconds
          const splitTime = (c as any)._splitTime ?? 0;
          if (splitTime >= FORCE_MERGE_TIME && p.cells.length > 1) {
            const main = this.largestCell(p);
            if (main && main !== c) {
              // Force return to main cell
              const dx = main.pos.x - c.pos.x;
              const dy = main.pos.y - c.pos.y;
              const dist = Math.hypot(dx, dy);
              if (dist > 5) { // Only if not already very close
                const ux = dx / (dist || 1);
                const uy = dy / (dist || 1);
                const returnSpeed = 400; // Fast return speed
                c.vel.x = ux * returnSpeed;
                c.vel.y = uy * returnSpeed;
                (c as any)._forceReturning = true;
              }
            }
          } else if (!(c as any)._forceReturning) {
            // Normal movement only if not force returning
            const mv:any = (c as any)._mvTarget;
            if (mv) {
              const dvx = mv.x - c.vel.x, dvy = mv.y - c.vel.y;
              const dvm = Math.hypot(dvx, dvy);
              if (dvm > 0){
                const maxDelta = this.maxAccel * dt;
                const s = Math.min(1, maxDelta / dvm);
                c.vel.x += dvx * s; c.vel.y += dvy * s;
              }
            }
          }
          
          // Apply speed cap (higher for force returning cells)
          let mul = 1.0;
          if (p.invincibleTimer>0) mul *= 2.0;
          else if ((p as any).lightningTimer > 0) mul *= 1.8; // Lightning 1.8x speed (20% slower than before)
          if ((p as any).speedBoostTimer > 0) mul *= 1.10;
          let vCap = speedFromMass(Math.max(1, c.mass)) * mul * 1.6;
          if ((c as any)._forceReturning) vCap *= 3.0; // Allow higher speed for force return
          const mag = Math.hypot(c.vel.x, c.vel.y);
          if (mag > vCap){ const s = vCap / (mag || 1); c.vel.x *= s; c.vel.y *= s; }
          
          // Integrate position if not handled by tickSplitMotion
          c.pos.x = clamp(c.pos.x + c.vel.x * dt, 0, this.world.w);
          c.pos.y = clamp(c.pos.y + c.vel.y * dt, 0, this.world.h);
        }

        // Enforce leash distance between cells (but allow force returning cells to move faster)
        if (p.cells.length > 1 && !(c as any)._forceReturning) {
          const main = this.largestCell(p);
          if (main && main !== c) {
            const dx = c.pos.x - main.pos.x;
            const dy = c.pos.y - main.pos.y;
            const dist = Math.hypot(dx, dy);
            if (dist > MAX_LEASH_DISTANCE) {
              const nx = dx / (dist || 1);
              const ny = dy / (dist || 1);
              c.pos.x = main.pos.x + nx * MAX_LEASH_DISTANCE;
              c.pos.y = main.pos.y + ny * MAX_LEASH_DISTANCE;
              // Remove outward velocity
              const outwardVel = c.vel.x * nx + c.vel.y * ny;
              if (outwardVel > 0) {
                c.vel.x -= nx * outwardVel;
                c.vel.y -= ny * outwardVel;
              }
            }
          }
        }

        const dxC = c.pos.x - cx, dyC = c.pos.y - cy; const dC = Math.hypot(dxC,dyC) || 1;
        if (dC > R){
          const s = (R - 0.5) / dC;
          c.pos.x = cx + dxC * s; c.pos.y = cy + dyC * s;
          if (p.invincibleTimer<=0){ c.mass = Math.max(10, c.mass - this.zoneDps * dt); c.radius = radiusFromMass(c.mass); }
        }
      }
    }

    // Star aura (optimized for performance)
    if (this.frameIndex % this.auraEveryN === 0) {
      // Collect all star players first
      const starPlayers: {player: PlayerState, cells: Cell[]}[] = [];
      for (const [, s] of this.players){
        if (!s.alive || s.invincibleTimer <= 0) continue;
        starPlayers.push({player: s, cells: s.cells});
      }
      
      // Only process if there are star players
      if (starPlayers.length > 0) {
        for (const [, p2] of this.players){
          if (!p2.alive || p2.invincibleTimer > 0) continue;
          
          // Check if this player is already a star player
          const isStarPlayer = starPlayers.some(sp => sp.player.id === p2.id);
          if (isStarPlayer) continue;
          
          for (const oc of p2.cells){
            // Check against all star players
            for (const starData of starPlayers) {
              for (const sc of starData.cells){
                const dx = sc.pos.x - oc.pos.x, dy = sc.pos.y - oc.pos.y;
                const sumR = sc.radius + oc.radius;
                const limit = 10;
                const sumPlus = sumR + limit;
                const d2 = dx*dx + dy*dy;
                if (d2 <= sumPlus*sumPlus){
                  const d = Math.sqrt(d2) || 1;
                  const gap = d - sumR;
                  const nx = dx / d, ny = dy / d;
                  const factor = clamp(1 - Math.max(0, gap) / limit, 0, 1);
                  const accel = 120 * factor * this.auraEveryN;
                  oc.vel.x += nx * accel * dt; oc.vel.y += ny * accel * dt;
                  break; // Only apply force from one star cell to avoid stacking
                }
              }
            }
          }
        }
      }
    }

    // Magnet aura
    if (this.frameIndex % this.auraEveryN === 0) {
      for (const [, s] of this.players){
        const magT = (s as any).magnetTimer || 0;
        if (!s.alive || magT <= 0) continue;
        for (const sc of s.cells){
          const reach = sc.radius + 100; const reach2 = reach * reach;
          for (const pl of this.pellets as any[]){
            const dx = sc.pos.x - pl.pos.x, dy = sc.pos.y - pl.pos.y;
            const d2 = dx*dx + dy*dy;
            if (d2 <= reach2){
              const d = Math.sqrt(d2) || 1;
              const gap = d - sc.radius;
              const nx = dx / d, ny = dy / d;
              const factor = clamp(1 - Math.max(0, gap) / 100, 0, 1);
              const accel = 220 * factor * this.auraEveryN;
              if (!pl.vel) pl.vel = { x: 0, y: 0 };
              pl.vel.x += nx * accel * dt; pl.vel.y += ny * accel * dt;
            }
          }
        }
      }
    }

    // Pellet physics
    for (const pl of this.pellets as any[]){
      if ((pl as any).vel){ pl.pos.x += pl.vel.x * dt; pl.pos.y += pl.vel.y * dt; pl.vel.x *= 0.93; pl.vel.y *= 0.93; }
      if ((pl as any).life !== undefined) (pl as any).life -= dt;
    }

    // Virus feeding from ejects -> new green
    for (let pi=(this.pellets as any[]).length-1; pi>=0; pi--){
      const pl:any = (this.pellets as any[])[pi];
      if (!pl.vel) continue;
      for (const v of this.viruses as any[]){
        if (v.kind === 'red') continue;
        const dx = pl.pos.x - v.pos.x, dy = pl.pos.y - v.pos.y;
        if (Math.hypot(dx,dy) <= (v.radius + 4)){
          v.fed = (v.fed||0)+1; v._lastDir = { x: pl.vel.x, y: pl.vel.y };
          (this.pellets as any[]).splice(pi,1);
          break;
        }
      }
    }
    for (const v of this.viruses as any[]){
      if (v.kind === 'red') continue;
      if ((v.fed||0) >= 7){
        const d = v._lastDir || {x:1,y:0};
        const L = Math.hypot(d.x,d.y) || 1;
        const dir = { x: d.x/L, y: d.y/L };
        const nv:any = {
          pos: { x: v.pos.x + dir.x * v.radius * 3, y: v.pos.y + dir.y * v.radius * 3 },
          radius: v.radius,
          vel: { x: dir.x * 40, y: dir.y * 40 },
          ang: 0, spin: 0.1, kind: 'green'
        };
        const dxC = nv.pos.x - cx, dyC = nv.pos.y - cy; const dC = Math.hypot(dxC,dyC) || 1;
        const maxD = Math.max(0, R - nv.radius - 2);
        if (dC > maxD){ nv.pos.x = cx + dxC/dC * maxD; nv.pos.y = cy + dyC/dC * maxD; }
        const greens = this.viruses.filter(x => (x as any).kind === 'green').length;
        if (greens < this.greenMax) this.viruses.push(nv);
        v.fed = 0;
      }
    }

    // Eat pellets
    for (let i=this.pellets.length-1; i>=0; i--){
      const pl = this.pellets[i] as any; let eaten = false;
      this.players.forEach(p=>{
        if (eaten || !p.alive) return;
        for (const c of p.cells){
          const d = Math.hypot(pl.pos.x - c.pos.x, pl.pos.y - c.pos.y);
          if (d < c.radius * 0.9){
            const gain = (pl.mass ?? randInt(3,5));
            c.mass += gain; c.radius = radiusFromMass(c.mass); eaten = true;
            const ang = Math.random()*Math.PI*2; const rr  = Math.sqrt(Math.random()) * Math.max(0, R - 60);
            const px  = cx + Math.cos(ang)*rr; const py  = cy + Math.sin(ang)*rr;
            this.pellets[i] = { pos: { x: px, y: py }, mass: rand(1, 4) } as any;
            break;
          }
        }
      });
    }
    // Throttled pellet refill
    {
      const target = this.pelletTarget;
      if (this.pellets.length < target){
        const toAdd = Math.min(8, target - this.pellets.length);
        for (let k=0; k<toAdd; k++){
          const ang = Math.random()*Math.PI*2; const rr  = Math.sqrt(Math.random()) * Math.max(0, R - 60);
          const px  = cx + Math.cos(ang)*rr; const py  = cy + Math.sin(ang)*rr;
          this.pellets.push({ pos: { x: px, y: py }, mass: rand(1, 4) } as any);
        }
      }
    }

    // Viruses update & red bullets
    for (let i = this.viruses.length - 1; i >= 0; i--) {
      const v = this.viruses[i] as any;
      if (v.ang === undefined) v.ang = 0; if (v.spin === undefined) v.spin = 0.08;
      v.ang += v.spin * dt; if (!v.vel) v.vel = { x: 0, y: 0 };
      
      if (v.kind === 'blackhole') {
        this.updateBlackhole(v, dt);
        this.applyBlackholeGravity(v, dt);
      } else {
        if (Math.random() < 0.015 * (dtMs / 16.67)) { const jitter = 4; v.vel.x += rand(-jitter, jitter); v.vel.y += rand(-jitter, jitter); }
        v.vel.x *= 0.99; v.vel.y *= 0.99; v.pos.x += (v.vel?.x ?? 0) * dt; v.pos.y += (v.vel?.y ?? 0) * dt;
        const dx = v.pos.x - cx, dy = v.pos.y - cy; const d = Math.hypot(dx,dy) || 1; const maxD = Math.max(0, R - v.radius);
        if (d > maxD){ const nx = dx / d, ny = dy / d; v.pos.x = cx + nx * maxD; v.pos.y = cy + ny * maxD; if (v.vel){ const vn = v.vel.x*nx + v.vel.y*ny; v.vel.x -= 2*vn*nx; v.vel.y -= 2*vn*ny; v.vel.x *= 0.8; v.vel.y *= 0.8; } }
      }
      
      for (const [, p] of this.players) { if (!p.alive) continue; for (const c of p.cells){ if (v.kind !== 'blackhole') this.handleVirusCollision(p, c, v); } }
      if (v.kind === 'red') {
        v.volleyT = (v.volleyT ?? this.redVolleyEvery) - dt;
        if (v.volleyT <= 0) {
          v.volleyT = this.redVolleyEvery; const N = this.redBulletsPerVolley; const speed = 340; const range = 4.2 * v.radius;
          for (let k=0; k<N; k++){
            const ang = (k / N) * Math.PI * 2; const dir = { x: Math.cos(ang), y: Math.sin(ang) };
            this.bullets.push({ kind:'hazard', pos: { x: v.pos.x, y: v.pos.y }, vel: { x: dir.x * speed, y: dir.y * speed }, mass: 10, owner: 'hazard', ttl: 2.0, rangeLeft: range });
          }
        }
        v.ttl = (v.ttl ?? 25) - dt; if (v.ttl <= 0) { this.spawnImplosion(v.pos.x, v.pos.y); this.viruses.splice(i,1); continue; }
      }
    }

    // PowerUps
    for (let i=this.powerups.length-1;i>=0;i--){
      const pu = this.powerups[i]; pu.ttl -= dt; if (pu.ttl <= 0){ this.powerups.splice(i,1); continue; }
      let picked = false;
      for (const [, p] of this.players){ if (!p.alive) continue; for (const c of p.cells){ if (Math.hypot(pu.pos.x - c.pos.x, pu.pos.y - c.pos.y) < c.radius + 14){ this.pickPowerUp(p, c, pu); picked = true; break; } } if (picked) break; }
      if (picked) this.powerups.splice(i,1);
    }
    while (this.powerups.length < 22){ const pad2 = zonePad; const extra = spawnPowerUps(this.world.w, this.world.h, 1, pad2, this.viruses); if (extra.length>0) this.powerups.push(extra[0]); }

    // Bullets & Explosions
    this.fireBulletsIfNeeded(dt, input);
    for (let i=this.bullets.length-1;i>=0;i--){
      const b = this.bullets[i]; const speed = Math.hypot(b.vel.x, b.vel.y); const stepDist = speed * dt;
      if (b.rangeLeft !== undefined) { b.rangeLeft -= stepDist; if (b.rangeLeft <= 0) { if (b.explodeAtEnd) this.spawnExplosion(b.pos.x, b.pos.y); this.bullets.splice(i,1); continue; } }
      else { b.ttl -= dt; if (b.ttl <= 0) { this.bullets.splice(i,1); continue; } }
      b.pos.x += b.vel.x * dt; b.pos.y += b.vel.y * dt;
      if (b.pos.x<0 || b.pos.x>this.world.w || b.pos.y<0 || b.pos.y>this.world.h){ if (b.explodeAtEnd) this.spawnExplosion(b.pos.x, b.pos.y); this.bullets.splice(i,1); continue; }
      for (let vi=this.viruses.length-1; vi>=0; vi--){ const v = this.viruses[vi] as any; const d = Math.hypot(v.pos.x - b.pos.x, v.pos.y - b.pos.y); if (d < v.radius){ if (b.kind==='rocket' && v.kind==='green'){ const nx = (v.pos.x - b.pos.x)/(d||1), ny=(v.pos.y - b.pos.y)/(d||1); v.vel.x += nx * 120; v.vel.y += ny * 120; this.spawnExplosion(b.pos.x, b.pos.y); this.bullets.splice(i,1); i--; } break; } }
      if (i < 0) break;
      for (const [, p] of this.players){ if (!p.alive || p.id===b.owner) continue; if (p.invincibleTimer>0) continue; let hit=false; for (const c of p.cells){ const d = Math.hypot(c.pos.x - b.pos.x, c.pos.y - b.pos.y); if (d < c.radius){ const loss = (b.kind==='hazard') ? b.mass * 1.2 : b.mass; c.mass = Math.max(1, c.mass - loss); c.radius = radiusFromMass(c.mass); const nx = (c.pos.x - b.pos.x) / (d || 1); const ny = (c.pos.y - b.pos.y) / (d || 1); c.vel.x += nx * 60; c.vel.y += ny * 60; hit=true; this.spawnExplosion(b.pos.x, b.pos.y); break; } } if (hit){ this.bullets.splice(i,1); i--; break; } }
      if (i<0) break;
    }

    // Multi-eat robust
    { let passes = 0; while (passes < this.maxEatsPerFrame) { if (!this.resolveEatsOnce()) break; passes++; } }

    // Self merge
    for (const [, p] of this.players) if (p.alive) this.doSelfMergeForPlayer(p, dt);

    // Star trail particles for invincibility (reduced on mobile)
    for (const [, p] of this.players){ 
      if (!p.alive) continue; 
      if (p.invincibleTimer>0){ 
        for (const c of p.cells){ 
          const particleChance = this.isMobile ? 0.15 : 0.5; // Much fewer particles on mobile
          if (Math.random()<particleChance){ 
            this.particles.push({ 
              pos:{x:c.pos.x + rand(-c.radius*0.2, c.radius*0.2), y:c.pos.y + rand(-c.radius*0.2, c.radius*0.2)}, 
              vel:{x:rand(-40,40), y:rand(-40,40)}, 
              life:1, 
              size: rand(2,4), 
              hue: randInt(0,360), 
              type:'streak', 
              fade: rand(0.6,1.0) 
            }); 
          } 
        } 
      } 
    }

    // Particles update
    this.updateParticles(dt);

    // Cleanup & Game Over
    for (const [, p] of this.players){ if (p.cells.length===0) p.alive = false; }
    if (me && !me.alive && !this.gameOverTriggered) {
      this.gameOverTriggered = true;
      const rank = this.getRank(this.me);
      
      // Finalize XP for this match with placement reward
      const placement = rank || 1; // Use rank as placement
      const xpBreakdown = this.matchTracker.finalize(placement);
      
      const stats: GameOverStats = { 
        survivedMs: this.meSurvivalMs, 
        survivedSec: Math.round(this.meSurvivalMs/10)/100, 
        maxMass: Math.round(this.meMaxMass), 
        score: Math.round(this.meMaxMass), 
        rank,
        xpBreakdown 
      } as any;
      this.onGameOver?.(stats);
    }

    // Red virus spawns
    if (elapsed >= this.redStartMs) {
      this.redSpawnTimer -= dtMs;
      const redCount = this.viruses.filter(v => (v as any).kind === 'red').length;
      if (this.redSpawnTimer <= 0 && redCount < this.redMax) { this.spawnRedVirus(); this.redSpawnTimer = this.redSpawnEveryMs; }
    }

    // Blackhole system
    if (!this.blackholeActive) {
      this.blackholeSpawnTimer -= dtMs;
      if (this.blackholeSpawnTimer <= 0) {
        this.spawnBlackhole();
        this.blackholeActive = true;
        this.blackholeSpawnTimer = this.blackholeRespawnTimer; // Reset for next spawn
      }
    }

    // Ensure enough bots
    this.ensureBotCount();
  }

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  level!: LevelDesign;

  players = new Map<string, PlayerState>();
  pellets: Pellet[] = [];
  viruses: Virus[] = [];
  powerups: PowerUp[] = [];
  bullets: RocketBullet[] = [];
  particles: Particle[] = [];
  me!: string;

  onGameOver?: (stats: GameOverStats)=>void;

  world = { w: 5000, h: 5000 };

  // Shrink-Zone
  shrinkStart = 20_000;
  shrinkDur   = 60_000;
  zoneDps = 15;

  private currentZoom = 1.0;
  private zoomBias = 0;
  private lastZoneR = Math.min(this.world.w, this.world.h) / 2; // track safe-zone radius for split caps
  
  // Bot-Parameter
  botParams: BotParams = {
    aggroRadius: 1800,
    huntRatio: 1.05,       // more aggressive: chase nearly-equal prey
    fleeRatio: 1.25,       // flee only from much bigger targets
    edgeAvoidDist: 280,
    wanderJitter: 0.18,    // less jitter, more intent
    interceptLead: 1.2,    // lead more for interception
  } as any;
  
  // Blackhole system
  private blackholeSpawnTimer = 0; // Spawn at start (0 seconds)
  private blackholeRespawnTimer = 5 * 60 * 1000; // 5 minutes in ms
  private blackholeActive = false;
  
  private targetBotCount = 69;
  private maxEatsPerFrame = 64;
  // Fixed-timestep bot AI (30 Hz)
  private botTickStep = 1/30; // ~33.3ms
  private botTickAccum = 0;

  // Red viruses
  private redStartMs = 30_000;
  private redSpawnEveryMs = 6_000;
  private redSpawnTimer = 0;
  private redMax = 6;
  private redVolleyEvery = 6.5;
  private redBulletsPerVolley = 18;
  private greenMax = 20; // NEW: cap for green viruses

  // Merge & Split
  private mergeTime = 15.0;
  private selfCohesionK = 0.33;
  private selfCohesionDamp = 0.20;
  private selfCooldownPull = 0.06; // gentle attraction strength during cooldown when apart
  private pairMergeDelay = 15.0; // seconds per pair step (smallest pair first)
  private mainAttractAccel = 260; // px/s^2 attraction toward main cell during cooldown
  private splitSpeed = 520; // baseline split speed
  private recoil     = 140;
  private minSplitMass = 35;
  private selfSolidPush = 0.85;

  // Split impulse/damping config (Agar-like)
  private splitImpulseSec = 0.10;      // duration of strong damping window
  private splitDampImpulse = 0.85;    // per-frame (60fps) multiplier while in impulse window
  private splitDampNormal  = 0.92;    // per-frame (60fps) multiplier after impulse window
  private splitDistMin = 40;         // px
  private splitDistMax = 120;         // px
  private splitCapBase = 450;         // px/s base cap
  private splitCapK = 1600;           // px/s component scaled by 1/sqrt(m)

  // Merge control
  private mergeBase = 12.0;           // base cooldown seconds
  private mergeSqrtK = 0.06;          // extra per sqrt(mass)
  private postMergeShield = 1.0;      // seconds of cooldown after a merge

  // Eject config (W)
  private ejectLoss = 18;
  private ejectGive = 13;
  private ejectRate = 7;
  private _ejectCooldown = 0;

  // Stats / GameOver
  private meSurvivalMs = 0;
  private meMaxMass = 0;
  private gameOverTriggered = false;

  // Perf: aura throttling
  private auraEveryN = 5; // compute aura forces every N frames (4–6 recommended)
  private frameIndex = 0;

  // Movement model (30 Hz ticks with smoothing)
  private moveTickStep = 1/30;
  private moveTickAccum = 0;
  private maxAccel = 900; // px/s^2

  // Mobile perf flags and tunables
  private isMobile = false;
  private mobileNoShadows = false;
  private reducedVisualEffects = false;
  private simplifiedRendering = false;
  private disableNonEssentialEffects = false;
  private pelletTarget = 1000;
  private initialPelletCount = 360;
  private maxParticles = 900;
  // Performance monitoring for mobile
  private frameTime = 0;
  private lastFrameTime = 0;
  private fpsHistory: number[] = [];
  private performanceAdjusted = false;
  private matchTracker = newMatchTracker(); // XP tracking for current match
  private lastTrackedMass = 0; // Track mass for XP growth calculation

  constructor(canvas: HTMLCanvasElement){
    this.canvas = canvas;

    const updateCanvasSize = () => {
      // Match backing store to CSS pixels to avoid Safari 100vh/URL bar issues
      const r = canvas.getBoundingClientRect();
      let w = Math.max(1, Math.round(r.width));
      let h = Math.max(1, Math.round(r.height));
      
      // On mobile, optionally reduce resolution for better performance
      if (this.isMobile && this.simplifiedRendering) {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const scaleFactor = devicePixelRatio > 2 ? 0.75 : 0.85; // Reduce resolution on high-DPI devices
        w = Math.round(w * scaleFactor);
        h = Math.round(h * scaleFactor);
      }
      
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        this.level?.onResize?.();
      }
    };
    window.addEventListener('resize', updateCanvasSize);
    try { (window as any).visualViewport?.addEventListener('resize', updateCanvasSize, { passive: true } as any); } catch {}

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no 2d context');
    this.ctx = ctx;

    this.level = new LevelDesign(canvas);

    // Enhanced mobile detection and performance optimization
    try {
      this.isMobile = typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      
      // Check for mobile optimization hint from start menu
      const mobileOptLevel = sessionStorage.getItem('mobileOptimized');
      if (mobileOptLevel === 'true') {
        // User chose full optimization
        this.reducedVisualEffects = true;
        this.simplifiedRendering = true;
        this.disableNonEssentialEffects = true;
      } else if (mobileOptLevel === 'basic') {
        // User chose basic optimization
        this.reducedVisualEffects = true;
      }
      
      // Detect low-end devices by checking available memory
      if (typeof navigator !== 'undefined' && (navigator as any).deviceMemory) {
        const deviceMemory = (navigator as any).deviceMemory;
        if (deviceMemory <= 2) {
          // Low memory device - enable all optimizations
          this.reducedVisualEffects = true;
          this.simplifiedRendering = true;
          this.disableNonEssentialEffects = true;
        }
      }
    } catch { this.isMobile = false; }
    this.applyPerfPreset();

    updateCanvasSize();
  }

  private applyPerfPreset(){
    if (this.isMobile){
      // Aggressive mobile optimizations for smooth 60fps
      this.targetBotCount = 45; // Reduce bots significantly
      this.pelletTarget = 400; // Much fewer pellets
      this.initialPelletCount = 80;
      this.greenMax = Math.min(this.greenMax, 6); // Fewer viruses
      this.redMax = Math.min(this.redMax, 2);
      this.redBulletsPerVolley = Math.min(this.redBulletsPerVolley, 6);
      this.auraEveryN = 12; // Update auras every 12 frames instead of 5
      this.mobileNoShadows = true;
      this.maxParticles = 150; // Much fewer particles
      this.maxEatsPerFrame = 32; // Limit collision processing
      
      // Mobile-specific performance flags
      this.reducedVisualEffects = true;
      this.simplifiedRendering = true;
      this.disableNonEssentialEffects = true;
    } else {
      this.targetBotCount = 69; // desktop also 69
      this.pelletTarget = 1000;
      this.initialPelletCount = 360;
      this.maxParticles = 900;
    }
  }

  private autoAdjustPerformance() {
    // Emergency performance adjustments for struggling devices
    if (this.isMobile) {
      this.targetBotCount = Math.max(20, this.targetBotCount - 10);
      this.pelletTarget = Math.max(200, this.pelletTarget - 100);
      this.maxParticles = Math.max(50, this.maxParticles - 50);
      this.auraEveryN = Math.min(20, this.auraEveryN + 5);
      this.greenMax = Math.max(3, this.greenMax - 2);
      this.redMax = Math.max(1, this.redMax - 1);
      
      // Force all optimizations
      this.reducedVisualEffects = true;
      this.simplifiedRendering = true;
      this.disableNonEssentialEffects = true;
      this.mobileNoShadows = true;
    }
  }

  // Pick a safe spawn position within the current safe zone (inside pad)
  private findSafeSpawnPos(pad:number, attempts=80){
    const { cx, cy, R } = zoneCircle(this.world.w, this.world.h, pad);
    const margin = 140; // keep a bit away from border
    const maxR = Math.max(0, R - margin);
    if (maxR <= 0) return { x: cx, y: cy };
    let best:{x:number;y:number;score:number} = { x: cx, y: cy, score: -Infinity };
    for (let i=0;i<attempts;i++){
      const ang = Math.random()*Math.PI*2;
      const r = Math.sqrt(Math.random()) * maxR; // uniform over disc
      const x = cx + Math.cos(ang)*r;
      const y = cy + Math.sin(ang)*r;
      const score = spawnSafetyScore(x, y, this.players, this.viruses, this.world.w, this.world.h, pad);
      if (score > best.score) best = { x, y, score };
    }
    return { x: best.x, y: best.y };
  }

  // ---------- Spawns ----------
  spawnPellets(count:number){
    this.pellets = [];
    const totalPellets = count * 6;
    const pad = this.outsidePad(0);
    const { cx, cy, R } = zoneCircle(this.world.w, this.world.h, pad);
    const maxR = Math.max(0, R - 60);
    for (let i=0; i<totalPellets; i++){
      const sizeType = Math.random();
      let mass:number;
      if (sizeType < 0.1)       mass = rand(8, 12);
      else if (sizeType < 0.3)  mass = rand(5, 7);
      else                      mass = rand(2, 4);
      const ang = Math.random()*Math.PI*2;
      const r = Math.sqrt(Math.random()) * maxR;
      const x = cx + Math.cos(ang)*r;
      const y = cy + Math.sin(ang)*r;
      this.pellets.push({ pos: { x, y }, mass } as any);
    }
  }

  spawnViruses(count:number){
    this.viruses = [];
    const pad = this.outsidePad(0);
    const { cx, cy, R } = zoneCircle(this.world.w, this.world.h, pad);
    const margin = 160;
    const maxR = Math.max(0, R - margin);
    const n = Math.min(count, this.greenMax); // cap initial greens
    for (let i=0;i<n;i++){
      const r         = rand(38, 54);
      const spin      = rand(0.05, 0.12);
      const baseSpeed = rand(2, 5);
      const theta     = rand(0, Math.PI*2);
      const rr        = Math.sqrt(Math.random()) * Math.max(0, maxR - r);
      const px = cx + Math.cos(theta)*rr;
      const py = cy + Math.sin(theta)*rr;
      this.viruses.push({
        pos: { x: px, y: py },
        radius: r,
        vel: { x: Math.cos(theta)*baseSpeed, y: Math.sin(theta)*baseSpeed },
        ang: rand(0, Math.PI*2),
        spin,
        kind: 'green',
      } as any);
    }
  }

  private spawnRedVirus(){
    const r         = rand(42, 58);
    const spin      = rand(0.08, 0.14);
    const baseSpeed = rand(1, 3);
    const theta     = rand(0, Math.PI*2);
    this.viruses.push({
      pos: { x: rand(160, this.world.w-160), y: rand(160, this.world.h-160) },
      radius: r,
      vel: { x: Math.cos(theta)*baseSpeed, y: Math.sin(theta)*baseSpeed },
      ang: rand(0, Math.PI*2),
      spin,
      kind: 'red',
      ttl: rand(20, 30),
      volleyT: this.redVolleyEvery,
    } as any);
  }

  private spawnBlackhole(){
    // Spawn blackhole in center area, away from players
    const centerX = this.world.w / 2;
    const centerY = this.world.h / 2;
    const spawnRadius = 300; // Spawn within 300px of center
    
    // Find safe position away from players
    let bestPos = { x: centerX, y: centerY };
    let maxDistance = 0;
    
    for (let attempt = 0; attempt < 50; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * spawnRadius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // Find minimum distance to any player
      let minPlayerDist = Infinity;
      for (const [, player] of this.players) {
        if (!player.alive) continue;
        for (const cell of player.cells) {
          const dist = Math.hypot(x - cell.pos.x, y - cell.pos.y);
          minPlayerDist = Math.min(minPlayerDist, dist);
        }
      }
      
      if (minPlayerDist > maxDistance) {
        maxDistance = minPlayerDist;
        bestPos = { x, y };
      }
    }
    
    const blackholeRadius = rand(48, 62); // Similar to green/red virus size
    this.viruses.push({
      pos: bestPos,
      radius: blackholeRadius,
      vel: { x: 0, y: 0 }, // Blackholes don't move
      ang: 0,
      spin: 0.1, // Slow rotation for visual effect
      kind: 'blackhole',
      ttl: 60, // 1 minute lifetime
      pullRadius: 500, // 500px pull radius as requested
      spawnTime: performance.now() / 1000,
      imploding: false,
      implodeProgress: 0
    } as any);
    
    console.log('🕳️ Blackhole spawned at center!');
  }

  private updateBlackhole(blackhole: any, dt: number) {
    blackhole.ttl -= dt;
    blackhole.ang += blackhole.spin * dt;
    
    // Start imploding in last 3 seconds
    if (blackhole.ttl <= 3 && !blackhole.imploding) {
      blackhole.imploding = true;
      console.log('🕳️ Blackhole starting to implode!');
    }
    
    if (blackhole.imploding) {
      blackhole.implodeProgress = Math.min(1, (3 - blackhole.ttl) / 3);
      blackhole.spin = 0.5 + blackhole.implodeProgress * 2; // Spin faster while imploding
    }
    
    // Remove blackhole when TTL expires
    if (blackhole.ttl <= 0) {
      const index = this.viruses.indexOf(blackhole);
      if (index >= 0) {
        this.viruses.splice(index, 1);
        this.blackholeActive = false;
        console.log('🕳️ Blackhole imploded and disappeared!');
        
        // Create implosion particles (fewer on mobile)
        const particleCount = this.isMobile ? 20 : 50;
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = rand(100, 300);
          this.particles.push({
            pos: { x: blackhole.pos.x, y: blackhole.pos.y },
            vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
            life: 1,
            size: rand(2, 8),
            hue: rand(250, 300),
            type: 'spark',
            fade: rand(0.8, 1.0)
          });
        }
      }
    }
  }

  private applyBlackholeGravity(blackhole: any, dt: number) {
    const pullRadius = blackhole.pullRadius || 500;
    const pullRadius2 = pullRadius * pullRadius;
    
    for (const [, player] of this.players) {
      if (!player.alive) continue;
      
      for (const cell of player.cells) {
        const dx = blackhole.pos.x - cell.pos.x;
        const dy = blackhole.pos.y - cell.pos.y;
        const dist2 = dx * dx + dy * dy;
        
        if (dist2 <= pullRadius2) {
          const dist = Math.sqrt(dist2) || 1;
          const pullStrength = (pullRadius - dist) / pullRadius; // Stronger when closer
          const force = pullStrength * 150 * dt; // Gradual pull
          
          const nx = dx / dist;
          const ny = dy / dist;
          
          cell.vel.x += nx * force;
          cell.vel.y += ny * force;
          
          // Check if player is consumed (very close to blackhole center)
          if (dist <= blackhole.radius + cell.radius * 0.5) {
            this.consumePlayerByBlackhole(player, cell, blackhole);
          }
        }
      }
    }
  }

  private consumePlayerByBlackhole(player: PlayerState, cell: Cell, blackhole: any) {
    // Player loses half their mass
    const totalMass = this.totalMass(player);
    const newMass = Math.max(20, totalMass * 0.5); // Keep at least 20 mass
    
    // Distribute new mass among all cells proportionally
    const massRatio = newMass / totalMass;
    for (const c of player.cells) {
      c.mass *= massRatio;
      c.radius = radiusFromMass(c.mass);
    }
    
    // Teleport player to random safe location
    const safePos = this.findSafeSpawnPos(this.outsidePad(0));
    const offset = player.cells.length > 1 ? 50 : 0;
    
    for (let i = 0; i < player.cells.length; i++) {
      const c = player.cells[i];
      const angle = (i / player.cells.length) * Math.PI * 2;
      c.pos.x = safePos.x + Math.cos(angle) * offset;
      c.pos.y = safePos.y + Math.sin(angle) * offset;
      c.vel.x = 0;
      c.vel.y = 0;
    }
    
    console.log(`🕳️ ${player.name} was consumed by blackhole! Mass halved and teleported.`);
    
    // Create consumption particles at blackhole (fewer on mobile)
    const particleCount = this.isMobile ? 8 : 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(50, 150);
      this.particles.push({
        pos: { x: blackhole.pos.x, y: blackhole.pos.y },
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        life: 1,
        size: rand(3, 6),
        hue: rand(280, 320),
        type: 'spark',
        fade: rand(0.7, 1.0)
      });
    }
  }

  spawnPowerUps(count:number){
    const pad = this.outsidePad(0);
    this.powerups = spawnPowerUps(this.world.w, this.world.h, count, pad, this.viruses);
  }

  private uuid(): string {
    try {
      const g: any = (typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : {}));
      const c: any = g && g.crypto;
      if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    } catch {}
    return 'id-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
  }

  spawnPlayers(nBots: number, config?: PlayerConfig) {
    // Start fresh roster to avoid duplicates across rounds
    this.players.clear();

    this.me = this.uuid();

    const myMass = rand(50, 150);
    const pad = this.outsidePad(0);
    const myPos = this.findSafeSpawnPos(pad);
    this.players.set(this.me, {
      id: this.me,
      color: config?.color || '#5cf2a6',
      name: config?.name || 'You',
      alive: true,
      isBot: false,
      invincibleTimer: 0,
      multishotTimer: 0,
      speedBoostTimer: 0,
      cells: [ makeCell(myMass, myPos) ],
      skinCanvas: config?.skinCanvas ?? makeSkinCanvas(['neon','eyes','stripe']),
      skinPattern: undefined,
    });

    for (let i=0;i<this.targetBotCount;i++){
      const id = this.uuid();
      const m0 = rand(50,150);
      const pos = this.findSafeSpawnPos(pad);
      this.players.set(id, {
        id,
        color: `hsl(${Math.floor(rand(0,360))} 80% 65%)`,
        name: BOT_NAMES[i % BOT_NAMES.length],
        alive: true,
        isBot: true,
        invincibleTimer: 0,
        multishotTimer: 0,
        speedBoostTimer: 0,
        cells: [ makeCell(m0, pos) ],
        skinCanvas: randomSkinCanvas(),
        skinPattern: undefined,
      });
    }

    this.meSurvivalMs = 0;
    this.meMaxMass = myMass;
    this.gameOverTriggered = false;
  }

  resetRound(){
    this.matchTracker = newMatchTracker(); // Reset XP tracking for new match
    this.lastTrackedMass = 0; // Reset mass tracking
    this.spawnPellets(this.initialPelletCount);
    this.spawnViruses(28);
    this.spawnPowerUps(18);
    this.redSpawnTimer = 0;
    const pad = this.outsidePad(0);
    this.players.forEach(p=>{
      p.alive = true;
      p.invincibleTimer = 0;
      p.multishotTimer = 0;
      p.speedBoostTimer = 0;
      const m0 = rand(50,150);
      const pos = this.findSafeSpawnPos(pad);
      p.cells = [ makeCell(m0, pos) ];
    });
    this.bullets = [];
    this.particles = [];
    this.meSurvivalMs = 0;
    this.meMaxMass = this.me ? this.totalMass(this.players.get(this.me)!) : 0;
    this.gameOverTriggered = false;
  }

  // ---------- Utilities ----------
  totalMass(p: PlayerState){ return sum(p.cells, c=>c.mass); }
  largestCell(p: PlayerState){ return p.cells.reduce((a,b)=> a.mass>=b.mass? a : b ); }

  outsidePad(_elapsed:number){
    // Fixed safe-zone: keep border size constant, no shrink over time
    return 0;
  }

  // --- Split/Merge helpers ---
  private splitTargetDistance(mass: number): number {
    // Masseabhängig, dann auf MIN..MAX clampen – KEINE zusätzliche Klemme an „ZoneR".
    // Gefühl wie Agar.io: leichte Wurffern-Abhängigkeit von sqrt(mass).
    const base = 420;                 // Baseline
    const k = 52;                     // skaliert die sqrt(mass)-Komponente
    const d = base + k * Math.sqrt(Math.max(1, mass));
    return Math.max(SPLIT_DIST_MIN, Math.min(SPLIT_DIST_MAX, d));
  }
  private splitSpeedCap(m:number): number {
    const s = Math.sqrt(Math.max(1, m));
    return Math.max(300, this.splitCapBase + this.splitCapK / s);
  }
  private impulseForDistance(D:number): number {
    // Analytic mapping from desired distance to initial velocity under two-phase damping
    const k1 = -Math.log(this.splitDampImpulse) * 60; // per-second decay in impulse window
    const k2 = -Math.log(this.splitDampNormal)  * 60; // per-second decay after
    const T  = this.splitImpulseSec;
    const term = (1 - Math.exp(-k1*T))/Math.max(1e-6,k1) + Math.exp(-k1*T)/Math.max(1e-6,k2);
    return D / Math.max(1e-6, term);
  }
  private mergeCooldownForMass(mass: number): number {
    return MERGE_COOLDOWN_BASE + MERGE_COOLDOWN_SQRT * Math.sqrt(Math.max(1, mass));
  }

  private updateWorldPosition(centerX: number, centerY: number, scale: number, input: InputState) {
    const screenCenterX = this.canvas.width / 2;
    const screenCenterY = this.canvas.height / 2;
    const worldX = centerX + ((((input as any).targetX) ?? screenCenterX) - screenCenterX) / scale;
    const worldY = centerY + ((((input as any).targetY) ?? screenCenterY) - screenCenterY) / scale;
    return { worldX, worldY };
  }

  private performSplit(playerId: string, dir: {x:number, y:number}) {
    const p = this.players.get(playerId);
    if (!p) return;
    const me = p.cells.sort((a,b)=>b.mass-a.mass)[0]; // größte Zelle als Quelle

    // Mindestmasse prüfen
    if (!me || me.mass < 36) return;

    // Aufteilen
    const newMass = me.mass * 0.5;
    me.mass = newMass;
    me.radius = radiusFromMass(me.mass);

    const d = Math.min(200, this.splitTargetDistance(newMass)); // Max 200px Flugweite
    const norm = Math.hypot(dir.x, dir.y) || 1;
    const ux = dir.x / norm;
    const uy = dir.y / norm;

    // neue kleine Zelle vorn
    const spawnPos = { x: me.pos.x + ux * (me.radius + 8), y: me.pos.y + uy * (me.radius + 8) };
    const small = { pos: {...spawnPos}, vel: {x:0,y:0}, mass: newMass, radius: radiusFromMass(newMass), mergeCooldown: MERGE_COOLDOWN_BASE };
    // Split-Metadaten
    (small as any)._splitTarget = { x: small.pos.x + ux * d, y: small.pos.y + uy * d };
    (small as any)._splitTotal  = d;
    (small as any)._splitRemain = d;
    (small as any)._splitImpulse= SPLIT_IMPULSE_SEC;
    (small as any)._splitTime = 0; // Track time since split for force merge

    // Anfangsgeschwindigkeit/Cap (begrenzt für kleine Zellen)
    const baseSpeed = Math.min(300, SPLIT_SPEED_CAP_BASE + SPLIT_SPEED_CAP_K / Math.sqrt(newMass));
    small.vel.x = ux * baseSpeed;
    small.vel.y = uy * baseSpeed;

    // Rückstoß der Quellzelle (kleiner als vorher, damit kein Über-Snapback)
    me.vel.x -= ux * SPLIT_RECOIL_SOURCE;
    me.vel.y -= uy * SPLIT_RECOIL_SOURCE;

    // Cooldowns setzen
    small.mergeCooldown = this.mergeCooldownForMass(newMass);
    me.mergeCooldown    = this.mergeCooldownForMass(me.mass);
    
    // Split time tracking für beide Zellen
    (small as any)._splitTime = 0;
    (me as any)._splitTime = 0;

    p.cells.push(small);
  }

  private playerEject(p: PlayerState, input: InputState) {
    if (!p.cells.length) return;
    const baseScale = Math.min(this.canvas.width/1920, this.canvas.height/1080) * this.currentZoom;
    const wp = this.updateWorldPosition(p.cells[0].pos.x, p.cells[0].pos.y, baseScale, input);
    for (const c of p.cells) {
      if (c.mass < 35) continue;
      const dx = wp.worldX - c.pos.x, dy = wp.worldY - c.pos.y; const d = Math.hypot(dx,dy) || 1;
      c.mass = Math.max(10, c.mass - this.ejectLoss); c.radius = radiusFromMass(c.mass);
      const speed = 420; const vx = (dx/d) * speed; const vy = (dy/d) * speed;
      const pellet:any = { pos:{ x: c.pos.x + (dx/d)*(c.radius*0.9), y: c.pos.y + (dy/d)*(c.radius*0.9) }, mass: this.ejectGive, vel:{ x: vx, y: vy }, life: 8 };
      (this.pellets as any).push(pellet);
      c.vel.x -= vx * 0.02; c.vel.y -= vy * 0.02;
    }
  }

  private handleVirusCollision(p: PlayerState, c: Cell, vv: any){
    const dx = c.pos.x - vv.pos.x, dy = c.pos.y - vv.pos.y;
    const d  = Math.hypot(dx,dy);
    const minDist = c.radius + vv.radius * 0.98;

    // Big cells can nibble green for small growth
    if (vv.kind==='green' && d < c.radius - 0.2*vv.radius){
      if (c.mass >= 1000){ c.mass += (c.mass >= 2000) ? 10 : 50; c.radius = radiusFromMass(c.mass); const idx=this.viruses.indexOf(vv); if (idx>=0) this.viruses.splice(idx,1); return; }
    }

    // Block and possible split
    if (d < minDist){
      const nx = dx / (d || 1), ny = dy / (d || 1);
      const push = (minDist - d);
      c.pos.x += nx * push; c.pos.y += ny * push; c.vel.x *= 0.75; c.vel.y *= 0.75;

      if (c.mass > 200){
        const parts = 2; const massLossFactor = 0.95; const newMassEach = Math.max(10, (c.mass * massLossFactor) / parts);
        const ang0 = Math.atan2(ny, nx);
        const newCells: Cell[] = [];
        for (let i=0;i<parts;i++){
          const ang = ang0 + i*Math.PI; const dir = { x: Math.cos(ang), y: Math.sin(ang) };
          const speed = 260;
          const nc = makeCell(newMassEach, { x: c.pos.x + dir.x*(c.radius*0.7), y: c.pos.y + dir.y*(c.radius*0.7) }, { x: dir.x*speed, y: dir.y*speed });
          (nc as any).mergeCooldown = this.mergeTime;
          newCells.push(nc);
        }
        const idx = p.cells.indexOf(c);
        if (idx>=0){ p.cells.splice(idx,1); p.cells.push(...newCells); }
      }
    }
  }

  private pickPowerUp(p: PlayerState, c: Cell, pu: PowerUp){
    const idx = p.cells.indexOf(c); if (idx<0) return; applyPowerUp(p as any, idx, pu);
  }

  private fireBulletsIfNeeded(dtSec:number, input: InputState){
    for (const [, p] of this.players){
      if (!p.alive || p.multishotTimer <= 0) continue;
      const c = this.largestCell(p); if (!c) continue;
      const shotsPerSec = 3;
      if (Math.random() < shotsPerSec * dtSec){
        let dir:{x:number;y:number} = {x:1,y:0};
        if (p.id === this.me){
          const scale = Math.min(this.canvas.width/1920, this.canvas.height/1080) * this.currentZoom;
          const wp = this.updateWorldPosition(c.pos.x, c.pos.y, scale, input);
          const v = { x: wp.worldX - c.pos.x, y: wp.worldY - c.pos.y }; const L = Math.hypot(v.x, v.y) || 1; dir = { x: v.x/L, y: v.y/L };
        } else {
          let target: {x:number;y:number}|null = null; let best = Infinity;
          for (const [, q] of this.players){ if (!q.alive || q.id===p.id) continue; if (this.totalMass(p) < this.totalMass(q)) continue; for (const qc of q.cells){ const d=Math.hypot(qc.pos.x-c.pos.x, qc.pos.y-c.pos.y); if (d<best){ best=d; target={x:qc.pos.x,y:qc.pos.y}; } } }
          if (!target){ for (const v of this.viruses){ const vv=v as any; if (vv.kind!=='green') continue; const d=Math.hypot(v.pos.x-c.pos.x, v.pos.y-c.pos.y); if (d<best){ best=d; target={x:v.pos.x,y:v.pos.y}; } } }
          if (!target){ for (const pu of this.powerups){ const d=Math.hypot(pu.pos.x-c.pos.x, pu.pos.y-c.pos.y); if (d<best){ best=d; target={x:pu.pos.x,y:pu.pos.y}; } } }
          if (target){ const v = { x: target.x - c.pos.x, y: target.y - c.pos.y }; const L = Math.hypot(v.x,v.y)||1; dir = { x: v.x/L, y: v.y/L }; }
        }
        const speed = 420, mass = 8, range = 1200;
        this.bullets.push({ kind:'rocket', pos:{ x: c.pos.x, y: c.pos.y }, vel:{ x: dir.x*speed, y: dir.y*speed }, mass, owner: p.id, ttl: 3.0, rangeLeft: range, explodeAtEnd: true } as any);
      }
    }
  }

  private spawnExplosion(x:number,y:number){
    const sparks = 24;
    for (let i=0;i<sparks;i++){
      const ang = (i/sparks)*Math.PI*2 + Math.random()*0.3; const spd = rand(120,340);
      this.particles.push({ pos:{x,y}, vel:{x:Math.cos(ang)*spd, y:Math.sin(ang)*spd}, life:1, size: rand(2,4), hue: randInt(180,240), type:'spark', fade: rand(1.2,1.8) });
    }
    this.particles.push({ pos:{x,y}, vel:{x:0,y:0}, life:1, size:6, hue:200, type:'shock', fade:1.4 });
  }

  private spawnImplosion(x:number,y:number){
    const sparks = 16;
    for (let i=0;i<sparks;i++){
      const ang = (i/sparks)*Math.PI*2 + Math.random()*0.4; const spd = rand(60,180);
      this.particles.push({ pos:{x:x+Math.cos(ang)*20, y:y+Math.sin(ang)*20}, vel:{x:-Math.cos(ang)*spd, y:-Math.sin(ang)*spd}, life:1, size: rand(2,3), hue: randInt(0,60), type:'spark', fade: rand(0.9,1.2) });
    }
    this.particles.push({ pos:{x,y}, vel:{x:0,y:0}, life:1, size:5, hue:30, type:'shock', fade:1.1 });
  }

  private resolveEatsOnce(): boolean {
    for (const [, p] of this.players){
      if (!p.alive) continue;
      for (const [, q] of this.players){
        if (!q.alive || p.id === q.id) continue;
        for (let ai=0; ai<p.cells.length; ai++){
          const a = p.cells[ai];
          for (let bi=0; bi<q.cells.length; bi++){
            const b = q.cells[bi];
            const dx = b.pos.x - a.pos.x, dy = b.pos.y - a.pos.y; const d = Math.hypot(dx,dy);
            if (d === 0) continue;
            let bigger = a, smaller = b, ownerBig = p, ownerSmall = q;
            if (b.mass > a.mass) { bigger = b; smaller = a; ownerBig = q; ownerSmall = p; }
            const ratio = bigger.mass / Math.max(1, smaller.mass);
            const equalish = Math.abs(1 - ratio) <= 0.02;
            let massOk = equalish || ratio >= 1.10;
            
            // Lightning power-up restriction: can only eat opponents at least 20% smaller
            if ((ownerBig as any).lightningTimer > 0) {
              massOk = equalish || ratio >= 1.2; // Need 20% more mass when lightning is active
            }
            
            const distOk = d + 0.60 * smaller.radius < bigger.radius;
            const canEatNow = massOk && distOk && ownerBig.invincibleTimer <= 0 && ownerSmall.invincibleTimer <= 0;
            if (canEatNow){
              bigger.mass += smaller.mass; bigger.radius = radiusFromMass(bigger.mass);
              const idx = ownerSmall.cells.indexOf(smaller); if (idx>=0) ownerSmall.cells.splice(idx,1);
              if (ownerSmall.cells.length===0) ownerSmall.alive = false;
              
              // Award XP for kills (only for human player killing non-bot)
              if (ownerBig.id === this.me && !ownerSmall.isBot) {
                this.matchTracker.kill(); // Awards 15 XP for valid kill
              }
              
              return true;
            }
            const touching = d < (a.radius + b.radius);
            if (massOk && touching){
              const n = { x: dx/(d||1), y: dy/(d||1) }; const pull = (a.radius + b.radius - d) * 0.25;
              smaller.pos.x += (ownerBig===p ? -n.x : n.x) * pull; smaller.pos.y += (ownerBig===p ? -n.y : n.y) * pull;
              bigger.pos.x  += (-n.x) * 0.05 * pull; bigger.pos.y  += (-n.y) * 0.05 * pull;
            } else {
              const minDist = (a.radius + b.radius) * 0.95;
              if (d < minDist){ const n = { x: dx/(d||1), y: dy/(d||1) }; const push = (minDist - d) * 0.45; b.pos.x += n.x*push; b.pos.y += n.y*push; a.pos.x -= n.x*push; a.pos.y -= n.y*push; }
            }
          }
        }
      }
    }
    return false;
  }

  private doSelfMergeForPlayer(p: PlayerState, dt: number) {
    // Cooldowns runterzählen und Split-Zeit tracken
    for (const c of p.cells) {
      c.mergeCooldown = Math.max(0, (c.mergeCooldown ?? 0) - dt);
      if ((c as any)._splitTime !== undefined) {
        (c as any)._splitTime += dt;
      }
    }
    if (p.cells.length <= 1) return;

    // Paarweise Annäherung & Merge
    for (let i = 0; i < p.cells.length; i++) {
      for (let j = i + 1; j < p.cells.length; j++) {
        const a = p.cells[i], b = p.cells[j];
        const dx = b.pos.x - a.pos.x, dy = b.pos.y - a.pos.y;
        const d  = Math.hypot(dx, dy) || 1;
        const sumR = a.radius + b.radius;

        const aCD = (a.mergeCooldown ?? 0) > 0;
        const bCD = (b.mergeCooldown ?? 0) > 0;
        
        // Force merge after 15 seconds regardless of cooldown
        const aSplitTime = (a as any)._splitTime ?? 0;
        const bSplitTime = (b as any)._splitTime ?? 0;
        const shouldForceMerge = aSplitTime >= FORCE_MERGE_TIME || bSplitTime >= FORCE_MERGE_TIME;

        // Abstoß, wenn Cooldown aktiv (aber moderat, sonst Schaukeln)
        if ((aCD || bCD) && !shouldForceMerge) {
          if (d < sumR * 0.98) {
            const ux = dx / d, uy = dy / d;
            const push = 14; // sanfte Trennung
            a.vel.x -= ux * push; a.vel.y -= uy * push;
            b.vel.x += ux * push; b.vel.y += uy * push;
          }
          continue;
        }

        // Kein Cooldown oder Force-Merge -> sanfte Annäherung und ggf. Merge
        const near = sumR * MERGE_NEAR_FACTOR;
        const trigger = shouldForceMerge ? sumR * 1.2 : sumR * MERGE_TRIGGER_FACTOR; // Easier merge when forced

        if (d < near && d >= trigger) {
          // sanfter Zug zusammen (stärker bei Force-Merge)
          const ux = dx / d, uy = dy / d;
          const pullStrength = shouldForceMerge ? MERGE_PULL_NEAR * 3.0 : MERGE_PULL_NEAR;
          const pull = (near - d) * pullStrength; // proportional
          a.vel.x += ux * pull * 0.5; a.vel.y += uy * pull * 0.5;
          b.vel.x -= ux * pull * 0.5; b.vel.y -= uy * pull * 0.5;
        } else if (d < trigger) {
          // tiefe Überdeckung → Merge
          const totalMass = a.mass + b.mass;
          const cx = (a.pos.x * a.mass + b.pos.x * b.mass) / totalMass;
          const cy = (a.pos.y * a.mass + b.pos.y * b.mass) / totalMass;
          const vx = (a.vel.x * a.mass + b.vel.x * b.mass) / totalMass;
          const vy = (a.vel.y * a.mass + b.vel.y * b.mass) / totalMass;

          a.mass = totalMass;
          a.radius = radiusFromMass(a.mass);
          a.pos.x = cx; a.pos.y = cy;
          a.vel.x = vx; a.vel.y = vy;

          a.mergeCooldown = this.mergeCooldownForMass(a.mass);
          delete (a as any)._splitTime; // Reset split time after merge
          delete (a as any)._forceReturning; // Reset force returning flag

          // b entfernen
          p.cells.splice(j, 1);
          j--;
        }
      }
    }
  }

  private updateParticles(dt:number){
    for (let i=this.particles.length-1;i>=0;i--){
      const p = this.particles[i];
      p.pos.x += p.vel.x*dt; p.pos.y += p.vel.y*dt;
      if (p.type==='spark' || p.type==='streak'){ p.vel.x *= 0.96; p.vel.y *= 0.96; }
      p.life -= dt/(p.fade || 1);
      if (p.life <= 0) this.particles.splice(i,1);
    }
    if (this.particles.length > this.maxParticles) this.particles.splice(0, this.particles.length - this.maxParticles);
  }

  private getRank(id:string): number {
    const arr:{id:string; mass:number}[] = [];
    for (const [pid, ps] of this.players){ if (ps.alive) arr.push({ id: pid, mass: this.totalMass(ps) }); }
    arr.sort((a,b)=> b.mass - a.mass);
    const idx = arr.findIndex(x=> x.id === id);
    return (idx>=0? idx : arr.length-1) + 1;
  }

  private ensureBotCount(){
    let aliveBots = 0; for (const [,p] of this.players) if (p.isBot && p.alive) aliveBots++;
    if (aliveBots >= this.targetBotCount) return;
    const need = this.targetBotCount - aliveBots;
    const deadBots: PlayerState[] = []; for (const [,p] of this.players) if (p.isBot && !p.alive) deadBots.push(p);
    let revived = 0;
    for (const p of deadBots){ if (revived >= need) break; this.respawnBot(p); revived++; }
    for (; revived < need; revived++){
      const id = this.uuid(); const m0 = rand(50,150); const pad = this.outsidePad(0); const pos = this.findSafeSpawnPos(pad);
      this.players.set(id, { id, color:`hsl(${Math.floor(rand(0,360))} 80% 65%)`, name: BOT_NAMES[this.players.size % BOT_NAMES.length], alive:true, isBot:true, invincibleTimer:0, multishotTimer:0, speedBoostTimer:0, cells:[ makeCell(m0, pos) ], skinCanvas: randomSkinCanvas(), skinPattern: undefined } as any);
    }
  }

  private respawnBot(p: PlayerState){
    p.alive = true; p.invincibleTimer = 1.2; p.multishotTimer = 0; p.speedBoostTimer = 0;
    const m0 = rand(50,150); const pad = this.outsidePad(0); const pos = this.findSafeSpawnPos(pad);
    p.cells = [ makeCell(m0, pos) ]; p.name = BOT_NAMES[randInt(0, BOT_NAMES.length-1)];
    (p as any).skinCanvas = (p as any).skinCanvas || randomSkinCanvas();
  }

  private tickSplitMotion(c: any, dt: number) {
    if (!c._splitTarget) return;

    // Richtung zum Ziel
    const dx = c._splitTarget.x - c.pos.x;
    const dy = c._splitTarget.y - c.pos.y;
    const dist = Math.hypot(dx, dy);

    // Früh ankommend oder 200px erreicht?
    if (dist <= Math.max(2, c.radius * 0.25) || ((c._splitRemain ?? 0) <= 0)) {
      // Hard snap ans Ziel, dann sofort zurück zur größten Zelle
      c.pos.x = c._splitTarget.x;
      c.pos.y = c._splitTarget.y;
      delete c._splitTarget;
      delete c._splitTotal;
      delete c._splitRemain;
      delete c._splitImpulse;
      
      // Sofort zurück zur größten Zelle fliegen
      const player = this.findPlayerByCell(c);
      if (player) {
        const main = this.largestCell(player);
        if (main && main !== c) {
          const rdx = main.pos.x - c.pos.x;
          const rdy = main.pos.y - c.pos.y;
          const rd = Math.hypot(rdx, rdy) || 1;
          const returnSpeed = 350; // Geschwindigkeit für Rückkehr
          c.vel.x = (rdx / rd) * returnSpeed;
          c.vel.y = (rdy / rd) * returnSpeed;
          (c as any)._returning = true; // Flag für Rückkehr-Status
        } else if (player.cells.length > 1) {
          // Falls alle gleich groß sind, nimm einfach die erste andere Zelle
          const other = player.cells.find(cell => cell !== c);
          if (other) {
            const rdx = other.pos.x - c.pos.x;
            const rdy = other.pos.y - c.pos.y;
            const rd = Math.hypot(rdx, rdy) || 1;
            const returnSpeed = 350;
            c.vel.x = (rdx / rd) * returnSpeed;
            c.vel.y = (rdy / rd) * returnSpeed;
            (c as any)._returning = true;
          } else {
            c.vel.x = 0;
            c.vel.y = 0;
          }
        } else {
          c.vel.x = 0;
          c.vel.y = 0;
        }
      }
      return;
    }

    // Impulsphase -> starke Dämpfung, sonst weiche Dämpfung
    const damp = (c._splitImpulse && c._splitImpulse > 0) ? SPLIT_DAMP_STRONG : SPLIT_DAMP_SOFT;
    c.vel.x *= damp;
    c.vel.y *= damp;

    // sanft Richtung Ziel steuern (ohne Übersteuerung)
    const ux = dx / (dist || 1);
    const uy = dy / (dist || 1);
    const steer = 18; // kleiner Steuerimpuls pro Tick
    c.vel.x += ux * steer;
    c.vel.y += uy * steer;

    // Speed-Cap abhängig von Masse
    const cap = SPLIT_SPEED_CAP_BASE + SPLIT_SPEED_CAP_K / Math.sqrt(c.mass);
    const v = Math.hypot(c.vel.x, c.vel.y);
    if (v > cap) {
      const s = cap / v;
      c.vel.x *= s; c.vel.y *= s;
    }

    // Integrate
    c.pos.x += c.vel.x * dt;
    c.pos.y += c.vel.y * dt;

    // Restdistanz runterzählen/Impulszeit verringern
    if (typeof c._splitRemain === 'number') {
      c._splitRemain = Math.max(0, c._splitRemain - v * dt);
    }
    if (typeof c._splitImpulse === 'number') {
      c._splitImpulse = Math.max(0, c._splitImpulse - dt);
    }
  }

  private findPlayerByCell(cell: Cell): PlayerState | null {
    for (const [, player] of this.players) {
      if (player.cells.includes(cell)) {
        return player;
      }
    }
    return null;
  }
}
