var cookieParser = require('cookie-parser')
var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt-nodejs')

const performance = require("./performance.js")






app.use(performance.wrap(function (req, res, next) {
	next();
}));




//END LOGGING PERFORMANCE

const DB = require("./Database.js");

//Custom functions
const navigator = require('./Navigator.js')
const User = require("./User.js")
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


app.use('/api/discord', require('./api/discord'));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser())


app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.use(allowCrossDomain);



/*
*
------GET-----
*
*/

app.get('/', async function (req, res) {
	navigator.CheckLogin(req, res, 'dashboard')
})

app.get('/dashboard', async function (req, res) {

	//res.render("dashboard")
	navigator.CheckLogin(req, res, 'dashboard')
})

app.get('/login', async function (req, res) {
	navigator.CheckLogin(req, res, 'dashboard')
})

app.get("/getUserInfo", async function (req, res) {
	User.GetUserInfo(req.query.id).then(u => {
		res.status(200).send(u);
	})
})



/*
*
------POST-----
*
*/
app.post('/login', async function (req, res) {
	User.Login(req, res);
})

app.post('/new_user', async function (req, res) {
	User.Register(req, res);
})



/*
*
------ROUTE-----
*
*/
app.route("/logout")
	.all(function (req, res) {
		User.Logout(req, res);
	})

/* app.route('*')
	.get(function (req, res) {
		navigator.CheckLogin(req, res, req.url.substring(1))
	})
	.post(async function (req, res) {
		res.send('POST hello world')
	}) */









/* 
app.use(function (req, res, next) {
	res.status(404).render('404_error_template', { title: "Sorry, page not found" });
}); */

app.listen(3000, () => {
	console.log("Server running on port 3000");
});

/* app.use((err, req, res, next) => {
	switch (err.message) {
	  case 'NoCodeProvided':
		return res.status(400).send({
		  status: 'ERROR',
		  error: err.message,
		});
	  default:
		return res.status(404).render('404_error_template', { title: "Sorry, page not found" });
	}
  }); */