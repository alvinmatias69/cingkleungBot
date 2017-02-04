(function() {

'use strict';

const fs = require('fs');

var loggerService = function(req, res, next) {
	let date = new Date();

	let logName = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();

	if (!fs.existsSync('log/' + logName + '.txt')) {
		let header = 'date,query,user,username\n';
		fs.writeFileSync('log/' + logName + '.txt', header, {flag : 'w'});
	}

	const message = req.body;
	let logData = new Date() + ',';
	if (message.hasOwnProperty('callback_query')) {
		logData = logData + message.callback_query.data + ',' + message.callback_query.from.id + ',' + message.callback_query.from.username + '\n';
	}else{
		logData = logData + message.message.text + ',' + message.message.from.id + ',' + message.message.from.username + '\n';
	}
	fs.appendFile('log/' + logName + '.txt', logData);
	next();
}

module.exports = loggerService;

})();