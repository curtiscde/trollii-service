var requestPromise = require('request-promise');

let getAccessToken = (callback) => {

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
            console.log('err', err);
          }
          else{
            callback(response.access_token);
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