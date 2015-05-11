module.exports.getId = function(user) {
    return user.id;
};

module.exports.fetchById = function(id, cb) {

    for (var i in users) {
        if (id == users[i].id) return cb(null, users[i]);
    };
    cb();
};

module.exports.fetchByUsername = function(username, cb) {
    oauth20db.User.find({where: {username: username}}).then(function(user) {
        cb(null, user);
    });
};

module.exports.checkPassword = function(user, password, cb) {
    if(user.verifyPassword(password)) {
      cb(null,true);  
    } else {
        cb(null, false);
    };

    // (user.password == password) ? cb(null, true) : cb(null, false);
};

module.exports.fetchFromRequest = function(req) {
    return req.session.user;
};