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

// Game state tracking
const gameState = {
  players: new Map(), // id -> {name, ws, lastSeen, position, cells}
  nextPlayerId: 1,
  // Shared game world
  pellets: new Map(), // id -> {x, y, color, radius, mass}
  viruses: new Map(), // id -> {x, y, radius, mass}
  powerUps: new Map(), // id -> {x, y, type, radius}
  nextPelletId: 1,
  nextVirusId: 1,
  nextPowerUpId: 1,
  worldBounds: { x: -3000, y: -3000, width: 6000, height: 6000 },
  lastUpdate: Date.now()
};

// Initialize shared world with pellets
function initializeWorld() {
  // Add 1000 pellets
  for (let i = 0; i < 1000; i++) {
    const id = gameState.nextPelletId++;
    gameState.pellets.set(id, {
      id,
      x: Math.random() * gameState.worldBounds.width + gameState.worldBounds.x,
      y: Math.random() * gameState.worldBounds.height + gameState.worldBounds.y,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      radius: 3 + Math.random() * 2,
      mass: 1
    });
  }

  // Add some viruses
  for (let i = 0; i < 20; i++) {
    const id = gameState.nextVirusId++;
    gameState.viruses.set(id, {
      id,
      x: Math.random() * gameState.worldBounds.width + gameState.worldBounds.x,
      y: Math.random() * gameState.worldBounds.height + gameState.worldBounds.y,
      radius: 50,
      mass: 100
    });
  }

  console.log(`🌍 World initialized: ${gameState.pellets.size} pellets, ${gameState.viruses.size} viruses`);
}

// Spawn new pellets to maintain count
function maintainPellets() {
  const targetPellets = 1000;
  const currentPellets = gameState.pellets.size;
  
  if (currentPellets < targetPellets) {
    const toSpawn = Math.min(50, targetPellets - currentPellets);
    
    for (let i = 0; i < toSpawn; i++) {
      const id = gameState.nextPelletId++;
      gameState.pellets.set(id, {
        id,
        x: Math.random() * gameState.worldBounds.width + gameState.worldBounds.x,
        y: Math.random() * gameState.worldBounds.height + gameState.worldBounds.y,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        radius: 3 + Math.random() * 2,
        mass: 1
      });
    }
  }
}

// Game tick - update shared world
function gameTick() {
  const now = Date.now();
  const deltaTime = (now - gameState.lastUpdate) / 1000;
  gameState.lastUpdate = now;

  // Maintain pellet count
  maintainPellets();

  // Update player physics
  for (const [playerId, player] of gameState.players) {
    updatePlayerPhysics(player, deltaTime);
    
    // Check collisions with pellets
    checkPelletCollisions(player);
    
    // Check collisions with other players
    checkPlayerCollisions(player);
  }

  // Broadcast world state to all players
  broadcastWorldState();
}

function updatePlayerPhysics(player, deltaTime) {
  // Simple physics update
  for (const cell of player.cells) {
    // Apply friction
    cell.vel = cell.vel || { x: 0, y: 0 };
    cell.vel.x *= 0.95;
    cell.vel.y *= 0.95;
    
    // Update position
    cell.pos.x += cell.vel.x * deltaTime;
    cell.pos.y += cell.vel.y * deltaTime;
    
    // Keep in bounds
    const bounds = gameState.worldBounds;
    cell.pos.x = Math.max(bounds.x, Math.min(bounds.x + bounds.width, cell.pos.x));
    cell.pos.y = Math.max(bounds.y, Math.min(bounds.y + bounds.height, cell.pos.y));
  }
}

function checkPelletCollisions(player) {
  for (const cell of player.cells) {
    for (const [pelletId, pellet] of gameState.pellets) {
      const dx = cell.pos.x - pellet.x;
      const dy = cell.pos.y - pellet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < cell.radius) {
        // Player ate pellet
        cell.mass += pellet.mass;
        cell.radius = Math.sqrt(cell.mass / Math.PI) * 5; // Update radius based on mass
        gameState.pellets.delete(pelletId);
        
        // Notify all players about pellet consumption
        broadcastPelletEaten(pelletId, player.id);
      }
    }
  }
}

