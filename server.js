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

wss.on('connection', (ws, req) => {
  console.log('ws connection from', req.socket.remoteAddress);
  // greet client
  try { ws.send(JSON.stringify({ type: 'welcome', time: Date.now(), clients: wss.clients.size })); } catch {}

  ws.on('message', (msg) => {
    const text = msg.toString();
    let data;
    try { data = JSON.parse(text); } catch { data = { type: 'text', text }; }
    if (data?.type === 'join') {
      console.log('join:', data.name);
    } else {
      console.log('msg', text);
    }
    // broadcast to everyone
    for (const client of wss.clients) {
      if (client.readyState === 1) {
        try { client.send(JSON.stringify(data)); } catch {}
      }
    }
  });

  ws.on('error', (err) => console.error('ws error', err));
});

server.listen(port, () => {
  console.log(`HTTP+WS server listening on http://0.0.0.0:${port}`);
});
