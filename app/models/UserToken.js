(function () {
   'use strict';
   var bcrypt = require('bcrypt');
   // this function is strict...
}());


module.exports = function(sequelize, DataTypes) {
	var UserToken = sequelize.define("UserToken", {
		refreshToken: {
			type: DataTypes.STRING,
			allowNull: false
		},
		accessToken: {
			type: DataTypes.STRING,
			allowNull: false
		},
		expiresIn: {
			type: DataTypes.DATE
		},
		tokenType: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// granted: {
		// 	type: DataTypes.BOOLEAN,
		// 	allowedNull: false
		// }
	}, {
		associate: function(models) {
			UserToken.belongsTo(models.TokenRequest, {as: "TokenRequest", foreignKey: "TokenRequestId"});
		},
		instanceMethods: {
		}
	});



	return UserToken;
};