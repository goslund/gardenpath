var should = require('chai').should();
var http = require('http');
var request = require('request');
describe("Staging Auth Tests", function() {
	var clientHost = '162.209.72.125',
		clientPort = 3080;
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

	it("should log no client credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: 'http://' + clientHost + ':' + clientPort + '/token'
			}, function(err, res, body) {
				var json = JSON.parse(body);
				// consol.log(body);
				json.error.should.eql('invalid_request');
				json.error_description.should.eql('No authorization header passed');
				// resolve();
				done();
			});

		});

	});

	it("should log corrupted client credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: 'http://' + clientHost + ':' + clientPort + '/token',
				headers: {
					'Authorization': 'Basic test:test'
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);
				// console.log(body);
				json.error.should.eql('invalid_request');
				json.error_description.should.eql('Authorization header has corrupted data');
				// resolve();
				done();
			});

		});
	});

	it("should log correct client credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: 'http://' + clientHost + ':' + clientPort + '/token',
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);

				json.error.should.eql('invalid_request');
				json.error_description.should.eql('Body does not contain grant_type parameter');
				done();
			});

		});
	});

	it("should log correct client credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: 'http://' + clientHost + ':' + clientPort + '/token',
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);

				json.error.should.eql('invalid_request');
				json.error_description.should.eql('Body does not contain grant_type parameter');
				done();
			});

		});
	});

	it("should reject bad client credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: 'http://' + clientHost + ':' + clientPort + '/token',
				headers: {
					'Authorization': 'Basic ' + badAuthString
				},
				form: {
					grant_type: 'password',
					username: badUserName,
					password: badPassword,
					format: 'json'
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);
				res.statusCode.should.eql(401);

				json.error.should.eql('invalid_client');
				json.error_description.should.eql('Client not found');

				done();
			});
		});
	});

	it("should reject bad username credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: 'http://' + clientHost + ':' + clientPort + '/token',
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				},
				form: {
					grant_type: 'password',
					username: badUserName,
					password: badPassword,
					format: 'json'
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);
				res.statusCode.should.eql(401);

				json.error.should.eql('invalid_client');
				json.error_description.should.eql('User not found');
				// console.log(err);
				// console.log(body);
				done();
			});
		});
	});

	it("should reject bad password credentials", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: 'http://' + clientHost + ':' + clientPort + '/token',
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				},
				form: {
					grant_type: 'password',
					username: testUserName,
					password: badPassword,
					format: 'json'
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);
				res.statusCode.should.eql(401);

				json.error.should.eql('invalid_client');
				json.error_description.should.eql('Wrong user password provided');
				// console.log(err);
				// console.log(body);
				done();
			});
		});
	});

	it("should login successfully and generate a token", function(done) {
		var promise = new Promise(function(resolve, reject) {
			request.post({
				url: 'http://' + clientHost + ':' + clientPort + '/token',
				headers: {
					'Authorization': 'Basic ' + basicAuthString
				},
				form: {
					grant_type: 'password',
					username: testUserName,
					password: testPassword,
					format: 'json'
				}
			}, function(err, res, body) {
				var json = JSON.parse(body);
				res.statusCode.should.eql(200);

				(typeof json.refresh_token).should.eql('string');
				refreshToken = json.refresh_token;

				(typeof json.access_token).should.eql('string');
				accessToken = json.access_token;

				json.token_type.should.eql('bearer');

				(typeof json.expires_in).should.eql('number');
				json.expires_in.should.eql(3600);
				done();
			});
		});
	});
});