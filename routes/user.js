var expressJwt = require('express-jwt');
var jwks = require('jwks-rsa');

var jwtCheck = expressJwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://curt.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://trollii.com/',
    issuer: "https://curt.auth0.com/",
    algorithms: ['RS256'],
    getToken: (req) => {
        return req.params.token;
    }
});


module.exports = function(apiRoutes){

    apiRoutes.get('/user/profile/:token', jwtCheck, function(req, res) {

        console.log(req.user);

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