// LevelDesign.ts
import type { WorldRect } from './types';

export class LevelDesign {
  canvas: HTMLCanvasElement;
  galaxy: HTMLCanvasElement;
  // Pre-scaled tile matching current canvas size to avoid per-frame scaling
  private tile: HTMLCanvasElement | null = null;
  t0 = performance.now();

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
    // could draw faint grid if desired
  }

  drawRainbowBorder(ctx:CanvasRenderingContext2D, pad:number, world:WorldRect){
    // Draw a circular LED-style border centered in the world
    const cx = world.w / 2;
    const cy = world.h / 2;
    const r = Math.max(20, Math.min(world.w, world.h) * 0.5 - pad);

    ctx.save();
    ctx.lineWidth = 14;
    ctx.shadowBlur = 24;
    ctx.shadowColor = 'rgba(255,255,255,0.25)';

    const t = performance.now() * 0.002;

    // Prefer conic gradient for a rainbow ring; fall back to linear gradient
    let stroke: CanvasGradient | string;
    const steps = 64;
    if ((ctx as any).createConicGradient) {
      const grd = (ctx as any).createConicGradient(t * 0.6, cx, cy) as CanvasGradient;
      for(let i=0;i<=steps;i++){
        const p = i/steps;
        const hue = (p*360 + (t*120))%360;
        grd.addColorStop(p, `hsla(${hue},100%,60%,0.90)`);
      }
      stroke = grd;
    } else {
      const grd = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
      for(let i=0;i<=steps;i++){
        const p = i/steps;
        const hue = (p*360 + (t*120))%360;
        grd.addColorStop(p, `hsla(${hue},100%,60%,0.90)`);
      }
      stroke = grd;
    }

    ctx.beginPath();
    ctx.strokeStyle = stroke as any;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
