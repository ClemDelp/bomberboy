import { Meteor } from 'meteor/meteor'
import bodyParser from 'body-parser'
const Fiber = require('fibers')
import Layer from './layer'
import {config, layers} from '../config'
import {Ghost, Player} from './ghost'
import {guid, getRandomInt} from './utils'
import heightmap from 'heightmap-generator'

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
		// ROUTES
		app.get('/getContextGame', function (req, res) {
			const player = game.addPlayer()
			const context = {
				layers: game.layers,
				ghosts: game.ghostsById,
				players: game.playersById,
				playerId: player.id
			}
			res.json({data: context})
		})

		app.post('/teleportation', function (req, res) {
			var body = req.body
			if (body && body.type) {
				switch (body.type) {
					case 'player':
						const freePosition = game.getFreePosition(body)
						res.json({data: freePosition})
						break;
					default:
						res.json({error: 'type not supported...'})
				}
			}

		})
	})
}
class Game {
  constructor (map) {
		// PARAMETERS
		this.ghostsById = {}
		this.playersById = {}
		this.layers = {}
		// SET BLOCK LAYER
		let blockLayer = new Layer()
		let treesLayers = new Layer()
		// let tilemap = layers.blockLayer
		// let tilemap = layers.isoLayers
		let tilemap = layers.isoTilesMap
		if (config.map.perlin) {
			// PERLIN
			let size = config.map.rows / 10
			if (size < 1) size = 1
			let levels = tilemap.elements.length
			var noise = heightmap(size, levels, config.map.reverseMap, 1)
			for(x = 0; x < noise.length; x++) {
		    for(y = 0; y < noise[x].length; y++) {
					const val = noise[x][y] - 1
					if (tilemap.elements[val]) blockLayer.setVal(x, y, tilemap.elements[val])
		    }
			}
		} else {
			for(var y = 0; y < blockLayer.cols; y++) {
				for(var x = 0; x < blockLayer.rows; x++) {
					var val = 0
					if(Math.random() * 10 % 2 > 1) {
						var elIndex = getRandomInt(0, tilemap.elements.length - 1)
						var val = tilemap.elements[elIndex]
					}
					blockLayer.setVal(x, y, val)
				}
			}
		}
		// TREES LAYERS
		if (config.map.trees) {
			const treesElements = layers.treesLayers.elements
			for (var yy = 0; yy < blockLayer.rows; yy++) {
				for (var xx = 0; xx < blockLayer.cols; xx++) {
					var ii = getRandomInt(0, treesElements.length - 1)
					var treeElement = treesElements[ii]
					if(getRandomInt(0, 3) === 3) {
						// IF THIS TREE CAN BE ON THIS GROUND TYPE
						const supportBlockElement = blockLayer.getVal(yy, xx)
						if (treeElement.canHover.indexOf(supportBlockElement.type) > -1) {
							treeElement.isoZ = supportBlockElement.isoZ + 100
							treesLayers.setVal(yy, xx, treeElement)
						}
					}
				}
			}
		}
		// DEFINE LAYERS
		this.layers = {
			'block': blockLayer,
			'trees': treesLayers
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
		const newGhost = new Ghost()
		const position = this.getFreePosition(newGhost)
		newGhost.setPosition({
			x: position.x * refSize + (refSize - (config.ghost.size[0] * config.ghost.scale[0])) / 2,
			y: position.y * refSize + (refSize - (config.ghost.size[1] * config.ghost.scale[1])) / 2
		})
		this.ghostsById[newGhost.id] = newGhost
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
				found = this.isFreePosition(x, y, element)
			}
			return {x, y}
		}
	}
	isFreePosition (x, y, element) {
		let free = false
		let stop = false
		// Check on all layers
		const layer = this.layers.block
		const supportBlockElement = layer.getVal(y, x)
		if (element.canHover.indexOf(supportBlockElement.type) > -1) {
			element.isoZ = supportBlockElement.isoZ + 100
			return true
		} else return false
	}
	getMatrixCoordWithPosition (x, y) {
		const refSize = this.getRefSize()
		const col = Math.floor(x / refSize)
		const row = Math.floor(y / refSize)
		return {col, row}
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
				// --------------------------
				// remove ghost
				Streamy.broadcast('gameStream', {
					type: 'rm',
					data: [ghost]
				})
				delete this.ghostsById[ghost.id]
				// create new ghost 2 second after
				setTimeout(() => {
					const newGhost = this.addGhost()
					Streamy.broadcast('gameStream', {
						type: 'add',
						data: newGhost
					})
				}, 2000)
				// --------------------------
				// Delete blocks around
				const {col, row} = this.getMatrixCoordWithPosition(ghost.x, ghost.y)
				const coordsAround = {
					topLeft: [col - 1, row - 1],
					top: [col, row - 1],
					topRight: [col + 1, row - 1],
					left: [col + 1, row],
					right: [col - 1, row],
					bottomLeft: [col - 1, row + 1],
					bottom: [col, row + 1],
					bottomRight: [col + 1, row + 1]
				}
				var coords = []
				const blocks = Object.keys(coordsAround).reduce((result, key) => {
					const matrix = this.layers.block.matrix
					const col = coordsAround[key][0]
					const row = coordsAround[key][1]
					if (
						row < matrix.length &&
						row > 0 &&
						col < matrix[0].length &&
						col > 0
					) {
						coords.push({col, row})
						result.push(matrix[row][col])
					}
					return result
				}, [])
				// stream
				Streamy.broadcast('gameStream', {
					type: 'rm',
					data: blocks.map((block) => {
						return Object.assign({}, {id: block.id}, block.val)
					})
				})
				// Remove blocks
				coords.forEach((coord) => {
					this.layers.block.matrix[coord.col][coord.row].val = 0
				})
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
		if (this.isFreePosition(colIndex, rowIndex, ghost)) {
			ghost.x = x
			ghost.y = y
			return true
		}
		return false
	}
}
