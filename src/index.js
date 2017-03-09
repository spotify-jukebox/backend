const express = require('express')
const bodyParser = require('body-parser')

let app = express()
let port = process.env.PORT || 3000
app.use(bodyParser.json())

let clients = {}

function send_notification(device_id, url) {

}

function generate_id(length) {
	let words = ["alligator", "ant","bear","bee","bird","camel","cat","cheetah","chicken","chimpanzee","cow",
				"crocodile","deer","dog","dolphin","duck","eagle","elephant","fish","fly","fox","frog","giraffe",
				"goat","goldfish","hamster","hippopotamus","horse","kangaroo","kitten","lion","lobster","monkey",
				"octopus","owl","panda","pig","puppy","rabbit","rat","scorpion","seal","shark","sheep","snail",
				"snake","spider","squirrel","tiger","turtle","wolf","zebra"]

	let res = ""
	for(let i = 0; i < length; i++) {
		let word = words[Math.floor(Math.random()*words.length)]
		res += word	

		if (i < length - 1) {
			res += "-"
		}
	}

	return res
}

app.post('/generate', function (req, res) {
	let device_token = req.body.device_token

	while(true) {
		let id = generate_id(3)
		
		if (!clients[id]) {
			clients[id] = {'device_token': device_token}
			res.json({token: id})

			break
		}
	}
})

app.post("/addTrack/:token", function (req, res) {
	let token_id = req.params.token
	
	if (clients[token_id]) {
		if (req.body.track_url) {	
			send_notification(clients[token_id], req.body.track_url)
			res.json({status: "ok"})
		}
		else {
			res.json({error: "Give url"})
		}
	}
	else {
		res.json({error: "Invalid token"})
	}
})

app.listen(port, function () {
	  console.log('Listening on port ' + port)
})
