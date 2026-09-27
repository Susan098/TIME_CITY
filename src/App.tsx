import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine } from './game/engine';
import { GameHUD } from './components/GameHUD';
import { MobileControls } from './components/MobileControls';
import { MainMenu } from './components/MainMenu';
import { WorldMap } from './components/WorldMap';
import { HintModal } from './components/HintModal';
import { DialogueBox } from './components/DialogueBox';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';
import { SettingsModal } from './components/SettingsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { CinematicEnding } from './components/CinematicEnding';
import { GameSettings, SaveData } from './types/game';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'WORLD_MAP' | 'ENDING'>('MENU');
  const [isPaused, setIsPaused] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  // Synchronized state from engine for React HUD rendering
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [playerState, setPlayerState] = useState(engineRef.current?.player);
  const [activeDialogue, setActiveDialogue] = useState(engineRef.current?.activeDialogue || null);
  const [levelVictory, setLevelVictory] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [saveData, setSaveData] = useState<SaveData>(() => {
    try {
      const raw = localStorage.getItem('time_city_save_v1');
      if (raw) return JSON.parse(raw);
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
      settings: {
        musicVolume: 0.6,
        sfxVolume: 0.8,
        vibration: true,
        graphics: 'high',
        touchControls: true,
        buttonSize: 'normal',
        buttonOpacity: 0.75,
      },
    };
  });

  // Initialize Game Engine on Canvas Mount
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new GameEngine(canvasRef.current);
    engineRef.current = engine;
    setSaveData(engine.saveData);
    setPlayerState({ ...engine.player });

    // Poll engine state for UI updates at 30fps
    const interval = setInterval(() => {
      if (engineRef.current) {
        setPlayerState({ ...engineRef.current.player });
        setActiveDialogue(engineRef.current.activeDialogue);
        setLevelVictory(engineRef.current.levelVictory);
        setGameOver(engineRef.current.gameOver);
        setCurrentLevelId(engineRef.current.currentLevel.id);
        setSaveData({ ...engineRef.current.saveData });
      }
    }, 33);

    return () => {
      clearInterval(interval);
      engine.stop();
    };
  }, []);

  // Keyboard Handlers for PC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (!eng || gameState !== 'PLAYING') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        eng.inputs.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        eng.inputs.right = true;
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        if (!eng.inputs.jump) eng.inputs.jumpJustPressed = true;
        eng.inputs.jump = true;
      } else if (e.key === 'Shift' || e.key === 'j' || e.key === 'J') {
        eng.inputs.dashJustPressed = true;
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'k' || e.key === 'K') {
        if (eng.saveData.unlockedAbilities.includes('time_freeze') && eng.player.energy >= 35) {
          eng.activateTimeFreeze();
        } else {
          eng.triggerAttack();
        }
      } else if (e.key === 'e' || e.key === 'E') {
        eng.triggerInteract();
      } else if (e.key === 'q' || e.key === 'Q') {
        eng.switchTimeline();
      } else if (e.key === 'h' || e.key === 'H') {
        setShowHintModal((prev) => !prev);
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (!eng) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        eng.inputs.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        eng.inputs.right = false;
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        eng.inputs.jump = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Mobile virtual inputs bridge
  const handleMobileInput = useCallback(
    (action: 'left' | 'right' | 'jump' | 'dash' | 'attack' | 'interact' | 'timeSwitch', active: boolean) => {
      const eng = engineRef.current;
      if (!eng) return;

      if (action === 'left') eng.inputs.left = active;
      else if (action === 'right') eng.inputs.right = active;
      else if (action === 'jump') {
        if (active && !eng.inputs.jump) eng.inputs.jumpJustPressed = true;
        eng.inputs.jump = active;
      } else if (action === 'dash' && active) {
        eng.inputs.dashJustPressed = true;
      } else if (action === 'attack' && active) {
        if (eng.saveData.unlockedAbilities.includes('time_freeze') && eng.player.energy >= 35) {
          eng.activateTimeFreeze();
        } else {
          eng.triggerAttack();
        }
      } else if (action === 'interact' && active) {
        eng.triggerInteract();
      } else if (action === 'timeSwitch' && active) {
        eng.switchTimeline();
      }
    },
    []
  );

  const togglePause = useCallback(() => {
    if (!engineRef.current) return;
    setIsPaused((prev) => {
      const next = !prev;
      if (engineRef.current) engineRef.current.isPaused = next;
      return next;
    });
  }, []);

  const handleStartGame = (levelId: number) => {
    if (!engineRef.current) return;
    engineRef.current.loadLevel(levelId);
    engineRef.current.start();
    setIsPaused(false);
    setShowHintModal(false);
    setGameState('PLAYING');
  };

  const handleRestartLevel = () => {
    if (!engineRef.current) return;
    engineRef.current.loadLevel(engineRef.current.currentLevel.id);
    setIsPaused(false);
  };

  const handleNextLevel = () => {
    if (!engineRef.current) return;
    if (engineRef.current.currentLevel.id === 30) {
      setGameState('ENDING');
      return;
    }
    const nextId = engineRef.current.currentLevel.id + 1;
    engineRef.current.loadLevel(nextId);
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    if (!engineRef.current) return;
    engineRef.current.saveData.settings = {
      ...engineRef.current.saveData.settings,
      ...newSettings,
    };
    engineRef.current.saveProgress();
    setSaveData({ ...engineRef.current.saveData });
  };

  const currentLevel = engineRef.current?.currentLevel;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none touch-none">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${gameState === 'PLAYING' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />

      {/* Main Menu Screen */}
      {gameState === 'MENU' && (
        <MainMenu
          saveData={saveData}
          onContinue={() => handleStartGame(saveData.currentLevel || 1)}
          onNewGame={() => {
            if (engineRef.current) {
              engineRef.current.saveData.currentLevel = 1;
              engineRef.current.saveData.unlockedLevels = [1];
              engineRef.current.saveData.stars = {};
              engineRef.current.saveData.shards = {};
              engineRef.current.saveData.totalCoins = 0;
              engineRef.current.saveProgress();
              setSaveData({ ...engineRef.current.saveData });
            }
            handleStartGame(1);
          }}
          onOpenLevelSelect={() => setGameState('WORLD_MAP')}
          onOpenAchievements={() => setShowAchievementsModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      )}

      {/* World Map & Level Select */}
      {gameState === 'WORLD_MAP' && (
        <WorldMap
          saveData={saveData}
          onSelectLevel={(id) => handleStartGame(id)}
          onBackToMenu={() => setGameState('MENU')}
        />
      )}

      {/* Active Playing View HUD & Overlays */}
      {gameState === 'PLAYING' && currentLevel && playerState && (
        <>
          <GameHUD
            player={playerState}
            levelName={currentLevel.name}
            levelId={currentLevel.id}
            worldId={currentLevel.worldId}
            allowedTimelines={currentLevel.allowedTimelines}
            escapeTimer={engineRef.current?.escapeTimer}
            smartHintNotice={engineRef.current?.smartHintNotice}
            onOpenHint={() => setShowHintModal(true)}
            onPause={togglePause}
            onSwitchTimeline={() => engineRef.current?.switchTimeline()}
          />

          {/* Virtual Mobile Joystick and Buttons */}
          {saveData.settings.touchControls && (
            <MobileControls
              onInput={handleMobileInput}
              size={saveData.settings.buttonSize}
              opacity={saveData.settings.buttonOpacity}
            />
          )}

          {/* Dialogue Box */}
          {activeDialogue && (
            <DialogueBox
              dialogue={activeDialogue}
              onAdvance={() => engineRef.current?.triggerInteract()}
            />
          )}

          {/* 3-Tier Hint Modal */}
          {showHintModal && (
            <HintModal
              levelId={currentLevel.id}
              levelName={currentLevel.name}
              hints={currentLevel.hints}
              onClose={() => setShowHintModal(false)}
            />
          )}

          {/* Pause Modal */}
          {isPaused && (
            <PauseModal
              onResume={togglePause}
              onRestart={handleRestartLevel}
              onOpenSettings={() => setShowSettingsModal(true)}
              onOpenMap={() => {
                setIsPaused(false);
                setGameState('WORLD_MAP');
              }}
              onMainMenu={() => {
                setIsPaused(false);
                setGameState('MENU');
              }}
            />
          )}

          {/* Victory Modal */}
          {levelVictory && (
            <VictoryModal
              levelId={currentLevel.id}
              levelName={currentLevel.name}
              stars={engineRef.current?.victoryStars || 1}
              coins={playerState.coinsCollectedInLevel}
              hasShard={playerState.shardCollectedInLevel}
              onNextLevel={handleNextLevel}
              onReplay={handleRestartLevel}
              onOpenMap={() => setGameState('WORLD_MAP')}
            />
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center gap-5 text-center text-slate-100">
                <div className="text-3xl">⏳</div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-display text-rose-500">
                    TIMELINE COLLAPSE
                  </h2>
                  <p className="text-xs text-slate-400">
                    The chrono resonance destabilized. Reset to retry the chamber!
                  </p>
                </div>

                <button
                  onClick={handleRestartLevel}
                  className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Cinematic Grand Finale Ending */}
      {gameState === 'ENDING' && (
        <CinematicEnding onFinish={() => setGameState('MENU')} />
      )}

      {/* Global Modals */}
      {showSettingsModal && (
        <SettingsModal
          settings={saveData.settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showAchievementsModal && (
        <AchievementsModal
          saveData={saveData}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}
    </div>
  );
}
