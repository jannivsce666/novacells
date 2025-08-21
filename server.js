import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();

// serve static built client
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));
// Serve raw music assets from repo folder
app.use('/music', express.static(path.join(__dirname, 'music')));

// health check
app.get('/health', (req, res) => res.send('ok'));

// optional: basic root
app.get('/', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));

// SPA fallback
app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
const server = http.createServer(app);

// WebSocket server sharing the same HTTP server
const wss = new WebSocketServer({ server });

// ---- Classic helpers (ported) ----
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function rand(a,b){ return a + Math.random()*(b-a); }
function norm(x,y){ const L = Math.hypot(x,y) || 1; return { x:x/L, y:y/L }; }
function radiusFromMass(m){ return Math.sqrt(Math.max(1, m)) * 1.2; }
function speedFromMass(m){
  const V_MIN = 10.5; const V_MAX = 195; const BASE = 1050; const raw = BASE / Math.sqrt(Math.max(1, m));
  return clamp(raw, V_MIN, V_MAX);
}
function canEat(eater, target, eaterLightningActive=false){
  const massThreshold = eaterLightningActive ? 1.2 : 1.25;
  if (eater.m < target.m * massThreshold) return false;
  const dx = eater.x - target.x, dy = eater.y - target.y; const dist = Math.hypot(dx,dy);
  const absorbMargin = Math.min(8, Math.max(2, target.r * 0.08));
  return dist + target.r <= eater.r + absorbMargin;
}

// ---- Tunables (match classic) ----
const TARGET_PELLETS = 1000;
const INITIAL_GREEN_VIRUSES = 20;
const RED_START_MS = 30000;
const RED_SPAWN_EVERY_MS = 6000;
const RED_MAX = 6;
const RED_VOLLEY_EVERY = 6.5; // s
const RED_BULLETS_PER_VOLLEY = 18;
const MERGE_TIME = 15.0;   // s
const MIN_SPLIT_MASS = 35;
const EJECT_LOSS = 18;
const EJECT_GIVE = 13;
const EJECT_SPEED = 680;   // px/s initial
const EJECT_LIFE = 8.0;    // s
const WORLD = { x: -2500, y: -2500, width: 5000, height: 5000 };

// Game state tracking
const gameState = {
  players: new Map(), // id -> {id,name, ws?, lastSeen, cells:[], isBot?, target?, power:{...}}
  nextPlayerId: 1,
  // Shared game world
  pellets: new Map(), // id -> {id,x,y,color,radius,mass, vel?, life?}
  viruses: new Map(), // id -> {id,x,y,radius,mass, kind:'green'|'red', fed?, _lastDir?, ang?, spin?, ttl?, volleyT?}
  powerUps: new Map(), // id -> {id,x,y,type,ttl}
  bullets: new Map(), // id -> {id,pos:{x,y},vel:{x,y},mass,owner:'hazard'|'player',ttl,rangeLeft?,explodeAtEnd?}
  nextPelletId: 1,
  nextVirusId: 1,
  nextPowerUpId: 1,
  nextBulletId: 1,
  worldBounds: { ...WORLD },
  lastUpdate: Date.now(),
  startTime: Date.now(),
  botTargetCount: 30,
  blackhole: null,
  redSpawnTimer: 0
};

function timeSinceStartMs(){ return Date.now() - gameState.startTime; }

// Initialize shared world with pellets & viruses
function initializeWorld() {
  // Pellets with classic-like mass distribution
  for (let i = 0; i < TARGET_PELLETS; i++) spawnPellet();
  // Green viruses
  for (let i = 0; i < INITIAL_GREEN_VIRUSES; i++) spawnGreenVirus();
  // PowerUps
  for (let i = 0; i < 18; i++) spawnPowerUp();
  // Blackhole at start
  spawnBlackhole();
  console.log(`🌍 World initialized: ${gameState.pellets.size} pellets, ${gameState.viruses.size} viruses, ${gameState.powerUps.size} powerups`);
}

