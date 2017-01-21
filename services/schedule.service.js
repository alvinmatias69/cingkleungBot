(function() {

'use strict';

require('dotenv').config();
var axios = require('axios');
let scheduleUrl = process.env.SCHEDULE_URL;

var scheduleService = {
	getSchedule: function(nim, callback) {
		axios.get(scheduleUrl + 'getJadwalSiswa/' + nim)
			.then(function(response) {
				callback(response.data);
			});
	},

	getClassRoom: function(page, roomCode, callback) {
		axios.get(scheduleUrl + 'getJadwal/' + page + '?result_per_page=5&ruangan=' + roomCode)
			.then(function(response) {
				callback(response.data);
			});
	}
}

module.exports = scheduleService;

})();