// startMenu.ts
import type { PlayerConfig } from './types';
import { makeSkinCanvas } from './skins';
import type { SkinKind } from './skins';
import { FIXED_PRESET_COMBOS } from './skins';
import { MusicManager } from './musicManager';
import { LevelDesign } from './LevelDesign';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged } from './firebase';

export type StartMenuOptions = {
  onStart: (cfg: PlayerConfig)=>void;
  musicManager?: MusicManager;
};

export class StartMenu {
  private root: HTMLDivElement;
  private bgCanvas: HTMLCanvasElement;
  private bgCtx: CanvasRenderingContext2D;
  private level: LevelDesign;
  private menuPellets: {x:number;y:number;r:number;vx:number;vy:number;alpha:number;tw:number}[] = [];
  // Track rAF for background loop so we can stop it when hidden
  private bgRAF?: number;
  private bgActive: boolean = false;
  private nameInput: HTMLInputElement;
  private preview!: HTMLCanvasElement; // hidden offscreen preview for skin rendering
  private currentSkinCanvas!: HTMLCanvasElement;
  // New refs for responsive layout
  private card!: HTMLDivElement;
  private gridEl!: HTMLDivElement;
  private paletteEl!: HTMLDivElement;
  private titleEl!: HTMLHeadingElement;
  private startBtn!: HTMLButtonElement;
  private musicBtn?: HTMLButtonElement;
  private fsBtn?: HTMLButtonElement;
  private presetThumbs: HTMLCanvasElement[] = [];
  private coinEl?: HTMLDivElement;

  constructor(private opts: StartMenuOptions){
    // Overlay root
    this.root = document.createElement('div');
    this.root.id = 'start-menu';
    Object.assign(this.root.style, {
      position:'fixed', inset:'0', zIndex:'100', display:'grid', placeItems:'center',
      background:'transparent'
    } as CSSStyleDeclaration);

    // Set default skin canvas so preview/start have a value even before opening gallery
    this.currentSkinCanvas = makeSkinCanvas(FIXED_PRESET_COMBOS[0] as any);

    // Animated BG canvas (reuse ingame galaxy)
    this.bgCanvas = document.createElement('canvas');
    Object.assign(this.bgCanvas.style, { position:'absolute', inset:'0', width:'100%', height:'100%' } as CSSStyleDeclaration);
    const ctx = this.bgCanvas.getContext('2d');
    if (!ctx) throw new Error('no 2d ctx');
    this.bgCtx = ctx;
    this.level = new LevelDesign(this.bgCanvas);
    this.resizeBg();
    this.initMenuPellets();
    window.addEventListener('resize', ()=>{ this.resizeBg(); this.initMenuPellets(); });

    // Card
    const card = document.createElement('div');
    Object.assign(card.style, {
      position:'relative', width:'min(1100px, 94vw)',
      background:'rgba(8,10,28,0.72)', backdropFilter:'blur(10px)',
      borderRadius:'18px', padding:'20px', color:'#fff',
      boxShadow:'0 30px 60px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,0.06)'
    } as CSSStyleDeclaration);
    this.card = card;

    // Music toggle button (top-right) -> speaker icons only
    const musicBtn = document.createElement('button');
    const musicPlaying = this.opts.musicManager?.isCurrentlyPlaying();
    musicBtn.textContent = musicPlaying ? '🔊' : '🔈';
    Object.assign(musicBtn.style, {
      position:'absolute', top:'14px', right:'66px', width:'40px', height:'40px', borderRadius:'50%',
      border:'0', background:'rgba(255,255,255,0.10)', color:'#fff', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px'
    } as CSSStyleDeclaration);
    musicBtn.onclick = ()=>{
      this.opts.musicManager?.toggle();
      musicBtn.textContent = this.opts.musicManager?.isCurrentlyPlaying() ? '🔊' : '🔈';
    };
    this.musicBtn = musicBtn;

    // Fullscreen button (top-right, next to music)
    const fsBtn = document.createElement('button');
    fsBtn.textContent = '⛶';
    Object.assign(fsBtn.style, {
      position:'absolute', top:'12px', right:'14px', width:'40px', height:'40px', borderRadius:'50%',
      border:'0', background:'rgba(255,255,255,0.10)', color:'#fff', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px'
    } as CSSStyleDeclaration);
    const docAny: any = document; const rootAny: any = document.documentElement;
    const isFull = () => !!(document.fullscreenElement || docAny.webkitFullscreenElement || docAny.msFullscreenElement);
    const enterFull = async ()=>{ try{ if(rootAny.requestFullscreen) await rootAny.requestFullscreen(); else if (rootAny.webkitRequestFullscreen) rootAny.webkitRequestFullscreen(); else if (rootAny.msRequestFullscreen) rootAny.msRequestFullscreen(); }catch{} };
    const exitFull  = async ()=>{ try{ if(document.exitFullscreen) await document.exitFullscreen(); else if (docAny.webkitExitFullscreen) docAny.webkitExitFullscreen(); else if (docAny.msExitFullscreen) docAny.msExitFullscreen(); }catch{} };
    const updateFs = ()=>{ fsBtn.style.boxShadow = isFull() ? '0 0 0 2px rgba(0,255,200,0.35) inset' : 'none'; fsBtn.style.opacity = isFull() ? '1.0':'0.85'; };
    fsBtn.onclick = async ()=>{ if(isFull()) await exitFull(); else await enterFull(); updateFs(); };
    document.addEventListener('fullscreenchange', updateFs);
    document.addEventListener('webkitfullscreenchange' as any, updateFs as any);
    document.addEventListener('msfullscreenchange' as any, updateFs as any);
    this.fsBtn = fsBtn;

    // Coin display (next to music button, with enough spacing)
    const coin = document.createElement('div');
    Object.assign(coin.style, {
      position:'absolute', top:'14px', right:'120px', padding:'8px 12px',
      borderRadius:'999px', background:'rgba(255,255,255,0.10)', color:'#fff',
      display:'flex', alignItems:'center', gap:'8px', font:'700 14px system-ui, sans-serif',
      zIndex: '2', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.08)'
    } as CSSStyleDeclaration);
    const coinIcon = document.createElement('span'); coinIcon.textContent = '🪙';
    const coinCount = document.createElement('span'); coinCount.textContent = String(this.getCoins());
    coin.append(coinIcon, coinCount);
    this.coinEl = coin;

