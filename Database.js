var mysql = require('mysql');
var con;

function connect() {
	return new Promise(function (resolve, reject) {
		con = mysql.createConnection({
			host: "localhost"
			, user: "bot"
			, password: "bot"
			, database: "discord"
		});
		con.connect(function (err) {
			if (err) reject(err);
			resolve();
			console.log("Connection created");
		});
	})
}
async function disconnect() {
	return new Promise(function (resolve, reject) {
		try {
			con.end(async function (err) {
				if (err) reject(err)
				resolve(true)
				console.log(`Disconnected`)
			});
		} catch (error) {
			reject(error)
		}
	})
}
async function isConnected() {
	return new Promise(async function (resolve, reject) {
		if (!con) reject("Database is not connected, run DB.connect()")
		con.connect(async function (err) {
			if (err) reject(err)
			resolve(true)
			console.log(`Database is connected`)
		});
	})
}
/*
 *Only execute this once to create the database, fill in the name of the database in the database field.
 */
async function newDB(name) {
	console.log("Connected!");
	con.query(`CREATE DATABASE ${name} `, async function (err, result) {
		if (err) throw err;
		console.log("Database created");
	});
}
/*
 *Execute this for each server, so if server is new, call this, only when server is new
 */
async function newTable(table) {
	return new Promise(async function (resolve, reject) {
		try {
			var select = `select * from ${table} limit 1`
			con.query(select, async function (err, result) {
				if (err) reject(err)
				if (result == undefined || result.length == 0) {
					var sql = `CREATE TABLE ${table} (ID Integer, UserId Integer, UserName VARCHAR(255))`;
					con.query(sql, async function (err, result) {
						if (err) reject(err)
						resolve(true)
						console.log(`New table created ${table}`)
					});
				}
				else {
					resolve(true)
					console.log(`Table already exists!`)
				}
			})
		}
		catch (e) {
			reject();
			console.log(e)
		}
	});
}
async function getData(sql) {
	try {
		console.log(`Data requested`);
		return new Promise(async function (resolve, reject) {
			await con.query(sql
				, async function (err, result) {
					if (err) reject(err);
					resolve(result);
				})
		})
	} catch (err) {

	}
}


async function insertData(table, UserId, UserName) {
	return new Promise(async function (resolve, reject) {
		console.log("Trying to insert data");
		console.log(table, UserId, UserName);
		var sql = `INSERT INTO ${table} (UserId, UserName) VALUES ('${UserId}', '${UserName}')`;
		con.query(sql, async function (err, result) {
			if (err) reject(err)
			resolve(true)
			console.log(`Data inserted`)
		})
	})
}

async function insert(sql) {
	return new Promise(async function (resolve, reject) {
		console.log("Trying to insert data");
		con.query(sql, async function (err, result) {
			if (err) reject(err)
			resolve(true)
			console.log(`Data inserted`)
		})
	})
}
module.exports = {
	isConnected: isConnected
	, newDB: newDB
	, newTable: newTable
	, insertData: insertData
	, connect: connect
	, disconnect: disconnect
	, getData: getData
	, insert: insert
}