function spawnPellet() {
  const id = gameState.nextPelletId++;
  const r = Math.random();
  let mass;
  if (r < 0.1) mass = rand(8,12);
  else if (r < 0.3) mass = rand(5,7);
  else mass = rand(2,4);
  const x = rand(WORLD.x+60, WORLD.x+WORLD.width-60);
  const y = rand(WORLD.y+60, WORLD.y+WORLD.height-60);
  gameState.pellets.set(id, { id, x, y, color: 'rgba(255,255,255,0.82)', radius: Math.max(2, Math.sqrt(mass)*0.8), mass });
}

function spawnGreenVirus(){
  const id = gameState.nextVirusId++;
  gameState.viruses.set(id, {
    id,
    x: rand(WORLD.x+160, WORLD.x+WORLD.width-160),
    y: rand(WORLD.y+160, WORLD.y+WORLD.height-160),
    radius: rand(42,58),
    mass: 100,
    kind: 'green',
    ang: 0, spin: 0.1
  });
}

function spawnRedVirus(){
  const id = gameState.nextVirusId++;
  const theta = rand(0, Math.PI*2);
  gameState.viruses.set(id, {
    id,
    x: rand(WORLD.x+160, WORLD.x+WORLD.width-160),
    y: rand(WORLD.y+160, WORLD.y+WORLD.height-160),
    radius: rand(42,58),
    mass: 100,
    kind: 'red',
    ang: rand(0,Math.PI*2), spin: rand(0.08,0.14), ttl: rand(20,30), volleyT: RED_VOLLEY_EVERY,
    vel: { x: Math.cos(theta)*rand(1,3), y: Math.sin(theta)*rand(1,3) }
  });
}

function spawnPowerUp(){
  const id = gameState.nextPowerUpId++;
  const types = ['star','multishot','grow','magnet','lightning'];
  const type = types[Math.floor(Math.random()*types.length)];
  const x = rand(WORLD.x+140, WORLD.x+WORLD.width-140);
  const y = rand(WORLD.y+140, WORLD.y+WORLD.height-140);
  gameState.powerUps.set(id, { id, x, y, type, ttl: rand(35,65) });
}

function maintainPellets() {
  const current = gameState.pellets.size;
  if (current < TARGET_PELLETS) {
    const toSpawn = Math.min(60, TARGET_PELLETS - current);
    for (let i=0;i<toSpawn;i++) spawnPellet();
  }
}

function maintainPowerUps(){
  // Remove expired TTL
  for (const [id, pu] of Array.from(gameState.powerUps)){
    pu.ttl -= (Date.now() - gameState.lastUpdate)/1000; if (pu.ttl <= 0) gameState.powerUps.delete(id);
  }
  while (gameState.powerUps.size < 18){ spawnPowerUp(); }
}

function maintainReds(){
  if (timeSinceStartMs() < RED_START_MS) return;
  gameState.redSpawnTimer -= (Date.now() - gameState.lastUpdate);
  const redCount = Array.from(gameState.viruses.values()).filter(v=>v.kind==='red').length;
  if (gameState.redSpawnTimer <= 0 && redCount < RED_MAX){ spawnRedVirus(); gameState.redSpawnTimer = RED_SPAWN_EVERY_MS; }
}

// Simple bot spawner
function maintainBots(){
  let botCount = 0; for (const p of gameState.players.values()) if (p.isBot) botCount++;
  while (botCount < gameState.botTargetCount) { spawnBot(); botCount++; }
}

