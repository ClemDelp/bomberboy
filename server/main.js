import { Meteor } from 'meteor/meteor'
import bodyParser from 'body-parser'
const Fiber = require('fibers')
import Layer from './layer'
import {config, layers} from '../config'
import {Ghost, Player} from './ghost'
import {guid, getRandomInt} from './utils'

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
		Streamy.on('gameStream', (message) => {
			if (message.data) {
				data = message.data
				if (game.playersById[data.id]) {
					game.playersById[data.id].x = data.x
					game.playersById[data.id].y = data.y
				}
			}
		});
		game.initGhosts()
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
		// SET GROUND LAYER
		let groundLayer = new Layer()
		for(var y = 0; y < groundLayer.cols; y++) {
      for(var x = 0; x < groundLayer.rows; x++) {
        var elIndex = getRandomInt(0, layers.groundLayer.elements.length - 1)
				var el = layers.groundLayer.elements[elIndex]
        groundLayer.setVal(x, y, el)
      }
    }
		// SET BLOCK LAYER
		let blockLayer = new Layer()
		for(var y = 0; y < blockLayer.cols; y++) {
      for(var x = 0; x < blockLayer.rows; x++) {
				var val = 0
				if(Math.random() * 10 % 2 > 1) {
					var elIndex = getRandomInt(0, layers.blockLayer.elements.length - 1)
					var val = layers.blockLayer.elements[elIndex]
        }
        blockLayer.setVal(x, y, val)
      }
    }
		// DEFINE LAYERS
		this.layers = {
			'map': groundLayer,
			'block': blockLayer
		}
  }
	getRefSize () {
		return config.map.squareSize
	}
	addPlayer () {
		const refSize = this.getRefSize()
		const newPlayer = new Player()
		const position = this.getFreePosition(newPlayer)
		newPlayer.setPosition({
			x: position.x * refSize,
			y: position.y * refSize
		})
		this.playersById[newPlayer.id] = newPlayer
		Streamy.broadcast('newPlayer', {data: newPlayer})
		return newPlayer
	}
	initGhosts () {
		for (let i = 0; i < config.map.defaultGhostNumber; i++) {
			this.addGhost()
		}
	}
	addGhost () {
		const refSize = this.getRefSize()
		console.log('new ghost')
		const newGhost = new Ghost()
		const position = this.getFreePosition(newGhost)
		newGhost.setPosition({
			x: position.x * refSize + (refSize - (config.ghost.size[0] * config.ghost.scale[0])) / 2,
			y: position.y * refSize + (refSize - (config.ghost.size[1] * config.ghost.scale[1])) / 2
		})
		this.ghostsById[newGhost.id] = newGhost
		console.log(newGhost.id, ' start moving...')
		this.move(newGhost.id)
		return newGhost
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
		const layer = this.layers.block
		if (
				!stop &&
				layer.matrix[y] &&
				layer.matrix[y][x] &&
				_.indexOf(canHover, layer.matrix[y][x].val) > - 1
		) {
			free = true
		} else {
			free = false
			stop = true
		}
		return free
	}
	move (id) {
		const ghost = this.ghostsById[id]
		const deplacements = ghost.deplacements
		this.promise(ghost, deplacements)
		.then(
			(ghost) => {
				// RESOLVE
				Streamy.broadcast('gameStream', {
					type: 'mvt',
					data: ghost
				})
				setTimeout(() => {
					this.move(ghost.id)
				}, config.ghost.speed)
			},
			(ghost) => {
				// remove ghost
				Streamy.broadcast('gameStream', {
					type: 'rm',
					data: ghost
				})
				delete this.ghostsById[ghost.id]
				console.log('explosion !!!!')
				// create new ghost 2 second after
				setTimeout(() => {
					const newGhost = this.addGhost()
					Streamy.broadcast('gameStream', {
						type: 'add',
						data: newGhost
					})
				}, 2000)
			}
		)
	}
	promise (ghost, deplacements) {
		return new Promise((resolve, reject) => {
			for (let test = 0; test < config.ghost.triesBeforeExplosion; test++) {
				if (this.canMove(ghost)) {
					resolve(ghost)
					break;
				}
				else ghost.orientation = deplacements[Math.round(Math.random() * 3)]
			}
			reject(ghost)
		})
	}
	canMove (ghost) {
		const refSize = this.getRefSize()
		const spaceX = (refSize - (config.ghost.size[0] * config.ghost.scale[0])) / 2
		const spaceY = (refSize - (config.ghost.size[1] * config.ghost.scale[1])) / 2
		const steps = ghost.velocity
		const orientation = ghost.orientation
		const ghostW = config.ghost.size[0] * config.ghost.scale[0]
		const ghostH = config.ghost.size[0] * config.ghost.scale[0]
		let colIndex = 0
		let rowIndex = 0
		let x = ghost.x
		let y = ghost.y
		switch (orientation) {
			case 'down':
				y = y + steps
				colIndex = Math.floor((x + (ghostW / 2)) / refSize)
				rowIndex = Math.floor((y + ghostH) / refSize)
				break

			case 'up':
				y = y - steps
				colIndex = Math.floor((x + (ghostW / 2)) / refSize)
				rowIndex = Math.floor(y / refSize)
				break

			case 'right':
				x = x + steps
				colIndex = Math.floor((x + ghostW) / refSize)
				rowIndex = Math.floor((y + ghostH / 2) / refSize)
				break

			case 'left':
				x = x - steps
				colIndex = Math.floor(x / refSize)
				rowIndex = Math.floor((y + (ghostH / 2)) / refSize)
				break
		}
		if (this.isFreePosition(colIndex, rowIndex, ghost.canHover)) {
			ghost.x = x
			ghost.y = y
			return true
		}
		return false
	}
}
