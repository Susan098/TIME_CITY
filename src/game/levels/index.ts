import { LevelData, Timeline } from '../../types/game';

// Helper to create solid ground easily
function createPlatform(x: number, y: number, w: number, h = 24, timeline: LevelData['tiles'][0]['timeline'] = 'all', color?: string) {
  return { x, y, w, h, type: 'solid' as const, timeline, color };
}

function createOneWay(x: number, y: number, w: number, h = 12, timeline: LevelData['tiles'][0]['timeline'] = 'all', color?: string) {
  return { x, y, w, h, type: 'platform' as const, timeline, color };
}

function createMoving(x: number, y: number, w: number, h = 18, dx = 120, dy = 0, speed = 1.2, timeline: LevelData['tiles'][0]['timeline'] = 'all') {
  return {
    x, y, w, h,
    type: 'moving' as const,
    timeline,
    moveConfig: { dx, dy, speed, range: Math.max(Math.abs(dx), Math.abs(dy)) }
  };
}

// Generate the complete set of 30 levels with progressive mechanics
export const LEVELS: LevelData[] = [
  // ================= WORLD 1: NEPAL - VALLEY OF TIME (1 - 10) =================
  {
    id: 1,
    worldId: 1,
    name: "Village of Patan",
    subtitle: "The Awakening",
    description: "Welcome to Patan! Learn to move, jump, and talk to locals. Find the village elder at the gate.",
    width: 1400,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1300, y: 460, w: 48, h: 64 },
    allowedTimelines: ['present'],
    initialTimeline: 'present',
    hints: [
      "Use A/D or the Virtual Joystick to move, and Space/Jump to leap over obstacles.",
      "Collect all the shiny Time Coins scattered on the rooftops and stone paths.",
      "Walk up to the Momo stall vendor and press E (or the hand button) to chat, then head right to the golden exit portal!"
    ],
    tiles: [
      createPlatform(0, 520, 1400, 80, 'all', '#64748b'),
      createPlatform(220, 440, 120, 20, 'all', '#78350f'),
      createPlatform(420, 370, 140, 20, 'all', '#78350f'),
      createPlatform(640, 420, 160, 20, 'all', '#78350f'),
      createPlatform(880, 360, 180, 20, 'all', '#78350f'),
      createPlatform(1120, 430, 140, 20, 'all', '#78350f'),
    ],
    entities: [
      { id: 'c1', x: 250, y: 400, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 280, y: 400, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 450, y: 330, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c4', x: 700, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c5', x: 920, y: 320, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 's1', x: 960, y: 320, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'sign1', x: 160, y: 480, w: 32, h: 32, type: 'sign', timeline: 'all', signText: "चिया पसल (Chiya Stall) ahead! Jump on the wooden balconies." },
      { id: 'chk1', x: 680, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ],
    npcs: [
      {
        id: 'npc1',
        name: "Bikram Dai",
        title: "Tea Merchant",
        x: 360,
        y: 480,
        timeline: 'present',
        avatar: '☕',
        nepaliText: "नमस्ते भाइ! तातो चिया खाने हो?",
        dialogue: [
          "Namaste! The ancient shrine up ahead has been rumbling.",
          "Folks say an old artifact called the 'Time Core' is stirring. Take care on the mountain trails!"
        ]
      },
      {
        id: 'npc2',
        name: "Sunita Didi",
        title: "Momo Chef",
        x: 820,
        y: 480,
        timeline: 'present',
        avatar: '🥟',
        nepaliText: "ब्रो, यो road कहाँ जान्छ?",
        dialogue: [
          "Bro, यो road कहाँ जान्छ? Straight to the Temple of Origins!",
          "Fresh buff and veg momos for brave adventurers!"
        ]
      }
    ]
  },

  {
    id: 2,
    worldId: 1,
    name: "Shrine of Origins",
    subtitle: "The Time Core",
    description: "Discover the mysterious Time Core inside the pagoda! Switch between Past and Present to restore broken staircases.",
    width: 1500,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1400, y: 220, w: 48, h: 64 },
    allowedTimelines: ['past', 'present'],
    initialTimeline: 'present',
    hints: [
      "Pick up the glowing golden device on the pedestal to unlock Timeline Switching.",
      "The massive gap cannot be crossed in the Present because the stone steps crumbled.",
      "Press Q (or tap the ⏳ Time Core button) to travel back to the Past where the steps are intact!"
    ],
    tiles: [
      createPlatform(0, 520, 480, 80, 'all', '#64748b'),
      // In Present, bridge is broken! In Past, ancient wooden ramp is intact.
      createPlatform(480, 450, 160, 20, 'past', '#d97706'),
      createPlatform(660, 390, 160, 20, 'past', '#d97706'),
      createPlatform(840, 330, 160, 20, 'past', '#d97706'),
      // Present has fallen debris
      createPlatform(600, 540, 400, 60, 'present', '#475569'),
      createPlatform(1020, 280, 480, 320, 'all', '#64748b'),
    ],
    entities: [
      { id: 'time_core', x: 260, y: 480, w: 32, h: 32, type: 'time_core_item', timeline: 'all' },
      { id: 'c1', x: 500, y: 410, w: 20, h: 20, type: 'coin', timeline: 'past' },
      { id: 'c2', x: 680, y: 350, w: 20, h: 20, type: 'coin', timeline: 'past' },
      { id: 'c3', x: 860, y: 290, w: 20, h: 20, type: 'coin', timeline: 'past' },
      { id: 'shard2', x: 1200, y: 230, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk2', x: 1060, y: 240, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ],
    npcs: [
      {
        id: 'monk1',
        name: "Lama Tenzing",
        title: "Temple Keeper",
        x: 180,
        y: 480,
        timeline: 'past',
        avatar: '🧘',
        dialogue: [
          "The Time Core has chosen you, traveler.",
          "What is lost in your era remains whole here in antiquity. Shift when the path ahead fails you!"
        ]
      }
    ]
  },

  {
    id: 3,
    worldId: 1,
    name: "Trishuli Crossing",
    subtitle: "Raging Waters",
    description: "The modern suspension bridge was washed away by the mountain floods. Cross using the ancient wooden span.",
    width: 1600,
    height: 650,
    spawn: { x: 70, y: 480 },
    exit: { x: 1500, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present'],
    initialTimeline: 'present',
    hints: [
      "The roaring river below will sweep you away if you fall into the water!",
      "In the Present, only broken steel cables hang above the river gorge.",
      "Switch to the Past: the strong Sal-wood bridge is fully standing across the river!"
    ],
    tiles: [
      createPlatform(0, 520, 360, 130, 'all', '#64748b'),
      // Water hazards in riverbed
      { x: 360, y: 580, w: 700, h: 70, type: 'water', timeline: 'all' },
      // Past bridge
      createPlatform(360, 480, 220, 20, 'past', '#92400e'),
      createPlatform(600, 480, 220, 20, 'past', '#92400e'),
      createPlatform(840, 480, 220, 20, 'past', '#92400e'),
      // Right bank
      createPlatform(1060, 520, 540, 130, 'all', '#64748b'),
      // High pagoda platform
      createPlatform(1200, 400, 160, 20, 'all', '#b45309'),
    ],
    entities: [
      { id: 'c1', x: 420, y: 440, w: 20, h: 20, type: 'coin', timeline: 'past' },
      { id: 'c2', x: 660, y: 440, w: 20, h: 20, type: 'coin', timeline: 'past' },
      { id: 'c3', x: 900, y: 440, w: 20, h: 20, type: 'coin', timeline: 'past' },
      { id: 'shard3', x: 1270, y: 350, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk3', x: 1100, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 4,
    worldId: 1,
    name: "Terraced Hills",
    subtitle: "First Encounters",
    description: "Beware! Wild mountain boars roam the terrace slopes in the ancient past, while modern thieves lurk in the present.",
    width: 1700,
    height: 650,
    spawn: { x: 70, y: 480 },
    exit: { x: 1600, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present'],
    initialTimeline: 'present',
    hints: [
      "You can defeat enemies by jumping on top of them, or blasting them with Time Pulse (F / Attack)!",
      "If an enemy is blocking your way in one timeline, try switching to the other timeline to bypass them safely.",
      "The wild boars in the Past charge fast, but they don't exist in the Present!"
    ],
    tiles: [
      createPlatform(0, 520, 400, 130, 'all', '#475569'),
      createPlatform(440, 460, 220, 20, 'all', '#334155'),
      createPlatform(700, 400, 240, 20, 'all', '#334155'),
      createPlatform(980, 460, 260, 20, 'all', '#334155'),
      createPlatform(1280, 520, 420, 130, 'all', '#475569'),
    ],
    entities: [
      { id: 'en1', x: 500, y: 420, w: 32, h: 28, type: 'enemy', enemyType: 'wild_boar', timeline: 'past', patrolMinX: 440, patrolMaxX: 640 },
      { id: 'en2', x: 760, y: 360, w: 28, h: 32, type: 'enemy', enemyType: 'shadow_wraith', timeline: 'present', patrolMinX: 710, patrolMaxX: 920 },
      { id: 'c1', x: 480, y: 420, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 750, y: 360, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1040, y: 420, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard4', x: 1080, y: 410, w: 24, h: 24, type: 'shard', timeline: 'past' },
      { id: 'chk4', x: 1000, y: 420, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 5,
    worldId: 1,
    name: "Waterfall Cavern",
    subtitle: "Hidden Sanctuary",
    description: "A secret cave is tucked behind the sacred waterfall. Discover the first hidden Time Shard room.",
    width: 1800,
    height: 700,
    spawn: { x: 70, y: 520 },
    exit: { x: 1700, y: 500, w: 48, h: 64 },
    allowedTimelines: ['past', 'present'],
    initialTimeline: 'present',
    hints: [
      "In the Present, a thick waterfall blocks the cave entrance and the stone floor is submerged.",
      "In the Past, the water diversion canal was open, leaving the cave dry and accessible!",
      "Find the secret golden key in the upper cavern in the Past to unlock the treasure chamber."
    ],
    tiles: [
      createPlatform(0, 560, 420, 140, 'all', '#334155'),
      // Present flooded area
      { x: 420, y: 580, w: 480, h: 120, type: 'water', timeline: 'present' },
      // Past dry stepping stones
      createPlatform(460, 520, 100, 20, 'past', '#78350f'),
      createPlatform(600, 480, 100, 20, 'past', '#78350f'),
      createPlatform(740, 440, 100, 20, 'past', '#78350f'),
      // Upper secret ledge
      createPlatform(600, 320, 240, 20, 'all', '#64748b'),
      // Mid platform
      createPlatform(900, 560, 400, 140, 'all', '#334155'),
      // Vault wall and door
      createPlatform(1300, 380, 20, 180, 'all', '#475569'),
      createPlatform(1320, 560, 480, 140, 'all', '#334155'),
    ],
    entities: [
      { id: 'key1', x: 700, y: 280, w: 24, h: 24, type: 'key', keyId: 'k1', timeline: 'past' },
      { id: 'door1', x: 1300, y: 480, w: 20, h: 80, type: 'door', doorId: 'k1', timeline: 'all' },
      { id: 'shard5', x: 1480, y: 500, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'c1', x: 480, y: 480, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 620, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 760, y: 400, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'chk5', x: 950, y: 520, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 6,
    worldId: 1,
    name: "Annapurna Pass",
    subtitle: "The Gust of Wind",
    description: "The frozen mountain ridges require rapid speed. Unlock the DASH ability to leap across great precipices!",
    width: 2000,
    height: 700,
    spawn: { x: 80, y: 520 },
    exit: { x: 1900, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present'],
    initialTimeline: 'present',
    hints: [
      "Pick up the glowing wind crystal ahead to unlock DASH (Shift / Dash button)!",
      "Dash grants a burst of horizontal speed in mid-air to clear wide gaps.",
      "Switch to the Past if snowdrifts in the Present bury the high prayer flag poles."
    ],
    tiles: [
      createPlatform(0, 560, 360, 140, 'all', '#475569'),
      createPlatform(520, 520, 180, 20, 'all', '#64748b'),
      createPlatform(880, 480, 180, 20, 'all', '#64748b'),
      createPlatform(1240, 440, 180, 20, 'all', '#64748b'),
      createPlatform(1600, 520, 400, 180, 'all', '#475569'),
      // Moving cloud platform in past
      createMoving(1040, 380, 120, 16, 120, 0, 1.4, 'past'),
    ],
    entities: [
      { id: 'c1', x: 600, y: 470, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 960, y: 430, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1320, y: 390, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard6', x: 1100, y: 320, w: 24, h: 24, type: 'shard', timeline: 'past' },
      { id: 'chk6', x: 900, y: 440, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 7,
    worldId: 1,
    name: "The Whispering Oak",
    subtitle: "Seeds of Eternity",
    description: "A cliff towers high above. A tiny sapling planted in the Past becomes a gigantic climbable tree in the Present!",
    width: 1700,
    height: 700,
    spawn: { x: 70, y: 540 },
    exit: { x: 1600, y: 220, w: 48, h: 64 },
    allowedTimelines: ['past', 'present'],
    initialTimeline: 'past',
    hints: [
      "In the Past, there is a small garden with a fresh sapling.",
      "Switch to the Present: hundreds of years later, it has grown into a massive ancient banyan tree with branches you can jump on!",
      "Climb the leafy branches in the Present to reach the mountain cliff plateau."
    ],
    tiles: [
      createPlatform(0, 580, 500, 120, 'all', '#334155'),
      // Huge tree branches in Present
      createPlatform(580, 480, 140, 20, 'present', '#166534'),
      createPlatform(520, 390, 140, 20, 'present', '#166534'),
      createPlatform(640, 300, 160, 20, 'present', '#166534'),
      // High mountain plateau
      createPlatform(900, 260, 800, 440, 'all', '#475569'),
    ],
    entities: [
      { id: 'c1', x: 620, y: 440, w: 20, h: 20, type: 'coin', timeline: 'present' },
      { id: 'c2', x: 560, y: 350, w: 20, h: 20, type: 'coin', timeline: 'present' },
      { id: 'c3', x: 680, y: 260, w: 20, h: 20, type: 'coin', timeline: 'present' },
      { id: 'shard7', x: 1100, y: 210, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk7', x: 940, y: 220, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 8,
    worldId: 1,
    name: "Temple Collapse",
    subtitle: "The Timed Escape",
    description: "An earthquake shakes the ruins! Switch timelines to evade crumbling columns before time runs out!",
    width: 2200,
    height: 650,
    spawn: { x: 70, y: 480 },
    exit: { x: 2100, y: 440, w: 48, h: 64 },
    allowedTimelines: ['past', 'present'],
    initialTimeline: 'present',
    specialType: 'escape',
    timeLimit: 55,
    hints: [
      "Run right without hesitating! Keep an eye on the escape countdown timer.",
      "When a floor in the Present breaks, immediately switch to the Past to land on solid stone.",
      "Combine Dash and Jump to maintain maximum forward velocity."
    ],
    tiles: [
      createPlatform(0, 520, 320, 130, 'all', '#64748b'),
      // Crumbling sections
      createPlatform(360, 500, 160, 20, 'present', '#78350f'),
      createPlatform(560, 460, 160, 20, 'past', '#d97706'),
      createPlatform(760, 420, 160, 20, 'present', '#78350f'),
      createPlatform(960, 380, 160, 20, 'past', '#d97706'),
      createPlatform(1160, 420, 160, 20, 'present', '#78350f'),
      createPlatform(1360, 460, 160, 20, 'past', '#d97706'),
      createPlatform(1560, 500, 160, 20, 'present', '#78350f'),
      createPlatform(1760, 480, 440, 170, 'all', '#64748b'),
    ],
    entities: [
      { id: 'c1', x: 420, y: 450, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 820, y: 370, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1220, y: 370, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard8', x: 1000, y: 320, w: 24, h: 24, type: 'shard', timeline: 'all' }
    ]
  },

  {
    id: 9,
    worldId: 1,
    name: "Guardian's Ante-Chamber",
    subtitle: "Stone & Shadow",
    description: "The ancient stone golem bars your passage. Find its temporal blind spots to shatter its rocky core.",
    width: 1600,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1500, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present'],
    initialTimeline: 'present',
    specialType: 'puzzle',
    hints: [
      "The Stone Golem is invulnerable from the front in the Present.",
      "Switch to the Past: the Golem is a sleeping statue you can safely walk behind!",
      "Attack its exposed weak power crystal on its back to defeat it and open the inner gate."
    ],
    tiles: [
      createPlatform(0, 520, 1600, 80, 'all', '#334155'),
      createPlatform(420, 420, 160, 20, 'all', '#64748b'),
      createPlatform(780, 360, 160, 20, 'all', '#64748b'),
      createPlatform(1140, 420, 160, 20, 'all', '#64748b'),
      createPlatform(1380, 360, 20, 160, 'all', '#475569'), // Gate
    ],
    entities: [
      { id: 'golem1', x: 900, y: 440, w: 48, h: 56, type: 'enemy', enemyType: 'stone_golem', health: 4, maxHealth: 4, timeline: 'present', patrolMinX: 750, patrolMaxX: 1100 },
      { id: 'sw1', x: 840, y: 320, w: 24, h: 24, type: 'switch', timeline: 'past' },
      { id: 'c1', x: 460, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 1180, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard9', x: 800, y: 310, w: 24, h: 24, type: 'shard', timeline: 'past' },
      { id: 'chk9', x: 300, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 10,
    worldId: 1,
    name: "The Ancient Guardian",
    subtitle: "World 1 Climax",
    description: "BOSS BATTLE! The Ancient Guardian awakens. Shift timelines to avoid its devastating seismic slams and counterattack!",
    width: 1500,
    height: 600,
    spawn: { x: 100, y: 480 },
    exit: { x: 1420, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present'],
    initialTimeline: 'present',
    specialType: 'boss',
    bossData: {
      name: "The Ancient Guardian",
      bossType: 'ancient_guardian',
      health: 8,
      maxHealth: 8
    },
    hints: [
      "In the Present, the Guardian charges across the arena with blazing stone fists.",
      "Switch to the Past when it begins its ground slam shockwave to avoid the rocks!",
      "Strike with Time Pulse (F / Attack) or Dash-attack when the Guardian stumbles after its charge."
    ],
    tiles: [
      createPlatform(0, 520, 1500, 80, 'all', '#1e293b'),
      createPlatform(240, 400, 140, 20, 'all', '#475569'),
      createPlatform(600, 340, 180, 20, 'all', '#475569'),
      createPlatform(1020, 400, 140, 20, 'all', '#475569'),
    ],
    entities: [
      {
        id: 'boss1',
        x: 1080,
        y: 420,
        w: 64,
        h: 80,
        type: 'enemy',
        enemyType: 'ancient_guardian',
        health: 8,
        maxHealth: 8,
        timeline: 'all',
        patrolMinX: 400,
        patrolMaxX: 1300
      },
      { id: 'c1', x: 280, y: 360, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 680, y: 300, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1060, y: 360, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard10', x: 690, y: 250, w: 24, h: 24, type: 'shard', timeline: 'all' }
    ]
  },

  // ================= WORLD 2: CHRONO METROPOLIS (11 - 20) =================
  {
    id: 11,
    worldId: 2,
    name: "Cyber Neon Gates",
    subtitle: "Era of Tomorrow",
    description: "Welcome to Chrono Metropolis! The FUTURE timeline is now unlocked. Switch across all 3 eras to navigate high-tech light bridges.",
    width: 1600,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1500, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'present',
    hints: [
      "You now have access to PAST, PRESENT, and FUTURE! Press Q repeatedly to cycle through all 3.",
      "In the Future, holographic light bridges flicker on where old ruins and asphalt roads once stood.",
      "Switch to Future to cross the neon energy grid, then switch to Present to pass under power conduits."
    ],
    tiles: [
      createPlatform(0, 520, 420, 80, 'all', '#0f172a'),
      // Future holographic bridge
      createPlatform(420, 520, 360, 20, 'future', '#06b6d4'),
      // Past ancient stone
      createPlatform(480, 420, 160, 20, 'past', '#b45309'),
      createPlatform(780, 520, 300, 80, 'all', '#0f172a'),
      // High future light rail
      createPlatform(1080, 440, 260, 20, 'future', '#ec4899'),
      createPlatform(1340, 520, 260, 80, 'all', '#0f172a'),
    ],
    entities: [
      { id: 'c1', x: 500, y: 480, w: 20, h: 20, type: 'coin', timeline: 'future' },
      { id: 'c2', x: 540, y: 380, w: 20, h: 20, type: 'coin', timeline: 'past' },
      { id: 'c3', x: 1140, y: 400, w: 20, h: 20, type: 'coin', timeline: 'future' },
      { id: 'shard11', x: 1200, y: 390, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk11', x: 820, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ],
    npcs: [
      {
        id: 'cybornpc',
        name: "Unit 7-X",
        title: "City Concierge",
        x: 240,
        y: 480,
        timeline: 'future',
        avatar: '🤖',
        dialogue: [
          "BEEP-BOOP! Temporal variance detected. You are 150 years out of spec, traveler.",
          "Our city's power grid responds to chronological shifts. Watch out for patrolling security drones!"
        ]
      }
    ]
  },

  {
    id: 12,
    worldId: 2,
    name: "Rooftop Jumpers",
    subtitle: "Neon Skyline",
    description: "Leap across soaring skyscraper roofs. Use pneumatic jump pads and moving hover platforms in the Future era.",
    width: 1800,
    height: 650,
    spawn: { x: 80, y: 480 },
    exit: { x: 1720, y: 360, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    hints: [
      "The neon cyan pads launch you high into the air when stepped on.",
      "Switch to the Past if you need solid ancient watchtower stone rather than moving hover rails.",
      "Time your jumps with the hover rails to reach the penthouse billboard."
    ],
    tiles: [
      createPlatform(0, 520, 360, 130, 'all', '#1e1e38'),
      createPlatform(440, 480, 160, 20, 'present', '#312e81'),
      createMoving(640, 440, 140, 18, 140, 0, 1.5, 'future'),
      createPlatform(940, 420, 200, 20, 'all', '#1e1e38'),
      createMoving(1220, 360, 140, 18, 0, -80, 1.2, 'future'),
      createPlatform(1480, 420, 320, 230, 'all', '#1e1e38'),
    ],
    entities: [
      { id: 'c1', x: 480, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 700, y: 400, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1020, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard12', x: 1280, y: 260, w: 24, h: 24, type: 'shard', timeline: 'future' },
      { id: 'chk12', x: 980, y: 380, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 13,
    worldId: 2,
    name: "Security Sector 7",
    subtitle: "Drone Incursion",
    description: "Security drones scan the streets with deadly lasers. Strike them down with Time Pulse or evade them through time shifts!",
    width: 1700,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1600, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    hints: [
      "Patrol drones fire energy bolts if they detect you in their scan radius.",
      "Switch to the Past era where high-tech robots haven't been invented yet!",
      "Blast them with F (Time Pulse) or stomp from above to decommission them."
    ],
    tiles: [
      createPlatform(0, 520, 1700, 80, 'all', '#090d16'),
      createPlatform(340, 420, 160, 20, 'all', '#1e293b'),
      createPlatform(680, 360, 160, 20, 'all', '#1e293b'),
      createPlatform(1020, 420, 160, 20, 'all', '#1e293b'),
    ],
    entities: [
      { id: 'd1', x: 420, y: 320, w: 32, h: 28, type: 'enemy', enemyType: 'patrol_drone', timeline: 'future', patrolMinX: 340, patrolMaxX: 520 },
      { id: 'd2', x: 740, y: 260, w: 32, h: 28, type: 'enemy', enemyType: 'patrol_drone', timeline: 'future', patrolMinX: 680, patrolMaxX: 860 },
      { id: 'd3', x: 1080, y: 320, w: 32, h: 28, type: 'enemy', enemyType: 'laser_bot', timeline: 'future', patrolMinX: 1020, patrolMaxX: 1200 },
      { id: 'c1', x: 380, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 720, y: 320, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1060, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard13', x: 760, y: 220, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk13', x: 880, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 14,
    worldId: 2,
    name: "Underground Metro",
    subtitle: "High Velocity",
    description: "The subterranean maglev transit network is humming. Unlock DOUBLE JUMP to hop between high-speed train roofs!",
    width: 1900,
    height: 650,
    spawn: { x: 80, y: 480 },
    exit: { x: 1800, y: 360, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'present',
    hints: [
      "Acquire the Grav-Boots in the station lobby to unlock DOUBLE JUMP!",
      "Press Jump twice to perform an acrobatic second leap mid-air.",
      "Use double jump to reach the magnetic subway trains cruising overhead."
    ],
    tiles: [
      createPlatform(0, 520, 420, 130, 'all', '#1e293b'),
      // Maglev train platforms (moving horizontally)
      createMoving(460, 420, 180, 24, 160, 0, 2.0, 'future'),
      createMoving(820, 360, 180, 24, -140, 0, 1.8, 'future'),
      createMoving(1180, 300, 180, 24, 150, 0, 2.2, 'future'),
      createPlatform(1520, 420, 380, 230, 'all', '#1e293b'),
      // Past coal tunnels (static)
      createPlatform(600, 480, 240, 20, 'past', '#78350f'),
      createPlatform(1000, 440, 240, 20, 'past', '#78350f'),
    ],
    entities: [
      { id: 'c1', x: 520, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 880, y: 320, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1240, y: 260, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard14', x: 1260, y: 200, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk14', x: 1400, y: 380, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 15,
    worldId: 2,
    name: "Clockwork Munitions",
    subtitle: "Crushing Gears",
    description: "Massive industrial hydraulic presses crush everything in the Future. In the Past, the assembly line is completely frozen.",
    width: 1700,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1600, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    hints: [
      "The hydraulic crushers move up and down violently in the Present and Future.",
      "Switch to the Past: the factory machinery is powered down and completely static!",
      "Walk safely underneath the inactive crusher pistons while in the Past era."
    ],
    tiles: [
      createPlatform(0, 520, 1700, 80, 'all', '#0f172a'),
      // Crushers moving vertically in future
      createMoving(400, 360, 100, 80, 0, 100, 2.5, 'future'),
      createMoving(680, 360, 100, 80, 0, 100, 2.5, 'future'),
      createMoving(960, 360, 100, 80, 0, 100, 2.5, 'future'),
      // In past, pistons are stuck high up
      createPlatform(400, 240, 100, 80, 'past', '#713f12'),
      createPlatform(680, 240, 100, 80, 'past', '#713f12'),
      createPlatform(960, 240, 100, 80, 'past', '#713f12'),
    ],
    entities: [
      { id: 'c1', x: 440, y: 480, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 720, y: 480, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1000, y: 480, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard15', x: 1200, y: 460, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk15', x: 800, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 16,
    worldId: 2,
    name: "Laser Grid Alpha",
    subtitle: "Security Lockdown",
    description: "An impenetrable laser barrier seals the exit in the Future. Journey back to the Past to disconnect the primary generator terminal!",
    width: 1700,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1600, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    hints: [
      "The glowing red laser wall in the Future is lethal to touch.",
      "Switch to the Past: where the generator was constructed, there is an exposed manual breaker switch.",
      "Activate the switch in the Past, then return to the Future to find the laser grid permanently offline!"
    ],
    tiles: [
      createPlatform(0, 520, 1700, 80, 'all', '#111827'),
      // Laser beam in future (blocks exit)
      { x: 1200, y: 220, w: 16, h: 300, type: 'laser', timeline: 'future' },
      createPlatform(520, 420, 180, 20, 'all', '#1f2937'),
    ],
    entities: [
      { id: 'sw16', x: 580, y: 380, w: 24, h: 24, type: 'switch', timeline: 'past' },
      { id: 'c1', x: 400, y: 480, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 800, y: 480, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard16', x: 1400, y: 460, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk16', x: 740, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 17,
    worldId: 2,
    name: "Quantum Laboratory",
    subtitle: "Temporal Stasis",
    description: "Unlock TIME FREEZE! Halt high-frequency laser pulses and rapidly oscillating platforms in mid-air to create stable paths.",
    width: 1800,
    height: 650,
    spawn: { x: 80, y: 480 },
    exit: { x: 1700, y: 440, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    hints: [
      "Collect the Quantum Stasis Relic to unlock TIME FREEZE (Press F or Stasis icon)!",
      "Freezing time halts moving platforms and traps in place for 4 seconds.",
      "Use Time Freeze when moving platforms align horizontally to sprint across smoothly."
    ],
    tiles: [
      createPlatform(0, 520, 360, 130, 'all', '#0f172a'),
      createMoving(420, 460, 120, 18, 0, -180, 3.0, 'future'),
      createMoving(680, 320, 120, 18, 160, 0, 3.2, 'future'),
      createMoving(1040, 440, 120, 18, 0, -160, 2.8, 'future'),
      createPlatform(1360, 500, 440, 150, 'all', '#0f172a'),
    ],
    entities: [
      { id: 'c1', x: 460, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 740, y: 280, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1100, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard17', x: 800, y: 220, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk17', x: 900, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 18,
    worldId: 2,
    name: "The Paradox Vault",
    subtitle: "Causal Relocation",
    description: "An ancient stone vault in the Past requires a high-density hyper-battery found only in the Future!",
    width: 1700,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1600, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    hints: [
      "Find the Energy Core item located in the high laboratory shelf in the Future.",
      "Switch to the Past while holding the key/core.",
      "Insert it into the stone socket in the Past to unlock the eternal vault door!"
    ],
    tiles: [
      createPlatform(0, 520, 1700, 80, 'all', '#1e293b'),
      createPlatform(480, 380, 200, 20, 'future', '#0369a1'),
      createPlatform(1100, 360, 20, 160, 'all', '#475569'), // Vault Door
    ],
    entities: [
      { id: 'k18', x: 560, y: 340, w: 24, h: 24, type: 'key', keyId: 'vault_core', timeline: 'future' },
      { id: 'd18', x: 1100, y: 440, w: 20, h: 80, type: 'door', doorId: 'vault_core', timeline: 'all' },
      { id: 'c1', x: 420, y: 480, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 800, y: 480, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard18', x: 1300, y: 460, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk18', x: 860, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 19,
    worldId: 2,
    name: "Metro Overload Escape",
    subtitle: "Rift Collapse",
    description: "The city's central reactor is melting down! Run across high-speed neon expressways before the timeline destabilizes!",
    width: 2400,
    height: 650,
    spawn: { x: 80, y: 480 },
    exit: { x: 2300, y: 440, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    specialType: 'escape',
    timeLimit: 50,
    hints: [
      "Keep moving forward with maximum momentum; use Dash and Double Jump continuously.",
      "When future platforms glitch and shatter, switch to the Present or Past to maintain footing.",
      "Beware of collapsing subway columns falling from above."
    ],
    tiles: [
      createPlatform(0, 520, 300, 130, 'all', '#0f172a'),
      createPlatform(360, 480, 160, 20, 'future', '#06b6d4'),
      createPlatform(580, 440, 160, 20, 'present', '#3b82f6'),
      createPlatform(800, 400, 160, 20, 'past', '#d97706'),
      createPlatform(1020, 440, 160, 20, 'future', '#06b6d4'),
      createPlatform(1240, 480, 160, 20, 'present', '#3b82f6'),
      createPlatform(1460, 420, 160, 20, 'past', '#d97706'),
      createPlatform(1680, 460, 160, 20, 'future', '#06b6d4'),
      createPlatform(1900, 500, 500, 150, 'all', '#0f172a'),
    ],
    entities: [
      { id: 'c1', x: 420, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 860, y: 360, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1300, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard19', x: 1520, y: 370, w: 24, h: 24, type: 'shard', timeline: 'all' }
    ]
  },

  {
    id: 20,
    worldId: 2,
    name: "Chrono Sentinel",
    subtitle: "World 2 Climax",
    description: "BOSS BATTLE! The apex security AI of Metropolis phases between dimensional shields. Match its chronological frequency to disable it!",
    width: 1600,
    height: 600,
    spawn: { x: 100, y: 480 },
    exit: { x: 1500, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    specialType: 'boss',
    bossData: {
      name: "Chrono Sentinel",
      bossType: 'chrono_sentinel',
      health: 10,
      maxHealth: 10
    },
    hints: [
      "The Sentinel's shield glows Cyan in Future, Blue in Present, and Gold in Past.",
      "It is IMMUNE to attacks matching its shield's current era!",
      "Switch to an opposing timeline era to pierce its quantum barrier and strike its core with Time Pulse."
    ],
    tiles: [
      createPlatform(0, 520, 1600, 80, 'all', '#090d16'),
      createPlatform(240, 400, 160, 20, 'all', '#1e293b'),
      createPlatform(640, 320, 200, 20, 'all', '#1e293b'),
      createPlatform(1080, 400, 160, 20, 'all', '#1e293b'),
    ],
    entities: [
      {
        id: 'boss2',
        x: 1040,
        y: 400,
        w: 68,
        h: 84,
        type: 'enemy',
        enemyType: 'chrono_sentinel',
        health: 10,
        maxHealth: 10,
        timeline: 'all',
        patrolMinX: 450,
        patrolMaxX: 1350
      },
      { id: 'c1', x: 300, y: 360, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 720, y: 280, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1140, y: 360, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard20', x: 740, y: 220, w: 24, h: 24, type: 'shard', timeline: 'all' }
    ]
  },

  // ================= WORLD 3: THE LOST WORLD (21 - 30) =================
  {
    id: 21,
    worldId: 3,
    name: "Rift in Eternity",
    subtitle: "The Timeless Void",
    description: "Welcome to The Lost World! A dreamlike dimension floating outside normal chronology with celestial auroras and broken physics.",
    width: 1700,
    height: 650,
    spawn: { x: 80, y: 480 },
    exit: { x: 1600, y: 440, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'present',
    hints: [
      "Here, timelines bleed into each other: floating crystalline islands phase into reality depending on your era.",
      "Switch to Past to see ancient cosmic bridges of stardust.",
      "Switch to Future to materialize hard-light crystal steps across the bottomless void."
    ],
    tiles: [
      createPlatform(0, 520, 360, 130, 'all', '#3b0764'),
      createPlatform(420, 480, 160, 20, 'past', '#a855f7'),
      createPlatform(660, 440, 160, 20, 'present', '#c084fc'),
      createPlatform(900, 400, 160, 20, 'future', '#e879f9'),
      createPlatform(1140, 440, 160, 20, 'past', '#a855f7'),
      createPlatform(1380, 500, 320, 150, 'all', '#3b0764'),
    ],
    entities: [
      { id: 'c1', x: 480, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 720, y: 400, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 960, y: 360, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard21', x: 1200, y: 380, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk21', x: 700, y: 400, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 22,
    worldId: 3,
    name: "Gravity Shallows",
    subtitle: "Celestial Leap",
    description: "Unlock TIME DASH! Dash through the fabric of space-time to travel twice as far and pass safely through spectral anomalies.",
    width: 1900,
    height: 700,
    spawn: { x: 80, y: 520 },
    exit: { x: 1800, y: 440, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    hints: [
      "Your dash is now enhanced into a Time Dash with extended range and invincibility frames.",
      "Chain Jump + Double Jump + Time Dash to span immense cosmic chasms.",
      "Switch to Future if you need higher floating orbital platforms."
    ],
    tiles: [
      createPlatform(0, 560, 340, 140, 'all', '#2e1065'),
      createPlatform(540, 500, 140, 20, 'all', '#581c87'),
      createPlatform(940, 440, 140, 20, 'all', '#581c87'),
      createPlatform(1340, 480, 140, 20, 'all', '#581c87'),
      createPlatform(1640, 540, 260, 160, 'all', '#2e1065'),
    ],
    entities: [
      { id: 'c1', x: 600, y: 460, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 1000, y: 400, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1400, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard22', x: 1000, y: 320, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk22', x: 970, y: 400, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 23,
    worldId: 3,
    name: "Crystal Caverns",
    subtitle: "Resonating Echoes",
    description: "Deep crystal caves resonate with musical frequencies. Strike resonance crystals across eras to harmonize and open the barrier.",
    width: 1700,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1600, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'past',
    specialType: 'puzzle',
    hints: [
      "There are 2 harmonic switches: one in the Past, and one in the Future.",
      "Hit the crystal switch in the Past, switch to Future, then hit the second switch within 15 seconds.",
      "The great amethyst doorway in the Present will shatter open!"
    ],
    tiles: [
      createPlatform(0, 520, 1700, 80, 'all', '#1e1b4b'),
      createPlatform(420, 420, 160, 20, 'all', '#312e81'),
      createPlatform(880, 420, 160, 20, 'all', '#312e81'),
      createPlatform(1300, 360, 20, 160, 'present', '#701a75'), // Crystal Gate
    ],
    entities: [
      { id: 'sw23_past', x: 480, y: 380, w: 24, h: 24, type: 'switch', timeline: 'past' },
      { id: 'sw23_fut', x: 940, y: 380, w: 24, h: 24, type: 'switch', timeline: 'future' },
      { id: 'c1', x: 450, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 910, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard23', x: 1450, y: 460, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk23', x: 700, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 24,
    worldId: 3,
    name: "Inverted Sanctuary",
    subtitle: "Upside Down",
    description: "Gravity turns upside down! Walk on the ceiling in the Future era while avoiding spikes on the cavern floor below.",
    width: 1700,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1600, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'present',
    hints: [
      "In the Future era, temporal gravity reverses: jump to stick to the ceiling!",
      "The bottom floor in the Future is lined with crystal spikes, but the ceiling is safe.",
      "Switch back to Present when you reach the end of the ceiling to land gracefully at the exit."
    ],
    tiles: [
      createPlatform(0, 520, 360, 80, 'all', '#3b0764'),
      // Spikes on floor in future
      { x: 360, y: 560, w: 900, h: 40, type: 'spike', timeline: 'future' },
      // Ceiling runway in future
      createPlatform(360, 80, 900, 24, 'future', '#d946ef'),
      createPlatform(1360, 520, 340, 80, 'all', '#3b0764'),
    ],
    entities: [
      { id: 'c1', x: 500, y: 130, w: 20, h: 20, type: 'coin', timeline: 'future' },
      { id: 'c2', x: 750, y: 130, w: 20, h: 20, type: 'coin', timeline: 'future' },
      { id: 'c3', x: 1000, y: 130, w: 20, h: 20, type: 'coin', timeline: 'future' },
      { id: 'shard24', x: 850, y: 140, w: 24, h: 24, type: 'shard', timeline: 'future' },
      { id: 'chk24', x: 1400, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 25,
    worldId: 3,
    name: "Sanctum of Echoes",
    subtitle: "Timeline Clone",
    description: "Unlock TIMELINE CLONE! Leave a temporal copy of yourself holding down heavy pressure plates in one era while you advance in another.",
    width: 1700,
    height: 600,
    spawn: { x: 80, y: 480 },
    exit: { x: 1600, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'past',
    specialType: 'puzzle',
    hints: [
      "Acquire the Chrono Clone ability: press F to leave a persistent holographic clone behind.",
      "Position your clone on the heavy pressure plate in the Past.",
      "Switch to the Present or Future: with the plate held down, the blast door stays unlocked!"
    ],
    tiles: [
      createPlatform(0, 520, 1700, 80, 'all', '#2e1065'),
      createPlatform(460, 440, 180, 20, 'all', '#4c1d95'),
      createPlatform(1000, 360, 20, 160, 'all', '#701a75'), // Clone Door
    ],
    entities: [
      { id: 'plate25', x: 540, y: 410, w: 32, h: 12, type: 'switch', timeline: 'all' },
      { id: 'c1', x: 500, y: 400, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 800, y: 480, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard25', x: 1200, y: 460, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk25', x: 840, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 26,
    worldId: 3,
    name: "The Chrono Storm",
    subtitle: "Temporal Turbulence",
    description: "A violent time vortex shifts reality unpredictably every few seconds! Stay agile and ride the turbulence.",
    width: 2000,
    height: 650,
    spawn: { x: 80, y: 480 },
    exit: { x: 1900, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'present',
    specialType: 'escape',
    timeLimit: 55,
    hints: [
      "Keep moving forward; the storm rifts disintegrate trailing terrain.",
      "Watch the timeline icon in the HUD—when the storm roars, manually stabilize or switch eras.",
      "Collect clock energy bubbles to replenish energy for Time Dash."
    ],
    tiles: [
      createPlatform(0, 520, 320, 130, 'all', '#3b0764'),
      createPlatform(380, 480, 160, 20, 'past', '#a855f7'),
      createPlatform(600, 420, 160, 20, 'present', '#c084fc'),
      createPlatform(820, 460, 160, 20, 'future', '#e879f9'),
      createPlatform(1040, 400, 160, 20, 'past', '#a855f7'),
      createPlatform(1260, 440, 160, 20, 'present', '#c084fc'),
      createPlatform(1480, 480, 160, 20, 'future', '#e879f9'),
      createPlatform(1700, 520, 300, 130, 'all', '#3b0764'),
    ],
    entities: [
      { id: 'c1', x: 440, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 880, y: 420, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1320, y: 400, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard26', x: 1540, y: 430, w: 24, h: 24, type: 'shard', timeline: 'all' }
    ]
  },

  {
    id: 27,
    worldId: 3,
    name: "Behemoth's Pursuit",
    subtitle: "The Ancient Maw",
    description: "A colossal primordial Chrono-Behemoth emerges from the cosmic depths! Outrun its jaws across collapsing timeline shards!",
    width: 2500,
    height: 650,
    spawn: { x: 80, y: 480 },
    exit: { x: 2400, y: 440, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    specialType: 'chase',
    timeLimit: 50,
    hints: [
      "Do NOT look back! The behemoth crushes everything behind you.",
      "Switch to Future for speed booster pads; switch to Past to cross rock bridges.",
      "Use Time Freeze to briefly stagger the behemoth if it gets dangerously close!"
    ],
    tiles: [
      createPlatform(0, 520, 280, 130, 'all', '#1e1b4b'),
      createPlatform(340, 480, 180, 20, 'future', '#06b6d4'),
      createPlatform(580, 440, 180, 20, 'past', '#d97706'),
      createPlatform(820, 400, 180, 20, 'present', '#a855f7'),
      createPlatform(1060, 440, 180, 20, 'future', '#06b6d4'),
      createPlatform(1300, 480, 180, 20, 'past', '#d97706'),
      createPlatform(1540, 420, 180, 20, 'present', '#a855f7'),
      createPlatform(1780, 460, 180, 20, 'future', '#06b6d4'),
      createPlatform(2020, 500, 480, 150, 'all', '#1e1b4b'),
    ],
    entities: [
      { id: 'c1', x: 400, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 880, y: 360, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1360, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard27', x: 1600, y: 370, w: 24, h: 24, type: 'shard', timeline: 'all' }
    ]
  },

  {
    id: 28,
    worldId: 3,
    name: "Labyrinth of Epochs",
    subtitle: "The Master Puzzle",
    description: "The grand temple dungeon. Integrate timeline switches, freeze mechanisms, clones, and double jumps to unlock the core seal.",
    width: 2000,
    height: 700,
    spawn: { x: 80, y: 520 },
    exit: { x: 1900, y: 480, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'present',
    specialType: 'puzzle',
    hints: [
      "Room 1: Freeze the moving laser trap to leap to the upper level.",
      "Room 2: Plant a Clone on the golden rune in the Past to raise the bridge in the Future.",
      "Room 3: Switch to Future to access the ceiling gravity runway and bypass the final locked door!"
    ],
    tiles: [
      createPlatform(0, 560, 420, 140, 'all', '#1e1b4b'),
      createMoving(460, 480, 140, 18, 0, -140, 2.5, 'all'),
      createPlatform(660, 360, 240, 20, 'all', '#312e81'),
      createPlatform(960, 440, 240, 20, 'future', '#c084fc'),
      createPlatform(1300, 540, 700, 160, 'all', '#1e1b4b'),
    ],
    entities: [
      { id: 'sw28', x: 740, y: 320, w: 24, h: 24, type: 'switch', timeline: 'past' },
      { id: 'c1', x: 500, y: 440, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 700, y: 320, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1020, y: 400, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard28', x: 1040, y: 340, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk28', x: 1350, y: 500, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 29,
    worldId: 3,
    name: "Gateway to Infinity",
    subtitle: "The Final Gauntlet",
    description: "The final trial before facing The Time Eater. Evade time rifts and defeat elite temporal guardians.",
    width: 2000,
    height: 650,
    spawn: { x: 80, y: 480 },
    exit: { x: 1900, y: 440, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'future',
    hints: [
      "Prepare all your unlocked abilities: Time Dash, Double Jump, Freeze, and Clone.",
      "Defeat the guardian phantoms using Time Pulse while matching their respective timeline colors.",
      "Grab the final Time Shard in the central chamber to complete the cosmic seal."
    ],
    tiles: [
      createPlatform(0, 520, 2000, 80, 'all', '#0f172a'),
      createPlatform(360, 420, 160, 20, 'all', '#312e81'),
      createPlatform(720, 360, 180, 20, 'all', '#312e81'),
      createPlatform(1100, 300, 180, 20, 'all', '#312e81'),
      createPlatform(1480, 400, 180, 20, 'all', '#312e81'),
    ],
    entities: [
      { id: 'e29_1', x: 420, y: 370, w: 32, h: 32, type: 'enemy', enemyType: 'time_specter', timeline: 'future', patrolMinX: 360, patrolMaxX: 520 },
      { id: 'e29_2', x: 780, y: 310, w: 32, h: 32, type: 'enemy', enemyType: 'time_specter', timeline: 'past', patrolMinX: 720, patrolMaxX: 900 },
      { id: 'c1', x: 400, y: 380, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 760, y: 320, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1140, y: 260, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard29', x: 1180, y: 220, w: 24, h: 24, type: 'shard', timeline: 'all' },
      { id: 'chk29', x: 1250, y: 480, w: 28, h: 40, type: 'checkpoint', timeline: 'all' }
    ]
  },

  {
    id: 30,
    worldId: 3,
    name: "The Time Eater",
    subtitle: "The Final Confrontation",
    description: "FINAL BOSS! The primordial devourer of eras stands before you. Use every timeline, dash, freeze, and pulse to save reality!",
    width: 1800,
    height: 650,
    spawn: { x: 120, y: 480 },
    exit: { x: 1700, y: 460, w: 48, h: 64 },
    allowedTimelines: ['past', 'present', 'future'],
    initialTimeline: 'present',
    specialType: 'boss',
    bossData: {
      name: "The Time Eater",
      bossType: 'time_eater',
      health: 15,
      maxHealth: 15
    },
    hints: [
      "Phase 1: The Time Eater summons meteor fragments. Switch to the Past where stone canopies shield you.",
      "Phase 2: When it charges its cosmic laser, use TIME FREEZE (F key / button) to halt the beam and strike its glowing heart!",
      "Phase 3: It shifts reality into chaos! Match its timeline to break its temporal barrier and unleash the Final Time Burst!"
    ],
    tiles: [
      createPlatform(0, 520, 1800, 80, 'all', '#180728'),
      createPlatform(220, 400, 160, 20, 'all', '#3b0764'),
      createPlatform(580, 320, 200, 20, 'all', '#3b0764'),
      createPlatform(1020, 320, 200, 20, 'all', '#3b0764'),
      createPlatform(1420, 400, 160, 20, 'all', '#3b0764'),
      // Protective stone canopy in past
      createPlatform(520, 220, 320, 24, 'past', '#78350f'),
    ],
    entities: [
      {
        id: 'boss3',
        x: 1200,
        y: 380,
        w: 96,
        h: 110,
        type: 'enemy',
        enemyType: 'time_eater',
        health: 15,
        maxHealth: 15,
        timeline: 'all',
        patrolMinX: 400,
        patrolMaxX: 1600
      },
      { id: 'c1', x: 260, y: 360, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c2', x: 640, y: 280, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'c3', x: 1080, y: 280, w: 20, h: 20, type: 'coin', timeline: 'all' },
      { id: 'shard30', x: 1100, y: 200, w: 24, h: 24, type: 'shard', timeline: 'all' }
    ]
  }
];

export function getLevelById(id: number): LevelData {
  const found = LEVELS.find(l => l.id === id);
  return found || LEVELS[0];
}
