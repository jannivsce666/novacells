// Simple localStorage-based records store (top 10 by maxMass)
export type RecordItem = {
  skinDataUrl: string; // data URL of the skin at game start
  maxMass: number;
  survivedSec: number;
  ts: number; // timestamp
};

const KEY = 'neoncells.records.v1';

function loadAll(): RecordItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as RecordItem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveAll(items: RecordItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
}

export function addRecord(item: RecordItem){
  const items = loadAll();
  items.push(item);
  items.sort((a,b)=> b.maxMass - a.maxMass || b.survivedSec - a.survivedSec || b.ts - a.ts);
  const top10 = items.slice(0,10);
  saveAll(top10);
}

export function getTopRecords(): RecordItem[]{
  return loadAll();
}