    // Grid
    const grid = document.createElement('div');
    Object.assign(grid.style, { display:'grid', gridTemplateColumns:'1fr', gap:'12px', alignItems:'start' } as CSSStyleDeclaration);
    this.gridEl = grid;

    // Left column: form
    const form = document.createElement('div');
    const title = document.createElement('h1');
    title.textContent = 'novacells.space';
    Object.assign(title.style,{margin:'0 0 14px', letterSpacing:'2px', fontWeight:'900', fontSize:'40px', textAlign:'center',
      background:'linear-gradient(90deg,#9af,#a6f,#6ff,#aff)', WebkitBackgroundClip:'text', color:'transparent'} as unknown as CSSStyleDeclaration);
    this.titleEl = title as HTMLHeadingElement;

    this.nameInput = document.createElement('input');
    this.nameInput.placeholder = 'Name...';
    this.nameInput.maxLength = 12;
    Object.assign(this.nameInput.style,{
      flex:'1 1 auto', padding:'12px 16px', borderRadius:'999px', border:'0', outline:'none',
      background:'rgba(255,255,255,0.10)', color:'#fff', fontWeight:'800', fontSize:'16px',
      boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.08)'
    } as CSSStyleDeclaration);

    // Skins bubble button (opens gallery)
    const skinsBtn = document.createElement('button');
    skinsBtn.textContent = 'Skins';
    Object.assign(skinsBtn.style, {
      flex:'0 0 auto', padding:'8px 12px', borderRadius:'999px', border:'0',
      background:'rgba(255,255,255,0.14)', color:'#fff', fontWeight:'800', cursor:'pointer',
      marginRight:'8px', fontSize:'14px'
    } as CSSStyleDeclaration);
    skinsBtn.onclick = ()=>{
      import('./skinsGallery').then(({ SkinsGallery })=>{
        new SkinsGallery({
          current: this.currentSkinCanvas,
          onPick: (skin)=>{ this.currentSkinCanvas = skin; this.updatePreview(); },
          onClose: ()=>{}
        });
      });
    };
    ;(this as any).skinsBtn = skinsBtn;

    // Name row
    const nameRow = document.createElement('div');
    Object.assign(nameRow.style, { display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' } as CSSStyleDeclaration);
    nameRow.append(skinsBtn, this.nameInput);

    // Modes row (Classic only)
    const modesRow = document.createElement('div');
    Object.assign(modesRow.style, { display:'grid', gridTemplateColumns:'1fr', gap:'12px', width:'min(520px, 92%)', margin:'0 auto' } as CSSStyleDeclaration);

    // SVG icon factory (no emojis)
    const ns = 'http://www.w3.org/2000/svg';
    const makeIcon = (kind: 'play' | 'rush') => {
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', '22');
      svg.setAttribute('height', '22');
      if (kind === 'play') {
        const poly = document.createElementNS(ns, 'polygon');
        poly.setAttribute('points', '6,4 20,12 6,20');
        poly.setAttribute('fill', '#0b0f12');
        poly.setAttribute('opacity', '0.95');
        svg.appendChild(poly);
      } else if (kind === 'rush') {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', '12'); circle.setAttribute('cy', '12'); circle.setAttribute('r', '7.5');
        circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', '#0b0f12'); circle.setAttribute('stroke-width', '2');
        const hand1 = document.createElementNS(ns, 'line');
        hand1.setAttribute('x1', '12'); hand1.setAttribute('y1', '12'); hand1.setAttribute('x2', '12'); hand1.setAttribute('y2', '7');
        hand1.setAttribute('stroke', '#0b0f12'); hand1.setAttribute('stroke-width', '2'); hand1.setAttribute('stroke-linecap', 'round');
        const hand2 = document.createElementNS(ns, 'line');
        hand2.setAttribute('x1', '12'); hand2.setAttribute('y1', '12'); hand2.setAttribute('x2', '16'); hand2.setAttribute('y2', '13');
        hand2.setAttribute('stroke', '#0b0f12'); hand2.setAttribute('stroke-width', '2'); hand2.setAttribute('stroke-linecap', 'round');
        const crown = document.createElementNS(ns, 'rect');
        crown.setAttribute('x', '10'); crown.setAttribute('y', '1.5'); crown.setAttribute('width', '4'); crown.setAttribute('height', '3'); crown.setAttribute('rx', '0.8');
        crown.setAttribute('fill', '#0b0f12'); crown.setAttribute('opacity', '0.95');
        svg.append(circle, hand1, hand2, crown);
      }
      return svg;
    };

    // Helper to decorate game buttons with neon sprites (SVG icons)
    const decorateBtn = (btn: HTMLButtonElement, label: string, variant: 'play'|'rush', from: string, to: string)=>{
      btn.innerHTML = '';
      Object.assign(btn.style, {
        position:'relative', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
        padding:'18px 22px 18px 68px', border:'0', borderRadius:'16px', fontWeight:'900', fontSize:'18px',
        background:`linear-gradient(100deg, ${from}, ${to})`, color:'#0b0f12', cursor:'pointer',
        boxShadow:`0 10px 24px ${from}44, 0 2px 0 ${to}44`, overflow:'hidden',
        transform:'translateZ(0)'
      } as CSSStyleDeclaration);
      btn.onmouseenter = ()=>{ btn.style.filter = 'brightness(1.06)'; btn.style.transform = 'translateZ(0) scale(1.02)'; };
      btn.onmouseleave = ()=>{ btn.style.filter = 'none'; btn.style.transform = 'translateZ(0) scale(1.0)'; };
      // Icon bubble (sprite container)
      const ico = document.createElement('span');
      Object.assign(ico.style, {
        position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)',
        width:'44px', height:'44px', borderRadius:'12px', display:'grid', placeItems:'center',
        background:`radial-gradient(60% 60% at 30% 30%, #ffffffaa, #ffffff44 60%, transparent 70%), linear-gradient(145deg, ${to}, ${from})`,
        boxShadow:`0 8px 18px ${to}55, inset 0 0 0 1px #ffffff55`
      } as CSSStyleDeclaration);
      // Insert SVG icon
      const svgIcon = makeIcon(variant);
      ico.appendChild(svgIcon);
      // Shine sprite
      const shine = document.createElement('span');
      Object.assign(shine.style, {
        position:'absolute', right:'-28px', top:'-28px', width:'120px', height:'120px', borderRadius:'50%',
        background:'radial-gradient(closest-side, rgba(255,255,255,0.45), rgba(255,255,255,0) 70%)',
        pointerEvents:'none', filter:'blur(1px)'
      } as CSSStyleDeclaration);
      // Bottom neon underline
      const underline = document.createElement('span');
      Object.assign(underline.style, {
        position:'absolute', left:'0', right:'0', bottom:'0', height:'3px',
        background:`linear-gradient(90deg, ${from}, ${to})`, opacity:'0.9'
      } as CSSStyleDeclaration);
      // Label
      const lbl = document.createElement('span');
      lbl.textContent = label;
      Object.assign(lbl.style, { letterSpacing:'0.3px', textShadow:'0 1px 0 rgba(255,255,255,0.35)' } as CSSStyleDeclaration);

      btn.append(ico, lbl, shine, underline);
    };

    const btnClassic = document.createElement('button');
    decorateBtn(btnClassic, 'Classic', 'play', '#ffa63b', '#ffcc4d');
    Object.assign(btnClassic.style, { marginTop: '20px' } as CSSStyleDeclaration);
    btnClassic.onclick = ()=>{ this.startBtn.click(); };

    modesRow.append(btnClassic);
    ;(this as any).modesRow = modesRow;

    // Palette placeholder (gallery handles selection)
    const palette = document.createElement('div');
    Object.assign(palette.style, { display:'none' } as CSSStyleDeclaration);
    this.paletteEl = palette;

    // Hidden preview/right column
    const right = document.createElement('div'); right.style.display = 'none';
    this.preview = document.createElement('canvas'); this.preview.width = 200; this.preview.height = 200; this.preview.style.display='none'; right.appendChild(this.preview);

    // Start button (hidden; triggered by game mode buttons)
    const startBtn = document.createElement('button'); startBtn.textContent = 'SPIEL STARTEN';
    Object.assign(startBtn.style, { position:'absolute', left:'-9999px', top:'-9999px' } as CSSStyleDeclaration);
    this.startBtn = startBtn;
    startBtn.onclick = ()=>{
      const cfg: PlayerConfig = { name: this.nameInput.value || 'You', color: '#5cf2a6', skinCanvas: this.currentSkinCanvas } as any;
      this.opts.onStart(cfg);
      this.hide();
    };

    // Assemble (compact)
    form.append(title, nameRow, modesRow /*, palette*/);
    grid.append(form, right);

    // Right-side Match Results card (visual only)
    const results = document.createElement('div');
    Object.assign(results.style, { position:'absolute', top:'20px', right:'14px', width:'260px', padding:'12px', borderRadius:'14px', background:'rgba(255,255,255,0.90)', color:'#123', boxShadow:'0 12px 28px rgba(0,0,0,.25)' } as CSSStyleDeclaration);
    results.innerHTML = `
      <div style="font-weight:900; margin:2px 0 8px;">Match Results:</div>
      <div style="font-size:14px; line-height:1.65">
        Highest mass: <b>—</b><br/>
        Mass eaten: <b>—</b><br/>
        Cells eaten: <b>—</b><br/>
        Survival Time: <b>—</b><br/>
        Leaderboard time: <b>—</b><br/>
        Top position: <b>—</b>
      </div>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <button id="btn-records" style="flex:1; padding:8px 10px; border:0; border-radius:10px; background:#8b5cf6; color:#fff; font-weight:800; cursor:pointer">Rekorde</button>
        <button style="flex:1; padding:8px 10px; border:0; border-radius:10px; background:#1da1f2; color:#fff; font-weight:800; cursor:pointer">t Share</button>
      </div>
    `;
    ;(this as any).resultsCard = results as HTMLDivElement;

    // Hook Rekorde button
    setTimeout(()=>{
      const btn = results.querySelector('#btn-records') as HTMLButtonElement | null;
      if (btn){ btn.onclick = ()=> this.openRecordsOverlay(); }
    }, 0);

    // When logged in, show own Top 10 in the Results card
    onAuthStateChanged(auth, async (user)=>{
      const metaDiv = results.querySelector('div:nth-child(2)') as HTMLDivElement | null;
      try {
        if (user?.uid) {
          const { fetchUserTop10, fetchUserCoins } = await import('./recordsCloud');
          const [list, coins] = await Promise.all([
            fetchUserTop10(user.uid),
            fetchUserCoins(user.uid)
          ]);
          if (list && list.length && metaDiv) {
            const best = list[0];
            metaDiv.innerHTML = `<div style=\"font-weight:800\">Max Masse (deine Top 10): ${Math.round(best.maxMass)}</div><div style=\"opacity:.85\">Überlebt: ${Math.round(best.survivedSec)}s</div>`;
          }
          // update coin badge
          this.setCoins(coins);
        }
      } catch {}
    });

    // Bottom bar: Starter Pack + Shop + Google / Account
    const bottom = document.createElement('div');
    Object.assign(bottom.style, { position:'absolute', left:'14px', right:'14px', bottom:'12px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px' } as CSSStyleDeclaration);
    const starter = document.createElement('button'); starter.textContent = 'Starter Pack!'; Object.assign(starter.style, { padding:'10px 12px', border:'0', borderRadius:'12px', fontWeight:'900', background:'linear-gradient(90deg,#ff6b6b,#ff9f43)', color:'#1a1308', boxShadow:'0 10px 22px rgba(255,111,97,.25)', cursor:'pointer' } as CSSStyleDeclaration);
    const shop = document.createElement('button'); shop.textContent = 'Shop'; Object.assign(shop.style, { padding:'10px 16px', border:'0', borderRadius:'12px', fontWeight:'900', background:'#34d399', color:'#052', boxShadow:'0 10px 22px rgba(52,211,153,.25)', cursor:'pointer' } as CSSStyleDeclaration);
    // Google login button / user label
    const account = document.createElement('button');
    Object.assign(account.style, { marginLeft:'auto', padding:'8px 12px', borderRadius:'999px', background:'rgba(255,255,255,0.92)', color:'#123', fontWeight:'900', border:'0', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' } as CSSStyleDeclaration);
    const gLogo = document.createElement('span'); gLogo.textContent = 'G'; Object.assign(gLogo.style,{ width:'22px', height:'22px', borderRadius:'50%', display:'grid', placeItems:'center', background:'#fff', color:'#4285F4', fontWeight:'900', boxShadow:'inset 0 0 0 1px #ddd' } as CSSStyleDeclaration);
    const gLabel = document.createElement('span'); gLabel.textContent = 'Mit Google anmelden';
    account.append(gLogo, gLabel);

    // Sign-out button
    const signoutBtn = document.createElement('button'); signoutBtn.textContent = 'Abmelden';
    Object.assign(signoutBtn.style, { padding:'8px 12px', borderRadius:'999px', background:'rgba(255,255,255,0.92)', color:'#123', fontWeight:'900', border:'0', cursor:'pointer', display:'none' } as CSSStyleDeclaration);

    const setUser = (name?:string)=>{
      if (name){
        account.replaceChildren();
        const avatar = document.createElement('span'); Object.assign(avatar.style,{ width:'26px', height:'26px', borderRadius:'50%', background:'#e5f2ff', color:'#245', display:'grid', placeItems:'center', fontWeight:'900' } as CSSStyleDeclaration);
        avatar.textContent = name.trim()[0]?.toUpperCase() || 'U';
        const nm = document.createElement('span'); nm.textContent = name; Object.assign(nm.style,{ maxWidth:'180px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } as CSSStyleDeclaration);
        account.append(avatar, nm);
        account.onclick = null;
        signoutBtn.style.display = 'inline-block';
      } else {
        account.replaceChildren(gLogo, gLabel);
        account.onclick = async ()=>{
          const { auth, googleProvider, signInWithPopup } = await import('./firebase');
          try{ await signInWithPopup(auth, googleProvider); }catch(e){ console.warn('Google sign-in failed', e); }
        };
        signoutBtn.style.display = 'none';
      }
    };
    onAuthStateChanged(auth, (user)=>{ setUser(user?.displayName || user?.email || undefined); });
    setUser();

    signoutBtn.onclick = async ()=>{
      try{
        const { auth, signOut } = await import('./firebase');
        await signOut(auth);
      }catch(e){ console.warn('Sign out failed', e); }
    };

    bottom.append(starter, shop, account, signoutBtn);
    ;(this as any).bottomBar = bottom as HTMLDivElement;

    // Append
    card.append(this.musicBtn!, this.fsBtn!, this.coinEl!, grid, results, /* side removed */ bottom, this.startBtn);

    this.root.append(this.bgCanvas, card);
    document.body.appendChild(this.root);

    // Open Shop overlay on click
    shop.onclick = ()=>{
      import('./shop').then(m=>{ new m.ShopOverlay(); }).catch(()=>{});
    };
    // Listen for coin updates coming from Shop overlay
    window.addEventListener('coins-updated', (ev: any)=>{
      const val = Number(ev?.detail);
      if (Number.isFinite(val)) this.setCoins(val);
    });

    this.updatePreview();
    this.loopBg();
    this.updateLayout();
    window.addEventListener('resize', ()=> this.updateLayout());
  }

  private initMenuPellets(){
    const W = this.bgCanvas.width, H = this.bgCanvas.height;
    const count = Math.floor(Math.min(1200, Math.max(360, (W*H)/6000)));
    this.menuPellets = [];
    for (let i=0;i<count;i++){
      const r = Math.random()*1.6 + 0.6;
      // gentle drift
      const ang = Math.random()*Math.PI*2;
      const spd = (Math.random()*12 + 6) * 0.4; // very slow
      this.menuPellets.push({
        x: Math.random()*W, y: Math.random()*H, r,
        vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd,
        alpha: 0.6 + Math.random()*0.35,
        tw: (Math.random()*2 - 1) * 0.4
      });
    }
  }

  private resizeBg(){
    // Size backing store using device pixel ratio to prevent CSS scaling drift
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    this.bgCanvas.width = w;
    this.bgCanvas.height = h;
    // keep CSS size in CSS pixels
    this.bgCanvas.style.width = '100%';
    this.bgCanvas.style.height = '100%';
    // reset transform for drawing in pixel space
    this.bgCtx.setTransform(1,0,0,1,0,0);
  }

  private updatePreview(){
    const ctx = this.preview.getContext('2d')!;
    ctx.imageSmoothingEnabled = true; (ctx as any).imageSmoothingQuality = 'high';
    const r = 90; const cx = this.preview.width/2, cy = this.preview.height/2;
    ctx.clearRect(0,0,this.preview.width,this.preview.height);
    ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip();
    ctx.drawImage(this.currentSkinCanvas, cx-r, cy-r, r*2, r*2);
    ctx.restore();
    ctx.lineWidth = 4; ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();
  }

  private loopBg(){
    const ctx = this.bgCtx;
    // Prevent multiple loops
    if (this.bgActive) return;
    this.bgActive = true;
    let tPrev = performance.now();

    const step = (ts:number)=>{
      if (!this.bgActive) return; // stop drawing when hidden
      const dt = (ts - tPrev)/1000; tPrev = ts;
      // ensure identity transform and fresh canvas size every frame
      ctx.setTransform(1,0,0,1,0,0);
      const W = this.bgCanvas.width, H = this.bgCanvas.height;

      // draw same galaxy background as ingame
      this.level.drawBackgroundScreen(ctx);

      // draw pellets like ingame (soft white dots), gently drifting
      ctx.save();
      for (const p of this.menuPellets){
        p.x += p.vx * dt; p.y += p.vy * dt;
        // wrap around screen edges for continuity (use fresh W/H)
        if (p.x < -4) p.x = W+4; else if (p.x > W+4) p.x = -4;
        if (p.y < -4) p.y = H+4; else if (p.y > H+4) p.y = -4;
        // subtle twinkle
        const a = Math.max(0.2, Math.min(1.0, p.alpha + Math.sin(ts*0.001 + p.x*0.01 + p.y*0.01)*0.08));
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(2, p.r*1.0), 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${0.82*a})`;
        ctx.fill();
      }
      ctx.restore();

      this.bgRAF = requestAnimationFrame(step);
    };
    this.bgRAF = requestAnimationFrame(step);
  }

  private updateLayout(){
    const W = window.innerWidth; const H = window.innerHeight;
    const isMobile = W < 820 || H < 640;
    const narrowForResults = W < 1060;

    // More compact card
    Object.assign(this.card.style, {
      width: isMobile ? 'min(640px, 94vw)' : 'min(980px, 92vw)',
      borderRadius: isMobile ? '16px' : '18px'
    } as CSSStyleDeclaration);

    if (isMobile) {
      Object.assign(this.card.style, { paddingTop:'56px', paddingRight:'14px', paddingBottom:'72px', paddingLeft:'14px' } as CSSStyleDeclaration);
    } else {
      Object.assign(this.card.style, { paddingTop:'60px', paddingRight: narrowForResults ? '18px' : '300px', paddingBottom:'76px', paddingLeft: narrowForResults ? '18px' : '78px' } as CSSStyleDeclaration);
    }

    Object.assign(this.titleEl.style, { textAlign:'center', fontSize: isMobile ? '28px' : '36px', margin: isMobile ? '0 0 8px' : '0 0 12px' } as CSSStyleDeclaration);

    const modesRow = (this as any).modesRow as HTMLDivElement; if (modesRow){ Object.assign(modesRow.style, { gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', width: isMobile ? 'min(420px, 94%)' : 'min(520px, 92%)' } as CSSStyleDeclaration); }
    const skinsBtn = (this as any).skinsBtn as HTMLButtonElement; if (skinsBtn){ Object.assign(skinsBtn.style, { padding: isMobile ? '8px 11px' : '8px 12px', fontSize: isMobile ? '13px':'14px' } as CSSStyleDeclaration); }
    Object.assign(this.nameInput.style, { fontSize: isMobile ? '14px' : '15px', padding: isMobile ? '10px 12px' : '11px 14px' } as CSSStyleDeclaration);

    const results = (this as any).resultsCard as HTMLDivElement;
    if (results) {
      if (isMobile || narrowForResults) {
        Object.assign(results.style, { position:'static', width:'min(480px, 92%)', margin:'10px auto 0' } as CSSStyleDeclaration);
      } else {
        const topOffset = 84; const bottomReserve = 100;
        Object.assign(results.style, { position:'absolute', width:'240px', right:'12px', top:`${topOffset}px`, maxHeight:`calc(100vh - ${topOffset}px - ${bottomReserve}px)`, overflowY:'auto' } as CSSStyleDeclaration);
      }
    }

    const side = (this as any).sideIcons as HTMLDivElement; if (side){ Object.assign(side.style, { display: (isMobile || narrowForResults) ? 'none':'grid' } as CSSStyleDeclaration); }
    const bottom = (this as any).bottomBar as HTMLDivElement; if (bottom){ Object.assign(bottom.style, { left: isMobile ? '10px':'12px', right: isMobile ? '10px':'12px', bottom: isMobile ? '8px':'10px', paddingRight: (isMobile || narrowForResults) ? '0' : '280px' } as CSSStyleDeclaration); }

    const thumb = isMobile ? 46 : 56; for (const cv of this.presetThumbs){ cv.style.width = `${thumb}px`; cv.style.height = `${thumb}px`; }
  }

  show(){
    this.root.style.display = 'grid';
    // restart background animation when shown
    if (!this.bgActive) this.loopBg();
  }
  hide(){
    this.root.style.display = 'none';
    // stop background animation to save CPU
    if (this.bgRAF !== undefined){
      cancelAnimationFrame(this.bgRAF);
      this.bgRAF = undefined;
    }
    this.bgActive = false;
  }

  private openRecordsOverlay(){
    const overlay = document.createElement('div');
    Object.assign(overlay.style, { position:'fixed', inset:'0', zIndex:'120', display:'grid', placeItems:'center', background:'rgba(0,0,0,0.45)' } as CSSStyleDeclaration);

    const card = document.createElement('div');
    Object.assign(card.style, { width:'min(840px, 94vw)', maxHeight:'min(80vh, 760px)', overflow:'auto', background:'rgba(8,10,28,0.80)', backdropFilter:'blur(10px)', borderRadius:'16px', padding:'16px', color:'#fff', boxShadow:'0 30px 60px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,0.06)' } as CSSStyleDeclaration);

    const head = document.createElement('div'); head.textContent = 'Deine Top 10 Rekorde'; Object.assign(head.style,{ fontWeight:'900', marginBottom:'10px' } as CSSStyleDeclaration);

    const list = document.createElement('div');

    const render = (items: any[])=>{
      list.innerHTML = '';
      for (const rec of items){
        const row = document.createElement('div');
        Object.assign(row.style,{ display:'grid', gridTemplateColumns:'56px 1fr auto auto', gap:'10px', alignItems:'center', padding:'8px', borderRadius:'10px', background:'rgba(255,255,255,0.06)', marginBottom:'8px' } as CSSStyleDeclaration);
        const skin = document.createElement('canvas'); skin.width=48; skin.height=48; Object.assign(skin.style,{ width:'48px', height:'48px', borderRadius:'50%', background:'#111' } as CSSStyleDeclaration);
        if (rec.skinDataUrl){ const img = new Image(); img.onload = ()=>{ const c=skin.getContext('2d')!; c.save(); c.beginPath(); c.arc(24,24,24,0,Math.PI*2); c.clip(); c.drawImage(img,0,0,48,48); c.restore(); }; img.src = rec.skinDataUrl; }
        const meta = document.createElement('div'); meta.textContent = '';
        meta.innerHTML = `<div style="font-weight:800">Max Masse: ${Math.round(rec.maxMass)}</div><div style="opacity:.85">Überlebt: ${Math.round(rec.survivedSec)}s</div>`;
        const date = document.createElement('div'); date.textContent = new Date(rec.ts).toLocaleString(); Object.assign(date.style,{ opacity:'.8' } as CSSStyleDeclaration);
        const pos = document.createElement('div');
        row.append(skin, meta, date, pos);
        list.append(row);
      }
      if (items.length===0){ const empty=document.createElement('div'); empty.textContent='Keine Rekorde vorhanden.'; Object.assign(empty.style,{ opacity:'.8', padding:'8px'} as CSSStyleDeclaration); list.append(empty); }
    };

    // Load user-specific records if logged in; otherwise local top 10
    const user = auth.currentUser;
    if (user?.uid) {
      import('./recordsCloud')
        .then(m => m.fetchUserTop10(user.uid!))
        .then(items => render(items))
        .catch(()=> import('./records').then(m=> render(m.getTopRecords())));
    } else {
      import('./records').then(m=> render(m.getTopRecords()));
    }

    const close = document.createElement('button'); close.textContent='Schließen'; Object.assign(close.style,{ marginTop:'10px', padding:'10px 14px', border:'0', borderRadius:'10px', fontWeight:'900', background:'#334155', color:'#fff', cursor:'pointer' } as CSSStyleDeclaration);
    close.onclick = ()=> overlay.remove();

    card.append(head, list, close);
    overlay.append(card);
    document.body.appendChild(overlay);
  }

  private getCoins(): number {
    try { const v = localStorage.getItem('neoncells.coins'); return v ? Math.max(0, parseInt(v)) : 0; } catch { return 0; }
  }
  setCoins(n:number){
    try { localStorage.setItem('neoncells.coins', String(Math.max(0, Math.floor(n)))); } catch {}
    if (this.coinEl){ const spans = this.coinEl.querySelectorAll('span'); if (spans[1]) spans[1].textContent = String(this.getCoins()); }
  }
}
