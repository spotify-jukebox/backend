const apn = require('apn')

const options = {
	cert: process.env.CERT || "cert/cert.pem",
	key: process.env.KEY || "cert/key.pem",
	production: false
}

let apnProvider = new apn.Provider(options);

module.exports = (device_id, url) => {
	let note = new apn.Notification()

	note.expiry = Math.floor(Date.now() / 1000) + 3600
	note.badge = 0;
	note.sound = "";
	note.alert = "";
	note.payload = {'track_url': url}
	note.topic = "fi.vaaraj.jukeboxly"

	apnProvider.send(note, device_id).then(result => {
		console.log(result)
	} ).catch(err => {
		console.log(err)
	})
}