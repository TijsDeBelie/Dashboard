var cookieParser = require('cookie-parser')
var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt-nodejs')
const { EventEmitter } = require('events');



//LOGGING PERFORMANCE

function wrap(fn) {
	// Function takes 2 arguments
	if (fn.length === 2) {
		return function (req, res) {
			const start = Date.now();
			res.once('finish', () => profiles.emit('middleware', {
				req,
				name: fn.name,
				elapsedMS: Date.now() - start
			}));
			return fn.apply(this, arguments);
		};
	} else if (fn.length === 3) {
		return function (req, res, next) {
			const start = Date.now();
			fn.call(this, req, res, function () {
				profiles.emit('middleware', {
					req,
					name: fn.name,
					elapsedMS: Date.now() - start
				});

				next.apply(this, arguments);
			});
		};
	} else {
		throw new Error('Function must take 2 or 3 arguments');
	}
}

app.use(wrap(function (req, res, next) {
	next();
}));

const profiles = new EventEmitter();

profiles.on('route', ({ req, elapsedMS }) => {
	console.log(req.method, req.url, `${elapsedMS}ms`);
});

profiles.on('middleware', ({ req, name, elapsedMS }) => {
	console.log(req.method, req.url, ':', name, `${elapsedMS}ms`);
});


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

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser())


app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.use(allowCrossDomain);
app.route('/')
	.get(function (req, res) {
		navigator.CheckLogin(req, res, 'Dashboard')
	})
	.post(async function (req, res) {
		res.send('POST hello world')
	})

app.post('/new_user', async function (req, res) {
	User.Register(req, res);
})



app.post('/login', async function (req, res) {
	User.Login(req, res);
})


app.use(function (req, res, next) {
	res.status(404).render('404_error_template', { title: "Sorry, page not found" });
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});