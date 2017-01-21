(function() {

'use strict';

require('dotenv').config();
var userService = require('../services/user.service');
var scheduleService = require('../services/schedule.service');
var telegramService = require('../services/telegram.service');
var axios = require('axios');

let url = 'https://api.telegram.org/bot' + process.env.API_TOKEN + '/';
let keyboard = [
	[{
		text: 'Lihat Jadwal',
		callback_data: 'schedule_check'
	}],
	[{
		text: 'Ganti NIM',
		callback_data: 'nim_change'
	}],
	[{
		text: 'Cek Ruangan',
		callback_data: 'classroom_check'
	}]
];

var cingkleungController = {

	// called when user chat this bot at the first or when user chat '/start'
	start: function(message, callback) {
		userService.findOrCreate(message.from.id, function(result) {
			let text = '';
			let thisKeyboard = keyboard;
			if (result[1]) {
				text = 'silahkan masukan NIM anda (10 digit numerik)';
				userService.changePhase(message.from.id, 'input NIM');
				thisKeyboard = null;
			} else {
				text = 'selamat datang di Cingkleung Bot';
				userService.changePhase(message.from.id, 'not allowed');
			}
			telegramService.message(message.from.id, text, thisKeyboard, function(response) {
				callback(response);
			});
		});
	},

	// called when user click on cek jadwal on inline keyboard
	scheduleCheck: function(message, callback) {
		userService.find(message.from.id, function(result) {
			scheduleService.getSchedule(result.nim, function(schedule) {
				let text = '';
				let queryText = '';
				let thisKeyboard = keyboard;
				if (schedule.nama == 'Student not found') {

					text = 'mohon maaf, nim yang anda simpan mengandung karakter alfabetikal atau memiliki digit yang tidak sesuai (tidak sama dengan 10).\nTolong perbaiki nim anda';
					thisKeyboard = [
						[{
							text: 'Ganti NIM',
							callback_data: 'nim_change'
						}]
					];
					queryText = 'Jadwal tidak ditemukan';

				}else{

					text = 'Jadwal mahasiswa dengan NIM ' + schedule.nim + ' :\n';
					let tmp = 0;
					let jadwal = [];
					for (var i = 0; i < schedule.total; i++) {
						jadwal = schedule.jadwal[i];
						tmp = i + 1;
						text = text + tmp + ') ' + jadwal.hari + ' (' + jadwal.ruangan + ') ' + jadwal.jam_mulai + ' s.d. ' + jadwal.jam_selesai + ' - ' + jadwal.nama_mk + ' (' + jadwal.kode_dosen + ')\n';
					}
					queryText = 'Jadwal ' + schedule.nama;
				}

				telegramService.messageAndAnswerCallback(message.from.id, text, thisKeyboard, message.id, queryText, function(response) {
					userService.changePhase(message.from.id, 'not allowed');
					callback(response);
				});
			});
		});
	}, 

	// called when user input nim and user phase at 'input NIM'
	nimInput: function(message, callback) {
		if (isNaN(message.text) || message.text.length != 10) {
			telegramService.sticker(message.from.id, 'BQADAgADAwoAAlOx9wObqIK1QH3pnQI');
			telegramService.message(message.from.id, 'NIM yang anda input tidak valid\nInput NIM dalam bentuk 10 digit numerik', null, function(response) {
				callback(response);
			});
		} else {
			userService.addNim(message.from.id, message.text, function(result) {
				telegramService.message(message.from.id, 'NIM berhasil disimpan', keyboard, function(response) {
					userService.changePhase(message.from.id, 'not allowed');
					callback(response);
				});
			});
		}
	},

	// called when user click on change nim inline keyboard
	nimChange: function(message, callback) {
		userService.find(message.from.id, function(result) {
			let text = 'NIM anda saat ini adalah : ' + result.nim + '\nNIM yang anda kirim akan mengganti NIM anda';
			let thisKeyboard = [
				[{
					text: 'Kembali ke menu utama',
					callback_data: 'schedule_check'
				}]
			];
			telegramService.messageAndAnswerCallback(message.from.id, text, thisKeyboard, message.id, 'Ganti NIM', function(response) {
				userService.changePhase(message.from.id, 'input NIM');
				callback(response);
			});
		});
	},

	// called to check what phase user in
	checkPhase: function(message, callback) {
		userService.find(message.from.id, function(result) {
			callback(result.phase);
		});
	},

	classroomCheck: function(message, callback) {
		let text = 'Silahkan masukkan nomor ruangan untuk mengecek jadwal pada ruangan tersebut \nps: nomor ruangan tidak perlu terlalu lengkap (A303, A30, 303, etc)';
		let thisKeyboard = [
			[{
				text: 'Kembali ke menu utama',
				callback_data: 'schedule_check'
			}]
		];
		telegramService.messageAndAnswerCallback(message.from.id, text, thisKeyboard, message.id, 'Cek Ruangan', function(response) {
			userService.changePhase(message.from.id, 'input classroom code');
			callback(response);
		});
	},

	showClassrooms: function(message, callback) {		
		scheduleService.getClassRoom(1, message.text, function(result) {
			let text = 'Hasil pencarian query "' + message.text + '" (' + result.current_page + '/' + result.last_page + ') :\n';
			let tmp = 1;
			let jadwal;
			for (var i = 0; i < 5; i++) {
				jadwal = result.jadwal[i];
				text = text + tmp + ') ' + jadwal.hari + ' (' + jadwal.ruangan + ') ' + jadwal.jam_mulai + ' s.d. ' + jadwal.jam_selesai + ' - ' + jadwal.nama_mk + ' (' + jadwal.kode_dosen + ')\n';
				tmp = tmp + 1;
			}

			let thisKeyboard = [
				[{
					text: 'Kembali ke menu utama',
					callback_data: 'schedule_check'
				}]
			];

			if (result.current_page != result.last_page) {
				thisKeyboard.unshift([{
					text: 'Selanjutnya',
					callback_data: String(result.current_page + 1)
				}]);
			}

			telegramService.message(message.from.id, text, thisKeyboard, function(response) {
				userService.changePhase(message.from.id, message.text);
				callback(response);
			});

			if(message.hasOwnProperty('data')){
				telegramService.answerCallbackQuery(message.id, 'Cek Jadwal');
			}
		});
	},

	nextClassrooms: function(message, query, callback) {
		scheduleService.getClassRoom(message.data, query, function(result) {
			let text = 'Hasil pencarian query "' + query + '" (' + result.current_page + '/' + result.last_page + ') :\n';
			let tmp = 5 * (message.data - 1);
			let jadwal;
			for (var i = 0; i < 5; i++) {
				jadwal = result.jadwal[i];
				tmp = tmp + 1;
				text = text + tmp + ') ' + jadwal.hari + ' (' + jadwal.ruangan + ') ' + jadwal.jam_mulai + ' s.d. ' + jadwal.jam_selesai + ' - ' + jadwal.nama_mk + ' (' + jadwal.kode_dosen + ')\n';
			}

			let thisKeyboard = [
				[{
					text: 'Kembali ke menu utama',
					callback_data: 'schedule_check'
				}]
			];

			if (result.current_page != result.last_page) {
				thisKeyboard.unshift([{
					text: 'Selanjutnya',
					callback_data: String(result.current_page + 1)
				}]);
			}

			telegramService.messageAndAnswerCallback(message.from.id, text, thisKeyboard, message.id, 'Cek Jadwal', function(response) {
				callback(response);
			});
		});	
	},

	// under maintenance message
	underMaintenance: function(message, callback) {
		telegramService.sticker(message.chat.id, 'BQADAgADKQYAAlOx9wOn00VadK1TAgI');
		telegramService.message(message.chat.id, 'Mohon maaf, cingkleung bot masih berada dalam tahap pengembangan. Mohon bersabar untuk menikmati semua fiturnya', keyboard, function(response) {
			callback(response);
		});
	},

	// under maintenance message
	underMaintenanceCallback: function(message) {
		telegramService.sticker(message.from.id, 'BQADAgADKQYAAlOx9wOn00VadK1TAgI');
		telegramService.messageAndAnswerCallback(message.from.id, 'Mohon maaf, cingkleung bot masih berada dalam tahap pengembangan. Mohon bersabar untuk menikmati semua fiturnya', keyboard, message.id, 'Under Maintenance', function(response) {
			res.end();
		});
	}
}

module.exports = cingkleungController;

})();