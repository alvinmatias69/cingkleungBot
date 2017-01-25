(function() {

'use strict';

const fs = require('fs');

var loggerService = function(req, res, next) {
	if (!fs.existsSync('log/log.txt')) {
		let header = 'date,query,user,username\n';
		fs.writeFileSync('log/log.txt', header, {flag : 'w'});
	}

	const message = req.body;
	let logData = new Date() + ',';
	if (message.hasOwnProperty('callback_query')) {
		logData = logData + message.callback_query.data + ',' + message.callback_query.from.id + ',' + message.callback_query.from.username + '\n';
	}else{
		logData = logData + message.message.text + ',' + message.message.from.id + ',' + message.message.from.username + '\n';
	}
	fs.appendFile('log/log.txt', logData);
	next();
}

module.exports = loggerService;

})();