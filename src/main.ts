// main.ts
import { Game } from './game';
import { bindInput, getInput, setMusicManager } from './input';
import { MusicManager } from './musicManager';
import { addRecord } from './records';
import { pushRecordToCloud } from './recordsCloud';
import { auth, onAuthStateChanged } from './firebase';
import { StartMenu } from './startMenu';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = new Game(canvas);

// Music Manager
const musicManager = new MusicManager();
bindInput(canvas);
setMusicManager(musicManager);

let currentSkinCanvas: HTMLCanvasElement | undefined;

// Kleine gelbe Top-Notification
function showTopNotice(text: string, duration = 2500) {
  const el = document.createElement('div');
  Object.assign(el.style, {
    position: 'fixed',
    top: '12px',
    left: '50%',
    transform: 'translateX(-50%) translateY(-10px)',
    background: '#ffd60a',
    color: '#000',
    padding: '8px 14px',
    borderRadius: '9999px',
    font: '700 14px system-ui',
    letterSpacing: '0.3px',
    zIndex: '100',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    opacity: '0',
    transition: 'opacity .2s ease, transform .2s ease',
  } as CSSStyleDeclaration);
  el.textContent = text;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
  });
  window.setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(-10px)';
    window.setTimeout(() => el.remove(), 250);
  }, duration);
}

// Mount Start Menu (StartMenu class API)
let menu: StartMenu | null = null;
function mountMenu() {
  if (!menu) {
    menu = new StartMenu({
      onStart: (cfg)=>{
        currentSkinCanvas = cfg.skinCanvas as HTMLCanvasElement | undefined;
        // WS connect
        try {
          const wsUrl = (location.origin.replace(/^http/, 'ws'));
          const ws = new WebSocket(wsUrl);
          (window as any).ncWs = ws;
          ws.addEventListener('open', ()=>{
            const name = cfg.name || 'Player';
            ws.send(JSON.stringify({ type: 'join', name }));
          });
          ws.addEventListener('message', (ev)=>{
            const raw = (ev as MessageEvent).data;
            if (typeof raw === 'string') {
              try {
                const data = JSON.parse(raw);
                if (data && data.type === 'welcome') {
                  showTopNotice('server erfolgreich gejoined');
                }
              } catch {}
            }
          });
        } catch {}
        // Start game
        game.spawnPlayers(69, cfg);
      },
      musicManager
    });
  }
  try { menu.show(); } catch {}
}

// Preloader für Mobile
(async function mobilePreloaderThenShow(){
  const ua = navigator.userAgent || '';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  if (!isMobile) { mountMenu(); return; }

  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:'fixed', inset:'0', zIndex:'200', display:'grid', placeItems:'center',
    background:'rgba(0,0,0,0.8)', color:'#fff'
  } as CSSStyleDeclaration);

  const box = document.createElement('div');
  Object.assign(box.style, {
    padding:'20px', borderRadius:'16px',
    background:'rgba(8,10,28,0.9)', backdropFilter:'blur(10px)',
    display:'grid', placeItems:'center', gap:'12px'
  } as CSSStyleDeclaration);

  const spinner = document.createElement('div');
  spinner.className = 'space-spinner';

  const label = document.createElement('div');
  label.textContent = 'Gleich geht´s los!';
  Object.assign(label.style, { font:'900 16px system-ui', letterSpacing:'0.4px' } as CSSStyleDeclaration);

  box.append(spinner,label); overlay.append(box); document.body.appendChild(overlay);

  // Prefetch skins
  try {
    const globbed = (import.meta as any).glob('./premium/*.{png,jpg,webp,svg}', { eager:true, as:'url' }) as Record<string,string>;
    const files = Object.values(globbed);
    await Promise.all(files.map((u)=> new Promise<void>(res=>{ const img=new Image(); img.onload=()=>res(); img.onerror=()=>res(); img.src=u; })));
  } catch {}

  overlay.remove();
  mountMenu();
})();

// Coins sync
onAuthStateChanged(auth, async (user)=>{
  if (!user) return;
  try {
    const { fetchUserCoins, getUserBestMax } = await import('./recordsCloud');
    const coins = await fetchUserCoins(user.uid);
    const best = await getUserBestMax(user.uid);
    (menu as any)?.setCoins?.(coins);
    
    // Sync XP from Firebase
    try {
      const { syncWithCloud } = await import('./xp');
      await syncWithCloud(user.uid);
    } catch (err) {
      console.warn('Failed to sync XP from cloud:', err);
    }
  } catch {}
});

function awardCoinsForScore(maxMass:number): number {
  const m = Math.floor(maxMass);
  if (m < 100) return 10;
  if (m >= 500 && m <= 1000) return 100;
  if (m >= 1001 && m <= 5000) return 500;
  if (m >= 5001 && m <= 10000) return 2000;
  if (m > 10000) return 2000 + Math.floor((m - 10000) / 100) * 10;
  return 0;
}

