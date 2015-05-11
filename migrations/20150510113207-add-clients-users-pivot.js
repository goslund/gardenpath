'use strict';

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable(
      'ClientsUsers', {
        ClientId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: 'Clients',
          referenceKey: 'id'
        },
        UserId: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        },
        messages: {
          type: DataTypes.TEXT,
          allowNull: false
        }
      }, {
        engine: 'MYISAM', // default: 'InnoDB'
        charset: 'latin1' // default: null
      }
      // logic for transforming into the new state
    );

    done();
  }, // sets the migration as finished
  down: function(migration, DataTypes, done) {
    // logic for reverting the changes
    migration.dropTable('ClientsUsers');
    done() // sets the migration as finished
  }
}