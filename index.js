(function() {

'use strict';

var app = require('express')();
var bodyParser = require('body-parser');
var cingkleungController = require('./controllers/cingkleung.controller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ 
	type: 'application/json'
}));


app.post('/cingkleung', function(req, res) {
	const message = req.body;
	if (message.hasOwnProperty('data')) {
		switch(message.data){
			case 'schedule_check':
				cingkleungController.scheduleCheck(message, function(response) {
					res.json(JSON.parse(response.config.data));
				});
				break;
			case 'nim_change':
				cingkleungController.nimChange(message, function(response) {
					res.json(JSON.parse(response.config.data));
				});
				break;
			case 'classroom_check':
				cingkleungController.classroomCheck(message, function(response) {
					res.json(JSON.parse(response.config.data));
				});
				break;
			default : 
				cingkleungController.checkPhase(message, function(result) {
					cingkleungController.nextClassrooms(message, result, function(response) {
						res.json(JSON.parse(response.config.data));
					});
				});
				break;
		}
	} else {
		if (message.text == '/start') {
			cingkleungController.start(message, function(response) {
				res.json(JSON.parse(response.config.data));
			});
		} else {
			cingkleungController.checkPhase(message, function(result) {
				if (result == 'input NIM') {
					cingkleungController.nimInput(message, function(response) {
						res.json(JSON.parse(response.config.data));
					});
				}else if(result == 'input classroom code'){
					cingkleungController.showClassrooms(message, function(response) {
						res.json(JSON.parse(response.config.data));
					});
				}else{
					cingkleungController.underMaintenance(message, function(response) {
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