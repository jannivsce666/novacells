// skinsGallery.ts
import { makeSkinCanvas, FIXED_PRESET_COMBOS } from './skins';
import type { SkinKind } from './skins';
import { LevelDesign } from './LevelDesign';

export type SkinsGalleryOptions = {
  onPick: (skinCanvas: HTMLCanvasElement) => void;
  onClose?: () => void;
  current?: HTMLCanvasElement;
};

export class SkinsGallery {
  private root: HTMLDivElement;
  private bgCanvas: HTMLCanvasElement;
  private bgCtx: CanvasRenderingContext2D;
  private level: LevelDesign;
  private pellets: {x:number;y:number;r:number;vx:number;vy:number;alpha:number;tw:number}[] = [];
  private grid!: HTMLDivElement;

  constructor(private opts: SkinsGalleryOptions){
    // Overlay root
    this.root = document.createElement('div');
    Object.assign(this.root.style, {
      position:'fixed', inset:'0', zIndex:'120', display:'grid', gridTemplateRows:'auto 1fr',
      background:'transparent'
    } as CSSStyleDeclaration);

    // Background
    this.bgCanvas = document.createElement('canvas');
    Object.assign(this.bgCanvas.style, { position:'absolute', inset:'0', width:'100%', height:'100%' } as CSSStyleDeclaration);
    const ctx = this.bgCanvas.getContext('2d'); if (!ctx) throw new Error('no 2d');
    this.bgCtx = ctx;
    this.level = new LevelDesign(this.bgCanvas);
    this.resizeBg();
    this.initPellets();
    window.addEventListener('resize', ()=>{ this.resizeBg(); this.initPellets(); });

    // Header bar
    const header = document.createElement('div');
    Object.assign(header.style, {
      position:'relative', zIndex:'1', display:'flex', alignItems:'center', gap:'10px',
      padding:'12px 16px', margin:'14px auto 8px', width:'min(980px, 94vw)',
      borderRadius:'14px', background:'rgba(8,10,28,0.72)', backdropFilter:'blur(10px)',
      color:'#fff', boxShadow:'0 12px 28px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,0.06)'
    } as CSSStyleDeclaration);
    // removed LED overlay from header

    // Back button and title
    const back = document.createElement('button');
    back.textContent = '← Zurück';
    Object.assign(back.style, { padding:'10px 12px', border:'0', borderRadius:'10px', cursor:'pointer', fontWeight:'900', background:'rgba(255,255,255,0.14)', color:'#fff' } as CSSStyleDeclaration);
    back.onclick = ()=> this.close();
    const title = document.createElement('div');
    title.textContent = 'Skins';
    Object.assign(title.style, { fontSize:'20px', fontWeight:'900', letterSpacing:'1px' } as CSSStyleDeclaration);
    header.append(back, title);

    // Content card with grid
    const card = document.createElement('div');
    Object.assign(card.style, {
      position:'relative', zIndex:'1', margin:'0 auto 18px', padding:'16px', width:'min(980px, 94vw)',
      borderRadius:'16px', background:'rgba(8,10,28,0.72)', backdropFilter:'blur(10px)', color:'#fff',
      boxShadow:'0 24px 48px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,0.06)'
    } as CSSStyleDeclaration);
    // removed LED overlay from card

    // Create grid element before using it
    const grid = document.createElement('div');
    Object.assign(grid.style, {
      display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(92px, 1fr))', gap:'12px',
      alignItems:'center'
    } as CSSStyleDeclaration);
    this.grid = grid;
    card.appendChild(this.grid);

    this.root.append(this.bgCanvas, header, card);
    document.body.appendChild(this.root);

