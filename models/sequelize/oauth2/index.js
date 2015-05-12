var memoryCrutch = '../../memory/oauth2/';
module.exports = {
    accessToken:    require('./accessToken.js'),
    client:         require('./client.js'),
    code:           require(memoryCrutch + './code.js'),
    refreshToken:   require('./refreshToken.js'),
    user:           require('./user.js')
};