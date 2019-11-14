const { EventEmitter } = require('events');
const Navigation = new EventEmitter();
const User = require('./User.js')
var stack = [];



function CheckLogin(req, res, NavigateIfTrue, NavigateIfFalse='Login') {
    if(req.cookies['Login'] != null && req.cookies['Token'] != null){
        User.GetUserInfo(req.cookies['Login']).then(u => {
            if(req.cookies['Token'] == u.token){
                try {
                    res.render(NavigateIfTrue)
                    Navigation.emit(NavigateIfTrue)
                } catch (error) {
                    //console.log(error)
                }
               
            }else{
                res.render(NavigateIfFalse)
                stack.push(NavigateIfFalse)
            }
        })
	}else{
        res.render(NavigateIfFalse)
        stack.push(NavigateIfFalse)
	}
}

function Previous(req, res){
    res.render(stack[stack.length - 1])
}


module.exports = {
    "CheckLogin" : CheckLogin,
    "Previous" : Previous
}