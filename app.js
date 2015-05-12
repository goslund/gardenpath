// Run tests via "npm --type=TYPE test" (types available: memory (default), redis are available)
TYPE = process.env.npm_config_type || 'sequelize';
env = process.env.NODE_ENV || 'development';
var
    query = require('querystring'),
    express = require('express');
config = require('./config/config.js');
server = require('./config/server');
// Middleware. User authorization


// Expose functions
// console.log(server);
// console.log(config);

var start = function() {
    var sync = new Promise(function(resolve, reject) {
        //if in staging or development only, sync the database
        //NODE_ENV=local
        // console.log(config.forceSync)
        if (config.sync) {
            server.sync().then(function() {
                resolve("");
            });
        } else {
            resolve();
        }
    });

    sync.then(function() {
        server.listen(config.port, config.host, function(err) {
            if (err) console.error(err);
            else console.log('Server started at ' + config.host + ':' + config.port);
        });
    });


};

start();