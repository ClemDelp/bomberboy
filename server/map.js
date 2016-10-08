import {guid} from './utils'
import {config} from './config'

export default class Map {
  constructor(height, width) {
    this.height = config.mapHeight
    this.width = config.mapWidth
    this.cubeSize = config.cubeSize
    // create the matrix
    this.matrix = []
    for(var i=0; i<this.width; i++) {
        this.matrix[i] = []
        for(var j=0; j<this.height; j++) {
          var fill = 0
  				if(Math.random()*10%2>1) fill = 1
  				var el = {
  					id : guid(),
  					fill : fill
  				}
          this.matrix[i][j] = fill
        }
    }
  }
}
