import { Meteor } from 'meteor/meteor'
import bodyParser from 'body-parser'
import Game from './Game'

if (Meteor.isServer) {
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
			if (
				message &&
				message.type &&
				message.data
			) {
				const data = message.data
				switch (message.type) {
					case 'rmMainPlayer':
						if (game.playersById[data.id]) {
							game.playersById = Object.keys(game.playersById).reduce((newPlayersById, currId) => {
								const player = game.playersById[currId]
								if (data.id !== currId) newPlayersById[currId] = player
								return newPlayersById
							}, {})
							game.playersById[data.id].y = data.y
						}
						break

					case 'updateMainPlayer':
						if (game.playersById[data.id]) {
							game.playersById[data.id].x = data.x
							game.playersById[data.id].y = data.y
						}
						break
				}
			}
		})
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
						break

					default:
						res.json({error: 'type not supported...'})
				}
			}
		})
	})
}
