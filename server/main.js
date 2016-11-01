import { Meteor } from 'meteor/meteor'
import bodyParser from 'body-parser'
const Fiber = require('fibers')
import Layer from './layer'
import {config} from '../config'
import {Ghost, Player} from './ghost'
import {guid} from './utils'
const Promise = require('promise')

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
		// game.startGhostMoving()
		// ROUTE
		app.get('/getContextGame', function (req, res) {
			const player = game.addPlayer()
			console.log('send context to new player')
			const context = {
				layers: game.layers,
				player
			}
			res.json({data: context})
		})
	})
}

class Game {
  constructor (map) {
		// PARAMETERS
		this.ghostsById = {}
		this.playersById = {}
		this.layers = {}
		// SET MAP LAYER
		let mapLayer = new Layer()
		for(var y = 0; y < mapLayer.cols; y++) {
      for(var x = 0; x < mapLayer.rows; x++) {
        var val = 0
				if(Math.random() * 10 % 2 > 1) val = 1
        mapLayer.setVal(x, y, val)
      }
    }
		// DEFINE LAYERS
		this.layers = {
			'map': mapLayer,
			'ghost': new Layer()
		}
  }
	addPlayer () {
		const layerName = 'ghost'
		const layer = this.layers[layerName]
		const refSize = layer.elementRef.size[0]
		const newPlayer = new Player()
		const position = this.getFreePosition(newPlayer)
		newPlayer.setPosition(position, refSize)
		this.playersById[newPlayer.id] = newPlayer
		this.addElementOnLayer(layerName, newPlayer, position)
		return newPlayer
	}
	setGhostLayer () {
		const layerName = 'ghost'
		const layer = this.layers[layerName]
		const refSize = layer.elementRef.size[0]
		for (let i = 0; i < config.ghost.initNumber; i++) {
			const newGhost = new Ghost()
			const position = this.getFreePosition(newGhost)
			newGhost.setPosition(position, refSize)
			this.ghostsById[newGhost.id] = newGhost
			this.addElementOnLayer(layerName, newGhost, position)
		}
	}
	addElementOnLayer (layerName, el, position) {
		const layer = this.layers[layerName]
		if (layer && layer.matrix) {
			// We merge to replace ID and other value with new val
			layer.matrix[position.y][position.x] = Object.assign({}, layer.matrix[position.y][position.x], el)
		}
	}
	getFreePosition (element) {
		if (element) {
			let x = 0
			let y = 0
			let found = false
			// while we found free position
			while (!found) {
				x = Math.round(Math.random() * config.map.cols)
				if(x === config.map.cols) x--
				y = Math.round(Math.random() * config.map.rows)
				if(y === config.map.rows) y--
				found = this.isFreePosition(x, y, element.canHover)
			}
			return {x, y}
		}
	}
	isFreePosition (x, y, canHover) {
		console.log(x, y, canHover)
		let free = false
		let stop = false
		// Check on all layers
		Object.keys(this.layers).forEach((layerName) => {
			const layer = this.layers[layerName]
			if (!stop && _.indexOf(canHover, layer.matrix[y][x].val) > - 1) free = true
			else {
				free = false
				stop = true
			}
		})
		return free
	}
	dispatchMouvement (element) {
		Streamy.broadcast('gameStream', {data: element})
	}
	startGhostMoving (id) {
		Object.keys(this.ghostsById).forEach((id, index) => {
			this.move(id)
		})
	}
	move (id) {
		const ghost = this.ghostsById[id]
		const deplacements = ghost.deplacements
		const possibilities = deplacements.length - 1
		let sens = ghost.orientation
		this.promise(sens, ghost, deplacements).then(
			(ghost, direction) => {
				// SUCCESS
				const layer = this.layers.ghost
				ghost.orientation = direction
				var from = { x: x, y: y }
											// translation (from, to) {
											// 	this.matrix[to.y][to.x] = Object.assign({}, this.matrix[from.y][from.x])
											// 	this.matrix[from.y][from.x] = {
											// 		id : guid(), // IMPORTANT TO CHANGE THIS ID
											// 		val : 0
											// 	}
											// }
				var to = { x: ghost.x, y: ghost.y }
				layer.translation(from, to)
				let mvt = 32
				var refreshId = setInterval(() => {
				  if (mvt > 0) {
						switch (direction) {
							case 'down':
								y++
								break

							case 'up':
								y--
								break

							case 'right':
								x++
								break

							case 'left':
								x--
								break

							default:
								return false
						}
					} else {
						this.move(id)
						clearInterval(refreshId);
					}
					this.dispatchMouvement(ghost)
					mvt--
				}, 100);
			},
			(id) => {
				// FAIL
				console.log('explosion !!!!')
			}
		).catch((error) => {
		  console.log("error!", error);
		})
	}
	promise (sens, ghost, deplacements) {
		return new Promise((resolve, reject) => {
			var test = 0
	    while(!this.deplacement(sens, ghost)) {
				sens = deplacements[Math.round(Math.random() * 3)]
				test++
				if(test > 20) reject(ghost.id) // lanch explosion
			}
			resolve(ghost, direction)
		})
	}
	deplacement (direction, ghost) {
		var x = ghost.x
		var y = ghost.y
		switch (direction) {
			case 'down':
				if((y + 1) < config.map.rows && this.isFreePosition(x, y + 1, ghost.canHover)) return true
				return false

			case 'up':
				if((y - 1) > 0 && this.isFreePosition(x, y - 1, ghost.canHover)) return true
				return false

			case 'right':
				if((x + 1) < config.map.cols && this.isFreePosition(x + 1, y, ghost.canHover)) return true
				return false

			case 'left':
				if((x - 1) > 0 && this.isFreePosition(x - 1, y, ghost.canHover)) return true
				return false

			default:
				return false
		}
	}
}
