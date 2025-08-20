// startMenu.ts
import type { PlayerConfig } from './types';
import { makeSkinCanvas } from './skins';
import type { SkinKind } from './skins';
import { FIXED_PRESET_COMBOS } from './skins';
import { MusicManager } from './musicManager';
import { LevelDesign } from './LevelDesign';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged } from './firebase';
import { getUiProgress, getState, setHooks } from './xp';

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
  private skinThumb?: HTMLCanvasElement;
  // New refs for responsive layout
  private card!: HTMLDivElement;
  private gridEl!: HTMLDivElement;
  private paletteEl!: HTMLDivElement;
  private titleEl!: HTMLHeadingElement;
  private titleTextEl!: HTMLSpanElement;
  private nameWrapEl!: HTMLDivElement;
  private startBtn!: HTMLButtonElement;
  private musicBtn?: HTMLButtonElement;
  private fsBtn?: HTMLButtonElement;
  private presetThumbs: HTMLCanvasElement[] = [];
  private coinEl?: HTMLDivElement;
  private userBadgeCanvas?: HTMLCanvasElement;

  constructor(private opts: StartMenuOptions){
    // Overlay root
    this.root = document.createElement('div');
    this.root.id = 'start-menu';
    Object.assign(this.root.style, {
      position:'fixed', inset:'0', zIndex:'2000', display:'grid', placeItems:'center',
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

    // Music toggle button (SVG sprite)
    const musicBtn = document.createElement('button');
    const musicPlaying = this.opts.musicManager?.isCurrentlyPlaying();
    Object.assign(musicBtn.style, {
      position:'absolute', top:'14px', left:'14px', right:'auto', width:'40px', height:'40px', borderRadius:'50%',
      border:'0', background:'rgba(255,255,255,0.10)', color:'#fff', cursor:'pointer',
      display:'grid', placeItems:'center', zIndex:'2'
    } as CSSStyleDeclaration);
    const setMusicIcon = ()=>{
      musicBtn.replaceChildren(makeSprite(this.opts.musicManager?.isCurrentlyPlaying() ? 'volume-on' : 'volume-off'));
    };
    setMusicIcon();
    musicBtn.onclick = ()=>{ this.opts.musicManager?.toggle(); setMusicIcon(); };
    this.musicBtn = musicBtn;

    // Fullscreen button (SVG sprite)
    const fsBtn = document.createElement('button');
    Object.assign(fsBtn.style, {
      position:'absolute', top:'14px', left:'66px', right:'auto', width:'40px', height:'40px', borderRadius:'50%',
      border:'0', background:'rgba(255,255,255,0.10)', color:'#fff', cursor:'pointer',
      display:'grid', placeItems:'center', zIndex:'2'
    } as CSSStyleDeclaration);
    fsBtn.appendChild(makeSprite('fullscreen'));
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

    // Coin display (SVG sprite)
    const coin = document.createElement('div');
    Object.assign(coin.style, {
      position:'absolute', top:'14px', right:'14px', padding:'8px 12px',
      borderRadius:'999px', background:'rgba(255,255,255,0.10)', color:'#fff',
      display:'flex', alignItems:'center', gap:'8px', font:'700 14px system-ui, sans-serif',
      zIndex: '2', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.08)'
    } as CSSStyleDeclaration);
    const coinIcon = makeSprite('coin');
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
    const titleText = document.createElement('span');
    titleText.textContent = 'novacells.space';
    // Base visible style (fallback)
    Object.assign(titleText.style, { display:'inline-block', color:'#fff' } as unknown as CSSStyleDeclaration);
    // Robust gradient text with safe fallback
    try {
      const hasCSS = (window as any).CSS && typeof (CSS as any).supports === 'function';
      const canClip = hasCSS && ((CSS as any).supports('background-clip', 'text') || (CSS as any).supports('-webkit-background-clip', 'text'));
      if (canClip) {
        titleText.style.background = 'linear-gradient(90deg,#9af,#a6f,#6ff,#aff)';
        (titleText.style as any).webkitBackgroundClip = 'text';
        titleText.style.backgroundClip = 'text';
        (titleText.style as any).webkitTextFillColor = 'transparent';
        titleText.style.color = 'transparent';
      } else {
        // ensure it stays visible if clip not supported
        (titleText.style as any).webkitBackgroundClip = '';
        (titleText.style as any).webkitTextFillColor = '';
        titleText.style.background = '';
        titleText.style.color = '#fff';
      }
    } catch {}
    title.appendChild(titleText);
    // Ensure title styling is applied and references are set (fix corrupted block)
    Object.assign(title.style, {
      margin: '0 0 14px',
      letterSpacing: '2px',
      fontWeight: '900',
      fontSize: '40px',
      textAlign: 'center'
    } as CSSStyleDeclaration);
    this.titleEl = title as HTMLHeadingElement;
    this.titleTextEl = titleText;

    // Name input field
    this.nameInput = document.createElement('input');
    Object.assign(this.nameInput.style, {
      flex:'0 0 auto', width:'100%', padding:'12px 16px', borderRadius:'999px', border:'0', outline:'none',
      background:'rgba(255,255,255,0.10)', color:'#fff', fontWeight:'800', fontSize:'16px',
      boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.08)'
    } as CSSStyleDeclaration);

    // Hidden start trigger button
    this.startBtn = document.createElement('button');
    this.startBtn.type = 'button';
    Object.assign(this.startBtn.style, { display:'none' } as CSSStyleDeclaration);
    this.startBtn.onclick = ()=>{
      try {
        const name = (this.nameInput.value || '').trim() || 'Player';
        this.hide();
        this.opts.onStart({ name, skinCanvas: this.currentSkinCanvas } as any);
      } catch {}
    };
    // Allow Enter key to start
    this.nameInput.addEventListener('keydown', (e: KeyboardEvent)=>{
      if (e.key === 'Enter') { e.preventDefault(); this.startBtn.click(); }
    });

    // Skins circular button (opens gallery)
    const skinsBtn = document.createElement('button');
    Object.assign(skinsBtn.style, {
      position:'absolute', left:'-50px', top:'50%', transform:'translateY(-50%)',
      width:'44px', height:'44px', padding:'0', borderRadius:'50%', border:'0',
      background:'rgba(255, 255, 255, 0.15)', cursor:'pointer', display:'grid', placeItems:'center',
      zIndex: '10',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    } as CSSStyleDeclaration);
    // Circular skin thumbnail (shows currently selected skin)
    const skinThumb = document.createElement('canvas'); skinThumb.width = 44; skinThumb.height = 44;
    Object.assign(skinThumb.style, { width:'44px', height:'44px', borderRadius:'50%', display:'block', background:'#0b0f12', boxShadow:'inset 0 0 0 2px rgba(255,255,255,0.18)' } as CSSStyleDeclaration);
    this.skinThumb = skinThumb;
    skinsBtn.title = 'Skins';
    skinsBtn.setAttribute('aria-label','Skins');
    skinsBtn.append(skinThumb);
    
    // Sofortiger Event-Handler mit setTimeout zur sicheren Ausführung
    skinsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🎨 Skin button clicked! Event triggered immediately');
      setTimeout(() => {
        import('./skinsGallery').then(({ SkinsGallery })=>{
          console.log('SkinsGallery imported successfully');
          new SkinsGallery({
            current: this.currentSkinCanvas,
            onPick: (skinCanvas)=>{ 
              this.currentSkinCanvas = skinCanvas; 
              this.updatePreview(); 
              this.updateSkinThumb(); 
            },
            onClose: ()=>{}
          });
          // Ensure the newly added overlay is displayed above the start menu
          try { this.bringLastOverlayToFront(); } catch (err) { /* ignore */ }
        }).catch(error => {
          console.error('Failed to import SkinsGallery:', error);
        });
      }, 0);
    });
    ;(this as any).skinsBtn = skinsBtn;

    // Name row wrapper centered under title, input centered; skins button sits to the left
    const nameWrap = document.createElement('div');
    Object.assign(nameWrap.style, { 
      position:'relative', 
      width:'min(320px, 72vw)', 
      margin:'0',
      overflow: 'visible' // Ensure button isn't clipped
    } as CSSStyleDeclaration);
    nameWrap.append(this.nameInput, skinsBtn);
    this.nameWrapEl = nameWrap;

    // Modes row: Start + Placeholder + Shop + Gifts (centered under name)
    const modesRow = document.createElement('div');
    Object.assign(modesRow.style, {
      display:'grid', gridTemplateColumns:'auto auto auto auto', gap:'10px',
      width:'auto', margin:'8px auto 0', justifyContent:'center'
    } as CSSStyleDeclaration);

    const startBtnVis = document.createElement('button');
    Object.assign(startBtnVis.style, {
      width:'56px', height:'56px', padding:'0', border:'0', borderRadius:'50%',
      background:'linear-gradient(145deg, #ffcc4d, #ffa63b)', color:'#0b0f12', cursor:'pointer',
      boxShadow:'0 10px 20px #ffa63b44, 0 2px 0 #ffcc4d44', display:'grid', placeItems:'center'
    } as CSSStyleDeclaration);
    { 
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns,'svg');
      svg.setAttribute('viewBox','0 0 24 24');
      svg.setAttribute('width','22');
      svg.setAttribute('height','22');
      const tri = document.createElementNS(ns,'polygon');
      tri.setAttribute('points','7,5 19,12 7,19');
      tri.setAttribute('fill','#0b0f12');
      svg.appendChild(tri);
      // Append the play icon to the Start button (was missing)
      startBtnVis.appendChild(svg);
    }
    startBtnVis.title = 'Start';
    startBtnVis.onclick = ()=>{ this.startBtn.click(); };

    const placeholderBtn = document.createElement('button');
    Object.assign(placeholderBtn.style, {
      width:'56px', height:'56px', padding:'0', border:'0', borderRadius:'50%',
      background:'linear-gradient(145deg, #e5e7eb, #d1d5db)', color:'#0b0f12', cursor:'not-allowed',
      boxShadow:'0 10px 18px #9ca3af33, 0 2px 0 #e5e7eb66', display:'grid', placeItems:'center', opacity:'0.9'
    } as CSSStyleDeclaration);
    { const ns = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('width','20'); svg.setAttribute('height','20'); const circ = document.createElementNS(ns,'circle'); circ.setAttribute('cx','12'); circ.setAttribute('cy','12'); circ.setAttribute('r','8'); circ.setAttribute('fill','none'); circ.setAttribute('stroke','#0b0f12'); circ.setAttribute('stroke-width','2'); const hand = document.createElementNS(ns,'line'); hand.setAttribute('x1','12'); hand.setAttribute('y1','12'); hand.setAttribute('x2','16'); hand.setAttribute('y2','13'); hand.setAttribute('stroke','#0b0f12'); hand.setAttribute('stroke-width','2'); hand.setAttribute('stroke-linecap','round'); svg.append(circ, hand); placeholderBtn.appendChild(svg); }
    placeholderBtn.title = 'Bald';

    // Shop small button (next to Start)
    const shopSmall = document.createElement('button');
    Object.assign(shopSmall.style, {
      width:'56px', height:'56px', padding:'0', border:'0', borderRadius:'50%',
      background:'#34d399', color:'#052', cursor:'pointer', display:'grid', placeItems:'center',
      boxShadow:'0 10px 18px rgba(52,211,153,.25)'
    } as CSSStyleDeclaration);
    shopSmall.title = 'Shop';
    shopSmall.appendChild(makeSprite('cart'));
    
    // Sofortiger Event-Handler mit setTimeout zur sicheren Ausführung
    shopSmall.addEventListener('click', (e) => {
      e.preventDefault(); 
      e.stopPropagation();
      console.log('🛒 Shop button clicked! Event triggered immediately');
      setTimeout(() => {
        import('./shop').then(({ ShopOverlay })=>{ 
          console.log('Shop module imported successfully');
          try{ 
            new ShopOverlay(); 
            // Put overlay above start menu
            try { this.bringLastOverlayToFront(); } catch (err) { /* ignore */ }
          }catch(e){ 
            console.warn('Shop open failed', e);
          } 
        }).catch(error => {
          console.error('Failed to import shop module:', error);
        });
      }, 0);
    });

    // Gifts small button (to the right)
    const giftsSmall = document.createElement('button');
    Object.assign(giftsSmall.style, {
      width:'56px', height:'56px', padding:'0', border:'0', borderRadius:'50%',
      background:'#60a5fa', color:'#052', cursor:'pointer', display:'grid', placeItems:'center',
      boxShadow:'0 10px 18px rgba(96,165,250,.25)'
    } as CSSStyleDeclaration);
    giftsSmall.title = 'Gifts';
    giftsSmall.appendChild(makeSprite('gift'));

    modesRow.append(startBtnVis, placeholderBtn, shopSmall, giftsSmall);
    ;(this as any).modesRow = modesRow;

    // Centered XP + Account under textbox
    const midInfo = document.createElement('div');
    Object.assign(midInfo.style, { display:'grid', gap:'8px', justifyItems:'center', margin:'8px auto 0' } as CSSStyleDeclaration);
    ;(this as any).midInfo = midInfo;

    // XP bar + Level label
    const xpWrap = document.createElement('div'); Object.assign(xpWrap.style,{ width:'240px', height:'14px', borderRadius:'999px', background:'rgba(255,255,255,0.15)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.10)' } as CSSStyleDeclaration);
    const xpFill = document.createElement('div'); Object.assign(xpFill.style,{ width:'0%', height:'100%', borderRadius:'999px', background:'linear-gradient(90deg,#a78bfa,#60a5fa)', boxShadow:'0 6px 14px rgba(96,165,250,0.35)', transition:'width .25s ease' } as CSSStyleDeclaration);
    xpWrap.appendChild(xpFill);
    const lvlBadge = document.createElement('div');
    Object.assign(lvlBadge.style, { padding:'2px 8px', borderRadius:'999px', background:'rgba(255,255,255,0.14)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.10)', font:'800 12px system-ui', letterSpacing:'0.2px', color:'#fff' } as CSSStyleDeclaration);
    lvlBadge.textContent = 'Level 1';
    const xpRow = document.createElement('div');
    Object.assign(xpRow.style, { display:'flex', alignItems:'center', gap:'8px' } as CSSStyleDeclaration);
    xpRow.append(xpWrap, lvlBadge);
    ;(this as any).setXP = (current:number, max:number, level?:number)=>{
      const pct = Math.max(0, Math.min(1, max ? current/max : 0));
      xpFill.style.width = `${Math.round(pct*100)}%`;
      if (typeof level === 'number') lvlBadge.textContent = `Level ${Math.max(1, Math.floor(level))}`;
    };

    // Account row (Google name / abmelden) with skin avatar
    const accountRow = document.createElement('div'); Object.assign(accountRow.style,{ display:'flex', alignItems:'center', gap:'8px' } as CSSStyleDeclaration);
    const userBadge = document.createElement('canvas'); userBadge.width = 28; userBadge.height = 28; Object.assign(userBadge.style,{ width:'28px', height:'28px', borderRadius:'50%', display:'block', background:'#0b0f12', boxShadow:'inset 0 0 0 2px rgba(255,255,255,0.18)' } as CSSStyleDeclaration);
    this.userBadgeCanvas = userBadge;
    const userName = document.createElement('div'); Object.assign(userName.style,{ maxWidth:'220px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', font:'800 14px system-ui' } as CSSStyleDeclaration); userName.textContent = '';
    const signInBtn = document.createElement('button'); Object.assign(signInBtn.style,{ padding:'8px 12px', borderRadius:'999px', background:'rgba(255,255,255,0.92)', color:'#123', fontWeight:'900', border:'0', cursor:'pointer' } as CSSStyleDeclaration); signInBtn.textContent='Mit Google anmelden';
    const signoutBtn = document.createElement('button'); signoutBtn.textContent = 'Abmelden'; Object.assign(signoutBtn.style, { padding:'8px 12px', borderRadius:'999px', background:'rgba(255,255,255,0.92)', color:'#123', fontWeight:'900', border:'0', cursor:'pointer', display:'none' } as CSSStyleDeclaration);
    const setUser = (name?:string)=>{ if (name) { userName.textContent = name; accountRow.replaceChildren(userBadge, userName, signoutBtn); signInBtn.style.display = 'none'; signoutBtn.style.display = 'inline-block'; } else { userName.textContent = ''; accountRow.replaceChildren(userBadge, signInBtn); signInBtn.style.display = 'inline-block'; signoutBtn.style.display = 'none'; } };
    signInBtn.onclick = async ()=>{ const { auth, googleProvider, signInWithPopup } = await import('./firebase'); try{ await signInWithPopup(auth, googleProvider); }catch(e){ console.warn('Google sign-in failed', e); } };
    signoutBtn.onclick = async ()=>{ try{ const { auth, signOut } = await import('./firebase'); await signOut(auth); }catch(e){ console.warn('Sign out failed', e); } };
    onAuthStateChanged(auth, (user)=>{ setUser(user?.displayName || user?.email || undefined); });
    setUser();

    midInfo.append(xpRow, accountRow);

    // Create 3-column row: left controls + results, center inputs, right shop area
    const triRow = document.createElement('div');
    Object.assign(triRow.style, { display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'stretch', gap:'16px' } as CSSStyleDeclaration);
    ;(this as any).triRow = triRow;

    // Left column (currently unused placeholder for future controls)
    const leftCol = document.createElement('div'); Object.assign(leftCol.style,{ display:'grid', gap:'6px', justifyItems:'start' } as CSSStyleDeclaration);
    ;(this as any).leftCol = leftCol;
    const ctrl = document.createElement('div'); Object.assign(ctrl.style,{ display:'flex', gap:'8px', alignItems:'center' } as CSSStyleDeclaration);
    // controls are absolute at top-left of the card now

    // Center column: name + start buttons + xp/account (remove left offset)
    const centerCol = document.createElement('div'); 
    Object.assign(centerCol.style,{ 
      display:'grid', 
      gap:'6px', 
      justifyItems:'center',
      overflow: 'visible' // Allow skin button to be visible
    } as CSSStyleDeclaration);
    centerCol.append(nameWrap, modesRow, midInfo);

    // Right column: will contain coins (absolute on card) and Match Results at bottom-left
    const rightCol = document.createElement('div'); Object.assign(rightCol.style,{ display:'grid', gap:'8px', justifyItems:'start', alignItems:'end', height:'100%' } as CSSStyleDeclaration);
    ;(this as any).rightCol = rightCol;

    triRow.append(leftCol, centerCol, rightCol);

    // Assemble (compact)
    form.replaceChildren(title, triRow);
    grid.append(form);

    // Match Results card goes to right column, bottom-left
    const results = document.createElement('div');
    Object.assign(results.style, { position:'static', width:'260px', padding:'12px', borderRadius:'14px', background:'rgba(255,255,255,0.90)', color:'#123', boxShadow:'0 12px 28px rgba(0,0,0,.25)', margin:'0' } as CSSStyleDeclaration);
    results.innerHTML = `
      <div style="font-weight:900; margin:2px 0 8px;">Letztes Match:</div>
      <div style="font-size:14px; line-height:1.65" id="match-results-content">
        Noch kein Match gespielt
      </div>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <button id="btn-records" style="flex:1; padding:8px 10px; border:0; border-radius:10px; background:#8b5cf6; color:#fff; font-weight:800; cursor:pointer">Rekorde</button>
        <button style="flex:1; padding:8px 10px; border:0; border-radius:10px; background:#1da1f2; color:#fff; font-weight:800; cursor:pointer">t Share</button>
      </div>
    `;
    ;(this as any).resultsCard = results as HTMLDivElement;
    
    // Update match results display
    this.updateMatchResults();
    
    rightCol.append(results);

    // Hook Rekorde button
    setTimeout(()=>{
      const btn = results.querySelector('#btn-records') as HTMLButtonElement | null;
      if (btn){ btn.onclick = ()=> this.openRecordsOverlay(); }
    }, 0);

    // Remove old bottom bar and absolute append; just append grid and hidden startBtn
    card.replaceChildren(grid, this.startBtn);
    // Append controls and coin badges to the card so they anchor to corners
    card.appendChild(this.musicBtn!);
    card.appendChild(this.fsBtn!);
    card.appendChild(this.coinEl!);

    this.root.append(this.bgCanvas, card);

    // Align the name input left edge with the title text left edge
    const alignNow = ()=> this.alignNameUnderTitle();
    requestAnimationFrame(alignNow);
    window.addEventListener('resize', alignNow);

    // iOS Safari: suggest Add to Home Screen for true fullscreen once
    try {
      const ua = navigator.userAgent || '';
      const isIOSSafari = /iPhone|iPad|iPod/.test(ua) && /Safari\//.test(ua) && !/CriOS|FxiOS|OPiOS/.test(ua);
      const key = 'iosA2HSuggested';
      const isStandalone = (navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
      if (isIOSSafari && !isStandalone && !localStorage.getItem(key)){
        const tip = document.createElement('div');
        Object.assign(tip.style, { position:'fixed', left:'50%', bottom:'18px', transform:'translateX(-50%)', zIndex:'141', padding:'8px 12px', borderRadius:'12px', background:'rgba(0,0,0,0.70)', color:'#fff', font:'700 12px system-ui, sans-serif' } as CSSStyleDeclaration);
        tip.textContent = 'Tipp: Über das Teilen-Menü “Zum Home-Bildschirm” für echtes Vollbild.';
        document.body.appendChild(tip);
        localStorage.setItem(key,'1');
        setTimeout(()=>{ try{ tip.remove(); }catch{} }, 6000);
      }
    } catch {}

    // iPhone Chrome: ask for fullscreen and landscape once
    try {
      const ua = navigator.userAgent || '';
      const isIOSChrome = /iPhone|iPod/.test(ua) && /CriOS/.test(ua);
      const askedKey = 'iosChromeFullscreenAsked';
      if (isIOSChrome && !localStorage.getItem(askedKey)){
        const overlay = document.createElement('div');
        Object.assign(overlay.style, { position:'fixed', inset:'0', zIndex:'140', display:'grid', placeItems:'center', background:'rgba(0,0,0,0.55)' } as CSSStyleDeclaration);
        const card = document.createElement('div');
        Object.assign(card.style, { width:'min(420px, 94vw)', padding:'16px', borderRadius:'14px', background:'rgba(8,10,28,0.92)', color:'#fff', backdropFilter:'blur(8px)', boxShadow:'0 20px 40px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,0.06)' } as CSSStyleDeclaration);
        const h = document.createElement('div'); h.textContent = 'Optimiertes Vollbild?'; Object.assign(h.style,{ fontWeight:'900', fontSize:'18px', marginBottom:'8px' } as CSSStyleDeclaration);
        const p = document.createElement('div'); p.innerHTML = 'Auf iPhone in Chrome sind echte Vollbild-/Dreh-APIs eingeschränkt. Wir können ein pseudo-Vollbild aktivieren und empfehlen für echtes Vollbild: <b>In Safari öffnen</b> und "Zum Home-Bildschirm".'; Object.assign(p.style,{ opacity:'0.9', marginBottom:'12px' } as CSSStyleDeclaration);
        const row = document.createElement('div'); Object.assign(row.style,{ display:'flex', gap:'10px', justifyContent:'flex-end' } as CSSStyleDeclaration);
        const cancel = document.createElement('button'); cancel.textContent='Später'; Object.assign(cancel.style,{ padding:'8px 12px', border:'0', borderRadius:'10px', background:'#334155', color:'#fff', cursor:'pointer', fontWeight:'800' } as CSSStyleDeclaration);
        const ok = document.createElement('button'); ok.textContent='Jetzt optimieren'; Object.assign(ok.style,{ padding:'8px 12px', border:'0', borderRadius:'10px', background:'#34d399', color:'#052', cursor:'pointer', fontWeight:'900' } as CSSStyleDeclaration);
        cancel.onclick = ()=>{ localStorage.setItem(askedKey,'1'); overlay.remove(); };
        ok.onclick = async ()=>{
          localStorage.setItem(askedKey,'1');
          // Pseudo-Fullscreen for iOS Chrome: use 100dvh, hide scrollbars, nudge scroll to hide URL bar.
          try {
            const root = document.documentElement as HTMLElement;
            Object.assign(root.style as any, { height:'100dvh' });
            Object.assign(document.body.style as any, { height:'100dvh', overflow:'hidden', background:'#000' });
            const gameEl = document.getElementById('game') as HTMLCanvasElement | null;
            if (gameEl){ Object.assign(gameEl.style as any, { width:'100vw', height:'100dvh', display:'block' }); }
            // Nudge scroll to hide chrome bars
            const nudge = ()=>{ try{ window.scrollTo(0, 1); }catch{} };
            nudge(); setTimeout(nudge, 50); setTimeout(nudge, 250);
            window.addEventListener('orientationchange', ()=> setTimeout(nudge, 200));
            window.addEventListener('resize', ()=> setTimeout(nudge, 200));
          } catch {}
          // One-time tip overlay about Safari/Home Screen
          try {
            const tip = document.createElement('div');
            Object.assign(tip.style, { position:'fixed', left:'50%', bottom:'18px', transform:'translateX(-50%)', zIndex:'141', padding:'8px 12px', borderRadius:'12px', background:'rgba(0,0,0,0.70)', color:'#fff', font:'700 12px system-ui, sans-serif' } as CSSStyleDeclaration);
            tip.textContent = 'Für echtes Vollbild: In Safari öffnen und \'Zum Home-Bildschirm\' hinzufügen.';
            document.body.appendChild(tip);
            setTimeout(()=>{ try{ tip.remove(); }catch{} }, 5000);
          } catch {}
          overlay.remove();
        };
        row.append(cancel, ok); card.append(h, p, row); overlay.append(card);
        document.body.appendChild(overlay);
      }
    } catch {}

    // Hidden offscreen preview canvas (for any rendering needs)
    this.preview = document.createElement('canvas');
    this.preview.width = 200; this.preview.height = 200; this.preview.style.display = 'none';

    this.updatePreview();
    this.updateSkinThumb();
    this.updateAccountBadge();

    // Initialize XP UI and hook updates
    try {
      const prog = getUiProgress();
      (this as any).setXP(prog.value, prog.max, getState().level);
      setHooks({
        onXpGain: ()=>{ try{ const p = getUiProgress(); (this as any).setXP(p.value, p.max, getState().level); }catch{} },
        onLevelUp: (lvl)=>{ try{ const p = getUiProgress(); (this as any).setXP(p.value, p.max, lvl); }catch{} }
      });
    } catch {}

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

  private updateSkinThumb(){
    if (!this.skinThumb) return;
    const c = this.skinThumb; const g = c.getContext('2d'); if (!g) return;
    g.imageSmoothingEnabled = true; (g as any).imageSmoothingQuality = 'high';
    g.clearRect(0,0,c.width,c.height);
    g.save(); g.beginPath(); g.arc(c.width/2, c.height/2, Math.min(c.width,c.height)/2, 0, Math.PI*2); g.clip();
    try { g.drawImage(this.currentSkinCanvas, 0, 0, c.width, c.height); } catch {}
    g.restore();
    // outer subtle ring
    g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.arc(c.width/2, c.height/2, Math.min(c.width,c.height)/2 - 1, 0, Math.PI*2); g.stroke();
    this.updateAccountBadge();
  }

  private updateAccountBadge(){
    try {
      const c = this.userBadgeCanvas; if (!c) return; const g = c.getContext('2d'); if (!g) return;
      g.imageSmoothingEnabled = true; (g as any).imageSmoothingQuality = 'high';
      g.clearRect(0,0,c.width,c.height);
      const r = Math.min(c.width, c.height)/2;
      g.save(); g.beginPath(); g.arc(c.width/2, c.height/2, r, 0, Math.PI*2); g.clip();
      g.drawImage(this.currentSkinCanvas, 0, 0, c.width, c.height);
      g.restore();
      g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.arc(c.width/2, c.height/2, r-1, 0, Math.PI*2); g.stroke();
    } catch {}
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
    const isTablet = (navigator.maxTouchPoints && (navigator.maxTouchPoints as number) > 0) && (W >= 820 && W <= 1200);
    const narrowForResults = W < 1060;

    // More compact card
    Object.assign(this.card.style, {
      width: isMobile ? 'min(640px, 94vw)' : 'min(980px, 92vw)',
      borderRadius: isMobile ? '16px' : '18px'
    } as CSSStyleDeclaration);

    if (isMobile) {
      Object.assign(this.card.style, { paddingTop:'56px', paddingRight:'14px', paddingBottom:'24px', paddingLeft:'14px' } as CSSStyleDeclaration);
    } else {
      Object.assign(this.card.style, { paddingTop:'60px', paddingRight:'18px', paddingBottom:'32px', paddingLeft:'18px' } as CSSStyleDeclaration);
    }

    const triRow = (this as any).triRow as HTMLDivElement | undefined;
    if (triRow){
      if (isMobile){
        Object.assign(triRow.style, { gridTemplateColumns:'1fr', gap:'12px', alignItems:'stretch' } as CSSStyleDeclaration);
        // order: center first, then left, then right
        const [leftCol, centerCol, rightCol] = [ (this as any).leftCol, triRow.children[1], (this as any).rightCol ] as any[];
        if (leftCol && rightCol){
          (centerCol as HTMLElement).style.order = '1';
          (leftCol as HTMLElement).style.order = '2';
          (rightCol as HTMLElement).style.order = '3';
          Object.assign(leftCol.style, { justifyItems:'center' } as CSSStyleDeclaration);
          Object.assign(rightCol.style, { justifyItems:'start', alignItems:'start', height:'auto' } as CSSStyleDeclaration);
        }
      } else {
        Object.assign(triRow.style, { gridTemplateColumns:'auto 1fr auto', gap:'16px', alignItems:'stretch' } as CSSStyleDeclaration);
        const [leftCol, centerCol, rightCol] = [ (this as any).leftCol, triRow.children[1], (this as any).rightCol ] as any[];
        if (leftCol && rightCol){
          (centerCol as HTMLElement).style.order = '2';
          (leftCol as HTMLElement).style.order = '1';
          (rightCol as HTMLElement).style.order = '3';
          Object.assign(leftCol.style, { justifyItems:'start' } as CSSStyleDeclaration);
          Object.assign(rightCol.style, { justifyItems:'start', alignItems:'end', height:'100%' } as CSSStyleDeclaration);
        }
      }
    }

    // Shift title 30px to the left
    if (this.titleEl) { (this.titleEl.style as any).transform = 'translateX(-30px)'; }

    const modesRow = (this as any).modesRow as HTMLDivElement; if (modesRow){ Object.assign(modesRow.style, { gridTemplateColumns: 'auto auto auto auto', width: 'auto', justifyContent: 'center', gap: isMobile ? '8px' : '10px', margin: '8px auto 0' } as CSSStyleDeclaration); modesRow.style.transform = 'translateX(115px)'; }
    const skinsBtn = (this as any).skinsBtn as HTMLButtonElement; if (skinsBtn){ Object.assign(skinsBtn.style, { left: isMobile ? '-54px' : '-60px' } as CSSStyleDeclaration); }
    const midInfo = (this as any).midInfo as HTMLDivElement | undefined; if (midInfo){ midInfo.style.transform = 'translateX(115px)'; }
    Object.assign(this.nameInput.style, { fontSize: isMobile ? '14px' : '15px', padding: isMobile ? '10px 12px' : '11px 14px' } as CSSStyleDeclaration);

    const results = (this as any).resultsCard as HTMLDivElement;
    if (results) {
      Object.assign(results.style, { position:'static', width: isMobile ? 'min(320px, 88vw)' : '260px', margin:'0' } as CSSStyleDeclaration);
    }

    // scale action buttons for touch devices (phone/tablet)
    try{
      const startBtnVis = this.root.querySelector('button[title="Start"]') as HTMLButtonElement | null;
      if (startBtnVis){ const size = isMobile ? 72 : isTablet ? 64 : 56; Object.assign(startBtnVis.style, { width: `${size}px`, height: `${size}px`, fontSize: isMobile ? '18px' : '14px' } as CSSStyleDeclaration); }
      const shopBtn = this.root.querySelector('button[title="Shop"]') as HTMLButtonElement | null;
      if (shopBtn){ const s = isMobile ? 64 : isTablet ? 60 : 56; Object.assign(shopBtn.style, { width: `${s}px`, height: `${s}px` } as CSSStyleDeclaration); }
      const giftsBtn = this.root.querySelector('button[title="Gifts"]') as HTMLButtonElement | null;
      if (giftsBtn){ const s = isMobile ? 64 : isTablet ? 60 : 56; Object.assign(giftsBtn.style, { width: `${s}px`, height: `${s}px` } as CSSStyleDeclaration); }
      if (skinsBtn){ Object.assign(skinsBtn.style, { left: isMobile ? '-70px' : isTablet ? '-66px' : '-60px', width: isMobile ? '56px' : '44px', height: isMobile ? '56px' : '44px' } as CSSStyleDeclaration); }
    }catch{}

    // realign after layout changes

    // If touch device on phone/tablet enforce landscape fullscreen UX
    if ((isMobile || isTablet) && this.isTouchDevice()){
      this.ensureMobileLandscapeOverlay();
    } else {
      this.removeMobileLandscapeOverlay();
    }

    this.alignNameUnderTitle();
  }

  private alignNameUnderTitle(){
    try {
      const titleSpan = this.titleTextEl;
      const form = this.titleEl.parentElement as HTMLElement | null;
      const wrap = this.nameWrapEl;
      if (!titleSpan || !form || !wrap) return;
      const tRect = titleSpan.getBoundingClientRect();
      const fRect = form.getBoundingClientRect();
      let left = Math.round(tRect.left - fRect.left) - 115; // shift textbox 115px left (20px + 95px)
      // Clamp to card width to avoid pushing off-screen
      const maxLeft = Math.max(0, (this.card.clientWidth || 0) - (wrap.clientWidth || 0) - 20);
      if (!isFinite(left) || left < 0) left = 0;
      left = Math.min(left, maxLeft);
      wrap.style.marginLeft = left + 'px';
    } catch {}
  }

  // Ensure overlays appended after the start menu are visible above it
  private bringLastOverlayToFront(){
    try{
      const children = Array.from(document.body.children);
      // iterate from the end to find the most recently appended overlay that is not this.root
      for (let i = children.length - 1; i >= 0; i--) {
        const el = children[i] as HTMLElement;
        if (el === this.root) continue;
        const st = getComputedStyle(el);
        if (st.position === 'fixed' || st.position === 'absolute'){
          // raise overlay above the menu
          try { el.style.zIndex = '2100'; el.style.pointerEvents = 'auto'; } catch {};
          break;
        }
      }
    }catch{}
  }

  // detect touch capability
  private isTouchDevice(): boolean {
    try {
      const hasTouch = (typeof window !== 'undefined' && 'ontouchstart' in window) || ((navigator && (navigator as any).maxTouchPoints) ? (navigator as any).maxTouchPoints > 0 : false);
      return !!hasTouch;
    } catch { return false; }
  }

  private mobileOverlayEl?: HTMLDivElement;
  private mobileOverlayCleanup?: ()=>void;

  // Show a rotate-to-landscape + fullscreen prompt on phones/tablets
  private ensureMobileLandscapeOverlay(){
    try{
      // If overlay exists, update visibility based on current orientation
      const isLandscape = window.innerWidth > window.innerHeight;
      if (isLandscape){ this.removeMobileLandscapeOverlay(); return; }
      if (this.mobileOverlayEl) return; // already shown

      const overlay = document.createElement('div');
      Object.assign(overlay.style, { 
        position:'fixed', 
        inset:'0', 
        zIndex:'4000', 
        display:'grid', 
        placeItems:'center', 
        background:'rgba(0,0,0,0.85)', 
        color:'#fff', 
        textAlign:'center', 
        padding:'20px',
        backdropFilter: 'blur(10px)'
      } as CSSStyleDeclaration);
      
      const card = document.createElement('div'); 
      Object.assign(card.style, { 
        width:'min(560px, 92vw)', 
        padding:'20px', 
        borderRadius:'14px', 
        background:'rgba(8,10,28,0.95)', 
        boxShadow:'0 30px 60px rgba(0,0,0,.6)', 
        fontFamily:'system-ui, sans-serif',
        border: '1px solid rgba(255,255,255,0.1)'
      } as CSSStyleDeclaration);
      
      const h = document.createElement('div'); 
      h.textContent = '📱 Querformat für beste Performance'; 
      Object.assign(h.style, { 
        fontWeight:'900', 
        fontSize:'22px', 
        marginBottom:'12px',
        background: 'linear-gradient(90deg,#9af,#a6f,#6ff,#aff)'
      } as CSSStyleDeclaration);
      // Apply webkit properties separately to avoid TypeScript issues
      (h.style as any).webkitBackgroundClip = 'text';
      (h.style as any).webkitTextFillColor = 'transparent';
      
      const p = document.createElement('div'); 
      p.innerHTML = 'Für flüssiges 60fps Gameplay drehe dein Gerät ins <strong>Querformat</strong> und aktiviere den Vollbildmodus.'; 
      Object.assign(p.style, { 
        opacity:'0.9', 
        marginBottom:'16px',
        lineHeight: '1.5'
      } as CSSStyleDeclaration);
      
      const row = document.createElement('div'); 
      Object.assign(row.style, { 
        display:'flex', 
        gap:'12px', 
        justifyContent:'center',
        flexWrap: 'wrap'
      } as CSSStyleDeclaration);
      
      const btnFs = document.createElement('button'); 
      btnFs.innerHTML = '🚀 Vollbild & Optimieren'; 
      Object.assign(btnFs.style, { 
        padding:'12px 16px', 
        borderRadius:'12px', 
        border:'0', 
        cursor:'pointer', 
        fontWeight:'800', 
        background:'linear-gradient(45deg, #34d399, #10b981)', 
        color:'#fff',
        fontSize: '16px',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
        transition: 'transform 0.2s ease'
      } as CSSStyleDeclaration);
      
      btnFs.onclick = async ()=>{
        try{
          const rootAny: any = document.documentElement;
          if (rootAny.requestFullscreen) await rootAny.requestFullscreen(); 
          else if ((rootAny as any).webkitRequestFullscreen) (rootAny as any).webkitRequestFullscreen();
          
          // Set mobile optimization hint
          sessionStorage.setItem('mobileOptimized', 'true');
        }catch{}
        
        setTimeout(()=>{
          if (window.innerWidth > window.innerHeight){ this.removeMobileLandscapeOverlay(); }
        }, 500);
      };
      
      const btnClose = document.createElement('button'); 
      btnClose.innerHTML = '📱 Trotzdem spielen'; 
      Object.assign(btnClose.style, { 
        padding:'12px 16px', 
        borderRadius:'12px', 
        border:'1px solid rgba(255,255,255,0.2)', 
        cursor:'pointer', 
        fontWeight:'700', 
        background:'rgba(255,255,255,0.1)', 
        color:'#fff',
        fontSize: '14px'
      } as CSSStyleDeclaration);
      
      btnClose.onclick = ()=>{ 
        this.removeMobileLandscapeOverlay();
        sessionStorage.setItem('mobileOptimized', 'basic');
      };
      
      row.append(btnFs, btnClose);
      card.append(h, p, row);
      overlay.append(card);
      document.body.appendChild(overlay);
      this.mobileOverlayEl = overlay;

      const onChange = ()=>{
        if (window.innerWidth > window.innerHeight){ this.removeMobileLandscapeOverlay(); }
      };
      window.addEventListener('resize', onChange);
      window.addEventListener('orientationchange', onChange);
      this.mobileOverlayCleanup = ()=>{ window.removeEventListener('resize', onChange); window.removeEventListener('orientationchange', onChange); };
    }catch{}
  }

  private removeMobileLandscapeOverlay(){
    try{
      if (this.mobileOverlayCleanup) { this.mobileOverlayCleanup(); this.mobileOverlayCleanup = undefined; }
      if (this.mobileOverlayEl){ try{ this.mobileOverlayEl.remove(); }catch{}; this.mobileOverlayEl = undefined; }
    }catch{}
  }

  show(){
    // bring to front and ensure visible
    try { document.body.appendChild(this.root); } catch {}
    this.root.style.display = 'grid';
    this.root.style.pointerEvents = 'auto';

    // Ensure layout and alignment run now the element is attached
    requestAnimationFrame(() => {
      try {
        // Recompute layout and text alignment now that elements are in the DOM
        this.updateLayout();
        this.alignNameUnderTitle();
        // Ensure interactive buttons receive pointer events and sit above background
        const skinsBtn = (this as any).skinsBtn as HTMLButtonElement | undefined;
        if (skinsBtn) {
          skinsBtn.style.pointerEvents = 'auto';
          skinsBtn.style.zIndex = '2100';
        }
        const shopBtn = this.root.querySelector('button[title="Shop"]') as HTMLButtonElement | null;
        if (shopBtn) { shopBtn.style.pointerEvents = 'auto'; shopBtn.style.zIndex = '2100'; }
      } catch (err) { /* ignore */ }
    });

    // restart background animation when shown
    if (!this.bgActive) this.loopBg();
    // update match results display
    this.updateMatchResults();
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

  updateMatchResults() {
    const resultsDiv = this.root.querySelector('#match-results-content') as HTMLDivElement;
    if (!resultsDiv) return;
    
    try {
      // Get last match results from localStorage
      const stored = localStorage.getItem('lastMatchResults');
      if (stored) {
        const lastMatch = JSON.parse(stored);
        const xpTotal = lastMatch.xpBreakdown?.total || 0;
        
        resultsDiv.innerHTML = `
          <div style="font-weight:800; color:#059669;">Masse erreicht: ${Math.round(lastMatch.maxMass)}</div>
          <div style="font-weight:800; color:#7c3aed; margin-top:4px;">XP verdient: +${xpTotal}</div>
          <div style="opacity:0.7; font-size:12px; margin-top:4px;">
            Überlebt: ${Math.round(lastMatch.survivedSec)}s | Rang: ${lastMatch.rank || '?'}
          </div>
        `;
      } else {
        resultsDiv.innerHTML = 'Noch kein Match gespielt';
      }
    } catch (err) {
      resultsDiv.innerHTML = 'Noch kein Match gespielt';
    }
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
        meta.innerHTML = `<div style="font-weight:800">Max Masse: ${Math.round(rec.maxMass)}</div><div style=\"opacity:.85\">Überlebt: ${Math.round(rec.survivedSec)}s</div>`;
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
    if (this.coinEl){
      const span = this.coinEl.querySelector('span');
      if (span) span.textContent = String(this.getCoins());
    }
  }
}

// Simple SVG sprite factory (no emojis)
function makeSprite(kind: 'volume-on'|'volume-off'|'fullscreen'|'coin'|'cart'|'gift'|'user'|'palette') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  const bg = '#0b0f12';
  const accent = '#ffd54a';
  if (kind === 'volume-on' || kind === 'volume-off') {
    const body = document.createElementNS(ns, 'path');
    body.setAttribute('d', 'M3 10v4h4l5 4V6L7 10H3z');
    body.setAttribute('fill', bg);
    svg.appendChild(body);
    if (kind === 'volume-on') {
      const wave1 = document.createElementNS(ns, 'path');
      wave1.setAttribute('d', 'M14 9c1.5 1 1.5 5 0 6');
      wave1.setAttribute('stroke', bg);
      wave1.setAttribute('stroke-width', '2');
      wave1.setAttribute('fill', 'none');
      const wave2 = document.createElementNS(ns, 'path');
      wave2.setAttribute('d', 'M16.5 7.5c2.5 2 2.5 7 0 9');
      wave2.setAttribute('stroke', bg);
      wave2.setAttribute('stroke-width', '2');
      wave2.setAttribute('fill', 'none');
      wave1.setAttribute('stroke-linecap', 'round');
      wave2.setAttribute('stroke-linecap', 'round');
      svg.append(wave1, wave2);
    }
  } else if (kind === 'fullscreen') {
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', 'M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z');
    p.setAttribute('fill', bg);
    svg.appendChild(p);
  } else if (kind === 'coin') {
    const c1 = document.createElementNS(ns, 'circle'); c1.setAttribute('cx','12'); c1.setAttribute('cy','12'); c1.setAttribute('r','9'); c1.setAttribute('fill', accent);
    const c2 = document.createElementNS(ns, 'circle'); c2.setAttribute('cx','12'); c2.setAttribute('cy','12'); c2.setAttribute('r','7'); c2.setAttribute('fill', '#ffe17a');
    const line = document.createElementNS(ns, 'rect'); line.setAttribute('x','8'); line.setAttribute('y','11'); line.setAttribute('width','8'); line.setAttribute('height','2'); line.setAttribute('rx','1'); line.setAttribute('fill', '#b88b09');
    svg.append(c1, c2, line);
  } else if (kind === 'cart') {
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', 'M3 5h2l1.5 9h9l2-6H7');
    p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#fff'); p.setAttribute('stroke-width', '2'); p.setAttribute('stroke-linecap','round'); p.setAttribute('stroke-linejoin','round');
    const w1 = document.createElementNS(ns, 'circle'); w1.setAttribute('cx','10'); w1.setAttribute('cy','18'); w1.setAttribute('r','1.5'); w1.setAttribute('fill','#fff');
    const w2 = document.createElementNS(ns, 'circle'); w2.setAttribute('cx','16'); w2.setAttribute('cy','18'); w2.setAttribute('r','1.5'); w2.setAttribute('fill','#fff');
    svg.append(p, w1, w2);
  } else if (kind === 'gift') {
    const box = document.createElementNS(ns, 'rect'); box.setAttribute('x','4'); box.setAttribute('y','10'); box.setAttribute('width','16'); box.setAttribute('height','10'); box.setAttribute('rx','1.5'); box.setAttribute('fill','#fff');
    const lid = document.createElementNS(ns, 'rect'); lid.setAttribute('x','3'); lid.setAttribute('y','8'); lid.setAttribute('width','18'); lid.setAttribute('height','3'); lid.setAttribute('rx','1'); lid.setAttribute('fill','#dbeafe');
    const rib = document.createElementNS(ns, 'rect'); rib.setAttribute('x','11'); rib.setAttribute('y','8'); rib.setAttribute('width','2'); rib.setAttribute('height','12'); rib.setAttribute('fill','#93c5fd');
    const bowL = document.createElementNS(ns, 'path'); bowL.setAttribute('d','M12 8c-1-2-3-3-5-2 2 2 3 3 5 2z'); bowL.setAttribute('fill','#93c5fd');
    const bowR = document.createElementNS(ns, 'path'); bowR.setAttribute('d','M12 8c1-2 3-3 5-2 -2 2 -3 3 -5 2z'); bowR.setAttribute('fill','#93c5fd');
    svg.append(box,lid,rib,bowL,bowR);
  } else if (kind === 'user') {
    const body = document.createElementNS(ns, 'path');
    body.setAttribute('d', 'M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z');
    body.setAttribute('fill', bg);
    svg.appendChild(body);
  } else if (kind === 'palette') {
    // draw a simple painter palette + brush
    const pal = document.createElementNS(ns, 'path');
    pal.setAttribute('d','M12 3c-4.97 0-9 3.58-9 8 0 3.08 2.2 4 4 4h2c1.1 0 2 .9 2 2 0 1.1.9 2 2 2 2.76 0 5-2.24 5-5 0-6-3.5-11-6-11z');
    pal.setAttribute('fill','#e5e7eb');
    const d1 = document.createElementNS(ns,'circle'); d1.setAttribute('cx','9'); d1.setAttribute('cy','9'); d1.setAttribute('r','1'); d1.setAttribute('fill','#f87171');
    const d2 = document.createElementNS(ns,'circle'); d2.setAttribute('cx','12'); d2.setAttribute('cy','7.5'); d2.setAttribute('r','1'); d2.setAttribute('fill','#60a5fa');
    const d3 = document.createElementNS(ns,'circle'); d3.setAttribute('cx','14.5'); d3.setAttribute('cy','10'); d3.setAttribute('r','1'); d3.setAttribute('fill','#34d399');
    const brush = document.createElementNS(ns,'path'); brush.setAttribute('d','M18 14l-6 6 1.5-4.5L18 14z'); brush.setAttribute('fill','#9ca3af');
    svg.append(pal,d1,d2,d3,brush);
  }
  return svg;
}
