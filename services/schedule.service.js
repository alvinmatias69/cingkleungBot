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
	}
}

module.exports = scheduleService;

})();