function spawnBot(){
  const id = gameState.nextPlayerId++;
  const colorHue = Math.floor(Math.random()*360);
  const cell = {
    pos: { x: rand(WORLD.x+200, WORLD.x+WORLD.width-200), y: rand(WORLD.y+200, WORLD.y+WORLD.height-200) },
    radius: radiusFromMass(80),
    mass: 80,
    color: `hsl(${colorHue}, 70%, 60%)`,
    vel: { x: 0, y: 0 },
    mergeCooldown: 6.0
  };
  gameState.players.set(id, { id, name: `BOT_${id}`, lastSeen: Date.now(), cells: [cell], isBot: true, target: randomWorldPoint(), power: newPowerState() });
}

function newPowerState(){
  return { star: 0, multishot: 0, grow: 0, magnet: 0, lightning: 0 };
}

function randomWorldPoint(){ return { x: rand(WORLD.x, WORLD.x+WORLD.width), y: rand(WORLD.y, WORLD.y+WORLD.height) }; }

// Game tick - update shared world
function gameTick() {
  const now = Date.now();
  const dt = (now - gameState.lastUpdate) / 1000;

  // Maintain
  maintainPellets();
  maintainPowerUps();
  maintainBots();
  maintainReds();

  // Update physics for each player
  for (const player of gameState.players.values()) {
    if (player.isBot) botThink(player, dt);
    updatePlayerPhysics(player, dt);
    checkPelletCollisions(player);
    checkPowerUpPickups(player);
  }
  // Resolve cell-cell eats
  resolveEats();

  // Update viruses
  updateViruses(dt);
  // Update bullets
  updateBullets(dt);
  // Update blackhole
  updateBlackhole(dt);

  gameState.lastUpdate = now;
  // Broadcast world state
  broadcastWorldState();
}

function botThink(player, dt){
  const c = player.cells[0]; if (!c) return;
  if (!player.target || Math.random()<0.01) player.target = randomWorldPoint();
  if (Math.random() < 0.02) {
    let best = null, bestScore = -1;
    for (const pl of gameState.pellets.values()){
      const dx = pl.x - c.pos.x, dy = pl.y - c.pos.y; const d = Math.hypot(dx,dy) || 1;
      const score = (pl.mass) / d;
      if (score > bestScore){ bestScore = score; best = { x: pl.x, y: pl.y }; }
    }
    if (best) player.target = best;
  }
  player.inputTarget = player.target;
}

function keepInBounds(pos){
  pos.x = clamp(pos.x, WORLD.x, WORLD.x + WORLD.width);
  pos.y = clamp(pos.y, WORLD.y, WORLD.y + WORLD.height);
}

