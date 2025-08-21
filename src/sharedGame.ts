// Shared/Server-authoritative multiplayer game client
import { clamp, rand, randInt, norm, radiusFromMass, speedFromMass, sum } from './utils';
import type { PlayerState, Pellet, Virus, PowerUp, PowerUpType, Bullet, Cell, PlayerConfig } from './types';
import type { InputState } from './input';

export interface SharedPlayer {
  id: number;
  name: string;
  cells: Array<{
    pos: { x: number; y: number };
    radius: number;
    mass: number;
    color: string;
    vel?: { x: number; y: number };
  }>;
}

export interface SharedPellet {
  id: number;
  x: number;
  y: number;
  color: string;
  radius: number;
  mass: number;
}

export interface SharedVirus {
  id: number;
  x: number;
  y: number;
  radius: number;
  mass: number;
}

export class SharedGameClient {
  private canvas: HTMLCanvasElement;
  private ws?: WebSocket;
  private playerId?: number;
  
  // Shared world state (received from server)
  private players: Map<number, SharedPlayer> = new Map();
  private pellets: Map<number, SharedPellet> = new Map();
  private viruses: Map<number, SharedVirus> = new Map();
  private powerUps: Map<number, any> = new Map();
  private worldBounds = { x: -3000, y: -3000, width: 6000, height: 6000 };
  
  // Camera and rendering
  private camera = { x: 0, y: 0, zoom: 1 };
  private currentZoom = 1;
  private zoomBias = 0;
  
  // Input handling
  private mouseX = 0;
  private mouseY = 0;
  
