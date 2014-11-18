var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Result = new Schema({
    eid: {type: String},
    provider: {type: String},
    data: {}
});

Result.virtual('object').get(function () {
    return 'result';
});

module.exports = mongoose.model('results', Result);