function checkPlayerCollisions(player) {
  for (const cell of player.cells) {
    for (const [otherPlayerId, otherPlayer] of gameState.players) {
      if (otherPlayerId === player.id) continue;
      
      for (const otherCell of otherPlayer.cells) {
        const dx = cell.pos.x - otherCell.pos.x;
        const dy = cell.pos.y - otherCell.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Can eat if 20% bigger
        if (cell.mass > otherCell.mass * 1.2 && distance < cell.radius) {
          // Player ate other player
          cell.mass += otherCell.mass;
          cell.radius = Math.sqrt(cell.mass / Math.PI) * 5;
          
          // Remove eaten cell
          const cellIndex = otherPlayer.cells.indexOf(otherCell);
          if (cellIndex !== -1) {
            otherPlayer.cells.splice(cellIndex, 1);
          }
          
          // If player has no cells left, respawn them
          if (otherPlayer.cells.length === 0) {
            respawnPlayer(otherPlayer);
          }
          
          broadcastPlayerEaten(player.id, otherPlayerId);
        }
      }
    }
  }
}

function respawnPlayer(player) {
  player.cells = [{
    pos: {
      x: Math.random() * gameState.worldBounds.width + gameState.worldBounds.x,
      y: Math.random() * gameState.worldBounds.height + gameState.worldBounds.y
    },
    radius: 20,
    mass: 10,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    vel: { x: 0, y: 0 }
  }];
}

function broadcastWorldState() {
  const worldData = {
    type: 'worldState',
    pellets: Array.from(gameState.pellets.values()),
    viruses: Array.from(gameState.viruses.values()),
    powerUps: Array.from(gameState.powerUps.values()),
    players: Array.from(gameState.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      cells: p.cells
    })),
    timestamp: Date.now()
  };

  const message = JSON.stringify(worldData);
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      try { client.send(message); } catch {} 
    }
  }
}

function broadcastPelletEaten(pelletId, playerId) {
  const message = JSON.stringify({
    type: 'pelletEaten',
    pelletId,
    playerId,
    timestamp: Date.now()
  });
  
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      try { client.send(message); } catch {}
    }
  }
}

function broadcastPlayerEaten(eaterPlayerId, eatenPlayerId) {
  const message = JSON.stringify({
    type: 'playerEaten',
    eaterPlayerId,
    eatenPlayerId,
    timestamp: Date.now()
  });
  
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      try { client.send(message); } catch {}
    }
  }
}

// Initialize world when server starts
initializeWorld();

// Start game loop
setInterval(gameTick, 1000 / 20); // 20 TPS

// Clean up disconnected players periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, player] of gameState.players) {
    if (now - player.lastSeen > 30000) { // 30 seconds timeout
      gameState.players.delete(id);
      broadcastPlayerCount();
    }
  }
}, 10000); // Check every 10 seconds

function broadcastPlayerCount() {
  const playerCount = gameState.players.size;
  const message = JSON.stringify({ 
    type: 'playerCount', 
    count: playerCount,
    players: Array.from(gameState.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      position: p.position
    }))
  });
  
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      try { client.send(message); } catch {}
    }
  }
}

function broadcastPlayerJoined(playerId, playerName) {
  const message = JSON.stringify({
    type: 'playerJoined',
    playerId: playerId,
    playerName: playerName,
    timestamp: Date.now()
  });
  
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      try { client.send(message); } catch {}
    }
  }
}

function broadcastPlayerLeft(playerId, playerName) {
  const message = JSON.stringify({
    type: 'playerLeft',
    playerId: playerId,
    playerName: playerName,
    timestamp: Date.now()
  });
  
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      try { client.send(message); } catch {}
    }
  }
}

// WebSocket connection handler

