const bcrypt = require('bcrypt-nodejs')
const DB = require("./Database.js");


function register(req, res) {
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
            res.status(200)
            res.render("Login")
            //res.end();
        }
    })
    console.log(voornaam, achternaam, email, gebruikersnaam, paswoord)
}

Object.prototype.parseSqlResult = function () {
    return JSON.parse(JSON.stringify(this[0]))
}

async function login(req, res) {
    console.log("LOGIN ATTEMPT")
    var gebruikersnaam = req.body.gebruikersnaam;
    DB.connect().then(
        await DB.getData(`SELECT * from gebruikers where Gebruikersnaam = '${gebruikersnaam}' limit 1`).then(data => {
            let result = data.parseSqlResult()
            if (bcrypt.compareSync(req.body.paswoord, result.Paswoord)) {
                try {
                    res.cookie('Login', req.body.gebruikersnaam)
                    console.log("SUCCES")
                    res.status(200).json({ "Status": "OK" })


                    //res.send("SUCCES")
                    //res.redirect("dashboard.html")
                    res.end()
                    DB.disconnect().catch()
                } catch (err) {
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
}
function logout() {

}

module.exports = {
    "Logout": logout,
    "Login": login,
    "Register": register

}