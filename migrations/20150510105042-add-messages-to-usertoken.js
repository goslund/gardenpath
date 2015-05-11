'use strict';

module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('TokenRequests','messages', {
      type: DataTypes.STRING,
      allowNull: false
    })
    done();
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (migration, DataTypes, done) {
    migration.removeColumn('TokenRequests', 'messages');
    done();
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
