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
		game.addGhostLayer()
		// BRODCAST LOOP
		// setInterval(function () {
		// 	const y = Math.floor(Math.random() * 10)
		// 	Streamy.broadcast('gameStream', {'y': y, 'date': new Date().toLocaleTimeString()})
		// }, 1000)

		// ROUTE
		app.get('/getContextGame', function (req, res) {
			console.log('send context to new user')
			const context = {
				map: game.map
			}
			res.json({data: context})
		})
	})
}


class Game {
  constructor(map) {
		this.map = new Map(10, 10)
		this.ghosts = []
  }
	addGhostLayer () {
		for (let i = 0; i < config.initGhostNumber; i++) {
			const newGhost = new Ghost(
				this.map,
				this.getFreePosition
			)
			console.log('newGhost', newGhost.id)
			this.ghosts.push(newGhost)
		}
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
}
