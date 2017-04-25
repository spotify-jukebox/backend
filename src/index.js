const express = require('express')
const bodyParser = require('body-parser')

const idGenerator = require('./id-generator')
const notificationSender = require('./notification-sender')

let app = express()
let port = process.env.PORT || 3000
app.use(bodyParser.json())

let clients = {"tiger-wolf-dog": {"device_token": "dummy", "name": "pileet", "tracks": [], "queue": []}}

let require_list = (req, res, next) => {
	if (req.params.token && clients[req.params.token]) {
		req.client = clients[req.params.token]
		next()
	}
	else {
		res.status(400).json({error: "Token is required"})
	}	
}

app.post('/generate', (req, res) => {
	let device_token = req.body.device_token

	if (!device_token) {
		res.status(400).json({error: "Device token is required"})
		return 
	}

	while(true) {
		let id = idGenerator(3)
		
		if (!clients[id]) {
			clients[id] = {
				device_token: device_token,
				name: req.body.name ? req.body.name : "No name",
				tracks: [],
				queue: []
			}

			console.log("Created host", clients[id])

			res.json({token: id})
			break
		}
	}
})

app.post("/list/:token/", require_list, (req, res) => {
	const track_url = req.body.track_url

	if (track_url) {	
		notificationSender(req.client.device_token, track_url)
		req.client.tracks.push(track_url)
		req.client.queue.push(track_url)

		res.json({status: "ok"})
	}
	else {
		res.status(400).json({error: "Track URI is required"})
	}
})

app.get("/list/:token", require_list, (req, res) => {
	res.json({
		name: req.client.name
	})
})

app.get("/list/:token/tracks", require_list, (req, res) => {
	res.json({
		tracks: req.client.tracks
	})
})

app.get("/list/:token/queue", require_list, (req, res) => {
	res.json({
		tracks: req.client.queue
	})

	req.client.queue = []
})


app.get("/", function(req, res) {
	res.json({status: "ok"})
})

app.listen(port, function () {
	  console.log('Listening on port ' + port)
})
