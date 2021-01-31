const bodyParser = require("body-parser");

const express = require('express')
const app = express();
const port = 3000;

const Challenges = require("./challenges.js");
const DataManager = require("./dataManager.js");
const { url } = require('inspector');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  	console.log(`App listening at http://localhost:${port}`)
});

let challenges = new Challenges(5, 60000);
let dataManager = new DataManager(5000);

app.post('/getchallenge', (req, res) => {

	let [challenge, id, timeout] = challenges.generate();

	let response = {
		statusText: `Client verification in progress. This should take under a minute...` ,
		color: "green",
		challenge: challenge,
		id: id,
		timeout: timeout,
	}

  	res.send(response)
});

app.post('/solution', (req, res) => {
	let solution = req.body.solution;
	let id = req.body.id;

	let response;

	if(!isNaN(id) && challenges.isSolution(solution, id)) {
		response = {
			statusText: `Verificated in ${(Math.round((new Date().getTime() - parseInt(id)) / 1000))} seconds!` ,
			color: "green",
			token: dataManager.generateToken(),
		}
	} else {
		response = {
			statusText: `Verification was invalid or timed out!` ,
			color: "red",
			token: '',
		}
	}
  	res.send(response)
});

app.get('/userdata/:token', (req, res) => {
	let data = dataManager.getData(req.params.token)
	res.sendFile(data);
});

/*
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
	if (text.trim() === 'status') {
		console.log(`Open challenges: ${challenges.get().toString()}`);
	}
});
*/


