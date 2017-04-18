import Element from './Element'

export default class Player extends Element {
  constructor () {
    super()
    this.type = 'player'
    this.canHover = ['grass']
    this.img = 'assets/sprites/phaser-dude.png'
    this.animations = {
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
    }
    this.body.collideWorldBounds = true
    this.size = [27, 40]
    this.scale = [1.25, 1.25]
    this.orientation = 'stop'
    this.tileName = 'dude'
    this.isoZ = 200
  }
}
