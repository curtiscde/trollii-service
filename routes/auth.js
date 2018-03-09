module.exports = function(app, passport){

    app.post('/api/auth/signup', function(req, res, next) {
        
        passport.authenticate('local-signup', function(err, user, info){

            if (err) { return next(err); }
            if (!user) { return res.status(500).send(''); }

            // req / res held in closure
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.send(user);
            });
        })(req, res, next);

    });

    app.post('/api/auth/login', passport.authenticate('local-login', {
        successRedirect : '/api/auth/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/api/auth/logout', function(req, res) {
        req.logout();
        res.send(true);
	});

    app.get('/api/auth/profile', function(req, res) {
        if (!req.user){
            res.status(500).send('Not logged in');
        }
        res.send(req.user);
    });
    
    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    app.get('/api/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/api/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));
    
};