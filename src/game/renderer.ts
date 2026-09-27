import { LevelData, LevelEntity, LevelTile, Particle, PlayerState, Timeline } from '../types/game';
import { isTileActiveInTimeline } from './physics';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  public cameraX = 0;
  public cameraY = 0;
  public shakeDuration = 0;
  public shakeIntensity = 0;

  // Timeline transition animation
  public transitionProgress = 1; // 0 to 1
  public transitionColor = '#f59e0b';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D context');
    this.ctx = context;
  }

  public triggerScreenShake(duration = 0.25, intensity = 6) {
    this.shakeDuration = duration;
    this.shakeIntensity = intensity;
  }

  public triggerTimelineTransition(newTimeline: Timeline) {
    this.transitionProgress = 0;
    if (newTimeline === 'past') this.transitionColor = '#f59e0b';
    else if (newTimeline === 'present') this.transitionColor = '#10b981';
    else this.transitionColor = '#06b6d4';
  }

  public render(
    level: LevelData,
    player: PlayerState,
    particles: Particle[],
    gameTime: number,
    deltaTime: number,
    graphicsQuality: 'low' | 'medium' | 'high'
  ) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Update screen shake
    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeDuration > 0) {
      this.shakeDuration -= deltaTime;
      shakeX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      shakeY = (Math.random() - 0.5) * this.shakeIntensity * 2;
    }

    // Camera follow player with smooth interpolation
    const targetCamX = player.x - width / 2 + player.vx * 15;
    const targetCamY = player.y - height / 2 + player.vy * 8;

    this.cameraX += (targetCamX - this.cameraX) * 0.12;
    this.cameraY += (targetCamY - this.cameraY) * 0.12;

    // Clamp camera to level bounds
    this.cameraX = Math.max(0, Math.min(level.width - width, this.cameraX));
    this.cameraY = Math.max(0, Math.min(level.height - height, this.cameraY));

    // Clear Screen
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(-this.cameraX + shakeX, -this.cameraY + shakeY);

    // 1. Render Dynamic Multi-Layer Parallax Background
    this.renderParallaxBackground(level.worldId, player.timeline, gameTime, graphicsQuality);

    // 2. Render Level Tiles
    this.renderTiles(level.tiles, player.timeline, gameTime);

    // 3. Render Interactive Entities & Collectibles
    this.renderEntities(level.entities, player.timeline, gameTime);

    // 4. Render NPCs
    if (level.npcs) {
      this.renderNPCs(level.npcs, player.timeline, gameTime, player);
    }

    // 5. Render Exit Portal
    this.renderExitPortal(level.exit, gameTime);

    // 6. Render Particles
    this.renderParticles(particles);

    // 7. Render Player
    this.renderPlayer(player, gameTime);

    ctx.restore();

    // 8. Render Fullscreen Timeline Transition Warp Effect
    if (this.transitionProgress < 1) {
      this.transitionProgress += deltaTime * 2.8;
      this.renderTimelineShiftEffect(width, height);
    }

    // 9. Time Freeze screen tint overlay
    if (player.isTimeFreezing) {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Freezing clock vignette
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, width - 8, height - 8);
    }
  }

  // --- PARALLAX BACKGROUNDS ---

  private renderParallaxBackground(worldId: 1 | 2 | 3, timeline: Timeline, time: number, quality: string) {
    const ctx = this.ctx;
    const viewW = this.canvas.width;
    const viewH = this.canvas.height;
    const camX = this.cameraX;

    if (worldId === 1) {
      // ===== NEPAL: VALLEY OF TIME =====
      // Sky gradient
      let skyGrad = ctx.createLinearGradient(0, 0, 0, viewH);
      if (timeline === 'past') {
        skyGrad.addColorStop(0, '#fef3c7'); // warm morning amber
        skyGrad.addColorStop(0.6, '#fed7aa');
        skyGrad.addColorStop(1, '#fde68a');
      } else if (timeline === 'present') {
        skyGrad.addColorStop(0, '#bae6fd'); // clear Himalayan blue
        skyGrad.addColorStop(0.7, '#e0f2fe');
        skyGrad.addColorStop(1, '#f8fafc');
      } else {
        skyGrad.addColorStop(0, '#1e1b4b'); // future twilight neon
        skyGrad.addColorStop(0.7, '#312e81');
        skyGrad.addColorStop(1, '#06b6d4');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(camX, 0, viewW, viewH);

      // Sun / Moon / Time Nexus in sky
      const sunX = camX + viewW * 0.75 - camX * 0.05;
      const sunY = 90;
      ctx.save();
      ctx.fillStyle = timeline === 'past' ? '#f59e0b' : timeline === 'present' ? '#fde047' : '#38bdf8';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Far Mountain Peaks (Everest / Annapurna snow ranges)
      ctx.fillStyle = timeline === 'past' ? '#9a3412' : timeline === 'present' ? '#64748b' : '#312e81';
      ctx.beginPath();
      ctx.moveTo(camX, viewH);
      const peakStep = 240;
      const mountainOffset = camX * 0.15;
      for (let x = camX - 100; x < camX + viewW + 200; x += peakStep) {
        const peakHeight = 180 + Math.sin((x + mountainOffset) * 0.005) * 60;
        ctx.lineTo(x + peakStep / 2, peakHeight);
        ctx.lineTo(x + peakStep, viewH);
      }
      ctx.closePath();
      ctx.fill();

      // Snowy white caps on peaks
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      for (let x = camX - 100; x < camX + viewW + 200; x += peakStep) {
        const peakHeight = 180 + Math.sin((x + mountainOffset) * 0.005) * 60;
        ctx.moveTo(x + peakStep / 2, peakHeight);
        ctx.lineTo(x + peakStep * 0.35, peakHeight + 45);
        ctx.lineTo(x + peakStep * 0.65, peakHeight + 45);
        ctx.closePath();
      }
      ctx.fill();

      // Mid Hills with Terrace steps
      ctx.fillStyle = timeline === 'past' ? '#78350f' : timeline === 'present' ? '#15803d' : '#1e1e38';
      ctx.beginPath();
      ctx.moveTo(camX, viewH);
      const hillOffset = camX * 0.35;
      for (let x = camX - 100; x < camX + viewW + 200; x += 160) {
        const hillY = 320 + Math.cos((x + hillOffset) * 0.008) * 45;
        ctx.lineTo(x + 80, hillY);
        ctx.lineTo(x + 160, viewH);
      }
      ctx.closePath();
      ctx.fill();

      // Fluttering Prayer Flags (5 sacred colors: blue, white, red, green, yellow)
      if (quality !== 'low') {
        const flagColors = ['#2563eb', '#f8fafc', '#dc2626', '#16a34a', '#eab308'];
        const flagStartX = camX + 40 - (camX * 0.5) % 180;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(flagStartX, 220);
        ctx.quadraticCurveTo(flagStartX + 120, 240 + Math.sin(time * 3) * 6, flagStartX + 240, 220);
        ctx.stroke();

        for (let i = 0; i < 5; i++) {
          const fx = flagStartX + 30 + i * 36;
          const fy = 225 + Math.sin(time * 3 + i) * 4;
          ctx.fillStyle = flagColors[i];
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(fx + 22, fy + 4);
          ctx.lineTo(fx + 12, fy + 26);
          ctx.closePath();
          ctx.fill();
        }
      }
    } else if (worldId === 2) {
      // ===== CHRONO METROPOLIS =====
      ctx.fillStyle = '#05070e';
      ctx.fillRect(camX, 0, viewW, viewH);

      // Neon Skyline Towers
      const towerOffset = camX * 0.2;
      for (let i = 0; i < 14; i++) {
        const tx = camX - 100 + i * 140 - (towerOffset % 140);
        const th = 260 + (i % 5) * 50;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(tx, viewH - th, 110, th);

        // Neon windows
        ctx.fillStyle = i % 2 === 0 ? '#06b6d4' : '#ec4899';
        for (let wy = viewH - th + 20; wy < viewH - 40; wy += 35) {
          ctx.fillRect(tx + 15, wy, 8, 14);
          ctx.fillRect(tx + 45, wy, 8, 14);
          ctx.fillRect(tx + 75, wy, 8, 14);
        }
      }

      // Flying Vehicles in future
      if (timeline === 'future') {
        const carX = camX + ((time * 120) % (viewW + 200)) - 100;
        const carY = 160 + Math.sin(time * 2) * 15;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(carX, carY, 44, 12);
        // Light trail
        const trailGrad = ctx.createLinearGradient(carX - 60, carY, carX, carY);
        trailGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        trailGrad.addColorStop(1, 'rgba(56, 189, 248, 0.7)');
        ctx.fillStyle = trailGrad;
        ctx.fillRect(carX - 60, carY + 3, 60, 6);
      }
    } else {
      // ===== THE LOST WORLD =====
      const cosmicGrad = ctx.createLinearGradient(0, 0, 0, viewH);
      cosmicGrad.addColorStop(0, '#090014');
      cosmicGrad.addColorStop(0.5, '#2e1065');
      cosmicGrad.addColorStop(1, '#4a044e');
      ctx.fillStyle = cosmicGrad;
      ctx.fillRect(camX, 0, viewW, viewH);

      // Starfield
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 40; s++) {
        const sx = (camX + s * 73) % viewW + camX;
        const sy = (s * 37) % (viewH * 0.7);
        const sz = (s % 3) + 1;
        ctx.globalAlpha = 0.4 + 0.6 * Math.sin(time * 2 + s);
        ctx.fillRect(sx, sy, sz, sz);
      }
      ctx.globalAlpha = 1.0;

      // Swirling Chrono-Vortex
      ctx.save();
      const vortexX = camX + viewW * 0.5;
      const vortexY = 180;
      ctx.translate(vortexX, vortexY);
      ctx.rotate(time * 0.4);
      const vGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
      vGrad.addColorStop(0, 'rgba(216, 180, 254, 0.6)');
      vGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.2)');
      vGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = vGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- TILES RENDERING ---

  private renderTiles(tiles: LevelTile[], timeline: Timeline, time: number) {
    const ctx = this.ctx;

    for (const tile of tiles) {
      if (!isTileActiveInTimeline(tile.timeline, timeline)) continue;

      if (tile.type === 'solid' || tile.type === 'moving' || tile.type === 'tree') {
        let fill = tile.color || '#475569';
        if (tile.timeline === 'past') fill = '#92400e';
        else if (tile.timeline === 'future') fill = '#0284c7';

        ctx.fillStyle = fill;
        ctx.fillRect(tile.x, tile.y, tile.w, tile.h);

        // Highlight top rim
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(tile.x, tile.y, tile.w, 3);

        // Brick/grid details on platforms
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        for (let bx = tile.x; bx < tile.x + tile.w; bx += 32) {
          ctx.beginPath();
          ctx.moveTo(bx, tile.y);
          ctx.lineTo(bx, tile.y + tile.h);
          ctx.stroke();
        }

        // Special visual for tree
        if (tile.type === 'tree') {
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(tile.x + tile.w / 2, tile.y + tile.h / 2, tile.w * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (tile.type === 'platform') {
        // One-way wood or girder
        ctx.fillStyle = '#b45309';
        ctx.fillRect(tile.x, tile.y, tile.w, tile.h);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(tile.x, tile.y, tile.w, 2);
      } else if (tile.type === 'water') {
        // Shimmering river or toxic pool
        const waterGrad = ctx.createLinearGradient(tile.x, tile.y, tile.x, tile.y + tile.h);
        waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
        waterGrad.addColorStop(1, 'rgba(3, 105, 161, 0.95)');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(tile.x, tile.y, tile.w, tile.h);

        // Wave crest
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let wx = tile.x; wx < tile.x + tile.w; wx += 20) {
          const wy = tile.y + Math.sin(time * 4 + wx * 0.1) * 3;
          if (wx === tile.x) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      } else if (tile.type === 'laser') {
        // Lethal laser beam
        const alpha = 0.7 + 0.3 * Math.sin(time * 12);
        ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
        ctx.fillRect(tile.x, tile.y, tile.w, tile.h);

        // Laser core
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(tile.x + tile.w * 0.3, tile.y, tile.w * 0.4, tile.h);
      } else if (tile.type === 'spike') {
        ctx.fillStyle = '#e11d48';
        const spikeW = 16;
        for (let sx = tile.x; sx < tile.x + tile.w; sx += spikeW) {
          ctx.beginPath();
          ctx.moveTo(sx, tile.y + tile.h);
          ctx.lineTo(sx + spikeW / 2, tile.y);
          ctx.lineTo(sx + spikeW, tile.y + tile.h);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  // --- ENTITIES & COLLECTIBLES ---

  private renderEntities(entities: LevelEntity[], timeline: Timeline, time: number) {
    const ctx = this.ctx;

    for (const ent of entities) {
      if (ent.collected) continue;
      if (!isTileActiveInTimeline(ent.timeline, timeline)) continue;

      if (ent.type === 'coin') {
        // Spinning golden coin
        const spin = Math.cos(time * 5 + ent.x);
        const cw = Math.abs(spin) * ent.w;
        ctx.save();
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(ent.x + ent.w / 2, ent.y + ent.h / 2, Math.max(2, cw / 2), ent.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      } else if (ent.type === 'shard') {
        // Floating luminescent Time Shard diamond
        const floatY = ent.y + Math.sin(time * 3 + ent.x) * 4;
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(ent.x + ent.w / 2, floatY);
        ctx.lineTo(ent.x + ent.w, floatY + ent.h / 2);
        ctx.lineTo(ent.x + ent.w / 2, floatY + ent.h);
        ctx.lineTo(ent.x, floatY + ent.h / 2);
        ctx.closePath();
        ctx.fill();

        // Shard gleam
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ent.x + ent.w / 2, floatY + ent.h / 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (ent.type === 'key') {
        // Golden Key
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(ent.x + 8, ent.y + 8, 6, 0, Math.PI * 2);
        ctx.fillRect(ent.x + 8, ent.y + 6, 14, 4);
        ctx.fillRect(ent.x + 16, ent.y + 10, 4, 4);
        ctx.fill();
        ctx.restore();
      } else if (ent.type === 'door') {
        // Locked Door
        ctx.fillStyle = '#334155';
        ctx.fillRect(ent.x, ent.y, ent.w, ent.h);
        // Keyhole
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(ent.x + ent.w / 2, ent.y + ent.h / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (ent.type === 'switch') {
        // Floor or wall switch
        ctx.fillStyle = ent.activated ? '#10b981' : '#ef4444';
        ctx.fillRect(ent.x, ent.y, ent.w, ent.h);
      } else if (ent.type === 'checkpoint') {
        // Temple lantern or beacon
        const isAct = ent.activated;
        ctx.fillStyle = isAct ? '#10b981' : '#94a3b8';
        ctx.fillRect(ent.x + 8, ent.y + 14, 12, 26);
        ctx.beginPath();
        ctx.arc(ent.x + 14, ent.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
      } else if (ent.type === 'sign') {
        // Wood sign
        ctx.fillStyle = '#92400e';
        ctx.fillRect(ent.x + 8, ent.y + 16, 6, 16);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(ent.x, ent.y, ent.w, 16);
      } else if (ent.type === 'time_core_item') {
        // Glowing ancient artifact
        const coreFloat = ent.y + Math.sin(time * 4) * 6;
        ctx.save();
        ctx.fillStyle = '#eab308';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(ent.x + ent.w / 2, coreFloat + ent.h / 2, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.fillText('⏳', ent.x + 6, coreFloat + 22);
        ctx.restore();
      } else if (ent.type === 'enemy') {
        this.renderEnemy(ent, time);
      }
    }
  }

  // --- ENEMIES & BOSSES ---

  private renderEnemy(ent: LevelEntity, time: number) {
    const ctx = this.ctx;
    const facing = ent.facing || 1;

    ctx.save();
    ctx.translate(ent.x + ent.w / 2, ent.y + ent.h / 2);
    ctx.scale(facing, 1);

    if (ent.enemyType === 'wild_boar') {
      // Wild mountain boar
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-16, -10, 32, 20); // body
      ctx.fillStyle = '#451a03';
      ctx.fillRect(10, -8, 10, 14); // snout
      // Tusk
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(16, 2);
      ctx.lineTo(22, -4);
      ctx.lineTo(16, -2);
      ctx.fill();
    } else if (ent.enemyType === 'stone_golem') {
      // Ancient Stone Golem
      ctx.fillStyle = '#475569';
      ctx.fillRect(-20, -26, 40, 52); // Stone torso
      // Glowing eye runes
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(4, -16, 8, 4);
      ctx.fillRect(-12, -16, 8, 4);
    } else if (ent.enemyType === 'patrol_drone') {
      // Hover drone
      const bob = Math.sin(time * 6) * 4;
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, bob, 14, 0, Math.PI * 2);
      ctx.fill();
      // Scan light
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, bob);
      ctx.lineTo(40, bob + 50);
      ctx.lineTo(-40, bob + 50);
      ctx.closePath();
      ctx.fill();
    } else if (ent.enemyType === 'laser_bot') {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-14, -14, 28, 28);
      ctx.fillStyle = '#fee2e2';
      ctx.fillRect(2, -6, 8, 6);
    } else if (ent.enemyType === 'ancient_guardian') {
      // WORLD 1 BOSS: Ancient Guardian
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-32, -40, 64, 80); // Giant pagoda body
      // Pagoda roof crest
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(-40, -40);
      ctx.lineTo(0, -60);
      ctx.lineTo(40, -40);
      ctx.closePath();
      ctx.fill();
      // Glowing rune heart
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (ent.enemyType === 'chrono_sentinel') {
      // WORLD 2 BOSS: Chrono Sentinel
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.strokeRect(-34, -42, 68, 84);
      ctx.fillRect(-34, -42, 68, 84);
      // Spinning holographic ring
      ctx.strokeStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, 48, time * 3, time * 3 + Math.PI);
      ctx.stroke();
    } else if (ent.enemyType === 'time_eater') {
      // WORLD 3 BOSS: The Time Eater
      ctx.fillStyle = '#1e0533';
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(0, -10, 42, 0, Math.PI * 2);
      ctx.fill();
      // Clock hand eye
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(Math.cos(time * 2) * 24, -10 + Math.sin(time * 2) * 24);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- NPCS ---

  private renderNPCs(npcs: LevelData['npcs'] = [], timeline: Timeline, time: number, player: PlayerState) {
    const ctx = this.ctx;

    for (const npc of npcs) {
      if (npc.timeline !== 'all' && npc.timeline !== timeline) continue;

      ctx.save();
      // NPC sprite
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(npc.x, npc.y - 36, 24, 36);

      // Avatar emoji / face
      ctx.font = '20px sans-serif';
      ctx.fillText(npc.avatar, npc.x + 2, npc.y - 42);

      // Name banner
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px sans-serif';
      ctx.fillText(npc.name, npc.x - 10, npc.y - 56);

      // Proximity interact bubble
      const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
      if (dist < 80) {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(npc.x - 2, npc.y - 78, 28, 18);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Talk', npc.x + 1, npc.y - 65);
      }
      ctx.restore();
    }
  }

  // --- EXIT PORTAL ---

  private renderExitPortal(exit: LevelData['exit'], time: number) {
    const ctx = this.ctx;
    const cx = exit.x + exit.w / 2;
    const cy = exit.y + exit.h / 2;

    ctx.save();
    // Swirling portal rings
    for (let r = 0; r < 3; r++) {
      ctx.strokeStyle = r === 0 ? '#f59e0b' : r === 1 ? '#10b981' : '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, exit.w / 2 - r * 4, exit.h / 2 - r * 6, time * (r + 1), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- PARTICLES ---

  private renderParticles(particles: Particle[]) {
    const ctx = this.ctx;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- PLAYER RENDERING ---

  private renderPlayer(player: PlayerState, time: number) {
    const ctx = this.ctx;
    ctx.save();

    // Invulnerability flash
    if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer * 15) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    if (player.gravityInverted) ctx.scale(1, -1);
    ctx.scale(player.facing, 1);

    // Dashing after-image effect
    if (player.dashing) {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.fillRect(-player.w * 0.7, -player.h / 2, player.w, player.h);
    }

    // Body (Young Adventurer)
    ctx.fillStyle = '#3b82f6'; // Adventurer jacket
    ctx.fillRect(-player.w / 2, -player.h / 2 + 10, player.w, player.h - 18);

    // Legs with running cycle
    const isMoving = Math.abs(player.vx) > 0.5 && player.grounded;
    const legSwing = isMoving ? Math.sin(time * 16) * 6 : 0;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-player.w / 2 + 2, player.h / 2 - 10, 6, 10 + legSwing);
    ctx.fillRect(player.w / 2 - 8, player.h / 2 - 10, 6, 10 - legSwing);

    // Head
    ctx.fillStyle = '#fed7aa'; // skin
    ctx.fillRect(-player.w / 2 + 3, -player.h / 2, player.w - 6, 12);

    // Hair
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-player.w / 2 + 2, -player.h / 2 - 3, player.w - 4, 6);

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(player.w / 2 - 6, -player.h / 2 + 4, 3, 3);

    // Flowing Scarf
    const scarfWave = Math.sin(time * 10) * 4;
    ctx.fillStyle = player.timeline === 'past' ? '#f59e0b' : player.timeline === 'present' ? '#10b981' : '#06b6d4';
    ctx.fillRect(-player.w / 2 - 8, -player.h / 2 + 8 + scarfWave, 8, 4);

    // TIME CORE on Gauntlet wrist!
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(player.w / 2 - 2, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Time Pulse Attack Wave
    if (player.isAttacking) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.w / 2 + 12, 0, 24, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- TIMELINE SHIFT FULLSCREEN DISTORTION ---

  private renderTimelineShiftEffect(width: number, height: number) {
    const ctx = this.ctx;
    const progress = this.transitionProgress; // 0 to 1
    const radius = progress * Math.hypot(width, height);

    ctx.save();
    ctx.strokeStyle = this.transitionColor;
    ctx.lineWidth = 14 * (1 - progress);
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(${this.transitionColor === '#f59e0b' ? '245, 158, 11' : this.transitionColor === '#10b981' ? '16, 185, 129' : '6, 182, 212'}, ${0.25 * (1 - progress)})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
