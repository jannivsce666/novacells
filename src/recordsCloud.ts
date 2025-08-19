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
