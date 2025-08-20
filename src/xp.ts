/**
 * XP & Level system up to 100
 * Spec highlights implemented:
 * - State: level (1..100), xpCurrent (since last level-up), xpTotal (lifetime)
 * - xpNeeded(level) = round(100 * level^1.5)
 * - XP sources: participation, placement, kills, mass, time
 * - Caps: massXP <= 200 per match, timeXP <= 200 per match
 * - Anti-abuse hooks: caller decides legitimacy (no team/self/loops)
 * - Level-up logic with carry-over; stop at 100 (overflow doesn’t level further)
 * - UI helpers: value, max, label; hooks onXpGain/onLevelUp
 * - Persistence: localStorage + optional cloud sync (if integrated by caller)
 */

export type XpGainReason =
  | 'participation'
  | 'placement'
  | 'kill'
  | 'mass'
  | 'time'
  | 'bonus'
  | 'event';

export interface XpState {
  level: number;      // 1..100
  xpCurrent: number;  // XP since last level-up
  xpTotal: number;    // Lifetime XP
}

export interface XpBreakdown {
  participation: number;
  placement: number;
  kills: number;
  mass: number;
  time: number;
  total: number;
}

// --- Configurable knobs ---
const LEVEL_CAP = 100;
let XP_MULTIPLIER = 1; // e.g. weekend 1.25
export function setXpMultiplier(mult: number) {
  XP_MULTIPLIER = Math.max(0, mult || 0);
}

// --- Hooks (UI signals) ---
export type XpGainHook = (amount: number, reason: XpGainReason) => void;
export type LevelUpHook = (newLevel: number) => void;

export let onXpGain: XpGainHook = () => {};
export let onLevelUp: LevelUpHook = () => {};

export function setHooks(hooks: { onXpGain?: XpGainHook; onLevelUp?: LevelUpHook }) {
  if (hooks.onXpGain) onXpGain = hooks.onXpGain;
  if (hooks.onLevelUp) onLevelUp = hooks.onLevelUp;
}

// --- Storage keys ---
const LS_KEY = 'nc.xp.v1';

function clampLevel(lvl: number): number {
  const n = Math.floor(Number(lvl) || 1);
  return Math.min(Math.max(n, 1), LEVEL_CAP);
}

export function xpNeeded(level: number): number {
  level = clampLevel(level);
  return Math.round(100 * Math.pow(level, 1.5));
}

function safeState(s?: Partial<XpState> | null): XpState {
  const lvl = clampLevel(s?.level ?? 1);
  const cur = Math.max(0, Math.floor(Number(s?.xpCurrent ?? 0)));
  const tot = Math.max(0, Math.floor(Number(s?.xpTotal ?? 0)));
  return { level: lvl, xpCurrent: cur, xpTotal: tot };
}

function loadLocal(): XpState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { level: 1, xpCurrent: 0, xpTotal: 0 };
    return safeState(JSON.parse(raw));
  } catch {
    return { level: 1, xpCurrent: 0, xpTotal: 0 };
  }
}

