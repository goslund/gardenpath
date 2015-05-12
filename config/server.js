path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  express = require('express'),
  session = require('express-session'),
  oauth20 = require('../oauth20.js')(TYPE),
  server = express(),
  // router = express.Router(),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  model = require('../models/' + TYPE),

  restful = require('sequelize-restful'),
  sequelize_fixtures = require('sequelize-fixtures');
oauth20db = require('../app/models');

server.use(bodyParser.json());

var Acl = require('acl'),
  AclSeq = require('acl-sequelize');
  
var api=restful(oauth20db.sequelize, {});
server.use(oauth20.inject());
router = express.Router();
require('../app/routes');
server.use(api);

  // server.all('/*', function(req, res, next) {
  //   // CORS headers
  //   res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  //   // Set custom headers for CORS
  //   res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  //   if (req.method == 'OPTIONS') {
  //     res.status(200).end();
  //   } else {
  //     next();
  //   }
  // });

server.sync = function() {
  var promise = new Promise(function(resolve, reject) {
    var q = oauth20db.sequelize.query('SET FOREIGN_KEY_CHECKS=0;');
    q.then(function(ret) {
      resolve();
    });
  });

  promise = promise.then(function() {

    return new Promise(function(resolve, reject) {
      console.log(config.forceSync);
      var q = oauth20db.sequelize.sync({

        force: config.forceSync
      });
      q.then(function(ret) {

        acl = new Acl(new AclSeq(oauth20db.sequelize, {
          prefix: 'acl_'
        }));

        resolve();
        // console.log(acl);

      })
    });
  });

  promise = promise.then(function() {
    return new Promise(function(resolve, reject) {

      sequelize_fixtures.loadFile('./fixtures/*.json', oauth20db).then(function() {
        resolve();
      })
    })

  })
  return promise;
}

server.set('oauth2', oauth20);

// console.log(server);
// server.set('oauth2', oauth20);


// console.log(module);
// Middleware

server.use(cookieParser());
server.use(session({
  secret: 'oauth20-provider-test-server',
  resave: false,
  saveUninitialized: false
}));
server.use(bodyParser.urlencoded({
  extended: false
}));



// View
server.set('views', './view');
server.set('view engine', 'jade');

// console.log(test);
module.exports = server;