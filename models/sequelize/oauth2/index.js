var memoryCrutch = '../../memory/oauth2/';
var obj = {
    accessToken:    require('./accessToken.js'),
    client:         require('./client.js'),
    code:           require(memoryCrutch + './code.js'),
    refreshToken:   require('./refreshToken.js'),
    user:           require('./user.js')
};

module.exports = obj;