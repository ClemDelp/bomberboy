export const config = {
  map: {
    rows: 20,
    cols: 20
  },
  // BLOC
  block: {
    name: 'block',
    size: [95, 95],
    scale: [0.4, 0.4],
    img: 'assets/sprites/block.png'
  },
  // PLYAER
  player: {
    name: 'player',
    size: [27, 40],
    scale: [0.8, 0.8],
    img: 'assets/sprites/phaser-dude.png',
    val: 3,
    canHover: [0],
    orientation: 'down'
  },
  // GHOST
  ghost: {
    name: 'ghost',
    size: [32, 32],
    scale: [1, 1],
    img: 'assets/sprites/ghost-icon.png',
    initNumber: 10,
    val: 2,
    canHover: [0],
    orientation: 'down',
    velocity: 2 // px per move
  }
}
