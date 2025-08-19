// input.ts
export type InputState = {
  targetX: number;
  targetY: number;
  dash: boolean;
  splitPressed: boolean;       // one-shot
  ejectHeld: boolean;          // hold W / mouse right
  ejectTapCount: number;       // taps queued (mobile)
  wheelTicks: number;          // zoom bias
  speedTapCount: number;       // taps for speed boost (mobile or mouse left)
  space?: boolean;             // compat
  split?: boolean;             // compat
  shootTapCount?: number;      // one-shot taps to fire rockets (mobile)
};

// Global reference für MusicManager
let globalMusicManager: any = null;

export function setMusicManager(musicManager: any) {
  globalMusicManager = musicManager;
}

const state: InputState = {
  targetX: 0,
  targetY: 0,
  dash: false,
  splitPressed: false,
  ejectHeld: false,
  ejectTapCount: 0,
  wheelTicks: 0,
  speedTapCount: 0,
  shootTapCount: 0,
};

export function bindInput(canvas: HTMLCanvasElement){
  // mouse aim / touch aim
  function setAim(clientX:number, clientY:number){
    const r = canvas.getBoundingClientRect();
    state.targetX = clientX - r.left;
    state.targetY = clientY - r.top;
  }
  // Enable custom touch gestures (prevent browser panning/zooming)
  try { (canvas.style as any).touchAction = 'none'; } catch {}
  window.addEventListener('mousemove', (e)=> setAim(e.clientX, e.clientY));
  canvas.addEventListener('touchmove', (e)=>{
    if (!e.touches[0]) return;
    setAim(e.touches[0].clientX, e.touches[0].clientY);
  }, {passive:true});

  // Initialize aim at screen center to prevent auto-drift on mobile before first touch
  try {
    const r0 = canvas.getBoundingClientRect();
    setAim(r0.left + r0.width/2, r0.top + r0.height/2);
  } catch {}

  // zoom bias (mouse wheel and pinch)
  window.addEventListener('wheel', (e)=>{
    state.wheelTicks += Math.sign(e.deltaY);
  }, {passive:true});

  // Pinch-to-zoom: map distance change to wheelTicks increments
  let pinchLastDist = 0;
  const pinchThreshold = 18; // px distance change per tick
  canvas.addEventListener('touchstart', (e)=>{
    if (e.touches.length >= 2){
      const t0 = e.touches[0], t1 = e.touches[1];
      pinchLastDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      e.preventDefault();
    }
  }, {passive:false});
  canvas.addEventListener('touchmove', (e)=>{
    if (e.touches.length >= 2){
      const t0 = e.touches[0], t1 = e.touches[1];
      const d = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const delta = d - pinchLastDist;
      // Convert accumulated delta into discrete ticks
      if (Math.abs(delta) >= pinchThreshold){
        const ticks = -Math.round(delta / pinchThreshold); // spread fingers => negative (zoom in)
        state.wheelTicks += ticks;
        pinchLastDist = d;
      }
      e.preventDefault();
    }
  }, {passive:false});
  canvas.addEventListener('touchend', ()=>{ if ((window as any).TouchEvent) { /* end pinch when fingers lift */ } });
  canvas.addEventListener('touchcancel', ()=>{ pinchLastDist = 0; });

  // keyboard
  window.addEventListener('keydown', (e)=>{
    if (e.code==='ShiftLeft' || e.code==='ShiftRight') state.dash = true;
    if (e.code==='Space') { state.splitPressed = true; state.space = true; }
    if (e.code==='KeyW') state.ejectHeld = true;
    if (e.code==='KeyM' && globalMusicManager) {
      // M-Taste zum Toggle der Musik
      globalMusicManager.toggle();
    }
  });
  window.addEventListener('keyup', (e)=>{
    if (e.code==='ShiftLeft' || e.code==='ShiftRight') state.dash = false;
    if (e.code==='KeyW') state.ejectHeld = false;
  });

  // right click eject, left click speed boost tap
  canvas.addEventListener('contextmenu', (e)=> e.preventDefault());
  canvas.addEventListener('mousedown', (e)=>{
    if (e.button===2) state.ejectHeld = true;
    if (e.button===0) state.speedTapCount++;
  });
  canvas.addEventListener('mouseup', (e)=>{
    if (e.button===2) state.ejectHeld = false;
  });

  // mobile controls
  ensureMobileControls(canvas);
}

export function consumeSplit(): boolean {
  const sp = state.splitPressed;
  state.splitPressed = false;   // one-shot
  state.space = false;
  state.split = false;
  return sp;
}

export function getInput(): InputState {
  return state;
}

// --- UI helper ---
function ensureMobileControls(canvas: HTMLCanvasElement){
  ensureActionButtons();
  ensureJoystick(canvas);
}

