export const config = {
  game: {
    blockTransparency: false
  },
  map: {
    rows: 50, // min 10 for heightmap
    cols: 50, // min 10 for heightmap
    squareSize: 38,
    defaultGhostNumber: 0,
    perlin: true
  },
  block: {
    name: 'block',
    type: 'block',
    size: [95, 95],
    scale: [0.4, 0.4],
    img: 'assets/sprites/block.png'
  },
  tilemap: {
    name: 'block_2',
    type: 'block',
    size: [713, 129], // (713 / 7 elements) * 0.37 = 38
    scale: [0.37, 0.4],
    spriteSheet: 'assets/sprites/tilemap.png'
  },
  tilemap2: {
    name: 'block_3',
    type: 'block',
    size: [348, 185],
    scale: [0.32, 0.40],
    offset: [0, -36],
    spriteSheet: 'assets/sprites/tilemap2.png'
  },
  tilemap3: {
    name: 'block_4',
    type: 'block',
    size: [503, 510],
    scale: [
      0.37, // x = 38 * 5 el / 503 = 0.37
      0.47 // x = 38 * 4 el / 510 = 0.29
    ],
    offset: [0, 0],
    spriteSheet: 'assets/sprites/tilemap3.png'
  },
  // PLYAER
  player: {
    name: 'player',
    size: [27, 40],
    scale: [0.8, 0.8],
    img: 'assets/sprites/phaser-dude.png',
    canHover: [0, 1, 2, 3, 4, 5],
    orientation: 'down'
  },
  // GHOST
  ghost: {
    name: 'ghost',
    size: [32, 32],
    scale: [1, 1],
    img: 'assets/sprites/ghost-icon.png',
    canHover: [0],
    orientation: 'down',
    velocity: 5, // px per move
    speed: 100,
    triesBeforeExplosion: 2
  }
}

const layerElements = {
  water_1: {
    fill: ["0x0000FF", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  water_2: {
    fill: ["0x4A86E8", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  water_3: {
    fill: ["0xC9DAF8", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  water_3: {
    fill: ["0xCFE2F3", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  sand_1: {
    fill: ["0xFCE5CD", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  sand_2: {
    fill: ["0xF9CB9C", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  sand_3: {
    fill: ["0xF6B26B", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  grass_1: {
    fill: ["0x6AA84F", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  grass_2: {
    fill: ["0x38761D", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  ground_1: {
    fill: ["0xB45F06", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  },
  ground_2: {
    fill: ["0x783F04", 1],
    lineStyle: [0, '0x0000FF', 0],
    type: 'color'
  }
}

export const layers = {
  // GROUND
  groundLayer: {
    elements: [
      {
          fill: ["0xA5C24C", 1], // color, opacity
          lineStyle: [0, '0x0000FF', 0],
          type: 'ground'
      },
      {
          fill: ["0x9CBB44", 1], // color, opacity
          lineStyle: [0, '0x0000FF', 0],
          type: 'ground'
      },
      {
          fill: ["0xA2BE4D", 1], // color, opacity
          lineStyle: [0, '0x0000FF', 0],
          type: 'ground'
      },
      {
          fill: ["0xAAC34D", 1], // color, opacity
          lineStyle: [0, '0x0000FF', 0],
          type: 'ground'
      }
    ]
  },
  // BLOC
  blockLayer: {
    elements: [
        Object.assign({}, config.tilemap, {frame: 1}),
        Object.assign({}, config.tilemap, {frame: 2}),
        Object.assign({}, config.tilemap, {frame: 3}),
        Object.assign({}, config.tilemap, {frame: 4}),
        Object.assign({}, config.tilemap, {frame: 5}),
        Object.assign({}, config.tilemap, {frame: 6})
    ]
  },
  blockLayer2: {
    elements: [
        Object.assign({}, config.tilemap2, {frame: 1}),
        Object.assign({}, config.tilemap2, {frame: 2})
        // Object.assign({}, config.tilemap2, {frame: 3})
        // Object.assign({}, config.tilemap2, {frame: 3}),
        // Object.assign({}, config.tilemap2, {frame: 4})
    ]
  },
  blockLayer3: {
    elements: [
        Object.assign({}, config.tilemap3, {frame: 4, offset: [0, 10]}), // water 1
        Object.assign({}, config.tilemap3, {frame: 9, offset: [0, 10]}), // water 2
        Object.assign({}, config.tilemap3, {frame: 14, offset: [0, 10]}), // water 3

        Object.assign({}, config.tilemap3, {frame: 3}), // sand 1
        Object.assign({}, config.tilemap3, {frame: 8}), // sand 2

        Object.assign({}, config.tilemap3, {frame: 0}), // grass
        Object.assign({}, config.tilemap3, {frame: 5}),
        Object.assign({}, config.tilemap3, {frame: 10}),
        Object.assign({}, config.tilemap3, {frame: 15}),

        Object.assign({}, config.tilemap3, {frame: 7, offset: [0, -5]}), // ground 1
        Object.assign({}, config.tilemap3, {frame: 2, offset: [0, -5]}), // ground 2

        Object.assign({}, config.tilemap3, {frame: 1, offset: [0, -15]}), // mountain
        Object.assign({}, config.tilemap3, {frame: 6, offset: [0, -20]}),
        Object.assign({}, config.tilemap3, {frame: 11, offset: [0, -25]})
    ]
  },
  blockLayer4: {
    elements: [
      layerElements.water_1,
      layerElements.water_2,
      layerElements.water_3,
      layerElements.sand_1,
      layerElements.sand_2,
      layerElements.sand_3,
      // layerElements.grass_1,
      layerElements.grass_2,
      layerElements.ground_1,
      layerElements.ground_2
    ]
  }
}
