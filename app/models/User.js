(function () {
   'use strict';
   // this function is strict...
}());
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    firstname: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function(value) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(value, salt);
        // console.log(hash);
        this.setDataValue('password', hash);
      }
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    associate: function(models) {
      User.belongsToMany(models.Client, {as: "Users", foreignKey: "UserId", through: "ClientsUsers"});
      // User.hasMany(models.UserToken, {as: "Tokens", foreignKey: "UserId"});
      // User.hasMany(models.TokenRequest, { as: "TokenRequests", foreignKey: "TokenId"});
      User.hasMany(models.TokenRequest, {as: "TokenRequest", foreignKey: "UserId"});

    },
    instanceMethods: {
      verifyPassword: function(password, done) {
        return bcrypt.compareSync(password, this.getDataValue('password'));
      }
    }
  });



  return User;
};