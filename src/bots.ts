// bots.ts
import type { PlayerState, Pellet, PowerUp, Cell } from './types';
import { speedFromMass, rand } from './utils';

export type BotParams = {
  aggroRadius: number;
  huntRatio: number;
  fleeRatio: number;
  edgeAvoidDist: number;
  wanderJitter: number;
  interceptLead: number;
};

export type WorldInfo = {
  width:number; height:number; pad:number;
  pellets: Pellet[];
  powerups: PowerUp[];
  players: Map<string, PlayerState>;
  // viruses were removed from this type to match usage
};

function zoneCircle(w:number,h:number,pad:number){ const cx=w/2, cy=h/2; const R = Math.max(0, Math.min(w,h)/2 - pad); return {cx,cy,R}; }

function steerToward(from:{x:number,y:number}, to:{x:number,y:number}){
  const dx = to.x - from.x, dy = to.y - from.y;
  const L = Math.hypot(dx,dy) || 1;
  return { x: dx/L, y: dy/L };
}

function interceptDir(chaser:{pos:{x:number,y:number}, speed:number},
                       target:{pos:{x:number,y:number}, vel:{x:number,y:number}},
                       lead:number){
  const leadP = { x: target.pos.x + target.vel.x * lead, y: target.pos.y + target.vel.y * lead };
  return steerToward(chaser.pos, leadP);
}

function edgeAvoidForce(p:{x:number,y:number}, w:number,h:number, pad:number, dist:number){
  const {cx,cy,R} = zoneCircle(w,h,pad);
  const dx = p.x - cx, dy = p.y - cy; const d = Math.hypot(dx,dy) || 1;
  const margin = Math.max(1, R - d);
  const need = Math.max(0, dist - margin);
  if (need <= 0) return { x:0, y:0 };
  const nx = dx/d, ny = dy/d; // outward normal
  // force towards center
  return { x: -nx * (need/dist), y: -ny * (need/dist) };
}

function distToEdge(pos:{x:number,y:number}, w:number,h:number, pad:number){
  const {cx,cy,R} = zoneCircle(w,h,pad);
  const d = Math.hypot(pos.x - cx, pos.y - cy);
  return R - d;
}

function pelletClusterTarget(pellets:Pellet[], origin:{x:number,y:number}){
  // Sample a subset for performance
  const N = Math.min(100, pellets.length);
  let best:{x:number,y:number, score:number}|null = null;
  for (let i=0;i<N;i++){
    const pl = pellets[(i*13) % pellets.length];
    const cx = pl.pos.x, cy = pl.pos.y;
    let massSum = 0; let count = 0;
    for (let j=0;j<Math.min(220, pellets.length); j+=7){
      const q = pellets[(i*31 + j) % pellets.length];
      const d = Math.hypot(q.pos.x - cx, q.pos.y - cy);
      if (d < 200){ massSum += (q.mass || 1); count++; }
    }
    // Prefer closer clusters slightly
    const d0 = Math.hypot(cx - origin.x, cy - origin.y) + 1;
    const score = massSum / Math.pow(d0, 0.35) + count*0.2;
    if (!best || score > best.score) best = { x:cx, y:cy, score };
  }
  return best ? { x: best.x, y: best.y } : null;
}

