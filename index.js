(function() {

'use strict';

var app = require('express')();
var bodyParser = require('body-parser');
var cingkleungController = require('./controllers/cingkleung.controller');
var loggerService = require('./services/logger.service');
var spamService = require('./services/spam.service');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ 
	type: 'application/json'
}));

app.use(spamService);
app.use(loggerService);

app.post('/cingkleung', function(req, res) {
	const message = req.body;
	if (message.hasOwnProperty('callback_query')) {
		let thisMessage = message.callback_query;
		switch(thisMessage.data){
			case 'schedule_check':
				cingkleungController.scheduleCheck(thisMessage, function(response) {
					res.json(JSON.parse(response.config.data));
				});
				break;
			case 'nim_change':
				cingkleungController.nimChange(thisMessage, function(response) {
					res.json(JSON.parse(response.config.data));
				});
				break;
			case 'classroom_check':
				cingkleungController.classroomCheck(thisMessage, function(response) {
					res.json(JSON.parse(response.config.data));
				});
				break;
			case 'feedback':
				cingkleungController.feedback(thisMessage, function(response) {
					res.json(JSON.parse(response.config.data));
				});
				break;
			default : 
				cingkleungController.checkPhase(thisMessage, function(result) {
					cingkleungController.nextClassrooms(thisMessage, result, function(response) {
						res.json(JSON.parse(response.config.data));
					});
				});
				break;
		}

	} else {

		let thisMessage = message.message;
		if (thisMessage.text == '/start') {
			cingkleungController.start(thisMessage, function(response) {
				res.json(JSON.parse(response.config.data));
			});
		} else {
			cingkleungController.checkPhase(thisMessage, function(result) {
				if (result == 'input NIM') {
					cingkleungController.nimInput(thisMessage, function(response) {
						res.json(JSON.parse(response.config.data));
					});
				}else if(result == 'input classroom code'){
					cingkleungController.showClassrooms(thisMessage, function(response) {
						res.json(JSON.parse(response.config.data));
					});
				}else if(result == 'feedback') {
					cingkleungController.sendFeedback(thisMessage, function(response) {
						res.json(JSON.parse(response.config.data));
					});
				}else{
					cingkleungController.underMaintenance(thisMessage, function(response) {
						res.json(JSON.parse(response.config.data));
					});
				}
			});
		}
	}
});

app.listen(3000, function() {
	console.log(" _________________________________ ");
	console.log("|:::::::::::::;;::::::::::::::::::|");  
	console.log("|:::::::::::'~||~~~``:::::::::::::|");
	console.log("|::::::::'   .':     o`:::::::::::|");
	console.log("|:::::::' oo | |o  o    ::::::::::|");
	console.log("|::::::: 8  .'.'    8 o  :::::::::|");
	console.log("|::::::: 8  | |     8    :::::::::|");
	console.log("|::::::: _._| |_,...8    :::::::::|");
	console.log("|::::::'~--.   .--. `.   `::::::::|");
	console.log("|:::::'     =8     ~  \\ o ::::::::|");
	console.log("|::::'       8._ 88.   \\ o::::::::|");
	console.log("|:::'   __. ,.ooo~~.    \\ o`::::::|");
	console.log("|:::   . -. 88`78o/:     \\  `:::::|");
	console.log("|::'     /. o o \\ ::      \\88`::::|");
	console.log("|:;     o|| 8 8 |d.        `8 `:::|");
	console.log("|:.       - ^ ^ -'           `-`::|");
	console.log("|::.                          .:::|");
	console.log("|:::::.....           ::'     ``::|");
	console.log("|::::::::-'`-        88          `|");
	console.log("|:::::-'.          -       ::     |");
	console.log("|:-~. . .                   :     |"); 
	console.log("| .. .   ..:   o:8      88o       |");
	console.log("|. .     :::   8:P     d888. . .  |");
	console.log("|.   .   :88   88      888'  . .  |");
	console.log("|   o8  d88P . 88   ' d88P   ..   |");
	console.log("|  88P  888   d8P   ' 888         |");
	console.log("|   8  d88P.'d:8  .- dP~ o8       |");
	console.log("|      888   888    d~ o888       |");
	console.log("|_________________________________|");
	console.log("===================================");
	console.log("|The Force is strong with this one|");
	console.log('|              3000               |');
	console.log("===================================");
});

// for testing purposes only
module.exports = app;

})();