function updatePlayerPhysics(player, dt) {
  // Grow timer increases mass slowly
  if (player.power?.grow > 0){
    for (const cell of player.cells){ cell.mass += 3 * dt; cell.radius = radiusFromMass(cell.mass); }
    player.power.grow = Math.max(0, player.power.grow - dt);
  }

  // Move toward input target
  for (const cell of player.cells) {
    if (cell.mergeCooldown && cell.mergeCooldown > 0) cell.mergeCooldown -= dt;
    const tx = player.inputTarget?.x ?? cell.pos.x;
    const ty = player.inputTarget?.y ?? cell.pos.y;
    const dx = tx - cell.pos.x, dy = ty - cell.pos.y;
    const d = Math.hypot(dx,dy);
    if (d > 1) {
      const s = speedFromMass(cell.mass);
      const dir = { x: dx/d, y: dy/d };
      cell.vel = cell.vel || { x: 0, y: 0 };
      cell.vel.x += dir.x * s * 0.8 * dt;
      cell.vel.y += dir.y * s * 0.8 * dt;
      const v = Math.hypot(cell.vel.x, cell.vel.y);
      const vmax = s;
      if (v > vmax){ const k = vmax / v; cell.vel.x *= k; cell.vel.y *= k; }
    }
    // Integrate + friction
    cell.pos.x += (cell.vel?.x||0) * dt; cell.pos.y += (cell.vel?.y||0) * dt;
    if (cell.vel){ cell.vel.x *= 0.90; cell.vel.y *= 0.90; }
    keepInBounds(cell.pos);
  }

  // Star aura pulls pellets
  if (player.power?.star > 0){
    const sc = largestCell(player);
    if (sc){
      for (const pl of gameState.pellets.values()){
        const dx = sc.pos.x - pl.x, dy = sc.pos.y - pl.y; const d = Math.hypot(dx,dy);
        if (d < sc.radius + 120){
          const nx = dx/(d||1), ny = dy/(d||1);
          pl.x += nx * 140 * dt; pl.y += ny * 140 * dt; keepInBounds(pl);
        }
      }
    }
    player.power.star = Math.max(0, player.power.star - dt);
  }

  // Magnet slightly increases overall pull (handled implicitly by speed/friction). Keep timer decay.
  if (player.power?.magnet > 0){ player.power.magnet = Math.max(0, player.power.magnet - dt); }
  if (player.power?.multishot > 0){
    player.power.multishot = Math.max(0, player.power.multishot - dt);
    // Auto-fire rockets occasionally
    if (Math.random() < 3 * dt){
      const c = largestCell(player); if (c){
        const dir = norm((player.inputTarget?.x??c.pos.x)-c.pos.x, (player.inputTarget?.y??c.pos.y)-c.pos.y);
        spawnBullet({ x: c.pos.x, y: c.pos.y }, { x: dir.x*380, y: dir.y*380 }, 18, 'player', 2.0, true);
      }
    }
  }
  if (player.power?.lightning > 0){ player.power.lightning = Math.max(0, player.power.lightning - dt); }

  // Self-merge
  if (player.cells.length > 1){
    for (let i=0;i<player.cells.length;i++){
      for (let j=i+1;j<player.cells.length;j++){
        const a = player.cells[i], b = player.cells[j];
        const dx = b.pos.x - a.pos.x, dy = b.pos.y - a.pos.y; const d = Math.hypot(dx,dy) || 1;
        const near = d < (a.radius + b.radius) * 1.06;
        const canMerge = (a.mergeCooldown<=0 && b.mergeCooldown<=0);
        if (near && canMerge){
          const pull = 0.75;
          a.pos.x += (dx/d) * pull * dt * 120; a.pos.y += (dy/d) * pull * dt * 120;
          b.pos.x -= (dx/d) * pull * dt * 120; b.pos.y -= (dy/d) * pull * dt * 120;
          if (d + Math.min(a.radius,b.radius) * 0.72 < Math.max(a.radius,b.radius)){
            let big=a, small=b; if (b.mass>a.mass){ big=b; small=a; }
            big.mass += small.mass; big.radius = radiusFromMass(big.mass);
            const idx = player.cells.indexOf(small); if (idx>=0) player.cells.splice(idx,1);
          }
        }
      }
    }
  }
}

function largestCell(player){
  let best=null; for (const c of player.cells){ if (!best || c.mass>best.mass) best=c; } return best;
}

function checkPelletCollisions(player) {
  for (const cell of player.cells) {
    for (const [pelletId, pellet] of gameState.pellets) {
      const dx = pellet.x - cell.pos.x; const dy = pellet.y - cell.pos.y;
      const distance = Math.hypot(dx,dy);
      const absorb = player.power?.magnet>0 ? cell.radius : cell.radius*0.9;
      if (distance < absorb) {
        cell.mass += pellet.mass; cell.radius = radiusFromMass(cell.mass);
        gameState.pellets.delete(pelletId);
      }
    }
  }
}

function checkPowerUpPickups(player){
  for (const [id, pu] of Array.from(gameState.powerUps)){
    for (const cell of player.cells){
      const dx = pu.x - cell.pos.x, dy = pu.y - cell.pos.y; const d = Math.hypot(dx,dy);
      if (d < cell.radius + 18){
        // apply
        player.power = player.power || newPowerState();
        if (pu.type==='star') player.power.star = Math.max(player.power.star, 10);
        if (pu.type==='multishot') player.power.multishot = Math.max(player.power.multishot, 12);
        if (pu.type==='grow') player.power.grow = Math.max(player.power.grow, 12);
        if (pu.type==='magnet') player.power.magnet = Math.max(player.power.magnet, 12);
        if (pu.type==='lightning') player.power.lightning = Math.max(player.power.lightning, 10);
        gameState.powerUps.delete(id);
        break;
      }
    }
  }
}

