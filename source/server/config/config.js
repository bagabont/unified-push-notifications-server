var path = require('path'),
    fs = require('fs');

var rootPath = path.normalize(__dirname + '../../');
var mongoUser = process.env.MONGO_USER;
var mongoPass = process.env.MONGO_PASS;
var gcmApiKey = process.env.GCM_API_KEY;

var connectionString = 'mongodb://' + mongoUser + ':' + mongoPass + '@ds055680.mongolab.com:55680/';

module.exports = {
    development: {
        rootPath: rootPath,
        db: connectionString + 'upns-dev',
        certificate: fs.readFileSync(__dirname + '/cert_dev.pfx'),
        certificatePassphrase: '123456',
        gcmApiKey: gcmApiKey
    },
    production: {
        rootPath: rootPath,
        db: connectionString + 'upns',
        certificate: fs.readFileSync(__dirname + '/cert_dev.pfx'),
        certificatePassphrase: '123456',
        gcmApiKey: gcmApiKey
    }
};