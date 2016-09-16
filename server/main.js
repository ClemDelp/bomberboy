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
		console.log(map)
		console.log(map.matrix)

		// INSERT IN DB
		// Fiber(function () {
		// 	Log.insert({
		// 		datetime: new Date()
		// 	}, function (error, response) {
		// 		console.log('new log (id: ' + response + ') in db, total logs ---> ', Log.find().count())
		// 	})
		// }).run()

		// ROUTE
		// app.get('/getScoreInRealTime', function (req, res) {
		// 	console.log('/getScoreInRealTime')
		// 	// Test sream
		// 	setInterval(function () {
		// 		const y = Math.floor(Math.random() * 10)
		// 		Streamy.broadcast('scoreStream', {'y': y, 'date': new Date().toLocaleTimeString()})
		// 	}, 3000)
		// 	res.json({data: 'response from /getScoreInRealTime...'})
		// })
	})
}
