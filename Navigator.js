const { EventEmitter } = require('events');
const Navigation = new EventEmitter();
var stack = [];

function CheckLogin(req, res, NavigateIfTrue, NavigateIfFalse='Login') {
    if(req.cookies['Login'] != null){
        res.render(NavigateIfTrue)
      
        Navigation.emit(NavigateIfTrue)
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