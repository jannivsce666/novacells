// types.ts

export type Vec = { x:number; y:number };


export type Cell = {
  pos: Vec;
  vel: Vec;
  mass: number;
  radius: number;
  mergeCooldown?: number; // seconds
};

export type PlayerState = {
  id: string;
  color: string;
  name: string;
  alive: boolean;
  isBot: boolean;
  invincibleTimer: number;   // star power-up left (s)
  multishotTimer: number;    // multishot left (s)
  speedBoostTimer: number;   // temporary speed boost from speed button (s)
  magnetTimer?: number;      // NEW: magnet power-up left (s)
  lightningTimer?: number;   // NEW: lightning power-up left (s)
  lightningMassDrainTimer?: number; // NEW: timer for mass drain effect (s)
  cells: Cell[];
  // Visuals
  skinPattern?: CanvasPattern | string;
  skinCanvas?: HTMLCanvasElement;
};

export type Pellet = { pos: Vec; mass: number; vel?: Vec; life?: number };

export type Virus = {
  pos: Vec;
  radius: number;
  vel: Vec;
  ang: number;
  spin: number;
  kind: "green"|"red"|"blackhole";
  ttl?: number;
  volleyT?: number;
  fed?: number;
  _lastDir?: Vec;
  // Blackhole specific properties
  pullRadius?: number;
  spawnTime?: number;
  imploding?: boolean;
  implodeProgress?: number;
};

export type PowerUpType = "star" | "multishot" | "grow" | "magnet" | "lightning";

export type PowerUp = {
  pos: Vec;
  type: PowerUpType;
  ttl: number;
};

export type Bullet = {
  pos: Vec;
  vel: Vec;
  mass: number;
  owner: string; // player id or 'hazard'
  ttl: number;
};

export type PlayerConfig = {
  name?: string;
  color?: string;
  skinCanvas?: HTMLCanvasElement;
};

export type WorldRect = { w:number; h:number };


