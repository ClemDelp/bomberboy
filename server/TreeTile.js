import Element from './Element'

export class TreeTile extends Element {
  constructor () {
    super()
    this.name = 'treesLayers'
    this.type = 'tree'
    this.canHover = ['grass', 'montain']
    this.size = [824, 103]
    this.scale = [
      0.65, // x = (38 * 8 el / 1024) + 0.25
      0.65 // x = (38 * 7 el / 896) + 0.25
    ]
    this.offset = [0, 0]
    this.spriteSheet = 'assets/sprites/tree_tiles.png'
    this.tileName = 'tree'
    this.body = {
      collideWorldBounds: false,
      immovable: false,
      gravity: {
        z: -1000
      }
    }
    this.isoZ = 200
  }
}
