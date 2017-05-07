import GroundTile from './GroundTile'

export class Mountain1 extends GroundTile {
  constructor () {
    super()
    this.color = '#CFE2F3'
    this.type = 'montain'
    this.frame = 2
    this.isoZ = 30
  }
}
export class Mountain2 extends GroundTile {
  constructor () {
    super()
    this.color = '#CFE2F3'
    this.type = 'montain'
    this.frame = 0
    this.isoZ = 20
  }
}
