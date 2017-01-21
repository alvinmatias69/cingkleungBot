(function() {

'use strict';

var user = require('../models/user');

var userService = {
	find: function(id, callback) {
		user.findById(id)
			.then(function(result) {
				callback(result);
			});
	},

	findOrCreate: function(id, callback) {
		user.findOrCreate({
			where:{
				user_id: id
			}
		}).
			then(function(result) {
				callback(result);
			});
	},

	addNim: function(id, nim, callback) {
		user.update({
			nim: nim
		}, {
			where:{
				user_id: id
			}
		})
			.then(function(result) {
				callback(result);
			});
	},

	changePhase: function(id, phase) {
		user.update({
			phase: phase
		}, {
			where: {
				user_id: id
			}
		});
	},

	delete: function(id, callback) {
		user.destroy({
			where: {
				user_id: id
			},
			force: true
		})
			.then(function(farmer) {
				callback(farmer);
			});
	}
}

module.exports = userService;

})();