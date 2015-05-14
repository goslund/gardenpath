/*
test/auth-password.js 
Mocha Unit Test
This test is meant to be run like this:
NODE_ENV=test mocah test/auth-password.js

This test will fully sync the database to the current model and
then it will insert fixture data.

This test is -not- production ready.
*/

require(__dirname + '/../app.js');
// require(__dirname + '/../../015-osgd/testdata.js');
var should = require('chai').should();
var http = require('http');
var request = require('request');


describe("Sequelize Auth Tests", function() {
	var host = config.host;
	var port = config.port;
	var url = 'http://' + host + ':' + port + '/token';
	var testUserName = "geoff";
	var testPassword = "testpassword";
	var clientId = "testclient";
	var clientSecret = 'testsecret';
	var badAuthString = new Buffer("test:test").toString('base64');
	var basicAuthString = new Buffer(clientId + ":" + clientSecret).toString('base64');
	var badUserName = "admin";
	var badPassword = "admin";
	var refreshToken = '';
	var accessToken = '';

	before(function(done) {
		this.timeout(12000);
		// console.log(server.sync);
		server.sync().then(function() {
			done();
		});
	});



	it("should log no client credentials", function(done) {

		var promise = new Promise(function(resolve, reject) {

			// console.log(url); 
			request.post({
				url: url
			}, function(err, res, body) {
				// console.log(body);
				// console.log('here');
				// console.log(err);
				var json = JSON.parse(body);
				json.error.should.eql('invalid_request');
				json.error_description.should.eql('No authorization header passed');
				resolve();
			});

		});


		promise.then(function() {
			new Promise(function(resolve, reject) {
				var promise = oauth20db.TokenRequest.findAll();
				promise.then(function(requests) {

					requests.length.should.eql(1);
					requests[0].remoteAddress.should.eql('127.0.0.1');
					requests[0].statusCode.should.eql(400);
					// console.log(requests[0]);

					(typeof requests[0].RefreshTokenId).should.eql('object');
					((requests[0].RefreshTokenId) === null).should.eql(true);

					(typeof requests[0].AccessTokenId).should.eql('object');
					((requests[0].AccessTokenId) === null).should.eql(true);

					(typeof requests[0].ClientId).should.eql('object');
					((requests[0].ClientId) === null).should.eql(true);

					(typeof requests[0].UserId).should.eql('object');
					((requests[0].UserId) === null).should.eql(true);

					var messages = JSON.parse(requests[0].messages);

					// messages[0].should.eql('user authentication error');
					// messages[1].should.eql('auth header not provided');
					done();
				});
			});
		});
	});

	it("should log corrupted client credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: url,
				headers: {
					'Authorization': 'Basic test:test'
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);
				// console.log(body);
				json.error.should.eql('invalid_request');
				json.error_description.should.eql('Authorization header has corrupted data');
				resolve();
			});

		});

		promise.then(function() {
			new Promise(function(resolve, reject) {
				var promise = oauth20db.TokenRequest.findAll();
				promise.then(function(requests) {

					requests.length.should.eql(2);
					//remember we're on the second test now!!
					requests[1].remoteAddress.should.eql('127.0.0.1');
					requests[1].statusCode.should.eql(400);

					(typeof requests[1].RefreshTokenId).should.eql('object');
					((requests[1].RefreshTokenId) === null).should.eql(true);

					(typeof requests[1].AccessTokenId).should.eql('object');
					((requests[1].AccessTokenId) === null).should.eql(true);

					(typeof requests[1].ClientId).should.eql('object');
					((requests[1].ClientId) === null).should.eql(true);

					(typeof requests[1].UserId).should.eql('object');
					((requests[1].UserId) === null).should.eql(true);

					// var messages = JSON.parse(requests[1].messages);

					// messages[0].should.eql('user authentication error');
					// messages[1].should.eql('auth header corrupted');
					done();
				});
			});
		});
	});

	it("should log correct client credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: url,
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);

				json.error.should.eql('invalid_request');
				json.error_description.should.eql('Body does not contain grant_type parameter');
				resolve();
			});

		});

		promise.then(function() {
			new Promise(function(resolve, reject) {
				var promise = oauth20db.TokenRequest.findAll();
				promise.then(function(requests) {

					requests.length.should.eql(3);
					//remember we're on the third test now!!
					requests[2].remoteAddress.should.eql('127.0.0.1');
					requests[2].statusCode.should.eql(400);

					(typeof requests[2].AccessTokenId).should.eql('object');
					((requests[2].AccessTokenId) === null).should.eql(true);

					(typeof requests[2].RefreshTokenId).should.eql('object');
					((requests[2].RefreshTokenId) === null).should.eql(true);

					(typeof requests[2].ClientId).should.eql('number');
					requests[2].ClientId.should.eql(1);

					(typeof requests[2].UserId).should.eql('object');
					((requests[2].UserId) === null).should.eql(true);

					var messages = JSON.parse(requests[2].messages);

					messages[0].should.eql('user authentication error');
					messages[1].should.eql('client auth accepted');
					done();
				});
			});
		});
	});

	it("should reject bad client credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: url,
				headers: {
					'Authorization': 'Basic ' + badAuthString
				},json:{
					grant_type: 'password'
				}
			}, function(err, res, body) {
				console.log(body);
				// var json = JSON.parse(body);
				res.statusCode.should.eql(401);
				body.error.should.eql('invalid_client');
				body.error_description.should.eql('Client not found');

				resolve();
			});
		});

		promise.then(function() {
			new Promise(function(resolve, reject) {
				var promise = oauth20db.TokenRequest.findAll();
				promise.then(function(requests) {

					requests.length.should.eql(4);
					//remember we're on the third test now!!
					requests[3].remoteAddress.should.eql('127.0.0.1');
					requests[3].statusCode.should.eql(401);

					// console.log(requests[3]);
					(typeof requests[3].AccessTokenId).should.eql('object');
					((requests[3].AccessTokenId) === null).should.eql(true);

					(typeof requests[3].RefreshTokenId).should.eql('object');
					((requests[3].RefreshTokenId) === null).should.eql(true);

					(typeof requests[3].ClientId).should.eql('object');
					((requests[3].ClientId) === null).should.eql(true);

					(typeof requests[3].UserId).should.eql('object');
					((requests[3].UserId) === null).should.eql(true);

					var messages = JSON.parse(requests[3].messages);

					messages[0].should.eql('user authentication error');
					messages[1].should.eql('client auth denied');
					done();
				});
			});
		});

	});

	it("should reject bad username credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: url,
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				},
				json: {
					grant_type: 'password',
					username: badUserName,
					password: badPassword,
					format: 'json'
				}
			}, function(err, res, body) {
				// var json = JSON.parse(body);
				res.statusCode.should.eql(401);
				// console.log(json);
				body.error.should.eql('invalid_client');
				body.error_description.should.eql('User not found');
				// console.log(err);
				// console.log(body);
				resolve();
			});
		});

		promise.then(function() {
			new Promise(function(resolve, reject) {
				var promise = oauth20db.TokenRequest.findAll();
				promise.then(function(requests) {

					requests.length.should.eql(5);
					//remember we're on the third test now!!
					requests[4].remoteAddress.should.eql('127.0.0.1');
					requests[4].statusCode.should.eql(401);

					(typeof requests[4].AccessTokenId).should.eql('object');
					((requests[4].AccessTokenId) === null).should.eql(true);

					(typeof requests[4].RefreshTokenId).should.eql('object');
					((requests[4].RefreshTokenId) === null).should.eql(true);

					(typeof requests[4].ClientId).should.eql('number');
					requests[4].ClientId.should.eql(1);

					(typeof requests[4].UserId).should.eql('object');
					((requests[4].UserId) === null).should.eql(true);

					var messages = JSON.parse(requests[4].messages);

					messages[0].should.eql('user authentication error');
					messages[1].should.eql('client auth accepted');
					done();
				});
			});
		});

	});


	it("should reject bad password credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: url,
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				},
				json: {
					grant_type: 'password',
					username: testUserName,
					password: badPassword,
					format: 'json'
				}
			}, function(err, res, body) {
				
				res.statusCode.should.eql(401);

				body.error.should.eql('invalid_client');
				body.error_description.should.eql('Wrong user password provided');
				// console.log(err);
				// console.log(body);
				resolve();
			});
		});

		promise.then(function() {
			new Promise(function(resolve, reject) {
				var promise = oauth20db.TokenRequest.findAll();
				promise.then(function(requests) {

					requests.length.should.eql(6);
					//remember we're on the third test now!!
					requests[5].remoteAddress.should.eql('127.0.0.1');
					requests[5].statusCode.should.eql(401);

					(typeof requests[5].AccessTokenId).should.eql('object');
					((requests[5].AccessTokenId) === null).should.eql(true);

					(typeof requests[5].RefreshTokenId).should.eql('object');
					((requests[5].RefreshTokenId) === null).should.eql(true);

					(typeof requests[5].ClientId).should.eql('number');
					requests[5].ClientId.should.eql(1);

					(typeof requests[5].UserId).should.eql('object');
					((requests[5].UserId) === null).should.eql(true);

					var messages = JSON.parse(requests[5].messages);

					messages[0].should.eql('user password error');
					messages[1].should.eql('client auth accepted');
					done();
				});
			});
		});

	});

	it("should login successfully and generate a token", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: url,
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				},
				json: {
					grant_type: 'password',
					username: testUserName,
					password: testPassword,
					format: 'json'
				}
			}, function(err, res, body) {
				console.log(body);
				// var json = JSON.parse(body);
				res.statusCode.should.eql(200);

				(typeof body.refresh_token).should.eql('string');
				refreshToken = body.refresh_token;

				(typeof body.access_token).should.eql('string');
				accessToken = body.access_token;

				body.token_type.should.eql('bearer');

				(typeof body.expires_in).should.eql('number');
				body.expires_in.should.eql(3600);
				resolve();
			});
		});

		promise.then(function() {
			new Promise(function(resolve, reject) {
				var promise = oauth20db.TokenRequest.findAll();
				promise.then(function(requests) {

					requests.length.should.eql(7);
					//remember we're on the third test now!!
					requests[6].remoteAddress.should.eql('127.0.0.1');
					requests[6].statusCode.should.eql(200);
					console.log(requests[6]);
					(typeof requests[6].AccessTokenId).should.eql('object');
					((requests[6].AccessTokenId) === accessToken).should.eql(true);

					(typeof requests[6].RefreshToken).should.eql('object');
					((requests[6].RefreshToken) === null).should.eql(true);

					(typeof requests[6].ClientId).should.eql('number');
					requests[6].ClientId.should.eql(1);

					(typeof requests[6].UserId).should.eql('number');
					requests[6].UserId.should.eql(1);

					var messages = JSON.parse(requests[5].messages);

					messages[0].should.eql('user password error');
					messages[1].should.eql('client auth accepted');
					resolve();
				});
			});
			done();
		});
	});
});