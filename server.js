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
  nextPlayerId: 1
};

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
    
    if (data?.type === 'join') {
      console.log('Player joined:', data.name, `(ID: ${playerId})`);
      
      // Register player
      gameState.players.set(playerId, {
        id: playerId,
        name: data.name,
        ws,
        lastSeen: Date.now(),
        position: { x: 0, y: 0 },
        cells: []
      });
      
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
