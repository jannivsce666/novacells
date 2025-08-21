// Shared/Server-authoritative multiplayer game client
import { clamp, rand, randInt, norm, radiusFromMass, speedFromMass, sum } from './utils';
import type { PlayerState, Pellet, Virus, PowerUp, PowerUpType, Bullet, Cell, PlayerConfig } from './types';
import type { InputState } from './input';
import { LevelDesign } from './LevelDesign';

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
  kind?: 'green' | 'red';
  ang?: number;
  spin?: number;
  ttl?: number;
}

// New: bullets from server
interface SharedBullet {
  id: number;
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  mass: number;
  owner: 'hazard' | 'player';
  ttl: number;
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
  private bullets: Map<number, SharedBullet> = new Map();
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
  private level: LevelDesign; // classic background & border

  private ejectInterval?: number;

  // Blackhole
  private blackhole: { x: number; y: number; radius: number; pullRadius: number; active: boolean; imploding?: boolean } | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.isMobile = this.detectMobile();
    this.setupEventListeners();
    this.level = new LevelDesign(this.canvas);
    window.addEventListener('resize', () => this.level.onResize());

    // Also bind keyboard/mouse for split/eject
    window.addEventListener('keydown', (e)=>{
      if (e.code === 'Space') { this.sendAction('split'); }
      if (e.code === 'KeyW') { this.startEjecting(); }
    });
    window.addEventListener('keyup', (e)=>{
      if (e.code === 'KeyW') { this.stopEjecting(); }
    });
    // Right mouse = eject hold
    this.canvas.addEventListener('contextmenu', (e)=> e.preventDefault());
    this.canvas.addEventListener('mousedown', (e)=>{ if (e.button===2) this.startEjecting(); });
    this.canvas.addEventListener('mouseup',   (e)=>{ if (e.button===2) this.stopEjecting(); });

    // Hook mobile action buttons if present
    setTimeout(()=>{
      const btnSplit = document.getElementById('btn-split');
      const btnEject = document.getElementById('btn-eject');
      btnSplit?.addEventListener('click', ()=> this.sendAction('split'));
      btnSplit?.addEventListener('touchstart', (ev)=>{ ev.preventDefault(); this.sendAction('split'); }, { passive:false } as any);
      btnEject?.addEventListener('mousedown', ()=> this.startEjecting());
      btnEject?.addEventListener('mouseup',   ()=> this.stopEjecting());
      btnEject?.addEventListener('mouseleave',()=> this.stopEjecting());
      btnEject?.addEventListener('touchstart', (ev)=>{ ev.preventDefault(); this.startEjecting(); }, { passive:false } as any);
      btnEject?.addEventListener('touchend', ()=> this.stopEjecting());
    }, 0);
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

