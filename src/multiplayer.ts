import type { Game } from './game';

export interface MultiplayerPlayer {
  id: number;
  name: string;
  position: { x: number; y: number };
  cells: Array<{
    pos: { x: number; y: number };
    radius: number;
    color: string;
    mass: number;
  }>;
  lastSeen: number;
}

export class MultiplayerManager {
  private game: Game;
  private ws?: WebSocket;
  private remotePlayers: Map<number, MultiplayerPlayer> = new Map();
  private lastPositionUpdate = 0;
  private positionUpdateInterval = 100; // Send position every 100ms

  constructor(game: Game) {
    this.game = game;
  }

  setWebSocket(ws: WebSocket) {
    this.ws = ws;
    
    ws.addEventListener('message', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        this.handleMessage(data);
      } catch (e) {
        console.error('Failed to parse WS message:', e);
      }
    });

    // Send position updates regularly
    setInterval(() => {
      this.sendPositionUpdate();
    }, this.positionUpdateInterval);
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'playerPosition':
        this.updateRemotePlayer(data);
        break;
      case 'playerJoined':
        this.onPlayerJoined(data);
        break;
      case 'playerLeft':
        this.onPlayerLeft(data);
        break;
      case 'gameSync':
        this.syncGameState(data);
        break;
    }
  }

  private updateRemotePlayer(data: any) {
    const player: MultiplayerPlayer = {
      id: data.playerId,
      name: data.playerName || `Player ${data.playerId}`,
      position: data.position || { x: 0, y: 0 },
      cells: data.cells || [],
      lastSeen: Date.now()
    };

    this.remotePlayers.set(data.playerId, player);
  }

  private onPlayerJoined(data: any) {
    console.log(`🎮 ${data.playerName} joined the game`);
    // Initialize remote player
    if (data.playerId && data.playerId !== this.game.playerId) {
      this.remotePlayers.set(data.playerId, {
        id: data.playerId,
        name: data.playerName || `Player ${data.playerId}`,
        position: { x: 0, y: 0 },
        cells: [],
        lastSeen: Date.now()
      });
    }
  }

  private onPlayerLeft(data: any) {
    console.log(`👋 ${data.playerName} left the game`);
    if (data.playerId) {
      this.remotePlayers.delete(data.playerId);
    }
  }

  private syncGameState(data: any) {
    // Sync shared game elements like pellets, viruses, etc.
    // This would be used for true shared world state
  }

  private sendPositionUpdate() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const now = Date.now();
    if (now - this.lastPositionUpdate < this.positionUpdateInterval) return;

    const me = this.game.getLocalPlayer();
    if (!me || me.cells.length === 0) return;

    const position = this.game.getCameraCenter();
    const cells = me.cells.map((cell: any) => ({
      pos: { x: cell.pos.x, y: cell.pos.y },
      radius: cell.radius,
      color: cell.color,
      mass: cell.mass
    }));

    this.ws.send(JSON.stringify({
      type: 'playerPosition',
      playerId: this.game.playerId,
      position,
      cells,
      timestamp: now
    }));

    this.lastPositionUpdate = now;
  }

  // Render remote players
  renderRemotePlayers(ctx: CanvasRenderingContext2D, camera: any) {
    const now = Date.now();
    
    for (const [id, player] of this.remotePlayers) {
      // Remove stale players
      if (now - player.lastSeen > 15000) {
        this.remotePlayers.delete(id);
        continue;
      }

      // Render player cells
      for (const cell of player.cells) {
        const screenX = (cell.pos.x - camera.x) * camera.zoom + camera.canvas.width / 2;
        const screenY = (cell.pos.y - camera.y) * camera.zoom + camera.canvas.height / 2;
        const screenRadius = cell.radius * camera.zoom;

        // Only render if on screen
        if (screenX + screenRadius > 0 && screenX - screenRadius < camera.canvas.width &&
            screenY + screenRadius > 0 && screenY - screenRadius < camera.canvas.height) {
          
          ctx.save();
          
          // Draw cell
          ctx.fillStyle = cell.color;
          ctx.beginPath();
          ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw border
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw player name
          if (screenRadius > 20) {
            ctx.fillStyle = 'white';
            ctx.font = `${Math.min(16, screenRadius * 0.4)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(player.name, screenX, screenY);
          }
          
          ctx.restore();
        }
      }
    }
  }

  getRemotePlayers(): MultiplayerPlayer[] {
    return Array.from(this.remotePlayers.values());
  }

  cleanup() {
    this.remotePlayers.clear();
  }
}