'use strict';

module.exports = {
  //migration is sequelize, DataTypes is datatypes, done is callback
  up: function(migration, DataTypes, done) {
    migration.addColumn('Users','enabled', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    })

    done();
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    // migration
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('Users', 'enabled');
    done();
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};