function ensureActionButtons(){
  if (document.getElementById('mobile-actions')) return;
  const wrap = document.createElement('div');
  wrap.id = 'mobile-actions';
  Object.assign(wrap.style, {
    position:'fixed', left:'14px', bottom:'14px',
    width:'230px', height:'170px',
    zIndex:'12'
  } as CSSStyleDeclaration);

  function makeBtn(id:string, label:string, grad:string){
    const b = document.createElement('button');
    b.id = id; b.textContent = label; b.setAttribute('aria-label', id);
    Object.assign(b.style, {
      position:'absolute',
      width:'68px', height:'68px', borderRadius:'50%', border:'0',
      fontWeight:'900', fontSize:'22px', color:'#012', cursor:'pointer',
      background: grad,
      boxShadow:'0 10px 24px rgba(0,0,0,.35), 0 0 18px rgba(0,255,220,.25)',
      outline:'none',
    } as CSSStyleDeclaration);
    b.style.boxShadow = `${b.style.boxShadow}, inset 0 0 0 2px rgba(255,255,255,0.18)`;
    return b;
  }

  // Icons only
  const btnSplit = makeBtn('btn-split','⚡','linear-gradient(135deg,#60f,#9af)');
  const btnEject = makeBtn('btn-eject','⬤','linear-gradient(135deg,#ff8,#fff)');
  const btnSpeed = makeBtn('btn-speed','➤','linear-gradient(135deg,#4f8,#bff)');

  // Position like a futuristic cluster (triangle + speed on the side)
  Object.assign(btnSplit.style, { left:'8px',  top:'6px'  } as CSSStyleDeclaration);
  Object.assign(btnEject.style, { left:'46px', top:'76px' } as CSSStyleDeclaration);
  Object.assign(btnSpeed.style, { left:'130px', top:'36px' } as CSSStyleDeclaration);

  // Interactions
  btnSplit.addEventListener('click', ()=>{ state.splitPressed = true; });
  btnSplit.addEventListener('touchstart', (e)=>{ e.preventDefault(); state.splitPressed = true; }, {passive:false});

  btnEject.addEventListener('mousedown', ()=>{ state.ejectHeld = true; });
  btnEject.addEventListener('mouseup',   ()=>{ state.ejectHeld = false; });
  btnEject.addEventListener('mouseleave',()=>{ state.ejectHeld = false; });
  btnEject.addEventListener('touchstart', (e)=>{ e.preventDefault(); state.ejectHeld = true; }, {passive:false});
  btnEject.addEventListener('touchend', ()=>{ state.ejectHeld = false; });
  btnEject.addEventListener('click', ()=>{ state.ejectTapCount++; });

  btnSpeed.addEventListener('click', ()=>{ state.speedTapCount++; });
  btnSpeed.addEventListener('touchstart', (e)=>{ e.preventDefault(); state.speedTapCount++; }, {passive:false});

  wrap.append(btnSplit, btnEject, btnSpeed);
  document.body.appendChild(wrap);
}

function ensureJoystick(canvas: HTMLCanvasElement){
  if (document.getElementById('mobile-stick')) return;
  const area = document.createElement('div');
  area.id = 'mobile-stick';
  Object.assign(area.style, {
    position:'fixed', right:'14px', bottom:'14px', width:'150px', height:'150px',
    borderRadius:'18px', background:'rgba(255,255,255,0.06)',
    backdropFilter:'blur(6px)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)',
    touchAction:'none', zIndex:'12'
  } as CSSStyleDeclaration);

  const base = document.createElement('div');
  Object.assign(base.style, {
    position:'absolute', left:'50%', top:'50%', width:'96px', height:'96px', marginLeft:'-48px', marginTop:'-48px',
    borderRadius:'50%', background:'rgba(255,255,255,0.10)', boxShadow:'0 0 0 2px rgba(255,255,255,0.12)'
  } as CSSStyleDeclaration);

  const knob = document.createElement('div');
  Object.assign(knob.style, {
    position:'absolute', left:'50%', top:'50%', width:'52px', height:'52px', marginLeft:'-26px', marginTop:'-26px',
    borderRadius:'50%', background:'rgba(255,255,255,0.35)', boxShadow:'0 6px 18px rgba(0,0,0,.25)'
  } as CSSStyleDeclaration);

  area.append(base, knob);
  document.body.appendChild(area);

  let activeId: number | null = null;
  let origin = { x: 0, y: 0 };
  const R = 48; // clamp radius in px relative to base

  function setTarget(dx:number, dy:number){
    // Map knob vector to screen target coordinates around screen center
    const scale = 2.0; // amplify a bit
    const cx = canvas.width/2, cy = canvas.height/2;
    state.targetX = cx + dx * scale;
    state.targetY = cy + dy * scale;
  }

  function moveKnob(clientX:number, clientY:number){
    const rect = area.getBoundingClientRect();
    const bx = rect.left + rect.width/2;
    const by = rect.top + rect.height/2;
    const dx = clientX - bx;
    const dy = clientY - by;
    const L = Math.hypot(dx,dy) || 1;
    const cl = Math.min(L, R);
    const nx = dx / L, ny = dy / L;
    const kx = nx * cl, ky = ny * cl;
    knob.style.transform = `translate(${kx}px, ${ky}px)`;
    setTarget(kx, ky);
  }

  function resetKnob(){
    // Knopf visuell zurücksetzen, aber Zielkoordinaten NICHT ändern,
    // damit die letzte Steuer-Richtung beibehalten wird (weiter gleiten)
    knob.style.transform = 'translate(0px, 0px)';
  }

  area.addEventListener('touchstart', (e)=>{
    if (activeId!==null) return;
    const t = e.changedTouches[0]; activeId = t.identifier;
    origin = { x: t.clientX, y: t.clientY };
    moveKnob(t.clientX, t.clientY);
  }, {passive:false});

  area.addEventListener('touchmove', (e)=>{
    if (activeId===null) return;
    for (const t of Array.from(e.touches)){
      if (t.identifier===activeId){ moveKnob(t.clientX, t.clientY); break; }
    }
  }, {passive:false});

  area.addEventListener('touchend', (e)=>{
    if (activeId===null) return;
    for (const t of Array.from(e.changedTouches)){
      if (t.identifier===activeId){ activeId=null; resetKnob(); break; }
    }
  });

  area.addEventListener('touchcancel', ()=>{ activeId=null; resetKnob(); });
}
