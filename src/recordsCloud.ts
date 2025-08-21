// Cloud (Firebase Realtime Database) sync for Top 10 records
import { db } from './firebase';
import { ref, get, set, child, runTransaction } from 'firebase/database';
import type { RecordItem } from './records';

export type CloudRecord = RecordItem & {
  uid?: string;           // optional user id
  name?: string;          // optional display name
};

const PATH = 'leaderboard/top10';

// Merge new record into global Top 10 transactionally. Only keeps 10 entries.
export async function pushRecordToCloud(newRec: CloudRecord): Promise<void> {
  try {
    const node = ref(db, PATH);
    await runTransaction(node, (current) => {
      let list: CloudRecord[] = [];
      if (Array.isArray(current)) list = current as CloudRecord[];
      else if (current && typeof current === 'object') list = Object.values(current as any) as CloudRecord[];

      const cleaned = list
        .filter(Boolean)
        .map(r => ({
          skinDataUrl: r.skinDataUrl || '',
          maxMass: Number(r.maxMass) || 0,
          survivedSec: Number(r.survivedSec) || 0,
          ts: Number(r.ts) || Date.now(),
          uid: (r as any).uid,
          name: (r as any).name
        } as CloudRecord));

      cleaned.push(newRec);
      cleaned.sort((a,b)=> b.maxMass - a.maxMass || b.survivedSec - a.survivedSec || b.ts - a.ts);
      const top10 = cleaned.slice(0,10);
      return top10;
    });
  } catch (e) {
    console.error('[recordsCloud] pushRecordToCloud failed', e);
  }
}

export async function fetchCloudTop10(): Promise<CloudRecord[]> {
  try {
    const snap = await get(child(ref(db), PATH));
    if (!snap.exists()) return [];
    const val = snap.val();
    const arr = Array.isArray(val) ? val : Object.values(val);
    return (arr as CloudRecord[]).sort((a,b)=> b.maxMass - a.maxMass || b.survivedSec - a.survivedSec || b.ts - a.ts).slice(0,10);
  } catch {
    return [];
  }
}

// ---- Per-user records (own Top 10) ----
function userPath(uid:string){ return `users/${uid}/records`; }

export async function pushUserRecord(uid:string, item: RecordItem): Promise<void> {
  try {
    const node = ref(db, userPath(uid));
    await runTransaction(node, (current) => {
      let list: RecordItem[] = [];
      if (Array.isArray(current)) list = current as RecordItem[];
      else if (current && typeof current === 'object') list = Object.values(current as any) as RecordItem[];

      const cleaned = list.filter(Boolean).map(r => ({
        skinDataUrl: r.skinDataUrl || '',
        maxMass: Number(r.maxMass) || 0,
        survivedSec: Number(r.survivedSec) || 0,
        ts: Number(r.ts) || Date.now()
      } as RecordItem));

      cleaned.push(item);
      cleaned.sort((a,b)=> b.maxMass - a.maxMass || b.survivedSec - a.survivedSec || b.ts - a.ts);
      return cleaned.slice(0,10);
    });
  } catch (e) {
    console.error('[recordsCloud] pushUserRecord failed', e);
  }
}

export async function fetchUserTop10(uid:string): Promise<RecordItem[]> {
  try {
    const snap = await get(child(ref(db), userPath(uid)));
    if (!snap.exists()) return [];
    const val = snap.val();
    const arr = Array.isArray(val) ? val : Object.values(val);
    return (arr as RecordItem[]).sort((a,b)=> b.maxMass - a.maxMass || b.survivedSec - a.survivedSec || b.ts - a.ts).slice(0,10);
  } catch {
    return [];
  }
}

// ---- Coins & profile helpers ----
function coinsPath(uid:string){ return `users/${uid}/coins`; }
function bestPath(uid:string){ return `users/${uid}/profile/bestMaxMass`; }
function skinsPath(uid:string){ return `users/${uid}/skins`; }

export async function fetchUserCoins(uid:string): Promise<number> {
  try {
    const snap = await get(child(ref(db), coinsPath(uid)));
    const v = snap.exists() ? snap.val() : 0;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  } catch { return 0; }
}

export async function setUserCoins(uid:string, coins:number): Promise<void> {
  try { await set(ref(db, coinsPath(uid)), Math.max(0, Math.floor(coins))); } catch {}
}

export async function getUserBestMax(uid:string): Promise<number> {
  try {
    const snap = await get(child(ref(db), bestPath(uid)));
    const v = snap.exists() ? Number(snap.val()) : 0;
    return Number.isFinite(v) ? v : 0;
  } catch { return 0; }
}

