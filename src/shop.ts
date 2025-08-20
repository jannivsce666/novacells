// shop.ts - standalone Shop overlay to buy skins from /premium
import { onAuthStateChanged, auth } from './firebase';
import { fetchUserCoins, fetchUserSkins, purchaseSkin } from './recordsCloud';

export class ShopOverlay {
  private root: HTMLDivElement;
  private list!: HTMLDivElement;
  private coinsEl!: HTMLSpanElement;
  private uid: string | null = null;

  constructor(){
    this.root = document.createElement('div');
    Object.assign(this.root.style, {
      position:'fixed', inset:'0', zIndex:'130', display:'grid', gridTemplateRows:'auto 1fr', background:'rgba(0,0,0,0.15)'
    } as CSSStyleDeclaration);

    const header = document.createElement('div');
    Object.assign(header.style, { display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px', padding:'12px 16px', margin:'14px auto 8px', width:'min(980px,94vw)', borderRadius:'14px', background:'rgba(8,10,28,0.72)', color:'#fff', backdropFilter:'blur(10px)', boxShadow:'0 12px 28px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,0.06)' } as CSSStyleDeclaration);
    const back = document.createElement('button'); back.textContent = '← Zurück'; Object.assign(back.style,{ padding:'10px 12px', border:'0', borderRadius:'10px', cursor:'pointer', fontWeight:'900', background:'rgba(255,255,255,0.14)', color:'#fff' } as CSSStyleDeclaration);
    back.onclick = ()=> this.close();
    const title = document.createElement('div'); title.textContent = 'Shop'; Object.assign(title.style,{ fontWeight:'900', fontSize:'20px' } as CSSStyleDeclaration);
    const coinsWrap = document.createElement('div'); Object.assign(coinsWrap.style, { display:'flex', alignItems:'center', gap:'8px', fontWeight:'900' } as CSSStyleDeclaration);
    // Coin sprite (no emoji)
    const coinIcon = (()=>{ const ns='http://www.w3.org/2000/svg'; const svg=document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('width','18'); svg.setAttribute('height','18'); const c1=document.createElementNS(ns,'circle'); c1.setAttribute('cx','12'); c1.setAttribute('cy','12'); c1.setAttribute('r','9'); c1.setAttribute('fill','#ffd54a'); const c2=document.createElementNS(ns,'circle'); c2.setAttribute('cx','12'); c2.setAttribute('cy','12'); c2.setAttribute('r','7'); c2.setAttribute('fill','#ffe17a'); const line=document.createElementNS(ns,'rect'); line.setAttribute('x','8'); line.setAttribute('y','11'); line.setAttribute('width','8'); line.setAttribute('height','2'); line.setAttribute('rx','1'); line.setAttribute('fill','#b88b09'); svg.append(c1,c2,line); return svg; })();
    const coins = document.createElement('span'); coins.textContent = '0'; this.coinsEl = coins;
    coinsWrap.append(coinIcon, coins);
    header.append(back, title, coinsWrap);

    const card = document.createElement('div');
    Object.assign(card.style, { margin:'0 auto 18px', padding:'16px', width:'min(980px,94vw)', borderRadius:'16px', background:'rgba(8,10,28,0.72)', color:'#fff', backdropFilter:'blur(10px)', boxShadow:'0 24px 48px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,0.06)' } as CSSStyleDeclaration);

    const list = document.createElement('div'); this.list = list; Object.assign(list.style, { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'14px' } as CSSStyleDeclaration);
    card.appendChild(list);

    this.root.append(header, card);
    document.body.appendChild(this.root);

    this.load();
  }

  private async load(){
    const user = auth.currentUser;
    this.uid = user?.uid || null;
    if (this.uid){
      const [coins, owned] = await Promise.all([
        fetchUserCoins(this.uid),
        fetchUserSkins(this.uid)
      ]);
      this.setCoins(coins);
      // notify listeners (e.g., StartMenu) about current balance
      try { window.dispatchEvent(new CustomEvent('coins-updated', { detail: coins })); } catch {}
      await this.populate(owned || {});
    } else {
      this.setCoins(0);
      await this.populate({});
    }
  }

  private setCoins(n:number){ this.coinsEl.textContent = String(Math.max(0, Math.floor(n))); }

  private priceFor(name: string): number {
    const base = name.split('.')[0];
    return /^\d+$/.test(base) ? 1000 : 5000;
  }

  private async populate(owned: Record<string, boolean>){
    this.list.replaceChildren();
    // Import all images from /premium using Vite glob
    let entries: string[] = [];
    try {
      const globbed = (import.meta as any).glob('../premium/*.{png,jpg,jpeg,webp,svg}', { eager:true, as:'url' }) as Record<string,string>;
      entries = Object.values(globbed);
    } catch {
      // Fallback: none
    }
    for (const url of entries){
      const file = url.split('/').pop() || '';
      const skinId = file.split('.')[0];
      const cost = this.priceFor(file);
      const card = document.createElement('div'); Object.assign(card.style, { padding:'12px', borderRadius:'12px', background:'rgba(255,255,255,0.06)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.08)' } as CSSStyleDeclaration);
      const img = new Image(); img.src = url; img.style.width = '100%'; img.style.height = '140px'; img.style.objectFit = 'contain'; img.style.display = 'block';
      const name = document.createElement('div'); name.textContent = skinId; Object.assign(name.style,{ fontWeight:'900', margin:'8px 0 6px' } as CSSStyleDeclaration);
      const buy = document.createElement('button');
      const ownedNow = !!owned[skinId];
      Object.assign(buy.style,{ width:'100%', padding:'10px 12px', borderRadius:'10px', border:'0', cursor:'pointer', fontWeight:'900' } as CSSStyleDeclaration);
      const setBuyLabel = (isOwned:boolean)=>{
        buy.replaceChildren();
        if (isOwned){
          buy.textContent = 'Besitzt';
          buy.style.background = '#10b981'; buy.style.color = '#052';
          buy.disabled = true;
        } else {
          buy.style.background = '#fbbf24'; buy.style.color = '#111';
          buy.disabled = false;
          const ns='http://www.w3.org/2000/svg';
          const svg=document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('width','16'); svg.setAttribute('height','16'); const c1=document.createElementNS(ns,'circle'); c1.setAttribute('cx','12'); c1.setAttribute('cy','12'); c1.setAttribute('r','9'); c1.setAttribute('fill','#ffd54a'); const c2=document.createElementNS(ns,'circle'); c2.setAttribute('cx','12'); c2.setAttribute('cy','12'); c2.setAttribute('r','7'); c2.setAttribute('fill','#ffe17a'); const line=document.createElementNS(ns,'rect'); line.setAttribute('x','8'); line.setAttribute('y','11'); line.setAttribute('width','8'); line.setAttribute('height','2'); line.setAttribute('rx','1'); line.setAttribute('fill','#b88b09'); svg.append(c1,c2,line);
          const label = document.createElement('span'); label.textContent = `Kaufen (${cost})`;
          label.style.marginRight = '8px';
          buy.append(label, svg);
        }
      };
      setBuyLabel(ownedNow);
      buy.onclick = async ()=>{
        if (!this.uid){ alert('Bitte mit Google anmelden.'); return; }
        buy.disabled = true;
        const res = await purchaseSkin(this.uid, skinId, cost);
        if (res.ok){
          this.setCoins(res.coins);
          try { window.dispatchEvent(new CustomEvent('coins-updated', { detail: res.coins })); } catch {}
          setBuyLabel(true);
        }
        else {
          if (res.reason === 'already-owned'){ setBuyLabel(true); }
          else if (res.reason === 'insufficient-coins'){ alert('Nicht genug Coins.'); setBuyLabel(false); }
          else { alert('Fehler beim Kauf.'); setBuyLabel(false); }
          const c = (res as any)?.coins; if (typeof c === 'number' && Number.isFinite(c)){
            this.setCoins(c);
            try { window.dispatchEvent(new CustomEvent('coins-updated', { detail: c })); } catch {}
          }
        }
      };
      card.append(img, name, buy);
      this.list.appendChild(card);
    }
  }

  show(){ this.root.style.display = 'grid'; }
  close(){ this.root.remove(); }
}
