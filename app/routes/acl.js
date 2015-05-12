server.get('/api',oauth20.middleware.bearer, function(req, res, next) {
    // console.log("AUTH");
    // console.log(req.query);
    next();
    // next(req, res);
});


