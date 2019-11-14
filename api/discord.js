const express = require('express');
require('dotenv').config()
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');
const router = express.Router();
const User = require("../User")


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://localhost:3000/api/discord/callback');

router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});


router.get('/callback', catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            },
        });
    const json = await response.json();
    
    
    
    //res.redirect(`/?token=${json.access_token}`);
    var userInfo = await getUserinfo(json.access_token)
    res.cookie('Login', userInfo.id)
    res.cookie('Token', json.access_token)
    res.redirect("../../dashboard")
    //User.Login(req,response);
    User.SaveUserInfo(userInfo.id, userInfo.username,json.access_token)
}));


async function getUserinfo(token) {

    const fetchDiscordUserInfo = await fetch('http://discordapp.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    const userInfo = await fetchDiscordUserInfo.json();
    //TODO get password from box
    return userInfo;
    
}

module.exports = router;