function resolveEats(){
  const entries = [];
  for (const p of gameState.players.values()){
    for (const c of p.cells){ entries.push({ p, c }); }
  }
  for (let i=0;i<entries.length;i++){
    for (let j=0;j<entries.length;j++){
      if (i===j) continue; const A = entries[i], B = entries[j];
      if (A.p === B.p) continue;
      const eater = { x:A.c.pos.x, y:A.c.pos.y, r:A.c.radius, m:A.c.mass };
      const target= { x:B.c.pos.x, y:B.c.pos.y, r:B.c.radius, m:B.c.mass };
      const lightning = !!(A.p.power && A.p.power.lightning>0);
      if (canEat(eater, target, lightning)){
        A.c.mass += B.c.mass; A.c.radius = radiusFromMass(A.c.mass);
        const idx = B.p.cells.indexOf(B.c); if (idx>=0) B.p.cells.splice(idx,1);
        if (B.p.cells.length === 0){ respawnPlayer(B.p); }
      }
    }
  }
}

function updateViruses(dt){
  // Eject pellets motion
  for (const pl of gameState.pellets.values()){
    if (pl.vel){ pl.x += pl.vel.x * dt; pl.y += pl.vel.y * dt; pl.vel.x *= 0.93; pl.vel.y *= 0.93; keepInBounds(pl); }
    if (pl.life !== undefined){ pl.life -= dt; if (pl.life <= 0){ gameState.pellets.delete(pl.id); } }
  }
  // Virus feeding & behavior
  for (const v of gameState.viruses.values()){
    v.ang = (v.ang||0) + (v.spin||0) * dt;
    if (v.kind === 'green'){
      for (const pl of Array.from(gameState.pellets.values())){
        if (!pl.vel) continue; const dx = pl.x - v.x, dy = pl.y - v.y; if (Math.hypot(dx,dy) <= (v.radius + 4)){
          v.fed = (v.fed||0)+1; v._lastDir = { x: pl.vel.x, y: pl.vel.y }; gameState.pellets.delete(pl.id);
        }
      }
      if ((v.fed||0) >= 7){
        const d = v._lastDir || { x:1, y:0 }; const L = Math.hypot(d.x,d.y) || 1; const dir = { x: d.x/L, y: d.y/L };
        const nx = clamp(v.x + dir.x * v.radius * 3, WORLD.x+80, WORLD.x+WORLD.width-80);
        const ny = clamp(v.y + dir.y * v.radius * 3, WORLD.y+80, WORLD.y+WORLD.height-80);
        const id = gameState.nextVirusId++;
        gameState.viruses.set(id, { id, x:nx, y:ny, radius:v.radius, mass:100, kind:'green', ang:0, spin:0.1 });
        v.fed = 0;
      }
    } else if (v.kind === 'red'){
      // move
      if (v.vel){ v.x += v.vel.x * dt; v.y += v.vel.y * dt; }
      // bounce on bounds
      if (v.x < WORLD.x+v.radius){ v.x = WORLD.x+v.radius; v.vel.x *= -0.8; }
      if (v.x > WORLD.x+WORLD.width - v.radius){ v.x = WORLD.x+WORLD.width - v.radius; v.vel.x *= -0.8; }
      if (v.y < WORLD.y+v.radius){ v.y = WORLD.y+v.radius; v.vel.y *= -0.8; }
      if (v.y > WORLD.y+WORLD.height - v.radius){ v.y = WORLD.y+WORLD.height - v.radius; v.vel.y *= -0.8; }
      v.ttl = (v.ttl||0) - dt; if (v.ttl<=0){ gameState.viruses.delete(v.id); continue; }
      v.volleyT = (v.volleyT||RED_VOLLEY_EVERY) - dt; if (v.volleyT<=0){ v.volleyT = RED_VOLLEY_EVERY; fireRedVolley(v); }
    }
  }
}

