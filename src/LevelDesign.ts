// LevelDesign.ts
import type { WorldRect } from './types';

export class LevelDesign {
  canvas: HTMLCanvasElement;
  galaxy: HTMLCanvasElement;
  // Pre-scaled tile matching current canvas size to avoid per-frame scaling
  private tile: HTMLCanvasElement | null = null;
  t0 = performance.now();

  // Cached world border + grid layer (transparent, world-space size)
  private borderLayer: HTMLCanvasElement | null = null;
  private borderKey: string = '';
  private gridStep = 400; // world units between grid lines

  constructor(canvas: HTMLCanvasElement){
    this.canvas = canvas;
    this.galaxy = this.makeGalaxy();
    this.onResize();
  }

  onResize(){
    const w = this.canvas.width, h = this.canvas.height;
    if (w <= 0 || h <= 0) return;
    const tile = document.createElement('canvas');
    tile.width = w; tile.height = h;
    const g = tile.getContext('2d')!;
    // draw galaxy scaled to canvas once; avoid scaling each frame
    g.drawImage(this.galaxy, 0, 0, this.galaxy.width, this.galaxy.height, 0, 0, w, h);
    this.tile = tile;
  }

  private makeGalaxy(){
    const c = document.createElement('canvas');
    c.width = 1920; c.height = 1080;
    const g = c.getContext('2d')!;
    g.fillStyle = '#030816';
    g.fillRect(0,0,c.width,c.height);
    // soft nebulas
    for (let i=0;i<12;i++){
      const x = Math.random()*c.width, y=Math.random()*c.height, r = Math.random()*280+120;
      const grd = g.createRadialGradient(x,y,0, x,y,r);
      const hue = (i*30 + (Math.random()*60))%360;
      grd.addColorStop(0, `hsla(${hue},70%,55%,0.20)`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill();
    }
    // stars
    g.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i=0;i<1200;i++){
      const x=Math.random()*c.width, y=Math.random()*c.height, s=Math.random()*1.4+0.3;
      g.fillRect(x,y,s,s);
    }
    return c;
  }

  drawBackgroundScreen(ctx:CanvasRenderingContext2D){
    const w = ctx.canvas.width, h = ctx.canvas.height;
    // Static background: no time-based offset to avoid any perceived drift
    const ox = 0;
    const oy = 0;

    if (!this.tile || this.tile.width !== w || this.tile.height !== h) this.onResize();

    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle = '#030816';
    ctx.fillRect(0,0,w,h);

    const tile = this.tile || this.galaxy;

    const pat = ctx.createPattern(tile, 'repeat');
    if (pat && (pat as any).setTransform) {
      const m = new DOMMatrix();
      const sx = ((ox % w) + w) % w;
      const sy = ((oy % h) + h) % h;
      m.e = -sx; m.f = -sy;
      (pat as any).setTransform(m);
      ctx.fillStyle = pat as any;
      ctx.fillRect(0,0,w,h);
    } else {
      const sx = Math.floor(((ox % w) + w) % w);
      const sy = Math.floor(((oy % h) + h) % h);
      const positions = [
        { x: -sx,     y: -sy     },
        { x: -sx + w, y: -sy     },
        { x: -sx,     y: -sy + h },
        { x: -sx + w, y: -sy + h }
      ];
      for (const p of positions){
        ctx.drawImage(tile, 0, 0, tile.width, tile.height, p.x, p.y, w, h);
      }
    }

    ctx.restore();
  }

  drawWorldDecor(ctx:CanvasRenderingContext2D){
    // kept lightweight; grid is baked into the cached border layer
  }

  private ensureBorderLayer(pad:number, world:WorldRect){
    const key = `${world.w}x${world.h}|p${Math.round(pad)}`;
    if (this.borderLayer && this.borderKey === key) return;

    const c = document.createElement('canvas');
    c.width = world.w; c.height = world.h;
    const g = c.getContext('2d')!;
    g.clearRect(0,0,c.width,c.height);

    // Static faint grid (baked once)
    g.save();
    g.strokeStyle = 'rgba(255,255,255,0.05)';
    g.lineWidth = 1;
    for (let x=this.gridStep; x<world.w; x+=this.gridStep){
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, world.h); g.stroke();
    }
    for (let y=this.gridStep; y<world.h; y+=this.gridStep){
      g.beginPath(); g.moveTo(0, y); g.lineTo(world.w, y); g.stroke();
    }
    g.restore();

    // Rainbow border ring (static cached)
    const cx = world.w/2, cy = world.h/2;
    const r = Math.max(20, Math.min(world.w, world.h) * 0.5 - pad);

    g.save();
    g.lineWidth = 14;
    g.shadowBlur = 24;
    g.shadowColor = 'rgba(255,255,255,0.25)';

    let stroke: CanvasGradient | string;
    const steps = 64;
    if ((g as any).createConicGradient) {
      const grd = (g as any).createConicGradient(0, cx, cy) as CanvasGradient;
      for(let i=0;i<=steps;i++){
        const p = i/steps;
        const hue = (p*360) % 360;
        grd.addColorStop(p, `hsla(${hue},100%,60%,0.90)`);
      }
      stroke = grd;
    } else {
      const grd = g.createLinearGradient(cx - r, cy, cx + r, cy);
      for(let i=0;i<=steps;i++){
        const p = i/steps;
        const hue = (p*360) % 360;
        grd.addColorStop(p, `hsla(${hue},100%,60%,0.90)`);
      }
      stroke = grd;
    }

    g.beginPath();
    g.strokeStyle = stroke as any;
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.stroke();
    g.restore();

    this.borderLayer = c;
    this.borderKey = key;
  }

  drawRainbowBorder(ctx:CanvasRenderingContext2D, pad:number, world:WorldRect){
    // Ensure the cached layer is up-to-date, then blit.
    this.ensureBorderLayer(pad, world);
    if (this.borderLayer){
      ctx.drawImage(this.borderLayer, 0, 0);
    }
  }
}
