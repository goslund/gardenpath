var clients = require('./../../data.js').clients;

module.exports.getId = function(client) {
    return client.id;
};

module.exports.getRedirectUri = function(client) {
	// console.log("CLIENT!!", client);
    return client.redirectUri;
};

module.exports.fetchById = function(clientId, cb) {
	var client = oauth20db.Client.find({ where: {name: clientId}}).then(function(client) {
		if (client == null) {
			return cb();
		}
		return cb(null, client);
	});

    return client;
};

module.exports.checkSecret = function(client, secret, cb) {
    return cb(null, client.secret == secret);
};