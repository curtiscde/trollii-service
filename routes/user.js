var authJwt = require('../auth/jwt.js');

var User = require('../models/user');

module.exports = function(apiRoutes){

    apiRoutes.get('/user/profile', authJwt.jwtCheck, function(req, res) {

        if (!req.isAuthenticated()){
            res.status(500).send({ code: 1, error: 'Not authorised' });
        }
        else{

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
                        res.status(500).send({code: 2, error: 'User not found'});
                    }
                }
            });

        }

    });

}