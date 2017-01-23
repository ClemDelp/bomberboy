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
    isometric: true,
    reverseMap: true,
    waterAnimation: true
  },
  isoTilesMap: {
    name: 'isoTilesMap',
    type: 'iso',
    size: [824, 103],
    scale: [
      0.7, // x = (38 * 8 el / 1024) + 0.25
      0.7 // x = (38 * 7 el / 896) + 0.25
    ],
    offset: [0, 0],
    spriteSheet: 'assets/sprites/iso_tiles.png',
    tileName: 'tile'
  },
  treesLayers: {
    name: 'treesLayers',
    type: 'normal',
    size: [824, 103],
    scale: [
      0.7, // x = (38 * 8 el / 1024) + 0.25
      0.7 // x = (38 * 7 el / 896) + 0.25
    ],
    offset: [0, 0],
    spriteSheet: 'assets/sprites/tree_tiles.png',
    tileName: 'tree'
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
  isoTilesMap: {
    elements: [
      Object.assign({}, config.isoTilesMap, {color: '#CFE2F3', type: 'water', frame: 4, z: -5}),
      Object.assign({}, config.isoTilesMap, {color: '#C9DAF8', type: 'grass', frame: 1, z: 0}),
      Object.assign({}, config.isoTilesMap, {color: '#4A86E8', type: 'grass', frame: 0, z: 5}),
      Object.assign({}, config.isoTilesMap, {color: '#CFE2F3', type: 'montain', frame: 2, z: 30})
    ]
  },
  treesLayers: {
    elements: [
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 0, z: 0, proba: 1, canHover: ['grass', 'montain']}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 1, z: 0, proba: 1, canHover: ['grass', 'montain']}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 2, z: 0, proba: 1, canHover: ['grass', 'montain']}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 3, z: 0, proba: 1, canHover: ['grass', 'montain']}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 4, z: 0, proba: 1, canHover: ['grass', 'montain']}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 5, z: 0, proba: 1, canHover: ['grass', 'montain']}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 6, z: 0, proba: 1, canHover: ['grass', 'montain']}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 7, z: 0, proba: 1, canHover: ['grass', 'montain']})
    ]
  }
}
