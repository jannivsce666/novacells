// main.ts
import { Game } from './game';
import { bindInput, getInput, setMusicManager } from './input';
import { StartMenu } from './startMenu';
import { MusicManager } from './musicManager';
import { addRecord } from './records';

// Also push to cloud leaderboard (top 10 maintained server-side)
import { pushRecordToCloud } from './recordsCloud';
import { auth, onAuthStateChanged } from './firebase';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = new Game(canvas);

// Music
const musicManager = new MusicManager();
// Do not auto-start on load to respect mobile autoplay policies; will start after first gesture or via UI
// musicManager.start();

bindInput(canvas);
setMusicManager(musicManager);

let currentSkinCanvas: HTMLCanvasElement | undefined;

const menu = new StartMenu({
  onStart: (cfg)=>{
    currentSkinCanvas = cfg.skinCanvas as HTMLCanvasElement | undefined;

    // Connect to WS server and announce join
    try {
      const wsUrl = (location.origin.replace(/^http/, 'ws'));
      const ws = new WebSocket(wsUrl);
      (window as any).ncWs = ws; // debug handle
      ws.addEventListener('open', ()=>{
        const name = cfg.name || 'Player';
        ws.send(JSON.stringify({ type: 'join', name }));
      });
      ws.addEventListener('message', (ev)=>{
        // Placeholder: future sync logic
        // console.log('ws message', ev.data);
      });
      ws.addEventListener('close', ()=>{
        // console.log('ws closed');
      });
      ws.addEventListener('error', ()=>{
        // console.warn('ws error');
      });
    } catch {}

    // Start a completely fresh round; spawnPlayers clears roster and sets exact bot count
    game.spawnPlayers(69, cfg);
  },
  musicManager
});
// menu.show(); // moved to after preloader

// Mobile preloader overlay: rainbow spinner + "Gleich geht´s los !" and preload premium skins
(async function mobilePreloaderThenShow(){
  const ua = navigator.userAgent || '';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  if (!isMobile) { menu.show(); return; }

  // Create overlay
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:'fixed', inset:'0', zIndex:'200', display:'grid', placeItems:'center',
    background:'linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.75))', color:'#fff'
  } as CSSStyleDeclaration);
  const box = document.createElement('div');
  Object.assign(box.style, {
    display:'grid', placeItems:'center', gap:'12px', padding:'20px',
    borderRadius:'16px', background:'rgba(8,10,28,0.88)', backdropFilter:'blur(8px)',
    boxShadow:'0 24px 48px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,0.06)'
  } as CSSStyleDeclaration);

  const spinner = document.createElement('div');
  Object.assign(spinner.style as any, {
    width:'96px', height:'96px', borderRadius:'50%',
    background:'conic-gradient(#ff004c, #ff7a00, #ffe600, #21ff00, #00eaff, #7a00ff, #ff00ea, #ff004c)',
    WebkitMask:'radial-gradient(circle 40px at 50% 50%, transparent 60%, black 61%)',
    mask:'radial-gradient(circle 40px at 50% 50%, transparent 60%, black 61%)',
    animation:'nc-spin 1.2s linear infinite'
  });
  const style = document.createElement('style');
  style.textContent = '@keyframes nc-spin { to { transform: rotate(360deg); } }';

  const label = document.createElement('div');
  label.textContent = 'Gleich geht´s los !';
  Object.assign(label.style, { font:'900 16px system-ui, sans-serif', letterSpacing:'0.4px' } as CSSStyleDeclaration);

  box.append(spinner, label); overlay.append(style, box); document.body.appendChild(overlay);

  // Prefetch premium skins (shop assets)
  async function prefetchSkins(){
    const urls: string[] = [];
    try {
      const globbed = (import.meta as any).glob('./premium/*.{png,jpg,jpeg,webp,svg}', { eager:true, as:'url' }) as Record<string,string>;
      for (const u of Object.values(globbed)) urls.push(u as string);
    } catch {}
    try {
      const globbed2 = (import.meta as any).glob('./shop/skins/*.{png,jpg,jpeg,webp,svg}', { eager:true, as:'url' }) as Record<string,string>;
      for (const u of Object.values(globbed2)) urls.push(u as string);
    } catch {}
    if (urls.length===0) return;
    await Promise.all(urls.map(u=> new Promise<void>((res)=>{ const img = new Image(); img.crossOrigin='anonymous'; img.onload=()=>res(); img.onerror=()=>res(); img.src=u; })));
  }

  try { await prefetchSkins(); } catch {}
  overlay.remove();
  menu.show();
})();

