import { Meteor } from 'meteor/meteor'
import bodyParser from 'body-parser'
const Fiber = require('fibers')
import Map from './map'
import {config} from './config'
import {Ghost} from './ghost'

if(Meteor.isServer) {
	Meteor.startup(() => {

		// Express
		app = Express()
		app.use(bodyParser.json())       // to support JSON-encoded bodies
		app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
		  extended: true
		}))

		// GAME
		const game = new Game()
		game.createGhostLayer()
		// BRODCAST LOOP
		// setInterval(function () {
		// 	const y = Math.floor(Math.random() * 10)
		// 	Streamy.broadcast('gameStream', {'y': y, 'date': new Date().toLocaleTimeString()})
		// }, 1000)

		// ROUTE
		app.get('/getContextGame', function (req, res) {
			console.log('send context to new user')
			const context = {
				map: game.map,
			}
			res.json({data: context})
		})
	})
}


class Game {
  constructor(map) {
		this.map = new Map(10, 10)
		this.ghostsById = {}
  }
	createGhostLayer () {
		for (let i = 0; i < config.initGhostNumber; i++) {
			const position = this.getFreePosition()
			const newGhost = new Ghost(position)
			this.ghostsById[newGhost.id] = newGhost
			this.addElementOnMap(newGhost, position)
		}
	}
	addElementOnMap (el, position) {
		this.map.matrix[position.y][position.x] = el
	}
	getFreePosition () {
		let x = 0
    let y = 0
		while(this.map.matrix[y][x].val != 0){
      x = Math.round(Math.random() * this.map.cols)
      if(x == this.map.cols) x--
      y = Math.round(Math.random() * this.map.rows)
      if(y==this.map.rows) y--
    }
    return {x, y}
	}

	// ------------------------------------------------
	// down () {
	// 	var x = this.x
	// 	var y = this.y
	// 	if((y+1<this.map.rows)&&(this.map.matrix[y+1][x].val == 0)){
	// 		// vers le sud
	// 		var from = {x:x,y:y}
	// 		this.orientation = "down"
	// 		this.y++
	// 		var to = {x:this.x,y:this.y}
	// 		this.bob_updated.dispatch(this.getModel())
	// 		this.map.moveBot(from,to)
	// 		return true
	// 	}else{
	// 		return false
	// 	}
	// }
	// right () {
	// 	var x = this.x
	// 	var y = this.y
	// 	if((x+1<this.map.cols)&&(this.map.matrix[y][x+1].val == 0)){
	// 		// vers l'est
	// 		var from = {x:x,y:y}
	// 		this.orientation = "right"
	// 		this.x++
	// 		var to = {x:this.x,y:this.y}
	// 		this.bob_updated.dispatch(this.getModel())
	// 		this.map.moveBot(from,to)
	//
	// 		return true
	// 	}else{
	// 		return false
	// 	}
	// }
	// up () {
	// 	var x = this.x
	// 	var y = this.y
	// 	if((y-1>0)&&(this.map.matrix[y-1][x].val == 0)){
	// 		// vers le nord
	// 		var from = {x:x,y:y}
	// 		this.orientation = "up"
	// 		this.y--
	// 		var to = {x:this.x,y:this.y}
	// 		this.bob_updated.dispatch(this.getModel())
	// 		this.map.moveBot(from,to)
	// 		return true
	// 	}else{
	// 		return false
	// 	}
	// }
	// left () {
	// 	var x = this.x
	// 	var y = this.y
	// 	if((x-1>0)&&(this.map.matrix[y][x-1].val == 0)){
	// 		// vers l'ouest
	// 		var from = {x:x,y:y}
	// 		this.orientation = "left"
	// 		this.x--
	// 		var to = {x:this.x,y:this.y}
	// 		this.bob_updated.dispatch(this.getModel())
	// 		this.map.moveBot(from,to)
	// 		return true
	// 	}else{
	// 		return false
	// 	}
	// }
}
