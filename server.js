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
function canEat(eater, target){
  // 1.25x mass rule + center inclusion
  if (eater.m < target.m * 1.25) return false;
  const dx = eater.x - target.x, dy = eater.y - target.y; const dist = Math.hypot(dx,dy);
  const absorbMargin = Math.min(8, Math.max(2, target.r * 0.08));
  return dist + target.r <= eater.r + absorbMargin;
}

// ---- Tunables (match classic) ----
const TARGET_PELLETS = 1000;
const INITIAL_GREEN_VIRUSES = 20;
const MERGE_TIME = 15.0;   // s
const MIN_SPLIT_MASS = 35;
const EJECT_LOSS = 18;
const EJECT_GIVE = 13;
const EJECT_SPEED = 680;   // px/s initial
const EJECT_LIFE = 8.0;    // s
const WORLD = { x: -2500, y: -2500, width: 5000, height: 5000 };

// Game state tracking
const gameState = {
  players: new Map(), // id -> {id,name, ws?, lastSeen, cells:[], isBot?, target?:{x,y}}
  nextPlayerId: 1,
  // Shared game world
  pellets: new Map(), // id -> {id,x,y,color,radius,mass, vel?, life?}
  viruses: new Map(), // id -> {id,x,y,radius,mass, kind:'green'|'red', fed?, _lastDir?}
  powerUps: new Map(), // keep for future
  nextPelletId: 1,
  nextVirusId: 1,
  nextPowerUpId: 1,
  worldBounds: { ...WORLD },
  lastUpdate: Date.now(),
  botTargetCount: 30
};

// Initialize shared world with pellets & viruses
function initializeWorld() {
  // Pellets with classic-like mass distribution
  for (let i = 0; i < TARGET_PELLETS; i++) spawnPellet();
  // Green viruses
  for (let i = 0; i < INITIAL_GREEN_VIRUSES; i++) {
    const id = gameState.nextVirusId++;
    gameState.viruses.set(id, {
      id,
      x: rand(WORLD.x+160, WORLD.x+WORLD.width-160),
      y: rand(WORLD.y+160, WORLD.y+WORLD.height-160),
      radius: rand(42,58),
      mass: 100,
      kind: 'green'
    });
  }
  console.log(`🌍 World initialized: ${gameState.pellets.size} pellets, ${gameState.viruses.size} viruses`);
}

function spawnPellet() {
  const id = gameState.nextPelletId++;
  // mass tiers: 10% big (8..12), 20% mid (5..7), else small (2..4)
  const r = Math.random();
  let mass;
  if (r < 0.1) mass = rand(8,12);
  else if (r < 0.3) mass = rand(5,7);
  else mass = rand(2,4);
  const x = rand(WORLD.x+60, WORLD.x+WORLD.width-60);
  const y = rand(WORLD.y+60, WORLD.y+WORLD.height-60);
  gameState.pellets.set(id, { id, x, y, color: 'rgba(255,255,255,0.82)', radius: Math.max(2, Math.sqrt(mass)*0.8), mass });
}

// Spawn new pellets to maintain count
function maintainPellets() {
  const current = gameState.pellets.size;
  if (current < TARGET_PELLETS) {
    const toSpawn = Math.min(60, TARGET_PELLETS - current);
    for (let i=0;i<toSpawn;i++) spawnPellet();
  }
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
    radius: 20,
    mass: 80,
    color: `hsl(${colorHue}, 70%, 60%)`,
    vel: { x: 0, y: 0 },
    mergeCooldown: 6.0
  };
  gameState.players.set(id, { id, name: `BOT_${id}`, lastSeen: Date.now(), cells: [cell], isBot: true, target: randomWorldPoint() });
}

function randomWorldPoint(){ return { x: rand(WORLD.x, WORLD.x+WORLD.width), y: rand(WORLD.y, WORLD.y+WORLD.height) }; }