// Sync coins and best record on login
onAuthStateChanged(auth, async (user)=>{
  if (!user) return;
  try {
    const { fetchUserCoins, getUserBestMax } = await import('./recordsCloud');
    const coins = await fetchUserCoins(user.uid);
    const best = await getUserBestMax(user.uid);
    // update StartMenu coin UI if available
    try { (menu as any).setCoins?.(coins); } catch {}
    // update results card snippet (best mass)
    try {
      const results = (menu as any).resultsCard as HTMLDivElement | undefined;
      if (results){
        const metaDiv = results.querySelector('div:nth-child(2)') as HTMLDivElement | null;
        if (metaDiv && best > 0){
          metaDiv.innerHTML = `<div style="font-weight:800">Max Masse (Cloud): ${Math.round(best)}</div>`;
        }
      }
    } catch {}
  } catch {}
});

function awardCoinsForScore(maxMass:number): number {
  const m = Math.floor(maxMass);
  if (m < 100) return 10;                   // <100 => 10 coins
  if (m >= 500 && m <= 1000) return 100;    // 500..1000 => 100 coins
  if (m >= 1001 && m <= 5000) return 500;   // 1001..5000 => 500 coins
  if (m >= 5001 && m <= 10000) return 2000; // 5001..10000 => 2000 coins
  if (m > 10000) {
    const extra = Math.floor((m - 10000) / 100) * 10; // +10 per +100 beyond 10k
    return 2000 + extra;
  }
  return 0; // 100..499 (unspecified) => 0 coins
}

game.onGameOver = (stats)=>{
  // Save record with current skin preview (top 10 handled by records module)
  try {
    const skinUrl = currentSkinCanvas ? currentSkinCanvas.toDataURL('image/png') : undefined;
    const rec = { skinDataUrl: skinUrl || '', maxMass: stats.maxMass, survivedSec: stats.survivedSec, ts: Date.now() };
    addRecord(rec);

    // Push to cloud as well (best-effort)
    const user = auth.currentUser;
    pushRecordToCloud({ ...rec, uid: user?.uid, name: user?.displayName || undefined });
    // NEW: save to the user's own records list if logged in
    if (user?.uid) {
      import('./recordsCloud')
        .then(m => m.pushUserRecord(user.uid!, rec))
        .catch(()=>{});
    }

    // Coins award
    const coinsGain = awardCoinsForScore(stats.maxMass);
    try { (menu as any).setCoins?.(((menu as any).getCoins?.() ?? 0) + coinsGain); } catch {}

    // Persist coins to cloud if logged in
    const u = auth.currentUser;
    if (u?.uid) {
      import('./recordsCloud')
        .then(async m => {
          const current = await m.fetchUserCoins(u.uid!);
          await m.setUserCoins(u.uid!, current + coinsGain);
          // update profile best max
          await m.setUserBestMax(u.uid!, stats.maxMass);
        })
        .catch(()=>{});
    }
  } catch {}
  // Music keeps playing per requirements
  showGameOver(stats as any);
};