    this.populateGrid();
    this.loopBg();
  }

  private initPellets(){
    const W = this.bgCanvas.width, H = this.bgCanvas.height;
    const count = Math.floor(Math.min(1000, Math.max(280, (W*H)/7000)));
    this.pellets = [];
    for (let i=0;i<count;i++){
      const r = Math.random()*1.4 + 0.6;
      const ang = Math.random()*Math.PI*2; const spd = (Math.random()*10 + 4) * 0.4;
      this.pellets.push({ x: Math.random()*W, y: Math.random()*H, r, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, alpha: 0.6 + Math.random()*0.3, tw: (Math.random()*2 - 1) * 0.4 });
    }
  }

  private resizeBg(){
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    this.bgCanvas.width = w; this.bgCanvas.height = h;
    this.bgCanvas.style.width = '100%'; this.bgCanvas.style.height = '100%';
    this.bgCtx.setTransform(1,0,0,1,0,0);
  }

  private loopBg(){
    const ctx = this.bgCtx; let tPrev = performance.now();
    const step = (ts:number)=>{
      const dt = (ts - tPrev)/1000; tPrev = ts;
      ctx.setTransform(1,0,0,1,0,0);
      const W = this.bgCanvas.width, H = this.bgCanvas.height;
      this.level.drawBackgroundScreen(ctx);
      ctx.save();
      for (const p of this.pellets){
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -4) p.x = W+4; else if (p.x > W+4) p.x = -4;
        if (p.y < -4) p.y = H+4; else if (p.y > H+4) p.y = -4;
        const a = Math.max(0.2, Math.min(1.0, p.alpha + Math.sin(ts*0.001 + p.x*0.01 + p.y*0.01)*0.08));
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(2, p.r*1.0), 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${0.82*a})`;
        ctx.fill();
      }
      ctx.restore();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  private addThumb(label: string, canvas: HTMLCanvasElement, isShop=false){
    const btn = document.createElement('button');
    Object.assign(btn.style, { border:'0', padding:'0', background:'transparent', cursor:'pointer', position:'relative' } as CSSStyleDeclaration);

    const size = 92; const r = 40;
    const cv = document.createElement('canvas'); cv.width = size; cv.height = size; cv.style.display='block';
    const g = cv.getContext('2d')!; g.imageSmoothingEnabled = true; (g as any).imageSmoothingQuality = 'high';
    g.clearRect(0,0,size,size); g.save(); g.beginPath(); g.arc(size/2, size/2, r, 0, Math.PI*2); g.clip();
    g.drawImage(canvas, (size/2 - r), (size/2 - r), r*2, r*2); g.restore();
    // thin outline
    g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,0.28)'; g.beginPath(); g.arc(size/2, size/2, r, 0, Math.PI*2); g.stroke();

    if (isShop){
      const badge = document.createElement('span');
      badge.textContent = 'SHOP';
      Object.assign(badge.style, { position:'absolute', left:'6px', top:'6px', padding:'2px 6px', borderRadius:'8px', fontSize:'10px', fontWeight:'900', background:'rgba(52,211,153,0.95)', color:'#052', boxShadow:'0 2px 6px rgba(0,0,0,.25)' } as CSSStyleDeclaration);
      btn.appendChild(badge);
    }

    const cap = document.createElement('div');
    cap.textContent = label;
    Object.assign(cap.style, { marginTop:'6px', fontSize:'12px', color:'#dfe6ff', textAlign:'center', opacity:'0.9' } as CSSStyleDeclaration);

    btn.append(cv, cap);
    btn.onclick = ()=>{ this.opts.onPick(canvas); this.close(); };

    this.grid.appendChild(btn);
  }

  private populateGrid(){
    // Presets
    const presets: (SkinKind | SkinKind[])[] = FIXED_PRESET_COMBOS;
    presets.forEach((combo, i)=>{
      const c = makeSkinCanvas(combo as any);
      this.addThumb(typeof combo === 'string' ? combo : `Preset ${i+1}` , c, false);
    });

    // Divider label
    const divider = document.createElement('div');
    divider.textContent = 'Shop Skins';
    Object.assign(divider.style, { gridColumn:'1 / -1', color:'#aee', fontSize:'12px', opacity:'0.9', margin:'8px 0 0' } as CSSStyleDeclaration);
    this.grid.appendChild(divider);

    // Shop skins via Vite glob
    let entries: string[] = [];
    try {
      const globbed = (import.meta as any).glob('../shop/skins/*.{png,jpg,jpeg,webp,svg}', { eager:true, as:'url' }) as Record<string,string>;
      entries = Object.values(globbed);
    } catch {
      entries = [
        new URL('../shop/skins/1.png', import.meta.url).toString(),
        new URL('../shop/skins/2.png', import.meta.url).toString(),
        new URL('../shop/skins/3.png', import.meta.url).toString(),
        new URL('../shop/skins/4.png', import.meta.url).toString(),
        new URL('../shop/skins/5.png', import.meta.url).toString(),
      ];
    }

    for (const url of entries){
      const img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = ()=>{
        const c = document.createElement('canvas'); c.width = 220; c.height = 220;
        const g = c.getContext('2d')!; g.imageSmoothingEnabled = true; (g as any).imageSmoothingQuality = 'high';
        g.clearRect(0,0,220,220);
        const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        const s = Math.max(220/iw, 220/ih);
        const dw = Math.round(iw*s), dh = Math.round(ih*s);
        const dx = Math.round((220 - dw)/2), dy = Math.round((220 - dh)/2);
        g.drawImage(img, dx, dy, dw, dh);
        const basename = (url.split('/').pop() || '').split('.')[0];
        this.addThumb(basename, c, true);
      };
      img.src = url;
    }
  }

  show(){ this.root.style.display = 'grid'; }
  close(){ this.root.remove(); this.opts.onClose?.(); }
}
