import { Meteor } from 'meteor/meteor'
import bodyParser from 'body-parser'
const Fiber = require('fibers')
import Layer from './layer'
import {config} from '../config'
import {Ghost, Player} from './ghost'
import {guid, setPositionWithDirection} from './utils'
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
		game.addGhosts()
		// game.startGhostMoving()
		// ROUTE
		app.get('/getContextGame', function (req, res) {
			const player = game.addPlayer()
			console.log('send context to new player')
			const context = {
				layers: game.layers,
				ghosts: game.ghostsById,
				players: game.playersById,
				playerId: player.id
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
			'map': mapLayer
		}
  }
	addPlayer () {
		const refSize = this.layers.map.elementRef.size[0] * this.layers.map.elementRef.scale[0]
		const newPlayer = new Player()
		const position = this.getFreePosition(newPlayer)
		console.log('position --> ', position)
		newPlayer.setPosition({
			x: position.x * refSize,
			y: position.y * refSize
		})
		this.playersById[newPlayer.id] = newPlayer
		return newPlayer
	}
	addGhosts () {
		const refSize = this.layers.map.elementRef.size[0] * this.layers.map.elementRef.scale[0]
		for (let i = 0; i < config.ghost.initNumber; i++) {
			const newGhost = new Ghost()
			const position = this.getFreePosition(newGhost)
			newGhost.setPosition({
				x: position.x * refSize,
				y: position.y * refSize
			})
			this.ghostsById[newGhost.id] = newGhost
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
		this.promise(sens, ghost, deplacements)
		.then(
			(ghost, direction) => {
				// SUCCESS
				var x = ghost.x
				var y = ghost.y
				const layer = this.layers.ghost
				ghost.orientation = direction
				layer.replaceObject(x, y, {
					id : guid(), // IMPORTANT TO CHANGE THIS ID
					val : 0
				})
				let mvt = layer.elementRef.size[0]

				function yourFunction(){
				    // do whatever you like here

				    setTimeout(yourFunction, 100);
				}

				yourFunction();
				var refreshId = setInterval(() => {
				  if (mvt > 0) {
						setPositionWithDirection(x, y, direction)
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
	    while(!this.canMove(sens, ghost)) {
				sens = deplacements[Math.round(Math.random() * 3)]
				test++
				if(test > 20) reject(ghost.id) // lanch explosion
			}
			resolve(ghost, direction)
		})
	}
	canMove (direction, ghost) {
		const {x, y} = setPositionWithDirection(ghost.x, ghost.y, direction)
		if (
			y < config.map.rows && // down
			y > 0 && // up
			x < config.map.cols && // right
			x > 0 && // left
			this.isFreePosition(x, y, ghost.canHover)
		) {
			return true
		} else {
			return false
		}
	}
}