// Get last match results for start menu display
function getLastMatchResults() {
  try {
    const stored = localStorage.getItem('lastMatchResults');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return null;
}

// Game Over Overlay
game.onGameOver = async (stats)=>{
  try {
    const skinUrl = currentSkinCanvas ? currentSkinCanvas.toDataURL('image/png') : undefined;
    const rec = { skinDataUrl: skinUrl||'', maxMass: stats.maxMass, survivedSec: stats.survivedSec, ts: Date.now() };
    addRecord(rec);
    const user = auth.currentUser;
    pushRecordToCloud({ ...rec, uid: user?.uid, name: user?.displayName||undefined });
    
    // Store last match results for start menu
    const lastMatchData = {
      maxMass: stats.maxMass,
      survivedSec: stats.survivedSec,
      rank: stats.rank,
      xpBreakdown: stats.xpBreakdown,
      timestamp: Date.now()
    };
    localStorage.setItem('lastMatchResults', JSON.stringify(lastMatchData));
    
    // Save XP to Firebase for logged-in users
    if (user?.uid) {
      try {
        const { getState, saveCloudXp } = await import('./xp');
        const xpState = getState();
        await saveCloudXp(user.uid, xpState);
      } catch (err) {
        console.warn('Failed to save XP to cloud:', err);
      }
    }
  } catch {}
  showGameOver(stats as any);
};

function showGameOver(stats:any){
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:'fixed', inset:'0', display:'grid', placeItems:'center',
    background:'rgba(0,0,0,0.7)', zIndex:'30', color:'#fff'
  } as CSSStyleDeclaration);

  const card = document.createElement('div');
  Object.assign(card.style, {
    width:'min(520px, 92vw)', borderRadius:'18px', padding:'20px',
    background:'rgba(10,14,38,0.9)', backdropFilter:'blur(12px)',
    boxShadow:'0 20px 50px rgba(0,0,0,.6)',
    textAlign:'center'
  } as CSSStyleDeclaration);

  const h = document.createElement('h2');
  h.textContent = 'GAME OVER';

  const p = document.createElement('div');
  p.innerHTML = `Max Größe: <b>${stats.maxMass}</b><br/>Zeit: <b>${stats.survivedSec}s</b>`;

  // Add XP information
  const xpDiv = document.createElement('div');
  try {
    (async () => {
      const { getState, getUiProgress } = await import('./xp');
      const xpState = getState();
      const progress = getUiProgress();
      xpDiv.innerHTML = `<br/>Level: <b>${xpState.level}</b> | XP: <b>${progress.value}/${progress.max}</b>`;
      xpDiv.style.marginTop = '10px';
      xpDiv.style.fontSize = '14px';
      xpDiv.style.opacity = '0.8';
    })();
  } catch {}

  const again = document.createElement('button');
  again.textContent = 'NOCHMAL';
  again.className = 'btn-space';
  again.onclick = ()=>{ overlay.remove(); game.resetRound(); };

  const back = document.createElement('button');
  back.textContent = 'MENÜ';
  back.className = 'btn-space';
  back.onclick = ()=>{ overlay.remove(); mountMenu(); };

  card.append(h,p,xpDiv,again,back); overlay.append(card); document.body.appendChild(overlay);
}

// --- In-game Rank HUD (1/x) ---
const rankHud = document.createElement('div');
Object.assign(rankHud.style, {
  position:'fixed', top:'12px', left:'12px', zIndex:'60',
  padding:'6px 10px', borderRadius:'12px',
  background:'rgba(0,0,0,0.45)', color:'#fff',
  font:'800 14px system-ui, sans-serif', letterSpacing:'0.2px',
  pointerEvents:'none',
} as CSSStyleDeclaration);
rankHud.textContent = '';
document.body.appendChild(rankHud);
let lastRankUpdate = 0;
function updateRankHud(ts:number){
  if (ts - lastRankUpdate < 200) return; // throttle ~5x/sec
  lastRankUpdate = ts;
  try {
    const meId = (game as any).me as string;
    const me = (game as any).players?.get?.(meId);
    const alive = Array.from((game as any).players?.values?.() || []).filter((p:any)=>p.alive).length;
    if (!meId || !me || !me.alive || !alive){ rankHud.style.display = 'none'; return; }
    const rank = (game as any).getRank?.(meId) ?? 0;
    rankHud.style.display = 'block';
    rankHud.textContent = `${rank}/${alive}`;
  } catch { rankHud.style.display = 'none'; }
}

// Game Loop
let last = performance.now();
function loop(ts:number){
  const dt = ts - last; last = ts;
  game.step(dt, getInput(), ts);
  game.draw(ts);
  updateRankHud(ts);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Removed temporary in-game HUD (music/fullscreen SVG buttons) to restore previous HUD look
// (was added below as an IIFE).