wss.on('connection', (ws, req) => {
  console.log('ws connection from', req.socket.remoteAddress);
  
  const playerId = gameState.nextPlayerId++;
  
  // Welcome message with current player count
  try { 
    ws.send(JSON.stringify({ 
      type: 'welcome', 
      time: Date.now(), 
      playerId,
      totalPlayers: gameState.players.size + 1 
    })); 
  } catch {}

  ws.on('message', (msg) => {
    const text = msg.toString();
    let data;
    try { data = JSON.parse(text); } catch { data = { type: 'text', text }; }
    
    if (data?.type === 'join' || data?.type === 'joinShared') {
      console.log('Player joined shared world:', data.name, `(ID: ${playerId})`);
      
      // Spawn player in shared world
      const playerData = {
        id: playerId,
        name: data.name,
        ws,
        lastSeen: Date.now(),
        position: { x: 0, y: 0 },
        cells: [{
          pos: {
            x: Math.random() * gameState.worldBounds.width + gameState.worldBounds.x,
            y: Math.random() * gameState.worldBounds.height + gameState.worldBounds.y
          },
          radius: 20,
          mass: 10,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          vel: { x: 0, y: 0 }
        }]
      };
      
      // Register player
      gameState.players.set(playerId, playerData);
      
      // Send initial world state to new player
      const worldData = {
        type: 'initialWorld',
        pellets: Array.from(gameState.pellets.values()),
        viruses: Array.from(gameState.viruses.values()),
        powerUps: Array.from(gameState.powerUps.values()),
        yourPlayerId: playerId,
        worldBounds: gameState.worldBounds
      };
      
      try { ws.send(JSON.stringify(worldData)); } catch {}
      
      // Send welcome message
      try { 
        ws.send(JSON.stringify({ 
          type: 'welcome', 
          totalPlayers: gameState.players.size,
          message: data?.type === 'joinShared' ? 'Willkommen in der gemeinsamen Welt!' : 'Verbunden!'
        })); 
      } catch {}
      
      // Broadcast join message to all clients
      broadcastPlayerJoined(playerId, data.name);
      
      // Broadcast updated player count
      broadcastPlayerCount();
      
    } else if (data?.type === 'position') {
      // Update player position
      const player = gameState.players.get(playerId);
      if (player) {
        player.position = data.position;
        player.cells = data.cells || [];
        player.lastSeen = Date.now();
      }
      
    } else if (data?.type === 'playerInput') {
      // Handle player input (movement)
      const player = gameState.players.get(playerId);
      if (player && data.input) {
        // Apply movement to player cells
        const targetX = data.input.targetX || 0;
        const targetY = data.input.targetY || 0;
        
        for (const cell of player.cells) {
          const dx = targetX - cell.pos.x;
          const dy = targetY - cell.pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 1) {
            const speed = Math.max(1, 100 / Math.sqrt(cell.mass)); // Larger cells move slower
            cell.vel = cell.vel || { x: 0, y: 0 };
            cell.vel.x = (dx / distance) * speed;
            cell.vel.y = (dy / distance) * speed;
          }
        }
        
        player.lastSeen = Date.now();
      }
      
    } else if (data?.type === 'playerPosition') {
      // Relay player position to other clients
      const player = gameState.players.get(playerId);
      if (player) {
        player.position = data.position;
        player.cells = data.cells || [];
        player.lastSeen = Date.now();
        
        // Broadcast position to other players
        const positionMessage = JSON.stringify({
          type: 'playerPosition',
          playerId: playerId,
          playerName: player.name,
          position: data.position,
          cells: data.cells,
          timestamp: data.timestamp
        });
        
        for (const client of wss.clients) {
          if (client.readyState === 1 && client !== ws) {
            try { client.send(positionMessage); } catch {}
          }
        }
      }
      
    } else if (data?.type === 'heartbeat') {
      // Keep player alive
      const player = gameState.players.get(playerId);
      if (player) {
        player.lastSeen = Date.now();
      }
    }
    
    // Relay other messages to all clients
    if (data?.type !== 'heartbeat' && data?.type !== 'position') {
      for (const client of wss.clients) {
        if (client.readyState === 1 && client !== ws) {
          try { client.send(JSON.stringify(data)); } catch {}
        }
      }
    }
  });

  ws.on('close', () => {
    console.log('Player disconnected:', playerId);
    const player = gameState.players.get(playerId);
    const playerName = player ? player.name : 'Unbekannter Spieler';
    
    gameState.players.delete(playerId);
    
    // Broadcast leave message
    broadcastPlayerLeft(playerId, playerName);
    
    // Broadcast updated player count
    broadcastPlayerCount();
  });

  ws.on('error', (err) => console.error('ws error', err));
});

server.listen(port, () => {
  console.log(`HTTP+WS server listening on http://0.0.0.0:${port}`);
});
