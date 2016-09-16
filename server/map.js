import {guid} from './utils'

export default class Map {
  constructor(height, width) {
    console.log('pouettttete')
    this.height = height
    this.width = width
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
