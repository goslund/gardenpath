var router = express.Router();

function isUserAuthorized(req, res, next) {
    if (req.session.authorized) next();
    else {
        var params = req.query;
        params.backUrl = req.path;
        res.redirect('/login?' + query.stringify(params));
    }
}

function scrapeUserInfo(req) {
    var message = {};
    var promise = oauth20db.User.find({
        where: {
            username: req.body.username
        }
    }).then(
        function(res) {
            if (res) {
                if (res.verifyPassword(req.body.password)) {
                    message.status = 'success';
                    message.message = 'user logged in';
                    message.user = res;
                } else {
                    message.status = 'error';
                    message.message = 'user password error';
                    message.user = null;
                }
            } else {
                message.status = 'error';
                message.message = 'user authentication error';
                message.user = null;
            }
            return message;
        });
    return promise;
}

function scrapeClientInfo(req) {
        var split = [];
        var message = {};
        var client;
        var promise = new Promise(function(resolve, reject) {
            if (typeof req.headers.authorization !== 'undefined') {
                split = req.headers.authorization.split(' ', 2);
                // console.log("split", split);
                if (split.length != 2) {
                    message = {
                        client: null,
                        status: 'error',
                        message: 'auth header corrupted'
                    };
                    resolve(message);
                    return message;
                } else {
                    //expect client info..
                    switch (split[0]) {
                        case "Basic":
                            // console.log(split[1]);
                            var infoSplit = new Buffer(split[1], 'base64').toString('utf-8').split(':', 2);
                            // console.log(infoSplit.length);
                            if (infoSplit.length != 2) {
                                // console.log('here');
                                message = {
                                    client: null,
                                    status: 'error',
                                    message: 'auth header corrupted'
                                };
                                resolve(message);
                            } else {
                                // console.log(infoSplit[0]);
                                oauth20db.Client.findOne({
                                    where: {
                                        name: infoSplit[0],
                                        secret: infoSplit[1]
                                    }
                                }).then(
                                    function(res) {
                                        // console.log("res", res);
                                        if (res === null) {
                                            message = {
                                                client: null,
                                                status: 'error',
                                                message: 'client auth denied'
                                            };
                                        } else {
                                            message = {
                                                client: res,
                                                status: 'success',
                                                message: 'client auth accepted'
                                            };
                                        }
                                        resolve(message);
                                    },
                                    function(res) {
                                        // console.log("Error!!", res);
                                        return res;
                                    }
                                );
                            }
                            break;
                        default:
                            //
                    }
                }
            } else {
                message = {
                    client: null,
                    status: 'error',
                    message: 'auth header not provided'
                };
                resolve(message);
            }
        });
        return promise;
    }
    // Define OAuth2 Authorization Endpoint
server.get('/authorization', isUserAuthorized, oauth2.controller.authorization, function(req, res) {
    res.render('authorization', {
        layout: false
    });
});
server.post('/authorization', isUserAuthorized, oauth2.controller.authorization);

// Define OAuth2 Token Endpoint
server.post('/token', function(req, res, next) {
    var _send = res.send;
    req.oauth2 = oauth2;



    res.send = function(result) {

        var defers = 2;
        var _this = this;
        var userId = null;
        var clientId = null;
        var accessTokenId = null;
        var refreshTokenId = null;
        var promises = [];
        var accessTokenId = null;
        var refreshTokenId = null;

        promises.push(
            scrapeUserInfo(req).then(function(user) {
                if (user) {
                    userId = user.user.id
                }
                return null;
            })
        );

        promises.push(
            scrapeClientInfo(req).then(function(client) {
                if (client) {
                    clientId = client.client.id;
                }
                return null;

            })
        );

        //if user and client passed their respective things, a token was generated in the response


        Promise.all(promises).then(function(data) {
            var next_promises = [];
            var resultJSON = result;

            if (typeof result === 'string') {
                resultJSON = JSON.parse(result);
            };


            // console.log("res", JSON.parse(result));
            if (userId !== null && clientId !== null) {
                next_promises.push(
                    oauth20db.AccessToken.find({
                        where: {
                            token: resultJSON.access_token
                        }
                    }).then(function(accessToken) {
                        console.log(accessToken.id);
                        accessTokenId = accessToken.id;
                    }));

                next_promises.push(
                    oauth20db.RefreshToken.find({
                        where: {
                            token: resultJSON.refresh_token
                        }
                    }).then(function(refreshToken) {
                        refreshTokenId = refreshToken.id;
                    }))
            }

            return Promise.all(next_promises);


            //do more stuff
        }).then(function() {
            var obj = {
                AccessTokenId: accessTokenId,
                refreshTokenId: refreshTokenId,
                UserId: userId,
                ClientId: clientId,
            }
            console.log(obj);
            // oauth20db.TokenRequest
            _send.call(_this, result);
        });
        // user.then(function(data) {
        //     if ((typeof data) == 'object' && data != null) {
        //         userId = data.id;
        //     }

        //     return data.id


        // }).then(function() {

        // })


    }
    next();
})

server.use('/token', oauth2.controller.token);


// Define user login routes
server.get('/login', function(req, res) {
    res.render('login', {
        layout: false
    });
});
server.post('/login', function(req, res, next) {
    var backUrl = req.query.backUrl ? req.query.backUrl : '/';
    delete(req.query.backUrl);
    backUrl += backUrl.indexOf('?') > -1 ? '&' : '?';
    backUrl += query.stringify(req.query);
    // Already logged in
    if (req.session.authorized) res.redirect(backUrl);
    // Trying to log in
    else if (req.body.username && req.body.password) {
        model.oauth2.user.fetchByUsername(req.body.username, function(err, user) {
            if (err) next(err);
            else if (!user) {
                res.status(401);
                res.send("Unauthorized");
            } else {
                // console.log(user);
                // console.log(req.body.password);
                model.oauth2.user.checkPassword(user, req.body.password, function(err, valid) {
                    if (err) next(err);
                    else if (!valid) {
                        res.status(401);
                        res.send("Unauthorized");
                    } else {
                        req.session.user = user;
                        req.session.authorized = true;
                        res.status(200);
                        res.send();
                    }
                });
            }
        });
    }
    // Please login
    else res.redirect(req.url);
});
// Some secure method
server.get('/secure', oauth2.middleware.bearer, function(req, res) {
    if (!req.oauth2.accessToken) return res.status(403).send('Forbidden');
    if (!req.oauth2.accessToken.userId) return res.status(403).send('Forbidden');
    res.send('Hi! Dear user ' + req.oauth2.accessToken.userId + '!');
});
// Some secure client method
server.get('/client', oauth2.middleware.bearer, function(req, res) {
    if (!req.oauth2.accessToken) return res.status(403).send('Forbidden');
    res.send('Hi! Dear client ' + req.oauth2.accessToken.clientId + '!');
});
// Expose functions