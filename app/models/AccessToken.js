(function () {
   'use strict';
   // this function is strict...
}());
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var AccessToken = sequelize.define("AccessToken", {
    token: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    associate: function(models) {
      AccessToken.belongsTo(models.User, {as: "User", foreignKey: "UserId"});
      AccessToken.belongsTo(models.Client, {as: "Client", foreignKey: "ClientId"});
    },
    instanceMethods: {
      verifyPassword: function(password, done) {
        return bcrypt.compareSync(password, this.getDataValue('password'));
      }
    }
  });



  return AccessToken;
};