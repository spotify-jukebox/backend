const express = require('express')
const bodyParser = require('body-parser')

let app = express()
let port = process.env.PORT || 3000
app.use(bodyParser.json())

let clients = {}

function send_notification(device_id, url) {

}

app.post('/generate', function (req, res) {
	let device_token = req.body.device_token
	
	let token_id = Math.ceil(Math.random()*10000)
	clients[token_id] = token_id

	res.json({token: token_id.toString()})
})

app.post("/addTrack/:token", function (req, res) {
	let token_id = req.params.token
	
		if (clients[token_id]) {
			send_notification(clients[token_id], req.body.track_url)
			res.json({status: "ok"})
		}
		else {
			res.json({error: "Invalid token"})
		}
})
app.listen(port, function () {
	  console.log('Example app listening on port 3000!')

})
