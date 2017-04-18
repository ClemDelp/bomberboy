import GroundTile from './GroundTile'

export class Mountain1 extends GroundTile {
  constructor () {
    super()
    this.color = '#CFE2F3'
    this.type = 'montain'
    this.frame = 2
    this.isoZ = 25
  }
}
