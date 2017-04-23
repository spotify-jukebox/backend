const express = require('express')
const bodyParser = require('body-parser')
const apn = require('apn')

let app = express()
let port = process.env.PORT || 3000
app.use(bodyParser.json())

let options = {
	cert: process.env.CERT || "cert/cert.pem",
	key: process.env.KEY || "cert/key.pem",
	production: false
}
let apnProvider = new apn.Provider(options);

let clients = {}

let require_list = (req, res, next) => {
	if (req.params.token && clients[req.params.token]) {
		req.client = clients[req.params.token]
		next()
	}
	else {
		res.status(400).json({error: "Invalid token"})
	}	
}

let send_notification = (device_id, url) => {
	let note = new apn.Notification()

	note.expiry = Math.floor(Date.now() / 1000) + 3600
	note.payload = {'track_url': url}
	note.topic = "fi.vaaraj.jukeboxly"

	apnProvider.send(note, deviceToken).then( (result) => {
	} )
}

let generate_id = (length) => {
	let words = ["alligator", "ant","bear","bee","bird","camel","cat","cheetah","chicken","chimpanzee","cow",
				"crocodile","deer","dog","dolphin","duck","eagle","elephant","fish","fly","fox","frog","giraffe",
				"goat","goldfish","hamster","hippopotamus","horse","kangaroo","kitten","lion","lobster","monkey",
				"octopus","owl","panda","pig","puppy","rabbit","rat","scorpion","seal","shark","sheep","snail",
				"snake","spider","squirrel","tiger","turtle","wolf","zebra"]

	return new Array(length)
		.fill(undefined)
		.map(_ => words[Math.floor(Math.random() * words.length)])
		.join("-")
}

app.post('/generate', (req, res) => {
	let device_token = req.body.device_token

	if (!device_token) {
		res.status(400).json({error: "Give device token"})
		return 
	}

	while(true) {
		let id = generate_id(3)
		
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
		//send_notification(req.client.name, req.body.track_url)
		res.json({status: "ok"})
	}
	else {
		res.status(400).json({error: "Give url"})
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
