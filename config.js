export const config = {
  game: {
    blockTransparency: false
  },
  map: {
    rows: 15, // min 10 for heightmap
    cols: 15, // min 10 for heightmap
    squareSize: 38,
    defaultGhostNumber: 0,
    perlin: true,
    isometric: true,
    reverseMap: true,
    waterAnimation: true
  },



  isoTilesMap: {
    name: 'isoTilesMap',
    type: 'block',
    size: [824, 103],
    scale: [
      0.7, // x = (38 * 8 el / 1024) + 0.25
      0.7 // x = (38 * 7 el / 896) + 0.25
    ],
    offset: [0, 0],
    spriteSheet: 'assets/sprites/iso_tiles.png',
    tileName: 'tile',
    alpha: 1,
    anchor: 0.5,
    physics: {
      isoArcade: true
    },
    body: {
      collideWorldBounds: true,
      immovable: true,
      gravity: {
        z: 0
      }
    },
    isoZ: 0
  },




  treesLayers: {
    name: 'treesLayers',
    type: 'tree',
    canHover: ['grass', 'montain'],
    size: [824, 103],
    scale: [
      0.65, // x = (38 * 8 el / 1024) + 0.25
      0.65 // x = (38 * 7 el / 896) + 0.25
    ],
    offset: [0, 0],
    spriteSheet: 'assets/sprites/tree_tiles.png',
    tileName: 'tree',
    alpha: 1,
    anchor: 0.5,
    physics: {
      isoArcade: true
    },
    body: {
      collideWorldBounds: false,
      immovable: false,
      gravity: {
        z: -1000
      }
    },
    isoZ: 200
  },




  // PLYAER
  player: {
    type: 'player',
    canHover: [0, 1, 2, 3, 4, 5],
    img: 'assets/sprites/phaser-dude.png',
    animations: {
      top: {
        frames: [0, 1, 2],
        duration: 10,
        loop: true
      },
      right: {
        frames: [3, 4, 5],
        duration: 10,
        loop: true
      },
      bottom: {
        frames: [6, 7, 8],
        duration: 10,
        loop: true
      },
      left: {
        frames: [9, 10, 11],
        duration: 10,
        loop: true
      }
    },
    size: [27, 40],
    scale: [1.25, 1.25],
    orientation: 'down',
    tileName: 'dude',
    alpha: 1,
    anchor: 0.5,
    physics: {
      isoArcade: true
    },
    body: {
      collideWorldBounds: true,
      immovable: false,
      gravity: {
        z: -500
      },
      velocity: {
        z: 200
      }
    },
    isoZ: 200
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
      Object.assign({}, config.isoTilesMap, {color: '#CFE2F3', type: 'water', frame: 4, isoZ: -5}),
      Object.assign({}, config.isoTilesMap, {color: '#C9DAF8', type: 'grass', frame: 1, isoZ: 0}),
      Object.assign({}, config.isoTilesMap, {color: '#4A86E8', type: 'grass', frame: 0, isoZ: 5}),
      Object.assign({}, config.isoTilesMap, {color: '#C9DAF8', type: 'grass', frame: 1, isoZ: 10}),
      Object.assign({}, config.isoTilesMap, {color: '#C9DAF8', type: 'grass', frame: 1, isoZ: 20}),
      Object.assign({}, config.isoTilesMap, {color: '#CFE2F3', type: 'montain', frame: 2, isoZ: 30})
    ]
  },
  treesLayers: {
    elements: [
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 0}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 1}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 2}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 3}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 4}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 5}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 6}),
      Object.assign({}, config.treesLayers, {color: '#CFE2F3', type: 'tree', frame: 7})
    ]
  }
}