function showGameOver(stats:any){
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:'fixed', inset:'0', display:'grid', placeItems:'center',
    background:'linear-gradient(180deg, rgba(0,0,0,.40), rgba(0,0,0,.60))',
    zIndex:'30', color:'#fff'
  } as CSSStyleDeclaration);

  const card = document.createElement('div');
  Object.assign(card.style, {
    width:'min(520px, 92vw)', borderRadius:'18px', padding:'20px 20px 24px',
    background:'rgba(10,14,38,0.75)', backdropFilter:'blur(10px)',
    boxShadow:'0 30px 60px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,0.06)',
    textAlign:'center'
  } as CSSStyleDeclaration);

  const h = document.createElement('h2');
  h.textContent = 'GAME OVER';
  Object.assign(h.style,{margin:'0 0 12px', fontSize:'34px', letterSpacing:'2px'} as CSSStyleDeclaration);

  const p = document.createElement('div');
  p.innerHTML = `Max Größe: <b>${stats.maxMass}</b><br/>Zeit: <b>${stats.survivedSec}s</b><br/>Platzierung: <b>${stats.rank}</b>`;

  const row = document.createElement('div');
  Object.assign(row.style,{display:'flex', gap:'10px', marginTop:'14px', justifyContent:'center'} as CSSStyleDeclaration);

  const again = document.createElement('button');
  again.textContent = 'NOCHMAL';
  styleBtn(again, '#7ff');
  again.onclick = ()=>{ overlay.remove(); game.resetRound(); };

  const back = document.createElement('button');
  back.textContent = 'MENÜ';
  styleBtn(back, '#ffb');
  back.onclick = ()=>{ overlay.remove(); menu.show(); };

  row.append(again, back);
  card.append(h, p, row);
  overlay.append(card);
  document.body.appendChild(overlay);
}

function styleBtn(btn:HTMLButtonElement, color:string){
  Object.assign(btn.style, {
    padding:'12px 16px', border:'0', borderRadius:'12px', fontWeight:'900',
    background:`linear-gradient(90deg, ${color}, #fff)`, color:'#023', cursor:'pointer'
  } as CSSStyleDeclaration);
}

// RAF
let last = performance.now();
function loop(ts: number){
  const dt = ts - last; last = ts;
  const elapsed = ts;
  const input = getInput();
  game.step(dt, input, elapsed);
  game.draw(elapsed);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// HUD music indicator
(function createMusicIndicator(){
  const indicator = document.createElement('div');
  indicator.textContent = '🎵';
  Object.assign(indicator.style, {
    position:'fixed', top:'18px', right:'18px', width:'40px', height:'40px', borderRadius:'50%',
    background:'rgba(255,255,255,0.08)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'18px', zIndex:'50', cursor:'pointer', opacity:'0.7'
  } as CSSStyleDeclaration);

  indicator.onclick = ()=>{ musicManager.toggle(); update(); };

  function update(){
    indicator.textContent = musicManager.isCurrentlyPlaying() ? '🎵' : '🔇';
    indicator.style.opacity = musicManager.isCurrentlyPlaying() ? '0.8' : '0.4';
  }

  setInterval(update, 2000);
  document.body.appendChild(indicator);
  update();
})();

// Fullscreen button (top-right, next to music)
(function createFullscreenButton(){
  const btn = document.createElement('div');
  btn.textContent = '⛶';
  Object.assign(btn.style, {
    position:'fixed', top:'18px', right:'66px', width:'40px', height:'40px', borderRadius:'50%',
    background:'rgba(255,255,255,0.08)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'18px', zIndex:'50', cursor:'pointer', opacity:'0.8'
  } as CSSStyleDeclaration);

  const doc:any = document;
  const root:any = document.documentElement;
  const isFull = () => !!(document.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement);
  const enter = async () => {
    try {
      if (root.requestFullscreen) await root.requestFullscreen();
      else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
      else if ((root as any).msRequestFullscreen) (root as any).msRequestFullscreen();
    } catch {}
  };
  const exit = async () => {
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if ((doc as any).msExitFullscreen) (doc as any).msExitFullscreen();
    } catch {}
  };

  const update = () => {
    // keep same icon; adjust opacity to indicate state
    btn.style.opacity = isFull() ? '1.0' : '0.8';
    btn.style.boxShadow = isFull() ? '0 0 0 2px rgba(0,255,200,0.35) inset' : 'none';
  };

  btn.onclick = async () => { if (isFull()) await exit(); else await enter(); update(); };
  document.addEventListener('fullscreenchange', update);
  document.addEventListener('webkitfullscreenchange' as any, update as any);
  document.addEventListener('msfullscreenchange' as any, update as any);

  document.body.appendChild(btn);
  update();
})();

