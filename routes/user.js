var authJwt = require('../auth/jwt.js');

var User = require('../models/user');

module.exports = function(apiRoutes){

    apiRoutes.get('/user', authJwt.jwtCheck, function(req, res) {

        let userid = req.user.sub;

        User.find((err, users) => {
            if (err){
                res.status(500).send({code: 99, error: 'Unknown error'});
            }
            else{
                let user = users.find(user => user.userid === userid);
                if (user){
                    res.json(user);    
                }
                else {
                    res.json();
                }
            }
        });

    });

    apiRoutes.post('/user', authJwt.jwtCheck, (req, res) => {

        let userid = req.user.sub;
        let displayName = req.body.displayname;

        if (!displayName){
            res.status(500).send({code: 1, error: 'Missing fields'});
        }
        else{

            User.find((err, users) => {
                if (err){
                    res.status(500).send({code: 99, error: 'Unknown error'});
                }
                else{
                    let existingUser = users.find(user => user.userid === userid);
                    if (!existingUser){
                        //Create new user profile
                        User.create({
                            userid: userid,
                            displayname: displayName
                        }, (err, user) => {
                            if (err)
                                res.send(err);

                            res.json(user);
                        });

                    }
                    else {
                        //Update existing user profile
                        existingUser.displayname = displayName;
                        existingUser.save();
                        res.json(existingUser);
                    }
                }
            });

        }

    });

}