function saveLocal(s: XpState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

let state: XpState = loadLocal();

export function getState(): XpState {
  return { ...state };
}

export function setState(newState: Partial<XpState>) {
  state = safeState({ ...state, ...newState });
  saveLocal(state);
}

// Choose higher state (cloud vs local): higher level wins, then higher xpTotal, then xpCurrent
export function pickHigherState(a: XpState, b: XpState): XpState {
  if (a.level !== b.level) return a.level > b.level ? a : b;
  if (a.xpTotal !== b.xpTotal) return a.xpTotal > b.xpTotal ? a : b;
  return a.xpCurrent >= b.xpCurrent ? a : b;
}

// --- Cloud sync (optional). Call these from auth handlers. ---
// To avoid hard dependency, we dynamic-import firebase only when needed.
export async function fetchCloudXp(uid: string): Promise<XpState | null> {
  try {
    const { db } = await import('./firebase');
    const { ref, get, child } = await import('firebase/database');
    const snap = await get(child(ref(db), `users/${uid}/xp`));
    if (!snap.exists()) return null;
    return safeState(snap.val());
  } catch {
    return null;
  }
}

export async function saveCloudXp(uid: string, s: XpState): Promise<void> {
  try {
    const { db } = await import('./firebase');
    const { ref, set } = await import('firebase/database');
    await set(ref(db, `users/${uid}/xp`), s);
  } catch {}
}

export async function syncWithCloud(uid: string): Promise<XpState> {
  const local = getState();
  const cloud = (await fetchCloudXp(uid)) ?? null;
  const chosen = cloud ? pickHigherState(local, cloud) : local;
  state = safeState(chosen);
  saveLocal(state);
  // Push chosen to cloud to converge
  try { await saveCloudXp(uid, state); } catch {}
  return getState();
}

// --- Add XP and perform level-ups ---
export function addXp(rawAmount: number, reason: XpGainReason): { leveledUp: number[]; state: XpState; gained: number } {
  const amount = Math.max(0, Math.floor(rawAmount * XP_MULTIPLIER));
  if (amount <= 0) return { leveledUp: [], state: getState(), gained: 0 };

  const leveled: number[] = [];
  let { level, xpCurrent, xpTotal } = state;

  xpTotal += amount;

  if (level >= LEVEL_CAP) {
    // No further level-ups; overflow doesn’t advance level
    xpCurrent += amount;
    onXpGain?.(amount, reason);
    state = { level, xpCurrent, xpTotal };
    saveLocal(state);
    return { leveledUp: [], state: getState(), gained: amount };
  }

  let remain = amount;
  while (remain > 0 && level < LEVEL_CAP) {
    const need = xpNeeded(level) - xpCurrent;
    if (remain >= need) {
      // Fill to level-up
      xpCurrent += need; // reach exactly
      remain -= need;
      // Emit gain for this segment
      onXpGain?.(need, reason);

      // Level up
      level += 1;
      xpCurrent = 0;
      leveled.push(level);
      onLevelUp?.(level);
    } else {
      xpCurrent += remain;
      onXpGain?.(remain, reason);
      remain = 0;
    }
  }

  // If we hit cap mid-flow, any remaining XP is added but no further level-ups
  if (level >= LEVEL_CAP && remain > 0) {
    xpCurrent += remain;
    onXpGain?.(remain, reason);
    remain = 0;
  }

  state = { level, xpCurrent, xpTotal };
  saveLocal(state);
  return { leveledUp: leveled, state: getState(), gained: amount };
}

// --- UI helpers ---
export function getUiProgress(): { value: number; max: number; label: string; percent: number } {
  const s = getState();
  const max = xpNeeded(s.level);
  // At level 100, value may exceed max; clamp percent for UI
  const value = s.level >= LEVEL_CAP ? Math.min(s.xpCurrent, max) : s.xpCurrent;
  const percent = Math.min(1, value / Math.max(1, max));
  return { value, max, label: `Level ${s.level}`, percent };
}

// --- Per-match tracker (for during-the-round XP) ---
export interface MatchInput {
  kills?: number;
  totalMassEaten?: number;  // total mass eaten in match
  lifetimeSec?: number;     // total seconds lived in match
  placement?: number;       // 1..N
}

export interface MatchTracker {
  // Real-time awarding during match
  kill: (opts?: { valid?: boolean }) => number;            // +15 if valid
  addMass: (deltaMass: number) => number;                  // +2 per full 100 (capped)
  addTime: (deltaSec: number) => number;                   // +10 per full minute (capped)
  // End of match awards (participation + placement). Returns breakdown and total granted here.
  finalize: (placement?: number) => XpBreakdown;
  // For UI inspection
  getBreakdown: () => XpBreakdown;
  reset: () => void;
}

export function newMatchTracker(): MatchTracker {
  let killsXP = 0;
  let massXP = 0;
  let timeXP = 0;
  let participationXP = 0;
  let placementXP = 0;

  // Internal counters
  let massEatenTotal = 0; // for floor(total/100)
  let secondsTotal = 0;   // for floor(total/60)

  const clampMass = () => { massXP = Math.min(massXP, 200); };
  const clampTime = () => { timeXP = Math.min(timeXP, 200); };

  function getBD(): XpBreakdown {
    const total = participationXP + placementXP + killsXP + massXP + timeXP;
    return { participation: participationXP, placement: placementXP, kills: killsXP, mass: massXP, time: timeXP, total };
  }

  return {
    kill: (opts) => {
      if (opts && opts.valid === false) return 0; // anti-abuse: caller filtered
      killsXP += 15;
      addXp(15, 'kill');
      return 15;
    },
    addMass: (delta) => {
      const d = Math.max(0, Math.floor(delta || 0));
      if (d <= 0) return 0;
      massEatenTotal += d;
      // Desired total from mass = floor(total/100) * 2
      const desired = Math.floor(massEatenTotal / 100) * 2;
      let grant = desired - massXP;
      if (grant <= 0) return 0;
      const before = massXP;
      massXP += grant;
      clampMass();
      grant = massXP - before;
      if (grant > 0) addXp(grant, 'mass');
      return grant;
    },
    addTime: (deltaSec) => {
      const d = Math.max(0, Math.floor(deltaSec || 0));
      if (d <= 0) return 0;
      secondsTotal += d;
      const desired = Math.floor(secondsTotal / 60) * 10;
      let grant = desired - timeXP;
      if (grant <= 0) return 0;
      const before = timeXP;
      timeXP += grant;
      clampTime();
      grant = timeXP - before;
      if (grant > 0) addXp(grant, 'time');
      return grant;
    },
    finalize: (placement) => {
      // Participation
      if (participationXP === 0) {
        participationXP = 20;
        addXp(20, 'participation');
      }
      // Placement
      placement = Math.floor(Number(placement || 0));
      let placeXP = 0;
      if (placement === 1) placeXP = 100;
      else if (placement >= 2 && placement <= 5) placeXP = 50;
      else if (placement >= 6 && placement <= 10) placeXP = 20;
      else placeXP = 0;
      if (placeXP > 0) { placementXP = placeXP; addXp(placeXP, 'placement'); }

      // Ensure caps
      clampMass();
      clampTime();
      return getBD();
    },
    getBreakdown: () => getBD(),
    reset: () => {
      killsXP = 0; massXP = 0; timeXP = 0; participationXP = 0; placementXP = 0;
      massEatenTotal = 0; secondsTotal = 0;
    }
  };
}

// Convenience calculator for match end summary if events weren’t tracked live
export function computeMatchBreakdown(input: MatchInput): XpBreakdown {
  const kills = Math.max(0, Math.floor(input.kills || 0));
  const mass = Math.max(0, Math.floor(input.totalMassEaten || 0));
  const life = Math.max(0, Math.floor(input.lifetimeSec || 0));
  const placement = Math.floor(Number(input.placement || 0));

  const participation = 20;
  const killsXP = kills * 15;
  const massXP = Math.min(200, Math.floor(mass / 100) * 2);
  const timeXP = Math.min(200, Math.floor(life / 60) * 10);
  let placementXP = 0;
  if (placement === 1) placementXP = 100;
  else if (placement >= 2 && placement <= 5) placementXP = 50;
  else if (placement >= 6 && placement <= 10) placementXP = 20;

  const total = participation + placementXP + killsXP + massXP + timeXP;
  return { participation, placement: placementXP, kills: killsXP, mass: massXP, time: timeXP, total };
}

// Apply match breakdown to XP state (use when not tracking live)
export function applyMatchBreakdown(bd: XpBreakdown) {
  if (!bd) return;
  if (bd.participation) addXp(bd.participation, 'participation');
  if (bd.placement) addXp(bd.placement, 'placement');
  if (bd.kills) addXp(bd.kills, 'kill');
  if (bd.mass) addXp(bd.mass, 'mass');
  if (bd.time) addXp(bd.time, 'time');
}

// Helper for UI reward planning (simple policy per spec)
export function getRewardsForLevel(level: number): { grantSkin: boolean; milestone?: 10 | 25 | 50 | 100 } {
  const l = clampLevel(level);
  const grantSkin = l % 5 === 0; // every 5 levels
  const milestones = [10, 25, 50, 100] as const;
  const milestone = milestones.includes(l as any) ? (l as 10 | 25 | 50 | 100) : undefined;
  return { grantSkin, milestone };
}

// UI summary helper: percentage toward next level
export function getProgressPercent(): number {
  const { value, max } = getUiProgress();
  return Math.min(1, value / Math.max(1, max));
}