// main.ts
import { Game } from './game';
import { bindInput, getInput, setMusicManager } from './input';
import { StartMenu } from './startMenu';
import { MusicManager } from './musicManager';
import { addRecord } from './records';

// Also push to cloud leaderboard (top 10 maintained server-side)
import { pushRecordToCloud } from './recordsCloud';
import { auth } from './firebase';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = new Game(canvas);

// Music
const musicManager = new MusicManager();
musicManager.start();

bindInput(canvas);
setMusicManager(musicManager);

let currentSkinCanvas: HTMLCanvasElement | undefined;

const menu = new StartMenu({
  onStart: (cfg)=>{
    currentSkinCanvas = cfg.skinCanvas as HTMLCanvasElement | undefined;
    game.resetRound();
    game.spawnPlayers(50, cfg);
  },
  musicManager
});
menu.show();

game.onGameOver = (stats)=>{
  // Save record with current skin preview (top 10 handled by records module)
  try {
    const skinUrl = currentSkinCanvas ? currentSkinCanvas.toDataURL('image/png') : undefined;
    const rec = { skinDataUrl: skinUrl || '', maxMass: stats.maxMass, survivedSec: stats.survivedSec, ts: Date.now() };
    addRecord(rec);

    // Push to cloud as well (best-effort)
    const user = auth.currentUser;
    pushRecordToCloud({ ...rec, uid: user?.uid, name: user?.displayName || undefined });
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