function fireRedVolley(v){
  const N = RED_BULLETS_PER_VOLLEY; const speed = 340; const range = 4.2 * v.radius;
  for (let k=0;k<N;k++){
    const ang = (k / N) * Math.PI * 2; const dir = { x: Math.cos(ang), y: Math.sin(ang) };
    spawnBullet({ x: v.x, y: v.y }, { x: dir.x * speed, y: dir.y * speed }, 10, 'hazard', 2.0, false, range);
  }
}

function spawnBullet(pos, vel, mass, owner, ttl, explodeAtEnd=false, rangeLeft=null){
  const id = gameState.nextBulletId++;
  gameState.bullets.set(id, { id, pos: { ...pos }, vel: { ...vel }, mass, owner, ttl, explodeAtEnd, rangeLeft });
}

function updateBullets(dt){
  for (const [id, b] of Array.from(gameState.bullets)){
    b.pos.x += b.vel.x * dt; b.pos.y += b.vel.y * dt;
    b.ttl -= dt; if (b.ttl <= 0){ gameState.bullets.delete(id); continue; }
    if (b.rangeLeft != null){ b.rangeLeft -= Math.hypot(b.vel.x*dt, b.vel.y*dt); if (b.rangeLeft <= 0){ gameState.bullets.delete(id); continue; } }
    // Collide with players (hazard only damages)
    if (b.owner === 'hazard'){
      for (const p of gameState.players.values()){
        for (const c of p.cells){
          const dx = b.pos.x - c.pos.x, dy = b.pos.y - c.pos.y; if (Math.hypot(dx,dy) < c.radius){
            c.mass = Math.max(15, c.mass - b.mass*2); c.radius = radiusFromMass(c.mass); gameState.bullets.delete(id);
            break;
          }
        }
      }
    }
  }
}

function spawnBlackhole(){
  gameState.blackhole = { x: rand(WORLD.x+800, WORLD.x+WORLD.width-800), y: rand(WORLD.y+800, WORLD.y+WORLD.height-800), radius: 120, pullRadius: 520, active: true, imploding: false, ttl: 90, respawnT: 5*60 };
}

function updateBlackhole(dt){
  const bh = gameState.blackhole; if (!bh) return;
  if (!bh.active){ bh.respawnT -= dt; if (bh.respawnT <= 0){ spawnBlackhole(); } return; }
  bh.ttl -= dt; if (bh.ttl <= 0){ bh.imploding = true; bh.active = false; return; }
  // pull
  for (const p of gameState.players.values()){
    for (const c of p.cells){
      const dx = bh.x - c.pos.x, dy = bh.y - c.pos.y; const d = Math.hypot(dx,dy) || 1;
      if (d < bh.pullRadius){ const strength = (1 - d/bh.pullRadius) * 260; c.pos.x += (dx/d) * strength * dt; c.pos.y += (dy/d) * strength * dt; }
      if (d < bh.radius * 0.6){ // consume
        // respawn player
        p.cells = []; respawnPlayer(p);
      }
    }
  }
  // affect pellets slightly
  for (const pl of gameState.pellets.values()){
    const dx = bh.x - pl.x, dy = bh.y - pl.y; const d = Math.hypot(dx,dy) || 1;
    if (d < bh.pullRadius){ const s = (1 - d/bh.pullRadius) * 140; pl.x += (dx/d) * s * dt; pl.y += (dy/d) * s * dt; keepInBounds(pl); }
  }
}

