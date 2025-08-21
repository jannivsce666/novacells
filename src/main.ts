// main.ts
import { Game } from './game';
// Removed SharedGameClient import to run classic-only
import { bindInput, getInput, setMusicManager } from './input';
import { MusicManager } from './musicManager';
import { addRecord } from './records';
import { pushRecordToCloud } from './recordsCloud';
import { auth, onAuthStateChanged } from './firebase';
import { StartMenu } from './startMenu';

const canvas = document.getElementById('game') as HTMLCanvasElement;
let game: Game; // classic only

// Initialize with classic single-player game
game = new Game(canvas);

// Music Manager
const musicManager = new MusicManager();
bindInput(canvas);
setMusicManager(musicManager);

// Setup Level-Up Rewards: 100 coins per level up
(async () => {
  try {
    const { setHooks } = await import('./xp');
    setHooks({
      onLevelUp: (newLevel: number) => {
        const currentCoins = getLocalCoins();
        const newCoins = currentCoins + 100;
        setLocalCoins(newCoins);
        showTopNotice(`🎉 Level ${newLevel}! +100 Coins`);
        const menu = (window as any).currentMenu;
        if (menu && typeof menu.setCoins === 'function') menu.setCoins(newCoins);
        localStorage.setItem('neoncells.levelUpReward', 'true');
        if (menu && typeof menu.updateStarButton === 'function') menu.updateStarButton();
      }
    });
  } catch (error) { console.warn('Failed to setup level-up rewards:', error); }
})();

let currentSkinCanvas: HTMLCanvasElement | undefined;

// Kleine gelbe Top-Notification
function showTopNotice(text: string, duration = 2500) {
  const el = document.createElement('div');
  Object.assign(el.style, {
    position: 'fixed', top: '12px', left: '50%', transform: 'translateX(-50%) translateY(-10px)',
    background: '#ffd60a', color: '#000', padding: '8px 14px', borderRadius: '9999px', font: '700 14px system-ui',
    letterSpacing: '0.3px', zIndex: '100', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', opacity: '0',
    transition: 'opacity .2s ease, transform .2s ease',
  } as CSSStyleDeclaration);
  el.textContent = text; document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)'; });
  window.setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(-10px)'; window.setTimeout(() => el.remove(), 250); }, duration);
}

// Mount Start Menu (StartMenu class API)
let menu: StartMenu | null = null;
function mountMenu() {
  if (!menu) {
    menu = new StartMenu({
      onStart: (cfg)=>{
        currentSkinCanvas = cfg.skinCanvas as HTMLCanvasElement | undefined;
        try {
          // Pure classic start
          game = new Game(canvas);
          game.onGameOver = handleGameOver;
          (game as Game).spawnPlayers(69, cfg);
        } catch (mainError) {
          console.error('Failed to start game:', mainError);
          showTopNotice('⚠️ Starte Basis-Spiel...');
          game = new Game(canvas);
          game.onGameOver = handleGameOver;
          (game as Game).spawnPlayers(69, cfg);
        }
      },
      musicManager
    });
    (window as any).currentMenu = menu;
  }
  try { menu.show(); } catch {}
}

// Preloader für Mobile
(async function mobilePreloaderThenShow(){
  const ua = navigator.userAgent || '';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  if (!isMobile) { mountMenu(); return; }
  const overlay = document.createElement('div');
  Object.assign(overlay.style, { position:'fixed', inset:'0', zIndex:'200', display:'grid', placeItems:'center', background:'rgba(0,0,0,0.8)', color:'#fff' } as CSSStyleDeclaration);
  const box = document.createElement('div');
  Object.assign(box.style, { padding:'20px', borderRadius:'16px', background:'rgba(8,10,28,0.9)', backdropFilter:'blur(10px)', display:'grid', placeItems:'center', gap:'12px' } as CSSStyleDeclaration);
  const spinner = document.createElement('div'); spinner.className = 'space-spinner';
  const label = document.createElement('div'); label.textContent = 'Gleich geht´s los!'; Object.assign(label.style, { font:'900 16px system-ui', letterSpacing:'0.4px' } as CSSStyleDeclaration);
  box.append(spinner,label); overlay.append(box); document.body.appendChild(overlay);
  try {
    const globbed = (import.meta as any).glob('./premium/*.{png,jpg,webp,svg}', { eager:true, as:'url' }) as Record<string,string>;
    const files = Object.values(globbed);
    await Promise.all(files.map((u)=> new Promise<void>(res=>{ const img=new Image(); img.onload=()=>res(); img.onerror=()=>res(); img.src=u; })));
  } catch {}
  overlay.remove(); mountMenu();
})();

