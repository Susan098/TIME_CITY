import { LevelTile, Particle, PlayerState, Timeline } from '../types/game';

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function isTileActiveInTimeline(tileTimeline: LevelTile['timeline'], currentTimeline: Timeline): boolean {
  if (tileTimeline === 'all') return true;
  if (tileTimeline === currentTimeline) return true;
  if (tileTimeline === 'past_present' && (currentTimeline === 'past' || currentTimeline === 'present')) return true;
  if (tileTimeline === 'present_future' && (currentTimeline === 'present' || currentTimeline === 'future')) return true;
  return false;
}

export function checkAABB(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

const GRAVITY = 0.55;
const MAX_FALL_SPEED = 14;
const MOVE_SPEED = 4.2;
const JUMP_FORCE = -11.5;
const DOUBLE_JUMP_FORCE = -10.0;
const DASH_SPEED = 12.0;

export function updatePlayerPhysics(
  player: PlayerState,
  inputs: { left: boolean; right: boolean; jump: boolean; jumpJustPressed: boolean; dashJustPressed: boolean },
  tiles: LevelTile[],
  deltaTime: number,
  abilities: string[],
  isFrozen: boolean
) {
  // If time is frozen for the world, player can still move normally!

  // Decrement invulnerability
  if (player.invulnerableTimer > 0) {
    player.invulnerableTimer -= deltaTime;
  }

  // Decrement attack timer
  if (player.attackTimer > 0) {
    player.attackTimer -= deltaTime;
    if (player.attackTimer <= 0) player.isAttacking = false;
  }

  // Decrement dash timer & cooldown
  if (player.dashCooldown > 0) player.dashCooldown -= deltaTime;

  if (player.dashing) {
    player.dashTimer -= deltaTime;
    if (player.dashTimer <= 0) {
      player.dashing = false;
      player.vx = player.facing * MOVE_SPEED;
    }
  } else {
    // Horizontal Movement
    if (inputs.left && !inputs.right) {
      player.vx = -MOVE_SPEED;
      player.facing = -1;
    } else if (inputs.right && !inputs.left) {
      player.vx = MOVE_SPEED;
      player.facing = 1;
    } else {
      player.vx *= 0.75;
      if (Math.abs(player.vx) < 0.2) player.vx = 0;
    }

    // Dash activation
    if (inputs.dashJustPressed && player.dashCooldown <= 0 && (abilities.includes('dash') || abilities.includes('time_dash'))) {
      player.dashing = true;
      const isTimeDash = abilities.includes('time_dash');
      player.dashTimer = isTimeDash ? 0.28 : 0.20;
      player.dashCooldown = isTimeDash ? 0.55 : 0.70;
      player.vx = player.facing * (isTimeDash ? DASH_SPEED * 1.25 : DASH_SPEED);
      player.vy = 0;
    }

    // Gravity
    const grav = player.gravityInverted ? -GRAVITY : GRAVITY;
    player.vy += grav;
    if (Math.abs(player.vy) > MAX_FALL_SPEED) {
      player.vy = Math.sign(player.vy) * MAX_FALL_SPEED;
    }

    // Jump
    if (inputs.jumpJustPressed) {
      if (player.grounded) {
        player.vy = player.gravityInverted ? -JUMP_FORCE : JUMP_FORCE;
        player.grounded = false;
        player.jumping = true;
        player.canDoubleJump = abilities.includes('double_jump');
      } else if (player.canDoubleJump && abilities.includes('double_jump')) {
        player.vy = player.gravityInverted ? -DOUBLE_JUMP_FORCE : DOUBLE_JUMP_FORCE;
        player.canDoubleJump = false;
      }
    }

    // Variable jump height: release jump early to cut upward velocity
    if (!inputs.jump && player.jumping) {
      if (!player.gravityInverted && player.vy < -3) player.vy = -3;
      if (player.gravityInverted && player.vy > 3) player.vy = 3;
    }
  }

  // --- COLLISION RESOLUTION ---
  const activeTiles = tiles.filter(t => isTileActiveInTimeline(t.timeline, player.timeline));

  // Horizontal check
  player.x += player.vx;
  const playerBoxX = { x: player.x, y: player.y, w: player.w, h: player.h };

  for (const tile of activeTiles) {
    if (tile.type === 'solid' || tile.type === 'moving' || tile.type === 'tree') {
      if (checkAABB(playerBoxX, tile)) {
        if (player.vx > 0) {
          player.x = tile.x - player.w;
        } else if (player.vx < 0) {
          player.x = tile.x + tile.w;
        }
        player.vx = 0;
        break;
      }
    }
  }

  // Vertical check
  player.y += player.vy;
  const playerBoxY = { x: player.x, y: player.y, w: player.w, h: player.h };
  player.grounded = false;

  for (const tile of activeTiles) {
    if (tile.type === 'solid' || tile.type === 'moving' || tile.type === 'tree') {
      if (checkAABB(playerBoxY, tile)) {
        if (!player.gravityInverted) {
          if (player.vy > 0) {
            player.y = tile.y - player.h;
            player.grounded = true;
            player.jumping = false;
            player.canDoubleJump = abilities.includes('double_jump');
          } else if (player.vy < 0) {
            player.y = tile.y + tile.h;
          }
        } else {
          // Inverted gravity
          if (player.vy < 0) {
            player.y = tile.y + tile.h;
            player.grounded = true;
            player.jumping = false;
            player.canDoubleJump = abilities.includes('double_jump');
          } else if (player.vy > 0) {
            player.y = tile.y - player.h;
          }
        }
        player.vy = 0;
        break;
      }
    } else if (tile.type === 'platform') {
      // One-way jump through platform
      if (!player.gravityInverted && player.vy > 0 && player.y + player.h - player.vy <= tile.y + 4) {
        if (checkAABB(playerBoxY, tile)) {
          player.y = tile.y - player.h;
          player.vy = 0;
          player.grounded = true;
          player.jumping = false;
          player.canDoubleJump = abilities.includes('double_jump');
          break;
        }
      }
    }
  }

  // Energy regeneration (10% per second)
  if (player.energy < player.maxEnergy && !player.isTimeFreezing) {
    player.energy = Math.min(player.maxEnergy, player.energy + deltaTime * 12);
  }
}

export function updateMovingTiles(tiles: LevelTile[], time: number, isFrozen: boolean) {
  if (isFrozen) return; // Time Freeze stops moving platforms!

  for (const tile of tiles) {
    if (tile.type === 'moving' && tile.moveConfig) {
      const { dx, dy, speed } = tile.moveConfig;
      const progress = (Math.sin(time * speed) + 1) / 2; // 0 to 1
      if (!tile.moveConfig.offset) tile.moveConfig.offset = 0;

      // Update positions smoothly
      tile.x = (tile as unknown as { origX?: number }).origX ?? tile.x;
      tile.y = (tile as unknown as { origY?: number }).origY ?? tile.y;

      if ((tile as unknown as { origX?: number }).origX === undefined) {
        (tile as unknown as { origX: number }).origX = tile.x;
        (tile as unknown as { origY: number }).origY = tile.y;
      }

      const origX = (tile as unknown as { origX: number }).origX;
      const origY = (tile as unknown as { origY: number }).origY;

      tile.x = origX + dx * progress;
      tile.y = origY + dy * progress;
    }
  }
}

export function updateParticles(particles: Particle[], deltaTime: number): Particle[] {
  return particles.filter(p => {
    p.life += deltaTime;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    return p.life < p.maxLife;
  });
}
