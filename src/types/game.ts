/**
 * Core type definitions for "TIME CITY: Echoes of Time"
 */

export type Timeline = 'past' | 'present' | 'future';

export type Ability =
  | 'time_switch'
  | 'dash'
  | 'double_jump'
  | 'time_freeze'
  | 'time_rewind'
  | 'time_dash'
  | 'timeline_clone'
  | 'time_burst';

export type TileType =
  | 'solid'
  | 'platform'
  | 'spike'
  | 'water'
  | 'laser'
  | 'bridge'
  | 'ice'
  | 'gravity_pad'
  | 'moving'
  | 'tree'
  | 'crumbling';

export interface LevelTile {
  x: number;
  y: number;
  w: number;
  h: number;
  type: TileType;
  timeline: 'all' | 'past' | 'present' | 'future' | 'past_present' | 'present_future';
  color?: string;
  label?: string;
  isTriggered?: boolean;
  crumbleTimer?: number;
  moveConfig?: {
    dx: number;
    dy: number;
    speed: number;
    range: number;
    offset?: number;
  };
}

export type EntityType =
  | 'coin'
  | 'shard'
  | 'key'
  | 'door'
  | 'switch'
  | 'push_block'
  | 'enemy'
  | 'checkpoint'
  | 'time_core_item'
  | 'health_pack'
  | 'portal'
  | 'sign';

export type EnemyType =
  | 'wild_boar'
  | 'stone_golem'
  | 'shadow_wraith'
  | 'patrol_drone'
  | 'laser_bot'
  | 'cyber_hound'
  | 'time_specter'
  | 'crystal_crawler'
  | 'ancient_guardian'
  | 'chrono_sentinel'
  | 'time_eater';

export interface LevelEntity {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: EntityType;
  timeline: 'all' | 'past' | 'present' | 'future' | 'past_present' | 'present_future';
  collected?: boolean;
  activated?: boolean;
  keyId?: string;
  doorId?: string;
  enemyType?: EnemyType;
  health?: number;
  maxHealth?: number;
  facing?: 1 | -1;
  vx?: number;
  vy?: number;
  patrolMinX?: number;
  patrolMaxX?: number;
  attackCooldown?: number;
  bossPhase?: number;
  shieldActive?: boolean;
  shieldTimeline?: Timeline;
  dialogue?: string;
  signText?: string;
}

export interface NPCData {
  id: string;
  name: string;
  title: string;
  x: number;
  y: number;
  timeline: 'all' | 'past' | 'present' | 'future';
  dialogue: string[];
  avatar: string;
  nepaliText?: string;
  action?: 'chicken_chase' | 'dancing_robot' | 'slip_ice' | 'traffic_complaint';
}

export interface LevelData {
  id: number;
  worldId: 1 | 2 | 3;
  name: string;
  subtitle: string;
  description: string;
  width: number;
  height: number;
  spawn: { x: number; y: number };
  exit: { x: number; y: number; w: number; h: number };
  allowedTimelines: Timeline[];
  initialTimeline: Timeline;
  tiles: LevelTile[];
  entities: LevelEntity[];
  npcs?: NPCData[];
  hints: [string, string, string]; // 3 tier hint
  specialType?: 'standard' | 'puzzle' | 'escape' | 'boss' | 'chase' | 'loop';
  timeLimit?: number; // seconds for speed run / escape
  bossData?: {
    name: string;
    bossType: 'ancient_guardian' | 'chrono_sentinel' | 'time_eater';
    health: number;
    maxHealth: number;
  };
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  facing: 1 | -1;
  grounded: boolean;
  jumping: boolean;
  canDoubleJump: boolean;
  dashing: boolean;
  dashTimer: number;
  dashCooldown: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  timeline: Timeline;
  isAttacking: boolean;
  attackTimer: number;
  invulnerableTimer: number;
  isTimeFreezing: boolean;
  freezeDuration: number;
  gravityInverted: boolean;
  clone?: { x: number; y: number; timeline: Timeline; timer: number };
  keys: string[];
  coinsCollectedInLevel: number;
  shardCollectedInLevel: boolean;
  checkpoint: { x: number; y: number; timeline: Timeline } | null;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type?: 'sparkle' | 'smoke' | 'time_warp' | 'crystal' | 'leaf' | 'spark' | 'snow';
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  vibration: boolean;
  graphics: 'low' | 'medium' | 'high';
  touchControls: boolean;
  buttonSize: 'normal' | 'large';
  buttonOpacity: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface SaveData {
  currentLevel: number;
  unlockedLevels: number[];
  stars: Record<number, number>;
  shards: Record<number, boolean>;
  totalCoins: number;
  unlockedAbilities: Ability[];
  achievements: Record<string, boolean>;
  timeSwitchesCount: number;
  secretsFoundCount: number;
  settings: GameSettings;
}
