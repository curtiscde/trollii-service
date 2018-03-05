module.exports = function(app, passport){

    app.post('/api/auth/signup', function(req, res, next) {
        
        passport.authenticate('local-signup', function(err, user, info){

            if (err) { return next(err); }
            if (!user) { return res.redirect('/'); }

            // req / res held in closure
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.send(user);
            });
        })(req, res, next);

    });
    
};