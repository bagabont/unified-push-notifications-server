var https = require('https'),
    http = require('http'),
    passport = require('passport'),
    express = require('express');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var app = express();

// Load configuration
require('./config/mongoose')(config);
require('./config/passport')(passport);
require('./config/express')(app, passport);

var options = {
    pfx: config.certificate,
    passphrase: config.certificatePassphrase
};

var server;

if (env === "production") {
    // Create an HTTPS service.
    server = https.createServer(options, app);
}
else {
    // Create an HTTP service.
    server = http.createServer(app);
}


module.exports = server;