function evaluatePowerupUtility(bot:PlayerState, lc:Cell, totalM:number, pu:PowerUp, world:WorldInfo){
  // Base on context: threats, prey nearby, edge safety
  const keepDist = 20; // reduced from ~200 to 20
  const minDim = Math.min(world.width, world.height);
  const edgeDist = distToEdge(pu.pos, world.width, world.height, world.pad);
  const tooEdgey = edgeDist < Math.max(40, 0.02 * minDim);
  const d = Math.hypot(pu.pos.x - lc.pos.x, pu.pos.y - lc.pos.y) || 1;

  let nearestThreatD = Infinity, nearestPreyD = Infinity, fattestPreyMass = 0;
  for (const [, other] of world.players){
    if (!other.alive || other.id === bot.id) continue;
    const mOther = other.cells.reduce((s,c)=>s+c.mass,0);
    const dd = Math.hypot(other.cells[0].pos.x - lc.pos.x, other.cells[0].pos.y - lc.pos.y);
    const threatBoost = (other.invincibleTimer>0) ? 1.6 : 1.0;
    if (mOther * threatBoost >= totalM * 1.08){ nearestThreatD = Math.min(nearestThreatD, dd); }
    if (mOther <= totalM / 1.18){ nearestPreyD = Math.min(nearestPreyD, dd); fattestPreyMass = Math.max(fattestPreyMass, mOther); }
  }

  let util = 0;
  if (pu.type === 'star'){
    util += 14;
    if (nearestThreatD < 900) util += 12;
    if (fattestPreyMass > totalM*0.6 && nearestPreyD < 900) util += 6;
  } else if (pu.type === 'multishot'){
    util += 8;
    if (nearestPreyD < 800) util += 8;
    if (nearestThreatD < 700) util -= 5; // not great if fleeing
  } else if (pu.type === 'grow'){
    util += 10;
    if (nearestThreatD < 900) util -= 6; // avoid risky grow pick
  }
  // Distance falloff
  util -= Math.pow(d/1200, 1.1) * 8;
  // Edge penalty
  if (tooEdgey) util -= 8;
  // Hard block only very tight near edge
  if (edgeDist < keepDist) util -= 50;

  // Contest: if a bigger enemy is closer to the powerup, reduce utility
  for (const [, other] of world.players){
    if (!other.alive || other.id === bot.id) continue;
    const mOther = other.cells.reduce((s,c)=>s+c.mass,0);
    const dOther = Math.hypot(other.cells[0].pos.x - pu.pos.x, other.cells[0].pos.y - pu.pos.y) || 1;
    if (mOther >= totalM*1.05 && dOther < d*0.8) util -= 6;
  }
  return util;
}

