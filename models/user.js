(function() {

'use strict';

var sequelize = require('./index');
var DataTypes = require('sequelize/lib/data-types');

var users = sequelize.define('users', {
	user_id:{
		type: DataTypes.FLOAT,
		primaryKey: true
	},
	nim:{
		type: DataTypes.STRING,
		allowNull: true
	},
	phase:{
		type: DataTypes.STRING,
		allowNull: true
	}
}, {
	underscored: true,
	freezeTableName: true,
	paranoid: true
});

module.exports = users;

})();