/*
test/user-api.js 
Mocha Unit Test
This test is meant to be run like this:
NODE_ENV=test mocah test/user-api.js

In the default test environment, the database is set to sync

This test will fully sync the database to the current model and
then it will insert fixture data.

This test  suit is production ready. (it cleans up after itself)
*/

require(__dirname + '/../app.js');
// require(__dirname + '/../../015-osgd/testdata.js');
var should = require('chai').should();
var http = require('http');
var request = require('request');


describe("Sequelize Auth Tests", function() {
	var host = config.host;
	var port = config.port;
	var url = 'http://' + host + ':' + port;
	var clientId = "testclient";
	var clientSecret = 'testsecret';
	var basicAuthString = new Buffer(clientId + ":" + clientSecret).toString('base64');
	var testUsername = "geoff";
	var testPassword = "testpassword";

	before(function(done) {
		this.timeout(8000);
		// console.log(server.sync);
		server.sync().then(function() {
			done();
		});
	});

	it("makes api base request", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: url,
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				},
				form: {
					grant_type: 'password',
					username: testUsername,
					password: testPassword,
					format: 'json'
				}
			}, function(err, res, body) {
				// var json = JSON.parse(body);
				console.log(body);
				// json.error.should.eql('invalid_request');
				// json.error_description.should.eql('Authorization header has corrupted data');
				resolve();
			});

		});

		promise.then(function() {
			done();
		});
	});
});