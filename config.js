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
    name: 'block_4',
    type: 'block',
    size: [503, 510],
    scale: [
      0.37, // x = 38 * 5 el / 503 = 0.37
      0.47 // x = 38 * 4 el / 510 = 0.29
    ],
    offset: [0, 0],
    spriteSheet: 'assets/sprites/tilemap.png'
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
        Object.assign({}, config.tilemap, {type: 'water', frame: 4, offset: [0, 10]}), // water 1
        Object.assign({}, config.tilemap, {type: 'water', frame: 9, offset: [0, 10]}), // water 2
        Object.assign({}, config.tilemap, {type: 'water', frame: 14, offset: [0, 10]}), // water 3

        Object.assign({}, config.tilemap, {type: 'sand', frame: 3}), // sand 1
        Object.assign({}, config.tilemap, {type: 'sand', frame: 8}), // sand 2

        Object.assign({}, config.tilemap, {type: 'grass', frame: 0, offset: [0, 0]}), // grass
        Object.assign({}, config.tilemap, {type: 'grass', frame: 5, offset: [0, -2]}),
        Object.assign({}, config.tilemap, {type: 'grass', frame: 10, offset: [0, -3]}),
        Object.assign({}, config.tilemap, {type: 'grass', frame: 15, offset: [0, -4]}),

        Object.assign({}, config.tilemap, {type: 'ground', frame: 7, offset: [0, -5]}), // ground 1
        Object.assign({}, config.tilemap, {type: 'ground', frame: 2, offset: [0, -5]}), // ground 2

        Object.assign({}, config.tilemap, {type: 'mountain', frame: 1, offset: [0, -15]}), // mountain
        Object.assign({}, config.tilemap, {type: 'mountain', frame: 6, offset: [0, -20]}),
        Object.assign({}, config.tilemap, {type: 'mountain', frame: 11, offset: [0, -25]})
    ]
  }
}
