var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt-nodejs')
const DB = require("./Database.js");
DB.connect();

var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
}
var engine = require('consolidate');
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/documentation", express.static(__dirname + "/documentation"));
app.use("/css", express.static(__dirname + "/css"));

app.use(express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({
	extended: true
}));


app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.use(allowCrossDomain);
app.get('/', function (req, res) {
	res.render('dashboard')
})

app.post('/', async function (req, res) {
	res.send('POST hello world')
})

app.post('/new_user', async function (req, res) {
	console.log("Post new user")
	console.log(req.body)
	var voornaam = req.body.voornaam;
	var achternaam = req.body.achternaam;
	var email = req.body.email;
	var gebruikersnaam = req.body.gebruikersnaam;
	var paswoord = req.body.paswoord;
	var table = "gebruikers";

	bcrypt.hash(paswoord, null, null, function (err, hash) {
		if (err) {
			res.sendStatus(500);
			res.end();
		} else {
			DB.connect()
			DB.insert(`INSERT INTO ${table} (voornaam,achternaam,email,gebruikersnaam,paswoord) VALUES ('${voornaam}', '${achternaam}', '${email}', '${gebruikersnaam}', '${hash}')`)
			DB.disconnect()
			res.sendStatus(200);
			res.end();
		}
	})
	console.log(voornaam, achternaam, email, gebruikersnaam, paswoord)
})

Object.prototype.parseSqlResult = function () {
    return JSON.parse(JSON.stringify(this[0]))
}

app.post('/login', async function (req, res) {
	console.log("LOGIN ATTEMPT")
	var gebruikersnaam = req.body.gebruikersnaam;
	DB.connect().then(
		await DB.getData(`SELECT * from gebruikers where Gebruikersnaam = '${gebruikersnaam}' limit 1`).then(data => {
			let result = data.parseSqlResult()
			if (bcrypt.compareSync(req.body.paswoord, result.Paswoord)) {
				try{
				console.log("SUCCES")
				res.status(200).json({ "Status": "OK" })
				//res.send("SUCCES")
				//res.redirect("dashboard.html")
				res.end()
				DB.disconnect().catch()
				}catch(err){
					console.log(err)
				}
			} else {
				console.log("FAILURE")
				res.status(403).json({ "Reason": "INCORRECT PASSWORD" })
				res.end()
				DB.disconnect().catch()
			}
		}).catch()
	).catch()
})


app.use(function(req, res, next){
    res.status(404).render('404_error_template', {title: "Sorry, page not found"});
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});