const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/skinsGallery-CAHI1Rj8.js","assets/zeus-C7msOkHA.js","assets/shop-DudV8kOP.js"])))=>i.map(i=>d[i]);
var Gh=Object.defineProperty;var Kh=(n,e,t)=>e in n?Gh(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var _=(n,e,t)=>Kh(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Yh="modulepreload",Xh=function(n){return"/"+n},fo={},ie=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=Promise.allSettled(t.map(l=>{if(l=Xh(l),l in fo)return;fo[l]=!0;const c=l.endsWith(".css"),h=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${h}`))return;const d=document.createElement("link");if(d.rel=c?"stylesheet":Yh,c||(d.as="script"),d.crossOrigin="",d.href=l,a&&d.setAttribute("nonce",a),document.head.appendChild(d),c)return new Promise((u,p)=>{d.addEventListener("load",u),d.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return i.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};function pn(n,e,t){return Math.max(e,Math.min(t,n))}function P(n,e){return n+Math.random()*(e-n)}function Ve(n,e){return Math.floor(P(n,e+1))}function Qh(n,e){let t=0;for(const s of n)t+=e(s);return t}function ge(n){return Math.sqrt(Math.max(1,n))*1.2}function Mi(n){const i=1050/Math.sqrt(Math.max(1,n));return pn(i,10.5,195)}class Va{constructor(e){_(this,"canvas");_(this,"galaxy");_(this,"tile",null);_(this,"t0",performance.now());_(this,"borderLayer",null);_(this,"borderKey","");_(this,"gridStep",400);this.canvas=e,this.galaxy=this.makeGalaxy(),this.onResize()}onResize(){const e=this.canvas.width,t=this.canvas.height;if(e<=0||t<=0)return;const s=document.createElement("canvas");s.width=e,s.height=t,s.getContext("2d").drawImage(this.galaxy,0,0,this.galaxy.width,this.galaxy.height,0,0,e,t),this.tile=s}makeGalaxy(){const e=document.createElement("canvas");e.width=1920,e.height=1080;const t=e.getContext("2d");t.fillStyle="#030816",t.fillRect(0,0,e.width,e.height);for(let s=0;s<12;s++){const i=Math.random()*e.width,r=Math.random()*e.height,o=Math.random()*280+120,a=t.createRadialGradient(i,r,0,i,r,o),l=(s*30+Math.random()*60)%360;a.addColorStop(0,`hsla(${l},70%,55%,0.20)`),a.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=a,t.beginPath(),t.arc(i,r,o,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255,255,255,0.7)";for(let s=0;s<1200;s++){const i=Math.random()*e.width,r=Math.random()*e.height,o=Math.random()*1.4+.3;t.fillRect(i,r,o,o)}return e}drawBackgroundScreen(e){const t=e.canvas.width,s=e.canvas.height,i=0,r=0;(!this.tile||this.tile.width!==t||this.tile.height!==s)&&this.onResize(),e.save(),e.setTransform(1,0,0,1,0,0),e.fillStyle="#030816",e.fillRect(0,0,t,s);const o=this.tile||this.galaxy,a=e.createPattern(o,"repeat");if(a&&a.setTransform){const l=new DOMMatrix,c=(i%t+t)%t,h=(r%s+s)%s;l.e=-c,l.f=-h,a.setTransform(l),e.fillStyle=a,e.fillRect(0,0,t,s)}else{const l=Math.floor((i%t+t)%t),c=Math.floor((r%s+s)%s),h=[{x:-l,y:-c},{x:-l+t,y:-c},{x:-l,y:-c+s},{x:-l+t,y:-c+s}];for(const d of h)e.drawImage(o,0,0,o.width,o.height,d.x,d.y,t,s)}e.restore()}drawWorldDecor(e){}ensureBorderLayer(e,t){const s=`${t.w}x${t.h}|p${Math.round(e)}`;if(this.borderLayer&&this.borderKey===s)return;const i=document.createElement("canvas");i.width=t.w,i.height=t.h;const r=i.getContext("2d");r.clearRect(0,0,i.width,i.height),r.save(),r.strokeStyle="rgba(255,255,255,0.05)",r.lineWidth=1;for(let d=this.gridStep;d<t.w;d+=this.gridStep)r.beginPath(),r.moveTo(d,0),r.lineTo(d,t.h),r.stroke();for(let d=this.gridStep;d<t.h;d+=this.gridStep)r.beginPath(),r.moveTo(0,d),r.lineTo(t.w,d),r.stroke();r.restore();const o=t.w/2,a=t.h/2,l=Math.max(20,Math.min(t.w,t.h)*.5-e);r.save(),r.lineWidth=14,r.shadowBlur=24,r.shadowColor="rgba(255,255,255,0.25)";let c;const h=64;if(r.createConicGradient){const d=r.createConicGradient(0,o,a);for(let u=0;u<=h;u++){const p=u/h,y=p*360%360;d.addColorStop(p,`hsla(${y},100%,60%,0.90)`)}c=d}else{const d=r.createLinearGradient(o-l,a,o+l,a);for(let u=0;u<=h;u++){const p=u/h,y=p*360%360;d.addColorStop(p,`hsla(${y},100%,60%,0.90)`)}c=d}r.beginPath(),r.strokeStyle=c,r.arc(o,a,l,0,Math.PI*2),r.stroke(),r.restore(),this.borderLayer=i,this.borderKey=s}drawRainbowBorder(e,t,s){this.ensureBorderLayer(t,s),this.borderLayer&&e.drawImage(this.borderLayer,0,0)}}function Jh(n,e=128,t=128){n.clearRect(0,0,e,t),n.fillStyle="#ffbcbc",n.beginPath(),n.arc(e*.5,t*.55,e*.32,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(e*.35,t*.35,e*.12,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(e*.65,t*.35,e*.12,0,Math.PI*2),n.fill(),n.fillStyle="#5b1f1f",n.beginPath(),n.arc(e*.5,t*.55,e*.06,0,Math.PI*2),n.fill(),n.fillStyle="#2f0e0e",n.beginPath(),n.arc(e*.45,t*.5,e*.04,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(e*.55,t*.5,e*.04,0,Math.PI*2),n.fill()}function Zh(n,e=128,t=128){n.clearRect(0,0,e,t),n.fillStyle="#8a2be2",n.beginPath(),n.arc(e*.5,t*.55,e*.18,0,Math.PI*2),n.fill();for(let s=0;s<5;s++){const i=e*.5+Math.cos(s*.5)*s*6,r=t*.5-s*10;n.beginPath(),n.arc(i,r,5,0,Math.PI*2),n.fill()}n.beginPath(),n.arc(e*.5,t*.1,8,0,Math.PI*2),n.fill()}function li(n,e,t=128,s=128){n.clearRect(0,0,t,s),e==="de"?(n.fillStyle="#000",n.fillRect(0,0,t,s/3),n.fillStyle="#dd0000",n.fillRect(0,s/3,t,s/3),n.fillStyle="#ffce00",n.fillRect(0,s*2/3,t,s/3)):e==="it"?(n.fillStyle="#009246",n.fillRect(0,0,t/3,s),n.fillStyle="#fff",n.fillRect(t/3,0,t/3,s),n.fillStyle="#ce2b37",n.fillRect(t*2/3,0,t/3,s)):(n.fillStyle="#0055a4",n.fillRect(0,0,t/3,s),n.fillStyle="#fff",n.fillRect(t/3,0,t/3,s),n.fillStyle="#ef4135",n.fillRect(t*2/3,0,t/3,s))}function Ha(n,e,t,s,i,r,o=0,a="rgba(255,240,120,0.95)"){n.save(),n.translate(e,t),n.rotate(o),n.beginPath();for(let l=0;l<r*2;l++){const c=l%2===0?s:i,h=l/(r*2)*Math.PI*2,d=Math.cos(h)*c,u=Math.sin(h)*c;l===0?n.moveTo(d,u):n.lineTo(d,u)}n.closePath(),n.fillStyle=a,n.shadowColor=a,n.shadowBlur=16,n.fill(),n.restore()}function ed(n,e,t=128,s=128){n.fillStyle="#051023",n.fillRect(0,0,t,s);function i(r){const o=Math.sin(r*57.123+e*13.7)*43758.5453;return o-Math.floor(o)}n.fillStyle="rgba(255,255,255,0.85)";for(let r=0;r<40;r++){const o=i(r)*t,a=i(r+100)*s,l=.8+i(r+200)*1.8;n.beginPath(),n.arc(o,a,l,0,Math.PI*2),n.fill()}}function td(n,e,t=128,s=128){ed(n,e,t,s);const i=t/2,r=s/2,o=5+e%4,a=30+e%3*6,l=a*.44,h=`hsla(${45+e*37%240},100%,70%,0.95)`;Ha(n,i,r,a,l,o,e%12*.18,h)}function nd(n,e,t=128,s=128){n.fillStyle="#060a18",n.fillRect(0,0,t,s);const i=t/2,r=s/2;n.save(),n.translate(i,r),n.strokeStyle="rgba(140,180,255,0.55)",n.lineWidth=2;for(let a=0;a<3;a++){n.beginPath();for(let l=0;l<Math.PI*2;l+=.1){const c=6+l*10,h=l+a*2.1+e*.25,d=Math.cos(h)*c,u=Math.sin(h)*c;l===0?n.moveTo(d,u):n.lineTo(d,u)}n.stroke()}n.restore();const o=n.createRadialGradient(i,r,8,i,r,36);o.addColorStop(0,"rgba(255,255,255,0.9)"),o.addColorStop(1,"rgba(120,160,255,0.2)"),n.fillStyle=o,n.beginPath(),n.arc(i,r,34,0,Math.PI*2),n.fill()}function sd(n,e,t=128,s=128){n.fillStyle="#0b0f22",n.fillRect(0,0,t,s);const i=t/2,r=s/2,o=`hsla(${e*60%360},100%,60%,`;n.fillStyle=o+"0.25)",n.beginPath(),n.arc(i,r,44,0,Math.PI*2),n.fill(),n.strokeStyle=o+"0.85)",n.lineWidth=6,n.beginPath(),n.arc(i,r,36,0,Math.PI*2),n.stroke(),Ha(n,i,r,22,10,6+e%3,e%6*.5,o+"0.95)")}function po(n,e=128,t=128){n.clearRect(0,0,e,t),n.fillStyle="#031a1a",n.fillRect(0,0,e,t),n.strokeStyle="rgba(0,255,200,0.85)",n.lineWidth=3;const s=38,i=e/2,r=t/2;n.beginPath();for(let o=0;o<6;o++){const a=o*Math.PI/3,l=i+Math.cos(a)*s,c=r+Math.sin(a)*s;o===0?n.moveTo(l,c):n.lineTo(l,c)}n.closePath(),n.stroke()}function id(n,e=128,t=128){n.clearRect(0,0,e,t);const s=Ve(0,2);s===0?(n.fillStyle="#000",n.fillRect(0,0,e,t/3),n.fillStyle="#dd0000",n.fillRect(0,t/3,e,t/3),n.fillStyle="#ffce00",n.fillRect(0,t*2/3,e,t/3)):s===1?(n.fillStyle="#009246",n.fillRect(0,0,e/3,t),n.fillStyle="#fff",n.fillRect(e/3,0,e/3,t),n.fillStyle="#ce2b37",n.fillRect(e*2/3,0,e/3,t)):(n.fillStyle="#0055a4",n.fillRect(0,0,e/3,t),n.fillStyle="#fff",n.fillRect(e/3,0,e/3,t),n.fillStyle="#ef4135",n.fillRect(e*2/3,0,e/3,t))}function rd(n,e=128,t=128){n.save(),n.fillStyle="white",n.beginPath(),n.arc(e*.4,t*.5,14,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(e*.6,t*.5,14,0,Math.PI*2),n.fill(),n.fillStyle="#111",n.beginPath(),n.arc(e*.43,t*.52,8,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(e*.63,t*.52,8,0,Math.PI*2),n.fill(),n.restore()}function od(n,e=128,t=128){n.save(),n.rotate(-Math.PI/8),n.fillStyle="rgba(255,255,255,0.8)",n.fillRect(-e,t*.35,e*2,18),n.restore()}function ad(n,e,t=128,s=128){n.save(),n.fillStyle="rgba(255,255,255,0.92)",n.font="bold 88px system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(String.fromCharCode(Ve(65,90)),t/2,s/2),n.restore()}function sr(n,e){const t=document.createElement("canvas");t.width=128,t.height=128;const s=t.getContext("2d"),i=Array.isArray(n)?n:[n],r=i.find(o=>["bear","scorp","flag","neon","flag_de","flag_it","flag_fr","star1","star2","star3","star4","star5","star6","star7","star8","star9","star10","star11","star12","star13","star14","star15","galaxy1","galaxy2","galaxy3","galaxy4","galaxy5","ringstar1","ringstar2","ringstar3"].includes(o));if(r==="bear")Jh(s);else if(r==="scorp")Zh(s);else if(r==="flag")id(s);else if(r==="flag_de")li(s,"de");else if(r==="flag_it")li(s,"it");else if(r==="flag_fr")li(s,"fr");else if(r==="neon")po(s);else if(r&&r.startsWith("star")){const o=Number(r.replace("star",""))||1;td(s,o)}else if(r&&r.startsWith("galaxy")){const o=Number(r.replace("galaxy",""))||1;nd(s,o)}else if(r&&r.startsWith("ringstar")){const o=Number(r.replace("ringstar",""))||1;sd(s,o)}else po(s);for(const o of i)o==="eyes"&&rd(s),o==="stripe"&&od(s),o==="letter"&&ad(s);return t}const ld=["star1",["star2","stripe"],["star3","eyes"],["star4","letter"],"star5",["star6","stripe"],["star7","eyes"],["star8","letter"],"star9",["star10","stripe"],["star11","eyes"],["star12","letter"],"star13",["star14","stripe"],["star15","eyes"],"galaxy1",["galaxy2","stripe"],["galaxy3","eyes"],["galaxy4","letter"],"galaxy5","ringstar1",["ringstar2","stripe"],["ringstar3","eyes"],"neon",["neon","stripe"],["neon","eyes"],["neon","letter"],"flag_de","flag_it","flag_fr","bear",["bear","eyes"],"scorp",["scorp","stripe"]];function ci(){const n=["bear","scorp","flag","neon"],e=["eyes","stripe","letter"],t=[n[Ve(0,n.length-1)]];return Math.random()<.6&&t.push(e[Ve(0,e.length-1)]),sr(t)}const cd=["star","multishot","grow","magnet","lightning"];function hd(n,e,t){const s=n/2,i=e/2,r=Math.max(0,Math.min(n,e)/2-t);return{cx:s,cy:i,R:r}}function mo(n,e,t,s=0,i=[]){const r=[],{cx:o,cy:a,R:l}=hd(n,e,s),h=Math.max(0,l-20);if(h<=0)return r;const d=i.filter(u=>u.kind==="green");for(let u=0;u<t;u++){const p=dd([.05,.35,.25,.2,.35],cd);let y,w;if(p==="multishot"&&d.length>0){const I=d[Math.floor(Math.random()*d.length)],m=Math.random()*Math.PI*2,f=(I.radius??40)+5;y=I.pos.x+Math.cos(m)*f,w=I.pos.y+Math.sin(m)*f;const v=y-o,g=w-a,b=Math.hypot(v,g)||1;if(b>h){const E=h/b;y=o+v*E,w=a+g*E}}else{const I=Math.random()*Math.PI*2,m=Math.sqrt(Math.random())*h;y=o+Math.cos(I)*m,w=a+Math.sin(I)*m}r.push({pos:{x:y,y:w},type:p,ttl:P(28,40)})}return r}function dd(n,e){const t=Math.random()*n.reduce((i,r)=>i+r,0);let s=0;for(let i=0;i<n.length;i++)if(s+=n[i],t<=s)return e[i];return e[e.length-1]}function ud(n,e){if(n.save(),n.translate(e.pos.x,e.pos.y),n.shadowColor="rgba(255,255,255,0.45)",n.shadowBlur=10,e.type==="star"){n.beginPath();for(let o=0;o<10;o++){const a=Math.PI*2/10*o-Math.PI/2,l=o%2===0?12:6,c=Math.cos(a)*l,h=Math.sin(a)*l;o===0?n.moveTo(c,h):n.lineTo(c,h)}n.closePath();const i=performance.now()/400,r=Math.floor(i*120%360);n.fillStyle=`hsla(${r},95%,60%,0.98)`,n.fill()}else if(e.type==="multishot")n.rotate(Math.PI/8),n.fillStyle="rgba(200,220,255,0.98)",n.beginPath(),n.moveTo(12,0),n.lineTo(-8,6),n.lineTo(-8,-6),n.closePath(),n.fill(),n.beginPath(),n.moveTo(-8,0),n.lineTo(-14,4),n.lineTo(-14,-4),n.closePath(),n.fillStyle="rgba(255,120,0,0.9)",n.fill();else if(e.type==="grow")n.beginPath(),n.arc(0,0,12,0,Math.PI*2),n.fillStyle="rgba(180,255,180,0.98)",n.fill(),n.fillStyle="rgba(40,120,40,1)",n.fillRect(-2,-8,4,16),n.fillRect(-8,-2,16,4);else if(e.type==="magnet"){const t=performance.now()/500;n.lineWidth=4,n.strokeStyle="rgba(255,80,80,0.95)",n.beginPath(),n.arc(0,0,10,Math.PI*.2,Math.PI*1.8),n.stroke(),n.strokeStyle="rgba(120,160,255,0.95)",n.beginPath(),n.moveTo(-8,-6),n.lineTo(-4,-6),n.moveTo(-8,6),n.lineTo(-4,6),n.stroke(),n.strokeStyle=`rgba(255,255,255,${.6+.3*Math.sin(t)})`,n.beginPath(),n.moveTo(6,-8),n.lineTo(12,-10),n.moveTo(6,8),n.lineTo(12,10),n.stroke()}else if(e.type==="lightning"){const t=performance.now()/300;n.strokeStyle=`rgba(255,255,0,${.9+.1*Math.sin(t*4)})`,n.lineWidth=3,n.lineCap="round",n.lineJoin="round",n.beginPath(),n.moveTo(-8,-12),n.lineTo(2,-2),n.lineTo(-4,-2),n.lineTo(8,12),n.lineTo(-2,2),n.lineTo(4,2),n.closePath(),n.fill(),n.stroke(),n.fillStyle=`rgba(255,255,255,${.7+.3*Math.sin(t*6)})`;for(let s=0;s<3;s++){const i=(t*2+s*2.1)%(Math.PI*2),r=Math.cos(i)*16,o=Math.sin(i)*16;n.beginPath(),n.arc(r,o,1,0,Math.PI*2),n.fill()}}n.restore()}function fd(n,e,t){const s=n.cells[e];s&&(t.type==="grow"?(s.mass*=1.15,s.radius=Math.sqrt(Math.max(1,s.mass))*1.2):t.type==="star"?n.invincibleTimer=Math.max(n.invincibleTimer,30):t.type==="multishot"?n.multishotTimer=Math.max(n.multishotTimer,14):t.type==="magnet"?n.magnetTimer=Math.max(n.magnetTimer||0,15):t.type==="lightning"&&(n.lightningTimer||0)<=0&&n.invincibleTimer<=0&&(n.lightningTimer=30,n.lightningMassDrainTimer=0))}function $a(n,e,t){const s=n/2,i=e/2,r=Math.max(0,Math.min(n,e)/2-t);return{cx:s,cy:i,R:r}}function gt(n,e){const t=e.x-n.x,s=e.y-n.y,i=Math.hypot(t,s)||1;return{x:t/i,y:s/i}}function pd(n,e,t){const s={x:e.pos.x+e.vel.x*t,y:e.pos.y+e.vel.y*t};return gt(n.pos,s)}function go(n,e,t,s,i){const{cx:r,cy:o,R:a}=$a(e,t,s),l=n.x-r,c=n.y-o,h=Math.hypot(l,c)||1,d=Math.max(1,a-h),u=Math.max(0,i-d);if(u<=0)return{x:0,y:0};const p=l/h,y=c/h;return{x:-p*(u/i),y:-y*(u/i)}}function mn(n,e,t,s){const{cx:i,cy:r,R:o}=$a(e,t,s),a=Math.hypot(n.x-i,n.y-r);return o-a}function md(n,e){const t=Math.min(100,n.length);let s=null;for(let i=0;i<t;i++){const r=n[i*13%n.length],o=r.pos.x,a=r.pos.y;let l=0,c=0;for(let u=0;u<Math.min(220,n.length);u+=7){const p=n[(i*31+u)%n.length];Math.hypot(p.pos.x-o,p.pos.y-a)<200&&(l+=p.mass||1,c++)}const h=Math.hypot(o-e.x,a-e.y)+1,d=l/Math.pow(h,.35)+c*.2;(!s||d>s.score)&&(s={x:o,y:a,score:d})}return s?{x:s.x,y:s.y}:null}function gd(n,e,t,s,i){const o=Math.min(i.width,i.height),a=mn(s.pos,i.width,i.height,i.pad),l=a<Math.max(40,.02*o),c=Math.hypot(s.pos.x-e.pos.x,s.pos.y-e.pos.y)||1;let h=1/0,d=1/0,u=0;for(const[,y]of i.players){if(!y.alive||y.id===n.id)continue;const w=y.cells.reduce((f,v)=>f+v.mass,0),I=Math.hypot(y.cells[0].pos.x-e.pos.x,y.cells[0].pos.y-e.pos.y),m=y.invincibleTimer>0?1.6:1;w*m>=t*1.08&&(h=Math.min(h,I)),w<=t/1.18&&(d=Math.min(d,I),u=Math.max(u,w))}let p=0;s.type==="star"?(p+=14,h<900&&(p+=12),u>t*.6&&d<900&&(p+=6)):s.type==="multishot"?(p+=8,d<800&&(p+=8),h<700&&(p-=5)):s.type==="grow"&&(p+=10,h<900&&(p-=6)),p-=Math.pow(c/1200,1.1)*8,l&&(p-=8),a<20&&(p-=50);for(const[,y]of i.players){if(!y.alive||y.id===n.id)continue;const w=y.cells.reduce((m,f)=>m+f.mass,0),I=Math.hypot(y.cells[0].pos.x-s.pos.x,y.cells[0].pos.y-s.pos.y)||1;w>=t*1.05&&I<c*.8&&(p-=6)}return p}function yd(n,e,t){const{aggroRadius:s,huntRatio:i,fleeRatio:r,edgeAvoidDist:o,wanderJitter:a,interceptLead:l}=n;for(const[,c]of e.players){if(!c.alive||!c.isBot)continue;const h=c.cells.reduce((k,W)=>k+W.mass,0),d=Mi(h),u=c.cells.reduce((k,W)=>k.mass>=W.mass?k:W),p=20,y=mn(u.pos,e.width,e.height,e.pad),w=c.invincibleTimer>0?2:1,I=c.invincibleTimer<=0&&(c.lightningTimer||0)>0?1.44:1,m=(c.speedBoostTimer||0)>0?1.1:1,f=d*w*I*m;if(y<p){const k=go(u.pos,e.width,e.height,e.pad,p),W=gt(u.pos,{x:e.width/2,y:e.height/2});let X=(k.x*6+W.x*3.5)*d*1,Se=(k.y*6+W.y*3.5)*d*1;X+=(Math.random()*2-1)*.25,Se+=(Math.random()*2-1)*.25;for(const ae of c.cells)ae.vel.x+=X*t,ae.vel.y+=Se*t;for(const ae of c.cells){const ve=Math.hypot(ae.vel.x,ae.vel.y);if(ve>f){const ft=f/(ve||1);ae.vel.x*=ft,ae.vel.y*=ft}}continue}let v=null,g=null;for(const[,k]of e.players)if(!(!k.alive||k.id===c.id))for(const W of k.cells){const X=Math.hypot(W.pos.x-u.pos.x,W.pos.y-u.pos.y);if(X>s)continue;const Se=k.cells.reduce((je,on)=>je+on.mass,0),ae=k.invincibleTimer>0?1.8:1,ve=Se*ae/Math.max(1,h),ft=mn(W.pos,e.width,e.height,e.pad)<p;if(ve>=r)(!v||X<v.d)&&(v={p:k,c:W,d:X});else if(ve<=1/i){if(ft)continue;const je=Se/Math.max(40,X);(!g||je>g.value)&&(g={p:k,c:W,d:X,value:je})}}let b,E=-1/0;for(const k of e.powerups){const W=gd(c,u,h,k,e);W>E&&(E=W,b=k)}const T=md(e.pellets,u.pos);let x=0,A=0;const M=go(u.pos,e.width,e.height,e.pad,o),O=mn(u.pos,e.width,e.height,e.pad),V=Math.max(.8,1.4+o/Math.max(20,O)*1.6);x+=M.x*V*2.2,A+=M.y*V*2.2;const Q=v&&v.d<900,te=b&&E>8;if(te&&b){if(mn(b.pos,e.width,e.height,e.pad)>=p){const W=gt(u.pos,b.pos);if(x+=W.x*d*2.8,A+=W.y*d*2.8,Q){const X=gt(u.pos,v.c.pos);x-=X.x*d*2.4,A-=X.y*d*2.4}}}else if(v&&(!g||v.d<g.d*.9)){const k=gt(u.pos,v.c.pos);x-=k.x*d*3.8,A-=k.y*d*3.8}else if(g){const k=pd({pos:u.pos},{pos:g.c.pos,vel:g.c.vel},l*1.35);x+=k.x*d*3.1,A+=k.y*d*3.1}else if(T){const k=gt(u.pos,T);x+=k.x*d*2.4,A+=k.y*d*2.4}else{const k={x:e.width/2,y:e.height/2},W=gt(u.pos,k);x+=W.x*d*1.6,A+=W.y*d*1.6}const ne=te||v||g?.5:1;x+=(Math.random()*2-1)*a*ne,A+=(Math.random()*2-1)*a*ne;for(const k of c.cells){k.vel.x+=x*t,k.vel.y+=A*t;const W=Math.hypot(k.vel.x,k.vel.y);if(W>f){const X=f/(W||1);k.vel.x*=X,k.vel.y*=X}}}}const _n=100;let _d=1,de=()=>{},vn=()=>{};function za(n){n.onXpGain&&(de=n.onXpGain),n.onLevelUp&&(vn=n.onLevelUp)}const qa="nc.xp.v1";function Ga(n){const e=Math.floor(Number(n)||1);return Math.min(Math.max(e,1),_n)}function ir(n){return n=Ga(n),Math.round(100*Math.pow(n,1.5))}function rr(n){const e=Ga((n==null?void 0:n.level)??1),t=Math.max(0,Math.floor(Number((n==null?void 0:n.xpCurrent)??0))),s=Math.max(0,Math.floor(Number((n==null?void 0:n.xpTotal)??0)));return{level:e,xpCurrent:t,xpTotal:s}}function vd(){try{const n=localStorage.getItem(qa);return n?rr(JSON.parse(n)):{level:1,xpCurrent:0,xpTotal:0}}catch{return{level:1,xpCurrent:0,xpTotal:0}}}function Pi(n){try{localStorage.setItem(qa,JSON.stringify(n))}catch{}}let He=vd();function Ye(){return{...He}}function Ka(n,e){return n.level!==e.level?n.level>e.level?n:e:n.xpTotal!==e.xpTotal?n.xpTotal>e.xpTotal?n:e:n.xpCurrent>=e.xpCurrent?n:e}async function Ya(n){try{const{db:e}=await ie(async()=>{const{db:o}=await Promise.resolve().then(()=>kn);return{db:o}},void 0),{ref:t,get:s,child:i}=await ie(async()=>{const{ref:o,get:a,child:l}=await Promise.resolve().then(()=>Oh);return{ref:o,get:a,child:l}},void 0),r=await s(i(t(e),`users/${n}/xp`));return r.exists()?rr(r.val()):null}catch{return null}}async function Xa(n,e){try{const{db:t}=await ie(async()=>{const{db:r}=await Promise.resolve().then(()=>kn);return{db:r}},void 0),{ref:s,set:i}=await ie(async()=>{const{ref:r,set:o}=await Promise.resolve().then(()=>Oh);return{ref:r,set:o}},void 0);await i(s(t,`users/${n}/xp`),e)}catch{}}async function bd(n){const e=Ye(),t=await Ya(n)??null,s=t?Ka(e,t):e;He=rr(s),Pi(He);try{await Xa(n,He)}catch{}return Ye()}function Wt(n,e){const t=Math.max(0,Math.floor(n*_d));if(t<=0)return{leveledUp:[],state:Ye(),gained:0};const s=[];let{level:i,xpCurrent:r,xpTotal:o}=He;if(o+=t,i>=_n)return r+=t,de==null||de(t,e),He={level:i,xpCurrent:r,xpTotal:o},Pi(He),{leveledUp:[],state:Ye(),gained:t};let a=t;for(;a>0&&i<_n;){const l=ir(i)-r;a>=l?(r+=l,a-=l,de==null||de(l,e),i+=1,r=0,s.push(i),vn==null||vn(i)):(r+=a,de==null||de(a,e),a=0)}return i>=_n&&a>0&&(r+=a,de==null||de(a,e),a=0),He={level:i,xpCurrent:r,xpTotal:o},Pi(He),{leveledUp:s,state:Ye(),gained:t}}function is(){const n=Ye(),e=ir(n.level),t=n.level>=_n?Math.min(n.xpCurrent,e):n.xpCurrent,s=Math.min(1,t/Math.max(1,e));return{value:t,max:e,label:`Level ${n.level}`,percent:s}}function Ri(){let n=0,e=0,t=0,s=0,i=0,r=0,o=0;const a=()=>{e=Math.min(e,200)},l=()=>{t=Math.min(t,200)};function c(){const h=s+i+n+e+t;return{participation:s,placement:i,kills:n,mass:e,time:t,total:h}}return{kill:h=>h&&h.valid===!1?0:(n+=15,Wt(15,"kill"),15),addMass:h=>{const d=Math.max(0,Math.floor(h||0));if(d<=0)return 0;r+=d;let p=Math.floor(r/100)*2-e;if(p<=0)return 0;const y=e;return e+=p,a(),p=e-y,p>0&&Wt(p,"mass"),p},addTime:h=>{const d=Math.max(0,Math.floor(h||0));if(d<=0)return 0;o+=d;let p=Math.floor(o/60)*10-t;if(p<=0)return 0;const y=t;return t+=p,l(),p=t-y,p>0&&Wt(p,"time"),p},finalize:h=>{s===0&&(s=20,Wt(20,"participation")),h=Math.floor(Number(h||0));let d=0;return h===1?d=100:h>=2&&h<=5?d=50:h>=6&&h<=10?d=20:d=0,d>0&&(i=d,Wt(d,"placement")),a(),l(),c()},getBreakdown:()=>c(),reset:()=>{n=0,e=0,t=0,s=0,i=0,r=0,o=0}}}const Ds=Object.freeze(Object.defineProperty({__proto__:null,addXp:Wt,fetchCloudXp:Ya,getState:Ye,getUiProgress:is,newMatchTracker:Ri,get onLevelUp(){return vn},get onXpGain(){return de},pickHigherState:Ka,saveCloudXp:Xa,setHooks:za,syncWithCloud:bd,xpNeeded:ir},Symbol.toStringTag,{value:"Module"})),wd=100,Id=200,Ed=.1,Sd=.85,Td=.92,yo=450,_o=1600,vo=100,bo=4,Cd=.045,xd=1.06,kd=.72,wo=.75,hi=150,di=15;function mt(n,e,t={x:0,y:0}){return{pos:{...e},vel:{...t},mass:n,radius:ge(n),mergeCooldown:6}}function gn(n,e,t){const s=n/2,i=e/2,r=Math.max(0,Math.min(n,e)/2-t);return{cx:s,cy:i,R:r}}function Md(n,e,t,s,i){const{cx:r,cy:o,R:a}=gn(t,s,i),l=Math.hypot(n-r,e-o);return a-l}function Pd(n,e,t,s,i,r,o){let a=1/0;for(const[,h]of t)if(h.alive)for(const d of h.cells){const u=Math.hypot(n-d.pos.x,e-d.pos.y)-d.radius;u<a&&(a=u)}let l=1/0;for(const h of s){const d=Math.hypot(n-h.pos.x,e-h.pos.y)-h.radius*1.2;d<l&&(l=d)}const c=Md(n,e,i,r,o);return Math.min(a,l,c*1.1)}const Bt=["Neo","Luna","Hex","Bär","Scorp","Vox","Zed","Milo","Rex","Kiro","Yui","Ivy","Sol","Jax","Kai","Nox","Nia","Rio","Aki","Mika","Orion","Zoe","Uma","Pax","Lux","Jin","Noa","Fox"];class Rd{constructor(e){_(this,"canvas");_(this,"ctx");_(this,"level");_(this,"players",new Map);_(this,"pellets",[]);_(this,"viruses",[]);_(this,"powerups",[]);_(this,"bullets",[]);_(this,"particles",[]);_(this,"me");_(this,"onGameOver");_(this,"world",{w:5e3,h:5e3});_(this,"shrinkStart",2e4);_(this,"shrinkDur",6e4);_(this,"zoneDps",15);_(this,"currentZoom",1);_(this,"zoomBias",0);_(this,"lastZoneR",Math.min(this.world.w,this.world.h)/2);_(this,"botParams",{aggroRadius:1800,huntRatio:1.05,fleeRatio:1.25,edgeAvoidDist:280,wanderJitter:.18,interceptLead:1.2});_(this,"blackholeSpawnTimer",0);_(this,"blackholeRespawnTimer",5*60*1e3);_(this,"blackholeActive",!1);_(this,"targetBotCount",69);_(this,"maxEatsPerFrame",64);_(this,"botTickStep",1/30);_(this,"botTickAccum",0);_(this,"redStartMs",3e4);_(this,"redSpawnEveryMs",6e3);_(this,"redSpawnTimer",0);_(this,"redMax",6);_(this,"redVolleyEvery",6.5);_(this,"redBulletsPerVolley",18);_(this,"greenMax",20);_(this,"mergeTime",15);_(this,"selfCohesionK",.33);_(this,"selfCohesionDamp",.2);_(this,"selfCooldownPull",.06);_(this,"pairMergeDelay",15);_(this,"mainAttractAccel",260);_(this,"splitSpeed",520);_(this,"recoil",140);_(this,"minSplitMass",35);_(this,"selfSolidPush",.85);_(this,"splitImpulseSec",.1);_(this,"splitDampImpulse",.85);_(this,"splitDampNormal",.92);_(this,"splitDistMin",40);_(this,"splitDistMax",120);_(this,"splitCapBase",450);_(this,"splitCapK",1600);_(this,"mergeBase",12);_(this,"mergeSqrtK",.06);_(this,"postMergeShield",1);_(this,"ejectLoss",18);_(this,"ejectGive",13);_(this,"ejectRate",7);_(this,"_ejectCooldown",0);_(this,"meSurvivalMs",0);_(this,"meMaxMass",0);_(this,"gameOverTriggered",!1);_(this,"auraEveryN",5);_(this,"frameIndex",0);_(this,"moveTickStep",1/30);_(this,"moveTickAccum",0);_(this,"maxAccel",900);_(this,"isMobile",!1);_(this,"mobileNoShadows",!1);_(this,"reducedVisualEffects",!1);_(this,"simplifiedRendering",!1);_(this,"disableNonEssentialEffects",!1);_(this,"pelletTarget",1e3);_(this,"initialPelletCount",360);_(this,"maxParticles",900);_(this,"frameTime",0);_(this,"lastFrameTime",0);_(this,"fpsHistory",[]);_(this,"performanceAdjusted",!1);_(this,"realPlayerCount",0);_(this,"ws");_(this,"playerId");_(this,"matchTracker",Ri());_(this,"lastTrackedMass",0);_(this,"serverMessages",[]);_(this,"SERVER_MESSAGE_DURATION",4e3);var i;this.canvas=e;const t=()=>{var l,c;const r=e.getBoundingClientRect();let o=Math.max(1,Math.round(r.width)),a=Math.max(1,Math.round(r.height));if(this.isMobile&&this.simplifiedRendering){const d=(window.devicePixelRatio||1)>2?.75:.85;o=Math.round(o*d),a=Math.round(a*d)}(e.width!==o||e.height!==a)&&(e.width=o,e.height=a,(c=(l=this.level)==null?void 0:l.onResize)==null||c.call(l))};window.addEventListener("resize",t);try{(i=window.visualViewport)==null||i.addEventListener("resize",t,{passive:!0})}catch{}const s=e.getContext("2d");if(!s)throw new Error("no 2d context");this.ctx=s,this.level=new Va(e);try{this.isMobile=typeof window<"u"&&!!(window.matchMedia&&window.matchMedia("(pointer: coarse)").matches);const r=sessionStorage.getItem("mobileOptimized");r==="true"?(this.reducedVisualEffects=!0,this.simplifiedRendering=!0,this.disableNonEssentialEffects=!0):r==="basic"&&(this.reducedVisualEffects=!0),typeof navigator<"u"&&navigator.deviceMemory&&navigator.deviceMemory<=2&&(this.reducedVisualEffects=!0,this.simplifiedRendering=!0,this.disableNonEssentialEffects=!0)}catch{this.isMobile=!1}this.applyPerfPreset(),t()}draw(e){var f,v;const{ctx:t,canvas:s}=this,i=this.players.get(this.me);if(!i||!i.alive||i.cells.length===0){t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,s.width,s.height),this.level.drawBackgroundScreen(t),t.restore();return}let r=0,o=0,a=0;for(const g of i.cells)r+=g.pos.x*g.mass,o+=g.pos.y*g.mass,a+=g.mass;const l={x:r/Math.max(1,a),y:o/Math.max(1,a)},c=Math.max(this.totalMass(i),100),h=Math.min(s.width/1920,s.height/1080),d=Math.max(1,i.cells.length);let p=1.9/(Math.pow(c/100,.12)*(1+(d-1)*.05));p+=this.zoomBias;const y=pn(p,1.2,2.6);this.currentZoom=this.currentZoom+(y-this.currentZoom)*.08;const w=h*this.currentZoom;t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,s.width,s.height),this.simplifiedRendering||this.level.drawBackgroundScreen(t),t.save(),t.translate(s.width/2,s.height/2),t.scale(w,w),t.translate(-l.x,-l.y);const I=this.outsidePad(e);this.simplifiedRendering||(v=(f=this.level).drawRainbowBorder)==null||v.call(f,t,I,this.world);for(const g of this.pellets)t.beginPath(),t.arc(g.pos.x,g.pos.y,Math.max(2,Math.sqrt(g.mass)*.8),0,Math.PI*2),t.fillStyle="rgba(255,255,255,0.82)",t.fill();for(const g of this.viruses){const b=g;if(b.kind==="blackhole"){const E=performance.now()/1e3,T=1+Math.sin(E*3)*.1,x=b.imploding?8:2;t.save(),t.translate(b.pos.x,b.pos.y),t.rotate(E*x);const A=b.radius*T,M=t.createRadialGradient(0,0,0,0,0,A);M.addColorStop(0,"rgba(0, 0, 0, 1)"),M.addColorStop(.6,"rgba(20, 0, 40, 0.9)"),M.addColorStop(.8,"rgba(80, 20, 120, 0.6)"),M.addColorStop(1,"rgba(150, 80, 200, 0.3)"),t.beginPath(),t.arc(0,0,A,0,Math.PI*2),t.fillStyle=M,t.fill();const O=this.isMobile?6:12;for(let V=0;V<O;V++){const Q=V/O*Math.PI*2+E*2,te=A*(.7+Math.sin(E*4+V)*.2),ne=Math.cos(Q)*te,k=Math.sin(Q)*te,W=this.isMobile?2+Math.sin(E*6+V)*1:3+Math.sin(E*6+V)*2;t.beginPath(),t.arc(ne,k,W,0,Math.PI*2),t.fillStyle=`hsla(${270+V*10}, 80%, 60%, ${.8-te/A*.5})`,t.fill()}if(t.beginPath(),t.arc(0,0,4,0,Math.PI*2),t.fillStyle="rgba(0, 0, 0, 1)",t.fill(),this.mobileNoShadows||(t.shadowColor="rgba(150, 80, 200, 0.8)",t.shadowBlur=40,t.beginPath(),t.arc(0,0,A*1.2,0,Math.PI*2),t.strokeStyle="rgba(150, 80, 200, 0.4)",t.lineWidth=2,t.stroke()),b.imploding&&!this.mobileNoShadows){const V=b.implodeProgress||0;t.shadowBlur=60,t.shadowColor="rgba(255, 255, 255, 1)",t.beginPath(),t.arc(0,0,A*(1-V),0,Math.PI*2),t.strokeStyle=`rgba(255, 255, 255, ${V})`,t.lineWidth=6,t.stroke()}t.restore()}else{const E=b.kind==="red",T=E?18:14,x=b.radius,A=b.radius*.64,M=b.ang??0;t.save(),t.translate(b.pos.x,b.pos.y),t.rotate(M),t.beginPath();for(let O=0;O<T*2;O++){const Q=O%2===0?x:A,te=Math.PI*2/(T*2)*O,ne=Math.cos(te)*Q,k=Math.sin(te)*Q;O===0?t.moveTo(ne,k):t.lineTo(ne,k)}t.closePath(),E?(t.shadowColor="rgba(255,60,60,0.55)",t.shadowBlur=18,t.fillStyle="rgba(255,60,60,0.92)",t.strokeStyle="rgba(120,0,0,0.95)"):(t.shadowColor="rgba(0,255,160,0.45)",t.shadowBlur=14,t.fillStyle="rgba(66,245,152,0.9)",t.strokeStyle="rgba(0,120,60,0.9)"),t.lineWidth=3,t.fill(),t.stroke(),t.beginPath(),t.arc(0,0,A*.45,0,Math.PI*2),t.fillStyle=E?"rgba(255,120,120,0.55)":"rgba(120,255,200,0.45)",t.fill(),t.restore()}}for(const g of this.powerups)ud(t,g);for(const g of this.bullets)if(g.kind==="rocket"){t.save(),t.translate(g.pos.x,g.pos.y);const b=Math.atan2(g.vel.y,g.vel.x);t.rotate(b),t.fillStyle="rgba(200,220,255,0.95)",t.beginPath(),t.moveTo(8,0),t.lineTo(-6,4),t.lineTo(-6,-4),t.closePath(),t.fill(),t.beginPath(),t.moveTo(-6,0),t.lineTo(-12,3),t.lineTo(-12,-3),t.closePath(),t.fillStyle="rgba(255,120,0,0.9)",t.fill(),t.restore()}else t.beginPath(),t.arc(g.pos.x,g.pos.y,Math.sqrt(g.mass),0,Math.PI*2),t.fillStyle="rgba(255,120,120,0.95)",t.fill();for(const[,g]of this.players){if(!g.alive)continue;for(const E of g.cells){t.save(),g.invincibleTimer>0&&(t.shadowColor="rgba(255,215,0,0.9)",t.shadowBlur=30),t.beginPath(),t.arc(E.pos.x,E.pos.y,E.radius,0,Math.PI*2);const T=g.skinCanvas;T?(t.save(),t.clip(),t.drawImage(T,E.pos.x-E.radius,E.pos.y-E.radius,E.radius*2,E.radius*2),t.restore()):(t.fillStyle=g.skinPattern||g.color,t.fill()),t.lineWidth=3,t.strokeStyle=g.invincibleTimer>0?"rgba(255,215,0,0.9)":"rgba(0,0,0,0.35)",t.stroke(),t.restore()}const b=this.largestCell(g);t.fillStyle="rgba(255,255,255,0.9)",t.font="600 14px system-ui, sans-serif",t.textAlign="center",t.fillText(`${g.name??""} ${Math.round(this.totalMass(g))}`,b.pos.x,b.pos.y-b.radius-10)}for(const g of this.particles)if(g.type==="spark")t.save(),t.globalAlpha=Math.max(0,g.life),t.fillStyle=`hsla(${g.hue},100%,60%,${.9*g.life})`,t.beginPath(),t.arc(g.pos.x,g.pos.y,g.size,0,Math.PI*2),t.fill(),t.restore();else if(g.type==="shock"){t.save();const b=(1-g.life)*120+8;t.strokeStyle=`rgba(200,220,255,${g.life*.5})`,t.lineWidth=3,t.beginPath(),t.arc(g.pos.x,g.pos.y,b,0,Math.PI*2),t.stroke(),t.restore()}else g.type==="streak"?(t.save(),t.globalAlpha=Math.max(0,g.life*.8),t.strokeStyle=`hsla(${g.hue},100%,70%,${.85*g.life})`,t.lineWidth=2,t.beginPath(),t.moveTo(g.pos.x-g.vel.x*.05,g.pos.y-g.vel.y*.05),t.lineTo(g.pos.x,g.pos.y),t.stroke(),t.restore()):g.type==="smoke"&&(t.save(),t.globalAlpha=Math.max(0,g.life*.6),t.fillStyle="rgba(180,200,255,0.3)",t.beginPath(),t.arc(g.pos.x,g.pos.y,g.size*1.2,0,Math.PI*2),t.fill(),t.restore());t.restore();const m=t.createRadialGradient(s.width/2,s.height/2,Math.min(s.width,s.height)*.6,s.width/2,s.height/2,Math.max(s.width,s.height)*.9);m.addColorStop(0,"rgba(0,0,0,0)"),m.addColorStop(1,"rgba(0,0,0,0.35)"),t.fillStyle=m,t.fillRect(0,0,s.width,s.height),this.drawServerMessages(t),t.restore()}drawServerMessages(e){const t=Date.now();if(this.serverMessages=this.serverMessages.filter(a=>t-a.timestamp<this.SERVER_MESSAGE_DURATION),this.serverMessages.length===0)return;e.save(),e.textAlign="left",e.font="700 14px system-ui, sans-serif";const s=20,i=25,r=12,o=350;this.serverMessages.forEach((a,l)=>{const c=s+l*i,h=t-a.timestamp,d=this.SERVER_MESSAGE_DURATION-1e3,u=h>d?Math.max(0,1-(h-d)/1e3):1;e.fillStyle=`rgba(0, 0, 0, ${.7*u})`,e.fillRect(10,c-10,o,20);let p="rgba(100, 150, 200, 0.8)";a.type==="join"?p="rgba(34, 197, 94, 0.8)":a.type==="leave"?p="rgba(239, 68, 68, 0.8)":a.type==="playerCount"&&(p="rgba(168, 85, 247, 0.8)"),e.strokeStyle=p.replace("0.8",String(u*.8)),e.lineWidth=2,e.strokeRect(10,c-10,o,20),e.fillStyle=`rgba(255, 255, 255, ${.95*u})`,e.fillText(a.text,10+r,c+2)}),e.restore()}step(e,t,s){var y,w,I;const i=e/1e3;if(this.isMobile){const m=performance.now();this.lastFrameTime>0&&(this.frameTime=m-this.lastFrameTime,this.fpsHistory.push(1e3/this.frameTime),this.fpsHistory.length>60&&this.fpsHistory.shift(),this.fpsHistory.length>=30&&!this.performanceAdjusted&&this.fpsHistory.reduce((v,g)=>v+g,0)/this.fpsHistory.length<45&&(this.autoAdjustPerformance(),this.performanceAdjusted=!0,console.log("🔧 Auto-adjusted performance for mobile device"))),this.lastFrameTime=m}const r=this.outsidePad(s),{cx:o,cy:a,R:l}=gn(this.world.w,this.world.h,r);this.lastZoneR=l,this.frameIndex++;const c=t.wheelTicks||0;c!==0&&(this.zoomBias=Math.max(-.8,Math.min(.8,this.zoomBias-Math.sign(c)*.06)),t.wheelTicks=0);const h=this.players.get(this.me);if(h!=null&&h.alive){this.meSurvivalMs+=e,this.meMaxMass=Math.max(this.meMaxMass,this.totalMass(h)),this.matchTracker.addTime(i);const m=this.totalMass(h);m>this.lastTrackedMass&&(this.matchTracker.addMass(m-this.lastTrackedMass),this.lastTrackedMass=m)}if(h!=null&&h.alive){const m=t.speedTapCount||0;if(m>0){h.speedBoostTimer=Math.min(2,(h.speedBoostTimer||0)+.35);let v=1;h.cells.sort((g,b)=>g.mass-b.mass);for(const g of h.cells){if(v<=0)break;const b=Math.min(g.mass-1,v);b>0&&(g.mass-=b,g.radius=ge(g.mass),v-=b)}t.speedTapCount=Math.max(0,m-1)}}for(const[,m]of this.players)if(m.alive&&(m.invincibleTimer=Math.max(0,m.invincibleTimer-i),m.multishotTimer=Math.max(0,m.multishotTimer-i),m.speedBoostTimer=Math.max(0,(m.speedBoostTimer||0)-i),m.magnetTimer=Math.max(0,(m.magnetTimer||0)-i),m.lightningTimer!==void 0&&(m.lightningTimer=Math.max(0,(m.lightningTimer||0)-i),m.lightningTimer>0&&(m.lightningMassDrainTimer=(m.lightningMassDrainTimer||0)+i,m.lightningMassDrainTimer>=2)))){m.lightningMassDrainTimer=0;for(const f of m.cells)f.mass=Math.max(10,f.mass-2),f.radius=ge(f.mass)}let d={x:1,y:0};if(h!=null&&h.cells[0]){let m=0,f=0,v=0;for(const M of h.cells)m+=M.pos.x*M.mass,f+=M.pos.y*M.mass,v+=M.mass;m/=Math.max(1,v),f/=Math.max(1,v);const g=Math.min(this.canvas.width/1920,this.canvas.height/1080)*this.currentZoom,b=this.updateWorldPosition(m,f,g,t),E=b.worldX-m,T=b.worldY-f,x=Math.hypot(E,T)||1;if(d={x:E/x,y:T/x},!!(t.splitPressed||t.split||t.space)){const M=Math.hypot(E,T),O=M>.001?{x:E/M,y:T/M}:{x:1,y:0};this.performSplit(this.me,O),t.splitPressed=!1,t.split=!1,t.space=!1}}if(h!=null&&h.alive){this._ejectCooldown=Math.max(0,this._ejectCooldown-i);const m=!!t.ejectHeld;let f=t.ejectTapCount||0;if(m&&this._ejectCooldown<=0&&(f+=1),f>0){const v=Math.min(f,Math.max(1,Math.floor(this.ejectRate*i*2)));for(let g=0;g<v;g++)this.playerEject(h,t);t.ejectTapCount=Math.max(0,(t.ejectTapCount||0)-v),this._ejectCooldown=1/this.ejectRate}}this.moveTickAccum+=i;let u=0;for(;this.moveTickAccum>=this.moveTickStep&&u<2;){if(h!=null&&h.alive){let m=t.dash?1.22:1;h.invincibleTimer>0?m*=2:h.lightningTimer>0&&(m*=1.44),(h.speedBoostTimer||0)>0&&(m*=1.1);for(const f of h.cells){const v=Mi(Math.max(1,f.mass))*m;f._mvTarget={x:d.x*v,y:d.y*v,cap:v}}}this.moveTickAccum-=this.moveTickStep,u++}this.botTickAccum+=i;let p=0;for(;this.botTickAccum>=this.botTickStep&&p<2;)yd(this.botParams,{width:this.world.w,height:this.world.h,pad:r,pellets:this.pellets,powerups:this.powerups,players:this.players},this.botTickStep),this.botTickAccum-=this.botTickStep,p++;for(const[,m]of this.players)if(m.alive)for(const f of m.cells){if(this.tickSplitMotion(f,i),!f._splitTarget){if((f._splitTime??0)>=di&&m.cells.length>1){const M=this.largestCell(m);if(M&&M!==f){const O=M.pos.x-f.pos.x,V=M.pos.y-f.pos.y,Q=Math.hypot(O,V);if(Q>5){const te=O/(Q||1),ne=V/(Q||1),k=400;f.vel.x=te*k,f.vel.y=ne*k,f._forceReturning=!0}}}else if(!f._forceReturning){const M=f._mvTarget;if(M){const O=M.x-f.vel.x,V=M.y-f.vel.y,Q=Math.hypot(O,V);if(Q>0){const te=this.maxAccel*i,ne=Math.min(1,te/Q);f.vel.x+=O*ne,f.vel.y+=V*ne}}}let T=1;m.invincibleTimer>0?T*=2:m.lightningTimer>0&&(T*=1.44),m.speedBoostTimer>0&&(T*=1.1);let x=Mi(Math.max(1,f.mass))*T*1.6;f._forceReturning&&(x*=3);const A=Math.hypot(f.vel.x,f.vel.y);if(A>x){const M=x/(A||1);f.vel.x*=M,f.vel.y*=M}f.pos.x=pn(f.pos.x+f.vel.x*i,0,this.world.w),f.pos.y=pn(f.pos.y+f.vel.y*i,0,this.world.h)}if(m.cells.length>1&&!f._forceReturning){const E=this.largestCell(m);if(E&&E!==f){const T=f.pos.x-E.pos.x,x=f.pos.y-E.pos.y,A=Math.hypot(T,x);if(A>hi){const M=T/(A||1),O=x/(A||1);f.pos.x=E.pos.x+M*hi,f.pos.y=E.pos.y+O*hi;const V=f.vel.x*M+f.vel.y*O;V>0&&(f.vel.x-=M*V,f.vel.y-=O*V)}}}const v=f.pos.x-o,g=f.pos.y-a,b=Math.hypot(v,g)||1;if(b>l){const E=(l-.5)/b;f.pos.x=o+v*E,f.pos.y=a+g*E,m.invincibleTimer<=0&&(f.mass=Math.max(10,f.mass-this.zoneDps*i),f.radius=ge(f.mass))}}if(this.frameIndex%this.auraEveryN===0)for(const[,m]of this.players){const f=m.magnetTimer||0;if(!(!m.alive||f<=0))for(const v of m.cells){const g=v.radius+100,b=g*g;for(const E of this.pellets){const T=v.pos.x-E.pos.x,x=v.pos.y-E.pos.y,A=T*T+x*x;if(A<=b){const M=Math.sqrt(A)||1,O=M-v.radius,V=T/M,Q=x/M,k=140*pn(1-Math.max(0,O)/100,0,1)*Math.min(this.auraEveryN,6);E.vel||(E.vel={x:0,y:0}),E.vel.x+=V*k*i,E.vel.y+=Q*k*i}}}}for(const m of this.pellets)m.vel&&(m.pos.x+=m.vel.x*i,m.pos.y+=m.vel.y*i,m.vel.x*=.93,m.vel.y*=.93),m.life!==void 0&&(m.life-=i);for(let m=this.pellets.length-1;m>=0;m--){const f=this.pellets[m];if(f.vel)for(const v of this.viruses){if(v.kind==="red")continue;const g=f.pos.x-v.pos.x,b=f.pos.y-v.pos.y;if(Math.hypot(g,b)<=v.radius+4){v.fed=(v.fed||0)+1,v._lastDir={x:f.vel.x,y:f.vel.y},this.pellets.splice(m,1);break}}}for(const m of this.viruses)if(m.kind!=="red"&&(m.fed||0)>=7){const f=m._lastDir||{x:1,y:0},v=Math.hypot(f.x,f.y)||1,g={x:f.x/v,y:f.y/v},b={pos:{x:m.pos.x+g.x*m.radius*3,y:m.pos.y+g.y*m.radius*3},radius:m.radius,vel:{x:g.x*40,y:g.y*40},ang:0,spin:.1,kind:"green"},E=b.pos.x-o,T=b.pos.y-a,x=Math.hypot(E,T)||1,A=Math.max(0,l-b.radius-2);x>A&&(b.pos.x=o+E/x*A,b.pos.y=a+T/x*A),this.viruses.filter(O=>O.kind==="green").length<this.greenMax&&this.viruses.push(b),m.fed=0}for(let m=this.pellets.length-1;m>=0;m--){const f=this.pellets[m];let v=!1;this.players.forEach(g=>{if(!(v||!g.alive)){for(const b of g.cells)if(Math.hypot(f.pos.x-b.pos.x,f.pos.y-b.pos.y)<b.radius*.9){const T=f.mass??Ve(3,5);b.mass+=T,b.radius=ge(b.mass),v=!0;const x=Math.random()*Math.PI*2,A=Math.sqrt(Math.random())*Math.max(0,l-60),M=o+Math.cos(x)*A,O=a+Math.sin(x)*A;this.pellets[m]={pos:{x:M,y:O},mass:P(1,4)};break}}})}{const m=this.pelletTarget;if(this.pellets.length<m){const f=Math.min(8,m-this.pellets.length);for(let v=0;v<f;v++){const g=Math.random()*Math.PI*2,b=Math.sqrt(Math.random())*Math.max(0,l-60),E=o+Math.cos(g)*b,T=a+Math.sin(g)*b;this.pellets.push({pos:{x:E,y:T},mass:P(1,4)})}}}for(let m=this.viruses.length-1;m>=0;m--){const f=this.viruses[m];if(f.ang===void 0&&(f.ang=0),f.spin===void 0&&(f.spin=.08),f.ang+=f.spin*i,f.vel||(f.vel={x:0,y:0}),f.kind==="blackhole")this.updateBlackhole(f,i),this.applyBlackholeGravity(f,i);else{Math.random()<.015*(e/16.67)&&(f.vel.x+=P(-4,4),f.vel.y+=P(-4,4)),f.vel.x*=.99,f.vel.y*=.99,f.pos.x+=(((y=f.vel)==null?void 0:y.x)??0)*i,f.pos.y+=(((w=f.vel)==null?void 0:w.y)??0)*i;const v=f.pos.x-o,g=f.pos.y-a,b=Math.hypot(v,g)||1,E=Math.max(0,l-f.radius);if(b>E){const T=v/b,x=g/b;if(f.pos.x=o+T*E,f.pos.y=a+x*E,f.vel){const A=f.vel.x*T+f.vel.y*x;f.vel.x-=2*A*T,f.vel.y-=2*A*x,f.vel.x*=.8,f.vel.y*=.8}}}for(const[,v]of this.players)if(v.alive)for(const g of v.cells)f.kind!=="blackhole"&&this.handleVirusCollision(v,g,f);if(f.kind==="red"){if(f.volleyT=(f.volleyT??this.redVolleyEvery)-i,f.volleyT<=0){f.volleyT=this.redVolleyEvery;const v=this.redBulletsPerVolley,g=340,b=4.2*f.radius;for(let E=0;E<v;E++){const T=E/v*Math.PI*2,x={x:Math.cos(T),y:Math.sin(T)};this.bullets.push({kind:"hazard",pos:{x:f.pos.x,y:f.pos.y},vel:{x:x.x*g,y:x.y*g},mass:10,owner:"hazard",ttl:2,rangeLeft:b})}}if(f.ttl=(f.ttl??25)-i,f.ttl<=0){this.spawnImplosion(f.pos.x,f.pos.y),this.viruses.splice(m,1);continue}}}for(let m=this.powerups.length-1;m>=0;m--){const f=this.powerups[m];if(f.ttl-=i,f.ttl<=0){this.powerups.splice(m,1);continue}let v=!1;for(const[,g]of this.players)if(g.alive){for(const b of g.cells)if(Math.hypot(f.pos.x-b.pos.x,f.pos.y-b.pos.y)<b.radius+14){this.pickPowerUp(g,b,f),v=!0;break}if(v)break}v&&this.powerups.splice(m,1)}for(;this.powerups.length<22;){const m=r,f=mo(this.world.w,this.world.h,1,m,this.viruses);f.length>0&&this.powerups.push(f[0])}this.fireBulletsIfNeeded(i,t);for(let m=this.bullets.length-1;m>=0;m--){const f=this.bullets[m],g=Math.hypot(f.vel.x,f.vel.y)*i;if(f.rangeLeft!==void 0){if(f.rangeLeft-=g,f.rangeLeft<=0){f.explodeAtEnd&&this.spawnExplosion(f.pos.x,f.pos.y),this.bullets.splice(m,1);continue}}else if(f.ttl-=i,f.ttl<=0){this.bullets.splice(m,1);continue}if(f.pos.x+=f.vel.x*i,f.pos.y+=f.vel.y*i,f.pos.x<0||f.pos.x>this.world.w||f.pos.y<0||f.pos.y>this.world.h){f.explodeAtEnd&&this.spawnExplosion(f.pos.x,f.pos.y),this.bullets.splice(m,1);continue}for(let b=this.viruses.length-1;b>=0;b--){const E=this.viruses[b],T=Math.hypot(E.pos.x-f.pos.x,E.pos.y-f.pos.y);if(T<E.radius){if(f.kind==="rocket"&&E.kind==="green"){const x=(E.pos.x-f.pos.x)/(T||1),A=(E.pos.y-f.pos.y)/(T||1);E.vel.x+=x*120,E.vel.y+=A*120,this.spawnExplosion(f.pos.x,f.pos.y),this.bullets.splice(m,1),m--}break}}if(m<0)break;for(const[,b]of this.players){if(!b.alive||b.id===f.owner||b.invincibleTimer>0)continue;let E=!1;for(const T of b.cells){const x=Math.hypot(T.pos.x-f.pos.x,T.pos.y-f.pos.y);if(x<T.radius){const A=f.kind==="hazard"?f.mass*1.2:f.mass;T.mass=Math.max(1,T.mass-A),T.radius=ge(T.mass);const M=(T.pos.x-f.pos.x)/(x||1),O=(T.pos.y-f.pos.y)/(x||1);T.vel.x+=M*60,T.vel.y+=O*60,E=!0,this.spawnExplosion(f.pos.x,f.pos.y);break}}if(E){this.bullets.splice(m,1),m--;break}}if(m<0)break}{let m=0;for(;m<this.maxEatsPerFrame&&this.resolveEatsOnce();)m++}for(const[,m]of this.players)m.alive&&this.doSelfMergeForPlayer(m,i);for(const[,m]of this.players)if(m.alive&&m.invincibleTimer>0)for(const f of m.cells){const v=this.isMobile?.15:.5;Math.random()<v&&this.particles.push({pos:{x:f.pos.x+P(-f.radius*.2,f.radius*.2),y:f.pos.y+P(-f.radius*.2,f.radius*.2)},vel:{x:P(-40,40),y:P(-40,40)},life:1,size:P(2,4),hue:Ve(0,360),type:"streak",fade:P(.6,1)})}this.updateParticles(i);for(const[,m]of this.players)m.cells.length===0&&(m.alive=!1);if(h&&!h.alive&&!this.gameOverTriggered){this.gameOverTriggered=!0;const m=this.getRank(this.me),f=m||1,v=this.matchTracker.finalize(f),g=Math.round(this.lastTrackedMass||this.meMaxMass),b={survivedMs:this.meSurvivalMs,survivedSec:Math.round(this.meSurvivalMs/10)/100,maxMass:Math.round(this.meMaxMass),finalMass:g,score:Math.round(this.meMaxMass),rank:m,xpBreakdown:v};(I=this.onGameOver)==null||I.call(this,b)}if(s>=this.redStartMs){this.redSpawnTimer-=e;const m=this.viruses.filter(f=>f.kind==="red").length;this.redSpawnTimer<=0&&m<this.redMax&&(this.spawnRedVirus(),this.redSpawnTimer=this.redSpawnEveryMs)}this.blackholeActive||(this.blackholeSpawnTimer-=e,this.blackholeSpawnTimer<=0&&(this.spawnBlackhole(),this.blackholeActive=!0,this.blackholeSpawnTimer=this.blackholeRespawnTimer)),this.ensureBotCount()}applyPerfPreset(){this.isMobile?(this.targetBotCount=45,this.pelletTarget=400,this.initialPelletCount=80,this.greenMax=Math.min(this.greenMax,6),this.redMax=Math.min(this.redMax,2),this.redBulletsPerVolley=Math.min(this.redBulletsPerVolley,6),this.auraEveryN=12,this.mobileNoShadows=!0,this.maxParticles=150,this.maxEatsPerFrame=32,this.reducedVisualEffects=!0,this.simplifiedRendering=!0,this.disableNonEssentialEffects=!0):(this.targetBotCount=69,this.pelletTarget=1e3,this.initialPelletCount=360,this.maxParticles=900)}autoAdjustPerformance(){this.isMobile&&(this.targetBotCount=Math.max(20,this.targetBotCount-10),this.pelletTarget=Math.max(200,this.pelletTarget-100),this.maxParticles=Math.max(50,this.maxParticles-50),this.auraEveryN=Math.min(20,this.auraEveryN+5),this.greenMax=Math.max(3,this.greenMax-2),this.redMax=Math.max(1,this.redMax-1),this.reducedVisualEffects=!0,this.simplifiedRendering=!0,this.disableNonEssentialEffects=!0,this.mobileNoShadows=!0)}setWebSocket(e){this.ws=e,e.addEventListener("message",t=>{try{const s=JSON.parse(t.data);s.type==="playerCount"?this.updatePlayerCount(s.count):s.type==="welcome"?(this.playerId=s.playerId,this.updatePlayerCount(s.totalPlayers)):s.type==="playerJoined"?this.addServerMessage(`🎮 ${s.playerName||"Spieler"} hat die Lobby gejoined`,"join"):s.type==="playerLeft"&&this.addServerMessage(`👋 ${s.playerName||"Spieler"} hat die Lobby verlassen`,"leave")}catch{}}),setInterval(()=>{this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify({type:"heartbeat"}))},1e4)}addServerMessage(e,t="info"){this.serverMessages.push({text:e,type:t,timestamp:Date.now()}),this.serverMessages.length>5&&this.serverMessages.shift()}updatePlayerCount(e){if(e===this.realPlayerCount)return;const t=this.realPlayerCount;console.log(`🎮 Real players: ${this.realPlayerCount} → ${e}`),this.realPlayerCount=e,t>0&&(e>t?this.addServerMessage(`📈 ${e} Spieler online (+${e-t})`,"playerCount"):e<t&&this.addServerMessage(`📉 ${e} Spieler online (-${t-e})`,"playerCount"));const s=this.isMobile?45:69,i=Math.min(e-1,s-10),r=Math.max(10,s-i);if(r!==this.targetBotCount){console.log(`🤖 Adjusting bots: ${this.targetBotCount} → ${r}`);const o=this.targetBotCount;this.targetBotCount=r,r<o&&this.removeExcessBots(o-r)}}removeExcessBots(e){let t=0;for(const[s,i]of this.players){if(t>=e)break;i.isBot&&i.alive&&(i.alive=!1,i.cells=[],t++,console.log(`🤖 Removed bot: ${i.name}`))}}findSafeSpawnPos(e,t=80){const{cx:s,cy:i,R:r}=gn(this.world.w,this.world.h,e),a=Math.max(0,r-140);if(a<=0)return{x:s,y:i};let l={x:s,y:i,score:-1/0};for(let c=0;c<t;c++){const h=Math.random()*Math.PI*2,d=Math.sqrt(Math.random())*a,u=s+Math.cos(h)*d,p=i+Math.sin(h)*d,y=Pd(u,p,this.players,this.viruses,this.world.w,this.world.h,e);y>l.score&&(l={x:u,y:p,score:y})}return{x:l.x,y:l.y}}spawnPellets(e){this.pellets=[];const t=e*6,s=this.outsidePad(0),{cx:i,cy:r,R:o}=gn(this.world.w,this.world.h,s),a=Math.max(0,o-60);for(let l=0;l<t;l++){const c=Math.random();let h;c<.1?h=P(8,12):c<.3?h=P(5,7):h=P(2,4);const d=Math.random()*Math.PI*2,u=Math.sqrt(Math.random())*a,p=i+Math.cos(d)*u,y=r+Math.sin(d)*u;this.pellets.push({pos:{x:p,y},mass:h})}}spawnViruses(e){this.viruses=[];const t=this.outsidePad(0),{cx:s,cy:i,R:r}=gn(this.world.w,this.world.h,t),a=Math.max(0,r-160),l=Math.min(e,this.greenMax);for(let c=0;c<l;c++){const h=P(38,54),d=P(.05,.12),u=P(2,5),p=P(0,Math.PI*2),y=Math.sqrt(Math.random())*Math.max(0,a-h),w=s+Math.cos(p)*y,I=i+Math.sin(p)*y;this.viruses.push({pos:{x:w,y:I},radius:h,vel:{x:Math.cos(p)*u,y:Math.sin(p)*u},ang:P(0,Math.PI*2),spin:d,kind:"green"})}}spawnRedVirus(){const e=P(42,58),t=P(.08,.14),s=P(1,3),i=P(0,Math.PI*2);this.viruses.push({pos:{x:P(160,this.world.w-160),y:P(160,this.world.h-160)},radius:e,vel:{x:Math.cos(i)*s,y:Math.sin(i)*s},ang:P(0,Math.PI*2),spin:t,kind:"red",ttl:P(20,30),volleyT:this.redVolleyEvery})}spawnBlackhole(){const e=this.world.w/2,t=this.world.h/2,s=300;let i={x:e,y:t},r=0;for(let a=0;a<50;a++){const l=Math.random()*Math.PI*2,c=Math.random()*s,h=e+Math.cos(l)*c,d=t+Math.sin(l)*c;let u=1/0;for(const[,p]of this.players)if(p.alive)for(const y of p.cells){const w=Math.hypot(h-y.pos.x,d-y.pos.y);u=Math.min(u,w)}u>r&&(r=u,i={x:h,y:d})}const o=P(48,62);this.viruses.push({pos:i,radius:o,vel:{x:0,y:0},ang:0,spin:.1,kind:"blackhole",ttl:60,pullRadius:500,spawnTime:performance.now()/1e3,imploding:!1,implodeProgress:0}),console.log("🕳️ Blackhole spawned at center!")}updateBlackhole(e,t){if(e.ttl-=t,e.ang+=e.spin*t,e.ttl<=3&&!e.imploding&&(e.imploding=!0,console.log("🕳️ Blackhole starting to implode!")),e.imploding&&(e.implodeProgress=Math.min(1,(3-e.ttl)/3),e.spin=.5+e.implodeProgress*2),e.ttl<=0){const s=this.viruses.indexOf(e);if(s>=0){this.viruses.splice(s,1),this.blackholeActive=!1,console.log("🕳️ Blackhole imploded and disappeared!");const i=this.isMobile?20:50;for(let r=0;r<i;r++){const o=Math.random()*Math.PI*2,a=P(100,300);this.particles.push({pos:{x:e.pos.x,y:e.pos.y},vel:{x:Math.cos(o)*a,y:Math.sin(o)*a},life:1,size:P(2,8),hue:P(250,300),type:"spark",fade:P(.8,1)})}}}}applyBlackholeGravity(e,t){const s=e.pullRadius||500,i=s*s;for(const[,r]of this.players)if(r.alive)for(const o of r.cells){const a=e.pos.x-o.pos.x,l=e.pos.y-o.pos.y,c=a*a+l*l;if(c<=i){const h=Math.sqrt(c)||1,u=(s-h)/s*150*t,p=a/h,y=l/h;o.vel.x+=p*u,o.vel.y+=y*u,h<=e.radius+o.radius*.5&&this.consumePlayerByBlackhole(r,o,e)}}}consumePlayerByBlackhole(e,t,s){const i=this.totalMass(e),o=Math.max(20,i*.5)/i;for(const h of e.cells)h.mass*=o,h.radius=ge(h.mass);const a=this.findSafeSpawnPos(this.outsidePad(0)),l=e.cells.length>1?50:0;for(let h=0;h<e.cells.length;h++){const d=e.cells[h],u=h/e.cells.length*Math.PI*2;d.pos.x=a.x+Math.cos(u)*l,d.pos.y=a.y+Math.sin(u)*l,d.vel.x=0,d.vel.y=0}console.log(`🕳️ ${e.name} was consumed by blackhole! Mass halved and teleported.`);const c=this.isMobile?8:20;for(let h=0;h<c;h++){const d=Math.random()*Math.PI*2,u=P(50,150);this.particles.push({pos:{x:s.pos.x,y:s.pos.y},vel:{x:Math.cos(d)*u,y:Math.sin(d)*u},life:1,size:P(3,6),hue:P(280,320),type:"spark",fade:P(.7,1)})}}spawnPowerUps(e){const t=this.outsidePad(0);this.powerups=mo(this.world.w,this.world.h,e,t,this.viruses)}uuid(){try{const e=typeof self<"u"?self:typeof window<"u"?window:{},t=e&&e.crypto;if(t&&typeof t.randomUUID=="function")return t.randomUUID()}catch{}return"id-"+Math.random().toString(36).slice(2)+"-"+Date.now().toString(36)}spawnPlayers(e,t){this.players.clear(),this.me=this.uuid();const s=P(50,150),i=this.outsidePad(0),r=this.findSafeSpawnPos(i);this.players.set(this.me,{id:this.me,color:(t==null?void 0:t.color)||"#5cf2a6",name:(t==null?void 0:t.name)||"You",alive:!0,isBot:!1,invincibleTimer:0,multishotTimer:0,speedBoostTimer:0,cells:[mt(s,r)],skinCanvas:(t==null?void 0:t.skinCanvas)??sr(["neon","eyes","stripe"]),skinPattern:void 0});for(let o=0;o<this.targetBotCount;o++){const a=this.uuid(),l=P(50,150),c=this.findSafeSpawnPos(i);this.players.set(a,{id:a,color:`hsl(${Math.floor(P(0,360))} 80% 65%)`,name:Bt[o%Bt.length],alive:!0,isBot:!0,invincibleTimer:0,multishotTimer:0,speedBoostTimer:0,cells:[mt(l,c)],skinCanvas:ci(),skinPattern:void 0})}this.meSurvivalMs=0,this.meMaxMass=s,this.gameOverTriggered=!1}resetRound(){this.matchTracker=Ri(),this.lastTrackedMass=0,this.spawnPellets(this.initialPelletCount),this.spawnViruses(28),this.spawnPowerUps(18),this.redSpawnTimer=0;const e=this.outsidePad(0);this.players.forEach(t=>{t.alive=!0,t.invincibleTimer=0,t.multishotTimer=0,t.speedBoostTimer=0;const s=P(50,150),i=this.findSafeSpawnPos(e);t.cells=[mt(s,i)]}),this.bullets=[],this.particles=[],this.meSurvivalMs=0,this.meMaxMass=this.me?this.totalMass(this.players.get(this.me)):0,this.gameOverTriggered=!1}reviveWithMass(e){this.gameOverTriggered=!1;const t=this.players.get(this.me);if(t){t.alive=!0,t.invincibleTimer=3,t.multishotTimer=0,t.speedBoostTimer=0;const s=this.outsidePad(0),i=this.findSafeSpawnPos(s);t.cells=[mt(e,i)],this.lastTrackedMass=e}}totalMass(e){return Qh(e.cells,t=>t.mass)}largestCell(e){return e.cells.reduce((t,s)=>t.mass>=s.mass?t:s)}outsidePad(e){return 0}splitTargetDistance(e){const i=420+52*Math.sqrt(Math.max(1,e));return Math.max(wd,Math.min(Id,i))}splitSpeedCap(e){const t=Math.sqrt(Math.max(1,e));return Math.max(300,this.splitCapBase+this.splitCapK/t)}impulseForDistance(e){const t=-Math.log(this.splitDampImpulse)*60,s=-Math.log(this.splitDampNormal)*60,i=this.splitImpulseSec,r=(1-Math.exp(-t*i))/Math.max(1e-6,t)+Math.exp(-t*i)/Math.max(1e-6,s);return e/Math.max(1e-6,r)}mergeCooldownForMass(e){return bo+Cd*Math.sqrt(Math.max(1,e))}updateWorldPosition(e,t,s,i){const r=this.canvas.width/2,o=this.canvas.height/2,a=e+((i.targetX??r)-r)/s,l=t+((i.targetY??o)-o)/s;return{worldX:a,worldY:l}}performSplit(e,t){const s=this.players.get(e);if(!s)return;const i=s.cells.sort((p,y)=>y.mass-p.mass)[0];if(!i||i.mass<36)return;const r=i.mass*.5;i.mass=r,i.radius=ge(i.mass);const o=Math.min(200,this.splitTargetDistance(r)),a=Math.hypot(t.x,t.y)||1,l=t.x/a,c=t.y/a,d={pos:{...{x:i.pos.x+l*(i.radius+8),y:i.pos.y+c*(i.radius+8)}},vel:{x:0,y:0},mass:r,radius:ge(r),mergeCooldown:bo};d._splitTarget={x:d.pos.x+l*o,y:d.pos.y+c*o},d._splitTotal=o,d._splitRemain=o,d._splitImpulse=Ed,d._splitTime=0;const u=Math.min(300,yo+_o/Math.sqrt(r));d.vel.x=l*u,d.vel.y=c*u,i.vel.x-=l*vo,i.vel.y-=c*vo,d.mergeCooldown=this.mergeCooldownForMass(r),i.mergeCooldown=this.mergeCooldownForMass(i.mass),d._splitTime=0,i._splitTime=0,s.cells.push(d)}playerEject(e,t){if(!e.cells.length)return;const s=Math.min(this.canvas.width/1920,this.canvas.height/1080)*this.currentZoom,i=this.updateWorldPosition(e.cells[0].pos.x,e.cells[0].pos.y,s,t);for(const r of e.cells){if(r.mass<35)continue;const o=i.worldX-r.pos.x,a=i.worldY-r.pos.y,l=Math.hypot(o,a)||1;r.mass=Math.max(10,r.mass-this.ejectLoss),r.radius=ge(r.mass);const c=420,h=o/l*c,d=a/l*c,u={pos:{x:r.pos.x+o/l*(r.radius*.9),y:r.pos.y+a/l*(r.radius*.9)},mass:this.ejectGive,vel:{x:h,y:d},life:8};this.pellets.push(u),r.vel.x-=h*.02,r.vel.y-=d*.02}}handleVirusCollision(e,t,s){const i=t.pos.x-s.pos.x,r=t.pos.y-s.pos.y,o=Math.hypot(i,r),a=t.radius+s.radius*.98;if(s.kind==="green"&&o<t.radius-.2*s.radius&&t.mass>=1e3){t.mass+=t.mass>=2e3?10:50,t.radius=ge(t.mass);const l=this.viruses.indexOf(s);l>=0&&this.viruses.splice(l,1);return}if(o<a){const l=i/(o||1),c=r/(o||1),h=a-o;if(t.pos.x+=l*h,t.pos.y+=c*h,t.vel.x*=.75,t.vel.y*=.75,t.mass>200){const p=Math.max(10,t.mass*.95/2),y=Math.atan2(c,l),w=[];for(let m=0;m<2;m++){const f=y+m*Math.PI,v={x:Math.cos(f),y:Math.sin(f)},g=260,b=mt(p,{x:t.pos.x+v.x*(t.radius*.7),y:t.pos.y+v.y*(t.radius*.7)},{x:v.x*g,y:v.y*g});b.mergeCooldown=this.mergeTime,w.push(b)}const I=e.cells.indexOf(t);I>=0&&(e.cells.splice(I,1),e.cells.push(...w))}}}pickPowerUp(e,t,s){const i=e.cells.indexOf(t);i<0||fd(e,i,s)}fireBulletsIfNeeded(e,t){for(const[,s]of this.players){if(!s.alive||s.multishotTimer<=0)continue;const i=this.largestCell(s);if(!i)continue;if(Math.random()<3*e){let o={x:1,y:0};if(s.id===this.me){const h=Math.min(this.canvas.width/1920,this.canvas.height/1080)*this.currentZoom,d=this.updateWorldPosition(i.pos.x,i.pos.y,h,t),u={x:d.worldX-i.pos.x,y:d.worldY-i.pos.y},p=Math.hypot(u.x,u.y)||1;o={x:u.x/p,y:u.y/p}}else{let h=null,d=1/0;for(const[,u]of this.players)if(!(!u.alive||u.id===s.id)&&!(this.totalMass(s)<this.totalMass(u)))for(const p of u.cells){const y=Math.hypot(p.pos.x-i.pos.x,p.pos.y-i.pos.y);y<d&&(d=y,h={x:p.pos.x,y:p.pos.y})}if(!h)for(const u of this.viruses){if(u.kind!=="green")continue;const y=Math.hypot(u.pos.x-i.pos.x,u.pos.y-i.pos.y);y<d&&(d=y,h={x:u.pos.x,y:u.pos.y})}if(!h)for(const u of this.powerups){const p=Math.hypot(u.pos.x-i.pos.x,u.pos.y-i.pos.y);p<d&&(d=p,h={x:u.pos.x,y:u.pos.y})}if(h){const u={x:h.x-i.pos.x,y:h.y-i.pos.y},p=Math.hypot(u.x,u.y)||1;o={x:u.x/p,y:u.y/p}}}const a=420;this.bullets.push({kind:"rocket",pos:{x:i.pos.x,y:i.pos.y},vel:{x:o.x*a,y:o.y*a},mass:8,owner:s.id,ttl:3,rangeLeft:300,explodeAtEnd:!0})}}}spawnExplosion(e,t){for(let i=0;i<24;i++){const r=i/24*Math.PI*2+Math.random()*.3,o=P(120,340);this.particles.push({pos:{x:e,y:t},vel:{x:Math.cos(r)*o,y:Math.sin(r)*o},life:1,size:P(2,4),hue:Ve(180,240),type:"spark",fade:P(1.2,1.8)})}this.particles.push({pos:{x:e,y:t},vel:{x:0,y:0},life:1,size:6,hue:200,type:"shock",fade:1.4})}spawnImplosion(e,t){for(let i=0;i<16;i++){const r=i/16*Math.PI*2+Math.random()*.4,o=P(60,180);this.particles.push({pos:{x:e+Math.cos(r)*20,y:t+Math.sin(r)*20},vel:{x:-Math.cos(r)*o,y:-Math.sin(r)*o},life:1,size:P(2,3),hue:Ve(0,60),type:"spark",fade:P(.9,1.2)})}this.particles.push({pos:{x:e,y:t},vel:{x:0,y:0},life:1,size:5,hue:30,type:"shock",fade:1.1})}resolveEatsOnce(){for(const[,e]of this.players)if(e.alive){for(const[,t]of this.players)if(!(!t.alive||e.id===t.id))for(let s=0;s<e.cells.length;s++){const i=e.cells[s];for(let r=0;r<t.cells.length;r++){const o=t.cells[r],a=o.pos.x-i.pos.x,l=o.pos.y-i.pos.y,c=Math.hypot(a,l);if(c===0)continue;let h=i,d=o,u=e,p=t;o.mass>i.mass&&(h=o,d=i,u=t,p=e);const y=h.mass/Math.max(1,d.mass),w=Math.abs(1-y)<=.02;let I=w||y>=1.1;u.lightningTimer>0&&(I=w||y>=1.2);const m=c+.6*d.radius<h.radius;if(I&&m&&u.invincibleTimer<=0&&p.invincibleTimer<=0){h.mass+=d.mass,h.radius=ge(h.mass);const g=p.cells.indexOf(d);return g>=0&&p.cells.splice(g,1),p.cells.length===0&&(p.alive=!1),u.id===this.me&&!p.isBot&&this.matchTracker.kill(),!0}const v=c<i.radius+o.radius;if(I&&v){const g={x:a/(c||1),y:l/(c||1)},b=(i.radius+o.radius-c)*.25;d.pos.x+=(u===e?-g.x:g.x)*b,d.pos.y+=(u===e?-g.y:g.y)*b,h.pos.x+=-g.x*.05*b,h.pos.y+=-g.y*.05*b}else{const g=(i.radius+o.radius)*.95;if(c<g){const b={x:a/(c||1),y:l/(c||1)},E=(g-c)*.45;o.pos.x+=b.x*E,o.pos.y+=b.y*E,i.pos.x-=b.x*E,i.pos.y-=b.y*E}}}}}return!1}doSelfMergeForPlayer(e,t){for(const s of e.cells)s.mergeCooldown=Math.max(0,(s.mergeCooldown??0)-t),s._splitTime!==void 0&&(s._splitTime+=t);if(!(e.cells.length<=1))for(let s=0;s<e.cells.length;s++)for(let i=s+1;i<e.cells.length;i++){const r=e.cells[s],o=e.cells[i],a=o.pos.x-r.pos.x,l=o.pos.y-r.pos.y,c=Math.hypot(a,l)||1,h=r.radius+o.radius,d=(r.mergeCooldown??0)>0,u=(o.mergeCooldown??0)>0,p=r._splitTime??0,y=o._splitTime??0,w=p>=di||y>=di;if((d||u)&&!w){if(c<h*.98){const f=a/c,v=l/c,g=14;r.vel.x-=f*g,r.vel.y-=v*g,o.vel.x+=f*g,o.vel.y+=v*g}continue}const I=h*xd,m=w?h*1.2:h*kd;if(c<I&&c>=m){const f=a/c,v=l/c,g=w?wo*3:wo,b=(I-c)*g;r.vel.x+=f*b*.5,r.vel.y+=v*b*.5,o.vel.x-=f*b*.5,o.vel.y-=v*b*.5}else if(c<m){const f=r.mass+o.mass,v=(r.pos.x*r.mass+o.pos.x*o.mass)/f,g=(r.pos.y*r.mass+o.pos.y*o.mass)/f,b=(r.vel.x*r.mass+o.vel.x*o.mass)/f,E=(r.vel.y*r.mass+o.vel.y*o.mass)/f;r.mass=f,r.radius=ge(r.mass),r.pos.x=v,r.pos.y=g,r.vel.x=b,r.vel.y=E,r.mergeCooldown=this.mergeCooldownForMass(r.mass),delete r._splitTime,delete r._forceReturning,e.cells.splice(i,1),i--}}}updateParticles(e){for(let t=this.particles.length-1;t>=0;t--){const s=this.particles[t];s.pos.x+=s.vel.x*e,s.pos.y+=s.vel.y*e,(s.type==="spark"||s.type==="streak")&&(s.vel.x*=.96,s.vel.y*=.96),s.life-=e/(s.fade||1),s.life<=0&&this.particles.splice(t,1)}this.particles.length>this.maxParticles&&this.particles.splice(0,this.particles.length-this.maxParticles)}getRank(e){const t=[];for(const[i,r]of this.players)r.alive&&t.push({id:i,mass:this.totalMass(r)});t.sort((i,r)=>r.mass-i.mass);const s=t.findIndex(i=>i.id===e);return(s>=0?s:t.length-1)+1}ensureBotCount(){let e=0;for(const[,r]of this.players)r.isBot&&r.alive&&e++;if(e>=this.targetBotCount)return;const t=this.targetBotCount-e,s=[];for(const[,r]of this.players)r.isBot&&!r.alive&&s.push(r);let i=0;for(const r of s){if(i>=t)break;this.respawnBot(r),i++}for(;i<t;i++){const r=this.uuid(),o=P(50,150),a=this.outsidePad(0),l=this.findSafeSpawnPos(a);this.players.set(r,{id:r,color:`hsl(${Math.floor(P(0,360))} 80% 65%)`,name:Bt[this.players.size%Bt.length],alive:!0,isBot:!0,invincibleTimer:0,multishotTimer:0,speedBoostTimer:0,cells:[mt(o,l)],skinCanvas:ci(),skinPattern:void 0})}}respawnBot(e){e.alive=!0,e.invincibleTimer=1.2,e.multishotTimer=0,e.speedBoostTimer=0;const t=P(50,150),s=this.outsidePad(0),i=this.findSafeSpawnPos(s);e.cells=[mt(t,i)],e.name=Bt[Ve(0,Bt.length-1)],e.skinCanvas=e.skinCanvas||ci()}tickSplitMotion(e,t){if(!e._splitTarget)return;const s=e._splitTarget.x-e.pos.x,i=e._splitTarget.y-e.pos.y,r=Math.hypot(s,i);if(r<=Math.max(2,e.radius*.25)||(e._splitRemain??0)<=0){e.pos.x=e._splitTarget.x,e.pos.y=e._splitTarget.y,delete e._splitTarget,delete e._splitTotal,delete e._splitRemain,delete e._splitImpulse;const u=this.findPlayerByCell(e);if(u){const p=this.largestCell(u);if(p&&p!==e){const y=p.pos.x-e.pos.x,w=p.pos.y-e.pos.y,I=Math.hypot(y,w)||1,m=350;e.vel.x=y/I*m,e.vel.y=w/I*m,e._returning=!0}else if(u.cells.length>1){const y=u.cells.find(w=>w!==e);if(y){const w=y.pos.x-e.pos.x,I=y.pos.y-e.pos.y,m=Math.hypot(w,I)||1,f=350;e.vel.x=w/m*f,e.vel.y=I/m*f,e._returning=!0}else e.vel.x=0,e.vel.y=0}else e.vel.x=0,e.vel.y=0}return}const o=e._splitImpulse&&e._splitImpulse>0?Sd:Td;e.vel.x*=o,e.vel.y*=o;const a=s/(r||1),l=i/(r||1),c=18;e.vel.x+=a*c,e.vel.y+=l*c;const h=yo+_o/Math.sqrt(e.mass),d=Math.hypot(e.vel.x,e.vel.y);if(d>h){const u=h/d;e.vel.x*=u,e.vel.y*=u}e.pos.x+=e.vel.x*t,e.pos.y+=e.vel.y*t,typeof e._splitRemain=="number"&&(e._splitRemain=Math.max(0,e._splitRemain-d*t)),typeof e._splitImpulse=="number"&&(e._splitImpulse=Math.max(0,e._splitImpulse-t))}findPlayerByCell(e){for(const[,t]of this.players)if(t.cells.includes(e))return t;return null}}let Ai=null;function Ad(n){Ai=n}const q={targetX:0,targetY:0,dash:!1,splitPressed:!1,ejectHeld:!1,ejectTapCount:0,wheelTicks:0,speedTapCount:0,shootTapCount:0};function Nd(n){function e(i,r){const o=n.getBoundingClientRect();q.targetX=i-o.left,q.targetY=r-o.top}try{n.style.touchAction="none"}catch{}window.addEventListener("mousemove",i=>e(i.clientX,i.clientY)),n.addEventListener("touchmove",i=>{i.touches[0]&&e(i.touches[0].clientX,i.touches[0].clientY)},{passive:!0});try{const i=n.getBoundingClientRect();e(i.left+i.width/2,i.top+i.height/2)}catch{}window.addEventListener("wheel",i=>{q.wheelTicks+=Math.sign(i.deltaY)},{passive:!0});let t=0;const s=18;n.addEventListener("touchstart",i=>{if(i.touches.length>=2){const r=i.touches[0],o=i.touches[1];t=Math.hypot(o.clientX-r.clientX,o.clientY-r.clientY),i.preventDefault()}},{passive:!1}),n.addEventListener("touchmove",i=>{if(i.touches.length>=2){const r=i.touches[0],o=i.touches[1],a=Math.hypot(o.clientX-r.clientX,o.clientY-r.clientY),l=a-t;if(Math.abs(l)>=s){const c=-Math.round(l/s);q.wheelTicks+=c,t=a}i.preventDefault()}},{passive:!1}),n.addEventListener("touchend",()=>{}),n.addEventListener("touchcancel",()=>{t=0}),window.addEventListener("keydown",i=>{(i.code==="ShiftLeft"||i.code==="ShiftRight")&&(q.dash=!0),i.code==="Space"&&(q.splitPressed=!0,q.space=!0),i.code==="KeyW"&&(q.ejectHeld=!0),i.code==="KeyM"&&Ai&&Ai.toggle()}),window.addEventListener("keyup",i=>{(i.code==="ShiftLeft"||i.code==="ShiftRight")&&(q.dash=!1),i.code==="KeyW"&&(q.ejectHeld=!1)}),n.addEventListener("contextmenu",i=>i.preventDefault()),n.addEventListener("mousedown",i=>{i.button===2&&(q.ejectHeld=!0),i.button===0&&q.speedTapCount++}),n.addEventListener("mouseup",i=>{i.button===2&&(q.ejectHeld=!1)}),Dd(n)}function Od(){return q}function Dd(n){Ld(),Fd(n)}function Ld(){if(document.getElementById("mobile-actions"))return;const n=document.createElement("div");n.id="mobile-actions",Object.assign(n.style,{position:"fixed",left:"14px",bottom:"14px",width:"230px",height:"170px",zIndex:"12"});function e(r,o,a){const l=document.createElement("button");return l.id=r,l.textContent=o,l.setAttribute("aria-label",r),Object.assign(l.style,{position:"absolute",width:"68px",height:"68px",borderRadius:"50%",border:"0",fontWeight:"900",fontSize:"22px",color:"#012",cursor:"pointer",background:a,boxShadow:"0 10px 24px rgba(0,0,0,.35), 0 0 18px rgba(0,255,220,.25)",outline:"none"}),l.style.boxShadow=`${l.style.boxShadow}, inset 0 0 0 2px rgba(255,255,255,0.18)`,l}const t=e("btn-split","⚡","linear-gradient(135deg,#60f,#9af)"),s=e("btn-eject","⬤","linear-gradient(135deg,#ff8,#fff)"),i=e("btn-speed","➤","linear-gradient(135deg,#4f8,#bff)");Object.assign(t.style,{left:"8px",top:"6px"}),Object.assign(s.style,{left:"46px",top:"76px"}),Object.assign(i.style,{left:"130px",top:"36px"}),t.addEventListener("click",()=>{q.splitPressed=!0}),t.addEventListener("touchstart",r=>{r.preventDefault(),q.splitPressed=!0},{passive:!1}),s.addEventListener("mousedown",()=>{q.ejectHeld=!0}),s.addEventListener("mouseup",()=>{q.ejectHeld=!1}),s.addEventListener("mouseleave",()=>{q.ejectHeld=!1}),s.addEventListener("touchstart",r=>{r.preventDefault(),q.ejectHeld=!0},{passive:!1}),s.addEventListener("touchend",()=>{q.ejectHeld=!1}),s.addEventListener("click",()=>{q.ejectTapCount++}),i.addEventListener("click",()=>{q.speedTapCount++}),i.addEventListener("touchstart",r=>{r.preventDefault(),q.speedTapCount++},{passive:!1}),n.append(t,s,i),document.body.appendChild(n)}function Fd(n){if(document.getElementById("mobile-stick"))return;const e=document.createElement("div");e.id="mobile-stick",Object.assign(e.style,{position:"fixed",right:"14px",bottom:"14px",width:"150px",height:"150px",borderRadius:"18px",background:"rgba(255,255,255,0.06)",backdropFilter:"blur(6px)",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.06)",touchAction:"none",zIndex:"12"});const t=document.createElement("div");Object.assign(t.style,{position:"absolute",left:"50%",top:"50%",width:"96px",height:"96px",marginLeft:"-48px",marginTop:"-48px",borderRadius:"50%",background:"rgba(255,255,255,0.10)",boxShadow:"0 0 0 2px rgba(255,255,255,0.12)"});const s=document.createElement("div");Object.assign(s.style,{position:"absolute",left:"50%",top:"50%",width:"52px",height:"52px",marginLeft:"-26px",marginTop:"-26px",borderRadius:"50%",background:"rgba(255,255,255,0.35)",boxShadow:"0 6px 18px rgba(0,0,0,.25)"}),e.append(t,s),document.body.appendChild(e);let i=null;const r=48;function o(c,h){const u=n.width/2,p=n.height/2;q.targetX=u+c*2,q.targetY=p+h*2}function a(c,h){const d=e.getBoundingClientRect(),u=d.left+d.width/2,p=d.top+d.height/2,y=c-u,w=h-p,I=Math.hypot(y,w)||1,m=Math.min(I,r),f=y/I,v=w/I,g=f*m,b=v*m;s.style.transform=`translate(${g}px, ${b}px)`,o(g,b)}function l(){s.style.transform="translate(0px, 0px)"}e.addEventListener("touchstart",c=>{if(i!==null)return;const h=c.changedTouches[0];i=h.identifier,h.clientX,h.clientY,a(h.clientX,h.clientY)},{passive:!1}),e.addEventListener("touchmove",c=>{if(i!==null){for(const h of Array.from(c.touches))if(h.identifier===i){a(h.clientX,h.clientY);break}}},{passive:!1}),e.addEventListener("touchend",c=>{if(i!==null){for(const h of Array.from(c.changedTouches))if(h.identifier===i){i=null,l();break}}}),e.addEventListener("touchcancel",()=>{i=null,l()})}class Bd{constructor(){_(this,"audioElements",[]);_(this,"currentTrackIndex",0);_(this,"playing",!1);_(this,"pauseTimeout",null);_(this,"boundAutoStart");_(this,"unlocked",!1);this.loadMusic();const e=async s=>{try{await this.unlock()}catch{}this.playing||this.start()};this.boundAutoStart=e;const t={once:!0,capture:!0};document.addEventListener("touchstart",e,t),document.addEventListener("pointerdown",e,t),document.addEventListener("click",e,t),document.addEventListener("keydown",e,t)}loadMusic(){const e=["music/1.mp3","music/2.mp3","music/3.mp3"];this.audioElements=e.map(t=>{const s=new Audio(t);s.preload="auto",s.volume=.35,s.playsInline=!0;try{s.setAttribute("playsinline","true")}catch{}try{s.setAttribute("webkit-playsinline","true")}catch{}return s.addEventListener("ended",()=>this.onTrackEnded()),s.addEventListener("error",i=>{console.warn(`Could not load music file: ${t}`,i),this.playing&&this.playNextTrack()}),s})}async unlock(){if(!this.unlocked){try{for(const e of this.audioElements){e.muted=!0;try{await e.play()}catch{}try{e.pause()}catch{}e.muted=!1}}catch{}this.unlocked=!0}}onTrackEnded(){if(!this.playing)return;const e=300+Math.floor(Math.random()*900);this.pauseTimeout=window.setTimeout(()=>{this.playNextTrack()},e)}playNextTrack(){if(!this.playing)return;this.currentTrackIndex=(this.currentTrackIndex+1)%this.audioElements.length;const e=this.audioElements[this.currentTrackIndex];e.currentTime=0,e.play().catch(t=>{console.warn("Could not play next track:",t)})}start(){if(this.playing)return;this.audioElements.forEach(t=>{t.pause(),t.currentTime=0}),this.playing=!0;const e=this.audioElements[this.currentTrackIndex]||this.audioElements[0];e&&(e.currentTime=0,e.play().catch(t=>{this.playing=!1,console.warn("Autoplay prevented. Music will start on first user interaction.",t)}))}stop(){this.playing=!1,this.audioElements.forEach(e=>{e.pause(),e.currentTime=0}),this.pauseTimeout&&(clearTimeout(this.pauseTimeout),this.pauseTimeout=null)}toggle(){this.playing?this.stop():this.start()}setVolume(e){const t=Math.max(0,Math.min(1,e));this.audioElements.forEach(s=>s.volume=t)}isCurrentlyPlaying(){return this.playing}}const Qa="neoncells.records.v1";function Ja(){try{const n=localStorage.getItem(Qa);if(!n)return[];const e=JSON.parse(n);return Array.isArray(e)?e:[]}catch{return[]}}function Ud(n){try{localStorage.setItem(Qa,JSON.stringify(n))}catch{}}function Za(n){const e=Ja();e.push(n),e.sort((s,i)=>i.maxMass-s.maxMass||i.survivedSec-s.survivedSec||i.ts-s.ts);const t=e.slice(0,10);Ud(t)}function Wd(){return Ja()}const Io=Object.freeze(Object.defineProperty({__proto__:null,addRecord:Za,getTopRecords:Wd},Symbol.toStringTag,{value:"Module"})),jd=()=>{};var Eo={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const el={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S=function(n,e){if(!n)throw Qt(e)},Qt=function(n){return new Error("Firebase Database ("+el.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tl=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Vd=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const i=n[t++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=n[t++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=n[t++],o=n[t++],a=n[t++],l=((i&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[s++]=String.fromCharCode(55296+(l>>10)),e[s++]=String.fromCharCode(56320+(l&1023))}else{const r=n[t++],o=n[t++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},or={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<n.length;i+=3){const r=n[i],o=i+1<n.length,a=o?n[i+1]:0,l=i+2<n.length,c=l?n[i+2]:0,h=r>>2,d=(r&3)<<4|a>>4;let u=(a&15)<<2|c>>6,p=c&63;l||(p=64,o||(u=64)),s.push(t[h],t[d],t[u],t[p])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(tl(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Vd(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<n.length;){const r=t[n.charAt(i++)],a=i<n.length?t[n.charAt(i)]:0;++i;const c=i<n.length?t[n.charAt(i)]:64;++i;const d=i<n.length?t[n.charAt(i)]:64;if(++i,r==null||a==null||c==null||d==null)throw new Hd;const u=r<<2|a>>4;if(s.push(u),c!==64){const p=a<<4&240|c>>2;if(s.push(p),d!==64){const y=c<<6&192|d;s.push(y)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Hd extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const nl=function(n){const e=tl(n);return or.encodeByteArray(e,!0)},hs=function(n){return nl(n).replace(/\./g,"")},ds=function(n){try{return or.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $d(n){return sl(void 0,n)}function sl(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!zd(t)||(n[t]=sl(n[t],e[t]));return n}function zd(n){return n!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qd(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gd=()=>qd().__FIREBASE_DEFAULTS__,Kd=()=>{if(typeof process>"u"||typeof Eo>"u")return;const n=Eo.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Yd=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&ds(n[1]);return e&&JSON.parse(e)},ar=()=>{try{return jd()||Gd()||Kd()||Yd()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},il=n=>{var e,t;return(t=(e=ar())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},Xd=n=>{const e=il(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},rl=()=>{var n;return(n=ar())==null?void 0:n.config},ol=n=>{var e;return(e=ar())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wn{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function al(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qd(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",i=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}},...n};return[hs(JSON.stringify(t)),hs(JSON.stringify(o)),""].join(".")}const bn={};function Jd(){const n={prod:[],emulator:[]};for(const e of Object.keys(bn))bn[e]?n.emulator.push(e):n.prod.push(e);return n}function Zd(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let So=!1;function ll(n,e){if(typeof window>"u"||typeof document>"u"||!Jt(window.location.host)||bn[n]===e||bn[n]||So)return;bn[n]=e;function t(u){return`__firebase__banner__${u}`}const s="__firebase__banner",r=Jd().prod.length>0;function o(){const u=document.getElementById(s);u&&u.remove()}function a(u){u.style.display="flex",u.style.background="#7faaf0",u.style.position="fixed",u.style.bottom="5px",u.style.left="5px",u.style.padding=".5em",u.style.borderRadius="5px",u.style.alignItems="center"}function l(u,p){u.setAttribute("width","24"),u.setAttribute("id",p),u.setAttribute("height","24"),u.setAttribute("viewBox","0 0 24 24"),u.setAttribute("fill","none"),u.style.marginLeft="-6px"}function c(){const u=document.createElement("span");return u.style.cursor="pointer",u.style.marginLeft="16px",u.style.fontSize="24px",u.innerHTML=" &times;",u.onclick=()=>{So=!0,o()},u}function h(u,p){u.setAttribute("id",p),u.innerText="Learn more",u.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",u.setAttribute("target","__blank"),u.style.paddingLeft="5px",u.style.textDecoration="underline"}function d(){const u=Zd(s),p=t("text"),y=document.getElementById(p)||document.createElement("span"),w=t("learnmore"),I=document.getElementById(w)||document.createElement("a"),m=t("preprendIcon"),f=document.getElementById(m)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(u.created){const v=u.element;a(v),h(I,w);const g=c();l(f,m),v.append(f,y,I,g),document.body.appendChild(v)}r?(y.innerText="Preview backend disconnected.",f.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(f.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,y.innerText="Preview backend running in this workspace."),y.setAttribute("id",p)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",d):d()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function lr(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(he())}function eu(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function cr(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function cl(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function tu(){const n=he();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function nu(){return el.NODE_ADMIN===!0}function hr(){try{return typeof indexedDB=="object"}catch{return!1}}function dr(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var r;e(((r=i.error)==null?void 0:r.message)||"")}}catch(t){e(t)}})}function hl(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const su="FirebaseError";class We extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=su,Object.setPrototypeOf(this,We.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Nt.prototype.create)}}class Nt{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?iu(r,s):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new We(i,a,s)}}function iu(n,e){return n.replace(ru,(t,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const ru=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mn(n){return JSON.parse(n)}function Z(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dl=function(n){let e={},t={},s={},i="";try{const r=n.split(".");e=Mn(ds(r[0])||""),t=Mn(ds(r[1])||""),i=r[2],s=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:s,signature:i}},ou=function(n){const e=dl(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},au=function(n){const e=dl(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oe(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Tt(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Ni(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function us(n,e,t){const s={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=e.call(t,n[i],i,n));return s}function ct(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const i of t){if(!s.includes(i))return!1;const r=n[i],o=e[i];if(To(r)&&To(o)){if(!ct(r,o))return!1}else if(r!==o)return!1}for(const i of s)if(!t.includes(i))return!1;return!0}function To(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zt(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const s=this.W_;if(typeof e=="string")for(let d=0;d<16;d++)s[d]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let d=0;d<16;d++)s[d]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let d=16;d<80;d++){const u=s[d-3]^s[d-8]^s[d-14]^s[d-16];s[d]=(u<<1|u>>>31)&4294967295}let i=this.chain_[0],r=this.chain_[1],o=this.chain_[2],a=this.chain_[3],l=this.chain_[4],c,h;for(let d=0;d<80;d++){d<40?d<20?(c=a^r&(o^a),h=1518500249):(c=r^o^a,h=1859775393):d<60?(c=r&o|a&(r|o),h=2400959708):(c=r^o^a,h=3395469782);const u=(i<<5|i>>>27)+c+l+h+s[d]&4294967295;l=a,a=o,o=(r<<30|r>>>2)&4294967295,r=i,i=u}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const s=t-this.blockSize;let i=0;const r=this.buf_;let o=this.inbuf_;for(;i<t;){if(o===0)for(;i<=s;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<t;)if(r[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}else for(;i<t;)if(r[o]=e[i],++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=t&255,t/=256;this.compress_(this.buf_);let s=0;for(let i=0;i<5;i++)for(let r=24;r>=0;r-=8)e[s]=this.chain_[i]>>r&255,++s;return e}}function cu(n,e){const t=new hu(n,e);return t.subscribe.bind(t)}class hu{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let i;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");du(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:s},i.next===void 0&&(i.next=ui),i.error===void 0&&(i.error=ui),i.complete===void 0&&(i.complete=ui);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function du(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function ui(){}function ur(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uu=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);if(i>=55296&&i<=56319){const r=i-55296;s++,S(s<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(s)-56320;i=65536+(r<<10)+o}i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):i<65536?(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Ls=function(n){let e=0;for(let t=0;t<n.length;t++){const s=n.charCodeAt(t);s<128?e++:s<2048?e+=2:s>=55296&&s<=56319?(e+=4,t++):e+=3}return e};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fu=1e3,pu=2,mu=4*60*60*1e3,gu=.5;function Co(n,e=fu,t=pu){const s=e*Math.pow(t,n),i=Math.round(gu*s*(Math.random()-.5)*2);return Math.min(mu,s+i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oe(n){return n&&n._delegate?n._delegate:n}class Ae{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yu{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new Wn;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(vu(e))try{this.getOrInitializeService({instanceIdentifier:yt})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=yt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=yt){return this.instances.has(e)}getOptions(e=yt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);s===a&&o.resolve(i)}return i}onInit(e,t){const s=this.normalizeInstanceIdentifier(t),i=this.onInitCallbacks.get(s)??new Set;i.add(e),this.onInitCallbacks.set(s,i);const r=this.instances.get(s);return r&&e(r,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const i of s)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:_u(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=yt){return this.component?this.component.multipleInstances?e:yt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function _u(n){return n===yt?void 0:n}function vu(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bu{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new yu(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var H;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(H||(H={}));const wu={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},Iu=H.INFO,Eu={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},Su=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),i=Eu[e];if(i)console[i](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Fs{constructor(e){this.name=e,this._logLevel=Iu,this._logHandler=Su,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?wu[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}const Tu=(n,e)=>e.some(t=>n instanceof t);let xo,ko;function Cu(){return xo||(xo=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function xu(){return ko||(ko=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ul=new WeakMap,Oi=new WeakMap,fl=new WeakMap,fi=new WeakMap,fr=new WeakMap;function ku(n){const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{t(rt(n.result)),i()},o=()=>{s(n.error),i()};n.addEventListener("success",r),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&ul.set(t,n)}).catch(()=>{}),fr.set(e,n),e}function Mu(n){if(Oi.has(n))return;const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{t(),i()},o=()=>{s(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});Oi.set(n,e)}let Di={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Oi.get(n);if(e==="objectStoreNames")return n.objectStoreNames||fl.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return rt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Pu(n){Di=n(Di)}function Ru(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(pi(this),e,...t);return fl.set(s,e.sort?e.sort():[e]),rt(s)}:xu().includes(n)?function(...e){return n.apply(pi(this),e),rt(ul.get(this))}:function(...e){return rt(n.apply(pi(this),e))}}function Au(n){return typeof n=="function"?Ru(n):(n instanceof IDBTransaction&&Mu(n),Tu(n,Cu())?new Proxy(n,Di):n)}function rt(n){if(n instanceof IDBRequest)return ku(n);if(fi.has(n))return fi.get(n);const e=Au(n);return e!==n&&(fi.set(n,e),fr.set(e,n)),e}const pi=n=>fr.get(n);function pl(n,e,{blocked:t,upgrade:s,blocking:i,terminated:r}={}){const o=indexedDB.open(n,e),a=rt(o);return s&&o.addEventListener("upgradeneeded",l=>{s(rt(o.result),l.oldVersion,l.newVersion,rt(o.transaction),l)}),t&&o.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const Nu=["get","getKey","getAll","getAllKeys","count"],Ou=["put","add","delete","clear"],mi=new Map;function Mo(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(mi.get(e))return mi.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,i=Ou.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(i||Nu.includes(t)))return;const r=async function(o,...a){const l=this.transaction(o,i?"readwrite":"readonly");let c=l.store;return s&&(c=c.index(a.shift())),(await Promise.all([c[t](...a),i&&l.done]))[0]};return mi.set(e,r),r}Pu(n=>({...n,get:(e,t,s)=>Mo(e,t)||n.get(e,t,s),has:(e,t)=>!!Mo(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Du{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Lu(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function Lu(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Li="@firebase/app",Po="0.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe=new Fs("@firebase/app"),Fu="@firebase/app-compat",Bu="@firebase/analytics-compat",Uu="@firebase/analytics",Wu="@firebase/app-check-compat",ju="@firebase/app-check",Vu="@firebase/auth",Hu="@firebase/auth-compat",$u="@firebase/database",zu="@firebase/data-connect",qu="@firebase/database-compat",Gu="@firebase/functions",Ku="@firebase/functions-compat",Yu="@firebase/installations",Xu="@firebase/installations-compat",Qu="@firebase/messaging",Ju="@firebase/messaging-compat",Zu="@firebase/performance",ef="@firebase/performance-compat",tf="@firebase/remote-config",nf="@firebase/remote-config-compat",sf="@firebase/storage",rf="@firebase/storage-compat",of="@firebase/firestore",af="@firebase/ai",lf="@firebase/firestore-compat",cf="firebase",hf="12.1.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fi="[DEFAULT]",df={[Li]:"fire-core",[Fu]:"fire-core-compat",[Uu]:"fire-analytics",[Bu]:"fire-analytics-compat",[ju]:"fire-app-check",[Wu]:"fire-app-check-compat",[Vu]:"fire-auth",[Hu]:"fire-auth-compat",[$u]:"fire-rtdb",[zu]:"fire-data-connect",[qu]:"fire-rtdb-compat",[Gu]:"fire-fn",[Ku]:"fire-fn-compat",[Yu]:"fire-iid",[Xu]:"fire-iid-compat",[Qu]:"fire-fcm",[Ju]:"fire-fcm-compat",[Zu]:"fire-perf",[ef]:"fire-perf-compat",[tf]:"fire-rc",[nf]:"fire-rc-compat",[sf]:"fire-gcs",[rf]:"fire-gcs-compat",[of]:"fire-fst",[lf]:"fire-fst-compat",[af]:"fire-vertex","fire-js":"fire-js",[cf]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fs=new Map,uf=new Map,Bi=new Map;function Ro(n,e){try{n.container.addComponent(e)}catch(t){Qe.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Be(n){const e=n.name;if(Bi.has(e))return Qe.debug(`There were multiple attempts to register component ${e}.`),!1;Bi.set(e,n);for(const t of fs.values())Ro(t,n);for(const t of uf.values())Ro(t,n);return!0}function Ot(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Te(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ff={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ot=new Nt("app","Firebase",ff);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pf{constructor(e,t,s){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Ae("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ot.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en=hf;function ml(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s={name:Fi,automaticDataCollectionEnabled:!0,...e},i=s.name;if(typeof i!="string"||!i)throw ot.create("bad-app-name",{appName:String(i)});if(t||(t=rl()),!t)throw ot.create("no-options");const r=fs.get(i);if(r){if(ct(t,r.options)&&ct(s,r.config))return r;throw ot.create("duplicate-app",{appName:i})}const o=new bu(i);for(const l of Bi.values())o.addComponent(l);const a=new pf(t,s,o);return fs.set(i,a),a}function pr(n=Fi){const e=fs.get(n);if(!e&&n===Fi&&rl())return ml();if(!e)throw ot.create("no-app",{appName:n});return e}function we(n,e,t){let s=df[n]??n;t&&(s+=`-${t}`);const i=s.match(/\s|\//),r=e.match(/\s|\//);if(i||r){const o=[`Unable to register library "${s}" with version "${e}":`];i&&o.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&r&&o.push("and"),r&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Qe.warn(o.join(" "));return}Be(new Ae(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mf="firebase-heartbeat-database",gf=1,Pn="firebase-heartbeat-store";let gi=null;function gl(){return gi||(gi=pl(mf,gf,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Pn)}catch(t){console.warn(t)}}}}).catch(n=>{throw ot.create("idb-open",{originalErrorMessage:n.message})})),gi}async function yf(n){try{const t=(await gl()).transaction(Pn),s=await t.objectStore(Pn).get(yl(n));return await t.done,s}catch(e){if(e instanceof We)Qe.warn(e.message);else{const t=ot.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Qe.warn(t.message)}}}async function Ao(n,e){try{const s=(await gl()).transaction(Pn,"readwrite");await s.objectStore(Pn).put(e,yl(n)),await s.done}catch(t){if(t instanceof We)Qe.warn(t.message);else{const s=ot.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Qe.warn(s.message)}}}function yl(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _f=1024,vf=30;class bf{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new If(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=No();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats.length>vf){const o=Ef(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){Qe.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=No(),{heartbeatsToSend:s,unsentEntries:i}=wf(this._heartbeatsCache.heartbeats),r=hs(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return Qe.warn(t),""}}}function No(){return new Date().toISOString().substring(0,10)}function wf(n,e=_f){const t=[];let s=n.slice();for(const i of n){const r=t.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),Oo(t)>e){r.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Oo(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class If{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return hr()?dr().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await yf(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Ao(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Ao(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Oo(n){return hs(JSON.stringify({version:2,heartbeats:n})).length}function Ef(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let s=1;s<n.length;s++)n[s].date<t&&(t=n[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sf(n){Be(new Ae("platform-logger",e=>new Du(e),"PRIVATE")),Be(new Ae("heartbeat",e=>new bf(e),"PRIVATE")),we(Li,Po,n),we(Li,Po,"esm2020"),we("fire-js","")}Sf("");var Tf="firebase",Cf="12.1.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */we(Tf,Cf,"app");function _l(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const xf=_l,vl=new Nt("auth","Firebase",_l());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ps=new Fs("@firebase/auth");function kf(n,...e){ps.logLevel<=H.WARN&&ps.warn(`Auth (${en}): ${n}`,...e)}function rs(n,...e){ps.logLevel<=H.ERROR&&ps.error(`Auth (${en}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ue(n,...e){throw gr(n,...e)}function Pe(n,...e){return gr(n,...e)}function mr(n,e,t){const s={...xf(),[e]:t};return new Nt("auth","Firebase",s).create(e,{appName:n.name})}function St(n){return mr(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Mf(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&Ue(n,"argument-error"),mr(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function gr(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return vl.create(n,...e)}function N(n,e,...t){if(!n)throw gr(e,...t)}function qe(n){const e="INTERNAL ASSERTION FAILED: "+n;throw rs(e),new Error(e)}function Je(n,e){n||qe(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ui(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function Pf(){return Do()==="http:"||Do()==="https:"}function Do(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rf(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Pf()||cr()||"connection"in navigator)?navigator.onLine:!0}function Af(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(e,t){this.shortDelay=e,this.longDelay=t,Je(t>e,"Short delay should be less than long delay!"),this.isMobile=lr()||cl()}get(){return Rf()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yr(n,e){Je(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bl{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;qe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;qe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;qe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nf={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Of=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Df=new jn(3e4,6e4);function _r(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function tn(n,e,t,s,i={}){return wl(n,i,async()=>{let r={},o={};s&&(e==="GET"?o=s:r={body:JSON.stringify(s)});const a=Zt({key:n.config.apiKey,...o}).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const c={method:e,headers:l,...r};return eu()||(c.referrerPolicy="no-referrer"),n.emulatorConfig&&Jt(n.emulatorConfig.host)&&(c.credentials="include"),bl.fetch()(await Il(n,n.config.apiHost,t,a),c)})}async function wl(n,e,t){n._canInitEmulator=!1;const s={...Nf,...e};try{const i=new Ff(n),r=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw ts(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const a=r.ok?o.errorMessage:o.error.message,[l,c]=a.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw ts(n,"credential-already-in-use",o);if(l==="EMAIL_EXISTS")throw ts(n,"email-already-in-use",o);if(l==="USER_DISABLED")throw ts(n,"user-disabled",o);const h=s[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw mr(n,h,c);Ue(n,h)}}catch(i){if(i instanceof We)throw i;Ue(n,"network-request-failed",{message:String(i)})}}async function Lf(n,e,t,s,i={}){const r=await tn(n,e,t,s,i);return"mfaPendingCredential"in r&&Ue(n,"multi-factor-auth-required",{_serverResponse:r}),r}async function Il(n,e,t,s){const i=`${e}${t}?${s}`,r=n,o=r.config.emulator?yr(n.config,i):`${n.config.apiScheme}://${i}`;return Of.includes(t)&&(await r._persistenceManagerAvailable,r._getPersistenceType()==="COOKIE")?r._getPersistence()._getFinalTarget(o).toString():o}class Ff{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(Pe(this.auth,"network-request-failed")),Df.get())})}}function ts(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const i=Pe(n,e,s);return i.customData._tokenResponse=t,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bf(n,e){return tn(n,"POST","/v1/accounts:delete",e)}async function ms(n,e){return tn(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Uf(n,e=!1){const t=oe(n),s=await t.getIdToken(e),i=vr(s);N(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const r=typeof i.firebase=="object"?i.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:i,token:s,authTime:wn(yi(i.auth_time)),issuedAtTime:wn(yi(i.iat)),expirationTime:wn(yi(i.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function yi(n){return Number(n)*1e3}function vr(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return rs("JWT malformed, contained fewer than 3 sections"),null;try{const i=ds(t);return i?JSON.parse(i):(rs("Failed to decode base64 JWT payload"),null)}catch(i){return rs("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Lo(n){const e=vr(n);return N(e,"internal-error"),N(typeof e.exp<"u","internal-error"),N(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rn(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof We&&Wf(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function Wf({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jf{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const s=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=wn(this.lastLoginAt),this.creationTime=wn(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gs(n){var d;const e=n.auth,t=await n.getIdToken(),s=await Rn(n,ms(e,{idToken:t}));N(s==null?void 0:s.users.length,e,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const r=(d=i.providerUserInfo)!=null&&d.length?El(i.providerUserInfo):[],o=Hf(n.providerData,r),a=n.isAnonymous,l=!(n.email&&i.passwordHash)&&!(o!=null&&o.length),c=a?l:!1,h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new Wi(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(n,h)}async function Vf(n){const e=oe(n);await gs(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Hf(n,e){return[...n.filter(s=>!e.some(i=>i.providerId===s.providerId)),...e]}function El(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $f(n,e){const t=await wl(n,{},async()=>{const s=Zt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:r}=n.config,o=await Il(n,i,"/v1/token",`key=${r}`),a=await n._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:a,body:s};return n.emulatorConfig&&Jt(n.emulatorConfig.host)&&(l.credentials="include"),bl.fetch()(o,l)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function zf(n,e){return tn(n,"POST","/v2/accounts:revokeToken",_r(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){N(e.idToken,"internal-error"),N(typeof e.idToken<"u","internal-error"),N(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Lo(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){N(e.length!==0,"internal-error");const t=Lo(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(N(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:i,expiresIn:r}=await $f(e,t);this.updateTokensAndExpiration(s,i,Number(r))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:i,expirationTime:r}=t,o=new Vt;return s&&(N(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),i&&(N(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),r&&(N(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Vt,this.toJSON())}_performRefresh(){return qe("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tt(n,e){N(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class xe{constructor({uid:e,auth:t,stsTokenManager:s,...i}){this.providerId="firebase",this.proactiveRefresh=new jf(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Wi(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Rn(this,this.stsTokenManager.getToken(this.auth,e));return N(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Uf(this,e)}reload(){return Vf(this)}_assign(e){this!==e&&(N(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new xe({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){N(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await gs(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Te(this.auth.app))return Promise.reject(St(this.auth));const e=await this.getIdToken();return await Rn(this,Bf(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const s=t.displayName??void 0,i=t.email??void 0,r=t.phoneNumber??void 0,o=t.photoURL??void 0,a=t.tenantId??void 0,l=t._redirectEventId??void 0,c=t.createdAt??void 0,h=t.lastLoginAt??void 0,{uid:d,emailVerified:u,isAnonymous:p,providerData:y,stsTokenManager:w}=t;N(d&&w,e,"internal-error");const I=Vt.fromJSON(this.name,w);N(typeof d=="string",e,"internal-error"),tt(s,e.name),tt(i,e.name),N(typeof u=="boolean",e,"internal-error"),N(typeof p=="boolean",e,"internal-error"),tt(r,e.name),tt(o,e.name),tt(a,e.name),tt(l,e.name),tt(c,e.name),tt(h,e.name);const m=new xe({uid:d,auth:e,email:i,emailVerified:u,displayName:s,isAnonymous:p,photoURL:o,phoneNumber:r,tenantId:a,stsTokenManager:I,createdAt:c,lastLoginAt:h});return y&&Array.isArray(y)&&(m.providerData=y.map(f=>({...f}))),l&&(m._redirectEventId=l),m}static async _fromIdTokenResponse(e,t,s=!1){const i=new Vt;i.updateFromServerResponse(t);const r=new xe({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:s});return await gs(r),r}static async _fromGetAccountInfoResponse(e,t,s){const i=t.users[0];N(i.localId!==void 0,"internal-error");const r=i.providerUserInfo!==void 0?El(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(r!=null&&r.length),a=new Vt;a.updateFromIdToken(s);const l=new xe({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:o}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:r,metadata:new Wi(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(r!=null&&r.length)};return Object.assign(l,c),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fo=new Map;function Ge(n){Je(n instanceof Function,"Expected a class definition");let e=Fo.get(n);return e?(Je(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Fo.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sl{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Sl.type="NONE";const Bo=Sl;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function os(n,e,t){return`firebase:${n}:${e}:${t}`}class Ht{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:i,name:r}=this.auth;this.fullUserKey=os(this.userKey,i.apiKey,r),this.fullPersistenceKey=os("persistence",i.apiKey,r),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await ms(this.auth,{idToken:e}).catch(()=>{});return t?xe._fromGetAccountInfoResponse(this.auth,t,e):null}return xe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new Ht(Ge(Bo),e,s);const i=(await Promise.all(t.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let r=i[0]||Ge(Bo);const o=os(s,e.config.apiKey,e.name);let a=null;for(const c of t)try{const h=await c._get(o);if(h){let d;if(typeof h=="string"){const u=await ms(e,{idToken:h}).catch(()=>{});if(!u)break;d=await xe._fromGetAccountInfoResponse(e,u,h)}else d=xe._fromJSON(e,h);c!==r&&(a=d),r=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!r._shouldAllowMigration||!l.length?new Ht(r,e,s):(r=l[0],a&&await r._set(o,a.toJSON()),await Promise.all(t.map(async c=>{if(c!==r)try{await c._remove(o)}catch{}})),new Ht(r,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uo(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(kl(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Tl(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Pl(e))return"Blackberry";if(Rl(e))return"Webos";if(Cl(e))return"Safari";if((e.includes("chrome/")||xl(e))&&!e.includes("edge/"))return"Chrome";if(Ml(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Tl(n=he()){return/firefox\//i.test(n)}function Cl(n=he()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function xl(n=he()){return/crios\//i.test(n)}function kl(n=he()){return/iemobile/i.test(n)}function Ml(n=he()){return/android/i.test(n)}function Pl(n=he()){return/blackberry/i.test(n)}function Rl(n=he()){return/webos/i.test(n)}function br(n=he()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function qf(n=he()){var e;return br(n)&&!!((e=window.navigator)!=null&&e.standalone)}function Gf(){return tu()&&document.documentMode===10}function Al(n=he()){return br(n)||Ml(n)||Rl(n)||Pl(n)||/windows phone/i.test(n)||kl(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nl(n,e=[]){let t;switch(n){case"Browser":t=Uo(he());break;case"Worker":t=`${Uo(he())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${en}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=r=>new Promise((o,a)=>{try{const l=e(r);o(l)}catch(l){a(l)}});s.onAbort=t,this.queue.push(s);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yf(n,e={}){return tn(n,"GET","/v2/passwordPolicy",_r(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xf=6;class Qf{constructor(e){var s;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Xf,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((s=e.allowedNonAlphanumericCharacters)==null?void 0:s.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let i=0;i<e.length;i++)s=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,i,r){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(e,t,s,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Wo(this),this.idTokenSubscription=new Wo(this),this.beforeStateQueue=new Kf(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=vl,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(r=>this._resolvePersistenceManagerAvailable=r)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ge(t)),this._initializationPromise=this.queue(async()=>{var s,i,r;if(!this._deleted&&(this.persistenceManager=await Ht.create(this,e),(s=this._resolvePersistenceManagerAvailable)==null||s.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((r=this.currentUser)==null?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await ms(this,{idToken:e}),s=await xe._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var r;if(Te(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let s=t,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(r=this.redirectUser)==null?void 0:r._redirectEventId,a=s==null?void 0:s._redirectEventId,l=await this.tryRedirectSignIn(e);(!o||o===a)&&(l!=null&&l.user)&&(s=l.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return N(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await gs(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Af()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Te(this.app))return Promise.reject(St(this));const t=e?oe(e):null;return t&&N(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&N(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Te(this.app)?Promise.reject(St(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Te(this.app)?Promise.reject(St(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ge(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Yf(this),t=new Qf(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Nt("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await zf(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Ge(e)||this._popupRedirectResolver;N(t,this,"argument-error"),this.redirectPersistenceManager=await Ht.create(this,[Ge(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)==null?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,i){if(this._deleted)return()=>{};const r=typeof t=="function"?t:t.next.bind(t);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(N(a,this,"internal-error"),a.then(()=>{o||r(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,s,i);return()=>{o=!0,l()}}else{const l=e.addObserver(t);return()=>{o=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return N(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Nl(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;if(Te(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&kf(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Bs(n){return oe(n)}class Wo{constructor(e){this.auth=e,this.observer=null,this.addObserver=cu(t=>this.observer=t)}get next(){return N(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let wr={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Zf(n){wr=n}function ep(n){return wr.loadJS(n)}function tp(){return wr.gapiScript}function np(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sp(n,e){const t=Ot(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),r=t.getOptions();if(ct(r,e??{}))return i;Ue(i,"already-initialized")}return t.initialize({options:e})}function ip(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Ge);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function rp(n,e,t){const s=Bs(n);N(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const i=!1,r=Ol(e),{host:o,port:a}=op(e),l=a===null?"":`:${a}`,c={url:`${r}//${o}${l}/`},h=Object.freeze({host:o,port:a,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!s._canInitEmulator){N(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),N(ct(c,s.config.emulator)&&ct(h,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=c,s.emulatorConfig=h,s.settings.appVerificationDisabledForTesting=!0,Jt(o)?(al(`${r}//${o}${l}`),ll("Auth",!0)):ap()}function Ol(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function op(n){const e=Ol(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(s);if(i){const r=i[1];return{host:r,port:jo(s.substr(r.length+1))}}else{const[r,o]=s.split(":");return{host:r,port:jo(o)}}}function jo(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function ap(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dl{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return qe("not implemented")}_getIdTokenResponse(e){return qe("not implemented")}_linkToIdToken(e,t){return qe("not implemented")}_getReauthenticationResolver(e){return qe("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $t(n,e){return Lf(n,"POST","/v1/accounts:signInWithIdp",_r(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lp="http://localhost";class Ct extends Dl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ct(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Ue("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:i,...r}=t;if(!s||!i)return null;const o=new Ct(s,i);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return $t(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,$t(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,$t(e,t)}buildRequest(){const e={requestUri:lp,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Zt(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ir{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn extends Ir{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt extends Vn{constructor(){super("facebook.com")}static credential(e){return Ct._fromParams({providerId:nt.PROVIDER_ID,signInMethod:nt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return nt.credentialFromTaggedObject(e)}static credentialFromError(e){return nt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return nt.credential(e.oauthAccessToken)}catch{return null}}}nt.FACEBOOK_SIGN_IN_METHOD="facebook.com";nt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e extends Vn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ct._fromParams({providerId:$e.PROVIDER_ID,signInMethod:$e.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return $e.credentialFromTaggedObject(e)}static credentialFromError(e){return $e.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return $e.credential(t,s)}catch{return null}}}$e.GOOGLE_SIGN_IN_METHOD="google.com";$e.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st extends Vn{constructor(){super("github.com")}static credential(e){return Ct._fromParams({providerId:st.PROVIDER_ID,signInMethod:st.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return st.credentialFromTaggedObject(e)}static credentialFromError(e){return st.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return st.credential(e.oauthAccessToken)}catch{return null}}}st.GITHUB_SIGN_IN_METHOD="github.com";st.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it extends Vn{constructor(){super("twitter.com")}static credential(e,t){return Ct._fromParams({providerId:it.PROVIDER_ID,signInMethod:it.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return it.credentialFromTaggedObject(e)}static credentialFromError(e){return it.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return it.credential(t,s)}catch{return null}}}it.TWITTER_SIGN_IN_METHOD="twitter.com";it.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,i=!1){const r=await xe._fromIdTokenResponse(e,s,i),o=Vo(s);return new Gt({user:r,providerId:o,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const i=Vo(s);return new Gt({user:e,providerId:i,_tokenResponse:s,operationType:t})}}function Vo(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys extends We{constructor(e,t,s,i){super(t.code,t.message),this.operationType=s,this.user=i,Object.setPrototypeOf(this,ys.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,i){return new ys(e,t,s,i)}}function Ll(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?ys._fromErrorAndOperation(n,r,e,s):r})}async function cp(n,e,t=!1){const s=await Rn(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Gt._forOperation(n,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hp(n,e,t=!1){const{auth:s}=n;if(Te(s.app))return Promise.reject(St(s));const i="reauthenticate";try{const r=await Rn(n,Ll(s,i,e,n),t);N(r.idToken,s,"internal-error");const o=vr(r.idToken);N(o,s,"internal-error");const{sub:a}=o;return N(n.uid===a,s,"user-mismatch"),Gt._forOperation(n,i,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&Ue(s,"user-mismatch"),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dp(n,e,t=!1){if(Te(n.app))return Promise.reject(St(n));const s="signIn",i=await Ll(n,s,e),r=await Gt._fromIdTokenResponse(n,s,i);return t||await n._updateCurrentUser(r.user),r}function up(n,e,t,s){return oe(n).onIdTokenChanged(e,t,s)}function fp(n,e,t){return oe(n).beforeAuthStateChanged(e,t)}function Er(n,e,t,s){return oe(n).onAuthStateChanged(e,t,s)}function pp(n){return oe(n).signOut()}const _s="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(_s,"1"),this.storage.removeItem(_s),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mp=1e3,gp=10;class Bl extends Fl{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Al(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),i=this.localCache[t];s!==i&&e(t,i,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,l)=>{this.notifyListeners(o,l)});return}const s=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(s);!t&&this.localCache[s]===o||this.notifyListeners(s,o)},r=this.storage.getItem(s);Gf()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,gp):i()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},mp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Bl.type="LOCAL";const yp=Bl;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul extends Fl{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Ul.type="SESSION";const Wl=Ul;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _p(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Us{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const s=new Us(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:i,data:r}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:i});const a=Array.from(o).map(async c=>c(t.origin,r)),l=await _p(a);t.ports[0].postMessage({status:"done",eventId:s,eventType:i,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Us.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sr(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vp{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let r,o;return new Promise((a,l)=>{const c=Sr("",20);i.port1.start();const h=setTimeout(()=>{l(new Error("unsupported_event"))},s);o={messageChannel:i,onMessage(d){const u=d;if(u.data.eventId===c)switch(u.data.status){case"ack":clearTimeout(h),r=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),a(u.data.response);break;default:clearTimeout(h),clearTimeout(r),l(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(){return window}function bp(n){Fe().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jl(){return typeof Fe().WorkerGlobalScope<"u"&&typeof Fe().importScripts=="function"}async function wp(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Ip(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function Ep(){return jl()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vl="firebaseLocalStorageDb",Sp=1,vs="firebaseLocalStorage",Hl="fbase_key";class Hn{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ws(n,e){return n.transaction([vs],e?"readwrite":"readonly").objectStore(vs)}function Tp(){const n=indexedDB.deleteDatabase(Vl);return new Hn(n).toPromise()}function ji(){const n=indexedDB.open(Vl,Sp);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(vs,{keyPath:Hl})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(vs)?e(s):(s.close(),await Tp(),e(await ji()))})})}async function Ho(n,e,t){const s=Ws(n,!0).put({[Hl]:e,value:t});return new Hn(s).toPromise()}async function Cp(n,e){const t=Ws(n,!1).get(e),s=await new Hn(t).toPromise();return s===void 0?null:s.value}function $o(n,e){const t=Ws(n,!0).delete(e);return new Hn(t).toPromise()}const xp=800,kp=3;class $l{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ji(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>kp)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return jl()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Us._getInstance(Ep()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,s;if(this.activeServiceWorker=await wp(),!this.activeServiceWorker)return;this.sender=new vp(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(s=e[0])!=null&&s.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Ip()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ji();return await Ho(e,_s,"1"),await $o(e,_s),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Ho(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>Cp(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>$o(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const r=Ws(i,!1).getAll();return new Hn(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:i,value:r}of e)s.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(r)&&(this.notifyListeners(i,r),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!s.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),xp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}$l.type="LOCAL";const Mp=$l;new jn(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zl(n,e){return e?Ge(e):(N(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr extends Dl{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return $t(e,this._buildIdpRequest())}_linkToIdToken(e,t){return $t(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return $t(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Pp(n){return dp(n.auth,new Tr(n),n.bypassAuthState)}function Rp(n){const{auth:e,user:t}=n;return N(t,e,"internal-error"),hp(t,new Tr(n),n.bypassAuthState)}async function Ap(n){const{auth:e,user:t}=n;return N(t,e,"internal-error"),cp(t,new Tr(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ql{constructor(e,t,s,i,r=!1){this.auth=e,this.resolver=s,this.user=i,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:i,tenantId:r,error:o,type:a}=e;if(o){this.reject(o);return}const l={auth:this.auth,requestUri:t,sessionId:s,tenantId:r||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Pp;case"linkViaPopup":case"linkViaRedirect":return Ap;case"reauthViaPopup":case"reauthViaRedirect":return Rp;default:Ue(this.auth,"internal-error")}}resolve(e){Je(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Je(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Np=new jn(2e3,1e4);async function Op(n,e,t){if(Te(n.app))return Promise.reject(Pe(n,"operation-not-supported-in-this-environment"));const s=Bs(n);Mf(n,e,Ir);const i=zl(s,t);return new vt(s,"signInViaPopup",e,i).executeNotNull()}class vt extends ql{constructor(e,t,s,i,r){super(e,t,i,r),this.provider=s,this.authWindow=null,this.pollId=null,vt.currentPopupAction&&vt.currentPopupAction.cancel(),vt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return N(e,this.auth,"internal-error"),e}async onExecution(){Je(this.filter.length===1,"Popup operations only handle one event");const e=Sr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Pe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Pe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,vt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if((s=(t=this.authWindow)==null?void 0:t.window)!=null&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Pe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Np.get())};e()}}vt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dp="pendingRedirect",as=new Map;class Lp extends ql{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=as.get(this.auth._key());if(!e){try{const s=await Fp(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}as.set(this.auth._key(),e)}return this.bypassAuthState||as.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Fp(n,e){const t=Wp(e),s=Up(n);if(!await s._isAvailable())return!1;const i=await s._get(t)==="true";return await s._remove(t),i}function Bp(n,e){as.set(n._key(),e)}function Up(n){return Ge(n._redirectPersistence)}function Wp(n){return os(Dp,n.config.apiKey,n.name)}async function jp(n,e,t=!1){if(Te(n.app))return Promise.reject(St(n));const s=Bs(n),i=zl(s,e),o=await new Lp(s,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vp=10*60*1e3;class Hp{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!$p(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!Gl(e)){const i=((s=e.error.code)==null?void 0:s.split("auth/")[1])||"internal-error";t.onError(Pe(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Vp&&this.cachedEventUids.clear(),this.cachedEventUids.has(zo(e))}saveEventToCache(e){this.cachedEventUids.add(zo(e)),this.lastProcessedEventTime=Date.now()}}function zo(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Gl({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function $p(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Gl(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zp(n,e={}){return tn(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qp=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Gp=/^https?/;async function Kp(n){if(n.config.emulator)return;const{authorizedDomains:e}=await zp(n);for(const t of e)try{if(Yp(t))return}catch{}Ue(n,"unauthorized-domain")}function Yp(n){const e=Ui(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===s}if(!Gp.test(t))return!1;if(qp.test(n))return s===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xp=new jn(3e4,6e4);function qo(){const n=Fe().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Qp(n){return new Promise((e,t)=>{var i,r,o;function s(){qo(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{qo(),t(Pe(n,"network-request-failed"))},timeout:Xp.get()})}if((r=(i=Fe().gapi)==null?void 0:i.iframes)!=null&&r.Iframe)e(gapi.iframes.getContext());else if((o=Fe().gapi)!=null&&o.load)s();else{const a=np("iframefcb");return Fe()[a]=()=>{gapi.load?s():t(Pe(n,"network-request-failed"))},ep(`${tp()}?onload=${a}`).catch(l=>t(l))}}).catch(e=>{throw ls=null,e})}let ls=null;function Jp(n){return ls=ls||Qp(n),ls}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zp=new jn(5e3,15e3),em="__/auth/iframe",tm="emulator/auth/iframe",nm={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},sm=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function im(n){const e=n.config;N(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?yr(e,tm):`https://${n.config.authDomain}/${em}`,s={apiKey:e.apiKey,appName:n.name,v:en},i=sm.get(n.config.apiHost);i&&(s.eid=i);const r=n._getFrameworks();return r.length&&(s.fw=r.join(",")),`${t}?${Zt(s).slice(1)}`}async function rm(n){const e=await Jp(n),t=Fe().gapi;return N(t,n,"internal-error"),e.open({where:document.body,url:im(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:nm,dontclear:!0},s=>new Promise(async(i,r)=>{await s.restyle({setHideOnLeave:!1});const o=Pe(n,"network-request-failed"),a=Fe().setTimeout(()=>{r(o)},Zp.get());function l(){Fe().clearTimeout(a),i(s)}s.ping(l).then(l,()=>{r(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const om={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},am=500,lm=600,cm="_blank",hm="http://localhost";class Go{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function dm(n,e,t,s=am,i=lm){const r=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let a="";const l={...om,width:s.toString(),height:i.toString(),top:r,left:o},c=he().toLowerCase();t&&(a=xl(c)?cm:t),Tl(c)&&(e=e||hm,l.scrollbars="yes");const h=Object.entries(l).reduce((u,[p,y])=>`${u}${p}=${y},`,"");if(qf(c)&&a!=="_self")return um(e||"",a),new Go(null);const d=window.open(e||"",a,h);N(d,n,"popup-blocked");try{d.focus()}catch{}return new Go(d)}function um(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fm="__/auth/handler",pm="emulator/auth/handler",mm=encodeURIComponent("fac");async function Ko(n,e,t,s,i,r){N(n.config.authDomain,n,"auth-domain-config-required"),N(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:en,eventId:i};if(e instanceof Ir){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Ni(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,d]of Object.entries({}))o[h]=d}if(e instanceof Vn){const h=e.getScopes().filter(d=>d!=="");h.length>0&&(o.scopes=h.join(","))}n.tenantId&&(o.tid=n.tenantId);const a=o;for(const h of Object.keys(a))a[h]===void 0&&delete a[h];const l=await n._getAppCheckToken(),c=l?`#${mm}=${encodeURIComponent(l)}`:"";return`${gm(n)}?${Zt(a).slice(1)}${c}`}function gm({config:n}){return n.emulator?yr(n,pm):`https://${n.authDomain}/${fm}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _i="webStorageSupport";class ym{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Wl,this._completeRedirectFn=jp,this._overrideRedirectResult=Bp}async _openPopup(e,t,s,i){var o;Je((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const r=await Ko(e,t,s,Ui(),i);return dm(e,r,Sr())}async _openRedirect(e,t,s,i){await this._originValidation(e);const r=await Ko(e,t,s,Ui(),i);return bp(r),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:r}=this.eventManagers[t];return i?Promise.resolve(i):(Je(r,"If manager is not set, promise should be"),r)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await rm(e),s=new Hp(e);return t.register("authEvent",i=>(N(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:s.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(_i,{type:_i},i=>{var o;const r=(o=i==null?void 0:i[0])==null?void 0:o[_i];r!==void 0&&t(!!r),Ue(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Kp(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Al()||Cl()||br()}}const _m=ym;var Yo="@firebase/auth",Xo="1.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vm{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){N(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bm(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function wm(n){Be(new Ae("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=s.options;N(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const l={apiKey:o,authDomain:a,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Nl(n)},c=new Jf(s,i,r,l);return ip(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),Be(new Ae("auth-internal",e=>{const t=Bs(e.getProvider("auth").getImmediate());return(s=>new vm(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),we(Yo,Xo,bm(n)),we(Yo,Xo,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Im=5*60,Em=ol("authIdTokenMaxAge")||Im;let Qo=null;const Sm=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>Em)return;const i=t==null?void 0:t.token;Qo!==i&&(Qo=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Tm(n=pr()){const e=Ot(n,"auth");if(e.isInitialized())return e.getImmediate();const t=sp(n,{popupRedirectResolver:_m,persistence:[Mp,yp,Wl]}),s=ol("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(s,location.origin);if(location.origin===r.origin){const o=Sm(r.toString());fp(t,o,()=>o(t.currentUser)),up(t,a=>o(a))}}const i=il("auth");return i&&rp(t,`http://${i}`),t}function Cm(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}Zf({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=i=>{const r=Pe("internal-error");r.customData=i,t(r)},s.type="text/javascript",s.charset="UTF-8",Cm().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});wm("Browser");const Kl="@firebase/installations",Cr="0.6.19";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yl=1e4,Xl=`w:${Cr}`,Ql="FIS_v2",xm="https://firebaseinstallations.googleapis.com/v1",km=60*60*1e3,Mm="installations",Pm="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rm={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},xt=new Nt(Mm,Pm,Rm);function Jl(n){return n instanceof We&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zl({projectId:n}){return`${xm}/projects/${n}/installations`}function ec(n){return{token:n.token,requestStatus:2,expiresIn:Nm(n.expiresIn),creationTime:Date.now()}}async function tc(n,e){const s=(await e.json()).error;return xt.create("request-failed",{requestName:n,serverCode:s.code,serverMessage:s.message,serverStatus:s.status})}function nc({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function Am(n,{refreshToken:e}){const t=nc(n);return t.append("Authorization",Om(e)),t}async function sc(n){const e=await n();return e.status>=500&&e.status<600?n():e}function Nm(n){return Number(n.replace("s","000"))}function Om(n){return`${Ql} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dm({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const s=Zl(n),i=nc(n),r=e.getImmediate({optional:!0});if(r){const c=await r.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}const o={fid:t,authVersion:Ql,appId:n.appId,sdkVersion:Xl},a={method:"POST",headers:i,body:JSON.stringify(o)},l=await sc(()=>fetch(s,a));if(l.ok){const c=await l.json();return{fid:c.fid||t,registrationStatus:2,refreshToken:c.refreshToken,authToken:ec(c.authToken)}}else throw await tc("Create Installation",l)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ic(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lm(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fm=/^[cdef][\w-]{21}$/,Vi="";function Bm(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=Um(n);return Fm.test(t)?t:Vi}catch{return Vi}}function Um(n){return Lm(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function js(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rc=new Map;function oc(n,e){const t=js(n);ac(t,e),Wm(t,e)}function ac(n,e){const t=rc.get(n);if(t)for(const s of t)s(e)}function Wm(n,e){const t=jm();t&&t.postMessage({key:n,fid:e}),Vm()}let bt=null;function jm(){return!bt&&"BroadcastChannel"in self&&(bt=new BroadcastChannel("[Firebase] FID Change"),bt.onmessage=n=>{ac(n.data.key,n.data.fid)}),bt}function Vm(){rc.size===0&&bt&&(bt.close(),bt=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hm="firebase-installations-database",$m=1,kt="firebase-installations-store";let vi=null;function xr(){return vi||(vi=pl(Hm,$m,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(kt)}}})),vi}async function bs(n,e){const t=js(n),i=(await xr()).transaction(kt,"readwrite"),r=i.objectStore(kt),o=await r.get(t);return await r.put(e,t),await i.done,(!o||o.fid!==e.fid)&&oc(n,e.fid),e}async function lc(n){const e=js(n),s=(await xr()).transaction(kt,"readwrite");await s.objectStore(kt).delete(e),await s.done}async function Vs(n,e){const t=js(n),i=(await xr()).transaction(kt,"readwrite"),r=i.objectStore(kt),o=await r.get(t),a=e(o);return a===void 0?await r.delete(t):await r.put(a,t),await i.done,a&&(!o||o.fid!==a.fid)&&oc(n,a.fid),a}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kr(n){let e;const t=await Vs(n.appConfig,s=>{const i=zm(s),r=qm(n,i);return e=r.registrationPromise,r.installationEntry});return t.fid===Vi?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function zm(n){const e=n||{fid:Bm(),registrationStatus:0};return cc(e)}function qm(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(xt.create("app-offline"));return{installationEntry:e,registrationPromise:i}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},s=Gm(n,t);return{installationEntry:t,registrationPromise:s}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Km(n)}:{installationEntry:e}}async function Gm(n,e){try{const t=await Dm(n,e);return bs(n.appConfig,t)}catch(t){throw Jl(t)&&t.customData.serverCode===409?await lc(n.appConfig):await bs(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function Km(n){let e=await Jo(n.appConfig);for(;e.registrationStatus===1;)await ic(100),e=await Jo(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:s}=await kr(n);return s||t}return e}function Jo(n){return Vs(n,e=>{if(!e)throw xt.create("installation-not-found");return cc(e)})}function cc(n){return Ym(n)?{fid:n.fid,registrationStatus:0}:n}function Ym(n){return n.registrationStatus===1&&n.registrationTime+Yl<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xm({appConfig:n,heartbeatServiceProvider:e},t){const s=Qm(n,t),i=Am(n,t),r=e.getImmediate({optional:!0});if(r){const c=await r.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}const o={installation:{sdkVersion:Xl,appId:n.appId}},a={method:"POST",headers:i,body:JSON.stringify(o)},l=await sc(()=>fetch(s,a));if(l.ok){const c=await l.json();return ec(c)}else throw await tc("Generate Auth Token",l)}function Qm(n,{fid:e}){return`${Zl(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mr(n,e=!1){let t;const s=await Vs(n.appConfig,r=>{if(!hc(r))throw xt.create("not-registered");const o=r.authToken;if(!e&&eg(o))return r;if(o.requestStatus===1)return t=Jm(n,e),r;{if(!navigator.onLine)throw xt.create("app-offline");const a=ng(r);return t=Zm(n,a),a}});return t?await t:s.authToken}async function Jm(n,e){let t=await Zo(n.appConfig);for(;t.authToken.requestStatus===1;)await ic(100),t=await Zo(n.appConfig);const s=t.authToken;return s.requestStatus===0?Mr(n,e):s}function Zo(n){return Vs(n,e=>{if(!hc(e))throw xt.create("not-registered");const t=e.authToken;return sg(t)?{...e,authToken:{requestStatus:0}}:e})}async function Zm(n,e){try{const t=await Xm(n,e),s={...e,authToken:t};return await bs(n.appConfig,s),t}catch(t){if(Jl(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await lc(n.appConfig);else{const s={...e,authToken:{requestStatus:0}};await bs(n.appConfig,s)}throw t}}function hc(n){return n!==void 0&&n.registrationStatus===2}function eg(n){return n.requestStatus===2&&!tg(n)}function tg(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+km}function ng(n){const e={requestStatus:1,requestTime:Date.now()};return{...n,authToken:e}}function sg(n){return n.requestStatus===1&&n.requestTime+Yl<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ig(n){const e=n,{installationEntry:t,registrationPromise:s}=await kr(e);return s?s.catch(console.error):Mr(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rg(n,e=!1){const t=n;return await og(t),(await Mr(t,e)).token}async function og(n){const{registrationPromise:e}=await kr(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ag(n){if(!n||!n.options)throw bi("App Configuration");if(!n.name)throw bi("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw bi(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function bi(n){return xt.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dc="installations",lg="installations-internal",cg=n=>{const e=n.getProvider("app").getImmediate(),t=ag(e),s=Ot(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:s,_delete:()=>Promise.resolve()}},hg=n=>{const e=n.getProvider("app").getImmediate(),t=Ot(e,dc).getImmediate();return{getId:()=>ig(t),getToken:i=>rg(t,i)}};function dg(){Be(new Ae(dc,cg,"PUBLIC")),Be(new Ae(lg,hg,"PRIVATE"))}dg();we(Kl,Cr);we(Kl,Cr,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ws="analytics",ug="firebase_id",fg="origin",pg=60*1e3,mg="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Pr="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fe=new Fs("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gg={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},_e=new Nt("analytics","Analytics",gg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yg(n){if(!n.startsWith(Pr)){const e=_e.create("invalid-gtag-resource",{gtagURL:n});return fe.warn(e.message),""}return n}function uc(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function _g(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function vg(n,e){const t=_g("firebase-js-sdk-policy",{createScriptURL:yg}),s=document.createElement("script"),i=`${Pr}?l=${n}&id=${e}`;s.src=t?t==null?void 0:t.createScriptURL(i):i,s.async=!0,document.head.appendChild(s)}function bg(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function wg(n,e,t,s,i,r){const o=s[i];try{if(o)await e[o];else{const l=(await uc(t)).find(c=>c.measurementId===i);l&&await e[l.appId]}}catch(a){fe.error(a)}n("config",i,r)}async function Ig(n,e,t,s,i){try{let r=[];if(i&&i.send_to){let o=i.send_to;Array.isArray(o)||(o=[o]);const a=await uc(t);for(const l of o){const c=a.find(d=>d.measurementId===l),h=c&&e[c.appId];if(h)r.push(h);else{r=[];break}}}r.length===0&&(r=Object.values(e)),await Promise.all(r),n("event",s,i||{})}catch(r){fe.error(r)}}function Eg(n,e,t,s){async function i(r,...o){try{if(r==="event"){const[a,l]=o;await Ig(n,e,t,a,l)}else if(r==="config"){const[a,l]=o;await wg(n,e,t,s,a,l)}else if(r==="consent"){const[a,l]=o;n("consent",a,l)}else if(r==="get"){const[a,l,c]=o;n("get",a,l,c)}else if(r==="set"){const[a]=o;n("set",a)}else n(r,...o)}catch(a){fe.error(a)}}return i}function Sg(n,e,t,s,i){let r=function(...o){window[s].push(arguments)};return window[i]&&typeof window[i]=="function"&&(r=window[i]),window[i]=Eg(r,n,e,t),{gtagCore:r,wrappedGtag:window[i]}}function Tg(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(Pr)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cg=30,xg=1e3;class kg{constructor(e={},t=xg){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const fc=new kg;function Mg(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Pg(n){var o;const{appId:e,apiKey:t}=n,s={method:"GET",headers:Mg(t)},i=mg.replace("{app-id}",e),r=await fetch(i,s);if(r.status!==200&&r.status!==304){let a="";try{const l=await r.json();(o=l.error)!=null&&o.message&&(a=l.error.message)}catch{}throw _e.create("config-fetch-failed",{httpStatus:r.status,responseMessage:a})}return r.json()}async function Rg(n,e=fc,t){const{appId:s,apiKey:i,measurementId:r}=n.options;if(!s)throw _e.create("no-app-id");if(!i){if(r)return{measurementId:r,appId:s};throw _e.create("no-api-key")}const o=e.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},a=new Og;return setTimeout(async()=>{a.abort()},pg),pc({appId:s,apiKey:i,measurementId:r},o,a,e)}async function pc(n,{throttleEndTimeMillis:e,backoffCount:t},s,i=fc){var a;const{appId:r,measurementId:o}=n;try{await Ag(s,e)}catch(l){if(o)return fe.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${l==null?void 0:l.message}]`),{appId:r,measurementId:o};throw l}try{const l=await Pg(n);return i.deleteThrottleMetadata(r),l}catch(l){const c=l;if(!Ng(c)){if(i.deleteThrottleMetadata(r),o)return fe.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:r,measurementId:o};throw l}const h=Number((a=c==null?void 0:c.customData)==null?void 0:a.httpStatus)===503?Co(t,i.intervalMillis,Cg):Co(t,i.intervalMillis),d={throttleEndTimeMillis:Date.now()+h,backoffCount:t+1};return i.setThrottleMetadata(r,d),fe.debug(`Calling attemptFetch again in ${h} millis`),pc(n,d,s,i)}}function Ag(n,e){return new Promise((t,s)=>{const i=Math.max(e-Date.now(),0),r=setTimeout(t,i);n.addEventListener(()=>{clearTimeout(r),s(_e.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function Ng(n){if(!(n instanceof We)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class Og{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function Dg(n,e,t,s,i){if(i&&i.global){n("event",t,s);return}else{const r=await e,o={...s,send_to:r};n("event",t,o)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lg(){if(hr())try{await dr()}catch(n){return fe.warn(_e.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return fe.warn(_e.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Fg(n,e,t,s,i,r,o){const a=Rg(n);a.then(u=>{t[u.measurementId]=u.appId,n.options.measurementId&&u.measurementId!==n.options.measurementId&&fe.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${u.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(u=>fe.error(u)),e.push(a);const l=Lg().then(u=>{if(u)return s.getId()}),[c,h]=await Promise.all([a,l]);Tg(r)||vg(r,c.measurementId),i("js",new Date);const d=(o==null?void 0:o.config)??{};return d[fg]="firebase",d.update=!0,h!=null&&(d[ug]=h),i("config",c.measurementId,d),c.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bg{constructor(e){this.app=e}_delete(){return delete In[this.app.options.appId],Promise.resolve()}}let In={},ea=[];const ta={};let wi="dataLayer",Ug="gtag",na,mc,sa=!1;function Wg(){const n=[];if(cr()&&n.push("This is a browser extension environment."),hl()||n.push("Cookies are not available."),n.length>0){const e=n.map((s,i)=>`(${i+1}) ${s}`).join(" "),t=_e.create("invalid-analytics-context",{errorInfo:e});fe.warn(t.message)}}function jg(n,e,t){Wg();const s=n.options.appId;if(!s)throw _e.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)fe.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw _e.create("no-api-key");if(In[s]!=null)throw _e.create("already-exists",{id:s});if(!sa){bg(wi);const{wrappedGtag:r,gtagCore:o}=Sg(In,ea,ta,wi,Ug);mc=r,na=o,sa=!0}return In[s]=Fg(n,ea,ta,e,na,wi,t),new Bg(n)}function Vg(n=pr()){n=oe(n);const e=Ot(n,ws);return e.isInitialized()?e.getImmediate():Hg(n)}function Hg(n,e={}){const t=Ot(n,ws);if(t.isInitialized()){const i=t.getImmediate();if(ct(e,t.getOptions()))return i;throw _e.create("already-initialized")}return t.initialize({options:e})}async function $g(){if(cr()||!hl()||!hr())return!1;try{return await dr()}catch{return!1}}function zg(n,e,t,s){n=oe(n),Dg(mc,In[n.app.options.appId],e,t,s).catch(i=>fe.error(i))}const ia="@firebase/analytics",ra="0.10.18";function qg(){Be(new Ae(ws,(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("installations-internal").getImmediate();return jg(s,i,t)},"PUBLIC")),Be(new Ae("analytics-internal",n,"PRIVATE")),we(ia,ra),we(ia,ra,"esm2020");function n(e){try{const t=e.getProvider(ws).getImmediate();return{logEvent:(s,i,r)=>zg(t,s,i,r)}}catch(t){throw _e.create("interop-component-reg-failed",{reason:t})}}}qg();var oa={};const aa="@firebase/database",la="1.1.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let gc="";function yc(n){gc=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gg{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Z(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Mn(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kg{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return Oe(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _c=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Gg(e)}}catch{}return new Kg},wt=_c("localStorage"),Yg=_c("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zt=new Fs("@firebase/database"),vc=function(){let n=1;return function(){return n++}}(),bc=function(n){const e=uu(n),t=new lu;t.update(e);const s=t.digest();return or.encodeByteArray(s)},$n=function(...n){let e="";for(let t=0;t<n.length;t++){const s=n[t];Array.isArray(s)||s&&typeof s=="object"&&typeof s.length=="number"?e+=$n.apply(null,s):typeof s=="object"?e+=Z(s):e+=s,e+=" "}return e};let En=null,ca=!0;const Xg=function(n,e){S(!0,"Can't turn on custom loggers persistently."),zt.logLevel=H.VERBOSE,En=zt.log.bind(zt)},le=function(...n){if(ca===!0&&(ca=!1,En===null&&Yg.get("logging_enabled")===!0&&Xg()),En){const e=$n.apply(null,n);En(e)}},zn=function(n){return function(...e){le(n,...e)}},Hi=function(...n){const e="FIREBASE INTERNAL ERROR: "+$n(...n);zt.error(e)},Ze=function(...n){const e=`FIREBASE FATAL ERROR: ${$n(...n)}`;throw zt.error(e),new Error(e)},pe=function(...n){const e="FIREBASE WARNING: "+$n(...n);zt.warn(e)},Qg=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&pe("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Rr=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},Jg=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},Kt="[MIN_NAME]",Mt="[MAX_NAME]",nn=function(n,e){if(n===e)return 0;if(n===Kt||e===Mt)return-1;if(e===Kt||n===Mt)return 1;{const t=ha(n),s=ha(e);return t!==null?s!==null?t-s===0?n.length-e.length:t-s:-1:s!==null?1:n<e?-1:1}},Zg=function(n,e){return n===e?0:n<e?-1:1},cn=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+Z(e))},Ar=function(n){if(typeof n!="object"||n===null)return Z(n);const e=[];for(const s in n)e.push(s);e.sort();let t="{";for(let s=0;s<e.length;s++)s!==0&&(t+=","),t+=Z(e[s]),t+=":",t+=Ar(n[e[s]]);return t+="}",t},wc=function(n,e){const t=n.length;if(t<=e)return[n];const s=[];for(let i=0;i<t;i+=e)i+e>t?s.push(n.substring(i,t)):s.push(n.substring(i,i+e));return s};function me(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const Ic=function(n){S(!Rr(n),"Invalid JSON number");const e=11,t=52,s=(1<<e-1)-1;let i,r,o,a,l;n===0?(r=0,o=0,i=1/n===-1/0?1:0):(i=n<0,n=Math.abs(n),n>=Math.pow(2,1-s)?(a=Math.min(Math.floor(Math.log(n)/Math.LN2),s),r=a+s,o=Math.round(n*Math.pow(2,t-a)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-s-t))));const c=[];for(l=t;l;l-=1)c.push(o%2?1:0),o=Math.floor(o/2);for(l=e;l;l-=1)c.push(r%2?1:0),r=Math.floor(r/2);c.push(i?1:0),c.reverse();const h=c.join("");let d="";for(l=0;l<64;l+=8){let u=parseInt(h.substr(l,8),2).toString(16);u.length===1&&(u="0"+u),d=d+u}return d.toLowerCase()},ey=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},ty=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function ny(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const s=new Error(n+" at "+e._path.toString()+": "+t);return s.code=n.toUpperCase(),s}const sy=new RegExp("^-?(0*)\\d{1,10}$"),iy=-2147483648,ry=2147483647,ha=function(n){if(sy.test(n)){const e=Number(n);if(e>=iy&&e<=ry)return e}return null},sn=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw pe("Exception was thrown by user callback.",t),e},Math.floor(0))}},oy=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},Sn=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ay{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,Te(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(s=>this.appCheck=s)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,s)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)==null||t.get().then(s=>s.addTokenListener(e))}notifyForInvalidToken(){pe(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ly{constructor(e,t,s){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=s,this.auth_=null,this.auth_=s.getImmediate({optional:!0}),this.auth_||s.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(le("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,s)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',pe(e)}}class cs{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}cs.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nr="5",Ec="v",Sc="s",Tc="r",Cc="f",xc=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,kc="ls",Mc="p",$i="ac",Pc="websocket",Rc="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ac{constructor(e,t,s,i,r=!1,o="",a=!1,l=!1,c=null){this.secure=t,this.namespace=s,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=l,this.emulatorOptions=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=wt.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&wt.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function cy(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function Nc(n,e,t){S(typeof e=="string","typeof type must == string"),S(typeof t=="object","typeof params must == object");let s;if(e===Pc)s=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===Rc)s=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);cy(n)&&(t.ns=n.namespace);const i=[];return me(t,(r,o)=>{i.push(r+"="+o)}),s+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hy{constructor(){this.counters_={}}incrementCounter(e,t=1){Oe(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return $d(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ii={},Ei={};function Or(n){const e=n.toString();return Ii[e]||(Ii[e]=new hy),Ii[e]}function dy(n,e){const t=n.toString();return Ei[t]||(Ei[t]=e()),Ei[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uy{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const s=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<s.length;++i)s[i]&&sn(()=>{this.onMessage_(s[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const da="start",fy="close",py="pLPCommand",my="pRTLPCB",Oc="id",Dc="pw",Lc="ser",gy="cb",yy="seg",_y="ts",vy="d",by="dframe",Fc=1870,Bc=30,wy=Fc-Bc,Iy=25e3,Ey=3e4;class jt{constructor(e,t,s,i,r,o,a){this.connId=e,this.repoInfo=t,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=zn(e),this.stats_=Or(t),this.urlFn=l=>(this.appCheckToken&&(l[$i]=this.appCheckToken),Nc(t,Rc,l))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new uy(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(Ey)),Jg(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Dr((...r)=>{const[o,a,l,c,h]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===da)this.id=a,this.password=l;else if(o===fy)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,a]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const s={};s[da]="t",s[Lc]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(s[gy]=this.scriptTagHolder.uniqueCallbackIdentifier),s[Ec]=Nr,this.transportSessionId&&(s[Sc]=this.transportSessionId),this.lastSessionId&&(s[kc]=this.lastSessionId),this.applicationId&&(s[Mc]=this.applicationId),this.appCheckToken&&(s[$i]=this.appCheckToken),typeof location<"u"&&location.hostname&&xc.test(location.hostname)&&(s[Tc]=Cc);const i=this.urlFn(s);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){jt.forceAllow_=!0}static forceDisallow(){jt.forceDisallow_=!0}static isAvailable(){return jt.forceAllow_?!0:!jt.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!ey()&&!ty()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=Z(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=nl(t),i=wc(s,wy);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const s={};s[by]="t",s[Oc]=e,s[Dc]=t,this.myDisconnFrame.src=this.urlFn(s),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=Z(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class Dr{constructor(e,t,s,i){this.onDisconnect=s,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=vc(),window[py+this.uniqueCallbackIdentifier]=e,window[my+this.uniqueCallbackIdentifier]=t,this.myIFrame=Dr.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){le("frame writing exception"),a.stack&&le(a.stack),le(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||le("No IE domain setting required")}catch{const s=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+s+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Oc]=this.myID,e[Dc]=this.myPW,e[Lc]=this.currentSerial;let t=this.urlFn(e),s="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+Bc+s.length<=Fc;){const o=this.pendingSegs.shift();s=s+"&"+yy+i+"="+o.seg+"&"+_y+i+"="+o.ts+"&"+vy+i+"="+o.d,i++}return t=t+s,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,s){this.pendingSegs.push({seg:e,ts:t,d:s}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const s=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(s,Math.floor(Iy)),r=()=>{clearTimeout(i),s()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const s=this.myIFrame.doc.createElement("script");s.type="text/javascript",s.async=!0,s.src=e,s.onload=s.onreadystatechange=function(){const i=s.readyState;(!i||i==="loaded"||i==="complete")&&(s.onload=s.onreadystatechange=null,s.parentNode&&s.parentNode.removeChild(s),t())},s.onerror=()=>{le("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(s)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sy=16384,Ty=45e3;let Is=null;typeof MozWebSocket<"u"?Is=MozWebSocket:typeof WebSocket<"u"&&(Is=WebSocket);class Ce{constructor(e,t,s,i,r,o,a){this.connId=e,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=zn(this.connId),this.stats_=Or(t),this.connURL=Ce.connectionURL_(t,o,a,i,s),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,s,i,r){const o={};return o[Ec]=Nr,typeof location<"u"&&location.hostname&&xc.test(location.hostname)&&(o[Tc]=Cc),t&&(o[Sc]=t),s&&(o[kc]=s),i&&(o[$i]=i),r&&(o[Mc]=r),Nc(e,Pc,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,wt.set("previous_websocket_failure",!0);try{let s;nu(),this.mySock=new Is(this.connURL,[],s)}catch(s){this.log_("Error instantiating WebSocket.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=s=>{this.handleIncomingFrame(s)},this.mySock.onerror=s=>{this.log_("WebSocket error.  Closing connection.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){Ce.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,s=navigator.userAgent.match(t);s&&s.length>1&&parseFloat(s[1])<4.4&&(e=!0)}return!e&&Is!==null&&!Ce.forceDisallow_}static previouslyFailed(){return wt.isInMemoryStorage||wt.get("previous_websocket_failure")===!0}markConnectionHealthy(){wt.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const s=Mn(t);this.onMessage(s)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(S(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const s=this.extractFrameCount_(t);s!==null&&this.appendFrame_(s)}}send(e){this.resetKeepAlive();const t=Z(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=wc(t,Sy);s.length>1&&this.sendString_(String(s.length));for(let i=0;i<s.length;i++)this.sendString_(s[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(Ty))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Ce.responsesRequiredToBeHealthy=2;Ce.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{static get ALL_TRANSPORTS(){return[jt,Ce]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=Ce&&Ce.isAvailable();let s=t&&!Ce.previouslyFailed();if(e.webSocketOnly&&(t||pe("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),s=!0),s)this.transports_=[Ce];else{const i=this.transports_=[];for(const r of An.ALL_TRANSPORTS)r&&r.isAvailable()&&i.push(r);An.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}An.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cy=6e4,xy=5e3,ky=10*1024,My=100*1024,Si="t",ua="d",Py="s",fa="r",Ry="e",pa="o",ma="a",ga="n",ya="p",Ay="h";class Ny{constructor(e,t,s,i,r,o,a,l,c,h){this.id=e,this.repoInfo_=t,this.applicationId_=s,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=l,this.onKill_=c,this.lastSessionId=h,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=zn("c:"+this.id+":"),this.transportManager_=new An(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),s=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,s)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=Sn(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>My?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>ky?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Si in e){const t=e[Si];t===ma?this.upgradeIfSecondaryHealthy_():t===fa?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===pa&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=cn("t",e),s=cn("d",e);if(t==="c")this.onSecondaryControl_(s);else if(t==="d")this.pendingDataMessages.push(s);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:ya,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:ma,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:ga,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=cn("t",e),s=cn("d",e);t==="c"?this.onControl_(s):t==="d"&&this.onDataMessage_(s)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=cn(Si,e);if(ua in e){const s=e[ua];if(t===Ay){const i={...s};this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(t===ga){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===Py?this.onConnectionShutdown_(s):t===fa?this.onReset_(s):t===Ry?Hi("Server Error: "+s):t===pa?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Hi("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,s=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Nr!==s&&pe("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),s=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,s),Sn(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Cy))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Sn(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(xy))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:ya,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(wt.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc{put(e,t,s,i){}merge(e,t,s,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,s){}onDisconnectMerge(e,t,s){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wc{constructor(e){this.allowedEvents_=e,this.listeners_={},S(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const s=[...this.listeners_[e]];for(let i=0;i<s.length;i++)s[i].callback.apply(s[i].context,t)}}on(e,t,s){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:s});const i=this.getInitialEvent(e);i&&t.apply(s,i)}off(e,t,s){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===t&&(!s||s===i[r].context)){i.splice(r,1);return}}validateEventType_(e){S(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Es extends Wc{static getInstance(){return new Es}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!lr()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return S(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _a=32,va=768;class z{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let s=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[s]=this.pieces_[i],s++);this.pieces_.length=s,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function j(){return new z("")}function F(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function ht(n){return n.pieces_.length-n.pieceNum_}function G(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new z(n.pieces_,e)}function jc(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function Oy(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function Vc(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function Hc(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new z(e,0)}function ee(n,e){const t=[];for(let s=n.pieceNum_;s<n.pieces_.length;s++)t.push(n.pieces_[s]);if(e instanceof z)for(let s=e.pieceNum_;s<e.pieces_.length;s++)t.push(e.pieces_[s]);else{const s=e.split("/");for(let i=0;i<s.length;i++)s[i].length>0&&t.push(s[i])}return new z(t,0)}function U(n){return n.pieceNum_>=n.pieces_.length}function ce(n,e){const t=F(n),s=F(e);if(t===null)return e;if(t===s)return ce(G(n),G(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function Lr(n,e){if(ht(n)!==ht(e))return!1;for(let t=n.pieceNum_,s=e.pieceNum_;t<=n.pieces_.length;t++,s++)if(n.pieces_[t]!==e.pieces_[s])return!1;return!0}function ke(n,e){let t=n.pieceNum_,s=e.pieceNum_;if(ht(n)>ht(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[s])return!1;++t,++s}return!0}class Dy{constructor(e,t){this.errorPrefix_=t,this.parts_=Vc(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let s=0;s<this.parts_.length;s++)this.byteLength_+=Ls(this.parts_[s]);$c(this)}}function Ly(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=Ls(e),$c(n)}function Fy(n){const e=n.parts_.pop();n.byteLength_-=Ls(e),n.parts_.length>0&&(n.byteLength_-=1)}function $c(n){if(n.byteLength_>va)throw new Error(n.errorPrefix_+"has a key path longer than "+va+" bytes ("+n.byteLength_+").");if(n.parts_.length>_a)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+_a+") or object contains a cycle "+_t(n))}function _t(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr extends Wc{static getInstance(){return new Fr}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const s=!document[e];s!==this.visible_&&(this.visible_=s,this.trigger("visible",s))},!1)}getInitialEvent(e){return S(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hn=1e3,By=60*5*1e3,ba=30*1e3,Uy=1.3,Wy=3e4,jy="server_kill",wa=3;class Xe extends Uc{constructor(e,t,s,i,r,o,a,l){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=s,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=l,this.id=Xe.nextPersistentConnectionId_++,this.log_=zn("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=hn,this.maxReconnectDelay_=By,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,l)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Fr.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Es.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,s){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_(Z(r)),S(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),s&&(this.requestCBHash_[i]=s)}get(e){this.initConnection_();const t=new Wn,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?t.resolve(a):t.reject(a)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,s,i){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),S(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),S(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const a={onComplete:i,hashFn:t,query:e,tag:s};this.listens.get(o).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,s=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(s)})}sendListen_(e){const t=e.query,s=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+s+" for "+i);const r={p:s},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,a=>{const l=a.d,c=a.s;Xe.warnOnListenWarnings_(l,t),(this.listens.get(s)&&this.listens.get(s).get(i))===e&&(this.log_("listen response",a),c!=="ok"&&this.removeListen_(s,i),e.onComplete&&e.onComplete(c,l))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&Oe(e,"w")){const s=Tt(e,"w");if(Array.isArray(s)&&~s.indexOf("no_index")){const i='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();pe(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||au(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=ba)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=ou(e)?"auth":"gauth",s={cred:e};this.authOverride_===null?s.noauth=!0:typeof this.authOverride_=="object"&&(s.authvar=this.authOverride_),this.sendRequest(t,s,i=>{const r=i.s,o=i.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,s=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,s)})}unlisten(e,t){const s=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+s+" "+i),S(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(s,i)&&this.connected_&&this.sendUnlisten_(s,i,e._queryObject,t)}sendUnlisten_(e,t,s,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";i&&(r.q=s,r.t=i),this.sendRequest(o,r)}onDisconnectPut(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:s})}onDisconnectMerge(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:s})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,s,i){const r={p:t,d:s};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,t,s,i){this.putInternal("p",e,t,s,i)}merge(e,t,s,i){this.putInternal("m",e,t,s,i)}putInternal(e,t,s,i,r){this.initConnection_();const o={p:t,d:s};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,s=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,s,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,s=>{if(s.s!=="ok"){const r=s.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Z(e));const t=e.r,s=this.requestCBHash_[t];s&&(delete this.requestCBHash_[t],s(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):Hi("Unrecognized action received from server: "+Z(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){S(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=hn,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=hn,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Wy&&(this.reconnectDelay_=hn),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Uy)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),s=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+Xe.nextConnectionId_++,r=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,s())},c=function(d){S(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(d)};this.realtime_={close:l,sendRequest:c};const h=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[d,u]=await Promise.all([this.authTokenProvider_.getToken(h),this.appCheckTokenProvider_.getToken(h)]);o?le("getToken() completed but was canceled"):(le("getToken() completed. Creating connection."),this.authToken_=d&&d.accessToken,this.appCheckToken_=u&&u.token,a=new Ny(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,s,p=>{pe(p+" ("+this.repoInfo_.toString()+")"),this.interrupt(jy)},r))}catch(d){this.log_("Failed to get token: "+d),o||(this.repoInfo_.nodeAdmin&&pe(d),l())}}}interrupt(e){le("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){le("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Ni(this.interruptReasons_)&&(this.reconnectDelay_=hn,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let s;t?s=t.map(r=>Ar(r)).join("$"):s="default";const i=this.removeListen_(e,s);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const s=new z(e).toString();let i;if(this.listens.has(s)){const r=this.listens.get(s);i=r.get(t),r.delete(t),r.size===0&&this.listens.delete(s)}else i=void 0;return i}onAuthRevoked_(e,t){le("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=wa&&(this.reconnectDelay_=ba,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){le("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=wa&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+gc.replace(/\./g,"-")]=1,lr()?e["framework.cordova"]=1:cl()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Es.getInstance().currentlyOnline();return Ni(this.interruptReasons_)&&e}}Xe.nextPersistentConnectionId_=0;Xe.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new B(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hs{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const s=new B(Kt,e),i=new B(Kt,t);return this.compare(s,i)!==0}minPost(){return B.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ns;class zc extends Hs{static get __EMPTY_NODE(){return ns}static set __EMPTY_NODE(e){ns=e}compare(e,t){return nn(e.name,t.name)}isDefinedOn(e){throw Qt("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return B.MIN}maxPost(){return new B(Mt,ns)}makePost(e,t){return S(typeof e=="string","KeyIndex indexValue must always be a string."),new B(e,ns)}toString(){return".key"}}const qt=new zc;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e,t,s,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?s(e.key,t):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class re{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??re.RED,this.left=i??ue.EMPTY_NODE,this.right=r??ue.EMPTY_NODE}copy(e,t,s,i,r){return new re(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return r<0?i=i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i=i.copy(null,t,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return ue.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let s,i;if(s=this,t(e,s.key)<0)!s.left.isEmpty()&&!s.left.isRed_()&&!s.left.left.isRed_()&&(s=s.moveRedLeft_()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed_()&&(s=s.rotateRight_()),!s.right.isEmpty()&&!s.right.isRed_()&&!s.right.left.isRed_()&&(s=s.moveRedRight_()),t(e,s.key)===0){if(s.right.isEmpty())return ue.EMPTY_NODE;i=s.right.min_(),s=s.copy(i.key,i.value,null,null,s.right.removeMin_())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,re.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,re.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}re.RED=!0;re.BLACK=!1;class Vy{copy(e,t,s,i,r){return this}insert(e,t,s){return new re(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class ue{constructor(e,t=ue.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new ue(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,re.BLACK,null,null))}remove(e){return new ue(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,re.BLACK,null,null))}get(e){let t,s=this.root_;for(;!s.isEmpty();){if(t=this.comparator_(e,s.key),t===0)return s.value;t<0?s=s.left:t>0&&(s=s.right)}return null}getPredecessorKey(e){let t,s=this.root_,i=null;for(;!s.isEmpty();)if(t=this.comparator_(e,s.key),t===0){if(s.left.isEmpty())return i?i.key:null;for(s=s.left;!s.right.isEmpty();)s=s.right;return s.key}else t<0?s=s.left:t>0&&(i=s,s=s.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new ss(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new ss(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new ss(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new ss(this.root_,null,this.comparator_,!0,e)}}ue.EMPTY_NODE=new Vy;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hy(n,e){return nn(n.name,e.name)}function Br(n,e){return nn(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zi;function $y(n){zi=n}const qc=function(n){return typeof n=="number"?"number:"+Ic(n):"string:"+n},Gc=function(n){if(n.isLeafNode()){const e=n.val();S(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Oe(e,".sv"),"Priority must be a string or number.")}else S(n===zi||n.isEmpty(),"priority of unexpected type.");S(n===zi||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ia;class se{static set __childrenNodeConstructor(e){Ia=e}static get __childrenNodeConstructor(){return Ia}constructor(e,t=se.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,S(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),Gc(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new se(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:se.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return U(e)?this:F(e)===".priority"?this.priorityNode_:se.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:se.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const s=F(e);return s===null?t:t.isEmpty()&&s!==".priority"?this:(S(s!==".priority"||ht(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(s,se.__childrenNodeConstructor.EMPTY_NODE.updateChild(G(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+qc(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=Ic(this.value_):e+=this.value_,this.lazyHash_=bc(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===se.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof se.__childrenNodeConstructor?-1:(S(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,s=typeof this.value_,i=se.VALUE_TYPE_ORDER.indexOf(t),r=se.VALUE_TYPE_ORDER.indexOf(s);return S(i>=0,"Unknown leaf type: "+t),S(r>=0,"Unknown leaf type: "+s),i===r?s==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}se.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Kc,Yc;function zy(n){Kc=n}function qy(n){Yc=n}class Gy extends Hs{compare(e,t){const s=e.node.getPriority(),i=t.node.getPriority(),r=s.compareTo(i);return r===0?nn(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return B.MIN}maxPost(){return new B(Mt,new se("[PRIORITY-POST]",Yc))}makePost(e,t){const s=Kc(e);return new B(t,new se("[PRIORITY-POST]",s))}toString(){return".priority"}}const Y=new Gy;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ky=Math.log(2);class Yy{constructor(e){const t=r=>parseInt(Math.log(r)/Ky,10),s=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=s(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Ss=function(n,e,t,s){n.sort(e);const i=function(l,c){const h=c-l;let d,u;if(h===0)return null;if(h===1)return d=n[l],u=t?t(d):d,new re(u,d.node,re.BLACK,null,null);{const p=parseInt(h/2,10)+l,y=i(l,p),w=i(p+1,c);return d=n[p],u=t?t(d):d,new re(u,d.node,re.BLACK,y,w)}},r=function(l){let c=null,h=null,d=n.length;const u=function(y,w){const I=d-y,m=d;d-=y;const f=i(I+1,m),v=n[I],g=t?t(v):v;p(new re(g,v.node,w,null,f))},p=function(y){c?(c.left=y,c=y):(h=y,c=y)};for(let y=0;y<l.count;++y){const w=l.nextBitIsOne(),I=Math.pow(2,l.count-(y+1));w?u(I,re.BLACK):(u(I,re.BLACK),u(I,re.RED))}return h},o=new Yy(n.length),a=r(o);return new ue(s||e,a)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ti;const Ut={};class Ke{static get Default(){return S(Ut&&Y,"ChildrenNode.ts has not been loaded"),Ti=Ti||new Ke({".priority":Ut},{".priority":Y}),Ti}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=Tt(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof ue?t:null}hasIndex(e){return Oe(this.indexSet_,e.toString())}addIndex(e,t){S(e!==qt,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const s=[];let i=!1;const r=t.getIterator(B.Wrap);let o=r.getNext();for(;o;)i=i||e.isDefinedOn(o.node),s.push(o),o=r.getNext();let a;i?a=Ss(s,e.getCompare()):a=Ut;const l=e.toString(),c={...this.indexSet_};c[l]=e;const h={...this.indexes_};return h[l]=a,new Ke(h,c)}addToIndexes(e,t){const s=us(this.indexes_,(i,r)=>{const o=Tt(this.indexSet_,r);if(S(o,"Missing index implementation for "+r),i===Ut)if(o.isDefinedOn(e.node)){const a=[],l=t.getIterator(B.Wrap);let c=l.getNext();for(;c;)c.name!==e.name&&a.push(c),c=l.getNext();return a.push(e),Ss(a,o.getCompare())}else return Ut;else{const a=t.get(e.name);let l=i;return a&&(l=l.remove(new B(e.name,a))),l.insert(e,e.node)}});return new Ke(s,this.indexSet_)}removeFromIndexes(e,t){const s=us(this.indexes_,i=>{if(i===Ut)return i;{const r=t.get(e.name);return r?i.remove(new B(e.name,r)):i}});return new Ke(s,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let dn;class R{static get EMPTY_NODE(){return dn||(dn=new R(new ue(Br),null,Ke.Default))}constructor(e,t,s){this.children_=e,this.priorityNode_=t,this.indexMap_=s,this.lazyHash_=null,this.priorityNode_&&Gc(this.priorityNode_),this.children_.isEmpty()&&S(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||dn}updatePriority(e){return this.children_.isEmpty()?this:new R(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?dn:t}}getChild(e){const t=F(e);return t===null?this:this.getImmediateChild(t).getChild(G(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(S(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const s=new B(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(s,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(s,this.children_));const o=i.isEmpty()?dn:this.priorityNode_;return new R(i,o,r)}}updateChild(e,t){const s=F(e);if(s===null)return t;{S(F(e)!==".priority"||ht(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(s).updateChild(G(e),t);return this.updateImmediateChild(s,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let s=0,i=0,r=!0;if(this.forEachChild(Y,(o,a)=>{t[o]=a.val(e),s++,r&&R.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):r=!1}),!e&&r&&i<2*s){const o=[];for(const a in t)o[a]=t[a];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+qc(this.getPriority().val())+":"),this.forEachChild(Y,(t,s)=>{const i=s.hash();i!==""&&(e+=":"+t+":"+i)}),this.lazyHash_=e===""?"":bc(e)}return this.lazyHash_}getPredecessorChildName(e,t,s){const i=this.resolveIndex_(s);if(i){const r=i.getPredecessorKey(new B(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.minKey();return s&&s.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new B(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.maxKey();return s&&s.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new B(t,this.children_.get(t)):null}forEachChild(e,t){const s=this.resolveIndex_(e);return s?s.inorderTraversal(i=>t(i.name,i.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,B.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)<0;)i.getNext(),r=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,B.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)>0;)i.getNext(),r=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===qn?-1:0}withIndex(e){if(e===qt||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new R(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===qt||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const s=this.getIterator(Y),i=t.getIterator(Y);let r=s.getNext(),o=i.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=s.getNext(),o=i.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===qt?null:this.indexMap_.get(e.toString())}}R.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class Xy extends R{constructor(){super(new ue(Br),R.EMPTY_NODE,Ke.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return R.EMPTY_NODE}isEmpty(){return!1}}const qn=new Xy;Object.defineProperties(B,{MIN:{value:new B(Kt,R.EMPTY_NODE)},MAX:{value:new B(Mt,qn)}});zc.__EMPTY_NODE=R.EMPTY_NODE;se.__childrenNodeConstructor=R;$y(qn);qy(qn);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qy=!0;function J(n,e=null){if(n===null)return R.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),S(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new se(t,J(e))}if(!(n instanceof Array)&&Qy){const t=[];let s=!1;if(me(n,(o,a)=>{if(o.substring(0,1)!=="."){const l=J(a);l.isEmpty()||(s=s||!l.getPriority().isEmpty(),t.push(new B(o,l)))}}),t.length===0)return R.EMPTY_NODE;const r=Ss(t,Hy,o=>o.name,Br);if(s){const o=Ss(t,Y.getCompare());return new R(r,J(e),new Ke({".priority":o},{".priority":Y}))}else return new R(r,J(e),Ke.Default)}else{let t=R.EMPTY_NODE;return me(n,(s,i)=>{if(Oe(n,s)&&s.substring(0,1)!=="."){const r=J(i);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(s,r))}}),t.updatePriority(J(e))}}zy(J);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jy extends Hs{constructor(e){super(),this.indexPath_=e,S(!U(e)&&F(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const s=this.extractChild(e.node),i=this.extractChild(t.node),r=s.compareTo(i);return r===0?nn(e.name,t.name):r}makePost(e,t){const s=J(e),i=R.EMPTY_NODE.updateChild(this.indexPath_,s);return new B(t,i)}maxPost(){const e=R.EMPTY_NODE.updateChild(this.indexPath_,qn);return new B(Mt,e)}toString(){return Vc(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zy extends Hs{compare(e,t){const s=e.node.compareTo(t.node);return s===0?nn(e.name,t.name):s}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return B.MIN}maxPost(){return B.MAX}makePost(e,t){const s=J(e);return new B(t,s)}toString(){return".value"}}const e_=new Zy;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xc(n){return{type:"value",snapshotNode:n}}function Yt(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function Nn(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function On(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function t_(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur{constructor(e){this.index_=e}updateChild(e,t,s,i,r,o){S(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(t);return a.getChild(i).equals(s.getChild(i))&&a.isEmpty()===s.isEmpty()||(o!=null&&(s.isEmpty()?e.hasChild(t)?o.trackChildChange(Nn(t,a)):S(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(Yt(t,s)):o.trackChildChange(On(t,s,a))),e.isLeafNode()&&s.isEmpty())?e:e.updateImmediateChild(t,s).withIndex(this.index_)}updateFullNode(e,t,s){return s!=null&&(e.isLeafNode()||e.forEachChild(Y,(i,r)=>{t.hasChild(i)||s.trackChildChange(Nn(i,r))}),t.isLeafNode()||t.forEachChild(Y,(i,r)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(r)||s.trackChildChange(On(i,r,o))}else s.trackChildChange(Yt(i,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?R.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e){this.indexedFilter_=new Ur(e.getIndex()),this.index_=e.getIndex(),this.startPost_=Dn.getStartPost_(e),this.endPost_=Dn.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,s=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&s}updateChild(e,t,s,i,r,o){return this.matches(new B(t,s))||(s=R.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,s,i,r,o)}updateFullNode(e,t,s){t.isLeafNode()&&(t=R.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(R.EMPTY_NODE);const r=this;return t.forEachChild(Y,(o,a)=>{r.matches(new B(o,a))||(i=i.updateImmediateChild(o,R.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n_{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const s=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?s<=0:s<0},this.withinEndPost=t=>{const s=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?s<=0:s<0},this.rangedFilter_=new Dn(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,s,i,r,o){return this.rangedFilter_.matches(new B(t,s))||(s=R.EMPTY_NODE),e.getImmediateChild(t).equals(s)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,s,i,r,o):this.fullLimitUpdateChild_(e,t,s,r,o)}updateFullNode(e,t,s){let i;if(t.isLeafNode()||t.isEmpty())i=R.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){i=R.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const a=r.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))i=i.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{i=t.withIndex(this.index_),i=i.updatePriority(R.EMPTY_NODE);let r;this.reverse_?r=i.getReverseIterator(this.index_):r=i.getIterator(this.index_);let o=0;for(;r.hasNext();){const a=r.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:i=i.updateImmediateChild(a.name,R.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,s,i,r){let o;if(this.reverse_){const d=this.index_.getCompare();o=(u,p)=>d(p,u)}else o=this.index_.getCompare();const a=e;S(a.numChildren()===this.limit_,"");const l=new B(t,s),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),h=this.rangedFilter_.matches(l);if(a.hasChild(t)){const d=a.getImmediateChild(t);let u=i.getChildAfterChild(this.index_,c,this.reverse_);for(;u!=null&&(u.name===t||a.hasChild(u.name));)u=i.getChildAfterChild(this.index_,u,this.reverse_);const p=u==null?1:o(u,l);if(h&&!s.isEmpty()&&p>=0)return r!=null&&r.trackChildChange(On(t,s,d)),a.updateImmediateChild(t,s);{r!=null&&r.trackChildChange(Nn(t,d));const w=a.updateImmediateChild(t,R.EMPTY_NODE);return u!=null&&this.rangedFilter_.matches(u)?(r!=null&&r.trackChildChange(Yt(u.name,u.node)),w.updateImmediateChild(u.name,u.node)):w}}else return s.isEmpty()?e:h&&o(c,l)>=0?(r!=null&&(r.trackChildChange(Nn(c.name,c.node)),r.trackChildChange(Yt(t,s))),a.updateImmediateChild(t,s).updateImmediateChild(c.name,R.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=Y}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return S(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return S(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Kt}hasEnd(){return this.endSet_}getIndexEndValue(){return S(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return S(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Mt}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return S(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===Y}copy(){const e=new $s;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function s_(n){return n.loadsAllData()?new Ur(n.getIndex()):n.hasLimit()?new n_(n):new Dn(n)}function Ea(n){const e={};if(n.isDefault())return e;let t;if(n.index_===Y?t="$priority":n.index_===e_?t="$value":n.index_===qt?t="$key":(S(n.index_ instanceof Jy,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=Z(t),n.startSet_){const s=n.startAfterSet_?"startAfter":"startAt";e[s]=Z(n.indexStartValue_),n.startNameSet_&&(e[s]+=","+Z(n.indexStartName_))}if(n.endSet_){const s=n.endBeforeSet_?"endBefore":"endAt";e[s]=Z(n.indexEndValue_),n.endNameSet_&&(e[s]+=","+Z(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function Sa(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==Y&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts extends Uc{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(S(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,s,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=s,this.appCheckTokenProvider_=i,this.log_=zn("p:rest:"),this.listens_={}}listen(e,t,s,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Ts.getListenId_(e,s),a={};this.listens_[o]=a;const l=Ea(e._queryParams);this.restRequest_(r+".json",l,(c,h)=>{let d=h;if(c===404&&(d=null,c=null),c===null&&this.onDataUpdate_(r,d,!1,s),Tt(this.listens_,o)===a){let u;c?c===401?u="permission_denied":u="rest_error:"+c:u="ok",i(u,null)}})}unlisten(e,t){const s=Ts.getListenId_(e,t);delete this.listens_[s]}get(e){const t=Ea(e._queryParams),s=e._path.toString(),i=new Wn;return this.restRequest_(s+".json",t,(r,o)=>{let a=o;r===404&&(a=null,r=null),r===null?(this.onDataUpdate_(s,a,!1,null),i.resolve(a)):i.reject(new Error(a))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},s){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,r])=>{i&&i.accessToken&&(t.auth=i.accessToken),r&&r.token&&(t.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Zt(t);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(s&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let l=null;if(a.status>=200&&a.status<300){try{l=Mn(a.responseText)}catch{pe("Failed to parse JSON response for "+o+": "+a.responseText)}s(null,l)}else a.status!==401&&a.status!==404&&pe("Got unsuccessful REST response for "+o+" Status: "+a.status),s(a.status);s=null}},a.open("GET",o,!0),a.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i_{constructor(){this.rootNode_=R.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cs(){return{value:null,children:new Map}}function Qc(n,e,t){if(U(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const s=F(e);n.children.has(s)||n.children.set(s,Cs());const i=n.children.get(s);e=G(e),Qc(i,e,t)}}function qi(n,e,t){n.value!==null?t(e,n.value):r_(n,(s,i)=>{const r=new z(e.toString()+"/"+s);qi(i,r,t)})}function r_(n,e){n.children.forEach((t,s)=>{e(s,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o_{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t={...e};return this.last_&&me(this.last_,(s,i)=>{t[s]=t[s]-i}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta=10*1e3,a_=30*1e3,l_=5*60*1e3;class c_{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new o_(e);const s=Ta+(a_-Ta)*Math.random();Sn(this.reportStats_.bind(this),Math.floor(s))}reportStats_(){const e=this.statsListener_.get(),t={};let s=!1;me(e,(i,r)=>{r>0&&Oe(this.statsToReport_,i)&&(t[i]=r,s=!0)}),s&&this.server_.reportStats(t),Sn(this.reportStats_.bind(this),Math.floor(Math.random()*2*l_))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Me;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Me||(Me={}));function Jc(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Wr(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function jr(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xs{constructor(e,t,s){this.path=e,this.affectedTree=t,this.revert=s,this.type=Me.ACK_USER_WRITE,this.source=Jc()}operationForChild(e){if(U(this.path)){if(this.affectedTree.value!=null)return S(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new z(e));return new xs(j(),t,this.revert)}}else return S(F(this.path)===e,"operationForChild called for unrelated child."),new xs(G(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(e,t){this.source=e,this.path=t,this.type=Me.LISTEN_COMPLETE}operationForChild(e){return U(this.path)?new Ln(this.source,j()):new Ln(this.source,G(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e,t,s){this.source=e,this.path=t,this.snap=s,this.type=Me.OVERWRITE}operationForChild(e){return U(this.path)?new Pt(this.source,j(),this.snap.getImmediateChild(e)):new Pt(this.source,G(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e,t,s){this.source=e,this.path=t,this.children=s,this.type=Me.MERGE}operationForChild(e){if(U(this.path)){const t=this.children.subtree(new z(e));return t.isEmpty()?null:t.value?new Pt(this.source,j(),t.value):new Fn(this.source,j(),t)}else return S(F(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Fn(this.source,G(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(e,t,s){this.node_=e,this.fullyInitialized_=t,this.filtered_=s}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(U(e))return this.isFullyInitialized()&&!this.filtered_;const t=F(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h_{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function d_(n,e,t,s){const i=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(t_(o.childName,o.snapshotNode))}),un(n,i,"child_removed",e,s,t),un(n,i,"child_added",e,s,t),un(n,i,"child_moved",r,s,t),un(n,i,"child_changed",e,s,t),un(n,i,"value",e,s,t),i}function un(n,e,t,s,i,r){const o=s.filter(a=>a.type===t);o.sort((a,l)=>f_(n,a,l)),o.forEach(a=>{const l=u_(n,a,r);i.forEach(c=>{c.respondsTo(a.type)&&e.push(c.createEvent(l,n.query_))})})}function u_(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function f_(n,e,t){if(e.childName==null||t.childName==null)throw Qt("Should only compare child_ events.");const s=new B(e.childName,e.snapshotNode),i=new B(t.childName,t.snapshotNode);return n.index_.compare(s,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zs(n,e){return{eventCache:n,serverCache:e}}function Tn(n,e,t,s){return zs(new dt(e,t,s),n.serverCache)}function Zc(n,e,t,s){return zs(n.eventCache,new dt(e,t,s))}function ks(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function Rt(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ci;const p_=()=>(Ci||(Ci=new ue(Zg)),Ci);class K{static fromObject(e){let t=new K(null);return me(e,(s,i)=>{t=t.set(new z(s),i)}),t}constructor(e,t=p_()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:j(),value:this.value};if(U(e))return null;{const s=F(e),i=this.children.get(s);if(i!==null){const r=i.findRootMostMatchingPathAndValue(G(e),t);return r!=null?{path:ee(new z(s),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(U(e))return this;{const t=F(e),s=this.children.get(t);return s!==null?s.subtree(G(e)):new K(null)}}set(e,t){if(U(e))return new K(t,this.children);{const s=F(e),r=(this.children.get(s)||new K(null)).set(G(e),t),o=this.children.insert(s,r);return new K(this.value,o)}}remove(e){if(U(e))return this.children.isEmpty()?new K(null):new K(null,this.children);{const t=F(e),s=this.children.get(t);if(s){const i=s.remove(G(e));let r;return i.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,i),this.value===null&&r.isEmpty()?new K(null):new K(this.value,r)}else return this}}get(e){if(U(e))return this.value;{const t=F(e),s=this.children.get(t);return s?s.get(G(e)):null}}setTree(e,t){if(U(e))return t;{const s=F(e),r=(this.children.get(s)||new K(null)).setTree(G(e),t);let o;return r.isEmpty()?o=this.children.remove(s):o=this.children.insert(s,r),new K(this.value,o)}}fold(e){return this.fold_(j(),e)}fold_(e,t){const s={};return this.children.inorderTraversal((i,r)=>{s[i]=r.fold_(ee(e,i),t)}),t(e,this.value,s)}findOnPath(e,t){return this.findOnPath_(e,j(),t)}findOnPath_(e,t,s){const i=this.value?s(t,this.value):!1;if(i)return i;if(U(e))return null;{const r=F(e),o=this.children.get(r);return o?o.findOnPath_(G(e),ee(t,r),s):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,j(),t)}foreachOnPath_(e,t,s){if(U(e))return this;{this.value&&s(t,this.value);const i=F(e),r=this.children.get(i);return r?r.foreachOnPath_(G(e),ee(t,i),s):new K(null)}}foreach(e){this.foreach_(j(),e)}foreach_(e,t){this.children.inorderTraversal((s,i)=>{i.foreach_(ee(e,s),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,s)=>{s.value&&e(t,s.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(e){this.writeTree_=e}static empty(){return new Re(new K(null))}}function Cn(n,e,t){if(U(e))return new Re(new K(t));{const s=n.writeTree_.findRootMostValueAndPath(e);if(s!=null){const i=s.path;let r=s.value;const o=ce(i,e);return r=r.updateChild(o,t),new Re(n.writeTree_.set(i,r))}else{const i=new K(t),r=n.writeTree_.setTree(e,i);return new Re(r)}}}function Ca(n,e,t){let s=n;return me(t,(i,r)=>{s=Cn(s,ee(e,i),r)}),s}function xa(n,e){if(U(e))return Re.empty();{const t=n.writeTree_.setTree(e,new K(null));return new Re(t)}}function Gi(n,e){return Dt(n,e)!=null}function Dt(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(ce(t.path,e)):null}function ka(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(Y,(s,i)=>{e.push(new B(s,i))}):n.writeTree_.children.inorderTraversal((s,i)=>{i.value!=null&&e.push(new B(s,i.value))}),e}function at(n,e){if(U(e))return n;{const t=Dt(n,e);return t!=null?new Re(new K(t)):new Re(n.writeTree_.subtree(e))}}function Ki(n){return n.writeTree_.isEmpty()}function Xt(n,e){return eh(j(),n.writeTree_,e)}function eh(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let s=null;return e.children.inorderTraversal((i,r)=>{i===".priority"?(S(r.value!==null,"Priority writes must always be leaf nodes"),s=r.value):t=eh(ee(n,i),r,t)}),!t.getChild(n).isEmpty()&&s!==null&&(t=t.updateChild(ee(n,".priority"),s)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qs(n,e){return ih(e,n)}function m_(n,e,t,s,i){S(s>n.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),n.allWrites.push({path:e,snap:t,writeId:s,visible:i}),i&&(n.visibleWrites=Cn(n.visibleWrites,e,t)),n.lastWriteId=s}function g_(n,e){for(let t=0;t<n.allWrites.length;t++){const s=n.allWrites[t];if(s.writeId===e)return s}return null}function y_(n,e){const t=n.allWrites.findIndex(a=>a.writeId===e);S(t>=0,"removeWrite called with nonexistent writeId.");const s=n.allWrites[t];n.allWrites.splice(t,1);let i=s.visible,r=!1,o=n.allWrites.length-1;for(;i&&o>=0;){const a=n.allWrites[o];a.visible&&(o>=t&&__(a,s.path)?i=!1:ke(s.path,a.path)&&(r=!0)),o--}if(i){if(r)return v_(n),!0;if(s.snap)n.visibleWrites=xa(n.visibleWrites,s.path);else{const a=s.children;me(a,l=>{n.visibleWrites=xa(n.visibleWrites,ee(s.path,l))})}return!0}else return!1}function __(n,e){if(n.snap)return ke(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&ke(ee(n.path,t),e))return!0;return!1}function v_(n){n.visibleWrites=th(n.allWrites,b_,j()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function b_(n){return n.visible}function th(n,e,t){let s=Re.empty();for(let i=0;i<n.length;++i){const r=n[i];if(e(r)){const o=r.path;let a;if(r.snap)ke(t,o)?(a=ce(t,o),s=Cn(s,a,r.snap)):ke(o,t)&&(a=ce(o,t),s=Cn(s,j(),r.snap.getChild(a)));else if(r.children){if(ke(t,o))a=ce(t,o),s=Ca(s,a,r.children);else if(ke(o,t))if(a=ce(o,t),U(a))s=Ca(s,j(),r.children);else{const l=Tt(r.children,F(a));if(l){const c=l.getChild(G(a));s=Cn(s,j(),c)}}}else throw Qt("WriteRecord should have .snap or .children")}}return s}function nh(n,e,t,s,i){if(!s&&!i){const r=Dt(n.visibleWrites,e);if(r!=null)return r;{const o=at(n.visibleWrites,e);if(Ki(o))return t;if(t==null&&!Gi(o,j()))return null;{const a=t||R.EMPTY_NODE;return Xt(o,a)}}}else{const r=at(n.visibleWrites,e);if(!i&&Ki(r))return t;if(!i&&t==null&&!Gi(r,j()))return null;{const o=function(c){return(c.visible||i)&&(!s||!~s.indexOf(c.writeId))&&(ke(c.path,e)||ke(e,c.path))},a=th(n.allWrites,o,e),l=t||R.EMPTY_NODE;return Xt(a,l)}}}function w_(n,e,t){let s=R.EMPTY_NODE;const i=Dt(n.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(Y,(r,o)=>{s=s.updateImmediateChild(r,o)}),s;if(t){const r=at(n.visibleWrites,e);return t.forEachChild(Y,(o,a)=>{const l=Xt(at(r,new z(o)),a);s=s.updateImmediateChild(o,l)}),ka(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}else{const r=at(n.visibleWrites,e);return ka(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}}function I_(n,e,t,s,i){S(s||i,"Either existingEventSnap or existingServerSnap must exist");const r=ee(e,t);if(Gi(n.visibleWrites,r))return null;{const o=at(n.visibleWrites,r);return Ki(o)?i.getChild(t):Xt(o,i.getChild(t))}}function E_(n,e,t,s){const i=ee(e,t),r=Dt(n.visibleWrites,i);if(r!=null)return r;if(s.isCompleteForChild(t)){const o=at(n.visibleWrites,i);return Xt(o,s.getNode().getImmediateChild(t))}else return null}function S_(n,e){return Dt(n.visibleWrites,e)}function T_(n,e,t,s,i,r,o){let a;const l=at(n.visibleWrites,e),c=Dt(l,j());if(c!=null)a=c;else if(t!=null)a=Xt(l,t);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const h=[],d=o.getCompare(),u=r?a.getReverseIteratorFrom(s,o):a.getIteratorFrom(s,o);let p=u.getNext();for(;p&&h.length<i;)d(p,s)!==0&&h.push(p),p=u.getNext();return h}else return[]}function C_(){return{visibleWrites:Re.empty(),allWrites:[],lastWriteId:-1}}function Ms(n,e,t,s){return nh(n.writeTree,n.treePath,e,t,s)}function Vr(n,e){return w_(n.writeTree,n.treePath,e)}function Ma(n,e,t,s){return I_(n.writeTree,n.treePath,e,t,s)}function Ps(n,e){return S_(n.writeTree,ee(n.treePath,e))}function x_(n,e,t,s,i,r){return T_(n.writeTree,n.treePath,e,t,s,i,r)}function Hr(n,e,t){return E_(n.writeTree,n.treePath,e,t)}function sh(n,e){return ih(ee(n.treePath,e),n.writeTree)}function ih(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k_{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,s=e.childName;S(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),S(s!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(s);if(i){const r=i.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(s,On(s,e.snapshotNode,i.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(s);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(s,Nn(s,i.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(s,Yt(s,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(s,On(s,e.snapshotNode,i.oldSnap));else throw Qt("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(s,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M_{getCompleteChild(e){return null}getChildAfterChild(e,t,s){return null}}const rh=new M_;class $r{constructor(e,t,s=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=s}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const s=this.optCompleteServerCache_!=null?new dt(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Hr(this.writes_,e,s)}}getChildAfterChild(e,t,s){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:Rt(this.viewCache_),r=x_(this.writes_,i,t,1,s,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P_(n){return{filter:n}}function R_(n,e){S(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),S(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function A_(n,e,t,s,i){const r=new k_;let o,a;if(t.type===Me.OVERWRITE){const c=t;c.source.fromUser?o=Yi(n,e,c.path,c.snap,s,i,r):(S(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered()&&!U(c.path),o=Rs(n,e,c.path,c.snap,s,i,a,r))}else if(t.type===Me.MERGE){const c=t;c.source.fromUser?o=O_(n,e,c.path,c.children,s,i,r):(S(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered(),o=Xi(n,e,c.path,c.children,s,i,a,r))}else if(t.type===Me.ACK_USER_WRITE){const c=t;c.revert?o=F_(n,e,c.path,s,i,r):o=D_(n,e,c.path,c.affectedTree,s,i,r)}else if(t.type===Me.LISTEN_COMPLETE)o=L_(n,e,t.path,s,r);else throw Qt("Unknown operation type: "+t.type);const l=r.getChanges();return N_(e,o,l),{viewCache:o,changes:l}}function N_(n,e,t){const s=e.eventCache;if(s.isFullyInitialized()){const i=s.getNode().isLeafNode()||s.getNode().isEmpty(),r=ks(n);(t.length>0||!n.eventCache.isFullyInitialized()||i&&!s.getNode().equals(r)||!s.getNode().getPriority().equals(r.getPriority()))&&t.push(Xc(ks(e)))}}function oh(n,e,t,s,i,r){const o=e.eventCache;if(Ps(s,t)!=null)return e;{let a,l;if(U(t))if(S(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const c=Rt(e),h=c instanceof R?c:R.EMPTY_NODE,d=Vr(s,h);a=n.filter.updateFullNode(e.eventCache.getNode(),d,r)}else{const c=Ms(s,Rt(e));a=n.filter.updateFullNode(e.eventCache.getNode(),c,r)}else{const c=F(t);if(c===".priority"){S(ht(t)===1,"Can't have a priority with additional path components");const h=o.getNode();l=e.serverCache.getNode();const d=Ma(s,t,h,l);d!=null?a=n.filter.updatePriority(h,d):a=o.getNode()}else{const h=G(t);let d;if(o.isCompleteForChild(c)){l=e.serverCache.getNode();const u=Ma(s,t,o.getNode(),l);u!=null?d=o.getNode().getImmediateChild(c).updateChild(h,u):d=o.getNode().getImmediateChild(c)}else d=Hr(s,c,e.serverCache);d!=null?a=n.filter.updateChild(o.getNode(),c,d,h,i,r):a=o.getNode()}}return Tn(e,a,o.isFullyInitialized()||U(t),n.filter.filtersNodes())}}function Rs(n,e,t,s,i,r,o,a){const l=e.serverCache;let c;const h=o?n.filter:n.filter.getIndexedFilter();if(U(t))c=h.updateFullNode(l.getNode(),s,null);else if(h.filtersNodes()&&!l.isFiltered()){const p=l.getNode().updateChild(t,s);c=h.updateFullNode(l.getNode(),p,null)}else{const p=F(t);if(!l.isCompleteForPath(t)&&ht(t)>1)return e;const y=G(t),I=l.getNode().getImmediateChild(p).updateChild(y,s);p===".priority"?c=h.updatePriority(l.getNode(),I):c=h.updateChild(l.getNode(),p,I,y,rh,null)}const d=Zc(e,c,l.isFullyInitialized()||U(t),h.filtersNodes()),u=new $r(i,d,r);return oh(n,d,t,i,u,a)}function Yi(n,e,t,s,i,r,o){const a=e.eventCache;let l,c;const h=new $r(i,e,r);if(U(t))c=n.filter.updateFullNode(e.eventCache.getNode(),s,o),l=Tn(e,c,!0,n.filter.filtersNodes());else{const d=F(t);if(d===".priority")c=n.filter.updatePriority(e.eventCache.getNode(),s),l=Tn(e,c,a.isFullyInitialized(),a.isFiltered());else{const u=G(t),p=a.getNode().getImmediateChild(d);let y;if(U(u))y=s;else{const w=h.getCompleteChild(d);w!=null?jc(u)===".priority"&&w.getChild(Hc(u)).isEmpty()?y=w:y=w.updateChild(u,s):y=R.EMPTY_NODE}if(p.equals(y))l=e;else{const w=n.filter.updateChild(a.getNode(),d,y,u,h,o);l=Tn(e,w,a.isFullyInitialized(),n.filter.filtersNodes())}}}return l}function Pa(n,e){return n.eventCache.isCompleteForChild(e)}function O_(n,e,t,s,i,r,o){let a=e;return s.foreach((l,c)=>{const h=ee(t,l);Pa(e,F(h))&&(a=Yi(n,a,h,c,i,r,o))}),s.foreach((l,c)=>{const h=ee(t,l);Pa(e,F(h))||(a=Yi(n,a,h,c,i,r,o))}),a}function Ra(n,e,t){return t.foreach((s,i)=>{e=e.updateChild(s,i)}),e}function Xi(n,e,t,s,i,r,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let l=e,c;U(t)?c=s:c=new K(null).setTree(t,s);const h=e.serverCache.getNode();return c.children.inorderTraversal((d,u)=>{if(h.hasChild(d)){const p=e.serverCache.getNode().getImmediateChild(d),y=Ra(n,p,u);l=Rs(n,l,new z(d),y,i,r,o,a)}}),c.children.inorderTraversal((d,u)=>{const p=!e.serverCache.isCompleteForChild(d)&&u.value===null;if(!h.hasChild(d)&&!p){const y=e.serverCache.getNode().getImmediateChild(d),w=Ra(n,y,u);l=Rs(n,l,new z(d),w,i,r,o,a)}}),l}function D_(n,e,t,s,i,r,o){if(Ps(i,t)!=null)return e;const a=e.serverCache.isFiltered(),l=e.serverCache;if(s.value!=null){if(U(t)&&l.isFullyInitialized()||l.isCompleteForPath(t))return Rs(n,e,t,l.getNode().getChild(t),i,r,a,o);if(U(t)){let c=new K(null);return l.getNode().forEachChild(qt,(h,d)=>{c=c.set(new z(h),d)}),Xi(n,e,t,c,i,r,a,o)}else return e}else{let c=new K(null);return s.foreach((h,d)=>{const u=ee(t,h);l.isCompleteForPath(u)&&(c=c.set(h,l.getNode().getChild(u)))}),Xi(n,e,t,c,i,r,a,o)}}function L_(n,e,t,s,i){const r=e.serverCache,o=Zc(e,r.getNode(),r.isFullyInitialized()||U(t),r.isFiltered());return oh(n,o,t,s,rh,i)}function F_(n,e,t,s,i,r){let o;if(Ps(s,t)!=null)return e;{const a=new $r(s,e,i),l=e.eventCache.getNode();let c;if(U(t)||F(t)===".priority"){let h;if(e.serverCache.isFullyInitialized())h=Ms(s,Rt(e));else{const d=e.serverCache.getNode();S(d instanceof R,"serverChildren would be complete if leaf node"),h=Vr(s,d)}h=h,c=n.filter.updateFullNode(l,h,r)}else{const h=F(t);let d=Hr(s,h,e.serverCache);d==null&&e.serverCache.isCompleteForChild(h)&&(d=l.getImmediateChild(h)),d!=null?c=n.filter.updateChild(l,h,d,G(t),a,r):e.eventCache.getNode().hasChild(h)?c=n.filter.updateChild(l,h,R.EMPTY_NODE,G(t),a,r):c=l,c.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Ms(s,Rt(e)),o.isLeafNode()&&(c=n.filter.updateFullNode(c,o,r)))}return o=e.serverCache.isFullyInitialized()||Ps(s,j())!=null,Tn(e,c,o,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const s=this.query_._queryParams,i=new Ur(s.getIndex()),r=s_(s);this.processor_=P_(r);const o=t.serverCache,a=t.eventCache,l=i.updateFullNode(R.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode(R.EMPTY_NODE,a.getNode(),null),h=new dt(l,o.isFullyInitialized(),i.filtersNodes()),d=new dt(c,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=zs(d,h),this.eventGenerator_=new h_(this.query_)}get query(){return this.query_}}function U_(n){return n.viewCache_.serverCache.getNode()}function W_(n){return ks(n.viewCache_)}function j_(n,e){const t=Rt(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!U(e)&&!t.getImmediateChild(F(e)).isEmpty())?t.getChild(e):null}function Aa(n){return n.eventRegistrations_.length===0}function V_(n,e){n.eventRegistrations_.push(e)}function Na(n,e,t){const s=[];if(t){S(e==null,"A cancel should cancel all event registrations.");const i=n.query._path;n.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(t,i);o&&s.push(o)})}if(e){let i=[];for(let r=0;r<n.eventRegistrations_.length;++r){const o=n.eventRegistrations_[r];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=i}else n.eventRegistrations_=[];return s}function Oa(n,e,t,s){e.type===Me.MERGE&&e.source.queryId!==null&&(S(Rt(n.viewCache_),"We should always have a full cache before handling merges"),S(ks(n.viewCache_),"Missing event cache, even though we have a server cache"));const i=n.viewCache_,r=A_(n.processor_,i,e,t,s);return R_(n.processor_,r.viewCache),S(r.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,ah(n,r.changes,r.viewCache.eventCache.getNode(),null)}function H_(n,e){const t=n.viewCache_.eventCache,s=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(Y,(r,o)=>{s.push(Yt(r,o))}),t.isFullyInitialized()&&s.push(Xc(t.getNode())),ah(n,s,t.getNode(),e)}function ah(n,e,t,s){const i=s?[s]:n.eventRegistrations_;return d_(n.eventGenerator_,e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let As;class lh{constructor(){this.views=new Map}}function $_(n){S(!As,"__referenceConstructor has already been defined"),As=n}function z_(){return S(As,"Reference.ts has not been loaded"),As}function q_(n){return n.views.size===0}function zr(n,e,t,s){const i=e.source.queryId;if(i!==null){const r=n.views.get(i);return S(r!=null,"SyncTree gave us an op for an invalid query."),Oa(r,e,t,s)}else{let r=[];for(const o of n.views.values())r=r.concat(Oa(o,e,t,s));return r}}function ch(n,e,t,s,i){const r=e._queryIdentifier,o=n.views.get(r);if(!o){let a=Ms(t,i?s:null),l=!1;a?l=!0:s instanceof R?(a=Vr(t,s),l=!1):(a=R.EMPTY_NODE,l=!1);const c=zs(new dt(a,l,!1),new dt(s,i,!1));return new B_(e,c)}return o}function G_(n,e,t,s,i,r){const o=ch(n,e,s,i,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),V_(o,t),H_(o,t)}function K_(n,e,t,s){const i=e._queryIdentifier,r=[];let o=[];const a=ut(n);if(i==="default")for(const[l,c]of n.views.entries())o=o.concat(Na(c,t,s)),Aa(c)&&(n.views.delete(l),c.query._queryParams.loadsAllData()||r.push(c.query));else{const l=n.views.get(i);l&&(o=o.concat(Na(l,t,s)),Aa(l)&&(n.views.delete(i),l.query._queryParams.loadsAllData()||r.push(l.query)))}return a&&!ut(n)&&r.push(new(z_())(e._repo,e._path)),{removed:r,events:o}}function hh(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function lt(n,e){let t=null;for(const s of n.views.values())t=t||j_(s,e);return t}function dh(n,e){if(e._queryParams.loadsAllData())return Gs(n);{const s=e._queryIdentifier;return n.views.get(s)}}function uh(n,e){return dh(n,e)!=null}function ut(n){return Gs(n)!=null}function Gs(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ns;function Y_(n){S(!Ns,"__referenceConstructor has already been defined"),Ns=n}function X_(){return S(Ns,"Reference.ts has not been loaded"),Ns}let Q_=1;class Da{constructor(e){this.listenProvider_=e,this.syncPointTree_=new K(null),this.pendingWriteTree_=C_(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function qr(n,e,t,s,i){return m_(n.pendingWriteTree_,e,t,s,i),i?Kn(n,new Pt(Jc(),e,t)):[]}function It(n,e,t=!1){const s=g_(n.pendingWriteTree_,e);if(y_(n.pendingWriteTree_,e)){let r=new K(null);return s.snap!=null?r=r.set(j(),!0):me(s.children,o=>{r=r.set(new z(o),!0)}),Kn(n,new xs(s.path,r,t))}else return[]}function Gn(n,e,t){return Kn(n,new Pt(Wr(),e,t))}function J_(n,e,t){const s=K.fromObject(t);return Kn(n,new Fn(Wr(),e,s))}function Z_(n,e){return Kn(n,new Ln(Wr(),e))}function e0(n,e,t){const s=Gr(n,t);if(s){const i=Kr(s),r=i.path,o=i.queryId,a=ce(r,e),l=new Ln(jr(o),a);return Yr(n,r,l)}else return[]}function Os(n,e,t,s,i=!1){const r=e._path,o=n.syncPointTree_.get(r);let a=[];if(o&&(e._queryIdentifier==="default"||uh(o,e))){const l=K_(o,e,t,s);q_(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const c=l.removed;if(a=l.events,!i){const h=c.findIndex(u=>u._queryParams.loadsAllData())!==-1,d=n.syncPointTree_.findOnPath(r,(u,p)=>ut(p));if(h&&!d){const u=n.syncPointTree_.subtree(r);if(!u.isEmpty()){const p=s0(u);for(let y=0;y<p.length;++y){const w=p[y],I=w.query,m=gh(n,w);n.listenProvider_.startListening(xn(I),Bn(n,I),m.hashFn,m.onComplete)}}}!d&&c.length>0&&!s&&(h?n.listenProvider_.stopListening(xn(e),null):c.forEach(u=>{const p=n.queryToTagMap.get(Ys(u));n.listenProvider_.stopListening(xn(u),p)}))}i0(n,c)}return a}function fh(n,e,t,s){const i=Gr(n,s);if(i!=null){const r=Kr(i),o=r.path,a=r.queryId,l=ce(o,e),c=new Pt(jr(a),l,t);return Yr(n,o,c)}else return[]}function t0(n,e,t,s){const i=Gr(n,s);if(i){const r=Kr(i),o=r.path,a=r.queryId,l=ce(o,e),c=K.fromObject(t),h=new Fn(jr(a),l,c);return Yr(n,o,h)}else return[]}function Qi(n,e,t,s=!1){const i=e._path;let r=null,o=!1;n.syncPointTree_.foreachOnPath(i,(u,p)=>{const y=ce(u,i);r=r||lt(p,y),o=o||ut(p)});let a=n.syncPointTree_.get(i);a?(o=o||ut(a),r=r||lt(a,j())):(a=new lh,n.syncPointTree_=n.syncPointTree_.set(i,a));let l;r!=null?l=!0:(l=!1,r=R.EMPTY_NODE,n.syncPointTree_.subtree(i).foreachChild((p,y)=>{const w=lt(y,j());w&&(r=r.updateImmediateChild(p,w))}));const c=uh(a,e);if(!c&&!e._queryParams.loadsAllData()){const u=Ys(e);S(!n.queryToTagMap.has(u),"View does not exist, but we have a tag");const p=r0();n.queryToTagMap.set(u,p),n.tagToQueryMap.set(p,u)}const h=qs(n.pendingWriteTree_,i);let d=G_(a,e,t,h,r,l);if(!c&&!o&&!s){const u=dh(a,e);d=d.concat(o0(n,e,u))}return d}function Ks(n,e,t){const i=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,a)=>{const l=ce(o,e),c=lt(a,l);if(c)return c});return nh(i,e,r,t,!0)}function n0(n,e){const t=e._path;let s=null;n.syncPointTree_.foreachOnPath(t,(c,h)=>{const d=ce(c,t);s=s||lt(h,d)});let i=n.syncPointTree_.get(t);i?s=s||lt(i,j()):(i=new lh,n.syncPointTree_=n.syncPointTree_.set(t,i));const r=s!=null,o=r?new dt(s,!0,!1):null,a=qs(n.pendingWriteTree_,e._path),l=ch(i,e,a,r?o.getNode():R.EMPTY_NODE,r);return W_(l)}function Kn(n,e){return ph(e,n.syncPointTree_,null,qs(n.pendingWriteTree_,j()))}function ph(n,e,t,s){if(U(n.path))return mh(n,e,t,s);{const i=e.get(j());t==null&&i!=null&&(t=lt(i,j()));let r=[];const o=F(n.path),a=n.operationForChild(o),l=e.children.get(o);if(l&&a){const c=t?t.getImmediateChild(o):null,h=sh(s,o);r=r.concat(ph(a,l,c,h))}return i&&(r=r.concat(zr(i,n,s,t))),r}}function mh(n,e,t,s){const i=e.get(j());t==null&&i!=null&&(t=lt(i,j()));let r=[];return e.children.inorderTraversal((o,a)=>{const l=t?t.getImmediateChild(o):null,c=sh(s,o),h=n.operationForChild(o);h&&(r=r.concat(mh(h,a,l,c)))}),i&&(r=r.concat(zr(i,n,s,t))),r}function gh(n,e){const t=e.query,s=Bn(n,t);return{hashFn:()=>(U_(e)||R.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return s?e0(n,t._path,s):Z_(n,t._path);{const r=ny(i,t);return Os(n,t,null,r)}}}}function Bn(n,e){const t=Ys(e);return n.queryToTagMap.get(t)}function Ys(n){return n._path.toString()+"$"+n._queryIdentifier}function Gr(n,e){return n.tagToQueryMap.get(e)}function Kr(n){const e=n.indexOf("$");return S(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new z(n.substr(0,e))}}function Yr(n,e,t){const s=n.syncPointTree_.get(e);S(s,"Missing sync point for query tag that we're tracking");const i=qs(n.pendingWriteTree_,e);return zr(s,t,i,null)}function s0(n){return n.fold((e,t,s)=>{if(t&&ut(t))return[Gs(t)];{let i=[];return t&&(i=hh(t)),me(s,(r,o)=>{i=i.concat(o)}),i}})}function xn(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(X_())(n._repo,n._path):n}function i0(n,e){for(let t=0;t<e.length;++t){const s=e[t];if(!s._queryParams.loadsAllData()){const i=Ys(s),r=n.queryToTagMap.get(i);n.queryToTagMap.delete(i),n.tagToQueryMap.delete(r)}}}function r0(){return Q_++}function o0(n,e,t){const s=e._path,i=Bn(n,e),r=gh(n,t),o=n.listenProvider_.startListening(xn(e),i,r.hashFn,r.onComplete),a=n.syncPointTree_.subtree(s);if(i)S(!ut(a.value),"If we're adding a query, it shouldn't be shadowed");else{const l=a.fold((c,h,d)=>{if(!U(c)&&h&&ut(h))return[Gs(h).query];{let u=[];return h&&(u=u.concat(hh(h).map(p=>p.query))),me(d,(p,y)=>{u=u.concat(y)}),u}});for(let c=0;c<l.length;++c){const h=l[c];n.listenProvider_.stopListening(xn(h),Bn(n,h))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xr{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new Xr(t)}node(){return this.node_}}class Qr{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=ee(this.path_,e);return new Qr(this.syncTree_,t)}node(){return Ks(this.syncTree_,this.path_)}}const a0=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},La=function(n,e,t){if(!n||typeof n!="object")return n;if(S(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return l0(n[".sv"],e,t);if(typeof n[".sv"]=="object")return c0(n[".sv"],e);S(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},l0=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:S(!1,"Unexpected server value: "+n)}},c0=function(n,e,t){n.hasOwnProperty("increment")||S(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const s=n.increment;typeof s!="number"&&S(!1,"Unexpected increment value: "+s);const i=e.node();if(S(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return s;const o=i.getValue();return typeof o!="number"?s:o+s},h0=function(n,e,t,s){return Zr(e,new Qr(t,n),s)},Jr=function(n,e,t){return Zr(n,new Xr(e),t)};function Zr(n,e,t){const s=n.getPriority().val(),i=La(s,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const o=n,a=La(o.getValue(),e,t);return a!==o.getValue()||i!==o.getPriority().val()?new se(a,J(i)):n}else{const o=n;return r=o,i!==o.getPriority().val()&&(r=r.updatePriority(new se(i))),o.forEachChild(Y,(a,l)=>{const c=Zr(l,e.getImmediateChild(a),t);c!==l&&(r=r.updateImmediateChild(a,c))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eo{constructor(e="",t=null,s={children:{},childCount:0}){this.name=e,this.parent=t,this.node=s}}function Xs(n,e){let t=e instanceof z?e:new z(e),s=n,i=F(t);for(;i!==null;){const r=Tt(s.node.children,i)||{children:{},childCount:0};s=new eo(i,s,r),t=G(t),i=F(t)}return s}function Lt(n){return n.node.value}function to(n,e){n.node.value=e,Ji(n)}function yh(n){return n.node.childCount>0}function d0(n){return Lt(n)===void 0&&!yh(n)}function Qs(n,e){me(n.node.children,(t,s)=>{e(new eo(t,n,s))})}function _h(n,e,t,s){t&&e(n),Qs(n,i=>{_h(i,e,!0)})}function u0(n,e,t){let s=n.parent;for(;s!==null;){if(e(s))return!0;s=s.parent}return!1}function Yn(n){return new z(n.parent===null?n.name:Yn(n.parent)+"/"+n.name)}function Ji(n){n.parent!==null&&f0(n.parent,n.name,n)}function f0(n,e,t){const s=d0(t),i=Oe(n.node.children,e);s&&i?(delete n.node.children[e],n.node.childCount--,Ji(n)):!s&&!i&&(n.node.children[e]=t.node,n.node.childCount++,Ji(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p0=/[\[\].#$\/\u0000-\u001F\u007F]/,m0=/[\[\].#$\u0000-\u001F\u007F]/,xi=10*1024*1024,vh=function(n){return typeof n=="string"&&n.length!==0&&!p0.test(n)},bh=function(n){return typeof n=="string"&&n.length!==0&&!m0.test(n)},g0=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),bh(n)},y0=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Rr(n)||n&&typeof n=="object"&&Oe(n,".sv")},_0=function(n,e,t,s){Js(ur(n,"value"),e,t)},Js=function(n,e,t){const s=t instanceof z?new Dy(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+_t(s));if(typeof e=="function")throw new Error(n+"contains a function "+_t(s)+" with contents = "+e.toString());if(Rr(e))throw new Error(n+"contains "+e.toString()+" "+_t(s));if(typeof e=="string"&&e.length>xi/3&&Ls(e)>xi)throw new Error(n+"contains a string greater than "+xi+" utf8 bytes "+_t(s)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,r=!1;if(me(e,(o,a)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!vh(o)))throw new Error(n+" contains an invalid key ("+o+") "+_t(s)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Ly(s,o),Js(n,a,s),Fy(s)}),i&&r)throw new Error(n+' contains ".value" child '+_t(s)+" in addition to actual children.")}},no=function(n,e,t,s){if(!bh(t))throw new Error(ur(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},v0=function(n,e,t,s){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),no(n,e,t)},so=function(n,e){if(F(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},b0=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!vh(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!g0(t))throw new Error(ur(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w0{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function io(n,e){let t=null;for(let s=0;s<e.length;s++){const i=e[s],r=i.getPath();t!==null&&!Lr(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(i)}t&&n.eventLists_.push(t)}function wh(n,e,t){io(n,t),Ih(n,s=>Lr(s,e))}function Ne(n,e,t){io(n,t),Ih(n,s=>ke(s,e)||ke(e,s))}function Ih(n,e){n.recursionDepth_++;let t=!0;for(let s=0;s<n.eventLists_.length;s++){const i=n.eventLists_[s];if(i){const r=i.path;e(r)?(I0(n.eventLists_[s]),n.eventLists_[s]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function I0(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const s=t.getEventRunner();En&&le("event: "+t.toString()),sn(s)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const E0="repo_interrupt",S0=25;class T0{constructor(e,t,s,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=s,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new w0,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Cs(),this.transactionQueueTree_=new eo,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function C0(n,e,t){if(n.stats_=Or(n.repoInfo_),n.forceRestClient_||oy())n.server_=new Ts(n.repoInfo_,(s,i,r,o)=>{Fa(n,s,i,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>Ba(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Z(t)}catch(s){throw new Error("Invalid authOverride provided: "+s)}}n.persistentConnection_=new Xe(n.repoInfo_,e,(s,i,r,o)=>{Fa(n,s,i,r,o)},s=>{Ba(n,s)},s=>{k0(n,s)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(s=>{n.server_.refreshAuthToken(s)}),n.appCheckProvider_.addTokenChangeListener(s=>{n.server_.refreshAppCheckToken(s.token)}),n.statsReporter_=dy(n.repoInfo_,()=>new c_(n.stats_,n.server_)),n.infoData_=new i_,n.infoSyncTree_=new Da({startListening:(s,i,r,o)=>{let a=[];const l=n.infoData_.getNode(s._path);return l.isEmpty()||(a=Gn(n.infoSyncTree_,s._path,l),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),ro(n,"connected",!1),n.serverSyncTree_=new Da({startListening:(s,i,r,o)=>(n.server_.listen(s,r,i,(a,l)=>{const c=o(a,l);Ne(n.eventQueue_,s._path,c)}),[]),stopListening:(s,i)=>{n.server_.unlisten(s,i)}})}function x0(n){const t=n.infoData_.getNode(new z(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function Zs(n){return a0({timestamp:x0(n)})}function Fa(n,e,t,s,i){n.dataUpdateCount++;const r=new z(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(i)if(s){const l=us(t,c=>J(c));o=t0(n.serverSyncTree_,r,l,i)}else{const l=J(t);o=fh(n.serverSyncTree_,r,l,i)}else if(s){const l=us(t,c=>J(c));o=J_(n.serverSyncTree_,r,l)}else{const l=J(t);o=Gn(n.serverSyncTree_,r,l)}let a=r;o.length>0&&(a=ti(n,r)),Ne(n.eventQueue_,a,o)}function Ba(n,e){ro(n,"connected",e),e===!1&&R0(n)}function k0(n,e){me(e,(t,s)=>{ro(n,t,s)})}function ro(n,e,t){const s=new z("/.info/"+e),i=J(t);n.infoData_.updateSnapshot(s,i);const r=Gn(n.infoSyncTree_,s,i);Ne(n.eventQueue_,s,r)}function oo(n){return n.nextWriteId_++}function M0(n,e,t){const s=n0(n.serverSyncTree_,e);return s!=null?Promise.resolve(s):n.server_.get(e).then(i=>{const r=J(i).withIndex(e._queryParams.getIndex());Qi(n.serverSyncTree_,e,t,!0);let o;if(e._queryParams.loadsAllData())o=Gn(n.serverSyncTree_,e._path,r);else{const a=Bn(n.serverSyncTree_,e);o=fh(n.serverSyncTree_,e._path,r,a)}return Ne(n.eventQueue_,e._path,o),Os(n.serverSyncTree_,e,t,null,!0),r},i=>(Xn(n,"get for query "+Z(e)+" failed: "+i),Promise.reject(new Error(i))))}function P0(n,e,t,s,i){Xn(n,"set",{path:e.toString(),value:t,priority:s});const r=Zs(n),o=J(t,s),a=Ks(n.serverSyncTree_,e),l=Jr(o,a,r),c=oo(n),h=qr(n.serverSyncTree_,e,l,c,!0);io(n.eventQueue_,h),n.server_.put(e.toString(),o.val(!0),(u,p)=>{const y=u==="ok";y||pe("set at "+e+" failed: "+u);const w=It(n.serverSyncTree_,c,!y);Ne(n.eventQueue_,e,w),D0(n,i,u,p)});const d=Ch(n,e);ti(n,d),Ne(n.eventQueue_,d,[])}function R0(n){Xn(n,"onDisconnectEvents");const e=Zs(n),t=Cs();qi(n.onDisconnect_,j(),(i,r)=>{const o=h0(i,r,n.serverSyncTree_,e);Qc(t,i,o)});let s=[];qi(t,j(),(i,r)=>{s=s.concat(Gn(n.serverSyncTree_,i,r));const o=Ch(n,i);ti(n,o)}),n.onDisconnect_=Cs(),Ne(n.eventQueue_,j(),s)}function A0(n,e,t){let s;F(e._path)===".info"?s=Qi(n.infoSyncTree_,e,t):s=Qi(n.serverSyncTree_,e,t),wh(n.eventQueue_,e._path,s)}function N0(n,e,t){let s;F(e._path)===".info"?s=Os(n.infoSyncTree_,e,t):s=Os(n.serverSyncTree_,e,t),wh(n.eventQueue_,e._path,s)}function O0(n){n.persistentConnection_&&n.persistentConnection_.interrupt(E0)}function Xn(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),le(t,...e)}function D0(n,e,t,s){e&&sn(()=>{if(t==="ok")e(null);else{const i=(t||"error").toUpperCase();let r=i;s&&(r+=": "+s);const o=new Error(r);o.code=i,e(o)}})}function L0(n,e,t,s,i,r){Xn(n,"transaction on "+e);const o={path:e,update:t,onComplete:s,status:null,order:vc(),applyLocally:r,retryCount:0,unwatcher:i,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},a=ao(n,e,void 0);o.currentInputSnapshot=a;const l=o.update(a.val());if(l===void 0)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{Js("transaction failed: Data returned ",l,o.path),o.status=0;const c=Xs(n.transactionQueueTree_,e),h=Lt(c)||[];h.push(o),to(c,h);let d;typeof l=="object"&&l!==null&&Oe(l,".priority")?(d=Tt(l,".priority"),S(y0(d),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):d=(Ks(n.serverSyncTree_,e)||R.EMPTY_NODE).getPriority().val();const u=Zs(n),p=J(l,d),y=Jr(p,a,u);o.currentOutputSnapshotRaw=p,o.currentOutputSnapshotResolved=y,o.currentWriteId=oo(n);const w=qr(n.serverSyncTree_,e,y,o.currentWriteId,o.applyLocally);Ne(n.eventQueue_,e,w),ei(n,n.transactionQueueTree_)}}function ao(n,e,t){return Ks(n.serverSyncTree_,e,t)||R.EMPTY_NODE}function ei(n,e=n.transactionQueueTree_){if(e||ni(n,e),Lt(e)){const t=Sh(n,e);S(t.length>0,"Sending zero length transaction queue"),t.every(i=>i.status===0)&&F0(n,Yn(e),t)}else yh(e)&&Qs(e,t=>{ei(n,t)})}function F0(n,e,t){const s=t.map(c=>c.currentWriteId),i=ao(n,e,s);let r=i;const o=i.hash();for(let c=0;c<t.length;c++){const h=t[c];S(h.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),h.status=1,h.retryCount++;const d=ce(e,h.path);r=r.updateChild(d,h.currentOutputSnapshotRaw)}const a=r.val(!0),l=e;n.server_.put(l.toString(),a,c=>{Xn(n,"transaction put response",{path:l.toString(),status:c});let h=[];if(c==="ok"){const d=[];for(let u=0;u<t.length;u++)t[u].status=2,h=h.concat(It(n.serverSyncTree_,t[u].currentWriteId)),t[u].onComplete&&d.push(()=>t[u].onComplete(null,!0,t[u].currentOutputSnapshotResolved)),t[u].unwatcher();ni(n,Xs(n.transactionQueueTree_,e)),ei(n,n.transactionQueueTree_),Ne(n.eventQueue_,e,h);for(let u=0;u<d.length;u++)sn(d[u])}else{if(c==="datastale")for(let d=0;d<t.length;d++)t[d].status===3?t[d].status=4:t[d].status=0;else{pe("transaction at "+l.toString()+" failed: "+c);for(let d=0;d<t.length;d++)t[d].status=4,t[d].abortReason=c}ti(n,e)}},o)}function ti(n,e){const t=Eh(n,e),s=Yn(t),i=Sh(n,t);return B0(n,i,s),s}function B0(n,e,t){if(e.length===0)return;const s=[];let i=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const l=e[a],c=ce(t,l.path);let h=!1,d;if(S(c!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),l.status===4)h=!0,d=l.abortReason,i=i.concat(It(n.serverSyncTree_,l.currentWriteId,!0));else if(l.status===0)if(l.retryCount>=S0)h=!0,d="maxretry",i=i.concat(It(n.serverSyncTree_,l.currentWriteId,!0));else{const u=ao(n,l.path,o);l.currentInputSnapshot=u;const p=e[a].update(u.val());if(p!==void 0){Js("transaction failed: Data returned ",p,l.path);let y=J(p);typeof p=="object"&&p!=null&&Oe(p,".priority")||(y=y.updatePriority(u.getPriority()));const I=l.currentWriteId,m=Zs(n),f=Jr(y,u,m);l.currentOutputSnapshotRaw=y,l.currentOutputSnapshotResolved=f,l.currentWriteId=oo(n),o.splice(o.indexOf(I),1),i=i.concat(qr(n.serverSyncTree_,l.path,f,l.currentWriteId,l.applyLocally)),i=i.concat(It(n.serverSyncTree_,I,!0))}else h=!0,d="nodata",i=i.concat(It(n.serverSyncTree_,l.currentWriteId,!0))}Ne(n.eventQueue_,t,i),i=[],h&&(e[a].status=2,function(u){setTimeout(u,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(d==="nodata"?s.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):s.push(()=>e[a].onComplete(new Error(d),!1,null))))}ni(n,n.transactionQueueTree_);for(let a=0;a<s.length;a++)sn(s[a]);ei(n,n.transactionQueueTree_)}function Eh(n,e){let t,s=n.transactionQueueTree_;for(t=F(e);t!==null&&Lt(s)===void 0;)s=Xs(s,t),e=G(e),t=F(e);return s}function Sh(n,e){const t=[];return Th(n,e,t),t.sort((s,i)=>s.order-i.order),t}function Th(n,e,t){const s=Lt(e);if(s)for(let i=0;i<s.length;i++)t.push(s[i]);Qs(e,i=>{Th(n,i,t)})}function ni(n,e){const t=Lt(e);if(t){let s=0;for(let i=0;i<t.length;i++)t[i].status!==2&&(t[s]=t[i],s++);t.length=s,to(e,t.length>0?t:void 0)}Qs(e,s=>{ni(n,s)})}function Ch(n,e){const t=Yn(Eh(n,e)),s=Xs(n.transactionQueueTree_,e);return u0(s,i=>{ki(n,i)}),ki(n,s),_h(s,i=>{ki(n,i)}),t}function ki(n,e){const t=Lt(e);if(t){const s=[];let i=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(S(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(S(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),i=i.concat(It(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&s.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?to(e,void 0):t.length=r+1,Ne(n.eventQueue_,Yn(e),i);for(let o=0;o<s.length;o++)sn(s[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U0(n){let e="";const t=n.split("/");for(let s=0;s<t.length;s++)if(t[s].length>0){let i=t[s];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function W0(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const s=t.split("=");s.length===2?e[decodeURIComponent(s[0])]=decodeURIComponent(s[1]):pe(`Invalid query segment '${t}' in query '${n}'`)}return e}const Ua=function(n,e){const t=j0(n),s=t.namespace;t.domain==="firebase.com"&&Ze(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!s||s==="undefined")&&t.domain!=="localhost"&&Ze("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||Qg();const i=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new Ac(t.host,t.secure,s,i,e,"",s!==t.subdomain),path:new z(t.pathString)}},j0=function(n){let e="",t="",s="",i="",r="",o=!0,a="https",l=443;if(typeof n=="string"){let c=n.indexOf("//");c>=0&&(a=n.substring(0,c-1),n=n.substring(c+2));let h=n.indexOf("/");h===-1&&(h=n.length);let d=n.indexOf("?");d===-1&&(d=n.length),e=n.substring(0,Math.min(h,d)),h<d&&(i=U0(n.substring(h,d)));const u=W0(n.substring(Math.min(n.length,d)));c=e.indexOf(":"),c>=0?(o=a==="https"||a==="wss",l=parseInt(e.substring(c+1),10)):c=e.length;const p=e.slice(0,c);if(p.toLowerCase()==="localhost")t="localhost";else if(p.split(".").length<=2)t=p;else{const y=e.indexOf(".");s=e.substring(0,y).toLowerCase(),t=e.substring(y+1),r=s}"ns"in u&&(r=u.ns)}return{host:e,port:l,domain:t,subdomain:s,secure:o,scheme:a,pathString:i,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V0{constructor(e,t,s,i){this.eventType=e,this.eventRegistration=t,this.snapshot=s,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Z(this.snapshot.exportVal())}}class H0{constructor(e,t,s){this.eventRegistration=e,this.error=t,this.path=s}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xh{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return S(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(e,t,s,i){this._repo=e,this._path=t,this._queryParams=s,this._orderByCalled=i}get key(){return U(this._path)?null:jc(this._path)}get ref(){return new De(this._repo,this._path)}get _queryIdentifier(){const e=Sa(this._queryParams),t=Ar(e);return t==="{}"?"default":t}get _queryObject(){return Sa(this._queryParams)}isEqual(e){if(e=oe(e),!(e instanceof si))return!1;const t=this._repo===e._repo,s=Lr(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&s&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+Oy(this._path)}}class De extends si{constructor(e,t){super(e,t,new $s,!1)}get parent(){const e=Hc(this._path);return e===null?null:new De(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class At{constructor(e,t,s){this._node=e,this.ref=t,this._index=s}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new z(e),s=et(this.ref,e);return new At(this._node.getChild(t),s,Y)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(s,i)=>e(new At(i,et(this.ref,s),Y)))}hasChild(e){const t=new z(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function Ie(n,e){return n=oe(n),n._checkNotDeleted("ref"),e!==void 0?et(n._root,e):n._root}function et(n,e){return n=oe(n),F(n._path)===null?v0("child","path",e):no("child","path",e),new De(n._repo,ee(n._path,e))}function lo(n,e){n=oe(n),so("set",n._path),_0("set",e,n._path);const t=new Wn;return P0(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function rn(n){n=oe(n);const e=new xh(()=>{}),t=new ii(e);return M0(n._repo,n,t).then(s=>new At(s,new De(n._repo,n._path),n._queryParams.getIndex()))}class ii{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const s=t._queryParams.getIndex();return new V0("value",this,new At(e.snapshotNode,new De(t._repo,t._path),s))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new H0(this,e,t):null}matches(e){return e instanceof ii?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function $0(n,e,t,s,i){const r=new xh(t,void 0),o=new ii(r);return A0(n._repo,n,o),()=>N0(n._repo,n,o)}function kh(n,e,t,s){return $0(n,"value",e)}$_(De);Y_(De);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const z0="FIREBASE_DATABASE_EMULATOR_HOST",Zi={};let q0=!1;function G0(n,e,t,s){const i=e.lastIndexOf(":"),r=e.substring(0,i),o=Jt(r);n.repoInfo_=new Ac(e,o,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0,t),s&&(n.authTokenProvider_=s)}function Mh(n,e,t,s,i){let r=s||n.options.databaseURL;r===void 0&&(n.options.projectId||Ze("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),le("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=Ua(r,i),a=o.repoInfo,l;typeof process<"u"&&oa&&(l=oa[z0]),l?(r=`http://${l}?ns=${a.namespace}`,o=Ua(r,i),a=o.repoInfo):o.repoInfo.secure;const c=new ly(n.name,n.options,e);b0("Invalid Firebase Database URL",o),U(o.path)||Ze("Database URL must point to the root of a Firebase Database (not including a child path).");const h=Y0(a,n,c,new ay(n,t));return new Ph(h,n)}function K0(n,e){const t=Zi[e];(!t||t[n.key]!==n)&&Ze(`Database ${e}(${n.repoInfo_}) has already been deleted.`),O0(n),delete t[n.key]}function Y0(n,e,t,s){let i=Zi[e.name];i||(i={},Zi[e.name]=i);let r=i[n.toURLString()];return r&&Ze("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new T0(n,q0,t,s),i[n.toURLString()]=r,r}class Ph{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(C0(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new De(this._repo,j())),this._rootInternal}_delete(){return this._rootInternal!==null&&(K0(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&Ze("Cannot call "+e+" on a deleted database.")}}function Rh(n=pr(),e){const t=Ot(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const s=Xd("database");s&&Ah(t,...s)}return t}function Ah(n,e,t,s={}){n=oe(n),n._checkNotDeleted("useEmulator");const i=`${e}:${t}`,r=n._repoInternal;if(n._instanceStarted){if(i===n._repoInternal.repoInfo_.host&&ct(s,r.repoInfo_.emulatorOptions))return;Ze("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(r.repoInfo_.nodeAdmin)s.mockUserToken&&Ze('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new cs(cs.OWNER);else if(s.mockUserToken){const a=typeof s.mockUserToken=="string"?s.mockUserToken:Qd(s.mockUserToken,n.app.options.projectId);o=new cs(a)}Jt(e)&&(al(e),ll("Database",!0)),G0(r,i,s,o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X0(n){yc(en),Be(new Ae("database",(e,{instanceIdentifier:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return Mh(s,i,r,t)},"PUBLIC").setMultipleInstances(!0)),we(aa,la,n),we(aa,la,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nh{constructor(e,t){this.committed=e,this.snapshot=t}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function Qn(n,e,t){if(n=oe(n),so("Reference.transaction",n._path),n.key===".length"||n.key===".keys")throw"Reference.transaction failed: "+n.key+" is a read-only object.";const s=!0,i=new Wn,r=(a,l,c)=>{let h=null;a?i.reject(a):(h=new At(c,new De(n._repo,n._path),Y),i.resolve(new Nh(l,h)))},o=kh(n,()=>{});return L0(n._repo,n._path,e,r,o,s),i.promise}Xe.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};Xe.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};X0();const Oh=Object.freeze(Object.defineProperty({__proto__:null,DataSnapshot:At,Database:Ph,TransactionResult:Nh,_QueryImpl:si,_QueryParams:$s,_ReferenceImpl:De,_repoManagerDatabaseFromApp:Mh,_setSDKVersion:yc,_validatePathString:no,_validateWritablePath:so,child:et,connectDatabaseEmulator:Ah,get:rn,getDatabase:Rh,onValue:kh,ref:Ie,runTransaction:Qn,set:lo},Symbol.toStringTag,{value:"Module"})),Q0={apiKey:"AIzaSyCFQL607xMZ15YZeTZ6jTfVUB1Y1D7X7Uk",authDomain:"novacells-469509.firebaseapp.com",projectId:"novacells-469509",storageBucket:"novacells-469509.firebasestorage.app",messagingSenderId:"235801636213",appId:"1:235801636213:web:ed1cb4b023e7e84727373c",measurementId:"G-1WES90HYC6"},ri=ml(Q0);typeof window<"u"&&$g().then(n=>{n&&Vg(ri)}).catch(()=>{});const Ee=Rh(ri),Un=Tm(ri),J0=new $e,kn=Object.freeze(Object.defineProperty({__proto__:null,app:ri,auth:Un,db:Ee,googleProvider:J0,onAuthStateChanged:Er,signInWithPopup:Op,signOut:pp},Symbol.toStringTag,{value:"Module"})),Dh="leaderboard/top10";async function Lh(n){try{const e=Ie(Ee,Dh);await Qn(e,t=>{let s=[];Array.isArray(t)?s=t:t&&typeof t=="object"&&(s=Object.values(t));const i=s.filter(Boolean).map(o=>({skinDataUrl:o.skinDataUrl||"",maxMass:Number(o.maxMass)||0,survivedSec:Number(o.survivedSec)||0,ts:Number(o.ts)||Date.now(),uid:o.uid,name:o.name}));return i.push(n),i.sort((o,a)=>a.maxMass-o.maxMass||a.survivedSec-o.survivedSec||a.ts-o.ts),i.slice(0,10)})}catch(e){console.error("[recordsCloud] pushRecordToCloud failed",e)}}async function Z0(){try{const n=await rn(et(Ie(Ee),Dh));if(!n.exists())return[];const e=n.val();return(Array.isArray(e)?e:Object.values(e)).sort((s,i)=>i.maxMass-s.maxMass||i.survivedSec-s.survivedSec||i.ts-s.ts).slice(0,10)}catch{return[]}}function Fh(n){return`users/${n}/records`}async function ev(n,e){try{const t=Ie(Ee,Fh(n));await Qn(t,s=>{let i=[];Array.isArray(s)?i=s:s&&typeof s=="object"&&(i=Object.values(s));const r=i.filter(Boolean).map(o=>({skinDataUrl:o.skinDataUrl||"",maxMass:Number(o.maxMass)||0,survivedSec:Number(o.survivedSec)||0,ts:Number(o.ts)||Date.now()}));return r.push(e),r.sort((o,a)=>a.maxMass-o.maxMass||a.survivedSec-o.survivedSec||a.ts-o.ts),r.slice(0,10)})}catch(t){console.error("[recordsCloud] pushUserRecord failed",t)}}async function tv(n){try{const e=await rn(et(Ie(Ee),Fh(n)));if(!e.exists())return[];const t=e.val();return(Array.isArray(t)?t:Object.values(t)).sort((i,r)=>r.maxMass-i.maxMass||r.survivedSec-i.survivedSec||r.ts-i.ts).slice(0,10)}catch{return[]}}function Bh(n){return`users/${n}/coins`}function Uh(n){return`users/${n}/profile/bestMaxMass`}function nv(n){return`users/${n}/skins`}async function sv(n){try{const e=await rn(et(Ie(Ee),Bh(n))),t=e.exists()?e.val():0,s=Number(t);return Number.isFinite(s)&&s>=0?Math.floor(s):0}catch{return 0}}async function iv(n,e){try{await lo(Ie(Ee,Bh(n)),Math.max(0,Math.floor(e)))}catch{}}async function Wh(n){try{const e=await rn(et(Ie(Ee),Uh(n))),t=e.exists()?Number(e.val()):0;return Number.isFinite(t)?t:0}catch{return 0}}async function rv(n,e){try{const t=await Wh(n);e>t&&await lo(Ie(Ee,Uh(n)),Math.floor(e))}catch{}}async function ov(n){try{const e=await rn(et(Ie(Ee),nv(n))),t=e.exists()?e.val():{};return t&&typeof t=="object"?t:{}}catch{return{}}}async function av(n,e,t){var s,i;try{const r=Ie(Ee,`users/${n}`);let o=0;const a=await Qn(r,c=>{const h=c&&typeof c=="object"?{...c}:{},d=Math.max(0,Math.floor(Number(h.coins??0)));if((h.skins&&h.skins[e])===!0)return c;if(d<t)return;const u=d-t;return h.coins=u,h.skins=h.skins||{},h.skins[e]=!0,h});if(!a.committed){const c=(s=a.snapshot)==null?void 0:s.val(),h=!!(c&&c.skins&&c.skins[e]),d=Number((c==null?void 0:c.coins)??0);return h?{ok:!1,reason:"already-owned",coins:d}:{ok:!1,reason:"insufficient-coins",coins:d}}const l=(i=a.snapshot)==null?void 0:i.val();return o=Number((l==null?void 0:l.coins)??0),{ok:!0,coins:Number.isFinite(o)?o:0}}catch{return{ok:!1,reason:"error"}}}async function lv(n){var e;try{const t=[{id:"1",name:"Premium Skin 1"},{id:"3",name:"Premium Skin 3"},{id:"4",name:"Premium Skin 4"},{id:"5",name:"Premium Skin 5"},{id:"dergott",name:"Der Gott"},{id:"enkhi",name:"Enkhi"},{id:"gaia",name:"Gaia"},{id:"galaxy",name:"Galaxy"},{id:"goettin",name:"Göttin"},{id:"mihi",name:"Mihi"},{id:"zeus",name:"Zeus"}],s=Ie(Ee,`users/${n}`),i=await Qn(s,a=>{const l=a&&typeof a=="object"?{...a}:{};l.skins=l.skins||{};const c=t.filter(d=>!l.skins[d.id]);if(c.length===0)return l._noSkinsToUnlock=!0,l;const h=c[Math.floor(Math.random()*c.length)];return l._unlockedSkin=h,l.skins[h.id]=!0,l});if(!i.committed)return{ok:!1,reason:"transaction-failed"};const r=(e=i.snapshot)==null?void 0:e.val();if(r!=null&&r._noSkinsToUnlock)return{ok:!1,reason:"all-skins-owned"};const o=r==null?void 0:r._unlockedSkin;return o?{ok:!0,skinId:o.id,skinName:o.name}:{ok:!1,reason:"no-skin-unlocked"}}catch(t){return console.error("Error unlocking random premium skin:",t),{ok:!1,reason:"error"}}}const er=Object.freeze(Object.defineProperty({__proto__:null,fetchCloudTop10:Z0,fetchUserCoins:sv,fetchUserSkins:ov,fetchUserTop10:tv,getUserBestMax:Wh,purchaseSkin:av,pushRecordToCloud:Lh,pushUserRecord:ev,setUserBestMax:rv,setUserCoins:iv,unlockRandomPremiumSkin:lv},Symbol.toStringTag,{value:"Module"}));class cv{constructor(e){_(this,"root");_(this,"bgCanvas");_(this,"bgCtx");_(this,"level");_(this,"menuPellets",[]);_(this,"bgRAF");_(this,"bgActive",!1);_(this,"nameInput");_(this,"preview");_(this,"currentSkinCanvas");_(this,"skinThumb");_(this,"card");_(this,"gridEl");_(this,"paletteEl");_(this,"titleEl");_(this,"titleTextEl");_(this,"nameWrapEl");_(this,"startBtn");_(this,"musicBtn");_(this,"fsBtn");_(this,"presetThumbs",[]);_(this,"coinEl");_(this,"userBadgeCanvas");_(this,"starBtn");_(this,"mobileOverlayEl");_(this,"mobileOverlayCleanup");var ho;this.opts=e,this.root=document.createElement("div"),this.root.id="start-menu",Object.assign(this.root.style,{position:"fixed",inset:"0",zIndex:"2000",display:"grid",placeItems:"center",background:"transparent"}),this.currentSkinCanvas=sr(ld[0]),this.bgCanvas=document.createElement("canvas"),Object.assign(this.bgCanvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%"});const t=this.bgCanvas.getContext("2d");if(!t)throw new Error("no 2d ctx");this.bgCtx=t,this.level=new Va(this.bgCanvas),this.resizeBg(),this.initMenuPellets(),window.addEventListener("resize",()=>{this.resizeBg(),this.initMenuPellets()});const s=document.createElement("div");Object.assign(s.style,{position:"relative",width:"min(1100px, 94vw)",background:"rgba(8,10,28,0.72)",backdropFilter:"blur(10px)",borderRadius:"18px",padding:"20px",color:"#fff",boxShadow:"0 30px 60px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,0.06)"}),this.card=s;const i=document.createElement("button");(ho=this.opts.musicManager)==null||ho.isCurrentlyPlaying(),Object.assign(i.style,{position:"absolute",top:"14px",left:"14px",right:"auto",width:"40px",height:"40px",borderRadius:"50%",border:"0",background:"rgba(255,255,255,0.10)",color:"#fff",cursor:"pointer",display:"grid",placeItems:"center",zIndex:"2"});const r=()=>{var C;i.replaceChildren(fn((C=this.opts.musicManager)!=null&&C.isCurrentlyPlaying()?"volume-on":"volume-off"))};r(),i.onclick=()=>{var C;(C=this.opts.musicManager)==null||C.toggle(),r()},this.musicBtn=i;const o=document.createElement("button");Object.assign(o.style,{position:"absolute",top:"14px",left:"66px",right:"auto",width:"40px",height:"40px",borderRadius:"50%",border:"0",background:"rgba(255,255,255,0.10)",color:"#fff",cursor:"pointer",display:"grid",placeItems:"center",zIndex:"2"}),o.appendChild(fn("fullscreen"));const a=document,l=document.documentElement,c=()=>!!(document.fullscreenElement||a.webkitFullscreenElement||a.msFullscreenElement),h=async()=>{try{l.requestFullscreen?await l.requestFullscreen():l.webkitRequestFullscreen?l.webkitRequestFullscreen():l.msRequestFullscreen&&l.msRequestFullscreen()}catch{}},d=async()=>{try{document.exitFullscreen?await document.exitFullscreen():a.webkitExitFullscreen?a.webkitExitFullscreen():a.msExitFullscreen&&a.msExitFullscreen()}catch{}},u=()=>{o.style.boxShadow=c()?"0 0 0 2px rgba(0,255,200,0.35) inset":"none",o.style.opacity=c()?"1.0":"0.85"};o.onclick=async()=>{c()?await d():await h(),u()},document.addEventListener("fullscreenchange",u),document.addEventListener("webkitfullscreenchange",u),document.addEventListener("msfullscreenchange",u),this.fsBtn=o;const p=document.createElement("div");Object.assign(p.style,{position:"absolute",top:"14px",right:"14px",padding:"8px 12px",borderRadius:"999px",background:"rgba(255,255,255,0.10)",color:"#fff",display:"flex",alignItems:"center",gap:"8px",font:"700 14px system-ui, sans-serif",zIndex:"2",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.08)"});const y=fn("coin"),w=document.createElement("span");w.textContent=String(this.getCoins()),p.append(y,w),this.coinEl=p;const I=document.createElement("div");Object.assign(I.style,{display:"grid",gridTemplateColumns:"1fr",gap:"12px",alignItems:"start"}),this.gridEl=I;const m=document.createElement("div"),f=document.createElement("h1"),v=document.createElement("span");v.textContent="novacells.space",Object.assign(v.style,{display:"inline-block",color:"#fff"});try{window.CSS&&typeof CSS.supports=="function"&&(CSS.supports("background-clip","text")||CSS.supports("-webkit-background-clip","text"))?(v.style.background="linear-gradient(90deg,#9af,#a6f,#6ff,#aff)",v.style.webkitBackgroundClip="text",v.style.backgroundClip="text",v.style.webkitTextFillColor="transparent",v.style.color="transparent"):(v.style.webkitBackgroundClip="",v.style.webkitTextFillColor="",v.style.background="",v.style.color="#fff")}catch{}f.appendChild(v),Object.assign(f.style,{margin:"0 0 14px",letterSpacing:"2px",fontWeight:"900",fontSize:"40px",textAlign:"center"}),this.titleEl=f,this.titleTextEl=v,this.nameInput=document.createElement("input"),Object.assign(this.nameInput.style,{flex:"0 0 auto",width:"100%",padding:"12px 16px",borderRadius:"999px",border:"0",outline:"none",background:"rgba(255,255,255,0.10)",color:"#fff",fontWeight:"800",fontSize:"16px",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.08)"}),this.startBtn=document.createElement("button"),this.startBtn.type="button",Object.assign(this.startBtn.style,{display:"none"}),this.startBtn.onclick=()=>{try{const C=(this.nameInput.value||"").trim()||"Player";this.hide(),this.opts.onStart({name:C,skinCanvas:this.currentSkinCanvas})}catch{}},this.nameInput.addEventListener("keydown",C=>{C.key==="Enter"&&(C.preventDefault(),this.startBtn.click())});const g=document.createElement("button");Object.assign(g.style,{position:"absolute",left:"-50px",top:"50%",transform:"translateY(-50%)",width:"44px",height:"44px",padding:"0",borderRadius:"50%",border:"0",background:"rgba(255, 255, 255, 0.15)",cursor:"pointer",display:"grid",placeItems:"center",zIndex:"10",boxShadow:"0 2px 8px rgba(0,0,0,0.2)"});const b=document.createElement("canvas");b.width=44,b.height=44,Object.assign(b.style,{width:"44px",height:"44px",borderRadius:"50%",display:"block",background:"#0b0f12",boxShadow:"inset 0 0 0 2px rgba(255,255,255,0.18)"}),this.skinThumb=b,g.title="Skins",g.setAttribute("aria-label","Skins"),g.append(b),g.addEventListener("click",C=>{C.preventDefault(),C.stopPropagation(),console.log("🎨 Skin button clicked! Event triggered immediately"),setTimeout(()=>{ie(async()=>{const{SkinsGallery:D}=await import("./skinsGallery-CAHI1Rj8.js");return{SkinsGallery:D}},__vite__mapDeps([0,1])).then(({SkinsGallery:D})=>{console.log("SkinsGallery imported successfully"),new D({current:this.currentSkinCanvas,onPick:L=>{this.currentSkinCanvas=L,this.updatePreview(),this.updateSkinThumb()},onClose:()=>{}});try{this.bringLastOverlayToFront()}catch{}}).catch(D=>{console.error("Failed to import SkinsGallery:",D)})},0)}),this.skinsBtn=g;const E=document.createElement("div");Object.assign(E.style,{position:"relative",width:"min(320px, 72vw)",margin:"0",overflow:"visible"}),E.append(this.nameInput,g),this.nameWrapEl=E;const T=document.createElement("div");Object.assign(T.style,{display:"grid",gridTemplateColumns:"auto auto auto auto",gap:"10px",width:"auto",margin:"8px auto 0",justifyContent:"center"});const x=document.createElement("button");Object.assign(x.style,{width:"56px",height:"56px",padding:"0",border:"0",borderRadius:"50%",background:"linear-gradient(145deg, #ffcc4d, #ffa63b)",color:"#0b0f12",cursor:"pointer",boxShadow:"0 10px 20px #ffa63b44, 0 2px 0 #ffcc4d44",display:"grid",placeItems:"center"});{const C="http://www.w3.org/2000/svg",D=document.createElementNS(C,"svg");D.setAttribute("viewBox","0 0 24 24"),D.setAttribute("width","22"),D.setAttribute("height","22");const L=document.createElementNS(C,"polygon");L.setAttribute("points","7,5 19,12 7,19"),L.setAttribute("fill","#0b0f12"),D.appendChild(L),x.appendChild(D)}x.title="Start",x.onclick=()=>{this.startBtn.click()};const A=document.createElement("button");Object.assign(A.style,{width:"56px",height:"56px",padding:"0",border:"0",borderRadius:"50%",background:"linear-gradient(145deg, #e5e7eb, #d1d5db)",color:"#0b0f12",cursor:"not-allowed",boxShadow:"0 10px 18px #9ca3af33, 0 2px 0 #e5e7eb66",display:"grid",placeItems:"center",opacity:"0.9"});{const C="http://www.w3.org/2000/svg",D=document.createElementNS(C,"svg");D.setAttribute("viewBox","0 0 24 24"),D.setAttribute("width","20"),D.setAttribute("height","20");const L=document.createElementNS(C,"circle");L.setAttribute("cx","12"),L.setAttribute("cy","12"),L.setAttribute("r","8"),L.setAttribute("fill","none"),L.setAttribute("stroke","#0b0f12"),L.setAttribute("stroke-width","2");const $=document.createElementNS(C,"line");$.setAttribute("x1","12"),$.setAttribute("y1","12"),$.setAttribute("x2","16"),$.setAttribute("y2","13"),$.setAttribute("stroke","#0b0f12"),$.setAttribute("stroke-width","2"),$.setAttribute("stroke-linecap","round"),D.append(L,$),A.appendChild(D)}A.title="Bald";const M=document.createElement("button");Object.assign(M.style,{width:"56px",height:"56px",padding:"0",border:"0",borderRadius:"50%",background:"#34d399",color:"#052",cursor:"pointer",display:"grid",placeItems:"center",boxShadow:"0 10px 18px rgba(52,211,153,.25)"}),M.title="Shop",M.appendChild(fn("cart")),M.addEventListener("click",C=>{C.preventDefault(),C.stopPropagation(),console.log("🛒 Shop button clicked! Event triggered immediately"),setTimeout(()=>{ie(async()=>{const{ShopOverlay:D}=await import("./shop-DudV8kOP.js");return{ShopOverlay:D}},__vite__mapDeps([2,1])).then(({ShopOverlay:D})=>{console.log("Shop module imported successfully");try{new D;try{this.bringLastOverlayToFront()}catch{}}catch(L){console.warn("Shop open failed",L)}}).catch(D=>{console.error("Failed to import shop module:",D)})},0)});const O=document.createElement("button");Object.assign(O.style,{width:"56px",height:"56px",padding:"0",border:"0",borderRadius:"50%",background:"#fbbf24",color:"#052",cursor:"pointer",display:"grid",placeItems:"center",boxShadow:"0 10px 18px rgba(251,191,36,.25)",transition:"all 0.3s ease"}),O.title="Level-Up Belohnung",O.appendChild(fn("gift")),this.starBtn=O,this.updateStarButton(),O.addEventListener("click",async C=>{if(C.preventDefault(),C.stopPropagation(),!(localStorage.getItem("neoncells.levelUpReward")==="true")){this.showLevelUpInfo();return}try{const{auth:L}=await ie(async()=>{const{auth:pt}=await Promise.resolve().then(()=>kn);return{auth:pt}},void 0),$=L.currentUser;if(!$){alert("Bitte melde dich mit Google an, um Level-Up Belohnungen zu erhalten!");return}O.disabled=!0,O.style.opacity="0.6";const{unlockRandomPremiumSkin:be}=await ie(async()=>{const{unlockRandomPremiumSkin:pt}=await Promise.resolve().then(()=>er);return{unlockRandomPremiumSkin:pt}},void 0),Le=await be($.uid);Le.ok?(localStorage.removeItem("neoncells.levelUpReward"),this.updateStarButton(),this.showSkinUnlockedDialog(Le.skinId,Le.skinName)):Le.reason==="all-skins-owned"?alert("🎉 Du hast bereits alle Premium-Skins freigeschaltet! Keine weiteren Belohnungen verfügbar."):alert("Fehler beim Freischalten des Skins. Versuche es später erneut.")}catch(L){console.error("Error claiming level-up reward:",L),alert("Ein Fehler ist aufgetreten. Versuche es später erneut.")}finally{O.disabled=!1,O.style.opacity="1"}}),T.append(x,A,M,O),this.modesRow=T;const V=document.createElement("div");Object.assign(V.style,{display:"grid",gap:"8px",justifyItems:"center",margin:"8px auto 0"}),this.midInfo=V;const Q=document.createElement("div");Object.assign(Q.style,{width:"240px",height:"14px",borderRadius:"999px",background:"rgba(255,255,255,0.15)",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.10)"});const te=document.createElement("div");Object.assign(te.style,{width:"0%",height:"100%",borderRadius:"999px",background:"linear-gradient(90deg,#a78bfa,#60a5fa)",boxShadow:"0 6px 14px rgba(96,165,250,0.35)",transition:"width .25s ease"}),Q.appendChild(te);const ne=document.createElement("div");Object.assign(ne.style,{padding:"2px 8px",borderRadius:"999px",background:"rgba(255,255,255,0.14)",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.10)",font:"800 12px system-ui",letterSpacing:"0.2px",color:"#fff"}),ne.textContent="Level 1";const k=document.createElement("div");Object.assign(k.style,{display:"flex",alignItems:"center",gap:"8px"}),k.append(Q,ne),this.setXP=(C,D,L)=>{const $=Math.max(0,Math.min(1,D?C/D:0));te.style.width=`${Math.round($*100)}%`,typeof L=="number"&&(ne.textContent=`Level ${Math.max(1,Math.floor(L))}`)};const W=document.createElement("div");Object.assign(W.style,{display:"flex",alignItems:"center",gap:"8px"});const X=document.createElement("canvas");X.width=28,X.height=28,Object.assign(X.style,{width:"28px",height:"28px",borderRadius:"50%",display:"block",background:"#0b0f12",boxShadow:"inset 0 0 0 2px rgba(255,255,255,0.18)"}),this.userBadgeCanvas=X;const Se=document.createElement("div");Object.assign(Se.style,{maxWidth:"220px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",font:"800 14px system-ui"}),Se.textContent="";const ae=document.createElement("button");Object.assign(ae.style,{padding:"8px 12px",borderRadius:"999px",background:"rgba(255,255,255,0.92)",color:"#123",fontWeight:"900",border:"0",cursor:"pointer"}),ae.textContent="Mit Google anmelden";const ve=document.createElement("button");ve.textContent="Abmelden",Object.assign(ve.style,{padding:"8px 12px",borderRadius:"999px",background:"rgba(255,255,255,0.92)",color:"#123",fontWeight:"900",border:"0",cursor:"pointer",display:"none"});const ft=C=>{C?(Se.textContent=C,W.replaceChildren(X,Se,ve),ae.style.display="none",ve.style.display="inline-block"):(Se.textContent="",W.replaceChildren(X,ae),ae.style.display="inline-block",ve.style.display="none")};ae.onclick=async()=>{const{auth:C,googleProvider:D,signInWithPopup:L}=await ie(async()=>{const{auth:$,googleProvider:be,signInWithPopup:Le}=await Promise.resolve().then(()=>kn);return{auth:$,googleProvider:be,signInWithPopup:Le}},void 0);try{await L(C,D)}catch($){console.warn("Google sign-in failed",$)}},ve.onclick=async()=>{try{const{auth:C,signOut:D}=await ie(async()=>{const{auth:L,signOut:$}=await Promise.resolve().then(()=>kn);return{auth:L,signOut:$}},void 0);await D(C)}catch(C){console.warn("Sign out failed",C)}},Er(Un,C=>{ft((C==null?void 0:C.displayName)||(C==null?void 0:C.email)||void 0)}),ft(),V.append(k,W);const je=document.createElement("div");Object.assign(je.style,{display:"grid",gridTemplateColumns:"auto 1fr auto",alignItems:"stretch",gap:"16px"}),this.triRow=je;const on=document.createElement("div");Object.assign(on.style,{display:"grid",gap:"6px",justifyItems:"start"}),this.leftCol=on;const qh=document.createElement("div");Object.assign(qh.style,{display:"flex",gap:"8px",alignItems:"center"});const oi=document.createElement("div");Object.assign(oi.style,{display:"grid",gap:"6px",justifyItems:"center",overflow:"visible"}),oi.append(E,T,V);const Jn=document.createElement("div");Object.assign(Jn.style,{display:"grid",gap:"8px",justifyItems:"start",alignItems:"end",height:"100%"}),this.rightCol=Jn,je.append(on,oi,Jn),m.replaceChildren(f,je),I.append(m);const an=document.createElement("div");Object.assign(an.style,{position:"static",width:"260px",padding:"12px",borderRadius:"14px",background:"rgba(255,255,255,0.90)",color:"#123",boxShadow:"0 12px 28px rgba(0,0,0,.25)",margin:"0"}),an.innerHTML=`
      <div style="font-weight:900; margin:2px 0 8px;">Letztes Match:</div>
      <div style="font-size:14px; line-height:1.65" id="match-results-content">
        Noch kein Match gespielt
      </div>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <button id="btn-records" style="flex:1; padding:8px 10px; border:0; border-radius:10px; background:#8b5cf6; color:#fff; font-weight:800; cursor:pointer">Rekorde</button>
        <button style="flex:1; padding:8px 10px; border:0; border-radius:10px; background:#1da1f2; color:#fff; font-weight:800; cursor:pointer">t Share</button>
      </div>
    `,this.resultsCard=an,this.updateMatchResults(),Jn.append(an),setTimeout(()=>{const C=an.querySelector("#btn-records");C&&(C.onclick=()=>this.openRecordsOverlay())},0),s.replaceChildren(I,this.startBtn),s.appendChild(this.musicBtn),s.appendChild(this.fsBtn),s.appendChild(this.coinEl),this.root.append(this.bgCanvas,s);const co=()=>this.alignNameUnderTitle();requestAnimationFrame(co),window.addEventListener("resize",co);try{const C=navigator.userAgent||"",D=/iPhone|iPad|iPod/.test(C)&&/Safari\//.test(C)&&!/CriOS|FxiOS|OPiOS/.test(C),L="iosA2HSuggested",$=navigator.standalone||window.matchMedia("(display-mode: standalone)").matches;if(D&&!$&&!localStorage.getItem(L)){const be=document.createElement("div");Object.assign(be.style,{position:"fixed",left:"50%",bottom:"18px",transform:"translateX(-50%)",zIndex:"141",padding:"8px 12px",borderRadius:"12px",background:"rgba(0,0,0,0.70)",color:"#fff",font:"700 12px system-ui, sans-serif"}),be.textContent="Tipp: Über das Teilen-Menü “Zum Home-Bildschirm” für echtes Vollbild.",document.body.appendChild(be),localStorage.setItem(L,"1"),setTimeout(()=>{try{be.remove()}catch{}},6e3)}}catch{}try{const C=navigator.userAgent||"",D=/iPhone|iPod/.test(C)&&/CriOS/.test(C),L="iosChromeFullscreenAsked";if(D&&!localStorage.getItem(L)){const $=document.createElement("div");Object.assign($.style,{position:"fixed",inset:"0",zIndex:"140",display:"grid",placeItems:"center",background:"rgba(0,0,0,0.55)"});const be=document.createElement("div");Object.assign(be.style,{width:"min(420px, 94vw)",padding:"16px",borderRadius:"14px",background:"rgba(8,10,28,0.92)",color:"#fff",backdropFilter:"blur(8px)",boxShadow:"0 20px 40px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,0.06)"});const Le=document.createElement("div");Le.textContent="Optimiertes Vollbild?",Object.assign(Le.style,{fontWeight:"900",fontSize:"18px",marginBottom:"8px"});const pt=document.createElement("div");pt.innerHTML='Auf iPhone in Chrome sind echte Vollbild-/Dreh-APIs eingeschränkt. Wir können ein pseudo-Vollbild aktivieren und empfehlen für echtes Vollbild: <b>In Safari öffnen</b> und "Zum Home-Bildschirm".',Object.assign(pt.style,{opacity:"0.9",marginBottom:"12px"});const ai=document.createElement("div");Object.assign(ai.style,{display:"flex",gap:"10px",justifyContent:"flex-end"});const Zn=document.createElement("button");Zn.textContent="Später",Object.assign(Zn.style,{padding:"8px 12px",border:"0",borderRadius:"10px",background:"#334155",color:"#fff",cursor:"pointer",fontWeight:"800"});const es=document.createElement("button");es.textContent="Jetzt optimieren",Object.assign(es.style,{padding:"8px 12px",border:"0",borderRadius:"10px",background:"#34d399",color:"#052",cursor:"pointer",fontWeight:"900"}),Zn.onclick=()=>{localStorage.setItem(L,"1"),$.remove()},es.onclick=async()=>{localStorage.setItem(L,"1");try{const Ft=document.documentElement;Object.assign(Ft.style,{height:"100dvh"}),Object.assign(document.body.style,{height:"100dvh",overflow:"hidden",background:"#000"});const uo=document.getElementById("game");uo&&Object.assign(uo.style,{width:"100vw",height:"100dvh",display:"block"});const ln=()=>{try{window.scrollTo(0,1)}catch{}};ln(),setTimeout(ln,50),setTimeout(ln,250),window.addEventListener("orientationchange",()=>setTimeout(ln,200)),window.addEventListener("resize",()=>setTimeout(ln,200))}catch{}try{const Ft=document.createElement("div");Object.assign(Ft.style,{position:"fixed",left:"50%",bottom:"18px",transform:"translateX(-50%)",zIndex:"141",padding:"8px 12px",borderRadius:"12px",background:"rgba(0,0,0,0.70)",color:"#fff",font:"700 12px system-ui, sans-serif"}),Ft.textContent="Für echtes Vollbild: In Safari öffnen und 'Zum Home-Bildschirm' hinzufügen.",document.body.appendChild(Ft),setTimeout(()=>{try{Ft.remove()}catch{}},5e3)}catch{}$.remove()},ai.append(Zn,es),be.append(Le,pt,ai),$.append(be),document.body.appendChild($)}}catch{}this.preview=document.createElement("canvas"),this.preview.width=200,this.preview.height=200,this.preview.style.display="none",this.updatePreview(),this.updateSkinThumb(),this.updateAccountBadge();try{const C=is();this.setXP(C.value,C.max,Ye().level),za({onXpGain:()=>{try{const D=is();this.setXP(D.value,D.max,Ye().level)}catch{}},onLevelUp:D=>{try{const L=is();this.setXP(L.value,L.max,D)}catch{}}})}catch{}this.loopBg(),this.updateLayout(),window.addEventListener("resize",()=>this.updateLayout())}initMenuPellets(){const e=this.bgCanvas.width,t=this.bgCanvas.height,s=Math.floor(Math.min(1200,Math.max(360,e*t/6e3)));this.menuPellets=[];for(let i=0;i<s;i++){const r=Math.random()*1.6+.6,o=Math.random()*Math.PI*2,a=(Math.random()*12+6)*.4;this.menuPellets.push({x:Math.random()*e,y:Math.random()*t,r,vx:Math.cos(o)*a,vy:Math.sin(o)*a,alpha:.6+Math.random()*.35,tw:(Math.random()*2-1)*.4})}}resizeBg(){const e=Math.max(1,Math.min(window.devicePixelRatio||1,2)),t=Math.floor(window.innerWidth*e),s=Math.floor(window.innerHeight*e);this.bgCanvas.width=t,this.bgCanvas.height=s,this.bgCanvas.style.width="100%",this.bgCanvas.style.height="100%",this.bgCtx.setTransform(1,0,0,1,0,0)}updatePreview(){const e=this.preview.getContext("2d");e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high";const t=90,s=this.preview.width/2,i=this.preview.height/2;e.clearRect(0,0,this.preview.width,this.preview.height),e.save(),e.beginPath(),e.arc(s,i,t,0,Math.PI*2),e.clip(),e.drawImage(this.currentSkinCanvas,s-t,i-t,t*2,t*2),e.restore(),e.lineWidth=4,e.strokeStyle="rgba(255,255,255,0.25)",e.beginPath(),e.arc(s,i,t,0,Math.PI*2),e.stroke()}updateSkinThumb(){if(!this.skinThumb)return;const e=this.skinThumb,t=e.getContext("2d");if(t){t.imageSmoothingEnabled=!0,t.imageSmoothingQuality="high",t.clearRect(0,0,e.width,e.height),t.save(),t.beginPath(),t.arc(e.width/2,e.height/2,Math.min(e.width,e.height)/2,0,Math.PI*2),t.clip();try{t.drawImage(this.currentSkinCanvas,0,0,e.width,e.height)}catch{}t.restore(),t.lineWidth=2,t.strokeStyle="rgba(255,255,255,0.25)",t.beginPath(),t.arc(e.width/2,e.height/2,Math.min(e.width,e.height)/2-1,0,Math.PI*2),t.stroke(),this.updateAccountBadge()}}updateAccountBadge(){try{const e=this.userBadgeCanvas;if(!e)return;const t=e.getContext("2d");if(!t)return;t.imageSmoothingEnabled=!0,t.imageSmoothingQuality="high",t.clearRect(0,0,e.width,e.height);const s=Math.min(e.width,e.height)/2;t.save(),t.beginPath(),t.arc(e.width/2,e.height/2,s,0,Math.PI*2),t.clip(),t.drawImage(this.currentSkinCanvas,0,0,e.width,e.height),t.restore(),t.lineWidth=2,t.strokeStyle="rgba(255,255,255,0.25)",t.beginPath(),t.arc(e.width/2,e.height/2,s-1,0,Math.PI*2),t.stroke()}catch{}}loopBg(){const e=this.bgCtx;if(this.bgActive)return;this.bgActive=!0;let t=performance.now();const s=i=>{if(!this.bgActive)return;const r=(i-t)/1e3;t=i,e.setTransform(1,0,0,1,0,0);const o=this.bgCanvas.width,a=this.bgCanvas.height;this.level.drawBackgroundScreen(e),e.save();for(const l of this.menuPellets){l.x+=l.vx*r,l.y+=l.vy*r,l.x<-4?l.x=o+4:l.x>o+4&&(l.x=-4),l.y<-4?l.y=a+4:l.y>a+4&&(l.y=-4);const c=Math.max(.2,Math.min(1,l.alpha+Math.sin(i*.001+l.x*.01+l.y*.01)*.08));e.beginPath(),e.arc(l.x,l.y,Math.max(2,l.r*1),0,Math.PI*2),e.fillStyle=`rgba(255,255,255,${.82*c})`,e.fill()}e.restore(),this.bgRAF=requestAnimationFrame(s)};this.bgRAF=requestAnimationFrame(s)}updateLayout(){const e=window.innerWidth,t=window.innerHeight,s=e<820||t<640,i=navigator.maxTouchPoints&&navigator.maxTouchPoints>0&&e>=820&&e<=1200;Object.assign(this.card.style,{width:s?"min(640px, 94vw)":"min(980px, 92vw)",borderRadius:s?"16px":"18px"}),s?Object.assign(this.card.style,{paddingTop:"56px",paddingRight:"14px",paddingBottom:"24px",paddingLeft:"14px"}):Object.assign(this.card.style,{paddingTop:"60px",paddingRight:"18px",paddingBottom:"32px",paddingLeft:"18px"});const r=this.triRow;if(r)if(s){Object.assign(r.style,{gridTemplateColumns:"1fr",gap:"12px",alignItems:"stretch"});const[h,d,u]=[this.leftCol,r.children[1],this.rightCol];h&&u&&(d.style.order="1",h.style.order="2",u.style.order="3",Object.assign(h.style,{justifyItems:"center"}),Object.assign(u.style,{justifyItems:"start",alignItems:"start",height:"auto"}))}else{Object.assign(r.style,{gridTemplateColumns:"auto 1fr auto",gap:"16px",alignItems:"stretch"});const[h,d,u]=[this.leftCol,r.children[1],this.rightCol];h&&u&&(d.style.order="2",h.style.order="1",u.style.order="3",Object.assign(h.style,{justifyItems:"start"}),Object.assign(u.style,{justifyItems:"start",alignItems:"end",height:"100%"}))}this.titleEl&&(this.titleEl.style.transform="translateX(-30px)");const o=this.modesRow;o&&(Object.assign(o.style,{gridTemplateColumns:"auto auto auto auto",width:"auto",justifyContent:"center",gap:s?"8px":"10px",margin:"8px auto 0"}),o.style.transform="translateX(115px)");const a=this.skinsBtn;a&&Object.assign(a.style,{left:s?"-54px":"-60px"});const l=this.midInfo;l&&(l.style.transform="translateX(115px)"),Object.assign(this.nameInput.style,{fontSize:s?"14px":"15px",padding:s?"10px 12px":"11px 14px"});const c=this.resultsCard;c&&Object.assign(c.style,{position:"static",width:s?"min(320px, 88vw)":"260px",margin:"0"});try{const h=this.root.querySelector('button[title="Start"]');if(h){const p=s?72:i?64:56;Object.assign(h.style,{width:`${p}px`,height:`${p}px`,fontSize:s?"18px":"14px"})}const d=this.root.querySelector('button[title="Shop"]');if(d){const p=s?64:i?60:56;Object.assign(d.style,{width:`${p}px`,height:`${p}px`})}const u=this.root.querySelector('button[title="Gifts"]');if(u){const p=s?64:i?60:56;Object.assign(u.style,{width:`${p}px`,height:`${p}px`})}a&&Object.assign(a.style,{left:s?"-70px":i?"-66px":"-60px",width:s?"56px":"44px",height:s?"56px":"44px"})}catch{}(s||i)&&this.isTouchDevice()?this.ensureMobileLandscapeOverlay():this.removeMobileLandscapeOverlay(),this.alignNameUnderTitle()}alignNameUnderTitle(){try{const e=this.titleTextEl,t=this.titleEl.parentElement,s=this.nameWrapEl;if(!e||!t||!s)return;const i=e.getBoundingClientRect(),r=t.getBoundingClientRect();let o=Math.round(i.left-r.left)-115;const a=Math.max(0,(this.card.clientWidth||0)-(s.clientWidth||0)-20);(!isFinite(o)||o<0)&&(o=0),o=Math.min(o,a),s.style.marginLeft=o+"px"}catch{}}bringLastOverlayToFront(){try{const e=Array.from(document.body.children);for(let t=e.length-1;t>=0;t--){const s=e[t];if(s===this.root)continue;const i=getComputedStyle(s);if(i.position==="fixed"||i.position==="absolute"){try{s.style.zIndex="2100",s.style.pointerEvents="auto"}catch{}break}}}catch{}}isTouchDevice(){try{return!!(typeof window<"u"&&"ontouchstart"in window||(navigator&&navigator.maxTouchPoints?navigator.maxTouchPoints>0:!1))}catch{return!1}}ensureMobileLandscapeOverlay(){try{if(window.innerWidth>window.innerHeight){this.removeMobileLandscapeOverlay();return}if(this.mobileOverlayEl)return;const t=document.createElement("div");Object.assign(t.style,{position:"fixed",inset:"0",zIndex:"4000",display:"grid",placeItems:"center",background:"rgba(0,0,0,0.85)",color:"#fff",textAlign:"center",padding:"20px",backdropFilter:"blur(10px)"});const s=document.createElement("div");Object.assign(s.style,{width:"min(560px, 92vw)",padding:"20px",borderRadius:"14px",background:"rgba(8,10,28,0.95)",boxShadow:"0 30px 60px rgba(0,0,0,.6)",fontFamily:"system-ui, sans-serif",border:"1px solid rgba(255,255,255,0.1)"});const i=document.createElement("div");i.textContent="📱 Querformat für beste Performance",Object.assign(i.style,{fontWeight:"900",fontSize:"22px",marginBottom:"12px",background:"linear-gradient(90deg,#9af,#a6f,#6ff,#aff)"}),i.style.webkitBackgroundClip="text",i.style.webkitTextFillColor="transparent";const r=document.createElement("div");r.innerHTML="Für flüssiges 60fps Gameplay drehe dein Gerät ins <strong>Querformat</strong> und aktiviere den Vollbildmodus.",Object.assign(r.style,{opacity:"0.9",marginBottom:"16px",lineHeight:"1.5"});const o=document.createElement("div");Object.assign(o.style,{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"});const a=document.createElement("button");a.innerHTML="🚀 Vollbild & Optimieren",Object.assign(a.style,{padding:"12px 16px",borderRadius:"12px",border:"0",cursor:"pointer",fontWeight:"800",background:"linear-gradient(45deg, #34d399, #10b981)",color:"#fff",fontSize:"16px",boxShadow:"0 4px 12px rgba(16, 185, 129, 0.4)",transition:"transform 0.2s ease"}),a.onclick=async()=>{try{const h=document.documentElement;h.requestFullscreen?await h.requestFullscreen():h.webkitRequestFullscreen&&h.webkitRequestFullscreen(),sessionStorage.setItem("mobileOptimized","true")}catch{}setTimeout(()=>{window.innerWidth>window.innerHeight&&this.removeMobileLandscapeOverlay()},500)};const l=document.createElement("button");l.innerHTML="📱 Trotzdem spielen",Object.assign(l.style,{padding:"12px 16px",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",fontWeight:"700",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:"14px"}),l.onclick=()=>{this.removeMobileLandscapeOverlay(),sessionStorage.setItem("mobileOptimized","basic")},o.append(a,l),s.append(i,r,o),t.append(s),document.body.appendChild(t),this.mobileOverlayEl=t;const c=()=>{setTimeout(()=>{window.innerWidth>window.innerHeight?this.removeMobileLandscapeOverlay():this.isTouchDevice()&&!this.mobileOverlayEl&&this.ensureMobileLandscapeOverlay()},100)};window.addEventListener("resize",c),window.addEventListener("orientationchange",c),typeof window.orientation<"u"&&window.addEventListener("orientationchange",()=>{setTimeout(c,500)}),this.mobileOverlayCleanup=()=>{window.removeEventListener("resize",c),window.removeEventListener("orientationchange",c)}}catch{}}autoOptimizeMobile(){try{const e=window.innerHeight>window.innerWidth,t=window.innerWidth<900||window.innerHeight<600;(e||t)&&this.showQuickMobilePrompt()}catch{}}showQuickMobilePrompt(){const e=document.getElementById("quick-mobile-prompt");e&&e.remove();const t=document.createElement("div");if(t.id="quick-mobile-prompt",Object.assign(t.style,{position:"fixed",top:"20px",left:"50%",transform:"translateX(-50%)",zIndex:"3000",background:"linear-gradient(45deg, #1e3a8a, #3730a3)",color:"#fff",padding:"12px 20px",borderRadius:"25px",fontFamily:"system-ui, sans-serif",fontSize:"14px",fontWeight:"600",boxShadow:"0 8px 25px rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",animation:"slideDown 0.3s ease-out",backdropFilter:"blur(10px)"}),t.innerHTML="📱 Für beste Performance → Querformat + Vollbild aktivieren",!document.getElementById("mobile-prompt-styles")){const s=document.createElement("style");s.id="mobile-prompt-styles",s.textContent=`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `,document.head.appendChild(s)}t.onclick=async()=>{try{if(/iPad|iPhone|iPod/.test(navigator.userAgent)){t.innerHTML='📱 iOS: Drehe Gerät → Safari Adressleiste tippen → "AA" → Vollbildschirm',t.style.background="linear-gradient(45deg, #f59e0b, #d97706)",t.style.fontSize="13px",t.style.padding="14px 18px",setTimeout(()=>{t.style.animation="slideUp 0.3s ease-in",setTimeout(()=>t.remove(),300)},6e3);return}const i=document.documentElement;i.requestFullscreen?await i.requestFullscreen():i.webkitRequestFullscreen?await i.webkitRequestFullscreen():i.msRequestFullscreen&&await i.msRequestFullscreen(),sessionStorage.setItem("mobileOptimized","true"),t.innerHTML="✅ Vollbild aktiviert! Drehe dein Gerät ins Querformat",t.style.background="linear-gradient(45deg, #059669, #10b981)",setTimeout(()=>{t.style.animation="slideUp 0.3s ease-in",setTimeout(()=>t.remove(),300)},2e3)}catch{t.innerHTML="📱 Manuell: Drehe Gerät ins Querformat für beste Performance",t.style.background="linear-gradient(45deg, #6366f1, #4f46e5)",setTimeout(()=>{t.style.animation="slideUp 0.3s ease-in",setTimeout(()=>t.remove(),300)},3e3)}},document.body.appendChild(t),setTimeout(()=>{t.parentNode&&(t.style.animation="slideUp 0.3s ease-in",setTimeout(()=>t.remove(),300))},8e3)}setupMobileOptimization(){const e=()=>{setTimeout(()=>{const t=window.innerHeight>window.innerWidth,s=/iPad|iPhone|iPod/.test(navigator.userAgent);t&&s&&this.showIOSOptimizationHint(),window.dispatchEvent(new Event("resize"))},100)};window.addEventListener("orientationchange",e),window.addEventListener("resize",e),setTimeout(()=>{const t=window.innerHeight>window.innerWidth,s=/iPad|iPhone|iPod/.test(navigator.userAgent),i="ontouchstart"in window||navigator.maxTouchPoints>0;t&&(s||i)&&this.autoOptimizeMobile()},500)}showIOSOptimizationHint(){if(sessionStorage.getItem("mobileOptimized")||sessionStorage.getItem("iosHintShown"))return;sessionStorage.setItem("iosHintShown","true");const e=document.createElement("div");e.innerHTML="💡 Tipp: Querformat + Safari Vollbild für optimale Performance",e.style.cssText=`
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(45deg, #3b82f6, #1d4ed8);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      animation: slideDown 0.3s ease-out, fadeOut 0.3s ease-in 3s;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
    `,document.body.appendChild(e),setTimeout(()=>e.remove(),3300)}removeMobileLandscapeOverlay(){try{if(this.mobileOverlayCleanup&&(this.mobileOverlayCleanup(),this.mobileOverlayCleanup=void 0),this.mobileOverlayEl){try{this.mobileOverlayEl.remove()}catch{}this.mobileOverlayEl=void 0}}catch{}}show(){try{document.body.appendChild(this.root)}catch{}this.root.style.display="grid",this.root.style.pointerEvents="auto",this.setupMobileOptimization(),this.isTouchDevice()&&setTimeout(()=>{this.autoOptimizeMobile()},500),requestAnimationFrame(()=>{try{this.updateLayout(),this.alignNameUnderTitle();const e=this.skinsBtn;e&&(e.style.pointerEvents="auto",e.style.zIndex="2100");const t=this.root.querySelector('button[title="Shop"]');t&&(t.style.pointerEvents="auto",t.style.zIndex="2100")}catch{}}),this.bgActive||this.loopBg(),this.updateMatchResults()}hide(){this.root.style.display="none",this.bgRAF!==void 0&&(cancelAnimationFrame(this.bgRAF),this.bgRAF=void 0),this.bgActive=!1}updateMatchResults(){var t;const e=this.root.querySelector("#match-results-content");if(e)try{const s=localStorage.getItem("lastMatchResults");if(s){const i=JSON.parse(s),r=((t=i.xpBreakdown)==null?void 0:t.total)||0;e.innerHTML=`
          <div style="font-weight:800; color:#059669;">Masse erreicht: ${Math.round(i.maxMass)}</div>
          <div style="font-weight:800; color:#7c3aed; margin-top:4px;">XP verdient: +${r}</div>
          <div style="opacity:0.7; font-size:12px; margin-top:4px;">
            Überlebt: ${Math.round(i.survivedSec)}s | Rang: ${i.rank||"?"}
          </div>
        `}else e.innerHTML="Noch kein Match gespielt"}catch{e.innerHTML="Noch kein Match gespielt"}}openRecordsOverlay(){const e=document.createElement("div");Object.assign(e.style,{position:"fixed",inset:"0",zIndex:"120",display:"grid",placeItems:"center",background:"rgba(0,0,0,0.45)"});const t=document.createElement("div");Object.assign(t.style,{width:"min(840px, 94vw)",maxHeight:"min(80vh, 760px)",overflow:"auto",background:"rgba(8,10,28,0.80)",backdropFilter:"blur(10px)",borderRadius:"16px",padding:"16px",color:"#fff",boxShadow:"0 30px 60px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,0.06)"});const s=document.createElement("div");s.textContent="Deine Top 10 Rekorde",Object.assign(s.style,{fontWeight:"900",marginBottom:"10px"});const i=document.createElement("div"),r=l=>{i.innerHTML="";for(const c of l){const h=document.createElement("div");Object.assign(h.style,{display:"grid",gridTemplateColumns:"56px 1fr auto auto",gap:"10px",alignItems:"center",padding:"8px",borderRadius:"10px",background:"rgba(255,255,255,0.06)",marginBottom:"8px"});const d=document.createElement("canvas");if(d.width=48,d.height=48,Object.assign(d.style,{width:"48px",height:"48px",borderRadius:"50%",background:"#111"}),c.skinDataUrl){const w=new Image;w.onload=()=>{const I=d.getContext("2d");I.save(),I.beginPath(),I.arc(24,24,24,0,Math.PI*2),I.clip(),I.drawImage(w,0,0,48,48),I.restore()},w.src=c.skinDataUrl}const u=document.createElement("div");u.textContent="",u.innerHTML=`<div style="font-weight:800">Max Masse: ${Math.round(c.maxMass)}</div><div style="opacity:.85">Überlebt: ${Math.round(c.survivedSec)}s</div>`;const p=document.createElement("div");p.textContent=new Date(c.ts).toLocaleString(),Object.assign(p.style,{opacity:".8"});const y=document.createElement("div");h.append(d,u,p,y),i.append(h)}if(l.length===0){const c=document.createElement("div");c.textContent="Keine Rekorde vorhanden.",Object.assign(c.style,{opacity:".8",padding:"8px"}),i.append(c)}},o=Un.currentUser;o!=null&&o.uid?ie(()=>Promise.resolve().then(()=>er),void 0).then(l=>l.fetchUserTop10(o.uid)).then(l=>r(l)).catch(()=>ie(()=>Promise.resolve().then(()=>Io),void 0).then(l=>r(l.getTopRecords()))):ie(()=>Promise.resolve().then(()=>Io),void 0).then(l=>r(l.getTopRecords()));const a=document.createElement("button");a.textContent="Schließen",Object.assign(a.style,{marginTop:"10px",padding:"10px 14px",border:"0",borderRadius:"10px",fontWeight:"900",background:"#334155",color:"#fff",cursor:"pointer"}),a.onclick=()=>e.remove(),t.append(s,i,a),e.append(t),document.body.appendChild(e)}getCoins(){try{const e=localStorage.getItem("neoncells.coins");return e?Math.max(0,parseInt(e)):0}catch{return 0}}setCoins(e){try{localStorage.setItem("neoncells.coins",String(Math.max(0,Math.floor(e))))}catch{}if(this.coinEl){const t=this.coinEl.querySelector("span");t&&(t.textContent=String(this.getCoins()))}}updateStarButton(){if(!this.starBtn)return;if(localStorage.getItem("neoncells.levelUpReward")==="true"){if(this.starBtn.style.background="linear-gradient(45deg, #fbbf24, #f59e0b)",this.starBtn.style.boxShadow="0 0 20px rgba(251,191,36,0.6), 0 10px 18px rgba(251,191,36,.25)",this.starBtn.style.animation="pulse 2s infinite",this.starBtn.title="Level-Up Belohnung bereit!",!document.getElementById("star-pulse-animation")){const t=document.createElement("style");t.id="star-pulse-animation",t.textContent=`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `,document.head.appendChild(t)}}else this.starBtn.style.background="#fbbf24",this.starBtn.style.boxShadow="0 10px 18px rgba(251,191,36,.25)",this.starBtn.style.animation="none",this.starBtn.title="Level-Up Belohnung"}showLevelUpInfo(){const e=document.createElement("div");Object.assign(e.style,{position:"fixed",inset:"0",zIndex:"3000",background:"rgba(0,0,0,0.8)",display:"grid",placeItems:"center"});const t=document.createElement("div");Object.assign(t.style,{background:"linear-gradient(145deg, #1f2937, #111827)",color:"#fff",padding:"30px",borderRadius:"16px",maxWidth:"400px",margin:"20px",textAlign:"center",boxShadow:"0 25px 50px rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)"}),t.innerHTML=`
      <div style="font-size: 48px; margin-bottom: 20px;">⭐</div>
      <h2 style="margin: 0 0 15px 0; color: #fbbf24;">Level-Up Belohnungen</h2>
      <p style="margin: 0 0 20px 0; line-height: 1.6; color: #d1d5db;">
        Steige Levels auf um zufällige Premium-Skins freizuschalten!<br/>
        <br/>
        Der Stern leuchtet auf wenn eine Belohnung bereit ist.
      </p>
      <button id="info-close" style="
        background: #fbbf24; 
        color: #000; 
        border: none; 
        padding: 12px 24px; 
        border-radius: 8px; 
        font-weight: 600; 
        cursor: pointer;
        font-size: 14px;
      ">Verstanden</button>
    `,e.appendChild(t),document.body.appendChild(e),document.getElementById("info-close").onclick=()=>e.remove(),e.onclick=s=>{s.target===e&&e.remove()}}showSkinUnlockedDialog(e,t){const s=document.createElement("div");Object.assign(s.style,{position:"fixed",inset:"0",zIndex:"3000",background:"rgba(0,0,0,0.8)",display:"grid",placeItems:"center"});const i=document.createElement("div");Object.assign(i.style,{background:"linear-gradient(145deg, #1f2937, #111827)",color:"#fff",padding:"30px",borderRadius:"16px",maxWidth:"400px",margin:"20px",textAlign:"center",boxShadow:"0 25px 50px rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)"}),i.innerHTML=`
      <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
      <h2 style="margin: 0 0 15px 0; color: #10b981;">Skin freigeschaltet!</h2>
      <p style="margin: 0 0 20px 0; line-height: 1.6; color: #d1d5db;">
        Du hast <strong style="color: #fbbf24;">${t}</strong> freigeschaltet!<br/>
        <br/>
        Der Skin ist jetzt in deiner Galerie verfügbar.
      </p>
      <div style="margin: 20px 0;">
        <button id="open-skins" style="
          background: #10b981; 
          color: #000; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 8px; 
          font-weight: 600; 
          cursor: pointer;
          font-size: 14px;
          margin-right: 10px;
        ">Skins öffnen</button>
        <button id="reward-close" style="
          background: #6b7280; 
          color: #fff; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 8px; 
          font-weight: 600; 
          cursor: pointer;
          font-size: 14px;
        ">Schließen</button>
      </div>
    `,s.appendChild(i),document.body.appendChild(s),document.getElementById("reward-close").onclick=()=>s.remove(),document.getElementById("open-skins").onclick=()=>{s.remove();const r=this.skinsBtn;r&&r.click()},s.onclick=r=>{r.target===s&&s.remove()}}}function fn(n){const e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"svg");t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("width","20"),t.setAttribute("height","20");const s="#0b0f12",i="#ffd54a";if(n==="volume-on"||n==="volume-off"){const r=document.createElementNS(e,"path");if(r.setAttribute("d","M3 10v4h4l5 4V6L7 10H3z"),r.setAttribute("fill",s),t.appendChild(r),n==="volume-on"){const o=document.createElementNS(e,"path");o.setAttribute("d","M14 9c1.5 1 1.5 5 0 6"),o.setAttribute("stroke",s),o.setAttribute("stroke-width","2"),o.setAttribute("fill","none");const a=document.createElementNS(e,"path");a.setAttribute("d","M16.5 7.5c2.5 2 2.5 7 0 9"),a.setAttribute("stroke",s),a.setAttribute("stroke-width","2"),a.setAttribute("fill","none"),o.setAttribute("stroke-linecap","round"),a.setAttribute("stroke-linecap","round"),t.append(o,a)}}else if(n==="fullscreen"){const r=document.createElementNS(e,"path");r.setAttribute("d","M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z"),r.setAttribute("fill",s),t.appendChild(r)}else if(n==="coin"){const r=document.createElementNS(e,"circle");r.setAttribute("cx","12"),r.setAttribute("cy","12"),r.setAttribute("r","9"),r.setAttribute("fill",i);const o=document.createElementNS(e,"circle");o.setAttribute("cx","12"),o.setAttribute("cy","12"),o.setAttribute("r","7"),o.setAttribute("fill","#ffe17a");const a=document.createElementNS(e,"rect");a.setAttribute("x","8"),a.setAttribute("y","11"),a.setAttribute("width","8"),a.setAttribute("height","2"),a.setAttribute("rx","1"),a.setAttribute("fill","#b88b09"),t.append(r,o,a)}else if(n==="cart"){const r=document.createElementNS(e,"path");r.setAttribute("d","M3 5h2l1.5 9h9l2-6H7"),r.setAttribute("fill","none"),r.setAttribute("stroke","#fff"),r.setAttribute("stroke-width","2"),r.setAttribute("stroke-linecap","round"),r.setAttribute("stroke-linejoin","round");const o=document.createElementNS(e,"circle");o.setAttribute("cx","10"),o.setAttribute("cy","18"),o.setAttribute("r","1.5"),o.setAttribute("fill","#fff");const a=document.createElementNS(e,"circle");a.setAttribute("cx","16"),a.setAttribute("cy","18"),a.setAttribute("r","1.5"),a.setAttribute("fill","#fff"),t.append(r,o,a)}else if(n==="gift"){const r=document.createElementNS(e,"rect");r.setAttribute("x","4"),r.setAttribute("y","10"),r.setAttribute("width","16"),r.setAttribute("height","10"),r.setAttribute("rx","1.5"),r.setAttribute("fill","#fff");const o=document.createElementNS(e,"rect");o.setAttribute("x","3"),o.setAttribute("y","8"),o.setAttribute("width","18"),o.setAttribute("height","3"),o.setAttribute("rx","1"),o.setAttribute("fill","#dbeafe");const a=document.createElementNS(e,"rect");a.setAttribute("x","11"),a.setAttribute("y","8"),a.setAttribute("width","2"),a.setAttribute("height","12"),a.setAttribute("fill","#93c5fd");const l=document.createElementNS(e,"path");l.setAttribute("d","M12 8c-1-2-3-3-5-2 2 2 3 3 5 2z"),l.setAttribute("fill","#93c5fd");const c=document.createElementNS(e,"path");c.setAttribute("d","M12 8c1-2 3-3 5-2 -2 2 -3 3 -5 2z"),c.setAttribute("fill","#93c5fd"),t.append(r,o,a,l,c)}else if(n==="user"){const r=document.createElementNS(e,"path");r.setAttribute("d","M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"),r.setAttribute("fill",s),t.appendChild(r)}else if(n==="palette"){const r=document.createElementNS(e,"path");r.setAttribute("d","M12 3c-4.97 0-9 3.58-9 8 0 3.08 2.2 4 4 4h2c1.1 0 2 .9 2 2 0 1.1.9 2 2 2 2.76 0 5-2.24 5-5 0-6-3.5-11-6-11z"),r.setAttribute("fill","#e5e7eb");const o=document.createElementNS(e,"circle");o.setAttribute("cx","9"),o.setAttribute("cy","9"),o.setAttribute("r","1"),o.setAttribute("fill","#f87171");const a=document.createElementNS(e,"circle");a.setAttribute("cx","12"),a.setAttribute("cy","7.5"),a.setAttribute("r","1"),a.setAttribute("fill","#60a5fa");const l=document.createElementNS(e,"circle");l.setAttribute("cx","14.5"),l.setAttribute("cy","10"),l.setAttribute("r","1"),l.setAttribute("fill","#34d399");const c=document.createElementNS(e,"path");c.setAttribute("d","M18 14l-6 6 1.5-4.5L18 14z"),c.setAttribute("fill","#9ca3af"),t.append(r,o,a,l,c)}return t}const jh=document.getElementById("game"),ye=new Rd(jh),Vh=new Bd;Nd(jh);Ad(Vh);(async()=>{try{const{setHooks:n}=await ie(async()=>{const{setHooks:e}=await Promise.resolve().then(()=>Ds);return{setHooks:e}},void 0);n({onLevelUp:e=>{const s=Hh()+100;$h(s),yn(`🎉 Level ${e}! +100 Coins`);const i=window.currentMenu;i&&typeof i.setCoins=="function"&&i.setCoins(s),localStorage.setItem("neoncells.levelUpReward","true"),i&&typeof i.updateStarButton=="function"&&i.updateStarButton()}})}catch(n){console.warn("Failed to setup level-up rewards:",n)}})();let tr;function yn(n,e=2500){const t=document.createElement("div");Object.assign(t.style,{position:"fixed",top:"12px",left:"50%",transform:"translateX(-50%) translateY(-10px)",background:"#ffd60a",color:"#000",padding:"8px 14px",borderRadius:"9999px",font:"700 14px system-ui",letterSpacing:"0.3px",zIndex:"100",boxShadow:"0 8px 24px rgba(0,0,0,0.25)",opacity:"0",transition:"opacity .2s ease, transform .2s ease"}),t.textContent=n,document.body.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="translateX(-50%) translateY(0)"}),window.setTimeout(()=>{t.style.opacity="0",t.style.transform="translateX(-50%) translateY(-10px)",window.setTimeout(()=>t.remove(),250)},e)}let ze=null;function nr(){ze||(ze=new cv({onStart:n=>{tr=n.skinCanvas;try{const t=location.hostname==="localhost"||location.hostname==="127.0.0.1"?"ws://localhost:8080":location.origin.replace(/^http/,"ws"),s=new WebSocket(t);window.ncWs=s,s.addEventListener("open",()=>{const i=n.name||"Player";s.send(JSON.stringify({type:"join",name:i})),ye.setWebSocket(s)}),s.addEventListener("message",i=>{const r=i.data;if(typeof r=="string")try{const o=JSON.parse(r);o&&o.type==="welcome"?yn(`Server verbunden! Spieler online: ${o.totalPlayers}`):o&&o.type==="playerCount"&&yn(`Spieler online: ${o.count}`)}catch{}}),s.addEventListener("error",()=>{yn("Server-Verbindung fehlgeschlagen - Offline-Modus")})}catch{yn("Offline-Modus - Bots only")}ye.spawnPlayers(69,n)},musicManager:Vh}),window.currentMenu=ze);try{ze.show()}catch{}}(async function(){const e=navigator.userAgent||"";if(!/Android|iPhone|iPad|iPod/i.test(e)){nr();return}const s=document.createElement("div");Object.assign(s.style,{position:"fixed",inset:"0",zIndex:"200",display:"grid",placeItems:"center",background:"rgba(0,0,0,0.8)",color:"#fff"});const i=document.createElement("div");Object.assign(i.style,{padding:"20px",borderRadius:"16px",background:"rgba(8,10,28,0.9)",backdropFilter:"blur(10px)",display:"grid",placeItems:"center",gap:"12px"});const r=document.createElement("div");r.className="space-spinner";const o=document.createElement("div");o.textContent="Gleich geht´s los!",Object.assign(o.style,{font:"900 16px system-ui",letterSpacing:"0.4px"}),i.append(r,o),s.append(i),document.body.appendChild(s);try{const l=Object.values(Object.assign({}));await Promise.all(l.map(c=>new Promise(h=>{const d=new Image;d.onload=()=>h(),d.onerror=()=>h(),d.src=c})))}catch{}s.remove(),nr()})();Er(Un,async n=>{var e;if(n)try{const{fetchUserCoins:t,getUserBestMax:s}=await ie(async()=>{const{fetchUserCoins:o,getUserBestMax:a}=await Promise.resolve().then(()=>er);return{fetchUserCoins:o,getUserBestMax:a}},void 0),i=await t(n.uid),r=await s(n.uid);(e=ze==null?void 0:ze.setCoins)==null||e.call(ze,i);try{const{syncWithCloud:o}=await ie(async()=>{const{syncWithCloud:a}=await Promise.resolve().then(()=>Ds);return{syncWithCloud:a}},void 0);await o(n.uid)}catch(o){console.warn("Failed to sync XP from cloud:",o)}}catch{}});ye.onGameOver=async n=>{try{const t={skinDataUrl:(tr?tr.toDataURL("image/png"):void 0)||"",maxMass:n.maxMass,survivedSec:n.survivedSec,ts:Date.now()};Za(t);const s=Un.currentUser;Lh({...t,uid:s==null?void 0:s.uid,name:(s==null?void 0:s.displayName)||void 0});const i={maxMass:n.maxMass,survivedSec:n.survivedSec,rank:n.rank,xpBreakdown:n.xpBreakdown,timestamp:Date.now()};if(localStorage.setItem("lastMatchResults",JSON.stringify(i)),s!=null&&s.uid)try{const{getState:r,saveCloudXp:o}=await ie(async()=>{const{getState:l,saveCloudXp:c}=await Promise.resolve().then(()=>Ds);return{getState:l,saveCloudXp:c}},void 0),a=r();await o(s.uid,a)}catch(r){console.warn("Failed to save XP to cloud:",r)}}catch{}hv(n)};function Hh(){try{const n=localStorage.getItem("neoncells.coins");return n?Math.max(0,parseInt(n)):0}catch{return 0}}function $h(n){try{localStorage.setItem("neoncells.coins",String(Math.max(0,Math.floor(n))))}catch{}}function hv(n){const e=document.createElement("div");Object.assign(e.style,{position:"fixed",inset:"0",display:"grid",placeItems:"center",background:"rgba(0,0,0,0.7)",zIndex:"30",color:"#fff"});const t=document.createElement("div");Object.assign(t.style,{width:"min(520px, 92vw)",borderRadius:"18px",padding:"20px",background:"rgba(10,14,38,0.9)",backdropFilter:"blur(12px)",boxShadow:"0 20px 50px rgba(0,0,0,.6)",textAlign:"center"});const s=document.createElement("h2");s.textContent="GAME OVER",s.style.marginBottom="20px";const i=document.createElement("div");i.innerHTML=`Max Größe: <b>${n.maxMass}</b><br/>Zeit: <b>${n.survivedSec}s</b><br/>Finale Masse: <b>${n.finalMass||n.maxMass}</b>`,i.style.marginBottom="20px";const r=document.createElement("div");try{(async()=>{const{getState:y,getUiProgress:w}=await ie(async()=>{const{getState:f,getUiProgress:v}=await Promise.resolve().then(()=>Ds);return{getState:f,getUiProgress:v}},void 0),I=y(),m=w();r.innerHTML=`<br/>Level: <b>${I.level}</b> | XP: <b>${m.value}/${m.max}</b>`,r.style.marginTop="10px",r.style.fontSize="14px",r.style.opacity="0.8"})()}catch{}const o=Hh(),a=document.createElement("div");a.innerHTML=`💰 Coins: <b>${o}</b>`,a.style.margin="15px 0",a.style.fontSize="16px";const l=500,c=n.finalMass||n.maxMass;if(o>=l&&c>=100){const y=document.createElement("div");y.style.margin="20px 0",y.style.padding="15px",y.style.background="rgba(34, 197, 94, 0.1)",y.style.border="2px solid rgba(34, 197, 94, 0.3)",y.style.borderRadius="12px";const w=document.createElement("div");w.innerHTML=`🚀 <b>Wiedereinstieg möglich!</b><br/>Kosten: <b>${l} Coins</b><br/>Du startest mit <b>${c} Masse</b>`,w.style.marginBottom="15px";const I=document.createElement("button");I.textContent=`💰 WIEDEREINSTEIGEN (${l} Coins)`,I.className="btn-space",I.style.background="linear-gradient(45deg, #22c55e, #16a34a)",I.style.border="none",I.style.color="white",I.style.fontWeight="bold",I.style.padding="12px 20px",I.style.fontSize="14px",I.onclick=()=>{$h(o-l);const m=window.currentMenu;m&&m.setCoins&&m.setCoins(o-l),ye.reviveWithMass(c),e.remove();const f=document.createElement("div");f.textContent=`🚀 Wiedereinstieg erfolgreich! -${l} Coins`,f.style.cssText=`
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #22c55e, #16a34a);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: bold;
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
      `,document.body.appendChild(f),setTimeout(()=>f.remove(),3e3)},y.append(w,I),t.appendChild(y)}const d=document.createElement("div");d.style.display="flex",d.style.gap="15px",d.style.justifyContent="center",d.style.marginTop="20px";const u=document.createElement("button");u.textContent="NOCHMAL",u.className="btn-space",u.onclick=()=>{e.remove(),ye.resetRound()};const p=document.createElement("button");p.textContent="MENÜ",p.className="btn-space",p.onclick=()=>{e.remove(),nr()},d.append(u,p),t.append(s,i,r,a,d),e.append(t),document.body.appendChild(e)}const Et=document.createElement("div");Object.assign(Et.style,{position:"fixed",top:"12px",left:"12px",zIndex:"60",padding:"6px 10px",borderRadius:"12px",background:"rgba(0,0,0,0.45)",color:"#fff",font:"800 14px system-ui, sans-serif",letterSpacing:"0.2px",pointerEvents:"none"});Et.textContent="";document.body.appendChild(Et);let Wa=0;function dv(n){var e,t,s,i,r;if(!(n-Wa<200)){Wa=n;try{const o=ye.me,a=(t=(e=ye.players)==null?void 0:e.get)==null?void 0:t.call(e,o),l=Array.from(((i=(s=ye.players)==null?void 0:s.values)==null?void 0:i.call(s))||[]).filter(h=>h.alive).length;if(!o||!a||!a.alive||!l){Et.style.display="none";return}const c=((r=ye.getRank)==null?void 0:r.call(ye,o))??0;Et.style.display="block",Et.textContent=`${c}/${l}`}catch{Et.style.display="none"}}}let ja=performance.now();function zh(n){const e=n-ja;ja=n,ye.step(e,Od(),n),ye.draw(n),dv(n),requestAnimationFrame(zh)}requestAnimationFrame(zh);export{ld as F,Va as L,ie as _,Un as a,ov as b,kn as c,sv as f,sr as m,av as p,er as r};
