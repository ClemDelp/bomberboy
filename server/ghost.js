import Element from './Element'

export default class Ghost extends Element {
  constructor () {
    super()
    this.type = 'ghost'
    this.canHover = ['grass']
    this.img = 'assets/sprites/ghosts.png'
    this.animations = {
      top: {
        frames: [120, 140],
        duration: 10,
        loop: true
      },
      right: {
        frames: [0, 20],
        duration: 10,
        loop: true
      },
      bottom: {
        frames: [40, 60],
        duration: 10,
        loop: true
      },
      left: {
        frames: [80, 100],
        duration: 10,
        loop: true
      }
    }
    this.body.collideWorldBounds = false
    this.size = [32, 32]
    this.scale = [0.75, 0.75]
    this.orientation = 'bottom'
    this.velocity = 5 // px per move
    this.speed = 100
    this.triesBeforeExplosion = 2
    this.explosion = true
    this.tileName = 'ghost'
    this.isoZ = 200
  }
}
