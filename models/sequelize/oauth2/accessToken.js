var crypto = require('crypto');
// accessTokens = require('./../../data.js').accessTokens;

module.exports.getToken = function(accessToken) {
    
    return accessToken.id;
};

module.exports.create = function(userId, clientId, scope, ttl, cb) {
    var accessToken = crypto.randomBytes(64).toString('hex');

    var obj = {
        token: accessToken,
        UserId: userId,
        ClientId: clientId,
        // tokenType: 'bearer',
        ttl: new Date().getTime() + ttl * 1000
    };

    // console.log(obj);

    var promise = oauth20db.AccessToken.create(obj);

    promise.then(function(ret) {
        return cb(null, accessToken);
    })


    
};

module.exports.fetchByToken = function(token, cb) {
    var promise = oauth20db.AccessToken.findOne({where: {
        token: token
    }});

    promise.then(function(ret) {
        // console.log(ret);
        if(ret) {
            return cb(null, ret);        
        }
        return cb();
        
    })
    
};

module.exports.checkTTL = function(accessToken) {
    console.log(accessToken.ttl);
    return (accessToken.ttl > new Date().getTime());
};

module.exports.fetchByUserIdClientId = function(userId, clientId, cb) {
    for (var i in accessTokens) {
        if (accessTokens[i].userId == userId && accessTokens[i].clientId == clientId) return cb(null, accessTokens[i]);
    };
    cb();
};