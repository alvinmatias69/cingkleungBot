(function() {

'use strict';

var spamService = function(req, res, next) {
	const message = req.body;
	let user;
	if (message.hasOwnProperty('callback_query')) {
		user = message.callback_query.from.id;
	}else{
		user = message.message.from.id;
	}

	if (user == '302707362') {
		res.end();
	}else{
		next();
	}
}

module.exports = spamService;

})();