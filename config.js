export const config = {
  game: {
    blockTransparency: false
  },
  map: {
    rows: 20, // min 10 for heightmap
    cols: 20, // min 10 for heightmap
    squareSize: 38,
    defaultGhostNumber: 0,
    perlin: true,
    isometric: true
  },
  block: {
    name: 'block',
    type: 'block',
    size: [95, 95],
    scale: [0.4, 0.4],
    img: 'assets/sprites/block.png'
  },
  tilemap: {
    name: 'block_4',
    type: 'block',
    size: [503, 510],
    scale: [
      0.37, // x = 38 * 5 el / 503 = 0.37
      0.47 // x = 38 * 4 el / 510 = 0.29
    ],
    offset: [0, 0],
    spriteSheet: 'assets/sprites/tilemap.png'
  },
  // Isometric
  isoTileMap: {
    name: 'isoTileMap',
    type: 'iso',
    size: [1024, 896],
    scale: [
      0.55, // x = (38 * 8 el / 1024) + 0.25
      0.55 // x = (38 * 7 el / 896) + 0.25
    ],
    offset: [0, 0],
    spriteSheet: 'assets/sprites/basic_ground_tiles.png'
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

export const layers = {
  blockLayer: {
    elements: [
      Object.assign({}, config.tilemap, {color: '#4A86E8', type: 'water', frame: 4, offset: [0, 10]}), // water 1
      Object.assign({}, config.tilemap, {color: '#C9DAF8', type: 'water', frame: 9, offset: [0, 10]}), // water 2
      Object.assign({}, config.tilemap, {color: '#CFE2F3', type: 'water', frame: 14, offset: [0, 10]}), // water 3

      Object.assign({}, config.tilemap, {color: '#FCE5CD', type: 'sand', frame: 3}), // sand 1
      Object.assign({}, config.tilemap, {color: '#F9CB9C', type: 'sand', frame: 8}), // sand 2

      Object.assign({}, config.tilemap, {color: '#B6D7A8', type: 'grass', frame: 0, offset: [0, 0]}), // grass
      Object.assign({}, config.tilemap, {color: '#93C47D', type: 'grass', frame: 5, offset: [0, -2]}),
      Object.assign({}, config.tilemap, {color: '#6AA84F', type: 'grass', frame: 10, offset: [0, -3]}),
      Object.assign({}, config.tilemap, {color: '#38761D', type: 'grass', frame: 15, offset: [0, -4]}),

      Object.assign({}, config.tilemap, {color: '#F6B26B', type: 'ground', frame: 7, offset: [0, -5]}), // ground 1
      Object.assign({}, config.tilemap, {color: '#E69138', type: 'ground', frame: 2, offset: [0, -5]}), // ground 2

      Object.assign({}, config.tilemap, {color: '#B45F06', type: 'mountain', frame: 1, offset: [0, -15]}), // mountain
      Object.assign({}, config.tilemap, {color: '#783F04', type: 'mountain', frame: 6, offset: [0, -20]}),
      Object.assign({}, config.tilemap, {color: '#783F04', type: 'mountain', frame: 11, offset: [0, -25]})
    ]
  },
  isoLayers: {
    elements: [
      Object.assign({}, config.isoTileMap, {color: '#4A86E8', type: 'grass', frame: 0, offset: [0, 0]}), // grass 1
      Object.assign({}, config.isoTileMap, {color: '#C9DAF8', type: 'grass2', frame: 1, offset: [0, 4]}), // grass 2
      Object.assign({}, config.isoTileMap, {color: '#CFE2F3', type: 'ground', frame: 2, offset: [0, 8]}), // ground
      Object.assign({}, config.isoTileMap, {color: '#CFE2F3', type: 'ground2', frame: 3, offset: [0, 12]}), // ground
    ]
  }
}
