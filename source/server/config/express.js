var bodyParser = require('body-parser'),
    User = require('../models/user');

module.exports = function (config, app, passport) {
    app.disable('x-powered-by');
    app.disable('etag');
    app.use(passport.initialize());

    var services = require('../routes/services')(passport),
        events = require('../routes/events')(config, passport, bodyParser),
        subscribers = require('../routes/subscribers')(passport);

    // set API routers
    app.use('/api/v1', services);
    app.use('/api/v1', subscribers);
    app.use('/api/v1', events);

    app.use(function (req, res, next) {
        res.status(404).send({status: 404, url: req.url});
    });

    // error handler
    app.use(function (err, req, res) {
        // do not expose error data in production
        var errorData = app.get('env') === 'development' ? err : {};
        res.status(err.statusCode || 500)
            .send({
                message: err.message,
                error: errorData
            });
    });

    (function createAdminAccount() {
        User.findOne({username: 'admin'}, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                return
            }
            user = new User({
                username: 'admin',
                password: 'admin'
            });
            user.save(function (err) {
                if (err) {
                    throw err;
                }
                console.log('Admin account created!');
            });
        });
    })();
};