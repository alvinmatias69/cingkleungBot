(function() {

'use strict';

var sequelize = require('./index');
var DataTypes = require('sequelize/lib/data-types');

var feedbacks = sequelize.define('feedbacks', {
	user_id: {
		type: DataTypes.FLOAT
	},
	feedback: {
		type: DataTypes.TEXT,
	}
}, {
	underscored: true,
	freezeTableName: true,
	paranoid: true
});

module.exports = feedbacks;

})();