export function updateBots(params: BotParams, world: WorldInfo, dt:number){
  const { aggroRadius, huntRatio, fleeRatio, edgeAvoidDist, wanderJitter, interceptLead } = params;
  for (const [, bot] of world.players){
    if (!bot.alive || !bot.isBot) continue;
    const totalM = bot.cells.reduce((s,c)=>s+c.mass,0);
    // Use same base speed model as players (no extra floor)
    const botSpeed = speedFromMass(totalM);
    const lc = bot.cells.reduce((a,b)=> a.mass>=b.mass? a:b );

    // Global keep-out margin from the border (reduced)
    const keepDist = 20; // was >= 200
    const edgeDistanceNow = distToEdge(lc.pos, world.width, world.height, world.pad);

    const starMul = (bot.invincibleTimer>0) ? 2.0 : 1.0;
    const boostMul = ((bot.speedBoostTimer||0)>0) ? 1.10 : 1.0;
    const vCap = botSpeed * starMul * boostMul; // desired max like player COM speed

    // If too close to the border: override behavior and run to safe center
    if (edgeDistanceNow < keepDist){
      const avoid = edgeAvoidForce(lc.pos, world.width, world.height, world.pad, keepDist);
      const toCenter = steerToward(lc.pos, { x: world.width/2, y: world.height/2 });
      let fx = (avoid.x * 6.0 + toCenter.x * 3.5) * botSpeed * 2.0;
      let fy = (avoid.y * 6.0 + toCenter.y * 3.5) * botSpeed * 2.0;
      fx += (Math.random()*2 - 1) * 0.25; fy += (Math.random()*2 - 1) * 0.25;
      for (const c of bot.cells){ c.vel.x += fx * dt; c.vel.y += fy * dt; }
      // Clamp after applying forces to player's model speed
      for (const c of bot.cells){
        const mag = Math.hypot(c.vel.x, c.vel.y);
        if (mag > vCap){ const s = vCap / (mag || 1); c.vel.x *= s; c.vel.y *= s; }
      }
      continue;
    }

    // Scan environment
    let bestThreat: {p:PlayerState, c:Cell, d:number} | null = null;
    let bestPrey: {p:PlayerState, c:Cell, d:number, value:number} | null = null;

    for (const [, other] of world.players) {
      if (!other.alive || other.id === bot.id) continue;
      for (const oc of other.cells) {
        const d = Math.hypot(oc.pos.x - lc.pos.x, oc.pos.y - lc.pos.y);
        if (d > aggroRadius) continue;
        const mOther = other.cells.reduce((s,c)=>s+c.mass,0);
        const threatBoost = (other.invincibleTimer>0) ? 1.8 : 1.0;
        const ratioOther = (mOther * threatBoost) / Math.max(1, totalM);
        const preyNearEdge = distToEdge(oc.pos, world.width, world.height, world.pad) < keepDist;
        if (ratioOther >= fleeRatio) {
          if (!bestThreat || d < bestThreat.d) bestThreat = { p: other, c: oc, d };
        } else if (ratioOther <= (1 / huntRatio)) {
          if (preyNearEdge) continue;
          const value = (mOther) / Math.max(40, d); // stronger closeness weight
          if (!bestPrey || value > bestPrey.value) bestPrey = { p: other, c: oc, d, value };
        }
      }
    }

    // Power-up decision
    let bestPU: PowerUp | undefined; let bestPUUtil = -Infinity;
    for (const pu of world.powerups){
      const u = evaluatePowerupUtility(bot, lc, totalM, pu, world);
      if (u > bestPUUtil){ bestPUUtil = u; bestPU = pu; }
    }

    const cluster = pelletClusterTarget(world.pellets, lc.pos);

    let fx=0, fy=0;

    // Adaptive edge avoidance
    const baseAvoid = edgeAvoidForce(lc.pos, world.width, world.height, world.pad, edgeAvoidDist);
    const edgeDistance = distToEdge(lc.pos, world.width, world.height, world.pad);
    const edgeFactor = Math.max(0.8, 1.4 + (edgeAvoidDist / Math.max(20, edgeDistance)) * 1.6);
    fx += baseAvoid.x * edgeFactor * 2.2; fy += baseAvoid.y * edgeFactor * 2.2;

    const imminentThreat = bestThreat && bestThreat.d < 900;
    const puStrong = bestPU && bestPUUtil > 8;

    if (puStrong && bestPU){
      const puEdgeDist = distToEdge(bestPU.pos, world.width, world.height, world.pad);
      if (puEdgeDist >= keepDist){
        const dir = steerToward(lc.pos, bestPU.pos);
        fx += dir.x * botSpeed * 2.8; fy += dir.y * botSpeed * 2.8;
        if (imminentThreat){
          const tdir = steerToward(lc.pos, bestThreat!.c.pos);
          fx -= tdir.x * botSpeed * 2.4; fy -= tdir.y * botSpeed * 2.4;
        }
      }
    } else if (bestThreat && (!bestPrey || bestThreat.d < bestPrey.d * 0.9)){
      const dir = steerToward(lc.pos, bestThreat.c.pos);
      fx -= dir.x * botSpeed * 3.8; fy -= dir.y * botSpeed * 3.8;
    } else if (bestPrey) {
      const dir = interceptDir({ pos: lc.pos, speed: botSpeed }, { pos: bestPrey.c.pos, vel: bestPrey.c.vel }, interceptLead*1.35);
      fx += dir.x * botSpeed * 3.1; fy += dir.y * botSpeed * 3.1;
    } else if (cluster){
      const dir = steerToward(lc.pos, cluster);
      fx += dir.x * botSpeed * 2.4; fy += dir.y * botSpeed * 2.4;
    } else {
      const center = { x: world.width/2, y: world.height/2 };
      const dir = steerToward(lc.pos, center);
      fx += dir.x * botSpeed * 1.6; fy += dir.y * botSpeed * 1.6;
    }

    const focus = (puStrong || bestThreat || bestPrey) ? 0.5 : 1.0;
    fx += (Math.random()*2 - 1) * wanderJitter * focus;
    fy += (Math.random()*2 - 1) * wanderJitter * focus;

    // Apply forces once and clamp magnitude to the same max speed as players
    for (const c of bot.cells){
      c.vel.x += fx * dt;
      c.vel.y += fy * dt;
      const mag = Math.hypot(c.vel.x, c.vel.y);
      if (mag > vCap){ const s = vCap / (mag || 1); c.vel.x *= s; c.vel.y *= s; }
    }
  }
}
