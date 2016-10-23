import {guid} from './utils'
import {config} from './config'

export default class Layer {
  constructor() {
    this.rows = config.mapHeight
	  this.cols = config.mapWidth
    this.cubeSize = config.cubeSize
    // create the matrix
    this.matrix = []
    // default matrix value
    for(var y = 0; y < this.cols; y++) {
        this.matrix[y] = []
        for(var x = 0; x < this.rows; x++) {
          this.matrix[y][x] = {
  					id : guid(),
  					val : 0
  				}
        }
    }
  }
  moveElement (from, to) {
    const oldVal = this.matrix[from.y][from.x].val
		this.matrix[from.y][from.x].val = 0
		this.matrix[to.y][to.x].val = oldVal
	}
}
