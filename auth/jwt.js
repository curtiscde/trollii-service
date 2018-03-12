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
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
    }
});

module.exports = {
    jwtCheck
};