// Game tick - update shared world
function gameTick() {
  const now = Date.now();
  const deltaTime = (now - gameState.lastUpdate) / 1000;
  gameState.lastUpdate = now;

  maintainPellets();
  maintainBots();

  // Update physics for each player
  for (const player of gameState.players.values()) {
    // Decide target for bots
    if (player.isBot) botThink(player, deltaTime);
    updatePlayerPhysics(player, deltaTime);
    // Resolve pellet eats
    checkPelletCollisions(player);
  }
  // Resolve cell-cell eats (multiple passes to avoid order bias)
  resolveEats();

  // Update viruses and interactions
  updateViruses(deltaTime);

  // Broadcast world state to all players
  broadcastWorldState();
}

function botThink(player, dt){
  // simple wander + chase nearest pellet center occasionally
  const c = player.cells[0]; if (!c) return;
  if (!player.target || Math.random()<0.01) player.target = randomWorldPoint();
  // Occasionally retarget to a dense pellet area
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

function updatePlayerPhysics(player, deltaTime) {
  // Move toward input target per cell
  for (const cell of player.cells) {
    // Merge cooldown
    if (cell.mergeCooldown && cell.mergeCooldown > 0) cell.mergeCooldown -= deltaTime;

    // Desire
    const tx = player.inputTarget?.x ?? cell.pos.x;
    const ty = player.inputTarget?.y ?? cell.pos.y;
    const dx = tx - cell.pos.x, dy = ty - cell.pos.y;
    const d = Math.hypot(dx,dy);
    if (d > 1) {
      const s = speedFromMass(cell.mass);
      const dir = { x: dx/d, y: dy/d };
      // accelerate toward target
      cell.vel = cell.vel || { x: 0, y: 0 };
      cell.vel.x += dir.x * s * 0.8 * deltaTime;
      cell.vel.y += dir.y * s * 0.8 * deltaTime;
      // speed cap roughly to s
      const v = Math.hypot(cell.vel.x, cell.vel.y);
      const vmax = s;
      if (v > vmax){ const k = vmax / v; cell.vel.x *= k; cell.vel.y *= k; }
    }

    // Integrate
    if (!cell.vel) cell.vel = { x:0, y:0 };
    cell.pos.x += cell.vel.x * deltaTime;
    cell.pos.y += cell.vel.y * deltaTime;
    // Friction
    cell.vel.x *= 0.90; cell.vel.y *= 0.90;

    // Bounds
    keepInBounds(cell.pos);
  }

  // Gentle self-merge when cooldown over
  if (player.cells.length > 1){
    for (let i=0;i<player.cells.length;i++){
      for (let j=i+1;j<player.cells.length;j++){
        const a = player.cells[i], b = player.cells[j];
        const dx = b.pos.x - a.pos.x, dy = b.pos.y - a.pos.y; const d = Math.hypot(dx,dy) || 1;
        const near = d < (a.radius + b.radius) * 1.06;
        const canMerge = (a.mergeCooldown<=0 && b.mergeCooldown<=0);
        if (near && canMerge){
          // attractive pull
          const pull = 0.75;
          a.pos.x += (dx/d) * pull * deltaTime * 120;
          a.pos.y += (dy/d) * pull * deltaTime * 120;
          b.pos.x -= (dx/d) * pull * deltaTime * 120;
          b.pos.y -= (dy/d) * pull * deltaTime * 120;
          // merge if strong overlap
          if (d + Math.min(a.radius,b.radius) * 0.72 < Math.max(a.radius,b.radius)){
            // merge smaller into larger
            let big=a, small=b; if (b.mass>a.mass){ big=b; small=a; }
            big.mass += small.mass; big.radius = radiusFromMass(big.mass);
            const idx = player.cells.indexOf(small); if (idx>=0) player.cells.splice(idx,1);
          }
        }
      }
    }
  }
}

function checkPelletCollisions(player) {
  for (const cell of player.cells) {
    for (const [pelletId, pellet] of gameState.pellets) {
      const dx = pellet.x - cell.pos.x; const dy = pellet.y - cell.pos.y;
      const distance = Math.hypot(dx,dy);
      if (distance < cell.radius * 0.9) {
        cell.mass += pellet.mass;
        cell.radius = radiusFromMass(cell.mass);
        gameState.pellets.delete(pelletId);
      }
    }
  }
}

function resolveEats(){
  // build list of all cells with owner
  const entries = [];
  for (const p of gameState.players.values()){
    for (const c of p.cells){ entries.push({ p, c }); }
  }
  // naive O(n^2)
  for (let i=0;i<entries.length;i++){
    for (let j=0;j<entries.length;j++){
      if (i===j) continue; const A = entries[i], B = entries[j];
      if (A.p === B.p) continue; // opponent only
      const eater = { x:A.c.pos.x, y:A.c.pos.y, r:A.c.radius, m:A.c.mass };
      const target= { x:B.c.pos.x, y:B.c.pos.y, r:B.c.radius, m:B.c.mass };
      if (canEat(eater, target)){
        // consume B.c
        A.c.mass += B.c.mass; A.c.radius = radiusFromMass(A.c.mass);
        const idx = B.p.cells.indexOf(B.c); if (idx>=0) B.p.cells.splice(idx,1);
        if (B.p.cells.length === 0){ respawnPlayer(B.p); }
      }
    }
  }
}

function updateViruses(dt){
  // move ejected pellets (with vel/life)
  for (const pl of gameState.pellets.values()){
    if (pl.vel){
      pl.x += pl.vel.x * dt; pl.y += pl.vel.y * dt; pl.vel.x *= 0.93; pl.vel.y *= 0.93;
      keepInBounds(pl);
    }
    if (pl.life !== undefined){ pl.life -= dt; if (pl.life <= 0){ gameState.pellets.delete(pl.id); continue; } }
  }

  // virus feeding from ejects; spawn new green when fed >=7 in last direction
  for (const v of gameState.viruses.values()){
    if (v.kind !== 'green') continue;
    // jitter spin placeholder
    // check collisions with moving pellets
    for (const pl of Array.from(gameState.pellets.values())){
      if (!pl.vel) continue;
      const dx = pl.x - v.x, dy = pl.y - v.y; if (Math.hypot(dx,dy) <= (v.radius + 4)){
        v.fed = (v.fed||0)+1; v._lastDir = { x: pl.vel.x, y: pl.vel.y }; gameState.pellets.delete(pl.id);
      }
    }
    if ((v.fed||0) >= 7){
      const d = v._lastDir || { x:1, y:0 }; const L = Math.hypot(d.x,d.y) || 1; const dir = { x: d.x/L, y: d.y/L };
      const id = gameState.nextVirusId++;
      const nx = v.x + dir.x * v.radius * 3, ny = v.y + dir.y * v.radius * 3;
      // keep inside bounds
      const x = clamp(nx, WORLD.x+80, WORLD.x+WORLD.width-80);
      const y = clamp(ny, WORLD.y+80, WORLD.y+WORLD.height-80);
      gameState.viruses.set(id, { id, x, y, radius: v.radius, mass: 100, kind:'green' });
      v.fed = 0;
    }
  }
}

function respawnPlayer(player) {
  player.cells = [{
    pos: { x: rand(WORLD.x, WORLD.x+WORLD.width), y: rand(WORLD.y, WORLD.y+WORLD.height) },
    radius: radiusFromMass(80),
    mass: 80,
    color: `hsl(${Math.random()*360|0}, 70%, 60%)`,
    vel: { x: 0, y: 0 },
    mergeCooldown: 3.0
  }];
}

function broadcastWorldState() {
  const worldData = {
    type: 'worldState',
    pellets: Array.from(gameState.pellets.values()),
    viruses: Array.from(gameState.viruses.values()),
    powerUps: Array.from(gameState.powerUps.values()),
    players: Array.from(gameState.players.values()).map(p => ({ id: p.id, name: p.name, cells: p.cells })),
    timestamp: Date.now(),
    worldBounds: gameState.worldBounds
  };

  const message = JSON.stringify(worldData);
  for (const client of wss.clients) {
    if (client.readyState === 1) { try { client.send(message); } catch {} }
  }
}

function broadcastPlayerCount() {
  const playerCount = gameState.players.size;
  const message = JSON.stringify({ 
    type: 'playerCount', 
    count: playerCount,
    players: Array.from(gameState.players.values()).map(p => ({ id: p.id, name: p.name }))
  });
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
        cells: [{
          pos: { x: rand(WORLD.x, WORLD.x+WORLD.width), y: rand(WORLD.y, WORLD.y+WORLD.height) },
          radius: radiusFromMass(80), mass: 80, color: `hsl(${Math.random()*360|0}, 70%, 60%)`, vel: { x:0, y:0 }, mergeCooldown: 3.0
        }]
      };
      gameState.players.set(playerId, playerData);
      try { ws.send(JSON.stringify({ type: 'initialWorld', pellets: Array.from(gameState.pellets.values()), viruses: Array.from(gameState.viruses.values()), powerUps: Array.from(gameState.powerUps.values()), yourPlayerId: playerId, worldBounds: gameState.worldBounds })); } catch {}
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
  // split largest cell in direction of inputTarget
  if (!player.cells.length) return;
  // find largest
  let largest = player.cells[0], idx = 0; for (let i=1;i<player.cells.length;i++){ if (player.cells[i].mass > largest.mass){ largest = player.cells[i]; idx = i; } }
  if (largest.mass < MIN_SPLIT_MASS) return;
  const dir = norm((player.inputTarget?.x ?? largest.pos.x) - largest.pos.x, (player.inputTarget?.y ?? largest.pos.y) - largest.pos.y);
  const mA = largest.mass * 0.5; const mB = largest.mass - mA;
  largest.mass = mA; largest.radius = radiusFromMass(mA); largest.mergeCooldown = MERGE_TIME;
  const newCell = { pos: { x: largest.pos.x + dir.x * (largest.radius*1.2), y: largest.pos.y + dir.y * (largest.radius*1.2) }, radius: radiusFromMass(mB), mass: mB, color: largest.color, vel: { x: dir.x * 520, y: dir.y * 520 }, mergeCooldown: MERGE_TIME };
  // recoil
  largest.vel = largest.vel || { x:0, y:0 }; largest.vel.x -= dir.x * 100; largest.vel.y -= dir.y * 100;
  player.cells.push(newCell);
}

function handleEject(player){
  for (const c of player.cells){
    if (c.mass <= 10) continue;
    // reduce mass
    c.mass = Math.max(10, c.mass - EJECT_LOSS); c.radius = radiusFromMass(c.mass);
    const dir = norm((player.inputTarget?.x ?? c.pos.x) - c.pos.x, (player.inputTarget?.y ?? c.pos.y) - c.pos.y);
    const id = gameState.nextPelletId++;
    const speed = EJECT_SPEED;
    const px = c.pos.x + dir.x * (c.radius * 0.9), py = c.pos.y + dir.y * (c.radius * 0.9);
    const pellet = { id, x: px, y: py, color: 'rgba(255,255,255,0.9)', radius: Math.max(2, Math.sqrt(EJECT_GIVE)*0.8), mass: EJECT_GIVE, vel: { x: dir.x * speed, y: dir.y * speed }, life: EJECT_LIFE };
    gameState.pellets.set(id, pellet);
    // slight recoil damp
    c.vel = c.vel || { x:0, y:0 }; c.vel.x -= dir.x * 0.02 * speed; c.vel.y -= dir.y * 0.02 * speed;
  }
}

server.listen(port, () => {
  console.log(`HTTP+WS server listening on http://0.0.0.0:${port}`);
});
