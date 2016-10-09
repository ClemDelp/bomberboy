import {guid} from './utils'
import {config} from './config'

export default class Map {
  constructor(height, width) {
    this.rows = config.mapHeight
	  this.cols = config.mapWidth
    this.cubeSize = config.cubeSize
    // create the matrix
    this.matrix = []
    for(var i=0; i<this.cols; i++) {
        this.matrix[i] = []
        for(var j=0; j<this.rows; j++) {
          var fill = 0
  				if(Math.random()*10%2>1) fill = 1
  				var el = {
  					id : guid(),
  					val : fill
  				}
          this.matrix[i][j] = el
        }
    }
  }
}
