(function() {

'use strict';

require('dotenv').config();
var userService = require('../services/user.service');
var scheduleService = require('../services/schedule.service');
var telegramService = require('../services/telegram.service');
var axios = require('axios');

let url = 'https://api.telegram.org/bot' + process.env.API_TOKEN + '/';
let keyboard = [
	{
		text: 'Lihat Jadwal',
		callback_data: 'schedule_check'
	},
	{
		text: 'Ganti NIM',
		callback_data: 'nim_change'
	},
	{
		text: 'Cek Ruangan',
		callback_data: 'classroom_check'
	}
];

var cingkleungController = {

	// called when user chat this bot at the first or when user chat '/start'
	start: function(message) {
		userService.findOrCreate(message.from.id, function(result) {
			telegramService.message(message.chat.id, "silahkan masukan NIM anda (10 digit numerik)", keyboard, function(response) {
				res.end();
			});
		});
	},

	// called when user click on cek jadwal on inline keyboard
	scheduleCheck: function(message) {
		userService.find(message.callbackQuery.from.id, function(result) {
			scheduleService.getSchedule(result.nim, function(schedule) {
				let text = '';
				let queryText = '';
				if (schedule.nama == 'Student not found') {

					text = 'mohon maaf, nim yang anda simpan mengandung karakter alfabetikal atau memiliki digit yang tidak sesuai (tidak sama dengan 10).\nTolong perbaiki nim anda';
					keyboard = [{
						{
							text: 'Ganti NIM',
							callback_data: 'nim_change'
						}
					}];
					queryText = 'Jadwal tidak ditemukan';

				}else{

					text = 'Jadwal mahasiswa dengan NIM ' + schedule.nim + ' :\n';
					let tmp = 0;
					for (var i = 0; i < schedule.total; i++) {
						let jadwal = schedule.jadwal[i];
						tmp = i + 1;
						text = text + tmp + ') ' + jadwal.hari + ' (' + jadwal.ruangan + ') ' + jadwal.jam_mulai + ' s.d. ' + jadwal.jam_selesai + ' - ' + jadwal.nama_mk + ' (' + jadwal.kode_dosen + ')\n';
					}
					queryText = 'Jadwal ' + schedule.nama;

				}
				telegramService.messageAndAnswerCallback(message.chat.id, text, keyboard, message.callbackQuery.id, queryText, function(response) {
					userService.changePhase(message.callbackQuery.from.id, 'not allowed');
					res.end();
				});
			});
		});
	}, 

	// called when user input nim and user phase at 'input NIM'
	nimInput: function(message) {
		if (isNaN(message.text) || message.text.length != 10) {
			telegramService.sticker(message.chat.id, 'BQADAgADAwoAAlOx9wObqIK1QH3pnQI');
			telegramService.message(message.chat.id, 'NIM yang anda input tidak valid\nInput NIM dalam bentuk 10 digit numerik', null, function(response) {
				res.end();
			});
		} else {
			userService.addNim(message.from.id, message.text, function(result) {
				telegramService.message(message.chat.id, 'NIM telah berhasil disimpan', keyboard, function(response) {
					userService.changePhase(message.callbackQuery.from.id, 'not allowed');
					res.end();
				});
			});
		}
	},

	// called when user click on change nim inline keyboard
	nimChange: function(message) {
		userService.find(message.from.id, function(result) {
			let text = 'NIM anda saat ini adalah : ' + result.nim + '\nNIM yang anda kirim akan mengganti NIM anda';
			keyboard = [
				{
					text: 'Kembali ke menu utama',
					callback_data: 'schedule_check'
				}
			];
			telegramService.messageAndAnswerCallback(message.chat.id, text, keyboard, message.callbackQuery.id, 'Ganti NIM', function(response) {
				userService.changePhase(message.callbackQuery.from.id, 'input NIM');
				res.end();
			});
		});
	},

	// called to check what phase user in
	checkPhase: function(message, callback) {
		userService.find(message.from.id, function(result) {
			callback(result.phase);
		});
	},

	// under maintenance message
	underMaintenance: function(message) {
		telegramService.sticker(message.chat.id, 'BQADAgADKQYAAlOx9wOn00VadK1TAgI');
		telegramService.message(message.chat.id, 'Mohon maaf, cingkleung bot masih berada dalam tahap pengembangan. Mohon bersabar untuk menikmati semua fiturnya', keyboard, function(response) {
			res.end();
		});
	},

	// under maintenance message
	underMaintenanceCallback: function(message) {
		telegramService.sticker(message.chat.id, 'BQADAgADKQYAAlOx9wOn00VadK1TAgI');
		telegramService.messageAndAnswerCallback(message.chat.id, 'Mohon maaf, cingkleung bot masih berada dalam tahap pengembangan. Mohon bersabar untuk menikmati semua fiturnya', keyboard, message.callbackQuery.id, 'Under Maintenance', function(response) {
			res.end();
		});
	}
}

module.exports = cingkleungController;

})();