// Coins sync
onAuthStateChanged(auth, async (user)=>{
  if (!user) return;
  try {
    const { fetchUserCoins, getUserBestMax } = await import('./recordsCloud');
    const coins = await fetchUserCoins(user.uid);
    const best = await getUserBestMax(user.uid);
    (menu as any)?.setCoins?.(coins);
    try { const { syncWithCloud } = await import('./xp'); await syncWithCloud(user.uid); } catch (err) { console.warn('Failed to sync XP from cloud:', err); }
  } catch {}
});

function awardCoinsForScore(maxMass:number): number { const m = Math.floor(maxMass); return Math.floor(m / 150) * 5; }

function getLastMatchResults() {
  try { const stored = localStorage.getItem('lastMatchResults'); if (stored) return JSON.parse(stored); } catch {}
  return null;
}

// Game Over handler
const handleGameOver = async (stats: any) => {
  try {
    const skinUrl = currentSkinCanvas ? currentSkinCanvas.toDataURL('image/png') : undefined;
    const rec = { skinDataUrl: skinUrl||'', maxMass: stats.maxMass, survivedSec: stats.survivedSec, ts: Date.now() };
    addRecord(rec);
    const user = auth.currentUser;
    pushRecordToCloud({ ...rec, uid: user?.uid, name: user?.displayName||undefined });
    const lastMatchData = { maxMass: stats.maxMass, survivedSec: stats.survivedSec, rank: stats.rank, xpBreakdown: stats.xpBreakdown, timestamp: Date.now() };
    localStorage.setItem('lastMatchResults', JSON.stringify(lastMatchData));
    if (user?.uid) {
      try { const { getState, saveCloudXp } = await import('./xp'); const xpState = getState(); await saveCloudXp(user.uid, xpState); } catch (err) { console.warn('Failed to save XP to cloud:', err); }
    }
  } catch {}
  showGameOver(stats as any);
};

function getLocalCoins(): number { try { const v = localStorage.getItem('neoncells.coins'); return v ? Math.max(0, parseInt(v)) : 0; } catch { return 0; } }
function setLocalCoins(amount: number) { try { localStorage.setItem('neoncells.coins', String(Math.max(0, Math.floor(amount)))); } catch {} }

