(function () {
   'use strict';
   // this function is strict...
}());
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var RefreshToken = sequelize.define("RefreshToken", {
    token: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    associate: function(models) {
      RefreshToken.belongsTo(models.User, {as: "User", foreignKey: "UserId"});
      RefreshToken.belongsTo(models.Client, {as: "Client", foreignKey: "ClientId"});
    },
    instanceMethods: {
      verifyPassword: function(password, done) {
        return bcrypt.compareSync(password, this.getDataValue('password'));
      }
    }
  });



  return RefreshToken;
};