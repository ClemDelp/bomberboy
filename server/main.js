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
		game.startGhostMoving()
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
	getRefSize () {
		return this.layers.map.elementRef.size[0] * this.layers.map.elementRef.scale[0]
	}
	addPlayer () {
		const refSize = this.getRefSize()
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
		const refSize = this.getRefSize()
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
	startGhostMoving () {
		Object.keys(this.ghostsById).forEach((id, index) => {
			console.log(id, ' start moving...')
			this.move(id)
		})
	}
	move (id) {
		const ghost = this.ghostsById[id]
		const deplacements = ghost.deplacements
		this.promise(ghost, deplacements)
		.then(
			(ghost) => {
				// RESOLVE
				console.log('broadcast ', ghost.x, ' ', ghost.y)
				Streamy.broadcast('gameStream', {data: ghost})
				setTimeout(() => {
					this.move(ghost.id)
				}, 100)
			},
			(ghost) => {
				// REJECT
				console.log('explosion !!!!')
			}
		).catch((error) => {
		  console.log("error!", error)
		})
	}
	promise (ghost, deplacements) {
		return new Promise((resolve, reject) => {
			var test = 0
	    while(!this.canMove(ghost)) {
				console.log(test)
				ghost.orientation = deplacements[Math.round(Math.random() * 3)]
				test++
				if(test > 20) reject(ghost) // lanch explosion
			}
			resolve(ghost)
		})
	}
	canMove (ghost) {
		const refSize = this.getRefSize()
		const steps = ghost.velocity
		const orientation = ghost.orientation
		const {x, y} = setPositionWithDirection(ghost.x, ghost.y, orientation, steps)
		const colIndex = Math.floor(x / refSize)
		const rowIndex = Math.floor(y / refSize)
		if (this.isFreePosition(colIndex, rowIndex, ghost.canHover)) {
			ghost.x = x
			ghost.y = y
			return true
		}
		return false
	}
}
