/**
 * Web Audio API procedural sound effects and dynamic multi-world background music
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private isMusicPlaying = false;
  private currentMusicWorld: number | 'boss' | null = null;
  private musicInterval: number | null = null;
  private musicStep = 0;

  public musicVolume = 0.6;
  public sfxVolume = 0.8;
  public vibrationEnabled = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(musicVol: number, sfxVol: number) {
    this.musicVolume = Math.max(0, Math.min(1, musicVol));
    this.sfxVolume = Math.max(0, Math.min(1, sfxVol));

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setVibration(enabled: boolean) {
    this.vibrationEnabled = enabled;
  }

  public triggerVibration(pattern: number | number[]) {
    if (!this.vibrationEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore vibration errors if not supported or blocked
      }
    }
  }

  // --- SOUND EFFECTS ---

  public playJump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);

    gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playDoubleJump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.15);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playTimeSwitch() {
    this.initContext();
    this.triggerVibration([20, 30, 40]);
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;

    // Harmonic whoosh
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(440, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.2);
    osc1.frequency.exponentialRampToValueAtTime(320, now + 0.35);

    osc2.frequency.setValueAtTime(220, now);
    osc2.frequency.exponentialRampToValueAtTime(660, now + 0.2);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.35);
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    gain.gain.linearRampToValueAtTime(0.5 * this.sfxVolume, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  public playDash() {
    this.initContext();
    this.triggerVibration(25);
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.16);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.16);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playAttack() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playFreeze() {
    this.initContext();
    this.triggerVibration([30, 40, 50]);
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18 * this.sfxVolume, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + i * 0.05);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.05);
      osc.stop(now + 0.7 + i * 0.05);
    });
  }

  public playCoin() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playShard() {
    this.initContext();
    this.triggerVibration([50, 40, 80]);
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + idx * 0.06);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + 0.9 + idx * 0.06);
    });
  }

  public playKey() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playHit() {
    this.initContext();
    this.triggerVibration([60, 40, 60]);
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playEnemyDefeat() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);

    gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  public playCheckpoint() {
    this.initContext();
    this.triggerVibration(40);
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const now = this.ctx.currentTime;
    [440, 554.37, 659.25].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + idx * 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + 0.6 + idx * 0.08);
    });
  }

  public playVictory() {
    this.initContext();
    this.triggerVibration([50, 50, 100]);
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const start = now + idx * 0.12;
      const dur = idx === notes.length - 1 ? 0.7 : 0.2;
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + dur + 0.05);
    });
  }

  public playGameOver() {
    this.initContext();
    this.triggerVibration([100, 50, 150]);
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;

    const notes = [440, 415.3, 392, 349.23];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      const start = now + idx * 0.2;
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  }

  // --- PROCEDURAL BACKGROUND MUSIC LOOP ---

  public playMusic(worldId: 1 | 2 | 3 | 'boss') {
    this.initContext();
    if (this.currentMusicWorld === worldId && this.isMusicPlaying) return;

    this.stopMusic();
    this.currentMusicWorld = worldId;
    this.isMusicPlaying = true;
    this.musicStep = 0;

    // Tempo in ms
    let tempoMs = 280;
    if (worldId === 1) tempoMs = 320; // Nepal serene folk
    else if (worldId === 2) tempoMs = 240; // Chrono electronic
    else if (worldId === 3) tempoMs = 340; // Lost world ethereal
    else if (worldId === 'boss') tempoMs = 200; // Fast battle

    this.musicInterval = window.setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.musicVolume <= 0) return;
      this.tickMusic(worldId);
      this.musicStep++;
    }, tempoMs);
  }

  private tickMusic(world: 1 | 2 | 3 | 'boss') {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    if (world === 1) {
      // Himalayan Pentatonic Flute & Sitar Chords (D, F, G, A, C)
      const fluteScale = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46];
      const bassScale = [146.83, 174.61, 196.0, 220.0];

      // Bass drone on measure start
      if (this.musicStep % 8 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.value = bassScale[(this.musicStep / 8) % bassScale.length];
        bassGain.gain.setValueAtTime(0.25 * this.musicVolume, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.start(now);
        bassOsc.stop(now + 1.9);
      }

      // Melody note
      if (Math.random() > 0.25) {
        const noteIdx = (this.musicStep * 2 + Math.floor(Math.sin(this.musicStep) * 3) + 7) % fluteScale.length;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = fluteScale[noteIdx];

        filter.type = 'lowpass';
        filter.frequency.value = 1800;

        gain.gain.setValueAtTime(0.18 * this.musicVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + 0.4);
      }
    } else if (world === 2) {
      // Cyberpunk Synth Bassline & Arp (A minor / F / G / E)
      const bassNotes = [110, 110, 87.31, 87.31, 98, 98, 82.41, 82.41]; // A, F, G, E
      const arpNotes = [440, 523.25, 659.25, 880, 659.25, 523.25, 587.33, 783.99];

      // Driving bass
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'sawtooth';
      bOsc.frequency.value = bassNotes[Math.floor(this.musicStep / 4) % bassNotes.length];
      bGain.gain.setValueAtTime(0.2 * this.musicVolume, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      bOsc.connect(bGain);
      bGain.connect(this.musicGain);
      bOsc.start(now);
      bOsc.stop(now + 0.23);

      // Hi-tech synth lead
      const lOsc = this.ctx.createOscillator();
      const lGain = this.ctx.createGain();
      lOsc.type = 'square';
      lOsc.frequency.value = arpNotes[this.musicStep % arpNotes.length];
      lGain.gain.setValueAtTime(0.08 * this.musicVolume, now);
      lGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      lOsc.connect(lGain);
      lGain.connect(this.musicGain);
      lOsc.start(now);
      lOsc.stop(now + 0.18);
    } else if (world === 3) {
      // Lost World Ethereal / Space Chimes
      const cosmicPitches = [329.63, 392.0, 493.88, 587.33, 659.25, 783.99, 987.77];
      if (this.musicStep % 2 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const p = cosmicPitches[Math.floor(Math.random() * cosmicPitches.length)];
        osc.frequency.value = p;
        gain.gain.setValueAtTime(0.12 * this.musicVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(now);
        osc.stop(now + 0.85);
      }
    } else if (world === 'boss') {
      // Intense Boss Battle
      const bossBass = [73.42, 73.42, 82.41, 73.42, 87.31, 82.41, 73.42, 110];
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'sawtooth';
      bOsc.frequency.value = bossBass[this.musicStep % bossBass.length];
      bGain.gain.setValueAtTime(0.3 * this.musicVolume, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      bOsc.connect(bGain);
      bGain.connect(this.musicGain);
      bOsc.start(now);
      bOsc.stop(now + 0.19);

      // Snare / high kick click
      if (this.musicStep % 2 === 1) {
        const nOsc = this.ctx.createOscillator();
        const nGain = this.ctx.createGain();
        nOsc.type = 'triangle';
        nOsc.frequency.setValueAtTime(380, now);
        nOsc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
        nGain.gain.setValueAtTime(0.25 * this.musicVolume, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        nOsc.connect(nGain);
        nGain.connect(this.musicGain);
        nOsc.start(now);
        nOsc.stop(now + 0.11);
      }
    }
  }

  public stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
    this.currentMusicWorld = null;
  }
}

export const soundManager = new SoundManager();