  // Performance tracking
  private isMobile = false;
  private lastFrameTime = 0;
  private frameDelta = 0;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.isMobile = this.detectMobile();
    this.setupEventListeners();
  }

  private detectMobile(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0);
  }

  private setupEventListeners() {
    // Mouse movement for targeting
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    // Touch events for mobile
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.mouseX = touch.clientX - rect.left;
      this.mouseY = touch.clientY - rect.top;
    });

    // Mouse wheel for zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoomBias += e.deltaY > 0 ? -0.1 : 0.1;
      this.zoomBias = clamp(this.zoomBias, -1, 1);
    });
  }

  setWebSocket(ws: WebSocket) {
    this.ws = ws;
    
    ws.addEventListener('message', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        this.handleServerMessage(data);
      } catch (e) {
        console.error('Failed to parse server message:', e);
      }
    });

    // Send input updates regularly
    setInterval(() => {
      this.sendInput();
    }, 1000 / 30); // 30 FPS input updates
  }

  private handleServerMessage(data: any) {
    switch (data.type) {
      case 'initialWorld':
        this.playerId = data.yourPlayerId;
        this.worldBounds = data.worldBounds;
        this.updatePellets(data.pellets);
        this.updateViruses(data.viruses);
        this.updatePowerUps(data.powerUps);
        console.log(`🌍 Connected to shared world as Player ${this.playerId}`);
        break;

      case 'worldState':
        this.updatePlayers(data.players);
        this.updatePellets(data.pellets);
        this.updateViruses(data.viruses);
        this.updatePowerUps(data.powerUps);
        break;

      case 'pelletEaten':
        this.pellets.delete(data.pelletId);
        break;

      case 'playerEaten':
        console.log(`Player ${data.eatenPlayerId} was eaten by Player ${data.eaterPlayerId}`);
        break;

      case 'playerJoined':
        console.log(`🎮 Player ${data.playerName} joined the game`);
        break;

      case 'playerLeft':
        console.log(`👋 Player ${data.playerName} left the game`);
        this.players.delete(data.playerId);
        break;
    }
  }

  private updatePlayers(playerData: SharedPlayer[]) {
    this.players.clear();
    for (const player of playerData) {
      this.players.set(player.id, player);
    }
  }

  private updatePellets(pelletData: SharedPellet[]) {
    this.pellets.clear();
    for (const pellet of pelletData) {
      this.pellets.set(pellet.id, pellet);
    }
  }

  private updateViruses(virusData: SharedVirus[]) {
    this.viruses.clear();
    for (const virus of virusData) {
      this.viruses.set(virus.id, virus);
    }
  }

  private updatePowerUps(powerUpData: any[]) {
    this.powerUps.clear();
    for (const powerUp of powerUpData) {
      this.powerUps.set(powerUp.id, powerUp);
    }
  }

  private sendInput() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.playerId) return;

    const myPlayer = this.players.get(this.playerId);
    if (!myPlayer || myPlayer.cells.length === 0) return;

    // Convert screen coordinates to world coordinates
    const worldTarget = this.screenToWorld(this.mouseX, this.mouseY);

    this.ws.send(JSON.stringify({
      type: 'playerInput',
      input: {
        targetX: worldTarget.x,
        targetY: worldTarget.y
      },
      timestamp: Date.now()
    }));
  }

  private screenToWorld(screenX: number, screenY: number) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    const worldX = this.camera.x + (screenX - centerX) / this.camera.zoom;
    const worldY = this.camera.y + (screenY - centerY) / this.camera.zoom;
    
    return { x: worldX, y: worldY };
  }

  private updateCamera() {
    const myPlayer = this.players.get(this.playerId!);
    if (!myPlayer || myPlayer.cells.length === 0) return;

    // Calculate camera center from player cells
    let cx = 0, cy = 0, totalMass = 0;
    for (const cell of myPlayer.cells) {
      cx += cell.pos.x * cell.mass;
      cy += cell.pos.y * cell.mass;
      totalMass += cell.mass;
    }

    this.camera.x = cx / Math.max(1, totalMass);
    this.camera.y = cy / Math.max(1, totalMass);

    // Calculate zoom based on mass
    const canvas = this.canvas;
    const screenAspect = canvas.width / canvas.height;
    
    let baseScale;
    if (this.isMobile) {
      if (screenAspect > 1.5) {
        baseScale = Math.min(canvas.width/2400, canvas.height/1200) * 1.5;
      } else if (screenAspect < 0.7) {
        baseScale = Math.min(canvas.width/1080, canvas.height/2400) * 1.4;
      } else {
        baseScale = Math.min(canvas.width/1920, canvas.height/1920) * 1.3;
      }
      baseScale = Math.max(0.8, baseScale);
    } else {
      baseScale = Math.min(canvas.width/1920, canvas.height/1080);
    }
    
    const pieces = Math.max(1, myPlayer.cells.length);
    const massFactor = Math.pow(totalMass / 100, 0.12);
    let targetZoomRaw = 1.9 / (massFactor * (1 + (pieces - 1) * 0.05));
    targetZoomRaw += this.zoomBias;
    
    const minZoom = this.isMobile ? 0.8 : 1.2;
    const maxZoom = this.isMobile ? 2.0 : 2.6;
    const targetZoom = clamp(targetZoomRaw, minZoom, maxZoom);
    
    this.currentZoom = this.currentZoom + (targetZoom - this.currentZoom) * 0.08;
    this.camera.zoom = baseScale * this.currentZoom;
  }

  render(elapsed: number) {
    const ctx = this.canvas.getContext('2d')!;
    const canvas = this.canvas;

    // Frame timing
    const now = performance.now();
    this.frameDelta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Update camera
    this.updateCamera();

    // Clear canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#001122';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set up world transform
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // Render pellets
    for (const pellet of this.pellets.values()) {
      ctx.fillStyle = pellet.color;
      ctx.beginPath();
      ctx.arc(pellet.x, pellet.y, pellet.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render viruses
    for (const virus of this.viruses.values()) {
      ctx.fillStyle = '#00FF00';
      ctx.strokeStyle = '#008800';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(virus.x, virus.y, virus.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Render all players
    for (const player of this.players.values()) {
      const isMe = player.id === this.playerId;
      
      for (const cell of player.cells) {
        // Draw cell
        ctx.fillStyle = cell.color;
        ctx.strokeStyle = isMe ? '#FFFFFF' : 'rgba(255,255,255,0.3)';
        ctx.lineWidth = isMe ? 4 : 2;
        
        ctx.beginPath();
        ctx.arc(cell.pos.x, cell.pos.y, cell.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw player name
        if (cell.radius > 15) {
          ctx.fillStyle = isMe ? '#FFFFFF' : '#CCCCCC';
          ctx.font = `${Math.min(20, cell.radius * 0.4)}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(player.name, cell.pos.x, cell.pos.y);
        }
      }
    }

    ctx.restore(); // End world transform

    // UI Elements
    this.renderUI(ctx);

    ctx.restore();
  }

  private renderUI(ctx: CanvasRenderingContext2D) {
    const myPlayer = this.players.get(this.playerId!);
    if (!myPlayer) return;

    // Score display
    const totalMass = myPlayer.cells.reduce((sum, cell) => sum + cell.mass, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Masse: ${Math.floor(totalMass)}`, 20, 40);

    // Player count
    ctx.fillText(`Spieler: ${this.players.size}`, 20, 70);

    // Connection status
    const status = this.ws?.readyState === WebSocket.OPEN ? '🟢 Verbunden' : '🔴 Getrennt';
    ctx.fillText(status, 20, 100);
  }

  // Start the game loop
  startLoop() {
    const loop = (timestamp: number) => {
      this.frameDelta = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;
      
      this.updateCamera();
      this.render(this.frameDelta);
      
      requestAnimationFrame(loop);
    };
    
    requestAnimationFrame(loop);
  }

  // Public API for integration
  getPlayerId() {
    return this.playerId;
  }

  getPlayerCount() {
    return this.players.size;
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
