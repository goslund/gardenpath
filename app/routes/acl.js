server.get('/api', function(req, res, next) {
	req.oauth2 = oauth2;
	next();
});

server.get('/api', oauth2.middleware.bearer, function(req, res, next) {

	next();
});

acl.allow('api', 'api', 'view');

server.get('/api/Users', function(req, res, next) {
	// console.log(req.oauth2);
	var _send = res.send;
	req.oauth2 = oauth2;

	res.send = function(result) {
		// console.log(this);
		_send.call(this, result);
	}
	next();
});


server.get('/api/Users', oauth2.middleware.bearer, function(req, res, next) {
	// console.log(req.oauth2);
	next();
});

server.get('/api/Users', function(req, res, next) {
	console.log(req.oauth2.accessToken.UserId);
	req.session = {};
	req.session.UserId = req.oauth2.accessToken.UserId;


	var _end = res.end;

	// req.oauth2 = oauth2;
	res.end = function(result) {
		var _this = this;
		// console.log(req.session);	
		var _result = result;
		acl.addUserRoles(req.session.UserId, 'api').then(
			function() {
				// console.log("result!!!!", _result);
				_end.call(_this, result);
			});
		// acl.addUserRoles(req, 'blogs', 'view')

	}
	next();
});

server.get('/api/Users', acl.middleware());