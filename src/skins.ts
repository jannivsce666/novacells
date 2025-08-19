// skins.ts
import { rand, randInt } from './utils';

export type SkinKind = 'bear'|'scorp'|'flag'|'neon'|'eyes'|'stripe'|'letter'
  | 'flag_de'|'flag_it'|'flag_fr'
  | 'star1'|'star2'|'star3'|'star4'|'star5'|'star6'|'star7'|'star8'|'star9'|'star10'
  | 'star11'|'star12'|'star13'|'star14'|'star15'
  | 'galaxy1'|'galaxy2'|'galaxy3'|'galaxy4'|'galaxy5'
  | 'ringstar1'|'ringstar2'|'ringstar3';

// --- primitives ---
function drawBear(ctx:CanvasRenderingContext2D, w=128,h=128){
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#ffbcbc";
  ctx.beginPath(); ctx.arc(w*0.5,h*0.55,w*0.32,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.35,h*0.35,w*0.12,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.65,h*0.35,w*0.12,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#5b1f1f";
  ctx.beginPath(); ctx.arc(w*0.5,h*0.55,w*0.06,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#2f0e0e";
  ctx.beginPath(); ctx.arc(w*0.45,h*0.50,w*0.04,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.55,h*0.50,w*0.04,0,Math.PI*2); ctx.fill();
}
function drawScorpion(ctx:CanvasRenderingContext2D,w=128,h=128){
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#8a2be2";
  ctx.beginPath(); ctx.arc(w*0.5,h*0.55,w*0.18,0,Math.PI*2); ctx.fill();
  for(let i=0;i<5;i++){
    const x=w*0.5+Math.cos(i*0.5)*i*6, y=h*0.5- i*10;
    ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(w*0.5,h*0.1,8,0,Math.PI*2); ctx.fill(); // Stachel
}

function drawFlagVariant(ctx:CanvasRenderingContext2D, code:'de'|'it'|'fr', w=128,h=128){
  ctx.clearRect(0,0,w,h);
  if (code==='de'){
    ctx.fillStyle="#000"; ctx.fillRect(0,0,w,h/3);
    ctx.fillStyle="#dd0000"; ctx.fillRect(0,h/3,w,h/3);
    ctx.fillStyle="#ffce00"; ctx.fillRect(0,h*2/3,w,h/3);
  } else if (code==='it'){
    ctx.fillStyle="#009246"; ctx.fillRect(0,0,w/3,h);
    ctx.fillStyle="#fff";    ctx.fillRect(w/3,0,w/3,h);
    ctx.fillStyle="#ce2b37"; ctx.fillRect(w*2/3,0,w/3,h);
  } else {
    ctx.fillStyle="#0055a4"; ctx.fillRect(0,0,w/3,h);
    ctx.fillStyle="#fff";    ctx.fillRect(w/3,0,w/3,h);
    ctx.fillStyle="#ef4135"; ctx.fillRect(w*2/3,0,w/3,h);
  }
}

function drawStarPolygon(ctx:CanvasRenderingContext2D, cx:number, cy:number, rOuter:number, rInner:number, points:number, rot=0, color='rgba(255,240,120,0.95)'){
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i=0;i<points*2;i++){
    const R = (i%2===0) ? rOuter : rInner;
    const a = (i/(points*2)) * Math.PI*2;
    const x = Math.cos(a) * R; const y = Math.sin(a) * R;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 16; ctx.fill();
  ctx.restore();
}

function drawStarField(ctx:CanvasRenderingContext2D, seed:number, w=128,h=128){
  ctx.fillStyle = '#051023'; ctx.fillRect(0,0,w,h);
  // deterministic pseudo-random positions based on seed
  function sRand(i:number){ const x = Math.sin(i*57.123 + seed*13.7)*43758.5453; return x - Math.floor(x); }
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i=0;i<40;i++){
    const rx = sRand(i)*w; const ry = sRand(i+100)*h; const r = 0.8 + sRand(i+200)*1.8;
    ctx.beginPath(); ctx.arc(rx,ry,r,0,Math.PI*2); ctx.fill();
  }
}

function drawStarTheme(ctx:CanvasRenderingContext2D, variant:number, w=128,h=128){
  drawStarField(ctx, variant, w, h);
  const cx=w/2, cy=h/2;
  const pts = 5 + (variant % 4); // 5..8
  const rO = 30 + (variant%3)*6;
  const rI = rO*0.44;
  const hue = 45 + (variant*37)%240; // vary color hue-ish via hsla approximations
  const color = `hsla(${hue},100%,70%,0.95)`;
  drawStarPolygon(ctx, cx, cy, rO, rI, pts, (variant%12)*0.18, color);
}

function drawGalaxyTheme(ctx:CanvasRenderingContext2D, variant:number, w=128,h=128){
  ctx.fillStyle = '#060a18'; ctx.fillRect(0,0,w,h);
  const cx=w/2, cy=h/2;
  // spiral arms
  ctx.save(); ctx.translate(cx,cy);
  ctx.strokeStyle = 'rgba(140,180,255,0.55)'; ctx.lineWidth=2;
  for (let arm=0; arm<3; arm++){
    ctx.beginPath();
    for (let t=0; t<Math.PI*2; t+=0.1){
      const r = 6 + t*10;
      const a = t + arm*2.1 + variant*0.25;
      const x = Math.cos(a)*r, y = Math.sin(a)*r;
      if (t===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.restore();
  // core
  const g = ctx.createRadialGradient(cx,cy,8,cx,cy,36);
  g.addColorStop(0,'rgba(255,255,255,0.9)'); g.addColorStop(1,'rgba(120,160,255,0.2)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,34,0,Math.PI*2); ctx.fill();
}

function drawRingStar(ctx:CanvasRenderingContext2D, variant:number, w=128,h=128){
  ctx.fillStyle = '#0b0f22'; ctx.fillRect(0,0,w,h);
  const cx=w/2, cy=h/2;
  const base = `hsla(${(variant*60)%360},100%,60%,`;
  ctx.fillStyle = base+`0.25)`;
  ctx.beginPath(); ctx.arc(cx,cy,44,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle = base+`0.85)`; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(cx,cy,36,0,Math.PI*2); ctx.stroke();
  drawStarPolygon(ctx, cx, cy, 22, 10, 6 + (variant%3), (variant%6)*0.5, base+`0.95)`);
}

function drawNeonHex(ctx:CanvasRenderingContext2D,w=128,h=128){
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#031a1a"; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(0,255,200,0.85)"; ctx.lineWidth=3;
  const r=38, cx=w/2, cy=h/2;
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3; const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath(); ctx.stroke();
}

// Keep existing variants for backward compatibility
function drawFlag(ctx:CanvasRenderingContext2D,w=128,h=128){
  ctx.clearRect(0,0,w,h);
  const type = randInt(0,2);
  if (type===0){
    ctx.fillStyle="#000"; ctx.fillRect(0,0,w,h/3);
    ctx.fillStyle="#dd0000"; ctx.fillRect(0,h/3,w,h/3);
    ctx.fillStyle="#ffce00"; ctx.fillRect(0,h*2/3,w,h/3);
  } else if (type===1){
    ctx.fillStyle="#009246"; ctx.fillRect(0,0,w/3,h);
    ctx.fillStyle="#fff";    ctx.fillRect(w/3,0,w/3,h);
    ctx.fillStyle="#ce2b37"; ctx.fillRect(w*2/3,0,w/3,h);
  } else {
    ctx.fillStyle="#0055a4"; ctx.fillRect(0,0,w/3,h);
    ctx.fillStyle="#fff";    ctx.fillRect(w/3,0,w/3,h);
    ctx.fillStyle="#ef4135"; ctx.fillRect(w*2/3,0,w/3,h);
  }
}
function drawEyes(ctx:CanvasRenderingContext2D,w=128,h=128){
  ctx.save();
  ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(w*0.4,h*0.5,14,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.6,h*0.5,14,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(w*0.43,h*0.52,8,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.63,h*0.52,8,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function drawStripe(ctx:CanvasRenderingContext2D,w=128,h=128){
  ctx.save();
  ctx.rotate(-Math.PI/8);
  ctx.fillStyle='rgba(255,255,255,0.8)';
  ctx.fillRect(-w,h*0.35,w*2,18);
  ctx.restore();
}
function drawLetter(ctx:CanvasRenderingContext2D, ch?:string, w=128,h=128){
  ctx.save();
  ctx.fillStyle='rgba(255,255,255,0.92)';
  ctx.font='bold 88px system-ui, sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(ch ?? String.fromCharCode(randInt(65,90)), w/2, h/2);
  ctx.restore();
}

export function makeSkinCanvas(kind: SkinKind | SkinKind[], opts?:{letter?:string}): HTMLCanvasElement {
  const cvs = document.createElement('canvas');
  cvs.width = 128; cvs.height = 128;
  const ctx = cvs.getContext('2d')!;
  const kinds = Array.isArray(kind)? kind : [kind];

  // base (deterministic presets)
  const baseKind = kinds.find(k=> ['bear','scorp','flag','neon','flag_de','flag_it','flag_fr','star1','star2','star3','star4','star5','star6','star7','star8','star9','star10','star11','star12','star13','star14','star15','galaxy1','galaxy2','galaxy3','galaxy4','galaxy5','ringstar1','ringstar2','ringstar3'].includes(k)) as SkinKind | undefined;
  if (baseKind==='bear') drawBear(ctx);
  else if (baseKind==='scorp') drawScorpion(ctx);
  else if (baseKind==='flag') drawFlag(ctx); // random legacy
  else if (baseKind==='flag_de') drawFlagVariant(ctx,'de');
  else if (baseKind==='flag_it') drawFlagVariant(ctx,'it');
  else if (baseKind==='flag_fr') drawFlagVariant(ctx,'fr');
  else if (baseKind==='neon') drawNeonHex(ctx);
  else if (baseKind && baseKind.startsWith('star')){
    const n = Number(baseKind.replace('star','')) || 1; drawStarTheme(ctx, n);
  } else if (baseKind && baseKind.startsWith('galaxy')){
    const n = Number(baseKind.replace('galaxy','')) || 1; drawGalaxyTheme(ctx, n);
  } else if (baseKind && baseKind.startsWith('ringstar')){
    const n = Number(baseKind.replace('ringstar','')) || 1; drawRingStar(ctx, n);
  } else {
    drawNeonHex(ctx);
  }

  // overlays
  for(const k of kinds){
    if (k==='eyes') drawEyes(ctx);
    if (k==='stripe') drawStripe(ctx);
    if (k==='letter') drawLetter(ctx, opts?.letter);
  }
  return cvs;
}

// Fixed, deterministic preset list (>=30 entries)
export const FIXED_PRESET_COMBOS: (SkinKind | SkinKind[])[] = [
  'star1', ['star2','stripe'], ['star3','eyes'], ['star4','letter'],
  'star5', ['star6','stripe'], ['star7','eyes'], ['star8','letter'],
  'star9', ['star10','stripe'], ['star11','eyes'], ['star12','letter'],
  'star13', ['star14','stripe'], ['star15','eyes'],
  'galaxy1', ['galaxy2','stripe'], ['galaxy3','eyes'], ['galaxy4','letter'], 'galaxy5',
  'ringstar1', ['ringstar2','stripe'], ['ringstar3','eyes'],
  'neon', ['neon','stripe'], ['neon','eyes'], ['neon','letter'],
  'flag_de', 'flag_it', 'flag_fr',
  'bear', ['bear','eyes'], 'scorp', ['scorp','stripe']
];

export function randomSkinCanvas(): HTMLCanvasElement {
  const bases:SkinKind[] = ['bear','scorp','flag','neon'];
  const overlays = ['eyes','stripe','letter'] as SkinKind[];
  const chosen = [bases[randInt(0,bases.length-1)]];
  if (Math.random()<0.6) chosen.push(overlays[randInt(0,overlays.length-1)]);
  return makeSkinCanvas(chosen as any);
}

export function patternFromCanvas(ctx:CanvasRenderingContext2D, skinCanvas:HTMLCanvasElement){
  return ctx.createPattern(skinCanvas, 'repeat')!;
}

export function randomSkin(ctx:CanvasRenderingContext2D){
  const skin = randomSkinCanvas();
  return patternFromCanvas(ctx, skin);
}

const BOT_NAMES = [
  'Nova','Blaze','Orbit','Pixel','Echo','Rogue','Zephyr','Vortex','Bolt','Luna',
  'Astra','Quark','Neon','Volt','Drift','Comet','Ghost','Iris','Rex','Zinc'
];
export function pickName(){
  return BOT_NAMES[randInt(0, BOT_NAMES.length-1)];
}