function respawnPlayer(player) {
  player.cells = [{
    pos: { x: rand(WORLD.x, WORLD.x+WORLD.width), y: rand(WORLD.y, WORLD.y+WORLD.height) },
    radius: radiusFromMass(80), mass: 80,
    color: `hsl(${Math.random()*360|0}, 70%, 60%)`, vel: { x: 0, y: 0 }, mergeCooldown: 3.0
  }];
  player.power = newPowerState();
}

function broadcastWorldState() {
  const worldData = {
    type: 'worldState',
    pellets: Array.from(gameState.pellets.values()),
    viruses: Array.from(gameState.viruses.values()),
    powerUps: Array.from(gameState.powerUps.values()),
    bullets: Array.from(gameState.bullets.values()),
    blackhole: gameState.blackhole,
    players: Array.from(gameState.players.values()).map(p => ({ id: p.id, name: p.name, cells: p.cells })),
    timestamp: Date.now(),
    worldBounds: gameState.worldBounds
  };
  const message = JSON.stringify(worldData);
  for (const client of wss.clients) { if (client.readyState === 1) { try { client.send(message); } catch {} } }
}

function broadcastPlayerCount() {
  const playerCount = gameState.players.size;
  const message = JSON.stringify({ type: 'playerCount', count: playerCount, players: Array.from(gameState.players.values()).map(p => ({ id: p.id, name: p.name })) });
  for (const client of wss.clients) { if (client.readyState === 1) { try { client.send(message); } catch {} } }
}

function broadcastPlayerJoined(playerId, playerName) {
  const message = JSON.stringify({ type: 'playerJoined', playerId, playerName, timestamp: Date.now() });
  for (const client of wss.clients) { if (client.readyState === 1) { try { client.send(message); } catch {} } }
}

function broadcastPlayerLeft(playerId, playerName) {
  const message = JSON.stringify({ type: 'playerLeft', playerId, playerName, timestamp: Date.now() });
  for (const client of wss.clients) { if (client.readyState === 1) { try { client.send(message); } catch {} } }
}

// Initialize world when server starts
initializeWorld();

// Start game loop
setInterval(gameTick, 1000 / 20); // 20 TPS

// Clean up disconnected players periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, player] of gameState.players) {
    if (!player.ws && player.isBot) continue; // keep bots
    if (player.ws && now - player.lastSeen > 30000) { // 30s timeout
      gameState.players.delete(id);
      broadcastPlayerCount();
    }
  }
}, 10000);

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log('ws connection from', req.socket.remoteAddress);
  const playerId = gameState.nextPlayerId++;
  try { ws.send(JSON.stringify({ type: 'welcome', time: Date.now(), playerId, totalPlayers: gameState.players.size + 1 })); } catch {}

  ws.on('message', (msg) => {
    const text = msg.toString(); let data; try { data = JSON.parse(text); } catch { data = { type: 'text', text }; }

    if (data?.type === 'join' || data?.type === 'joinShared') {
      const playerData = {
        id: playerId,
        name: data.name || `Player_${playerId}`,
        ws,
        lastSeen: Date.now(),
        inputTarget: undefined,
        power: newPowerState(),
        cells: [{ pos: { x: rand(WORLD.x, WORLD.x+WORLD.width), y: rand(WORLD.y, WORLD.y+WORLD.height) }, radius: radiusFromMass(80), mass: 80, color: `hsl(${Math.random()*360|0}, 70%, 60%)`, vel: { x:0, y:0 }, mergeCooldown: 3.0 }]
      };
      gameState.players.set(playerId, playerData);
      try { ws.send(JSON.stringify({ type: 'initialWorld', pellets: Array.from(gameState.pellets.values()), viruses: Array.from(gameState.viruses.values()), powerUps: Array.from(gameState.powerUps.values()), bullets: Array.from(gameState.bullets.values()), blackhole: gameState.blackhole, yourPlayerId: playerId, worldBounds: gameState.worldBounds })); } catch {}
      try { ws.send(JSON.stringify({ type: 'welcome', totalPlayers: gameState.players.size, message: data?.type === 'joinShared' ? 'Willkommen in der gemeinsamen Welt!' : 'Verbunden!' })); } catch {}
      broadcastPlayerJoined(playerId, data.name);
      broadcastPlayerCount();
    }

    else if (data?.type === 'playerInput') {
      const player = gameState.players.get(playerId); if (player) {
        const targetX = data.input?.targetX ?? player.cells[0]?.pos.x ?? 0;
        const targetY = data.input?.targetY ?? player.cells[0]?.pos.y ?? 0;
        player.inputTarget = { x: targetX, y: targetY };
        player.lastSeen = Date.now();
      }
    }

    else if (data?.type === 'playerAction') {
      const player = gameState.players.get(playerId); if (!player) return;
      const action = data.action;
      if (action === 'split') handleSplit(player);
      else if (action === 'eject') handleEject(player);
      player.lastSeen = Date.now();
    }

    else if (data?.type === 'heartbeat') {
      const player = gameState.players.get(playerId); if (player) player.lastSeen = Date.now();
    }
  });

  ws.on('close', () => {
    const player = gameState.players.get(playerId); const playerName = player ? player.name : 'Unknown';
    gameState.players.delete(playerId);
    broadcastPlayerLeft(playerId, playerName);
    broadcastPlayerCount();
  });

  ws.on('error', (err) => console.error('ws error', err));
});

