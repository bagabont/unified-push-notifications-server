var path = require('path'),
    fs = require('fs');

var rootPath = path.normalize(__dirname + '../../');
var mongoUser = process.env.MONGO_USER;
var mongoPass = process.env.MONGO_PASS;

var connectionString = 'mongodb://' + mongoUser + ':' + mongoPass + '@ds055680.mongolab.com:55680/';

module.exports = {
    development: {
        rootPath: rootPath,
        db: connectionString + 'upns-dev',
        certificate: fs.readFileSync(__dirname + '/cert_dev.pfx'),
        certificatePassphrase: '123456'
    },
    production: {
        rootPath: rootPath,
        db: connectionString + 'upns',
        certificate: fs.readFileSync(__dirname + '/cert_dev.pfx'),
        certificatePassphrase: '123456'
    }
};