  private startEjecting(){
    if (this.ejectInterval || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const shoot = ()=> this.sendAction('eject');
    shoot();
    this.ejectInterval = window.setInterval(shoot, 140); // ~7/s
  }
  private stopEjecting(){ if (this.ejectInterval){ clearInterval(this.ejectInterval); this.ejectInterval = undefined; } }

  private sendAction(kind: 'split'|'eject'){
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ type:'playerAction', action: kind, timestamp: Date.now() }));
  }

  private handleServerMessage(data: any) {
    switch (data.type) {
      case 'initialWorld':
        this.playerId = data.yourPlayerId;
        this.worldBounds = data.worldBounds;
        this.updatePellets(data.pellets);
        this.updateViruses(data.viruses);
        this.updatePowerUps(data.powerUps || []);
        this.updateBullets(data.bullets || []);
        this.blackhole = data.blackhole || null;
        console.log(`🌍 Connected to shared world as Player ${this.playerId}`);
        break;

      case 'worldState':
        this.updatePlayers(data.players || []);
        this.updatePellets(data.pellets || []);
        this.updateViruses(data.viruses || []);
        this.updatePowerUps(data.powerUps || []);
        this.updateBullets(data.bullets || []);
        this.blackhole = data.blackhole || null;
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
      this.viruses.set(virus.id as any, virus as any);
    }
  }

  private updatePowerUps(powerUpData: any[]) {
    this.powerUps.clear();
    for (const powerUp of powerUpData) {
      this.powerUps.set(powerUp.id, powerUp);
    }
  }

  private updateBullets(bulletData: SharedBullet[]) {
    this.bullets.clear();
    for (const b of bulletData) this.bullets.set(b.id, b);
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

    // Clear canvas and draw classic galaxy background
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.level.drawBackgroundScreen(ctx);

    // Set up world transform
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // Draw classic rainbow border for world
    ctx.save();
    ctx.translate(this.worldBounds.x, this.worldBounds.y);
    this.level.drawRainbowBorder(ctx, 80, { w: this.worldBounds.width, h: this.worldBounds.height });
    ctx.restore();

    // Blackhole
    if (this.blackhole && this.blackhole.active) {
      const bh = this.blackhole;
      const g = ctx.createRadialGradient(bh.x, bh.y, Math.max(8, bh.radius * 0.2), bh.x, bh.y, bh.radius);
      g.addColorStop(0, 'rgba(0,0,0,0.95)');
      g.addColorStop(0.7, 'rgba(10,10,30,0.6)');
      g.addColorStop(1, 'rgba(10,10,30,0.0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bh.x, bh.y, bh.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render pellets
    for (const pellet of this.pellets.values()) {
      ctx.fillStyle = pellet.color;
      ctx.beginPath();
      ctx.arc(pellet.x, pellet.y, pellet.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render powerups
    for (const pu of this.powerUps.values()) {
      let fill = '#fff'; let label = '';
      switch (pu.type) {
        case 'star': fill = '#fcd34d'; label = '★'; break;
        case 'multishot': fill = '#60a5fa'; label = '×'; break;
        case 'grow': fill = '#34d399'; label = '+'; break;
        case 'magnet': fill = '#a78bfa'; label = 'U'; break;
        case 'lightning': fill = '#f472b6'; label = '⚡'; break;
      }
      ctx.fillStyle = fill; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(pu.x, pu.y, 16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0b1028'; ctx.font = 'bold 16px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(label, pu.x, pu.y+1);
    }

    // Render viruses (green/red)
    for (const virus of this.viruses.values()) {
      const isRed = (virus as any).kind === 'red';
      if (isRed) {
        ctx.fillStyle = '#ff375f';
        ctx.strokeStyle = '#ff99ad';
      } else {
        ctx.fillStyle = '#00FFAA';
        ctx.strokeStyle = '#00C08A';
      }
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc((virus as any).x, (virus as any).y, (virus as any).radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Render bullets
    for (const b of this.bullets.values()) {
      ctx.fillStyle = b.owner === 'hazard' ? '#ffd166' : '#a3e635';
      ctx.beginPath(); ctx.arc(b.pos.x, b.pos.y, Math.max(3, Math.sqrt(b.mass)*0.6), 0, Math.PI*2); ctx.fill();
    }

    // Render all players
    for (const player of this.players.values()) {
      const isMe = player.id === this.playerId;
      for (const cell of player.cells) {
        ctx.fillStyle = cell.color;
        ctx.strokeStyle = isMe ? '#FFFFFF' : 'rgba(255,255,255,0.3)';
        ctx.lineWidth = isMe ? 4 : 2;
        ctx.beginPath();
        ctx.arc(cell.pos.x, cell.pos.y, cell.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (cell.radius > 15) {
          ctx.fillStyle = isMe ? '#FFFFFF' : '#CCCCCC';
          ctx.font = `${Math.min(20, cell.radius * 0.4)}px system-ui, Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(player.name, cell.pos.x, cell.pos.y);
        }
      }
    }

    ctx.restore(); // End world transform

    // UI Elements similar to classic
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
