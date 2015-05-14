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
	var accessToken = "";
	var refreshToken = "";
	var url = 'http://' + host + ':' + port;
	console.log(url);
	var clientId = "testclient";
	var clientSecret = 'testsecret';
	var basicAuthString = new Buffer(clientId + ":" + clientSecret).toString('base64');
	var testUsername = "geoff";
	var testPassword = "testpassword";
	before(function(done) {
		this.timeout(20000);
		// console.log(server.sync);
		// server.sync().then(function() {
		// 	done();
		// });
		done();
	});

	it("should deny request without token", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.get({
				url: url + '/api'
			}, function(err, res, body) {
				// console.log(err);
				var json = JSON.parse(body);
				// console.log(json);
				// console.log(res.statusCode);
				res.statusCode.should.eql(403);
				json.error.should.equal('access_denied');
				json.error_description.should.eql('Bearer token not found');
				resolve();
			});
		});
		promise.then(function() {
			done();
		});
	});

	it("should deny request with bad token", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.get({
				url: url + '/api',
				headers: {
					'Authorization': 'Bearer ' + "sometoken"
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);
				// console.log(json);
				// console.log(res.statusCode);
				res.statusCode.should.eql(403);
				json.error.should.equal('forbidden');
				json.error_description.should.eql('Token not found or expired');
				resolve();
			});
		});

		promise.then(function() {
			done();
		});
	});

	it("should login successfully and generate a token", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: url + '/token',
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				},
				json: {
					grant_type: 'password',
					username: testUsername,
					password: testPassword,
					format: 'json'
				}
			}, function(err, res, body) {
				// console.log(body);
				(typeof body).should.eql('object');
				// console.log(err);
				// var json = JSON.parse(body);
				res.statusCode.should.eql(200);

				(typeof body.refresh_token).should.eql('string');
				refreshToken = body.refresh_token;

				(typeof body.access_token).should.eql('string');
				accessToken = body.access_token;

				body.token_type.should.eql('bearer');

				(typeof body.expires_in).should.eql('number');
				body.expires_in.should.eql(3600);
				resolve()
			});
		});

		promise.then(function() {
			done();
		})
	});



	it("should make the api request successfully", function(done) {
		var promise = new Promise(function(resolve, reject) {


			request.get({
				url: url + '/api',
				headers: {
					'Authorization': 'Bearer ' + accessToken
				},
				json: {
					format: 'json'
				}
			}, function(err, res, body) {
				// console.log(body);
				resolve();
			});
		});
		promise.then(function() {
			done();
		});
	});

	it("should make the Users request successfully", function(done) {
		var promise = new Promise(function(resolve, reject) {


			request.get({
				url: url + '/api/Users',
				headers: {
					'Authorization': 'Bearer ' + accessToken
				},
				json: {
					format: 'json'
				}
			}, function(err, res, body) {
				console.log(body);
				resolve();
			});
		});
		promise.then(function() {
			done();
		});
	});
});