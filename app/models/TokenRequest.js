(function () {
   'use strict';
   // this function is strict...
}());
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
	var TokenRequest = sequelize.define("TokenRequest", {
		remoteAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		statusCode: {
			type: DataTypes.INTEGER,
			allowNull: false,
			length: 3
		},
		messages: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		associate: function(models) {
			// TokenRequest.belongsTo(models.UserToken, {as: "Token", foreignKey: 'TokenId'});
			TokenRequest.belongsTo(models.User, {as: "User", foreignKey: 'UserId'});
			TokenRequest.belongsTo(models.Client, {as: "Client", foreignKey: 'ClientId'});
		},
		instanceMethods: {
		}
	});



	return TokenRequest;
};