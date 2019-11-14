const { EventEmitter } = require('events');
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

const profiles = new EventEmitter();

profiles.on('route', ({ req, elapsedMS }) => {
    console.log(req.method, req.url, `${elapsedMS}ms`);
});

profiles.on('middleware', ({ req, name, elapsedMS }) => {
    console.log(req.method, req.url, ':', name, `${elapsedMS}ms`);
});


module.exports = {
    "wrap": wrap

}