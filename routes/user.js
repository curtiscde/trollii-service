var authJwt = require('../auth/jwt.js');

module.exports = function(apiRoutes){

    apiRoutes.get('/user/profile', authJwt.jwtCheck, function(req, res) {

        if (!req.isAuthenticated()){
            res.send({
                authenticated: false
            });
        }
        else{

            res.send({
                authenticated: true
            })

        }

    });

}