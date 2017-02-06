mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessRequests = mongoose.Schema({
	user_id : {type: Number, default: -1},
	eval_result : {type: Number, default: 0}
});

module.exports = mongoose.model('AccessRequests', AccessRequests);