// Rank indicator (top-left)
(function createRankIndicator(){
  const el = document.createElement('div');
  Object.assign(el.style, {
    position:'fixed', top:'14px', left:'14px', padding:'4px 8px', borderRadius:'8px',
    background:'rgba(0,0,0,0.35)', color:'#fff', font:'700 12px system-ui, sans-serif',
    zIndex:'50', pointerEvents:'none'
  } as CSSStyleDeclaration);
  document.body.appendChild(el);

  function update(){
    try{
      const total = game.aliveCount?.() ?? 0;
      const rank = (game as any).getRank ? (game as any).getRank((game as any).me) : 0;
      if (total>0 && rank>0){
        el.textContent = `${rank}/${total}`;
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    } catch { /* ignore */ }
  }

  setInterval(update, 500);
  update();
})();

// Mobile fullscreen prompt (for mobile browsers)
(function mobileFullscreenPrompt(){
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile || isStandalone) return;

  const doc:any = document;
  const root:any = document.documentElement;
  const canFullscreen = !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled || root.requestFullscreen || root.webkitRequestFullscreen || (root as any).msRequestFullscreen);
  if (!canFullscreen) return;

  // Avoid double prompt if already fullscreen
  const isFull = () => !!(document.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement);
  if (isFull()) return;

  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:'fixed', inset:'0', display:'grid', placeItems:'center', zIndex:'60',
    background:'linear-gradient(180deg, rgba(0,0,0,.65), rgba(0,0,0,.75))', color:'#fff'
  } as CSSStyleDeclaration);

  const card = document.createElement('div');
  Object.assign(card.style, {
    width:'min(520px, 88vw)', borderRadius:'16px', padding:'20px', textAlign:'center',
    background:'rgba(10,14,38,0.8)', backdropFilter:'blur(10px)',
    boxShadow:'0 20px 50px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,0.06)'
  } as CSSStyleDeclaration);

  const h = document.createElement('div');
  h.textContent = 'Vollbild starten';
  Object.assign(h.style, { font:'900 20px system-ui, sans-serif', marginBottom:'8px' } as CSSStyleDeclaration);

  const p = document.createElement('div');
  p.textContent = 'Tippe, um in den Vollbildmodus zu wechseln.';
  Object.assign(p.style, { opacity:'0.85', marginBottom:'14px' } as CSSStyleDeclaration);

  const btn = document.createElement('button');
  btn.textContent = 'JETZT SPIELEN';
  Object.assign(btn.style, {
    padding:'12px 16px', border:'0', borderRadius:'12px', fontWeight:'900', cursor:'pointer',
    background:'linear-gradient(90deg, #00ffd5, #7effff)', color:'#023', width:'100%'
  } as CSSStyleDeclaration);

  const skip = document.createElement('button');
  skip.textContent = 'Später';
  Object.assign(skip.style, {
    marginTop:'10px', padding:'8px 12px', border:'0', borderRadius:'10px', cursor:'pointer',
    background:'rgba(255,255,255,0.12)', color:'#fff', width:'100%'
  } as CSSStyleDeclaration);

  const enter = async () => {
    try {
      if (root.requestFullscreen) await root.requestFullscreen();
      else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
      else if ((root as any).msRequestFullscreen) (root as any).msRequestFullscreen();
    } catch {} finally {
      overlay.remove();
    }
  };

  btn.onclick = enter;
  overlay.onclick = (e)=>{ if (e.target === overlay) enter(); };
  overlay.addEventListener('touchstart', (e)=>{ if (e.target === overlay) enter(); }, { passive:true });
  skip.onclick = ()=> overlay.remove();

  card.append(h, p, btn, skip);
  overlay.append(card);
  document.body.appendChild(overlay);
})();
