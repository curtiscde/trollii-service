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

    app.post('/api/auth/login', passport.authenticate('local-login', {
        successRedirect : '/api/auth/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/api/auth/profile', function(req, res) {
		// res.render('profile.ejs', {
		// 	user : req.user // get the user out of session and pass to template
        // });
        console.log(req.isAuthenticated());
        res.send(req.user);
	});
    
};