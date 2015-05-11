(function () {
   'use strict';
   // this function is strict...
}());


module.exports = function(sequelize, DataTypes) {
  var ClientsUsers = sequelize.define("ClientsUsers", {
      messages: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "[]"
      }
  });



return ClientsUsers;
};