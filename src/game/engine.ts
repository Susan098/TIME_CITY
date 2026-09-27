import { soundManager } from '../audio/soundManager';
import { Achievement, GameSettings, LevelData, LevelEntity, Particle, PlayerState, SaveData, Timeline } from '../types/game';
import { getLevelById, LEVELS } from './levels';
import { checkAABB, isTileActiveInTimeline, updateMovingTiles, updateParticles, updatePlayerPhysics } from './physics';
import { GameRenderer } from './renderer';

const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.6,
  sfxVolume: 0.8,
  vibration: true,
  graphics: 'high',
  touchControls: true,
  buttonSize: 'normal',
  buttonOpacity: 0.75,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'First Step', description: 'Complete Level 1 in Patan village.', icon: '👣', unlocked: false },
  { id: 'time_traveler', title: 'Time Traveler', description: 'Switch timelines 50 times.', icon: '⏳', unlocked: false, progress: 0, maxProgress: 50 },
  { id: 'explorer', title: 'Valley Explorer', description: 'Find 10 hidden secrets and Time Shards.', icon: '🧭', unlocked: false, progress: 0, maxProgress: 10 },
  { id: 'mountain_master', title: 'Mountain Master', description: 'Defeat The Ancient Guardian in World 1.', icon: '🏔️', unlocked: false },
  { id: 'future_citizen', title: 'Future Citizen', description: 'Overcome Chrono Sentinel in World 2.', icon: '🏙️', unlocked: false },
  { id: 'lost_world', title: 'Lost in Eternity', description: 'Enter the surreal depths of World 3.', icon: '🌌', unlocked: false },
  { id: 'secret_hunter', title: 'Secret Hunter', description: 'Collect 15 Time Shards across all worlds.', icon: '💎', unlocked: false, progress: 0, maxProgress: 15 },
  { id: 'time_master', title: 'Time Master', description: 'Defeat The Time Eater and restore reality!', icon: '👑', unlocked: false },
];

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public renderer: GameRenderer;

  public currentLevel: LevelData;
  public player: PlayerState;
  public particles: Particle[] = [];
  public gameTime = 0;
  public escapeTimer = 0;

  // Input states
  public inputs = {
    left: false,
    right: false,
    jump: false,
    jumpJustPressed: false,
    dashJustPressed: false,
    attackJustPressed: false,
    interactJustPressed: false,
    timeSwitchJustPressed: false,
  };

  // Game UI & Interaction state
  public isPaused = false;
  public activeDialogue: { name: string; title: string; avatar: string; lines: string[]; currentLine: number } | null = null;
  public levelVictory = false;
  public victoryStars = 1;
  public gameOver = false;
  public smartHintNotice = false;
  public timeInLevel = 0;
  public deathsInLevel = 0;

  // Save data
  public saveData: SaveData;

  private animationFrameId: number | null = null;
  private lastTimestamp = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new GameRenderer(canvas);
    this.saveData = this.loadSaveData();

    // Sound configuration
    soundManager.setVolumes(this.saveData.settings.musicVolume, this.saveData.settings.sfxVolume);
    soundManager.setVibration(this.saveData.settings.vibration);

    this.currentLevel = getLevelById(this.saveData.currentLevel || 1);
    this.player = this.createInitialPlayerState(this.currentLevel);

    // Setup window resize
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  public handleResize = () => {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth || 960;
      this.canvas.height = parent.clientHeight || 540;
    }
  };

  public loadSaveData(): SaveData {
    try {
      const raw = localStorage.getItem('time_city_save_v1');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fallback
    }

    return {
      currentLevel: 1,
      unlockedLevels: [1],
      stars: {},
      shards: {},
      totalCoins: 0,
      unlockedAbilities: ['time_switch'],
      achievements: {},
      timeSwitchesCount: 0,
      secretsFoundCount: 0,
      settings: DEFAULT_SETTINGS,
    };
  }

  public saveProgress() {
    try {
      localStorage.setItem('time_city_save_v1', JSON.stringify(this.saveData));
    } catch {
      // Handle storage quotas
    }
  }

  public checkAchievements() {
    let changed = false;

    // Time traveler (50 switches)
    if (this.saveData.timeSwitchesCount >= 50 && !this.saveData.achievements['time_traveler']) {
      this.saveData.achievements['time_traveler'] = true;
      changed = true;
    }

    // Secret hunter
    const shardCount = Object.values(this.saveData.shards).filter(Boolean).length;
    if (shardCount >= 15 && !this.saveData.achievements['secret_hunter']) {
      this.saveData.achievements['secret_hunter'] = true;
      changed = true;
    }

    if (changed) this.saveProgress();
  }

  private createInitialPlayerState(level: LevelData): PlayerState {
    const abilities = [...this.saveData.unlockedAbilities];

    // Gradual unlocks based on level
    if (level.id >= 6 && !abilities.includes('dash')) abilities.push('dash');
    if (level.id >= 14 && !abilities.includes('double_jump')) abilities.push('double_jump');
    if (level.id >= 17 && !abilities.includes('time_freeze')) abilities.push('time_freeze');
    if (level.id >= 22 && !abilities.includes('time_dash')) abilities.push('time_dash');
    if (level.id >= 25 && !abilities.includes('timeline_clone')) abilities.push('timeline_clone');

    return {
      x: level.spawn.x,
      y: level.spawn.y,
      vx: 0,
      vy: 0,
      w: 24,
      h: 38,
      facing: 1,
      grounded: true,
      jumping: false,
      canDoubleJump: abilities.includes('double_jump'),
      dashing: false,
      dashTimer: 0,
      dashCooldown: 0,
      health: 3,
      maxHealth: 3,
      energy: 100,
      maxEnergy: 100,
      timeline: level.initialTimeline,
      isAttacking: false,
      attackTimer: 0,
      invulnerableTimer: 0,
      isTimeFreezing: false,
      freezeDuration: 0,
      gravityInverted: false,
      keys: [],
      coinsCollectedInLevel: 0,
      shardCollectedInLevel: false,
      checkpoint: null,
    };
  }

  public loadLevel(levelId: number) {
    this.currentLevel = getLevelById(levelId);
    this.player = this.createInitialPlayerState(this.currentLevel);
    this.particles = [];
    this.activeDialogue = null;
    this.levelVictory = false;
    this.gameOver = false;
    this.smartHintNotice = false;
    this.timeInLevel = 0;
    this.deathsInLevel = 0;
    this.escapeTimer = this.currentLevel.timeLimit || 0;

    // Reset entity states
    this.currentLevel.entities.forEach(e => {
      e.collected = false;
      e.activated = false;
      if (e.maxHealth) e.health = e.maxHealth;
    });

    // Start background music
    if (this.currentLevel.specialType === 'boss') {
      soundManager.playMusic('boss');
    } else {
      soundManager.playMusic(this.currentLevel.worldId);
    }
  }

  // --- CONTROLS ---

  public switchTimeline() {
    const allowed = this.currentLevel.allowedTimelines;
    if (allowed.length <= 1) return;

    const currentIdx = allowed.indexOf(this.player.timeline);
    const nextTimeline = allowed[(currentIdx + 1) % allowed.length];

    this.player.timeline = nextTimeline;
    this.saveData.timeSwitchesCount = (this.saveData.timeSwitchesCount || 0) + 1;
    this.checkAchievements();

    soundManager.playTimeSwitch();
    this.renderer.triggerTimelineTransition(nextTimeline);

    // Gravity inverted in future on level 24
    if (this.currentLevel.id === 24 && nextTimeline === 'future') {
      this.player.gravityInverted = true;
    } else {
      this.player.gravityInverted = false;
    }

    // Spawn timeline particles
    const color = nextTimeline === 'past' ? '#f59e0b' : nextTimeline === 'present' ? '#10b981' : '#06b6d4';
    for (let i = 0; i < 18; i++) {
      this.particles.push({
        x: this.player.x + this.player.w / 2,
        y: this.player.y + this.player.h / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.6,
      });
    }

    // Ensure player is not trapped inside a solid tile in new timeline
    this.resolveTileOverlapAfterTimelineSwitch();
  }

  private resolveTileOverlapAfterTimelineSwitch() {
    const activeTiles = this.currentLevel.tiles.filter(t => isTileActiveInTimeline(t.timeline, this.player.timeline));
    const pBox = { x: this.player.x, y: this.player.y, w: this.player.w, h: this.player.h };

    for (const tile of activeTiles) {
      if (tile.type === 'solid' && checkAABB(pBox, tile)) {
        // Gently push player upwards onto the tile surface
        this.player.y = tile.y - this.player.h;
        this.player.vy = 0;
        break;
      }
    }
  }

  public activateTimeFreeze() {
    if (!this.saveData.unlockedAbilities.includes('time_freeze')) return;
    if (this.player.energy < 35 || this.player.isTimeFreezing) return;

    this.player.energy -= 35;
    this.player.isTimeFreezing = true;
    this.player.freezeDuration = 3.5;
    soundManager.playFreeze();

    // Freeze particles
    for (let i = 0; i < 24; i++) {
      this.particles.push({
        x: this.player.x + (Math.random() - 0.5) * 100,
        y: this.player.y + (Math.random() - 0.5) * 100,
        vx: 0,
        vy: -1,
        size: 3,
        color: '#38bdf8',
        alpha: 1,
        life: 0,
        maxLife: 1.2,
      });
    }
  }

  public triggerAttack() {
    if (this.player.isAttacking) return;
    this.player.isAttacking = true;
    this.player.attackTimer = 0.22;
    soundManager.playAttack();

    // Check hit against nearby enemies
    const attackBox = {
      x: this.player.facing === 1 ? this.player.x : this.player.x - 32,
      y: this.player.y - 10,
      w: this.player.w + 32,
      h: this.player.h + 20,
    };

    for (const ent of this.currentLevel.entities) {
      if (ent.type === 'enemy' && isTileActiveInTimeline(ent.timeline, this.player.timeline)) {
        if (checkAABB(attackBox, ent)) {
          this.damageEnemy(ent, 1);
        }
      }
    }
  }

  public triggerInteract() {
    // If dialogue active, proceed to next line
    if (this.activeDialogue) {
      this.activeDialogue.currentLine++;
      if (this.activeDialogue.currentLine >= this.activeDialogue.lines.length) {
        this.activeDialogue = null;
      }
      return;
    }

    // Check nearby NPCs
    if (this.currentLevel.npcs) {
      for (const npc of this.currentLevel.npcs) {
        if (npc.timeline === 'all' || npc.timeline === this.player.timeline) {
          const dist = Math.hypot(this.player.x - npc.x, this.player.y - npc.y);
          if (dist < 80) {
            this.activeDialogue = {
              name: npc.name,
              title: npc.title,
              avatar: npc.avatar,
              lines: npc.dialogue,
              currentLine: 0,
            };
            return;
          }
        }
      }
    }

    // Check signs
    for (const ent of this.currentLevel.entities) {
      if (ent.type === 'sign' && ent.signText) {
        const dist = Math.hypot(this.player.x - ent.x, this.player.y - ent.y);
        if (dist < 70) {
          this.activeDialogue = {
            name: 'Signboard',
            title: 'Notice',
            avatar: '📜',
            lines: [ent.signText],
            currentLine: 0,
          };
          return;
        }
      }
    }
  }

  // --- MAIN LOOP ---

  public start() {
    if (this.animationFrameId !== null) return;
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    soundManager.stopMusic();
  }

  private loop = (timestamp: number) => {
    const rawDelta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    const deltaTime = Math.min(rawDelta, 0.05); // prevent delta spikes

    if (!this.isPaused && !this.levelVictory && !this.gameOver) {
      this.update(deltaTime);
    }

    // Render game
    this.renderer.render(
      this.currentLevel,
      this.player,
      this.particles,
      this.gameTime,
      deltaTime,
      this.saveData.settings.graphics
    );

    // Reset single-frame inputs
    this.inputs.jumpJustPressed = false;
    this.inputs.dashJustPressed = false;
    this.inputs.attackJustPressed = false;
    this.inputs.interactJustPressed = false;
    this.inputs.timeSwitchJustPressed = false;

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number) {
    this.gameTime += deltaTime;
    this.timeInLevel += deltaTime;

    // Smart Hint Detection (45s elapsed in puzzle)
    if (this.timeInLevel > 45 && !this.smartHintNotice) {
      this.smartHintNotice = true;
    }

    // Escape countdown timer
    if (this.currentLevel.specialType === 'escape' && this.escapeTimer > 0) {
      this.escapeTimer -= deltaTime;
      if (this.escapeTimer <= 0) {
        this.killPlayer();
        return;
      }
    }

    // Handle Time Freeze duration
    if (this.player.isTimeFreezing) {
      this.player.freezeDuration -= deltaTime;
      if (this.player.freezeDuration <= 0) {
        this.player.isTimeFreezing = false;
      }
    }

    // Update moving platforms (stopped if time is frozen)
    updateMovingTiles(this.currentLevel.tiles, this.gameTime, this.player.isTimeFreezing);

    // Update player physics
    updatePlayerPhysics(
      this.player,
      this.inputs,
      this.currentLevel.tiles,
      deltaTime,
      this.saveData.unlockedAbilities,
      this.player.isTimeFreezing
    );

    // Update particles
    this.particles = updateParticles(this.particles, deltaTime);

    // Check hazard tiles (water, spikes, lasers)
    this.checkHazards();

    // Check entity interactions (coins, keys, exits, enemies)
    this.updateEntities(deltaTime);

    // Boss fight logic
    if (this.currentLevel.specialType === 'boss') {
      this.updateBoss(deltaTime);
    }

    // Check exit portal
    if (checkAABB(this.player, this.currentLevel.exit)) {
      this.completeLevel();
    }

    // Bottom pit death
    if (this.player.y > this.currentLevel.height + 50) {
      this.killPlayer();
    }
  }

  private checkHazards() {
    const activeTiles = this.currentLevel.tiles.filter(t => isTileActiveInTimeline(t.timeline, this.player.timeline));
    for (const tile of activeTiles) {
      if (tile.type === 'spike' || tile.type === 'water' || tile.type === 'laser') {
        if (checkAABB(this.player, tile)) {
          this.damagePlayer(1);
          break;
        }
      }
    }
  }

  private updateEntities(deltaTime: number) {
    for (const ent of this.currentLevel.entities) {
      if (ent.collected) continue;
      if (!isTileActiveInTimeline(ent.timeline, this.player.timeline)) continue;

      if (ent.type === 'coin') {
        if (checkAABB(this.player, ent)) {
          ent.collected = true;
          this.player.coinsCollectedInLevel++;
          this.saveData.totalCoins++;
          soundManager.playCoin();

          // Sparkle particles
          for (let p = 0; p < 6; p++) {
            this.particles.push({
              x: ent.x + ent.w / 2,
              y: ent.y + ent.h / 2,
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * 4,
              size: 2.5,
              color: '#fbbf24',
              alpha: 1,
              life: 0,
              maxLife: 0.5,
            });
          }
        }
      } else if (ent.type === 'shard') {
        if (checkAABB(this.player, ent)) {
          ent.collected = true;
          this.player.shardCollectedInLevel = true;
          this.saveData.shards[this.currentLevel.id] = true;
          this.saveData.secretsFoundCount = (this.saveData.secretsFoundCount || 0) + 1;
          this.checkAchievements();
          soundManager.playShard();
        }
      } else if (ent.type === 'key') {
        if (checkAABB(this.player, ent)) {
          ent.collected = true;
          if (ent.keyId) this.player.keys.push(ent.keyId);
          soundManager.playKey();
        }
      } else if (ent.type === 'door') {
        if (checkAABB(this.player, ent)) {
          if (ent.doorId && this.player.keys.includes(ent.doorId)) {
            ent.collected = true;
            soundManager.playKey();
          } else {
            // Block player
            if (this.player.vx > 0) this.player.x = ent.x - this.player.w;
            else if (this.player.vx < 0) this.player.x = ent.x + ent.w;
          }
        }
      } else if (ent.type === 'checkpoint') {
        if (!ent.activated && checkAABB(this.player, ent)) {
          ent.activated = true;
          this.player.checkpoint = { x: ent.x, y: ent.y, timeline: this.player.timeline };
          soundManager.playCheckpoint();
        }
      } else if (ent.type === 'time_core_item') {
        if (checkAABB(this.player, ent)) {
          ent.collected = true;
          if (!this.saveData.unlockedAbilities.includes('time_switch')) {
            this.saveData.unlockedAbilities.push('time_switch');
          }
          soundManager.playShard();
          this.activeDialogue = {
            name: 'TIME CORE',
            title: 'Artifact Acquired',
            avatar: '⏳',
            lines: [
              'You found the ancient Time Core!',
              'Press Q (or tap the ⏳ button) to switch between Past and Present timelines.',
              'Cross broken bridges and unlock forgotten paths!',
            ],
            currentLine: 0,
          };
        }
      } else if (ent.type === 'enemy') {
        this.updateEnemy(ent, deltaTime);
      }
    }
  }

  private updateEnemy(ent: LevelEntity, deltaTime: number) {
    if (this.player.isTimeFreezing) return; // Frozen

    // Patrol movement
    const minX = ent.patrolMinX ?? ent.x - 60;
    const maxX = ent.patrolMaxX ?? ent.x + 60;
    const facing = ent.facing ?? 1;
    const speed = ent.enemyType === 'wild_boar' ? 2.8 : 1.2;

    ent.x += facing * speed;
    if (ent.x <= minX) ent.facing = 1;
    else if (ent.x >= maxX) ent.facing = -1;

    // Check collision with player
    if (checkAABB(this.player, ent)) {
      // Stomp attack from above
      if (this.player.vy > 0 && this.player.y + this.player.h < ent.y + ent.h * 0.5) {
        this.damageEnemy(ent, 1);
        this.player.vy = -8; // Bounce off enemy
      } else if (this.player.dashing && this.saveData.unlockedAbilities.includes('time_dash')) {
        // Time Dash attack passes through and deals damage
        this.damageEnemy(ent, 2);
      } else {
        this.damagePlayer(1);
      }
    }
  }

  private damageEnemy(ent: LevelEntity, amount: number) {
    ent.health = (ent.health ?? 1) - amount;
    soundManager.playEnemyDefeat();
    this.renderer.triggerScreenShake(0.15, 4);

    if (ent.health <= 0) {
      ent.collected = true;
      // Enemy defeat burst
      for (let i = 0; i < 14; i++) {
        this.particles.push({
          x: ent.x + ent.w / 2,
          y: ent.y + ent.h / 2,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: 3,
          color: '#e11d48',
          alpha: 1,
          life: 0,
          maxLife: 0.5,
        });
      }
    }
  }

  private updateBoss(deltaTime: number) {
    const boss = this.currentLevel.entities.find(e => e.type === 'enemy' && (e.enemyType === 'ancient_guardian' || e.enemyType === 'chrono_sentinel' || e.enemyType === 'time_eater'));
    if (!boss || boss.collected) return;

    // Boss special behaviors
    if (boss.enemyType === 'chrono_sentinel') {
      // Switches shield timeline every 4 seconds
      if (Math.floor(this.gameTime / 4) % 3 === 0) boss.shieldTimeline = 'past';
      else if (Math.floor(this.gameTime / 4) % 3 === 1) boss.shieldTimeline = 'present';
      else boss.shieldTimeline = 'future';
    }
  }

  public damagePlayer(amount: number) {
    if (this.player.invulnerableTimer > 0) return;

    this.player.health -= amount;
    this.player.invulnerableTimer = 1.2;
    soundManager.playHit();
    this.renderer.triggerScreenShake(0.25, 7);

    if (this.player.health <= 0) {
      this.killPlayer();
    }
  }

  public killPlayer() {
    this.deathsInLevel++;
    soundManager.playGameOver();

    if (this.player.checkpoint) {
      this.player.x = this.player.checkpoint.x;
      this.player.y = this.player.checkpoint.y;
      this.player.timeline = this.player.checkpoint.timeline;
      this.player.health = this.player.maxHealth;
      this.player.vx = 0;
      this.player.vy = 0;
    } else {
      this.gameOver = true;
    }
  }

  public completeLevel() {
    if (this.levelVictory) return;
    this.levelVictory = true;
    soundManager.playVictory();

    // Calculate stars: 1 for clear, 2 for all coins, 3 for time shard
    let stars = 1;
    if (this.player.coinsCollectedInLevel >= 3) stars++;
    if (this.player.shardCollectedInLevel) stars++;
    this.victoryStars = stars;

    // Save stars
    const prevStars = this.saveData.stars[this.currentLevel.id] || 0;
    if (stars > prevStars) {
      this.saveData.stars[this.currentLevel.id] = stars;
    }

    // Unlock next level
    const nextId = this.currentLevel.id + 1;
    if (nextId <= 30 && !this.saveData.unlockedLevels.includes(nextId)) {
      this.saveData.unlockedLevels.push(nextId);
      this.saveData.currentLevel = nextId;
    }

    // Achievements check
    if (this.currentLevel.id === 1) this.saveData.achievements['first_step'] = true;
    if (this.currentLevel.id === 10) this.saveData.achievements['mountain_master'] = true;
    if (this.currentLevel.id === 20) this.saveData.achievements['future_citizen'] = true;
    if (this.currentLevel.id === 21) this.saveData.achievements['lost_world'] = true;
    if (this.currentLevel.id === 30) this.saveData.achievements['time_master'] = true;

    this.checkAchievements();
    this.saveProgress();
  }
}
