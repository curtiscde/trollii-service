var requestPromise = require('request-promise');

let getAccessToken = (req, res, next) => {

    var AuthenticationClient = require('auth0').AuthenticationClient;

    var auth0 = new AuthenticationClient({
        domain: process.env.auth0Domain,
        clientId: process.env.auth0ClientId,
        clientSecret: process.env.auth0ClientSecret
    });

    auth0.clientCredentialsGrant(
        {
        audience: `https://${process.env.auth0Domain}/api/v2/`,
        scope: 'read:users'
        },
        function(err, response) {
        if (err) {
            res.status(500);
        }
        else{
            req.auth0AccessToken = response.access_token;
            return next();
        }
    });

}

let getUser = (accessToken, userid) => {
    return requestPromise({
        url: `https://${process.env.auth0Domain}/api/v2/users/${userid}`,
        headers: {
            'authorization': `Bearer ${accessToken}`
        }
    });
}

module.exports = {
    getAccessToken,
    getUser
}