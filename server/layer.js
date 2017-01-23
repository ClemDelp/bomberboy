import {guid} from './utils'
import {config} from '../config'

export default class Layer {
  constructor() {
    const {map, box} = config
    this.rows = map.rows
	  this.cols = map.cols
    this.refSize = config.map.squareSize
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
  setVal (col, row, val) {
    this.matrix[row][col].val = val
  }
  getVal (col, row) {
    return this.matrix[row][col].val
  }
  replaceObject (col, row, object) {
    this.matrix[row][col] = object
  }
}
