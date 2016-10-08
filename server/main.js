import { Meteor } from 'meteor/meteor'
import bodyParser from 'body-parser'
const Fiber = require('fibers')
import Map from './map'

if(Meteor.isServer) {
	Meteor.startup(() => {

		// Express
		app = Express()
		app.use(bodyParser.json())       // to support JSON-encoded bodies
		app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
		  extended: true
		}))

		// Create Map
		let map = new Map(10, 10)

		// BRODCAST LOOP
		// setInterval(function () {
		// 	const y = Math.floor(Math.random() * 10)
		// 	Streamy.broadcast('gameStream', {'y': y, 'date': new Date().toLocaleTimeString()})
		// }, 1000)

		// ROUTE
		app.get('/getContextGame', function (req, res) {
			console.log('send context to new user')
			const context = {
				map: map
			}
			res.json({data: context})
		})
	})
}
