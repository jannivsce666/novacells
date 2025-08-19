// src/game.ts
// ----------------------------------------------------
// Hauptspiel. Alles wie vorher – nur Skins & Bot-Logik
// sind in ./skins und ./bots ausgelagert.
// ----------------------------------------------------

import { clamp, rand, randInt, norm, radiusFromMass, speedFromMass, sum } from "./utils";
import type { PlayerState, Pellet, Virus, PowerUp, PowerUpType, Bullet, Cell, PlayerConfig } from "./types";
import type { InputState } from "./input";
import { LevelDesign } from "./LevelDesign";

// NEU: ausgelagerte Module
import { pickName, randomSkin, randomSkinCanvas } from "./skins";
import { updateBots, type BotParams } from "./bots";

// ---- Cell helper ----
function makeCell(m:number, pos:{x:number,y:number}, vel={x:0,y:0}): Cell {
  return { pos:{...pos}, vel:{...vel}, mass:m, radius: radiusFromMass(m), mergeCooldown: 6.0 };
}

type GameOverStats = {
  survivedMs: number;
  survivedSec: number;
  maxMass: number;
  score: number;
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
  type:"spark"|"smoke"|"shock";
  fade:number;
};

// ------------------------------------------------

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  // Level / Background
  level!: LevelDesign;

  players = new Map<string, PlayerState>();
  pellets: Pellet[] = [];
  viruses: Virus[] = [];
  powerups: PowerUp[] = [];
  bullets: RocketBullet[] = [];
  particles: Particle[] = [];
  me!: string;

  onGameOver?: (stats: GameOverStats)=>void;

  world = { w: 4000, h: 4000 };

  // Shrink-Zone
  shrinkStart = 20_000;
  shrinkDur   = 60_000;
  zoneDps = 15;

  private currentZoom = 1.0;
  private zoomBias = 0;           // durch Mausrad einstellbar

  // Bot-Parameter (werden 1:1 an bots.ts übergeben)
  aggroRadius   = 1150;
  huntRatio     = 1.22;
  fleeRatio     = 1.12;
  edgeAvoidDist = 220;
  wanderJitter  = 0.30;
  interceptLead = 0.9;

  // Bots
  private targetBotCount = 50;
  private maxEatsPerFrame = 64;

  // Rote Viren
  private redStartMs = 30_000;
  private redSpawnEveryMs = 5_000;
  private redSpawnTimer = 0;
  private redMax = 6;
  private redVolleyEvery = 6.5;
  private redBulletsPerVolley = 18;

  // Self-merge & Split
  private mergeTime = 15.0;
  private splitSpeed = 520;
  private recoil     = 140;
  private minSplitMass = 35;

  // Eject (W)
  private ejectLoss = 18;
  private ejectGive = 13;
  private ejectRate = 7;         // ~7/s gehalten
  private _ejectCooldown = 0;

  // Stats / GameOver
  private meSurvivalMs = 0;
  private meMaxMass = 0;
  private gameOverTriggered = false;

  constructor(canvas: HTMLCanvasElement){
    this.canvas = canvas;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.level?.onResize?.();
    };
    window.addEventListener('resize', updateCanvasSize);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    this.ctx = ctx;

    this.level = new LevelDesign(canvas);
    updateCanvasSize();
  }

  // ---------- Spawns ----------

  spawnPellets(count:number){
    this.pellets = [];
    const totalPellets = count * 6;
    for (let i=0; i<totalPellets; i++){
      const sizeType = Math.random();
      let mass:number;
      if (sizeType < 0.1)       mass = rand(8, 12);
      else if (sizeType < 0.3)  mass = rand(5, 7);
      else                      mass = rand(2, 4);
      this.pellets.push({
        pos: { x: rand(60, this.world.w-60), y: rand(60, this.world.h-60) },
        mass,
      } as any);
    }
  }

  // Start: nur grüne Viren
  spawnViruses(count:number){
    this.viruses = [];
    for (let i=0;i<count;i++){
      const r         = rand(38, 54);
      const spin      = rand(0.05, 0.12);
      const baseSpeed = rand(2, 5);
      const theta     = rand(0, Math.PI*2);
      this.viruses.push({
        pos: { x: rand(140, this.world.w-140), y: rand(140, this.world.h-140) },
        radius: r,
        vel: { x: Math.cos(theta)*baseSpeed, y: Math.sin(theta)*baseSpeed },
        ang: rand(0, Math.PI*2),
        spin,
        kind: "green",
        volleyT: 0,
      } as any);
    }
  }

  private spawnRedVirus(){
    const r         = rand(42, 58);
    const spin      = rand(0.08, 0.14);
    const baseSpeed = rand(1, 3);
    const theta     = rand(0, Math.PI*2);
    this.viruses.push({
      pos: { x: rand(140, this.world.w-140), y: rand(140, this.world.h-140) },
      radius: r,
      vel: { x: Math.cos(theta)*baseSpeed, y: Math.sin(theta)*baseSpeed },
      ang: rand(0, Math.PI*2),
      spin,
      kind: "red",
      ttl: rand(20, 30),
      volleyT: this.redVolleyEvery,
    } as any);
  }

  spawnPowerUps(count:number){
    this.powerups = [];
    const types: PowerUpType[] = ["star","multishot","grow"];
    const weights = [0.40, 0.40, 0.20];
    for (let i=0;i<count;i++){
      const rnd = Math.random();
      let acc = 0, typeIdx = 0;
      for(let j = 0; j < weights.length; j++) {
        acc += weights[j];
        if(rnd <= acc) { typeIdx = j; break; }
      }
      this.powerups.push({
        pos: { x: rand(100, this.world.w-100), y: rand(100, this.world.h-100) },
        type: types[typeIdx],
        ttl: rand(28, 40),
      });
    }
  }

  spawnPlayers(_nBots: number, config?: PlayerConfig) {
    this.me = crypto.randomUUID();

    const myMass = rand(50, 150);
    this.players.set(this.me, {
      id: this.me,
      color: config?.color || "#5cf2a6",
      name: config?.name || "You",
      alive: true,
      isBot: false,
      invincibleTimer: 0,
      multishotTimer: 0,
      cells: [ makeCell(myMass, { x: rand(400, this.world.w-400), y: rand(400, this.world.h-400) }) ],
      skinPattern: this.buildSkinPattern(config?.color || "#5cf2a6", config?.skinCanvas),
      ...(config?.skinCanvas ? { skinCanvas: config.skinCanvas } : {}) as any,
    });

    for (let i=0;i<this.targetBotCount;i++){
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
        cells: [ makeCell(m0, { x: rand(100, this.world.w-100), y: rand(100, this.world.h-100) }) ],
        // Feste Bot-Skins (Clip in draw())
        skinCanvas: randomSkinCanvas(),
        skinPattern: randomSkin(this.ctx),
      });
    }

    this.meSurvivalMs = 0;
    this.meMaxMass = myMass;
    this.gameOverTriggered = false;
  }

  resetRound(){
    this.spawnPellets(360);
    this.spawnViruses(28);
    this.spawnPowerUps(18);
    this.redSpawnTimer = 0;
    this.players.forEach(p=>{
      p.alive = true;
      p.invincibleTimer = 0;
      p.multishotTimer = 0;
      const m0 = rand(50,150);
      p.cells = [ makeCell(m0, { x: rand(100, this.world.w-100), y: rand(100, this.world.h-100) }) ];
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

  outsidePad(elapsed:number){
    const t = Math.max(0, elapsed - this.shrinkStart);
    const shrinkT = Math.max(0, Math.min(1, t/(this.shrinkDur * 2)));
    const maxShrink = 500;
    return shrinkT * maxShrink;
  }

  // —— Virus-Kollision / Essen —— 
  private handleVirusCollision(p: PlayerState, c: Cell, vv: any){
    const dx = c.pos.x - vv.pos.x, dy = c.pos.y - vv.pos.y;
    const d  = Math.hypot(dx,dy);
    const minDist = c.radius + vv.radius * 0.98;

    // Große Zellen dürfen grüne „anfuttern“
    if (vv.kind==="green" && d < c.radius - 0.2*vv.radius){
      if (c.mass >= 1000){
        const gain = (c.mass >= 2000) ? 10 : 50;
        c.mass += gain;
        c.radius = radiusFromMass(c.mass);
        const idx = this.viruses.indexOf(vv);
        if (idx>=0) this.viruses.splice(idx,1);
        return;
      }
    }

    // Blockieren & ggf. Split
    if (d < minDist) {
      const nx = dx / (d || 1), ny = dy / (d || 1);
      const push = (minDist - d);
      c.pos.x += nx * push;
      c.pos.y += ny * push;
      c.vel.x *= 0.75; c.vel.y *= 0.75;

      if (c.mass > 200) this.splitCellOnVirus(p, c, vv);
    }
  }

  private splitCellOnVirus(p: PlayerState, c: Cell, _vv: any){
    const parts = 2;
    const massLossFactor = 0.95;
    const newMassEach = Math.max(10, (c.mass * massLossFactor) / parts);
    const ang0 = rand(0, Math.PI*2);

    const newCells: Cell[] = [];
    for (let i=0;i<parts;i++){
      const ang = ang0 + i*Math.PI;
      const dir = { x: Math.cos(ang), y: Math.sin(ang) };
      const speed = 260;
      const nc = makeCell(newMassEach,
        {x: c.pos.x + dir.x*(c.radius*0.7), y: c.pos.y + dir.y*(c.radius*0.7)},
        {x: dir.x*speed, y: dir.y*speed});
      nc.mergeCooldown = this.mergeTime;
      newCells.push(nc);
    }
    const idx = p.cells.indexOf(c);
    if (idx>=0){
      p.cells.splice(idx,1);
      p.cells.push(...newCells);
    }
  }

  private tryPlayerSplit(p: PlayerState, dir:{x:number;y:number}){
    const src = this.largestCell(p);
    if (!src) return;
    if (src.mass < this.minSplitMass*2) return;
    if (p.cells.length >= 16) return;

    const half = src.mass / 2;
    src.mass = half;
    src.radius = radiusFromMass(src.mass);

    const out = makeCell(half,
      { x: src.pos.x + dir.x*(src.radius*0.8), y: src.pos.y + dir.y*(src.radius*0.8) },
      { x: dir.x*this.splitSpeed, y: dir.y*this.splitSpeed }
    );

    src.vel.x -= dir.x*this.recoil;
    src.vel.y -= dir.y*this.recoil;

    src.mergeCooldown = this.mergeTime;
    out.mergeCooldown = this.mergeTime;

    p.cells.push(out);
  }

  // --- Self-collision & Merging (Agar-like) ---
  private doSelfMergeForPlayer(p: PlayerState, dt:number){
    // Cooldowns ticken
    for (const c of p.cells) c.mergeCooldown = Math.max(0, (c.mergeCooldown ?? 0) - dt);

    // Paarweise Kollisionen auflösen / sanft zusammenführen
    for (let i=0;i<p.cells.length;i++){
      for (let j=i+1;j<p.cells.length;j++){
        const a = p.cells[i], b = p.cells[j];
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;
        const d  = Math.hypot(dx,dy) || 1;
        const minDist = (a.radius + b.radius) * 0.98;

        if (d < minDist){
          const n = { x: dx/d, y: dy/d };
          const overlap = (minDist - d);

          // harter Collider solange Merge-Cooldown aktiv
          if (((a.mergeCooldown ?? 0) > 0) || ((b.mergeCooldown ?? 0) > 0)){
            const totalMass = Math.max(1, a.mass + b.mass);
            const wa = b.mass / totalMass, wb = a.mass / totalMass;
            a.pos.x -= n.x * overlap * wa;
            a.pos.y -= n.y * overlap * wa;
            b.pos.x += n.x * overlap * wb;
            b.pos.y += n.y * overlap * wb;
            a.vel.x -= n.x * 30 * dt; a.vel.y -= n.y * 30 * dt;
            b.vel.x += n.x * 30 * dt; b.vel.y += n.y * 30 * dt;
          } else {
            // beide 0 → sanft zusammenziehen (damit sie wieder mergen)
            const pull = overlap * 0.45;
            a.pos.x +=  n.x * pull; a.pos.y +=  n.y * pull;
            b.pos.x -=  n.x * pull; b.pos.y -=  n.y * pull;
          }
        } else {
          if (((a.mergeCooldown ?? 0) <= 0) && ((b.mergeCooldown ?? 0) <= 0)){
            const near = (d < (a.radius + b.radius) * 1.04);
            if (near){
              const n = { x: dx/d, y: dy/d };
              const soft = (a.radius + b.radius) * 0.04 - (d - (a.radius + b.radius));
              const pull = Math.max(0, soft) * 0.2;
              a.pos.x +=  n.x * pull; a.pos.y +=  n.y * pull;
              b.pos.x -=  n.x * pull; b.pos.y -=  n.y * pull;
            }
          }
        }
      }
    }
  }

  trySplitOnVirus(p: PlayerState, c: Cell, v: Virus){
    this.handleVirusCollision(p, c, v as any);
  }

  pickPowerUp(p: PlayerState, c: Cell, pu: PowerUp){
    if (pu.type === "grow"){
      c.mass *= 1.15;
      c.radius = radiusFromMass(c.mass);
    } else if (pu.type === "star"){
      // "Mario-Stern": kurze Invincibility + leichter Speed-Boost
      p.invincibleTimer = Math.max(p.invincibleTimer, 9.0);
      for (const cc of p.cells) { cc.vel.x *= 1.05; cc.vel.y *= 1.05; }
    } else if (pu.type === "multishot"){
      p.multishotTimer = Math.max(p.multishotTimer, 14.0);
    }
  }

  // Raketenfeuer (Player/Bot)
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
          // simple Auto-Aim für Bots
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
          if (!target){
            for (const v of this.viruses){
              const vv=v as any; if (vv.kind!=="green") continue;
              const d=Math.hypot(v.pos.x-c.pos.x, v.pos.y-c.pos.y);
              if (d<best){best=d; target={x:v.pos.x,y:v.pos.y};}
            }
          }
          if (!target){
            for (const pu of this.powerups){
              const d=Math.hypot(pu.pos.x-c.pos.x, pu.pos.y-c.pos.y);
              if (d<best){best=d; target={x:pu.pos.x,y:pu.pos.y};}
            }
          }
          dir = target ? norm(target.x - c.pos.x, target.y - c.pos.y) : {x:1,y:0};
        }

        const speed = 420;
        const mass  = 8;
        const range = 1200; // ggf. kürzen falls „nicht so weit schießen“ gewünscht
        this.bullets.push({
          kind:"rocket",
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
    const worldX = centerX + (((input as any).targetX ?? screenCenterX) - screenCenterX) / scale;
    const worldY = centerY + (((input as any).targetY ?? screenCenterY) - screenCenterY) / scale;
    return { worldX, worldY };
  }

  // ---------- Step ----------

  step(dtMs: number, input: InputState, elapsed: number) {
    const dt = dtMs/1000;
    const zonePad = this.outsidePad(elapsed);

    // Mausrad-Zoombias konsumieren
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

    // aktiver Split (Space/Touch)
    if (me?.alive) {
      const baseScale = Math.min(this.canvas.width/1920, this.canvas.height/1080) * this.currentZoom;
      const wp = this.updateWorldPosition(me.cells[0].pos.x, me.cells[0].pos.y, baseScale, input);
      const dir = norm(wp.worldX - me.cells[0].pos.x, wp.worldY - me.cells[0].pos.y);
      const wantSplit = (input as any).splitPressed || (input as any).split || (input as any).space;
      if (wantSplit) {
        this.tryPlayerSplit(me, dir);
        (input as any).splitPressed = false;
        (input as any).space = false;
      }
    }

    // Powerup-Timer
    for (const [, p] of this.players){
      if (!p.alive) continue;
      p.invincibleTimer = Math.max(0, p.invincibleTimer - dt);
      p.multishotTimer  = Math.max(0, p.multishotTimer  - dt);
    }

    // Player Input – COM-gesteuert
    if (me?.cells[0]) {
      let mx = 0, my = 0, M = 0;
      for (const c of me.cells) { mx += c.pos.x * c.mass; my += c.pos.y * c.mass; M += c.mass; }
      mx /= Math.max(1, M); my /= Math.max(1, M);

      const scale = Math.min(this.canvas.width/1920, this.canvas.height/1080) * this.currentZoom;
      const aim = this.updateWorldPosition(mx, my, scale, input);
      const dx = aim.worldX - mx, dy = aim.worldY - my;
      const dist = Math.hypot(dx, dy) || 1;
      const dir = { x: dx/dist, y: dy/dist };

      let speedMul = (input as any).dash ? 1.22 : 1.0;
      if (me.invincibleTimer>0) speedMul *= 1.12;
      const vMag = speedFromMass(Math.max(10, this.totalMass(me))) * speedMul;
      const targetV = { x: dir.x * vMag, y: dir.y * vMag };

      for (const c of me.cells) {
        c.vel.x += (targetV.x - c.vel.x) * 4 * dt;
        c.vel.y += (targetV.y - c.vel.y) * 4 * dt;
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

    // ===== Bot-Update ausgelagert =====
    const botParams: BotParams = {
      aggroRadius: this.aggroRadius,
      huntRatio: this.huntRatio,
      fleeRatio: this.fleeRatio,
      edgeAvoidDist: this.edgeAvoidDist,
      wanderJitter: this.wanderJitter,
      interceptLead: this.interceptLead,
    };
    updateBots(botParams, {
      width: this.world.w,
      height: this.world.h,
      pad: zonePad,
      pellets: this.pellets,
      powerups: this.powerups,
      players: this.players
    }, dt);

    // Bewegung
    for (const [, p] of this.players){
      if (!p.alive) continue;
      for (const c of p.cells){
        c.vel.x *= 0.92;
        c.vel.y *= 0.92;
        const maxVel = speedFromMass(c.mass)*1.65;
        c.vel.x = clamp(c.vel.x, -maxVel, maxVel);
        c.vel.y = clamp(c.vel.y, -maxVel, maxVel);
        c.pos.x = clamp(c.pos.x + c.vel.x * dt, 0, this.world.w);
        c.pos.y = clamp(c.pos.y + c.vel.y * dt, 0, this.world.h);
      }
    }

    // Zone-Schaden & Clamp
    for (const [, p] of this.players){
      if (!p.alive) continue;
      for (const c of p.cells){
        const outside = (c.pos.x < zonePad || c.pos.x > this.world.w - zonePad || c.pos.y < zonePad || c.pos.y > this.world.h - zonePad);
        if (outside && p.invincibleTimer<=0){
          c.mass = Math.max(10, c.mass - this.zoneDps * dt);
          c.radius = radiusFromMass(c.mass);
        }
        c.pos.x = clamp(c.pos.x, zonePad, this.world.w-zonePad);
        c.pos.y = clamp(c.pos.y, zonePad, this.world.h-zonePad);
      }
    }

    // Pellets Eject-Physik
    for (const pl of this.pellets as any[]){
      if ((pl as any).vel){
        pl.pos.x += pl.vel.x * dt;
        pl.pos.y += pl.vel.y * dt;
        pl.vel.x *= 0.93; pl.vel.y *= 0.93;
      }
      if ((pl as any).life !== undefined) (pl as any).life -= dt;
    }

    // Virus-Feeding (grün)
    for (let pi=(this.pellets as any[]).length-1; pi>=0; pi--){
      const pl:any = (this.pellets as any[])[pi];
      if (!pl.vel) continue;
      for (const v of this.viruses as any[]){
        if (v.kind === "red") continue;
        const dx = pl.pos.x - v.pos.x, dy = pl.pos.y - v.pos.y;
        if (Math.hypot(dx,dy) <= (v.radius + 4)){
          (v as any).fed = ((v as any).fed||0)+1;
          (v as any)._lastDir = { x: pl.vel.x, y: pl.vel.y };
          (this.pellets as any[]).splice(pi,1);
          break;
        }
      }
    }
    for (const v of this.viruses as any[]){
      if ((v as any).kind === "red") continue;
      if (((v as any).fed||0) >= 7){
        const d = (v as any)._lastDir || {x:1,y:0};
        const L = Math.hypot(d.x,d.y) || 1;
        const dir = { x: d.x/L, y: d.y/L };
        const nv:any = {
          pos: { x: v.pos.x + dir.x * v.radius * 3, y: v.pos.y + dir.y * v.radius * 3 },
          radius: v.radius,
          vel: { x: dir.x * 40, y: dir.y * 40 },
          ang: 0, spin: 0.1, kind: "green"
        };
        this.viruses.push(nv);
        (v as any).fed = 0;
      }
    }

    // Pellets essen
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
            this.pellets[i] = { pos: { x: rand(40, this.world.w-40), y: rand(40, this.world.h-40) }, mass: rand(1, 4) } as any;
            break;
          }
        }
      });
    }
    while (this.pellets.length < 1000) {
      this.pellets.push({ pos: { x: rand(40, this.world.w-40), y: rand(40, this.world.h-40) }, mass: rand(1, 4) } as any);
    }

    // Viren-Update inkl. rote Schüsse
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
      v.vel.x *= 0.99;
      v.vel.y *= 0.99;

      v.pos.x += (v.vel?.x ?? 0) * dt;
      v.pos.y += (v.vel?.y ?? 0) * dt;

      const pad = this.outsidePad(elapsed);
      if (v.pos.x < pad + v.radius) { v.pos.x = pad + v.radius; if (v.vel) v.vel.x *= -0.8; }
      else if (v.pos.x > this.world.w - pad - v.radius) { v.pos.x = this.world.w - pad - v.radius; if (v.vel) v.vel.x *= -0.8; }
      if (v.pos.y < pad + v.radius) { v.pos.y = pad + v.radius; if (v.vel) v.vel.y *= -0.8; }
      else if (v.pos.y > this.world.h - pad - v.radius) { v.pos.y = this.world.h - pad - v.radius; if (v.vel) v.vel.y *= -0.8; }

      // Interaktion
      for (const [, p] of this.players) {
        if (!p.alive) continue;
        for (const c of p.cells) this.handleVirusCollision(p, c, v);
      }

      if (v.kind === "red") {
        v.volleyT = (v.volleyT ?? this.redVolleyEvery) - dt;
        if (v.volleyT <= 0) {
          v.volleyT = this.redVolleyEvery;
          const N = this.redBulletsPerVolley;
          const speed = 340;
          const range = 5 * v.radius;
          for (let k=0; k<N; k++){
            const ang = (k / N) * Math.PI * 2;
            const dir = { x: Math.cos(ang), y: Math.sin(ang) };
            this.bullets.push({
              kind:"hazard",
              pos: { x: v.pos.x, y: v.pos.y },
              vel: { x: dir.x * speed, y: dir.y * speed },
              mass: 10,
              owner: "hazard",
              ttl: 2.0,
              rangeLeft: range,
            });
          }
        }
        v.ttl = (v.ttl ?? 25) - dt;
        if (v.ttl <= 0) { this.viruses.splice(i,1); continue; }
      }
    }

    // PowerUps pickup & respawn dichter
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
      const types: PowerUpType[] = ["star","multishot","grow"];
      this.powerups.push({
        pos: {x: rand(80, this.world.w-80), y: rand(80, this.world.h-80)},
        type: types[randInt(0,2)],
        ttl: rand(25,40)
      });
    }

    // Bullets & Explosionen
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

      // Collision mit Viren (Raketen schubsen grün)
      for (let vi=this.viruses.length-1; vi>=0; vi--){
        const v = this.viruses[vi] as any;
        const d = Math.hypot(v.pos.x - b.pos.x, v.pos.y - b.pos.y);
        if (d < v.radius){
          if (b.kind==="rocket" && v.kind==="green"){
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

      // Collision mit Spielern
      for (const [, p] of this.players){
        if (!p.alive || p.id===b.owner) continue;
        if (p.invincibleTimer>0) continue;
        let hit=false;
        for (const c of p.cells){
          const d = Math.hypot(c.pos.x - b.pos.x, c.pos.y - b.pos.y);
          if (d < c.radius){
            const loss = (b.kind==="hazard") ? b.mass * 1.2 : b.mass;
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

    // Eigene Zellen mergen
    for (const [, p] of this.players) if (p.alive) this.doSelfMergeForPlayer(p, dt);

    // Partikel updaten
    this.updateParticles(dt);

    // Cleanup & Game Over
    for (const [, p] of this.players){
      if (p.cells.length===0) p.alive = false;
    }
    if (me && !me.alive && !this.gameOverTriggered) {
      this.gameOverTriggered = true;
      const stats: GameOverStats = {
        survivedMs: this.meSurvivalMs,
        survivedSec: Math.round(this.meSurvivalMs/10)/100,
        maxMass: Math.round(this.meMaxMass),
        score: Math.round(this.meMaxMass)
      };
      this.onGameOver?.(stats);
    }

    // Rote Viren spawn
    if (elapsed >= this.redStartMs) {
      this.redSpawnTimer -= dtMs;
      const redCount = this.viruses.filter(v => (v as any).kind === "red").length;
      if (this.redSpawnTimer <= 0 && redCount < this.redMax) {
        this.spawnRedVirus();
        this.redSpawnTimer = this.redSpawnEveryMs;
      }
    }

    // Gegner-Respawn
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
      c.vel.x -= vx * 0.02;
      c.vel.y -= vy * 0.02;
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

            let bigger = a, smaller = b, ownerBig = p, ownerSmall = q;
            if (b.mass > a.mass) { bigger = b; smaller = a; ownerBig = q; ownerSmall = p; }

            const ratio    = bigger.mass / Math.max(1, smaller.mass);
            const equalish = Math.abs(1 - ratio) <= 0.02;
            const massOk   = equalish || ratio >= 1.10;
            const distOk   = d + 0.60 * smaller.radius < bigger.radius;

            const canEat =
              massOk && distOk &&
              ownerBig.invincibleTimer <= 0 &&
              ownerSmall.invincibleTimer <= 0;

            if (canEat) {
              bigger.mass  += smaller.mass;
              bigger.radius = radiusFromMass(bigger.mass);
              const idx = ownerSmall.cells.indexOf(smaller);
              if (idx >= 0) ownerSmall.cells.splice(idx, 1);
              if (ownerSmall.cells.length === 0) ownerSmall.alive = false;
              return true;
            }

            const touching = d < (a.radius + b.radius);
            if (massOk && touching) {
              const n = { x: dx / (d || 1), y: dy / (d || 1) };
              const pull = (a.radius + b.radius - d) * 0.25;
              smaller.pos.x += (ownerBig === p ? -n.x : n.x) * pull;
              smaller.pos.y += (ownerBig === p ? -n.y : n.y) * pull;
              bigger .pos.x += (-n.x) * 0.05 * pull;
              bigger .pos.y += (-n.y) * 0.05 * pull;
            } else {
              const minDist = (a.radius + b.radius) * 0.95;
              if (d < minDist) {
                const n = { x: dx / (d || 1), y: dy / (d || 1) };
                const push = (minDist - d) * 0.45;
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
        cells: [ makeCell(m0, { x: rand(100, this.world.w-100), y: rand(100, this.world.h-100) }) ],
        skinPattern: randomSkin(this.ctx),
      });
    }
  }

  private respawnBot(p: PlayerState){
    p.alive = true;
    p.invincibleTimer = 1.2;
    p.multishotTimer = 0;
    const m0 = rand(50,150);
    p.cells = [ makeCell(m0, { x: rand(100, this.world.w-100), y: rand(100, this.world.h-100) }) ];
    p.name = pickName();
    p.skinPattern = p.skinPattern ?? randomSkin(this.ctx);
  }

  // ---------- Particles (Explosionen) ----------

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
        type:"spark",
        fade: rand(1.2,1.8)
      });
    }
    // Shockwave
    this.particles.push({
      pos:{x,y}, vel:{x:0,y:0}, life:1, size: 6, hue: 200, type:"shock", fade:1.4
    });
  }

  private updateParticles(dt:number){
    for (let i=this.particles.length-1;i>=0;i--){
      const p = this.particles[i];
      p.pos.x += p.vel.x*dt;
      p.pos.y += p.vel.y*dt;
      if (p.type==="spark"){
        p.vel.x *= 0.96; p.vel.y *= 0.96;
      }
      p.life -= dt/p.fade;
      if (p.life<=0) this.particles.splice(i,1);
    }
  }

  // ---------- Draw ----------

  draw(elapsed: number){
    const {ctx, canvas} = this;

    const me = this.players.get(this.me);
    if (!me || !me.cells.length) return;

    // Kamera: Massen-Schwerpunkt aller eigenen Zellen
    let cx = 0, cy = 0;
    const M = Math.max(1, this.totalMass(me));
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

    // Background im Screen-Space
    this.level.drawBackgroundScreen(ctx);

    // ==== Kamera ====
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(scale, scale);
    ctx.translate(-center.x, -center.y);

    // World-Deko
    this.level.drawWorldDecor(ctx);

    // Shrink-zone
    const pad = this.outsidePad(elapsed);
    ctx.save();
    ctx.shadowColor = "rgba(0,255,200,0.35)";
    ctx.shadowBlur = 18;
    ctx.strokeStyle = "rgba(0,255,200,0.55)";
    ctx.lineWidth = 10;
    ctx.strokeRect(pad, pad, this.world.w-2*pad, this.world.h-2*pad);
    ctx.restore();

    // Pellets
    for (const pl of this.pellets){
      ctx.beginPath();
      ctx.arc(pl.pos.x, pl.pos.y, Math.max(2, Math.sqrt(pl.mass)*0.8), 0, Math.PI*2);
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.fill();
    }

    // Viruses
    for (const v of this.viruses){
      this.drawVirusSpiky(v);
    }

    // PowerUps
    for (const pu of this.powerups){
      this.drawPowerUp(pu);
    }

    // Bullets
    for (const b of this.bullets){
      if (b.kind==="rocket"){
        ctx.save();
        ctx.translate(b.pos.x, b.pos.y);
        const ang = Math.atan2(b.vel.y, b.vel.x);
        ctx.rotate(ang);
        ctx.fillStyle = "rgba(200,220,255,0.95)";
        ctx.beginPath();
        ctx.moveTo(8,0); ctx.lineTo(-6,4); ctx.lineTo(-6,-4); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-6,0); ctx.lineTo(-12,3); ctx.lineTo(-12,-3); ctx.closePath();
        ctx.fillStyle="rgba(255,120,0,0.9)"; ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(b.pos.x, b.pos.y, Math.sqrt(b.mass), 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,120,120,0.95)";
        ctx.fill();
      }
    }

    // Players (+ Star-Glow) mit Skin-Clip (voll ausgefüllt)
    for (const [, p] of this.players){
      if (!p.alive) continue;
      for (const c of p.cells){
        ctx.save();
        if (p.invincibleTimer>0){
          ctx.shadowColor = "rgba(255,215,0,0.9)";
          ctx.shadowBlur = 30;
        }
        ctx.beginPath();
        ctx.arc(c.pos.x, c.pos.y, c.radius, 0, Math.PI*2);
        const sc = (p as any).skinCanvas as HTMLCanvasElement | undefined;
        if (sc) {
          ctx.save();
          ctx.clip(); // der Clip stellt sicher, dass der Skin den Kreis komplett füllt
          ctx.drawImage(sc, c.pos.x - c.radius, c.pos.y - c.radius, c.radius*2, c.radius*2);
          ctx.restore();
        } else {
          ctx.fillStyle = (p.skinPattern as any) || p.color;
          ctx.fill();
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = p.invincibleTimer>0 ? "rgba(255, 215, 0, 0.9)" : "rgba(0,0,0,0.35)";
        ctx.stroke();
        ctx.restore();
      }
      const lc = this.largestCell(p);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "600 14px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${p.name ?? ""} ${Math.round(this.totalMass(p))}`, lc.pos.x, lc.pos.y - lc.radius - 10);
    }

    // Partikel (Explosionen) in Welt
    this.drawParticles();

    ctx.restore(); // Kamera
    this.drawVignette();
    ctx.restore(); // Frame
  }

  // ---------- Draw helpers ----------

  private drawPowerUp(pu: PowerUp){
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(pu.pos.x, pu.pos.y);
    ctx.shadowColor = "rgba(255,255,255,0.45)";
    ctx.shadowBlur = 10;

    if (pu.type==="star"){
      const r=12, r2=6;
      ctx.beginPath();
      for (let i=0;i<10;i++){
        const ang = (Math.PI*2/10)*i - Math.PI/2;
        const R = (i%2===0)? r : r2;
        const x = Math.cos(ang)*R, y=Math.sin(ang)*R;
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(255,215,0,0.98)";
      ctx.fill();

    } else if (pu.type==="multishot"){
      ctx.rotate(Math.PI/8);
      ctx.fillStyle="rgba(200,220,255,0.98)";
      ctx.beginPath(); ctx.moveTo(12,0); ctx.lineTo(-8,6); ctx.lineTo(-8,-6); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-8,0); ctx.lineTo(-14,4); ctx.lineTo(-14,-4); ctx.closePath();
      ctx.fillStyle="rgba(255,120,0,0.9)"; ctx.fill();

    } else if (pu.type==="grow"){
      ctx.beginPath();
      ctx.arc(0,0,12,0,Math.PI*2);
      ctx.fillStyle = "rgba(180,255,180,0.98)";
      ctx.fill();
      ctx.fillStyle = "rgba(40,120,40,1)";
      ctx.fillRect(-2,-8,4,16);
      ctx.fillRect(-8,-2,16,4);
    }
    ctx.restore();
  }

  private drawVirusSpiky(v: Virus){
    const ctx = this.ctx;
    const vv = v as any;
    const spikes = vv.kind === "red" ? 18 : 14;
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

    if (vv.kind === "red") {
      ctx.shadowColor = "rgba(255,60,60,0.55)";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "rgba(255, 60, 60, 0.92)";
      ctx.strokeStyle = "rgba(120, 0, 0, 0.95)";
    } else {
      ctx.shadowColor = "rgba(0,255,160,0.45)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "rgba(66, 245, 152, 0.9)";
      ctx.strokeStyle = "rgba(0, 120, 60, 0.9)";
    }
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // Kern
    ctx.beginPath();
    ctx.arc(0,0, rInner*0.45, 0, Math.PI*2);
    ctx.fillStyle = vv.kind === "red" ? "rgba(255,120,120,0.55)" : "rgba(120,255,200,0.45)";
    ctx.fill();

    ctx.restore();
  }

  private drawParticles(){
    const {ctx} = this;
    for (const p of this.particles){
      if (p.type==="spark"){
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = `hsla(${p.hue},100%,60%,${0.9*p.life})`;
        ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      } else if (p.type==="shock"){
        ctx.save();
        const r = (1-p.life)*120 + 8;
        ctx.strokeStyle = `rgba(200,220,255,${p.life*0.5})`;
        ctx.lineWidth = 3;
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
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // ---------- Misc ----------

  aliveCount(){
    let n=0; for (const [,p] of this.players) if (p.alive) n++; return n;
  }

  private buildSkinPattern(_color: string, skinCanvas?: HTMLCanvasElement) {
    // Falls eigener Skin mitgegeben, sonst Neon-Muster
    if (skinCanvas) return this.ctx.createPattern(skinCanvas, 'repeat')!;
    return randomSkin(this.ctx);
  }
}
