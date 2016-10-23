import { Meteor } from 'meteor/meteor'
import bodyParser from 'body-parser'
const Fiber = require('fibers')
import Layer from './layer'
import {config} from './config'
import {Ghost} from './ghost'
import {guid} from './utils'

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
		game.setGhostLayer()

		// BRODCAST LOOP
		// let i = 0
		// setInterval(function () {
		// 	Object.keys(game.ghostsById).map((id, index) => {
		// 		let ghost = game.ghostsById[id]
		// 		const oneOrTwo = Math.floor(Math.random() * 2) + 1
		// 		if (oneOrTwo === 1) {
		// 			// update x
		// 			ghost.x = ghost.x + (i * 32)
		// 		} else {
		// 			// update y
		// 			ghost.y = ghost.y + (i * 32)
		// 		}
		// 		Streamy.broadcast('gameStream', {data: ghost})
		// 	})
		// 	i++
		// 	if (i > 10) i = 0
		// }, 2000)

		// ROUTE
		app.get('/getContextGame', function (req, res) {
			console.log('send context to new user')
			const context = {
				layers: game.layers
			}
			res.json({data: context})
		})
	})
}


class Game {
  constructor (map) {
		this.ghostsById = {}
		// SET MAP LAYER
		let mapLayer = new Layer()
		for(var y = 0; y < mapLayer.cols; y++) {
      for(var x = 0; x < mapLayer.rows; x++) {
        var fill = 0
				if(Math.random() * 10 % 2 > 1) fill = 1
        mapLayer.matrix[y][x].val = fill
      }
    }
		// DEFINE LAYERS
		this.layers = {
			'map': mapLayer,
			'ghost': new Layer()
		}
  }
	setGhostLayer () {
		const layerName = 'ghost'
		for (let i = 0; i < config.initGhostNumber; i++) {
			const newGhost = new Ghost()
			const position = this.getFreePosition(newGhost)
			newGhost.setPosition(position)
			this.ghostsById[newGhost.id] = newGhost
			this.addElementOnLayer(layerName, newGhost, position)
		}
	}
	addElementOnLayer (layerName, el, position) {
		const layer = this.layers[layerName]
		if (layer && layer.matrix) {
			layer.matrix[position.y][position.x] = el
		}
	}
	getFreePosition (element) {
		let x = 0
    let y = 0
		const canHover = element.canHover
		let found = false
		// while we found free position
		while (!found) {
			x = Math.round(Math.random() * config.mapWidth)
			if(x === config.mapWidth) x--
			y = Math.round(Math.random() * config.mapHeight)
			if(y === config.mapHeight) y--
			// Check on all layers
			Object.keys(this.layers).forEach((layerName) => {
				let stop = false
				const layer = this.layers[layerName]
				if (!stop && _.indexOf(canHover, layer.matrix[y][x].val) > -1) found = true
				else {
					found = false
					stop = true
				}
			})
		}
		return {x, y}
	}
	move () {
		Object.keys(this.ghostsById).forEach((id, index) => {
			const ghost = this.ghostsById[id]
			const deplacements = ghost.deplacements
			const possibilities = deplacements.length - 1
			setInterval(function(){
				let sens = ghost.orientation
				var i = 0
				while(!this[sens](ghost)){
					sens = deplacements[Math.round(Math.random() * possibilities)]
					i++
					if(i > possibilities) break
				}

			},1000)
		})
		return this
	}
	// ------------------------------------------------
	down (ghost) {
		var x = ghost.x
		var y = ghost.y
		if((y + 1 < this.map.rows) && (this.map.matrix[y + 1][x].val === 0)){
			// vers le sud
			var from = {x: x, y: y}
			ghost.orientation = "down"
			ghost.y++
			var to = {x: this.x, y: this.y}
			// this.bob_updated.dispatch(this.getModel())
			this.map.moveBot(from,to)
			return true
		}else{
			return false
		}
	}
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
