import GroundTile from './GroundTile'

export class Grass1 extends GroundTile {
  constructor () {
    super()
    this.color = '#C9DAF8'
    this.type = 'grass'
    this.frame = 1
    this.isoZ = 5
  }
}

export class Grass2 extends GroundTile {
  constructor () {
    super()
    this.color = '#4A86E8'
    this.type = 'grass'
    this.frame = 0
    this.isoZ = 5
  }
}