export async function setUserBestMax(uid:string, maxMass:number): Promise<void> {
  try {
    const current = await getUserBestMax(uid);
    if (maxMass > current) await set(ref(db, bestPath(uid)), Math.floor(maxMass));
  } catch {}
}

// ---- Skins ownership ----
export type OwnedSkins = Record<string, boolean>;

export async function fetchUserSkins(uid:string): Promise<OwnedSkins> {
  try {
    const snap = await get(child(ref(db), skinsPath(uid)));
    const val = snap.exists() ? snap.val() : {};
    if (val && typeof val === 'object') return val as OwnedSkins;
    return {};
  } catch { return {}; }
}

// Purchase a skin: atomically deduct coins and set skins[skinId] = true
export async function purchaseSkin(uid:string, skinId:string, cost:number): Promise<{ ok: true; coins: number } | { ok: false; reason: string; coins?: number }>{
  try {
    const userRef = ref(db, `users/${uid}`);
    let resultCoins = 0;
    const res = await runTransaction(userRef, (current) => {
      const obj = (current && typeof current === 'object') ? { ...current as any } : {} as any;
      const coins = Math.max(0, Math.floor(Number(obj.coins ?? 0)));
      if ((obj.skins && obj.skins[skinId]) === true) return current; // already owned, no change
      if (coins < cost) return; // abort
      const newCoins = coins - cost;
      obj.coins = newCoins;
      obj.skins = obj.skins || {};
      obj.skins[skinId] = true;
      return obj;
    });
    if (!res.committed){
      // detect if insufficient funds or already owned
      const after = res.snapshot?.val();
      const owned = !!(after && after.skins && after.skins[skinId]);
      const coins = Number(after?.coins ?? 0);
      return owned ? { ok:false, reason:'already-owned', coins } : { ok:false, reason:'insufficient-coins', coins };
    }
    const after = res.snapshot?.val();
    resultCoins = Number(after?.coins ?? 0);
    return { ok:true, coins: Number.isFinite(resultCoins) ? resultCoins : 0 };
  } catch (e) {
    return { ok:false, reason:'error' };
  }
}

export async function unlockRandomPremiumSkin(uid: string): Promise<{ ok: true; skinId: string; skinName: string } | { ok: false; reason: string }> {
  try {
    // List of all premium skins
    const premiumSkins = [
      { id: '1', name: 'Premium Skin 1' },
      { id: '3', name: 'Premium Skin 3' },
      { id: '4', name: 'Premium Skin 4' },
      { id: '5', name: 'Premium Skin 5' },
      { id: 'dergott', name: 'Der Gott' },
      { id: 'enkhi', name: 'Enkhi' },
      { id: 'gaia', name: 'Gaia' },
      { id: 'galaxy', name: 'Galaxy' },
      { id: 'goettin', name: 'Göttin' },
      { id: 'mihi', name: 'Mihi' },
      { id: 'zeus', name: 'Zeus' }
    ];

    const userRef = ref(db, `users/${uid}`);
    
    const res = await runTransaction(userRef, (current) => {
      const obj = (current && typeof current === 'object') ? { ...current as any } : {} as any;
      obj.skins = obj.skins || {};
      
      // Find skins not yet owned
      const unownedSkins = premiumSkins.filter(skin => !obj.skins[skin.id]);
      
      if (unownedSkins.length === 0) {
        // All premium skins already owned - return special marker
        obj._noSkinsToUnlock = true;
        return obj;
      }
      
      // Pick a random unowned skin
      const randomSkin = unownedSkins[Math.floor(Math.random() * unownedSkins.length)];
      
      // Store the selected skin info for return
      obj._unlockedSkin = randomSkin;
      
      // Unlock the skin
      obj.skins[randomSkin.id] = true;
      
      return obj;
    });

    if (!res.committed) {
      return { ok: false, reason: 'transaction-failed' };
    }

    const result = res.snapshot?.val();
    if (result?._noSkinsToUnlock) {
      return { ok: false, reason: 'all-skins-owned' };
    }

    const unlockedSkin = result?._unlockedSkin;
    if (!unlockedSkin) {
      return { ok: false, reason: 'no-skin-unlocked' };
    }

    return { ok: true, skinId: unlockedSkin.id, skinName: unlockedSkin.name };
  } catch (e) {
    console.error('Error unlocking random premium skin:', e);
    return { ok: false, reason: 'error' };
  }
}
