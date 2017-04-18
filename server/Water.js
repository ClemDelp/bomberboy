import GroundTile from './GroundTile'

export class Water extends GroundTile {
  constructor () {
    super()
    this.color = '#CFE2F3'
    this.type = 'water'
    this.frame = 4
  }
}
