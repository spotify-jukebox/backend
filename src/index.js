const express = require('express')
const bodyParser = require('body-parser')

const idGenerator = require('./id-generator')
const notificationSender = require('./notification-sender')

let app = express()
let port = process.env.PORT || 3000
app.use(bodyParser.json())

let clients = {"tiger-wolf-dog": {"device_token": "dummy", "name": "pileet"}}

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
				name: req.body.name ? req.body.name : "No name"
			}

			res.json({token: id})
			break
		}
	}
})

app.post("/list/:token/", require_list, (req, res) => {
	if (req.body.track_url) {	
		//notificationSender(req.client.name, req.body.track_url)
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

app.get("/", function(req, res) {
	res.json({status: "ok"})
})

app.listen(port, function () {
	  console.log('Listening on port ' + port)
})
