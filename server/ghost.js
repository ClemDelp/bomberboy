import {guid} from './utils'
import {config} from './config'

class Bob {
  constructor(map, position) {
    this.x = position.x
    this.y = position.y
    this.id = guid()
    this.bot_size = 20
    this.orientation = "down"
    this.color = "#27ae60"
    this.deplacement = ["down","right","up","left"]
    this.map = map
  }
  // ------------------------------------------------
	down () {
		var x = this.x
		var y = this.y
		if((y+1<this.map.rows)&&(this.map.matrix[y+1][x].val == 0)){
			// vers le sud
			var from = {x:x,y:y}
			this.orientation = "down"
			this.y++
			var to = {x:this.x,y:this.y}
			this.bob_updated.dispatch(this.getModel())
			this.map.moveBot(from,to)
			return true
		}else{
			return false
		}
	}
	right () {
		var x = this.x
		var y = this.y
		if((x+1<this.map.cols)&&(this.map.matrix[y][x+1].val == 0)){
			// vers l'est
			var from = {x:x,y:y}
			this.orientation = "right"
			this.x++
			var to = {x:this.x,y:this.y}
			this.bob_updated.dispatch(this.getModel())
			this.map.moveBot(from,to)

			return true
		}else{
			return false
		}
	}
	up () {
		var x = this.x
		var y = this.y
		if((y-1>0)&&(this.map.matrix[y-1][x].val == 0)){
			// vers le nord
			var from = {x:x,y:y}
			this.orientation = "up"
			this.y--
			var to = {x:this.x,y:this.y}
			this.bob_updated.dispatch(this.getModel())
			this.map.moveBot(from,to)
			return true
		}else{
			return false
		}
	}
	left () {
		var x = this.x
		var y = this.y
		if((x-1>0)&&(this.map.matrix[y][x-1].val == 0)){
			// vers l'ouest
			var from = {x:x,y:y}
			this.orientation = "left"
			this.x--
			var to = {x:this.x,y:this.y}
			this.bob_updated.dispatch(this.getModel())
			this.map.moveBot(from,to)
			return true
		}else{
			return false
		}
	}
}

export class Ghost extends Bob {
  constructor(map, position) {
    super(map, position)
    this.type = 'Ghost'
  }
}
