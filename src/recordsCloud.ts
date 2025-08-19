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
