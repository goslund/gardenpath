var crypto = require('crypto');
// refreshTokens = require('./../../data.js').refreshTokens;

module.exports.getUserId = function(refreshToken) {

    return refreshToken.userId;
};

module.exports.getClientId = function(refreshToken) {
    return refreshToken.clientId;
};

module.exports.fetchByToken = function(token, cb) {

    var promise = oauth20db.RefreshToken({
        where: {
            token: token
        }
    })

    promise.then(function(ret) {
        return cb(null,ret);    
    })
    
};

module.exports.removeByUserIdClientId = function(userId, clientId, cb) {
    // for (var i in refreshTokens) {
    //     if (refreshTokens[i].userId == userId && refreshTokens[i].clientId == clientId)
    //         refreshTokens.splice(i, 1);
    // }
    cb();
};

module.exports.create = function(userId, clientId, scope, cb) {
    var token = crypto.randomBytes(64).toString('hex');
    var obj = {
        token: token,
        userId: userId,
        clientId: clientId,
        scope: scope
    };
    var promise = oauth20db.RefreshToken.create(obj);

    promise.then(function(ret) {
        return cb(null, token);
    });
    // console.log(obj);
    // cb(null, token);
};