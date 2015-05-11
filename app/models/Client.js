(function () {
   'use strict';
   // this function is strict...
}());
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var Client = sequelize.define("Client", {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    secret: {
    	type: DataTypes.STRING,
    	unique: true
    },
    redirectUri: {
    	type: DataTypes.STRING,
    	unique: true
    }
  }, {
    associate: function(models) {
      Client.hasMany(models.TokenRequest, {as: "Tokens", foreignKey: "ClientId"});
    },
    instanceMethods: {
      verifyPassword: function(password, done) {
        return bcrypt.compareSync(password, this.getDataValue('password'));
      }
    }
  });



  return Client;
};