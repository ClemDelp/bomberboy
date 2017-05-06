import Element from './Element'

export default class GroundTile extends Element {
  constructor () {
    super()
    this.name = 'isoTilesMap'
    this.type = 'block'
    this.size = [824, 103]
    this.scale = [
      0.7, // x = (38 * 8 el / 1024) + 0.25
      0.7 // x = (38 * 7 el / 896) + 0.25
    ]
    this.offset = [0, 0]
    this.spriteSheet = 'assets/sprites/iso_tiles.png'
    this.tileName = 'tile'
    this.body = {
      collideWorldBounds: true,
      immovable: true,
      gravity: {
        z: 0
      }
    }
    this.isoZ = 0
  }
}