// --- Actions ---
function handleSplit(player){
  if (!player.cells.length) return;
  let largest = player.cells[0]; for (const cc of player.cells){ if (cc.mass > largest.mass) largest = cc; }
  if (largest.mass < MIN_SPLIT_MASS) return;
  const dir = norm((player.inputTarget?.x ?? largest.pos.x) - largest.pos.x, (player.inputTarget?.y ?? largest.pos.y) - largest.pos.y);
  const mA = largest.mass * 0.5; const mB = largest.mass - mA;
  largest.mass = mA; largest.radius = radiusFromMass(mA); largest.mergeCooldown = MERGE_TIME;
  const newCell = { pos: { x: largest.pos.x + dir.x * (largest.radius*1.2), y: largest.pos.y + dir.y * (largest.radius*1.2) }, radius: radiusFromMass(mB), mass: mB, color: largest.color, vel: { x: dir.x * 520, y: dir.y * 520 }, mergeCooldown: MERGE_TIME };
  largest.vel = largest.vel || { x:0, y:0 }; largest.vel.x -= dir.x * 100; largest.vel.y -= dir.y * 100;
  player.cells.push(newCell);
}

function handleEject(player){
  for (const c of player.cells){
    if (c.mass <= 10) continue;
    c.mass = Math.max(10, c.mass - EJECT_LOSS); c.radius = radiusFromMass(c.mass);
    const dir = norm((player.inputTarget?.x ?? c.pos.x) - c.pos.x, (player.inputTarget?.y ?? c.pos.y) - c.pos.y);
    const id = gameState.nextPelletId++;
    const speed = EJECT_SPEED;
    const px = c.pos.x + dir.x * (c.radius * 0.9), py = c.pos.y + dir.y * (c.radius * 0.9);
    const pellet = { id, x: px, y: py, color: 'rgba(255,255,255,0.9)', radius: Math.max(2, Math.sqrt(EJECT_GIVE)*0.8), mass: EJECT_GIVE, vel: { x: dir.x * speed, y: dir.y * speed }, life: EJECT_LIFE };
    gameState.pellets.set(id, pellet);
    c.vel = c.vel || { x:0, y:0 }; c.vel.x -= dir.x * 0.02 * speed; c.vel.y -= dir.y * 0.02 * speed;
  }
}

server.listen(port, () => {
  console.log(`HTTP+WS server listening on http://0.0.0.0:${port}`);
});