function showGameOver(stats:any){
  const overlay = document.createElement('div');
  Object.assign(overlay.style, { position:'fixed', inset:'0', display:'grid', placeItems:'center', background:'rgba(0,0,0,0.7)', zIndex:'30', color:'#fff' } as CSSStyleDeclaration);
  const card = document.createElement('div');
  Object.assign(card.style, { width:'min(520px, 92vw)', borderRadius:'18px', padding:'20px', background:'rgba(10,14,38,0.9)', backdropFilter:'blur(12px)', boxShadow:'0 20px 50px rgba(0,0,0,.6)', textAlign:'center' } as CSSStyleDeclaration);
  const h = document.createElement('h2'); h.textContent = 'GAME OVER'; h.style.marginBottom = '20px';
  const p = document.createElement('div'); p.innerHTML = `Max Größe: <b>${stats.maxMass}</b><br/>Zeit: <b>${stats.survivedSec}s</b><br/>Finale Masse: <b>${stats.finalMass || stats.maxMass}</b>`; p.style.marginBottom = '20px';
  const xpDiv = document.createElement('div');
  try { (async () => { const { getState, getUiProgress } = await import('./xp'); const xpState = getState(); const progress = getUiProgress(); xpDiv.innerHTML = `<br/>Level: <b>${xpState.level}</b> | XP: <b>${progress.value}/${progress.max}</b>`; xpDiv.style.marginTop = '10px'; xpDiv.style.fontSize = '14px'; xpDiv.style.opacity = '0.8'; })(); } catch {}
  const currentCoins = getLocalCoins();
  const coinsDiv = document.createElement('div'); coinsDiv.innerHTML = `💰 Coins: <b>${currentCoins}</b>`; coinsDiv.style.margin = '15px 0'; coinsDiv.style.fontSize = '16px';
  const revivalCost = 500; const finalMass = stats.finalMass || stats.maxMass; const canRevive = currentCoins >= revivalCost && finalMass >= 100;
  if (canRevive) {
    const reviveSection = document.createElement('div');
    reviveSection.style.margin = '20px 0'; reviveSection.style.padding = '15px'; reviveSection.style.background = 'rgba(34, 197, 94, 0.1)'; reviveSection.style.border = '2px solid rgba(34, 197, 94, 0.3)'; reviveSection.style.borderRadius = '12px';
    const reviveText = document.createElement('div'); reviveText.innerHTML = `🚀 <b>Wiedereinstieg möglich!</b><br/>Kosten: <b>${revivalCost} Coins</b><br/>Du startest mit <b>${finalMass} Masse</b>`; reviveText.style.marginBottom = '15px';
    const reviveBtn = document.createElement('button'); reviveBtn.textContent = `💰 WIEDEREINSTEIGEN (${revivalCost} Coins)`; reviveBtn.className = 'btn-space'; reviveBtn.style.background = 'linear-gradient(45deg, #22c55e, #16a34a)'; reviveBtn.style.border = 'none'; reviveBtn.style.color = 'white'; reviveBtn.style.fontWeight = 'bold'; reviveBtn.style.padding = '12px 20px'; reviveBtn.style.fontSize = '14px';
    reviveBtn.onclick = () => {
      setLocalCoins(currentCoins - revivalCost);
      const menu = (window as any).currentMenu; if (menu && menu.setCoins) menu.setCoins(currentCoins - revivalCost);
      (game as Game).reviveWithMass(finalMass);
      overlay.remove();
      const successMsg = document.createElement('div'); successMsg.textContent = `🚀 Wiedereinstieg erfolgreich! -${revivalCost} Coins`; successMsg.style.cssText = `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(45deg, #22c55e, #16a34a); color: white; padding: 12px 20px; border-radius: 25px; font-weight: bold; z-index: 10000; animation: slideDown 0.3s ease-out;`; document.body.appendChild(successMsg); setTimeout(() => successMsg.remove(), 3000);
    };
    reviveSection.append(reviveText, reviveBtn); card.appendChild(reviveSection);
  }
  const buttonContainer = document.createElement('div'); buttonContainer.style.display = 'flex'; buttonContainer.style.gap = '15px'; buttonContainer.style.justifyContent = 'center'; buttonContainer.style.marginTop = '20px';
  const again = document.createElement('button'); again.textContent = 'NOCHMAL'; again.className = 'btn-space'; again.onclick = ()=>{ overlay.remove(); (game as Game).resetRound(); };
  const back = document.createElement('button'); back.textContent = 'MENÜ'; back.className = 'btn-space'; back.onclick = ()=>{ overlay.remove(); mountMenu(); };
  buttonContainer.append(again, back);
  card.append(h, p, xpDiv, coinsDiv, buttonContainer);
  overlay.append(card);
  document.body.appendChild(overlay);
}

// --- In-game Rank HUD (classic only) ---
const rankHud = document.createElement('div');
Object.assign(rankHud.style, { position:'fixed', top:'12px', left:'12px', zIndex:'60', padding:'6px 10px', borderRadius:'12px', background:'rgba(0,0,0,0.45)', color:'#fff', font:'800 14px system-ui, sans-serif', letterSpacing:'0.2px', pointerEvents:'none', } as CSSStyleDeclaration);
rankHud.textContent = ''; document.body.appendChild(rankHud);
let lastRankUpdate = 0;
function updateRankHud(ts:number){
  if (ts - lastRankUpdate < 200) return;
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

// Game Loop with mobile optimization (classic only)
let last = performance.now();
const isMobile = typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const TARGET_FPS = isMobile ? 50 : 60; const FRAME_TIME = 1000 / TARGET_FPS; let frameSkipCounter = 0;
function loop(ts:number){
  const dt = ts - last;
  if (isMobile) {
    if (dt < FRAME_TIME * 0.9) { requestAnimationFrame(loop); return; }
    if (dt > 25) { frameSkipCounter++; if (frameSkipCounter % 4 === 0) { requestAnimationFrame(loop); return; } }
  }
  last = ts; const cappedDt = Math.min(dt, 33.33);
  try { (game as Game).step(cappedDt, getInput(), ts); (game as Game).draw(ts); updateRankHud(ts); }
  catch (error) { console.error('Game loop error:', error); }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Removed temporary in-game HUD (music/fullscreen SVG buttons) to restore previous HUD look