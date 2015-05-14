module.exports.fetchFromAccessToken = function(token, cb) {
    console.log(token);

};

module.exports.getId = function(user) {

    return user.id;
};

module.exports.fetchById = function(id, cb) {

    oauth20db.User.findOne({
        where: {
            id: id
        }
    }).then(function(user) {
        console.log(user);
        return cb(null,user);
    });
    cb();
};

module.exports.fetchByUsername = function(username, cb) {
    oauth20db.User.find({
        where: {
            username: username
        }
    }).then(function(user) {
        cb(null, user);
    });
};

module.exports.checkPassword = function(user, password, cb) {
    if (user.verifyPassword(password)) {
        cb(null, true);
    } else {
        cb(null, false);
    };

    // (user.password == password) ? cb(null, true) : cb(null, false);
};

module.exports.fetchFromRequest = function(req) {
    return req.session.user;
};

