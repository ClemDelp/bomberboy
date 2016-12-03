export const config = {
  map: {
    rows: 20,
    cols: 20,
    squareSize: 38,
    defaultGhostNumber: 10,
    perlin: false
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
  // PLYAER
  player: {
    name: 'player',
    size: [27, 40],
    scale: [0.8, 0.8],
    img: 'assets/sprites/phaser-dude.png',
    canHover: [0],
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
  }
}
