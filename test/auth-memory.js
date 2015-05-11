require(__dirname + '/../app.js');
// require(__dirname + '/../../015-osgd/testdata.js');
var should = require('chai').should();
var http = require('http');
var request = require('request');

describe("In Memory Auth Tests", function() {
	var testUserName = "geoff";
	var testPassword = "testpassword";
	var clientId = "testId";
	var clientSecret = 'Test Secret';
	var badAuthString = new Buffer("Basic test:test").toString('base64');
	var basicAuthString = new Buffer(clientId + ":" + clientSecret).toString('base64');
	var badUserName = "admin";
	var badPassword = "admin";
	var bearerToken = '';

	before(function() {
		this.timeout(8000);
		return server.sync();

		// return app.sync();
	});

	it("should reject bad client credentials", function(done) {
		request.post({
			url: 'http://localhost:3080/token',
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

			json.error.should.eql('invalid_client');
			json.error_description.should.eql('Client not found');

			done();
		});
	});

	it("should reject bad username credentials", function(done) {

		request.post({
			url: 'http://localhost:3080/token',
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

			json.error.should.eql('invalid_client');
			json.error_description.should.eql('User not found');
			// console.log(err);
			// console.log(body);
			done();
		});
	});

	it("should reject bad password credentials", function(done) {
		request.post({
			url: 'http://localhost:3080/token',
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

			json.error.should.eql('invalid_client');
			json.error_description.should.eql('Wrong user password provided');
			done();
		});
	});

	it("should generate a token", function(done) {
		request.post({
			url: 'http://localhost:3080/token',
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
			// console.log(body);
			(typeof json.refresh_token).should.eql('string');
			bearerToken = body.refresh;

			json.token_type.should.eql('bearer');
			(typeof json.access_token).should.eql('string');
			(typeof json.expires_in).should.eql('number');
			json.expires_in.should.eql(3600);
			res.statusCode.should.eql(200);
			done();
		});
	});
});