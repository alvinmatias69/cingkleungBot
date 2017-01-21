(function() {

'use strict';

require('dotenv').config();
var axios = require('axios');
let url = 'https://api.telegram.org/bot' + process.env.API_TOKEN + '/';

var telegramService = {
	message: function(chatId, text, keyboard, callback) {
		let body = {
			chat_id		: chatId,
			text		: text
		}

		if (keyboard) {
			body.reply_markup = {};
			body.reply_markup.inline_keyboard = keyboard;
		}
		axios.post(url + 'sendMessage', body)
			.then(function(response) {
				callback(response);
		});
	},

	messageAndAnswerCallback: function(chatId, text, keyboard, callbackQueryId, queryText, callback) {
		axios.post(url + 'sendMessage', {
			chat_id		: chatId,
			text 		: text,
			reply_markup: {
				inline_keyboard: keyboard
			}
		}).then(response => {
			axios.post(url + 'answerCallbackQuery', {
				callback_query_id	: callbackQueryId,
				text 				: queryText
			});
			callback(response);
		})
	},

	answerCallbackQuery: function(callbackQueryId, text) {
		axios.post(url + 'answerCallbackQuery', {
			callback_query_id		: callbackQueryId,
			text 					: queryText
		});
	},

	sticker: function(chatId, stickerId) {
		axios.post(url + 'sendSticker', {
			chat_id	: chatId,
			sticker : stickerId
		});
	}
}

module.exports = telegramService;

})();