// game.ts (modular, with star effect, rainbow border, better merging, shorter rockets, scoreboard)
// ------------------------------------------------------------------------------------------------------------------
import { clamp, rand, randInt, norm, radiusFromMass, speedFromMass, sum } from './utils';
import type { PlayerState, Pellet, Virus, PowerUp, PowerUpType, Bullet, Cell, PlayerConfig } from './types';
import type { InputState } from './input';
import { LevelDesign } from './LevelDesign';
import { makeSkinCanvas, patternFromCanvas, randomSkinCanvas } from './skins';
import { spawnPowerUps, drawPowerUp, applyPowerUp } from './powerups';
import { updateBots, BotParams } from './bots';

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
  target: { x: number; y: number; r: number; m: number }
): boolean {
  // Größenregel: mindestens 25 % mehr Masse
  if (eater.m < target.m * 1.25) return false;

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

  world = { w: 8000, h: 8000 };

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
  
  private targetBotCount = 89;
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

  // Eject (W)
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
  private pelletTarget = 1000;
  private initialPelletCount = 360;
  private maxParticles = 900;

  constructor(canvas: HTMLCanvasElement){
    this.canvas = canvas;

    const updateCanvasSize = () => {
      // Match backing store to CSS pixels to avoid Safari 100vh/URL bar issues
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
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

    // Detect mobile (coarse pointer) and apply performance preset
    try {
      this.isMobile = typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    } catch { this.isMobile = false; }
    this.applyPerfPreset();

    updateCanvasSize();
  }

  private applyPerfPreset(){
    if (this.isMobile){
      this.targetBotCount = 89; // keep 89 bots even on mobile
      this.pelletTarget = 700;
      this.initialPelletCount = Math.max(100, Math.round(this.pelletTarget/6));
      this.greenMax = Math.min(this.greenMax, 12);
      this.redMax = Math.min(this.redMax, 3);
      this.redBulletsPerVolley = Math.min(this.redBulletsPerVolley, 10);
      this.auraEveryN = Math.max(this.auraEveryN, 8);
      this.mobileNoShadows = true;
      this.maxParticles = 350;
    } else {
      this.targetBotCount = 89; // desktop also 89
      this.pelletTarget = 1000;
      this.initialPelletCount = 360;
      this.maxParticles = 900;
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

  spawnPowerUps(count:number){
    const pad = this.outsidePad(0);
    this.powerups = spawnPowerUps(this.world.w, this.world.h, count, pad, this.viruses);
  }

  spawnPlayers(nBots: number, config?: PlayerConfig) {
    this.me = crypto.randomUUID();

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
      const id = crypto.randomUUID();
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

  // —— Virus-Kollision / Essen —— 
  private handleVirusCollision(p: PlayerState, c: Cell, vv: any){
    const dx = c.pos.x - vv.pos.x, dy = c.pos.y - vv.pos.y;
    const d  = Math.hypot(dx,dy);
    const minDist = c.radius + vv.radius * 0.98;

    // eating rule: very big cells can consume green
    if (vv.kind==='green' && d < c.radius - 0.2*vv.radius){
      if (c.mass >= 1000){
        const gain = (c.mass >= 2000) ? 10 : 50;
        c.mass += gain;
        c.radius = radiusFromMass(c.mass);
        const idx = this.viruses.indexOf(vv);
        if (idx>=0) this.viruses.splice(idx,1);
        return;
      }
    }

    // block & maybe split
    if (d < minDist) {
      const nx = dx / (d || 1), ny = dy / (d || 1);
      const push = (minDist - d);
      c.pos.x += nx * push;
      c.pos.y += ny * push;
      c.vel.x *= 0.75; c.vel.y *= 0.75;

      // If player is invincible (star), shove the green virus away and do NOT split
      if (vv.kind==='green' && p.invincibleTimer > 0){
        vv.pos.x -= nx * push * 1.2;
        vv.pos.y -= ny * push * 1.2;
        if (vv.vel){ vv.vel.x -= nx * 60; vv.vel.y -= ny * 60; } else { vv.vel = { x: -nx*60, y: -ny*60 }; }
        return;
      }

      if (c.mass > 200) this.splitCellOnVirus(p, c, vv);
    }
  }

  // Split a cell into multiple pieces when it collides with a green virus
  private splitCellOnVirus(p: PlayerState, c: Cell, vv: any){
    if (!vv || vv.kind !== 'green') return;
    const totalMass = c.mass;
    // Determine how many pieces, limited by free slots and a cap
    const freeSlots = Math.max(0, 16 - p.cells.length);
    const maxPiecesTotal = Math.min(1 + freeSlots, 8); // including the original cell
    if (maxPiecesTotal <= 1) return;

    const desiredPieces = Math.max(2, Math.min(maxPiecesTotal, Math.floor(totalMass / 120)));
    const pieces = Math.max(2, Math.min(maxPiecesTotal, desiredPieces));
    const massEach = Math.max(10, totalMass / pieces);

    // Base direction away from virus
    const ang0 = Math.atan2(c.pos.y - vv.pos.y, c.pos.x - vv.pos.x);
    const speed = this.splitSpeed * 1.1;

    // Update original as one piece
    c.mass = massEach;
    c.radius = radiusFromMass(c.mass);
    c.mergeCooldown = this.mergeTime;

    for (let k=1; k<pieces; k++){
      const ang = ang0 + (k * (Math.PI * 2 / pieces));
      const dx = Math.cos(ang), dy = Math.sin(ang);
      const out = makeCell(massEach,
        { x: c.pos.x + dx * (c.radius * 0.9), y: c.pos.y + dy * (c.radius * 0.9) },
        { x: dx * speed, y: dy * speed }
      );
      out.mergeCooldown = this.mergeTime;
      p.cells.push(out);
    }
    // schedule staged merges for all cells (smallest pair first)
    this.scheduleMergeBatches(p);
  }

  private tryPlayerSplit(p: PlayerState, dir:{x:number;y:number}){
    // If we have many equal-mass chunks, always split the largest one; on ties, pick the front-most
    // along the current swim direction from the player's center of mass.
    if (p.cells.length >= 16) return;
    const eligible = p.cells.filter(c => c.mass >= this.minSplitMass*2);
    if (eligible.length === 0) return;

    // largest mass among eligible
    let maxMass = -Infinity;
    for (const c of eligible) maxMass = Math.max(maxMass, c.mass);
    const EPS = 1e-6;
    const candidates = eligible.filter(c => Math.abs(c.mass - maxMass) <= EPS);

    // center of mass for tie-break
    let mx = 0, my = 0, M = 0;
    for (const c of p.cells){ mx += c.pos.x * c.mass; my += c.pos.y * c.mass; M += c.mass; }
    mx /= Math.max(1,M); my /= Math.max(1,M);

    let src = candidates[0];
    if (candidates.length > 1){
      let best = -Infinity;
      for (const c of candidates){
        const fx = c.pos.x - mx, fy = c.pos.y - my;
        const score = fx*dir.x + fy*dir.y; // front-most along swim direction
        if (score > best){ best = score; src = c; }
      }
    }

    const preMass = src.mass;
    const half = src.mass / 2;
    src.mass = half;
    src.radius = radiusFromMass(src.mass);

    const out = makeCell(half,
      { x: src.pos.x + dir.x*(src.radius*0.8), y: src.pos.y + dir.y*(src.radius*0.8) },
      { x: dir.x*this.splitSpeed, y: dir.y*this.splitSpeed }
    );

    // New piecewise ballistic split distance with safe-zone clamp
    let travelDist: number;
    const m = preMass;
    if (m < 120) {
      travelDist = out.radius * 12;
    } else if (m <= 800) {
      const t = (m - 120) / (800 - 120); // 0..1
      const k = 12 - 5 * Math.max(0, Math.min(1, t)); // 12 -> 7
      travelDist = out.radius * k;
    } else if (m <= 2500) {
      travelDist = 220;
    } else {
      travelDist = 160;
    }
    // clamp by current safe-zone radius fraction
    const zoneCap = Math.max(60, 0.18 * this.lastZoneR);
    travelDist = Math.min(travelDist, zoneCap);

    const target = { x: out.pos.x + dir.x * travelDist, y: out.pos.y + dir.y * travelDist };
    (out as any)._splitTarget = target;
    (out as any)._splitTotal  = travelDist;
    
    // initial very fast kick
    const v0 = this.splitSpeed * 2.8;
    out.vel.x = dir.x * v0;
    out.vel.y = dir.y * v0;
    
    src.vel.x -= dir.x*this.recoil;
    src.vel.y -= dir.y*this.recoil;
    
    // set cooldowns; batches will be scheduled below
    src.mergeCooldown = this.mergeTime;
    out.mergeCooldown = this.mergeTime;
    
    p.cells.push(out);
    // schedule staged merges for all cells (smallest pairs first)
    this.scheduleMergeBatches(p);
  }

  // Placeholder for staged merge scheduling (smallest pairs first)
  private scheduleMergeBatches(p: PlayerState){
    // Assign batch index per cell: two smallest first, then next two, etc.
    const sorted = [...p.cells].sort((a,b)=>a.radius-b.radius);
    let batch = 0;
    for (let i=0; i<sorted.length; i+=2){
      const a = sorted[i];
      const b = sorted[i+1];
      (a as any)._mergeBatch = batch;
      if (b) (b as any)._mergeBatch = batch;
      batch++;
    }
    (p as any)._mergeBatchReleased = -1; // none released yet
    (p as any)._mergeBatchTimer = this.pairMergeDelay;
  }

  // --- Self-collision & Merging (Agar-like) ---
  private doSelfMergeForPlayer(p: PlayerState, dt:number){
    // staged merge ticking: release one batch every pairMergeDelay
    const pp:any = p as any;
    if (pp._mergeBatchTimer !== undefined){
      pp._mergeBatchTimer -= dt;
      // find max batch index currently assigned
      let maxBatch = -1;
      for (const c of p.cells){ const mb = (c as any)._mergeBatch; if (mb !== undefined) maxBatch = Math.max(maxBatch, mb); }
      if (pp._mergeBatchTimer <= 0 && pp._mergeBatchReleased < maxBatch){
        pp._mergeBatchReleased = Math.min(pp._mergeBatchReleased + 1, maxBatch);
        pp._mergeBatchTimer += this.pairMergeDelay;
      }
    }

    // cooldown tick and ensure each cell knows its max cooldown for phased pulls
    for (const c of p.cells) {
      c.mergeCooldown = Math.max(0, (c.mergeCooldown ?? 0) - dt);
      const mc = (c as any)._mergeMaxCooldown;
      if (mc === undefined) (c as any)._mergeMaxCooldown = c.mergeCooldown ?? 0;
    }

    const main = this.largestCell(p);

    for (let i=0;i<p.cells.length;i++){
      for (let j=i+1;j<p.cells.length;j++){
        const a = p.cells[i], b = p.cells[j];
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;
        let d  = Math.hypot(dx,dy);
        if (d === 0) d = 1e-6;
        const n = { x: dx/d, y: dy/d };
        const sumR = a.radius + b.radius;
        const overlap = sumR - d; // >0 means intersecting
        const anyCooldown = ((a.mergeCooldown ?? 0) > 0) || ((b.mergeCooldown ?? 0) > 0);
        // Stage gating: treat as in-cooldown (solid) until both cells' batches are released
        let stagedLocked = false;
        if (pp._mergeBatchReleased !== undefined){
          const ba = (a as any)._mergeBatch; const bb = (b as any)._mergeBatch;
          if (ba !== undefined && bb !== undefined){
            if (!(ba <= pp._mergeBatchReleased && bb <= pp._mergeBatchReleased)) stagedLocked = true;
          }
        }

        if (anyCooldown || stagedLocked){
          if (overlap > 0){
            // solid separation with damping
            const totalMass = Math.max(1, a.mass + b.mass);
            const wa = b.mass / totalMass, wb = a.mass / totalMass;
            const push = overlap * this.selfSolidPush;
            a.pos.x -= n.x * push * wa; a.pos.y -= n.y * push * wa;
            b.pos.x += n.x * push * wb; b.pos.y += n.y * push * wb;
            a.vel.x *= 0.96; a.vel.y *= 0.96; b.vel.x *= 0.96; b.vel.y *= 0.96;
          } else {
            // long-range cooldown attraction (both ways)
            const cd = Math.min((a.mergeCooldown ?? 0), (b.mergeCooldown ?? 0));
            const maxA = Math.max((a as any)._mergeMaxCooldown || this.mergeTime, 1e-6);
            const maxB = Math.max((b as any)._mergeMaxCooldown || this.mergeTime, 1e-6);
            const phase = 1 - Math.min(1, cd / Math.max(maxA, maxB));
            const maxRange = Math.max(sumR * 8.0, 600);
            if (d < maxRange){
              const totalMass = Math.max(1, a.mass + b.mass);
              const wa = b.mass / totalMass, wb = a.mass / totalMass;
              const closeness = 1 - (d / maxRange);
              const accel = 160 * this.selfCooldownPull * (0.5 + 0.5*phase) * closeness;
              a.vel.x +=  n.x * accel * wb * dt; a.vel.y +=  n.y * accel * wb * dt;
              b.vel.x += -n.x * accel * wa * dt; b.vel.y += -n.y * accel * wa * dt;
            }
          }
        } else {
          // soft cohesion when batches are released: only pull when too far, no push when close
          const target = sumR * 0.96; // aim for slight overlap
          if (d > target){
            const k = this.selfCohesionK, damp = this.selfCohesionDamp;
            const totalMass = Math.max(1, a.mass + b.mass);
            const wa = b.mass/totalMass, wb = a.mass/totalMass;
            const pull = (d - target);
            // attract both towards each other
            a.vel.x += n.x * pull * k * wb; a.vel.y += n.y * pull * k * wb;
            b.vel.x -= n.x * pull * k * wa; b.vel.y -= n.y * pull * k * wa;
            a.vel.x *= (1-damp*dt); a.vel.y *= (1-damp*dt);
            b.vel.x *= (1-damp*dt); b.vel.y *= (1-damp*dt);
          }

          // merge when sufficient overlap exists
          if (d < sumR * 0.98){
            const m = a.mass + b.mass;
            const pos = { x: (a.pos.x*a.mass + b.pos.x*b.mass)/m, y:(a.pos.y*a.mass + b.pos.y*b.mass)/m };
            a.pos = pos; a.mass = m; a.radius = radiusFromMass(m);
            a.vel.x = (a.vel.x + b.vel.x)*0.5; a.vel.y = (a.vel.y + b.vel.y)*0.5;
            p.cells.splice(j,1); j--; continue;
          }
        }
      }
    }

    // After applying merge forces, clamp velocities to avoid runaway speeds before next integration
    for (const c of p.cells){
      const maxVel = speedFromMass(c.mass) * 1.65;
      c.vel.x = clamp(c.vel.x, -maxVel, maxVel);
      c.vel.y = clamp(c.vel.y, -maxVel, maxVel);
    }

    // During cooldown or unreleased stage, gently pull all pieces toward the main cell; also keep pulling when far apart
    if (main){
      for (const c of p.cells){
        if (c === main) continue;
        const dx = main.pos.x - c.pos.x, dy = main.pos.y - c.pos.y;
        const d = Math.hypot(dx,dy) || 1;
        const n = { x: dx/d, y: dy/d };
        const sumR = main.radius + c.radius;
        const unreleased = (pp._mergeBatchReleased !== undefined && (c as any)._mergeBatch !== undefined) ? ((c as any)._mergeBatch > pp._mergeBatchReleased) : false;
        if ((c.mergeCooldown ?? 0) > 0 || unreleased || d > sumR * 1.05){
          const accel = this.mainAttractAccel / Math.max(1, Math.sqrt(c.mass));
          c.vel.x += n.x * accel * dt;
          c.vel.y += n.y * accel * dt;
        }
      }
    }
  }

  trySplitOnVirus(p: PlayerState, c: Cell, v: Virus){
    this.handleVirusCollision(p, c, v as any);
  }

  pickPowerUp(p: PlayerState, c: Cell, pu: PowerUp){
    const idx = p.cells.indexOf(c);
    applyPowerUp(p, idx, pu);
  }

  // Raketenfeuer (Player/Bot), rockets shorter range
  fireBulletsIfNeeded(dtSec:number, input: InputState){
    for (const [, p] of this.players){
      if (!p.alive || p.multishotTimer <= 0) continue;
      const c = this.largestCell(p);
      if (!c) continue;

      const shotsPerSec = 3;
      if (Math.random() < shotsPerSec*dtSec){
        let dir: {x:number;y:number};
        if (p.id === this.me) {
          const scale = Math.min(this.canvas.width/1920, this.canvas.height/1080) * this.currentZoom;
          const wp = this.updateWorldPosition(c.pos.x, c.pos.y, scale, input);
          dir = norm(wp.worldX - c.pos.x, wp.worldY - c.pos.y);
        } else {
          // simple bot aim: closest target it can eat
          let target: {x:number;y:number}|null = null;
          let best = Infinity;
          for (const [, q] of this.players){
            if (!q.alive || q.id===p.id) continue;
            if (this.totalMass(p) < this.totalMass(q)) continue;
            for (const qc of q.cells){
              const d = Math.hypot(qc.pos.x - c.pos.x, qc.pos.y - c.pos.y);
              if (d<best){ best=d; target={x:qc.pos.x,y:qc.pos.y}; }
            }
          }
          dir = target ? norm(target.x - c.pos.x, target.y - c.pos.y) : {x:1,y:0};
        }

        const speed = 420;
        const mass  = 8;
        const range = 260; // reduced rocket range
        this.bullets.push({
          kind:'rocket',
          pos: { x: c.pos.x, y: c.pos.y },
          vel: { x: dir.x*speed, y: dir.y*speed },
          mass,
          owner: p.id,
          ttl: 3.0,
          rangeLeft: range,
          explodeAtEnd: true,
        });
      }
    }
  }

  // Maus → Welt
  private updateWorldPosition(centerX: number, centerY: number, scale: number, input: InputState) {
    const screenCenterX = this.canvas.width / 2;
    const screenCenterY = this.canvas.height / 2;
    const worldX = centerX + ((input.targetX ?? screenCenterX) - screenCenterX) / scale;
    const worldY = centerY + ((input.targetY ?? screenCenterY) - screenCenterY) / scale;
    return { worldX, worldY };
  }

  // ---------- Step ----------
  step(dtMs: number, input: InputState, elapsed: number) {
    const dt = dtMs/1000;
    const zonePad = this.outsidePad(elapsed);
    const { cx, cy, R } = zoneCircle(this.world.w, this.world.h, zonePad);
    this.lastZoneR = R; // remember current safe-zone radius for split range clamp
    this.frameIndex++;

    // zoom bias
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
    }

    // Speed boost taps (mouse left or mobile speed button)
    if (me?.alive) {
      const taps:number = (input as any).speedTapCount || 0;
      if (taps > 0) {
        // Each tap: small temporary boost and small mass cost
        me.speedBoostTimer = Math.min(2.0, (me.speedBoostTimer || 0) + 0.35);
        const cost = 1; // 1 Punkt pro Klick
        // remove cost from the smallest cell first
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
      // NEW: magnet timer
      (p as any).magnetTimer = Math.max(0, ((p as any).magnetTimer||0) - dt);
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
        this.tryPlayerSplit(me, sdir);
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

    // Movement tick @ 30 Hz: set per-cell target velocities using unified curve and caps
    this.moveTickAccum += dt;
    let mvSteps = 0;
    while (this.moveTickAccum >= this.moveTickStep && mvSteps < 2) {
      // Local player cells: target = aimDir * speedFromMass(cell.mass) * multipliers
      if (me?.alive) {
        let speedMul = (input as any).dash ? 1.22 : 1.0;
        if (me.invincibleTimer>0) speedMul *= 2.0;
        if ((me.speedBoostTimer||0) > 0) speedMul *= 1.10;
        for (const c of me.cells){
          const vCap = speedFromMass(Math.max(1, c.mass)) * speedMul;
          (c as any)._mvTarget = { x: aimDir.x * vCap, y: aimDir.y * vCap, cap: vCap };
        }
      }
      this.moveTickAccum -= this.moveTickStep;
      mvSteps++;
    }

    // Bot AI @ 30 Hz (throttled). Accumulate time and step at fixed rate; cap catch-up to avoid spirals.
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
        const tgt = (c as any)._splitTarget as {x:number;y:number}|undefined;
        if (tgt){
          // decelerating flight toward target; stop precisely at target
          const dx = tgt.x - c.pos.x, dy = tgt.y - c.pos.y;
          const dist = Math.hypot(dx, dy);
          const total = Math.max(1e-3, (c as any)._splitTotal || dist);
          if (dist <= Math.max(2, c.radius*0.25)){
            c.pos.x = tgt.x; c.pos.y = tgt.y;
            // remove ballistic target and immediately start returning toward the main cell
            delete (c as any)._splitTarget; delete (c as any)._splitTotal;
            const mc = this.largestCell(p);
            if (mc && mc !== c){
              const rdx = mc.pos.x - c.pos.x, rdy = mc.pos.y - c.pos.y;
              const rd  = Math.hypot(rdx, rdy) || 1;
              const kick = 280; // px/s initial return speed
              c.vel.x = (rdx/rd) * kick;
              c.vel.y = (rdy/rd) * kick;
            } else {
              c.vel.x = 0; c.vel.y = 0;
            }
          } else {
            const n = { x: dx/(dist||1), y: dy/(dist||1) };
            const tfrac = clamp(dist / total, 0, 1);
            const v0 = this.splitSpeed * 2.8; // very fast at start
            const speed = v0 * (0.20 + 0.80 * tfrac); // gentler decel
            const maxSpeed = Math.min(speed, dist / Math.max(dt, 1e-3));
            c.vel.x = n.x * maxSpeed;
            c.vel.y = n.y * maxSpeed;
          }
        } else {
          // natural damping
          c.vel.x *= 0.92;
          c.vel.y *= 0.92;
          // Smooth toward movement target (if present) with max acceleration per frame
          const mv:any = (c as any)._mvTarget;
          if (mv){
            const dvx = mv.x - c.vel.x, dvy = mv.y - c.vel.y;
            const dvm = Math.hypot(dvx, dvy);
            if (dvm > 0){
              const maxDelta = this.maxAccel * dt;
              const s = Math.min(1, maxDelta / dvm);
              c.vel.x += dvx * s;
              c.vel.y += dvy * s;
            }
          }
        }
        // Per-cell cap using unified curve + temporary multipliers (skip during ballistic split)
        if (!(c as any)._splitTarget) {
          let mul = 1.0;
          if (p.invincibleTimer>0) mul *= 2.0;
          if ((p as any).speedBoostTimer > 0) mul *= 1.10;
          const vCap = speedFromMass(Math.max(1, c.mass)) * mul;
          const mag = Math.hypot(c.vel.x, c.vel.y);
          if (mag > vCap){ const s = vCap / (mag || 1); c.vel.x *= s; c.vel.y *= s; }
        }

        c.pos.x = clamp(c.pos.x + c.vel.x * dt, 0, this.world.w);
        c.pos.y = clamp(c.pos.y + c.vel.y * dt, 0, this.world.h);

        // Clamp to circular zone softly
        const dxC = c.pos.x - cx, dyC = c.pos.y - cy;
        const dC = Math.hypot(dxC, dyC) || 1;
        if (dC > R){
          const s = (R - 0.5) / dC; // keep slightly inside
          c.pos.x = cx + dxC * s;
          c.pos.y = cy + dyC * s;
          if (p.invincibleTimer<=0){
            c.mass = Math.max(10, c.mass - this.zoneDps * dt);
            c.radius = radiusFromMass(c.mass);
          }
        }
      }
    }

    // Remove old rectangle zone clamp/damage. Circular is handled above.

    // Star aura (throttled, r² checks): gently attract nearby enemy cells within 10px of surface
    if (this.frameIndex % this.auraEveryN === 0) {
      for (const [, s] of this.players){
        if (!s.alive || s.invincibleTimer <= 0) continue;
        for (const sc of s.cells){
          for (const [, p2] of this.players){
            if (!p2.alive || p2.id === s.id) continue;
            if (p2.invincibleTimer > 0) continue; // don't pull other invincible players
            for (const oc of p2.cells){
              const dx = sc.pos.x - oc.pos.x, dy = sc.pos.y - oc.pos.y;
              const sumR = sc.radius + oc.radius;
              const limit = 10; // within 10px of surface
              const sumPlus = sumR + limit;
              const d2 = dx*dx + dy*dy;
              if (d2 <= sumPlus*sumPlus){
                const d = Math.sqrt(d2) || 1;
                const gap = d - sumR;
                const nx = dx / d, ny = dy / d;
                const factor = clamp(1 - Math.max(0, gap) / limit, 0, 1); // 0..1
                // compensate for skipped frames
                const accel = 120 * factor * this.auraEveryN; // px/s^2
                oc.vel.x += nx * accel * dt;
                oc.vel.y += ny * accel * dt;
              }
            }
          }
        }
      }
    }

    // Magnet aura (throttled, r² checks): attract pellets within 100px of cell surface
    if (this.frameIndex % this.auraEveryN === 0) {
      for (const [, s] of this.players){
        const magT = (s as any).magnetTimer || 0;
        if (!s.alive || magT <= 0) continue;
        for (const sc of s.cells){
          const reach = sc.radius + 100;
          const reach2 = reach * reach;
          for (const pl of this.pellets as any[]){
            const dx = sc.pos.x - pl.pos.x, dy = sc.pos.y - pl.pos.y;
            const d2 = dx*dx + dy*dy;
            if (d2 <= reach2){
              const d = Math.sqrt(d2) || 1;
              const gap = d - sc.radius; // pellet ~ point
              const nx = dx / d, ny = dy / d;
              const factor = clamp(1 - Math.max(0, gap) / 100, 0, 1);
              const accel = 220 * factor * this.auraEveryN; // compensate skipped frames
              if (!pl.vel) pl.vel = { x: 0, y: 0 };
              pl.vel.x += nx * accel * dt;
              pl.vel.y += ny * accel * dt;
            }
          }
        }
      }
    }

    // Pellet physics
    for (const pl of this.pellets as any[]){
      if ((pl as any).vel){
        pl.pos.x += pl.vel.x * dt;
        pl.pos.y += pl.vel.y * dt;
        pl.vel.x *= 0.93; pl.vel.y *= 0.93;
      }
      if ((pl as any).life !== undefined) (pl as any).life -= dt;
    }

    // Virus feeding from ejects
    for (let pi=(this.pellets as any[]).length-1; pi>=0; pi--){
      const pl:any = (this.pellets as any[])[pi];
      if (!pl.vel) continue;
      for (const v of this.viruses as any[]){
        if (v.kind === 'red') continue;
        const dx = pl.pos.x - v.pos.x, dy = pl.pos.y - v.pos.y;
        if (Math.hypot(dx,dy) <= (v.radius + 4)){
          v.fed = (v.fed||0)+1;
          v._lastDir = { x: pl.vel.x, y: pl.vel.y };
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
        // project into current circular safe zone so green never spawns at the edge
        const dxC = nv.pos.x - cx, dyC = nv.pos.y - cy; const dC = Math.hypot(dxC,dyC) || 1;
        const maxD = Math.max(0, R - nv.radius - 2);
        if (dC > maxD){ nv.pos.x = cx + dxC/dC * maxD; nv.pos.y = cy + dyC/dC * maxD; }
        // cap total green viruses
        const greens = this.viruses.filter(x => (x as any).kind === 'green').length;
        if (greens < this.greenMax) this.viruses.push(nv);
        v.fed = 0;
      }
    }

    // Eat pellets
    for (let i=this.pellets.length-1; i>=0; i--){
      const pl = this.pellets[i] as any;
      let eaten = false;
      this.players.forEach(p=>{
        if (eaten || !p.alive) return;
        for (const c of p.cells){
          const d = Math.hypot(pl.pos.x - c.pos.x, pl.pos.y - c.pos.y);
          if (d < c.radius * 0.9){
            const gain = (pl.mass ?? randInt(3,5));
            c.mass += gain;
            c.radius = radiusFromMass(c.mass);
            eaten = true;
            // respawn pellet within circular zone
            const ang = Math.random()*Math.PI*2;
            const rr  = Math.sqrt(Math.random()) * Math.max(0, R - 60);
            const px  = cx + Math.cos(ang)*rr;
            const py  = cy + Math.sin(ang)*rr;
            this.pellets[i] = { pos: { x: px, y: py }, mass: rand(1, 4) } as any;
            break;
          }
        }
      });
    }
    // Throttled pellet refill to avoid per-frame spikes
    {
      const target = this.pelletTarget;
      if (this.pellets.length < target){
        const toAdd = Math.min(8, target - this.pellets.length);
        for (let k=0; k<toAdd; k++){
          const ang = Math.random()*Math.PI*2;
          const rr  = Math.sqrt(Math.random()) * Math.max(0, R - 60);
          const px  = cx + Math.cos(ang)*rr;
          const py  = cy + Math.sin(ang)*rr;
          this.pellets.push({ pos: { x: px, y: py }, mass: rand(1, 4) } as any);
        }
      }
    }

    // Viruses update & red bullets
    for (let i = this.viruses.length - 1; i >= 0; i--) {
      const v = this.viruses[i] as any;
      if (v.ang === undefined) v.ang = 0;
      if (v.spin === undefined) v.spin = 0.08;
      v.ang += v.spin * dt;
      if (!v.vel) v.vel = { x: 0, y: 0 };
      if (Math.random() < 0.015 * (dtMs / 16.67)) {
        const jitter = 4;
        v.vel.x += rand(-jitter, jitter);
        v.vel.y += rand(-jitter, jitter);
      }
      v.vel.x *= 0.99; v.vel.y *= 0.99;
      v.pos.x += (v.vel?.x ?? 0) * dt;
      v.pos.y += (v.vel?.y ?? 0) * dt;

      // Circular boundary collision (both green and red) using cached zone
      const dx = v.pos.x - cx, dy = v.pos.y - cy; const d = Math.hypot(dx,dy) || 1;
      const maxD = Math.max(0, R - v.radius);
      if (d > maxD){
        const nx = dx / d, ny = dy / d; // outward normal
        v.pos.x = cx + nx * maxD;
        v.pos.y = cy + ny * maxD;
        if (v.vel){
          const vn = v.vel.x*nx + v.vel.y*ny;
          v.vel.x -= 2*vn*nx; v.vel.y -= 2*vn*ny;
          v.vel.x *= 0.8; v.vel.y *= 0.8; // damp
        }
      }

      // interaction
      for (const [, p] of this.players) {
        if (!p.alive) continue;
        for (const c of p.cells){
          this.handleVirusCollision(p, c, v);
        }
      }

      if (v.kind === 'red') {
        v.volleyT = (v.volleyT ?? this.redVolleyEvery) - dt;
        if (v.volleyT <= 0) {
          v.volleyT = this.redVolleyEvery;
          const N = this.redBulletsPerVolley;
          const speed = 340;
          const range = 4.2 * v.radius;
          for (let k=0; k<N; k++){
            const ang = (k / N) * Math.PI * 2;
            const dir = { x: Math.cos(ang), y: Math.sin(ang) };
            this.bullets.push({
              kind:'hazard',
              pos: { x: v.pos.x, y: v.pos.y },
              vel: { x: dir.x * speed, y: dir.y * speed },
              mass: 10,
              owner: 'hazard',
              ttl: 2.0,
              rangeLeft: range,
            });
          }
        }
        v.ttl = (v.ttl ?? 25) - dt;
        if (v.ttl <= 0) { this.spawnImplosion(v.pos.x, v.pos.y); this.viruses.splice(i,1); continue; }
      }
    }

    // PowerUps
    for (let i=this.powerups.length-1;i>=0;i--){
      const pu = this.powerups[i];
      pu.ttl -= dt;
      if (pu.ttl <= 0){ this.powerups.splice(i,1); continue; }
      let picked = false;
      for (const [, p] of this.players){
        if (!p.alive) continue;
        for (const c of p.cells){
          if (Math.hypot(pu.pos.x - c.pos.x, pu.pos.y - c.pos.y) < c.radius + 14){
            this.pickPowerUp(p, c, pu);
            picked = true; break;
          }
        }
        if (picked) break;
      }
      if (picked) this.powerups.splice(i,1);
    }
    while (this.powerups.length < 22){
      const pad2 = zonePad; // reuse cached zone pad
      const extra = spawnPowerUps(this.world.w, this.world.h, 1, pad2, this.viruses);
      if (extra.length>0) this.powerups.push(extra[0]);
    }

    // Bullets & Explosions
    this.fireBulletsIfNeeded(dt, input);
    for (let i=this.bullets.length-1;i>=0;i--){
      const b = this.bullets[i];
      const speed = Math.hypot(b.vel.x, b.vel.y);
      const stepDist = speed * dt;

      if (b.rangeLeft !== undefined) {
        b.rangeLeft -= stepDist;
        if (b.rangeLeft <= 0) {
          if (b.explodeAtEnd) this.spawnExplosion(b.pos.x, b.pos.y);
          this.bullets.splice(i,1); continue;
        }
      } else {
        b.ttl -= dt;
        if (b.ttl <= 0) { this.bullets.splice(i,1); continue; }
      }

      b.pos.x += b.vel.x * dt;
      b.pos.y += b.vel.y * dt;

      if (b.pos.x<0 || b.pos.x>this.world.w || b.pos.y<0 || b.pos.y>this.world.h){
        if (b.explodeAtEnd) this.spawnExplosion(b.pos.x, b.pos.y);
        this.bullets.splice(i,1); continue;
      }

      // hit viruses
      for (let vi=this.viruses.length-1; vi>=0; vi--){
        const v = this.viruses[vi] as any;
        const d = Math.hypot(v.pos.x - b.pos.x, v.pos.y - b.pos.y);
        if (d < v.radius){
          if (b.kind==='rocket' && v.kind==='green'){
            const nx = (v.pos.x - b.pos.x)/(d||1), ny=(v.pos.y - b.pos.y)/(d||1);
            v.vel.x += nx * 120; v.vel.y += ny * 120;
            this.spawnExplosion(b.pos.x, b.pos.y);
            this.bullets.splice(i,1); 
            i--;
          }
          break;
        }
      }
      if (i<0) break;

      // hit players
      for (const [, p] of this.players){
        if (!p.alive || p.id===b.owner) continue;
        if (p.invincibleTimer>0) continue;
        let hit=false;
        for (const c of p.cells){
          const d = Math.hypot(c.pos.x - b.pos.x, c.pos.y - b.pos.y);
          if (d < c.radius){
            const loss = (b.kind==='hazard') ? b.mass * 1.2 : b.mass;
            c.mass = Math.max(1, c.mass - loss);
            c.radius = radiusFromMass(c.mass);
            const nx = (c.pos.x - b.pos.x) / (d || 1);
            const ny = (c.pos.y - b.pos.y) / (d || 1);
            c.vel.x += nx * 60;
            c.vel.y += ny * 60;
            hit=true; 
            this.spawnExplosion(b.pos.x, b.pos.y);
            break;
          }
        }
        if (hit){ this.bullets.splice(i,1); i--; break; }
      }
      if (i<0) break;
    }

    // Multi-eat robust
    {
      let passes = 0;
      while (passes < this.maxEatsPerFrame) {
        if (!this.resolveEatsOnce()) break;
        passes++;
      }
    }

    // Self merge
    for (const [, p] of this.players) if (p.alive) this.doSelfMergeForPlayer(p, dt);

    // Star trail particles for invincibility
    for (const [, p] of this.players){
      if (!p.alive) continue;
      if (p.invincibleTimer>0){
        for (const c of p.cells){
          if (Math.random()<0.5){
            this.particles.push({
              pos:{x:c.pos.x + rand(-c.radius*0.2, c.radius*0.2), y:c.pos.y + rand(-c.radius*0.2, c.radius*0.2)},
              vel:{x:rand(-40,40), y:rand(-40,40)},
              life:1, size: rand(2,4),
              hue: randInt(0,360), type:'streak', fade: rand(0.6,1.0)
            });
          }
        }
      }
    }

    // Particles update
    this.updateParticles(dt);

    // Cleanup & Game Over
    for (const [, p] of this.players){
      if (p.cells.length===0) p.alive = false;
    }
    if (me && !me.alive && !this.gameOverTriggered) {
      this.gameOverTriggered = true;
      const rank = this.getRank(this.me);
      const stats: GameOverStats = {
        survivedMs: this.meSurvivalMs,
        survivedSec: Math.round(this.meSurvivalMs/10)/100,
        maxMass: Math.round(this.meMaxMass),
        score: Math.round(this.meMaxMass),
        rank
      };
      this.onGameOver?.(stats);
    }

    // Red virus spawns
    if (elapsed >= this.redStartMs) {
      this.redSpawnTimer -= dtMs;
      const redCount = this.viruses.filter(v => (v as any).kind === 'red').length;
      if (this.redSpawnTimer <= 0 && redCount < this.redMax) {
        this.spawnRedVirus();
        this.redSpawnTimer = this.redSpawnEveryMs;
      }
    }

    // Ensure enough bots
    this.ensureBotCount();
  }

  private playerEject(p: PlayerState, input: InputState) {
    const baseScale = Math.min(this.canvas.width/1920, this.canvas.height/1080) * this.currentZoom;
    const wp = this.updateWorldPosition(p.cells[0].pos.x, p.cells[0].pos.y, baseScale, input);
    for (const c of p.cells) {
      if (c.mass < 35) continue;
      const dx = wp.worldX - c.pos.x, dy = wp.worldY - c.pos.y;
      const d = Math.hypot(dx, dy) || 1;
      c.mass = Math.max(10, c.mass - this.ejectLoss);
      c.radius = radiusFromMass(c.mass);
      const speed = 420;
      const vx = (dx / d) * speed;
      const vy = (dy / d) * speed;
      const pellet:any = { pos: { x: c.pos.x + (dx/d)*(c.radius*0.9), y: c.pos.y + (dy/d)*(c.radius*0.9) }, mass: this.ejectGive, vel: { x: vx, y: vy }, life: 8 };
      this.pellets.push(pellet);
      c.vel.x -= vx * 0.02; c.vel.y -= vy * 0.02;
    }
  }

  private resolveEatsOnce(): boolean {
    for (const [, p] of this.players) {
      if (!p.alive) continue;
      for (const [, q] of this.players) {
        if (!q.alive || p.id === q.id) continue;

        for (let ai=0; ai<p.cells.length; ai++) {
          const a = p.cells[ai];
          for (let bi=0; bi<q.cells.length; bi++) {
            const b = q.cells[bi];
            const dx = b.pos.x - a.pos.x, dy = b.pos.y - a.pos.y;
            const d  = Math.hypot(dx, dy);
            if (d === 0) continue;

            // Star override: touch-eat if attacker has star and victim mass <= attacker.mass + 150 (victim not invincible)
            const touching = d < (a.radius + b.radius);
            if (touching) {
              if (p.invincibleTimer > 0 && q.invincibleTimer <= 0 && b.mass <= a.mass + 150) {
                a.mass += b.mass;
                a.radius = radiusFromMass(a.mass);
                const idx = q.cells.indexOf(b);
                if (idx >= 0) q.cells.splice(idx, 1);
                if (q.cells.length === 0) q.alive = false;
                return true;
              }
              if (q.invincibleTimer > 0 && p.invincibleTimer <= 0 && a.mass <= b.mass + 150) {
                b.mass += a.mass;
                b.radius = radiusFromMass(b.mass);
                const idx = p.cells.indexOf(a);
                if (idx >= 0) p.cells.splice(idx, 1);
                if (p.cells.length === 0) p.alive = false;
                return true;
              }
            }

            let bigger = a, smaller = b, ownerBig = p, ownerSmall = q;
            if (b.mass > a.mass) { bigger = b; smaller = a; ownerBig = q; ownerSmall = p; }
            const dx2 = b.pos.x - a.pos.x, dy2 = b.pos.y - a.pos.y; // recompute for clarity
            const d2  = Math.hypot(dx2, dy2);

            const ratio    = bigger.mass / Math.max(1, smaller.mass);
            const equalish = Math.abs(1 - ratio) <= 0.02;
            const massOk   = equalish || ratio >= 1.10;
            const distOk   = d2 + 0.60 * smaller.radius < bigger.radius;

            // Star rule: if the potential victim has invincibility, do not allow eating
            const victimInvincible = ownerSmall.invincibleTimer > 0;

            // Use strict Agar.io rule only when nobody has the star powerup
            let canEatPair = false;
            if (ownerBig.invincibleTimer <= 0 && ownerSmall.invincibleTimer <= 0) {
              canEatPair = canEat(
                { x: bigger.pos.x, y: bigger.pos.y, r: bigger.radius, m: bigger.mass },
                { x: smaller.pos.x, y: smaller.pos.y, r: smaller.radius, m: smaller.mass }
              );
            }

            if (canEatPair) {
              bigger.mass  += smaller.mass;
              bigger.radius = radiusFromMass(bigger.mass);
              const idx = ownerSmall.cells.indexOf(smaller);
              if (idx >= 0) ownerSmall.cells.splice(idx, 1);
              if (ownerSmall.cells.length === 0) ownerSmall.alive = false;
              return true;
            }

            // contact push/pull between different players
            const touching2 = d2 < (a.radius + b.radius);
            if (touching2) {
              const n = { x: dx2 / (d2 || 1), y: dy2 / (d2 || 1) };
              const overlap = (a.radius + b.radius - d2);

              if (victimInvincible) {
                // push both slightly apart
                smaller.pos.x += n.x * overlap; smaller.pos.y += n.y * overlap;
                bigger .pos.x -= n.x * overlap; bigger .pos.y -= n.y * overlap;
              } else if (ownerBig.invincibleTimer <= 0 && ownerSmall.invincibleTimer <= 0) {
                // No star: decide based on strict ratio
                if (ratio >= 1.25) {
                  // gentle inward pull to allow engulfing over time
                  const pull = overlap * 0.25;
                  smaller.pos.x += (ownerBig === p ? -n.x : n.x) * pull;
                  smaller.pos.y += (ownerBig === p ? -n.y : n.y) * pull;
                  bigger .pos.x += (-n.x) * 0.05 * pull;
                  bigger .pos.y += (-n.y) * 0.05 * pull;
                } else {
                  // under 25%: separate to avoid sticking
                  smaller.pos.x -= n.x * overlap * 0.45; smaller.pos.y -= n.y * overlap * 0.45;
                  bigger .pos.x += n.x * overlap * 0.45; bigger .pos.y += n.y * overlap * 0.45;
                }
              } else {
                // star present but no override eat: gentle separation
                smaller.pos.x -= n.x * overlap * 0.35; smaller.pos.y -= n.y * overlap * 0.35;
                bigger .pos.x += n.x * overlap * 0.35; bigger .pos.y += n.y * overlap * 0.35;
              }
            } else {
              const minDist = (a.radius + b.radius) * 0.95;
              if (d2 < minDist) {
                const n = { x: dx2 / (d2 || 1), y: dy2 / (d2 || 1) };
                const push = (minDist - d2) * 0.45;
                b.pos.x +=  n.x * push; b.pos.y +=  n.y * push;
                a.pos.x += -n.x * push; a.pos.y += -n.y * push;
              }
            }
          }
        }
      }
    }
    return false;
  }

  private ensureBotCount(){
    let aliveBots = 0;
    for (const [,p] of this.players) if (p.isBot && p.alive) aliveBots++;
    if (aliveBots >= this.targetBotCount) return;

    const need = this.targetBotCount - aliveBots;
    const deadBots: PlayerState[] = [];
    for (const [,p] of this.players) if (p.isBot && !p.alive) deadBots.push(p);

    let revived = 0;
    for (const p of deadBots) {
      if (revived >= need) break;
      this.respawnBot(p);
      revived++;
    }
    for (; revived < need; revived++) {
      const id = crypto.randomUUID();
      const m0 = rand(50,150);
      this.players.set(id, {
        id,
        color: `hsl(${Math.floor(rand(0,360))} 80% 65%)`,
        name: pickName(),
        alive: true,
        isBot: true,
        invincibleTimer: 0,
        multishotTimer: 0,
        speedBoostTimer: 0,
        cells: [ makeCell(m0, { x: rand(160, this.world.w-160), y: rand(160, this.world.h-160) }) ],
        skinCanvas: randomSkinCanvas(),
        skinPattern: undefined,
      });
    }
  }

  private respawnBot(p: PlayerState){
    p.alive = true;
    p.invincibleTimer = 1.2;
    p.multishotTimer = 0;
    p.speedBoostTimer = 0;
    const m0 = rand(50,150);
    p.cells = [ makeCell(m0, { x: rand(160, this.world.w-160), y: rand(160, this.world.h-160) }) ];
    p.name = pickName();
  }

  // ---------- Particles ----------
  private spawnExplosion(x:number,y:number){
    const sparks = 24;
    for (let i=0;i<sparks;i++){
      const ang = (i/sparks)*Math.PI*2 + Math.random()*0.3;
      const spd = rand(120, 340);
      this.particles.push({
        pos:{x,y},
        vel:{x:Math.cos(ang)*spd,y:Math.sin(ang)*spd},
        life:1,
        size: rand(2,4),
        hue: randInt(180,240),
        type:'spark',
        fade: rand(1.2,1.8)
      });
    }
    this.particles.push({ pos:{x,y}, vel:{x:0,y:0}, life:1, size: 6, hue: 200, type:'shock', fade:1.4 });
  }

  private spawnImplosion(x:number,y:number){
    const sparks = 28;
    for (let i=0;i<sparks;i++){
      const ang = (i/sparks)*Math.PI*2 + Math.random()*0.25;
      const dist = 24 + Math.random()*36;
      const px = x + Math.cos(ang)*dist;
      const py = y + Math.sin(ang)*dist;
      const spd = Math.random()*160 + 180; // inward speed
      this.particles.push({
        pos:{x:px,y:py},
        vel:{x:(x-px)/dist*spd, y:(y-py)/dist*spd},
        life:1,
        size: Math.random()*2+2,
        hue: Math.floor(180+Math.random()*60),
        type:'streak',
        fade: Math.random()*0.6+0.8

      });
    }
    // subtle inward ring impression via a shock that will fade
    this.particles.push({ pos:{x,y}, vel:{x:0,y:0}, life:1, size: 6, hue: 210, type:'shock', fade:1.2 });
  }

  private updateParticles(dt:number){
    for (let i=this.particles.length-1;i>=0;i--){
      const p = this.particles[i];
      p.pos.x += p.vel.x*dt;
      p.pos.y += p.vel.y*dt;
      if (p.type==='spark' || p.type==='streak'){
        p.vel.x *= 0.96; p.vel.y *= 0.96;
      }
      p.life -= dt/p.fade;
      if (p.life<=0) this.particles.splice(i,1);
    }
    // Global particle cap to avoid overload on mobile
    if (this.particles.length > this.maxParticles){
      this.particles.splice(0, this.particles.length - this.maxParticles);
    }
  }

  // ---------- Draw ----------
  draw(elapsed: number){
    const {ctx, canvas} = this;

    const me = this.players.get(this.me);
    if (!me || !me.cells.length) return;

    // Camera center at mass COM
    let cx = 0, cy = 0; const M = Math.max(1, this.totalMass(me));
    for (const c of me.cells) { cx += c.pos.x * c.mass; cy += c.pos.y * c.mass; }
    const center = { x: cx / M, y: cy / M };

    // Zoom
    const totalMass = Math.max(this.totalMass(me), 100);
    const baseScale = Math.min(canvas.width/1920, canvas.height/1080);
    const pieces = Math.max(1, me.cells.length);
    const massFactor = Math.pow(totalMass / 100, 0.12);
    let targetZoomRaw = 1.9 / (massFactor * (1 + (pieces - 1) * 0.05));
    targetZoomRaw += this.zoomBias;
    const targetZoom = clamp(targetZoomRaw, 1.2, 2.6);
    this.currentZoom = this.currentZoom + (targetZoom - this.currentZoom) * 0.08;
    const scale = baseScale * this.currentZoom;

    // ==== Frame Start ====
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    this.level.drawBackgroundScreen(ctx);

    // ==== Kamera ====
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(scale, scale);
    ctx.translate(-center.x, -center.y);

    // World decor + border (circular)
    this.level.drawWorldDecor(ctx);
    const pad = this.outsidePad(elapsed);
    this.level.drawRainbowBorder(ctx, pad, this.world);

    // Pellets (batch)
    ctx.beginPath();
    for (const pl of this.pellets){
      const r = Math.max(2, Math.sqrt(pl.mass)*0.8);
      ctx.moveTo(pl.pos.x + r, pl.pos.y);
      ctx.arc(pl.pos.x, pl.pos.y, r, 0, Math.PI*2);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.fill();

    // Viruses
    for (const v of this.viruses){
      this.drawVirusSpiky(v);
    }

    // PowerUps
    for ( const pu of this.powerups){ drawPowerUp(ctx, pu); }

    // Bullets
    for (const b of this.bullets){
      if (b.kind==='rocket'){
        ctx.save();
        ctx.translate(b.pos.x, b.pos.y);
        const ang = Math.atan2(b.vel.y, b.vel.x);
        ctx.rotate(ang);
        ctx.fillStyle = 'rgba(200,220,255,0.95)';
        ctx.beginPath();
        ctx.moveTo(8,0); ctx.lineTo(-6,4); ctx.lineTo(-6,-4); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-6,0); ctx.lineTo(-12,3); ctx.lineTo(-12,-3); ctx.closePath();
        ctx.fillStyle='rgba(255,120,0,0.9)'; ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(b.pos.x, b.pos.y, Math.sqrt(b.mass), 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,120,120,0.95)';
        ctx.fill();
      }
    }

    // Players (+ Star-Glow) with skins
    for (const [, p] of this.players){
      if (!p.alive) continue;
      for (const c of p.cells){
        ctx.save();
        if (!this.mobileNoShadows && p.invincibleTimer>0){
          const t = performance.now()/300;
          const hue = Math.floor((t*120)%360);
          ctx.shadowColor = `hsla(${hue},100%,60%,0.9)`;
          ctx.shadowBlur = 35;
        }
        ctx.beginPath();
        ctx.arc(c.pos.x, c.pos.y, c.radius, 0, Math.PI*2);
        const sc = (p as any).skinCanvas as HTMLCanvasElement | undefined;
        if (sc) {
          // Draw skin in world space (original behavior)
          ctx.save();
          ctx.clip();
          const s = c.radius * 2;
          const dx = c.pos.x - c.radius;
          const dy = c.pos.y - c.radius;
          ctx.imageSmoothingEnabled = true;
          (ctx as any).imageSmoothingQuality = 'high';
          ctx.drawImage(sc, dx, dy, s, s);
          ctx.restore();
        } else {
          // fallback fill in world space
          ctx.fillStyle = (p.skinPattern as any) || p.color;
          ctx.fill();
        }
        // Stroke in world space
        ctx.lineWidth = 3;
        ctx.strokeStyle = p.invincibleTimer>0 ? 'rgba(255, 215, 0, 0.9)' : 'rgba(0,0,0,0.35)';
        ctx.stroke();
        ctx.restore();
      }
      const lc = this.largestCell(p);
      if (!this.isMobile || this.currentZoom >= 1.5){
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = '600 14px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${p.name ?? ''} ${Math.round(this.totalMass(p))}`, lc.pos.x, lc.pos.y - lc.radius - 10);
      }

      // subtle tether visual during cooldown to show recombination
      for (let i=0;i<p.cells.length;i++){
        for (let j=i+1;j<p.cells.length;j++){
          const a = p.cells[i], b = p.cells[j];
          const cd = Math.min((a.mergeCooldown ?? 0), (b.mergeCooldown ?? 0));
          if (cd <= 0) continue;
          const dx = b.pos.x - a.pos.x, dy = b.pos.y - a.pos.y;
          const d = Math.hypot(dx,dy);
          const sumR = a.radius + b.radius;
          if (d > sumR * 1.3) continue; // only when reasonably close
          const phase = 1 - Math.min(1, cd / this.mergeTime);
         
          ctx.save();
          ctx.globalAlpha = 0.10 + 0.20 * phase;
          ctx.strokeStyle = 'rgba(0,255,220,1)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(a.pos.x, a.pos.y);
          ctx.lineTo(b.pos.x, b.pos.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Particles
    this.drawParticles();

    ctx.restore(); // Camera
    this.drawVignette();
    // HUD rank is shown via DOM overlay to avoid duplication
     ctx.restore(); // Frame
  }

  // ---------- Draw helpers ----------
  private drawVirusSpiky(v: Virus){
    const ctx = this.ctx;
    const vv = v as any;
    const spikes = vv.kind === 'red' ? 18 : 14;
    const rOuter = vv.radius;
    const rInner = vv.radius * 0.64;
    const ang0 = vv.ang ?? 0;

    ctx.save();
    ctx.translate(vv.pos.x, vv.pos.y);
    ctx.rotate(ang0);

    ctx.beginPath();
    for (let i=0;i<spikes*2;i++){
      const isOuter = (i % 2) === 0;
      const R = isOuter ? rOuter : rInner;
      const a = (Math.PI * 2 / (spikes*2)) * i;
      const x = Math.cos(a) * R;
      const y = Math.sin(a) * R;
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();

    if (vv.kind === 'red') {
      if (!this.mobileNoShadows){ ctx.shadowColor = 'rgba(255,60,60,0.55)'; ctx.shadowBlur = 18; }
      ctx.fillStyle = 'rgba(255, 60, 60, 0.92)';
      ctx.strokeStyle = 'rgba(120, 0, 0, 0.95)';
    } else {
      if (!this.mobileNoShadows){ ctx.shadowColor = 'rgba(0,255,160,0.45)'; ctx.shadowBlur = 14; }
      ctx.fillStyle = 'rgba(66, 245, 152, 0.9)';
      ctx.strokeStyle = 'rgba(0, 120, 60, 0.9)';
    }
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // core
    ctx.beginPath();
    ctx.arc(0,0, rInner*0.45, 0, Math.PI*2);
    ctx.fillStyle = vv.kind === 'red' ? 'rgba(255,120,120,0.55)' : 'rgba(120,255,200,0.45)';
    ctx.fill();

    ctx.restore();
  }

  private drawParticles(){
    const {ctx} = this;
    for (const p of this.particles){
      if (p.type==='spark'){
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = `hsla(${p.hue},100%,60%,${0.9*p.life})`;
        ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI*2); ctx.fill();
               ctx.restore();
      } else if (p.type==='streak'){
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life*0.8);
        ctx.strokeStyle = `hsla(${p.hue},100%,60%,${p.life})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(p.pos.x, p.pos.y); ctx.lineTo(p.pos.x - p.vel.x*0.07, p.pos.y - p.vel.y*0.07); ctx.stroke();
        ctx.restore();
      } else if (p.type==='shock'){
        ctx.save();
        const r = (1-p.life)*120 + 8;
        ctx.strokeStyle = `rgba(200,220,255,${p.life*0.5})`; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, r, 0, Math.PI*2); ctx.stroke();
        ctx.restore();
      }
    }
  }

  private drawVignette(){

    const { ctx, canvas } = this;
    const g = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)*0.6,
      canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)*0.9
    );
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // ---------- Misc ----------
  aliveCount(){ let n=0; for (const [,p] of this.players) if (p.alive) n++; return n; }
  getRank(id:string){ const arr=Array.from(this.players.values()).filter(p=>p.alive).map(p=>this.totalMass(p)).sort((a,b)=>b-a); const myM=this.totalMass(this.players.get(id)!); return arr.findIndex(m=>m<=myM)+1; }
}
